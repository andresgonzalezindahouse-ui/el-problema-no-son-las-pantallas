/**
 * POST /api/capture-email
 *
 * — Sends Email 1 immediately
 * — Schedules Emails 2–5 with proper delays (requires verified Resend domain)
 * — Adds headers that help inbox placement (List-Unsubscribe, Reply-To)
 * — Includes plain-text version so Gmail doesn't flag as promotional
 *
 * Env vars required:
 *   RESEND_API_KEY
 *   FROM_EMAIL          verified domain address (e.g. andres@raisingwithsense.com)
 *   FROM_NAME           (e.g. Andrés González)
 *   RESEND_LEADS_ID     = 4c8803e8-b5cf-4bdb-85e0-12a63c6c6122
 *   SITE_URL            = https://raisingwithsense.com
 */

import { email1, email2, email3, email4, email5 } from './emails.js';

const RESEND_KEY = process.env.RESEND_API_KEY;
const LEADS_ID   = process.env.RESEND_LEADS_ID || '4c8803e8-b5cf-4bdb-85e0-12a63c6c6122';
const FROM_EMAIL = process.env.FROM_EMAIL || 'andres@raisingwithsense.com';
const FROM_NAME  = process.env.FROM_NAME  || 'Andrés González';
const FROM       = `${FROM_NAME} <${FROM_EMAIL}>`;
const SITE_URL   = process.env.SITE_URL   || 'https://raisingwithsense.com';

// ── Scheduling helpers ───────────────────────────────────────────
/** Returns ISO string N days from now, at 10:00 AM UTC */
function scheduleAt(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(10, 0, 0, 0); // send at 10:00 AM UTC (decent time for ES/LatAm)
  return d.toISOString();
}

// ── Resend API wrapper ───────────────────────────────────────────
async function resendPost(path, body) {
  const r = await fetch(`https://api.resend.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(`Resend ${path} → ${r.status}: ${JSON.stringify(data)}`);
  return data;
}

// ── Build email payload ──────────────────────────────────────────
function buildPayload(tpl, to, source, scheduledAt = null) {
  const unsubUrl = `${SITE_URL}/api/mark-as-buyer?e=${encodeURIComponent(to)}&unsub=1`;

  const payload = {
    from:     FROM,
    to:       [to],
    reply_to: FROM_EMAIL,
    subject:  tpl.subject,
    html:     tpl.html,
    text:     tpl.text || tpl.preheader || tpl.subject,

    // ── Inbox placement headers ─────────────────────────
    headers: {
      'List-Unsubscribe':       `<${unsubUrl}>`,
      'List-Unsubscribe-Post':  'List-Unsubscribe=One-Click',
      'X-Priority':             '3',
      'X-Mailer':               'Antigravity/1.0',
    },

    tags: [
      { name: 'source',   value: source },
      { name: 'sequence', value: scheduledAt ? 'followup' : 'immediate' },
    ],
  };

  if (scheduledAt) payload.scheduledAt = scheduledAt;
  return payload;
}

// ── Handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, source = 'landing_book' } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const to = email.toLowerCase().trim();

    // ── 1. Add contact to Leads audience ──────────────────────────
    try {
      await resendPost(`/audiences/${LEADS_ID}/contacts`, {
        email: to,
        unsubscribed: false,
      });
    } catch (e) {
      console.warn('[capture-email] add contact:', e.message);
    }

    // ── 2. Send Email 1 IMMEDIATELY ───────────────────────────────
    try {
      const tpl1 = email1(to);
      const r1 = await resendPost('/emails', buildPayload(tpl1, to, source));
      console.log('[capture-email] email 1 sent:', r1.id);
    } catch (e) {
      console.error('[capture-email] email 1 failed:', e.message);
      // Still return 200 to the user — don't block the reader
    }

    // ── 3. Schedule emails 2–5 ────────────────────────────────────
    // NOTE: scheduledAt requires a verified domain in Resend.
    // If your domain is not verified yet, these will be sent immediately
    // (which is why domain verification is required before go-live).
    const scheduled = [
      { fn: email2, days: 1  }, // t+1 day
      { fn: email3, days: 2  }, // t+2 days
      { fn: email4, days: 4  }, // t+4 days
      { fn: email5, days: 6  }, // t+6 days
    ];

    const results = await Promise.allSettled(
      scheduled.map(({ fn, days }) => {
        const tpl = fn(to);
        return resendPost('/emails', buildPayload(tpl, to, source, scheduleAt(days)));
      })
    );

    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        console.log(`[capture-email] email ${i + 2} scheduled (day +${scheduled[i].days}):`, r.value.id);
      } else {
        console.error(`[capture-email] email ${i + 2} failed:`, r.reason?.message);
      }
    });

    return res.status(200).json({ ok: true, email: to });

  } catch (err) {
    console.error('[capture-email] fatal:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

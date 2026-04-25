/**
 * POST /api/capture-email
 * Adds contact to Resend audience and sends 5-email sequence
 *
 * Env vars required:
 *   RESEND_API_KEY
 *   FROM_EMAIL          (e.g. andres@raisingwithsense.com)
 *   FROM_NAME           (e.g. Andrés González)
 *   RESEND_LEADS_ID     = 4c8803e8-b5cf-4bdb-85e0-12a63c6c6122
 */

import { email1, email2, email3, email4, email5 } from './emails.js';

const RESEND_KEY   = process.env.RESEND_API_KEY;
const LEADS_ID     = process.env.RESEND_LEADS_ID || '4c8803e8-b5cf-4bdb-85e0-12a63c6c6122';
const FROM_EMAIL   = process.env.FROM_EMAIL || 'andres@raisingwithsense.com';
const FROM_NAME    = process.env.FROM_NAME  || 'Andrés González';
const FROM         = `${FROM_NAME} <${FROM_EMAIL}>`;

// ── Helpers ─────────────────────────────────────────────────────
function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function resend(path, body) {
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

// ── Handler ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, source = 'landing_book', timestamp } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const to = email.toLowerCase().trim();

    // 1. Add contact to Leads audience
    try {
      await resend(`/audiences/${LEADS_ID}/contacts`, {
        email: to,
        unsubscribed: false,
      });
    } catch (e) {
      // Contact might already exist — log but don't block
      console.warn('[capture-email] add contact:', e.message);
    }

    // 2. Build email sequence (send all at once, Resend handles delivery timing)
    const templates = [
      { fn: email1, scheduledAt: null },           // immediate
      { fn: email2, scheduledAt: addDays(1) },     // t+1 day
      { fn: email3, scheduledAt: addDays(2) },     // t+2 days
      { fn: email4, scheduledAt: addDays(4) },     // t+4 days
      { fn: email5, scheduledAt: addDays(6) },     // t+6 days
    ];

    const results = await Promise.allSettled(
      templates.map(({ fn, scheduledAt }) => {
        const tpl = fn(to);
        const payload = {
          from: FROM,
          to: [to],
          subject: tpl.subject,
          html: tpl.html,
          tags: [{ name: 'source', value: source }],
        };
        if (scheduledAt) payload.scheduledAt = scheduledAt;
        return resend('/emails', payload);
      })
    );

    // Log failures (non-fatal)
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[capture-email] email ${i + 1} failed:`, r.reason);
      }
    });

    console.log(`[capture-email] ✓ ${to} — sequence scheduled`);
    return res.status(200).json({ ok: true, email: to });

  } catch (err) {
    console.error('[capture-email] fatal:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

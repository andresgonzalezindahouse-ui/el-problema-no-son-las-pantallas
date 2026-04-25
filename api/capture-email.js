/**
 * Vercel Serverless Function — /api/capture-email
 *
 * Captures email leads from the book preview gating system.
 *
 * Environment variables (all optional):
 *   EMAIL_WEBHOOK_URL   → Zapier / Make / n8n webhook URL
 *   RESEND_API_KEY      → Resend API key
 *   RESEND_AUDIENCE_ID  → Resend audience/list ID
 *
 * Email sequence structure (ready to activate):
 *   Email 1 (delay: 0h)  → "Ya empezaste. Ahora termina."
 *   Email 2 (delay: 24h) → "Lo que no viste en el capítulo"
 *   Email 3 (delay: 72h) → "Esto cambia cómo crías"
 */

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — allow same origin and preview deploys
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { email, source = 'landing_book', timestamp } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const lead = {
      email: email.toLowerCase().trim(),
      source,
      timestamp: timestamp || new Date().toISOString(),
      // Sequence structure — activate when ready
      sequences: [
        {
          id: 'seq_1',
          name: 'Ya empezaste. Ahora termina.',
          delay_hours: 0,
          active: false,
        },
        {
          id: 'seq_2',
          name: 'Lo que no viste en el capítulo',
          delay_hours: 24,
          active: false,
        },
        {
          id: 'seq_3',
          name: 'Esto cambia cómo crías',
          delay_hours: 72,
          active: false,
        },
      ],
    };

    const results = await Promise.allSettled([
      sendToWebhook(lead),
      addToResend(lead),
    ]);

    // Log any partial failures (non-fatal)
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`[capture-email] integration ${i} failed:`, r.reason);
      }
    });

    return res.status(200).json({ ok: true, email: lead.email });

  } catch (err) {
    console.error('[capture-email] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── Webhook (Zapier / Make / n8n) ──────────────────────────────
async function sendToWebhook(lead) {
  const url = process.env.EMAIL_WEBHOOK_URL;
  if (!url) return; // Not configured — skip silently

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });

  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

// ── Resend Audience ────────────────────────────────────────────
// Docs: https://resend.com/docs/api-reference/audiences/create-contact
async function addToResend(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return; // Not configured — skip silently

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: lead.email,
      unsubscribed: false,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend responded ${res.status}: ${body}`);
  }
}

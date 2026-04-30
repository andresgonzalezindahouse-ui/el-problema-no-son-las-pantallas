export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const LEADS_ID = process.env.RESEND_LEADS_ID || '4c8803e8-b5cf-4bdb-85e0-12a63c6c6122';

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const to = email.toLowerCase().trim();

    // Add contact to Leads audience
    const r = await fetch(`https://api.resend.com/audiences/${LEADS_ID}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: to,
        unsubscribed: false,
      }),
    });

    if (!r.ok) {
      const errorData = await r.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    return res.status(200).json({ ok: true, email: to });
  } catch (err) {
    console.error('[waitlist] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

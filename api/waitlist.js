export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const WAITLIST_ID = '6daf1ff9-0ebb-4d02-8d06-ac41a7c6bfbb';

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const to = email.toLowerCase().trim();

    // Add contact to Waitlist audience
    const r = await fetch(`https://api.resend.com/audiences/${WAITLIST_ID}/contacts`, {
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

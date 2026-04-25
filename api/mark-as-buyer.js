/**
 * GET /api/mark-as-buyer?e={email}&unsub=1
 *
 * "Ya lo compré" flow:
 *   1. Cancels all pending scheduled emails for this contact in Resend
 *   2. Adds contact to Compradores audience
 *   3. Marks contact as unsubscribed in Leads audience
 *   4. Redirects to /gracias (thank-you + review page)
 *
 * "Cancelar suscripción" flow (unsub=1):
 *   1. Marks as unsubscribed in Leads
 *   2. Cancels scheduled emails
 *   3. Redirects to home
 */

const RESEND_KEY      = process.env.RESEND_API_KEY;
const LEADS_ID        = process.env.RESEND_LEADS_ID        || '4c8803e8-b5cf-4bdb-85e0-12a63c6c6122';
const COMPRADORES_ID  = process.env.RESEND_COMPRADORES_ID  || '787f50ec-a360-464c-8588-25d9619cc5ba';
const SITE_URL        = process.env.SITE_URL               || 'https://raisingwithsense.com';

// ── Resend helpers ───────────────────────────────────────────────

async function updateContact(audienceId, email, unsubscribed) {
  const r = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed }),
  });
  return r.ok;
}

/**
 * List all scheduled emails in the account and cancel those addressed
 * to this recipient.  Resend's GET /emails returns up to 100 recent emails,
 * which is sufficient at launch scale.
 */
async function cancelScheduledEmails(recipientEmail) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      headers: { Authorization: `Bearer ${RESEND_KEY}` },
    });
    if (!r.ok) return 0;

    const { data } = await r.json();
    const pending = (data || []).filter(
      (e) =>
        Array.isArray(e.to) &&
        e.to.some((addr) => addr.toLowerCase() === recipientEmail) &&
        e.last_event === 'scheduled' &&
        e.scheduled_at !== null
    );

    await Promise.all(
      pending.map((e) =>
        fetch(`https://api.resend.com/emails/${e.id}/cancel`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_KEY}` },
        })
      )
    );

    console.log(`[mark-as-buyer] cancelled ${pending.length} scheduled email(s) for ${recipientEmail}`);
    return pending.length;
  } catch (err) {
    console.warn('[mark-as-buyer] cancelScheduledEmails error:', err.message);
    return 0;
  }
}

// ── Handler ─────────────────────────────────────────────────────

export default async function handler(req, res) {
  const { e: rawEmail, unsub } = req.query;
  const isUnsub = unsub === '1';

  if (!rawEmail) return res.redirect(302, SITE_URL);

  const email = decodeURIComponent(rawEmail).toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.redirect(302, SITE_URL);

  try {
    // Always cancel pending scheduled emails and unsubscribe from Leads
    await cancelScheduledEmails(email);
    await updateContact(LEADS_ID, email, true);

    if (isUnsub) {
      console.log(`[mark-as-buyer] unsubscribed: ${email}`);
      return res.redirect(302, `${SITE_URL}?unsub=1`);
    }

    // Buyer flow: add to Compradores
    await updateContact(COMPRADORES_ID, email, false);
    console.log(`[mark-as-buyer] buyer registered + sequence cancelled: ${email}`);

    // Redirect to thank-you page
    return res.redirect(302, `${SITE_URL}/gracias`);

  } catch (err) {
    console.error('[mark-as-buyer] error:', err);
    // Still redirect to gracias on error — don't leave the user stuck
    return res.redirect(302, isUnsub ? SITE_URL : `${SITE_URL}/gracias`);
  }
}

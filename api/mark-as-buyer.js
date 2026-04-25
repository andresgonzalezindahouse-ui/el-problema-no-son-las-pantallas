/**
 * GET /api/mark-as-buyer?e=email&unsub=1
 *
 * Called when user clicks "Ya lo compré" in any email.
 * - Adds contact to Compradores audience
 * - Marks contact as unsubscribed in Leads audience (stops future sends)
 * - Redirects to thank-you page (or unsub confirmation if unsub=1)
 *
 * Env vars:
 *   RESEND_API_KEY
 *   RESEND_LEADS_ID       = 4c8803e8-b5cf-4bdb-85e0-12a63c6c6122
 *   RESEND_COMPRADORES_ID = 787f50ec-a360-464c-8588-25d9619cc5ba
 *   AMAZON_URL            (main purchase link for redirect)
 */

const RESEND_KEY       = process.env.RESEND_API_KEY;
const LEADS_ID         = process.env.RESEND_LEADS_ID         || '4c8803e8-b5cf-4bdb-85e0-12a63c6c6122';
const COMPRADORES_ID   = process.env.RESEND_COMPRADORES_ID   || '787f50ec-a360-464c-8588-25d9619cc5ba';
const AMAZON_URL       = process.env.AMAZON_URL              || 'https://www.amazon.com';
const SITE_URL         = 'https://raisingwithsense.com';

async function resendUpdate(audienceId, email, unsubscribed) {
  const r = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed }),
  });
  return r.ok;
}

export default async function handler(req, res) {
  const { e: rawEmail, unsub } = req.query;
  const isUnsub = unsub === '1';

  if (!rawEmail) {
    return res.redirect(302, SITE_URL);
  }

  const email = decodeURIComponent(rawEmail).toLowerCase().trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.redirect(302, SITE_URL);
  }

  try {
    if (isUnsub) {
      // Pure unsubscribe — mark as unsubscribed in Leads audience
      await resendUpdate(LEADS_ID, email, true);
      console.log(`[mark-as-buyer] unsubscribed: ${email}`);
      return res.redirect(302, `${SITE_URL}?unsub=1`);
    }

    // "Ya lo compré" flow:
    // 1. Add to Compradores audience
    await resendUpdate(COMPRADORES_ID, email, false);

    // 2. Unsubscribe from Leads sequence (stops pending scheduled emails)
    await resendUpdate(LEADS_ID, email, true);

    console.log(`[mark-as-buyer] buyer registered: ${email}`);

    // 3. Redirect to Amazon (main purchase link)
    return res.redirect(302, AMAZON_URL);

  } catch (err) {
    console.error('[mark-as-buyer] error:', err);
    return res.redirect(302, AMAZON_URL);
  }
}

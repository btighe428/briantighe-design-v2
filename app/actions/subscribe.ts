'use server';

export type SubscribeState = {
  ok: boolean;
  message: string;
} | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const source = String(formData.get('source') ?? 'unknown');

  if (!email) {
    return { ok: false, message: 'Email is required.' };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, message: 'That email does not look right.' };
  }

  const entry = { email, source, ts: new Date().toISOString() };
  console.log('[NEWSLETTER_SUBSCRIBE]', JSON.stringify(entry));

  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (resendKey && audienceId) {
    try {
      const res = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        },
      );
      if (!res.ok && res.status !== 409) {
        console.error('[NEWSLETTER_RESEND_FAIL]', res.status, await res.text());
      }
    } catch (err) {
      console.error('[NEWSLETTER_RESEND_ERROR]', err);
    }
  }

  return {
    ok: true,
    message: 'Subscribed. A confirmation will arrive only if the email provider is wired; otherwise Brian will see you in the logs and reach out.',
  };
}

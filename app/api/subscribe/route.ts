import { Resend } from 'resend';
import { siteConfig } from '@/lib/site-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readEmail(req: Request): Promise<string | null> {
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const body = (await req.json().catch(() => null)) as
      | { email?: unknown }
      | null;
    return typeof body?.email === 'string' ? body.email : null;
  }
  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const form = await req.formData();
    const value = form.get('email');
    return typeof value === 'string' ? value : null;
  }
  return null;
}

function wantsJson(req: Request): boolean {
  const accept = req.headers.get('accept') ?? '';
  return accept.includes('application/json');
}

function respond(
  req: Request,
  status: number,
  message: string,
  ok: boolean,
): Response {
  if (wantsJson(req)) {
    return Response.json({ ok, message }, { status });
  }
  const url = new URL(req.url);
  const redirect = new URL('/about', url.origin);
  redirect.searchParams.set('subscribe', ok ? 'ok' : 'error');
  if (!ok) redirect.searchParams.set('message', message);
  return Response.redirect(redirect.toString(), 303);
}

export async function POST(req: Request) {
  const email = (await readEmail(req))?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return respond(req, 400, 'Invalid email.', false);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey) {
    return respond(req, 500, 'Newsletter not configured.', false);
  }

  try {
    const resend = new Resend(apiKey);

    if (audienceId) {
      const result = await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
      if (result.error && result.error.name !== 'validation_error') {
        // validation_error typically means duplicate — treat as success
        throw new Error(result.error.message);
      }
    }

    await resend.emails.send({
      from: `${siteConfig.newsletter.fromName} <${siteConfig.newsletter.fromEmail}>`,
      to: email,
      subject: 'Subscribed — briantighe.design',
      text: `You're on the list for briantighe.design.\n\nA new essay ships every Monday. No tracking beyond Vercel.\n\nReply to this email any time. To unsubscribe, reply with "unsubscribe" in the body.\n\n— Brian`,
    });

    return respond(req, 200, 'Subscribed.', true);
  } catch (err) {
    console.error('[subscribe]', err);
    return respond(req, 500, 'Could not subscribe right now.', false);
  }
}

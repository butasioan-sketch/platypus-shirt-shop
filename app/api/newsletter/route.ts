import { NextRequest, NextResponse } from 'next/server';
import { addNewsletterSubscriber, confirmNewsletterSubscriber, initDb } from '@/lib/db';

let initialized = false;
async function ensureInit() {
  if (!initialized) { await initDb(); initialized = true; }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendConfirmationEmail(email: string, token: string, locale: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';
  const confirmUrl = `${siteUrl}/api/newsletter?action=confirm&token=${token}`;

  const copy: Record<string, { subject: string; title: string; body: string; btn: string; footer: string }> = {
    de: {
      subject: 'PLATYPUS — Bestätige deine Anmeldung',
      title: 'Fast geschafft!',
      body: 'Klicke auf den Button, um deine Newsletter-Anmeldung zu bestätigen. Der Link ist 48 Stunden gültig.',
      btn: 'Jetzt bestätigen',
      footer: 'Du erhältst diese E-Mail, weil du dich auf platypus-shirt-shop.vercel.app angemeldet hast.',
    },
    ro: {
      subject: 'PLATYPUS — Confirmă înscrierea la newsletter',
      title: 'Aproape gata!',
      body: 'Apasă butonul pentru a confirma înscrierea la newsletter. Link-ul este valabil 48 de ore.',
      btn: 'Confirmă acum',
      footer: 'Ai primit acest email deoarece te-ai înscris pe platypus-shirt-shop.vercel.app.',
    },
    en: {
      subject: 'PLATYPUS — Confirm your newsletter signup',
      title: 'Almost there!',
      body: 'Click the button below to confirm your newsletter subscription. The link expires in 48 hours.',
      btn: 'Confirm now',
      footer: 'You received this because you signed up at platypus-shirt-shop.vercel.app.',
    },
  };
  const t = copy[locale] || copy.de;

  const html = `
  <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
    <p style="font-size:13px;letter-spacing:0.2em;color:#e2001a;margin-bottom:8px;font-weight:700">PLATYPUS</p>
    <h1 style="font-size:22px;font-weight:900;margin-bottom:12px;letter-spacing:-0.02em">${t.title}</h1>
    <p style="color:#888;margin-bottom:28px;line-height:1.6">${t.body}</p>
    <a href="${confirmUrl}" style="display:inline-block;background:#e2001a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px;margin-bottom:28px">
      ${t.btn}
    </a>
    <p style="color:#444;font-size:12px;line-height:1.6;margin-top:24px">${t.footer}</p>
  </div>`;

  if (!apiKey) {
    console.log('[newsletter] Confirmation (demo):', confirmUrl);
    return;
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PLATYPUS <onboarding@resend.dev>',
      to: email,
      subject: t.subject,
      html,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    await ensureInit();
    const { email, locale = 'de' } = await request.json();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const result = await addNewsletterSubscriber(email.toLowerCase(), token, locale);

    if (result === 'exists') {
      return NextResponse.json({ status: 'exists' });
    }

    await sendConfirmationEmail(email, token, locale);
    return NextResponse.json({ status: 'pending' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await ensureInit();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const token = searchParams.get('token');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';

  if (action === 'confirm' && token) {
    const ok = await confirmNewsletterSubscriber(token);
    return NextResponse.redirect(`${siteUrl}/newsletter/confirm?success=${ok ? '1' : '0'}`);
  }

  return NextResponse.json({ error: 'not_found' }, { status: 404 });
}

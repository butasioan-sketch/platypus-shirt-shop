import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';
  const start = Date.now();

  try {
    const [homeRes, apiRes] = await Promise.all([
      fetch(siteUrl, { method: 'HEAD' }),
      fetch(`${siteUrl}/api/orders?id=health-check`, { method: 'GET' }),
    ]);

    const ms = Date.now() - start;
    const homeOk = homeRes.ok || homeRes.status === 404;
    const apiOk = apiRes.status < 500;

    if (!homeOk || !apiOk) {
      await sendAlert(siteUrl, { homeStatus: homeRes.status, apiStatus: apiRes.status, ms });
    }

    return NextResponse.json({
      ok: homeOk && apiOk,
      home: homeRes.status,
      api: apiRes.status,
      ms,
      ts: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    await sendAlert(siteUrl, { error: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

async function sendAlert(siteUrl: string, details: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error('[health-cron] DOWN:', details); return; }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'PLATYPUS <onboarding@resend.dev>',
      to: 'butasioan@googlemail.com',
      subject: `⚠ PLATYPUS DOWN — ${new Date().toISOString()}`,
      html: `<p style="font-family:monospace">Site or API unresponsive.<br/><br/>${JSON.stringify(details, null, 2).replace(/\n/g, '<br/>')}<br/><br/><a href="${siteUrl}">${siteUrl}</a></p>`,
    }),
  }).catch(console.error);
}

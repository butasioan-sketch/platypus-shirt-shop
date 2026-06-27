import { NextRequest, NextResponse } from 'next/server';

const EMAIL_TEMPLATES: Record<string, (data: OrderEmailData) => { subject: string; html: string }> = {
  de: (d) => ({
    subject: `PLATYPUS — Bestellbestätigung ${d.orderId}`,
    html: buildHtml('Danke für deine Bestellung!', 'Deine Bestellung wurde erfolgreich aufgegeben.', d, 'Produktion startet innerhalb von 24 Stunden.'),
  }),
  ro: (d) => ({
    subject: `PLATYPUS — Confirmare comandă ${d.orderId}`,
    html: buildHtml('Mulțumim pentru comandă!', 'Comanda ta a fost plasată cu succes.', d, 'Producția începe în 24 de ore.'),
  }),
  en: (d) => ({
    subject: `PLATYPUS — Order Confirmation ${d.orderId}`,
    html: buildHtml('Thank you for your order!', 'Your order has been placed successfully.', d, 'Production starts within 24 hours.'),
  }),
};

interface OrderEmailData {
  orderId: string;
  email: string;
  total: number;
  items: { name: string; size: string; quantity: number; price: number }[];
  locale: string;
}

function buildHtml(title: string, intro: string, d: OrderEmailData, footer: string): string {
  const itemRows = d.items.map(i =>
    `<tr><td style="padding:8px 0;color:#888">${i.quantity}× ${i.name} (${i.size})</td><td style="padding:8px 0;text-align:right">€${(i.price * i.quantity).toFixed(2)}</td></tr>`
  ).join('');

  return `
  <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
    <h1 style="font-size:24px;letter-spacing:0.15em;margin-bottom:32px">PLATYPUS</h1>
    <h2 style="font-size:20px;margin-bottom:8px">${title}</h2>
    <p style="color:#888;margin-bottom:24px">${intro}</p>
    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#555;font-size:12px;margin-bottom:12px">Order ${d.orderId}</p>
      <table style="width:100%;border-collapse:collapse">${itemRows}</table>
      <div style="border-top:1px solid #222;margin-top:12px;padding-top:12px;display:flex;justify-content:space-between">
        <strong>Total</strong><strong>€${d.total.toFixed(2)}</strong>
      </div>
    </div>
    <p style="color:#555;font-size:13px">${footer}</p>
  </div>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: OrderEmailData = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    const template = (EMAIL_TEMPLATES[data.locale] || EMAIL_TEMPLATES.de)(data);

    if (!apiKey) {
      console.log('E-Mail (Demo):', template.subject, '→', data.email);
      return NextResponse.json({ sent: false, demo: true, subject: template.subject });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PLATYPUS <onboarding@resend.dev>',
        to: data.email,
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ sent: false, error: 'Resend Fehler' });
    }

    return NextResponse.json({ sent: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fehler';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

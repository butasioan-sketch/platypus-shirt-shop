import { NextRequest, NextResponse } from 'next/server';

const STATUS_TEXTS: Record<string, Record<string, { subject: string; title: string; body: string }>> = {
  production: {
    de: { subject: 'Deine Bestellung ist in Produktion', title: 'Es geht los!', body: 'Dein Shirt wird jetzt bedruckt. Wir melden uns, sobald es versendet wird.' },
    ro: { subject: 'Comanda ta este în producție', title: 'Am început!', body: 'Tricoul tău este acum imprimat. Te anunțăm când va fi expediat.' },
    en: { subject: 'Your order is in production', title: 'Here we go!', body: 'Your shirt is being printed now. We will let you know once it ships.' },
  },
  shipped: {
    de: { subject: 'Deine Bestellung ist unterwegs', title: 'Versendet!', body: 'Dein Paket ist auf dem Weg zu dir. Den Status kannst du jederzeit verfolgen.' },
    ro: { subject: 'Comanda ta este pe drum', title: 'Expediat!', body: 'Pachetul tău este în drum spre tine. Poți urmări statusul oricând.' },
    en: { subject: 'Your order is on its way', title: 'Shipped!', body: 'Your package is on its way. You can track the status anytime.' },
  },
  delivered: {
    de: { subject: 'Deine Bestellung wurde zugestellt', title: 'Angekommen!', body: 'Dein Shirt wurde zugestellt. Viel Freude damit — words are not just words.<br/><br/>Wie war deine Erfahrung? Deine Meinung hilft anderen.' },
    ro: { subject: 'Comanda ta a fost livrată', title: 'A ajuns!', body: 'Tricoul tău a fost livrat. Bucură-te de el — words are not just words.<br/><br/>Cum a fost experiența ta? Părerea ta îi ajută pe alții.' },
    en: { subject: 'Your order was delivered', title: 'Delivered!', body: 'Your shirt has been delivered. Enjoy it — words are not just words.<br/><br/>How was your experience? Your review helps others.' },
  },
};

function buildStatusHtml(title: string, body: string, orderId: string, isDelivered = false): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';
  const reviewCta = isDelivered ? `
    <a href="${siteUrl}/bewertungen" style="display:inline-block;background:#e2001a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px;margin-bottom:20px">
      Bewertung schreiben / Leave a review
    </a><br/>` : '';
  return `
  <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
    <p style="font-size:13px;letter-spacing:0.2em;color:#e2001a;margin-bottom:8px;font-weight:700">PLATYPUS</p>
    <h1 style="font-size:22px;font-weight:900;margin-bottom:8px;letter-spacing:-0.02em">${title}</h1>
    <p style="color:#888;margin-bottom:28px;line-height:1.6">${body}</p>
    ${reviewCta}
    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px 20px;margin-bottom:24px">
      <p style="color:#555;font-size:11px;margin:0 0 4px;letter-spacing:0.1em;text-transform:uppercase">Bestellnummer</p>
      <p style="color:#ccc;font-size:14px;font-weight:600;margin:0">${orderId}</p>
    </div>
    <p style="color:#444;font-size:12px;line-height:1.6">
      <a href="${siteUrl}/tracking" style="color:#888;text-decoration:none">Sendungsverfolgung</a>
      &nbsp;·&nbsp;
      <a href="mailto:butasioan@googlemail.com" style="color:#888;text-decoration:none">Kontakt</a>
    </p>
  </div>`;
}

function buildConfirmationEmail(d: OrderEmailData, designPreview: string) {
  const templates: Record<string, { subject: string; title: string; intro: string; footer: string }> = {
    de: { subject: `PLATYPUS — Bestellbestätigung ${d.orderId}`, title: 'Danke für deine Bestellung!', intro: 'Deine Bestellung wurde erfolgreich aufgegeben.', footer: 'Produktion startet innerhalb von 24 Stunden.' },
    ro: { subject: `PLATYPUS — Confirmare comandă ${d.orderId}`, title: 'Mulțumim pentru comandă!', intro: 'Comanda ta a fost plasată cu succes.', footer: 'Producția începe în 24 de ore.' },
    en: { subject: `PLATYPUS — Order Confirmation ${d.orderId}`, title: 'Thank you for your order!', intro: 'Your order has been placed successfully.', footer: 'Production starts within 24 hours.' },
  };
  const t = templates[d.locale] || templates.de;
  return { subject: t.subject, html: buildHtml(t.title, t.intro, d, t.footer, designPreview) };
}

interface OrderEmailData {
  orderId: string;
  email: string;
  total: number;
  items: { name: string; size: string; quantity: number; price: number; designId?: string }[];
  locale: string;
  designId?: string;
  designIds?: string;
  type?: 'confirmation' | 'production' | 'shipped' | 'delivered' | 'admin_alert';
  reason?: 'missing_design' | 'on_hold';
  missingDesign?: boolean;
}

async function fetchDesignImages(ids: string[]) {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url || ids.length === 0) return [];
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);
    const rows: { id: string; front_image?: string; back_image?: string }[] = [];
    for (const id of ids.slice(0, 3)) {
      const r = await sql.query('SELECT id, front_image, back_image FROM designs WHERE id=$1', [id]) as Record<string, string>[];
      if (r[0]) rows.push(r[0] as { id: string; front_image?: string; back_image?: string });
    }
    return rows;
  } catch {
    return [];
  }
}

function buildDesignPreviewHtml(designs: { id: string; front_image?: string; back_image?: string }[]): string {
  if (!designs.length) return '';
  const blocks = designs.map((d) => {
    const imgs = [
      d.front_image ? `<div style="text-align:center"><p style="color:#666;font-size:11px;margin:0 0 6px">Vorne</p><img src="${d.front_image}" alt="Vorne" style="max-width:200px;border-radius:8px;border:1px solid #333"/></div>` : '',
      d.back_image ? `<div style="text-align:center"><p style="color:#666;font-size:11px;margin:0 0 6px">Hinten</p><img src="${d.back_image}" alt="Hinten" style="max-width:200px;border-radius:8px;border:1px solid #333"/></div>` : '',
    ].filter(Boolean).join('');
    if (!imgs) return '';
    return `<div style="margin-bottom:16px"><p style="color:#888;font-size:12px;margin-bottom:8px">Dein Motiv</p><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center">${imgs}</div></div>`;
  }).join('');
  if (!blocks) return '';
  return `<div style="background:#111;border:1px solid #222;border-radius:12px;padding:16px;margin-bottom:24px">${blocks}</div>`;
}

function buildHtml(title: string, intro: string, d: OrderEmailData, footer: string, designPreview = ''): string {
  const itemRows = d.items.map(i =>
    `<tr><td style="padding:8px 0;color:#888">${i.quantity}× ${i.name} (${i.size})</td><td style="padding:8px 0;text-align:right">€${(i.price * i.quantity).toFixed(2)}</td></tr>`
  ).join('');

  return `
  <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
    <h1 style="font-size:24px;letter-spacing:0.15em;margin-bottom:32px">PLATYPUS</h1>
    <h2 style="font-size:20px;margin-bottom:8px">${title}</h2>
    <p style="color:#888;margin-bottom:24px">${intro}</p>
    ${designPreview}
    <div style="background:#111;border:1px solid #222;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#555;font-size:12px;margin-bottom:12px">Order ${d.orderId}</p>
      <table style="width:100%;border-collapse:collapse">${itemRows}</table>
      <div style="border-top:1px solid #222;margin-top:12px;padding-top:12px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td><strong>Total</strong></td>
            <td style="text-align:right"><strong>€ ${d.total.toFixed(2)}</strong></td>
          </tr>
        </table>
      </div>
    </div>
    <p style="color:#555;font-size:13px">${footer}</p>
  </div>`;
}

export async function POST(request: NextRequest) {
  try {
    const data: OrderEmailData = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    const designIds = Array.from(new Set([
      data.designId,
      ...(data.designIds?.split(',').filter(Boolean) || []),
      ...(data.items?.map(i => i.designId).filter(Boolean) || []),
    ].filter(Boolean))) as string[];

    const designs = await fetchDesignImages(designIds);
    const designPreview = buildDesignPreviewHtml(designs);

    if (data.type === 'admin_alert') {
      const reason = data.reason === 'on_hold'
        ? 'Manuell auf On Hold gesetzt'
        : 'Kein Motiv (designId) hinterlegt';
      const template = {
        subject: `⚠ PLATYPUS Admin — Bestellung ${data.orderId} prüfen`,
        html: `
        <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
          <h1 style="font-size:20px;color:#f97316;margin-bottom:16px">Bestellung benötigt Prüfung</h1>
          <p style="color:#aaa;line-height:1.6"><strong>${data.orderId}</strong><br/>Grund: ${reason}<br/>Betrag: €${Number(data.total || 0).toFixed(2)}</p>
          <p style="margin-top:20px"><a href="https://platypus-shirt-shop.vercel.app/admin/print/${data.orderId}" style="color:#e2001a">Druckauftrag öffnen</a> ·
          <a href="https://platypus-shirt-shop.vercel.app/admin/orders" style="color:#e2001a;margin-left:12px">Admin Orders</a></p>
        </div>`,
      };
      if (!apiKey) {
        console.log('Admin-Alert (Demo):', template.subject);
        return NextResponse.json({ sent: false, demo: true, subject: template.subject });
      }
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'PLATYPUS <onboarding@resend.dev>', to: data.email, subject: template.subject, html: template.html }),
      });
      return NextResponse.json({ sent: res.ok });
    }

    const statusSet = data.type && data.type !== 'confirmation' ? STATUS_TEXTS[data.type] : null;
    const template = statusSet
      ? (() => { const t = statusSet[data.locale] || statusSet.de;
          return { subject: `PLATYPUS — ${t.subject} (${data.orderId})`, html: buildStatusHtml(t.title, t.body, data.orderId, data.type === 'delivered') }; })()
      : buildConfirmationEmail(data, designPreview);

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

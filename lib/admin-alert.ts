import type { Order } from './types';
import { orderMissingDesign } from './order-review';

export async function notifyAdminWebhookError(sessionId: string, error: unknown): Promise<void> {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.ADMIN_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const msg = error instanceof Error ? error.message : String(error);
  if (!adminEmail || !apiKey) {
    console.error('[webhook-alert] Order nicht erstellt — kein Alert möglich:', sessionId, msg);
    return;
  }
  const subject = `🚨 PLATYPUS Webhook-Fehler — Session ${sessionId}`;
  const html = `
    <div style="background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto">
      <h1 style="font-size:20px;color:#f87171;margin-bottom:16px">⚠ Webhook-Fehler — Order nicht erstellt</h1>
      <p style="color:#aaa;line-height:1.6">Stripe-Session: <strong>${sessionId}</strong><br/>Fehler: ${msg}</p>
      <p style="color:#aaa;margin-top:16px">Bitte die Order manuell im Stripe-Dashboard prüfen und ggf. anlegen.</p>
      <p style="margin-top:20px"><a href="https://dashboard.stripe.com/payments" style="color:#e2001a">Stripe Dashboard</a></p>
    </div>`;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'PLATYPUS <onboarding@resend.dev>', to: adminEmail, subject, html }),
    });
  } catch (e) {
    console.error('[webhook-alert] Alert-Versand fehlgeschlagen:', e);
  }
}

export async function notifyAdminOrderIssue(
  order: Order,
  reason: 'missing_design' | 'on_hold',
): Promise<void> {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('[admin-alert] ADMIN_ALERT_EMAIL nicht gesetzt — Alert nur geloggt:', order.id, reason);
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://platypus-shirt-shop.vercel.app';

  try {
    await fetch(`${siteUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'admin_alert',
        orderId: order.id,
        email: adminEmail,
        total: order.amountTotal,
        items: order.items || [],
        locale: 'de',
        reason,
        missingDesign: orderMissingDesign(order),
      }),
    });
  } catch (err) {
    console.error('[admin-alert] Versand fehlgeschlagen:', err);
  }
}
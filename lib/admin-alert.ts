import type { Order } from './types';
import { orderMissingDesign } from './order-review';

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
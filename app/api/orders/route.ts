import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderStats, initDb } from '@/lib/db';
import { Order } from '@/lib/types';

let initialized = false;
async function ensureInit() {
  if (!initialized) { await initDb(); initialized = true; }
}

export async function GET(request: NextRequest) {
  await ensureInit();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404 });
    // Tracking: nur unkritische Felder (keine E-Mail, Motive, Betraege)
    return NextResponse.json({ order: {
      id: order.id, status: order.status, createdAt: order.createdAt,
      updatedAt: order.updatedAt, shippingCountry: order.shippingCountry,
    } });
  }
  const status = searchParams.get('status') || undefined;
  const stats = searchParams.get('stats');

  if (stats === 'true') {
    return NextResponse.json(await getOrderStats());
  }

  const orders = await getOrders(status, parseInt(searchParams.get('limit') || '50'));
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  await ensureInit();
  try {
    const body = await request.json();
    const order: Order = {
      id: `PLT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      stripeSessionId: body.stripeSessionId,
      customerEmail: body.customerEmail,
      amountTotal: body.amountTotal || 0,
      currency: body.currency || 'EUR',
      status: body.status || 'paid',
      items: body.items || [],
      locale: body.locale || 'de',
      shippingCountry: body.shippingCountry || 'DE',
      designId: body.designId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await createOrder(order);
    return NextResponse.json({ order, success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await ensureInit();
  try {
    const { id, status } = await request.json();
    const success = await updateOrderStatus(id, status);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}

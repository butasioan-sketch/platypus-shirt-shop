// Datenbank Abstraktion: nutzt Postgres wenn DATABASE_URL gesetzt,
// sonst In-Memory Fallback. So läuft alles auch ohne DB-Setup.

import { Order, Review, ReviewStatus } from './types';

const memoryStore: Order[] = [];
const memoryReviews: Review[] = [];
let pgClient: unknown = null;

async function getPg() {
  if (pgClient) return pgClient;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;

  try {
    const { neon } = await import('@neondatabase/serverless');
    pgClient = neon(url);
    return pgClient;
  } catch {
    return null;
  }
}

export async function initDb() {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;
  if (!sql) return false;

  try {
    await sql.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        stripe_session_id TEXT UNIQUE,
        customer_email TEXT,
        amount_total NUMERIC,
        currency TEXT DEFAULT 'EUR',
        status TEXT DEFAULT 'paid',
        items JSONB DEFAULT '[]',
        locale TEXT DEFAULT 'de',
        shipping_country TEXT DEFAULT 'DE',
        design_id TEXT,
        shipping_method TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await sql.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS design_id TEXT`);
    await sql.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method TEXT`);
    await sql.query(`
      CREATE TABLE IF NOT EXISTS designs (
        id TEXT PRIMARY KEY,
        front_image TEXT,
        back_image TEXT,
        product_id TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await sql.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id BIGSERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        page TEXT,
        product_id TEXT,
        locale TEXT,
        value NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await sql.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        order_id TEXT,
        locale TEXT DEFAULT 'de',
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await sql.query(`CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at DESC)`);
    return true;
  } catch (err) {
    console.error('DB init error:', err);
    return false;
  }
}

export async function createOrder(order: Order): Promise<Order> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;

  if (!sql) {
    memoryStore.unshift(order);
    return order;
  }

  try {
    await sql.query(
      `INSERT INTO orders (id, stripe_session_id, customer_email, amount_total, currency, status, items, locale, shipping_country, design_id, shipping_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (stripe_session_id) DO NOTHING`,
      [order.id, order.stripeSessionId, order.customerEmail, order.amountTotal, order.currency, order.status, JSON.stringify(order.items), order.locale, order.shippingCountry, order.designId || null, order.shippingMethod || null]
    );
  } catch (err) {
    console.error('createOrder error:', err);
    memoryStore.unshift(order);
  }
  return order;
}

export async function getOrders(status?: string, limit = 50): Promise<Order[]> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;

  if (!sql) {
    let orders = memoryStore;
    if (status) orders = orders.filter(o => o.status === status);
    return orders.slice(0, limit);
  }

  try {
    const rows = status
      ? await sql.query(`SELECT * FROM orders WHERE status=$1 ORDER BY created_at DESC LIMIT $2`, [status, limit])
      : await sql.query(`SELECT * FROM orders ORDER BY created_at DESC LIMIT $1`, [limit]);

    return rows.map(mapRow);
  } catch (err) {
    console.error('getOrders error:', err);
    return memoryStore.slice(0, limit);
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;
  if (!sql) {
    return memoryStore.find(o => o.id === id) || null;
  }
  try {
    const rows = await sql.query(`SELECT * FROM orders WHERE id=$1 LIMIT 1`, [id]);
    return rows.length ? mapRow(rows[0]) : null;
  } catch (err) {
    console.error('getOrderById error:', err);
    return memoryStore.find(o => o.id === id) || null;
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;

  if (!sql) {
    const order = memoryStore.find(o => o.id === id);
    if (order) { order.status = status as Order['status']; return true; }
    return false;
  }

  try {
    await sql.query(`UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2`, [status, id]);
    return true;
  } catch {
    return false;
  }
}

export async function getOrderStats() {
  const orders = await getOrders(undefined, 1000);
  const now = Date.now();

  return {
    total: orders.length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.amountTotal), 0),
    last24h: orders.filter(o => now - new Date(o.createdAt).getTime() < 86400000).length,
    byStatus: {
      paid: orders.filter(o => o.status === 'paid').length,
      production: orders.filter(o => o.status === 'production').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    },
    byCountry: orders.reduce((acc, o) => {
      acc[o.shippingCountry] = (acc[o.shippingCountry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

export interface AnalyticsEvent {
  type: string;
  page?: string;
  productId?: string;
  locale?: string;
  value?: number;
  timestamp: string;
}

const memoryAnalytics: AnalyticsEvent[] = [];

export async function trackAnalyticsEvent(event: Omit<AnalyticsEvent, 'timestamp'>): Promise<void> {
  const full: AnalyticsEvent = { ...event, timestamp: new Date().toISOString() };
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<unknown> } | null;

  if (!sql) {
    memoryAnalytics.unshift(full);
    if (memoryAnalytics.length > 1000) memoryAnalytics.pop();
    return;
  }

  try {
    await sql.query(
      `INSERT INTO analytics_events (type, page, product_id, locale, value) VALUES ($1,$2,$3,$4,$5)`,
      [event.type, event.page || null, event.productId || null, event.locale || null, event.value ?? null]
    );
  } catch (err) {
    console.error('trackAnalyticsEvent error:', err);
    memoryAnalytics.unshift(full);
  }
}

export async function getAnalyticsSummary() {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;

  if (!sql) {
    const now = Date.now();
    const last24h = memoryAnalytics.filter(e => now - new Date(e.timestamp).getTime() < 86400000);
    return buildAnalyticsSummary(memoryAnalytics, last24h);
  }

  try {
    const rows = await sql.query(
      `SELECT type, page, product_id, locale, value, created_at
       FROM analytics_events
       WHERE created_at > NOW() - INTERVAL '7 days'
       ORDER BY created_at DESC
       LIMIT 1000`
    );
    const events: AnalyticsEvent[] = rows.map((r) => ({
      type: r.type as string,
      page: r.page as string | undefined,
      productId: r.product_id as string | undefined,
      locale: r.locale as string | undefined,
      value: r.value != null ? Number(r.value) : undefined,
      timestamp: new Date(r.created_at as string).toISOString(),
    }));
    const now = Date.now();
    const last24h = events.filter(e => now - new Date(e.timestamp).getTime() < 86400000);
    return buildAnalyticsSummary(events, last24h);
  } catch (err) {
    console.error('getAnalyticsSummary error:', err);
    const now = Date.now();
    const last24h = memoryAnalytics.filter(e => now - new Date(e.timestamp).getTime() < 86400000);
    return buildAnalyticsSummary(memoryAnalytics, last24h);
  }
}

function buildAnalyticsSummary(events: AnalyticsEvent[], last24h: AnalyticsEvent[]) {
  const byType: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  const byProduct: Record<string, number> = {};

  for (const e of last24h) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    if (e.locale) byLocale[e.locale] = (byLocale[e.locale] || 0) + 1;
    if (e.productId) byProduct[e.productId] = (byProduct[e.productId] || 0) + 1;
  }

  return {
    total: events.length,
    last24h: last24h.length,
    byType,
    byLocale,
    byProduct,
    recent: events.slice(0, 20),
  };
}

function mapRow(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    stripeSessionId: row.stripe_session_id as string,
    customerEmail: row.customer_email as string,
    amountTotal: Number(row.amount_total),
    currency: row.currency as string,
    status: row.status as Order['status'],
    items: (typeof row.items === 'string' ? JSON.parse(row.items) : row.items) as Order['items'],
    locale: row.locale as string,
    shippingCountry: row.shipping_country as string,
    shippingMethod: (row.shipping_method as string) || undefined,
    designId: (row.design_id as string) || null,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}

function mapReviewRow(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    name: row.name as string,
    rating: Number(row.rating),
    comment: row.comment as string,
    orderId: (row.order_id as string) || null,
    locale: row.locale as string,
    status: row.status as ReviewStatus,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}

export async function createReview(review: Review): Promise<Review> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<unknown> } | null;

  if (!sql) {
    memoryReviews.unshift(review);
    return review;
  }

  try {
    await sql.query(
      `INSERT INTO reviews (id, name, rating, comment, order_id, locale, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [review.id, review.name, review.rating, review.comment, review.orderId || null, review.locale, review.status]
    );
  } catch (err) {
    console.error('createReview error:', err);
    memoryReviews.unshift(review);
  }
  return review;
}

export async function getReviews(status?: ReviewStatus | 'all', limit = 50): Promise<Review[]> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;

  if (!sql) {
    let list = memoryReviews;
    if (status && status !== 'all') list = list.filter(r => r.status === status);
    return list.slice(0, limit);
  }

  try {
    const rows = status && status !== 'all'
      ? await sql.query(`SELECT * FROM reviews WHERE status=$1 ORDER BY created_at DESC LIMIT $2`, [status, limit])
      : await sql.query(`SELECT * FROM reviews ORDER BY created_at DESC LIMIT $1`, [limit]);
    return rows.map(mapReviewRow);
  } catch (err) {
    console.error('getReviews error:', err);
    let list = memoryReviews;
    if (status && status !== 'all') list = list.filter(r => r.status === status);
    return list.slice(0, limit);
  }
}

export async function getReviewById(id: string): Promise<Review | null> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<Record<string, unknown>[]> } | null;
  if (!sql) return memoryReviews.find(r => r.id === id) || null;
  try {
    const rows = await sql.query(`SELECT * FROM reviews WHERE id=$1 LIMIT 1`, [id]);
    return rows.length ? mapReviewRow(rows[0]) : null;
  } catch (err) {
    console.error('getReviewById error:', err);
    return memoryReviews.find(r => r.id === id) || null;
  }
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<boolean> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<unknown> } | null;

  if (!sql) {
    const review = memoryReviews.find(r => r.id === id);
    if (review) {
      review.status = status;
      review.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  try {
    await sql.query(`UPDATE reviews SET status=$1, updated_at=NOW() WHERE id=$2`, [status, id]);
    return true;
  } catch {
    return false;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  const sql = await getPg() as { query: (q: string, p?: unknown[]) => Promise<unknown> } | null;

  if (!sql) {
    const idx = memoryReviews.findIndex(r => r.id === id);
    if (idx >= 0) {
      memoryReviews.splice(idx, 1);
      return true;
    }
    return false;
  }

  try {
    await sql.query(`DELETE FROM reviews WHERE id=$1`, [id]);
    return true;
  } catch {
    return false;
  }
}

export async function getReviewStats() {
  const approved = await getReviews('approved', 1000);
  const pending = await getReviews('pending', 1000);
  const count = approved.length;
  const avg = count
    ? Math.round((approved.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
    : 0;

  return { count, avg, pending: pending.length };
}

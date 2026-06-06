import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  type: string;
  page?: string;
  productId?: string;
  locale?: string;
  value?: number;
  timestamp: string;
}

const EVENTS: AnalyticsEvent[] = [];
const MAX_EVENTS = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event: AnalyticsEvent = {
      type: body.type || 'pageview',
      page: body.page,
      productId: body.productId,
      locale: body.locale,
      value: body.value,
      timestamp: new Date().toISOString(),
    };

    EVENTS.unshift(event);
    if (EVENTS.length > MAX_EVENTS) EVENTS.pop();

    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json({ tracked: false });
  }
}

export async function GET() {
  const now = Date.now();
  const last24h = EVENTS.filter(e => now - new Date(e.timestamp).getTime() < 86400000);

  const byType: Record<string, number> = {};
  const byLocale: Record<string, number> = {};
  const byProduct: Record<string, number> = {};

  for (const e of last24h) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    if (e.locale) byLocale[e.locale] = (byLocale[e.locale] || 0) + 1;
    if (e.productId) byProduct[e.productId] = (byProduct[e.productId] || 0) + 1;
  }

  return NextResponse.json({
    total: EVENTS.length,
    last24h: last24h.length,
    byType,
    byLocale,
    byProduct,
    recent: EVENTS.slice(0, 20),
  });
}

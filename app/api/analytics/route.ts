import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary, initDb, trackAnalyticsEvent } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    await trackAnalyticsEvent({
      type: body.type || 'pageview',
      page: body.page,
      productId: body.productId,
      locale: body.locale,
      value: body.value,
    });
    return NextResponse.json({ tracked: true });
  } catch {
    return NextResponse.json({ tracked: false });
  }
}

export async function GET() {
  try {
    await initDb();
    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json({ total: 0, last24h: 0, byType: {}, byLocale: {}, byProduct: {}, recent: [] });
  }
}
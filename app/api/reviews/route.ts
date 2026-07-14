import { NextRequest, NextResponse } from 'next/server';
import {
  createReview,
  deleteReview,
  getReviewById,
  getReviews,
  getReviewStats,
  initDb,
  updateReviewStatus,
} from '@/lib/db';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { Review, ReviewStatus } from '@/lib/types';

let initialized = false;
async function ensureInit() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

function sanitizeText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function parseRating(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export async function GET(request: NextRequest) {
  await ensureInit();
  const { searchParams } = new URL(request.url);
  const stats = searchParams.get('stats');
  const status = (searchParams.get('status') || 'approved') as ReviewStatus | 'all';

  if (stats === 'true') {
    return NextResponse.json(await getReviewStats());
  }

  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10) || 50);
  const reviews = await getReviews(status, limit);
  const publicReviews = status === 'approved'
    ? reviews.map(({ id, name, rating, comment, locale, createdAt }) => ({ id, name, rating, comment, locale, createdAt }))
    : reviews;

  return NextResponse.json({ reviews: publicReviews });
}

export async function POST(request: NextRequest) {
  await ensureInit();

  const ip = clientIp(request);
  const rate = checkRateLimit(`review:${ip}`, 3, 300_000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Zu viele Bewertungen. Bitte später erneut versuchen.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const name = sanitizeText(body.name, 60);
    const comment = sanitizeText(body.comment, 1200);
    const rating = parseRating(body.rating);
    const locale = ['de', 'ro', 'en'].includes(body.locale) ? body.locale : 'de';
    const orderId = sanitizeText(body.orderId, 40) || null;

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Bitte einen Namen angeben (mind. 2 Zeichen).' }, { status: 400 });
    }
    if (!rating) {
      return NextResponse.json({ error: 'Bitte eine Bewertung von 1–5 Sternen wählen.' }, { status: 400 });
    }
    if (!comment || comment.length < 10) {
      return NextResponse.json({ error: 'Bitte einen Kommentar mit mind. 10 Zeichen schreiben.' }, { status: 400 });
    }

    const review: Review = {
      id: `REV-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      name,
      rating,
      comment,
      orderId,
      locale,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createReview(review);
    return NextResponse.json({
      success: true,
      message: 'Danke! Deine Bewertung wird nach Prüfung veröffentlicht.',
      review: { id: review.id, status: review.status },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  await ensureInit();
  try {
    const { id, status } = await request.json();
    if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
    }

    const existing = await getReviewById(id);
    if (!existing) return NextResponse.json({ error: 'Bewertung nicht gefunden' }, { status: 404 });

    const success = await updateReviewStatus(id, status as ReviewStatus);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await ensureInit();
  const id = new URL(request.url).searchParams.get('id') || (await request.json().catch(() => ({}))).id;
  if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 });

  const existing = await getReviewById(id);
  if (!existing) return NextResponse.json({ error: 'Bewertung nicht gefunden' }, { status: 404 });

  const success = await deleteReview(id);
  return NextResponse.json({ success });
}
import { NextRequest, NextResponse } from 'next/server';
import { PRINT_SPEC } from '@/lib/print-spec';
import { isPrintReadyDataUrl } from '@/lib/print-export';
import { initDb } from '@/lib/db';

async function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const { neon } = await import('@neondatabase/serverless');
  return neon(url);
}

// Schema-Migration (neue Spalten wie front_preview/back_preview) darf nicht davon
// abhaengen, dass zufaellig zuerst eine andere Route (z.B. /api/orders) aufgerufen wurde.
let initialized = false;
async function ensureInit() {
  if (!initialized) { await initDb(); initialized = true; }
}

interface RawTransform { scale?: unknown; x?: unknown; y?: unknown }

/** Validiert + clamped ein Transform-Objekt aus dem Client. Gibt null zurück wenn nicht vorhanden/unbrauchbar. */
function sanitizeTransform(raw: unknown): { scale: number; x: number; y: number } | null {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw as RawTransform;
  const scale = Number(t.scale);
  const x = Number(t.x);
  const y = Number(t.y);
  if (!Number.isFinite(scale) || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  const limit = PRINT_SPEC.maxOffsetPercent;
  return {
    scale: Math.max(PRINT_SPEC.scaleMin, Math.min(PRINT_SPEC.scaleMax, scale)),
    x: Math.max(-limit, Math.min(limit, x)),
    y: Math.max(-limit, Math.min(limit, y)),
  };
}

export async function POST(request: NextRequest) {
  try {
    await ensureInit();
    const contentLength = request.headers.get('content-length');
    const sizeMb = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) : '?';
    console.log('[designs POST] content-length:', sizeMb, 'MB');

    const body = await request.json();
    const sql = await getSql();
    if (!sql) return NextResponse.json({ error: 'no db' }, { status: 500 });

    const front = body.front || null;
    const back = body.back || null;
    if (!front && !back) {
      return NextResponse.json({ error: 'Weder front noch back übergeben' }, { status: 400 });
    }
    if (front && !isPrintReadyDataUrl(front)) {
      return NextResponse.json({ error: 'front ist kein druckfertiges Bild' }, { status: 400 });
    }
    if (back && !isPrintReadyDataUrl(back)) {
      return NextResponse.json({ error: 'back ist kein druckfertiges Bild' }, { status: 400 });
    }

    const frontTransform = sanitizeTransform(body.frontTransform);
    const backTransform = sanitizeTransform(body.backTransform);
    const meta = body.meta && typeof body.meta === 'object' ? body.meta : null;
    // Kundenblick-Preview ist ein Reklamations-Beweis, kein Kernfeature — bei Problemen
    // (fehlt/kaputt) einfach weglassen statt den ganzen Design-Save abzulehnen.
    const frontPreview = body.frontPreview && isPrintReadyDataUrl(body.frontPreview) ? body.frontPreview : null;
    const backPreview = body.backPreview && isPrintReadyDataUrl(body.backPreview) ? body.backPreview : null;

    const id = `DSGN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    await sql.query(
      `INSERT INTO designs (id, front_image, back_image, product_id, front_transform, back_transform, meta, front_preview, back_preview)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        id, front, back, body.productId || null,
        frontTransform ? JSON.stringify(frontTransform) : null,
        backTransform ? JSON.stringify(backTransform) : null,
        meta ? JSON.stringify(meta) : null,
        frontPreview, backPreview,
      ]
    );
    return NextResponse.json({ id, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fehler';
    console.error('[designs POST] Fehler:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInit();
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 });
    const sql = await getSql();
    if (!sql) return NextResponse.json({ error: 'no db' }, { status: 500 });
    const rows = await sql.query(`SELECT * FROM designs WHERE id=$1`, [id]) as Record<string, unknown>[];
    if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ design: rows[0] });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

async function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const { neon } = await import('@neondatabase/serverless');
  return neon(url);
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get('content-length');
    const sizeMb = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) : '?';
    console.log('[designs POST] content-length:', sizeMb, 'MB');

    const body = await request.json();
    const sql = await getSql();
    if (!sql) return NextResponse.json({ error: 'no db' }, { status: 500 });

    const id = `DSGN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    await sql.query(
      `INSERT INTO designs (id, front_image, back_image, product_id) VALUES ($1,$2,$3,$4)`,
      [id, body.front || null, body.back || null, body.productId || null]
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

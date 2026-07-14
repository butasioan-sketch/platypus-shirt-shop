import { getOrderById } from '@/lib/db';
import { PRINT_SPEC, formatSizeMm } from '@/lib/print-spec';

async function getDesign(id: string) {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(url);
  const rows = await sql.query('SELECT front_image, back_image FROM designs WHERE id=$1', [id]) as Record<string,string>[];
  return rows[0] || null;
}

export default async function PrintView({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!order) return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Bestellung nicht gefunden.</div>;

  const ids = Array.from(new Set([
    ...(order.items || []).map((i: { designId?: string }) => i.designId),
    order.designId,
  ].filter(Boolean))) as string[];

  type DesignRow = { id: string; front_image?: string; back_image?: string };
  const designs: DesignRow[] = await Promise.all(ids.map(async (id) => ({ id, ...(await getDesign(id)) })));
  const hasDesign = designs.some((d) => d.front_image || d.back_image);
  const missingDesign = !hasDesign;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 900, margin: '0 auto', color: '#111' }}>
      <div style={{ borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>PLATYPUS — Druckauftrag</h1>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.95rem' }}>
          <strong>{order.id}</strong> · {order.shippingCountry}{order.shippingMethod ? ' · ' + order.shippingMethod : ''} · Status: {order.status}
        </p>
      </div>

      {missingDesign && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <strong>Kein Motiv hinterlegt.</strong> Diese Bestellung enthält kein Design — vor Produktion Kundenkontakt oder Storno prüfen.
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <thead><tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
          <th style={{ padding: '0.5rem' }}>Artikel</th><th>Größe</th><th>Farbe</th><th>Menge</th><th>Design</th>
        </tr></thead>
        <tbody>
          {(order.items || []).map((it: { name: string; size: string; color?: string; quantity: number; designId?: string }, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{it.name}</td>
              <td>{it.size}</td>
              <td>{it.color || '—'}</td>
              <td>{it.quantity}</td>
              <td style={{ fontSize: '0.75rem', color: it.designId ? '#333' : '#b45309' }}>{it.designId || 'fehlt'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ background: '#f8f8f8', borderRadius: 8, padding: '1rem', marginBottom: '2rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
        <strong>Druckstandard</strong><br />
        Format: {formatSizeMm()} Hochformat · {PRINT_SPEC.dpi} dpi · {PRINT_SPEC.widthPx} × {PRINT_SPEC.heightPx} px<br />
        Blank: {PRINT_SPEC.blank} · Methode: {PRINT_SPEC.method}<br />
        Epson SC-F100: Papier A4, „Actual size“ / 100 % — kein Fit-to-Page
      </div>

      {designs.map((d) => (
        <div key={d.id} style={{ marginBottom: '2.5rem', pageBreakInside: 'avoid' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>Design {d.id}</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {d.front_image && (
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>VORNE — {PRINT_SPEC.widthPx} × {PRINT_SPEC.heightPx} px</p>
                <a
                  href={d.front_image}
                  download={`${order.id}-front.jpg`}
                  style={{
                    display: 'inline-block',
                    background: '#e2001a',
                    color: '#fff',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    marginBottom: '0.75rem',
                  }}
                >
                  ↓ VORNE drucken
                </a>
                <img src={d.front_image} alt="front" style={{ display: 'block', maxWidth: 320, border: '1px solid #ccc' }} />
              </div>
            )}
            {d.back_image && (
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>HINTEN — {PRINT_SPEC.widthPx} × {PRINT_SPEC.heightPx} px</p>
                <a
                  href={d.back_image}
                  download={`${order.id}-back.jpg`}
                  style={{
                    display: 'inline-block',
                    background: '#e2001a',
                    color: '#fff',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    marginBottom: '0.75rem',
                  }}
                >
                  ↓ HINTEN drucken
                </a>
                <img src={d.back_image} alt="back" style={{ display: 'block', maxWidth: 320, border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
        </div>
      ))}

      <p style={{ fontSize: '0.75rem', color: '#999', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
        {PRINT_SPEC.method} · {PRINT_SPEC.blank} · {PRINT_SPEC.widthMm} × {PRINT_SPEC.heightMm} mm Hochformat ({PRINT_SPEC.dpi} dpi = {PRINT_SPEC.widthPx} × {PRINT_SPEC.heightPx} px).
        Motive in Originalauflösung — Download oder Rechtsklick → Bild speichern → Epson SC-F100.
      </p>
    </div>
  );
}
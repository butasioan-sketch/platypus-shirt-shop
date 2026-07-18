import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, getDesignById, getOrderPrintJob } from '@/lib/db';
import { buildPrintJobPayload, generatePrintPdf, type PrintJobPayload } from '@/lib/print-job';
import { orderDesignIds } from '@/lib/order-review';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Bestellung nicht gefunden' }, { status: 404 });

  const ids = orderDesignIds(order);
  const designs = (await Promise.all(ids.map((did) => getDesignById(did))))
    .filter((d): d is NonNullable<typeof d> => d !== null);

  // Frozen Snapshot verwenden falls vorhanden (Zahlungszeitpunkt) — sonst live berechnen
  // (z.B. Demo-Checkout ohne Webhook, oder Admin-Vorschau vor Zahlungsabschluss).
  const storedPrintJob = (await getOrderPrintJob(id)) as PrintJobPayload | null;
  const printJob = storedPrintJob || buildPrintJobPayload(id, designs);

  const pdfBytes = await generatePrintPdf(order, designs, printJob);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PLATYPUS-${order.id}.pdf"`,
    },
  });
}

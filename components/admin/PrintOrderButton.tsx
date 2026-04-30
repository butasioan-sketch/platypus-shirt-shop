"use client";

export default function PrintOrderButton({ order }: { order: any }) {
  function printOrder() {
    const products = (order.items || [])
      .map(
        (item: any) =>
          `<li>${item.quantity}x ${item.name} · Größe ${item.size} · Regular · ${item.print}</li>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Produktionsschein ${order.reference || order.id}</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h1 { font-size: 32px; }
            .box { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 12px; }
            li { margin: 10px 0; font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>PLATYPUS Produktionsschein</h1>

          <div class="box">
            <p><b>Referenz:</b> ${order.reference || order.id}</p>
            <p><b>Kunde:</b> ${order.customer?.name || "-"}</p>
            <p><b>Email:</b> ${order.customer?.email || "-"}</p>
            <p><b>Adresse:</b> ${order.customer?.address || "-"}, ${order.customer?.city || "-"}</p>
            <p><b>Zahlung:</b> ${order.paymentMethod || "-"}</p>
            <p><b>Gesamt:</b> ${Number(order.total || 0).toFixed(2)} €</p>
          </div>

          <div class="box">
            <h2>Produkte</h2>
            <ul>${products}</ul>
          </div>

          <div class="box">
            <h2>Checkliste</h2>
            <p>☐ Shirt kontrolliert</p>
            <p>☐ Druckdatei vorbereitet</p>
            <p>☐ Gepresst / produziert</p>
            <p>☐ Qualitätskontrolle</p>
            <p>☐ Verpackt</p>
            <p>☐ Versand vorbereitet</p>
          </div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(html);
    win.document.close();
    win.print();
  }

  return (
    <button
      onClick={printOrder}
      className="mt-3 rounded-2xl bg-black px-5 py-3 font-black text-white"
    >
      Produktionsschein drucken
    </button>
  );
}

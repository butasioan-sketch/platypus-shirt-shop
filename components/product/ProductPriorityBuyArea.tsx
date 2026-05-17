export default function ProductPriorityBuyArea() {
  return (
    <div className="mt-6 rounded-[2rem] border border-black bg-black p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
        Kaufbereich
      </p>

      <h2 className="mt-3 text-3xl font-black leading-tight">
        Weniger suchen. Schneller entscheiden.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-white/70">
        Die wichtigsten Kaufpunkte sind sichtbar: Produkt, Größe, Fit, Versand und Zahlung.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <a
          href="#"
          className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-black"
        >
          Konfiguration prüfen
        </a>

        <a
          href="/cart"
          className="rounded-2xl bg-red-600 px-5 py-4 text-center text-sm font-black text-white"
        >
          Warenkorb öffnen
        </a>

        <a
          href="/versand"
          className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center text-sm font-black text-white"
        >
          Versand prüfen
        </a>
      </div>
    </div>
  );
}

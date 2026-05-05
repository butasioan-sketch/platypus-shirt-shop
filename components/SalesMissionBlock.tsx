export default function SalesMissionBlock() {
  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Mission
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Ziel: erste echte Bestellung.
      </h2>

      <p className="mt-3 text-neutral-600 font-bold">
        Jeder Block auf dieser Seite hat nur eine Aufgabe: Vertrauen aufbauen, Fragen beantworten und den Kauf einfacher machen.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <a href="#produkte" className="rounded-2xl bg-black p-4 text-center font-black text-white">
          Produkt wählen
        </a>

        <a href="/versand" className="rounded-2xl bg-neutral-100 p-4 text-center font-black text-black">
          Versand prüfen
        </a>

        <a href="/cart" className="rounded-2xl bg-neutral-100 p-4 text-center font-black text-black">
          Warenkorb öffnen
        </a>
      </div>
    </div>
  );
}

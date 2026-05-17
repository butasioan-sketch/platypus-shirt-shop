export default function ProductFinalBuyBox() {
  return (
    <div className="mt-6 rounded-[2rem] border border-red-200 bg-red-600 p-6 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-widest text-white/70">
        Final Check
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Dein PLATYPUS Shirt ist bereit.
      </h2>

      <p className="mt-3 text-sm font-bold text-white/80">
        Wähle Menge und lege es in den Warenkorb. Danach kannst du Versand und Zahlung auswählen.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href="#"
          className="rounded-2xl bg-black px-5 py-4 text-center font-black text-white"
        >
          Oben konfigurieren
        </a>

        <a
          href="/cart"
          className="rounded-2xl bg-white px-5 py-4 text-center font-black text-black"
        >
          Zum Warenkorb
        </a>
      </div>
    </div>
  );
}

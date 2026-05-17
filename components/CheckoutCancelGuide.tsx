export default function CheckoutCancelGuide() {
  return (
    <div className="mt-6 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-amber-700">
        Zahlung abgebrochen
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Kein Problem. Dein Warenkorb bleibt prüfbar.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-amber-900">
        Wenn der Checkout geschlossen wurde, kannst du zurück zum Warenkorb gehen,
        Versand und Zahlungsart erneut prüfen und den Kauf später fortsetzen.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href="/cart"
          className="rounded-2xl bg-black px-5 py-3 text-sm font-black text-white"
        >
          Warenkorb öffnen
        </a>

        <a
          href="#produkte"
          className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-amber-950"
        >
          Produkte ansehen
        </a>
      </div>
    </div>
  );
}

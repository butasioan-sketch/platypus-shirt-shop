export default function ProductCheckoutReminder() {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-black p-5 text-white shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-white/50">
        Nächster Schritt
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Bereit für den Warenkorb.
      </h2>

      <p className="mt-2 text-sm font-bold text-white/70">
        Prüfe Größe, Fit und Personalisierung. Danach kannst du das Shirt in den Warenkorb legen.
      </p>

      <a
        href="/cart"
        className="mt-4 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
      >
        Warenkorb öffnen
      </a>
    </div>
  );
}

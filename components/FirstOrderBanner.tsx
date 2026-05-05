export default function FirstOrderBanner() {
  return (
    <div className="mt-8 rounded-[2rem] bg-black p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        Erste Bestellung
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Werde Teil der ersten PLATYPUS Testserie.
      </h2>

      <p className="mt-3 text-white/70 font-bold">
        Die ersten Bestellungen helfen uns, Produktion, Druckqualität, Verpackung und Versand final zu perfektionieren.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <a href="#produkte" className="rounded-2xl bg-white p-4 text-center font-black text-black">
          Shirt wählen
        </a>

        <a href="/versand" className="rounded-2xl bg-white/10 p-4 text-center font-black text-white">
          Versand ansehen
        </a>

        <a href="/cart" className="rounded-2xl bg-white/10 p-4 text-center font-black text-white">
          Checkout öffnen
        </a>
      </div>
    </div>
  );
}

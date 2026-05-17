export default function ProductReturnNotice() {
  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Rückgabe & Prüfung
      </p>

      <p className="mt-3 text-sm font-bold leading-6 text-neutral-700">
        Nicht-personalisierte Artikel können nach geltendem Widerrufsrecht zurückgegeben werden.
        Personalisierte Shirts werden individuell geprüft und produziert.
      </p>

      <a
        href="/agb"
        className="mt-4 inline-block rounded-2xl bg-black px-5 py-3 text-sm font-black text-white"
      >
        AGB ansehen
      </a>
    </div>
  );
}

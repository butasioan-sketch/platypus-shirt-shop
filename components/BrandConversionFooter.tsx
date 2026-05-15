export default function BrandConversionFooter() {
  return (
    <div className="mt-8 rounded-[2rem] bg-red-600 p-8 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-white/70">
        Ready
      </p>

      <h2 className="mt-3 text-3xl font-black sm:text-5xl">
        Wenn du PLATYPUS verstehst,
        <span className="block">
          dann ist das dein Shirt.
        </span>
      </h2>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#produkte"
          className="rounded-2xl bg-black px-8 py-4 text-center font-black text-white active:scale-[0.98]"
        >
          Jetzt Shirt wählen
        </a>

        <a
          href="/cart"
          className="rounded-2xl bg-white px-8 py-4 text-center font-black text-black active:scale-[0.98]"
        >
          Warenkorb öffnen
        </a>
      </div>
    </div>
  );
}

import BrandLogo from "./BrandLogo";

export default function BrandBanner() {
  return (
    <div className="mt-8 overflow-hidden rounded-[2rem] border border-red-500/20 bg-black text-white shadow-2xl">
      <div className="bg-[radial-gradient(circle_at_top,#3a0000,#000000_60%)] p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="large" />

          <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-red-500">
            PLATYPUS MINDSET
          </p>

          <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            ON ME, AND IN YOUR HEAD,
            <span className="block text-red-500">
              IN THE SAME TIME.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm font-bold text-neutral-300 sm:text-base">
            Words are not just words.
            Kleidung ist Identität, Präsenz und Wirkung.
          </p>
        </div>
      </div>
    </div>
  );
}

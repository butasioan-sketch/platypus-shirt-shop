import Link from "next/link";

export default function HeroActions() {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <a
        href="#produkte"
        className="rounded-2xl bg-black px-6 py-4 text-center font-black text-white shadow-xl active:scale-[0.98]"
      >
        T-Shirts ansehen
      </a>

      <Link
        href="/versand"
        className="rounded-2xl border border-neutral-300 bg-white px-6 py-4 text-center font-black text-black shadow-sm active:scale-[0.98]"
      >
        Versand & Zahlung
      </Link>
    </div>
  );
}

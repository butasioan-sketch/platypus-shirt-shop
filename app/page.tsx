import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="uppercase tracking-[4px] text-xs text-zinc-500 mb-3">Premium Print-on-Demand</div>
        <h1 className="text-7xl font-semibold tracking-tighter mb-6">PLATYPUS</h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-md mx-auto">
          Exzellente Qualität. Echtzeit-Farbwechsel.<br />360° Erlebnis.
        </p>

        <Link 
          href="/product/1" 
          className="inline-block px-10 py-4 bg-white text-black rounded-3xl font-medium text-lg active:scale-[0.985] transition"
        >
          Jetzt entdecken
        </Link>
      </div>
    </div>
  );
}

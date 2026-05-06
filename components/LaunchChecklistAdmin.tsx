"use client";

import Link from "next/link";

export default function LaunchChecklistAdmin() {
  const checks = [
    { label: "Shop live", done: true },
    { label: "Checkout aktiv", done: true },
    { label: "Versand sichtbar", done: true },
    { label: "Lagerverwaltung aktiv", done: true },
    { label: "Waschtest-Protokoll aktiv", done: true },
    { label: "Newsletter-Leads aktiv", done: true },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Launch Kontrolle
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Verkaufsbereit Schritt für Schritt
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 font-black text-emerald-900"
          >
            ✅ {check.label}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/admin/tests" className="rounded-2xl bg-black px-5 py-3 font-black text-white">
          Waschtests
        </Link>

        <Link href="/admin/inventory" className="rounded-2xl bg-black px-5 py-3 font-black text-white">
          Lager
        </Link>

        <Link href="/admin/newsletter" className="rounded-2xl bg-black px-5 py-3 font-black text-white">
          Newsletter
        </Link>
      </div>
    </div>
  );
}

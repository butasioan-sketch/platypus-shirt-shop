export default function LaunchReadinessBoard() {
  const checks = [
    "Build läuft fehlerfrei",
    "Deploy läuft fehlerfrei",
    "Produktseiten erreichbar",
    "Checkout erreichbar",
    "Admin erreichbar",
    "Newsletter erreichbar",
    "Versandseite erreichbar",
    "360° Viewer funktioniert",
    "Logo sichtbar",
    "Mobile Ansicht prüfen",
    "Stripe Testzahlung durchführen",
    "Erste echte Testbestellung durchführen",
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Launch Readiness
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Finaler Start-Check
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-black"
          >
            ☐ {check}
          </div>
        ))}
      </div>
    </div>
  );
}

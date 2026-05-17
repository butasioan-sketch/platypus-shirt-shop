export default function ProductTrustBadges() {
  const badges = [
    "Sichere Zahlung",
    "Kontrollierte Produktion",
    "Premium Stoffqualität",
    "Manuelle Qualitätsprüfung",
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {badges.map((badge) => (
        <div
          key={badge}
          className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-black text-neutral-700 shadow-sm"
        >
          ✅ {badge}
        </div>
      ))}
    </div>
  );
}

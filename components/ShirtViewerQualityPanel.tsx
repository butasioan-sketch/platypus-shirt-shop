export default function ShirtViewerQualityPanel() {
  const checks = [
    "360° Rotation",
    "Touch & Maus",
    "Front / Back",
    "Stoffstruktur",
    "Studio Licht",
    "Schatten Tiefe",
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {checks.map((check) => (
        <div
          key={check}
          className="rounded-xl bg-white/90 p-2 text-center text-[11px] font-black text-neutral-700 shadow-sm"
        >
          ✅ {check}
        </div>
      ))}
    </div>
  );
}

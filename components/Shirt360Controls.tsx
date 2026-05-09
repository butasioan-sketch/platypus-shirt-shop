"use client";

export default function Shirt360Controls({
  autoRotate,
  setAutoRotate,
  resetRotation,
}: {
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  resetRotation: () => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold shadow-sm active:scale-[0.98]"
      >
        {autoRotate ? "Rotation pausieren" : "Rotation starten"}
      </button>

      <button
        onClick={resetRotation}
        className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold shadow-sm active:scale-[0.98]"
      >
        Zurücksetzen
      </button>
    </div>
  );
}

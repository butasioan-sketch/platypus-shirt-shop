export default function ShirtViewerStatus({
  sideLabel,
  autoRotate,
}: {
  sideLabel: string;
  autoRotate: boolean;
}) {
  return (
    <div className="absolute left-5 top-16 z-20 rounded-2xl bg-white/90 px-4 py-3 text-xs font-black shadow-xl backdrop-blur">
      <p>{sideLabel}</p>
      <p className="mt-1 text-neutral-500">
        {autoRotate ? "Auto-Rotation aktiv" : "Manuelle Rotation"}
      </p>
    </div>
  );
}

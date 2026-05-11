export default function ShirtRotationMeter({ rotation }: { rotation: number }) {
  const normalized = ((rotation % 360) + 360) % 360;
  const progress = Math.round((normalized / 360) * 100);

  return (
    <div className="absolute bottom-16 left-1/2 z-10 w-56 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 shadow-sm">
      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

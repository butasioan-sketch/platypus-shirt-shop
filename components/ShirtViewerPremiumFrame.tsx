export default function ShirtViewerPremiumFrame() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-black/10" />
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
    </>
  );
}

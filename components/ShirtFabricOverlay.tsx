export default function ShirtFabricOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-[14%] rounded-[45%] opacity-[0.10] mix-blend-multiply bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.22)_0px,rgba(0,0,0,0.22)_1px,transparent_1px,transparent_5px)]" />
      <div className="pointer-events-none absolute inset-[14%] rounded-[45%] opacity-[0.08] mix-blend-multiply bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.22)_0px,rgba(0,0,0,0.22)_1px,transparent_1px,transparent_6px)]" />
      <div className="pointer-events-none absolute left-[28%] top-[20%] h-[58%] w-[44%] rounded-full bg-white/10 blur-2xl" />
    </>
  );
}

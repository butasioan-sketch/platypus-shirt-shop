export default function ShirtLightingFX() {
  return (
    <>
      <div className="pointer-events-none absolute left-[22%] top-[12%] h-[18%] w-[56%] rounded-full bg-white/30 blur-2xl" />

      <div className="pointer-events-none absolute left-[18%] top-[18%] h-[58%] w-[10%] rounded-full bg-white/14 blur-xl" />

      <div className="pointer-events-none absolute right-[18%] top-[18%] h-[58%] w-[10%] rounded-full bg-black/10 blur-xl" />

      <div className="pointer-events-none absolute left-[30%] bottom-[18%] h-[10%] w-[40%] rounded-full bg-black/10 blur-2xl" />
    </>
  );
}

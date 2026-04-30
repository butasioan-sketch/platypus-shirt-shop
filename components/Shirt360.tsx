"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Shirt360({
  src,
  alt,
  activeSide,
}: {
  src: string;
  alt: string;
  activeSide: "front" | "back";
}) {
  const [rotation, setRotation] = useState(activeSide === "front" ? 0 : 180);
  const [autoRotate, setAutoRotate] = useState(true);
  const lastTouchX = useRef<number | null>(null);

  useEffect(() => {
    setRotation(activeSide === "front" ? 0 : 180);
  }, [activeSide]);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setRotation((r) => r + 0.18);
    }, 16);

    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <div className="relative">
      <div
        className="relative h-[430px] sm:h-[560px] flex items-center justify-center overflow-hidden cursor-grab touch-none"
        style={{ perspective: "1800px" }}
        onMouseDown={() => setAutoRotate(false)}
        onMouseMove={(e) => {
          if (e.buttons === 1) setRotation((r) => r + e.movementX * 0.75);
        }}
        onMouseUp={() => setAutoRotate(true)}
        onMouseLeave={() => setAutoRotate(true)}
        onTouchStart={(e) => {
          setAutoRotate(false);
          lastTouchX.current = e.touches[0].clientX;
        }}
        onTouchMove={(e) => {
          if (lastTouchX.current === null) return;
          const currentX = e.touches[0].clientX;
          const diff = currentX - lastTouchX.current;
          setRotation((r) => r + diff * 0.7);
          lastTouchX.current = currentX;
        }}
        onTouchEnd={() => {
          lastTouchX.current = null;
          setAutoRotate(true);
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1),rgba(245,245,245,0.85)_34%,rgba(225,225,225,0.45)_60%,transparent_78%)]" />
        <div className="absolute bottom-16 w-80 h-14 bg-black/18 blur-3xl rounded-full" />
        <div className="absolute bottom-24 w-48 h-6 bg-black/10 blur-xl rounded-full" />

        <div
          className="relative w-[350px] h-[350px] sm:w-[475px] sm:h-[475px]"
          style={{
            transform: `rotateY(${rotation}deg) rotateX(1.8deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "translateZ(50px)", backfaceVisibility: "hidden" }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 640px) 350px, 475px"
              className="object-contain drop-shadow-[0_48px_70px_rgba(0,0,0,0.24)]"
            />

            <div className="absolute left-[25%] top-[18%] h-[63%] w-[9%] rounded-full bg-white/16 blur-md" />
            <div className="absolute right-[24%] top-[18%] h-[63%] w-[8%] rounded-full bg-black/10 blur-md" />
            <div className="absolute left-[41%] top-[18%] h-[58%] w-[18%] rounded-full bg-white/7 blur-lg" />
          </div>

          <div
            className="absolute inset-0"
            style={{ transform: "rotateY(180deg) translateZ(50px)", backfaceVisibility: "hidden" }}
          >
            <Image
              src={src}
              alt={`${alt} Rückseite`}
              fill
              priority
              sizes="(max-width: 640px) 350px, 475px"
              className="object-contain brightness-[0.97] contrast-[1.05] drop-shadow-[0_48px_70px_rgba(0,0,0,0.24)]"
            />

            <div className="absolute left-[25%] top-[18%] h-[63%] w-[9%] rounded-full bg-white/14 blur-md" />
            <div className="absolute right-[24%] top-[18%] h-[63%] w-[8%] rounded-full bg-black/12 blur-md" />
            <div className="absolute left-[41%] top-[18%] h-[58%] w-[18%] rounded-full bg-white/6 blur-lg" />
          </div>
        </div>
      </div>

      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className="mx-auto block text-xs bg-white border border-neutral-300 px-4 py-2 rounded-full font-bold shadow-sm active:scale-[0.98]"
      >
        {autoRotate ? "Rotation pausieren" : "Rotation starten"}
      </button>
    </div>
  );
}

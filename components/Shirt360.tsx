"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Shirt360Controls from "./Shirt360Controls";
import ShirtFabricOverlay from "./ShirtFabricOverlay";
import ShirtRotationMeter from "./ShirtRotationMeter";

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
  const [dragging, setDragging] = useState(false);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    setRotation(activeSide === "front" ? 0 : 180);
  }, [activeSide]);

  useEffect(() => {
    if (!autoRotate || dragging) return;

    const interval = setInterval(() => {
      setRotation((value) => value + 0.14);
    }, 16);

    return () => clearInterval(interval);
  }, [autoRotate, dragging]);

  function startDrag(x: number) {
    setDragging(true);
    setAutoRotate(false);
    lastX.current = x;
  }

  function moveDrag(x: number) {
    if (lastX.current === null) return;

    const diff = x - lastX.current;
    setRotation((value) => value + diff * 0.85);
    lastX.current = x;
  }

  function endDrag() {
    setDragging(false);
    lastX.current = null;

    setTimeout(() => {
      setAutoRotate(true);
    }, 900);
  }

  const normalized = ((rotation % 360) + 360) % 360;
  const sideLabel = normalized > 90 && normalized < 270 ? "Rückseite" : "Vorderseite";

  return (
    <div className="relative select-none">
      <div
        className="relative h-[430px] sm:h-[570px] flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing"
        style={{ perspective: "1900px" }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => dragging && moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,1),rgba(246,246,246,0.95)_32%,rgba(224,224,224,0.55)_62%,transparent_82%)]" />

        <div className="absolute bottom-14 h-16 w-80 rounded-full bg-black/20 blur-3xl" />
        <div className="absolute bottom-24 h-7 w-52 rounded-full bg-black/12 blur-xl" />

        <div
          className="relative w-[350px] h-[350px] sm:w-[485px] sm:h-[485px] transition-transform duration-75"
          style={{
            transform: `rotateY(${rotation}deg) rotateX(2deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: "translateZ(54px)",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 640px) 350px, 485px"
              className="object-contain drop-shadow-[0_55px_75px_rgba(0,0,0,0.27)]"
            />

            <div className="absolute left-[24%] top-[17%] h-[64%] w-[8%] rounded-full bg-white/18 blur-md" />
            <div className="absolute right-[23%] top-[17%] h-[64%] w-[8%] rounded-full bg-black/12 blur-md" />
            <div className="absolute left-[40%] top-[17%] h-[60%] w-[20%] rounded-full bg-white/8 blur-xl" />
            <ShirtFabricOverlay />
          </div>

          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg) translateZ(54px)",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={src}
              alt={`${alt} Rückseite`}
              fill
              priority
              sizes="(max-width: 640px) 350px, 485px"
              className="object-contain brightness-[0.96] contrast-[1.06] drop-shadow-[0_55px_75px_rgba(0,0,0,0.27)]"
            />

            <div className="absolute left-[25%] top-[17%] h-[64%] w-[8%] rounded-full bg-white/14 blur-md" />
            <div className="absolute right-[24%] top-[17%] h-[64%] w-[8%] rounded-full bg-black/14 blur-md" />
            <div className="absolute left-[40%] top-[17%] h-[60%] w-[20%] rounded-full bg-white/6 blur-xl" />
            <ShirtFabricOverlay />
          </div>
        </div>

        <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black shadow-sm">
          {sideLabel}
        </div>

        <ShirtRotationMeter rotation={rotation} />

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs font-black shadow-sm">
          Ziehen zum Drehen
        </div>
      </div>

      <Shirt360Controls
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        resetRotation={() => setRotation(activeSide === "front" ? 0 : 180)}
      />
    </div>
  );
}

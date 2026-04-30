"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRPreview({
  url,
  variant,
}: {
  url: string;
  variant: string;
}) {
  const isHidden = variant === "Hidden QR";
  const isExtreme = variant === "Extreme QR";

  return (
    <div
      className={`rounded-sm ${
        isHidden
          ? "opacity-50 mix-blend-multiply"
          : isExtreme
          ? "opacity-35 mix-blend-overlay blur-[0.4px]"
          : "opacity-95"
      }`}
      style={{
        transform: isExtreme ? "scale(1.18)" : "scale(1)",
        filter: isHidden ? "contrast(1.15)" : "none",
      }}
    >
      <QRCodeSVG
        value={url || "https://platypus-shop.de"}
        size={82}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      />
    </div>
  );
}

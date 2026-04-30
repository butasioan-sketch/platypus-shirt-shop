"use client";

export default function QRMock({ variant }: { variant: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`w-24 h-24 ${
          variant === "Clean QR"
            ? "bg-black"
            : variant === "Hidden QR"
            ? "bg-black opacity-40"
            : "bg-black scale-125"
        }`}
      />
    </div>
  );
}

"use client";

export default function AddToCartToast({
  show,
  text,
}: {
  show: boolean;
  text: string;
}) {
  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black px-5 py-3 text-sm font-black text-white shadow-2xl">
      {text}
    </div>
  );
}

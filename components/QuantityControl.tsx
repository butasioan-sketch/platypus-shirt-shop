"use client";

export default function QuantityControl({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-300 bg-white p-2">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="h-10 w-10 rounded-xl bg-neutral-100 font-black"
      >
        −
      </button>

      <span className="w-8 text-center font-black">{quantity}</span>

      <button
        onClick={() => setQuantity(quantity + 1)}
        className="h-10 w-10 rounded-xl bg-neutral-100 font-black"
      >
        +
      </button>
    </div>
  );
}

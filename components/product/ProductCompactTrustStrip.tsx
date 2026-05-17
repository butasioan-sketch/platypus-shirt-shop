export default function ProductCompactTrustStrip() {
  const items = [
    "360° Vorschau",
    "Eigenproduktion",
    "Stripe Checkout",
    "Versand wählbar",
  ];

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="flex min-w-max gap-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-full border border-neutral-200 bg-white px-4 py-3 text-xs font-black text-neutral-700 shadow-sm"
          >
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}

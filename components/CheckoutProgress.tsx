export default function CheckoutProgress() {
  const steps = ["Warenkorb", "Adresse", "Versand", "Zahlung"];

  return (
    <div className="mb-5 grid grid-cols-4 gap-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`rounded-xl p-2 text-center text-[11px] font-black ${
            index === 0
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

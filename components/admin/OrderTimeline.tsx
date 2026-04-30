export default function OrderTimeline({ status }: { status: string }) {
  const steps = [
    { id: "offen", label: "Offen" },
    { id: "produktion", label: "Produktion" },
    { id: "fertig", label: "Fertig" },
  ];

  const activeIndex = steps.findIndex((s) => s.id === status);

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`rounded-2xl p-3 text-center text-xs font-black ${
            index <= activeIndex
              ? "bg-black text-white"
              : "bg-neutral-100 text-neutral-400"
          }`}
        >
          {step.label}
        </div>
      ))}
    </div>
  );
}

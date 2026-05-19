export default function OrderFulfillmentTimeline() {
  const steps = [
    {
      title: "Zahlung",
      text: "Stripe Zahlung prüfen und Screenshot/Referenz sichern.",
    },
    {
      title: "Order",
      text: "Bestellung im Admin erfassen oder importieren.",
    },
    {
      title: "Produktion",
      text: "Größe, Druckposition und Personalisierung prüfen.",
    },
    {
      title: "Qualität",
      text: "Shirt, Druck und Verpackung kontrollieren.",
    },
    {
      title: "Versand",
      text: "Versanddienstleister wählen und Paket vorbereiten.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Fulfillment Timeline
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Von Zahlung bis Versand
      </h2>

      <div className="mt-5 grid gap-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
          >
            <p className="text-sm font-black text-neutral-500">
              Schritt {index + 1}
            </p>

            <p className="mt-1 text-xl font-black">
              {step.title}
            </p>

            <p className="mt-1 text-sm font-bold text-neutral-600">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

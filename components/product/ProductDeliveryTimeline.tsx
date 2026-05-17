export default function ProductDeliveryTimeline() {
  const steps = [
    {
      title: "1. Bestellung",
      text: "Du wählst Shirt, Größe, Fit, Personalisierung und Versand.",
    },
    {
      title: "2. Prüfung",
      text: "Wir prüfen Drucktext, Position und Produktionsdaten.",
    },
    {
      title: "3. Produktion",
      text: "Das Shirt wird vorbereitet, gedruckt und kontrolliert.",
    },
    {
      title: "4. Versand",
      text: "Deine Bestellung wird verpackt und an den Versanddienstleister übergeben.",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Ablauf nach Bestellung
      </p>

      <div className="mt-4 grid gap-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="font-black">{step.title}</p>
            <p className="mt-1 text-sm font-bold text-neutral-600">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

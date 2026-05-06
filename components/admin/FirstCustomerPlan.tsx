export default function FirstCustomerPlan() {
  const steps = [
    {
      title: "1. Freund testen lassen",
      text: "Shop-Link schicken und beobachten, wo er hängen bleibt.",
    },
    {
      title: "2. Testbestellung durchführen",
      text: "Checkout, Versand, Zahlung und Admin prüfen.",
    },
    {
      title: "3. Shirt produzieren",
      text: "Druckqualität, Verpackung und Foto dokumentieren.",
    },
    {
      title: "4. Feedback einsammeln",
      text: "Passform, Stoff, Druck, Preis und Versand bewerten lassen.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        First Customer Plan
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Von Testshop zu erster Bestellung
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="font-black">{step.title}</p>
            <p className="mt-2 text-sm text-neutral-600">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

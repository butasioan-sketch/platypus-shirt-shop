export default function FAQBlock() {
  const faqs = [
    {
      q: "Wann wird mein Shirt produziert?",
      a: "Nach Zahlungseingang startet die Produktion. Bei Überweisung nach Geldeingang.",
    },
    {
      q: "Welche Farben gibt es?",
      a: "Aktuell fokussieren wir uns bewusst auf Weiß und Schwarz.",
    },
    {
      q: "Welche Passform hat das Shirt?",
      a: "Regular Fit. Ein klarer Standard-Schnitt für alle Größen.",
    },
    {
      q: "Welche Versandarten gibt es?",
      a: "DHL, Hermes, DPD und GLS sind als Versandoptionen vorbereitet.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Fragen vor dem Kauf
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Alles Wichtige auf einen Blick
      </h2>

      <div className="mt-5 grid gap-3">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="font-black">{faq.q}</p>
            <p className="mt-2 text-sm text-neutral-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NextSalesActions() {
  const actions = [
    {
      title: "Shop-Link teilen",
      text: "Heute an mindestens 3 Personen schicken.",
    },
    {
      title: "Testbestellung machen",
      text: "Checkout, Zahlung und Admin-Ablauf prüfen.",
    },
    {
      title: "Shirt produzieren",
      text: "Ein weißes und ein schwarzes Shirt bedrucken.",
    },
    {
      title: "Content erstellen",
      text: "Fotos/Videos für TikTok, Instagram und WhatsApp machen.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Sales Fokus
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Nächste Aktionen bis zur ersten Bestellung
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <div key={action.title} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="font-black">{action.title}</p>
            <p className="mt-2 text-sm text-neutral-600">{action.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

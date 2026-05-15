export default function BrandProofGrid() {
  const proof = [
    {
      title: "Live Shop",
      text: "Der Shop ist öffentlich erreichbar und wird per Deploy-Script veröffentlicht.",
    },
    {
      title: "Admin System",
      text: "Bestellungen, Lager, Newsletter, Waschtests und Produktionsdaten sind strukturiert.",
    },
    {
      title: "Payment Struktur",
      text: "Stripe Checkout ist vorbereitet und Zahlungsarten sind im System abgebildet.",
    },
    {
      title: "Produkt Viewer",
      text: "360° Shirt-Ansicht mit Rotation, Schatten, Stoff-Overlay und Studio-Frame.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-red-600">
        Proof
      </p>

      <h2 className="mt-3 text-3xl font-black sm:text-5xl">
        Was bereits funktioniert.
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {proof.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
          >
            <p className="text-xl font-black">{item.title}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-neutral-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

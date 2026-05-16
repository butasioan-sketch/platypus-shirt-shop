export default function PaymentTestPanel() {
  const tests = [
    "Stripe Secret Key in Vercel gesetzt",
    "NEXT_PUBLIC_SITE_URL gesetzt",
    "Karte als Zahlungsart testen",
    "Stripe Checkout Redirect prüfen",
    "Success URL prüfen",
    "Cancel URL prüfen",
    "Admin Bestellung prüfen",
    "Lagerbestand nach Bestellung prüfen",
  ];

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Payment Test
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Stripe & Checkout Prüfplan
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {tests.map((test) => (
          <div
            key={test}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-black"
          >
            ☐ {test}
          </div>
        ))}
      </div>
    </div>
  );
}

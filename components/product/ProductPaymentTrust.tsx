export default function ProductPaymentTrust() {
  return (
    <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Zahlung
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Sicher bezahlen über aktivierte Anbieter.
      </h2>

      <p className="mt-3 text-sm font-bold leading-6 text-neutral-600">
        Im Checkout wählst du deine Zahlungsart. Kartenzahlung läuft über Stripe.
        Weitere Zahlungsarten sind vorbereitet und werden je nach Anbieter aktiviert.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-neutral-50 p-3 text-center text-xs font-black">
          Karte
        </div>

        <div className="rounded-xl bg-neutral-50 p-3 text-center text-xs font-black">
          PayPal vorbereitet
        </div>

        <div className="rounded-xl bg-neutral-50 p-3 text-center text-xs font-black">
          Überweisung
        </div>
      </div>
    </div>
  );
}

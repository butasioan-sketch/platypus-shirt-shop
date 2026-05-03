import Link from "next/link";
import { shippingMethods, freeShippingFrom } from "../../data/shipping";

export default function VersandPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] p-5 sm:p-10 text-black">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="font-black underline">
          ← Zurück zum Shop
        </Link>

        <div className="mt-5 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6 sm:p-10">
          <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
            Versand & Zahlung
          </p>

          <h1 className="mt-3 text-4xl sm:text-6xl font-black">
            Versandoptionen für deine T-Shirts
          </h1>

          <p className="mt-4 text-neutral-600 max-w-2xl">
            Wähle im Checkout den passenden Versand. Kostenloser Versand ab {freeShippingFrom} €.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {shippingMethods.map((method) => (
            <div key={method.id} className="rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{method.name}</h2>
                  <p className="mt-1 text-neutral-600">{method.bestFor}</p>
                </div>

                <p className="text-2xl font-black">{method.price.toFixed(2)} €</p>
              </div>

              <div className="mt-5 rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
                <p className="text-sm text-neutral-500 font-bold">Lieferzeit</p>
                <p className="font-black">{method.time}</p>
              </div>

              <a
                href={method.url}
                target="_blank"
                className="mt-5 inline-block rounded-2xl bg-black px-5 py-3 font-black text-white"
              >
                Anbieter öffnen
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[2rem] bg-black text-white p-6 sm:p-8 shadow-xl">
          <h2 className="text-3xl font-black">Zahlungsarten</h2>
          <p className="mt-3 text-white/70">
            PayPal, Klarna, Revolut Pay, Apple Pay, Google Pay, Visa / Mastercard,
            Sofortüberweisung, SEPA Lastschrift und Girokonto / Überweisung sind strukturell vorbereitet.
          </p>
        </div>
      </div>
    </main>
  );
}

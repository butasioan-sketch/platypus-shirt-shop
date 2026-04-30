export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] p-6 sm:p-10 text-black">
      <div className="mx-auto max-w-3xl bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6 sm:p-10">
        <h1 className="text-4xl font-black">Impressum</h1>
        <p className="mt-6 text-neutral-600">
          Platzhalter für Anbieterkennzeichnung. Vor Veröffentlichung rechtlich prüfen lassen.
        </p>

        <div className="mt-6 space-y-2">
          <p><b>Firma:</b> Platypus Print Studio</p>
          <p><b>Adresse:</b> Musterstraße 1, 00000 Musterstadt</p>
          <p><b>E-Mail:</b> kontakt@platypus-shop.de</p>
        </div>
      </div>
    </main>
  );
}

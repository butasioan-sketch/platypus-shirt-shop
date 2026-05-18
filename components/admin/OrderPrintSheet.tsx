"use client";

export default function OrderPrintSheet() {
  function printOrders() {
    window.print();
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl print:hidden">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
        Produktionsschein
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Orders drucken
      </h2>

      <p className="mt-3 text-sm font-bold text-neutral-600">
        Drucke die aktuelle Order-Übersicht für Produktion, Qualitätskontrolle und Versand.
      </p>

      <button
        onClick={printOrders}
        className="mt-5 rounded-2xl bg-black px-5 py-3 font-black text-white"
      >
        Produktionsschein drucken
      </button>
    </div>
  );
}

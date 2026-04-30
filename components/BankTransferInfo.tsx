"use client";

import { bankAccount } from "../data/bank";

export default function BankTransferInfo({ orderReference }: { orderReference: string }) {
  return (
    <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
      <p className="font-black text-emerald-900">Girokonto / Überweisung</p>

      <div className="mt-3 text-sm text-emerald-900 space-y-1">
        <p><b>Empfänger:</b> {bankAccount.owner}</p>
        <p><b>IBAN:</b> {bankAccount.iban}</p>
        <p><b>BIC:</b> {bankAccount.bic}</p>
        <p><b>Bank:</b> {bankAccount.bank}</p>
        <p><b>Verwendungszweck:</b> {orderReference}</p>
      </div>

      <p className="mt-3 text-xs text-emerald-800">
        Die Produktion startet nach Zahlungseingang.
      </p>
    </div>
  );
}

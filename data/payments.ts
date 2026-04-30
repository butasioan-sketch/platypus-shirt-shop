export const paymentMethods = [
  {
    id: "paypal",
    label: "PayPal",
    provider: "paypal",
    type: "wallet",
    enabled: true,
    demoOnly: true,
    style: "bg-[#ffc439] text-[#003087]"
  },
  {
    id: "klarna",
    label: "Klarna",
    provider: "klarna",
    type: "buy_now_pay_later",
    enabled: true,
    demoOnly: true,
    style: "bg-[#ffb3c7] text-black"
  },
  {
    id: "revolut",
    label: "Revolut Pay",
    provider: "revolut",
    type: "wallet",
    enabled: true,
    demoOnly: true,
    style: "bg-[#0666eb] text-white"
  },
  {
    id: "apple_pay",
    label: "Apple Pay",
    provider: "stripe",
    type: "wallet",
    enabled: true,
    demoOnly: true,
    style: "bg-black text-white"
  },
  {
    id: "google_pay",
    label: "Google Pay",
    provider: "stripe",
    type: "wallet",
    enabled: true,
    demoOnly: true,
    style: "bg-white text-black border border-neutral-300"
  },
  {
    id: "card",
    label: "Visa / Mastercard",
    provider: "stripe",
    type: "card",
    enabled: true,
    demoOnly: true,
    style: "bg-neutral-100 text-black"
  },
  {
    id: "sofort",
    label: "Sofortüberweisung",
    provider: "stripe",
    type: "bank_redirect",
    enabled: true,
    demoOnly: true,
    style: "bg-[#ff6900] text-white"
  },
  {
    id: "sepa",
    label: "SEPA Lastschrift",
    provider: "stripe",
    type: "bank_debit",
    enabled: true,
    demoOnly: true,
    style: "bg-[#153e75] text-white"
  },
  {
    id: "bank_transfer",
    label: "Girokonto / Überweisung",
    provider: "manual_bank",
    type: "bank_transfer",
    enabled: true,
    demoOnly: true,
    style: "bg-emerald-700 text-white"
  }
];

export function getPaymentMethod(id: string) {
  return paymentMethods.find((method) => method.id === id);
}

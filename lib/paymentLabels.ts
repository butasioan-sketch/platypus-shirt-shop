import { paymentMethods } from "../data/payments";

export function getPaymentLabel(id: string) {
  return paymentMethods.find((m) => m.id === id)?.label || id || "Demo";
}

export function getPaymentProvider(id: string) {
  return paymentMethods.find((m) => m.id === id)?.provider || "demo";
}

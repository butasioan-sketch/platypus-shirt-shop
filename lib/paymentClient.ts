"use client";

export async function createPaymentSession(order: Record<string, unknown>) {
  const response = await fetch("/api/payments/create-checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Payment Session konnte nicht erstellt werden.");
  }

  return response.json();
}

export function redirectToPayment(session: { redirectUrl?: string }) {
  if (session?.redirectUrl && session.redirectUrl !== "/") {
    window.location.href = session.redirectUrl;
  }
}

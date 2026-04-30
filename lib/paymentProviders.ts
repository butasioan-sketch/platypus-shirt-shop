export function getProviderMode(provider: string) {
  const envMap: Record<string, boolean> = {
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
    klarna: Boolean(process.env.KLARNA_USERNAME && process.env.KLARNA_PASSWORD),
    revolut: Boolean(process.env.REVOLUT_API_KEY),
    manual_bank: true,
  };

  return envMap[provider] ? "ready" : "demo";
}

export default function PaymentStatusBadge({ mode }: { mode?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
        mode === "ready"
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {mode === "ready" ? "Provider bereit" : "Demo-Modus"}
    </span>
  );
}

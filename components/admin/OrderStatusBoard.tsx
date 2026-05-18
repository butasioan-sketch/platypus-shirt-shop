export default function OrderStatusBoard() {
  const statuses = [
    {
      label: "Neue Bestellungen",
      value: "0",
      color: "bg-blue-50 text-blue-900 border-blue-200",
    },
    {
      label: "Zahlung geprüft",
      value: "0",
      color: "bg-emerald-50 text-emerald-900 border-emerald-200",
    },
    {
      label: "In Produktion",
      value: "0",
      color: "bg-amber-50 text-amber-900 border-amber-200",
    },
    {
      label: "Versendet",
      value: "0",
      color: "bg-neutral-50 text-neutral-900 border-neutral-200",
    },
  ];

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-4">
      {statuses.map((status) => (
        <div
          key={status.label}
          className={`rounded-2xl border p-5 shadow-sm ${status.color}`}
        >
          <p className="text-xs font-black uppercase tracking-widest opacity-70">
            {status.label}
          </p>

          <p className="mt-3 text-4xl font-black">
            {status.value}
          </p>
        </div>
      ))}
    </div>
  );
}

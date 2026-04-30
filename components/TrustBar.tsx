export default function TrustBar() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-4">
      {[
        "Produktion in Deutschland",
        "Schwarz & Weiß Fokus",
        "360° Vorschau",
        "Mobile App Experience",
      ].map((item) => (
        <div
          key={item}
          className="rounded-2xl bg-white border border-neutral-200 p-4 text-center font-black shadow-sm"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

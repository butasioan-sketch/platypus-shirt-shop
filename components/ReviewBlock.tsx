export default function ReviewBlock() {
  const reviews = [
    {
      name: "Testkunde A",
      text: "Stoff fühlt sich stabil an und der Schnitt sitzt clean.",
    },
    {
      name: "Testkunde B",
      text: "Schwarz-Weiß Fokus wirkt hochwertig und minimalistisch.",
    },
    {
      name: "Produktionstest",
      text: "Waschtest und Druckparameter werden intern dokumentiert.",
    },
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Vertrauen
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Erste Qualitätsstimmen
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.name} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="font-black">★★★★★</p>
            <p className="mt-3 text-sm text-neutral-700">{review.text}</p>
            <p className="mt-3 text-xs font-black text-neutral-500">{review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

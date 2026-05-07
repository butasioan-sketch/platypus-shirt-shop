export default function CustomerFeedbackPanel() {
  const questions = [
    "Ist der Preis verständlich?",
    "Ist der Checkout einfach?",
    "Sind Versandkosten klar?",
    "Wirkt das Shirt hochwertig?",
    "Würdest du kaufen?",
    "Was fehlt dir noch?",
  ];

  return (
    <div className="mt-8 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
      <p className="text-sm font-black uppercase tracking-widest text-neutral-500">
        Feedback Fragen
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Fragen für erste Testkunden
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {questions.map((question) => (
          <div key={question} className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 font-black">
            {question}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

export default function ShareMessageGenerator() {
  const message =
    "Ich baue gerade PLATYPUS auf – einen Shirt Shop für minimalistische Schwarz-Weiß T-Shirts aus eigener Produktion. Schau mal rein: https://platypus-shirt-shop.vercel.app";

  function copyMessage() {
    navigator.clipboard.writeText(message);
    alert("Nachricht kopiert.");
  }

  return (
    <div className="mt-8 rounded-[2rem] bg-black p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        Verkaufsnachricht
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Direkt an Freunde schicken
      </h2>

      <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm font-bold text-white/80">
        {message}
      </p>

      <button
        onClick={copyMessage}
        className="mt-5 rounded-2xl bg-white px-5 py-3 font-black text-black"
      >
        Nachricht kopieren
      </button>
    </div>
  );
}

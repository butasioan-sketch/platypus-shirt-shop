"use client";

import { useState } from "react";

export default function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  function submit() {
    if (!email.includes("@")) {
      alert("Bitte gültige E-Mail eingeben.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("platypus-newsletter") || "[]");
    localStorage.setItem("platypus-newsletter", JSON.stringify([...existing, email]));

    setSaved(true);
    setEmail("");
  }

  return (
    <div className="mt-8 rounded-[2rem] bg-black p-6 text-white shadow-xl">
      <p className="text-sm font-black uppercase tracking-widest text-white/50">
        PLATYPUS Updates
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Erste Drops, Waschtests und neue Shirts nicht verpassen.
      </h2>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Deine E-Mail"
          className="flex-1 rounded-2xl bg-white px-5 py-4 font-bold text-black"
        />

        <button
          onClick={submit}
          className="rounded-2xl bg-white px-6 py-4 font-black text-black active:scale-[0.98]"
        >
          Eintragen
        </button>
      </div>

      {saved && (
        <p className="mt-3 text-sm font-bold text-emerald-300">
          ✅ Gespeichert. Du bist dabei.
        </p>
      )}
    </div>
  );
}

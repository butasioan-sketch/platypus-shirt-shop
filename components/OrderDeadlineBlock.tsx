"use client";

import { useEffect, useState } from "react";

export default function OrderDeadlineBlock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(16, 0, 0, 0);

      if (now > deadline) {
        deadline.setDate(deadline.getDate() + 1);
      }

      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);

      setTime(`${hours}h ${minutes}m`);
    }

    update();
    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 rounded-[2rem] bg-amber-50 border border-amber-200 p-6 text-amber-950 shadow-sm">
      <p className="text-sm font-black uppercase tracking-widest text-amber-700">
        Produktionsfenster
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Heute bestellen · Produktion vorbereiten
      </h2>

      <p className="mt-3 text-sm font-bold">
        Nächstes Produktionsfenster schließt in: {time || "wird geladen..."}
      </p>
    </div>
  );
}

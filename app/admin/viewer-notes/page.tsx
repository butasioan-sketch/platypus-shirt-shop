"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ViewerNote = {
  type: string;
  createdAt: string;
  message: string;
};

export default function ViewerNotesPage() {
  const [notes, setNotes] = useState<ViewerNote[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("platypus-viewer-notes") || "[]");
    setNotes(saved);
  }, []);

  function clearNotes() {
    if (!confirm("Viewer-Notizen wirklich löschen?")) return;
    localStorage.removeItem("platypus-viewer-notes");
    setNotes([]);
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] p-5 sm:p-10 text-black">
      <Link href="/admin" className="font-black underline">
        ← Zurück zum Admin
      </Link>

      <div className="mt-5 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6 sm:p-10">
        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
          Viewer Notes
        </p>

        <h1 className="mt-3 text-4xl sm:text-6xl font-black">
          360° Viewer Notizen
        </h1>

        <button
          onClick={clearNotes}
          disabled={notes.length === 0}
          className="mt-6 rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
        >
          Notizen löschen
        </button>
      </div>

      <div className="mt-8 grid gap-3">
        {notes.length === 0 && (
          <div className="rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
            <p className="font-black text-neutral-500">Noch keine Viewer-Notizen gespeichert.</p>
          </div>
        )}

        {notes.map((note, index) => (
          <div key={`${note.createdAt}-${index}`} className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm">
            <p className="font-black">{note.message}</p>
            <p className="mt-2 text-xs font-bold text-neutral-500">{note.createdAt}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

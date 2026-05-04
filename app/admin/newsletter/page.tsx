"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewsletterAdminPage() {
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("platypus-newsletter") || "[]");
    setEmails(saved);
  }, []);

  function exportCSV() {
    const header = ["E-Mail"];
    const rows = emails.map((email) => [email]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "platypus-newsletter.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  function clearEmails() {
    if (!confirm("Newsletter-Liste wirklich löschen?")) return;
    localStorage.removeItem("platypus-newsletter");
    setEmails([]);
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] p-5 sm:p-10 text-black">
      <Link href="/admin" className="font-black underline">
        ← Zurück zum Admin
      </Link>

      <div className="mt-5 rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6 sm:p-10">
        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
          Newsletter
        </p>

        <h1 className="mt-3 text-4xl sm:text-6xl font-black">
          E-Mail Leads
        </h1>

        <p className="mt-4 text-neutral-600">
          Lokale Newsletter-Einträge aus dem Shop.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            disabled={emails.length === 0}
            className="rounded-2xl bg-black px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            CSV exportieren
          </button>

          <button
            onClick={clearEmails}
            disabled={emails.length === 0}
            className="rounded-2xl bg-red-600 px-5 py-3 font-black text-white disabled:bg-neutral-300 disabled:text-neutral-500"
          >
            Liste leeren
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3">
        {emails.length === 0 && (
          <div className="rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6">
            <p className="font-black text-neutral-500">Noch keine E-Mails gespeichert.</p>
          </div>
        )}

        {emails.map((email, index) => (
          <div
            key={`${email}-${index}`}
            className="rounded-2xl bg-white border border-neutral-200 p-4 font-black shadow-sm"
          >
            {email}
          </div>
        ))}
      </div>
    </main>
  );
}

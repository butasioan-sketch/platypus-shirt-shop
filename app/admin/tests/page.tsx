"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "../../../data/products";
import { useTests } from "../../../store/tests";
import TestRatingBadge from "../../../components/admin/TestRatingBadge";
import TestStats from "../../../components/admin/TestStats";
import ExportTestsButton from "../../../components/admin/ExportTestsButton";
import TestPhotoPreview from "../../../components/admin/TestPhotoPreview";
import ImageUploadField from "../../../components/admin/ImageUploadField";
import TestChecklist from "../../../components/admin/TestChecklist";
import QualityRecommendation from "../../../components/admin/QualityRecommendation";

export default function WashTestsPage() {
  const tests = useTests((state) => state.tests);
  const addTest = useTests((state) => state.addTest);
  const removeTest = useTests((state) => state.removeTest);

  const [form, setForm] = useState({
    productName: products[0].name,
    color: products[0].color,
    print: products[0].print,
    pressTemp: "180°C",
    pressTime: "60 Sek.",
    pressure: "Mittel",
    washCount: 1,
    washTemp: "30°C",
    dryer: "Nein",
    rating: "Gut",
    shrinkage: "0%",
    beforePhoto: "",
    afterPhoto: "",
    notes: "",
  });

  function saveTest() {
    addTest({
      id: crypto.randomUUID(),
      ...form,
      createdAt: new Date().toISOString(),
    } as any);

    setForm({ ...form, notes: "", washCount: form.washCount + 1 });
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-black p-5 sm:p-10">
      <Link href="/admin" className="font-black underline">
        ← Zurück zum Admin
      </Link>

      <div className="mt-5 bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6 sm:p-10">
        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
          Qualitätssicherung
        </p>

        <h1 className="mt-3 text-4xl sm:text-6xl font-black">
          Wasch- & Drucktest Protokoll
        </h1>

        <p className="mt-4 text-neutral-600">
          Für echte Produktion: Presswerte, Waschgang, Schrumpfung, Haptik und Haltbarkeit dokumentieren.
        </p>
      </div>

      <TestStats tests={tests} />
      <QualityRecommendation tests={tests} />
      <ExportTestsButton tests={tests} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="space-y-6">
        <TestChecklist />

        <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6">
          <h2 className="text-2xl font-black mb-5">Neuer Test</h2>

          <select
            className="w-full mb-3 p-3 rounded-xl border border-neutral-300 bg-neutral-50"
            value={form.productName}
            onChange={(e) => {
              const product = products.find((p) => p.name === e.target.value)!;
              setForm({
                ...form,
                productName: product.name,
                color: product.color,
                print: product.print,
              });
            }}
          >
            {products.map((product) => (
              <option key={product.id}>{product.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input className="p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.pressTemp} onChange={(e) => setForm({ ...form, pressTemp: e.target.value })} placeholder="Temperatur" />
            <input className="p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.pressTime} onChange={(e) => setForm({ ...form, pressTime: e.target.value })} placeholder="Presszeit" />
          </div>

          <select className="w-full mt-3 p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.pressure} onChange={(e) => setForm({ ...form, pressure: e.target.value })}>
            <option>Leicht</option>
            <option>Mittel</option>
            <option>Stark</option>
          </select>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <input type="number" className="p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.washCount} onChange={(e) => setForm({ ...form, washCount: Number(e.target.value) })} placeholder="Waschgang" />
            <input className="p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.washTemp} onChange={(e) => setForm({ ...form, washTemp: e.target.value })} placeholder="Waschtemp." />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <select className="p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.dryer} onChange={(e) => setForm({ ...form, dryer: e.target.value })}>
              <option>Trockner: Nein</option>
              <option>Trockner: Ja</option>
            </select>

            <input className="p-3 rounded-xl border border-neutral-300 bg-neutral-50" value={form.shrinkage} onChange={(e) => setForm({ ...form, shrinkage: e.target.value })} placeholder="Schrumpfung" />
          </div>

          <select
            className="w-full mt-3 p-3 rounded-xl border border-neutral-300 bg-neutral-50"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          >
            <option>Sehr gut</option>
            <option>Gut</option>
            <option>Okay</option>
            <option>Problem</option>
            <option>Nicht verkaufen</option>
          </select>

          <div className="mt-3 grid gap-3">
            <ImageUploadField
              label="Vorher Foto hochladen"
              value={form.beforePhoto}
              onChange={(value) => setForm({ ...form, beforePhoto: value })}
            />

            <ImageUploadField
              label="Nachher Foto hochladen"
              value={form.afterPhoto}
              onChange={(value) => setForm({ ...form, afterPhoto: value })}
            />
          </div>

          <textarea
            className="w-full mt-3 mb-4 p-3 rounded-xl border border-neutral-300 bg-neutral-50 min-h-32"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Notizen: Farbe, Risse, Schrumpfung, Haptik, Foto vorher/nachher?"
          />

          <button onClick={saveTest} className="w-full bg-black text-white py-4 rounded-2xl font-black">
            Test speichern
          </button>
        </div>
      </div>

        <div className="space-y-4">
          {tests.length === 0 && (
            <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6">
              <p className="font-black text-neutral-500">Noch keine Waschtests gespeichert.</p>
            </div>
          )}

          {tests.map((test: any) => (
            <div key={test.id} className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs font-black text-neutral-500 uppercase">
                    {new Date(test.createdAt).toLocaleString("de-DE")}
                  </p>

                  <h2 className="text-2xl font-black mt-1">{test.productName}</h2>

                  <p className="text-neutral-600">
                    {test.color} · {test.print} · Waschgang {test.washCount}
                  </p>

                  <div className="mt-3">
                    <TestRatingBadge rating={test.rating} />
                  </div>
                </div>

                <button onClick={() => removeTest(test.id)} className="text-red-600 font-black">
                  Löschen
                </button>
              </div>

              <div className="mt-4 grid sm:grid-cols-5 gap-3">
                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
                  <p className="text-xs text-neutral-500 font-bold">Presse</p>
                  <p className="font-black">{test.pressTemp}</p>
                </div>

                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
                  <p className="text-xs text-neutral-500 font-bold">Zeit</p>
                  <p className="font-black">{test.pressTime}</p>
                </div>

                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
                  <p className="text-xs text-neutral-500 font-bold">Druck</p>
                  <p className="font-black">{test.pressure}</p>
                </div>

                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
                  <p className="text-xs text-neutral-500 font-bold">Wäsche</p>
                  <p className="font-black">{test.washTemp}</p>
                </div>

                <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
                  <p className="text-xs text-neutral-500 font-bold">Schrumpfung</p>
                  <p className="font-black">{test.shrinkage}</p>
                </div>
              </div>

              <TestPhotoPreview beforePhoto={test.beforePhoto} afterPhoto={test.afterPhoto} />

              {test.notes && (
                <p className="mt-4 rounded-2xl bg-neutral-50 border border-neutral-200 p-4 text-sm">
                  {test.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

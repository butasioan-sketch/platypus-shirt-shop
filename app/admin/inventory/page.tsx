"use client";

import Link from "next/link";
import { products } from "../../../data/products";
import { useInventory } from "../../../store/inventory";
import RestockList from "../../../components/admin/RestockList";
import ExportInventoryButton from "../../../components/admin/ExportInventoryButton";

export default function InventoryPage() {
  const stock = useInventory((state) => state.stock);
  const setStock = useInventory((state) => state.setStock);
  const setMinStock = useInventory((state) => state.setMinStock);

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-black p-5 sm:p-10">
      <Link href="/admin" className="font-black underline">
        ← Zurück zum Admin
      </Link>

      <div className="mt-5 bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6 sm:p-10">
        <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
          Lagerverwaltung
        </p>

        <h1 className="mt-3 text-4xl sm:text-6xl font-black">
          T-Shirt Bestand
        </h1>

        <p className="mt-4 text-neutral-600">
          Bestand nach Farbe und Größe verwalten. Warnung erscheint bei niedrigem Lagerbestand.
        </p>
      </div>

      <RestockList />
      <ExportInventoryButton stock={stock} />

      <div className="mt-8 grid gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6">
            <h2 className="text-3xl font-black">{product.name}</h2>
            <p className="text-neutral-600">{product.color} · {product.print}</p>

            <div className="mt-6 grid gap-3">
              {stock
                .filter((item) => item.productId === product.id)
                .map((item) => {
                  const low = item.stock <= item.minStock;

                  return (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className={`grid grid-cols-[70px_1fr_1fr] gap-3 items-center rounded-2xl border p-4 ${
                        low
                          ? "bg-red-50 border-red-200"
                          : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <p className="text-xl font-black">{item.size}</p>

                      <input
                        type="number"
                        value={item.stock}
                        onChange={(e) =>
                          setStock(product.id, item.size, Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-neutral-300 bg-white p-3 font-black"
                      />

                      <input
                        type="number"
                        value={item.minStock}
                        onChange={(e) =>
                          setMinStock(product.id, item.size, Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-neutral-300 bg-white p-3 font-black"
                      />

                      <p className="col-span-3 text-sm font-black">
                        {low ? "⚠️ Nachbestellen" : "✅ Bestand ok"}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

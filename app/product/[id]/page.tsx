"use client";

import { useParams } from "next/navigation";
import { products } from "../../../data/products";
import ProductCard from "../../../components/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-black text-xl">Produkt nicht gefunden</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ed] p-5 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <ProductCard product={product} />
      </div>
    </main>
  );
}

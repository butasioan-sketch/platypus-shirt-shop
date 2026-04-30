"use client";

import Link from "next/link";
import { useState } from "react";
import Shirt360 from "./Shirt360";
import ProductBadge from "./ProductBadge";
import SizeGuide from "./SizeGuide";
import QuantityControl from "./QuantityControl";
import AddToCartToast from "./AddToCartToast";
import ProductSpecs from "./ProductSpecs";
import StockBadge from "./StockBadge";
import { useCart } from "../store/cart";
import { useInventory } from "../store/inventory";
import { trackAddToCart } from "../lib/analytics";

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductCard({ product }: { product: any }) {
  const addToCart = useCart((state) => state.addToCart);
  const stock = useInventory((state) => state.stock);

  const [size, setSize] = useState("M");
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [showGuide, setShowGuide] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(false);

  const stockItem = stock.find((s) => s.productId === product.id && s.size === size);
  const availableStock = stockItem?.stock || 0;
  const canBuy = availableStock > 0 && quantity <= availableStock;

  function handleAdd() {
    if (!canBuy) {
      alert("Nicht genug Bestand für diese Größe.");
      return;
    }

    const cartProduct = { ...product, size, fit: "Regular", quantity };
    addToCart(cartProduct);
    trackAddToCart(cartProduct);

    setToast(true);
    setTimeout(() => setToast(false), 1200);
  }

  return (
    <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl overflow-hidden">
      <AddToCartToast show={toast} text={`${quantity}x ${product.name} hinzugefügt`} />

      <div className="bg-[radial-gradient(circle_at_50%_35%,#ffffff,#eeeeee_55%,#dddddd)] border-b border-neutral-200">
        <Shirt360 src={product.image} alt={product.name} activeSide={activeSide} />
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <ProductBadge label={product.color} />
          <ProductBadge label={product.print} />
          <ProductBadge label="Regular Fit" />
          <ProductBadge label="185 g/m²" />
        </div>

        <div className="flex justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">{product.name}</h2>
            <p className="text-neutral-600 mt-1">{product.description}</p>
          </div>

          <p className="text-3xl font-black whitespace-nowrap">{product.price} €</p>
        </div>

        <Link
          href={`/product/${product.id}`}
          className="mt-4 inline-block rounded-full border border-neutral-300 px-4 py-2 text-sm font-black"
        >
          Produktdetail öffnen
        </Link>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={() => setActiveSide("front")} className={`p-4 rounded-2xl border font-black ${activeSide === "front" ? "bg-black text-white" : "bg-white border-neutral-300"}`}>
            Vorderseite
          </button>

          <button onClick={() => setActiveSide("back")} className={`p-4 rounded-2xl border font-black ${activeSide === "back" ? "bg-black text-white" : "bg-white border-neutral-300"}`}>
            Rückseite
          </button>
        </div>

        <ProductSpecs product={product} />

        <div className="mt-6 mb-3 flex justify-between items-center">
          <p className="font-black">Größe</p>
          <button onClick={() => setShowGuide(!showGuide)} className="text-sm font-black underline">
            Größentabelle
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {sizes.map((s) => {
            const current = stock.find((item) => item.productId === product.id && item.size === s);
            const empty = !current || current.stock <= 0;

            return (
              <button
                key={s}
                onClick={() => setSize(s)}
                disabled={empty}
                className={`py-3 rounded-xl border font-black ${
                  size === s
                    ? "bg-black text-white"
                    : empty
                    ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                    : "bg-white border-neutral-300"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        <StockBadge productId={product.id} size={size} />

        {showGuide && <SizeGuide />}

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-black">Menge</p>
            <p className="text-sm text-neutral-500">Maximal verfügbar: {availableStock}</p>
          </div>

          <QuantityControl quantity={quantity} setQuantity={setQuantity} />
        </div>

        <button
          onClick={handleAdd}
          disabled={!canBuy}
          className={`mt-6 w-full py-4 rounded-2xl font-black text-lg active:scale-[0.98] ${
            canBuy ? "bg-black text-white" : "bg-neutral-300 text-neutral-500"
          }`}
        >
          {canBuy ? `${quantity}x in den Warenkorb` : "Nicht verfügbar"}
        </button>
      </div>
    </div>
  );
}

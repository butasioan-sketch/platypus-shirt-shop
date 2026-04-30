"use client";

import { useCart } from "../store/cart";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const items = useCart((state) => state.items);
  const setItems = useCart((state) => state.addToCart); // Wir brauchen remove später, Update in store nötig

  const removeItem = (indexToRemove: number) => {
    useCart.setState((state) => ({
      items: state.items.filter((_, i) => i !== indexToRemove),
    }));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="fixed top-16 right-5 bg-white text-black p-5 rounded-xl w-80 max-h-[80vh] overflow-y-auto shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">🛒 Warenkorb</h2>
        {items.length === 0 ? (
          <p>Dein Warenkorb ist leer.</p>
        ) : (
          <>
            {items.map((item, index) => (
              <div key={index} className="mb-3 border-b border-neutral-300 pb-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p>Preis: {item.price} €</p>
                </div>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => removeItem(index)}
                >
                  ❌
                </button>
              </div>
            ))}
            <p className="mt-4 font-bold text-lg">Gesamt: {totalPrice.toFixed(2)} €</p>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

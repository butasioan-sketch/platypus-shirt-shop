"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: number;
  name: string;
  price: number;
  color: string;
  print: string;
  image: string;
  size: string;
  fit: "Regular";
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
};

function itemKey(item: any) {
  return `${item.id}-${item.size}-Regular`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const nextItem = {
            ...item,
            fit: "Regular",
            quantity: item.quantity || 1,
          };

          const key = itemKey(nextItem);
          const existing = state.items.find((i) => itemKey(i) === key);

          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i) === key
                  ? { ...i, quantity: i.quantity + nextItem.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, nextItem] };
        }),

      removeFromCart: (key) =>
        set((state) => ({
          items: state.items.filter((item) => itemKey(item) !== key),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "platypus-cart" }
  )
);

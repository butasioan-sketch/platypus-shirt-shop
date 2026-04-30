"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type StockItem = {
  productId: number;
  size: string;
  stock: number;
  minStock: number;
};

type InventoryState = {
  stock: StockItem[];
  setStock: (productId: number, size: string, stock: number) => void;
  setMinStock: (productId: number, size: string, minStock: number) => void;
  reduceStock: (productId: number, size: string, quantity: number) => void;
};

const sizes = ["S", "M", "L", "XL", "XXL"];

const initialStock: StockItem[] = [1, 2].flatMap((productId) =>
  sizes.map((size) => ({
    productId,
    size,
    stock: 10,
    minStock: 3,
  }))
);

export const useInventory = create<InventoryState>()(
  persist(
    (set) => ({
      stock: initialStock,

      setStock: (productId, size, stock) =>
        set((state) => ({
          stock: state.stock.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, stock }
              : item
          ),
        })),

      setMinStock: (productId, size, minStock) =>
        set((state) => ({
          stock: state.stock.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, minStock }
              : item
          ),
        })),

      reduceStock: (productId, size, quantity) =>
        set((state) => ({
          stock: state.stock.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, stock: Math.max(0, item.stock - quantity) }
              : item
          ),
        })),
    }),
    { name: "platypus-inventory" }
  )
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  items: any[];
  total: number;
  status: "offen" | "produktion" | "fertig";
};

type OrderState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: Order["status"]) => void;
};

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),
    }),
    {
      name: "platypus-orders",
    }
  )
);

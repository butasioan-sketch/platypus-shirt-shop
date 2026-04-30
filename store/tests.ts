"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WashTest = {
  id: string;
  productName: string;
  color: string;
  print: string;
  pressTemp: string;
  pressTime: string;
  pressure: string;
  washCount: number;
  washTemp: string;
  dryer: string;
  shrinkage: string;
  rating: string;
  beforePhoto: string;
  afterPhoto: string;
  notes: string;
  createdAt: string;
};

type TestState = {
  tests: WashTest[];
  addTest: (test: WashTest) => void;
  removeTest: (id: string) => void;
};

export const useTests = create<TestState>()(
  persist(
    (set) => ({
      tests: [],

      addTest: (test) =>
        set((state) => ({
          tests: [test, ...state.tests],
        })),

      removeTest: (id) =>
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
        })),
    }),
    { name: "platypus-wash-tests" }
  )
);

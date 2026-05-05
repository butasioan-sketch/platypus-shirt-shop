"use client";

import { useRouter } from "next/navigation";

export default function DirectCheckoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/cart")}
      className="mt-6 w-full rounded-2xl bg-black px-6 py-5 text-xl font-black text-white shadow-xl active:scale-[0.98]"
    >
      🔥 Direkt zum Checkout
    </button>
  );
}

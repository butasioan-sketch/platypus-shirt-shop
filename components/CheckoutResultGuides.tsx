"use client";

import { useSearchParams } from "next/navigation";
import CheckoutSuccessGuide from "./CheckoutSuccessGuide";
import CheckoutCancelGuide from "./CheckoutCancelGuide";

export default function CheckoutResultGuides() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  if (payment === "success") {
    return <CheckoutSuccessGuide />;
  }

  if (payment === "cancel") {
    return <CheckoutCancelGuide />;
  }

  return null;
}

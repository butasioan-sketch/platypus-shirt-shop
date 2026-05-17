"use client";

import { products } from "../data/products";
import Checkout from "../components/Checkout";
import ProductCard from "../components/ProductCard";
import AppHeader from "../components/AppHeader";
import MobileBottomBar from "../components/MobileBottomBar";
import HeroSection from "../components/HeroSection";
import ProductSectionHeader from "../components/ProductSectionHeader";
import ProductSectionTrust from "../components/ProductSectionTrust";
import PaymentResultBanner from "../components/PaymentResultBanner";
import CheckoutResultGuides from "../components/CheckoutResultGuides";
import AppFooter from "../components/AppFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f3ed] text-neutral-950 pb-28">
      <AppHeader />

      <section className="px-5 sm:px-10 pt-8 sm:pt-12">
        <PaymentResultBanner />
        <CheckoutResultGuides />
        <HeroSection />

        <ProductSectionHeader />
        <ProductSectionTrust />

        <div id="produkte" className="mt-8 grid gap-8 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <AppFooter />
      <MobileBottomBar />
      <Checkout />
    </main>
  );
}

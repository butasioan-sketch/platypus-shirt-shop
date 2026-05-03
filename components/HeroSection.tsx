import TrustBar from "./TrustBar";
import ShirtMaterialInfo from "./product/ShirtMaterialInfo";
import ConversionBar from "./ConversionBar";
import UrgencyBar from "./UrgencyBar";
import FirstSaleChecklist from "./FirstSaleChecklist";
import HeroActions from "./HeroActions";

export default function HeroSection() {
  return (
    <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-xl p-6 sm:p-10">
      <p className="text-neutral-500 font-black uppercase tracking-widest text-xs">
        Professional Product Customizer
      </p>

      <h1 className="mt-4 text-4xl sm:text-7xl font-black tracking-tight max-w-5xl">
        Premium T-Shirts. Realistisch konfigurierbar.
      </h1>

      <p className="mt-5 text-neutral-600 max-w-2xl text-base sm:text-lg">
        Schwarz und Weiß. 360° Vorschau. App-ähnlicher Checkout. Optimiert für deine eigene Print-Produktion.
      </p>

      <HeroActions />
      <UrgencyBar />
      <ConversionBar />
      <ShirtMaterialInfo />
      <TrustBar />
      <FirstSaleChecklist />
    </div>
  );
}

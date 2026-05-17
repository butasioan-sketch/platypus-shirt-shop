import ShirtViewerTips from "./ShirtViewerTips";
import ShirtViewerQualityPanel from "./ShirtViewerQualityPanel";
import ShirtViewerMobileHint from "./ShirtViewerMobileHint";
import ShirtViewerLegend from "./ShirtViewerLegend";
import ShirtViewerPremiumFrame from "./ShirtViewerPremiumFrame";

export default function ShirtStudioFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_30%,#ffffff,#eeeeee_55%,#d9d9d9)]">
      <div className="absolute left-6 top-6 rounded-full bg-white/80 px-4 py-2 text-xs font-black shadow-sm">
        360° Studio Preview
      </div>

      <div className="absolute right-6 top-6 rounded-full bg-black px-4 py-2 text-xs font-black text-white shadow-sm">
        Drag / Touch
      </div>

      <ShirtViewerPremiumFrame />
      {children}
      <ShirtViewerTips />
      <ShirtViewerQualityPanel />
      <ShirtViewerMobileHint />
      <ShirtViewerLegend />
    </div>
  );
}

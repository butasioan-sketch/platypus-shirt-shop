import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function AppFooter() {
  return (
    <footer className="px-5 sm:px-10 pb-36 pt-10">
      <div className="rounded-[2rem] bg-white border border-neutral-200 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-black">PLATYPUS</p>
              <p className="text-neutral-600 mt-1">
                Print Studio · Schwarz & Weiß · Custom T-Shirts
              </p>
            </div>

            <SocialLinks />
          </div>

          <div className="flex flex-wrap gap-4 border-t border-neutral-200 pt-5 text-sm font-black text-neutral-600">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/agb">AGB</Link>
            <Link href="/versand">Versand & Zahlung</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

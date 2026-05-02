import type { Metadata, Viewport } from "next";
import TrackingScripts from "../components/TrackingScripts";
import Preload from "../components/Preload";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLATYPUS Shirt Shop",
  description: "Minimalistische Premium Shirts · Schwarz & Weiß",
  applicationName: "PLATYPUS",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Preload />
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}

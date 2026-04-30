import type { Metadata, Viewport } from "next";
import TrackingScripts from "../components/TrackingScripts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Platypus Shirt Shop",
  description: "Professioneller T-Shirt Customizer für Schwarz und Weiß",
  applicationName: "Platypus",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
        <TrackingScripts />
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const abril = localFont({ src: "./fonts/AbrilFatface-Regular.ttf", variable: "--font-abril", display: "swap" });
const pacifico = localFont({ src: "./fonts/Pacifico-Regular.ttf", variable: "--font-pacifico", display: "swap" });
const bowlby = localFont({ src: "./fonts/BowlbyOne-Regular.ttf", variable: "--font-bowlby", display: "swap" });
const dmserif = localFont({ src: "./fonts/DMSerifDisplay-Regular.ttf", variable: "--font-dmserif", display: "swap" });

export const metadata: Metadata = {
  title: `${BRAND.name} · Live party games for teams`,
  description: BRAND.tagline,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06201A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${abril.variable} ${pacifico.variable} ${bowlby.variable} ${dmserif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

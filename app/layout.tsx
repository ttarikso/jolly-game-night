import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const pacifico = localFont({ src: "./fonts/Pacifico-Regular.ttf", variable: "--font-pacifico", display: "swap" });

export const metadata: Metadata = {
  title: `${BRAND.name} · Live party games for teams`,
  description: BRAND.tagline,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#06201A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable} ${pacifico.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

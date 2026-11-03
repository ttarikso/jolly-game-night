import type { Metadata, Viewport } from "next";
import { Nunito, Fredoka, Mountains_of_Christmas } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { BRAND } from "@/lib/brand";
import { Toaster } from "@/components/base/toast/toast";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const mountains = Mountains_of_Christmas({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-festive",
  display: "swap",
});

const pacifico = localFont({ src: "./fonts/Pacifico-Regular.ttf", variable: "--font-pacifico", display: "swap" });

export const metadata: Metadata = {
  title: `${BRAND.name} · Live Christmas Party Games`,
  description: BRAND.tagline,
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A2E1F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fredoka.variable} ${mountains.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="font-sans antialiased min-h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

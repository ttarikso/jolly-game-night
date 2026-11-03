import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: ["text-xl", "text-lg"], md: ["text-3xl", "text-2xl"], lg: ["text-6xl md:text-7xl", "text-5xl md:text-6xl"] }[size];
  const [first, ...rest] = BRAND.name.split(" ");
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span className={`font-script text-gold-400 ${s[1]}`}>{first}</span>
      <span className={`font-display text-cream-100 ${s[0]} -mt-1 tracking-wide uppercase`}>{rest.join(" ")}</span>
    </span>
  );
}

export function Header({ right }: { right?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto w-full">
      <Link href="/" aria-label="Home"><Logo size="sm" /></Link>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

export function Stage({ theme = "pine", children, className = "" }: { theme?: string; children: React.ReactNode; className?: string }) {
  return <div className={`stage theme-${theme} ${className}`}>{children}</div>;
}

export const OPTION_STYLE = [
  { bg: "bg-cran-600", ring: "ring-cran-500", sym: "★", text: "text-white" },
  { bg: "bg-gold-500", ring: "ring-gold-400", sym: "◆", text: "text-ink" },
  { bg: "bg-pine-600", ring: "ring-pine-600", sym: "●", text: "text-white" },
  { bg: "bg-[#2B4C8C]", ring: "ring-[#2B4C8C]", sym: "▲", text: "text-white" },
];

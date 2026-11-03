import Link from "next/link";
import { Header, Logo, Stage } from "@/components/ui";
import { BRAND } from "@/lib/brand";
import { FORMAT_INFO, Format } from "@/lib/types";

const STEPS = [
  ["Activate", "Enter your Etsy order number once. You get a private access key."],
  ["Customize", "Start from a ready Christmas pack or a blank game. Add as many questions as you like."],
  ["Play live", "Put the game on the big screen or share it on Zoom. Everyone joins from their phone with a PIN."],
];

export default function Home() {
  return (
    <Stage theme="pine">
      <Header right={<><Link href="/join" className="btn btn-ghost">Join a game</Link><Link href="/dashboard" className="btn btn-gold">My games</Link></>} />
      <main className="max-w-6xl mx-auto px-5 pb-20">
        <section className="text-center pt-10 pb-14">
          <Logo size="lg" />
          <p className="mt-6 text-xl md:text-2xl text-cream-200 max-w-2xl mx-auto">{BRAND.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/redeem" className="btn btn-gold text-lg px-7 py-3">I bought it on Etsy · Activate</Link>
            <Link href="/join" className="btn btn-ghost text-lg px-7 py-3">I have a game PIN</Link>
          </div>
          <p className="mt-4 text-sm text-cream-200/70">Made for office parties, HR team events, classrooms and family nights. No player accounts, no app to install.</p>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-ink font-block grid place-items-center">{i + 1}</div>
              <h3 className="mt-4 font-serif text-2xl text-gold-400">{t}</h3>
              <p className="mt-2 text-cream-200">{d}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-4xl text-center">Four ways to play</h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {(Object.keys(FORMAT_INFO) as Format[]).map((f) => (
              <div key={f} className="card p-6">
                <h3 className="font-serif text-2xl text-cran-600">{FORMAT_INFO[f].name}</h3>
                <p className="mt-2">{FORMAT_INFO[f].blurb}</p>
                <p className="mt-2 text-sm text-pine-700 font-semibold">{FORMAT_INFO[f].phones}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 text-center text-sm text-cream-200/60">
          © {new Date().getFullYear()} {BRAND.shop} · <a className="underline" href={BRAND.etsy}>Etsy shop</a>
        </footer>
      </main>
    </Stage>
  );
}

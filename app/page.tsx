import Link from "next/link";
import {
  RiSparkling2Fill,
  RiKey2Line,
  RiSmartphoneLine,
  RiTv2Line,
  RiEdit2Line,
  RiQuestionAnswerLine,
  RiGridFill,
  RiTrophyLine,
  RiNotificationBadgeLine,
} from "@remixicon/react";
import { Header, Logo, Stage } from "@/components/ui";
import { Chip } from "@/components/base/badges/chip";
import { BRAND } from "@/lib/brand";
import { FORMAT_INFO, Format } from "@/lib/types";

const STEPS = [
  {
    icon: RiKey2Line,
    title: "1. Activate with Etsy Order",
    desc: "Enter your Etsy order number once to unlock your private studio and access key.",
  },
  {
    icon: RiEdit2Line,
    title: "2. Pick or Generate Questions",
    desc: "Choose from 12 Christmas game packs or generate fun holiday trivia in one click.",
  },
  {
    icon: RiTv2Line,
    title: "3. Host on the Big Screen",
    desc: "Put the game on your TV or Zoom. Everyone scans the QR code on their phone — no login required!",
  },
];

const FORMAT_ICONS: Record<Format, typeof RiQuestionAnswerLine> = {
  mc: RiQuestionAnswerLine,
  board: RiGridFill,
  top: RiTrophyLine,
  buzzer: RiNotificationBadgeLine,
};

export default function Home() {
  return (
    <Stage theme="pine">
      <Header
        right={
          <>
            <Link href="/join" className="btn btn-ghost text-sm">
              <RiSmartphoneLine className="size-4" /> Join with PIN
            </Link>
            <Link href="/dashboard" className="btn btn-gold text-sm">
              My Games
            </Link>
          </>
        }
      />
      <main className="max-w-6xl mx-auto px-5 pb-24">
        <section className="text-center pt-10 pb-14">
          <div className="mb-5 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-caption-1-semibold text-gold-300 backdrop-blur-sm">
              <RiSparkling2Fill className="size-3.5 text-gold-400" />
              12 Ready-to-Play Packs + Built-In Christmas Question Generator
            </span>
          </div>
          <Logo size="lg" />
          <p className="mt-5 text-lg md:text-xl text-cream-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            {BRAND.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/redeem" className="btn btn-gold text-base px-7 py-3.5 shadow-lg">
              <RiKey2Line className="size-5" /> I bought it on Etsy · Activate
            </Link>
            <Link href="/join" className="btn btn-ghost text-base px-7 py-3.5">
              <RiSmartphoneLine className="size-5" /> I have a game PIN
            </Link>
          </div>
          <p className="mt-4 text-caption-1-medium text-cream-200/70">
            Made for office parties, family gatherings, classrooms &amp; Zoom nights · Zero app downloads or player sign-ups.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-3xl bg-white/8 border border-white/15 p-6 backdrop-blur-md transition hover:border-gold-400/50"
              >
                <div className="w-11 h-11 rounded-2xl bg-gold-500 text-ink grid place-items-center shadow-sm">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl text-gold-300">{s.title}</h3>
                <p className="mt-2 text-body-regular text-cream-100/85 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-16">
          <div className="text-center mb-8">
            <Chip color="yellow" variant="caption" className="uppercase tracking-wider">
              Interactive Game Modes
            </Chip>
            <h2 className="font-display text-3xl md:text-4xl mt-2">Four Ways to Play Live</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {(Object.keys(FORMAT_INFO) as Format[]).map((f) => {
              const Icon = FORMAT_ICONS[f];
              return (
                <div key={f} className="card p-6 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-cran-600/10 text-cran-600 grid place-items-center shrink-0 mt-0.5">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-cran-600">{FORMAT_INFO[f].name}</h3>
                    <p className="mt-1.5 text-body-regular text-ink/80">{FORMAT_INFO[f].blurb}</p>
                    <div className="mt-3">
                      <Chip color="lime" variant="caption">
                        📱 {FORMAT_INFO[f].phones}
                      </Chip>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="mt-20 text-center text-caption-1-regular text-cream-200/60">
          © {new Date().getFullYear()} {BRAND.shop} ·{" "}
          <a className="underline hover:text-gold-300 transition" href={BRAND.etsy}>
            Etsy Shop
          </a>
        </footer>
      </main>
    </Stage>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiPlayCircleLine,
  RiSmartphoneLine,
  RiTv2Line,
  RiSparkling2Fill,
  RiCheckLine,
  RiCloseLine,
  RiTrophyLine,
  RiVolumeUpLine,
  RiRefreshLine,
  RiKey2Line,
  RiShoppingBag3Line,
  RiMagicLine,
} from "@remixicon/react";
import { Header, Stage, OPTION_STYLE } from "@/components/ui";
import { AVATARS, AvatarBadge, getAvatar } from "@/lib/avatars";
import { BRAND } from "@/lib/brand";
import { sfx } from "@/lib/sound";
import { GEN_TOPICS, generateMcQuestions } from "@/lib/generator";

type DemoMode = "mc" | "top" | "board" | "buzzer" | "generator";

const DEMO_MC = [
  {
    q: "In 'Home Alone', where are the McCallisters flying to for Christmas?",
    options: ["London", "Paris", "Rome", "New York"],
    correct: 1,
    note: "Kevin gets left behind while the family flies to Paris!",
  },
  {
    q: "How many reindeer are named in the classic poem ''Twas the Night Before Christmas'?",
    options: ["Six", "Seven", "Eight", "Ten"],
    correct: 2,
    note: "Dasher, Dancer, Prancer, Vixen, Comet, Cupid, Donner, and Blitzen!",
  },
  {
    q: "What do people traditionally put on the very top of a Christmas tree?",
    options: ["A Candy Cane", "An Angel or Star", "A Mistletoe", "A Pinecone"],
    correct: 1,
    note: "Both angels and stars represent the first Christmas night!",
  },
];

const DEMO_FEUD = {
  q: "Name something people do on Christmas morning",
  answers: [
    { text: "Open presents / stockings", points: 45 },
    { text: "Eat a big breakfast / cinnamon rolls", points: 24 },
    { text: "Stay in matching pajamas", points: 15 },
    { text: "Call family & say Merry Christmas", points: 10 },
    { text: "Drink hot cocoa or coffee", points: 6 },
  ],
};

const DEMO_BOARD = [
  { cat: "XMAS MOVIES", pts: 100, q: "In 'Elf', what city does Buddy travel to in search of his dad?", a: "New York City" },
  { cat: "HOLIDAY SONGS", pts: 100, q: "Complete the lyric: 'All I want for Christmas is...'", a: "You! (Mariah Carey)" },
  { cat: "NORTH POLE", pts: 200, q: "What snack do children traditionally leave out for Santa on Christmas Eve?", a: "Milk & Cookies" },
  { cat: "XMAS FOOD", pts: 200, q: "What creamy holiday drink is often topped with nutmeg?", a: "Eggnog" },
];

const DEMO_BUZZ = [
  { q: "🏠 😱 👦🏼 🎄 🦹‍♂️", hint: "Emoji Christmas Movie", a: "Home Alone" },
  { q: "🚂 🎫 ☕ 🔔 🎅", hint: "Emoji Christmas Movie", a: "The Polar Express" },
  { q: "🔔 🐎 🛷 ❄️ 🎶", hint: "Emoji Holiday Song", a: "Jingle Bells" },
];

export default function DemoPage() {
  const [mode, setMode] = useState<DemoMode>("mc");
  const [myAvatar, setMyAvatar] = useState<string>("santa");
  const [myName, setMyName] = useState<string>("Jingle Jess");
  const [myScore, setMyScore] = useState<number>(450);

  // MC state
  const [mcIdx, setMcIdx] = useState(0);
  const [mcPick, setMcPick] = useState<number | null>(null);
  const [mcRevealed, setMcRevealed] = useState(false);

  // Feud state
  const [feudRevealed, setFeudRevealed] = useState<number[]>([0]);
  const [feudStrikes, setFeudStrikes] = useState(0);
  const [feudBuzzed, setFeudBuzzed] = useState(false);

  // Board state
  const [boardActive, setBoardActive] = useState<number | null>(null);
  const [boardUsed, setBoardUsed] = useState<number[]>([]);
  const [boardShowAns, setBoardShowAns] = useState(false);
  const [boardBuzzed, setBoardBuzzed] = useState(false);

  // Buzzer state
  const [buzzIdx, setBuzzIdx] = useState(0);
  const [buzzedIn, setBuzzedIn] = useState(false);
  const [buzzShowAns, setBuzzShowAns] = useState(false);

  // Generator preview state
  const [genTopic, setGenTopic] = useState<string>("funny");
  const [genPreview, setGenPreview] = useState(() => generateMcQuestions("funny", 3));

  useEffect(() => {
    setGenPreview(generateMcQuestions(genTopic, 3));
  }, [genTopic]);

  const curMc = DEMO_MC[mcIdx];
  const curBuzz = DEMO_BUZZ[buzzIdx];

  function handleMcAnswer(choice: number) {
    if (mcPick !== null) return;
    sfx.unlock();
    sfx.tick();
    setMcPick(choice);
    setTimeout(() => {
      setMcRevealed(true);
      if (choice === curMc.correct) {
        sfx.correct();
        setMyScore((s) => s + 250);
      } else {
        sfx.wrong();
      }
    }, 350);
  }

  function nextMc() {
    setMcPick(null);
    setMcRevealed(false);
    setMcIdx((i) => (i + 1) % DEMO_MC.length);
  }

  return (
    <Stage theme="pine">
      <Header
        right={
          <>
            <Link href="/redeem" className="btn btn-ghost text-sm">
              <RiKey2Line className="size-4" /> Activate Order
            </Link>
            <a href={BRAND.etsy} target="_blank" rel="noreferrer" className="btn btn-gold text-sm">
              <RiShoppingBag3Line className="size-4" /> Buy on Etsy
            </a>
          </>
        }
      />

      <main className="max-w-6xl mx-auto px-4 pb-24">
        {/* Hero Banner */}
        <div className="text-center pt-4 pb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cran-600 text-white border border-white/30 px-4 py-1 text-xs font-extrabold uppercase tracking-wider shadow-md">
            <RiPlayCircleLine className="size-4" /> Interactive Try-Before-You-Buy Simulator
          </span>
          <h1 className="font-display text-3xl md:text-5xl mt-3 text-white">
            Try Jolly Game Night Live! 🎄
          </h1>
          <p className="text-cream-100/85 max-w-2xl mx-auto mt-2 text-sm md:text-base">
            See how the <b>Big Screen TV</b> and <b>Player&apos;s Phone</b> work together in real time. Pick your cartoon character, tap answers on the phone, and test all 4 Christmas game modes below!
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={BRAND.etsy}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold text-base px-6 py-3 shadow-xl"
            >
              <RiShoppingBag3Line className="size-5" /> Buy Instant Access on Etsy — $12.99
            </a>
            <Link href="/redeem" className="btn btn-ghost text-sm px-4 py-3">
              <RiKey2Line className="size-4" /> Already Purchased? Activate Order
            </Link>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { id: "mc", label: "🎄 1. Live Trivia Quiz", sub: "Multiple choice on phones" },
            { id: "top", label: "🔔 2. Holiday Top Answers", sub: "Survey board + strikes" },
            { id: "board", label: "🎁 3. Holiday Quiz Board", sub: "Category grid + buzzers" },
            { id: "buzzer", label: "🎅 4. Emoji & Song Buzzer", sub: "Fastest finger buzz-in" },
            { id: "generator", label: "✨ 5. Question Generator", sub: "13 Christmas topics" },
          ].map((t) => {
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  sfx.unlock();
                  sfx.tick();
                  setMode(t.id as DemoMode);
                }}
                className={`rounded-2xl px-4 py-2.5 text-left transition border-2 ${
                  active
                    ? "bg-cran-600 text-white border-white shadow-lg scale-105"
                    : "bg-pine-800/80 text-white/85 border-white/15 hover:bg-pine-700 hover:border-white/40"
                }`}
              >
                <div className="font-bold text-sm md:text-base leading-tight">{t.label}</div>
                <div className={`text-[11px] ${active ? "text-white/90" : "text-cream-200/70"}`}>{t.sub}</div>
              </button>
            );
          })}
        </div>

        {mode === "generator" ? (
          /* Question Generator Demo Card */
          <div className="card p-6 md:p-8 max-w-4xl mx-auto border-4 border-cran-600/20">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-200 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-cran-600 text-white px-3 py-0.5 text-xs font-bold uppercase">
                  <RiMagicLine className="size-3.5" /> Host Studio Feature
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-pine-800 mt-1">
                  Instant Christmas Question Generator
                </h2>
                <p className="text-sm text-ink/70">
                  Inside your dashboard, you can generate endless Christmas questions across 13 festive categories with 1 click!
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.unlock();
                  sfx.reveal();
                  setGenPreview(generateMcQuestions(genTopic, 3));
                }}
                className="btn btn-gold text-sm"
              >
                <RiRefreshLine className="size-4" /> Shuffle Sample Questions
              </button>
            </div>

            <div className="mt-5">
              <span className="label block mb-2">Click any of the Christmas themes to preview:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {GEN_TOPICS.filter((t) => t.formats.includes("mc")).map((t) => {
                  const active = genTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        sfx.unlock();
                        sfx.tick();
                        setGenTopic(t.id);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition ${
                        active
                          ? "border-cran-600 bg-cran-600 text-white shadow-sm"
                          : "border-cream-200 bg-cream-50 hover:border-pine-600 text-ink"
                      }`}
                    >
                      <span className="text-xl">{t.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{t.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <span className="label block">Generated Sample Questions ({GEN_TOPICS.find((x) => x.id === genTopic)?.label}):</span>
              {genPreview.map((q, i) => (
                <div key={i} className="rounded-2xl bg-pine-900 text-white p-4 border-2 border-pine-700">
                  <p className="font-serif text-lg text-white">
                    {i + 1}. {q.q}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                    {q.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1.5 ${
                          idx === q.correct
                            ? "bg-cran-600 text-white ring-2 ring-white"
                            : "bg-white/10 text-white/80"
                        }`}
                      >
                        <span>{OPTION_STYLE[idx].sym}</span>
                        <span className="truncate">{opt}</span>
                        {idx === q.correct && <RiCheckLine className="size-4 ml-auto shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Split-Screen Simulator: TV + Phone */
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* LEFT: BIG SCREEN TV (HOST VIEW) */}
            <div className="rounded-3xl bg-pine-950/90 border-4 border-white/25 shadow-2xl overflow-hidden">
              {/* TV Top Bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-black/40 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cran-600 text-white px-3 py-0.5 text-xs font-bold">
                    <RiTv2Line className="size-3.5" /> TV / Big Screen View
                  </span>
                  <span className="text-xs text-cream-200/75 hidden sm:inline">
                    Room PIN: <b className="text-white font-mono">1225</b>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <AvatarBadge id={myAvatar} size="xs" />
                    <AvatarBadge id="rudolph" size="xs" />
                    <AvatarBadge id="elf_boy" size="xs" />
                    <AvatarBadge id="snowman" size="xs" />
                  </div>
                  <span className="text-xs font-bold text-white bg-pine-700 px-2.5 py-1 rounded-full">
                    14 Players Live
                  </span>
                </div>
              </div>

              {/* TV Stage Body */}
              <div className="p-6 md:p-8 min-h-[440px] flex flex-col justify-between bg-gradient-to-b from-pine-800 to-pine-950">
                {mode === "mc" && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Christmas Trivia · Question {mcIdx + 1} of {DEMO_MC.length}
                      </span>
                      <span className="rounded-full bg-cran-600 text-white font-block px-3 py-0.5 text-sm">
                        {mcRevealed ? "Answer Revealed!" : "⏱ 18s"}
                      </span>
                    </div>

                    <div className="card p-6 md:p-8 text-center">
                      <h2 className="font-serif text-2xl md:text-4xl text-pine-900 leading-snug">
                        {curMc.q}
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      {curMc.options.map((opt, k) => {
                        const S = OPTION_STYLE[k];
                        const isRight = k === curMc.correct;
                        const dim = mcRevealed && !isRight;
                        return (
                          <div
                            key={k}
                            onClick={() => handleMcAnswer(k)}
                            className={`cursor-pointer rounded-2xl px-5 py-4 flex items-center gap-3 text-lg md:text-xl font-bold transition ${S.bg} ${S.text} ${
                              dim ? "opacity-35" : ""
                            } ${mcRevealed && isRight ? "ring-4 ring-white scale-[1.02] shadow-xl" : "hover:brightness-110"}`}
                          >
                            <span className="text-2xl">{S.sym}</span>
                            <span className="flex-1">{opt}</span>
                            {mcRevealed && isRight && <span className="bg-white text-cran-700 text-xs px-2 py-0.5 rounded-full font-extrabold">✓ CORRECT</span>}
                          </div>
                        );
                      })}
                    </div>

                    {mcRevealed && (
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-white/10 rounded-2xl p-4 border border-white/20">
                        <p className="text-sm text-white font-medium">💡 {curMc.note}</p>
                        <button onClick={nextMc} className="btn btn-gold text-sm py-2 px-5">
                          Next Demo Question ▶
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {mode === "top" && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Holiday Top Answers · Click tiles to flip!
                      </span>
                      <span className="rounded-xl bg-black/40 border border-white/20 px-3 py-1 font-block text-xl text-white">
                        Bank: {feudRevealed.reduce((s, idx) => s + DEMO_FEUD.answers[idx].points, 0)} pts
                      </span>
                    </div>

                    <div className="card p-5 text-center mb-4">
                      <h2 className="font-serif text-2xl md:text-3xl text-pine-900">{DEMO_FEUD.q}</h2>
                    </div>

                    <div className="space-y-2.5">
                      {DEMO_FEUD.answers.map((ans, idx) => {
                        const open = feudRevealed.includes(idx);
                        return open ? (
                          <div
                            key={idx}
                            className="flip rounded-2xl bg-cran-600 text-white border-2 border-white/40 px-5 py-3 flex items-center justify-between font-bold text-lg md:text-xl"
                          >
                            <span>
                              {idx + 1}. {ans.text}
                            </span>
                            <span className="bg-white text-cran-700 font-block px-3 py-0.5 rounded-xl">
                              {ans.points}
                            </span>
                          </div>
                        ) : (
                          <button
                            key={idx}
                            onClick={() => {
                              sfx.unlock();
                              sfx.reveal();
                              setFeudRevealed((r) => [...r, idx]);
                              setMyScore((s) => s + ans.points * 2);
                            }}
                            className="w-full rounded-2xl bg-pine-800 hover:bg-cran-600 border-2 border-white/30 text-white py-3 font-block text-xl transition"
                          >
                            Click to Reveal #{idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {[0, 1, 2].map((k) => (
                          <span
                            key={k}
                            className={`w-9 h-9 rounded-xl grid place-items-center font-block text-lg ${
                              k < feudStrikes ? "bg-cran-600 text-white" : "bg-black/30 text-white/25"
                            }`}
                          >
                            ✕
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            sfx.unlock();
                            sfx.wrong();
                            setFeudStrikes((s) => Math.min(3, s + 1));
                          }}
                          className="btn btn-cran text-xs py-2 px-4"
                        >
                          ✕ Trigger Strike
                        </button>
                        <button
                          onClick={() => {
                            setFeudRevealed(DEMO_FEUD.answers.map((_, i) => i));
                          }}
                          className="btn btn-ghost text-xs py-2 px-4"
                        >
                          Reveal All
                        </button>
                        <button
                          onClick={() => {
                            setFeudRevealed([]);
                            setFeudStrikes(0);
                            setFeudBuzzed(false);
                          }}
                          className="btn btn-ghost text-xs py-2 px-4"
                        >
                          Reset Board
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {mode === "board" && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Holiday Quiz Board · Pick any point tile!
                      </span>
                    </div>

                    {boardActive === null ? (
                      <div className="grid grid-cols-2 gap-3">
                        {DEMO_BOARD.map((item, idx) => {
                          const used = boardUsed.includes(idx);
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="rounded-xl bg-cran-600 text-white font-bold text-center py-2 text-xs uppercase tracking-wider">
                                {item.cat}
                              </div>
                              <button
                                disabled={used}
                                onClick={() => {
                                  sfx.unlock();
                                  sfx.tick();
                                  setBoardActive(idx);
                                  setBoardShowAns(false);
                                  setBoardBuzzed(false);
                                }}
                                className={`w-full rounded-2xl border-2 py-8 font-block text-4xl transition ${
                                  used
                                    ? "border-white/10 bg-black/20 text-white/20"
                                    : "border-white/40 bg-pine-800 text-white hover:bg-cran-600 hover:border-white shadow-lg"
                                }`}
                              >
                                {used ? "✓" : item.pts}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="inline-block rounded-full bg-cran-600 text-white px-4 py-1 text-xs font-bold uppercase mb-3">
                          {DEMO_BOARD[boardActive].cat} · {DEMO_BOARD[boardActive].pts} Points
                        </span>
                        <div className="card p-6 md:p-8">
                          <h3 className="font-serif text-2xl md:text-4xl text-pine-900">
                            {DEMO_BOARD[boardActive].q}
                          </h3>
                        </div>
                        {boardShowAns && (
                          <div className="flip mt-4 rounded-2xl bg-cran-600 text-white p-4 font-display text-3xl border-2 border-white">
                            {DEMO_BOARD[boardActive].a}
                          </div>
                        )}
                        {boardBuzzed && (
                          <div className="pop mt-4 inline-flex items-center gap-3 rounded-2xl bg-white text-pine-900 px-5 py-2.5 font-bold shadow-lg">
                            <AvatarBadge id={myAvatar} size="sm" />
                            <span>🔔 {myName} buzzed in first!</span>
                          </div>
                        )}
                        <div className="flex justify-center gap-3 mt-5">
                          {!boardShowAns && (
                            <button
                              onClick={() => {
                                sfx.unlock();
                                sfx.reveal();
                                setBoardShowAns(true);
                                setMyScore((s) => s + DEMO_BOARD[boardActive].pts);
                              }}
                              className="btn btn-gold text-sm"
                            >
                              Reveal Answer
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setBoardUsed((u) => [...u, boardActive]);
                              setBoardActive(null);
                            }}
                            className="btn btn-ghost text-sm"
                          >
                            ← Back to Board
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === "buzzer" && (
                  <div className="text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                      Emoji & Song Buzzer · Clue {buzzIdx + 1} of {DEMO_BUZZ.length}
                    </span>
                    <div className="card p-8 mt-3">
                      <div className="text-5xl md:text-6xl">{curBuzz.q}</div>
                      <p className="mt-3 text-sm font-bold uppercase tracking-wider text-cran-600">
                        {curBuzz.hint}
                      </p>
                    </div>

                    {buzzedIn && (
                      <div className="pop mt-4 inline-flex items-center gap-3 rounded-3xl bg-cran-600 text-white border-2 border-white px-6 py-3 shadow-xl">
                        <AvatarBadge id={myAvatar} size="md" />
                        <div className="text-left">
                          <div className="text-[11px] uppercase tracking-wider text-white/80 font-bold">
                            Buzzed First!
                          </div>
                          <div className="font-display text-2xl">{myName}</div>
                        </div>
                      </div>
                    )}

                    {buzzShowAns && (
                      <div className="flip mt-4 rounded-2xl bg-white text-pine-900 p-4 font-display text-3xl shadow-lg">
                        Answer: {curBuzz.a}
                      </div>
                    )}

                    <div className="flex justify-center gap-3 mt-5">
                      {!buzzShowAns && (
                        <button
                          onClick={() => {
                            sfx.unlock();
                            sfx.reveal();
                            setBuzzShowAns(true);
                          }}
                          className="btn btn-gold text-sm"
                        >
                          Reveal Answer
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setBuzzIdx((i) => (i + 1) % DEMO_BUZZ.length);
                          setBuzzedIn(false);
                          setBuzzShowAns(false);
                        }}
                        className="btn btn-ghost text-sm"
                      >
                        Next Emoji Clue ▶
                      </button>
                    </div>
                  </div>
                )}

                {/* TV Bottom Mini Leaderboard */}
                <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-white/85">
                  <div className="flex items-center gap-2">
                    <RiTrophyLine className="size-4 text-white" />
                    <span className="font-bold">Live Scoreboard:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-cran-600 text-white px-3 py-1 rounded-full font-bold">
                      <AvatarBadge id={myAvatar} size="xs" /> 1. {myName}: {myScore} pts
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                      <AvatarBadge id="rudolph" size="xs" /> 2. Dasher Dan: 400 pts
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                      <AvatarBadge id="mrs_claus" size="xs" /> 3. Holly: 320 pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: PLAYER'S PHONE CONTROLLER */}
            <div className="mx-auto w-full max-w-[360px] rounded-[2.5rem] bg-pine-950 border-[6px] border-white/30 shadow-2xl overflow-hidden">
              {/* Phone Status Bar */}
              <div className="bg-black/40 px-4 py-2.5 flex items-center justify-between border-b border-white/15">
                <div className="flex items-center gap-2">
                  <AvatarBadge id={myAvatar} size="sm" />
                  <div>
                    <div className="font-bold text-xs text-white leading-tight">{myName}</div>
                    <div className="text-[10px] text-white/70">{getAvatar(myAvatar).name}</div>
                  </div>
                </div>
                <span className="rounded-full bg-cran-600 text-white font-block px-2.5 py-0.5 text-sm">
                  {myScore} pts
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Avatar Switcher on Phone */}
                <div className="rounded-2xl bg-white/10 p-3 border border-white/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                      🎭 Pick Your Cartoon Avatar (20)
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 max-h-28 overflow-y-auto p-0.5">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          sfx.unlock();
                          sfx.join();
                          setMyAvatar(av.id);
                        }}
                        className={`p-1 rounded-xl flex flex-col items-center transition ${
                          myAvatar === av.id
                            ? "bg-cran-600 ring-2 ring-white scale-105"
                            : "bg-black/25 hover:bg-white/15 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <AvatarBadge id={av.id} size="xs" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Interactive Controller Area */}
                <div className="rounded-2xl bg-pine-900/90 border border-white/15 p-4 min-h-[250px] flex flex-col justify-center">
                  {mode === "mc" ? (
                    <div>
                      <p className="text-center text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
                        📱 Tap your answer on your phone:
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {curMc.options.map((opt, k) => {
                          const S = OPTION_STYLE[k];
                          const picked = mcPick === k;
                          return (
                            <button
                              key={k}
                              onClick={() => handleMcAnswer(k)}
                              className={`rounded-2xl ${S.bg} ${S.text} p-3 flex flex-col items-center justify-center gap-1 min-h-24 font-bold text-sm shadow-md active:scale-95 transition ${
                                picked ? "ring-4 ring-white" : ""
                              }`}
                            >
                              <span className="text-2xl">{S.sym}</span>
                              <span className="text-center leading-tight">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
                        📱 Live Phone Buzzer Controller
                      </p>
                      <button
                        onClick={() => {
                          sfx.unlock();
                          sfx.buzz();
                          if (mode === "buzzer") setBuzzedIn(true);
                          if (mode === "board") setBoardBuzzed(true);
                          if (mode === "top") setFeudBuzzed(true);
                          setMyScore((s) => s + 50);
                        }}
                        className="w-44 h-44 mx-auto rounded-full bg-cran-600 border-8 border-cran-500 shadow-[0_10px_0_#6e1220] active:translate-y-2 active:shadow-[0_4px_0_#6e1220] font-block text-4xl text-white transition grid place-items-center"
                      >
                        BUZZ!
                      </button>
                      <p className="text-xs text-cream-200/75 mt-3">
                        Tap the big red button to buzz in on the TV!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion CTA Card */}
        <div className="mt-10 rounded-3xl bg-cran-600 text-white p-6 md:p-8 border-2 border-white/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block bg-white text-cran-700 font-extrabold text-xs uppercase px-3 py-1 rounded-full">
              🎅 Instant Digital Access
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-2">
              Ready to Host Your Own Christmas Party?
            </h2>
            <p className="text-white/90 mt-1 max-w-xl">
              Unlock all <b>12 Ready-to-Play Christmas Game Packs</b>, the <b>13-Topic Question Generator</b>, <b>20 Cartoon Avatars</b>, and unlimited live rooms for your family, classroom, or office party!
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={BRAND.etsy}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-cran-700 hover:bg-cream-100 text-base px-6 py-3.5 shadow-xl"
            >
              <RiShoppingBag3Line className="size-5" /> Get It on Etsy
            </a>
            <Link
              href="/redeem"
              className="btn bg-pine-800 text-white border border-white/30 hover:bg-pine-700 text-base px-6 py-3.5"
            >
              <RiKey2Line className="size-5" /> I Have an Order #
            </Link>
          </div>
        </div>
      </main>
    </Stage>
  );
}

"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Stage } from "@/components/ui";
import { api, getKey, clearKey } from "@/lib/realtime";
import { TEMPLATES } from "@/lib/templates";
import { AVATARS, AvatarBadge } from "@/lib/avatars";
import { FORMAT_INFO, Format } from "@/lib/types";
import { toast } from "@/components/base/toast/toast";

type Row = { id: string; title: string; format: Format; updated_at: string; count: number; theme: string };

interface GameBlueprint {
  id: string;
  title: string;
  emoji: string;
  badge: string;
  desc: string;
  howItPlays: string;
  format: Format;
  topic: string;
  defaultCount: number;
  teams: boolean;
  cardTone: "red" | "green";
}

const GAME_BLUEPRINTS: GameBlueprint[] = [
  {
    id: "speed-trivia",
    title: "Speed Christmas Trivia",
    emoji: "🎯",
    badge: "4 Choices · Timed",
    desc: "Fast-paced Christmas quiz! Movies, songs, traditions & funny holiday facts.",
    howItPlays: "Players tap A, B, C or D on their phones — faster answers score more points!",
    format: "mc",
    topic: "mix",
    defaultCount: 10,
    teams: false,
    cardTone: "red",
  },
  {
    id: "fact-or-fiction",
    title: "Fact or Elf Fiction (True / False)",
    emoji: "🤔",
    badge: "50/50 · Rapid Fire",
    desc: "Unbelievable Christmas myths vs. real history — can your guests spot the truth?",
    howItPlays: "Two big buttons on every phone: TRUE or FALSE!",
    format: "mc",
    topic: "truefalse",
    defaultCount: 8,
    teams: false,
    cardTone: "green",
  },
  {
    id: "would-you-rather",
    title: "Would You Rather: Holiday Dilemma",
    emoji: "⚖️",
    badge: "Icebreaker · 2 Choices",
    desc: "Hilarious Christmas dilemmas that get the whole living room laughing and debating.",
    howItPlays: "Everyone picks their side on their phone to see what the room prefers!",
    format: "mc",
    topic: "would_you_rather",
    defaultCount: 6,
    teams: false,
    cardTone: "red",
  },
  {
    id: "party-confessions",
    title: "Holiday Habits & Party Poll",
    emoji: "🎭",
    badge: "Funny Stats · Crowd Pleaser",
    desc: "Secret gift-peeking, re-gifting fruitcakes & funny Christmas family habits.",
    howItPlays: "Players guess the most shocking real-life Christmas survey stats on their phones!",
    format: "mc",
    topic: "most_likely",
    defaultCount: 6,
    teams: false,
    cardTone: "green",
  },
  {
    id: "emoji-movies",
    title: "Emoji Christmas Movie Decoder",
    emoji: "🍿",
    badge: "Visual · Phone Buzzers",
    desc: "Giant emojis appear on the TV screen — decode the Christmas movie title first!",
    howItPlays: "Phones turn into giant red BUZZERS! Fastest player shouts the movie.",
    format: "buzzer",
    topic: "emoji_movies",
    defaultCount: 8,
    teams: false,
    cardTone: "red",
  },
  {
    id: "emoji-songs",
    title: "Emoji Holiday Song Challenge",
    emoji: "🎶",
    badge: "Music · Phone Buzzers",
    desc: "Can your guests name the Christmas carol or pop hit just from the emojis?",
    howItPlays: "First player to hit their phone buzzer names (or sings!) the song.",
    format: "buzzer",
    topic: "emoji_songs",
    defaultCount: 8,
    teams: false,
    cardTone: "green",
  },
  {
    id: "finish-lyric",
    title: "Finish the Christmas Lyric",
    emoji: "🎤",
    badge: "Karaoke · Sing-Along",
    desc: "Show a famous opening line — first player to buzz belts out the next line!",
    howItPlays: "Phones are buzzers; host marks Right or Wrong on the big screen.",
    format: "buzzer",
    topic: "lyrics",
    defaultCount: 6,
    teams: true,
    cardTone: "red",
  },
  {
    id: "family-feud",
    title: "Christmas Family Feud",
    emoji: "👨‍👩‍👧‍👦",
    badge: "Teams · Top Survey Answers",
    desc: "Guess the most popular holiday survey answers, avoid 3 strikes, and bank the points!",
    howItPlays: "Two teams face off with phone buzzers while tiles flip on the TV.",
    format: "top",
    topic: "feud_family",
    defaultCount: 6,
    teams: true,
    cardTone: "green",
  },
  {
    id: "jeopardy-board",
    title: "Big Holiday Jeopardy Board",
    emoji: "🎛️",
    badge: "5 Categories · 100–500 Pts",
    desc: "Categories & point tiles on the big screen, plus a Final Wager round at the end!",
    howItPlays: "Teams pick a category and point value, then buzz in on their phones.",
    format: "board",
    topic: "mix",
    defaultCount: 5,
    teams: true,
    cardTone: "red",
  },
  {
    id: "riddles-mystery",
    title: "Santa's Riddles & Who Am I?",
    emoji: "🎁",
    badge: "Brainteasers · 3 Clues",
    desc: "Clever North Pole riddles and 3-clue holiday character mysteries!",
    howItPlays: "Read the riddle on screen — fastest thinker buzzes in on their phone!",
    format: "buzzer",
    topic: "riddles",
    defaultCount: 8,
    teams: false,
    cardTone: "green",
  },
];

const AUDIENCES = [
  { id: "family", label: "👨‍👩‍👧‍👦 Family & All Ages", topicOverride: "" },
  { id: "friends", label: "🥳 Friends & House Party", topicOverride: "funny" },
  { id: "office", label: "🥂 Office Christmas Party", topicOverride: "party" },
  { id: "kids", label: "🦌 Kids & Classroom", topicOverride: "kids" },
  { id: "movies", label: "🎬 Movie & Music Lovers", topicOverride: "movies" },
];

function Dashboard() {
  const r = useRouter();
  const sp = useSearchParams();
  const [games, setGames] = useState<Row[] | null>(null);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Interactive Game Builder state
  const [audience, setAudience] = useState<string>("family");
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>("speed-trivia");
  const [customTitle, setCustomTitle] = useState<string>("Christmas Party Showdown");
  const [genCount, setGenCount] = useState<number>(10);
  const [genTheme, setGenTheme] = useState<string>("pine");

  const activeBp = GAME_BLUEPRINTS.find((b) => b.id === selectedBlueprint) || GAME_BLUEPRINTS[0];

  useEffect(() => {
    setGenCount(activeBp.defaultCount);
    setCustomTitle(activeBp.title);
  }, [activeBp]);

  useEffect(() => {
    if (!getKey()) {
      r.replace("/redeem");
      return;
    }
    api<{ email: string }>("/api/me")
      .then((m) => setEmail(m.email))
      .catch(() => {
        r.replace("/redeem");
      });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try {
      setGames((await api<{ games: Row[] }>("/api/games")).games);
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  async function create(body: object, tag: string, goDirectToHost = false) {
    setBusy(tag);
    try {
      const { game } = await api<{ game: { id: string } }>("/api/games", {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast.success("Christmas game ready! 🎄");
      r.push(goDirectToHost ? `/host/${game.id}` : `/edit/${game.id}`);
    } catch (e) {
      setErr((e as Error).message);
      setBusy("");
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this game? This cannot be undone.")) return;
    await api(`/api/games/${id}`, { method: "DELETE" });
    load();
  }

  function handleBuildGame(playImmediately: boolean) {
    const aud = AUDIENCES.find((a) => a.id === audience);
    // If the user picked Speed Trivia ("mix"), tailor the topic to their chosen audience if applicable
    const topic =
      activeBp.id === "speed-trivia" && aud?.topicOverride ? aud.topicOverride : activeBp.topic;

    create(
      {
        generate: true,
        format: activeBp.format,
        topic,
        count: genCount,
        theme: genTheme,
        teams: activeBp.teams,
        title: customTitle.trim() || activeBp.title,
      },
      playImmediately ? "build-play" : "build-edit",
      playImmediately
    );
  }

  return (
    <Stage theme="pine">
      <Header
        right={
          <button
            className="btn btn-ghost text-sm"
            onClick={() => {
              clearKey();
              r.push("/");
            }}
          >
            Sign out
          </button>
        }
      />
      <main className="max-w-6xl mx-auto px-5 pb-24">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-cran-700 via-cran-600 to-pine-800 border-2 border-gold-400/80 p-6 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest bg-gold-400 text-ink px-3 py-1 rounded-full">
              🎅 Welcome to Your Christmas Game Studio
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-cream-50 mt-2">
              What kind of Christmas game do you want to host?
            </h1>
            <p className="text-cream-100/90 text-sm md:text-base mt-1">
              Signed in as <b>{email}</b> · Pick your group &amp; game style below — when players scan the QR code, they&apos;ll pick from 20 cartoon holiday avatars and join the lobby!
            </p>
          </div>
          <button
            className="btn btn-ghost text-xs !py-2 !px-3.5"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? `Key: ${getKey()}` : "🔑 Show Access Key"}
          </button>
        </div>

        {err && <p className="mb-4 text-gold-400 font-bold">{err}</p>}

        {/* STEP-BY-STEP INTERACTIVE CHRISTMAS GAME BUILDER */}
        <section className="rounded-3xl bg-pine-900/90 border-2 border-gold-400 p-6 md:p-8 shadow-2xl">
          {/* STEP 1: AUDIENCE */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-cran-600 text-white font-block text-sm grid place-items-center">
                1
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-gold-300">
                Who are you playing with tonight?
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {AUDIENCES.map((a) => {
                const active = audience === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAudience(a.id)}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition border-2 ${
                      active
                        ? "bg-cran-600 text-white border-gold-400 shadow-md scale-[1.02]"
                        : "bg-pine-800/80 text-cream-100 border-white/15 hover:border-gold-400/60"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: 10 DISTINCT GAME TYPES */}
          <div className="mt-8">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-cran-600 text-white font-block text-sm grid place-items-center">
                2
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-gold-300">
                Choose your Christmas Game Mode (10 Different Games)
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3.5">
              {GAME_BLUEPRINTS.map((bp) => {
                const active = selectedBlueprint === bp.id;
                const toneBg =
                  bp.cardTone === "red"
                    ? active
                      ? "bg-cran-600 border-gold-400 ring-4 ring-gold-400/40"
                      : "bg-cran-700/55 border-white/15 hover:border-gold-400/70"
                    : active
                    ? "bg-pine-600 border-gold-400 ring-4 ring-gold-400/40"
                    : "bg-pine-800/75 border-white/15 hover:border-gold-400/70";
                return (
                  <button
                    key={bp.id}
                    type="button"
                    onClick={() => setSelectedBlueprint(bp.id)}
                    className={`rounded-2xl p-4 text-left transition border-2 flex flex-col justify-between ${toneBg}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-3xl">{bp.emoji}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-black/30 text-gold-300 px-2 py-0.5 rounded-full">
                          {bp.badge}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-cream-50 mt-2 leading-snug">
                        {bp.title}
                      </h3>
                      <p className="text-xs text-cream-100/80 mt-1 leading-relaxed">
                        {bp.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-xs font-bold text-gold-300">
                      <span>{FORMAT_INFO[bp.format].name}</span>
                      <span>{active ? "✓ Selected" : "Select →"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CONFIGURE & LAUNCH */}
          <div className="mt-8 pt-6 border-t-2 border-white/15 bg-black/20 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-cran-600 text-white font-block text-sm grid place-items-center">
                3
              </span>
              <div>
                <h2 className="font-serif text-xl text-gold-300">
                  Ready to build: <span className="text-white">{activeBp.emoji} {activeBp.title}</span>
                </h2>
                <p className="text-xs text-cream-200/80">📱 {activeBp.howItPlays}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr_auto_auto] gap-4 items-end">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  Your Game Title (shown on TV &amp; phones)
                </span>
                <input
                  className="input mt-1 font-serif text-lg"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Smith Family Christmas Quiz"
                />
              </label>

              {activeBp.format !== "board" && (
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                    {activeBp.format === "top" ? "Rounds" : "Questions"}
                  </span>
                  <select
                    className="input mt-1 font-bold"
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                  >
                    {(activeBp.format === "top" ? [4, 6, 8] : [6, 8, 10, 12, 15]).map((n) => (
                      <option key={n} value={n}>
                        {n} {activeBp.format === "top" ? "rounds" : "questions"}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                  Christmas Backdrop
                </span>
                <select
                  className="input mt-1 font-bold"
                  value={genTheme}
                  onChange={(e) => setGenTheme(e.target.value)}
                >
                  <option value="pine">🌲 Pine Forest Green</option>
                  <option value="cranberry">🎅 Santa Suit Red</option>
                  <option value="midnight">🎄 Holly Green &amp; Berry</option>
                  <option value="burgundy">🍷 Velvet Christmas Red</option>
                  <option value="teal">🌿 Evergreen &amp; Gold</option>
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-3 mt-5 justify-end">
              <button
                type="button"
                disabled={!!busy}
                onClick={() => handleBuildGame(false)}
                className="btn btn-gold text-base px-6 py-3.5 shadow-lg"
              >
                {busy === "build-edit"
                  ? "Building game…"
                  : "✏️ Create & Customize Questions"}
              </button>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => handleBuildGame(true)}
                className="btn btn-cran text-base px-7 py-3.5 shadow-xl border border-gold-400/60"
              >
                {busy === "build-play"
                  ? "Opening lobby…"
                  : "▶ Create & Launch Live Lobby Now!"}
              </button>
            </div>
          </div>
        </section>

        {/* SAVED GAMES ("MY GAMES") */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-gold-300">
                🎄 My Saved Games ({games?.length ?? 0})
              </h2>
              <p className="text-sm text-cream-200/80">
                Your created games. Click <b>Play live</b> to open the big-screen QR lobby or <b>Edit</b> to add/generate more questions.
              </p>
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games === null && <p className="text-cream-200/70">Loading your games…</p>}
            {games?.length === 0 && (
              <div className="col-span-full rounded-2xl bg-white/8 border border-white/15 p-6 text-center text-cream-100">
                You haven&apos;t saved a game yet — use the <b>Christmas Game Builder</b> above or pick one of the 12 packs below!
              </div>
            )}
            {games?.map((g, idx) => (
              <div
                key={g.id}
                className={`rounded-2xl p-5 flex flex-col justify-between border-2 shadow-lg ${
                  idx % 2 === 0
                    ? "bg-cran-700/80 border-gold-400/60 text-cream-50"
                    : "bg-pine-800/90 border-gold-400/60 text-cream-50"
                }`}
              >
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-black/30 text-gold-300 px-2.5 py-1 rounded-full">
                    {FORMAT_INFO[g.format].name} · {g.count} {g.format === "top" ? "rounds" : "questions"}
                  </span>
                  <h3 className="font-serif text-2xl text-white mt-2">{g.title}</h3>
                </div>
                <div className="mt-5 flex gap-2">
                  <Link href={`/host/${g.id}`} className="btn btn-gold flex-1 text-sm">
                    ▶ Play live
                  </Link>
                  <Link href={`/edit/${g.id}`} className="btn btn-ghost text-sm">
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => del(g.id)}
                    className="btn btn-ghost !px-3 text-sm"
                    aria-label="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 20 CARTOON AVATARS PREVIEW */}
        <section className="mt-14 rounded-3xl bg-gradient-to-r from-pine-800/90 via-cran-700/80 to-pine-900/90 border-2 border-gold-400/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-gold-400 text-ink px-2.5 py-0.5 rounded-full">
                🎭 Player Lobby Experience
              </span>
              <h3 className="font-display text-3xl text-cream-50 mt-1">
                20 Cartoon Holiday Avatars Included!
              </h3>
              <p className="text-sm text-cream-200/85">
                When your guests scan the QR code on their phone, they pick one of these 20 cartoon characters and pop up live on your TV screen:
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
            {AVATARS.map((av) => (
              <div
                key={av.id}
                className="flex flex-col items-center bg-black/25 border border-white/10 rounded-2xl p-2.5 text-center"
              >
                <AvatarBadge id={av.id} size="md" />
                <span className="text-xs font-bold text-cream-50 mt-1.5 truncate w-full">
                  {av.name}
                </span>
                <span className="text-[10px] text-gold-300 truncate w-full">
                  {av.title}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 12 READY-TO-PLAY CHRISTMAS PACKS */}
        <section className="mt-14">
          <h2 className="font-display text-3xl md:text-4xl text-gold-300">
            🎁 12 Ready-to-Play Christmas Game Packs
          </h2>
          <p className="text-cream-200/80 text-sm">
            Want a pre-built pack immediately? Click any pack below to add it to your games and customize or play right away.
          </p>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t, i) => (
              <button
                key={t.slug}
                disabled={!!busy}
                onClick={() => create({ template: t.slug }, t.slug)}
                className={`text-left rounded-2xl p-5 border-2 transition !min-h-40 flex flex-col justify-between shadow-lg ${
                  i % 2 === 0
                    ? "bg-gradient-to-br from-pine-800 to-pine-950 border-gold-400/50 hover:border-gold-400"
                    : "bg-gradient-to-br from-cran-600 to-cran-700 border-gold-400/50 hover:border-gold-400"
                }`}
              >
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-black/30 text-gold-300 px-2.5 py-0.5 rounded-full">
                    {FORMAT_INFO[t.format].name}
                  </span>
                  <h3 className="font-serif text-2xl text-white mt-2">{t.title}</h3>
                </div>
                <p className="text-sm text-gold-300 font-bold mt-4">
                  {busy === t.slug ? "Creating…" : "+ Add Pack to My Games →"}
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </Stage>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}

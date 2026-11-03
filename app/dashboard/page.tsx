"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Stage } from "@/components/ui";
import { api, getKey, clearKey } from "@/lib/realtime";
import { TEMPLATES } from "@/lib/templates";
import { GEN_TOPICS } from "@/lib/generator";
import { FORMAT_INFO, Format } from "@/lib/types";

type Row = { id: string; title: string; format: Format; updated_at: string; count: number; theme: string };

const SCRATCH_MODES: Array<{
  key: string;
  format: Format;
  title: string;
  badge: string;
  desc: string;
  topic?: string;
  count?: number;
}> = [
  { key: "mc-blank", format: "mc", title: "Live Multiple-Choice Quiz", badge: "4 Choices · Phones", desc: "Players tap A, B, C or D on their phones against the clock." },
  { key: "tf-gen", format: "mc", title: "True or False: Rapid Fire", badge: "50/50 · Fast Paced", desc: "Two buttons on every phone — Fact or Elf Fiction!", topic: "truefalse", count: 6 },
  { key: "board-blank", format: "board", title: "Quiz Board (Jeopardy Style)", badge: "Categories · Teams", desc: "Big board of categories & point tiles from 100 to 500." },
  { key: "top-blank", format: "top", title: "Top Answers (Family Feud)", badge: "Survey Board · 3 Strikes", desc: "Guess the most popular holiday survey answers to bank points." },
  { key: "emoji-gen", format: "buzzer", title: "Emoji Movie & Song Challenge", badge: "Buzzer · Visual", desc: "Giant emojis on the big screen — first player to buzz guesses!", topic: "emoji_movies", count: 6 },
  { key: "lyrics-gen", format: "buzzer", title: "Finish the Christmas Lyric", badge: "Buzzer · Sing-Along", desc: "Show a famous holiday line, first to buzz sings the next line!", topic: "lyrics", count: 6 },
  { key: "riddles-gen", format: "buzzer", title: "Santa's Riddles & Brainteasers", badge: "Buzzer · Clever", desc: "Festive riddles where the fastest thinker buzzes in to score.", topic: "riddles", count: 6 },
  { key: "whoami-gen", format: "buzzer", title: "Who Am I? Holiday Edition", badge: "Buzzer · 3 Clues", desc: "Three clues about a Christmas character — buzz in to name them!", topic: "whoami", count: 4 },
];

function Dashboard() {
  const r = useRouter();
  const sp = useSearchParams();
  const [games, setGames] = useState<Row[] | null>(null);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Magic Christmas Generator state
  const [genFormat, setGenFormat] = useState<Format>("mc");
  const [genTopic, setGenTopic] = useState<string>("mix");
  const [genCount, setGenCount] = useState<number>(8);
  const [genTheme, setGenTheme] = useState<string>("pine");

  const availableTopics = GEN_TOPICS.filter((t) => t.formats.includes(genFormat));

  useEffect(() => {
    if (!availableTopics.some((t) => t.id === genTopic)) {
      setGenTopic(availableTopics[0]?.id || "mix");
    }
  }, [genFormat, availableTopics, genTopic]);

  useEffect(() => {
    if (!getKey()) { r.replace("/redeem"); return; }
    api<{ email: string }>("/api/me").then((m) => setEmail(m.email)).catch(() => { r.replace("/redeem"); });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try { setGames((await api<{ games: Row[] }>("/api/games")).games); } catch (e) { setErr((e as Error).message); }
  }
  async function create(body: object, tag: string) {
    setBusy(tag);
    try {
      const { game } = await api<{ game: { id: string } }>("/api/games", { method: "POST", body: JSON.stringify(body) });
      r.push(`/edit/${game.id}`);
    } catch (e) { setErr((e as Error).message); setBusy(""); }
  }
  async function del(id: string) {
    if (!confirm("Delete this game? This cannot be undone.")) return;
    await api(`/api/games/${id}`, { method: "DELETE" });
    load();
  }

  function handleMagicGenerate() {
    const tObj = GEN_TOPICS.find((x) => x.id === genTopic);
    const title = `${tObj?.label || "Christmas"} (${FORMAT_INFO[genFormat].name})`;
    create(
      {
        generate: true,
        format: genFormat,
        topic: genTopic,
        count: genCount,
        theme: genTheme,
        title,
      },
      "magic-gen"
    );
  }

  return (
    <Stage>
      <Header right={<button className="btn btn-ghost text-sm" onClick={() => { clearKey(); r.push("/"); }}>Sign out</button>} />
      <main className="max-w-6xl mx-auto px-5 pb-24">
        {sp.get("welcome") && (
          <div className="card p-5 mb-6 flex flex-wrap items-center gap-4 justify-between">
            <div>
              <p className="font-serif text-2xl text-pine-800">{sp.get("welcome") === "new" ? "You're in! 🎄" : "Welcome back!"}</p>
              <p className="text-sm text-ink/70">Generate a custom Christmas game below, pick one of the 12 ready-made packs, or build your own.</p>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl">My games</h1>
            <p className="text-cream-200/80 text-sm">{email}</p>
          </div>
          <button className="text-sm underline text-cream-200/80" onClick={() => setShowKey(!showKey)}>{showKey ? getKey() : "Show my access key"}</button>
        </div>
        {err && <p className="mt-4 text-gold-400">{err}</p>}

        <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games === null && <p className="text-cream-200/70">Loading…</p>}
          {games?.length === 0 && <p className="text-cream-200/70 col-span-full">No games yet. Generate a custom Christmas game or pick one of the packs below!</p>}
          {games?.map((g) => (
            <div key={g.id} className="card p-5 flex flex-col">
              <span className="label">{FORMAT_INFO[g.format].name} · {g.count} {g.format === "top" ? "rounds" : "questions"}</span>
              <h3 className="font-serif text-2xl text-pine-800 mt-1 flex-1">{g.title}</h3>
              <div className="mt-4 flex gap-2">
                <Link href={`/host/${g.id}`} className="btn btn-cran flex-1">▶ Play live</Link>
                <Link href={`/edit/${g.id}`} className="btn btn-gold">Edit</Link>
                <button onClick={() => del(g.id)} className="btn bg-cream-200 text-ink px-3" aria-label="Delete">🗑</button>
              </div>
            </div>
          ))}
        </section>

        {/* MAGIC CHRISTMAS QUESTION & GAME GENERATOR */}
        <section className="mt-14 rounded-3xl bg-gradient-to-br from-pine-900 via-pine-800 to-cran-700 border-2 border-gold-400 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest bg-gold-400 text-ink px-3 py-1 rounded-full">
                ✨ Instant Christmas Question Generator
              </span>
              <h2 className="font-display text-3xl md:text-4xl mt-2">Generate a Custom Christmas Game</h2>
              <p className="text-cream-200/85 text-sm mt-1">
                Pick a game style and a festive theme — we&apos;ll generate fun Christmas questions for you automatically (and you can generate even more inside the editor!).
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-3 mt-6">
            {(Object.keys(FORMAT_INFO) as Format[]).map((f) => {
              const active = genFormat === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setGenFormat(f)}
                  className={`rounded-2xl p-4 text-left transition border-2 ${
                    active
                      ? "bg-cream-50 text-ink border-gold-400 shadow-lg"
                      : "bg-black/25 text-cream-100 border-white/15 hover:border-gold-400/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-serif text-xl font-bold ${active ? "text-cran-600" : "text-gold-300"}`}>
                      {FORMAT_INFO[f].name}
                    </span>
                    {active && <span className="text-xs font-bold bg-gold-400 text-ink px-2 py-0.5 rounded-full">Selected</span>}
                  </div>
                  <p className={`text-xs mt-1 ${active ? "text-ink/80" : "text-cream-200/75"}`}>{FORMAT_INFO[f].blurb}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider font-bold text-gold-300 mb-2">Choose Question Theme / Vibe</p>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((t) => {
                const active = genTopic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setGenTopic(t.id)}
                    className={`rounded-xl px-4 py-2.5 text-sm transition border ${
                      active
                        ? "bg-gold-400 text-ink border-gold-300 font-bold shadow"
                        : "bg-black/30 text-cream-100 border-white/15 hover:border-gold-400/60"
                    }`}
                  >
                    <span className="mr-1.5">{t.emoji}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {genFormat !== "board" && (
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-cream-200 font-semibold">{genFormat === "top" ? "Rounds:" : "Questions:"}</span>
                  <select
                    className="input !w-auto !py-1.5 text-ink font-bold"
                    value={genCount}
                    onChange={(e) => setGenCount(Number(e.target.value))}
                  >
                    {(genFormat === "top" ? [4, 6, 8] : [5, 8, 10, 12, 15]).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="flex items-center gap-2 text-sm">
                <span className="text-cream-200 font-semibold">Colour Theme:</span>
                <select
                  className="input !w-auto !py-1.5 text-ink font-bold"
                  value={genTheme}
                  onChange={(e) => setGenTheme(e.target.value)}
                >
                  <option value="pine">Pine Green</option>
                  <option value="cranberry">Cranberry Red</option>
                  <option value="midnight">Midnight Snow</option>
                  <option value="teal">Winter Teal</option>
                  <option value="burgundy">Velvet Burgundy</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              disabled={!!busy}
              onClick={handleMagicGenerate}
              className="btn btn-gold text-lg px-8 py-3.5 shadow-xl"
            >
              {busy === "magic-gen" ? "Generating your game…" : "✨ Generate Christmas Game ▶"}
            </button>
          </div>
        </section>

        <h2 className="font-display text-3xl mt-14">Ready-to-Play Christmas Packs (12 Games)</h2>
        <p className="text-cream-200/80">Click any pack to add it to your games. Every question can be edited, swapped, or expanded with the generator.</p>
        <section className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button key={t.slug} disabled={!!busy} onClick={() => create({ template: t.slug }, t.slug)}
              className={`stage theme-${t.theme} text-left rounded-2xl p-5 border border-white/15 hover:border-gold-400 transition !min-h-40 flex flex-col justify-between`}>
              <div>
                <span className="label !text-gold-300">{FORMAT_INFO[t.format].name}</span>
                <h3 className="font-serif text-2xl mt-1">{t.title}</h3>
              </div>
              <p className="text-sm text-gold-300 font-semibold mt-3">{busy === t.slug ? "Creating…" : "+ Add to my games"}</p>
            </button>
          ))}
        </section>

        <h2 className="font-display text-3xl mt-14">8 Game Modes — Start from Scratch or Preset</h2>
        <p className="text-cream-200/80">Pick a game mode below to build your own or use the built-in Christmas question generator inside.</p>
        <section className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCRATCH_MODES.map((m) => (
            <button
              key={m.key}
              disabled={!!busy}
              onClick={() =>
                create(
                  m.topic
                    ? { generate: true, format: m.format, topic: m.topic, count: m.count || 6, title: m.title }
                    : { format: m.format, title: `My ${m.title}` },
                  m.key
                )
              }
              className="card p-5 text-left hover:ring-4 ring-gold-400 transition flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider bg-cream-200 text-pine-800 px-2 py-0.5 rounded-md">
                  {m.badge}
                </span>
                <h3 className="font-serif text-xl text-cran-600 mt-2">{m.title}</h3>
                <p className="text-sm text-ink/80 mt-1">{m.desc}</p>
              </div>
              <p className="text-sm mt-4 font-bold text-pine-700">
                {busy === m.key ? "Creating…" : m.topic ? "✨ + Create with sample questions" : "+ Create blank game"}
              </p>
            </button>
          ))}
        </section>
      </main>
    </Stage>
  );
}

export default function Page() {
  return <Suspense><Dashboard /></Suspense>;
}

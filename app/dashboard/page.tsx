"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Stage } from "@/components/ui";
import { api, getKey, clearKey } from "@/lib/realtime";
import { TEMPLATES } from "@/lib/templates";
import { FORMAT_INFO, Format } from "@/lib/types";

type Row = { id: string; title: string; format: Format; updated_at: string; count: number; theme: string };

function Dashboard() {
  const r = useRouter();
  const sp = useSearchParams();
  const [games, setGames] = useState<Row[] | null>(null);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [showKey, setShowKey] = useState(false);

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

  return (
    <Stage>
      <Header right={<button className="btn btn-ghost text-sm" onClick={() => { clearKey(); r.push("/"); }}>Sign out</button>} />
      <main className="max-w-6xl mx-auto px-5 pb-24">
        {sp.get("welcome") && (
          <div className="card p-5 mb-6 flex flex-wrap items-center gap-4 justify-between">
            <div>
              <p className="font-serif text-2xl text-pine-800">{sp.get("welcome") === "new" ? "You're in! 🎄" : "Welcome back!"}</p>
              <p className="text-sm text-ink/70">Pick a ready-made Christmas game below or build your own from scratch.</p>
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
          {games?.length === 0 && <p className="text-cream-200/70 col-span-full">No games yet. Start with one of the packs below.</p>}
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

        <h2 className="font-display text-3xl mt-14">Christmas packs</h2>
        <p className="text-cream-200/80">Ready to play. Every question can be changed, deleted or added to.</p>
        <section className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button key={t.slug} disabled={!!busy} onClick={() => create({ template: t.slug }, t.slug)}
              className={`stage theme-${t.theme} text-left rounded-2xl p-5 border border-white/15 hover:border-gold-400 transition !min-h-40`}>
              <span className="label !text-gold-300">{FORMAT_INFO[t.format].name}</span>
              <h3 className="font-serif text-2xl mt-1">{t.title}</h3>
              <p className="text-sm text-cream-200/80 mt-2">{busy === t.slug ? "Creating…" : "+ Add to my games"}</p>
            </button>
          ))}
        </section>

        <h2 className="font-display text-3xl mt-14">Start from scratch</h2>
        <section className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(FORMAT_INFO) as Format[]).map((f) => (
            <button key={f} disabled={!!busy} onClick={() => create({ format: f, title: `My ${FORMAT_INFO[f].name}` }, f)} className="card p-5 text-left hover:ring-4 ring-gold-400 transition">
              <h3 className="font-serif text-xl text-cran-600">{FORMAT_INFO[f].name}</h3>
              <p className="text-sm mt-1">{FORMAT_INFO[f].blurb}</p>
              <p className="text-sm mt-3 font-bold text-pine-700">{busy === f ? "Creating…" : "+ Blank game"}</p>
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

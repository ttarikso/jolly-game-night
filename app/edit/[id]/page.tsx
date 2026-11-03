"use client";
import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Header, Stage } from "@/components/ui";
import { api } from "@/lib/realtime";
import type { Game, McData, BoardData, TopData, BuzzerData } from "@/lib/types";
import { FORMAT_INFO } from "@/lib/types";
import { McEditor, BoardEditor, TopEditor, BuzzerEditor } from "@/components/editors";

const THEMES = [
  ["pine", "🌲 Pine Forest Green"],
  ["cranberry", "🎅 Santa Suit Red"],
  ["midnight", "🎄 Holly Green & Berry"],
  ["burgundy", "🍷 Velvet Christmas Red"],
  ["teal", "🌿 Evergreen & Gold"],
];

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [g, setG] = useState<Game | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<Game | null>(null);

  useEffect(() => {
    api<{ game: Game }>(`/api/games/${id}`).then(({ game }) => { setG(game); latest.current = game; }).catch((e) => setErr(e.message));
  }, [id]);

  const save = useCallback(async () => {
    const cur = latest.current;
    if (!cur) return;
    setStatus("saving");
    try {
      await api(`/api/games/${id}`, { method: "PUT", body: JSON.stringify({ title: cur.title, teams: cur.teams, theme: cur.theme, data: cur.data }) });
      setStatus("saved");
    } catch (e) { setStatus("error"); setErr((e as Error).message); }
  }, [id]);

  function update(patch: Partial<Game>) {
    setG((prev) => {
      const next = { ...(prev as Game), ...patch };
      latest.current = next;
      return next;
    });
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 700);
  }
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (status === "saving") { e.preventDefault(); } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [status]);

  if (err && !g) return <Stage><Header /><p className="text-center p-10">{err} <Link className="underline" href="/dashboard">Back</Link></p></Stage>;
  if (!g) return <Stage><Header /><p className="text-center p-10">Loading…</p></Stage>;

  const setData = (data: Game["data"]) => update({ data });

  return (
    <Stage theme={g.theme}>
      <Header right={<>
        <span className="text-sm text-cream-200/80 mr-2" aria-live="polite">{status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : status === "error" ? "Not saved!" : ""}</span>
        <Link href="/dashboard" className="btn btn-ghost">My games</Link>
        <Link href={`/host/${g.id}`} onClick={() => save()} className="btn btn-gold">▶ Play live</Link>
      </>} />
      <main className="max-w-5xl mx-auto px-5 pb-32">
        <div className="card p-5 grid md:grid-cols-[1fr_auto_auto] gap-4 items-end">
          <label className="block"><span className="label">{FORMAT_INFO[g.format].name} · Game title</span>
            <input className="input mt-1 text-xl font-serif" value={g.title} onChange={(e) => update({ title: e.target.value })} /></label>
          <label className="block"><span className="label">Colour theme</span>
            <select className="input mt-1" value={g.theme} onChange={(e) => update({ theme: e.target.value })}>
              {THEMES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
            </select></label>
          {g.format !== "top" && g.format !== "mc" ? (
            <label className="flex items-center gap-2 pb-3 text-ink font-semibold">
              <input type="checkbox" className="w-5 h-5 accent-cran-600" checked={g.teams} onChange={(e) => update({ teams: e.target.checked })} /> Play in teams
            </label>
          ) : <span className="text-sm text-ink/60 pb-3">{g.format === "top" ? "Always played in teams" : "Everyone plays for themselves"}</span>}
        </div>
        <div className="mt-6">
          {g.format === "mc" && <McEditor data={g.data as McData} onChange={setData} />}
          {g.format === "board" && <BoardEditor data={g.data as BoardData} onChange={setData} />}
          {g.format === "top" && <TopEditor data={g.data as TopData} onChange={setData} />}
          {g.format === "buzzer" && <BuzzerEditor data={g.data as BuzzerData} onChange={setData} />}
        </div>
      </main>
    </Stage>
  );
}

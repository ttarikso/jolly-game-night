"use client";
import { useEffect, useState } from "react";
import type { HostState } from "@/app/host/[id]/page";
import type { Game, McData, BoardData, TopData, BuzzerData } from "@/lib/types";
import type { PPlayer } from "@/lib/protocol";
import { TEAM_COLORS } from "@/lib/protocol";
import { OPTION_STYLE } from "./ui";

const name = (st: HostState, pid?: string) => (pid && st.players[pid]?.name) || "";
const teamOf = (st: HostState, pid?: string) => {
  const t = pid ? st.players[pid]?.team : null;
  return st.teamsMode && t != null ? st.teams[t]?.name : "";
};

function Big({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-8 md:p-10 text-center ${className}`}>{children}</div>;
}

function Controls({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3 justify-center mt-6">{children}</div>;
}

// ------------------------------------------------------------------ buzz panel (shared)
function BuzzPanel({ st, value, onRight, onWrong, onReopen }: { st: HostState; value: number; onRight: (v: number) => void; onWrong: () => void; onReopen: () => void }) {
  const first = st.order[0];
  return (
    <div className="mt-5 text-center" aria-live="polite">
      {first ? (
        <div className="pop inline-flex flex-col items-center rounded-3xl bg-gold-500 text-ink px-10 py-5">
          <span className="label !text-ink/70">Buzzed first</span>
          <span className="font-display text-5xl" data-testid="first-buzz">{name(st, first)}</span>
          {teamOf(st, first) && <span className="font-semibold">{teamOf(st, first)}</span>}
        </div>
      ) : st.buzzOpen ? (
        <p className="pulse text-2xl font-serif text-gold-300">Buzzers are open…</p>
      ) : null}
      {st.order.length > 1 && <p className="mt-3 text-cream-200/80">Next: {st.order.slice(1, 4).map((p) => name(st, p)).join(" · ")}</p>}
      <Controls>
        {first && <button className="btn bg-pine-600 text-white text-lg px-7" onClick={() => onRight(value)} data-testid="right">✓ Correct (+{value})</button>}
        {first && <button className="btn btn-cran text-lg px-7" onClick={onWrong} data-testid="wrong">✕ Wrong</button>}
        {!st.buzzOpen && !st.showAnswer && <button className="btn btn-ghost" onClick={onReopen}>Re-open buzzers</button>}
      </Controls>
    </div>
  );
}

// ------------------------------------------------------------------ Live quiz
export function McStage({ st, data, players, onReveal, onNext }: { st: HostState; data: McData; players: PPlayer[]; onReveal: () => void; onNext: () => void }) {
  const q = data.questions[st.i];
  const [, tick] = useState(0);
  useEffect(() => { const iv = setInterval(() => tick((x) => x + 1), 200); return () => clearInterval(iv); }, []);
  if (st.phase === "scores") {
    const top = players.slice().sort((a, b) => b.score - a.score).slice(0, 8);
    return (
      <Big>
        <h2 className="font-display text-5xl text-pine-800">Leaderboard</h2>
        <ol className="mt-6 space-y-2 max-w-2xl mx-auto">
          {top.map((p, i) => (
            <li key={p.id} className={`flex justify-between items-center rounded-2xl px-6 py-3 text-2xl font-bold ${i === 0 ? "bg-gold-500" : "bg-cream-200"}`}>
              <span>{i + 1}. {p.name}</span>
              <span className="font-block">{p.score}{st.gained[p.id] ? <span className="text-pine-700 text-base ml-2">+{st.gained[p.id]}</span> : null}</span>
            </li>
          ))}
        </ol>
        <Controls><button className="btn btn-gold text-xl px-10" onClick={onNext} data-testid="next">{st.i + 1 < data.questions.length ? "Next question ▶" : "See the winners 🏆"}</button></Controls>
      </Big>
    );
  }
  const left = Math.max(0, Math.ceil((st.startedAt + q.time * 1000 - Date.now()) / 1000));
  const reveal = st.phase === "reveal";
  const counts = q.options.map((_, k) => Object.values(st.answers).filter((a) => a.c === k).length);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gold-300">Question {st.i + 1} of {data.questions.length}</span>
        {!reveal && <span className="text-cream-200">{Object.keys(st.answers).length} / {players.length} answered</span>}
      </div>
      <Big className="relative">
        {!reveal && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-cran-600 text-white font-block text-3xl grid place-items-center ring-4 ring-cream-50" data-testid="timer">{left}</div>
        )}
        <h2 className="font-serif text-4xl md:text-5xl leading-tight">{q.q}</h2>
      </Big>
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        {q.options.map((o, k) => {
          const S = OPTION_STYLE[k];
          const dim = reveal && k !== q.correct;
          return (
            <div key={k} className={`rounded-2xl px-6 py-5 flex items-center gap-4 text-2xl md:text-3xl font-bold ${S.bg} ${S.text} ${dim ? "opacity-30" : ""} ${reveal && k === q.correct ? "ring-8 ring-white pop" : ""}`}>
              <span className="text-3xl">{S.sym}</span><span className="flex-1">{o}</span>
              {reveal && <span className="font-block text-xl">{counts[k]}</span>}
            </div>
          );
        })}
      </div>
      {reveal && q.note && <p className="mt-5 text-center text-xl italic text-gold-300 font-serif">{q.note}</p>}
      <Controls>
        {!reveal ? <button className="btn btn-ghost" onClick={onReveal}>Stop timer & reveal</button>
          : <button className="btn btn-gold text-xl px-10" onClick={onNext} data-testid="next">Leaderboard ▶</button>}
      </Controls>
    </div>
  );
}

// ------------------------------------------------------------------ Quiz board
export function BoardStage({ st, data, onPick, onBack, onRight, onWrong, onReveal, onFinal, onReopen }: {
  st: HostState; data: BoardData; onPick: (c: number, q: number) => void; onBack: () => void; onRight: (v: number) => void; onWrong: () => void; onReveal: () => void; onFinal: () => void; onReopen: () => void;
}) {
  if (st.phase === "final" && data.final) {
    return (
      <div>
        <p className="text-center font-display text-4xl text-gold-400 mb-4">★ Final Question ★</p>
        <Big><h2 className="font-serif text-4xl md:text-5xl">{data.final.q}</h2></Big>
        {st.showAnswer ? <div className="flip mt-5 card !bg-gold-500 p-6 text-center font-display text-5xl">{data.final.a}</div> : null}
        <p className="text-center mt-4 text-cream-200/80">Teams write a wager first. Use + / − on the scoreboard to settle it.</p>
        <Controls>
          {!st.showAnswer && <button className="btn btn-gold text-lg" onClick={onReveal}>Reveal answer</button>}
          <button className="btn btn-ghost" onClick={onBack}>Back to board</button>
        </Controls>
      </div>
    );
  }
  if (st.phase === "q" && st.cur) {
    const c = data.categories[st.cur.c], q = c.questions[st.cur.q];
    return (
      <div>
        <p className="text-center font-semibold text-gold-300 mb-3 text-xl">{c.name} · {q.value}</p>
        <Big><h2 className="font-serif text-4xl md:text-5xl leading-tight">{q.q}</h2></Big>
        {st.showAnswer && <div className="flip mt-5 card !bg-gold-500 p-6 text-center font-display text-4xl md:text-5xl" data-testid="answer">{q.a}</div>}
        <BuzzPanel st={st} value={q.value} onRight={onRight} onWrong={onWrong} onReopen={onReopen} />
        <Controls>
          {!st.showAnswer && <button className="btn btn-ghost" onClick={onReveal}>Reveal answer</button>}
          <button className="btn btn-gold text-lg px-8" onClick={onBack} data-testid="back">Back to board</button>
        </Controls>
      </div>
    );
  }
  const n = data.categories.length;
  const rows = Math.max(...data.categories.map((c) => c.questions.length));
  const allUsed = data.categories.every((c, ci) => c.questions.every((_, qi) => st.used.includes(`${ci}-${qi}`)));
  return (
    <div>
      <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {data.categories.map((c, ci) => (
          <div key={ci} className="rounded-xl bg-cran-600 text-white font-bold text-center grid place-items-center px-2 py-3 min-h-16 text-sm md:text-lg uppercase leading-tight">{c.name}</div>
        ))}
        {Array.from({ length: rows }).map((_, qi) =>
          data.categories.map((c, ci) => {
            const q = c.questions[qi];
            if (!q) return <div key={`${ci}-${qi}`} />;
            const used = st.used.includes(`${ci}-${qi}`);
            return (
              <button key={`${ci}-${qi}`} disabled={used} onClick={() => onPick(ci, qi)} data-testid={`tile-${ci}-${qi}`}
                className={`rounded-xl border-2 font-block text-2xl md:text-4xl py-3 md:py-5 transition ${used ? "border-white/10 text-white/15 bg-black/10" : "border-gold-500 text-gold-400 bg-pine-900/60 hover:bg-gold-500 hover:text-ink"}`}>
                {used ? "" : q.value}
              </button>
            );
          }),
        )}
      </div>
      {data.final && <Controls><button className={`btn ${allUsed ? "btn-gold" : "btn-ghost"} text-lg px-8`} onClick={onFinal}>★ Final question</button></Controls>}
    </div>
  );
}

// ------------------------------------------------------------------ Buzz & answer
export function BuzzStage({ st, data, onRight, onWrong, onReveal, onNext, onReopen }: {
  st: HostState; data: BuzzerData; onRight: (v: number) => void; onWrong: () => void; onReveal: () => void; onNext: () => void; onReopen: () => void;
}) {
  const q = data.questions[st.i];
  return (
    <div>
      <p className="text-center font-semibold text-gold-300 mb-3">Clue {st.i + 1} of {data.questions.length}</p>
      <Big>
        <h2 className={q.big ? "text-7xl md:text-8xl leading-snug" : "font-serif text-4xl md:text-5xl leading-tight"}>{q.q}</h2>
        {q.hint && <p className="mt-4 text-xl italic text-ink/60 font-serif">{q.hint}</p>}
      </Big>
      {st.showAnswer && <div className="flip mt-5 card !bg-gold-500 p-6 text-center font-display text-4xl md:text-5xl" data-testid="answer">{q.a}</div>}
      <BuzzPanel st={st} value={q.points ?? 100} onRight={onRight} onWrong={onWrong} onReopen={onReopen} />
      <Controls>
        {!st.showAnswer && <button className="btn btn-ghost" onClick={onReveal}>Reveal answer</button>}
        <button className="btn btn-gold text-lg px-8" onClick={onNext} data-testid="next">{st.i + 1 < data.questions.length ? "Next clue ▶" : "See the winners 🏆"}</button>
      </Controls>
    </div>
  );
}

// ------------------------------------------------------------------ Top answers
export function TopStage({ st, data, onReveal, onStrike, onBank, onNext, onReopen, onRevealAll }: {
  st: HostState; data: TopData; onReveal: (k: number) => void; onStrike: () => void; onBank: (team: number) => void; onNext: () => void; onReopen: () => void; onRevealAll: () => void;
}) {
  const r = data.rounds[st.i];
  const n = Math.max(r.answers.length, 4);
  const half = Math.ceil(n / 2);
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gold-300">Round {st.i + 1} of {data.rounds.length}</span>
        <span className="flex items-center gap-3">
          <span className="text-cream-200">Bank</span>
          <span className="font-block text-4xl text-gold-400 min-w-20 text-center rounded-xl bg-black/30 px-3" data-testid="bank">{st.bank}</span>
        </span>
      </div>
      <Big className="!py-6"><h2 className="font-serif text-3xl md:text-5xl">{r.q}</h2></Big>
      <div className="grid md:grid-flow-col gap-3 mt-4" style={{ gridTemplateRows: `repeat(${half}, minmax(0, 1fr))` }}>
        {Array.from({ length: n }).map((_, k) => {
          const a = r.answers[k];
          const open = st.revealed.includes(k);
          if (!a) return <div key={k} className="rounded-2xl bg-black/20 border border-white/5 h-16 md:h-20" />;
          return open ? (
            <div key={k} className="flip rounded-2xl bg-gold-500 text-ink flex items-center justify-between px-5 h-16 md:h-20 text-xl md:text-3xl font-bold uppercase">
              <span>{a.text}</span><span className="font-block bg-ink text-gold-400 rounded-xl px-3 py-1">{a.points}</span>
            </div>
          ) : (
            <button key={k} onClick={() => onReveal(k)} data-testid={`ans-${k}`} className="rounded-2xl bg-pine-800 border-2 border-gold-500 text-gold-400 font-block text-3xl h-16 md:h-20 hover:bg-pine-700">{k + 1}</button>
          );
        })}
      </div>
      {st.strikeAnim > 0 && Date.now() - st.strikeAnim < 1200 && (
        <div key={st.strikeAnim} className="strike pointer-events-none absolute inset-0 grid place-items-center">
          <span className="font-block text-[14rem] text-cran-500 drop-shadow-2xl">{"✕".repeat(st.strikes)}</span>
        </div>
      )}
      <div className="flex justify-center gap-2 mt-4" aria-label="Strikes">
        {[0, 1, 2].map((k) => <span key={k} className={`w-12 h-12 rounded-xl grid place-items-center font-block text-2xl ${k < st.strikes ? "bg-cran-600 text-white" : "bg-black/20 text-white/20"}`}>✕</span>)}
      </div>
      {st.order[0] && <p className="text-center mt-3 text-xl">Buzzed first: <b className="text-gold-400" data-testid="first-buzz">{name(st, st.order[0])}</b> {teamOf(st, st.order[0]) && `(${teamOf(st, st.order[0])})`}</p>}
      <Controls>
        <button className="btn btn-cran text-lg px-7" onClick={onStrike} disabled={st.strikes >= 3} data-testid="strike">✕ Strike</button>
        {st.teams.map((t, i) => (
          <button key={i} className="btn text-white text-lg" style={{ background: TEAM_COLORS[i] }} disabled={!st.bank} onClick={() => onBank(i)} data-testid={`bank-${i}`}>Bank to {t.name}</button>
        ))}
        <button className="btn btn-ghost" onClick={onRevealAll}>Show all</button>
        <button className="btn btn-ghost" onClick={onReopen}>Reset buzzers</button>
        <button className="btn btn-gold text-lg px-8" onClick={onNext} data-testid="next">{st.i + 1 < data.rounds.length ? "Next round ▶" : "See the winners 🏆"}</button>
      </Controls>
    </div>
  );
}

// ------------------------------------------------------------------ scoreboard + podium
export function Scoreboard({ st, players, onAdjust, step }: { st: HostState; players: PPlayer[]; onAdjust: (k: "team" | "player", key: number | string, pts: number) => void; step: number }) {
  const rows = st.teamsMode
    ? st.teams.map((t, i) => ({ key: i as number | string, label: t.name, score: t.score, color: TEAM_COLORS[i], sub: players.filter((p) => p.team === i).length + " players" }))
    : players.slice().sort((a, b) => b.score - a.score).slice(0, 12).map((p) => ({ key: p.id as number | string, label: p.name, score: p.score, color: "", sub: "" }));
  return (
    <aside className="rounded-2xl bg-black/25 border border-white/10 p-4 self-start lg:mt-10">
      <h3 className="label !text-gold-300 mb-3">Scores</h3>
      {rows.length === 0 && <p className="text-sm text-cream-200/70">No players yet. Share the PIN!</p>}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.key} className="rounded-xl bg-white/5 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold truncate flex items-center gap-2">{r.color && <span className="w-3 h-3 rounded-full" style={{ background: r.color }} />}{r.label}</span>
              <span className="font-block text-xl text-gold-400" data-testid={`score-${r.label}`}>{r.score}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-cream-200/60">{r.sub}</span>
              <span className="flex gap-1">
                <button className="text-xs rounded-full bg-white/10 px-2 py-0.5" onClick={() => onAdjust(st.teamsMode ? "team" : "player", r.key, -step)}>−{step}</button>
                <button className="text-xs rounded-full bg-white/10 px-2 py-0.5" onClick={() => onAdjust(st.teamsMode ? "team" : "player", r.key, step)}>+{step}</button>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Podium({ st, game, onAgain }: { st: HostState; game: Game; onAgain: () => void }) {
  const list = st.teamsMode
    ? st.teams.map((t, i) => ({ k: String(i), label: t.name, score: t.score }))
    : Object.values(st.players).map((p) => ({ k: p.id, label: p.name, score: p.score }));
  const sorted = list.sort((a, b) => b.score - a.score);
  const [a, b, c] = sorted;
  const col = (x: typeof a | undefined, h: string, medal: string, delay: string) =>
    x ? (
      <div className="flex flex-col items-center justify-end pop" style={{ animationDelay: delay }}>
        <span className="text-5xl">{medal}</span>
        <span className="font-display text-3xl md:text-4xl text-center mt-2">{x.label}</span>
        <span className="font-block text-gold-400 text-2xl">{x.score}</span>
        <div className={`mt-3 w-36 md:w-48 rounded-t-2xl bg-gold-500/90 ${h}`} />
      </div>
    ) : <div />;
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <p className="font-script text-5xl text-gold-400">And the winner is…</p>
      <h2 className="font-display text-6xl mt-2" data-testid="winner">{a ? a.label : "Everyone!"}</h2>
      <div className="grid grid-cols-3 gap-4 items-end mt-10">
        {col(b, "h-28", "🥈", ".2s")}{col(a, "h-44", "🏆", "0s")}{col(c, "h-20", "🥉", ".4s")}
      </div>
      <div className="flex gap-3 mt-10">
        <button className="btn btn-gold" onClick={onAgain}>Play again</button>
        <a className="btn btn-ghost" href="/dashboard">My games</a>
      </div>
      <p className="mt-4 text-sm text-cream-200/60">{game.title}</p>
    </div>
  );
}

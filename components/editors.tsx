"use client";
import { useState } from "react";
import type { Format, McData, BoardData, TopData, BuzzerData, McQuestion, BuzzerQuestion } from "@/lib/types";
import {
  GEN_TOPICS,
  generateMcQuestions,
  generateBuzzerQuestions,
  generateBoardCategories,
  generateTopRounds
} from "@/lib/generator";
import { toast } from "@/components/base/toast/toast";
import { OPTION_STYLE } from "./ui";

function move<T>(list: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const c = list.slice();
  [c[i], c[j]] = [c[j], c[i]];
  return c;
}

function ItemTools({
  i,
  n,
  onMove,
  onSwapRandom,
  onDup,
  onDel
}: {
  i: number;
  n: number;
  onMove: (d: number) => void;
  onSwapRandom?: () => void;
  onDup: () => void;
  onDel: () => void;
}) {
  const b = "w-9 h-9 rounded-full bg-cream-200 hover:bg-gold-300 text-ink grid place-items-center disabled:opacity-30 transition";
  return (
    <div className="flex gap-1 items-center">
      {onSwapRandom && (
        <button
          type="button"
          className="h-9 px-3 rounded-full bg-pine-700 hover:bg-pine-600 text-white text-xs font-bold flex items-center gap-1 transition"
          onClick={onSwapRandom}
          title="Swap with a random Christmas question"
        >
          🎲 Swap
        </button>
      )}
      <button type="button" className={b} disabled={i === 0} onClick={() => onMove(-1)} aria-label="Move up">↑</button>
      <button type="button" className={b} disabled={i === n - 1} onClick={() => onMove(1)} aria-label="Move down">↓</button>
      <button type="button" className={b} onClick={onDup} aria-label="Duplicate">⧉</button>
      <button type="button" className={b} onClick={onDel} aria-label="Delete">✕</button>
    </div>
  );
}

function GeneratorPanel({
  format,
  unitLabel,
  counts,
  onGenerate
}: {
  format: Format;
  unitLabel: string;
  counts: number[];
  onGenerate: (topic: string, count: number) => void;
}) {
  const topics = GEN_TOPICS.filter((t) => t.formats.includes(format));
  const [topic, setTopic] = useState(topics[0]?.id || "mix");
  const [flash, setFlash] = useState("");

  function trigger(c: number) {
    onGenerate(topic, c);
    const t = topics.find((x) => x.id === topic);
    const msg = `Added ${c} ${c === 1 ? unitLabel.replace(/s$/, "") : unitLabel} (${t?.label || "Christmas"})! ✨`;
    setFlash(msg);
    toast.success("Christmas questions generated!", { description: msg });
    setTimeout(() => setFlash(""), 2600);
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-pine-900/90 via-pine-800/90 to-cran-700/80 border-2 border-gold-400/70 p-5 mb-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-gold-400 text-ink px-2.5 py-0.5 rounded-full">
            🎄 Christmas Question Generator
          </span>
          <h3 className="font-serif text-2xl text-cream-50 mt-1">
            Need fun holiday {unitLabel}? Generate them in one click!
          </h3>
        </div>
        {flash && <span className="pop text-sm font-bold bg-gold-400 text-ink px-3 py-1.5 rounded-full">{flash}</span>}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {topics.map((t) => {
          const active = topic === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopic(t.id)}
              className={`rounded-xl px-3.5 py-2 text-left text-sm transition border ${
                active
                  ? "bg-gold-400 text-ink border-gold-300 font-bold shadow"
                  : "bg-black/25 text-cream-100 border-white/15 hover:border-gold-400/60"
              }`}
            >
              <span className="mr-1.5">{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/15">
        <p className="text-xs text-cream-200/80">
          {topics.find((x) => x.id === topic)?.desc} · Tip: Use <b>🎲 Swap</b> on any item below to replace just that one!
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {counts.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => trigger(c)}
              className="btn btn-gold !py-2 !px-4 text-sm font-bold"
            >
              ✨ + Generate {c} {c === 1 ? unitLabel.replace(/s$/, "") : unitLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddBar({ label, onAdd, onBulk, onGenQuick }: { label: string; onAdd: () => void; onBulk?: () => void; onGenQuick?: () => void }) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <button type="button" className="btn btn-gold" onClick={onAdd}>+ {label}</button>
      {onGenQuick && (
        <button type="button" className="btn btn-cran" onClick={onGenQuick}>
          🎄 + Generate 5 Christmas questions
        </button>
      )}
      {onBulk && <button type="button" className="btn btn-ghost" onClick={onBulk}>Paste many at once</button>}
    </div>
  );
}

function BulkBox({ hint, onDone, onCancel }: { hint: string; onDone: (text: string) => void; onCancel: () => void }) {
  const [t, setT] = useState("");
  return (
    <div className="card p-5 mt-4">
      <p className="text-sm mb-2">{hint}</p>
      <textarea className="input h-44 font-mono text-sm" value={t} onChange={(e) => setT(e.target.value)} />
      <div className="flex gap-2 mt-3">
        <button type="button" className="btn btn-gold" onClick={() => onDone(t)}>Add these</button>
        <button type="button" className="btn bg-cream-200 text-ink" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Live Quiz (multiple choice)
export function McEditor({ data, onChange }: { data: McData; onChange: (d: McData) => void }) {
  const [bulk, setBulk] = useState(false);
  const qs = data.questions;
  const set = (list: McQuestion[]) => onChange({ questions: list });
  const setQ = (i: number, p: Partial<McQuestion>) => set(qs.map((q, k) => (k === i ? { ...q, ...p } : q)));
  const existingTexts = () => qs.map((x) => x.q);

  return (
    <div>
      <GeneratorPanel
        format="mc"
        unitLabel="questions"
        counts={[1, 5, 10]}
        onGenerate={(topic, count) => {
          const gen = generateMcQuestions(topic, count, existingTexts());
          set([...qs, ...gen]);
        }}
      />
      <p className="text-cream-200/80 mb-3">{qs.length} questions · players answer on their phones. Tick the correct answer.</p>
      <div className="space-y-4">
        {qs.map((q, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-block text-cran-600">Q{i + 1}</span>
              <ItemTools
                i={i}
                n={qs.length}
                onMove={(d) => set(move(qs, i, d))}
                onSwapRandom={() => {
                  const [replacement] = generateMcQuestions("mix", 1, existingTexts());
                  if (replacement) setQ(i, replacement);
                }}
                onDup={() => set([...qs.slice(0, i + 1), structuredClone(q), ...qs.slice(i + 1)])}
                onDel={() => set(qs.filter((_, k) => k !== i))}
              />
            </div>
            <textarea className="input font-serif text-lg" rows={2} value={q.q} placeholder="Question" onChange={(e) => setQ(i, { q: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              {q.options.map((o, k) => (
                <div key={k} className={`flex items-center gap-2 rounded-xl p-1.5 ${q.correct === k ? "bg-gold-300" : "bg-cream-100"}`}>
                  <span className={`w-9 h-9 shrink-0 rounded-lg grid place-items-center ${OPTION_STYLE[k].bg} ${OPTION_STYLE[k].text}`}>{OPTION_STYLE[k].sym}</span>
                  <input className="input !py-1.5 !border-transparent" value={o} placeholder={`Answer ${k + 1}`} onChange={(e) => setQ(i, { options: q.options.map((x, j) => (j === k ? e.target.value : x)) })} />
                  <label className="flex items-center gap-1 text-xs font-bold pr-1 cursor-pointer" title="Correct answer">
                    <input type="radio" className="w-5 h-5 accent-pine-700" checked={q.correct === k} onChange={() => setQ(i, { correct: k })} />✓
                  </label>
                  {q.options.length > 2 && (
                    <button type="button" aria-label="Remove answer" className="text-ink/50 px-1" onClick={() => setQ(i, { options: q.options.filter((_, j) => j !== k), correct: q.correct === k ? 0 : q.correct > k ? q.correct - 1 : q.correct })}>✕</button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3 items-center">
              {q.options.length < 4 && <button type="button" className="text-sm underline" onClick={() => setQ(i, { options: [...q.options, ""] })}>+ answer</button>}
              <label className="text-sm flex items-center gap-2">Time
                <select className="input !w-auto !py-1" value={q.time} onChange={(e) => setQ(i, { time: Number(e.target.value) })}>
                  {[10, 15, 20, 30, 45, 60, 90].map((t) => <option key={t} value={t}>{t}s</option>)}
                </select></label>
              <input className="input !py-1.5 flex-1 min-w-48 text-sm" value={q.note || ""} placeholder="Fun fact shown after the answer (optional)" onChange={(e) => setQ(i, { note: e.target.value })} />
            </div>
          </div>
        ))}
      </div>
      {bulk ? (
        <BulkBox hint="One question per line: Question | correct answer | wrong answer | wrong answer | wrong answer. The answers are shuffled for you."
          onCancel={() => setBulk(false)}
          onDone={(t) => {
            const add: McQuestion[] = t.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p.length >= 3 && p[0]).map((p) => {
              const opts = p.slice(1, 5);
              const right = opts[0];
              const sh = opts.map((o) => [Math.random(), o] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
              return { q: p[0], options: sh, correct: sh.indexOf(right), time: 20 };
            });
            set([...qs, ...add]); setBulk(false);
          }} />
      ) : (
        <AddBar
          label="Add blank question"
          onAdd={() => set([...qs, { q: "", options: ["", "", "", ""], correct: 0, time: 20 }])}
          onGenQuick={() => set([...qs, ...generateMcQuestions("mix", 5, existingTexts())])}
          onBulk={() => setBulk(true)}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------ Buzz & Answer
export function BuzzerEditor({ data, onChange }: { data: BuzzerData; onChange: (d: BuzzerData) => void }) {
  const [bulk, setBulk] = useState(false);
  const qs = data.questions;
  const set = (list: BuzzerQuestion[]) => onChange({ questions: list });
  const setQ = (i: number, p: Partial<BuzzerQuestion>) => set(qs.map((q, k) => (k === i ? { ...q, ...p } : q)));
  const existingTexts = () => qs.map((x) => x.q);

  return (
    <div>
      <GeneratorPanel
        format="buzzer"
        unitLabel="clues"
        counts={[1, 5, 8]}
        onGenerate={(topic, count) => {
          const gen = generateBuzzerQuestions(topic, count, existingTexts());
          set([...qs, ...gen]);
        }}
      />
      <p className="text-cream-200/80 mb-3">{qs.length} clues · the first player to buzz answers out loud, you mark it right or wrong.</p>
      <div className="space-y-4">
        {qs.map((q, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-block text-cran-600">#{i + 1}</span>
              <ItemTools
                i={i}
                n={qs.length}
                onMove={(d) => set(move(qs, i, d))}
                onSwapRandom={() => {
                  const [replacement] = generateBuzzerQuestions("mix", 1, existingTexts());
                  if (replacement) setQ(i, replacement);
                }}
                onDup={() => set([...qs.slice(0, i + 1), structuredClone(q), ...qs.slice(i + 1)])}
                onDel={() => set(qs.filter((_, k) => k !== i))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="block"><span className="label">Clue (text or emoji)</span>
                <textarea className={`input mt-1 ${q.big ? "text-3xl" : "font-serif text-lg"}`} rows={2} value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} /></label>
              <label className="block"><span className="label">Answer</span>
                <textarea className="input mt-1 font-serif text-lg" rows={2} value={q.a} onChange={(e) => setQ(i, { a: e.target.value })} /></label>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 items-center">
              <input className="input !py-1.5 flex-1 min-w-48 text-sm" value={q.hint || ""} placeholder="Small hint shown under the clue (optional)" onChange={(e) => setQ(i, { hint: e.target.value })} />
              <label className="text-sm flex items-center gap-2">Points <input type="number" className="input !w-24 !py-1" value={q.points ?? 100} onChange={(e) => setQ(i, { points: Number(e.target.value) })} /></label>
              <label className="text-sm flex items-center gap-2"><input type="checkbox" className="w-5 h-5" checked={!!q.big} onChange={(e) => setQ(i, { big: e.target.checked })} /> Extra-large clue (emoji)</label>
            </div>
          </div>
        ))}
      </div>
      {bulk ? (
        <BulkBox hint="One per line: clue | answer" onCancel={() => setBulk(false)}
          onDone={(t) => {
            const add = t.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p.length >= 2 && p[0]).map((p) => ({ q: p[0], a: p[1], points: 100 }));
            set([...qs, ...add]); setBulk(false);
          }} />
      ) : (
        <AddBar
          label="Add blank clue"
          onAdd={() => set([...qs, { q: "", a: "", points: 100 }])}
          onGenQuick={() => set([...qs, ...generateBuzzerQuestions("mix", 5, existingTexts())])}
          onBulk={() => setBulk(true)}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------ Quiz Board
export function BoardEditor({ data, onChange }: { data: BoardData; onChange: (d: BoardData) => void }) {
  const cats = data.categories;
  const setCats = (c: BoardData["categories"]) => onChange({ ...data, categories: c });
  const setCat = (i: number, p: Partial<BoardData["categories"][0]>) => setCats(cats.map((c, k) => (k === i ? { ...c, ...p } : c)));
  const existingNames = () => cats.map((x) => x.name);

  return (
    <div>
      <GeneratorPanel
        format="board"
        unitLabel="categories"
        counts={[1, 2]}
        onGenerate={(topic, count) => {
          const roomLeft = Math.max(0, 8 - cats.length);
          if (roomLeft === 0) return;
          const gen = generateBoardCategories(topic, Math.min(count, roomLeft), existingNames());
          setCats([...cats, ...gen]);
        }}
      />
      <p className="text-cream-200/80 mb-3">{cats.length} categories · up to 8 categories and 10 questions each.</p>
      <div className="space-y-4">
        {cats.map((c, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3">
              <input className="input font-serif text-xl !bg-cran-600 !text-white !border-cran-600 placeholder:text-white/60" value={c.name} placeholder="Category name" onChange={(e) => setCat(i, { name: e.target.value })} />
              <ItemTools
                i={i}
                n={cats.length}
                onMove={(d) => setCats(move(cats, i, d))}
                onSwapRandom={() => {
                  const [replacement] = generateBoardCategories("mix", 1, existingNames());
                  if (replacement) setCat(i, replacement);
                }}
                onDup={() => cats.length < 8 && setCats([...cats.slice(0, i + 1), structuredClone(c), ...cats.slice(i + 1)])}
                onDel={() => setCats(cats.filter((_, k) => k !== i))}
              />
            </div>
            <div className="mt-3 space-y-2">
              {c.questions.map((q, k) => (
                <div key={k} className="grid grid-cols-[5.5rem_1fr_1fr_auto] gap-2 items-start">
                  <input type="number" className="input font-block !px-2 text-center" value={q.value} onChange={(e) => setCat(i, { questions: c.questions.map((x, j) => (j === k ? { ...x, value: Number(e.target.value) } : x)) })} />
                  <textarea rows={2} className="input text-sm" value={q.q} placeholder="Question" onChange={(e) => setCat(i, { questions: c.questions.map((x, j) => (j === k ? { ...x, q: e.target.value } : x)) })} />
                  <textarea rows={2} className="input text-sm" value={q.a} placeholder="Answer" onChange={(e) => setCat(i, { questions: c.questions.map((x, j) => (j === k ? { ...x, a: e.target.value } : x)) })} />
                  <button type="button" className="w-9 h-9 rounded-full bg-cream-200 mt-1" aria-label="Delete question" onClick={() => setCat(i, { questions: c.questions.filter((_, j) => j !== k) })}>✕</button>
                </div>
              ))}
            </div>
            {c.questions.length < 10 && <button type="button" className="text-sm underline mt-2" onClick={() => setCat(i, { questions: [...c.questions, { value: (c.questions.at(-1)?.value || 0) + 100, q: "", a: "" }] })}>+ question</button>}
          </div>
        ))}
      </div>
      {cats.length < 8 && (
        <AddBar
          label="Add blank category"
          onAdd={() => setCats([...cats, { name: "", questions: [100, 200, 300, 400, 500].map((v) => ({ value: v, q: "", a: "" })) }])}
        />
      )}
      <div className="card p-5 mt-6">
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" className="w-5 h-5" checked={!!data.final} onChange={(e) => onChange({ ...data, final: e.target.checked ? { q: "", a: "" } : null })} /> Final question (teams wager their points)</label>
        {data.final && (
          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <textarea className="input font-serif" rows={2} placeholder="Final question" value={data.final.q} onChange={(e) => onChange({ ...data, final: { ...data.final!, q: e.target.value } })} />
            <textarea className="input font-serif" rows={2} placeholder="Answer" value={data.final.a} onChange={(e) => onChange({ ...data, final: { ...data.final!, a: e.target.value } })} />
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Top Answers
export function TopEditor({ data, onChange }: { data: TopData; onChange: (d: TopData) => void }) {
  const rs = data.rounds;
  const set = (r: TopData["rounds"]) => onChange({ rounds: r });
  const setR = (i: number, p: Partial<TopData["rounds"][0]>) => set(rs.map((r, k) => (k === i ? { ...r, ...p } : r)));
  const existingQuestions = () => rs.map((x) => x.q);

  return (
    <div>
      <GeneratorPanel
        format="top"
        unitLabel="rounds"
        counts={[1, 3, 5]}
        onGenerate={(topic, count) => {
          const gen = generateTopRounds(topic, count, existingQuestions());
          set([...rs, ...gen]);
        }}
      />
      <p className="text-cream-200/80 mb-3">{rs.length} rounds · up to 10 answers per round, highest points first works best.</p>
      <div className="space-y-4">
        {rs.map((r, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-block text-cran-600">Round {i + 1}</span>
              <ItemTools
                i={i}
                n={rs.length}
                onMove={(d) => set(move(rs, i, d))}
                onSwapRandom={() => {
                  const [replacement] = generateTopRounds("mix", 1, existingQuestions());
                  if (replacement) setR(i, replacement);
                }}
                onDup={() => set([...rs.slice(0, i + 1), structuredClone(r), ...rs.slice(i + 1)])}
                onDel={() => set(rs.filter((_, k) => k !== i))}
              />
            </div>
            <input className="input font-serif text-lg" value={r.q} placeholder="Name something…" onChange={(e) => setR(i, { q: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              {r.answers.map((a, k) => (
                <div key={k} className="flex gap-2 items-center">
                  <span className="w-7 text-center font-block text-ink/50">{k + 1}</span>
                  <input className="input !py-1.5" value={a.text} placeholder="Answer" onChange={(e) => setR(i, { answers: r.answers.map((x, j) => (j === k ? { ...x, text: e.target.value } : x)) })} />
                  <input type="number" className="input !py-1.5 !w-20 text-center font-block" value={a.points} onChange={(e) => setR(i, { answers: r.answers.map((x, j) => (j === k ? { ...x, points: Number(e.target.value) } : x)) })} />
                  <button type="button" className="w-8 h-8 rounded-full bg-cream-200 shrink-0" aria-label="Delete answer" onClick={() => setR(i, { answers: r.answers.filter((_, j) => j !== k) })}>✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2 text-sm">
              {r.answers.length < 10 && <button type="button" className="underline" onClick={() => setR(i, { answers: [...r.answers, { text: "", points: 5 }] })}>+ answer</button>}
              <span className="text-ink/60">Total: {r.answers.reduce((n, a) => n + (a.points || 0), 0)} points</span>
            </div>
          </div>
        ))}
      </div>
      <AddBar label="Add blank round" onAdd={() => set([...rs, { q: "", answers: [40, 25, 15, 10, 6, 4].map((p) => ({ text: "", points: p })) }])} />
    </div>
  );
}

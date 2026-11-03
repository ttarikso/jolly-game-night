import type { Format, GameData, McData, BoardData, TopData, BuzzerData } from "./types";

const str = (v: unknown, max = 500) => String(v ?? "").slice(0, max);
const num = (v: unknown, d: number, lo: number, hi: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, Math.round(n))) : d;
};
const arr = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);

/** Clean user-submitted game data so the stored JSON always has the expected shape. */
export function cleanData(format: Format, raw: unknown): GameData {
  const r = (raw || {}) as Record<string, unknown>;
  if (format === "mc") {
    const d: McData = {
      questions: arr(r.questions, 500).map((x) => {
        const q = x as Record<string, unknown>;
        const options = arr(q.options, 4).map((o) => str(o, 160));
        while (options.length < 2) options.push("");
        return { q: str(q.q), options, correct: num(q.correct, 0, 0, options.length - 1), time: num(q.time, 20, 5, 120), note: str(q.note, 300) };
      }),
    };
    return d;
  }
  if (format === "board") {
    const f = r.final as Record<string, unknown> | null | undefined;
    const d: BoardData = {
      categories: arr(r.categories, 8).map((c) => {
        const cc = c as Record<string, unknown>;
        return { name: str(cc.name, 60), questions: arr(cc.questions, 10).map((x) => { const q = x as Record<string, unknown>; return { value: num(q.value, 100, 0, 100000), q: str(q.q), a: str(q.a, 300) }; }) };
      }),
      final: f && (f.q || f.a) ? { q: str(f.q), a: str(f.a, 300) } : null,
    };
    return d;
  }
  if (format === "top") {
    const d: TopData = {
      rounds: arr(r.rounds, 200).map((x) => {
        const q = x as Record<string, unknown>;
        return { q: str(q.q), answers: arr(q.answers, 10).map((a) => { const aa = a as Record<string, unknown>; return { text: str(aa.text, 80), points: num(aa.points, 10, 0, 1000) }; }) };
      }),
    };
    return d;
  }
  const d: BuzzerData = {
    questions: arr(r.questions, 500).map((x) => {
      const q = x as Record<string, unknown>;
      return { q: str(q.q), a: str(q.a, 300), hint: str(q.hint, 200), big: !!q.big, points: num(q.points, 100, 0, 100000) };
    }),
  };
  return d;
}

export const FORMATS: Format[] = ["mc", "board", "top", "buzzer"];

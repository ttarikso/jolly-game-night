import { NextRequest, NextResponse } from "next/server";
import { requireLicense, bad } from "@/lib/auth";
import { listGames, createGame } from "@/lib/store";
import { cleanData, FORMATS } from "@/lib/validate";
import { TEMPLATES, BLANK } from "@/lib/templates";
import { generateFullGameData } from "@/lib/generator";
import type { Format } from "@/lib/types";

export async function GET(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const games = await listGames(lic.id);
  return NextResponse.json({ games: games.map(({ data, ...g }) => ({ ...g, count: countItems(g.format, data) })) });
}

function countItems(format: Format, data: unknown): number {
  const d = data as Record<string, unknown[]>;
  if (format === "board") return (d.categories || []).reduce((n: number, c) => n + ((c as { questions: unknown[] }).questions?.length || 0), 0);
  if (format === "top") return (d.rounds || []).length;
  return (d.questions || []).length;
}

export async function POST(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const body = await req.json().catch(() => ({}));
  if (body.template) {
    const t = TEMPLATES.find((x) => x.slug === body.template);
    if (!t) return bad("Unknown template");
    const g = await createGame(lic.id, { title: t.title, format: t.format, teams: t.teams, theme: t.theme, data: structuredClone(t.data) });
    return NextResponse.json({ game: g });
  }
  const format = body.format as Format;
  if (!FORMATS.includes(format)) return bad("Unknown format");
  if (body.generate) {
    const topic = String(body.topic || "mix");
    const count = Math.min(30, Math.max(1, Number(body.count) || 8));
    const data = generateFullGameData(format, topic, count);
    const g = await createGame(lic.id, {
      title: String(body.title || "Christmas Party Game").slice(0, 120),
      format,
      teams: body.teams != null ? !!body.teams : (format === "top" || format === "board"),
      theme: String(body.theme || "pine"),
      data: cleanData(format, data),
    });
    return NextResponse.json({ game: g });
  }
  const g = await createGame(lic.id, {
    title: String(body.title || "My game").slice(0, 120),
    format,
    teams: body.teams != null ? !!body.teams : (format === "top" || format === "board"),
    theme: String(body.theme || "pine"),
    data: cleanData(format, structuredClone(BLANK[format])),
  });
  return NextResponse.json({ game: g });
}

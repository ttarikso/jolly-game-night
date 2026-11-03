import { NextRequest, NextResponse } from "next/server";
import { requireLicense, bad } from "@/lib/auth";
import { getGame, updateGame, deleteGame } from "@/lib/store";
import { cleanData } from "@/lib/validate";

type Ctx = { params: Promise<{ id: string }> };
const THEMES = ["pine", "cranberry", "midnight", "teal", "burgundy"];

export async function GET(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const g = await getGame((await params).id);
  if (!g || g.license_id !== lic.id) return bad("Game not found", 404);
  return NextResponse.json({ game: g });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const id = (await params).id;
  const g = await getGame(id);
  if (!g || g.license_id !== lic.id) return bad("Game not found", 404);
  const body = await req.json().catch(() => ({}));
  const upd = await updateGame(id, lic.id, {
    title: String(body.title ?? g.title).slice(0, 120) || "Untitled game",
    teams: g.format === "top" ? true : !!(body.teams ?? g.teams),
    theme: THEMES.includes(body.theme) ? body.theme : g.theme,
    data: cleanData(g.format, body.data ?? g.data),
  });
  return NextResponse.json({ game: upd });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  await deleteGame((await params).id, lic.id);
  return NextResponse.json({ ok: true });
}

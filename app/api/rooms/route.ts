import { NextRequest, NextResponse } from "next/server";
import { requireLicense, bad } from "@/lib/auth";
import { getGame, createRoom } from "@/lib/store";

export async function POST(req: NextRequest) {
  const lic = await requireLicense(req);
  if (lic instanceof NextResponse) return lic;
  const { gameId } = await req.json().catch(() => ({}));
  const g = await getGame(String(gameId || ""));
  if (!g || g.license_id !== lic.id) return bad("Game not found", 404);
  const pin = await createRoom(g.id, lic.id);
  return NextResponse.json({ pin, game: g });
}

import { NextRequest, NextResponse } from "next/server";
import { getRoom } from "@/lib/store";

// Public: players only learn that the room exists, its title and whether it uses teams.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ pin: string }> }) {
  const pin = (await params).pin.replace(/\D/g, "");
  const r = await getRoom(pin);
  if (!r) return NextResponse.json({ error: "No game with that PIN. Check the number on the big screen." }, { status: 404 });
  return NextResponse.json({ pin, title: r.game.title, format: r.game.format, teams: r.game.teams, theme: r.game.theme });
}

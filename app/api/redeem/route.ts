import { NextRequest, NextResponse } from "next/server";
import { redeem } from "@/lib/store";

const hits = new Map<string, { n: number; t: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const h = hits.get(ip) || { n: 0, t: Date.now() };
  if (Date.now() - h.t > 10 * 60 * 1000) { h.n = 0; h.t = Date.now(); }
  h.n++;
  hits.set(ip, h);
  if (h.n > 20) return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const r = await redeem(body.orderId, body.email);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
  return NextResponse.json(r);
}

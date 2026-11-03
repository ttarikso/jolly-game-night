import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { addOrders } from "@/lib/store";

// Accepts pasted order numbers or an Etsy "Orders" CSV export (first column / "Order ID" column).
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { text } = await req.json().catch(() => ({ text: "" }));
  const ids = extractOrderIds(String(text || ""));
  const r = await addOrders(ids);
  return NextResponse.json({ ...r, found: ids.length });
}

function extractOrderIds(text: string): string[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  const header = lines[0].split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());
  const col = header.findIndex((h) => h === "order id" || h === "order_id" || h === "receipt id");
  if (col >= 0) {
    return lines.slice(1).map((l) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || [])[col] || "").map((v) => v.replace(/[",]/g, "").trim()).filter(Boolean);
  }
  return text.split(/[\s,;]+/).map((s) => s.trim()).filter((s) => /^\d{6,}$/.test(s));
}

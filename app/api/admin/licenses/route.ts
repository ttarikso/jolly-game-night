import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, bad } from "@/lib/auth";
import { listLicenses, setLicenseStatus } from "@/lib/store";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ licenses: await listLicenses() });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { id, status } = await req.json().catch(() => ({}));
  if (!["available", "claimed", "revoked"].includes(status)) return bad("Bad status");
  await setLicenseStatus(String(id), status);
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { licenseByKey } from "./store";
import type { License } from "./types";

export async function requireLicense(req: NextRequest): Promise<License | NextResponse> {
  const key = req.headers.get("x-license-key") || "";
  const lic = await licenseByKey(key);
  if (!lic) return NextResponse.json({ error: "Your access key was not recognised. Please activate again." }, { status: 401 });
  return lic;
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET || (process.env.NODE_ENV !== "production" ? "dev" : "");
  if (!secret || req.headers.get("x-admin-secret") !== secret) return NextResponse.json({ error: "Not allowed" }, { status: 401 });
  return null;
}

export const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

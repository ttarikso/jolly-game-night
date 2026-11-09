import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { EtsyAuth, Game, License, Format, GameData } from "./types";
import { isEtsyConfigured, verifyReceipt } from "./etsy";

/* Data store. Uses Supabase (service role, server only) when SUPABASE_URL and
   SUPABASE_SERVICE_ROLE_KEY are set; otherwise a local JSON file for development. */

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let sb: SupabaseClient | null = null;
export function supa() {
  if (!SB_URL || !SB_KEY) return null;
  if (!sb) sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  return sb;
}

const ETSY_AUTH_SENTINEL = "__ETSY_AUTH__";

interface Room { pin: string; game_id: string; license_id: string; created_at: string }
interface DB { licenses: License[]; games: Game[]; rooms: Room[]; etsy_auth?: EtsyAuth | null }
const FILE = path.join(process.cwd(), ".data", "db.json");

async function readDB(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    const db: DB = { licenses: [], games: [], rooms: [], etsy_auth: null };
    db.licenses.push({ id: randomUUID(), order_id: "1000000001", email: null, key: null, status: "available", created_at: new Date().toISOString(), claimed_at: null });
    await writeDB(db);
    return db;
  }
}
async function writeDB(db: DB) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 1));
}

const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function code(n: number) {
  const b = randomBytes(n);
  return Array.from(b, (x) => ALPHA[x % ALPHA.length]).join("");
}
export function newKey() {
  return `GN-${code(4)}-${code(4)}-${code(4)}`;
}
export function normOrder(s: string) {
  return String(s || "").replace(/[\s#-]/g, "").trim().toUpperCase();
}
const normEmail = (s: string) => String(s || "").trim().toLowerCase();

// ------------------------------------------------------------------ Etsy Auth
export async function getEtsyAuth(): Promise<EtsyAuth | null> {
  const s = supa();
  if (s) {
    const { data } = await s
      .from("licenses")
      .select("email")
      .eq("order_id", ETSY_AUTH_SENTINEL)
      .maybeSingle();
    if (data?.email) {
      try {
        return JSON.parse(data.email) as EtsyAuth;
      } catch {
        return null;
      }
    }
    return null;
  }
  return (await readDB()).etsy_auth || null;
}

export async function saveEtsyAuth(auth: {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}): Promise<void> {
  const row: EtsyAuth = {
    id: 1,
    access_token: auth.access_token,
    refresh_token: auth.refresh_token,
    expires_at: auth.expires_at,
    updated_at: new Date().toISOString(),
  };
  const s = supa();
  if (s) {
    const payload = JSON.stringify(row);
    const { data: existing } = await s
      .from("licenses")
      .select("id")
      .eq("order_id", ETSY_AUTH_SENTINEL)
      .maybeSingle();
    if (existing?.id) {
      await s
        .from("licenses")
        .update({ email: payload, status: "revoked" })
        .eq("id", existing.id);
    } else {
      await s.from("licenses").insert({
        order_id: ETSY_AUTH_SENTINEL,
        email: payload,
        key: null,
        status: "revoked",
      });
    }
    return;
  }
  const db = await readDB();
  db.etsy_auth = row;
  await writeDB(db);
}

// ------------------------------------------------------------------ licenses
export async function licenseByKey(key: string): Promise<License | null> {
  if (!key) return null;
  const s = supa();
  if (s) {
    const { data } = await s
      .from("licenses")
      .select("*")
      .eq("key", key)
      .eq("status", "claimed")
      .neq("order_id", ETSY_AUTH_SENTINEL)
      .maybeSingle();
    return (data as License) || null;
  }
  const db = await readDB();
  return db.licenses.find((l) => l.key === key && l.status === "claimed" && l.order_id !== ETSY_AUTH_SENTINEL) || null;
}

export type RedeemResult = { ok: true; key: string; recovered: boolean } | { ok: false; error: string };

export async function redeem(orderRaw: string, emailRaw: string): Promise<RedeemResult> {
  const order_id = normOrder(orderRaw);
  const email = normEmail(emailRaw);
  if (!/^\d{6,14}$/.test(order_id) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return {
      ok: false,
      error: "Please enter a valid numeric Etsy order number (from your Etsy receipt) and email address.",
    };
  }
  const s = supa();
  let lic: License | null;
  if (s) {
    const { data } = await s.from("licenses").select("*").eq("order_id", order_id).maybeSingle();
    lic = (data as License) || null;
  } else {
    lic = (await readDB()).licenses.find((l) => l.order_id === order_id) || null;
  }

  if (lic && lic.status === "revoked") {
    return { ok: false, error: "This order access has been revoked. Please message us on Etsy if you need help." };
  }

  if (lic && lic.status === "claimed") {
    if (lic.email === email && lic.key) return { ok: true, key: lic.key, recovered: true };
    return { ok: false, error: "This order has already been activated with a different email. Message us on Etsy if you need help." };
  }

  const key = newKey();
  const now = new Date().toISOString();

  // If pre-seeded in /admin as 'available', claim it directly
  if (lic && lic.status === "available") {
    const patch = { status: "claimed" as const, email, key, claimed_at: now };
    if (s) {
      const { error } = await s.from("licenses").update(patch).eq("id", lic.id).eq("status", "available");
      if (error) return { ok: false, error: "Something went wrong. Please try again." };
    } else {
      const db = await readDB();
      Object.assign(db.licenses.find((l) => l.id === lic!.id)!, patch);
      await writeDB(db);
    }
    return { ok: true, key, recovered: false };
  }

  // Unknown order: verify live against the DigitarMercato Etsy API
  const configured = await isEtsyConfigured();
  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error: "We couldn't verify this order automatically right now. Please message us on Etsy at DigitarMercato and we'll activate it right away!",
      };
    }
  } else {
    const verdict = await verifyReceipt(order_id);
    if (!verdict.ok) {
      switch (verdict.reason) {
        case "not_found":
          return {
            ok: false,
            error: "We couldn't find this Etsy order. Please check the 10-digit order number on your Etsy receipt under Purchases & Reviews.",
          };
        case "other_listing":
          return {
            ok: false,
            error: "This order number is not for a Jolly Christmas Game Night listing. Message us on Etsy if you need help.",
          };
        case "refunded":
          return {
            ok: false,
            error: "This order was cancelled or refunded, so it cannot be activated.",
          };
        case "unpaid":
          return {
            ok: false,
            error: "Etsy is still processing your payment. Please try again in a few minutes.",
          };
        case "unavailable":
          return {
            ok: false,
            error: "We couldn't reach Etsy to verify your order right now. Please try again in a minute.",
          };
      }
    }
  }

  if (s) {
    const { error } = await s.from("licenses").insert({
      order_id,
      email,
      key,
      status: "claimed",
      claimed_at: now,
    });
    if (error) {
      return { ok: false, error: "This order has already been activated with a different email. Message us on Etsy if you need help." };
    }
  } else {
    const db = await readDB();
    db.licenses.push({
      id: randomUUID(),
      order_id,
      email,
      key,
      status: "claimed",
      created_at: now,
      claimed_at: now,
    });
    await writeDB(db);
  }
  return { ok: true, key, recovered: false };
}

export async function addOrders(ids: string[]): Promise<{ added: number; skipped: number }> {
  const clean = Array.from(new Set(ids.map(normOrder).filter((x) => /^\d{6,14}$/.test(x))));
  const s = supa();
  if (s) {
    const { data: existing } = await s.from("licenses").select("order_id").in("order_id", clean);
    const have = new Set((existing || []).map((r: { order_id: string }) => r.order_id));
    const rows = clean.filter((x) => !have.has(x)).map((order_id) => ({ order_id, status: "available" }));
    if (rows.length) await s.from("licenses").insert(rows);
    return { added: rows.length, skipped: clean.length - rows.length };
  }
  const db = await readDB();
  const have = new Set(db.licenses.map((l) => l.order_id));
  let added = 0;
  for (const order_id of clean) {
    if (have.has(order_id)) continue;
    db.licenses.push({ id: randomUUID(), order_id, email: null, key: null, status: "available", created_at: new Date().toISOString(), claimed_at: null });
    added++;
  }
  await writeDB(db);
  return { added, skipped: clean.length - added };
}

export async function listLicenses(): Promise<License[]> {
  const s = supa();
  if (s) {
    const { data } = await s
      .from("licenses")
      .select("*")
      .neq("order_id", ETSY_AUTH_SENTINEL)
      .order("created_at", { ascending: false })
      .limit(1000);
    return (data as License[]) || [];
  }
  return (await readDB()).licenses.filter((l) => l.order_id !== ETSY_AUTH_SENTINEL).slice().reverse();
}

export async function setLicenseStatus(id: string, status: License["status"]) {
  const s = supa();
  if (s) {
    await s.from("licenses").update({ status }).eq("id", id).neq("order_id", ETSY_AUTH_SENTINEL);
    return;
  }
  const db = await readDB();
  const l = db.licenses.find((x) => x.id === id && x.order_id !== ETSY_AUTH_SENTINEL);
  if (l) l.status = status;
  await writeDB(db);
}

// ------------------------------------------------------------------ games
export async function listGames(license_id: string): Promise<Game[]> {
  const s = supa();
  if (s) {
    const { data } = await s.from("games").select("*").eq("license_id", license_id).order("updated_at", { ascending: false });
    return (data as Game[]) || [];
  }
  return (await readDB()).games.filter((g) => g.license_id === license_id).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getGame(id: string): Promise<Game | null> {
  const s = supa();
  if (s) {
    const { data } = await s.from("games").select("*").eq("id", id).maybeSingle();
    return (data as Game) || null;
  }
  return (await readDB()).games.find((g) => g.id === id) || null;
}

export async function createGame(license_id: string, g: { title: string; format: Format; teams: boolean; theme: string; data: GameData }): Promise<Game> {
  const row: Game = { id: randomUUID(), license_id, updated_at: new Date().toISOString(), ...g };
  const s = supa();
  if (s) {
    const { data, error } = await s.from("games").insert(row).select("*").single();
    if (error) throw error;
    return data as Game;
  }
  const db = await readDB();
  db.games.push(row);
  await writeDB(db);
  return row;
}

export async function updateGame(id: string, license_id: string, patch: Partial<Pick<Game, "title" | "teams" | "theme" | "data">>): Promise<Game | null> {
  const p = { ...patch, updated_at: new Date().toISOString() };
  const s = supa();
  if (s) {
    const { data } = await s.from("games").update(p).eq("id", id).eq("license_id", license_id).select("*").maybeSingle();
    return (data as Game) || null;
  }
  const db = await readDB();
  const g = db.games.find((x) => x.id === id && x.license_id === license_id);
  if (!g) return null;
  Object.assign(g, p);
  await writeDB(db);
  return g;
}

export async function deleteGame(id: string, license_id: string) {
  const s = supa();
  if (s) {
    await s.from("games").delete().eq("id", id).eq("license_id", license_id);
    return;
  }
  const db = await readDB();
  db.games = db.games.filter((g) => !(g.id === id && g.license_id === license_id));
  await writeDB(db);
}

// ------------------------------------------------------------------ rooms
export async function createRoom(game_id: string, license_id: string): Promise<string> {
  const s = supa();
  for (let i = 0; i < 8; i++) {
    const pin = String(100000 + (randomBytes(4).readUInt32BE(0) % 900000));
    const row: Room = { pin, game_id, license_id, created_at: new Date().toISOString() };
    if (s) {
      const { error } = await s.from("rooms").insert(row);
      if (!error) return pin;
    } else {
      const db = await readDB();
      if (db.rooms.some((r) => r.pin === pin)) continue;
      db.rooms.push(row);
      await writeDB(db);
      return pin;
    }
  }
  throw new Error("Could not create a room");
}

export async function getRoom(pin: string): Promise<{ pin: string; game: Game } | null> {
  const s = supa();
  let room: Room | null;
  if (s) {
    const { data } = await s.from("rooms").select("*").eq("pin", pin).maybeSingle();
    room = (data as Room) || null;
  } else {
    room = (await readDB()).rooms.find((r) => r.pin === pin) || null;
  }
  if (!room) return null;
  if (Date.now() - new Date(room.created_at).getTime() > 1000 * 60 * 60 * 24) return null; // rooms live 24h
  const game = await getGame(room.game_id);
  return game ? { pin, game } : null;
}

import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Game, License, Format, GameData } from "./types";

/* Data store. Uses Supabase (service role, server only) when SUPABASE_URL and
   SUPABASE_SERVICE_ROLE_KEY are set; otherwise a local JSON file for development. */

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let sb: SupabaseClient | null = null;
function supa() {
  if (!SB_URL || !SB_KEY) return null;
  if (!sb) sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  return sb;
}

interface Room { pin: string; game_id: string; license_id: string; created_at: string }
interface DB { licenses: License[]; games: Game[]; rooms: Room[] }
const FILE = path.join(process.cwd(), ".data", "db.json");

async function readDB(): Promise<DB> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    const db: DB = { licenses: [], games: [], rooms: [] };
    // dev seed: one ready-to-redeem order
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
  return String(s || "").replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}
const normEmail = (s: string) => String(s || "").trim().toLowerCase();

// ------------------------------------------------------------------ licenses
export async function licenseByKey(key: string): Promise<License | null> {
  if (!key) return null;
  const s = supa();
  if (s) {
    const { data } = await s.from("licenses").select("*").eq("key", key).eq("status", "claimed").maybeSingle();
    return (data as License) || null;
  }
  const db = await readDB();
  return db.licenses.find((l) => l.key === key && l.status === "claimed") || null;
}

export type RedeemResult = { ok: true; key: string; recovered: boolean } | { ok: false; error: string };

export async function redeem(orderRaw: string, emailRaw: string): Promise<RedeemResult> {
  const order_id = normOrder(orderRaw);
  const email = normEmail(emailRaw);
  if (!order_id || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter your Etsy order number and a valid email." };
  const s = supa();
  let lic: License | null;
  if (s) {
    const { data } = await s.from("licenses").select("*").eq("order_id", order_id).maybeSingle();
    lic = (data as License) || null;
  } else {
    lic = (await readDB()).licenses.find((l) => l.order_id === order_id) || null;
  }
  if (!lic || lic.status === "revoked")
    return { ok: false, error: "We couldn't find that order yet. New orders can take a few minutes to appear. Please try again shortly or message us on Etsy." };
  if (lic.status === "claimed") {
    if (lic.email === email && lic.key) return { ok: true, key: lic.key, recovered: true };
    return { ok: false, error: "This order has already been activated with a different email. Message us on Etsy if you need help." };
  }
  const key = newKey();
  const patch = { status: "claimed" as const, email, key, claimed_at: new Date().toISOString() };
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

export async function addOrders(ids: string[]): Promise<{ added: number; skipped: number }> {
  const clean = Array.from(new Set(ids.map(normOrder).filter((x) => x.length >= 4)));
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
    const { data } = await s.from("licenses").select("*").order("created_at", { ascending: false }).limit(1000);
    return (data as License[]) || [];
  }
  return (await readDB()).licenses.slice().reverse();
}

export async function setLicenseStatus(id: string, status: License["status"]) {
  const s = supa();
  if (s) {
    await s.from("licenses").update({ status }).eq("id", id);
    return;
  }
  const db = await readDB();
  const l = db.licenses.find((x) => x.id === id);
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

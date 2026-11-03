"use client";
import { createClient, SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";

/* Room messaging. Supabase Realtime broadcast in production; BroadcastChannel
   (same browser, several tabs) when Supabase env vars are missing, for local dev. */

export type Msg = { type: string; [k: string]: unknown };
export interface Room {
  send: (m: Msg) => void;
  close: () => void;
  ready: Promise<void>;
}

let client: SupabaseClient | null = null;
function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: false }, realtime: { params: { eventsPerSecond: 20 } } });
  return client;
}

export function openRoom(pin: string, onMsg: (m: Msg) => void): Room {
  const s = sb();
  if (s) {
    let ch: RealtimeChannel;
    let resolve!: () => void;
    const ready = new Promise<void>((r) => (resolve = r));
    ch = s.channel(`room-${pin}`, { config: { broadcast: { self: false, ack: false } } });
    ch.on("broadcast", { event: "msg" }, ({ payload }) => onMsg(payload as Msg));
    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") resolve();
    });
    return {
      ready,
      send: (m) => {
        ch.send({ type: "broadcast", event: "msg", payload: m });
      },
      close: () => {
        s.removeChannel(ch);
      },
    };
  }
  const bc = new BroadcastChannel(`room-${pin}`);
  bc.onmessage = (e) => onMsg(e.data as Msg);
  return { ready: Promise.resolve(), send: (m) => bc.postMessage(m), close: () => bc.close() };
}

// ------------------------------------------------------------------ local helpers
export function getKey(): string {
  try {
    return localStorage.getItem("gn_key") || "";
  } catch {
    return "";
  }
}
export function setKey(k: string) {
  try {
    localStorage.setItem("gn_key", k);
  } catch {}
}
export function clearKey() {
  try {
    localStorage.removeItem("gn_key");
  } catch {}
}

export async function api<T = unknown>(url: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...opts,
    headers: { "content-type": "application/json", "x-license-key": getKey(), ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

export function siteUrl() {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_SITE_URL || "";
  const host = window.location.hostname;
  if (host.endsWith(".vercel.app") && (host.includes("-git-") || host.includes("-3pixel1"))) {
    return "https://jolly-game-night-app.vercel.app";
  }
  return window.location.origin;
}

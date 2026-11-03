import type { Format } from "./types";

/* Messages between the host screen (authoritative) and player phones. */

export interface PPlayer { id: string; name: string; team: number | null; score: number; avatar?: string }
export interface PTeam { name: string; score: number }

export type Phase = "lobby" | "q" | "reveal" | "scores" | "board" | "final" | "end";

export interface PublicState {
  v: number;
  title: string;
  format: Format;
  theme: string;
  teamsMode: boolean;
  teams: PTeam[];
  players: PPlayer[];
  phase: Phase;
  qKey: string; // changes for every new question / round, lets phones reset
  label: string; // e.g. "Question 3 of 20" or "Santa & Friends · 300"
  mc?: { options: string[]; remainingMs: number; time: number; answered: string[]; correct?: number; gained?: Record<string, number> };
  buzz?: { open: boolean; order: string[]; locked: string[] };
}

export type ToHost =
  | { type: "hello" }
  | { type: "join"; pid: string; name: string; team: number | null; avatar?: string }
  | { type: "answer"; pid: string; qKey: string; choice: number }
  | { type: "buzz"; pid: string; qKey: string };

export type ToPlayer = { type: "state"; state: PublicState } | { type: "kick"; pid: string };

export const TEAM_NAMES = ["Team Holly 🎄", "Team Rudolph 🦌", "Team Gingerbread 🍪", "Team Jingle 🔔"];
export const TEAM_COLORS = ["#B5283B", "#186A4B", "#D9384A", "#0E4D36"];

export function mcPoints(correct: boolean, ms: number, timeSec: number) {
  if (!correct) return 0;
  const frac = Math.min(1, Math.max(0, ms / (timeSec * 1000)));
  return Math.round(1000 * (1 - frac / 2));
}

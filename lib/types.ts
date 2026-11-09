export type Format = "mc" | "board" | "top" | "buzzer";

export interface McQuestion { q: string; options: string[]; correct: number; time: number; note?: string }
export interface McData { questions: McQuestion[] }

export interface BoardQuestion { value: number; q: string; a: string }
export interface BoardCategory { name: string; questions: BoardQuestion[] }
export interface BoardData { categories: BoardCategory[]; final?: { q: string; a: string } | null }

export interface TopAnswer { text: string; points: number }
export interface TopRound { q: string; answers: TopAnswer[] }
export interface TopData { rounds: TopRound[] }

export interface BuzzerQuestion { q: string; a: string; hint?: string; big?: boolean; points?: number }
export interface BuzzerData { questions: BuzzerQuestion[] }

export type GameData = McData | BoardData | TopData | BuzzerData;

export interface Game {
  id: string;
  license_id: string;
  title: string;
  format: Format;
  theme: string;
  teams: boolean;
  data: GameData;
  updated_at: string;
}

export interface License {
  id: string;
  order_id: string;
  email: string | null;
  key: string | null;
  status: "available" | "claimed" | "revoked";
  created_at: string;
  claimed_at: string | null;
}

export interface EtsyAuth {
  id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  updated_at: string;
}

export type EtsyVerdict =
  | { ok: true; quantity: number; status: string }
  | { ok: false; reason: "not_found" | "other_listing" | "refunded" | "unpaid" | "unavailable" };

export const FORMAT_INFO: Record<Format, { name: string; blurb: string; phones: string }> = {
  mc: { name: "Live Quiz", blurb: "Multiple-choice questions with a timer. Fast right answers score more.", phones: "Players tap A, B, C or D on their phones." },
  board: { name: "Quiz Board", blurb: "Categories and point values on a big board. Teams pick, buzz and answer out loud.", phones: "Phones become buzzers." },
  top: { name: "Top Answers", blurb: "Guess the most popular answers. Reveal tiles, give strikes, bank the points.", phones: "Phones become buzzers for the face-off." },
  buzzer: { name: "Buzz & Answer", blurb: "Show a clue (text or emoji), first buzz answers out loud. Great for emoji movies or finish-the-line.", phones: "Phones become buzzers." },
};

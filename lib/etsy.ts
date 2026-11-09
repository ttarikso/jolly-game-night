import { EtsyVerdict } from "./types";
import { getEtsyAuth, saveEtsyAuth } from "./store";

const TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";
const API_BASE = "https://api.etsy.com/v3/application";
const TIMEOUT_MS = 8000;

const DEFAULT_LISTING_IDS = [
  "4609341824", // Interactive Christmas Party Game Bundle
  "4609335069", // Office Christmas Party Game
  "4609357056", // Holiday Top Answers Survey Game
  "4609357392", // Christmas Emoji Movie & Song Buzzer Game
  "4609336129", // Kids Classroom Christmas Quiz Game
];

export function getEtsyEnv() {
  const rawListings = (process.env.ETSY_LISTING_IDS || "").trim();
  const listingIds = rawListings
    ? rawListings.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_LISTING_IDS;

  return {
    keystring: (process.env.ETSY_KEYSTRING || "nk561ml29wn72ei4a2aghmkn").trim(),
    sharedSecret: (process.env.ETSY_SHARED_SECRET || "qij7tkrw6a").trim(),
    shopId: (process.env.ETSY_SHOP_ID || "58103810").trim(),
    listingIds,
    redirectUri: (
      process.env.ETSY_REDIRECT_URI || "https://www.christmasparty.live/api/admin/etsy/callback"
    ).trim(),
  };
}

/** Check if Etsy credentials and an etsy_auth token row exist in the DB. */
export async function isEtsyConfigured(): Promise<boolean> {
  const env = getEtsyEnv();
  if (!env.keystring || !env.sharedSecret || !env.shopId || env.listingIds.length === 0) {
    return false;
  }
  const auth = await getEtsyAuth();
  return Boolean(auth && auth.access_token && auth.refresh_token);
}

let inFlightRefresh: Promise<string> | null = null;

/**
 * Get an active access token. Refreshes token if within 2 minutes of expiry,
 * guarding against concurrent refreshes.
 */
export async function getAccessToken(forceRefresh = false): Promise<string> {
  const auth = await getEtsyAuth();
  if (!auth) {
    throw new Error("Etsy is not connected.");
  }

  const expiresAtMs = new Date(auth.expires_at).getTime();
  const now = Date.now();
  const needsRefresh = forceRefresh || expiresAtMs - now < 2 * 60 * 1000;

  if (!needsRefresh) {
    return auth.access_token;
  }

  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    try {
      const env = getEtsyEnv();
      if (!env.keystring || !env.sharedSecret) {
        throw new Error("Etsy credentials missing.");
      }

      const currentAuth = (await getEtsyAuth()) || auth;
      if (!forceRefresh && new Date(currentAuth.expires_at).getTime() - Date.now() >= 2 * 60 * 1000) {
        return currentAuth.access_token;
      }

      const body = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: env.keystring,
        refresh_token: currentAuth.refresh_token,
      });

      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-api-key": `${env.keystring}:${env.sharedSecret}`,
        },
        body: body.toString(),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!res.ok) {
        console.error(`Etsy token refresh failed with status ${res.status}`);
        throw new Error(`Token refresh failed: ${res.status}`);
      }

      const data = await res.json();
      const newAccessToken = data.access_token;
      const newRefreshToken = data.refresh_token || currentAuth.refresh_token;
      const expiresInSec = Number(data.expires_in) || 3600;
      const newExpiresAt = new Date(Date.now() + expiresInSec * 1000).toISOString();

      await saveEtsyAuth({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_at: newExpiresAt,
      });

      return newAccessToken;
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}

export interface EtsyTransaction {
  listing_id: number | string;
  quantity: number;
  title?: string;
}

export interface EtsyReceipt {
  receipt_id: number | string;
  is_paid: boolean;
  status: string;
  transactions?: EtsyTransaction[];
}

/**
 * Verify an Etsy receipt with an 8-second timeout.
 * Validates receipt existence, shop ownership, listing membership, payment and cancellation.
 */
export async function verifyReceipt(orderId: string): Promise<EtsyVerdict> {
  const receiptId = String(orderId || "").trim();
  if (!/^\d{6,14}$/.test(receiptId) || parseInt(receiptId, 10) <= 0) {
    return { ok: false, reason: "not_found" };
  }

  const env = getEtsyEnv();
  if (!env.keystring || !env.sharedSecret || !env.shopId) {
    console.error("verifyReceipt: Etsy environment configuration incomplete");
    return { ok: false, reason: "unavailable" };
  }

  const fetchWithToken = async (token: string) => {
    const url = `${API_BASE}/shops/${encodeURIComponent(env.shopId)}/receipts/${encodeURIComponent(receiptId)}`;
    return fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": `${env.keystring}:${env.sharedSecret}`,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  };

  let token: string;
  try {
    token = await getAccessToken();
  } catch (err) {
    console.error("verifyReceipt: Failed to get Etsy access token:", (err as Error).message);
    return { ok: false, reason: "unavailable" };
  }

  let res: Response;
  try {
    res = await fetchWithToken(token);
    if (res.status === 401) {
      console.warn("verifyReceipt: Received 401, attempting token refresh retry");
      token = await getAccessToken(true);
      res = await fetchWithToken(token);
    }
  } catch (err) {
    console.error("verifyReceipt: Network or timeout error reaching Etsy:", (err as Error).message);
    return { ok: false, reason: "unavailable" };
  }

  if (res.status === 404) {
    return { ok: false, reason: "not_found" };
  }

  if (!res.ok) {
    console.error(`verifyReceipt: Etsy returned HTTP status ${res.status}`);
    return { ok: false, reason: "unavailable" };
  }

  let receipt: EtsyReceipt;
  try {
    receipt = (await res.json()) as EtsyReceipt;
  } catch {
    console.error("verifyReceipt: Failed to parse Etsy receipt JSON");
    return { ok: false, reason: "unavailable" };
  }

  const status = (receipt.status || "").toLowerCase().trim();

  if (status === "canceled" || status === "fully refunded") {
    return { ok: false, reason: "refunded" };
  }

  if (!receipt.is_paid || status === "payment processing") {
    return { ok: false, reason: "unpaid" };
  }

  const validListingIds = new Set(env.listingIds.map((id) => String(id)));
  const txs = receipt.transactions || [];
  const matchingTxs = txs.filter(
    (t) =>
      validListingIds.has(String(t.listing_id)) ||
      /interactive.*christmas|phone buzzer|holiday top answers|emoji movie.*buzzer|whole shop/i.test(t.title || "")
  );

  if (matchingTxs.length === 0) {
    return { ok: false, reason: "other_listing" };
  }

  const quantity = matchingTxs.reduce((sum, t) => sum + Math.max(1, Number(t.quantity) || 1), 0);

  return {
    ok: true,
    quantity,
    status: receipt.status || "paid",
  };
}

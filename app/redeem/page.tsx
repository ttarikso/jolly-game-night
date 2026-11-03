"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiKey2Line, RiShoppingBag3Line, RiArrowRightLine } from "@remixicon/react";
import { Header, Stage } from "@/components/ui";
import { Button } from "@/components/base/buttons/button";
import { setKey } from "@/lib/realtime";

export default function Redeem() {
  const r = useRouter();
  const [orderId, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [key, setK] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"order" | "key">("order");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "key") {
        setKey(key.trim().toUpperCase());
        const res = await fetch("/api/me", { headers: { "x-license-key": key.trim().toUpperCase() } });
        if (!res.ok) throw new Error("That key was not recognised.");
        r.push("/dashboard");
        return;
      }
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setKey(data.key);
      r.push(`/dashboard?welcome=${data.recovered ? "back" : "new"}`);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stage>
      <Header />
      <main className="max-w-md mx-auto px-5 pt-8 pb-20">
        <form onSubmit={submit} className="card p-7 space-y-5">
          <div className="flex gap-1.5 rounded-xl bg-cream-200/70 p-1">
            <button
              type="button"
              onClick={() => { setMode("order"); setErr(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-body-medium transition ${
                mode === "order" ? "bg-white text-ink shadow-xs font-semibold" : "text-ink/65 hover:text-ink"
              }`}
            >
              <RiShoppingBag3Line className="size-4" /> Etsy Order
            </button>
            <button
              type="button"
              onClick={() => { setMode("key"); setErr(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-body-medium transition ${
                mode === "key" ? "bg-white text-ink shadow-xs font-semibold" : "text-ink/65 hover:text-ink"
              }`}
            >
              <RiKey2Line className="size-4" /> Access Key
            </button>
          </div>

          <div>
            <h1 className="font-serif text-2xl text-pine-800">
              {mode === "order" ? "Activate your game studio" : "Sign in with access key"}
            </h1>
            <p className="text-body-regular text-ink/70 mt-1">
              {mode === "order"
                ? "Enter your Etsy order number from your receipt or Purchases page."
                : "Enter your GN-XXXX-XXXX-XXXX key to access your saved games."}
            </p>
          </div>

          {mode === "order" ? (
            <div className="space-y-4">
              <label className="block">
                <span className="label">Etsy order number</span>
                <input
                  className="input mt-1.5"
                  inputMode="numeric"
                  value={orderId}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="e.g. 3456789012"
                  required
                />
              </label>
              <label className="block">
                <span className="label">Your email address</span>
                <input
                  className="input mt-1.5"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <p className="text-caption-1-regular text-ink/60">
                Use the same order number and email anytime to sign back in on any computer or TV.
              </p>
            </div>
          ) : (
            <label className="block">
              <span className="label">Access key</span>
              <input
                className="input mt-1.5 font-mono uppercase tracking-wider"
                value={key}
                onChange={(e) => setK(e.target.value)}
                placeholder="GN-XXXX-XXXX-XXXX"
                required
              />
            </label>
          )}

          {err && (
            <div className="rounded-xl bg-cran-600/10 border border-cran-600/25 px-3.5 py-2.5 text-cran-700 text-body-medium" role="alert">
              {err}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="medium"
            trailingIcon={RiArrowRightLine}
            disabled={busy}
            className="w-full h-11 !text-base"
          >
            {busy ? "Checking…" : "Continue to My Games"}
          </Button>
        </form>
      </main>
    </Stage>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Stage } from "@/components/ui";
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
    setErr(""); setBusy(true);
    try {
      if (mode === "key") {
        setKey(key.trim().toUpperCase());
        const res = await fetch("/api/me", { headers: { "x-license-key": key.trim().toUpperCase() } });
        if (!res.ok) throw new Error("That key was not recognised.");
        r.push("/dashboard");
        return;
      }
      const res = await fetch("/api/redeem", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, email }) });
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
      <main className="max-w-md mx-auto px-5 pt-6 pb-20">
        <form onSubmit={submit} className="card p-7 space-y-4">
          <h1 className="font-serif text-3xl text-pine-800">{mode === "order" ? "Activate your game" : "Sign in with your key"}</h1>
          {mode === "order" ? (
            <>
              <p className="text-sm text-ink/70">Find your order number in your Etsy purchase email or under <b>You → Purchases and reviews</b>.</p>
              <label className="block"><span className="label">Etsy order number</span>
                <input className="input mt-1" inputMode="numeric" value={orderId} onChange={(e) => setOrder(e.target.value)} placeholder="e.g. 3456789012" required /></label>
              <label className="block"><span className="label">Your email</span>
                <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required /></label>
              <p className="text-xs text-ink/60">Use the same order number and email later to get back in on any device.</p>
            </>
          ) : (
            <label className="block"><span className="label">Access key</span>
              <input className="input mt-1 font-mono" value={key} onChange={(e) => setK(e.target.value)} placeholder="GN-XXXX-XXXX-XXXX" required /></label>
          )}
          {err && <p className="text-cran-600 text-sm font-semibold" role="alert">{err}</p>}
          <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Checking…" : "Continue"}</button>
          <button type="button" className="text-sm underline text-pine-700 w-full" onClick={() => { setMode(mode === "order" ? "key" : "order"); setErr(""); }}>
            {mode === "order" ? "I already have an access key" : "Use my Etsy order number instead"}
          </button>
        </form>
      </main>
    </Stage>
  );
}

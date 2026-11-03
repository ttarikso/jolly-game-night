"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, Stage } from "@/components/ui";

export default function Join() {
  const r = useRouter();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  async function go(e: React.FormEvent) {
    e.preventDefault();
    const p = pin.replace(/\D/g, "");
    const res = await fetch(`/api/rooms/${p}`);
    if (!res.ok) { setErr((await res.json()).error || "No game with that PIN."); return; }
    r.push(`/j/${p}`);
  }
  return (
    <Stage className="grid place-items-center p-6">
      <form onSubmit={go} className="w-full max-w-sm text-center">
        <Logo size="md" />
        <div className="card p-6 mt-8 space-y-3">
          <input className="input text-center font-block text-3xl tracking-[.3em]" inputMode="numeric" autoFocus maxLength={7}
            placeholder="PIN" value={pin} onChange={(e) => { setPin(e.target.value); setErr(""); }} aria-label="Game PIN" />
          {err && <p className="text-cran-600 text-sm font-semibold" role="alert">{err}</p>}
          <button className="btn btn-gold w-full text-lg">Enter</button>
        </div>
      </form>
    </Stage>
  );
}

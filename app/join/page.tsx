"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowRightLine, RiGamepadLine } from "@remixicon/react";
import { Logo, Stage } from "@/components/ui";
import { Button } from "@/components/base/buttons/button";

export default function Join() {
  const r = useRouter();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    const p = pin.replace(/\D/g, "");
    if (!p) return;
    setBusy(true);
    const res = await fetch(`/api/rooms/${p}`);
    setBusy(false);
    if (!res.ok) {
      setErr((await res.json()).error || "No game with that PIN.");
      return;
    }
    r.push(`/j/${p}`);
  }

  return (
    <Stage className="grid place-items-center p-6">
      <form onSubmit={go} className="w-full max-w-sm text-center">
        <Logo size="md" />
        <div className="card p-6 mt-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-caption-1-semibold uppercase tracking-wider text-pine-700">
            <RiGamepadLine className="size-4" /> Enter 6-Digit Game PIN
          </div>
          <input
            className="input text-center font-block text-3xl tracking-[.25em] py-3"
            inputMode="numeric"
            autoFocus
            maxLength={7}
            placeholder="000000"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErr("");
            }}
            aria-label="Game PIN"
          />
          {err && (
            <p className="text-cran-600 text-body-medium" role="alert">
              {err}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            trailingIcon={RiArrowRightLine}
            disabled={busy || !pin.trim()}
            className="w-full h-11 !text-base"
          >
            {busy ? "Joining…" : "Enter Game Lobby"}
          </Button>
        </div>
      </form>
    </Stage>
  );
}

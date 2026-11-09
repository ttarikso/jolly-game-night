"use client";
import { useEffect, useState } from "react";
import { RiAddLine, RiLockPasswordLine, RiSearchLine, RiShieldCheckLine } from "@remixicon/react";
import { Header, Stage } from "@/components/ui";
import { Button } from "@/components/base/buttons/button";
import { Chip } from "@/components/base/badges/chip";
import { toast } from "@/components/base/toast/toast";
import type { License } from "@/lib/types";

export default function Admin() {
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [rows, setRows] = useState<License[]>([]);
  const [etsyInfo, setEtsyInfo] = useState<{ connected: boolean; lastRefreshed: string | null } | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("gn_admin");
      if (s) {
        setSecret(s);
        load(s);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(s = secret) {
    const r = await fetch("/api/admin/licenses", { headers: { "x-admin-secret": s } });
    if (!r.ok) {
      setMsg("Wrong admin password");
      setOk(false);
      return;
    }
    setOk(true);
    try {
      sessionStorage.setItem("gn_admin", s);
    } catch {}
    setRows((await r.json()).licenses);
    const etsyRes = await fetch("/api/admin/etsy/status", { headers: { "x-admin-secret": s } });
    if (etsyRes.ok) {
      setEtsyInfo(await etsyRes.json());
    }
  }

  async function add() {
    const r = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ text }),
    });
    const d = await r.json();
    if (r.ok) {
      const summary = `Found ${d.found} order numbers · added ${d.added} · already existed ${d.skipped}`;
      setMsg(summary);
      toast.success("Orders imported", { description: summary });
    } else {
      setMsg(d.error);
      toast.error("Could not import orders", { description: d.error });
    }
    setText("");
    load();
  }

  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/licenses", {
      method: "PATCH",
      headers: { "content-type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ id, status }),
    });
    toast.success(`Order status updated to ${status}`);
    load();
  }

  const shown = rows.filter(
    (r) => !q || r.order_id.includes(q.toUpperCase()) || (r.email || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Stage>
      <Header />
      <main className="max-w-4xl mx-auto px-5 pb-20 space-y-6">
        {!ok ? (
          <form
            className="card p-7 max-w-sm mx-auto mt-10 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-cran-600/10 text-cran-600 grid place-items-center">
              <RiLockPasswordLine className="size-5" />
            </div>
            <h1 className="font-serif text-2xl text-pine-800">Shop Admin</h1>
            <input
              type="password"
              className="input"
              placeholder="Admin password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full h-10">
              Sign In
            </Button>
            {msg && <p className="text-cran-600 text-sm font-medium">{msg}</p>}
          </form>
        ) : (
          <>
            <div className="card p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    etsyInfo?.connected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span className="text-ink/80 font-medium">
                  {etsyInfo?.connected
                    ? `Etsy Live Order Verification Active · Token refreshed ${
                        etsyInfo.lastRefreshed ? new Date(etsyInfo.lastRefreshed).toLocaleString() : "recently"
                      }`
                    : "Etsy Live Verification Not Connected"}
                </span>
              </div>
              <a
                href={`/api/admin/etsy/connect?secret=${encodeURIComponent(secret)}`}
                className="px-3.5 py-1.5 rounded-lg bg-pine-700 text-white text-xs font-semibold hover:bg-pine-800 transition"
              >
                {etsyInfo?.connected ? "Reconnect Etsy" : "Connect Etsy"}
              </a>
            </div>

            <div className="card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <RiShieldCheckLine className="size-5 text-pine-700" />
                <h1 className="font-serif text-2xl text-pine-800">Add Etsy Orders</h1>
              </div>
              <p className="text-body-regular text-ink/70">
                Paste order numbers (one per line) or paste the entire{" "}
                <b>Etsy → Shop Manager → Settings → Options → Download Data → Orders</b> CSV file.
              </p>
              <textarea
                className="input h-36 font-mono text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"3456789012\n3456789013"}
              />
              <div className="flex items-center gap-3">
                <Button variant="primary" leadingIcon={RiAddLine} onClick={add} disabled={!text.trim()}>
                  Add Orders
                </Button>
                {msg && <p className="text-body-medium text-pine-700">{msg}</p>}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-2xl text-pine-800">Licenses</h2>
                  <Chip color="neutral" variant="bold">
                    {rows.length}
                  </Chip>
                </div>
                <div className="relative w-64">
                  <RiSearchLine className="size-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    className="input !pl-9 !py-1.5 text-sm"
                    placeholder="Search order or email…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left label border-b border-cream-200">
                      <th className="py-2.5">Order ID</th>
                      <th>Status</th>
                      <th>Customer Email</th>
                      <th>Access Key</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((r) => (
                      <tr key={r.id} className="border-b border-cream-200/70 last:border-0">
                        <td className="py-3 font-mono font-medium">{r.order_id}</td>
                        <td>
                          <Chip
                            variant="caption"
                            color={r.status === "claimed" ? "lime" : r.status === "revoked" ? "rose" : "yellow"}
                          >
                            {r.status}
                          </Chip>
                        </td>
                        <td className="text-ink/80">{r.email || "—"}</td>
                        <td className="font-mono text-xs text-ink/70">{r.key || "—"}</td>
                        <td className="text-right">
                          {r.status !== "revoked" ? (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => setStatus(r.id, "revoked")}
                            >
                              Revoke
                            </Button>
                          ) : (
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => setStatus(r.id, r.key ? "claimed" : "available")}
                            >
                              Restore
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </Stage>
  );
}

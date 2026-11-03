"use client";
import { useEffect, useState } from "react";
import { Header, Stage } from "@/components/ui";
import type { License } from "@/lib/types";

export default function Admin() {
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [rows, setRows] = useState<License[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { try { const s = sessionStorage.getItem("gn_admin"); if (s) { setSecret(s); load(s); } } catch {} }, []);
  async function load(s = secret) {
    const r = await fetch("/api/admin/licenses", { headers: { "x-admin-secret": s } });
    if (!r.ok) { setMsg("Wrong admin password"); setOk(false); return; }
    setOk(true); try { sessionStorage.setItem("gn_admin", s); } catch {}
    setRows((await r.json()).licenses);
  }
  async function add() {
    const r = await fetch("/api/admin/orders", { method: "POST", headers: { "content-type": "application/json", "x-admin-secret": secret }, body: JSON.stringify({ text }) });
    const d = await r.json();
    setMsg(r.ok ? `Found ${d.found} order numbers · added ${d.added} · already there ${d.skipped}` : d.error);
    setText(""); load();
  }
  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/licenses", { method: "PATCH", headers: { "content-type": "application/json", "x-admin-secret": secret }, body: JSON.stringify({ id, status }) });
    load();
  }
  const shown = rows.filter((r) => !q || r.order_id.includes(q.toUpperCase()) || (r.email || "").includes(q.toLowerCase()));

  return (
    <Stage>
      <Header />
      <main className="max-w-4xl mx-auto px-5 pb-20 space-y-6">
        {!ok ? (
          <form className="card p-6 max-w-sm" onSubmit={(e) => { e.preventDefault(); load(); }}>
            <h1 className="font-serif text-2xl">Shop admin</h1>
            <input type="password" className="input mt-3" placeholder="Admin password" value={secret} onChange={(e) => setSecret(e.target.value)} />
            <button className="btn btn-gold mt-3 w-full">Sign in</button>
            {msg && <p className="text-cran-600 mt-2 text-sm">{msg}</p>}
          </form>
        ) : (
          <>
            <div className="card p-6">
              <h1 className="font-serif text-2xl">Add Etsy orders</h1>
              <p className="text-sm text-ink/70 mt-1">Paste order numbers (one per line) or the whole <b>Etsy → Shop Manager → Settings → Options → Download Data → Orders</b> CSV. Only these orders can activate.</p>
              <textarea className="input h-40 mt-3 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={"3456789012\n3456789013"} />
              <button className="btn btn-gold mt-3" onClick={add} disabled={!text.trim()}>Add orders</button>
              {msg && <p className="mt-2 text-sm font-semibold text-pine-700">{msg}</p>}
            </div>
            <div className="card p-6">
              <div className="flex justify-between items-center gap-3">
                <h2 className="font-serif text-2xl">Licenses ({rows.length})</h2>
                <input className="input !w-56 !py-1.5" placeholder="Search order or email" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm">
                  <thead><tr className="text-left label"><th className="py-2">Order</th><th>Status</th><th>Email</th><th>Key</th><th></th></tr></thead>
                  <tbody>
                    {shown.map((r) => (
                      <tr key={r.id} className="border-t border-cream-200">
                        <td className="py-2 font-mono">{r.order_id}</td>
                        <td><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.status === "claimed" ? "bg-pine-600 text-white" : r.status === "revoked" ? "bg-cran-600 text-white" : "bg-cream-200"}`}>{r.status}</span></td>
                        <td>{r.email || "—"}</td>
                        <td className="font-mono text-xs">{r.key || "—"}</td>
                        <td className="text-right">
                          {r.status !== "revoked" ? <button className="underline text-cran-600" onClick={() => setStatus(r.id, "revoked")}>Revoke</button>
                            : <button className="underline" onClick={() => setStatus(r.id, r.key ? "claimed" : "available")}>Restore</button>}
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

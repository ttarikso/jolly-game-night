"use client";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Logo, Stage } from "@/components/ui";
import { api, openRoom, Room, siteUrl } from "@/lib/realtime";
import { sfx, setMuted } from "@/lib/sound";
import type { Game, McData, BoardData, TopData, BuzzerData } from "@/lib/types";
import { PublicState, PPlayer, PTeam, Phase, ToHost, TEAM_NAMES, mcPoints } from "@/lib/protocol";
import { McStage, BoardStage, BuzzStage, TopStage, Scoreboard, Podium } from "@/components/host";

export interface HostState {
  pin: string;
  phase: Phase;
  teamsMode: boolean;
  teams: PTeam[];
  players: Record<string, PPlayer>;
  i: number; // current question / round index
  qKey: string;
  // mc
  startedAt: number;
  answers: Record<string, { c: number; ms: number }>;
  gained: Record<string, number>;
  // buzz
  buzzOpen: boolean;
  order: string[];
  locked: string[];
  showAnswer: boolean;
  // board
  used: string[];
  cur: { c: number; q: number } | null;
  // top
  revealed: number[];
  strikes: number;
  strikeAnim: number;
  bank: number;
}

const fresh = (pin: string, game: Game): HostState => ({
  pin, phase: "lobby", teamsMode: game.format === "top" ? true : game.teams,
  teams: TEAM_NAMES.slice(0, 2).map((name) => ({ name, score: 0 })),
  players: {}, i: 0, qKey: "lobby", startedAt: 0, answers: {}, gained: {},
  buzzOpen: false, order: [], locked: [], showAnswer: false, used: [], cur: null,
  revealed: [], strikes: 0, strikeAnim: 0, bank: 0,
});

export default function HostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [err, setErr] = useState("");
  const [st, setSt] = useState<HostState | null>(null);
  const [qr, setQr] = useState("");
  const [muted, setMute] = useState(false);
  const [now, setNow] = useState(Date.now());
  const room = useRef<Room | null>(null);
  const stRef = useRef<HostState | null>(null);
  const gameRef = useRef<Game | null>(null);
  stRef.current = st;
  gameRef.current = game;

  useEffect(() => {
    api<{ game: Game }>(`/api/games/${id}`).then(({ game }) => setGame(game)).catch((e) => setErr(e.message));
  }, [id]);

  // resume a running game after a reload
  useEffect(() => {
    if (!game) return;
    try {
      const saved = localStorage.getItem(`gn_live_${id}`);
      if (saved) {
        const s = JSON.parse(saved) as HostState & { savedAt: number };
        if (Date.now() - s.savedAt < 1000 * 60 * 60 * 6) connect(s);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  const joinUrl = st ? `${siteUrl()}/j/${st.pin}` : "";
  useEffect(() => {
    if (joinUrl) QRCode.toDataURL(joinUrl, { margin: 1, width: 360, color: { dark: "#1F1B16", light: "#FFFBF3" } }).then(setQr);
  }, [joinUrl]);

  // ------------------------------------------------------------------ messaging
  const onMsg = useCallback((m: ToHost) => {
    const g = gameRef.current;
    setSt((s) => {
      if (!s || !g) return s;
      if (m.type === "hello") return { ...s }; // new object -> immediate state broadcast
      if (m.type === "join") {
        const name = String(m.name || "Player").slice(0, 24);
        const prev = s.players[m.pid];
        const team = s.teamsMode ? Math.min(Math.max(0, Number(m.team ?? prev?.team ?? 0)), s.teams.length - 1) : null;
        if (!prev) sfx.join();
        return { ...s, players: { ...s.players, [m.pid]: { id: m.pid, name, team, score: prev?.score ?? 0 } } };
      }
      if (!s.players[m.pid] || m.qKey !== s.qKey) return s;
      if (m.type === "answer" && s.phase === "q" && g.format === "mc") {
        if (s.answers[m.pid]) return s;
        return { ...s, answers: { ...s.answers, [m.pid]: { c: Number(m.choice), ms: Date.now() - s.startedAt } } };
      }
      if (m.type === "buzz" && s.buzzOpen && !s.order.includes(m.pid) && !s.locked.includes(m.pid)) {
        if (s.order.length === 0) sfx.buzz();
        return { ...s, order: [...s.order, m.pid] };
      }
      return s;
    });
  }, []);

  function connect(s: HostState) {
    room.current?.close();
    room.current = openRoom(s.pin, (m) => onMsg(m as unknown as ToHost));
    setSt(s);
  }

  async function openLobby() {
    try {
      const { pin } = await api<{ pin: string }>("/api/rooms", { method: "POST", body: JSON.stringify({ gameId: id }) });
      sfx.unlock();
      connect(fresh(pin, game!));
    } catch (e) { setErr((e as Error).message); }
  }

  // broadcast public state (coalesced) + persist
  const pub = useMemo<PublicState | null>(() => (st && game ? toPublic(st, game) : null), [st, game]);
  useEffect(() => {
    if (!pub || !st) return;
    const t = setTimeout(() => {
      room.current?.send({ type: "state", state: { ...pub, mc: pub.mc ? { ...pub.mc, remainingMs: remaining(st, game!) } : undefined } });
      try { localStorage.setItem(`gn_live_${id}`, JSON.stringify({ ...st, savedAt: Date.now() })); } catch {}
    }, 60);
    return () => clearTimeout(t);
  }, [pub, st, game, id]);
  // heartbeat so late joiners and reconnecting phones catch up
  useEffect(() => {
    const iv = setInterval(() => {
      const s = stRef.current, g = gameRef.current;
      if (s && g) room.current?.send({ type: "state", state: { ...toPublic(s, g), mc: s.phase === "q" && g.format === "mc" ? { ...toPublic(s, g).mc!, remainingMs: remaining(s, g) } : toPublic(s, g).mc } });
    }, 6000);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => () => room.current?.close(), []);

  // mc timer
  useEffect(() => {
    if (!st || !game || game.format !== "mc" || st.phase !== "q") return;
    const iv = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(iv);
  }, [st?.phase, game]);
  useEffect(() => {
    if (!st || !game || game.format !== "mc" || st.phase !== "q") return;
    const n = Object.keys(st.players).length;
    if (remaining(st, game) <= 0 || (n > 0 && Object.keys(st.answers).length >= n)) mcReveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, st?.answers]);

  // ------------------------------------------------------------------ actions
  const patch = (p: Partial<HostState> | ((s: HostState) => Partial<HostState>)) =>
    setSt((s) => (s ? { ...s, ...(typeof p === "function" ? p(s) : p) } : s));

  function award(pid: string | null, pts: number, teamIdx?: number) {
    patch((s) => {
      const players = { ...s.players };
      const teams = s.teams.map((t) => ({ ...t }));
      if (pid && players[pid]) {
        players[pid] = { ...players[pid], score: players[pid].score + pts };
        if (s.teamsMode && players[pid].team != null) teams[players[pid].team!].score += pts;
      } else if (teamIdx != null && teams[teamIdx]) teams[teamIdx].score += pts;
      return { players, teams };
    });
  }
  const adjust = (kind: "team" | "player", key: number | string, pts: number) =>
    kind === "team" ? award(null, pts, key as number) : award(key as string, pts);

  const qk = (s: string) => `${s}-${Math.random().toString(36).slice(2, 7)}`;

  // mc
  function mcStart(i: number) {
    const d = game!.data as McData;
    if (i >= d.questions.length) return patch({ phase: "end" });
    sfx.reveal();
    patch({ phase: "q", i, qKey: qk(`mc${i}`), startedAt: Date.now(), answers: {}, gained: {} });
  }
  function mcReveal() {
    const d = game!.data as McData;
    setSt((s) => {
      if (!s || s.phase !== "q") return s;
      const q = d.questions[s.i];
      const gained: Record<string, number> = {};
      const players = { ...s.players };
      for (const [pid, a] of Object.entries(s.answers)) {
        const pts = mcPoints(a.c === q.correct, a.ms, q.time);
        gained[pid] = pts;
        if (players[pid]) players[pid] = { ...players[pid], score: players[pid].score + pts };
      }
      sfx.correct();
      return { ...s, phase: "reveal", gained, players };
    });
  }

  // buzz helpers
  const openBuzz = (key: string) => ({ qKey: qk(key), buzzOpen: true, order: [], locked: [], showAnswer: false });
  function markRight(pts: number) {
    const s = stRef.current!;
    const pid = s.order[0];
    if (!pid) return;
    sfx.correct();
    award(pid, pts);
    patch({ buzzOpen: false, showAnswer: true });
  }
  function markWrong() {
    const s = stRef.current!;
    const pid = s.order[0];
    if (!pid) return;
    sfx.wrong();
    const lockTeam = s.teamsMode && s.players[pid]?.team != null
      ? Object.values(s.players).filter((p) => p.team === s.players[pid].team).map((p) => p.id) : [pid];
    patch((x) => ({ order: x.order.filter((p) => !lockTeam.includes(p)), locked: [...x.locked, ...lockTeam] }));
  }

  // board
  function boardPick(c: number, q: number) { sfx.reveal(); patch({ phase: "q", cur: { c, q }, ...openBuzz(`b${c}-${q}`) }); }
  function boardBack() { patch((s) => ({ phase: "board", used: s.cur ? [...s.used, `${s.cur.c}-${s.cur.q}`] : s.used, cur: null, buzzOpen: false, qKey: qk("board") })); }

  // buzzer
  function buzzGo(i: number) {
    const d = game!.data as BuzzerData;
    if (i >= d.questions.length) return patch({ phase: "end", buzzOpen: false });
    sfx.reveal();
    patch({ phase: "q", i, ...openBuzz(`z${i}`) });
  }

  // top
  function topGo(i: number) {
    const d = game!.data as TopData;
    if (i >= d.rounds.length) return patch({ phase: "end", buzzOpen: false });
    sfx.reveal();
    patch({ phase: "q", i, revealed: [], strikes: 0, bank: 0, ...openBuzz(`t${i}`) });
  }
  function topReveal(k: number) {
    const d = game!.data as TopData;
    const s = stRef.current!;
    if (s.revealed.includes(k)) return;
    sfx.reveal();
    patch({ revealed: [...s.revealed, k], bank: s.bank + (d.rounds[s.i].answers[k]?.points || 0) });
  }
  function topStrike() { sfx.wrong(); patch((s) => ({ strikes: Math.min(3, s.strikes + 1), strikeAnim: Date.now() })); }
  function topBank(team: number) { sfx.correct(); const b = stRef.current!.bank; award(null, b, team); patch({ bank: 0 }); }

  function startGame() {
    const f = game!.format;
    if (f === "mc") mcStart(0);
    else if (f === "board") patch({ phase: "board", qKey: qk("board") });
    else if (f === "buzzer") buzzGo(0);
    else topGo(0);
  }
  function endGame() { sfx.fanfare(); patch({ phase: "end", buzzOpen: false }); }
  function resetAll() {
    if (!confirm("End this live game and start over with a new PIN?")) return;
    try { localStorage.removeItem(`gn_live_${id}`); } catch {}
    room.current?.close(); room.current = null; setSt(null);
  }
  useEffect(() => { if (st?.phase === "end") sfx.fanfare(); }, [st?.phase]);

  // ------------------------------------------------------------------ render
  if (err) return <Stage><p className="p-10 text-center">{err} · <Link href="/dashboard" className="underline">My games</Link></p></Stage>;
  if (!game) return <Stage><p className="p-10 text-center">Loading…</p></Stage>;

  if (!st) {
    return (
      <Stage theme={game.theme} className="grid place-items-center p-6">
        <div className="text-center max-w-xl">
          <Logo size="md" />
          <h1 className="font-display text-5xl mt-8">{game.title}</h1>
          <p className="mt-4 text-cream-200/80">Put this window on the big screen (or share it on Zoom / Teams). Players will join with their phones.</p>
          <button className="btn btn-gold text-xl px-8 py-4 mt-8" onClick={openLobby}>Open the lobby</button>
          <p className="mt-6"><Link href={`/edit/${id}`} className="underline text-cream-200/80">Edit questions first</Link></p>
        </div>
      </Stage>
    );
  }

  const players = Object.values(st.players);
  const toolbar = (
    <div className="!fixed top-3 right-3 z-20 flex gap-2 text-sm">
      <button className="btn btn-ghost !px-3 !py-1.5" onClick={() => { setMute(!muted); setMuted(!muted); }}>{muted ? "🔇" : "🔊"}</button>
      {st.phase !== "lobby" && st.phase !== "end" && <button className="btn btn-ghost !px-3 !py-1.5" onClick={endGame}>Finish game</button>}
      <button className="btn btn-ghost !px-3 !py-1.5" onClick={resetAll}>New PIN</button>
      <button className="btn btn-ghost !px-3 !py-1.5" onClick={() => document.documentElement.requestFullscreen?.()}>⛶</button>
    </div>
  );

  return (
    <Stage theme={game.theme} className="flex flex-col">
      {toolbar}
      {st.phase !== "lobby" && st.phase !== "end" && (
        <div className="px-6 pt-3 text-sm text-cream-200/80">Join at <b className="text-gold-400">{siteUrl().replace(/^https?:\/\//, "")}/join</b> · PIN <b className="text-gold-400 font-block tracking-widest">{st.pin}</b></div>
      )}
      {st.phase === "lobby" && (
        <Lobby st={st} game={game} qr={qr} joinUrl={joinUrl} players={players}
          onTeams={(teams) => patch({ teams })} onStart={startGame} />
      )}
      {st.phase === "end" && <Podium st={st} game={game} onAgain={resetAll} />}
      {st.phase !== "lobby" && st.phase !== "end" && (
        <div className="flex-1 grid lg:grid-cols-[1fr_18rem] gap-4 p-4 pt-2">
          <div className="min-w-0">
            {game.format === "mc" && <McStage st={st} data={game.data as McData} players={players} onReveal={mcReveal} onNext={() => st.phase === "reveal" ? patch({ phase: "scores" }) : mcStart(st.i + 1)} />}
            {game.format === "board" && <BoardStage st={st} data={game.data as BoardData} onPick={boardPick} onBack={boardBack} onRight={markRight} onWrong={markWrong}
              onReveal={() => patch({ showAnswer: true, buzzOpen: false })} onFinal={() => patch({ phase: "final", qKey: qk("final"), showAnswer: false, buzzOpen: false })}
              onReopen={() => patch({ buzzOpen: true, order: [], locked: [] })} />}
            {game.format === "buzzer" && <BuzzStage st={st} data={game.data as BuzzerData} onRight={markRight} onWrong={markWrong}
              onReveal={() => patch({ showAnswer: true, buzzOpen: false })} onNext={() => buzzGo(st.i + 1)} onReopen={() => patch({ buzzOpen: true, order: [], locked: [] })} />}
            {game.format === "top" && <TopStage st={st} data={game.data as TopData} onReveal={topReveal} onStrike={topStrike} onBank={topBank}
              onNext={() => topGo(st.i + 1)} onReopen={() => patch({ buzzOpen: true, order: [], locked: [] })} onRevealAll={() => patch((s) => ({ revealed: (game.data as TopData).rounds[s.i].answers.map((_, k) => k) }))} />}
          </div>
          <Scoreboard st={st} players={players} onAdjust={adjust} step={stepFor(st, game)} />
        </div>
      )}
    </Stage>
  );
}

function stepFor(st: HostState, game: Game) {
  if (game.format === "board" && st.cur) return (game.data as BoardData).categories[st.cur.c]?.questions[st.cur.q]?.value || 100;
  if (game.format === "buzzer") return (game.data as BuzzerData).questions[st.i]?.points || 100;
  return 100;
}

function remaining(st: HostState, game: Game) {
  if (game.format !== "mc" || st.phase !== "q") return 0;
  const q = (game.data as McData).questions[st.i];
  return Math.max(0, st.startedAt + (q?.time || 20) * 1000 - Date.now());
}

function toPublic(st: HostState, game: Game): PublicState {
  const base: PublicState = {
    v: 1, title: game.title, format: game.format, theme: game.theme, teamsMode: st.teamsMode, teams: st.teams,
    players: Object.values(st.players), phase: st.phase, qKey: st.qKey, label: "",
  };
  if (game.format === "mc" && (st.phase === "q" || st.phase === "reveal" || st.phase === "scores")) {
    const d = game.data as McData, q = d.questions[st.i];
    base.label = `Question ${st.i + 1} of ${d.questions.length}`;
    base.mc = { options: q.options, time: q.time, remainingMs: 0, answered: Object.keys(st.answers),
      ...(st.phase !== "q" ? { correct: q.correct, gained: st.gained } : {}) };
  }
  if (game.format !== "mc") {
    base.buzz = { open: st.buzzOpen, order: st.order, locked: st.locked };
    if (game.format === "board" && st.cur) {
      const c = (game.data as BoardData).categories[st.cur.c];
      base.label = `${c.name} · ${c.questions[st.cur.q].value}`;
    }
    if (game.format === "buzzer") base.label = `Clue ${st.i + 1} of ${(game.data as BuzzerData).questions.length}`;
    if (game.format === "top") base.label = `Round ${st.i + 1} of ${(game.data as TopData).rounds.length}`;
  }
  return base;
}

function Lobby({ st, game, qr, joinUrl, players, onTeams, onStart }: {
  st: HostState; game: Game; qr: string; joinUrl: string; players: PPlayer[]; onTeams: (t: PTeam[]) => void; onStart: () => void;
}) {
  const host = joinUrl.replace(/^https?:\/\//, "").replace(/\/j\/\d+$/, "");
  return (
    <div className="flex-1 grid lg:grid-cols-[auto_1fr] gap-8 p-8 items-start max-w-7xl mx-auto w-full">
      <div className="card p-6 text-center w-full lg:w-[25rem]">
        <p className="label">Join on your phone</p>
        <p className="font-serif text-2xl mt-1">{host}/join</p>
        <p className="label mt-4">Game PIN</p>
        <p className="font-block text-7xl tracking-widest text-cran-600" data-testid="pin">{st.pin}</p>
        {qr && <img src={qr} alt="QR code to join" className="mx-auto mt-4 w-52 h-52 rounded-xl" />}
        <p className="text-sm text-ink/60 mt-2">or scan the code</p>
      </div>
      <div>
        <h1 className="font-display text-5xl">{game.title}</h1>
        {st.teamsMode && (
          <div className="mt-5 flex flex-wrap gap-3 items-center">
            {st.teams.map((t, i) => (
              <input key={i} className="input !w-48 font-semibold" value={t.name} aria-label={`Team ${i + 1} name`}
                onChange={(e) => onTeams(st.teams.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} />
            ))}
            {st.teams.length < 4 && <button className="btn btn-ghost" onClick={() => onTeams([...st.teams, { name: TEAM_NAMES[st.teams.length], score: 0 }])}>+ team</button>}
            {st.teams.length > 2 && <button className="btn btn-ghost" onClick={() => onTeams(st.teams.slice(0, -1))}>− team</button>}
          </div>
        )}
        <p className="mt-6 text-cream-200/80"><b className="text-gold-400 text-2xl font-block">{players.length}</b> player{players.length === 1 ? "" : "s"} joined</p>
        <div className="mt-3 flex flex-wrap gap-2 min-h-16">
          {players.map((p) => (
            <span key={p.id} className="pop rounded-full bg-white/10 border border-white/15 px-4 py-2 font-semibold">
              {p.name}{st.teamsMode && p.team != null ? <span className="text-gold-400"> · {st.teams[p.team]?.name}</span> : null}
            </span>
          ))}
        </div>
        <button className="btn btn-gold text-xl px-10 py-4 mt-8" onClick={onStart} data-testid="start">Start the game ▶</button>
        <p className="text-sm text-cream-200/60 mt-3">{game.format === "mc" ? "Players can still join after you start." : "No phones? You can also keep score by hand with the + / − buttons."}</p>
      </div>
    </div>
  );
}

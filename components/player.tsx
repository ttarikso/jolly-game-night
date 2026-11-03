"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo, Stage, OPTION_STYLE } from "./ui";
import { openRoom, Room } from "@/lib/realtime";
import { sfx } from "@/lib/sound";
import { AVATARS, AvatarBadge, getAvatar } from "@/lib/avatars";
import type { PublicState, ToPlayer } from "@/lib/protocol";
import { TEAM_COLORS } from "@/lib/protocol";

type Meta = { title: string; format: string; teams: boolean; theme: string };

function pidFor(pin: string) {
  try {
    const k = `gn_pid_${pin}`;
    let v = sessionStorage.getItem(k);
    if (!v) {
      v = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem(k, v);
    }
    return v;
  } catch {
    return Math.random().toString(36).slice(2, 12);
  }
}

export function PlayerApp({ pin }: { pin: string }) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string>(() => AVATARS[Math.floor(Math.random() * AVATARS.length)].id);
  const [team, setTeam] = useState<number>(0);
  const [teamChosen, setTeamChosen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [state, setState] = useState<PublicState | null>(null);
  const [myAnswer, setMyAnswer] = useState<{ qKey: string; choice: number } | null>(null);
  const [buzzed, setBuzzed] = useState<string>("");
  const [deadline, setDeadline] = useState(0);
  const [, tick] = useState(0);
  const room = useRef<Room | null>(null);
  const pid = useRef("");

  useEffect(() => {
    pid.current = pidFor(pin);
    try {
      const saved = JSON.parse(sessionStorage.getItem(`gn_me_${pin}`) || "null");
      if (saved) {
        setName(saved.name || "");
        if (saved.avatar) setAvatar(saved.avatar);
        setTeam(saved.team ?? 0);
        setTeamChosen(saved.team != null);
      }
    } catch {}
    fetch(`/api/rooms/${pin}`).then(async (r) => {
      const d = await r.json();
      if (!r.ok) setErr(d.error);
      else setMeta(d);
    });
  }, [pin]);

  function join(e?: React.FormEvent) {
    e?.preventDefault();
    const n = name.trim().slice(0, 24);
    if (!n) return;
    sfx.unlock();
    try {
      sessionStorage.setItem(`gn_me_${pin}`, JSON.stringify({ name: n, avatar, team: teamChosen ? team : null }));
    } catch {}
    room.current?.close();
    room.current = openRoom(pin, (m) => {
      const msg = m as unknown as ToPlayer;
      if (msg.type === "state") {
        setState((prev) => {
          const s = msg.state;
          if (s.mc && s.phase === "q" && (!prev || prev.qKey !== s.qKey || prev.phase !== "q"))
            setDeadline(Date.now() + s.mc.remainingMs);
          return s;
        });
      }
    });
    const send = () =>
      room.current?.send({
        type: "join",
        pid: pid.current,
        name: n,
        avatar,
        team: meta?.teams ? team : null,
      });
    room.current.ready.then(() => {
      room.current?.send({ type: "hello" });
      if (!meta?.teams || teamChosen) send();
    });
    setJoined(true);
  }

  // re-announce ourselves until the host has us (covers host reloads and lost packets)
  useEffect(() => {
    if (!joined) return;
    const iv = setInterval(() => {
      const known = state?.players.some((p) => p.id === pid.current);
      if (meta?.teams && !teamChosen) return;
      if (!known)
        room.current?.send({
          type: "join",
          pid: pid.current,
          name: name.trim(),
          avatar,
          team: meta?.teams ? team : null,
        });
    }, 2500);
    return () => clearInterval(iv);
  }, [joined, state, name, avatar, team, meta, teamChosen]);
  useEffect(() => () => room.current?.close(), []);
  useEffect(() => {
    const iv = setInterval(() => tick((x) => x + 1), 250);
    return () => clearInterval(iv);
  }, []);

  if (err)
    return (
      <Stage className="grid place-items-center p-6">
        <div className="card p-6 text-center max-w-sm">
          <p className="font-semibold">{err}</p>
          <Link href="/join" className="btn btn-gold mt-4">
            Try another PIN
          </Link>
        </div>
      </Stage>
    );
  if (!meta)
    return (
      <Stage className="grid place-items-center">
        <p>Loading…</p>
      </Stage>
    );

  if (!joined) {
    const curAv = getAvatar(avatar);
    return (
      <Stage theme={meta.theme} className="grid place-items-center p-4 py-8">
        <form onSubmit={join} className="w-full max-w-md text-center">
          <Logo size="sm" />
          <h1 className="font-serif text-2xl md:text-3xl mt-3">{meta.title}</h1>
          <div className="card p-5 md:p-6 mt-5 space-y-5 text-left">
            {/* Selected Avatar Preview */}
            <div className="flex items-center gap-4 bg-cream-100 rounded-2xl p-3.5 border border-cream-200">
              <AvatarBadge id={avatar} size="lg" />
              <div className="flex-1 min-w-0">
                <span className="label block">Your Character</span>
                <p className="font-serif text-xl text-pine-800 truncate">{curAv.name}</p>
                <p className="text-xs text-ink/60">{curAv.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const pick = AVATARS[Math.floor(Math.random() * AVATARS.length)];
                  setAvatar(pick.id);
                }}
                className="btn bg-cream-200 hover:bg-gold-300 text-ink !px-3 !py-1.5 text-xs font-bold"
              >
                🎲 Random
              </button>
            </div>

            {/* 20 Cartoon Avatars Grid */}
            <div>
              <span className="label block mb-2">Pick your cartoon avatar (20 characters)</span>
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                {AVATARS.map((av) => {
                  const active = av.id === avatar;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatar(av.id)}
                      className={`flex flex-col items-center p-1.5 rounded-2xl transition ${
                        active
                          ? "bg-gold-300 ring-3 ring-cran-600 scale-105 shadow-md"
                          : "bg-cream-100/70 hover:bg-cream-200 opacity-85 hover:opacity-100"
                      }`}
                    >
                      <AvatarBadge id={av.id} size="md" />
                      <span className="text-[10px] font-bold text-ink mt-1 truncate w-full text-center">
                        {av.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="label">Your nickname</span>
              <input
                className="input mt-1 text-xl font-semibold"
                autoFocus
                maxLength={24}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jingle Jess"
              />
            </label>
            <button className="btn btn-gold w-full text-lg py-3.5 shadow-lg" disabled={!name.trim()}>
              Join the Lobby ▶
            </button>
          </div>
        </form>
      </Stage>
    );
  }

  const me = state?.players.find((p) => p.id === pid.current);
  // team choice appears once we know the host's team names
  if (meta.teams && !teamChosen && state && state.teams.length) {
    return (
      <Stage theme={meta.theme} className="grid place-items-center p-6">
        <div className="w-full max-w-sm text-center">
          <AvatarBadge id={avatar} size="xl" className="mx-auto mb-3" />
          <h2 className="font-serif text-3xl">Pick your team</h2>
          <div className="mt-6 space-y-3">
            {state.teams.map((t, i) => (
              <button
                key={i}
                className="btn w-full text-xl py-4 text-white"
                style={{ background: TEAM_COLORS[i] }}
                onClick={() => {
                  setTeam(i);
                  setTeamChosen(true);
                  room.current?.send({
                    type: "join",
                    pid: pid.current,
                    name: name.trim(),
                    avatar,
                    team: i,
                  });
                  try {
                    sessionStorage.setItem(`gn_me_${pin}`, JSON.stringify({ name, avatar, team: i }));
                  } catch {}
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </Stage>
    );
  }

  const header = (
    <div className="flex items-center justify-between px-4 py-2.5 bg-black/30 backdrop-blur-sm">
      <span className="font-semibold truncate flex items-center gap-2.5">
        <AvatarBadge id={me?.avatar || avatar} size="sm" />
        <span>
          {me?.name || name}
          {me?.team != null && state?.teamsMode ? (
            <span className="text-gold-300"> · {state.teams[me.team]?.name}</span>
          ) : null}
        </span>
      </span>
      <span className="font-block text-gold-400 text-xl">
        {state?.teamsMode && me?.team != null ? state.teams[me.team]?.score : me?.score ?? 0}
      </span>
    </div>
  );
  const wait = (title: string, sub = "Eyes on the big screen 👀") => (
    <div className="flex-1 grid place-items-center p-8 text-center">
      <div className="flex flex-col items-center">
        <AvatarBadge id={me?.avatar || avatar} size="xl" className="mb-4" />
        <p className="font-serif text-3xl">{title}</p>
        <p className="mt-2 text-cream-200/80">{sub}</p>
      </div>
    </div>
  );

  let body: React.ReactNode;
  if (!state || !me) body = wait("Connecting…", "Hang tight, the host's screen is waking up.");
  else if (state.phase === "lobby") body = wait("You're in! 🎉", "Look for your character on the big screen!");
  else if (state.phase === "end") {
    const list = state.teamsMode
      ? state.teams.map((t, i) => ({ k: String(i), s: t.score }))
      : state.players.map((p) => ({ k: p.id, s: p.score }));
    const mine = state.teamsMode ? String(me.team) : me.id;
    const rank = list.sort((a, b) => b.s - a.s).findIndex((x) => x.k === mine) + 1;
    body = wait(rank === 1 ? "🏆 You won!" : `You finished #${rank}`, "Thanks for playing! Merry Christmas 🎄");
  } else if (state.format === "mc" && state.mc) {
    const mc = state.mc;
    const answered = myAnswer?.qKey === state.qKey;
    if (state.phase === "q") {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      body = answered ? (
        wait("Answer locked in ✓", "Let's see if you're right…")
      ) : (
        <div className="flex-1 flex flex-col p-3 gap-3">
          <p className="text-center text-cream-200">
            {state.label} · <b className="font-block text-gold-400">{left}s</b>
          </p>
          <div className={`flex-1 grid gap-3 ${mc.options.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {mc.options.map((o, k) => {
              const S = OPTION_STYLE[k];
              return (
                <button
                  key={k}
                  data-testid={`opt-${k}`}
                  className={`rounded-2xl ${S.bg} ${S.text} p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition min-h-28`}
                  onClick={() => {
                    setMyAnswer({ qKey: state.qKey, choice: k });
                    room.current?.send({ type: "answer", pid: pid.current, qKey: state.qKey, choice: k });
                    navigator.vibrate?.(30);
                  }}
                >
                  <span className="text-4xl">{S.sym}</span>
                  <span className="text-lg font-bold leading-tight">{o}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    } else {
      const gained = mc.gained?.[me.id] ?? 0;
      const right = answered && myAnswer!.choice === mc.correct;
      body = (
        <div className={`flex-1 grid place-items-center p-8 text-center ${right ? "bg-pine-600/50" : "bg-cran-700/40"}`}>
          <div className="pop flex flex-col items-center">
            <AvatarBadge id={me.avatar || avatar} size="lg" className="mb-3" />
            <p className="text-5xl">{right ? "🎉" : answered ? "❄️" : "⏰"}</p>
            <p className="font-display text-4xl mt-3">{right ? "Correct!" : answered ? "Not this time" : "Time's up"}</p>
            {right && <p className="font-block text-3xl text-gold-400 mt-2">+{gained}</p>}
            {!right && mc.correct != null && (
              <p className="mt-3 text-cream-200">
                Answer: <b>{mc.options[mc.correct]}</b>
              </p>
            )}
          </div>
        </div>
      );
    }
  } else if (state.buzz) {
    const b = state.buzz;
    const pos = b.order.indexOf(me.id);
    const locked = b.locked.includes(me.id);
    if (state.phase === "board") body = wait("Choosing the next question…");
    else if (locked) body = wait("Locked out ❄️", "Someone on your side already tried this one.");
    else if (pos === 0)
      body = (
        <div className="flex-1 grid place-items-center bg-cran-600 text-white text-center p-8">
          <div className="pop flex flex-col items-center">
            <AvatarBadge id={me.avatar || avatar} size="xl" className="mb-3" />
            <p className="font-display text-5xl">You&apos;re first!</p>
            <p className="mt-2 text-xl font-semibold">Say your answer out loud 🗣️</p>
          </div>
        </div>
      );
    else if (pos > 0) body = wait(`You buzzed #${pos + 1}`, "Wait for your turn…");
    else if (b.open) {
      body = (
        <div className="flex-1 grid place-items-center p-6">
          <button
            data-testid="buzz"
            onClick={() => {
              if (buzzed === state.qKey) return;
              setBuzzed(state.qKey);
              room.current?.send({ type: "buzz", pid: pid.current, qKey: state.qKey });
              navigator.vibrate?.(60);
            }}
            className="w-64 h-64 max-w-[80vw] max-h-[80vw] rounded-full bg-cran-600 border-[10px] border-cran-500 shadow-[0_14px_0_#6e1220] active:translate-y-2 active:shadow-[0_6px_0_#6e1220] font-block text-5xl text-white transition"
          >
            BUZZ!
          </button>
        </div>
      );
    } else body = wait(state.label || "Get ready…");
  } else body = wait("Get ready…");

  return (
    <Stage theme={meta.theme} className="flex flex-col min-h-[100dvh]">
      {header}
      {body}
    </Stage>
  );
}

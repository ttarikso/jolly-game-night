"use client";
let ctx: AudioContext | null = null;
let muted = false;
export function setMuted(m: boolean) { muted = m; }
function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.15, delay = 0) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + delay;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
export const sfx = {
  buzz: () => { tone(220, 0.35, "square", 0.12); tone(330, 0.3, "square", 0.08, 0.02); },
  correct: () => { [659, 784, 1047].forEach((f, i) => tone(f, 0.25, "triangle", 0.15, i * 0.09)); },
  wrong: () => { tone(160, 0.5, "sawtooth", 0.12); tone(120, 0.5, "sawtooth", 0.1, 0.05); },
  reveal: () => { tone(880, 0.18, "triangle", 0.12); tone(1320, 0.25, "triangle", 0.1, 0.08); },
  tick: () => tone(1200, 0.05, "square", 0.04),
  join: () => { tone(1047, 0.12, "sine", 0.1); tone(1568, 0.18, "sine", 0.08, 0.07); },
  fanfare: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.14, i * 0.13)); },
  unlock: () => { ac(); },
};

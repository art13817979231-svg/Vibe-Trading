/**
 * sounds.ts — lightweight Web Audio sound effects
 *
 * Uses OscillatorNode to synthesize short UI sounds at runtime.
 * No external audio files needed.
 */

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/* ──────── Public sound functions ──────── */

/** Soft hover tick — short sine blip */
export function playHover() {
  if (!soundEnabled()) return;
  const c = ac();
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(880, now);
  o.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
  g.gain.setValueAtTime(0.06, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  o.connect(g).connect(c.destination);
  o.start(now);
  o.stop(now + 0.08);
}

/** Confirming click — warm "pop" */
export function playClick() {
  if (!soundEnabled()) return;
  const c = ac();
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(600, now);
  o.frequency.exponentialRampToValueAtTime(300, now + 0.1);
  g.gain.setValueAtTime(0.12, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  o.connect(g).connect(c.destination);
  o.start(now);
  o.stop(now + 0.12);
}

/** Swarm launch — rising chime */
export function playSwarmLaunch() {
  if (!soundEnabled()) return;
  const c = ac();
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(440, now);
  o.frequency.exponentialRampToValueAtTime(1320, now + 0.25);
  g.gain.setValueAtTime(0.1, now);
  g.gain.setValueAtTime(0.1, now + 0.15);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  o.connect(g).connect(c.destination);
  o.start(now);
  o.stop(now + 0.35);
}

/** Success chime — two-note ascending */
export function playSuccess() {
  if (!soundEnabled()) return;
  const c = ac();
  const now = c.currentTime;
  [523.25, 659.25].forEach((freq, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, now + i * 0.12);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
    o.connect(g).connect(c.destination);
    o.start(now + i * 0.12);
    o.stop(now + i * 0.12 + 0.2);
  });
}

/** Error buzz — low dissonant tone */
export function playError() {
  if (!soundEnabled()) return;
  const c = ac();
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(150, now);
  g.gain.setValueAtTime(0.08, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  o.connect(g).connect(c.destination);
  o.start(now);
  o.stop(now + 0.2);
}

/* ──────── Sound toggle ──────── */

const STORAGE_KEY = "vt-sound-enabled";

export function soundEnabled(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== "false"; // default on
}

export function setSoundEnabled(on: boolean) {
  localStorage.setItem(STORAGE_KEY, String(on));
}

export function toggleSound(): boolean {
  const next = !soundEnabled();
  setSoundEnabled(next);
  return next;
}

/* EARTHLING FIELD GUIDE: AMBIENT MUSIC AND NATURE SOUNDS
   Used by the opening story and the Cozy Exploration mode (not by the platformer, which keeps its own music).
   Everything is composed and synthesized in code: soft piano, warm pads, bells, a breathy flute, plucked strings,
   flowing water, wind, crickets, frogs and birds. There are no audio files, so nothing to load and no copyright issues.
   Moods crossfade smoothly; the melody is regenerated every few phrases so it does not loop the same way. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
const C = BQ.core;
let AC = null, master = null, musBus = null, envBus = null, lp = null, verb = null, noiseBuf = null, timer = 0;
const moods = {}; let cur = null, clock = 0, stepN = 0, seed = 7;
const ENV = {};

/* scale degrees are semitone offsets; each mood: tempo, key, chords, which instruments play */
const MOODS = {
  space:  { bpm: 56, root: 50, sc: [0, 2, 4, 7, 9], prog: [0, 3, 1, 4], pad: 700, piano: 0.35, bell: 0.5, flute: 0, pluck: 0, bass: 0.6, strings: 0.4 },
  arrival:{ bpm: 64, root: 55, sc: [0, 2, 4, 5, 7, 9, 11], prog: [0, 5, 3, 4], pad: 1100, piano: 0.7, bell: 0.3, flute: 0.4, pluck: 0, bass: 0.6, strings: 0.6 },
  meadow: { bpm: 68, root: 60, sc: [0, 2, 4, 5, 7, 9, 11], prog: [0, 3, 5, 4], pad: 1200, piano: 0.75, bell: 0.15, flute: 0.35, pluck: 0.3, bass: 0.5, strings: 0 },
  forest: { bpm: 60, root: 57, sc: [0, 2, 3, 5, 7, 9, 10], prog: [0, 6, 3, 4], pad: 800, piano: 0.45, bell: 0.1, flute: 0.6, pluck: 0.2, bass: 0.5, strings: 0 },
  water:  { bpm: 62, root: 62, sc: [0, 2, 4, 6, 7, 9, 11], prog: [0, 1, 4, 3], pad: 1300, piano: 0.4, bell: 0.7, flute: 0, pluck: 0.25, bass: 0.4, strings: 0 },
  under:  { bpm: 50, root: 53, sc: [0, 2, 4, 7, 9], prog: [0, 2, 4, 1], pad: 500, piano: 0.15, bell: 0.6, flute: 0, pluck: 0, bass: 0.6, strings: 0.3 },
  vista:  { bpm: 58, root: 55, sc: [0, 2, 4, 5, 7, 9, 11], prog: [0, 4, 5, 3], pad: 1500, piano: 0.5, bell: 0.3, flute: 0, pluck: 0, bass: 0.7, strings: 0.8 },
  night:  { bpm: 52, root: 57, sc: [0, 3, 5, 7, 10], prog: [0, 3, 1, 4], pad: 650, piano: 0.4, bell: 0.45, flute: 0, pluck: 0, bass: 0.4, strings: 0 },
  rest:   { bpm: 64, root: 52, sc: [0, 2, 4, 7, 9], prog: [0, 3, 4, 1], pad: 900, piano: 0.2, bell: 0, flute: 0.2, pluck: 0.8, bass: 0.5, strings: 0 },
  town:   { bpm: 70, root: 60, sc: [0, 2, 4, 5, 7, 9, 10], prog: [0, 4, 3, 5], pad: 1000, piano: 0.6, bell: 0.2, flute: 0, pluck: 0.4, bass: 0.6, strings: 0 }
};

function ctx() {
  if (AC) return AC;
  AC = C.audio ? C.audio() : null; if (!AC) return null;
  master = AC.createGain(); master.gain.value = 1;
  lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 18000; lp.Q.value = 0.4;
  master.connect(lp); lp.connect(AC.destination);
  musBus = AC.createGain(); musBus.gain.value = 0; envBus = AC.createGain(); envBus.gain.value = 0;
  /* a soft hall reverb made from fading noise */
  verb = AC.createConvolver(); const len = Math.floor(AC.sampleRate * 3.2), ir = AC.createBuffer(2, len, AC.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  verb.buffer = ir; const wet = AC.createGain(); wet.gain.value = 0.42; verb.connect(wet); wet.connect(master);
  musBus.connect(master); musBus.connect(verb); envBus.connect(master); const ew = AC.createGain(); ew.gain.value = 0.15; envBus.connect(ew); ew.connect(verb);
  noiseBuf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  refresh(); return AC;
}
function refresh() {
  if (!AC) return; const S = C.S, t = AC.currentTime;
  musBus.gain.setTargetAtTime(S.set.music ? (S.set.vol / 100) * 0.55 : 0, t, 0.2);
  envBus.gain.setTargetAtTime(S.set.sound ? ((S.set.svol == null ? 100 : S.set.svol) / 100) * 0.9 : 0, t, 0.2);
}
function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function deg(md, d, oct) { const sc = md.sc, n = sc.length, o = Math.floor(d / n); return md.root + 12 * (oct + o) + sc[((d % n) + n) % n]; }

/* ---- instruments (all route into a mood's own gain, so moods can crossfade) ---- */
function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
function piano(out, f, t, v) {
  const g = AC.createGain(), fl = AC.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 2600; env(g, t, 0.006, v, 2.6);
  [[1, 'sine', 1], [2, 'triangle', 0.25], [3, 'sine', 0.08]].forEach(function (p) { const o = AC.createOscillator(), og = AC.createGain(); o.type = p[1]; o.frequency.value = f * p[0]; og.gain.value = p[2]; o.connect(og); og.connect(fl); o.start(t); o.stop(t + 2.8); });
  fl.connect(g); g.connect(out);
}
function bell(out, f, t, v) {
  const g = AC.createGain(); env(g, t, 0.004, v, 3.5);
  [[1, 1], [2.76, 0.35], [5.4, 0.12]].forEach(function (p) { const o = AC.createOscillator(), og = AC.createGain(); o.frequency.value = f * p[0]; og.gain.value = p[1]; o.connect(og); og.connect(g); o.start(t); o.stop(t + 3.6); });
  g.connect(out);
}
function flute(out, f, t, dur, v) {
  const o = AC.createOscillator(), g = AC.createGain(), lfo = AC.createOscillator(), lg = AC.createGain(), fl = AC.createBiquadFilter();
  o.type = 'triangle'; o.frequency.value = f; lfo.frequency.value = 5.2; lg.gain.value = f * 0.006; lfo.connect(lg); lg.connect(o.frequency);
  fl.type = 'lowpass'; fl.frequency.value = 2200;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.12); g.gain.setValueAtTime(v, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.4);
  o.connect(fl); fl.connect(g); g.connect(out); o.start(t); lfo.start(t); o.stop(t + dur + 0.5); lfo.stop(t + dur + 0.5);
}
function pluck(out, f, t, v) {
  const o = AC.createOscillator(), g = AC.createGain(), fl = AC.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f;
  fl.type = 'lowpass'; fl.frequency.setValueAtTime(3000, t); fl.frequency.exponentialRampToValueAtTime(400, t + 0.5); env(g, t, 0.003, v, 1.1);
  o.connect(fl); fl.connect(g); g.connect(out); o.start(t); o.stop(t + 1.2);
}
function pad(out, freqs, t, dur, v, cut) {
  const g = AC.createGain(), fl = AC.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = cut; fl.Q.value = 0.6;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + dur * 0.35); g.gain.setValueAtTime(v, t + dur * 0.7); g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.5);
  freqs.forEach(function (f) { [-7, 7].forEach(function (c) { const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = c; o.connect(fl); o.start(t); o.stop(t + dur + 1.6); }); });
  fl.connect(g); g.connect(out);
}
function strings(out, f, t, dur, v) {
  const g = AC.createGain(), fl = AC.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 1800;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.6); g.gain.setValueAtTime(v, t + dur * 0.8); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.9);
  [-9, 0, 9].forEach(function (c) { const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = c; o.connect(fl); o.start(t); o.stop(t + dur + 1); });
  fl.connect(g); g.connect(out);
}
function bass(out, f, t, v) { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; env(g, t, 0.02, v, 2.2); o.connect(g); g.connect(out); o.start(t); o.stop(t + 2.4); }

/* ---- the composer: one shared clock, every active mood plays on it ---- */
function newPhrase(md) {
  const ph = []; let d = Math.floor(rnd() * 3) * 2;
  for (let s = 0; s < 16; s++) {
    if (rnd() < (s % 4 === 0 ? 0.55 : 0.18)) { d += [-2, -1, 1, 2, 0, 3, -3][Math.floor(rnd() * 7)]; d = Math.max(0, Math.min(9, d)); ph.push({ s: s, d: d, len: rnd() < 0.4 ? 4 : 2 }); }
  }
  return ph;
}
function moodOf(name) {
  if (moods[name]) return moods[name];
  const g = AC.createGain(); g.gain.value = 0.0001; g.connect(musBus);
  const m = { name: name, md: MOODS[name], g: g, phr: [], lv: 0 }; m.phr = [newPhrase(m.md), newPhrase(m.md)]; moods[name] = m; return m;
}
function schedule() {
  if (!AC) return; const sp = 60 / 62 / 2; /* shared clock: eighth notes */
  while (clock < AC.currentTime + 0.3) {
    const t = clock, s = stepN % 16, bar2 = Math.floor(stepN / 16);
    Object.keys(moods).forEach(function (k) {
      const m = moods[k]; if (m.lv <= 0.001 && m !== cur) return; const md = m.md, out = m.g, ch = md.prog[bar2 % md.prog.length];
      if (s === 0) {
        pad(out, [mtof(deg(md, ch, -1)), mtof(deg(md, ch + 2, -1)), mtof(deg(md, ch + 4, -1))], t, sp * 16, 0.035, md.pad);
        if (md.bass) bass(out, mtof(deg(md, ch, -2)), t, 0.11 * md.bass);
        if (bar2 % 4 === 0) { m.phr[0] = m.phr[1]; m.phr[1] = newPhrase(md); }
      }
      if (md.piano && (s % 2 === 0) && rnd() < md.piano * 0.8) piano(out, mtof(deg(md, ch + [0, 2, 4, 6, 4, 2, 7, 4][s / 2], 0)), t, 0.05);
      if (md.pluck && s % 2 === 1 && rnd() < md.pluck * 0.7) pluck(out, mtof(deg(md, ch + [0, 4, 2, 4][((s - 1) / 2) % 4], 0)), t, 0.05);
      const ph = m.phr[bar2 % 2];
      ph.forEach(function (n) {
        if (n.s !== s) return; const f = mtof(deg(md, ch + n.d, 1));
        if (md.flute && rnd() < md.flute + 0.2) flute(out, f, t, sp * n.len, 0.05);
        else if (md.strings && rnd() < md.strings) strings(out, f / 2, t, sp * n.len * 1.6, 0.028);
        else if (md.bell && rnd() < md.bell + 0.2) bell(out, f, t, 0.035);
        else if (md.piano) piano(out, f, t, 0.07);
      });
    });
    clock += sp; stepN++;
  }
}
function setMood(name, fade) {
  if (!MOODS[name] || !ctx()) return; const t = AC.currentTime, f = fade == null ? 3.5 : fade;
  if (!timer) { clock = AC.currentTime + 0.15; timer = setInterval(schedule, 80); }
  if (cur && cur.name === name) return;
  Object.keys(moods).forEach(function (k) { const m = moods[k]; if (m.name !== name) { m.g.gain.cancelScheduledValues(t); m.g.gain.setTargetAtTime(0.0001, t, f / 3); m.lv = 0; } });
  cur = moodOf(name); cur.g.gain.cancelScheduledValues(t); cur.g.gain.setTargetAtTime(1, t, f / 3); cur.lv = 1;
  if (C.S.set.cap && C.caption) C.caption('music: ' + name);
}
function stop(fade) {
  if (!AC) return; const t = AC.currentTime;
  Object.keys(moods).forEach(function (k) { moods[k].g.gain.setTargetAtTime(0.0001, t, (fade || 1.5) / 3); moods[k].lv = 0; }); cur = null;
  Object.keys(ENV).forEach(function (k) { level(k, 0); }); underwater(false);
  setTimeout(function () { if (!cur && timer) { clearInterval(timer); timer = 0; } }, 3000);
}

/* ---- nature sound beds: each is a looping filtered noise or a stream of small calls ---- */
function bed(name) {
  if (ENV[name]) return ENV[name];
  const g = AC.createGain(); g.gain.value = 0; g.connect(envBus); const e = { g: g, lv: 0, next: 0 };
  if (name === 'water' || name === 'falls' || name === 'wind' || name === 'surf') {
    const src = AC.createBufferSource(); src.buffer = noiseBuf; src.loop = true; const f = AC.createBiquadFilter();
    if (name === 'water') { f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.6; }
    if (name === 'falls') { f.type = 'lowpass'; f.frequency.value = 900; }
    if (name === 'wind') { f.type = 'lowpass'; f.frequency.value = 380; const l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = 0.13; lg.gain.value = 160; l.connect(lg); lg.connect(f.frequency); l.start(); }
    if (name === 'surf') { f.type = 'lowpass'; f.frequency.value = 500; }
    const sg = AC.createGain(); sg.gain.value = name === 'water' ? 0.5 : name === 'falls' ? 0.9 : 0.6;
    if (name === 'water') { const l = AC.createOscillator(), lg = AC.createGain(); l.frequency.value = 0.7; lg.gain.value = 0.15; l.connect(lg); lg.connect(sg.gain); l.start(); }
    src.connect(f); f.connect(sg); sg.connect(g); src.start();
  }
  ENV[name] = e; return e;
}
function level(name, v) {
  if (!AC) return; const e = bed(name); if (Math.abs(e.lv - v) < 0.02) return; e.lv = v; e.g.gain.setTargetAtTime(v, AC.currentTime, 0.5);
}
function calls() { /* little animal calls, scheduled while their bed is turned up */
  if (!AC) return; const t = AC.currentTime;
  ['crickets', 'frogs', 'birds', 'fire', 'owl'].forEach(function (k) {
    const e = ENV[k]; if (!e || e.lv < 0.03 || t < e.next) return; const out = e.g;
    if (k === 'crickets') { e.next = t + 0.35 + Math.random() * 0.5; const f = 4200 + Math.random() * 600; for (let i = 0; i < 3; i++) chirp(out, f, t + i * 0.055, 0.03, 0.05, 'sine'); }
    if (k === 'frogs') { e.next = t + 1.2 + Math.random() * 2.5; const f = 110 + Math.random() * 60; for (let i = 0; i < 2; i++) chirp(out, f, t + i * 0.13, 0.09, 0.14, 'square', 0.6); }
    if (k === 'birds') { e.next = t + 2 + Math.random() * 4; const f = 1900 + Math.random() * 1200, n = 2 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) sweep(out, f * (1 + i * 0.08), f * 1.35, t + i * 0.14, 0.09, 0.05); }
    if (k === 'fire') { e.next = t + 0.05 + Math.random() * 0.25; pop(out, t, 0.08 + Math.random() * 0.1); }
    if (k === 'owl') { e.next = t + 6 + Math.random() * 6; sweep(out, 420, 380, t, 0.35, 0.06); sweep(out, 400, 360, t + 0.5, 0.5, 0.06); }
  });
}
function chirp(out, f, t, dur, v, type, sweepTo) { const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (sweepTo) o.frequency.exponentialRampToValueAtTime(f * sweepTo, t + dur); env(g, t, 0.004, v, dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05); }
function sweep(out, f0, f1, t, dur, v) { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur); env(g, t, 0.01, v, dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05); }
function pop(out, t, v) { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = 1500 + Math.random() * 2500; env(g, t, 0.002, v, 0.04); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.06); }
setInterval(calls, 120);

/* ---- one-shot sound effects for exploring ---- */
function sfx(name, v) {
  if (!ctx() || !C.S.set.sound) return; const t = AC.currentTime, out = envBus; v = v == null ? 1 : v;
  if (name === 'step') { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'lowpass'; f.frequency.value = 700 + Math.random() * 300; env(g, t, 0.004, 0.12 * v, 0.07); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.1); }
  if (name === 'splash') { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.setValueAtTime(2500, t); f.frequency.exponentialRampToValueAtTime(400, t + 0.5); env(g, t, 0.01, 0.4 * v, 0.6); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.7); }
  if (name === 'bubble') { chirp(out, 300 + Math.random() * 300, t, 0.08, 0.06 * v, 'sine', 2.2); }
  if (name === 'swim') { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'lowpass'; f.frequency.value = 600; env(g, t, 0.08, 0.12 * v, 0.35); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.5); }
  if (name === 'whoosh') { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = noiseBuf; f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(1800, t + 0.5); f.frequency.exponentialRampToValueAtTime(500, t + 1.1); env(g, t, 0.3, 0.3 * v, 0.9); s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 1.3); }
  if (name === 'discover') { [0, 4, 7, 12].forEach(function (k, i) { bell(musBus, mtof(72 + k), t + i * 0.12, 0.05 * v); }); }
  if (name === 'chime') { bell(musBus, mtof(79), t, 0.04 * v); bell(musBus, mtof(84), t + 0.15, 0.035 * v); }
  if (name === 'beam') { sweep(out, 200, 900, t, 1.6, 0.08 * v); sweep(out, 300, 1350, t + 0.1, 1.5, 0.05 * v); }
  if (name === 'ship') { const o = AC.createOscillator(), g = AC.createGain(), l = AC.createOscillator(), lg = AC.createGain(); o.frequency.value = 95; l.frequency.value = 6; lg.gain.value = 8; l.connect(lg); lg.connect(o.frequency); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.1 * v, t + 1); g.gain.linearRampToValueAtTime(0.0001, t + 4); o.connect(g); g.connect(out); o.start(t); l.start(t); o.stop(t + 4.2); l.stop(t + 4.2); }
}
function underwater(on) { if (!AC) return; lp.frequency.setTargetAtTime(on ? 650 : 18000, AC.currentTime, 0.25); }

BQ.amb = { mood: setMood, stop: stop, env: level, sfx: sfx, underwater: underwater, refresh: refresh, current: function () { return cur && cur.name; }, ready: function () { return !!ctx(); } };
}
if (BQ.core) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

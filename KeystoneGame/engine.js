/* Earthling Field Guide shared game file: movement, 3D scenery, scoring, menus, saving.
   World files plug in through FieldGuide.registerWorld and FieldGuide.registerQuestions. */
(function () {
'use strict';
const T = window.THREE;
const BQ = window.FieldGuide = {
  worlds: {}, data: {},
  UNITS: ['Structure and Function', 'Matter and Energy in Organisms and Ecosystems',
    'Interdependent Relationships in Ecosystems', 'Inheritance and Variation of Traits',
    'Disruptions to Ecosystems', 'Environmental Pressure Drives Evolution']
};
const QMAP = {};
BQ.registerWorld = function (w) { BQ.worlds[w.id] = w; };
BQ.registerQuestions = function (id, d) {
  BQ.data[id] = d;
  (d.questions || []).forEach(function (q) { QMAP[q.id] = Object.assign({ world: id }, q); });
  (d.sorts || []).forEach(function (s) {
    s.items.forEach(function (it, i) {
      QMAP[s.id + '.' + i] = { id: s.id + '.' + i, world: id, code: s.code, steels: s.steels, prompt: s.prompt,
        stem: it.text, options: s.options, answer: it.answer, explain: it.explain, hint: s.hint, fixed: true };
    });
  });
  (d.data || []).forEach(function (g) {
    g.questions.forEach(function (q, i) {
      QMAP[g.id + '.' + i] = { id: g.id + '.' + i, world: id, code: g.code, steels: g.steels, prompt: q.prompt, options: g.categories, answer: q.answer,
        hint: q.hint, explain: q.explain, fixed: true, figure: { type: 'bars', categories: g.categories, values: g.values, ylabel: g.ylabel } };
    });
  });
  (d.lablocks || []).forEach(function (lk) {
    lk.clues.forEach(function (c, i) {
      QMAP[lk.id + '.' + i] = { id: lk.id + '.' + i, world: id, code: c.code, prompt: c.prompt, options: ['1', '2', '3', '4', '5'], answer: c.answer - 1,
        hint: c.hint, explain: c.explain, figure: c.figure, fixed: true, tags: ['lock'] };
    });
  });
};
function loadScript(src, ok, fail) {
  const s = document.createElement('script'); s.src = src; s.onload = ok;
  s.onerror = function () { s.remove(); fail(); }; document.head.appendChild(s);
}
/* Looks for world1 ... worldN files and loads whichever ones are in the folder. */
BQ.loadWorlds = function (max) {
  let n = 1;
  (function next() {
    if (n > max) return boot();
    const i = n++;
    loadScript('world' + i + '-questions.js', function () { loadScript('world' + i + '.js', next, next); }, next);
  })();
};

/* ---------- saving (on this device only) ---------- */
const KEY = 'bioquest-save-v1';
function fresh() {
  return { alien: { shape: 0, color: 0, eyes: 2, ant: 2, gear: 0 }, levels: {}, missed: {}, codes: {}, seen: {}, rare: {}, words: {},
    set: { text: 1, low: false, sound: true, music: true, vol: 50, cap: true, unlock: false }, nick: '', board: [] };
}
let S = fresh();
try {
  const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (raw) { const f = fresh(); S = Object.assign(f, raw); S.alien = Object.assign(fresh().alien, raw.alien); S.set = Object.assign(fresh().set, raw.set); }
} catch (e) { /* play without saving */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

/* Leaderboard: kept separate so it can later talk to an online score service.
   To go online, replace submit() and top() with calls to that service.
   It stores a nickname and a score only. Never add names, emails, or other personal details. */
BQ.Leaderboard = {
  submit: function (nick, score) {
    if (!nick) return;
    const row = S.board.find(function (r) { return r.nick === nick; });
    if (row) row.score = Math.max(row.score, score); else S.board.push({ nick: nick, score: score });
    S.board.sort(function (a, b) { return b.score - a.score; }); S.board = S.board.slice(0, 10); save();
  },
  top: function (n) { return S.board.slice(0, n || 10); }
};

/* ---------- small helpers ---------- */
const $ = function (id) { return document.getElementById(id); };
const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
const rnd = function (a, b) { return a + Math.random() * (b - a); };
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function allLevels() {
  const out = [];
  Object.keys(BQ.worlds).sort().forEach(function (k) { BQ.worlds[k].levels.forEach(function (lv) { out.push({ w: BQ.worlds[k], lv: lv }); }); });
  return out;
}
function totalStars() { return Object.keys(S.levels).reduce(function (n, k) { return n + (S.levels[k].stars || 0); }, 0); }
function totalScore() { return Object.keys(S.levels).reduce(function (n, k) { return n + (S.levels[k].best || 0); }, 0); }
/* Testing: add #teacher (or #level-1-4 to jump straight to a level) to the end of the game's address. */
const TEACH = /teacher|level-/i.test(location.hash || '');
function played(id) { return TEACH || S.set.unlock || !!(S.levels[id] && S.levels[id].stars); }
function unlocked(i, list) { return i === 0 || S.set.unlock || TEACH || !!(S.levels[list[i - 1].lv.id] && S.levels[list[i - 1].lv.id].stars); }

/* ---------- sound with captions ---------- */
let AC = null, capTimer = 0;
function caption(text) { if (!S.set.cap) return; $('cap').textContent = '[' + text + ']'; $('cap').hidden = false; clearTimeout(capTimer); capTimer = setTimeout(function () { $('cap').hidden = true; }, 2200); }
function beep(freq, dur, type, cap) {
  if (cap) caption('sound: ' + cap);
  if (!S.set.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.07, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
  } catch (e) { /* no sound available */ }
}

/* ---------- music: composed in code, so there are no audio files and no copyright issues ---------- */
const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], mixo: [0, 2, 4, 5, 7, 9, 10] };
/* Each song: speed (bpm), starting note, scale, chord pattern for 4 bars, drum style, melody sound. */
const SONGS = {
  menu: { name: 'calm space theme', bpm: 78, root: 57, scale: 'dorian', prog: [0, 3, 5, 4], seed: 3, drums: 0, lead: 'triangle' },
  pond: { name: 'bright pond theme', bpm: 108, root: 60, scale: 'major', prog: [0, 3, 4, 0], seed: 7, drums: 1, lead: 'square' },
  cell: { name: 'bubbly cell theme', bpm: 96, root: 62, scale: 'dorian', prog: [0, 2, 3, 4], seed: 11, drums: 1, lead: 'triangle' },
  nucleus: { name: 'busy factory theme', bpm: 104, root: 58, scale: 'minor', prog: [0, 5, 2, 6], seed: 5, drums: 1, lead: 'square' },
  membrane: { name: 'flowing membrane theme', bpm: 92, root: 60, scale: 'mixo', prog: [0, 6, 3, 0], seed: 9, drums: 1, lead: 'triangle' },
  body: { name: 'heartbeat theme', bpm: 112, root: 57, scale: 'minor', prog: [0, 5, 3, 4], seed: 13, drums: 2, lead: 'triangle' },
  boss: { name: 'boss battle theme', bpm: 138, root: 55, scale: 'minor', prog: [0, 0, 5, 4], seed: 17, drums: 3, lead: 'square' }
};
const Music = { want: null, cur: null, song: null, mel: null, step: 0, next: 0, timer: 0, gain: null, duck: 1, gesture: false, noise: null };
function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function noteOf(song, d, oct) { const sc = SCALES[song.scale], o = Math.floor(d / 7); return song.root + 12 * (oct + o) + sc[((d % 7) + 7) % 7]; }
function makeMelody(song) {
  let seed = song.seed; const r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const phrase = function (rh) { return rh.map(function (st) { return { st: st, d: [0, 2, 4, 7, 2, 4][Math.floor(r() * 6)] + (r() < 0.25 ? 1 : 0), len: r() < 0.3 ? 3 : 2 }; }); };
  const A = phrase([0, 3, 6, 8, 10, 12]), B = phrase([0, 2, 4, 8, 11, 14]);
  return [A, B, A, phrase([0, 3, 6, 8, 10, 12])];
}
function voice(freq, t, dur, type, vol) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(Music.gain); o.start(t); o.stop(t + dur + 0.05);
}
function drum(t, kind) {
  if (kind === 'kick') {
    const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18); o.connect(g); g.connect(Music.gain); o.start(t); o.stop(t + 0.2); return;
  }
  if (!Music.noise) { const b = AC.createBuffer(1, Math.floor(AC.sampleRate * 0.06), AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; Music.noise = b; }
  const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); src.buffer = Music.noise; f.type = 'highpass'; f.frequency.value = 6500;
  g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); src.connect(f); f.connect(g); g.connect(Music.gain); src.start(t);
}
function schedule() {
  const song = Music.song; if (!song || !AC) return;
  const sp = 60 / song.bpm / 4;
  while (Music.next < AC.currentTime + 0.25) {
    const i = Music.step, bar = Math.floor(i / 16) % 4, st = i % 16, t = Music.next, ch = song.prog[bar], dr = song.drums;
    if (st === 0) [0, 2, 4].forEach(function (k) { voice(mtof(noteOf(song, ch + k, 0)), t, sp * 15, 'sine', 0.03); });
    if (st === 0 || st === 8) voice(mtof(noteOf(song, ch, -1)), t, sp * 3, 'triangle', 0.15);
    if (st === 6 || st === 14) voice(mtof(noteOf(song, ch + 4, -1)), t, sp * 1.5, 'triangle', 0.09);
    if (st % 2 === 0) voice(mtof(noteOf(song, ch + [0, 2, 4, 7][(st / 2) % 4], 1)), t, sp * 1.2, 'sine', 0.03);
    if (Math.floor(i / 64) % 3 !== 2) Music.mel[bar].forEach(function (n) { if (n.st === st) voice(mtof(noteOf(song, ch + n.d, 1)), t, sp * n.len * 0.9, song.lead, song.lead === 'square' ? 0.03 : 0.07); });
    if (dr === 1 || dr === 3) { if (st === 0 || st === 8 || (dr === 3 && (st === 6 || st === 14))) drum(t, 'kick'); if (dr === 3 ? st % 2 === 0 : (st === 4 || st === 12)) drum(t, 'hat'); }
    if (dr === 2 && (st === 0 || st === 3 || st === 8 || st === 11)) drum(t, 'kick');
    Music.next += sp; Music.step++;
  }
}
function musicLevel() {
  if (!Music.gain) return;
  const v = S.set.music ? (S.set.vol / 100) * 0.7 * Music.duck * (paused ? 0 : 1) : 0;
  Music.gain.gain.setTargetAtTime(v, AC.currentTime, 0.15);
}
Music.play = function (name) {
  Music.want = name; if (!SONGS[name] || !Music.gesture || !S.set.music) return;
  if (Music.cur === name) { musicLevel(); return; }
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return; }
  if (!Music.gain) { Music.gain = AC.createGain(); Music.gain.gain.value = 0; Music.gain.connect(AC.destination); }
  Music.cur = name; Music.song = SONGS[name]; Music.mel = makeMelody(Music.song); Music.step = 0; Music.next = AC.currentTime + 0.1;
  if (!Music.timer) Music.timer = setInterval(schedule, 60);
  musicLevel(); caption('music: ' + Music.song.name);
};
Music.stop = function () { Music.cur = null; Music.song = null; Music.want = null; };
Music.setDuck = function (d) { Music.duck = d; musicLevel(); };

/* ---------- 3D building blocks ---------- */
let renderer, scene, cam, camZ = 22, G = {}, mats = {}, texCache = {};
const COLORS = [['Sky blue', '#56B4E9'], ['Orange', '#E69F00'], ['Green', '#009E73'], ['Pink', '#CC79A7'], ['Yellow', '#F0E442'], ['Red-orange', '#D55E00']];
const GEAR = [['None', 0], ['Lab goggles', 3], ['Explorer cape', 8], ['Ribosome hat', 12]];
/* Each world's look: sky gradient, sun glow, layered ridges, haze, drifting lights, light beams. */
const THEMES = {
  space: { skyTop: '#040a1c', horizon: '#1f3f73', skyBottom: '#08142c', sun: ['#7fb8ff', 70, 30, 200], ridge: '#0c1c36', ground: '#14304a', top: '#2c5f80', rim: '#9fe8ff',
    mote: '#bfe6ff', stars: true, pal: ['#2f7f9a', '#5fd0c5', '#8a7fd6'], shapes: ['blob', 'ring'], density: 0.35, fogD: 0.012, hemi: ['#9fc8ff', '#1a2238'], key: '#cfe6ff' },
  pond: { skyTop: '#1d3466', horizon: '#f4ad78', skyBottom: '#d9806a', sun: ['#ffcf8a', -40, 9, 230], ridge: '#3b3d6c', ground: '#253830', top: '#4f7448', rim: '#ffe2a8',
    mote: '#ffe28a', shafts: '#ffd59a', pal: ['#202c44', '#283650', '#30405c'], shapes: ['tree'], density: 0.75, fogD: 0.010, hemi: ['#ffd2a8', '#2a2f4a'], key: '#ffc58a' },
  cell: { skyTop: '#020b13', horizon: '#0e6169', skyBottom: '#04212a', sun: ['#5ff0e0', 30, 14, 200], ridge: '#06313a', ground: '#0b3640', top: '#1d7a74', rim: '#8ffff0',
    mote: '#8ffff0', shafts: '#6fe8ff', pal: ['#f4a259', '#8cb369', '#ff7aa8', '#f4e285', '#7fb7e6'], shapes: ['bean', 'blob', 'ring'], density: 0.5, glow: true, fogD: 0.014, hemi: ['#7fe8ff', '#04161c'], key: '#aef6ff' },
  nucleus: { skyTop: '#0a0420', horizon: '#5d2b8c', skyBottom: '#1c0b38', sun: ['#d79bff', -25, 16, 200], ridge: '#2a1450', ground: '#22144a', top: '#5a46a0', rim: '#f0d0ff',
    mote: '#ffb8f0', shafts: '#c89bff', pal: ['#ff9f6e', '#7fd4ff', '#f4e285', '#c59cff'], shapes: ['ring', 'blob', 'pillar'], density: 0.5, glow: true, fogD: 0.013, hemi: ['#d7b8ff', '#120826'], key: '#ffd6f5' },
  membrane: { skyTop: '#06222a', horizon: '#d88c3e', skyBottom: '#4a2a1a', sun: ['#ffc070', 45, 10, 240], ridge: '#3a2a26', ground: '#55301a', top: '#a8763c', rim: '#fff0b8',
    mote: '#ffd98a', shafts: '#ffcf80', pal: ['#f2c078', '#5fd0c5', '#e8875a'], shapes: ['pillar', 'blob', 'pillar'], density: 0.45, glow: true, fogD: 0.011, hemi: ['#ffd9a0', '#1a1410'], key: '#ffd08a' },
  body: { skyTop: '#120206', horizon: '#a82a3c', skyBottom: '#3a0a12', sun: ['#ff6b7a', 0, 16, 230], pulse: true, ridge: '#3a0a16', ground: '#45101e', top: '#9a3c52', rim: '#ffc0c8',
    mote: '#ff9aa8', shafts: '#ff8090', pal: ['#e85d5d', '#ffb3a7', '#c9364a'], shapes: ['disc', 'disc', 'blob'], density: 0.5, glow: true, fogD: 0.013, hemi: ['#ff9aa8', '#1a0408'], key: '#ffb0b8' }
};
let FX = {}, SKY = null, MOTES = null, HEMI = null, KEYL = null;
function makeFxTextures() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.22, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); FX.glow = new T.CanvasTexture(c);
  const c2 = document.createElement('canvas'); c2.width = 64; c2.height = 256; const g2 = c2.getContext('2d');
  const v = g2.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = v; g2.fillRect(0, 0, 64, 256);
  g2.globalCompositeOperation = 'destination-in'; const h = g2.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(0.5, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)');
  g2.fillStyle = h; g2.fillRect(0, 0, 64, 256); FX.shaft = new T.CanvasTexture(c2);
}
function glow(color, size, op, fog) {
  const sp = new T.Sprite(new T.SpriteMaterial({ map: FX.glow, color: color, transparent: true, opacity: op == null ? 0.8 : op, blending: T.AdditiveBlending, depthWrite: false, fog: fog !== false }));
  sp.scale.set(size, size, 1); return sp;
}
function basic(color, op, add) {
  const k = 'b' + color + '|' + op + '|' + (add ? 1 : 0);
  if (!mats[k]) mats[k] = new T.MeshBasicMaterial({ color: color, transparent: op != null, opacity: op == null ? 1 : op, blending: add ? T.AdditiveBlending : T.NormalBlending, depthWrite: !add });
  return mats[k];
}
function emat(color, em) {
  const k = 'e' + color + em;
  if (!mats[k]) mats[k] = new T.MeshLambertMaterial({ color: color, emissive: em });
  return mats[k];
}
function gate(x0, x1, y0, y1) {
  const g = new T.Group(), m = new T.Mesh(G.box, basic(L.th.rim, 0.13, true)); m.scale.set(x1 - x0, y1 - y0, 5); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(m);
  const core = new T.Mesh(G.box, basic(L.th.rim, 0.28, true)); core.scale.set(0.15, y1 - y0, 5.2); core.position.copy(m.position); g.add(core);
  return g;
}
function scenery(th, x0, x1, grp, anim) {
  const low = S.set.low, hz = new T.Color(th.horizon);
  scene.background = new T.Color(th.horizon); scene.fog = new T.FogExp2(th.horizon, th.fogD);
  HEMI.color.set(th.hemi[0]); HEMI.groundColor.set(th.hemi[1]); KEYL.color.set(th.key);
  /* sky dome and sun, kept centered on the camera so they look infinitely far away */
  SKY = new T.Group();
  const dome = new T.Mesh(new T.SphereGeometry(500, 24, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new T.Color(th.skyTop) }, hor: { value: hz.clone() }, bot: { value: new T.Color(th.skyBottom) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 hor; uniform vec3 bot; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, pow(min(h * 2.4, 1.0), 0.6)) : mix(hor, bot, min(-h * 4.0, 1.0)); gl_FragColor = vec4(c, 1.0); }' }));
  dome.renderOrder = -10; SKY.add(dome);
  const sx = th.sun[1], sy = th.sun[2], sun1 = glow(th.sun[0], th.sun[3], 0.9, false), sun2 = glow('#ffffff', th.sun[3] * 0.18, 0.9, false), sun3 = glow(th.sun[0], th.sun[3] * 2.4, 0.35, false);
  [sun3, sun1, sun2].forEach(function (g) { g.position.set(sx * 4, sy * 4, -420); SKY.add(g); });
  SKY.userData = { sun: sun1, base: th.sun[3], pulse: th.pulse };
  if (th.stars) {
    const n = 500, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), e = rnd(0.05, 1.3); p[i * 3] = Math.cos(a) * Math.cos(e) * 440; p[i * 3 + 1] = Math.sin(e) * 440; p[i * 3 + 2] = -Math.abs(Math.sin(a) * Math.cos(e) * 440) - 40; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(p, 3));
    SKY.add(new T.Points(sg, new T.PointsMaterial({ size: 2.2, map: FX.glow, color: '#dbe9ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false, sizeAttenuation: true })));
  }
  grp.add(SKY);
  /* layered ridges that fade into the haze */
  const layers = low ? [1, 3] : [0, 1, 2, 3];
  layers.forEach(function (k) {
    const z = [-26, -48, -85, -150][k], amp = [2.5, 5, 10, 20][k], base = [-2, 1, 6, 16][k], span = Math.abs(z) * 1.6 + 80, xa = x0 - span, xb = x1 + span;
    const ph = [rnd(0, 6), rnd(0, 6), rnd(0, 6)], fr = [rnd(0.02, 0.035) / (1 + k * 0.5), rnd(0.07, 0.1) / (1 + k * 0.5), rnd(0.18, 0.26) / (1 + k * 0.5)];
    const sh = new T.Shape(); sh.moveTo(xa, -120);
    for (let x = xa; x <= xb; x += 2.5) sh.lineTo(x, base + amp * (0.6 * Math.sin(x * fr[0] + ph[0]) + 0.3 * Math.sin(x * fr[1] + ph[1]) + 0.1 * Math.sin(x * fr[2] + ph[2])));
    sh.lineTo(xb, -120); sh.closePath();
    const col = new T.Color(th.ridge).lerp(hz, 0.12 + k * 0.2), m = new T.Mesh(new T.ShapeGeometry(sh), new T.MeshBasicMaterial({ color: col, fog: false }));
    m.position.z = z; m.renderOrder = -5 + k; grp.add(m);
  });
  /* beams of light from above */
  if (th.shafts && !low) {
    const n = Math.max(4, Math.round((x1 - x0) / 16));
    for (let i = 0; i < n; i++) {
      const m = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: FX.shaft, color: th.shafts, transparent: true, opacity: rnd(0.05, 0.12), blending: T.AdditiveBlending, depthWrite: false, fog: false, side: T.DoubleSide }));
      m.scale.set(rnd(3, 10), 70, 1); m.position.set(rnd(x0 - 20, x1 + 20), 16, rnd(-34, -12)); m.rotation.z = -0.38; grp.add(m);
    }
  }
  /* drifting specks of light */
  const n = low ? 140 : 450, pos = new Float32Array(n * 3), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) { pos[i * 3] = rnd(x0 - 25, x1 + 25); pos[i * 3 + 1] = rnd(-3, 18); pos[i * 3 + 2] = rnd(-16, 7); ph[i] = rnd(0, 6.3); }
  const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(pos, 3));
  grp.add(new T.Points(mg, new T.PointsMaterial({ size: 0.32, map: FX.glow, color: th.mote, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false })));
  MOTES = { geo: mg, pos: pos, ph: ph, n: n };
  decor(th, x0, x1, grp, anim);
}
function sceneryTick(dt, t) {
  if (SKY) {
    SKY.position.copy(cam.position);
    if (SKY.userData.pulse) { const b = (t * 112 / 60) % 1, p = 1 + 0.12 * Math.exp(-b * 9) + 0.06 * Math.exp(-Math.max(0, b - 0.2) * 9) * (b > 0.2 ? 1 : 0); SKY.userData.sun.scale.setScalar(SKY.userData.base * p); }
  }
  if (MOTES) {
    const p = MOTES.pos;
    for (let i = 0; i < MOTES.n; i++) { p[i * 3 + 1] += dt * 0.35; p[i * 3] += Math.sin(t * 0.5 + MOTES.ph[i]) * dt * 0.3; if (p[i * 3 + 1] > 18) p[i * 3 + 1] = -3; }
    MOTES.geo.attributes.position.needsUpdate = true;
  }
}
function mat(color, opacity) {
  const k = color + '|' + (opacity || 1);
  if (!mats[k]) mats[k] = new T.MeshLambertMaterial({ color: color, transparent: opacity != null && opacity < 1, opacity: opacity == null ? 1 : opacity });
  return mats[k];
}
function mesh(geo, color, opacity) { return new T.Mesh(G[geo], mat(color, opacity)); }
function box(x0, x1, y0, y1, depth, color, opacity) {
  const m = mesh('box', color, opacity); m.scale.set(x1 - x0, y1 - y0, depth); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); return m;
}
function wrapText(g, text, maxW) {
  const words = String(text).split(' '), lines = []; let cur = '';
  words.forEach(function (w) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
function labelTex(text, o) {
  o = o || {};
  const bg = o.bg || '#0e2433', fg = o.fg || '#ffffff', bd = o.bd || '#ffd166', key = text + '|' + bg + fg + bd + (o.big ? 1 : 0);
  if (texCache[key]) return texCache[key];
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d'); let size = o.big ? 110 : 62, lines;
  for (;;) {
    g.font = '700 ' + size + 'px "Atkinson Hyperlegible", Arial, sans-serif'; lines = wrapText(g, text, 460);
    const wide = Math.max.apply(null, lines.map(function (l) { return g.measureText(l).width; }));
    if ((lines.length * size * 1.18 <= 216 && wide <= 470) || size <= 22) break; size -= 4;
  }
  const lh = size * 1.18, H = Math.min(248, lines.length * lh + 34), y0 = (256 - H) / 2, r = 22;
  g.beginPath(); g.moveTo(6 + r, y0); g.arcTo(506, y0, 506, y0 + H, r); g.arcTo(506, y0 + H, 6, y0 + H, r); g.arcTo(6, y0 + H, 6, y0, r); g.arcTo(6, y0, 506, y0, r); g.closePath();
  g.fillStyle = bg; g.fill(); g.lineWidth = 6; g.strokeStyle = bd; g.stroke();
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach(function (l, i) { g.fillText(l, 256, 128 - (lines.length - 1) * lh / 2 + i * lh); });
  const t = new T.CanvasTexture(c); texCache[key] = t; return t;
}
function label(text, w, o) {
  const sp = new T.Sprite(new T.SpriteMaterial({ map: labelTex(text, o), transparent: true }));
  sp.scale.set(w, w / 2, 1); return sp;
}
function buildAlien(a) {
  const g = new T.Group(), col = COLORS[a.color][1], sc = [[0.55, 0.6, 0.5], [0.44, 0.76, 0.42], [0.7, 0.48, 0.55]][a.shape];
  const body = mesh('sph', col); body.scale.set(sc[0], sc[1], sc[2]); body.position.y = sc[1] + 0.15; g.add(body);
  [-1, 1].forEach(function (s) { const f = mesh('sph', col); f.scale.set(0.2, 0.1, 0.22); f.position.set(s * sc[0] * 0.5, 0.1, 0.05); g.add(f); });
  const ey = sc[1] * 1.3 + 0.15, ez = sc[2] * 0.88;
  for (let i = 0; i < a.eyes; i++) {
    const off = (i - (a.eyes - 1) / 2) * 0.3;
    const w = mesh('sph', '#ffffff'); w.scale.setScalar(0.14); w.position.set(off, ey, ez); g.add(w);
    const p = mesh('sph', '#10202c'); p.scale.setScalar(0.07); p.position.set(off, ey, ez + 0.1); g.add(p);
    if (a.gear === 1) { const ring = mesh('tor', '#ffd166'); ring.scale.setScalar(0.15); ring.position.set(off, ey, ez + 0.06); g.add(ring); }
  }
  if (a.gear === 1) { const strap = mesh('box', '#10202c'); strap.scale.set(sc[0] * 1.9, 0.07, sc[2] * 1.7); strap.position.set(0, ey, 0); g.add(strap); }
  const top = sc[1] * 2 + 0.15;
  for (let i = 0; i < a.ant; i++) {
    const off = (i - (a.ant - 1) / 2) * 0.4;
    const st = mesh('cyl', col); st.scale.set(0.035, 0.4, 0.035); st.position.set(off, top + 0.15, 0); g.add(st);
    const b = new T.Mesh(G.sph, emat('#ffd166', '#c08a10')); b.scale.setScalar(0.09); b.position.set(off, top + 0.38, 0); b.add(glow('#ffd166', 9, 0.7)); g.add(b);
  }
  if (a.gear === 2) { const cape = mesh('box', '#D55E00'); cape.scale.set(sc[0] * 1.7, sc[1] * 1.5, 0.06); cape.position.set(0, sc[1] * 0.95, -sc[2] - 0.05); cape.rotation.x = 0.18; g.add(cape); }
  if (a.gear === 3) {
    const h1 = mesh('sph', '#a58bff'); h1.scale.set(0.3, 0.2, 0.3); h1.position.set(0, top + 0.08, 0); g.add(h1);
    const h2 = mesh('sph', '#c59cff'); h2.scale.set(0.2, 0.14, 0.2); h2.position.set(0, top + 0.3, 0); g.add(h2);
  }
  return g;
}
function decor(th, x0, x1, grp, anim) {
  const dens = (S.set.low ? 0.45 : 1) * (th.density || 1), fog = new T.Color(th.horizon);
  const layers = [{ z: -7, s: 1, n: 0.1, f: 0.1 }, { z: -17, s: 2.2, n: 0.085, f: 0.3 }, { z: -33, s: 4.5, n: 0.06, f: 0.5 }, { z: -60, s: 9, n: 0.04, f: 0.68 }, { z: 6, s: 0.5, n: 0.035, f: 0, fore: true }];
  layers.forEach(function (ly) {
    const span = (x1 - x0) + 60 + Math.abs(ly.z) * 2, count = Math.round(span * ly.n * dens);
    for (let i = 0; i < count; i++) {
      const shape = ly.fore ? 'blob' : th.shapes[Math.floor(Math.random() * th.shapes.length)];
      const c = new T.Color(th.pal[Math.floor(Math.random() * th.pal.length)]).lerp(fog, ly.f);
      const col = '#' + c.getHexString(), s = ly.s * rnd(0.7, 1.4);
      const x = rnd(x0 - 30 - Math.abs(ly.z), x1 + 30 + Math.abs(ly.z)), z = ly.z + rnd(-2, 2);
      let m, floaty = true, y = rnd(-4, 14) * (ly.fore ? 0.7 : Math.max(1, ly.s * 0.45));
      if (shape === 'tree') { m = new T.Mesh(G.cone, basic(col)); m.scale.set(s * 0.8, s * 2.4, s * 0.8); y = -1 + s * 2.4; floaty = false; }
      else if (shape === 'hill') { m = mesh('sph', col); m.scale.set(s * 5, s * 2.4, s * 3); y = -2; floaty = false; }
      else if (shape === 'pillar') { m = mesh('cyl', col); m.scale.set(s * 0.5, s * 7, s * 0.5); y = rnd(-3, 3); floaty = false; }
      else if (shape === 'bean') { m = mesh('sph', col); m.scale.set(s * 1.7, s * 0.75, s * 0.75); m.rotation.z = rnd(0, 3); }
      else if (shape === 'ring') { m = mesh('tor', col); m.scale.setScalar(s); m.rotation.set(rnd(0, 3), rnd(0, 3), 0); }
      else if (shape === 'disc') { m = mesh('sph', col); m.scale.set(s * 1.2, s * 0.4, s * 1.2); m.rotation.set(rnd(0, 3), 0, rnd(0, 3)); }
      else { m = mesh('sph', col, ly.fore ? 0.2 : 1); m.scale.set(s * rnd(0.8, 1.3), s * rnd(0.8, 1.3), s); }
      if (th.glow && !ly.fore && shape !== 'pillar') { const em = new T.Color(col).multiplyScalar(0.35); m.material = emat(col, '#' + em.getHexString()); if (!S.set.low && Math.random() < 0.35) m.add(glow(col, 2.6, 0.35)); }
      m.position.set(x, y, z); grp.add(m);
      if (floaty && !S.set.low) anim.push({ m: m, y: y, ph: rnd(0, 6), amp: 0.3 * ly.s, rot: rnd(-0.2, 0.2) });
    }
  });
}

/* ---------- game state ---------- */
let L = null, P = null, mode = 'menu', paused = false, last = 0, menuAlien = null, menuGrp = null, backTo = 'menu';
const keys = { left: false, right: false, jump: false, act: false, duck: false };
let jumpBuf = 0, coyote = 0, actEdge = false, toastT = 0, noteT = 0;
const HW = 0.42, STAND = 1.35, CROUCH = 0.78; let PH = STAND; const SPEED = 7.2, JUMP = 16, GRAV = 40;

function addPickup(kind, x, y) {
  const g = new T.Group(), shield = kind === 'shield', life = kind === 'life', col = shield ? '#7fd4ff' : life ? '#ff8fb1' : '#c8ff7a';
  const core = new T.Mesh(shield ? G.tor : G.sph, emat(col, '#2a3a4a')); core.scale.setScalar(shield ? 0.4 : 0.38); g.add(core); g.add(glow(col, 2.8, 0.75));
  const lb = label(shield ? 'Shield' : life ? 'Extra life' : 'ATP boost', 2); lb.position.y = 1; g.add(lb); g.position.set(x, y, 0); L.group.add(g);
  L.boosts.push({ x: x, y: y, m: g, got: false, kind: kind });
}
/* simple specimen models for scanning */
function specimen(look, col) {
  const g = new T.Group(), M = function (c, e) { return emat(c, e || '#1a2a3a'); }, sph = function (c, sx, sy, sz, x, y, z) { const m = new T.Mesh(G.sph, M(c)); m.scale.set(sx, sy, sz); m.position.set(x || 0, y || 0, z || 0); g.add(m); return m; };
  if (look === 'rock') { const m = new T.Mesh(G.ico, M('#8a8f96', '#202428')); m.scale.set(0.9, 0.6, 0.7); m.position.y = 0.5; g.add(m); }
  else if (look === 'crystal') { [[0, 0.8, 0], [-0.4, 0.55, 0.3], [0.4, 0.5, -0.2]].forEach(function (p, i) { const c = new T.Mesh(G.cone, M('#bfe9ff', '#3a6a8a')); c.scale.set(0.25, 0.9 - i * 0.2, 0.25); c.position.set(p[0], p[1], p[2]); g.add(c); }); }
  else if (look === 'frog') { g.userData.hop = true; sph('#5fbf5a', 0.6, 0.42, 0.5, 0, 0.45); [-0.25, 0.25].forEach(function (ex) { sph('#5fbf5a', 0.16, 0.16, 0.16, ex, 0.8, 0.2); sph('#10202c', 0.08, 0.08, 0.08, ex, 0.82, 0.33); }); }
  else if (look === 'sprout') { g.userData.grow = true; const st = new T.Mesh(G.cyl, M('#4f9a5a')); st.scale.set(0.06, 0.9, 0.06); st.position.y = 0.45; g.add(st); sph('#7be06a', 0.3, 0.1, 0.18, -0.25, 0.85); sph('#7be06a', 0.3, 0.1, 0.18, 0.25, 0.95); }
  else if (look === 'lily') { const p = new T.Mesh(G.cyl, M('#3f9a4a')); p.scale.set(0.9, 0.06, 0.9); p.position.y = 0.1; g.add(p); sph('#ffb0d0', 0.22, 0.2, 0.22, 0.2, 0.3); }
  else if (look === 'eggs') { for (let i = 0; i < 7; i++) sph('#e8f0d0', 0.16, 0.16, 0.16, Math.cos(i) * 0.35, 0.25 + (i % 3) * 0.12, Math.sin(i) * 0.25); }
  else if (look === 'turtle') { sph('#6a8a3a', 0.7, 0.4, 0.55, 0, 0.4); sph('#8ab06a', 0.2, 0.18, 0.2, 0.75, 0.35); }
  else if (look === 'rod') { g.userData.wiggle = true; sph(col, 0.7, 0.3, 0.3, 0, 0.8); const f = new T.Mesh(G.cyl, M(col)); f.scale.set(0.03, 0.5, 0.03); f.rotation.z = Math.PI / 2; f.position.set(-0.9, 0.8, 0); g.add(f); sph('#ffd166', 0.25, 0.08, 0.08, 0.1, 0.8, 0.22); }
  else if (look === 'cell') { const m = new T.Mesh(G.sph, basic(col, 0.35, true)); m.scale.setScalar(0.85); m.position.y = 0.9; g.add(m); sph('#8a5ac8', 0.3, 0.3, 0.3, 0.1, 0.9, 0.2); sph('#ff9f6e', 0.15, 0.08, 0.08, -0.4, 0.7, 0.3); }
  else if (look === 'helix') { g.userData.spin = true; for (let i = 0; i < 10; i++) { const a = i * 0.7; sph(i % 2 ? '#7fd4ff' : '#ffb09c', 0.1, 0.1, 0.1, Math.cos(a) * 0.3, 0.2 + i * 0.16, Math.sin(a) * 0.3); sph(i % 2 ? '#ffd166' : '#7be0ad', 0.1, 0.1, 0.1, -Math.cos(a) * 0.3, 0.2 + i * 0.16, -Math.sin(a) * 0.3); } }
  else if (look === 'stack') { for (let i = 0; i < 4; i++) sph(col, 0.7 - i * 0.08, 0.08, 0.35, 0, 0.4 + i * 0.22); }
  else sph(col, 0.6, 0.55, 0.5, 0, 0.6);
  g.add(glow(col, 2.6, 0.25)); return g;
}
function nearScan() { return L.scans.find(function (k) { return Math.abs(P.x - k.x) < 1.6 && P.y > k.y - 1 && P.y < k.y + 2.4; }); }
function showNote(sc) {
  const n = $('note'); n.innerHTML = '<small>New word for your Field Guide</small><b>' + esc(sc.word) + '</b><span>' + esc(sc.note) + '</span>';
  n.hidden = false; noteT = Math.max(8, sc.note.split(' ').length / 2.6);
}
function doScan(k) {
  if (k.done) { showNote(k.sc); return; }
  k.done = true; const fresh = !S.words[k.sc.word]; S.words[k.sc.word] = 1; save();
  k.ring.material = basic('#7be0ad', 0.7, true); k.nm.material.map = labelTex('✓ ' + k.sc.name, { bd: '#7be0ad' }); k.nm.material.needsUpdate = true;
  L.score += 20; popup(k.x, k.y + 2.2, fresh ? 'New word: ' + k.sc.word : k.sc.word, '#9fe0ff'); burst(k.x, k.y + 1, '#9fe0ff'); beep(1000, 0.18, 'sine', 'scanner chirp, new word'); showNote(k.sc); hud();
}
/* no getting stuck: after two wrong tries, the right choice glows gold */
function helpGlow(g) { if (!g || g.userData.help) return; const h = glow('#ffd700', 3.4, 0.8); g.add(h); g.userData.help = h; L.helps.push(h); }
function unhelp(g) { if (g && g.userData.help) { g.remove(g.userData.help); L.helps = L.helps.filter(function (h) { return h !== g.userData.help; }); g.userData.help = null; } }
function bumpBlock(qb) {
  qb.used = true; qb.m.material = emat('#8a6a40', '#2a1a08'); qb.q.visible = false; qb.gl.visible = false; qb.m.position.y += 0.25; setTimeout(function () { qb.m.position.y -= 0.25; }, 120);
  if (qb.reward === 'sparks') { L.coins += 5; L.score += 50; popup(qb.x, qb.y, '+5 sparks', '#ffd166'); burst(qb.x, qb.y + 0.5, '#ffd166'); beep(1200, 0.12, 'square', 'ding, sparks'); hud(); }
  else { addPickup(qb.reward, qb.x, qb.y + 0.9); beep(880, 0.15, 'triangle', 'pop, a reward appeared'); }
}
function disposeGroup(g) {
  const shared = Object.keys(G).map(function (k) { return G[k]; });
  g.traverse(function (o) { if (o.geometry && shared.indexOf(o.geometry) < 0) o.geometry.dispose(); });
}
function teardown() {
  if (L) { scene.remove(L.group); disposeGroup(L.group); }
  if (menuGrp) { scene.remove(menuGrp); disposeGroup(menuGrp); menuGrp = null; }
  SKY = null; MOTES = null;
  Object.keys(texCache).forEach(function (k) { texCache[k].dispose(); }); texCache = {};
  L = null;
}
function addSolid(x0, x1, y0, y1, o) {
  const s = Object.assign({ x0: x0, x1: x1, y0: y0, y1: y1, oneWay: false, off: false }, o || {}); L.solids.push(s); return s;
}
function addGround(x0, x1, y) {
  addSolid(x0, x1, y - 14, y);
  L.group.add(box(x0, x1, y - 14, y - 0.3, 7, L.th.ground)); L.group.add(box(x0, x1, y - 0.3, y, 7.2, L.th.top));
  const rim = new T.Mesh(G.box, basic(L.th.rim)); rim.scale.set(x1 - x0, 0.09, 0.1); rim.position.set((x0 + x1) / 2, y - 0.02, 3.62); L.group.add(rim);
}
function builder() {
  const D = BQ.data[L.world.id] || {};
  const b = {
    x: 0, y: 0,
    ground: function (len) { addGround(b.x, b.x + len, b.y); b.x += len; return b; },
    gap: function (len) { b.x += len; return b; },
    rise: function (dy) { b.y += dy; return b; },
    plat: function (dx, dy, w) { const s = addSolid(b.x + dx, b.x + dx + w, b.y + dy - 0.4, b.y + dy, { oneWay: true }); L.group.add(box(s.x0, s.x1, s.y0, s.y1, 3, L.th.top)); return b; },
    hint: function (dx, dy, text) { const sp = label(text, 5, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); sp.position.set(b.x + dx, b.y + dy, -1.5); L.group.add(sp); return b; },
    sparks: function (dx, dy, n) {
      for (let i = 0; i < n; i++) { const m = new T.Mesh(G.oct, emat('#ffd166', '#b07a10')); m.scale.setScalar(0.26); m.add(glow('#ffd166', 5, 0.55)); m.position.set(b.x + dx + i * 1.3, b.y + dy, 0); L.group.add(m); L.sparks.push({ x: m.position.x, y: m.position.y, m: m }); }
      return b;
    },
    checkpoint: function () { L.cps.push({ x: b.x - 2, y: b.y }); return b; },
    collect: function (id) {
      const set = (D.tokens || []).find(function (s) { return s.id === id; }); if (!set) return b;
      const items = shuffle(set.good.map(function (t) { return { text: t, good: true }; }).concat(set.bad.map(function (t) { return { text: t.text, good: false, explain: t.explain }; })));
      const x0 = b.x, wx = x0 + 8 + items.length * 4; addGround(x0, wx + 5, b.y);
      const sign = label(set.prompt, 7, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); sign.position.set(x0 + 3.5, b.y + 6.4, -1.5); L.group.add(sign);
      const door = { need: set.good.length, got: 0, set: set };
      items.forEach(function (it, i) {
        const x = x0 + 8 + i * 4, y = b.y + (i % 2 ? 3.2 : 1.3), g = new T.Group();
        const gem = new T.Mesh(G.ico, emat('#bfe9ff', '#3a7090')); gem.scale.setScalar(0.42); g.add(gem); g.add(glow('#9fe0ff', 2.8, 0.45));
        const lb = label(it.text, 3.5); lb.position.y = 1.25; g.add(lb);
        g.position.set(x, y, 0); L.group.add(g); L.tokens.push({ x: x, y: y, it: it, door: door, m: g, gem: gem });
      });
      door.solid = addSolid(wx, wx + 1.2, b.y, b.y + 18); door.mesh = gate(wx, wx + 1.2, b.y, b.y + 18); L.group.add(door.mesh);
      door.label = label('', 4.2); door.label.position.set(wx + 0.6, b.y + 5.2, 3); L.group.add(door.label); L.doors.push(door); doorText(door);
      b.x = wx + 5; L.cps.push({ x: wx + 3, y: b.y }); return b;
    },
    station: function (list, o) {
      const qs = [];
      (Array.isArray(list) ? list : [list]).forEach(function (e) {
        if (typeof e === 'string') { if (QMAP[e]) qs.push(QMAP[e]); return; }
        const ids = shuffle(Object.keys(QMAP).filter(function (k) { return k.indexOf(e.sort + '.') === 0 && !L.used[k]; })).slice(0, e.n || 3);
        ids.forEach(function (k) { L.used[k] = 1; qs.push(QMAP[k]); });
      });
      if (qs.length) makeStation(qs, o || {}); return b;
    },
    review: function () {
      const ids = Object.keys(S.missed).filter(function (k) { return QMAP[k] && QMAP[k].world === L.world.id && !L.used[k]; }).slice(0, 2);
      ids.forEach(function (k) { L.used[k] = 1; });
      if (ids.length) makeStation(ids.map(function (k) { return QMAP[k]; }), { title: 'Review: one you missed before' }); return b;
    },
    /* Interleaving: a gate that mixes in questions from topics covered in earlier levels.
       Missed questions come first, then the ones seen longest ago. */
    mixed: function (n, codes) {
      const pr = n >= 2 ? pickPair() : null, qs = (pr ? pr.qs : []).concat(mixPick(n - (pr ? 2 : 0), codes));
      if (qs.length) makeStation(qs, { title: 'Mixed review', pair: pr }); return b;
    },
    become: function (ids) {
      const list = Array.isArray(ids) ? ids : [ids], id = list[Math.floor(Math.random() * list.length)];
      const it = (D.become || []).find(function (e) { return e.id === id; }); if (it) makeBecome(it); return b;
    },
    readData: function (id) {
      const g = (D.data || []).find(function (e) { return e.id === id; }); if (!g) return b;
      makeStation(g.questions.map(function (_, i) { return QMAP[g.id + '.' + i]; }), { title: 'Read the Data', labels: g.categories, flat: true, chart: g }); return b;
    },
    maze: function (id) { const mz = (D.mazes || []).find(function (e) { return e.id === id; }); if (mz) makeMaze(mz); return b; },
    sequence: function (id) { const sq = (D.sequences || []).find(function (e) { return e.id === id; }); if (sq) makeSequence(sq); return b; },
    wordbank: function (id) { const wb = (D.wordbanks || []).find(function (e) { return e.id === id; }); if (wb) makeWordbank(wb); return b; },
    /* ACTION PIECES: free radicals to dodge or stomp, moving platforms, ATP boosts, catch games */
    hazard: function (dx, dy, o) {
      o = o || {}; const g = new T.Group(), core = new T.Mesh(G.ico, emat('#ff6b4a', '#7a1a0a')); core.scale.setScalar(0.55); g.add(core);
      const sp = new T.Mesh(G.oct, emat('#ffb09c', '#7a2a1a')); sp.scale.set(0.95, 0.25, 0.25); g.add(sp); const sp2 = sp.clone(); sp2.rotation.z = Math.PI / 2; g.add(sp2);
      g.add(glow('#ff6b4a', 2.8, 0.55)); g.position.set(b.x + dx, b.y + dy, 0); L.group.add(g);
      L.hazards.push({ m: g, bx: b.x + dx, by: b.y + dy, x: b.x + dx, y: b.y + dy, ax: o.ax || 0, ay: o.ay == null ? 0.6 : o.ay, sp: o.sp || 1.5, ph: Math.random() * 6, t: 0, alive: true }); return b;
    },
    bridge: function (len, o) {
      o = o || {}; const w = o.w || 3.6, cx = b.x + len / 2, sl = addSolid(cx - w / 2, cx + w / 2, b.y - 0.5, b.y, { oneWay: true });
      const m = new T.Group(), body = box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top); body.material = emat(L.th.top, '#3a2a10'); m.add(body);
      const rim = new T.Mesh(G.box, basic(L.th.rim)); rim.scale.set(w, 0.08, 0.1); rim.position.set(cx, b.y - 0.02, 1.55); m.add(rim);
      const gl = glow(L.th.rim, 3.6, 0.35); gl.position.set(cx, b.y - 0.6, 0); m.add(gl); L.group.add(m);
      L.movers.push({ s: sl, m: m, bx: sl.x0, by: sl.y1, ax: o.ay ? 0 : (len - w) / 2 - 0.3, ay: o.ay || 0, sp: o.sp || 1.1, t: o.ph || 0 });
      b.x += len; return b;
    },
    /* VIRUS: walks back and forth over a stretch of ground. Jump on it or over it. */
    virus: function (dx, range, sp) {
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#9be36b', '#2f5a10')); core.scale.setScalar(0.5); g.add(core);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, k = new T.Mesh(G.sph, emat('#d8ff9a', '#4a7a20')); k.scale.setScalar(0.12); k.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0); g.add(k); }
      [-0.17, 0.17].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.12); e.position.set(ex, 0.08, 0.45); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.06); p.position.set(ex, 0.06, 0.55); g.add(p); });
      g.add(glow('#9be36b', 2.2, 0.35)); g.position.set(b.x + dx, b.y + 0.62, 0); L.group.add(g);
      L.hazards.push({ kind: 'virus', m: g, bx: b.x + dx, by: b.y + 0.62, x: b.x + dx, y: b.y + 0.62, range: range || 2.5, sp: sp || 1, ph: Math.random() * 6, t: 0, alive: true }); return b;
    },
    /* SNAPPER: a phagocyte (an amoeba in the pond, a white blood cell in the body) that pops out of a
       pore on a steady beat to engulf whatever is nearby. It shakes just before it pops up.
       Time your jump to get past; it cannot be stomped. */
    snapper: function (dx, period, offset) {
      const x = b.x + dx, g = new T.Group(), pore = new T.Mesh(G.tor, emat('#6a4a7a', '#200a2a')); pore.scale.set(0.8, 0.8, 0.8); pore.rotation.x = Math.PI / 2; pore.position.set(x, b.y + 0.05, 0); L.group.add(pore);
      const head = new T.Group(), body = new T.Mesh(G.sph, emat('#e6f0ff', '#3a4a6a')); body.scale.set(0.85, 0.75, 0.7); head.add(body); head.add(glow('#cfe0ff', 2.6, 0.35));
      const nuc = new T.Mesh(G.sph, emat('#8a5ac8', '#2a0a4a')); nuc.scale.set(0.32, 0.26, 0.2); nuc.position.set(0.15, -0.15, 0.55); head.add(nuc);
      [-0.28, 0.12].forEach(function (ex) { const e = new T.Mesh(G.sph, emat('#ffffff', '#666666')); e.scale.setScalar(0.15); e.position.set(ex, 0.25, 0.62); head.add(e); const p = new T.Mesh(G.sph, emat('#10202c', '#000000')); p.scale.setScalar(0.07); p.position.set(ex, 0.25, 0.75); head.add(p); });
      const arms = [-1, 1].map(function (side) { const a = new T.Group(), arm = new T.Mesh(G.sph, emat('#e6f0ff', '#3a4a6a')); arm.scale.set(0.22, 0.75, 0.22); arm.position.y = 0.6; a.add(arm); a.position.set(side * 0.65, 0.1, 0); head.add(a); return a; });
      g.add(head); g.position.set(x, b.y, 0); L.group.add(g);
      L.hazards.push({ kind: 'snapper', m: g, head: head, arms: arms, x: x, y: b.y, gy: b.y, period: period || 4, offset: offset || 0, t: 0, alive: true }); return b;
    },
    /* ANTIBODY: a Y-shaped antibody (your body's tag for invaders, and you are the invader) that flies
       right to left at head height on a steady beat. Duck under it or jump over it. A glow at its
       launch point blinks just before it flies. */
    antibody: function (dx, span, period, offset) {
      const x0 = b.x + dx, g = new T.Group(), M = emat('#ffe08a', '#6a5010');
      const stem = new T.Mesh(G.cyl, M); stem.scale.set(0.09, 0.45, 0.09); stem.rotation.z = Math.PI / 2; stem.position.x = 0.35; g.add(stem);
      [-1, 1].forEach(function (sd) { const a = new T.Mesh(G.cyl, M); a.scale.set(0.08, 0.42, 0.08); a.rotation.z = Math.PI / 2 + sd * 0.6; a.position.set(-0.12, sd * 0.17, 0); g.add(a); });
      g.add(glow('#ffe08a', 1.8, 0.45)); g.scale.setScalar(1.5); L.group.add(g);
      const warn = glow('#ffe08a', 2.2, 0.15); warn.position.set(x0 + 0.6, b.y + 1.15, 0); L.group.add(warn);
      L.hazards.push({ kind: 'antibody', m: g, warn: warn, x0: x0, x: x0, gy: b.y, y: b.y + 1.15, span: span || 12, speed: 7, period: period || 3.2, offset: offset || 0, t: 0, alive: true }); return b;
    },
    /* SCAN: a specimen to look at. Walk up and press E: a short note teaches a new word,
       and the word is saved in the Field Guide. Play keeps going while you read. */
    scan: function (dx, id, dy) {
      const sc = (D.scans || []).find(function (e) { return e.id === id; }); if (!sc) return b;
      const x = b.x + dx, y = b.y + (dy || 0), g = specimen(sc.look || 'blob', sc.color || '#9fe0ff'); g.position.set(x, y, 0.6); L.group.add(g);
      const ring = new T.Mesh(G.tor, basic('#9fe0ff', 0.7, true)); ring.scale.setScalar(0.45); ring.position.set(x, y + 2.7, 0.6); L.group.add(ring);
      const nm = label('🔍 ' + sc.name, 3, { bd: '#9fe0ff' }); nm.position.set(x, y + 3.6, 0.6); L.group.add(nm);
      L.scans.push({ sc: sc, x: x, y: y, g: g, ring: ring, nm: nm, done: false, t: Math.random() * 6 }); return b;
    },
    /* SQUEEZE: a low tunnel of fibers. Duck (down arrow or S) and crawl through. */
    squeeze: function (dx, len) {
      const x0 = b.x + dx, x1 = x0 + (len || 4); addSolid(x0, x1, b.y + 1.05, b.y + 7.2); L.group.add(box(x0, x1, b.y + 1.05, b.y + 7.2, 1.6, L.th.top));
      for (let i = 0; i < 5; i++) { const f = new T.Mesh(G.cyl, emat('#c59cff', '#3a1a6a')); f.scale.set(0.07, (len || 4) / 2, 0.07); f.rotation.z = Math.PI / 2; f.position.set((x0 + x1) / 2, b.y + 1.12, -1.6 + i * 0.8); L.group.add(f); }
      return b;
    },
    /* SPIKES: toxin crystals on the ground. Touching them costs energy. */
    spikes: function (dx, w) {
      const x0 = b.x + dx, n = Math.max(2, Math.round(w / 0.55)), inst = new T.InstancedMesh(G.cone, emat('#c77dff', '#4a1a7a'), n), m4 = new T.Matrix4();
      for (let i = 0; i < n; i++) { m4.makeScale(0.22, 0.3, 0.22); m4.setPosition(x0 + (i + 0.5) * w / n, b.y + 0.3, (i % 2) * 0.6 - 0.3); inst.setMatrixAt(i, m4); }
      L.group.add(inst); const gl = glow('#c77dff', w + 1, 0.25); gl.scale.set(w + 1, 1.2, 1); gl.position.set(x0 + w / 2, b.y + 0.3, 0.5); L.group.add(gl);
      L.spikes.push({ x0: x0, x1: x0 + w, y: b.y }); return b;
    },
    shield: function (dx, dy) { addPickup('shield', b.x + dx, b.y + dy); return b; },
    /* ? BLOCK: bump it from below to get a reward: sparks, boost, shield, or life */
    qblock: function (dx, dy, reward) {
      const x0 = b.x + dx - 0.6, y0 = b.y + dy, s = addSolid(x0, x0 + 1.2, y0, y0 + 1.2);
      const m = new T.Mesh(G.box, emat('#ffd166', '#7a5a10')); m.scale.set(1.2, 1.2, 1.2); m.position.set(x0 + 0.6, y0 + 0.6, 0); L.group.add(m);
      const q = label('?', 1.15, { big: true, bg: '#ffd166', fg: '#10202c', bd: '#7a5a10' }); q.position.set(x0 + 0.6, y0 + 0.6, 0.75); L.group.add(q);
      const gl = glow('#ffd166', 2.6, 0.35); gl.position.copy(m.position); L.group.add(gl);
      s.qb = { m: m, q: q, gl: gl, reward: reward || 'sparks', used: false, x: x0 + 0.6, y: y0 + 1.2 }; return b;
    },
    /* RARE SPECIMEN: one hidden bonus per level, usually somewhere only a double jump can reach. */
    rare: function (dx, dy) {
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#ffd700', '#8a6a00')); core.scale.setScalar(0.45); g.add(core); g.add(glow('#ffd700', 4, 0.8));
      g.position.set(b.x + dx, b.y + dy, 0); L.group.add(g); L.rare = { x: b.x + dx, y: b.y + dy, m: g, got: false }; return b;
    },
    /* a trail of sparks along a jump arc: shows the player where to jump */
    arc: function (dx, len, h) {
      for (let i = 0; i <= 6; i++) { const f = i / 6, m = new T.Mesh(G.oct, emat('#ffd166', '#b07a10')); m.scale.setScalar(0.26); m.add(glow('#ffd166', 5, 0.55)); m.position.set(b.x + dx + f * len, b.y + 1.2 + h * 4 * f * (1 - f), 0); L.group.add(m); L.sparks.push({ x: m.position.x, y: m.position.y, m: m }); }
      return b;
    },
    boost: function (dx, dy) { addPickup('boost', b.x + dx, b.y + dy); return b; },
    balance: function (id) { const bl = (D.balances || []).find(function (e) { return e.id === id; }); if (bl) makeBalance(bl); return b; },
    hunt: function (id) { const set = (D.tokens || []).find(function (e) { return e.id === id; }); if (set) makeHunt(set); return b; },
    catchGame: function (id) { const c = (D.catches || []).find(function (e) { return e.id === id; }); if (c) makeCatch(c); return b; },
    lablock: function (id) {
      const lk = (D.lablocks || []).find(function (e) { return e.id === id; }); if (!lk) return b;
      makeStation(lk.clues.map(function (_, i) { return QMAP[lk.id + '.' + i]; }), { title: 'Lab Lock', labels: ['1', '2', '3', '4', '5'], flat: true, lock: lk }); return b;
    },
    boss: function (name, tag, n, mixN, codes) {
      const pool = Object.keys(QMAP).map(function (k) { return QMAP[k]; }).filter(function (q) { return q.world === L.world.id && q.tags && q.tags.indexOf(tag) >= 0; });
      const missed = shuffle(pool.filter(function (q) { return S.missed[q.id]; })), rest = shuffle(pool.filter(function (q) { return !S.missed[q.id]; }));
      const qs = missed.concat(rest).slice(0, n - (mixN || 0)); qs.forEach(function (q) { L.used[q.id] = 1; });
      const pr = mixN >= 2 ? pickPair() : null, extra = mixN ? mixPick(mixN - (pr ? 2 : 0), codes) : [];
      /* shuffle, but keep a look-alike pair back to back */
      const blocks = shuffle(qs.concat(extra).map(function (q) { return [q]; }).concat(pr ? [pr.qs] : []));
      const all = [].concat.apply([], blocks); if (all.length) makeStation(all, { boss: name, pair: pr }); return b;
    },
    goal: function () {
      addGround(b.x, b.x + 10, b.y);
      const g = new T.Group(), hull = mesh('sph', '#cfd8e3'); hull.scale.set(1.7, 0.45, 1.7); g.add(hull); g.add(glow(L.th.rim, 7, 0.6));
      const beam = new T.Mesh(G.cyl, basic(L.th.rim, 0.12, true)); beam.scale.set(1.3, 40, 1.3); beam.position.y = 20; g.add(beam);
      const dome = mesh('sph', '#7fd4ff', 0.7); dome.scale.set(0.8, 0.6, 0.8); dome.position.y = 0.35; g.add(dome);
      g.position.set(b.x + 6, b.y + 1.6, 0); L.group.add(g); L.goal = { x: b.x + 6, y: b.y, m: g };
      const sp = label('Scout pod: send report', 4.4); sp.position.set(b.x + 6, b.y + 4.4, 0); L.group.add(sp);
      b.x += 10; return b;
    }
  };
  function mixPick(n, codes) {
    const pool = shuffle(Object.keys(QMAP).map(function (k) { return QMAP[k]; }).filter(function (q) { return q.world === L.world.id && codes.indexOf(q.code) >= 0 && !L.used[q.id] && !(q.tags && q.tags.length); }));
    const rank = function (q) { return S.missed[q.id] ? 0 : S.seen[q.id] ? 1 : 2; };
    pool.sort(function (a, c) { return rank(a) - rank(c) || (S.seen[a.id] || 0) - (S.seen[c.id] || 0); });
    const qs = pool.slice(0, n); qs.forEach(function (q) { L.used[q.id] = 1; }); return qs;
  }
  /* Look-alike pair: only pairs whose BOTH halves come from levels the student has finished.
     A group of three rotates: the two halves seen longest ago are chosen. */
  function pickPair() {
    const pairs = ((BQ.data[L.world.id] || {}).pairs || []).filter(function (p) { return p.members.every(function (m) { return m.level !== L.lv.id && played(m.level); }); });
    const avail = function (m) { return m.ids.filter(function (id) { return QMAP[id] && !L.used[id]; }); };
    const age = function (id) { return S.missed[id] ? -1 : (S.seen[id] || 0); };
    const best = function (ids) { return shuffle(ids).sort(function (a, c) { return age(a) - age(c); })[0]; };
    const cands = [];
    pairs.forEach(function (p) {
      for (let a = 0; a < p.members.length; a++) for (let c = a + 1; c < p.members.length; c++) {
        const A = avail(p.members[a]), C = avail(p.members[c]); if (!A.length || !C.length) continue;
        const qa = best(A), qc = best(C); cands.push({ p: p, ids: Math.random() < 0.5 ? [qa, qc] : [qc, qa], s: Math.min(age(qa), age(qc)), r: Math.random() });
      }
    });
    if (!cands.length) return null;
    cands.sort(function (x, y) { return x.s - y.s || x.r - y.r; });
    const c = cands[0]; c.ids.forEach(function (id) { L.used[id] = 1; });
    return { qs: c.ids.map(function (id) { return QMAP[id]; }), name: c.p.name, explain: c.p.explain };
  }
  function makeStation(qs, o) {
    const n = o.labels ? o.labels.length : Math.max.apply(null, qs.map(function (q) { return q.options.length; }));
    const x0 = b.x, wx = o.chart ? x0 + 5 + n * 3.6 + 0.4 : x0 + 7; addGround(x0, wx + 7, b.y);
    const st = { x0: o.chart ? x0 + 4 : wx - 2.2, x1: wx, y: b.y, pads: [], queue: qs, qi: 0, done: false, title: o.title || '', boss: null, tried: {},
      pair: o.pair || null, chart: !!o.chart, lock: o.lock || null, fixedLabels: !!o.labels };
    for (let i = 0; o.chart && i < n; i++) {
      const px = x0 + 5 + i * 3.6, top = b.y + 1.8;
      const s = addSolid(px, px + 2.7, top - 1, top, { oneWay: true });
      const m = box(px, px + 2.7, top - 1, top, 3, '#3d8bd4'); m.material = emat('#3d8bd4', '#0f3a66'); L.group.add(m);
      const pg = glow('#7fc4ff', 4.5, 0.3); pg.position.set(px + 1.35, top - 0.3, 0); L.group.add(pg);
      const txt = o.labels ? o.labels[i] : String.fromCharCode(65 + i), lb = label(txt, o.labels ? 2.6 : 1.9, { big: txt.length <= 2 }); lb.position.set(px + 1.35, top - 0.52, 1.6); L.group.add(lb);
      st.pads.push({ s: s, m: m, lb: lb, i: i });
    }
    st.wall = addSolid(wx, wx + 1.2, b.y, b.y + 18); st.wallMesh = gate(wx, wx + 1.2, b.y, b.y + 18); L.group.add(st.wallMesh);
    if (o.chart) {
      const left = x0 + 3.2, W = wx - left, H = W * 420 / 1024, m = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: chartTex(o.chart, left, W, x0 + 6.35), transparent: true, fog: false, depthWrite: false }));
      m.scale.set(W, H, 1); m.position.set(left + W / 2, b.y + 3.4 + H / 2, -1.7); L.group.add(m);
    }
    if (o.lock) { st.lockLabel = label('Code: _ _ _', 4.6, { bd: '#c8ff7a' }); st.lockLabel.position.set(wx + 0.6, b.y + 8.8, 3); L.group.add(st.lockLabel); st.wallMesh.children.forEach(function (c) { c.material = basic('#c8ff7a', 0.2, true); }); }
    if (o.boss) {
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#3b1030', '#30060f')); core.scale.setScalar(1.9); g.add(core); g.add(glow('#ff4d6d', 11, 0.55));
      [-0.6, 0.6].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.32); e.position.set(ex, 0.4, 1.6); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.15); p.position.set(ex, 0.4, 1.86); g.add(p); });
      g.position.set(wx + 3.6, b.y + 6, 0); L.group.add(g); st.boss = { name: o.boss, m: g, hp: qs.length, max: qs.length, y: b.y + 6 };
    }
    L.stations.push(st); L.total += qs.length; b.x = wx + 7; L.cps.push({ x: wx + 3.5, y: b.y });
  }
  /* BECOME IT: a membrane with three openings at three heights. Stand at an opening and press E to go through. */
  function makeBecome(it) {
    const x0 = b.x, y = b.y, wx = x0 + 17, end = x0 + 31;
    addGround(x0, end, y);
    const op = [[0, 2.3], [2.7, 4.9], [5.3, 7.5]].map(function (o) { return [y + o[0], y + o[1]]; });
    [[y + 2.3, y + 2.7], [y + 4.9, y + 5.3], [y + 7.5, y + 18]].forEach(function (g) { addSolid(wx, wx + 1.4, g[0], g[1]); L.group.add(bilayer(wx, wx + 1.4, g[0], g[1])); });
    [[wx - 6.5, y + 2.7], [wx - 4, y + 5.3]].forEach(function (p) { const sl = addSolid(p[0], wx, p[1] - 0.4, p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
    const KC = { lipid: '#f2c078', protein: '#c59cff', pump: '#ff9f6e', flow: '#7fd4ff', organelle: '#ffd166', vesicle: '#7be0ad' };
    const doors = shuffle(it.doors).map(function (d, i) {
      const o = op[i], sd = addSolid(wx, wx + 1.4, o[0], o[1]), g = new T.Group(), mid = (o[0] + o[1]) / 2;
      const plate = new T.Mesh(G.box, basic(KC[d.kind] || '#7fd4ff', 0.3, true)); plate.scale.set(1.4, o[1] - o[0], 4.6); plate.position.set(wx + 0.7, mid, 0); g.add(plate);
      if (d.kind === 'protein') [o[0] + 0.25, o[1] - 0.25].forEach(function (yy) { const c = new T.Mesh(G.cyl, emat('#c59cff', '#4a2a7a')); c.scale.set(0.35, 1.6, 0.35); c.rotation.z = Math.PI / 2; c.position.set(wx + 0.7, yy, 1.6); g.add(c); });
      if (d.kind === 'pump') { const t = new T.Mesh(G.tor, emat('#ff9f6e', '#7a3a10')); t.scale.setScalar(0.62); t.position.set(wx + 0.7, mid, 1.8); g.add(t); L.spin.push(t); }
      const lb = label(d.label, 3.2, { bd: KC[d.kind] || '#7fd4ff' }); lb.position.set(wx - 1.9, mid + 0.2, -0.9); g.add(lb);
      L.group.add(g); return { d: d, s: sd, g: g, plate: plate, cool: 0, kc: KC[d.kind] || '#7fd4ff' };
    });
    for (let i = doors.length; i < 3; i++) { addSolid(wx, wx + 1.4, op[i][0], op[i][1]); L.group.add(bilayer(wx, wx + 1.4, op[i][0], op[i][1])); }
    if (it.hereCrowd != null) {
    crowd(x0 + 1, wx - 0.4, y, it.hereCrowd * 3, it.dotColor || it.color);
    crowd(wx + 1.8, end - 1, y, it.thereCrowd * 3, it.dotColor || it.color);
    const more = it.hereCrowd > it.thereCrowd;
    const s1 = label(it.here + ': ' + (more ? 'more' : 'less') + ' ' + it.what, 6, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); s1.position.set(x0 + 7, y + 7.3, -1.5); L.group.add(s1);
    const s2 = label(it.there + ': ' + (more ? 'less' : 'more') + ' ' + it.what, 6, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); s2.position.set(wx + 7.5, y + 7.3, -1.5); L.group.add(s2);
    }
    if (it.atp) {
      const orb = new T.Group(), core = new T.Mesh(G.sph, emat('#c8ff7a', '#5a8a20')); core.scale.setScalar(0.35); orb.add(core); orb.add(glow('#c8ff7a', 2.4, 0.7));
      const ol = label('ATP', 1.4); ol.position.y = 0.85; orb.add(ol); orb.position.set(wx - 5.6, y + 3.5, 0); L.group.add(orb); L.atps.push({ x: wx - 5.6, y: y + 3.5, m: orb, got: false });
    }
    const z = { kind: 'become', x0: x0 + 0.5, x1: wx + 1.4, done: false, errors: 0, doors: doors, it: it };
    L.zones.push(z); L.total++; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  /* CATCH: answers float and drift around an arena. Jump into the one that matches the highlighted cue;
     dodge the others. Each right catch joins the chain that trails behind the alien. */
  function makeCatch(c) {
    const x0 = b.x, y = b.y, wx = x0 + 32, end = wx + 6;
    addGround(x0, end, y);
    [[x0 + 7, 2.6, 4], [x0 + 15, 4.2, 4], [x0 + 23, 2.6, 4]].forEach(function (p) { const sl = addSolid(p[0], p[0] + p[2], y + p[1] - 0.4, y + p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
    const z = { kind: 'catch', x0: x0 + 0.5, x1: wx, done: false, errors: 0, stepErr: false, c: c, si: 0, toks: [], xa: x0 + 3, xb: wx - 2, y: y, time: 0,
      lanes: shuffle([orbit(x0 + 9, y + 4.4, 1.5, 5, 1), elev(x0 + 13, y + 2.2, y + 6.8, 6), ferry(y + 6.4, x0 + 12, x0 + 22, 7), orbit(x0 + 25, y + 4.4, 1.5, 5, -1), ferry(y + 2.4, x0 + 3, x0 + 30, 9), elev(x0 + 29.5, y + 2.2, y + 6.4, 5)]) };
    for (let i = 0; i < 6; i++) { const t = catchTok(z, i === 0 ? c.steps[0].need : null); t.lane = z.lanes[i]; z.toks.push(t); }
    /* calm and readable: two rows, evenly spaced, all bobbing up and down together (like the hunt) */
    z.toks.forEach(function (t, i) { t.hx = x0 + 4 + i * 5; t.hy = y + (i % 2 ? 5.2 : 2.4); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += c.steps.length; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  function catchTok(z, text) {
    const t = { g: new T.Group(), cool: 0 };
    t.gem = new T.Mesh(G.ico, emat('#ffffff', '#333333')); t.gem.scale.setScalar(0.36); t.g.add(t.gem);
    t.halo = glow('#ffffff', 3, 0.5); t.g.add(t.halo); t.lb = label('?', 1.5, { big: true }); t.lb.position.y = 0.75; t.lb.position.z = 0.4; t.g.add(t.lb);
    L.group.add(t.g); placeTok(z, t, text); return t;
  }
  /* BALANCE: a body measurement drifts away from normal; the player presses switches (E) for the body's
     responses to bring it back. Elevator: the platform height is the measurement. Boss: the boss keeps pushing it. */
  function makeBalance(bl) {
    const x0 = b.x, y = b.y, boss = bl.kind === 'boss', wx = x0 + (boss ? 28 : 20), end = wx + 6;
    addGround(x0, end, y);
    const z = { kind: 'balance', bl: bl, x0: x0 + 0.5, x1: wx, y: y, done: false, v: bl.start, hold: 0, hp: bl.hp || 1, phase: 1, hurtT: 0, evT: 0, push: [], levers: [], danger: false, wrong: 0 };
    const lever = function (c, lx, ly, parent) {
      const g = new T.Group(), post = mesh('cyl', '#d6e4ea'); post.scale.set(0.08, 1.2, 0.08); post.position.y = 0.6; g.add(post);
      const up = c.delta > 0, knob = new T.Mesh(G.sph, emat(up ? '#ff9f6e' : '#7fd4ff', up ? '#7a3a10' : '#1a4a7a')); knob.scale.setScalar(0.3); knob.position.y = 1.3; g.add(knob); g.add(glow(up ? '#ff9f6e' : '#7fd4ff', 2.2, 0.5));
      const lb = label(c.label, 3, { bd: up ? '#ff9f6e' : '#7fd4ff' }); lb.position.y = 2.4; g.add(lb); g.position.set(lx, ly, 0.4); (parent || L.group).add(g);
      z.levers.push({ c: c, g: g, knob: knob, lx: lx, ly: ly, parent: parent || null, cool: 0 });
    };
    if (!boss) {
      const ex0 = x0 + 6, ex1 = x0 + 13, s0 = addSolid(ex0, ex1, y - 0.5, y, { oneWay: true }), grp = new T.Group(), body = box(ex0, ex1, y - 0.5, y, 3, '#7be0ad'); body.material = emat('#4fae86', '#1a4a3a');
      grp.add(body); const gl = glow('#7be0ad', 7, 0.3); gl.position.set((ex0 + ex1) / 2, y - 0.6, 0); grp.add(gl); L.group.add(grp);
      z.elev = { s: s0, g: grp, base: y };
      lever(bl.controls[0], ex0 + 1.4, y, grp); lever(bl.controls[1], ex1 - 1.4, y, grp);
      const toH = function (v) { return (v - bl.min) / (bl.max - bl.min) * 8.4; };
      const band = new T.Mesh(G.box, basic('#7be0ad', 0.12, true)); band.scale.set(wx - x0 - 2, toH(bl.band[1]) - toH(bl.band[0]), 0.2); band.position.set((x0 + wx) / 2, y + (toH(bl.band[0]) + toH(bl.band[1])) / 2, -2.6); L.group.add(band);
      const bl2 = label('Normal range', 3, { bd: '#7be0ad' }); bl2.position.set(x0 + 2.5, y + (toH(bl.band[0]) + toH(bl.band[1])) / 2, -2.4); L.group.add(bl2);
      z.toH = toH;
    } else {
      [[x0 + 8, 2.8, 4], [x0 + 15, 5, 4], [x0 + 21, 2.8, 4]].forEach(function (p) { const sl = addSolid(p[0], p[0] + p[2], y + p[1] - 0.4, y + p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
      lever(bl.controls[0], x0 + 4, y); lever(bl.controls[1], x0 + 10, y + 2.8); lever(bl.controls[2], x0 + 17, y + 5); lever(bl.controls[3], x0 + 23, y + 2.8);
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#3b1030', '#30060f')); core.scale.setScalar(1.9); g.add(core); z.aura = glow('#ff4d6d', 12, 0.6); g.add(z.aura);
      [-0.6, 0.6].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.32); e.position.set(ex, 0.4, 1.6); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.15); p.position.set(ex, 0.4, 1.86); g.add(p); });
      g.position.set(x0 + 14, y + 8.3, -2.5); L.group.add(g); z.bossM = g;
    }
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += boss ? z.hp : 1; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  /* HUNT: find every real answer floating around a wide arena. Decoys drift too; touching one costs
     a life and points, and explains why it is a decoy. */
  function makeHunt(set) {
    const x0 = b.x, y = b.y, wx = x0 + 44, end = wx + 6;
    addGround(x0, end, y);
    [[x0 + 6, 2.6, 4], [x0 + 13, 4.6, 4], [x0 + 20, 2.6, 4], [x0 + 27, 4.6, 4], [x0 + 34, 2.6, 4], [x0 + 16, 7, 5]].forEach(function (p) { const sl = addSolid(p[0], p[0] + p[2], y + p[1] - 0.4, y + p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
    const z = { kind: 'hunt', x0: x0 + 0.5, x1: wx, done: false, set: set, found: 0, need: set.good.length, errors: 0, toks: [], xa: x0 + 3, xb: wx - 2, y: y, time: 0,
      lanes: shuffle([orbit(x0 + 8, y + 4.4, 1.5, 6, 1), orbit(x0 + 15, y + 6.4, 1.5, 5, -1), orbit(x0 + 22, y + 4.4, 1.5, 7, 1), orbit(x0 + 29, y + 6.4, 1.5, 6, -1),
        orbit(x0 + 36, y + 4.4, 1.5, 5, 1), orbit(x0 + 18.5, y + 8.8, 1.6, 7, -1), ferry(y + 2.4, x0 + 3, x0 + 40, 11), ferry(y + 5.6, x0 + 10, x0 + 33, 9),
        ferry(y + 3.6, x0 + 24, x0 + 42, 7), elev(x0 + 11, y + 2.2, y + 7.4, 6), elev(x0 + 32, y + 2.2, y + 7, 5)]) };
    set.good.forEach(function (t) { z.toks.push(huntTok(z, t, true, null)); });
    set.bad.forEach(function (t) { z.toks.push(huntTok(z, t.text, false, t.explain)); });
    /* calm and readable: two rows, evenly spaced, all bobbing up and down together */
    z.toks = shuffle(z.toks); const gap = (wx - x0 - 7) / Math.max(1, z.toks.length - 1);
    z.toks.forEach(function (t, i) { t.hx = x0 + 3.5 + i * gap; t.hy = y + (i % 2 ? 5.2 : 2.4); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += set.good.length; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  function huntTok(z, text, good, why) {
    const t = { g: new T.Group(), text: text, good: good, why: why, cool: 0, got: false };
    t.gem = new T.Mesh(G.ico, emat('#bfe9ff', '#3a7090')); t.gem.scale.setScalar(0.34); t.g.add(t.gem); t.g.add(glow('#9fe0ff', 2.6, 0.45));
    const lb = label(text, 3.3); lb.position.set(0, 1.1, 1.9); t.g.add(lb); L.group.add(t.g); huntPlace(z, t); return t;
  }
  /* MAZE: a row of walls, each with three doorways at three heights. Only the doorway with the
     correct next step opens; the others are dead ends. */
  function makeMaze(mz) {
    const x0 = b.x, y = b.y, n = mz.steps.length, room = 12.4, first = x0 + 11, end = first + (n - 1) * room + 7;
    addGround(x0, end, y);
    const op = [[0, 2.3], [2.7, 4.9], [5.3, 7.5]].map(function (o) { return [y + o[0], y + o[1]]; });
    const labels = mz.steps.map(function (st) { return st.label; }).concat(mz.extra || []);
    const z = { kind: 'maze', x0: x0 + 0.5, x1: first + (n - 1) * room + 1.4, done: false, errors: 0, err: false, si: 0, mz: mz, walls: [] };
    const st0 = label('Start: ' + mz.start, 4.4, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); st0.position.set(x0 + 4, y + 3.4, -1.5); L.group.add(st0);
    mz.steps.forEach(function (st, k) {
      const wx = first + k * room;
      [[y + 2.3, y + 2.7], [y + 4.9, y + 5.3], [y + 7.5, y + 18]].forEach(function (g) { addSolid(wx, wx + 1.4, g[0], g[1]); L.group.add(box(wx, wx + 1.4, g[0], g[1], 4.6, L.th.top)); });
      [[wx - 6.5, y + 2.7], [wx - 4, y + 5.3]].forEach(function (p) { const sl = addSolid(p[0], wx, p[1] - 0.4, p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
      const pool = shuffle(labels.filter(function (l) { return l !== st.label; })).slice(0, 2);
      const doors = shuffle([{ label: st.label, ok: true }].concat(pool.map(function (l) { return { label: l, ok: false }; }))).map(function (d, i) {
        const o = op[i], sd = addSolid(wx, wx + 1.4, o[0], o[1]), g = new T.Group(), mid = (o[0] + o[1]) / 2;
        const plate = new T.Mesh(G.box, basic('#9fe0ff', 0.3, true)); plate.scale.set(1.4, o[1] - o[0], 4.6); plate.position.set(wx + 0.7, mid, 0); g.add(plate);
        const lb = label(d.label, 3.2, { bd: '#9fe0ff' }); lb.position.set(wx - 1.9, mid + 0.2, -0.9); g.add(lb);
        L.group.add(g); return { d: d, s: sd, g: g, plate: plate, cool: 0 };
      });
      z.walls.push(doors);
    });
    L.zones.push(z); L.total += n; b.x = end; L.cps.push({ x: end - 3, y: y });
  }
  /* SEQUENCE: steps float in mixed-up order. Stand at a step and press E to pick it next. */
  function makeSequence(sq) {
    const x0 = b.x, y = b.y, n = sq.steps.length, order = shuffle(sq.steps.map(function (_, i) { return i; })), wx = x0 + 8 + n * 4.6, end = wx + 5;
    addGround(x0, end, y);
    const z = { kind: 'sequence', x0: x0 + 0.5, x1: wx, done: false, errors: 0, next: 0, sq: sq, toks: [] };
    order.forEach(function (si, k) { z.toks.push(token(x0 + 7 + k * 4.6, y + (k % 2 ? 3.2 : 1.3), sq.steps[si], '#ffd98a', { si: si })); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total++; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  /* WORD BANK: words float above the path. Stand at a word and press E to fill the blank. */
  function makeWordbank(wb) {
    const x0 = b.x, y = b.y, words = shuffle(wb.words), wx = x0 + 8 + words.length * 3.8, end = wx + 5;
    addGround(x0, end, y);
    const z = { kind: 'wordbank', x0: x0 + 0.5, x1: wx, done: false, si: 0, err: false, wb: wb, toks: [] };
    words.forEach(function (w, k) { z.toks.push(token(x0 + 7 + k * 3.8, y + (k % 2 ? 3.2 : 1.3), w, '#9fe0ff', { word: w }, 3.4)); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += wb.sentences.length; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  function token(x, y, text, col, extra, w) {
    if (y - b.y > 2) { const sl = addSolid(x - 1.2, x + 1.2, y - 1.1, y - 0.7, { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); }
    const g = new T.Group(), gem = new T.Mesh(G.ico, emat(col, '#3a4a5a')); gem.scale.setScalar(0.38); g.add(gem); g.add(glow(col, 2.4, 0.4));
    const lb = label(text, w || 4.2); lb.position.y = 1.35; g.add(lb); g.position.set(x, y, 0); L.group.add(g);
    return Object.assign({ x: x, y: y, g: g, gem: gem, got: false }, extra);
  }
  function crowd(xa, xb, y, n, col) {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = rnd(xa, xb); pos[i * 3 + 1] = y + rnd(0.4, 9.5); pos[i * 3 + 2] = rnd(-4.5, -1.8); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    L.group.add(new T.Points(geo, new T.PointsMaterial({ size: 0.55, map: FX.glow, color: col, transparent: true, blending: T.AdditiveBlending, depthWrite: false })));
  }
  return b;
}
function bilayer(x0, x1, y0, y1) {
  const g = new T.Group(), core = new T.Mesh(G.box, emat('#b8823e', '#3a2410')); core.scale.set(x1 - x0, y1 - y0, 5); core.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(core);
  /* phospholipid pattern painted on one flat face: two rows of heads with tails between (cheap to draw) */
  if (!FX.lipid) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 64; const k = c.getContext('2d');
    k.fillStyle = '#9a6a30'; k.fillRect(0, 0, 128, 64); k.strokeStyle = '#e8b878'; k.lineWidth = 4;
    [16, 48].forEach(function (y) { k.beginPath(); k.moveTo(24, y - 5); k.lineTo(62, y - 5); k.moveTo(24, y + 5); k.lineTo(62, y + 5); k.moveTo(66, y - 5); k.lineTo(104, y - 5); k.moveTo(66, y + 5); k.lineTo(104, y + 5); k.stroke();
      k.fillStyle = '#f6cf8a'; [14, 114].forEach(function (x) { k.beginPath(); k.arc(x, y, 13, 0, Math.PI * 2); k.fill(); }); });
    FX.lipid = c;
  }
  const t = new T.CanvasTexture(FX.lipid); t.wrapT = T.RepeatWrapping; t.repeat.set(1, Math.max(1, (y1 - y0) / 0.9));
  const face = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: t })); face.scale.set(x1 - x0, y1 - y0, 1); face.position.set((x0 + x1) / 2, (y0 + y1) / 2, 2.51); g.add(face);
  return g;
}
function chartTex(gd, left, W, firstCenter) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 420; const g = c.getContext('2d');
  const px = function (xw) { return (xw - left) / W * 1024; }, v = gd.values, lim = Math.ceil(Math.max.apply(null, v.map(Math.abs)) / 10) * 10;
  const top = 74, bot = 340, py = function (y) { return top + (lim - y) / (2 * lim) * (bot - top); };
  g.fillStyle = 'rgba(8,20,30,0.86)'; g.beginPath(); g.moveTo(20, 4); g.arcTo(1020, 4, 1020, 416, 18); g.arcTo(1020, 416, 4, 416, 18); g.arcTo(4, 416, 4, 4, 18); g.arcTo(4, 4, 1020, 4, 18); g.closePath(); g.fill();
  g.strokeStyle = '#ffd166'; g.lineWidth = 4; g.stroke();
  g.fillStyle = '#ffffff'; g.font = '700 34px "Atkinson Hyperlegible", Arial, sans-serif'; g.textAlign = 'center'; g.fillText(gd.title, 512, 44);
  g.font = '700 22px "Atkinson Hyperlegible", Arial, sans-serif'; g.textAlign = 'right';
  [-lim, -lim / 2, 0, lim / 2, lim].forEach(function (y) { g.strokeStyle = y === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)'; g.lineWidth = y === 0 ? 3 : 2; g.beginPath(); g.moveTo(px(left + 1.7), py(y)); g.lineTo(1000, py(y)); g.stroke(); g.fillStyle = '#d6e4ea'; g.fillText((y > 0 ? '+' : '') + y, px(left + 1.55), py(y) + 8); });
  v.forEach(function (y, i) {
    const cx = px(firstCenter + i * 3.6), bw = 2.0 / W * 1024, t = Math.min(py(y), py(0)), h = Math.abs(py(y) - py(0));
    g.fillStyle = y >= 0 ? '#7fd4ff' : '#ffb09c'; g.fillRect(cx - bw / 2, t, bw, h);
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.font = '700 28px "Atkinson Hyperlegible", Arial, sans-serif';
    g.fillText((y > 0 ? '+' : '') + y + '%', cx, y >= 0 ? t - 10 : t + h + 30);
    g.fillStyle = '#ffd166'; g.font = '700 26px "Atkinson Hyperlegible", Arial, sans-serif'; g.fillText(gd.categories[i], cx, 378);
  });
  g.save(); g.translate(26, (top + bot) / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.font = '700 20px "Atkinson Hyperlegible", Arial, sans-serif'; g.fillStyle = '#d6e4ea'; g.fillText(gd.ylabel, 0, 0); g.restore();
  g.textAlign = 'center'; g.font = '700 22px "Atkinson Hyperlegible", Arial, sans-serif'; g.fillStyle = '#d6e4ea'; g.fillText(gd.xlabel, 512, 408);
  return new T.CanvasTexture(c);
}

/* ---------- activity zones: panel text and what happens each frame ---------- */
function zonePanel(meta, prompt, fig, how) {
  $('qpanel').classList.remove('compact', 'short');
  $('qmeta').textContent = meta; $('qprompt').innerHTML = prompt; $('qfig').innerHTML = fig || ''; $('qopts').innerHTML = ''; $('qfb').textContent = ''; $('qhow').textContent = how || '';
  $('qpanel').hidden = false; Music.setDuck(0.45);
}
function dotsTxt(n) { return '<span class="dots">' + '●'.repeat(Math.max(1, Math.round(n / 2))) + '</span>'; }
function showZone(z) {
  if (z.kind === 'become') {
    const it = z.it, more = it.hereCrowd > it.thereCrowd;
    zonePanel('Become It', 'You are ' + esc(it.you) + '. ' + esc(it.goal), it.hereCrowd == null ? '' :
      '<div class="crowd"><span>' + esc(it.here) + ': <b>' + (more ? 'more' : 'less') + ' crowded</b> with ' + esc(it.what) + ' ' + dotsTxt(it.hereCrowd) + '</span><span>' + esc(it.there) + ': <b>' + (more ? 'less' : 'more') + ' crowded</b> ' + dotsTxt(it.thereCrowd) + '</span></div>',
      (it.hereCrowd == null ? 'Walk up to a doorway and press E.' : 'Pick an opening in the membrane and press E.') + (it.atp ? ' Glowing ATP powers a pump.' : ''));
    setBadge(it.short, it.color);
  } else if (z.kind === 'catch') {
    const c = z.c, cue = c.steps.map(function (st, i) { return i === z.si ? '<b class="cur">' + esc(st.cue) + '</b>' : '<span class="' + (i < z.si ? 'done' : 'todo') + '">' + esc(st.cue) + '</span>'; }).join(' ');
    const built = c.steps.filter(function (st) { return (st.bead != null ? st.bead : st.need) !== ''; }).map(function (st, i) { return i < z.si ? esc(st.bead != null ? st.bead : st.need) : '<span class="todo">_</span>'; }).join(c.sep || ' ');
    zonePanel('Build It: ' + c.short, esc(c.title),
      '<div class="strand"><span>' + esc(c.cueLabel) + ':</span> ' + cue + '</div><div class="strand"><span>' + esc(c.builtLabel) + ':</span> ' + built + '</div>' +
      (c.table ? figHTML({ type: 'table', head: c.table.head, rows: c.table.rows }) : '<div class="rule">' + esc(c.rule) + '</div>'),
      'Jump up to the ' + c.tokenWord + ' that matches the highlighted ' + c.cueWord + ' and press E to grab it.');
  } else if (z.kind === 'balance') {
    const bl = z.bl, pct = function (v) { return (v - bl.min) / (bl.max - bl.min) * 100; };
    if (!z.done && z.left) { z.v = bl.start; z.hold = 0; z.push = []; } z.left = false;
    zonePanel(bl.kind === 'boss' ? 'Boss: ' + bl.name : 'Balance It', esc(bl.title),
      '<div class="gauge"><div class="band" style="left:' + pct(bl.band[0]) + '%;width:' + (pct(bl.band[1]) - pct(bl.band[0])) + '%"></div><div class="mark" id="gmark"></div></div>' +
      '<div class="strand"><span>' + esc(bl.what) + ':</span> <b id="gval"></b> ' + esc(bl.unit) + ' · normal ' + bl.band[0] + ' to ' + bl.band[1] + '</div>' +
      '<div class="strand"><span>' + (bl.kind === 'boss' ? 'Hold it normal to weaken the boss:' : 'Hold it normal:') + '</span> <b id="ghold"></b>' + (bl.kind === 'boss' ? ' · Boss <b id="ghp"></b>' : '') + '</div>',
      'Walk to a switch and press E. Orange switches raise it; blue switches lower it.');
  } else if (z.kind === 'hunt') {
    zonePanel('Specimen Hunt', esc(z.set.prompt) + '.',
      '<div class="strand"><span>Found:</span> <b>' + z.found + ' of ' + z.need + '</b> ' + '●'.repeat(z.found) + '○'.repeat(z.need - z.found) + '</div><div class="rule">Decoys are mixed in. Choosing one costs 25 points.</div>',
      'Jump up to an item so it glows, then press E to grab it. The gate opens when you have them all.');
  } else if (z.kind === 'maze') {
    const mz = z.mz, path = [esc(mz.start)].concat(mz.steps.map(function (st, i) { return i < z.si ? esc(st.label) : '<span class="todo">?</span>'; })).join(' → ');
    if (!z.started) { z.started = true; clearTrail(); addBead(mz.start, '#9fe0ff'); }
    zonePanel('Maze', esc(mz.title), '<div class="strand"><span>Your path:</span> ' + path + '</div><div class="rule">Only the doorway with the next level opens. The others are dead ends (25 points).</div>',
      'Walk or jump to a doorway and press E to go through.');
  } else if (z.kind === 'sequence') {
    zonePanel('Sequence', esc(z.sq.title), '<ol class="slots">' + z.sq.steps.map(function (st, i) { return '<li>' + (i < z.next ? '✓ ' + esc(st) : '<span class="blank">?</span>') + '</li>'; }).join('') + '</ol>',
      'Stand at the step that comes next and press E.');
  } else if (z.kind === 'wordbank') {
    const wb = z.wb, done = wb.sentences.slice(0, z.si).map(function (x) { return '<li>✓ ' + esc(x.text.replace('___', x.answer)) + '</li>'; }).join('');
    const cur = z.si < wb.sentences.length ? '<li><b>' + esc(wb.sentences[z.si].text).replace('___', '<span class="blank">______</span>') + '</b></li>' : '';
    zonePanel('Word Bank: sentence ' + Math.min(z.si + 1, wb.sentences.length) + ' of ' + wb.sentences.length, 'Fill in the blank.', '<ul class="slots">' + done + cur + '</ul>', 'Stand at the word that fits and press E.');
  }
}
function linkLine(a, c) {
  const dx = c.x - a.x, dy = c.y - a.y, len = Math.sqrt(dx * dx + dy * dy), m = new T.Mesh(G.box, basic('#7be0ad', 0.7, true));
  m.scale.set(len, 0.12, 0.12); m.position.set((a.x + c.x) / 2, (a.y + c.y) / 2, -0.2); m.rotation.z = Math.atan2(dy, dx); L.group.add(m); burst(c.x, c.y, '#7be0ad');
}
function setBadge(text, col) {
  if (P.badge) { P.m.remove(P.badge); P.badge = null; }
  if (!text) return;
  P.badge = label(text, 1.7, { bd: col }); P.badge.position.y = 2.85; P.badge.add(glow(col, 1.6, 0.5)); P.m.add(P.badge);
}
function setATP(on) {
  P.atp = on;
  if (on && !P.atpM) { P.atpM = glow('#c8ff7a', 1.1, 0.95); P.m.add(P.atpM); }
  if (!on && P.atpM) { P.m.remove(P.atpM); P.atpM = null; }
}
const TOKCOL = { A: '#7fd4ff', U: '#ffd166', G: '#7be0ad', C: '#ffb09c', T: '#c59cff', Stop: '#ff6b6b', 'Release (stop)': '#ff6b6b' };
function placeTok(z, t, text) {
  const c = z.c; t.text = text || c.choices[Math.floor(Math.random() * c.choices.length)];
  const col = TOKCOL[t.text] || '#f2c078';
  t.gem.material = emat(col, '#3a3a3a'); t.halo.material.color.set(col);
  t.lb.material.map = labelTex(t.text, { big: t.text.length <= 3, bd: col }); t.lb.material.needsUpdate = true; t.lb.scale.set(t.text.length <= 3 ? 2.3 : 3.3, t.text.length <= 3 ? 1.15 : 1.65, 1);
  t.cool = 0.8;
}
/* Steady, repeating paths so players can learn the timing (no random drifting). */
function orbit(cx, cy, r, T, dir) { return { type: 'orbit', cx: cx, cy: cy, r: r, T: T, dir: dir }; }
function ferry(y, x1, x2, T) { return { type: 'ferry', y: y, x1: x1, x2: x2, T: T }; }
function elev(x, y1, y2, T) { return { type: 'elev', x: x, y1: y1, y2: y2, T: T }; }
function lanePos(l, t) {
  const a = Math.PI * 2 * t / l.T, s = (1 - Math.cos(a)) / 2;
  if (l.type === 'orbit') return { x: l.cx + Math.cos(a * l.dir) * l.r, y: l.cy + Math.sin(a * l.dir) * l.r };
  if (l.type === 'ferry') return { x: l.x1 + (l.x2 - l.x1) * s, y: l.y };
  return { x: l.x, y: l.y1 + (l.y2 - l.y1) * s };
}
function huntPlace(z, t) {
  t.cool = 1.2;
}
function ensureNeed(z) {
  if (z.si >= z.c.steps.length) return;
  const need = z.c.steps[z.si].need;
  if (z.toks.some(function (t) { return t.text === need; })) return;
  const far = z.toks.slice().sort(function (a, c) { return Math.abs(c.x - P.x) - Math.abs(a.x - P.x); })[0]; placeTok(z, far, need); far.cool = 0;
}
function addBead(text, col) {
  const g = new T.Group(), s = new T.Mesh(G.sph, emat(col, '#3a3a3a')); s.scale.setScalar(0.3); g.add(s); g.add(glow(col, 1.6, 0.5));
  const lb = label(text, text.length <= 3 ? 1.5 : 2.4, { big: text.length <= 3, bd: col }); lb.position.y = 0.6; g.add(lb); L.group.add(g); P.trail.push(g);
}
function clearTrail() { P.trail.forEach(function (g) { L.group.remove(g); }); P.trail = []; }
function near(t) { return Math.abs(P.x - t.x) < 0.9 && Math.abs(P.y + 0.7 - t.y) < 1.0; }
function zoneTick(z, dt) {
  if (z.kind === 'become') {
    z.doors.forEach(function (dr) {
      dr.cool -= dt; if (dr.open) return;
      dr.at = !z.done && P.x + HW >= dr.s.x0 - 0.12 && P.x < dr.s.x0 && P.y + PH > dr.s.y0 + 0.15 && P.y < dr.s.y1 - 0.15;
      dr.plate.material = basic(dr.tried ? '#5a6470' : dr.kc, dr.at ? 0.6 : 0.3, true);
      if (dr.at && L.zone === z && !$('qfb').textContent) $('qfb').textContent = 'Press E to go through: ' + dr.d.label;
    });
  } else if (z.kind === 'maze') {
    z.walls.forEach(function (ds, k) { ds.forEach(function (dr) {
      dr.cool -= dt; if (dr.open) return;
      dr.at = !z.done && k === z.si && P.x + HW >= dr.s.x0 - 0.12 && P.x < dr.s.x0 && P.y + PH > dr.s.y0 + 0.15 && P.y < dr.s.y1 - 0.15;
      dr.plate.material = basic(dr.tried ? '#5a6470' : '#9fe0ff', dr.at ? 0.6 : 0.3, true);
      if (dr.at && L.zone === z && !$('qfb').textContent) $('qfb').textContent = 'Press E to go through: ' + dr.d.label;
    }); });
  } else if (z.kind === 'balance') {
    z.levers.forEach(function (lv) { lv.cool -= dt; lv.knob.rotation.y += dt; });
    if (z.done) return;
    if (L.zone !== z) { z.left = true; return; }
    const bl = z.bl, boss = bl.kind === 'boss';
    if (boss) z.v += z.phase * bl.push * dt;
    else { z.v += bl.drift * dt; z.evT += dt; if (z.evT >= bl.event.every) { z.evT = 0; z.push.push({ d: bl.event.delta, t: 2 }); toast(bl.event.msg, 2.5); beep(500, 0.15, 'triangle', 'gulp, glucose rising'); } }
    z.push = z.push.filter(function (p) { const k = Math.min(dt, p.t); z.v += p.d * k / 2; p.t -= dt; return p.t > 0; });
    z.v = Math.max(bl.min, Math.min(bl.max, z.v));
    if (z.elev) { const ny = z.y + z.toH(z.v), dy = ny - z.elev.s.y1; z.elev.s.y0 += dy; z.elev.s.y1 += dy; z.elev.g.position.y += dy; if (P.ground === z.elev.s) P.y += dy; }
    if (boss) { z.aura.material.color.set(z.v > bl.set ? '#ff4d6d' : '#5fb8ff'); z.bossM.position.y = z.y + 8.3 + Math.sin(P.t * 2) * 0.4; z.bossM.rotation.y = Math.sin(P.t) * 0.4; }
    const inBand = z.v >= bl.band[0] && z.v <= bl.band[1];
    z.hold = inBand ? z.hold + dt : Math.max(0, z.hold - dt * 0.5);
    z.hurtT -= dt;
    if ((z.v > bl.danger[1] || z.v < bl.danger[0]) && z.hurtT <= 0) { z.hurtT = 2.5; z.danger = true; $('qfb').textContent = '✗ ' + (z.v > bl.danger[1] ? bl.tooHigh : bl.tooLow); hurt(true); }
    if (z.hold >= bl.hold) {
      z.hold = 0;
      if (boss) {
        z.hp--; L.score += 150; record({ id: bl.id + '.' + z.hp, code: bl.code }, !z.danger && !z.wrong); if (!z.danger && !z.wrong) { L.first++; L.streak++; }
        z.danger = false; z.wrong = 0; z.bossM.scale.setScalar(0.45 + 0.55 * z.hp / bl.hp); popup(z.bossM.position.x, z.bossM.position.y - 2, 'Balanced!', '#7be0ad'); burst(z.bossM.position.x, z.bossM.position.y, '#7be0ad'); beep(880, 0.25, 'sine', 'chime, balance restored');
        z.phase = -z.phase; toast(z.phase > 0 ? 'The Imbalance is heating the body up!' : 'The Imbalance is chilling the body!', 3);
      }
      if (!boss || z.hp <= 0) {
        z.done = true; z.gate.off = true; z.gateMesh.visible = false; if (z.bossM) z.bossM.visible = false;
        if (!boss) { record({ id: bl.id, code: bl.code }, !z.danger); if (!z.danger) { L.first++; L.streak++; } L.score += 200; }
        toast('✓ ' + bl.explain, 7); beep(990, 0.4, 'triangle', 'fanfare, balanced'); closeQ(); hud(); return;
      }
    }
    const gm = $('gmark'); if (gm) { gm.style.left = Math.max(0, Math.min(100, (z.v - bl.min) / (bl.max - bl.min) * 100)) + '%'; $('gval').textContent = boss ? z.v.toFixed(1) : Math.round(z.v); $('ghold').textContent = z.hold.toFixed(1) + ' of ' + bl.hold + ' s'; if ($('ghp')) $('ghp').textContent = '■'.repeat(z.hp) + '□'.repeat(bl.hp - z.hp); }
  } else if (z.kind === 'hunt') {
    if (z.done) return;
    z.time += dt;
    if (!z.started && L.zone === z) { z.started = true; if (z.set.clearTrail) clearTrail(); }
    z.toks.forEach(function (t) {
      if (t.got) return; t.cool -= dt; t.x = t.hx; t.y = t.hy + Math.sin(Math.PI * 2 * z.time / 4.5) * 0.9; t.g.position.set(t.x, t.y, 0); t.gem.rotation.y += dt;
      t.hot = L.zone === z && t.cool <= 0 && Math.abs(P.x - t.x) < 0.95 && Math.abs(P.y + 0.7 - t.y) < 1.05; t.g.scale.setScalar(t.hot ? 1.25 : 1);
    });
  } else if (z.kind === 'catch') {
    if (z.done) return;
    z.time += dt;
    if (!z.started && L.zone === z) { z.started = true; if (z.c.clearTrail) { clearTrail(); toast(z.c.startMsg || '', 4); } }
    z.toks.forEach(function (t) {
      t.cool -= dt; t.x = t.hx; t.y = t.hy + Math.sin(Math.PI * 2 * z.time / 4.5) * 0.9; t.g.position.set(t.x, t.y, 0); t.gem.rotation.y += dt;
      t.hot = L.zone === z && t.cool <= 0 && Math.abs(P.x - t.x) < 0.95 && Math.abs(P.y + 0.7 - t.y) < 1.05; t.g.scale.setScalar(t.hot ? 1.25 : 1);
    });
  } else {
    (z.toks || []).forEach(function (t) { if (t.got) { t.gem.rotation.y += dt; return; } t.gem.rotation.y += dt * 2; t.g.scale.setScalar(near(t) && L.zone === z ? 1.15 : 1); });
  }
}
/* wrong choices cost points and give a hint; only hazards cost energy */
function miss() { L.streak = 0; L.score = Math.max(0, L.score - 25); L.shake = 0.15; popup(P.x, P.y + 1.2, '-25', '#ffb09c'); beep(160, 0.3, 'sawtooth', 'low buzz, not correct'); hud(); }
function huntPick(z, t) {
  if (t.good) {
    t.got = true; t.g.visible = false; z.missRun = 0; z.found++; if (z.set.trail) addBead(t.text, '#9fe0ff'); L.first++; L.streak++; L.score += 80; record({ code: z.set.code }, true);
    popup(t.x, t.y, '+80', '#7be0ad'); burst(t.x, t.y, '#9fe0ff'); beep(700 + z.found * 60, 0.15, 'sine', 'chime, found one'); toast('✓ ' + t.text, 2.5);
    if (z.found >= z.need) { z.done = true; z.gate.off = true; z.gateMesh.visible = false; z.toks.forEach(function (k) { k.g.visible = false; }); toast('✓ You found them all. The gate is open.', 4); closeQ(); } else showZone(z);
    hud();
  } else {
    z.errors++; record({ code: z.set.code }, false); t.cool = 1.2;
    $('qfb').textContent = '✗ Decoy: "' + t.text + '". ' + t.why; miss();
    z.missRun = (z.missRun || 0) + 1; if (z.missRun >= 2) { const gd = z.toks.filter(function (k) { return k.good && !k.got; }).sort(function (a, c) { return Math.abs(a.x - P.x) - Math.abs(c.x - P.x); })[0]; if (gd) { helpGlow(gd.g); $('qfb').textContent += ' A real one is glowing gold.'; } }
  }
}
function catchPick(z, t) {
  const st = z.c.steps[z.si];
  if (t.text === st.need) {
    if (!z.stepErr) { L.first++; L.streak++; L.score += 80 + Math.min(L.streak, 5) * 10; } else L.score += 30;
    record({ id: z.c.id + '.' + z.si, code: z.c.code }, !z.stepErr); z.missRun = 0; unhelp(t.g);
    const bead = st.bead != null ? st.bead : st.need; if (bead && bead !== 'Stop') addBead(bead, TOKCOL[bead] || '#f2c078');
    popup(t.x, t.y, '+' + (z.stepErr ? 30 : 80), '#7be0ad'); burst(t.x, t.y, TOKCOL[t.text] || '#f2c078'); beep(640 + z.si * 60, 0.15, 'sine', 'chime, matched'); z.stepErr = false; z.si++; placeTok(z, t);
    if (z.si >= z.c.steps.length) { z.done = true; z.gate.off = true; z.gateMesh.visible = false; z.toks.forEach(function (k) { k.g.visible = false; }); toast('✓ ' + z.c.explain, 7); closeQ(); hud(); return; }
    ensureNeed(z); showZone(z); hud();
  } else {
    z.stepErr = true; z.errors++; t.cool = 1.2; $('qfb').textContent = '✗ ' + (z.c.wrong && z.c.wrong[t.text] ? z.c.wrong[t.text] : z.c.hint); miss();
    z.missRun = (z.missRun || 0) + 1; if (z.missRun >= 2) { const nd = z.toks.find(function (k) { return k.text === st.need; }); if (nd) { helpGlow(nd.g); $('qfb').textContent += ' The right one is glowing gold.'; } }
  }
}
function zoneAct(z) {
  if (z.done) return;
  if (z.kind === 'become') {
    const dr = z.doors.find(function (d) { return d.at && !d.open; });
    if (!dr) { $('qfb').textContent = 'Walk up to an opening in the membrane, then press E.'; return; }
    if (dr.cool > 0) return;
    const d = dr.d;
    if (!d.ok) { dr.cool = 1; dr.tried = true; z.errors++; P.vx = -6; $('qfb').textContent = '✗ ' + d.why; miss(); if (z.errors >= 2) { const okd = z.doors.find(function (q) { return q.d.ok; }); helpGlow(okd.g); okd.g.userData.help.position.set(okd.s.x0 + 0.7, (okd.s.y0 + okd.s.y1) / 2, 1); $('qfb').textContent += ' The right opening is glowing gold.'; } return; }
    if (d.kind === 'pump' && !P.atp) { P.vx = -5; $('qfb').textContent = 'The pump needs energy. Grab the glowing ATP first.'; beep(300, 0.15, 'triangle', 'soft tone, needs energy'); return; }
    if (d.kind === 'pump') { setATP(false); toast('ATP used: energy pushed you to the more crowded side.', 3); }
    dr.open = true; dr.s.off = true; dr.g.visible = false; z.done = true; setBadge(null);
    if (!z.errors) { L.first++; L.streak++; L.score += 150; } else L.score += 50;
    record({ id: z.it.id, code: z.it.code }, !z.errors); beep(880, 0.25, 'sine', 'chime, correct'); toast('✓ ' + z.it.explain, 6); hud(); closeQ();
    return;
  }
  if (z.kind === 'maze') {
    const dr = z.walls[z.si].find(function (d) { return d.at && !d.open; });
    if (!dr) { $('qfb').textContent = 'Walk up to a doorway, then press E.'; return; }
    if (dr.cool > 0) return;
    const st = z.mz.steps[z.si];
    if (!dr.d.ok) { dr.cool = 1; dr.tried = true; z.err = true; z.errors++; P.vx = -6; record({ id: z.mz.id + '.' + z.si, code: z.mz.code }, false); $('qfb').textContent = '✗ Dead end! "' + dr.d.label + '" does not come next. ' + st.hint; miss(); z.missRun = (z.missRun || 0) + 1; if (z.missRun >= 2) { const okd = z.walls[z.si].find(function (q) { return q.d.ok; }); helpGlow(okd.g); okd.g.userData.help.position.set(okd.s.x0 + 0.7, (okd.s.y0 + okd.s.y1) / 2, 1); $('qfb').textContent += ' The right doorway is glowing gold.'; } return; }
    dr.open = true; dr.s.off = true; dr.g.visible = false;
    if (!z.err) { L.first++; L.streak++; L.score += 100; } else L.score += 40;
    record({ id: z.mz.id + '.' + z.si, code: z.mz.code }, !z.err); addBead(st.label, '#9fe0ff'); burst(dr.s.x0, (dr.s.y0 + dr.s.y1) / 2, '#9fe0ff');
    beep(600 + z.si * 90, 0.18, 'sine', 'chime, path opens'); toast('✓ ' + st.why, 4); z.err = false; z.missRun = 0; z.si++;
    if (z.si >= z.mz.steps.length) { z.done = true; toast('✓ ' + z.mz.explain, 7); closeQ(); } else showZone(z);
    hud(); return;
  }
  if (z.kind === 'hunt' || z.kind === 'catch') {
    const t = z.toks.filter(function (k) { return k.hot && !k.got; }).sort(function (a, c) { return Math.abs(a.x - P.x) - Math.abs(c.x - P.x); })[0];
    if (!t) { $('qfb').textContent = 'Jump up to an item so it glows, then press E to grab it.'; return; }
    return z.kind === 'hunt' ? huntPick(z, t) : catchPick(z, t);
  }
  if (z.kind === 'balance') {
    const lv = z.levers.find(function (l) { const wp = new T.Vector3(); l.g.getWorldPosition(wp); return Math.abs(P.x - wp.x) < 1.3 && Math.abs(P.y - wp.y) < 1.6; });
    if (!lv) { $('qfb').textContent = 'Walk up to a switch, then press E.'; return; }
    if (lv.cool > 0) return; lv.cool = 0.8;
    const bl = z.bl, d = lv.c.delta;
    if (bl.kind === 'boss' && ((d > 0 && z.v > bl.set + 0.2) || (d < 0 && z.v < bl.set - 0.2))) { z.wrong++; $('qfb').textContent = '✗ ' + (d > 0 ? bl.wrongHot : bl.wrongCold); beep(200, 0.2, 'sawtooth', 'buzz, wrong direction'); }
    else { $('qfb').textContent = ''; beep(d > 0 ? 520 : 760, 0.12, 'triangle', d > 0 ? 'click, raising' : 'click, lowering'); }
    z.push.push({ d: d, t: 1.5 }); lv.knob.scale.setScalar(0.42); setTimeout(function () { lv.knob.scale.setScalar(0.3); }, 200);
    return;
  }
  const t = (z.toks || []).find(function (k) { return !k.got && near(k); });
  if (!t) { $('qfb').textContent = 'Walk up to a glowing ' + (z.kind === 'sequence' ? 'step' : 'word') + ', then press E.'; return; }
  if (z.kind === 'sequence') {
    if (t.si === z.next) {
      t.got = true; z.missRun = 0; unhelp(t.g); z.next++; beep(560 + z.next * 110, 0.15, 'sine', 'chime, step correct'); showZone(z);
      if (z.sq.loop) { t.gem.material = emat('#7be0ad', '#2f7a50'); t.g.scale.setScalar(1); if (z.prevTok) linkLine(z.prevTok, t); z.prevTok = t; if (!z.firstTok) z.firstTok = t; if (z.next >= z.sq.steps.length) linkLine(t, z.firstTok); }
      else t.g.visible = false;
      if (z.next >= z.sq.steps.length) {
        z.done = true; z.gate.off = true; z.gateMesh.visible = false;
        if (!z.errors) { L.first++; L.streak++; L.score += 150; } else L.score += 50;
        record({ id: z.sq.id, code: z.sq.code }, !z.errors); toast('✓ ' + z.sq.explain, 6); hud(); closeQ();
      }
    } else { z.errors++; z.missRun = (z.missRun || 0) + 1; $('qfb').textContent = '✗ Not yet. ' + z.sq.hint; miss(); if (z.missRun >= 2) { const nx = z.toks.find(function (k) { return k.si === z.next; }); if (nx) { helpGlow(nx.g); $('qfb').textContent += ' The next step is glowing gold.'; } } }
    return;
  }
  const sen = z.wb.sentences[z.si];
  if (t.word === sen.answer) {
    t.got = true; t.g.visible = false; z.missRun = 0;
    if (!z.err) { L.first++; L.streak++; L.score += 100; } else L.score += 40;
    record({ id: z.wb.id + '.' + z.si, code: sen.code }, !z.err); beep(880, 0.2, 'sine', 'chime, correct'); toast('✓ ' + sen.explain, 4);
    z.si++; z.err = false;
    if (z.si >= z.wb.sentences.length) { z.done = true; z.gate.off = true; z.gateMesh.visible = false; closeQ(); } else showZone(z);
    hud();
  } else { z.err = true; z.missRun = (z.missRun || 0) + 1; $('qfb').textContent = '✗ "' + t.word + '" does not fit this sentence. Read it again and try another word.'; miss(); if (z.missRun >= 2) { const rw = z.toks.find(function (k) { return !k.got && k.word === sen.answer; }); if (rw) { helpGlow(rw.g); $('qfb').textContent += ' The word that fits is glowing gold.'; } } }
}
function doorText(d) {
  d.label.material.map = labelTex('Collected ' + d.got + ' of ' + d.need); d.label.material.needsUpdate = true;
}
function startLevel(w, lv) {
  teardown();
  const th = THEMES[lv.theme] || THEMES.cell;
  L = { world: w, lv: lv, th: th, group: new T.Group(), solids: [], tokens: [], sparks: [], stations: [], doors: [], cps: [{ x: 2, y: 0 }], anim: [], used: {}, scans: [], helps: [],
    score: 0, streak: 0, hp: 5, time: 0, first: 0, total: 0, active: null, cp: 0, goal: null, over: false, zones: [], zone: null, atps: [], spin: [], hazards: [], movers: [], boosts: [], spikes: [], fx: [], flags: [], rare: null, lives: 3, coins: 0, shake: 0, debrief: null };
  scene.add(L.group);
  const b = builder(); lv.build(b); L.len = b.x;
  scenery(th, 0, L.len, L.group, L.anim);
  /* checkpoint flags: they light up when you pass them */
  L.cps.forEach(function (c, i) {
    if (!i) return; const g = new T.Group(), pole = mesh('cyl', '#d6e4ea'); pole.scale.set(0.06, 2.6, 0.06); pole.position.y = 1.3; g.add(pole);
    const fl = new T.Mesh(G.box, emat('#5a6470', '#101418')); fl.scale.set(0.9, 0.55, 0.05); fl.position.set(0.47, 2.25, 0); g.add(fl);
    g.position.set(c.x, c.y, -1.2); L.group.add(g); L.flags[i] = { fl: fl, g: g };
  });
  P = { x: 2, y: 0, vx: 0, vy: 0, ground: null, face: 1, m: buildAlien(S.alien), t: 0, atp: false, atpM: null, badge: null, inv: 0, boost: 0, boostM: null, shield: 0, shieldM: null, dbl: true, trail: [], hist: [] };
  L.group.add(P.m);
  const sh = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: FX.glow, color: th.rim, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.scale.set(3.2, 3.2, 1); L.group.add(sh); P.shadow = sh;
  cam.position.set(P.x + 4, 5, camZ);
  mode = 'play'; paused = false; actEdge = false; jumpBuf = 0; noteT = 0; $('note').hidden = true; show(null); $('hud').hidden = false; $('touch').hidden = !touchMode;
  $('hudLevel').textContent = lv.id + ' ' + lv.title; hud(); closeQ();
  toast(lv.log || '', 7); Music.setDuck(1); Music.play(SONGS[lv.theme] ? lv.theme : 'cell');
}
function hud() {
  let h = ''; for (let i = 0; i < 5; i++) h += i < L.hp ? '●' : '○';
  $('hudHp').textContent = h + '  ♥×' + L.lives + '  ◆' + L.coins; $('hudHp').setAttribute('aria-label', 'Energy ' + L.hp + ' of 5, ' + L.lives + ' lives, ' + L.coins + ' sparks');
  $('hudScore').textContent = L.score; $('hudStreak').textContent = L.streak > 1 ? 'Streak ×' + L.streak : '';
}
function toast(text, secs) { if (!text) return; $('toast').textContent = text; $('toast').hidden = false; toastT = secs || 4; }
function record(q, ok) {
  const c = S.codes[q.code] = S.codes[q.code] || { right: 0, tries: 0, world: L.world.id }; c.tries++; if (ok) c.right++;
  if (q.id) S.seen[q.id] = Date.now();
  if (q.id) { if (ok) { if (S.missed[q.id]) { S.missed[q.id]--; if (S.missed[q.id] <= 0) delete S.missed[q.id]; } } else S.missed[q.id] = (S.missed[q.id] || 0) + 1; }
}
function hurt(hazard) {
  L.hp--; L.shake = 0.35; if (!hazard) L.streak = 0; beep(hazard ? 120 : 160, 0.3, 'sawtooth', hazard ? 'thud, you were hit' : 'low buzz, not correct');
  if (L.hp <= 0) {
    L.lives--;
    if (L.lives <= 0) { hud(); return gameOver(); }
    L.hp = 5; respawn(); toast('Out of energy: you lost a life. Back to the last checkpoint.', 4);
  }
  hud();
}
function gameOver() {
  L.over = true; mode = 'done'; closeQ(); Music.stop(); beep(220, 0.6, 'triangle', 'sad tones, out of lives');
  $('doneTitle').textContent = L.lv.id + ' ' + L.lv.title + ': out of lives';
  $('doneStars').textContent = ''; $('doneBody').innerHTML = '<p>Your field research was interrupted. Try the level again. Collect 50 sparks for an extra life, and look for shields.</p>';
  $('btnNext').hidden = true; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; show('done'); $('btnReplay').focus();
}
/* feedback: floating score text and sparkle bursts */
function popup(x, y, text, col) { const sp = label(text, 1.7, { bd: col || '#ffd166' }); sp.position.set(x, y + 1, 1.5); L.group.add(sp); L.fx.push({ o: sp, t: 0, vy: 1.4, life: 0.9 }); }
function burst(x, y, col) {
  if (S.set.low) return;
  for (let i = 0; i < 8; i++) { const g = glow(col, 0.9, 0.9); g.position.set(x, y, 0.5); L.group.add(g); const a = i / 8 * Math.PI * 2; L.fx.push({ o: g, t: 0, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4, life: 0.5 }); }
}
function respawn() { const c = L.cps[L.cp]; P.duck = false; PH = STAND; P.x = c.x; P.y = c.y + 0.1; P.vx = P.vy = 0; P.inv = 1.5; }

/* ---------- question stations ---------- */
function figHTML(f) {
  if (!f) return '';
  if (f.type === 'table') {
    return '<table class="ftab"><tr>' + f.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>' +
      f.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  if (f.type === 'line') {
    const W = 330, H = 180, l = 52, r = 12, t = 12, bt = 40, x0 = f.xmin || 0, y0 = f.ymin || 0;
    const sx = function (x) { return l + (x - x0) / (f.xmax - x0) * (W - l - r); }, sy = function (y) { return H - bt - (y - y0) / (f.ymax - y0) * (H - t - bt); };
    let s = '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(f.ylabel + ' by ' + f.xlabel) + '">';
    f.yticks.forEach(function (v) { s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + sy(v) + '" y2="' + sy(v) + '" stroke="currentColor" stroke-opacity=".2"/><text x="' + (l - 6) + '" y="' + (sy(v) + 4) + '" text-anchor="end" font-size="11" fill="currentColor">' + v + '</text>'; });
    f.xticks.forEach(function (v) { s += '<text x="' + sx(v) + '" y="' + (H - bt + 15) + '" text-anchor="middle" font-size="11" fill="currentColor">' + v + '</text>'; });
    s += '<line x1="' + l + '" x2="' + l + '" y1="' + t + '" y2="' + (H - bt) + '" stroke="currentColor"/><line x1="' + l + '" x2="' + (W - r) + '" y1="' + (H - bt) + '" y2="' + (H - bt) + '" stroke="currentColor"/>';
    s += '<polyline fill="none" stroke="#ffd166" stroke-width="3" points="' + f.points.map(function (p) { return sx(p[0]) + ',' + sy(p[1]); }).join(' ') + '"/>';
    f.points.forEach(function (p) { s += '<circle cx="' + sx(p[0]) + '" cy="' + sy(p[1]) + '" r="3.5" fill="#ffd166"/>'; });
    s += '<text x="' + ((l + W - r) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="12" fill="currentColor">' + esc(f.xlabel) + '</text>';
    s += '<text transform="translate(13 ' + ((t + H - bt) / 2) + ') rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">' + esc(f.ylabel) + '</text></svg>';
    return s;
  }
  if (f.type === 'bars') {
    const W = 330, H = 190, l = 46, r = 8, t = 14, bt = 40, v = f.values, lim = Math.ceil(Math.max.apply(null, v.map(Math.abs)) / 10) * 10, bw = (W - l - r) / v.length;
    const sy = function (y) { return t + (lim - y) / (2 * lim) * (H - t - bt); };
    let s = '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(f.ylabel) + ' bar graph">';
    [-lim, -lim / 2, 0, lim / 2, lim].forEach(function (y) { s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + sy(y) + '" y2="' + sy(y) + '" stroke="currentColor" stroke-opacity="' + (y === 0 ? 0.9 : 0.2) + '"/><text x="' + (l - 6) + '" y="' + (sy(y) + 4) + '" text-anchor="end" font-size="11" fill="currentColor">' + y + '</text>'; });
    v.forEach(function (y, i) {
      const x = l + i * bw + bw * 0.2, top = Math.min(sy(y), sy(0)), h = Math.abs(sy(y) - sy(0));
      s += '<rect x="' + x + '" y="' + top + '" width="' + (bw * 0.6) + '" height="' + h + '" fill="' + (y >= 0 ? '#7fd4ff' : '#ffb09c') + '"/>';
      s += '<text x="' + (x + bw * 0.3) + '" y="' + (y >= 0 ? top - 4 : top + h + 12) + '" text-anchor="middle" font-size="11" fill="currentColor">' + (y > 0 ? '+' : '') + y + '%</text>';
      s += '<text x="' + (x + bw * 0.3) + '" y="' + (H - bt + 16) + '" text-anchor="middle" font-size="11" fill="currentColor">' + esc(f.categories[i]) + '</text>';
    });
    s += '<text transform="translate(12 ' + ((t + H - bt) / 2) + ') rotate(-90)" text-anchor="middle" font-size="11" fill="currentColor">' + esc(f.ylabel) + '</text></svg>';
    return s;
  }
  if (f.type === 'membrane') {
    const W = 330, H = 120; let s = '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + f.outside + ' molecules outside the cell and ' + f.inside + ' inside">';
    s += '<rect x="158" y="22" width="14" height="92" rx="5" fill="#f2c078"/>';
    s += '<text x="78" y="14" text-anchor="middle" font-size="12" fill="currentColor">Outside the cell</text><text x="252" y="14" text-anchor="middle" font-size="12" fill="currentColor">Inside the cell</text>';
    const dots = function (n, ox) { for (let i = 0; i < n; i++) { const j = Math.floor(i * 15 / n), cx = ox + 16 + (j % 5) * 27 + (j * 7 % 3) * 4, cy = 36 + Math.floor(j / 5) * 28 + (j * 5 % 4) * 3; s += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#7fd4ff"/>'; } };
    dots(f.outside, 6); dots(f.inside, 180); return s + '</svg>';
  }
  return '';
}
function openQ(st) {
  L.active = st; const q = st.queue[st.qi];
  st.perm = q.fixed ? q.options.map(function (_, i) { return i; }) : shuffle(q.options.map(function (_, i) { return i; }));
  st.tried = {}; st.firstTry = true; st.wrongN = 0;
  st.pads.forEach(function (p) { const on = p.i < q.options.length; p.s.off = !on; p.m.visible = on; p.lb.visible = on; p.m.material = emat('#3d8bd4', '#0f3a66'); });
  const inPair = st.pair && st.pair.qs.indexOf(q) >= 0, pairTxt = inPair ? 'Look-alike pair ' + (st.pair.qs.indexOf(q) + 1) + ' of 2: ' + st.pair.name : '';
  let meta = st.boss ? st.boss.name + ': ' + '■'.repeat(st.boss.hp) + '□'.repeat(st.boss.max - st.boss.hp) + (inPair ? ' · ' + pairTxt : '')
    : (pairTxt || (st.title ? st.title + ': ' : 'Question ') + (st.qi + 1) + ' of ' + st.queue.length);
  $('qmeta').textContent = meta; $('qpanel').classList.toggle('compact', st.chart); $('qpanel').classList.toggle('short', st.fixedLabels);
  $('qhow').textContent = st.chart ? 'Read the graph, then press the letter of your answer (or click it).' : st.lock ? 'Press 1 to 5 for each digit of the code (or click it).' : HOW;
  P.vx = 0;
  $('qprompt').innerHTML = esc(q.prompt) + (q.stem ? '<span class="stem">' + esc(q.stem) + '</span>' : '');
  $('qfig').innerHTML = st.chart ? '' : figHTML(q.figure);
  $('qopts').innerHTML = st.perm.map(function (oi, i) { return '<button type="button" class="opt" data-i="' + i + '">' + (st.lock ? '' : '<b>' + String.fromCharCode(65 + i) + '</b> ') + esc(q.options[oi]) + '</button>'; }).join('');
  $('qfb').textContent = ''; $('qpanel').hidden = false;
  Music.setDuck(0.45); if (st.boss) Music.play('boss');
}
const HOW = 'Press A, B, C, or D to answer (or click an answer).';
function closeQ() { if (L) L.active = null; $('qpanel').hidden = true; $('qpanel').classList.remove('compact', 'short'); Music.setDuck(1); }
function answer(i) {
  const st = L.active; if (!st || st.done || st.tried[i]) return;
  const q = st.queue[st.qi]; if (i >= q.options.length) return;
  const ok = st.perm[i] === q.answer;
  if (st.firstTry) record(q, ok);
  if (ok) {
    if (st.firstTry) { L.first++; L.streak++; L.score += 100 + Math.min(L.streak, 5) * 20; } else L.score += 40;
    beep(880, 0.25, 'sine', 'chime, correct'); toast('✓ Correct. ' + q.explain, 5);
    if (st.boss) { st.boss.hp--; st.boss.m.scale.setScalar(0.45 + 0.55 * st.boss.hp / st.boss.max); }
    if (st.pair && st.pair.qs.indexOf(q) === 1) toast('✓ ' + q.explain + ' Telling them apart: ' + st.pair.explain, 8);
    st.qi++;
    if (st.lock) {
      const dg = st.queue.map(function (x, k) { return k < st.qi ? x.options[x.answer] : '_'; }).join(' ');
      st.lockLabel.material.map = labelTex('Code: ' + dg, { bd: '#c8ff7a' }); st.lockLabel.material.needsUpdate = true;
      if (st.qi >= st.queue.length) { L.debrief = st.lock.debrief; st.lockLabel.visible = false; toast('✓ Lab Lock open. Code ' + dg + '. Read the debrief when you send your report.', 6); }
    }
    if (st.qi >= st.queue.length) {
      st.done = true; st.wall.off = true; st.wallMesh.visible = false; if (st.boss) { st.boss.m.visible = false; Music.play(SONGS[L.lv.theme] ? L.lv.theme : 'cell'); }
      st.pads.forEach(function (p) { p.lb.visible = false; }); closeQ(); if (st.boss) toast('✓ ' + st.boss.name + ' is back in balance. ' + q.explain, 6);
    } else openQ(st);
  } else {
    st.tried[i] = 1; st.firstTry = false; if (st.pads[i]) st.pads[i].m.material = mat('#5a6470');
    const btn = $('qopts').querySelector('[data-i="' + i + '"]'); if (btn) { btn.disabled = true; btn.classList.add('no'); }
    st.wrongN = (st.wrongN || 0) + 1;
    if (st.wrongN >= 2) { const ci = st.perm.indexOf(q.answer), b2 = $('qopts').querySelector('[data-i="' + ci + '"]'); if (b2) b2.classList.add('help'); if (st.pads[ci]) st.pads[ci].m.material = emat('#ffd700', '#7a5a00'); $('qfb').textContent = '✗ Not that one. ' + (q.hint || q.explain) + ' The right answer is glowing gold.'; }
    else $('qfb').textContent = '✗ Not that one. ' + (q.hint || q.explain);
    miss();
  }
  hud();
}

/* ---------- movement ---------- */
function hit(s) { return P.x + HW > s.x0 && P.x - HW < s.x1 && P.y + PH > s.y0 && P.y < s.y1; }
function moveX(dx) {
  P.x += dx; if (P.x < HW) P.x = HW;
  L.solids.forEach(function (s) { if (!s.off && !s.oneWay && hit(s)) { P.x = dx > 0 ? s.x0 - HW : s.x1 + HW; P.vx = 0; } });
}
function moveY(dy) {
  const prev = P.y; P.y += dy; P.ground = null;
  L.solids.forEach(function (s) {
    if (s.off || !hit(s)) return;
    if (s.oneWay) { if (dy <= 0 && prev >= s.y1 - 0.001) { P.y = s.y1; P.vy = 0; P.ground = s; } }
    else if (dy <= 0) { P.y = s.y1; P.vy = 0; P.ground = s; } else { P.y = s.y0 - PH; P.vy = 0; if (s.qb && !s.qb.used) bumpBlock(s.qb); }
  });
}
function step(dt) {
  L.time += dt; P.t += dt;
  const ax = L.active ? 0 : (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  if (L.active) jumpBuf = 0;
  if (ax) P.face = ax;
  const bo = P.boost > 0; P.boost -= dt; if (!bo && P.boostM) { P.m.remove(P.boostM); P.boostM = null; }
  P.inv -= dt;
  L.movers.forEach(function (mv) {
    mv.t += dt; const nx = mv.bx + Math.sin(mv.t * mv.sp) * mv.ax, ny = mv.by + Math.sin(mv.t * mv.sp) * mv.ay, dx = nx - mv.s.x0, dy = ny - mv.s.y1;
    mv.s.x0 += dx; mv.s.x1 += dx; mv.s.y0 += dy; mv.s.y1 += dy; mv.m.position.x += dx; mv.m.position.y += dy;
    if (P.ground === mv.s) { P.x += dx; P.y += dy; }
  });
  /* duck: crouch low while on the ground; stay crouched under a low ceiling */
  const wantDuck = keys.duck && !L.active && P.ground && !(jumpBuf > 0);
  if (wantDuck) P.duck = true;
  else if (P.duck) { PH = STAND; const blocked = L.solids.some(function (s) { return !s.off && !s.oneWay && hit(s); }); if (blocked) { PH = CROUCH; jumpBuf = 0; } else P.duck = false; }
  PH = P.duck ? CROUCH : STAND;
  P.vx += (ax * SPEED * (bo ? 1.45 : 1) * (P.duck ? 0.5 : 1) - P.vx) * Math.min(1, dt * 14);
  jumpBuf -= dt; coyote = P.ground ? 0.1 : coyote - dt;
  if (P.ground) P.dbl = true;
  if (jumpBuf > 0 && coyote > 0) { P.vy = JUMP * (bo ? 1.15 : 1); jumpBuf = 0; coyote = 0; beep(420, 0.08, 'triangle'); }
  else if (jumpBuf > 0 && !P.ground && P.dbl && P.vy < 10) { P.vy = JUMP * 0.85 * (bo ? 1.1 : 1); P.dbl = false; jumpBuf = 0; beep(620, 0.08, 'triangle'); burst(P.x, P.y + 0.2, '#ffffff'); }
  if (!keys.jump && P.vy > 0) P.vy -= 50 * dt;
  P.vy = Math.max(-30, P.vy - GRAV * dt);
  moveX(P.vx * dt); moveY(P.vy * dt);
  if (P.y < -16) { respawn(); L.score = Math.max(0, L.score - 25); toast('You fell. Back to the last checkpoint.', 3); hud(); }
  for (let i = L.cp + 1; i < L.cps.length; i++) if (P.x > L.cps[i].x) {
    L.cp = i; const f = L.flags[i];
    if (f && !f.lit) { f.lit = true; f.fl.material = emat('#7be0ad', '#2f7a50'); f.g.add(glow('#7be0ad', 2.4, 0.6)); beep(760, 0.15, 'triangle', 'bell, checkpoint'); popup(L.cps[i].x, L.cps[i].y + 2, 'Checkpoint', '#7be0ad'); }
  }

  L.hazards.forEach(function (h) {
    if (!h.alive) return; h.t += dt;
    if (h.kind === 'snapper') {
      const c = (h.t + h.offset) % h.period, upStart = h.period - 1.9, up = c > upStart;
      const f = up ? Math.min(1, (c - upStart) / 0.25, (h.period - c) / 0.25) : 0, lift = -1.3 + f * 2.7;
      h.head.position.set(c > upStart - 0.6 && !up ? (Math.random() - 0.5) * 0.12 : 0, lift, 0);
      const open = up ? 0.2 + Math.abs(Math.sin(h.t * 6)) * 0.6 : 0.9; h.arms[0].rotation.z = -open; h.arms[1].rotation.z = open;
      h.y = h.gy + lift + 0.2;
      if (lift > -0.2 && P.inv <= 0 && Math.abs(P.x - h.x) < 0.75 && P.y < h.gy + lift + 0.6 && P.y + PH > h.gy) { P.inv = 1.3; P.vx = P.x < h.x ? -8 : 8; P.vy = 8; toast('Engulfed! Phagocytes eat by wrapping around things. Jump past while it is hiding.', 3.5); hurt(true); }
      return;
    }
    if (h.kind === 'antibody') {
      const c = (h.t + h.offset) % h.period, fly = c < h.span / h.speed;
      h.x = fly ? h.x0 - c * h.speed : h.x0 + 2; h.y = h.gy + 1.15; h.m.visible = fly; h.m.position.set(h.x, h.y + Math.sin(h.t * 9) * 0.05, 0); h.m.rotation.z = Math.sin(h.t * 6) * 0.15;
      if (h.warn) h.warn.material.opacity = !fly && c > h.period - 1 ? 0.5 + 0.5 * Math.sin(h.t * 20) : 0.15;
      if (fly && P.inv <= 0 && P.shield <= 0 && Math.abs(P.x - h.x) < 0.7 && P.y + PH > h.y - 0.25 && P.y < h.y + 0.35) { P.inv = 1.3; P.vx = -7; P.vy = 6; toast('Tagged by an antibody! Duck (down arrow or S) or jump over it.', 3.5); hurt(true); }
      return;
    }
    if (h.kind === 'virus') { const k = Math.asin(Math.sin(h.t * h.sp + h.ph)) * 2 / Math.PI; h.x = h.bx + k * h.range; h.y = h.by + Math.abs(Math.sin(h.t * 6)) * 0.12; h.m.position.set(h.x, h.y, 0); h.m.rotation.y = Math.cos(h.t * h.sp + h.ph) > 0 ? 0.6 : -0.6; }
    else { h.x = h.bx + Math.sin(h.t * h.sp + h.ph) * h.ax; h.y = h.by + Math.sin(h.t * h.sp * 1.3 + h.ph) * h.ay; h.m.position.set(h.x, h.y, 0); h.m.rotation.z += dt * 2.5; }
    const dx = P.x - h.x, dy = P.y + PH * 0.52 - h.y;
    if (Math.abs(dx) > 0.85 || Math.abs(dy) > PH * 0.52 + 0.3) return;
    const name = h.kind === 'virus' ? 'virus' : 'free radical';
    if ((P.vy < -1 && P.y > h.y - 0.25) || P.shield > 0) { h.alive = false; h.m.visible = false; if (P.shield <= 0) P.vy = 12; L.score += 50; popup(h.x, h.y, '+50', '#ffd166'); burst(h.x, h.y, h.kind === 'virus' ? '#9be36b' : '#ff6b4a'); beep(900, 0.12, 'square', 'pop, ' + name + ' stopped'); hud(); return; }
    if (P.inv > 0) return;
    P.inv = 1.3; P.vx = dx >= 0 ? 9 : -9; P.vy = 7; toast(h.kind === 'virus' ? 'Ouch! A virus got you. Jump on top of it, or jump over it.' : 'Ouch! Free radicals damage cells. Jump on top of them instead.', 3); hurt(true);
  });
  L.spikes.forEach(function (sp) {
    if (P.inv > 0 || P.shield > 0 || P.x + HW < sp.x0 || P.x - HW > sp.x1 || P.y > sp.y + 0.55 || P.y < sp.y - 0.2) return;
    P.inv = 1.3; P.vy = 11; toast('Ouch! Toxin crystals. Jump over them.', 3); hurt(true);
  });
  if (P.shield > 0) { P.shield -= dt; if (P.shieldM) P.shieldM.rotation.y += dt * 4; if (P.shield <= 0 && P.shieldM) { P.m.remove(P.shieldM); P.shieldM = null; toast('Shield used up.', 2); } }
  if (L.rare && !L.rare.got) { L.rare.m.rotation.y += dt * 2; L.rare.m.position.y = L.rare.y + Math.sin(P.t * 2) * 0.2;
    if (Math.abs(P.x - L.rare.x) < 1 && Math.abs(P.y + 0.7 - L.rare.y) < 1.1) { L.rare.got = true; L.rare.m.visible = false; L.score += 500; S.rare[L.lv.id] = true; save(); popup(L.rare.x, L.rare.y, 'Rare specimen! +500', '#ffd700'); burst(L.rare.x, L.rare.y, '#ffd700'); beep(1320, 0.4, 'triangle', 'sparkle, rare specimen found'); hud(); } }
  L.fx = L.fx.filter(function (f) {
    f.t += dt; f.o.position.x += (f.vx || 0) * dt; f.o.position.y += f.vy * dt; f.o.material.opacity = Math.max(0, 1 - f.t / f.life);
    if (f.t >= f.life) { L.group.remove(f.o); return false; } return true;
  });
  L.boosts.forEach(function (bt) {
    if (bt.got) return; bt.m.position.y = bt.y + Math.sin(P.t * 3) * 0.15;
    if (Math.abs(P.x - bt.x) < 0.9 && Math.abs(P.y + 0.7 - bt.y) < 1.1 && bt.kind === 'life') {
      bt.got = true; bt.m.visible = false; L.lives = Math.min(9, L.lives + 1); popup(bt.x, bt.y, 'Extra life!', '#ff8fb1'); beep(1400, 0.3, 'triangle', 'jingle, extra life'); hud(); return;
    }
    if (Math.abs(P.x - bt.x) < 0.9 && Math.abs(P.y + 0.7 - bt.y) < 1.1 && bt.kind === 'shield') {
      bt.got = true; bt.m.visible = false; P.shield = 8; if (!P.shieldM) { P.shieldM = new T.Mesh(G.tor, basic('#7fd4ff', 0.45, true)); P.shieldM.scale.setScalar(0.95); P.shieldM.position.y = 0.75; P.m.add(P.shieldM); }
      L.score += 25; popup(bt.x, bt.y, 'Shield!', '#7fd4ff'); beep(1000, 0.25, 'triangle', 'hum, shield on'); toast('Shield on: enemies and spikes cannot hurt you for 8 seconds!', 3); hud(); return;
    }
    if (Math.abs(P.x - bt.x) < 0.9 && Math.abs(P.y + 0.7 - bt.y) < 1.1) {
      bt.got = true; bt.m.visible = false; P.boost = 6; if (!P.boostM) { P.boostM = glow('#c8ff7a', 3.2, 0.6); P.boostM.position.y = 0.7; P.m.add(P.boostM); }
      L.score += 25; beep(1100, 0.2, 'triangle', 'whoosh, ATP boost'); toast('ATP boost: extra energy to run faster and jump higher for 6 seconds!', 3); hud();
    }
  });
  P.hist.unshift({ x: P.x, y: P.y }); if (P.hist.length > 300) P.hist.pop();
  P.trail.forEach(function (g, k) { const h = P.hist[Math.min(P.hist.length - 1, (k + 1) * 9)]; g.position.set(h.x, h.y + 0.6, -0.4); });
  L.sparks.forEach(function (s) { if (!s.got && Math.abs(P.x - s.x) < 0.7 && Math.abs(P.y + 0.7 - s.y) < 0.9) { s.got = 1; s.m.visible = false; L.score += 10; L.coins++; beep(1200, 0.06, 'square'); if (L.coins >= 50) { L.coins -= 50; L.lives = Math.min(9, L.lives + 1); popup(P.x, P.y + 1, 'Extra life!', '#7be0ad'); beep(1400, 0.3, 'triangle', 'jingle, extra life'); } hud(); } s.m.rotation.y += dt * 3; });
  L.tokens.forEach(function (t) {
    if (t.got) return; t.gem.rotation.y += dt * 2;
    if (Math.abs(P.x - t.x) < 0.8 && Math.abs(P.y + 0.7 - t.y) < 0.95) {
      t.got = 1; t.m.visible = false; L.total++;
      record({ code: t.door.set.code }, t.it.good);
      if (t.it.good) { L.first++; L.streak++; L.score += 50; t.door.got++; doorText(t.door); beep(880, 0.15, 'sine', 'chime, correct'); toast('✓ ' + t.it.text, 2.5);
        if (t.door.got >= t.door.need) { t.door.solid.off = true; t.door.mesh.visible = false; t.door.label.visible = false; toast('✓ All collected. The gate is open.', 3); } }
      else { toast('✗ ' + t.it.text + ': ' + t.it.explain, 6); miss(); }
      hud();
    }
  });
  let near = null;
  L.stations.forEach(function (st) { if (!st.done && P.x > st.x0 && P.x < st.x1) near = st; if (st.boss && st.boss.m.visible) { st.boss.m.position.y = st.boss.y + Math.sin(P.t * 2) * 0.5; st.boss.m.rotation.y = Math.sin(P.t) * 0.4; } });
  if (near !== L.active) { if (near) openQ(near); else closeQ(); }
  let zone = null; L.zones.forEach(function (z) { if (!z.done && P.x > z.x0 && P.x < z.x1) zone = z; });
  if (!near) { if (zone !== L.zone) { L.zone = zone; if (!zone || zone.kind !== 'become') setBadge(null); if (zone) showZone(zone); else closeQ(); } } else L.zone = null;
  L.zones.forEach(function (z) { zoneTick(z, dt); });
  L.atps.forEach(function (a) { if (!a.got && Math.abs(P.x - a.x) < 0.9 && Math.abs(P.y + 0.7 - a.y) < 1.1) { a.got = true; a.m.visible = false; setATP(true); beep(990, 0.12, 'triangle', 'sparkle, picked up ATP'); toast('You picked up ATP: energy a pump can use.', 3); } if (!a.got) a.m.position.y = a.y + Math.sin(P.t * 3) * 0.15; });
  if (P.atpM) P.atpM.position.set(Math.cos(P.t * 4) * 0.7, 1.1, Math.sin(P.t * 4) * 0.7);
  L.spin.forEach(function (t) { t.rotation.z += dt * 2; });
  if (actEdge) {
    actEdge = false;
    if (L.active) $('qfb').textContent = L.active.lock ? 'Press a number key from 1 to 5.' : 'Press the letter of your answer.';
    else { const k = nearScan(); if (k) doScan(k); else if (L.zone) zoneAct(L.zone); }
  }
  L.scans.forEach(function (k) {
    k.t += dt; k.ring.rotation.y += dt * 2; const g = k.g, u = g.userData, by = k.y;
    if (u.hop) { const close = Math.abs(P.x - k.x) < 3; g.position.y = by + (close ? Math.abs(Math.sin(k.t * 6)) * 0.6 : 0); }
    if (u.grow) { const sc = 0.75 + 0.25 * Math.sin(k.t * 0.8); g.scale.set(1, sc, 1); }
    if (u.wiggle) g.rotation.z = Math.sin(k.t * 5) * 0.12;
    if (u.spin) g.rotation.y += dt;
    const nr = nearScan() === k; k.nm.scale.set(nr ? 3.6 : 3, nr ? 1.8 : 1.5, 1);
    if (nr && !k.done && !k.told && !L.active) { k.told = true; toast('Press E to scan the ' + k.sc.name + '.', 3); }
  });
  L.helps.forEach(function (h) { h.material.opacity = 0.55 + 0.4 * Math.sin(P.t * 6); });
  if (noteT > 0) { noteT -= dt; if (noteT <= 0) $('note').hidden = true; }
  if (L.goal) { L.goal.m.position.y = L.goal.y + 1.6 + Math.sin(P.t * 2) * 0.2; L.goal.m.rotation.y += dt; if (Math.abs(P.x - L.goal.x) < 1.3 && !L.over) finish(); }

  P.m.position.set(P.x, P.y + (P.ground ? Math.abs(Math.sin(P.t * 11)) * 0.07 * Math.min(1, Math.abs(P.vx) / 3) : 0), 0);
  P.m.rotation.y += (P.face * 0.75 - P.m.rotation.y) * Math.min(1, dt * 10);
  P.m.visible = !(P.inv > 0 && Math.floor(P.t * 12) % 2);
  const sq = P.duck ? 0.58 : P.ground ? 1 : 1 + Math.min(0.18, Math.abs(P.vy) * 0.012); P.m.scale.set(P.duck ? 1.2 : 1 / sq, sq, P.duck ? 1.2 : 1 / sq);
  P.shadow.position.set(P.x, (P.ground ? P.y : P.y - 0.5) + 0.04, 0); P.shadow.visible = !!P.ground;
  cam.position.x += (P.x + P.face * 2.5 - cam.position.x) * Math.min(1, dt * 4);
  const lift = L.active && L.active.chart ? 2.4 : 0;
  cam.position.y += (P.y + 5.2 + lift - cam.position.y) * Math.min(1, dt * 3); cam.position.z = camZ;
  if (L.shake > 0) { L.shake -= dt; cam.position.x += (Math.random() - 0.5) * L.shake; cam.position.y += (Math.random() - 0.5) * L.shake; }
  cam.lookAt(cam.position.x, cam.position.y - 0.6, 0);
  sceneryTick(dt, P.t);
  L.anim.forEach(function (a) { a.m.position.y = a.y + Math.sin(P.t * 0.6 + a.ph) * a.amp; a.m.rotation.z += a.rot * dt; });
}
function finish() {
  L.over = true; mode = 'done'; closeQ();
  const acc = L.total ? L.first / L.total : 1, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const bonus = Math.max(0, Math.round(240 - L.time)) * 2; L.score += bonus;
  const before = totalStars(), old = S.levels[L.lv.id] || { stars: 0, best: 0 };
  S.levels[L.lv.id] = { stars: Math.max(old.stars, stars), best: Math.max(old.best, L.score) }; save();
  BQ.Leaderboard.submit(S.nick, totalScore());
  const after = totalStars(), got = GEAR.filter(function (g) { return g[1] > before && g[1] <= after; });
  Music.stop(); [523, 659, 784, 1047].forEach(function (f, k) { setTimeout(function () { beep(f, k === 3 ? 0.6 : 0.18, 'triangle', k === 0 ? 'fanfare, level complete' : null); }, k * 120); });
  $('doneTitle').textContent = L.lv.id + ' ' + L.lv.title + ': report sent';
  $('doneStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); $('doneStars').setAttribute('aria-label', stars + ' of 3 stars');
  $('doneBody').innerHTML = '<p>' + esc(L.lv.outro || '') + '</p><dl><dt>Score</dt><dd>' + L.score + (L.score > old.best && old.best ? ' (new best)' : '') + '</dd><dt>Right on the first try</dt><dd>' + L.first + ' of ' + L.total + '</dd><dt>Speed bonus</dt><dd>' + bonus + '</dd>' + (L.rare ? '<dt>Rare specimen</dt><dd>' + (L.rare.got ? 'Found!' : (S.rare[L.lv.id] ? 'Found on an earlier visit' : 'Still hidden in this level')) + '</dd>' : '') + '</dl>' +
    (L.debrief ? '<h3>Lab Lock debrief</h3><ul class="debrief">' + L.debrief.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' : '') +
    (got.length ? '<p class="unlock">New gear unlocked: ' + got.map(function (g) { return esc(g[0]); }).join(', ') + '. Put it on from the main menu.</p>' : '');
  const list = allLevels(), i = list.findIndex(function (e) { return e.lv === L.lv; });
  $('btnNext').hidden = i >= list.length - 1; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; show('done');
  ($('btnNext').hidden ? $('btnReplay') : $('btnNext')).focus();
}

/* ---------- menus ---------- */
function show(name) {
  ['menu', 'levels', 'progress', 'settings', 'pause', 'done'].forEach(function (n) { $(n).hidden = n !== name; });
}
function menuScene() {
  Music.play('menu');
  teardown(); mode = 'menu'; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; $('qpanel').hidden = true;
  const th = THEMES.space;
  menuGrp = new T.Group(); scene.add(menuGrp);
  const pad = mesh('cyl', th.ground); pad.scale.set(1.8, 0.3, 1.8); pad.position.y = -0.15; menuGrp.add(pad);
  const rim = mesh('tor', th.top); rim.scale.setScalar(1.75); rim.rotation.x = Math.PI / 2; rim.scale.z = 0.3; menuGrp.add(rim);
  menuGrp.userData.anim = []; scenery(th, -10, 10, menuGrp, menuGrp.userData.anim); const halo = glow(th.rim, 5, 0.35); halo.position.y = 0.1; menuGrp.add(halo); refreshAlien(); show('menu'); buildMenu();
}
function refreshAlien() { if (!menuGrp) return; if (menuAlien) menuGrp.remove(menuAlien); menuAlien = buildAlien(S.alien); menuAlien.scale.setScalar(1.5); menuGrp.add(menuAlien); }
function buildMenu() {
  const stars = totalStars();
  const rows = [['Body', 'shape', ['Round', 'Tall', 'Wide']], ['Color', 'color', COLORS.map(function (c) { return c[0]; })], ['Eyes', 'eyes', ['1', '2', '3'], 1], ['Antennae', 'ant', ['0', '1', '2']],
    ['Gear', 'gear', GEAR.map(function (g) { return g[1] > stars ? g[0] + ' (' + g[1] + ' stars)' : g[0]; })]];
  $('cust').innerHTML = rows.map(function (r) {
    return '<div class="row"><span class="rl">' + r[0] + '</span><span class="rb">' + r[2].map(function (name, i) {
      const v = i + (r[3] || 0), lock = r[1] === 'gear' && GEAR[i][1] > stars;
      return '<button type="button" class="chip" data-k="' + r[1] + '" data-v="' + v + '"' + (S.alien[r[1]] === v ? ' aria-pressed="true"' : ' aria-pressed="false"') + (lock ? ' disabled' : '') +
        (r[1] === 'color' ? ' style="--sw:' + COLORS[i][1] + '"><i class="sw"></i>' : '>') + esc(name) + '</button>';
    }).join('') + '</span></div>';
  }).join('');
  const list = allLevels(), started = Object.keys(S.levels).length > 0;
  $('btnPlay').textContent = started ? 'Continue mission' : 'Start mission';
  $('menuStars').textContent = list.length ? stars + ' of ' + list.length * 3 + ' stars' : 'No world files found in this folder.';
  $('btnPlay').disabled = !list.length;
}
function nextUp() {
  const list = allLevels(); let i = list.findIndex(function (e) { return !(S.levels[e.lv.id] && S.levels[e.lv.id].stars); });
  if (i < 0) i = list.length - 1; return list[i];
}
function buildLevels() {
  const list = allLevels(); let html = '';
  for (let w = 1; w <= 6; w++) {
    html += '<h3>World ' + w + ': ' + BQ.UNITS[w - 1] + '</h3>';
    if (!BQ.worlds[w]) { html += '<p class="dim">Coming soon.</p>'; continue; }
    html += '<div class="lvls">' + list.map(function (e, i) {
      if (e.w.id !== w) return ''; const sv = S.levels[e.lv.id], open = unlocked(i, list);
      return '<button type="button" class="lvl" data-i="' + i + '"' + (open ? '' : ' disabled') + '><b>' + e.lv.id + '</b> ' + esc(e.lv.title) + '<span>' + (open ? '★'.repeat(sv ? sv.stars : 0) + '☆'.repeat(3 - (sv ? sv.stars : 0)) : 'Locked') + '</span></button>';
    }).join('') + '</div>';
  }
  $('levelList').innerHTML = html;
}
function buildProgress() {
  let html = '<h3>Mastery by unit</h3><p class="dim">Share of questions answered right on the first try.</p>';
  for (let w = 1; w <= 6; w++) {
    let r = 0, t = 0; Object.keys(S.codes).forEach(function (k) { if (S.codes[k].world === w) { r += S.codes[k].right; t += S.codes[k].tries; } });
    const pct = t ? Math.round(r / t * 100) : 0;
    html += '<div class="bar"><span>' + w + '. ' + BQ.UNITS[w - 1] + '</span><div class="track"><div class="fill" style="width:' + pct + '%"></div></div><span class="num">' + (BQ.worlds[w] ? (t ? pct + '%' : 'Not started') : 'Coming soon') + '</span></div>';
  }
  const codes = Object.keys(S.codes).sort();
  if (codes.length) html += '<h3>By Keystone code</h3><table class="ftab"><tr><th>Code</th><th>First-try correct</th></tr>' + codes.map(function (k) { return '<tr><td>' + esc(k) + '</td><td>' + S.codes[k].right + ' of ' + S.codes[k].tries + '</td></tr>'; }).join('') + '</table>';
  const top = BQ.Leaderboard.top(5);
  html += '<h3>High scores on this device</h3>' + (top.length ? '<ol class="board">' + top.map(function (r) { return '<li><span>' + esc(r.nick) + '</span><span class="num">' + r.score + '</span></li>'; }).join('') + '</ol>' : '<p class="dim">Enter a nickname below, then finish a level to post a score. Your total so far: ' + totalScore() + '.</p>');
  $('progBody').innerHTML = html; $('nick').value = S.nick;
}
function applySettings() {
  document.documentElement.style.setProperty('--ts', [0.9, 1, 1.15, 1.3][S.set.text]);
  $('setText').value = S.set.text; $('setLow').checked = S.set.low; $('setSound').checked = S.set.sound; $('setCap').checked = S.set.cap; $('setMusic').checked = S.set.music; $('setVol').value = S.set.vol; musicLevel(); if (S.set.music && Music.want) Music.play(Music.want); $('setUnlock').checked = S.set.unlock;
  if (renderer) resize();
}
function pause(on) {
  if (mode !== 'play') return; paused = on; show(on ? 'pause' : null); musicLevel();
  if (on) {
    const d = BQ.data[L.world.id] || {}, seen = {}, total = {};
    (d.scans || []).forEach(function (sc) { total[sc.word] = 1; });
    const words = (d.scans || []).filter(function (sc) { if (!S.words[sc.word] || seen[sc.word]) return false; seen[sc.word] = 1; return true; });
    $('guide').innerHTML = '<dt class="gh">Words you discovered: ' + words.length + ' of ' + Object.keys(total).length + '</dt>' +
      words.map(function (sc) { return '<dt>✓ ' + esc(sc.word) + '</dt><dd>' + esc(sc.def) + '</dd>'; }).join('') +
      '<dt class="gh">More words for this world</dt>' + (d.vocab || []).filter(function (t) { return !seen[t.term]; }).map(function (t) { return '<dt>' + esc(t.term) + '</dt><dd>' + esc(t.def) + '</dd>'; }).join('');
    $('btnResume').focus();
  }
}
function resize() {
  const c = $('stage'), w = c.clientWidth || 800, h = c.clientHeight || 450;
  renderer.setPixelRatio(S.set.low ? 1 : Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h, false);
  cam.aspect = w / h; const half = Math.tan(cam.fov * Math.PI / 360); camZ = Math.max(22, 14 / (half * cam.aspect)); cam.updateProjectionMatrix();
}
function tick(t) {
  requestAnimationFrame(tick);
  const dt = Math.min((t - last) / 1000 || 0, 1 / 30); last = t;
  if (mode === 'play' && !paused) {
    step(dt);
    if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').hidden = true; }
  } else if (menuGrp) {
    const narrow = cam.aspect < 1; if (menuAlien) { menuAlien.rotation.y = Math.sin(t / 1400) * 0.5; menuAlien.position.y = Math.abs(Math.sin(t / 500)) * 0.08; }
    cam.position.set(narrow ? 0 : 2.3, narrow ? 0.4 : 1.7, narrow ? 11 : 8.5); cam.lookAt(narrow ? 0 : 2.3, narrow ? -0.9 : 1.3, 0);
    sceneryTick(1 / 60, t / 1000);
    menuGrp.userData.anim.forEach(function (a) { a.m.position.y = a.y + Math.sin(t / 1600 + a.ph) * a.amp; });
  }
  renderer.render(scene, cam);
}

/* ---------- controls ---------- */
let touchMode = false;
const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'jump', ArrowUp: 'jump', w: 'jump', W: 'jump', e: 'act', E: 'act', Enter: 'act', ArrowDown: 'duck', s: 'duck', S: 'duck' };
const held = {};
function press(k, down) {
  if (k === 'jump' && down && !keys.jump) jumpBuf = 0.12;
  if (k === 'act' && down && !keys.act) actEdge = true;
  keys[k] = down;
}
function wire() {
  window.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (mode === 'play' && (e.key === 'p' || e.key === 'P' || e.key === 'Escape')) { pause(!paused); e.preventDefault(); return; }
    if (e.key === 'm' || e.key === 'M') { S.set.music = !S.set.music; save(); applySettings(); toast(S.set.music ? 'Music on' : 'Music off (press M to turn it back on)', 2.5); return; }
    if (mode !== 'play' || paused) return;
    if (e.target && e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) e.target.blur();
    if (L && L.active) {
      if (/^[a-eA-E]$/.test(e.key) && !L.active.lock) { answer('abcde'.indexOf(e.key.toLowerCase())); e.preventDefault(); return; }
      if (/^[1-9]$/.test(e.key)) { answer(+e.key - 1); e.preventDefault(); return; }
      if (KEYMAP[e.key]) { e.preventDefault(); return; }
    }
    const k = KEYMAP[e.key];
    if (k) { held[e.key] = true; press(k, true); e.preventDefault(); } else if (/^[1-9]$/.test(e.key)) answer(+e.key - 1);
  });
  /* a movement stops only when every key for it is released; answer keys never affect movement */
  window.addEventListener('keyup', function (e) {
    const k = KEYMAP[e.key]; if (!k || !held[e.key]) return; delete held[e.key];
    if (!Object.keys(held).some(function (h) { return KEYMAP[h] === k; })) press(k, false);
  });
  window.addEventListener('blur', function () { Object.keys(keys).forEach(function (k) { keys[k] = false; }); Object.keys(held).forEach(function (h) { delete held[h]; }); if (mode === 'play' && !paused) pause(true); });
  window.addEventListener('resize', resize);
  window.addEventListener('touchstart', function () { if (!touchMode) { touchMode = true; if (mode === 'play') $('touch').hidden = false; } }, { passive: true });
  document.querySelectorAll('#touch button').forEach(function (b) {
    const k = b.dataset.k, up = function (e) { press(k, false); e.preventDefault(); };
    b.addEventListener('pointerdown', function (e) { press(k, true); e.preventDefault(); }); b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
  });
  $('qopts').addEventListener('click', function (e) { const b = e.target.closest('.opt'); if (b) { answer(+b.dataset.i); b.blur(); } });
  $('cust').addEventListener('click', function (e) { const b = e.target.closest('.chip'); if (!b) return; S.alien[b.dataset.k] = +b.dataset.v; save(); refreshAlien(); buildMenu(); const again = $('cust').querySelector('[data-k="' + b.dataset.k + '"][data-v="' + b.dataset.v + '"]'); if (again) again.focus(); });
  $('btnPlay').onclick = function () { const e = nextUp(); if (e) startLevel(e.w, e.lv); };
  $('btnLevels').onclick = function () { buildLevels(); show('levels'); };
  $('btnProgress').onclick = function () { buildProgress(); show('progress'); };
  $('btnSettings').onclick = function () { backTo = 'menu'; show('settings'); };
  $('levelList').addEventListener('click', function (e) { const b = e.target.closest('.lvl'); if (b) { const en = allLevels()[+b.dataset.i]; startLevel(en.w, en.lv); } });
  document.querySelectorAll('[data-back]').forEach(function (b) { b.onclick = function () { if (b.closest('#settings') && backTo === 'pause') show('pause'); else show('menu'); }; });
  $('nick').addEventListener('input', function () { S.nick = $('nick').value.replace(/[^A-Za-z0-9 _-]/g, '').slice(0, 12); save(); });
  $('setText').onchange = function () { S.set.text = +$('setText').value; save(); applySettings(); };
  ['Low', 'Sound', 'Music', 'Cap', 'Unlock'].forEach(function (n) { $('set' + n).onchange = function () { S.set[n.toLowerCase()] = $('set' + n).checked; save(); applySettings(); }; });
  $('setVol').oninput = function () { S.set.vol = +$('setVol').value; save(); musicLevel(); };
  const firstTouch = function () { if (Music.gesture) return; Music.gesture = true; if (Music.want) Music.play(Music.want); };
  window.addEventListener('pointerdown', firstTouch); window.addEventListener('keydown', firstTouch);
  let armed = false;
  $('btnReset').onclick = function () {
    if (!armed) { armed = true; $('btnReset').textContent = 'Press again to erase all progress'; return; }
    armed = false; $('btnReset').textContent = 'Erase progress on this device'; const keep = S.set; S = fresh(); S.set = keep; save(); if (mode === 'menu') { refreshAlien(); buildMenu(); }
  };
  $('btnPause').onclick = function () { pause(true); };
  $('btnResume').onclick = function () { pause(false); };
  $('btnRestart').onclick = function () { startLevel(L.world, L.lv); };
  $('btnPauseSet').onclick = function () { backTo = 'pause'; show('settings'); };
  $('btnQuit').onclick = menuScene; $('btnMenu').onclick = menuScene;
  $('btnReplay').onclick = function () { startLevel(L.world, L.lv); };
  $('btnNext').onclick = function () { const list = allLevels(), i = list.findIndex(function (e) { return e.lv === L.lv; }); startLevel(list[i + 1].w, list[i + 1].lv); };
}
function boot() {
  if (TEACH) $('teacherRow').hidden = false;
  try {
    renderer = new T.WebGLRenderer({ canvas: $('stage'), antialias: !S.set.low });
  } catch (e) { $('err').hidden = false; return; }
  scene = new T.Scene(); cam = new T.PerspectiveCamera(42, 16 / 9, 0.5, 1200);
  HEMI = new T.HemisphereLight(0xffffff, 0x334455, 0.9); scene.add(HEMI);
  KEYL = new T.DirectionalLight(0xffffff, 0.8); KEYL.position.set(-6, 8, 8); scene.add(KEYL); makeFxTextures();
  G = { box: new T.BoxGeometry(1, 1, 1), sph: new T.SphereGeometry(1, 18, 12), tor: new T.TorusGeometry(1, 0.28, 8, 22), cone: new T.ConeGeometry(1, 2, 8),
    cyl: new T.CylinderGeometry(1, 1, 1, 12), ico: new T.IcosahedronGeometry(1, 0), oct: new T.OctahedronGeometry(1, 0), plane: new T.PlaneGeometry(1, 1) };
  wire(); applySettings(); menuScene(); requestAnimationFrame(tick);
  const jump = (location.hash || '').match(/level-(\d+-\d+)/i);
  if (jump) { const e = allLevels().find(function (x) { return x.lv.id === jump[1]; }); if (e) startLevel(e.w, e.lv); }
  BQ._debug = { state: function () { return { mode: mode, L: L, P: P, S: S }; }, answer: answer, start: startLevel };
}
})();

/* BioQuest shared game file: movement, 3D scenery, scoring, menus, saving.
   World files plug in through BioQuest.registerWorld and BioQuest.registerQuestions. */
(function () {
'use strict';
const T = window.THREE;
const BQ = window.BioQuest = {
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
  return { alien: { shape: 0, color: 0, eyes: 2, ant: 2, gear: 0 }, levels: {}, missed: {}, codes: {},
    set: { text: 1, low: false, sound: true, cap: true, unlock: false }, nick: '', board: [] };
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
function unlocked(i, list) { return i === 0 || S.set.unlock || !!(S.levels[list[i - 1].lv.id] && S.levels[list[i - 1].lv.id].stars); }

/* ---------- sound with captions ---------- */
let AC = null, capTimer = 0;
function beep(freq, dur, type, cap) {
  if (cap && S.set.cap) { $('cap').textContent = '[sound: ' + cap + ']'; $('cap').hidden = false; clearTimeout(capTimer); capTimer = setTimeout(function () { $('cap').hidden = true; }, 1600); }
  if (!S.set.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.07, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
  } catch (e) { /* no sound available */ }
}

/* ---------- 3D building blocks ---------- */
let renderer, scene, cam, camZ = 22, G = {}, mats = {}, texCache = {};
const COLORS = [['Sky blue', '#56B4E9'], ['Orange', '#E69F00'], ['Green', '#009E73'], ['Pink', '#CC79A7'], ['Yellow', '#F0E442'], ['Red-orange', '#D55E00']];
const GEAR = [['None', 0], ['Lab goggles', 3], ['Explorer cape', 8], ['Ribosome hat', 12]];
const THEMES = {
  space: { sky: '#0b1d2a', fog: '#102c3d', ground: '#1d4257', top: '#6fc3d8', pal: ['#2f7f9a', '#ffd166', '#5fd0c5', '#8a7fd6'], shapes: ['blob', 'ring', 'blob'] },
  pond: { sky: '#8fd0e8', fog: '#c4e8ee', ground: '#3f7d4e', top: '#7bc47f', pal: ['#2f6b45', '#4f9a5a', '#8ccf7a', '#5aa9c9'], shapes: ['tree', 'tree', 'hill', 'blob'] },
  cell: { sky: '#123a52', fog: '#1b5a70', ground: '#1f6f78', top: '#5fd0c5', pal: ['#f4a259', '#8cb369', '#bc4b51', '#f4e285', '#7fb7e6'], shapes: ['bean', 'blob', 'ring', 'blob'] },
  nucleus: { sky: '#241a47', fog: '#3a2a6b', ground: '#4b3a8c', top: '#a58bff', pal: ['#ff9f6e', '#7fd4ff', '#f4e285', '#c59cff'], shapes: ['ring', 'blob', 'pillar', 'bean'] },
  membrane: { sky: '#0e3b43', fog: '#16606a', ground: '#a8662c', top: '#f2c078', pal: ['#f2c078', '#5fd0c5', '#e8875a', '#9fe0d6'], shapes: ['pillar', 'blob', 'pillar', 'ring'] },
  body: { sky: '#4a0f1e', fog: '#7a1f2e', ground: '#8f2d3f', top: '#f4a0a0', pal: ['#e85d5d', '#ffb3a7', '#c9364a', '#f7d6c8'], shapes: ['disc', 'disc', 'blob'] }
};
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
    const b = mesh('sph', '#ffd166'); b.scale.setScalar(0.09); b.position.set(off, top + 0.38, 0); g.add(b);
  }
  if (a.gear === 2) { const cape = mesh('box', '#D55E00'); cape.scale.set(sc[0] * 1.7, sc[1] * 1.5, 0.06); cape.position.set(0, sc[1] * 0.95, -sc[2] - 0.05); cape.rotation.x = 0.18; g.add(cape); }
  if (a.gear === 3) {
    const h1 = mesh('sph', '#a58bff'); h1.scale.set(0.3, 0.2, 0.3); h1.position.set(0, top + 0.08, 0); g.add(h1);
    const h2 = mesh('sph', '#c59cff'); h2.scale.set(0.2, 0.14, 0.2); h2.position.set(0, top + 0.3, 0); g.add(h2);
  }
  return g;
}
function decor(th, x0, x1, grp, anim) {
  const dens = S.set.low ? 0.45 : 1, fog = new T.Color(th.fog);
  const layers = [{ z: -7, s: 1, n: 0.1, f: 0.1 }, { z: -17, s: 2.2, n: 0.085, f: 0.3 }, { z: -33, s: 4.5, n: 0.06, f: 0.5 }, { z: -60, s: 9, n: 0.04, f: 0.68 }, { z: 6, s: 0.5, n: 0.035, f: 0, fore: true }];
  layers.forEach(function (ly) {
    const span = (x1 - x0) + 60 + Math.abs(ly.z) * 2, count = Math.round(span * ly.n * dens);
    for (let i = 0; i < count; i++) {
      const shape = ly.fore ? 'blob' : th.shapes[Math.floor(Math.random() * th.shapes.length)];
      const c = new T.Color(th.pal[Math.floor(Math.random() * th.pal.length)]).lerp(fog, ly.f);
      const col = '#' + c.getHexString(), s = ly.s * rnd(0.7, 1.4);
      const x = rnd(x0 - 30 - Math.abs(ly.z), x1 + 30 + Math.abs(ly.z)), z = ly.z + rnd(-2, 2);
      let m, floaty = true, y = rnd(-4, 14) * (ly.fore ? 0.7 : Math.max(1, ly.s * 0.45));
      if (shape === 'tree') { m = mesh('cone', col); m.scale.set(s * 1.1, s * 2.2, s * 1.1); y = -1 + s * 2.2; floaty = false; }
      else if (shape === 'hill') { m = mesh('sph', col); m.scale.set(s * 5, s * 2.4, s * 3); y = -2; floaty = false; }
      else if (shape === 'pillar') { m = mesh('cyl', col); m.scale.set(s * 0.5, s * 7, s * 0.5); y = rnd(-3, 3); floaty = false; }
      else if (shape === 'bean') { m = mesh('sph', col); m.scale.set(s * 1.7, s * 0.75, s * 0.75); m.rotation.z = rnd(0, 3); }
      else if (shape === 'ring') { m = mesh('tor', col); m.scale.setScalar(s); m.rotation.set(rnd(0, 3), rnd(0, 3), 0); }
      else if (shape === 'disc') { m = mesh('sph', col); m.scale.set(s * 1.2, s * 0.4, s * 1.2); m.rotation.set(rnd(0, 3), 0, rnd(0, 3)); }
      else { m = mesh('sph', col, ly.fore ? 0.2 : 1); m.scale.set(s * rnd(0.8, 1.3), s * rnd(0.8, 1.3), s); }
      m.position.set(x, y, z); grp.add(m);
      if (floaty && !S.set.low) anim.push({ m: m, y: y, ph: rnd(0, 6), amp: 0.3 * ly.s, rot: rnd(-0.2, 0.2) });
    }
  });
}

/* ---------- game state ---------- */
let L = null, P = null, mode = 'menu', paused = false, last = 0, menuAlien = null, menuGrp = null, backTo = 'menu';
const keys = { left: false, right: false, jump: false, act: false };
let jumpBuf = 0, coyote = 0, actEdge = false, toastT = 0;
const HW = 0.42, PH = 1.35, SPEED = 7.2, JUMP = 16, GRAV = 40;

function teardown() {
  if (L) scene.remove(L.group);
  if (menuGrp) { scene.remove(menuGrp); menuGrp = null; }
  Object.keys(texCache).forEach(function (k) { texCache[k].dispose(); }); texCache = {};
  L = null;
}
function addSolid(x0, x1, y0, y1, o) {
  const s = Object.assign({ x0: x0, x1: x1, y0: y0, y1: y1, oneWay: false, off: false }, o || {}); L.solids.push(s); return s;
}
function addGround(x0, x1, y) {
  addSolid(x0, x1, y - 14, y);
  L.group.add(box(x0, x1, y - 14, y - 0.3, 7, L.th.ground)); L.group.add(box(x0, x1, y - 0.3, y, 7.2, L.th.top));
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
      for (let i = 0; i < n; i++) { const m = mesh('oct', '#ffd166'); m.scale.setScalar(0.26); m.position.set(b.x + dx + i * 1.3, b.y + dy, 0); L.group.add(m); L.sparks.push({ x: m.position.x, y: m.position.y, m: m }); }
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
        const gem = mesh('ico', '#bfe9ff'); gem.scale.setScalar(0.42); g.add(gem);
        const lb = label(it.text, 3.5); lb.position.y = 1.25; g.add(lb);
        g.position.set(x, y, 0); L.group.add(g); L.tokens.push({ x: x, y: y, it: it, door: door, m: g, gem: gem });
      });
      door.solid = addSolid(wx, wx + 1.2, b.y, b.y + 18); door.mesh = box(wx, wx + 1.2, b.y, b.y + 18, 5, '#ffd166', 0.5); L.group.add(door.mesh);
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
    boss: function (name, tag, n) {
      const pool = Object.keys(QMAP).map(function (k) { return QMAP[k]; }).filter(function (q) { return q.world === L.world.id && q.tags && q.tags.indexOf(tag) >= 0; });
      const missed = shuffle(pool.filter(function (q) { return S.missed[q.id]; })), rest = shuffle(pool.filter(function (q) { return !S.missed[q.id]; }));
      const qs = missed.concat(rest).slice(0, n); if (qs.length) makeStation(shuffle(qs), { boss: name }); return b;
    },
    goal: function () {
      addGround(b.x, b.x + 10, b.y);
      const g = new T.Group(), hull = mesh('sph', '#cfd8e3'); hull.scale.set(1.7, 0.45, 1.7); g.add(hull);
      const dome = mesh('sph', '#7fd4ff', 0.7); dome.scale.set(0.8, 0.6, 0.8); dome.position.y = 0.35; g.add(dome);
      g.position.set(b.x + 6, b.y + 1.6, 0); L.group.add(g); L.goal = { x: b.x + 6, y: b.y, m: g };
      const sp = label('Scout pod: send report', 4.4); sp.position.set(b.x + 6, b.y + 4.4, 0); L.group.add(sp);
      b.x += 10; return b;
    }
  };
  function makeStation(qs, o) {
    const n = Math.max.apply(null, qs.map(function (q) { return q.options.length; }));
    const x0 = b.x, wx = x0 + 5 + n * 3.6 + 0.4; addGround(x0, wx + 7, b.y);
    const st = { x0: x0 + 1.5, x1: wx, y: b.y, pads: [], queue: qs, qi: 0, done: false, title: o.title || '', boss: null, tried: {} };
    for (let i = 0; i < n; i++) {
      const px = x0 + 5 + i * 3.6, top = b.y + (i % 2 ? 2.8 : 1.8);
      const s = addSolid(px, px + 2.7, top - 1, top, { oneWay: true, pad: i, st: st });
      const m = box(px, px + 2.7, top - 1, top, 3, '#3d8bd4'); L.group.add(m);
      const lb = label(String.fromCharCode(65 + i), 1.9, { big: true }); lb.position.set(px + 1.35, top - 0.52, 1.6); L.group.add(lb);
      st.pads.push({ s: s, m: m, lb: lb, i: i });
    }
    st.wall = addSolid(wx, wx + 1.2, b.y, b.y + 18); st.wallMesh = box(wx, wx + 1.2, b.y, b.y + 18, 5, '#ffd166', 0.5); L.group.add(st.wallMesh);
    if (o.boss) {
      const g = new T.Group(), core = mesh('ico', '#3b1030'); core.scale.setScalar(1.9); g.add(core);
      [-0.6, 0.6].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.32); e.position.set(ex, 0.4, 1.6); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.15); p.position.set(ex, 0.4, 1.86); g.add(p); });
      g.position.set(wx + 3.6, b.y + 6, 0); L.group.add(g); st.boss = { name: o.boss, m: g, hp: qs.length, max: qs.length, y: b.y + 6 };
    }
    L.stations.push(st); L.total += qs.length; b.x = wx + 7; L.cps.push({ x: wx + 3.5, y: b.y });
  }
  return b;
}
function doorText(d) {
  d.label.material.map = labelTex('Collected ' + d.got + ' of ' + d.need); d.label.material.needsUpdate = true;
}
function startLevel(w, lv) {
  teardown();
  const th = THEMES[lv.theme] || THEMES.cell;
  L = { world: w, lv: lv, th: th, group: new T.Group(), solids: [], tokens: [], sparks: [], stations: [], doors: [], cps: [{ x: 2, y: 0 }], anim: [], used: {},
    score: 0, streak: 0, hp: 5, time: 0, first: 0, total: 0, active: null, cp: 0, goal: null, over: false };
  scene.add(L.group); scene.background = new T.Color(th.sky); scene.fog = new T.Fog(th.fog, 30, 120);
  const b = builder(); lv.build(b); L.len = b.x;
  decor(th, 0, L.len, L.group, L.anim);
  P = { x: 2, y: 0, vx: 0, vy: 0, ground: null, face: 1, m: buildAlien(S.alien), t: 0 };
  L.group.add(P.m);
  const sh = mesh('sph', '#000000', 0.25); sh.scale.set(0.5, 0.04, 0.4); L.group.add(sh); P.shadow = sh;
  cam.position.set(P.x + 4, 5, camZ);
  mode = 'play'; paused = false; actEdge = false; jumpBuf = 0; show(null); $('hud').hidden = false; $('touch').hidden = !touchMode;
  $('hudLevel').textContent = lv.id + ' ' + lv.title; hud(); closeQ();
  toast(lv.log || '', 7);
}
function hud() {
  let h = ''; for (let i = 0; i < 5; i++) h += i < L.hp ? '●' : '○';
  $('hudHp').textContent = h; $('hudHp').setAttribute('aria-label', 'Energy ' + L.hp + ' of 5');
  $('hudScore').textContent = L.score; $('hudStreak').textContent = L.streak > 1 ? 'Streak ×' + L.streak : '';
}
function toast(text, secs) { if (!text) return; $('toast').textContent = text; $('toast').hidden = false; toastT = secs || 4; }
function record(q, ok) {
  const c = S.codes[q.code] = S.codes[q.code] || { right: 0, tries: 0, world: L.world.id }; c.tries++; if (ok) c.right++;
  if (q.id) { if (ok) { if (S.missed[q.id]) { S.missed[q.id]--; if (S.missed[q.id] <= 0) delete S.missed[q.id]; } } else S.missed[q.id] = (S.missed[q.id] || 0) + 1; }
}
function hurt() {
  L.hp--; L.streak = 0; beep(160, 0.3, 'sawtooth', 'low buzz, not correct');
  if (L.hp <= 0) { L.hp = 5; L.score = Math.max(0, L.score - 100); respawn(); toast('Out of energy. Recharged at the last checkpoint.', 4); }
  hud();
}
function respawn() { const c = L.cps[L.cp]; P.x = c.x; P.y = c.y + 0.1; P.vx = P.vy = 0; }

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
  st.tried = {}; st.firstTry = true;
  st.pads.forEach(function (p) { const on = p.i < q.options.length; p.s.off = !on; p.m.visible = on; p.lb.visible = on; p.m.material = mat('#3d8bd4'); });
  let meta = st.boss ? st.boss.name + ': ' + '■'.repeat(st.boss.hp) + '□'.repeat(st.boss.max - st.boss.hp) : (st.title || 'Question ' + (st.qi + 1) + ' of ' + st.queue.length);
  $('qmeta').textContent = meta;
  $('qprompt').innerHTML = esc(q.prompt) + (q.stem ? '<span class="stem">' + esc(q.stem) + '</span>' : '');
  $('qfig').innerHTML = figHTML(q.figure);
  $('qopts').innerHTML = st.perm.map(function (oi, i) { return '<button type="button" class="opt" data-i="' + i + '"><b>' + String.fromCharCode(65 + i) + '</b> ' + esc(q.options[oi]) + '</button>'; }).join('');
  $('qfb').textContent = ''; $('qpanel').hidden = false;
}
function closeQ() { if (L) L.active = null; $('qpanel').hidden = true; }
function answer(i) {
  const st = L.active; if (!st || st.done || st.tried[i]) return;
  const q = st.queue[st.qi]; if (i >= q.options.length) return;
  const ok = st.perm[i] === q.answer;
  if (st.firstTry) record(q, ok);
  if (ok) {
    if (st.firstTry) { L.first++; L.streak++; L.score += 100 + Math.min(L.streak, 5) * 20; } else L.score += 40;
    beep(880, 0.25, 'sine', 'chime, correct'); toast('✓ Correct. ' + q.explain, 5);
    if (st.boss) { st.boss.hp--; st.boss.m.scale.setScalar(0.45 + 0.55 * st.boss.hp / st.boss.max); }
    st.qi++;
    if (st.qi >= st.queue.length) {
      st.done = true; st.wall.off = true; st.wallMesh.visible = false; if (st.boss) st.boss.m.visible = false;
      st.pads.forEach(function (p) { p.lb.visible = false; }); closeQ(); if (st.boss) toast('✓ ' + st.boss.name + ' is back in balance. ' + q.explain, 6);
    } else openQ(st);
  } else {
    st.tried[i] = 1; st.firstTry = false; st.pads[i].m.material = mat('#5a6470');
    const btn = $('qopts').querySelector('[data-i="' + i + '"]'); if (btn) { btn.disabled = true; btn.classList.add('no'); }
    $('qfb').textContent = '✗ Not that one. ' + (q.hint || q.explain); hurt();
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
    else if (dy <= 0) { P.y = s.y1; P.vy = 0; P.ground = s; } else { P.y = s.y0 - PH; P.vy = 0; }
  });
}
function step(dt) {
  L.time += dt; P.t += dt;
  const ax = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  if (ax) P.face = ax;
  P.vx += (ax * SPEED - P.vx) * Math.min(1, dt * 14);
  jumpBuf -= dt; coyote = P.ground ? 0.1 : coyote - dt;
  if (jumpBuf > 0 && coyote > 0) { P.vy = JUMP; jumpBuf = 0; coyote = 0; beep(420, 0.08, 'triangle'); }
  if (!keys.jump && P.vy > 0) P.vy -= 50 * dt;
  P.vy = Math.max(-30, P.vy - GRAV * dt);
  moveX(P.vx * dt); moveY(P.vy * dt);
  if (P.y < -16) { respawn(); L.score = Math.max(0, L.score - 25); toast('You fell. Back to the last checkpoint.', 3); hud(); }
  for (let i = L.cp + 1; i < L.cps.length; i++) if (P.x > L.cps[i].x) L.cp = i;

  L.sparks.forEach(function (s) { if (!s.got && Math.abs(P.x - s.x) < 0.7 && Math.abs(P.y + 0.7 - s.y) < 0.9) { s.got = 1; s.m.visible = false; L.score += 10; beep(1200, 0.06, 'square'); hud(); } s.m.rotation.y += dt * 3; });
  L.tokens.forEach(function (t) {
    if (t.got) return; t.gem.rotation.y += dt * 2;
    if (Math.abs(P.x - t.x) < 0.8 && Math.abs(P.y + 0.7 - t.y) < 0.95) {
      t.got = 1; t.m.visible = false; L.total++;
      record({ code: t.door.set.code }, t.it.good);
      if (t.it.good) { L.first++; L.streak++; L.score += 50; t.door.got++; doorText(t.door); beep(880, 0.15, 'sine', 'chime, correct'); toast('✓ ' + t.it.text, 2.5);
        if (t.door.got >= t.door.need) { t.door.solid.off = true; t.door.mesh.visible = false; t.door.label.visible = false; toast('✓ All collected. The gate is open.', 3); } }
      else { toast('✗ ' + t.it.text + ': ' + t.it.explain, 6); hurt(); }
      hud();
    }
  });
  let near = null;
  L.stations.forEach(function (st) { if (!st.done && P.x > st.x0 && P.x < st.x1) near = st; if (st.boss && st.boss.m.visible) { st.boss.m.position.y = st.boss.y + Math.sin(P.t * 2) * 0.5; st.boss.m.rotation.y = Math.sin(P.t) * 0.4; } });
  if (near !== L.active) { if (near) openQ(near); else closeQ(); }
  if (actEdge) { actEdge = false; if (L.active && P.ground && P.ground.st === L.active) answer(P.ground.pad); else if (L.active) $('qfb').textContent = 'Jump onto a lettered pad first, then press E.'; }
  if (L.goal) { L.goal.m.position.y = L.goal.y + 1.6 + Math.sin(P.t * 2) * 0.2; L.goal.m.rotation.y += dt; if (Math.abs(P.x - L.goal.x) < 1.3 && !L.over) finish(); }

  P.m.position.set(P.x, P.y + (P.ground ? Math.abs(Math.sin(P.t * 11)) * 0.07 * Math.min(1, Math.abs(P.vx) / 3) : 0), 0);
  P.m.rotation.y += (P.face * 0.75 - P.m.rotation.y) * Math.min(1, dt * 10);
  const sq = P.ground ? 1 : 1 + Math.min(0.18, Math.abs(P.vy) * 0.012); P.m.scale.set(1 / sq, sq, 1 / sq);
  P.shadow.position.set(P.x, (P.ground ? P.y : P.y - 0.5) + 0.03, 0); P.shadow.visible = !!P.ground;
  cam.position.x += (P.x + P.face * 2.5 - cam.position.x) * Math.min(1, dt * 4);
  cam.position.y += (P.y + 5.2 - cam.position.y) * Math.min(1, dt * 3); cam.position.z = camZ;
  cam.lookAt(cam.position.x, cam.position.y - 0.6, 0);
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
  beep(660, 0.5, 'sine', 'fanfare, level complete');
  $('doneTitle').textContent = L.lv.id + ' ' + L.lv.title + ': report sent';
  $('doneStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); $('doneStars').setAttribute('aria-label', stars + ' of 3 stars');
  $('doneBody').innerHTML = '<p>' + esc(L.lv.outro || '') + '</p><dl><dt>Score</dt><dd>' + L.score + (L.score > old.best && old.best ? ' (new best)' : '') + '</dd><dt>Right on the first try</dt><dd>' + L.first + ' of ' + L.total + '</dd><dt>Speed bonus</dt><dd>' + bonus + '</dd></dl>' +
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
  teardown(); mode = 'menu'; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; $('qpanel').hidden = true;
  const th = THEMES.space; scene.background = new T.Color(th.sky); scene.fog = new T.Fog(th.fog, 12, 90);
  menuGrp = new T.Group(); scene.add(menuGrp);
  const pad = mesh('cyl', th.ground); pad.scale.set(1.8, 0.3, 1.8); pad.position.y = -0.15; menuGrp.add(pad);
  const rim = mesh('tor', th.top); rim.scale.setScalar(1.75); rim.rotation.x = Math.PI / 2; rim.scale.z = 0.3; menuGrp.add(rim);
  menuGrp.userData.anim = []; decor(th, -10, 10, menuGrp, menuGrp.userData.anim); refreshAlien(); show('menu'); buildMenu();
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
  $('setText').value = S.set.text; $('setLow').checked = S.set.low; $('setSound').checked = S.set.sound; $('setCap').checked = S.set.cap; $('setUnlock').checked = S.set.unlock;
  if (renderer) resize();
}
function pause(on) {
  if (mode !== 'play') return; paused = on; show(on ? 'pause' : null);
  if (on) {
    const v = (BQ.data[L.world.id] || {}).vocab || [];
    $('guide').innerHTML = v.map(function (t) { return '<dt>' + esc(t.term) + '</dt><dd>' + esc(t.def) + '</dd>'; }).join(''); $('btnResume').focus();
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
    menuGrp.userData.anim.forEach(function (a) { a.m.position.y = a.y + Math.sin(t / 1600 + a.ph) * a.amp; });
  }
  renderer.render(scene, cam);
}

/* ---------- controls ---------- */
let touchMode = false;
const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'jump', ArrowUp: 'jump', w: 'jump', W: 'jump', e: 'act', E: 'act', Enter: 'act', ArrowDown: 'act', s: 'act', S: 'act' };
function press(k, down) {
  if (k === 'jump' && down && !keys.jump) jumpBuf = 0.12;
  if (k === 'act' && down && !keys.act) actEdge = true;
  keys[k] = down;
}
function wire() {
  window.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (mode === 'play' && (e.key === 'p' || e.key === 'P' || e.key === 'Escape')) { pause(!paused); e.preventDefault(); return; }
    if (mode !== 'play' || paused) return;
    if (e.target && e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) e.target.blur();
    const k = KEYMAP[e.key];
    if (k) { press(k, true); e.preventDefault(); } else if (/^[1-4]$/.test(e.key)) answer(+e.key - 1);
  });
  window.addEventListener('keyup', function (e) { const k = KEYMAP[e.key]; if (k) press(k, false); });
  window.addEventListener('blur', function () { Object.keys(keys).forEach(function (k) { keys[k] = false; }); if (mode === 'play' && !paused) pause(true); });
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
  ['Low', 'Sound', 'Cap', 'Unlock'].forEach(function (n) { $('set' + n).onchange = function () { S.set[{ Low: 'low', Sound: 'sound', Cap: 'cap', Unlock: 'unlock' }[n]] = $('set' + n).checked; save(); applySettings(); }; });
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
  if (/teacher/i.test(location.hash)) $('teacherRow').hidden = false;
  try {
    renderer = new T.WebGLRenderer({ canvas: $('stage'), antialias: !S.set.low });
  } catch (e) { $('err').hidden = false; return; }
  scene = new T.Scene(); cam = new T.PerspectiveCamera(42, 16 / 9, 0.5, 400);
  scene.add(new T.HemisphereLight(0xffffff, 0x334455, 0.85));
  const sun = new T.DirectionalLight(0xffffff, 0.75); sun.position.set(4, 10, 8); scene.add(sun);
  G = { box: new T.BoxGeometry(1, 1, 1), sph: new T.SphereGeometry(1, 18, 12), tor: new T.TorusGeometry(1, 0.28, 8, 22), cone: new T.ConeGeometry(1, 2, 8),
    cyl: new T.CylinderGeometry(1, 1, 1, 12), ico: new T.IcosahedronGeometry(1, 0), oct: new T.OctahedronGeometry(1, 0) };
  wire(); applySettings(); menuScene(); requestAnimationFrame(tick);
  BQ._debug = { state: function () { return { mode: mode, L: L, P: P, S: S }; }, answer: answer, start: startLevel };
}
})();

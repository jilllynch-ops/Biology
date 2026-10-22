/* EARTHLING FIELD GUIDE: CREATURES
   Custom 3-D wildlife built in code (no downloads): birds with shaped bodies, two-part wings that bend at the wrist,
   fanned tails and real markings; butterflies with true wing outlines and painted patterns. Each animal moves with
   its own rhythm: flapping and gliding, banking into turns, flaring to land, fluttering and resting on flowers.
   Used by the Cozy Exploration mode and the opening story. Everything is made of a few meshes so it stays fast. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ || !window.THREE) return;
const T = window.THREE;
const col = function (c) { return new T.Color(c); };
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function smooth(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
function lerp(a, b, u) { return a + (b - a) * u; }

/* ---------- merge several shapes into one mesh, painting each vertex with a color function ---------- */
function merge(parts) {
  const pos = [], nor = [], cl = [], v = new T.Vector3(), n = new T.Vector3(), c = new T.Color();
  parts.forEach(function (p) {
    const g = p.geo.index ? p.geo.toNonIndexed() : p.geo; if (p.m) g.applyMatrix4(p.m); if (!g.attributes.normal) g.computeVertexNormals();
    const P = g.attributes.position, N = g.attributes.normal;
    for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); n.fromBufferAttribute(N, i); pos.push(v.x, v.y, v.z); nor.push(n.x, n.y, n.z); if (typeof p.color === 'function') c.copy(p.color(v)); else c.set(p.color); cl.push(c.r, c.g, c.b); }
  });
  const out = new T.BufferGeometry(); out.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); out.setAttribute('color', new T.Float32BufferAttribute(cl, 3)); return out;
}
function M4(x, y, z, rx, ry, rz, sx, sy, sz) { const o = new T.Object3D(); o.position.set(x || 0, y || 0, z || 0); o.rotation.set(rx || 0, ry || 0, rz || 0); o.scale.set(sx || 1, sy || sx || 1, sz || sx || 1); o.updateMatrix(); return o.matrix; }

/* ---------- BIRDS ---------- */
const BIRDS = {
  robin:    { len: 0.46, span: 1.55, back: '#6a5a4e', belly: '#e0763a', head: '#2e2a28', cov: '#6e5e52', prim: '#3e3632', tail: '#2e2a28', beak: '#e8b030', patch: 'breast', freq: 6.5, dih: 0.1, eye: '#f4f0e8' },
  cardinal: { len: 0.44, span: 1.3, back: '#c41e24', belly: '#d8323a', head: '#d0242a', cov: '#a8181e', prim: '#8a1418', tail: '#a01a20', beak: '#f07a40', mask: '#16100e', crest: 1, freq: 7, dih: 0.1 },
  jay:      { len: 0.52, span: 1.5, back: '#4a7ac8', belly: '#eef0f2', head: '#5a8ad8', cov: '#3a6ac0', prim: '#2a5ab0', tail: '#3a6ac8', beak: '#1a1a1a', crest: 1, bars: 1, necklace: 1, freq: 6, dih: 0.1 },
  blackbird:{ len: 0.44, span: 1.45, back: '#141414', belly: '#1a1a1a', head: '#121212', cov: '#181818', prim: '#101010', tail: '#121212', beak: '#202020', epaulet: 1, freq: 7, dih: 0.12, eye: '#2a2a2a' },
  crow:     { len: 0.72, span: 2.1, back: '#16161c', belly: '#1a1a20', head: '#141418', cov: '#1c1c24', prim: '#101016', tail: '#141418', beak: '#0e0e12', freq: 3.4, dih: 0.12, fingers: 1 },
  gull:     { len: 0.86, span: 2.7, back: '#b8c0c8', belly: '#f6f8fa', head: '#f8fafc', cov: '#b8c0c8', prim: '#c0c8d0', tail: '#f4f6f8', beak: '#f0c030', tips: 1, freq: 2.4, dih: 0.2, eye: '#f0f0f0' },
  hawk:     { len: 0.95, span: 2.6, back: '#6a4a30', belly: '#f0e4d0', head: '#7a5a3a', cov: '#7a5636', prim: '#4a3424', tail: '#c4562a', beak: '#3a3a3a', band: 1, freq: 2, dih: 0.18, fingers: 1, belt: 1 }
};
function bodyColor(sp) {
  const back = col(sp.back), belly = col(sp.belly), patch = col(sp.belly), tmp = new T.Color();
  return function (v) {
    const u = smooth((v.y + 0.06) / 0.14); tmp.copy(belly).lerp(back, u);
    if (sp.patch === 'breast' && v.z > -0.12 && v.y < 0.05) tmp.copy(patch);
    if (sp.necklace && v.z > 0.12 && v.z < 0.24 && v.y < 0.04 && v.y > -0.08) tmp.set('#1a1a2a');
    if (sp.belt && v.z > -0.05 && v.z < 0.08 && v.y < -0.04) tmp.set('#8a6a4a');
    return tmp;
  };
}
function headColor(sp) {
  const h = col(sp.head), tmp = new T.Color();
  return function (v) {
    tmp.copy(h); if (sp.mask && v.z > 0.47 && v.y < 0.16) tmp.set(sp.mask);
    if (sp.necklace && v.y < 0.07) tmp.set('#eef0f2');
    if (sp.patch === 'breast' && v.y < 0.03) tmp.set('#2e2a28');
    if (sp === BIRDS.robin && Math.abs(v.x) > 0.075 && v.y > 0.1 && v.y < 0.15) tmp.set('#f4f0e8');
    return tmp;
  };
}
/* a wing made of a grid: leading edge in front, feathers along the trailing edge, each feather tip shaped */
function wingGeo(sp, part) {
  const nI = part === 'in' ? 5 : 8, nJ = 4, span = sp.span / 2 * (part === 'in' ? 0.42 : 0.58), pos = [], cl = [], idx = [], c = new T.Color();
  const chord = function (u) { return part === 'in' ? 0.34 - 0.04 * u : lerp(0.3, sp.fingers ? 0.16 : 0.08, Math.pow(u, 1.4)); };
  for (let i = 0; i <= nI; i++) {
    const u = i / nI, x = u * span, lead = part === 'in' ? 0.06 * Math.sin(u * 1.5) : 0.06 - 0.16 * u * u, ch = chord(u) * (sp.len / 0.46) * 0.95;
    for (let j = 0; j <= nJ; j++) {
      const v = j / nJ, tip = j === nJ ? (i % 2 ? 0.88 : 1.06) : 1, z = lead * (sp.len / 0.46) - ch * v * tip, y = 0.035 * Math.sin(Math.PI * v) * ch * 3;
      pos.push(x, y, z);
      const uu = part === 'in' ? u * 0.42 : 0.42 + u * 0.58; c.set(v < 0.42 ? sp.cov : sp.prim);
      if (sp.epaulet && uu < 0.3 && v < 0.38) c.set(v < 0.27 ? '#e0201a' : '#f0d040');
      if (sp.bars && v > 0.45) c.set((Math.floor(uu * 14) % 2) ? '#1a2a5a' : sp.prim); if (sp.bars && j === nJ) c.set('#f4f6fa');
      if (sp.tips && uu > 0.78) c.set(j === nJ && i % 3 === 0 ? '#ffffff' : '#1a1a1e');
      if (sp.band && j === nJ) c.set('#2a1e14');
      if (j === nJ && !sp.tips && !sp.bars && !sp.band) c.offsetHSL(0, 0, -0.06);
      cl.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < nI; i++) for (let j = 0; j < nJ; j++) { const a = i * (nJ + 1) + j, b = a + nJ + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(cl, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
function tailGeo(sp) {
  const n = 7, pos = [0, 0, 0], cl = [], c0 = col(sp.tail), idx = [], L = sp.len * 0.55, W0 = sp.len * 0.28;
  c0.toArray(cl, 0);
  for (let i = 0; i <= n; i++) { const a = (i / n - 0.5) * 0.9, r = L * (i % 2 ? 0.9 : 1); pos.push(Math.sin(a) * W0 * 1.6, 0, -Math.cos(a) * r); const c = c0.clone(); if (sp === BIRDS.gull && i % 2) c.set('#e8ecf0'); if (sp.band) c.set(i % 2 ? '#d06a3a' : '#b4482a'); cl.push(c.r, c.g, c.b); }
  for (let i = 1; i <= n; i++) idx.push(0, i, i + 1);
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new T.Float32BufferAttribute(cl, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const birdGeoCache = {};
function birdGeos(kind) {
  if (birdGeoCache[kind]) return birdGeoCache[kind]; const sp = BIRDS[kind], SR = sp.len / 0.46, S = 1;
  /* body: a teardrop turned to lie forward (+z) */
  const prof = [[0.001, -0.3], [0.05, -0.27], [0.11, -0.18], [0.155, -0.06], [0.165, 0.04], [0.145, 0.14], [0.1, 0.22], [0.06, 0.26], [0.001, 0.27]].map(function (p) { return new T.Vector2(p[0] * S, p[1] * S); });
  const body = new T.LatheGeometry(prof, 12); body.rotateX(Math.PI / 2); body.scale(1, 0.92, 1);
  const head = new T.SphereGeometry(0.095 * S, 12, 9);
  const beakLen = (kind === 'gull' ? 0.11 : kind === 'crow' ? 0.1 : kind === 'hawk' ? 0.07 : kind === 'cardinal' ? 0.07 : 0.075) * S, beakR = (kind === 'cardinal' ? 0.04 : kind === 'hawk' ? 0.035 : 0.022) * S;
  const beak = new T.ConeGeometry(beakR, beakLen, 8); beak.rotateX(Math.PI / 2);
  const eye = new T.SphereGeometry(0.018 * S, 6, 5);
  const parts = [{ geo: body, color: bodyColor(sp) }, { geo: head, m: M4(0, 0.11 * S, 0.25 * S), color: headColor(sp) }, { geo: beak, m: M4(0, 0.095 * S, 0.25 * S + 0.09 * S + beakLen / 2 - 0.01 * S, kind === 'hawk' ? 0.35 : 0), color: sp.beak }];
  [-1, 1].forEach(function (sd) { parts.push({ geo: eye, m: M4(sd * 0.07 * S, 0.13 * S, 0.31 * S), color: '#0a0a0a' }); parts.push({ geo: new T.SphereGeometry(0.007 * S, 4, 3), m: M4(sd * 0.082 * S, 0.142 * S, 0.322 * S), color: '#ffffff' });
    if (sp.eye && kind !== 'robin') parts.push({ geo: new T.TorusGeometry(0.021 * S, 0.004 * S, 4, 10), m: M4(sd * 0.068 * S, 0.13 * S, 0.305 * S, 0, sd * 1.2, 0), color: sp.eye });
    parts.push({ geo: new T.CylinderGeometry(0.008 * S, 0.008 * S, 0.12 * S, 4), m: M4(sd * 0.04 * S, -0.16 * S, 0.0, 0.2), color: kind === 'gull' ? '#e8a080' : kind === 'hawk' ? '#e8c030' : '#5a4a3a' }); });
  if (sp.crest) parts.push({ geo: new T.ConeGeometry(0.04 * S, 0.12 * S, 6), m: M4(0, 0.19 * S, 0.21 * S, -0.7), color: sp.head });
  if (kind === 'gull') parts.push({ geo: new T.SphereGeometry(0.01 * S, 4, 3), m: M4(0, 0.075 * S, 0.25 * S + 0.09 * S + beakLen * 0.85), color: '#e04030' });
  const bodyG = merge(parts); bodyG.scale(SR, SR, SR); birdGeoCache[kind] = { body: bodyG, tail: tailGeo(sp), win: wingGeo(sp, 'in'), wout: wingGeo(sp, 'out') };
  return birdGeoCache[kind];
}
const MATS = {};
function vmat(key, opts) { if (!MATS[key]) MATS[key] = new T.MeshLambertMaterial(Object.assign({ vertexColors: true }, opts || {})); return MATS[key]; }
function makeBird(kind) {
  const sp = BIRDS[kind], gs = birdGeos(kind), S = sp.len / 0.46, g = new T.Group(), root = new T.Group(); g.add(root);
  const body = new T.Mesh(gs.body, vmat('bird')); root.add(body);
  const tail = new T.Mesh(gs.tail, vmat('bird2', { side: T.DoubleSide })); tail.position.set(0, 0.02 * S, -0.22 * S); root.add(tail);
  const wings = [-1, 1].map(function (sd) {
    const side = new T.Group(); side.position.set(sd * 0.11 * S, 0.06 * S, 0.06 * S); side.scale.x = sd; root.add(side); const sh = new T.Group(); side.add(sh);
    const inn = new T.Mesh(gs.win, vmat('bird2', { side: T.DoubleSide })); sh.add(inn);
    const wr = new T.Group(); wr.position.x = sp.span / 2 * 0.42; sh.add(wr); const out = new T.Mesh(gs.wout, vmat('bird2', { side: T.DoubleSide })); wr.add(out);
    return { side: side, sh: sh, wr: wr, sd: sd };
  });
  return { g: g, root: root, tail: tail, wings: wings, sp: sp, kind: kind, ph: Math.random() * 6.28, S: S };
}
/* pose: mode 'flap' (amount 0..1), 'glide', 'perch' (folded), with landing flare */
function poseBird(b, dt, mode, power, flare) {
  const sp = b.sp; b.ph += dt * sp.freq * (0.85 + 0.3 * (b.var || 0.5)) * Math.PI * 2 * (mode === 'flap' ? 1 : 0.35);
  let sh, wr, sweep = 0, fold = 1;
  if (mode === 'perch') { sh = -0.42; wr = 0; sweep = -1.52; fold = 0.3; }
  else if (mode === 'flap') { const ph = b.ph + 0.35 * Math.sin(b.ph); sh = sp.dih + (0.95 * power + 0.15) * Math.sin(ph); wr = 0.55 * Math.sin(ph - 0.9) * power - 0.05; sweep = -0.18 * Math.max(0, Math.cos(ph)) * power; }
  else { sh = sp.dih + Math.sin(b.ph * 0.5) * 0.03; wr = 0.06 + (flare ? -0.2 : 0); sweep = 0; }
  if (flare) { sweep -= 0.15 * flare; sh += 0.4 * flare * Math.sin(b.ph * 2); }
  b.wings.forEach(function (w) { w.sh.rotation.set(mode === 'perch' ? 0.12 : 0, sweep, sh); w.wr.rotation.set(0, mode === 'perch' ? 0 : 0.12 * Math.sin(b.ph - 1.5), wr); w.wr.scale.set(fold, 1, 1); w.side.position.set(w.sd * (mode === 'perch' ? 0.13 : 0.11) * b.S, (mode === 'perch' ? 0.1 : 0.06) * b.S, 0.06 * b.S); });
  b.tail.rotation.x = mode === 'perch' ? -0.25 + Math.sin(b.ph * 0.7) * 0.05 : -0.05 + (flare || 0) * 0.5 + Math.sin(b.ph) * 0.04 * power; b.tail.scale.x = mode === 'perch' ? 0.5 : 1 + (flare || 0) * 0.4;
  b.root.position.y = mode === 'flap' ? -Math.sin(b.ph) * 0.03 * b.S : 0;
}

/* ---------- BUTTERFLIES ---------- */
const BUTTERFLIES = {
  monarch: { size: 0.42, body: '#1a1210' }, swallowtail: { size: 0.5, body: '#1a1610', tails: 1 }, cabbage: { size: 0.3, body: '#3a3a36' },
  admiral: { size: 0.36, body: '#1a1210' }, azure: { size: 0.24, body: '#5a6a8a' } };
function wingTex(kind, fore) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), W0 = 128;
  const veins = function (c, lw) { g.strokeStyle = c; g.lineWidth = lw; for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(4, fore ? 70 : 60); g.quadraticCurveTo(50, fore ? 70 - k * 9 : 60 + k * 5, 124, fore ? 116 - k * 17 : 30 + k * 15); g.stroke(); } };
  const dots = function (c, r, n, edge) { g.fillStyle = c; for (let k = 0; k < n; k++) { const a = k / n; g.beginPath(); g.arc(edge ? 120 - Math.abs(a - 0.5) * 30 : 60 + a * 60, 10 + a * 108, r, 0, 6.3); g.fill(); } };
  if (kind === 'monarch') { g.fillStyle = '#ee7a1a'; g.fillRect(0, 0, W0, W0); const gr = g.createRadialGradient(10, 64, 4, 10, 64, 120); gr.addColorStop(0, 'rgba(255,170,60,0.5)'); gr.addColorStop(1, 'rgba(180,70,0,0.25)'); g.fillStyle = gr; g.fillRect(0, 0, W0, W0); veins('#1a1210', 5); g.lineWidth = 16; g.strokeStyle = '#141010'; g.strokeRect(-8, -8, W0 + 16, W0 + 16); if (fore) { g.fillStyle = '#141010'; g.fillRect(84, 0, 44, 46); } dots('#fff8f0', 2.6, 12, true); if (fore) { g.fillStyle = '#ffc070'; [[100, 20], [112, 30], [96, 36]].forEach(function (p) { g.beginPath(); g.arc(p[0], p[1], 3.5, 0, 6.3); g.fill(); }); } }
  if (kind === 'swallowtail') { g.fillStyle = '#f6d43a'; g.fillRect(0, 0, W0, W0); g.fillStyle = '#16120e'; if (fore) for (let k = 0; k < 4; k++) { g.save(); g.translate(18 + k * 26, 0); g.rotate(0.25); g.fillRect(0, -10, k === 0 ? 14 : 9, 150); g.restore(); } g.lineWidth = 20; g.strokeStyle = '#16120e'; g.strokeRect(-8, -8, W0 + 16, W0 + 16); dots('#f6d43a', 4, 9, true); if (!fore) { g.fillStyle = '#4a7ad0'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(70 + k * 12, 108, 5, 0, 6.3); g.fill(); } g.fillStyle = '#ee7a2a'; g.beginPath(); g.arc(36, 112, 6, 0, 6.3); g.fill(); } }
  if (kind === 'cabbage') { g.fillStyle = '#f6f4ea'; g.fillRect(0, 0, W0, W0); const gr = g.createLinearGradient(0, 64, 128, 64); gr.addColorStop(0, 'rgba(200,210,180,0.6)'); gr.addColorStop(0.4, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W0, W0); if (fore) { g.fillStyle = '#4a4a46'; g.beginPath(); g.moveTo(80, 0); g.lineTo(128, 0); g.lineTo(128, 50); g.closePath(); g.fill(); g.beginPath(); g.arc(80, 64, 7, 0, 6.3); g.fill(); } veins('rgba(150,160,140,0.5)', 1.5); }
  if (kind === 'admiral') { g.fillStyle = '#1a1612'; g.fillRect(0, 0, W0, W0); g.fillStyle = '#e8401e'; if (fore) { g.save(); g.translate(40, 128); g.rotate(-0.9); g.fillRect(0, -10, 130, 20); g.restore(); dots('#ffffff', 4, 5, true); } else { g.fillRect(0, 104, W0, 18); g.fillStyle = '#1a1612'; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(20 + k * 22, 113, 3, 0, 6.3); g.fill(); } } }
  if (kind === 'azure') { const gr = g.createRadialGradient(10, 64, 4, 10, 64, 120); gr.addColorStop(0, '#8ab4f0'); gr.addColorStop(1, '#c4d8f4'); g.fillStyle = gr; g.fillRect(0, 0, W0, W0); g.lineWidth = 6; g.strokeStyle = '#5a6a8a'; g.strokeRect(-3, -3, W0 + 6, W0 + 6); veins('rgba(90,110,150,0.4)', 1.2); }
  const t = new T.CanvasTexture(cv); return t;
}
function wingShape(fore, tails) {
  const s = new T.Shape();
  /* forewing: leading edge reaches out and slightly forward to a pointed tip; the outer edge curves back */
  if (fore) { s.moveTo(0, 0.03); s.bezierCurveTo(0.18, 0.12, 0.42, 0.2, 0.62, 0.22); s.quadraticCurveTo(0.66, 0.2, 0.63, 0.15); s.bezierCurveTo(0.56, 0.04, 0.48, -0.04, 0.38, -0.06); s.quadraticCurveTo(0.18, -0.06, 0, -0.01); }
  /* hindwing: a rounded fan behind the forewing (swallowtails add a tail) */
  else { s.moveTo(0, 0); s.bezierCurveTo(0.16, 0.02, 0.36, -0.02, 0.44, -0.1); s.bezierCurveTo(0.48, -0.2, 0.42, -0.3, 0.32, -0.34); if (tails) { s.lineTo(0.3, -0.5); s.quadraticCurveTo(0.26, -0.52, 0.25, -0.38); } s.bezierCurveTo(0.2, -0.38, 0.08, -0.32, 0.03, -0.22); s.quadraticCurveTo(0, -0.1, 0, 0); }
  const geo = new T.ShapeGeometry(s, 10); geo.rotateX(Math.PI / 2); /* lie flat: shape y becomes forward (+z) */
  geo.computeBoundingBox(); const bb = geo.boundingBox, P = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < P.count; i++) uv.setXY(i, (P.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (P.getZ(i) - bb.min.z) / (bb.max.z - bb.min.z));
  return geo;
}
const bfCache = {};
function bfAssets(kind) {
  if (bfCache[kind]) return bfCache[kind]; const sp = BUTTERFLIES[kind];
  const thorax = new T.SphereGeometry(0.035, 8, 6), abd = new T.CylinderGeometry(0.028, 0.012, 0.2, 7), headG = new T.SphereGeometry(0.03, 8, 6), ant = new T.CylinderGeometry(0.004, 0.004, 0.17, 3), club = new T.SphereGeometry(0.009, 5, 4);
  const body = merge([{ geo: thorax, m: M4(0, 0, 0.02, 0, 0, 0, 1, 1, 1.4), color: sp.body }, { geo: abd, m: M4(0, -0.005, -0.1, Math.PI / 2), color: sp.body }, { geo: headG, m: M4(0, 0.01, 0.09), color: sp.body },
    { geo: ant, m: M4(-0.03, 0.06, 0.16, 0.9, 0, 0.35), color: '#1a1410' }, { geo: ant, m: M4(0.03, 0.06, 0.16, 0.9, 0, -0.35), color: '#1a1410' }, { geo: club, m: M4(-0.06, 0.11, 0.22), color: '#1a1410' }, { geo: club, m: M4(0.06, 0.11, 0.22), color: '#1a1410' }]);
  bfCache[kind] = { body: body, fore: wingShape(true), hind: wingShape(false, sp.tails), tf: wingTex(kind, true), th: wingTex(kind, false) }; return bfCache[kind];
}
function makeButterfly(kind) {
  const sp = BUTTERFLIES[kind], A = bfAssets(kind), g = new T.Group(), s = sp.size / 0.42; g.scale.setScalar(s * 1.5);
  g.add(new T.Mesh(A.body, vmat('bfbody')));
  const mf = new T.MeshLambertMaterial({ map: A.tf, side: T.DoubleSide, transparent: true, alphaTest: 0.3 }), mh = new T.MeshLambertMaterial({ map: A.th, side: T.DoubleSide, transparent: true, alphaTest: 0.3 });
  const wings = [-1, 1].map(function (sd) { const p = new T.Group(); p.scale.x = sd; p.position.set(sd * 0.02, 0.01, 0); g.add(p); const f = new T.Mesh(A.fore, mf); f.position.z = 0.02; p.add(f); const h = new T.Mesh(A.hind, mh); h.position.z = 0.0; p.add(h); return { p: p, f: f, h: h }; });
  return { g: g, wings: wings, kind: kind, ph: Math.random() * 6.28, glide: 0 };
}
function poseButterfly(b, dt, mode) {
  /* fast flapping with short glides; hindwings follow a moment later; resting butterflies open and close slowly */
  if (mode === 'rest') { b.ph += dt * 1.6; const a = 1.0 + 0.45 * Math.sin(b.ph); b.wings.forEach(function (w) { w.f.rotation.z = a; w.h.rotation.z = a * 0.95; }); return; }
  if (b.glide > 0) { b.glide -= dt; b.wings.forEach(function (w) { w.f.rotation.z = 0.35; w.h.rotation.z = 0.3; }); return; }
  b.ph += dt * (13 + (b.freqVar || 0) * 5); const a = 0.55 + 0.95 * Math.sin(b.ph), a2 = 0.55 + 0.9 * Math.sin(b.ph - 0.5);
  b.wings.forEach(function (w) { w.f.rotation.z = a; w.h.rotation.z = a2; });
  if (Math.random() < dt * 0.7) b.glide = 0.25 + Math.random() * 0.4;
}

/* ---------- a little world of animals: birds that perch, fly and flee; butterflies that wander between flowers ---------- */
function bezier(a, b, c, d, t, out) { const u = 1 - t; out.set(u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x, u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y, u * u * u * a.z + 3 * u * u * t * b.z + 3 * u * t * t * c.z + t * t * t * d.z); return out; }
function Wild(opts) {
  /* opts: { group, H(x,z), birds: [{kind, perches:[[x,y,z],...], n}], soar: [{kind, cx, cz, r, y, n}], butterflies: [{kind, n, flowers:[[x,y,z]...]}] } */
  const W = { g: opts.group, H: opts.H, birds: [], soar: [], bfs: [], t: 0 }, tmp = new T.Vector3(), tmp2 = new T.Vector3();
  (opts.birds || []).forEach(function (grp) { for (let i = 0; i < grp.n; i++) { const b = makeBird(grp.kind); b.var = Math.random(); b.perches = grp.perches; b.ground = !!grp.ground; const p = grp.perches[Math.floor(Math.random() * grp.perches.length)]; b.pos = new T.Vector3(p[0], p[1], p[2]); b.state = 'perch'; b.wait = 2 + Math.random() * 8; b.head = Math.random() * 6.28; b.g.position.copy(b.pos); b.g.rotation.y = b.head; W.g.add(b.g); W.birds.push(b); } });
  (opts.soar || []).forEach(function (grp) { for (let i = 0; i < grp.n; i++) { const b = makeBird(grp.kind); b.var = Math.random(); b.c = grp; b.a = Math.random() * 6.28; b.r = grp.r * (0.7 + Math.random() * 0.6); b.h = grp.y + Math.random() * 8; b.flapT = 0; W.g.add(b.g); W.soar.push(b); } });
  (opts.butterflies || []).forEach(function (grp) { for (let i = 0; i < grp.n; i++) { const b = makeButterfly(grp.kind); b.freqVar = Math.random(); b.flowers = grp.flowers; const f = grp.flowers[Math.floor(Math.random() * grp.flowers.length)]; b.pos = new T.Vector3(f[0], f[1] + 0.8, f[2]); b.target = null; b.state = 'fly'; b.wait = 0; b.vel = new T.Vector3(); b.seed = Math.random() * 100; W.g.add(b.g); W.bfs.push(b); } });
  W.update = function (dt, me, opts2) {
    W.t += dt; const night = opts2 && opts2.night;
    W.birds.forEach(function (b) {
      const dMe = me ? Math.hypot(me.x - b.pos.x, me.z - b.pos.z) : 99, far = dMe > 90;
      if (night) { b.g.visible = b.state !== 'perch' || dMe < 40; }
      if (b.state === 'perch') {
        b.wait -= dt; if (!far) poseBird(b, dt, 'perch');
        /* idle: look around, hop, peck if on the ground */
        b.lookT = (b.lookT || 0) - dt; if (b.lookT <= 0) { b.lookT = 0.6 + Math.random() * 2; b.look = (Math.random() - 0.5) * 1.6; if (b.ground && Math.random() < 0.4) { b.peck = 0.35; } }
        b.root.rotation.y += ((b.look || 0) * 0.4 - b.root.rotation.y) * Math.min(1, dt * 8); b.root.rotation.x = b.peck > 0 ? 0.6 : 0; if (b.peck > 0) b.peck -= dt;
        if (dMe < (b.ground ? 5 : 4) || b.wait <= 0) {
          /* take off to another perch: away from the player if scared */
          let best = null, tries = 0; while (tries++ < 12) { const p = b.perches[Math.floor(Math.random() * b.perches.length)], d = Math.hypot(p[0] - b.pos.x, p[2] - b.pos.z); if (d > 6 && d < 70 && (!me || Math.hypot(p[0] - me.x, p[2] - me.z) > 10)) { best = p; break; } }
          if (best) { const A = b.pos.clone(), D = new T.Vector3(best[0], best[1], best[2]), dist = A.distanceTo(D); b.path = [A, A.clone().add(new T.Vector3((D.x - A.x) * 0.2, 2.5 + dist * 0.08, (D.z - A.z) * 0.2)), D.clone().add(new T.Vector3(0, 3 + dist * 0.06, 0)), D]; b.ft = 0; b.dur = Math.max(2.2, dist / (b.sp.len > 0.6 ? 7 : 6)); b.state = 'fly'; b.prevH = b.g.rotation.y; }
          else b.wait = 3 + Math.random() * 5;
        }
      } else if (b.state === 'fly') {
        b.ft += dt / b.dur; const u = Math.min(1, b.ft); bezier(b.path[0], b.path[1], b.path[2], b.path[3], u, b.pos); bezier(b.path[0], b.path[1], b.path[2], b.path[3], Math.min(1, u + 0.02), tmp);
        /* stay above the ground and the grass on the way: full clearance in mid-flight, easing down only for take-off and landing */
        const clr = function (v, uu) { const c = Math.max(0, Math.min(1, uu / 0.14, (1 - uu) / 0.14)) * 1.4, gy = W.H(v.x, v.z) + c; if (v.y < gy) v.y = gy; };
        clr(b.pos, u); clr(tmp, Math.min(1, u + 0.02));
        b.g.position.copy(b.pos); const dx = tmp.x - b.pos.x, dz = tmp.z - b.pos.z, dy = tmp.y - b.pos.y, hd = Math.atan2(dx, dz);
        let dh = hd - (b.lastH == null ? hd : b.lastH); while (dh > Math.PI) dh -= 6.283; while (dh < -Math.PI) dh += 6.283; b.lastH = hd;
        b.bank = lerp(b.bank || 0, clamp(-dh / Math.max(dt, 0.001) * 0.25, -0.9, 0.9), Math.min(1, dt * 4));
        const flare = u > 0.86 ? (u - 0.86) / 0.14 : 0, climb = dy / Math.max(0.001, Math.hypot(dx, dz));
        b.g.rotation.set(0, 0, 0); b.g.rotation.order = 'YXZ'; b.g.rotation.y = hd; b.g.rotation.x = -clamp(climb, -0.6, 0.6) * 0.7 - flare * 0.7; b.g.rotation.z = b.bank;
        /* flap to climb and to land, glide in between (small birds bound: bursts of flaps, then wings tucked) */
        const glide = u > 0.3 && u < 0.78 && climb < 0.1 && (b.sp.len > 0.6 ? true : Math.sin(W.t * 2.2 + b.var * 6) > 0.2);
        if (!far) poseBird(b, dt, glide ? 'glide' : 'flap', u < 0.25 ? 1 : 0.75, flare);
        if (u >= 1) { b.state = 'perch'; b.wait = 4 + Math.random() * 10; b.g.rotation.set(0, b.g.rotation.y, 0); b.lastH = null; b.bank = 0; }
      }
    });
    W.soar.forEach(function (b) {
      const c = b.c; b.a += dt * (c.speed || 0.12) * (14 / b.r); const x = c.cx + Math.cos(b.a) * b.r, z = c.cz + Math.sin(b.a) * b.r, y = Math.max(b.h + Math.sin(W.t * 0.3 + b.var * 5) * 2, W.H(x, z) + 6);
      b.g.position.set(x, y, z); b.g.rotation.order = 'YXZ'; b.g.rotation.y = Math.atan2(-Math.sin(b.a), Math.cos(b.a)) + (c.speed < 0 ? Math.PI : 0); b.g.rotation.z = -0.35; b.g.rotation.x = 0;
      b.flapT -= dt; if (b.flapT < -6 - b.var * 6) b.flapT = 1 + Math.random() * 1.2;
      poseBird(b, dt, b.flapT > 0 ? 'flap' : 'glide', 0.7, 0);
    });
    W.bfs.forEach(function (b) {
      const far = me && Math.hypot(me.x - b.pos.x, me.z - b.pos.z) > 70; b.g.visible = !night;
      if (night) return;
      if (b.state === 'rest') { b.wait -= dt; poseButterfly(b, dt, 'rest'); if (b.wait <= 0 || (me && Math.hypot(me.x - b.pos.x, me.z - b.pos.z) < 1.6)) { b.state = 'fly'; b.target = null; } return; }
      if (!b.target) { const f = b.flowers[Math.floor(Math.random() * b.flowers.length)], near = Math.hypot(f[0] - b.pos.x, f[2] - b.pos.z) < 14; if (near || Math.random() < 0.2) b.target = new T.Vector3(f[0], f[1] + 0.05, f[2]); return; }
      /* wander toward the target with a fluttering, uneven path */
      tmp.subVectors(b.target, b.pos); const d = tmp.length(); tmp.normalize();
      const t0 = W.t + b.seed, wob = tmp2.set(Math.sin(t0 * 2.3) + Math.sin(t0 * 5.1) * 0.5, Math.sin(t0 * 3.7) * 0.8 + 0.3 * Math.sin(t0 * 9), Math.cos(t0 * 1.9) + Math.cos(t0 * 4.3) * 0.5);
      const spd = 1.3 + Math.sin(t0 * 0.7) * 0.4; b.vel.lerp(tmp.multiplyScalar(spd).add(wob.multiplyScalar(d > 1.5 ? 0.9 : 0.25)), Math.min(1, dt * 2.5));
      b.pos.addScaledVector(b.vel, dt); const ground = W.H(b.pos.x, b.pos.z); if (b.pos.y < ground + 0.25) b.pos.y = ground + 0.25; if (b.pos.y > ground + 4) b.pos.y -= dt;
      if (!far) poseButterfly(b, dt, 'fly');
      b.g.position.copy(b.pos); b.g.position.y += Math.sin(b.ph) * 0.03; b.g.rotation.order = 'YXZ'; b.g.rotation.y = Math.atan2(b.vel.x, b.vel.z); b.g.rotation.x = -0.25;
      if (d < 0.3) { b.state = 'rest'; b.pos.copy(b.target); b.g.position.copy(b.pos); b.wait = 2 + Math.random() * 5; b.g.rotation.x = 0; }
    });
  };
  W.dispose = function () { [].concat(W.birds, W.soar, W.bfs).forEach(function (b) { W.g.remove(b.g); }); };
  return W;
}
/* ---------- WADING BIRDS: real animated models (three.js examples, MIT) recolored as a great blue heron and a great egret ---------- */
const WADERS = { heron: { src: 'stork', tint: '#8fa2c0', vc: true, scale: 0.011 }, egret: { src: 'flamingo', tint: '#f4f6f8', vc: false, scale: 0.0105 } };
const gltfCache = {};
function b64buf(b64) { const s = atob(b64), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a.buffer; }
function loadModel(src, cb) {
  if (gltfCache[src]) { if (gltfCache[src].ready) cb(gltfCache[src].g); else gltfCache[src].wait.push(cb); return; }
  if (!T.GLTFLoader || !window.FG_MODELS || !window.FG_MODELS[src]) { cb(null); return; }
  gltfCache[src] = { ready: false, wait: [cb] };
  try { new T.GLTFLoader().parse(b64buf(window.FG_MODELS[src]), '', function (g) { gltfCache[src].ready = true; gltfCache[src].g = g; gltfCache[src].wait.forEach(function (f) { f(g); }); }, function () { gltfCache[src].ready = true; gltfCache[src].wait.forEach(function (f) { f(null); }); }); }
  catch (e) { cb(null); }
}
function makeWader(kind, cb) {
  const w = WADERS[kind];
  loadModel(w.src, function (gl) {
    if (!gl) { cb(null); return; }
    const g = new T.Group(), sc = gl.scene.clone(true); sc.scale.setScalar(w.scale); g.add(sc);
    sc.traverse(function (o) { if (o.isMesh) { o.material = o.material.clone(); o.material.vertexColors = w.vc; o.material.color.set(w.tint); o.material.roughness = 0.9; o.material.metalness = 0; o.material.needsUpdate = true; o.frustumCulled = false; } });
    const mixer = new T.AnimationMixer(sc), act = mixer.clipAction(gl.animations[0]); act.play(); act.time = Math.random() * gl.animations[0].duration; act.timeScale = 0.85 + Math.random() * 0.3;
    cb({ g: g, mixer: mixer, act: act, kind: kind });
  });
}
BQ.creatures = { makeBird: makeBird, makeWader: makeWader, loadModel: loadModel, poseBird: poseBird, makeButterfly: makeButterfly, poseButterfly: poseButterfly, Wild: Wild, BIRDS: BIRDS, BUTTERFLIES: BUTTERFLIES, merge: merge, M4: M4 };
})();

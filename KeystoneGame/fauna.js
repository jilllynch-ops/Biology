/* EARTHLING FIELD GUIDE: MORE WILDLIFE
   Frogs, sunfish, bumblebees, dragonflies, cottontail rabbits, a white-tailed deer, a barred owl and a great blue heron,
   all built in code (no downloads) from smooth shapes painted with their real field marks.
   Each one has its own movement: frogs breathe and hop, fish swim with a tail-driven S-bend, bees buzz from flower
   to flower, dragonflies hover and dart, rabbits hop and freeze, the deer walks, grazes and raises its white tail,
   the owl turns its head and blinks, and the heron stalks and strikes.
   Loaded after creatures.js and adds to FieldGuide.creatures. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ || !window.THREE || !BQ.creatures) return;
const T = window.THREE, CR = BQ.creatures, merge = CR.merge, M4 = CR.M4;
const SPH = function (w, h) { return new T.SphereGeometry(1, w || 14, h || 10); };
const CYL = function (r0, r1, l, n) { return new T.CylinderGeometry(r0, r1, l, n || 8); };
const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
const MATS = {};
function vmat(key, opts) { if (!MATS[key]) MATS[key] = new T.MeshLambertMaterial(Object.assign({ vertexColors: true }, opts || {})); return MATS[key]; }
function mesh(parts, key, opts) { return new T.Mesh(merge(parts), vmat(key || 'fauna', opts)); }
function ell(x, y, z, sx, sy, sz, color, rx, ry, rz, seg) { return { geo: SPH(seg || 14, seg ? Math.max(6, seg - 4) : 10), m: M4(x, y, z, rx, ry, rz, sx, sy, sz), color: color }; }
function off(fn, dx, dy, dz) { const q = new T.Vector3(); return function (v) { return fn(q.set(v.x + (dx || 0), v.y + (dy || 0), v.z + (dz || 0))); }; }
function eye(x, y, z, r, iris, sd) { /* a glossy eye: dark ball with a colored iris and a white sparkle */
  return [ell(x, y, z, r, r, r, '#111111'), ell(x + sd * r * 0.45, y + r * 0.1, z + r * 0.62, r * 0.55, r * 0.55, r * 0.3, iris || '#2a1a10'), ell(x + sd * r * 0.62, y + r * 0.45, z + r * 0.72, r * 0.2, r * 0.2, r * 0.12, '#ffffff')]; }
/* a flat shape (wings and fins) from points; lies in the x-z plane */
function flat(pts, curve) { const s = new T.Shape(); s.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { if (curve) { const a = pts[i - 1], b = pts[i]; s.quadraticCurveTo(a[0] + (b[0] - a[0]) * 0.5 + (b[1] - a[1]) * 0.18, a[1] + (b[1] - a[1]) * 0.5 - (b[0] - a[0]) * 0.18, b[0], b[1]); } else s.lineTo(pts[i][0], pts[i][1]); } const g = new T.ShapeGeometry(s, 6); g.rotateX(-Math.PI / 2); return g; }
function wingTex(tint, edge) { /* clear insect wing with fine veins */
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d');
  g.fillStyle = tint; g.fillRect(0, 0, 64, 64); g.strokeStyle = edge; g.lineWidth = 1.2; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(0, 32); g.quadraticCurveTo(30, 32 - (k - 2.5) * 6, 64, 32 - (k - 2.5) * 12); g.stroke(); }
  for (let k = 1; k < 8; k++) { g.beginPath(); g.moveTo(k * 8, 0); g.lineTo(k * 8 + 3, 64); g.globalAlpha = 0.5; g.stroke(); g.globalAlpha = 1; }
  const t = new T.CanvasTexture(cv); return t; }
function uvFlat(geo) { geo.computeBoundingBox(); const bb = geo.boundingBox, P = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < P.count; i++) uv.setXY(i, (P.getX(i) - bb.min.x) / (bb.max.x - bb.min.x + 1e-6), (P.getZ(i) - bb.min.z) / (bb.max.z - bb.min.z + 1e-6)); return geo; }

/* ================= FROG (green frog): faces +z, about 0.7 long ================= */
function makeFrog() {
  const g = new T.Group(), root = new T.Group(); g.add(root);
  const skin = function (v) { const c = new T.Color(v.y < 0.1 ? '#f0ecc8' : '#5fae48'); if (v.y >= 0.1) { c.lerp(new T.Color('#3d7a34'), clamp((v.y - 0.2) * 3, 0, 0.6)); const sp = Math.sin(v.x * 40) * Math.sin(v.z * 34); if (sp > 0.75 && v.y > 0.22) c.set('#2e5a28'); } if (v.y > 0.16 && v.y < 0.2 && Math.abs(v.x) > 0.17) c.set('#d8c060'); return c; };
  const body = mesh([ell(0, 0.18, 0, 0.22, 0.15, 0.3, skin), ell(0, 0.2, 0.22, 0.2, 0.12, 0.16, skin), ell(0, 0.17, 0.33, 0.14, 0.08, 0.08, skin)].concat(
    [ell(-0.12, 0.31, 0.23, 0.07, 0.07, 0.07, '#d0a830'), ell(0.12, 0.31, 0.23, 0.07, 0.07, 0.07, '#d0a830'), ell(-0.17, 0.315, 0.26, 0.012, 0.016, 0.034, '#0a0a0a', 0, -0.7), ell(0.17, 0.315, 0.26, 0.012, 0.016, 0.034, '#0a0a0a', 0, 0.7), ell(-0.16, 0.345, 0.27, 0.008, 0.008, 0.008, '#ffffff'), ell(0.16, 0.345, 0.27, 0.008, 0.008, 0.008, '#ffffff')],
    [ell(-0.16, 0.24, 0.16, 0.04, 0.04, 0.04, '#c8b070'), ell(0.16, 0.24, 0.16, 0.04, 0.04, 0.04, '#c8b070'), ell(0, 0.155, 0.38, 0.07, 0.012, 0.03, '#2a3a20')]), 'frog');
  root.add(body);
  const throat = new T.Mesh(merge([ell(0, 0, 0, 0.11, 0.06, 0.09, '#f4f0d0')]), vmat('frog')); throat.position.set(0, 0.11, 0.25); root.add(throat);
  const legs = [-1, 1].map(function (sd) { /* back legs fold like a Z: thigh, shin, long webbed foot */
    const hip = new T.Group(); hip.position.set(sd * 0.15, 0.15, -0.2); root.add(hip);
    hip.add(mesh([ell(sd * 0.05, 0, -0.04, 0.07, 0.06, 0.15, off(skin, 0, 0.2, 0), 0, sd * 0.5)], 'frog'));
    const knee = new T.Group(); knee.position.set(sd * 0.12, -0.03, 0.06); hip.add(knee);
    knee.add(mesh([ell(0, -0.02, -0.08, 0.045, 0.045, 0.13, '#4f9a40', 0.25, 0)], 'frog'));
    const ank = new T.Group(); ank.position.set(0, -0.06, -0.18); knee.add(ank);
    ank.add(mesh([ell(0, -0.02, 0.09, 0.05, 0.015, 0.11, '#5fae48'), ell(sd * 0.03, -0.02, 0.19, 0.04, 0.012, 0.03, '#5fae48')], 'frog'));
    return { hip: hip, knee: knee, ank: ank, sd: sd }; });
  const arms = [-1, 1].map(function (sd) { const a = new T.Group(); a.position.set(sd * 0.14, 0.12, 0.2); root.add(a); a.add(mesh([ell(sd * 0.02, -0.05, 0.02, 0.03, 0.07, 0.03, '#5fae48', 0.2, 0, sd * 0.3), ell(sd * 0.04, -0.11, 0.06, 0.04, 0.012, 0.04, '#5fae48')], 'frog')); return a; });
  return { g: g, root: root, throat: throat, legs: legs, arms: arms, ph: Math.random() * 6 };
}
/* hop: 0..1 through a jump (legs extend, body arcs); otherwise sit and breathe; call:1 puffs the throat */
function poseFrog(f, dt, hop, call) {
  f.ph += dt; const ext = hop > 0 ? Math.sin(Math.min(1, hop) * Math.PI) : 0;
  f.throat.scale.setScalar(1 + (call ? 0.9 * Math.max(0, Math.sin(f.ph * 9)) : 0.12 * Math.sin(f.ph * 3)));
  f.root.rotation.x = -0.25 * ext; f.root.position.y = Math.sin(f.ph * 3) * 0.004;
  f.legs.forEach(function (l) { l.hip.rotation.set(0.9 * ext, 0, 0); l.knee.rotation.x = -1.4 * ext; l.ank.rotation.x = 0.6 * ext; });
  f.arms.forEach(function (a) { a.rotation.x = -0.9 * ext; });
}

/* ================= SUNFISH (pumpkinseed): faces +z, about 0.55 long ================= */
function makeFish(kind) {
  const g = new T.Group(), body = new T.Group(); g.add(body);
  const pal = kind === 'trout' ? { back: '#3a4a2a', side: '#6a7a4a', belly: '#e8742a', spot: '#e8d860' } : { back: '#6a7a3a', side: '#d8a040', belly: '#f08a2a', spot: '#4a8ab0' };
  const skin = function (v) { const c = new T.Color(pal.side); if (v.y > 0.05) c.lerp(new T.Color(pal.back), clamp((v.y - 0.05) * 8, 0, 1)); if (v.y < -0.04) c.lerp(new T.Color(pal.belly), clamp((-v.y - 0.04) * 10, 0, 1));
    if (kind !== 'trout' && v.z > 0.08 && v.z < 0.18 && Math.abs(v.x) > 0.02 && Math.sin(v.y * 90) > 0.4) c.set('#3a9ad0'); /* blue cheek stripes */
    if (kind !== 'trout' && v.z > 0.04 && v.z < 0.09 && v.y > 0.02 && v.y < 0.06 && Math.abs(v.x) > 0.03) c.set(v.z > 0.075 ? '#e83020' : '#111111'); /* the black "ear flap" with a red spot */
    if (kind !== 'trout' && v.z < 0.04 && v.y > -0.02 && Math.sin(v.y * 70 + v.z * 30) * Math.sin(v.z * 60) > 0.7) c.set('#e0b030');
    if (kind === 'trout' && v.y > -0.02 && Math.sin(v.z * 80) * Math.sin(v.y * 70) > 0.75) c.set(pal.spot);
    return c; };
  const front = new T.Group(); body.add(front);
  front.add(mesh([ell(0, 0, 0.0, 0.045, kind === 'trout' ? 0.07 : 0.125, 0.22, skin, 0, 0, 0, 18), ell(0, 0.0, 0.18, 0.035, 0.07, 0.06, skin)].concat(eye(-0.034, 0.03, 0.18, 0.022, '#d08020', -1), eye(0.034, 0.03, 0.18, 0.022, '#d08020', 1), [ell(0, -0.025, 0.235, 0.015, 0.012, 0.02, '#4a3a2a')]), 'fish'));
  const finMat = { side: T.DoubleSide, transparent: true, opacity: 0.85 };
  const dors = new T.Mesh(merge([{ geo: flat([[0, 0.1], [0.05, 0.06], [0.07, -0.04], [0.06, -0.12], [0, -0.15]], true), m: M4(0, kind === 'trout' ? 0.05 : 0.09, 0.0, 0, 0, Math.PI / 2), color: pal.back }]), vmat('fin', finMat)); front.add(dors);
  const pecs = [-1, 1].map(function (sd) { const p = new T.Group(); p.position.set(sd * 0.04, -0.02, 0.1); front.add(p); p.add(new T.Mesh(merge([{ geo: flat([[0, 0], [sd * 0.08, -0.04], [sd * 0.07, -0.08], [0, -0.05]], true), m: M4(0, 0, 0, 0, 0, 0), color: '#e8a050' }]), vmat('fin', finMat))); return p; });
  const back = new T.Group(); back.position.z = -0.1; body.add(back); /* rear half bends for the swimming S-curve */
  back.add(mesh([ell(0, 0, -0.03, 0.032, kind === 'trout' ? 0.05 : 0.075, 0.09, skin), ell(0, 0, -0.11, 0.016, 0.028, 0.06, skin)], 'fish'));
  const tail = new T.Group(); tail.position.z = -0.16; back.add(tail);
  tail.add(new T.Mesh(merge([{ geo: flat([[0, 0], [0.09, -0.1], [0.04, -0.12], [0, -0.07], [-0.04, -0.12], [-0.09, -0.1]], true), m: M4(0, 0, 0, 0, 0, Math.PI / 2), color: pal.back }]), vmat('fin', finMat)));
  return { g: g, front: front, back: back, tail: tail, pecs: pecs, ph: Math.random() * 6, kind: kind };
}
/* speed 0..1: the tail drives a wave that runs from head to tail; the head barely moves */
function poseFish(f, dt, speed) {
  f.ph += dt * (4 + speed * 10); const a = (0.12 + speed * 0.3);
  f.front.rotation.y = Math.sin(f.ph) * a * 0.15; f.back.rotation.y = Math.sin(f.ph - 1.1) * a; f.tail.rotation.y = Math.sin(f.ph - 2.1) * a * 1.6;
  f.pecs.forEach(function (p, i) { p.rotation.y = (i ? 1 : -1) * (0.3 + 0.35 * Math.sin(f.ph * 0.7 + i)); });
}

/* ================= BUMBLEBEE: faces +z, about 0.3 long (larger than life so you can see it) ================= */
let beeWingTex = null;
function makeBee() {
  const g = new T.Group(), root = new T.Group(); g.add(root);
  const stripes = function (v) { const z = v.z; if (z > 0.06) return new T.Color('#1a1612'); if (z > -0.02) return new T.Color(v.y > -0.02 ? '#f0c020' : '#1a1612'); if (z > -0.07) return new T.Color('#1a1612'); if (z > -0.13) return new T.Color('#f0c020'); return new T.Color(z > -0.17 ? '#1a1612' : '#f4f0e0'); };
  root.add(mesh([ell(0, 0, 0.02, 0.07, 0.065, 0.075, stripes, 0, 0, 0, 10), ell(0, -0.01, -0.09, 0.075, 0.07, 0.1, stripes, 0, 0, 0, 10), ell(0, 0, 0.1, 0.045, 0.045, 0.04, '#1a1612', 0, 0, 0, 10),
    ell(-0.03, 0.01, 0.125, 0.015, 0.025, 0.012, '#0a0a0a'), ell(0.03, 0.01, 0.125, 0.015, 0.025, 0.012, '#0a0a0a'),
    { geo: CYL(0.004, 0.004, 0.07, 3), m: M4(-0.02, 0.05, 0.14, 0.6, 0, 0.3), color: '#1a1612' }, { geo: CYL(0.004, 0.004, 0.07, 3), m: M4(0.02, 0.05, 0.14, 0.6, 0, -0.3), color: '#1a1612' },
    { geo: CYL(0.006, 0.004, 0.08, 3), m: M4(-0.05, -0.06, 0.02, 0, 0, 0.5), color: '#1a1612' }, { geo: CYL(0.006, 0.004, 0.08, 3), m: M4(0.05, -0.06, 0.02, 0, 0, -0.5), color: '#1a1612' },
    { geo: CYL(0.008, 0.006, 0.09, 3), m: M4(-0.05, -0.06, -0.04, 0.3, 0, 0.5), color: '#d8a020' }, { geo: CYL(0.008, 0.006, 0.09, 3), m: M4(0.05, -0.06, -0.04, 0.3, 0, -0.5), color: '#d8a020' }], 'bee'));
  if (!beeWingTex) beeWingTex = wingTex('rgba(220,235,255,0.45)', 'rgba(60,60,70,0.6)');
  const wm = new T.MeshLambertMaterial({ map: beeWingTex, transparent: true, side: T.DoubleSide, depthWrite: false });
  const wings = [-1, 1].map(function (sd) { const p = new T.Group(); p.position.set(sd * 0.03, 0.06, 0.03); root.add(p); const w = new T.Mesh(uvFlat(flat([[0, 0], [sd * 0.08, 0.02], [sd * 0.15, -0.02], [sd * 0.13, -0.06], [sd * 0.05, -0.05]], true)), wm); w.scale.z = -1; p.add(w); return p; });
  return { g: g, root: root, wings: wings, ph: Math.random() * 6 };
}
function poseBee(b, dt, rest) {
  b.ph += dt; const f = rest ? 0 : Math.sin(b.ph * 90); /* wing beats blur into a shimmer */
  b.wings.forEach(function (w, i) { w.rotation.z = (i ? -1 : 1) * (rest ? -0.2 : 0.2 + 0.7 * f); w.rotation.y = (i ? 1 : -1) * (rest ? 0.5 : 0.1); });
  b.root.position.y = rest ? 0 : Math.sin(b.ph * 7) * 0.02; b.root.rotation.x = rest ? 0 : -0.15;
}

/* ================= DRAGONFLY (common green darner): faces +z, about 0.6 long ================= */
let dfWingTex = null;
function makeDragonfly() {
  const g = new T.Group(), root = new T.Group(); g.add(root);
  const abd = function (v) { const k = Math.floor(-v.z / 0.045); return new T.Color(k % 2 && Math.abs((-v.z / 0.045) - Math.floor(-v.z / 0.045)) < 0.2 ? '#1a2030' : (v.z > -0.1 ? '#3aa0e0' : v.y > 0 ? '#5aa8d8' : '#2a6aa0')); };
  root.add(mesh([ell(0, 0, 0.06, 0.04, 0.045, 0.07, '#4ab048'), ell(0, 0.005, 0.15, 0.035, 0.03, 0.03, '#4ab048'), ell(-0.032, 0.015, 0.165, 0.035, 0.038, 0.035, '#2a7a3a'), ell(0.032, 0.015, 0.165, 0.035, 0.038, 0.035, '#2a7a3a'),
    ell(-0.04, 0.03, 0.18, 0.01, 0.01, 0.006, '#d0f0d0'), ell(0.04, 0.03, 0.18, 0.01, 0.01, 0.006, '#d0f0d0'),
    { geo: CYL(0.016, 0.011, 0.42, 8), m: M4(0, 0, -0.2, Math.PI / 2), color: abd }, ell(0, 0, -0.42, 0.012, 0.012, 0.025, '#1a2030')], 'df'));
  if (!dfWingTex) dfWingTex = wingTex('rgba(230,240,250,0.35)', 'rgba(40,50,60,0.55)');
  const wm = new T.MeshLambertMaterial({ map: dfWingTex, transparent: true, side: T.DoubleSide, depthWrite: false });
  const wings = []; [[0.08, 0.3], [0.0, 0.28]].forEach(function (pr, k) { [-1, 1].forEach(function (sd) { const p = new T.Group(); p.position.set(sd * 0.02, 0.035, pr[0]); root.add(p);
    const L = pr[1], w = new T.Mesh(uvFlat(flat([[0, 0.012], [sd * L * 0.4, 0.03], [sd * L, 0.012], [sd * L * 0.97, -0.03], [sd * L * 0.4, -0.045], [0, -0.02]], true)), wm); p.add(w); wings.push({ p: p, sd: sd, k: k }); }); });
  return { g: g, root: root, wings: wings, ph: Math.random() * 6 };
}
function poseDragonfly(d, dt, rest) {
  d.ph += dt; d.wings.forEach(function (w) { w.p.rotation.z = w.sd * (rest ? -0.08 : 0.5 * Math.sin(d.ph * 60 + w.k * 1.6)); w.p.rotation.y = rest ? w.sd * (w.k ? -0.15 : 0.1) : 0; });
}

/* ================= COTTONTAIL RABBIT: faces +z, about 0.75 long ================= */
function makeRabbit() {
  const g = new T.Group(), root = new T.Group(); g.add(root);
  const fur = function (v) { const c = new T.Color('#9a7a58'); if (v.y < 0.24) c.lerp(new T.Color('#e8dcc8'), clamp((0.24 - v.y) * 8, 0, 1)); c.offsetHSL(0, 0, Math.sin(v.x * 70) * Math.sin(v.z * 60) * 0.03); return c; };
  root.add(mesh([ell(0, 0.3, -0.06, 0.2, 0.2, 0.27, fur), ell(0, 0.3, 0.14, 0.15, 0.17, 0.15, fur), ell(0, 0.17, -0.2, 0.11, 0.1, 0.16, fur), ell(-0.12, 0.2, -0.16, 0.08, 0.12, 0.15, fur), ell(0.12, 0.2, -0.16, 0.08, 0.12, 0.15, fur),
    ell(-0.13, 0.04, -0.08, 0.05, 0.035, 0.15, '#c8b090'), ell(0.13, 0.04, -0.08, 0.05, 0.035, 0.15, '#c8b090'), ell(-0.07, 0.1, 0.2, 0.035, 0.1, 0.04, '#c8b090'), ell(0.07, 0.1, 0.2, 0.035, 0.1, 0.04, '#c8b090'),
    ell(0, 0.36, -0.33, 0.08, 0.08, 0.07, '#ffffff')], 'rab'));
  const head = new T.Group(); head.position.set(0, 0.44, 0.26); root.add(head);
  head.add(mesh([ell(0, 0, 0, 0.11, 0.11, 0.13, off(fur, 0, 0.44, 0)), ell(0, -0.03, 0.1, 0.07, 0.06, 0.06, '#c8b090'), ell(0, -0.0, 0.155, 0.018, 0.013, 0.01, '#d08080')].concat(eye(-0.075, 0.03, 0.06, 0.03, '#3a2010', -1), eye(0.075, 0.03, 0.06, 0.03, '#3a2010', 1)), 'rab'));
  const ears = [-1, 1].map(function (sd) { const e = new T.Group(); e.position.set(sd * 0.05, 0.08, -0.03); head.add(e);
    e.add(mesh([ell(0, 0.14, 0, 0.045, 0.15, 0.022, '#8a6a4a'), ell(0, 0.14, 0.012, 0.03, 0.12, 0.012, '#e8b0a8'), ell(0, 0.27, 0, 0.03, 0.02, 0.018, '#3a2a1a')], 'rab')); e.rotation.set(-0.2, 0, sd * 0.2); return e; });
  return { g: g, root: root, head: head, ears: ears, ph: Math.random() * 6 };
}
/* hop 0..1 through a bound; alert straightens up with ears high; otherwise nibble */
function poseRabbit(r, dt, hop, alert) {
  r.ph += dt; const h = hop > 0 ? Math.sin(Math.min(1, hop) * Math.PI) : 0;
  r.root.rotation.x = hop > 0 ? (hop < 0.5 ? -0.35 : 0.3) * h : (alert ? -0.15 : 0);
  r.head.rotation.x = alert ? -0.2 : 0.25 + Math.sin(r.ph * 9) * (hop ? 0 : 0.04);
  r.ears.forEach(function (e, i) { e.rotation.x = (alert ? -0.05 : -0.45) + (hop ? 0.4 * h : 0) + (Math.sin(r.ph * 1.3 + i * 2) > 0.95 ? 0.3 : 0); });
}

/* ================= WHITE-TAILED DEER: faces +z, shoulder about 1.4 ================= */
function makeDeer() {
  const g = new T.Group(), root = new T.Group(); g.add(root);
  const coat = function (v) { const c = new T.Color('#a8784a'); if (v.y < 1.15) c.lerp(new T.Color('#efe6d6'), clamp((1.15 - v.y) * 5, 0, 1)); c.offsetHSL(0, 0, (v.y - 1.3) * 0.08); return c; };
  root.add(mesh([ell(0, 1.3, 0.0, 0.34, 0.37, 0.9, coat, 0, 0, 0, 20), ell(0, 1.33, 0.45, 0.33, 0.4, 0.45, coat, -0.15, 0, 0, 20), ell(0, 1.34, -0.5, 0.35, 0.38, 0.42, coat, 0.1, 0, 0, 20)], 'deer'));
  const neck = new T.Group(); neck.position.set(0, 1.5, 0.75); root.add(neck);
  neck.add(mesh([{ geo: CYL(0.13, 0.2, 0.75, 10), m: M4(0, 0.3, 0.12, 0.45), color: off(coat, 0, 1.5, 0) }, ell(0, 0.0, 0.08, 0.17, 0.2, 0.18, off(coat, 0, 1.5, 0)), ell(0, 0.4, 0.3, 0.09, 0.08, 0.06, '#f4f0e8', 0.45)], 'deer'));
  const head = new T.Group(); head.position.set(0, 0.66, 0.3); neck.add(head);
  head.add(mesh([ell(0, 0, 0.04, 0.14, 0.15, 0.2, '#a0724a'), ell(0, -0.04, 0.24, 0.085, 0.09, 0.15, '#9a6c46'), ell(0, -0.04, 0.38, 0.06, 0.055, 0.03, '#1a1410'), ell(0, -0.1, 0.3, 0.06, 0.03, 0.08, '#f2ece4'),
    ell(-0.1, 0.0, 0.2, 0.04, 0.03, 0.04, '#f2ece4'), ell(0.1, 0.0, 0.2, 0.04, 0.03, 0.04, '#f2ece4')].concat(eye(-0.115, 0.04, 0.12, 0.04, '#1a120c', -1), eye(0.115, 0.04, 0.12, 0.04, '#1a120c', 1)), 'deer'));
  const ears = [-1, 1].map(function (sd) { const e = new T.Group(); e.position.set(sd * 0.12, 0.12, -0.04); head.add(e); e.add(mesh([ell(sd * 0.1, 0.06, 0, 0.12, 0.06, 0.03, '#9a6c46'), ell(sd * 0.1, 0.06, 0.015, 0.09, 0.04, 0.015, '#e8d8c8')], 'deer')); e.rotation.z = sd * 0.35; return e; });
  const legs = [[-0.2, 0.62], [0.2, 0.62], [-0.2, -0.62], [0.2, -0.62]].map(function (p, i) { const front = i < 2, hip = new T.Group(); hip.position.set(p[0], 1.2, p[1]); root.add(hip);
    hip.add(mesh([ell(0, -0.2, front ? 0.02 : -0.04, 0.12, 0.32, front ? 0.13 : 0.19, off(coat, 0, 1.5, 0))], 'deer'));
    const knee = new T.Group(); knee.position.set(0, -0.5, front ? 0.02 : -0.08); hip.add(knee);
    knee.add(mesh([{ geo: CYL(0.045, 0.035, 0.6, 6), m: M4(0, -0.28, 0), color: '#b88a5a' }, ell(0, -0.6, 0.02, 0.045, 0.05, 0.06, '#2a1e16')], 'deer'));
    return { hip: hip, knee: knee, front: front, ph: [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5][i] }; });
  const tail = new T.Group(); tail.position.set(0, 1.5, -0.9); root.add(tail);
  tail.add(mesh([ell(0, -0.08, -0.04, 0.09, 0.16, 0.06, function (v) { return new T.Color(v.z < -0.95 + 0 ? '#ffffff' : '#8a5a34'); })], 'deer'));
  const flag = new T.Mesh(merge([ell(0, -0.08, -0.07, 0.085, 0.15, 0.03, '#ffffff')]), vmat('deer')); tail.add(flag);
  return { g: g, root: root, neck: neck, head: head, ears: ears, legs: legs, tail: tail, ph: 0, look: 0 };
}
/* walk 0..1 (speed), graze (head down), alert (head high, tail raised, ears forward) */
function poseDeer(d, dt, walk, graze, alert) {
  d.ph += dt * (2 + walk * 5);
  d.legs.forEach(function (l) { const s = Math.sin(d.ph + l.ph) * walk; l.hip.rotation.x = s * 0.45; l.knee.rotation.x = Math.max(0, Math.cos(d.ph + l.ph)) * walk * 0.8; });
  d.root.position.y = Math.abs(Math.sin(d.ph * 2)) * 0.03 * walk;
  const nk = alert ? -0.25 : graze ? 1.25 + Math.sin(d.ph * 0.9) * 0.08 : 0.15;
  d.neck.rotation.x += (nk - d.neck.rotation.x) * Math.min(1, dt * 4); d.head.rotation.x = alert ? 0.2 : graze ? 0.2 : 0;
  d.tail.rotation.x += ((alert ? -1.4 : -0.1 + Math.sin(d.ph * 3) * 0.08) - d.tail.rotation.x) * Math.min(1, dt * 5);
  d.ears.forEach(function (e, i) { e.rotation.y = alert ? (i ? -0.5 : 0.5) : Math.sin(d.ph * 0.6 + i) * 0.3; });
}

/* ================= BARRED OWL: faces +z, about 1.0 tall (sits on a branch) ================= */
function makeOwl() {
  const g = new T.Group();
  const bars = function (v) { const c = new T.Color('#8a6e52'); if (v.z > 0.12 && v.y < 0.55) { c.set('#ece0cc'); if (Math.sin(v.x * 95) > 0.55 && v.y < 0.4) c.set('#7a5a40'); if (v.y > 0.35 && Math.sin(v.y * 70) > 0.4) c.set('#7a5a40'); } else if (Math.sin(v.y * 60) > 0.55) c.set('#e8dcc8'); return c; };
  g.add(mesh([ell(0, 0.4, 0, 0.32, 0.45, 0.3, bars), ell(-0.27, 0.38, -0.03, 0.08, 0.36, 0.22, bars, 0, 0, 0.12), ell(0.27, 0.38, -0.03, 0.08, 0.36, 0.22, bars, 0, 0, -0.12), ell(0, 0.0, -0.2, 0.12, 0.08, 0.2, '#7a5a40', -0.6),
    ell(-0.08, -0.02, 0.12, 0.05, 0.04, 0.07, '#e8c060'), ell(0.08, -0.02, 0.12, 0.05, 0.04, 0.07, '#e8c060')], 'owl'));
  const head = new T.Group(); head.position.set(0, 0.88, 0.02); g.add(head);
  const disc = function (v) { const r = Math.hypot(v.x, v.y); const c = new T.Color('#e4d6c0'); if (v.z < 0.12) c.set('#8a6e52'); if (Math.abs(r - 0.21) < 0.02 && v.z > 0.08) c.set('#5a4030'); if (v.z > 0.12 && Math.abs(r - 0.12) < 0.012) c.set('#b8a080'); if (v.z < 0.12 && Math.sin(v.x * 50) > 0.6) c.set('#e8dcc8'); return c; };
  head.add(mesh([ell(0, 0, 0, 0.27, 0.25, 0.24, disc), ell(0, -0.04, 0.24, 0.035, 0.05, 0.04, '#e8c060', 0.4)].concat(eye(-0.095, 0.03, 0.215, 0.06, '#2a1a10', -1), eye(0.095, 0.03, 0.215, 0.06, '#2a1a10', 1)), 'owl'));
  const lids = [-1, 1].map(function (sd) { const l = new T.Mesh(merge([ell(0, 0, 0, 0.068, 0.068, 0.04, '#d8c8b0')]), vmat('owl')); l.position.set(sd * 0.095, 0.03, 0.25); l.scale.y = 0.01; head.add(l); return l; });
  return { g: g, head: head, lids: lids, ph: Math.random() * 6, blink: 0 };
}
function poseOwl(o, dt, yaw) {
  o.ph += dt; o.head.rotation.y += (clamp(yaw, -2.2, 2.2) - o.head.rotation.y) * Math.min(1, dt * 3); o.head.rotation.z = Math.sin(o.ph * 0.5) * 0.06;
  o.blink -= dt; if (o.blink < -3 - Math.random() * 4) o.blink = 0.18; const sh = o.blink > 0 ? 1 : 0.01; o.lids.forEach(function (l) { l.scale.y = sh; });
}

/* ================= GREAT BLUE HERON (standing): faces +z, about 2.4 tall ================= */
function makeHeron() {
  const g = new T.Group();
  const plum = function (v) { const c = new T.Color('#7a8aa8'); if (v.z > 0.25 && v.y < 1.7) c.set('#9aa6bc'); if (v.y < 1.45 && v.z > 0.1) c.lerp(new T.Color('#d8dce4'), 0.4); return c; };
  g.add(mesh([ell(0, 1.62, -0.05, 0.25, 0.27, 0.52, plum, -0.45), ell(-0.2, 1.66, -0.12, 0.07, 0.2, 0.46, '#6a7a98', -0.45), ell(0.2, 1.66, -0.12, 0.07, 0.2, 0.46, '#6a7a98', -0.45),
    { geo: new T.ConeGeometry(0.2, 0.6, 8), m: M4(0, 1.3, -0.6, -2.3), color: '#5a6a88' }, ell(0, 1.55, 0.3, 0.12, 0.28, 0.1, '#c8ccd8', 0.2), { geo: new T.ConeGeometry(0.08, 0.3, 6), m: M4(0, 1.32, 0.3, 0.15), color: '#b8bcc8' },
    { geo: CYL(0.035, 0.03, 1.25, 6), m: M4(-0.1, 0.62, -0.02), color: '#5a5040' }, { geo: CYL(0.035, 0.03, 1.25, 6), m: M4(0.1, 0.62, -0.02), color: '#5a5040' },
    ell(-0.1, 0.02, 0.08, 0.04, 0.02, 0.16, '#3a3a30'), ell(0.1, 0.02, 0.08, 0.04, 0.02, 0.16, '#3a3a30'), ell(-0.1, 1.3, -0.02, 0.06, 0.14, 0.07, '#7a7a8a'), ell(0.1, 1.3, -0.02, 0.06, 0.14, 0.07, '#7a7a8a')], 'heron'));
  /* the long S-shaped neck is two segments so it can coil back and spear forward */
  const n1 = new T.Group(); n1.position.set(0, 1.9, 0.3); g.add(n1);
  n1.add(mesh([ell(0, 0, 0, 0.13, 0.13, 0.13, '#8a96b0'), ell(0, 0.46, 0.1, 0.085, 0.085, 0.085, '#9aa6bc'), { geo: CYL(0.085, 0.13, 0.52, 10), m: M4(0, 0.22, 0.05, 0.25), color: '#8a96b0' }, ell(0, 0.24, 0.13, 0.05, 0.2, 0.04, '#f0f0f4', 0.25)], 'heron'));
  const n2 = new T.Group(); n2.position.set(0, 0.46, 0.1); n1.add(n2);
  n2.add(mesh([ell(0, 0.3, 0.3, 0.07, 0.07, 0.07, '#9aa6bc'), { geo: CYL(0.07, 0.085, 0.44, 10), m: M4(0, 0.16, 0.12, 0.85), color: '#9aa6bc' }, { geo: CYL(0.01, 0.02, 0.25, 4), m: M4(0, 0.0, 0.08, 1.9), color: '#2a2a30' }], 'heron'));
  const head = new T.Group(); head.position.set(0, 0.3, 0.3); n2.add(head);
  head.add(mesh([ell(0, 0, 0, 0.1, 0.1, 0.15, '#f0f2f4'), ell(0, 0.065, -0.02, 0.075, 0.03, 0.12, '#1a1a20'), { geo: CYL(0.01, 0.01, 0.4, 3), m: M4(0, 0.06, -0.24, 1.35), color: '#1a1a20' },
    { geo: new T.ConeGeometry(0.035, 0.36, 6), m: M4(0, -0.01, 0.28, Math.PI / 2), color: '#e0b030' }].concat(eye(-0.065, 0.02, 0.05, 0.022, '#e8c020', -1), eye(0.065, 0.02, 0.05, 0.022, '#e8c020', 1)), 'heron'));
  return { g: g, n1: n1, n2: n2, head: head, ph: Math.random() * 6, strike: 0 };
}
/* strike 0..1: neck coils, then spears forward and down; otherwise a patient sway */
function poseHeron(h, dt, strike) {
  h.ph += dt; const s = strike > 0 ? (strike < 0.6 ? -strike / 0.6 * 0.5 : Math.sin((strike - 0.6) / 0.4 * Math.PI) * 1.2) : 0;
  h.n1.rotation.x = 0.1 + Math.sin(h.ph * 0.4) * 0.05 + s * 0.6; h.n2.rotation.x = -0.1 + s * 0.4; h.head.rotation.x = s * 0.5; h.head.rotation.y = strike > 0 ? 0 : Math.sin(h.ph * 0.35) * 0.4;
}

Object.assign(CR, { makeFrog: makeFrog, poseFrog: poseFrog, makeFish: makeFish, poseFish: poseFish, makeBee: makeBee, poseBee: poseBee, makeDragonfly: makeDragonfly, poseDragonfly: poseDragonfly,
  makeRabbit: makeRabbit, poseRabbit: poseRabbit, makeDeer: makeDeer, poseDeer: poseDeer, makeOwl: makeOwl, poseOwl: poseOwl, makeHeron: makeHeron, poseHeron: poseHeron });
})();

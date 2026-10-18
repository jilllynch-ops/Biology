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

/* ================= FISH: six real species, each one smooth body that bends as it swims =================
   brook trout, pumpkinseed sunfish, common carp, channel catfish, northern pike, largemouth bass.
   The body, fins, eyes and whiskers are one mesh painted with each species' field marks; a tiny vertex-shader
   wave makes the S-shaped swimming bend (head steady, tail sweeping). Faces +z; length L (meters). */
const FISH = {
  trout:   { L: 0.42, hd: 0.115, wd: 0.065, ped: 0.32, head: 1, tail: 'square', dors: [0.05, 0.22], anal: [-0.22, -0.08], adipose: 1, mouth: 0.6 },
  pumpkinseed: { L: 0.26, hd: 0.25, wd: 0.07, ped: 0.32, head: 1, tail: 'notch', dors: [-0.32, 0.22], anal: [-0.3, -0.05], mouth: 0.35, spiny: 1 },
  carp:    { L: 0.62, hd: 0.15, wd: 0.085, ped: 0.34, head: 1, tail: 'fork', dors: [-0.22, 0.2], anal: [-0.28, -0.16], barbels: 2, mouth: 0.4, scales: 1 },
  catfish: { L: 0.62, hd: 0.09, wd: 0.095, ped: 0.32, head: 1.35, tail: 'fork', dors: [0.08, 0.2], anal: [-0.36, -0.08], adipose: 1, barbels: 8, mouth: 0.9, flat: 1 },
  pike:    { L: 0.8, hd: 0.068, wd: 0.058, ped: 0.45, head: 0.8, tail: 'fork', dors: [-0.36, -0.2], anal: [-0.36, -0.22], mouth: 1.1, snout: 1 },
  bass:    { L: 0.48, hd: 0.13, wd: 0.075, ped: 0.33, head: 1.1, tail: 'notch', dors: [-0.3, 0.2], anal: [-0.3, -0.1], mouth: 1.2, spiny: 1, notchDors: 1 }
};
function fishSkin(kind, sp) {
  const c = new T.Color(), tmp = new T.Color(), R = function (col) { return tmp.set(col); };
  const paint = function (t, yn, side) { /* t: -1 tail .. +1 head along the body, yn: -1 belly .. +1 back, side: |x| fraction */
    const back = clamp((yn - 0.15) * 1.6, 0, 1), belly = clamp((-yn - 0.25) * 2, 0, 1);
    if (kind === 'trout') { c.set('#7a8a50').lerp(R('#2f3a24'), back).lerp(R('#e8742a'), belly); if (belly > 0.6) c.lerp(R('#f4f0e4'), (belly - 0.6) * 1.5);
      if (yn > 0.15 && Math.sin(t * 95 + Math.sin(yn * 30) * 2) * Math.sin(yn * 55 + t * 20) > 0.35) c.lerp(R('#c8c890'), 0.75); /* wormy marks on the back */
      const sp1 = Math.sin(t * 70) * Math.sin(yn * 26 + 1); if (yn < 0.3 && yn > -0.45 && sp1 > 0.82) c.set('#e8d870'); /* yellow spots */
      if (yn < 0.15 && yn > -0.35 && Math.sin(t * 41 + 1.3) * Math.sin(yn * 19 + 2) > 0.9) c.set(Math.sin(t * 41 + 1.3) * Math.sin(yn * 19 + 2) > 0.96 ? '#e82a2a' : '#5a8ae0'); }
    else if (kind === 'pumpkinseed') { c.set('#c8a040').lerp(R('#5a6a30'), back).lerp(R('#f07a1a'), belly);
      if (Math.sin(t * 60) * Math.sin(yn * 30) > 0.6 && belly < 0.5) c.lerp(R(yn > 0 ? '#3a8a8a' : '#e8802a'), 0.7); /* speckles */
      if (t > 0.42 && t < 0.72 && yn < 0.35 && Math.abs(Math.sin(yn * 26 + t * 30)) > 0.82) c.set('#3ab0d0'); /* blue cheek lines */
      if (t > 0.38 && t < 0.5 && yn > 0.05 && yn < 0.42) c.set(t < 0.42 ? '#e02020' : '#101010'); /* the black ear flap with its red spot */
      if (Math.abs(Math.sin(t * 22)) < 0.12 && yn > -0.2 && t < 0.35) c.multiplyScalar(0.85); }
    else if (kind === 'carp') { c.set('#c09040').lerp(R('#6a5428'), back).lerp(R('#f0e0b0'), belly);
      const row = Math.floor(yn * 6 + 6), u = t * 13 + (row % 2) * 0.5, fr = u - Math.floor(u), rv = yn * 6 + 6 - row; if (fr < 0.14 || rv < 0.1) c.multiplyScalar(0.72); else if (fr > 0.5 && fr < 0.75) c.lerp(R('#f0c870'), 0.25); /* big scales */ }
    else if (kind === 'catfish') { c.set('#8a98a8').lerp(R('#3e4a5a'), back).lerp(R('#f4f4f0'), belly);
      if (belly < 0.3 && Math.sin(t * 52 + 0.4) * Math.sin(yn * 31) > 0.86) c.set('#1a1e24'); /* scattered black spots */ }
    else if (kind === 'pike') { c.set('#6a8a40').lerp(R('#2e4424'), back).lerp(R('#f0ecd0'), belly);
      const bx = t * 13, by = yn * 4.5, fx = bx - Math.floor(bx), fy = by - Math.floor(by); if (belly < 0.4 && yn < 0.6 && Math.hypot((fx - 0.5) * 1, (fy - 0.5) * 1.8) < 0.3) c.set('#e8e098'); /* rows of pale bean-shaped spots */ }
    else { c.set('#7a9a50').lerp(R('#34502a'), back).lerp(R('#f2f0e0'), belly); /* largemouth bass */
      const stripe = Math.abs(yn - 0.05 + Math.sin(t * 18) * 0.06); if (stripe < 0.13 && t < 0.55) c.lerp(R('#1e2a16'), 0.85); if (yn > 0.2 && Math.sin(t * 30) * Math.sin(yn * 20) > 0.7) c.multiplyScalar(0.8); }
    return c; };
  /* the gill cover edge and the mouth are painted on */
  const gillT = { trout: 0.52, pumpkinseed: 0.38, carp: 0.5, catfish: 0.58, pike: 0.58, bass: 0.5 }[kind], mouthL = 0.06 + 0.07 * sp.mouth;
  return function (t, yn, side) { const c = paint(t, yn, side); const gt = gillT + yn * yn * 0.06; if (Math.abs(t - gt) < 0.012 && yn < 0.5) c.multiplyScalar(0.55);
    if (t > 1 - mouthL && Math.abs(yn + 0.12 + (t - 1) * 0.6) < 0.035) c.set('#2a1a14'); return c; };
}
/* the body pattern is painted once per species into a picture wrapped around the body (sharp spots and stripes) */
const fishTexCache = {};
function fishTex(kind, sp) { if (fishTexCache[kind]) return fishTexCache[kind]; const W0 = 384, H0 = 192, cv = document.createElement('canvas'); cv.width = W0; cv.height = H0;
  const g = cv.getContext('2d'), im = g.createImageData(W0, H0), skin = fishSkin(kind, sp);
  for (let py = 0; py < H0; py++) { const v = 1 - (py + 0.5) / H0, th = (1 - v) * Math.PI, t = Math.cos(th);
    for (let px = 0; px < W0; px++) { const phi = (px + 0.5) / W0 * Math.PI * 2, yn = -Math.sin(phi), c = skin(t, yn, Math.abs(Math.cos(phi))), i = (py * W0 + px) * 4; im.data[i] = c.r * 255; im.data[i + 1] = c.g * 255; im.data[i + 2] = c.b * 255; im.data[i + 3] = 255; } }
  g.putImageData(im, 0, 0); const tx0 = new T.CanvasTexture(cv); fishTexCache[kind] = tx0; return tx0; }
function finColor(kind, which) {
  const base = { trout: which === 'low' ? '#e86a2a' : '#7a7a50', pumpkinseed: '#8a7a40', carp: which === 'tail' || which === 'low' ? '#c0603a' : '#8a6a3a', catfish: '#5a6070', pike: which === 'tail' || which === 'low' ? '#c0603a' : '#6a7a40', bass: '#6a7a48' }[kind];
  return function (v) { const c = new T.Color(base); if (Math.sin(Math.atan2(v.y, v.z) * 40) > 0.5) c.multiplyScalar(0.82); /* fin rays */
    if (kind === 'trout' && which === 'low' && v.__edge) c.set('#ffffff'); if (kind === 'pike' && Math.sin(v.z * 120) * Math.sin(v.y * 140) > 0.75) c.set('#2a2a20'); return c; };
}
function finGeo(pts) { const sh = new T.Shape(); sh.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]); const g = new T.ShapeGeometry(sh, 4); g.rotateY(-Math.PI / 2); return g; } /* points are (z, y) */
function makeFish(kind) {
  if (kind === 'sunfish') kind = 'pumpkinseed'; const sp = FISH[kind] || FISH.pumpkinseed, L = sp.L, half = L / 2, D = sp.hd * L, Wd = sp.wd * L;
  const prof = function (t) { const base = Math.sqrt(Math.max(0, 1 - t * t)), tail = 0.3 + 0.7 * Math.min(1, Math.max(0, (t + 1) / 1.1)); let f = base * (sp.ped + (1 - sp.ped) * Math.pow(tail, 0.9)); if (sp.snout && t > 0.45) f *= 1 - (t - 0.45) * 0.9; return f; };
  /* body: a sphere reshaped along its length */
  const bg = new T.SphereGeometry(1, 30, 18); bg.rotateX(Math.PI / 2); const P = bg.attributes.position;
  for (let i = 0; i < P.count; i++) { const x0 = P.getX(i), y0 = P.getY(i), t = P.getZ(i), f = prof(t), headW = t > 0.3 ? 1 + (sp.head - 1) * (t - 0.3) / 0.7 : 1, flat = sp.flat && t > 0.2 ? 1 - (t - 0.2) * 0.45 : 1;
    P.setXYZ(i, x0 * Wd * Math.max(f, 0.06) * headW, (y0 < 0 ? y0 * 1.08 : y0) * D * Math.max(f, 0.05) * flat + (sp.snout ? 0 : t * t * D * 0.06), t * half); }
  bg.computeVertexNormals();
  const parts = [];
  const eyeR = Math.max(0.006, L * (kind === 'catfish' ? 0.013 : kind === 'pike' ? 0.026 : 0.034)), ez = half * (sp.snout ? 0.62 : 0.66), ey = D * prof(ez / half) * (sp.flat ? 0.2 : 0.32), ex = Wd * prof(ez / half) * (sp.flat ? sp.head : 0.88);
  [-1, 1].forEach(function (sd) { parts.push({ geo: new T.SphereGeometry(eyeR, 10, 8), m: M4(sd * ex, ey, ez), color: kind === 'pike' || kind === 'trout' ? '#d8b040' : kind === 'bass' ? '#c89030' : kind === 'catfish' ? '#5a4a30' : '#c87a30' },
      { geo: new T.SphereGeometry(eyeR * 0.6, 8, 6), m: M4(sd * (ex + eyeR * 0.5), ey, ez + eyeR * 0.15), color: '#0a0a0a' }, { geo: new T.SphereGeometry(eyeR * 0.22, 6, 4), m: M4(sd * (ex + eyeR * 0.75), ey + eyeR * 0.35, ez + eyeR * 0.3), color: '#ffffff' }); });
  /* fins (z, y) */
  const top = function (t) { return D * prof(t) * 0.92; }, z0 = sp.dors[0] * half * 2, z1 = sp.dors[1] * half * 2, fh = L * (kind === 'catfish' ? 0.1 : kind === 'pike' ? 0.06 : kind === 'pumpkinseed' ? 0.07 : 0.085);
  const dPts = [[z1, top(z1 / half) * 0.95]]; for (let k = 0; k <= 8; k++) { const u = k / 8, z = z1 + (z0 - z1) * u, notch = sp.notchDors ? (Math.abs(u - 0.45) < 0.12 ? 0.35 : 1) : 1; dPts.push([z, top(z / half) + fh * notch * (sp.spiny ? (0.82 + 0.18 * (k % 2)) * (u < 0.5 ? 0.85 : 1.1) : Math.sin(Math.min(1, u * 1.6) * Math.PI * 0.5) * (1 - u * 0.35))]); }
  dPts.push([z0, top(z0 / half) * 0.95]); parts.push({ geo: finGeo(dPts), color: finColor(kind, 'top') });
  if (sp.adipose) { const az = -half * 0.62; parts.push({ geo: finGeo([[az + L * 0.05, top(az / half) * 0.9], [az + L * 0.02, top(az / half) + D * 0.3], [az - L * 0.03, top(az / half) + D * 0.25], [az - L * 0.04, top(az / half) * 0.9]]), color: finColor(kind, 'top') }); }
  const a0 = sp.anal[0] * half * 2, a1 = sp.anal[1] * half * 2, bot = function (t) { return -D * prof(t) * 1.0; };
  parts.push({ geo: finGeo([[a1, bot(a1 / half) * 0.92], [a1 - L * 0.03, bot(a1 / half) - L * 0.075], [a0, bot(a0 / half) - L * 0.06], [a0, bot(a0 / half) * 0.92]]), color: finColor(kind, 'low') });
  /* tail */
  const tz = -half * 0.97, th = D * (kind === 'pumpkinseed' ? 0.9 : kind === 'pike' ? 1.4 : 1.25), tl = L * (kind === 'pike' ? 0.2 : 0.17), fork = sp.tail === 'fork' ? 0.55 : sp.tail === 'notch' ? 0.25 : 0.06;
  parts.push({ geo: finGeo([[tz + L * 0.02, D * 0.12], [tz - tl, th], [tz - tl * (1 - fork), 0], [tz - tl, -th], [tz + L * 0.02, -D * 0.12]]), color: finColor(kind, 'tail') });
  /* paired fins: pectorals behind the gills, pelvics on the belly */
  [-1, 1].forEach(function (sd) { const pz = half * 0.42, pg = finGeo([[0, 0], [-L * 0.1, D * 0.25], [-L * 0.13, -D * 0.05], [-L * 0.04, -D * 0.2]]); parts.push({ geo: pg, m: M4(sd * Wd * prof(0.42) * 0.95, -D * 0.25, pz, 0, sd * 0.6, sd * 0.5), color: finColor(kind, 'low') });
    const vg = finGeo([[0, 0], [-L * 0.08, -D * 0.3], [-L * 0.11, -D * 0.1]]); parts.push({ geo: vg, m: M4(sd * Wd * 0.4, -D * prof(0.1) * 0.85, half * (kind === 'pike' ? -0.25 : 0.15), 0, sd * 0.35, 0), color: finColor(kind, 'low') }); });
  /* whiskers (barbels) */
  if (sp.barbels) { const n = sp.barbels, mz = half * 0.92; for (let k = 0; k < n; k++) { const sd = k % 2 ? 1 : -1, row = Math.floor(k / 2), len = L * (kind === 'catfish' ? (row === 0 ? 0.24 : 0.1) : 0.06);
      parts.push({ geo: new T.CylinderGeometry(L * 0.004, L * 0.0025, len, 4), m: M4(sd * (Wd * 0.4 + row * L * 0.012), -D * (0.05 + row * 0.12), mz - len * 0.35, Math.PI / 2 + 0.5 + row * 0.25, 0, sd * (0.7 + row * 0.2)), color: kind === 'catfish' ? '#2a2e34' : '#7a5a30' }); } }
  const geo = merge(parts);
  const U = { uPh: { value: Math.random() * 6 }, uAmp: { value: 0.1 }, uLen: { value: L } };
  const bend = function (mat) { mat.userData.keepShader = 1; mat.customProgramCacheKey = function () { return 'fishbend'; };
    mat.onBeforeCompile = function (sh) { sh.uniforms.uPh = U.uPh; sh.uniforms.uAmp = U.uAmp; sh.uniforms.uLen = U.uLen;
      sh.vertexShader = 'uniform float uPh; uniform float uAmp; uniform float uLen;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat tz = position.z / uLen; float kk = smoothstep(0.2, -0.55, tz); transformed.x += sin(uPh - tz * 7.0) * uAmp * uLen * kk * kk;'); }; return mat; };
  const g = new T.Group(), body = new T.Mesh(bg, bend(new T.MeshLambertMaterial({ map: fishTex(kind, sp) }))), m = new T.Mesh(geo, bend(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide, transparent: true, opacity: 0.92 }))); g.add(body); g.add(m);
  return { g: g, m: m, U: U, kind: kind, L: L, ph: 0 };
}
/* speed 0..1: faster swimming means a quicker, bigger tail beat */
function poseFish(f, dt, speed) { f.U.uPh.value += dt * (3 + speed * 11); f.U.uAmp.value += ((0.05 + speed * 0.13) - f.U.uAmp.value) * Math.min(1, dt * 3); }

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

Object.assign(CR, { FISH: FISH, makeFrog: makeFrog, poseFrog: poseFrog, makeFish: makeFish, poseFish: poseFish, makeBee: makeBee, poseBee: poseBee, makeDragonfly: makeDragonfly, poseDragonfly: poseDragonfly,
  makeRabbit: makeRabbit, poseRabbit: poseRabbit, makeDeer: makeDeer, poseDeer: poseDeer, makeOwl: makeOwl, poseOwl: poseOwl, makeHeron: makeHeron, poseHeron: poseHeron });
})();

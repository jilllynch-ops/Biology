/* Earthling Field Guide: SUNSET COVE (part of cozy mode).
   A small, polished seaside area at the bottom of the valley below Willow Creek: a valley trail beside a stream, a wildflower
   meadow with a campfire, pines and fallen logs to hide behind, a palm-lined beach, and a shallow lagoon with a coral reef to swim over.
   It is built and shown only while you are here (Willow Creek is hidden, not destroyed), so each place stays fast on Chromebooks.
   Plain JavaScript + three.js r128. Everything is made from code (no image files). */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
const C = BQ.core, T = C.T, tx = C.tx;

Object.assign(C.I18N.en, {
  'co.title': 'Sunset Cove', 'co.down': 'Hiking down the valley to the coast…', 'co.up': 'Hiking back up to Willow Creek…',
  'co.back': 'Hike back up to', 'co.backT': 'Willow Creek', 'co.welcome': 'You followed the stream down the valley to the sea. Walk down to the beach and swim out over the reef: Space swims up, C dives.',
  'co.keys': 'WASD / arrows: move · Shift: run · Space: jump, swim up · C or X: dive · drag or Q/R: look · E: use · Esc: pause',
  'co.pause': 'Paused', 'co.resume': 'Resume', 'co.menu': 'Main menu', 'co.leave': 'Back to Willow Creek', 'co.sit': 'Sit by', 'co.fire': 'the campfire', 'co.stand': 'Move to stand up.',
  'cz.hike': 'Hike down', 'cz.t.coast': 'the valley trail to the coast', 'co.sign': '🌊 To the coast', 'co.signBack': '⛰️ Willow Creek',
  'co.diveTip': 'Under water! Space swims up, C or X dives. The alien does not need air, so take your time.', 'co.newEntry': 'New Field Guide entry', 'co.found': 'Field Guide', 'co.pts': 'points', 'co.jTitle': 'Field Guide: places beyond Willow Creek', 'co.jNone': 'Nothing found here yet. Explore and get close to animals and plants.'
});
Object.assign(C.I18N.es, {
  'co.title': 'Cala del Atardecer', 'co.down': 'Bajando por el valle hasta la costa…', 'co.up': 'Subiendo de nuevo a Willow Creek…',
  'co.back': 'Subir de nuevo a', 'co.backT': 'Willow Creek', 'co.welcome': 'Seguiste el arroyo valle abajo hasta el mar. Baja a la playa y nada sobre el arrecife: Espacio sube, C bucea.',
  'co.keys': 'WASD / flechas: moverse · Shift: correr · Espacio: saltar, subir nadando · C o X: bucear · arrastrar o Q/R: mirar · E: usar · Esc: pausa',
  'co.pause': 'En pausa', 'co.resume': 'Seguir', 'co.menu': 'Menú principal', 'co.leave': 'Volver a Willow Creek', 'co.sit': 'Sentarse junto a', 'co.fire': 'la fogata', 'co.stand': 'Muévete para levantarte.',
  'cz.hike': 'Bajar por', 'cz.t.coast': 'el sendero del valle hasta la costa', 'co.sign': '🌊 A la costa', 'co.signBack': '⛰️ Willow Creek',
  'co.diveTip': '¡Bajo el agua! Espacio sube nadando, C o X bucea. El extraterrestre no necesita aire, así que tómate tu tiempo.', 'co.newEntry': 'Nueva entrada en la Guía de Campo', 'co.found': 'Guía de Campo', 'co.pts': 'puntos', 'co.jTitle': 'Guía de Campo: lugares más allá de Willow Creek', 'co.jNone': 'Todavía no has encontrado nada aquí. Explora y acércate a los animales y las plantas.'
});

/* ---------- THE LAND: one height function for everything (ground, swimming, placing plants) ---------- */
const SUN = new T.Vector3(0.28, 0.075, 1).normalize(); /* low over the sea: golden hour */
function shoreZ(x) { return 10 + 0.0034 * x * x - 5 * Math.exp(-((x + 6) * (x + 6)) / 400); } /* a curved bay, open to the south */
function riverX(z) { return -22 + 7 * Math.sin(z * 0.045 + 0.6); } /* the stream winds down the valley */
const HEADS = [{ x: 64, z: 27, r: 13, h: 7 }, { x: -68, z: 24, r: 12, h: 6 }];
const REEF = []; { const R = rng(11); for (let i = 0; i < 26; i++) { const x = -52 + R() * 104, s = 11 + R() * 28; REEF.push({ x: x, z: shoreZ(x) + s, r: 2.6 + R() * 3.4, h: 0.9 + R() * 1.4 }); } }
function rng(seed) { let s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function valleyFloor(d) { return 0.13 * d; }
function Hc(x, z) {
  const s = z - shoreZ(x); let h;
  if (s < 0) { const d = -s;
    h = d < 12 ? d * 0.11 : 1.32 + (d - 12) * 0.22 + Math.pow(Math.max(0, d - 45), 1.4) * 0.1;
    h += (Math.sin(x * 0.09) * Math.cos(z * 0.07) * 1.4 + Math.sin(x * 0.23 + z * 0.17) * 0.35) * Math.min(1, Math.max(0, d - 10) / 14);
    h += Math.max(0, Math.abs(x) - 70) * 0.5 * Math.min(1, d / 10); /* the bay's sides climb into hills */
    /* the valley: a wide, gentle trough down the middle, with the stream in a small channel */
    const dr = x - riverX(z), wv = Math.exp(-(dr * dr) / (2 * 15 * 15)) * Math.min(1, d / 14), fl = valleyFloor(d) + Math.abs(dr) * 0.06;
    h = h * (1 - wv) + Math.min(h, fl) * wv;
    if (d > 3) h -= 0.95 * Math.exp(-(dr * dr) / 2.6) * Math.min(1, (d - 3) / 6);
  } else {
    h = -Math.min(s * 0.2, 1.6) - Math.max(0, s - 6) * 0.09; if (s > 44) h -= Math.min(11, (s - 44) * 0.5);
    for (let i = 0; i < REEF.length; i++) { const r = REEF[i], dx = x - r.x, dz = z - r.z, q = (dx * dx + dz * dz) / (r.r * r.r); if (q < 4) h += r.h * Math.exp(-q * 1.4); }
    h = Math.min(h, s > 12 ? -1.9 : -0.2 - s * 0.14) * (s > 3 ? 1 : 0) + h * (s > 3 ? 0 : 1); /* reef tops stay under water so you can swim over */
    h += 0.05 * Math.sin(x * 1.3 + z * 0.4) * Math.sin(z * 0.9);
    const dr = x - riverX(z); if (s < 6) h -= 0.5 * Math.exp(-(dr * dr) / 6) * (1 - s / 6);
  }
  for (let i = 0; i < HEADS.length; i++) { const k = HEADS[i], dx = x - k.x, dz = z - k.z, q = (dx * dx + dz * dz) / (k.r * k.r); if (q < 5) h += k.h * Math.exp(-q) * (1 + 0.25 * Math.sin(x * 0.8) * Math.cos(z * 0.7)); }
  return h;
}
function streamY(z) { const x = riverX(z), d = shoreZ(x) - z; return d < 2 ? 0.02 : valleyFloor(d) - 0.42; }
const PATH = (function () { const p = []; for (let z = -94; z <= -34; z += 12) p.push([riverX(z) + 6.5, z]); p.push([-6, -22], [0, -10], [3, 1]); return smooth(p, 60); })();
const PATH2 = smooth([[0, -10], [16, -6], [30, 2], [44, 12], [52, 18]], 30);
function smooth(pts, n) { return new T.CatmullRomCurve3(pts.map(function (q) { return new T.Vector3(q[0], 0, q[1]); }), false, 'centripetal').getSpacedPoints(n).map(function (v) { return [v.x, v.z]; }); }
function segD(x, z, a, b) { const vx = b[0] - a[0], vz = b[1] - a[1], u = Math.max(0, Math.min(1, ((x - a[0]) * vx + (z - a[1]) * vz) / (vx * vx + vz * vz || 1))); return Math.hypot(x - a[0] - u * vx, z - a[1] - u * vz); }
function lineD(P, x, z) { let d = 1e9; for (let i = 0; i < P.length - 1; i++) { if (Math.abs(P[i][0] - x) > 9 && Math.abs(P[i][1] - z) > 9) continue; d = Math.min(d, segD(x, z, P[i], P[i + 1])); } return d; }
function sandEdge(x, z) { const n = Math.sin(x * 0.21 + Math.cos(z * 0.17) * 2) * Math.cos(z * 0.13 - x * 0.05); return -11 + n * 2.5; }
function pathD(x, z) { return Math.min(lineD(PATH, x, z), lineD(PATH2, x, z)); }
const START = { x: riverX(-76) + 6.6, z: -76 }, FIRE = { x: 7.5, z: -22 }, BOUNDS = { x0: -84, x1: 84, z0: -96, z1: 96 };

/* ---------- small helpers ---------- */
let K = null; /* the running cove */
const UT = { value: 0 };
function low() { return !!(C.S.set && C.S.set.low); }
function $(id) { return document.getElementById(id); }
function amb(fn, a, b) { if (BQ.amb && BQ.amb[fn]) BQ.amb[fn](a, b); }
function f2(v) { return (+v).toFixed(3); }
function windy(mat, amp, spd, mode, key) {
  mat.onBeforeCompile = function (sh) { sh.uniforms.uT = UT;
    sh.vertexShader = 'uniform float uT;\n' + (mode === 'attr' ? 'attribute float aFlex;\n' : '') + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);\n#else\nvec3 ip = position;\n#endif\n' +
      'float fl = ' + (mode === 'attr' ? 'aFlex' : 'clamp(position.y, 0.0, 1.0)') + '; fl *= fl;\n' +
      'float sw = sin(uT * ' + f2(spd) + ' + ip.x * 0.31 + ip.z * 0.23) * 0.6 + sin(uT * ' + f2(spd * 1.9) + ' + ip.x * 0.9 - ip.z * 0.7) * 0.25;\n' +
      'transformed.x += sw * fl * ' + f2(amp) + '; transformed.z += sw * fl * ' + f2(amp * 0.6) + ';'); };
  mat.customProgramCacheKey = function () { return 'cw' + key; }; return mat;
}
function colorize(geo, fn) { const p = geo.attributes.position, n = geo.attributes.normal, c = new Float32Array(p.count * 3), o = [0, 0, 0];
  for (let i = 0; i < p.count; i++) { fn(p.getX(i), p.getY(i), p.getZ(i), n ? n.getY(i) : 1, o, i); c[i * 3] = o[0]; c[i * 3 + 1] = o[1]; c[i * 3 + 2] = o[2]; }
  geo.setAttribute('color', new T.BufferAttribute(c, 3)); return geo; }
function hexc(h) { const c = new T.Color(h); return [c.r, c.g, c.b]; }
/* join many shapes into one (one draw call); keeps position, normal, color and the wind "flex" value */
function merge(list) { let nv = 0, ni = 0; list.forEach(function (g) { if (!g.attributes.normal) g.computeVertexNormals(); nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; });
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), col = new Float32Array(nv * 3).fill(1), flex = new Float32Array(nv), idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni); let ov = 0, oi = 0;
  list.forEach(function (g) { const p = g.attributes.position; pos.set(p.array, ov * 3); nor.set(g.attributes.normal.array, ov * 3); if (g.attributes.color) col.set(g.attributes.color.array, ov * 3); if (g.attributes.aFlex) flex.set(g.attributes.aFlex.array, ov);
    if (g.index) { for (let i = 0; i < g.index.count; i++) idx[oi + i] = g.index.array[i] + ov; oi += g.index.count; } else { for (let i = 0; i < p.count; i++) idx[oi + i] = ov + i; oi += p.count; } ov += p.count; });
  const m = new T.BufferGeometry(); m.setAttribute('position', new T.BufferAttribute(pos, 3)); m.setAttribute('normal', new T.BufferAttribute(nor, 3)); m.setAttribute('color', new T.BufferAttribute(col, 3)); m.setAttribute('aFlex', new T.BufferAttribute(flex, 1)); m.setIndex(new T.BufferAttribute(idx, 1)); return m; }
function place(geo, x, y, z, sx, sy, sz, ry, rx, rz) { const g = geo.clone(), m = new T.Matrix4(), q = new T.Quaternion().setFromEuler(new T.Euler(rx || 0, ry || 0, rz || 0)); m.compose(new T.Vector3(x, y, z), q, new T.Vector3(sx, sy, sz)); g.applyMatrix4(m); return g; }
function inst(geo, mat, list, cols) { const im = new T.InstancedMesh(geo, mat, Math.max(1, list.length)), o = new T.Object3D(), c = new T.Color();
  list.forEach(function (it, i) { o.position.set(it[0], it[1], it[2]); o.scale.set(it[3], it[4], it[5]); o.rotation.set(it[7] || 0, it[6] || 0, it[8] || 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); if (cols) im.setColorAt(i, c.set(cols[i])); });
  im.count = list.length; return im; }
function canvasTex(w, h, draw) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new T.CanvasTexture(cv); return t; }
function softDot() { return canvasTex(64, 64, function (x) { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }); }

/* a leaf frond: an arching strip with notched leaflets, from (0,0,0) outward along +x. flex (0 at the base, 1 at the tip) drives the breeze */
function frondGeo(len, wid, rise, droop, seg, c0, c1, out) {
  const P = [], N = [], CO = [], FX = [], I = [], A = new T.Color(c0), Bc = new T.Color(c1);
  for (let s0 = 0; s0 <= seg; s0++) { const t = s0 / seg, cx = t * len, cy = Math.sin(t * Math.PI * 0.55) * rise - t * t * droop, w = (wid * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.12)), 0.6) + wid * 0.08) * (s0 % 2 ? 1 : 0.7);
    P.push(cx, cy - 0.12 * w, -w, cx, cy + 0.05 * wid, 0, cx, cy - 0.12 * w, w); for (let q = 0; q < 3; q++) { N.push(0, 1, 0); const c = A.clone().lerp(Bc, t * 0.85 + (q === 1 ? 0 : 0.1)); CO.push(c.r, c.g, c.b); FX.push(t * (out || 0.9)); }
    if (s0 < seg) { const b = s0 * 3; I.push(b, b + 3, b + 1, b + 1, b + 3, b + 4, b + 1, b + 4, b + 2, b + 2, b + 4, b + 5); } }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(N, 3)); g.setAttribute('color', new T.Float32BufferAttribute(CO, 3)); g.setAttribute('aFlex', new T.Float32BufferAttribute(FX, 1)); g.setIndex(I); return g;
}
/* ---------- WATER: one shader for the sea (waves, sun glitter, turquoise shallows, foam on the sand) ---------- */
function waterMat(far, o) { o = o || {}; const V = function (c, d) { const q = new T.Color(c || d); return new T.Vector3(q.r, q.g, q.b); };
  return new T.ShaderMaterial({ transparent: true, depthWrite: false, side: T.DoubleSide, fog: true,
    uniforms: T.UniformsUtils.merge([T.UniformsLib.fog, { uT: { value: 0 }, uSun: { value: (o.sun || SUN).clone() }, uHole: { value: new T.Vector4(-130, 130, -30, 190) }, uFar: { value: far ? 1 : 0 },
      uShal: { value: V(o.shallow, '#54e0d1') }, uDeep: { value: V(o.deep, '#084d80') }, uSkyH: { value: V(o.skyH, '#ff9e6b') }, uSkyM: { value: V(o.skyM, '#d17a94') }, uSkyT: { value: V(o.skyT, '#384085') }, uSunC: { value: V(o.sunC, '#ffc780') }, uFoam: { value: o.foam == null ? 1 : o.foam } }]),
    vertexShader: 'attribute float aDepth; uniform float uT; varying vec3 vW; varying float vD;\n#include <fog_pars_vertex>\nvoid main() { vec3 p = position; float k = clamp(aDepth * 0.7, 0.0, 1.0);\n' +
      ' p.y += (sin(p.x * 0.35 + uT * 1.2) * 0.05 + sin(p.z * 0.5 - uT * 1.5) * 0.045 + sin((p.x + p.z) * 0.9 + uT * 2.1) * 0.02) * k;\n' +
      ' vec4 wp = modelMatrix * vec4(p, 1.0); vW = wp.xyz; vD = aDepth; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;\n#include <fog_vertex>\n}',
    fragmentShader: 'uniform float uT; uniform vec3 uSun; uniform vec4 uHole; uniform float uFar; uniform vec3 uShal, uDeep, uSkyH, uSkyM, uSkyT, uSunC; uniform float uFoam; varying vec3 vW; varying float vD;\n#include <common>\n#include <fog_pars_fragment>\n' +
      'vec2 grad(vec2 p, float t) { vec2 g = vec2(0.0);\n' +
      ' g.x += 0.0175 * cos(p.x * 0.35 + t * 1.2); g.y += 0.0225 * cos(p.y * 0.5 - t * 1.5); float a = cos((p.x + p.y) * 0.9 + t * 2.1) * 0.018; g += vec2(a, a);\n' +
      ' vec2 d1 = vec2(0.8, 0.6), d2 = vec2(-0.5, 0.86), d3 = vec2(0.2, -0.98);\n' +
      ' g += d1 * cos(dot(p, d1) * 3.1 + t * 2.6) * 0.035 + d2 * cos(dot(p, d2) * 4.3 - t * 3.1) * 0.028 + d3 * cos(dot(p, d3) * 6.7 + t * 3.7) * 0.02 + d1.yx * cos(dot(p, d1.yx) * 11.0 - t * 4.4) * 0.012;\n return g; }\n' +
      'void main() {\n if (uFar > 0.5 && vW.x > uHole.x && vW.x < uHole.y && vW.z > uHole.z && vW.z < uHole.w) discard;\n' +
      ' vec2 g = grad(vW.xz, uT); vec3 n = normalize(vec3(-g.x, 1.0, -g.y)); vec3 v = normalize(cameraPosition - vW);\n' +
      ' if (!gl_FrontFacing) { float s = pow(max(dot(-v, uSun), 0.0), 8.0); float tir = smoothstep(0.55, 0.85, abs(dot(v, n)));\n' +
      '   vec3 c = mix(vec3(0.10, 0.45, 0.55), vec3(0.75, 0.95, 1.0), tir * 0.7) + vec3(1.0, 0.85, 0.6) * s * 0.4; gl_FragColor = vec4(c, 0.9);\n#include <fog_fragment>\n return; }\n' +
      ' float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0); vec3 r = reflect(-v, n); float el = clamp(r.y, 0.0, 1.0);\n' +
      ' vec3 sky = mix(uSkyH, mix(uSkyM, uSkyT, smoothstep(0.15, 0.6, el)), smoothstep(0.0, 0.18, el));\n' +
      ' float sd = max(dot(r, uSun), 0.0); float glit = pow(sd, 260.0) * 7.0 + pow(sd, 18.0) * 0.45;\n' +
      ' float dep = clamp(vD / 6.0, 0.0, 1.0); vec3 body = mix(uShal, uDeep, smoothstep(0.0, 1.0, dep)); body = mix(body, vec3(0.6, 0.95, 0.85), smoothstep(0.6, 0.0, vD) * 0.4);\n' +
      ' vec3 col = mix(body, sky, fres * 0.6 + 0.05) + uSunC * glit;\n' +
      ' float wave = sin(vD * 9.0 - uT * 1.6 + sin(vW.x * 0.3) * 1.5); float fn = sin(vW.x * 1.7 + uT * 1.3 + sin(vW.z * 2.1)) * sin(vW.z * 1.3 - uT * 0.9);\n' +
      ' float foam = smoothstep(0.45, 0.0, vD) * smoothstep(0.2, 0.75, fn * 0.5 + 0.5 + smoothstep(0.25, 0.0, vD) * 0.6) + smoothstep(0.92, 1.0, wave) * smoothstep(1.4, 0.2, vD) * 0.6;\n' +
      ' foam *= uFoam; col = mix(col, vec3(1.0, 0.97, 0.92), clamp(foam, 0.0, 1.0) * 0.85);\n' +
      ' float a = mix(0.42, 0.95, smoothstep(0.0, 5.0, vD)); a = max(a, foam); a = mix(a, 1.0, fres * 0.45); if (vD < 0.02) a *= smoothstep(-0.02, 0.02, vD);\n' +
      ' gl_FragColor = vec4(col, a);\n#include <fog_fragment>\n}' });
}
/* CAUSTICS: the moving net of light on anything under the water (ground, rocks, corals, animals) */
const CAUST = 'float causticLine(vec2 p, float t) { vec2 i = p; float c = 1.0, inten = 0.005;\n for (int n = 0; n < 4; n++) { float tt = t * (1.0 - (3.5 / float(n + 1))); i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));\n  c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten))); }\n c /= 4.0; c = 1.17 - pow(c, 1.4); return clamp(pow(abs(c), 8.0), 0.0, 1.0); }\n';
function causticify(mat, key, wl) { const prev = mat.onBeforeCompile; mat.onBeforeCompile = function (sh, r) { if (prev && prev !== T.Material.prototype.onBeforeCompile) prev(sh, r); sh.uniforms.uT = UT; sh.uniforms.uWL = { value: wl || 0 };
    sh.vertexShader = 'varying vec3 vWPos;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvec4 cwp = vec4(transformed, 1.0);\n#ifdef USE_INSTANCING\ncwp = instanceMatrix * cwp;\n#endif\nvWPos = (modelMatrix * cwp).xyz;');
    sh.fragmentShader = (sh.fragmentShader.indexOf('uniform float uT;') >= 0 ? '' : 'uniform float uT;\n') + 'uniform float uWL; varying vec3 vWPos;\n' + CAUST + sh.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      'float uw = smoothstep(uWL + 0.05, uWL - 0.35, vWPos.y); float dpt = clamp((uWL - vWPos.y) / 7.0, 0.0, 1.0);\n outgoingLight += causticLine(vWPos.xz * 0.55, uT * 0.5) * uw * (1.0 - dpt * 0.75) * vec3(0.6, 0.9, 0.95) * 0.35 * (0.4 + 0.6 * outgoingLight);\n outgoingLight = mix(outgoingLight, outgoingLight * vec3(0.55, 0.85, 0.95), uw * (0.1 + dpt * 0.4));\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );'); };
  mat.customProgramCacheKey = function () { return 'caus' + key; }; return mat; }
/* WATERFALL: a ribbon that hugs the rock from the top of the cliff down into the pool, with streaks that always move DOWN */
const VNOISE = 'float hs(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\nfloat vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hs(i), hs(i + vec2(1.0, 0.0)), f.x), mix(hs(i + vec2(0.0, 1.0)), hs(i + vec2(1.0, 1.0)), f.x), f.y); }\n';
function fallRibbon(H, top, pool, wl, n, w0, w1) { n = n || 26; w0 = w0 == null ? 1.15 : w0; w1 = w1 == null ? 0.9 : w1; const P = [], UV = [], I = [], dx = pool[0] - top[0], dz = pool[1] - top[1], L = Math.hypot(dx, dz), nx = -dz / L, nz = dx / L; let last = 1e9;
  for (let i = 0; i <= n; i++) { const t = i / n, x = top[0] + t * dx, z = top[1] + t * dz, w = w0 + t * w1; let y = Math.max(H(x, z), wl - 0.2) + 0.14; y = Math.min(y, last); last = y; /* never climbs: water only goes down */
    P.push(x + nx * w, y, z + nz * w, x - nx * w, y, z - nz * w); UV.push(0, t, 1, t); if (i < n) { const b = i * 2; I.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); } }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(UV, 2)); g.setIndex(I); g.computeVertexNormals(); return g; }
function fallMat(len) { return new T.ShaderMaterial({ transparent: true, depthWrite: false, side: T.DoubleSide, uniforms: { uT: UT, uLen: { value: len || 1 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform float uT; uniform float uLen; varying vec2 vUv;\n' + VNOISE + 'void main() { float v = vUv.y * uLen;\n float s = vn(vec2(vUv.x * 14.0, v * 9.0 - uT * 2.6)) * 0.6 + vn(vec2(vUv.x * 30.0, v * 20.0 - uT * 4.0)) * 0.4;\n' +
    ' float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x); vec3 col = mix(vec3(0.45, 0.75, 0.9), vec3(0.87, 0.96, 1.0), smoothstep(0.35, 0.8, s));\n float a = edge * (0.55 + 0.45 * s) * smoothstep(1.0, 0.86, vUv.y); gl_FragColor = vec4(col, a); }' }); }
/* MIST rising from a plunge pool: dots moved by the graphics card, each with its own seed */
function mist(x, y, z, n, spread) { const p = new Float32Array(n * 3), sd = new Float32Array(n), R = rng(91); for (let i = 0; i < n; i++) { const a = R() * 6.283, r = R() * spread; p.set([x + Math.cos(a) * r, y, z + Math.sin(a) * r], i * 3); sd[i] = R(); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(p, 3)); g.setAttribute('aSeed', new T.BufferAttribute(sd, 1));
  const m = new T.Points(g, new T.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uT: UT, uScale: { value: 900 } },
    vertexShader: 'uniform float uT; uniform float uScale; attribute float aSeed; varying float vA; void main() { float seed = aSeed; float t = fract(uT * (0.2 + seed * 0.2) + seed);\n vec3 p = position + vec3((seed - 0.5) * 2.0 * t, t * 2.2, sin(seed * 40.0) * t); vec4 mv = modelViewMatrix * vec4(p, 1.0);\n gl_PointSize = uScale * (0.12 + t * 0.25) / -mv.z; vA = (1.0 - t) * 0.25; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying float vA; void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(0.92, 0.97, 1.0, vA * smoothstep(0.5, 0.1, d)); }' }));
  m.frustumCulled = false; m.renderOrder = 4; return m; }
/* the sky: a sunset gradient with a soft sun */
function skyMat() { return new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { uSun: { value: SUN.clone() } },
  vertexShader: 'varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'uniform vec3 uSun; varying vec3 vD; void main() { vec3 d = normalize(vD); float y = d.y, s = max(dot(d, uSun), 0.0);\n' +
    ' vec3 hor = vec3(1.0, 0.64, 0.42), mid = vec3(0.86, 0.47, 0.58), top = vec3(0.16, 0.19, 0.44);\n' +
    ' vec3 c = mix(hor, mid, smoothstep(0.0, 0.2, y)); c = mix(c, top, smoothstep(0.18, 0.7, y));\n' +
    ' c = mix(c, vec3(1.0, 0.72, 0.42), pow(s, 6.0) * 0.65 * (1.0 - smoothstep(0.0, 0.45, y)));\n' +
    ' c += vec3(1.0, 0.86, 0.58) * (pow(s, 900.0) * 4.0 + pow(s, 60.0) * 0.35);\n' +
    ' if (y < 0.0) c = mix(c, vec3(0.93, 0.6, 0.48), smoothstep(0.0, -0.1, y));\n gl_FragColor = vec4(c, 1.0); }' }); }

/* ---------- BUILD THE COVE ---------- */
function build() {
  const g = new T.Group(), LO = low(), R = rng(7), cc = new T.Color();
  K.g = g; K.colliders = []; K.anim = []; C.scene.add(g);
  /* light: a low, warm sun and a pink sky; warm haze toward the horizon */
  C.scene.background = new T.Color('#e8a08a'); C.scene.fog = new T.FogExp2('#e7a58e', 0.0058);
  C.HEMI.color.set('#ffd2b8'); C.HEMI.groundColor.set('#3a5a3a'); C.HEMI.intensity = 0.62; C.KEYL.color.set('#ffb57a'); C.KEYL.intensity = 1.15; C.KEYL.position.copy(SUN).multiplyScalar(120);
  K.sky = new T.Mesh(new T.SphereGeometry(900, 32, 16), skyMat()); K.sky.renderOrder = -10; g.add(K.sky);
  /* clouds: soft puffs, lit gold toward the sun and pink-violet away from it */
  { const ct = canvasTex(128, 64, function (x) { for (let i = 0; i < 9; i++) { const cx = 20 + i * 11 + Math.sin(i * 2.3) * 6, cy = 38 - Math.sin(i / 8 * Math.PI) * 14, r = 12 + Math.sin(i * 1.7) * 4 + 6; const gr = x.createRadialGradient(cx, cy, 0, cx, cy, r); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 64); } });
    for (let i = 0; i < (LO ? 9 : 16); i++) { const a = -1.2 + i / (LO ? 9 : 16) * 4.6 + R() * 0.2, dir = new T.Vector3(Math.sin(a), 0, Math.cos(a)), near = Math.max(0, dir.dot(new T.Vector3(SUN.x, 0, SUN.z).normalize()));
      const sp = new T.Sprite(new T.SpriteMaterial({ map: ct, color: new T.Color('#c48aa8').lerp(new T.Color('#ffc890'), near * near), transparent: true, opacity: 0.85, fog: false, depthWrite: false }));
      sp.position.set(dir.x * 600, 40 + R() * 110, dir.z * 600); sp.scale.set(160 + R() * 120, 50 + R() * 30, 1); g.add(sp); } }
  /* the ground */
  const NX = LO ? 110 : 160, NZ = LO ? 115 : 168, geo = new T.PlaneGeometry(220, 230, NX, NZ); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, 10);
  const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, Hc(pos.getX(i), pos.getZ(i))); geo.computeVertexNormals();
  colorize(geo, function (x, y, z, ny, o) { const s = z - shoreZ(x), pd = pathD(x, z), dr = Math.abs(x - riverX(z)), n = Math.sin(x * 0.21 + Math.cos(z * 0.17) * 2) * Math.cos(z * 0.13 - x * 0.05);
    if (s > 0.6) cc.set(y < -6 ? '#7ab0a8' : '#efe2bc').lerp(new T.Color('#c8d0a0'), Math.max(0, Math.min(1, (y + 0.7) * 0.6)) * (s > 8 ? 0.5 : 0)); /* pale sand under the water */
    else if (s > -1.2) cc.set('#d6c094'); /* wet sand */
    else if (s > -11 + n * 2.5) cc.set('#f2e2b6').lerp(new T.Color('#e6d09c'), Math.max(0, n) * 0.6); /* dry beach */
    else { cc.set(n > 0.35 ? '#8cb444' : n < -0.4 ? '#4f8a34' : '#6aa23c'); if (y > 16) cc.lerp(new T.Color('#3f6a34'), Math.min(1, (y - 16) / 14)); }
    if (ny < 0.72 && s < -1) cc.set('#8d877e').lerp(new T.Color('#6a6a62'), Math.max(0, n)); /* steep: bare rock */
    for (let h = 0; h < HEADS.length; h++) { const k = HEADS[h]; if (Math.hypot(x - k.x, z - k.z) < k.r * 1.2 && y > 0.6) cc.set(ny < 0.82 ? '#8a7f74' : '#7a9a44'); }
    if (s < -2 && dr < 3.2) cc.lerp(new T.Color('#8a8070'), dr < 1.8 ? 0.9 : 0.4); /* stream bed pebbles */
    if (pd < 1.7 && s < -0.5) cc.lerp(new T.Color('#c09060'), pd < 1.1 ? 0.85 : 0.4); /* the trail */
    cc.offsetHSL(0, 0, Math.sin(x * 1.7 + z * 2.3) * 0.02); o[0] = cc.r; o[1] = cc.g; o[2] = cc.b; });
  const nt = canvasTex(128, 128, function (x) { const id = x.createImageData(128, 128), r0 = rng(3); for (let i = 0; i < 128 * 128; i++) { const v = 225 + Math.floor(r0() * 30); id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; } x.putImageData(id, 0, 0); });
  nt.wrapS = nt.wrapT = T.RepeatWrapping; nt.repeat.set(60, 60);
  const tm = new T.MeshLambertMaterial({ vertexColors: true, map: nt });
  causticify(tm, 'coastTerr', 0);

  K.ground = new T.Mesh(geo, tm); g.add(K.ground);
  /* far hills around the bay and headlands across the water (they fade pink-violet into the haze) */
  { const parts = []; [[-190, 140, 70, 34], [-130, 230, 60, 26], [180, 160, 80, 40], [250, 300, 90, 30], [-260, 330, 110, 44], [0, 520, 220, 36], [120, 420, 70, 24], [-150, -60, 90, 48], [150, -80, 100, 52], [0, -200, 160, 60]].forEach(function (m, i) {
      const cg = new T.ConeGeometry(m[2], m[3], 9, 3); const p = cg.attributes.position; for (let k = 0; k < p.count; k++) { const yy = p.getY(k); if (yy < m[3] / 2 - 0.1) { p.setX(k, p.getX(k) * (1 + 0.18 * Math.sin(k * 1.3 + i))); p.setZ(k, p.getZ(k) * (1 + 0.18 * Math.cos(k * 1.7 + i))); } }
      cg.computeVertexNormals(); colorize(cg, function (x, y, z, ny, o) { const c0 = new T.Color(i > 6 ? '#3f6a3a' : '#5a6a50').lerp(new T.Color('#8a7a6a'), y > m[3] * 0.2 ? 0.5 : 0); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; });
      parts.push(place(cg, m[0], m[3] / 2 - 4, m[1], 1, 1, 1, i)); });
    g.add(new T.Mesh(merge(parts), new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }))); }
  /* the sea: a detailed piece over the bay (its depth comes from the sea floor) and a plain piece out to the horizon */
  { const n1 = LO ? 70 : 120, n2 = LO ? 60 : 110, wg = new T.PlaneGeometry(260, 220, n1, n2); wg.rotateX(-Math.PI / 2); wg.translate(0, 0, 80); const wp = wg.attributes.position, dep = new Float32Array(wp.count);
    for (let i = 0; i < wp.count; i++) dep[i] = Math.max(0, -Hc(wp.getX(i), wp.getZ(i))); wg.setAttribute('aDepth', new T.BufferAttribute(dep, 1));
    K.waterM = waterMat(false); K.water = new T.Mesh(wg, K.waterM); K.water.renderOrder = 2; g.add(K.water);
    const fg = new T.PlaneGeometry(2400, 2400, 1, 1); fg.rotateX(-Math.PI / 2); fg.setAttribute('aDepth', new T.BufferAttribute(new Float32Array(4).fill(30), 1));
    K.farM = waterMat(true); K.farM.uniforms.uHole.value.set(-130, 130, -30, 190); const far = new T.Mesh(fg, K.farM); far.position.y = -0.03; far.renderOrder = 1; g.add(far); }
  /* the stream: a ribbon of moving water that steps down the valley to the beach */
  { const pts = []; for (let z = -100; z < shoreZ(riverX(0)) + 2; z += 1.2) pts.push([riverX(z), z]); const m = pts.length, p = new Float32Array(m * 6), uv = new Float32Array(m * 4), idx = []; let along = 0;
    for (let i = 0; i < m; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(m - 1, i + 1)], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1, nx = -dz / L, nz = dx / L, w = 1.25 + 0.2 * Math.sin(i * 0.7), y = Math.max(streamY(pts[i][1]), Hc(pts[i][0], pts[i][1]) + 0.12);
      if (i) along += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); p.set([pts[i][0] + nx * w, y, pts[i][1] + nz * w, pts[i][0] - nx * w, y, pts[i][1] - nz * w], i * 6); uv.set([0, along / 4, 1, along / 4], i * 4); if (i < m - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(p, 3)); sg.setAttribute('uv', new T.BufferAttribute(uv, 2)); sg.setIndex(idx); sg.computeVertexNormals();
    K.streamTex = canvasTex(64, 128, function (x) { x.fillStyle = '#5ab8c8'; x.fillRect(0, 0, 64, 128); x.lineCap = 'round'; for (let i = 0; i < 30; i++) { x.strokeStyle = 'rgba(255,255,255,' + (0.2 + (i % 4) * 0.12) + ')'; x.lineWidth = 1 + (i % 3); const xx = 4 + (i * 23) % 56, yy = (i * 41) % 128; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 2, yy + 10 + (i % 5) * 4); x.stroke(); } });
    K.streamTex.wrapS = K.streamTex.wrapT = T.RepeatWrapping; const sm = new T.Mesh(sg, new T.MeshLambertMaterial({ map: K.streamTex, color: '#bff4ff', emissive: '#1a4a58', transparent: true, opacity: 0.82, depthWrite: false })); sm.renderOrder = 3; g.add(sm); }

  /* ---------- plants: short grass, wildflowers, ferns (they all sway in the breeze) ---------- */
  const ok = function (x, z, minS) { const s = z - shoreZ(x); if (s > Math.min(minS == null ? -9 : minS, sandEdge(x, z) - 1.2)) return false; if (pathD(x, z) < 1.7) return false; if (Math.abs(x - riverX(z)) < 2.6) return false; const y = Hc(x, z), gx = Hc(x + 0.6, z) - y, gz = Hc(x, z + 0.6) - y; if (Math.hypot(gx, gz) > 0.45) return false;
    for (let i = 0; i < HEADS.length; i++) if (Math.hypot(x - HEADS[i].x, z - HEADS[i].z) < HEADS[i].r * 0.9) return false; return Math.hypot(x - FIRE.x, z - FIRE.z) > 3.4; };
  { /* grass tufts: five thin blades each, dark at the root and sunlit at the tip */
    const blades = []; for (let b = 0; b < 7; b++) { const a = b / 7 * 6.283 + 0.3, ox = Math.cos(a) * 0.12, oz = Math.sin(a) * 0.12, lean = 0.2 + (b % 3) * 0.1, w = 0.075;
      const bg = new T.BufferGeometry(); bg.setAttribute('position', new T.BufferAttribute(new Float32Array([ox - w, 0, oz, ox + w, 0, oz, ox + Math.cos(a) * lean, 1, oz + Math.sin(a) * lean]), 3)); bg.setIndex([0, 1, 2]); bg.computeVertexNormals();
      bg.setAttribute('normal', new T.BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]), 3)); colorize(bg, function (x, y, z, ny, o) { const c0 = new T.Color('#5f8f32').lerp(new T.Color('#d8e888'), y); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; }); blades.push(bg); }
    const tuft = merge(blades), list = [], cols = [], n = LO ? 3000 : 8000, shades = ['#ffffff', '#e8f0c0', '#d0e8b0', '#f4e8a8'];
    for (let i = 0, tries = 0; list.length < n && tries < n * 6; tries++) { const x = -84 + R() * 168, z = -98 + R() * 120; if (!ok(x, z)) continue; const s = 0.24 + R() * 0.22; list.push([x, Hc(x, z) - 0.02, z, 1, s, 1, R() * 6.28]); cols.push(shades[i++ % 4]); }
    const gm = windy(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.22, 1.7, 'y', 'grass'); g.add(inst(tuft, gm, list, cols)); }
  { /* wildflowers in drifts: white daisies, yellow buttercups, red poppies and purple lupines */
    const head = new T.CircleGeometry(1, 6); head.rotateX(-Math.PI / 2); const bud = new T.OctahedronGeometry(1, 0), stem = new T.CylinderGeometry(0.02, 0.02, 1, 3, 1, true); stem.translate(0, 0.5, 0);
    const fl = merge([colorize(place(stem, 0, 0, 0, 1, 1, 1), function (x, y, z, ny, o) { o[0] = 0.3; o[1] = 0.55; o[2] = 0.2; }), colorize(place(head, 0, 1, 0, 0.14, 1, 0.14), function (x, y, z, ny, o) { o[0] = o[1] = o[2] = 1; }), colorize(place(bud, 0, 1.02, 0, 0.05, 0.04, 0.05), function (x, y, z, ny, o) { o[0] = 1; o[1] = 0.8; o[2] = 0.2; })]);
    const spike = new T.ConeGeometry(0.09, 0.6, 6); spike.translate(0, 0.85, 0); const lup = [colorize(spike, function (x, y, z, ny, o) { const k = 0.75 + 0.25 * Math.sin(y * 40); o[0] = o[1] = o[2] = k; })]; lup.push(colorize(place(stem, 0, 0, 0, 1, 0.6, 1), function (x, y, z, ny, o) { o[0] = 0.3; o[1] = 0.5; o[2] = 0.2; }));
    const lupG = merge(lup), L1 = [], C1 = [], L2 = [], C2 = [], n = LO ? 700 : 1700, petal = ['#ffffff', '#ffffff', '#ffd23a', '#ff4a3a', '#ffffff', '#ffe08a'];
    for (let tries = 0; L1.length + L2.length < n && tries < n * 10; tries++) { const x = -80 + R() * 160, z = -90 + R() * 90, s = z - shoreZ(x); if (!ok(x, z, -13)) continue; const drift = Math.sin(x * 0.11 + 1) * Math.cos(z * 0.09) + Math.sin(x * 0.05 - z * 0.07) * 0.6; if (drift < 0.35) continue;
      const y = Hc(x, z); if (drift > 0.9 && R() < 0.5) { L2.push([x, y, z, 1, 0.55 + R() * 0.4, 1, R() * 6]); C2.push(R() < 0.8 ? '#8a6ad8' : '#c86ac8'); } else { L1.push([x, y, z, 1, 0.3 + R() * 0.2, 1, R() * 6]); C1.push(petal[Math.floor(R() * petal.length)]); } }
    g.add(inst(fl, windy(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.18, 1.7, 'y', 'flower'), L1, C1)); g.add(inst(lupG, windy(new T.MeshLambertMaterial({ vertexColors: true }), 0.25, 1.7, 'y', 'lupine'), L2, C2)); }
  /* ---------- trees, logs, rocks and bushes: solid, and big enough to hide behind ---------- */
  const pines = []; { const trunk = new T.CylinderGeometry(0.22, 0.38, 1, 7); trunk.translate(0, 0.5, 0); const cone = new T.ConeGeometry(1, 1, 8); cone.translate(0, 0.5, 0);
    const TR = [], CN = [], CC = [], greens = ['#2f5a2a', '#3a6a30', '#2a4f30', '#40703a'];
    for (let i = 0, tries = 0; i < (LO ? 40 : 70) && tries < 3000; tries++) { const x = -84 + R() * 168, z = -98 + R() * 100, s = z - shoreZ(x); if (s > -22 || pathD(x, z) < 3 || Math.abs(x - riverX(z)) < 4.5) continue; const y = Hc(x, z); if (Math.hypot(x - FIRE.x, z - FIRE.z) < 7) continue;
      const open = Math.sin(x * 0.07 + 2) * Math.cos(z * 0.06) > -0.15 && Math.abs(x) < 60 && s > -60; if (open && R() < 0.75) continue; /* leave open meadows */
      let close = false; for (let k = 0; k < pines.length; k++) if (Math.hypot(pines[k][0] - x, pines[k][1] - z) < 3.2) { close = true; break; } if (close) continue;
      const hgt = 7 + R() * 7, rad = 1.9 + R() * 1.1; pines.push([x, z]); i++; TR.push([x, y - 0.2, z, 1.5, hgt * 0.45, 1.5, R() * 6]);
      K.pineT = K.pineT || []; K.pineT.push({ x: x, z: z, cr: rad, bot: y + hgt * 0.18, i0: CN.length, ti: TR.length - 1 });
      for (let k = 0; k < 3; k++) { CN.push([x, y + hgt * (0.18 + k * 0.22), z, rad * (1 - k * 0.24), hgt * (0.42 - k * 0.06), rad * (1 - k * 0.24), R() * 6]); CC.push(greens[(i + k) % 4]); }
      K.colliders.push({ x: x, z: z, r: 0.55, top: y + hgt }); }
    g.add(K.trunkIM = inst(trunk, new T.MeshLambertMaterial({ color: '#6a4a32' }), TR)); g.add(K.pineIM = inst(cone, windy(new T.MeshLambertMaterial({ color: '#ffffff' }), 0.05, 0.9, 'y', 'pine'), CN, CC)); }
  /* palms along the back of the beach and on the headlands: curved, ringed trunks with drooping fronds */
  { const trunks = [], fronds = [], nuts = [], spotsP = [];
    for (let i = 0; i < 46 && spotsP.length < (LO ? 12 : 20); i++) { const x = -66 + R() * 132, s = -3.5 - R() * 9; let z = shoreZ(x) + s; if (pathD(x, z) < 2.2 || Math.abs(x - riverX(z)) < 3) continue; if (spotsP.some(function (q) { return Math.hypot(q[0] - x, q[1] - z) < 4.5; })) continue; spotsP.push([x, z]); }
    HEADS.forEach(function (k, j) { spotsP.push([k.x + (j ? 2 : -3), k.z + 1]); spotsP.push([k.x + (j ? -4 : 3), k.z - 3]); });
    spotsP.forEach(function (sp, i) { const x = sp[0], z = sp[1], y = Hc(x, z) - 0.2, L = 6 + R() * 3.5, lean = 0.35 + R() * 0.35, la = Math.atan2(SUN.x, SUN.z) + (R() - 0.5) * 2.2, lx = Math.sin(la) * lean * L, lz = Math.cos(la) * lean * L;
      const curve = new T.QuadraticBezierCurve3(new T.Vector3(x, y, z), new T.Vector3(x + lx * 0.15, y + L * 0.55, z + lz * 0.15), new T.Vector3(x + lx, y + L, z + lz));
      const tg = new T.TubeGeometry(curve, 12, 0.3, 6, false), tp = tg.attributes.position; for (let si = 0; si <= 12; si++) { const P = curve.getPointAt(si / 12); for (let j = 0; j <= 6; j++) { const k = si * 7 + j, v = new T.Vector3(tp.getX(k), tp.getY(k), tp.getZ(k)).sub(P).multiplyScalar(1.1 - 0.4 * si / 12); tp.setXYZ(k, P.x + v.x, P.y + v.y, P.z + v.z); } }
      tg.computeVertexNormals(); colorize(tg, function (xx, yy, zz, ny, o, k) { const si = Math.floor(k / 7), c0 = new T.Color(si % 2 ? '#8a6a48' : '#a0805a'); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; }); trunks.push(tg);
      const top = curve.getPointAt(1); (K.camBalls = K.camBalls || []).push({ x: top.x, y: top.y, z: top.z, r: 3.6 }); nuts.push([top.x + 0.2, top.y - 0.3, top.z, 0.22, 0.25, 0.22], [top.x - 0.15, top.y - 0.35, top.z + 0.18, 0.22, 0.25, 0.22], [top.x, top.y - 0.32, top.z - 0.22, 0.2, 0.23, 0.2]);
      const nf = 9; for (let f = 0; f < nf; f++) { const a = f / nf * 6.283 + R() * 0.3, len = 3.4 + R() * 1.2, dx = Math.cos(a), dz = Math.sin(a), nx = -dz, nz = dx, seg = 10, P = [], N = [], CO = [], FX = [], I = [];
        for (let s0 = 0; s0 <= seg; s0++) { const t = s0 / seg, cx = top.x + dx * t * len, cz = top.z + dz * t * len, cy = top.y + 0.25 + Math.sin(t * Math.PI * 0.55) * 1.0 - t * t * 2.0, w = (0.75 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.6) + 0.06) * (s0 % 2 ? 1 : 0.72);
          P.push(cx - nx * w, cy - 0.12 * w, cz - nz * w, cx, cy + 0.06, cz, cx + nx * w, cy - 0.12 * w, cz + nz * w); for (let q = 0; q < 3; q++) { N.push(0, 1, 0); const c0 = new T.Color('#2f6a2a').lerp(new T.Color('#7ab23c'), t * 0.8 + (q === 1 ? 0 : 0.1)); CO.push(c0.r, c0.g, c0.b); FX.push(t * 0.9); }
          if (s0 < seg) { const b = s0 * 3; I.push(b, b + 3, b + 1, b + 1, b + 3, b + 4, b + 1, b + 4, b + 2, b + 2, b + 4, b + 5); } }
        const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.Float32BufferAttribute(P, 3)); fg.setAttribute('normal', new T.Float32BufferAttribute(N, 3)); fg.setAttribute('color', new T.Float32BufferAttribute(CO, 3)); fg.setAttribute('aFlex', new T.Float32BufferAttribute(FX, 1)); fg.setIndex(I); fronds.push(fg); }
      K.colliders.push({ x: x, z: z, r: 0.45, top: y + L }); });
    g.add(new T.Mesh(merge(trunks), new T.MeshLambertMaterial({ vertexColors: true })));
    g.add(new T.Mesh(merge(fronds), windy(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.35, 1.3, 'attr', 'palm')));
    g.add(inst(new T.SphereGeometry(1, 7, 5), new T.MeshLambertMaterial({ color: '#6a4a2a' }), nuts)); }
  /* fallen logs (mossy on top) and big boulders */
  { const parts = []; const LOGS = [[FIRE.x - 2.6, FIRE.z + 0.4, 0.1, 3.4, 0.36], [FIRE.x + 2.3, FIRE.z - 1.6, 1.2, 3, 0.34], [-2, -46, 0.5, 6, 0.55], [18, -34, 2.2, 7, 0.6], [-34, -30, 1.4, 6.5, 0.5], [30, -58, 0.2, 7, 0.65], [-8, -70, 2.6, 6, 0.55], [-40, -4, 0.9, 5, 0.45]];
    LOGS.forEach(function (l) { if (l[0] !== FIRE.x - 2.6 && l[0] !== FIRE.x + 2.3 && pathD(l[0], l[1]) < l[3] / 2 + 2) return; /* never across the trail */ const x = l[0], z = l[1], a = l[2], len = l[3], r = l[4], y = Math.min(Hc(x - Math.cos(a) * len / 2, z + Math.sin(a) * len / 2), Hc(x + Math.cos(a) * len / 2, z - Math.sin(a) * len / 2), Hc(x, z)) + r * 0.8;
      const cg = new T.CylinderGeometry(r, r * 1.08, len, 12, 4); colorize(cg, function (xx, yy, zz, ny, o) { const c0 = Math.abs(ny) > 0.9 ? new T.Color('#c8a070') : new T.Color(xx > r * 0.35 ? '#5a7a2a' : '#5a3e28').offsetHSL(0, 0, Math.sin(yy * 9) * 0.04); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; });
      parts.push(place(cg, x, y, z, 1, 1, 1, a, 0, Math.PI / 2));
      for (let t = -len / 2 + r; t <= len / 2 - r + 0.01; t += r * 1.4) K.colliders.push({ x: x + Math.cos(a) * t, z: z - Math.sin(a) * t, r: r, top: y + r }); });
    const rk = new T.DodecahedronGeometry(1, 1), rp = rk.attributes.position; for (let i = 0; i < rp.count; i++) { const v = new T.Vector3(rp.getX(i), rp.getY(i), rp.getZ(i)), k = 1 + 0.16 * Math.sin(v.x * 4.1 + v.z * 3.3) + 0.1 * Math.cos(v.y * 5.7); rp.setXYZ(i, v.x * k, v.y * k * 0.8, v.z * k); }
    rk.computeVertexNormals(); colorize(rk, function (x, y, z, ny, o) { const c0 = ny > 0.55 ? new T.Color('#6a8a3a') : new T.Color('#9a948a').offsetHSL(0, 0, y * 0.05); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; });
    const RL = [], spots = [[-12, -60, 2.2], [-31, -48, 1.6], [12, -50, 1.9], [26, -26, 1.4], [-30, -16, 1.5], [-48, -40, 2.6], [40, -46, 2.4], [-60, -10, 2], [56, -6, 1.8], [20, -78, 2.3], [-14, -84, 1.6], [FIRE.x + 3.4, FIRE.z + 2.4, 0.9], [-50, 14, 1.7], [48, 14, 1.4]];
    HEADS.forEach(function (k) { for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.4, rr = k.r * (0.7 + 0.25 * Math.sin(i * 2)); spots.push([k.x + Math.cos(a) * rr, k.z + Math.sin(a) * rr, 1.6 + (i % 3) * 0.8]); } });
    spots.forEach(function (s0) { if (pathD(s0[0], s0[1]) < s0[2] + 1.6) return; const y = Hc(s0[0], s0[1]); RL.push([s0[0], y + s0[2] * 0.25, s0[1], s0[2], s0[2] * 0.85, s0[2] * 1.1, s0[0] * 0.7]); K.colliders.push({ x: s0[0], z: s0[1], r: s0[2] * 0.95, top: y + s0[2] * 0.95 }); });
    g.add(inst(rk, new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }), RL));
    if (parts.length) g.add(new T.Mesh(merge(parts), new T.MeshLambertMaterial({ vertexColors: true })));
    /* bushes and ferns at the forest edge and along the stream */
    const bush = merge([new T.IcosahedronGeometry(1, 1), place(new T.IcosahedronGeometry(1, 1), 0.7, -0.1, 0.3, 0.75, 0.75, 0.75), place(new T.IcosahedronGeometry(1, 1), -0.6, -0.15, -0.2, 0.7, 0.7, 0.7)]);
    colorize(bush, function (x, y, z, ny, o) { const c0 = new T.Color('#3f7a2e').lerp(new T.Color('#8ab84a'), Math.max(0, y) * 0.6); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; });
    const frond = []; for (let f = 0; f < 8; f++) { const fg0 = frondGeo(1.25, 0.22, 0.55, 0.9, 8, '#2f6a2a', '#8ac04a', 1); fg0.rotateY(f / 8 * 6.283 + (f % 2) * 0.3); frond.push(fg0); }
    const fernG = merge(frond); const BL = [], FL = [];
    for (let tries = 0; tries < 2600 && BL.length + FL.length < (LO ? 70 : 160); tries++) { const x = -84 + R() * 168, z = -98 + R() * 100; if (!ok(x, z, -10) || pathD(x, z) < 4.5 || Math.hypot(x - FIRE.x, z - FIRE.z) < 7) continue; const nearTree = pines.some(function (p) { return Math.hypot(p[0] - x, p[1] - z) < 6; }), nearStream = Math.abs(x - riverX(z)) < 5.5; if (!nearTree && !nearStream && R() > 0.06) continue;
      const y = Hc(x, z); if (R() < 0.45) { const s = 0.8 + R() * 0.7; BL.push([x, y + s * 0.6, z, s * 1.1, s * 0.85, s, R() * 6]); K.colliders.push({ x: x, z: z, r: s * 1.05, top: y + s * 1.4 }); } else FL.push([x, y, z, 0.9 + R() * 0.6, 0.8 + R() * 0.5, 0.9 + R() * 0.6, R() * 6]); } K.ferns = FL;
    g.add(inst(bush, windy(new T.MeshLambertMaterial({ vertexColors: true }), 0.06, 1.2, 'y', 'bush'), BL)); g.add(K.fernIM = inst(fernG, windy(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.18, 1.5, 'attr', 'fern'), FL)); }
  /* the coral reef and its animals are built in reef.js */
  if (AREAS.cove.reef) AREAS.cove.reef(g, K, LO);
  /* ---------- the campfire, fireflies, floating light specks, gulls ---------- */
  { const fy = Hc(FIRE.x, FIRE.z), ring = []; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; ring.push([FIRE.x + Math.cos(a) * 0.9, fy + 0.1, FIRE.z + Math.sin(a) * 0.9, 0.24, 0.2, 0.24, a]); }
    g.add(inst(new T.DodecahedronGeometry(1, 0), new T.MeshLambertMaterial({ color: '#8a847a' }), ring));
    const fire = new T.Group(); fire.position.set(FIRE.x, fy + 0.1, FIRE.z); g.add(fire); K.flames = [];
    [['#ff4a1a', 0.55, 1.3], ['#ff9a2a', 0.38, 1.0], ['#ffe07a', 0.2, 0.7]].forEach(function (f) { const m = new T.Mesh(new T.ConeGeometry(f[1], f[2], 7), new T.MeshBasicMaterial({ color: f[0], transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false })); m.position.y = f[2] / 2; fire.add(m); K.flames.push(m); });
    const gl = C.glow('#ff9a4a', 5, 0.55, false); gl.position.y = 0.7; fire.add(gl);
    if (!LO) { K.fireL = new T.PointLight(0xff8a3a, 1.4, 14, 1.6); K.fireL.position.set(FIRE.x, fy + 1.4, FIRE.z); g.add(K.fireL); }
    K.fire = { x: FIRE.x, y: fy, z: FIRE.z }; K.sparks = []; const dot = softDot();
    for (let i = 0; i < 14; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: dot, color: '#ffb05a', transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false })); s.scale.setScalar(0.12); g.add(s); K.sparks.push({ m: s, t: R() * 2 }); }
    const ptsN = LO ? 30 : 70, fp = new Float32Array(ptsN * 3), fly = []; for (let i = 0; i < ptsN; i++) { const x = -30 + R() * 60, z = -60 + R() * 50; fly.push({ x: x, z: z, ph: R() * 6.28, r: 0.8 + R() * 2 }); }
    const fgeo = new T.BufferGeometry(); fgeo.setAttribute('position', new T.BufferAttribute(fp, 3)); K.flies = new T.Points(fgeo, new T.PointsMaterial({ map: dot, color: '#e8ff7a', size: 0.5, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false })); K.flies.frustumCulled = false; K.flyD = fly; g.add(K.flies);
    const mN = LO ? 120 : 260, mp = new Float32Array(mN * 3); for (let i = 0; i < mN; i++) { mp[i * 3] = R() * 24 - 12; mp[i * 3 + 1] = R() * 10 - 5; mp[i * 3 + 2] = R() * 24 - 12; }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(mp, 3)); K.motes = new T.Points(mg, new T.PointsMaterial({ map: dot, color: '#fff0c0', size: 0.13, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false })); K.motes.frustumCulled = false; g.add(K.motes);
    K.rays = []; for (let i = 0; i < 6; i++) { const rm = new T.Mesh(new T.PlaneGeometry(2.2, 14), new T.MeshBasicMaterial({ color: '#cff8ff', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false })); rm.visible = false; g.add(rm); K.rays.push({ m: rm, ph: i * 1.3, ox: (i - 2.5) * 3.2, oz: (i % 2) * 2 - 1 }); }
    K.gulls = []; for (let i = 0; i < 4; i++) { const gg = new T.Group(), wm = new T.MeshLambertMaterial({ color: '#f4f0ea', side: T.DoubleSide }); [-1, 1].forEach(function (sd) { const w = new T.Mesh(new T.PlaneGeometry(1.1, 0.3), wm); w.position.x = sd * 0.55; gg.add(w); }); gg.add(new T.Mesh(new T.SphereGeometry(0.16, 6, 4), wm)); g.add(gg); K.gulls.push({ m: gg, r: 26 + i * 9, ph: i * 1.6, y: 14 + i * 3 }); } }
  /* signposts: one back up the valley, one welcoming you to the beach */
  { const post = function (x, z, text, w) { const y = Hc(x, z), p = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 2.6, 6), new T.MeshLambertMaterial({ color: '#7a5a3a' })); p.position.set(x, y + 1.3, z); g.add(p);
      const bd = new T.Mesh(new T.BoxGeometry(w * 0.55, 0.6, 0.1), new T.MeshLambertMaterial({ color: '#a07a4a' })); bd.position.set(x, y + 2.3, z); bd.lookAt(x, y + 2.3, z + 10); g.add(bd);
      const lb = C.label(text, w, { bd: '#ffd166' }); lb.position.set(x, y + 3.2, z); g.add(lb); K.colliders.push({ x: x, z: z, r: 0.25, top: y + 2.6 }); };
    post(START.x - 3.2, START.z - 0.5, tx('co.signBack'), 2.4); post(6.5, 3, '🌅 ' + tx('co.title'), 2.6); }
  addPlayer(g);
}

function addPlayer(g) { K.me = C.buildAlien(C.S.alien); K.me.scale.multiplyScalar(0.78); g.add(K.me);
  K.ring = new T.Mesh(new T.RingGeometry(0.8, 1, 32), new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide })); K.ring.rotation.x = -Math.PI / 2; K.ring.visible = false; g.add(K.ring);
  { const n = 24, p = new Float32Array(n * 3).fill(-999), bg = new T.BufferGeometry(); bg.setAttribute('position', new T.BufferAttribute(p, 3)); K.bub = new T.Points(bg, new T.PointsMaterial({ map: softDot(), color: '#e8ffff', size: 0.12, transparent: true, opacity: 0.8, depthWrite: false })); K.bub.frustumCulled = false; K.bub.visible = false; g.add(K.bub); }
  K.shadow = new T.Mesh(new T.CircleGeometry(0.45, 16), new T.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.25, depthWrite: false })); K.shadow.rotation.x = -Math.PI / 2; g.add(K.shadow); }
/* ---------- UI ---------- */
function ensureUI() {
  if ($('coUI')) return;
  const css = document.createElement('style'); css.textContent = '#coUI { position: absolute; inset: 0; pointer-events: none; font-size: calc(16px * var(--ts, 1)); color: #fff; }' +
    '#coUI .coBox { background: rgba(20,14,30,.72); border: 1px solid rgba(255,209,102,.6); border-radius: 12px; padding: 8px 12px; }' +
    '#coTop { position: absolute; left: 10px; top: 10px; display: flex; gap: 8px; align-items: center; pointer-events: auto; } #coTop b { color: #ffd166; } #coTop button, #coPause button { font: inherit; padding: 6px 12px; border-radius: 9px; border: 1px solid #ffd166; background: #2a1e3a; color: #fff; cursor: pointer; }' +
    '#coPrompt { position: absolute; left: 50%; bottom: 70px; transform: translateX(-50%); } #coCard { position: absolute; left: 50%; top: 64px; transform: translateX(-50%); max-width: min(560px, 92vw); text-align: center; }' +
    '#coKeys { position: absolute; left: 10px; bottom: 10px; font-size: .82em; opacity: .85; max-width: 92vw; } #coFps { position: absolute; right: 10px; top: 10px; font: 12px monospace; }' +
    '#coPause { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.45); pointer-events: auto; } #coPause .coBox { display: flex; flex-direction: column; gap: 10px; padding: 18px 24px; min-width: 240px; text-align: center; }' +
    '#coFade { position: fixed; inset: 0; background: #0a0612; color: #ffd8b0; display: flex; align-items: center; justify-content: center; font-size: 1.3em; font-style: italic; opacity: 0; pointer-events: none; transition: opacity .6s; z-index: 30; }';
  document.head.appendChild(css);
  const d = document.createElement('div'); d.id = 'coUI'; d.hidden = true;
  d.innerHTML = '<div id="coTop"><span class="coBox"><b id="coT"></b> <span id="coCount"></span></span><button type="button" id="coPauseB">⏸</button></div><div id="coPrompt" class="coBox" hidden></div><div id="coCard" class="coBox" hidden></div><div id="coKeys" class="coBox"></div><div id="coFps" class="coBox" hidden></div>' +
    '<div id="coPause" hidden><div class="coBox"><b id="coPT"></b><button type="button" id="coRes"></button><button type="button" id="coLeave"></button><button type="button" id="coMenu"></button></div></div>';
  document.getElementById('toast').parentNode.appendChild(d);
  const f = document.createElement('div'); f.id = 'coFade'; document.body.appendChild(f);
  $('coPauseB').onclick = function () { setPause(true); }; $('coRes').onclick = function () { setPause(false); }; $('coLeave').onclick = function () { setPause(false); leave(); };
  $('coMenu').onclick = function () { setPause(false); leave(true); if (BQ.cozy && BQ.cozy._exit) BQ.cozy._exit(); };
}
function refreshText() { if (K && K.A) counter(); $('coT').textContent = K && K.A ? K.A.icon + ' ' + tx(K.A.title) : ''; $('coKeys').textContent = tx('co.keys'); $('coPT').textContent = tx('co.pause'); $('coRes').textContent = tx('co.resume'); $('coLeave').textContent = tx('co.leave'); $('coMenu').textContent = tx('co.menu'); }
function card(text, secs, html) { const c = $('coCard'); if (html) c.innerHTML = html; else c.textContent = text; c.hidden = false; K.cardT = secs || 6; }
/* ---------- FIELD GUIDE: get close to an animal, plant or place and the alien scans it (no buttons, no quiz) ---------- */
function fstore() { const s = BQ.cozy._s(); if (!s.fg) s.fg = {}; if (!s.fgPts) s.fgPts = 0; return s; }
function counter() { const A = K.A, s = fstore(), list = A.finds || [], n = list.filter(function (f) { return s.fg[f.id]; }).length; $('coCount').textContent = list.length ? ' · 📖 ' + n + '/' + list.length + ' · ⭐ ' + s.fgPts : ''; }
function discover(f) { const s = fstore(); if (s.fg[f.id]) return; s.fg[f.id] = Date.now(); s.fgPts += 50; C.save(); amb('sfx', 'discover'); if (C.S.set.cap && C.caption) C.caption('sound: chime, new Field Guide entry');
  K.cardQ = K.cardQ || []; K.cardQ.push(f); counter(); }
/* Keystone tags for Field Guide entries (approved by the teacher, v57). Wording comes from the verified KEYSTONE table in engine.js. Entries with no clear fit stay untagged. */
const TAGS = { rf_brain: ['BIO.B.4.2.2'], rf_clown: ['BIO.B.4.2.2'], rf_shrimp: ['BIO.B.4.2.2'], rf_tang: ['BIO.B.4.2.1'], rf_seagrass: ['BIO.B.4.2.1'], rf_parrot: ['BIO.B.4.2.1'], rf_turtle: ['BIO.B.4.2.1'],
  hf_crayfish: ['BIO.B.4.2.1'], hf_trout: ['BIO.B.4.1.2'], hf_hellbender: ['BIO.B.4.1.2'], hf_hemlock: ['BIO.B.4.1.2', 'BIO.B.4.2.4'], hf_mayfly: ['BIO.B.4.2.4'], hf_spring: ['BIO.B.4.2.3'] };
function tagHTML(id) { const t = TAGS[id], KS = C.KEYSTONE || {}; if (!t) return ''; return ' <span class="fgTag" style="font-size:.8em;opacity:.8">· Keystone ' + t.map(function (c) { return '<abbr title="' + C.esc(KS[c] || '') + '">' + C.esc(c) + '</abbr>'; }).join(', ') + '</span>'; }
function showEntry(f) { card('', 11, '<b>📖 ' + C.esc(tx('co.newEntry')) + ': ' + C.esc(tx('fd.n.' + f.id)) + '</b> <span style="color:#ffd166">+50 ⭐</span><br>' + C.esc(tx('fd.d.' + f.id)) + tagHTML(f.id)); }
function scanStep(dt) { const list = K.A.finds; if (!list) return; K.scanT = (K.scanT || 0) - dt; if (K.scanT <= 0) { K.scanT = 0.25; const s = fstore();
    for (let i = 0; i < list.length; i++) { const f = list[i]; if (s.fg[f.id]) continue; const p = f.at ? f.at(K) : [f.x, f.y != null ? f.y : K.A.H(f.x, f.z) + 0.6, f.z]; if (!p) continue;
      if (Math.hypot(p[0] - K.px, p[2] - K.pz) < (f.r || 3) && Math.abs(p[1] - (K.py + 0.6)) < (f.ry || 3.5)) discover(f); } }
  if (K.cardQ && K.cardQ.length && K.cardT <= 0.3) showEntry(K.cardQ.shift()); }
function journalHTML() { const s = BQ.cozy._s(), fg = s.fg || {}; let h = '<section class="jl"><h3>🧭 ' + C.esc(tx('co.jTitle')) + (s.fgPts ? ' · ⭐ ' + s.fgPts : '') + '</h3>';
  Object.keys(AREAS).forEach(function (id) { const A = AREAS[id], list = A.finds || []; if (!list.length) return; const got = list.filter(function (f) { return fg[f.id]; });
    h += '<h4>' + A.icon + ' ' + C.esc(tx(A.title)) + ' (' + got.length + '/' + list.length + ')</h4>' + (got.length ? '<ul>' + got.map(function (f) { return '<li><b>' + C.esc(tx('fd.n.' + f.id)) + '</b>: ' + C.esc(tx('fd.d.' + f.id)) + tagHTML(f.id) + '</li>'; }).join('') + '</ul>' : '<p class="dim">' + C.esc(tx('co.jNone')) + '</p>'); });
  return h + '</section>'; }
function setPause(on) { if (!K) return; K.pause = on; K.k = {}; $('coPause').hidden = !on; if (on) $('coRes').focus(); }
function fade(text, then) { const f = $('coFade'); f.textContent = text; f.style.opacity = 1; setTimeout(function () { then(); setTimeout(function () { f.style.opacity = 0; }, 350); }, 650); }

/* ---------- ENTER / LEAVE (from Willow Creek's valley trailhead) ---------- */
function enter(id) {
  const W = BQ.cozy && BQ.cozy._w(), A = AREAS[id || 'cove']; if (!W || K || !A) return; ensureUI(); W.k = {};
  const START = A.start, Hc = A.H, build = A.build;
  fade(tx(A.down), function () {
    K = { W: W, t: 0, k: {}, yaw: Math.PI, pitch: 0.32, dist: 11, distT: 11, vx: 0, vy: 0, vz: 0, px: START.x, pz: START.z, py: 0, face: Math.PI * 0, ground: true, pause: false, cardT: 0, fpsT: 0, fpsN: 0,
      save: { bg: C.scene.background, fog: C.scene.fog, light: [C.HEMI.intensity, C.HEMI.color.clone(), C.HEMI.groundColor.clone(), C.KEYL.intensity, C.KEYL.color.clone(), C.KEYL.position.clone()], fov: C.cam.fov } };
    K.A = A; K.yaw = Math.atan2(START.x - A.look[0], START.z - A.look[1]); K.face = K.yaw + Math.PI; K.pitch = 0.3; W.coast = true; /* arrive looking toward the best view */ W.g.visible = false; $('cozyUI').hidden = true; build(K); K.py = Hc(K.px, K.pz);
    $('coUI').hidden = false; refreshText(); counter(); amb('mood', A.mood, 2); amb('underwater', false);
    const s = BQ.cozy._s(); if (!s.f[A.flag]) { s.f[A.flag] = 1; C.save(); setTimeout(function () { if (K) card(tx(A.welcome), 14); }, 900); } });
}
function leave(quick) {
  if (!K) return; const W = K.W, A = K.A, done = function () { if (!K) return;
    C.scene.remove(K.g); C.disposeGroup(K.g); const s0 = K.save; C.scene.background = s0.bg; C.scene.fog = s0.fog; C.HEMI.intensity = s0.light[0]; C.HEMI.color.copy(s0.light[1]); C.HEMI.groundColor.copy(s0.light[2]); C.KEYL.intensity = s0.light[3]; C.KEYL.color.copy(s0.light[4]); C.KEYL.position.copy(s0.light[5]);
    C.cam.fov = s0.fov; C.cam.updateProjectionMatrix(); amb('underwater', false); K = null; $('coUI').hidden = true;
    if (W) { W.coast = false; W.g.visible = true; $('cozyUI').hidden = false; W.k = {}; const a = A.trail.a * Math.PI / 180, r = A.trail.r - 2.7; W.px = Math.cos(a) * r; W.pz = Math.sin(a) * r; W.py = BQ.cozy._GH(W.px, W.pz); W.vx = W.vz = W.vy = 0; W.yaw = Math.atan2(W.px, W.pz); W.face = W.yaw + Math.PI; W.camUnder = false; amb('mood', 'meadow', 2); if (BQ.cozy._back) BQ.cozy._back(); } };
  if (quick) done(); else fade(tx(A.up || 'co.up'), done);
}
function cozyTrail(g, H) { return Object.keys(AREAS).map(function (id) { return trailSign(g, H, AREAS[id]); }); }
function trailSign(g, H, A) { /* a trailhead signpost in Willow Creek */
  const a = A.trail.a * Math.PI / 180, r = A.trail.r, x = Math.cos(a) * r, z = Math.sin(a) * r, y = H(x, z);
  const p = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 2.6, 6), new T.MeshLambertMaterial({ color: '#7a5a3a' })); p.position.set(x, y + 1.3, z); g.add(p);
  const bd = new T.Mesh(new T.BoxGeometry(1.8, 0.55, 0.1), new T.MeshLambertMaterial({ color: '#a07a4a' })); bd.position.set(x, y + 2.2, z); bd.rotation.y = -a + Math.PI / 2; g.add(bd);
  const lb = C.label(tx(A.sign), 3.2, { bd: '#ffd166' }); lb.position.set(x, y + 3.1, z); g.add(lb); return { x: x, z: z };
}

/* ---------- THE AREAS you can hike to from Willow Creek (more are added by other files with BQ.coast.addArea) ---------- */
const AREAS = { cove: { H: Hc, water: waterHere, start: START, fire: FIRE, bounds: BOUNDS, build: build, look: [2, 20], trail: { a: 95.5, r: 61.2 }, sign: 'co.sign', title: 'co.title', icon: '🌅',
  down: 'co.down', welcome: 'co.welcome', flag: 'coast', mood: 'water', under: ['#1f8aa0', 0.05] } };
/* ---------- THE LOOP ---------- */
function waterHere(x, z) { const h = Hc(x, z); return (h < -0.05 && z - shoreZ(x) > -1) ? 0 : null; }
function step(dt) {
  if (!K) return; dt = Math.min(dt, 0.05); K.t += dt; UT.value = K.t; const cam = C.cam, k = K.k, busy = K.pause, A = K.A, Hc = A.H, waterHere = A.water, START = A.start, FIRE = A.fire, BOUNDS = A.bounds;
  if (K.waterM) K.waterM.uniforms.uT.value = K.t; if (K.farM) K.farM.uniforms.uT.value = K.t; if (K.streamTex) K.streamTex.offset.y -= dt * 0.5; if (A.step) A.step(dt, K);
  /* moving */
  let mx = 0, mz = 0; if (!busy) { if (k.f) mz -= 1; if (k.b) mz += 1; if (k.l) mx -= 1; if (k.r) mx += 1; if (k.ql) K.yaw += dt * 1.8; if (k.qr) K.yaw -= dt * 1.8; if (k.tu) K.pitch = Math.max(-0.35, K.pitch - dt); if (k.td) K.pitch = Math.min(1.25, K.pitch + dt); }
  if (K.sitting && (mx || mz || k.jump)) { K.sitting = false; }
  const len = Math.hypot(mx, mz), wl0 = waterHere(K.px, K.pz), wl = wl0 == null ? -1e9 : wl0, gy0 = Hc(K.px, K.pz);
  const was = K.swim; K.swim = wl0 != null && wl - gy0 > 1.0 && K.py < wl - 0.45;
  if (K.swim && !was) { amb('sfx', 'splash'); K.vy *= 0.25; if (K.ring) { K.ring.position.set(K.px, wl + 0.04, K.pz); K.ringT = 0; K.ring.visible = true; } } if (!K.swim && was) amb('sfx', 'splash', 0.6);
  const sp = K.swim ? (k.run ? 6.5 : 4.2) : (k.run ? 13 : 6); let tvx = 0, tvz = 0;
  if (len > 0 && !busy) { const cy = Math.cos(K.yaw), sy = Math.sin(K.yaw), dx = (mx * cy + mz * sy) / len, dz = (-mx * sy + mz * cy) / len; tvx = dx * sp; tvz = dz * sp; K.face = Math.atan2(dx, dz);
    if (!K.drag) { const want = Math.atan2(-dx, -dz), d = ((want - K.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; K.yaw += d * Math.min(1, dt * 0.9) * (mz < 0 ? 1 : 0.25); } }
  const grip = K.ground || K.swim ? 9 : 3.5; K.vx += (tvx - K.vx) * Math.min(1, dt * grip); K.vz += (tvz - K.vz) * Math.min(1, dt * grip);
  K.px += K.vx * dt; K.pz += K.vz * dt;
  /* the edges of the cove: hills and the open sea gently turn you back */
  const B = BOUNDS; if (K.px < B.x0) { K.px = B.x0; K.vx = Math.max(0, K.vx); } if (K.px > B.x1) { K.px = B.x1; K.vx = Math.min(0, K.vx); } if (K.pz < B.z0) { K.pz = B.z0; K.vz = Math.max(0, K.vz); } if (K.pz > B.z1) { K.pz = B.z1; K.vz = Math.min(0, K.vz); }
  /* bump into trees, logs, rocks and corals (two passes so you are never squeezed through one) */
  const push = function (c) { if (K.py >= c.top - 0.35) return; const dx = K.px - c.x, dz = K.pz - c.z, d = Math.hypot(dx, dz), mn = c.r + 0.45; if (d >= mn) return; if (d < 0.001) { K.px = c.x + mn; return; } K.px = c.x + dx / d * mn; K.pz = c.z + dz / d * mn; const vn = (K.vx * dx + K.vz * dz) / d; if (vn < 0) { K.vx -= vn * dx / d; K.vz -= vn * dz / d; } };
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < K.colliders.length; i++) { const c = K.colliders[i]; if (Math.abs(K.px - c.x) > c.r + 1 || Math.abs(K.pz - c.z) > c.r + 1) continue; push(c); }
  let gy = Hc(K.px, K.pz); for (let i = 0; i < K.colliders.length; i++) { const c = K.colliders[i]; if (c.top > gy && c.top - 0.35 <= K.py + 0.01 && Math.hypot(K.px - c.x, K.pz - c.z) < c.r * 0.85) gy = c.top; } /* stand on top of logs and rocks */
  if (K.swim) { const surf = wl - 0.5;
    if (!busy && k.dive) K.vy += (-3.4 - K.vy) * Math.min(1, dt * 4);
    else if (!busy && k.jump) { if (K.py > surf - 0.25 && wl - gy < 2.2) { K.vy = 8; K.swim = false; amb('sfx', 'splash', 0.6); } else K.vy += (3.2 - K.vy) * Math.min(1, dt * 4); }
    else if (K.py < wl - 1.3) K.vy += (0 - K.vy) * Math.min(1, dt * 3); else K.vy += ((surf - K.py) * 2.2 - K.vy) * Math.min(1, dt * 3);
    K.py += K.vy * dt; if (K.py > surf && !k.jump) { K.py = surf; K.vy = Math.min(0, K.vy); } if (K.py < gy + 0.25) { K.py = gy + 0.25; K.vy = Math.max(0, K.vy); } K.ground = false;
    if (len > 0 && (!K.strokeT || K.t > K.strokeT)) { K.strokeT = K.t + 0.7; amb('sfx', K.under ? 'bubble' : 'swim', 0.8); }
  } else {
    if (k.jump && !K.jumpHeld) K.jumpBuf = 0.15; K.jumpHeld = !!k.jump; K.jumpBuf = Math.max(0, (K.jumpBuf || 0) - dt); K.coyote = K.ground ? 0.15 : Math.max(0, (K.coyote || 0) - dt);
    if (!busy && K.jumpBuf > 0 && K.coyote > 0 && K.vy <= 0.5) { K.vy = 9; K.ground = false; K.coyote = 0; K.jumpBuf = 0; K.jumpT = 0.35; C.beep(420, 0.06, 'triangle'); }
    K.jumpT = Math.max(0, (K.jumpT || 0) - dt); K.vy -= 24 * dt; K.gliding = !K.ground && k.jump && K.vy < -2.2 && !K.jumpT; if (K.gliding) K.vy = -2.2;
    const wasG = K.ground; K.py += K.vy * dt;
    if (K.py <= gy) { if (!K.ground && K.vy < -6) amb('sfx', 'step', 1.4); K.py = gy; K.vy = 0; K.ground = true; } else if (wasG && K.vy <= 0 && K.py - gy < 0.6) { K.py = gy; K.vy = 0; K.ground = true; } else if (K.py > gy + 0.05) K.ground = false; }
  K.under = K.swim && K.py < wl - 1.3; if (K.under && !BQ.cozy._s().f.diveTip) { BQ.cozy._s().f.diveTip = 1; C.save(); card(tx('co.diveTip'), 7); }
  if (K.ring && K.ring.visible) { K.ringT += dt; const u = K.ringT / 0.9; K.ring.scale.setScalar(0.3 + u * 2.6); K.ring.material.opacity = 0.7 * (1 - u); if (u >= 1) K.ring.visible = false; }
  if (K.bub) { const bp = K.bub.geometry.attributes.position; K.bub.visible = K.under; if (K.under) { for (let i = 0; i < bp.count; i++) { let y = bp.getY(i) + dt * (0.8 + (i % 5) * 0.25); if (y > wl - 0.1 || y < K.py - 1) { bp.setXYZ(i, K.px + (Math.random() - 0.5) * 0.5, K.py + 1.2 + Math.random() * 0.3, K.pz + (Math.random() - 0.5) * 0.5); } else bp.setY(i, y); } bp.needsUpdate = true; } }
  scanStep(dt);
  /* the alien */
  const me = K.me, spd = Math.hypot(K.vx, K.vz); me.position.set(K.px, K.py, K.pz); me.rotation.y += (((K.face - me.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 10);
  const legs = me.userData.legs; if (legs) { const b0 = K.stride || 0; K.stride = b0 + dt * spd * (k.run ? 1.1 : 1.5); legs.forEach(function (h, i) { h.rotation.x = K.sitting ? -1.3 : K.swim ? Math.sin(K.t * 7 + i * Math.PI) * 0.6 : K.ground ? Math.sin(K.stride + i * Math.PI) * 0.7 * Math.min(1, spd / 4) : (K.gliding ? 0.6 : -0.5); });
    if (K.ground && spd > 1 && Math.floor(b0 / Math.PI) !== Math.floor(K.stride / Math.PI)) amb('sfx', 'step', k.run ? 1 : 0.6); }
  me.rotation.x = K.swim ? (K.under || k.dive ? 0.9 : 0.55) : (k.run && len > 0 && K.ground ? 0.18 : 0); me.rotation.z = K.gliding ? Math.sin(K.t * 6) * 0.08 : 0;
  K.shadow.visible = !K.swim; K.shadow.position.set(K.px, Hc(K.px, K.pz) + 0.06, K.pz); { const up = Math.max(0, K.py - Hc(K.px, K.pz)); K.shadow.scale.setScalar(Math.max(0.3, 1 - up / 6)); }
  /* the camera follows behind, stays out of trees and rocks, and slips under the water with you */
  K.dist += (K.distT - K.dist) * Math.min(1, dt * 5); const eD = K.under ? Math.min(K.dist, 6) : K.dist, eP = K.under ? Math.min(K.pitch, 0.18) : K.pitch;
  const tgt = new T.Vector3(K.px, K.py + 1.35, K.pz), cp = Math.cos(eP), want = new T.Vector3(tgt.x + Math.sin(K.yaw) * cp * eD, tgt.y + Math.sin(eP) * eD, tgt.z + Math.cos(K.yaw) * cp * eD);
  { const vx = want.x - tgt.x, vz = want.z - tgt.z, L2 = vx * vx + vz * vz; let best = 1; if (L2 > 0.01) K.colliders.forEach(function (c) { if (c.top < tgt.y - 0.5) return; const rr = c.r + 0.5, u = ((c.x - tgt.x) * vx + (c.z - tgt.z) * vz) / L2; if (u <= 0 || u > 1.2) return; const px = tgt.x + vx * u - c.x, pz = tgt.z + vz * u - c.z; if (px * px + pz * pz < rr * rr) { const back = u - rr / Math.sqrt(L2); if (back < best) best = back; } });
    if (K.camBalls) { const vy = want.y - tgt.y, L3 = L2 + vy * vy; K.camBalls.forEach(function (b) { const u = ((b.x - tgt.x) * vx + (b.y - tgt.y) * vy + (b.z - tgt.z) * vz) / L3; if (u <= 0 || u > 1.3) return; const qx = tgt.x + vx * u - b.x, qy = tgt.y + vy * u - b.y, qz = tgt.z + vz * u - b.z; if (qx * qx + qy * qy + qz * qz < b.r * b.r) { const back = u - b.r / Math.sqrt(L3); if (back < best) best = back; } }); } /* palm crowns */
    best = Math.max(0.28, best); if (best < 1) { want.x = tgt.x + vx * best; want.z = tgt.z + vz * best; want.y = tgt.y + (want.y - tgt.y) * best; } }
  if (K.under) { let s0 = 1; for (let q = 0; q < 7; q++) { const cx = tgt.x + (want.x - tgt.x) * s0, cz = tgt.z + (want.z - tgt.z) * s0, cy = tgt.y + (want.y - tgt.y) * s0; if (waterHere(cx, cz) != null && Hc(cx, cz) + 0.45 < Math.min(cy, -0.4)) break; s0 *= 0.72; } /* stay under the water with you: come closer instead of popping out */
    want.set(tgt.x + (want.x - tgt.x) * s0, tgt.y + (want.y - tgt.y) * s0, tgt.z + (want.z - tgt.z) * s0); want.y = Math.max(Hc(want.x, want.z) + 0.45, Math.min(want.y, -0.4)); }
  else { const gc = Hc(want.x, want.z) + 1.6; if (want.y < gc) want.y = gc; for (let q = 1; q <= 2; q++) { const u = q / 3, mx0 = tgt.x + (want.x - tgt.x) * u, mz0 = tgt.z + (want.z - tgt.z) * u, my = tgt.y + (want.y - tgt.y) * u, gm = Hc(mx0, mz0) + 0.6; if (my < gm) want.y += (gm - my) / u; }
    if (waterHere(want.x, want.z) != null && want.y < 0.45) want.y = 0.45; }
  cam.position.lerp(want, Math.min(1, dt * 6)); cam.lookAt(tgt); if (Math.abs(cam.fov - 42) > 0.05) { cam.fov = 42; cam.updateProjectionMatrix(); }
  K.sky.position.copy(cam.position);
  if (K.pineIM) { const ax = tgt.x, az = tgt.z, bx = cam.position.x - ax, bz = cam.position.z - az, L2 = bx * bx + bz * bz, hy = Math.max(cam.position.y, tgt.y) + 0.4, arr = K.pineIM.instanceMatrix.array; let dirty = false;
    if (!K.pineM) { K.pineM = arr.slice(); K.trunkM = K.trunkIM.instanceMatrix.array.slice(); } const ta = K.trunkIM.instanceMatrix.array;
    K.pineT.forEach(function (p) { let hide = false; if (L2 > 0.01 && p.bot < hy) { const u = Math.max(0, Math.min(1, ((p.x - ax) * bx + (p.z - az) * bz) / L2)), qx = ax + bx * u - p.x, qz = az + bz * u - p.z; hide = u > 0.05 && qx * qx + qz * qz < (p.cr + 0.4) * (p.cr + 0.4); }
      if (hide === !!p.hidden) return; p.hidden = hide; dirty = true; for (let k = 0; k < (p.n || 3); k++) { const o = (p.i0 + k) * 16; for (let j = 0; j < 16; j++) arr[o + j] = hide ? 0 : K.pineM[o + j]; } const to = p.ti * 16; for (let j = 0; j < 16; j++) ta[to + j] = hide ? 0 : K.trunkM[to + j]; });
    if (dirty) { K.pineIM.instanceMatrix.needsUpdate = true; K.trunkIM.instanceMatrix.needsUpdate = true; }
    K.fernT = (K.fernT || 0) - dt; if (K.fernT <= 0 && K.ferns && K.ferns.length) { K.fernT = 0.2; const fa = K.fernIM.instanceMatrix.array; if (!K.fernM) K.fernM = fa.slice(); let fd = false;
      K.ferns.forEach(function (fr, i) { const near = Math.hypot(fr[0] - cam.position.x, fr[2] - cam.position.z) < 2.6 && fr[1] + 1.5 > cam.position.y - 1; if (near === !!fr.hid) return; fr.hid = near; fd = true; for (let j = 0; j < 16; j++) fa[i * 16 + j] = near ? 0 : K.fernM[i * 16 + j]; });
      if (fd) K.fernIM.instanceMatrix.needsUpdate = true; } }
  /* above or below the water */
  const under = cam.position.y < -0.05 && waterHere(cam.position.x, cam.position.z) != null;
  if (under !== !!K.camUnder) { K.camUnder = under; if (under) { K.airFog = C.scene.fog; K.airBg = C.scene.background; C.scene.fog = new T.FogExp2(A.under[0], A.under[1]); C.scene.background = new T.Color(A.under[0]); } else { C.scene.fog = K.airFog; C.scene.background = K.airBg; }
    K.sky.visible = !under; (K.rays || []).forEach(function (r) { r.m.visible = under; }); amb('underwater', under); amb('mood', under ? 'under' : A.mood, 2);
    if (under && !K.lamp) { K.lamp = new T.PointLight(0xd8f8ff, 1.1, 10, 1.2); K.lamp.position.set(0, 1.6, 0.6); K.me.add(K.lamp); } else if (!under && K.lamp) { K.me.remove(K.lamp); K.lamp = null; } }
  if (under && K.rays) K.rays.forEach(function (r) { r.m.position.set(cam.position.x + r.ox + Math.sin(K.t * 0.3 + r.ph) * 0.6, -5, cam.position.z + r.oz - 6); r.m.rotation.set(0, Math.atan2(cam.position.x - r.m.position.x, cam.position.z - r.m.position.z), 0.25); r.m.material.opacity = 0.16 * (0.6 + 0.4 * Math.sin(K.t * 0.8 + r.ph)); });
  if (K.motes) { K.motes.position.copy(cam.position); K.motes.material.color.set(under ? '#d8ffff' : '#fff0c0'); K.motes.material.size = under ? 0.09 : 0.13; }
  /* life: fish, turtle, fireflies, the fire, gulls */
  if (K.schools) { const o = K._o || (K._o = new T.Object3D()); K.schools.forEach(function (sc) { const a0 = K.t * sc.sp + sc.ph; for (let i = 0; i < sc.n; i++) { const of = sc.off[i], a = a0 + of[0] * 0.25, rr = sc.r + of[2] * 1.2, x = sc.cx + Math.cos(a) * rr, z = sc.cz + Math.sin(a) * rr * 0.75, y = sc.y + of[1] + Math.sin(K.t * 0.9 + of[3]) * 0.25;
      o.position.set(x, Math.min(y, -0.5), z); o.rotation.set(0, Math.atan2(-Math.sin(a) * rr, Math.cos(a) * rr * 0.75) + Math.sin(K.t * 9 + of[3]) * 0.12, 0); o.scale.setScalar(0.16 + (i % 3) * 0.02); o.updateMatrix(); sc.im.setMatrixAt(i, o.matrix); } sc.im.instanceMatrix.needsUpdate = true; }); }
  if (K.turtle) { const a = K.t * 0.05, x = 4 + Math.cos(a) * 30, z = shoreZ(0) + 24 + Math.sin(a * 2) * 9, y = -2.2 + Math.sin(K.t * 0.4) * 0.5; K.turtle.position.set(x, y, z); K.turtle.rotation.set(0, Math.atan2(-Math.sin(a) * 30, Math.cos(a * 2) * 18), Math.sin(K.t * 0.6) * 0.08);
    K.flip.forEach(function (f) { f.m.rotation.z = f.s * Math.sin(K.t * (f.front ? 1.6 : 1.6)) * (f.front ? 0.6 : 0.3); }); }
  if (K.flies) { const fp = K.flies.geometry.attributes.position; K.flyD.forEach(function (f, i) { const a = K.t * 0.35 + f.ph; fp.setXYZ(i, f.x + Math.sin(a) * f.r, Hc(f.x, f.z) + 0.8 + Math.sin(K.t * 0.9 + f.ph) * 0.5, f.z + Math.cos(a * 0.8) * f.r); }); fp.needsUpdate = true; K.flies.material.opacity = 0.55 + 0.35 * Math.sin(K.t * 2.2); }
  if (K.flames) K.flames.forEach(function (f, i) { f.scale.y = 1 + Math.sin(K.t * (9 + i * 3)) * 0.18; f.scale.x = f.scale.z = 1 + Math.sin(K.t * (7 + i * 2)) * 0.08; f.rotation.y += dt * (1 + i); }); if (K.fireL) K.fireL.intensity = 1.3 + Math.sin(K.t * 13) * 0.15 + Math.sin(K.t * 7.3) * 0.1;
  if (K.sparks) K.sparks.forEach(function (s0, i) { s0.t += dt; if (s0.t > 1.6) s0.t -= 1.6; const u = s0.t / 1.6; s0.m.position.set(K.fire.x + Math.sin(i * 2.1 + K.t) * 0.3 * u, K.fire.y + 0.6 + u * 3.2, K.fire.z + Math.cos(i * 1.7) * 0.3 * u); s0.m.material.opacity = (1 - u) * 0.9; });
  if (K.gulls) K.gulls.forEach(function (gl, i) { const a = K.t * 0.15 + gl.ph; gl.m.position.set(Math.cos(a) * gl.r, gl.y + Math.sin(K.t + i) * 1.2, 40 + Math.sin(a) * gl.r * 0.6); gl.m.rotation.y = -a; gl.m.children[0].rotation.z = 0.25 + Math.sin(K.t * 4 + i) * 0.3; gl.m.children[1].rotation.z = -(0.25 + Math.sin(K.t * 4 + i) * 0.3); });
  /* things to use */
  const nearBack = Math.hypot(K.px - START.x, K.pz - START.z) < 5, nearFire = Math.hypot(K.px - FIRE.x, K.pz - FIRE.z) < 3.4 && !K.sitting; K.near = nearBack ? 'back' : nearFire ? 'fire' : null;
  const pr = K.near === 'back' ? 'E: ' + tx(A.back || 'co.back') + ' ' + tx('co.backT') : K.near === 'fire' ? 'E: ' + tx('co.sit') + ' ' + tx('co.fire') : K.sitting ? tx('co.stand') : ''; if (pr !== K.lastPr) { K.lastPr = pr; $('coPrompt').textContent = pr; $('coPrompt').hidden = !pr; }
  if (K.sitting) K.yaw += dt * 0.06;
  if (K.cardT > 0) { K.cardT -= dt; if (K.cardT <= 0) $('coCard').hidden = true; }
  /* frames per second (shown in admin mode, to check speed on Chromebooks) */
  { const now = performance.now(); K.fpsT += (now - (K.fpsLast || now)) / 1000; K.fpsLast = now; } K.fpsN++; if (K.fpsT > 1) { /* real frames per second, measured with the clock */ const f = $('coFps'); f.hidden = !C.S.set.admin; f.textContent = Math.round(K.fpsN / K.fpsT) + ' fps'; K.fps = K.fpsN / K.fpsT; K.fpsN = 0; K.fpsT = 0; }
}
function act() { if (!K || K.pause) return; const FIRE = K.A.fire; if (K.near === 'back') leave(); else if (K.near === 'fire') { K.sitting = true; K.vx = K.vz = 0; K.face = Math.atan2(FIRE.x - K.px, FIRE.z - K.pz); } }
function key(e, down) {
  if (!K) return; const kk = e.key.length === 1 ? e.key.toLowerCase() : e.key; if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (down && kk === 'Escape') { e.preventDefault(); setPause(!K.pause); return; } if (K.pause) return;
  if (down && (kk === 'e' || kk === 'Enter')) { if (e.target && e.target.tagName === 'BUTTON' && kk === 'Enter') return; e.preventDefault(); act(); return; }
  if (down && (kk === '-' || kk === '_')) { K.distT = Math.min(30, K.distT * 1.2); return; } if (down && (kk === '=' || kk === '+')) { K.distT = Math.max(2.2, K.distT / 1.2); return; }
  const map = { w: 'f', ArrowUp: 'f', s: 'b', ArrowDown: 'b', a: 'l', ArrowLeft: 'l', d: 'r', ArrowRight: 'r', ' ': 'jump', Shift: 'run', q: 'ql', r: 'qr', c: 'dive', x: 'dive', Control: 'dive', t: 'tu', g: 'td' };
  if (map[kk]) { K.k[map[kk]] = down; e.preventDefault(); }
}
function pointer(e, type) {
  if (!K || K.pause) return;
  if (type === 'wheel') { K.distT = Math.max(2.2, Math.min(30, K.distT * (e.deltaY > 0 ? 1.12 : 1 / 1.12))); e.preventDefault(); return; }
  if (type === 'pointerdown') K.drag = { x: e.clientX, y: e.clientY, yaw: K.yaw, pitch: K.pitch };
  else if (type === 'pointermove' && K.drag && e.buttons) { const sn = C.S.set.camSens || 1, inv = C.S.set.camInv ? -1 : 1; K.yaw = K.drag.yaw - (e.clientX - K.drag.x) * 0.008 * sn; K.pitch = Math.max(-0.35, Math.min(1.25, K.drag.pitch + (e.clientY - K.drag.y) * 0.006 * sn * inv)); }
  else if (type === 'pointerup') K.drag = null;
}
function blur() { if (K) K.k = {}; }
BQ.coast = { addArea: function (id, A) { AREAS[id] = A; }, areas: AREAS, tags: TAGS, journalHTML: journalHTML, cove: { H: Hc, shoreZ: shoreZ, REEF: REEF, riverX: riverX }, lib: { windyOf: function (m, a, s, mode, k) { return windy(m, a, s, mode, k); }, causticify: causticify, fallRibbon: fallRibbon, fallMat: fallMat, mist: mist, waterMat: waterMat, addPlayer: addPlayer, windy: windy, colorize: colorize, merge: merge, place: place, inst: inst, frondGeo: frondGeo, canvasTex: canvasTex, softDot: softDot, rng: rng, UT: UT, low: low, smooth: smooth, lineD: lineD }, enter: enter, leave: leave, step: step, key: key, pointer: pointer, blur: blur, cozyTrail: cozyTrail, active: function () { return !!K; }, _k: function () { return K; }, _H: Hc, _shore: shoreZ, START: START, FIRE: FIRE, PATH: PATH };
}
if (BQ.core) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

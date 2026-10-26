/* Earthling Field Guide: AURORA LAKE (part of cozy mode, uses the hiking system in coast.js).
   A mountain lake at night: a campfire on the shore with logs to sit on, fireflies, pines all around, a little dock,
   snowy peaks across the water, a sky full of stars and the Milky Way, shooting stars, and the northern lights (aurora)
   rippling over the mountains and reflected in the still lake. You can swim in the lake.
   Science: on rare nights during strong storms on the Sun, auroras are seen as far south as Pennsylvania. Particles from the Sun
   hit gases high in the air; oxygen glows green and nitrogen glows blue and purple. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
if (!BQ.coast || !BQ.coast.lib) return;
const C = BQ.core, T = C.T, tx = C.tx, L = BQ.coast.lib, UT = L.UT;

Object.assign(C.I18N.en, {
  'lk.title': 'Aurora Lake', 'lk.down': 'Hiking up the mountain trail to the lake…', 'lk.up': 'Hiking back down to Willow Creek…', 'lk.back': 'Hike back down to',
  'lk.welcome': 'Aurora Lake. On rare nights the northern lights (aurora) can be seen as far south as Pennsylvania. Particles from the Sun crash into gases high in the air: oxygen glows green, and nitrogen glows blue and purple. Sit by the campfire with E, or swim in the lake.',
  'lk.sign': '🌌 To Aurora Lake', 'cz.hikeUp': 'Hike up', 'cz.t.lake': 'the mountain trail to Aurora Lake'
});
Object.assign(C.I18N.es, {
  'lk.title': 'Lago de la Aurora', 'lk.down': 'Subiendo por el sendero de la montaña hasta el lago…', 'lk.up': 'Bajando de nuevo a Willow Creek…', 'lk.back': 'Bajar de nuevo a',
  'lk.welcome': 'Lago de la Aurora. En noches poco comunes, la aurora boreal se puede ver tan al sur como Pensilvania. Partículas del Sol chocan con los gases en lo alto del aire: el oxígeno brilla verde y el nitrógeno brilla azul y morado. Siéntate junto a la fogata con E, o nada en el lago.',
  'lk.sign': '🌌 Al Lago de la Aurora', 'cz.hikeUp': 'Subir por', 'cz.t.lake': 'el sendero de la montaña hasta el Lago de la Aurora'
});

/* ---------- THE LAND ---------- */
function lakeR(a) { return 27 + 4 * Math.sin(3 * a + 0.5) + 2.5 * Math.cos(5 * a + 1); } /* the shoreline's distance from the lake's center, by direction */
function H(x, z) {
  const a = Math.atan2(z, x), R = lakeR(a), d = Math.hypot(x, z), q = d / R; let h;
  if (q < 1) h = -0.15 - 5.4 * Math.pow(1 - q * q, 0.8) + 0.15 * Math.sin(x * 0.7) * Math.cos(z * 0.6);
  else { const e = d - R; h = Math.min(e * 0.1, 0.9) + Math.max(0, e - 9) * 0.1 + (Math.sin(x * 0.11) * Math.cos(z * 0.09) * 1.3 + Math.sin(x * 0.27 + z * 0.19) * 0.3) * Math.min(1, Math.max(0, e - 4) / 12); }
  h += Math.min(7, Math.max(0, -z - 30) * 0.22) * (0.75 + 0.25 * Math.sin(x * 0.09)) + Math.max(0, Math.abs(x) - 55) * 0.45 + Math.max(0, z - 58) * 0.22;
  return h;
}
function water(x, z) { return (H(x, z) < -0.05 && Math.hypot(x, z) < lakeR(Math.atan2(z, x)) * 1.08) ? 0 : null; }
const shoreS = lakeR(Math.PI / 2); /* the south shore, on the line x = 0 */
const FIRE = { x: -5, z: shoreS + 8 }, START = { x: 5, z: 70 }, DOCK = (function () { const a = 1.15, R = lakeR(a); return { x0: Math.cos(a) * (R + 1.5), z0: Math.sin(a) * (R + 1.5), x1: Math.cos(a) * (R - 8), z1: Math.sin(a) * (R - 8) }; })();
const PATH = L.smooth([[START.x, START.z], [3, 58], [-2, 47], [FIRE.x + 2, FIRE.z + 2.5], [0, shoreS + 1.5], [DOCK.x0, DOCK.z0]], 50);
function pathD(x, z) { return L.lineD(PATH, x, z); }
/* the mountain skyline across the lake: the same shape is drawn far away and used for reflections in the water */
function prof(az) { const N = Math.max(0, Math.min(1, (Math.cos(az) + 0.3) / 1.05)), Ns = N * N * (3 - 2 * N), p = (1 - Math.abs(Math.sin(az * 2.3 + 0.4))) * 0.45 + (1 - Math.abs(Math.sin(az * 5.7 + 1.3))) * 0.3 + (1 - Math.abs(Math.sin(az * 13.1 + 2.1))) * 0.15 + (1 - Math.abs(Math.sin(az * 29.0 + 0.7))) * 0.1; return 0.035 + Ns * (0.06 + 0.2 * p); }
const GLSL = 'uniform float uT;\nfloat hsh(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n' +
  'float prof(float az) { float N = smoothstep(-0.3, 0.75, cos(az)); float p = (1.0 - abs(sin(az * 2.3 + 0.4))) * 0.45 + (1.0 - abs(sin(az * 5.7 + 1.3))) * 0.3 + (1.0 - abs(sin(az * 13.1 + 2.1))) * 0.15 + (1.0 - abs(sin(az * 29.0 + 0.7))) * 0.1; return 0.035 + N * (0.06 + 0.2 * p); }\n' +
  'vec3 aurora(vec3 d) { float az = atan(d.x, -d.z); float north = smoothstep(-0.15, 0.55, -d.z / max(0.001, length(d.xz)));\n' +
  ' float base = 0.13 + 0.05 * sin(az * 2.0 + uT * 0.05) + 0.025 * sin(az * 5.0 - uT * 0.11); float h = d.y - base; if (h < -0.03 || north <= 0.0) return vec3(0.0);\n' +
  ' float folds = 0.5 + 0.5 * sin(az * 7.0 + sin(az * 2.3 + uT * 0.15) * 2.5 + uT * 0.25); float rays = 0.62 + 0.38 * sin(az * 70.0 + sin(az * 9.0 + uT * 0.5) * 5.0);\n' +
  ' float v = smoothstep(-0.03, 0.025, h) * exp(-max(h, 0.0) * 5.0); vec3 c = mix(vec3(0.15, 1.0, 0.55), vec3(0.62, 0.25, 0.95), smoothstep(0.05, 0.32, h));\n' +
  ' float pulse = 0.8 + 0.2 * sin(uT * 0.7 + az * 3.0); return c * v * (0.35 + 0.65 * folds) * rays * north * 1.3 * pulse; }\n' +
  'vec3 skyCol(vec3 d) { float y = d.y; vec3 c = mix(vec3(0.07, 0.11, 0.25), vec3(0.01, 0.017, 0.05), smoothstep(0.0, 0.55, y));\n' +
  ' vec3 mwn = normalize(vec3(0.35, 0.55, 0.75)); float b = dot(d, mwn); float mw = exp(-b * b / 0.014) * (0.55 + 0.45 * sin(d.x * 20.0 + d.z * 13.0) * sin(d.y * 17.0 + d.x * 5.0));\n' +
  ' c += vec3(0.15, 0.16, 0.26) * mw * smoothstep(0.0, 0.15, y); return c + aurora(d); }\n';

/* ---------- BUILD ---------- */
function build(K) {
  const g = new T.Group(), LO = L.low(), R = L.rng(21), cc = new T.Color(); K.g = g; K.colliders = []; C.scene.add(g);
  C.scene.background = new T.Color('#070b1c'); C.scene.fog = new T.FogExp2('#0b1430', 0.0085);
  C.HEMI.color.set('#4a6aa8'); C.HEMI.groundColor.set('#0a0d10'); C.HEMI.intensity = 0.5; C.KEYL.color.set('#7affc8'); C.KEYL.intensity = 0.38; C.KEYL.position.set(0, 80, -120);
  /* the sky, the stars, the skyline */
  K.skyM = new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, uniforms: { uT: UT }, vertexShader: 'varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: GLSL + 'varying vec3 vD; void main() { vec3 d = normalize(vD); vec3 c = skyCol(d); if (d.y < 0.0) c = mix(c, vec3(0.04, 0.06, 0.12), smoothstep(0.0, -0.08, d.y)); gl_FragColor = vec4(c, 1.0); }' });
  K.sky = new T.Mesh(new T.SphereGeometry(900, 32, 16), K.skyM); K.sky.renderOrder = -10; g.add(K.sky);
  { const n = LO ? 1300 : 2800, p = new Float32Array(n * 3), sz = new Float32Array(n), ph = new Float32Array(n), col = new Float32Array(n * 3), tint = [new T.Color('#ffffff'), new T.Color('#cfe0ff'), new T.Color('#fff2d0'), new T.Color('#ffd8c8')];
    for (let i = 0; i < n; i++) { let x, y, z; do { x = R() * 2 - 1; y = R(); z = R() * 2 - 1; } while (x * x + y * y + z * z > 1 || y < 0.03);
      const v = new T.Vector3(x, y, z).normalize(); const mw = Math.exp(-Math.pow(v.dot(new T.Vector3(0.35, 0.55, 0.75).normalize()), 2) / 0.02); if (R() < 0.35 && mw < 0.3) { i--; continue; } /* more stars in the Milky Way band */
      p.set([v.x * 850, v.y * 850, v.z * 850], i * 3); sz[i] = R() < 0.05 ? 3.6 + R() * 1.8 : 1.4 + R() * 1.6; ph[i] = R() * 6.28; const c0 = tint[Math.floor(R() * 4)]; col.set([c0.r, c0.g, c0.b], i * 3); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(p, 3)); sg.setAttribute('aS', new T.BufferAttribute(sz, 1)); sg.setAttribute('aP', new T.BufferAttribute(ph, 1)); sg.setAttribute('color', new T.BufferAttribute(col, 3));
    K.stars = new T.Points(sg, new T.ShaderMaterial({ transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending, vertexColors: true, uniforms: { uT: UT },
      vertexShader: 'uniform float uT; attribute float aS; attribute float aP; varying float vA; varying vec3 vC; void main() { vC = color; vA = 0.55 + 0.45 * sin(uT * (1.3 + aP * 0.3) + aP * 7.0); gl_PointSize = aS * (0.85 + 0.15 * vA) * 1.6; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'varying float vA; varying vec3 vC; void main() { vec2 q = gl_PointCoord - 0.5; float d = length(q); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC, a * a * vA); }' }));
    K.stars.frustumCulled = false; K.stars.renderOrder = -9; g.add(K.stars); }
  K.shoot = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: '#e8f4ff', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false, side: T.DoubleSide })); K.shoot.renderOrder = -8; g.add(K.shoot); K.shootT = 4;
  { const N = LO ? 300 : 520, D = 430, P = [], CO = [], I = [], rows = [0, 0.45, 0.7, 0.84, 1];
    for (let i = 0; i <= N; i++) { const az = i / N * 6.283, e = prof(az), north = Math.max(0, Math.min(1, (Math.cos(az) + 0.3) / 1.05)), top = Math.tan(e) * D + 2, j = Math.sin(i * 12.9898) * 0.5;
      rows.forEach(function (rr, k) { const y = k === 0 ? -40 : top * rr + j * (k < 4 ? 3 : 0), dd = D - (k === 4 ? 0 : 6 * (4 - k)); P.push(Math.sin(az) * dd, y, -Math.cos(az) * dd);
        const tall = top > 55, snow = (k === 4 && north > 0.3 && tall) || (k === 3 && north > 0.55 && Math.sin(i * 2.7) > 0.2 && tall), c0 = new T.Color(snow ? '#a8bad8' : k >= 2 && north > 0.4 ? '#2a3550' : '#101828'); if (snow && k === 4) c0.offsetHSL(0, 0, 0.06); CO.push(c0.r, c0.g, c0.b); });
      if (i < N) for (let k = 0; k < 4; k++) { const a0 = i * 5 + k, b0 = (i + 1) * 5 + k; I.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1); } }
    const sk = new T.BufferGeometry(); sk.setAttribute('position', new T.Float32BufferAttribute(P, 3)); sk.setAttribute('color', new T.Float32BufferAttribute(CO, 3)); sk.setIndex(I);
    const skm = new T.Mesh(sk, new T.MeshBasicMaterial({ vertexColors: true, fog: false, side: T.DoubleSide })); skm.renderOrder = -7; g.add(skm); }
  /* the ground */
  const NX = LO ? 100 : 150, NZ = LO ? 86 : 128, geo = new T.PlaneGeometry(200, 170, NX, NZ); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, 5);
  const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, H(pos.getX(i), pos.getZ(i))); geo.computeVertexNormals();
  L.colorize(geo, function (x, y, z, ny, o) { const a = Math.atan2(z, x), e = Math.hypot(x, z) - lakeR(a), n = Math.sin(x * 0.21 + Math.cos(z * 0.17) * 2) * Math.cos(z * 0.13 - x * 0.05);
    if (e < -1) cc.set('#2e2c24').lerp(new T.Color('#4a4436'), Math.max(0, (e + 6) / 5)); else if (e < 2.2 + n) cc.set('#6a6458').lerp(new T.Color('#8a8272'), Math.max(0, n)); /* pebbly shore */
    else { cc.set(n > 0.35 ? '#4f7a3a' : n < -0.4 ? '#2f5a30' : '#3f6a34'); if (y > 9) cc.lerp(new T.Color('#2a4a2e'), Math.min(1, (y - 9) / 10)); }
    if (ny < 0.7 && e > 0) cc.set('#5a5a5e').lerp(new T.Color('#3e4048'), Math.max(0, n)); if (y > 26 && ny > 0.55) cc.lerp(new T.Color('#c8d4e4'), Math.min(1, (y - 26) / 8));
    if (pathD(x, z) < 1.6 && e > 0) cc.lerp(new T.Color('#8a6a48'), pathD(x, z) < 1 ? 0.8 : 0.35); cc.offsetHSL(0, 0, Math.sin(x * 1.7 + z * 2.3) * 0.02); o[0] = cc.r; o[1] = cc.g; o[2] = cc.b; });
  g.add(new T.Mesh(geo, new T.MeshLambertMaterial({ vertexColors: true })));
  /* the lake: dark, calm water that mirrors the sky, the aurora, the mountains and the campfire */
  { const lg = new T.CircleGeometry(36, LO ? 48 : 80, 0, Math.PI * 2); lg.rotateX(-Math.PI / 2); const lp = lg.attributes.position, dep = new Float32Array(lp.count); for (let i = 0; i < lp.count; i++) dep[i] = Math.max(0, -H(lp.getX(i), lp.getZ(i))); lg.setAttribute('aDepth', new T.BufferAttribute(dep, 1));
    K.lakeM = new T.ShaderMaterial({ transparent: true, depthWrite: false, side: T.DoubleSide, fog: true, uniforms: T.UniformsUtils.merge([T.UniformsLib.fog, { uT: { value: 0 }, uFire: { value: new T.Vector3(FIRE.x, H(FIRE.x, FIRE.z) + 1.0, FIRE.z) } }]),
      vertexShader: 'attribute float aDepth; varying vec3 vW; varying float vD;\n#include <fog_pars_vertex>\nvoid main() { vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vD = aDepth; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;\n#include <fog_vertex>\n}',
      fragmentShader: GLSL + 'uniform vec3 uFire; varying vec3 vW; varying float vD;\n#include <fog_pars_fragment>\n' +
        'void main() { if (vD <= 0.0) discard; vec2 p = vW.xz; vec2 gr = vec2(0.6, 0.8) * cos(dot(p, vec2(0.6, 0.8)) * 2.3 + uT * 1.1) * 0.012 + vec2(-0.7, 0.7) * cos(dot(p, vec2(-0.7, 0.7)) * 3.7 - uT * 1.4) * 0.009 + vec2(0.1, -1.0) * cos(dot(p, vec2(0.1, -1.0)) * 6.1 + uT * 1.9) * 0.006;\n' +
        ' vec3 n = normalize(vec3(-gr.x, 1.0, -gr.y)); vec3 v = normalize(cameraPosition - vW);\n' +
        ' if (!gl_FrontFacing) { gl_FragColor = vec4(vec3(0.05, 0.14, 0.16) + aurora(normalize(-v)) * 0.15, 0.85);\n#include <fog_fragment>\n return; }\n' +
        ' vec3 r = reflect(-v, n); r.y = max(r.y, 0.001); float az = atan(r.x, -r.z); float pr = prof(az); vec3 refl;\n' +
        ' if (r.y < pr) { float north = smoothstep(-0.3, 0.75, cos(az)); refl = (r.y > pr * 0.84 && north > 0.35 && pr > 0.1) ? vec3(0.42, 0.5, 0.64) * 0.7 : vec3(0.04, 0.06, 0.1); }\n' +
        ' else { refl = skyCol(r); vec2 sp = floor(r.xz / (r.y + 0.04) * 70.0); float st = step(0.996, hsh(sp)) * (0.5 + 0.5 * sin(uT * 2.0 + hsh(sp + 3.1) * 40.0)); refl += vec3(0.8, 0.85, 1.0) * st * 0.7; }\n' +
        ' vec3 tf = uFire - vW; float fd = length(tf); float fg = pow(max(dot(r, tf / fd), 0.0), 140.0) * 2.2 + pow(max(dot(r, tf / fd), 0.0), 12.0) * 0.18; refl += vec3(1.0, 0.55, 0.2) * fg * clamp(30.0 / fd, 0.0, 1.0);\n' +
        ' float fres = 0.25 + 0.75 * pow(1.0 - max(dot(n, v), 0.0), 2.0); vec3 body = mix(vec3(0.03, 0.09, 0.1), vec3(0.01, 0.03, 0.06), clamp(vD / 4.0, 0.0, 1.0));\n' +
        ' vec3 col = mix(body, refl, fres); float a = mix(0.7, 0.96, clamp(vD / 2.0, 0.0, 1.0)); gl_FragColor = vec4(col, a);\n#include <fog_fragment>\n}' });
    K.lake = new T.Mesh(lg, K.lakeM); K.lake.renderOrder = 2; g.add(K.lake); }
  /* lily pads and a few white water lilies near the shore */
  { const pads = [], flowers = []; for (let i = 0; i < (LO ? 30 : 60); i++) { const a = R() * 6.283, rr = lakeR(a) - 1.5 - R() * 5, x = Math.cos(a) * rr, z = Math.sin(a) * rr; if (Math.sin(a * 3 + 1) < 0.1) continue; const s = 0.35 + R() * 0.35; pads.push([x, 0.02, z, s, 1, s, R() * 6]); if (R() < 0.25) flowers.push([x + 0.1, 0.08, z, 0.13, 0.1, 0.13, R() * 6]); }
    const pad = new T.CircleGeometry(1, 10, 0.3, 5.9); pad.rotateX(-Math.PI / 2); g.add(L.inst(pad, new T.MeshLambertMaterial({ color: '#2f6a34', side: T.DoubleSide }), pads)); g.add(L.inst(new T.SphereGeometry(1, 6, 4), new T.MeshLambertMaterial({ color: '#f4f0ff', emissive: '#2a2a3a' }), flowers)); }
  /* ---------- plants ---------- */
  const ok = function (x, z) { const e = Math.hypot(x, z) - lakeR(Math.atan2(z, x)); if (e < 3.5 || pathD(x, z) < 1.7) return false; const y = H(x, z); if (Math.hypot(H(x + 0.6, z) - y, H(x, z + 0.6) - y) > 0.42) return false; return Math.hypot(x - FIRE.x, z - FIRE.z) > 3.4; };
  { const blades = []; for (let b = 0; b < 7; b++) { const a = b / 7 * 6.283 + 0.3, ox = Math.cos(a) * 0.12, oz = Math.sin(a) * 0.12, lean = 0.2 + (b % 3) * 0.1, w = 0.075, bg = new T.BufferGeometry();
      bg.setAttribute('position', new T.BufferAttribute(new Float32Array([ox - w, 0, oz, ox + w, 0, oz, ox + Math.cos(a) * lean, 1, oz + Math.sin(a) * lean]), 3)); bg.setIndex([0, 1, 2]); bg.setAttribute('normal', new T.BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]), 3));
      L.colorize(bg, function (x, y, z, ny, o) { const c0 = new T.Color('#3f6a34').lerp(new T.Color('#a8c878'), y); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; }); blades.push(bg); }
    const tuft = L.merge(blades), list = []; for (let tries = 0; list.length < (LO ? 2500 : 6500) && tries < 40000; tries++) { const x = -90 + R() * 180, z = -40 + R() * 125; if (!ok(x, z)) continue; list.push([x, H(x, z) - 0.02, z, 1, 0.24 + R() * 0.22, 1, R() * 6.28]); }
    g.add(L.inst(tuft, L.windy(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.16, 1.4, 'y', 'lkgrass'), list)); }
  { const head = new T.CircleGeometry(1, 6); head.rotateX(-Math.PI / 2); const stem = new T.CylinderGeometry(0.02, 0.02, 1, 3, 1, true); stem.translate(0, 0.5, 0);
    const fl = L.merge([L.colorize(L.place(stem, 0, 0, 0, 1, 1, 1), function (x, y, z, ny, o) { o[0] = 0.3; o[1] = 0.5; o[2] = 0.25; }), L.colorize(L.place(head, 0, 1, 0, 0.13, 1, 0.13), function (x, y, z, ny, o) { o[0] = o[1] = o[2] = 1; })]);
    const spike = new T.ConeGeometry(0.08, 0.55, 6); spike.translate(0, 0.8, 0); const lup = L.merge([L.colorize(spike, function (x, y, z, ny, o) { const k = 0.75 + 0.25 * Math.sin(y * 40); o[0] = o[1] = o[2] = k; }), L.colorize(L.place(stem, 0, 0, 0, 1, 0.6, 1), function (x, y, z, ny, o) { o[0] = 0.3; o[1] = 0.5; o[2] = 0.25; })]);
    const L1 = [], C1 = [], L2 = [], C2 = []; for (let tries = 0; L1.length + L2.length < (LO ? 500 : 1200) && tries < 20000; tries++) { const x = -70 + R() * 140, z = shoreS - 10 + R() * 60; if (!ok(x, z)) continue; const dr = Math.sin(x * 0.13 + 1) * Math.cos(z * 0.11); if (dr < 0.25) continue; const y = H(x, z);
      if (R() < 0.4) { L2.push([x, y, z, 1, 0.5 + R() * 0.4, 1, R() * 6]); C2.push(R() < 0.7 ? '#8a6ad8' : '#5a8ae8'); } else { L1.push([x, y, z, 1, 0.28 + R() * 0.2, 1, R() * 6]); C1.push(R() < 0.7 ? '#ffffff' : '#ffe08a'); } }
    g.add(L.inst(fl, L.windy(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide, emissive: '#151520' }), 0.15, 1.4, 'y', 'lkfl'), L1, C1)); g.add(L.inst(lup, L.windy(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#100a20' }), 0.2, 1.4, 'y', 'lklup'), L2, C2)); }
  /* pines all around the lake (the camera fades the ones in its way) */
  { const trunk = new T.CylinderGeometry(0.22, 0.38, 1, 7); trunk.translate(0, 0.5, 0); const cone = new T.ConeGeometry(1, 1, 8); cone.translate(0, 0.5, 0);
    const TR = [], CN = [], CC = [], pines = [], greens = ['#1f3a26', '#2a4a2c', '#1a3324', '#2f5230']; K.pineT = [];
    for (let i = 0, tries = 0; i < (LO ? 70 : 130) && tries < 6000; tries++) { const x = -95 + R() * 190, z = -75 + R() * 160, e = Math.hypot(x, z) - lakeR(Math.atan2(z, x)); if (e < 5 || pathD(x, z) < 3 || Math.hypot(x - FIRE.x, z - FIRE.z) < 8 || Math.hypot(x - START.x, z - START.z) < 4) continue;
      if (z > shoreS - 4 && z < shoreS + 26 && Math.abs(x) < 26 && R() < 0.85) continue; /* keep the shore by the campfire open for the view */
      if (pines.some(function (p) { return Math.hypot(p[0] - x, p[1] - z) < 3; })) continue; const y = H(x, z), hgt = (z < -15 ? 5.5 + R() * 4.5 : 8 + R() * 9), rad = (z < -15 ? 1.5 : 1.8) + R() * 1.2; /* smaller trees across the lake, so the peaks show */ pines.push([x, z]); i++;
      TR.push([x, y - 0.2, z, 1.5, hgt * 0.45, 1.5, R() * 6]); K.pineT.push({ x: x, z: z, cr: rad, bot: y + hgt * 0.18, i0: CN.length, ti: TR.length - 1 });
      for (let k = 0; k < 3; k++) { CN.push([x, y + hgt * (0.18 + k * 0.22), z, rad * (1 - k * 0.24), hgt * (0.42 - k * 0.06), rad * (1 - k * 0.24), R() * 6]); CC.push(greens[(i + k) % 4]); }
      K.colliders.push({ x: x, z: z, r: 0.55, top: y + hgt }); }
    g.add(K.trunkIM = L.inst(trunk, new T.MeshLambertMaterial({ color: '#4a3424' }), TR)); g.add(K.pineIM = L.inst(cone, L.windy(new T.MeshLambertMaterial({ color: '#ffffff' }), 0.04, 0.9, 'y', 'lkpine'), CN, CC)); }
  /* rocks along the shore and in the woods, logs by the fire and in the forest */
  { const rk = new T.DodecahedronGeometry(1, 1), rp = rk.attributes.position; for (let i = 0; i < rp.count; i++) { const v = new T.Vector3(rp.getX(i), rp.getY(i), rp.getZ(i)), k = 1 + 0.16 * Math.sin(v.x * 4.1 + v.z * 3.3) + 0.1 * Math.cos(v.y * 5.7); rp.setXYZ(i, v.x * k, v.y * k * 0.8, v.z * k); }
    rk.computeVertexNormals(); L.colorize(rk, function (x, y, z, ny, o) { const c0 = ny > 0.6 ? new T.Color('#4a6a3a') : new T.Color('#7a7a80').offsetHSL(0, 0, y * 0.05); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; });
    const RL = []; for (let i = 0; i < 26; i++) { const a = R() * 6.283, rr = lakeR(a) + 0.5 + R() * 3, x = Math.cos(a) * rr, z = Math.sin(a) * rr, s = 0.6 + R() * 1.3; if (pathD(x, z) < s + 1.6 || Math.hypot(x - DOCK.x0, z - DOCK.z0) < 4) continue; const y = H(x, z); RL.push([x, y + s * 0.2, z, s, s * 0.8, s * 1.1, R() * 6]); K.colliders.push({ x: x, z: z, r: s * 0.95, top: y + s * 0.9 }); }
    for (let i = 0; i < 14; i++) { const x = -80 + R() * 160, z = -30 + R() * 110; if (!ok(x, z) || pathD(x, z) < 4) continue; const s = 1.4 + R() * 1.4, y = H(x, z); RL.push([x, y + s * 0.25, z, s, s * 0.85, s * 1.1, R() * 6]); K.colliders.push({ x: x, z: z, r: s * 0.95, top: y + s * 0.95 }); }
    g.add(L.inst(rk, new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }), RL));
    const parts = [], LOGS = [[FIRE.x - 2.6, FIRE.z + 0.3, 0.15, 3.4, 0.36], [FIRE.x + 2.4, FIRE.z - 1.2, 1.25, 3.2, 0.35], [FIRE.x + 0.3, FIRE.z + 2.8, 1.65, 2.8, 0.33], [24, 40, 0.6, 7, 0.6], [-30, 30, 2.2, 6.5, 0.55], [36, 8, 1.4, 6, 0.5], [-40, 2, 0.3, 7, 0.6]];
    LOGS.forEach(function (l, li) { if (li > 2 && pathD(l[0], l[1]) < l[3] / 2 + 2) return; const x = l[0], z = l[1], a = l[2], len = l[3], r = l[4], y = Math.min(H(x - Math.cos(a) * len / 2, z + Math.sin(a) * len / 2), H(x + Math.cos(a) * len / 2, z - Math.sin(a) * len / 2), H(x, z)) + r * 0.8;
      const cg = new T.CylinderGeometry(r, r * 1.08, len, 12, 4); L.colorize(cg, function (xx, yy, zz, ny, o) { const c0 = Math.abs(ny) > 0.9 ? new T.Color('#b08a5a') : new T.Color(xx > r * 0.35 ? '#3f5a2a' : '#4a3424').offsetHSL(0, 0, Math.sin(yy * 9) * 0.04); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; });
      parts.push(L.place(cg, x, y, z, 1, 1, 1, a, 0, Math.PI / 2)); for (let t = -len / 2 + r; t <= len / 2 - r + 0.01; t += r * 1.4) K.colliders.push({ x: x + Math.cos(a) * t, z: z - Math.sin(a) * t, r: r, top: y + r }); });
    g.add(new T.Mesh(L.merge(parts), new T.MeshLambertMaterial({ vertexColors: true }))); }
  /* the dock: wooden planks on posts, out over the water (you can walk to the end) */
  { const dx = DOCK.x1 - DOCK.x0, dz = DOCK.z1 - DOCK.z0, len = Math.hypot(dx, dz), a = Math.atan2(dx, dz), parts = [], top = 0.42;
    const plank = new T.BoxGeometry(2.4, 0.12, 0.42); L.colorize(plank, function (x, y, z, ny, o) { o[0] = 0.48; o[1] = 0.36; o[2] = 0.24; });
    for (let t = 0; t <= len; t += 0.5) { parts.push(L.place(plank, DOCK.x0 + dx / len * t, top, DOCK.z0 + dz / len * t, 1, 1, 0.95 + Math.sin(t * 7) * 0.05, a)); }
    const post = new T.CylinderGeometry(0.12, 0.12, 4, 6); L.colorize(post, function (x, y, z, ny, o) { o[0] = 0.32; o[1] = 0.24; o[2] = 0.16; });
    for (let t = 1; t <= len; t += 2.5) [-1, 1].forEach(function (sd) { parts.push(L.place(post, DOCK.x0 + dx / len * t + Math.cos(a) * sd * 1.1, top - 1.6, DOCK.z0 + dz / len * t - Math.sin(a) * sd * 1.1, 1, 1, 1)); });
    g.add(new T.Mesh(L.merge(parts), new T.MeshLambertMaterial({ vertexColors: true })));
    for (let t = 0; t <= len; t += 0.8) K.colliders.push({ x: DOCK.x0 + dx / len * t, z: DOCK.z0 + dz / len * t, r: 1.05, top: top + 0.06, deck: true });
    const lan = C.glow('#ffc070', 2.4, 0.8, false); lan.position.set(DOCK.x1, top + 1.0, DOCK.z1); g.add(lan); const lb = new T.Mesh(new T.BoxGeometry(0.22, 0.32, 0.22), new T.MeshBasicMaterial({ color: '#ffd890' })); lb.position.set(DOCK.x1, top + 0.3, DOCK.z1); g.add(lb); }
  /* ---------- the campfire, smoke, sparks, fireflies ---------- */
  { const fy = H(FIRE.x, FIRE.z), ring = []; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; ring.push([FIRE.x + Math.cos(a) * 0.95, fy + 0.1, FIRE.z + Math.sin(a) * 0.95, 0.26, 0.2, 0.26, a]); }
    g.add(L.inst(new T.DodecahedronGeometry(1, 0), new T.MeshLambertMaterial({ color: '#7a746a' }), ring));
    const wood = []; for (let i = 0; i < 5; i++) wood.push([FIRE.x, fy + 0.25, FIRE.z, 0.08, 1.1, 0.08, i * 1.25, 1.1, 0]); g.add(L.inst(new T.CylinderGeometry(1, 1, 1, 5), new T.MeshLambertMaterial({ color: '#3a2618', emissive: '#3a1004' }), wood));
    const fire = new T.Group(); fire.position.set(FIRE.x, fy + 0.15, FIRE.z); g.add(fire); K.flames = [];
    [['#ff4a1a', 0.6, 1.5], ['#ff9a2a', 0.42, 1.15], ['#ffe07a', 0.22, 0.8]].forEach(function (f) { const m = new T.Mesh(new T.ConeGeometry(f[1], f[2], 7), new T.MeshBasicMaterial({ color: f[0], transparent: true, opacity: 0.88, blending: T.AdditiveBlending, depthWrite: false })); m.position.y = f[2] / 2; fire.add(m); K.flames.push(m); });
    const gl = C.glow('#ff9a4a', 7, 0.6, false); gl.position.y = 0.8; fire.add(gl); K.fireGlow = gl;
    K.fireL = new T.PointLight(0xff8a3a, 2.4, LO ? 16 : 22, 1.5); K.fireL.position.set(FIRE.x, fy + 1.5, FIRE.z); g.add(K.fireL);
    K.fire = { x: FIRE.x, y: fy, z: FIRE.z }; K.sparks = []; const dot = L.softDot();
    for (let i = 0; i < 20; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: dot, color: '#ffb05a', transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false })); s.scale.setScalar(0.13); g.add(s); K.sparks.push({ m: s, t: R() * 2 }); }
    K.smoke = []; for (let i = 0; i < (LO ? 5 : 9); i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: dot, color: '#8a90a8', transparent: true, opacity: 0, depthWrite: false })); g.add(s); K.smoke.push({ m: s, t: i / (LO ? 5 : 9) * 5 }); }
    const n = LO ? 50 : 110, fp = new Float32Array(n * 3), fly = []; for (let i = 0; i < n; i++) { const a = R() * 6.283, rr = lakeR(a) + 2 + R() * 22; fly.push({ x: Math.cos(a) * rr, z: Math.sin(a) * rr, ph: R() * 6.28, r: 0.8 + R() * 2 }); }
    const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.BufferAttribute(fp, 3)); K.flies = new T.Points(fg, new T.PointsMaterial({ map: dot, color: '#d8ff6a', size: 0.55, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false })); K.flies.frustumCulled = false; K.flyD = fly; g.add(K.flies);
    const mN = LO ? 100 : 200, mp = new Float32Array(mN * 3); for (let i = 0; i < mN; i++) { mp[i * 3] = R() * 24 - 12; mp[i * 3 + 1] = R() * 10 - 5; mp[i * 3 + 2] = R() * 24 - 12; }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(mp, 3)); K.motes = new T.Points(mg, new T.PointsMaterial({ map: dot, color: '#c8d8ff', size: 0.1, transparent: true, opacity: 0.4, blending: T.AdditiveBlending, depthWrite: false })); K.motes.frustumCulled = false; g.add(K.motes);
    K.rays = []; }
  /* signposts */
  { const post = function (x, z, text, w) { const y = H(x, z), p = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 2.6, 6), new T.MeshLambertMaterial({ color: '#6a4a32' })); p.position.set(x, y + 1.3, z); g.add(p);
      const lb = C.label(text, w, { bd: '#9fffd8' }); lb.position.set(x, y + 3.0, z); g.add(lb); K.colliders.push({ x: x, z: z, r: 0.25, top: y + 2.6 }); };
    post(START.x + 3.2, START.z + 0.5, tx('co.signBack'), 2.4); post(FIRE.x + 7, FIRE.z + 4, '🌌 ' + tx('lk.title'), 2.0); }
  L.addPlayer(g);
}
/* each frame: the aurora and stars move (shared clock), a shooting star now and then, smoke rises, the fire light flickers */
function step(dt, K) {
  K.lakeM.uniforms.uT.value = K.t; if (K.stars) K.stars.position.copy(C.cam.position);
  K.shootT -= dt; if (K.shootT <= 0) { K.shootT = 7 + Math.random() * 12; const az = -1.2 + Math.random() * 2.4, el = 0.35 + Math.random() * 0.35; K.shootA = { az: az, el: el, t: 0, dir: Math.random() < 0.5 ? -1 : 1 }; }
  if (K.shootA && K.shootA.t < 1) { const s = K.shootA; s.t += dt / 0.9; const az = s.az + s.dir * s.t * 0.35, el = s.el - s.t * 0.12, D = 600, c = C.cam.position;
    K.shoot.position.set(c.x + Math.sin(az) * Math.cos(el) * D, c.y + Math.sin(el) * D, c.z - Math.cos(az) * Math.cos(el) * D); K.shoot.lookAt(c); K.shoot.rotation.z += s.dir * 0.35; K.shoot.scale.set(38, 1.1, 1); K.shoot.material.opacity = Math.sin(Math.min(1, s.t) * Math.PI) * 0.9; } else K.shoot.material.opacity = 0;
  if (K.smoke) K.smoke.forEach(function (p) { p.t += dt; if (p.t > 5) p.t -= 5; const u = p.t / 5; p.m.position.set(K.fire.x + Math.sin(K.t * 0.5 + p.t) * 0.3 * u + u * 0.8, K.fire.y + 1.3 + u * 6, K.fire.z + u * 0.3); p.m.scale.setScalar(0.9 + u * 3.5); p.m.material.opacity = 0.32 * Math.sin(u * Math.PI); });
  if (K.fireL) K.fireL.intensity = 2.3 + Math.sin(K.t * 13) * 0.25 + Math.sin(K.t * 7.3) * 0.15; if (K.fireGlow) K.fireGlow.material.opacity = 0.55 + Math.sin(K.t * 11) * 0.06;
  C.KEYL.intensity = 0.33 + 0.08 * Math.sin(K.t * 0.7); /* the aurora's soft green light pulses */
}
BQ.coast.addArea('lake', { H: H, water: water, start: START, fire: FIRE, bounds: { x0: -85, x1: 85, z0: -55, z1: 86 }, build: build, step: step, look: [0, -30], trail: { a: 255, r: 61.2 }, sign: 'lk.sign', title: 'lk.title', icon: '🌌',
  down: 'lk.down', up: 'lk.up', back: 'lk.back', welcome: 'lk.welcome', flag: 'lake', mood: 'night', under: ['#0a2a2e', 0.09] });
BQ.lake = { H: H, FIRE: FIRE, START: START, DOCK: DOCK, lakeR: lakeR };
}
if (BQ.core && BQ.coast) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

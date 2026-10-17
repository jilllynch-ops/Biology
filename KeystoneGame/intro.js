/* EARTHLING FIELD GUIDE: OPENING STORY
   A short cinematic that plays the first time the game starts, told by the alien biologist in the first person:
   the long search across the Milky Way, our solar system and its habitable zone, Earth and a Moon flyby, then the
   ship lands in a golden meadow and the alien steps out and says hello.
   "Skip intro" works at every moment and always lands on the main menu. The menu has "Watch intro again". */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
const C = BQ.core, T = C.T, tx = C.tx;
Object.assign(C.I18N.en, {
  'in.skip': 'Skip intro ⏭', 'in.begin': '▶ Begin', 'in.beginSub': 'A short story with sound. Skip it anytime.', 'in.watch': '🎬 Watch intro again',
  'in.n1': 'I have searched across the stars for a world that might support life.',
  'in.n2': 'Across the vast Milky Way, I have looked for the conditions that let life begin and thrive.',
  'in.n3': 'Now my search has led me here: to an ordinary star, and the planets that circle it.',
  'in.n4': 'The third planet orbits in the habitable zone, where water can stay liquid on the surface.',
  'in.n5': 'Being in that zone does not prove a planet has life...',
  'in.n6': '...but this small blue world has oceans, an atmosphere, and an extraordinary variety of living things.',
  'in.n7': 'Earth. My search is over.',
  'in.n8': 'My investigation is just beginning.',
  'in.scan': '🛸 My scanner', 'in.sc1': 'Star: yellow, steady, ordinary', 'in.sc2': 'Planet 3: inside the habitable zone', 'in.sc3': 'Liquid water at the surface', 'in.sc4': 'Atmosphere with oxygen', 'in.sc5': 'Living things: too many kinds to count!',
  'in.l2a': 'Hello, Earth! I\'m a biologist. I\'m here to explore, observe, and learn.',
  'in.l2b': 'I come in peace, with a curious mind and a scientist\'s heart.',
  'in.l3a': 'Every stream, forest, flower, and tiny creature has a story to tell.',
  'in.l3b': 'Will you help me discover how life works on this wonderful planet?',
  'in.title': 'Earthling Field Guide', 'in.tag': 'A Keystone Biology mission'
});
Object.assign(C.I18N.es, {
  'in.skip': 'Saltar intro ⏭', 'in.begin': '▶ Comenzar', 'in.beginSub': 'Una historia corta con sonido. Puedes saltarla cuando quieras.', 'in.watch': '🎬 Ver la intro otra vez',
  'in.n1': 'He buscado entre las estrellas un mundo que pudiera albergar vida.',
  'in.n2': 'A lo largo de la inmensa Vía Láctea, he buscado las condiciones que permiten que la vida surja y prospere.',
  'in.n3': 'Ahora mi búsqueda me ha traído aquí: a una estrella común y a los planetas que giran a su alrededor.',
  'in.n4': 'El tercer planeta gira en la zona habitable, donde el agua puede seguir líquida en la superficie.',
  'in.n5': 'Estar en esa zona no demuestra que un planeta tenga vida...',
  'in.n6': '...pero este pequeño mundo azul tiene océanos, una atmósfera y una variedad extraordinaria de seres vivos.',
  'in.n7': 'La Tierra. Mi búsqueda ha terminado.',
  'in.n8': 'Mi investigación apenas comienza.',
  'in.scan': '🛸 Mi escáner', 'in.sc1': 'Estrella: amarilla, estable, común', 'in.sc2': 'Planeta 3: dentro de la zona habitable', 'in.sc3': 'Agua líquida en la superficie', 'in.sc4': 'Atmósfera con oxígeno', 'in.sc5': 'Seres vivos: ¡demasiados tipos para contarlos!',
  'in.l2a': '¡Hola, Tierra! Estudio a los seres vivos. Vengo a explorar, observar y aprender.',
  'in.l2b': 'Vengo en paz, con una mente curiosa y un corazón científico.',
  'in.l3a': 'Cada arroyo, bosque, flor y criatura diminuta tiene una historia que contar.',
  'in.l3b': '¿Me ayudas a descubrir cómo funciona la vida en este planeta maravilloso?',
  'in.title': 'Earthling Field Guide', 'in.tag': 'Una misión de Biología Keystone'
});
/* the story is told by the alien biologist: first the long search (galaxy), then the solar system, then Earth up close, then the landing */
const SH = 20; /* the original Earth approach and landing now start 20 seconds later */
const LINES = [[2, 6.6, 'in.n1'], [7, 12.2, 'in.n2'], [13.4, 17.4, 'in.n3'], [17.8, 22.2, 'in.n4'], [22.6, 25.6, 'in.n5'], [26, 31, 'in.n6'], [31.4, 33.6, 'in.n7'], [34, 36.6, 'in.n8'],
  [25.2 + SH, 29.4 + SH, 'in.l2a'], [29.8 + SH, 34.2 + SH, 'in.l2b'], [34.8 + SH, 39.4 + SH, 'in.l3a'], [39.8 + SH, 44.8 + SH, 'in.l3b']];
const SCAN = [[13.6, 'in.sc1'], [18.6, 'in.sc2'], [23.2, 'in.sc3'], [25.4, 'in.sc4'], [28, 'in.sc5']];
const END = 50.5 + SH;
let I = null; /* the running intro */
function $(id) { return document.getElementById(id); }
function smooth(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
function seg(t, a, b) { return smooth((t - a) / (b - a)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function v3(a, b, u) { return new T.Vector3(lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)); }

/* ---------- UI ---------- */
function ensureUI() {
  if ($('introUI')) return;
  const css = document.createElement('style'); css.textContent = `
#introUI { position: absolute; inset: 0; pointer-events: none; z-index: 30; }
#introUI > * { pointer-events: auto; }
#inFade { position: absolute; inset: 0; background: #000; opacity: 1; pointer-events: none !important; transition: none; }
#inSkip { position: absolute; top: 12px; right: 12px; font-size: 1.05em; background: rgba(11, 29, 42, .7); }
#inLang { position: absolute; top: 12px; left: 12px; display: flex; gap: 4px; }
#inLang button { background: rgba(11, 29, 42, .7); padding: 4px 10px; }
#inLang button[aria-pressed="true"] { border-color: #ffd166; box-shadow: inset 0 0 0 1px #ffd166; }
#inSub { position: absolute; left: 50%; bottom: 9%; transform: translateX(-50%); width: min(820px, calc(100% - 32px)); text-align: center; font-size: calc(26px * var(--ts, 1)); line-height: 1.35; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,.85), 0 0 2px #000; opacity: 0; pointer-events: none !important; font-family: var(--display, inherit); }
#inTitle { position: absolute; left: 50%; top: 40%; transform: translate(-50%, -50%); text-align: center; color: #fff; opacity: 0; pointer-events: none !important; text-shadow: 0 4px 18px rgba(0,0,0,.7); }
#inTitle h1 { font-size: clamp(34px, 6vw, 64px); margin: 0; font-family: var(--display, inherit); }
#inTitle p { font-size: 1.2em; margin: 6px 0 0; color: #ffd166; }
#inScan { position: absolute; top: 56px; left: 12px; min-width: 250px; max-width: calc(100% - 24px); padding: 8px 12px; border: 1px solid rgba(127, 240, 255, .6); border-radius: 10px; background: rgba(4, 20, 30, .62); color: #bff6ff; font-size: calc(15px * var(--ts, 1)); opacity: 0; pointer-events: none !important; }
#inScan b { color: #7ff0ff; display: block; margin-bottom: 4px; letter-spacing: .04em; } #inScan div { opacity: 0; transition: opacity .5s; } #inScan div.on { opacity: 1; } #inScan div::before { content: '✓ '; color: #7be0ad; }
#inBegin { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(5, 8, 20, .35); }
#inBegin .card { text-align: center; max-width: 440px; }
#inBegin h1 { margin: 0 0 4px; } #inBegin .primary { font-size: 1.3em; padding: 10px 28px; margin: 12px 0 4px; }`;
  document.head.appendChild(css);
  const ui = document.createElement('div'); ui.id = 'introUI'; ui.hidden = true;
  ui.innerHTML = '<div id="inFade"></div><div id="inScan" aria-hidden="true"></div><div id="inSub" aria-live="polite"></div><div id="inTitle"><h1></h1><p></p></div>' +
    '<div id="inLang" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="es">Español</button></div>' +
    '<button type="button" id="inSkip"></button><div id="inBegin" hidden><div class="card"><h1></h1><p class="dim tag"></p><button type="button" id="inGo" class="primary"></button><p class="dim sub"></p></div></div>';
  $('toast').parentNode.appendChild(ui);
  ui.addEventListener('click', function (e) {
    const b = e.target.closest('button'); if (!b) return; b.blur();
    if (b.id === 'inSkip') { finish(); return; }
    if (b.id === 'inGo') { begin(); return; }
    if (b.dataset.lang) { C.S.set.lang = b.dataset.lang; C.save(); text(); }
  });
}
function text() {
  $('inSkip').textContent = tx('in.skip');
  document.querySelectorAll('#inLang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === (C.S.set.lang || 'en'))); });
  $('inTitle').querySelector('h1').textContent = tx('in.title'); $('inTitle').querySelector('p').textContent = tx('in.tag');
  const bg = $('inBegin'); bg.querySelector('h1').textContent = tx('in.title'); bg.querySelector('.tag').textContent = tx('in.tag'); $('inGo').textContent = tx('in.begin'); bg.querySelector('.sub').textContent = tx('in.beginSub');
  $('inScan').innerHTML = '<b>' + C.esc(tx('in.scan')) + '</b>' + SCAN.map(function (x) { return '<div>' + C.esc(tx(x[1])) + '</div>'; }).join('');
  if (I) I.lastLine = null;
  const wb = $('btnIntro'); if (wb) wb.textContent = tx('in.watch');
}

/* ---------- textures made in code ---------- */
function hash3(x, y, z) { const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return v - Math.floor(v); }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = function (a, b, d) { return hash3(xi + a, yi + b, zi + d); };
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u), x10 = lerp(c(0, 1, 0), c(1, 1, 0), u), x01 = lerp(c(0, 0, 1), c(1, 0, 1), u), x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}
function fbm(x, y, z, oct) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); a *= 0.5; f *= 2.03; } return s; }
function earthTextures() {
  const W2 = 512, H2 = 256, cv = document.createElement('canvas'), cl = document.createElement('canvas'); cv.width = cl.width = W2; cv.height = cl.height = H2;
  const g = cv.getContext('2d'), gc = cl.getContext('2d'), im = g.createImageData(W2, H2), ic = gc.createImageData(W2, H2);
  for (let y = 0; y < H2; y++) {
    const lat = (0.5 - y / H2) * Math.PI, cy = Math.cos(lat), sy = Math.sin(lat);
    for (let x = 0; x < W2; x++) {
      const lon = x / W2 * Math.PI * 2, px = cy * Math.cos(lon), pz = cy * Math.sin(lon), py = sy, i = (y * W2 + x) * 4;
      const n = fbm(px * 1.6 + 3, py * 1.6 + 1, pz * 1.6 + 7, 5) - 0.565, al = Math.abs(lat) / (Math.PI / 2);
      let r, gg, b;
      if (al > 0.84 + (fbm(px * 4, py * 4, pz * 4, 2) - 0.5) * 0.1) { r = 236; gg = 244; b = 250; }
      else if (n > 0) { const dry = Math.max(0, 1 - Math.abs(al - 0.3) * 4) * 0.6 + fbm(px * 5, py * 5, pz * 5, 3) * 0.4, hi = Math.min(1, n * 6);
        r = lerp(70, 170, dry * 0.8) + hi * 30; gg = lerp(130, 150, dry) + hi * 10; b = lerp(62, 92, dry); }
      else { const sh = Math.max(0, 1 + n * 9); r = lerp(18, 40, sh); gg = lerp(70, 140, sh); b = lerp(150, 200, sh); }
      im.data[i] = r; im.data[i + 1] = gg; im.data[i + 2] = b; im.data[i + 3] = 255;
      const cn = fbm(px * 2.4 + 11, py * 3.2 + 5, pz * 2.4 + 2, 5), ca = Math.max(0, Math.min(1, (cn - 0.5) * 4.2));
      ic.data[i] = ic.data[i + 1] = ic.data[i + 2] = 255; ic.data[i + 3] = Math.round(ca * 235);
    }
  }
  g.putImageData(im, 0, 0); gc.putImageData(ic, 0, 0);
  return [new T.CanvasTexture(cv), new T.CanvasTexture(cl)];
}
function moonTex() { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const g = cv.getContext('2d'); g.fillStyle = '#b8b4ac'; g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(90,90,96,0.45)'; g.beginPath(); g.ellipse(hash3(i, 1, 1) * 256, 20 + hash3(i, 2, 2) * 88, 10 + hash3(i, 3, 3) * 26, 8 + hash3(i, 4, 4) * 16, 0, 0, 6.283); g.fill(); }
  for (let i = 0; i < 70; i++) { const x = hash3(i, 5, 5) * 256, y = hash3(i, 6, 6) * 128, r = 1.5 + hash3(i, 7, 7) * 6; g.strokeStyle = 'rgba(240,238,230,0.55)'; g.lineWidth = 1; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.stroke(); g.fillStyle = 'rgba(70,70,76,0.35)'; g.beginPath(); g.arc(x + 0.6, y + 0.6, r * 0.8, 0, 6.283); g.fill(); }
  return new T.CanvasTexture(cv); }
/* the Milky Way: two spiral arms of stars around a glowing core */
function buildGalaxy(g) {
  const n = C.S.set.low ? 10000 : 26000, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), c = new T.Color();
  const gauss = function (i, k) { return (hash3(i, k, 1) + hash3(i, k, 2) + hash3(i, k, 3) - 1.5) * 1.15; };
  for (let i = 0; i < n; i++) { const core = i % 5 === 0, r = core ? Math.pow(hash3(i, 9, 9), 1.8) * 70 : 30 + Math.pow(hash3(i, 8, 8), 0.8) * 260, arm = i % 2, a = core ? hash3(i, 7, 7) * 6.283 : r * 0.021 + arm * Math.PI + gauss(i, 4) * (0.28 + 18 / r);
    pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = gauss(i, 6) * (core ? 14 : 5) * (1 - r / 340); pos[i * 3 + 2] = Math.sin(a) * r;
    c.set(core ? (i % 3 ? '#ffe2b0' : '#fff4d8') : ['#cfe0ff', '#ffffff', '#aac8ff', '#ffd8e8', '#fff0c8'][i % 5]); const k = 0.45 + hash3(i, 10, 10) * 0.55; col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k; }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  g.add(new T.Points(geo, new T.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false })));
  /* a fine haze of millions of faint stars (drawn as many tiny dim points) */
  { const m = C.S.set.low ? 8000 : 22000, p2 = new Float32Array(m * 3); for (let i = 0; i < m; i++) { const r = 10 + Math.pow(hash3(i, 21, 3), 0.7) * 300, arm = i % 2, a = r * 0.021 + arm * Math.PI + gauss(i, 22) * 0.55; p2[i * 3] = Math.cos(a) * r; p2[i * 3 + 1] = gauss(i, 23) * 6 * (1 - r / 360); p2[i * 3 + 2] = Math.sin(a) * r; }
    const g2 = new T.BufferGeometry(); g2.setAttribute('position', new T.BufferAttribute(p2, 3)); g.add(new T.Points(g2, new T.PointsMaterial({ size: 1, sizeAttenuation: false, color: '#c8d4ff', transparent: true, opacity: 0.55, depthWrite: false }))); }
  g.add(C.glow('#ffe6b8', 170, 0.85)); g.add(C.glow('#fff6e0', 60, 1));
  for (let i = 0; i < 46; i++) { const arm = i % 2, r = 50 + (i / 46) * 230, a = r * 0.021 + arm * Math.PI + (hash3(i, 1, 3) - 0.5) * 0.3, s = C.glow(['#6a7ad8', '#b06ac0', '#5a9ad0', '#d08ab0'][i % 4], 60 + hash3(i, 2, 3) * 50, 0.18); s.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); g.add(s); }
  const sunAt = new T.Vector3(Math.cos(190 * 0.021 + 0.12) * 190, 0, Math.sin(190 * 0.021 + 0.12) * 190), here = C.glow('#fff2c0', 9, 1); here.position.copy(sunAt); g.add(here);
  return { sunAt: sunAt, here: here };
}
/* our solar system: the Sun, orbits, the habitable zone (green band), and the planets */
function buildSolar(g, tex) {
  const sun = new T.Mesh(new T.SphereGeometry(6, 32, 20), new T.MeshBasicMaterial({ color: '#ffd76a' })); g.add(sun); g.add(C.glow('#ffcf6a', 46, 0.9)); g.add(C.glow('#fff4c8', 18, 1));
  const hz = new T.Mesh(new T.RingGeometry(23, 32, 96), new T.MeshBasicMaterial({ color: '#5fe0a0', transparent: true, opacity: 0.16, side: T.DoubleSide, depthWrite: false })); hz.rotation.x = -Math.PI / 2; g.add(hz);
  const P = [[14, 0.8, '#a8a29a', 1.6], [20, 1.3, '#e8d2a0', 1.2], [27, 1.5, null, 1], [34, 1.05, '#c8643a', 0.8], [52, 4.2, 'band', 0.42], [70, 3.4, '#e0c890', 0.32]], planets = [];
  P.forEach(function (p, i) { const ob = new T.Mesh(new T.RingGeometry(p[0] - 0.08, p[0] + 0.08, 128), new T.MeshBasicMaterial({ color: '#7f9fc8', transparent: true, opacity: 0.35, side: T.DoubleSide, depthWrite: false })); ob.rotation.x = -Math.PI / 2; g.add(ob);
    const m = new T.Mesh(new T.SphereGeometry(p[1], 24, 16), p[2] === null ? new T.MeshLambertMaterial({ map: tex[0], emissive: '#0a1830' }) : p[2] === 'band' ? new T.MeshLambertMaterial({ map: bandTex() }) : new T.MeshLambertMaterial({ color: p[2] })); g.add(m);
    if (i === 5) { const rg = new T.Mesh(new T.RingGeometry(4.4, 6.8, 48), new T.MeshBasicMaterial({ color: '#e8cfa0', transparent: true, opacity: 0.55, side: T.DoubleSide })); rg.rotation.x = -1.2; m.add(rg); }
    planets.push({ m: m, r: p[0], w: p[3], a: i * 1.7 + 0.6 }); });
  const mark = new T.Mesh(new T.RingGeometry(2.6, 3.0, 40), new T.MeshBasicMaterial({ color: '#7ff0ff', transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide })); g.add(mark);
  const light = new T.PointLight('#fff2d8', 1.6, 0); g.add(light);
  return { planets: planets, earth: planets[2].m, mark: mark };
}
function gradTex(stops) { const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256; const g = cv.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); }); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); return new T.CanvasTexture(cv); }
function bandTex() { const cv = document.createElement('canvas'); cv.width = 4; cv.height = 128; const g = cv.getContext('2d'); for (let y = 0; y < 128; y++) { const k = Math.sin(y * 0.35) * 0.5 + Math.sin(y * 0.9 + 1) * 0.3; g.fillStyle = 'rgb(' + Math.round(210 + k * 30) + ',' + Math.round(160 + k * 30) + ',' + Math.round(110 + k * 25) + ')'; g.fillRect(0, y, 4, 1); } return new T.CanvasTexture(cv); }

/* ---------- the ship and the two sets (space, meadow) ---------- */
function saucer() {
  const g = new T.Group(), body = new T.Mesh(C.G.sph, new T.MeshPhongMaterial({ color: '#c8d6e0', emissive: '#22303a', shininess: 90 })); body.scale.set(2.4, 0.5, 2.4); g.add(body);
  const dome = new T.Mesh(C.G.sph, new T.MeshPhongMaterial({ color: '#8ff0ff', emissive: '#1a5a6a', transparent: true, opacity: 0.75, shininess: 120 })); dome.scale.set(1, 0.85, 1); dome.position.y = 0.35; g.add(dome);
  g.userData.lights = [];
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, l = new T.Mesh(C.G.sph, C.basic(['#ffd166', '#7be0ad', '#c59cff', '#7fd4ff'][i % 4])); l.scale.setScalar(0.16); l.position.set(Math.cos(a) * 2.2, -0.05, Math.sin(a) * 2.2); g.add(l); g.userData.lights.push(l); }
  const under = C.glow('#9fe8ff', 4, 0.6); under.position.y = -0.5; g.add(under); g.userData.under = under;
  return g;
}
function buildSpace(g) {
  const n = C.S.set.low ? 1200 : 2600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), c = new T.Color();
  for (let i = 0; i < n; i++) { const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, r = 420 + Math.random() * 200, s = Math.sqrt(1 - u * u);
    pos[i * 3] = Math.cos(a) * s * r; pos[i * 3 + 1] = u * r; pos[i * 3 + 2] = Math.sin(a) * s * r;
    c.set(['#ffffff', '#cfe3ff', '#fff2cf', '#ffd9d0'][i % 4]); const k = 0.5 + Math.random() * 0.5; col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k; }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const stars = new T.Points(geo, new T.PointsMaterial({ size: 1.7, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false })); g.add(stars);
  [['#7a4ad0', -180, 90, -420, 260], ['#d04a9a', 160, -60, -460, 240], ['#3a7ad0', 40, 140, -500, 300], ['#2ab0a0', -260, -120, -380, 200], ['#c05a3a', 280, 120, -300, 180]].forEach(function (nb) { const s = C.glow(nb[0], nb[4], 0.35); s.position.set(nb[1], nb[2], nb[3]); g.add(s); });
  const moon = new T.Mesh(new T.SphereGeometry(7, 32, 20), new T.MeshLambertMaterial({ map: moonTex() })); moon.position.set(46, 7, -150); g.add(moon); /* the camera passes close to the Moon on the way in */
  /* Earth: a real satellite-style picture of Earth (earthtex.js) with drifting clouds and a thin blue atmosphere; drawn in code if that file is missing */
  const real = window.FG_EARTH, L = new T.TextureLoader(), tex = real ? [L.load(real.day), L.load(real.clouds)] : earthTextures(), earth = new T.Group();
  const ball = new T.Mesh(new T.SphereGeometry(70, 64, 40), new T.MeshPhongMaterial({ map: tex[0], shininess: 40, specular: '#141c26' })); earth.add(ball);
  const clouds = new T.Mesh(new T.SphereGeometry(71.2, 64, 40), real ? new T.MeshLambertMaterial({ color: '#ffffff', alphaMap: tex[1], transparent: true, depthWrite: false }) : new T.MeshLambertMaterial({ map: tex[1], transparent: true, depthWrite: false })); earth.add(clouds);
  const atm = new T.Mesh(new T.SphereGeometry(73.5, 48, 32), new T.ShaderMaterial({ transparent: true, depthWrite: false, side: T.BackSide, blending: T.AdditiveBlending,
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; void main() { float k = pow(clamp(1.0 + dot(vN, vV) * 1.0, 0.0, 1.0), 3.0); gl_FragColor = vec4(0.35, 0.65, 1.0, 1.0) * k * 1.1; }' })); earth.add(atm);
  const halo = C.glow('#6ab8ff', 190, 0.35); earth.add(halo); halo.position.z = -10;
  earth.position.set(60, -14, -440); earth.rotation.z = 0.41; g.add(earth); /* Earth's tilt is about 23 degrees */
  const ship = saucer(); ship.scale.setScalar(0.9); g.add(ship);
  const streak = C.glow('#ffffff', 3, 0.9); streak.scale.set(18, 0.6, 1); streak.visible = false; g.add(streak);
  return { stars: stars, earth: earth, ball: ball, clouds: clouds, ship: ship, streak: streak, tex: tex };
}
function hills(x, z) { const d = Math.hypot(x, z); let h = 2.2 * Math.sin(x * 0.045) * Math.cos(z * 0.05) + 1.4 * Math.sin((x + z) * 0.03); h *= Math.min(1, Math.max(0, (d - 10) / 30)); h += Math.max(0, d - 90) * 0.35; return h; }
function buildMeadow(g) {
  const sky = new T.Mesh(new T.SphereGeometry(520, 32, 16), new T.MeshBasicMaterial({ map: gradTex([[0, '#3d6fb8'], [0.38, '#8fb4e0'], [0.5, '#ffcf96'], [0.56, '#f5a86a'], [1, '#7a5a4a']]), side: T.BackSide, fog: false, depthWrite: false })); g.add(sky);
  const sun = C.glow('#ffe0a0', 160, 0.95); sun.position.set(-160, 26, -420); sun.material.fog = false; g.add(sun); const sun2 = C.glow('#fff6d8', 45, 1); sun2.position.copy(sun.position); sun2.material.fog = false; g.add(sun2);
  const geo = new T.PlaneGeometry(420, 420, 90, 90); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position, cols = new Float32Array(p.count * 3), c = new T.Color();
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), h = hills(x, z); p.setY(i, h); const k = hash3(Math.floor(x), 0, Math.floor(z));
    c.set(h > 14 ? '#6a7a5a' : '#5f9a44').lerp(new T.Color('#9ac25a'), k * 0.45); if (Math.hypot(x + 14, z + 10) < 9) c.set('#8a7a50'); cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new T.BufferAttribute(cols, 3)); geo.computeVertexNormals();
  g.add(new T.Mesh(geo, new T.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
  const water = new T.Mesh(new T.CircleGeometry(7.5, 40), new T.MeshPhongMaterial({ color: '#4a8ac8', emissive: '#10304a', shininess: 120, specular: '#ffe8c0', transparent: true, opacity: 0.88 })); water.rotation.x = -Math.PI / 2; water.position.set(-14, hills(-14, -10) + 0.12, -10); g.add(water);
  /* trees and mountains */
  const trunkG = new T.CylinderGeometry(0.25, 0.35, 1, 6), leafG = new T.ConeGeometry(1, 2, 7), trunks = [], leaves = [], lcols = [];
  for (let i = 0; i < 140; i++) { const a = hash3(i, 1, 2) * Math.PI * 2, r = 16 + hash3(i, 3, 4) * 120, x = Math.cos(a) * r, z = Math.sin(a) * r - 20; if (Math.hypot(x + 14, z + 10) < 10 || Math.hypot(x, z - 4) < 24 || (x > -8 && x < 30 && z > -6 && z < 40)) continue; const s = 1.4 + hash3(i, 5, 6) * 1.6, y = hills(x, z);
    trunks.push([x, y + s * 0.6, z, s, s * 1.2, s]); leaves.push([x, y + s * 2.4, z, s * 1.5, s * 1.6, s * 1.5]); lcols.push(['#2f6a3a', '#3a7a40', '#4a8a3a', '#2a5a34'][i % 4]); }
  const inst = function (geo2, mat, list, cl) { const im = new T.InstancedMesh(geo2, mat, list.length), o = new T.Object3D(), cc = new T.Color(); list.forEach(function (it, i) { o.position.set(it[0], it[1], it[2]); o.scale.set(it[3], it[4], it[5]); o.updateMatrix(); im.setMatrixAt(i, o.matrix); if (cl) im.setColorAt(i, cc.set(cl[i])); }); return im; };
  g.add(inst(trunkG, new T.MeshLambertMaterial({ color: '#6a4a30' }), trunks)); g.add(inst(leafG, new T.MeshLambertMaterial({ color: '#ffffff', flatShading: true }), leaves, lcols));
  const mts = []; for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r = 240 + hash3(i, 9, 9) * 40, s = 30 + hash3(i, 7, 7) * 40; mts.push([Math.cos(a) * r, s * 0.6, Math.sin(a) * r, s * 1.7, s * 1.0, s * 1.7]); }
  g.add(inst(new T.ConeGeometry(1, 1.6, 6), new T.MeshLambertMaterial({ color: '#6a7aa6', flatShading: true }), mts));
  const fl = [], fc = [], stems = []; for (let i = 0; i < 260; i++) { const a = hash3(i, 11, 3) * Math.PI * 2, r = 4 + hash3(i, 13, 5) * 40, x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x + 14, z + 10) < 8.5) continue; fl.push([x, hills(x, z) + 0.42, z, 0.11, 0.05, 0.11]); stems.push([x, hills(x, z) + 0.2, z, 0.025, 0.42, 0.025]); fc.push(['#ffd166', '#ff8fb1', '#ffffff', '#c59cff', '#ff9f6e'][i % 5]); }
  g.add(inst(new T.IcosahedronGeometry(1, 0), new T.MeshLambertMaterial({ color: '#ffffff' }), fl, fc)); g.add(inst(new T.CylinderGeometry(1, 1, 1, 4), new T.MeshLambertMaterial({ color: '#4a8a34' }), stems));
  const ship = saucer(); g.add(ship);
  const beam = new T.Mesh(new T.CylinderGeometry(0.9, 2.2, 1, 24, 1, true), new T.MeshBasicMaterial({ color: '#9fe8ff', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); g.add(beam);
  const me = C.buildAlien(C.S.alien); me.scale.setScalar(0.001); g.add(me);
  /* a flock of gulls and crows overhead, and real butterflies in the meadow (creatures.js); simple shapes only if that file is missing */
  const CR = BQ.creatures, birds = [], flies = [];
  for (let i = 0; i < 6; i++) { let b;
    if (CR) { b = CR.makeBird(i % 3 === 2 ? 'crow' : 'gull'); b.g.scale.setScalar(3); b.g.userData.ph = i; g.add(b.g); birds.push(b); }
    else { const o = new T.Group(); [-1, 1].forEach(function (sd) { const w = new T.Mesh(C.G.box, C.basic('#2a2a3a')); w.scale.set(0.9, 0.06, 0.25); w.position.x = sd * 0.42; o.add(w); }); o.userData.ph = i; g.add(o); birds.push({ g: o, box: 1 }); } }
  const BFK = ['monarch', 'swallowtail', 'cabbage', 'admiral', 'azure', 'monarch', 'swallowtail'];
  for (let i = 0; i < 7; i++) { let f;
    if (CR) { f = CR.makeButterfly(BFK[i]); f.g.scale.multiplyScalar(0.8); f.freqVar = Math.random(); }
    else f = { g: C.glow(['#ffd166', '#ff8fb1', '#c59cff'][i % 3], 0.7, 0.9) };
    f.g.userData.ph = i * 0.9; g.add(f.g); flies.push(f); }
  return { ship: ship, beam: beam, me: me, birds: birds, flies: flies, water: water, gy: hills(0, 0) };
}

/* ---------- play ---------- */
function play() {
  ensureUI(); if (I) return;
  C.teardown(); C.show(null); C.setMode('intro'); C.Music.stop();
  ['hud', 'touch', 'toast', 'qpanel', 'cozyUI'].forEach(function (id) { const e = $(id); if (e) e.hidden = true; });
  const scene = C.scene;
  I = { t: 0, run: false, g: new T.Group(), bg: scene.background, fog: scene.fog, lights: [C.HEMI.intensity, C.HEMI.color.clone(), C.HEMI.groundColor.clone(), C.KEYL.intensity, C.KEYL.color.clone(), C.KEYL.position.clone()], part: 0, lastLine: null, said: {} };
  I.space = new T.Group(); I.meadow = new T.Group(); I.g.add(I.space); I.g.add(I.meadow); I.meadow.visible = false;
  I.A = buildSpace(I.space); I.B = buildMeadow(I.meadow);
  I.gal = new T.Group(); I.sol = new T.Group(); I.g.add(I.gal); I.g.add(I.sol); I.Gx = buildGalaxy(I.gal); I.Sx = buildSolar(I.sol, I.A.tex); I.gal.visible = I.sol.visible = false;
  scene.add(I.g); setSet(0);
  $('introUI').hidden = false; text(); $('inSub').style.opacity = 0; $('inTitle').style.opacity = 0; $('inFade').style.opacity = 1; $('inFade').style.background = '#000';
  frame(0);
  if (C.Music.gesture) begin(); else { $('inBegin').hidden = false; setTimeout(function () { const b = $('inGo'); if (b) b.focus(); }, 60); }
}
function begin() {
  if (!I) return; $('inBegin').hidden = true; I.run = true; C.Music.gesture = true;
  if (BQ.amb) { BQ.amb.mood('space', 2); BQ.amb.sfx('ship', 0.7); }
  setTimeout(function () { const b = $('inSkip'); if (b && I) b.focus(); }, 60);
}
function setSet(n) {
  const scene = C.scene; I.part = n;
  if (n === 0) { I.space.visible = true; I.meadow.visible = false; scene.background = new T.Color('#03040c'); scene.fog = null;
    C.HEMI.color.set('#8aa0ff'); C.HEMI.groundColor.set('#100818'); C.HEMI.intensity = 0.35; C.KEYL.color.set('#fff4e0'); C.KEYL.intensity = 1.25; C.KEYL.position.set(-200, 60, 120); }
  else { I.space.visible = false; I.meadow.visible = true; scene.background = new T.Color('#f2c08a'); scene.fog = new T.FogExp2('#f0c49a', 0.0048);
    C.HEMI.color.set('#ffe2b8'); C.HEMI.groundColor.set('#3e5a32'); C.HEMI.intensity = 0.95; C.KEYL.color.set('#ffcf8a'); C.KEYL.intensity = 1.05; C.KEYL.position.set(-160, 40, -300);
    if (BQ.amb) { BQ.amb.mood('arrival', 4); BQ.amb.env('wind', 0.25); BQ.amb.env('birds', 0.5); } }
}
function frame(t0) {
  const cam = C.cam, A = I.A, B = I.B;
  /* scanner readout (the biologist's own instruments) */
  { const sc = $('inScan'); sc.style.opacity = t0 > 13.2 && t0 < 34.6 ? Math.min(1, (t0 - 13.2) / 0.6, (34.6 - t0) / 0.6) : 0; const rows = sc.querySelectorAll('div'); SCAN.forEach(function (x, i) { if (rows[i]) rows[i].classList.toggle('on', t0 >= x[0]); }); }
  if (t0 < SH) { prologue(t0); subs(t0); return; }
  if (I.gal.visible || I.sol.visible || !I.A.earth.visible) { I.gal.visible = I.sol.visible = false; I.A.earth.parent.children.forEach(function (o) { o.visible = true; }); I.A.streak.visible = false; I.A.ship.scale.setScalar(0.9); }
  const t = t0 - SH;
  if (t < 16.4) {
    if (I.part !== 0) setSet(0);
    A.earth.rotation.y = t * 0.02; A.clouds.rotation.y = t * 0.012; A.stars.rotation.y = t * 0.004;
    const u1 = seg(t, 0, 7), u2 = seg(t, 6, 16.2);
    const cp = t < 7 ? v3([0, 4, 90], [4, 2, 30], u1) : v3([4, 2, 30], [38, -8, -250], u2);
    const look = t < 7 ? v3([0, 0, -100], [20, -6, -300], u1) : v3([20, -6, -300], [60, -14, -440], u2);
    cam.position.copy(cp); cam.lookAt(look);
    const sp = t < 6 ? v3([-40, -14, 40], [6, 0, -40], seg(t, 0.4, 6)) : v3([6, 0, -40], [56, -12, -362], seg(t, 6, 16));
    A.ship.position.copy(sp); A.ship.rotation.y += 0.04; A.ship.rotation.z = 0.25 - 0.2 * seg(t, 0, 8); A.ship.userData.lights.forEach(function (l, i) { l.visible = Math.floor(t * 6 + i) % 3 !== 0; });
    A.ship.scale.setScalar(0.9 * (1 - seg(t, 13, 16) * 0.85));
    A.streak.visible = t > 3.5 && t < 5.2; if (A.streak.visible) { const k = (t - 3.5) / 1.7; A.streak.position.set(lerp(-160, 120, k), lerp(110, 40, k), -320); A.streak.material.opacity = Math.sin(k * Math.PI); }
    $('inFade').style.background = t > 14 ? '#ffffff' : '#000'; $('inFade').style.opacity = t < 1.2 ? 1 - seg(t, 0, 1.2) : t > 14.6 ? seg(t, 14.6, 16.4) : 0;
  } else {
    if (I.part !== 1) setSet(1);
    const gy = B.gy, ship = B.ship, me = B.me;
    $('inFade').style.background = t > 47 ? '#000' : '#ffffff'; $('inFade').style.opacity = t < 18.5 ? 1 - seg(t, 16.4, 18.5) : t > 47.5 ? seg(t, 47.5, END - SH - 0.3) : 0;
    /* the ship glides down and lands */
    const land = seg(t, 16.4, 23), sp = v3([-70, 70, -150], [0, gy + 3.2, 0], land); sp.y += Math.sin(t * 2) * 0.12 * (1 - seg(t, 22, 23));
    if (t > 31) sp.y = lerp(gy + 3.2, gy + 70, seg(t, 41, 47)), sp.x = lerp(0, 40, seg(t, 41, 47));
    ship.position.copy(sp); ship.rotation.y += 0.03; ship.rotation.z = 0.3 * (1 - land); ship.userData.lights.forEach(function (l, i) { l.visible = Math.floor(t * 6 + i) % 3 !== 0; });
    const beamOn = seg(t, 23, 23.6) * (1 - seg(t, 25.4, 26.4)); B.beam.material.opacity = 0.42 * beamOn; B.beam.visible = beamOn > 0.01; B.beam.scale.set(1, 3, 1); B.beam.position.set(0, gy + 1.6, 0);
    if (t > 23 && !I.said.beam) { I.said.beam = 1; if (BQ.amb) BQ.amb.sfx('beam', 0.8); }
    /* the alien appears in the beam and steps forward */
    const ap = seg(t, 23.8, 25.2); me.scale.setScalar(Math.max(0.001, 1.25 * ap));
    const walk = seg(t, 25.4, 28); me.position.set(0, gy + (1 - ap) * 1.4, lerp(0.6, 5.5, walk));
    const legs = me.userData.legs; if (legs) legs.forEach(function (h, i) { h.rotation.x = (t > 25.4 && t < 28) ? Math.sin(t * 9 + i * Math.PI) * 0.6 : 0; });
    me.rotation.y = t < 28 ? 0 : t < 33 ? Math.sin((t - 28) * 1.3) * 0.8 : lerp(Math.sin(5 * 1.3) * 0.8, 0.5, seg(t, 33, 35));
    if (t > 28 && t < 33) me.position.y += Math.abs(Math.sin(t * 3)) * 0.05;
    if (me.userData.tents) me.userData.tents.forEach(function (tt, i) { tt.rotation.z = Math.sin(t * 3 + i) * 0.2; });
    /* camera: follow the ship down, meet the alien, orbit slowly, then rise to the sunset */
    const ax = me.position.x, ay = me.position.y + 1.2, az = me.position.z;
    let cp, look;
    if (t < 23.5) { cp = v3([30, 26, 50], [9, gy + 4, 16], seg(t, 16.4, 23.5)); look = ship.position.clone(); }
    else if (t < 30) { cp = v3([9, gy + 4, 16], [3.5, gy + 2.6, 11], seg(t, 23.5, 29)); look = v3([0, gy + 2.4, 0], [ax, ay, az], seg(t, 23.5, 27)); }
    else if (t < 44.5) { const a = lerp(0.35, 2.2, seg(t, 30, 44.5)), r = lerp(6, 8.5, seg(t, 30, 44.5)); cp = new T.Vector3(ax + Math.sin(a) * r, ay + 1.4 + seg(t, 38, 44.5) * 1.2, az + Math.cos(a) * r); look = new T.Vector3(ax, ay, az); }
    else { const a = 2.2, r = 8.5, base = new T.Vector3(ax + Math.sin(a) * r, ay + 2.6, az + Math.cos(a) * r); cp = base.clone().lerp(new T.Vector3(ax + 14, ay + 18, az + 26), seg(t, 44.5, END - SH)); look = new T.Vector3(ax, ay, az).lerp(new T.Vector3(-160, 30, -420), seg(t, 44.5, END - SH)); }
    cam.position.copy(cp); cam.lookAt(look);
    const dtI = Math.min(0.1, Math.max(0, t - (B.lastT || t))); B.lastT = t;
    B.birds.forEach(function (b, i) { const k = ((t * 0.05 + i * 0.13) % 1); b.g.position.set(lerp(-120, 120, k), 34 + i * 2 + Math.sin(t + i) * 1.5, -60 - i * 6);
      if (b.box) { b.g.rotation.y = -Math.PI / 2; b.g.children.forEach(function (w, j) { w.rotation.z = (j ? -1 : 1) * Math.sin(t * 7 + i) * 0.5; }); return; }
      b.g.rotation.set(0, Math.PI / 2, -Math.cos(t + i) * 0.12); const flap = Math.sin(t * 0.6 + i * 1.7) > -0.2; BQ.creatures.poseBird(b, dtI, flap ? 'flap' : 'glide', 0.7, 0); });
    B.flies.forEach(function (f, i) { const ph = f.g.userData.ph, P = function (tt) { return [Math.sin(tt * 0.5 + ph) * 7 + Math.sin(tt * 3 + ph) * 0.5, gy + 1.2 + Math.sin(tt * 2 + ph) * 0.4, 4 + Math.cos(tt * 0.4 + ph) * 6]; };
      const p = P(t), q = P(t + 0.05); f.g.position.set(p[0], p[1], p[2]);
      if (f.wings) { f.g.rotation.set(0, Math.atan2(q[0] - p[0], q[2] - p[2]), 0); BQ.creatures.poseButterfly(f, dtI, 'fly'); } });
    $('inTitle').style.opacity = t < 45 ? 0 : t < 47.5 ? seg(t, 45, 46.5) : 1 - seg(t, 48.5, END - SH - 0.2);
  }
  subs(t0);
}
/* the first 20 seconds: the long search through the Milky Way, then our solar system */
function prologue(t) {
  const cam = C.cam, A = I.A, sol = I.sol, gal = I.gal;
  if (I.part !== 0) setSet(0);
  A.earth.visible = A.ship.visible = true; I.A.earth.parent.children.forEach(function (o) { if (o !== A.stars && o !== A.ship) o.visible = false; });
  A.ship.userData.lights.forEach(function (l, i) { l.visible = Math.floor(t * 6 + i) % 3 !== 0; }); A.ship.rotation.y += 0.04;
  if (t < 12.6) { gal.visible = true; sol.visible = false; A.stars.visible = false; gal.rotation.y = t * 0.012;
    const S = I.Gx.sunAt.clone().applyAxisAngle(new T.Vector3(0, 1, 0), gal.rotation.y), u = seg(t, 0, 12.6);
    const cp = v3([-60, 300, 420], [S.x + 18, 10, S.z + 34], Math.pow(u, 1.6)), look = new T.Vector3(0, 0, 0).lerp(S, seg(t, 3, 11.5));
    cam.position.copy(cp); cam.lookAt(look); I.Gx.here.material.opacity = 0.6 + 0.4 * Math.sin(t * 4) * seg(t, 7, 9);
    const fw = look.clone().sub(cp).normalize(); A.ship.position.copy(cp).addScaledVector(fw, 16).add(new T.Vector3(0, -3.2, 0)); A.ship.scale.setScalar(0.55); A.ship.rotation.z = 0.15;
    $('inFade').style.background = '#000'; $('inFade').style.opacity = t < 2 ? 1 - seg(t, 0, 2) : t > 11.8 ? seg(t, 11.8, 12.6) : 0;
  } else {
    gal.visible = false; sol.visible = true; A.stars.visible = true; const X = I.Sx;
    X.planets.forEach(function (p) { p.a += 0.004 * p.w; p.m.position.set(Math.cos(p.a) * p.r, 0, Math.sin(p.a) * p.r); p.m.rotation.y = t * 0.3; });
    const E = X.earth.position, u = seg(t, 12.6, 20);
    const uu = Math.pow(seg(t, 12.6, 19.6), 1.8), cp = v3([-20, 70, 95], [E.x + 3.5, E.y + 1.6, E.z + 6], uu).add(new T.Vector3(0, Math.sin(uu * Math.PI) * 22, 0)), look = new T.Vector3(0, 0, 0).lerp(E, seg(t, 15.5, 18.5));
    cam.position.copy(cp); cam.lookAt(look);
    X.mark.position.copy(E); X.mark.lookAt(cam.position); X.mark.material.opacity = seg(t, 17.6, 18.3) * (0.6 + 0.3 * Math.sin(t * 6)) * (1 - seg(t, 19.2, 19.7)); X.mark.scale.setScalar(1 + 0.1 * Math.sin(t * 6));
    const fw = look.clone().sub(cp).normalize(); A.ship.position.copy(cp).addScaledVector(fw, 9).add(new T.Vector3(0, -1.8, 0)); A.ship.scale.setScalar(0.2 * (1 - seg(t, 18.6, 19.8) * 0.7)); A.ship.rotation.z = 0.2;
    $('inFade').style.background = '#000'; $('inFade').style.opacity = t < 13.4 ? 1 - seg(t, 12.6, 13.4) : t > 19.3 ? seg(t, 19.3, 20) : 0;
  }
}
function subs(t) {
  { const onWhite = t > 35 && t < SH + 18.4, sb = $('inSub'); sb.style.color = onWhite ? '#0b1d2a' : ''; sb.style.textShadow = onWhite ? '0 0 10px rgba(255,255,255,.95), 0 0 2px #fff' : ''; }
  const ln = LINES.find(function (l) { return t >= l[0] && t <= l[1]; });
  const sub = $('inSub'); if (ln) { if (I.lastLine !== ln[2] + C.S.set.lang) { I.lastLine = ln[2] + C.S.set.lang; sub.textContent = tx(ln[2]); } sub.style.opacity = Math.min(1, (t - ln[0]) / 0.5, (ln[1] - t) / 0.5); } else sub.style.opacity = 0;
}
function step(dt) {
  if (!I) return;
  if (I.run) I.t += dt * (I.speed || 1);
  frame(I.t);
  if (I.t >= END) finish();
}
function finish() {
  if (!I) return; const scene = C.scene, l = I.lights;
  scene.remove(I.g); C.disposeGroup(I.g); I.A.tex.forEach(function (x) { x.dispose(); });
  scene.background = I.bg; scene.fog = I.fog; C.HEMI.intensity = l[0]; C.HEMI.color.copy(l[1]); C.HEMI.groundColor.copy(l[2]); C.KEYL.intensity = l[3]; C.KEYL.color.copy(l[4]); C.KEYL.position.copy(l[5]);
  I = null; C.S.introSeen = 1; C.save();
  $('introUI').hidden = true; $('inBegin').hidden = true;
  if (BQ.amb) BQ.amb.stop(1.2);
  C.setMode('menu'); C.menuScene();
  setTimeout(function () { const b = $('btnPlay'); if (b && !b.closest('[hidden]')) b.focus(); }, 80);
}
function key(e, down) {
  if (!I || !down) return;
  if (e.key === 'Escape') { e.preventDefault(); finish(); return; }
  if (!I.run && (e.key === 'Enter' || e.key === ' ') && !(e.target && e.target.tagName === 'BUTTON')) { e.preventDefault(); begin(); }
}
/* menu button: Watch intro again */
(function () {
  const row = document.querySelector('#menu .btns'); if (row && !$('btnIntro')) { const b = document.createElement('button'); b.type = 'button'; b.id = 'btnIntro'; b.textContent = tx('in.watch'); b.onclick = function () { play(); }; row.appendChild(b); }
})();
BQ.intro = { play: play, step: step, key: key, skip: finish, _i: function () { return I; } };
if (!C.S.introSeen && !/level-/i.test(location.hash || '') && !/nointro/i.test(location.hash || '')) play();
}
if (BQ.core) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

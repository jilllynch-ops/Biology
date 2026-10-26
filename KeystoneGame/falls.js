/* Earthling Field Guide: HEMLOCK FALLS (part of cozy mode, uses the hiking system in coast.js).
   A Pennsylvania old-growth hemlock gorge, like the falls at Ricketts Glen: a spring pond on a rock shelf feeds a little creek
   that runs to the edge and pours down two rock ledges into a round plunge pool, then flows away down the gorge.
   Hemlocks, rhododendron, ferns and mossy boulders; brook trout in the pool, crayfish under stones, mayfly nymphs on a riffle rock,
   and an eastern hellbender hiding under a big flat rock. Water only ever flows downhill. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
if (!BQ.coast || !BQ.coast.lib) return;
const C = BQ.core, T = C.T, tx = C.tx, L = BQ.coast.lib;

const EN = {
  falls: ['Hemlock Falls', 'Over thousands of years, falling water has worn away softer rock from under harder rock ledges, so the falls slowly move upstream. The water\'s force also digs the deep plunge pool at the bottom. This wearing away of rock is called erosion.'],
  hemlock: ['Eastern hemlock', 'The eastern hemlock is Pennsylvania\'s state tree. Its deep shade keeps streams cool, and cool water holds more dissolved oxygen for fish. A tiny invasive insect, the hemlock woolly adelgid, now threatens many hemlocks.'],
  trout: ['Brook trout', 'The brook trout is Pennsylvania\'s state fish. It needs cold, clean water with lots of oxygen, so finding brook trout is a sign of a healthy stream.'],
  hellbender: ['Eastern hellbender', 'The hellbender is a giant salamander, Pennsylvania\'s state amphibian, up to about 60 cm long. It hides under big flat rocks and breathes mostly through its wrinkly skin, so it needs clean, cold, fast-flowing water.'],
  crayfish: ['Crayfish', 'Crayfish hide under stones by day. They eat bits of dead plants and animals, and they are food for trout, herons and hellbenders, linking the stream\'s food web together.'],
  mayfly: ['Mayfly nymphs', 'Young mayflies (nymphs) cling to rocks in fast water. Most kinds cannot live in polluted water, so scientists count them to check a stream\'s health. An animal used this way is a bioindicator.'],
  rhodo: ['Great rhododendron', 'Great rhododendron grows in shady, damp ravines like this one. Its thick, leathery leaves stay green all winter, and it blooms with pale pink flowers in early summer.'],
  moss: ['Moss and ferns', 'Mosses and ferns cover the wet rocks. Neither makes seeds: they spread by tiny spores, and they need moisture to reproduce, so they grow best in the spray near the falls.'],
  spring: ['The spring', 'Rain and snowmelt soak into the ground and become groundwater. Here the groundwater flows back out of the ground as a spring, and it feeds the creek that runs over the falls.']
};
const ES = {
  falls: ['Cascada Hemlock', 'Durante miles de años, el agua que cae ha desgastado la roca más blanda que hay debajo de las repisas de roca dura, así que la cascada retrocede poco a poco río arriba. La fuerza del agua también excava la poza profunda del fondo. Este desgaste de la roca se llama erosión.'],
  hemlock: ['Tsuga del este', 'La tsuga del este (hemlock) es el árbol estatal de Pensilvania. Su sombra profunda mantiene frescos los arroyos, y el agua fría guarda más oxígeno disuelto para los peces. Un insecto invasor diminuto, el adélgido lanudo, ahora amenaza a muchas tsugas.'],
  trout: ['Trucha de arroyo', 'La trucha de arroyo es el pez estatal de Pensilvania. Necesita agua fría y limpia con mucho oxígeno, así que encontrar truchas de arroyo es señal de un arroyo sano.'],
  hellbender: ['Salamandra gigante (hellbender)', 'El hellbender es una salamandra gigante, el anfibio estatal de Pensilvania, de hasta unos 60 cm de largo. Se esconde bajo rocas grandes y planas y respira sobre todo por su piel arrugada, así que necesita agua limpia, fría y que corra rápido.'],
  crayfish: ['Cangrejo de río', 'Los cangrejos de río se esconden bajo las piedras durante el día. Comen restos de plantas y animales muertos, y son alimento de truchas, garzas y hellbenders, uniendo la red alimentaria del arroyo.'],
  mayfly: ['Ninfas de efímera', 'Las efímeras jóvenes (ninfas) se aferran a las rocas en el agua rápida. La mayoría no puede vivir en agua contaminada, así que los científicos las cuentan para revisar la salud de un arroyo. Un animal que se usa así es un bioindicador.'],
  rhodo: ['Rododendro gigante', 'El rododendro gigante crece en barrancos sombríos y húmedos como este. Sus hojas gruesas y correosas siguen verdes todo el invierno, y florece con flores rosa pálido a principios del verano.'],
  moss: ['Musgo y helechos', 'El musgo y los helechos cubren las rocas mojadas. Ninguno forma semillas: se propagan por esporas diminutas y necesitan humedad para reproducirse, así que crecen mejor con la brisa de agua cerca de la cascada.'],
  spring: ['El manantial', 'La lluvia y la nieve derretida se filtran en el suelo y se convierten en agua subterránea. Aquí el agua subterránea vuelve a salir del suelo como un manantial, y alimenta el arroyo que cae por la cascada.']
};
Object.keys(EN).forEach(function (k) { C.I18N.en['fd.n.hf_' + k] = EN[k][0]; C.I18N.en['fd.d.hf_' + k] = EN[k][1]; C.I18N.es['fd.n.hf_' + k] = ES[k][0]; C.I18N.es['fd.d.hf_' + k] = ES[k][1]; });
Object.assign(C.I18N.en, { 'hf.title': 'Hemlock Falls', 'hf.down': 'Hiking into the hemlock gorge…', 'hf.up': 'Hiking back to Willow Creek…', 'hf.back': 'Hike back to',
  'hf.welcome': 'Hemlock Falls: an old-growth hemlock gorge like the ones in Pennsylvania\'s mountains. Explore: when you get close to an animal, plant or place, the alien scans it into your Field Guide. The trail on the right climbs to the top of the falls.', 'hf.sign': '🌲 To Hemlock Falls', 'cz.hikeIn': 'Take', 'cz.t.falls': 'the gorge trail to Hemlock Falls' });
Object.assign(C.I18N.es, { 'hf.title': 'Cascada Hemlock', 'hf.down': 'Entrando en el desfiladero de las tsugas…', 'hf.up': 'Volviendo a Willow Creek…', 'hf.back': 'Volver a',
  'hf.welcome': 'Cascada Hemlock: un desfiladero de tsugas antiguas como los de las montañas de Pensilvania. Explora: cuando te acerques a un animal, una planta o un lugar, el extraterrestre lo escanea en tu Guía de Campo. El sendero de la derecha sube a lo alto de la cascada.', 'hf.sign': '🌲 A la Cascada Hemlock', 'cz.hikeIn': 'Tomar', 'cz.t.falls': 'el sendero del desfiladero hasta la Cascada Hemlock' });

/* ---------- THE LAND ---------- */
const WL = 0, POOL = { x: 0, z: 0 }, TOP = { x: 0, z: -10.2 }, SPRING = { x: -4, z: -24, y: 5.8, r: 3.2 }, LIP = { x: 0, z: -9.6 };
function cx(z) { return z > 4 ? 2.2 * Math.sin((z - 4) * 0.06) : 0; } /* the creek's line down the gorge */
function ss(a, b, x) { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); }
function shelfLevel(x, z) { const dx = Math.abs(x - cx(z)), side = 1 - ss(13, 17, dx); return (3 * ss(-3.6, -5.0, z) + 3 * ss(-7.6, -9.0, z)) * side; } /* two rock ledges, 3 m each */
function upperY(t) { return SPRING.y - 0.18 * t; } /* the little creek on the shelf drops gently from the spring to the lip */
function segT(x, z) { const ax = SPRING.x, az = SPRING.z, bx = LIP.x, bz = LIP.z, vx = bx - ax, vz = bz - az, u = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); return { u: u, d: Math.hypot(x - ax - u * vx, z - az - u * vz) }; }
function H(x, z) {
  const d = Math.abs(x - cx(z)); let h = 0.45 + d * 0.06 + (d > 6 ? (d - 6) * 0.6 : 0) + (Math.sin(x * 0.31) * Math.cos(z * 0.27) * 0.9 + Math.sin(x * 0.9 + z * 0.7) * 0.25) * ss(5, 12, d);
  h = Math.max(h, shelfLevel(x, z) + 0.15 * Math.sin(x * 1.3) * Math.cos(z * 1.1) * ss(-10, -12, z));
  h += Math.max(0, -30 - z) * 0.9 + Math.max(0, z - 52) * 0.5; /* the gorge closes in upstream and bends away downstream */
  /* the trail ramp up the right side to the top of the falls (slope about 0.27) */
  const rd = Math.abs(x - 8.6); if (z < 4 && z > -20 && rd < 2.6) { const ry = Math.min(6.05, 1.0 + (2 - z) * 0.27), w = 1 - ss(1.4, 2.6, rd); h = h * (1 - w) + ry * w; }
  /* the creek channel and the plunge pool (deep enough to swim) */
  if (z > -4) { const dd = Math.abs(x - cx(z)); if (dd < 2.6) h = Math.min(h, -1.35 + (dd / 2.6) * (dd / 2.6) * 1.8); }
  const dp = Math.hypot(x - POOL.x, z - POOL.z); if (dp < 5) h = Math.min(h, -2.4 + (dp / 5) * (dp / 5) * 2.6);
  /* the spring pond and the little creek on the shelf */
  const ds = Math.hypot(x - SPRING.x, z - SPRING.z); if (ds < SPRING.r + 0.8) h = Math.min(h, SPRING.y - 0.9 + (ds / (SPRING.r + 0.8)) * (ds / (SPRING.r + 0.8)) * 1.2);
  const st = segT(x, z); if (st.d < 1.5 && z < -8.8) h = Math.min(h, upperY(st.u) - 0.42 + (st.d / 1.5) * (st.d / 1.5) * 0.5);
  return h;
}
function water(x, z) { if (Math.hypot(x - SPRING.x, z - SPRING.z) < SPRING.r && H(x, z) < SPRING.y - 0.05) return SPRING.y; return (z > -5.5 && H(x, z) < WL - 0.05 && Math.abs(x - cx(z)) < 7) ? WL : null; }
const START = { x: 7.5, z: 40 }, FIRE = { x: 999, z: 999 }, HELL = { x: 3.0, z: 2.6 }, MAYF = { x: cx(18) + 1.0, z: 18 }, BIGH = { x: 10.5, z: 22 };
const PATH = L.smooth([[START.x, START.z], [7.2, 28], [6.6, 16], [6.4, 7], [8.6, 3], [8.6, -8], [8.6, -17], [4, -20], [0, -27]], 60);
function pathD(x, z) { return L.lineD(PATH, x, z); }

/* ---------- Field Guide places ---------- */
const FINDS = [
  { id: 'hf_falls', x: POOL.x, z: POOL.z + 2, y: 0.8, r: 7, ry: 6 },
  { id: 'hf_hemlock', x: BIGH.x, z: BIGH.z, r: 4.2 },
  { id: 'hf_trout', at: function (K) { return K.hf ? K.hf.troutAt : null; }, r: 3.6 },
  { id: 'hf_hellbender', x: HELL.x, z: HELL.z, y: -1.3, r: 3.2 },
  { id: 'hf_crayfish', at: function (K) { return K.hf ? K.hf.crayAt : null; }, r: 3 },
  { id: 'hf_mayfly', x: MAYF.x, z: MAYF.z, y: 0.1, r: 3 },
  { id: 'hf_rhodo', x: -7.5, z: 10, r: 3.6 },
  { id: 'hf_moss', x: -4.6, z: -3.2, y: 1.2, r: 3.6 },
  { id: 'hf_spring', x: SPRING.x, z: SPRING.z, y: SPRING.y, r: 5 }
];

/* ---------- BUILD ---------- */
function build(K) {
  const g = new T.Group(), LO = L.low(), R = L.rng(57), cc = new T.Color(); K.g = g; K.colliders = []; C.scene.add(g); K.hf = {};
  C.scene.background = new T.Color('#b9d0c6'); C.scene.fog = new T.FogExp2('#b4ccc0', 0.016);
  C.HEMI.color.set('#e4f2ea'); C.HEMI.groundColor.set('#3a4a2a'); C.HEMI.intensity = 0.62; C.KEYL.color.set('#fff4dc'); C.KEYL.intensity = 0.95; C.KEYL.position.set(40, 90, 30);
  K.sky = new T.Mesh(new T.SphereGeometry(900, 24, 12), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, vertexShader: 'varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec3 vD; void main() { float y = normalize(vD).y; vec3 c = mix(vec3(0.78, 0.86, 0.86), vec3(0.42, 0.62, 0.86), smoothstep(0.0, 0.7, y)); gl_FragColor = vec4(c, 1.0); }' })); K.sky.renderOrder = -10; g.add(K.sky);
  /* ground: the same height grid that walking uses */
  const NX = LO ? 90 : 130, NZ = LO ? 95 : 140, geo = new T.PlaneGeometry(110, 110, NX, NZ); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, 15);
  const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, H(pos.getX(i), pos.getZ(i))); geo.computeVertexNormals();
  L.colorize(geo, function (x, y, z, ny, o) { const n = Math.sin(x * 0.37 + Math.cos(z * 0.29) * 2) * Math.cos(z * 0.23 - x * 0.11), wetSpray = Math.hypot(x - POOL.x, z - POOL.z) < 11;
    if (y < WL - 0.1 && z > -6) cc.set('#5a5240').lerp(new T.Color('#7a6e58'), Math.max(0, n)); /* creek and pool bed: pebbles */
    else if (ny < 0.8) { const bands = ['#7a7062', '#655e54', '#8a7e6a', '#5a5650', '#746a5c', '#6a5e4e'], bi = Math.floor((y + 30) / 0.55 + Math.sin(x * 0.4) * 0.6); cc.set(bands[((bi % 6) + 6) % 6]).offsetHSL(0, 0, Math.sin(x * 2.1 + z * 1.7) * 0.03); /* layered rock: sandstone and shale ledges */
      if (ny > 0.6) cc.lerp(new T.Color(wetSpray ? '#4a7a32' : '#5a6a42'), (ny - 0.6) / 0.2); else if (wetSpray && Math.sin(y * 9 + x * 3) > 0.55) cc.lerp(new T.Color('#3f6a2a'), 0.5); } /* steep: rock (wet rock near the spray turns mossy) */
    else cc.set(n > 0.3 ? '#5a6a34' : n < -0.35 ? '#3e5a2c' : '#6a6a3a').lerp(new T.Color('#7a5a3a'), Math.max(0, -n - 0.5)); /* forest floor: needles, moss, a little leaf litter */
    if (wetSpray && ny >= 0.8 && y > 0.2) cc.lerp(new T.Color('#3f7a2e'), 0.55);
    if (pathD(x, z) < 1.3 && y > 0.2) cc.lerp(new T.Color('#8a6a48'), pathD(x, z) < 0.9 ? 0.75 : 0.35); cc.offsetHSL(0, 0, Math.sin(x * 1.7 + z * 2.3) * 0.02); o[0] = cc.r; o[1] = cc.g; o[2] = cc.b; });
  g.add(new T.Mesh(geo, L.causticify(new T.MeshLambertMaterial({ vertexColors: true }), 'hfground', WL)));
  /* water: the plunge pool and the creek below it (one surface at the same level), the spring pond on the shelf */
  const wopt = { shallow: '#6ab8a8', deep: '#123e3c', skyH: '#d6e6e8', skyM: '#a8c8e0', skyT: '#6a92c8', sunC: '#fff6e0', foam: 0.45, sun: new T.Vector3(0.4, 0.8, 0.3).normalize() };
  { const wg = new T.PlaneGeometry(26, 66, LO ? 40 : 60, LO ? 90 : 130); wg.rotateX(-Math.PI / 2); wg.translate(0, 0, 27); const wp = wg.attributes.position, dep = new Float32Array(wp.count); for (let i = 0; i < wp.count; i++) dep[i] = Math.max(0, WL - H(wp.getX(i), wp.getZ(i)));
    wg.setAttribute('aDepth', new T.BufferAttribute(dep, 1)); K.waterM = L.waterMat(false, wopt); const w = new T.Mesh(wg, K.waterM); w.renderOrder = 2; g.add(w); }
  { const pg = new T.CircleGeometry(SPRING.r + 0.6, 40); pg.rotateX(-Math.PI / 2); const pp = pg.attributes.position, dep = new Float32Array(pp.count); for (let i = 0; i < pp.count; i++) dep[i] = Math.max(0, SPRING.y - H(pp.getX(i) + SPRING.x, pp.getZ(i) + SPRING.z));
    pg.setAttribute('aDepth', new T.BufferAttribute(dep, 1)); K.farM = L.waterMat(false, wopt); const pm = new T.Mesh(pg, K.farM); pm.position.set(SPRING.x, SPRING.y, SPRING.z); pm.renderOrder = 2; g.add(pm); }
  /* the creek on the shelf: a ribbon that only goes down, from the spring to the lip of the falls */
  { const P = [], UV = [], I = [], n = 30; let last = 1e9, along = 0; for (let i = 0; i <= n; i++) { const u = i / n, x = SPRING.x + (LIP.x - SPRING.x) * u + Math.sin(u * 6) * 0.3, z = SPRING.z + (LIP.z - SPRING.z) * u, y = Math.min(last, Math.max(upperY(u), H(x, z) + 0.06)); last = y; if (i) along += Math.hypot((LIP.x - SPRING.x) / n, (LIP.z - SPRING.z) / n);
      const w = 0.75; P.push(x - w, y, z, x + w, y, z); UV.push(0, along / 14, 1, along / 14); if (i < n) { const b = i * 2; I.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); } }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(P, 3)); sg.setAttribute('uv', new T.Float32BufferAttribute(UV, 2)); sg.setIndex(I); const sm = new T.Mesh(sg, L.fallMat(0.7)); sm.renderOrder = 3; g.add(sm); }
  /* THE WATERFALL: hugs the two rock ledges from the lip down into the pool; two side ribbons make it wide like a curtain */
  [[0, 1.15, 0.9], [-1.6, 0.55, 0.5], [1.7, 0.5, 0.45]].forEach(function (f, i) { const fg = L.fallRibbon(H, [TOP.x + f[0], TOP.z], [POOL.x + f[0] * 1.3, POOL.z + 0.4], WL, 26, f[1], f[2]); const fm = new T.Mesh(fg, L.fallMat(1)); fm.renderOrder = 5 + i; g.add(fm); });
  g.add(L.mist(POOL.x, WL + 0.1, POOL.z + 0.6, LO ? 70 : 140, 2.6));
  { const foam = []; for (let i = 0; i < 9; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: L.softDot(), color: '#ffffff', transparent: true, opacity: 0.5, depthWrite: false })); s.position.set(POOL.x - 1.6 + i * 0.4, WL + 0.15, POOL.z - 0.2 + Math.sin(i) * 0.4); s.scale.setScalar(1.1); g.add(s); foam.push(s); } K.hf.foam = foam; }
  /* sunbeams slanting down through the canopy */
  K.hf.beams = []; for (let i = 0; i < (LO ? 3 : 6); i++) { const b = new T.Mesh(new T.PlaneGeometry(3, 26), new T.MeshBasicMaterial({ color: '#fff6d8', transparent: true, opacity: 0.08, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false })); b.position.set(-8 + i * 4.5, 10, 8 + (i % 3) * 7); b.rotation.set(0, 0.6, 0.35); g.add(b); K.hf.beams.push(b); }
  /* ---------- hemlocks: tall, dark, with drooping layered branches (they fade if they block your view) ---------- */
  { const trunk = new T.CylinderGeometry(0.25, 0.45, 1, 7); trunk.translate(0, 0.5, 0); const tier = new T.ConeGeometry(1, 1, 9, 1, true); tier.translate(0, 0.5, 0); const tp = tier.attributes.position; for (let i = 0; i < tp.count; i++) { const y = tp.getY(i); if (y < 0.05) tp.setY(i, y - 0.18); } tier.computeVertexNormals();
    const TR = [], CN = [], CC = [], tiers = LO ? 4 : 6, trees = [], greens = ['#1f3f2c', '#244832', '#1a3828', '#2a4e36']; K.pineT = [];
    const add = function (x, z, hgt) { const y = H(x, z); trees.push([x, z]); TR.push([x, y - 0.2, z, 1.6, hgt * 0.55, 1.6, R() * 6]); const rad = 2.4 + R() * 1.2; K.pineT.push({ x: x, z: z, cr: rad, bot: y + hgt * 0.22, i0: CN.length, ti: TR.length - 1, n: tiers });
      for (let k = 0; k < tiers; k++) { const u = k / tiers; CN.push([x, y + hgt * (0.22 + u * 0.7), z, rad * (1 - u * 0.78), hgt * 0.17, rad * (1 - u * 0.78), R() * 6]); CC.push(greens[(trees.length + k) % 4]); } K.colliders.push({ x: x, z: z, r: 0.6, top: y + hgt }); };
    add(BIGH.x, BIGH.z, 22);
    for (let i = 0, tries = 0; i < (LO ? 40 : 75) && tries < 5000; tries++) { const x = -50 + R() * 100, z = -32 + R() * 90, d = Math.abs(x - cx(z)); if (d < 5.5 || pathD(x, z) < 2.6 || Math.hypot(x - POOL.x, z - POOL.z) < 8 || Math.hypot(x - SPRING.x, z - SPRING.z) < 5.5 || Math.hypot(x - START.x, z - START.z) < 4) continue;
      if (trees.some(function (p) { return Math.hypot(p[0] - x, p[1] - z) < 3.4; })) continue; i++; add(x, z, 12 + R() * 10); }
    g.add(K.trunkIM = L.inst(trunk, L.causticify(new T.MeshLambertMaterial({ color: '#5a3e2c' }), 'hftr', WL), TR)); g.add(K.pineIM = L.inst(tier, L.windyOf(new T.MeshLambertMaterial({ color: '#ffffff', side: T.DoubleSide }), 0.05, 0.9, 'y', 'hemlock'), CN, CC)); }
  /* mossy boulders around the falls and pool (solid, and you can climb the low ones), the big flat rock, riffle stones */
  { const rk = new T.IcosahedronGeometry(1, 2), rp = rk.attributes.position; for (let i = 0; i < rp.count; i++) { const v = new T.Vector3(rp.getX(i), rp.getY(i), rp.getZ(i)), k = 1 + 0.14 * Math.sin(v.x * 4.1 + v.z * 3.3) + 0.08 * Math.cos(v.y * 5.7 + v.x * 2); rp.setXYZ(i, v.x * k, Math.max(-0.25, v.y * k * 0.8), v.z * k); }
    rk.computeVertexNormals(); L.colorize(rk, function (x, y, z, ny, o) { const c = ny > 0.45 ? new T.Color('#4a7a2e').lerp(new T.Color('#6a9a3a'), Math.max(0, Math.sin(x * 9) * 0.5)) : new T.Color('#7a766c').offsetHSL(0, 0, y * 0.06); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
    const RL = [], spots = [[-4.6, -3.2, 1.5], [4.2, -2.6, 1.2], [-5.6, 2.8, 1.3], [5.4, 4.2, 1.1], [-3.4, 6.8, 0.9], [2.5, -6.4, 1.0], [-6, -14, 1.6], [3.5, -20, 1.4], [-10, 18, 1.8], [12, 12, 1.5], [-9, 32, 1.7], [12, 34, 1.3]];
    spots.forEach(function (s) { if (pathD(s[0], s[1]) < s[2] + 0.8) return; const y = H(s[0], s[1]); RL.push([s[0], y + s[2] * 0.15, s[1], s[2] * 1.15, s[2], s[2], s[0] * 1.3]); K.colliders.push({ x: s[0], z: s[1], r: s[2] * 1.0, top: y + s[2] * 0.95 }); });
    g.add(L.inst(rk, L.causticify(new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }), 'hfrock', WL), RL));
    const slab = new T.Mesh(new T.CylinderGeometry(1.4, 1.6, 0.4, 9), L.causticify(new T.MeshLambertMaterial({ color: '#6a665e', flatShading: true }), 'hfslab', WL)), sy = H(HELL.x, HELL.z); slab.scale.set(1, 1, 0.75); slab.position.set(HELL.x, sy + 0.55, HELL.z); slab.rotation.set(0.08, 0.5, -0.05); g.add(slab); K.colliders.push({ x: HELL.x, z: HELL.z, r: 1.3, top: sy + 0.75 });
    const pebble = new T.DodecahedronGeometry(1, 0), PB = []; for (let i = 0; i < (LO ? 30 : 60); i++) { const z = 6 + R() * 44, x = cx(z) + (R() - 0.5) * 4.4, y = H(x, z); if (y > WL - 0.2) continue; const s = 0.25 + R() * 0.35; PB.push([x, y + s * 0.3, z, s * 1.2, s * 0.6, s, R() * 6]); }
    PB.push([MAYF.x, H(MAYF.x, MAYF.z) + 0.25, MAYF.z, 0.75, 0.45, 0.6, 0.3]); K.colliders.push({ x: MAYF.x, z: MAYF.z, r: 0.6, top: H(MAYF.x, MAYF.z) + 0.5 });
    g.add(L.inst(pebble, L.causticify(new T.MeshLambertMaterial({ color: '#8a8070', flatShading: true }), 'hfpeb', WL), PB));
    /* fallen hemlock logs, mossy on top */
    const parts = []; [[-12, 8, 0.6, 7, 0.5], [13, -2, 2.0, 6, 0.45], [-14, 26, 1.1, 8, 0.55]].forEach(function (l) { if (pathD(l[0], l[1]) < l[3] / 2 + 1.5) return; const x = l[0], z = l[1], a = l[2], len = l[3], r = l[4], y = H(x, z) + r * 0.7;
      const cg = new T.CylinderGeometry(r, r * 1.08, len, 12, 4); L.colorize(cg, function (xx, yy, zz, ny, o) { const c = Math.abs(ny) > 0.9 ? new T.Color('#b08a5a') : new T.Color(xx > r * 0.3 ? '#4a7a2a' : '#4a3424'); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
      parts.push(L.place(cg, x, y, z, 1, 1, 1, a, 0, Math.PI / 2)); for (let t = -len / 2 + r; t <= len / 2 - r + 0.01; t += r * 1.4) K.colliders.push({ x: x + Math.cos(a) * t, z: z - Math.sin(a) * t, r: r, top: y + r }); });
    if (parts.length) g.add(new T.Mesh(L.merge(parts), new T.MeshLambertMaterial({ vertexColors: true }))); }
  /* rhododendron thickets (glossy, dark, with a few pale pink flower clusters), ferns and some grass */
  { const bush = L.merge([new T.IcosahedronGeometry(1, 1), L.place(new T.IcosahedronGeometry(1, 1), 0.8, -0.1, 0.3, 0.8, 0.75, 0.8), L.place(new T.IcosahedronGeometry(1, 1), -0.7, -0.15, -0.25, 0.75, 0.7, 0.75)]);
    L.colorize(bush, function (x, y, z, ny, o) { const c = new T.Color('#1f4a2a').lerp(new T.Color('#3f7a3a'), Math.max(0, y) * 0.5 + Math.max(0, Math.sin(x * 11 + z * 9)) * 0.25); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
    const BL = [[-7.5, 10, 1.3], [-8.5, 4, 1.1], [7.5, -24, 1.2]], FLW = [];
    for (let tries = 0; BL.length < (LO ? 14 : 26) && tries < 2000; tries++) { const x = -26 + R() * 52, z = -28 + R() * 80, d = Math.abs(x - cx(z)); if (d < 4.5 || d > 15 || pathD(x, z) < 3 || Math.hypot(x - POOL.x, z - POOL.z) < 6 || H(x, z) > 9) continue; BL.push([x, z, 0.9 + R() * 0.6]); }
    const BI = BL.map(function (b) { const y = H(b[0], b[1]); K.colliders.push({ x: b[0], z: b[1], r: b[2] * 1.1, top: y + b[2] * 1.4 }); for (let k = 0; k < 3; k++) FLW.push([b[0] + (R() - 0.5) * b[2] * 1.6, y + b[2] * (1.1 + R() * 0.3), b[1] + (R() - 0.5) * b[2] * 1.4, 0.2, 0.17, 0.2, 0]); return [b[0], y + b[2] * 0.55, b[1], b[2] * 1.2, b[2] * 0.95, b[2], R() * 6]; });
    g.add(L.inst(bush, L.windyOf(new T.MeshLambertMaterial({ vertexColors: true }), 0.04, 1.0, 'y', 'rhodo'), BI)); g.add(L.inst(new T.IcosahedronGeometry(1, 1), new T.MeshLambertMaterial({ color: '#f4d0e0', emissive: '#2a1018' }), FLW));
    const frond = []; for (let f = 0; f < 8; f++) { const fg0 = L.frondGeo(1.2, 0.2, 0.5, 0.9, 8, '#2a5a26', '#7ab846', 1); fg0.rotateY(f / 8 * 6.283 + (f % 2) * 0.3); frond.push(fg0); } const FL = [];
    for (let tries = 0; FL.length < (LO ? 70 : 150) && tries < 4000; tries++) { const x = -30 + R() * 60, z = -30 + R() * 82, d = Math.abs(x - cx(z)), y = H(x, z); if (d < 3.2 || y < WL + 0.15 || pathD(x, z) < 1.8 || Math.hypot(H(x + 0.6, z) - y, H(x, z + 0.6) - y) > 0.5) continue; FL.push([x, y, z, 0.8 + R() * 0.6, 0.7 + R() * 0.5, 0.8 + R() * 0.6, R() * 6]); }
    g.add(K.fernIM = L.inst(L.merge(frond), L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.15, 1.4, 'attr', 'hffern'), FL)); K.ferns = FL;
    const blades = []; for (let b = 0; b < 6; b++) { const a = b / 6 * 6.283, w = 0.06, bg = new T.BufferGeometry(); bg.setAttribute('position', new T.BufferAttribute(new Float32Array([Math.cos(a) * 0.1 - w, 0, Math.sin(a) * 0.1, Math.cos(a) * 0.1 + w, 0, Math.sin(a) * 0.1, Math.cos(a) * 0.35, 1, Math.sin(a) * 0.35]), 3)); bg.setIndex([0, 1, 2]); bg.setAttribute('normal', new T.BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]), 3));
      L.colorize(bg, function (x, y, z, ny, o) { const c = new T.Color('#3f6a2a').lerp(new T.Color('#a8c870'), y); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); blades.push(bg); }
    const GL = []; for (let tries = 0; GL.length < (LO ? 900 : 2200) && tries < 20000; tries++) { const x = -24 + R() * 48, z = -30 + R() * 80, y = H(x, z), d = Math.abs(x - cx(z)); if (d < 3 || y < WL + 0.1 || pathD(x, z) < 1.4 || Math.hypot(H(x + 0.6, z) - y, H(x, z + 0.6) - y) > 0.4) continue; GL.push([x, y - 0.02, z, 1, 0.2 + R() * 0.2, 1, R() * 6]); }
    g.add(L.inst(L.merge(blades), L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.12, 1.4, 'y', 'hfgrass'), GL)); }
  /* ---------- animals ---------- */
  /* brook trout: olive backs with pale spots, red-orange bellies, white-edged fins; they hold in the pool, facing the current, and slip away from you */
  { const b = new T.SphereGeometry(1, 10, 7), tl = new T.ConeGeometry(0.55, 0.7, 4); tl.rotateX(-Math.PI / 2); tl.translate(0, 0, -1.25);
    const gb = L.colorize(L.place(b, 0, 0, 0, 0.09, 0.11, 0.38), function (x, y, z, ny, o) { const c = y < -0.04 ? new T.Color('#e8703a') : new T.Color('#4a5a32').lerp(new T.Color('#c8c890'), Math.max(0, Math.sin(x * 140) * Math.sin(z * 90)) > 0.6 ? 0.7 : 0); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
    const gt = L.colorize(L.place(tl, 0, 0, 0, 0.1, 0.12, 0.38), function (x, y, z, ny, o) { o[0] = 0.35; o[1] = 0.4; o[2] = 0.26; }); const list = []; for (let i = 0; i < (LO ? 3 : 5); i++) list.push([0, -50, 0, 1, 1, 1, 0]);
    K.hf.troutIM = L.inst(L.merge([gb, gt]), L.causticify(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#101008' }), 'trout', WL), list); K.hf.troutIM.frustumCulled = false; g.add(K.hf.troutIM);
    K.hf.trout = list.map(function (q, i) { return { a: i * 1.3, r: 1.6 + (i % 3) * 0.7, y: -1.1 - (i % 2) * 0.5, off: new T.Vector3(), ph: i }; }); }
  /* crayfish under stones in the creek shallows; they back away under a stone when you come near */
  { K.hf.cray = []; for (let i = 0; i < 3; i++) { const z = 9 + i * 7, x = cx(z) + (i % 2 ? 1.2 : -1.2), y = H(x, z), cg = new T.Group(), M = L.causticify(new T.MeshLambertMaterial({ color: '#7a4a2a' }), 'cray', WL);
      const bd = new T.Mesh(new T.SphereGeometry(1, 8, 6), M); bd.scale.set(0.07, 0.05, 0.2); bd.position.y = 0.06; cg.add(bd); [-1, 1].forEach(function (sd) { const cl = new T.Mesh(new T.SphereGeometry(1, 6, 5), M); cl.scale.set(0.035, 0.025, 0.09); cl.position.set(sd * 0.07, 0.06, 0.24); cg.add(cl); });
      const stone = new T.Mesh(new T.DodecahedronGeometry(0.45, 0), L.causticify(new T.MeshLambertMaterial({ color: '#7a7468', flatShading: true }), 'cst', WL)); stone.scale.set(1.2, 0.5, 1); stone.position.set(x, y + 0.12, z - 0.5); g.add(stone);
      cg.scale.setScalar(1.6); cg.position.set(x, y, z); g.add(cg); K.hf.cray.push({ g: cg, x: x, z: z, home: z - 0.45, ph: i * 2, hide: 0 }); } }
  /* mayfly nymphs clinging to the riffle rock: tiny, flat, with three tails */
  { const n = new T.Group(), M = new T.MeshLambertMaterial({ color: '#3a3020' }), ry = H(MAYF.x, MAYF.z) + 0.48; for (let i = 0; i < 6; i++) { const m = new T.Mesh(new T.SphereGeometry(1, 6, 4), M); m.scale.set(0.025, 0.012, 0.07); m.position.set(MAYF.x + Math.cos(i * 1.1) * 0.3, ry - 0.05 + Math.sin(i) * 0.02, MAYF.z + Math.sin(i * 1.1) * 0.25); m.rotation.y = i * 0.9; n.add(m); } g.add(n); K.hf.may = n; }
  /* the eastern hellbender: a big, flat, wrinkly brown salamander, peeking out from under the flat rock */
  { const hb = new T.Group(), M = L.causticify(new T.MeshLambertMaterial({ color: '#5a4a32' }), 'hell', WL), sy = H(HELL.x, HELL.z);
    for (let k = 0; k < 5; k++) { const s = new T.Mesh(new T.SphereGeometry(1, 10, 6), M); s.scale.set(0.16 - k * 0.012, 0.07, 0.16); s.position.set(0, 0.07, -k * 0.22); hb.add(s); [-1, 1].forEach(function (sd) { const f = new T.Mesh(new T.SphereGeometry(1, 6, 4), M); f.scale.set(0.06, 0.012, 0.035); f.position.set(sd * 0.16, 0.05, -k * 0.22); hb.add(f); }); }
    const head = new T.Mesh(new T.SphereGeometry(1, 10, 6), M); head.scale.set(0.15, 0.06, 0.13); head.position.set(0, 0.07, 0.2); hb.add(head); K.hf.hellHead = head;
    [-1, 1].forEach(function (sd) { const e = new T.Mesh(new T.SphereGeometry(0.015, 5, 4), new T.MeshBasicMaterial({ color: '#111' })); e.position.set(sd * 0.08, 0.11, 0.26); hb.add(e); });
    hb.position.set(HELL.x - 0.4, sy + 0.02, HELL.z + 1.0); hb.rotation.y = -0.4; hb.scale.setScalar(1.6); g.add(hb); K.hf.hell = hb; }
  /* signposts */
  { const post = function (x, z, text, w) { const y = H(x, z), p = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 2.6, 6), new T.MeshLambertMaterial({ color: '#6a4a32' })); p.position.set(x, y + 1.3, z); g.add(p);
      const lb = C.label(text, w, { bd: '#ffd166' }); lb.position.set(x, y + 3.0, z); g.add(lb); K.colliders.push({ x: x, z: z, r: 0.25, top: y + 2.6 }); };
    post(START.x + 2.8, START.z + 0.6, tx('co.signBack'), 2.4); post(10.6, 6.5, '🌲 ' + tx('hf.title'), 2.2); }
  K.rays = []; L.addPlayer(g);
}
function step(dt, K) {
  const hf = K.hf, t = K.t, o = K._ho || (K._ho = new T.Object3D());
  /* trout: slow circles in the pool, nose into the current, sliding away from you */
  let tx0 = 0, tz0 = 0, ty0 = 0; hf.trout.forEach(function (f, i) { f.a += dt * 0.25 * (1 + 0.3 * Math.sin(t + f.ph)); const x = POOL.x + Math.cos(f.a) * f.r, z = POOL.z + 1 + Math.sin(f.a) * f.r * 0.8, y = Math.max(H(x, z) + 0.3, f.y + Math.sin(t * 0.8 + f.ph) * 0.15);
    const dx = x + f.off.x - K.px, dz = z + f.off.z - K.pz, d = Math.hypot(dx, dz, y - K.py); if (d < 2.4 && d > 0.01) { f.off.x += dx / d * (2.4 - d) * 2 * dt; f.off.z += dz / d * (2.4 - d) * 2 * dt; } f.off.multiplyScalar(1 - dt * 0.5);
    const px = x + f.off.x, pz = z + f.off.z, py = Math.min(Math.max(y, H(px, pz) + 0.25), WL - 0.3); o.position.set(px, py, pz); o.rotation.set(0, Math.PI + Math.sin(t * 0.7 + f.ph) * 0.4 + Math.sin(t * 8 + f.ph) * 0.06, 0); o.scale.setScalar(1.6); o.updateMatrix(); hf.troutIM.setMatrixAt(i, o.matrix); tx0 += px; tz0 += pz; ty0 += py; });
  hf.troutIM.instanceMatrix.needsUpdate = true; const n = hf.trout.length; hf.troutAt = [tx0 / n, ty0 / n, tz0 / n];
  /* crayfish */
  hf.cray.forEach(function (c, i) { const near = Math.hypot(K.px - c.x, K.pz - c.z) < 3.2; c.hide += ((near ? 1 : 0) - c.hide) * Math.min(1, dt * 2.5); const z = c.z + Math.sin(t * 0.4 + c.ph) * 0.3 * (1 - c.hide) + (c.home - c.z) * c.hide; c.g.position.set(c.x, H(c.x, z) - c.hide * 0.05, z); c.g.rotation.y = c.hide > 0.5 ? 0 : Math.sin(t * 0.4 + c.ph) * 0.3; if (i === 0) hf.crayAt = [c.x, H(c.x, c.z) + 0.2, c.z]; });
  /* mayfly nymphs wiggle; the hellbender slowly moves its head; spray foam pulses; sunbeams shimmer */
  hf.may.children.forEach(function (m, i) { m.rotation.y = i * 0.9 + Math.sin(t * 3 + i) * 0.2; }); hf.hellHead.rotation.y = Math.sin(t * 0.3) * 0.35;
  hf.foam.forEach(function (s, i) { s.material.opacity = 0.35 + 0.25 * Math.sin(t * 3 + i * 1.3); s.scale.setScalar(1 + 0.25 * Math.sin(t * 2 + i)); });
  hf.beams.forEach(function (b, i) { b.material.opacity = 0.06 + 0.04 * Math.sin(t * 0.5 + i); });
}
BQ.coast.addArea('falls', { H: H, water: water, start: START, fire: FIRE, bounds: { x0: -34, x1: 34, z0: -31, z1: 50 }, build: build, step: step, look: [0, -6], trail: { a: 30, r: 61.2 }, sign: 'hf.sign', title: 'hf.title', icon: '🌲',
  down: 'hf.down', up: 'hf.up', back: 'hf.back', welcome: 'hf.welcome', flag: 'falls', mood: 'forest', under: ['#2a5a50', 0.06], finds: FINDS });
BQ.falls = { H: H, POOL: POOL, TOP: TOP, SPRING: SPRING, START: START, HELL: HELL, cx: cx, upperY: upperY };
}
if (BQ.core && BQ.coast) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

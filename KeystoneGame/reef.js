/* Earthling Field Guide: THE CORAL REEF in Sunset Cove (uses the hiking system in coast.js).
   Corals, sea fans, sponges, starfish and seagrass, and real reef animals that behave like the real ones:
   schools of yellow tang, blue tang and chromis, grazing parrotfish, clownfish that hide in their anemone, a cleaner shrimp,
   a crab that hides under a rock, an octopus that changes color and jets away in a puff of ink, a seahorse holding on to seagrass,
   a manta ray gliding in figure-eights, and a green sea turtle. Everything is shy: animals move away from you, nothing attacks.
   Field Guide entries unlock when you swim close (English and Spanish). */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
if (!BQ.coast || !BQ.coast.cove) return;
const C = BQ.core, T = C.T, L = BQ.coast.lib, CV = BQ.coast.cove, Hc = CV.H, shoreZ = CV.shoreZ, REEF = CV.REEF, A = BQ.coast.areas.cove;

/* ---------- Field Guide text ---------- */
const EN = {
  brain: ['Brain coral', 'Each coral is a colony of tiny animals called polyps. Algae living inside the polyps make food by photosynthesis and share it with the coral, and the coral gives them shelter. Both are helped, so this partnership is mutualism, a kind of symbiosis.'],
  staghorn: ['Staghorn coral', 'Staghorn coral grows branches like deer antlers. Corals build hard skeletons of calcium carbonate, and over many years the skeletons pile up into a reef. The branches give small fish a place to hide.'],
  seafan: ['Sea fan', 'A sea fan is a soft coral that grows flat, across the current. That way its polyps can catch more of the tiny food (plankton) drifting past.'],
  clown: ['Clownfish and sea anemone', 'Clownfish live among the stinging tentacles of a sea anemone. A coat of slime protects them from the stings. The anemone shelters the clownfish, and the clownfish chases away animals that eat anemones: mutualism.'],
  parrot: ['Parrotfish', 'Parrotfish scrape algae off coral rock with beak-like teeth. They grind up bits of rock as they eat and release them as fine sand, so some of the white sand on tropical beaches was made by parrotfish.'],
  tang: ['Blue tang', 'Blue tangs are herbivores: they graze on algae. By eating algae they keep it from covering and smothering the corals. In the reef food web they are primary consumers.'],
  turtle: ['Green sea turtle', 'Adult green sea turtles eat mostly seagrass and algae, which keeps seagrass meadows healthy. They breathe air and must come up to the surface, but they can rest under water for a long time.'],
  seagrass: ['Seagrass', 'Seagrass is a flowering plant that grows under water, not a seaweed. It is a producer: it makes food by photosynthesis. Seagrass meadows are nurseries where young fish grow up.'],
  shrimp: ['Cleaner shrimp', 'Cleaner shrimp pick parasites and dead skin off fish that visit their cleaning station. The shrimp gets a meal and the fish gets cleaned, so both are helped: mutualism.'],
  octopus: ['Octopus', 'An octopus can change the color and texture of its skin in a split second to blend in, using special skin cells. If it is disturbed, it squirts a cloud of dark ink and jets away.'],
  crab: ['Reef crab', 'Crabs are crustaceans with a hard outer skeleton (exoskeleton). Many reef crabs are scavengers: they eat bits of dead plants and animals, which helps recycle matter in the ecosystem.'],
  seahorse: ['Seahorse', 'A seahorse is a fish that swims upright and holds on to seagrass with its curled tail. In seahorses, the father carries the eggs in a pouch until they hatch.'],
  manta: ['Manta ray', 'Manta rays are filter feeders: they swim with their mouths open and strain tiny plankton from the water. They are among the largest fish in the sea, but they are harmless to people.'],
  star: ['Sea star', 'Sea stars (starfish) are not fish. They move on hundreds of tiny tube feet, and many can grow back a lost arm (regeneration).']
};
const ES = {
  brain: ['Coral cerebro', 'Cada coral es una colonia de animales diminutos llamados pólipos. Las algas que viven dentro de los pólipos fabrican alimento por fotosíntesis y lo comparten con el coral, y el coral les da refugio. Ambos se benefician, así que esta relación es mutualismo, un tipo de simbiosis.'],
  staghorn: ['Coral cuerno de ciervo', 'El coral cuerno de ciervo crece con ramas como las astas de un ciervo. Los corales forman esqueletos duros de carbonato de calcio y, con muchos años, los esqueletos se acumulan y forman un arrecife. Las ramas dan escondite a los peces pequeños.'],
  seafan: ['Abanico de mar', 'El abanico de mar es un coral blando que crece plano, atravesado a la corriente. Así sus pólipos atrapan más alimento diminuto (plancton) que pasa flotando.'],
  clown: ['Pez payaso y anémona de mar', 'Los peces payaso viven entre los tentáculos urticantes de una anémona de mar. Una capa de baba los protege de las picaduras. La anémona da refugio al pez payaso y el pez payaso ahuyenta a los animales que comen anémonas: mutualismo.'],
  parrot: ['Pez loro', 'Los peces loro raspan las algas de la roca del coral con dientes parecidos a un pico. Al comer muelen trocitos de roca y los sueltan como arena fina, así que parte de la arena blanca de las playas tropicales la hicieron los peces loro.'],
  tang: ['Cirujano azul', 'Los cirujanos azules son herbívoros: comen algas. Al comer algas evitan que estas cubran y ahoguen a los corales. En la red alimentaria del arrecife son consumidores primarios.'],
  turtle: ['Tortuga verde', 'Las tortugas verdes adultas comen sobre todo pastos marinos y algas, lo que mantiene sanas las praderas de pasto marino. Respiran aire y deben subir a la superficie, pero pueden descansar bajo el agua mucho tiempo.'],
  seagrass: ['Pasto marino', 'El pasto marino es una planta con flores que crece bajo el agua; no es un alga. Es un productor: fabrica su alimento por fotosíntesis. Las praderas de pasto marino son criaderos donde crecen los peces jóvenes.'],
  shrimp: ['Camarón limpiador', 'Los camarones limpiadores quitan parásitos y piel muerta a los peces que visitan su estación de limpieza. El camarón come y el pez queda limpio, así que ambos se benefician: mutualismo.'],
  octopus: ['Pulpo', 'Un pulpo puede cambiar el color y la textura de su piel en un instante para camuflarse, gracias a células especiales de la piel. Si lo molestan, lanza una nube de tinta oscura y se aleja a chorro.'],
  crab: ['Cangrejo de arrecife', 'Los cangrejos son crustáceos con un esqueleto duro por fuera (exoesqueleto). Muchos cangrejos del arrecife son carroñeros: comen restos de plantas y animales muertos, lo que ayuda a reciclar la materia en el ecosistema.'],
  seahorse: ['Caballito de mar', 'El caballito de mar es un pez que nada en posición vertical y se sujeta al pasto marino con su cola enroscada. En los caballitos de mar, el padre lleva los huevos en una bolsa hasta que nacen.'],
  manta: ['Mantarraya', 'Las mantarrayas se alimentan por filtración: nadan con la boca abierta y cuelan el plancton diminuto del agua. Están entre los peces más grandes del mar, pero son inofensivas para las personas.'],
  star: ['Estrella de mar', 'Las estrellas de mar no son peces. Se mueven con cientos de pies ambulacrales diminutos, y muchas pueden volver a formar un brazo perdido (regeneración).']
};
Object.keys(EN).forEach(function (k) { C.I18N.en['fd.n.rf_' + k] = EN[k][0]; C.I18N.en['fd.d.rf_' + k] = EN[k][1]; C.I18N.es['fd.n.rf_' + k] = ES[k][0]; C.I18N.es['fd.d.rf_' + k] = ES[k][1]; });

/* ---------- places on the reef (picked from the reef mounds closest to the beach, so they are easy to find) ---------- */
const BX = 3, BZ = shoreZ(3) + 12, NEAR = REEF.slice().sort(function (a, b) { return Math.hypot(a.x - BX, a.z - BZ) - Math.hypot(b.x - BX, b.z - BZ); });
const ANEM = NEAR[0], SHRIMP = NEAR[1], OCTO = NEAR[2], PARROT = NEAR[3], CRAB = { x: -9, z: shoreZ(-9) + 4 }, HORSE = { x: 13, z: shoreZ(13) + 6.5 }, STAR = { x: -2, z: shoreZ(-2) + 5.5 }, MANTA = { x: 2, z: shoreZ(2) + 34 }, TURT = { x: 4, z: shoreZ(4) + 22 };
function floor(x, z) { return Hc(x, z); }
function onMound(m, k) { const a = k * 2.399, r = m.r * 0.35 * Math.sqrt((k % 5 + 1) / 5); return [m.x + Math.cos(a) * r, m.z + Math.sin(a) * r]; }

A.finds = [
  { id: 'rf_brain', at: function () { const p = onMound(SHRIMP, 0); return [p[0], floor(p[0], p[1]) + 0.5, p[1]]; }, r: 3.5 },
  { id: 'rf_staghorn', at: function () { return [NEAR[4].x, floor(NEAR[4].x, NEAR[4].z) + 0.6, NEAR[4].z]; }, r: 4.5 },
  { id: 'rf_seafan', at: function () { return [NEAR[5].x, floor(NEAR[5].x, NEAR[5].z) + 0.6, NEAR[5].z]; }, r: 4.5 },
  { id: 'rf_clown', at: function () { return [ANEM.x, floor(ANEM.x, ANEM.z) + 0.5, ANEM.z]; }, r: 4 },
  { id: 'rf_parrot', at: function (K) { return K.rf && K.rf.parrotAt ? K.rf.parrotAt : null; }, r: 4 },
  { id: 'rf_tang', at: function (K) { return K.rf && K.rf.tangAt ? K.rf.tangAt : null; }, r: 4.5 },
  { id: 'rf_turtle', at: function (K) { return K.rf ? [K.rf.turtle.position.x, K.rf.turtle.position.y, K.rf.turtle.position.z] : null; }, r: 4.5 },
  { id: 'rf_seagrass', at: function () { return [HORSE.x - 3, floor(HORSE.x - 3, HORSE.z) + 0.4, HORSE.z]; }, r: 4 },
  { id: 'rf_shrimp', at: function (K) { return K.rf ? K.rf.shrimpAt : null; }, r: 2.6 },
  { id: 'rf_octopus', at: function (K) { return K.rf ? [K.rf.octo.position.x, K.rf.octo.position.y, K.rf.octo.position.z] : null; }, r: 3.5 },
  { id: 'rf_crab', at: function (K) { return K.rf ? [K.rf.crab.position.x, K.rf.crab.position.y, K.rf.crab.position.z] : null; }, r: 3.2 },
  { id: 'rf_seahorse', at: function (K) { return K.rf ? [K.rf.horse.position.x, K.rf.horse.position.y, K.rf.horse.position.z] : null; }, r: 3 },
  { id: 'rf_manta', at: function (K) { return K.rf ? [K.rf.manta.position.x, K.rf.manta.position.y, K.rf.manta.position.z] : null; }, r: 6, ry: 5 },
  { id: 'rf_star', at: function () { return [STAR.x, floor(STAR.x, STAR.z) + 0.2, STAR.z]; }, r: 3 }
];

/* ---------- shapes ---------- */
function brainGeo(detail) { const g = new T.IcosahedronGeometry(1, detail), p = g.attributes.position, col = new Float32Array(p.count * 3), c0 = new T.Color('#d9b478'), c1 = new T.Color('#8a6a3a'), c = new T.Color();
  for (let i = 0; i < p.count; i++) { const v = new T.Vector3(p.getX(i), p.getY(i), p.getZ(i)).normalize(), w = Math.abs(Math.sin(v.x * 15 + 2.2 * Math.sin(v.z * 7 + v.y * 5) + v.y * 4)), ridge = Math.min(1, w / 0.45); const k = 1 + 0.06 * ridge; /* winding grooves, like a brain */
    p.setXYZ(i, v.x * k, Math.max(-0.35, v.y) * k, v.z * k); c.copy(c1).lerp(c0, ridge * ridge); col.set([c.r, c.g, c.b], i * 3); }
  g.setAttribute('color', new T.BufferAttribute(col, 3)); g.computeVertexNormals(); return g; }
function branchGeo(seed) { const R = L.rng(seed), parts = [], twig = new T.CylinderGeometry(1, 1, 1, 5, 1, true); twig.translate(0, 0.5, 0);
  const grow = function (base, dir, len, rad, lvl) { const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir.clone().normalize()), m = new T.Matrix4().compose(base, q, new T.Vector3(rad, len, rad)), g0 = twig.clone(); g0.applyMatrix4(m);
    L.colorize(g0, function (x, y, z, ny, o) { const k = 0.7 + 0.3 * lvl / 3; o[0] = o[1] = o[2] = k; }); const fl = new Float32Array(g0.attributes.position.count).fill(Math.min(1, lvl / 3)); g0.setAttribute('aFlex', new T.BufferAttribute(fl, 1)); parts.push(g0);
    if (lvl >= 3) return; const tip = base.clone().add(dir.clone().normalize().multiplyScalar(len)), n = 2 + Math.floor(R() * 2);
    for (let k = 0; k < n; k++) { const d2 = dir.clone().normalize().add(new T.Vector3(R() - 0.5, 0.15, R() - 0.5).multiplyScalar(1.3)).normalize(); grow(tip, d2, len * 0.72, rad * 0.7, lvl + 1); } };
  for (let k = 0; k < 3; k++) { const a = k * 2.09 + R(); grow(new T.Vector3(Math.cos(a) * 0.12, 0, Math.sin(a) * 0.12), new T.Vector3(Math.cos(a) * 0.35, 1, Math.sin(a) * 0.35), 0.38, 0.06, 1); }
  return L.merge(parts); }
function starGeo() { const s = new T.Shape(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.16 : 0.42; if (i) s.lineTo(Math.cos(a) * r, Math.sin(a) * r); else s.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  const g = new T.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 }); g.rotateX(-Math.PI / 2); return g; }
function fishGeo(body, tail, cols) { /* body colors by length: cols = function(z) -> color (z from -1 tail end to +1 nose) */
  const b = new T.SphereGeometry(1, 10, 7), t = new T.ConeGeometry(0.55, 0.7, 4); t.rotateX(-Math.PI / 2); t.translate(0, 0, -1.25);
  const gb = L.colorize(L.place(b, 0, 0, 0, body[0], body[1], body[2]), function (x, y, z, ny, o) { const c = cols(z / body[2], y); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
  const gt = L.colorize(L.place(t, 0, 0, 0, body[0] * tail, body[1] * 1.1, body[2]), function (x, y, z, ny, o) { const c = cols(-1.2, 0); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
  return L.merge([gb, gt]); }
const W1 = new T.Color('#ffffff');
function caus(m, key) { return L.causticify(m, key, 0); }

/* ---------- BUILD ---------- */
A.reef = function (g, K, LO) {
  const R = L.rng(33), rf = K.rf = {}; rf.LO = LO;
  /* corals on every mound */
  const BR = [], BRc = [], BN = [[], []], BNc = [[], []], FAN = [], FANc = [], SP = [], SPc = [], coralCols = ['#FF6A2A', '#FF8A4A', '#F03A70', '#FFC23A', '#9A5FF0', '#3ED2D8'];
  REEF.forEach(function (m, i) { const n = LO ? 6 : 11; for (let k = 0; k < n; k++) { const a = R() * 6.283, rr = Math.sqrt(R()) * m.r * 1.05, x = m.x + Math.cos(a) * rr, z = m.z + Math.sin(a) * rr, y = floor(x, z); if (y > -0.85) continue; const room = -0.3 - y, roll = R();
      if (roll < 0.22 || (m === SHRIMP && k === 0)) { const p0 = m === SHRIMP && k === 0 ? onMound(SHRIMP, 0) : [x, z], yy = floor(p0[0], p0[1]), s = Math.min(0.5 + R() * 0.6, (-0.4 - yy) / 0.85); BR.push([p0[0], yy + s * 0.15, p0[1], s * 1.1, s * 0.85, s, R() * 6]); BRc.push(['#ffffff', '#f4ecd0', '#ffe0d0', '#e8f0d0'][k % 4]); K.colliders.push({ x: p0[0], z: p0[1], r: s * 1.05, top: yy + s * 0.9 }); if (m === SHRIMP && k === 0) rf.shrimpAt = [p0[0], yy + s * 1.05, p0[1]]; }
      else if (roll < 0.58) { const s = Math.min(0.9 + R() * 0.8, room / 1.4), v = k % 2; BN[v].push([x, y - 0.05, z, s, s, s, R() * 6]); BNc[v].push(coralCols[Math.floor(R() * coralCols.length)]); }
      else if (roll < 0.75) { const s = Math.min(0.8 + R() * 0.6, room / 1.2); FAN.push([x, y - 0.05, z, s, s * 1.2, s, R() * 6]); FANc.push(['#9a5ad8', '#d85a9a', '#b04ac8'][k % 3]); }
      else { const s = 0.5 + R() * 0.45, sy = Math.min(s * (0.9 + R() * 0.7), room); SP.push([x, y - 0.05, z, s, sy, s, R() * 6]); SPc.push(['#8a4ad8', '#ff8a3a', '#d84a8a', '#4ab0d8'][Math.floor(R() * 4)]); } } });
  /* make sure the staghorn and sea fan entries have something to look at */
  { const m = NEAR[4], y = floor(m.x, m.z), s = Math.min(1.4, (-0.3 - y) / 1.4); BN[0].push([m.x, y - 0.05, m.z, s, s, s, 0.7]); BNc[0].push('#FF8A4A'); const m2 = NEAR[5], y2 = floor(m2.x, m2.z), s2 = Math.min(1.3, (-0.3 - y2) / 1.2); FAN.push([m2.x, y2 - 0.05, m2.z, s2, s2 * 1.2, s2, 1.1]); FANc.push('#9a5ad8'); }
  g.add(L.inst(brainGeo(LO ? 3 : 4), caus(new T.MeshLambertMaterial({ vertexColors: true }), 'brain'), BR, BRc));
  [0, 1].forEach(function (v) { g.add(L.inst(branchGeo(5 + v * 7), caus(L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#1a0808', side: T.DoubleSide }), 0.06, 0.8, 'attr', 'branch' + v), 'branch' + v), BN[v], BNc[v])); });
  const fanT = L.canvasTex(64, 64, function (x) { x.strokeStyle = '#fff'; x.lineWidth = 1.8; for (let i = 0; i < 13; i++) { x.beginPath(); x.moveTo(32, 64); x.quadraticCurveTo(32 + (i - 6) * 3, 40, 32 + (i - 6) * 5.2, 4 + Math.abs(i - 6)); x.stroke(); } x.lineWidth = 1; for (let j = 1; j < 8; j++) { x.beginPath(); x.arc(32, 64, j * 8, Math.PI, 2 * Math.PI); x.stroke(); } });
  const fanG = new T.PlaneGeometry(1.6, 1.6); fanG.translate(0, 0.8, 0); g.add(L.inst(fanG, caus(L.windyOf(new T.MeshLambertMaterial({ map: fanT, alphaTest: 0.4, side: T.DoubleSide }), 0.22, 0.8, 'y', 'fan2'), 'fan2'), FAN, FANc));
  const tube = []; [[0, 0, 0.18, 1], [0.32, 0.1, 0.15, 0.75], [-0.25, 0.25, 0.14, 0.6], [0.05, -0.32, 0.12, 0.5]].forEach(function (t0) { const cg = new T.CylinderGeometry(t0[2], t0[2] * 0.85, t0[3], 8, 1, true); cg.translate(t0[0], t0[3] / 2, t0[1]); tube.push(cg); });
  g.add(L.inst(L.merge(tube), caus(new T.MeshLambertMaterial({ side: T.DoubleSide, emissive: '#200a20' }), 'tube'), SP, SPc));
  /* starfish on the sand */
  { const ST = [], STc = []; for (let i = 0; i < (LO ? 10 : 22); i++) { const x = (i === 0 ? STAR.x : -40 + R() * 80), z = i === 0 ? STAR.z : shoreZ(x) + 3 + R() * 14, y = floor(x, z); if (y > -0.4 && i) continue; ST.push([x, y + 0.04, z, 0.7 + R() * 0.5, 1, 0.7 + R() * 0.5, R() * 6]); STc.push(['#ff7a3a', '#e8402a', '#9a5fd8', '#ffb03a'][i % 4]); }
    g.add(L.inst(starGeo(), caus(new T.MeshLambertMaterial({ emissive: '#200800' }), 'star'), ST, STc)); }
  /* seagrass meadows on sand 0.9 to 4 m deep, in patches (one always around the seahorse) */
  { const blade = []; for (let b = 0; b < 4; b++) { const pg = new T.PlaneGeometry(0.07, 1, 1, 4); pg.translate(0, 0.5, 0); const pp = pg.attributes.position; for (let i = 0; i < pp.count; i++) pp.setX(i, pp.getX(i) * (1 - pp.getY(i) * 0.7)); pg.rotateY(b * 0.8); pg.translate(Math.cos(b * 2) * 0.12, 0, Math.sin(b * 2) * 0.12); blade.push(pg); }
    const sgG = L.merge(blade); L.colorize(sgG, function (x, y, z, ny, o) { const c = new T.Color('#2a6a3a').lerp(new T.Color('#8ad05a'), y); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); const SG = [];
    for (let tries = 0; SG.length < (LO ? 260 : 700) && tries < 9000; tries++) { const near = tries % 6 === 0, x = near ? HORSE.x + (R() - 0.5) * 9 : -60 + R() * 120, z = near ? HORSE.z + (R() - 0.5) * 6 : shoreZ(x) + 2 + R() * 16, y = floor(x, z), d = -y; if (d < 0.9 || d > 4) continue;
      if (!near && Math.sin(x * 0.23 + 1) * Math.cos(z * 0.31) < 0.15) continue; SG.push([x, y, z, 0.9 + R() * 0.5, Math.min(0.35 + R() * 0.55, d - 0.3), 0.9 + R() * 0.5, R() * 6]); }
    g.add(L.inst(sgG, caus(L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.3, 0.8, 'y', 'sg2'), 'sg2'), SG)); }
  /* the sea anemone: a ring of swaying tentacles on a reef rock */
  { const y = floor(ANEM.x, ANEM.z), an = new T.Group(), tg = []; for (let i = 0; i < (LO ? 26 : 48); i++) { const a = i * 2.399, r = 0.08 + 0.42 * Math.sqrt(i / 48), cg = new T.ConeGeometry(0.035, 0.5 + (i % 3) * 0.12, 5); cg.translate(0, 0.25, 0);
      const g0 = L.place(cg, Math.cos(a) * r, 0.12, Math.sin(a) * r, 1, 1, 1, 0, Math.cos(a) * 0.5 * r, -Math.sin(a) * 0.5 * r); L.colorize(g0, function (x, yy, z, ny, o) { const c = new T.Color('#c84a9a').lerp(new T.Color('#ffd0f0'), Math.min(1, (yy - 0.12) * 2)); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); g0.setAttribute('aFlex', new T.BufferAttribute(new Float32Array(g0.attributes.position.count).fill(1), 1)); tg.push(g0); }
    const base = new T.Mesh(new T.CylinderGeometry(0.45, 0.55, 0.25, 12), caus(new T.MeshLambertMaterial({ color: '#8a3a6a' }), 'anb')); base.position.y = 0.1; an.add(base);
    const tm = new T.Mesh(L.merge(tg), caus(L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#2a0a20' }), 0.12, 1.1, 'attr', 'anem'), 'anem')); an.add(tm); an.position.set(ANEM.x, y, ANEM.z); g.add(an); rf.anem = { x: ANEM.x, y: y + 0.35, z: ANEM.z }; }
  /* reef fish: one shape per kind, many copies; schools circle their mound and swerve away from you */
  { const plain = fishGeo([0.09, 0.12, 0.3], 1, function () { return W1; }), tangG = fishGeo([0.08, 0.14, 0.3], 1.1, function (z) { return z < -1.05 ? new T.Color('#ffd23a') : new T.Color('#2a5ae8').lerp(new T.Color('#0a1a5a'), z > 0.2 && z < 0.6 ? 0.6 : 0); });
    rf.fish = []; const kinds = [['yellow', '#ffd23a', 34, NEAR[6], 0.35, plain], ['tang', '#ffffff', 44, NEAR[7], -0.28, tangG], ['orange', '#ff8a3a', 14, NEAR[8], 0.42, plain], ['teal', '#4ad8d0', 22, NEAR[9], -0.38, plain]];
    kinds.forEach(function (kd, j) { const m = kd[3], n = LO ? Math.ceil(kd[2] / 2) : kd[2], list = [], cols = []; for (let i = 0; i < n; i++) { list.push([0, -50, 0, 1, 1, 1, 0]); cols.push(kd[1]); }
      const im = L.inst(kd[5], caus(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#101010' }), 'fish' + j), list, cols); im.frustumCulled = false; g.add(im);
      const sc = { im: im, cx: m.x, cz: m.z, r: m.r + 1.8, y: Math.max(floor(m.x, m.z) + 0.9, -2.0), sp: kd[4], kind: kd[0], f: [] };
      for (let i = 0; i < n; i++) sc.f.push({ a: R() * 6.283, rr: sc.r * (0.6 + R() * 0.6), dy: -0.3 + R() * 0.6, ph: R() * 6.28, sc: 0.55 + R() * 0.4, off: new T.Vector3() }); rf.fish.push(sc); });
    /* parrotfish: bigger, blue-green with pink, grazing from coral to coral and pecking at the rock */
    const parG = fishGeo([0.2, 0.26, 0.62], 1.1, function (z, y) { return z < -1.05 ? new T.Color('#e86ab0') : new T.Color('#2ac8a8').lerp(new T.Color('#e86ab0'), Math.abs(Math.sin(z * 7)) > 0.85 ? 0.7 : 0).lerp(new T.Color('#c8f0a0'), y < -0.1 ? 0.35 : 0); });
    const pl = []; for (let i = 0; i < (LO ? 3 : 5); i++) pl.push([0, -50, 0, 1, 1, 1, 0]); rf.parrotIM = L.inst(parG, caus(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#081010' }), 'parrot'), pl); rf.parrotIM.frustumCulled = false; g.add(rf.parrotIM);
    rf.parrots = pl.map(function (p, i) { return { x: PARROT.x + i, z: PARROT.z, y: -1.5, tx: PARROT.x, tz: PARROT.z, t: i * 0.7, yaw: 0, peck: 0, ph: i * 1.3 }; });
    /* clownfish: orange with three white bands, never far from their anemone */
    const clG = fishGeo([0.05, 0.075, 0.17], 1, function (z) { const band = Math.abs(z - 0.45) < 0.12 || Math.abs(z + 0.05) < 0.12 || z < -0.8; return band ? new T.Color('#ffffff') : new T.Color('#ff7a1a'); });
    const cl = [[0, -50, 0, 1, 1, 1, 0], [0, -50, 0, 1, 1, 1, 0], [0, -50, 0, 1, 1, 1, 0]]; rf.clownIM = L.inst(clG, new T.MeshLambertMaterial({ vertexColors: true, emissive: '#200800' }), cl); rf.clownIM.frustumCulled = false; g.add(rf.clownIM); rf.hide = 0; }
  /* the green sea turtle (built from simple shapes; the flippers swing from the shoulders) */
  { const tt = new T.Group(), shell = new T.Mesh(new T.IcosahedronGeometry(1, 1), caus(new T.MeshLambertMaterial({ color: '#6B7A3A', flatShading: true }), 'tshell')); shell.scale.set(1, 0.38, 1.25); tt.add(shell);
    const belly = new T.Mesh(new T.SphereGeometry(0.95, 12, 6, 0, 6.283, Math.PI / 2, Math.PI / 2), new T.MeshLambertMaterial({ color: '#E2D7A0' })); belly.scale.set(1, 0.25, 1.2); tt.add(belly);
    const skin = caus(new T.MeshLambertMaterial({ color: '#A8B87A' }), 'tskin'), head = new T.Mesh(new T.SphereGeometry(0.3, 10, 8), skin); head.scale.set(1, 0.85, 1.2); head.position.set(0, 0.05, 1.42); tt.add(head);
    [-1, 1].forEach(function (sd) { const e = new T.Mesh(new T.SphereGeometry(0.045, 6, 5), new T.MeshBasicMaterial({ color: '#111' })); e.position.set(sd * 0.17, 0.13, 1.6); tt.add(e); });
    rf.flip = []; [[-0.8, 0.55, -1, 1], [0.8, 0.55, 1, 1], [-0.6, -0.85, -1, 0], [0.6, -0.85, 1, 0]].forEach(function (f) { const pv = new T.Group(), m = new T.Mesh(new T.SphereGeometry(1, 8, 6), skin), long = f[3] ? 0.5 : 0.25; m.scale.set(long * 1.6, 0.05, long * 0.55); m.position.x = f[2] * long * 1.4; pv.add(m); pv.position.set(f[0], 0, f[1]); tt.add(pv); rf.flip.push({ pivot: pv, side: f[2], front: !!f[3] }); });
    g.add(tt); rf.turtle = tt; }
  /* cleaner shrimp on the brain coral: red and white stripes, long white feelers */
  { const sh = new T.Group(), bodyG = new T.SphereGeometry(1, 10, 6); L.colorize(bodyG, function (x, y, z, ny, o) { const c = new T.Color(Math.sin(z * 9) > 0.2 ? '#ffffff' : '#e83a2a'); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
    const b = new T.Mesh(bodyG, new T.MeshLambertMaterial({ vertexColors: true, emissive: '#200000' })); b.scale.set(0.05, 0.05, 0.16); sh.add(b); rf.feel = [];
    [-1, 1].forEach(function (sd) { const f = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.35, 3), new T.MeshBasicMaterial({ color: '#ffffff' })); f.geometry.translate(0, 0.175, 0); f.position.set(sd * 0.02, 0.02, 0.14); f.rotation.x = 1.1; f.rotation.z = sd * 0.4; sh.add(f); rf.feel.push(f); });
    if (rf.shrimpAt) sh.position.set(rf.shrimpAt[0], rf.shrimpAt[1] - 0.05, rf.shrimpAt[2]); else sh.visible = false; g.add(sh); rf.shrimp = sh; sh.scale.setScalar(1.6); }
  /* a reef crab beside a rock on the sand; it hides under the rock when you come close */
  { const rx = CRAB.x + 1.6, rz = CRAB.z + 0.6, ry = floor(rx, rz), rock = new T.Mesh(new T.DodecahedronGeometry(0.8, 1), caus(new T.MeshLambertMaterial({ color: '#8a8478', flatShading: true }), 'crock')); rock.scale.set(1.3, 0.55, 1); rock.position.set(rx, ry + 0.2, rz); g.add(rock);
    K.colliders.push({ x: rx, z: rz, r: 1.0, top: ry + 0.6 }); rf.crabHome = { x: rx, z: rz };
    const cb = new T.Group(), M = caus(new T.MeshLambertMaterial({ color: '#d8582a' }), 'crab'), bd = new T.Mesh(new T.SphereGeometry(1, 10, 6), M); bd.scale.set(0.22, 0.09, 0.16); bd.position.y = 0.12; cb.add(bd);
    for (let i = 0; i < 6; i++) { const lg = new T.Mesh(new T.BoxGeometry(0.22, 0.025, 0.025), M), sd = i < 3 ? -1 : 1; lg.position.set(sd * 0.25, 0.07, -0.08 + (i % 3) * 0.08); lg.rotation.z = sd * -0.5; cb.add(lg); }
    [-1, 1].forEach(function (sd) { const cl = new T.Mesh(new T.SphereGeometry(0.06, 6, 5), M); cl.scale.set(1, 0.7, 1.4); cl.position.set(sd * 0.12, 0.13, 0.2); cb.add(cl); const ey = new T.Mesh(new T.SphereGeometry(0.022, 5, 4), new T.MeshBasicMaterial({ color: '#111' })); ey.position.set(sd * 0.05, 0.2, 0.12); cb.add(ey); });
    cb.scale.setScalar(1.3); g.add(cb); rf.crab = cb; rf.crabS = { x: CRAB.x, z: CRAB.z, t: 0, hide: 0 }; }
  /* an octopus on a reef rock: it slowly changes color, and if you swim too close it puffs ink and jets to another rock */
  { const oc = new T.Group(), mat = caus(new T.MeshLambertMaterial({ color: '#b0583a' }), 'octo'), man = new T.Mesh(new T.SphereGeometry(0.32, 12, 9), mat); man.scale.set(1, 1.25, 1); man.position.y = 0.42; oc.add(man);
    [-1, 1].forEach(function (sd) { const e = new T.Mesh(new T.SphereGeometry(0.06, 6, 5), new T.MeshLambertMaterial({ color: '#f0e0a0' })); e.position.set(sd * 0.17, 0.32, 0.22); oc.add(e); });
    rf.arms = []; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, root = new T.Group(); root.position.set(Math.cos(a) * 0.18, 0.18, Math.sin(a) * 0.18); root.rotation.y = -a; oc.add(root); let par = root; const segs = [];
      for (let k = 0; k < 4; k++) { const sg = new T.Group(), m = new T.Mesh(new T.CylinderGeometry(0.07 - k * 0.014, 0.08 - k * 0.014, 0.2, 6), mat); m.rotation.z = Math.PI / 2; m.position.x = 0.1; sg.add(m); sg.position.x = k ? 0.2 : 0; par.add(sg); segs.push(sg); par = sg; } rf.arms.push({ segs: segs, ph: i * 0.8 }); }
    g.add(oc); rf.octo = oc; rf.octoMat = mat; rf.octoSpots = [OCTO, NEAR[10] || OCTO, NEAR[11] || OCTO]; rf.octoI = 0; rf.octoMove = null; const y0 = floor(OCTO.x, OCTO.z); oc.position.set(OCTO.x, y0, OCTO.z);
    rf.ink = new T.Sprite(new T.SpriteMaterial({ map: L.softDot(), color: '#1a1420', transparent: true, opacity: 0, depthWrite: false })); g.add(rf.ink); }
  /* a seahorse holding on to the seagrass */
  { const hs = new T.Group(), mat = caus(new T.MeshLambertMaterial({ color: '#f0b030', emissive: '#201000' }), 'horse');
    const body = new T.Mesh(new T.SphereGeometry(0.1, 10, 8), mat); body.scale.set(0.8, 1.6, 0.9); body.position.y = 0.05; hs.add(body);
    const head = new T.Mesh(new T.SphereGeometry(0.075, 8, 6), mat); head.position.set(0, 0.24, 0.05); hs.add(head); const snout = new T.Mesh(new T.CylinderGeometry(0.02, 0.025, 0.12, 6), mat); snout.rotation.x = Math.PI / 2; snout.position.set(0, 0.23, 0.14); hs.add(snout);
    const tail = new T.Mesh(new T.TorusGeometry(0.06, 0.022, 6, 12, 4.4), mat); tail.position.set(0, -0.14, -0.02); tail.rotation.y = Math.PI / 2; hs.add(tail); hs.scale.setScalar(1.6); g.add(hs); rf.horse = hs; }
  /* a manta ray gliding in slow figure-eights over the deeper water */
  { const mr = new T.Group(), top = new T.MeshLambertMaterial({ color: '#2a303c', side: T.DoubleSide }), wingG = new T.BufferGeometry(); wingG.setAttribute('position', new T.Float32BufferAttribute([0, 0, 0.9, 0, 0, -0.6, 2.2, -0.05, -0.15], 3)); wingG.setIndex([0, 1, 2]); wingG.computeVertexNormals();
    const body = new T.Mesh(new T.SphereGeometry(1, 12, 8), top); body.scale.set(0.55, 0.16, 0.9); mr.add(body); rf.wings = [];
    [-1, 1].forEach(function (sd) { const pv = new T.Group(), w = new T.Mesh(wingG, top); w.scale.x = sd; pv.add(w); pv.position.x = sd * 0.35; mr.add(pv); rf.wings.push({ pv: pv, sd: sd }); });
    [-1, 1].forEach(function (sd) { const lobe = new T.Mesh(new T.BoxGeometry(0.08, 0.04, 0.35), top); lobe.position.set(sd * 0.3, 0, 1.0); mr.add(lobe); });
    const tail = new T.Mesh(new T.CylinderGeometry(0.01, 0.04, 1.4, 4), top); tail.rotation.x = Math.PI / 2; tail.position.z = -1.3; mr.add(tail); const belly = new T.Mesh(new T.SphereGeometry(1, 10, 6), new T.MeshLambertMaterial({ color: '#e8eef0' })); belly.scale.set(0.5, 0.1, 0.8); belly.position.y = -0.06; mr.add(belly);
    mr.scale.setScalar(1.5); g.add(mr); rf.manta = mr; }
};

/* ---------- EVERY FRAME ---------- */
const o = new T.Object3D();
function shy(p, K, d0, push, dt, off) { const dx = p.x + off.x - K.px, dz = p.z + off.z - K.pz, dy = p.y - K.py, d = Math.hypot(dx, dy, dz); if (d < d0 && d > 0.01) { off.x += dx / d * (d0 - d) * push * dt; off.z += dz / d * (d0 - d) * push * dt; } off.multiplyScalar(1 - dt * 0.6); }
A.reefStep = function (dt, K) {
  const rf = K.rf; if (!rf) return; const t = K.t;
  /* schools */
  rf.fish.forEach(function (sc) { let sx = 0, sz = 0;
    sc.f.forEach(function (f, i) { f.a += sc.sp * dt * (1 + 0.2 * Math.sin(t + f.ph)); const x = sc.cx + Math.cos(f.a) * f.rr, z = sc.cz + Math.sin(f.a) * f.rr; let y = Math.max(floor(x, z) + 0.35, sc.y + f.dy + 0.15 * Math.sin(t * 1.3 + f.ph));
      const p = { x: x, y: y, z: z }; shy(p, K, 2.2, 2.5, dt, f.off); const px = x + f.off.x, pz = z + f.off.z, py = Math.min(Math.max(y, floor(px, pz) + 0.3), -0.25);
      o.position.set(px, py, pz); o.rotation.set(0, Math.atan2(-Math.sin(f.a), Math.cos(f.a)) + (sc.sp < 0 ? Math.PI : 0) + 0.15 * Math.sin(t * 9 + f.ph), 0); o.scale.setScalar(f.sc); o.updateMatrix(); sc.im.setMatrixAt(i, o.matrix); sx += px; sz += pz; });
    sc.im.instanceMatrix.needsUpdate = true; if (sc.kind === 'tang') rf.tangAt = [sx / sc.f.length, sc.y, sz / sc.f.length]; });
  /* parrotfish graze: swim to a coral spot, peck, move on */
  rf.parrots.forEach(function (p, i) { p.t -= dt; if (p.t <= 0) { const m = NEAR[1 + ((i + Math.floor(t / 9)) % 5)], a = Math.random() * 6.283; p.tx = m.x + Math.cos(a) * m.r * 0.6; p.tz = m.z + Math.sin(a) * m.r * 0.6; p.t = 4 + Math.random() * 4; }
    const dx = p.tx - p.x, dz = p.tz - p.z, dl = Math.hypot(dx, dz); if (dl > 0.4) { const want = Math.atan2(dx, dz); p.yaw += (((want - p.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 2); const s = Math.min(1.1, dl) * dt; p.x += Math.sin(p.yaw) * s; p.z += Math.cos(p.yaw) * s; p.peck = 0; } else p.peck += dt;
    const fy = floor(p.x, p.z); p.y += (Math.min(fy + 0.45 + (p.peck > 0 ? 0 : 0.4), -0.4) - p.y) * Math.min(1, dt * 2); const dp = Math.hypot(p.x - K.px, p.z - K.pz, p.y - K.py); if (dp < 2.5) { p.x += (p.x - K.px) / dp * dt * 2; p.z += (p.z - K.pz) / dp * dt * 2; }
    o.position.set(p.x, p.y, p.z); o.rotation.set(p.peck > 0 ? 0.35 + Math.sin(t * 6 + i) * 0.15 : 0, p.yaw + Math.sin(t * 6 + p.ph) * 0.08, 0, 'YXZ'); o.scale.setScalar(1); o.updateMatrix(); rf.parrotIM.setMatrixAt(i, o.matrix); if (i === 0) rf.parrotAt = [p.x, p.y, p.z]; });
  rf.parrotIM.instanceMatrix.needsUpdate = true; o.rotation.order = 'XYZ';
  /* clownfish: little circles over the anemone; dart down into it when you come close */
  { const an = rf.anem, near = Math.hypot(K.px - an.x, K.pz - an.z, K.py - an.y) < 3.5; rf.hide += ((near ? 1 : 0) - rf.hide) * Math.min(1, dt * 3);
    for (let i = 0; i < 3; i++) { const a = t * (0.9 + i * 0.2) + i * 2.1, r = (0.45 + i * 0.12) * (1 - rf.hide * 0.85); o.position.set(an.x + Math.cos(a) * r, an.y + 0.25 + Math.sin(t * 1.7 + i) * 0.1 - rf.hide * 0.3, an.z + Math.sin(a) * r); o.rotation.set(0, Math.atan2(-Math.sin(a), Math.cos(a)) + Math.sin(t * 10 + i) * 0.2, 0); o.scale.setScalar(1); o.updateMatrix(); rf.clownIM.setMatrixAt(i, o.matrix); }
    rf.clownIM.instanceMatrix.needsUpdate = true; }
  /* turtle */
  { const tt = rf.turtle, a = t * 0.06, x = TURT.x + Math.cos(a) * 11, z = TURT.z + Math.sin(a) * 7; tt.position.set(x, Math.min(-0.6, Math.max(floor(x, z) + 0.6, -1.7 + Math.sin(t * 0.5) * 0.25)), z);
    tt.rotation.y = Math.atan2(-Math.sin(a) * 11, Math.cos(a) * 7); rf.flip.forEach(function (f) { const w = Math.sin(t * 2.2 + (f.front ? 0 : 1.5)); f.pivot.rotation.z = f.side * w * (f.front ? 0.5 : 0.3); f.pivot.rotation.y = f.side * w * 0.25; }); }
  /* shrimp feelers */
  rf.feel.forEach(function (f, i) { f.rotation.z = (i ? 1 : -1) * (0.4 + Math.sin(t * 3 + i) * 0.25); });
  /* crab walks sideways; hides under its rock when you are near */
  { const c = rf.crabS, near = Math.hypot(K.px - (c.x), K.pz - c.z) < 3.5 || Math.hypot(K.px - rf.crabHome.x, K.pz - rf.crabHome.z) < 3; c.hide += ((near ? 1 : 0) - c.hide) * Math.min(1, dt * 2.5);
    const wx = CRAB.x + Math.sin(t * 0.35) * 1.4, x = wx + (rf.crabHome.x - wx) * c.hide, z = CRAB.z + (rf.crabHome.z - CRAB.z) * c.hide; c.x = CRAB.x; rf.crab.position.set(x, floor(x, z) - c.hide * 0.12, z); rf.crab.rotation.y = 0.2; rf.crab.scale.setScalar(1.3 * (1 - c.hide * 0.45)); }
  /* octopus */
  { const oc = rf.octo; rf.arms.forEach(function (a0) { a0.segs.forEach(function (s, k) { s.rotation.z = -0.35 - 0.25 * Math.sin(t * 1.4 + a0.ph + k * 0.7); s.rotation.y = 0.2 * Math.sin(t * 0.9 + a0.ph); }); });
    const hue = 0.5 + 0.5 * Math.sin(t * 0.35); rf.octoMat.color.set('#b0583a').lerp(new T.Color('#d8c8a0'), hue * 0.7).lerp(new T.Color('#6a2a3a'), Math.max(0, Math.sin(t * 0.21)) * 0.4);
    if (!rf.octoMove && Math.hypot(K.px - oc.position.x, K.pz - oc.position.z, K.py - oc.position.y) < 2.6) { rf.octoI = (rf.octoI + 1) % rf.octoSpots.length; const s = rf.octoSpots[rf.octoI]; rf.octoMove = { a: oc.position.clone(), b: new T.Vector3(s.x, floor(s.x, s.z), s.z), u: 0 }; rf.ink.position.copy(oc.position).add(new T.Vector3(0, 0.5, 0)); rf.inkT = 0; }
    if (rf.octoMove) { const m = rf.octoMove; m.u += dt / 2.2; const u = Math.min(1, m.u); oc.position.lerpVectors(m.a, m.b, u * u * (3 - 2 * u)); oc.position.y = Math.min(-0.4, oc.position.y + Math.sin(u * Math.PI) * 1.2); oc.rotation.x = Math.sin(u * Math.PI) * 1.1; if (m.u >= 1) { rf.octoMove = null; oc.rotation.x = 0; } }
    if (rf.inkT != null) { rf.inkT += dt; const u = rf.inkT / 2.5; rf.ink.scale.setScalar(0.6 + u * 3.5); rf.ink.material.opacity = Math.max(0, 0.8 * (1 - u)); if (u >= 1) rf.inkT = null; } }
  /* seahorse bobs beside the seagrass */
  { const y = floor(HORSE.x, HORSE.z); rf.horse.position.set(HORSE.x + Math.sin(t * 0.3) * 0.15, Math.min(-0.5, y + 0.55 + Math.sin(t * 1.1) * 0.08), HORSE.z); rf.horse.rotation.y = Math.sin(t * 0.25) * 0.8 + 1.2; }
  /* manta ray: slow figure-eight, flapping its wing tips */
  { const a = t * 0.07, x = MANTA.x + Math.sin(a) * 14, z = MANTA.z + Math.sin(a * 2) * 6, dx = Math.cos(a) * 14, dz = Math.cos(a * 2) * 12, y = Math.min(-1.6, Math.max(floor(x, z) + 1.2, -3.2 + Math.sin(t * 0.3) * 0.4));
    rf.manta.position.set(x, y, z); rf.manta.rotation.set(0, Math.atan2(dx, dz), -Math.sin(a * 2) * 0.25); rf.wings.forEach(function (w) { w.pv.rotation.z = w.sd * Math.sin(t * 1.6) * 0.35; }); }
};
const prevStep = A.step; A.step = function (dt, K) { if (prevStep) prevStep(dt, K); A.reefStep(dt, K); };
}
if (BQ.core && BQ.coast) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

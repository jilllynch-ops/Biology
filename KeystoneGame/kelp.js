/* Earthling Field Guide: KELP COVE (part of cozy mode, uses the hiking system in coast.js).
   A cold, foggy, rocky shore reached by the cliff trail at the east end of Sunset Cove's beach.
   Out in the water: a forest of giant kelp (stalks from the rocky floor up to a floating canopy at the surface),
   sea otters floating on their backs cracking urchins, rockfish among the stalks, bat stars, giant green anemones,
   and a harbor seal resting on a rock. To the east the kelp is gone: an URCHIN BARREN, bare pink-crusted rock covered in
   purple urchins. The science story: when urchins become too many, they eat the kelp forest down to bare rock. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
if (!BQ.coast || !BQ.coast.lib) return;
const C = BQ.core, T = C.T, tx = C.tx, L = BQ.coast.lib;

const EN = {
  kelp: ['Giant kelp', 'Giant kelp is a huge brown alga, not a plant, and one of the fastest-growing living things on Earth: up to about 60 cm in a day. Like the trees of a forest, it makes food from sunlight by photosynthesis, and hundreds of kinds of animals live in it.'],
  canopy: ['The kelp canopy', 'Little gas-filled floats at the base of each blade lift the kelp toward the surface, where the sunlight is strongest. There the blades spread out into a floating canopy, like the treetops of a forest.'],
  holdfast: ['Holdfast', 'Kelp has no roots. A tangle of tough, finger-like holdfasts grips the rock so waves can\'t tear it away. The kelp takes in water and nutrients through its blades, not its holdfast. Hungry urchins can chew through a holdfast and set the whole kelp adrift.'],
  otter: ['Sea otter', 'Sea otters eat sea urchins, crabs and clams, often cracking them open on their bellies while floating on their backs. They have no blubber, just very thick fur, so they must eat about a quarter of their body weight every day to stay warm. By eating urchins, otters help keep the kelp forest healthy.'],
  urchin: ['Purple sea urchin', 'Sea urchins are spiny grazers that eat kelp. When predators such as sea otters and sea stars keep their numbers down, urchins mostly hide in cracks and eat bits of kelp that drift by. But when there are too many urchins, they come out of hiding and eat the living kelp.'],
  barren: ['Urchin barren', 'This used to be kelp forest. When the urchin population grew too large, the urchins ate the kelp down to bare rock, and the fish and other animals that lived in it left. Starving urchins can survive here for years, which keeps new kelp from growing back. In Northern California, most of the kelp forests disappeared this way after 2014, when warm water and a disease that killed urchin-eating sea stars let the urchins multiply.'],
  rockfish: ['Rockfish', 'Many kinds of rockfish live in kelp forests, hiding among the stalks. Young rockfish shelter in the kelp canopy, safe from bigger predators. Without the forest, they lose their nursery and much of their food.'],
  seal: ['Harbor seal', 'Harbor seals hunt fish, squid and octopus in and around the kelp forest, then haul out on rocks to rest. A thick layer of blubber keeps them warm in the cold water.'],
  batstar: ['Bat star', 'Bat stars have short, webbed arms and come in many colors: red, orange, purple and yellow. They crawl over the rocks eating dead plants and animals, helping clean up the sea floor.'],
  anemone: ['Giant green anemone', 'This anemone is an animal. It stings small animals with its tentacles and pulls them into its mouth. Its green color comes partly from tiny algae living inside it: the algae get a safe home, and the anemone gets some of the food they make from sunlight.']
};
const ES = {
  kelp: ['Kelp gigante', 'El kelp gigante es un alga parda enorme, no una planta, y uno de los seres vivos que crecen más rápido en la Tierra: hasta unos 60 cm en un día. Como los árboles de un bosque, fabrica su alimento con la luz del sol mediante la fotosíntesis, y en él viven cientos de tipos de animales.'],
  canopy: ['El dosel de kelp', 'Unos pequeños flotadores llenos de gas en la base de cada hoja elevan el kelp hacia la superficie, donde la luz del sol es más fuerte. Allí las hojas se extienden formando un dosel flotante, como las copas de los árboles de un bosque.'],
  holdfast: ['Rizoide (disco de fijación)', 'El kelp no tiene raíces. Una maraña de rizoides duros, como dedos, se agarra a la roca para que las olas no lo arranquen. El kelp absorbe agua y nutrientes por sus hojas, no por el rizoide. Los erizos hambrientos pueden roer un rizoide y dejar todo el kelp a la deriva.'],
  otter: ['Nutria marina', 'Las nutrias marinas comen erizos de mar, cangrejos y almejas, y a menudo los abren sobre la barriga mientras flotan boca arriba. No tienen grasa, solo un pelaje muy denso, así que deben comer cerca de una cuarta parte de su peso cada día para mantenerse calientes. Al comer erizos, las nutrias ayudan a mantener sano el bosque de kelp.'],
  urchin: ['Erizo de mar morado', 'Los erizos de mar son pastadores espinosos que comen kelp. Cuando depredadores como las nutrias marinas y las estrellas de mar mantienen baja su población, los erizos casi siempre se esconden en grietas y comen trozos de kelp que pasan a la deriva. Pero cuando hay demasiados erizos, salen de sus escondites y se comen el kelp vivo.'],
  barren: ['Desierto de erizos', 'Esto antes era un bosque de kelp. Cuando la población de erizos creció demasiado, los erizos se comieron el kelp hasta dejar la roca desnuda, y los peces y otros animales que vivían en él se fueron. Los erizos hambrientos pueden sobrevivir aquí durante años, lo que impide que el kelp vuelva a crecer. En el norte de California, la mayoría de los bosques de kelp desaparecieron así después de 2014, cuando el agua cálida y una enfermedad que mató a las estrellas de mar que comen erizos permitieron que los erizos se multiplicaran.'],
  rockfish: ['Peces de roca', 'Muchos tipos de peces de roca viven en los bosques de kelp, escondidos entre los tallos. Los peces de roca jóvenes se refugian en el dosel de kelp, a salvo de depredadores más grandes. Sin el bosque, pierden su guardería y gran parte de su alimento.'],
  seal: ['Foca común', 'Las focas comunes cazan peces, calamares y pulpos dentro y alrededor del bosque de kelp, y luego salen a descansar sobre las rocas. Una gruesa capa de grasa las mantiene calientes en el agua fría.'],
  batstar: ['Estrella murciélago', 'Las estrellas murciélago tienen brazos cortos unidos por una membrana y son de muchos colores: rojo, naranja, morado y amarillo. Recorren las rocas comiendo plantas y animales muertos, y ayudan a limpiar el fondo del mar.'],
  anemone: ['Anémona verde gigante', 'Esta anémona es un animal. Pica a animales pequeños con sus tentáculos y los lleva a su boca. Su color verde viene en parte de algas diminutas que viven dentro de ella: las algas tienen un hogar seguro y la anémona recibe parte del alimento que ellas fabrican con la luz del sol.']
};
Object.keys(EN).forEach(function (k) { C.I18N.en['fd.n.ko_' + k] = EN[k][0]; C.I18N.en['fd.d.ko_' + k] = EN[k][1]; C.I18N.es['fd.n.ko_' + k] = ES[k][0]; C.I18N.es['fd.d.ko_' + k] = ES[k][1]; });
Object.assign(C.I18N.en, { 'ko.title': 'Kelp Cove', 'ko.down': 'Hiking along the cliffs to Kelp Cove…', 'ko.up': 'Hiking back to Willow Creek…', 'ko.hopBack': 'Hiking back along the cliffs to Sunset Cove…', 'ko.back': 'Hike back to',
  'ko.welcome': 'Kelp Cove: a cold, rocky shore with a forest of giant kelp. Swim out and dive between the kelp stalks (Space swims up, C or X dives). Get close to animals, plants and places to scan them into your Field Guide. Look east, past the kelp: something has gone wrong over there.',
  'ko.sign': '🌿 To Kelp Cove', 'cz.t.kelp': 'the cliff trail to Kelp Cove' });
Object.assign(C.I18N.es, { 'ko.title': 'Caleta del Kelp', 'ko.down': 'Caminando por los acantilados hasta la Caleta del Kelp…', 'ko.up': 'Volviendo a Willow Creek…', 'ko.hopBack': 'Volviendo por los acantilados a la Cala del Atardecer…', 'ko.back': 'Volver a',
  'ko.welcome': 'Caleta del Kelp: una costa fría y rocosa con un bosque de kelp gigante. Nada mar adentro y bucea entre los tallos de kelp (Espacio sube, C o X bucea). Acércate a animales, plantas y lugares para escanearlos en tu Guía de Campo. Mira hacia el este, más allá del kelp: allí algo ha salido mal.',
  'ko.sign': '🌿 A la Caleta del Kelp', 'cz.t.kelp': 'el sendero de los acantilados hasta la Caleta del Kelp' });

/* ---------- THE LAND AND SEA FLOOR ---------- */
function ss(a, b, x) { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); }
function shoreZ(x) { return 4 + 3 * Math.sin(x * 0.08) + 1.5 * Math.sin(x * 0.21 + 1); } /* land to the north (smaller z), sea to the south */
const ROCKS = [ /* rocks that stand out of the water: the seal's resting rock, two tall sea stacks, a shore rock with anemones at its foot */
  { x: -14, z: shoreZ(-14) + 7, r: 2.5, h: 4, top: 0.75 }, { x: -31, z: shoreZ(-31) + 36, r: 3.2, h: 16, top: 9 }, { x: 31, z: shoreZ(31) + 31, r: 3.6, h: 17, top: 11 }, { x: 6, z: shoreZ(6) + 3.2, r: 2.0, h: 3, top: 1.0 }];
const SEAL = ROCKS[0], ANROCK = ROCKS[3];
function H(x, z) {
  const s = z - shoreZ(x); let h;
  if (s < 0) { const d = -s, cliff = 1.5 + 6.5 * ss(-42, -26, x); /* a cobble beach, then cliffs (low at the west end, where the trail comes down) */
    h = d * 0.12 + ss(8, 13, d) * cliff + Math.max(0, d - 13) * 0.05 + (Math.sin(x * 0.31) * Math.cos(z * 0.27) * 0.8 + Math.sin(x * 0.8 + z * 0.6) * 0.2) * ss(6, 12, d) + 0.05 * Math.sin(x * 2.3) * Math.cos(z * 2.1);
    h += Math.max(0, Math.abs(x) - 44) * 0.6;
  } else {
    h = s < 7 ? -s * 0.36 : -2.52 - (s - 7) * 0.17; h = Math.max(h, -9.4);
    h += (Math.sin(x * 0.35) * Math.cos(z * 0.3) * 0.7 + Math.sin(x * 0.9 + z * 0.7) * 0.25 + 0.12 * Math.sin(x * 2.1 + z * 1.3)) * ss(3, 10, s); /* rocky reef floor */
    h += Math.max(0, Math.abs(x) - 46) * 0.5;
  }
  for (let i = 0; i < ROCKS.length; i++) { const k = ROCKS[i], dx = x - k.x, dz = z - k.z, q = (dx * dx + dz * dz) / (k.r * k.r); if (q < 4) h = Math.max(h, Math.min(k.top + 0.15 * Math.sin(x * 2 + z), h + k.h * Math.exp(-q * q * 0.7) * (1 + 0.15 * Math.sin(x * 1.7) * Math.cos(z * 1.3)))); }
  return h;
}
function water(x, z) { return (z - shoreZ(x) > -1 && H(x, z) < -0.05) ? 0 : null; }
const START = { x: -37, z: shoreZ(-37) - 4 }, FIRE = { x: 999, z: 999 };
function barrenK(x) { return ss(10, 20, x); } /* 0 in the kelp forest, 1 in the urchin barren */
const HF = { x: -6, z: shoreZ(-6) + 11 }, URC = { x: 3, z: shoreZ(3) + 15 }, BAR = { x: 28, z: shoreZ(28) + 20 }, BAT = { x: -22, z: shoreZ(-22) + 6 };

/* ---------- Field Guide places ---------- */
const FINDS = [
  { id: 'ko_kelp', x: -16, z: shoreZ(-16) + 22, y: -3, r: 9, ry: 7 },
  { id: 'ko_canopy', x: -24, z: shoreZ(-24) + 15, y: 0, r: 6, ry: 2.2 },
  { id: 'ko_holdfast', x: HF.x, z: HF.z, y: H(HF.x, HF.z) + 0.4, r: 3.2, ry: 2.6 },
  { id: 'ko_otter', at: function (K) { return K.ko ? K.ko.otterAt : null; }, r: 5, ry: 4 },
  { id: 'ko_urchin', x: URC.x, z: URC.z, y: H(URC.x, URC.z) + 0.3, r: 3.6, ry: 3.4 },
  { id: 'ko_barren', x: BAR.x, z: BAR.z, y: H(BAR.x, BAR.z) + 0.6, r: 9, ry: 6 },
  { id: 'ko_rockfish', at: function (K) { return K.ko ? K.ko.fishAt : null; }, r: 4.2, ry: 3.5 },
  { id: 'ko_seal', x: SEAL.x, z: SEAL.z, y: 1.2, r: 5.5, ry: 4.5 },
  { id: 'ko_batstar', x: BAT.x, z: BAT.z, y: H(BAT.x, BAT.z) + 0.2, r: 3.4, ry: 3.4 },
  { id: 'ko_anemone', x: ANROCK.x - 1.6, z: ANROCK.z + 1.4, y: -0.8, r: 3.4, ry: 3 }
];

/* ---------- shapes ---------- */
function kelpGeo() { /* one giant kelp, 1 unit tall (stretched to the water depth): a stalk with blades and little gas floats all the way up */
  const parts = [], st = new T.CylinderGeometry(0.035, 0.05, 1, 5, 10); st.translate(0, 0.5, 0); { const p = st.attributes.position; for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + Math.sin(p.getY(i) * 7) * 0.03); } parts.push(st);
  for (let i = 0; i < 15; i++) { const y0 = 0.06 + i * 0.062, a = i * 2.4, ca = Math.cos(a), sa = Math.sin(a), P = [], I = [], n = 6;
    for (let k = 0; k <= n; k++) { const t = k / n, out = 0.06 + t * 0.55, w = 0.08 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.7) + 0.012, y = y0 + t * 0.085 + Math.sin(t * 9) * 0.004, cx = ca * out, cz = sa * out;
      P.push(cx - sa * w, y, cz + ca * w, cx + sa * w, y, cz - ca * w); if (k < n) { const b = k * 2; I.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); } }
    const bg = new T.BufferGeometry(); bg.setAttribute('position', new T.Float32BufferAttribute(P, 3)); bg.setIndex(I); bg.computeVertexNormals(); parts.push(bg);
    parts.push(L.place(new T.SphereGeometry(1, 5, 4), ca * 0.06, y0, sa * 0.06, 0.035, 0.008, 0.035)); }
  const g = L.merge(parts); L.colorize(g, function (x, y, z, ny, o) { const c = new T.Color('#3a2c12').lerp(new T.Color('#b08a2c'), Math.min(1, y * 1.1)); if (Math.hypot(x, z) > 0.2) c.offsetHSL(0.01, 0.05, 0.04); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); return g; }
function canopyGeo() { const fr = []; for (let f = 0; f < 7; f++) { const g0 = L.frondGeo(1.4 + (f % 3) * 0.25, 0.19, 0.02, 0, 7, '#7a6224', '#b8963e', 1); g0.rotateY(f / 7 * 6.283 + (f % 2) * 0.4); fr.push(g0); }
  const g = L.merge(fr); g.attributes.aFlex.array.fill(1); const nn = g.attributes.normal; for (let i = 0; i < nn.count; i++) nn.setXYZ(i, 0, -1, 0); return g; } /* the strips face down, so their lit side (the back face) is the top */ /* the whole canopy drifts with the top of its stalk */
function urchinGeo() { const parts = [], body = new T.IcosahedronGeometry(1, 1); parts.push(body); const N = 46;
  for (let i = 0; i < N; i++) { const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), a = i * 2.39996, d = new T.Vector3(Math.cos(a) * r, y, Math.sin(a) * r); if (d.y < -0.55) continue;
    const sp = new T.ConeGeometry(0.07, 1.1, 3); sp.translate(0, 0.55 + 0.85, 0); sp.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), d))); parts.push(sp); }
  const g = L.merge(parts), p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < -0.6) p.setY(i, -0.6); g.computeVertexNormals();
  L.colorize(g, function (x, y, z, ny, o) { const r = Math.hypot(x, y, z), c = new T.Color('#3a1a4a').lerp(new T.Color('#9a6ad0'), ss(1.1, 2.2, r)); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); return g; }
function starGeo() { const P = [0, 0.28, 0], I = []; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283, r = i % 2 ? 0.62 : 1; P.push(Math.cos(a) * r, 0, Math.sin(a) * r); I.push(0, 1 + ((i + 1) % 10), 1 + i); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g; }
function anemoneGeo() { const parts = [], col = new T.CylinderGeometry(0.5, 0.62, 0.55, 12, 2); col.translate(0, 0.27, 0); parts.push(col); const disc = new T.CircleGeometry(0.5, 12); disc.rotateX(-Math.PI / 2); disc.translate(0, 0.551, 0); parts.push(disc);
  for (let ring = 0; ring < 3; ring++) for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + ring * 0.2, r = 0.2 + ring * 0.13, t = new T.ConeGeometry(0.045, 0.32 - ring * 0.04, 4); t.translate(0, 0.16, 0); t.rotateZ(-(0.25 + ring * 0.35)); t.rotateY(-a); t.translate(Math.cos(a) * r, 0.55, Math.sin(a) * r); parts.push(t); }
  const g = L.merge(parts); L.colorize(g, function (x, y, z, ny, o) { const c = y < 0.5 ? new T.Color('#3e6a4a') : new T.Color('#5fcf96').lerp(new T.Color('#b8f0c8'), ss(0.6, 0.85, y)); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); return g; }
function fishGeo(back, belly) { const b = L.place(new T.SphereGeometry(1, 10, 7), 0, 0, 0, 0.11, 0.15, 0.36), tl = new T.ConeGeometry(0.5, 0.6, 4); tl.rotateX(-Math.PI / 2); tl.translate(0, 0, -1.15);
  const t2 = L.place(tl, 0, 0, 0, 0.04, 0.16, 0.36), fin = L.place(new T.ConeGeometry(1, 1, 3), 0, 0.15, 0.02, 0.02, 0.1, 0.24, 0, Math.PI / 2), g = L.merge([b, t2, fin]);
  L.colorize(g, function (x, y, z, ny, o) { const c = new T.Color(back).lerp(new T.Color(belly), ss(0.04, -0.08, y)); if (z > 0.27 && Math.abs(x) > 0.05 && y > 0.02) c.set('#111111'); o[0] = c.r; o[1] = c.g; o[2] = c.b; }); return g; }
function otter(wrap) { const g = new T.Group(), fur = new T.MeshLambertMaterial({ color: '#4a3220' }), face = new T.MeshLambertMaterial({ color: '#b8a488' }), dark = new T.MeshBasicMaterial({ color: '#141010' });
  const body = new T.Mesh(new T.SphereGeometry(1, 12, 8), fur); body.scale.set(0.24, 0.17, 0.56); g.add(body);
  const chest = new T.Mesh(new T.SphereGeometry(1, 10, 6), new T.MeshLambertMaterial({ color: '#6a4a30' })); chest.scale.set(0.2, 0.12, 0.3); chest.position.set(0, 0.07, 0.18); g.add(chest);
  const head = new T.Group(); head.position.set(0, 0.1, 0.6); g.add(head); const hm = new T.Mesh(new T.SphereGeometry(0.17, 12, 8), face); hm.scale.set(1, 0.9, 1); head.add(hm);
  const muz = new T.Mesh(new T.SphereGeometry(0.08, 8, 6), face); muz.position.set(0, 0.05, 0.13); head.add(muz); const nose = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), dark); nose.position.set(0, 0.09, 0.19); head.add(nose);
  [-1, 1].forEach(function (sd) { const e = new T.Mesh(new T.SphereGeometry(0.022, 6, 4), dark); e.position.set(sd * 0.07, 0.12, 0.1); head.add(e); const ear = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), fur); ear.position.set(sd * 0.13, 0.06, -0.03); head.add(ear); });
  head.rotation.x = -0.5; /* floating on its back, chin tucked, looking at its belly */
  const paws = new T.Group(); paws.position.set(0, 0.16, 0.24); g.add(paws); [-1, 1].forEach(function (sd) { const p = new T.Mesh(new T.SphereGeometry(0.05, 6, 4), fur); p.position.set(sd * 0.08, 0, 0); paws.add(p); });
  const ur = new T.Mesh(new T.IcosahedronGeometry(0.065, 1), new T.MeshLambertMaterial({ color: '#5a2a7a' })); ur.position.set(0, 0.05, 0.02); paws.add(ur);
  [-1, 1].forEach(function (sd) { const f = new T.Mesh(new T.SphereGeometry(1, 8, 5), fur); f.scale.set(0.09, 0.03, 0.14); f.position.set(sd * 0.12, 0.12, -0.6); f.rotation.x = 0.6; g.add(f); });
  const tail = new T.Mesh(new T.SphereGeometry(1, 8, 5), fur); tail.scale.set(0.09, 0.04, 0.3); tail.position.set(0, -0.02, -0.75); g.add(tail);
  if (wrap) { const band = new T.Mesh(new T.TorusGeometry(0.25, 0.04, 5, 14), new T.MeshLambertMaterial({ color: '#8a6a22' })); band.scale.set(1, 0.75, 1); band.rotation.x = Math.PI / 2; band.position.z = -0.05; g.add(band); }
  g.userData = { paws: paws, head: head }; return g; }

/* ---------- BUILD ---------- */
function build(K) {
  const g = new T.Group(), LO = L.low(), R = L.rng(71), cc = new T.Color(); K.g = g; K.colliders = []; C.scene.add(g); K.ko = {};
  C.scene.background = new T.Color('#b9c4c8'); C.scene.fog = new T.FogExp2('#b4c0c4', 0.0135);
  C.HEMI.color.set('#dfe8ec'); C.HEMI.groundColor.set('#3a3a32'); C.HEMI.intensity = 0.72; C.KEYL.color.set('#f2f0e6'); C.KEYL.intensity = 0.8; C.KEYL.position.set(-30, 80, 50);
  K.sky = new T.Mesh(new T.SphereGeometry(900, 24, 12), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false, vertexShader: 'varying vec3 vD; void main() { vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'varying vec3 vD; void main() { vec3 d = normalize(vD); float y = d.y; vec3 c = mix(vec3(0.74, 0.78, 0.79), vec3(0.50, 0.60, 0.70), smoothstep(0.0, 0.6, y)); float cl = sin(d.x * 9.0 + d.z * 4.0) * sin(d.z * 7.0 - d.x * 3.0); c = mix(c, vec3(0.82, 0.84, 0.85), smoothstep(0.2, 0.9, cl) * smoothstep(0.02, 0.25, y) * 0.5); gl_FragColor = vec4(c, 1.0); }' }));
  K.sky.renderOrder = -10; g.add(K.sky);
  /* ground and sea floor: the same height grid that walking and swimming use */
  const NX = LO ? 100 : 150, NZ = LO ? 90 : 135, geo = new T.PlaneGeometry(100, 92, NX, NZ); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, 20);
  const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, H(pos.getX(i), pos.getZ(i))); geo.computeVertexNormals();
  L.colorize(geo, function (x, y, z, ny, o) { const n = Math.sin(x * 0.41 + Math.cos(z * 0.33) * 2) * Math.cos(z * 0.27 - x * 0.13), s = z - shoreZ(x), bk = barrenK(x);
    if (y < -0.25 && s > -1) { cc.set(n > 0.2 ? '#4f4c44' : '#5e5a50').lerp(new T.Color('#3e4a34'), Math.max(0, -n) * 0.5 * (1 - bk)); /* rocky floor; a little green-brown under the kelp */
      if (bk > 0 && Math.sin(x * 0.9 + z * 0.7) + n > -0.6) cc.lerp(new T.Color('#c8849a'), 0.85 * bk); } /* pink coralline crust on the bare rock of the barren */
    else if (ny < 0.72) { const bands = ['#4f4a44', '#5d564c', '#463f3a', '#625a50'], bi = Math.floor((y + 20) / 0.8 + Math.sin(x * 0.5) * 0.7); cc.set(bands[((bi % 4) + 4) % 4]).offsetHSL(0, 0, Math.sin(x * 2.1 + z * 1.7) * 0.03); } /* cliffs */
    else if (s > -9) cc.set(n > 0 ? '#6e675c' : '#5e584e').offsetHSL(0, 0, Math.sin(x * 3.1 + z * 2.7) * 0.04); /* cobble beach */
    else cc.set(n > 0.25 ? '#6a7444' : '#55633a').lerp(new T.Color('#7a7050'), Math.max(0, -n - 0.4)); /* coastal grass on the bluff */
    if (ROCKS.some(function (k) { return Math.hypot(x - k.x, z - k.z) < k.r * 1.6 && y > -0.6; })) cc.set(y > 0.4 && ny > 0.7 ? '#7a7468' : '#4e4a46'); /* sea stacks: dark, with pale tops */
    o[0] = cc.r; o[1] = cc.g; o[2] = cc.b; });
  g.add(new T.Mesh(geo, L.causticify(new T.MeshLambertMaterial({ vertexColors: true }), 'koground', 0)));
  /* the sea: a detailed piece over the cove (its depth comes from the floor) and a plain piece out to the foggy horizon */
  const wopt = { shallow: '#5a9a8a', deep: '#0f3436', skyH: '#c4ccd0', skyM: '#a4b4c0', skyT: '#7a8ea4', sunC: '#f0eee0', foam: 0.7, sun: new T.Vector3(-0.3, 0.75, 0.55).normalize() };
  { const wg = new T.PlaneGeometry(100, 76, LO ? 70 : 110, LO ? 55 : 85); wg.rotateX(-Math.PI / 2); wg.translate(0, 0, 28); const wp = wg.attributes.position, dep = new Float32Array(wp.count); for (let i = 0; i < wp.count; i++) dep[i] = Math.max(0, -H(wp.getX(i), wp.getZ(i)));
    wg.setAttribute('aDepth', new T.BufferAttribute(dep, 1)); K.waterM = L.waterMat(false, wopt); const w = new T.Mesh(wg, K.waterM); w.renderOrder = 2; g.add(w);
    const fg = new T.PlaneGeometry(2400, 2400, 1, 1); fg.rotateX(-Math.PI / 2); fg.setAttribute('aDepth', new T.BufferAttribute(new Float32Array(4).fill(30), 1)); K.farM = L.waterMat(true, wopt); K.farM.uniforms.uHole.value.set(-50, 50, -10, 66);
    const far = new T.Mesh(fg, K.farM); far.position.y = -0.03; far.renderOrder = 1; g.add(far); }
  /* far headlands fading into the fog */
  { const parts = []; [[-120, 60, 50, 40], [-160, 160, 70, 34], [130, 70, 60, 46], [190, 190, 80, 30], [0, -120, 160, 60]].forEach(function (m, i) { const cg = new T.ConeGeometry(m[2], m[3], 9, 3); cg.computeVertexNormals();
      L.colorize(cg, function (x, y, z, ny, o) { const c0 = new T.Color('#4e5a4a').lerp(new T.Color('#6a6a60'), y > 0 ? 0.5 : 0); o[0] = c0.r; o[1] = c0.g; o[2] = c0.b; }); parts.push(L.place(cg, m[0], m[3] / 2 - 4, m[1], 1, 1, 1, i)); });
    g.add(new T.Mesh(L.merge(parts), new T.MeshLambertMaterial({ vertexColors: true, flatShading: true }))); }
  /* ---------- the kelp forest ---------- */
  const stalks = [], nK = LO ? 80 : 150;
  stalks.push({ x: HF.x, z: HF.z, big: true });
  for (let tries = 0; stalks.length < nK && tries < 9000; tries++) { const x = -44 + R() * 60, z = shoreZ(x) + 8 + R() * 44, y = H(x, z); if (y > -2.6 || R() < ss(4, 14, x) || ROCKS.some(function (k) { return Math.hypot(x - k.x, z - k.z) < k.r + 1.6; })) continue;
    if (stalks.some(function (p) { return Math.hypot(p.x - x, p.z - z) < 2.0; })) continue; stalks.push({ x: x, z: z }); }
  const KL = [], CL = [], HL = [];
  stalks.forEach(function (st, i) { const y = H(st.x, st.z), ry = R() * 6.283, hgt = -y + 0.12; st.ry = ry; KL.push([st.x, y - 0.05, st.z, 1, hgt, 1, ry]); CL.push([st.x, 0.07, st.z, 0.9 + R() * 0.4, 1, 0.9 + R() * 0.4, ry]);
    HL.push([st.x, y + 0.05, st.z, st.big ? 0.75 : 0.32, st.big ? 0.45 : 0.2, st.big ? 0.75 : 0.32, ry]); });
  K.ko.stalks = stalks;
  g.add(K.ko.kelpIM = L.inst(kelpGeo(), L.causticify(L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.45, 0.55, 'y', 'kelp'), 'kelpc', 0), KL));
  g.add(L.inst(canopyGeo(), L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }), 0.45, 0.55, 'attr', 'kelpcan'), CL));
  { const hg = new T.IcosahedronGeometry(1, 1), hp = hg.attributes.position; for (let i = 0; i < hp.count; i++) { const v = new T.Vector3(hp.getX(i), hp.getY(i), hp.getZ(i)), k = 1 + 0.3 * Math.sin(v.x * 7 + v.z * 5) * Math.cos(v.y * 6); hp.setXYZ(i, v.x * k, Math.max(0, v.y) * k, v.z * k); } hg.computeVertexNormals();
    g.add(L.inst(hg, L.causticify(new T.MeshLambertMaterial({ color: '#5a4418', flatShading: true }), 'holdf', 0), HL)); }
  /* ---------- rocks, boulders, bat stars, anemones ---------- */
  { const rk = new T.IcosahedronGeometry(1, 2), rp = rk.attributes.position; for (let i = 0; i < rp.count; i++) { const v = new T.Vector3(rp.getX(i), rp.getY(i), rp.getZ(i)), k = 1 + 0.16 * Math.sin(v.x * 4.1 + v.z * 3.3) + 0.08 * Math.cos(v.y * 5.7 + v.x * 2); rp.setXYZ(i, v.x * k, Math.max(-0.25, v.y * k * 0.75), v.z * k); }
    rk.computeVertexNormals(); const RL = [], RC = [];
    for (let tries = 0; RL.length < (LO ? 16 : 26) && tries < 3000; tries++) { const x = -44 + R() * 88, z = shoreZ(x) + 3 + R() * 50, y = H(x, z), r = 0.8 + R() * 1.3; if (y > -1.5 || ROCKS.some(function (k) { return Math.hypot(x - k.x, z - k.z) < k.r + r + 1; }) || stalks.some(function (p) { return Math.hypot(p.x - x, p.z - z) < r + 0.4; })) continue;
      RL.push([x, y + r * 0.1, z, r * 1.2, r, r, R() * 6]); RC.push(barrenK(x) > 0.5 ? '#9a7884' : '#5a5850'); K.colliders.push({ x: x, z: z, r: r * 1.05, top: y + r * 0.8 }); }
    [[-30, shoreZ(-30) - 1.5, 1.4], [-18, shoreZ(-18) - 2.2, 1.1], [14, shoreZ(14) - 1.0, 1.5], [24, shoreZ(24) - 2.5, 1.2], [38, shoreZ(38) - 1.2, 1.6]].forEach(function (b) { const y = H(b[0], b[1]); RL.push([b[0], y + b[2] * 0.2, b[1], b[2] * 1.2, b[2], b[2], b[0]]); RC.push('#5e5a54'); K.colliders.push({ x: b[0], z: b[1], r: b[2] * 1.05, top: y + b[2] * 0.95 }); });
    K.ko.boulders = RL; g.add(L.inst(rk, L.causticify(new T.MeshLambertMaterial({ color: '#ffffff', flatShading: true }), 'korock', 0), RL, RC));
    ROCKS.forEach(function (k) { if (k.top < 2) K.colliders.push({ x: k.x, z: k.z, r: k.r * 0.6, top: k.top + 0.05 }); }); /* you can climb onto the low rocks */
    const cobble = new T.DodecahedronGeometry(1, 0), CB = []; for (let i = 0; i < (LO ? 70 : 160); i++) { const x = -44 + R() * 88, s = -R() * 8, z = shoreZ(x) + s, y = H(x, z), sc = 0.12 + R() * 0.22; CB.push([x, y + sc * 0.2, z, sc * 1.3, sc * 0.7, sc, R() * 6]); }
    g.add(L.inst(cobble, L.causticify(new T.MeshLambertMaterial({ color: '#7a7268', flatShading: true }), 'kocob', 0), CB));
    const SL = [], SC = [], cols = ['#d8582a', '#c83a3a', '#7a3a8a', '#e0a030', '#e07a3a']; const addStar = function (x, z, sc) { const y = H(x, z); SL.push([x, y + 0.02, z, sc, sc, sc, R() * 6]); SC.push(cols[SL.length % cols.length]); };
    addStar(BAT.x, BAT.z, 0.34); for (let i = 0; i < 4; i++) addStar(BAT.x + Math.cos(i * 1.7) * 1.6, BAT.z + Math.sin(i * 1.7) * 1.3, 0.24 + R() * 0.08);
    for (let tries = 0; SL.length < (LO ? 14 : 28) && tries < 2000; tries++) { const x = -44 + R() * 60, z = shoreZ(x) + 2 + R() * 40; if (H(x, z) > -0.5) continue; addStar(x, z, 0.22 + R() * 0.1); }
    g.add(L.inst(starGeo(), L.causticify(new T.MeshLambertMaterial({ color: '#ffffff' }), 'kostar', 0), SL, SC));
    const AL = []; for (let i = 0; i < 9; i++) { const a = 1.6 + i * 0.55, x = ANROCK.x + Math.cos(a) * (ANROCK.r * 0.95 + (i % 2) * 0.5), z = ANROCK.z + Math.sin(a) * (ANROCK.r * 0.95 + (i % 2) * 0.5), y = H(x, z); if (y > -0.35) continue; AL.push([x, y - 0.03, z, 0.32 + (i % 3) * 0.05, 0.32, 0.32 + (i % 3) * 0.05, i]); }
    for (let i = 0; i < 5; i++) { const a = i * 1.25 + 0.5, x = SEAL.x + Math.cos(a) * (SEAL.r + 0.6), z = SEAL.z + Math.sin(a) * (SEAL.r + 0.6), y = H(x, z); if (y < -0.4) AL.push([x, y - 0.03, z, 0.3, 0.3, 0.3, i]); }
    g.add(L.inst(anemoneGeo(), L.causticify(L.windyOf(new T.MeshLambertMaterial({ vertexColors: true, emissive: '#0a2414' }), 0.06, 1.3, 'y', 'anem'), 'anemc', 0), AL)); }
  /* ---------- sea urchins: a few hiding in cracks in the forest, a purple carpet in the barren ---------- */
  { const UL = [], base = []; const add = function (x, z, sc) { const y = H(x, z); UL.push([x, y + sc * 0.45, z, sc, sc, sc, R() * 6]); base.push({ x: x, z: z, sc: sc, ph: R() * 6.28, sp: 0.03 + R() * 0.05 }); };
    for (let i = 0; i < 7; i++) add(URC.x + Math.cos(i * 0.9) * (0.4 + i * 0.12), URC.z + Math.sin(i * 0.9) * (0.4 + i * 0.12), 0.15 + R() * 0.05);
    (K.ko.boulders || []).slice(0, 10).forEach(function (b) { if (barrenK(b[0]) > 0.3) return; const a = R() * 6.28; add(b[0] + Math.cos(a) * b[3] * 0.95, b[2] + Math.sin(a) * b[5] * 0.95, 0.14 + R() * 0.05); });
    for (let tries = 0; UL.length < (LO ? 170 : 340) && tries < 9000; tries++) { const near = R() < 0.7, a = R() * 6.283, rr = Math.sqrt(R()) * 13, x = near ? BAR.x + Math.cos(a) * rr : 12 + R() * 34, z = near ? BAR.z + Math.sin(a) * rr * 1.2 : shoreZ(x) + 6 + R() * 48, y = H(x, z);
      if (y > -1.2 || R() > barrenK(x) || ROCKS.some(function (k) { return Math.hypot(x - k.x, z - k.z) < k.r * 0.9; })) continue; add(x, z, 0.17 + R() * 0.09); } /* most of them crowd around the middle of the barren */
    K.ko.urIM = L.inst(urchinGeo(), L.causticify(new T.MeshLambertMaterial({ vertexColors: true }), 'urch', 0), UL); g.add(K.ko.urIM); K.ko.ur = base;
    /* dead kelp stubs in the barren: chewed-off stalks with no blades */
    const SB = []; for (let tries = 0; SB.length < (LO ? 10 : 18) && tries < 2000; tries++) { const x = 13 + R() * 30, z = shoreZ(x) + 8 + R() * 40, y = H(x, z); if (y > -2.5 || R() > barrenK(x)) continue; SB.push([x, y, z, 1, 0.25 + R() * 0.5, 1, R() * 6, (R() - 0.5) * 0.4]); }
    const stub = new T.CylinderGeometry(0.03, 0.06, 1, 5); stub.translate(0, 0.5, 0); g.add(L.inst(stub, L.causticify(new T.MeshLambertMaterial({ color: '#4a3a1a' }), 'stub', 0), SB)); }
  /* ---------- the bluff: wind-shaped spruce, coastal shrubs, driftwood on the beach ---------- */
  { const trunk = new T.CylinderGeometry(0.2, 0.38, 1, 7); trunk.translate(0, 0.5, 0); const tier = new T.ConeGeometry(1, 1, 8, 1, true); tier.translate(0, 0.5, 0);
    const TR = [], CN = [], CC = [], tiers = LO ? 3 : 5, greens = ['#26402e', '#2c4834', '#22382a']; K.pineT = [];
    for (let tries = 0, n = 0; n < (LO ? 14 : 26) && tries < 3000; tries++) { const x = -46 + R() * 92, z = shoreZ(x) - 14 - R() * 12, y = H(x, z); if (z < -25 || Math.hypot(x - START.x, z - START.z) < 6) continue; if (TR.some(function (t) { return Math.hypot(t[0] - x, t[2] - z) < 4; })) continue; n++;
      const hgt = 8 + R() * 7, rad = 1.8 + R() * 0.9, lean = 0.12; TR.push([x, y - 0.2, z, 1.4, hgt * 0.5, 1.4, 0, lean]); K.pineT.push({ x: x, z: z, cr: rad, bot: y + hgt * 0.25, i0: CN.length, ti: TR.length - 1, n: tiers });
      for (let k = 0; k < tiers; k++) { const u = k / tiers; CN.push([x - u * 0.8, y + hgt * (0.25 + u * 0.66), z, rad * (1 - u * 0.75) * 1.15, hgt * 0.18, rad * (1 - u * 0.75) * 0.85, 0.3]); CC.push(greens[(n + k) % 3]); } K.colliders.push({ x: x, z: z, r: 0.5, top: y + hgt }); }
    g.add(K.trunkIM = L.inst(trunk, new T.MeshLambertMaterial({ color: '#4a3a2e' }), TR)); g.add(K.pineIM = L.inst(tier, L.windyOf(new T.MeshLambertMaterial({ color: '#ffffff', side: T.DoubleSide }), 0.06, 0.9, 'y', 'kospruce'), CN, CC));
    const bush = L.merge([new T.IcosahedronGeometry(1, 1), L.place(new T.IcosahedronGeometry(1, 1), 0.8, -0.15, 0.3, 0.75, 0.7, 0.75)]); L.colorize(bush, function (x, y, z, ny, o) { const c = new T.Color('#3e5430').lerp(new T.Color('#7a8a4a'), Math.max(0, y) * 0.5); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
    const BI = []; for (let tries = 0; BI.length < (LO ? 14 : 28) && tries < 2000; tries++) { const x = -46 + R() * 92, z = shoreZ(x) - 9 - R() * 12, y = H(x, z), s0 = 0.6 + R() * 0.6; if (Math.hypot(x - START.x, z - START.z) < 4) continue; BI.push([x, y + s0 * 0.4, z, s0 * 1.2, s0 * 0.8, s0, R() * 6]); K.colliders.push({ x: x, z: z, r: s0, top: y + s0 * 1.1 }); }
    g.add(L.inst(bush, L.windyOf(new T.MeshLambertMaterial({ vertexColors: true }), 0.05, 1.1, 'y', 'kobush'), BI));
    const parts = []; [[-24, shoreZ(-24) - 4.5, 0.4, 6, 0.3], [-4, shoreZ(-4) - 5.5, 1.9, 5, 0.25], [20, shoreZ(20) - 4.0, 0.2, 7, 0.35]].forEach(function (l) { const x = l[0], z = l[1], a = l[2], len = l[3], r = l[4], y = H(x, z) + r * 0.7;
      const cg = new T.CylinderGeometry(r, r * 1.1, len, 9, 3); L.colorize(cg, function (xx, yy, zz, ny, o) { const c = Math.abs(ny) > 0.9 ? new T.Color('#c8b8a0') : new T.Color('#a8988a').offsetHSL(0, 0, Math.sin(yy * 9) * 0.04); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
      parts.push(L.place(cg, x, y, z, 1, 1, 1, a, 0, Math.PI / 2)); for (let t = -len / 2 + r; t <= len / 2 - r + 0.01; t += r * 1.4) K.colliders.push({ x: x + Math.cos(a) * t, z: z - Math.sin(a) * t, r: r, top: y + r }); });
    g.add(new T.Mesh(L.merge(parts), new T.MeshLambertMaterial({ vertexColors: true }))); }
  /* ---------- animals ---------- */
  /* sea otters floating on their backs in the canopy; one is wrapped in kelp, one dives for urchins now and then */
  K.ko.otters = [[-20, 18, true], [-10, 24, false], [-28, 27, false]].map(function (o, i) { const m = otter(o[2]); m.scale.setScalar(1.25); m.rotation.order = 'YXZ'; g.add(m); return { m: m, x: o[0], z: shoreZ(o[0]) + o[1], yaw: i * 2.1, ph: i * 1.7, mode: 'float', t: 8 + i * 9, diver: i === 1, d: 0 }; });
  /* rockfish: small schools hovering among the kelp */
  K.ko.schools = [[-18, 20, -3.2, '#c8502a', '#f0b080', 12], [-30, 30, -4.5, '#4a5a74', '#a8b4c4', 14], [-4, 30, -4.0, '#b84a2a', '#e8a070', 10]].map(function (s, j) { const n = LO ? Math.ceil(s[5] * 0.6) : s[5], list = []; for (let i = 0; i < n; i++) list.push([0, -50, 0, 1, 1, 1, 0]);
    const im = L.inst(fishGeo(s[3], s[4]), L.causticify(new T.MeshLambertMaterial({ vertexColors: true }), 'kofish' + j, 0), list); im.frustumCulled = false; g.add(im);
    const fish = []; for (let i = 0; i < n; i++) fish.push({ a: R() * 6.28, r: 1.2 + R() * 2.2, dy: (R() - 0.5) * 1.6, sp: 0.18 + R() * 0.12, off: new T.Vector3(), ph: R() * 6 }); return { im: im, x: s[0], z: shoreZ(s[0]) + s[1], y: s[2], fish: fish }; });
  /* harbor seal resting on its rock: grey with dark spots, head and tail lifted like a banana */
  { const sg = new T.Group(), sm0 = new T.MeshLambertMaterial({ vertexColors: true }), sm = new T.MeshLambertMaterial({ color: '#86867e' }), dark = new T.MeshBasicMaterial({ color: '#111' });
    const bgeo = new T.SphereGeometry(1, 16, 10); L.colorize(bgeo, function (x, y, z, ny, o) { const sp = Math.sin(x * 23 + z * 7) * Math.sin(z * 19 - y * 11) > 0.55, c = new T.Color(y < -0.3 ? '#b8b4aa' : '#8a8a84'); if (sp) c.set('#4a4a48'); o[0] = c.r; o[1] = c.g; o[2] = c.b; });
    const body = new T.Mesh(bgeo, sm0); body.scale.set(0.42, 0.34, 0.95); sg.add(body); const head = new T.Group(); head.position.set(0, 0.22, 0.85); sg.add(head);
    const hm = new T.Mesh(new T.SphereGeometry(0.26, 12, 8), sm); head.add(hm); const mz = new T.Mesh(new T.SphereGeometry(0.13, 10, 6), new T.MeshLambertMaterial({ color: '#9a968c' })); mz.position.set(0, -0.04, 0.22); head.add(mz);
    [-1, 1].forEach(function (sd) { const e = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), dark); e.position.set(sd * 0.12, 0.07, 0.19); head.add(e); const fl = new T.Mesh(new T.SphereGeometry(1, 8, 5), sm); fl.scale.set(0.05, 0.03, 0.17); fl.position.set(sd * 0.38, -0.2, 0.35); fl.rotation.y = sd * 0.5; sg.add(fl);
      const hf = new T.Mesh(new T.SphereGeometry(1, 8, 5), sm); hf.scale.set(0.12, 0.03, 0.22); hf.position.set(sd * 0.1, 0.12, -1.05); hf.rotation.x = -0.5; sg.add(hf); });
    const nose = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), dark); nose.position.set(0, -0.0, 0.34); head.add(nose);
    sg.position.set(SEAL.x, SEAL.top + 0.32, SEAL.z); sg.rotation.y = 1.2; sg.rotation.x = -0.05; g.add(sg); K.ko.seal = sg; K.ko.sealHead = head; K.colliders.push({ x: SEAL.x, z: SEAL.z, r: 1.0, top: SEAL.top + 0.7 }); }
  /* ---------- light: sunbeams and drifting specks under water (shown only when you dive) ---------- */
  { const dot = L.softDot(); K.rays = []; for (let i = 0; i < 6; i++) { const rm = new T.Mesh(new T.PlaneGeometry(2.2, 14), new T.MeshBasicMaterial({ color: '#d8f0c8', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false })); rm.visible = false; g.add(rm); K.rays.push({ m: rm, ph: i * 1.3, ox: (i - 2.5) * 3.2, oz: (i % 2) * 2 - 1 }); }
    const mN = LO ? 120 : 260, mp = new Float32Array(mN * 3); for (let i = 0; i < mN; i++) { mp[i * 3] = R() * 24 - 12; mp[i * 3 + 1] = R() * 10 - 5; mp[i * 3 + 2] = R() * 24 - 12; }
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(mp, 3)); K.motes = new T.Points(mg, new T.PointsMaterial({ map: dot, color: '#fff0c0', size: 0.13, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false })); K.motes.frustumCulled = false; g.add(K.motes); }
  /* signposts: back along the cliffs to Sunset Cove, and the cove's name */
  { const post = function (x, z, text, w) { const y = H(x, z), p = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 2.6, 6), new T.MeshLambertMaterial({ color: '#6a4a32' })); p.position.set(x, y + 1.3, z); g.add(p);
      const lb = C.label(text, w, { bd: '#ffd166' }); lb.position.set(x, y + 3.0, z); g.add(lb); K.colliders.push({ x: x, z: z, r: 0.25, top: y + 2.6 }); };
    post(START.x - 2.6, START.z - 1.2, '🌅 ' + tx('co.title'), 2.6); post(-22, shoreZ(-22) - 7.5, '🌿 ' + tx('ko.title'), 2.0); }
  L.addPlayer(g);
}
function step(dt, K) {
  const ko = K.ko, t = K.t, o = K._ko || (K._ko = new T.Object3D());
  /* otters */
  ko.otters.forEach(function (ot, i) { const m = ot.m; ot.t -= dt;
    if (ot.mode === 'float') { const dx = ot.x - K.px, dz = ot.z - K.pz, d = Math.hypot(dx, dz); if (d < 4.5 && K.py > -3 && d > 0.01) { const nx = ot.x + dx / d * dt * 0.9, nz = ot.z + dz / d * dt * 0.9; if (H(nx, nz) < -2.2 && nz - shoreZ(nx) < 48 && nx > -44 && nx < 12) { ot.x = nx; ot.z = nz; } } /* paddles away from you, staying in the forest */
      ot.yaw += Math.sin(t * 0.13 + ot.ph) * dt * 0.15; m.position.set(ot.x, 0.06 + Math.sin(t * 1.3 + ot.ph) * 0.05, ot.z); m.rotation.set(Math.sin(t * 1.1 + ot.ph) * 0.06, ot.yaw, Math.sin(t * 0.9 + ot.ph) * 0.08);
      m.userData.paws.position.y = 0.16 + Math.abs(Math.sin(t * 5 + ot.ph)) * 0.07 * (Math.sin(t * 0.4 + ot.ph) > 0 ? 1 : 0.2); m.userData.head.rotation.y = Math.sin(t * 0.5 + ot.ph) * 0.3;
      if (ot.diver && ot.t <= 0 && d > 5) { ot.mode = 'dive'; ot.t = 9; ot.floor = H(ot.x, ot.z) + 0.6; } }
    else { const u = 1 - ot.t / 9, depth = ot.floor * Math.sin(Math.PI * Math.min(1, u)), roll = Math.PI * ss(0, 0.08, u) * (1 - ss(0.92, 1, u)); /* rolls over, swims down to the floor, comes back up with an urchin */
      m.position.set(ot.x + Math.sin(u * 6.28) * 0.6, Math.min(0.06, depth), ot.z); m.rotation.set(0.9 * Math.cos(Math.PI * u) * (1 - ss(0.9, 1, u)) * ss(0, 0.1, u), ot.yaw, roll); m.userData.paws.position.y = 0.16;
      if (ot.t <= 0) { ot.mode = 'float'; ot.t = 16 + Math.random() * 10; } }
    if (i === 0) ko.otterAt = [m.position.x, m.position.y, m.position.z]; });
  /* rockfish: hover and drift among the stalks, sliding away from you */
  let fx = 0, fy = 0, fz = 0, fn = 0; ko.schools.forEach(function (sc, j) { sc.fish.forEach(function (f, i) { f.a += dt * f.sp; const x = sc.x + Math.cos(f.a) * f.r, z = sc.z + Math.sin(f.a) * f.r * 0.8, y = sc.y + f.dy + Math.sin(t * 0.7 + f.ph) * 0.2;
      const dx = x + f.off.x - K.px, dz = z + f.off.z - K.pz, dd = Math.hypot(dx, dz, y - K.py); if (dd < 2.6 && dd > 0.01) { f.off.x += dx / dd * (2.6 - dd) * 2 * dt; f.off.z += dz / dd * (2.6 - dd) * 2 * dt; } f.off.multiplyScalar(1 - dt * 0.4);
      const px = x + f.off.x, pz = z + f.off.z, py = Math.min(Math.max(y, H(px, pz) + 0.4), -0.5); o.position.set(px, py, pz); o.rotation.set(0, f.a + Math.PI + Math.sin(t * 6 + f.ph) * 0.08, 0); o.scale.setScalar(0.85 + (i % 3) * 0.12); o.updateMatrix(); sc.im.setMatrixAt(i, o.matrix);
      if (j === 0) { fx += px; fy += py; fz += pz; fn++; } }); sc.im.instanceMatrix.needsUpdate = true; });
  if (fn) ko.fishAt = [fx / fn, fy / fn, fz / fn];
  /* urchins creep very slowly over the rock (a few at a time, to save work) */
  ko.urT = (ko.urT || 0) - dt; if (ko.urT <= 0) { ko.urT = 0.12; const im = ko.urIM; ko.ur.forEach(function (u, i) { const a = t * u.sp + u.ph, x = u.x + Math.cos(a) * 0.25, z = u.z + Math.sin(a * 0.8) * 0.25, y = H(x, z); o.position.set(x, y + u.sc * 0.45, z); o.rotation.set(0, u.ph + t * 0.02, 0); o.scale.setScalar(u.sc); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); im.instanceMatrix.needsUpdate = true; }
  /* kelp stalks right next to the camera step aside so they never fill the screen */
  ko.kT = (ko.kT || 0) - dt; if (ko.kT <= 0 && C.cam) { ko.kT = 0.15; const im = ko.kelpIM, a = im.instanceMatrix.array, cp = C.cam.position; if (!ko.kM) ko.kM = a.slice(); let dirty = false;
    ko.stalks.forEach(function (st, i) { const near = Math.hypot(st.x - cp.x, st.z - cp.z) < 1.5 && Math.hypot(st.x - K.px, st.z - K.pz) > 1.0 && cp.y < 0.3; if (near === !!st.hid) return; st.hid = near; dirty = true; for (let j = 0; j < 16; j++) a[i * 16 + j] = near ? 0 : ko.kM[i * 16 + j]; });
    if (dirty) im.instanceMatrix.needsUpdate = true; }
  /* the seal breathes and looks around */
  ko.seal.scale.set(1, 1 + Math.sin(t * 1.2) * 0.02, 1); ko.sealHead.rotation.set(-0.35 + Math.sin(t * 0.21) * 0.15, Math.sin(t * 0.33) * 0.6, 0);
}
BQ.coast.addArea('kelp', { H: H, water: water, start: START, fire: FIRE, bounds: { x0: -45, x1: 45, z0: -18, z1: 62 }, build: build, step: step, look: [-12, 26], sign: 'ko.sign', title: 'ko.title', icon: '🌿',
  down: 'ko.down', up: 'ko.up', back: 'ko.back', backT: 'co.title', hopBack: 'ko.hopBack', welcome: 'ko.welcome', flag: 'kelp', mood: 'water', under: ['#2d5a4e', 0.052], finds: FINDS,
  from: 'cove', fromAt: { x: 51, z: 14 } });
/* the cliff trail from the east end of Sunset Cove's beach */
const cove = BQ.coast.areas.cove; cove.links = (cove.links || []).concat([{ x: 55, z: 15, to: 'kelp', label: 'cz.t.kelp', sign: 'ko.sign' }]);
BQ.kelp = { H: H, shoreZ: shoreZ, START: START, SEAL: SEAL, HF: HF, URC: URC, BAR: BAR, BAT: BAT, ANROCK: ANROCK, FINDS: FINDS };
}
if (BQ.core && BQ.coast) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

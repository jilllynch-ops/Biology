/* COZY EXPLORATION ADVENTURE (second game mode)
   A relaxed third-person 3-D nature reserve: no lives, no timers, no enemies.
   Explore, observe (E), collect samples, use the microscope and test kit, and solve "The Quiet Pond" mystery.
   This file only uses shared pieces from engine.js (FieldGuide.core); the platformer is not changed.
   All player-facing text uses translation keys (cz.*) with English and Spanish below. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
/* engine.js finishes setting up after the world files load, so wait for it */
function init() {
const C = BQ.core, T = C.T, tx = C.tx;

/* ---------- TEXT: English and Spanish ---------- */
Object.assign(C.I18N.en, {
  'cz.reserve': 'Willow Creek Reserve', 'cz.mode': 'Cozy Exploration',
  'cz.controls': 'Move: WASD or arrow keys · Run: Shift · Jump: Space (hold in the air to glide) · Interact: E · Journal: J · Turn camera: drag the mouse or Q / R · Menu: Esc',
  'cz.journal': 'Journal', 'cz.menu': 'Menu', 'cz.resume': 'Keep exploring', 'cz.toMenu': 'Main menu', 'cz.paused': 'Taking a break',
  'cz.recorded': 'Recorded in your Field Journal ✓', 'cz.next': 'E: continue', 'cz.choose': 'Choose with 1, 2, 3 or click',
  'cz.observe': 'Observe', 'cz.investigate': 'Investigate', 'cz.collect': 'Collect a sample', 'cz.talk': 'Talk to', 'cz.examine': 'Examine', 'cz.test': 'Test', 'cz.plant': 'Plant a seedling', 'cz.listen': 'Listen',
  'cz.t.frog': 'the frog', 'cz.t.log': 'the rotting log', 'cz.t.bee': 'the flowers', 'cz.t.rabbit': 'the rabbit', 'cz.t.overlook': 'the view', 'cz.t.sun': 'the sunny clover', 'cz.t.shade': 'the shady ferns',
  'cz.t.oak': 'the oak leaves', 'cz.t.pond': 'the pond water', 'cz.t.scope': 'the microscope', 'cz.t.kit': 'the oxygen in the water', 'cz.t.bags': 'the fertilizer bags', 'cz.t.glow': 'the glowing mushrooms', 'cz.t.fish': 'the fish',
  'cz.t.ama': 'Dr. Ama', 'cz.t.pip': 'Pip', 'cz.t.lu': 'Farmer Lu', 'cz.t.spot': 'here',
  'cz.n.frog': 'Green frog', 'cz.n.log': 'Mushrooms on a rotting log', 'cz.n.bee': 'Bee and flowers', 'cz.n.rabbit': 'Rabbit and hawk', 'cz.n.overlook': 'The overlook',
  'cz.n.sun': 'Sun-loving clover', 'cz.n.shade': 'Shade ferns', 'cz.n.leafcell': 'Leaf cells (microscope)', 'cz.n.algae': 'Pond water (microscope)', 'cz.n.glow': 'Glowing mushrooms', 'cz.n.fish': 'The fish are back',
  'cz.d.frog': 'The frog sees you and jumps into the water. Living things RESPOND to changes around them. A frog breathes through its lungs and also through its thin, wet skin.',
  'cz.d.log': 'Mushrooms are growing all over this old log. Mushrooms are fungi: DECOMPOSERS. They break down dead wood and return its nutrients to the soil, where plants can use them again.',
  'cz.d.bee': 'A bee drinks nectar and gets covered in pollen. When it visits the next flower, it carries pollen along. Both win: the bee gets food and the plant can make seeds. This is MUTUALISM.',
  'cz.d.rabbit': 'A rabbit nibbles clover while a hawk circles above. Clover is a PRODUCER, the rabbit is a PRIMARY CONSUMER, and the hawk is a SECONDARY CONSUMER. Energy flows from the Sun to the clover to the rabbit to the hawk.',
  'cz.d.overlook': 'From up here you can see the whole reserve: forest, meadow, pond, and farm. They are all one ECOSYSTEM. Water flows downhill from the farm to the pond, so what happens uphill affects everything below.',
  'cz.d.sun': 'In the open meadow the clover is thick and tall. Plants use light energy to make their own food (PHOTOSYNTHESIS), so more light means more growth.',
  'cz.d.shade': 'Under the thick trees, only a few ferns grow, and they are small. Very little sunlight reaches the forest floor, so plants here have less energy for photosynthesis.',
  'cz.d.compare': 'You compared the sunny clover and the shady ferns. Evidence: plants in more light grew bigger. Conclusion: light is a limiting factor for plant growth because plants need it for photosynthesis.',
  'cz.d.leafcell': 'Under the microscope the leaf is made of boxy cells. Each one has a stiff CELL WALL and many green CHLOROPLASTS, where photosynthesis happens. Animal cells have neither.',
  'cz.d.algae': 'The pond sample is crowded with green ALGAE cells, much more than a healthy pond. Tiny rod-shaped BACTERIA are breaking down dead algae. Decomposers use oxygen as they work.',
  'cz.d.glow': 'A hidden hollow full of mushrooms that glow! Some fungi make their own light with a chemical reaction (BIOLUMINESCENCE). Like the log mushrooms, they are decomposers.',
  'cz.d.fish': 'Fish are swimming in clear water again. Fish take in DISSOLVED OXYGEN from the water with their gills. With less algae, the water holds enough oxygen for them.',
  'cz.ev.water': 'The pond water is green and cloudy. A thick layer of algae covers the surface.',
  'cz.ev.oxygen': 'Oxygen test: 2 mg/L. Most fish need at least 5 mg/L of dissolved oxygen to breathe.',
  'cz.ev.micro': 'Microscope: far too many algae cells, plus bacteria breaking down the dead ones.',
  'cz.ev.farm': 'Fertilizer (nitrogen and phosphorus) washes from the farm into the stream when it rains, and the stream flows into the pond.',
  'cz.m.title': 'The Quiet Pond', 'cz.m.o0': 'Explore the reserve. Someone by the pond looks worried.', 'cz.m.o1': 'Ask Dr. Ama at the research station for help.',
  'cz.m.o2': 'Gather evidence ({n} of 4): look at the pond water, test its oxygen, look at a water sample under the microscope, and follow the stream uphill.',
  'cz.m.o3': 'You have enough evidence. Tell Dr. Ama your explanation.', 'cz.m.o4': 'Plant seedlings along the stream ({n} of 5) at the glowing spots.', 'cz.m.o5': 'Mystery solved! Keep exploring: there are more secrets in the reserve.',
  'cz.m.evidence': 'Evidence', 'cz.m.need': 'Still to find', 'cz.m.solved': 'Solved',
  'cz.s.ama1': 'Welcome to Willow Creek Reserve! Explore wherever you like. When something sparkles, walk up and press E to observe it.',
  'cz.s.ama2': 'Everything you discover goes into your Field Journal. Press J any time to read it.',
  'cz.s.pip1': 'Hi! I fish here every day, but I haven\'t seen a single fish in weeks. And the water used to be so clear...',
  'cz.s.pip2': 'Could you find out what happened? Dr. Ama at the research station might help.',
  'cz.s.pipW': 'Any luck finding out what happened to the fish?', 'cz.s.pipDone': 'The fish are back! Thank you, scientist!',
  'cz.s.ama3': 'Missing fish? Let\'s investigate like scientists: gather evidence first, then explain.',
  'cz.s.ama4': 'Take this sample jar and this oxygen test kit. Look closely at the pond, test the water, bring a sample back to my microscope, and see where the water comes from.',
  'cz.s.amaW': 'Keep gathering evidence. You have {n} of 4 clues. The more evidence, the better the explanation.',
  'cz.s.ama5': 'Let\'s hear it. Based on your evidence, why did the fish disappear?',
  'cz.c.a': 'Fertilizer washed into the pond, so algae grew out of control. When the algae died, decomposers used up the oxygen the fish need.',
  'cz.c.b': 'The water became too cold for the fish.', 'cz.c.c': 'A predator ate all the fish.',
  'cz.f.b': 'Hmm. Is there evidence about temperature? Look at your oxygen test and the microscope. What do they tell you?',
  'cz.f.c': 'Did you find any evidence of a predator? Think about what the oxygen test showed, and what was crowding the water.',
  'cz.s.ama6': 'Excellent reasoning! Scientists call this EUTROPHICATION: too many nutrients cause an algae bloom, and decomposers use up the oxygen.',
  'cz.s.ama7': 'Plants along a stream soak up fertilizer before it reaches the pond. Plant seedlings at the 5 glowing spots along the stream.',
  'cz.s.amaDone': 'Look at that clear water! Thanks to you, the pond ecosystem is healthy again. Keep exploring: I hear there is a hidden hollow somewhere in the forest.',
  'cz.s.lu1': 'Howdy! I spread fertilizer so my corn grows big and fast.', 'cz.s.lu2': 'When it rains, some of it washes down this ditch into the stream. I never thought about where it ends up...',
  'cz.s.luDone': 'Those plants along the stream catch the runoff now. Good for my neighbors, good for the fish!',
  'cz.s.needJar': 'You need a sample jar. Dr. Ama at the research station has one.', 'cz.s.needKit': 'You need an oxygen test kit. Dr. Ama at the research station has one.',
  'cz.s.scopeEmpty': 'The microscope is ready. Collect a sample first: a leaf from the oak tree, or water from the pond.',
  'cz.s.scopeDone': 'You looked at all your samples.', 'cz.s.gotLeaf': 'You collected a leaf sample. Take it to the microscope at the research station.',
  'cz.s.gotPond': 'You collected a pond water sample. Take it to the microscope at the research station.',
  'cz.s.planted': 'You planted a seedling. Its roots will soak up nutrients from the runoff.', 'cz.s.clearing': 'The pond is starting to clear...',
  'cz.a.cz-first': 'Field Scientist', 'cz.a.cz-first.d': 'Make your first observation in Willow Creek Reserve.',
  'cz.a.cz-detective': 'Pond Detective', 'cz.a.cz-detective.d': 'Solve the mystery of the quiet pond.',
  'cz.a.cz-hollow': 'Hidden Hollow', 'cz.a.cz-hollow.d': 'Find the secret hollow in the forest.',
  'cz.a.cz-compare': 'Fair Comparison', 'cz.a.cz-compare.d': 'Compare plants in sun and shade.',
  'cz.a.cz-all': 'Reserve Expert', 'cz.a.cz-all.d': 'Record every discovery in Willow Creek Reserve.',
  'cz.j.tip': 'Discoveries from the Cozy Exploration mode. Walk up to anything that sparkles and press E.', 'cz.j.found': '{n} of {m} discoveries'
});
Object.assign(C.I18N.es, {
  'cz.reserve': 'Reserva Arroyo de los Sauces', 'cz.mode': 'Exploración tranquila',
  'cz.controls': 'Moverse: WASD o flechas · Correr: Shift · Saltar: Espacio (mantenlo en el aire para planear) · Interactuar: E · Diario: J · Girar la cámara: arrastra el ratón o Q / R · Menú: Esc',
  'cz.journal': 'Diario', 'cz.menu': 'Menú', 'cz.resume': 'Seguir explorando', 'cz.toMenu': 'Menú principal', 'cz.paused': 'Un descanso',
  'cz.recorded': 'Guardado en tu diario de campo ✓', 'cz.next': 'E: continuar', 'cz.choose': 'Elige con 1, 2, 3 o haz clic',
  'cz.observe': 'Observar', 'cz.investigate': 'Investigar', 'cz.collect': 'Tomar una muestra', 'cz.talk': 'Hablar', 'cz.examine': 'Examinar', 'cz.test': 'Medir', 'cz.plant': 'Plantar un brote', 'cz.listen': 'Escuchar',
  'cz.t.frog': 'la rana', 'cz.t.log': 'el tronco podrido', 'cz.t.bee': 'las flores', 'cz.t.rabbit': 'el conejo', 'cz.t.overlook': 'la vista', 'cz.t.sun': 'el trébol al sol', 'cz.t.shade': 'los helechos a la sombra',
  'cz.t.oak': 'las hojas del roble', 'cz.t.pond': 'el agua del estanque', 'cz.t.scope': 'el microscopio', 'cz.t.kit': 'el oxígeno del agua', 'cz.t.bags': 'los sacos de fertilizante', 'cz.t.glow': 'los hongos brillantes', 'cz.t.fish': 'los peces',
  'cz.t.ama': 'con la Dra. Ama', 'cz.t.pip': 'con Pip', 'cz.t.lu': 'con la granjera Lu', 'cz.t.spot': 'aquí',
  'cz.n.frog': 'Rana verde', 'cz.n.log': 'Hongos en un tronco podrido', 'cz.n.bee': 'Abeja y flores', 'cz.n.rabbit': 'Conejo y halcón', 'cz.n.overlook': 'El mirador',
  'cz.n.sun': 'Trébol que ama el sol', 'cz.n.shade': 'Helechos de sombra', 'cz.n.leafcell': 'Células de hoja (microscopio)', 'cz.n.algae': 'Agua del estanque (microscopio)', 'cz.n.glow': 'Hongos que brillan', 'cz.n.fish': 'Los peces regresaron',
  'cz.d.frog': 'La rana te ve y salta al agua. Los seres vivos RESPONDEN a los cambios a su alrededor. Una rana respira con sus pulmones y también a través de su piel fina y húmeda.',
  'cz.d.log': 'Hay hongos por todo este tronco viejo. Los hongos son DESCOMPONEDORES: descomponen la madera muerta y devuelven sus nutrientes al suelo, donde las plantas pueden usarlos otra vez.',
  'cz.d.bee': 'Una abeja bebe néctar y se cubre de polen. Al visitar la siguiente flor, lleva el polen consigo. Ambos ganan: la abeja obtiene alimento y la planta puede hacer semillas. Esto es MUTUALISMO.',
  'cz.d.rabbit': 'Un conejo come trébol mientras un halcón vuela en círculos. El trébol es un PRODUCTOR, el conejo es un CONSUMIDOR PRIMARIO y el halcón es un CONSUMIDOR SECUNDARIO. La energía fluye del Sol al trébol, al conejo y al halcón.',
  'cz.d.overlook': 'Desde aquí arriba se ve toda la reserva: bosque, pradera, estanque y granja. Todo forma un solo ECOSISTEMA. El agua baja de la granja al estanque, así que lo que pasa arriba afecta a todo lo de abajo.',
  'cz.d.sun': 'En la pradera abierta el trébol crece espeso y alto. Las plantas usan la energía de la luz para fabricar su propio alimento (FOTOSÍNTESIS), así que más luz significa más crecimiento.',
  'cz.d.shade': 'Bajo los árboles tupidos crecen pocos helechos, y son pequeños. Muy poca luz llega al suelo del bosque, así que las plantas tienen menos energía para la fotosíntesis.',
  'cz.d.compare': 'Comparaste el trébol al sol y los helechos a la sombra. Evidencia: las plantas con más luz crecieron más. Conclusión: la luz es un factor limitante para el crecimiento porque las plantas la necesitan para la fotosíntesis.',
  'cz.d.leafcell': 'Bajo el microscopio, la hoja está formada por células en forma de caja. Cada una tiene una PARED CELULAR rígida y muchos CLOROPLASTOS verdes, donde ocurre la fotosíntesis. Las células animales no tienen ninguno de los dos.',
  'cz.d.algae': 'La muestra del estanque está llena de células verdes de ALGAS, muchas más que en un estanque sano. Unas diminutas BACTERIAS en forma de bastón descomponen las algas muertas. Los descomponedores usan oxígeno mientras trabajan.',
  'cz.d.glow': '¡Un hueco escondido lleno de hongos que brillan! Algunos hongos producen su propia luz con una reacción química (BIOLUMINISCENCIA). Igual que los hongos del tronco, son descomponedores.',
  'cz.d.fish': 'Los peces nadan otra vez en agua clara. Los peces toman el OXÍGENO DISUELTO del agua con sus branquias. Con menos algas, el agua tiene suficiente oxígeno para ellos.',
  'cz.ev.water': 'El agua del estanque está verde y turbia. Una capa gruesa de algas cubre la superficie.',
  'cz.ev.oxygen': 'Prueba de oxígeno: 2 mg/L. La mayoría de los peces necesitan al menos 5 mg/L de oxígeno disuelto para respirar.',
  'cz.ev.micro': 'Microscopio: demasiadas células de algas, y bacterias que descomponen las algas muertas.',
  'cz.ev.farm': 'Cuando llueve, el fertilizante (nitrógeno y fósforo) de la granja llega al arroyo, y el arroyo desemboca en el estanque.',
  'cz.m.title': 'El estanque silencioso', 'cz.m.o0': 'Explora la reserva. Alguien junto al estanque parece preocupado.', 'cz.m.o1': 'Pide ayuda a la Dra. Ama en la estación de investigación.',
  'cz.m.o2': 'Reúne evidencia ({n} de 4): mira el agua del estanque, mide su oxígeno, observa una muestra de agua al microscopio y sigue el arroyo cuesta arriba.',
  'cz.m.o3': 'Tienes suficiente evidencia. Cuéntale tu explicación a la Dra. Ama.', 'cz.m.o4': 'Planta brotes a lo largo del arroyo ({n} de 5) en los puntos que brillan.', 'cz.m.o5': '¡Misterio resuelto! Sigue explorando: hay más secretos en la reserva.',
  'cz.m.evidence': 'Evidencia', 'cz.m.need': 'Por encontrar', 'cz.m.solved': 'Resuelto',
  'cz.s.ama1': '¡Bienvenido a la Reserva Arroyo de los Sauces! Explora donde quieras. Cuando algo brille, acércate y pulsa E para observarlo.',
  'cz.s.ama2': 'Todo lo que descubras se guarda en tu diario de campo. Pulsa J cuando quieras para leerlo.',
  'cz.s.pip1': '¡Hola! Pesco aquí todos los días, pero hace semanas que no veo ni un pez. Y el agua antes era tan clara...',
  'cz.s.pip2': '¿Podrías averiguar qué pasó? La Dra. Ama, en la estación de investigación, quizá pueda ayudar.',
  'cz.s.pipW': '¿Ya sabes qué les pasó a los peces?', 'cz.s.pipDone': '¡Volvieron los peces! ¡Gracias, científico!',
  'cz.s.ama3': '¿Faltan peces? Investiguemos como científicos: primero reunimos evidencia y después explicamos.',
  'cz.s.ama4': 'Toma este frasco para muestras y este kit para medir oxígeno. Mira bien el estanque, analiza el agua, trae una muestra a mi microscopio y averigua de dónde viene el agua.',
  'cz.s.amaW': 'Sigue reuniendo evidencia. Tienes {n} de 4 pistas. Cuanta más evidencia, mejor será la explicación.',
  'cz.s.ama5': 'Te escucho. Según tu evidencia, ¿por qué desaparecieron los peces?',
  'cz.c.a': 'El fertilizante llegó al estanque y las algas crecieron sin control. Cuando las algas murieron, los descomponedores gastaron el oxígeno que necesitan los peces.',
  'cz.c.b': 'El agua se volvió demasiado fría para los peces.', 'cz.c.c': 'Un depredador se comió todos los peces.',
  'cz.f.b': 'Mmm. ¿Hay alguna evidencia sobre la temperatura? Mira tu prueba de oxígeno y el microscopio. ¿Qué te dicen?',
  'cz.f.c': '¿Encontraste evidencia de un depredador? Piensa en lo que mostró la prueba de oxígeno y en lo que llenaba el agua.',
  'cz.s.ama6': '¡Excelente razonamiento! Los científicos lo llaman EUTROFIZACIÓN: el exceso de nutrientes causa una proliferación de algas, y los descomponedores agotan el oxígeno.',
  'cz.s.ama7': 'Las plantas junto a un arroyo absorben el fertilizante antes de que llegue al estanque. Planta brotes en los 5 puntos brillantes a lo largo del arroyo.',
  'cz.s.amaDone': '¡Mira qué agua tan clara! Gracias a ti, el ecosistema del estanque está sano otra vez. Sigue explorando: dicen que hay un hueco escondido en algún lugar del bosque.',
  'cz.s.lu1': '¡Hola! Echo fertilizante para que mi maíz crezca grande y rápido.', 'cz.s.lu2': 'Cuando llueve, parte se va por esta zanja hasta el arroyo. Nunca pensé adónde llegaba...',
  'cz.s.luDone': 'Ahora las plantas junto al arroyo atrapan lo que escurre. ¡Bueno para mis vecinos y para los peces!',
  'cz.s.needJar': 'Necesitas un frasco para muestras. La Dra. Ama, en la estación de investigación, tiene uno.', 'cz.s.needKit': 'Necesitas un kit para medir oxígeno. La Dra. Ama, en la estación de investigación, tiene uno.',
  'cz.s.scopeEmpty': 'El microscopio está listo. Primero toma una muestra: una hoja del roble o agua del estanque.',
  'cz.s.scopeDone': 'Ya observaste todas tus muestras.', 'cz.s.gotLeaf': 'Tomaste una muestra de hoja. Llévala al microscopio de la estación de investigación.',
  'cz.s.gotPond': 'Tomaste una muestra de agua del estanque. Llévala al microscopio de la estación de investigación.',
  'cz.s.planted': 'Plantaste un brote. Sus raíces absorberán los nutrientes que escurren.', 'cz.s.clearing': 'El estanque empieza a aclararse...',
  'cz.a.cz-first': 'Científico de campo', 'cz.a.cz-first.d': 'Haz tu primera observación en la Reserva Arroyo de los Sauces.',
  'cz.a.cz-detective': 'Detective del estanque', 'cz.a.cz-detective.d': 'Resuelve el misterio del estanque silencioso.',
  'cz.a.cz-hollow': 'Hueco escondido', 'cz.a.cz-hollow.d': 'Encuentra el hueco secreto del bosque.',
  'cz.a.cz-compare': 'Comparación justa', 'cz.a.cz-compare.d': 'Compara plantas al sol y a la sombra.',
  'cz.a.cz-all': 'Experto de la reserva', 'cz.a.cz-all.d': 'Registra todos los descubrimientos de la reserva.',
  'cz.j.tip': 'Descubrimientos del modo Exploración tranquila. Acércate a todo lo que brille y pulsa E.', 'cz.j.found': '{n} de {m} descubrimientos'
});
/* achievements for this mode (their text uses the cz.a.* keys) */
['cz-first', 'cz-compare', 'cz-hollow', 'cz-detective', 'cz-all'].forEach(function (id, i) {
  C.ACH.push({ id: id, ic: ['🌿', '⚖️', '🍄', '🐟', '🦉'][i], tier: i < 2 ? 'short' : i < 4 ? 'medium' : 'long' });
  C.I18N.en['a.' + id] = C.I18N.en['cz.a.' + id]; C.I18N.en['a.' + id + '.d'] = C.I18N.en['cz.a.' + id + '.d'];
  C.I18N.es['a.' + id] = C.I18N.es['cz.a.' + id]; C.I18N.es['a.' + id + '.d'] = C.I18N.es['cz.a.' + id + '.d'];
});

/* ---------- DISCOVERIES (journal entries) ---------- */
const FINDS = [
  { id: 'frog', look: 'frog', col: '#5fbf5a' }, { id: 'log', look: 'mushroom', col: '#c0503a' }, { id: 'bee', look: 'sprout', col: '#ffd166' }, { id: 'rabbit', look: 'critter', col: '#d8c8b0' },
  { id: 'overlook', look: 'grass', col: '#6ac04a' }, { id: 'sun', look: 'grass', col: '#7be06a' }, { id: 'shade', look: 'sprout', col: '#3f8a3a' }, { id: 'leafcell', look: 'cell', col: '#7be06a' },
  { id: 'algae', look: 'drop', col: '#7be06a' }, { id: 'glow', look: 'mushroom', col: '#9fffd8' }, { id: 'fish', look: 'rod', col: '#ff9f6e' }];

/* ---------- WORLD SHAPE ---------- */
const POND = { x: -20, z: 22 }, HILL = { x: 42, z: -42 }, FARM = { x: -52, z: -40 }, HOLLOW = { x: 56, z: 40 }, STATION = { x: 6, z: -6 }, STREAM = [[-44, -30], [-36, -12], [-30, 4], [-26, 12]];
function segDist(x, z, a, b) { const vx = b[0] - a[0], vz = b[1] - a[1], wx = x - a[0], wz = z - a[1], u = Math.max(0, Math.min(1, (wx * vx + wz * vz) / (vx * vx + vz * vz))); return Math.hypot(x - a[0] - u * vx, z - a[1] - u * vz); }
function streamDist(x, z) { let d = 1e9; for (let i = 0; i < STREAM.length - 1; i++) d = Math.min(d, segDist(x, z, STREAM[i], STREAM[i + 1])); return d; }
function H(x, z) {
  let h = 1.4 * Math.sin(x * 0.05) * Math.cos(z * 0.045) + 1.0 * Math.sin((x - z) * 0.032) + 0.5 * Math.sin(x * 0.13 + 1) * Math.sin(z * 0.11);
  h += 13 * Math.exp(-((x - HILL.x) ** 2 + (z - HILL.z) ** 2) / 520);
  h -= 4.2 * Math.exp(-((x - POND.x) ** 2 + (z - POND.z) ** 2) / 170);
  const blend = function (cx, cz, r, fall, lvl) { const d = Math.hypot(x - cx, z - cz); if (d < r) h = lvl; else if (d < r + fall) { const u = (d - r) / fall; h = lvl * (1 - u) + h * u; } };
  blend(STATION.x, STATION.z, 8, 6, 0.8); blend(FARM.x, FARM.z, 11, 7, 1.6);
  const sd = streamDist(x, z); if (sd < 3) h -= 0.9 * (1 - sd / 3);
  const dh = Math.hypot(x - HOLLOW.x, z - HOLLOW.z); if (dh < 7) h = h * 0.3 + 0.2;
  const r = Math.max(Math.abs(x), Math.abs(z)); if (r > 64) h += (r - 64) * (r - 64) * 0.12;
  return h;
}
const WL0 = H(POND.x, POND.z) + 2.6;

/* ---------- STATE ---------- */
let W = null; /* the running world */
function st() { const S = C.S; if (!S.cozy) S.cozy = { pos: null, f: {}, found: {}, ev: {}, planted: 0, inv: {}, samples: {}, seen: {} }; return S.cozy; }
function saveSoon() { if (W) W.saveT = 0.5; }

/* ---------- STYLES + OVERLAY ---------- */
function ensureUI() {
  if (document.getElementById('cozyUI')) return;
  const css = document.createElement('style'); css.textContent = `
#cozyUI { position: absolute; inset: 0; pointer-events: none; font-size: calc(16px * var(--ts, 1)); }
#cozyUI > * { pointer-events: auto; }
#czTop { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; gap: 8px; align-items: flex-start; pointer-events: none; }
#czObj { pointer-events: auto; background: rgba(11, 29, 42, .82); border: 2px solid #7be0ad; border-radius: 12px; padding: 6px 10px; max-width: min(460px, 60%); }
#czObj small { display: block; color: #7be0ad; text-transform: uppercase; font-size: .72em; letter-spacing: .05em; }
#czBtns { margin-left: auto; display: flex; gap: 6px; pointer-events: auto; flex-wrap: wrap; justify-content: flex-end; }
#czBtns button { padding: 5px 10px; }
.czLang button[aria-pressed="true"] { border-color: var(--signal, #ffd166); background: var(--deep, #0b1d2a); box-shadow: inset 0 0 0 1px var(--signal, #ffd166); }
#czPrompt { position: absolute; bottom: 76px; left: 50%; transform: translateX(-50%); background: rgba(11, 29, 42, .9); border: 2px solid #ffd166; border-radius: 999px; padding: 6px 16px; font-weight: 700; white-space: nowrap; }
#czCard { position: absolute; left: 12px; bottom: 12px; width: min(420px, calc(100% - 24px)); background: rgba(11, 29, 42, .94); border: 2px solid #9fe0ff; border-radius: 14px; padding: 10px 12px; }
#czCard h3 { margin: 0 0 4px; } #czCard p { margin: 4px 0; line-height: 1.4; } #czCard .rec { color: #7be0ad; font-size: .85em; } #czCard svg { width: 100%; max-height: 160px; background: #e8f0e0; border-radius: 10px; }
#czTalk { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); width: min(640px, calc(100% - 24px)); background: rgba(11, 29, 42, .96); border: 2px solid #ffd166; border-radius: 14px; padding: 10px 14px; }
#czTalk b { color: #ffd166; } #czTalk p { margin: 6px 0; line-height: 1.4; } #czTalk .ch { display: flex; flex-direction: column; gap: 6px; } #czTalk .ch button { text-align: left; } #czTalk .fb { color: #ffb09c; }
#czTalk small { opacity: .75; }
#czHelp { position: absolute; bottom: 8px; right: 8px; max-width: 46%; font-size: .78em; background: rgba(11, 29, 42, .7); border-radius: 10px; padding: 4px 8px; opacity: .85; }
#czPause { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(11, 29, 42, .7); }
#czPause .card { max-width: 380px; }
@media (max-width: 700px) { #czHelp { display: none; } #czObj { max-width: 100%; } }`;
  document.head.appendChild(css);
  const ui = document.createElement('div'); ui.id = 'cozyUI'; ui.hidden = true;
  ui.innerHTML = '<div id="czTop"><div id="czObj" aria-live="polite"></div><div id="czBtns"><span class="czLang btns" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="es">Español</button></span>' +
    '<button type="button" id="czJ"></button><button type="button" id="czM"></button></div></div><div id="czPrompt" hidden></div><div id="czCard" role="status" aria-live="polite" hidden></div>' +
    '<div id="czTalk" hidden></div><div id="czHelp"></div><div id="czPause" hidden><div class="card"><h2 id="czPT"></h2><button type="button" id="czRes" class="primary"></button><button type="button" id="czPJ"></button><span class="czLang btns" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="es">Español</button></span><button type="button" id="czQuit"></button></div></div>';
  document.getElementById('toast').parentNode.appendChild(ui);
  ui.addEventListener('click', function (e) {
    const b = e.target.closest('button'); if (!b || !W) return; b.blur();
    if (b.dataset.lang) { setLang(b.dataset.lang); return; }
    if (b.id === 'czJ' || b.id === 'czPJ') { openJ(); return; }
    if (b.id === 'czM') { setPause(true); return; }
    if (b.id === 'czRes') { setPause(false); return; }
    if (b.id === 'czQuit') { exit(); return; }
    if (b.dataset.ch != null) { choose(+b.dataset.ch); return; }
    if (b.dataset.next) { talkNext(); }
  });
}
function $(id) { return document.getElementById(id); }
function setLang(l) { C.S.set.lang = l; C.save(); refreshText(); }
function refreshText() {
  if (!W) return;
  document.querySelectorAll('.czLang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === (C.S.set.lang || 'en'))); });
  $('czJ').textContent = '📓 ' + tx('cz.journal'); $('czM').textContent = '☰ ' + tx('cz.menu'); $('czPT').textContent = tx('cz.paused');
  $('czRes').textContent = tx('cz.resume'); $('czPJ').textContent = '📓 ' + tx('cz.journal'); $('czQuit').textContent = tx('cz.toMenu'); $('czHelp').textContent = tx('cz.controls');
  objective(); if (W.card) showCard(W.card.id, W.card.extra); if (W.talk) drawTalk(); W.lastPrompt = null;
  W.npcs.forEach(function (n) { n.tag.material.map = C.labelTex(npcName(n.id), { bd: '#ffd166' }); n.tag.material.needsUpdate = true; });
}
function npcName(id) { return { ama: 'Dr. Ama', pip: 'Pip', lu: (C.S.set.lang === 'es' ? 'Granjera Lu' : 'Farmer Lu') }[id]; }

/* ---------- BUILD THE RESERVE ---------- */
function build() {
  const g = new T.Group(), G = C.G, scene = C.scene;
  W = { g: g, colliders: [], spots: [], npcs: [], anim: [], t: 0, k: {}, yaw: Math.PI * 0.75, pitch: 0.42, dist: 10, drag: null, talk: null, card: null, cardT: 0, saveT: 0, birdT: 3, pause: false,
    bg: scene.background, fog: scene.fog, light: [C.HEMI.intensity, C.KEYL.intensity, C.KEYL.position.clone()] };
  scene.add(g);
  scene.background = new T.Color('#9fd3f0'); scene.fog = new T.Fog('#bfe3f5', 45, 150);
  C.HEMI.color.set('#dfefff'); C.HEMI.groundColor.set('#3a4a2a'); C.HEMI.intensity = 0.55; C.KEYL.color.set('#fff0d0'); C.KEYL.position.set(30, 50, 20); C.KEYL.intensity = 0.75;
  /* terrain with colors by place */
  const N = 110, geo = new T.PlaneGeometry(160, 160, N, N); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, cols = new Float32Array(pos.count * 3), cc = new T.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), y = H(x, z); pos.setY(i, y);
    const dp = Math.hypot(x - POND.x, z - POND.z), dh = Math.hypot(x - HILL.x, z - HILL.z), forest = x > 22 && z > 14, farm = Math.abs(x - FARM.x) < 11 && Math.abs(z - FARM.z) < 9;
    if (dp < 19) cc.set('#a8956a'); else if (farm) cc.set(((Math.floor((x - FARM.x + 11) / 1.6)) % 2) ? '#7a5a3a' : '#8a6a3a'); else if (dh < 9 && y > 9) cc.set('#9a9a88'); else if (forest) cc.set('#2f5226'); else cc.set(y > 6 ? '#557a38' : '#5e8a3a');
    cc.offsetHSL(0, 0, (Math.sin(x * 1.7 + z * 2.3) * 0.5) * 0.04); cols[i * 3] = cc.r; cols[i * 3 + 1] = cc.g; cols[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('color', new T.BufferAttribute(cols, 3)); geo.computeVertexNormals();
  g.add(new T.Mesh(geo, new T.MeshLambertMaterial({ vertexColors: true })));
  /* pond water (green and cloudy until the mystery is solved) and the stream */
  W.water = new T.Mesh(new T.CircleGeometry(15.5, 48), new T.MeshLambertMaterial({ color: '#5a8a3a', transparent: true, opacity: 0.85, emissive: '#102a10' }));
  W.water.rotation.x = -Math.PI / 2; W.water.position.set(POND.x, WL0, POND.z); g.add(W.water);
  W.scum = new T.Group(); for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 3 + (i * 7 % 11); const m = new T.Mesh(new T.CircleGeometry(1 + (i % 3) * 0.5, 10), C.basic('#6fae3a', 0.7)); m.rotation.x = -Math.PI / 2; m.position.set(POND.x + Math.cos(a) * r, WL0 + 0.03, POND.z + Math.sin(a) * r); W.scum.add(m); } g.add(W.scum);
  for (let i = 0; i < STREAM.length - 1; i++) { const a = STREAM[i], b = STREAM[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), m = new T.Mesh(new T.PlaneGeometry(len, 2), new T.MeshLambertMaterial({ color: '#6aa0c0', transparent: true, opacity: 0.8 }));
    m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(b[1] - a[1], b[0] - a[0]); const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2; m.position.set(mx, H(mx, mz) + 0.35, mz); g.add(m); }
  /* trees: forest in the north-east, a few scattered */
  const trunkM = C.emat('#6a4a2a', '#1a0e05'), leafM = [C.emat('#3f8a3a', '#0a1a08'), C.emat('#4f9a3a', '#0a1a08'), C.emat('#2f7a3a', '#081808')];
  const tree = function (x, z, s, oak) {
    const y = H(x, z), t1 = new T.Mesh(G.cyl, trunkM); t1.scale.set(0.35 * s, 3 * s, 0.35 * s); t1.position.set(x, y + 1.5 * s, z); g.add(t1);
    const c = new T.Mesh(oak ? G.sph : G.cone, leafM[Math.floor(Math.abs(x * 7 + z * 3)) % 3]); if (oak) { c.scale.set(2.6 * s, 2.2 * s, 2.6 * s); c.position.set(x, y + 4.2 * s, z); } else { c.scale.set(1.8 * s, 2.6 * s, 1.8 * s); c.position.set(x, y + 4.6 * s, z); } g.add(c);
    W.colliders.push({ x: x, z: z, r: 0.6 * s + 0.3 }); W.anim.push({ m: c, ph: x + z, sway: true });
  };
  for (let i = 0; i < 70; i++) { const x = 24 + (i * 37 % 44), z = 16 + (i * 53 % 46); if (Math.hypot(x - HOLLOW.x, z - HOLLOW.z) < 11 || Math.hypot(x - 30, z - 28) < 4) continue; tree(x + Math.sin(i) * 1.5, z + Math.cos(i * 1.3) * 1.5, 0.9 + (i % 4) * 0.15, false); }
  [[-60, 10], [-45, 40], [-5, 55], [25, -20], [-30, -55], [55, -10], [-62, -10], [10, 62], [-50, 58]].forEach(function (p, i) { tree(p[0], p[1], 1 + (i % 3) * 0.2, i % 2 === 0); });
  tree(18, -14, 1.3, true); /* the oak by the station */
  /* rocks on the hill and the ring around the hidden hollow (with a gap hidden behind bushes) */
  const rockM = C.emat('#8a8a80', '#1a1a18');
  const rock = function (x, z, s) { const m = new T.Mesh(G.ico, rockM); m.scale.set(s, s * 0.8, s); m.position.set(x, H(x, z) + s * 0.4, z); m.rotation.y = x; g.add(m); W.colliders.push({ x: x, z: z, r: s * 0.95 }); };
  for (let i = 0; i < 12; i++) { const a = i * 0.52; rock(HILL.x + Math.cos(a) * (11 + i % 3 * 3), HILL.z + Math.sin(a) * (11 + i % 3 * 3), 0.8 + (i % 3) * 0.4); }
  for (let a = 0; a < Math.PI * 2; a += 0.28) { if (Math.abs(((a + Math.PI) % (Math.PI * 2)) - Math.PI) < 0.3) continue; rock(HOLLOW.x + Math.cos(a) * 9, HOLLOW.z + Math.sin(a) * 9, 1.9); }
  const bushM = C.emat('#3a7a2a', '#081808'); for (let i = -1; i <= 1; i++) { const b = new T.Mesh(G.sph, bushM); b.scale.set(1.6, 1.3, 1.6); const x = HOLLOW.x + 9.6, z = HOLLOW.z + i * 1.6; b.position.set(x, H(x, z) + 0.8, z); g.add(b); W.anim.push({ m: b, ph: i, sway: true }); }
  /* glowing mushrooms + fireflies in the hollow (the faint glow above the rocks is the clue) */
  W.glows = []; for (let i = 0; i < 9; i++) { const x = HOLLOW.x - 4 + (i % 3) * 3.5, z = HOLLOW.z - 4 + Math.floor(i / 3) * 3.5, m = C.specimen('mushroom', '#9fffd8'); m.position.set(x, H(x, z), z); m.traverse(function (o) { if (o.material && o.material.emissive) { o.material = o.material.clone(); o.material.emissive.set('#3affc0'); } }); g.add(m); }
  for (let i = 0; i < 14; i++) { const f = C.glow('#c8ff9a', 0.8, 0.9); f.position.set(HOLLOW.x + Math.sin(i) * 5, H(HOLLOW.x, HOLLOW.z) + 2 + (i % 4), HOLLOW.z + Math.cos(i * 1.7) * 5); g.add(f); W.anim.push({ m: f, ph: i, fly: true, y: f.position.y, x: f.position.x }); }
  /* meadow flowers and clover (instanced so they are cheap to draw) */
  const fl = new T.InstancedMesh(G.sph, new T.MeshLambertMaterial({ color: '#ffffff' }), 160), dm = new T.Object3D(), fcol = ['#ff8fb1', '#ffd166', '#ffffff', '#c59cff'];
  for (let i = 0; i < 160; i++) { const x = -6 + (i * 13 % 30), z = 34 + (i * 29 % 22); dm.position.set(x, H(x, z) + 0.45, z); dm.scale.setScalar(0.16); dm.updateMatrix(); fl.setMatrixAt(i, dm.matrix); fl.setColorAt(i, new T.Color(fcol[i % 4])); }
  g.add(fl);
  const gr = new T.InstancedMesh(G.cone, C.emat('#5aa03a', '#0a1a08'), 380);
  for (let i = 0; i < 380; i++) { const x = -70 + (i * 47 % 140), z = -70 + (i * 71 % 140); if (Math.hypot(x - POND.x, z - POND.z) < 17 || (x > 22 && z > 14)) { dm.scale.setScalar(0.0001); } else dm.scale.set(0.15, 0.35, 0.15); dm.position.set(x, H(x, z) + 0.3, z); dm.updateMatrix(); gr.setMatrixAt(i, dm.matrix); }
  g.add(gr);
  /* sunny clover patch vs shady ferns (the comparison) */
  const clover = C.emat('#7be06a', '#103a08'); for (let i = 0; i < 30; i++) { const x = 8 + (i % 6) * 0.9, z = 46 + Math.floor(i / 6) * 0.9, m = new T.Mesh(G.sph, clover); m.scale.set(0.45, 0.6, 0.45); m.position.set(x, H(x, z) + 0.5, z); g.add(m); }
  const fern = C.emat('#2f6a2a', '#081808'); for (let i = 0; i < 6; i++) { const x = 44 + (i % 3) * 1.6, z = 52 + Math.floor(i / 3) * 1.6, m = new T.Mesh(G.cone, fern); m.scale.set(0.25, 0.2, 0.25); m.position.set(x, H(x, z) + 0.2, z); g.add(m); }
  /* the rotting log with mushrooms */
  const lg = new T.Mesh(G.cyl, C.emat('#5a3a1a', '#140a04')); lg.scale.set(0.7, 5, 0.7); lg.rotation.z = Math.PI / 2; lg.rotation.y = 0.4; lg.position.set(30, H(30, 28) + 0.6, 28); g.add(lg); W.colliders.push({ x: 30, z: 28, r: 1.2 });
  for (let i = 0; i < 5; i++) { const m = C.specimen('mushroom', '#c0503a'); m.scale.setScalar(0.6); m.position.set(28.5 + i * 0.8, H(30, 28) + 1.0, 28 - 0.5 + (i % 2) * 0.6); g.add(m); }
  /* research station: cabin, microscope table, sign */
  const cab = new T.Group(), wallM = C.emat('#c89a6a', '#2a1a0a'); const wl = new T.Mesh(G.box, wallM); wl.scale.set(6, 3.2, 5); wl.position.y = 1.6; cab.add(wl);
  const roof = new T.Mesh(G.cone, C.emat('#8a3a2a', '#200a05')); roof.scale.set(4.6, 1.2, 4.6); roof.rotation.y = Math.PI / 4; roof.position.y = 4.4; cab.add(roof);
  const door = new T.Mesh(G.box, C.emat('#5a3a1a', '#100a04')); door.scale.set(1.2, 2.2, 0.1); door.position.set(0, 1.1, 2.52); cab.add(door);
  cab.position.set(STATION.x, H(STATION.x, STATION.z), STATION.z - 4); g.add(cab); W.colliders.push({ x: STATION.x - 1.8, z: STATION.z - 4, r: 2.6 }, { x: STATION.x + 1.8, z: STATION.z - 4, r: 2.6 });
  const tab = new T.Mesh(G.box, C.emat('#8a6a4a', '#1a0e05')); tab.scale.set(2.2, 0.9, 1.1); tab.position.set(STATION.x + 4, H(STATION.x + 4, STATION.z) + 0.45, STATION.z + 1); g.add(tab);
  const scope = new T.Group(), sm = C.emat('#e8eef2', '#334455'); const base = new T.Mesh(G.box, sm); base.scale.set(0.5, 0.1, 0.4); scope.add(base); const arm = new T.Mesh(G.cyl, sm); arm.scale.set(0.07, 0.6, 0.07); arm.position.set(-0.15, 0.32, 0); scope.add(arm);
  const tube = new T.Mesh(G.cyl, C.emat('#30343a', '#000000')); tube.scale.set(0.09, 0.45, 0.09); tube.rotation.z = 0.4; tube.position.set(0, 0.6, 0); scope.add(tube); scope.position.set(STATION.x + 4, H(STATION.x + 4, STATION.z) + 0.95, STATION.z + 1); g.add(scope);
  W.colliders.push({ x: STATION.x + 4, z: STATION.z + 1, r: 1.2 });
  /* farm: crop rows, fertilizer bags, a fence, the runoff ditch */
  for (let r = 0; r < 7; r++) for (let c = 0; c < 10; c++) { const x = FARM.x - 9 + c * 2, z = FARM.z - 6 + r * 2, m = new T.Mesh(G.cone, C.emat('#c8b03a', '#2a2005')); m.scale.set(0.25, 0.7, 0.25); m.position.set(x, H(x, z) + 0.7, z); g.add(m); }
  for (let i = 0; i < 3; i++) { const b = new T.Mesh(G.box, C.emat('#e8e0c8', '#2a2a20')); b.scale.set(1, 1.3, 0.6); const x = FARM.x + 9 + i * 1.1, z = FARM.z + 9; b.position.set(x, H(x, z) + 0.65, z); b.rotation.y = i * 0.2; g.add(b); }
  const bl = C.label('N-P-K', 2, { bd: '#ffd166' }); bl.position.set(FARM.x + 10, H(FARM.x + 10, FARM.z + 9) + 2.2, FARM.z + 9); g.add(bl); W.colliders.push({ x: FARM.x + 10, z: FARM.z + 9, r: 1.8 });
  /* overlook bench */
  const bench = new T.Mesh(G.box, C.emat('#8a6a4a', '#1a0e05')); bench.scale.set(2, 0.3, 0.6); bench.position.set(HILL.x, H(HILL.x, HILL.z) + 0.5, HILL.z); g.add(bench);
  /* animals: frog, rabbit, a hawk circling, bees, butterflies */
  W.frog = C.specimen('frog', '#5fbf5a'); W.frog.position.set(-8, H(-8, 30), 30); g.add(W.frog);
  W.rabbit = C.specimen('critter', '#d8c8b0'); W.rabbit.position.set(4, H(4, 40), 40); g.add(W.rabbit); W.rab = { x: 4, z: 40, tx: 6, tz: 42, t: 0 };
  W.hawk = new T.Group(); const hb = new T.Mesh(G.sph, C.emat('#6a4a2a', '#100a04')); hb.scale.set(0.5, 0.3, 1.1); W.hawk.add(hb); [-1, 1].forEach(function (sd) { const wgm = new T.Mesh(G.box, C.emat('#7a5a3a', '#100a04')); wgm.scale.set(2.4, 0.08, 0.7); wgm.position.x = sd * 1.3; W.hawk.add(wgm); }); g.add(W.hawk);
  W.bees = []; for (let i = 0; i < 4; i++) { const b = new T.Mesh(G.sph, C.emat('#ffd166', '#5a4010')); b.scale.set(0.18, 0.15, 0.24); g.add(b); W.bees.push({ m: b, ph: i * 1.7 }); }
  W.fish = new T.Group(); for (let i = 0; i < 6; i++) { const f = new T.Mesh(G.sph, C.emat('#ff9f6e', '#5a2a10')); f.scale.set(0.5, 0.22, 0.2); f.userData.ph = i; W.fish.add(f); } W.fish.visible = false; g.add(W.fish);
  /* people (fellow alien scientists) */
  const npc = function (id, x, z, look) { const m = C.buildAlien(look); m.position.set(x, H(x, z), z); m.scale.setScalar(1.15); g.add(m); const tag = C.label(npcName(id), 2.6, { bd: '#ffd166' }); tag.scale.multiplyScalar(0.7); tag.position.set(x, H(x, z) + 3.1, z); g.add(tag);
    const mk = C.glow('#ffd166', 1.4, 0.9); mk.position.set(x, H(x, z) + 3.9, z); g.add(mk); W.npcs.push({ id: id, x: x, z: z, m: m, tag: tag, mark: mk }); W.colliders.push({ x: x, z: z, r: 0.9 }); };
  npc('ama', STATION.x + 2, STATION.z + 1.5, { shape: 1, color: 7, eyes: 2, ant: 2, gear: 1, estyle: 0, mouth: 1 });
  npc('pip', -8, 8, { shape: 0, color: 4, eyes: 2, ant: 1, gear: 0, estyle: 1, mouth: 2 });
  npc('lu', FARM.x + 6, FARM.z + 9, { shape: 2, color: 2, eyes: 1, ant: 2, gear: 0, estyle: 0, mouth: 1 });
  /* planting spots along the stream */
  W.plants = []; for (let i = 0; i < 5; i++) { const u = (i + 0.5) / 5, seg = Math.min(STREAM.length - 2, Math.floor(u * (STREAM.length - 1))), lu = u * (STREAM.length - 1) - seg, a = STREAM[seg], b = STREAM[seg + 1];
    const x = a[0] + (b[0] - a[0]) * lu + 2.4, z = a[1] + (b[1] - a[1]) * lu; const mk = C.glow('#7be0ad', 2.2, 0.0); mk.position.set(x, H(x, z) + 0.6, z); g.add(mk);
    const pl = new T.Group(); for (let k = 0; k < 4; k++) { const leaf = new T.Mesh(G.cone, C.emat('#5fbf5a', '#0a2008')); leaf.scale.set(0.25, 0.7, 0.25); leaf.position.set(Math.cos(k) * 0.4, 0.6, Math.sin(k) * 0.4); pl.add(leaf); } pl.position.set(x, H(x, z), z); pl.visible = false; g.add(pl);
    W.plants.push({ x: x, z: z, mk: mk, pl: pl, i: i }); }
  /* player */
  W.me = C.buildAlien(C.S.alien); g.add(W.me);
  const s = st(); W.px = s.pos ? s.pos[0] : STATION.x + 3; W.pz = s.pos ? s.pos[1] : STATION.z + 7; W.py = H(W.px, W.pz); W.vy = 0; W.ground = true; W.face = 0;
  /* sparkles mark things you can interact with */
  W.marks = []; spots().forEach(function (sp) { if (sp.noMark) return; const mk = C.glow('#ffffff', 1.1, 0.8); mk.position.set(sp.x, H(sp.x, sp.z) + (sp.my || 2), sp.z); g.add(mk); W.marks.push({ sp: sp, m: mk }); });
  applyFixed(true);
}

/* ---------- INTERACTIONS ---------- */
function spots() {
  const s = st();
  return [
    { id: 'frog', x: -8, z: 30, verb: 'cz.observe', t: 'cz.t.frog', use: function () { W.frogJump = 1; find('frog'); } },
    { id: 'log', x: 30, z: 28, verb: 'cz.observe', t: 'cz.t.log', use: function () { find('log'); } },
    { id: 'bee', x: 6, z: 44, verb: 'cz.observe', t: 'cz.t.bee', use: function () { find('bee'); } },
    { id: 'rabbit', x: 4, z: 40, verb: 'cz.observe', t: 'cz.t.rabbit', live: 'rabbit', use: function () { find('rabbit'); } },
    { id: 'overlook', x: HILL.x, z: HILL.z, verb: 'cz.observe', t: 'cz.t.overlook', use: function () { find('overlook'); } },
    { id: 'sun', x: 10, z: 47, verb: 'cz.observe', t: 'cz.t.sun', use: function () { find('sun'); compare(); } },
    { id: 'shade', x: 45.5, z: 53, verb: 'cz.observe', t: 'cz.t.shade', use: function () { find('shade'); compare(); } },
    { id: 'oak', x: 18, z: -14, r: 3.2, verb: 'cz.collect', t: 'cz.t.oak', use: function () { s.samples.leaf = 1; saveSoon(); say('cz.s.gotLeaf'); } },
    { id: 'pond', x: POND.x + 13, z: POND.z - 6, r: 4, verb: 'cz.investigate', t: 'cz.t.pond', use: pondUse },
    { id: 'kit', x: POND.x - 2, z: POND.z - 15, r: 4, verb: 'cz.test', t: 'cz.t.kit', use: kitUse },
    { id: 'scope', x: STATION.x + 4, z: STATION.z + 1, r: 2.6, verb: 'cz.examine', t: 'cz.t.scope', use: scopeUse },
    { id: 'bags', x: FARM.x + 10, z: FARM.z + 9, r: 3, verb: 'cz.investigate', t: 'cz.t.bags', use: function () { evidence('farm'); } },
    { id: 'glow', x: HOLLOW.x, z: HOLLOW.z, r: 5, verb: 'cz.observe', t: 'cz.t.glow', noMark: true, use: function () { find('glow'); C.award('cz-hollow'); } },
    { id: 'fish', x: POND.x + 13, z: POND.z + 6, r: 4, verb: 'cz.observe', t: 'cz.t.fish', when: function () { return s.f.fixed; }, use: function () { find('fish'); } },
    { id: 'ama', x: STATION.x + 2, z: STATION.z + 1.5, r: 2.6, verb: 'cz.talk', t: 'cz.t.ama', noMark: true, use: talkAma },
    { id: 'pip', x: -8, z: 8, r: 2.6, verb: 'cz.talk', t: 'cz.t.pip', noMark: true, use: talkPip },
    { id: 'lu', x: FARM.x + 6, z: FARM.z + 9, r: 2.6, verb: 'cz.talk', t: 'cz.t.lu', noMark: true, use: talkLu }
  ].concat(W && W.plants ? W.plants.map(function (p) { return { id: 'plant' + p.i, x: p.x, z: p.z, r: 2, verb: 'cz.plant', t: 'cz.t.spot', noMark: true, when: function () { return s.f.solved && !s.f.fixed && !(s.f['p' + p.i]); }, use: function () { plant(p); } }; }) : []);
}
function nearest() {
  let best = null, bd = 1e9; const list = W.spotList || (W.spotList = spots());
  list.forEach(function (sp) { if (sp.when && !sp.when()) return; let x = sp.x, z = sp.z; if (sp.live === 'rabbit') { x = W.rab.x; z = W.rab.z; } const d = Math.hypot(W.px - x, W.pz - z); if (d < (sp.r || 2.4) && d < bd) { bd = d; best = sp; } });
  return best;
}
function find(id) {
  const s = st(), fresh = !s.found[id]; s.found[id] = Date.now(); saveSoon();
  showCard(id); C.beep(fresh ? 1000 : 800, 0.18, 'sine', fresh ? 'chirp, new discovery' : null);
  if (fresh) { C.award('cz-first'); if (FINDS.every(function (f) { return s.found[f.id]; })) C.award('cz-all'); }
}
function compare() { const s = st(); if (s.found.sun && s.found.shade && !s.f.compared) { s.f.compared = 1; saveSoon(); setTimeout(function () { showCard('compare'); C.award('cz-compare'); }, 4500); } }
function svgCells(kind) {
  if (kind === 'leafcell') { let r = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const x = 10 + i * 72, y = 10 + j * 68; r += '<rect x="' + x + '" y="' + y + '" width="66" height="62" rx="4" fill="#d8f0c0" stroke="#3a7a2a" stroke-width="4"/>'; for (let k = 0; k < 5; k++) r += '<ellipse cx="' + (x + 12 + (k * 13) % 44) + '" cy="' + (y + 12 + (k * 17) % 40) + '" rx="7" ry="4" fill="#3faa3a"/>'; r += '<circle cx="' + (x + 44) + '" cy="' + (y + 40) + '" r="8" fill="#a07ad0"/>'; } return '<svg viewBox="0 0 300 150" role="img" aria-label="Plant cells with cell walls and chloroplasts">' + r + '</svg>'; }
  let r = ''; for (let i = 0; i < 14; i++) { const x = 15 + (i * 41) % 270, y = 15 + (i * 29) % 120; r += '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#5fbf3a" stroke="#2a6a1a" stroke-width="2"/><circle cx="' + (x + 13) + '" cy="' + (y + 6) + '" r="9" fill="#6fcf4a" stroke="#2a6a1a" stroke-width="2"/>'; }
  for (let i = 0; i < 12; i++) r += '<rect x="' + ((i * 53) % 280 + 6) + '" y="' + ((i * 37) % 130 + 8) + '" width="14" height="5" rx="2.5" fill="#8a5a3a"/>';
  return '<svg viewBox="0 0 300 150" role="img" aria-label="Pond water with many algae cells and bacteria">' + r + '</svg>';
}
function showCard(id, extra) {
  W.card = { id: id, extra: extra }; W.cardT = 14;
  const isFind = FINDS.some(function (f) { return f.id === id; }) || id === 'compare';
  const title = id === 'compare' ? '⚖️ ' + tx('cz.n.sun') + ' / ' + tx('cz.n.shade') : isFind ? tx('cz.n.' + id) : tx('cz.m.title');
  const body = id === 'compare' ? tx('cz.d.compare') : isFind ? tx('cz.d.' + id) : tx(extra);
  $('czCard').innerHTML = '<h3>' + C.esc(title) + '</h3>' + (id === 'leafcell' || id === 'algae' ? svgCells(id) : '') + '<p>' + C.esc(body) + '</p>' + (isFind ? '<p class="rec">' + C.esc(tx('cz.recorded')) + '</p>' : '');
  $('czCard').hidden = false;
}
function say(key) { showCard('msg', key); }
function evidence(k) {
  const s = st(); if (!s.f.tools && k !== 'farm' && k !== 'water') { /* still record what was seen */ }
  const fresh = !s.ev[k]; s.ev[k] = 1; saveSoon(); showCard('ev', 'cz.ev.' + k); if (fresh) C.beep(900, 0.2, 'triangle', 'chime, evidence found'); objective();
}
function pondUse() { const s = st(); evidence('water'); if (s.inv.jar && !s.samples.pond) { s.samples.pond = 1; saveSoon(); setTimeout(function () { say('cz.s.gotPond'); }, 3500); } else if (!s.inv.jar) setTimeout(function () { say('cz.s.needJar'); }, 3500); }
function kitUse() { const s = st(); if (!s.inv.kit) { say('cz.s.needKit'); return; } evidence('oxygen'); }
function scopeUse() {
  const s = st(), todo = [];
  if (s.samples.leaf && !s.found.leafcell) todo.push('leafcell'); if (s.samples.pond && !s.found.algae) todo.push('algae');
  if (!todo.length) { say(s.samples.leaf || s.samples.pond ? 'cz.s.scopeDone' : 'cz.s.scopeEmpty'); return; }
  const id = todo[0]; find(id); if (id === 'algae') { st().ev.micro = 1; saveSoon(); objective(); }
}
function plant(p) {
  const s = st(); s.f['p' + p.i] = 1; s.planted = (s.planted || 0) + 1; saveSoon(); p.pl.visible = true; p.pl.scale.setScalar(0.1); W.grow = W.grow || []; W.grow.push(p.pl);
  say('cz.s.planted'); C.beep(700, 0.2, 'triangle', 'rustle, seedling planted'); objective();
  if (s.planted >= 5) { s.f.fixed = 1; saveSoon(); W.clearT = 0; setTimeout(function () { say('cz.s.clearing'); }, 1500); C.award('cz-detective'); objective(); }
}
function applyFixed(instant) {
  const s = st();
  W.plants.forEach(function (p) { if (s.f['p' + p.i]) { p.pl.visible = true; p.pl.scale.setScalar(1); } });
  if (s.f.fixed && instant) { W.water.material.color.set('#3a8ac0'); W.water.material.emissive.set('#0a1a2a'); W.scum.visible = false; W.fish.visible = true; }
}
/* ---------- CONVERSATIONS ---------- */
function talk(lines, done) { W.talk = { lines: lines, i: 0, done: done, fb: '' }; drawTalk(); }
function drawTalk() {
  const tk = W.talk, ln = tk.lines[tk.i];
  if (ln.choices) {
    $('czTalk').innerHTML = '<b>' + C.esc(npcName(ln.who)) + '</b><p>' + C.esc(tx(ln.key)) + '</p><div class="ch">' + ln.choices.map(function (c, i) { return '<button type="button" data-ch="' + i + '">' + (i + 1) + '. ' + C.esc(tx(c.key)) + '</button>'; }).join('') + '</div>' +
      (tk.fb ? '<p class="fb">' + C.esc(tx(tk.fb)) + '</p>' : '') + '<small>' + C.esc(tx('cz.choose')) + '</small>';
  } else $('czTalk').innerHTML = '<b>' + C.esc(npcName(ln.who)) + '</b><p>' + C.esc(tx(ln.key, ln.vars)) + '</p><button type="button" data-next="1">' + C.esc(tx('cz.next')) + '</button>';
  $('czTalk').hidden = false;
}
function talkNext() { const tk = W.talk; if (!tk || tk.lines[tk.i].choices) return; tk.i++; if (tk.i >= tk.lines.length) { W.talk = null; $('czTalk').hidden = true; if (tk.done) tk.done(); } else drawTalk(); }
function choose(i) { const tk = W.talk; if (!tk) return; const ln = tk.lines[tk.i]; if (!ln.choices || !ln.choices[i]) return; const c = ln.choices[i];
  if (c.ok) { tk.fb = ''; tk.i++; if (tk.i >= tk.lines.length) { W.talk = null; $('czTalk').hidden = true; if (tk.done) tk.done(); } else drawTalk(); C.beep(880, 0.25, 'sine', 'chime, good explanation'); }
  else { tk.fb = c.fb; drawTalk(); C.beep(220, 0.2, 'triangle', 'hmm, think again'); } }
function evCount() { const e = st().ev; return ['water', 'oxygen', 'micro', 'farm'].filter(function (k) { return e[k]; }).length; }
function talkAma() {
  const s = st();
  if (!s.f.met) { talk([{ who: 'ama', key: 'cz.s.ama1' }, { who: 'ama', key: 'cz.s.ama2' }], function () { s.f.met = 1; saveSoon(); objective(); }); return; }
  if (s.f.pip && !s.f.tools) { talk([{ who: 'ama', key: 'cz.s.ama3' }, { who: 'ama', key: 'cz.s.ama4' }], function () { s.f.tools = 1; s.inv.jar = 1; s.inv.kit = 1; saveSoon(); objective(); }); return; }
  if (s.f.tools && !s.f.solved) {
    if (evCount() < 3) { talk([{ who: 'ama', key: 'cz.s.amaW', vars: { n: evCount() } }]); return; }
    talk([{ who: 'ama', key: 'cz.s.ama5', choices: [{ key: 'cz.c.b', fb: 'cz.f.b' }, { key: 'cz.c.a', ok: true }, { key: 'cz.c.c', fb: 'cz.f.c' }] }, { who: 'ama', key: 'cz.s.ama6' }, { who: 'ama', key: 'cz.s.ama7' }],
      function () { s.f.solved = 1; s.found.eutro = Date.now(); C.S.words['Eutrophication'] = 1; saveSoon(); objective(); }); return;
  }
  if (s.f.fixed) { talk([{ who: 'ama', key: 'cz.s.amaDone' }]); return; }
  if (s.f.solved) { talk([{ who: 'ama', key: 'cz.s.ama7' }]); return; }
  talk([{ who: 'ama', key: 'cz.s.ama2' }]);
}
function talkPip() { const s = st(); if (s.f.fixed) { talk([{ who: 'pip', key: 'cz.s.pipDone' }]); return; } if (s.f.pip) { talk([{ who: 'pip', key: 'cz.s.pipW' }]); return; }
  talk([{ who: 'pip', key: 'cz.s.pip1' }, { who: 'pip', key: 'cz.s.pip2' }], function () { s.f.pip = 1; saveSoon(); objective(); }); }
function talkLu() { const s = st(); if (s.f.fixed) { talk([{ who: 'lu', key: 'cz.s.luDone' }]); return; } talk([{ who: 'lu', key: 'cz.s.lu1' }, { who: 'lu', key: 'cz.s.lu2' }], function () { evidence('farm'); }); }
function objective() {
  const s = st(); let key, vars;
  if (s.f.fixed) key = 'cz.m.o5'; else if (s.f.solved) { key = 'cz.m.o4'; vars = { n: s.planted || 0 }; } else if (s.f.tools) { if (evCount() >= 3) key = 'cz.m.o3'; else { key = 'cz.m.o2'; vars = { n: evCount() }; } } else if (s.f.pip) key = 'cz.m.o1'; else key = 'cz.m.o0';
  $('czObj').innerHTML = '<small>🔎 ' + C.esc(tx('cz.m.title')) + '</small>' + C.esc(tx(key, vars));
  if (W) W.npcs.forEach(function (n) { n.mark.visible = (n.id === 'pip' && !s.f.pip) || (n.id === 'ama' && (!s.f.met || (s.f.pip && !s.f.tools) || (s.f.tools && !s.f.solved && evCount() >= 3))); });
  if (W) W.plants.forEach(function (p) { p.mk.material.opacity = s.f.solved && !s.f.fixed && !s.f['p' + p.i] ? 0.9 : 0; });
}

/* ---------- START, STOP, PAUSE ---------- */
function start() {
  ensureUI(); C.teardown(); C.show(null); C.setMode('cozy');
  ['hud', 'touch', 'toast', 'qpanel'].forEach(function (id) { const e = $(id); if (e) e.hidden = true; });
  build(); $('cozyUI').hidden = false; refreshText(); C.Music.play('meadow');
  const s = st(); if (!s.f.met) setTimeout(function () { if (W && !W.talk) talkAma(); }, 800);
}
function exit() {
  const s = st(); s.pos = [W.px, W.pz]; C.save();
  C.scene.remove(W.g); C.disposeGroup(W.g); C.scene.background = W.bg; C.scene.fog = W.fog; C.HEMI.intensity = W.light[0]; C.KEYL.intensity = W.light[1]; C.KEYL.position.copy(W.light[2]); W = null;
  $('cozyUI').hidden = true; $('czPause').hidden = true; C.setMode('menu'); C.menuScene();
}
function setPause(on) { if (!W) return; W.pause = on; $('czPause').hidden = !on; if (on) { W.k = {}; $('czRes').focus(); } }
function openJ() { if (!W) return; W.k = {}; W.pause = true; $('cozyUI').hidden = true; C.openJournal('cozy'); C.journalTab('cozy'); }
function resume() { if (!W) return; W.pause = false; $('czPause').hidden = true; $('cozyUI').hidden = false; refreshText(); }

/* ---------- EVERY FRAME ---------- */
function step(dt) {
  if (!W) return; W.t += dt; const cam = C.cam, s = st();
  /* scenery life: swaying trees, bees, rabbit, hawk, fish, fireflies, frog */
  W.anim.forEach(function (a) { if (a.sway) a.m.rotation.z = Math.sin(W.t * 1.2 + a.ph) * 0.03; if (a.fly) { a.m.position.y = a.y + Math.sin(W.t * 1.5 + a.ph) * 0.6; a.m.position.x = a.x + Math.sin(W.t * 0.7 + a.ph) * 0.8; } });
  W.bees.forEach(function (b, i) { const x = 6 + Math.sin(W.t * 0.8 + b.ph) * 4, z = 44 + Math.cos(W.t * 0.6 + b.ph) * 3; b.m.position.set(x, H(x, z) + 0.9 + Math.sin(W.t * 6 + i) * 0.2, z); });
  const r = W.rab; r.t -= dt; if (r.t <= 0) { r.t = 1.5 + Math.random() * 2; r.tx = Math.max(-4, Math.min(20, r.x + (Math.random() - 0.5) * 8)); r.tz = Math.max(36, Math.min(54, r.z + (Math.random() - 0.5) * 8)); }
  const flee = Math.hypot(W.px - r.x, W.pz - r.z) < 4 && !(W.near && W.near.id === 'rabbit'); if (flee) { r.tx = r.x + (r.x - W.px) * 2; r.tz = r.z + (r.z - W.pz) * 2; }
  r.x += Math.sign(r.tx - r.x) * Math.min(Math.abs(r.tx - r.x), dt * (flee ? 5 : 2)); r.z += Math.sign(r.tz - r.z) * Math.min(Math.abs(r.tz - r.z), dt * (flee ? 5 : 2));
  W.rabbit.position.set(r.x, H(r.x, r.z) + Math.abs(Math.sin(W.t * 7)) * 0.3, r.z);
  W.hawk.position.set(10 + Math.cos(W.t * 0.3) * 18, 26, 44 + Math.sin(W.t * 0.3) * 18); W.hawk.rotation.y = -W.t * 0.3; W.hawk.rotation.z = 0.25;
  if (W.fish.visible) W.fish.children.forEach(function (f, i) { const a = W.t * 0.5 + i * 1.05, rr = 5 + (i % 3) * 2.5; f.position.set(POND.x + Math.cos(a) * rr, W.water.position.y - 0.25, POND.z + Math.sin(a) * rr); f.rotation.y = -a; });
  if (W.frogJump) { W.frogJump -= dt; const u = Math.max(0, W.frogJump); W.frog.position.set(-8 - (1 - u) * 4, H(-8, 30) + Math.sin((1 - u) * Math.PI) * 1.5, 30 - (1 - u) * 2); if (W.frogJump <= 0) { W.frogJump = 0; setTimeout(function () { if (W) W.frog.position.set(-8, H(-8, 30), 30); }, 6000); } }
  if (W.grow) W.grow.forEach(function (p) { if (p.scale.x < 1) p.scale.setScalar(Math.min(1, p.scale.x + dt * 0.8)); });
  if (W.clearT != null) { W.clearT += dt; const u = Math.min(1, W.clearT / 6); W.water.material.color.set('#5a8a3a').lerp(new T.Color('#3a8ac0'), u); W.scum.children.forEach(function (m) { m.scale.setScalar(Math.max(0.01, 1 - u)); });
    if (u >= 1) { W.scum.visible = false; W.fish.visible = true; W.clearT = null; } }
  W.marks.forEach(function (mk) { const done = mk.sp.id && st().found[mk.sp.id]; mk.m.visible = !done && (!mk.sp.when || mk.sp.when()); mk.m.material.opacity = 0.5 + Math.sin(W.t * 4) * 0.3; mk.m.position.y = H(mk.sp.x, mk.sp.z) + (mk.sp.my || 2) + Math.sin(W.t * 2) * 0.15; });
  W.npcs.forEach(function (n) { n.mark.material.opacity = 0.6 + Math.sin(W.t * 5) * 0.3; n.m.rotation.y = Math.atan2(W.px - n.x, W.pz - n.z) * 0.6; });
  W.birdT -= dt; if (W.birdT <= 0) { W.birdT = 5 + Math.random() * 7; if (C.S.set.sound) { const f = 1800 + Math.random() * 900; C.beep(f, 0.07, 'sine'); setTimeout(function () { C.beep(f * 1.2, 0.06, 'sine'); }, 110); } }
  /* player movement (no movement while talking or paused) */
  const k = W.k, busy = W.pause || W.talk;
  let mx = 0, mz = 0; if (!busy) { if (k.f) mz -= 1; if (k.b) mz += 1; if (k.l) mx -= 1; if (k.r) mx += 1; if (k.ql) W.yaw += dt * 1.8; if (k.qr) W.yaw -= dt * 1.8; }
  const len = Math.hypot(mx, mz), inWater = Math.hypot(W.px - POND.x, W.pz - POND.z) < 15 && W.py < W.water.position.y;
  if (len > 0) {
    const sp = (k.run ? 10 : 6) * (inWater ? 0.55 : 1), cy = Math.cos(W.yaw), sy = Math.sin(W.yaw);
    const dx = (mx * cy + mz * sy) / len, dz = (-mx * sy + mz * cy) / len;
    W.px += dx * sp * dt; W.pz += dz * sp * dt; W.face = Math.atan2(dx, dz);
    if (!W.drag) { const want = Math.atan2(-dx, -dz), d = ((want - W.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; W.yaw += d * Math.min(1, dt * 0.9) * (mz < 0 ? 1 : 0.25); }
  }
  W.px = Math.max(-74, Math.min(74, W.px)); W.pz = Math.max(-74, Math.min(74, W.pz));
  W.colliders.forEach(function (c) { const dx = W.px - c.x, dz = W.pz - c.z, d = Math.hypot(dx, dz), mn = c.r + 0.45; if (d < mn && d > 0.001 && W.py < H(c.x, c.z) + 3.5) { W.px = c.x + dx / d * mn; W.pz = c.z + dz / d * mn; } });
  const gy = H(W.px, W.pz);
  if (!busy && k.jump && W.ground) { W.vy = 9; W.ground = false; C.beep(420, 0.06, 'triangle'); }
  W.vy -= 24 * dt; if (!W.ground && k.jump && W.vy < -2.2) { W.vy = -2.2; W.gliding = true; } else W.gliding = false;
  W.py += W.vy * dt; if (W.py <= gy) { W.py = gy; W.vy = 0; W.ground = true; } else if (W.py > gy + 0.05) W.ground = false;
  W.me.position.set(W.px, W.py, W.pz); W.me.rotation.y += (((W.face - W.me.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 10);
  const legs = W.me.userData.legs; if (legs) { W.stride = (W.stride || 0) + dt * len * (k.run ? 14 : 9); legs.forEach(function (h, i) { h.rotation.x = W.ground ? Math.sin(W.stride + i * Math.PI) * 0.7 * Math.min(1, len) : (W.gliding ? 0.6 : -0.5); }); }
  W.me.rotation.z = W.gliding ? Math.sin(W.t * 6) * 0.08 : 0;
  /* camera follows behind */
  const tgt = new T.Vector3(W.px, W.py + 1.6, W.pz), cp = Math.cos(W.pitch);
  const want = new T.Vector3(tgt.x + Math.sin(W.yaw) * cp * W.dist, tgt.y + Math.sin(W.pitch) * W.dist, tgt.z + Math.cos(W.yaw) * cp * W.dist);
  const gc = H(want.x, want.z) + 1.2; if (want.y < gc) want.y = gc;
  cam.position.lerp(want, Math.min(1, dt * 6)); cam.lookAt(tgt);
  /* nearest interaction prompt */
  if (!busy) { W.near = nearest(); const sig = W.near ? W.near.id + (C.S.set.lang || 'en') : '';
    if (sig !== W.lastPrompt) { W.lastPrompt = sig; if (W.near) { $('czPrompt').textContent = 'E: ' + tx(W.near.verb) + ' ' + tx(W.near.t); $('czPrompt').hidden = false; } else $('czPrompt').hidden = true; } }
  else if (!$('czPrompt').hidden) { $('czPrompt').hidden = true; W.lastPrompt = null; }
  if (W.cardT > 0) { W.cardT -= dt; if (W.cardT <= 0) { $('czCard').hidden = true; W.card = null; } }
  W.saveT -= dt; if (W.saveT <= 0 && W.saveT > -1) { W.saveT = -5; s.pos = [W.px, W.pz]; C.save(); }
  if (W.saveT < -9) W.saveT = 0.01;
}
function act() {
  if (!W || W.pause) return;
  if (W.talk) { if (!W.talk.lines[W.talk.i].choices) talkNext(); return; }
  if (W.near) W.near.use();
}
function key(e, down) {
  if (!W) return; const kk = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (down && kk === 'Escape') { e.preventDefault(); if (W.talk) { W.talk = null; $('czTalk').hidden = true; return; } setPause(!W.pause); return; }
  if (W.pause) return;
  if (down && W.talk && W.talk.lines[W.talk.i].choices && /^[1-3]$/.test(kk)) { choose(+kk - 1); return; }
  if (down && (kk === 'e' || kk === 'Enter')) { if (e.target && e.target.tagName === 'BUTTON' && kk === 'Enter') return; act(); e.preventDefault(); return; }
  if (down && kk === 'j') { openJ(); return; }
  const map = { w: 'f', ArrowUp: 'f', s: 'b', ArrowDown: 'b', a: 'l', ArrowLeft: 'l', d: 'r', ArrowRight: 'r', ' ': 'jump', Shift: 'run', q: 'ql', r: 'qr' };
  if (map[kk]) { W.k[map[kk]] = down; e.preventDefault(); }
}
function pointer(e, type) {
  if (!W || W.pause) return;
  if (type === 'wheel') { W.dist = Math.max(5, Math.min(18, W.dist + Math.sign(e.deltaY) * 1)); e.preventDefault(); return; }
  if (type === 'pointerdown') W.drag = { x: e.clientX, y: e.clientY, yaw: W.yaw, pitch: W.pitch };
  else if (type === 'pointermove' && W.drag && e.buttons) { W.yaw = W.drag.yaw - (e.clientX - W.drag.x) * 0.008; W.pitch = Math.max(0.12, Math.min(1.2, W.drag.pitch + (e.clientY - W.drag.y) * 0.006)); }
  else if (type === 'pointerup') W.drag = null;
}
function journalHTML() {
  const s = st(), n = FINDS.filter(function (f) { return s.found[f.id]; }).length;
  const cards = FINDS.map(function (f) { const ok = !!s.found[f.id], img = C.thumb(f.look, f.col);
    return '<div class="jc' + (ok ? '' : ' unk') + '">' + (img ? '<img alt="" src="' + img + '">' : '<span class="ji">?</span>') + '<div>' + (ok ? '<b>' + C.esc(tx('cz.n.' + f.id)) + '</b><p>' + C.esc(tx('cz.d.' + f.id)) + '</p>' : '<b>???</b><p class="dim">' + C.esc(tx('j.unknown')) + '</p>') + '</div></div>'; }).join('');
  const evs = ['water', 'oxygen', 'micro', 'farm'];
  const myst = '<section class="jl"><h3>🔎 ' + C.esc(tx('cz.m.title')) + (s.f.solved ? ' <span class="jn ok">✓ ' + C.esc(tx('cz.m.solved')) + '</span>' : '') + '</h3><ul>' +
    evs.map(function (k) { return '<li>' + (s.ev[k] ? '✓ ' + C.esc(tx('cz.ev.' + k)) : '○ <span class="dim">' + C.esc(tx('cz.m.need')) + '</span>') + '</li>'; }).join('') + '</ul>' +
    (s.f.compared ? '<p>⚖️ ' + C.esc(tx('cz.d.compare')) + '</p>' : '') + '</section>';
  return '<p class="dim">' + C.esc(tx('cz.j.tip')) + '</p><p><b>' + C.esc(tx('cz.j.found', { n: n, m: FINDS.length })) + '</b></p>' + myst + '<section class="jl"><h3>🌿 ' + C.esc(tx('cz.reserve')) + '</h3><div class="jcs">' + cards + '</div></section>';
}
function blur() { if (W) W.k = {}; }
const cb = document.getElementById('btnCozy'); if (cb) cb.hidden = false;
BQ.cozy = { start: start, step: step, key: key, pointer: pointer, journalHTML: journalHTML, resume: resume, blur: blur, _w: function () { return W; }, _s: st, _H: H };
}
if (BQ.core) init(); else BQ.onCore = init;
})();

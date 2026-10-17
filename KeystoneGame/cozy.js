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
/* new discoveries (version 21) */
Object.assign(C.I18N.en, {
  'cz.runTip': 'Tip: hold Shift to run!',
  'cz.t.spring': 'the waterfall', 'cz.t.lichen': 'the crusty rock', 'cz.t.owl': 'the owl', 'cz.t.monarch': 'the butterfly', 'cz.t.dragonfly': 'the dragonfly',
  'cz.t.cattail': 'the cattails', 'cz.t.ants': 'the anthill', 'cz.t.nest': 'the nest', 'cz.t.deer': 'the deer', 'cz.t.worms': 'the compost pile',
  'cz.n.spring': 'Spring and waterfall', 'cz.n.lichen': 'Lichen', 'cz.n.owl': 'Owl and owl pellet', 'cz.n.monarch': 'Monarch on milkweed', 'cz.n.dragonfly': 'Dragonfly',
  'cz.n.cattail': 'Cattails', 'cz.n.ants': 'Ant colony', 'cz.n.nest': 'Robin nest', 'cz.n.deer': 'White-tailed deer', 'cz.n.worms': 'Earthworms in compost',
  'cz.d.spring': 'Water bubbles out of the ground here. Rain soaks into the soil, flows underground, and comes back out as a spring. This is part of the WATER CYCLE: water evaporates, forms clouds, falls as rain, and flows back into streams and the ocean.',
  'cz.d.lichen': 'That crusty yellow-green patch is a lichen: a FUNGUS and an ALGA living together. The alga makes food by photosynthesis, and the fungus holds water and grips the rock. Both benefit, so this is MUTUALISM. Lichens are often the first living things on bare rock.',
  'cz.d.owl': 'An owl swallows mice whole, then coughs up the bones and fur it cannot digest as a pellet. The tiny skulls inside show what it ate. Owls are CONSUMERS near the top of the FOOD WEB: plants → mice → owl.',
  'cz.d.monarch': 'A monarch butterfly lays its eggs only on milkweed. The caterpillar eats the leaves, makes a chrysalis, and comes out as a butterfly. This change in body form is called METAMORPHOSIS. While it sips nectar, it also carries pollen from flower to flower.',
  'cz.d.dragonfly': 'Young dragonflies (nymphs) live underwater for months before they climb out and become adults. They need clean water with plenty of oxygen, so lots of dragonflies is a sign of a healthy pond. Scientists call this an INDICATOR SPECIES.',
  'cz.d.cattail': 'Cattails grow where land meets water. Their roots slow down muddy water and soak up extra nutrients, like a natural water filter. They are PRODUCERS: they make food from sunlight, and many animals hide and nest among them.',
  'cz.d.ants': 'Thousands of ants live here together. Each ant has a job: the queen lays eggs, and workers gather food, dig tunnels, and care for the young. Their tunnels let air and water into the soil. A group of the same kind of living thing in one place is a POPULATION.',
  'cz.d.nest': 'A robin built this nest from twigs and mud and laid blue eggs. Birds REPRODUCE by laying eggs, and the parents keep them warm until they hatch. Babies look like their parents because the parents pass on their DNA.',
  'cz.d.deer': 'The deer is eating fallen apples and grass. It is an HERBIVORE: a primary CONSUMER that eats producers. It lifts its head and turns its ears when you come near. Deer RESPOND to danger by raising their white tail and running.',
  'cz.d.worms': 'Earthworms eat dead leaves and food scraps and turn them into rich soil. They are DECOMPOSERS: they return NUTRIENTS to the soil so plants can grow again. Without decomposers, dead things would pile up forever.'
});
Object.assign(C.I18N.es, {
  'cz.runTip': 'Consejo: ¡mantén pulsada la tecla Shift para correr!',
  'cz.t.spring': 'la cascada', 'cz.t.lichen': 'la roca costrosa', 'cz.t.owl': 'el búho', 'cz.t.monarch': 'la mariposa', 'cz.t.dragonfly': 'la libélula',
  'cz.t.cattail': 'las espadañas', 'cz.t.ants': 'el hormiguero', 'cz.t.nest': 'el nido', 'cz.t.deer': 'el venado', 'cz.t.worms': 'la pila de compost',
  'cz.n.spring': 'Manantial y cascada', 'cz.n.lichen': 'Liquen', 'cz.n.owl': 'Búho y egagrópila', 'cz.n.monarch': 'Monarca en algodoncillo', 'cz.n.dragonfly': 'Libélula',
  'cz.n.cattail': 'Espadañas', 'cz.n.ants': 'Colonia de hormigas', 'cz.n.nest': 'Nido de petirrojo', 'cz.n.deer': 'Venado de cola blanca', 'cz.n.worms': 'Lombrices en el compost',
  'cz.d.spring': 'El agua brota del suelo aquí. La lluvia se filtra en la tierra, corre bajo el suelo y vuelve a salir como un manantial. Esto es parte del CICLO DEL AGUA: el agua se evapora, forma nubes, cae como lluvia y vuelve a los arroyos y al océano.',
  'cz.d.lichen': 'Esa mancha costrosa amarilla y verde es un liquen: un HONGO y un ALGA que viven juntos. El alga produce alimento por fotosíntesis, y el hongo guarda agua y se agarra a la roca. Los dos se benefician, así que esto es MUTUALISMO. Los líquenes suelen ser los primeros seres vivos sobre la roca desnuda.',
  'cz.d.owl': 'Un búho se traga ratones enteros y luego escupe los huesos y el pelo que no puede digerir en una bolita llamada egagrópila. Los cráneos diminutos que hay dentro muestran lo que comió. Los búhos son CONSUMIDORES cerca de la cima de la RED ALIMENTARIA: plantas → ratones → búho.',
  'cz.d.monarch': 'La mariposa monarca pone sus huevos solo en el algodoncillo. La oruga se come las hojas, forma una crisálida y sale convertida en mariposa. Este cambio en la forma del cuerpo se llama METAMORFOSIS. Mientras bebe néctar, también lleva polen de flor en flor.',
  'cz.d.dragonfly': 'Las libélulas jóvenes (ninfas) viven bajo el agua durante meses antes de salir y convertirse en adultas. Necesitan agua limpia con mucho oxígeno, así que ver muchas libélulas es señal de un estanque sano. Los científicos lo llaman ESPECIE INDICADORA.',
  'cz.d.cattail': 'Las espadañas crecen donde la tierra se junta con el agua. Sus raíces frenan el agua turbia y absorben los nutrientes de más, como un filtro natural. Son PRODUCTORES: fabrican alimento con la luz del sol, y muchos animales se esconden y anidan entre ellas.',
  'cz.d.ants': 'Miles de hormigas viven aquí juntas. Cada hormiga tiene un trabajo: la reina pone huevos y las obreras buscan comida, cavan túneles y cuidan a las crías. Sus túneles dejan entrar aire y agua al suelo. Un grupo de seres vivos de la misma especie en un mismo lugar es una POBLACIÓN.',
  'cz.d.nest': 'Un petirrojo construyó este nido con ramitas y barro y puso huevos azules. Las aves se REPRODUCEN poniendo huevos, y los padres los mantienen calientes hasta que nacen. Las crías se parecen a sus padres porque los padres les pasan su ADN.',
  'cz.d.deer': 'El venado come manzanas caídas y hierba. Es un HERBÍVORO: un CONSUMIDOR primario que come productores. Levanta la cabeza y mueve las orejas cuando te acercas. Los venados RESPONDEN al peligro levantando su cola blanca y corriendo.',
  'cz.d.worms': 'Las lombrices comen hojas muertas y restos de comida y los convierten en tierra rica. Son DESCOMPONEDORES: devuelven los NUTRIENTES al suelo para que las plantas vuelvan a crecer. Sin descomponedores, los seres muertos se amontonarían para siempre.'
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
  { id: 'algae', look: 'drop', col: '#7be06a' }, { id: 'glow', look: 'mushroom', col: '#9fffd8' }, { id: 'fish', look: 'rod', col: '#ff9f6e' },
  { id: 'spring', look: 'drop', col: '#7fd4ff' }, { id: 'lichen', look: 'rock', col: '#c8d070' }, { id: 'owl', look: 'critter', col: '#8a6a4a' }, { id: 'monarch', look: 'sprout', col: '#ff9f3a' },
  { id: 'dragonfly', look: 'rod', col: '#5fb8ff' }, { id: 'cattail', look: 'grass', col: '#9a7a4a' }, { id: 'ants', look: 'eggs', col: '#6a4a3a' }, { id: 'nest', look: 'eggs', col: '#8fd0f0' },
  { id: 'deer', look: 'critter', col: '#b07a4a' }, { id: 'worms', look: 'chain', col: '#e08a8a' }];

/* ---------- WORLD SHAPE ---------- */
const POND = { x: -20, z: 22 }, HILL = { x: 42, z: -42 }, FARM = { x: -52, z: -40 }, HOLLOW = { x: 56, z: 40 }, STATION = { x: 6, z: -6 }, STREAM = [[-28, -60], [-36, -46], [-44, -30], [-36, -12], [-30, 4], [-26, 12]];
const SPRING = { x: -28, z: -60 }, ORCH = { x: -40, z: 46 }, EDGE = 62, BOUND = 70;
const PATHS = [[[6, -6], [-8, 8], [-12, 16]], [[6, -6], [-18, -20], [-40, -30]], [[6, -6], [24, -24], [34, -34]], [[-8, 8], [-24, 40], [-34, 44]], [[6, -6], [16, 12], [8, 34]], [[-40, -30], [-32, -52]], [[16, 12], [26, 24]]];
function pathDist(x, z) { let d = 1e9; PATHS.forEach(function (pl) { for (let i = 0; i < pl.length - 1; i++) d = Math.min(d, segDist(x, z, pl[i], pl[i + 1])); }); return d; }
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
  h += 12 * Math.exp(-((x + 28) * (x + 28)) / 140 - ((z + 70) * (z + 70)) / 34); /* the cliff with the waterfall */
  const d = Math.hypot(x, z); if (d > EDGE) { const rise = d - EDGE, a = Math.atan2(z, x); /* gentle rolling hills all around the reserve */
    h += 20 * (1 - Math.exp(-rise / 20)) * (0.72 + 0.28 * Math.sin(a * 5 + 1.3) * Math.cos(a * 2.2)) + 1.5 * Math.sin(a * 13) * Math.min(1, rise / 15); }
  return h;
}
const WL0 = H(POND.x, POND.z) + 2.6;

/* ---------- STATE ---------- */
let W = null; /* the running world */
function rnd(i) { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); }
function inst(geo, mat, list, cols) { /* many copies of one shape drawn in a single call: list items are [x, y, z, sx, sy, sz, rotY] */
  const im = new T.InstancedMesh(geo, mat, Math.max(1, list.length)), o = new T.Object3D(), c = new T.Color();
  list.forEach(function (it, i) { o.position.set(it[0], it[1], it[2]); o.scale.set(it[3], it[4], it[5]); o.rotation.set(0, it[6] || 0, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); if (cols) im.setColorAt(i, c.set(cols[i])); });
  return im;
}
function S0low() { return !!(C.S.set && C.S.set.low); }
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
  /* low-detail shapes for things drawn hundreds of times (keeps Chromebooks smooth) */
  const LP = { sph: new T.SphereGeometry(1, 7, 5), cone: new T.ConeGeometry(1, 2, 5), cone8: new T.ConeGeometry(1, 2, 8), cyl: new T.CylinderGeometry(1, 1, 1, 5), sph10: new T.SphereGeometry(1, 10, 7) };
  W = { g: g, colliders: [], spots: [], npcs: [], anim: [], t: 0, k: {}, yaw: Math.PI * 0.75, pitch: 0.42, dist: 10, drag: null, talk: null, card: null, cardT: 0, saveT: 0, birdT: 3, pause: false,
    bg: scene.background, fog: scene.fog, light: [C.HEMI.intensity, C.KEYL.intensity, C.KEYL.position.clone()] };
  scene.add(g);
  scene.background = new T.Color('#cfe9f7'); scene.fog = new T.Fog('#d0eaf6', 70, 260);
  C.HEMI.color.set('#dfefff'); C.HEMI.groundColor.set('#3a4a2a'); C.HEMI.intensity = 0.6; C.KEYL.color.set('#ffe8c0'); C.KEYL.position.set(40, 45, -30); C.KEYL.intensity = 0.8;
  /* terrain with colors by place */
  const N = S0low() ? 110 : 140, geo = new T.PlaneGeometry(320, 320, N, N); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, cols = new Float32Array(pos.count * 3), cc = new T.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), y = H(x, z); pos.setY(i, y);
    const dp = Math.hypot(x - POND.x, z - POND.z), dh = Math.hypot(x - HILL.x, z - HILL.z), forest = x > 22 && z > 14, farm = Math.abs(x - FARM.x) < 11 && Math.abs(z - FARM.z) < 9;
    const dd = Math.hypot(x, z), cliff = Math.abs(x + 28) < 9 && z < -61 && z > -74, pth = pathDist(x, z);
    if (dp < 19) cc.set('#a8956a'); else if (farm) cc.set(((Math.floor((x - FARM.x + 11) / 1.6)) % 2) ? '#7a5a3a' : '#8a6a3a'); else if (cliff && y > 6) cc.set('#8a7a68'); else if (dh < 9 && y > 9) cc.set('#9a9a88'); else if (forest && dd < EDGE) cc.set('#2f5226');
    else if (dd > EDGE + 2) cc.set('#4a7a34').lerp(new T.Color('#3a6a3a'), Math.min(1, (dd - EDGE) / 50)); else cc.set(y > 6 ? '#5a8a3a' : '#66983e');
    if (pth < 1.6 && dd < EDGE && !farm && dp > 16.5) cc.lerp(new T.Color('#c2a874'), pth < 1 ? 0.85 : 0.45);
    cc.offsetHSL(0, 0, (Math.sin(x * 1.7 + z * 2.3) * 0.5) * 0.04); cols[i * 3] = cc.r; cols[i * 3 + 1] = cc.g; cols[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('color', new T.BufferAttribute(cols, 3)); geo.computeVertexNormals();
  g.add(new T.Mesh(geo, new T.MeshLambertMaterial({ vertexColors: true })));
  /* sky dome with a soft gradient, sun, drifting clouds, faraway blue mountains */
  const sky = new T.SphereGeometry(520, 24, 12), sp = sky.attributes.position, sc2 = new Float32Array(sp.count * 3), top = new T.Color('#4a9ee0'), hor = new T.Color('#d8eef8'), tmp = new T.Color();
  for (let i = 0; i < sp.count; i++) { const u = Math.max(0, sp.getY(i) / 520); tmp.copy(hor).lerp(top, Math.pow(u, 0.6)); sc2[i * 3] = tmp.r; sc2[i * 3 + 1] = tmp.g; sc2[i * 3 + 2] = tmp.b; }
  sky.setAttribute('color', new T.BufferAttribute(sc2, 3)); g.add(new T.Mesh(sky, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false, depthWrite: false })));
  const sun = C.glow('#fff4c8', 90, 0.9); sun.material.fog = false; sun.position.set(180, 230, -300); g.add(sun);
  W.clouds = []; const CN = S0low() ? 7 : 12; W.cloudIM = new T.InstancedMesh(LP.sph10, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#c8d8e8', fog: false }), CN * 5); g.add(W.cloudIM);
  for (let i = 0; i < CN; i++) { const a = i * 0.53, r2 = 80 + (i * 37 % 90); W.clouds.push({ x: Math.cos(a) * r2, y: 62 + (i % 4) * 8, z: Math.sin(a) * r2, sp: 0.8 + (i % 3) * 0.3 }); }
  const mts = [], caps = [], mcol = [];
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2 + Math.sin(i) * 0.1, r2 = 210 + (i * 23 % 50), sx = 30 + (i * 17 % 25), sy = 38 + (i * 29 % 40), sz = 30 + (i * 13 % 25), x = Math.cos(a) * r2, z = Math.sin(a) * r2;
    mts.push([x, 0, z, sx, sy, sz, i]); mcol.push(i % 2 ? '#8fb0c8' : '#7f9fbf'); caps.push([x, sy * 0.36, z, sx * 0.3, sy * 0.3, sz * 0.3, i]); }
  g.add(inst(LP.cone8, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#304050' }), mts, mcol)); g.add(inst(LP.cone8, C.emat('#f4f8ff', '#8090a0'), caps));
  /* pond water (green and cloudy until the mystery is solved) and the stream */
  W.water = new T.Mesh(new T.CircleGeometry(15.5, 48), new T.MeshLambertMaterial({ color: '#5a8a3a', transparent: true, opacity: 0.85, emissive: '#102a10' }));
  W.water.rotation.x = -Math.PI / 2; W.water.position.set(POND.x, WL0, POND.z); g.add(W.water);
  W.scum = new T.Group(); for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 3 + (i * 7 % 11); const m = new T.Mesh(new T.CircleGeometry(1 + (i % 3) * 0.5, 10), C.basic('#6fae3a', 0.7)); m.rotation.x = -Math.PI / 2; m.position.set(POND.x + Math.cos(a) * r, WL0 + 0.03, POND.z + Math.sin(a) * r); W.scum.add(m); } g.add(W.scum);
  /* the stream follows the ground in short pieces so it never floats or sinks on slopes */
  const strM = new T.MeshLambertMaterial({ color: '#6aa0c0', transparent: true, opacity: 0.8 }), strL = [], strJ = [];
  for (let i = 0; i < STREAM.length - 1; i++) { const a = STREAM[i], b = STREAM[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(len / 2), ang = -Math.atan2(b[1] - a[1], b[0] - a[0]);
    for (let k = 0; k < n; k++) { const u = (k + 0.5) / n, mx = a[0] + (b[0] - a[0]) * u, mz = a[1] + (b[1] - a[1]) * u; strL.push([mx, Math.max(H(mx, mz), H(mx + 0.8, mz), H(mx - 0.8, mz), H(mx, mz + 0.8), H(mx, mz - 0.8)) + 0.12, mz, len / n + 0.9, 1, 2.3, ang]); } }
  for (let i = 1; i < STREAM.length - 1; i++) { const p0 = STREAM[i]; strJ.push([p0[0], Math.max(H(p0[0], p0[1]), H(p0[0] + 0.8, p0[1]), H(p0[0] - 0.8, p0[1]), H(p0[0], p0[1] + 0.8), H(p0[0], p0[1] - 0.8)) + 0.13, p0[1], 1.15, 1, 1.15]); }
  g.add(inst(new T.BoxGeometry(1, 0.02, 1), strM, strL)); g.add(inst(new T.CylinderGeometry(1, 1, 0.02, 16), strM, strJ));
  /* trees: forest in the north-east, a few scattered */
  const trunkM = C.emat('#6a4a2a', '#1a0e05'), leafM = [C.emat('#3f8a3a', '#0a1a08'), C.emat('#4f9a3a', '#0a1a08'), C.emat('#2f7a3a', '#081808')];
  const tree = function (x, z, s, oak) {
    const y = H(x, z), t1 = new T.Mesh(G.cyl, trunkM); t1.scale.set(0.35 * s, 3 * s, 0.35 * s); t1.position.set(x, y + 1.5 * s, z); g.add(t1);
    const c = new T.Mesh(oak ? G.sph : G.cone, leafM[Math.floor(Math.abs(x * 7 + z * 3)) % 3]); if (oak) { c.scale.set(2.6 * s, 2.2 * s, 2.6 * s); c.position.set(x, y + 4.2 * s, z); } else { c.scale.set(1.8 * s, 2.6 * s, 1.8 * s); c.position.set(x, y + 4.6 * s, z); } g.add(c);
    W.colliders.push({ x: x, z: z, r: 0.6 * s + 0.3, cr: (oak ? 2.6 : 1.9) * s, bot: y + (oak ? 2.0 : 3.3) * s, m: c }); W.anim.push({ m: c, ph: x + z, sway: true });
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
  /* a ring of forest on the rolling hills around the reserve (instanced so it is cheap) */
  const ringN = S0low() ? 160 : 260, cone = new T.InstancedMesh(LP.cone8, new T.MeshLambertMaterial({ color: '#ffffff' }), ringN), trunk = new T.InstancedMesh(LP.cyl, trunkM, ringN), dm0 = new T.Object3D(), tc = new T.Color();
  for (let i = 0; i < ringN; i++) {
    const a = i * 2.39996, r2 = EDGE + 4 + ((i * 37) % 60) * (i % 3 === 0 ? 1.4 : 0.9); let x = Math.cos(a) * r2, z = Math.sin(a) * r2;
    if (Math.hypot(x - SPRING.x, z + 66) < 11) { x *= 1.5; z *= 1.5; }
    const y = H(x, z), s2 = 1.1 + (i % 5) * 0.25;
    dm0.position.set(x, y + 4.6 * s2, z); dm0.scale.set(1.9 * s2, 2.8 * s2, 1.9 * s2); dm0.rotation.y = i; dm0.updateMatrix(); cone.setMatrixAt(i, dm0.matrix);
    tc.set(['#2f6a32', '#3a7a3a', '#2a5a30', '#4a8a3a'][i % 4]).offsetHSL(0, 0, (Math.sin(i * 1.7) * 0.04)); cone.setColorAt(i, tc);
    dm0.position.set(x, y + 1.5 * s2, z); dm0.scale.set(0.35 * s2, 3 * s2, 0.35 * s2); dm0.updateMatrix(); trunk.setMatrixAt(i, dm0.matrix); if (Math.hypot(x, z) < BOUND + 10) W.colliders.push({ x: x, z: z, r: 0.35 * s2 + 0.4, cr: 1.9 * s2, bot: y + 3.2 * s2, inst: i, mat: cone.instanceMatrix.array.slice(i * 16, i * 16 + 16) });
  }
  g.add(cone); g.add(trunk); W.ringCone = cone;
  /* birches along the paths and the orchard of apple trees */
  const birchM = C.emat('#f0ece0', '#2a2a28'), birchLeaf = C.emat('#8acb4a', '#142a08');
  [[12, 20], [20, 6], [-20, -14], [-2, 24], [24, -30], [-30, 0], [30, -6]].forEach(function (p) { const y = H(p[0], p[1]), t1 = new T.Mesh(G.cyl, birchM); t1.scale.set(0.22, 3.6, 0.22); t1.position.set(p[0], y + 1.8, p[1]); g.add(t1);
    const c = new T.Mesh(G.sph, birchLeaf); c.scale.set(1.5, 2.3, 1.5); c.position.set(p[0], y + 4.4, p[1]); g.add(c); W.anim.push({ m: c, ph: p[0], sway: true }); W.colliders.push({ x: p[0], z: p[1], r: 0.45 }); });
  const appleM = C.emat('#e0403a', '#3a0a08'), apples = []; W.orchard = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const x = ORCH.x - 6.75 + c * 4.5, z = ORCH.z - 5 + r * 5, y = H(x, z); tree(x, z, 0.85, true);
    for (let k = 0; k < 6; k++) apples.push([x + Math.cos(k * 1.1) * 1.9, y + 3.4 + (k % 3) * 0.6, z + Math.sin(k * 1.1) * 1.9, 0.22, 0.22, 0.22]);
    W.orchard.push({ x: x, z: z }); }
  for (let k = 0; k < 8; k++) { const x = ORCH.x - 4 + (k * 1.7) % 9, z = ORCH.z - 3 + (k * 2.3) % 7; apples.push([x, H(x, z) + 0.2, z, 0.22, 0.22, 0.22]); }
  g.add(inst(LP.sph, appleM, apples));
  /* robin nest with blue eggs in one apple tree */
  const nx = ORCH.x + 2.25, nz = ORCH.z, ny = H(nx, nz) + 3.0; const nest = new T.Mesh(G.tor, C.emat('#7a5a3a', '#1a0e05')); nest.scale.set(0.55, 0.55, 0.35); nest.rotation.x = Math.PI / 2; nest.position.set(nx + 0.9, ny, nz + 0.9); g.add(nest);
  for (let k = 0; k < 3; k++) { const e = new T.Mesh(G.sph, C.emat('#8fd0f0', '#203a4a')); e.scale.set(0.13, 0.17, 0.13); e.position.set(nx + 0.8 + k * 0.12, ny + 0.08, nz + 0.85 + (k % 2) * 0.12); g.add(e); }
  /* the spring: cliff, waterfall, pool, mist */
  const wfTop = H(SPRING.x, -67) + 0.4, wfBot = H(SPRING.x, -60.5) + 0.3, dz = -67 + 60.5, dy = wfTop - wfBot, Lw = Math.hypot(dz, dy);
  const cv = document.createElement('canvas'); cv.width = 32; cv.height = 128; const cx = cv.getContext('2d'); cx.fillStyle = '#9fd8ff'; cx.fillRect(0, 0, 32, 128);
  for (let i = 0; i < 40; i++) { cx.fillStyle = i % 2 ? 'rgba(255,255,255,.8)' : 'rgba(200,236,255,.7)'; cx.fillRect((i * 7) % 32, (i * 23) % 128, 2 + (i % 3), 10 + (i * 13) % 30); }
  W.wfTex = new T.CanvasTexture(cv); W.wfTex.wrapS = W.wfTex.wrapT = T.RepeatWrapping; W.wfTex.repeat.set(1, 2);
  const wf = new T.Mesh(new T.PlaneGeometry(3.2, Lw), new T.MeshBasicMaterial({ map: W.wfTex, transparent: true, opacity: 0.88, side: T.DoubleSide }));
  wf.position.set(SPRING.x, (wfTop + wfBot) / 2 + 0.2, (-67 - 60.5) / 2 + 0.3); wf.rotation.x = Math.atan2(dz, dy); g.add(wf);
  const pool = new T.Mesh(new T.CircleGeometry(3.4, 32), new T.MeshLambertMaterial({ color: '#4a9ad0', transparent: true, opacity: 0.85, emissive: '#0a2a40' })); pool.rotation.x = -Math.PI / 2; pool.position.set(SPRING.x, H(SPRING.x, SPRING.z) + 0.45, SPRING.z); g.add(pool);
  W.mist = []; for (let i = 0; i < 6; i++) { const m = C.glow('#ffffff', 2.5, 0.35); m.position.set(SPRING.x + (i - 2.5) * 0.6, wfBot + 0.6, -61.2); g.add(m); W.mist.push({ m: m, y: m.position.y, ph: i }); }
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + 0.3, rr = 4.2 + (i % 2), x = SPRING.x + Math.cos(a) * rr, z = SPRING.z + Math.sin(a) * rr * 0.6 - 1.5; if (z < -63) continue; rock(x, z, 0.6 + (i % 3) * 0.25); }
  [[-34, -66, 2.2], [-22, -66, 2], [-31, -70, 2.6], [-25, -70.5, 2.4]].forEach(function (r) { rock(r[0], r[1], r[2]); });
  /* lichen-covered boulder near the hill */
  rock(34, -36, 2.2);   const lc = [], lcc = []; for (let i = 0; i < 9; i++) { const a = i * 0.9; lc.push([34 + Math.cos(a) * 1.75, H(34, -36) + 1.1 + Math.sin(i * 2.1) * 0.6, -36 + Math.sin(a) * 1.75, 0.5, 0.14, 0.5, a]); lcc.push(i % 3 ? '#c8d070' : '#e0a040'); }
  g.add(inst(G.sph, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#2a3008' }), lc, lcc));
  /* owl on a big oak in the forest, with pellets below */
  tree(34, 44, 1.5, true); W.owl = new T.Group(); const ob = new T.Mesh(G.sph, C.emat('#8a6a4a', '#1a1008')); ob.scale.set(0.45, 0.6, 0.42); W.owl.add(ob);
  const face = new T.Mesh(G.sph, C.emat('#e8d8b8', '#3a3020')); face.scale.set(0.34, 0.3, 0.12); face.position.set(0, 0.2, 0.34); W.owl.add(face);
  [-1, 1].forEach(function (sd) { const ey = new T.Mesh(G.sph, C.emat('#ffc83a', '#5a4000')); ey.scale.setScalar(0.09); ey.position.set(sd * 0.13, 0.24, 0.44); W.owl.add(ey); const pu = new T.Mesh(G.sph, C.basic('#10202c')); pu.scale.setScalar(0.045); pu.position.set(sd * 0.13, 0.24, 0.52); W.owl.add(pu);
    const tuft = new T.Mesh(G.cone, C.emat('#7a5a3a', '#1a1008')); tuft.scale.set(0.08, 0.2, 0.08); tuft.position.set(sd * 0.25, 0.6, 0.1); tuft.rotation.z = -sd * 0.3; W.owl.add(tuft); });
  const branch = new T.Mesh(G.cyl, trunkM); branch.scale.set(0.12, 1.4, 0.12); branch.rotation.z = Math.PI / 2; branch.position.set(34.6, H(34, 44) + 4.0, 44.9); g.add(branch);
  W.owl.position.set(34.6, H(34, 44) + 4.6, 45.1); g.add(W.owl);
  for (let i = 0; i < 3; i++) { const pe = new T.Mesh(G.sph, C.emat('#7a6a5a', '#1a1410')); pe.scale.set(0.22, 0.15, 0.32); pe.position.set(35.4 + i * 0.4, H(35.4, 46) + 0.12, 46 + (i % 2) * 0.3); g.add(pe); }
  /* milkweed with monarch butterflies; more butterflies in the meadow */
  const mw = C.emat('#7aa05a', '#14200a'), mwf = C.emat('#e8a0c8', '#3a1a2a'); for (let i = 0; i < 5; i++) { const x = 16 + (i % 3) * 0.9, z = 38 + Math.floor(i / 3) * 0.9, y = H(x, z); const st0 = new T.Mesh(G.cyl, mw); st0.scale.set(0.06, 1.2, 0.06); st0.position.set(x, y + 0.6, z); g.add(st0); const fl0 = new T.Mesh(G.sph, mwf); fl0.scale.set(0.3, 0.2, 0.3); fl0.position.set(x, y + 1.25, z); g.add(fl0); }
  W.flies = []; const wingM = C.emat('#ff9f3a', '#5a2a00'), wingB = C.emat('#7fd4ff', '#103a5a'), wingY = C.emat('#ffe08a', '#5a4a10');
  for (let i = 0; i < (S0low() ? 6 : 12); i++) { const b = new T.Group(), wm = i < 3 ? wingM : [wingM, wingB, wingY][i % 3]; [-1, 1].forEach(function (sd) { const w = new T.Mesh(G.box, wm); w.scale.set(0.32, 0.02, 0.26); w.position.x = sd * 0.17; b.add(w); }); g.add(b);
    W.flies.push({ m: b, ph: i * 1.3, cx: i < 3 ? 16.9 : -6 + (i * 13 % 30), cz: i < 3 ? 38.5 : 34 + (i * 7 % 22), r: i < 3 ? 1.2 : 3 + (i % 3) }); }
  /* cattails, lily pads, and dragonflies at the pond */
  const ctS = C.emat('#6a8a3a', '#10200a'), ctH = C.emat('#6a4a2a', '#140a04');
  const cts = [], cth = []; for (let i = 0; i < 26; i++) { const a = 2.2 + (i / 26) * 2.2, rr = 15.3 + (i % 3) * 0.5, x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr, y = H(x, z); cts.push([x, y + 0.9, z, 0.05, 1.8, 0.05]); cth.push([x, y + 1.7, z, 0.12, 0.4, 0.12]); }
  g.add(inst(LP.cyl, ctS, cts)); g.add(inst(LP.cyl, ctH, cth));
  const padM = C.emat('#4a9a3a', '#0a2008'), lotus = C.emat('#ffb0d0', '#4a1a2a'), pads = [], lots = [], padG = new T.CylinderGeometry(0.8, 0.8, 0.04, 14, 1, false, 0.3, 5.8);
  for (let i = 0; i < 12; i++) { const a = i * 2.1, rr = 4 + (i * 5 % 9), x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr; pads.push([x, WL0 + 0.05, z, 1, 1, 1, i]); if (i % 3 === 0) lots.push([x, WL0 + 0.2, z, 0.25, 0.18, 0.25]); }
  W.padIM = inst(padG, padM, pads); g.add(W.padIM); g.add(inst(G.sph, lotus, lots));
  W.dflies = []; for (let i = 0; i < 3; i++) { const d0 = new T.Group(), bd = new T.Mesh(G.cyl, C.emat('#3a8ad0', '#0a2a5a')); bd.scale.set(0.06, 0.55, 0.06); bd.rotation.x = Math.PI / 2; d0.add(bd);
    [-1, 1].forEach(function (sd) { [0.1, -0.1].forEach(function (zz) { const w = new T.Mesh(G.box, C.basic('#dff4ff', 0.6)); w.scale.set(0.5, 0.01, 0.1); w.position.set(sd * 0.27, 0.02, zz); d0.add(w); }); }); g.add(d0); W.dflies.push({ m: d0, ph: i * 2.1 }); }
  /* anthill near the station with a trail of ants */
  const ah = new T.Mesh(G.cone, C.emat('#9a6a3a', '#2a1a08')); ah.scale.set(1.2, 0.7, 1.2); ah.position.set(14, H(14, 4) + 0.35, 4); g.add(ah); W.colliders.push({ x: 14, z: 4, r: 1 });
  W.ants = new T.InstancedMesh(LP.sph, C.basic('#1a1008'), 24); g.add(W.ants);
  /* compost pile with earthworms by the farm */
  const cp = new T.Mesh(G.sph, C.emat('#4a3020', '#100804')); cp.scale.set(1.8, 0.8, 1.4); cp.position.set(-50, H(-50, -27) + 0.2, -27); g.add(cp); W.colliders.push({ x: -50, z: -27, r: 1.6 });
  for (let i = 0; i < 6; i++) { const lf = new T.Mesh(G.box, C.emat(['#c08a3a', '#a06a2a', '#d0a04a'][i % 3], '#2a1a08')); lf.scale.set(0.5, 0.04, 0.3); lf.rotation.y = i; lf.position.set(-50 + Math.cos(i) * 1.1, H(-50, -27) + 0.85, -27 + Math.sin(i) * 0.8); g.add(lf); }
  W.worms = []; for (let i = 0; i < 4; i++) { const w = new T.Mesh(G.cyl, C.emat('#e08a8a', '#4a1a1a')); w.scale.set(0.06, 0.35, 0.06); w.position.set(-50.6 + i * 0.4, H(-50, -27) + 0.85, -26.6 + (i % 2) * 0.3); g.add(w); W.worms.push({ m: w, ph: i }); }
  /* a deer grazing at the orchard edge */
  W.deer = new T.Group(); const dM = C.emat('#b07a4a', '#2a1808'), dB = new T.Mesh(G.sph, dM); dB.scale.set(0.55, 0.55, 1.1); dB.position.y = 1.35; W.deer.add(dB);
  [[-0.3, 0.6], [0.3, 0.6], [-0.3, -0.6], [0.3, -0.6]].forEach(function (l) { const lg0 = new T.Mesh(G.cyl, dM); lg0.scale.set(0.07, 0.9, 0.07); lg0.position.set(l[0], 0.5, l[1]); W.deer.add(lg0); });
  W.deerHead = new T.Group(); const nk = new T.Mesh(G.cyl, dM); nk.scale.set(0.15, 0.7, 0.15); nk.position.y = 0.35; W.deerHead.add(nk); const hd0 = new T.Mesh(G.sph, dM); hd0.scale.set(0.22, 0.24, 0.42); hd0.position.set(0, 0.75, 0.15); W.deerHead.add(hd0);
  [-1, 1].forEach(function (sd) { const ear = new T.Mesh(G.cone, dM); ear.scale.set(0.08, 0.2, 0.05); ear.position.set(sd * 0.17, 0.98, 0.05); ear.rotation.z = -sd * 0.6; W.deerHead.add(ear); });
  W.deerHead.position.set(0, 1.55, 0.95); W.deer.add(W.deerHead); const tail = new T.Mesh(G.sph, C.emat('#ffffff', '#3a3a3a')); tail.scale.set(0.12, 0.18, 0.1); tail.position.set(0, 1.6, -1.1); W.deer.add(tail); W.deerTail = tail;
  W.dr = { x: -30, z: 50 }; W.deer.position.set(-30, H(-30, 50), 50); W.deer.rotation.y = 2.4; g.add(W.deer);
  /* meadow flowers and clover (instanced so they are cheap to draw) */
  const FN = S0low() ? 400 : 900, fl = new T.InstancedMesh(LP.sph, new T.MeshLambertMaterial({ color: '#ffffff' }), FN), dm = new T.Object3D(), fcol = ['#ff8fb1', '#ffd166', '#ffffff', '#c59cff', '#ff9f6e', '#7fd4ff'], stems = new T.InstancedMesh(LP.cyl, C.emat('#4a8a2a', '#0a1a08'), FN);
  for (let i = 0; i < FN; i++) { let x, z; if (i < 160) { x = -6 + rnd(i) * 30; z = 34 + rnd(i + 999) * 22; } else { const a = rnd(i) * 6.2832, r2 = 6 + Math.sqrt(rnd(i + 500)) * 56; x = Math.cos(a) * r2; z = Math.sin(a) * r2; }
    const bad = Math.hypot(x - POND.x, z - POND.z) < 16.5 || (Math.abs(x - FARM.x) < 12 && Math.abs(z - FARM.z) < 10) || (x > 22 && z > 14) || pathDist(x, z) < 1.4 || Math.hypot(x - STATION.x, z - STATION.z) < 9 || streamDist(x, z) < 2.4 || Math.hypot(x, z) > EDGE + 3;
    const fs = bad ? 0.0001 : 0.15 + (i % 3) * 0.03; dm.position.set(x, H(x, z) + 0.34, z); dm.scale.set(fs, fs * 0.5, fs); dm.updateMatrix(); fl.setMatrixAt(i, dm.matrix); fl.setColorAt(i, new T.Color(fcol[(i * 7) % 6]));
    dm.position.set(x, H(x, z) + 0.15, z); dm.scale.set(bad ? 0.0001 : 0.025, bad ? 0.0001 : 0.32, bad ? 0.0001 : 0.025); dm.updateMatrix(); stems.setMatrixAt(i, dm.matrix); }
  g.add(stems);
  g.add(fl);
  const GN = S0low() ? 500 : 1100, gr = new T.InstancedMesh(LP.cone, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#0a1a08' }), GN), gc = new T.Color();
  for (let i = 0; i < GN; i++) { const a = rnd(i + 3000) * 6.2832, r2 = Math.sqrt(rnd(i + 7000)) * 80, x = Math.cos(a) * r2, z = Math.sin(a) * r2; if (Math.hypot(x - POND.x, z - POND.z) < 17 || (x > 22 && z > 14 && r2 < EDGE) || pathDist(x, z) < 1.3 || (Math.abs(x - FARM.x) < 12 && Math.abs(z - FARM.z) < 10)) { dm.scale.setScalar(0.0001); } else dm.scale.set(0.15, 0.3 + (i % 4) * 0.08, 0.15);
    gc.set(['#5aa03a', '#6ab04a', '#4a9030'][i % 3]); gr.setColorAt(i, gc); dm.position.set(x, H(x, z) + 0.3, z); dm.updateMatrix(); gr.setMatrixAt(i, dm.matrix); }
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
  const SL = STREAM.slice(2); W.plants = []; for (let i = 0; i < 5; i++) { const u = (i + 0.5) / 5, seg = Math.min(SL.length - 2, Math.floor(u * (SL.length - 1))), lu = u * (SL.length - 1) - seg, a = SL[seg], b = SL[seg + 1];
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
    { id: 'lu', x: FARM.x + 6, z: FARM.z + 9, r: 2.6, verb: 'cz.talk', t: 'cz.t.lu', noMark: true, use: talkLu },
    { id: 'spring', x: SPRING.x, z: SPRING.z - 0.5, r: 4.5, verb: 'cz.observe', t: 'cz.t.spring', my: 4, use: function () { find('spring'); } },
    { id: 'lichen', x: 34, z: -36, r: 3.6, verb: 'cz.observe', t: 'cz.t.lichen', my: 3.4, use: function () { find('lichen'); } },
    { id: 'owl', x: 35, z: 46, r: 3.4, verb: 'cz.observe', t: 'cz.t.owl', my: 6.2, use: function () { W.owlLook = 2; find('owl'); } },
    { id: 'monarch', x: 16.9, z: 38.5, r: 2.8, verb: 'cz.observe', t: 'cz.t.monarch', use: function () { find('monarch'); } },
    { id: 'dragonfly', x: -33, z: 33, r: 3.5, verb: 'cz.observe', t: 'cz.t.dragonfly', use: function () { find('dragonfly'); } },
    { id: 'cattail', x: -36.5, z: 18, r: 3, verb: 'cz.observe', t: 'cz.t.cattail', my: 2.8, use: function () { find('cattail'); } },
    { id: 'ants', x: 14, z: 4, r: 2.6, verb: 'cz.observe', t: 'cz.t.ants', use: function () { find('ants'); } },
    { id: 'nest', x: ORCH.x + 3.15, z: ORCH.z + 0.9, r: 3, verb: 'cz.observe', t: 'cz.t.nest', my: 4.4, use: function () { find('nest'); } },
    { id: 'deer', x: -30, z: 50, r: 5, verb: 'cz.observe', t: 'cz.t.deer', live: 'deer', my: 3.2, use: function () { W.deerAlert = 3; find('deer'); } },
    { id: 'worms', x: -50, z: -27, r: 3, verb: 'cz.observe', t: 'cz.t.worms', use: function () { find('worms'); } }
  ].concat(W && W.plants ? W.plants.map(function (p) { return { id: 'plant' + p.i, x: p.x, z: p.z, r: 2, verb: 'cz.plant', t: 'cz.t.spot', noMark: true, when: function () { return s.f.solved && !s.f.fixed && !(s.f['p' + p.i]); }, use: function () { plant(p); } }; }) : []);
}
function nearest() {
  let best = null, bd = 1e9; const list = W.spotList || (W.spotList = spots());
  list.forEach(function (sp) { if (sp.when && !sp.when()) return; let x = sp.x, z = sp.z; if (sp.live === 'rabbit') { x = W.rab.x; z = W.rab.z; } if (sp.live === 'deer') { x = W.dr.x; z = W.dr.z; } const d = Math.hypot(W.px - x, W.pz - z); if (d < (sp.r || 2.4) && d < bd) { bd = d; best = sp; } });
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
  { const o = W._co || (W._co = new T.Object3D()); W.clouds.forEach(function (c, i) { c.x += dt * c.sp; if (c.x > 200) c.x = -200;
      for (let k = 0; k < 5; k++) { o.position.set(c.x + (k - 2) * 6, c.y + (k % 2) * 1.5, c.z + (k % 3) * 2); o.scale.set(7 + (k % 3) * 2, 3.5 + (k % 2), 5); o.updateMatrix(); W.cloudIM.setMatrixAt(i * 5 + k, o.matrix); } }); W.cloudIM.instanceMatrix.needsUpdate = true; }
  W.wfTex.offset.y -= dt * 1.6; W.mist.forEach(function (m) { m.m.position.y = m.y + Math.sin(W.t * 2 + m.ph) * 0.3; m.m.material.opacity = 0.25 + Math.sin(W.t * 3 + m.ph) * 0.1; });
  W.flies.forEach(function (f, i) { const a = W.t * 0.7 + f.ph, x = f.cx + Math.cos(a) * f.r, z = f.cz + Math.sin(a * 1.3) * f.r; f.m.position.set(x, H(x, z) + 1.4 + Math.sin(W.t * 2 + i) * 0.4, z); f.m.rotation.y = -a; f.m.children[0].rotation.z = Math.sin(W.t * 14 + i) * 0.8; f.m.children[1].rotation.z = -Math.sin(W.t * 14 + i) * 0.8; });
  W.dflies.forEach(function (d0, i) { const a = W.t * 0.9 + d0.ph, x = -31 + Math.cos(a) * 3 + Math.sin(W.t * 2.3 + i) * 0.8, z = 31 + Math.sin(a) * 2.5; d0.m.position.set(x, WL0 + 1 + Math.sin(W.t * 3 + i) * 0.3, z); d0.m.rotation.y = -a - Math.PI / 2; });
  { const dm1 = new T.Object3D(); for (let i = 0; i < 24; i++) { const a = W.t * 0.35 + i * 0.27, rr = 1.2 + (i % 2) * 0.12, x = 14 + Math.cos(a) * rr + (i > 12 ? Math.cos(a) * 1.4 : 0), z = 4 + Math.sin(a) * rr; dm1.position.set(x, H(x, z) + 0.06, z); dm1.scale.set(0.07, 0.05, 0.12); dm1.rotation.y = -a; dm1.updateMatrix(); W.ants.setMatrixAt(i, dm1.matrix); } W.ants.instanceMatrix.needsUpdate = true; }
  W.worms.forEach(function (w) { w.m.rotation.z = Math.sin(W.t * 3 + w.ph) * 0.6; w.m.scale.y = 0.3 + Math.abs(Math.sin(W.t * 2 + w.ph)) * 0.12; });
  { const dd = Math.hypot(W.px - W.dr.x, W.pz - W.dr.z), alert = dd < 8 || W.deerAlert > 0; if (W.deerAlert > 0) W.deerAlert -= dt;
    W.deerHead.rotation.x = alert ? -0.35 : 0.9 + Math.sin(W.t * 2) * 0.12; W.deerTail.position.y = alert ? 1.75 : 1.6;
    if (alert) W.deer.rotation.y += (((Math.atan2(W.px - W.dr.x, W.pz - W.dr.z) - W.deer.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 2); }
  if (W.owlLook > 0) { W.owlLook -= dt; W.owl.rotation.y = Math.sin(W.owlLook * 6) * 0.9; } else W.owl.rotation.y = Math.atan2(W.px - W.owl.position.x, W.pz - W.owl.position.z) * 0.7;
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
    const sp = (k.run ? 13 : 6) * (inWater ? 0.55 : 1), cy = Math.cos(W.yaw), sy = Math.sin(W.yaw);
    const dx = (mx * cy + mz * sy) / len, dz = (-mx * sy + mz * cy) / len;
    W.px += dx * sp * dt; W.pz += dz * sp * dt; W.face = Math.atan2(dx, dz);
    if (!W.drag) { const want = Math.atan2(-dx, -dz), d = ((want - W.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; W.yaw += d * Math.min(1, dt * 0.9) * (mz < 0 ? 1 : 0.25); }
  }
  { const dd = Math.hypot(W.px, W.pz); if (dd > BOUND) { W.px *= BOUND / dd; W.pz *= BOUND / dd; } }
  if (len > 0 && !k.run && !W.toldRun) { W.walkT = (W.walkT || 0) + dt; if (W.walkT > 6) { W.toldRun = true; showCard('msg', 'cz.runTip'); W.cardT = 4; } }
  if (k.run && len > 0) W.toldRun = true;
  if (k.run && len > 0 && W.ground && !busy) { W.dustT = (W.dustT || 0) - dt; if (W.dustT <= 0) { W.dustT = 0.09; const p0 = C.glow('#e8dcc0', 1.2, 0.6); p0.position.set(W.px, W.py + 0.2, W.pz); W.g.add(p0); (W.dust = W.dust || []).push({ m: p0, t: 0 }); } }
  if (W.dust) W.dust = W.dust.filter(function (d0) { d0.t += dt; d0.m.position.y += dt * 0.6; d0.m.material.opacity = Math.max(0, 0.6 - d0.t); d0.m.scale.setScalar(1.2 + d0.t * 2); if (d0.t > 0.6) { W.g.remove(d0.m); return false; } return true; });
  W.colliders.forEach(function (c) { const dx = W.px - c.x, dz = W.pz - c.z, d = Math.hypot(dx, dz), mn = c.r + 0.45; if (d < mn && d > 0.001 && W.py < H(c.x, c.z) + 3.5) { W.px = c.x + dx / d * mn; W.pz = c.z + dz / d * mn; } });
  const gy = H(W.px, W.pz);
  if (!busy && k.jump && W.ground) { W.vy = 9; W.ground = false; C.beep(420, 0.06, 'triangle'); }
  W.vy -= 24 * dt; if (!W.ground && k.jump && W.vy < -2.2) { W.vy = -2.2; W.gliding = true; } else W.gliding = false;
  W.py += W.vy * dt; if (W.py <= gy) { W.py = gy; W.vy = 0; W.ground = true; } else if (W.py > gy + 0.05) W.ground = false;
  W.me.position.set(W.px, W.py, W.pz); W.me.rotation.y += (((W.face - W.me.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 10);
  const legs = W.me.userData.legs; if (legs) { W.stride = (W.stride || 0) + dt * len * (k.run ? 14 : 9); legs.forEach(function (h, i) { h.rotation.x = W.ground ? Math.sin(W.stride + i * Math.PI) * 0.7 * Math.min(1, len) : (W.gliding ? 0.6 : -0.5); }); }
  W.me.rotation.z = W.gliding ? Math.sin(W.t * 6) * 0.08 : 0; W.me.rotation.x = (k.run && len > 0 && W.ground) ? 0.18 : 0;
  /* camera follows behind */
  const tgt = new T.Vector3(W.px, W.py + 1.6, W.pz), cp = Math.cos(W.pitch);
  const want = new T.Vector3(tgt.x + Math.sin(W.yaw) * cp * W.dist, tgt.y + Math.sin(W.pitch) * W.dist, tgt.z + Math.cos(W.yaw) * cp * W.dist);
  { /* keep the camera out of trees and rocks: move it in front of anything between it and the player */
    const vx = want.x - tgt.x, vz = want.z - tgt.z, L2 = vx * vx + vz * vz; let best = 1;
    if (L2 > 0.01) W.colliders.forEach(function (c) { const rr = c.r + 0.6, u = ((c.x - tgt.x) * vx + (c.z - tgt.z) * vz) / L2; if (u <= 0 || u > 1.2) return;
      const px = tgt.x + vx * u - c.x, pz = tgt.z + vz * u - c.z; if (px * px + pz * pz < rr * rr) { const back = u - rr / Math.sqrt(L2); if (back < best) best = back; } });
    best = Math.max(0.28, best); if (best < 1) { want.x = tgt.x + vx * best; want.z = tgt.z + vz * best; want.y = tgt.y + (want.y - tgt.y) * best; } }
  const gc = H(want.x, want.z) + 1.2; if (want.y < gc) want.y = gc;
  cam.position.lerp(want, Math.min(1, dt * 6)); cam.lookAt(tgt);
  { /* tree tops between the camera and the player fade out so you can always see yourself */
    const ax = tgt.x, az = tgt.z, bx = cam.position.x - ax, bz = cam.position.z - az, L2 = bx * bx + bz * bz, hy = Math.max(cam.position.y, tgt.y) + 0.4; let instDirty = false;
    W.colliders.forEach(function (c) { if (!c.cr) return; let hide = false;
      if (L2 > 0.01 && c.bot < hy) { const u = Math.max(0, Math.min(1, ((c.x - ax) * bx + (c.z - az) * bz) / L2)), px = ax + bx * u - c.x, pz = az + bz * u - c.z; hide = px * px + pz * pz < (c.cr + 0.4) * (c.cr + 0.4) && u > 0.05; }
      if (hide === !!c.hidden) return; c.hidden = hide;
      if (c.m) c.m.visible = !hide;
      else if (c.inst != null) { const arr = W.ringCone.instanceMatrix.array, o = c.inst * 16; if (hide) { for (let k = 0; k < 16; k++) arr[o + k] = 0; } else for (let k = 0; k < 16; k++) arr[o + k] = c.mat[k]; instDirty = true; } });
    if (instDirty) W.ringCone.instanceMatrix.needsUpdate = true; }
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

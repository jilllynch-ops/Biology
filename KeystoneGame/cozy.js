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
  'cz.controls': 'Move: WASD or arrows · Run: Shift · Jump: Space (hold in the air to glide) · Swim down: C · Interact: E · Listen: L · Map: M · Hint: H · Look around: drag the mouse, Q / R, T / G · Zoom: mouse wheel or − / + · Look closer: V · Journal: J · Menu: Esc · Show or hide this list: K',
  'cz.swimTip': 'You are swimming! Hold C to dive under the water. Hold Space to rise. Press Space at the surface near the shore to climb out.',
  'cz.diveTip': 'Underwater! Look around with the mouse. You float back up on your own whenever you let go of C.',
  'cz.edgeTip': 'The hills beyond the reserve are steep and wild. This is as far as the trail goes. Turn around and keep exploring!',
  'cz.edgeTip2': 'This is the edge of the lookout. Enjoy the view from here, but it is a long way down!',
  'cz.flyTip': 'Flying! Space: go up · C: go down · Shift: faster. Watch your energy bar. When it runs out you glide down gently.',
  'cz.flyNew': 'Warm air rises up this hill. Your alien suit can ride it! NEW ABILITY: press F to fly for a short time. Energy refills while you walk on the ground.',
  'cz.flyLow': 'Not enough flight energy yet. It refills while you are on the ground.',
  'cz.lookTip': 'Look closer: the camera zooms in so you can study small things. Press V again to zoom back out.',
  'cz.t.whitepine': 'the tall pine', 'cz.t.hemlock': 'the hemlock trees', 'cz.t.redmaple': 'the red tree', 'cz.t.sycamore': 'the white-barked tree', 'cz.t.willow': 'the willow', 'cz.t.dogwood': 'the flowering tree', 'cz.t.hickory': 'the golden tree',
  'cz.n.whitepine': 'Eastern white pine', 'cz.n.hemlock': 'Eastern hemlock', 'cz.n.redmaple': 'Red maple', 'cz.n.sycamore': 'American sycamore', 'cz.n.willow': 'Black willow', 'cz.n.dogwood': 'Flowering dogwood', 'cz.n.hickory': 'Shagbark hickory',
  'cz.d.whitepine': 'An evergreen CONIFER. Its needles grow in bundles of 5, and its seeds grow inside cones instead of fruits. It keeps its needles all year, so it can do photosynthesis even in winter.',
  'cz.d.hemlock': 'Pennsylvania\'s state tree! Hemlocks grow in cool, shady valleys. Their deep shade keeps streams cold, and cold water holds more DISSOLVED OXYGEN for trout and stream insects.',
  'cz.d.redmaple': 'A DECIDUOUS tree: it drops its leaves in fall. Its winged seeds spin like little helicopters, so the wind carries them far from the parent tree.',
  'cz.d.sycamore': 'Sycamores grow along streams. The bark peels off in patches and shows white wood underneath. Their roots hold the stream bank together and slow EROSION.',
  'cz.d.willow': 'Black willows grow right at the water\'s edge, where the soil is soaked. Their branches shade the water, and many insects and birds feed and nest in them.',
  'cz.d.dogwood': 'A small tree that grows in the shade of bigger trees. In spring its white blossoms feed POLLINATORS. In fall birds eat its red berries and spread the seeds in their droppings.',
  'cz.d.hickory': 'Its nuts feed squirrels, chipmunks and deer. Squirrels bury nuts and forget some of them, so they help plant new hickory trees. The leaves turn golden in fall.',
  'cz.d.biodiv': 'BIODIVERSITY: you found 5 different kinds of trees! Each kind has its own shape, leaves, seeds and job in the ecosystem. A forest with many species is more stable: if a disease harms one kind of tree, the others still give food and shelter.',
  'cz.lookout': 'Look through the viewer at', 'cz.t.seaview': 'the sea', 'cz.t.valleyview': 'the valley', 'cz.t.canyonview': 'the canyon',
  'cz.n.seaview': 'Sea cliff lookout', 'cz.n.valleyview': 'Valley lookout', 'cz.n.canyonview': 'Canyon lookout',
  'cz.d.seaview': 'The ocean! Tiny drifting algae called PHYTOPLANKTON live in the sunlit top layer of the sea. Together they make roughly half of the oxygen on Earth. The striped rock in the cliff is made of layers of sediment laid down long ago.',
  'cz.d.valleyview': 'Look: the pond spills over the cliff, and that water joins the river past the farms, the town and the wetland. All the land that drains into one river is a WATERSHED. Whatever washes into the water up here travels down there too.',
  'cz.d.canyonview': 'The river at the bottom carved this canyon by EROSION, grain by grain, over a very long time. Each colored stripe in the wall is a rock layer; deeper layers are older. (Press V to zoom back out.)',
  'cz.musicVol': 'Music volume', 'cz.soundVol': 'Nature sounds and effects',
  'cz.m.ears': 'Animals may have noticed something too. Press L near them to listen.',
  'cz.fill': 'Fill your jar with',
  'cz.m.o2': 'Gather evidence ({n} of 4):',
  'cz.m.k.water': 'Pond water: walk out on the wooden dock and press E to look closely and fill your jar.',
  'cz.m.k.oxygen': 'Oxygen: use the test kit on the south shore of the pond (sparkle).',
  'cz.m.k.micro': 'Microscope: take your jar to the table outside the research station cabin.',
  'cz.m.k.farm': 'Source: follow the stream uphill from the pond and see what is beside it.',
  'cz.s.gotPond': 'Your jar is full of green pond water! Take it to the microscope on the table outside the research station cabin.',
  'cz.note': 'Field note', 'cz.camSpeed': 'Camera speed', 'cz.camInv': 'Invert up and down', 'cz.energy': 'Flight energy',
  'cz.t.mussel': 'the freshwater mussels', 'cz.t.tadpole': 'the tadpoles', 'cz.t.pondweed': 'the pondweed',
  'cz.n.mussel': 'Freshwater mussels', 'cz.n.tadpole': 'Tadpoles', 'cz.n.pondweed': 'Pondweed (underwater plant)',
  'cz.d.mussel': 'Freshwater mussels are FILTER FEEDERS. One mussel pulls in many liters of water a day and eats algae and tiny particles, which helps keep the water clear. Many kinds of mussels are endangered, so scientists observe them in place without moving them.',
  'cz.d.tadpole': 'Tadpoles are young frogs. They breathe with gills and eat algae. Later they grow legs and lungs and leave the water. This big change in body form is called METAMORPHOSIS.',
  'cz.d.pondweed': 'Pondweed is a PRODUCER that lives underwater. It uses sunlight that passes through the water for PHOTOSYNTHESIS and releases oxygen into the water. When algae turn the water green, less light reaches it.',
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
  'cz.controls': 'Moverse: WASD o flechas · Correr: Shift · Saltar: Espacio (mantenlo en el aire para planear) · Bucear: C · Interactuar: E · Escuchar: L · Mapa: M · Pista: H · Mirar alrededor: arrastra el ratón, Q / R, T / G · Zoom: rueda del ratón o − / + · Mirar de cerca: V · Diario: J · Menú: Esc · Mostrar u ocultar esta lista: K',
  'cz.swimTip': '¡Estás nadando! Mantén C para bucear bajo el agua. Mantén Espacio para subir. Pulsa Espacio en la superficie cerca de la orilla para salir.',
  'cz.diveTip': '¡Bajo el agua! Mira alrededor con el ratón. Vuelves a flotar solo cuando sueltas C.',
  'cz.edgeTip': 'Las colinas más allá de la reserva son empinadas y salvajes. Hasta aquí llega el sendero. ¡Da la vuelta y sigue explorando!',
  'cz.edgeTip2': 'Este es el borde del mirador. Disfruta la vista desde aquí, ¡pero hay una gran caída!',
  'cz.flyTip': '¡Volando! Espacio: subir · C: bajar · Shift: más rápido. Mira tu barra de energía. Cuando se acaba, bajas planeando con suavidad.',
  'cz.flyNew': 'El aire caliente sube por esta colina. ¡Tu traje alienígena puede aprovecharlo! NUEVA HABILIDAD: pulsa F para volar un rato. La energía se recarga mientras caminas por el suelo.',
  'cz.flyLow': 'Todavía no hay suficiente energía para volar. Se recarga mientras estás en el suelo.',
  'cz.lookTip': 'Mirar de cerca: la cámara se acerca para que estudies cosas pequeñas. Pulsa V otra vez para alejarla.',
  'cz.t.whitepine': 'el pino alto', 'cz.t.hemlock': 'los tsugas', 'cz.t.redmaple': 'el árbol rojo', 'cz.t.sycamore': 'el árbol de corteza blanca', 'cz.t.willow': 'el sauce', 'cz.t.dogwood': 'el árbol en flor', 'cz.t.hickory': 'el árbol dorado',
  'cz.n.whitepine': 'Pino blanco del este', 'cz.n.hemlock': 'Tsuga del Canadá', 'cz.n.redmaple': 'Arce rojo', 'cz.n.sycamore': 'Sicómoro americano', 'cz.n.willow': 'Sauce negro', 'cz.n.dogwood': 'Cornejo florido', 'cz.n.hickory': 'Nogal americano (shagbark)',
  'cz.d.whitepine': 'Una CONÍFERA de hoja perenne. Sus agujas crecen en grupos de 5 y sus semillas crecen dentro de piñas en lugar de frutos. Conserva las agujas todo el año, así que puede hacer fotosíntesis incluso en invierno.',
  'cz.d.hemlock': '¡El árbol oficial de Pensilvania! Las tsugas crecen en valles frescos y sombreados. Su sombra mantiene fríos los arroyos, y el agua fría guarda más OXÍGENO DISUELTO para las truchas y los insectos del arroyo.',
  'cz.d.redmaple': 'Un árbol CADUCIFOLIO: pierde sus hojas en otoño. Sus semillas con alas giran como pequeños helicópteros, así el viento las lleva lejos del árbol que las produjo.',
  'cz.d.sycamore': 'Los sicómoros crecen junto a los arroyos. La corteza se cae en parches y deja ver madera blanca. Sus raíces sostienen la orilla del arroyo y frenan la EROSIÓN.',
  'cz.d.willow': 'Los sauces negros crecen justo en la orilla, donde el suelo está empapado. Sus ramas dan sombra al agua, y muchos insectos y aves se alimentan y anidan en ellos.',
  'cz.d.dogwood': 'Un árbol pequeño que crece a la sombra de árboles más grandes. En primavera sus flores blancas alimentan a los POLINIZADORES. En otoño las aves comen sus bayas rojas y esparcen las semillas con sus excrementos.',
  'cz.d.hickory': 'Sus nueces alimentan a ardillas, ardillas listadas y venados. Las ardillas entierran nueces y olvidan algunas, así que ayudan a plantar nuevos nogales. Sus hojas se vuelven doradas en otoño.',
  'cz.d.biodiv': 'BIODIVERSIDAD: ¡encontraste 5 tipos diferentes de árboles! Cada tipo tiene su propia forma, hojas, semillas y función en el ecosistema. Un bosque con muchas especies es más estable: si una enfermedad daña a un tipo de árbol, los demás siguen dando alimento y refugio.',
  'cz.lookout': 'Mira por el visor hacia', 'cz.t.seaview': 'el mar', 'cz.t.valleyview': 'el valle', 'cz.t.canyonview': 'el cañón',
  'cz.n.seaview': 'Mirador del acantilado', 'cz.n.valleyview': 'Mirador del valle', 'cz.n.canyonview': 'Mirador del cañón',
  'cz.d.seaview': '¡El océano! Unas algas diminutas llamadas FITOPLANCTON flotan en la capa iluminada del mar. Juntas producen más o menos la mitad del oxígeno de la Tierra. Las franjas de la roca del acantilado son capas de sedimento depositadas hace mucho tiempo.',
  'cz.d.valleyview': 'Mira: el estanque cae por el acantilado y esa agua se une al río que pasa por las granjas, el pueblo y el humedal. Todo el terreno que drena hacia un mismo río es una CUENCA HIDROGRÁFICA. Lo que llega al agua aquí arriba también viaja hasta allá abajo.',
  'cz.d.canyonview': 'El río del fondo excavó este cañón por EROSIÓN, grano a grano, durante muchísimo tiempo. Cada franja de color de la pared es una capa de roca; las capas más profundas son más antiguas. (Pulsa V para alejar la cámara.)',
  'cz.musicVol': 'Volumen de la música', 'cz.soundVol': 'Sonidos de la naturaleza y efectos',
  'cz.m.ears': 'Puede que los animales también hayan notado algo. Pulsa L cerca de ellos para escuchar.',
  'cz.fill': 'Llena tu frasco con',
  'cz.m.o2': 'Reúne evidencia ({n} de 4):',
  'cz.m.k.water': 'Agua del estanque: camina por el muelle de madera y pulsa E para mirarla de cerca y llenar tu frasco.',
  'cz.m.k.oxygen': 'Oxígeno: usa el kit de medición en la orilla sur del estanque (destello).',
  'cz.m.k.micro': 'Microscopio: lleva tu frasco a la mesa que está afuera de la cabaña de la estación de investigación.',
  'cz.m.k.farm': 'Origen: sigue el arroyo cuesta arriba desde el estanque y mira qué hay a su lado.',
  'cz.s.gotPond': '¡Tu frasco está lleno de agua verde del estanque! Llévalo al microscopio de la mesa que está afuera de la cabaña de la estación de investigación.',
  'cz.note': 'Nota de campo', 'cz.camSpeed': 'Velocidad de la cámara', 'cz.camInv': 'Invertir arriba y abajo', 'cz.energy': 'Energía de vuelo',
  'cz.t.mussel': 'los mejillones de agua dulce', 'cz.t.tadpole': 'los renacuajos', 'cz.t.pondweed': 'la planta acuática',
  'cz.n.mussel': 'Mejillones de agua dulce', 'cz.n.tadpole': 'Renacuajos', 'cz.n.pondweed': 'Planta acuática sumergida',
  'cz.d.mussel': 'Los mejillones de agua dulce son FILTRADORES. Un mejillón aspira muchos litros de agua al día y se come las algas y partículas diminutas, lo que ayuda a mantener el agua clara. Muchas especies están en peligro, así que los científicos los observan sin moverlos.',
  'cz.d.tadpole': 'Los renacuajos son ranas jóvenes. Respiran con branquias y comen algas. Más tarde les crecen patas y pulmones y salen del agua. Este gran cambio de forma del cuerpo se llama METAMORFOSIS.',
  'cz.d.pondweed': 'Esta planta acuática es un PRODUCTOR que vive bajo el agua. Usa la luz del sol que atraviesa el agua para la FOTOSÍNTESIS y suelta oxígeno al agua. Cuando las algas vuelven verde el agua, le llega menos luz.',
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
/* LEARNING TO LISTEN: animal voices, human characters, the alien's log */
Object.assign(C.I18N.en, {
  'cz.listen': 'Listen to', 'cz.listenKey': 'L: 👂 Listen', 'cz.listening': 'listening with your antennae',
  'cz.an.frog': '🐸 Frog', 'cz.an.heron': '🪶 Great blue heron', 'cz.an.fish': '🐟 Sunfish', 'cz.an.robin': '🐦 Robin', 'cz.an.deer': '🦌 Deer', 'cz.an.worms': '🪱 Earthworms', 'cz.an.bees': '🐝 Bumblebee', 'cz.an.owl': '🦉 Owl',
  'cz.lt.frog': 'the frog', 'cz.lt.heron': 'the heron', 'cz.lt.fish': 'the fish', 'cz.lt.robin': 'the robin', 'cz.lt.deer': 'the deer', 'cz.lt.worms': 'the earthworms', 'cz.lt.bees': 'the bumblebee', 'cz.lt.owl': 'the owl',
  'cz.v.frog1': 'Ribbit. Wait... you can HEAR me? Nobody hears me. I have been complaining for weeks!',
  'cz.v.frog2': 'The little wiggly bugs I eat used to be everywhere along the edge. Now the water is thick and green, like pea soup, and the bugs are hard to find.',
  'cz.v.frog3': 'My cousins hopped off to the puddles by the orchard. I am staying. I am stubborn. And, honestly, a little tired.',
  'cz.v.heron1': 'Shh. I am fishing. I have been fishing since sunrise. Patience is my whole personality.',
  'cz.v.heron2': 'But nothing comes up to the shallows anymore. And the water is so cloudy I could not see a fish if one swam right past my toes.',
  'cz.v.heron3': 'I might try the river down in the valley. Do not tell the pond. It will take it personally.',
  'cz.v.fishS1': 'Blub! Up here! Hiding! It is cold here, and the water tastes fizzy and fresh.',
  'cz.v.fishS2': 'Down in the pond, breathing got so hard. Like swimming uphill. With a rock on my head. We all swam up the stream to find cooler water.',
  'cz.v.fishS3': 'We will go home when the pond feels right again. You will know. We will know first, though.',
  'cz.v.fishP1': 'Blub blub! The pond tastes right again! You can actually breathe in here now. Thank you, big-eyed land fish!',
  'cz.v.robin1': 'Cheerily! Cheer-up! Oh, a visitor. Mind the eggs, please. They are very important eggs.',
  'cz.v.robin2': 'I used to snap up tons of insects over the pond. Now? Hardly any. So I fly all the way to the orchard for caterpillars. Exhausting.',
  'cz.v.deer1': 'Oh! You startled me. I startle easily. It is kind of my thing.',
  'cz.v.deer2': 'Want a tip? The grass right next to the farm ditch is the greenest, tallest grass anywhere. Grows like crazy. I do not ask questions. I just eat.',
  'cz.v.worms1': 'We eat dead stuff. Leaves, peels, old roots. You are welcome, by the way.',
  'cz.v.worms2': 'Here is a secret: when lots of things die all at once, tiny eaters show up by the billions. And every single one of them needs to breathe. It gets crowded down there.',
  'cz.v.bees1': 'Bzz! Busy, busy! Clover, aster, clover, goldenrod... so many flowers, so little time.',
  'cz.v.bees2': 'The corn field? Nothing there for me. Corn lets the wind carry its pollen. I need flowers, lots of different kinds, all summer long.',
  'cz.v.owl1': 'Hoo... it is the middle of the DAY. I am nocturnal. Come back at night and we can talk. Zzz.',
  'cz.vc.frog': 'Frog: the bugs it eats are hard to find, and the water turned thick and green.',
  'cz.vc.heron': 'Heron: no fish come up to the shallows, and the water is too cloudy to see into.',
  'cz.vc.fish': 'Fish: breathing in the pond got hard, so they swam up to the cold spring.',
  'cz.vc.robin': 'Robin: far fewer insects over the pond than before.',
  'cz.vc.deer': 'Deer: the grass beside the farm ditch grows extra tall and green.',
  'cz.vc.worms': 'Earthworms: when lots of things die, tiny decomposers show up, and they all need to breathe.',
  'cz.vc.bees': 'Bumblebee: needs many kinds of flowers; corn is pollinated by the wind.',
  'cz.j.voices': 'What the animals noticed', 'cz.j.voiceTip': 'Animals tell you what they experience in their own habitat. They do not always know the cause, so check their stories against your evidence.',
  'cz.j.log': 'My log', 'cz.logT': '🛸 My log', 'cz.listenTip': 'Your antennae are tingling... this animal has something to say. Press L (or the 👂 button) to listen.',
  'cz.log1': 'Day 1. I came to Earth to study its life. Then I discovered something strange: my antennae can pick up the voices of Earth\'s animals! The humans here cannot hear them. (Press L near an animal to listen.)',
  'cz.log2': 'The frog did not know words like "nutrient" or "oxygen." But it knew its food was disappearing. Each animal knows its own small piece of the story.',
  'cz.log3': 'I came to study life on Earth. But the frog, the heron and the fish knew something was wrong long before my tests showed it. To understand Earth, I first have to learn to listen to it.',
  'cz.t.sam': 'Ranger Sam',
  'cz.s.ama1': 'Oh! You must be the visiting scientist... from very far away, I am guessing. I am Dr. Ama Mensah, the reserve\'s field biologist. Welcome to Willow Creek!',
  'cz.s.ama2': 'Explore wherever you like. When something sparkles, walk up and press E to observe it. Everything you discover goes into your Field Journal (press J).',
  'cz.s.ama3': 'Missing fish? Let\'s investigate like scientists: gather evidence first, then explain. And watch the animals, too. Where they go and what they do is data. They often notice changes before we do, but they cannot tell us why.',
  'cz.s.pip1': 'Whoa, a real alien! Cool. I\'m Pip. I fish here every day, but I haven\'t caught a single fish in weeks. And the water used to be so clear...',
  'cz.s.pip2': 'My grandpa says this pond was clear as glass when he was a kid. It only started turning green the last couple of summers. Could you find out why? Dr. Ama at the research station might help.',
  'cz.s.lu1': 'Well, howdy! Never met anybody with antennae before. I\'m Lu. My family has farmed this land for three generations. I spread fertilizer so my corn grows big and fast.',
  'cz.s.lu2': 'Corn needs a lot of nitrogen, so folks spread extra to be safe, right before the spring rains. When it rains, some of it washes down this ditch into the stream. I never thought much about where it ends up...',
  'cz.s.sam1': 'Hi there! I\'m Ranger Sam. I take care of the trails and keep the lookouts safe, so please stay behind the fence.',
  'cz.s.sam2': 'My grandmother grew up in that valley. She said the river flooded every spring, and the wetlands soaked it up like a sponge. A lot of those wetlands were drained for farms and roads.',
  'cz.s.sam3': 'Everything up here flows down there eventually: the pond, the creek, even the rain on this trail. That\'s why I care so much about what goes into the water.',
});
Object.assign(C.I18N.es, {
  'cz.listen': 'Escuchar a', 'cz.listenKey': 'L: 👂 Escuchar', 'cz.listening': 'escuchando con tus antenas',
  'cz.an.frog': '🐸 Rana', 'cz.an.heron': '🪶 Garza azulada', 'cz.an.fish': '🐟 Pez sol', 'cz.an.robin': '🐦 Petirrojo', 'cz.an.deer': '🦌 Venado', 'cz.an.worms': '🪱 Lombrices', 'cz.an.bees': '🐝 Abejorro', 'cz.an.owl': '🦉 Búho',
  'cz.lt.frog': 'la rana', 'cz.lt.heron': 'la garza', 'cz.lt.fish': 'el pez', 'cz.lt.robin': 'el petirrojo', 'cz.lt.deer': 'el venado', 'cz.lt.worms': 'las lombrices', 'cz.lt.bees': 'el abejorro', 'cz.lt.owl': 'el búho',
  'cz.v.frog1': 'Croac. Un momento... ¿me OYES? Nadie me oye. ¡Llevo semanas quejándome!',
  'cz.v.frog2': 'Los bichitos que me como estaban por toda la orilla. Ahora el agua está espesa y verde, como sopa de chícharos, y casi no encuentro bichos.',
  'cz.v.frog3': 'Mis primas se fueron saltando a los charcos del huerto. Yo me quedo. Soy terca. Y, la verdad, estoy un poco cansada.',
  'cz.v.heron1': 'Shh. Estoy pescando. Llevo pescando desde que salió el sol. La paciencia es toda mi personalidad.',
  'cz.v.heron2': 'Pero ya no sube nada a la parte poco profunda. Y el agua está tan turbia que no vería un pez aunque me pasara entre los dedos.',
  'cz.v.heron3': 'Quizá pruebe en el río del valle. No se lo digas al estanque. Se lo tomaría muy a pecho.',
  'cz.v.fishS1': '¡Blub! ¡Aquí arriba! ¡Escondidos! Aquí el agua está fría y sabe fresquita y burbujeante.',
  'cz.v.fishS2': 'Allá abajo, en el estanque, respirar se volvió tan difícil. Como nadar cuesta arriba. Con una piedra en la cabeza. Todos subimos por el arroyo buscando agua más fría.',
  'cz.v.fishS3': 'Volveremos a casa cuando el estanque se sienta bien otra vez. Tú lo notarás. Pero nosotros lo notaremos primero.',
  'cz.v.fishP1': '¡Blub blub! ¡El estanque vuelve a saber bien! Por fin se puede respirar aquí. ¡Gracias, pez terrestre de ojos grandes!',
  'cz.v.robin1': '¡Pío, pío! ¡Ánimo! Ah, una visita. Cuidado con los huevos, por favor. Son huevos muy importantes.',
  'cz.v.robin2': 'Antes atrapaba montones de insectos sobre el estanque. ¿Ahora? Casi ninguno. Así que vuelo hasta el huerto a buscar orugas. Agotador.',
  'cz.v.deer1': '¡Ay! Me asustaste. Me asusto con facilidad. Es lo mío.',
  'cz.v.deer2': '¿Quieres un consejo? La hierba junto a la zanja de la granja es la más verde y alta de todas. Crece como loca. Yo no hago preguntas. Solo como.',
  'cz.v.worms1': 'Comemos cosas muertas. Hojas, cáscaras, raíces viejas. De nada, por cierto.',
  'cz.v.worms2': 'Te contamos un secreto: cuando muchas cosas mueren a la vez, aparecen miles de millones de comedores diminutos. Y todos necesitan respirar. Allá abajo se llena de gente.',
  'cz.v.bees1': '¡Bzz! ¡Qué ajetreo! Trébol, áster, trébol, vara de oro... tantas flores y tan poco tiempo.',
  'cz.v.bees2': '¿El maizal? Ahí no hay nada para mí. El maíz deja que el viento lleve su polen. Yo necesito flores, de muchos tipos, todo el verano.',
  'cz.v.owl1': 'Uuh... es pleno DÍA. Soy nocturno. Vuelve de noche y hablamos. Zzz.',
  'cz.vc.frog': 'Rana: casi no encuentra los bichos que come, y el agua se volvió espesa y verde.',
  'cz.vc.heron': 'Garza: ya no suben peces a la parte poco profunda, y el agua está demasiado turbia para ver.',
  'cz.vc.fish': 'Peces: respirar en el estanque se volvió difícil, así que subieron al manantial frío.',
  'cz.vc.robin': 'Petirrojo: hay muchos menos insectos sobre el estanque que antes.',
  'cz.vc.deer': 'Venado: la hierba junto a la zanja de la granja crece muy alta y verde.',
  'cz.vc.worms': 'Lombrices: cuando mueren muchas cosas, aparecen descomponedores diminutos, y todos necesitan respirar.',
  'cz.vc.bees': 'Abejorro: necesita muchos tipos de flores; el maíz se poliniza con el viento.',
  'cz.j.voices': 'Lo que notaron los animales', 'cz.j.voiceTip': 'Los animales te cuentan lo que viven en su propio hábitat. No siempre saben la causa, así que compara sus historias con tu evidencia.',
  'cz.j.log': 'Mi bitácora', 'cz.logT': '🛸 Mi bitácora', 'cz.listenTip': 'Te hormiguean las antenas... este animal tiene algo que decir. Pulsa L (o el botón 👂) para escuchar.',
  'cz.log1': 'Día 1. Vine a la Tierra a estudiar su vida. Y descubrí algo extraño: ¡mis antenas captan las voces de los animales de la Tierra! Los humanos de aquí no pueden oírlas. (Pulsa L cerca de un animal para escuchar.)',
  'cz.log2': 'La rana no conocía palabras como "nutriente" u "oxígeno". Pero sabía que su comida estaba desapareciendo. Cada animal conoce su propio pedacito de la historia.',
  'cz.log3': 'Vine a estudiar la vida de la Tierra. Pero la rana, la garza y los peces sabían que algo andaba mal mucho antes que mis pruebas. Para entender la Tierra, primero tengo que aprender a escucharla.',
  'cz.t.sam': 'con el guardabosques Sam',
  'cz.s.ama1': '¡Oh! Tú debes ser el científico visitante... de muy, muy lejos, supongo. Soy la Dra. Ama Mensah, la bióloga de campo de la reserva. ¡Bienvenido a Arroyo de los Sauces!',
  'cz.s.ama2': 'Explora donde quieras. Cuando algo brille, acércate y pulsa E para observarlo. Todo lo que descubras se guarda en tu diario de campo (pulsa J).',
  'cz.s.ama3': '¿Faltan peces? Investiguemos como científicos: primero reunimos evidencia y después explicamos. Y observa también a los animales. Adónde van y qué hacen también son datos. Muchas veces notan los cambios antes que nosotros, pero no pueden decirnos por qué.',
  'cz.s.pip1': '¡Guau, un extraterrestre de verdad! Qué genial. Soy Pip. Pesco aquí todos los días, pero hace semanas que no atrapo ni un pez. Y el agua antes era tan clara...',
  'cz.s.pip2': 'Mi abuelo dice que este estanque era transparente como el vidrio cuando él era niño. Empezó a ponerse verde hace solo un par de veranos. ¿Puedes averiguar por qué? La Dra. Ama, en la estación de investigación, quizá pueda ayudar.',
  'cz.s.lu1': '¡Hola, hola! Nunca había conocido a nadie con antenas. Soy Lu. Mi familia cultiva esta tierra desde hace tres generaciones. Echo fertilizante para que mi maíz crezca grande y rápido.',
  'cz.s.lu2': 'El maíz necesita mucho nitrógeno, así que la gente echa de más por si acaso, justo antes de las lluvias de primavera. Cuando llueve, una parte baja por esta zanja hasta el arroyo. Nunca pensé mucho en adónde va a parar...',
  'cz.s.sam1': '¡Hola! Soy Sam, guardabosques. Cuido los senderos y los miradores, así que, por favor, quédate detrás de la cerca.',
  'cz.s.sam2': 'Mi abuela creció en ese valle. Decía que el río se desbordaba cada primavera y que los humedales absorbían el agua como una esponja. Muchos de esos humedales se secaron para hacer granjas y carreteras.',
  'cz.s.sam3': 'Todo lo de aquí arriba termina bajando hasta allá: el estanque, el arroyo, hasta la lluvia de este sendero. Por eso me importa tanto lo que llega al agua.',
});
/* MAP AND HINTS */
Object.assign(C.I18N.en, {
  'cz.keys': 'Controls', 'cz.map': 'Map', 'cz.hint': 'Hint', 'cz.close': 'Close', 'cz.mapTitle': 'Map of Willow Creek Reserve', 'cz.mapHelp': 'Drag to move · wheel or + / − to zoom · click a mark to read about it · M or Esc to close',
  'cz.mapMe': 'Center on me', 'cz.mapLegend': 'Legend', 'cz.unexplored': 'Not explored yet',
  'cz.lg.you': 'You', 'cz.lg.find': 'Your discoveries', 'cz.lg.person': 'People', 'cz.lg.view': 'Lookouts', 'cz.lg.water': 'Water', 'cz.lg.forest': 'Forest', 'cz.lg.meadow': 'Meadow', 'cz.lg.farm': 'Farm', 'cz.lg.path': 'Trail', 'cz.lg.target': 'Hint target',
  'cz.ar.pond': 'Willow Pond', 'cz.ar.station': 'Research Station', 'cz.ar.farm': 'Lu\'s Farm', 'cz.ar.spring': 'Spring and Waterfall', 'cz.ar.hill': 'Hilltop Overlook', 'cz.ar.hollow': 'Hidden Hollow', 'cz.ar.orchard': 'Orchard', 'cz.ar.forest': 'Old Forest', 'cz.ar.meadow': 'Wildflower Meadow',
  'cz.ar.sea': 'Sea Cliffs', 'cz.ar.valley': 'Valley Lookout', 'cz.ar.canyon': 'Canyon Lookout', 'cz.ar.stream': 'Willow Creek', 'cz.ar.dock': 'Dock',
  'cz.hb.pond': 'the pond', 'cz.hb.stream': 'the creek', 'cz.hb.forest': 'the forest', 'cz.hb.farm': 'the farm', 'cz.hb.hill': 'the hilltop', 'cz.hb.orchard': 'the orchard', 'cz.hb.spring': 'the spring', 'cz.hb.lookout': 'the cliff edge', 'cz.hb.meadow': 'the meadow', 'cz.hb.hollow': 'the hollow',
  'cz.mi.habitat': 'Habitat', 'cz.mi.notYet': 'You have not recorded this yet.',
  'cz.dir.n': 'north', 'cz.dir.ne': 'north-east', 'cz.dir.e': 'east', 'cz.dir.se': 'south-east', 'cz.dir.s': 'south', 'cz.dir.sw': 'south-west', 'cz.dir.w': 'west', 'cz.dir.nw': 'north-west', 'cz.dir.here': 'right here',
  'cz.h.title': 'Hint', 'cz.h.more': 'Press Hint again for a bigger clue.', 'cz.h.last': 'That is the biggest clue. You can always explore somewhere else instead!',
  'cz.h.under': 'You are underwater. Let go of C and you float up. Hold Space to rise faster. Swim toward the shore and press Space to climb out.',
  'cz.h.lost': 'Feeling lost? Open the map (M). It shows where you have been, the trails, and everything you have discovered.',
  'cz.h.find1': 'Look around {hab} to the {dir}. Something there is worth a closer look.',
  'cz.h.find2': 'Head {dir} about {n} steps, toward {area}. Watch for a white sparkle.',
  'cz.h.find3': 'I marked it on your map and with a beam of light. Walk to the beam and press E.',
  'cz.h.voice1': 'An animal nearby seems to have something on its mind. Your antennae might pick it up.',
  'cz.h.voice2': 'Walk {dir} about {n} steps to {who}, then press L (or the 👂 button) to listen.',
  'cz.h.voice3': 'It is marked on your map and with a beam of light. Stand close and press L.',
  'cz.h.done': 'You have found everything in this part of the reserve! Try the lookouts at the edges, swim to the bottom of the pond, or fly from the hilltop.',
  'cz.h.m0a': 'Someone near the pond looks worried. People often notice when something has changed.', 'cz.h.m0b': 'Pip is standing on the trail just east of the pond. Look for a yellow glow above a person.', 'cz.h.m0c': 'Pip is marked on your map. Walk up to Pip and press E to talk.',
  'cz.h.m1a': 'Pip mentioned someone who could help. Scientists usually work at a research station.', 'cz.h.m1b': 'The research station is the cabin with the red roof, near the middle of the reserve.', 'cz.h.m1c': 'Dr. Ama is marked on your map, next to the microscope table. Walk up and press E.',
  'cz.h.m2a': 'A good scientist collects more than one kind of evidence. Which item on your checklist is still empty?', 'cz.h.m2b': 'Your checklist (top left) says where each piece of evidence is. The next one is: {item}', 'cz.h.m2c': 'The next piece of evidence is marked on your map and with a beam of light.',
  'cz.h.m3a': 'You have enough evidence. What could connect fertilizer, green water and low oxygen?', 'cz.h.m3b': 'Go back to Dr. Ama at the research station and tell her your explanation.', 'cz.h.m3c': 'Dr. Ama is marked on your map. Choose the explanation that uses ALL your evidence.',
  'cz.h.m4a': 'Plants along a stream can catch runoff before it reaches the pond. Where could new plants help?', 'cz.h.m4b': 'Follow the creek uphill from the pond. Glowing green spots show where to plant.', 'cz.h.m4c': 'The next planting spot is marked on your map and with a beam of light. Stand on it and press E.',
});
Object.assign(C.I18N.es, {
  'cz.keys': 'Controles', 'cz.map': 'Mapa', 'cz.hint': 'Pista', 'cz.close': 'Cerrar', 'cz.mapTitle': 'Mapa de la Reserva Arroyo de los Sauces', 'cz.mapHelp': 'Arrastra para mover · rueda o + / − para el zoom · haz clic en una marca para leer sobre ella · M o Esc para cerrar',
  'cz.mapMe': 'Centrar en mí', 'cz.mapLegend': 'Leyenda', 'cz.unexplored': 'Sin explorar',
  'cz.lg.you': 'Tú', 'cz.lg.find': 'Tus descubrimientos', 'cz.lg.person': 'Personas', 'cz.lg.view': 'Miradores', 'cz.lg.water': 'Agua', 'cz.lg.forest': 'Bosque', 'cz.lg.meadow': 'Pradera', 'cz.lg.farm': 'Granja', 'cz.lg.path': 'Sendero', 'cz.lg.target': 'Objetivo de la pista',
  'cz.ar.pond': 'Estanque de los Sauces', 'cz.ar.station': 'Estación de investigación', 'cz.ar.farm': 'Granja de Lu', 'cz.ar.spring': 'Manantial y cascada', 'cz.ar.hill': 'Mirador de la colina', 'cz.ar.hollow': 'Hondonada escondida', 'cz.ar.orchard': 'Huerto', 'cz.ar.forest': 'Bosque viejo', 'cz.ar.meadow': 'Pradera de flores',
  'cz.ar.sea': 'Acantilados del mar', 'cz.ar.valley': 'Mirador del valle', 'cz.ar.canyon': 'Mirador del cañón', 'cz.ar.stream': 'Arroyo de los Sauces', 'cz.ar.dock': 'Muelle',
  'cz.hb.pond': 'el estanque', 'cz.hb.stream': 'el arroyo', 'cz.hb.forest': 'el bosque', 'cz.hb.farm': 'la granja', 'cz.hb.hill': 'la colina', 'cz.hb.orchard': 'el huerto', 'cz.hb.spring': 'el manantial', 'cz.hb.lookout': 'el borde del acantilado', 'cz.hb.meadow': 'la pradera', 'cz.hb.hollow': 'la hondonada',
  'cz.mi.habitat': 'Hábitat', 'cz.mi.notYet': 'Todavía no lo has registrado.',
  'cz.dir.n': 'norte', 'cz.dir.ne': 'noreste', 'cz.dir.e': 'este', 'cz.dir.se': 'sureste', 'cz.dir.s': 'sur', 'cz.dir.sw': 'suroeste', 'cz.dir.w': 'oeste', 'cz.dir.nw': 'noroeste', 'cz.dir.here': 'aquí mismo',
  'cz.h.title': 'Pista', 'cz.h.more': 'Pulsa Pista otra vez para una pista más clara.', 'cz.h.last': 'Esa es la pista más clara. ¡También puedes explorar otro lugar!',
  'cz.h.under': 'Estás bajo el agua. Suelta C y subirás flotando. Mantén Espacio para subir más rápido. Nada hacia la orilla y pulsa Espacio para salir.',
  'cz.h.lost': '¿Te sientes perdido? Abre el mapa (M). Muestra dónde has estado, los senderos y todo lo que has descubierto.',
  'cz.h.find1': 'Mira alrededor de {hab}, hacia el {dir}. Ahí hay algo que vale la pena observar de cerca.',
  'cz.h.find2': 'Ve hacia el {dir} unos {n} pasos, hacia {area}. Busca un destello blanco.',
  'cz.h.find3': 'Lo marqué en tu mapa y con un rayo de luz. Camina hasta el rayo y pulsa E.',
  'cz.h.voice1': 'Un animal cercano parece tener algo en mente. Tus antenas podrían captarlo.',
  'cz.h.voice2': 'Camina hacia el {dir} unos {n} pasos hasta {who} y pulsa L (o el botón 👂) para escuchar.',
  'cz.h.voice3': 'Está marcado en tu mapa y con un rayo de luz. Acércate y pulsa L.',
  'cz.h.done': '¡Encontraste todo en esta parte de la reserva! Prueba los miradores de los bordes, nada hasta el fondo del estanque o vuela desde la colina.',
  'cz.h.m0a': 'Alguien junto al estanque parece preocupado. La gente suele notar cuando algo ha cambiado.', 'cz.h.m0b': 'Pip está en el sendero, justo al este del estanque. Busca un brillo amarillo sobre una persona.', 'cz.h.m0c': 'Pip está marcado en tu mapa. Acércate y pulsa E para hablar.',
  'cz.h.m1a': 'Pip mencionó a alguien que podría ayudar. Los científicos suelen trabajar en una estación de investigación.', 'cz.h.m1b': 'La estación de investigación es la cabaña de techo rojo, cerca del centro de la reserva.', 'cz.h.m1c': 'La Dra. Ama está marcada en tu mapa, junto a la mesa del microscopio. Acércate y pulsa E.',
  'cz.h.m2a': 'Un buen científico reúne más de un tipo de evidencia. ¿Qué parte de tu lista sigue vacía?', 'cz.h.m2b': 'Tu lista (arriba a la izquierda) dice dónde está cada evidencia. La siguiente es: {item}', 'cz.h.m2c': 'La siguiente evidencia está marcada en tu mapa y con un rayo de luz.',
  'cz.h.m3a': 'Ya tienes suficiente evidencia. ¿Qué podría unir el fertilizante, el agua verde y el poco oxígeno?', 'cz.h.m3b': 'Vuelve con la Dra. Ama a la estación de investigación y cuéntale tu explicación.', 'cz.h.m3c': 'La Dra. Ama está marcada en tu mapa. Elige la explicación que usa TODA tu evidencia.',
  'cz.h.m4a': 'Las plantas junto a un arroyo pueden atrapar el agua de escorrentía antes de que llegue al estanque. ¿Dónde podrían ayudar plantas nuevas?', 'cz.h.m4b': 'Sigue el arroyo cuesta arriba desde el estanque. Los puntos verdes brillantes muestran dónde plantar.', 'cz.h.m4c': 'El siguiente punto para plantar está marcado en tu mapa y con un rayo de luz. Párate encima y pulsa E.',
});
/* DAY, NIGHT AND THE CAMPFIRE */
Object.assign(C.I18N.en, {
  'cz.tod.dawn': 'Dawn', 'cz.tod.morning': 'Morning', 'cz.tod.noon': 'Midday', 'cz.tod.afternoon': 'Afternoon', 'cz.tod.golden': 'Golden hour', 'cz.tod.sunset': 'Sunset', 'cz.tod.twilight': 'Twilight', 'cz.tod.night': 'Night',
  'cz.t.fire': 'the campfire', 'cz.light': 'Light', 'cz.sit': 'Sit by', 'cz.ar.camp': 'Ranger campsite',
  'cz.rest.title': '🔥 Resting by the campfire', 'cz.rest.text': 'The fire crackles. Watch the sky change and listen to the reserve. Time passes quickly while you rest.',
  'cz.rest.sunset': 'Rest until sunset', 'cz.rest.night': 'Rest until night', 'cz.rest.morning': 'Rest until morning', 'cz.rest.sit': 'Just sit for a while', 'cz.rest.up': 'Stand up', 'cz.rest.journal': 'Read my journal',
  'cz.s.fireLit': 'You lit the campfire. Fire turns the chemical energy stored in wood into heat and light. (The wood\'s energy first came from the Sun, captured by the tree in photosynthesis.)',
  'cz.t.fireflies': 'the blinking lights', 'cz.t.lunamoth': 'the big green moth',
  'cz.n.fireflies': 'Fireflies', 'cz.n.lunamoth': 'Luna moth',
  'cz.d.fireflies': 'Fireflies are beetles that make their own light! A chemical reaction in their bodies gives off light with almost no heat. This is BIOLUMINESCENCE. Each kind of firefly blinks its own pattern to find a mate. You only see them after dark.',
  'cz.d.lunamoth': 'A luna moth, drawn to the porch light. Adult luna moths have no mouths and live only about a week, just long enough to mate and lay eggs. Bright lights at night can confuse moths and pull them away from their habitat.',
  'cz.v.owlN1': 'Hoo! Night shift! Now we can talk. I see everything in the dark. Big eyes, quiet wings.',
  'cz.v.owlN2': 'The mice by the farm used to hide in the hedgerows. Fewer hedges now, so fewer mice there... and fewer hiding places for everyone.',
  'cz.vc.owl': 'Owl: fewer hedgerows by the farm means fewer mice and fewer places to hide.',
  'cz.nightTip': 'Night is falling. Some animals are just waking up! Look for blinking lights in the meadow, and listen for the owl.',
});
Object.assign(C.I18N.es, {
  'cz.tod.dawn': 'Amanecer', 'cz.tod.morning': 'Mañana', 'cz.tod.noon': 'Mediodía', 'cz.tod.afternoon': 'Tarde', 'cz.tod.golden': 'Hora dorada', 'cz.tod.sunset': 'Atardecer', 'cz.tod.twilight': 'Crepúsculo', 'cz.tod.night': 'Noche',
  'cz.t.fire': 'la fogata', 'cz.light': 'Encender', 'cz.sit': 'Sentarte junto a', 'cz.ar.camp': 'Campamento del guardabosques',
  'cz.rest.title': '🔥 Descansando junto a la fogata', 'cz.rest.text': 'El fuego chisporrotea. Mira cómo cambia el cielo y escucha la reserva. El tiempo pasa rápido mientras descansas.',
  'cz.rest.sunset': 'Descansar hasta el atardecer', 'cz.rest.night': 'Descansar hasta la noche', 'cz.rest.morning': 'Descansar hasta la mañana', 'cz.rest.sit': 'Solo sentarme un rato', 'cz.rest.up': 'Levantarme', 'cz.rest.journal': 'Leer mi diario',
  'cz.s.fireLit': 'Encendiste la fogata. El fuego convierte la energía química guardada en la madera en calor y luz. (La energía de la madera vino primero del Sol, capturada por el árbol en la fotosíntesis.)',
  'cz.t.fireflies': 'las lucecitas que parpadean', 'cz.t.lunamoth': 'la gran polilla verde',
  'cz.n.fireflies': 'Luciérnagas', 'cz.n.lunamoth': 'Polilla luna',
  'cz.d.fireflies': '¡Las luciérnagas son escarabajos que producen su propia luz! Una reacción química en su cuerpo da luz casi sin calor. Esto es BIOLUMINISCENCIA. Cada tipo de luciérnaga parpadea con su propio patrón para encontrar pareja. Solo se ven cuando oscurece.',
  'cz.d.lunamoth': 'Una polilla luna, atraída por la luz del porche. Las polillas luna adultas no tienen boca y viven solo una semana, lo justo para aparearse y poner huevos. Las luces brillantes de noche pueden confundir a las polillas y alejarlas de su hábitat.',
  'cz.v.owlN1': '¡Uuh! ¡Turno de noche! Ahora sí podemos hablar. Veo todo en la oscuridad. Ojos grandes, alas silenciosas.',
  'cz.v.owlN2': 'Los ratones de la granja se escondían en los setos. Ahora hay menos setos, así que hay menos ratones ahí... y menos escondites para todos.',
  'cz.vc.owl': 'Búho: menos setos junto a la granja significa menos ratones y menos lugares para esconderse.',
  'cz.nightTip': 'Está cayendo la noche. ¡Algunos animales apenas se están despertando! Busca lucecitas que parpadean en la pradera y escucha al búho.',
});
/* WILDLIFE SURVEYS */
Object.assign(C.I18N.en, {
  'cz.sv': 'Survey', 'cz.svStart': 'Start a survey at', 'cz.svPost': 'the survey post',
  'cz.sv.tally': 'Tally +1 (Space)', 'cz.sv.count': 'Your count', 'cz.sv.time': 'Time left', 'cz.sv.go': 'Start (30 seconds)', 'cz.sv.done': 'Record in my journal', 'cz.sv.cancel': 'Stop survey', 'cz.sv.again': 'Survey again later to compare.',
  'cz.sv.pollT': 'Pollinator count', 'cz.sv.pollI': 'Watch the flowers near the post. Every time a bee or butterfly lands on a flower, press Space (or Tally). Count each visit once.',
  'cz.sv.frogT': 'Frog count', 'cz.sv.frogI': 'Watch and listen at the pond edge. Every time a frog pops up or calls, press Space (or Tally). Count each frog you notice once.',
  'cz.sv.poll.meadow': 'Wildflower meadow', 'cz.sv.poll.farm': 'Corn field edge', 'cz.sv.frog.day': 'Pond edge in daytime', 'cz.sv.frog.night': 'Pond edge at night',
  'cz.sv.res': 'You counted {n}. Visits you could have seen: {m}.',
  'cz.sv.resPerfect': 'Sharp eyes! You noticed every one.',
  'cz.sv.resMiss': 'Missing a few is normal: animals hide, move fast, or show up while you are looking elsewhere. Scientists call this DETECTABILITY. A count is a sample, not the whole population.',
  'cz.sv.poll.meadowR': 'Lots of flower visits. Many kinds of flowers bloom here at different times, so pollinators find food all season.',
  'cz.sv.poll.farmR': 'Very few visits. A corn field is one kind of plant, and corn is pollinated by the wind, so bees and butterflies find little food here.',
  'cz.sv.frog.dayR': 'Few frogs by day. Most were hiding under leaves and mud, staying cool and safe from herons.',
  'cz.sv.frog.nightR': 'Many more frogs at night! Did more frogs move in? Probably not: the same frogs were here all along. At night they come out and call, so they are easier to DETECT. Survey time changes what you count.',
  'cz.sv.compare': 'Compare your surveys in the journal: what changed between the two sites (or times)? What else could explain the difference?',
  'cz.sv.kickT': 'Stream bug sample', 'cz.sv.kickI': 'You swept a net through the streambed. Sort each animal: does it NEED clean, oxygen-rich water, or can it TOLERATE pollution? Use the field guide below.',
  'cz.sv.kick.up': 'Upstream, near the spring', 'cz.sv.kick.down': 'Downstream, beside the farm',
  'cz.sv.need': 'Needs clean water', 'cz.sv.tol': 'Tolerates pollution', 'cz.sv.guide': 'Field guide: mayflies, stoneflies, caddisflies and water pennies need clean water with plenty of oxygen. Midge larvae, aquatic worms, leeches and pouch snails can live where oxygen is low.',
  'cz.sv.right': '✓', 'cz.sv.wrong': '✗ Check the field guide.',
  'cz.sv.kickRes': '{s} of {t} animals need clean water. Water quality here looks {q}.', 'cz.sv.q.good': 'GOOD', 'cz.sv.q.fair': 'FAIR', 'cz.sv.q.poor': 'POOR',
  'cz.sv.kick.upR': 'Shady, cold, fast water with lots of oxygen: the sensitive insects thrive here. Water insects are BIOLOGICAL INDICATORS: they tell you about the water over weeks, not just today.',
  'cz.sv.kick.downR': 'Mostly tolerant animals. Something here is stressing the stream. Clear-looking water is not always healthy water: use more than one indicator.',
  'cz.bug.mayfly': 'Mayfly nymph', 'cz.bug.stonefly': 'Stonefly nymph', 'cz.bug.caddis': 'Caddisfly larva', 'cz.bug.penny': 'Water penny', 'cz.bug.midge': 'Midge larva', 'cz.bug.worm': 'Aquatic worm', 'cz.bug.leech': 'Leech', 'cz.bug.snail': 'Pouch snail',
  'cz.bugd.mayfly': '3 tails, gills along its sides', 'cz.bugd.stonefly': '2 tails, no gills on its belly', 'cz.bugd.caddis': 'lives in a case of tiny pebbles', 'cz.bugd.penny': 'flat, round, stuck to rocks', 'cz.bugd.midge': 'tiny red wiggly worm', 'cz.bugd.worm': 'long, thin, many segments', 'cz.bugd.leech': 'flat, stretchy, suckers at both ends', 'cz.bugd.snail': 'shell opens on the left',
  'cz.j.surveys': 'Surveys', 'cz.j.svTip': 'Observations are what you counted. Interpretations are what you think it means. Compare sites and times before deciding.',
  'cz.j.sv.at': 'at', 'cz.j.sv.counted': 'counted',
  'a.cz-survey': 'Field Surveyor', 'a.cz-survey.d': 'Complete 3 wildlife surveys in the reserve.'
});
Object.assign(C.I18N.es, {
  'cz.sv': 'Muestreo', 'cz.svStart': 'Empezar un muestreo en', 'cz.svPost': 'el poste de muestreo',
  'cz.sv.tally': 'Contar +1 (Espacio)', 'cz.sv.count': 'Tu conteo', 'cz.sv.time': 'Tiempo', 'cz.sv.go': 'Empezar (30 segundos)', 'cz.sv.done': 'Anotar en mi diario', 'cz.sv.cancel': 'Detener', 'cz.sv.again': 'Repite el muestreo más tarde para comparar.',
  'cz.sv.pollT': 'Conteo de polinizadores', 'cz.sv.pollI': 'Observa las flores cerca del poste. Cada vez que una abeja o mariposa se posa en una flor, pulsa Espacio (o Contar). Cuenta cada visita una vez.',
  'cz.sv.frogT': 'Conteo de ranas', 'cz.sv.frogI': 'Mira y escucha en la orilla del estanque. Cada vez que una rana se asoma o canta, pulsa Espacio (o Contar). Cuenta una vez cada rana que notes.',
  'cz.sv.poll.meadow': 'Pradera de flores', 'cz.sv.poll.farm': 'Borde del maizal', 'cz.sv.frog.day': 'Orilla del estanque de día', 'cz.sv.frog.night': 'Orilla del estanque de noche',
  'cz.sv.res': 'Contaste {n}. Visitas que podías ver: {m}.',
  'cz.sv.resPerfect': '¡Qué buena vista! Las notaste todas.',
  'cz.sv.resMiss': 'Es normal que se te escapen algunas: los animales se esconden, se mueven rápido o aparecen cuando miras a otro lado. Los científicos llaman a esto DETECTABILIDAD. Un conteo es una muestra, no toda la población.',
  'cz.sv.poll.meadowR': 'Muchas visitas a las flores. Aquí florecen muchos tipos de flores en distintos momentos, así que los polinizadores encuentran comida toda la temporada.',
  'cz.sv.poll.farmR': 'Muy pocas visitas. Un maizal es un solo tipo de planta, y el maíz se poliniza con el viento, así que las abejas y mariposas encuentran poca comida aquí.',
  'cz.sv.frog.dayR': 'Pocas ranas de día. La mayoría estaba escondida bajo hojas y barro, fresca y a salvo de las garzas.',
  'cz.sv.frog.nightR': '¡Muchas más ranas de noche! ¿Llegaron más ranas? Probablemente no: eran las mismas ranas todo el tiempo. De noche salen y cantan, así que son más fáciles de DETECTAR. La hora del muestreo cambia lo que cuentas.',
  'cz.sv.compare': 'Compara tus muestreos en el diario: ¿qué cambió entre los dos sitios (u horas)? ¿Qué otra cosa podría explicar la diferencia?',
  'cz.sv.kickT': 'Muestra de bichos del arroyo', 'cz.sv.kickI': 'Pasaste una red por el fondo del arroyo. Clasifica cada animal: ¿NECESITA agua limpia con mucho oxígeno o puede TOLERAR la contaminación? Usa la guía de campo de abajo.',
  'cz.sv.kick.up': 'Río arriba, cerca del manantial', 'cz.sv.kick.down': 'Río abajo, junto a la granja',
  'cz.sv.need': 'Necesita agua limpia', 'cz.sv.tol': 'Tolera la contaminación', 'cz.sv.guide': 'Guía de campo: las efímeras, las moscas de las piedras, los tricópteros y los "centavos de agua" necesitan agua limpia con mucho oxígeno. Las larvas de mosquito, los gusanos acuáticos, las sanguijuelas y los caracoles de concha izquierda pueden vivir donde hay poco oxígeno.',
  'cz.sv.right': '✓', 'cz.sv.wrong': '✗ Revisa la guía de campo.',
  'cz.sv.kickRes': '{s} de {t} animales necesitan agua limpia. La calidad del agua aquí parece {q}.', 'cz.sv.q.good': 'BUENA', 'cz.sv.q.fair': 'REGULAR', 'cz.sv.q.poor': 'MALA',
  'cz.sv.kick.upR': 'Agua fría, rápida y con sombra, con mucho oxígeno: los insectos sensibles prosperan aquí. Los insectos acuáticos son INDICADORES BIOLÓGICOS: cuentan cómo ha estado el agua durante semanas, no solo hoy.',
  'cz.sv.kick.downR': 'Casi todos son animales tolerantes. Algo aquí está estresando el arroyo. El agua que se ve clara no siempre es agua sana: usa más de un indicador.',
  'cz.bug.mayfly': 'Ninfa de efímera', 'cz.bug.stonefly': 'Ninfa de mosca de las piedras', 'cz.bug.caddis': 'Larva de tricóptero', 'cz.bug.penny': 'Centavo de agua', 'cz.bug.midge': 'Larva de mosquito', 'cz.bug.worm': 'Gusano acuático', 'cz.bug.leech': 'Sanguijuela', 'cz.bug.snail': 'Caracol de concha izquierda',
  'cz.bugd.mayfly': '3 colas, branquias a los lados', 'cz.bugd.stonefly': '2 colas, sin branquias en la panza', 'cz.bugd.caddis': 'vive en un estuche de piedritas', 'cz.bugd.penny': 'plano, redondo, pegado a las rocas', 'cz.bugd.midge': 'gusanito rojo que se retuerce', 'cz.bugd.worm': 'largo, delgado, muchos segmentos', 'cz.bugd.leech': 'plano, elástico, ventosas en los extremos', 'cz.bugd.snail': 'la concha abre hacia la izquierda',
  'cz.j.surveys': 'Muestreos', 'cz.j.svTip': 'Las observaciones son lo que contaste. Las interpretaciones son lo que crees que significa. Compara sitios y horas antes de decidir.',
  'cz.j.sv.at': 'en', 'cz.j.sv.counted': 'contado',
  'a.cz-survey': 'Muestreador de campo', 'a.cz-survey.d': 'Completa 3 muestreos de vida silvestre en la reserva.'
});
C.ACH.push({ id: 'cz-survey', ic: '📋', tier: 'medium' });
Object.assign(C.I18N.en, {
  'cz.sc.title': 'Looking through the viewer', 'cz.sc.spot': 'Things to spot', 'cz.sc.help': 'Look around: arrow keys, WASD or drag · Zoom: + / − or mouse wheel · Hold the center ring on something to study it',
  'cz.sc.done': 'Done (E)', 'cz.sc.zin': 'Zoom in', 'cz.sc.zout': 'Zoom out', 'cz.sc.all': 'You spotted everything from this lookout!', 'cz.sc.got': 'Spotted', 'cz.sc.left': '{n} left to find',
  'cz.sc.sea.gulls': 'Gulls over the water', 'cz.sc.sea.island': 'An island with trees', 'cz.sc.sea.cliff': 'Stripes in the cliff below',
  'cz.sc.sea.gullsD': 'Herring gulls eat fish, crabs and scraps. They carry nutrients from the sea to the land in their droppings: the sea and land food webs are connected.',
  'cz.sc.sea.islandD': 'How did trees get onto an island? Seeds arrive by wind, on waves, and in bird droppings. Living things spread to new places slowly, one arrival at a time.',
  'cz.sc.sea.cliffD': 'Each stripe in the cliff is a layer of sediment laid down at a different time. The oldest layers are at the bottom.',
  'cz.sc.valley.town': 'The town', 'cz.sc.valley.farm': 'A red barn and farm fields', 'cz.sc.valley.wetland': 'The wetland pools',
  'cz.sc.valley.townD': 'Rain runs off roofs, roads and lawns. Whatever is on them, like oil, salt or fertilizer, can wash into the river. This is called RUNOFF.',
  'cz.sc.valley.farmD': 'Fertilizer helps crops grow. But when it rains, extra nitrogen and phosphorus can wash into streams, just like at Lu\'s farm by the pond.',
  'cz.sc.valley.wetlandD': 'Wetland plants and mud slow the water down and trap mud and nutrients. A wetland works like a natural water filter, and it is a nursery for frogs, fish and birds.',
  'cz.sc.canyon.river': 'The river at the bottom', 'cz.sc.canyon.mesa': 'A flat-topped mesa', 'cz.sc.canyon.wall': 'Striped canyon walls',
  'cz.sc.canyon.riverD': 'This river carved the whole canyon, grain by grain, over a very long time. Moving water wearing rock away is called EROSION.',
  'cz.sc.canyon.mesaD': 'A mesa is a hill with a flat top. Its top layer of rock is harder, so it wore away more slowly than the rock around it.',
  'cz.sc.canyon.wallD': 'Each band in the walls is a different kind of rock, with its own color and hardness. Softer bands wear away faster.'
});
Object.assign(C.I18N.es, {
  'cz.sc.title': 'Mirando por el visor', 'cz.sc.spot': 'Cosas para encontrar', 'cz.sc.help': 'Mira a tu alrededor: flechas, WASD o arrastra · Zoom: + / − o la rueda del ratón · Mantén el círculo del centro sobre algo para estudiarlo',
  'cz.sc.done': 'Listo (E)', 'cz.sc.zin': 'Acercar', 'cz.sc.zout': 'Alejar', 'cz.sc.all': '¡Encontraste todo desde este mirador!', 'cz.sc.got': 'Encontrado', 'cz.sc.left': 'Faltan {n}',
  'cz.sc.sea.gulls': 'Gaviotas sobre el agua', 'cz.sc.sea.island': 'Una isla con árboles', 'cz.sc.sea.cliff': 'Franjas en el acantilado',
  'cz.sc.sea.gullsD': 'Las gaviotas comen peces, cangrejos y restos. Con sus excrementos llevan nutrientes del mar a la tierra: las redes alimentarias del mar y de la tierra están conectadas.',
  'cz.sc.sea.islandD': '¿Cómo llegaron árboles a una isla? Las semillas llegan con el viento, con las olas y en los excrementos de las aves. Los seres vivos se extienden a lugares nuevos poco a poco.',
  'cz.sc.sea.cliffD': 'Cada franja del acantilado es una capa de sedimento depositada en un momento distinto. Las capas más antiguas están abajo.',
  'cz.sc.valley.town': 'El pueblo', 'cz.sc.valley.farm': 'Un granero rojo y campos de cultivo', 'cz.sc.valley.wetland': 'Las charcas del humedal',
  'cz.sc.valley.townD': 'La lluvia corre por techos, calles y jardines. Lo que haya en ellos, como aceite, sal o fertilizante, puede llegar al río. Esto se llama ESCORRENTÍA.',
  'cz.sc.valley.farmD': 'El fertilizante ayuda a crecer a los cultivos. Pero cuando llueve, el nitrógeno y el fósforo que sobran pueden llegar a los arroyos, igual que en la granja de Lu junto al estanque.',
  'cz.sc.valley.wetlandD': 'Las plantas y el barro del humedal frenan el agua y atrapan barro y nutrientes. Un humedal funciona como un filtro natural, y es una guardería para ranas, peces y aves.',
  'cz.sc.canyon.river': 'El río del fondo', 'cz.sc.canyon.mesa': 'Una meseta de cima plana', 'cz.sc.canyon.wall': 'Paredes del cañón a franjas',
  'cz.sc.canyon.riverD': 'Este río excavó todo el cañón, grano a grano, durante muchísimo tiempo. El agua que desgasta la roca se llama EROSIÓN.',
  'cz.sc.canyon.mesaD': 'Una meseta es un cerro de cima plana. Su capa de roca de arriba es más dura, así que se desgastó más despacio que la roca de alrededor.',
  'cz.sc.canyon.wallD': 'Cada franja de las paredes es un tipo de roca distinto, con su propio color y dureza. Las franjas más blandas se desgastan más rápido.'
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
  { id: 'deer', look: 'critter', col: '#b07a4a' }, { id: 'worms', look: 'chain', col: '#e08a8a' },
  { id: 'whitepine', look: 'sprout', col: '#2f6a3a' }, { id: 'hemlock', look: 'sprout', col: '#2a5a46' }, { id: 'redmaple', look: 'sprout', col: '#c4462c' }, { id: 'sycamore', look: 'sprout', col: '#7ab04a' },
  { id: 'willow', look: 'grass', col: '#8aba5a' }, { id: 'dogwood', look: 'sprout', col: '#fff0f4' }, { id: 'hickory', look: 'sprout', col: '#e0b03a' },
  { id: 'seaview', look: 'drop', col: '#2a9ab0' }, { id: 'valleyview', look: 'grass', col: '#c8b858' }, { id: 'canyonview', look: 'rock', col: '#c8805a' },
  { id: 'fireflies', look: 'sun', col: '#d8ff7a' }, { id: 'lunamoth', look: 'sprout', col: '#9ae08a' },
  { id: 'pondweed', look: 'grass', col: '#3a9a5a' }, { id: 'mussel', look: 'rock', col: '#4a4a6a' }, { id: 'tadpole', look: 'frog', col: '#4a5a3a' }];

/* ---------- WORLD SHAPE ---------- */
const POND = { x: -20, z: 22 }, HILL = { x: 42, z: -42 }, FARM = { x: -52, z: -40 }, HOLLOW = { x: 56, z: 40 }, STATION = { x: 6, z: -6 }, STREAM = [[-28, -60], [-36, -46], [-44, -30], [-36, -12], [-30, 4], [-26, 12]];
const SPRING = { x: -28, z: -60 }, ORCH = { x: -40, z: 46 }, EDGE = 62, BOUND = 70;
const PATHS = [[[6, -6], [-8, 8], [-12, 16]], [[6, -6], [-18, -20], [-40, -30]], [[6, -6], [24, -24], [34, -34]], [[-8, 8], [-24, 40], [-34, 44]], [[6, -6], [16, 12], [8, 34]], [[-40, -30], [-32, -52]], [[16, 12], [26, 24]]];
function pathDist(x, z) { let d = 1e9; PATHS.forEach(function (pl) { for (let i = 0; i < pl.length - 1; i++) d = Math.min(d, segDist(x, z, pl[i], pl[i + 1])); }); return d; }
function segDist(x, z, a, b) { const vx = b[0] - a[0], vz = b[1] - a[1], wx = x - a[0], wz = z - a[1], u = Math.max(0, Math.min(1, (wx * vx + wz * vz) / (vx * vx + vz * vz))); return Math.hypot(x - a[0] - u * vx, z - a[1] - u * vz); }
/* creeks are smooth curves: a few control points become a dense, gently bending line */
function smoothLine(pts, n) { return new T.CatmullRomCurve3(pts.map(function (p) { return new T.Vector3(p[0], 0, p[1]); }), false, 'centripetal').getSpacedPoints(n).map(function (v) { return [v.x, v.z]; }); }
/* THE EDGES OF THE RESERVE: three scenic drop-offs (sea cliffs, a farm valley, a river canyon); the rest are wooded hills */
const EDGES = [{ id: 'sea', a0: -28, a1: 22 }, { id: 'valley', a0: 55, a1: 122 }, { id: 'canyon', a0: 150, a1: 205 }];
const SEA_Y = -22, VALLEY_Y = -19, CANYON_Y = -15;
function edgeW(x, z, id) { let a = Math.atan2(z, x) * 180 / Math.PI, best = 0, which = null;
  EDGES.forEach(function (e) { if (id && e.id !== id) return; let b = a; const mid = (e.a0 + e.a1) / 2; while (b < mid - 180) b += 360; while (b > mid + 180) b -= 360; const w = Math.max(0, Math.min(1, (Math.min(b - e.a0, e.a1 - b) + 6) / 12)); if (w > best) { best = w; which = e.id; } });
  return id ? best : { w: best, id: which }; }
const OUTLET = [[-14, 34], [-12, 44], [-8, 53], [-4, 61], [-2.5, 66.2]];
const RIVER = [[-2, 73], [6, 92], [-6, 116], [10, 140], [40, 160], [70, 190], [90, 240]];
const CANYONR = [[-104, -46], [-112, -12], [-106, 22], [-114, 60]];
const CREEKS = [{ id: 'stream', pts: smoothLine(STREAM, 90), w0: 1.5, w1: 2.6 }, { id: 'outlet', pts: smoothLine(OUTLET, 40), w0: 2.2, w1: 1.8 },
  { id: 'river', pts: smoothLine(RIVER, 90), w0: 3, w1: 7, far: true }, { id: 'canyon', pts: smoothLine(CANYONR, 80), w0: 5, w1: 6, far: true }];
function farRiverDist(x, z) { let d = 1e9; CREEKS.forEach(function (c) { if (!c.far) return; const P = c.pts; for (let i = 0; i < P.length - 1; i++) { const a = P[i]; if (Math.abs(a[0] - x) > 30 || Math.abs(a[1] - z) > 30) continue; d = Math.min(d, segDist(x, z, a, P[i + 1])); } }); return d; }
function streamDist(x, z) { let d = 1e9; CREEKS.forEach(function (c) { if (c.far) return; const P = c.pts; for (let i = 0; i < P.length - 1; i++) { const a = P[i]; if (Math.abs(a[0] - x) > 12 || Math.abs(a[1] - z) > 12) continue; d = Math.min(d, segDist(x, z, a, P[i + 1])); } }); return d; }
function H(x, z) {
  let h = 1.4 * Math.sin(x * 0.05) * Math.cos(z * 0.045) + 1.0 * Math.sin((x - z) * 0.032) + 0.5 * Math.sin(x * 0.13 + 1) * Math.sin(z * 0.11);
  h += 13 * Math.exp(-((x - HILL.x) ** 2 + (z - HILL.z) ** 2) / 520);
  h -= 8.5 * Math.exp(-((x - POND.x) ** 2 + (z - POND.z) ** 2) / 170);
  const blend = function (cx, cz, r, fall, lvl) { const d = Math.hypot(x - cx, z - cz); if (d < r) h = lvl; else if (d < r + fall) { const u = (d - r) / fall; h = lvl * (1 - u) + h * u; } };
  blend(STATION.x, STATION.z, 8, 6, 0.8); blend(FARM.x, FARM.z, 11, 7, 1.6);
  const sd = streamDist(x, z); if (sd < 4.5) h -= 1.1 * (1 - (sd / 4.5) * (sd / 4.5));
  if (Math.abs(x) > 60 || Math.abs(z) > 60) { const sd2 = farRiverDist(x, z); if (sd2 < 10) h -= 1.2 * (1 - sd2 / 10); }
  const dh = Math.hypot(x - HOLLOW.x, z - HOLLOW.z); if (dh < 7) h = h * 0.3 + 0.2;
  /* the pond's bank: make sure the ground climbs out of the water right where the water surface ends (no dry hollows below the water line) */
  if (WLK !== null) { const dp = Math.hypot(x - POND.x, z - POND.z); if (dp > 12.5 && dp < 24) { const want = WLK + 0.14 + (dp - 15.2) * 0.09, wi = Math.min(1, (dp - 12.5) / 2.7), wo = Math.min(1, (24 - dp) / 4), wgt = Math.min(wi, wo); if (h < want) h += (want - h) * wgt * wgt * (3 - 2 * wgt); } }
  h += 12 * Math.exp(-((x + 28) * (x + 28)) / 140 - ((z + 70) * (z + 70)) / 34); /* the cliff with the waterfall */
  const d = Math.hypot(x, z); if (d > EDGE - 1) { const rise = d - EDGE, a = Math.atan2(z, x), ew = edgeW(x, z);
    const hills = rise > 0 ? 20 * (1 - Math.exp(-rise / 20)) * (0.72 + 0.28 * Math.sin(a * 5 + 1.3) * Math.cos(a * 2.2)) + 1.5 * Math.sin(a * 13) * Math.min(1, rise / 15) : 0;
    if (ew.w <= 0) h += hills;
    else { /* a flat lookout lip, then a steep cliff down to the sea, valley or canyon floor */
      let floor = 0; const u = Math.max(0, Math.min(1, (rise - 3.6) / 3.2)), cl = u * u * (3 - 2 * u);
      if (ew.id === 'sea') floor = -30 + Math.sin(x * 0.05) * 2;
      else if (ew.id === 'valley') { floor = VALLEY_Y + 1.2 * Math.sin(x * 0.06) * Math.cos(z * 0.05); const far = Math.max(0, Math.min(1, (rise - 120) / 50)); floor += far * far * 34; }
      else { floor = CANYON_Y + Math.sin(z * 0.08) * 0.8; const wall = Math.max(0, Math.min(1, (rise - 95) / 9)); floor += wall * wall * (3 - 2 * wall) * 36 + (rise > 104 ? Math.sin(x * 0.07 + z * 0.05) * 3 : 0); }
      const cliffH = (rise < 3.6 ? h + Math.max(0, rise) * 0.08 : h * (1 - cl) + floor * cl);
      h = (h + hills) * (1 - ew.w) + cliffH * ew.w; } }
  return h;
}
let WLK = null; const WL0 = H(POND.x, POND.z) + 6; WLK = WL0;
/* THE DRAWN GROUND: the ground is drawn as a grid of flat triangles, so between grid points it is a little higher or lower than H().
   Anything that stands, walks or swims uses this height, so it matches what the player actually sees. */
let GRID_N = 140;
function GH(x, z) { const inn = Math.abs(x) < 159.9 && Math.abs(z) < 159.9, cell = inn ? 320 / GRID_N : 10, org = inn ? 160 : 450, fx = (x + org) / cell, fz = (z + org) / cell, ix = Math.floor(fx), iz = Math.floor(fz), u = fx - ix, v = fz - iz;
  const h = function (a, b) { return H(-org + (ix + a) * cell, -org + (iz + b) * cell) - (inn ? 0 : 0.15); };
  return u + v <= 1 ? h(0, 0) + u * (h(1, 0) - h(0, 0)) + v * (h(0, 1) - h(0, 0)) : h(1, 1) + (1 - u) * (h(0, 1) - h(1, 1)) + (1 - v) * (h(1, 0) - h(1, 1)); }
/* bodies of water you can swim in: the pond (deep enough to dive) */
const WATERS = [{ id: 'pond', x: POND.x, z: POND.z, r: 15.8, y: WL0 }];
function waterAt(x, z) { for (let i = 0; i < WATERS.length; i++) { const w = WATERS[i]; if (Math.hypot(x - w.x, z - w.z) < w.r && GH(x, z) < w.y - 0.05) return w; } return null; }

const ROCKBANDS = ['#cdbfa6', '#a99a82', '#d9cfba', '#b8a88e', '#9a8a74'], CANYONBANDS = ['#c8805a', '#d9a070', '#b86a4a', '#e0b888', '#a85a40'], FIELDS = ['#9ab84a', '#c8b858', '#7aa840', '#d6c070', '#6a9a3a', '#b0c860', '#8a6a40'];
function edgeColor(x, z, y, cc) {
  const d = Math.hypot(x, z); if (d < EDGE + 3) return; const e = edgeW(x, z); if (e.w < 0.5) return; const rise = d - EDGE;
  if (e.id === 'sea') { if (y < -24) cc.set('#3a7a8a'); else if (rise > 3.4) cc.set(ROCKBANDS[Math.floor((y + 40) / 1.7) % 5]); return; }
  if (e.id === 'valley') {
    if (rise > 3.4 && y > VALLEY_Y + 2.2 && rise < 14) { cc.set(ROCKBANDS[Math.floor((y + 40) / 1.7) % 5]); return; }
    if (farRiverDist(x, z) < 9) { cc.set('#5a8a3a'); return; }
    const wet = Math.hypot(x + 30, z - 120) < 22; if (wet) { cc.set((Math.floor(x / 5) + Math.floor(z / 4)) % 3 ? '#3f6a34' : '#4a7a5a'); return; }
    const k = Math.abs(Math.floor(x / 15) * 7 + Math.floor(z / 11) * 13) % FIELDS.length; cc.set(FIELDS[k]); if ((Math.floor(z / 1.6)) % 2 && k % 2) cc.offsetHSL(0, 0, -0.04); return; }
  if (e.id === 'canyon') { if (y > CANYON_Y + 1.5 && rise > 3.4) cc.set(CANYONBANDS[Math.floor((y + 40) / 2.1) % 5]); else cc.set(farRiverDist(x, z) < 12 ? '#7a9a4a' : '#c8a878'); if (y > 24) cc.set('#8aa04a'); }
}
function fallTex() { if (W.fall2) return W.fall2; const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const cx = cv.getContext('2d');
  const bg = cx.createLinearGradient(0, 0, 64, 0); bg.addColorStop(0, '#8fd0f0'); bg.addColorStop(0.5, '#b8e6fa'); bg.addColorStop(1, '#8fd0f0'); cx.fillStyle = bg; cx.fillRect(0, 0, 64, 256);
  /* soft vertical ribbons of white water with rounded ends (no blocks) */
  cx.lineCap = 'round'; for (let i = 0; i < 46; i++) { const x = 3 + (i * 37 % 58), y = (i * 71) % 256, len = 30 + (i * 29) % 80, wv = 1.5 + (i % 4); cx.strokeStyle = 'rgba(255,255,255,' + (0.25 + (i % 5) * 0.12) + ')'; cx.lineWidth = wv;
    for (let rep = -1; rep <= 1; rep++) { cx.beginPath(); cx.moveTo(x, y + rep * 256); cx.bezierCurveTo(x + 2, y + len * 0.33 + rep * 256, x - 2, y + len * 0.66 + rep * 256, x + 1, y + len + rep * 256); cx.stroke(); } }
  cx.globalCompositeOperation = 'destination-in'; const em = cx.createLinearGradient(0, 0, 64, 0); em.addColorStop(0, 'rgba(0,0,0,0)'); em.addColorStop(0.18, 'rgba(0,0,0,0.9)'); em.addColorStop(0.82, 'rgba(0,0,0,0.9)'); em.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = em; cx.fillRect(0, 0, 64, 256); cx.globalCompositeOperation = 'source-over';
  W.fall2 = new T.CanvasTexture(cv); W.fall2.wrapS = W.fall2.wrapT = T.RepeatWrapping; W.fall2.repeat.set(1, 1); return W.fall2; }
/* a waterfall as one smooth curved sheet: it rolls over the lip in a round curve, then pours down close to the cliff face.
   top: [x, y, z] where the creek reaches the edge, dir: [dx, dz] the way the water flows, w0/w1: width at the top / bottom */
function waterfallSheet(top, dir, w0, w1, bottomY) {
  const L = Math.hypot(dir[0], dir[1]), dx = dir[0] / L, dz = dir[1] / L, nx = -dz, nz = dx, pts = [];
  const lipR = 1.1; for (let k = 0; k <= 6; k++) { const a = k / 6 * Math.PI / 2; pts.push([top[0] + dx * Math.sin(a) * lipR, top[1] - (1 - Math.cos(a)) * lipR, top[2] + dz * Math.sin(a) * lipR]); }
  /* below the lip: at each height, find the cliff face and hang the water just in front of it */
  const fy0 = top[1] - lipR, n = 26; let lastOut = lipR;
  for (let k = 1; k <= n; k++) { const y = fy0 - (fy0 - bottomY) * k / n; let out = lastOut; for (let d = lastOut; d < lastOut + 40; d += 0.15) { if (H(top[0] + dx * d, top[2] + dz * d) < y) { out = d; break; } out = d; }
    out = Math.max(lastOut, out + 0.35); lastOut = out; pts.push([top[0] + dx * out, y, top[2] + dz * out]); }
  /* smooth the path so it curves instead of stepping */
  for (let it = 0; it < 3; it++) for (let i = 1; i < pts.length - 1; i++) for (let c = 0; c < 3; c += 2) pts[i][c] = (pts[i - 1][c] + pts[i][c] * 2 + pts[i + 1][c]) / 4;
  const m = pts.length, pos = new Float32Array(m * 2 * 3), uv = new Float32Array(m * 2 * 2), idx = []; let sAlong = 0;
  for (let i = 0; i < m; i++) { if (i) sAlong += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]); const u = i / (m - 1), w = (w0 + (w1 - w0) * Math.min(1, u * 1.4)) / 2 * (1 + 0.08 * Math.sin(i * 1.7));
    pos.set([pts[i][0] + nx * w, pts[i][1], pts[i][2] + nz * w, pts[i][0] - nx * w, pts[i][1], pts[i][2] - nz * w], i * 6); uv.set([0, -sAlong / 3, 1, -sAlong / 3], i * 4);
    if (i < m - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  return { geo: geo, bottom: pts[m - 1] };
}
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
#czObj .czChk { margin: 4px 0 0; padding-left: 4px; list-style: none; font-size: .92em; } #czObj .czChk li { margin: 1px 0; }
#czObj small { display: block; color: #7be0ad; text-transform: uppercase; font-size: .72em; letter-spacing: .05em; }
#czBtns { margin-left: auto; display: flex; gap: 6px; pointer-events: auto; flex-wrap: wrap; justify-content: flex-end; }
#czBtns button { padding: 5px 10px; }
.czLang button[aria-pressed="true"] { border-color: var(--signal, #ffd166); background: var(--deep, #0b1d2a); box-shadow: inset 0 0 0 1px var(--signal, #ffd166); }
#czPrompt { position: absolute; bottom: 76px; left: 50%; transform: translateX(-50%); background: rgba(11, 29, 42, .9); border: 2px solid #ffd166; border-radius: 999px; padding: 6px 16px; font-weight: 700; white-space: nowrap; }
#czPrompt .czL { padding: 2px 10px; border-color: #9fe8ff; }
#czCard { position: absolute; left: 12px; bottom: 12px; width: min(420px, calc(100% - 24px)); background: rgba(11, 29, 42, .94); border: 2px solid #9fe0ff; border-radius: 14px; padding: 10px 12px; }
#czCard h3 { margin: 0 0 4px; } #czCard p { margin: 4px 0; line-height: 1.4; } #czCard .rec { color: #7be0ad; font-size: .85em; } #czCard svg { width: 100%; max-height: 160px; background: #e8f0e0; border-radius: 10px; }
#czTalk { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); width: min(640px, calc(100% - 24px)); background: rgba(11, 29, 42, .96); border: 2px solid #ffd166; border-radius: 14px; padding: 10px 14px; }
#czTalk b { color: #ffd166; } #czTalk p { margin: 6px 0; line-height: 1.4; } #czTalk .ch { display: flex; flex-direction: column; gap: 6px; } #czTalk .ch button { text-align: left; } #czTalk .fb { color: #ffb09c; }
#czTalk small { opacity: .75; }
#czGrade { position: absolute; inset: 0; pointer-events: none !important; background: radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(30,18,6,.28) 100%); mix-blend-mode: multiply; }
#czHelp { position: absolute; bottom: 8px; right: 8px; max-width: 46%; font-size: .78em; background: rgba(11, 29, 42, .7); border-radius: 10px; padding: 4px 8px; opacity: .85; }
#czPause { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(11, 29, 42, .7); }
#czPause .card { max-width: 380px; }
#cozyUI.talking #czHelp, #cozyUI.mapping #czHelp, #cozyUI.mapping #czHint { display: none; }
#czClock { align-self: center; background: rgba(11, 29, 42, .7); border-radius: 999px; padding: 4px 10px; font-size: .9em; white-space: nowrap; }
#czRest { position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%); width: min(720px, calc(100% - 24px)); background: rgba(40, 20, 8, .88); border: 2px solid #ffb03a; border-radius: 14px; padding: 6px 12px; font-size: .92em; }
#czRest h3 { margin: 2px 0; font-size: 1em; } #czRest p { margin: 3px 0; }
#czRest .ch { display: flex; flex-wrap: wrap; gap: 5px; } #czRest .ch button { padding: 4px 9px; } #czRest[hidden] { display: none; }
#czSurvey { position: absolute; right: 12px; top: 64px; width: min(470px, calc(100% - 24px)); max-height: calc(100% - 90px); overflow-y: auto; background: rgba(11, 29, 42, .95); border: 2px solid #7be0ad; border-radius: 14px; padding: 8px 12px; }
#czSurvey[hidden] { display: none; } #czSurvey h3 { margin: 2px 0 4px; } #czSurvey p { margin: 4px 0; line-height: 1.35; } #czSurvey .big { font-size: 1.2em; padding: 8px 16px; }
#czSurvey .svbar { height: 10px; border-radius: 6px; background: #1a3a4a; overflow: hidden; } #czSurvey .svbar i { display: block; height: 100%; background: #7be0ad; }
#czSurvey .bugs { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 6px; } #czSurvey .bug { background: #e8f0e0; color: #10202c; border-radius: 10px; padding: 4px 6px; display: flex; flex-direction: column; gap: 2px; font-size: .85em; }
#czSurvey .bug.ok { background: #c8f0d0; } #czSurvey .bug.no { outline: 2px solid #e0603a; } #czSurvey .bug .bb { display: flex; flex-direction: column; gap: 3px; } #czSurvey .bug .bb button { font-size: .85em; padding: 2px 4px; } #czSurvey .bug .bad { color: #b03a1a; } #czSurvey .bug svg { align-self: center; }
#czHint { position: absolute; right: 12px; top: 64px; width: min(360px, calc(100% - 24px)); background: rgba(11, 29, 42, .95); border: 2px solid #ffd166; border-radius: 14px; padding: 8px 12px; }
#czHint h3 { margin: 0 0 4px; } #czHint p { margin: 4px 0; line-height: 1.4; }
#czMapP { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(11, 29, 42, .55); }
#czMapP[hidden] { display: none; }
#czMapP .mapcard { width: min(920px, calc(100% - 20px)); max-width: none; height: min(680px, calc(100% - 20px)); display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; }
#czMapP .mh { display: flex; align-items: center; gap: 8px; } #czMapP .mh h2 { margin: 0; font-size: 1.1em; flex: 1; } #czMapP .mz { display: flex; gap: 4px; } #czMapP .mz button { padding: 4px 10px; }
#czMapC { flex: 1; width: 100%; min-height: 0; border-radius: 10px; border: 3px solid #8a6a3a; cursor: grab; touch-action: none; background: #d8ccb0; }
#czMapP .mf { display: flex; gap: 10px; align-items: flex-start; } #czMapInfo { flex: 1; min-height: 2.6em; } #czMapInfo p { margin: 2px 0; font-size: .92em; }
#czMapLeg { display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: .82em; max-width: 46%; } #czMapLeg span i { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 4px; vertical-align: -1px; border: 1px solid #3a2a1a; }
#czMapH { margin: 0; font-size: .8em; }
#cozyUI.talking #czCard { bottom: auto; top: 96px; }
#czFly { position: absolute; left: 50%; bottom: 44px; transform: translateX(-50%); width: 180px; height: 12px; border-radius: 8px; background: rgba(11, 29, 42, .8); border: 2px solid #9fe8ff; overflow: hidden; }
#czFly i { display: block; height: 100%; background: linear-gradient(90deg, #9fe8ff, #c59cff); }
#czFly[hidden] { display: none; }
#czPause label { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin: 6px 0; }
@media (max-width: 700px) { #czHelp { display: none; } #czObj { max-width: 100%; } }`;
  document.head.appendChild(css);
  const ui = document.createElement('div'); ui.id = 'cozyUI'; ui.hidden = true;
  ui.innerHTML = '<div id="czGrade" aria-hidden="true"></div><div id="czTop"><div id="czObj" aria-live="polite"></div><div id="czBtns">' +
    '<span id="czClock" aria-live="off"></span><button type="button" id="czMapB"></button><button type="button" id="czHintB"></button><button type="button" id="czJ"></button><button type="button" id="czKeys" aria-pressed="false"></button><button type="button" id="czM"></button></div></div><div id="czHint" role="status" aria-live="polite" hidden></div><div id="czRest" hidden></div><div id="czSurvey" hidden></div>' +
    '<div id="czMapP" hidden><div class="card mapcard"><div class="mh"><h2 id="czMapT"></h2><span class="mz"><button type="button" data-mz="in">+</button><button type="button" data-mz="out">−</button><button type="button" data-mz="me" id="czMapMe"></button><button type="button" id="czMapClose"></button></span></div>' +
    '<canvas id="czMapC" aria-label="Map"></canvas><div class="mf"><div id="czMapInfo" aria-live="polite"></div><div id="czMapLeg"></div></div><p class="dim" id="czMapH"></p></div></div><div id="czPrompt" hidden></div><div id="czCard" role="status" aria-live="polite" hidden></div>' +
    '<div id="czTalk" hidden></div><div id="czHelp"></div><div id="czPause" hidden><div class="card"><h2 id="czPT"></h2><button type="button" id="czRes" class="primary"></button><button type="button" id="czPJ"></button><span class="czLang btns" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="es">Español</button></span><label><span id="czMvL"></span><input type="range" id="czMv" min="0" max="100" step="5"></label><label><span id="czSvL"></span><input type="range" id="czSv" min="0" max="100" step="5"></label><label><span id="czSensL"></span><input type="range" id="czSens" min="0.4" max="2" step="0.1"></label><label><span id="czInvL"></span><input type="checkbox" id="czInv"></label><button type="button" id="czQuit"></button></div></div><div id="czFly" hidden aria-hidden="true"><i></i></div>';
  document.getElementById('toast').parentNode.appendChild(ui);
  const mc = ui.querySelector('#czMapC'); mc.addEventListener('pointerdown', function (e) { if (W) mapPointer(e, 'down'); }); mc.addEventListener('pointermove', function (e) { if (W) mapPointer(e, 'move'); }); mc.addEventListener('pointerup', function (e) { if (W) mapPointer(e, 'up'); });
  mc.addEventListener('wheel', function (e) { if (!W) return; e.preventDefault(); e.stopPropagation(); mapZoom(e.deltaY > 0 ? 1 / 1.15 : 1.15); }, { passive: false });
  ui.querySelector('#czMv').addEventListener('input', function (e) { C.S.set.vol = +e.target.value; C.S.set.music = C.S.set.vol > 0; C.save(); if (BQ.amb) BQ.amb.refresh(); });
  ui.querySelector('#czSv').addEventListener('input', function (e) { C.S.set.svol = +e.target.value; C.S.set.sound = C.S.set.svol > 0; C.save(); if (BQ.amb) BQ.amb.refresh(); });
  ui.querySelector('#czSens').addEventListener('input', function (e) { C.S.set.camSens = +e.target.value; C.save(); });
  ui.querySelector('#czInv').addEventListener('change', function (e) { C.S.set.camInv = e.target.checked; C.save(); });
  ui.addEventListener('click', function (e) {
    const b = e.target.closest('button'); if (!b || !W) return; b.blur();
    if (b.dataset.lang) { setLang(b.dataset.lang); return; }
    if (b.id === 'czJ' || b.id === 'czPJ') { openJ(); return; }
    if (b.id === 'czM') { setPause(true); return; }
    if (b.id === 'czRes') { setPause(false); return; }
    if (b.id === 'czQuit') { exit(); return; }
    if (b.dataset.ch != null) { choose(+b.dataset.ch); return; }
    if (b.dataset.next) { talkNext(); }
    if (b.dataset.listen) { listen(W.voice); }
    if (b.dataset.rest) { restChoice(b.dataset.rest); return; }
    if (b.dataset.sv) { if (b.dataset.sv === 'go') { W.sv.on = true; svPanel(); } else if (b.dataset.sv === 'tally') svTally(); else svStop(); return; }
    if (b.dataset.bug != null) { kickSort(+b.dataset.bug, +b.dataset.v); return; }
    if (b.id === 'czKeys') { toggleKeys(); return; } if (b.id === 'czMapB') { openMap(); return; } if (b.id === 'czMapClose') { closeMap(); return; } if (b.id === 'czHintB') { giveHint(); return; } if (b.dataset.hclose) { $('czHint').hidden = true; return; }
    if (b.dataset.mz) { if (b.dataset.mz === 'in') mapZoom(1.3); else if (b.dataset.mz === 'out') mapZoom(1 / 1.3); else { W.mapCx = W.px; W.mapCz = W.pz; drawMap(); } return; }
  });
}
function $(id) { return document.getElementById(id); }
/* the controls list at the bottom: shown for the first visit, then only when you ask (⌨️ button or the ? key) */
function showKeys(on) { const h = $('czHelp'); if (!h) return; h.hidden = !on; const b = $('czKeys'); if (b) b.setAttribute('aria-pressed', String(!!on)); }
function toggleKeys() { C.S.set.czKeys = $('czHelp').hidden ? 1 : 0; C.save(); showKeys(!!C.S.set.czKeys); if (W) W.keysT = null; }
function setLang(l) { C.S.set.lang = l; C.save(); refreshText(); if (W && W.scope) scopePanel(); }
function refreshText() {
  if (!W) return;
  document.querySelectorAll('.czLang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === (C.S.set.lang || 'en'))); });
  $('czJ').textContent = '📓 ' + tx('cz.journal'); $('czM').textContent = '☰ ' + tx('cz.menu'); $('czPT').textContent = tx('cz.paused');
  $('czRes').textContent = tx('cz.resume'); $('czPJ').textContent = '📓 ' + tx('cz.journal'); $('czQuit').textContent = tx('cz.toMenu'); $('czHelp').textContent = tx('cz.controls');
  W.clock = $('czClock'); W.todLast = null; W.lightT = 0;
  $('czKeys').textContent = '⌨️ ' + tx('cz.keys'); $('czMapB').textContent = '🗺️ ' + tx('cz.map'); $('czHintB').textContent = '💡 ' + tx('cz.hint'); $('czMapT').textContent = '🗺️ ' + tx('cz.mapTitle'); $('czMapClose').textContent = tx('cz.close') + ' (M)'; $('czMapMe').textContent = '⌖ ' + tx('cz.mapMe'); $('czMapH').textContent = tx('cz.mapHelp');
  $('czMapLeg').innerHTML = [['#e0403a', 'cz.lg.you'], ['#ffd166', 'cz.lg.find'], ['#5fb8ff', 'cz.lg.person'], ['#c59cff', 'cz.lg.view'], ['#3aa8c0', 'cz.lg.water'], ['#4a7a3a', 'cz.lg.forest'], ['#8cbc52', 'cz.lg.meadow'], ['#c8a050', 'cz.lg.farm'], ['#d8a060', 'cz.lg.path'], ['#e9dfc4', 'cz.unexplored']].map(function (l) { return '<span><i style="background:' + l[0] + '"></i>' + C.esc(tx(l[1])) + '</span>'; }).join('');
  if (W.ui === 'map') drawMap();
  $('czMvL').textContent = '🎵 ' + tx('cz.musicVol'); $('czSvL').textContent = '🐦 ' + tx('cz.soundVol'); $('czMv').value = C.S.set.music ? C.S.set.vol : 0; $('czSv').value = C.S.set.sound ? (C.S.set.svol == null ? 100 : C.S.set.svol) : 0;
  $('czSensL').textContent = tx('cz.camSpeed'); $('czInvL').textContent = tx('cz.camInv'); $('czSens').value = C.S.set.camSens || 1; $('czInv').checked = !!C.S.set.camInv; $('czFly').title = tx('cz.energy');
  objective(); if (W.card) showCard(W.card.id, W.card.extra); if (W.talk) drawTalk(); W.lastPrompt = null;
  W.npcs.forEach(function (n) { n.tag.material.map = C.labelTex(npcName(n.id), { bd: '#ffd166' }); n.tag.material.needsUpdate = true; });
}
function npcName(id) { const es = C.S.set.lang === 'es', n = { ama: es ? 'Dra. Ama' : 'Dr. Ama', pip: 'Pip', lu: es ? 'Granjera Lu' : 'Farmer Lu', sam: es ? 'Guardabosques Sam' : 'Ranger Sam' }[id]; return n || tx('cz.an.' + id); }
/* a simple storybook person: legs, body, arms, head, hair and a hat; the humans of Willow Creek */
function buildHuman(o) {
  const g = new T.Group(), G = C.G, M = function (c) { return C.emat(c, '#140c08'); };
  [-1, 1].forEach(function (sd) { const lg = new T.Mesh(G.cyl, M(o.pants)); lg.scale.set(0.12, 0.85, 0.12); lg.position.set(sd * 0.14, 0.43, 0); g.add(lg); const sh = new T.Mesh(G.box, M(o.shoes || '#3a2a20')); sh.scale.set(0.17, 0.1, 0.3); sh.position.set(sd * 0.14, 0.05, 0.05); g.add(sh); });
  const body = new T.Mesh(G.cyl, M(o.shirt)); body.scale.set(0.3, 0.78, 0.24); body.position.y = 1.22; g.add(body);
  if (o.vest) { const v = new T.Mesh(G.box, M(o.vest)); v.scale.set(0.5, 0.6, 0.06); v.position.set(0, 1.22, 0.23); g.add(v); [-1, 1].forEach(function (sd) { const pk = new T.Mesh(G.box, M('#6a5a30')); pk.scale.set(0.14, 0.12, 0.03); pk.position.set(sd * 0.13, 1.12, 0.27); g.add(pk); }); }
  if (o.bib) { const b = new T.Mesh(G.box, M(o.pants)); b.scale.set(0.42, 0.42, 0.05); b.position.set(0, 1.08, 0.23); g.add(b); [-1, 1].forEach(function (sd) { const st0 = new T.Mesh(G.box, M(o.pants)); st0.scale.set(0.07, 0.42, 0.04); st0.position.set(sd * 0.15, 1.42, 0.22); g.add(st0); }); }
  [-1, 1].forEach(function (sd) { const ar = new T.Mesh(G.cyl, M(o.shirt)); ar.scale.set(0.085, 0.66, 0.085); ar.position.set(sd * 0.38, 1.2, 0); ar.rotation.z = sd * 0.12; g.add(ar); const hd = new T.Mesh(G.sph, M(o.skin)); hd.scale.setScalar(0.09); hd.position.set(sd * 0.42, 0.85, 0.02); g.add(hd); });
  const head = new T.Mesh(G.sph, M(o.skin)); head.scale.set(0.26, 0.28, 0.25); head.position.y = 1.86; g.add(head);
  [-1, 1].forEach(function (sd) { const e = new T.Mesh(G.sph, C.basic('#1a1410')); e.scale.set(0.035, 0.045, 0.02); e.position.set(sd * 0.09, 1.9, 0.235); g.add(e); const ck = new T.Mesh(G.sph, C.basic('#e88a8a', 0.6)); ck.scale.set(0.045, 0.025, 0.01); ck.position.set(sd * 0.15, 1.82, 0.225); g.add(ck); });
  const sm = new T.Mesh(new T.TorusGeometry(0.06, 0.012, 6, 10, Math.PI), C.basic('#5a2a20')); sm.rotation.z = Math.PI; sm.position.set(0, 1.79, 0.245); g.add(sm);
  const hair = new T.Mesh(G.sph, M(o.hair)); hair.scale.set(0.275, 0.2, 0.27); hair.position.set(0, 1.98, -0.03); g.add(hair);
  if (o.hairStyle === 'bun') { const bn = new T.Mesh(G.sph, M(o.hair)); bn.scale.setScalar(0.12); bn.position.set(0, 2.08, -0.2); g.add(bn); }
  if (o.hairStyle === 'long') { const ln = new T.Mesh(G.box, M(o.hair)); ln.scale.set(0.46, 0.42, 0.12); ln.position.set(0, 1.72, -0.2); g.add(ln); }
  if (o.hairStyle === 'curly') for (let k = 0; k < 7; k++) { const c = new T.Mesh(G.sph, M(o.hair)); c.scale.setScalar(0.1); c.position.set(Math.cos(k * 0.9) * 0.22, 2.0 + Math.sin(k * 1.7) * 0.05, Math.sin(k * 0.9) * 0.18 - 0.04); g.add(c); }
  const brim = function (r, col, h) { const b = new T.Mesh(G.cyl, M(col)); b.scale.set(r, 0.03, r); b.position.y = 2.08; g.add(b); const cr = new T.Mesh(G.cyl, M(col)); cr.scale.set(0.24, h, 0.24); cr.position.y = 2.1 + h / 2; g.add(cr); return cr; };
  if (o.hat === 'field') { brim(0.42, o.hatCol, 0.18); const band = new T.Mesh(G.cyl, M('#6a4a2a')); band.scale.set(0.245, 0.05, 0.245); band.position.y = 2.14; g.add(band); }
  if (o.hat === 'straw') { brim(0.55, '#e6c86a', 0.16); }
  if (o.hat === 'ranger') { brim(0.44, o.hatCol, 0.2); }
  if (o.hat === 'cap') { const cp = new T.Mesh(G.sph, M(o.hatCol)); cp.scale.set(0.28, 0.16, 0.28); cp.position.y = 2.03; g.add(cp); const vs = new T.Mesh(G.box, M(o.hatCol)); vs.scale.set(0.3, 0.03, 0.2); vs.position.set(0, 2.02, 0.3); g.add(vs); }
  if (o.prop === 'clipboard') { const cb = new T.Mesh(G.box, M('#8a6a3a')); cb.scale.set(0.24, 0.32, 0.03); cb.position.set(0.36, 1.05, 0.22); cb.rotation.x = -0.4; g.add(cb); const pp = new T.Mesh(G.box, C.basic('#f4f0e6')); pp.scale.set(0.2, 0.26, 0.01); pp.position.set(0.36, 1.06, 0.24); pp.rotation.x = -0.4; g.add(pp); }
  if (o.prop === 'rod') { const rd = new T.Mesh(G.cyl, M('#6a4a2a')); rd.scale.set(0.02, 2.2, 0.02); rd.position.set(0.5, 1.6, 0.5); rd.rotation.x = 0.9; g.add(rd); }
  if (o.prop === 'binoculars') { [-1, 1].forEach(function (sd) { const bn = new T.Mesh(G.cyl, M('#2a2a2a')); bn.scale.set(0.05, 0.12, 0.05); bn.rotation.x = Math.PI / 2; bn.position.set(sd * 0.06, 1.5, 0.26); g.add(bn); }); }
  return g;
}

/* ---------- BUILD THE RESERVE ---------- */
function build() {
  const g = new T.Group(), G = C.G, scene = C.scene;
  /* low-detail shapes for things drawn hundreds of times (keeps Chromebooks smooth) */
  const LP = { sph: new T.SphereGeometry(1, 7, 5), cone: new T.ConeGeometry(1, 2, 5), cone8: new T.ConeGeometry(1, 2, 8), cyl: new T.CylinderGeometry(1, 1, 1, 5), sph10: new T.SphereGeometry(1, 10, 7) };
  /* graphics part 2: more detailed shapes, built once and reused (grass tufts, flowers, bushes, ferns, mossy rocks) */
  const GX = detailGeos();
  W = { g: g, tod: st().tod != null ? st().tod : 9, colliders: [], tops: [], spots: [], npcs: [], anim: [], t: 0, k: {}, yaw: Math.PI * 0.75, pitch: 0.42, dist: 11, distT: 11, vx: 0, vz: 0, flyE: 1, drag: null, talk: null, card: null, cardT: 0, saveT: 0, birdT: 3, pause: false,
    bg: scene.background, fog: scene.fog, light: [C.HEMI.intensity, C.KEYL.intensity, C.KEYL.position.clone()] };
  scene.add(g);
  scene.background = new T.Color('#cfe9f7'); scene.fog = new T.Fog('#d0eaf6', 70, 260);
  C.HEMI.color.set('#fff2d8'); C.HEMI.groundColor.set('#4a5a2a'); C.HEMI.intensity = 0.5; C.KEYL.color.set('#ffeccc'); C.KEYL.position.set(60, 55, 40); C.KEYL.intensity = 0.85;
  /* terrain with colors by place */
  const N = S0low() ? 110 : 140, geo = new T.PlaneGeometry(320, 320, N, N); GRID_N = N; geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position, cols = new Float32Array(pos.count * 3), cc = new T.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), y = H(x, z); pos.setY(i, y);
    const dp = Math.hypot(x - POND.x, z - POND.z), dh = Math.hypot(x - HILL.x, z - HILL.z), forest = x > 22 && z > 14, farm = Math.abs(x - FARM.x) < 11 && Math.abs(z - FARM.z) < 9;
    const dd = Math.hypot(x, z), cliff = Math.abs(x + 28) < 9 && z < -61 && z > -74, pth = pathDist(x, z);
    if (dp < 19) cc.set(y < WL0 - 0.3 ? '#6a7a4a' : '#e0c890'); else if (farm) cc.set(((Math.floor((x - FARM.x + 11) / 1.6)) % 2) ? '#7a5a3a' : '#8a6a3a'); else if (cliff && y > 6) cc.set('#8a7a68'); else if (dh < 9 && y > 9) cc.set('#9a9a88'); else if (forest && dd < EDGE) cc.set('#2f5226');
    else if (dd > EDGE + 2) cc.set('#5a8a34').lerp(new T.Color('#3f6a34'), Math.min(1, (dd - EDGE) / 50)); else { const nn = Math.sin(x * 0.11 + Math.cos(z * 0.07) * 2) * Math.cos(z * 0.09 - x * 0.03); cc.set(y > 6 ? '#6f9a34' : '#5f9a38').lerp(new T.Color(nn > 0.35 ? '#94a83c' : nn < -0.4 ? '#3f7a30' : '#5f9a38'), 0.6); }
    if (pth < 1.6 && dd < EDGE && !farm && dp > 16.5) cc.lerp(new T.Color('#c0844e'), pth < 1 ? 0.8 : 0.3);
    edgeColor(x, z, y, cc);
    cc.offsetHSL(0, 0, (Math.sin(x * 1.7 + z * 2.3) * 0.5) * 0.04); cols[i * 3] = cc.r; cols[i * 3 + 1] = cc.g; cols[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('color', new T.BufferAttribute(cols, 3)); geo.computeVertexNormals();
  W.groundTex = groundTex(); W.groundTex.repeat.set(48, 48);
  g.add(new T.Mesh(geo, new T.MeshLambertMaterial({ vertexColors: true, map: W.groundTex })));
  /* far ground beyond the reserve (coarser), with a hole where the detailed ground already is */
  { const FG = new T.PlaneGeometry(900, 900, 90, 90); FG.rotateX(-Math.PI / 2); const fp = FG.attributes.position, fcl = new Float32Array(fp.count * 3);
    for (let i = 0; i < fp.count; i++) { const x = fp.getX(i), z = fp.getZ(i), inside = Math.abs(x) < 159.9 && Math.abs(z) < 159.9, y = H(x, z); fp.setY(i, inside ? -60 : y - 0.15);
      cc.set(y > 6 ? '#5a8a3a' : '#5f9a38'); edgeColor(x, z, y, cc); fcl[i * 3] = cc.r; fcl[i * 3 + 1] = cc.g; fcl[i * 3 + 2] = cc.b; }
    FG.setAttribute('color', new T.BufferAttribute(fcl, 3)); FG.computeVertexNormals(); g.add(new T.Mesh(FG, new T.MeshLambertMaterial({ vertexColors: true }))); }
  /* the sea: teal water with ripple rings, foam at the cliff foot, islands, sea stacks and gulls */
  { const sc0 = document.createElement('canvas'); sc0.width = sc0.height = 128; const sx = sc0.getContext('2d'); sx.fillStyle = '#2a9ab0'; sx.fillRect(0, 0, 128, 128); sx.strokeStyle = 'rgba(200,245,255,0.45)'; sx.lineWidth = 2;
    for (let k = 0; k < 7; k++) { sx.beginPath(); sx.ellipse((k * 37) % 128, (k * 53) % 128, 10 + (k % 3) * 6, 5 + (k % 2) * 4, 0, 0, Math.PI * 2); sx.stroke(); }
    W.seaTex = new T.CanvasTexture(sc0); W.seaTex.wrapS = W.seaTex.wrapT = T.RepeatWrapping; W.seaTex.repeat.set(60, 60);
    const sea = new T.Mesh(new T.CircleGeometry(900, 64), new T.MeshLambertMaterial({ map: W.seaTex, emissive: '#06303a', transparent: true, opacity: 0.95 })); sea.rotation.x = -Math.PI / 2; sea.position.y = SEA_Y; g.add(sea);
    const foam = new T.Mesh(new T.RingGeometry(EDGE + 6.8, EDGE + 9.5, 64, 1, (-24) * Math.PI / 180, 54 * Math.PI / 180), C.basic('#e8fbff', 0.55)); foam.rotation.x = -Math.PI / 2; foam.rotation.z = 0; foam.position.y = SEA_Y + 0.05; g.add(foam); W.foam = foam;
    const isl = [[150, -30, 18], [200, 40, 26], [120, 60, 9], [260, -90, 30], [110, -60, 7]];
    isl.forEach(function (q, k) { const m = new T.Mesh(new T.CylinderGeometry(q[2] * 0.8, q[2], 14 + q[2] * 0.3, 10), C.emat(ROCKBANDS[k % 5], '#1a1a10')); m.position.set(q[0], SEA_Y + 3, q[1]); g.add(m);
      const top = new T.Mesh(new T.CylinderGeometry(q[2] * 0.82, q[2] * 0.8, 1.2, 10), C.emat('#6aa040', '#0a1a06')); top.position.set(q[0], SEA_Y + 10.6 + q[2] * 0.15, q[1]); g.add(top);
      for (let t = 0; t < Math.max(2, q[2] / 4); t++) { const pc = new T.Mesh(LP.cone8, C.emat('#2f6a3a', '#081808')); const s3 = 1.5 + (t % 3); pc.scale.set(s3, s3 * 1.8, s3); pc.position.set(q[0] + Math.cos(t * 2.3) * q[2] * 0.5, SEA_Y + 12 + q[2] * 0.15 + s3 * 1.6, q[1] + Math.sin(t * 2.3) * q[2] * 0.5); g.add(pc); } });
    W.gulls = []; }
  /* the valley below the south lookout: patchwork farms, a little town, a wetland and the river */
  { const town = [[30, 120], [36, 126], [24, 128], [42, 116], [34, 134], [46, 128], [28, 140]], roofs = ['#c4462c', '#d0703a', '#8a3a2a', '#e09a4a'];
    town.forEach(function (t0, k) { const y = H(t0[0], t0[1]), hs = new T.Mesh(G.box, C.emat(k % 2 ? '#f0e6d0' : '#e8d8b8', '#2a2418')); hs.scale.set(3.2, 2.6, 3.6); hs.position.set(t0[0], y + 1.3, t0[1]); hs.rotation.y = k * 0.4; g.add(hs);
      const rf = new T.Mesh(G.cone, C.emat(roofs[k % 4], '#200a05')); rf.scale.set(2.8, 1, 2.8); rf.rotation.y = Math.PI / 4 + k * 0.4; rf.position.set(t0[0], y + 3.4, t0[1]); g.add(rf); });
    const barn = new T.Mesh(G.box, C.emat('#b03a2a', '#200805')); barn.scale.set(6, 4.5, 8); barn.position.set(-30, H(-30, 96) + 2.2, 96); g.add(barn);
    const silo = new T.Mesh(G.cyl, C.emat('#c8c8c0', '#202020')); silo.scale.set(1.6, 8, 1.6); silo.position.set(-24, H(-24, 96) + 4, 96); g.add(silo);
    const road = []; for (let k = 0; k < 30; k++) { const x = -60 + k * 6, z = 128 + Math.sin(k * 0.3) * 10; road.push([x, H(x, z) + 0.12, z, 6.4, 1, 3, -Math.atan2(Math.cos(k * 0.3) * 3, 6)]); }
    g.add(inst(new T.BoxGeometry(1, 0.05, 1), C.emat('#5a5048', '#101010'), road));
    const pools = []; for (let k = 0; k < 9; k++) { const x = -30 + Math.cos(k * 2.1) * 14, z = 120 + Math.sin(k * 1.7) * 12; pools.push([x, H(x, z) + 0.1, z, 2 + (k % 3), 1, 1.6 + (k % 2)]); }
    g.add(inst(new T.CylinderGeometry(1, 1, 0.05, 12), C.emat('#4a9ab0', '#0a2a3a'), pools));
    const vt = []; for (let k = 0; k < 70; k++) { const x = -60 + rnd(k + 8000) * 140, z = 80 + rnd(k + 8100) * 90; if (farRiverDist(x, z) > 8 && farRiverDist(x, z) < 16 || k % 4 === 0) vt.push([x, H(x, z) + 2.5, z, 1.8, 2.6, 1.8, k]); }
    g.add(inst(LP.sph10, C.emat('#4f8a34', '#0a1806'), vt)); }
  /* the canyon to the west: striped walls, a mesa, and a green river at the bottom */
  { const ms = [[-135, -20, 9], [-128, 40, 7]]; ms.forEach(function (q, k) { const m = new T.Mesh(new T.CylinderGeometry(q[2] * 0.85, q[2], 34, 9), C.emat(CANYONBANDS[k], '#200a05')); m.position.set(q[0], CANYON_Y + 17, q[1]); g.add(m); }); }
  /* lookouts: a wooden fence along each cliff edge, a bench and a viewer to look far away */
  W.views = [];
  EDGES.forEach(function (e) { const mid = (e.a0 + e.a1) / 2 * Math.PI / 180, posts = [], rails = [];
    for (let a = e.a0 - 2; a <= e.a1 + 2; a += 2.4) { const r0 = a * Math.PI / 180, x = Math.cos(r0) * (EDGE + 2.4), z = Math.sin(r0) * (EDGE + 2.4), y = H(x, z); posts.push([x, y + 0.6, z, 0.09, 1.2, 0.09]);
      const r1 = (a + 2.4) * Math.PI / 180, x1 = Math.cos(r1) * (EDGE + 2.4), z1 = Math.sin(r1) * (EDGE + 2.4), L1 = Math.hypot(x1 - x, z1 - z); if (a + 2.4 <= e.a1 + 2) { [0.55, 1.0].forEach(function (hh) { rails.push([(x + x1) / 2, y + hh, (z + z1) / 2, L1, 0.045, 0.045, -Math.atan2(z1 - z, x1 - x)]); }); } }
    g.add(inst(G.box, C.emat('#9a6a3a', '#1a0e05'), posts)); W.postTops = (W.postTops || []).concat(posts.filter(function (q, i) { return i % 3 === 0; }).map(function (q) { return [q[0], q[1] + 0.62, q[2]]; })); g.add(inst(G.box, C.emat('#b07a44', '#1a0e05'), rails));
    const vx = Math.cos(mid) * (EDGE + 0.9), vz = Math.sin(mid) * (EDGE + 0.9), vy = H(vx, vz), vw = new T.Group(); const st0 = new T.Mesh(G.cyl, C.emat('#4a5a6a', '#0a1018')); st0.scale.set(0.12, 1.1, 0.12); st0.position.y = 0.55; vw.add(st0);
    const hd = new T.Mesh(G.box, C.emat('#3a7ab0', '#0a1a2a')); hd.scale.set(0.45, 0.32, 0.6); hd.position.y = 1.25; vw.add(hd); [-1, 1].forEach(function (sd) { const ey = new T.Mesh(G.cyl, C.basic('#1a2a3a')); ey.scale.set(0.09, 0.2, 0.09); ey.rotation.x = Math.PI / 2; ey.position.set(sd * 0.11, 1.28, -0.35); vw.add(ey); });
    vw.position.set(vx, vy, vz); vw.rotation.y = -mid + Math.PI / 2; g.add(vw); W.colliders.push({ x: vx, z: vz, r: 0.4 });
    const side = streamDist(Math.cos(mid + 0.08) * (EDGE - 1), Math.sin(mid + 0.08) * (EDGE - 1)) < 4 ? -0.08 : 0.08, bx = Math.cos(mid + side) * (EDGE - 1), bz = Math.sin(mid + side) * (EDGE - 1), bn = new T.Mesh(G.box, C.emat('#9a6a3a', '#1a0e05')); bn.scale.set(2.2, 0.25, 0.6); bn.position.set(bx, H(bx, bz) + 0.5, bz); bn.rotation.y = -mid + Math.PI / 2; g.add(bn);
    W.views.push({ id: e.id, x: vx, z: vz, yaw: -(mid) - Math.PI / 2 }); });
  /* the pond's outlet creek tumbles over the valley cliff as a waterfall */
  { const top = OUTLET[OUTLET.length - 1], prev = OUTLET[OUTLET.length - 2], cr = CREEKS.find(function (c) { return c.id === 'outlet'; }), P2 = cr.pts, pe = P2[P2.length - 1], pp = P2[P2.length - 4];
    const by = VALLEY_Y + 0.2, sh = waterfallSheet([pe[0], H(pe[0], pe[1]) + 0.2, pe[1]], [pe[0] - pp[0], pe[1] - pp[1]], cr.w1 * 1.2, cr.w1 * 1.7, by);
    const wf2 = new T.Mesh(sh.geo, new T.MeshBasicMaterial({ map: fallTex(), color: '#ffffff', transparent: true, opacity: 0.9, side: T.DoubleSide, depthWrite: false })); g.add(wf2); W.wf2 = wf2;
    const bx = sh.bottom[0], bz = sh.bottom[2];
    /* a round splash pool at the foot of the falls, joined to the river */
    const sp = new T.Mesh(new T.CircleGeometry(3.2, 28), new T.MeshLambertMaterial({ color: '#4a9ad0', emissive: '#0a2a40', transparent: true, opacity: 0.88 })); sp.rotation.x = -Math.PI / 2; sp.position.set(bx, Math.max(H(bx, bz), by) + 0.12, bz); g.add(sp);
    const foam = new T.Mesh(new T.RingGeometry(0.4, 1.6, 24), C.basic('#ffffff', 0.55)); foam.rotation.x = -Math.PI / 2; foam.position.set(bx, sp.position.y + 0.03, bz); g.add(foam); W.foam2 = foam;
    for (let k = 0; k < 4; k++) { const m = C.glow('#ffffff', 3, 0.35); m.position.set(bx + (k - 1.5) * 0.8, sp.position.y + 1, bz); g.add(m); W.mist2 = (W.mist2 || []).concat([{ m: m, y: sp.position.y + 1, ph: k }]); } }
  /* sky dome with a soft gradient, sun, drifting clouds, faraway blue mountains */
  const sky = new T.SphereGeometry(520, 24, 12), sp = sky.attributes.position, sc2 = new Float32Array(sp.count * 3), top = new T.Color('#4a9ee0'), hor = new T.Color('#d8eef8'), tmp = new T.Color();
  for (let i = 0; i < sp.count; i++) { const u = Math.max(0, sp.getY(i) / 520); tmp.copy(hor).lerp(top, Math.pow(u, 0.6)); sc2[i * 3] = tmp.r; sc2[i * 3 + 1] = tmp.g; sc2[i * 3 + 2] = tmp.b; }
  sky.setAttribute('color', new T.BufferAttribute(sc2, 3)); g.add(new T.Mesh(sky, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false, depthWrite: false }))); W.skyG = sky;
  const sun = C.glow('#fff4c8', 90, 0.9); sun.material.fog = false; sun.position.set(180, 230, -300); g.add(sun); W.sun = sun;
  W.moon = new T.Group(); { const mb = new T.Mesh(new T.SphereGeometry(9, 20, 14), new T.MeshBasicMaterial({ color: '#f4f0e0', fog: false })); W.moon.add(mb); const mg = C.glow('#c8d8ff', 70, 0.55); mg.material.fog = false; W.moon.add(mg); } g.add(W.moon);
  { const n = S0low() ? 500 : 1100, pp = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const u = rnd(i + 11000) * 0.95 + 0.05, a = rnd(i + 12000) * 6.283, r = 470, c0 = Math.sqrt(1 - u * u); pp[i * 3] = Math.cos(a) * c0 * r; pp[i * 3 + 1] = u * r; pp[i * 3 + 2] = Math.sin(a) * c0 * r; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pp, 3)); W.stars = new T.Points(sg, new T.PointsMaterial({ color: '#ffffff', size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false })); g.add(W.stars); }
  W.shoot = C.glow('#ffffff', 3, 0); W.shoot.material.fog = false; W.shoot.scale.set(26, 0.7, 1); g.add(W.shoot);
  W.clouds = []; const CN = S0low() ? 7 : 12; W.cloudIM = new T.InstancedMesh(LP.sph10, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#c8d8e8', fog: false }), CN * 5); g.add(W.cloudIM);
  for (let i = 0; i < CN; i++) { const a = i * 0.53, r2 = 80 + (i * 37 % 90); W.clouds.push({ x: Math.cos(a) * r2, y: 62 + (i % 4) * 8, z: Math.sin(a) * r2, sp: 0.8 + (i % 3) * 0.3 }); }
  const mts = [], caps = [], mcol = [];
  for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2 + Math.sin(i) * 0.1, r2 = 210 + (i * 23 % 50), sx = 30 + (i * 17 % 25), sy = 38 + (i * 29 % 40), sz = 30 + (i * 13 % 25), x = Math.cos(a) * r2, z = Math.sin(a) * r2;
    if (edgeW(x, z, 'sea') > 0) continue; mts.push([x, 0, z, sx, sy, sz, i]); mcol.push(i % 2 ? '#8fb0c8' : '#7f9fbf'); caps.push([x, sy * 0.36, z, sx * 0.3, sy * 0.3, sz * 0.3, i]); }
  g.add(inst(LP.cone8, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#304050' }), mts, mcol)); g.add(inst(LP.cone8, C.emat('#f4f8ff', '#8090a0'), caps));
  /* pond water (green and cloudy until the mystery is solved) and the stream */
  /* the pond surface: a disc with many rings of points, shaded lighter over the shallows and darker over the deep middle */
  const wgeo = new T.RingGeometry(0.01, 15.8, 72, 16), wpos = wgeo.attributes.position, wcol = new Float32Array(wpos.count * 3);
  for (let i = 0; i < wpos.count; i++) { const dep = Math.max(0, WL0 - GH(POND.x + wpos.getX(i), POND.z - wpos.getY(i))), f = 0.72 + 0.62 * Math.exp(-dep / 1.4); wcol[i * 3] = f; wcol[i * 3 + 1] = f * 1.02; wcol[i * 3 + 2] = f * 0.98; }
  wgeo.setAttribute('color', new T.BufferAttribute(wcol, 3));
  W.water = new T.Mesh(wgeo, new T.MeshLambertMaterial({ color: '#5a8a3a', transparent: true, opacity: 0.85, emissive: '#102a10', side: T.DoubleSide, vertexColors: true }));
  W.water.rotation.x = -Math.PI / 2; W.water.position.set(POND.x, WL0, POND.z); g.add(W.water);
  { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x0 = cv.getContext('2d'); x0.fillStyle = '#ffffff'; x0.fillRect(0, 0, 256, 256);
    x0.strokeStyle = 'rgba(255,255,255,0.0)'; for (let k = 0; k < 22; k++) { const cx0 = (k * 97) % 256, cy0 = (k * 57 + 31) % 256, r0 = 6 + (k * 13) % 14; x0.strokeStyle = 'rgba(200,235,240,0.9)'; x0.lineWidth = 2; x0.beginPath(); x0.ellipse(cx0, cy0, r0, r0 * 0.55, 0, 0, 6.283); x0.stroke(); x0.globalAlpha = 0.5; x0.beginPath(); x0.ellipse(cx0, cy0, r0 * 1.6, r0 * 0.9, 0, 0.4, 2.6); x0.stroke(); x0.globalAlpha = 1; }
    W.pondTex = new T.CanvasTexture(cv); W.pondTex.wrapS = W.pondTex.wrapT = T.RepeatWrapping; W.pondTex.repeat.set(3, 3); W.water.material.map = W.pondTex; W.water.material.needsUpdate = true;
    /* a soft line of ripples that follows the real shoreline (where the ground meets the water), not a perfect circle */
    const rimGeo = (function () { const n = 120, P = new Float32Array((n + 1) * 2 * 3), U = new Float32Array((n + 1) * 2 * 2), I = [];
      for (let k = 0; k <= n; k++) { const a = k / n * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a); let rs = 15.8; for (let r = 4; r <= 15.8; r += 0.1) { if (GH(POND.x + ca * r, POND.z - sa * r) >= WL0 - 0.02) { rs = r; break; } }
        P.set([ca * (rs - 0.9), sa * (rs - 0.9), 0, ca * (rs + 0.15), sa * (rs + 0.15), 0], k * 6); U.set([0, k / n * 24, 1, k / n * 24], k * 4); if (k < n) { const o = k * 2; I.push(o, o + 1, o + 2, o + 1, o + 3, o + 2); } }
      const gg = new T.BufferGeometry(); gg.setAttribute('position', new T.BufferAttribute(P, 3)); gg.setAttribute('uv', new T.BufferAttribute(U, 2)); gg.setIndex(I); return gg; })();
    const rcv = document.createElement('canvas'); rcv.width = 64; rcv.height = 8; const rx0 = rcv.getContext('2d'), rgr = rx0.createLinearGradient(0, 0, 64, 0); rgr.addColorStop(0, 'rgba(255,255,255,0)'); rgr.addColorStop(0.7, 'rgba(255,255,255,0.8)'); rgr.addColorStop(0.86, 'rgba(255,255,255,1)'); rgr.addColorStop(1, 'rgba(255,255,255,0)'); rx0.fillStyle = rgr; rx0.fillRect(0, 0, 64, 8);
    W.rim = new T.Mesh(rimGeo, new T.MeshBasicMaterial({ color: '#e8f4d8', map: new T.CanvasTexture(rcv), transparent: true, opacity: 0.35, depthWrite: false })); W.rim.rotation.x = -Math.PI / 2; W.rim.position.set(POND.x, WL0 + 0.04, POND.z); g.add(W.rim); }
  W.scum = new T.Group(); for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 3 + (i * 7 % 11); const m = new T.Mesh(new T.CircleGeometry(1 + (i % 3) * 0.5, 10), C.basic('#6fae3a', 0.7)); m.rotation.x = -Math.PI / 2; m.position.set(POND.x + Math.cos(a) * r, WL0 + 0.03, POND.z + Math.sin(a) * r); W.scum.add(m); } g.add(W.scum);
  /* creeks: one smooth ribbon of flowing water per creek, laid along its carved bed */
  { const cv0 = document.createElement('canvas'); cv0.width = 64; cv0.height = 256; const x0 = cv0.getContext('2d'), gr0 = x0.createLinearGradient(0, 0, 64, 0);
    gr0.addColorStop(0, '#5fb8b0'); gr0.addColorStop(0.5, '#3a9ab8'); gr0.addColorStop(1, '#5fb8b0'); x0.fillStyle = gr0; x0.fillRect(0, 0, 64, 256);
    x0.strokeStyle = 'rgba(230,250,255,0.75)'; x0.lineWidth = 2.5; for (let k = 0; k < 9; k++) { const cx0 = 8 + (k * 23) % 48, cy0 = (k * 61) % 256; x0.beginPath(); x0.moveTo(cx0 - 6, cy0); x0.quadraticCurveTo(cx0, cy0 - 7, cx0 + 6, cy0); x0.stroke(); x0.beginPath(); x0.moveTo(cx0 - 6, cy0 + 128); x0.quadraticCurveTo(cx0, cy0 + 121, cx0 + 6, cy0 + 128); x0.stroke(); }
    /* soft, slightly wavy banks instead of hard straight edges */
    x0.globalCompositeOperation = 'destination-in'; const em = x0.createLinearGradient(0, 0, 64, 0); em.addColorStop(0, 'rgba(0,0,0,0)'); em.addColorStop(0.14, 'rgba(0,0,0,0.85)'); em.addColorStop(0.24, 'rgba(0,0,0,1)'); em.addColorStop(0.76, 'rgba(0,0,0,1)'); em.addColorStop(0.86, 'rgba(0,0,0,0.85)'); em.addColorStop(1, 'rgba(0,0,0,0)'); x0.fillStyle = em; x0.fillRect(0, 0, 64, 256); x0.globalCompositeOperation = 'source-over';
    W.creekTex = new T.CanvasTexture(cv0); W.creekTex.wrapS = W.creekTex.wrapT = T.RepeatWrapping;
    const cmat = new T.MeshLambertMaterial({ map: W.creekTex, transparent: true, opacity: 0.95, emissive: '#0a2a3a', depthWrite: false });
    CREEKS.forEach(function (c) {
      const P = c.pts, n = P.length, pos = new Float32Array(n * 2 * 3), uv = new Float32Array(n * 2 * 2), idx = []; let along = 0; const ys = [];
      /* the ground is drawn as a grid of triangles: find how high the drawn ground is, so the water never hides under it */
      const GN = S0low() ? 110 : 140, gH = function (x, z) { const inn = Math.abs(x) < 159 && Math.abs(z) < 159, cell = inn ? 320 / GN : 10, org = inn ? 160 : 450, gx = Math.floor((x + org) / cell), gz = Math.floor((z + org) / cell); let m = -1e9; for (let a = 0; a <= 1; a++) for (let b = 0; b <= 1; b++) m = Math.max(m, H(-org + (gx + a) * cell, -org + (gz + b) * cell)); return m; };
      /* the exact height of the drawn ground (the same triangles the player sees), so the water can sit right on it */
      const dH = function (x, z) { const inn = Math.abs(x) < 159.9 && Math.abs(z) < 159.9, cell = inn ? 320 / GN : 10, org = inn ? 160 : 450, fx = (x + org) / cell, fz = (z + org) / cell, ix = Math.floor(fx), iz = Math.floor(fz), u = fx - ix, v = fz - iz;
        const h = function (a, b) { return H(-org + (ix + a) * cell, -org + (iz + b) * cell) - (inn ? 0 : 0.15); };
        return u + v <= 1 ? h(0, 0) + u * (h(1, 0) - h(0, 0)) + v * (h(0, 1) - h(0, 0)) : h(1, 1) + (1 - u) * (h(0, 1) - h(1, 1)) + (1 - v) * (h(1, 0) - h(1, 1)); };
      const dc = [];
      for (let i = 0; i < n; i++) { dc.push(dH(P[i][0], P[i][1])); ys.push(dc[i] + 0.12); }
      for (let i = 0; i < n; i++) { let a = 0, m = 0; for (let k = -3; k <= 3; k++) { const j = i + k; if (j >= 0 && j < n) { a += ys[j]; m++; } } ys[i] = Math.max(dc[i] + 0.06, Math.min(dc[i] + 0.22, a / m)); }
      for (let i = 0; i < n; i++) {
        const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], tx0 = b[0] - a[0], tz0 = b[1] - a[1], L0 = Math.hypot(tx0, tz0) || 1, nx = -tz0 / L0, nz = tx0 / L0, w = (c.w0 + (c.w1 - c.w0) * i / (n - 1)) / 2 * 1.3;
        if (i > 0) along += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
        const lx = P[i][0] + nx * w, lz = P[i][1] + nz * w, rx = P[i][0] - nx * w, rz = P[i][1] - nz * w; /* where a bank is lower than the water, the edge follows the ground instead of floating */
        pos.set([lx, Math.min(ys[i], dH(lx, lz) + 0.05), lz, rx, Math.min(ys[i], dH(rx, rz) + 0.05), rz], i * 6); uv.set([0, along / 4, 1, along / 4], i * 4);
        if (i < n - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
      }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
      const m = new T.Mesh(geo, cmat); m.material.side = T.DoubleSide; g.add(m);
      /* little white riffles where the water runs over stones */
      for (let i = 6; i < n - 4; i += 9) { const st1 = new T.Mesh(LP.sph, C.emat('#9a9a8a', '#1a1a18')); st1.scale.set(0.35, 0.18, 0.3); st1.position.set(P[i][0] + Math.sin(i) * 0.5, ys[i] - 0.05, P[i][1] + Math.cos(i) * 0.4); g.add(st1); }
    }); }
  /* trees: forest in the north-east, a few scattered */
  const trunkM = C.emat('#6a4a2a', '#1a0e05'), leafM = [C.emat('#3f8a3a', '#0a1a08'), C.emat('#4f9a3a', '#0a1a08'), C.emat('#2f7a3a', '#081808')];
  const tree = function (x, z, s, oak) {
    const y = H(x, z), t1 = new T.Mesh(G.cyl, trunkM); t1.scale.set(0.35 * s, 3 * s, 0.35 * s); t1.position.set(x, y + 1.5 * s, z); g.add(t1);
    const c = new T.Mesh(oak ? G.sph : G.cone, leafM[Math.floor(Math.abs(x * 7 + z * 3)) % 3]); if (oak) { c.scale.set(2.6 * s, 2.2 * s, 2.6 * s); c.position.set(x, y + 4.2 * s, z); } else { c.scale.set(1.8 * s, 2.6 * s, 1.8 * s); c.position.set(x, y + 4.6 * s, z); } g.add(c);
    W.colliders.push({ x: x, z: z, r: 0.6 * s + 0.3, cr: (oak ? 2.6 : 1.9) * s, bot: y + (oak ? 2.0 : 3.3) * s, m: c }); W.anim.push({ m: c, ph: x + z, sway: true });
  };
  /* MANY KINDS OF TREES (Pennsylvania natives): each has its own shape, bark and leaf color */
  const crownM = {}, cm = function (col) { return crownM[col] || (crownM[col] = C.emat(col, '#0a1406')); };
  const treeK = function (x, z, s, kind) {
    const y = H(x, z), cr = new T.Group(); let tc = '#7a3a2a', th = 3, tw = 0.32, crownR = 2, crownBot = 3;
    if (kind === 'pine') { tc = '#9a4a32'; th = 4.2; tw = 0.3; [[0, 2.1, 1.7], [1.3, 1.7, 1.5], [2.5, 1.3, 1.2], [3.5, 0.85, 0.9]].forEach(function (t2, k) { const c = new T.Mesh(G.cone, cm(['#2f6a3a', '#3a7a40', '#2a6236', '#44844a'][k])); c.scale.set(t2[1] * s, t2[2] * s * 0.8, t2[1] * s); c.position.y = (3.2 + t2[0]) * s; cr.add(c); }); crownR = 2.1; crownBot = 2.4; }
    else if (kind === 'spruce') { tc = '#5a3a2a'; th = 3; tw = 0.26; const c = new T.Mesh(G.cone, cm('#1f4a34')); c.scale.set(1.3 * s, 3.6 * s, 1.3 * s); c.position.y = 4.6 * s; cr.add(c); crownR = 1.4; crownBot = 1.2; }
    else if (kind === 'hemlock') { tc = '#6a4030'; th = 3; tw = 0.3; [[0, 2, 1.4], [1.6, 1.5, 1.2], [2.8, 0.9, 1]].forEach(function (t2) { const c = new T.Mesh(G.cone, cm('#2a5a46')); c.scale.set(t2[1] * s, t2[2] * s, t2[1] * s); c.position.y = (2.6 + t2[0]) * s; c.rotation.z = 0.12; cr.add(c); }); crownR = 2; crownBot = 1.4; }
    else if (kind === 'oak') { tc = '#5a4030'; th = 3.2; tw = 0.42; [[0, 4.3, 0, 2.4], [-1.4, 3.8, 0.6, 1.6], [1.4, 3.9, -0.5, 1.7]].forEach(function (b, k) { const c = new T.Mesh(G.sph, cm(['#4a7a32', '#5a8a3a', '#3f7030'][k])); c.scale.set(b[3] * s, b[3] * 0.8 * s, b[3] * s); c.position.set(b[0] * s, b[1] * s, b[2] * s); cr.add(c); }); crownR = 2.6; crownBot = 2.4; }
    else if (kind === 'maple' || kind === 'redmaple' || kind === 'hickory') { tc = '#6a5040'; th = 3; tw = 0.34; const cols = kind === 'redmaple' ? ['#c4462c', '#e0703a', '#b83a2a'] : kind === 'hickory' ? ['#e0b03a', '#ecc44a', '#d09a2a'] : ['#6ab040', '#7ac04a', '#5aa03a'];
      [[0, 4.6, 0, 2], [-1, 4, 0.5, 1.4], [1, 4.1, -0.4, 1.4], [0, 5.6, 0, 1.3]].forEach(function (b, k) { const c = new T.Mesh(G.sph, cm(cols[k % 3])); c.scale.set(b[3] * s, b[3] * 0.9 * s, b[3] * s); c.position.set(b[0] * s, b[1] * s, b[2] * s); cr.add(c); }); crownR = 2.2; crownBot = 2.8; }
    else if (kind === 'willow') { tc = '#5a4a32'; th = 2.6; tw = 0.4; const c = new T.Mesh(G.sph, cm('#8aba5a')); c.scale.set(2.4 * s, 2.0 * s, 2.4 * s); c.position.y = 3.8 * s; cr.add(c);
      for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2, st0 = new T.Mesh(G.box, cm(k % 2 ? '#9aca6a' : '#7aaa4a')); st0.scale.set(0.7 * s, 2.8 * s, 0.14 * s); st0.position.set(Math.cos(a) * 2.0 * s, 2.6 * s, Math.sin(a) * 2.0 * s); st0.rotation.y = -a; cr.add(st0); } crownR = 2.8; crownBot = 1.3; }
    else if (kind === 'sycamore') { tc = '#e4dccb'; th = 3.6; tw = 0.38; [[0, 4.8, 0, 2.3], [-1.5, 4.2, 0.4, 1.6], [1.4, 4.4, -0.3, 1.7]].forEach(function (b, k) { const c = new T.Mesh(G.sph, cm(['#7ab04a', '#6aa040', '#8ac05a'][k])); c.scale.set(b[3] * s, b[3] * 0.75 * s, b[3] * s); c.position.set(b[0] * s, b[1] * s, b[2] * s); cr.add(c); }); crownR = 2.6; crownBot = 3; }
    else if (kind === 'dogwood') { tc = '#6a4a3a'; th = 1.6; tw = 0.2; const c = new T.Mesh(G.sph, cm('#4f8a3a')); c.scale.set(1.6 * s, 0.9 * s, 1.6 * s); c.position.y = 2.2 * s; cr.add(c);
      for (let k = 0; k < 14; k++) { const a = k * 2.4, bl = new T.Mesh(LP.sph, cm(k % 3 ? '#fff6f0' : '#ffc8d8')); bl.scale.setScalar(0.18 * s); bl.position.set(Math.cos(a) * 1.3 * s, (2.2 + Math.sin(k * 1.7) * 0.6) * s, Math.sin(a) * 1.3 * s); cr.add(bl); } crownR = 1.6; crownBot = 1.4; }
    const t1 = new T.Mesh(G.cyl, cm(tc)); t1.scale.set(tw * s, th * s, tw * s); t1.position.set(x, y + th * s / 2, z); g.add(t1);
    if (kind === 'sycamore') for (let k = 0; k < 4; k++) { const pt = new T.Mesh(G.box, cm('#9a9a7a')); pt.scale.set(0.2 * s, 0.35 * s, 0.05); pt.position.set(x + Math.cos(k * 1.6) * tw * s * 0.95, y + (0.6 + k * 0.6) * s, z + Math.sin(k * 1.6) * tw * s * 0.95); pt.rotation.y = -k * 1.6 + Math.PI / 2; g.add(pt); }
    cr.position.set(x, y, z); cr.rotation.y = x * 0.37; g.add(cr);
    W.colliders.push({ x: x, z: z, r: tw * s + 0.35, cr: crownR * s, bot: y + crownBot * s, m: cr });
    for (let k = 0; k < 2; k++) { const a = x * 1.7 + k * 2.6; (W.perches = W.perches || []).push([x + Math.cos(a) * crownR * s * 0.85, y + crownBot * s + 0.35, z + Math.sin(a) * crownR * s * 0.85, kind]); } W.anim.push({ m: cr, ph: x + z, sway: true });
  };
  const FOREST = ['pine', 'oak', 'maple', 'hemlock', 'pine', 'spruce', 'redmaple', 'oak', 'pine', 'hickory', 'maple'];
  for (let i = 0; i < 70; i++) { const x = 24 + (i * 37 % 44), z = 16 + (i * 53 % 46); if (Math.hypot(x - HOLLOW.x, z - HOLLOW.z) < 11 || Math.hypot(x - 30, z - 28) < 4 || Math.hypot(x - 34, z - 44) < 4) continue; treeK(x + Math.sin(i) * 1.5, z + Math.cos(i * 1.3) * 1.5, 0.85 + (i % 4) * 0.13, FOREST[i % FOREST.length]); }
  [[-60, 10, 'oak'], [-45, 40, 'maple'], [-5, 55, 'redmaple'], [25, -20, 'pine'], [-30, -55, 'hemlock'], [55, -10, 'spruce'], [-62, -10, 'pine'], [10, 62, 'oak'], [-50, 58, 'maple'],
   [-24, -62, 'hemlock'], [-33, -58, 'hemlock'], [-21, -54, 'hemlock'], [-38, -50, 'spruce'],
   [-39, -37, 'sycamore'], [-41, -20, 'sycamore'], [-31, -6, 'sycamore'], [-35, 6, 'redmaple'],
   [-36, 28, 'willow'], [-7, 33, 'willow'], [-34, 12, 'willow'],
   [-12, 46, 'dogwood'], [22, 52, 'dogwood'], [-22, 4, 'dogwood'], [30, -14, 'dogwood'], [-14, -10, 'dogwood'],
   [52, 8, 'hickory'], [46, -24, 'pine'], [-46, -2, 'hickory'], [2, 50, 'hickory'], [56, -32, 'spruce'], [24, -48, 'oak'], [-8, -40, 'redmaple'], [8, -52, 'pine'], [-52, 26, 'oak'], [-56, -54, 'maple']
  ].forEach(function (p, i) { treeK(p[0], p[1], 1 + (i % 3) * 0.15, p[2]); });
  /* shrubs and ferns: blueberry bushes, spicebush, ferns on the forest floor */
  { const sh = [], shc = [], fr = []; for (let i = 0; i < 90; i++) { const a = rnd(i + 5000) * 6.283, r2 = 8 + Math.sqrt(rnd(i + 5100)) * 52, x = Math.cos(a) * r2, z = Math.sin(a) * r2; if (Math.hypot(x - POND.x, z - POND.z) < 17 || pathDist(x, z) < 2 || Math.hypot(x - STATION.x, z - STATION.z) < 10 || (Math.abs(x - FARM.x) < 13 && Math.abs(z - FARM.z) < 11) || streamDist(x, z) < 2.5) continue;
      const s2 = 0.6 + rnd(i + 5200) * 0.5; sh.push([x, H(x, z) + 0.45 * s2, z, 1.1 * s2, 0.8 * s2, 1.1 * s2, i]); shc.push(['#3f7a34', '#4a8a3c', '#5a7a2a', '#6a8a3a'][i % 4]); }
    for (let i = 0; i < 120; i++) { const x = 24 + rnd(i + 6000) * 42, z = 16 + rnd(i + 6100) * 44; if (Math.hypot(x, z) > EDGE) continue; fr.push([x, H(x, z) + 0.25, z, 0.5, 0.35, 0.5, i]); }
    g.add(inst(GX.bush, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#081206', vertexColors: true }), sh, shc)); g.add(inst(GX.fern, new T.MeshLambertMaterial({ vertexColors: true }), fr.map(function (q) { return [q[0], q[1] - 0.2, q[2], 1.1, 1.3, 1.1, q[6]]; }))); }
  tree(18, -14, 1.3, true); /* the oak by the station */
  /* rocks on the hill and the ring around the hidden hollow (with a gap hidden behind bushes) */
  const rockM = C.emat('#8a8a80', '#1a1a18');
  const rockVM = new T.MeshLambertMaterial({ vertexColors: true });
  const rock = function (x, z, s) { const m = new T.Mesh(GX.rocks[Math.abs(Math.round(x * 7 + z * 3)) % GX.rocks.length], rockVM); m.scale.set(s * 1.05, s * 0.85, s); m.position.set(x, H(x, z) + s * 0.3, z); m.rotation.y = x; g.add(m); const c = { x: x, z: z, r: s * 0.95, top: H(x, z) + s * 1.05 }; W.colliders.push(c); W.tops.push(c); };
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
    if (edgeW(x, z).w > 0.02) { x = 0; z = -400; }
    const y = H(x, z), s2 = 1.1 + (i % 5) * 0.25;
    const leafy = i % 3 === 1; dm0.position.set(x, y + (leafy ? 4.0 : 4.6) * s2, z); if (leafy) dm0.scale.set(2.2 * s2, 2.0 * s2, 2.2 * s2); else dm0.scale.set(1.9 * s2, 2.8 * s2, 1.9 * s2); dm0.rotation.y = i; dm0.updateMatrix(); cone.setMatrixAt(i, dm0.matrix);
    tc.set(leafy ? ['#5a9a3a', '#6aaa44', '#c4602c', '#4a8a34', '#d8a03a'][i % 5] : ['#2f6a32', '#3a7a3a', '#2a5a30', '#2a6236'][i % 4]).offsetHSL(0, 0, (Math.sin(i * 1.7) * 0.04)); cone.setColorAt(i, tc);
    dm0.position.set(x, y + 1.5 * s2, z); dm0.scale.set(0.35 * s2, 3 * s2, 0.35 * s2); dm0.updateMatrix(); trunk.setMatrixAt(i, dm0.matrix); if (Math.hypot(x, z) < BOUND + 10) W.colliders.push({ x: x, z: z, r: 0.35 * s2 + 0.4, cr: 1.9 * s2, bot: y + 3.2 * s2, inst: i, mat: cone.instanceMatrix.array.slice(i * 16, i * 16 + 16) });
  }
  /* swap the leafy ones to round crowns */
  { const sphI = new T.InstancedMesh(LP.sph10, new T.MeshLambertMaterial({ color: '#ffffff' }), ringN), m4 = new T.Matrix4(), zero = new T.Matrix4().makeScale(0, 0, 0), cc2 = new T.Color();
    for (let i = 0; i < ringN; i++) { cone.getMatrixAt(i, m4); cone.getColorAt(i, cc2); if (i % 3 === 1) { sphI.setMatrixAt(i, m4); sphI.setColorAt(i, cc2); cone.setMatrixAt(i, zero); } else sphI.setMatrixAt(i, zero); }
    g.add(sphI); W.ringSph = sphI; }
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
  W.wfTex = new T.CanvasTexture(cv); W.wfTex.wrapS = W.wfTex.wrapT = T.RepeatWrapping; W.wfTex.repeat.set(1, 2); /* (kept for the scroll line; both falls now share fallTex) */
  { let zt = -70, best = -1e9; for (let z = -74; z < -62; z += 0.25) { const h = H(SPRING.x, z); if (h > best) { best = h; zt = z; } } /* the top of the little cliff */
    const sh = waterfallSheet([SPRING.x, best + 0.15, zt], [0, 1], 2.0, 3.0, H(SPRING.x, SPRING.z) + 0.4);
    const wf = new T.Mesh(sh.geo, new T.MeshBasicMaterial({ map: fallTex(), transparent: true, opacity: 0.9, side: T.DoubleSide, depthWrite: false })); g.add(wf);
    const src = new T.Mesh(new T.CircleGeometry(1.3, 20), new T.MeshLambertMaterial({ color: '#4a9ad0', emissive: '#0a2a40', transparent: true, opacity: 0.85 })); src.rotation.x = -Math.PI / 2; src.position.set(SPRING.x, best + 0.17, zt - 0.9); g.add(src); /* the spring bubbles up in a little basin at the top */ }
  const pool = new T.Mesh(new T.CircleGeometry(3.4, 32), new T.MeshLambertMaterial({ color: '#4a9ad0', transparent: true, opacity: 0.55, emissive: '#0a2a40', depthWrite: false })); pool.rotation.x = -Math.PI / 2; pool.position.set(SPRING.x, H(SPRING.x, SPRING.z) + 0.45, SPRING.z); g.add(pool);
  W.mist = []; for (let i = 0; i < 6; i++) { const m = C.glow('#ffffff', 2.5, 0.35); m.position.set(SPRING.x + (i - 2.5) * 0.6, wfBot + 0.6, -61.2); g.add(m); W.mist.push({ m: m, y: m.position.y, ph: i }); }
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + 0.3, rr = 4.2 + (i % 2), x = SPRING.x + Math.cos(a) * rr, z = SPRING.z + Math.sin(a) * rr * 0.6 - 1.5; if (z < -63) continue; rock(x, z, 0.6 + (i % 3) * 0.25); }
  [[-34, -66, 2.2], [-22, -66, 2], [-31, -70, 2.6], [-25, -70.5, 2.4]].forEach(function (r) { rock(r[0], r[1], r[2]); });
  /* lichen-covered boulder near the hill */
  rock(34, -36, 2.2);   const lc = [], lcc = []; for (let i = 0; i < 9; i++) { const a = i * 0.9; lc.push([34 + Math.cos(a) * 1.75, H(34, -36) + 1.1 + Math.sin(i * 2.1) * 0.6, -36 + Math.sin(a) * 1.75, 0.5, 0.14, 0.5, a]); lcc.push(i % 3 ? '#c8d070' : '#e0a040'); }
  g.add(inst(G.sph, new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#2a3008' }), lc, lcc));
  /* owl on a big oak in the forest, with pellets below */
  tree(34, 44, 1.5, true); W.owl = new T.Group(); W.owlM = BQ.creatures.makeOwl(); W.owl.add(W.owlM.g); /* barred owl (fauna.js) */
  const branch = new T.Mesh(G.cyl, trunkM); branch.scale.set(0.12, 1.4, 0.12); branch.rotation.z = Math.PI / 2; branch.position.set(34.6, H(34, 44) + 4.0, 44.9); g.add(branch);
  W.owl.position.set(34.6, H(34, 44) + 4.1, 45.0); g.add(W.owl);
  for (let i = 0; i < 3; i++) { const pe = new T.Mesh(G.sph, C.emat('#7a6a5a', '#1a1410')); pe.scale.set(0.22, 0.15, 0.32); pe.position.set(35.4 + i * 0.4, H(35.4, 46) + 0.12, 46 + (i % 2) * 0.3); g.add(pe); }
  /* milkweed with monarch butterflies; more butterflies in the meadow */
  const mw = C.emat('#7aa05a', '#14200a'), mwf = C.emat('#e8a0c8', '#3a1a2a'); for (let i = 0; i < 5; i++) { const x = 16 + (i % 3) * 0.9, z = 38 + Math.floor(i / 3) * 0.9, y = H(x, z); const st0 = new T.Mesh(G.cyl, mw); st0.scale.set(0.06, 1.2, 0.06); st0.position.set(x, y + 0.6, z); g.add(st0); const fl0 = new T.Mesh(G.sph, mwf); fl0.scale.set(0.3, 0.2, 0.3); fl0.position.set(x, y + 1.25, z); g.add(fl0); }
  W.flies = []; /* butterflies now come from creatures.js (real wing shapes and patterns) */
  /* cattails, lily pads, and dragonflies at the pond */
  const ctS = C.emat('#6a8a3a', '#10200a'), ctH = C.emat('#6a4a2a', '#140a04');
  const cts = [], cth = []; for (let i = 0; i < 26; i++) { const a = 2.2 + (i / 26) * 2.2, rr = 15.3 + (i % 3) * 0.5, x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr, y = H(x, z); cts.push([x, y + 0.9, z, 0.05, 1.8, 0.05]); cth.push([x, y + 1.7, z, 0.12, 0.4, 0.12]); }
  g.add(inst(LP.cyl, ctS, cts)); W.cattailTops = cts.map(function (c) { return [c[0], c[1] + 1.05, c[2]]; }); g.add(inst(LP.cyl, ctH, cth));
  const padM = C.emat('#4a9a3a', '#0a2008'), lotus = C.emat('#ffb0d0', '#4a1a2a'), pads = [], lots = [], padG = new T.CylinderGeometry(0.8, 0.8, 0.04, 14, 1, false, 0.3, 5.8);
  for (let i = 0; i < 12; i++) { const a = i * 2.1, rr = 4 + (i * 5 % 9), x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr; pads.push([x, WL0 + 0.05, z, 1, 1, 1, i]); if (i % 3 === 0) lots.push([x, WL0 + 0.2, z, 0.25, 0.18, 0.25]); }
  W.padIM = inst(padG, padM, pads); g.add(W.padIM); g.add(inst(G.sph, lotus, lots));
  W.dflies = []; for (let i = 0; i < 3; i++) { const d0 = BQ.creatures.makeDragonfly(); d0.g.scale.setScalar(1.3); g.add(d0.g); W.dflies.push({ d: d0, m: d0.g, ph: i * 2.1, x: -31 + i, z: 31, y: WL0 + 1, tx: -31, tz: 31, ty: WL0 + 1, t: i * 0.7, yaw: 0 }); } /* green darners (fauna.js) */
  /* anthill near the station with a trail of ants */
  const ah = new T.Mesh(G.cone, C.emat('#9a6a3a', '#2a1a08')); ah.scale.set(1.2, 0.7, 1.2); ah.position.set(14, H(14, 4) + 0.35, 4); g.add(ah); W.colliders.push({ x: 14, z: 4, r: 1 });
  W.ants = new T.InstancedMesh(antGeo(), new T.MeshLambertMaterial({ vertexColors: true }), 24); g.add(W.ants); /* real ant shapes: head, thorax, a round abdomen and six legs */
  /* compost pile with earthworms by the farm */
  const cp = new T.Mesh(G.sph, C.emat('#4a3020', '#100804')); cp.scale.set(1.8, 0.8, 1.4); cp.position.set(-50, H(-50, -27) + 0.2, -27); g.add(cp); W.colliders.push({ x: -50, z: -27, r: 1.6 });
  for (let i = 0; i < 6; i++) { const lf = new T.Mesh(G.box, C.emat(['#c08a3a', '#a06a2a', '#d0a04a'][i % 3], '#2a1a08')); lf.scale.set(0.5, 0.04, 0.3); lf.rotation.y = i; lf.position.set(-50 + Math.cos(i) * 1.1, H(-50, -27) + 0.85, -27 + Math.sin(i) * 0.8); g.add(lf); }
  W.worms = []; for (let i = 0; i < 4; i++) { const w = new T.Mesh(G.cyl, C.emat('#e08a8a', '#4a1a1a')); w.scale.set(0.06, 0.35, 0.06); w.position.set(-50.6 + i * 0.4, H(-50, -27) + 0.85, -26.6 + (i % 2) * 0.3); g.add(w); W.worms.push({ m: w, ph: i }); }
  /* a deer grazing at the orchard edge */
  W.deerM = BQ.creatures.makeDeer(); W.deer = W.deerM.g; /* white-tailed deer (fauna.js) */
  W.dr = { x: -30, z: 50, tx: -30, tz: 50, t: 2, walk: 0 }; W.deer.position.set(-30, H(-30, 50), 50); W.deer.rotation.y = 2.4; g.add(W.deer);
  /* meadow flowers and clover (instanced so they are cheap to draw) */
  const FN = S0low() ? 400 : 900, fl = new T.InstancedMesh(GX.petals, new T.MeshLambertMaterial({ color: '#ffffff', side: T.DoubleSide }), FN), flc = new T.InstancedMesh(GX.center, C.emat('#ffd040', '#3a2a00'), FN), dm = new T.Object3D(), fcol = ['#ff8fb1', '#ffd166', '#ffffff', '#c59cff', '#ff9f6e', '#7fd4ff'], stems = new T.InstancedMesh(LP.cyl, C.emat('#4a8a2a', '#0a1a08'), FN);
  for (let i = 0; i < FN; i++) { let x, z; if (i < 160) { x = -6 + rnd(i) * 30; z = 34 + rnd(i + 999) * 22; } else { const a = rnd(i) * 6.2832, r2 = 6 + Math.sqrt(rnd(i + 500)) * 56; x = Math.cos(a) * r2; z = Math.sin(a) * r2; }
    const bad = Math.hypot(x - POND.x, z - POND.z) < 16.5 || (Math.abs(x - FARM.x) < 12 && Math.abs(z - FARM.z) < 10) || (x > 22 && z > 14) || pathDist(x, z) < 1.4 || Math.hypot(x - STATION.x, z - STATION.z) < 9 || streamDist(x, z) < 2.4 || Math.hypot(x, z) > EDGE + 3;
    const fs = bad ? 0.0001 : (0.15 + (i % 3) * 0.03) * 0.75; dm.position.set(x, H(x, z) + 0.34, z); dm.rotation.set(0.25 * Math.sin(i), i, 0.25 * Math.cos(i)); dm.scale.set(fs, fs, fs); dm.updateMatrix(); fl.setMatrixAt(i, dm.matrix); flc.setMatrixAt(i, dm.matrix); fl.setColorAt(i, new T.Color(fcol[(i * 7) % 6])); dm.rotation.set(0, 0, 0);
    dm.position.set(x, H(x, z) + 0.15, z); dm.scale.set(bad ? 0.0001 : 0.025, bad ? 0.0001 : 0.32, bad ? 0.0001 : 0.025); dm.updateMatrix(); stems.setMatrixAt(i, dm.matrix); }
  g.add(stems);
  g.add(fl); g.add(flc);
  const GN = S0low() ? 600 : 1500, gr = new T.InstancedMesh(GX.tuft, windy(new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#0a1a08' })), GN), gc = new T.Color();
  for (let i = 0; i < GN; i++) { const a = rnd(i + 3000) * 6.2832, r2 = Math.sqrt(rnd(i + 7000)) * 80, x = Math.cos(a) * r2, z = Math.sin(a) * r2; if (Math.hypot(x - POND.x, z - POND.z) < 17 || (x > 22 && z > 14 && r2 < EDGE) || pathDist(x, z) < 1.3 || (Math.abs(x - FARM.x) < 12 && Math.abs(z - FARM.z) < 10)) { dm.scale.setScalar(0.0001); } else dm.scale.set(0.75, 0.45 + (i % 4) * 0.1, 0.75); dm.rotation.set(0, i, 0);
    gc.set(['#5aa03a', '#6ab04a', '#4a9030'][i % 3]); gr.setColorAt(i, gc); dm.position.set(x, H(x, z) + 0.3, z); dm.updateMatrix(); gr.setMatrixAt(i, dm.matrix); }
  dm.rotation.set(0, 0, 0);
  g.add(gr); W.grassIM = gr;
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
  W.frogM = BQ.creatures.makeFrog(); W.frog = W.frogM.g; W.frog.scale.setScalar(1.4); W.frog.rotation.y = 2.2; W.frog.position.set(-8, H(-8, 30), 30); g.add(W.frog); /* green frog (fauna.js) */
  W.rabM = BQ.creatures.makeRabbit(); W.rabbit = W.rabM.g; W.rabbit.scale.setScalar(1.15); W.rabbit.position.set(4, H(4, 40), 40); g.add(W.rabbit); W.rab = { x: 4, z: 40, tx: 6, tz: 42, t: 0 };
  /* animals are solid too: the deer's body is two circles (chest and hips) that turn with it; small animals get a small circle */
  W.movers = [{ r: 0.55, at: function () { const a = W.deer.rotation.y; return [W.dr.x + Math.sin(a) * 0.5, W.dr.z + Math.cos(a) * 0.5]; }, top: 1.7 },
    { r: 0.55, at: function () { const a = W.deer.rotation.y; return [W.dr.x - Math.sin(a) * 0.5, W.dr.z - Math.cos(a) * 0.5]; }, top: 1.7 },
    { r: 0.3, at: function () { return [W.rabbit.position.x, W.rabbit.position.z]; }, top: 0.6 },
    { r: 0.28, at: function () { return [W.frog.position.x, W.frog.position.z]; }, top: 0.5 }];
  W.hawk = new T.Group(); g.add(W.hawk); /* the red-tailed hawk now comes from creatures.js */
  W.bees = []; for (let i = 0; i < 4; i++) { const b = BQ.creatures.makeBee(); b.g.scale.setScalar(1.3); g.add(b.g); W.bees.push({ b: b, m: b.g, ph: i * 1.7 }); } /* bumblebees (fauna.js) */
  W.fish = new T.Group(); W.fishM = []; ['pumpkinseed', 'pumpkinseed', 'pumpkinseed', 'bass', 'carp', 'catfish', 'pike', 'pumpkinseed'].forEach(function (k, i) { const fm = BQ.creatures.makeFish(k), f = fm.g; f.scale.setScalar(k === 'pike' || k === 'carp' || k === 'catfish' ? 1.7 : 2.2); f.userData.ph = i; W.fish.add(f); W.fishM.push(fm); fm.x = POND.x + Math.cos(i) * 6; fm.z = POND.z + Math.sin(i) * 6; fm.y = null; fm.yaw = i; fm.t = 0; fm.spd = 0.6; }); /* pond fish (fauna.js): sunfish, bass, carp, catfish and pike */ W.fish.visible = false; g.add(W.fish);
  /* the people of Willow Creek: a field biologist, a local kid who fishes, a farmer, and a park ranger (all human) */
  const npc = function (id, x, z, look, sc) { sc = sc || 1; const m = buildHuman(look); m.position.set(x, H(x, z), z); m.scale.setScalar(sc); g.add(m); const tag = C.label(npcName(id), 2.6, { bd: '#ffd166' }); tag.scale.multiplyScalar(0.7); tag.position.set(x, H(x, z) + 2.75 * sc + 0.2, z); g.add(tag);
    const mk = C.glow('#ffd166', 1.4, 0.9); mk.position.set(x, H(x, z) + 2.75 * sc + 0.9, z); g.add(mk); W.npcs.push({ id: id, x: x, z: z, m: m, tag: tag, mark: mk }); W.colliders.push({ x: x, z: z, r: 0.7 }); };
  npc('ama', STATION.x + 2, STATION.z + 1.5, { skin: '#8a5a3c', hair: '#1a1210', hairStyle: 'bun', shirt: '#ece4cc', vest: '#9a8a52', pants: '#4a5a6a', hat: 'field', hatCol: '#c8b88a', prop: 'clipboard' });
  npc('pip', -8, 8, { skin: '#e8b890', hair: '#6a3a1a', hairStyle: 'short', shirt: '#3a8ad0', pants: '#3a4a7a', hat: 'cap', hatCol: '#d04a3a', prop: 'rod', shoes: '#e8e8e8' }, 0.78);
  npc('lu', FARM.x + 6, FARM.z + 9, { skin: '#c89070', hair: '#a8a8a8', hairStyle: 'long', shirt: '#b84a3a', pants: '#3a5a8a', bib: true, hat: 'straw' });
  npc('sam', 7, 55.5, { skin: '#f0c8a8', hair: '#c8783a', hairStyle: 'curly', shirt: '#9aa06a', pants: '#5a4a3a', hat: 'ranger', hatCol: '#5a6a3a', prop: 'binoculars' });
  /* animals you can listen to: a heron on the pond shore and fish hiding in the cold spring */
  W.heronM = BQ.creatures.makeHeron(); W.heron = W.heronM.g; W.heron.scale.setScalar(1.15); W.heronStrike = 0; W.heronNext = 6; /* great blue heron (fauna.js) */
  W.heron.position.set(-6.5, H(-6.5, 18.5), 18.5); W.heron.rotation.y = -1.6; g.add(W.heron);
  W.springFish = []; W.springFishM = []; for (let i = 0; i < 3; i++) { const fm = BQ.creatures.makeFish(i === 2 ? 'trout' : 'sunfish'), f = fm.g; f.scale.setScalar(i === 2 ? 1.4 : 1.6); g.add(f); W.springFish.push(f); W.springFishM.push(fm); } /* sunfish hiding in the cold spring (fauna.js) */
  W.beacon = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 30, 12, 1, true), new T.MeshBasicMaterial({ color: '#ffd166', transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false })); W.beacon.visible = false; g.add(W.beacon);
  /* night lights: fireflies over the meadow and pond edge, a porch lamp with a luna moth */
  W.ffly = []; for (let i = 0; i < (S0low() ? 18 : 40); i++) { const f = C.glow('#d8ff7a', 0.9, 0); f.userData = { cx: -6 + rnd(i + 13000) * 34, cz: 24 + rnd(i + 13100) * 26, ph: rnd(i + 13200) * 6.28 }; g.add(f); W.ffly.push(f); }
  W.porch = C.glow('#ffd88a', 4, 0); W.porch.position.set(STATION.x, H(STATION.x, STATION.z) + 2.6, STATION.z - 1.3); g.add(W.porch);
  W.moth = new T.Group(); [-1, 1].forEach(function (sd) { const w = new T.Mesh(G.box, C.emat('#9ae08a', '#2a4a1a')); w.scale.set(0.34, 0.02, 0.3); w.position.x = sd * 0.18; W.moth.add(w); }); W.moth.visible = false; g.add(W.moth);
  /* sunbeams slanting through the forest canopy, and pollen drifting over the meadow */
  { const rc = document.createElement('canvas'); rc.width = 16; rc.height = 128; const rx = rc.getContext('2d'), grd = rx.createLinearGradient(0, 0, 0, 128); grd.addColorStop(0, 'rgba(255,240,200,0)'); grd.addColorStop(0.3, 'rgba(255,240,200,0.5)'); grd.addColorStop(1, 'rgba(255,240,200,0)'); rx.fillStyle = grd; rx.fillRect(0, 0, 16, 128);
    const rt = new T.CanvasTexture(rc); W.beams = []; for (let i = 0; i < 10; i++) { const m = new T.Mesh(new T.PlaneGeometry(2.2, 16), new T.MeshBasicMaterial({ map: rt, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false, opacity: 0 })); const x = 28 + (i * 13 % 34), z = 20 + (i * 7 % 30);
      m.position.set(x, H(x, z) + 7, z); m.rotation.set(0, i * 0.7, 0.45); g.add(m); W.beams.push({ m: m, ph: i }); } }
  { const n = 160, pp = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const x = -20 + rnd(i + 14000) * 50, z = 20 + rnd(i + 14100) * 40; pp[i * 3] = x; pp[i * 3 + 1] = H(x, z) + 0.5 + rnd(i + 14200) * 3; pp[i * 3 + 2] = z; }
    const pg2 = new T.BufferGeometry(); pg2.setAttribute('position', new T.BufferAttribute(pp, 3)); W.pollen = new T.Points(pg2, new T.PointsMaterial({ color: '#fff4c0', size: 0.09, transparent: true, opacity: 0.7, depthWrite: false })); g.add(W.pollen); }
  /* the ranger campsite: a fire ring, log benches and a tent, near the valley lookout */
  { const fx = 16.5, fz = 53.5, fy = H(fx, fz); W.fire = { x: fx, z: fz, lit: !!st().f.fire };
    const st0 = []; for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; st0.push([fx + Math.cos(a) * 0.95, fy + 0.15, fz + Math.sin(a) * 0.95, 0.28, 0.22, 0.28, a]); } g.add(inst(G.ico, C.emat('#8a8a80', '#1a1a18'), st0));
    for (let k = 0; k < 3; k++) { const lg = new T.Mesh(G.cyl, C.emat('#6a4a2a', '#140a04')); lg.scale.set(0.12, 1.1, 0.12); lg.rotation.z = Math.PI / 2; lg.rotation.y = k * 2.1; lg.position.set(fx, fy + 0.2, fz); g.add(lg); }
    W.flames = new T.Group(); [['#ff7a2a', 0.45, 1.1], ['#ffb03a', 0.32, 0.85], ['#ffe08a', 0.18, 0.6]].forEach(function (f0, k) { const c0 = new T.Mesh(G.cone, C.basic(f0[0])); c0.scale.set(f0[1], f0[2] / 2, f0[1]); c0.position.y = 0.3 + f0[2] / 4; W.flames.add(c0); });
    const fg = C.glow('#ffa040', 7, 0.8); fg.position.y = 0.8; W.flames.add(fg); W.flames.position.set(fx, fy, fz); W.flames.visible = W.fire.lit; g.add(W.flames);
    /* smoke puffs that drift up and spread, and sparks that pop out now and then */
    W.smoke = []; for (let k = 0; k < 9; k++) { const m = C.glow(k % 2 ? '#8a8680' : '#a09c94', 1.2, 0.0); m.material.blending = T.NormalBlending; m.material.depthWrite = false; m.position.set(fx, fy + 1, fz); g.add(m); W.smoke.push({ m: m, t: k / 9 * 4.5, ph: k * 1.3 }); }
    W.sparks = []; for (let k = 0; k < 16; k++) { const m = C.glow(k % 3 ? '#ffd166' : '#ff8a3a', 0.22, 0); m.visible = false; g.add(m); W.sparks.push({ m: m, life: 0 }); } W.sparkT = 1;
    W.benches = [[fx - 2.4, fz, Math.PI / 2], [fx + 2.4, fz, -Math.PI / 2], [fx, fz - 2.4, 0]].map(function (b) { const m = new T.Mesh(G.cyl, C.emat('#7a5230', '#140a04')); m.scale.set(0.3, 2, 0.3); m.rotation.z = Math.PI / 2; m.rotation.y = b[2] + Math.PI / 2; m.position.set(b[0], H(b[0], b[1]) + 0.3, b[1]); g.add(m); return { x: b[0], z: b[1] }; });
    const tent = new T.Mesh(new T.ConeGeometry(1.8, 2.2, 4), C.emat('#4a8a5a', '#0a1a0a')); tent.rotation.y = Math.PI / 4; tent.position.set(fx + 3.5, H(fx + 3.5, fz + 3) + 1.1, fz + 3); g.add(tent); W.colliders.push({ x: fx + 3.5, z: fz + 3, r: 1.5 }, { x: fx, z: fz, r: 1.1 }); }
  /* survey posts: a wooden post with a clipboard sign */
  SVSITES.forEach(function (sv) { const y = H(sv.x, sv.z), po = new T.Mesh(G.cyl, C.emat('#8a6a3a', '#1a0e05')); po.scale.set(0.1, 1.4, 0.1); po.position.set(sv.x, y + 0.7, sv.z); g.add(po);
    const bd = new T.Mesh(G.box, C.emat('#f0e8d0', '#2a2418')); bd.scale.set(0.7, 0.5, 0.06); bd.position.set(sv.x, y + 1.45, sv.z); bd.rotation.y = Math.atan2(STATION.x - sv.x, STATION.z - sv.z); g.add(bd);
    const lb = C.label(sv.kind === 'kick' ? '🪣' : '📋', 1.2, { big: true, bd: '#7be0ad' }); lb.position.set(sv.x, y + 2.1, sv.z); g.add(lb); W.colliders.push({ x: sv.x, z: sv.z, r: 0.3 }); });
  W.listenFx = C.glow('#9fe8ff', 3.2, 0); W.listenFx.material.opacity = 0; g.add(W.listenFx);
  /* planting spots along the stream */
  const CP = CREEKS[0].pts.filter(function (q, k) { return k > 25 && Math.hypot(q[0] - POND.x, q[1] - POND.z) > 18.5; }); W.plants = []; for (let i = 0; i < 5; i++) { const q = CP[Math.floor((i + 0.5) / 5 * CP.length)], q2 = CP[Math.min(CP.length - 1, Math.floor((i + 0.5) / 5 * CP.length) + 1)], L0 = Math.hypot(q2[0] - q[0], q2[1] - q[1]) || 1;
    const x = q[0] - (q2[1] - q[1]) / L0 * 2.6, z = q[1] + (q2[0] - q[0]) / L0 * 2.6; const mk = C.glow('#7be0ad', 2.2, 0.0); mk.position.set(x, H(x, z) + 0.6, z); g.add(mk);
    const pl = new T.Group(); for (let k = 0; k < 4; k++) { const leaf = new T.Mesh(G.cone, C.emat('#5fbf5a', '#0a2008')); leaf.scale.set(0.25, 0.7, 0.25); leaf.position.set(Math.cos(k) * 0.4, 0.6, Math.sin(k) * 0.4); pl.add(leaf); } pl.position.set(x, H(x, z), z); pl.visible = false; g.add(pl);
    W.plants.push({ x: x, z: z, mk: mk, pl: pl, i: i }); }
  /* a little wooden dock on the east shore: the place to fill your sample jar */
  { const d0 = [-5.5, 15.2], d1 = [-10.4, 17.4], L0 = Math.hypot(d1[0] - d0[0], d1[1] - d0[1]), ang = Math.atan2(d1[1] - d0[1], d1[0] - d0[0]), top = WL0 + 0.45, plankM = C.emat('#b07a44', '#1a0e05'), postM = C.emat('#7a5230', '#140a04');
    for (let k = 0; k < 9; k++) { const u = (k + 0.5) / 9, x = d0[0] + (d1[0] - d0[0]) * u, z = d0[1] + (d1[1] - d0[1]) * u, pl = new T.Mesh(G.box, k % 2 ? plankM : postM === plankM ? plankM : plankM); pl.scale.set(L0 / 9 - 0.06, 0.12, 1.7); pl.position.set(x, top - 0.06, z); pl.rotation.y = -ang; g.add(pl); }
    [0, 0.5, 1].forEach(function (u) { [-1, 1].forEach(function (sd) { const x = d0[0] + (d1[0] - d0[0]) * u - Math.sin(ang) * sd * 0.8, z = d0[1] + (d1[1] - d0[1]) * u + Math.cos(ang) * sd * 0.8, po = new T.Mesh(G.cyl, postM); po.scale.set(0.12, top - H(x, z) + 0.5, 0.12); po.position.set(x, (top + H(x, z)) / 2 + 0.2, z); g.add(po); }); });
    for (let k = 0; k <= 4; k++) { const u = k / 4; W.tops.push({ x: d0[0] + (d1[0] - d0[0]) * u, z: d0[1] + (d1[1] - d0[1]) * u, r: 1.15, top: top }); } }
  /* UNDER THE POND: pondweed, mussels, snails, tadpoles, rocks, sun rays and floating specks */
  W.uw = new T.Group(); g.add(W.uw);
  { const blades = [], bc = []; for (let i = 0; i < 150; i++) { const a = rnd(i + 40) * 6.283, rr = 2 + Math.sqrt(rnd(i + 90)) * 11, x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr, y = H(x, z), hh = Math.min(WL0 - y - 0.6, 1.2 + rnd(i + 7) * 2.6); if (hh < 0.5) continue;
      blades.push([x, y + hh / 2, z, 0.09, hh, 0.04, rnd(i) * 3]); bc.push(['#3a8a4a', '#4a9a3a', '#2f7a44', '#5aa04a'][i % 4]); }
    W.weed = inst(new T.BoxGeometry(1, 1, 1), new T.MeshLambertMaterial({ color: '#ffffff', emissive: '#0a2010' }), blades, bc); W.weedList = blades; g.add(W.weed); }
  { const ms = []; for (let i = 0; i < 10; i++) { const a = 0.6 + i * 0.25, rr = 4 + (i % 3) * 1.2, x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr; ms.push([x, H(x, z) + 0.08, z, 0.32, 0.16, 0.2, a]); }
    W.uw.add(inst(LP.sph, C.emat('#3a3a52', '#0a0a18'), ms)); W.musselAt = [POND.x + Math.cos(1.6) * 5.2, POND.z + Math.sin(1.6) * 5.2]; }
  { const sn = []; for (let i = 0; i < 8; i++) { const a = 3.3 + i * 0.4, rr = 7 + (i % 2) * 2, x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr; sn.push([x, H(x, z) + 0.12, z, 0.16, 0.16, 0.16]); }
    W.uw.add(inst(LP.sph, C.emat('#a07a4a', '#2a1a08'), sn)); }
  for (let i = 0; i < 5; i++) { const a = 4.6 + i * 0.5, rr = 6 + (i % 2) * 2.5; rock(POND.x + Math.cos(a) * rr, POND.z + Math.sin(a) * rr, 0.8 + (i % 3) * 0.3); }
  W.tads = []; for (let i = 0; i < 10; i++) { const t0 = new T.Group(), b0 = new T.Mesh(LP.sph, C.basic('#2a2a1a')); b0.scale.set(0.12, 0.1, 0.16); t0.add(b0); const tl = new T.Mesh(G.box, C.basic('#3a3a2a')); tl.scale.set(0.02, 0.07, 0.22); tl.position.z = -0.18; t0.add(tl); W.uw.add(t0); W.tads.push({ m: t0, tail: tl, ph: i * 0.7 }); }
  W.tadAt = [POND.x - 9, POND.z + 6];
  { const rc = document.createElement('canvas'); rc.width = 16; rc.height = 128; const rx = rc.getContext('2d'), grd = rx.createLinearGradient(0, 0, 0, 128); grd.addColorStop(0, 'rgba(255,255,230,0.55)'); grd.addColorStop(1, 'rgba(255,255,230,0)'); rx.fillStyle = grd; rx.fillRect(0, 0, 16, 128);
    const rt = new T.CanvasTexture(rc); W.rays = []; for (let i = 0; i < 9; i++) { const m = new T.Mesh(new T.PlaneGeometry(1.4, 7), new T.MeshBasicMaterial({ map: rt, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false })); const a = i * 0.7, rr = 2 + (i * 3.1 % 9);
      m.position.set(POND.x + Math.cos(a) * rr, WL0 - 3.4, POND.z + Math.sin(a) * rr); m.rotation.set(0.15, a, 0.1); m.visible = false; g.add(m); W.rays.push({ m: m, ph: i }); } }
  { const n = 220, pp = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = rnd(i + 300) * 6.283, rr = Math.sqrt(rnd(i + 600)) * 13, x = POND.x + Math.cos(a) * rr, z = POND.z + Math.sin(a) * rr, bot = H(x, z); pp[i * 3] = x; pp[i * 3 + 1] = bot + rnd(i + 900) * Math.max(0.2, WL0 - bot); pp[i * 3 + 2] = z; }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pp, 3)); W.specks = new T.Points(pg, new T.PointsMaterial({ color: '#d8f0c0', size: 0.07, transparent: true, opacity: 0.7, depthWrite: false })); W.specks.visible = false; g.add(W.specks); }
  /* little energy trail while flying */
  W.trail = []; for (let i = 0; i < 10; i++) { const t0 = C.glow(['#9fe8ff', '#c59cff', '#ffd166'][i % 3], 0.8, 0.8); t0.visible = false; g.add(t0); W.trail.push(t0); }
  /* WILDLIFE: songbirds that perch, hop and fly between trees, a hawk and gulls overhead, butterflies on the flowers,
     and a heron and egrets in flight (creatures.js) */
  if (BQ.creatures) { const CR = BQ.creatures, low = S0low(), P = W.perches || [], pick = function (f) { return P.filter(function (q) { return f(q[0], q[2], q[3]); }); };
    const lawn = [], meadowFl = [], farmEdge = [], pondFl = [];
    for (let i = 0; i < 60; i++) { const x = -4 + rnd(i + 20000) * 26, z = -2 + rnd(i + 20100) * 18; if (pathDist(x, z) > 1 && Math.hypot(x - STATION.x, z - STATION.z + 4) > 5) lawn.push([x, GH(x, z) + 0.02, z]); }
    for (let i = 0; i < 20; i++) { const x = ORCH.x - 7 + rnd(i + 20200) * 14, z = ORCH.z - 6 + rnd(i + 20300) * 12; lawn.push([x, GH(x, z) + 0.02, z]); }
    for (let i = 0; i < 160; i++) { const x = -6 + rnd(i) * 30, z = 34 + rnd(i + 999) * 22; if (Math.hypot(x - POND.x, z - POND.z) > 17 && pathDist(x, z) > 1.4 && (i % 4 === 0)) meadowFl.push([x, H(x, z) + 0.42, z]); }
    for (let i = 0; i < 12; i++) { const x = FARM.x + 12 + rnd(i + 20400) * 3, z = FARM.z - 8 + rnd(i + 20500) * 16; farmEdge.push([x, H(x, z) + 0.3, z]); }
    for (let i = 0; i < 12; i++) { const a = rnd(i + 20600) * 6.283, x = POND.x + Math.cos(a) * 18, z = POND.z + Math.sin(a) * 18; pondFl.push([x, H(x, z) + 0.35, z]); }
    const milk = [[16, H(16, 38) + 1.3, 38], [16.9, H(16.9, 38) + 1.3, 38], [17.8, H(17.8, 38) + 1.3, 38], [16, H(16, 38.9) + 1.3, 38.9], [16.9, H(16.9, 38.9) + 1.3, 38.9]];
    const farmPts = []; for (let i = 0; i < 14; i++) { const x = FARM.x - 8 + rnd(i + 20700) * 16, z = FARM.z - 5 + rnd(i + 20800) * 10; farmPts.push([x, GH(x, z) + 0.02, z]); }
    /* the robins' and crows' feeding spots are mown short, so a bird on the ground is not buried in tall grass */
    if (W.grassIM) { const pts = lawn.concat(farmPts), m4 = new T.Matrix4(), pv = new T.Vector3(); let dirty = false;
      for (let i = 0; i < W.grassIM.count; i++) { W.grassIM.getMatrixAt(i, m4); pv.setFromMatrixPosition(m4); for (let j = 0; j < pts.length; j++) { if (Math.abs(pts[j][0] - pv.x) < 1.6 && Math.abs(pts[j][2] - pv.z) < 1.6) { m4.makeScale(0.0001, 0.0001, 0.0001); m4.setPosition(pv); W.grassIM.setMatrixAt(i, m4); dirty = true; break; } } }
      if (dirty) W.grassIM.instanceMatrix.needsUpdate = true; }
    W.wild = CR.Wild({ group: g, H: GH,
      birds: [{ kind: 'robin', n: low ? 2 : 4, ground: true, perches: lawn }, { kind: 'cardinal', n: low ? 1 : 2, perches: pick(function (x, z, k) { return k === 'dogwood' || (Math.hypot(x, z) < 40 && k !== 'pine' && k !== 'spruce'); }) },
        { kind: 'jay', n: low ? 1 : 2, perches: pick(function (x, z, k) { return x > 20 && z > 12; }) }, { kind: 'blackbird', n: low ? 2 : 3, perches: W.cattailTops || [] },
        { kind: 'crow', n: 2, ground: true, perches: farmPts.concat(W.postTops || []) }],
      soar: [{ kind: 'hawk', cx: 6, cz: 18, r: 26, y: 30, n: 1, speed: 0.1 }, { kind: 'gull', cx: 86, cz: -2, r: 14, y: 3, n: low ? 3 : 5, speed: 0.14 }],
      butterflies: [{ kind: 'monarch', n: 3, flowers: milk.concat(meadowFl.slice(0, 6)) }, { kind: 'swallowtail', n: low ? 1 : 2, flowers: meadowFl }, { kind: 'cabbage', n: low ? 1 : 3, flowers: farmEdge.concat(meadowFl.slice(0, 8)) },
        { kind: 'admiral', n: 1, flowers: lawn.slice(-12) }, { kind: 'azure', n: low ? 1 : 2, flowers: pondFl }] });
    W.waders = [];
    CR.makeWader('heron', function (w) { if (!w || !W) return; w.g.visible = false; g.add(w.g); w.t = -12 - Math.random() * 10; w.fly = null; W.waders.push(w); });
    for (let i = 0; i < (low ? 1 : 2); i++) CR.makeWader('egret', function (w) { if (!w || !W) return; g.add(w.g); w.circle = { cx: -18, cz: 86, r: 8 + i * 5, y: VALLEY_Y + 14 + i * 3, a: i * 3 }; W.waders.push(w); }); }
  /* player */
  W.me = C.buildAlien(C.S.alien); W.me.scale.multiplyScalar(0.78); g.add(W.me); /* a little smaller, so more of the reserve fits on screen */
  { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x0 = cv.getContext('2d'), gr0 = x0.createRadialGradient(32, 32, 2, 32, 32, 31); gr0.addColorStop(0, 'rgba(20,30,10,0.55)'); gr0.addColorStop(0.6, 'rgba(20,30,10,0.25)'); gr0.addColorStop(1, 'rgba(20,30,10,0)'); x0.fillStyle = gr0; x0.fillRect(0, 0, 64, 64);
    const smat = new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), sgeo = new T.PlaneGeometry(1, 1); sgeo.rotateX(-Math.PI / 2);
    W.shadows = []; const sh = function (o, r, get) { const m = new T.Mesh(sgeo, smat); m.scale.set(r * 2, 1, r * 2); m.renderOrder = 1; g.add(m); W.shadows.push({ o: o, m: m, r: r, get: get }); };
    sh(W.me, 0.6, function () { return [W.px, W.pz, W.py]; }); sh(W.deer, 1.1); sh(W.rabbit, 0.45); sh(W.frog, 0.4); sh(W.heron, 0.55); sh(W.owl, 0, null);
    W.npcs.forEach(function (n) { sh(n.m, 0.7); }); W.shadows = W.shadows.filter(function (q) { if (q.r) return true; g.remove(q.m); return false; }); }
  const s = st(); W.px = s.pos ? s.pos[0] : STATION.x + 3; W.pz = s.pos ? s.pos[1] : STATION.z + 7; W.py = H(W.px, W.pz); W.vy = 0; W.ground = true; W.face = 0;
  /* sparkles mark things you can interact with */
  W.marks = []; spots().forEach(function (sp) { if (sp.noMark) return; const mk = C.glow('#ffffff', 1.1, 0.8); mk.position.set(sp.x, H(sp.x, sp.z) + (sp.my || 2), sp.z); g.add(mk); W.marks.push({ sp: sp, m: mk }); });
  applyFixed(true);
  if (!S0low()) toonify(g);
}
/* cartoon 'stepped' shading like a picture book: every lit material gets 3 flat tones */
/* grass sways in the wind: a tiny vertex-shader tweak, no extra cost per blade */
const WIND = { value: 0 };
function windPatch(sh) { sh.uniforms.uWind = WIND; sh.vertexShader = 'uniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);\n#else\nvec3 ip = vec3(0.0);\n#endif\nfloat wk = clamp(position.y + 0.5, 0.0, 1.0); wk *= wk;\nfloat sw = sin(uWind * 1.7 + ip.x * 0.31 + ip.z * 0.23) * 0.55 + sin(uWind * 3.3 + ip.x * 0.9 - ip.z * 0.7) * 0.18;\ntransformed.x += sw * wk * 0.9; transformed.z += sw * wk * 0.45;'); }
function windy(m) { m.userData.wind = 1; m.onBeforeCompile = windPatch; m.customProgramCacheKey = function () { return 'wind'; }; return m; }
function antGeo() { const M4 = BQ.creatures.M4, S = function (w, h) { return new T.SphereGeometry(1, w || 10, h || 8); }, cc = '#2a160c', parts = [
    { geo: S(), m: M4(0, 0.035, 0.07, 0, 0, 0, 0.026, 0.024, 0.028), color: '#3a1e10' }, { geo: S(), m: M4(0, 0.04, 0.025, 0, 0, 0, 0.018, 0.018, 0.032), color: cc }, { geo: S(), m: M4(0, 0.045, -0.04, 0.2, 0, 0, 0.034, 0.03, 0.044), color: '#24120a' },
    { geo: new T.CylinderGeometry(0.003, 0.003, 0.05, 3), m: M4(-0.012, 0.06, 0.1, 0.9, 0, 0.5), color: cc }, { geo: new T.CylinderGeometry(0.003, 0.003, 0.05, 3), m: M4(0.012, 0.06, 0.1, 0.9, 0, -0.5), color: cc }];
  [-1, 1].forEach(function (sd) { [0.045, 0.025, 0.005].forEach(function (z, k) { parts.push({ geo: new T.CylinderGeometry(0.0035, 0.0025, 0.07, 3), m: M4(sd * 0.03, 0.025, z + (k - 1) * 0.012, (k - 1) * 0.5, 0, sd * 1.1), color: cc }); }); });
  return BQ.creatures.merge(parts); }
function detailGeos() {
  const M4 = BQ.creatures.M4, merge = BQ.creatures.merge, flat = function (geo) { const gg = geo.index ? geo.toNonIndexed() : geo; gg.computeVertexNormals(); return gg; };
  /* a grass tuft: seven thin blades leaning outward (base at y = -0.5 so the wind bends the tips) */
  const blades = []; for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283 + (k % 2) * 0.4, lean = 0.22 + (k % 3) * 0.12, h = 0.75 + (k % 3) * 0.13, r = k === 0 ? 0 : 0.12;
    const bg = new T.ConeGeometry(0.06, h, 3, 1, true); bg.translate(0, h / 2, 0); const m = new T.Object3D(); m.position.set(Math.cos(a) * r, -0.5, Math.sin(a) * r); m.rotation.set(Math.sin(a) * lean, 0, -Math.cos(a) * lean); m.updateMatrix();
    blades.push({ geo: bg, m: m.matrix.clone(), color: function (v) { return new T.Color('#ffffff').multiplyScalar(0.72 + Math.min(0.28, (v.y + 0.5) * 0.3)); } }); }
  /* a five-petal flower head (white, so each flower can be tinted) and its yellow center */
  const petals = []; for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; const pg = new T.CircleGeometry(1, 6); pg.rotateX(-Math.PI / 2); petals.push({ geo: pg, m: M4(Math.cos(a) * 0.55, 0.05, Math.sin(a) * 0.55, 0, -a, 0.2, 0.55, 1, 0.32), color: '#ffffff' }); }
  /* a bush: a few lumpy leaf clumps with lighter tops */
  const bushParts = [[0, 0, 0, 1], [0.55, 0.1, 0.2, 0.75], [-0.5, 0.05, -0.15, 0.8], [0.1, 0.45, -0.35, 0.7], [-0.15, 0.35, 0.45, 0.65]].map(function (q) { return { geo: new T.IcosahedronGeometry(q[3], 1), m: M4(q[0], q[1], q[2]), color: function (v) { return new T.Color('#ffffff').multiplyScalar(0.78 + Math.max(0, v.y) * 0.25); } }; });
  /* a fern: arching fronds */
  const fronds = []; for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; fronds.push({ geo: new T.SphereGeometry(1, 5, 3), m: M4(Math.cos(a) * 0.45, 0.25, Math.sin(a) * 0.45, 0, -a, 0.55, 0.6, 0.07, 0.16), color: function (v) { return new T.Color('#3f8a3c').lerp(new T.Color('#6ab04a'), Math.min(1, Math.max(0, v.y * 2))); } }); }
  /* mossy rocks: lumpy, faceted, darker in the cracks, with moss and lichen on top */
  const rocks = []; for (let r = 0; r < 5; r++) { const geo = new T.IcosahedronGeometry(1, 1), P = geo.attributes.position, v = new T.Vector3();
    for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); const n = 1 + 0.22 * Math.sin(v.x * 3.1 + r * 1.7) * Math.cos(v.z * 2.7 + r) + 0.12 * Math.sin(v.y * 5.3 + r * 2.1); v.multiplyScalar(n); if (v.y < -0.35) v.y = -0.35 + (v.y + 0.35) * 0.2; P.setXYZ(i, v.x, v.y, v.z); }
    const fg = flat(geo), FP = fg.attributes.position, FN = fg.attributes.normal, col = new Float32Array(FP.count * 3), c = new T.Color();
    for (let i = 0; i < FP.count; i++) { const ny = FN.getY(i), x = FP.getX(i), y = FP.getY(i), z = FP.getZ(i), sp = Math.sin(x * 9 + r) * Math.sin(z * 8 - r) * Math.sin(y * 7);
      c.set(r % 2 ? '#9a968a' : '#8a8a80').multiplyScalar(0.8 + y * 0.18); if (ny > 0.55 && sp > -0.3) c.lerp(new T.Color(sp > 0.4 ? '#7aa04a' : '#5a8a3a'), 0.85); else if (sp > 0.75) c.set('#c8c870');
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    fg.setAttribute('color', new T.BufferAttribute(col, 3)); rocks.push(fg); }
  return { tuft: merge(blades), petals: merge(petals), center: new T.SphereGeometry(0.28, 5, 3), bush: flat(merge(bushParts)), fern: merge(fronds), rocks: rocks };
}
/* soft speckles and blade marks, multiplied over the ground colors so the grass does not look like flat paint */
function groundTex() { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x0 = cv.getContext('2d'); x0.fillStyle = '#f2f2f2'; x0.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { const x = (i * 97.13) % 256, y = (i * 57.71 + (i % 7) * 13) % 256, s = (i * 31) % 100 / 100; x0.fillStyle = s > 0.55 ? 'rgba(255,255,255,0.55)' : 'rgba(40,60,20,' + (0.08 + s * 0.12) + ')'; x0.fillRect(x, y, 1 + (i % 2), 2 + (i % 4)); }
  for (let i = 0; i < 40; i++) { const x = (i * 71) % 256, y = (i * 137) % 256, gr = x0.createRadialGradient(x, y, 2, x, y, 26 + (i % 5) * 6); gr.addColorStop(0, i % 3 ? 'rgba(255,255,230,0.18)' : 'rgba(30,50,10,0.10)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x0.fillStyle = gr; x0.fillRect(0, 0, 256, 256); }
  const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; return t; }
function toonify(root) {
  const grad = new T.DataTexture(new Uint8Array([88, 150, 215]), 3, 1, T.LuminanceFormat); grad.minFilter = grad.magFilter = T.NearestFilter; grad.needsUpdate = true; const cache = {};
  root.traverse(function (o) { const m = o.material; if (!m || m.type !== 'MeshLambertMaterial') return;
    if (!cache[m.uuid]) { cache[m.uuid] = new T.MeshToonMaterial({ color: m.color, emissive: m.emissive, map: m.map, vertexColors: m.vertexColors, transparent: m.transparent, opacity: m.opacity, side: m.side, fog: m.fog, depthWrite: m.depthWrite, alphaTest: m.alphaTest, gradientMap: grad }); }
    if (m.userData.wind) windy(cache[m.uuid]); if (m.userData.keepShader) { cache[m.uuid].onBeforeCompile = m.onBeforeCompile; cache[m.uuid].customProgramCacheKey = m.customProgramCacheKey; } o.material = cache[m.uuid]; });
}

/* ---------- INTERACTIONS ---------- */
function spots() {
  const s = st();
  return [
    { id: 'frog', x: -8, z: 30, verb: 'cz.observe', t: 'cz.t.frog', use: function () { W.frogJump = 1; find('frog'); } },
    { id: 'log', x: 30, z: 28, verb: 'cz.observe', t: 'cz.t.log', use: function () { find('log'); } },
    { id: 'bee', x: 6, z: 44, verb: 'cz.observe', t: 'cz.t.bee', use: function () { find('bee'); } },
    { id: 'rabbit', x: 4, z: 40, verb: 'cz.observe', t: 'cz.t.rabbit', live: 'rabbit', use: function () { find('rabbit'); } },
    { id: 'overlook', x: HILL.x, z: HILL.z, verb: 'cz.observe', t: 'cz.t.overlook', use: function () { find('overlook'); if (!s.f.fly) { s.f.fly = 1; saveSoon(); queueCard('cz.flyNew', 12); } } },
    { id: 'sun', x: 10, z: 47, verb: 'cz.observe', t: 'cz.t.sun', use: function () { find('sun'); compare(); } },
    { id: 'shade', x: 45.5, z: 53, verb: 'cz.observe', t: 'cz.t.shade', use: function () { find('shade'); compare(); } },
    { id: 'oak', x: 18, z: -14, r: 3.2, verb: 'cz.collect', t: 'cz.t.oak', use: function () { s.samples.leaf = 1; saveSoon(); say('cz.s.gotLeaf'); } },
    { id: 'pond', x: -9.6, z: 17, r: 2.6, verb: function () { return s.inv.jar && !s.samples.pond ? 'cz.fill' : 'cz.investigate'; }, t: 'cz.t.pond', my: 1.6, use: pondUse },
    { id: 'kit', x: POND.x - 2, z: POND.z - 15, r: 4, verb: 'cz.test', t: 'cz.t.kit', use: kitUse },
    { id: 'scope', x: STATION.x + 4, z: STATION.z + 1, r: 2.6, verb: 'cz.examine', t: 'cz.t.scope', use: scopeUse },
    { id: 'bags', x: FARM.x + 10, z: FARM.z + 9, r: 3, verb: 'cz.investigate', t: 'cz.t.bags', use: function () { evidence('farm'); } },
    { id: 'glow', x: HOLLOW.x, z: HOLLOW.z, r: 5, verb: 'cz.observe', t: 'cz.t.glow', noMark: true, use: function () { find('glow'); C.award('cz-hollow'); } },
    { id: 'fish', x: POND.x + 13, z: POND.z + 6, r: 4, verb: 'cz.observe', t: 'cz.t.fish', when: function () { return s.f.fixed; }, use: function () { find('fish'); } },
    { id: 'ama', x: STATION.x + 2, z: STATION.z + 1.5, r: 2.6, verb: 'cz.talk', t: 'cz.t.ama', noMark: true, use: talkAma },
    { id: 'pip', x: -8, z: 8, r: 2.6, verb: 'cz.talk', t: 'cz.t.pip', noMark: true, use: talkPip },
    { id: 'lu', x: FARM.x + 6, z: FARM.z + 9, r: 2.6, verb: 'cz.talk', t: 'cz.t.lu', noMark: true, use: talkLu },
    { id: 'sam', x: 7, z: 55.5, r: 2.6, verb: 'cz.talk', t: 'cz.t.sam', noMark: true, use: talkSam },
    { id: 'spring', x: SPRING.x, z: SPRING.z - 0.5, r: 4.5, verb: 'cz.observe', t: 'cz.t.spring', my: 4, use: function () { find('spring'); } },
    { id: 'lichen', x: 34, z: -36, r: 3.6, verb: 'cz.observe', t: 'cz.t.lichen', my: 3.4, use: function () { find('lichen'); } },
    { id: 'owl', x: 35, z: 46, r: 3.4, verb: 'cz.observe', t: 'cz.t.owl', my: 6.2, use: function () { W.owlLook = 2; find('owl'); } },
    { id: 'monarch', x: 16.9, z: 38.5, r: 2.8, verb: 'cz.observe', t: 'cz.t.monarch', use: function () { find('monarch'); } },
    { id: 'dragonfly', x: -33, z: 33, r: 3.5, verb: 'cz.observe', t: 'cz.t.dragonfly', use: function () { find('dragonfly'); } },
    { id: 'cattail', x: -36.5, z: 18, r: 3, verb: 'cz.observe', t: 'cz.t.cattail', my: 2.8, use: function () { find('cattail'); } },
    { id: 'ants', x: 14, z: 4, r: 2.6, verb: 'cz.observe', t: 'cz.t.ants', use: function () { find('ants'); } },
    { id: 'nest', x: ORCH.x + 3.15, z: ORCH.z + 0.9, r: 3, verb: 'cz.observe', t: 'cz.t.nest', my: 4.4, use: function () { find('nest'); } },
    { id: 'deer', x: -30, z: 50, r: 5, verb: 'cz.observe', t: 'cz.t.deer', live: 'deer', my: 3.2, use: function () { W.deerAlert = 3; find('deer'); } },
    { id: 'worms', x: -50, z: -27, r: 3, verb: 'cz.observe', t: 'cz.t.worms', use: function () { find('worms'); } },
    { id: 'whitepine', x: 25, z: -20, r: 3.6, verb: 'cz.observe', t: 'cz.t.whitepine', my: 6, use: function () { treeFind('whitepine'); } },
    { id: 'hemlock', x: -24, z: -58.5, r: 3.6, verb: 'cz.observe', t: 'cz.t.hemlock', my: 5, use: function () { treeFind('hemlock'); } },
    { id: 'redmaple', x: -5, z: 55, r: 3.6, verb: 'cz.observe', t: 'cz.t.redmaple', my: 6, use: function () { treeFind('redmaple'); } },
    { id: 'sycamore', x: -41, z: -20, r: 3.6, verb: 'cz.observe', t: 'cz.t.sycamore', my: 6, use: function () { treeFind('sycamore'); } },
    { id: 'willow', x: -36, z: 28, r: 3.8, verb: 'cz.observe', t: 'cz.t.willow', my: 5.5, use: function () { treeFind('willow'); } },
    { id: 'dogwood', x: -12, z: 46, r: 3, verb: 'cz.observe', t: 'cz.t.dogwood', my: 3.5, use: function () { treeFind('dogwood'); } },
    { id: 'hickory', x: 2, z: 50, r: 3.6, verb: 'cz.observe', t: 'cz.t.hickory', my: 6, use: function () { treeFind('hickory'); } },
    { id: 'seaview', x: Math.cos(-3 * Math.PI / 180) * (EDGE + 0.2), z: Math.sin(-3 * Math.PI / 180) * (EDGE + 0.2), r: 3.4, verb: 'cz.lookout', t: 'cz.t.seaview', my: 2.6, use: function () { viewer('sea'); find('seaview'); } },
    { id: 'valleyview', x: Math.cos(88.5 * Math.PI / 180) * (EDGE + 0.2), z: Math.sin(88.5 * Math.PI / 180) * (EDGE + 0.2), r: 3.4, verb: 'cz.lookout', t: 'cz.t.valleyview', my: 2.6, use: function () { viewer('valley'); find('valleyview'); } },
    { id: 'canyonview', x: Math.cos(177.5 * Math.PI / 180) * (EDGE + 0.2), z: Math.sin(177.5 * Math.PI / 180) * (EDGE + 0.2), r: 3.4, verb: 'cz.lookout', t: 'cz.t.canyonview', my: 2.6, use: function () { viewer('canyon'); find('canyonview'); } },
    { id: 'fire', x: 16.5, z: 53.5, r: 4.4, verb: function () { return W.fire && W.fire.lit ? 'cz.sit' : 'cz.light'; }, t: 'cz.t.fire', noMark: true, use: fireUse },
    { id: 'fireflies', x: 8, z: 38, r: 9, verb: 'cz.observe', t: 'cz.t.fireflies', noMark: true, when: function () { return isNight(); }, use: function () { find('fireflies'); } },
    { id: 'lunamoth', x: STATION.x, z: STATION.z - 0.5, r: 3, verb: 'cz.observe', t: 'cz.t.lunamoth', noMark: true, when: function () { return isNight(); }, use: function () { find('lunamoth'); } },
    { id: 'sv-poll.meadow', x: -1, z: 44, r: 2.4, verb: 'cz.svStart', t: 'cz.svPost', noMark: true, use: function () { svStart('poll.meadow'); } },
    { id: 'sv-poll.farm', x: -40.5, z: -36, r: 2.4, verb: 'cz.svStart', t: 'cz.svPost', noMark: true, use: function () { svStart('poll.farm'); } },
    { id: 'sv-frog', x: -4, z: 27.5, r: 2.2, verb: 'cz.svStart', t: 'cz.svPost', noMark: true, use: function () { svStart('frog'); } },
    { id: 'sv-kick.up', x: -31.5, z: -51, r: 2.4, verb: 'cz.svStart', t: 'cz.svPost', noMark: true, use: function () { svStart('kick.up'); } },
    { id: 'sv-kick.down', x: -38.5, z: -25, r: 2.4, verb: 'cz.svStart', t: 'cz.svPost', noMark: true, use: function () { svStart('kick.down'); } },
    { id: 'pondweed', x: POND.x + 3, z: POND.z - 4, r: 4.5, uw: true, verb: 'cz.observe', t: 'cz.t.pondweed', noMark: true, use: function () { find('pondweed'); } },
    { id: 'mussel', x: POND.x + Math.cos(1.6) * 5.2, z: POND.z + Math.sin(1.6) * 5.2, r: 3.5, uw: true, verb: 'cz.observe', t: 'cz.t.mussel', noMark: true, use: function () { find('mussel'); } },
    { id: 'tadpole', x: POND.x - 9, z: POND.z + 6, r: 4, uw: true, verb: 'cz.observe', t: 'cz.t.tadpole', noMark: true, use: function () { find('tadpole'); } }
  ].concat(W && W.plants ? W.plants.map(function (p) { return { id: 'plant' + p.i, x: p.x, z: p.z, r: 2, verb: 'cz.plant', t: 'cz.t.spot', noMark: true, when: function () { return s.f.solved && !s.f.fixed && !(s.f['p' + p.i]); }, use: function () { plant(p); } }; }) : []);
}
function nearest() {
  let best = null, bd = 1e9; const list = W.spotList || (W.spotList = spots());
  list.forEach(function (sp) { if (sp.when && !sp.when()) return; if (sp.uw && !W.under) return; if (W.under && !sp.uw) return; let x = sp.x, z = sp.z; if (sp.live === 'rabbit') { x = W.rab.x; z = W.rab.z; } if (sp.live === 'deer') { x = W.dr.x; z = W.dr.z; } const d = Math.hypot(W.px - x, W.pz - z); if (d < (sp.r || 2.4) && d < bd) { bd = d; best = sp; } });
  return best;
}
function find(id) {
  const s = st(), fresh = !s.found[id]; s.found[id] = Date.now(); saveSoon();
  showCard(id); if (fresh && BQ.amb) { amb('sfx', 'discover'); if (C.S.set.cap && C.caption) C.caption('sound: chime, new discovery'); } else C.beep(fresh ? 1000 : 800, 0.18, 'sine', fresh ? 'chirp, new discovery' : null);
  if (fresh) { C.award('cz-first'); if (FINDS.every(function (f) { return s.found[f.id]; })) C.award('cz-all'); }
}
function treeFind(id) { find(id); const s = st(), n = ['whitepine', 'hemlock', 'redmaple', 'sycamore', 'willow', 'dogwood', 'hickory'].filter(function (k) { return s.found[k]; }).length; if (n >= 5 && !s.f.biodiv) { s.f.biodiv = 1; saveSoon(); queueCard('cz.d.biodiv', 14); } }
/* LISTENING: the alien's antennae pick up what animals say. Each animal knows only its own piece of the story. */
function voices() {
  const s = st(); return [
    { id: 'frog', x: -8, z: 30, r: 3.2, lines: ['cz.v.frog1', 'cz.v.frog2', 'cz.v.frog3'], clue: 'cz.vc.frog', myst: 1 },
    { id: 'heron', x: -6.5, z: 18.5, r: 3.4, lines: ['cz.v.heron1', 'cz.v.heron2', 'cz.v.heron3'], clue: 'cz.vc.heron', myst: 1, when: function () { return !s.f.fixed; } },
    { id: 'fish', x: SPRING.x, z: SPRING.z, r: 5, lines: ['cz.v.fishS1', 'cz.v.fishS2', 'cz.v.fishS3'], clue: 'cz.vc.fish', myst: 1, when: function () { return !s.f.fixed; } },
    { id: 'fish', key: 'fishP', x: POND.x + 13, z: POND.z + 6, r: 4.5, lines: ['cz.v.fishP1'], when: function () { return s.f.fixed; } },
    { id: 'robin', x: ORCH.x + 3.15, z: ORCH.z + 0.9, r: 3.2, lines: ['cz.v.robin1', 'cz.v.robin2'], clue: 'cz.vc.robin', myst: 1 },
    { id: 'deer', live: 'deer', r: 5.5, lines: ['cz.v.deer1', 'cz.v.deer2'], clue: 'cz.vc.deer', myst: 1 },
    { id: 'worms', x: -50, z: -27, r: 3.2, lines: ['cz.v.worms1', 'cz.v.worms2'], clue: 'cz.vc.worms', myst: 1 },
    { id: 'bees', x: 6, z: 44, r: 3.6, lines: ['cz.v.bees1', 'cz.v.bees2'], clue: 'cz.vc.bees' },
    { id: 'owl', x: 35, z: 46, r: 3.6, lines: ['cz.v.owl1'], when: function () { return !isNight(); } },
    { id: 'owl', key: 'owlN', x: 35, z: 46, r: 4, lines: ['cz.v.owlN1', 'cz.v.owlN2'], clue: 'cz.vc.owl', when: function () { return isNight(); } }];
}
function nearestVoice() {
  let best = null, bd = 1e9; (W.voiceList || (W.voiceList = voices())).forEach(function (v) { if (v.when && !v.when()) return; let x = v.x, z = v.z; if (v.live === 'deer') { x = W.dr.x; z = W.dr.z; }
    const d = Math.hypot(W.px - x, W.pz - z); if (d < v.r && d < bd && !W.under) { bd = d; best = v; } }); return best;
}
function listen(v) {
  if (!v || W.talk) return; const s = st(); if (!s.voices) s.voices = {};
  W.listenT = 2.5; amb('sfx', 'chime');
  if (v.id === 'deer') W.deerAlert = 4; if (v.id === 'owl') W.owlLook = 2; if (v.id === 'frog') W.frogJump = 0;
  talk(v.lines.map(function (k) { return { who: v.id, key: k, animal: true }; }), function () {
    const fresh = v.clue && !s.voices[v.key || v.id]; s.voices[v.key || v.id] = Date.now(); saveSoon();
    if (fresh) { showCard('msg', v.clue); W.cardT = 7; }
    if (v.myst && !(s.log && s.log.log2)) logEntry('log2');
    objective();
  });
}
function logEntry(id) { const s = st(); if (!s.log) s.log = {}; if (s.log[id]) return; s.log[id] = Date.now(); saveSoon(); queueCard('cz.' + id, 14); W.logPending = true; }
/* notes that wait until the card on screen has been read */
function queueCard(key, secs) { (W.queue = W.queue || []).push([key, secs]); W.cardT = Math.min(W.cardT || 0, 6); }
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
  const title = id === 'compare' ? '⚖️ ' + tx('cz.n.sun') + ' / ' + tx('cz.n.shade') : isFind ? tx('cz.n.' + id) : (extra && /^cz\.log/.test(extra) ? tx('cz.logT') : extra && /^cz\.vc\./.test(extra) ? '👂 ' + tx('cz.j.voices') : extra && !/^cz\.(s|ev)\./.test(extra) ? '🌿 ' + tx('cz.note') : tx('cz.m.title'));
  const body = id === 'compare' ? tx('cz.d.compare') : isFind ? tx('cz.d.' + id) : tx(extra);
  $('czCard').innerHTML = '<h3>' + C.esc(title) + '</h3>' + (id === 'leafcell' || id === 'algae' ? svgCells(id) : '') + '<p>' + C.esc(body) + '</p>' + (isFind ? '<p class="rec">' + C.esc(tx('cz.recorded')) + '</p>' : '');
  $('czCard').hidden = false;
}
function say(key) { showCard('msg', key); }
function evidence(k) {
  const s = st(); if (!s.f.tools && k !== 'farm' && k !== 'water') { /* still record what was seen */ }
  const fresh = !s.ev[k]; s.ev[k] = 1; saveSoon(); showCard('ev', 'cz.ev.' + k); if (fresh) C.beep(900, 0.2, 'triangle', 'chime, evidence found'); objective();
}
function pondUse() { const s = st(); evidence('water'); if (s.inv.jar && !s.samples.pond) { s.samples.pond = 1; saveSoon(); amb('sfx', 'splash', 0.5); queueCard('cz.s.gotPond', 9); } else if (!s.inv.jar) setTimeout(function () { say('cz.s.needJar'); }, 3500); }
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
  if (s.planted >= 5) { s.f.fixed = 1; W.mapBase = null; saveSoon(); W.clearT = 0; setTimeout(function () { say('cz.s.clearing'); }, 1500); C.award('cz-detective'); objective(); }
}
function applyFixed(instant) {
  const s = st();
  W.plants.forEach(function (p) { if (s.f['p' + p.i]) { p.pl.visible = true; p.pl.scale.setScalar(1); } });
  if (s.f.fixed && instant) { W.water.material.color.set('#3a8ac0'); W.water.material.emissive.set('#0a1a2a'); W.scum.visible = false; W.fish.visible = true; }
}
/* ---------- CONVERSATIONS ---------- */
function talk(lines, done) { W.talk = { lines: lines, i: 0, done: done, fb: '' }; drawTalk();
  /* the camera turns to frame you and whoever you are talking with */
  const who = lines[0] && lines[0].who, n = W.npcs.find(function (q) { return q.id === who; });
  if (n) W.talkFocus = { x: n.x, z: n.z, y: H(n.x, n.z) + (n.id === 'pip' ? 1.3 : 1.6) };
  else if (W.voice) { const v = W.voice, x = v.live === 'deer' ? W.dr.x : v.x, z = v.live === 'deer' ? W.dr.z : v.z; W.talkFocus = { x: x, z: z, y: H(x, z) + ({ heron: 2, owl: 4.4, robin: 3.2, deer: 1.4 }[v.id] || 0.6) }; }
  else W.talkFocus = null; }
function drawTalk() {
  const tk = W.talk, ln = tk.lines[tk.i];
  if (ln.choices) {
    $('czTalk').innerHTML = '<b>' + C.esc(npcName(ln.who)) + '</b><p>' + C.esc(tx(ln.key)) + '</p><div class="ch">' + ln.choices.map(function (c, i) { return '<button type="button" data-ch="' + i + '">' + (i + 1) + '. ' + C.esc(tx(c.key)) + '</button>'; }).join('') + '</div>' +
      (tk.fb ? '<p class="fb">' + C.esc(tx(tk.fb)) + '</p>' : '') + '<small>' + C.esc(tx('cz.choose')) + '</small>';
  } else $('czTalk').innerHTML = '<b>' + C.esc(npcName(ln.who)) + '</b>' + (ln.animal ? ' <small>👂 ' + C.esc(tx('cz.listening')) + '</small>' : '') + '<p>' + C.esc(tx(ln.key, ln.vars)) + '</p><button type="button" data-next="1">' + C.esc(tx('cz.next')) + '</button>';
  $('czTalk').hidden = false;
}
function talkNext() { const tk = W.talk; if (!tk || tk.lines[tk.i].choices) return; tk.i++; if (tk.i >= tk.lines.length) { W.talk = null; $('czTalk').hidden = true; if (tk.done) tk.done(); } else drawTalk(); }
function choose(i) { const tk = W.talk; if (!tk) return; const ln = tk.lines[tk.i]; if (!ln.choices || !ln.choices[i]) return; const c = ln.choices[i];
  if (c.ok) { tk.fb = ''; tk.i++; if (tk.i >= tk.lines.length) { W.talk = null; $('czTalk').hidden = true; if (tk.done) tk.done(); } else drawTalk(); C.beep(880, 0.25, 'sine', 'chime, good explanation'); }
  else { tk.fb = c.fb; drawTalk(); C.beep(220, 0.2, 'triangle', 'hmm, think again'); } }
function evCount() { const e = st().ev; return ['water', 'oxygen', 'micro', 'farm'].filter(function (k) { return e[k]; }).length; }
function talkAma() {
  const s = st();
  if (!s.f.met) { talk([{ who: 'ama', key: 'cz.s.ama1' }, { who: 'ama', key: 'cz.s.ama2' }], function () { s.f.met = 1; saveSoon(); objective(); logEntry('log1'); }); return; }
  if (s.f.pip && !s.f.tools) { talk([{ who: 'ama', key: 'cz.s.ama3' }, { who: 'ama', key: 'cz.s.ama4' }], function () { s.f.tools = 1; s.inv.jar = 1; s.inv.kit = 1; saveSoon(); objective(); }); return; }
  if (s.f.tools && !s.f.solved) {
    if (evCount() < 3) { talk([{ who: 'ama', key: 'cz.s.amaW', vars: { n: evCount() } }]); return; }
    talk([{ who: 'ama', key: 'cz.s.ama5', choices: [{ key: 'cz.c.b', fb: 'cz.f.b' }, { key: 'cz.c.a', ok: true }, { key: 'cz.c.c', fb: 'cz.f.c' }] }, { who: 'ama', key: 'cz.s.ama6' }, { who: 'ama', key: 'cz.s.ama7' }],
      function () { s.f.solved = 1; s.found.eutro = Date.now(); C.S.words['Eutrophication'] = 1; saveSoon(); objective(); logEntry('log3'); }); return;
  }
  if (s.f.fixed) { talk([{ who: 'ama', key: 'cz.s.amaDone' }]); return; }
  if (s.f.solved) { talk([{ who: 'ama', key: 'cz.s.ama7' }]); return; }
  talk([{ who: 'ama', key: 'cz.s.ama2' }]);
}
function talkPip() { const s = st(); if (s.f.fixed) { talk([{ who: 'pip', key: 'cz.s.pipDone' }]); return; } if (s.f.pip) { talk([{ who: 'pip', key: 'cz.s.pipW' }]); return; }
  talk([{ who: 'pip', key: 'cz.s.pip1' }, { who: 'pip', key: 'cz.s.pip2' }], function () { s.f.pip = 1; saveSoon(); objective(); }); }
function talkSam() { talk([{ who: 'sam', key: 'cz.s.sam1' }, { who: 'sam', key: 'cz.s.sam2' }, { who: 'sam', key: 'cz.s.sam3' }], function () { st().f.sam = 1; saveSoon(); }); }
function talkLu() { const s = st(); if (s.f.fixed) { talk([{ who: 'lu', key: 'cz.s.luDone' }]); return; } talk([{ who: 'lu', key: 'cz.s.lu1' }, { who: 'lu', key: 'cz.s.lu2' }], function () { evidence('farm'); }); }
function objective() {
  const s = st(); let key, vars;
  if (s.f.fixed) key = 'cz.m.o5'; else if (s.f.solved) { key = 'cz.m.o4'; vars = { n: s.planted || 0 }; } else if (s.f.tools) { if (evCount() >= 3) key = 'cz.m.o3'; else { key = 'cz.m.o2'; vars = { n: evCount() }; } } else if (s.f.pip) key = 'cz.m.o1'; else key = 'cz.m.o0';
  const chk = key === 'cz.m.o2' || key === 'cz.m.o3' ? '<ul class="czChk">' + ['water', 'oxygen', 'micro', 'farm'].map(function (k) { return '<li>' + (s.ev[k] ? '✓ ' : '○ ') + C.esc(tx('cz.m.k.' + k)) + '</li>'; }).join('') + '</ul>' : '';
  $('czObj').innerHTML = '<small>🔎 ' + C.esc(tx('cz.m.title')) + '</small>' + C.esc(tx(key, vars)) + chk + (key === 'cz.m.o2' ? '<br><span class="dim">👂 ' + C.esc(tx('cz.m.ears')) + '</span>' : '');
  if (W) W.npcs.forEach(function (n) { n.mark.visible = (n.id === 'pip' && !s.f.pip) || (n.id === 'ama' && (!s.f.met || (s.f.pip && !s.f.tools) || (s.f.tools && !s.f.solved && evCount() >= 3))); });
  if (W) W.plants.forEach(function (p) { p.mk.material.opacity = s.f.solved && !s.f.fixed && !s.f['p' + p.i] ? 0.9 : 0; });
}

/* ---------- START, STOP, PAUSE ---------- */
function start() {
  ensureUI(); C.teardown(); C.show(null); C.setMode('cozy');
  ['hud', 'touch', 'toast', 'qpanel'].forEach(function (id) { const e = $(id); if (e) e.hidden = true; });
  build(); $('cozyUI').hidden = false; refreshText(); if (C.S.set.czKeys == null) { showKeys(true); W.keysT = 25; } else showKeys(!!C.S.set.czKeys); C.Music.stop(); dayLight(); W.moodNow = moodNow(); amb('mood', W.moodNow, 2);
  { const s0 = st(); if ((s0.found.overlook || C.S.set.admin) && !s0.f.fly) { s0.f.fly = 1; C.save(); } }
  const s = st(); if (!s.f.met) setTimeout(function () { if (W && !W.talk) talkAma(); }, 800);
}
function exit() {
  if (W.scope) closeScope();
  const s = st(); s.pos = [W.px, W.pz]; C.save(); if (W.camUnder && W.airFog) { C.scene.fog = W.airFog; C.scene.background = W.airBg; }
  C.cam.fov = 42; C.cam.updateProjectionMatrix(); if (BQ.amb) BQ.amb.stop(1);
  C.scene.remove(W.g); C.disposeGroup(W.g); C.scene.background = W.bg; C.scene.fog = W.fog; C.HEMI.intensity = W.light[0]; C.KEYL.intensity = W.light[1]; C.KEYL.position.copy(W.light[2]); C.HEMI.color.set('#ffffff'); C.HEMI.groundColor.set('#334455'); C.KEYL.color.set('#ffffff'); W = null;
  $('cozyUI').hidden = true; $('czPause').hidden = true; C.setMode('menu'); C.menuScene();
}
function setPause(on) { if (!W) return; W.pause = on; $('czPause').hidden = !on; if (on) { W.k = {}; $('czRes').focus(); } }
function openJ() { if (!W) return; W.k = {}; W.pause = true; $('cozyUI').hidden = true; C.openJournal('cozy'); C.journalTab('cozy'); }
function resume() { if (!W) return; W.pause = false; $('czPause').hidden = true; $('cozyUI').hidden = false; refreshText(); }

function groundAt(x, z) { let g0 = GH(x, z); for (let i = 0; i < W.tops.length; i++) { const c = W.tops[i]; if (c.top > g0 && Math.hypot(x - c.x, z - c.z) < c.r * 0.85) g0 = c.top; } return g0; }
function amb(fn, a, b) { if (BQ.amb && BQ.amb[fn]) BQ.amb[fn](a, b); }
function underwaterLook(cam) {
  const wb = waterAt(cam.position.x, cam.position.z), under = !!wb && cam.position.y < wb.y - 0.05, scene = C.scene, clear = st().f.fixed;
  if (under !== W.camUnder) {
    W.camUnder = under;
    if (under) { W.airFog = scene.fog; W.airBg = scene.background; scene.fog = new T.FogExp2(clear ? '#1f6a80' : '#3a6a3a', clear ? 0.07 : 0.16); scene.background = new T.Color(clear ? '#1f6a80' : '#3a6a3a'); }
    else if (W.airFog) { scene.fog = W.airFog; scene.background = W.airBg; }
    W.specks.visible = under; W.rays.forEach(function (r) { r.m.visible = under; }); amb('underwater', under);
    if (BQ.amb) BQ.amb.mood(under ? 'under' : (W.moodNow || 'meadow'), 2.5);
  }
  if (under) W.rays.forEach(function (r) { r.m.material.opacity = (clear ? 0.75 : 0.35) * (0.6 + 0.4 * Math.sin(W.t * 0.8 + r.ph)); r.m.rotation.z = 0.1 + Math.sin(W.t * 0.4 + r.ph) * 0.05; });
}
function toggleFly() {
  const s = st(); if (!s.f.fly || W.talk || W.pause) return;
  if (W.flying) { W.flying = false; return; }
  if (W.flyE < 0.15) { showCard('msg', 'cz.flyLow'); W.cardT = 3; return; }
  W.flying = true; W.swim = false; W.vy = 5; W.ground = false; amb('sfx', 'whoosh', 0.8); if (!W.toldFly) { W.toldFly = true; showCard('msg', 'cz.flyTip'); W.cardT = 7; }
}
/* ---------- LOOKOUT VIEWERS: look through binoculars, look around and zoom, and spot 3 things at each lookout ---------- */
const SCOPE = {
  sea: [{ k: 'gulls', at: function () { const g0 = W.wild && W.wild.soar.filter(function (o) { return o.kind === 'gull'; })[0]; return g0 ? g0.g.getWorldPosition(new T.Vector3()) : new T.Vector3(86, 3, -2); }, tol: 7 },
    { k: 'island', at: function () { return new T.Vector3(150, SEA_Y + 12, -30); }, tol: 5 }, { k: 'cliff', at: function () { return new T.Vector3(70, -12, -4); }, tol: 7 }],
  valley: [{ k: 'town', at: function () { return new T.Vector3(34, H(34, 128) + 2, 128); }, tol: 5 }, { k: 'farm', at: function () { return new T.Vector3(-28, H(-28, 96) + 3, 96); }, tol: 5 },
    { k: 'wetland', at: function () { return new T.Vector3(-30, H(-30, 120) + 0.5, 120); }, tol: 5 }],
  canyon: [{ k: 'river', at: function () { return new T.Vector3(-110, CANYON_Y, 0); }, tol: 6 }, { k: 'mesa', at: function () { return new T.Vector3(-135, CANYON_Y + 30, -20); }, tol: 5 },
    { k: 'wall', at: function () { return new T.Vector3(-165, CANYON_Y + 22, 14); }, tol: 7 }] };
function scopeUI() {
  if ($('czScope')) return;
  const css = document.createElement('style'); css.textContent = `
#czScope { position: absolute; inset: 0; z-index: 6; pointer-events: none; }
#czScope svg { position: absolute; inset: 0; width: 100%; height: 100%; }
#czScope .ring { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%; border: 2px solid rgba(255,255,255,.75); box-shadow: 0 0 0 1px rgba(0,0,0,.4); }
#czScope .ring i { position: absolute; inset: -6px; border-radius: 50%; border: 4px solid transparent; border-top-color: #ffd166; transform: rotate(0deg); opacity: 0; }
#czScope .pan { position: absolute; left: 12px; bottom: 12px; max-width: min(380px, calc(100% - 24px)); background: rgba(11,29,42,.88); color: #fff; border: 1px solid #ffd166; border-radius: 12px; padding: 10px 12px; pointer-events: auto; }
#czScope .pan h3 { margin: 0 0 6px; font-size: 1.05em; color: #ffd166; } #czScope .pan ul { margin: 0 0 6px; padding-left: 0; list-style: none; } #czScope .pan li.ok { color: #7be0ad; }
#czScope .pan .fact { margin: 6px 0; padding: 6px 8px; background: rgba(255,209,102,.12); border-radius: 8px; } #czScope .pan .dim { opacity: .8; font-size: .9em; }
#czScope .btns { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
#cozyUI.scoping #czPrompt, #cozyUI.scoping #czHelp, #cozyUI.scoping #czCard, #cozyUI.scoping #czObj, #cozyUI.scoping #czMv, #cozyUI.scoping #czInv { display: none !important; }`;
  document.head.appendChild(css);
  const d = document.createElement('div'); d.id = 'czScope'; d.hidden = true;
  d.innerHTML = '<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><mask id="czScM"><rect x="-200" y="-200" width="560" height="490" fill="#fff"/><circle cx="61" cy="45" r="33" fill="#000"/><circle cx="99" cy="45" r="33" fill="#000"/></mask></defs><rect x="-200" y="-200" width="560" height="490" fill="#05080c" mask="url(#czScM)"/></svg>' +
    '<div class="ring"><i></i></div><div class="pan" role="dialog" aria-live="polite"></div>';
  $('cozyUI').appendChild(d);
  d.addEventListener('click', function (e) { const b = e.target.closest('button'); if (!b || !W) return; b.blur(); if (b.dataset.sc === 'done') closeScope(); if (b.dataset.sc === 'in') scopeZoom(1.35); if (b.dataset.sc === 'out') scopeZoom(1 / 1.35); });
}
function scopePanel() {
  const c = W.scope; if (!c) return; const s = st(), got = s.scope || {}, list = SCOPE[c.id], left = list.filter(function (q) { return !got[c.id + '.' + q.k]; }).length;
  $('czScope').querySelector('.pan').innerHTML = '<h3>🔭 ' + C.esc(tx('cz.sc.title')) + ': ' + C.esc(tx('cz.t.' + c.id + 'view')) + '</h3><b>' + C.esc(tx('cz.sc.spot')) + '</b><ul>' +
    list.map(function (q) { const ok = got[c.id + '.' + q.k]; return '<li class="' + (ok ? 'ok' : '') + '">' + (ok ? '✓ ' : '○ ') + C.esc(tx('cz.sc.' + c.id + '.' + q.k)) + '</li>'; }).join('') + '</ul>' +
    (c.fact ? '<p class="fact">' + C.esc(tx('cz.sc.' + c.id + '.' + c.fact + 'D')) + '</p>' : '') + '<p class="dim">' + C.esc(left ? tx('cz.sc.left', { n: left }) : tx('cz.sc.all')) + '</p><p class="dim">' + C.esc(tx('cz.sc.help')) + '</p>' +
    '<div class="btns"><button type="button" data-sc="in">➕ ' + C.esc(tx('cz.sc.zin')) + '</button><button type="button" data-sc="out">➖ ' + C.esc(tx('cz.sc.zout')) + '</button><button type="button" class="primary" data-sc="done">' + C.esc(tx('cz.sc.done')) + '</button></div>';
}
function viewer(id) {
  const v = W.views.find(function (q) { return q.id === id; }); if (!v || W.talk) return; scopeUI();
  const a = Math.atan2(v.z, v.x); W.k = {}; W.vx = W.vz = 0; W.ui = 'scope';
  W.scope = { id: id, v: v, a0: a, a: a, p: id === 'valley' ? -0.26 : id === 'sea' ? -0.06 : -0.14, zoom: 1.6, k: {}, hold: 0, fact: null, pos: new T.Vector3(v.x + Math.cos(a) * 0.55, H(v.x, v.z) + 1.35, v.z + Math.sin(a) * 0.55) };
  $('czScope').hidden = false; $('cozyUI').classList.add('scoping'); scopePanel(); amb('sfx', 'step', 0.6);
}
function closeScope() { if (!W || !W.scope) return; W.scope = null; W.ui = null; $('czScope').hidden = true; $('cozyUI').classList.remove('scoping'); C.cam.fov = 42; C.cam.updateProjectionMatrix(); }
function scopeZoom(f) { if (W.scope) W.scope.zoom = Math.max(1, Math.min(6, W.scope.zoom * f)); }
function scopeStep(dt, cam) {
  const c = W.scope, k = c.k, sp = 0.9 / c.zoom;
  c.a += ((k.r ? 1 : 0) - (k.l ? 1 : 0)) * dt * sp; c.p += ((k.f ? 1 : 0) - (k.b ? 1 : 0)) * dt * sp * 0.8;
  while (c.a - c.a0 > Math.PI) c.a -= Math.PI * 2; while (c.a - c.a0 < -Math.PI) c.a += Math.PI * 2;
  c.a = Math.max(c.a0 - 1.25, Math.min(c.a0 + 1.25, c.a)); c.p = Math.max(-0.75, Math.min(0.4, c.p));
  const dir = new T.Vector3(Math.cos(c.a) * Math.cos(c.p), Math.sin(c.p), Math.sin(c.a) * Math.cos(c.p));
  cam.position.copy(c.pos); cam.lookAt(c.pos.clone().add(dir)); cam.fov = 40 / c.zoom; cam.updateProjectionMatrix(); W.me.visible = false;
  /* spotting: keep the center ring on a target for a moment */
  const s = st(); s.scope = s.scope || {}; let on = null, best = 1e9;
  SCOPE[c.id].forEach(function (q) { const P = q.at(), to = P.clone().sub(c.pos), dist = to.length(), ang = Math.acos(Math.max(-1, Math.min(1, to.normalize().dot(dir)))), need = Math.max(Math.atan2(q.tol, dist), (cam.fov * Math.PI / 180) * 0.06);
    if (ang < need && ang / need < best && !s.scope[c.id + '.' + q.k]) { on = q; best = ang / need; } });
  c.hold = on ? c.hold + dt : 0; const ri = $('czScope').querySelector('.ring i'); ri.style.opacity = on ? 1 : 0; ri.style.transform = 'rotate(' + Math.round(Math.min(1, c.hold / 0.9) * 360) + 'deg)';
  if (on && c.hold > 0.9) { s.scope[c.id + '.' + on.k] = 1; c.fact = on.k; c.hold = 0; saveSoon(); amb('sfx', 'discover'); if (C.S.set.cap && C.caption) C.caption('sound: chime, spotted'); scopePanel(); }
}
function lookCloser() { if (W.dist > 4) { W.prevDist = W.distT; W.distT = 2.4; W.pitch = 0.15; if (!W.toldLook) { W.toldLook = true; showCard('msg', 'cz.lookTip'); W.cardT = 5; } } else W.distT = W.prevDist && W.prevDist > 4 ? W.prevDist : 10; }

/* ---------- THE MAP: drawn from the real ground, filled in as you explore ---------- */
const MX0 = -96, MX1 = 96, MZ0 = -96, MZ1 = 100, MCELL = 6, MCOLS = Math.ceil((MX1 - MX0) / MCELL), MROWS = Math.ceil((MZ1 - MZ0) / MCELL);
const AREAS = [['pond', POND.x, POND.z], ['station', STATION.x, STATION.z - 7], ['farm', FARM.x, FARM.z - 2], ['spring', SPRING.x, SPRING.z - 5], ['hill', HILL.x, HILL.z - 7], ['hollow', HOLLOW.x, HOLLOW.z, 'glow'], ['orchard', ORCH.x, ORCH.z - 8],
  ['forest', 42, 24], ['meadow', 6, 42], ['sea', 72, -3], ['valley', 2, 72], ['canyon', -72, 3], ['stream', -44, -30], ['dock', -5, 12], ['camp', 16.5, 49.5]];
function habitatAt(x, z) {
  const d = Math.hypot(x, z); if (waterAt(x, z)) return 'pond'; if (streamDist(x, z) < 3) return 'stream'; if (Math.hypot(x - HOLLOW.x, z - HOLLOW.z) < 10) return 'hollow';
  if (Math.hypot(x - SPRING.x, z - SPRING.z) < 12) return 'spring'; if (x > 22 && z > 14 && d < EDGE) return 'forest'; if (Math.abs(x - FARM.x) < 13 && Math.abs(z - FARM.z) < 11) return 'farm';
  if (Math.hypot(x - HILL.x, z - HILL.z) < 15) return 'hill'; if (Math.abs(x - ORCH.x) < 10 && Math.abs(z - ORCH.z) < 9) return 'orchard'; if (d > EDGE - 4 && edgeW(x, z).w > 0.5) return 'lookout'; return 'meadow';
}
function mapBase() {
  if (W.mapBase) return W.mapBase;
  const w = MX1 - MX0, h = MZ1 - MZ0, cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'), im = g.createImageData(w, h), c = new T.Color(), fixed = st().f.fixed;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const x = MX0 + i + 0.5, z = MZ0 + j + 0.5, y = H(x, z), d = Math.hypot(x, z), ew = edgeW(x, z);
    if (waterAt(x, z)) { c.set(fixed ? '#3aa8c0' : '#4f8f72'); if ((i + j * 3) % 11 === 0) c.offsetHSL(0, 0, 0.06); }
    else if (streamDist(x, z) < 1.3) c.set('#4ab8d0');
    else if (ew.id === 'sea' && ew.w > 0.5 && y < SEA_Y + 0.3) c.set('#2a9ab0');
    else if (d > EDGE + 3 && ew.w > 0.5) { c.set('#8ab84a'); edgeColor(x, z, y, c); }
    else if (d > EDGE + 2) c.set('#3f6a34');
    else if (Math.abs(x - FARM.x) < 11 && Math.abs(z - FARM.z) < 9) c.set(Math.floor(x / 2) % 2 ? '#c8a050' : '#b88a40');
    else if (pathDist(x, z) < 1.3) c.set('#d8a060');
    else if (x > 22 && z > 14) c.set('#4a7a3a');
    else c.set(y > 6 ? '#9ab850' : '#8cbc52');
    const sl = (H(x + 1, z - 1) - H(x - 1, z + 1)) * 0.06; c.offsetHSL(0, 0, Math.max(-0.12, Math.min(0.12, sl)));
    const k = (j * w + i) * 4; im.data[k] = c.r * 255; im.data[k + 1] = c.g * 255; im.data[k + 2] = c.b * 255; im.data[k + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  g.fillStyle = 'rgba(30,70,30,0.55)'; W.colliders.forEach(function (q) { if (!q.cr || q.x < MX0 || q.x > MX1 || q.z < MZ0 || q.z > MZ1) return; g.beginPath(); g.arc(q.x - MX0, q.z - MZ0, Math.min(2.6, q.cr * 0.8), 0, 6.283); g.fill(); });
  g.fillStyle = '#c4462c'; g.fillRect(STATION.x - 3 - MX0, STATION.z - 6.5 - MZ0, 6, 5);
  W.mapBase = cv; return cv;
}
function seenGrid() { const s = st(); if (!s.mapSeen || s.mapSeen.length !== MCOLS * MROWS) s.mapSeen = '0'.repeat(MCOLS * MROWS); return s.mapSeen; }
function isSeen(x, z) { const i = Math.floor((x - MX0) / MCELL), j = Math.floor((z - MZ0) / MCELL); if (i < 0 || j < 0 || i >= MCOLS || j >= MROWS) return false; return seenGrid()[j * MCOLS + i] === '1'; }
function markSeen() {
  const s = st(), g0 = seenGrid().split(''), R = W.flying || W.py > H(W.px, W.pz) + 4 || Math.hypot(W.px - HILL.x, W.pz - HILL.z) < 8 ? 42 : 20; let ch = false;
  for (let j = 0; j < MROWS; j++) for (let i = 0; i < MCOLS; i++) { const cx = MX0 + (i + 0.5) * MCELL, cz = MZ0 + (j + 0.5) * MCELL; if (g0[j * MCOLS + i] === '0' && Math.hypot(cx - W.px, cz - W.pz) < R) { g0[j * MCOLS + i] = '1'; ch = true; } }
  if (ch) { s.mapSeen = g0.join(''); W.fogDirty = true; saveSoon(); }
}
function fogCanvas() {
  if (W.fog0 && !W.fogDirty) return W.fog0; W.fogDirty = false;
  const cv = W.fog0 || document.createElement('canvas'); cv.width = MX1 - MX0; cv.height = MZ1 - MZ0; const g = cv.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.fillStyle = '#e9dfc4'; g.fillRect(0, 0, cv.width, cv.height);
  g.strokeStyle = 'rgba(160,140,100,0.25)'; for (let k = 0; k < cv.width; k += 8) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 40, cv.height); g.stroke(); }
  g.globalCompositeOperation = 'destination-out'; const sg = seenGrid();
  for (let j = 0; j < MROWS; j++) for (let i = 0; i < MCOLS; i++) { if (sg[j * MCOLS + i] !== '1') continue; const cx = (i + 0.5) * MCELL, cz = (j + 0.5) * MCELL, gr = g.createRadialGradient(cx, cz, 0, cx, cz, MCELL * 1.15); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.65, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(cx - MCELL * 1.2, cz - MCELL * 1.2, MCELL * 2.4, MCELL * 2.4); }
  W.fog0 = cv; return cv;
}
function openMap() {
  if (!W || W.talk) return; W.k = {}; W.ui = 'map'; $('czMapP').hidden = false; W.mapZ = W.mapZ || 3; W.mapCx = W.px; W.mapCz = W.pz; markSeen(); sizeMap(); drawMap(); $('czMapClose').focus();
  { const h = $('czMapH'); if (C.S.set.admin && h.textContent.indexOf('Admin') < 0) h.textContent += ' · Admin: tap an empty spot to jump there.'; }
}
function closeMap() { if (!W) return; W.ui = null; $('czMapP').hidden = true; $('czMapInfo').innerHTML = ''; }
function sizeMap() { const cv = $('czMapC'), r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.max(200, Math.round(r.width * dpr)); cv.height = Math.max(200, Math.round(r.height * dpr)); W.mapDpr = dpr; }
function mapS(x, z) { const cv = $('czMapC'), sc = W.mapZ * W.mapDpr; return [(x - W.mapCx) * sc + cv.width / 2, (z - W.mapCz) * sc + cv.height / 2]; }
function mapMarks() {
  const s = st(), out = [];
  spots().forEach(function (sp) { if (!FINDS.some(function (f) { return f.id === sp.id; }) || !s.found[sp.id]) return; out.push({ kind: 'find', id: sp.id, x: sp.x, z: sp.z }); });
  W.npcs.forEach(function (n) { out.push({ kind: 'person', id: n.id, x: n.x, z: n.z }); });
  (W.views || []).forEach(function (v) { out.push({ kind: 'view', id: v.id + 'view', x: v.x, z: v.z }); });
  return out.filter(function (m) { return isSeen(m.x, m.z); });
}
function drawMap() {
  const cv = $('czMapC'); if (!cv || $('czMapP').hidden) return; const g = cv.getContext('2d'), sc = W.mapZ * W.mapDpr, dpr = W.mapDpr;
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#d8ccb0'; g.fillRect(0, 0, cv.width, cv.height);
  g.save(); g.translate(cv.width / 2, cv.height / 2); g.scale(sc, sc); g.translate(-W.mapCx, -W.mapCz); g.imageSmoothingEnabled = true;
  g.drawImage(mapBase(), MX0, MZ0, MX1 - MX0, MZ1 - MZ0); if (!C.S.set.admin) g.drawImage(fogCanvas(), MX0, MZ0, MX1 - MX0, MZ1 - MZ0); g.restore();
  /* area names */
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  AREAS.forEach(function (a) { if (a[3] && !st().found[a[3]]) return; if (!isSeen(a[1], a[2])) return; const p0 = mapS(a[1], a[2]); g.font = '700 ' + Math.round(13 * dpr) + 'px sans-serif'; g.strokeStyle = 'rgba(255,250,235,0.9)'; g.lineWidth = 4 * dpr; const t0 = tx('cz.ar.' + a[0]); g.strokeText(t0, p0[0], p0[1]); g.fillStyle = '#3a2a1a'; g.fillText(t0, p0[0], p0[1]); });
  /* marks */
  W.mapHits = [];
  mapMarks().forEach(function (m) { const p0 = mapS(m.x, m.z), r = 9 * dpr;
    g.beginPath(); g.arc(p0[0], p0[1], r, 0, 6.283); g.fillStyle = m.kind === 'find' ? '#ffd166' : m.kind === 'person' ? '#5fb8ff' : '#c59cff'; g.fill(); g.lineWidth = 2 * dpr; g.strokeStyle = '#3a2a1a'; g.stroke();
    g.fillStyle = '#10202c'; g.font = '700 ' + Math.round(11 * dpr) + 'px sans-serif'; g.fillText(m.kind === 'find' ? '★' : m.kind === 'person' ? '☺' : '◎', p0[0], p0[1] + dpr);
    W.mapHits.push({ m: m, x: p0[0], y: p0[1] }); });
  /* hint target */
  if (W.hintTarget && W.hintTarget.t > 0) { const p0 = mapS(W.hintTarget.x, W.hintTarget.z), pr = (10 + 4 * Math.sin(W.t * 5)) * dpr; g.beginPath(); g.arc(p0[0], p0[1], pr, 0, 6.283); g.lineWidth = 3 * dpr; g.strokeStyle = '#e0403a'; g.stroke(); g.beginPath(); g.arc(p0[0], p0[1], pr * 1.7, 0, 6.283); g.lineWidth = 1.5 * dpr; g.stroke(); }
  /* you: an arrow pointing the way you face */
  const me = mapS(W.px, W.pz), f = W.face; g.save(); g.translate(me[0], me[1]); g.rotate(-f + Math.PI); g.beginPath(); g.moveTo(0, -12 * dpr); g.lineTo(8 * dpr, 9 * dpr); g.lineTo(0, 4 * dpr); g.lineTo(-8 * dpr, 9 * dpr); g.closePath(); g.fillStyle = '#e0403a'; g.fill(); g.lineWidth = 2 * dpr; g.strokeStyle = '#ffffff'; g.stroke(); g.restore();
  /* compass */
  g.fillStyle = '#3a2a1a'; g.font = '700 ' + Math.round(14 * dpr) + 'px sans-serif'; g.fillText('N ▲', cv.width - 28 * dpr, 18 * dpr);
}
function mapInfo(m) {
  const s = st(); let title, body = '';
  if (m.kind === 'person') { title = npcName(m.id); }
  else { title = tx('cz.n.' + m.id); body = s.found[m.id] ? tx('cz.d.' + m.id) : tx('cz.mi.notYet'); }
  $('czMapInfo').innerHTML = '<b>' + C.esc(title) + '</b> <span class="dim">· ' + C.esc(tx('cz.mi.habitat')) + ': ' + C.esc(tx('cz.hb.' + habitatAt(m.x, m.z))) + '</span>' + (body ? '<p>' + C.esc(body) + '</p>' : '');
}
function mapPointer(e, type) {
  const cv = $('czMapC'), r = cv.getBoundingClientRect(), dpr = W.mapDpr, px = (e.clientX - r.left) * dpr, py = (e.clientY - r.top) * dpr;
  if (type === 'down') { W.mapDrag = { x: px, y: py, cx: W.mapCx, cz: W.mapCz, moved: 0 }; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); }
  else if (type === 'move' && W.mapDrag) { const sc = W.mapZ * dpr, dx = px - W.mapDrag.x, dy = py - W.mapDrag.y; W.mapDrag.moved = Math.max(W.mapDrag.moved, Math.hypot(dx, dy)); W.mapCx = W.mapDrag.cx - dx / sc; W.mapCz = W.mapDrag.cz - dy / sc; drawMap(); }
  else if (type === 'up' && W.mapDrag) { if (W.mapDrag.moved < 6 * dpr) { let best = null, bd = 18 * dpr; (W.mapHits || []).forEach(function (h) { const d = Math.hypot(h.x - px, h.y - py); if (d < bd) { bd = d; best = h.m; } }); if (best) mapInfo(best);
      else if (C.S.set.admin) { /* admin: jump to the spot you tapped */ const sc = W.mapZ * dpr; let x = W.mapCx + (px - cv.width / 2) / sc, z = W.mapCz + (py - cv.height / 2) / sc; const d = Math.hypot(x, z), lim = EDGE + 1; if (d > lim) { x *= lim / d; z *= lim / d; }
        W.px = x; W.pz = z; W.py = groundAt(x, z); W.vx = W.vz = W.vy = 0; W.swim = false; W.flying = false; closeMap(); } } W.mapDrag = null; }
}
function mapZoom(f) { W.mapZ = Math.max(1.2, Math.min(9, W.mapZ * f)); drawMap(); }

/* ---------- GIVE HINT: gentle clue first, then direction, then a marker and a light beam ---------- */
function dirWord(dx, dz) { const d = Math.hypot(dx, dz); if (d < 4) return tx('cz.dir.here'); const a = (Math.atan2(-dz, dx) * 180 / Math.PI + 360) % 360, k = Math.round(a / 45) % 8; return tx('cz.dir.' + ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'][k]); }
function nearestArea(x, z) { let best = null, bd = 1e9; AREAS.forEach(function (a) { if (a[3] && !st().found[a[3]]) return; const d = Math.hypot(a[1] - x, a[2] - z); if (d < bd) { bd = d; best = a[0]; } }); return tx('cz.ar.' + best); }
function hintPlan() {
  const s = st(), npcAt = function (id) { const n = W.npcs.find(function (q) { return q.id === id; }); return { x: n.x, z: n.z }; };
  if (W.under) return { id: 'under', keys: ['cz.h.under', 'cz.h.under', 'cz.h.under'] };
  if (!s.f.pip) return Object.assign({ id: 'm0', keys: ['cz.h.m0a', 'cz.h.m0b', 'cz.h.m0c'] }, npcAt('pip'));
  if (!s.f.tools) return Object.assign({ id: 'm1', keys: ['cz.h.m1a', 'cz.h.m1b', 'cz.h.m1c'] }, npcAt('ama'));
  if (!s.f.solved && evCount() < 3) {
    const order = ['water', 'oxygen', 'micro', 'farm'], k = order.find(function (q) { return !s.ev[q] && !(q === 'micro' && !s.samples.pond); }) || 'water';
    const sp = spots().find(function (q) { return q.id === { water: 'pond', oxygen: 'kit', micro: 'scope', farm: 'bags' }[k]; });
    return { id: 'm2' + k, keys: ['cz.h.m2a', 'cz.h.m2b', 'cz.h.m2c'], x: sp.x, z: sp.z, vars: { item: tx('cz.m.k.' + k) } };
  }
  if (!s.f.solved) return Object.assign({ id: 'm3', keys: ['cz.h.m3a', 'cz.h.m3b', 'cz.h.m3c'] }, npcAt('ama'));
  if (!s.f.fixed) { const p0 = W.plants.find(function (q) { return !s.f['p' + q.i]; }); if (p0) return { id: 'm4' + p0.i, keys: ['cz.h.m4a', 'cz.h.m4b', 'cz.h.m4c'], x: p0.x, z: p0.z }; }
  /* free exploring: an animal with something to say, or the nearest discovery not found yet */
  let best = null, bd = 1e9;
  voices().forEach(function (v) { if (!v.clue || (s.voices && s.voices[v.key || v.id]) || (v.when && !v.when())) return; const x = v.live === 'deer' ? W.dr.x : v.x, z = v.live === 'deer' ? W.dr.z : v.z, d = Math.hypot(x - W.px, z - W.pz); if (d < 45 && d < bd) { bd = d; best = { id: 'v' + v.id, keys: ['cz.h.voice1', 'cz.h.voice2', 'cz.h.voice3'], x: x, z: z, vars: { who: tx('cz.lt.' + v.id) } }; } });
  if (best) return best;
  spots().forEach(function (sp) { if (!FINDS.some(function (f) { return f.id === sp.id; }) || s.found[sp.id] || (sp.when && !sp.when())) return; const d = Math.hypot(sp.x - W.px, sp.z - W.pz); if (d < bd) { bd = d; best = { id: 'f' + sp.id, keys: ['cz.h.find1', 'cz.h.find2', 'cz.h.find3'], x: sp.x, z: sp.z, vars: { hab: tx('cz.hb.' + habitatAt(sp.x, sp.z)) } }; } });
  return best || { id: 'done', keys: ['cz.h.done', 'cz.h.done', 'cz.h.done'] };
}
function giveHint() {
  if (!W || W.talk) return; const h = hintPlan();
  if (W.hintId === h.id) W.hintLv = Math.min(3, (W.hintLv || 1) + 1); else { W.hintId = h.id; W.hintLv = 1; }
  const lv = W.hintLv, vars = Object.assign({}, h.vars || {});
  if (h.x != null) { const dx = h.x - W.px, dz = h.z - W.pz; vars.dir = dirWord(dx, dz); vars.n = Math.max(5, Math.round(Math.hypot(dx, dz) / 5) * 5); vars.area = nearestArea(h.x, h.z); }
  let text = tx(h.keys[lv - 1], vars); if (lv === 1 && h.x != null && Math.hypot(h.x - W.px, h.z - W.pz) > 70) text += ' ' + tx('cz.h.lost');
  if (lv === 3 && h.x != null) { W.hintTarget = { x: h.x, z: h.z, t: 45 }; W.beacon.position.set(h.x, H(h.x, h.z) + 15, h.z); W.beacon.visible = true; }
  const dots = '●'.repeat(lv) + '○'.repeat(3 - lv);
  $('czHint').innerHTML = '<h3>💡 ' + C.esc(tx('cz.h.title')) + ' <span class="dim">' + dots + '</span></h3><p>' + C.esc(text) + '</p><p class="dim">' + C.esc(tx(lv < 3 && h.x != null ? 'cz.h.more' : 'cz.h.last')) + '</p><button type="button" data-hclose="1">' + C.esc(tx('cz.close')) + '</button>';
  $('czHint').hidden = false; W.hintT = 18; amb('sfx', 'chime', 0.6);
}

/* ---------- DAY AND NIGHT: one full day takes about 20 minutes ---------- */
const SKYK = [[0, '#060a1e', '#121a36'], [4.6, '#0a1230', '#1c2448'], [5.6, '#3a4a8a', '#d08a7a'], [6.6, '#5a8ad0', '#ffd0a0'], [8.2, '#4a9ee0', '#d8eef8'], [16.2, '#4a9ee0', '#d8eef8'], [17.6, '#5a80c4', '#ffd090'], [18.6, '#4a4a90', '#ff9060'], [19.4, '#2a2a68', '#c06a6a'], [20.4, '#101640', '#3a3a62'], [21.4, '#070c24', '#141c3a'], [24, '#060a1e', '#121a36']];
function isNight() { const t = W ? W.tod : 12; return t < 5.4 || t > 20.2; }
function todName(t) { return t < 5.4 || t >= 21 ? 'night' : t < 7 ? 'dawn' : t < 11 ? 'morning' : t < 13.5 ? 'noon' : t < 16.5 ? 'afternoon' : t < 18.3 ? 'golden' : t < 19.6 ? 'sunset' : 'twilight'; }
function skyAt(t) { for (let i = 0; i < SKYK.length - 1; i++) { const a = SKYK[i], b = SKYK[i + 1]; if (t >= a[0] && t <= b[0]) { const u = (t - a[0]) / (b[0] - a[0]); return [new T.Color(a[1]).lerp(new T.Color(b[1]), u), new T.Color(a[2]).lerp(new T.Color(b[2]), u)]; } } return [new T.Color(SKYK[0][1]), new T.Color(SKYK[0][2])]; }
function dayLight() {
  const t = W.tod, a = (t - 6) / 12 * Math.PI, el = Math.sin(a), sky = skyAt(t), top = sky[0], hor = sky[1], scene = C.scene, day = Math.max(0, Math.min(1, el * 2.4 + 0.15)), dusk = Math.max(0, 1 - Math.abs(el) * 4);
  const sp = W.skyG.attributes.position, col = W.skyG.attributes.color, tmp = new T.Color();
  for (let i = 0; i < sp.count; i++) { const u = Math.max(0, sp.getY(i) / 520); tmp.copy(hor).lerp(top, Math.pow(u, 0.6)); col.setXYZ(i, tmp.r, tmp.g, tmp.b); } col.needsUpdate = true;
  if (!W.camUnder) { scene.fog.color.copy(hor).lerp(top, 0.25); scene.background.copy(hor); }
  W.sun.position.set(Math.cos(a) * 400, Math.max(-60, el * 300), 160); W.sun.material.opacity = el > -0.05 ? 0.9 : 0; W.sun.material.color.set(el < 0.25 ? '#ffb070' : '#fff4c8');
  W.moon.position.set(-Math.cos(a) * 380, Math.max(-60, -el * 280 + 40), -140); W.moon.visible = el < 0.15;
  W.stars.material.opacity = Math.max(0, Math.min(0.95, -el * 3));
  const sunCol = new T.Color('#ffeccc').lerp(new T.Color('#ff9a5a'), dusk * 0.8);
  if (el > -0.08) { C.KEYL.color.copy(sunCol); C.KEYL.intensity = 0.32 + 0.66 * day + 0.25 * dusk; C.KEYL.position.set(Math.cos(a) * 80, Math.max(8, el * 80), 40); }
  else { C.KEYL.color.set('#9ab0ff'); C.KEYL.intensity = 0.32; C.KEYL.position.set(-Math.cos(a) * 60, 50, -40); }
  C.HEMI.intensity = 0.4 + 0.12 * day + 0.05 * dusk; C.HEMI.color.copy(new T.Color('#3a4a8a').lerp(new T.Color('#fff0d2'), day)); C.HEMI.groundColor.copy(new T.Color('#141a2a').lerp(new T.Color('#4a5a2a'), day));
  if (W.cloudIM) { const cm = W.cloudIM.material; cm.color.copy(new T.Color('#3a4060').lerp(new T.Color('#ffffff'), day)).lerp(new T.Color('#ffb08a'), dusk * 0.5); cm.emissive.copy(new T.Color('#10142a').lerp(new T.Color('#c8d8e8'), day)).lerp(new T.Color('#c0705a'), dusk * 0.4); }
  const night = isNight(); W.ffly.forEach(function (f) { f.visible = night || t > 19.6; }); W.porch.material.opacity = el < 0.05 ? 0.9 : 0; W.moth.visible = night;
  W.beams.forEach(function (b) { b.m.material.opacity = (el > 0.1 ? 0.18 + 0.2 * (1 - el) : 0) * (0.7 + 0.3 * Math.sin(W.t * 0.6 + b.ph)); });
  W.pollen.visible = day > 0.4;
  const nm = todName(t); if (nm !== W.todLast) { W.todLast = nm; if (W.clock) W.clock.textContent = (night ? '🌙 ' : el < 0.25 ? '🌅 ' : '☀️ ') + tx('cz.tod.' + nm); if (nm === 'twilight' && !st().f.toldNight) { st().f.toldNight = 1; queueCard('cz.nightTip', 8); } }
}
function sparkOut(big) { const f = W.fire, q = W.sparks.find(function (k) { return k.life <= 0; }); if (!q) return; const a = Math.random() * 6.283, sp = (big ? 1.6 : 0.8) + Math.random() * 1.2;
    q.life = 0.8 + Math.random() * 0.9; q.x = f.x + Math.cos(a) * 0.15; q.z = f.z + Math.sin(a) * 0.15; q.y = H(f.x, f.z) + 0.6; q.vx = Math.cos(a) * sp * 0.35; q.vz = Math.sin(a) * sp * 0.35; q.vy = 2 + Math.random() * 2.5; q.m.visible = true; }
function fireUse() {
  const s = st();
  if (!W.fire.lit) { W.fire.lit = true; W.fire.grow = 0; s.f.fire = 1; saveSoon(); W.flames.visible = true; W.flames.scale.setScalar(0.05); amb('sfx', 'whoosh', 0.5); for (let k = 0; k < 14; k++) sparkOut(true); say('cz.s.fireLit'); return; }
  sitDown();
}
function sitDown() {
  const b = W.benches.reduce(function (a, q) { return Math.hypot(q.x - W.px, q.z - W.pz) < Math.hypot(a.x - W.px, a.z - W.pz) ? q : a; });
  W.px = b.x; W.pz = b.z; W.py = H(b.x, b.z) + 0.25; W.vx = W.vz = 0; W.face = Math.atan2(W.fire.x - b.x, W.fire.z - b.z); W.sitting = true; W.ui = 'rest'; W.k = {}; W.talkFocus = { x: W.fire.x, z: W.fire.z, y: H(W.fire.x, W.fire.z) + 0.6 };
  $('czRest').innerHTML = '<h3>' + C.esc(tx('cz.rest.title')) + '</h3><p>' + C.esc(tx('cz.rest.text')) + '</p><div class="ch">' + [['sunset', 18.4], ['night', 22], ['morning', 7.5], ['sit', -1]].map(function (o, i) { return '<button type="button" data-rest="' + o[1] + '">' + (i + 1) + '. ' + C.esc(tx('cz.rest.' + o[0])) + '</button>'; }).join('') +
    '</div><p><button type="button" data-rest="journal">📓 ' + C.esc(tx('cz.rest.journal')) + '</button> <button type="button" class="primary" data-rest="up">' + C.esc(tx('cz.rest.up')) + '</button></p>';
  $('czRest').hidden = false; amb('mood', 'rest', 3);
}
function standUp() { W.sitting = false; W.ui = null; W.restTo = null; $('czRest').hidden = true; W.moodT = 0; }
function restChoice(v) { if (v === 'up') { standUp(); return; } if (v === 'journal') { openJ(); return; } const n = +v; if (n > 0) W.restTo = n; }
/* the music follows where you are and the time of day; nature sounds follow what is near you */
function moodNow() {
  if (W.camUnder) return 'under'; if (W.sitting) return 'rest'; const t = W.tod;
  if (isNight()) return 'night';
  const d = Math.hypot(W.px, W.pz), hab = habitatAt(W.px, W.pz);
  if (W.flying && W.py > H(W.px, W.pz) + 8 || hab === 'hill' || (d > EDGE - 6 && edgeW(W.px, W.pz).w > 0.4)) return 'vista';
  if (hab === 'forest' || hab === 'hollow') return 'forest'; if (hab === 'pond' || hab === 'stream' || hab === 'spring' || Math.hypot(W.px - POND.x, W.pz - POND.z) < 20) return 'water';
  return 'meadow';
}
function soundscape(dt) {
  W.moodT = (W.moodT || 0) - dt; if (W.moodT <= 0) { W.moodT = 1; const m = moodNow(); if (m !== W.moodNow && (!W.moodHold || W.t > W.moodHold || m === 'under' || m === 'rest')) { W.moodNow = m; W.moodHold = W.t + 10; if (!W.camUnder) amb('mood', m, 4); } }
  W.envT = (W.envT || 0) - dt; if (W.envT > 0) return; W.envT = 0.5;
  const night = isNight(), el = Math.sin((W.tod - 6) / 12 * Math.PI), dS = streamDist(W.px, W.pz), dP = Math.max(0, Math.hypot(W.px - POND.x, W.pz - POND.z) - 14), dF = Math.min(Math.hypot(W.px - SPRING.x, W.pz + 64), Math.hypot(W.px + 2.5, W.pz - 70));
  const near = function (d, r) { return Math.max(0, 1 - d / r); };
  amb('env', 'water', Math.min(0.9, near(dS, 18) * 0.8 + near(dP, 16) * 0.25));
  amb('env', 'falls', near(dF, 30) * 0.9);
  amb('env', 'wind', 0.12 + (W.flying ? 0.35 : 0) + (habitatAt(W.px, W.pz) === 'hill' || Math.hypot(W.px, W.pz) > EDGE - 6 ? 0.25 : 0));
  amb('env', 'birds', night ? 0 : el > 0 ? 0.55 : 0.2);
  amb('env', 'crickets', night ? 0.5 : el < 0.15 ? 0.25 : 0);
  amb('env', 'frogs', (night || el < 0.2) ? near(dP, 30) * 0.8 : 0);
  amb('env', 'owl', night ? near(Math.hypot(W.px - 35, W.pz - 46), 60) * 0.8 : 0);
  amb('env', 'fire', W.fire && W.fire.lit ? near(Math.hypot(W.px - W.fire.x, W.pz - W.fire.z), 14) * 0.9 : 0);
}

/* ---------- WILDLIFE SURVEYS: count, sample, compare ---------- */
const SVSITES = [
  { id: 'poll.meadow', kind: 'tally', what: 'poll', x: -1, z: 44, cx: 1, cz: 41, rate: [1.4, 2.8] },
  { id: 'poll.farm', kind: 'tally', what: 'poll', x: -40.5, z: -36, cx: -43, cz: -36, rate: [6, 10] },
  { id: 'frog', kind: 'tally', what: 'frog', x: -4, z: 27.5, cx: -8, cz: 27 },
  { id: 'kick.up', kind: 'kick', x: -31.5, z: -51 },
  { id: 'kick.down', kind: 'kick', x: -38.5, z: -25 }];
const BUGS = { mayfly: 1, stonefly: 1, caddis: 1, penny: 1, midge: 0, worm: 0, leech: 0, snail: 0 };
const KICKS = { 'kick.up': ['mayfly', 'stonefly', 'mayfly', 'caddis', 'midge', 'penny', 'mayfly', 'stonefly', 'worm', 'midge'], 'kick.down': ['midge', 'worm', 'leech', 'midge', 'caddis', 'snail', 'worm', 'midge', 'midge', 'worm'] };
function bugSVG(k) {
  const W0 = 90, H0 = 50; let b = '';
  if (k === 'mayfly') b = '<ellipse cx="38" cy="25" rx="20" ry="7" fill="#8a6a3a"/><circle cx="16" cy="25" r="6" fill="#7a5a2a"/>' + [0, 1, 2, 3].map(function (i) { return '<ellipse cx="' + (32 + i * 7) + '" cy="16" rx="3" ry="4" fill="#c8a86a"/><ellipse cx="' + (32 + i * 7) + '" cy="34" rx="3" ry="4" fill="#c8a86a"/>'; }).join('') + '<path d="M58 25 L84 16 M58 25 L86 25 M58 25 L84 34" stroke="#6a4a2a" stroke-width="2"/>';
  if (k === 'stonefly') b = '<ellipse cx="42" cy="25" rx="24" ry="6" fill="#6a5a3a"/><circle cx="14" cy="25" r="6" fill="#5a4a2a"/><path d="M10 20 L2 10 M10 30 L2 40 M66 25 L86 18 M66 25 L86 32" stroke="#4a3a1a" stroke-width="2"/>' + [0, 1, 2].map(function (i) { return '<path d="M' + (30 + i * 10) + ' 20 L' + (26 + i * 10) + ' 10 M' + (30 + i * 10) + ' 30 L' + (26 + i * 10) + ' 40" stroke="#4a3a1a" stroke-width="2"/>'; }).join('');
  if (k === 'caddis') b = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<circle cx="' + (24 + i * 8) + '" cy="' + (25 + (i % 2 ? 3 : -3)) + '" r="6" fill="' + ['#a89a80', '#8a7a60', '#c8b898'][i % 3] + '"/>'; }).join('') + '<circle cx="14" cy="25" r="6" fill="#e8d8a8"/><path d="M10 25 L4 18 M10 25 L4 32" stroke="#6a4a2a" stroke-width="2"/>';
  if (k === 'penny') b = '<ellipse cx="45" cy="25" rx="22" ry="18" fill="#b8742a"/>' + [0, 1, 2, 3].map(function (i) { return '<path d="M' + (27 + i * 2) + ' ' + (15 + i * 5) + ' Q45 ' + (10 + i * 7) + ' ' + (63 - i * 2) + ' ' + (15 + i * 5) + '" stroke="#7a4a1a" fill="none" stroke-width="2"/>'; }).join('');
  if (k === 'midge') b = '<path d="M14 30 Q30 10 45 28 T80 22" stroke="#d03a3a" stroke-width="6" fill="none" stroke-linecap="round"/>';
  if (k === 'worm') b = '<path d="M8 28 Q25 18 45 26 T86 24" stroke="#c88a8a" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="4 2"/>';
  if (k === 'leech') b = '<ellipse cx="45" cy="25" rx="34" ry="9" fill="#3a3a2a"/><circle cx="12" cy="25" r="5" fill="#2a2a1a"/><circle cx="78" cy="25" r="7" fill="#2a2a1a"/><path d="M20 22 L70 22" stroke="#6a6a3a" stroke-width="2" stroke-dasharray="3 3"/>';
  if (k === 'snail') b = '<ellipse cx="50" cy="34" rx="26" ry="6" fill="#8a7a6a"/><circle cx="40" cy="22" r="14" fill="#c8a870"/><path d="M40 22 m-9 0 a9 9 0 1 0 9 -9 a5 5 0 1 0 5 5" stroke="#7a5a2a" fill="none" stroke-width="2"/>';
  return '<svg viewBox="0 0 ' + W0 + ' ' + H0 + '" width="' + W0 + '" height="' + H0 + '" aria-hidden="true">' + b + '</svg>';
}
function svSite(id) { return SVSITES.find(function (q) { return q.id === id; }); }
function svStart(id) {
  const site = svSite(id); if (!site || W.talk) return; W.k = {}; W.vx = W.vz = 0; W.ui = 'survey';
  if (site.kind === 'kick') { kickStart(site); return; }
  const real = site.what === 'frog' ? (isNight() ? 'frog.night' : 'frog.day') : site.id;
  W.sv = { site: site, rid: real, t: 30, n: 0, m: 0, next: 1.2, on: false, ev: [] };
  const dx = site.cx - W.px, dz = site.cz - W.pz; W.face = Math.atan2(dx, dz); W.yaw = Math.atan2(-dx, -dz); W.pitch = 0.32; W.distT = 7.5;
  svPanel();
}
function svPanel() {
  const v = W.sv, site = v.site, ttl = site.what === 'frog' ? 'cz.sv.frogT' : 'cz.sv.pollT';
  if (!v.on && v.t >= 30) $('czSurvey').innerHTML = '<h3>📋 ' + C.esc(tx(ttl)) + ' · ' + C.esc(tx('cz.sv.' + v.rid)) + '</h3><p>' + C.esc(tx(site.what === 'frog' ? 'cz.sv.frogI' : 'cz.sv.pollI')) + '</p><p><button type="button" class="primary" data-sv="go">' + C.esc(tx('cz.sv.go')) + '</button> <button type="button" data-sv="stop">' + C.esc(tx('cz.sv.cancel')) + '</button></p>';
  else if (v.on) $('czSurvey').innerHTML = '<h3>📋 ' + C.esc(tx(ttl)) + ' · ' + C.esc(tx('cz.sv.' + v.rid)) + '</h3><div class="svbar"><i style="width:' + Math.round(v.t / 30 * 100) + '%"></i></div><p class="svn">' + C.esc(tx('cz.sv.count')) + ': <b>' + v.n + '</b></p><p><button type="button" class="primary big" data-sv="tally">' + C.esc(tx('cz.sv.tally')) + '</button> <button type="button" data-sv="stop">' + C.esc(tx('cz.sv.cancel')) + '</button></p>';
  $('czSurvey').hidden = false;
}
function svTally() { const v = W.sv; if (!v || !v.on) return; v.n++; amb('sfx', 'step', 0.6); const b = $('czSurvey').querySelector('.svn b'); if (b) b.textContent = v.n; }
function svEvent(v) {
  const site = v.site, a = Math.random() * 6.283, r = 1 + Math.random() * 3.5, x = site.cx + Math.cos(a) * r, z = site.cz + Math.sin(a) * r * 0.6, g = new T.Group();
  if (site.what === 'frog') { const fm = BQ.creatures.makeFrog(), f = fm.g; f.scale.setScalar(1.2); f.rotation.y = Math.random() * 6.28; BQ.creatures.poseFrog(fm, 0.3, 0, true); g.add(f); toonify(f); const ring = new T.Mesh(new T.RingGeometry(0.4, 0.55, 20), C.basic('#e8fbff', 0.7)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; g.add(ring); g.position.set(x, Math.max(H(x, z), WL0 - 0.15), z); if (v.rid === 'frog.night') { amb('env', 'frogs', 0.9); C.beep(140 + Math.random() * 40, 0.12, 'square'); } }
  else { const CRT = BQ.creatures, isBee = Math.random() < 0.5, b = isBee ? CRT.makeBee() : CRT.makeButterfly(['monarch', 'cabbage', 'azure', 'swallowtail'][Math.floor(Math.random() * 4)]); if (isBee) { b.g.scale.setScalar(1.3); CRT.poseBee(b, 0.1, true); } else CRT.poseButterfly(b, 0.3, 'rest'); b.g.rotation.y = Math.random() * 6.28; g.add(b.g); toonify(b.g); g.add(C.glow('#fff4b0', 1, 0.7)); g.position.set(x, H(x, z) + 0.45, z); }
  W.g.add(g); v.ev.push({ g: g, t: site.what === 'frog' ? 2.2 : 1.8 }); v.m++;
}
function svStep(dt) {
  const v = W.sv; if (!v) return;
  v.ev = v.ev.filter(function (e) { e.t -= dt; e.g.children.forEach(function (c, k) { if (k === 0 && c.children && c.children.length) c.children.forEach(function (w, j) { if (j) w.rotation.z = Math.sin(W.t * 30) * 0.6; }); }); if (e.t > 0) return true; W.g.remove(e.g); return false; });
  if (!v.on) return;
  v.t -= dt; v.next -= dt;
  if (v.next <= 0 && v.t > 1.5) { svEvent(v); const site = v.site, rate = site.what === 'frog' ? (v.rid === 'frog.night' ? [1.4, 2.6] : [7, 11]) : site.rate; v.next = rate[0] + Math.random() * (rate[1] - rate[0]); }
  const bar = $('czSurvey').querySelector('.svbar i'); if (bar) bar.style.width = Math.max(0, Math.round(v.t / 30 * 100)) + '%';
  if (v.t <= 0) svEnd();
}
function svEnd() {
  const v = W.sv, s = st(); v.on = false; if (!s.surveys) s.surveys = {}; s.surveys[v.rid] = { n: v.n, m: v.m, tod: W.tod, at: Date.now() }; saveSoon();
  const done = Object.keys(s.surveys).length; if (done >= 3) C.award('cz-survey');
  $('czSurvey').innerHTML = '<h3>📋 ' + C.esc(tx('cz.sv.' + v.rid)) + '</h3><p>' + C.esc(tx('cz.sv.res', { n: v.n, m: v.m })) + ' ' + C.esc(tx(Math.abs(v.n - v.m) <= 0 ? 'cz.sv.resPerfect' : 'cz.sv.resMiss')) + '</p><p><b>' + C.esc(tx('cz.sv.' + v.rid + 'R')) + '</b></p><p class="dim">' + C.esc(tx('cz.sv.compare')) + '</p><p><button type="button" class="primary" data-sv="stop">' + C.esc(tx('cz.close')) + '</button></p>';
  amb('sfx', 'discover');
}
function svStop() { if (W.sv) W.sv.ev.forEach(function (e) { W.g.remove(e.g); }); W.sv = null; W.kick = null; W.ui = null; $('czSurvey').hidden = true; }
function kickStart(site) {
  W.kick = { site: site, items: KICKS[site.id].map(function (k) { return { k: k, ok: null }; }) }; amb('sfx', 'splash', 0.7); kickDraw();
}
function kickDraw() {
  const kk = W.kick, done = kk.items.every(function (q) { return q.ok === true; });
  let h = '<h3>🪣 ' + C.esc(tx('cz.sv.kickT')) + ' · ' + C.esc(tx('cz.sv.' + kk.site.id)) + '</h3>';
  if (!done) {
    h += '<p>' + C.esc(tx('cz.sv.kickI')) + '</p><p class="dim">' + C.esc(tx('cz.sv.guide')) + '</p><div class="bugs">' + kk.items.map(function (q, i) {
      return '<div class="bug' + (q.ok ? ' ok' : q.ok === false ? ' no' : '') + '">' + bugSVG(q.k) + '<b>' + C.esc(tx('cz.bug.' + q.k)) + '</b><small>' + C.esc(tx('cz.bugd.' + q.k)) + '</small>' +
        (q.ok ? '<span class="tag">' + C.esc(tx(BUGS[q.k] ? 'cz.sv.need' : 'cz.sv.tol')) + ' ✓</span>' : '<span class="bb"><button type="button" data-bug="' + i + '" data-v="1">' + C.esc(tx('cz.sv.need')) + '</button><button type="button" data-bug="' + i + '" data-v="0">' + C.esc(tx('cz.sv.tol')) + '</button></span>' + (q.ok === false ? '<small class="bad">' + C.esc(tx('cz.sv.wrong')) + '</small>' : '')) + '</div>'; }).join('') + '</div>';
  } else {
    const sens = kk.items.filter(function (q) { return BUGS[q.k]; }).length, t = kk.items.length, q = sens / t >= 0.6 ? 'good' : sens / t >= 0.3 ? 'fair' : 'poor', s = st();
    if (!s.surveys) s.surveys = {}; if (!s.surveys[kk.site.id]) { s.surveys[kk.site.id] = { sens: sens, n: t, q: q, tod: W.tod, at: Date.now() }; saveSoon(); if (Object.keys(s.surveys).length >= 3) C.award('cz-survey'); amb('sfx', 'discover'); }
    h += '<p>' + C.esc(tx('cz.sv.kickRes', { s: sens, t: t, q: tx('cz.sv.q.' + q) })) + '</p><p><b>' + C.esc(tx('cz.sv.' + kk.site.id + 'R')) + '</b></p><p class="dim">' + C.esc(tx('cz.sv.compare')) + '</p>';
  }
  h += '<p><button type="button" class="primary" data-sv="stop">' + C.esc(tx(done ? 'cz.close' : 'cz.sv.cancel')) + '</button></p>';
  $('czSurvey').innerHTML = h; $('czSurvey').hidden = false;
}
function kickSort(i, v) { const q = W.kick.items[i]; q.ok = (BUGS[q.k] ? 1 : 0) === v ? true : false; C.beep(q.ok ? 880 : 220, 0.12, q.ok ? 'triangle' : 'sawtooth'); kickDraw(); }
/* ---------- EVERY FRAME ---------- */
function step(dt) {
  if (!W) return; W.t += dt; const cam = C.cam, s = st();
  /* scenery life: swaying trees, bees, rabbit, hawk, fish, fireflies, frog */
  W.anim.forEach(function (a) { if (a.sway) a.m.rotation.z = Math.sin(W.t * 1.2 + a.ph) * 0.03; if (a.fly) { a.m.position.y = a.y + Math.sin(W.t * 1.5 + a.ph) * 0.6; a.m.position.x = a.x + Math.sin(W.t * 0.7 + a.ph) * 0.8; } });
  if (W.wild) W.wild.update(dt, { x: W.px, z: W.pz }, { night: isNight() });
  if (W.waders) W.waders.forEach(function (w) {
    if (w.circle) { const c = w.circle; c.a += dt * 0.11 * (16 / c.r); w.g.position.set(c.cx + Math.cos(c.a) * c.r, c.y + Math.sin(W.t * 0.4 + c.a) * 1.2, c.cz + Math.sin(c.a) * c.r); w.g.rotation.set(0, Math.atan2(-Math.sin(c.a), Math.cos(c.a)), -0.2); w.mixer.update(dt); return; }
    /* the heron: every minute or so it flies across the reserve, low over the pond */
    if (!w.fly) { w.t += dt; if (w.t > 0) { const ends = [[-130, 30, 150], [70, 18, -110], [-120, 24, -80], [130, 4, 40], [40, -6, 170]], a = ends[Math.floor(Math.random() * ends.length)]; let d = ends[Math.floor(Math.random() * ends.length)]; if (d === a) d = ends[(ends.indexOf(a) + 2) % ends.length];
        w.fly = { A: new T.Vector3(a[0], a[1], a[2]), B: new T.Vector3(POND.x + 8, WL0 + 9, POND.z - 6), C: new T.Vector3(POND.x - 6, WL0 + 11, POND.z + 6), D: new T.Vector3(d[0], d[1], d[2]), u: 0 }; w.fly.dur = (w.fly.A.distanceTo(w.fly.B) + w.fly.B.distanceTo(w.fly.C) + w.fly.C.distanceTo(w.fly.D)) / 9; w.g.visible = true; } return; }
    const f = w.fly; f.u += dt / f.dur; if (f.u >= 1) { w.fly = null; w.g.visible = false; w.t = -50 - Math.random() * 40; return; }
    const pt = function (t, out) { const u = 1 - t; return out.set(u * u * u * f.A.x + 3 * u * u * t * f.B.x + 3 * u * t * t * f.C.x + t * t * t * f.D.x, u * u * u * f.A.y + 3 * u * u * t * f.B.y + 3 * u * t * t * f.C.y + t * t * t * f.D.y, u * u * u * f.A.z + 3 * u * u * t * f.B.z + 3 * u * t * t * f.C.z + t * t * t * f.D.z); };
    const p0 = pt(f.u, w.g.position), p1 = pt(Math.min(1, f.u + 0.01), new T.Vector3()); w.g.rotation.set(0, Math.atan2(p1.x - p0.x, p1.z - p0.z), 0); w.act.timeScale = Math.sin(W.t * 0.5) > 0.6 ? 0.25 : 0.9; w.mixer.update(dt);
  });
  W.bees.forEach(function (b, i) { const P = function (t) { return [6 + Math.sin(t * 0.8 + b.ph) * 4, 44 + Math.cos(t * 0.6 + b.ph) * 3]; }, p = P(W.t), q = P(W.t + 0.05); b.m.position.set(p[0], H(p[0], p[1]) + 0.9 + Math.sin(W.t * 6 + i) * 0.2, p[1]); b.m.rotation.y = Math.atan2(q[0] - p[0], q[1] - p[1]); BQ.creatures.poseBee(b.b, dt, false); });
  const r = W.rab; r.t -= dt; if (r.t <= 0) { r.t = 1.5 + Math.random() * 2; r.tx = Math.max(-4, Math.min(20, r.x + (Math.random() - 0.5) * 8)); r.tz = Math.max(36, Math.min(54, r.z + (Math.random() - 0.5) * 8)); }
  const flee = Math.hypot(W.px - r.x, W.pz - r.z) < 4 && !(W.near && W.near.id === 'rabbit'); if (flee) { r.tx = r.x + (r.x - W.px) * 2; r.tz = r.z + (r.z - W.pz) * 2; }
  const ox = r.x, oz = r.z; r.x += Math.sign(r.tx - r.x) * Math.min(Math.abs(r.tx - r.x), dt * (flee ? 5 : 2)); r.z += Math.sign(r.tz - r.z) * Math.min(Math.abs(r.tz - r.z), dt * (flee ? 5 : 2));
  { const mv = Math.hypot(r.x - ox, r.z - oz) > dt * 0.3; if (mv) { r.hp = (r.hp || 0) + dt * (flee ? 3.6 : 2.6); W.rabbit.rotation.y = Math.atan2(r.x - ox, r.z - oz); } else r.hp = 0; const hop = mv ? r.hp % 1 : 0;
    W.rabbit.position.set(r.x, GH(r.x, r.z) + Math.sin(hop * Math.PI) * (flee ? 0.4 : 0.25), r.z); BQ.creatures.poseRabbit(W.rabM, dt, hop, !mv && Math.hypot(W.px - r.x, W.pz - r.z) < 7); }
  W.hawk.position.set(10 + Math.cos(W.t * 0.3) * 18, 26, 44 + Math.sin(W.t * 0.3) * 18); W.hawk.rotation.y = -W.t * 0.3; W.hawk.rotation.z = 0.25;
  if (W.heronM) { W.heronNext -= dt; if (W.heronNext <= 0 && !W.heronStrike) { W.heronStrike = 0.001; W.heronNext = 7 + Math.random() * 8; } if (W.heronStrike) { W.heronStrike += dt / 1.4; if (W.heronStrike >= 1) W.heronStrike = 0; } BQ.creatures.poseHeron(W.heronM, dt, W.heronStrike); }
  if (W.springFish) W.springFish.forEach(function (f, i) { const a = W.t * 0.9 + i * 2.1; f.position.set(SPRING.x + Math.cos(a) * 1.8, H(SPRING.x, SPRING.z) + 0.2, SPRING.z + Math.sin(a) * 1.2); f.rotation.y = Math.atan2(-Math.sin(a) * 1.8, Math.cos(a) * 1.2); BQ.creatures.poseFish(W.springFishM[i], dt, 0.5); });
  if (W.listenFx) { if (W.listenT > 0 || (W.talk && W.talk.lines[0] && W.talk.lines[0].animal)) { W.listenT = Math.max(0, (W.listenT || 0) - dt); W.listenFx.material.opacity = 0.45 + Math.sin(W.t * 8) * 0.3; W.listenFx.position.set(W.px, W.py + 2.3, W.pz); } else W.listenFx.material.opacity = 0; }
  W.tads.forEach(function (t0, i) { const a = W.t * 0.6 + t0.ph, x = W.tadAt[0] + Math.cos(a) * (1.2 + (i % 3) * 0.7), z = W.tadAt[1] + Math.sin(a * 1.3) * 1.4; t0.m.position.set(x, Math.max(H(x, z) + 0.3, WL0 - 0.6 - (i % 4) * 0.25), z); t0.m.rotation.y = -a; t0.tail.rotation.y = Math.sin(W.t * 18 + i) * 0.6; });
  if (W.camUnder) { const o = W._wo || (W._wo = new T.Object3D()); W.weedList.forEach(function (b, i) { if (i % 2) return; o.position.set(b[0], b[1], b[2]); o.scale.set(b[3], b[4], b[5]); o.rotation.set(Math.sin(W.t * 1.3 + i) * 0.12, b[6], Math.cos(W.t * 1.1 + i) * 0.1); o.updateMatrix(); W.weed.setMatrixAt(i, o.matrix); }); W.weed.instanceMatrix.needsUpdate = true; }
  /* pond fish wander: each picks a spot, swims there, sometimes rests; catfish stay near the bottom, pike hang still and then dart */
  if (W.fish.visible) W.fishM.forEach(function (fm, i) { const f = fm.g, wy = W.water.position.y; fm.t -= dt;
    if (fm.t <= 0) { const a = Math.random() * 6.283, rr = 2 + Math.random() * 10.5; fm.tx = POND.x + Math.cos(a) * rr; fm.tz = POND.z + Math.sin(a) * rr; const bot = H(fm.tx, fm.tz) + 0.5;
      fm.ty = fm.kind === 'catfish' ? bot : Math.max(bot, Math.min(wy - 0.6, wy - 0.7 - Math.random() * 2.5)); fm.t = fm.kind === 'pike' ? 4 + Math.random() * 6 : 2 + Math.random() * 5; fm.spd = fm.kind === 'pike' ? 3.2 : fm.kind === 'catfish' ? 0.5 : 0.7 + Math.random() * 0.8; fm.rest = Math.random() < 0.3; }
    if (fm.y == null) fm.y = wy - 1.2; const dx = fm.tx - fm.x, dz = fm.tz - fm.z, dl = Math.hypot(dx, dz); let sp = 0;
    if (dl > 0.3 && !(fm.kind === 'pike' && fm.t > 1.2)) { const want = Math.atan2(dx, dz); fm.yaw += (((want - fm.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 2.5); sp = Math.min(fm.spd, dl * 1.5) * (fm.rest && dl < 2 ? 0.3 : 1);
      fm.x += Math.sin(fm.yaw) * sp * dt; fm.z += Math.cos(fm.yaw) * sp * dt; }
    fm.y += (fm.ty - fm.y) * Math.min(1, dt * 0.8); f.position.set(fm.x, fm.y + Math.sin(W.t * 1.3 + i) * 0.04, fm.z); f.rotation.set(0, fm.yaw, 0); BQ.creatures.poseFish(fm, dt, Math.min(1, sp / 2)); });
  BQ.creatures.poseFrog(W.frogM, dt, W.frogJump ? Math.min(1, (1 - Math.max(0, W.frogJump)) * 2.2) : 0, !W.frogJump && (isNight() || Math.sin(W.t * 0.25) > 0.85));
  if (W.frogJump) { W.frogJump -= dt; const u = Math.max(0, W.frogJump); W.frog.position.set(-8 - (1 - u) * 4, H(-8, 30) + Math.sin((1 - u) * Math.PI) * 1.5, 30 - (1 - u) * 2); if (W.frogJump <= 0) { W.frogJump = 0; setTimeout(function () { if (W) W.frog.position.set(-8, H(-8, 30), 30); }, 6000); } }
  { const o = W._co || (W._co = new T.Object3D()); W.clouds.forEach(function (c, i) { c.x += dt * c.sp; if (c.x > 200) c.x = -200;
      for (let k = 0; k < 5; k++) { o.position.set(c.x + (k - 2) * 6, c.y + (k % 2) * 1.5, c.z + (k % 3) * 2); o.scale.set(7 + (k % 3) * 2, 3.5 + (k % 2), 5); o.updateMatrix(); W.cloudIM.setMatrixAt(i * 5 + k, o.matrix); } }); W.cloudIM.instanceMatrix.needsUpdate = true; }
  W.wfTex.offset.y += dt * 1.6; if (W.fall2) W.fall2.offset.y += dt * 1.6; /* water falls DOWN: the pattern moves toward the bottom of each waterfall */ if (W.seaTex) { W.seaTex.offset.x += dt * 0.004; W.seaTex.offset.y += dt * 0.002; }
  if (W.gulls) W.gulls.forEach(function (gl, k) { const a = W.t * 0.18 + gl.ph; gl.m.position.set(110 + Math.cos(a) * gl.r, 6 + k * 3 + Math.sin(W.t + k) * 1.5, -10 + Math.sin(a) * gl.r * 0.7); gl.m.rotation.y = -a; gl.m.children.forEach(function (w, j) { w.rotation.z = (j ? -1 : 1) * (0.25 + Math.sin(W.t * 4 + k) * 0.3); }); });
  if (W.mist2) W.mist2.forEach(function (m) { m.m.position.y = m.y + Math.sin(W.t * 2 + m.ph) * 0.4; }); if (W.creekTex) W.creekTex.offset.y -= dt * 0.35; W.mist.forEach(function (m) { m.m.position.y = m.y + Math.sin(W.t * 2 + m.ph) * 0.3; m.m.material.opacity = 0.25 + Math.sin(W.t * 3 + m.ph) * 0.1; });
  W.flies.forEach(function (f, i) { const a = W.t * 0.7 + f.ph, x = f.cx + Math.cos(a) * f.r, z = f.cz + Math.sin(a * 1.3) * f.r; f.m.position.set(x, H(x, z) + 1.4 + Math.sin(W.t * 2 + i) * 0.4, z); f.m.rotation.y = -a; f.m.children[0].rotation.z = Math.sin(W.t * 14 + i) * 0.8; f.m.children[1].rotation.z = -Math.sin(W.t * 14 + i) * 0.8; });
  /* dragonflies hover, then dart to a new spot over the shallows */
  W.dflies.forEach(function (d0, i) { d0.t -= dt; if (d0.t <= 0) { const a = Math.random() * 6.283, rr = Math.random() * 3.5; d0.tx = -31 + Math.cos(a) * rr; d0.tz = 31 + Math.sin(a) * rr * 0.8; d0.ty = WL0 + 0.7 + Math.random() * 1.1; d0.t = 0.8 + Math.random() * 2.4; }
    const dx = d0.tx - d0.x, dz = d0.tz - d0.z, dy = d0.ty - d0.y, dd = Math.hypot(dx, dz, dy), k = Math.min(1, dt * 7); d0.x += dx * k; d0.z += dz * k; d0.y += dy * k;
    if (dd > 0.3) { const want = Math.atan2(dx, dz); d0.yaw += (((want - d0.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 12); }
    d0.m.position.set(d0.x + Math.sin(W.t * 5 + i) * 0.03, d0.y + Math.sin(W.t * 4 + i) * 0.05, d0.z); d0.m.rotation.set(dd > 0.3 ? 0.15 : 0, d0.yaw, 0); BQ.creatures.poseDragonfly(d0.d, dt, false); });
  { const dm1 = new T.Object3D(); for (let i = 0; i < 24; i++) { const a = W.t * 0.35 + i * 0.27, rr = 1.2 + (i % 2) * 0.12, x = 14 + Math.cos(a) * rr + (i > 12 ? Math.cos(a) * 1.4 : 0), z = 4 + Math.sin(a) * rr; dm1.position.set(x, H(x, z) + 0.01, z); dm1.scale.setScalar(1.4); dm1.rotation.y = -a; dm1.updateMatrix(); W.ants.setMatrixAt(i, dm1.matrix); } W.ants.instanceMatrix.needsUpdate = true; }
  W.worms.forEach(function (w) { w.m.rotation.z = Math.sin(W.t * 3 + w.ph) * 0.6; w.m.scale.y = 0.3 + Math.abs(Math.sin(W.t * 2 + w.ph)) * 0.12; });
  { const dd = Math.hypot(W.px - W.dr.x, W.pz - W.dr.z), alert = dd < 8 || W.deerAlert > 0; if (W.deerAlert > 0) W.deerAlert -= dt;
    const D = W.dr; let walk = 0; /* the deer wanders slowly, grazing; if you come close it stops, faces you and raises its white tail */
    if (!alert) { D.t -= dt; if (D.t <= 0) { const a = Math.random() * 6.283, rr = Math.random() * 3.5; D.tx = -30 + Math.cos(a) * rr; D.tz = 50 + Math.sin(a) * rr; D.t = 6 + Math.random() * 8; }
      const dx = D.tx - D.x, dz = D.tz - D.z, dl = Math.hypot(dx, dz); if (dl > 0.15) { walk = 1; const sp = Math.min(dl, dt * 0.9); D.x += dx / dl * sp; D.z += dz / dl * sp; const want = Math.atan2(dx, dz); W.deer.rotation.y += (((want - W.deer.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 2.5); } }
    D.walk += (walk - D.walk) * Math.min(1, dt * 3); W.deer.position.set(D.x, GH(D.x, D.z), D.z); BQ.creatures.poseDeer(W.deerM, dt, D.walk * 0.6, !alert && D.walk < 0.3, alert);
    if (alert) W.deer.rotation.y += (((Math.atan2(W.px - W.dr.x, W.pz - W.dr.z) - W.deer.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 2); }
  if (W.owlLook > 0) W.owlLook -= dt; BQ.creatures.poseOwl(W.owlM, dt, W.owlLook > 0 ? Math.sin(W.owlLook * 3) * 1.6 : (Math.hypot(W.px - W.owl.position.x, W.pz - W.owl.position.z) < 25 ? ((Math.atan2(W.px - W.owl.position.x, W.pz - W.owl.position.z) - W.owl.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI : Math.sin(W.t * 0.2) * 1.2));
  if (W.grow) W.grow.forEach(function (p) { if (p.scale.x < 1) p.scale.setScalar(Math.min(1, p.scale.x + dt * 0.8)); });
  if (W.clearT != null) { W.clearT += dt; const u = Math.min(1, W.clearT / 6); W.water.material.color.set('#5a8a3a').lerp(new T.Color('#3a8ac0'), u); W.scum.children.forEach(function (m) { m.scale.setScalar(Math.max(0.01, 1 - u)); });
    if (u >= 1) { W.scum.visible = false; W.fish.visible = true; W.clearT = null; } }
  W.marks.forEach(function (mk) { const done = mk.sp.id && st().found[mk.sp.id]; mk.m.visible = !done && (!mk.sp.when || mk.sp.when()); mk.m.material.opacity = 0.5 + Math.sin(W.t * 4) * 0.3; mk.m.position.y = H(mk.sp.x, mk.sp.z) + (mk.sp.my || 2) + Math.sin(W.t * 2) * 0.15; });
  W.npcs.forEach(function (n) { n.mark.material.opacity = 0.6 + Math.sin(W.t * 5) * 0.3; n.m.rotation.y = Math.atan2(W.px - n.x, W.pz - n.z) * 0.6; });
  W.birdT -= dt; if (W.birdT <= 0) { W.birdT = 5 + Math.random() * 7; if (C.S.set.sound) { const f = 1800 + Math.random() * 900; C.beep(f, 0.07, 'sine'); setTimeout(function () { C.beep(f * 1.2, 0.06, 'sine'); }, 110); } }
  /* player movement (no movement while talking, paused or reading the map) */
  const k = W.k, busy = W.pause || W.talk || W.ui, sens = C.S.set.camSens || 1;
  let mx = 0, mz = 0; if (!busy) { if (k.f) mz -= 1; if (k.b) mz += 1; if (k.l) mx -= 1; if (k.r) mx += 1; if (k.ql) W.yaw += dt * 1.8 * sens; if (k.qr) W.yaw -= dt * 1.8 * sens; if (k.tu) W.pitch = Math.max(-0.35, W.pitch - dt * sens); if (k.td) W.pitch = Math.min(1.25, W.pitch + dt * sens); }
  const len = Math.hypot(mx, mz), wb = waterAt(W.px, W.pz), wl = wb ? wb.y : -1e9, gyHere = groundAt(W.px, W.pz);
  /* swimming starts when the water is deep enough to float in */
  const wasSwim = W.swim; W.swim = !!wb && !W.flying && wl - gyHere > 1.0 && W.py < wl - 0.45;
  if (W.swim && !wasSwim) { amb('sfx', 'splash'); W.vy *= 0.25; W.gliding = false; if (!W.toldSwim) { W.toldSwim = true; showCard('msg', 'cz.swimTip'); W.cardT = 9; } }
  if (!W.swim && wasSwim) amb('sfx', 'splash', 0.6);
  const sp = W.flying ? (k.run ? 22 : 13) : W.swim ? (k.run ? 6.5 : 4.2) : (k.run ? 13 : 6);
  let tvx = 0, tvz = 0;
  if (len > 0) { const cy = Math.cos(W.yaw), sy = Math.sin(W.yaw), dx = (mx * cy + mz * sy) / len, dz = (-mx * sy + mz * cy) / len; tvx = dx * sp; tvz = dz * sp; W.face = Math.atan2(dx, dz);
    if (!W.drag) { const want = Math.atan2(-dx, -dz), d = ((want - W.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; W.yaw += d * Math.min(1, dt * 0.9) * (mz < 0 ? 1 : 0.25); } }
  const grip = W.ground || W.swim || W.flying ? 9 : 3.5; W.vx += (tvx - W.vx) * Math.min(1, dt * grip); W.vz += (tvz - W.vz) * Math.min(1, dt * grip);
  { /* the edge of the reserve: in the last few steps the hills (or the lookout railing) slow you down, so you never slam into an invisible wall */
    const dd = Math.hypot(W.px, W.pz), lim = BOUND - (BOUND - (EDGE + 1.9)) * edgeW(W.px, W.pz).w, soft = 5;
    if (dd > lim - soft && dd > 0.01) { const nx = W.px / dd, nz = W.pz / dd, out = W.vx * nx + W.vz * nz, u = Math.min(1, (dd - (lim - soft)) / soft);
      if (out > 0) { W.vx -= nx * out * u; W.vz -= nz * out * u; if (u > 0.5 && len > 0 && !W.toldEdge) { W.toldEdge = true; showCard('msg', edgeW(W.px, W.pz).w > 0.5 ? 'cz.edgeTip2' : 'cz.edgeTip'); W.cardT = 5; } } } }
  W.px += W.vx * dt; W.pz += W.vz * dt;
  { const dd = Math.hypot(W.px, W.pz), lim = BOUND - (BOUND - (EDGE + 1.9)) * edgeW(W.px, W.pz).w; if (dd > lim) { W.px *= lim / dd; W.pz *= lim / dd; } }
  const moving = Math.hypot(W.vx, W.vz) > 0.5;
  if (len > 0 && !k.run && !W.toldRun && !W.swim) { W.walkT = (W.walkT || 0) + dt; if (W.walkT > 6) { W.toldRun = true; showCard('msg', 'cz.runTip'); W.cardT = 4; } }
  if (k.run && len > 0) W.toldRun = true;
  if (k.run && len > 0 && W.ground && !busy) { W.dustT = (W.dustT || 0) - dt; if (W.dustT <= 0) { W.dustT = 0.09; const p0 = C.glow('#e8dcc0', 1.2, 0.6); p0.position.set(W.px, W.py + 0.2, W.pz); W.g.add(p0); (W.dust = W.dust || []).push({ m: p0, t: 0 }); } }
  if (W.dust) W.dust = W.dust.filter(function (d0) { d0.t += dt; d0.m.position.y += dt * 0.6; d0.m.material.opacity = Math.max(0, 0.6 - d0.t); d0.m.scale.setScalar(1.2 + d0.t * 2); if (d0.t > 0.6) { W.g.remove(d0.m); return false; } return true; });
  /* bump into things: trees, rocks, buildings, people and animals. Two passes, so being squeezed between two things never pushes you through one of them */
  const push = function (cx, cz, r, top) { if (W.py >= top - 0.35) return; const dx = W.px - cx, dz = W.pz - cz, d = Math.hypot(dx, dz), mn = r + 0.45; if (d >= mn) return;
    if (d < 0.001) { W.px = cx + mn; return; } W.px = cx + dx / d * mn; W.pz = cz + dz / d * mn; const vn = (W.vx * dx + W.vz * dz) / d; if (vn < 0) { W.vx -= vn * dx / d; W.vz -= vn * dz / d; } };
  for (let pass = 0; pass < 2; pass++) { W.colliders.forEach(function (c) { if (Math.abs(W.px - c.x) > c.r + 1 || Math.abs(W.pz - c.z) > c.r + 1) return; push(c.x, c.z, c.r, c.top != null ? c.top : H(c.x, c.z) + 3.5); });
    if (W.movers) W.movers.forEach(function (m) { const p = m.at(); push(p[0], p[1], m.r, GH(p[0], p[1]) + m.top); }); }
  const gy = groundAt(W.px, W.pz);
  /* flight energy: drains while flying, refills on the ground */
  if (W.flying) { W.flyE = Math.max(0, W.flyE - dt / 24); if (W.flyE <= 0) { W.flying = false; showCard('msg', 'cz.flyLow'); W.cardT = 3; } }
  else if (W.ground) W.flyE = Math.min(1, W.flyE + dt / 35);
  if (W.flying) {
    const up = !busy && k.jump ? 7 : !busy && k.dive ? -7 : 0; W.vy += (up + Math.sin(W.t * 2.5) * 0.4 - W.vy) * Math.min(1, dt * 4);
    W.py += W.vy * dt; if (W.py > gy + 55) { W.py = gy + 55; W.vy = Math.min(0, W.vy); } if (W.py <= gy) { W.py = gy; W.vy = 0; W.ground = true; } else W.ground = false; W.gliding = false;
    const tr = W.trail[Math.floor(W.t * 20) % W.trail.length]; tr.visible = true; tr.position.set(W.px - Math.sin(W.face) * 0.6, W.py + 0.7, W.pz - Math.cos(W.face) * 0.6); tr.material.opacity = 0.8;
    if (!W.whooshT || W.t > W.whooshT) { W.whooshT = W.t + 2.5 + Math.random() * 2; if (moving) amb('sfx', 'whoosh', 0.5); }
  } else if (W.swim) {
    const surf = wl - 0.5; /* head and shoulders above the water while swimming at the surface */
    if (!busy && k.dive) W.vy += (-3.4 - W.vy) * Math.min(1, dt * 4);
    else if (!busy && k.jump) { if (W.py > surf - 0.25 && wl - gy < 2.2) { W.vy = 8; W.swim = false; amb('sfx', 'splash', 0.6); } else W.vy += (3.2 - W.vy) * Math.min(1, dt * 4); }
    else W.vy += ((surf - W.py) * 2.2 - W.vy) * Math.min(1, dt * 3);
    W.py += W.vy * dt; if (W.py > surf && !k.jump) { W.py = surf; W.vy = Math.min(0, W.vy); } if (W.py < gy + 0.25) { W.py = gy + 0.25; W.vy = Math.max(0, W.vy); }
    W.ground = false; W.gliding = false;
    if (moving && (!W.strokeT || W.t > W.strokeT)) { W.strokeT = W.t + 0.7; amb('sfx', W.under ? 'bubble' : 'swim', 0.8); }
  } else {
    if (!busy && k.jump && W.ground) { W.vy = 9; W.ground = false; C.beep(420, 0.06, 'triangle'); }
    W.vy -= 24 * dt; if (!W.ground && k.jump && W.vy < -2.2) { W.vy = -2.2; W.gliding = true; } else W.gliding = false;
    W.py += W.vy * dt; if (W.py <= gy) { if (!W.ground && W.vy < -6) amb('sfx', 'step', 1.4); W.py = gy; W.vy = 0; W.ground = true; } else if (W.py > gy + 0.05) W.ground = false;
  }
  W.trail.forEach(function (t0) { if (t0.visible) { t0.material.opacity -= dt * 1.6; if (t0.material.opacity <= 0) t0.visible = false; } });
  W.under = W.swim && W.py < wl - 1.3;
  if (W.under && !W.toldDive) { W.toldDive = true; showCard('msg', 'cz.diveTip'); W.cardT = 6; }
  WIND.value = W.t; if (W.keysT != null) { W.keysT -= dt; if (W.keysT <= 0) { W.keysT = null; showKeys(false); } }
  if (W.shadows) W.shadows.forEach(function (q) { const p = q.get ? q.get() : [q.o.position.x, q.o.position.z, q.o.position.y]; const gy0 = groundAt(p[0], p[1]), up = Math.max(0, p[2] - gy0), k = Math.max(0.25, 1 - up / 6);
    q.m.visible = q.o.visible !== false && !(W.camUnder) && gy0 > WL0 - 0.05 - (Math.hypot(p[0] - POND.x, p[1] - POND.z) < 15.6 ? -99 : 99); q.m.position.set(p[0], gy0 + 0.05, p[1]); q.m.scale.set(q.r * 2 * k, 1, q.r * 2 * k); q.m.material.opacity = 1; });
  if (W.pondTex) { W.pondTex.offset.x = Math.sin(W.t * 0.05) * 0.3; W.pondTex.offset.y = W.t * 0.012; W.rim.material.opacity = 0.28 + Math.sin(W.t * 0.9) * 0.08; }
  W.me.position.set(W.px, W.py, W.pz); W.me.rotation.y += (((W.face - W.me.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * Math.min(1, dt * 10);
  const legs = W.me.userData.legs, spd = Math.hypot(W.vx, W.vz);
  if (legs) { const before = W.stride || 0; W.stride = before + dt * spd * (k.run ? 1.1 : 1.5);
    legs.forEach(function (h, i) { h.rotation.x = W.swim ? Math.sin(W.t * 7 + i * Math.PI) * 0.6 : W.flying ? 0.9 : W.ground ? Math.sin(W.stride + i * Math.PI) * 0.7 * Math.min(1, spd / 4) : (W.gliding ? 0.6 : -0.5); });
    if (W.ground && spd > 1 && Math.floor(before / Math.PI) !== Math.floor(W.stride / Math.PI)) amb('sfx', 'step', k.run ? 1 : 0.6); }
  W.me.rotation.z = W.gliding ? Math.sin(W.t * 6) * 0.08 : W.flying ? Math.sin(W.t * 2) * 0.1 : 0;
  W.me.rotation.x = W.swim ? (W.under || k.dive ? 0.9 : 0.55) : W.flying ? (moving ? 0.7 : 0.2) : (k.run && len > 0 && W.ground) ? 0.18 : 0;
  /* camera follows behind: smooth zoom, look-closer mode, and it slips under the water with you when you dive */
  W.dist += (W.distT - W.dist) * Math.min(1, dt * 5);
  const eDist = W.under ? Math.min(W.dist, 6) : W.dist, ePitch = W.under ? Math.min(W.pitch, 0.18) : W.pitch;
  const tgt = new T.Vector3(W.px, W.py + (W.dist < 4 ? 0.95 : 1.35), W.pz), cp = Math.cos(ePitch);
  const want = new T.Vector3(tgt.x + Math.sin(W.yaw) * cp * eDist, tgt.y + Math.sin(ePitch) * eDist, tgt.z + Math.cos(W.yaw) * cp * eDist);
  { /* keep the camera out of trees and rocks: move it in front of anything between it and the player */
    const vx = want.x - tgt.x, vz = want.z - tgt.z, L2 = vx * vx + vz * vz; let best = 1;
    if (L2 > 0.01) W.colliders.forEach(function (c) { const rr = c.r + 0.6, u = ((c.x - tgt.x) * vx + (c.z - tgt.z) * vz) / L2; if (u <= 0 || u > 1.2) return;
      const px = tgt.x + vx * u - c.x, pz = tgt.z + vz * u - c.z; if (px * px + pz * pz < rr * rr) { const back = u - rr / Math.sqrt(L2); if (back < best) best = back; } });
    best = Math.max(0.28, best); if (best < 1) { want.x = tgt.x + vx * best; want.z = tgt.z + vz * best; want.y = tgt.y + (want.y - tgt.y) * best; } }
  if ((W.talk || W.sitting) && W.talkFocus) { const f = W.talkFocus, mx0 = (W.px + f.x) / 2, mz0 = (W.pz + f.z) / 2, dx = f.x - W.px, dz = f.z - W.pz, L0 = Math.hypot(dx, dz) || 1, sx = -dz / L0, sz = dx / L0, dd = Math.max(5, L0 * 1.6);
    const sgn = ((cam.position.x - mx0) * sx + (cam.position.z - mz0) * sz) >= 0 ? 1 : -1; want.set(mx0 + sx * dd * sgn - dx / L0 * 1.2, Math.max(W.py, f.y) + 1.6, mz0 + sz * dd * sgn - dz / L0 * 1.2); tgt.set(mx0, (W.py + 1.1 + f.y) / 2, mz0); }
  if (W.under && wb) { /* diving: the camera stays under the water with you. If the bank is in the way it moves closer instead of popping out above the surface */
    let s0 = 1; for (let k = 0; k < 7; k++) { const cx = tgt.x + (want.x - tgt.x) * s0, cz = tgt.z + (want.z - tgt.z) * s0, cy = tgt.y + (want.y - tgt.y) * s0; if (waterAt(cx, cz) && GH(cx, cz) + 0.45 < Math.min(cy, wl - 0.4)) break; s0 *= 0.72; }
    want.set(tgt.x + (want.x - tgt.x) * s0, tgt.y + (want.y - tgt.y) * s0, tgt.z + (want.z - tgt.z) * s0); want.y = Math.max(GH(want.x, want.z) + 0.45, Math.min(want.y, wl - 0.4)); }
  else { const gc = GH(want.x, want.z) + 1.2; if (want.y < gc) want.y = gc;
    /* a hill between the camera and you: rise up and look over it */
    for (let k = 1; k <= 2; k++) { const u = k / 3, mx = tgt.x + (want.x - tgt.x) * u, mz = tgt.z + (want.z - tgt.z) * u, my = tgt.y + (want.y - tgt.y) * u, gm = GH(mx, mz) + 0.6; if (my < gm) want.y += (gm - my) / u; }
    /* over the pond the camera never sits half in the water */
    const wc = waterAt(want.x, want.z); if (wc && want.y < wc.y + 0.45) want.y = wc.y + 0.45; }
  cam.position.lerp(want, Math.min(1, dt * (W.talk || W.sitting ? 3 : 6))); if (W.talk || W.sitting) { W.lookAt = W.lookAt || tgt.clone(); W.lookAt.lerp(tgt, Math.min(1, dt * 4)); cam.lookAt(W.lookAt); } else { W.lookAt = null; cam.lookAt(tgt); }
  { const fov = W.dist < 4 ? 28 + (W.dist - 2.2) / 1.8 * 14 : 42; if (Math.abs(cam.fov - fov) > 0.05) { cam.fov += (fov - cam.fov) * Math.min(1, dt * 5); cam.updateProjectionMatrix(); } }
  if (W.ui === 'scope' && W.scope) scopeStep(dt, cam);
  if (W.camOverride) { const o = W.camOverride, tg = o.follow ? o.follow.getWorldPosition(new T.Vector3()) : o.look; cam.position.copy(o.follow ? tg.clone().add(o.off) : o.pos); cam.lookAt(tg); } /* used by tests to inspect animals up close */
  underwaterLook(cam); W.me.visible = W.dist > 3.2 && !W.scope;
  { /* tree tops between the camera and the player fade out so you can always see yourself */
    const ax = tgt.x, az = tgt.z, bx = cam.position.x - ax, bz = cam.position.z - az, L2 = bx * bx + bz * bz, hy = Math.max(cam.position.y, tgt.y) + 0.4; let instDirty = false;
    W.colliders.forEach(function (c) { if (!c.cr) return; let hide = false;
      if (L2 > 0.01 && c.bot < hy) { const u = Math.max(0, Math.min(1, ((c.x - ax) * bx + (c.z - az) * bz) / L2)), px = ax + bx * u - c.x, pz = az + bz * u - c.z; hide = px * px + pz * pz < (c.cr + 0.4) * (c.cr + 0.4) && u > 0.05; }
      if (hide === !!c.hidden) return; c.hidden = hide;
      if (c.m) c.m.visible = !hide;
      else if (c.inst != null) { const arr = W.ringCone.instanceMatrix.array, o = c.inst * 16; if (hide) { for (let k = 0; k < 16; k++) arr[o + k] = 0; } else for (let k = 0; k < 16; k++) arr[o + k] = c.mat[k]; instDirty = true; } });
    if (instDirty) W.ringCone.instanceMatrix.needsUpdate = true; }
  /* nearest interaction prompt */
  if (!busy) { W.near = nearest(); W.voice = nearestVoice(); const sig = (W.near ? W.near.id + (W.near.id === 'fire' && W.fire.lit ? '+' : '') : '') + '|' + (W.voice ? W.voice.id : '') + (C.S.set.lang || 'en');
    if (sig !== W.lastPrompt) { W.lastPrompt = sig; let h = '';
      if (W.near) h += C.esc('E: ' + tx(typeof W.near.verb === 'function' ? W.near.verb() : W.near.verb) + ' ' + tx(W.near.t));
      if (W.voice) h += (h ? ' &nbsp;·&nbsp; ' : '') + '<button type="button" class="czL" data-listen="1">' + C.esc(tx('cz.listenKey')) + '</button> ' + (W.near ? '' : C.esc(tx('cz.listen') + ' ' + tx('cz.lt.' + W.voice.id)));
      $('czPrompt').innerHTML = h; $('czPrompt').hidden = !h;
      if (W.voice && !s.toldListen && !(s.voices && Object.keys(s.voices).length)) { s.toldListen = 1; queueCard('cz.listenTip', 7); } } }
  else if (!$('czPrompt').hidden) { $('czPrompt').hidden = true; W.lastPrompt = null; }
  $('cozyUI').classList.toggle('talking', !!W.talk || W.ui === 'rest'); $('cozyUI').classList.toggle('mapping', W.ui === 'map');
  W.seenT = (W.seenT || 0) - dt; if (W.seenT <= 0) { W.seenT = 0.6; markSeen(); }
  { const fast = W.sitting && W.restTo != null; W.tod = (W.tod + dt * (fast ? 0.7 : 1 / 50)) % 24; s.tod = W.tod;
    if (fast && Math.abs(((W.tod - W.restTo + 36) % 24) - 12) > 11.6) W.restTo = null;
    W.lightT = (W.lightT || 0) - dt; if (W.lightT <= 0 || fast) { W.lightT = 0.3; dayLight(); } }
  soundscape(dt); svStep(dt);
  if (W.ffly && W.ffly[0].visible) W.ffly.forEach(function (f, i) { const u = f.userData, a = W.t * 0.4 + u.ph; f.position.set(u.cx + Math.sin(a) * 2, H(u.cx, u.cz) + 0.8 + Math.sin(W.t * 0.9 + u.ph) * 0.6, u.cz + Math.cos(a * 0.8) * 2); f.material.opacity = Math.max(0, Math.sin(W.t * 2.2 + u.ph * 3)) * 0.95; });
  if (W.moth.visible) { W.moth.position.set(W.porch.position.x + Math.sin(W.t * 2.3) * 0.6, W.porch.position.y + Math.sin(W.t * 3.1) * 0.3, W.porch.position.z + 0.5 + Math.cos(W.t * 2) * 0.4); W.moth.children.forEach(function (w, j) { w.rotation.z = (j ? -1 : 1) * Math.sin(W.t * 18) * 0.7; }); }
  if (W.flames.visible) W.flames.children.forEach(function (f, i) { if (f.isMesh) { f.scale.y = (0.5 - i * 0.12) * (1 + Math.sin(W.t * (9 + i * 3)) * 0.18); f.rotation.y += dt * (1 + i); } });
  if (W.fire && W.fire.grow != null) { W.fire.grow = Math.min(1, W.fire.grow + dt / 1.6); W.flames.scale.setScalar(0.05 + 0.95 * W.fire.grow * W.fire.grow); if (W.fire.grow >= 1) W.fire.grow = null; }
  if (W.smoke) { const lit = W.fire.lit, fy0 = H(W.fire.x, W.fire.z); W.smoke.forEach(function (p) { p.t += dt; if (p.t > 4.5) p.t -= 4.5; const u = p.t / 4.5;
      p.m.position.set(W.fire.x + Math.sin(W.t * 0.5 + p.ph) * 0.3 * u + u * 0.9, fy0 + 1.1 + u * 5, W.fire.z + Math.cos(W.t * 0.4 + p.ph) * 0.3 * u + u * 0.4); p.m.scale.setScalar(0.8 + u * 3.2); p.m.material.opacity = lit ? 0.5 * Math.sin(u * Math.PI) * (W.fire.grow != null ? W.fire.grow : 1) : 0; });
    W.sparkT -= dt; if (lit && W.sparkT <= 0) { sparkOut(false); W.sparkT = 0.5 + Math.random() * 2.2; if (Math.random() < 0.35) amb('sfx', 'step', 0.15); }
    W.sparks.forEach(function (q) { if (q.life <= 0) return; q.life -= dt; q.vy -= dt * 2.2; q.x += q.vx * dt; q.y += q.vy * dt; q.z += q.vz * dt; q.m.position.set(q.x, q.y, q.z); q.m.material.opacity = Math.min(1, q.life * 2) * (0.7 + 0.3 * Math.sin(W.t * 40 + q.x * 9)); if (q.life <= 0) q.m.visible = false; }); }
  if (isNight() && W.stars.material.opacity > 0.5) { if (!W.shootT || W.t > W.shootT) { W.shootT = W.t + 12 + Math.random() * 20; W.shootA = { x: -200 + Math.random() * 200, y: 200 + Math.random() * 80, t: 0 }; } if (W.shootA && W.shootA.t < 1.2) { W.shootA.t += dt; const u = W.shootA.t / 1.2; W.shoot.position.set(W.shootA.x + u * 160, W.shootA.y - u * 50, -360); W.shoot.material.opacity = Math.sin(u * Math.PI) * 0.9; } else W.shoot.material.opacity = 0; } else W.shoot.material.opacity = 0;
  if (W.sitting) { const legs0 = W.me.userData.legs; if (legs0) legs0.forEach(function (h) { h.rotation.x = -1.3; }); W.yaw += dt * 0.05; if (W.k.f || W.k.b || W.k.l || W.k.r || W.k.jump) standUp(); }
  if (W.hintTarget) { W.hintTarget.t -= dt; W.beacon.material.opacity = 0.25 + Math.sin(W.t * 4) * 0.12; if (W.hintTarget.t <= 0 || Math.hypot(W.px - W.hintTarget.x, W.pz - W.hintTarget.z) < 3) { W.hintTarget = null; W.beacon.visible = false; } }
  if (W.hintT > 0) { W.hintT -= dt; if (W.hintT <= 0) $('czHint').hidden = true; }
  if (W.ui === 'map') drawMap();
  W.npcs.forEach(function (n) { n.tag.visible = !(W.talk && W.talk.lines[0] && W.talk.lines[0].who === n.id) && Math.hypot(cam.position.x - n.x, cam.position.z - n.z) > 7; });
  if (W.cardT > 0) { W.cardT -= dt; if (W.cardT <= 0) { $('czCard').hidden = true; W.card = null; } }
  if (W.cardT <= 0 && W.queue && W.queue.length) { const q = W.queue.shift(); showCard('msg', q[0]); W.cardT = q[1]; amb('sfx', 'discover'); }
  { const fb = $('czFly'), on = !!s.f.fly && (W.flying || W.flyE < 0.999); fb.hidden = !on; if (on) fb.firstChild.style.width = Math.round(W.flyE * 100) + '%'; }
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
  if (down && W.ui === 'map' && (kk === 'Escape' || kk === 'm')) { e.preventDefault(); closeMap(); return; }
  if (W.ui === 'survey' && down) { if (kk === ' ' || kk === 'Enter') { e.preventDefault(); if (W.sv && !W.sv.on && W.sv.t >= 30) { W.sv.on = true; svPanel(); } else svTally(); return; } if (kk === 'Escape') { e.preventDefault(); svStop(); return; } }
  if (W.ui === 'survey') return;
  if (W.ui === 'scope') { if (down && (kk === 'Escape' || kk === 'e' || kk === 'Enter')) { if (e.target && e.target.tagName === 'BUTTON' && kk === 'Enter') return; e.preventDefault(); closeScope(); return; }
    if (down && (kk === '+' || kk === '=')) { scopeZoom(1.35); return; } if (down && (kk === '-' || kk === '_')) { scopeZoom(1 / 1.35); return; }
    const sm = { w: 'f', ArrowUp: 'f', s: 'b', ArrowDown: 'b', a: 'l', ArrowLeft: 'l', d: 'r', ArrowRight: 'r' }; if (sm[kk] && W.scope) { W.scope.k[sm[kk]] = down; e.preventDefault(); } return; }
  if (W.ui === 'rest' && down) { if (/^[1-4]$/.test(kk)) { restChoice(['18.4', '22', '7.5', '-1'][+kk - 1]); return; } if (kk === 'Escape' || kk === 'e') { e.preventDefault(); standUp(); return; } }
  if (W.ui === 'map') { if (down && (kk === '+' || kk === '=')) mapZoom(1.3); if (down && (kk === '-' || kk === '_')) mapZoom(1 / 1.3); return; }
  if (down && kk === 'Escape') { e.preventDefault(); if (W.talk) { W.talk = null; $('czTalk').hidden = true; return; } setPause(!W.pause); return; }
  if (W.pause) return;
  if (down && W.talk && W.talk.lines[W.talk.i].choices && /^[1-3]$/.test(kk)) { choose(+kk - 1); return; }
  if (down && (kk === 'e' || kk === 'Enter')) { if (e.target && e.target.tagName === 'BUTTON' && kk === 'Enter') return; act(); e.preventDefault(); return; }
  if (down && (kk === '?' || kk === 'k') && !e.repeat) { toggleKeys(); return; }
  if (down && kk === 'j') { openJ(); return; }
  if (down && kk === 'm' && !e.repeat) { openMap(); return; }
  if (down && kk === 'h' && !e.repeat) { giveHint(); return; }
  if (down && kk === 'l' && !e.repeat) { if (W.voice && !W.talk) listen(W.voice); return; }
  if (down && kk === 'f' && !e.repeat) { toggleFly(); return; }
  if (down && kk === 'v' && !e.repeat) { lookCloser(); return; }
  if (down && (kk === '-' || kk === '_')) { W.distT = Math.min(30, W.distT * 1.2); return; }
  if (down && (kk === '=' || kk === '+')) { W.distT = Math.max(2.2, W.distT / 1.2); return; }
  const map = { w: 'f', ArrowUp: 'f', s: 'b', ArrowDown: 'b', a: 'l', ArrowLeft: 'l', d: 'r', ArrowRight: 'r', ' ': 'jump', Shift: 'run', q: 'ql', r: 'qr', c: 'dive', Control: 'dive', t: 'tu', g: 'td' };
  if (map[kk]) { W.k[map[kk]] = down; e.preventDefault(); }
}
function pointer(e, type) {
  if (!W || W.pause) return;
  if (W.ui === 'scope' && W.scope) { const c = W.scope; if (type === 'wheel') { scopeZoom(e.deltaY > 0 ? 1 / 1.15 : 1.15); e.preventDefault(); } else if (type === 'pointerdown') c.drag = { x: e.clientX, y: e.clientY, a: c.a, p: c.p }; else if (type === 'pointermove' && c.drag && e.buttons) { c.a = c.drag.a - (e.clientX - c.drag.x) * 0.004 / c.zoom; c.p = c.drag.p + (e.clientY - c.drag.y) * 0.004 / c.zoom; } else if (type === 'pointerup') c.drag = null; return; }
  if (type === 'wheel') { W.distT = Math.max(2.2, Math.min(30, W.distT * (e.deltaY > 0 ? 1.12 : 1 / 1.12))); e.preventDefault(); return; }
  if (type === 'pointerdown') W.drag = { x: e.clientX, y: e.clientY, yaw: W.yaw, pitch: W.pitch };
  else if (type === 'pointermove' && W.drag && e.buttons) { const sn = C.S.set.camSens || 1, inv = C.S.set.camInv ? -1 : 1; W.yaw = W.drag.yaw - (e.clientX - W.drag.x) * 0.008 * sn; W.pitch = Math.max(-0.35, Math.min(1.25, W.drag.pitch + (e.clientY - W.drag.y) * 0.006 * sn * inv)); }
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
  const vs = voices().filter(function (v) { return v.clue && s.voices && s.voices[v.key || v.id]; }), uniq = {};
  const voiceSec = '<section class="jl"><h3>👂 ' + C.esc(tx('cz.j.voices')) + '</h3><p class="dim">' + C.esc(tx('cz.j.voiceTip')) + '</p><ul>' +
    (vs.length ? vs.filter(function (v) { const k = v.key || v.id; if (uniq[k]) return false; uniq[k] = 1; return true; }).map(function (v) { return '<li>' + C.esc(tx(v.clue)) + '</li>'; }).join('') : '<li class="dim">…</li>') + '</ul></section>';
  const svs = s.surveys || {}, svk = Object.keys(svs);
  const svSec = '<section class="jl"><h3>📋 ' + C.esc(tx('cz.j.surveys')) + '</h3><p class="dim">' + C.esc(tx('cz.j.svTip')) + '</p><ul>' + (svk.length ? svk.map(function (k) { const r = svs[k]; return '<li><b>' + C.esc(tx('cz.sv.' + k)) + '</b>: ' + (r.sens != null ? C.esc(tx('cz.sv.kickRes', { s: r.sens, t: r.n, q: tx('cz.sv.q.' + r.q) })) : C.esc(tx('cz.j.sv.counted')) + ' ' + r.n) + ' <span class="dim">(' + C.esc(tx('cz.tod.' + todName(r.tod))) + ')</span></li>'; }).join('') : '<li class="dim">…</li>') + '</ul></section>';
  const logs = ['log1', 'log2', 'log3'].filter(function (k) { return s.log && s.log[k]; });
  const logSec = logs.length ? '<section class="jl"><h3>' + C.esc(tx('cz.logT')) + '</h3>' + logs.map(function (k) { return '<p><i>' + C.esc(tx('cz.' + k)) + '</i></p>'; }).join('') + '</section>' : '';
  return '<p class="dim">' + C.esc(tx('cz.j.tip')) + '</p><p><b>' + C.esc(tx('cz.j.found', { n: n, m: FINDS.length })) + '</b></p>' + logSec + myst + voiceSec + svSec + '<section class="jl"><h3>🌿 ' + C.esc(tx('cz.reserve')) + '</h3><div class="jcs">' + cards + '</div></section>';
}
function blur() { if (W) W.k = {}; }
const cb = document.getElementById('btnCozy'); if (cb) cb.hidden = false;
/* language choice lives on the main menu (and in the reserve's pause panel), not in the game view */
(function () { const card = document.querySelector('#menu .card'), modes = card && card.querySelector('.modes'); if (!card || document.getElementById('menuLang')) return;
  const d = document.createElement('div'); d.id = 'menuLang'; d.className = 'mlang'; d.setAttribute('role', 'group'); d.setAttribute('aria-label', 'Language / Idioma');
  d.innerHTML = '<span class="dim">🌐 Language / Idioma:</span> <button type="button" data-ml="en">English</button><button type="button" data-ml="es">Español</button>';
  (modes ? modes.nextSibling : null) ? card.insertBefore(d, modes.nextSibling) : card.appendChild(d);
  const mark = function () { d.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.ml === (C.S.set.lang || 'en'))); }); };
  d.addEventListener('click', function (e) { const b = e.target.closest('button'); if (!b) return; C.S.set.lang = b.dataset.ml; C.save(); mark(); const wb = document.getElementById('btnIntro'); if (wb && C.tx) wb.textContent = C.tx('in.watch'); });
  mark(); const st0 = document.createElement('style'); st0.textContent = '#menuLang { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: center; margin: 8px 0; } #menuLang button[aria-pressed="true"] { border-color: #ffd166; box-shadow: inset 0 0 0 1px #ffd166; }'; document.head.appendChild(st0); })();
BQ.cozy = { start: start, step: step, key: key, pointer: pointer, journalHTML: journalHTML, resume: resume, blur: blur, _w: function () { return W; }, _s: st, _H: H, _GH: GH, _scopeT: function (id) { return SCOPE[id]; } };
}
if (BQ.core) init(); else BQ.onCore = init;
})();

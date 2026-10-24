/* EARTHLING FIELD GUIDE: FINAL MISSION, THE BIODOME
   The alien flies home to its dry, empty planet and builds a sealed dome where Earth life can keep itself going.
   1. PACK the ship: limited cargo space. Supplies are earned on Earth (platformer worlds and the Willow Creek
      reserve); anything not earned yet shows where to go back and get it.
   2. BUILD: place supplies in the dome. Living things need what they eat to be there first.
   3. BALANCE: 8 seasons, untimed. Each season brings a disruption. Watch the gauges (oxygen, carbon dioxide,
      water, temperature, nutrients, food, food web, waste), act, then end the season. Rewind any time.
   The living system itself is in domesim.js. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
const C = BQ.core, T = C.T, tx = C.tx, DS = window.FG_DomeSim; if (!DS) return;
Object.assign(C.I18N.en, {
  'bd.menu': '🛸 Final Mission: Biodome', 'bd.title': 'Final Mission: Biodome', 'bd.back': 'Back to menu', 'bd.earth': 'Go back to Earth',
  'bd.intro1': 'Home at last. My planet is cold, dry and silent: no rivers, no forests, almost no air to breathe.',
  'bd.intro2': 'On Earth I learned how living things depend on each other. Now I will build a sealed dome where Earth life can keep itself going: a biodome.',
  'bd.intro3': 'My ship has room for only 24 crates. I must choose carefully.', 'bd.go': 'Start packing',
  'bd.ph.pack': '1 Pack', 'bd.ph.build': '2 Build', 'bd.ph.season': '3 Balance',
  'bd.pack.t': 'Pack the ship', 'bd.pack.h': 'Choose what to bring. Every crate uses cargo space, so think about what each living thing needs.',
  'bd.cargo': 'Cargo', 'bd.launch': 'Fly home 🚀', 'bd.locked': 'Not collected yet. Go back to Earth:',
  'bd.teach': 'Teacher mode: every supply is available.',
  'bd.it.water': 'Water barrels', 'bd.it.air': 'Air tank (oxygen + carbon dioxide)', 'bd.it.blocks': 'Building-block kit', 'bd.it.soil': 'Living soil', 'bd.it.grass': 'Grass seeds',
  'bd.it.flowers': 'Wildflower seeds', 'bd.it.trees': 'Tree saplings', 'bd.it.pondweed': 'Pondweed', 'bd.it.bees': 'Pollinators', 'bd.it.rabbits': 'Rabbits', 'bd.it.hawks': 'Hawks',
  'bd.it.pond': 'Pond animals', 'bd.it.cellkit': 'Cell-care kit',
  'bd.d.water': 'All living things need water. Plants use it in photosynthesis; it cycles from the pond to the air and back as "rain".',
  'bd.d.air': 'A starting mix of gases. Plants need carbon dioxide; animals need oxygen.',
  'bd.d.blocks': 'Proteins, carbohydrates, lipids and nucleic acids: the macromolecules every cell is built from. Adds nutrients to get life started.',
  'bd.d.soil': 'Soil full of decomposers (earthworms, fungi, bacteria). They turn waste and dead matter back into nutrients.',
  'bd.d.grass': 'Fast-growing producers. Main food for rabbits.', 'bd.d.flowers': 'Producers that need pollinators to make seeds.',
  'bd.d.trees': 'Slow-growing producers. Big oxygen makers, and their shade keeps the dome cooler.', 'bd.d.pondweed': 'Producers that live in the pond and make oxygen for pond animals.',
  'bd.d.bees': 'Bees and butterflies. Wildflowers cannot make seeds without them.', 'bd.d.rabbits': 'Herbivores (primary consumers). They eat plants.',
  'bd.d.hawks': 'Predators (secondary consumers). They eat rabbits and keep their numbers in check.', 'bd.d.pond': 'Fish and frogs (consumers). They need pondweed and oxygen in the water.',
  'bd.d.cellkit': 'What you learned about cells: helps living things fight disease and stay in balance (homeostasis).',
  'bd.rq.pond': 'Willow Creek reserve: solve the Quiet Pond mystery (clean water).', 'bd.rq.l22': 'Platformer World 2, level 2: Building Blocks.', 'bd.rq.l21': 'Platformer World 2, level 1: Water and Carbon.',
  'bd.it.wetland': 'Wetland filter plants', 'bd.it.seedbank': 'Seed bank (many alleles)', 'bd.it.hardy': 'Hardy seeds from drought survivors',
  'bd.d.wetland': 'Cattails and reeds soak up extra nutrients before they reach the pond, which helps stop algal blooms.',
  'bd.d.seedbank': 'Grass seeds with lots of genetic variation. Some plants carry alleles that resist disease, so a blight cannot wipe them all out.',
  'bd.d.hardy': 'Seeds collected from plants that survived a drought. Natural selection already favored their heat-tolerant traits.',
  'bd.rq.l32': 'Platformer World 3, level 2: Living Together.', 'bd.rq.l35': 'Platformer World 3, level 5: Human Footprints.', 'bd.rq.l42': 'Platformer World 4, level 2: Making Gametes.', 'bd.rq.l51': 'Platformer World 5, level 1: Survival of the Fittest.',
  'bd.n.wetland': 'The wetland plants soaked up extra nutrients, so the pond stayed clear.', 'bd.n.seedbank': 'Some grass plants in the seed bank had alleles that resist the blight. Genetic variation helped the population survive.',
  'bd.n.hardy': 'Your hardy seeds came from drought survivors, so the grass was already adapted to the heat.',
  'bd.rq.w1': 'Platformer World 1: finish all 5 levels.', 'bd.rq.l24': 'Platformer World 2, level 4: Energy in Cells.', 'bd.rq.l25': 'Platformer World 2, level 5: Food Webs and Cycles.',
  'bd.rq.soil': 'Willow Creek reserve: discover the earthworms and the rotting log.', 'bd.rq.poll': 'Willow Creek reserve: do a pollinator survey.', 'bd.rq.pondlife': 'Willow Creek reserve: do a frog count or a stream bug sample.',
  'bd.build.t': 'Build the biodome', 'bd.build.h': 'Place your supplies. Living things need what they eat (and water and soil) to be there first. You can keep some crates in storage for later.',
  'bd.place': 'Place', 'bd.store': 'In storage', 'bd.inDome': 'In the dome', 'bd.start': 'Start season 1 ▶',
  'bd.needFirst.plants': 'Plants need water and soil first.', 'bd.needFirst.herb': 'Rabbits would starve: place a producer (grass or wildflowers) first.',
  'bd.needFirst.pred': 'Hawks would starve: place their prey (rabbits) first.', 'bd.needFirst.poll': 'Pollinators need flowers to feed on: place wildflowers first.',
  'bd.needFirst.pond': 'Pond animals need a pond (2 water barrels) and pondweed first.', 'bd.needStart': 'To start: place water, living soil and at least one kind of plant.',
  'bd.missT': 'You can\'t start yet. Still missing:', 'bd.miss.water': '💧 Water barrels', 'bd.miss.soil': '🪱 Living soil', 'bd.miss.plant': '🌾 At least one kind of plant (grass, wildflowers or trees)',
  'bd.miss.packed': 'packed: place it from the list on the left', 'bd.miss.notPacked': 'not packed: go back and add it to your crates', 'bd.miss.locked': 'not earned yet: go back to Earth for it',
  'bd.needPack': 'To start a season you will need:', 'bd.repack': '⬅ Go back and repack', 'bd.repackH': 'Your placed crates go back into the ship so you can change what you bring.',
  'bd.season': 'Season', 'bd.of': 'of', 'bd.end': 'End season ▶', 'bd.next': 'Next season ▶', 'bd.rewind': '↶ Rewind a season', 'bd.listen': '👂 Listen',
  'bd.act.shade': 'Dome cover: OFF', 'bd.act.shadeOn': 'Dome cover: ON', 'bd.act.shadeH': 'Keeps the dome nearer 22 °C, but lets in less light.',
  'bd.act.pull': 'Pull the invasive vine', 'bd.act.cure': 'Use the cell-care kit', 'bd.act.penR': 'Move 1 rabbit group to the pen', 'bd.act.penH': 'Move a hawk to the pen', 'bd.act.skim': 'Scoop out extra algae',
  'bd.g.o2': 'Oxygen', 'bd.g.co2': 'Carbon dioxide', 'bd.g.water': 'Water', 'bd.g.temp': 'Temperature', 'bd.g.nut': 'Nutrients', 'bd.g.food': 'Producers', 'bd.g.web': 'Food web', 'bd.g.waste': 'Waste',
  'bd.ok': 'good', 'bd.warn': 'watch', 'bd.bad': 'problem', 'bd.species': 'Living species',
  'bd.ev.boom': 'Baby boom! The rabbits had a great spring and their numbers jumped. What keeps a population in check?',
  'bd.ev.heat': 'Heat wave! My star is extra bright this season. Plants lose water fast in the heat.',
  'bd.ev.disease': 'Plant disease! A leaf blight is spreading through the grass. Is your dome relying on one kind of plant?',
  'bd.ev.invasive': 'Stowaway! An invasive vine came in on a crate. It grows fast, has nothing here that eats it, and can smother other plants.',
  'bd.ev.algae': 'The compost bin leaked into the pond: extra nutrients! Watch out for an algae bloom.',
  'bd.ev.cold': 'Cold snap! My planet\'s long winter is here. Cold slows everything down, and pollinators are sensitive to it.',
  'bd.ev.final': 'Final season. Keep everything steady, then end the season to see if your biodome is in balance.',
  'bd.ev.calm': 'A calm first season. Watch how the gauges change, then end the season.',
  'bd.n.diseaseCured': 'The cell-care kit helped the grass fight the blight.', 'bd.n.diseaseMixed': 'The blight hit the grass, but other kinds of plants were safe. More species means a sturdier ecosystem.',
  'bd.n.diseaseMono': 'The blight wiped out most of the grass, and there were few other plants to fall back on.', 'bd.n.heatDry': 'Not enough water in the heat: plants wilted.',
  'bd.n.heatTrait': 'Some grass plants had a trait that helps them survive heat. They made more seeds, so next time more of the population will handle heat: natural selection.',
  'bd.n.coldBees': 'The cold hurt the pollinators.', 'bd.n.vine': 'The invasive vine spread and smothered native plants.', 'bd.n.hungryRabbits': 'The rabbits ran short of food, and many died.',
  'bd.n.noPredators': 'With no predators, the rabbit population kept growing and ate the plants down.', 'bd.n.hungryHawks': 'The hawks ran short of prey.',
  'bd.n.noFlowers': 'Too few flowers: the pollinators went hungry.', 'bd.n.noBees': 'No pollinators: the wildflowers could not make seeds.',
  'bd.n.algae': 'Algae bloom! Extra nutrients fed algae, and the pond lost oxygen. Fish struggled.', 'bd.n.noDecomp': 'Waste is piling up: no decomposers to recycle it into nutrients.',
  'bd.n.lowO2': 'Oxygen is low: more animals are breathing than plants can supply.', 'bd.n.lowCO2': 'Carbon dioxide is very low: plants are short of it for photosynthesis.', 'bd.n.highCO2': 'Carbon dioxide is building up: respiration is outpacing photosynthesis.',
  'bd.n.none': 'Everything held steady this season.',
  'bd.res.win': 'My biodome is in balance! Producers, consumers, predators, pollinators and decomposers are all working together, and matter keeps cycling.',
  'bd.res.lose': 'Not in balance yet. Look at the red gauges and the missing parts of the food web, then rewind or try again.',
  'bd.res.crash': 'The dome crashed. Rewind a season and try a different choice.', 'bd.res.missing': 'Missing from the food web:',
  'bd.lv.producers': 'two kinds of producers', 'bd.lv.herbivores': 'herbivores', 'bd.lv.predators': 'predators', 'bd.lv.decomposers': 'decomposers', 'bd.lv.pollinators': 'pollinators',
  'bd.score': 'Score', 'bd.best': 'Best', 'bd.again': 'Start over', 'bd.log': 'Alien log: I came to Earth to study life. I learned to listen to it. Now a little piece of Earth is alive on my world, and it only works because every part is connected.',
  'bd.v.rabbits': 'Rabbit', 'bd.v.hawks': 'Hawk', 'bd.v.bees': 'Bee', 'bd.v.decomp': 'Earthworm', 'bd.v.fish': 'Fish', 'bd.v.grass': 'Grass',
  'bd.vl.rabbits.ok': 'Plenty of grass! Life is good. (Hop, hop.)', 'bd.vl.rabbits.hungry': 'Where did all the grass go? There are too many of us and not enough food.', 'bd.vl.rabbits.many': 'We keep having babies and nobody is chasing us...',
  'bd.vl.hawks.ok': 'I keep an eye on the rabbits. Someone has to.', 'bd.vl.hawks.hungry': 'I am hungry. Not a rabbit in sight.',
  'bd.vl.bees.ok': 'So many flowers! Buzz, buzz, I carry pollen everywhere.', 'bd.vl.bees.hungry': 'Not enough flowers. And it is cold. Bzz...',
  'bd.vl.decomp.ok': 'Leftovers again? Delicious. I turn them back into nutrients for the plants.', 'bd.vl.decomp.busy': 'So. Much. Waste. Send help. (More worms, please.)',
  'bd.vl.fish.ok': 'Clear water, plenty of pondweed. Blub!', 'bd.vl.fish.bad': 'The water is green and I can barely breathe. Blub...',
  'bd.vl.grass.ok': 'Sun, water, carbon dioxide... I am turning them into sugar. Try it sometime.', 'bd.vl.grass.bad': 'I am thirsty, or too hot, or being eaten too fast. Maybe all three.',
  'bd.fly1': 'Leaving Earth with everything I packed...', 'bd.fly2': 'Across the stars, toward home.', 'bd.fly3': 'Landing beside the dome.', 'bd.skip': 'Skip ⏭',
  'bd.storeLeft': 'crates left in storage', 'bd.helpCam': 'Drag to look around the dome. Wheel or + / − to zoom.'
});
Object.assign(C.I18N.es, {
  'bd.menu': '🛸 Misión final: el biodomo', 'bd.title': 'Misión final: el biodomo', 'bd.back': 'Volver al menú', 'bd.earth': 'Volver a la Tierra',
  'bd.intro1': 'Por fin en casa. Mi planeta es frío, seco y silencioso: no hay ríos ni bosques, y casi no hay aire para respirar.',
  'bd.intro2': 'En la Tierra aprendí cómo los seres vivos dependen unos de otros. Ahora construiré un domo sellado donde la vida de la Tierra pueda mantenerse sola: un biodomo.',
  'bd.intro3': 'Mi nave solo tiene espacio para 24 cajas. Debo elegir con cuidado.', 'bd.go': 'Empezar a empacar',
  'bd.ph.pack': '1 Empacar', 'bd.ph.build': '2 Construir', 'bd.ph.season': '3 Equilibrar',
  'bd.pack.t': 'Empaca la nave', 'bd.pack.h': 'Elige qué llevar. Cada caja ocupa espacio, así que piensa en lo que necesita cada ser vivo.',
  'bd.cargo': 'Carga', 'bd.launch': 'Volar a casa 🚀', 'bd.locked': 'Aún no lo has conseguido. Vuelve a la Tierra:',
  'bd.teach': 'Modo docente: todos los suministros están disponibles.',
  'bd.it.water': 'Barriles de agua', 'bd.it.air': 'Tanque de aire (oxígeno + dióxido de carbono)', 'bd.it.blocks': 'Kit de moléculas básicas', 'bd.it.soil': 'Suelo vivo', 'bd.it.grass': 'Semillas de pasto',
  'bd.it.flowers': 'Semillas de flores silvestres', 'bd.it.trees': 'Arbolitos', 'bd.it.pondweed': 'Plantas acuáticas', 'bd.it.bees': 'Polinizadores', 'bd.it.rabbits': 'Conejos', 'bd.it.hawks': 'Halcones',
  'bd.it.pond': 'Animales del estanque', 'bd.it.cellkit': 'Kit de cuidado celular',
  'bd.d.water': 'Todos los seres vivos necesitan agua. Las plantas la usan en la fotosíntesis; circula del estanque al aire y vuelve como "lluvia".',
  'bd.d.air': 'Una mezcla inicial de gases. Las plantas necesitan dióxido de carbono; los animales necesitan oxígeno.',
  'bd.d.blocks': 'Proteínas, carbohidratos, lípidos y ácidos nucleicos: las macromoléculas que forman toda célula. Aporta nutrientes para que la vida empiece.',
  'bd.d.soil': 'Suelo lleno de descomponedores (lombrices, hongos, bacterias). Convierten los desechos y la materia muerta en nutrientes.',
  'bd.d.grass': 'Productores de crecimiento rápido. El alimento principal de los conejos.', 'bd.d.flowers': 'Productores que necesitan polinizadores para hacer semillas.',
  'bd.d.trees': 'Productores de crecimiento lento. Producen mucho oxígeno y su sombra refresca el domo.', 'bd.d.pondweed': 'Productores que viven en el estanque y dan oxígeno a los animales acuáticos.',
  'bd.d.bees': 'Abejas y mariposas. Las flores silvestres no pueden hacer semillas sin ellas.', 'bd.d.rabbits': 'Herbívoros (consumidores primarios). Comen plantas.',
  'bd.d.hawks': 'Depredadores (consumidores secundarios). Comen conejos y controlan su número.', 'bd.d.pond': 'Peces y ranas (consumidores). Necesitan plantas acuáticas y oxígeno en el agua.',
  'bd.d.cellkit': 'Lo que aprendiste sobre las células: ayuda a los seres vivos a combatir enfermedades y mantener el equilibrio (homeostasis).',
  'bd.rq.pond': 'Reserva Arroyo de los Sauces: resuelve el misterio del estanque silencioso (agua limpia).', 'bd.rq.l22': 'Plataformas, Mundo 2, nivel 2: Building Blocks.', 'bd.rq.l21': 'Plataformas, Mundo 2, nivel 1: Water and Carbon.',
  'bd.it.wetland': 'Plantas filtradoras de humedal', 'bd.it.seedbank': 'Banco de semillas (muchos alelos)', 'bd.it.hardy': 'Semillas resistentes de sobrevivientes de sequía',
  'bd.d.wetland': 'Las espadañas y los juncos absorben el exceso de nutrientes antes de que lleguen al estanque, lo que ayuda a evitar la proliferación de algas.',
  'bd.d.seedbank': 'Semillas de pasto con mucha variación genética. Algunas plantas tienen alelos que resisten enfermedades, así que un tizón no puede acabar con todas.',
  'bd.d.hardy': 'Semillas de plantas que sobrevivieron a una sequía. La selección natural ya favoreció sus rasgos resistentes al calor.',
  'bd.rq.l32': 'Plataformas, Mundo 3, nivel 2: Living Together.', 'bd.rq.l35': 'Plataformas, Mundo 3, nivel 5: Human Footprints.', 'bd.rq.l42': 'Plataformas, Mundo 4, nivel 2: Making Gametes.', 'bd.rq.l51': 'Plataformas, Mundo 5, nivel 1: Survival of the Fittest.',
  'bd.n.wetland': 'Las plantas del humedal absorbieron el exceso de nutrientes y el estanque se mantuvo limpio.', 'bd.n.seedbank': 'Algunas plantas del banco de semillas tenían alelos que resisten el tizón. La variación genética ayudó a la población a sobrevivir.',
  'bd.n.hardy': 'Tus semillas resistentes venían de sobrevivientes de la sequía, así que el pasto ya estaba adaptado al calor.',
  'bd.rq.w1': 'Plataformas, Mundo 1: termina los 5 niveles.', 'bd.rq.l24': 'Plataformas, Mundo 2, nivel 4: Energy in Cells.', 'bd.rq.l25': 'Plataformas, Mundo 2, nivel 5: Food Webs and Cycles.',
  'bd.rq.soil': 'Reserva: descubre las lombrices y el tronco podrido.', 'bd.rq.poll': 'Reserva: haz un muestreo de polinizadores.', 'bd.rq.pondlife': 'Reserva: haz un conteo de ranas o una muestra de bichos del arroyo.',
  'bd.build.t': 'Construye el biodomo', 'bd.build.h': 'Coloca tus suministros. Los seres vivos necesitan que su alimento (y el agua y el suelo) estén primero. Puedes guardar cajas para después.',
  'bd.place': 'Colocar', 'bd.store': 'En el almacén', 'bd.inDome': 'En el domo', 'bd.start': 'Empezar la temporada 1 ▶',
  'bd.needFirst.plants': 'Las plantas necesitan agua y suelo primero.', 'bd.needFirst.herb': 'Los conejos morirían de hambre: coloca primero un productor (pasto o flores).',
  'bd.needFirst.pred': 'Los halcones morirían de hambre: coloca primero a sus presas (conejos).', 'bd.needFirst.poll': 'Los polinizadores necesitan flores: coloca primero las flores silvestres.',
  'bd.needFirst.pond': 'Los animales del estanque necesitan un estanque (2 barriles de agua) y plantas acuáticas primero.', 'bd.needStart': 'Para empezar: coloca agua, suelo vivo y al menos un tipo de planta.',
  'bd.missT': 'Todavía no puedes empezar. Falta:', 'bd.miss.water': '💧 Barriles de agua', 'bd.miss.soil': '🪱 Suelo vivo', 'bd.miss.plant': '🌾 Al menos un tipo de planta (hierba, flores silvestres o árboles)',
  'bd.miss.packed': 'empacado: colócalo desde la lista de la izquierda', 'bd.miss.notPacked': 'no empacado: vuelve y agrégalo a tus cajas', 'bd.miss.locked': 'aún no lo has ganado: vuelve a la Tierra a buscarlo',
  'bd.needPack': 'Para empezar una temporada necesitarás:', 'bd.repack': '⬅ Volver a empacar', 'bd.repackH': 'Tus cajas colocadas vuelven a la nave para que cambies lo que traes.',
  'bd.season': 'Temporada', 'bd.of': 'de', 'bd.end': 'Terminar temporada ▶', 'bd.next': 'Siguiente temporada ▶', 'bd.rewind': '↶ Retroceder una temporada', 'bd.listen': '👂 Escuchar',
  'bd.act.shade': 'Cubierta del domo: NO', 'bd.act.shadeOn': 'Cubierta del domo: SÍ', 'bd.act.shadeH': 'Mantiene el domo cerca de 22 °C, pero deja pasar menos luz.',
  'bd.act.pull': 'Arrancar la enredadera invasora', 'bd.act.cure': 'Usar el kit de cuidado celular', 'bd.act.penR': 'Llevar un grupo de conejos al corral', 'bd.act.penH': 'Llevar un halcón al corral', 'bd.act.skim': 'Sacar las algas sobrantes',
  'bd.g.o2': 'Oxígeno', 'bd.g.co2': 'Dióxido de carbono', 'bd.g.water': 'Agua', 'bd.g.temp': 'Temperatura', 'bd.g.nut': 'Nutrientes', 'bd.g.food': 'Productores', 'bd.g.web': 'Red alimentaria', 'bd.g.waste': 'Desechos',
  'bd.ok': 'bien', 'bd.warn': 'atención', 'bd.bad': 'problema', 'bd.species': 'Especies vivas',
  'bd.ev.boom': '¡Explosión de crías! Los conejos tuvieron una gran primavera y su número se disparó. ¿Qué mantiene a una población bajo control?',
  'bd.ev.heat': '¡Ola de calor! Mi estrella brilla más esta temporada. Las plantas pierden agua rápido con el calor.',
  'bd.ev.disease': '¡Enfermedad en las plantas! Un tizón se extiende por el pasto. ¿Tu domo depende de un solo tipo de planta?',
  'bd.ev.invasive': '¡Polizón! Una enredadera invasora llegó en una caja. Crece rápido, aquí nada se la come y puede ahogar a otras plantas.',
  'bd.ev.algae': 'La compostera goteó en el estanque: ¡nutrientes de más! Cuidado con una proliferación de algas.',
  'bd.ev.cold': '¡Ola de frío! Llegó el largo invierno de mi planeta. El frío lo hace todo más lento, y los polinizadores son sensibles.',
  'bd.ev.final': 'Última temporada. Mantén todo estable y termina la temporada para ver si tu biodomo está en equilibrio.',
  'bd.ev.calm': 'Una primera temporada tranquila. Observa cómo cambian los indicadores y termina la temporada.',
  'bd.n.diseaseCured': 'El kit de cuidado celular ayudó al pasto a combatir el tizón.', 'bd.n.diseaseMixed': 'El tizón afectó al pasto, pero las otras plantas se salvaron. Más especies significa un ecosistema más fuerte.',
  'bd.n.diseaseMono': 'El tizón acabó con casi todo el pasto, y había pocas otras plantas.', 'bd.n.heatDry': 'No había suficiente agua con el calor: las plantas se marchitaron.',
  'bd.n.heatTrait': 'Algunas plantas de pasto tenían un rasgo que las ayuda a resistir el calor. Hicieron más semillas, así que la próxima vez más plantas lo resistirán: selección natural.',
  'bd.n.coldBees': 'El frío dañó a los polinizadores.', 'bd.n.vine': 'La enredadera invasora se extendió y ahogó a las plantas nativas.', 'bd.n.hungryRabbits': 'A los conejos les faltó comida, y muchos murieron.',
  'bd.n.noPredators': 'Sin depredadores, los conejos siguieron aumentando y se comieron las plantas.', 'bd.n.hungryHawks': 'A los halcones les faltaron presas.',
  'bd.n.noFlowers': 'Muy pocas flores: los polinizadores pasaron hambre.', 'bd.n.noBees': 'Sin polinizadores: las flores silvestres no pudieron hacer semillas.',
  'bd.n.algae': '¡Proliferación de algas! Los nutrientes de más alimentaron a las algas y el estanque perdió oxígeno. Los peces sufrieron.', 'bd.n.noDecomp': 'Se acumulan los desechos: no hay descomponedores que los reciclen en nutrientes.',
  'bd.n.lowO2': 'Hay poco oxígeno: respiran más animales de los que las plantas pueden abastecer.', 'bd.n.lowCO2': 'Hay muy poco dióxido de carbono: a las plantas les falta para la fotosíntesis.', 'bd.n.highCO2': 'Se acumula el dióxido de carbono: la respiración supera a la fotosíntesis.',
  'bd.n.none': 'Todo se mantuvo estable esta temporada.',
  'bd.res.win': '¡Mi biodomo está en equilibrio! Productores, consumidores, depredadores, polinizadores y descomponedores trabajan juntos, y la materia sigue circulando.',
  'bd.res.lose': 'Aún no está en equilibrio. Mira los indicadores en rojo y las partes que faltan en la red alimentaria; luego retrocede o vuelve a intentarlo.',
  'bd.res.crash': 'El domo colapsó. Retrocede una temporada y prueba otra decisión.', 'bd.res.missing': 'Falta en la red alimentaria:',
  'bd.lv.producers': 'dos tipos de productores', 'bd.lv.herbivores': 'herbívoros', 'bd.lv.predators': 'depredadores', 'bd.lv.decomposers': 'descomponedores', 'bd.lv.pollinators': 'polinizadores',
  'bd.score': 'Puntos', 'bd.best': 'Mejor', 'bd.again': 'Empezar de nuevo', 'bd.log': 'Diario del alienígena: Vine a la Tierra a estudiar la vida. Aprendí a escucharla. Ahora un pedacito de la Tierra está vivo en mi mundo, y solo funciona porque cada parte está conectada.',
  'bd.v.rabbits': 'Conejo', 'bd.v.hawks': 'Halcón', 'bd.v.bees': 'Abeja', 'bd.v.decomp': 'Lombriz', 'bd.v.fish': 'Pez', 'bd.v.grass': 'Pasto',
  'bd.vl.rabbits.ok': '¡Mucho pasto! La vida es buena. (Salto, salto.)', 'bd.vl.rabbits.hungry': '¿Dónde quedó todo el pasto? Somos demasiados y no hay suficiente comida.', 'bd.vl.rabbits.many': 'Seguimos teniendo crías y nadie nos persigue...',
  'bd.vl.hawks.ok': 'Vigilo a los conejos. Alguien tiene que hacerlo.', 'bd.vl.hawks.hungry': 'Tengo hambre. No se ve ni un conejo.',
  'bd.vl.bees.ok': '¡Cuántas flores! Bzz, bzz, llevo polen a todas partes.', 'bd.vl.bees.hungry': 'No hay suficientes flores. Y hace frío. Bzz...',
  'bd.vl.decomp.ok': '¿Sobras otra vez? Deliciosas. Las convierto en nutrientes para las plantas.', 'bd.vl.decomp.busy': 'Tantos. Desechos. Ayuda. (Más lombrices, por favor.)',
  'bd.vl.fish.ok': 'Agua clara y muchas plantas acuáticas. ¡Blub!', 'bd.vl.fish.bad': 'El agua está verde y casi no puedo respirar. Blub...',
  'bd.vl.grass.ok': 'Sol, agua, dióxido de carbono... los convierto en azúcar. Pruébalo algún día.', 'bd.vl.grass.bad': 'Tengo sed, o hace mucho calor, o me comen demasiado rápido. Quizá las tres cosas.',
  'bd.fly1': 'Dejo la Tierra con todo lo que empaqué...', 'bd.fly2': 'Cruzando las estrellas, rumbo a casa.', 'bd.fly3': 'Aterrizando junto al domo.', 'bd.skip': 'Saltar ⏭',
  'bd.storeLeft': 'cajas en el almacén', 'bd.helpCam': 'Arrastra para mirar el domo. Rueda o + / − para acercar.'
});
C.I18N.en['a.biodome'] = 'Biodome Builder'; C.I18N.en['a.biodome.d'] = 'Keep a biodome in balance for all 8 seasons.'; C.I18N.es['a.biodome'] = 'Constructor de biodomos'; C.I18N.es['a.biodome.d'] = 'Mantén un biodomo en equilibrio durante las 8 temporadas.';
if (C.ACH && !C.ACH.some(function (q) { return q.id === 'biodome'; })) C.ACH.push({ id: 'biodome', ic: '🛸', tier: 'long' });
const ITEMS = [
  { id: 'water', ic: '💧', size: 1, max: 10, rq: 'pond' }, { id: 'air', ic: '🫧', size: 1, max: 2, rq: 'l21' }, { id: 'blocks', ic: '🧬', size: 2, max: 1, rq: 'l22' },
  { id: 'soil', ic: '🪱', size: 1, max: 4, rq: 'soil' }, { id: 'grass', ic: '🌾', size: 1, max: 4, rq: 'l24' }, { id: 'flowers', ic: '🌼', size: 1, max: 3, rq: 'l24' },
  { id: 'trees', ic: '🌳', size: 2, max: 2, rq: 'l24' }, { id: 'pondweed', ic: '🌿', size: 1, max: 2, rq: 'l24' }, { id: 'bees', ic: '🐝', size: 1, max: 2, rq: 'poll' },
  { id: 'rabbits', ic: '🐇', size: 1, max: 4, rq: 'l25' }, { id: 'hawks', ic: '🦅', size: 2, max: 2, rq: 'l32' }, { id: 'pond', ic: '🐟', size: 1, max: 2, rq: 'pondlife' },
  { id: 'cellkit', ic: '🩺', size: 1, max: 1, rq: 'w1' },
  /* earned in Worlds 3 to 5 */
  { id: 'wetland', ic: '🪷', size: 1, max: 1, rq: 'l35' }, { id: 'seedbank', ic: '🌰', size: 1, max: 1, rq: 'l42' }, { id: 'hardy', ic: '🌵', size: 1, max: 1, rq: 'l51' }];
const CAP = 24;
function lvDone(id) { const L0 = C.S.levels[id]; return !!(L0 && L0.stars); }
function cz() { return C.S.cozy || {}; }
const REQ = {
  pond: function () { return !!(cz().f && cz().f.solved); }, l21: function () { return lvDone('2-1'); }, l22: function () { return lvDone('2-2'); }, l24: function () { return lvDone('2-4'); }, l25: function () { return lvDone('2-5'); },
  /* predators are earned where predation is taught (World 3); students who already finished the biodome with hawks keep them */
  l32: function () { return lvDone('3-2') || (!!sv().done && lvDone('2-5')); }, l35: function () { return lvDone('3-5'); }, l42: function () { return lvDone('4-2'); }, l51: function () { return lvDone('5-1'); },
  w1: function () { return ['1-1', '1-2', '1-3', '1-4', '1-5'].every(lvDone); }, soil: function () { const f = cz().found || {}; return !!(f.worms && f.log); },
  poll: function () { const s = cz().surveys || {}; return Object.keys(s).some(function (k) { return k.indexOf('poll') === 0; }); },
  pondlife: function () { const s = cz().surveys || {}; return Object.keys(s).some(function (k) { return k.indexOf('frog') === 0 || k.indexOf('kick') === 0; }); } };
function earned(it) { return C.teach || C.S.set.unlock || REQ[it.rq](); }
let B = null; /* the running biodome */
function $(id) { return document.getElementById(id); }
function sv() { if (!C.S.dome) C.S.dome = {}; return C.S.dome; }

/* ---------- UI ---------- */
function ensureUI() {
  if ($('domeUI')) return;
  const css = document.createElement('style'); css.textContent = `
#domeUI { position: absolute; inset: 0; pointer-events: none; z-index: 20; font-size: calc(15px * var(--ts, 1)); }
#domeUI > * { pointer-events: auto; }
#bdTop { position: absolute; top: 8px; left: 8px; right: 8px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; pointer-events: none; }
#bdTop > * { pointer-events: auto; } #bdTop h2 { margin: 0 8px 0 0; font-size: 1.15em; color: #ffd166; text-shadow: 0 2px 6px #000; }
#bdTop .ph { padding: 3px 10px; border-radius: 999px; background: rgba(11,29,42,.75); border: 1px solid #44617a; color: #b8c8d8; font-size: .9em; }
#bdTop .ph.on { border-color: #ffd166; color: #fff; } #bdTop .sp { flex: 1; }
.bdPanel { position: absolute; background: rgba(11,29,42,.9); border: 1px solid #44617a; border-radius: 12px; color: #fff; padding: 10px 12px; overflow: auto; }
#bdLeft { left: 8px; top: 52px; bottom: 8px; width: min(360px, 42vw); }
#bdRight { right: 8px; top: 52px; width: min(250px, 30vw); max-height: calc(100% - 64px); }
#bdCard { left: 50%; transform: translateX(-50%); bottom: 10px; width: min(560px, calc(100% - 640px)); min-width: 260px; max-height: 42%; }
#bdLeft h3, #bdRight h3, #bdCard h3 { margin: 0 0 6px; font-size: 1.05em; color: #ffd166; }
.bdIt { display: grid; grid-template-columns: 30px 1fr auto; gap: 6px; align-items: center; padding: 6px 4px; border-bottom: 1px solid rgba(255,255,255,.08); }
.bdIt .ic { font-size: 1.5em; text-align: center; } .bdIt .nm { font-weight: 700; } .bdIt .ds { font-size: .82em; color: #c8d6e0; } .bdIt .lk { font-size: .82em; color: #ffb38a; }
.bdIt.locked { opacity: .75; } .bdIt .qty { display: flex; gap: 4px; align-items: center; } .bdIt .qty b { min-width: 1.6em; text-align: center; }
.bdIt button { padding: 2px 9px; min-width: 32px; }
.bdBar { height: 12px; border-radius: 6px; background: #22384a; overflow: hidden; margin: 4px 0 8px; } .bdBar i { display: block; height: 100%; background: #7be0ad; }
.bdBar.full i { background: #ffd166; }
#bdLeft.bdSeason { bottom: auto; max-height: calc(100% - 64px); } .bdMinB { font: inherit; font-size: .9em; margin-right: 6px; padding: 0 6px; border-radius: 6px; border: 1px solid #ffd166; background: transparent; color: #ffd166; cursor: pointer; } .bdMin > *:not(h3) { display: none !important; } #bdLeft.bdMin { bottom: auto; width: auto; } #bdRight.bdMin, #bdCard.bdMin { width: auto; min-width: 0; } body.bdDrag #bdLeft, body.bdDrag #bdRight, body.bdDrag #bdCard { opacity: .15; transition: opacity .2s; } .bdSun { align-self: center; margin-right: 4px; }
.fxb { font: inherit; font-size: .8em; padding: 1px 6px; margin-left: 4px; border-radius: 8px; border: 1px solid #ffd166; background: #3a2a10; color: #ffd166; cursor: pointer; } .bdFix button.fx.bad { border-color: #ff7a6a; } .bdFix button.fx.warn { border-color: #ffd166; } .bdFix { flex-wrap: wrap; align-items: center; } .bdFix button[disabled] { opacity: .55; }
.bdG { display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; align-items: center; margin: 3px 0; font-size: .92em; }
.bdG .st { padding: 0 7px; border-radius: 6px; font-size: .85em; } .bdG .ok { background: #1f6a48; } .bdG .warn { background: #8a6a10; } .bdG .bad { background: #9a2a2a; }
.bdG .meter { grid-column: 1 / 3; height: 6px; background: #22384a; border-radius: 3px; overflow: hidden; } .bdG .meter i { display: block; height: 100%; }
.bdBtns { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; } .bdNote { margin: 4px 0; padding: 5px 8px; border-left: 3px solid #ffd166; background: rgba(255,209,102,.08); border-radius: 4px; }
.bdWarn { color: #ffb38a; } .bdVoice { font-style: italic; } .bdMiss { margin: 4px 0 8px; padding-left: 1.2em; } .bdMiss li { margin: 3px 0; } .bdNeed { font-size: .9em; margin: 8px 0 2px; } .bdNeed span { display: inline-block; margin: 2px 6px 2px 0; padding: 1px 6px; border-radius: 6px; } .bdNeed .ok { background: rgba(123,224,173,.18); color: #7be0ad; } .bdNeed .no { background: rgba(255,179,138,.16); color: #ffb38a; }
#bdStory { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(5,8,20,.55); } #bdStory .card { max-width: 560px; text-align: left; }
@media (max-width: 900px) { #bdCard { left: 8px; right: 8px; transform: none; width: auto; bottom: 8px; } #bdLeft { bottom: 46%; } #bdRight { display: none; } }`;
  document.head.appendChild(css);
  const ui = document.createElement('div'); ui.id = 'domeUI'; ui.hidden = true;
  ui.innerHTML = '<div id="bdTop"></div><div id="bdLeft" class="bdPanel"></div><div id="bdRight" class="bdPanel"></div><div id="bdCard" class="bdPanel"></div><div id="bdStory" hidden></div>';
  $('toast').parentNode.appendChild(ui);
  ui.addEventListener('click', function (e) { const b = e.target.closest('button'); if (!b || !B) return; b.blur(); click(b.dataset); });
}
function esc(s) { return C.esc(s); }
function top() {
  const ph = B.phase === 'pack' ? 0 : B.phase === 'build' || B.phase === 'fly' ? 1 : 2;
  $('bdTop').innerHTML = '<h2>🛸 ' + esc(tx('bd.title')) + '</h2>' + ['pack', 'build', 'season'].map(function (p, i) { return '<span class="ph' + (i === ph ? ' on' : '') + '">' + esc(tx('bd.ph.' + p)) + '</span>'; }).join('') +
    '<span class="sp"></span><span class="czLang btns"><button type="button" data-lang="en" aria-pressed="' + ((C.S.set.lang || 'en') === 'en') + '">English</button><button type="button" data-lang="es" aria-pressed="' + (C.S.set.lang === 'es') + '">Español</button></span>' +
    '<button type="button" data-a="menu">' + esc(tx('bd.back')) + '</button>';
}
function used() { return ITEMS.reduce(function (n, it) { return n + (B.cargo[it.id] || 0) * it.size; }, 0); }
function itemRow(it, mode) {
  const ok = earned(it), n = mode === 'pack' ? (B.cargo[it.id] || 0) : (B.store[it.id] || 0), inDome = B.placed[it.id] || 0;
  let right = '';
  if (mode === 'pack') right = ok ? '<span class="qty"><button type="button" data-a="dec" data-id="' + it.id + '" aria-label="−">−</button><b>' + n + '</b><button type="button" data-a="inc" data-id="' + it.id + '" aria-label="+">+</button></span>' : '🔒';
  else right = n > 0 ? '<button type="button" data-a="place" data-id="' + it.id + '">' + esc(tx('bd.place')) + ' (' + n + ')</button>' : '<span class="ds">' + (inDome ? '✓ ' + inDome : '') + '</span>';
  return '<div class="bdIt' + (ok ? '' : ' locked') + '"><span class="ic">' + it.ic + '</span><div><div class="nm">' + esc(tx('bd.it.' + it.id)) + ' <span class="ds">(' + it.size + ' ' + (it.size > 1 ? '▢▢' : '▢') + ')</span></div>' +
    '<div class="ds">' + esc(tx('bd.d.' + it.id)) + '</div>' + (ok ? '' : '<div class="lk">' + esc(tx('bd.locked')) + ' ' + esc(tx('bd.rq.' + it.rq)) + '</div>') + '</div>' + right + '</div>';
}
function left() {
  const L = $('bdLeft');
  if (B.phase === 'pack') { const u = used();
    L.innerHTML = '<h3>' + esc(tx('bd.pack.t')) + '</h3><p class="ds">' + esc(tx('bd.pack.h')) + '</p>' + (C.teach || C.S.set.unlock ? '<p class="ds">' + esc(tx('bd.teach')) + '</p>' : '') +
      '<b>' + esc(tx('bd.cargo')) + ': ' + u + ' / ' + CAP + '</b><div class="bdBar' + (u >= CAP ? ' full' : '') + '"><i style="width:' + Math.round(u / CAP * 100) + '%"></i></div>' +
      ITEMS.map(function (it) { return itemRow(it, 'pack'); }).join('') + packCheck() +
      '<div class="bdBtns">' + (ITEMS.some(function (it) { return !earned(it); }) ? '<button type="button" data-a="earth">🌍 ' + esc(tx('bd.earth')) + '</button>' : '') + '<button type="button" class="primary" data-a="launch"' + (u ? '' : ' disabled') + '>' + esc(tx('bd.launch')) + '</button></div>';
  } else {
    const left0 = ITEMS.reduce(function (n, it) { return n + (B.store[it.id] || 0); }, 0);
    L.innerHTML = '<h3>' + esc(tx(B.phase === 'build' ? 'bd.build.t' : 'bd.store')) + '</h3>' + (B.phase === 'build' ? '<p class="ds">' + esc(tx('bd.build.h')) + '</p>' : '<p class="ds">' + left0 + ' ' + esc(tx('bd.storeLeft')) + '</p>' + (left0 ? '<p class="ds">🚪 ' + esc(tx('bd.airlock')) + '</p>' : '')) +
      (B.phase === 'build' && left0 ? '<div class="bdBtns"><button type="button" data-a="placeAll" title="' + esc(tx('bd.placeAllH')) + '">' + esc(tx('bd.placeAll')) + '</button></div><p class="ds">' + esc(tx('bd.placeTip')) + '</p>' : '') +
      ITEMS.filter(function (it) { return B.phase === 'build' ? (B.cargo[it.id] || 0) > 0 : (B.store[it.id] || 0) > 0; }).map(function (it) { return itemRow(it, 'build'); }).join('') /* during the seasons, only what is still in storage */ + (B.warn ? '<p class="bdWarn">⚠️ ' + esc(B.warn) + '</p>' : '');
  }
}
function right() {
  const R = $('bdRight'); if (B.phase === 'pack') { R.hidden = true; return; } R.hidden = false;
  const s = B.sim, g = DS.gauges(s), sp = DS.species(s);
  const val = { o2: Math.round(s.o2) + '%', co2: Math.round(s.co2) + '', water: s.water.toFixed(1), temp: s.temp.toFixed(0) + ' °C', nut: s.nut.toFixed(1), food: DS.producers(s).toFixed(1), web: '🐇 ' + s.rabbits.toFixed(1) + ' · 🦅 ' + s.hawks.toFixed(1), waste: s.waste.toFixed(1) };
  const pct = { o2: s.o2, co2: s.co2, water: s.water * 8, temp: (s.temp - 5) * 3, nut: s.nut * 6, food: DS.producers(s) * 3.5, web: 50, waste: s.waste * 8 };
  const col = { ok: '#7be0ad', warn: '#ffd166', bad: '#ff7a6a' };
  R.innerHTML = '<h3>📊 ' + esc(tx('bd.season')) + ' ' + Math.max(1, s.season) + ' ' + esc(tx('bd.of')) + ' ' + DS.SEASONS + '</h3>' +
    Object.keys(g).map(function (k) { const canFix = B.phase === 'season' && !s.evDone && g[k] !== 'ok'; return '<div class="bdG"><span>' + esc(tx('bd.g.' + k)) + ': <b>' + esc(val[k]) + '</b>' + (canFix ? ' <button type="button" class="fxb" data-a="fix" data-id="' + k + '">' + esc(tx('bd.fix')) + '</button>' : '') + '</span><span class="st ' + g[k] + '">' + esc(tx('bd.' + g[k])) + '</span><span class="meter"><i style="width:' + Math.max(3, Math.min(100, pct[k])) + '%;background:' + col[g[k]] + '"></i></span></div>'; }).join('') +
    '<p class="ds">' + esc(tx('bd.species')) + ': ' + sp.length + ' / 9</p><p class="ds">' + esc(tx('bd.helpCam')) + '</p>';
}
function card() {
  const K = $('bdCard'), s = B.sim; let h = '';
  if (B.phase === 'pack') { K.hidden = true; return; } K.hidden = false;
  if (B.phase === 'build') {
    /* never a dead end: if something is missing, say exactly what and why, and always offer a way back to packing */
    const can = canStart(), miss = missing();
    h = '<h3>🧱 ' + esc(tx('bd.build.t')) + '</h3>' + (can ? '<p>' + esc(tx('bd.build.h')) + '</p>' :
      '<p class="bdWarn"><b>⚠️ ' + esc(tx('bd.missT')) + '</b></p><ul class="bdMiss">' + miss.map(function (m) { return '<li>' + esc(tx('bd.miss.' + m.k)) + ' <span class="ds">(' + esc(tx('bd.miss.' + m.why)) + ')</span></li>'; }).join('') + '</ul>') +
      '<div class="bdBtns"><button type="button" data-a="repack" title="' + esc(tx('bd.repackH')) + '">' + esc(tx('bd.repack')) + '</button><button type="button" class="primary" data-a="start"' + (can ? '' : ' disabled') + '>' + esc(tx('bd.start')) + '</button></div>';
  } else if (B.phase === 'season') {
    const evKey = s.ev ? 'bd.ev.' + s.ev : 'bd.ev.calm';
    h = '<h3>' + esc(tx('bd.season')) + ' ' + s.season + ' ' + esc(tx('bd.of')) + ' ' + DS.SEASONS + '</h3>';
    if (!s.evDone && B.fix) { h = fixHTML(); }
    else if (!s.evDone) {
      h += '<p class="bdNote">' + esc(tx(evKey)) + '</p>' + fixChips(s) + '<div class="bdBtns">' +
        sunCtl(s) +
        (s.vine > 0.05 ? '<button type="button" data-a="pull">🌱✋ ' + esc(tx('bd.act.pull')) + '</button>' : '') + (s.sick && (s.kit >= 1 || (B.store.cellkit || 0) > 0) && !s.cured ? '<button type="button" data-a="cure">🩺 ' + esc(tx('bd.act.cure')) + '</button>' : '') +
        (s.rabbits > 0.6 ? '<button type="button" data-a="penR">🐇 ' + esc(tx('bd.act.penR')) + '</button>' : '') + (s.hawks > 0.3 ? '<button type="button" data-a="penH">🦅 ' + esc(tx('bd.act.penH')) + '</button>' : '') +
        (s.nut > 7 ? '<button type="button" data-a="skim">🟢 ' + esc(tx('bd.act.skim')) + '</button>' : '') + '</div>' +
        '<div class="bdBtns"><button type="button" data-a="listen">' + esc(tx('bd.listen')) + '</button>' + (B.hist.length ? '<button type="button" data-a="rewind">' + esc(tx('bd.rewind')) + '</button>' : '') + '<button type="button" class="primary" data-a="run">' + esc(tx('bd.end')) + '</button></div>';
    } else {
      const notes = (s.notes || []); h += (notes.length ? notes.map(function (n) { return '<p class="bdNote">' + esc(tx('bd.n.' + n)) + '</p>'; }).join('') : '<p class="bdNote">' + esc(tx('bd.n.none')) + '</p>');
      const r = DS.result(s);
      if (r.crashed) h += '<p class="bdWarn">' + esc(tx('bd.res.crash')) + '</p>';
      h += '<div class="bdBtns"><button type="button" data-a="listen">' + esc(tx('bd.listen')) + '</button><button type="button" data-a="rewind">' + esc(tx('bd.rewind')) + '</button>' + (r.crashed ? '' : '<button type="button" class="primary" data-a="next">' + esc(tx(s.season >= DS.SEASONS ? 'bd.end' : 'bd.next')) + '</button>') + '</div>';
    }
    if (B.voice) h += '<p class="bdVoice">' + esc(B.voice) + '</p>';
  } else if (B.phase === 'end') {
    const r = DS.result(s), sc = DS.score(s, storeLeft(), B.rewinds), d = sv();
    h = '<h3>' + (r.balanced ? '🌍✨ ' : '🔧 ') + esc(tx(r.balanced ? 'bd.res.win' : 'bd.res.lose')) + '</h3>';
    const miss = Object.keys(r.levels).filter(function (k) { return !r.levels[k]; }); if (miss.length) h += '<p class="bdWarn">' + esc(tx('bd.res.missing')) + ' ' + miss.map(function (k) { return esc(tx('bd.lv.' + k)); }).join(', ') + '</p>';
    h += '<p><b>' + esc(tx('bd.score')) + ': ' + sc + '</b> · ' + esc(tx('bd.best')) + ': ' + (d.best || sc) + '</p>' + (r.balanced ? '<p class="bdVoice">' + esc(tx('bd.log')) + '</p>' : '') +
      '<div class="bdBtns"><button type="button" data-a="rewind">' + esc(tx('bd.rewind')) + '</button><button type="button" data-a="again">' + esc(tx('bd.again')) + '</button><button type="button" class="primary" data-a="menu">' + esc(tx('bd.back')) + '</button></div>';
  }
  K.innerHTML = h;
}
function render() {
  if (B.phase === 'fly') { top(); $('bdLeft').hidden = true; $('bdRight').hidden = true; const K = $('bdCard'); K.hidden = false; K.innerHTML = '<p id="bdFlyCap" class="bdVoice"></p><div class="bdBtns"><button type="button" data-a="skipfly">' + esc(tx('bd.skip')) + '</button></div>'; return; }
  $('bdLeft').hidden = false; top(); left(); right(); card(); $('bdLeft').classList.toggle('bdSeason', B.phase !== 'pack' && B.phase !== 'build'); minButtons(); }
/* each panel can shrink to its title bar, so the dome is easy to see */
function minButtons() { B.min = B.min || {};
  ['bdLeft', 'bdRight', 'bdCard'].forEach(function (id) { const el = $(id); if (!el || el.hidden) return; const mn = !!B.min[id]; el.classList.toggle('bdMin', mn);
    const h = el.querySelector('h3'); if (!h) return; const b = document.createElement('button'); b.type = 'button'; b.className = 'bdMinB'; b.dataset.a = 'min'; b.dataset.id = id; b.textContent = mn ? '▸' : '▾'; b.title = tx(mn ? 'bd.max' : 'bd.min'); b.setAttribute('aria-label', b.title); h.insertBefore(b, h.firstChild); }); }
function storeLeft() { return ITEMS.reduce(function (n, it) { return n + (B.store[it.id] || 0); }, 0); }
/* what still has to be placed before season 1, and whether it is waiting in storage, was never packed, or is not earned yet */
function missing() { const p = B.placed, out = [], why = function (ids) { if (ids.some(function (id) { return (B.store[id] || 0) > 0; })) return 'packed'; if (ids.some(function (id) { const it = ITEMS.find(function (q) { return q.id === id; }); return earned(it); })) return 'notPacked'; return 'locked'; };
  if (!((p.water || 0) >= 1)) out.push({ k: 'water', why: why(['water']) }); if (!((p.soil || 0) >= 1)) out.push({ k: 'soil', why: why(['soil']) });
  if (((p.grass || 0) + (p.flowers || 0) + (p.trees || 0)) < 1) out.push({ k: 'plant', why: why(['grass', 'flowers', 'trees']) }); return out; }
/* a small checklist before launch: the three things every dome needs to begin */
function packCheck() { const c = B.cargo, has = { water: (c.water || 0) > 0, soil: (c.soil || 0) > 0, plant: ((c.grass || 0) + (c.flowers || 0) + (c.trees || 0)) > 0 };
  return '<p class="bdNeed">' + esc(tx('bd.needPack')) + ' ' + ['water', 'soil', 'plant'].map(function (k) { return '<span class="' + (has[k] ? 'ok' : 'no') + '">' + (has[k] ? '✓ ' : '✗ ') + esc(tx('bd.miss.' + k).split(' (')[0]) + '</span>'; }).join(' ') + '</p>'; }
function canStart() { const p = B.placed; return (p.water || 0) >= 1 && (p.soil || 0) >= 1 && ((p.grass || 0) + (p.flowers || 0) + (p.trees || 0)) >= 1; }
function story() {
  const S0 = $('bdStory'); S0.hidden = false;
  S0.innerHTML = '<div class="card"><h2>🛸 ' + esc(tx('bd.title')) + '</h2><p>' + esc(tx('bd.intro1')) + '</p><p>' + esc(tx('bd.intro2')) + '</p><p>' + esc(tx('bd.intro3')) + '</p><button type="button" class="primary" data-a="go">' + esc(tx('bd.go')) + '</button></div>';
  setTimeout(function () { const b = S0.querySelector('button'); if (b) b.focus(); }, 50);
}
/* ---------- rules for placing ---------- */
function placeCheck(id) {
  const p = B.placed, prod = (p.grass || 0) + (p.flowers || 0);
  if (['grass', 'flowers', 'trees', 'pondweed'].indexOf(id) >= 0 && (!(p.water >= 1) || !(p.soil >= 1))) return 'bd.needFirst.plants';
  if (id === 'rabbits' && !prod) return 'bd.needFirst.herb';
  if (id === 'hawks' && !(p.rabbits >= 1)) return 'bd.needFirst.pred';
  if (id === 'bees' && !(p.flowers >= 1)) return 'bd.needFirst.poll';
  if (id === 'pond' && (!(p.water >= 2) || !(p.pondweed >= 1))) return 'bd.needFirst.pond';
  return null;
}
function click(d) {
  const a = d.a;
  if (d.lang) { C.S.set.lang = d.lang; C.save(); render(); if (!$('bdStory').hidden) story(); return; }
  if (a === 'menu') { exit(); return; }
  if (a === 'go') { $('bdStory').hidden = true; sv().seen = 1; C.save(); render(); return; }
  if (a === 'earth') { exit(); return; }
  if (a === 'inc' || a === 'dec') { const it = ITEMS.find(function (q) { return q.id === d.id; }), n = B.cargo[it.id] || 0;
    if (a === 'inc' && n < it.max && used() + it.size <= CAP) B.cargo[it.id] = n + 1; else if (a === 'dec' && n > 0) B.cargo[it.id] = n - 1; else C.beep(200, 0.08, 'sine');
    left(); return; }
  if (a === 'launch') { B.store = Object.assign({}, B.cargo); startFlight(); return; }
  if (a === 'skipfly') { B.flyT = 99; return; }
  if (a === 'place') { const why = placeCheck(d.id); if (why) { B.warn = tx(why); C.beep(220, 0.12, 'triangle'); left(); return; } B.warn = null;
    if ((B.store[d.id] || 0) > 0) { B.store[d.id]--; B.placed[d.id] = (B.placed[d.id] || 0) + 1; DS.place(B.sim, d.id); sfx('pop'); B.dirty = true; } render(); return; }
  if (a === 'placeAll') { const order = ['water', 'air', 'soil', 'blocks', 'cellkit', 'grass', 'seedbank', 'hardy', 'flowers', 'trees', 'pondweed', 'wetland', 'bees', 'rabbits', 'hawks', 'pond'], left = [];
    for (let pass = 0; pass < 2; pass++) order.forEach(function (id) { while ((B.store[id] || 0) > 0 && !placeCheck(id)) { B.store[id]--; B.placed[id] = (B.placed[id] || 0) + 1; DS.place(B.sim, id); } });
    ITEMS.forEach(function (it) { if ((B.store[it.id] || 0) > 0) left.push(tx('bd.it.' + it.id)); }); B.warn = left.length ? tx('bd.placeAllLeft') + ' ' + left.join(', ') : null; sfx('pop'); B.dirty = true; render(); return; }
  if (a === 'min') { B.min = B.min || {}; B.min[d.id] = !B.min[d.id]; render(); return; }
  if (a === 'repack') { /* back to packing: crates you placed go back into the ship's cargo list (which never changed) */ B.phase = 'pack'; B.store = {}; B.placed = {}; B.sim = DS.fresh(); B.hist = []; B.warn = null; B.voice = null; B.dirty = true; render(); return; }
  if (a === 'start') { if (!canStart()) return; B.phase = 'season'; B.hist = []; DS.beginSeason(B.sim); B.voice = null; render(); return; }
  const s = B.sim;
  if (a === 'fix') { B.fix = d.id; B.warn = null; render(); return; }
  if (a === 'fixClose') { B.fix = null; B.warn = null; render(); return; }
  if (a === 'condense' || a === 'compost' || a === 'releaseR' || a === 'releaseH' || a === 'sunLess' || a === 'sunMore' || a === 'insulate' || a === 'plant') { DS.act(s, a); sfx('pop'); B.dirty = true; render(); return; }
  if (a === 'shade') { DS.act(s, 'shade'); render(); return; }
  if (a === 'cure' && s.kit < 1 && (B.store.cellkit || 0) > 0) { B.store.cellkit--; B.placed.cellkit = (B.placed.cellkit || 0) + 1; DS.place(s, 'cellkit'); }
  if (a === 'pull' || a === 'cure' || a === 'skim') { DS.act(s, a); sfx('pop'); B.dirty = true; render(); return; }
  if (a === 'penR') { DS.act(s, 'penRabbits'); B.dirty = true; render(); return; }
  if (a === 'penH') { DS.act(s, 'penHawks'); B.dirty = true; render(); return; }
  if (a === 'listen') { B.voice = voiceLine(); render(); return; }
  if (a === 'run') { B.fix = null; B.hist.push(JSON.stringify({ sim: s, store: B.store, placed: B.placed })); DS.runSeason(s); B.voice = null; B.timeT = 2.2; sfx('season'); B.dirty = true; render(); return; }
  if (a === 'next') { if (s.season >= DS.SEASONS) { B.phase = 'end'; const sc = DS.score(s, storeLeft(), B.rewinds), dd = sv(); dd.best = Math.max(dd.best || 0, sc); if (DS.result(s).balanced) { dd.done = 1; if (C.award) try { C.award('biodome'); } catch (e) { /* no achievement */ } } C.save(); render(); return; }
    DS.beginSeason(s); B.voice = null; B.dirty = true; render(); return; }
  if (a === 'rewind') { const h = B.hist.pop(); if (!h) return; const o = JSON.parse(h); B.sim = o.sim; B.store = o.store; B.placed = o.placed; B.rewinds++; B.phase = 'season'; B.sim.evDone = false; B.dirty = true; render(); return; }
  if (a === 'again') { exit(); start(); return; }
}
Object.assign(C.I18N.en, {"bd.airlock": "Spare crates come in through the airlock, so the dome stays sealed.", "bd.act.skim": "Scoop extra algae onto the compost pile", "bd.sun": "☀️ Sunlight", "bd.sun0": "full sun", "bd.sun1": "half shade", "bd.sun2": "deep shade", "bd.sunLess": "⛱️ Less sun", "bd.sunMore": "☀️ More sun", "bd.sunH": "The dome always stays sealed. A sun shade over the glass lets in less sunlight: the dome gets cooler and loses less water in a heat wave, but plants grow and make oxygen more slowly.", "bd.insul": "🧱 Insulating panels", "bd.insulOn": "ON", "bd.insulOff": "OFF", "bd.insulH": "Panels that keep the dome's own heat in during a cold snap. They warm the dome toward 22 °C but never cool it.", "bd.tool.sunLess": "⛱️ Less sun (sun shade)", "bd.tool.sunMore": "☀️ More sun (raise the shade)", "bd.tool.insulOn": "🧱 Turn ON the insulating panels", "bd.tool.insulOff": "🧱 Turn OFF the insulating panels", "bd.tool.plant": "🌱 Plant cuttings and seeds from your own plants", "bd.tool.plantH": "More producers to take up carbon dioxide and make oxygen. New plants use some nutrients. Once per season.", "bd.tool.plantNo": "🌱 Plant cuttings and seeds (needs some plants and nutrients in the dome)", "bd.placeAll": "📦 Place all", "bd.placeAllH": "Places every crate in storage in a safe order (water and soil first, then plants, then animals).", "bd.placeAllLeft": "Could not place yet:", "bd.placeTip": "Tip: keeping a few crates in storage gives you ways to fix problems later.", "bd.min": "Minimize", "bd.max": "Show"});
Object.assign(C.I18N.es, {"bd.airlock": "Las cajas de repuesto entran por la esclusa, así el domo sigue sellado.", "bd.act.skim": "Echar las algas sobrantes a la pila de compost", "bd.sun": "☀️ Luz del sol", "bd.sun0": "sol pleno", "bd.sun1": "media sombra", "bd.sun2": "sombra densa", "bd.sunLess": "⛱️ Menos sol", "bd.sunMore": "☀️ Más sol", "bd.sunH": "El domo siempre está sellado. Una malla de sombra sobre el vidrio deja pasar menos luz: el domo se enfría y pierde menos agua en una ola de calor, pero las plantas crecen y producen oxígeno más despacio.", "bd.insul": "🧱 Paneles aislantes", "bd.insulOn": "SÍ", "bd.insulOff": "NO", "bd.insulH": "Paneles que guardan el calor del propio domo durante una ola de frío. Lo calientan hacia 22 °C, pero nunca lo enfrían.", "bd.tool.sunLess": "⛱️ Menos sol (malla de sombra)", "bd.tool.sunMore": "☀️ Más sol (quitar sombra)", "bd.tool.insulOn": "🧱 Poner los paneles aislantes", "bd.tool.insulOff": "🧱 Quitar los paneles aislantes", "bd.tool.plant": "🌱 Plantar esquejes y semillas de tus propias plantas", "bd.tool.plantH": "Más productores para absorber dióxido de carbono y producir oxígeno. Las plantas nuevas usan algunos nutrientes. Una vez por temporada.", "bd.tool.plantNo": "🌱 Plantar esquejes y semillas (necesita plantas y nutrientes en el domo)", "bd.placeAll": "📦 Colocar todo", "bd.placeAllH": "Coloca todas las cajas del almacén en un orden seguro (primero agua y suelo, luego plantas, luego animales).", "bd.placeAllLeft": "Todavía no se pudo colocar:", "bd.placeTip": "Consejo: guardar algunas cajas en el almacén te da formas de arreglar problemas después.", "bd.min": "Minimizar", "bd.max": "Mostrar"});
/* ---------- FIX IT: every yellow or red gauge explains why, and offers things you can do right now ---------- */
Object.assign(C.I18N.en, {"bd.fix": "🔧 Fix", "bd.fixAll": "Needs attention:", "bd.fixNone": "All gauges are green right now. 👍", "bd.fixHelp": "A yellow or red gauge? Press 🔧 Fix next to it to see what you can do. Then end the season to see what happens.", "bd.fixClose": "Close", "bd.fixOk": "✓ This gauge is OK now. Changes keep working when you end the season.", "bd.fixWhy": "Why?", "bd.fixDo": "What you can do:", "bd.fixFromStore": "Add from storage:", "bd.fixNoStore": "(none left in storage)", "bd.fixUsed": "(already used this season)", "bd.tool.condense": "💧 Collect water from the dome glass", "bd.tool.condenseH": "Water evaporates, condenses on the cool glass and drips down: the water cycle. +1.5 water, once per season.", "bd.tool.compost": "♻️ Turn the compost pile", "bd.tool.compostH": "Gives the decomposers air, so they break waste down into nutrients faster (and breathe out a little carbon dioxide). Once per season.", "bd.tool.compostNo": "♻️ Turn the compost pile (needs decomposers: add living soil first)", "bd.tool.releaseR": "🐇 Let a rabbit group out of the pen", "bd.tool.releaseH": "🦅 Let a hawk out of the pen", "bd.tool.coverOn": "⛱️ Turn the dome cover ON", "bd.tool.coverOff": "☀️ Turn the dome cover OFF (more light for plants)", "bd.why.o2.low": "Animals, decomposers and plants all use oxygen in cellular respiration. Only producers make it, in photosynthesis. Right now oxygen is used faster than it is made.", "bd.why.o2.high": "Lots of photosynthesis and very little respiration. Plenty of oxygen is fine, but the dome needs consumers too.", "bd.why.co2.low": "Plants used up most of the carbon dioxide they need for photosynthesis. Animals and decomposers breathe it back out.", "bd.why.co2.high": "More respiration than photosynthesis. Carbon dioxide also traps heat, so the dome warms up.", "bd.why.water.low": "Plants need water for photosynthesis, and some escapes through the dome seals each season (more in a heat wave).", "bd.why.temp.high": "A heat wave or too much carbon dioxide (it traps heat). Living things work best near 22 °C: enzymes slow down when it is too hot.", "bd.why.temp.low": "A cold snap. Cold slows down growth, and pollinators struggle below 16 °C.", "bd.why.nut.low": "Plants take nutrients from the soil as they grow. Decomposers put them back by breaking down waste.", "bd.why.nut.high": "Too many nutrients wash into the pond and feed an algae bloom, which uses up the oxygen fish need.", "bd.why.food.low": "Too few producers. Every food chain starts with plants, so animals will go hungry.", "bd.why.web.many": "Too many rabbits for the plants. Without enough predators, herbivores eat the producers faster than they regrow.", "bd.why.web.hungry": "The hawks are running out of rabbits to eat. Predators need enough prey.", "bd.why.web.empty": "No consumers yet. A food web needs herbivores (and predators to keep them in check).", "bd.why.web.nopred": "Rabbits with no predators can grow out of control.", "bd.why.waste.high": "Waste and dead matter are piling up. Decomposers turn it back into nutrients, if there are enough of them."});
Object.assign(C.I18N.es, {"bd.fix": "🔧 Arreglar", "bd.fixAll": "Necesita atención:", "bd.fixNone": "Todos los indicadores están en verde ahora. 👍", "bd.fixHelp": "¿Un indicador amarillo o rojo? Pulsa 🔧 Arreglar junto a él para ver qué puedes hacer. Luego termina la temporada para ver qué pasa.", "bd.fixClose": "Cerrar", "bd.fixOk": "✓ Este indicador está bien ahora. Los cambios siguen funcionando cuando terminas la temporada.", "bd.fixWhy": "¿Por qué?", "bd.fixDo": "Lo que puedes hacer:", "bd.fixFromStore": "Agregar del almacén:", "bd.fixNoStore": "(no queda nada en el almacén)", "bd.fixUsed": "(ya se usó esta temporada)", "bd.tool.condense": "💧 Recoger el agua del vidrio del domo", "bd.tool.condenseH": "El agua se evapora, se condensa en el vidrio frío y gotea: el ciclo del agua. +1.5 de agua, una vez por temporada.", "bd.tool.compost": "♻️ Voltear la pila de compost", "bd.tool.compostH": "Les da aire a los descomponedores, así descomponen los desechos en nutrientes más rápido (y exhalan un poco de dióxido de carbono). Una vez por temporada.", "bd.tool.compostNo": "♻️ Voltear la pila de compost (necesita descomponedores: primero agrega suelo vivo)", "bd.tool.releaseR": "🐇 Sacar un grupo de conejos del corral", "bd.tool.releaseH": "🦅 Sacar un halcón del corral", "bd.tool.coverOn": "⛱️ Poner la cubierta del domo", "bd.tool.coverOff": "☀️ Quitar la cubierta del domo (más luz para las plantas)", "bd.why.o2.low": "Los animales, los descomponedores y las plantas usan oxígeno en la respiración celular. Solo los productores lo fabrican, en la fotosíntesis. Ahora se usa más oxígeno del que se produce.", "bd.why.o2.high": "Mucha fotosíntesis y muy poca respiración. Tener mucho oxígeno está bien, pero el domo también necesita consumidores.", "bd.why.co2.low": "Las plantas gastaron casi todo el dióxido de carbono que necesitan para la fotosíntesis. Los animales y los descomponedores lo devuelven al respirar.", "bd.why.co2.high": "Hay más respiración que fotosíntesis. Además, el dióxido de carbono atrapa el calor, así que el domo se calienta.", "bd.why.water.low": "Las plantas necesitan agua para la fotosíntesis, y un poco se escapa por las juntas del domo cada temporada (más en una ola de calor).", "bd.why.temp.high": "Una ola de calor o demasiado dióxido de carbono (atrapa el calor). Los seres vivos funcionan mejor cerca de 22 °C: las enzimas se vuelven lentas cuando hace demasiado calor.", "bd.why.temp.low": "Una ola de frío. El frío frena el crecimiento, y a los polinizadores les cuesta trabajar por debajo de 16 °C.", "bd.why.nut.low": "Las plantas toman nutrientes del suelo al crecer. Los descomponedores los devuelven al descomponer los desechos.", "bd.why.nut.high": "Demasiados nutrientes llegan al estanque y alimentan una proliferación de algas, que gasta el oxígeno que necesitan los peces.", "bd.why.food.low": "Hay muy pocos productores. Toda cadena alimentaria empieza con las plantas, así que los animales pasarán hambre.", "bd.why.web.many": "Hay demasiados conejos para las plantas. Sin suficientes depredadores, los herbívoros se comen a los productores más rápido de lo que vuelven a crecer.", "bd.why.web.hungry": "A los halcones se les acaban los conejos. Los depredadores necesitan suficientes presas.", "bd.why.web.empty": "Todavía no hay consumidores. Una red alimentaria necesita herbívoros (y depredadores que los controlen).", "bd.why.web.nopred": "Los conejos sin depredadores pueden aumentar sin control.", "bd.why.waste.high": "Los desechos y la materia muerta se están acumulando. Los descomponedores los convierten de nuevo en nutrientes, si hay suficientes."});
function sunCtl(s) { const sh = typeof s.shade === 'number' ? s.shade : (s.shade ? 2 : 0);
  return '<span class="bdSun" title="' + esc(tx('bd.sunH')) + '">' + esc(tx('bd.sun')) + ': <b>' + esc(tx('bd.sun' + sh)) + '</b></span>' +
    '<button type="button" data-a="sunLess"' + (sh >= 2 ? ' disabled' : '') + ' title="' + esc(tx('bd.sunH')) + '">' + esc(tx('bd.sunLess')) + '</button>' +
    '<button type="button" data-a="sunMore"' + (sh <= 0 ? ' disabled' : '') + '>' + esc(tx('bd.sunMore')) + '</button>' +
    '<button type="button" data-a="insulate" aria-pressed="' + !!s.insul + '" title="' + esc(tx('bd.insulH')) + '">' + esc(tx('bd.insul')) + ': ' + esc(tx(s.insul ? 'bd.insulOn' : 'bd.insulOff')) + '</button>'; }
function fixSide(k, s) { /* which way is the gauge off? */
  if (k === 'o2') return s.o2 < 25 ? 'low' : 'high'; if (k === 'co2') return s.co2 < 12 ? 'low' : 'high'; if (k === 'temp') return s.temp < 16 ? 'low' : 'high'; if (k === 'nut') return s.nut < 2.5 ? 'low' : 'high';
  if (k === 'water' || k === 'food') return 'low'; if (k === 'waste') return 'high';
  if (k === 'web') { const r = s.rabbits, h = s.hawks; if (r < 0.25 && h < 0.25) return 'empty'; if (h > 0.25 && r < 0.6) return 'hungry'; if (r > 5) return 'many'; return 'nopred'; }
  return 'low';
}
function fixOptions(k, s) { /* [label, data-a, data-id, enabled, hint] ; store ids are offered as "add from storage" */
  const side = fixSide(k, s), out = [], store = [];
  const tool = function (key, a, ok, hint) { out.push({ t: tx(key), a: a, ok: ok, h: hint || '' }); };
  const sh = typeof s.shade === 'number' ? s.shade : (s.shade ? 2 : 0);
  const cover = function (want) { if (want && sh < 2) tool('bd.tool.sunLess', 'sunLess', true, tx('bd.sunH')); if (!want && sh > 0) tool('bd.tool.sunMore', 'sunMore', true, tx('bd.sunH')); };
  const insul = function (want) { if (!!s.insul !== want) tool(want ? 'bd.tool.insulOn' : 'bd.tool.insulOff', 'insulate', true, tx('bd.insulH')); };
  const plant = function () { const can = s.nut >= 1 && (s.grass > 0.5 || s.flowers > 0.5 || s.trees > 0.5); if (can) tool('bd.tool.plant', 'plant', !s.planted, s.planted ? tx('bd.fixUsed') : tx('bd.tool.plantH')); else tool('bd.tool.plantNo', 'plant', false, ''); };
  const condense = function () { tool('bd.tool.condense', 'condense', !s.condensed, s.condensed ? tx('bd.fixUsed') : tx('bd.tool.condenseH')); };
  const compost = function () { if (s.decomp >= 0.3) tool('bd.tool.compost', 'compost', !s.composted, s.composted ? tx('bd.fixUsed') : tx('bd.tool.compostH')); else tool('bd.tool.compostNo', 'compost', false, ''); };
  const penR = function () { if (s.rabbits > 0.6) tool('bd.act.penR', 'penR', true); }, penH = function () { if (s.hawks > 0.3) tool('bd.act.penH', 'penH', true); };
  const relR = function () { if ((s.pen || 0) > 0.1) tool('bd.tool.releaseR', 'releaseR', true); }, relH = function () { if ((s.penH || 0) > 0.1) tool('bd.tool.releaseH', 'releaseH', true); };
  if (k === 'o2' && side === 'low') { plant(); store.push('grass', 'trees', 'pondweed', 'flowers'); cover(false); penR(); penH(); }
  if (k === 'o2' && side === 'high') { relR(); store.push('rabbits'); }
  if (k === 'co2' && side === 'low') { relR(); relH(); compost(); store.push('air', 'rabbits', 'pond'); }
  if (k === 'co2' && side === 'high') { plant(); store.push('grass', 'trees', 'pondweed'); cover(false); penR(); }
  if (k === 'water') { condense(); store.push('water'); if (s.ev === 'heat') cover(true); }
  if (k === 'temp' && side === 'high') { cover(true); insul(false); store.push('trees', 'hardy'); }
  if (k === 'temp' && side === 'low') { insul(true); cover(false); }
  if (k === 'nut' && side === 'low') { compost(); store.push('blocks', 'soil'); }
  if (k === 'nut' && side === 'high') { if (s.nut > 7) tool('bd.act.skim', 'skim', true); store.push('wetland'); }
  if (k === 'food') { plant(); store.push('grass', 'flowers', 'trees', 'pondweed', 'seedbank'); penR(); if (s.vine > 0.05) tool('bd.act.pull', 'pull', true); }
  if (k === 'web') { if (side === 'many' || side === 'nopred') { penR(); relH(); store.push('hawks'); } if (side === 'hungry') { penH(); relR(); store.push('rabbits'); } if (side === 'empty') { relR(); store.push('rabbits'); } }
  if (k === 'waste') { compost(); store.push('soil'); }
  return { side: side, tools: out, store: store.filter(function (id, i, a) { return a.indexOf(id) === i && ITEMS.some(function (it) { return it.id === id; }); }) };
}
function fixHTML() {
  const s = B.sim, k = B.fix, g = DS.gauges(s), o = fixOptions(k, s);
  let h = '<h3>🔧 ' + esc(tx('bd.g.' + k)) + ' <span class="st ' + g[k] + '">' + esc(tx('bd.' + g[k])) + '</span></h3>';
  if (g[k] === 'ok') h += '<p class="bdNote">' + esc(tx('bd.fixOk')) + '</p>';
  else h += '<p><b>' + esc(tx('bd.fixWhy')) + '</b> ' + esc(tx('bd.why.' + k + '.' + o.side)) + '</p>';
  h += '<p><b>' + esc(tx('bd.fixDo')) + '</b></p><div class="bdBtns bdFix">' + o.tools.map(function (t) { return '<button type="button" data-a="' + t.a + '" data-fix="1"' + (t.ok ? '' : ' disabled') + ' title="' + esc(t.h) + '">' + esc(t.t) + (t.h && t.ok ? '' : t.h ? ' <span class="ds">' + esc(t.h) + '</span>' : '') + '</button>'; }).join('') + '</div>';
  if (o.store.length) { const have = o.store.filter(function (id) { return (B.store[id] || 0) > 0; });
    h += '<p class="ds">' + esc(tx('bd.fixFromStore')) + (have.length ? '' : ' ' + esc(tx('bd.fixNoStore'))) + '</p>' + (have.length ? '<div class="bdBtns bdFix">' + have.map(function (id) { const it = ITEMS.find(function (q) { return q.id === id; }); return '<button type="button" data-a="place" data-id="' + id + '" data-fix="1">' + it.ic + ' ' + esc(tx('bd.it.' + id)) + ' (' + B.store[id] + ')</button>'; }).join('') + '</div>' : ''); }
  if (B.warn) h += '<p class="bdWarn">⚠️ ' + esc(B.warn) + '</p>';
  return h + '<div class="bdBtns"><button type="button" data-a="fixClose">' + esc(tx('bd.fixClose')) + '</button></div>';
}
function fixChips(s) {
  const g = DS.gauges(s), bad = Object.keys(g).filter(function (k) { return g[k] !== 'ok'; });
  if (!bad.length) return '<p class="ds">' + esc(tx('bd.fixNone')) + '</p>';
  return '<p class="ds">' + esc(tx('bd.fixHelp')) + '</p><div class="bdBtns bdFix"><span class="ds">' + esc(tx('bd.fixAll')) + '</span>' + bad.map(function (k) { return '<button type="button" data-a="fix" data-id="' + k + '" class="fx ' + g[k] + '">' + esc(tx('bd.g.' + k)) + ' ' + (g[k] === 'bad' ? '✖' : '⚠') + '</button>'; }).join('') + '</div>';
}
/* the animals speak up about how they are doing */
function voiceLine() {
  const s = B.sim, g = DS.gauges(s), opts = [];
  if (s.rabbits > 0.2) opts.push(['rabbits', s.rabbits > 5 && s.hawks < 0.3 ? 'many' : (s.grass < 1.5 ? 'hungry' : 'ok')]);
  if (s.hawks > 0.2) opts.push(['hawks', s.rabbits < 1 ? 'hungry' : 'ok']); if (s.bees > 0.2) opts.push(['bees', s.flowers < 2 || s.temp < 16 ? 'hungry' : 'ok']);
  if (s.decomp > 0.2) opts.push(['decomp', s.waste > 4 ? 'busy' : 'ok']); if (s.fish > 0.2) opts.push(['fish', s.nut > 9 || s.o2 < 25 ? 'bad' : 'ok']);
  if (s.grass > 0.2) opts.push(['grass', g.water !== 'ok' || g.temp !== 'ok' || s.grass < 1.5 ? 'bad' : 'ok']);
  if (!opts.length) return '…';
  const bad = opts.filter(function (o) { return o[1] !== 'ok'; }), o = (bad.length ? bad : opts)[(B.vi = (B.vi || 0) + 1) % (bad.length || opts.length)];
  return tx('bd.v.' + o[0]) + ': "' + tx('bd.vl.' + o[0] + '.' + o[1]) + '"';
}
function sfx(k) { if (!BQ.amb) return; if (k === 'pop') BQ.amb.sfx('step', 0.5); else if (k === 'whoosh') BQ.amb.sfx('whoosh', 0.6); else if (k === 'season') BQ.amb.sfx('chime', 0.5); }

/* ---------- the 3-D scene: a red desert planet, the glass dome, and the life inside it ---------- */
function build() {
  const g = new T.Group(), CR = BQ.creatures, scene = C.scene;
  B.bg = scene.background; B.fog = scene.fog; B.light = [C.HEMI.intensity, C.HEMI.color.clone(), C.HEMI.groundColor.clone(), C.KEYL.intensity, C.KEYL.color.clone(), C.KEYL.position.clone()];
  scene.background = new T.Color('#2a1a2e'); scene.fog = new T.FogExp2('#5a3040', 0.006);
  C.HEMI.color.set('#ffd8c0'); C.HEMI.groundColor.set('#4a2418'); C.HEMI.intensity = 0.85; C.KEYL.color.set('#fff0d8'); C.KEYL.intensity = 1.05; C.KEYL.position.set(60, 80, 40);
  /* sky: gradient dome, stars, two moons and a small bright sun */
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256; const x0 = cv.getContext('2d'), gr = x0.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#0a0a20'); gr.addColorStop(0.45, '#3a2048'); gr.addColorStop(0.55, '#c86a4a'); gr.addColorStop(1, '#5a2a20'); x0.fillStyle = gr; x0.fillRect(0, 0, 4, 256);
  g.add(new T.Mesh(new T.SphereGeometry(400, 24, 16), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv), side: T.BackSide, fog: false, depthWrite: false })));
  { const n = 700, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, u = 0.25 + Math.random() * 0.75, r = 380; pos[i * 3] = Math.cos(a) * Math.sqrt(1 - u * u) * r; pos[i * 3 + 1] = u * r; pos[i * 3 + 2] = Math.sin(a) * Math.sqrt(1 - u * u) * r; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pos, 3)); g.add(new T.Points(sg, new T.PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: false, fog: false }))); }
  [[-120, 140, -260, 26, '#d8c8e8'], [160, 90, -280, 12, '#e8b8a0']].forEach(function (m) { const mo = new T.Mesh(new T.SphereGeometry(m[3], 20, 14), new T.MeshBasicMaterial({ color: m[4], fog: false })); mo.position.set(m[0], m[1], m[2]); g.add(mo); });
  const sun = C.glow('#fff0c8', 60, 0.9, false); sun.position.set(220, 160, -200); g.add(sun);
  /* the red desert */
  const gg = new T.PlaneGeometry(500, 500, 80, 80); gg.rotateX(-Math.PI / 2); const P = gg.attributes.position, cols = new Float32Array(P.count * 3), cc = new T.Color();
  const hgt = function (x, z) { const d = Math.hypot(x, z); return d < 18 ? 0 : (Math.sin(x * 0.05) * Math.cos(z * 0.06) * 3 + Math.sin(x * 0.13 + z * 0.1) * 1.2) * Math.min(1, (d - 18) / 30) + Math.max(0, d - 120) * 0.25; };
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i), h = hgt(x, z);
    P.setY(i, h); cc.set(h > 4 ? '#b0583a' : '#c8704a').offsetHSL(0, 0, (Math.sin(x * 0.7) * Math.sin(z * 0.6)) * 0.04); cols[i * 3] = cc.r; cols[i * 3 + 1] = cc.g; cols[i * 3 + 2] = cc.b; }
  gg.setAttribute('color', new T.BufferAttribute(cols, 3)); gg.computeVertexNormals(); g.add(new T.Mesh(gg, new T.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
  for (let i = 0; i < 40; i++) { const a = Math.random() * 6.283, r = 20 + Math.random() * 120, rk = new T.Mesh(new T.DodecahedronGeometry(0.6 + Math.random() * 2.2, 0), C.emat(i % 2 ? '#8a4a32' : '#6a3a2a', '#140806')); rk.position.set(Math.cos(a) * r, hgt(Math.cos(a) * r, Math.sin(a) * r) + 0.2, Math.sin(a) * r); rk.rotation.set(Math.random(), Math.random(), 0); g.add(rk); }
  /* the dome: glass with a hexagon frame, a floor that turns green as life spreads, and a pond */
  const R0 = 13; B.R = R0;
  const floor = new T.Mesh(new T.CircleGeometry(R0, 64), new T.MeshLambertMaterial({ color: '#8a5a3a' })); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.05; g.add(floor); B.floor = floor;
  const pond = new T.Mesh(new T.CircleGeometry(3.4, 40), new T.MeshPhongMaterial({ color: '#3a8ac0', emissive: '#0a2030', shininess: 80, transparent: true, opacity: 0.88 })); pond.rotation.x = -Math.PI / 2; pond.position.set(-5, 0.12, 3); pond.visible = false; g.add(pond); B.pond = pond;
  const glass = new T.Mesh(new T.SphereGeometry(R0, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshPhongMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.14, shininess: 120, specular: '#ffffff', side: T.DoubleSide, depthWrite: false })); g.add(glass); B.glass = glass;
  const frame = new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(R0 * 1.002, 2)), new T.LineBasicMaterial({ color: '#d8e8f0', transparent: true, opacity: 0.55 }));
  g.add(frame); B.frame = frame;
  /* only keep the top half of the frame: hide edges below the floor */
  { const pa = frame.geometry.attributes.position; for (let i = 0; i < pa.count; i++) if (pa.getY(i) < 0) pa.setY(i, 0); pa.needsUpdate = true; }
  const ring = new T.Mesh(new T.TorusGeometry(R0, 0.25, 8, 64), C.emat('#9aa8b8', '#202830')); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; g.add(ring);
  const door = new T.Mesh(new T.BoxGeometry(2.4, 3.2, 1.2), C.emat('#8a98a8', '#1a2028')); door.position.set(0, 1.6, R0); g.add(door);
  /* the alien and its ship wait outside */
  const me = C.buildAlien(C.S.alien); me.position.set(2.5, 0, R0 + 4.5); me.rotation.y = Math.PI; me.scale.setScalar(0.9); g.add(me); B.me = me;
  { const sh = new T.Group(), body = new T.Mesh(C.G.sph, new T.MeshPhongMaterial({ color: '#c8d6e0', emissive: '#22303a', shininess: 90 })); body.scale.set(4.8, 1, 4.8); sh.add(body);
    const dome2 = new T.Mesh(C.G.sph, new T.MeshPhongMaterial({ color: '#8ff0ff', emissive: '#1a5a6a', transparent: true, opacity: 0.75 })); dome2.scale.set(2, 1.7, 2); dome2.position.y = 0.7; sh.add(dome2);
    sh.position.set(17, 1.2, R0 + 7); g.add(sh); B.ship = sh; }
  /* life inside (instanced so it stays fast); amounts follow the model */
  const inst = function (geo, mat, n) { const m = new T.InstancedMesh(geo, mat, n); m.count = 0; g.add(m); return m; };
  B.grassIM = inst(new T.ConeGeometry(0.12, 0.6, 4), new T.MeshLambertMaterial({ color: '#6ab04a' }), 420);
  B.flowerIM = inst(new T.IcosahedronGeometry(0.16, 0), new T.MeshLambertMaterial({ color: '#ffffff' }), 160); B.stemIM = inst(new T.CylinderGeometry(0.02, 0.02, 0.5, 4), new T.MeshLambertMaterial({ color: '#4a8a34' }), 160);
  B.weedIM = inst(new T.ConeGeometry(0.15, 0.9, 4), new T.MeshLambertMaterial({ color: '#2f8a5a' }), 60);
  B.vineIM = inst(new T.TorusGeometry(0.35, 0.08, 4, 8), new T.MeshLambertMaterial({ color: '#8a3aa0' }), 120);
  B.shroomIM = inst(new T.SphereGeometry(0.22, 8, 5, 0, 6.283, 0, 1.6), new T.MeshLambertMaterial({ color: '#d8a070' }), 60);
  B.wasteIM = inst(new T.DodecahedronGeometry(0.35, 0), new T.MeshLambertMaterial({ color: '#5a4030' }), 60);
  B.trees = []; for (let i = 0; i < 6; i++) { const t0 = new T.Group(), tr = new T.Mesh(new T.CylinderGeometry(0.22, 0.32, 2.2, 6), C.emat('#6a4a2a', '#140a04')); tr.position.y = 1.1; t0.add(tr);
    [[0, 2.8, 0, 1.4], [0.6, 2.4, 0.3, 1], [-0.5, 2.5, -0.3, 1.05]].forEach(function (c0) { const cr = new T.Mesh(new T.IcosahedronGeometry(c0[3], 1), C.emat(['#3a8a3a', '#4a9a3a', '#2f7a44'][i % 3], '#0a1a08')); cr.position.set(c0[0], c0[1], c0[2]); t0.add(cr); });
    const a = i * 1.05 + 0.4, r = 8.5 - (i % 2) * 1.5; t0.position.set(Math.cos(a) * r, 0, Math.sin(a) * r - 1); t0.scale.setScalar(0.001); g.add(t0); B.trees.push(t0); }
  B.rabbits = []; B.hawks = []; B.bees = []; B.fish = [];
  if (CR) { for (let i = 0; i < 8; i++) { const r = CR.makeRabbit(); r.g.visible = false; r.x = Math.cos(i) * 6; r.z = Math.sin(i) * 6; r.tx = r.x; r.tz = r.z; r.t = 0; g.add(r.g); B.rabbits.push(r); }
    for (let i = 0; i < 3; i++) { const h = CR.makeBird('hawk'); h.g.visible = false; h.a = i * 2; g.add(h.g); B.hawks.push(h); }
    for (let i = 0; i < 6; i++) { const b = CR.makeBee(); b.g.visible = false; b.g.scale.setScalar(1.4); b.ph = i * 1.3; g.add(b.g); B.bees.push(b); }
    for (let i = 0; i < 4; i++) { const f = CR.makeFish(i % 2 ? 'pumpkinseed' : 'bass'); f.g.visible = false; f.g.scale.setScalar(1.6); f.a = i * 1.6; g.add(f.g); B.fish.push(f); } }
  /* water cycle: droplets that condense on the glass and drip back down */
  { const n = 60, pos = new Float32Array(n * 3); B.drops = []; for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, el = 0.2 + Math.random() * 1.1; B.drops.push({ a: a, el: el, v: 0, y: 0 }); }
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(pos, 3)); B.dropPts = new T.Points(dg, new T.PointsMaterial({ color: '#cfefff', size: 0.18, transparent: true, opacity: 0.75 })); g.add(B.dropPts); }
  scene.add(g); B.g = g; B.view = { yaw: 0.6, pitch: 0.42, dist: 34, auto: true };
  B.look = { grass: 0, flowers: 0, trees: 0, pondweed: 0, rabbits: 0, hawks: 0, bees: 0, fish: 0, decomp: 0, waste: 0, vine: 0, water: 0 };
}
/* random but repeatable positions inside the dome */
function spot(i, salt, rMin, rMax) { const h = function (k) { const v = Math.sin(i * 127.1 + salt * 311.7 + k * 74.7) * 43758.5453; return v - Math.floor(v); }; const a = h(1) * 6.283, r = rMin + Math.sqrt(h(2)) * (rMax - rMin); let x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x + 5, z - 3) < 3.8) { x += 4.5; } return [x, z, h(3)]; }
function visuals(dt) {
  const s = B.sim, L = B.look, o = new T.Object3D(), k = Math.min(1, dt * 2.5);
  ['grass', 'flowers', 'trees', 'pondweed', 'rabbits', 'hawks', 'bees', 'fish', 'decomp', 'waste', 'vine', 'water'].forEach(function (q) { L[q] += ((s[q] || 0) - L[q]) * k; });
  const life = Math.min(1, (L.grass + L.flowers + L.trees) / 14); B.floor.material.color.set('#8a5a3a').lerp(new T.Color('#5a9a3a'), life);
  B.pond.visible = L.water > 1.5; if (B.pond.visible) { B.pond.scale.setScalar(Math.min(1.15, 0.6 + L.water / 18)); B.pond.material.color.set(s.nut > 11 || (s.notes || []).indexOf('algae') >= 0 ? '#5a9a3a' : '#3a8ac0'); }
  const ng = Math.min(420, Math.round(L.grass * 34)); B.grassIM.count = ng; for (let i = 0; i < ng; i++) { const p = spot(i, 1, 2, B.R - 1.2); o.position.set(p[0], 0.3, p[1]); o.rotation.set(Math.sin(B.t * 1.5 + i) * 0.08, p[2] * 6, 0); o.scale.set(1, 0.7 + p[2] * 0.8, 1); o.updateMatrix(); B.grassIM.setMatrixAt(i, o.matrix); } B.grassIM.instanceMatrix.needsUpdate = true;
  const nf = Math.min(160, Math.round(L.flowers * 13)), fc = new T.Color(); B.flowerIM.count = nf; B.stemIM.count = nf;
  for (let i = 0; i < nf; i++) { const p = spot(i, 2, 1.5, B.R - 1.5); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.position.set(p[0], 0.55, p[1]); o.updateMatrix(); B.flowerIM.setMatrixAt(i, o.matrix); B.flowerIM.setColorAt(i, fc.set(['#ffd166', '#ff8fb1', '#c59cff', '#ffffff', '#ff9f6e'][i % 5]));
    o.position.set(p[0], 0.27, p[1]); o.updateMatrix(); B.stemIM.setMatrixAt(i, o.matrix); }
  B.flowerIM.instanceMatrix.needsUpdate = true; B.stemIM.instanceMatrix.needsUpdate = true; if (B.flowerIM.instanceColor) B.flowerIM.instanceColor.needsUpdate = true;
  const nt = L.trees / 1.4; B.trees.forEach(function (t0, i) { const sc = Math.max(0.001, Math.min(1, nt - i)); t0.scale.setScalar(sc * (0.8 + (i % 3) * 0.12)); });
  const nw = Math.min(60, Math.round(L.pondweed * 6)); B.weedIM.count = B.pond.visible ? nw : 0; for (let i = 0; i < B.weedIM.count; i++) { const a = i * 2.4, r = 0.6 + (i * 0.37 % 1) * 2.6; o.position.set(-5 + Math.cos(a) * r, 0.3, 3 + Math.sin(a) * r); o.rotation.set(Math.sin(B.t + i) * 0.15, 0, 0); o.scale.setScalar(1); o.updateMatrix(); B.weedIM.setMatrixAt(i, o.matrix); } B.weedIM.instanceMatrix.needsUpdate = true;
  const nv = Math.min(120, Math.round(L.vine * 14)); B.vineIM.count = nv; for (let i = 0; i < nv; i++) { const p = spot(i, 5, 3, B.R - 1); o.position.set(p[0], 0.2 + (i % 3) * 0.15, p[1]); o.rotation.set(p[2] * 3, p[2] * 5, 0); o.scale.setScalar(1); o.updateMatrix(); B.vineIM.setMatrixAt(i, o.matrix); } B.vineIM.instanceMatrix.needsUpdate = true;
  const nd = Math.min(60, Math.round(L.decomp * 8)); B.shroomIM.count = nd; for (let i = 0; i < nd; i++) { const p = spot(i, 7, 4, B.R - 1.5); o.position.set(p[0], 0.12, p[1]); o.rotation.set(0, 0, 0); o.scale.setScalar(0.8 + p[2] * 0.5); o.updateMatrix(); B.shroomIM.setMatrixAt(i, o.matrix); } B.shroomIM.instanceMatrix.needsUpdate = true;
  const nx = Math.min(60, Math.round(L.waste * 4)); B.wasteIM.count = nx; for (let i = 0; i < nx; i++) { const p = spot(i, 9, 2, B.R - 1.5); o.position.set(p[0], 0.15, p[1]); o.rotation.set(p[2], p[2] * 4, 0); o.scale.set(1, 0.4, 1); o.updateMatrix(); B.wasteIM.setMatrixAt(i, o.matrix); } B.wasteIM.instanceMatrix.needsUpdate = true;
  /* animals */
  const CR = BQ.creatures; if (!CR) return;
  const nr = Math.min(8, Math.round(L.rabbits * 1.1)); B.rabbits.forEach(function (r, i) { r.g.visible = i < nr; if (!r.g.visible) return; r.t -= dt; if (r.t <= 0) { const p = spot(Math.floor(B.t * 7) + i * 13, 3, 2, B.R - 2); r.tx = p[0]; r.tz = p[1]; r.t = 1.5 + p[2] * 3; }
    const dx = r.tx - r.x, dz = r.tz - r.z, dl = Math.hypot(dx, dz), mv = dl > 0.2; if (mv) { r.x += dx / dl * dt * 1.6; r.z += dz / dl * dt * 1.6; r.g.rotation.y = Math.atan2(dx, dz); r.hp = (r.hp || 0) + dt * 2.6; } const hop = mv ? r.hp % 1 : 0;
    r.g.position.set(r.x, Math.sin(hop * Math.PI) * 0.25, r.z); CR.poseRabbit(r, dt, hop, false); });
  const nh = Math.min(3, Math.round(L.hawks * 1.4)); B.hawks.forEach(function (h, i) { h.g.visible = i < nh; if (!h.g.visible) return; h.a += dt * 0.35; const r = 7 + i * 1.5; h.g.position.set(Math.cos(h.a) * r, 7 + i * 0.8 + Math.sin(B.t + i) * 0.3, Math.sin(h.a) * r); h.g.rotation.set(0, Math.atan2(-Math.sin(h.a), Math.cos(h.a)), -0.35); CR.poseBird(h, dt, Math.sin(B.t * 0.5 + i) > 0.6 ? 'flap' : 'glide', 0.7, 0); });
  const nb = Math.min(6, Math.round(L.bees * 1.3)); B.bees.forEach(function (b, i) { b.g.visible = i < nb && nf > 0; if (!b.g.visible) return; const p = spot(Math.floor(B.t * 0.5 + i * 3), 2, 1.5, B.R - 1.5), q = spot(Math.floor(B.t * 0.5 + i * 3) + 1, 2, 1.5, B.R - 1.5), u = (B.t * 0.5 + i * 3) % 1;
    b.g.position.set(p[0] + (q[0] - p[0]) * u, 0.9 + Math.sin(B.t * 5 + i) * 0.15, p[1] + (q[1] - p[1]) * u); b.g.rotation.y = Math.atan2(q[0] - p[0], q[1] - p[1]); CR.poseBee(b, dt, false); });
  const nfi = Math.min(4, Math.round(L.fish * 0.8)); B.fish.forEach(function (f, i) { f.g.visible = i < nfi && B.pond.visible; if (!f.g.visible) return; f.a += dt * 0.6; const r = 1 + (i % 2) * 1.2; f.g.position.set(-5 + Math.cos(f.a) * r, 0.08, 3 + Math.sin(f.a) * r); f.g.rotation.y = Math.atan2(-Math.sin(f.a), Math.cos(f.a)); CR.poseFish(f, dt, 0.4); });
  /* water cycle droplets */
  const dp = B.dropPts.geometry.attributes.position, wet = L.water > 1 ? 1 : 0; B.dropPts.visible = !!wet;
  B.drops.forEach(function (d0, i) { if (d0.y <= 0.1) { d0.a = Math.random() * 6.283; d0.el = 0.25 + Math.random() * 1.0; d0.y = 0; d0.v = 0; d0.hang = 1 + Math.random() * 4; }
    const r = B.R * 0.97; let x = Math.cos(d0.a) * Math.cos(d0.el) * r, y = Math.sin(d0.el) * r, z = Math.sin(d0.a) * Math.cos(d0.el) * r;
    if (d0.hang > 0) { d0.hang -= dt; d0.y = y; } else { d0.v += dt * 9; d0.y -= d0.v * dt; x *= 0.92; z *= 0.92; y = d0.y; }
    dp.setXYZ(i, x, Math.max(0.05, y), z); }); dp.needsUpdate = true;
}
/* ---------- the trip home: lift off from Earth, cross the stars, land by the dome ---------- */
function buildFlight() {
  const f = new T.Group(); B.flyG = f; f.visible = false;
  const n = 1400, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 400; pos[i * 3 + 1] = (Math.random() - 0.5) * 300; pos[i * 3 + 2] = -Math.random() * 1400 + 100; }
  const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pos, 3)); B.flyStars = new T.Points(sg, new T.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false, fog: false })); f.add(B.flyStars);
  const real = window.FG_EARTH, tex = real ? new T.TextureLoader().load(real.day) : null;
  const earth = new T.Mesh(new T.SphereGeometry(110, 64, 40), new T.MeshPhongMaterial(tex ? { map: tex, shininess: 30, specular: '#141c26' } : { color: '#3a7ac8' })); earth.position.set(10, -150, -40); earth.rotation.z = 0.41; f.add(earth); B.flyEarth = earth; B.flyTex = tex;
  const home = new T.Mesh(new T.SphereGeometry(70, 40, 28), new T.MeshLambertMaterial({ color: '#c8704a', emissive: '#3a1408' })); home.position.set(30, -20, -1150); f.add(home); B.flyHome = home;
  const ship = B.ship.clone(true); ship.scale.setScalar(0.45); f.add(ship); B.flyShip = ship;
  const trail = C.glow('#9fe8ff', 6, 0.7, false); ship.add(trail); trail.position.set(0, 0, 3);
  C.scene.add(f);
}
function startFlight() {
  if (!B.flyG) buildFlight(); B.phase = 'fly'; B.flyT = 0; B.flyG.visible = true; B.g.visible = false; B.prevBg = C.scene.background; B.prevFog = C.scene.fog;
  C.scene.background = new T.Color('#03040c'); C.scene.fog = null; sfx('whoosh'); render();
}
function endFlight() {
  B.flyG.visible = false; B.g.visible = true; C.scene.background = B.prevBg; C.scene.fog = B.prevFog; B.phase = 'build'; B.landT = 2.2; B.view.yaw = 0.15; B.view.pitch = 0.3; B.view.dist = 46; render();
}
function flightStep(dt) {
  B.flyT += dt; const t = B.flyT, cam = C.cam, sh = B.flyShip, E = B.flyEarth, cap = $('bdFlyCap');
  const seg = function (a, b) { const u = Math.max(0, Math.min(1, (t - a) / (b - a))); return u * u * (3 - 2 * u); };
  E.rotation.y = t * 0.05; sh.rotation.y += dt * 2;
  /* 0-2.2 s: lift off; 2.2-5.4 s: cruise toward the red planet; then land */
  const z = -1000 * seg(2.2, 5.4), y = -8 + 22 * seg(0, 2.2) - 10 * seg(4.6, 5.4);
  sh.position.set(Math.sin(t * 1.3) * 1.2, y, z); cam.position.set(sh.position.x * 0.5 + 6 - 4 * seg(2, 3), y + 4 + 8 * (1 - seg(1.0, 2.4)) - 2 * seg(2, 3), z + 16 + 6 * seg(2.2, 3.2)); cam.lookAt(sh.position.x, sh.position.y + 1 - 6 * seg(4.4, 5.4) - 14 * (1 - seg(1.0, 2.4)), sh.position.z - 20 * seg(2.2, 3)); /* first look down at Earth falling away below */
  B.flyStars.material.size = 1.6 + 4 * Math.sin(Math.PI * seg(2.2, 5.4));
  if (cap) { const k = t < 2.2 ? 'bd.fly1' : t < 4.6 ? 'bd.fly2' : 'bd.fly3'; if (cap.dataset.k !== k) { cap.dataset.k = k; cap.textContent = tx(k); } }
  if (t >= 5.6) endFlight();
}
/* ---------- run ---------- */
function start() {
  ensureUI(); C.teardown(); C.show(null); C.setMode('dome'); C.Music.stop();
  ['hud', 'touch', 'toast', 'qpanel', 'cozyUI'].forEach(function (id) { const e = $(id); if (e) e.hidden = true; });
  B = { phase: 'pack', cargo: {}, store: {}, placed: {}, sim: DS.fresh(), hist: [], rewinds: 0, t: 0, warn: null };
  build(); $('domeUI').hidden = false; render(); if (BQ.amb) { BQ.amb.mood('space', 2); }
  if (!sv().seen) story(); else $('bdStory').hidden = true;
}
function exit() {
  if (!B) return; const scene = C.scene, l = B.light;
  scene.remove(B.g); C.disposeGroup(B.g); if (B.flyG) { scene.remove(B.flyG); C.disposeGroup(B.flyG); if (B.flyTex) B.flyTex.dispose(); } scene.background = B.bg; scene.fog = B.fog; C.HEMI.intensity = l[0]; C.HEMI.color.copy(l[1]); C.HEMI.groundColor.copy(l[2]); C.KEYL.intensity = l[3]; C.KEYL.color.copy(l[4]); C.KEYL.position.copy(l[5]);
  C.cam.fov = 42; C.cam.updateProjectionMatrix(); B = null; $('domeUI').hidden = true; if (BQ.amb) BQ.amb.stop(1); C.save(); C.setMode('menu'); C.menuScene();
}
function step(dt) {
  if (!B) return; B.t += dt; const cam = C.cam, v = B.view;
  if (B.phase === 'fly') { flightStep(dt); return; }
  if (v.auto) v.yaw += dt * 0.05;
  if (B.timeT > 0) { B.timeT -= dt; v.yaw += dt * 0.9; } /* time passing: the view sweeps around */
  const tgt = new T.Vector3(0, 2, 0), cp = Math.cos(v.pitch); cam.position.set(Math.sin(v.yaw) * cp * v.dist, Math.sin(v.pitch) * v.dist + 1, Math.cos(v.yaw) * cp * v.dist); cam.lookAt(tgt);
  if (Math.abs(cam.fov - 42) > 0.01) { cam.fov = 42; cam.updateProjectionMatrix(); }
  if (B.landT > 0) { B.landT -= dt; const u = Math.max(0, B.landT / 2.2); B.ship.position.y = 1.2 + 26 * u * u; B.ship.rotation.y += dt * 3 * u; } else if (B.ship) B.ship.position.y = 1.2;
  if (B.me) { B.me.rotation.y = Math.PI + Math.sin(B.t * 0.5) * 0.3; const legs = B.me.userData.legs; if (legs) legs.forEach(function (h) { h.rotation.x = 0; }); }
  visuals(dt);
}
function key(e, down) {
  if (!B || !down) return; const kk = e.key;
  if (e.target && e.target.tagName === 'BUTTON' && (kk === 'Enter' || kk === ' ')) return;
  if (kk === 'Escape') { e.preventDefault(); exit(); return; }
  const v = B.view; v.auto = false;
  if (kk === 'ArrowLeft' || kk === 'a') v.yaw -= 0.12; else if (kk === 'ArrowRight' || kk === 'd') v.yaw += 0.12;
  else if (kk === 'ArrowUp' || kk === 'w') v.pitch = Math.min(1.3, v.pitch + 0.06); else if (kk === 'ArrowDown' || kk === 's') v.pitch = Math.max(0.08, v.pitch - 0.06);
  else if (kk === '+' || kk === '=') v.dist = Math.max(14, v.dist / 1.12); else if (kk === '-' || kk === '_') v.dist = Math.min(70, v.dist * 1.12);
}
function pointer(e, type) {
  if (!B) return; const v = B.view;
  if (type === 'wheel') { v.dist = Math.max(14, Math.min(70, v.dist * (e.deltaY > 0 ? 1.1 : 1 / 1.1))); e.preventDefault(); return; }
  if (type === 'pointerdown') { v.drag = { x: e.clientX, y: e.clientY, yaw: v.yaw, pitch: v.pitch }; v.auto = false; document.body.classList.add('bdDrag'); }
  else if (type === 'pointermove' && v.drag && e.buttons) { v.yaw = v.drag.yaw - (e.clientX - v.drag.x) * 0.006; v.pitch = Math.max(0.08, Math.min(1.3, v.drag.pitch + (e.clientY - v.drag.y) * 0.005)); }
  else if (type === 'pointerup') { v.drag = null; document.body.classList.remove('bdDrag'); }
}
/* the menu button: always open (supplies not earned yet say where to get them) */
(function () { const modes = document.querySelector('#menu .modes'); if (!modes || $('btnDome')) return; const b = document.createElement('button'); b.type = 'button'; b.id = 'btnDome'; b.className = 'primary'; b.textContent = tx('bd.menu'); b.onclick = function () { start(); }; modes.appendChild(b);
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-ml]')) setTimeout(function () { b.textContent = tx('bd.menu'); }, 0); }); })();
BQ.dome = { start: start, step: step, key: key, pointer: pointer, exit: exit, _b: function () { return B; }, ITEMS: ITEMS };
}
if (window.FieldGuide && window.FieldGuide.core) init(); else (window.FieldGuide.onCoreList = window.FieldGuide.onCoreList || []).push(init);
})();

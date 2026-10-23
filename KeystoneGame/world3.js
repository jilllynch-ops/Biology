/* WORLD 3 GAME FILE: Ecosystems: Interdependence and Disruptions (five levels).
   Same building steps as World 1 (see world1.js for the full list). Content lives in world3-questions.js.
   Each level teaches first (scan specimens), then lets players use what they learned (hunts, catches,
   doors, data, mazes, balances), with only a few question stations. Mixed review gates pull in earlier topics. */
FieldGuide.registerWorld({
  id: 3,
  title: 'Ecosystems',
  levels: [
    { id: '3-1', title: 'Levels of Life', theme: 'forest',
      log: 'Mission log: New world! Landed in a Pennsylvania forest. Nothing here lives alone. Zoom out from one deer to the whole planet.',
      outro: 'Report sent: ecology is studied in levels (organism, population, community, ecosystem, biome, biosphere). Ecosystems have biotic (living) and abiotic (nonliving) factors, and each species has a habitat and a niche.',
      build: function (b) {
        b.hint(5, 4.6, 'World 3: Ecosystems. Scan everything you see!').sparks(9, 1.2, 4).ground(16).review()
          .scan(4, 's3-organism').scan(9, 's3-population').scan(14, 's3-community').ground(18).hsparks(-11, 6.2, 4)
          .gap(3.2).virus(5, 2.5, 1).qblock(10, 3.4, 'sparks').ground(14)
          .scan(3, 's3-ecosystem').scan(8, 's3-biome').scan(13, 's3-biosphere').ground(16)
          .catchGame('c-levels')
          .qblock(3, 3.4, 'boost').ground(8)
          .scan(3, 's3-biotic').scan(8, 's3-abiotic').ground(11)
          .hunt('biotic-factors')
          .snapper(5, 3.6, 0).spikes(10, 1.8).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .refuel().scan(3, 's3-habitat').scan(8, 's3-niche').ground(11)
          .wordbank('wb-habitat')
          .bridge(11).hazard(4, 1.2, { ax: 1.6, sp: 1.3 }).ground(10)
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.B.4.2.1', 'BIO.B.4.2.3', 'BIO.B.4.1.1', 'BIO.B.4.1.2'])
          .sequence('s-levels')
          .virus(5, 2.4, 1.2).sparks(2, 3.2, 4).ground(12)
          .station(['w3q01', 'w3q06'])
          .goal();
      } },
    { id: '3-2', title: 'Living Together', theme: 'meadow',
      log: 'Mission log: A sunny meadow full of hunters, helpers, and hitchhikers. Figure out who eats whom, and who helps whom.',
      outro: 'Report sent: species interact through predation, competition, and symbiosis: mutualism (both benefit), commensalism (one benefits, one is unaffected), and parasitism (one benefits, the host is harmed).',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(9, 2, 1).ground(12).review()
          .scan(3, 's3-predator').scan(8, 's3-prey').scan(13, 's3-compete').ground(16).hsparks(-10, 6.2, 4)
          .scan(3, 's3-mutual').scan(8, 's3-commensal').scan(13, 's3-parasite').ground(16)
          .catchGame('c-symbiosis')
          .squeeze(3, 4).snapper(11, 3.4, 0.6).ground(15)
          .become('b-mutual')
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'interaction', n: 4 }])
          .bridge(11).virus(4, 2.5, 1.2).spikes(9, 1.8).qblock(13, 3.4, 'shield').ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .wordbank('wb-relations')
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.B.4.1.1', 'BIO.B.4.1.2', 'BIO.B.4.2.1', 'BIO.B.4.2.2'])
          .station(['w3q11', 'w3q15'])
          .goal();
      } },
    { id: '3-3', title: 'Limits to Growth', theme: 'pond',
      log: 'Mission log: The deer here keep multiplying. Can a population grow forever? Find out what holds it back.',
      outro: 'Report sent: limiting factors (food, water, space, predators, disease, weather) keep populations near the carrying capacity. Unlimited growth is exponential; limited growth levels off (logistic).',
      build: function (b) {
        b.hint(5, 4.6, 'How many can live here? Scan to find out.').sparks(9, 1.2, 4).ground(14).review()
          .scan(3, 's3-limit').scan(8, 's3-capacity').scan(13, 's3-expo').ground(16).hsparks(-11, 6.2, 4)
          .hunt('limiting')
          .scan(3, 's3-logistic').scan(8, 's3-dd').scan(13, 's3-di').ground(16)
          .readData('d-deer')
          .become('b-capacity')
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .wordbank('wb-growth')
          .snapper(5, 3.6, 0).virus(10, 2.4, 1.2).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.B.4.2.1', 'BIO.B.4.2.2', 'BIO.B.4.2.5', 'BIO.B.4.1.2'])
          .balance('bal-deer')
          .bridge(12, { ay: 1.4, sp: 1.1 }).ground(5)
          .goal();
      } },
    { id: '3-4', title: 'After the Fire', theme: 'forest',
      log: 'Mission log: A wildfire swept through here last year, and a volcano island rose nearby. Watch how life comes back.',
      outro: 'Report sent: after a disturbance, communities change in a predictable order (succession). Primary succession starts on bare rock with pioneer species; secondary succession starts where soil remains.',
      build: function (b) {
        b.sparks(4, 1.2, 4).hazard(9, 1.1, { ax: 1.8, sp: 1.2 }).ground(13).review()
          .scan(3, 's3-fire').scan(8, 's3-primary').scan(13, 's3-pioneer').ground(16).hsparks(-10, 6.2, 4)
          .become('b-pioneer')
          .maze('maze-succession')
          .sparks(0.5, 8.5, 4).ground(6)
          .scan(3, 's3-secondary').scan(8, 's3-climax').scan(13, 's3-keystone').ground(16)
          .sequence('s-secondary')
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'succession', n: 4 }])
          .squeeze(3, 4).antibody(15, 8, 3.2, 0.5).ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.B.4.2.2', 'BIO.B.4.2.4', 'BIO.B.4.2.5', 'BIO.B.4.1.1'])
          .station(['w3q16', 'w3q17'])
          .bridge(11).ground(5)
          .goal();
      } },
    { id: '3-5', title: 'Human Footprints', theme: 'shore',
      log: 'Mission log: The coast is busy with humans. Some of their actions harm ecosystems, and some help them heal. Find out which.',
      outro: 'Report sent: habitat loss, pollution, invasive species, overharvesting, and climate change disrupt ecosystems. Biodiversity makes ecosystems more stable, and conservation helps them recover.',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(8, 2, 1).ground(12).review()
          .scan(3, 's3-biodiv').scan(8, 's3-services').scan(13, 's3-invasive').ground(16).hsparks(-12, 6.2, 4)
          .hunt('invasive-traits')
          .scan(3, 's3-habloss').scan(8, 's3-pollution').scan(13, 's3-bloom').ground(16)
          .sequence('s-bloom')
          .readData('d-oxygen')
          .snapper(5, 3.6, 0).virus(10, 2.4, 1.2).ground(15)
          .refuel().scan(3, 's3-climate').scan(8, 's3-overharvest').scan(13, 's3-conserve').ground(16)
          .catchGame('c-impact')
          .become('b-solution')
          .lablock('lock-3-5')
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(5, 'boom').mixed(2, ['BIO.B.4.2.2', 'BIO.B.4.2.3', 'BIO.B.4.2.4', 'BIO.B.4.2.5'])
          .qblock(3, 3.4, 'shield').hazard(8, 1.2, { ax: 2, sp: 1.3 }).ground(14)
          .hint(-3, 4.6, 'Boss ahead: The Algal Bloom')
          .balance('bal-bloom')
          .goal();
      } }
  ]
});

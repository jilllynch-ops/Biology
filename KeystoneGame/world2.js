/* WORLD 2 GAME FILE: Matter and Energy in Organisms and Ecosystems (five levels).
   Same building steps as World 1 (see world1.js for the full list). Content lives in world2-questions.js.
   Each level teaches first (scan specimens), then lets players use what they learned (hunts, builds,
   doors, data, mazes), with only a few question stations. Mixed review gates pull in World 1 topics too. */
FieldGuide.registerWorld({
  id: 2,
  title: 'Matter and Energy',
  levels: [
    { id: '2-1', title: 'Water and Carbon', theme: 'shore',
      log: 'Mission log: New world! Landed on a rocky shore. Everything alive here is built from the same stuff: water and carbon. Find out why.',
      outro: 'Report sent: water\'s special properties (polar, cohesion, adhesion, high specific heat, floating ice, great solvent) support life, and carbon\'s four bonds build the molecules of life.',
      build: function (b) {
        b.hint(5, 4.6, 'World 2: Matter and Energy. Scan everything you see!').sparks(9, 1.2, 4).ground(16).review()
          .scan(4, 's2-drop').scan(9, 's2-strider').scan(14, 's2-tube').ground(18).hsparks(-11, 6.2, 4)
          .gap(3.2).virus(5, 2.5, 1).qblock(10, 3.4, 'sparks').ground(14)
          .scan(3, 's2-lake').scan(8, 's2-ice').scan(13, 's2-salt').ground(16)
          .hunt('water-props')
          .qblock(3, 3.4, 'boost').ground(8)
          .wordbank('wb-water')
          .snapper(5, 3.6, 0).spikes(10, 1.8).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .scan(3, 's2-carbon').scan(8, 's2-chain').ground(11)
          .station(['w2q06', 'w2q07'])
          .bridge(11).hazard(4, 1.2, { ax: 1.6, sp: 1.3 }).ground(10)
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1', 'BIO.A.4.1.2', 'BIO.A.2.1.1'])
          .virus(5, 2.4, 1.2).sparks(2, 3.2, 4).ground(12)
          .station(['w2q01', 'w2q03'])
          .goal();
      } },
    { id: '2-2', title: 'Building Blocks', theme: 'lab',
      log: 'Mission log: Shrunk down to molecule size. Big molecules of life are built from small pieces. Learn the pieces, then build with them.',
      outro: 'Report sent: monomers join into polymers by dehydration synthesis. Carbohydrates, lipids, proteins, and nucleic acids each have their own jobs.',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(9, 2, 1).ground(12).review()
          .scan(3, 's2-monomer').scan(8, 's2-polymer').scan(13, 's2-dehyd').ground(16).hsparks(-10, 6.2, 4)
          .hunt('monomers')
          .sequence('s-dehydration')
          .squeeze(3, 4).snapper(11, 3.4, 0.6).ground(15)
          .scan(3, 's2-carb').scan(8, 's2-lipid').scan(13, 's2-protein').scan(18, 's2-nucleic').ground(21)
          .catchGame('c-polymer')
          .sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'macro', n: 4 }])
          .bridge(11).virus(4, 2.5, 1.2).spikes(9, 1.8).qblock(13, 3.4, 'shield').ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.A.2.2.1', 'BIO.A.2.2.2'])
          .station(['w2q16', 'w2q19'])
          .goal();
      } },
    { id: '2-3', title: 'Enzyme Workshop', theme: 'gut',
      log: 'Mission log: Inside a digestive system. Tiny protein machines called enzymes are breaking food apart. Find out how they work, and what stops them.',
      outro: 'Report sent: enzymes are protein catalysts. Each active site fits one substrate, and heat or the wrong pH can denature an enzyme.',
      build: function (b) {
        b.hint(5, 4.6, 'Find the 3 green clue terminals. They open a portal!').sparks(9, 1.2, 4).ground(14).review()
          .scan(3, 's2-enzyme').scan(8, 's2-site').scan(13, 's2-substrate').ground(16).hsparks(-11, 6.2, 4)
          .become('b-starch')
          .scan(3, 's2-energy').ground(6)
          .wordbank('wb-enzyme')
          .clue(4, 'w2q21').virus(9, 2.4, 1).ground(13)
          .scan(3, 's2-heat').scan(8, 's2-ph').ground(11)
          .readData('d-enzyme-temp')
          .become('b-pepsin')
          .clue(3, 'w2q26').snapper(9, 3.4, 0.4).ground(13)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .balance('bal-enzyme')
          .clue(3, 'w2q22').ground(6).hint(1, 6.6, 'Portal! Its code is the letters of your 3 clue answers.').portal(6, 'golf').ground(11)
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.A.4.2.1', 'BIO.A.2.2.3', 'BIO.A.2.3.1', 'BIO.A.2.3.2'])
          .bridge(12, { ay: 1.4, sp: 1.1 }).ground(5)
          .goal();
      } },
    { id: '2-4', title: 'Energy in Cells', theme: 'leaf',
      log: 'Mission log: Inside a sunlit leaf. Plants turn light into food, and every cell turns food into usable energy. Follow the energy.',
      outro: 'Report sent: chloroplasts store light energy in glucose (photosynthesis); mitochondria release it as ATP (cellular respiration). Each process uses what the other makes.',
      build: function (b) {
        b.sparks(4, 1.2, 4).hazard(9, 1.1, { ax: 1.8, sp: 1.2 }).ground(13).review()
          .scan(3, 's2-chloro').scan(8, 's2-photo').scan(13, 's2-stoma').ground(16).hsparks(-10, 6.2, 4)
          .catchGame('c-photo')
          .sparks(0.5, 8.5, 4).ground(6)
          .become('b-co2')
          .scan(3, 's2-mito').scan(8, 's2-atp').scan(13, 's2-plant').ground(16)
          .hunt('atp-facts')
          .qblock(3, 3.4, 'boost').ground(7)
          .catchGame('c-resp')
          .sparks(0.5, 8.5, 4).ground(6)
          .become('b-glucose2')
          .squeeze(3, 4).antibody(15, 8, 3.2, 0.5).ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .station([{ sort: 'photo-resp', n: 4 }])
          .sequence('s-energy-path')
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.A.1.2.1', 'BIO.A.4.1.2', 'BIO.A.3.1.1', 'BIO.A.3.2.1', 'BIO.A.3.2.2'])
          .bridge(11).ground(5)
          .goal();
      } },
    { id: '2-5', title: 'Food Webs and Cycles', theme: 'meadow',
      log: 'Mission log: Out in a wild meadow. Energy flows from the Sun through every living thing, and matter goes round and round. Track both.',
      outro: 'Report sent: energy flows one way, from the Sun through producers and consumers, with about 10% passed up each level. Matter like carbon and nitrogen cycles.',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(8, 2, 1).ground(12).review()
          .scan(3, 's2-grass').scan(8, 's2-rabbit').scan(13, 's2-fox').scan(18, 's2-mushroom').ground(21).hsparks(-12, 6.2, 4)
          .hunt('producers')
          .maze('maze-trophic')
          .sparks(0.5, 8.5, 5).ground(7)
          .scan(3, 's2-pyramid').ground(6)
          .readData('d-pyramid')
          .sequence('s-food-chain')
          .snapper(5, 3.6, 0).virus(10, 2.4, 1.2).ground(15)
          .scan(3, 's2-sun').scan(8, 's2-cycle').scan(13, 's2-clover').ground(16)
          .catchGame('c-carbon')
          .sparks(0.5, 8.5, 4).ground(6)
          .wordbank('wb-cycles')
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(5, 'boom').mixed(2, ['BIO.A.3.2.1', 'BIO.A.2.3.2', 'BIO.A.4.2.1', 'BIO.B.4.2.1', 'BIO.B.4.2.3'])
          .qblock(3, 3.4, 'shield').hazard(8, 1.2, { ax: 2, sp: 1.3 }).ground(14)
          .hint(-3, 4.6, 'Boss ahead: The Carbon Imbalance')
          .balance('bal-carbon')
          .goal();
      } }
  ]
});

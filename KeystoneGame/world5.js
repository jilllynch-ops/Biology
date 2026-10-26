/* WORLD 5 GAME FILE: Environmental Pressure Drives Evolution (five levels).
   Same building steps as World 1 (see world1.js for the full list). Content lives in world5-questions.js.
   The world is a changing island chain and a canyon full of fossils. The last level ends with a boss
   that mixes evolution questions with look-alike pairs from the whole world. */
FieldGuide.registerWorld({
  id: 5,
  title: 'Evolution',
  levels: [
    { id: '5-1', title: 'Survival of the Fittest', theme: 'island',
      log: 'Mission log: New world! An island chain where a drought just hit. The finches here are not all the same. Find out who survives, and why it matters for their offspring.',
      outro: 'Report sent: individuals vary, more are born than can survive, and those with helpful inherited traits survive and reproduce more. Over generations, natural selection makes helpful alleles more common.',
      build: function (b) {
        b.hint(5, 4.6, 'World 5: Evolution. Scan everything you see!').sparks(9, 1.2, 4).ground(16).review()
          .scan(4, 's5-variation').scan(9, 's5-adaptation').scan(14, 's5-fitness').ground(18).hsparks(-11, 6.2, 4)
          .gap(3.2).virus(5, 2.5, 1).qblock(10, 3.4, 'sparks').ground(14)
          .scan(3, 's5-pressure').scan(8, 's5-selection').scan(13, 's5-camouflage').ground(16)
          .hunt('selection-needs')
          .qblock(3, 3.4, 'boost').ground(8)
          .sequence('s-selection')
          .snapper(5, 3.6, 0).spikes(10, 1.8).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .refuel().scan(3, 's5-darwin').ground(6)
          .readData('d-finch')
          .become('b-moth')
          .wordbank('wb-selection')
          .bridge(11).hazard(4, 1.2, { ax: 1.6, sp: 1.3 }).ground(10)
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.B.2.1.1', 'BIO.B.2.3.1', 'BIO.B.4.2.5', 'BIO.B.3.1.1'])
          .virus(5, 2.4, 1.2).sparks(2, 3.2, 4).ground(12)
          .station(['w5q01', 'w5q04'])
          .goal();
      } },
    { id: '5-2', title: 'Chance and Change', theme: 'island',
      log: 'Mission log: A storm just blew a few birds onto a new island. Not every change in a population comes from natural selection. Track the other causes.',
      outro: 'Report sent: mutations create new alleles, and meiosis shuffles them. Genetic drift (including the founder and bottleneck effects) changes populations by chance, and gene flow moves alleles between populations.',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(9, 2, 1).ground(12).review()
          .scan(3, 's5-genepool').scan(8, 's5-frequency').scan(13, 's5-newallele').ground(16).hsparks(-10, 6.2, 4)
          .scan(3, 's5-resist').ground(6)
          .sequence('s-resistance')
          .readData('d-resistance')
          .squeeze(3, 4).snapper(11, 3.4, 0.6).ground(15)
          .refuel().scan(3, 's5-drift').scan(8, 's5-founder').scan(13, 's5-bottleneck').scan(18, 's5-geneflow').ground(21)
          .catchGame('c-mechanism')
          .become('b-bottleneck')
          .bridge(11).virus(4, 2.5, 1.2).spikes(9, 1.8).qblock(13, 3.4, 'shield').ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.B.1.1.2', 'BIO.B.2.1.2', 'BIO.B.3.1.1', 'BIO.B.3.1.3'])
          .station(['w5q07', 'w5q12'])
          .goal();
      } },
    { id: '5-3', title: 'New Species', theme: 'canyon',
      log: 'Mission log: A giant canyon splits this land in two. The squirrels on each side look a little different. Is one species turning into two?',
      outro: 'Report sent: when populations are isolated (by geography, behavior, or timing), they evolve separately and can become new species. Some species spread into many niches (adaptive radiation); others go extinct.',
      build: function (b) {
        b.hint(5, 4.6, 'Two sides, two populations. Scan them.').sparks(9, 1.2, 4).ground(14).review()
          .scan(3, 's5-species').scan(8, 's5-geographic').ground(11).hsparks(-11, 6.2, 4)
          .become('b-isolation')
          .scan(3, 's5-behavioral').scan(8, 's5-temporal').ground(11)
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'isolation', n: 4 }])
          .scan(3, 's5-speciation').scan(8, 's5-radiation').scan(13, 's5-extinct').ground(16)
          .maze('maze-speciation')
          .snapper(5, 3.6, 0).virus(10, 2.4, 1.2).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .wordbank('wb-speciation')
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.B.4.1.1', 'BIO.B.4.2.4', 'BIO.B.3.1.1', 'BIO.B.3.1.2'])
          .station(['w5q08', 'w5q11'])
          .bridge(12, { ay: 1.4, sp: 1.1 }).ground(5)
          .goal();
      } },
    { id: '5-4', title: 'Reading the Evidence', theme: 'canyon',
      log: 'Mission log: The canyon walls are a history book written in rock. With my hand drill I can dig down through the layers. The deeper I dig, the further back in time I go.',
      outro: 'Report sent: fossils in rock layers, transitional fossils, homologous and vestigial structures, similar embryos, matching DNA and proteins, and a universal genetic code all show that living things share common ancestors.',
      build: function (b) {
        /* FOSSIL DIG: evidence from living things up top, then dig freely DOWN through five rock layers, each older than the one above
           (law of superposition). Each layer is a block of rock to tunnel through: fossils and minerals are buried in it, hard boulders
           must be dug around, and loose boulders fall if you dig out what holds them up. Samples go into a bag (3 at a time) and up
           to the lab through a sample capsule. The layers are a "greatest hits" stack from real fossil sites, in true age order. */
        b.hint(5, 4.6, 'Evidence from living things first. Then dig down into the rock!').sparks(9, 1.2, 4).ground(14).review()
          .scan(3, 's5-embryo').scan(8, 's5-molecular').scan(13, 's5-code').ground(16).hsparks(-10, 6.2, 4)
          .readData('d-cytochrome')
          .scan(3, 's5-fossil').scan(8, 's5-layers').capsule(12.5).ground(15)
          .digField({ color: '#c8a878', fossils: [[3, 2, 's5r-mammoth']], ores: [[7, 1, 'quartz'], [1, 5, 'calcite']], boulders: [[5, 3, 1], [6, 3, 0], [8, 5, 0]] })
          .stratum({ name: 'Layer 1 · Ice Age', sub: 'About 20,000 years ago. Near the top = youngest.', color: '#c8a878' })
          .rockfall(9, 4.2, 0).capsule(14).ground(16)
          .become('b-homolog').ground(4)
          .digField({ color: '#b88a5a', fossils: [[5, 3, 's5r-ambulo']], ores: [[2, 1, 'gypsum'], [8, 4, 'hematite']], boulders: [[4, 1, 0], [1, 3, 1], [7, 2, 0], [3, 5, 0]] })
          .stratum({ name: 'Layer 2 · Early whales', sub: 'About 49 million years ago (fossils found in Pakistan)', color: '#b88a5a' })
          .scan(4, 's5-vestigial').scan(9, 's5-homologous').scan(14, 's5-analogous').capsule(18).ground(20)
          .refuel().station([{ sort: 'structures', n: 4 }]).ground(4)
          .digField({ color: '#9a6a4a', fossils: [[2, 2, 's5r-dino']], ores: [[6, 4, 'hematite'], [8, 1, 'quartz']], boulders: [[5, 1, 1], [5, 2, 0], [1, 4, 0], [7, 5, 1]] })
          .stratum({ name: 'Layer 3 · Dinosaurs', sub: 'About 68 million years ago (like Montana\'s Hell Creek rocks)', color: '#9a6a4a' })
          .rockfall(8, 3.6, 0.4).capsule(13).ground(16)
          .lablock('lock-5-4').ground(4)
          .digField({ color: '#8a7a6a', fossils: [[6, 3, 's5-transitional']], ores: [[2, 2, 'calcite'], [4, 5, 'pyrite']], boulders: [[3, 1, 0], [8, 2, 1], [1, 4, 0]] })
          .stratum({ name: 'Layer 4 · Fish with legs', sub: 'About 375 million years ago (Tiktaalik, Ellesmere Island, Canada)', color: '#8a7a6a' })
          .rockfall(9, 3.8, 1.2).capsule(13).ground(16)
          .mixed(2, ['BIO.B.2.2.1', 'BIO.B.3.1.2', 'BIO.B.3.2.1', 'BIO.B.3.1.1'])
          .station(['w5q17', 'w5q22']).ground(4)
          .digField({ color: '#6a7a8a', fossils: [[3, 2, 's5r-trilobite']], ores: [[7, 3, 'pyrite'], [1, 5, 'calcite']], boulders: [[5, 2, 0], [6, 4, 1]],
            rare: [0, 6, { name: 'Hallucigenia fossil', fact: 'A tiny spiky Burgess Shale animal. Scientists first drew it upside down and back to front. New fossils showed them the mistake: science corrects itself with evidence.' }] })
          .stratum({ name: 'Layer 5 · Early sea animals', sub: 'About 500 million years ago (like the Burgess Shale, Canada)', color: '#6a7a8a' })
          .rockfall(9, 3.2, 1).capsule(13).ground(16)
          .sequence('s-layers').ground(3)
          .caveEnd().ground(10)
          .goal();
      } },
    { id: '5-5', title: 'How Science Knows', theme: 'island',
      log: 'Mission log: Last stop. Before sending the full report home, sort what scientists see, what they conclude, and what they can prove. Then face the final storm.',
      outro: 'Report sent: observations are measured, inferences are concluded from evidence, hypotheses are testable predictions, laws describe what happens, and theories, like evolution, are well-tested explanations of why.',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(8, 2, 1).ground(12).review()
          .scan(3, 's5-observation').scan(8, 's5-inference').scan(13, 's5-hypothesis').ground(16).hsparks(-12, 6.2, 4)
          .catchGame('c-science')
          .scan(3, 's5-theory').scan(8, 's5-law').ground(11)
          .wordbank('wb-science')
          .snapper(5, 3.6, 0).virus(10, 2.4, 1.2).ground(15)
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'science-terms', n: 4 }])
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(5, 'boom').mixed(2, ['BIO.B.3.1.1', 'BIO.B.3.1.2', 'BIO.B.3.1.3', 'BIO.B.3.2.1', 'BIO.B.3.3.1'])
          .qblock(3, 3.4, 'shield').hazard(8, 1.2, { ax: 2, sp: 1.3 }).ground(14)
          .hint(-3, 4.6, 'Boss ahead: The Selection Storm')
          .boss('The Selection Storm', 'boss', 5, 2, ['BIO.B.3.1.1', 'BIO.B.3.1.2', 'BIO.B.3.2.1', 'BIO.B.3.3.1'])
          .bridge(11).ground(5)
          .goal();
      } }
  ]
});

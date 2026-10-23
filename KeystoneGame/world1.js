/* WORLD 1 GAME FILE: Structure and Function (five levels).
   Each level is a list of building steps, read left to right:
   ground = floor, gap = pit to jump, rise = step up or down, plat = floating platform,
   sparks = bonus pickups, collect = a collecting challenge, station = question pads,
   review = questions the player missed before,
   mixed = a mixed-review gate with questions from earlier levels (interleaving),
   boss = boss battle (here 4 homeostasis questions mixed with 3 from earlier levels), goal = the exit.
   New activity steps (used in 1-4): become = Become It, readData = Read the Data, sequence = Sequence,
   wordbank = Word Bank, lablock = Lab Lock. Their content lives in the question file.
   Action steps (used in 1-3): hazard = a free radical to dodge or jump on, bridge = a moving platform
   over a gap, boost = ATP that makes you faster for 6 seconds, catchGame = a Build It catch arena,
   hunt = a Specimen Hunt (find the real answers, avoid drifting decoys; used in 1-1).
   Platformer pieces: virus = a walking enemy, spikes = toxin crystals on the ground, qblock = a ? block
   to bump from below (reward: sparks, boost, shield, or life), shield = 8 seconds of protection,
   rare = the level's hidden Rare Specimen, arc = a trail of sparks that shows where to jump.
   snapper = a phagocyte (amoeba or white blood cell) that pops up on a beat (period in seconds, start offset); jump when it hides.
   antibody = flies at head height on a beat (dx, distance, period, offset): duck or jump.
   squeeze = a low tunnel to crawl through while ducking (dx, length).
   scan = a specimen to scan with E; it teaches a word and saves it to the Field Guide (dx, scan id).
   hplat = a hidden platform: solid for everyone, but only visible with Lab goggles (used for the secret climbs).
   hsparks = bonus sparks only Lab goggles can see. clue = an escape-room clue terminal (dx, question id).
   portal = a locked portal to the Immune Defense mini-game; its code is the letters of the level's clue answers.
   maze = Organization Maze: walls of three doorways; only the next level opens.
   balance = keep a body measurement in its normal range with switches (an elevator, or the 1-5 boss). */
FieldGuide.registerWorld({
  id: 1,
  title: 'Structure and Function',
  levels: [
    { id: '1-1', title: 'Signs of Life', theme: 'pond',
      log: 'Mission log: Landed beside a pond on Earth. First question for the report home: what counts as alive here?',
      outro: 'Report sent: every living thing on Earth shares the same signs of life.',
      build: function (b) {
        /* teaches: moving, jumping, double jump, ? blocks, viruses, then the Specimen Hunt */
        b.hint(5, 4.4, 'Move: arrow keys or A and D. Hold Shift to run!').hint(12, 4.6, 'Jump: space bar. Tap it again in the air to double jump!')
          .qblock(17, 3.4, 'sparks').ground(21).hsparks(-12, 6.2, 4)
          .hint(3, 4.8, 'See a 🔍? Walk up and press E to scan it and learn a new word!').scan(8, 's-frog').scan(12.5, 's-rock').scan(16.5, 's-sprout').ground(21)
          .arc(-2.5, 7, 2.6).gap(3.5).ground(12)
          .hint(-8, 4.6, 'Viruses! Jump on them or over them.').virus(-4, 2.4, 0.8)
          .hint(3, 4.6, 'Duck: down arrow or S. Crawl through tight spots!').squeeze(6, 4).ground(13)
          .rise(1.5).ground(6).rise(1.5).sparks(1, 1.2, 4).ground(6)
          .hplat(-5.8, 2.4, 2.8).hplat(-3.4, 4.8, 2.8).hplat(-1, 8.4, 2.6).rare(0.3, 9.7)
          .refuel().gap(3.5).rise(-3).hint(2, 4.6, 'Hungry amoebas pop up on a beat to engulf food. Jump when they hide!').snapper(5, 4, 0).ground(9)
          .scan(3, 's-lily').scan(8, 's-eggs').scan(13, 's-bact').scan(18, 's-turtle').scan(23, 's-dna').ground(26)
          .hunt('life')
          .qblock(3, 3.4, 'boost').ground(8)
          .crumbleBridge(3, 'crumble').station([{ sort: 'alive', n: 3 }])
          .virus(5, 2.6, 1).snapper(12, 3.5, 1.2).ground(16).hsparks(-9, 6.4, 5)
          .station(['w1q01', 'w1q02'])
          .goal();
      } },
    { id: '1-2', title: 'Two Kinds of Cells', theme: 'deep',
      log: 'Mission log: A research ship far out at sea. Sink down through the ocean zones to the hydrothermal vents, and find the two kinds of cells that live all the way down.',
      outro: 'Report sent: prokaryotes (bacteria and archaea) have no nucleus. Eukaryotes have a nucleus and membrane-bound organelles. At the vents, prokaryotes make food from chemicals and feed animals made of eukaryotic cells.',
      build: function (b) {
        /* DEEP SEA: dive from the ship through the sunlit, twilight and midnight zones to a vent field on the sea floor.
           Below the twilight zone there is no sunlight: the alien's antennae glow and the animals make their own light. */
        b.hint(5, 4.6, 'A research ship over the deep ocean. Dive in and sink to the vents!').sparks(8, 1.2, 3).ground(13).ship(13).review()
          .sea(-0.6).gap(1).rise(-10)
          .oceanZone('Sunlit zone', '0 to 200 m deep. Enough light for photosynthesis.')
          .scan(5, 's1d-diatom').scan(10, 's-plant').hazard(15, 4, { look: 'jelly', ax: 1, ay: 1.4, sp: 0.6 }).ground(19)
          .rise(-8)
          .oceanZone('Twilight zone', '200 to 1,000 m deep. Only dim blue light. Many animals glow.')
          .glowers(8, 5, 'lantern').scan(4, 's-bact2').scan(9, 's-membrane').scan(14, 's-cyto').scan(19, 's-ribo').ground(22)
          .hunt('build-prok')
          .glowers(4, 4, 'comb').hazard(10, 3, { look: 'jelly', ax: 0.8, ay: 1.2, sp: 0.5 }).clue(5, 'w1q03').ground(14)
          .rise(-8).abyss(5)
          .oceanZone('Midnight zone', '1,000 to 4,000 m deep. Totally dark and near freezing.')
          .glowers(6, 4, 'snow', 10).hazard(13, 3.5, { look: 'angler', ax: 3, ay: 0.6, sp: 0.4 }).scan(4, 's-animal').scan(9, 's-nucleus').ground(18)
          .refuel().scan(3, 's-mito').scan(8, 's-er').scan(13, 's-golgi').ground(16)
          .hunt('build-euk')
          .glowers(5, 5, 'comb').hazard(9, 3, { look: 'atolla', ax: 0.6, ay: 1.4, sp: 0.5 }).clue(4, 'w1q04').ground(13)
          .mixed(2, ['BIO.A.1.1.1'])
          .rise(-10)
          .oceanZone('Hydrothermal vents', 'About 2,500 m deep. Hot, mineral-rich water gushes from the sea floor.')
          .glowers(10, 6, 'snow', 8).scan(4, 's1d-ventmat').scan(9, 's1d-archaea').scan(14, 's1d-tubeworm').ground(18)
          .smoker(3, 3.2, 10).plat(6.5, 8.5, 3.5).rare(8.2, 9.6, { name: 'Yeti crab', fact: 'Found at deep-sea vents in 2005. It waves its hairy arms over the vents to farm bacteria on them, then eats the bacteria.' }).ground(12)
          .station(['w1q05', 'w1q06'])
          .smoker(4, 2.6, 7).hazard(10, 3.5, { look: 'angler', ax: 2, ay: 0.8, sp: 0.5 }).clue(13, 'w1q24').ground(16)
          .hint(1, 6.6, 'Portal! Its code is the letters of your 3 clue answers.').portal(6).ground(11)
          .hint(3, 5.2, 'The mothership beam reaches all the way down here!').ground(6)
          .goal();
      } },
    { id: '1-3', title: 'The Protein Factory', theme: 'nucleus',
      log: 'Mission log: Inside a eukaryotic cell. Copy a gene, build a protein, and ship it out of the cell. Watch out for free radicals!',
      outro: 'Report sent: DNA is copied to mRNA, ribosomes build the protein, and the rough ER and Golgi apparatus prepare it to leave the cell.',
      build: function (b) {
        /* adds: flying free radicals, more enemies together, faster moving platforms */
        b.hint(7, 4.6, 'Free radicals damage cells. Jump on top of them!').hazard(11, 1.0, { ax: 2.2, ay: 0.15, sp: 1.1 }).sparks(3, 1.2, 3).ground(16)
          .review()
          .squeeze(2, 3.5).antibody(14, 8, 3).ground(16).hsparks(-5, 6.4, 4)
          .qblock(3, 3.4, 'boost').ground(6)
          .bridge(11)
          .hazard(4, 1.0, { ax: 1.5 }).hazard(9, 3.2, { ax: 0.5, ay: 1.2, sp: 1.8 }).virus(10, 1.6, 1.2).sparks(2, 2.5, 4).ground(12)
          .scan(3, 's-dna2').scan(8, 's-mrna').ground(11)
          .catchGame('c-transcribe')
          .sparks(0.5, 8.5, 4).ground(6).clue(3, 'w1q08').ground(6)
          .bridge(12, { ay: 1.6, sp: 1.0 })
          .hazard(3, 1.0, { ax: 1.2, sp: 2 }).ground(6).rise(1.5).qblock(2.5, 3.4, 'shield').ground(5).rise(-1.5)
          .hazard(5, 1.2, { ax: 3, sp: 1.4 }).snapper(9, 3.2, 0.8).sparks(2, 3.4, 5).ground(12)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .refuel().scan(3, 's-ribo2').scan(8, 's-trna').scan(13, 's-protein').ground(16)
          .catchGame('c-translate')
          .sparks(0.5, 8.5, 4).ground(6).clue(3, 'w1q49').ground(6)
          .crumbleBridge(4, 'crumble').mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1'])
          .scan(3, 's-er').scan(8, 's-golgi').ground(11)
          .become('b-protein-er')
          .bridge(13, { sp: 1.3 })
          .hazard(4, 1.0, { ax: 1.6, sp: 1.6 }).virus(9, 2.4, 1.5).hazard(9, 3.0, { ax: 1.6, sp: 1.6, ay: 0.8 }).qblock(6, 3.4, 'life').ground(13)
          .become('b-protein-golgi')
          .bridge(14, { sp: 1.5 }).ground(4).bridge(10, { ay: 1.4, sp: 1.2 })
          .ground(4).clue(2, 'w1q11').ground(6).hint(1, 6.6, 'Portal! Its code is the letters of your 3 clue answers.').portal(6, 'dna').ground(11)
          .goal();
      } },
    { id: '1-4', title: 'Membrane Gates', theme: 'membrane',
      log: 'Mission log: Reached the plasma membrane. Become the molecules and find out how each one gets across.',
      outro: 'Report sent: passive transport goes from crowded to less crowded with no energy. Active transport uses ATP to go from less crowded to more crowded.',
      build: function (b) {
        b.ground(10).sparks(-6, 1.2, 4).hsparks(-8, 5.8, 4).review()
          .scan(3, 's-diffuse').scan(8, 's-gradient').ground(11)
          .become('b-oxygen')
          .gap(3.5).ground(5)
          .scan(2.5, 's-channel').ground(5)
          .become('b-glucose')
          .scan(2.5, 's-water').ground(5)
          .become(['b-water-in', 'b-water-out'])
          .rise(1.5).ground(5).rise(-1.5).ground(4)
          .readData('d-potato')
          .scan(2.5, 's-exo').ground(5)
          .refuel().sequence('s-exo')
          .gap(3.5).ground(5).sparks(-4, 1.2, 3)
          .scan(2.5, 's-endo').ground(5)
          .sequence('s-endo')
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.B.2.2.2', 'BIO.A.4.1.3'])
          .scan(3, 's-pump').scan(8, 's-atp').ground(11)
          .become('b-sodium-in')
          .become('b-sodium-out')
          .plat(1, 2.2, 3).plat(6, 4.2, 3).sparks(6.5, 5.2, 3).ground(11)
          .wordbank('wb-membrane')
          .lablock('lock-1-4')
          .goal();
      } },
    { id: '1-5', title: 'Body Balance', theme: 'body',
      log: 'Mission log: Zoomed out to a whole body. Something keeps knocking it out of balance. Repair its feedback loops.',
      outro: 'Report sent: cells form tissues, organs, and systems, and negative feedback keeps the whole body in balance.',
      build: function (b) {
        /* feedback loops you operate: wire the loop, balance blood glucose, then beat the temperature boss */
        b.sparks(4, 1.2, 4).virus(8, 2, 1).ground(12).hsparks(-10, 6.2, 4).review()
          .qblock(3, 3.4, 'sparks').ground(6)
          .scan(3, 's-tissue').scan(8, 's-organ').scan(13, 's-system').scan(18, 's-organism').ground(21)
          .maze('maze-levels')
          .sparks(0.5, 8.5, 5).sparks(1, 11.5, 4).ground(7).clue(4, 'w1q22').ground(7)
          .station(['w1q24', 'w1q25'])
          .bridge(11)
          .virus(4, 2.4, 1.2).snapper(9.5, 3.4, 0).ground(14).hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .scan(3, 's-receptor').scan(8, 's-feedback').ground(11)
          .refuel().sequence('seq-loop')
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.B.2.2.2', 'BIO.A.4.1.3', 'BIO.A.4.1.1', 'BIO.A.4.1.2'])
          .clue(3, 'w1q29').scan(8, 's-glucose').ground(11)
          .balance('bal-glucose')
          .squeeze(3, 4).antibody(15, 8, 3.2, 1).ground(16)
          .qblock(3, 3.4, 'shield').hazard(8, 1.2, { ax: 2, sp: 1.3 }).virus(12, 2, 1.4).ground(16)
          .clue(3, 'w1q30').ground(6).hint(1, 6.6, 'Portal! Its code is the letters of your 3 clue answers.').portal(6).ground(11)
          .hint(-3, 4.6, 'Boss ahead: The Imbalance')
          .balance('bal-temp')
          .goal();
      } }
  ]
});

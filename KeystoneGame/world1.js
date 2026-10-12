/* WORLD 1 GAME FILE: Structure and Function (five levels).
   Each level is a list of building steps, read left to right:
   ground = floor, gap = pit to jump, rise = step up or down, plat = floating platform,
   sparks = bonus pickups, collect = a collecting challenge, station = question pads,
   review = questions the player missed before,
   mixed = a mixed-review gate with questions from earlier levels (interleaving),
   boss = boss battle (here 4 homeostasis questions mixed with 3 from earlier levels), goal = the exit.
   New activity steps (used in 1-4): become = Become It, readData = Read the Data, sequence = Sequence,
   wordbank = Word Bank, lablock = Lab Lock. Their content lives in the question file. */
FieldGuide.registerWorld({
  id: 1,
  title: 'Structure and Function',
  levels: [
    { id: '1-1', title: 'Signs of Life', theme: 'pond',
      log: 'Mission log: Landed beside a pond on Earth. First question for the report home: what counts as alive here?',
      outro: 'Report sent: every living thing on Earth shares the same signs of life.',
      build: function (b) {
        b.hint(6, 4.2, 'Move: arrow keys or A and D').hint(13, 4.2, 'Jump: space bar').ground(16)
          .gap(3).sparks(1, 1.2, 4).ground(9)
          .rise(1.5).ground(6).rise(1.5).ground(6).sparks(-5, 1.2, 3).gap(3.5).rise(-3).ground(6)
          .collect('life')
          .hint(-2.5, 4.4, 'Next: jump on a pad, then press E')
          .station([{ sort: 'alive', n: 3 }])
          .plat(1, 2.2, 3).plat(6, 4.2, 3).sparks(6.5, 5.2, 3).ground(11)
          .station(['w1q01', 'w1q02'])
          .goal();
      } },
    { id: '1-2', title: 'Two Kinds of Cells', theme: 'cell',
      log: 'Mission log: Shrunk to cell size. Earth cells come in two kinds. Find out what sets them apart.',
      outro: 'Report sent: prokaryotes have no nucleus. Eukaryotes have a nucleus and membrane-bound organelles.',
      build: function (b) {
        b.ground(12).sparks(-8, 1.2, 5).gap(3).ground(5).gap(3.5).ground(6)
          .review()
          .station([{ sort: 'cells', n: 4 }])
          .rise(1.5).ground(5).rise(1.5).ground(5).sparks(-4, 1.2, 3).gap(4).rise(-3).ground(5)
          .collect('organelles')
          .station(['w1q03', 'w1q04'])
          .mixed(2, ['BIO.A.1.1.1'])
          .plat(1, 2.2, 3).plat(6, 4.2, 3).sparks(6.5, 5.2, 3).ground(11).gap(3.5).ground(4)
          .station([{ sort: 'cells', n: 3 }])
          .station(['w1q05', 'w1q06'])
          .goal();
      } },
    { id: '1-3', title: 'The Protein Factory', theme: 'nucleus',
      log: 'Mission log: Inside a eukaryotic cell. Follow one protein from the DNA code to the cell surface.',
      outro: 'Report sent: DNA is copied to mRNA, ribosomes build the protein, and the ER and Golgi ship it out.',
      build: function (b) {
        b.ground(10).sparks(-6, 1.2, 4).review()
          .hint(-2.5, 4.4, 'Stop 1: the nucleus').station(['w1q07', 'w1q08'])
          .gap(3.5).ground(5).gap(3.5).ground(6).sparks(-5, 1.2, 3)
          .hint(-2.5, 4.4, 'Stop 2: a ribosome').station(['w1q09', 'w1q10', 'w1q11'])
          .rise(1.5).ground(6).rise(1.5).ground(6).gap(4).rise(-3).ground(6)
          .mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1'])
          .hint(-2.5, 4.4, 'Stop 3: the rough ER').station(['w1q12'])
          .plat(1, 2.2, 3).plat(6, 4.2, 3).sparks(6.5, 5.2, 3).ground(12)
          .hint(-2.5, 4.4, 'Stop 4: the Golgi apparatus').station(['w1q13', 'w1q14'])
          .goal();
      } },
    { id: '1-4', title: 'Membrane Gates', theme: 'membrane',
      log: 'Mission log: Reached the plasma membrane. Become the molecules and find out how each one gets across.',
      outro: 'Report sent: passive transport goes from crowded to less crowded with no energy. Active transport uses ATP to go from less crowded to more crowded.',
      build: function (b) {
        b.ground(10).sparks(-6, 1.2, 4).review()
          .become('b-oxygen')
          .gap(3.5).ground(5)
          .become('b-glucose')
          .become(['b-water-in', 'b-water-out'])
          .rise(1.5).ground(5).rise(-1.5).ground(4)
          .readData('d-potato')
          .sequence('s-exo')
          .gap(3.5).ground(5).sparks(-4, 1.2, 3)
          .sequence('s-endo')
          .mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.B.2.2.2', 'BIO.A.4.1.3'])
          .become('b-sodium-in')
          .become('b-sodium-out')
          .plat(1, 2.2, 3).plat(6, 4.2, 3).sparks(6.5, 5.2, 3).ground(11)
          .wordbank('wb-membrane')
          .lablock('lock-1-4')
          .goal();
      } },
    { id: '1-5', title: 'Body Balance', theme: 'body',
      log: 'Mission log: Zoomed out to a whole body. Something is knocking it out of balance. Restore homeostasis.',
      outro: 'Report sent: cells form tissues, organs, and systems, and feedback keeps the whole body in balance.',
      build: function (b) {
        b.ground(10).sparks(-6, 1.2, 4).review()
          .station(['w1q22', 'w1q23'])
          .gap(3.5).ground(4).gap(3.5).ground(6).sparks(-5, 1.2, 3)
          .station(['w1q24', 'w1q25'])
          .mixed(2, ['BIO.A.1.1.1', 'BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.B.2.2.2', 'BIO.A.4.1.3', 'BIO.A.4.1.1', 'BIO.A.4.1.2'])
          .rise(1.5).ground(5).rise(1.5).ground(5).gap(4).rise(-3).ground(8)
          .hint(-3, 4.4, 'Boss ahead: The Imbalance')
          .boss('The Imbalance', 'boss', 7, 3, ['BIO.A.1.1.1', 'BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.B.2.2.2', 'BIO.A.4.1.3', 'BIO.A.4.1.1', 'BIO.A.4.1.2'])
          .goal();
      } }
  ]
});

/* WORLD 4 GAME FILE: Inheritance and Variation of Traits (five levels).
   Same building steps as World 1 (see world1.js for the full list). Content lives in world4-questions.js.
   Level 4-5 opens with a short review of transcription and translation (World 1) before mutations,
   and its portal leads to the Code Lab mini-game (DNA to mRNA to protein). */
FieldGuide.registerWorld({
  id: 4,
  title: 'Inheritance',
  levels: [
    { id: '4-1', title: 'Copy and Divide', theme: 'nucleus',
      log: 'Mission log: New world! Inside a dividing cell. Before a cell splits, it must copy every bit of its DNA. Watch how it does it.',
      outro: 'Report sent: in the cell cycle, a cell grows and copies its DNA (interphase), divides its nucleus (mitosis: prophase, metaphase, anaphase, telophase), and splits in two (cytokinesis). DNA replication pairs A with T and G with C.',
      build: function (b) {
        b.hint(5, 4.6, 'World 4: Inheritance. Scan everything you see!').sparks(9, 1.2, 4).ground(16).review()
          .scan(4, 's4-interphase').scan(9, 's4-dna').scan(14, 's4-replication').ground(18).hsparks(-11, 6.2, 4)
          .catchGame('c-basepair')
          .gap(3.2).virus(5, 2.5, 1).qblock(10, 3.4, 'sparks').ground(14)
          .hunt('replication-facts')
          .scan(3, 's4-chromosome').scan(8, 's4-chromatid').ground(11)
          .sequence('s-cellcycle')
          .snapper(5, 3.6, 0).spikes(10, 1.8).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .refuel().scan(3, 's4-mitosis').scan(8, 's4-cytokinesis').ground(11)
          .sequence('s-mitosis')
          .readData('d-cycle')
          .become('b-chromosomes')
          .bridge(11).hazard(4, 1.2, { ax: 1.6, sp: 1.3 }).ground(10)
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.A.1.2.1', 'BIO.B.2.2.1', 'BIO.B.1.1.1', 'BIO.B.1.2.1'])
          .virus(5, 2.4, 1.2).sparks(2, 3.2, 4).ground(12)
          .station(['w4q01', 'w4q10'])
          .goal();
      } },
    { id: '4-2', title: 'Making Gametes', theme: 'lab',
      log: 'Mission log: Earthlings come from TWO parents. Each parent sends half of its chromosomes. Find out how sex cells are made.',
      outro: 'Report sent: meiosis makes four haploid gametes. Crossing over and independent assortment make every gamete different. Errors like nondisjunction change the chromosome number.',
      build: function (b) {
        b.sparks(4, 1.2, 4).virus(9, 2, 1).ground(12).review()
          .scan(3, 's4-meiosis').scan(8, 's4-gamete').scan(13, 's4-diploid').scan(18, 's4-haploid').ground(21).hsparks(-10, 6.2, 4)
          .become('b-gamete')
          .scan(3, 's4-homolog').scan(8, 's4-crossover').scan(13, 's4-assort').ground(16)
          .sequence('s-meiosis')
          .squeeze(3, 4).snapper(11, 3.4, 0.6).ground(15)
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'mit-mei', n: 4 }])
          .scan(3, 's4-nondisjunction').ground(6)
          .catchGame('c-chromo')
          .bridge(11).virus(4, 2.5, 1.2).spikes(9, 1.8).qblock(13, 3.4, 'shield').ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .wordbank('wb-division')
          .crumbleBridge(4, 'mix').mixed(2, ['BIO.B.1.1.1', 'BIO.B.1.2.1', 'BIO.B.1.1.2', 'BIO.B.2.1.2'])
          .station(['w4q06', 'w4q24'])
          .goal();
      } },
    { id: '4-3', title: 'Genes and Alleles', theme: 'garden',
      log: 'Mission log: A garden of pea plants, like the ones a monk named Gregor Mendel studied. Some flowers are purple and some are white. Crack the code of inheritance.',
      outro: 'Report sent: genes are sections of DNA on chromosomes, and alleles are versions of a gene. Dominant alleles mask recessive ones. Punnett squares predict the chances of each genotype and phenotype.',
      build: function (b) {
        b.hint(5, 4.6, 'Purple or white? Scan the pea plants.').sparks(9, 1.2, 4).ground(14).review()
          .scan(3, 's4-gene').scan(8, 's4-allele').ground(11).hsparks(-11, 6.2, 4)
          .maze('maze-genes')
          .scan(3, 's4-dominant').scan(8, 's4-recessive').scan(13, 's4-genotype').scan(18, 's4-phenotype').ground(21)
          .wordbank('wb-genetics')
          .scan(3, 's4-homozygous').scan(8, 's4-heterozygous').ground(11)
          .hunt('hetero')
          .refuel().scan(3, 's4-punnett').ground(6)
          .become('b-punnett')
          .readData('d-punnett')
          .snapper(5, 3.6, 0).virus(10, 2.4, 1.2).ground(15)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .lablock('lock-4-3')
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.B.1.1.2', 'BIO.B.1.2.2', 'BIO.B.2.1.1', 'BIO.B.1.2.1'])
          .station(['w4q18', 'w4q19'])
          .bridge(12, { ay: 1.4, sp: 1.1 }).ground(5)
          .goal();
      } },
    { id: '4-4', title: 'Beyond Mendel', theme: 'garden',
      log: 'Mission log: Pink flowers? Spotted cattle? Four blood types? Not every trait follows the simple dominant and recessive rule. Investigate.',
      outro: 'Report sent: some traits show incomplete dominance (a blend) or codominance (both show). Blood type has multiple alleles. Sex-linked genes are on the X chromosome, and polygenic traits are controlled by many genes.',
      build: function (b) {
        b.sparks(4, 1.2, 4).hazard(9, 1.1, { ax: 1.8, sp: 1.2 }).ground(13).review()
          .scan(3, 's4-incomplete').scan(8, 's4-codominance').ground(11).hsparks(-10, 6.2, 4)
          .become('b-codominance')
          .scan(3, 's4-multiple').ground(6)
          .catchGame('c-blood')
          .sparks(0.5, 8.5, 4).ground(6)
          .scan(3, 's4-sexlinked').scan(8, 's4-polygenic').ground(11)
          .refuel().sparks(0.5, 8.5, 4).ground(6)
          .station([{ sort: 'pattern', n: 4 }])
          .squeeze(3, 4).antibody(15, 8, 3.2, 0.5).ground(16)
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .crumbleBridge(5, 'mix').mixed(2, ['BIO.B.1.1.2', 'BIO.B.1.2.2', 'BIO.B.2.1.1', 'BIO.B.2.1.2'])
          .station(['w4q22', 'w4q23'])
          .bridge(11).ground(5)
          .goal();
      } },
    { id: '4-5', title: 'Mutations and Biotech', theme: 'nucleus',
      log: 'Mission log: Sometimes DNA changes, and sometimes humans change it on purpose. First, remember how a gene becomes a protein.',
      outro: 'Report sent: mutations change the DNA sequence. Some have no effect (silent), some change one amino acid (missense), and some stop the protein early (nonsense) or scramble it (frameshift). Genetic engineering moves genes to make medicines, crops, and tools for solving crimes.',
      build: function (b) {
        b.hint(5, 4.6, 'Find the 3 green clue terminals. They open a portal!').sparks(9, 1.2, 4).ground(14).review()
          .crumbleBridge(4, 'mix')
          .clue(4, 'w4q38').virus(9, 2.4, 1).ground(13)
          .scan(3, 's4-mutation').scan(8, 's4-substitution').scan(13, 's4-frameshift').ground(16).hsparks(-11, 6.2, 4)
          .become('b-frameshift')
          .catchGame('c-mutation')
          .clue(3, 'w4q39').snapper(9, 3.4, 0.4).ground(13)
          .refuel().scan(3, 's4-mutagen').scan(8, 's4-gmo').scan(13, 's4-genetherapy').ground(16)
          .sequence('s-gmo')
          .scan(3, 's4-clone').scan(8, 's4-fingerprint').scan(13, 's4-selective').ground(16)
          .hunt('biotech-uses')
          .hplat(-7, 2.4, 3).hplat(-4.5, 4.8, 3).hplat(-2, 8.4, 2.6).rare(-0.7, 9.7)
          .clue(3, 'w4q40').ground(6).hint(1, 6.6, 'Portal! Its code is the letters of your 3 clue answers.').portal(6, 'dna').ground(11)
          .qblock(3, 3.4, 'shield').hazard(8, 1.2, { ax: 2, sp: 1.3 }).ground(14)
          .hint(-3, 4.6, 'Boss ahead: The Mutation Storm')
          .boss('The Mutation Storm', 'boss', 5, 2, ['BIO.B.1.1.2', 'BIO.B.2.1.1', 'BIO.B.2.3.1', 'BIO.B.2.4.1'])
          .bridge(11).ground(5)
          .goal();
      } }
  ]
});

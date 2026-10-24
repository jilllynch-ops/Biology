/* WORLD 4 QUESTION FILE: Inheritance and Variation of Traits
   Teachers: you can edit the words inside the quotation marks below.
   - "code" is the Keystone Eligible Content code. "steels" is the PA STEELS standard.
   - In "questions", "answer" is the position of the correct option, counting from 0
     (0 = first option). The game shuffles the options, so the right answer can always go first.
   - "hint" shows after a wrong try. "explain" shows after the right answer.
   - "tags": ["boss"] marks boss-battle questions.
   - Keep every comma, bracket, and quotation mark in place. */
FieldGuide.registerQuestions(4, {
 "tokens": [
  {
   "id": "replication-facts",
   "code": "BIO.B.1.2.1",
   "steels": "3.1.9-12.P",
   "prompt": "Collect only TRUE facts about DNA replication",
   "good": [
    "A pairs with T",
    "G pairs with C",
    "Each new DNA keeps one old strand",
    "It happens before a cell divides",
    "Enzymes unzip the double helix",
    "It makes an exact copy of the DNA"
   ],
   "bad": [
    {
     "text": "A pairs with C",
     "explain": "In DNA, A always pairs with T, and G always pairs with C."
    },
    {
     "text": "It happens after the cell divides",
     "explain": "DNA is copied during interphase, BEFORE division, so each new cell gets a full copy."
    },
    {
     "text": "Both strands of new DNA are brand new",
     "explain": "Replication is semi-conservative: each new DNA molecule keeps one original strand."
    },
    {
     "text": "It turns DNA into mRNA",
     "explain": "Making mRNA from DNA is transcription, not replication."
    }
   ]
  },
  {
   "id": "hetero",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "Collect only HETEROZYGOUS genotypes (two different alleles)",
   "good": [
    "Aa",
    "Bb",
    "Tt",
    "Pp",
    "Rr"
   ],
   "bad": [
    {
     "text": "AA",
     "explain": "AA has two identical dominant alleles: homozygous dominant."
    },
    {
     "text": "bb",
     "explain": "bb has two identical recessive alleles: homozygous recessive."
    },
    {
     "text": "TT",
     "explain": "TT is homozygous dominant: both alleles are the same."
    },
    {
     "text": "pp",
     "explain": "pp is homozygous recessive: both alleles are the same."
    }
   ]
  },
  {
   "id": "biotech-uses",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "Collect only REAL uses of genetic engineering and biotechnology",
   "good": [
    "Bacteria that make human insulin",
    "Crops that resist insect pests",
    "Gene therapy for inherited diseases",
    "DNA fingerprinting to solve crimes",
    "Cloning an animal from a body cell"
   ],
   "bad": [
    {
     "text": "Exercise changes the genes you pass on",
     "explain": "Traits you gain during life, like muscles, are not written into your gametes' DNA."
    },
    {
     "text": "Eating GMO food changes your DNA",
     "explain": "Digestion breaks food's DNA into small pieces. It does not change your genes."
    },
    {
     "text": "A clone is born as an adult",
     "explain": "A clone has the same DNA as its donor, but it is born as a baby and grows up normally."
    },
    {
     "text": "Gene therapy works on viruses like the cold",
     "explain": "Gene therapy targets a person's own faulty genes, not infections like colds."
    }
   ]
  }
 ],
 "sorts": [
  {
   "id": "mit-mei",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "Mitosis or meiosis?",
   "options": [
    "Mitosis",
    "Meiosis"
   ],
   "hint": "Mitosis: one division, two identical body cells. Meiosis: two divisions, four different gametes with half the chromosomes.",
   "items": [
    {
     "text": "Makes new skin cells to heal a cut",
     "answer": 0,
     "explain": "Growth and repair use mitosis."
    },
    {
     "text": "Makes sperm and egg cells",
     "answer": 1,
     "explain": "Gametes are made by meiosis."
    },
    {
     "text": "Daughter cells are identical to the parent cell",
     "answer": 0,
     "explain": "Mitosis makes identical copies."
    },
    {
     "text": "Makes four haploid cells",
     "answer": 1,
     "explain": "Meiosis ends with four haploid cells."
    },
    {
     "text": "Crossing over swaps pieces of chromosomes",
     "answer": 1,
     "explain": "Crossing over happens in meiosis I."
    },
    {
     "text": "Keeps the chromosome number the same (46 to 46)",
     "answer": 0,
     "explain": "Mitosis keeps cells diploid."
    },
    {
     "text": "Has two rounds of division",
     "answer": 1,
     "explain": "Meiosis I and meiosis II."
    },
    {
     "text": "Lets a single-celled organism reproduce asexually",
     "answer": 0,
     "explain": "Asexual reproduction of many single-celled eukaryotes uses mitosis."
    }
   ]
  },
  {
   "id": "pattern",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "Which inheritance pattern is it?",
   "options": [
    "Incomplete dominance",
    "Codominance",
    "Multiple alleles",
    "Sex-linked",
    "Polygenic"
   ],
   "hint": "Blend? Incomplete. Both show? Codominance. More than two alleles? Multiple. On the X chromosome? Sex-linked. Many genes? Polygenic.",
   "items": [
    {
     "text": "Red and white four-o'clock flowers make pink offspring",
     "answer": 0,
     "explain": "A blended, in-between phenotype is incomplete dominance."
    },
    {
     "text": "A roan cow has both red hairs and white hairs",
     "answer": 1,
     "explain": "Both alleles show fully at the same time: codominance."
    },
    {
     "text": "The ABO blood type gene has three alleles: Iᴬ, Iᴮ, and i",
     "answer": 2,
     "explain": "More than two alleles exist in the population: multiple alleles."
    },
    {
     "text": "Hemophilia is passed from a carrier mother to her sons",
     "answer": 3,
     "explain": "The gene is on the X chromosome: sex-linked."
    },
    {
     "text": "Human skin color shows a smooth range of shades",
     "answer": 4,
     "explain": "Many genes add together: polygenic inheritance."
    },
    {
     "text": "A chicken has both black and white feathers (erminette)",
     "answer": 1,
     "explain": "Both colors show: codominance."
    },
    {
     "text": "Red-green color blindness is far more common in males",
     "answer": 3,
     "explain": "Males have one X, so one recessive allele shows: sex-linked."
    },
    {
     "text": "Human height varies from short to tall in tiny steps",
     "answer": 4,
     "explain": "Many genes (plus environment) affect height: polygenic."
    }
   ]
  }
 ],
 "questions": [
  {
   "id": "w4q01",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "prompt": "During which part of the cell cycle does a cell copy its DNA?",
   "options": [
    "interphase (the S phase)",
    "prophase",
    "anaphase",
    "cytokinesis"
   ],
   "answer": 0,
   "hint": "It happens before mitosis begins.",
   "explain": "DNA is copied during the S (synthesis) phase of interphase."
  },
  {
   "id": "w4q02",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "prompt": "What happens during cytokinesis?",
   "options": [
    "The cytoplasm divides, forming two separate cells.",
    "The DNA is copied.",
    "Chromosomes line up in the middle.",
    "The nuclear membrane disappears."
   ],
   "answer": 0,
   "hint": "'Cyto' means cell; 'kinesis' means movement or splitting.",
   "explain": "Cytokinesis splits the cytoplasm, finishing the division into two cells."
  },
  {
   "id": "w4q03",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "prompt": "In which phase of mitosis do chromosomes line up across the middle of the cell?",
   "options": [
    "metaphase",
    "prophase",
    "anaphase",
    "telophase"
   ],
   "answer": 0,
   "hint": "M for middle.",
   "explain": "In metaphase, chromosomes line up in the middle so each new cell can get one copy."
  },
  {
   "id": "w4q04",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "prompt": "Why do body cells go through mitosis?",
   "options": [
    "for growth and to repair or replace damaged cells",
    "to make sperm and egg cells",
    "to create genetic variation",
    "to cut the chromosome number in half"
   ],
   "answer": 0,
   "hint": "Think of healing a scraped knee.",
   "explain": "Mitosis makes identical body cells for growth, repair, and replacement."
  },
  {
   "id": "w4q05",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "prompt": "Cancer can develop when cells...",
   "options": [
    "lose control of the cell cycle and divide without stopping",
    "stop copying their DNA",
    "finish meiosis",
    "divide too slowly to heal a wound"
   ],
   "answer": 0,
   "hint": "The cell cycle has checkpoints that act like brakes.",
   "explain": "Cancer cells ignore the cell cycle's checkpoints and divide uncontrollably."
  },
  {
   "id": "w4q06",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "A human body cell has 46 chromosomes. How many chromosomes are in a human sperm cell?",
   "options": [
    "23",
    "46",
    "92",
    "12"
   ],
   "answer": 0,
   "hint": "Meiosis halves the number.",
   "explain": "Gametes are haploid: half of 46 is 23."
  },
  {
   "id": "w4q07",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "Which statement compares mitosis and meiosis correctly?",
   "options": [
    "Mitosis makes 2 identical diploid cells; meiosis makes 4 genetically different haploid cells.",
    "Both make gametes.",
    "Mitosis makes 4 cells; meiosis makes 2 cells.",
    "Both make cells that are different from the parent."
   ],
   "answer": 0,
   "hint": "Count the cells and check the chromosome number.",
   "explain": "Mitosis: 2 identical diploid body cells. Meiosis: 4 different haploid gametes."
  },
  {
   "id": "w4q08",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "Why is it important that gametes are haploid?",
   "options": [
    "When sperm and egg join, the offspring gets the normal diploid number.",
    "So gametes can divide by mitosis.",
    "So offspring are identical to one parent.",
    "So cells can grow larger."
   ],
   "answer": 0,
   "hint": "23 + 23 = ?",
   "explain": "Two haploid gametes (23 + 23) join to make a diploid zygote with 46 chromosomes."
  },
  {
   "id": "w4q09",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "Which event happens in meiosis but NOT in mitosis?",
   "options": [
    "crossing over between homologous chromosomes",
    "copying DNA before division",
    "splitting of the cytoplasm",
    "chromosomes lining up in the cell"
   ],
   "answer": 0,
   "hint": "It mixes alleles between partner chromosomes.",
   "explain": "Crossing over happens only in meiosis I, when homologous chromosomes pair up."
  },
  {
   "id": "w4q10",
   "code": "BIO.B.1.2.1",
   "steels": "3.1.9-12.P",
   "prompt": "One strand of DNA reads A-T-G-C-C-A. What complementary strand is made during replication?",
   "options": [
    "T-A-C-G-G-T",
    "A-T-G-C-C-A",
    "U-A-C-G-G-U",
    "G-C-A-T-T-G"
   ],
   "answer": 0,
   "hint": "A pairs with T; G pairs with C.",
   "explain": "Each base pairs with its partner: A-T and G-C. (U is found only in RNA.)"
  },
  {
   "id": "w4q11",
   "code": "BIO.B.1.2.1",
   "steels": "3.1.9-12.P",
   "prompt": "DNA replication is called semi-conservative. What does that mean?",
   "options": [
    "Each new DNA molecule has one original strand and one new strand.",
    "Half of the DNA is lost.",
    "Only half of the genes are copied.",
    "Each new DNA molecule has two new strands."
   ],
   "answer": 0,
   "hint": "'Semi' means half. Half of what is kept?",
   "explain": "Each new double helix keeps (conserves) one old strand and builds one new strand."
  },
  {
   "id": "w4q12",
   "code": "BIO.B.1.2.1",
   "steels": "3.1.9-12.P",
   "prompt": "Why must DNA be copied before a cell divides?",
   "options": [
    "so each new cell gets a complete set of genetic instructions",
    "so the cell can make more ribosomes",
    "so each new cell gets half the DNA",
    "so mRNA can leave the nucleus"
   ],
   "answer": 0,
   "hint": "Both new cells need all the instructions.",
   "explain": "Replication makes two full copies, one for each daughter cell."
  },
  {
   "id": "w4q13",
   "code": "BIO.B.1.2.1",
   "steels": "3.1.9-12.P",
   "prompt": "Which bases pair together in DNA?",
   "options": [
    "adenine with thymine, and guanine with cytosine",
    "adenine with guanine, and cytosine with thymine",
    "adenine with uracil, and guanine with cytosine",
    "any base can pair with any other"
   ],
   "answer": 0,
   "hint": "Remember A-T and G-C.",
   "explain": "A pairs with T and G pairs with C. This base pairing makes exact copying possible."
  },
  {
   "id": "w4q14",
   "code": "BIO.B.1.2.2",
   "steels": "3.1.9-12.P",
   "prompt": "What is a gene?",
   "options": [
    "a section of DNA that codes for a protein",
    "a whole chromosome",
    "a type of cell",
    "a sugar in DNA"
   ],
   "answer": 0,
   "hint": "Genes are pieces of something bigger.",
   "explain": "A gene is a segment of DNA on a chromosome that codes for a protein, which affects a trait."
  },
  {
   "id": "w4q15",
   "code": "BIO.B.1.2.2",
   "steels": "3.1.9-12.P",
   "prompt": "What are alleles?",
   "options": [
    "different versions of the same gene",
    "two different chromosomes",
    "the proteins a gene makes",
    "cells made by meiosis"
   ],
   "answer": 0,
   "hint": "Think of flavors of one gene.",
   "explain": "Alleles are different forms of the same gene, such as purple or white flower color."
  },
  {
   "id": "w4q16",
   "code": "BIO.B.1.2.2",
   "steels": "3.1.9-12.P",
   "prompt": "Which statement best describes how DNA, genes, and chromosomes are related?",
   "options": [
    "Chromosomes are made of DNA, and genes are sections of that DNA.",
    "Genes are made of chromosomes.",
    "DNA is made of genes and proteins only.",
    "Chromosomes are found inside genes."
   ],
   "answer": 0,
   "hint": "Biggest to smallest: chromosome, gene, base.",
   "explain": "A chromosome is one long DNA molecule. Genes are sections along it."
  },
  {
   "id": "w4q17",
   "code": "BIO.B.1.2.2",
   "steels": "3.1.9-12.P",
   "prompt": "You inherit one chromosome of each pair from each parent. What does this mean for each of your genes?",
   "options": [
    "You have two alleles for each gene: one from each parent.",
    "You have one allele, from one parent only.",
    "You have four alleles for each gene.",
    "All your alleles come from your mother."
   ],
   "answer": 0,
   "hint": "Chromosomes come in pairs.",
   "explain": "Each chromosome pair carries two copies of each gene, one from each parent."
  },
  {
   "id": "w4q18",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "In pea plants, purple flowers (P) are dominant over white flowers (p). What is the phenotype of a Pp plant?",
   "options": [
    "purple flowers",
    "white flowers",
    "pink flowers",
    "purple and white spotted flowers"
   ],
   "answer": 0,
   "hint": "A dominant allele shows whenever it is present.",
   "explain": "One dominant P is enough, so the Pp plant has purple flowers."
  },
  {
   "id": "w4q19",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "Two Pp plants are crossed. What fraction of the offspring are expected to have white flowers (pp)?",
   "options": [
    "1/4",
    "1/2",
    "3/4",
    "0"
   ],
   "answer": 0,
   "hint": "Draw the Punnett square: PP, Pp, Pp, pp.",
   "explain": "Only one of the four boxes is pp, so 1/4 (25%) are expected to be white."
  },
  {
   "id": "w4q20",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "A red snapdragon is crossed with a white snapdragon, and all the offspring are pink. What pattern is this?",
   "options": [
    "incomplete dominance",
    "codominance",
    "sex-linked inheritance",
    "complete dominance"
   ],
   "answer": 0,
   "hint": "The phenotype is a blend.",
   "explain": "In incomplete dominance, heterozygotes show an in-between phenotype, like pink."
  },
  {
   "id": "w4q21",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "A person with type AB blood has both A and B markers on their red blood cells. What pattern is this?",
   "options": [
    "codominance",
    "incomplete dominance",
    "polygenic inheritance",
    "sex-linked inheritance"
   ],
   "answer": 0,
   "hint": "Both alleles show fully.",
   "explain": "In codominance, both alleles are expressed at the same time, so A and B markers both appear."
  },
  {
   "id": "w4q22",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "Why is red-green color blindness more common in males than in females?",
   "options": [
    "The gene is on the X chromosome, and males have only one X.",
    "The gene is on the Y chromosome only.",
    "Females cannot inherit recessive alleles.",
    "It is caused by a virus."
   ],
   "answer": 0,
   "hint": "Males are XY; females are XX.",
   "explain": "With only one X, a male shows a recessive X-linked allele. A female needs two copies."
  },
  {
   "id": "w4q23",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "Human height shows a smooth range from short to tall. This is because height is...",
   "options": [
    "controlled by many genes (polygenic)",
    "controlled by one dominant allele",
    "sex-linked",
    "codominant"
   ],
   "answer": 0,
   "hint": "A smooth range means many small effects added together.",
   "explain": "Polygenic traits are controlled by many genes, giving a continuous range of phenotypes."
  },
  {
   "id": "w4q24",
   "code": "BIO.B.2.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "During meiosis, homologous chromosomes swap matching pieces. What is this called?",
   "options": [
    "crossing over, which makes new combinations of alleles",
    "nondisjunction, which adds an extra chromosome",
    "replication, which copies DNA",
    "translocation, which destroys genes"
   ],
   "answer": 0,
   "hint": "The chromosomes cross and exchange segments.",
   "explain": "Crossing over shuffles alleles between homologous chromosomes, increasing genetic variation."
  },
  {
   "id": "w4q25",
   "code": "BIO.B.2.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "Down syndrome is usually caused by an extra copy of chromosome 21. Which error causes this?",
   "options": [
    "nondisjunction",
    "crossing over",
    "independent assortment",
    "translation"
   ],
   "answer": 0,
   "hint": "The chromosomes did not separate properly.",
   "explain": "Nondisjunction is when chromosomes fail to separate in meiosis, so a gamete gets an extra copy."
  },
  {
   "id": "w4q26",
   "code": "BIO.B.2.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "In meiosis, each chromosome pair separates independently of the other pairs. What does this produce?",
   "options": [
    "many different combinations of chromosomes in gametes",
    "identical gametes",
    "cells with no chromosomes",
    "an extra chromosome in every cell"
   ],
   "answer": 0,
   "hint": "This is called independent assortment.",
   "explain": "Independent assortment mixes which parent's chromosomes go into each gamete, creating variety."
  },
  {
   "id": "w4q27",
   "code": "BIO.B.2.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "A piece of chromosome 9 breaks off and attaches to chromosome 22. What kind of change is this?",
   "options": [
    "translocation",
    "deletion",
    "duplication",
    "nondisjunction"
   ],
   "answer": 0,
   "hint": "The piece moved to a different chromosome.",
   "explain": "A translocation moves a segment from one chromosome to a nonhomologous chromosome."
  },
  {
   "id": "w4q28",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "prompt": "A mutation changes one base, but the new codon still codes for the same amino acid. What happens to the protein?",
   "options": [
    "Nothing changes: it is a silent mutation.",
    "The reading frame shifts.",
    "The protein stops early.",
    "Every amino acid changes."
   ],
   "answer": 0,
   "hint": "Several codons can code for the same amino acid.",
   "explain": "A silent mutation changes the DNA but not the amino acid, so the protein is the same."
  },
  {
   "id": "w4q29",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "prompt": "Why is deleting one base usually more harmful than substituting one base?",
   "options": [
    "It shifts the reading frame, so every codon after it changes.",
    "It changes only one amino acid.",
    "It never affects the protein.",
    "It adds an extra chromosome."
   ],
   "answer": 0,
   "hint": "Codons are read three bases at a time.",
   "explain": "A deletion causes a frameshift: every codon after it is read wrong."
  },
  {
   "id": "w4q30",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "prompt": "Sickle cell disease is caused by one base substitution that changes one amino acid in hemoglobin. What type of mutation is this?",
   "options": [
    "a missense (point) mutation",
    "a frameshift mutation",
    "a nonsense mutation",
    "a chromosome duplication"
   ],
   "answer": 0,
   "hint": "One base swapped, one amino acid changed.",
   "explain": "A substitution that changes one amino acid is a missense mutation."
  },
  {
   "id": "w4q31",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "prompt": "Which of these can cause mutations in DNA?",
   "options": [
    "ultraviolet (UV) light from the Sun",
    "drinking water",
    "exercising",
    "sleeping"
   ],
   "answer": 0,
   "hint": "Mutagens damage DNA.",
   "explain": "UV light, X-rays, and some chemicals are mutagens that can damage DNA."
  },
  {
   "id": "w4q32",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "prompt": "A mutation in a skin cell will NOT be passed to a person's children. Why?",
   "options": [
    "Only mutations in gametes (sperm or egg) can be inherited.",
    "Skin cells have no DNA.",
    "Mutations always fix themselves.",
    "Children inherit only their mother's DNA."
   ],
   "answer": 0,
   "hint": "Which cells pass DNA to the next generation?",
   "explain": "Only mutations in sperm or egg cells are passed to offspring."
  },
  {
   "id": "w4q33",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "Scientists put the human insulin gene into bacteria. What is the main benefit?",
   "options": [
    "The bacteria make human insulin to treat diabetes.",
    "The bacteria turn into human cells.",
    "The bacteria stop reproducing.",
    "People no longer need a pancreas."
   ],
   "answer": 0,
   "hint": "Bacteria read the human gene and make its protein.",
   "explain": "Because the genetic code is universal, bacteria can make human insulin for people with diabetes."
  },
  {
   "id": "w4q34",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "Corn that carries a bacterial gene so it makes its own insect-killing protein is an example of...",
   "options": [
    "a genetically modified organism (GMO)",
    "selective breeding",
    "a clone",
    "natural selection"
   ],
   "answer": 0,
   "hint": "A gene was moved from one species into another.",
   "explain": "A GMO has DNA changed by genetic engineering, such as a gene added from another species."
  },
  {
   "id": "w4q35",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "Gene therapy tries to treat a genetic disease by...",
   "options": [
    "adding or fixing a working copy of a gene in the patient's cells",
    "removing all of the patient's DNA",
    "cloning the patient",
    "giving antibiotics"
   ],
   "answer": 0,
   "hint": "Fix the faulty instructions.",
   "explain": "Gene therapy delivers a working gene, or edits a faulty one, in a patient's cells."
  },
  {
   "id": "w4q36",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "How do forensic scientists use DNA fingerprinting?",
   "options": [
    "to compare DNA from a crime scene with DNA from suspects",
    "to change a suspect's DNA",
    "to clone a suspect",
    "to find only a person's blood type"
   ],
   "answer": 0,
   "hint": "Everyone's DNA pattern is unique (except identical twins).",
   "explain": "DNA fingerprinting compares DNA patterns to identify people or show relationships."
  },
  {
   "id": "w4q37",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "Breeders chose dogs with the traits they wanted and bred them for many generations. What is this called?",
   "options": [
    "selective breeding",
    "gene therapy",
    "genetic drift",
    "cloning"
   ],
   "answer": 0,
   "hint": "People, not nature, choose which animals reproduce.",
   "explain": "Selective (artificial) breeding uses chosen parents to increase wanted traits over generations."
  },
  {
   "id": "w4q38",
   "code": "BIO.B.2.2.1",
   "steels": "3.1.9-12.A",
   "prompt": "Review: a gene's DNA reads TAC. Which mRNA codon is transcribed from it?",
   "options": [
    "AUG",
    "ATG",
    "TAC",
    "UAC"
   ],
   "answer": 0,
   "hint": "In RNA, U replaces T. A pairs with U.",
   "explain": "T→A, A→U, C→G, so DNA TAC becomes the mRNA codon AUG (the start codon)."
  },
  {
   "id": "w4q39",
   "code": "BIO.B.2.2.1",
   "steels": "3.1.9-12.A",
   "prompt": "Review: where in the cell does translation (building a protein) happen?",
   "options": [
    "at a ribosome",
    "in the nucleus",
    "in the Golgi apparatus",
    "in the cell membrane"
   ],
   "answer": 0,
   "hint": "Which structure reads mRNA?",
   "explain": "Ribosomes read mRNA codons and join amino acids into a protein."
  },
  {
   "id": "w4q40",
   "code": "BIO.B.2.2.1",
   "steels": "3.1.9-12.A",
   "prompt": "Review: what does tRNA do during translation?",
   "options": [
    "brings the matching amino acid to the ribosome by reading each codon",
    "copies DNA into mRNA",
    "carries mRNA out of the nucleus",
    "joins the two strands of DNA"
   ],
   "answer": 0,
   "hint": "Each tRNA carries one amino acid.",
   "explain": "tRNA's anticodon matches an mRNA codon, and it delivers the right amino acid."
  },
  {
   "id": "w4q41",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "prompt": "A mutation inserts one extra base near the START of a gene. What is the most likely effect?",
   "options": [
    "Most of the protein's amino acids change (a frameshift).",
    "Only one amino acid changes.",
    "The protein is unchanged.",
    "The cell gains a chromosome."
   ],
   "answer": 0,
   "hint": "Every codon after the insertion is read in a new frame.",
   "explain": "An insertion shifts the reading frame, so almost every amino acid after it changes.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w4q42",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "A homozygous tall pea plant (TT) is crossed with a short plant (tt). What percent of the offspring will be tall?",
   "options": [
    "100%",
    "75%",
    "50%",
    "25%"
   ],
   "answer": 0,
   "hint": "Every offspring gets T from one parent and t from the other.",
   "explain": "All offspring are Tt, and tall is dominant, so 100% are tall.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w4q43",
   "code": "BIO.B.2.1.2",
   "steels": "3.1.9-12.Q",
   "prompt": "Which processes make each gamete genetically unique?",
   "options": [
    "crossing over and independent assortment during meiosis",
    "mitosis",
    "DNA replication alone",
    "cytokinesis"
   ],
   "answer": 0,
   "hint": "They shuffle alleles during meiosis.",
   "explain": "Crossing over and independent assortment mix alleles, so every gamete is different.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w4q44",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "prompt": "A sheep is cloned from a body cell of an adult sheep. How does the clone's DNA compare with the donor's?",
   "options": [
    "It is identical.",
    "It is half the same.",
    "It is completely different.",
    "The clone has no DNA."
   ],
   "answer": 0,
   "hint": "A clone is a genetic copy.",
   "explain": "A clone has the same DNA as the organism it was made from.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w4q45",
   "code": "BIO.B.1.2.2",
   "steels": "3.1.9-12.P",
   "prompt": "A mutation changes one gene. Which molecule is most directly made differently?",
   "options": [
    "the protein that gene codes for",
    "all of the cell's lipids",
    "the cell's water",
    "the phospholipids in the membrane"
   ],
   "answer": 0,
   "hint": "Genes are recipes for...",
   "explain": "A gene codes for a protein, so a mutation can change that protein and the trait it affects.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w4q46",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "prompt": "A woman who carries color blindness (XᴺXⁿ) has children with a man with normal vision (XᴺY). What is the chance that a SON is color-blind?",
   "options": [
    "1/2 (50%)",
    "0%",
    "1/4 (25%)",
    "100%"
   ],
   "answer": 0,
   "hint": "Sons get their X chromosome from their mother.",
   "explain": "Each son gets either Xᴺ or Xⁿ from his mother, so half of the sons are expected to be color-blind.",
   "tags": [
    "boss"
   ]
  }
 ],
 "pairs": [
  {
   "name": "Mitosis or meiosis?",
   "explain": "Mitosis makes two identical diploid body cells. Meiosis makes four genetically different haploid gametes.",
   "members": [
    {
     "label": "Mitosis",
     "level": "4-1",
     "ids": [
      "mit-mei.0",
      "mit-mei.2",
      "mit-mei.5",
      "w4q04"
     ]
    },
    {
     "label": "Meiosis",
     "level": "4-2",
     "ids": [
      "mit-mei.1",
      "mit-mei.3",
      "mit-mei.4",
      "w4q09"
     ]
    }
   ]
  },
  {
   "name": "Incomplete dominance or codominance?",
   "explain": "Incomplete dominance BLENDS (red + white = pink). Codominance shows BOTH (red and white hairs together).",
   "members": [
    {
     "label": "Incomplete dominance",
     "level": "4-4",
     "ids": [
      "pattern.0",
      "w4q20"
     ]
    },
    {
     "label": "Codominance",
     "level": "4-4",
     "ids": [
      "pattern.1",
      "pattern.5",
      "w4q21"
     ]
    }
   ]
  }
 ],
 "become": [
  {
   "id": "b-chromosomes",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "you": "a skin cell with 46 chromosomes, about to divide by mitosis",
   "short": "46",
   "color": "#ffb3a7",
   "goal": "Go through the door that shows your daughter cells.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Two cells, each with 46 chromosomes",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "Two cells, each with 23 chromosomes",
     "ok": false,
     "why": "Mitosis does not halve the chromosome number. Each new body cell keeps all 46."
    },
    {
     "kind": "vesicle",
     "label": "Four cells, each with 23 chromosomes",
     "ok": false,
     "why": "Four haploid cells come from meiosis, which makes gametes, not skin cells."
    }
   ],
   "explain": "Mitosis makes two identical diploid cells with the same 46 chromosomes as the parent cell."
  },
  {
   "id": "b-gamete",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "you": "a human egg cell made by meiosis",
   "short": "Egg",
   "color": "#ff9fbf",
   "goal": "Go through the door with your correct chromosome number.",
   "doors": [
    {
     "kind": "organelle",
     "label": "23 chromosomes (haploid)",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "46 chromosomes (diploid)",
     "ok": false,
     "why": "If eggs had 46, the baby would have 92 after fertilization. Gametes are haploid."
    },
    {
     "kind": "vesicle",
     "label": "92 chromosomes",
     "ok": false,
     "why": "Meiosis halves the chromosome number; it never doubles it."
    }
   ],
   "explain": "Meiosis halves the chromosome number, so human gametes have 23. Fertilization restores 46."
  },
  {
   "id": "b-punnett",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "you": "a pea seed whose parents are both Tt (tall)",
   "short": "Seed",
   "color": "#a8e07a",
   "goal": "Go through the door that shows your chance of being short (tt).",
   "doors": [
    {
     "kind": "flow",
     "label": "1 in 4 (25%)",
     "ok": true
    },
    {
     "kind": "organelle",
     "label": "1 in 2 (50%)",
     "ok": false,
     "why": "The Punnett square for Tt × Tt gives TT, Tt, Tt, tt. Only 1 of 4 boxes is tt."
    },
    {
     "kind": "vesicle",
     "label": "0%: tall parents only have tall offspring",
     "ok": false,
     "why": "Both parents carry a hidden t allele, so a tt offspring is possible."
    }
   ],
   "explain": "Tt × Tt gives 1 TT : 2 Tt : 1 tt, so each offspring has a 1 in 4 chance of being short."
  },
  {
   "id": "b-codominance",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "you": "a calf whose parents are a red bull (RR) and a white cow (WW). Coat color is codominant",
   "short": "Calf",
   "color": "#c8785a",
   "goal": "Go through the door that shows your coat.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Roan: red and white hairs mixed together",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "Pink: a blend of red and white",
     "ok": false,
     "why": "A blend is incomplete dominance. In codominance BOTH colors show."
    },
    {
     "kind": "vesicle",
     "label": "All red",
     "ok": false,
     "why": "Neither allele hides the other in codominance."
    }
   ],
   "explain": "In codominance both alleles are fully expressed, so an RW calf is roan: red and white hairs."
  },
  {
   "id": "b-frameshift",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "you": "a gene that reads THE CAT ATE THE RAT. One letter H is deleted",
   "short": "Gene",
   "color": "#c59cff",
   "goal": "Go through the door that shows what happens to the message.",
   "doors": [
    {
     "kind": "organelle",
     "label": "TEC ATA TET HER AT: every word after it is scrambled",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "Only one word changes",
     "ok": false,
     "why": "That is a substitution. A deletion shifts every three-letter word after it."
    },
    {
     "kind": "vesicle",
     "label": "Nothing changes",
     "ok": false,
     "why": "Removing a base changes how every codon after it is read."
    }
   ],
   "explain": "Deleting (or inserting) one base causes a frameshift: every codon after the mutation is read differently."
  }
 ],
 "catches": [
  {
   "id": "c-basepair",
   "code": "BIO.B.1.2.1",
   "steels": "3.1.9-12.P",
   "short": "Base pairing",
   "title": "Copy the DNA: grab the base that pairs with each highlighted base.",
   "cueLabel": "Base",
   "builtLabel": "New strand",
   "cueWord": "base",
   "tokenWord": "partner",
   "rule": "In DNA, A pairs with T and G pairs with C.",
   "choices": [
    "T",
    "A",
    "C",
    "G",
    "U",
    "Ribose"
   ],
   "steps": [
    {
     "cue": "A",
     "need": "T"
    },
    {
     "cue": "G",
     "need": "C"
    },
    {
     "cue": "T",
     "need": "A"
    },
    {
     "cue": "C",
     "need": "G"
    }
   ],
   "hint": "A goes with T. G goes with C.",
   "wrong": {
    "U": "Uracil (U) is found in RNA, not DNA.",
    "Ribose": "Ribose is the sugar in RNA. DNA's sugar is deoxyribose, and it is not a base."
   },
   "explain": "Base pairing (A-T, G-C) lets each old strand serve as a template for an exact copy."
  },
  {
   "id": "c-chromo",
   "code": "BIO.B.2.1.2",
   "steels": "3.1.9-12.Q",
   "short": "Chromosome changes",
   "title": "Name the chromosome change: grab the term that matches each event.",
   "cueLabel": "Event",
   "builtLabel": "Named",
   "cueWord": "event",
   "tokenWord": "term",
   "rule": "Chromosomes can swap, lose, gain, or move pieces.",
   "choices": [
    "Crossing over",
    "Nondisjunction",
    "Deletion",
    "Translocation",
    "Replication",
    "Cytokinesis"
   ],
   "steps": [
    {
     "cue": "Partner chromosomes swap matching pieces in meiosis",
     "need": "Crossing over"
    },
    {
     "cue": "Chromosomes fail to separate, so a gamete gets an extra copy",
     "need": "Nondisjunction"
    },
    {
     "cue": "A piece of a chromosome breaks off and is lost",
     "need": "Deletion"
    },
    {
     "cue": "A piece moves to a different, non-partner chromosome",
     "need": "Translocation"
    }
   ],
   "hint": "Was a piece swapped, lost, moved, or did whole chromosomes fail to separate?",
   "wrong": {
    "Replication": "Replication copies DNA. It does not change chromosome structure.",
    "Cytokinesis": "Cytokinesis divides the cytoplasm after mitosis or meiosis."
   },
   "explain": "Crossing over adds variety. Nondisjunction, deletions, and translocations change chromosome number or structure."
  },
  {
   "id": "c-blood",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "short": "Blood types",
   "title": "Match each genotype to its ABO blood type.",
   "cueLabel": "Genotype",
   "builtLabel": "Typed",
   "cueWord": "genotype",
   "tokenWord": "blood type",
   "rule": "Iᴬ and Iᴮ are codominant; both are dominant over i.",
   "choices": [
    "Type A",
    "Type B",
    "Type AB",
    "Type O",
    "Type C",
    "Type AO"
   ],
   "steps": [
    {
     "cue": "Iᴬi",
     "need": "Type A"
    },
    {
     "cue": "IᴮIᴮ",
     "need": "Type B"
    },
    {
     "cue": "IᴬIᴮ",
     "need": "Type AB"
    },
    {
     "cue": "ii",
     "need": "Type O"
    }
   ],
   "hint": "Iᴬ and Iᴮ both show if present. i shows only when there are two of it.",
   "wrong": {
    "Type C": "There is no type C. The ABO gene has three alleles: Iᴬ, Iᴮ, and i.",
    "Type AO": "AO is a genotype idea, not a blood type. Iᴬi is type A because i is recessive."
   },
   "explain": "ABO blood type shows multiple alleles and codominance: Iᴬ and Iᴮ both show, and i is recessive."
  },
  {
   "id": "c-mutation",
   "code": "BIO.B.2.3.1",
   "steels": "3.1.9-12.Q",
   "short": "Mutation types",
   "title": "Name the mutation: grab the type that matches each change.",
   "cueLabel": "Change",
   "builtLabel": "Named",
   "cueWord": "change",
   "tokenWord": "type",
   "rule": "Point mutations swap one base; insertions and deletions shift the reading frame.",
   "choices": [
    "Silent",
    "Missense",
    "Nonsense",
    "Frameshift",
    "Crossing over",
    "Replication"
   ],
   "steps": [
    {
     "cue": "One base swapped; the same amino acid is made",
     "need": "Silent"
    },
    {
     "cue": "One base swapped; a different amino acid is made",
     "need": "Missense"
    },
    {
     "cue": "One base swapped; an early STOP codon ends the protein",
     "need": "Nonsense"
    },
    {
     "cue": "One base added or removed; every codon after it changes",
     "need": "Frameshift"
    }
   ],
   "hint": "Was one base swapped, or was a base added or removed?",
   "wrong": {
    "Crossing over": "Crossing over is a normal swap between chromosomes in meiosis, not a gene mutation.",
    "Replication": "Replication copies DNA. Mistakes during it can cause mutations, but it is not a mutation type."
   },
   "explain": "Silent (no change), missense (one amino acid changes), nonsense (early stop), frameshift (every codon after it changes)."
  }
 ],
 "data": [
  {
   "id": "d-cycle",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "title": "Time a human cell spends in each part of a 24-hour cell cycle",
   "xlabel": "Part of the cell cycle",
   "ylabel": "Hours",
   "categories": [
    "G1 (growth)",
    "S (DNA copied)",
    "G2 (prepare)",
    "M (mitosis)"
   ],
   "values": [
    11,
    8,
    4,
    1
   ],
   "questions": [
    {
     "prompt": "Which part of the cell cycle takes the longest?",
     "answer": 0,
     "hint": "Find the tallest bar.",
     "explain": "G1 is the longest: the cell grows and does its normal work."
    },
    {
     "prompt": "In which part is the cell's DNA copied?",
     "answer": 1,
     "hint": "S stands for synthesis.",
     "explain": "DNA replication happens in the S phase of interphase."
    },
    {
     "prompt": "Which part is the SHORTEST?",
     "answer": 3,
     "hint": "Find the smallest bar.",
     "explain": "Mitosis takes only about an hour. Most of the cycle is interphase (G1, S, and G2)."
    }
   ]
  },
  {
   "id": "d-punnett",
   "code": "BIO.B.2.1.1",
   "steels": "3.1.9-12.R",
   "title": "Offspring of two Pp pea plants (purple P is dominant over white p)",
   "xlabel": "Genotype",
   "ylabel": "Number of offspring",
   "categories": [
    "PP",
    "Pp",
    "pp"
   ],
   "values": [
    26,
    49,
    25
   ],
   "questions": [
    {
     "prompt": "Which genotype was most common?",
     "answer": 1,
     "hint": "Find the tallest bar.",
     "explain": "About half the offspring were Pp, matching the 1:2:1 Punnett square prediction."
    },
    {
     "prompt": "Which genotype has WHITE flowers?",
     "answer": 2,
     "hint": "White shows only when there is no dominant P.",
     "explain": "Only pp plants are white: two recessive alleles."
    },
    {
     "prompt": "Which genotype is homozygous DOMINANT?",
     "answer": 0,
     "hint": "Homozygous means two of the same allele.",
     "explain": "PP has two dominant alleles: homozygous dominant."
    }
   ]
  }
 ],
 "mazes": [
  {
   "id": "maze-genes",
   "code": "BIO.B.1.2.2",
   "steels": "3.1.9-12.P",
   "title": "Zoom in: go through the doorway for the next smaller level",
   "start": "Pea plant",
   "steps": [
    {
     "label": "Cell",
     "hint": "The plant is made of these.",
     "why": "Every organism is made of cells."
    },
    {
     "label": "Nucleus",
     "hint": "Where is the DNA kept in a eukaryotic cell?",
     "why": "The nucleus holds the cell's chromosomes."
    },
    {
     "label": "Chromosome",
     "hint": "A long, coiled DNA molecule.",
     "why": "Each chromosome is one long DNA molecule wrapped around proteins."
    },
    {
     "label": "Gene",
     "hint": "A section of DNA that codes for a protein.",
     "why": "Genes are sections of DNA along a chromosome."
    }
   ],
   "extra": [
    "Ribosome",
    "Protein"
   ],
   "explain": "Organism, cell, nucleus, chromosome, gene: genes are sections of the DNA inside chromosomes."
  }
 ],
 "sequences": [
  {
   "id": "s-cellcycle",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "title": "Put the cell cycle in order",
   "steps": [
    "G1: the cell grows and does its job",
    "S: the cell copies its DNA",
    "G2: the cell gets ready to divide",
    "Mitosis and cytokinesis: the cell divides in two"
   ],
   "hint": "The DNA must be copied before the cell divides.",
   "explain": "Interphase (G1, S, G2) comes before mitosis and cytokinesis."
  },
  {
   "id": "s-mitosis",
   "code": "BIO.B.1.1.1",
   "steels": "3.1.9-12.D",
   "title": "Put the phases of mitosis in order",
   "steps": [
    "Prophase: chromosomes coil up and the nuclear membrane breaks down",
    "Metaphase: chromosomes line up in the middle",
    "Anaphase: sister chromatids are pulled apart",
    "Telophase: two new nuclei form"
   ],
   "hint": "Remember PMAT.",
   "explain": "Prophase, metaphase, anaphase, telophase (PMAT). Then cytokinesis splits the cell."
  },
  {
   "id": "s-meiosis",
   "code": "BIO.B.1.1.2",
   "steels": "3.1.9-12.Q",
   "title": "Put the main events of meiosis in order",
   "steps": [
    "Homologous chromosomes pair up and cross over",
    "Meiosis I: the homologous pairs separate",
    "Meiosis II: sister chromatids separate",
    "Four haploid gametes form, each one different"
   ],
   "hint": "The partner chromosomes separate before the sister chromatids do.",
   "explain": "Meiosis I separates homologous pairs; meiosis II separates sister chromatids, making four haploid cells."
  },
  {
   "id": "s-gmo",
   "code": "BIO.B.2.4.1",
   "steels": "3.1.9-12.P",
   "title": "Engineer bacteria to make human insulin",
   "steps": [
    "Cut the insulin gene out of human DNA with a restriction enzyme",
    "Insert the gene into a bacterial plasmid",
    "Bacteria take in the plasmid",
    "The bacteria multiply and make human insulin"
   ],
   "hint": "First get the gene, then put it in the bacteria.",
   "explain": "Genetic engineering moves a gene into a new organism. The universal genetic code lets bacteria read the human gene."
  }
 ],
 "wordbanks": [
  {
   "id": "wb-division",
   "steels": "3.1.9-12.D",
   "words": [
    "mitosis",
    "meiosis",
    "haploid",
    "diploid",
    "gametes",
    "allele"
   ],
   "sentences": [
    {
     "text": "Body cells divide by ___ to make two identical cells.",
     "answer": "mitosis",
     "code": "BIO.B.1.1.2",
     "explain": "Mitosis: growth and repair."
    },
    {
     "text": "Sperm and egg cells are made by ___.",
     "answer": "meiosis",
     "code": "BIO.B.1.1.2",
     "explain": "Meiosis makes gametes."
    },
    {
     "text": "A cell with one set of chromosomes (23 in humans) is ___.",
     "answer": "haploid",
     "code": "BIO.B.1.1.2",
     "explain": "Haploid: one set."
    },
    {
     "text": "A body cell with two sets of chromosomes (46 in humans) is ___.",
     "answer": "diploid",
     "code": "BIO.B.1.1.2",
     "explain": "Diploid: two sets, one from each parent."
    },
    {
     "text": "Sperm and eggs are called ___.",
     "answer": "gametes",
     "code": "BIO.B.1.1.2",
     "explain": "Gametes are sex cells."
    }
   ]
  },
  {
   "id": "wb-genetics",
   "steels": "3.1.9-12.R",
   "words": [
    "allele",
    "dominant",
    "recessive",
    "genotype",
    "phenotype",
    "mitosis"
   ],
   "sentences": [
    {
     "text": "A different version of a gene is an ___.",
     "answer": "allele",
     "code": "BIO.B.1.2.2",
     "explain": "Alleles are versions of the same gene."
    },
    {
     "text": "An allele that shows whenever it is present is ___.",
     "answer": "dominant",
     "code": "BIO.B.2.1.1",
     "explain": "Dominant alleles mask recessive ones."
    },
    {
     "text": "An allele that shows only when there are two copies is ___.",
     "answer": "recessive",
     "code": "BIO.B.2.1.1",
     "explain": "Recessive traits need two copies."
    },
    {
     "text": "The letters Pp describe an organism's ___.",
     "answer": "genotype",
     "code": "BIO.B.2.1.1",
     "explain": "Genotype: the alleles an organism has."
    },
    {
     "text": "Purple flowers describe a plant's ___.",
     "answer": "phenotype",
     "code": "BIO.B.2.1.1",
     "explain": "Phenotype: the trait you can observe."
    }
   ]
  }
 ],
 "lablocks": [
  {
   "id": "lock-4-3",
   "title": "Lab Lock",
   "clues": [
    {
     "prompt": "Clue 1: A Tt plant is crossed with a tt plant. Out of 4 offspring, how many are expected to be short (tt)?",
     "answer": 2,
     "code": "BIO.B.2.1.1",
     "hint": "Punnett square: Tt, Tt, tt, tt.",
     "explain": "Tt × tt gives 2 Tt and 2 tt, so 2 of 4 are expected to be short."
    },
    {
     "prompt": "Clue 2: How many different alleles does the human ABO blood type gene have?",
     "answer": 3,
     "code": "BIO.B.2.1.1",
     "hint": "Iᴬ, Iᴮ, and...",
     "explain": "Three alleles: Iᴬ, Iᴮ, and i. That is an example of multiple alleles."
    },
    {
     "prompt": "Clue 3: A cell with 4 chromosomes goes through meiosis. How many chromosomes are in each gamete?",
     "answer": 2,
     "code": "BIO.B.1.1.2",
     "hint": "Meiosis halves the number.",
     "explain": "Meiosis halves the chromosome number: 4 becomes 2."
    }
   ],
   "debrief": [
    "Clue 1 linked Punnett squares to probability: Tt × tt gives a 1:1 ratio.",
    "Clue 2 linked multiple alleles: a gene can have more than two versions in a population.",
    "Clue 3 linked meiosis: gametes have half the chromosome number."
   ]
  }
 ],
 "scans": [
  {
   "id": "s4-interphase",
   "name": "Growing cell",
   "look": "cell",
   "color": "#ffb3a7",
   "word": "Interphase",
   "def": "The part of the cell cycle when a cell grows, works, and copies its DNA.",
   "note": "Most of a cell's life is INTERPHASE: it grows (G1), copies its DNA (S), and gets ready to divide (G2)."
  },
  {
   "id": "s4-dna",
   "name": "Double helix",
   "look": "helix",
   "color": "#7fd4ff",
   "word": "DNA",
   "def": "The molecule that carries genetic information, shaped like a twisted ladder (double helix).",
   "note": "DNA's rungs are base pairs: A with T and G with C. Its order of bases spells out genes."
  },
  {
   "id": "s4-replication",
   "name": "Unzipping DNA",
   "look": "helix",
   "color": "#7be0ad",
   "word": "DNA replication",
   "def": "The process of copying DNA before a cell divides.",
   "note": "Enzymes unzip the helix and each strand is a template. Each new DNA keeps one old strand: semi-conservative REPLICATION."
  },
  {
   "id": "s4-chromosome",
   "name": "Chromosome",
   "look": "rod",
   "color": "#c59cff",
   "word": "Chromosome",
   "def": "A long, coiled DNA molecule that carries many genes.",
   "note": "Humans have 46 CHROMOSOMES in each body cell: 23 pairs."
  },
  {
   "id": "s4-chromatid",
   "name": "Copied chromosome",
   "look": "rod",
   "color": "#ff9fbf",
   "word": "Sister chromatids",
   "def": "The two identical copies of a chromosome, joined at the middle, after DNA is copied.",
   "note": "After replication, each chromosome is an X of two SISTER CHROMATIDS. Mitosis pulls them apart."
  },
  {
   "id": "s4-mitosis",
   "name": "Dividing cell",
   "look": "cell",
   "color": "#ffd166",
   "word": "Mitosis",
   "def": "Division of the nucleus that makes two identical nuclei, each with the same chromosome number.",
   "note": "MITOSIS has four phases: prophase, metaphase, anaphase, and telophase (PMAT)."
  },
  {
   "id": "s4-cytokinesis",
   "name": "Pinching cell",
   "look": "cell",
   "color": "#7be0ad",
   "word": "Cytokinesis",
   "def": "The division of the cytoplasm that splits one cell into two.",
   "note": "After mitosis, CYTOKINESIS pinches the cell in two. Plant cells build a new cell wall between them."
  },
  {
   "id": "s4-meiosis",
   "name": "Gamete factory",
   "look": "cell",
   "color": "#c59cff",
   "word": "Meiosis",
   "def": "Cell division that makes four haploid gametes, each genetically different.",
   "note": "MEIOSIS divides twice and halves the chromosome number, from 46 to 23 in humans."
  },
  {
   "id": "s4-gamete",
   "name": "Egg and sperm",
   "look": "eggs",
   "color": "#ff9fbf",
   "word": "Gamete",
   "def": "A sex cell (sperm or egg) with half the usual chromosome number.",
   "note": "Two GAMETES join at fertilization to make a zygote with a full set of chromosomes."
  },
  {
   "id": "s4-diploid",
   "name": "Paired set",
   "look": "rod",
   "color": "#7fd4ff",
   "word": "Diploid",
   "def": "Having two sets of chromosomes, one from each parent (2n).",
   "note": "Human body cells are DIPLOID: 46 chromosomes in 23 pairs."
  },
  {
   "id": "s4-haploid",
   "name": "Single set",
   "look": "rod",
   "color": "#ffd166",
   "word": "Haploid",
   "def": "Having one set of chromosomes (n).",
   "note": "Human gametes are HAPLOID: 23 chromosomes, one from each pair."
  },
  {
   "id": "s4-homolog",
   "name": "Chromosome partners",
   "look": "rod",
   "color": "#a8e07a",
   "word": "Homologous chromosomes",
   "def": "A pair of chromosomes, one from each parent, that carry the same genes.",
   "note": "HOMOLOGOUS CHROMOSOMES carry the same genes, but may carry different alleles."
  },
  {
   "id": "s4-crossover",
   "name": "Swapping arms",
   "look": "chain",
   "color": "#ff9f6e",
   "word": "Crossing over",
   "def": "The exchange of matching pieces between homologous chromosomes during meiosis.",
   "note": "CROSSING OVER makes new combinations of alleles, so every gamete is unique."
  },
  {
   "id": "s4-assort",
   "name": "Shuffled pairs",
   "look": "stack",
   "color": "#c59cff",
   "word": "Independent assortment",
   "def": "Chromosome pairs separate independently of each other during meiosis.",
   "note": "With 23 pairs lining up at random, INDEPENDENT ASSORTMENT can make over 8 million combinations."
  },
  {
   "id": "s4-nondisjunction",
   "name": "Extra chromosome",
   "look": "rod",
   "color": "#e85d5d",
   "word": "Nondisjunction",
   "def": "When chromosomes fail to separate during meiosis, so a gamete has too many or too few.",
   "note": "NONDISJUNCTION of chromosome 21 can cause Down syndrome (three copies of chromosome 21)."
  },
  {
   "id": "s4-gene",
   "name": "Gene",
   "look": "helix",
   "color": "#ffd166",
   "word": "Gene",
   "def": "A section of DNA that codes for a protein, which affects a trait.",
   "note": "A GENE is a stretch of DNA on a chromosome. The protein it codes for helps build a trait."
  },
  {
   "id": "s4-allele",
   "name": "Purple or white",
   "look": "stack",
   "color": "#c59cff",
   "word": "Allele",
   "def": "A different version of the same gene.",
   "note": "The flower-color gene in peas has two ALLELES: purple (P) and white (p)."
  },
  {
   "id": "s4-dominant",
   "name": "Purple pea flower",
   "look": "sprout",
   "color": "#a070e0",
   "word": "Dominant allele",
   "def": "An allele that shows its trait whenever it is present.",
   "note": "Purple (P) is DOMINANT: PP and Pp plants both have purple flowers."
  },
  {
   "id": "s4-recessive",
   "name": "White pea flower",
   "look": "sprout",
   "color": "#ffffff",
   "word": "Recessive allele",
   "def": "An allele that shows its trait only when two copies are present.",
   "note": "White (p) is RECESSIVE: only pp plants have white flowers."
  },
  {
   "id": "s4-genotype",
   "name": "Allele letters",
   "look": "chain",
   "color": "#7fd4ff",
   "word": "Genotype",
   "def": "The combination of alleles an organism has, such as Pp.",
   "note": "The GENOTYPE is the allele letters: PP, Pp, or pp."
  },
  {
   "id": "s4-phenotype",
   "name": "Flower color",
   "look": "sprout",
   "color": "#ff9fbf",
   "word": "Phenotype",
   "def": "The trait you can observe, such as purple flowers.",
   "note": "The PHENOTYPE is what shows: purple or white."
  },
  {
   "id": "s4-homozygous",
   "name": "Matching alleles",
   "look": "stack",
   "color": "#7be0ad",
   "word": "Homozygous",
   "def": "Having two identical alleles for a gene, such as PP or pp.",
   "note": "HOMO means same: PP and pp are HOMOZYGOUS."
  },
  {
   "id": "s4-heterozygous",
   "name": "Mixed alleles",
   "look": "stack",
   "color": "#ffd166",
   "word": "Heterozygous",
   "def": "Having two different alleles for a gene, such as Pp.",
   "note": "HETERO means different: Pp is HETEROZYGOUS (a carrier of the recessive allele)."
  },
  {
   "id": "s4-punnett",
   "name": "Punnett square",
   "look": "crystal",
   "color": "#7fd4ff",
   "word": "Punnett square",
   "def": "A grid used to predict the possible genotypes of offspring.",
   "note": "A PUNNETT SQUARE crossing Pp × Pp predicts 1 PP : 2 Pp : 1 pp."
  },
  {
   "id": "s4-incomplete",
   "name": "Pink snapdragon",
   "look": "sprout",
   "color": "#ff9fbf",
   "word": "Incomplete dominance",
   "def": "A pattern where the heterozygote shows a blend of the two traits.",
   "note": "Red × white snapdragons give pink offspring: INCOMPLETE DOMINANCE."
  },
  {
   "id": "s4-codominance",
   "name": "Roan calf",
   "look": "critter",
   "color": "#c8785a",
   "word": "Codominance",
   "def": "A pattern where both alleles are fully shown at the same time.",
   "note": "A roan calf has red hairs AND white hairs: CODOMINANCE."
  },
  {
   "id": "s4-multiple",
   "name": "Blood sample",
   "look": "drop",
   "color": "#e85d5d",
   "word": "Multiple alleles",
   "def": "A gene that has more than two alleles in a population.",
   "note": "The ABO blood type gene has three alleles (Iᴬ, Iᴮ, i): MULTIPLE ALLELES."
  },
  {
   "id": "s4-sexlinked",
   "name": "X chromosome",
   "look": "rod",
   "color": "#7fd4ff",
   "word": "Sex-linked trait",
   "def": "A trait whose gene is on a sex chromosome, usually the X.",
   "note": "Color blindness is SEX-LINKED: males (XY) show it with just one recessive allele."
  },
  {
   "id": "s4-polygenic",
   "name": "Range of heights",
   "look": "stack",
   "color": "#a8e07a",
   "word": "Polygenic trait",
   "def": "A trait controlled by many genes, showing a smooth range of phenotypes.",
   "note": "Height and skin color are POLYGENIC: many genes add up to a range of shades and sizes."
  },
  {
   "id": "s4-mutation",
   "name": "Changed DNA",
   "look": "helix",
   "color": "#e85d5d",
   "word": "Mutation",
   "def": "A change in the DNA sequence.",
   "note": "A MUTATION can be harmful, helpful, or have no effect, depending on how it changes the protein."
  },
  {
   "id": "s4-substitution",
   "name": "Swapped base",
   "look": "helix",
   "color": "#ffd166",
   "word": "Point mutation",
   "def": "A mutation that changes a single base.",
   "note": "A POINT MUTATION swaps one base. It may be silent, missense, or nonsense."
  },
  {
   "id": "s4-frameshift",
   "name": "Shifted code",
   "look": "chain",
   "color": "#ff9f6e",
   "word": "Frameshift mutation",
   "def": "An insertion or deletion of bases that shifts how every codon after it is read.",
   "note": "Codons are read in threes, so adding or removing one base causes a FRAMESHIFT."
  },
  {
   "id": "s4-mutagen",
   "name": "Ultraviolet light",
   "look": "sun",
   "color": "#c59cff",
   "word": "Mutagen",
   "def": "Something that can cause mutations, such as UV light, X-rays, or certain chemicals.",
   "note": "Sunscreen protects skin cells' DNA from UV light, a common MUTAGEN."
  },
  {
   "id": "s4-gmo",
   "name": "Pest-proof corn",
   "look": "sprout",
   "color": "#ffd166",
   "word": "Genetically modified organism (GMO)",
   "def": "An organism whose DNA has been changed using genetic engineering.",
   "note": "This corn carries a bacterial gene that makes an insect-killing protein: a GMO."
  },
  {
   "id": "s4-genetherapy",
   "name": "Repaired cell",
   "look": "cell",
   "color": "#7be0ad",
   "word": "Gene therapy",
   "def": "A treatment that adds or fixes a gene in a patient's cells.",
   "note": "GENE THERAPY delivers a working gene to treat some inherited diseases."
  },
  {
   "id": "s4-clone",
   "name": "Cloned sheep",
   "look": "critter",
   "color": "#f4f0e4",
   "word": "Clone",
   "def": "An organism with exactly the same DNA as the organism it was copied from.",
   "note": "Dolly the sheep (1996) was the first mammal CLONED from an adult body cell."
  },
  {
   "id": "s4-fingerprint",
   "name": "DNA bands",
   "look": "stack",
   "color": "#7fd4ff",
   "word": "DNA fingerprinting",
   "def": "Comparing patterns in DNA to identify individuals.",
   "note": "Forensic scientists use DNA FINGERPRINTING to match crime-scene DNA to a person."
  },
  {
   "id": "s4-selective",
   "name": "Dog breeds",
   "look": "critter",
   "color": "#c8a070",
   "word": "Selective breeding",
   "def": "Choosing parents with wanted traits to breed, generation after generation.",
   "note": "Every dog breed came from SELECTIVE BREEDING of wolves' descendants."
  }
 ],
 "vocab": [
  {
   "term": "Interphase",
   "def": "The part of the cell cycle when a cell grows, works, and copies its DNA."
  },
  {
   "term": "DNA",
   "def": "The molecule that carries genetic information, shaped like a twisted ladder (double helix)."
  },
  {
   "term": "DNA replication",
   "def": "The process of copying DNA before a cell divides."
  },
  {
   "term": "Chromosome",
   "def": "A long, coiled DNA molecule that carries many genes."
  },
  {
   "term": "Sister chromatids",
   "def": "The two identical copies of a chromosome, joined at the middle, after DNA is copied."
  },
  {
   "term": "Mitosis",
   "def": "Division of the nucleus that makes two identical nuclei, each with the same chromosome number."
  },
  {
   "term": "Cytokinesis",
   "def": "The division of the cytoplasm that splits one cell into two."
  },
  {
   "term": "Meiosis",
   "def": "Cell division that makes four haploid gametes, each genetically different."
  },
  {
   "term": "Gamete",
   "def": "A sex cell (sperm or egg) with half the usual chromosome number."
  },
  {
   "term": "Diploid",
   "def": "Having two sets of chromosomes, one from each parent (2n)."
  },
  {
   "term": "Haploid",
   "def": "Having one set of chromosomes (n)."
  },
  {
   "term": "Homologous chromosomes",
   "def": "A pair of chromosomes, one from each parent, that carry the same genes."
  },
  {
   "term": "Crossing over",
   "def": "The exchange of matching pieces between homologous chromosomes during meiosis."
  },
  {
   "term": "Independent assortment",
   "def": "Chromosome pairs separate independently of each other during meiosis."
  },
  {
   "term": "Nondisjunction",
   "def": "When chromosomes fail to separate during meiosis, so a gamete has too many or too few."
  },
  {
   "term": "Gene",
   "def": "A section of DNA that codes for a protein, which affects a trait."
  },
  {
   "term": "Allele",
   "def": "A different version of the same gene."
  },
  {
   "term": "Dominant allele",
   "def": "An allele that shows its trait whenever it is present."
  },
  {
   "term": "Recessive allele",
   "def": "An allele that shows its trait only when two copies are present."
  },
  {
   "term": "Genotype",
   "def": "The combination of alleles an organism has, such as Pp."
  },
  {
   "term": "Phenotype",
   "def": "The trait you can observe, such as purple flowers."
  },
  {
   "term": "Homozygous",
   "def": "Having two identical alleles for a gene, such as PP or pp."
  },
  {
   "term": "Heterozygous",
   "def": "Having two different alleles for a gene, such as Pp."
  },
  {
   "term": "Punnett square",
   "def": "A grid used to predict the possible genotypes of offspring."
  },
  {
   "term": "Incomplete dominance",
   "def": "A pattern where the heterozygote shows a blend of the two traits."
  },
  {
   "term": "Codominance",
   "def": "A pattern where both alleles are fully shown at the same time."
  },
  {
   "term": "Multiple alleles",
   "def": "A gene that has more than two alleles in a population."
  },
  {
   "term": "Sex-linked trait",
   "def": "A trait whose gene is on a sex chromosome, usually the X."
  },
  {
   "term": "Polygenic trait",
   "def": "A trait controlled by many genes, showing a smooth range of phenotypes."
  },
  {
   "term": "Mutation",
   "def": "A change in the DNA sequence."
  },
  {
   "term": "Point mutation",
   "def": "A mutation that changes a single base."
  },
  {
   "term": "Frameshift mutation",
   "def": "An insertion or deletion of bases that shifts how every codon after it is read."
  },
  {
   "term": "Mutagen",
   "def": "Something that can cause mutations, such as UV light, X-rays, or certain chemicals."
  },
  {
   "term": "Genetically modified organism (GMO)",
   "def": "An organism whose DNA has been changed using genetic engineering."
  },
  {
   "term": "Gene therapy",
   "def": "A treatment that adds or fixes a gene in a patient's cells."
  },
  {
   "term": "Clone",
   "def": "An organism with exactly the same DNA as the organism it was copied from."
  },
  {
   "term": "DNA fingerprinting",
   "def": "Comparing patterns in DNA to identify individuals."
  },
  {
   "term": "Selective breeding",
   "def": "Choosing parents with wanted traits to breed, generation after generation."
  }
 ]
});

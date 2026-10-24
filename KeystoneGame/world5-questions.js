/* WORLD 5 QUESTION FILE: Environmental Pressure Drives Evolution
   Teachers: you can edit the words inside the quotation marks below.
   - "code" is the Keystone Eligible Content code. "steels" is the PA STEELS standard.
   - In "questions", "answer" is the position of the correct option, counting from 0
     (0 = first option). The game shuffles the options, so the right answer can always go first.
   - "hint" shows after a wrong try. "explain" shows after the right answer.
   - "tags": ["boss"] marks boss-battle questions.
   - Keep every comma, bracket, and quotation mark in place. */
FieldGuide.registerQuestions(5, {
 "tokens": [
  {
   "id": "selection-needs",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "Collect only what natural selection NEEDS in order to work",
   "good": [
    "Variation in a trait",
    "Variation that is inherited",
    "More offspring than can survive",
    "Some traits help survival or reproduction",
    "Many generations of time"
   ],
   "bad": [
    {
     "text": "Animals choosing to change their genes",
     "explain": "Individuals cannot choose their genes. Selection acts on variation that already exists."
    },
    {
     "text": "Traits gained during life, like big muscles",
     "explain": "Acquired traits are not in the DNA of gametes, so they are not inherited."
    },
    {
     "text": "Every individual exactly alike",
     "explain": "With no variation, there is nothing for selection to act on."
    },
    {
     "text": "One animal evolving during its lifetime",
     "explain": "Individuals do not evolve. Populations evolve over generations."
    }
   ]
  }
 ],
 "sorts": [
  {
   "id": "isolation",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "Which kind of reproductive isolation is it?",
   "options": [
    "Geographic isolation",
    "Behavioral isolation",
    "Temporal isolation"
   ],
   "hint": "Geographic: a physical barrier. Behavioral: different courtship (songs, dances, signals). Temporal: different breeding times.",
   "items": [
    {
     "text": "Squirrels on the north and south rims of the Grand Canyon",
     "answer": 0,
     "explain": "The canyon is a physical barrier: geographic isolation."
    },
    {
     "text": "Two frog species in one pond breed in different months",
     "answer": 2,
     "explain": "Different breeding times: temporal isolation."
    },
    {
     "text": "Two meadowlark species sing different mating songs",
     "answer": 1,
     "explain": "Different courtship songs: behavioral isolation."
    },
    {
     "text": "Fish in two lakes with no river between them",
     "answer": 0,
     "explain": "Land separates the lakes: geographic isolation."
    },
    {
     "text": "Two firefly species flash different light patterns",
     "answer": 1,
     "explain": "Different courtship signals: behavioral isolation."
    },
    {
     "text": "Two pine species release pollen in different seasons",
     "answer": 2,
     "explain": "Different reproduction times: temporal isolation."
    }
   ]
  },
  {
   "id": "structures",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "What kind of structure is it?",
   "options": [
    "Homologous structure",
    "Analogous structure",
    "Vestigial structure"
   ],
   "hint": "Homologous: same bones, shared ancestor. Analogous: same job, different origins. Vestigial: reduced, with little or no use now.",
   "items": [
    {
     "text": "A human arm and a whale flipper",
     "answer": 0,
     "explain": "Same bones arranged the same way: homologous."
    },
    {
     "text": "A bird's wing and a butterfly's wing",
     "answer": 1,
     "explain": "Both are for flying but are built completely differently: analogous."
    },
    {
     "text": "The human tailbone (coccyx)",
     "answer": 2,
     "explain": "A reduced tail with little use: vestigial."
    },
    {
     "text": "A bat's wing and a cat's front leg",
     "answer": 0,
     "explain": "Same bone pattern from a shared mammal ancestor: homologous."
    },
    {
     "text": "A shark's fin and a dolphin's flipper",
     "answer": 1,
     "explain": "Similar shape for swimming, but a shark is a fish and a dolphin is a mammal: analogous."
    },
    {
     "text": "Tiny hip bones inside a whale",
     "answer": 2,
     "explain": "Leftover pelvis bones from land-living ancestors: vestigial."
    }
   ]
  },
  {
   "id": "science-terms",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "Which kind of scientific statement is it?",
   "options": [
    "Observation",
    "Inference",
    "Hypothesis",
    "Theory",
    "Law"
   ],
   "hint": "Observation: what you see or measure. Inference: a conclusion from evidence. Hypothesis: a testable prediction. Theory: a well-tested explanation of WHY. Law: a description of WHAT always happens.",
   "items": [
    {
     "text": "The fossil is 30 centimeters long.",
     "answer": 0,
     "explain": "A measurement is an observation."
    },
    {
     "text": "The fossil has fins, so the animal probably lived in water.",
     "answer": 1,
     "explain": "A conclusion drawn from evidence is an inference."
    },
    {
     "text": "If moths rest on dark bark, dark moths will survive better than light moths.",
     "answer": 2,
     "explain": "A testable if-then prediction is a hypothesis."
    },
    {
     "text": "All living things are made of cells (cell theory).",
     "answer": 3,
     "explain": "Cell theory is a well-tested explanation supported by huge amounts of evidence."
    },
    {
     "text": "Alleles separate into different gametes (Mendel's law of segregation).",
     "answer": 4,
     "explain": "A law describes a pattern that always happens."
    },
    {
     "text": "The thermometer reads 22 °C.",
     "answer": 0,
     "explain": "A reading from an instrument is an observation."
    },
    {
     "text": "Evolution by natural selection explains how life became so diverse.",
     "answer": 3,
     "explain": "Evolution is a scientific theory: a broad, well-supported explanation."
    }
   ]
  }
 ],
 "questions": [
  {
   "id": "w5q01",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "Which statement best describes natural selection?",
   "options": [
    "Individuals with traits suited to their environment survive and reproduce more, so those traits become more common.",
    "Organisms change their traits because they need to.",
    "Every individual has the same chance of surviving.",
    "Traits gained during life are passed to offspring."
   ],
   "answer": 0,
   "hint": "Who leaves the most offspring?",
   "explain": "Natural selection: inherited traits that help survival and reproduction become more common over generations."
  },
  {
   "id": "w5q02",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "When pollution darkened tree bark in England, dark peppered moths became more common. Why?",
   "options": [
    "Birds ate more of the easy-to-see light moths, so dark moths survived and reproduced more.",
    "Light moths turned dark to hide.",
    "Pollution changed the moths' DNA directly.",
    "Dark moths moved in from another country."
   ],
   "answer": 0,
   "hint": "Which moths could birds see?",
   "explain": "Dark moths were camouflaged on dark bark, so they survived and passed on the dark allele."
  },
  {
   "id": "w5q03",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "In evolution, what does 'fitness' mean?",
   "options": [
    "how well an organism survives and reproduces in its environment",
    "how strong or fast an organism is",
    "how much exercise an organism gets",
    "how big an organism is"
   ],
   "answer": 0,
   "hint": "Fitness is measured in offspring.",
   "explain": "Evolutionary fitness is about passing on alleles: surviving and reproducing."
  },
  {
   "id": "w5q04",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "A rabbit population has brown fur and white fur. Snow now covers the ground for longer each year. What is most likely to happen over many generations?",
   "options": [
    "The allele for white fur becomes more common.",
    "All the rabbits become brown.",
    "The rabbits choose to turn white.",
    "Allele frequencies stay exactly the same."
   ],
   "answer": 0,
   "hint": "Which rabbits are hidden from predators in snow?",
   "explain": "White rabbits are better camouflaged in snow, survive more, and pass on the white allele."
  },
  {
   "id": "w5q05",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "Why do we say populations evolve, not individuals?",
   "options": [
    "An individual cannot change its genes; the population's allele frequencies change over generations.",
    "Individuals evolve during their lifetime.",
    "Populations never change.",
    "Only one individual reproduces."
   ],
   "answer": 0,
   "hint": "Can one organism change its DNA on purpose?",
   "explain": "Evolution is a change in a population's allele frequencies across generations."
  },
  {
   "id": "w5q06",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "A few finches are blown to a new island and start a population whose allele frequencies differ from the mainland's. What is this called?",
   "options": [
    "the founder effect",
    "gene flow",
    "natural selection",
    "a bottleneck"
   ],
   "answer": 0,
   "hint": "A few 'founders' start the new group.",
   "explain": "The founder effect: a small group starts a new population carrying only some of the original alleles."
  },
  {
   "id": "w5q07",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "A flood randomly kills most of a small beetle population, no matter what traits they had. The change in allele frequency is an example of...",
   "options": [
    "genetic drift",
    "natural selection",
    "gene flow",
    "artificial selection"
   ],
   "answer": 0,
   "hint": "Survival was by chance, not by traits.",
   "explain": "Genetic drift is a random change in allele frequencies, strongest in small populations."
  },
  {
   "id": "w5q08",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "Squirrels on the north and south rims of the Grand Canyon cannot reach each other and have become different over time. What separated them?",
   "options": [
    "geographic isolation",
    "behavioral isolation",
    "temporal isolation",
    "gene flow"
   ],
   "answer": 0,
   "hint": "What is between the rims?",
   "explain": "A physical barrier like a canyon causes geographic isolation."
  },
  {
   "id": "w5q09",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "Two frog populations live in the same pond, but one breeds in early spring and the other in late spring. What keeps them from interbreeding?",
   "options": [
    "temporal isolation",
    "geographic isolation",
    "behavioral isolation",
    "genetic drift"
   ],
   "answer": 0,
   "hint": "'Tempo' is about time.",
   "explain": "Breeding at different times is temporal isolation."
  },
  {
   "id": "w5q10",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "Pollen from one wildflower population blows into another population and brings new alleles. What is this called?",
   "options": [
    "gene flow (migration)",
    "genetic drift",
    "the founder effect",
    "speciation"
   ],
   "answer": 0,
   "hint": "Alleles flow from one population into another.",
   "explain": "Gene flow moves alleles between populations and makes them more alike."
  },
  {
   "id": "w5q11",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "What usually has to happen for one species to split into two?",
   "options": [
    "The populations become reproductively isolated and change until they can no longer interbreed.",
    "The populations share more genes.",
    "One population goes extinct.",
    "Individuals decide to become a new species."
   ],
   "answer": 0,
   "hint": "Isolation first, then change.",
   "explain": "Speciation happens when isolated populations evolve differences that stop them from interbreeding."
  },
  {
   "id": "w5q12",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.T",
   "prompt": "What is the original source of all NEW alleles in a population?",
   "options": [
    "mutations in DNA",
    "natural selection",
    "the environment choosing traits",
    "gene flow alone"
   ],
   "answer": 0,
   "hint": "Selection can only choose among alleles that already exist.",
   "explain": "Mutations create new alleles. Selection and drift then change how common they are."
  },
  {
   "id": "w5q13",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.T",
   "prompt": "A mutation makes a bacterium resistant to an antibiotic. What happens when the antibiotic is used?",
   "options": [
    "The resistant bacteria survive and reproduce, so resistance spreads.",
    "All the bacteria die.",
    "The antibiotic makes every bacterium mutate.",
    "Resistance disappears."
   ],
   "answer": 0,
   "hint": "The antibiotic removes the bacteria that are NOT resistant.",
   "explain": "The mutation already existed. The antibiotic selects for it, so resistant bacteria take over."
  },
  {
   "id": "w5q14",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.T",
   "prompt": "Which mutations can be passed to offspring and affect evolution?",
   "options": [
    "mutations in gametes (sperm or egg cells)",
    "mutations in skin cells",
    "mutations in muscle cells",
    "any mutation in any cell"
   ],
   "answer": 0,
   "hint": "Which cells carry DNA to the next generation?",
   "explain": "Only mutations in gametes are inherited."
  },
  {
   "id": "w5q15",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.T",
   "prompt": "Besides mutation, which process creates new combinations of alleles in offspring?",
   "options": [
    "crossing over and independent assortment in meiosis",
    "mitosis",
    "cytokinesis",
    "photosynthesis"
   ],
   "answer": 0,
   "hint": "It shuffles alleles when gametes form.",
   "explain": "Meiosis shuffles alleles into new combinations, adding variation for selection to act on."
  },
  {
   "id": "w5q16",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.T",
   "prompt": "Which statement about mutations is true?",
   "options": [
    "Most are neutral or harmful, but a few are helpful in certain environments.",
    "They are always helpful.",
    "They are always deadly.",
    "They happen because an organism needs them."
   ],
   "answer": 0,
   "hint": "Mutations are random.",
   "explain": "Mutations are random changes. Whether one helps depends on the environment."
  },
  {
   "id": "w5q17",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "In undisturbed rock layers, where are the oldest fossils usually found?",
   "options": [
    "in the bottom layers",
    "in the top layers",
    "only in the middle layer",
    "anywhere: layer order means nothing"
   ],
   "answer": 0,
   "hint": "Layers pile up over time.",
   "explain": "The law of superposition: lower layers formed first, so they hold older fossils."
  },
  {
   "id": "w5q18",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "A human arm, a bat wing, and a whale flipper have the same set of bones. What does this suggest?",
   "options": [
    "They evolved from a common ancestor (homologous structures).",
    "They all do the same job.",
    "They evolved separately with no relationship.",
    "Bones never change."
   ],
   "answer": 0,
   "hint": "Same bones, different jobs.",
   "explain": "Homologous structures share a bone pattern inherited from a common ancestor."
  },
  {
   "id": "w5q19",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "A bird's wing and a butterfly's wing do the same job but are built very differently. These are...",
   "options": [
    "analogous structures",
    "homologous structures",
    "vestigial structures",
    "transitional fossils"
   ],
   "answer": 0,
   "hint": "Same job, different origins.",
   "explain": "Analogous structures have similar functions but evolved separately."
  },
  {
   "id": "w5q20",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "Humans have a tailbone (coccyx) with little or no use. What is it, and what does it suggest?",
   "options": [
    "a vestigial structure; humans share ancestors with tailed animals",
    "a homologous structure that is fully functional",
    "an analogous structure; humans never had tails",
    "a brand-new structure that is still forming"
   ],
   "answer": 0,
   "hint": "A leftover from ancestors.",
   "explain": "Vestigial structures are reduced remnants of structures that were useful in ancestors."
  },
  {
   "id": "w5q21",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "Human and chimpanzee cytochrome c proteins are identical, but yeast cytochrome c is very different. What does this suggest?",
   "options": [
    "Humans are more closely related to chimpanzees than to yeast.",
    "Humans and yeast are closely related.",
    "Proteins are not evidence of evolution.",
    "Chimpanzees came directly from yeast."
   ],
   "answer": 0,
   "hint": "Fewer differences means a more recent common ancestor.",
   "explain": "The more similar two species' DNA and proteins are, the more closely related they are."
  },
  {
   "id": "w5q22",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "Almost all living things use the same genetic code (the same codons for the same amino acids). Why is this evidence for evolution?",
   "options": [
    "It suggests all life shares a common ancestor.",
    "It shows all organisms are identical.",
    "It proves DNA never mutates.",
    "It means every organism makes the same proteins."
   ],
   "answer": 0,
   "hint": "Why would bacteria and humans share one code?",
   "explain": "A universal genetic code is best explained by descent from a common ancestor."
  },
  {
   "id": "w5q23",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "Tiktaalik is a fossil with features of both fish and four-legged land animals. It is an example of...",
   "options": [
    "a transitional fossil",
    "a vestigial structure",
    "an analogous structure",
    "a modern species"
   ],
   "answer": 0,
   "hint": "It is in between two groups.",
   "explain": "Transitional fossils show features of both an ancestral group and its descendants."
  },
  {
   "id": "w5q24",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "Which is an OBSERVATION?",
   "options": [
    "The finch's beak is 11 millimeters deep.",
    "The finch probably eats hard seeds.",
    "Finches with deep beaks will survive a drought better.",
    "Evolution explains finch beak shapes."
   ],
   "answer": 0,
   "hint": "An observation is something measured or seen directly.",
   "explain": "A measurement is an observation. The others are an inference, a hypothesis, and a theory."
  },
  {
   "id": "w5q25",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "Which is an INFERENCE?",
   "options": [
    "The fossil has fins, so the animal probably lived in water.",
    "The fossil is 30 centimeters long.",
    "The fossil was found in the bottom rock layer.",
    "The fossil has 12 vertebrae."
   ],
   "answer": 0,
   "hint": "An inference is a conclusion based on evidence.",
   "explain": "Concluding that the animal lived in water is an inference from the observation of fins."
  },
  {
   "id": "w5q26",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "What is the difference between a scientific law and a scientific theory?",
   "options": [
    "A law describes WHAT happens; a theory explains WHY or HOW it happens.",
    "A theory is a guess; a law is a proven fact.",
    "A theory becomes a law after enough testing.",
    "There is no difference."
   ],
   "answer": 0,
   "hint": "Laws describe; theories explain.",
   "explain": "Laws describe patterns in nature. Theories are well-tested explanations. A theory never 'graduates' into a law."
  },
  {
   "id": "w5q27",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "Which statement about a scientific HYPOTHESIS is true?",
   "options": [
    "It is a testable explanation or prediction.",
    "It can never be tested.",
    "It is the same as a theory.",
    "It is a proven fact."
   ],
   "answer": 0,
   "hint": "Scientists design experiments to test it.",
   "explain": "A hypothesis must be testable. Evidence can support it or show it is wrong."
  },
  {
   "id": "w5q28",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "Why is evolution called a scientific THEORY?",
   "options": [
    "It is a well-tested explanation supported by many lines of evidence.",
    "It is just a guess.",
    "It has never been tested.",
    "It describes one single experiment."
   ],
   "answer": 0,
   "hint": "In science, 'theory' is a high level of confidence.",
   "explain": "Fossils, anatomy, embryos, DNA, and direct observations all support the theory of evolution."
  },
  {
   "id": "w5q29",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "Over many generations, giraffes with longer necks reached more food and had more offspring. Which statement is correct?",
   "options": [
    "The allele for longer necks became more common in the population.",
    "Each giraffe stretched its neck and passed the longer neck on.",
    "Giraffes grew longer necks because they wanted to.",
    "Neck length is not inherited."
   ],
   "answer": 0,
   "hint": "Selection changes allele frequencies, not individuals.",
   "explain": "Giraffes with long-neck alleles left more offspring, so those alleles became more common.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w5q30",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "prompt": "Which situation is most likely to lead to a new species?",
   "options": [
    "A new river splits a population, and each group adapts to different conditions for thousands of years.",
    "Two populations keep interbreeding freely.",
    "One animal learns a new trick.",
    "A population stays in one unchanging place."
   ],
   "answer": 0,
   "hint": "Isolation plus time plus different pressures.",
   "explain": "Isolated populations under different pressures can evolve until they can no longer interbreed.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w5q31",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "prompt": "Which is the strongest evidence that whales evolved from land mammals?",
   "options": [
    "Fossil whales with small back legs, and tiny hip bones in living whales",
    "Whales live in the ocean",
    "Whales and sharks both have fins",
    "Whales are very large"
   ],
   "answer": 0,
   "hint": "Look for leftovers from land ancestors.",
   "explain": "Transitional fossils and vestigial hip bones point to four-legged ancestors.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w5q32",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.T",
   "prompt": "Why do brothers and sisters (except identical twins) look different from each other?",
   "options": [
    "Meiosis and fertilization create new combinations of alleles.",
    "They have completely different genes from their parents.",
    "Mitosis makes each child different.",
    "Children choose their traits."
   ],
   "answer": 0,
   "hint": "Each gamete gets a different mix.",
   "explain": "Crossing over, independent assortment, and random fertilization make each child's allele combination unique.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w5q33",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "prompt": "A student says, 'Evolution is only a theory, so it is just a guess.' What is the best response?",
   "options": [
    "In science, a theory is a well-supported explanation backed by a large body of evidence.",
    "The student is right: theories are guesses.",
    "Theories turn into laws after enough tests.",
    "Evolution is a law, not a theory."
   ],
   "answer": 0,
   "hint": "What does 'theory' mean in science?",
   "explain": "A scientific theory, like cell theory or the theory of evolution, is a well-tested, evidence-based explanation.",
   "tags": [
    "boss"
   ]
  },
  {
   "id": "w5q34",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "prompt": "Why does finishing a full course of antibiotics help slow antibiotic resistance?",
   "options": [
    "It kills even the somewhat resistant bacteria before they can multiply.",
    "It makes bacteria mutate less.",
    "It makes the bacteria choose not to resist.",
    "It makes the bacteria stronger."
   ],
   "answer": 0,
   "hint": "Stopping early leaves the toughest survivors.",
   "explain": "Stopping early lets the most resistant bacteria survive and reproduce, which selects for resistance.",
   "tags": [
    "boss"
   ]
  }
 ],
 "pairs": [
  {
   "name": "Homologous or analogous?",
   "explain": "Homologous structures share bones from a common ancestor but may do different jobs. Analogous structures do the same job but evolved separately.",
   "members": [
    {
     "label": "Homologous",
     "level": "5-4",
     "ids": [
      "structures.0",
      "structures.3",
      "w5q18"
     ]
    },
    {
     "label": "Analogous",
     "level": "5-4",
     "ids": [
      "structures.1",
      "structures.4",
      "w5q19"
     ]
    }
   ]
  },
  {
   "name": "Genetic drift or natural selection?",
   "explain": "Natural selection depends on traits that help survival. Genetic drift is random: survival by chance, not by traits.",
   "members": [
    {
     "label": "Natural selection",
     "level": "5-1",
     "ids": [
      "w5q02",
      "w5q04"
     ]
    },
    {
     "label": "Genetic drift",
     "level": "5-2",
     "ids": [
      "w5q07",
      "w5q06"
     ]
    }
   ]
  }
 ],
 "become": [
  {
   "id": "b-moth",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "you": "a peppered moth resting on soot-darkened tree bark in 1850s England",
   "short": "Moth",
   "color": "#5a5a5a",
   "goal": "Go through the door of the moth most likely to survive and have offspring.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Dark moth: hidden from birds on dark bark",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "Light moth: easy for birds to spot",
     "ok": false,
     "why": "On dark bark, light moths stand out, and birds eat them first."
    },
    {
     "kind": "vesicle",
     "label": "A moth that turns dark by trying hard",
     "ok": false,
     "why": "Moths cannot change their genes by effort. Selection acts on traits they already have."
    }
   ],
   "explain": "Dark moths survived and reproduced more, so the dark allele became more common: natural selection."
  },
  {
   "id": "b-bottleneck",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "you": "a northern elephant seal. Hunting in the 1800s left only a few dozen seals alive",
   "short": "Seal",
   "color": "#8a7a6a",
   "goal": "Go through the door that describes your population today, now that it has grown to over 100,000.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Very little genetic variation",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "Lots of genetic variation",
     "ok": false,
     "why": "The few survivors carried only a few alleles. Growing back in number does not bring lost alleles back."
    },
    {
     "kind": "vesicle",
     "label": "Every seal is an exact clone",
     "ok": false,
     "why": "Sexual reproduction still mixes alleles, but there are far fewer different alleles to mix."
    }
   ],
   "explain": "A bottleneck is a kind of genetic drift: a sudden crash in numbers leaves a population with little genetic variation."
  },
  {
   "id": "b-isolation",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "you": "a Kaibab squirrel on the north rim of the Grand Canyon",
   "short": "Squirrel",
   "color": "#a8785a",
   "goal": "Go through the door that explains why you never mate with the Abert's squirrels on the south rim.",
   "doors": [
    {
     "kind": "organelle",
     "label": "The canyon keeps the two populations apart",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "You breed in a different season",
     "ok": false,
     "why": "That would be temporal isolation. Here, a physical barrier separates the populations."
    },
    {
     "kind": "vesicle",
     "label": "Squirrels never mate with other squirrels",
     "ok": false,
     "why": "Squirrels mate within their own population. The canyon stops the two populations from meeting."
    }
   ],
   "explain": "The canyon is a geographic barrier. Isolated populations evolve separately, which can lead to new species."
  },
  {
   "id": "b-homolog",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "you": "a whale's flipper",
   "short": "Flipper",
   "color": "#62b6cb",
   "goal": "Find the structure built from the same bones as you.",
   "doors": [
    {
     "kind": "organelle",
     "label": "A human arm",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "A shark's fin",
     "ok": false,
     "why": "A shark's fin has a similar shape for swimming, but different structure: analogous, not homologous."
    },
    {
     "kind": "vesicle",
     "label": "A butterfly's wing",
     "ok": false,
     "why": "Insect wings have no bones at all. They are not homologous to a flipper."
    }
   ],
   "explain": "A whale flipper and a human arm share the same bone pattern from a common mammal ancestor: homologous structures."
  }
 ],
 "catches": [
  {
   "id": "c-mechanism",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "short": "Ways populations change",
   "title": "Name the cause: grab the process that changed each population.",
   "cueLabel": "Event",
   "builtLabel": "Named",
   "cueWord": "event",
   "tokenWord": "process",
   "rule": "Selection depends on traits; drift is random; gene flow moves alleles; mutation makes new ones.",
   "choices": [
    "Genetic drift",
    "Founder effect",
    "Gene flow",
    "Mutation",
    "Succession",
    "Photosynthesis"
   ],
   "steps": [
    {
     "cue": "A storm randomly kills most beetles, no matter their traits",
     "need": "Genetic drift"
    },
    {
     "cue": "A few birds blown to a new island start a population",
     "need": "Founder effect"
    },
    {
     "cue": "Pollen blows from one meadow into another population",
     "need": "Gene flow"
    },
    {
     "cue": "A copying error makes a brand-new allele",
     "need": "Mutation"
    }
   ],
   "hint": "Random? Few founders? Alleles moving in? Brand-new allele?",
   "wrong": {
    "Succession": "Succession is how a community changes after a disturbance, not how allele frequencies change.",
    "Photosynthesis": "Photosynthesis makes glucose. It does not change allele frequencies."
   },
   "explain": "Genetic drift, the founder effect, gene flow, and mutation all change a population's gene pool, along with natural selection."
  },
  {
   "id": "c-science",
   "code": "BIO.B.3.3.1",
   "steels": "Nature of Science (STEELS Science and Engineering Practices)",
   "short": "Science words",
   "title": "Name the statement: grab the type of scientific statement for each.",
   "cueLabel": "Statement",
   "builtLabel": "Named",
   "cueWord": "statement",
   "tokenWord": "type",
   "rule": "Observe, infer, predict, explain.",
   "choices": [
    "Observation",
    "Inference",
    "Hypothesis",
    "Theory",
    "Opinion",
    "Guess"
   ],
   "steps": [
    {
     "cue": "The finch's beak is 11 mm deep",
     "need": "Observation"
    },
    {
     "cue": "This finch probably cracks hard seeds",
     "need": "Inference"
    },
    {
     "cue": "If the drought continues, beaks will get deeper",
     "need": "Hypothesis"
    },
    {
     "cue": "A well-tested explanation of how species change",
     "need": "Theory"
    }
   ],
   "hint": "Measured? Concluded? A testable prediction? A big, well-supported explanation?",
   "wrong": {
    "Opinion": "An opinion is a personal belief, not a scientific statement that evidence can test.",
    "Guess": "Science statements are based on evidence. A scientific theory is never just a guess."
   },
   "explain": "Observations are measured; inferences are concluded; hypotheses are testable predictions; theories are well-supported explanations."
  }
 ],
 "data": [
  {
   "id": "d-finch",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "title": "Medium ground finches that survived a drought that left mostly large, hard seeds",
   "xlabel": "Beak depth",
   "ylabel": "Percent that survived",
   "categories": [
    "8 mm",
    "9 mm",
    "10 mm",
    "11 mm",
    "12 mm"
   ],
   "values": [
    10,
    20,
    35,
    55,
    70
   ],
   "questions": [
    {
     "prompt": "Which beak depth had the HIGHEST survival?",
     "answer": 4,
     "hint": "Find the tallest bar.",
     "explain": "Deep beaks crack large, hard seeds, so 12 mm finches survived best."
    },
    {
     "prompt": "Which beak depth had the LOWEST survival?",
     "answer": 0,
     "hint": "Find the shortest bar.",
     "explain": "Shallow beaks could not crack the hard seeds left after the drought."
    },
    {
     "prompt": "In which group did a little more than half of the finches survive?",
     "answer": 3,
     "hint": "Look for a bar just above 50.",
     "explain": "About 55% of 11 mm finches survived. Over generations, deeper beaks became more common."
    }
   ]
  },
  {
   "id": "d-resistance",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.U",
   "title": "Bacteria that resist an antibiotic, measured while the antibiotic is in use",
   "xlabel": "Day",
   "ylabel": "Percent resistant",
   "categories": [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5"
   ],
   "values": [
    2,
    10,
    35,
    70,
    95
   ],
   "questions": [
    {
     "prompt": "On which day were resistant bacteria the RAREST?",
     "answer": 0,
     "hint": "Find the shortest bar.",
     "explain": "At first only a few bacteria carried the resistance mutation."
    },
    {
     "prompt": "On which day did resistant bacteria first become MORE than half of the population?",
     "answer": 3,
     "hint": "Look for the first bar above 50.",
     "explain": "By Day 4, 70% were resistant: the antibiotic kept removing the others."
    },
    {
     "prompt": "On which day was the population almost entirely resistant?",
     "answer": 4,
     "hint": "Find the tallest bar.",
     "explain": "By Day 5, 95% were resistant. Natural selection favored the mutation."
    }
   ]
  },
  {
   "id": "d-cytochrome",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "title": "Amino acid differences between human cytochrome c and other organisms' cytochrome c",
   "xlabel": "Organism",
   "ylabel": "Number of differences",
   "categories": [
    "Chimpanzee",
    "Rhesus monkey",
    "Horse",
    "Chicken",
    "Yeast"
   ],
   "values": [
    0,
    1,
    12,
    13,
    44
   ],
   "questions": [
    {
     "prompt": "Which organism is MOST closely related to humans?",
     "answer": 0,
     "hint": "Fewest differences.",
     "explain": "Chimpanzee cytochrome c is identical to ours: we share a recent common ancestor."
    },
    {
     "prompt": "Which organism is LEAST closely related to humans?",
     "answer": 4,
     "hint": "Most differences.",
     "explain": "Yeast (a fungus) has 44 differences: our common ancestor lived very long ago."
    },
    {
     "prompt": "Which organism differs from humans by just one amino acid?",
     "answer": 1,
     "hint": "Look for the bar at 1.",
     "explain": "The rhesus monkey differs by one amino acid: another close primate relative."
    }
   ]
  }
 ],
 "mazes": [
  {
   "id": "maze-speciation",
   "code": "BIO.B.3.1.2",
   "steels": "3.1.9-12.X",
   "title": "How one species becomes two: go through the doorway for the next step",
   "start": "One squirrel population",
   "steps": [
    {
     "label": "A canyon splits the population",
     "hint": "What separates them first?",
     "why": "A geographic barrier separates the population into two groups."
    },
    {
     "label": "Each group faces different conditions",
     "hint": "Are both sides exactly the same?",
     "why": "Different food, predators, or climate on each side mean different selection pressures."
    },
    {
     "label": "Allele frequencies change in each group",
     "hint": "Selection, drift, and mutation act separately.",
     "why": "Each group's gene pool changes on its own."
    },
    {
     "label": "They can no longer interbreed: two species",
     "hint": "What finally makes them separate species?",
     "why": "When they can no longer interbreed and produce fertile offspring, they are separate species."
    }
   ],
   "extra": [
    "They blend back into one",
    "Nothing changes"
   ],
   "explain": "Speciation: isolation, different pressures, changing allele frequencies, and finally reproductive isolation."
  }
 ],
 "sequences": [
  {
   "id": "s-selection",
   "code": "BIO.B.3.1.1",
   "steels": "3.1.9-12.W",
   "title": "Put the steps of natural selection in order",
   "steps": [
    "Individuals vary, and much of that variation is inherited",
    "More offspring are born than can survive",
    "Individuals with helpful traits survive and reproduce more",
    "Over generations, the helpful alleles become more common"
   ],
   "hint": "It starts with variation.",
   "explain": "Variation, overproduction, differential survival and reproduction, then a change in allele frequencies."
  },
  {
   "id": "s-resistance",
   "code": "BIO.B.3.1.3",
   "steels": "3.1.9-12.U",
   "title": "How antibiotic resistance spreads",
   "steps": [
    "A random mutation makes a few bacteria resistant",
    "The antibiotic kills most bacteria that are not resistant",
    "The resistant bacteria survive and reproduce",
    "Soon most of the population is resistant"
   ],
   "hint": "The mutation comes first, before the antibiotic.",
   "explain": "The antibiotic does not cause the mutation. It selects for resistant bacteria that already existed."
  },
  {
   "id": "s-layers",
   "code": "BIO.B.3.2.1",
   "steels": "3.1.9-12.S",
   "title": "Order the fossils from OLDEST (bottom layer) to YOUNGEST (top layer)",
   "steps": [
    "Trilobites (bottom layer)",
    "Early jawless fishes",
    "Dinosaurs",
    "Woolly mammoths (top layer)"
   ],
   "hint": "Lower layers formed first.",
   "explain": "The law of superposition: in undisturbed layers, the deepest fossils are the oldest."
  }
 ],
 "wordbanks": [
  {
   "id": "wb-selection",
   "steels": "3.1.9-12.W",
   "words": [
    "variation",
    "adaptation",
    "fitness",
    "natural selection",
    "selection pressure",
    "genetic drift"
   ],
   "sentences": [
    {
     "text": "Differences among individuals in a population are called ___.",
     "answer": "variation",
     "code": "BIO.B.3.1.3",
     "explain": "Variation is the raw material for evolution."
    },
    {
     "text": "An inherited trait that helps an organism survive and reproduce is an ___.",
     "answer": "adaptation",
     "code": "BIO.B.3.1.1",
     "explain": "Adaptations, like camouflage, help organisms survive."
    },
    {
     "text": "How well an organism survives and reproduces is its ___.",
     "answer": "fitness",
     "code": "BIO.B.3.1.1",
     "explain": "Fitness is measured in offspring."
    },
    {
     "text": "Better-suited individuals leaving more offspring is ___.",
     "answer": "natural selection",
     "code": "BIO.B.3.1.1",
     "explain": "Natural selection changes allele frequencies over generations."
    },
    {
     "text": "A drought that makes hard seeds the only food is a ___.",
     "answer": "selection pressure",
     "code": "BIO.B.3.1.1",
     "explain": "Selection pressures decide which traits are helpful."
    }
   ]
  },
  {
   "id": "wb-speciation",
   "steels": "3.1.9-12.X",
   "words": [
    "species",
    "speciation",
    "reproductive isolation",
    "extinction",
    "gene pool",
    "mutation"
   ],
   "sentences": [
    {
     "text": "A group that can interbreed and have fertile offspring is a ___.",
     "answer": "species",
     "code": "BIO.B.3.1.2",
     "explain": "Members of a species can interbreed in nature."
    },
    {
     "text": "The formation of a new species is called ___.",
     "answer": "speciation",
     "code": "BIO.B.3.1.2",
     "explain": "Speciation often follows isolation."
    },
    {
     "text": "When populations can no longer interbreed, there is ___.",
     "answer": "reproductive isolation",
     "code": "BIO.B.3.1.2",
     "explain": "Barriers can be geographic, behavioral, or temporal."
    },
    {
     "text": "When every member of a species dies, the species has gone through ___.",
     "answer": "extinction",
     "code": "BIO.B.3.1.2",
     "explain": "Most species that ever lived are now extinct."
    },
    {
     "text": "All the alleles in a population make up its ___.",
     "answer": "gene pool",
     "code": "BIO.B.3.1.2",
     "explain": "Evolution changes the gene pool over time."
    }
   ]
  },
  {
   "id": "wb-science",
   "steels": "3.1.9-12.S",
   "words": [
    "observation",
    "inference",
    "hypothesis",
    "theory",
    "law",
    "adaptation"
   ],
   "sentences": [
    {
     "text": "Measuring a beak with a ruler is an ___.",
     "answer": "observation",
     "code": "BIO.B.3.3.1",
     "explain": "Observations come from the senses or instruments."
    },
    {
     "text": "A conclusion based on evidence, like 'it probably swam', is an ___.",
     "answer": "inference",
     "code": "BIO.B.3.3.1",
     "explain": "Inferences explain observations."
    },
    {
     "text": "A testable prediction is a ___.",
     "answer": "hypothesis",
     "code": "BIO.B.3.3.1",
     "explain": "Hypotheses can be supported or refuted by evidence."
    },
    {
     "text": "A broad, well-tested explanation like cell theory or evolution is a scientific ___.",
     "answer": "theory",
     "code": "BIO.B.3.3.1",
     "explain": "Theories explain WHY."
    },
    {
     "text": "A statement that describes what always happens, like Mendel's law of segregation, is a ___.",
     "answer": "law",
     "code": "BIO.B.3.3.1",
     "explain": "Laws describe WHAT happens."
    }
   ]
  }
 ],
 "lablocks": [
  {
   "id": "lock-5-4",
   "title": "Lab Lock",
   "clues": [
    {
     "prompt": "Clue 1: A cliff has 5 undisturbed rock layers. Counting from the TOP as layer 1, which layer holds the oldest fossils?",
     "answer": 5,
     "code": "BIO.B.3.2.1",
     "hint": "The deepest layer formed first.",
     "explain": "Layer 5, the bottom layer, is the oldest (law of superposition)."
    },
    {
     "prompt": "Clue 2: How many of these are homologous to a human arm? Bat wing, whale flipper, cat leg, butterfly wing.",
     "answer": 3,
     "code": "BIO.B.3.2.1",
     "hint": "Which ones have the same bones?",
     "explain": "Bat wing, whale flipper, and cat leg share our arm bones (3). Butterfly wings have no bones."
    },
    {
     "prompt": "Clue 3: How many organisms on the graph differ from humans by FEWER than 13 amino acids?",
     "answer": 3,
     "code": "BIO.B.3.2.1",
     "figure": {
      "type": "bars",
      "categories": [
       "Chimp",
       "Rhesus",
       "Horse",
       "Chicken",
       "Yeast"
      ],
      "values": [
       0,
       1,
       12,
       13,
       44
      ],
      "ylabel": "Differences"
     },
     "hint": "Count the bars below 13.",
     "explain": "Chimpanzee (0), rhesus monkey (1), and horse (12): 3 organisms."
    }
   ],
   "debrief": [
    "Clue 1 linked fossils to time: deeper layers are older.",
    "Clue 2 linked anatomy to ancestry: homologous structures share bones from a common ancestor.",
    "Clue 3 linked biochemistry to relationships: fewer protein differences means closer relatives."
   ]
  }
 ],
 "scans": [
  {
   "id": "s5-variation",
   "name": "Finch flock",
   "look": "critter",
   "color": "#a08060",
   "word": "Variation",
   "def": "Differences in traits among individuals of the same species.",
   "note": "These finches' beaks differ in size and shape. Without VARIATION, natural selection would have nothing to act on."
  },
  {
   "id": "s5-adaptation",
   "name": "Cactus finch",
   "look": "critter",
   "color": "#7a5a3a",
   "word": "Adaptation",
   "def": "An inherited trait that helps an organism survive and reproduce in its environment.",
   "note": "This finch's long, pointed beak reaches into cactus flowers: an ADAPTATION for its food."
  },
  {
   "id": "s5-fitness",
   "name": "Nest of chicks",
   "look": "eggs",
   "color": "#f4f0e4",
   "word": "Fitness",
   "def": "An organism's ability to survive and reproduce in its environment.",
   "note": "FITNESS is counted in offspring: the parent of this nest is passing on its alleles."
  },
  {
   "id": "s5-pressure",
   "name": "Dry season",
   "look": "sun",
   "color": "#ffb070",
   "word": "Selection pressure",
   "def": "A factor in the environment, like drought or predators, that affects which individuals survive.",
   "note": "A drought is a SELECTION PRESSURE: only finches that can crack the remaining hard seeds survive."
  },
  {
   "id": "s5-selection",
   "name": "Survivors",
   "look": "stack",
   "color": "#7be0ad",
   "word": "Natural selection",
   "def": "The process by which individuals with helpful inherited traits survive and reproduce more.",
   "note": "NATURAL SELECTION was explained by Charles Darwin and Alfred Russel Wallace in 1858."
  },
  {
   "id": "s5-camouflage",
   "name": "Peppered moth",
   "look": "critter",
   "color": "#5a5a5a",
   "word": "Camouflage",
   "def": "Coloring or shape that helps an organism blend into its surroundings.",
   "note": "Dark moths hid on soot-darkened bark. CAMOUFLAGE is an adaptation that protects prey from predators."
  },
  {
   "id": "s5-darwin",
   "name": "Giant tortoise",
   "look": "turtle",
   "color": "#7a6a4a",
   "word": "Common descent",
   "def": "The idea that all living things are related through shared ancestors.",
   "note": "Tortoises differ from island to island. Darwin's 1835 visit to the Galápagos helped him reason that species share COMMON ANCESTORS."
  },
  {
   "id": "s5-genepool",
   "name": "Gene pool",
   "look": "chain",
   "color": "#c59cff",
   "word": "Gene pool",
   "def": "All the alleles of all the genes in a population.",
   "note": "Evolution is a change in the GENE POOL: some alleles become more common, others rarer."
  },
  {
   "id": "s5-frequency",
   "name": "Allele counter",
   "look": "stack",
   "color": "#7fd4ff",
   "word": "Allele frequency",
   "def": "How common an allele is in a population, often written as a percent.",
   "note": "If 30 of 100 alleles for beak size are 'deep', the ALLELE FREQUENCY of 'deep' is 30%."
  },
  {
   "id": "s5-newallele",
   "name": "Mutated DNA",
   "look": "helix",
   "color": "#e85d5d",
   "word": "Mutation (source of variation)",
   "def": "A change in DNA; the original source of new alleles.",
   "note": "MUTATIONS are random. Most do little, but a few create alleles that selection can favor."
  },
  {
   "id": "s5-drift",
   "name": "Lucky survivors",
   "look": "eggs",
   "color": "#ffd166",
   "word": "Genetic drift",
   "def": "A random change in allele frequencies, strongest in small populations.",
   "note": "When chance, not traits, decides who survives, that is GENETIC DRIFT."
  },
  {
   "id": "s5-founder",
   "name": "Island castaways",
   "look": "turtle",
   "color": "#a8c87a",
   "word": "Founder effect",
   "def": "Genetic drift that happens when a few individuals start a new population.",
   "note": "A few animals rafting to a new island carry only some alleles: the FOUNDER EFFECT."
  },
  {
   "id": "s5-bottleneck",
   "name": "Elephant seal",
   "look": "critter",
   "color": "#8a7a6a",
   "word": "Bottleneck effect",
   "def": "Genetic drift that happens when a population is suddenly cut to a small number.",
   "note": "Hunting cut northern elephant seals to a few dozen. Their gene pool still shows the BOTTLENECK."
  },
  {
   "id": "s5-geneflow",
   "name": "Traveling pollen",
   "look": "sprout",
   "color": "#ffd166",
   "word": "Gene flow",
   "def": "The movement of alleles between populations, through migration or carried pollen.",
   "note": "GENE FLOW keeps populations alike. Stopping it is often the first step toward a new species."
  },
  {
   "id": "s5-resist",
   "name": "Resistant bacteria",
   "look": "cell",
   "color": "#ff9f6e",
   "word": "Antibiotic resistance",
   "def": "The ability of some bacteria to survive an antibiotic, spread by natural selection.",
   "note": "Overusing antibiotics selects for RESISTANT bacteria. That is evolution happening right now."
  },
  {
   "id": "s5-species",
   "name": "Two squirrels",
   "look": "critter",
   "color": "#a8785a",
   "word": "Species",
   "def": "A group of organisms that can interbreed in nature and produce fertile offspring.",
   "note": "Kaibab and Abert's squirrels look alike, but the canyon keeps them apart. Are they becoming separate SPECIES?"
  },
  {
   "id": "s5-geographic",
   "name": "Canyon wall",
   "look": "rock",
   "color": "#c8784a",
   "word": "Geographic isolation",
   "def": "Separation of populations by a physical barrier, such as a canyon, river, or mountain.",
   "note": "The Grand Canyon is a barrier: GEOGRAPHIC ISOLATION."
  },
  {
   "id": "s5-behavioral",
   "name": "Singing meadowlark",
   "look": "critter",
   "color": "#ffd166",
   "word": "Behavioral isolation",
   "def": "Populations do not interbreed because of different courtship behaviors.",
   "note": "Eastern and western meadowlarks look alike but sing different songs: BEHAVIORAL ISOLATION."
  },
  {
   "id": "s5-temporal",
   "name": "Spring blossoms",
   "look": "sprout",
   "color": "#ff9fbf",
   "word": "Temporal isolation",
   "def": "Populations do not interbreed because they reproduce at different times.",
   "note": "Plants that flower in different months cannot pollinate each other: TEMPORAL ISOLATION."
  },
  {
   "id": "s5-speciation",
   "name": "Branching tree",
   "look": "stack",
   "color": "#7be0ad",
   "word": "Speciation",
   "def": "The formation of a new species.",
   "note": "SPECIATION happens when isolated populations evolve until they can no longer interbreed."
  },
  {
   "id": "s5-radiation",
   "name": "Many finches",
   "look": "critter",
   "color": "#a08060",
   "word": "Adaptive radiation",
   "def": "One ancestral species evolving into many species that fill different niches.",
   "note": "Darwin's finches spread into many niches: seed-crackers, insect-eaters, cactus-feeders. That is ADAPTIVE RADIATION."
  },
  {
   "id": "s5-extinct",
   "name": "Mammoth tusk",
   "look": "rock",
   "color": "#e8e0c8",
   "word": "Extinction",
   "def": "The death of every member of a species.",
   "note": "Woolly mammoths are EXTINCT. Most species that ever lived on Earth are now extinct."
  },
  {
   "id": "s5-fossil",
   "name": "Ammonite fossil",
   "look": "rock",
   "color": "#c8a070",
   "word": "Fossil",
   "def": "The preserved remains or traces of an organism that lived long ago.",
   "note": "FOSSILS show what ancient life looked like and how it changed over time."
  },
  {
   "id": "s5-layers",
   "name": "Rock layers",
   "look": "stack",
   "color": "#c8784a",
   "word": "Law of superposition",
   "def": "In undisturbed rock layers, lower layers are older than the layers above them.",
   "note": "Read the cliff from the bottom up: older to younger. That is the LAW OF SUPERPOSITION."
  },
  {
   "id": "s5-transitional",
   "name": "Tiktaalik",
   "look": "rock",
   "color": "#8a9a7a",
   "word": "Transitional fossil",
   "def": "A fossil with features of both an ancestral group and its descendants.",
   "note": "Tiktaalik had gills and scales like a fish, but a neck and sturdy fins like early four-legged animals: a TRANSITIONAL FOSSIL."
  },
  {
   "id": "s5-homologous",
   "name": "Forelimb bones",
   "look": "critter",
   "color": "#f4f0e4",
   "word": "Homologous structures",
   "def": "Structures with the same basic bones, inherited from a common ancestor, even if they do different jobs.",
   "note": "Your arm, a bat's wing, and a whale's flipper have the same bones: HOMOLOGOUS STRUCTURES."
  },
  {
   "id": "s5-analogous",
   "name": "Insect wing",
   "look": "critter",
   "color": "#7fd4ff",
   "word": "Analogous structures",
   "def": "Structures that do the same job but evolved separately and are built differently.",
   "note": "Butterfly wings and bird wings both fly, but are built differently: ANALOGOUS STRUCTURES."
  },
  {
   "id": "s5-vestigial",
   "name": "Whale hip bones",
   "look": "rock",
   "color": "#e8e0c8",
   "word": "Vestigial structure",
   "def": "A reduced structure with little or no use that was useful in an ancestor.",
   "note": "Whales have tiny hip bones left over from land-walking ancestors: a VESTIGIAL STRUCTURE."
  },
  {
   "id": "s5-embryo",
   "name": "Early embryos",
   "look": "eggs",
   "color": "#ffb3a7",
   "word": "Embryology",
   "def": "The study of how organisms develop before birth; similar early stages suggest shared ancestry.",
   "note": "Early fish, chicken, and human embryos all have a tail and throat pouches. EMBRYOLOGY reveals shared ancestry."
  },
  {
   "id": "s5-molecular",
   "name": "DNA comparison",
   "look": "helix",
   "color": "#c59cff",
   "word": "Molecular evidence",
   "def": "Similarities in DNA and protein sequences that show how closely species are related.",
   "note": "Human and chimpanzee DNA are about 98% alike. MOLECULAR EVIDENCE shows we share a recent ancestor."
  },
  {
   "id": "s5-code",
   "name": "Universal code",
   "look": "chain",
   "color": "#7be0ad",
   "word": "Universal genetic code",
   "def": "Nearly all organisms use the same codons for the same amino acids.",
   "note": "The codon AUG means 'start' in bacteria, oak trees, and you. A UNIVERSAL GENETIC CODE points to one common ancestor."
  },
  {
   "id": "s5r-mammoth",
   "name": "Woolly mammoth tusk",
   "look": "rock",
   "color": "#f0e6d0",
   "word": "Youngest layer",
   "def": "Rock and ice near the top hold the most recent fossils.",
   "note": "Woolly mammoths lived in the last Ice Age. Some have been found frozen in Siberian permafrost. Near the top means YOUNG: only thousands of years old."
  },
  {
   "id": "s5r-ambulo",
   "name": "Ambulocetus fossil",
   "look": "critter",
   "color": "#c8b08a",
   "word": "Walking whale",
   "def": "Ambulocetus, about 49 million years old, found in Pakistan.",
   "note": "Ambulocetus had legs and webbed feet but a whale-like skull and ears. It is a TRANSITIONAL FOSSIL between land mammals and whales."
  },
  {
   "id": "s5r-dino",
   "name": "T. rex skull",
   "look": "rock",
   "color": "#9a7a5a",
   "word": "Deeper means older",
   "def": "T. rex lived about 68 to 66 million years ago. Many were dug up in Montana's Hell Creek rocks.",
   "note": "No human or mammoth fossil is ever found in the same layer as T. rex. The deeper the layer, the OLDER the fossils."
  },
  {
   "id": "s5r-trilobite",
   "name": "Trilobite fossil",
   "look": "critter",
   "color": "#7a8a9a",
   "word": "Oldest layer here",
   "def": "Trilobites were sea arthropods that lived from about 520 to 252 million years ago.",
   "note": "Trilobites in the Burgess Shale (Canada) and the Grand Canyon are over 500 million years old. The bottom layer holds the OLDEST, simplest animals in this dig."
  },
  {
   "id": "s5-observation",
   "name": "Field notebook",
   "look": "stack",
   "color": "#fff8e1",
   "word": "Observation",
   "def": "Information gathered with the senses or instruments.",
   "note": "'The beak is 11 mm deep' is an OBSERVATION: it is measured, not guessed."
  },
  {
   "id": "s5-inference",
   "name": "Footprints",
   "look": "eggs",
   "color": "#c8a070",
   "word": "Inference",
   "def": "A logical conclusion based on observations and evidence.",
   "note": "'A large animal walked here' is an INFERENCE from footprints."
  },
  {
   "id": "s5-hypothesis",
   "name": "Experiment plan",
   "look": "crystal",
   "color": "#ffd166",
   "word": "Hypothesis",
   "def": "A testable explanation or prediction.",
   "note": "'If the drought continues, beaks will get deeper' is a HYPOTHESIS that can be tested."
  },
  {
   "id": "s5-theory",
   "name": "Big idea",
   "look": "sun",
   "color": "#ffd166",
   "word": "Scientific theory",
   "def": "A well-tested explanation of how or why something happens, supported by many lines of evidence.",
   "note": "Cell theory and the theory of evolution are SCIENTIFIC THEORIES: the strongest kind of explanation in science."
  },
  {
   "id": "s5-law",
   "name": "Natural rule",
   "look": "atom",
   "color": "#7fd4ff",
   "word": "Scientific law",
   "def": "A statement that describes what always happens under certain conditions.",
   "note": "A SCIENTIFIC LAW describes WHAT happens. A theory explains WHY. Theories do not turn into laws."
  }
 ],
 "vocab": [
  {
   "term": "Variation",
   "def": "Differences in traits among individuals of the same species."
  },
  {
   "term": "Adaptation",
   "def": "An inherited trait that helps an organism survive and reproduce in its environment."
  },
  {
   "term": "Fitness",
   "def": "An organism's ability to survive and reproduce in its environment."
  },
  {
   "term": "Selection pressure",
   "def": "A factor in the environment, like drought or predators, that affects which individuals survive."
  },
  {
   "term": "Natural selection",
   "def": "The process by which individuals with helpful inherited traits survive and reproduce more."
  },
  {
   "term": "Camouflage",
   "def": "Coloring or shape that helps an organism blend into its surroundings."
  },
  {
   "term": "Common descent",
   "def": "The idea that all living things are related through shared ancestors."
  },
  {
   "term": "Gene pool",
   "def": "All the alleles of all the genes in a population."
  },
  {
   "term": "Allele frequency",
   "def": "How common an allele is in a population, often written as a percent."
  },
  {
   "term": "Mutation (source of variation)",
   "def": "A change in DNA; the original source of new alleles."
  },
  {
   "term": "Genetic drift",
   "def": "A random change in allele frequencies, strongest in small populations."
  },
  {
   "term": "Founder effect",
   "def": "Genetic drift that happens when a few individuals start a new population."
  },
  {
   "term": "Bottleneck effect",
   "def": "Genetic drift that happens when a population is suddenly cut to a small number."
  },
  {
   "term": "Gene flow",
   "def": "The movement of alleles between populations, through migration or carried pollen."
  },
  {
   "term": "Antibiotic resistance",
   "def": "The ability of some bacteria to survive an antibiotic, spread by natural selection."
  },
  {
   "term": "Species",
   "def": "A group of organisms that can interbreed in nature and produce fertile offspring."
  },
  {
   "term": "Geographic isolation",
   "def": "Separation of populations by a physical barrier, such as a canyon, river, or mountain."
  },
  {
   "term": "Behavioral isolation",
   "def": "Populations do not interbreed because of different courtship behaviors."
  },
  {
   "term": "Temporal isolation",
   "def": "Populations do not interbreed because they reproduce at different times."
  },
  {
   "term": "Speciation",
   "def": "The formation of a new species."
  },
  {
   "term": "Adaptive radiation",
   "def": "One ancestral species evolving into many species that fill different niches."
  },
  {
   "term": "Extinction",
   "def": "The death of every member of a species."
  },
  {
   "term": "Fossil",
   "def": "The preserved remains or traces of an organism that lived long ago."
  },
  {
   "term": "Law of superposition",
   "def": "In undisturbed rock layers, lower layers are older than the layers above them."
  },
  {
   "term": "Transitional fossil",
   "def": "A fossil with features of both an ancestral group and its descendants."
  },
  {
   "term": "Homologous structures",
   "def": "Structures with the same basic bones, inherited from a common ancestor, even if they do different jobs."
  },
  {
   "term": "Analogous structures",
   "def": "Structures that do the same job but evolved separately and are built differently."
  },
  {
   "term": "Vestigial structure",
   "def": "A reduced structure with little or no use that was useful in an ancestor."
  },
  {
   "term": "Embryology",
   "def": "The study of how organisms develop before birth; similar early stages suggest shared ancestry."
  },
  {
   "term": "Molecular evidence",
   "def": "Similarities in DNA and protein sequences that show how closely species are related."
  },
  {
   "term": "Universal genetic code",
   "def": "Nearly all organisms use the same codons for the same amino acids."
  },
  {
   "term": "Youngest layer",
   "def": "Rock and ice near the top hold the most recent fossils."
  },
  {
   "term": "Walking whale",
   "def": "Ambulocetus, about 49 million years old, found in Pakistan."
  },
  {
   "term": "Deeper means older",
   "def": "T. rex lived about 68 to 66 million years ago. Many were dug up in Montana's Hell Creek rocks."
  },
  {
   "term": "Oldest layer here",
   "def": "Trilobites were sea arthropods that lived from about 520 to 252 million years ago."
  },
  {
   "term": "Observation",
   "def": "Information gathered with the senses or instruments."
  },
  {
   "term": "Inference",
   "def": "A logical conclusion based on observations and evidence."
  },
  {
   "term": "Hypothesis",
   "def": "A testable explanation or prediction."
  },
  {
   "term": "Scientific theory",
   "def": "A well-tested explanation of how or why something happens, supported by many lines of evidence."
  },
  {
   "term": "Scientific law",
   "def": "A statement that describes what always happens under certain conditions."
  }
 ]
});

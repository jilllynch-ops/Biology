/* WORLD 2 QUESTION FILE: Matter and Energy in Organisms and Ecosystems
   Teachers: you can edit the words inside the quotation marks below.
   - "code" is the Keystone Eligible Content code. "steels" is the PA STEELS standard.
   - In "questions", "answer" is the position of the correct option, counting from 0. The game shuffles the options.
   - "hint" shows after a wrong try. "explain" shows after the right answer.
   - Keep every comma, bracket, and quotation mark in place. */
FieldGuide.registerQuestions(2, {
 "tokens": [
  {
   "id": "water-props",
   "code": "BIO.A.2.1.1",
   "steels": "3.1.9-12.F",
   "prompt": "Collect only TRUE properties of water that help life on Earth",
   "good": [
    "Polar: one end slightly +, one end slightly −",
    "Cohesion: water sticks to itself",
    "Adhesion: water sticks to other surfaces",
    "High specific heat: resists temperature change",
    "Ice floats: it is less dense",
    "Dissolves many substances (a solvent)"
   ],
   "bad": [
    {
     "text": "Nonpolar, like oil",
     "explain": "Water is polar: its oxygen end is slightly negative and its hydrogen ends are slightly positive."
    },
    {
     "text": "Ice sinks to the bottom of lakes",
     "explain": "Ice is less dense than liquid water, so it floats and insulates the water below."
    },
    {
     "text": "Heats up and cools down very fast",
     "explain": "Water has a high specific heat, so its temperature changes slowly."
    },
    {
     "text": "Its molecules push each other apart",
     "explain": "Water molecules attract each other (hydrogen bonds). That is cohesion."
    }
   ]
  },
  {
   "id": "monomers",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "prompt": "Collect only MONOMERS: single building blocks",
   "good": [
    "Glucose",
    "Amino acid",
    "Nucleotide",
    "Fatty acid"
   ],
   "bad": [
    {
     "text": "Starch",
     "explain": "Starch is a polymer: a long chain of glucose monomers."
    },
    {
     "text": "Protein",
     "explain": "A protein is a polymer: a chain of amino acid monomers."
    },
    {
     "text": "DNA",
     "explain": "DNA is a polymer: a chain of nucleotide monomers."
    },
    {
     "text": "Cellulose",
     "explain": "Cellulose is a polymer: a chain of glucose monomers that builds plant cell walls."
    }
   ]
  },
  {
   "id": "atp-facts",
   "code": "BIO.A.3.2.2",
   "steels": "3.1.9-12.G",
   "prompt": "Collect only TRUE facts about ATP",
   "good": [
    "Stores energy in its chemical bonds",
    "Releases energy when a phosphate breaks off (ATP → ADP)",
    "Is made in mitochondria during cellular respiration",
    "Powers cell work like pumps and muscles"
   ],
   "bad": [
    {
     "text": "Is made only by animals",
     "explain": "Plants, animals, fungi, and bacteria all make and use ATP."
    },
    {
     "text": "Is the cell's genetic material",
     "explain": "DNA holds genetic information. ATP carries energy."
    },
    {
     "text": "Stores energy for months, like fat",
     "explain": "ATP is short-term energy. Cells use it within seconds and keep making more. Fat stores energy long-term."
    },
    {
     "text": "Is a type of protein",
     "explain": "ATP is a small nucleotide-like molecule, not a protein."
    }
   ]
  },
  {
   "id": "producers",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "prompt": "Collect only PRODUCERS: living things that make their own food",
   "good": [
    "Grass",
    "Oak tree",
    "Algae",
    "Sunflower"
   ],
   "bad": [
    {
     "text": "Rabbit",
     "explain": "A rabbit eats plants. It is a consumer (a primary consumer)."
    },
    {
     "text": "Mushroom",
     "explain": "A mushroom is a decomposer. It gets energy by breaking down dead matter."
    },
    {
     "text": "Hawk",
     "explain": "A hawk eats other animals. It is a consumer."
    },
    {
     "text": "Deer",
     "explain": "A deer eats plants. It is a consumer."
    }
   ]
  }
 ],
 "sorts": [
  {
   "id": "macro",
   "code": "BIO.A.2.2.3",
   "steels": "3.1.9-12.F",
   "prompt": "Which type of macromolecule is it?",
   "options": [
    "Carbohydrate",
    "Lipid",
    "Protein",
    "Nucleic acid"
   ],
   "hint": "Carbohydrates: sugars and starches. Lipids: fats, oils, membranes. Proteins: enzymes, muscle. Nucleic acids: DNA and RNA.",
   "items": [
    {
     "text": "Starch stored in a potato",
     "answer": 0,
     "explain": "Starch is a carbohydrate: a chain of glucose that stores energy."
    },
    {
     "text": "Cellulose in plant cell walls",
     "answer": 0,
     "explain": "Cellulose is a carbohydrate that gives plant cell walls strength."
    },
    {
     "text": "Phospholipids in the cell membrane",
     "answer": 1,
     "explain": "Phospholipids are lipids. They form the cell membrane."
    },
    {
     "text": "Butter and olive oil",
     "answer": 1,
     "explain": "Fats and oils are lipids that store a lot of energy."
    },
    {
     "text": "The enzyme amylase",
     "answer": 2,
     "explain": "Enzymes are proteins."
    },
    {
     "text": "Hemoglobin that carries oxygen in blood",
     "answer": 2,
     "explain": "Hemoglobin is a protein."
    },
    {
     "text": "DNA in the nucleus",
     "answer": 3,
     "explain": "DNA is a nucleic acid that stores genetic information."
    },
    {
     "text": "mRNA that carries a gene's message",
     "answer": 3,
     "explain": "RNA is a nucleic acid."
    }
   ]
  },
  {
   "id": "photo-resp",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "prompt": "Photosynthesis, cellular respiration, or both?",
   "options": [
    "Photosynthesis",
    "Cellular respiration",
    "Both"
   ],
   "hint": "Photosynthesis stores light energy in glucose. Cellular respiration releases that energy as ATP.",
   "items": [
    {
     "text": "Uses light energy",
     "answer": 0,
     "explain": "Photosynthesis captures light energy."
    },
    {
     "text": "Releases carbon dioxide",
     "answer": 1,
     "explain": "Cellular respiration releases carbon dioxide."
    },
    {
     "text": "Makes glucose",
     "answer": 0,
     "explain": "Photosynthesis makes glucose."
    },
    {
     "text": "Uses oxygen",
     "answer": 1,
     "explain": "Cellular respiration uses oxygen."
    },
    {
     "text": "Happens in chloroplasts",
     "answer": 0,
     "explain": "Photosynthesis happens in chloroplasts."
    },
    {
     "text": "Happens in mitochondria",
     "answer": 1,
     "explain": "Cellular respiration happens mostly in mitochondria."
    },
    {
     "text": "Happens inside plant cells",
     "answer": 2,
     "explain": "Plant cells do both: photosynthesis in chloroplasts and respiration in mitochondria."
    },
    {
     "text": "Makes ATP from the energy in glucose",
     "answer": 1,
     "explain": "Cellular respiration releases the energy in glucose and stores it in ATP."
    }
   ]
  }
 ],
 "questions": [
  {
   "id": "w2q01",
   "code": "BIO.A.2.1.1",
   "steels": "3.1.9-12.F",
   "prompt": "Why can some insects walk on the surface of a pond?",
   "options": [
    "Water molecules stick together (cohesion), making surface tension.",
    "Water is less dense than the insect.",
    "The insect is lighter than air.",
    "Water repels all living things."
   ],
   "answer": 0,
   "hint": "Think about how water molecules attract each other.",
   "explain": "Cohesion between water molecules creates surface tension strong enough to hold up small insects."
  },
  {
   "id": "w2q02",
   "code": "BIO.A.2.1.1",
   "steels": "3.1.9-12.F",
   "prompt": "In winter, a lake freezes on top but fish survive in the water below. Which property of water explains this?",
   "options": [
    "Ice is less dense than liquid water, so it floats and insulates the water below.",
    "Ice is more dense than liquid water, so it sinks.",
    "Water cannot dissolve oxygen.",
    "Water has a low specific heat."
   ],
   "answer": 0,
   "hint": "Where does the ice end up, and what does it do there?",
   "explain": "Ice floats because it is less dense, forming an insulating layer that keeps the water below from freezing."
  },
  {
   "id": "w2q03",
   "code": "BIO.A.2.1.1",
   "steels": "3.1.9-12.F",
   "prompt": "Coastal cities have milder temperatures than inland cities. Which property of water helps cause this?",
   "options": [
    "high specific heat",
    "cohesion",
    "low density",
    "adhesion"
   ],
   "answer": 0,
   "hint": "Which property lets water absorb a lot of heat without changing temperature much?",
   "explain": "Water's high specific heat means oceans warm and cool slowly, keeping nearby land temperatures steady."
  },
  {
   "id": "w2q04",
   "code": "BIO.A.2.1.1",
   "steels": "3.1.9-12.F",
   "prompt": "Why is water called a polar molecule?",
   "options": [
    "Its oxygen end is slightly negative and its hydrogen ends are slightly positive.",
    "It is found at the North and South Poles.",
    "It has no charge at all.",
    "It is made of only one kind of atom."
   ],
   "answer": 0,
   "hint": "Polar means the molecule has two differently charged ends.",
   "explain": "Oxygen pulls electrons more strongly, so water has a slightly negative end and slightly positive ends."
  },
  {
   "id": "w2q05",
   "code": "BIO.A.2.1.1",
   "steels": "3.1.9-12.F",
   "prompt": "Blood carries sugars, salts, and other nutrients dissolved in water. Which property of water makes this possible?",
   "options": [
    "Water is a good solvent.",
    "Water has low density.",
    "Water is nonpolar.",
    "Water freezes at a high temperature."
   ],
   "answer": 0,
   "hint": "What is the word for a liquid that dissolves many substances?",
   "explain": "Because water is polar, it dissolves many substances, so it can carry nutrients in blood and sap."
  },
  {
   "id": "w2q06",
   "code": "BIO.A.2.2.1",
   "steels": "3.1.9-12.F",
   "prompt": "Why can carbon form so many different large molecules?",
   "options": [
    "Each carbon atom can form four bonds, making chains, branches, and rings.",
    "Carbon is the heaviest element in living things.",
    "Carbon can form only one bond.",
    "Carbon is a metal."
   ],
   "answer": 0,
   "hint": "Count how many bonds one carbon atom can make.",
   "explain": "Carbon forms four strong covalent bonds, so it builds long chains, branches, and rings: the backbones of life's molecules."
  },
  {
   "id": "w2q07",
   "code": "BIO.A.2.2.1",
   "steels": "3.1.9-12.F",
   "prompt": "Which element forms the backbone of carbohydrates, lipids, proteins, and nucleic acids?",
   "options": [
    "carbon",
    "nitrogen",
    "iron",
    "calcium"
   ],
   "answer": 0,
   "hint": "These are called organic molecules for a reason.",
   "explain": "All four types of biological macromolecules are built on carbon backbones."
  },
  {
   "id": "w2q08",
   "code": "BIO.A.2.2.1",
   "steels": "3.1.9-12.F",
   "prompt": "A student says, 'Carbon atoms can link to each other in long chains.' Why does this matter for living things?",
   "options": [
    "It lets cells build large, complex molecules like proteins and DNA.",
    "It makes cells rigid like metal.",
    "It stops chemical reactions in cells.",
    "It lets cells avoid using energy."
   ],
   "answer": 0,
   "hint": "Big molecules need a long backbone.",
   "explain": "Carbon-to-carbon bonds let cells build the large, varied molecules needed for life."
  },
  {
   "id": "w2q09",
   "code": "BIO.A.2.2.1",
   "steels": "3.1.9-12.F",
   "prompt": "Glucose, C₆H₁₂O₆, is called an organic molecule. Why?",
   "options": [
    "It is built on a backbone of carbon atoms.",
    "It was grown on a farm.",
    "It contains no carbon.",
    "It is made only by animals."
   ],
   "answer": 0,
   "hint": "In biology, organic means containing carbon backbones.",
   "explain": "Organic molecules are carbon-based. Glucose has a chain of six carbons."
  },
  {
   "id": "w2q10",
   "code": "BIO.A.2.2.1",
   "steels": "3.1.9-12.F",
   "prompt": "Which pair of atoms is found in all four types of biological macromolecules?",
   "options": [
    "carbon and hydrogen",
    "iron and sodium",
    "calcium and chlorine",
    "gold and oxygen"
   ],
   "answer": 0,
   "hint": "Look at the formula of glucose: C₆H₁₂O₆.",
   "explain": "Carbohydrates, lipids, proteins, and nucleic acids all contain carbon and hydrogen (and oxygen)."
  },
  {
   "id": "w2q11",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "prompt": "Which monomer is used to build proteins?",
   "options": [
    "amino acids",
    "glucose",
    "nucleotides",
    "fatty acids"
   ],
   "answer": 0,
   "hint": "Proteins are chains of one kind of building block.",
   "explain": "Proteins are polymers of amino acids."
  },
  {
   "id": "w2q12",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "prompt": "When two glucose molecules join, a water molecule is released. What is this process called?",
   "options": [
    "dehydration synthesis",
    "hydrolysis",
    "photosynthesis",
    "diffusion"
   ],
   "answer": 0,
   "hint": "De-hydration means water is removed.",
   "explain": "Dehydration synthesis joins monomers by removing a water molecule. Hydrolysis is the reverse."
  },
  {
   "id": "w2q13",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "prompt": "During digestion, water is added to break starch into glucose. What is this process called?",
   "options": [
    "hydrolysis",
    "dehydration synthesis",
    "transcription",
    "osmosis"
   ],
   "answer": 0,
   "hint": "Hydro means water and lysis means to split.",
   "explain": "Hydrolysis uses water to break polymers into monomers."
  },
  {
   "id": "w2q14",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "prompt": "DNA is a polymer. Which monomers is it built from?",
   "options": [
    "nucleotides",
    "amino acids",
    "simple sugars only",
    "fatty acids"
   ],
   "answer": 0,
   "hint": "DNA is a nucleic acid. Its monomer has a similar name.",
   "explain": "Nucleic acids like DNA and RNA are chains of nucleotides."
  },
  {
   "id": "w2q15",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "prompt": "Which statement best describes a polymer?",
   "options": [
    "a large molecule made of many repeating monomers",
    "a single sugar molecule",
    "an atom of carbon",
    "a molecule that cannot be broken down"
   ],
   "answer": 0,
   "hint": "Poly means many.",
   "explain": "A polymer is a long chain of repeating monomers, like beads on a necklace."
  },
  {
   "id": "w2q16",
   "code": "BIO.A.2.2.3",
   "steels": "3.1.9-12.F",
   "prompt": "Which type of macromolecule stores genetic information?",
   "options": [
    "nucleic acids",
    "carbohydrates",
    "lipids",
    "proteins"
   ],
   "answer": 0,
   "hint": "DNA belongs to this group.",
   "explain": "Nucleic acids (DNA and RNA) store and carry genetic information."
  },
  {
   "id": "w2q17",
   "code": "BIO.A.2.2.3",
   "steels": "3.1.9-12.F",
   "prompt": "A runner eats pasta the night before a race. Which macromolecule gives quick energy?",
   "options": [
    "carbohydrates",
    "nucleic acids",
    "lipids",
    "proteins"
   ],
   "answer": 0,
   "hint": "Pasta is mostly starch.",
   "explain": "Carbohydrates such as starch are broken down into glucose for quick energy."
  },
  {
   "id": "w2q18",
   "code": "BIO.A.2.2.3",
   "steels": "3.1.9-12.F",
   "prompt": "Which macromolecule makes up most of the cell membrane and stores long-term energy?",
   "options": [
    "lipids",
    "nucleic acids",
    "carbohydrates",
    "proteins"
   ],
   "answer": 0,
   "hint": "Think of phospholipids and fat.",
   "explain": "Lipids store long-term energy (fats) and form cell membranes (phospholipids)."
  },
  {
   "id": "w2q19",
   "code": "BIO.A.2.2.3",
   "steels": "3.1.9-12.F",
   "prompt": "Enzymes, antibodies, and muscle fibers are all made of which macromolecule?",
   "options": [
    "proteins",
    "lipids",
    "carbohydrates",
    "nucleic acids"
   ],
   "answer": 0,
   "hint": "These all do jobs that depend on their folded shape.",
   "explain": "Proteins do many jobs: enzymes speed reactions, antibodies tag germs, and muscle proteins contract."
  },
  {
   "id": "w2q20",
   "code": "BIO.A.2.2.3",
   "steels": "3.1.9-12.F",
   "prompt": "Why does a protein's shape matter?",
   "options": [
    "Its shape determines its function.",
    "Shape has no effect on what a protein does.",
    "All proteins have the same shape.",
    "Proteins never change shape."
   ],
   "answer": 0,
   "hint": "Think of an enzyme's active site.",
   "explain": "A protein folds into a specific shape, and that shape lets it do its job. Change the shape and the job is lost."
  },
  {
   "id": "w2q21",
   "code": "BIO.A.2.3.1",
   "steels": "3.1.9-12.F",
   "prompt": "What does an enzyme do in a chemical reaction?",
   "options": [
    "It speeds up the reaction by lowering the activation energy.",
    "It is used up and becomes part of the product.",
    "It slows down every reaction.",
    "It adds energy so the reaction can happen."
   ],
   "answer": 0,
   "hint": "Enzymes are catalysts.",
   "explain": "Enzymes are catalysts: they lower the activation energy so reactions happen faster, and they are not used up."
  },
  {
   "id": "w2q22",
   "code": "BIO.A.2.3.1",
   "steels": "3.1.9-12.F",
   "prompt": "Why does the enzyme amylase break down starch but not protein?",
   "options": [
    "Only starch fits amylase's active site.",
    "Amylase breaks down every molecule.",
    "Protein is too small to break down.",
    "Starch is a protein."
   ],
   "answer": 0,
   "hint": "Think about shape and fit.",
   "explain": "Enzymes are specific: only a substrate with the right shape fits the active site."
  },
  {
   "id": "w2q23",
   "code": "BIO.A.2.3.1",
   "steels": "3.1.9-12.F",
   "prompt": "After an enzyme helps a reaction, what happens to the enzyme?",
   "options": [
    "It is unchanged and can be used again.",
    "It is destroyed.",
    "It turns into the product.",
    "It becomes a substrate."
   ],
   "answer": 0,
   "hint": "Catalysts are not used up.",
   "explain": "Enzymes are not changed by the reaction, so one enzyme can work on many substrate molecules."
  },
  {
   "id": "w2q24",
   "code": "BIO.A.2.3.1",
   "steels": "3.1.9-12.F",
   "prompt": "What is the active site of an enzyme?",
   "options": [
    "the region where the substrate binds",
    "the part of the cell that makes enzymes",
    "the place where DNA is stored",
    "the energy released by a reaction"
   ],
   "answer": 0,
   "hint": "It is a pocket on the enzyme.",
   "explain": "The active site is the pocket where the substrate fits and the reaction takes place."
  },
  {
   "id": "w2q25",
   "code": "BIO.A.2.3.1",
   "steels": "3.1.9-12.F",
   "prompt": "A reaction in a cell would take years without help, but with an enzyme it takes seconds. What does this show?",
   "options": [
    "Enzymes greatly speed up reactions in cells.",
    "Enzymes make reactions use more energy.",
    "Cells do not need reactions.",
    "Enzymes stop reactions."
   ],
   "answer": 0,
   "hint": "What is a catalyst's job?",
   "explain": "Enzymes speed up reactions so much that life processes can happen fast enough at body temperature."
  },
  {
   "id": "w2q26",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "prompt": "A human enzyme works best at 37 °C. What most likely happens at 60 °C?",
   "options": [
    "The enzyme's shape changes (it denatures), and it stops working.",
    "The enzyme works twice as fast forever.",
    "The enzyme turns into a carbohydrate.",
    "Nothing happens to the enzyme."
   ],
   "answer": 0,
   "hint": "High heat breaks the bonds that hold a protein's shape.",
   "explain": "High heat denatures the enzyme: its active site changes shape, so the substrate no longer fits."
  },
  {
   "id": "w2q27",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "prompt": "Pepsin works in the stomach at pH 2. What would happen to pepsin at pH 8?",
   "options": [
    "It would work poorly because its shape changes.",
    "It would work better.",
    "It would turn into starch.",
    "pH does not affect enzymes."
   ],
   "answer": 0,
   "hint": "Each enzyme has a best pH.",
   "explain": "Enzymes work best at a specific pH. Far from it, the enzyme's shape changes and it slows or stops."
  },
  {
   "id": "w2q28",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "prompt": "A student adds more substrate to a reaction, and the rate rises until it levels off. Why does it level off?",
   "options": [
    "All the enzyme molecules are busy (their active sites are full).",
    "The enzyme was destroyed.",
    "The substrate stopped existing.",
    "The temperature dropped to zero."
   ],
   "answer": 0,
   "hint": "Can a fixed number of enzymes work any faster?",
   "explain": "When every active site is in use, adding more substrate cannot speed up the reaction further."
  },
  {
   "id": "w2q29",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "prompt": "Why do enzymes work slowly at low temperatures?",
   "options": [
    "Molecules move slowly, so enzymes and substrates collide less often.",
    "The enzyme is denatured by cold.",
    "Cold adds activation energy.",
    "Cold changes the substrate into a protein."
   ],
   "answer": 0,
   "hint": "Temperature affects how fast molecules move.",
   "explain": "At low temperatures molecules move slowly, so there are fewer collisions. The enzyme is not damaged."
  },
  {
   "id": "w2q30",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "prompt": "Which factor does NOT usually affect how well an enzyme works?",
   "options": [
    "the color of the container",
    "temperature",
    "pH",
    "the amount of substrate"
   ],
   "answer": 0,
   "hint": "Three of these change the enzyme or how often it meets its substrate.",
   "explain": "Temperature, pH, and substrate concentration all affect enzyme activity. Container color does not."
  },
  {
   "id": "w2q31",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.E",
   "prompt": "Which organelle captures light energy and stores it in glucose?",
   "options": [
    "chloroplast",
    "mitochondrion",
    "nucleus",
    "ribosome"
   ],
   "answer": 0,
   "hint": "It contains the green pigment chlorophyll.",
   "explain": "Chloroplasts carry out photosynthesis, turning light energy into chemical energy in glucose."
  },
  {
   "id": "w2q32",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.E",
   "prompt": "Which organelle releases the energy stored in glucose and makes most of a cell's ATP?",
   "options": [
    "mitochondrion",
    "chloroplast",
    "Golgi apparatus",
    "cell wall"
   ],
   "answer": 0,
   "hint": "It is often called the powerhouse of the cell.",
   "explain": "Mitochondria carry out cellular respiration, making ATP from the energy in glucose."
  },
  {
   "id": "w2q33",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.E",
   "prompt": "A leaf cell has both chloroplasts and mitochondria. Why does it need both?",
   "options": [
    "Chloroplasts make glucose, and mitochondria release its energy as ATP.",
    "Both organelles do the same job.",
    "Mitochondria make glucose for the chloroplasts.",
    "Plant cells use only chloroplasts."
   ],
   "answer": 0,
   "hint": "One stores energy, the other releases it.",
   "explain": "Plants make their own food in chloroplasts and then use mitochondria to release that energy as ATP."
  },
  {
   "id": "w2q34",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.E",
   "prompt": "An animal cell has mitochondria but no chloroplasts. How does it get glucose?",
   "options": [
    "from the food the animal eats",
    "by doing photosynthesis in its mitochondria",
    "from sunlight directly",
    "from its nucleus"
   ],
   "answer": 0,
   "hint": "Animals are consumers.",
   "explain": "Animals cannot photosynthesize, so they get glucose from food; their mitochondria release its energy."
  },
  {
   "id": "w2q35",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.E",
   "prompt": "Muscle cells use a lot of energy. Which organelle would you expect to find in large numbers in muscle cells?",
   "options": [
    "mitochondria",
    "chloroplasts",
    "cell walls",
    "vacuoles"
   ],
   "answer": 0,
   "hint": "Which organelle makes ATP?",
   "explain": "Muscle cells need lots of ATP, so they contain many mitochondria."
  },
  {
   "id": "w2q36",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "prompt": "Which are the PRODUCTS of photosynthesis?",
   "options": [
    "glucose and oxygen",
    "carbon dioxide and water",
    "ATP and carbon dioxide",
    "oxygen and carbon dioxide"
   ],
   "answer": 0,
   "hint": "Photosynthesis: carbon dioxide + water + light → ?",
   "explain": "Photosynthesis uses carbon dioxide, water, and light energy to make glucose and oxygen."
  },
  {
   "id": "w2q37",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "prompt": "Which are the PRODUCTS of cellular respiration?",
   "options": [
    "carbon dioxide, water, and ATP",
    "glucose and oxygen",
    "light energy and glucose",
    "oxygen and water only"
   ],
   "answer": 0,
   "hint": "Respiration breaks down glucose using oxygen.",
   "explain": "Cellular respiration: glucose + oxygen → carbon dioxide + water + ATP energy."
  },
  {
   "id": "w2q38",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "prompt": "How are photosynthesis and cellular respiration related?",
   "options": [
    "The products of one are the reactants of the other.",
    "They are exactly the same process.",
    "They both make glucose.",
    "They both happen only in animals."
   ],
   "answer": 0,
   "hint": "Compare their equations side by side.",
   "explain": "Photosynthesis makes glucose and oxygen; respiration uses them and returns carbon dioxide and water."
  },
  {
   "id": "w2q39",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "prompt": "Which energy change happens during photosynthesis?",
   "options": [
    "Light energy is changed into chemical energy stored in glucose.",
    "Chemical energy is changed into light energy.",
    "Heat energy is changed into sound.",
    "Chemical energy in ATP is changed into glucose with no light."
   ],
   "answer": 0,
   "hint": "Where does the energy come from, and where is it stored?",
   "explain": "Photosynthesis transforms light energy into chemical energy stored in the bonds of glucose."
  },
  {
   "id": "w2q40",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "prompt": "A plant is placed in a sealed jar in the dark. Which gas will increase in the jar?",
   "options": [
    "carbon dioxide",
    "oxygen",
    "nitrogen",
    "helium"
   ],
   "answer": 0,
   "hint": "Without light, the plant can still do one of the two processes.",
   "explain": "In the dark, plants cannot photosynthesize, but they still respire, releasing carbon dioxide."
  },
  {
   "id": "w2q41",
   "code": "BIO.A.3.2.2",
   "steels": "3.1.9-12.G",
   "prompt": "What is the main role of ATP in cells?",
   "options": [
    "It carries usable energy for cell work.",
    "It stores genetic information.",
    "It forms the cell membrane.",
    "It speeds up reactions as an enzyme."
   ],
   "answer": 0,
   "hint": "Think of a rechargeable battery.",
   "explain": "ATP is the cell's energy carrier: it delivers energy to reactions and cell work."
  },
  {
   "id": "w2q42",
   "code": "BIO.A.3.2.2",
   "steels": "3.1.9-12.G",
   "prompt": "How does ATP release energy?",
   "options": [
    "A phosphate group breaks off, turning ATP into ADP.",
    "It splits into carbon dioxide and water.",
    "It absorbs light.",
    "It joins with DNA."
   ],
   "answer": 0,
   "hint": "Tri-phosphate becomes di-phosphate.",
   "explain": "Breaking the bond to the last phosphate releases energy; ATP becomes ADP plus a phosphate."
  },
  {
   "id": "w2q43",
   "code": "BIO.A.3.2.2",
   "steels": "3.1.9-12.G",
   "prompt": "Which cell process uses energy directly from ATP?",
   "options": [
    "a sodium pump moving ions against the concentration gradient",
    "oxygen diffusing into the cell",
    "water moving by osmosis",
    "glucose moving down its concentration gradient through a channel"
   ],
   "answer": 0,
   "hint": "Which one is active transport?",
   "explain": "Pumps move particles from low to high concentration, which requires energy from ATP."
  },
  {
   "id": "w2q44",
   "code": "BIO.A.3.2.2",
   "steels": "3.1.9-12.G",
   "prompt": "ADP can be 'recharged' into ATP. Where does the energy for recharging mostly come from?",
   "options": [
    "breaking down glucose in cellular respiration",
    "the nucleus",
    "absorbing water",
    "the cell wall"
   ],
   "answer": 0,
   "hint": "Food stores energy; respiration releases it.",
   "explain": "Energy released from glucose during cellular respiration is used to turn ADP back into ATP."
  },
  {
   "id": "w2q45",
   "code": "BIO.A.3.2.2",
   "steels": "3.1.9-12.G",
   "prompt": "Why do cells make ATP instead of using glucose directly for every job?",
   "options": [
    "ATP releases small, usable amounts of energy quickly.",
    "Glucose has no energy.",
    "ATP stores more energy than fat.",
    "Cells cannot break down glucose."
   ],
   "answer": 0,
   "hint": "Think of glucose as a big bill and ATP as small change.",
   "explain": "Glucose holds a lot of energy; cells convert it into many ATP molecules that release small, usable amounts quickly."
  },
  {
   "id": "w2q46",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "prompt": "In a food chain, which way do the arrows point?",
   "options": [
    "from the organism eaten to the organism that eats it, showing energy flow",
    "from the predator to its prey",
    "from the Sun to the decomposers only",
    "in random directions"
   ],
   "answer": 0,
   "hint": "Arrows show where the energy goes.",
   "explain": "Arrows point in the direction energy flows: from food to the eater."
  },
  {
   "id": "w2q47",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "prompt": "Only about how much of the energy at one trophic level passes to the next level?",
   "options": [
    "about 10%",
    "about 90%",
    "100%",
    "none"
   ],
   "answer": 0,
   "hint": "Most energy is used for life processes or lost as heat.",
   "explain": "About 10% of the energy passes up to the next level; the rest is used or lost as heat."
  },
  {
   "id": "w2q48",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "prompt": "Grass → grasshopper → frog → snake. Which organism is the producer?",
   "options": [
    "grass",
    "grasshopper",
    "frog",
    "snake"
   ],
   "answer": 0,
   "hint": "Producers make their own food.",
   "explain": "Grass makes its own food by photosynthesis, so it is the producer."
  },
  {
   "id": "w2q49",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "prompt": "Why are there usually fewer top predators than herbivores in an ecosystem?",
   "options": [
    "Less energy is available at higher trophic levels.",
    "Top predators reproduce faster.",
    "Herbivores eat the top predators.",
    "Top predators need no energy."
   ],
   "answer": 0,
   "hint": "Think about the energy pyramid's shape.",
   "explain": "Each level up has only about 10% of the energy of the level below, so it supports fewer organisms."
  },
  {
   "id": "w2q50",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "prompt": "What is the original source of energy for almost every food chain on Earth?",
   "options": [
    "the Sun",
    "the soil",
    "water",
    "decomposers"
   ],
   "answer": 0,
   "hint": "Producers capture it first.",
   "explain": "Producers capture energy from sunlight, and it flows through the food chain from there."
  },
  {
   "id": "w2q51",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "prompt": "Which process removes carbon dioxide from the atmosphere?",
   "options": [
    "photosynthesis",
    "cellular respiration",
    "burning fossil fuels",
    "decomposition"
   ],
   "answer": 0,
   "hint": "Which process uses carbon dioxide as a reactant?",
   "explain": "Plants and algae take in carbon dioxide during photosynthesis."
  },
  {
   "id": "w2q52",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "prompt": "What is the role of decomposers in the cycling of matter?",
   "options": [
    "They break down dead organisms and return nutrients to the soil and air.",
    "They make food from sunlight.",
    "They create new matter.",
    "They stop the carbon cycle."
   ],
   "answer": 0,
   "hint": "Think about what happens to a fallen log.",
   "explain": "Decomposers break down dead matter and return carbon and nutrients to the ecosystem."
  },
  {
   "id": "w2q53",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "prompt": "Plants need nitrogen to make proteins, but they cannot use nitrogen gas from the air. How do they get usable nitrogen?",
   "options": [
    "Bacteria in the soil change nitrogen gas into forms plants can absorb.",
    "Plants absorb nitrogen gas through their leaves.",
    "Animals breathe nitrogen into the soil.",
    "Sunlight turns into nitrogen."
   ],
   "answer": 0,
   "hint": "Tiny living things in the soil and in roots help.",
   "explain": "Nitrogen-fixing bacteria convert nitrogen gas into compounds that plants take up through their roots."
  },
  {
   "id": "w2q54",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "prompt": "Which statement best compares energy and matter in an ecosystem?",
   "options": [
    "Matter cycles, but energy flows through and is lost as heat.",
    "Energy cycles, but matter is lost.",
    "Both energy and matter are recycled forever.",
    "Neither energy nor matter moves."
   ],
   "answer": 0,
   "hint": "Which one can be used again and again?",
   "explain": "Atoms of carbon, nitrogen, and water are recycled; energy enters as sunlight and leaves as heat."
  },
  {
   "id": "w2q55",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "prompt": "Which process in the water cycle moves water from leaves into the air?",
   "options": [
    "transpiration",
    "condensation",
    "precipitation",
    "runoff"
   ],
   "answer": 0,
   "hint": "Plants 'sweat' water vapor through their leaves.",
   "explain": "Transpiration is the release of water vapor from plant leaves into the air."
  },
  /* Phase 1 additions (v35): 22 more questions so the rotation repeats less. Add your own the same way. */
    {"id": "w2q56", "code": "BIO.A.2.1.1", "steels": "3.1.9-12.F", "prompt": "Water molecules stick to each other because of hydrogen bonds. Which property of water is this?", "options": ["cohesion", "adhesion", "acidity", "density"], "answer": 0, "hint": "'Co-' means together: water with water.", "explain": "Cohesion is water sticking to water. It causes surface tension."},
    {"id": "w2q57", "code": "BIO.A.2.1.1", "steels": "3.1.9-12.F", "prompt": "Why does a large lake change temperature much more slowly than the air around it?", "options": ["Water has a high specific heat, so it absorbs a lot of heat before its temperature changes.", "Water is a poor solvent.", "Water molecules are nonpolar.", "Ice sinks to the bottom of the lake."], "answer": 0, "hint": "Hydrogen bonds must be broken before water molecules can move faster.", "explain": "Water's high specific heat means it absorbs or releases a lot of heat with only a small temperature change. This keeps lakes and oceans stable."},
    {"id": "w2q58", "code": "BIO.A.2.2.1", "steels": "3.1.9-12.F", "prompt": "Carbon can form single, double, or triple bonds, and can make chains, branches, and rings. What does this allow?", "options": ["a huge variety of molecule shapes and sizes, which living things use for different jobs", "only very small molecules", "molecules that cannot bond with hydrogen", "molecules that are always ionic"], "answer": 0, "hint": "More ways to connect means more possible shapes.", "explain": "Because carbon bonds in so many ways, it builds a huge variety of molecules, from sugars to proteins to DNA."},
    {"id": "w2q59", "code": "BIO.A.2.2.1", "steels": "3.1.9-12.F", "prompt": "Which of these is an ORGANIC molecule?", "options": ["glucose (C₆H₁₂O₆)", "water (H₂O)", "table salt (NaCl)", "oxygen gas (O₂)"], "answer": 0, "hint": "Organic molecules are built on a carbon backbone.", "explain": "Organic molecules are built on carbon, usually bonded to hydrogen. Glucose has a carbon backbone; the others have no carbon."},
    {"id": "w2q60", "code": "BIO.A.2.2.2", "steels": "3.1.9-12.F", "prompt": "What are the monomers (building blocks) of nucleic acids such as DNA?", "options": ["nucleotides", "amino acids", "monosaccharides", "fatty acids"], "answer": 0, "hint": "The name of the monomer sounds like the name of the polymer.", "explain": "Nucleic acids are polymers made of nucleotides. Amino acids build proteins, and monosaccharides build carbohydrates."},
    {"id": "w2q61", "code": "BIO.A.2.2.2", "steels": "3.1.9-12.F", "prompt": "Starch is a long chain of glucose molecules. What kind of molecule is starch?", "options": ["a polysaccharide (a carbohydrate polymer)", "a protein", "a nucleic acid", "a lipid"], "answer": 0, "hint": "'Poly' means many; 'saccharide' means sugar.", "explain": "Starch is a polysaccharide: many glucose monomers joined together. Plants use it to store energy."},
    {"id": "w2q62", "code": "BIO.A.2.2.3", "steels": "3.1.9-12.F", "prompt": "Hair, fingernails, and the hemoglobin in your blood are made mainly of which macromolecule?", "options": ["proteins", "carbohydrates", "lipids", "nucleic acids"], "answer": 0, "hint": "These are built from amino acids.", "explain": "Hair and nails (keratin) and hemoglobin are proteins. Proteins build structures and do many jobs in the body."},
    {"id": "w2q63", "code": "BIO.A.2.2.3", "steels": "3.1.9-12.F", "prompt": "Plant cell walls are tough because they are made of cellulose. What type of macromolecule is cellulose?", "options": ["a carbohydrate", "a lipid", "a protein", "a nucleic acid"], "answer": 0, "hint": "Cellulose is made of many glucose units.", "explain": "Cellulose is a structural carbohydrate (a polysaccharide) made of glucose units. It gives plant cell walls their strength."},
    {"id": "w2q64", "code": "BIO.A.2.3.1", "steels": "3.1.9-12.F", "prompt": "On an energy graph, how does an enzyme change a reaction?", "options": ["It lowers the activation energy needed to start the reaction.", "It raises the activation energy.", "It adds energy to the products.", "It changes which products form."], "answer": 0, "hint": "Enzymes make reactions easier to start.", "explain": "Enzymes are catalysts: they lower the activation energy, so the reaction happens faster without changing the products."},
    {"id": "w2q65", "code": "BIO.A.2.3.1", "steels": "3.1.9-12.F", "prompt": "The enzyme lactase breaks down the sugar lactose, but not the sugar sucrose. What best explains this?", "options": ["Only lactose fits the shape of lactase's active site.", "Sucrose is not a sugar.", "Lactase is used up after one reaction.", "Enzymes break down any molecule they touch."], "answer": 0, "hint": "Enzymes and substrates fit like a lock and key.", "explain": "Enzymes are specific: only a substrate with the right shape fits the active site."},
    {"id": "w2q66", "code": "BIO.A.2.3.2", "steels": "3.1.9-12.F", "prompt": "The enzyme pepsin works in the stomach at about pH 2. What happens to pepsin's activity at pH 8, as in the small intestine?", "options": ["Its activity drops, because the change in pH alters the shape of its active site.", "Its activity increases.", "It becomes a different enzyme.", "Nothing changes, because pH does not affect enzymes."], "answer": 0, "hint": "Each enzyme has an ideal pH.", "explain": "Each enzyme works best at a certain pH. Far from that pH, the enzyme's shape changes, so its active site no longer fits the substrate well."},
    {"id": "w2q67", "code": "BIO.A.2.3.2", "steels": "3.1.9-12.F", "prompt": "A student keeps adding substrate to a fixed amount of enzyme. The reaction speeds up, then levels off. Why does it level off?", "options": ["All the enzymes' active sites are busy, so more substrate cannot speed it up.", "The enzyme was destroyed.", "The substrate stopped fitting the active site.", "The temperature dropped."], "answer": 0, "hint": "There is only a limited number of enzyme molecules.", "explain": "When every active site is busy, the enzymes are working as fast as they can, so adding more substrate does not raise the rate."},
    {"id": "w2q68", "code": "BIO.A.3.1.1", "steels": "3.1.9-12.E", "prompt": "Chloroplasts and mitochondria are both energy converters. Which statement best describes what each one converts?", "options": ["Chloroplasts turn light energy into chemical energy in glucose; mitochondria turn glucose's energy into ATP.", "Chloroplasts make ATP from glucose; mitochondria capture light.", "Both capture light energy.", "Both store DNA for the nucleus."], "answer": 0, "hint": "One works in light; one works day and night to release energy.", "explain": "Chloroplasts capture light energy and store it in glucose (photosynthesis). Mitochondria release that energy and store it in ATP (cellular respiration)."},
    {"id": "w2q69", "code": "BIO.A.3.1.1", "steels": "3.1.9-12.E", "prompt": "A plant is kept in complete darkness for several days. Which organelle can still release energy from the plant's stored sugars?", "options": ["mitochondria", "chloroplasts", "the cell wall", "the central vacuole"], "answer": 0, "hint": "Which process does not need light?", "explain": "Mitochondria carry out cellular respiration day and night. Chloroplasts need light for photosynthesis."},
    {"id": "w2q70", "code": "BIO.A.3.2.1", "steels": "3.1.9-12.E", "prompt": "What are the REACTANTS (starting materials) of cellular respiration?", "options": ["glucose and oxygen", "carbon dioxide and water", "light and water", "ATP and carbon dioxide"], "answer": 0, "hint": "Respiration breaks down food using the gas you breathe in.", "explain": "Cellular respiration uses glucose and oxygen and produces carbon dioxide, water, and ATP."},
    {"id": "w2q71", "code": "BIO.A.3.2.1", "steels": "3.1.9-12.E", "prompt": "How are photosynthesis and cellular respiration related?", "options": ["The products of one are the reactants of the other.", "They both happen only in animals.", "They both release oxygen.", "They both need light."], "answer": 0, "hint": "Compare what goes in and what comes out of each.", "explain": "Photosynthesis makes glucose and oxygen, which respiration uses. Respiration makes carbon dioxide and water, which photosynthesis uses."},
    {"id": "w2q72", "code": "BIO.A.3.2.2", "steels": "3.1.9-12.G", "prompt": "When ATP releases energy for the cell to use, what does it become?", "options": ["ADP and a phosphate group", "glucose", "a protein", "DNA"], "answer": 0, "hint": "ATP has three phosphates. What happens when one breaks off?", "explain": "Breaking off the last phosphate releases energy and leaves ADP plus a phosphate, which the cell can recharge into ATP."},
    {"id": "w2q73", "code": "BIO.A.3.2.2", "steels": "3.1.9-12.G", "prompt": "Which cell activity uses energy from ATP?", "options": ["pumping ions across the membrane in active transport", "water moving in by osmosis", "oxygen diffusing into the cell", "carbon dioxide diffusing out of the cell"], "answer": 0, "hint": "Which process moves things against their gradient?", "explain": "Active transport pumps need ATP. Osmosis and diffusion are passive and use no ATP."},
    {"id": "w2q74", "code": "BIO.B.4.2.1", "steels": "3.1.9-12.J", "prompt": "In an energy pyramid, about how much of the energy at one level is passed to the next level up?", "options": ["about 10%", "about 50%", "about 90%", "100%"], "answer": 0, "hint": "Most energy is used for life processes or lost as heat.", "explain": "Only about 10% of the energy at one level passes to the next. The rest is used for life processes or lost as heat."},
    {"id": "w2q75", "code": "BIO.B.4.2.1", "steels": "3.1.9-12.J", "prompt": "In the food chain grass → grasshopper → frog → hawk, which organism is a secondary consumer?", "options": ["frog", "grass", "grasshopper", "hawk"], "answer": 0, "hint": "Count the eaters: the first eater is the primary consumer.", "explain": "Grass is the producer, the grasshopper is the primary consumer, the frog is the secondary consumer, and the hawk is the tertiary consumer."},
    {"id": "w2q76", "code": "BIO.B.4.2.3", "steels": "3.1.9-12.K", "prompt": "Which process returns carbon dioxide to the atmosphere?", "options": ["cellular respiration by plants, animals, and decomposers", "photosynthesis", "transpiration", "nitrogen fixation"], "answer": 0, "hint": "Which process breaks down glucose and releases a gas?", "explain": "Cellular respiration (and burning fuels) releases carbon dioxide. Photosynthesis removes it."},
    {"id": "w2q77", "code": "BIO.B.4.2.3", "steels": "3.1.9-12.K", "prompt": "Water vapor in the air cools and forms clouds. Which step of the water cycle is this?", "options": ["condensation", "evaporation", "transpiration", "runoff"], "answer": 0, "hint": "Think of droplets forming on a cold glass.", "explain": "Condensation is water vapor cooling into liquid droplets, which form clouds."}
 ],
 "pairs": [
  {
   "name": "Photosynthesis or cellular respiration?",
   "explain": "Photosynthesis stores light energy in glucose (in chloroplasts). Cellular respiration releases that energy as ATP (in mitochondria).",
   "members": [
    {
     "label": "Photosynthesis",
     "level": "2-4",
     "ids": [
      "photo-resp.0",
      "photo-resp.2",
      "photo-resp.4",
      "w2q36"
     ]
    },
    {
     "label": "Cellular respiration",
     "level": "2-4",
     "ids": [
      "photo-resp.1",
      "photo-resp.3",
      "photo-resp.5",
      "w2q37"
     ]
    }
   ]
  },
  {
   "name": "Chloroplast or mitochondrion?",
   "explain": "Chloroplasts capture light to make glucose. Mitochondria break glucose down to make ATP.",
   "members": [
    {
     "label": "Chloroplast",
     "level": "2-4",
     "ids": [
      "w2q31"
     ]
    },
    {
     "label": "Mitochondrion",
     "level": "2-4",
     "ids": [
      "w2q32",
      "w2q35"
     ]
    }
   ]
  },
  {
   "name": "Dehydration synthesis or hydrolysis?",
   "explain": "Dehydration synthesis removes water to join monomers. Hydrolysis adds water to split polymers.",
   "members": [
    {
     "label": "Dehydration synthesis",
     "level": "2-2",
     "ids": [
      "w2q12"
     ]
    },
    {
     "label": "Hydrolysis",
     "level": "2-2",
     "ids": [
      "w2q13"
     ]
    }
   ]
  }
 ],
 "become": [
  {
   "id": "b-starch",
   "code": "BIO.A.2.3.1",
   "steels": "3.1.9-12.F",
   "you": "a starch molecule (the substrate)",
   "short": "Starch",
   "color": "#ffd166",
   "goal": "Go through the enzyme whose active site fits you.",
   "doors": [
    {
     "kind": "protein",
     "label": "Amylase (fits starch)",
     "ok": true
    },
    {
     "kind": "protein",
     "label": "Protease (fits proteins)",
     "ok": false,
     "why": "Protease's active site fits proteins, not starch. Enzymes are specific."
    },
    {
     "kind": "protein",
     "label": "Lipase (fits fats)",
     "ok": false,
     "why": "Lipase's active site fits fats, not starch."
    }
   ],
   "explain": "Amylase's active site fits starch, so it breaks starch into sugars. Each enzyme works on its own substrate."
  },
  {
   "id": "b-pepsin",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "you": "a protein in the stomach (pH 2, very acidic)",
   "short": "Protein",
   "color": "#ff8fb1",
   "goal": "Which enzyme can break you down in strong acid?",
   "doors": [
    {
     "kind": "protein",
     "label": "Pepsin (best at pH 2)",
     "ok": true
    },
    {
     "kind": "protein",
     "label": "Trypsin (best at pH 8)",
     "ok": false,
     "why": "Trypsin works best at pH 8. In strong stomach acid its shape changes, so it cannot work here."
    },
    {
     "kind": "protein",
     "label": "Amylase (fits starch)",
     "ok": false,
     "why": "Amylase fits starch, not proteins."
    }
   ],
   "explain": "Pepsin works best in acid, so it digests proteins in the stomach. Each enzyme has a pH where it works best."
  },
  {
   "id": "b-co2",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.E",
   "you": "a carbon dioxide molecule (CO₂) inside a leaf",
   "short": "CO₂",
   "color": "#9fe0ff",
   "goal": "Go to the organelle that uses you to build sugar.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Chloroplast",
     "ok": true
    },
    {
     "kind": "organelle",
     "label": "Mitochondrion",
     "ok": false,
     "why": "Mitochondria RELEASE carbon dioxide during cellular respiration. They do not use it."
    },
    {
     "kind": "organelle",
     "label": "Nucleus",
     "ok": false,
     "why": "The nucleus holds DNA. Sugar is built in the chloroplast."
    }
   ],
   "explain": "Chloroplasts use carbon dioxide, water, and light energy to build glucose during photosynthesis."
  },
  {
   "id": "b-glucose2",
   "code": "BIO.A.3.1.1",
   "steels": "3.1.9-12.G",
   "you": "a glucose molecule inside a cell",
   "short": "Glucose",
   "color": "#ffd98a",
   "goal": "Go to the organelle that releases your energy and stores it in ATP.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Mitochondrion",
     "ok": true
    },
    {
     "kind": "organelle",
     "label": "Chloroplast",
     "ok": false,
     "why": "Chloroplasts MAKE glucose. Mitochondria break it down to make ATP."
    },
    {
     "kind": "organelle",
     "label": "Golgi apparatus",
     "ok": false,
     "why": "The Golgi packages proteins. It does not release energy from glucose."
    }
   ],
   "explain": "In the mitochondrion, cellular respiration breaks down glucose with oxygen and stores the energy in ATP."
  }
 ],
 "catches": [
  {
   "id": "c-polymer",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "short": "Build polymers",
   "title": "Feed the polymer builder: grab the monomer that builds each macromolecule.",
   "cueLabel": "Build",
   "builtLabel": "Polymers built",
   "cueWord": "polymer",
   "tokenWord": "monomer",
   "rule": "Monomers join into polymers by dehydration synthesis: a water molecule is removed at each new bond.",
   "choices": [
    "Glucose",
    "Amino acid",
    "Nucleotide",
    "Fatty acids + glycerol",
    "Starch",
    "Protein"
   ],
   "steps": [
    {
     "cue": "Starch",
     "need": "Glucose",
     "bead": "Starch"
    },
    {
     "cue": "Protein",
     "need": "Amino acid",
     "bead": "Protein"
    },
    {
     "cue": "DNA",
     "need": "Nucleotide",
     "bead": "DNA"
    },
    {
     "cue": "Fat",
     "need": "Fatty acids + glycerol",
     "bead": "Fat"
    }
   ],
   "hint": "Which small building block repeats in the highlighted polymer?",
   "wrong": {
    "Starch": "Starch is already a polymer. Grab the monomer it is built from.",
    "Protein": "Protein is already a polymer. Grab the monomer it is built from."
   },
   "explain": "Glucose builds starch, amino acids build proteins, nucleotides build DNA, and fatty acids with glycerol build fats."
  },
  {
   "id": "c-photo",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.E",
   "short": "Photosynthesis",
   "title": "Inside the chloroplast: load what photosynthesis uses, then collect what it makes.",
   "cueLabel": "Need",
   "builtLabel": "Loaded",
   "cueWord": "slot",
   "tokenWord": "molecule",
   "rule": "Photosynthesis: carbon dioxide + water + light energy → glucose + oxygen",
   "choices": [
    "Carbon dioxide",
    "Water",
    "Light energy",
    "Glucose",
    "Oxygen",
    "ATP",
    "Nitrogen"
   ],
   "steps": [
    {
     "cue": "Gas taken in",
     "need": "Carbon dioxide"
    },
    {
     "cue": "From the roots",
     "need": "Water"
    },
    {
     "cue": "Energy in",
     "need": "Light energy"
    },
    {
     "cue": "Sugar made",
     "need": "Glucose"
    },
    {
     "cue": "Gas released",
     "need": "Oxygen"
    }
   ],
   "hint": "Check the equation: carbon dioxide + water + light energy → glucose + oxygen.",
   "explain": "Photosynthesis: carbon dioxide + water + light energy → glucose + oxygen. Light energy is stored as chemical energy in glucose.",
   "clearTrail": true
  },
  {
   "id": "c-resp",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.G",
   "short": "Cellular respiration",
   "title": "Inside the mitochondrion: load what respiration uses, then collect what it makes.",
   "cueLabel": "Need",
   "builtLabel": "Loaded",
   "cueWord": "slot",
   "tokenWord": "molecule",
   "rule": "Cellular respiration: glucose + oxygen → carbon dioxide + water + ATP energy",
   "choices": [
    "Glucose",
    "Oxygen",
    "Carbon dioxide",
    "Water",
    "ATP",
    "Light energy",
    "Nitrogen"
   ],
   "steps": [
    {
     "cue": "Sugar used",
     "need": "Glucose"
    },
    {
     "cue": "Gas used",
     "need": "Oxygen"
    },
    {
     "cue": "Gas released",
     "need": "Carbon dioxide"
    },
    {
     "cue": "Liquid made",
     "need": "Water"
    },
    {
     "cue": "Energy made",
     "need": "ATP"
    }
   ],
   "hint": "Check the equation: glucose + oxygen → carbon dioxide + water + ATP.",
   "wrong": {
    "Light energy": "Cellular respiration does not need light. It runs day and night in every cell."
   },
   "explain": "Cellular respiration: glucose + oxygen → carbon dioxide + water + ATP. It is photosynthesis in reverse.",
   "clearTrail": true
  },
  {
   "id": "c-carbon",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "short": "Carbon cycle",
   "title": "Run the carbon cycle: grab the process that moves carbon each way.",
   "cueLabel": "Carbon moves",
   "builtLabel": "Cycle",
   "cueWord": "arrow",
   "tokenWord": "process",
   "sep": " → ",
   "rule": "Carbon moves between the air, living things, the soil, and fossil fuels.",
   "choices": [
    "Photosynthesis",
    "Cellular respiration",
    "Decomposition",
    "Combustion",
    "Condensation",
    "Evaporation"
   ],
   "steps": [
    {
     "cue": "Air → plants",
     "need": "Photosynthesis"
    },
    {
     "cue": "Living things → air",
     "need": "Cellular respiration"
    },
    {
     "cue": "Dead matter → soil and air",
     "need": "Decomposition"
    },
    {
     "cue": "Fossil fuels → air",
     "need": "Combustion"
    }
   ],
   "hint": "Which process moves carbon in the direction of the highlighted arrow?",
   "wrong": {
    "Condensation": "Condensation is part of the water cycle: water vapor turning into liquid.",
    "Evaporation": "Evaporation is part of the water cycle: liquid water turning into vapor."
   },
   "explain": "Photosynthesis pulls carbon from the air; respiration, decomposition, and combustion return it. Matter cycles."
  }
 ],
 "balances": [
  {
   "id": "bal-enzyme",
   "kind": "elevator",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "title": "Keep the body at the best temperature for its enzymes. The platform rises and falls with the temperature.",
   "what": "Body temperature",
   "unit": "°C",
   "start": 37,
   "min": 30,
   "max": 46,
   "band": [
    35.5,
    38.5
   ],
   "danger": [
    32,
    42
   ],
   "hold": 10,
   "drift": -0.3,
   "event": {
    "every": 6,
    "delta": 3.5,
    "msg": "A fever is raising the temperature! Enzymes start to lose their shape."
   },
   "controls": [
    {
     "label": "Sweat to cool down",
     "delta": -2.6
    },
    {
     "label": "Shiver to warm up",
     "delta": 2.6
    }
   ],
   "tooHigh": "Too hot! Enzymes start to denature. Cool down.",
   "tooLow": "Too cold! Enzymes slow down. Warm up.",
   "explain": "Enzymes work best near 37 °C. Homeostasis keeps the body near that temperature so enzymes keep their shape."
  },
  {
   "id": "bal-carbon",
   "kind": "boss",
   "name": "The Carbon Imbalance",
   "code": "BIO.B.4.2.3",
   "steels": "3.1.9-12.K",
   "title": "The Carbon Imbalance keeps pushing carbon dioxide into the air and pulling it out. Bring the air back into balance and hold it there.",
   "what": "Carbon dioxide in the air",
   "unit": "units",
   "start": 50,
   "min": 0,
   "max": 100,
   "band": [
    43,
    57
   ],
   "danger": [
    22,
    78
   ],
   "hold": 4,
   "push": 3.6,
   "hp": 4,
   "set": 50,
   "controls": [
    {
     "label": "Photosynthesis (plants take in CO₂)",
     "delta": -11
    },
    {
     "label": "Plant a forest",
     "delta": -8
    },
    {
     "label": "Cellular respiration (releases CO₂)",
     "delta": 11
    },
    {
     "label": "Decomposers break down dead matter",
     "delta": 8
    }
   ],
   "wrongHot": "There is already too much carbon dioxide in the air. That process releases even more.",
   "wrongCold": "There is already too little carbon dioxide. That process removes even more.",
   "tooHigh": "Too much carbon dioxide! Use a process that takes it out of the air.",
   "tooLow": "Too little carbon dioxide! Use a process that releases it.",
   "explain": "Photosynthesis removes carbon dioxide from the air; respiration and decomposition return it. Together they keep the carbon cycle in balance."
  }
 ],
 "data": [
  {
   "id": "d-enzyme-temp",
   "code": "BIO.A.2.3.2",
   "steels": "3.1.9-12.F",
   "title": "An enzyme at different temperatures",
   "xlabel": "Temperature",
   "ylabel": "Reaction rate (product made per minute)",
   "categories": [
    "10 °C",
    "25 °C",
    "37 °C",
    "45 °C",
    "60 °C"
   ],
   "values": [
    10,
    36,
    68,
    38,
    4
   ],
   "questions": [
    {
     "prompt": "At which temperature did this enzyme work best?",
     "answer": 2,
     "hint": "Find the tallest bar.",
     "explain": "The rate was highest at 37 °C, body temperature. That is this enzyme's optimum temperature."
    },
    {
     "prompt": "At which temperature was the enzyme most likely denatured (its shape changed by heat)?",
     "answer": 4,
     "hint": "Look for the hottest temperature where the rate crashed.",
     "explain": "At 60 °C the rate nearly stopped: high heat changed the active site's shape."
    },
    {
     "prompt": "At which temperature was the enzyme slow but NOT damaged, because molecules were moving slowly?",
     "answer": 0,
     "hint": "Cold slows molecules down without changing the enzyme's shape.",
     "explain": "At 10 °C molecules move slowly and collide less often, so the rate is low, but the enzyme still works when warmed."
    }
   ]
  },
  {
   "id": "d-pyramid",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "title": "Energy in a meadow food web",
   "xlabel": "Trophic level",
   "ylabel": "Energy available (kilocalories)",
   "categories": [
    "Producers",
    "Primary consumers",
    "Secondary consumers",
    "Tertiary consumers"
   ],
   "values": [
    10000,
    1000,
    100,
    10
   ],
   "questions": [
    {
     "prompt": "Which trophic level has the MOST energy available?",
     "answer": 0,
     "hint": "Find the tallest bar.",
     "explain": "Producers capture energy from sunlight, so they have the most energy."
    },
    {
     "prompt": "Which trophic level has the LEAST energy available?",
     "answer": 3,
     "hint": "Only about 10% passes up each level.",
     "explain": "Top predators get only a tiny fraction of the original energy."
    },
    {
     "prompt": "A snake eats frogs. Frogs eat insects. Insects eat leaves. Which trophic level is the snake?",
     "answer": 3,
     "hint": "Count up from the producer: leaves, then insects, then frogs, then...",
     "explain": "Leaves are producers, insects are primary consumers, frogs are secondary consumers, and the snake is a tertiary consumer."
    }
   ]
  }
 ],
 "mazes": [
  {
   "id": "maze-trophic",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "title": "Climb the energy pyramid: go through the doorway for the next level up",
   "start": "Sun",
   "steps": [
    {
     "label": "Producer",
     "hint": "What captures the Sun's energy first?",
     "why": "Producers like grass capture light energy by photosynthesis."
    },
    {
     "label": "Primary consumer",
     "hint": "What eats the producers?",
     "why": "Primary consumers (herbivores) like rabbits eat producers."
    },
    {
     "label": "Secondary consumer",
     "hint": "What eats the herbivores?",
     "why": "Secondary consumers like foxes eat primary consumers."
    },
    {
     "label": "Tertiary consumer",
     "hint": "What eats the secondary consumers?",
     "why": "Tertiary consumers like hawks are near the top of the pyramid."
    }
   ],
   "extra": [
    "Decomposer",
    "Sun"
   ],
   "explain": "Energy flows from the Sun to producers, then up through consumers. Only about 10% passes up each level."
  }
 ],
 "sequences": [
  {
   "id": "s-dehydration",
   "code": "BIO.A.2.2.2",
   "steels": "3.1.9-12.F",
   "title": "Dehydration synthesis: join two glucose monomers",
   "steps": [
    "Two glucose monomers line up side by side",
    "An -OH from one and an -H from the other are removed",
    "The removed atoms form a water molecule (H₂O)",
    "A new bond links the two glucose units"
   ],
   "hint": "Something is removed before the new bond can form.",
   "explain": "Dehydration synthesis removes water to join monomers. Hydrolysis adds water to split them apart again."
  },
  {
   "id": "s-energy-path",
   "code": "BIO.A.3.2.1",
   "steels": "3.1.9-12.H",
   "title": "Follow the energy from the Sun to your muscles",
   "steps": [
    "Light energy from the Sun",
    "Chloroplasts store it in glucose",
    "You eat food that contains glucose",
    "Mitochondria break down the glucose",
    "The energy is stored in ATP",
    "ATP powers your muscles"
   ],
   "hint": "Energy starts in the Sun and ends doing work in a cell.",
   "explain": "Photosynthesis stores light energy in glucose; cellular respiration moves it into ATP, which powers cell work."
  },
  {
   "id": "s-food-chain",
   "code": "BIO.B.4.2.1",
   "steels": "3.1.9-12.J",
   "title": "Build a food chain: follow the energy",
   "steps": [
    "Sun",
    "Grass (producer)",
    "Grasshopper (primary consumer)",
    "Mouse (secondary consumer)",
    "Snake (tertiary consumer)"
   ],
   "hint": "Start where the energy comes from, then follow who eats whom.",
   "explain": "Energy flows from the Sun to producers, then to each consumer that eats the one before it."
  }
 ],
 "wordbanks": [
  {
   "id": "wb-water",
   "steels": "3.1.9-12.F",
   "words": [
    "cohesion",
    "adhesion",
    "specific heat",
    "less dense",
    "solvent",
    "nonpolar"
   ],
   "sentences": [
    {
     "text": "Water molecules stick to each other. This is called ___.",
     "answer": "cohesion",
     "code": "BIO.A.2.1.1",
     "explain": "Cohesion: water sticking to water."
    },
    {
     "text": "Water also sticks to other surfaces, like the inside of a plant stem. This is ___.",
     "answer": "adhesion",
     "code": "BIO.A.2.1.1",
     "explain": "Adhesion: water sticking to other surfaces."
    },
    {
     "text": "Oceans and lakes change temperature slowly because water has a high ___.",
     "answer": "specific heat",
     "code": "BIO.A.2.1.1",
     "explain": "High specific heat keeps habitats stable."
    },
    {
     "text": "Ice floats because solid water is ___ than liquid water.",
     "answer": "less dense",
     "code": "BIO.A.2.1.1",
     "explain": "Ice is less dense, so it floats and insulates the water below."
    },
    {
     "text": "Many substances dissolve in water, so water is a good ___.",
     "answer": "solvent",
     "code": "BIO.A.2.1.1",
     "explain": "Water dissolves many substances, so it carries nutrients in living things."
    }
   ]
  },
  {
   "id": "wb-enzyme",
   "steels": "3.1.9-12.F",
   "words": [
    "catalyst",
    "substrate",
    "active site",
    "lowers",
    "denatured",
    "raises"
   ],
   "sentences": [
    {
     "text": "An enzyme is a ___: it speeds up a reaction without being used up.",
     "answer": "catalyst",
     "code": "BIO.A.2.3.1",
     "explain": "Enzymes are biological catalysts."
    },
    {
     "text": "The molecule an enzyme acts on is called its ___.",
     "answer": "substrate",
     "code": "BIO.A.2.3.1",
     "explain": "The substrate is the molecule the enzyme works on."
    },
    {
     "text": "The substrate fits into a pocket on the enzyme called the ___.",
     "answer": "active site",
     "code": "BIO.A.2.3.1",
     "explain": "The active site is where the substrate binds."
    },
    {
     "text": "An enzyme speeds up a reaction because it ___ the activation energy.",
     "answer": "lowers",
     "code": "BIO.A.2.3.1",
     "explain": "Enzymes lower the activation energy needed to start a reaction."
    },
    {
     "text": "Very high heat changes an enzyme's shape, so the enzyme is ___.",
     "answer": "denatured",
     "code": "BIO.A.2.3.2",
     "explain": "A denatured enzyme has lost its shape and stops working."
    }
   ]
  },
  {
   "id": "wb-cycles",
   "steels": "3.1.9-12.K",
   "words": [
    "photosynthesis",
    "respiration",
    "decomposers",
    "combustion",
    "bacteria",
    "heat"
   ],
   "sentences": [
    {
     "text": "Plants take carbon dioxide out of the air during ___.",
     "answer": "photosynthesis",
     "code": "BIO.B.4.2.3",
     "explain": "Photosynthesis removes carbon dioxide from the air."
    },
    {
     "text": "Living things return carbon dioxide to the air through cellular ___.",
     "answer": "respiration",
     "code": "BIO.B.4.2.3",
     "explain": "Cellular respiration releases carbon dioxide."
    },
    {
     "text": "___ break down dead organisms and return nutrients to the soil.",
     "answer": "decomposers",
     "code": "BIO.B.4.2.3",
     "explain": "Decomposers recycle nutrients."
    },
    {
     "text": "Burning fossil fuels, called ___, adds carbon dioxide to the air.",
     "answer": "combustion",
     "code": "BIO.B.4.2.3",
     "explain": "Combustion releases carbon stored in fossil fuels."
    },
    {
     "text": "Soil ___ change nitrogen gas into a form plants can use.",
     "answer": "bacteria",
     "code": "BIO.B.4.2.3",
     "explain": "Nitrogen-fixing bacteria make nitrogen usable for plants."
    },
    {
     "text": "Energy is not recycled. At each step of a food chain, much of it is lost as ___.",
     "answer": "heat",
     "code": "BIO.B.4.2.1",
     "explain": "Energy flows one way and leaves the ecosystem as heat."
    }
   ]
  }
 ],
 "scans": [
  {
   "id": "s2-drop",
   "name": "Water drop",
   "look": "drop",
   "color": "#7fd4ff",
   "word": "Polar",
   "def": "Having a slightly positive end and a slightly negative end.",
   "note": "A water molecule has a slightly negative end (oxygen) and slightly positive ends (hydrogens). That makes it POLAR, like a tiny magnet, so water molecules pull on each other."
  },
  {
   "id": "s2-strider",
   "name": "Water strider",
   "look": "critter",
   "color": "#5a4a3a",
   "word": "Cohesion",
   "def": "Water molecules sticking to each other.",
   "note": "Water molecules stick together so strongly that this bug can walk on the surface. Water sticking to water is COHESION."
  },
  {
   "id": "s2-tube",
   "name": "Plant stem",
   "look": "sprout",
   "color": "#7be06a",
   "word": "Adhesion",
   "def": "Water sticking to other surfaces.",
   "note": "Water climbs the thin tubes inside a stem because it sticks to the tube walls (ADHESION) and pulls more water along behind it (cohesion)."
  },
  {
   "id": "s2-lake",
   "name": "Lake",
   "look": "ice",
   "color": "#2a7fb8",
   "word": "Specific heat",
   "def": "How much energy it takes to change a substance's temperature.",
   "note": "The lake stays cool on hot days and warm on cold nights. Water has a high SPECIFIC HEAT: it takes a lot of energy to change its temperature, so habitats stay steady."
  },
  {
   "id": "s2-ice",
   "name": "Floating ice",
   "look": "ice",
   "color": "#e8f8ff",
   "word": "Density",
   "def": "How tightly packed the matter in something is.",
   "note": "Ice floats because it is LESS DENSE than liquid water. The ice on top insulates the lake, so fish survive the winter in the water below."
  },
  {
   "id": "s2-salt",
   "name": "Salt crystals",
   "look": "crystal",
   "color": "#ffffff",
   "word": "Solvent",
   "def": "A liquid that dissolves other substances.",
   "note": "Salt disappears in water because water pulls it apart. Water dissolves so many things that it is called the universal SOLVENT. That is how blood and sap carry nutrients."
  },
  {
   "id": "s2-carbon",
   "name": "Carbon atom",
   "look": "atom",
   "color": "#30343a",
   "word": "Carbon",
   "def": "The element that forms the backbone of life's molecules.",
   "note": "CARBON can make FOUR strong bonds, so it links into long chains, branches, and rings. That is why carbon is the backbone of every big molecule of life."
  },
  {
   "id": "s2-chain",
   "name": "Carbon chain",
   "look": "chain",
   "color": "#ffd166",
   "word": "Organic molecule",
   "def": "A carbon-based molecule, like a sugar, fat, or protein.",
   "note": "Molecules built on carbon chains, like sugars, fats, and proteins, are ORGANIC molecules. Living things are built from them."
  },
  {
   "id": "s2-monomer",
   "name": "Glucose",
   "look": "blob",
   "color": "#ffd166",
   "word": "Monomer",
   "def": "A single building block of a larger molecule.",
   "note": "A MONOMER is one building block, like one bead. Glucose is a monomer."
  },
  {
   "id": "s2-polymer",
   "name": "Starch",
   "look": "chain",
   "color": "#ffd166",
   "word": "Polymer",
   "def": "A large molecule made of many monomers joined together.",
   "note": "A POLYMER is a long chain of monomers joined together, like a necklace of beads. Starch is a polymer made of glucose."
  },
  {
   "id": "s2-dehyd",
   "name": "Water drip",
   "look": "drop",
   "color": "#7fd4ff",
   "word": "Dehydration synthesis",
   "def": "Joining monomers by removing water.",
   "note": "When two monomers join, a water molecule is removed: DEHYDRATION SYNTHESIS. Adding water to split them apart is HYDROLYSIS."
  },
  {
   "id": "s2-carb",
   "name": "Potato",
   "look": "rock",
   "color": "#c8a060",
   "word": "Carbohydrate",
   "def": "Sugars and starches, used for energy and structure.",
   "note": "Potatoes store energy as starch, a CARBOHYDRATE. Carbohydrates give quick energy. Cellulose, another carbohydrate, builds plant cell walls."
  },
  {
   "id": "s2-lipid",
   "name": "Oil drop",
   "look": "drop",
   "color": "#ffd98a",
   "word": "Lipid",
   "def": "Fats, oils, and membrane molecules that do not mix with water.",
   "note": "Fats, oils, and the phospholipids in cell membranes are LIPIDS. They store lots of energy and do not mix with water."
  },
  {
   "id": "s2-protein",
   "name": "Muscle fiber",
   "look": "rod",
   "color": "#ff8fb1",
   "word": "Protein",
   "def": "A folded chain of amino acids; its shape decides its job.",
   "note": "PROTEINS are chains of amino acids folded into shapes. Their shape decides their job: enzymes, muscle, hemoglobin, and antibodies are all proteins."
  },
  {
   "id": "s2-nucleic",
   "name": "DNA",
   "look": "helix",
   "color": "#7fd4ff",
   "word": "Nucleic acid",
   "def": "DNA or RNA: chains of nucleotides that carry genetic information.",
   "note": "DNA and RNA are NUCLEIC ACIDS, chains of nucleotides that store and carry genetic information."
  },
  {
   "id": "s2-enzyme",
   "name": "Enzyme",
   "look": "blob",
   "color": "#c59cff",
   "word": "Enzyme",
   "def": "A protein that speeds up a chemical reaction (a catalyst).",
   "note": "An ENZYME is a protein that speeds up a reaction. It is a catalyst: it is not used up, so it works again and again."
  },
  {
   "id": "s2-site",
   "name": "Active site",
   "look": "cell",
   "color": "#c59cff",
   "word": "Active site",
   "def": "The pocket on an enzyme where the substrate fits.",
   "note": "Every enzyme has a pocket called the ACTIVE SITE. Only a substrate with the right shape fits, like a key in a lock."
  },
  {
   "id": "s2-substrate",
   "name": "Substrate",
   "look": "blob",
   "color": "#ffd166",
   "word": "Substrate",
   "def": "The molecule an enzyme acts on.",
   "note": "The molecule an enzyme works on is its SUBSTRATE. Amylase's substrate is starch."
  },
  {
   "id": "s2-energy",
   "name": "Energy hill",
   "look": "stack",
   "color": "#ff9f6e",
   "word": "Activation energy",
   "def": "The energy needed to start a reaction.",
   "note": "Reactions need a push to get started: ACTIVATION ENERGY. Enzymes lower it, so reactions happen fast at body temperature."
  },
  {
   "id": "s2-heat",
   "name": "Hot spring",
   "look": "crystal",
   "color": "#ff6b6b",
   "word": "Denature",
   "def": "When heat or pH changes a protein's shape so it stops working.",
   "note": "Too much heat or the wrong pH changes an enzyme's shape. The active site no longer fits, and the enzyme is DENATURED."
  },
  {
   "id": "s2-ph",
   "name": "Stomach acid",
   "look": "drop",
   "color": "#c8ff7a",
   "word": "pH",
   "def": "A scale of how acidic or basic something is.",
   "note": "pH tells how acidic or basic something is. Each enzyme has a best pH: pepsin in the stomach works at pH 2; enzymes in the small intestine work near pH 8."
  },
  {
   "id": "s2-chloro",
   "name": "Chloroplast",
   "look": "stack",
   "color": "#5fbf5a",
   "word": "Chloroplast",
   "def": "The organelle where photosynthesis happens.",
   "note": "CHLOROPLASTS are the organelles in plant cells where photosynthesis happens. Their green pigment, chlorophyll, captures light energy."
  },
  {
   "id": "s2-photo",
   "name": "Sunlit leaf",
   "look": "lily",
   "color": "#3f9a4a",
   "word": "Photosynthesis",
   "def": "Using light energy to make glucose from carbon dioxide and water.",
   "note": "PHOTOSYNTHESIS: carbon dioxide + water + light energy → glucose + oxygen. Light energy becomes chemical energy stored in glucose."
  },
  {
   "id": "s2-stoma",
   "name": "Leaf pore",
   "look": "eggs",
   "color": "#bfe9a0",
   "word": "Stomata",
   "def": "Tiny pores in leaves that let gases in and out.",
   "note": "Tiny pores on leaves called STOMATA let carbon dioxide in and let oxygen and water vapor out."
  },
  {
   "id": "s2-mito",
   "name": "Mitochondrion",
   "look": "rod",
   "color": "#ff9f6e",
   "word": "Cellular respiration",
   "def": "Releasing the energy in glucose to make ATP.",
   "note": "CELLULAR RESPIRATION happens in mitochondria: glucose + oxygen → carbon dioxide + water + ATP energy. It runs day and night in every cell."
  },
  {
   "id": "s2-atp",
   "name": "ATP",
   "look": "blob",
   "color": "#c8ff7a",
   "word": "ATP",
   "def": "The molecule that carries usable energy in cells.",
   "note": "ATP is the cell's energy carrier, like a charged battery. When a phosphate breaks off (ATP → ADP), energy is released for cell work."
  },
  {
   "id": "s2-plant",
   "name": "Plant cell",
   "look": "cell",
   "color": "#7be06a",
   "word": "Producer",
   "def": "An organism that makes its own food.",
   "note": "Plants are PRODUCERS: they make glucose by photosynthesis. They also do cellular respiration in their mitochondria to release that energy as ATP."
  },
  {
   "id": "s2-grass",
   "name": "Grass",
   "look": "grass",
   "color": "#6ac04a",
   "word": "Trophic level",
   "def": "Each feeding step in a food chain.",
   "note": "Grass is a producer, the first TROPHIC LEVEL. All the energy in this meadow starts with producers capturing sunlight."
  },
  {
   "id": "s2-rabbit",
   "name": "Rabbit",
   "look": "critter",
   "color": "#c8b09a",
   "word": "Consumer",
   "def": "An organism that eats other living things for energy.",
   "note": "CONSUMERS eat other living things. This rabbit eats grass, so it is a PRIMARY consumer (an herbivore)."
  },
  {
   "id": "s2-fox",
   "name": "Fox",
   "look": "critter",
   "color": "#e07a30",
   "word": "Predator",
   "def": "An animal that hunts and eats other animals.",
   "note": "The fox eats rabbits: a PREDATOR and a SECONDARY consumer. A hawk that ate the fox would be a tertiary consumer."
  },
  {
   "id": "s2-mushroom",
   "name": "Mushroom",
   "look": "mushroom",
   "color": "#c0503a",
   "word": "Decomposer",
   "def": "An organism that breaks down dead matter.",
   "note": "DECOMPOSERS like fungi and bacteria break down dead things and return nutrients to the soil, so matter can be used again."
  },
  {
   "id": "s2-pyramid",
   "name": "Energy pyramid",
   "look": "stack",
   "color": "#ffd166",
   "word": "Energy pyramid",
   "def": "A diagram showing less energy at each higher trophic level.",
   "note": "Only about 10% of the energy at one level passes to the next. The rest is used to live or lost as heat. That is why an ENERGY PYRAMID is narrow at the top."
  },
  {
   "id": "s2-sun",
   "name": "Sunlight",
   "look": "sun",
   "color": "#ffd166",
   "word": "Energy flow",
   "def": "Energy moving one way through an ecosystem.",
   "note": "Energy enters ecosystems as sunlight and leaves as heat. It FLOWS one way and is not recycled, unlike matter."
  },
  {
   "id": "s2-cycle",
   "name": "Carbon in the air",
   "look": "atom",
   "color": "#30343a",
   "word": "Carbon cycle",
   "def": "The path carbon takes between air, living things, soil, and fossil fuels.",
   "note": "Carbon moves in a loop: plants take in CO₂, animals eat plants, and respiration, decomposition, and burning return CO₂ to the air. MATTER cycles."
  },
  {
   "id": "s2-clover",
   "name": "Clover roots",
   "look": "sprout",
   "color": "#7be06a",
   "word": "Nitrogen cycle",
   "def": "The path nitrogen takes through air, soil, and living things.",
   "note": "Bacteria in soil and in clover roots change nitrogen gas into a form plants can use. This is part of the NITROGEN CYCLE."
  }
 ],
 "vocab": [
  {
   "term": "Polar",
   "def": "Having a slightly positive end and a slightly negative end."
  },
  {
   "term": "Cohesion",
   "def": "Water molecules sticking to each other."
  },
  {
   "term": "Adhesion",
   "def": "Water sticking to other surfaces."
  },
  {
   "term": "Specific heat",
   "def": "How much energy it takes to change a substance's temperature."
  },
  {
   "term": "Density",
   "def": "How tightly packed the matter in something is."
  },
  {
   "term": "Solvent",
   "def": "A liquid that dissolves other substances."
  },
  {
   "term": "Carbon",
   "def": "The element that forms the backbone of life's molecules."
  },
  {
   "term": "Organic molecule",
   "def": "A carbon-based molecule, like a sugar, fat, or protein."
  },
  {
   "term": "Monomer",
   "def": "A single building block of a larger molecule."
  },
  {
   "term": "Polymer",
   "def": "A large molecule made of many monomers joined together."
  },
  {
   "term": "Dehydration synthesis",
   "def": "Joining monomers by removing water."
  },
  {
   "term": "Carbohydrate",
   "def": "Sugars and starches, used for energy and structure."
  },
  {
   "term": "Lipid",
   "def": "Fats, oils, and membrane molecules that do not mix with water."
  },
  {
   "term": "Protein",
   "def": "A folded chain of amino acids; its shape decides its job."
  },
  {
   "term": "Nucleic acid",
   "def": "DNA or RNA: chains of nucleotides that carry genetic information."
  },
  {
   "term": "Enzyme",
   "def": "A protein that speeds up a chemical reaction (a catalyst)."
  },
  {
   "term": "Active site",
   "def": "The pocket on an enzyme where the substrate fits."
  },
  {
   "term": "Substrate",
   "def": "The molecule an enzyme acts on."
  },
  {
   "term": "Activation energy",
   "def": "The energy needed to start a reaction."
  },
  {
   "term": "Denature",
   "def": "When heat or pH changes a protein's shape so it stops working."
  },
  {
   "term": "pH",
   "def": "A scale of how acidic or basic something is."
  },
  {
   "term": "Chloroplast",
   "def": "The organelle where photosynthesis happens."
  },
  {
   "term": "Photosynthesis",
   "def": "Using light energy to make glucose from carbon dioxide and water."
  },
  {
   "term": "Stomata",
   "def": "Tiny pores in leaves that let gases in and out."
  },
  {
   "term": "Cellular respiration",
   "def": "Releasing the energy in glucose to make ATP."
  },
  {
   "term": "ATP",
   "def": "The molecule that carries usable energy in cells."
  },
  {
   "term": "Producer",
   "def": "An organism that makes its own food."
  },
  {
   "term": "Trophic level",
   "def": "Each feeding step in a food chain."
  },
  {
   "term": "Consumer",
   "def": "An organism that eats other living things for energy."
  },
  {
   "term": "Predator",
   "def": "An animal that hunts and eats other animals."
  },
  {
   "term": "Decomposer",
   "def": "An organism that breaks down dead matter."
  },
  {
   "term": "Energy pyramid",
   "def": "A diagram showing less energy at each higher trophic level."
  },
  {
   "term": "Energy flow",
   "def": "Energy moving one way through an ecosystem."
  },
  {
   "term": "Carbon cycle",
   "def": "The path carbon takes between air, living things, soil, and fossil fuels."
  },
  {
   "term": "Nitrogen cycle",
   "def": "The path nitrogen takes through air, soil, and living things."
  },
  {
   "term": "Hydrolysis",
   "def": "Breaking a polymer into monomers by adding water."
  },
  {
   "term": "Catalyst",
   "def": "Something that speeds up a reaction without being used up."
  },
  {
   "term": "Decomposition",
   "def": "Breaking down dead matter, returning carbon and nutrients to the soil and air."
  },
  {
   "term": "Transpiration",
   "def": "Release of water vapor from plant leaves into the air."
  }
 ]
});

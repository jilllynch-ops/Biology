/* WORLD 3 QUESTION FILE: Ecosystems: Interdependence and Disruptions
   Teachers: you can edit the words inside the quotation marks below.
   - "code" is the Keystone Eligible Content code. "steels" is the PA STEELS standard.
   - In "questions", "answer" is the position of the correct option, counting from 0
     (0 = first option). The game shuffles the options, so the right answer can always go first.
   - "hint" shows after a wrong try. "explain" shows after the right answer.
   - "tags": ["boss"] marks boss-battle questions.
   - Keep every comma, bracket, and quotation mark in place. */
FieldGuide.registerQuestions(3, {
 "tokens": [
  {
   "id": "biotic-factors",
   "code": "BIO.B.4.1.2",
   "steels": "3.1.9-12.L",
   "prompt": "Collect only BIOTIC factors: things that are living or were once living",
   "good": [
    "Oak tree",
    "Earthworms",
    "Mushrooms on a log",
    "Bacteria in the soil",
    "A fallen leaf",
    "White-tailed deer"
   ],
   "bad": [
    {
     "text": "Sunlight",
     "explain": "Sunlight is abiotic: a nonliving part of the ecosystem."
    },
    {
     "text": "Rainfall",
     "explain": "Rain is abiotic: water is not alive."
    },
    {
     "text": "Minerals in the soil",
     "explain": "Minerals are abiotic. Soil holds living things, but minerals themselves are not alive."
    },
    {
     "text": "Air temperature",
     "explain": "Temperature is an abiotic factor."
    }
   ]
  },
  {
   "id": "limiting",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "prompt": "Collect only LIMITING FACTORS that can keep a deer population from growing",
   "good": [
    "Shortage of food",
    "Predators such as wolves",
    "Disease",
    "Too little space for shelter",
    "A harsh, snowy winter",
    "Shortage of water"
   ],
   "bad": [
    {
     "text": "More fawns born each spring",
     "explain": "A higher birth rate makes the population grow. A limiting factor slows growth."
    },
    {
     "text": "Plenty of food all year",
     "explain": "Plenty of food lets the population grow. A SHORTAGE of food is the limiting factor."
    },
    {
     "text": "Wolves leave the area",
     "explain": "Losing predators removes a limit, so the deer population grows."
    },
    {
     "text": "A mild winter",
     "explain": "A mild winter lets more deer survive, so the population grows."
    }
   ]
  },
  {
   "id": "invasive-traits",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "Collect the traits that help an INVASIVE species take over a new ecosystem",
   "good": [
    "Reproduces quickly",
    "No natural predators in its new home",
    "Eats many kinds of food",
    "Spreads easily to new places",
    "Out-competes native species"
   ],
   "bad": [
    {
     "text": "Has many predators in its new home",
     "explain": "Predators would keep it in check. Invasive species usually escape their natural predators."
    },
    {
     "text": "Can eat only one rare food",
     "explain": "A picky eater spreads slowly. Invaders usually eat many foods."
    },
    {
     "text": "Reproduces once every few years",
     "explain": "Slow reproduction keeps numbers low. Invaders usually reproduce fast."
    },
    {
     "text": "Has lived here for thousands of years",
     "explain": "That describes a native species, not an invasive one."
    }
   ]
  }
 ],
 "sorts": [
  {
   "id": "interaction",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "prompt": "Which kind of relationship is it?",
   "options": [
    "Predation",
    "Competition",
    "Mutualism",
    "Commensalism",
    "Parasitism"
   ],
   "hint": "Predation: one eats the other. Competition: both want the same resource. Mutualism: both benefit. Commensalism: one benefits, the other is unaffected. Parasitism: one benefits, the host is harmed.",
   "items": [
    {
     "text": "An owl catches and eats a mouse",
     "answer": 0,
     "explain": "The owl (predator) kills and eats the mouse (prey): predation."
    },
    {
     "text": "Two lions fight over the same zebra",
     "answer": 1,
     "explain": "Both want the same limited resource: competition."
    },
    {
     "text": "Bees drink nectar and pollinate the flowers",
     "answer": 2,
     "explain": "Both benefit: mutualism."
    },
    {
     "text": "Barnacles ride on a whale's skin",
     "answer": 3,
     "explain": "The barnacles get a ride to food; the whale is not helped or harmed: commensalism."
    },
    {
     "text": "A tick feeds on a dog's blood",
     "answer": 4,
     "explain": "The tick benefits and the dog (host) is harmed: parasitism."
    },
    {
     "text": "A clownfish hides in a sea anemone and chases off its predators",
     "answer": 2,
     "explain": "The clownfish gets protection and the anemone is defended: mutualism."
    },
    {
     "text": "Oak and maple seedlings grow toward the same patch of sunlight",
     "answer": 1,
     "explain": "Both need the same limited light: competition."
    },
    {
     "text": "A tapeworm lives in a dog's intestine",
     "answer": 4,
     "explain": "The tapeworm takes nutrients from its host: parasitism."
    }
   ]
  },
  {
   "id": "succession",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "Primary or secondary succession?",
   "options": [
    "Primary succession",
    "Secondary succession"
   ],
   "hint": "Primary: starts on bare rock with NO soil. Secondary: starts where soil is still there after a disturbance.",
   "items": [
    {
     "text": "Lava cools into brand-new rock",
     "answer": 0,
     "explain": "New rock has no soil, so life must start from scratch: primary succession."
    },
    {
     "text": "A glacier melts back and leaves bare rock",
     "answer": 0,
     "explain": "Bare rock with no soil: primary succession."
    },
    {
     "text": "A forest fire burns the trees, but the soil remains",
     "answer": 1,
     "explain": "The soil survived, so plants regrow quickly: secondary succession."
    },
    {
     "text": "An abandoned farm field slowly turns into forest",
     "answer": 1,
     "explain": "The field still has soil: secondary succession."
    },
    {
     "text": "A volcano forms a new island in the ocean",
     "answer": 0,
     "explain": "A new island starts as bare rock: primary succession."
    },
    {
     "text": "A hurricane knocks down trees in a forest",
     "answer": 1,
     "explain": "The soil is still there after the storm: secondary succession."
    }
   ]
  }
 ],
 "questions": [
  {
   "id": "w3q01",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "prompt": "All the largemouth bass living in one lake make up a...",
   "options": [
    "population",
    "community",
    "ecosystem",
    "biome"
   ],
   "answer": 0,
   "hint": "One species, one place.",
   "explain": "A population is all the members of ONE species living in the same area."
  },
  {
   "id": "w3q02",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "prompt": "Which level of ecological organization includes BOTH living things and nonliving things like water and soil?",
   "options": [
    "ecosystem",
    "community",
    "population",
    "organism"
   ],
   "answer": 0,
   "hint": "Which level adds the nonliving surroundings?",
   "explain": "An ecosystem is a community of living things plus the abiotic factors around them."
  },
  {
   "id": "w3q03",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "prompt": "A biologist lists every species of plant, insect, bird, and fungus in a meadow. Which level is she studying?",
   "options": [
    "community",
    "population",
    "organism",
    "biosphere"
   ],
   "answer": 0,
   "hint": "Many different species living together...",
   "explain": "A community is all the populations of different species living in one area."
  },
  {
   "id": "w3q04",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "prompt": "Which list goes from SMALLEST to LARGEST?",
   "options": [
    "organism, population, community, ecosystem, biome, biosphere",
    "population, organism, ecosystem, community, biome, biosphere",
    "biosphere, biome, ecosystem, community, population, organism",
    "organism, community, population, biome, ecosystem, biosphere"
   ],
   "answer": 0,
   "hint": "Start with one living thing.",
   "explain": "One organism, many of its kind (population), many species (community), plus nonliving factors (ecosystem), similar ecosystems (biome), all of Earth (biosphere)."
  },
  {
   "id": "w3q05",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "prompt": "Which level includes every ecosystem on Earth?",
   "options": [
    "biosphere",
    "biome",
    "community",
    "population"
   ],
   "answer": 0,
   "hint": "It is the biggest level of all.",
   "explain": "The biosphere is all the parts of Earth where life exists."
  },
  {
   "id": "w3q06",
   "code": "BIO.B.4.1.2",
   "steels": "3.1.9-12.L",
   "prompt": "Which is an ABIOTIC factor in a pond ecosystem?",
   "options": [
    "water temperature",
    "algae",
    "frogs",
    "bacteria"
   ],
   "answer": 0,
   "hint": "Abiotic means not living.",
   "explain": "Water temperature is nonliving. Algae, frogs, and bacteria are all biotic."
  },
  {
   "id": "w3q07",
   "code": "BIO.B.4.1.2",
   "steels": "3.1.9-12.L",
   "prompt": "Which is a BIOTIC factor in a desert?",
   "options": [
    "a cactus",
    "sand",
    "sunlight",
    "low rainfall"
   ],
   "answer": 0,
   "hint": "Biotic means living or once living.",
   "explain": "A cactus is a living thing. Sand, sunlight, and rainfall are abiotic."
  },
  {
   "id": "w3q08",
   "code": "BIO.B.4.1.2",
   "steels": "3.1.9-12.L",
   "prompt": "Why is a dead, rotting log counted as a biotic factor?",
   "options": [
    "It was once living, and decomposers living in it break it down.",
    "It is made only of minerals.",
    "It is part of the weather.",
    "It can never change."
   ],
   "answer": 0,
   "hint": "Biotic includes things that WERE alive.",
   "explain": "Biotic factors are living or once-living things. A log came from a tree, and fungi and bacteria live in it."
  },
  {
   "id": "w3q09",
   "code": "BIO.B.4.1.2",
   "steels": "3.1.9-12.L",
   "prompt": "Which abiotic factor most limits which plants can grow on a dark forest floor?",
   "options": [
    "the amount of sunlight",
    "the number of deer",
    "the kinds of fungi",
    "the number of insects"
   ],
   "answer": 0,
   "hint": "Plants need light for photosynthesis.",
   "explain": "Tall trees block most light, so only shade-tolerant plants grow on the forest floor. Light is abiotic."
  },
  {
   "id": "w3q10",
   "code": "BIO.B.4.1.2",
   "steels": "3.1.9-12.L",
   "prompt": "A trout's habitat is a cold mountain stream. What is the trout's NICHE?",
   "options": [
    "its role: what it eats, when it feeds, and how it interacts with other species",
    "the stream itself",
    "the water temperature",
    "the rocks on the stream bottom"
   ],
   "answer": 0,
   "hint": "Habitat is the address; niche is the job.",
   "explain": "A habitat is where an organism lives. Its niche is its role in the ecosystem: its food, activity, and relationships."
  },
  {
   "id": "w3q11",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "prompt": "Ticks feed on a deer's blood. What type of relationship is this?",
   "options": [
    "parasitism",
    "mutualism",
    "commensalism",
    "competition"
   ],
   "answer": 0,
   "hint": "One benefits and one is harmed.",
   "explain": "The tick (parasite) benefits and the deer (host) is harmed: parasitism."
  },
  {
   "id": "w3q12",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "prompt": "Bees get nectar from flowers, and the flowers get pollinated. What type of relationship is this?",
   "options": [
    "mutualism",
    "parasitism",
    "commensalism",
    "predation"
   ],
   "answer": 0,
   "hint": "Who benefits?",
   "explain": "Both partners benefit, so it is mutualism."
  },
  {
   "id": "w3q13",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "prompt": "Two species of birds eat the same kind of seeds in a small area. What type of relationship is this?",
   "options": [
    "competition",
    "mutualism",
    "commensalism",
    "parasitism"
   ],
   "answer": 0,
   "hint": "They both need the same limited resource.",
   "explain": "When organisms need the same limited resource, they compete."
  },
  {
   "id": "w3q14",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "prompt": "Orchids grow on high tree branches to reach sunlight, without harming the tree. What type of relationship is this?",
   "options": [
    "commensalism",
    "mutualism",
    "parasitism",
    "predation"
   ],
   "answer": 0,
   "hint": "One benefits; the other is not helped or harmed.",
   "explain": "The orchid benefits and the tree is unaffected: commensalism."
  },
  {
   "id": "w3q15",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "prompt": "Wolves are removed from a forest. Soon the deer population grows quickly and young trees are eaten. What does this show?",
   "options": [
    "Predators help control prey populations, which affects the plants too.",
    "Wolves and deer are in a mutualism.",
    "Deer are a limiting factor for wolves only.",
    "Removing a species never changes an ecosystem."
   ],
   "answer": 0,
   "hint": "Follow the effect down the food chain.",
   "explain": "Predators keep prey populations in check. Without wolves, deer overeat young trees: one change ripples through the ecosystem."
  },
  {
   "id": "w3q16",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "After a forest fire, grasses appear first, then shrubs, then trees. What is this process called?",
   "options": [
    "secondary succession",
    "primary succession",
    "eutrophication",
    "competition"
   ],
   "answer": 0,
   "hint": "The soil survived the fire.",
   "explain": "Secondary succession is the regrowth of a community where soil remains after a disturbance."
  },
  {
   "id": "w3q17",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "Which organisms are usually the pioneer species on bare rock?",
   "options": [
    "lichens and mosses",
    "oak trees",
    "deer",
    "grasses that need deep soil"
   ],
   "answer": 0,
   "hint": "Pioneers must survive with no soil at all.",
   "explain": "Lichens and mosses can grow on bare rock and slowly break it down to start forming soil."
  },
  {
   "id": "w3q18",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "Zebra mussels, carried to the Great Lakes in ships' ballast water, now crowd out native mussels. What are zebra mussels there?",
   "options": [
    "an invasive species",
    "a keystone species",
    "a native species",
    "a pioneer species"
   ],
   "answer": 0,
   "hint": "They come from somewhere else and cause harm.",
   "explain": "An invasive species is a nonnative species that spreads and harms the ecosystem it moves into."
  },
  {
   "id": "w3q19",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "Fertilizer runoff causes an algal bloom in a lake. Why do many fish die afterward?",
   "options": [
    "Decomposers breaking down the dead algae use up the dissolved oxygen.",
    "The algae eat the fish.",
    "The fertilizer makes the water too cold.",
    "The algae block all the water from moving."
   ],
   "answer": 0,
   "hint": "What do decomposers use up as they work?",
   "explain": "When the algae die, decomposers break them down and use up oxygen in the water. Fish suffocate (eutrophication)."
  },
  {
   "id": "w3q20",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.N",
   "prompt": "Which action would most help a stream recover from erosion and fertilizer runoff?",
   "options": [
    "planting native trees and shrubs along the banks",
    "clearing all plants from the banks",
    "adding more fertilizer to nearby fields",
    "paving the land next to the stream"
   ],
   "answer": 0,
   "hint": "Roots hold soil and soak up extra nutrients.",
   "explain": "A buffer of native plants holds soil in place and absorbs runoff before it reaches the water."
  },
  {
   "id": "w3q21",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "prompt": "Why are ecosystems with high biodiversity usually more stable?",
   "options": [
    "If one species declines, other species can fill its role.",
    "They have fewer species to compete.",
    "They never have disturbances.",
    "Every species eats the same food."
   ],
   "answer": 0,
   "hint": "More species means more backups.",
   "explain": "With many species, the loss of one does not break the whole food web. Diverse ecosystems resist and recover from change better."
  },
  {
   "id": "w3q22",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "prompt": "What is carrying capacity?",
   "options": [
    "the largest population an environment can support over time",
    "the number of offspring one female can have",
    "the fastest a population can grow",
    "the number of species in a community"
   ],
   "answer": 0,
   "hint": "Think about how many the environment can 'carry'.",
   "explain": "Carrying capacity is the maximum population size the resources of an environment can support over time."
  },
  {
   "id": "w3q23",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "prompt": "Which is a density-INDEPENDENT limiting factor?",
   "options": [
    "a hurricane",
    "disease spreading in a crowded herd",
    "competition for food",
    "predation"
   ],
   "answer": 0,
   "hint": "Which one hits the same way no matter how crowded the population is?",
   "explain": "Weather events like hurricanes, floods, and fires affect populations regardless of their density."
  },
  {
   "id": "w3q24",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "prompt": "Bacteria with unlimited food and space double every 20 minutes. What kind of growth is this?",
   "options": [
    "exponential growth",
    "logistic growth",
    "zero growth",
    "carrying capacity"
   ],
   "answer": 0,
   "hint": "Doubling again and again makes a J-shaped curve.",
   "explain": "With no limits, a population grows exponentially (a J-shaped curve)."
  },
  {
   "id": "w3q25",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "prompt": "A species of frog lives only in one small wetland. Why is it at high risk of extinction?",
   "options": [
    "One disturbance, such as draining the wetland, could wipe out the whole species.",
    "Frogs cannot reproduce in wetlands.",
    "Small habitats have no limiting factors.",
    "It has too much genetic variety."
   ],
   "answer": 0,
   "hint": "All its eggs are in one basket.",
   "explain": "A species with a small range and population can be lost to a single disaster or habitat change."
  },
  {
   "id": "w3q26",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "prompt": "Which change would most likely make a rabbit population INCREASE?",
   "options": [
    "more food becomes available",
    "more foxes move in",
    "a disease spreads",
    "a long drought"
   ],
   "answer": 0,
   "hint": "Which change removes a limit?",
   "explain": "More food raises the carrying capacity, so the rabbit population can grow."
  },
  {
   "id": "w3q27",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.N",
   "prompt": "Fishing boats remove cod faster than the cod can reproduce. What is the most likely long-term result?",
   "options": [
    "The cod population declines and may collapse.",
    "The cod population grows faster.",
    "The cod evolve to reproduce instantly.",
    "Nothing changes in the ocean."
   ],
   "answer": 0,
   "hint": "Deaths are outpacing births.",
   "explain": "Overharvesting removes individuals faster than they are replaced, so the population shrinks and can collapse."
  }
 ],
 "pairs": [
  {
   "name": "Mutualism or commensalism?",
   "explain": "In mutualism BOTH partners benefit. In commensalism one benefits and the other is not helped or harmed.",
   "members": [
    {
     "label": "Mutualism",
     "level": "3-2",
     "ids": [
      "interaction.2",
      "interaction.5",
      "w3q12"
     ]
    },
    {
     "label": "Commensalism",
     "level": "3-2",
     "ids": [
      "interaction.3",
      "w3q14"
     ]
    }
   ]
  },
  {
   "name": "Primary or secondary succession?",
   "explain": "Primary succession starts on bare rock with no soil. Secondary succession starts where soil survived a disturbance.",
   "members": [
    {
     "label": "Primary succession",
     "level": "3-4",
     "ids": [
      "succession.0",
      "succession.1",
      "succession.4",
      "w3q17"
     ]
    },
    {
     "label": "Secondary succession",
     "level": "3-4",
     "ids": [
      "succession.2",
      "succession.3",
      "succession.5",
      "w3q16"
     ]
    }
   ]
  }
 ],
 "become": [
  {
   "id": "b-mutual",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "you": "a honeybee",
   "short": "Bee",
   "color": "#ffd166",
   "goal": "Go through the door where you AND your partner both benefit.",
   "doors": [
    {
     "kind": "flow",
     "label": "Flower: you get nectar, it gets pollinated",
     "ok": true
    },
    {
     "kind": "pump",
     "label": "Spider web: the spider eats you",
     "ok": false,
     "why": "That is predation: the spider benefits and you are eaten."
    },
    {
     "kind": "organelle",
     "label": "Another hive's honey: you both want it",
     "ok": false,
     "why": "That is competition: both of you want the same resource."
    }
   ],
   "explain": "Bees and flowers are a mutualism: the bee gets food and the flower gets pollinated, so both benefit."
  },
  {
   "id": "b-capacity",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "you": "a deer in a herd that has grown past what the forest can feed",
   "short": "Deer",
   "color": "#c8a070",
   "goal": "Go through the door that shows what really happens next.",
   "doors": [
    {
     "kind": "flow",
     "label": "Food runs short, so the herd shrinks back toward carrying capacity",
     "ok": true
    },
    {
     "kind": "pump",
     "label": "The herd keeps growing forever",
     "ok": false,
     "why": "No population grows forever. Limited food, space, and water stop the growth."
    },
    {
     "kind": "organelle",
     "label": "The forest grows extra food to match the herd",
     "ok": false,
     "why": "Plants cannot keep up. Overgrazing actually reduces the food supply."
    }
   ],
   "explain": "When a population overshoots its carrying capacity, limiting factors such as food shortage make it drop back."
  },
  {
   "id": "b-pioneer",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "you": "a lichen spore drifting after a volcano erupted",
   "short": "Lichen",
   "color": "#c8e07a",
   "goal": "Land where PRIMARY succession begins.",
   "doors": [
    {
     "kind": "organelle",
     "label": "Bare new lava rock (no soil yet)",
     "ok": true
    },
    {
     "kind": "flow",
     "label": "A burned forest that still has soil",
     "ok": false,
     "why": "If soil remains, regrowth is SECONDARY succession."
    },
    {
     "kind": "vesicle",
     "label": "An old-growth forest",
     "ok": false,
     "why": "An old-growth forest is a mature (climax) community, not a starting point."
    }
   ],
   "explain": "Primary succession starts on bare rock with no soil. Lichens are pioneer species that begin breaking rock into soil."
  },
  {
   "id": "b-solution",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.N",
   "you": "a conservation biologist",
   "short": "You",
   "color": "#7be0ad",
   "goal": "Choose the action that best protects the lake from algal blooms.",
   "doors": [
    {
     "kind": "flow",
     "label": "Plant native plants along the shore",
     "ok": true
    },
    {
     "kind": "pump",
     "label": "Spread more fertilizer on nearby lawns",
     "ok": false,
     "why": "Extra fertilizer washes into the lake and feeds MORE algae."
    },
    {
     "kind": "organelle",
     "label": "Drain the wetland to build houses",
     "ok": false,
     "why": "Wetlands filter nutrients out of runoff. Draining them makes blooms worse."
    }
   ],
   "explain": "Plant buffers and wetlands soak up nutrients before they reach the water, which helps prevent algal blooms."
  }
 ],
 "catches": [
  {
   "id": "c-levels",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "short": "Levels of ecology",
   "title": "Name the level: grab the level of ecological organization that matches each picture.",
   "cueLabel": "Picture",
   "builtLabel": "Levels named",
   "cueWord": "picture",
   "tokenWord": "level",
   "rule": "Organism, population, community, ecosystem: each level adds more.",
   "choices": [
    "Organism",
    "Population",
    "Community",
    "Ecosystem",
    "Cell",
    "Organ"
   ],
   "steps": [
    {
     "cue": "One deer",
     "need": "Organism"
    },
    {
     "cue": "All the deer in the forest",
     "need": "Population"
    },
    {
     "cue": "Deer, wolves, oaks, and fungi together",
     "need": "Community"
    },
    {
     "cue": "That community plus soil, water, and sunlight",
     "need": "Ecosystem"
    }
   ],
   "hint": "One individual? One species? Many species? Plus nonliving things?",
   "wrong": {
    "Cell": "A cell is inside an organism. Ecology starts at the organism level.",
    "Organ": "An organ is part of one organism. Ecology starts at the organism level."
   },
   "explain": "Organism, population (one species), community (many species), ecosystem (community plus abiotic factors)."
  },
  {
   "id": "c-symbiosis",
   "code": "BIO.B.4.2.2",
   "steels": "3.1.9-12.L",
   "short": "Relationships",
   "title": "Match each relationship to its name.",
   "cueLabel": "Relationship",
   "builtLabel": "Matched",
   "cueWord": "description",
   "tokenWord": "name",
   "rule": "Look at who benefits and who is harmed.",
   "choices": [
    "Mutualism",
    "Commensalism",
    "Parasitism",
    "Predation",
    "Competition",
    "Succession"
   ],
   "steps": [
    {
     "cue": "Both partners benefit",
     "need": "Mutualism"
    },
    {
     "cue": "One benefits, the other is not affected",
     "need": "Commensalism"
    },
    {
     "cue": "One lives on or in a host and harms it",
     "need": "Parasitism"
    },
    {
     "cue": "One hunts, kills, and eats the other",
     "need": "Predation"
    }
   ],
   "hint": "Who wins, and who loses or stays the same?",
   "wrong": {
    "Competition": "Competition is when both want the same limited resource.",
    "Succession": "Succession is how a community changes over time, not a relationship between two species."
   },
   "explain": "Mutualism (+/+), commensalism (+/0), parasitism (+/−), predation (one eats the other)."
  },
  {
   "id": "c-impact",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.N",
   "short": "Human impacts",
   "title": "Name the human impact: grab the term that matches each event.",
   "cueLabel": "Event",
   "builtLabel": "Impacts named",
   "cueWord": "event",
   "tokenWord": "impact",
   "rule": "Humans change ecosystems in several different ways.",
   "choices": [
    "Invasive species",
    "Nutrient pollution",
    "Habitat loss",
    "Overharvesting",
    "Succession",
    "Mutualism"
   ],
   "steps": [
    {
     "cue": "Zebra mussels arrive in ships' ballast water",
     "need": "Invasive species"
    },
    {
     "cue": "Fertilizer washes from farms into a lake",
     "need": "Nutrient pollution"
    },
    {
     "cue": "A forest is cleared to build a shopping mall",
     "need": "Habitat loss"
    },
    {
     "cue": "Boats catch cod faster than cod reproduce",
     "need": "Overharvesting"
    }
   ],
   "hint": "What is causing the harm in the highlighted event?",
   "wrong": {
    "Succession": "Succession is the natural change of a community over time.",
    "Mutualism": "Mutualism is a relationship where both partners benefit."
   },
   "explain": "Invasive species, nutrient pollution, habitat loss, and overharvesting are major ways humans disrupt ecosystems."
  }
 ],
 "data": [
  {
   "id": "d-deer",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "title": "Deer on an island (carrying capacity is about 100 deer)",
   "xlabel": "Year",
   "ylabel": "Number of deer",
   "categories": [
    "Year 1",
    "Year 3",
    "Year 5",
    "Year 7",
    "Year 9"
   ],
   "values": [
    20,
    60,
    140,
    90,
    100
   ],
   "questions": [
    {
     "prompt": "In which year did the deer population first go ABOVE the carrying capacity of about 100?",
     "answer": 2,
     "hint": "Find the first bar taller than 100.",
     "explain": "In Year 5 there were 140 deer, more than the island can feed. This is called overshoot."
    },
    {
     "prompt": "In which year was the population the smallest?",
     "answer": 0,
     "hint": "Find the shortest bar.",
     "explain": "Year 1 had only 20 deer. With plenty of food, the population then grew quickly."
    },
    {
     "prompt": "After the overshoot, food ran short. In which year was the population back AT carrying capacity?",
     "answer": 4,
     "hint": "Which bar is closest to 100 after the drop?",
     "explain": "By Year 9 the herd leveled off at about 100, the carrying capacity."
    }
   ]
  },
  {
   "id": "d-oxygen",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "title": "Dissolved oxygen along a stream that flows past a farm",
   "xlabel": "Sampling site",
   "ylabel": "Dissolved oxygen (mg/L)",
   "categories": [
    "Upstream",
    "Above farm",
    "Beside farm",
    "Below farm",
    "Far downstream"
   ],
   "values": [
    9,
    8,
    3,
    5,
    8
   ],
   "questions": [
    {
     "prompt": "Where was the dissolved oxygen LOWEST?",
     "answer": 2,
     "hint": "Find the shortest bar.",
     "explain": "Oxygen dropped to 3 mg/L beside the farm, where fertilizer runoff enters the stream."
    },
    {
     "prompt": "Trout need at least 6 mg/L of oxygen. Which site is the FIRST place downstream of the farm where trout could live again?",
     "answer": 4,
     "hint": "Look after the farm for a bar at 6 or more.",
     "explain": "Far downstream the oxygen recovered to 8 mg/L, enough for trout."
    },
    {
     "prompt": "Where would you expect the biggest algal bloom?",
     "answer": 2,
     "hint": "Algae blooms where nutrients enter, and then oxygen crashes as they decay.",
     "explain": "Fertilizer enters beside the farm. Algae bloom, die, and decomposers use up the oxygen there."
    }
   ]
  }
 ],
 "mazes": [
  {
   "id": "maze-succession",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "title": "Primary succession: go through the doorway for the next stage",
   "start": "Bare rock",
   "steps": [
    {
     "label": "Lichens and mosses",
     "hint": "What can grow on bare rock with no soil?",
     "why": "Pioneer species like lichens grow on bare rock and start making soil."
    },
    {
     "label": "Grasses and small plants",
     "hint": "A thin layer of soil has formed. What grows next?",
     "why": "Thin soil lets grasses and small plants take root."
    },
    {
     "label": "Shrubs",
     "hint": "The soil is getting deeper.",
     "why": "Deeper soil supports larger plants like shrubs."
    },
    {
     "label": "Trees (mature forest)",
     "hint": "What grows when the soil is deep and rich?",
     "why": "Trees form a mature (climax) community."
    }
   ],
   "extra": [
    "Bare rock",
    "Fire"
   ],
   "explain": "Primary succession: bare rock, then pioneer lichens and mosses, then grasses, shrubs, and finally trees."
  }
 ],
 "sequences": [
  {
   "id": "s-levels",
   "code": "BIO.B.4.1.1",
   "steels": "3.1.9-12.L",
   "title": "Zoom out: put the levels of ecology in order from smallest to largest",
   "steps": [
    "Population: all the deer in one forest",
    "Community: all the species living there together",
    "Ecosystem: the community plus water, soil, and sunlight",
    "Biome: many similar ecosystems across a region"
   ],
   "hint": "Each level includes the one before it.",
   "explain": "Population, community, ecosystem, biome: each level includes everything in the level before it. All biomes together make the biosphere."
  },
  {
   "id": "s-secondary",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "title": "Secondary succession after a forest fire",
   "steps": [
    "Fire clears the forest, but the soil remains",
    "Grasses and wildflowers sprout from the soil",
    "Shrubs and fast-growing trees move in",
    "A mature forest grows back"
   ],
   "hint": "Small, fast-growing plants come back first.",
   "explain": "Because soil remains, secondary succession is faster than primary: grasses, then shrubs, then a forest."
  },
  {
   "id": "s-bloom",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.M",
   "title": "How fertilizer runoff kills fish",
   "steps": [
    "Fertilizer runoff adds extra nutrients to a lake",
    "Algae grow fast and form a bloom",
    "The algae die and decomposers break them down",
    "Decomposers use up the oxygen, so fish die"
   ],
   "hint": "It starts with extra nutrients.",
   "explain": "This chain of events is called eutrophication. Reducing nutrient runoff prevents it."
  }
 ],
 "balances": [
  {
   "id": "bal-deer",
   "kind": "elevator",
   "code": "BIO.B.4.2.5",
   "steels": "3.1.9-12.I",
   "title": "Manage the deer herd: keep it near the forest's carrying capacity. The platform rises and falls with the herd.",
   "what": "Deer in the forest",
   "unit": "deer",
   "start": 100,
   "min": 40,
   "max": 180,
   "band": [
    85,
    115
   ],
   "danger": [
    55,
    150
   ],
   "hold": 10,
   "drift": 0.8,
   "event": {
    "every": 6,
    "delta": 14,
    "msg": "A mild winter! More fawns survive than usual."
   },
   "controls": [
    {
     "label": "Bring back wolves (predators)",
     "delta": -12
    },
    {
     "label": "Open a short hunting season",
     "delta": -9
    },
    {
     "label": "Plant shrubs the deer can eat",
     "delta": 10
    }
   ],
   "tooHigh": "Too many deer! They will eat the forest bare, and many will starve.",
   "tooLow": "Too few deer! The population could die out.",
   "explain": "Predators, food supply, and other limiting factors keep a population near its carrying capacity."
  },
  {
   "id": "bal-bloom",
   "kind": "boss",
   "name": "The Algal Bloom",
   "code": "BIO.B.4.2.4",
   "steels": "3.1.9-12.N",
   "title": "The Algal Bloom keeps changing the nutrients in the lake. Too few starve the producers; too many feed a bloom that uses up the oxygen. Hold the lake in balance.",
   "what": "Nutrients in the lake",
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
     "label": "Plant a buffer strip of native plants",
     "delta": -11
    },
    {
     "label": "Restore the wetland filter",
     "delta": -8
    },
    {
     "label": "Let leaves and dead plants decompose in the lake",
     "delta": 8
    },
    {
     "label": "Allow some farm runoff",
     "delta": 11
    }
   ],
   "wrongHot": "There are already too many nutrients. That adds even more and feeds the algae.",
   "wrongCold": "There are already too few nutrients. That removes even more and starves the producers.",
   "tooHigh": "Too many nutrients! Algae are blooming. Use something that soaks up nutrients.",
   "tooLow": "Too few nutrients! The water plants are starving. Let some nutrients back in.",
   "explain": "Producers need some nutrients, but too many cause algal blooms and dead zones. Wetlands and plant buffers keep the balance."
  }
 ],
 "wordbanks": [
  {
   "id": "wb-habitat",
   "steels": "3.1.9-12.L",
   "words": [
    "habitat",
    "niche",
    "biotic",
    "abiotic",
    "population",
    "mutualism"
   ],
   "sentences": [
    {
     "text": "The place where an organism lives is its ___.",
     "answer": "habitat",
     "code": "BIO.B.4.1.2",
     "explain": "A habitat is an organism's 'address'."
    },
    {
     "text": "An organism's role, such as what it eats and when it is active, is its ___.",
     "answer": "niche",
     "code": "BIO.B.4.1.2",
     "explain": "A niche is an organism's 'job' in the ecosystem."
    },
    {
     "text": "Living or once-living parts of an ecosystem are ___ factors.",
     "answer": "biotic",
     "code": "BIO.B.4.1.2",
     "explain": "Bio- means life."
    },
    {
     "text": "Sunlight, water, and temperature are ___ factors.",
     "answer": "abiotic",
     "code": "BIO.B.4.1.2",
     "explain": "A- means not: abiotic means not living."
    },
    {
     "text": "All the members of one species in one area form a ___.",
     "answer": "population",
     "code": "BIO.B.4.1.1",
     "explain": "A population is one species in one place."
    }
   ]
  },
  {
   "id": "wb-relations",
   "steels": "3.1.9-12.L",
   "words": [
    "predator",
    "prey",
    "competition",
    "mutualism",
    "parasite",
    "pioneer"
   ],
   "sentences": [
    {
     "text": "A hawk that hunts mice is a ___.",
     "answer": "predator",
     "code": "BIO.B.4.2.2",
     "explain": "Predators hunt and eat other animals."
    },
    {
     "text": "The mice the hawk eats are its ___.",
     "answer": "prey",
     "code": "BIO.B.4.2.2",
     "explain": "Prey are the animals that predators eat."
    },
    {
     "text": "Two plants growing toward the same sunlight are in ___.",
     "answer": "competition",
     "code": "BIO.B.4.2.2",
     "explain": "Competition is a struggle over the same limited resource."
    },
    {
     "text": "When both partners benefit, the relationship is ___.",
     "answer": "mutualism",
     "code": "BIO.B.4.2.2",
     "explain": "Mutualism: a win for both."
    },
    {
     "text": "A tick that feeds on a dog's blood is a ___.",
     "answer": "parasite",
     "code": "BIO.B.4.2.2",
     "explain": "A parasite benefits by harming its host."
    }
   ]
  },
  {
   "id": "wb-growth",
   "steels": "3.1.9-12.I",
   "words": [
    "carrying capacity",
    "limiting factor",
    "exponential",
    "density-dependent",
    "density-independent",
    "succession"
   ],
   "sentences": [
    {
     "text": "The largest population an environment can support is its ___.",
     "answer": "carrying capacity",
     "code": "BIO.B.4.2.5",
     "explain": "Carrying capacity is set by food, water, space, and other resources."
    },
    {
     "text": "Anything that keeps a population from growing, like a food shortage, is a ___.",
     "answer": "limiting factor",
     "code": "BIO.B.4.2.5",
     "explain": "Limiting factors slow or stop population growth."
    },
    {
     "text": "With unlimited resources, a population shows ___ growth (a J-shaped curve).",
     "answer": "exponential",
     "code": "BIO.B.4.2.5",
     "explain": "Exponential growth keeps speeding up when nothing limits it."
    },
    {
     "text": "Disease spreads faster in a crowded population, so it is a ___ limiting factor.",
     "answer": "density-dependent",
     "code": "BIO.B.4.2.5",
     "explain": "Density-dependent factors get stronger as a population gets more crowded."
    },
    {
     "text": "A flood affects a population no matter how crowded it is, so it is ___.",
     "answer": "density-independent",
     "code": "BIO.B.4.2.5",
     "explain": "Weather and natural disasters are density-independent."
    }
   ]
  }
 ],
 "lablocks": [
  {
   "id": "lock-3-5",
   "title": "Lab Lock",
   "clues": [
    {
     "prompt": "Clue 1: How many of these are ABIOTIC factors? Sunlight, temperature, fungi, rainfall, deer.",
     "answer": 3,
     "code": "BIO.B.4.1.2",
     "hint": "Fungi and deer are alive.",
     "explain": "Sunlight, temperature, and rainfall are abiotic (3). Fungi and deer are biotic."
    },
    {
     "prompt": "Clue 2: Grass is eaten by crickets, crickets by frogs, and frogs by snakes. Counting grass as level 1, what trophic level is the snake?",
     "answer": 4,
     "code": "BIO.B.4.2.1",
     "hint": "Count up the chain: grass, cricket, frog, snake.",
     "explain": "Grass (1), cricket (2), frog (3), snake (4)."
    },
    {
     "prompt": "Clue 3: Trout need at least 6 mg/L of oxygen. At how many sites was the oxygen too LOW for trout?",
     "answer": 2,
     "code": "BIO.B.4.2.4",
     "figure": {
      "type": "bars",
      "categories": [
       "Upstream",
       "Above farm",
       "Beside farm",
       "Below farm",
       "Far down"
      ],
      "values": [
       9,
       8,
       3,
       5,
       8
      ],
      "ylabel": "Dissolved oxygen (mg/L)"
     },
     "hint": "Count the bars below 6.",
     "explain": "Beside the farm (3) and below the farm (5) were too low: 2 sites."
    }
   ],
   "debrief": [
    "Clue 1 linked biotic and abiotic factors: living things versus the nonliving conditions around them.",
    "Clue 2 linked trophic levels: each step up a food chain is one level higher.",
    "Clue 3 linked human impact to data: fertilizer runoff lowered the oxygen near the farm."
   ]
  }
 ],
 "scans": [
  {
   "id": "s3-organism",
   "name": "White-tailed deer",
   "look": "critter",
   "color": "#c8a070",
   "word": "Organism",
   "def": "A single living thing.",
   "note": "One deer is an ORGANISM, the smallest level studied in ecology."
  },
  {
   "id": "s3-population",
   "name": "A herd of deer",
   "look": "eggs",
   "color": "#c8a070",
   "word": "Population",
   "def": "All the members of one species living in the same area.",
   "note": "All the white-tailed deer in this forest form a POPULATION: one species, one place."
  },
  {
   "id": "s3-community",
   "name": "Forest neighbors",
   "look": "frog",
   "color": "#7be0ad",
   "word": "Community",
   "def": "All the populations of different species living in an area.",
   "note": "Deer, oaks, frogs, fungi, and birds living together form a COMMUNITY."
  },
  {
   "id": "s3-ecosystem",
   "name": "The whole pond",
   "look": "lily",
   "color": "#62b6cb",
   "word": "Ecosystem",
   "def": "A community of living things plus the nonliving factors around them.",
   "note": "The pond's living things plus its water, mud, and sunlight make an ECOSYSTEM."
  },
  {
   "id": "s3-biome",
   "name": "Temperate forest",
   "look": "grass",
   "color": "#5a9a4a",
   "word": "Biome",
   "def": "A large region with a similar climate and similar kinds of ecosystems.",
   "note": "Pennsylvania's forests belong to the temperate deciduous forest BIOME: four seasons and trees that drop their leaves."
  },
  {
   "id": "s3-biosphere",
   "name": "Planet Earth",
   "look": "sun",
   "color": "#7fd4ff",
   "word": "Biosphere",
   "def": "All the parts of Earth where life exists.",
   "note": "Every ecosystem on land, in water, and in the air together is the BIOSPHERE."
  },
  {
   "id": "s3-biotic",
   "name": "Fern",
   "look": "sprout",
   "color": "#7be06a",
   "word": "Biotic factor",
   "def": "A living or once-living part of an ecosystem.",
   "note": "Plants, animals, fungi, bacteria, and even fallen leaves are BIOTIC factors."
  },
  {
   "id": "s3-abiotic",
   "name": "Stream stone",
   "look": "rock",
   "color": "#9a9a88",
   "word": "Abiotic factor",
   "def": "A nonliving part of an ecosystem, such as sunlight, water, soil minerals, or temperature.",
   "note": "Rocks, water, sunlight, and temperature are ABIOTIC factors. They decide which organisms can live here."
  },
  {
   "id": "s3-habitat",
   "name": "Box turtle",
   "look": "turtle",
   "color": "#a8763c",
   "word": "Habitat",
   "def": "The place where an organism lives.",
   "note": "This box turtle's HABITAT is the moist forest floor: its 'address'."
  },
  {
   "id": "s3-niche",
   "name": "Shelf fungus",
   "look": "mushroom",
   "color": "#e0b070",
   "word": "Niche",
   "def": "An organism's role in its ecosystem: what it eats, when it is active, and how it interacts with others.",
   "note": "This fungus's NICHE is decomposer: it breaks down dead wood and returns nutrients to the soil."
  },
  {
   "id": "s3-predator",
   "name": "Red fox",
   "look": "critter",
   "color": "#e0743a",
   "word": "Predator",
   "def": "An organism that hunts and eats other organisms.",
   "note": "The fox is a PREDATOR. Predators help keep prey populations from growing too large."
  },
  {
   "id": "s3-prey",
   "name": "Meadow vole",
   "look": "critter",
   "color": "#a08060",
   "word": "Prey",
   "def": "An organism that is hunted and eaten by a predator.",
   "note": "Voles are PREY for foxes, owls, and hawks."
  },
  {
   "id": "s3-compete",
   "name": "Two oak seedlings",
   "look": "sprout",
   "color": "#8aba5a",
   "word": "Competition",
   "def": "A relationship in which organisms struggle for the same limited resource.",
   "note": "These seedlings are in COMPETITION for light, water, and space. Usually only one wins."
  },
  {
   "id": "s3-mutual",
   "name": "Bee on clover",
   "look": "sprout",
   "color": "#ffd166",
   "word": "Mutualism",
   "def": "A relationship in which both species benefit.",
   "note": "The bee gets nectar and the clover gets pollinated: MUTUALISM."
  },
  {
   "id": "s3-commensal",
   "name": "Bird nest in a tree",
   "look": "eggs",
   "color": "#c8b88a",
   "word": "Commensalism",
   "def": "A relationship in which one species benefits and the other is neither helped nor harmed.",
   "note": "The bird gets a safe nest and the tree is not affected: COMMENSALISM."
  },
  {
   "id": "s3-parasite",
   "name": "Deer tick",
   "look": "critter",
   "color": "#8a3a2a",
   "word": "Parasitism",
   "def": "A relationship in which one organism (the parasite) benefits by harming another (the host).",
   "note": "The tick feeds on its host's blood: PARASITISM. Ticks can also spread Lyme disease."
  },
  {
   "id": "s3-limit",
   "name": "Dry streambed",
   "look": "drop",
   "color": "#7fd4ff",
   "word": "Limiting factor",
   "def": "Anything that keeps a population from growing, such as limited food, water, or space.",
   "note": "When the stream dries up, water becomes a LIMITING FACTOR for every animal here."
  },
  {
   "id": "s3-capacity",
   "name": "Full meadow",
   "look": "stack",
   "color": "#7be0ad",
   "word": "Carrying capacity",
   "def": "The largest population an environment can support over time.",
   "note": "This meadow can feed only so many rabbits. That number is its CARRYING CAPACITY."
  },
  {
   "id": "s3-expo",
   "name": "Pond bacteria",
   "look": "chain",
   "color": "#c59cff",
   "word": "Exponential growth",
   "def": "Population growth that speeds up because nothing limits it; it makes a J-shaped curve.",
   "note": "With unlimited food, bacteria double again and again: EXPONENTIAL GROWTH."
  },
  {
   "id": "s3-logistic",
   "name": "Settled rabbit warren",
   "look": "rod",
   "color": "#a8c87a",
   "word": "Logistic growth",
   "def": "Population growth that slows and levels off at carrying capacity; it makes an S-shaped curve.",
   "note": "The rabbit population grew fast, then leveled off as food ran short: LOGISTIC GROWTH."
  },
  {
   "id": "s3-dd",
   "name": "Crowded herd",
   "look": "critter",
   "color": "#c8a070",
   "word": "Density-dependent factor",
   "def": "A limiting factor that gets stronger as a population gets more crowded, such as disease or competition.",
   "note": "In a crowded herd, disease spreads faster. That makes disease DENSITY-DEPENDENT."
  },
  {
   "id": "s3-di",
   "name": "Ice storm",
   "look": "ice",
   "color": "#cfefff",
   "word": "Density-independent factor",
   "def": "A limiting factor that affects a population no matter how crowded it is, such as weather or fire.",
   "note": "An ice storm harms a small population and a large one alike: DENSITY-INDEPENDENT."
  },
  {
   "id": "s3-fire",
   "name": "Burned stump",
   "look": "rock",
   "color": "#5a4030",
   "word": "Disturbance",
   "def": "An event, such as a fire, flood, or storm, that changes an ecosystem.",
   "note": "A wildfire is a natural DISTURBANCE. Ecosystems change and recover after disturbances."
  },
  {
   "id": "s3-primary",
   "name": "Cooled lava",
   "look": "rock",
   "color": "#3a3a3a",
   "word": "Primary succession",
   "def": "The development of a community on bare rock where no soil exists.",
   "note": "Life on fresh lava must start from nothing: PRIMARY SUCCESSION."
  },
  {
   "id": "s3-pioneer",
   "name": "Lichen on rock",
   "look": "mushroom",
   "color": "#c8e07a",
   "word": "Pioneer species",
   "def": "The first species to live in a bare area, such as lichens and mosses.",
   "note": "Lichens are PIONEER SPECIES: they grow on bare rock and slowly break it down into soil."
  },
  {
   "id": "s3-secondary",
   "name": "Wildflowers after a fire",
   "look": "sprout",
   "color": "#ff9fbf",
   "word": "Secondary succession",
   "def": "The regrowth of a community where soil remains after a disturbance.",
   "note": "The soil survived the fire, so wildflowers sprout quickly: SECONDARY SUCCESSION."
  },
  {
   "id": "s3-climax",
   "name": "Old oak",
   "look": "grass",
   "color": "#3f7a30",
   "word": "Climax community",
   "def": "A mature, fairly stable community that develops at the end of succession.",
   "note": "An old oak forest is a CLIMAX COMMUNITY: it changes little until the next disturbance."
  },
  {
   "id": "s3-keystone",
   "name": "Beaver",
   "look": "critter",
   "color": "#7a5a3a",
   "word": "Keystone species",
   "def": "A species that has a very large effect on its ecosystem compared with its numbers.",
   "note": "Beaver dams create ponds and wetlands for many other species. Beavers are a KEYSTONE SPECIES."
  },
  {
   "id": "s3-biodiv",
   "name": "Tide pool",
   "look": "eggs",
   "color": "#ff9f6e",
   "word": "Biodiversity",
   "def": "The variety of living things in an area.",
   "note": "This tide pool holds snails, crabs, algae, and sea stars. High BIODIVERSITY makes ecosystems more stable."
  },
  {
   "id": "s3-services",
   "name": "Salt marsh",
   "look": "grass",
   "color": "#9ab86a",
   "word": "Ecosystem services",
   "def": "Benefits that people get from healthy ecosystems, such as clean water, pollination, and food.",
   "note": "The marsh filters water and protects the coast from storms. Those are ECOSYSTEM SERVICES."
  },
  {
   "id": "s3-invasive",
   "name": "Zebra mussel",
   "look": "rock",
   "color": "#d0c0a0",
   "word": "Invasive species",
   "def": "A nonnative species that spreads and harms the ecosystem it moves into.",
   "note": "Zebra mussels arrived in ships' ballast water and crowd out native mussels: an INVASIVE SPECIES."
  },
  {
   "id": "s3-habloss",
   "name": "Cleared land",
   "look": "rock",
   "color": "#a8763c",
   "word": "Habitat loss",
   "def": "The destruction or breaking up of the places where organisms live.",
   "note": "Clearing land for buildings and roads causes HABITAT LOSS, the biggest threat to biodiversity."
  },
  {
   "id": "s3-pollution",
   "name": "Oily water",
   "look": "drop",
   "color": "#5a6470",
   "word": "Pollution",
   "def": "Harmful substances added to the environment.",
   "note": "Oil, plastic, pesticides, and extra nutrients are all forms of POLLUTION."
  },
  {
   "id": "s3-bloom",
   "name": "Green scum",
   "look": "lily",
   "color": "#7ab040",
   "word": "Eutrophication",
   "def": "Extra nutrients in water cause an algal bloom; decomposing algae then use up the oxygen.",
   "note": "Fertilizer runoff fed this bloom. When it dies, oxygen drops and fish die: EUTROPHICATION."
  },
  {
   "id": "s3-climate",
   "name": "Warming coastline",
   "look": "sun",
   "color": "#ffb070",
   "word": "Climate change",
   "def": "A long-term change in Earth's temperature and weather patterns.",
   "note": "Warmer water and rising seas are shifting where species can live: CLIMATE CHANGE."
  },
  {
   "id": "s3-overharvest",
   "name": "Empty fishing net",
   "look": "stack",
   "color": "#62b6cb",
   "word": "Overharvesting",
   "def": "Taking organisms from the wild faster than they can reproduce.",
   "note": "Catching fish faster than they reproduce is OVERHARVESTING. It can make a population collapse."
  },
  {
   "id": "s3-conserve",
   "name": "Restored dune",
   "look": "sprout",
   "color": "#7be0ad",
   "word": "Conservation",
   "def": "Protecting, restoring, and wisely using natural resources and ecosystems.",
   "note": "Replanting dune grass and protecting nesting areas is CONSERVATION in action."
  }
 ],
 "vocab": [
  {
   "term": "Organism",
   "def": "A single living thing."
  },
  {
   "term": "Population",
   "def": "All the members of one species living in the same area."
  },
  {
   "term": "Community",
   "def": "All the populations of different species living in an area."
  },
  {
   "term": "Ecosystem",
   "def": "A community of living things plus the nonliving factors around them."
  },
  {
   "term": "Biome",
   "def": "A large region with a similar climate and similar kinds of ecosystems."
  },
  {
   "term": "Biosphere",
   "def": "All the parts of Earth where life exists."
  },
  {
   "term": "Biotic factor",
   "def": "A living or once-living part of an ecosystem."
  },
  {
   "term": "Abiotic factor",
   "def": "A nonliving part of an ecosystem, such as sunlight, water, soil minerals, or temperature."
  },
  {
   "term": "Habitat",
   "def": "The place where an organism lives."
  },
  {
   "term": "Niche",
   "def": "An organism's role in its ecosystem: what it eats, when it is active, and how it interacts with others."
  },
  {
   "term": "Predator",
   "def": "An organism that hunts and eats other organisms."
  },
  {
   "term": "Prey",
   "def": "An organism that is hunted and eaten by a predator."
  },
  {
   "term": "Competition",
   "def": "A relationship in which organisms struggle for the same limited resource."
  },
  {
   "term": "Mutualism",
   "def": "A relationship in which both species benefit."
  },
  {
   "term": "Commensalism",
   "def": "A relationship in which one species benefits and the other is neither helped nor harmed."
  },
  {
   "term": "Parasitism",
   "def": "A relationship in which one organism (the parasite) benefits by harming another (the host)."
  },
  {
   "term": "Limiting factor",
   "def": "Anything that keeps a population from growing, such as limited food, water, or space."
  },
  {
   "term": "Carrying capacity",
   "def": "The largest population an environment can support over time."
  },
  {
   "term": "Exponential growth",
   "def": "Population growth that speeds up because nothing limits it; it makes a J-shaped curve."
  },
  {
   "term": "Logistic growth",
   "def": "Population growth that slows and levels off at carrying capacity; it makes an S-shaped curve."
  },
  {
   "term": "Density-dependent factor",
   "def": "A limiting factor that gets stronger as a population gets more crowded, such as disease or competition."
  },
  {
   "term": "Density-independent factor",
   "def": "A limiting factor that affects a population no matter how crowded it is, such as weather or fire."
  },
  {
   "term": "Disturbance",
   "def": "An event, such as a fire, flood, or storm, that changes an ecosystem."
  },
  {
   "term": "Primary succession",
   "def": "The development of a community on bare rock where no soil exists."
  },
  {
   "term": "Pioneer species",
   "def": "The first species to live in a bare area, such as lichens and mosses."
  },
  {
   "term": "Secondary succession",
   "def": "The regrowth of a community where soil remains after a disturbance."
  },
  {
   "term": "Climax community",
   "def": "A mature, fairly stable community that develops at the end of succession."
  },
  {
   "term": "Keystone species",
   "def": "A species that has a very large effect on its ecosystem compared with its numbers."
  },
  {
   "term": "Biodiversity",
   "def": "The variety of living things in an area."
  },
  {
   "term": "Ecosystem services",
   "def": "Benefits that people get from healthy ecosystems, such as clean water, pollination, and food."
  },
  {
   "term": "Invasive species",
   "def": "A nonnative species that spreads and harms the ecosystem it moves into."
  },
  {
   "term": "Habitat loss",
   "def": "The destruction or breaking up of the places where organisms live."
  },
  {
   "term": "Pollution",
   "def": "Harmful substances added to the environment."
  },
  {
   "term": "Eutrophication",
   "def": "Extra nutrients in water cause an algal bloom; decomposing algae then use up the oxygen."
  },
  {
   "term": "Climate change",
   "def": "A long-term change in Earth's temperature and weather patterns."
  },
  {
   "term": "Overharvesting",
   "def": "Taking organisms from the wild faster than they can reproduce."
  },
  {
   "term": "Conservation",
   "def": "Protecting, restoring, and wisely using natural resources and ecosystems."
  }
 ]
});

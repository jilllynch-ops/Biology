/* EARTHLING FIELD GUIDE: BIODOME MODEL
   The living system inside the biodome, one season at a time. No graphics here, so it can be tested on its own.
   Everything is a simple "amount" (about 0 to 10 for living things). Each season:
   - producers (grass, wildflowers, trees, pondweed) grow if they have light, water, carbon dioxide, nutrients and a
     comfortable temperature; wildflowers also need pollinators; plants share limited floor space
   - rabbits eat plants, hawks eat rabbits (energy moves up the food chain, and only part of it is passed on)
   - every living thing makes waste and dead matter; decomposers turn it back into nutrients
   - photosynthesis adds oxygen and removes carbon dioxide; cellular respiration does the reverse
   - each season can bring one disruption (heat wave, disease, invasive vine, algae bloom, cold snap) */
(function () {
'use strict';
const clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
const SEASONS = 8;
/* what one packed unit adds when it is placed in the dome */
const PLACE = { water: { water: 2 }, air: { o2: 12, co2: 12 }, blocks: { nut: 4 }, soil: { decomp: 1.5, nut: 1.5 }, grass: { grass: 2.5 }, flowers: { flowers: 2 }, trees: { trees: 2 },
  pondweed: { pondweed: 2.5 }, bees: { bees: 1.5 }, rabbits: { rabbits: 1.5 }, hawks: { hawks: 0.8 }, pond: { fish: 1.5 }, cellkit: { kit: 1 },
  /* supplies earned in Worlds 3 to 5 */
  wetland: { wetland: 1 }, seedbank: { seedbank: 1 }, hardy: { heatTrait: 0.5 } };
/* the disruption that arrives at the start of each season (season 1 is calm) */
const EVENTS = [null, 'boom', 'heat', 'disease', 'invasive', 'algae', 'cold', 'final'];
function fresh() {
  return { season: 0, water: 0, o2: 35, co2: 30, nut: 0, temp: 22, grass: 0, flowers: 0, trees: 0, pondweed: 0, bees: 0, rabbits: 0, hawks: 0, fish: 0, decomp: 0, waste: 0, vine: 0, kit: 0, wetland: 0, seedbank: 0,
    shade: 0, insul: false, ev: null, evDone: false, cured: false, heatTrait: 0, log: [] };
}
function place(s, id) { const p = PLACE[id]; if (!p) return; Object.keys(p).forEach(function (k) { s[k] = (s[k] || 0) + p[k]; }); }
function producers(s) { return s.grass + s.flowers + s.trees + s.pondweed; }
function species(s) { return ['grass', 'flowers', 'trees', 'pondweed', 'bees', 'rabbits', 'hawks', 'fish', 'decomp'].filter(function (k) { return s[k] > 0.25; }); }
/* gauge -> 'ok' | 'warn' | 'bad' */
const GAUGES = {
  o2: function (s) { return s.o2 < 15 || s.o2 > 90 ? 'bad' : s.o2 < 25 || s.o2 > 80 ? 'warn' : 'ok'; },
  co2: function (s) { return s.co2 < 5 || s.co2 > 75 ? 'bad' : s.co2 < 12 || s.co2 > 60 ? 'warn' : 'ok'; },
  water: function (s) { return s.water < 4 ? 'bad' : s.water < 7 ? 'warn' : 'ok'; },
  temp: function (s) { return s.temp < 12 || s.temp > 33 ? 'bad' : s.temp < 16 || s.temp > 29 ? 'warn' : 'ok'; },
  nut: function (s) { return s.nut < 1 || s.nut > 16 ? 'bad' : s.nut < 2.5 || s.nut > 12 ? 'warn' : 'ok'; },
  food: function (s) { const p = producers(s); return p < 4 ? 'bad' : p < 8 ? 'warn' : 'ok'; },
  web: function (s) { const r = s.rabbits, h = s.hawks; if (r < 0.25 && h < 0.25) return 'warn'; if (h > 0.25 && r < 0.6) return 'bad'; if (r > 7) return 'bad'; if (r > 5 || (r > 0.25 && h < 0.25)) return 'warn'; return 'ok'; },
  waste: function (s) { return s.waste > 9 ? 'bad' : s.waste > 5 ? 'warn' : 'ok'; }
};
function gauges(s) { const o = {}; Object.keys(GAUGES).forEach(function (k) { o[k] = GAUGES[k](s); }); return o; }
/* start a season: apply its disruption */
function beginSeason(s) {
  s.season++; s.ev = EVENTS[s.season - 1] || null; s.evDone = false; s.cured = false; s.condensed = false; s.composted = false; s.planted = false;
  if (s.ev === 'boom') { if (s.rabbits > 0.25) s.rabbits *= 1.8; }
  if (s.ev === 'invasive') s.vine = 1.5;
  if (s.ev === 'disease') s.sick = true;
  if (s.ev === 'algae') s.nut += 4; /* a leaky compost bin washes extra nutrients into the pond */
  return s;
}
/* player actions during a season (between "next season" presses) */
function act(s, a) {
  /* the dome never opens: the player can only change how much sunlight gets in (the sun shade) and keep heat in (insulating panels) */
  if (typeof s.shade !== 'number') s.shade = s.shade ? 2 : 0;
  if (a === 'shade') s.shade = s.shade ? 0 : 2;
  else if (a === 'sunLess') s.shade = Math.min(2, s.shade + 1);
  else if (a === 'sunMore') s.shade = Math.max(0, s.shade - 1);
  else if (a === 'insulate') s.insul = !s.insul;
  else if (a === 'plant' && !s.planted && s.nut >= 1 && (s.grass > 0.5 || s.flowers > 0.5 || s.trees > 0.5)) { /* cuttings and seeds from plants already in the dome: more producers to take up carbon dioxide (new plants use some nutrients) */
    const k = s.grass > 0.5 ? 'grass' : s.trees > 0.5 ? 'trees' : 'flowers'; s[k] += k === 'trees' ? 0.6 : 1.2; s.nut -= 0.8; s.planted = true; }
  else if (a === 'pull' && s.vine > 0) { s.vine = Math.max(0, s.vine - 1.2); }
  else if (a === 'cure' && s.sick && s.kit >= 1) { s.kit -= 1; s.cured = true; }
  else if (a === 'penRabbits' && s.rabbits > 0.6) { s.rabbits -= 0.75; s.pen = (s.pen || 0) + 0.75; }
  else if (a === 'penHawks' && s.hawks > 0.3) { s.hawks -= 0.4; s.penH = (s.penH || 0) + 0.4; }
  else if (a === 'skim' && s.nut > 2) { s.nut -= 2; s.waste += 1.2; s.skimmed = (s.skimmed || 0) + 1; } /* scoop extra algae onto the compost pile: the matter stays in the dome and is recycled slowly */
  /* dome tools (each once per season) */
  else if (a === 'condense' && !s.condensed) { s.water += 1.5; s.condensed = true; } /* collect the water that condenses on the cool glass: the water cycle */
  else if (a === 'compost' && !s.composted && s.decomp >= 0.3) { const w = Math.min(2, s.waste); s.waste -= w; s.nut += 0.4 + w * 0.6; s.co2 = Math.min(100, s.co2 + 2); s.composted = true; } /* turning the pile gives decomposers air: they break waste into nutrients (and breathe out carbon dioxide) */
  else if (a === 'releaseR' && (s.pen || 0) > 0.1) { const r = Math.min(0.75, s.pen); s.pen -= r; s.rabbits += r; }
  else if (a === 'releaseH' && (s.penH || 0) > 0.1) { const h = Math.min(0.4, s.penH); s.penH -= h; s.hawks += h; }
  return s;
}
/* run one season and explain the biggest changes */
function runSeason(s) {
  const before = JSON.parse(JSON.stringify(s)), notes = [], ev = s.ev;
  let heat = 0; if (ev === 'heat') heat = 9; if (ev === 'cold') heat = -9;
  /* temperature: the Sun warms the dome, carbon dioxide traps heat, shade and trees cool it */
  if (typeof s.shade !== 'number') s.shade = s.shade ? 2 : 0;
  s.temp = 22 + heat + (s.co2 - 30) * 0.12 - Math.min(3, s.trees * 0.5) - [0, 3, 6][s.shade]; /* the sun shade blocks some sunlight, so the dome is cooler */
  if (s.insul) s.temp += clamp(22 - s.temp, 0, 6); /* insulating panels keep the dome's own heat in (they only warm it, toward 22 °C) */
  const light = [1, 0.85, 0.65][s.shade], tempOK = clamp(1 - Math.max(0, Math.abs(s.temp - 22) - 5) / 9, 0.1, 1) + (ev === 'heat' ? s.heatTrait * 0.15 : 0);
  const waterOK = clamp(s.water / 7, 0.1, 1), nutOK = clamp(s.nut / 4, 0.15, 1), co2OK = clamp(s.co2 / 20, 0.15, 1);
  const grow = 0.75 * light * waterOK * nutOK * co2OK * Math.min(1, tempOK);
  const floor = s.grass + s.flowers + s.trees * 1.5 + s.vine * 2, space = Math.max(0, 1 - floor / 26), pondSpace = Math.max(0, 1 - s.pondweed / 9);
  /* producers grow */
  const gG = s.grass * grow * space * 1.5, gF = s.flowers * grow * space * (s.bees > 0.3 ? 1.1 : 0), gT = s.trees * grow * space * 0.35, gW = s.pondweed * grow * 0.8 * pondSpace * (s.nut > 11 ? 0.4 : 1);
  s.grass += gG; s.flowers += gF - (s.bees > 0.3 ? 0 : s.flowers * 0.18); s.trees += gT; s.pondweed += gW; /* without pollinators, old wildflowers die and no new seeds form */
  const uptake = (gG + gF + gT + gW) * 0.32 + producers(s) * 0.07; s.nut = Math.max(0, s.nut - uptake); /* growing plants, and plants just staying alive, take nutrients from the soil and water */
  /* disease hits the grass; many kinds of plants (and the cell-care kit) limit the damage */
  if (ev === 'disease' && s.sick) { const kinds = ['grass', 'flowers', 'trees'].filter(function (k) { return s[k] > 0.5; }).length; let loss = s.cured ? 0.15 : kinds >= 3 ? 0.35 : kinds === 2 ? 0.55 : 0.85; if (s.seedbank > 0 && !s.cured) { loss *= 0.6; notes.push('seedbank'); } /* a seed bank with many alleles: some grass plants resist the blight */ const lost = s.grass * loss; s.grass -= lost; s.waste += lost * 0.5; s.sick = false; notes.push(s.cured ? 'diseaseCured' : kinds >= 2 ? 'diseaseMixed' : 'diseaseMono'); }
  /* heat: plants with heat-tolerant traits survive better (and become more common: natural selection) */
  if (ev === 'heat' && before.heatTrait >= 0.5) notes.push('hardy'); /* hardy seeds from drought survivors were already adapted */
  if (ev === 'heat') { if (s.water < 6) { s.grass *= 0.75; s.flowers *= 0.75; notes.push('heatDry'); } s.heatTrait = Math.min(1, s.heatTrait + 0.5); notes.push('heatTrait'); }
  if (ev === 'cold') { s.bees *= s.temp < 16 ? 0.55 : 0.9; if (s.temp < 16) notes.push('coldBees'); }
  /* invasive vine spreads and smothers other plants unless pulled */
  if (s.vine > 0) { s.vine *= 1.7; const smother = Math.min(s.grass + s.flowers, s.vine * 0.6); const share = s.grass + s.flowers > 0 ? s.grass / (s.grass + s.flowers) : 0.5; s.grass -= smother * share; s.flowers -= smother * (1 - share); s.waste += smother * 0.4; if (s.vine > 1) notes.push('vine'); }
  /* herbivores eat plants */
  const want = s.rabbits * 1.0, avail = s.grass + s.flowers * 0.35, eat = Math.min(want, avail * 0.5), fed = want > 0 ? eat / want : 0; /* rabbits mostly eat grass, and nibble wildflowers */
  const fromG = avail > 0 ? eat * s.grass / avail : 0; s.grass -= fromG; s.flowers -= Math.max(0, eat - fromG);
  const rBirth = s.rabbits * 0.65 * fed, rDeath = s.rabbits * (0.18 + 0.4 * (1 - fed));
  /* predators eat herbivores */
  const caught = Math.min(s.rabbits * 0.55, s.hawks * 1.1 * s.rabbits / (s.rabbits + 1.5)), hFed = s.hawks > 0 ? clamp(caught / (s.hawks * 0.9), 0, 1) : 0;
  const hBirth = s.hawks * 0.35 * hFed, hDeath = s.hawks * (0.15 + 0.5 * (1 - hFed));
  s.rabbits = Math.max(0, s.rabbits + rBirth - rDeath - caught); s.hawks = Math.max(0, s.hawks + hBirth - hDeath);
  if (fed < 0.5 && before.rabbits > 0.5) notes.push('hungryRabbits'); if (before.rabbits > 3 && s.hawks < 0.25) notes.push('noPredators'); if (before.hawks > 0.3 && hFed < 0.5) notes.push('hungryHawks');
  /* pollinators need flowers */
  s.bees = Math.max(0, s.bees + s.bees * (s.flowers > 2 ? 0.25 : -0.45)); if (before.bees > 0.3 && s.flowers <= 2) notes.push('noFlowers');
  if (before.flowers > 1 && before.bees < 0.3) notes.push('noBees');
  /* pond: algae blooms when there are too many nutrients; fish need pondweed and oxygen */
  if (s.wetland > 0 && s.nut > 7) { s.nut -= Math.min(s.nut - 7, 2.5 * s.wetland); notes.push('wetland'); } /* wetland plants soak up extra nutrients before they reach the pond */
  let algae = s.nut > 11 || ev === 'algae' && s.nut > 7.5; if (algae) notes.push('algae');
  s.fish = Math.max(0, s.fish + s.fish * (s.pondweed > 1.5 && !algae && s.o2 > 20 ? 0.2 : -0.45));
  /* waste and decomposers */
  s.waste += rDeath * 0.8 + hDeath * 0.8 + (s.rabbits + s.hawks + s.fish) * 0.18 + producers(s) * 0.04;
  const work = Math.min(s.waste, s.decomp * 1.6); s.waste -= work; s.nut += work * 0.75;
  s.decomp = clamp(s.decomp + s.decomp * (s.waste > 1 ? 0.15 : -0.1), 0, 6); if (s.decomp < 0.25 && s.waste > 3) notes.push('noDecomp');
  /* gases: photosynthesis and cellular respiration */
  const psLimit = light * waterOK * Math.min(1, tempOK) * co2OK, ps = (s.grass + s.flowers + s.trees * 2 + s.pondweed) * 1.3 * psLimit, resp = (s.rabbits * 1.0 + s.hawks * 1.4 + s.fish * 0.6 + s.bees * 0.3 + s.decomp * 0.6 + work * 0.6 + producers(s) * 0.06) * 1.6;
  s.o2 = clamp(s.o2 + ps - resp, 0, 100); s.co2 = clamp(s.co2 + resp - ps, 0, 100);
  if (s.o2 < 25) notes.push('lowO2'); if (s.co2 < 12) notes.push('lowCO2'); if (s.co2 > 60) notes.push('highCO2');
  /* a little water vapor escapes through the seals each season */
  s.water = Math.max(0, s.water - (ev === 'heat' ? [0.9, 0.65, 0.45][s.shade] : 0.25)); /* shade cuts evaporation in a heat wave */
  ['grass', 'flowers', 'trees', 'pondweed', 'bees', 'rabbits', 'hawks', 'fish'].forEach(function (k) { s[k] = clamp(s[k], 0, 12); if (s[k] < 0.2) s[k] = 0; });
  s.temp = Math.round(s.temp * 10) / 10; s.notes = notes; s.evDone = true;
  return s;
}
function result(s) {
  const g = gauges(s), bad = Object.keys(g).filter(function (k) { return g[k] === 'bad'; }), sp = species(s);
  const crashed = s.o2 < 8 || producers(s) < 1;
  const levels = { producers: ['grass', 'flowers', 'trees', 'pondweed'].filter(function (k) { return sp.indexOf(k) >= 0; }).length >= 2, herbivores: sp.indexOf('rabbits') >= 0, predators: sp.indexOf('hawks') >= 0, decomposers: sp.indexOf('decomp') >= 0, pollinators: sp.indexOf('bees') >= 0 };
  const allLevels = Object.keys(levels).every(function (k) { return levels[k]; });
  return { gauges: g, bad: bad, species: sp, levels: levels, allLevels: allLevels, crashed: crashed, balanced: !crashed && bad.length === 0 && allLevels };
}
function score(s, cargoLeft, rewinds) { const r = result(s); return Math.max(0, Math.round(r.species.length * 120 + Object.keys(r.gauges).filter(function (k) { return r.gauges[k] === 'ok'; }).length * 80 + (r.balanced ? 600 : 0) - rewinds * 60 - cargoLeft * 10)); }
const api = { SEASONS: SEASONS, PLACE: PLACE, EVENTS: EVENTS, fresh: fresh, place: place, beginSeason: beginSeason, runSeason: runSeason, act: act, gauges: gauges, result: result, species: species, producers: producers, score: score };
if (typeof window !== 'undefined') window.FG_DomeSim = api; if (typeof module !== 'undefined') module.exports = api;
})();

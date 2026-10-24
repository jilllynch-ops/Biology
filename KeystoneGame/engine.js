/* Earthling Field Guide shared game file: movement, 3D scenery, scoring, menus, saving.
   World files plug in through FieldGuide.registerWorld and FieldGuide.registerQuestions. */
(function () {
'use strict';
const T = window.THREE;
const BQ = window.FieldGuide = {
  worlds: {}, data: {},
  /* the course order (updated October 2026): Units 3 and 5 of the old sequence are now one ecosystems unit */
  UNITS: ['Structure and Function', 'Matter and Energy in Organisms and Ecosystems',
    'Ecosystems: Interdependence and Disruptions', 'Inheritance and Variation of Traits',
    'Environmental Pressure Drives Evolution']
};
const QMAP = {};
BQ.registerWorld = function (w) { BQ.worlds[w.id] = w; };
BQ.registerQuestions = function (id, d) {
  BQ.data[id] = d;
  (d.questions || []).forEach(function (q) { QMAP[q.id] = Object.assign({ world: id }, q); });
  (d.sorts || []).forEach(function (s) {
    s.items.forEach(function (it, i) {
      QMAP[s.id + '.' + i] = { id: s.id + '.' + i, world: id, code: s.code, steels: s.steels, prompt: s.prompt,
        stem: it.text, options: s.options, answer: it.answer, explain: it.explain, hint: s.hint, fixed: true };
    });
  });
  (d.data || []).forEach(function (g) {
    g.questions.forEach(function (q, i) {
      QMAP[g.id + '.' + i] = { id: g.id + '.' + i, world: id, code: g.code, steels: g.steels, prompt: q.prompt, options: g.categories, answer: q.answer,
        hint: q.hint, explain: q.explain, fixed: true, figure: { type: 'bars', categories: g.categories, values: g.values, ylabel: g.ylabel } };
    });
  });
  (d.lablocks || []).forEach(function (lk) {
    lk.clues.forEach(function (c, i) {
      QMAP[lk.id + '.' + i] = { id: lk.id + '.' + i, world: id, code: c.code, prompt: c.prompt, options: ['1', '2', '3', '4', '5'], answer: c.answer - 1,
        hint: c.hint, explain: c.explain, figure: c.figure, fixed: true, tags: ['lock'] };
    });
  });
};
function loadScript(src, ok, fail) {
  const s = document.createElement('script'); s.src = src; s.onload = ok;
  s.onerror = function () { s.remove(); fail(); }; document.head.appendChild(s);
}
/* Looks for world1 ... worldN files and loads whichever ones are in the folder. */
BQ.loadWorlds = function (max) {
  let n = 1;
  (function next() {
    if (n > max) return boot();
    const i = n++;
    loadScript('world' + i + '-questions.js', function () { loadScript('world' + i + '.js', next, next); }, next);
  })();
};

/* ---------- saving (on this device only) ---------- */
const KEY = 'bioquest-save-v1';
function fresh() {
  return { alien: { shape: 0, color: 0, eyes: 2, ant: 2, gear: 0, estyle: 0, mouth: 1 }, levels: {}, missed: {}, codes: {}, seen: {}, rare: {}, words: {}, found: {}, ach: {}, colDone: {}, stat: {}, bank: 0, inv: { life: 0, shield: 0, fly: 0, lens: 0 }, owned: {},
    set: { text: 1, low: false, sound: true, music: true, vol: 50, cap: true, unlock: false }, nick: '', board: [] };
}
let S = fresh();
try {
  const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (raw) { const f = fresh(); S = Object.assign(f, raw); S.inv = Object.assign(fresh().inv, raw.inv); S.alien = Object.assign(fresh().alien, raw.alien); S.set = Object.assign(fresh().set, raw.set); }
} catch (e) { /* play without saving */ }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

/* NAME CHECK: blocks rude, hurtful, or impersonating nicknames in English and Spanish.
   The word lists are stored scrambled (ROT13) so students reading the code do not see them.
   Checks ignore capitals and accents, undo look-alike swaps (0 for o, 4 for a, $ for s, 1 for i or l, v for u),
   ignore spaces and symbols between letters, and squeeze stretched letters (fuuuck). Short words like
   "ass" or "die" are only blocked as whole words, so names like Cassie or Diego are fine.
   Teachers can allow a name anyway by opening the game with #teacher at the end of the web address. */
const NOPE_SUB = ["nffubyr", "onfgneq", "ovgpu", "oybjwbo", "obzogurfpubby", "obbof", "ohyyfuvg", "pnoeba", "puvatn", "puhcncbyy", "puhcniret", "pyvgbevf", "pbpnvar", "pbpxurnq", "pbwba", "pbapunghznqer", "pbapurfhznqer", "pbapurghzner", "phyreb", "phyvnb", "phzfubg", "phag", "qrrmahg", "qrrmahgm", "qvpxurnq", "qvyqb", "qhzonff", "raphrenq", "sntt", "sragnaly", "sbyyne", "shpx", "shx", "tvyvcbyy", "tbabeern", "unaqwbo", "urvyuvgyre", "uragnv", "urebva", "uvwnqrchgn", "uvwbqrchgn", "uvwhrchg", "uvgyre", "wvmm", "xvyyhefrys", "xvyylbhefrys", "yvtzn", "znycnevq", "znznovpub", "znznthri", "znznuhri", "znevpba", "znevwhnan", "znfgheo", "zvreqn", "zbyrfg", "zbgures", "avtt", "abobqlyvxrflbh", "ahgfnpx", "betnfz", "bklpbqbar", "crqbcuvy", "craqrw", "cravf", "crepbprg", "cuhpx", "cbepuzbaxrl", "cbea", "cbeabtens", "chffl", "chgnznqer", "enturnq", "ergneq", "evzwbo", "fnaqavttre", "fpuybat", "fpubbyfubbg", "fpebghz", "furznyr", "fuvg", "fubbghcfpubby", "fyhg", "fhtzn", "fhtbaqrrm", "fhtbaqrf", "fhvpvqr", "grfgvpyr", "gvggvrf", "gbjryurnq", "hanyvir", "intvan", "iretn", "jnaxre", "jrgonpx", "juvgrcbjre", "juber"].map(rot13),
  NOPE_WHOLE = ["420", "nqqrenyy", "nqzva", "nqzvavfgengbe", "nuhrbanb", "nypbuby", "nany", "nahf", "nefr", "nefrubyr", "nfubyr", "nff", "nffubyr", "nffcynl", "nffjvcr", "njrban", "njrbanb", "nmm", "nmmubyr", "onobfn", "onobfb", "onyyf", "onyym", "onyymm", "onfgneq", "onjym", "ornare", "orre", "oreenpn", "oreenpb", "orjof", "orjom", "ovngpu", "ovgpu", "ow", "oybjwbo", "obon", "obob", "obynf", "obyvgnf", "obyybpx", "obyhqn", "obyhqb", "obzogurfpubby", "obare", "obat", "obbo", "obbovrf", "obbof", "obbom", "obbglubyr", "ohyyfuvg", "ohgg", "ohggubyr", "olgpu", "pnoeba", "pnoeban", "pnoebanmb", "pnoebaprgr", "pnoebaqrzvreqn", "pnpubaqn", "pnpubaqb", "pntnqn", "pntnqnqrzvreqn", "pntnqb", "pntne", "pntba", "pntban", "pnyragba", "pnyragban", "pnyvragr", "pnyyngr", "pnyyngrynobpn", "pnaanovf", "pnchyyn", "pnchyyb", "pnerphyb", "pnerzbaqn", "pnercvpun", "pnergnoyn", "pneriretn", "pnjx", "purng", "purngre", "puvatnqn", "puvatnqnznqer", "puvatnqnghznqer", "puvatnqren", "puvatnqb", "puvatne", "puvatnghznqer", "puvatba", "puvatban", "puvathra", "puvax", "pubpun", "puhpun", "puhpuvgn", "puhcncbyynf", "puhcniretn", "puhcniretnf", "pyvg", "pyvgbevf", "pbpnvar", "pbpx", "pbpxnaqonyyf", "pbpxurnq", "pbpxaonyyf", "pbtrzbf", "pbtre", "pbtvqn", "pbtvqb", "pbwrzr", "pbwvb", "pbwba", "pbwbarf", "pbwbahqb", "pbxr", "pbzrzvreqn", "pbanmb", "pbapun", "pbapunqrghznqer", "pbapunghznqer", "pbapurfhznqer", "pbapurfhzner", "pbapurghznqer", "pbapurghzner", "pbapurgiznqer", "pbapuhqn", "pbapuhqb", "pbargn", "pbavgb", "pbab", "pbabqrghznqer", "pbabrznqer", "pbabghznqer", "pbbpu", "pbbpuvr", "pbbpul", "pbba", "pbeerefr", "pbeevqn", "penpx", "penc", "penccl", "pevccyr", "pgz", "pgzer", "phynmb", "phyren", "phyreb", "phyvn", "phyvnqn", "phyvnqb", "phyvnb", "phyvgb", "phyb", "phyba", "phyban", "phybevpb", "phz", "phzz", "phzzvat", "phzzl", "phzf", "phzfubg", "phag", "qnza", "qrrmahgf", "qrrmahggf", "qrrmahggm", "qrrmahgm", "qrfahqn", "qrfahqvgn", "qrfahqvgb", "qrfahqb", "qrirybcre", "qrmaigm", "qvpx", "qvpxurnq", "qvpxurq", "qvpxyrg", "qvr", "qvrovgpu", "qvx", "qvxx", "qvyqb", "qbat", "qbatre", "qehax", "qhzo", "qhzonff", "qhzonmm", "qhzos", "qlxr", "rpfgnfl", "raphrenqn", "raphrenqvgn", "raphrenqvgb", "raphrenqb", "raphrene", "rfghcvqn", "rfghcvqb", "rfgicvqn", "rfgicvqb", "snpx", "snt", "snttbg", "snttl", "snc", "snccvat", "sneg", "sng", "sngnff", "snjx", "spx", "spxvat", "sragnaly", "sbyynqn", "sbyynqb", "sbyynqbe", "sbyynqben", "sbyyne", "sbyyba", "sbeen", "sbeeb", "shpp", "shpx", "shpxre", "shpxvat", "shpxe", "shx", "shxre", "shd", "tnlnff", "tvy", "tvyvcbyyn", "tvyvcbyynf", "tbqqnza", "tbabeern", "tbabeernuvwhrchgn", "tbabeernuc", "tbabeervgn", "tbbx", "tebbzre", "unprefrhancnwn", "unprehancnwn", "unpx", "unpxrqlbhetnzr", "unpxre", "unaqwbo", "ungrlbh", "uqc", "uqcg", "urvy", "urvyuvgyre", "uryy", "uragnv", "urebva", "uvwnqrcreen", "uvwnqrchgn", "uvwbqrynpuvatnqn", "uvwbqrcreen", "uvwbqrchgn", "uvwhrchgn", "uvwhrchgnuc", "uvwhrcign", "uvwhrcigb", "uvwircign", "uvwircigb", "uvgyre", "uwbo", "ub", "ubr", "ubrf", "ubzb", "ubzbcubovp", "ubbun", "ubbxre", "uber", "ubeal", "ubfgvn", "ubfgvnf", "uc", "ucg", "ucgn", "uhrba", "uhrchgn", "uhrivgb", "uhriba", "uhriban", "uhribaqrzvreqn", "uhribauc", "uhribf", "uhrihqb", "vqvbg", "vqvbgn", "vqvbgnqrzvreqn", "vzorpvy", "vzorpvyqrzvreqn", "wnpxnff", "wnpxbss", "wnynefr", "wninfpevcg", "wrexbss", "wvmm", "wbqrqren", "wbqre", "wbqrgr", "wbqvqn", "wbqvqb", "wbqvraqn", "wbqba", "wbqban", "wcg", "wcgn", "whrchgn", "whhy", "xoea", "xoeba", "xoeban", "xoebanmb", "xvxr", "xvyy", "xvyynyy", "xvyyzr", "xvyyhefrys", "xvyylbfrys", "xvyylbhefrys", "xxx", "xzf", "xag", "xbpx", "xbapun", "xbab", "xhag", "xlxr", "xlf", "ynovn", "ynpbapunqrghznqer", "ynchgnznqer", "ynchgndhrgrcnevb", "yrna", "yrsn", "yvtzn", "ybfre", "yfq", "zntvpzhfuebbzf", "znycnevqn", "znycnevqb", "znycnevqbuc", "znznovpub", "znznqn", "znznqnf", "znznthron", "znznthrin", "znznthrinmb", "znznthrib", "znznthribqrzvreqn", "znznuhrib", "znznuhribf", "znzncvatn", "znzne", "znzregn", "znzregb", "znzrf", "znzba", "znzban", "znahryn", "zneqvgb", "znevpn", "znevpnuc", "znevpba", "znevpban", "znevpbanmb", "znevpbaqrzvreqn", "znevpbauc", "znevpbafba", "znevphfb", "znevwhnan", "znevx", "znevxn", "znevxba", "znevdhvgn", "znfgheonpvba", "znfgheone", "znfgheongr", "znfgheongvba", "znfgheoo", "zqzn", "zrpntbra", "zrpntbragbqb", "zrpntbraghznqer", "zrgu", "zrinyriretn", "zs", "zvreqn", "zvreqreb", "zvreqbfn", "zvreqbfb", "zvys", "zbq", "zbqrengbe", "zbsb", "zbyrfg", "zbyrfgre", "zbyyl", "zbaqn", "zbeba", "zbgures", "zbgureshpxre", "anxrq", "anytn", "anytnf", "anytnfcnenqnf", "anytba", "anytban", "anmv", "avpbgvar", "avtre", "avttn", "avttnu", "avttre", "avccyr", "avccyrf", "avcf", "azzf", "abobqlyvxrflbh", "abwbqn", "abwbqnf", "abznzrf", "afsj", "ahqr", "ahyy", "ahg", "ahgfnpx", "ahgg", "ahggvat", "ahgmnpx", "betnfz", "betl", "bkl", "bklpbqbar", "cnrqb", "cnwn", "cnwnmb", "cnwrne", "cnwren", "cnwrenqrzvreqn", "cnwreb", "cnwrebqrzvreqn", "cnwvyyn", "cnwhn", "cnwhb", "cnxv", "cnffjq", "cnffjbeq", "crqb", "crqbsvyb", "crqbcuvyr", "crr", "crra", "crrahf", "cryznmb", "crybgn", "crybgnf", "crybghqn", "crybghqb", "crybghqbqrzvreqn", "craqrwn", "craqrwnqn", "craqrwnqnf", "craqrwvgn", "craqrwvgb", "craqrwb", "craqrwbqrzvreqn", "crar", "cravf", "crep", "crepbprg", "creen", "creenrapryb", "creenchgn", "creebqrzvreqn", "cuhpx", "cvpun", "cvpuba", "cvpuhyn", "cvpuhyba", "cvapur", "cvatn", "cvatnqrzvreqn", "cvatnybpn", "cvatnmb", "cvath", "cvathreb", "cvebon", "cvebob", "cvebobuc", "cvff", "cvffrq", "cvgb", "caqwn", "caqwb", "cbyyn", "cbyyba", "cbbc", "cbepuzbaxrl", "cbea", "cbeauho", "cbeab", "cbeabtensvn", "cevpx", "cevapvcny", "cevatn", "cevatnqn", "cevatnqb", "cevatnb", "ceba", "checyrqenax", "chff", "chffv", "chffvr", "chffl", "chfl", "chgn", "chgnqrzvreqn", "chgnu", "chgnznqer", "chgnm", "chgnmb", "chgrne", "chgrevn", "chgreb", "chgvyyn", "chgvgn", "chgvgnevpn", "chgvgb", "chgb", "chgbqrzvreqn", "chgban", "chgbevpb", "chmml", "cign", "cigb", "dy", "dyb", "enpvfg", "enturnq", "encr", "encrure", "encruvz", "encvat", "encvfg", "erpbapurghzner", "erdy", "ergneq", "ergneqrq", "ergenfnqn", "ergenfnqb", "evzwbo", "ebbg", "fnpbqrjrn", "fnpbjrn", "fnaqavttre", "fncbuc", "fpuybat", "fpubbyfubbgre", "fpebghz", "frpxf", "frzra", "frk", "frkb", "frkbfn", "frkbfb", "frkgvat", "frkhny", "frkkk", "frkl", "furznyr", "fuvvg", "fuvg", "fubbghcfpubby", "fuebbzf", "fulg", "fvatnqn", "fvatnqren", "fvatnb", "fvatne", "fvatba", "fxnax", "fyhg", "fyig", "fcnm", "fcrez", "fcvp", "fgbare", "fghcvq", "fhoabezny", "fhpx", "fhpxf", "fhtzn", "fhtbaqrrm", "fhtbaqrfr", "fhvpvqr", "fhcrehfre", "flfgrz", "gnenqn", "gnenqb", "gneq", "gnehtn", "gnehtb", "grnpure", "grdhvyn", "greebevfg", "grfgvpyrf", "grgnf", "grgnftenaqrf", "grgba", "grgban", "grgbgnf", "gubg", "gvg", "gvgf", "gvggvrf", "gvggl", "gbjryurnq", "gentnfnoyrf", "genaal", "ghznqer", "ghchgnznqer", "gheq", "ghivrwn", "gjng", "htyl", "hanyvirlbhefrys", "haqrsvarq", "hezbz", "hezbztnl", "int", "intvan", "inwnlwnl", "inyrfznqer", "inyrfiretn", "inyriretn", "incr", "incvat", "iretn", "iretnf", "iretnmb", "iretba", "iretban", "irethreb", "irgrnpntne", "irgrnpuvatne", "irgrnynpuvatnqn", "irgrnynzvreqn", "irgrnyniretn", "irgrnypnenwb", "ibqxn", "ihyin", "jnax", "jnaxre", "jrn", "jrrq", "jrravr", "jrravf", "jrba", "jrban", "jrbanmb", "jrbady", "jrgonpx", "juvfxrl", "juvgrcbjre", "juvgrcevqr", "juber", "ja", "knank", "kkk", "lbznzn", "lbhezbz", "lbhezbzvftnl", "mrkl", "mbcrapb", "mbeen", "mbeenchgn"].map(rot13),
  NOPE_REVIEW = ["nhgvfg", "pundhrgn", "penpxre", "uhribfqrbeb", "arteb", "cnwneenpb"].map(rot13);
function rot13(w) { return w.replace(/[a-z]/g, function (c) { return String.fromCharCode((c.charCodeAt(0) - 97 + 13) % 26 + 97); }); }
const NOPE_SET = new Set(NOPE_WHOLE), NOPE_LONG = NOPE_WHOLE.filter(function (w) { return w.length >= 7; }), NOPE_RSET = new Set(NOPE_REVIEW);
function nickCheck(n) {
  if (!n) return 'ok';
  if (window.FG_NameFilter) return window.FG_NameFilter.check(n).ok ? 'ok' : 'bad'; /* namefilter.js (categories, look-alikes, phrases); the older lists below are the backup */
  const two = function (x) { return x.replace(/(.)\1{2,}/g, '$1$1'); }, one = function (x) { return x.replace(/(.)\1+/g, '$1'); };
  const base = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const leet = function (x, o) { return x.replace(/0/g, 'o').replace(/1/g, o).replace(/3/g, 'e').replace(/[4@]/g, 'a').replace(/[5$]/g, 's').replace(/7/g, 't').replace(/8/g, 'b').replace(/9/g, 'g').replace(/[!|]/g, 'i'); };
  const forms = [base, base.replace(/[0-9]/g, ' '), base.replace(/[a-z]/g, ' '), leet(base, 'i'), leet(base, 'l'), leet(base, 'i').replace(/v/g, 'u')];
  let verdict = 'ok';
  forms.forEach(function (f) {
    if (verdict === 'bad') return;
    const toks = f.split(/[^a-z0-9]+/).filter(Boolean), flat = toks.join(''), cands = [flat, two(flat)];
    toks.forEach(function (t, k) { cands.push(t, two(t)); if (toks[k + 1]) cands.push(t + toks[k + 1]); if (toks[k + 2]) cands.push(t + toks[k + 1] + toks[k + 2]); });
    if (NOPE_SUB.some(function (r) { return flat.indexOf(r) >= 0 || two(flat).indexOf(r) >= 0 || (one(r).length >= 4 && one(flat).indexOf(one(r)) >= 0); }) ||
        cands.some(function (c) { return NOPE_SET.has(c) || (c.length >= 5 && NOPE_SET.has(one(c))); }) ||
        NOPE_LONG.some(function (w) { return flat.indexOf(w) >= 0; })) { verdict = 'bad'; return; }
    if (cands.some(function (c) { return NOPE_RSET.has(c); })) verdict = 'review';
  });
  return verdict;
}
function nickOK(n) { return nickCheck(n) === 'ok' || (S.okNames && S.okNames.indexOf(n) >= 0); }
function safeName() { const a = ['Cell', 'Leaf', 'Spore', 'Atom', 'Comet', 'Nova', 'Gene', 'Moss', 'Coral', 'Orbit', 'Fern', 'Comet'], b = ['Explorer', 'Scout', 'Ranger', 'Finder', 'Seeker', 'Pilot'];
  return a[Math.floor(Math.random() * a.length)] + b[Math.floor(Math.random() * b.length)] + (10 + Math.floor(Math.random() * 90)); }
/* Leaderboard: kept separate so it can later talk to an online score service.
   To go online, replace submit() and top() with calls to that service.
   It stores a nickname and a score only. Never add names, emails, or other personal details. */
BQ.Leaderboard = {
  submit: function (nick, score) {
    if (!nick || !nickOK(nick)) return;
    const row = S.board.find(function (r) { return r.nick === nick; });
    if (row) row.score = Math.max(row.score, score); else S.board.push({ nick: nick, score: score });
    S.board.sort(function (a, b) { return b.score - a.score; }); S.board = S.board.slice(0, 10); save();
  },
  top: function (n) { return S.board.slice(0, n || 10); }
};

/* ---------- TEXT (translation-ready) ----------
   New interface text uses stable keys. English is the fallback, so a missing Spanish line still shows English.
   tx('key') or tx('key', { n: 3 }) replaces {n} in the text. Language lives in S.set.lang ('en' or 'es'). */
const I18N = {
  en: {
    'h.ghost': 'That faint shape is a hidden platform. Lab goggles make it solid. Earn them with 3 stars or buy them at the station shop.', 'h.crumble': 'Crumbly platform! It breaks if you stand on it too long. Keep moving!', 'h.boom': 'Unstable platform! It will pop if you stay on it. Hop off fast!',
    'j.title': 'Field Journal', 'j.found': '{n} of {m} discovered', 'j.where': 'Found in level {lv}', 'j.unknown': 'Not discovered yet',
    'j.collection': 'Collection complete!', 'j.colReward': 'Collection complete: {lv}! +{p} points', 'j.rare': 'Rare Specimen', 'j.rareYes': 'Found', 'j.rareNo': 'Still hidden',
    'j.achTab': 'Achievements', 'j.world': 'World {n}', 'j.short': 'Quick wins', 'j.medium': 'Bigger goals', 'j.long': 'Grand goals', 'j.earned': '{n} of {m} earned',
    'j.word': 'Word', 'j.tip': 'Specimens you scan with E are saved here forever. Find them all to complete a collection.', 'j.open': 'Field Journal',
    'a.pop': 'Achievement unlocked!',
    'a.first-scan': 'First Discovery', 'a.first-scan.d': 'Scan your first specimen.',
    'a.first-rare': 'Treasure Hunter', 'a.first-rare.d': 'Find a Rare Specimen.',
    'a.hidden-10': 'Sharp Eyes', 'a.hidden-10.d': 'Collect 10 hidden purple sparks.',
    'a.shopper': 'Supply Run', 'a.shopper.d': 'Buy something in the Supply Shop.',
    'a.stylist': 'New Look', 'a.stylist.d': 'Change your look in the Wardrobe.',
    'a.cell': 'Cell Builder', 'a.cell.d': 'Build a 3-D cell.',
    'a.code': 'Code Breaker', 'a.code.d': 'Open a portal on your first try.',
    'a.scan-25': 'Naturalist', 'a.scan-25.d': 'Scan 25 different specimens.',
    'a.collection': 'Collector', 'a.collection.d': 'Complete every specimen in one level.',
    'a.no-help': 'On My Own', 'a.no-help.d': 'Finish a level without a gold hint.',
    'a.speedy': 'Speedy Scientist', 'a.speedy.d': 'Finish a level in under 3 minutes.',
    'a.immune': 'Immune Hero', 'a.immune.d': 'Tag 15 germs in Immune Defense.',
    'a.golf': 'Perfect Fit', 'a.golf.d': 'Sink an enzyme golf hole in one putt.',
    'a.dna-lab': 'Gene Machine', 'a.dna-lab.d': 'Decode the secret message in the Code Lab.',
    'a.practice': 'Practice Pays', 'a.practice.d': 'Get 5 Practice Bay questions right on the first try.',
    'a.second-look': 'Second Look', 'a.second-look.d': 'Go back to a finished level and discover something you missed.',
    'a.persist': 'Never Give Up', 'a.persist.d': 'Solve a challenge after the gold hint appears.',
    'a.world1': 'Cell Expert', 'a.world1.d': 'Finish every level in World 1.',
    'a.world2': 'Energy Expert', 'a.world2.d': 'Finish every level in World 2.',
    'a.scan-all': 'Master Naturalist', 'a.scan-all.d': 'Discover every specimen in Worlds 1 and 2.',
    'a.rare-all': 'Rare Collector', 'a.rare-all.d': 'Find every Rare Specimen.',
    'a.stars-30': 'Star Scientist', 'a.stars-30.d': 'Earn 30 stars.',
    'r.time': 'Time', 'r.bestTime': 'best {t}', 'r.newBestTime': 'new personal best!'
  },
  es: {
    'h.ghost': 'Esa forma tenue es una plataforma escondida. Las gafas de laboratorio la vuelven sólida. Gánalas con 3 estrellas o cómpralas en la tienda de la estación.', 'h.crumble': '¡Plataforma frágil! Se rompe si te quedas encima mucho tiempo. ¡Sigue moviéndote!', 'h.boom': '¡Plataforma inestable! Va a estallar si te quedas encima. ¡Salta rápido!',
    'j.title': 'Diario de campo', 'j.found': '{n} de {m} descubiertos', 'j.where': 'Se encuentra en el nivel {lv}', 'j.unknown': 'Aún no descubierto',
    'j.collection': '¡Colección completa!', 'j.colReward': '¡Colección completa: {lv}! +{p} puntos', 'j.rare': 'Espécimen raro', 'j.rareYes': 'Encontrado', 'j.rareNo': 'Aún escondido',
    'j.achTab': 'Logros', 'j.world': 'Mundo {n}', 'j.short': 'Logros rápidos', 'j.medium': 'Metas mayores', 'j.long': 'Grandes metas', 'j.earned': '{n} de {m} conseguidos',
    'j.word': 'Palabra', 'j.tip': 'Los especímenes que escaneas con E se guardan aquí para siempre. Encuéntralos todos para completar una colección.', 'j.open': 'Diario de campo',
    'a.pop': '¡Logro desbloqueado!',
    'a.first-scan': 'Primer descubrimiento', 'a.first-scan.d': 'Escanea tu primer espécimen.',
    'a.first-rare': 'Cazador de tesoros', 'a.first-rare.d': 'Encuentra un espécimen raro.',
    'a.hidden-10': 'Ojos agudos', 'a.hidden-10.d': 'Recoge 10 chispas moradas escondidas.',
    'a.shopper': 'De compras', 'a.shopper.d': 'Compra algo en la tienda de suministros.',
    'a.stylist': 'Nuevo look', 'a.stylist.d': 'Cambia tu aspecto en el vestidor.',
    'a.cell': 'Constructor de células', 'a.cell.d': 'Construye una célula en 3D.',
    'a.code': 'Descifrador', 'a.code.d': 'Abre un portal en tu primer intento.',
    'a.scan-25': 'Naturalista', 'a.scan-25.d': 'Escanea 25 especímenes diferentes.',
    'a.collection': 'Coleccionista', 'a.collection.d': 'Completa todos los especímenes de un nivel.',
    'a.no-help': 'Por mi cuenta', 'a.no-help.d': 'Termina un nivel sin una pista dorada.',
    'a.speedy': 'Científico veloz', 'a.speedy.d': 'Termina un nivel en menos de 3 minutos.',
    'a.immune': 'Héroe inmunitario', 'a.immune.d': 'Marca 15 microbios en Defensa Inmunitaria.',
    'a.golf': 'Encaje perfecto', 'a.golf.d': 'Mete un hoyo del minigolf de enzimas en un solo golpe.',
    'a.dna-lab': 'Máquina de genes', 'a.dna-lab.d': 'Descifra el mensaje secreto en el Laboratorio del Código.',
    'a.practice': 'La práctica vale', 'a.practice.d': 'Acierta 5 preguntas de la Sala de Práctica al primer intento.',
    'a.second-look': 'Segunda mirada', 'a.second-look.d': 'Vuelve a un nivel terminado y descubre algo que te perdiste.',
    'a.persist': 'Nunca me rindo', 'a.persist.d': 'Resuelve un reto después de que aparezca la pista dorada.',
    'a.world1': 'Experto en células', 'a.world1.d': 'Termina todos los niveles del Mundo 1.',
    'a.world2': 'Experto en energía', 'a.world2.d': 'Termina todos los niveles del Mundo 2.',
    'a.scan-all': 'Gran naturalista', 'a.scan-all.d': 'Descubre todos los especímenes de los Mundos 1 y 2.',
    'a.rare-all': 'Coleccionista de rarezas', 'a.rare-all.d': 'Encuentra todos los especímenes raros.',
    'a.stars-30': 'Científico estrella', 'a.stars-30.d': 'Gana 30 estrellas.',
    'r.time': 'Tiempo', 'r.bestTime': 'mejor {t}', 'r.newBestTime': '¡nuevo récord personal!'
  }
};
function tx(key, vars) {
  const lang = (S && S.set && S.set.lang) || 'en', tbl = I18N[lang] || I18N.en;
  let str = tbl[key]; if (str == null) { str = I18N.en[key]; if (str == null) { if (!tx.miss[key]) { tx.miss[key] = 1; console.warn('Missing text key:', key); } return key; } }
  if (vars) Object.keys(vars).forEach(function (k) { str = str.split('{' + k + '}').join(vars[k]); });
  return str;
}
tx.miss = {};
function fmtTime(sec) { sec = Math.round(sec); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); }
/* ---------- small helpers ---------- */
const $ = function (id) { return document.getElementById(id); };
const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
const rnd = function (a, b) { return a + Math.random() * (b - a); };
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function allLevels() {
  const out = [];
  Object.keys(BQ.worlds).sort().forEach(function (k) { BQ.worlds[k].levels.forEach(function (lv) { out.push({ w: BQ.worlds[k], lv: lv }); }); });
  return out;
}
function totalStars() { return Object.keys(S.levels).reduce(function (n, k) { return n + (S.levels[k].stars || 0); }, 0); }
function totalScore() { return Object.keys(S.levels).reduce(function (n, k) { return n + (S.levels[k].best || 0); }, 0); }
/* Testing: add #teacher (or #level-1-4 to jump straight to a level) to the end of the game's address. */
const TEACH = /teacher|level-/i.test(location.hash || '');
function played(id) { return TEACH || S.set.unlock || !!(S.levels[id] && S.levels[id].stars); }
function unlocked(i, list) { return i === 0 || S.set.unlock || TEACH || !!(S.levels[list[i - 1].lv.id] && S.levels[list[i - 1].lv.id].stars); }

/* ---------- sound with captions ---------- */
let AC = null, capTimer = 0;
function caption(text) { if (!S.set.cap) return; $('cap').textContent = '[' + text + ']'; $('cap').hidden = false; clearTimeout(capTimer); capTimer = setTimeout(function () { $('cap').hidden = true; }, 2200); }
function beep(freq, dur, type, cap) {
  if (cap) caption('sound: ' + cap);
  if (!S.set.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.07 * ((S.set.svol == null ? 100 : S.set.svol) / 100), AC.currentTime); g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
  } catch (e) { /* no sound available */ }
}

/* ---------- music: composed in code, so there are no audio files and no copyright issues ---------- */
const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], mixo: [0, 2, 4, 5, 7, 9, 10] };
/* Each song: speed (bpm), starting note, scale, chord pattern for 4 bars, drum style, melody sound. */
const SONGS = {
  menu: { name: 'calm space theme', bpm: 78, root: 57, scale: 'dorian', prog: [0, 3, 5, 4], seed: 3, drums: 0, lead: 'triangle' },
  pond: { name: 'bright pond theme', bpm: 108, root: 60, scale: 'major', prog: [0, 3, 4, 0], seed: 7, drums: 1, lead: 'square' },
  cell: { name: 'bubbly cell theme', bpm: 96, root: 62, scale: 'dorian', prog: [0, 2, 3, 4], seed: 11, drums: 1, lead: 'triangle' },
  nucleus: { name: 'busy factory theme', bpm: 104, root: 58, scale: 'minor', prog: [0, 5, 2, 6], seed: 5, drums: 1, lead: 'square' },
  membrane: { name: 'flowing membrane theme', bpm: 92, root: 60, scale: 'mixo', prog: [0, 6, 3, 0], seed: 9, drums: 1, lead: 'triangle' },
  body: { name: 'heartbeat theme', bpm: 112, root: 57, scale: 'minor', prog: [0, 5, 3, 4], seed: 13, drums: 2, lead: 'triangle' },
  shore: { name: 'ocean breeze theme', bpm: 92, root: 62, scale: 'major', prog: [0, 4, 5, 3], seed: 19, drums: 1, lead: 'triangle' },
  deep: { name: 'deep sea theme', bpm: 58, root: 50, scale: 'minor', prog: [0, 5, 3, 4], seed: 77, drums: 0, lead: 'sine' },
  reef: { name: 'coral reef theme', bpm: 84, root: 62, scale: 'major', prog: [0, 4, 5, 3], seed: 59, drums: 1, lead: 'triangle' },
  lab: { name: 'molecule builder theme', bpm: 104, root: 60, scale: 'mixo', prog: [0, 3, 6, 4], seed: 23, drums: 1, lead: 'square' },
  gut: { name: 'enzyme groove theme', bpm: 100, root: 57, scale: 'dorian', prog: [0, 3, 0, 4], seed: 29, drums: 2, lead: 'triangle' },
  leaf: { name: 'sunlit leaf theme', bpm: 96, root: 64, scale: 'major', prog: [0, 5, 3, 4], seed: 31, drums: 1, lead: 'triangle' },
  meadow: { name: 'wild meadow theme', bpm: 112, root: 60, scale: 'major', prog: [0, 4, 3, 4], seed: 37, drums: 1, lead: 'square' },
  forest: { name: 'forest trail theme', bpm: 100, root: 62, scale: 'dorian', prog: [0, 4, 3, 4], seed: 41, drums: 1, lead: 'square' },
  garden: { name: 'pea garden theme', bpm: 108, root: 60, scale: 'major', prog: [0, 4, 3, 4], seed: 43, drums: 1, lead: 'square' },
  island: { name: 'island breeze theme', bpm: 96, root: 64, scale: 'mixo', prog: [0, 4, 3, 4], seed: 47, drums: 1, lead: 'square' },
  canyon: { name: 'canyon dig theme', bpm: 90, root: 57, scale: 'dorian', prog: [0, 4, 3, 4], seed: 53, drums: 1, lead: 'square' },
  boss: { name: 'boss battle theme', bpm: 138, root: 55, scale: 'minor', prog: [0, 0, 5, 4], seed: 17, drums: 3, lead: 'square' }
};
const Music = { want: null, cur: null, song: null, mel: null, step: 0, next: 0, timer: 0, gain: null, duck: 1, gesture: false, noise: null };
function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function noteOf(song, d, oct) { const sc = SCALES[song.scale], o = Math.floor(d / 7); return song.root + 12 * (oct + o) + sc[((d % 7) + 7) % 7]; }
function makeMelody(song) {
  let seed = song.seed; const r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const phrase = function (rh) { return rh.map(function (st) { return { st: st, d: [0, 2, 4, 7, 2, 4][Math.floor(r() * 6)] + (r() < 0.25 ? 1 : 0), len: r() < 0.3 ? 3 : 2 }; }); };
  const A = phrase([0, 3, 6, 8, 10, 12]), B = phrase([0, 2, 4, 8, 11, 14]);
  return [A, B, A, phrase([0, 3, 6, 8, 10, 12])];
}
function voice(freq, t, dur, type, vol) {
  const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(Music.gain); o.start(t); o.stop(t + dur + 0.05);
}
function drum(t, kind) {
  if (kind === 'kick') {
    const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18); o.connect(g); g.connect(Music.gain); o.start(t); o.stop(t + 0.2); return;
  }
  if (!Music.noise) { const b = AC.createBuffer(1, Math.floor(AC.sampleRate * 0.06), AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; Music.noise = b; }
  const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); src.buffer = Music.noise; f.type = 'highpass'; f.frequency.value = 6500;
  g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); src.connect(f); f.connect(g); g.connect(Music.gain); src.start(t);
}
function schedule() {
  const song = Music.song; if (!song || !AC) return;
  const sp = 60 / song.bpm / 4;
  while (Music.next < AC.currentTime + 0.25) {
    const i = Music.step, bar = Math.floor(i / 16) % 4, st = i % 16, t = Music.next, ch = song.prog[bar], dr = song.drums;
    if (st === 0) [0, 2, 4].forEach(function (k) { voice(mtof(noteOf(song, ch + k, 0)), t, sp * 15, 'sine', 0.03); });
    if (st === 0 || st === 8) voice(mtof(noteOf(song, ch, -1)), t, sp * 3, 'triangle', 0.15);
    if (st === 6 || st === 14) voice(mtof(noteOf(song, ch + 4, -1)), t, sp * 1.5, 'triangle', 0.09);
    if (st % 2 === 0) voice(mtof(noteOf(song, ch + [0, 2, 4, 7][(st / 2) % 4], 1)), t, sp * 1.2, 'sine', 0.03);
    if (Math.floor(i / 64) % 3 !== 2) Music.mel[bar].forEach(function (n) { if (n.st === st) voice(mtof(noteOf(song, ch + n.d, 1)), t, sp * n.len * 0.9, song.lead, song.lead === 'square' ? 0.03 : 0.07); });
    if (dr === 1 || dr === 3) { if (st === 0 || st === 8 || (dr === 3 && (st === 6 || st === 14))) drum(t, 'kick'); if (dr === 3 ? st % 2 === 0 : (st === 4 || st === 12)) drum(t, 'hat'); }
    if (dr === 2 && (st === 0 || st === 3 || st === 8 || st === 11)) drum(t, 'kick');
    Music.next += sp; Music.step++;
  }
}
function musicLevel() {
  if (!Music.gain) return;
  const v = S.set.music ? (S.set.vol / 100) * 0.7 * Music.duck * (paused ? 0 : 1) : 0;
  Music.gain.gain.setTargetAtTime(v, AC.currentTime, 0.15);
}
Music.play = function (name) {
  Music.want = name; if (!SONGS[name] || !Music.gesture || !S.set.music) return;
  if (Music.cur === name) { musicLevel(); return; }
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return; }
  if (!Music.gain) { Music.gain = AC.createGain(); Music.gain.gain.value = 0; Music.gain.connect(AC.destination); }
  Music.cur = name; Music.song = SONGS[name]; Music.mel = makeMelody(Music.song); Music.step = 0; Music.next = AC.currentTime + 0.1;
  if (!Music.timer) Music.timer = setInterval(schedule, 60);
  musicLevel(); caption('music: ' + Music.song.name);
};
Music.stop = function () { Music.cur = null; Music.song = null; Music.want = null; };
Music.setDuck = function (d) { Music.duck = d; musicLevel(); };

/* ---------- 3D building blocks ---------- */
let renderer, scene, cam, camZ = 22, G = {}, mats = {}, texCache = {};
/* Change this line each time a new version is uploaded. */
const VERSION = 'Version 46 · October 24, 2026';
const COLORS = [['Sky blue', '#56B4E9'], ['Orange', '#E69F00'], ['Green', '#009E73'], ['Pink', '#CC79A7'], ['Yellow', '#F0E442'], ['Red-orange', '#D55E00'], ['Turquoise', '#2EC4B6'], ['Purple', '#8E5CE6'], ['Helix gold', '#E8B730', 'helix']];
const GEAR = [['None', 0], ['Lab goggles', 3], ['Explorer cape', 8], ['Ribosome hat', 12]];
const GEARINFO = ['Gear gives you a special power. Earn stars to unlock more gear.',
  'Lab goggles: see hidden platforms and secret paths that other players cannot see.',
  'Explorer cape: hold the jump key while falling to fly for a short time. Land to recharge.',
  'Ribosome hat: ribosomes build proteins! Press E in the air to build a protein platform under your feet (one each time you leave the ground).'];
/* Each world's look: sky gradient, sun glow, layered ridges, haze, drifting lights, light beams. */
const THEMES = {
  space: { skyTop: '#040a1c', horizon: '#1f3f73', skyBottom: '#08142c', sun: ['#7fb8ff', 70, 30, 200], ridge: '#0c1c36', ground: '#14304a', top: '#2c5f80', rim: '#9fe8ff',
    mote: '#bfe6ff', stars: true, pal: ['#2f7f9a', '#5fd0c5', '#8a7fd6'], shapes: ['blob', 'ring'], density: 0.35, fogD: 0.012, hemi: ['#9fc8ff', '#1a2238'], key: '#cfe6ff' },
  pond: { skyTop: '#1d3466', horizon: '#f4ad78', skyBottom: '#d9806a', sun: ['#ffcf8a', -40, 9, 230], ridge: '#3b3d6c', ground: '#253830', top: '#4f7448', rim: '#ffe2a8',
    mote: '#ffe28a', shafts: '#ffd59a', pal: ['#202c44', '#283650', '#30405c'], shapes: ['tree'], density: 0.75, fogD: 0.010, hemi: ['#ffd2a8', '#2a2f4a'], key: '#ffc58a' },
  cell: { skyTop: '#020b13', horizon: '#0e6169', skyBottom: '#04212a', sun: ['#5ff0e0', 30, 14, 200], ridge: '#06313a', ground: '#0b3640', top: '#1d7a74', rim: '#8ffff0',
    mote: '#8ffff0', shafts: '#6fe8ff', pal: ['#f4a259', '#8cb369', '#ff7aa8', '#f4e285', '#7fb7e6'], shapes: ['bean', 'blob', 'ring'], density: 0.5, glow: true, fogD: 0.014, hemi: ['#7fe8ff', '#04161c'], key: '#aef6ff' },
  nucleus: { skyTop: '#0a0420', horizon: '#5d2b8c', skyBottom: '#1c0b38', sun: ['#d79bff', -25, 16, 200], ridge: '#2a1450', ground: '#22144a', top: '#5a46a0', rim: '#f0d0ff',
    mote: '#ffb8f0', shafts: '#c89bff', pal: ['#ff9f6e', '#7fd4ff', '#f4e285', '#c59cff'], shapes: ['ring', 'blob', 'pillar'], density: 0.5, glow: true, fogD: 0.013, hemi: ['#d7b8ff', '#120826'], key: '#ffd6f5' },
  membrane: { skyTop: '#06222a', horizon: '#d88c3e', skyBottom: '#4a2a1a', sun: ['#ffc070', 45, 10, 240], ridge: '#3a2a26', ground: '#55301a', top: '#a8763c', rim: '#fff0b8',
    mote: '#ffd98a', shafts: '#ffcf80', pal: ['#f2c078', '#5fd0c5', '#e8875a'], shapes: ['pillar', 'blob', 'pillar'], density: 0.45, glow: true, fogD: 0.011, hemi: ['#ffd9a0', '#1a1410'], key: '#ffd08a' },
  shore: { skyTop: '#0b2a4a', horizon: '#9fd8ec', skyBottom: '#2a6f97', sun: ['#fff2c0', 30, 12, 220], ridge: '#1b4965', ground: '#3a3426', top: '#c9b27c', rim: '#fff2c0',
    mote: '#d0f4ff', shafts: '#bfefff', pal: ['#1b4965', '#3f7fa8', '#62b6cb'], shapes: ['hill', 'blob'], density: 0.6, fogD: 0.010, hemi: ['#cfefff', '#1a2a3a'], key: '#fff2d0' },
  lab: { skyTop: '#140a24', horizon: '#c27c3a', skyBottom: '#2a1640', sun: ['#ffc970', -30, 14, 210], ridge: '#2a1a40', ground: '#2a2038', top: '#7a5ab0', rim: '#ffe0a0',
    mote: '#ffd98a', shafts: '#ffc970', pal: ['#ffd166', '#7be0ad', '#ff9f6e', '#c59cff'], shapes: ['ring', 'bean', 'blob'], density: 0.5, glow: true, fogD: 0.013, hemi: ['#ffd9b0', '#140a20'], key: '#ffe0b0' },
  gut: { skyTop: '#1a0610', horizon: '#e0703a', skyBottom: '#401018', sun: ['#ffb070', 10, 14, 220], ridge: '#4a1a1a', ground: '#4a2020', top: '#c0604a', rim: '#ffd0a0',
    mote: '#ffc090', shafts: '#ffb080', pal: ['#ff9f6e', '#ffd166', '#e85d5d'], shapes: ['blob', 'disc', 'bean'], density: 0.5, glow: true, fogD: 0.013, hemi: ['#ffc0a0', '#200808'], key: '#ffd0b0' },
  leaf: { skyTop: '#04140a', horizon: '#5fbf5a', skyBottom: '#0a2a12', sun: ['#d8ff8a', -20, 16, 230], ridge: '#0e3a1a', ground: '#123a1c', top: '#3f8a3a', rim: '#d8ffb0',
    mote: '#d8ff8a', shafts: '#c8ff9a', pal: ['#2f7a3a', '#7be06a', '#c8ff7a'], shapes: ['disc', 'bean', 'pillar'], density: 0.5, glow: true, fogD: 0.012, hemi: ['#d8ffb0', '#06140a'], key: '#e8ffd0' },
  meadow: { skyTop: '#2a6fd4', horizon: '#cfeeff', skyBottom: '#8fc9f0', sun: ['#fff6d0', 40, 18, 240], ridge: '#5a8a4a', ground: '#3a4a22', top: '#7aa84a', rim: '#fff6c0',
    mote: '#ffffff', shafts: '#fff6d0', pal: ['#4a7a3a', '#6a9a4a', '#8aba5a'], shapes: ['tree', 'hill'], density: 0.8, fogD: 0.008, hemi: ['#e8f6ff', '#3a4a2a'], key: '#fff6e0' },
  /* Worlds 3 to 5 */
  reef: { skyTop: '#2a8ad8', horizon: '#9fe6f0', skyBottom: '#1f6a9a', sun: ['#fff8d8', 30, 20, 240], ridge: '#1f5f7a', ground: '#d8c08a', top: '#f0dca8', rim: '#fff6d0',
    mote: '#e8fbff', shafts: '#cff6ff', pal: ['#ff7a8a', '#ffb070', '#c59cff', '#ffd166', '#5fd0c5', '#ff9fdf'], shapes: ['coral', 'fan', 'kelp', 'coral'], density: 0.9, fogD: 0.012, hemi: ['#d8f6ff', '#1a3a4a'], key: '#fff6e0', seabed: -9, doorWall: '#b08a6a' },
  deep: { skyTop: '#1a6ab8', horizon: '#8fd0e8', skyBottom: '#1f5a8a', sun: ['#fff8d8', 30, 20, 240], ridge: '#1a4a6a', ground: '#3a3c48', top: '#5a5c6a', rim: '#9fe6ff',
    mote: '#cfefff', shafts: '#bfe8ff', pal: ['#bfe8ff', '#9fd8ff', '#d8c8ff'], shapes: ['blob'], density: 0.001, fogD: 0.012, hemi: ['#cfe8ff', '#10202c'], key: '#e8f4ff', doorWall: '#4a4c58' },
  forest: { skyTop: '#123a2a', horizon: '#f0c878', skyBottom: '#6a8a4a', sun: ['#fff0b0', 35, 16, 230], ridge: '#1f4a2a', ground: '#2e3a1e', top: '#5f8a3a', rim: '#fff0c0',
    mote: '#fff6c0', shafts: '#ffe8a0', pal: ['#1f4a2a', '#2f6a34', '#4a8a3a'], shapes: ['tree', 'tree', 'hill'], density: 0.85, fogD: 0.011, hemi: ['#f0f8d0', '#1a2a12'], key: '#fff0c8' },
  garden: { skyTop: '#3a6ad0', horizon: '#ffe6c0', skyBottom: '#a8d0f0', sun: ['#fff6d0', -35, 16, 240], ridge: '#6a9a4a', ground: '#4a3a22', top: '#8ab84a', rim: '#fff6d0',
    mote: '#ffffff', shafts: '#fff6d0', pal: ['#6aaa4a', '#c59cff', '#ffffff', '#ff9fbf'], shapes: ['tree', 'blob', 'hill'], density: 0.7, fogD: 0.008, hemi: ['#f0f8ff', '#3a4a2a'], key: '#fff6e0' },
  island: { skyTop: '#0a4a8a', horizon: '#ffe0a0', skyBottom: '#4ab0d8', sun: ['#fff4c0', 25, 14, 240], ridge: '#2a6a5a', ground: '#4a3a2a', top: '#d8c08a', rim: '#fff4d0',
    mote: '#e8fbff', shafts: '#fff0c0', pal: ['#2a7a5a', '#4a9a6a', '#8ac07a'], shapes: ['hill', 'tree', 'blob'], density: 0.6, fogD: 0.009, hemi: ['#e0f6ff', '#2a2a1a'], key: '#fff4d8' },
  canyon: { skyTop: '#2a3a7a', horizon: '#ffb070', skyBottom: '#d07a4a', sun: ['#ffd090', -30, 12, 230], ridge: '#8a4a2a', ground: '#5a3020', top: '#c8784a', rim: '#ffe0b0',
    mote: '#ffd8a8', shafts: '#ffc890', pal: ['#a85a3a', '#c8784a', '#e0a070'], shapes: ['pillar', 'hill', 'pillar'], density: 0.6, fogD: 0.010, hemi: ['#ffe0c0', '#2a140a'], key: '#ffd8b0' },
  body: { skyTop: '#120206', horizon: '#a82a3c', skyBottom: '#3a0a12', sun: ['#ff6b7a', 0, 16, 230], pulse: true, ridge: '#3a0a16', ground: '#45101e', top: '#9a3c52', rim: '#ffc0c8',
    mote: '#ff9aa8', shafts: '#ff8090', pal: ['#e85d5d', '#ffb3a7', '#c9364a'], shapes: ['disc', 'disc', 'blob'], density: 0.5, glow: true, fogD: 0.013, hemi: ['#ff9aa8', '#1a0408'], key: '#ffb0b8' }
};
let FX = {}, SKY = null, MOTES = null, HEMI = null, KEYL = null;
function makeFxTextures() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.22, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); FX.glow = new T.CanvasTexture(c);
  const c2 = document.createElement('canvas'); c2.width = 64; c2.height = 256; const g2 = c2.getContext('2d');
  const v = g2.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(1, 'rgba(255,255,255,0)'); g2.fillStyle = v; g2.fillRect(0, 0, 64, 256);
  g2.globalCompositeOperation = 'destination-in'; const h = g2.createLinearGradient(0, 0, 64, 0); h.addColorStop(0, 'rgba(0,0,0,0)'); h.addColorStop(0.5, 'rgba(0,0,0,1)'); h.addColorStop(1, 'rgba(0,0,0,0)');
  g2.fillStyle = h; g2.fillRect(0, 0, 64, 256); FX.shaft = new T.CanvasTexture(c2);
}
function glow(color, size, op, fog) {
  const sp = new T.Sprite(new T.SpriteMaterial({ map: FX.glow, color: color, transparent: true, opacity: op == null ? 0.8 : op, blending: T.AdditiveBlending, depthWrite: false, fog: fog !== false }));
  sp.scale.set(size, size, 1); return sp;
}
function basic(color, op, add) {
  const k = 'b' + color + '|' + op + '|' + (add ? 1 : 0);
  if (!mats[k]) mats[k] = new T.MeshBasicMaterial({ color: color, transparent: op != null, opacity: op == null ? 1 : op, blending: add ? T.AdditiveBlending : T.NormalBlending, depthWrite: !add });
  return mats[k];
}
function emat(color, em) {
  const k = 'e' + color + em;
  if (!mats[k]) mats[k] = new T.MeshLambertMaterial({ color: color, emissive: em });
  return mats[k];
}
function gate(x0, x1, y0, y1) {
  const g = new T.Group(), m = new T.Mesh(G.box, basic(L.th.rim, 0.13, true)); m.scale.set(x1 - x0, y1 - y0, 5); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(m);
  const core = new T.Mesh(G.box, basic(L.th.rim, 0.28, true)); core.scale.set(0.15, y1 - y0, 5.2); core.position.copy(m.position); g.add(core);
  return g;
}
let RIDGES = [];
function scenery(th, x0, x1, grp, anim) {
  RIDGES = [];
  const low = S.set.low, hz = new T.Color(th.horizon);
  scene.background = new T.Color(th.horizon); scene.fog = new T.FogExp2(th.horizon, th.fogD);
  HEMI.color.set(th.hemi[0]); HEMI.groundColor.set(th.hemi[1]); KEYL.color.set(th.key);
  /* sky dome and sun, kept centered on the camera so they look infinitely far away */
  SKY = new T.Group();
  const dome = new T.Mesh(new T.SphereGeometry(500, 24, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new T.Color(th.skyTop) }, hor: { value: hz.clone() }, bot: { value: new T.Color(th.skyBottom) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 hor; uniform vec3 bot; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(hor, top, pow(min(h * 2.4, 1.0), 0.6)) : mix(hor, bot, min(-h * 4.0, 1.0)); gl_FragColor = vec4(c, 1.0); }' }));
  dome.renderOrder = -10; SKY.add(dome);
  const sx = th.sun[1], sy = th.sun[2], sun1 = glow(th.sun[0], th.sun[3], 0.9, false), sun2 = glow('#ffffff', th.sun[3] * 0.18, 0.9, false), sun3 = glow(th.sun[0], th.sun[3] * 2.4, 0.35, false);
  [sun3, sun1, sun2].forEach(function (g) { g.position.set(sx * 4, sy * 4, -420); SKY.add(g); });
  SKY.userData = { sun: sun1, base: th.sun[3], pulse: th.pulse };
  if (th.stars) {
    const n = 500, p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), e = rnd(0.05, 1.3); p[i * 3] = Math.cos(a) * Math.cos(e) * 440; p[i * 3 + 1] = Math.sin(e) * 440; p[i * 3 + 2] = -Math.abs(Math.sin(a) * Math.cos(e) * 440) - 40; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(p, 3));
    SKY.add(new T.Points(sg, new T.PointsMaterial({ size: 2.2, map: FX.glow, color: '#dbe9ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false, sizeAttenuation: true })));
  }
  grp.add(SKY);
  /* layered ridges that fade into the haze */
  const layers = low ? [1, 3] : [0, 1, 2, 3];
  layers.forEach(function (k) {
    const z = [-26, -48, -85, -150][k], amp = [2.5, 5, 10, 20][k], base = [-2, 1, 6, 16][k], span = Math.abs(z) * 1.6 + 80, xa = x0 - span, xb = x1 + span;
    const ph = [rnd(0, 6), rnd(0, 6), rnd(0, 6)], fr = [rnd(0.02, 0.035) / (1 + k * 0.5), rnd(0.07, 0.1) / (1 + k * 0.5), rnd(0.18, 0.26) / (1 + k * 0.5)];
    const sh = new T.Shape(); sh.moveTo(xa, -120);
    for (let x = xa; x <= xb; x += 2.5) sh.lineTo(x, base + amp * (0.6 * Math.sin(x * fr[0] + ph[0]) + 0.3 * Math.sin(x * fr[1] + ph[1]) + 0.1 * Math.sin(x * fr[2] + ph[2])));
    sh.lineTo(xb, -120); sh.closePath();
    const col = new T.Color(th.ridge).lerp(hz, 0.12 + k * 0.2), m = new T.Mesh(new T.ShapeGeometry(sh), new T.MeshBasicMaterial({ color: col, fog: false }));
    m.position.z = z; m.renderOrder = -5 + k; grp.add(m); RIDGES.push({ m: m, base: col.clone() });
  });
  /* beams of light from above */
  if (th.shafts && !low) {
    const n = Math.max(4, Math.round((x1 - x0) / 16));
    for (let i = 0; i < n; i++) {
      const m = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: FX.shaft, color: th.shafts, transparent: true, opacity: rnd(0.05, 0.12), blending: T.AdditiveBlending, depthWrite: false, fog: false, side: T.DoubleSide }));
      m.scale.set(rnd(3, 10), 70, 1); m.position.set(rnd(x0 - 20, x1 + 20), 16, rnd(-34, -12)); m.rotation.z = -0.38; grp.add(m);
    }
  }
  /* drifting specks of light */
  const n = low ? 140 : 450, pos = new Float32Array(n * 3), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) { pos[i * 3] = rnd(x0 - 25, x1 + 25); pos[i * 3 + 1] = rnd(-3, 18); pos[i * 3 + 2] = rnd(-16, 7); ph[i] = rnd(0, 6.3); }
  const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(pos, 3));
  grp.add(new T.Points(mg, new T.PointsMaterial({ size: 0.32, map: FX.glow, color: th.mote, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false })));
  MOTES = { geo: mg, pos: pos, ph: ph, n: n };
  decor(th, x0, x1, grp, anim);
}
function sceneryTick(dt, t) {
  if (SKY) {
    SKY.position.copy(cam.position);
    if (SKY.userData.pulse) { const b = (t * 112 / 60) % 1, p = 1 + 0.12 * Math.exp(-b * 9) + 0.06 * Math.exp(-Math.max(0, b - 0.2) * 9) * (b > 0.2 ? 1 : 0); SKY.userData.sun.scale.setScalar(SKY.userData.base * p); }
  }
  if (MOTES) {
    const p = MOTES.pos;
    for (let i = 0; i < MOTES.n; i++) { p[i * 3 + 1] += dt * 0.35; p[i * 3] += Math.sin(t * 0.5 + MOTES.ph[i]) * dt * 0.3; if (p[i * 3 + 1] > 18) p[i * 3 + 1] = -3; }
    MOTES.geo.attributes.position.needsUpdate = true;
  }
}
function mat(color, opacity) {
  const k = color + '|' + (opacity || 1);
  if (!mats[k]) mats[k] = new T.MeshLambertMaterial({ color: color, transparent: opacity != null && opacity < 1, opacity: opacity == null ? 1 : opacity });
  return mats[k];
}
function mesh(geo, color, opacity) { return new T.Mesh(G[geo], mat(color, opacity)); }
function box(x0, x1, y0, y1, depth, color, opacity) {
  const m = mesh('box', color, opacity); m.scale.set(x1 - x0, y1 - y0, depth); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); return m;
}
function wrapText(g, text, maxW) {
  const words = String(text).split(' '), lines = []; let cur = '';
  words.forEach(function (w) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
function labelTex(text, o) {
  o = o || {};
  const bg = o.bg || '#0e2433', fg = o.fg || '#ffffff', bd = o.bd || '#ffd166', key = text + '|' + bg + fg + bd + (o.big ? 1 : 0);
  if (texCache[key]) return texCache[key];
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d'); let size = o.big ? (String(text).length <= 2 ? 180 : 110) : String(text).length <= 14 ? 92 : 62, lines;
  for (;;) {
    g.font = '700 ' + size + 'px "Atkinson Hyperlegible", Arial, sans-serif'; lines = wrapText(g, text, 460);
    const wide = Math.max.apply(null, lines.map(function (l) { return g.measureText(l).width; }));
    if ((lines.length * size * 1.18 <= 216 && wide <= 470) || size <= 22) break; size -= 4;
  }
  const lh = size * 1.18, H = Math.min(248, lines.length * lh + 34), y0 = (256 - H) / 2, r = 22;
  g.beginPath(); g.moveTo(6 + r, y0); g.arcTo(506, y0, 506, y0 + H, r); g.arcTo(506, y0 + H, 6, y0 + H, r); g.arcTo(6, y0 + H, 6, y0, r); g.arcTo(6, y0, 506, y0, r); g.closePath();
  g.fillStyle = bg; g.fill(); g.lineWidth = 6; g.strokeStyle = bd; g.stroke();
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach(function (l, i) { g.fillText(l, 256, 128 - (lines.length - 1) * lh / 2 + i * lh); });
  const t = new T.CanvasTexture(c); t.userData = { h: H / 256 }; texCache[key] = t; return t;
}
function label(text, w, o) {
  /* readable everywhere: small labels get a minimum size, and all labels follow the Text size setting */
  const ts = [0.9, 1, 1.15, 1.3][S.set.text] || 1; if (!(o && o.big) && w < 2.6) w = 2.6; w *= ts;
  const tex = labelTex(text, o), sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, fog: false })); /* signs stay readable in fog, deep water and caves */
  sp.scale.set(w, w / 2, 1); sp.userData.lbl = { text: String(text), w: w, h: w / 2 * ((tex.userData && tex.userData.h) || 1) }; return sp;
}
/* stack signs from the top down so they never overlap: each sign is placed just under the one before it, using its real height */
function stackLabels(list, x, yTop, z, gap) {
  let y = yTop; list.forEach(function (sp) { if (!sp) return; const h = sp.userData.lbl ? sp.userData.lbl.h : sp.scale.y; sp.position.set(x, y - h / 2, z); y -= h + (gap == null ? 0.15 : gap); });
  return y;
}
function buildAlien(a) {
  const g = new T.Group(), col = COLORS[a.color][1], shape = a.shape || 0;
  const sc = [[0.55, 0.6, 0.5], [0.44, 0.76, 0.42], [0.7, 0.48, 0.55], [0.6, 0.55, 0.52], [0.52, 0.55, 0.5]][shape] || [0.55, 0.6, 0.5];
  const cube = shape === 4, jelly = shape === 3;
  const body = cube ? mesh('box', col) : mesh('sph', col);
  if (cube) { body.scale.set(sc[0] * 1.8, sc[1] * 1.8, sc[2] * 1.8); } else body.scale.set(sc[0], sc[1], sc[2]);
  body.position.y = sc[1] + 0.15; g.add(body);
  if (jelly) { g.userData.tents = []; for (let i = 0; i < 4; i++) { const t = mesh('cyl', col); g.userData.tents.push(t); t.scale.set(0.07, 0.42, 0.07); t.position.set((i - 1.5) * 0.24, 0.16, 0.1); t.rotation.z = (i - 1.5) * 0.15; g.add(t); const tip = mesh('sph', col); tip.scale.setScalar(0.09); tip.position.set((i - 1.5) * 0.27, -0.04, 0.1); g.add(tip); } }
  else { g.userData.legs = [-1, 1].map(function (s2) {
    const hip = new T.Group(); hip.position.set(s2 * sc[0] * 0.45, 0.4, 0); g.add(hip);
    const leg = mesh('cyl', col); leg.scale.set(0.065, 0.3, 0.065); leg.position.y = -0.15; hip.add(leg);
    const f = mesh('sph', col); f.scale.set(0.2, 0.1, 0.22); f.position.set(0, -0.3, 0.05); hip.add(f); return hip; }); }
  const ey = sc[1] * 1.3 + 0.15, ez = cube ? sc[2] * 0.92 : sc[2] * 0.88, style = a.estyle || 0, n = a.eyes || 2;
  const dark = '#10202c', iris = '#6b4bd8';
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * (style === 1 ? 0.36 : 0.3);
    const blush = function () { const b = mesh('sph', '#ff9aa8'); b.scale.set(0.08, 0.04, 0.025); b.position.set(off * 1.5 + (off === 0 ? 0.12 : 0), ey - 0.15, ez - 0.03); g.add(b); };
    if (style === 1) { /* cute eyes: big, dark and sparkly, with happy eyebrows and rosy cheeks */
      const e0 = mesh('sph', '#1e1446'); e0.scale.set(0.135, 0.155, 0.08); e0.position.set(off, ey + 0.03, ez + 0.02); g.add(e0);
      const h1 = mesh('sph', '#ffffff'); h1.scale.set(0.05, 0.055, 0.02); h1.position.set(off + 0.04, ey + 0.08, ez + 0.1); g.add(h1);
      const h2 = mesh('sph', '#ffffff'); h2.scale.set(0.025, 0.025, 0.02); h2.position.set(off - 0.055, ey - 0.03, ez + 0.1); g.add(h2);
      const h3 = mesh('sph', '#ffffff'); h3.scale.set(0.012, 0.012, 0.012); h3.position.set(off - 0.02, ey - 0.055, ez + 0.1); g.add(h3);
      const br = new T.Mesh(new T.TorusGeometry(0.075, 0.016, 6, 12, Math.PI * 0.7), mat('#1e1446')); br.rotation.z = Math.PI * 0.15; br.position.set(off, ey + 0.2, ez - 0.01); g.add(br);
      blush();
    } else if (style === 3) { /* happy closed eyes with lashes */
      const arcE = new T.Mesh(new T.TorusGeometry(0.085, 0.022, 6, 14, Math.PI), mat('#1e1446')); arcE.position.set(off, ey - 0.03, ez + 0.03); g.add(arcE);
      [-1, 1].forEach(function (sd) { const l = mesh('box', '#1e1446'); l.scale.set(0.05, 0.016, 0.016); l.position.set(off + sd * 0.1, ey - 0.02 + 0.015, ez + 0.03); l.rotation.z = sd * -0.6; g.add(l); });
      const br = new T.Mesh(new T.TorusGeometry(0.07, 0.014, 6, 12, Math.PI * 0.7), mat('#1e1446')); br.rotation.z = Math.PI * 0.15; br.position.set(off, ey + 0.15, ez - 0.01); g.add(br);
      blush();
    } else if (style === 4) { /* heart eyes */
      const hc = '#f06a7a', hg = new T.Group();
      [-1, 1].forEach(function (sd) { const lobe = mesh('sph', hc); lobe.scale.set(0.085, 0.085, 0.05); lobe.position.set(sd * 0.065, 0.035, 0); hg.add(lobe); });
      const tip = mesh('cone', hc); tip.scale.set(0.125, -0.07, 0.05); tip.rotation.y = Math.PI / 4; tip.position.set(0, -0.06, 0); hg.add(tip);
      const sh = mesh('sph', '#ffffff'); sh.scale.set(0.026, 0.026, 0.012); sh.position.set(0.08, 0.07, 0.05); hg.add(sh);
      hg.position.set(off, ey + 0.02, ez + 0.03); g.add(hg); blush();
    } else {
      const w = mesh('sph', '#ffffff'); w.scale.setScalar(0.14); w.position.set(off, ey, ez); g.add(w);
      const p = mesh('sph', dark); p.scale.setScalar(0.07); p.position.set(off, ey, ez + 0.1); g.add(p);
      if (style === 2) { const lid = mesh('sph', col); lid.scale.set(0.155, 0.09, 0.155); lid.position.set(off, ey + 0.07, ez + 0.01); g.add(lid); }
    }
    if (a.gear === 1) { const ring = mesh('tor', '#ffd166'); ring.scale.setScalar(style === 1 || style === 4 ? 0.2 : 0.15); ring.position.set(off, ey, ez + 0.06); g.add(ring); }
  }
  if (a.gear === 1) { const strap = mesh('box', dark); strap.scale.set(sc[0] * 1.9, 0.07, sc[2] * 1.7); strap.position.set(0, ey, 0); g.add(strap); }
  /* mouth */
  const mo = a.mouth == null ? 1 : a.mouth, my = sc[1] * 0.98 + 0.15 + (cube ? 0 : 0.02), mz = (cube ? sc[2] * 0.92 : sc[2] * 0.97) + 0.02;
  const arc = function (r, x, y) { const m = new T.Mesh(new T.TorusGeometry(r, 0.022, 6, 14, Math.PI), mat(dark)); m.rotation.z = Math.PI; m.position.set(x, y, mz); g.add(m); return m; };
  if (mo === 1 || mo === 4 || mo === 5) arc(0.11, 0, my + 0.05);
  if (mo === 2) { const o = mesh('sph', '#3a1420'); o.scale.set(0.075, 0.09, 0.04); o.position.set(0, my, mz); g.add(o); const tg = mesh('sph', '#ff7a9a'); tg.scale.set(0.045, 0.03, 0.03); tg.position.set(0, my - 0.04, mz + 0.02); g.add(tg); }
  if (mo === 3) { arc(0.055, -0.055, my + 0.03); arc(0.055, 0.055, my + 0.03); }
  if (mo === 4) [-0.06, 0.06].forEach(function (x) { const f = mesh('cone', '#ffffff'); f.scale.set(0.025, -0.04, 0.025); f.position.set(x, my - 0.06, mz + 0.01); g.add(f); });
  if (mo === 5) { const tg = mesh('sph', '#ff7a9a'); tg.scale.set(0.05, 0.06, 0.03); tg.position.set(0.02, my - 0.08, mz + 0.01); g.add(tg); }
  const top = sc[1] * 2 + 0.15;
  for (let i = 0; i < a.ant; i++) {
    const off = (i - (a.ant - 1) / 2) * 0.4;
    const st = mesh('cyl', col); st.scale.set(0.035, 0.4, 0.035); st.position.set(off, top + 0.15, 0); g.add(st);
    const b = new T.Mesh(G.sph, emat('#ffd166', '#c08a10')); b.scale.setScalar(0.09); b.position.set(off, top + 0.38, 0); b.add(glow('#ffd166', 9, 0.7)); g.add(b); (g.userData.bulbs = g.userData.bulbs || []).push(b);
  }
  if (a.gear === 2) { const cape = mesh('box', '#D55E00'); cape.scale.set(sc[0] * 1.7, sc[1] * 1.5, 0.06); cape.position.set(0, sc[1] * 0.95, -sc[2] - 0.05); cape.rotation.x = 0.18; g.add(cape); g.userData.cape = cape; }
  if (a.gear === 3) {
    const h1 = mesh('sph', '#a58bff'); h1.scale.set(0.3, 0.2, 0.3); h1.position.set(0, top + 0.08, 0); g.add(h1);
    const h2 = mesh('sph', '#c59cff'); h2.scale.set(0.2, 0.14, 0.2); h2.position.set(0, top + 0.3, 0); g.add(h2);
  }
  return g;
}
function decor(th, x0, x1, grp, anim) {
  const dens = (S.set.low ? 0.45 : 1) * (th.density || 1), fog = new T.Color(th.horizon);
  const layers = [{ z: -7, s: 1, n: 0.1, f: 0.1 }, { z: -17, s: 2.2, n: 0.085, f: 0.3 }, { z: -33, s: 4.5, n: 0.06, f: 0.5 }, { z: -60, s: 9, n: 0.04, f: 0.68 }, { z: 6, s: 0.5, n: 0.035, f: 0, fore: true }];
  layers.forEach(function (ly) {
    const span = (x1 - x0) + 60 + Math.abs(ly.z) * 2, count = Math.round(span * ly.n * dens);
    for (let i = 0; i < count; i++) {
      const shape = ly.fore ? 'blob' : th.shapes[Math.floor(Math.random() * th.shapes.length)];
      const c = new T.Color(th.pal[Math.floor(Math.random() * th.pal.length)]).lerp(fog, ly.f);
      const col = '#' + c.getHexString(); let s = ly.s * rnd(0.7, 1.4);
      const x = rnd(x0 - 30 - Math.abs(ly.z), x1 + 30 + Math.abs(ly.z)), z = ly.z + rnd(-2, 2);
      let m, floaty = true, y = rnd(-4, 14) * (ly.fore ? 0.7 : Math.max(1, ly.s * 0.45));
      if (shape === 'coral' || shape === 'fan' || shape === 'kelp') { /* reef life standing on the sea floor */
        const fl = (th.seabed || -9) - 0.5 - (ly.s > 2 ? ly.s * 0.6 : 0); m = new T.Group(); floaty = false; y = fl; s = Math.min(s, 2.6);
        if (shape === 'coral') { for (let k = 0; k < 5; k++) { const br = new T.Mesh(G.cyl, emat(col, '#2a1a1a')); const h = s * rnd(0.8, 1.6); br.scale.set(s * 0.18, h, s * 0.18); br.position.set(rnd(-0.6, 0.6) * s, h / 2, rnd(-0.3, 0.3)); br.rotation.z = rnd(-0.5, 0.5); m.add(br); const tip = new T.Mesh(G.sph, emat(col, '#2a1a1a')); tip.scale.setScalar(s * 0.24); tip.position.set(br.position.x - Math.sin(br.rotation.z) * h / 2, h, br.position.z); m.add(tip); } }
        else if (shape === 'fan') { const f = new T.Mesh(G.sph, emat(col, '#2a102a')); f.scale.set(s * 1.4, s * 1.3, s * 0.06); f.position.y = s * 1.2; m.add(f); }
        else { const k2 = new T.Mesh(G.cyl, emat('#5a8a3a', '#1a2a0a')); const h = s * rnd(3, 6); k2.scale.set(s * 0.12, h, s * 0.12); k2.position.y = h / 2; m.add(k2); }
        m.rotation.y = rnd(0, 3); anim.push({ m: m, y: y, ph: rnd(0, 6), amp: 0, rot: 0, sway: true }); }
      else if (shape === 'tree') { m = new T.Mesh(G.cone, basic(col)); m.scale.set(s * 0.8, s * 2.4, s * 0.8); y = -1 + s * 2.4; floaty = false; }
      else if (shape === 'hill') { m = mesh('sph', col); m.scale.set(s * 5, s * 2.4, s * 3); y = -2; floaty = false; }
      else if (shape === 'pillar') { m = mesh('cyl', col); m.scale.set(s * 0.5, s * 7, s * 0.5); y = rnd(-3, 3); floaty = false; }
      else if (shape === 'bean') { m = mesh('sph', col); m.scale.set(s * 1.7, s * 0.75, s * 0.75); m.rotation.z = rnd(0, 3); }
      else if (shape === 'ring') { m = mesh('tor', col); m.scale.setScalar(s); m.rotation.set(rnd(0, 3), rnd(0, 3), 0); }
      else if (shape === 'disc') { m = mesh('sph', col); m.scale.set(s * 1.2, s * 0.4, s * 1.2); m.rotation.set(rnd(0, 3), 0, rnd(0, 3)); }
      else { m = mesh('sph', col, ly.fore ? 0.2 : 1); m.scale.set(s * rnd(0.8, 1.3), s * rnd(0.8, 1.3), s); }
      if (th.glow && !ly.fore && shape !== 'pillar') { const em = new T.Color(col).multiplyScalar(0.35); m.material = emat(col, '#' + em.getHexString()); if (!S.set.low && Math.random() < 0.35) m.add(glow(col, 2.6, 0.35)); }
      m.position.set(x, y, z); grp.add(m);
      if (floaty && !S.set.low) anim.push({ m: m, y: y, ph: rnd(0, 6), amp: 0.3 * ly.s, rot: rnd(-0.2, 0.2) });
    }
  });
}

/* ---------- game state ---------- */
let L = null, P = null, mode = 'menu', paused = false, last = 0, menuAlien = null, menuGrp = null, backTo = 'menu';
const keys = { left: false, right: false, jump: false, act: false, duck: false, run: false };
let jumpBuf = 0, coyote = 0, actEdge = false, toastT = 0, noteT = 0;
const HW = 0.42, STAND = 1.35, CROUCH = 0.78; let PH = STAND; const SPEED = 7.2, JUMP = 16, GRAV = 40;

function addPickup(kind, x, y) {
  const g = new T.Group(), shield = kind === 'shield', life = kind === 'life', col = shield ? '#7fd4ff' : life ? '#ff8fb1' : '#c8ff7a';
  const core = new T.Mesh(shield ? G.tor : G.sph, emat(col, '#2a3a4a')); core.scale.setScalar(shield ? 0.4 : 0.38); g.add(core); g.add(glow(col, 2.8, 0.75));
  const lb = label(shield ? 'Shield' : life ? 'Extra life' : 'ATP boost', 3); lb.position.y = 1.3; g.add(lb); g.position.set(x, y, 0); L.group.add(g);
  L.boosts.push({ x: x, y: y, m: g, got: false, kind: kind });
}
/* ---------- 3-D cell models that the player assembles part by part ---------- */
function cellModel(kind) {
  const g = new T.Group(), inner = new T.Group(); g.add(inner);
  const M = function (c, e) { return emat(c, e || '#1a2a3a'); }, parts = {}, euk = kind === 'animal';
  const part = function (name, lx, ly) { const p = new T.Group(); p.visible = false; inner.add(p); const lb = label('✓ ' + name, 2.3, { bd: '#7be0ad' }); lb.position.set(lx, ly, 3.2); lb.visible = false; g.add(lb); parts[name] = { g: p, lb: lb, s: 0, lx: lx, ly: ly }; return p; };
  const blob = function (p, c, sx, sy, sz, x, y, z, op) { const m = new T.Mesh(G.sph, op ? basic(c, op, false) : M(c)); m.scale.set(sx, sy, sz); m.position.set(x, y, z || 0); p.add(m); return m; };
  const R = euk ? [2.7, 2.4, 2.1] : [3.1, 1.45, 1.45];
  /* ghost outline that shows where the cell will be */
  const ghost = new T.Mesh(new T.SphereGeometry(1, 16, 10), new T.MeshBasicMaterial({ color: '#9fe0ff', wireframe: true, transparent: true, opacity: 0.25 }));
  ghost.scale.set(R[0], R[1], R[2]); inner.add(ghost);
  const tag = label(euk ? 'Empty animal cell: bring me my parts!' : 'Empty prokaryote: bring me my parts!', 4.2, { bd: '#9fe0ff' }); tag.position.set(0, R[1] + 1.25, 0); g.add(tag);
  /* plasma membrane: a see-through skin with a bright rim */
  const mem = part('Plasma membrane', euk ? -3.3 : -3.4, euk ? 2.0 : 1.3);
  const shell = new T.Mesh(G.sph, new T.MeshLambertMaterial({ color: euk ? '#ffb0d0' : '#9be36b', emissive: euk ? '#3a1020' : '#123a10', transparent: true, opacity: 0.28, depthWrite: false }));
  shell.scale.set(R[0], R[1], R[2]); mem.add(shell); mem.add(glow(euk ? '#ffb0d0' : '#9be36b', R[0] * 2.6, 0.18));
  const rim = new T.Mesh(G.tor, basic(euk ? '#ffd0e4' : '#c8ff9a', 0.55, true)); rim.scale.set(R[0], R[1], 0.12); mem.add(rim);
  if (!euk) {
    const cyto = part('Cytoplasm', -1.9, -1.6); blob(cyto, '#c8ff7a', R[0] * 0.93, R[1] * 0.9, R[2] * 0.9, 0, 0, 0, 0.22);
    const dna = part('DNA', 0.2, 1.15); const knot = new T.Mesh(new T.TorusKnotGeometry(0.55, 0.06, 80, 6, 3, 5), M('#7fd4ff', '#1a4a7a')); knot.scale.set(1.2, 0.8, 0.8); dna.add(knot); dna.userData.spin = knot;
    const rib = part('Ribosomes', 2.3, -1.5); for (let i = 0; i < 26; i++) { const a = i * 2.39, r = 0.5 + (i % 5) * 0.12; blob(rib, '#ffd166', 0.09, 0.09, 0.09, Math.cos(a) * r * 2.6, Math.sin(a * 1.7) * r * 1.4, Math.sin(a) * 0.8); }
  } else {
    const nuc = part('Nucleus', -0.4, 1.55); const ne = new T.Mesh(G.sph, new T.MeshLambertMaterial({ color: '#8a5ac8', emissive: '#2a0a4a', transparent: true, opacity: 0.55, depthWrite: false })); ne.scale.setScalar(0.85); ne.position.set(-0.4, 0.3, 0); nuc.add(ne); blob(nuc, '#c59cff', 0.28, 0.28, 0.28, -0.25, 0.4, 0.1);
    const dna = part('DNA', -2.0, 0.3); const knot = new T.Mesh(new T.TorusKnotGeometry(0.38, 0.045, 70, 6, 2, 7), M('#7fd4ff', '#1a4a7a')); knot.position.set(-0.4, 0.3, 0); dna.add(knot); dna.userData.spin = knot;
    const er = part('Endoplasmic reticulum', -1.9, -1.55); for (let i = 0; i < 4; i++) { const arc = new T.Mesh(new T.TorusGeometry(1.15 + i * 0.22, 0.06, 6, 24, Math.PI * 0.85), M('#7fd4ff', '#16405a')); arc.position.set(-0.4, 0.3, 0); arc.rotation.z = Math.PI * 0.95; er.add(arc); }
    const go = part('Golgi apparatus', 2.0, -1.75); for (let i = 0; i < 4; i++) { const d = new T.Mesh(new T.TorusGeometry(0.75 - i * 0.04, 0.09, 6, 20, Math.PI * 0.8), M('#ffd166', '#5a4010')); d.position.set(1.55, -0.55 - i * 0.22, 0.3); d.rotation.z = Math.PI * 0.1; go.add(d); }
    const mi = part('Mitochondria', 2.2, 1.7); [[1.3, 1.1, 0.4, 0.5], [-1.5, -1.3, 0.6, -0.4], [0.6, -1.5, -0.5, 0.2]].forEach(function (p) { const m = blob(mi, '#ff9f6e', 0.42, 0.2, 0.2, p[0], p[1], p[2]); m.rotation.z = p[3]; const c = new T.Mesh(G.tor, M('#ffd0b0')); c.scale.set(0.12, 0.12, 0.12); c.position.set(p[0], p[1], p[2] + 0.18); mi.add(c); });
    const rib = part('Ribosomes', 2.6, 0.2); for (let i = 0; i < 30; i++) { const a = i * 2.39, r = 1.4 + (i % 4) * 0.18; blob(rib, '#ffd166', 0.07, 0.07, 0.07, -0.4 + Math.cos(a) * r, 0.3 + Math.sin(a) * r * 0.8, Math.sin(a * 2.3) * 0.9); }
  }
  inner.rotation.x = 0.25;
  return { g: g, inner: inner, parts: parts, ghost: ghost, tag: tag, kind: kind, R: R, name: euk ? 'animal cell' : 'prokaryotic cell', t: 0, finishAt: 0, done: false, scale: euk ? 0.95 : 1 };
}
function flyPart(md, name, x, y, tok) {
  const p = md.parts[name] || null;
  const o = new T.Group(); const core = new T.Mesh(G.ico, emat('#bfe9ff', '#3a7090')); core.scale.setScalar(0.34); o.add(core); o.add(glow('#9fe0ff', 2.4, 0.7)); o.position.set(x, y, 0); L.group.add(o);
  L.flies.push({ o: o, md: md, p: p, tok: tok, t: 0, x0: x, y0: y });
}
function modelTick(md, dt, z) {
  md.t += dt;
  md.inner.rotation.y = md.done ? md.inner.rotation.y * (1 - Math.min(1, dt * 2)) + Math.sin(md.t * 0.5) * 0.12 * Math.min(1, dt * 2) : Math.sin(md.t * 0.6) * 0.6; /* when finished it holds still so the labels' lines point at the right parts */
  const h = md.home, bob = Math.sin(md.t * 1.2) * 0.12; md.g.position.set(h.x, h.y + bob + (md.lift || 0), h.z);
  if (md.done && md.g.scale.x < md.big) { const sc = Math.min(md.big, md.g.scale.x + dt * 0.8); md.g.scale.setScalar(sc); md.lift = (sc - 1) * 1.6; }
  if (md.halo) md.halo.material.opacity = 0.48 + Math.sin(md.t * 2) * 0.06;
  Object.keys(md.parts).forEach(function (n) { const p = md.parts[n]; if (p.g.visible && p.s < 1) { p.s = Math.min(1, p.s + dt * 3); const e = p.s < 1 ? 1 + Math.sin(p.s * Math.PI) * 0.25 : 1; p.g.scale.setScalar(e * Math.max(0.05, p.s)); } if (p.g.userData.spin) p.g.userData.spin.rotation.z += dt * 0.8; });
  if (md.finishAt > 0 && !md.done) { md.finishAt -= dt; if (md.finishAt <= 0) finishModel(md); }
}
/* textbook-style labels: in two columns beside the cell, each with a thin line to its part */
function calloutLabels(md) {
  const R = md.R, names = Object.keys(md.parts), cols = { l: [], r: [] };
  names.forEach(function (n) { const p = md.parts[n]; (p.lx < 0 ? cols.l : cols.r).push(n); });
  const lineM = new T.LineBasicMaterial({ color: '#e8fbff', transparent: true, opacity: 0.85 });
  ['l', 'r'].forEach(function (side) { const list = cols[side].sort(function (a, c) { return md.parts[c].ly - md.parts[a].ly; }), sg = side === 'l' ? -1 : 1;
    const hs = list.map(function (n) { return md.parts[n].lb.userData.lbl ? md.parts[n].lb.userData.lbl.h : 0.9; }), gap = 0.35, tot = hs.reduce(function (a, c) { return a + c; }, 0) + gap * (list.length - 1);
    let y = tot / 2;
    list.forEach(function (n, i) { const p = md.parts[n], lb = p.lb, w = lb.userData.lbl ? lb.userData.lbl.w : 2.6, cx = sg * (R[0] + 1.4 + w / 2), cy = y - hs[i] / 2; y -= hs[i] + gap;
      lb.position.set(cx, cy, 3.2); lb.visible = true;
      /* where the line points: the membrane's edge, or a spot inside the cell near where the part is */
      let ax, ay; if (n === 'Plasma membrane') { ax = sg * R[0] * 0.97; ay = cy * 0.3; } else { const k = Math.min(1, 0.72 / Math.hypot(p.lx / R[0], p.ly / R[1])); ax = p.lx * k; ay = p.ly * k; }
      const ex = cx - sg * (w / 2 + 0.05), geo = new T.BufferGeometry().setFromPoints([new T.Vector3(ex, cy, 3.2), new T.Vector3(sg * (R[0] + 0.6), cy, 2.4), new T.Vector3(ax, ay, 1.2)]);
      const ln = new T.Line(geo, lineM); md.g.add(ln); const dot = new T.Mesh(G.sph, basic('#ffffff')); dot.scale.setScalar(0.08); dot.position.set(ax, ay, 1.2); md.g.add(dot); });
  });
}
function finishModel(md) {
  award('cell');
  md.done = true; md.ghost.visible = false; md.tag.material.map = labelTex('✓ Your ' + md.name, { bd: '#7be0ad' }); md.tag.material.needsUpdate = true; md.tag.scale.set(3.6, 1.8, 1);
  calloutLabels(md); md.big = 1.35; md.tag.position.y = md.R[1] + 1.7;
  /* the finished cell lights itself up so it is easy to see, even in the dark deep sea */
  const euk0 = md.kind === 'animal', lt = new T.PointLight(euk0 ? 0xffe0ec : 0xe8ffd8, 3.2, 28, 1); lt.position.set(0, 0, 5); md.g.add(lt);
  /* every part of the finished cell glows with its own color, so it is bright even in the darkest water */
  const shellP = md.parts['Plasma membrane'];
  md.inner.traverse(function (o) { if (!o.isMesh || !o.material) return; const m = o.material.clone(), isShell = shellP && o.parent === shellP.g && o.geometry === G.sph;
    if (m.emissive) m.emissive.copy(m.color).multiplyScalar(isShell ? 0.35 : 0.9); else if (m.color) m.color.offsetHSL(0, 0.1, 0.15);
    if (isShell) m.opacity = 0.16; /* a clearer skin, so the bright organelles show through */
    o.material = m; });
  md.halo = glow(euk0 ? '#ffd0e4' : '#d8ffb0', md.R[0] * 3.6, 0.5, false); md.halo.position.z = -1.2; md.g.add(md.halo);
  burst(md.home.x, md.home.y, '#7be0ad'); beep(990, 0.4, 'sine', 'fanfare, cell model complete');
  const euk = md.kind === 'animal', w = euk ? 'Eukaryote' : 'Prokaryote';
  S.words[w] = 1; save(); giveFlight(20, euk ? '' : 'A flagellum tail, like a bacterium\'s! ');
  showNote({ word: euk ? 'You built a eukaryotic cell' : 'You built a prokaryotic cell', note: euk
    ? 'Its DNA is kept inside a NUCLEUS, and it has organelles wrapped in membranes: mitochondria, ER, and the Golgi apparatus. Ribosomes and a plasma membrane are found in every cell.'
    : 'No nucleus! Its DNA floats in the CYTOPLASM. It has RIBOSOMES and a PLASMA MEMBRANE, like every cell, but no membrane-wrapped organelles.' });
}
/* simple specimen models for scanning */
function specimen(look, col) {
  const g = new T.Group(), M = function (c, e) { return emat(c, e || '#1a2a3a'); }, sph = function (c, sx, sy, sz, x, y, z) { const m = new T.Mesh(G.sph, M(c)); m.scale.set(sx, sy, sz); m.position.set(x || 0, y || 0, z || 0); g.add(m); return m; };
  if (look === 'rock') { const m = new T.Mesh(G.ico, M('#8a8f96', '#202428')); m.scale.set(0.9, 0.6, 0.7); m.position.y = 0.5; g.add(m); }
  else if (look === 'crystal') { [[0, 0.8, 0], [-0.4, 0.55, 0.3], [0.4, 0.5, -0.2]].forEach(function (p, i) { const c = new T.Mesh(G.cone, M('#bfe9ff', '#3a6a8a')); c.scale.set(0.25, 0.9 - i * 0.2, 0.25); c.position.set(p[0], p[1], p[2]); g.add(c); }); }
  else if (look === 'frog') { g.userData.hop = true; sph('#5fbf5a', 0.6, 0.42, 0.5, 0, 0.45); [-0.25, 0.25].forEach(function (ex) { sph('#5fbf5a', 0.16, 0.16, 0.16, ex, 0.8, 0.2); sph('#10202c', 0.08, 0.08, 0.08, ex, 0.82, 0.33); }); }
  else if (look === 'sprout') { g.userData.grow = true; const st = new T.Mesh(G.cyl, M('#4f9a5a')); st.scale.set(0.06, 0.9, 0.06); st.position.y = 0.45; g.add(st); sph('#7be06a', 0.3, 0.1, 0.18, -0.25, 0.85); sph('#7be06a', 0.3, 0.1, 0.18, 0.25, 0.95); }
  else if (look === 'lily') { const p = new T.Mesh(G.cyl, M('#3f9a4a')); p.scale.set(0.9, 0.06, 0.9); p.position.y = 0.1; g.add(p); sph('#ffb0d0', 0.22, 0.2, 0.22, 0.2, 0.3); }
  else if (look === 'eggs') { for (let i = 0; i < 7; i++) sph('#e8f0d0', 0.16, 0.16, 0.16, Math.cos(i) * 0.35, 0.25 + (i % 3) * 0.12, Math.sin(i) * 0.25); }
  else if (look === 'turtle') { sph('#6a8a3a', 0.7, 0.4, 0.55, 0, 0.4); sph('#8ab06a', 0.2, 0.18, 0.2, 0.75, 0.35); }
  else if (look === 'tubeworm') { g.userData.grow = true; [-0.35, 0, 0.35].forEach(function (tx, i) { const t = new T.Mesh(G.cyl, M('#f4f0e8')); const h = 1.1 + i * 0.25; t.scale.set(0.1, h / 2, 0.1); t.position.set(tx, h / 2, 0); g.add(t); sph('#e8283a', 0.17, 0.26, 0.17, tx, h + 0.15); }); }
  else if (look === 'rod') { g.userData.wiggle = true; sph(col, 0.7, 0.3, 0.3, 0, 0.8); const f = new T.Mesh(G.cyl, M(col)); f.scale.set(0.03, 0.5, 0.03); f.rotation.z = Math.PI / 2; f.position.set(-0.9, 0.8, 0); g.add(f); sph('#ffd166', 0.25, 0.08, 0.08, 0.1, 0.8, 0.22); }
  else if (look === 'cell') { const m = new T.Mesh(G.sph, basic(col, 0.35, true)); m.scale.setScalar(0.85); m.position.y = 0.9; g.add(m); sph('#8a5ac8', 0.3, 0.3, 0.3, 0.1, 0.9, 0.2); sph('#ff9f6e', 0.15, 0.08, 0.08, -0.4, 0.7, 0.3); }
  else if (look === 'helix') { g.userData.spin = true; for (let i = 0; i < 10; i++) { const a = i * 0.7; sph(i % 2 ? '#7fd4ff' : '#ffb09c', 0.1, 0.1, 0.1, Math.cos(a) * 0.3, 0.2 + i * 0.16, Math.sin(a) * 0.3); sph(i % 2 ? '#ffd166' : '#7be0ad', 0.1, 0.1, 0.1, -Math.cos(a) * 0.3, 0.2 + i * 0.16, -Math.sin(a) * 0.3); } }
  else if (look === 'drop') { const d = new T.Mesh(G.sph, basic('#7fd4ff', 0.6, true)); d.scale.set(0.5, 0.6, 0.5); d.position.y = 0.7; g.add(d); const tp = new T.Mesh(G.cone, basic('#7fd4ff', 0.6, true)); tp.scale.set(0.32, 0.3, 0.32); tp.position.y = 1.4; g.add(tp); }
  else if (look === 'ice') { const w = new T.Mesh(G.cyl, basic('#2a7fb8', 0.6)); w.scale.set(1.1, 0.3, 1.1); w.position.y = 0.15; g.add(w); const ic = new T.Mesh(G.box, emat('#e8f8ff', '#3a6a8a')); ic.scale.set(0.8, 0.5, 0.8); ic.position.y = 0.45; g.add(ic); g.userData.bob = true; }
  else if (look === 'chain') { const cs = ['#ffd166', '#7be0ad', '#ff9f6e', '#7fd4ff', '#c59cff', '#ff8fb1']; for (let i = 0; i < 6; i++) sph(cs[i], 0.2, 0.2, 0.2, -0.75 + i * 0.3, 0.6 + Math.sin(i * 1.1) * 0.25, 0); g.userData.spin = true; }
  else if (look === 'atom') { g.userData.spin = true; sph('#30343a', 0.32, 0.32, 0.32, 0, 0.9, 0); [[0, 1, 0], [0.94, -0.33, 0], [-0.47, -0.33, 0.82], [-0.47, -0.33, -0.82]].forEach(function (d) { const v = new T.Vector3(d[0], d[1], d[2]).normalize(), st = new T.Mesh(G.cyl, M('#cccccc')); st.scale.set(0.04, 0.5, 0.04); st.position.set(v.x * 0.35, 0.9 + v.y * 0.35, v.z * 0.35); st.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v); g.add(st); sph('#ffffff', 0.15, 0.15, 0.15, v.x * 0.7, 0.9 + v.y * 0.7, v.z * 0.7); }); }
  else if (look === 'mushroom') { const st = new T.Mesh(G.cyl, M('#f0e0c8')); st.scale.set(0.15, 0.6, 0.15); st.position.y = 0.3; g.add(st); sph('#c0503a', 0.5, 0.28, 0.5, 0, 0.65); }
  else if (look === 'grass') { for (let i = 0; i < 7; i++) { const b = new T.Mesh(G.cone, M('#6ac04a')); b.scale.set(0.07, 0.45 + (i % 3) * 0.12, 0.07); b.position.set(-0.45 + i * 0.15, 0.45, (i % 2) * 0.15); b.rotation.z = (i - 3) * 0.08; g.add(b); } g.userData.grow = true; }
  else if (look === 'critter') { g.userData.hop = true; sph(col, 0.5, 0.42, 0.42, 0, 0.5); [-0.18, 0.18].forEach(function (ex) { const ear = new T.Mesh(G.cone, M(col)); ear.scale.set(0.09, 0.22, 0.09); ear.position.set(ex, 1.0, 0); g.add(ear); sph('#10202c', 0.06, 0.06, 0.06, ex * 0.8, 0.62, 0.38); }); }
  else if (look === 'sun') { const s0 = new T.Mesh(G.sph, emat('#ffd166', '#c08a10')); s0.scale.setScalar(0.5); s0.position.y = 1; g.add(s0); g.add(glow('#ffd166', 4, 0.6)); g.children[g.children.length - 1].position.y = 1; g.userData.spin = true; }
  else if (look === 'stack') { for (let i = 0; i < 4; i++) sph(col, 0.7 - i * 0.08, 0.08, 0.35, 0, 0.4 + i * 0.22); }
  else sph(col, 0.6, 0.55, 0.5, 0, 0.6);
  g.add(glow(col, 2.6, 0.25)); return g;
}
/* QUESTION ROTATION: a level names a question, but each play may use a different question that tests the
   same Keystone eligible content (same code). Questions never seen come first, then the ones seen longest ago. */
function rotQ(id) {
  const q = QMAP[id]; if (!q) return null;
  const boss = !!(q.tags && q.tags.indexOf('boss') >= 0);
  const pool = Object.keys(QMAP).filter(function (k) { const c = QMAP[k]; return k.indexOf('.') < 0 && c.world === q.world && c.code === q.code && !L.used[k] && !!(c.tags && c.tags.indexOf('boss') >= 0) === boss && c.options && c.options.length >= 2; });
  if (!pool.length) return q;
  const unseen = pool.filter(function (k) { return !S.seen[k]; });
  const pick = unseen.length ? unseen[Math.floor(Math.random() * unseen.length)] : pool.sort(function (a, c) { return (S.seen[a] || 0) - (S.seen[c] || 0); })[0];
  L.used[pick] = 1; return QMAP[pick];
}
/* ---------- REFUEL STATIONS: optional bonus quizzes ----------
   Up to 10 questions, leave any time, one visit per level run. Right: +40, plus +20 for every 3 in a row.
   Wrong: no penalty or lockout, just the right answer and why. The speedrun clock keeps running. */
const REFUEL = { max: 10, right: 40, streakBonus: 20, every: 3 };
function nearRefuel() { return L.refuels.find(function (r) { return !r.used && Math.abs(P.x - r.x) < 2.6 && P.y > r.y - 0.5 && P.y < r.y + 2.5; }); }
function refuelPool() {
  /* topics from this level, plus anything the student has already met; never questions still waiting later in this level */
  const codes = {}; L.stations.forEach(function (st) { st.queue.forEach(function (q) { codes[q.code] = 1; }); });
  /* the level's rooms (hunts, catches, mazes, membranes, sequences...) carry the Keystone code of what they teach */
  L.zones.concat(L.doors).forEach(function (z) { Object.keys(z).forEach(function (k) { const v = z[k]; if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.code === 'string' && k !== 'model') codes[v.code] = 1; }); if (typeof z.code === 'string') codes[z.code] = 1; });
  const pool = Object.keys(QMAP).map(function (k) { return QMAP[k]; }).filter(function (q) { return q.world === L.world.id && q.options && q.options.length >= 2 && typeof q.answer === 'number' && !q.figure && !L.used[q.id] && !(q.tags && q.tags.length) && /^w\d+q/.test(q.id) && (codes[q.code] || S.seen[q.id] || S.missed[q.id]); });
  const rank = function (q) { return S.missed[q.id] ? 0 : S.seen[q.id] ? 2 : 1; };
  return shuffle(pool).sort(function (a, c) { return rank(a) - rank(c) || (S.seen[a.id] || 0) - (S.seen[c.id] || 0); }).slice(0, REFUEL.max);
}
function openRefuel(r) {
  const qs = refuelPool(); if (!qs.length) { toast('This station has no questions ready yet. Keep exploring!', 3); return; }
  r.used = true; r.lb.material.map = labelTex('⛽ Refuel Station · used', { bd: '#5a6470' }); r.lb.material.needsUpdate = true;
  qs.forEach(function (q) { L.used[q.id] = 1; });
  L.active = { refuel: r, queue: qs, qi: 0, right: 0, answered: 0, run: 0, pts: 0, phase: 'ask', perm: [], pads: [], tried: {} }; P.vx = 0; beep(660, 0.2, 'sine', 'hum, refuel station on');
  refuelShow(); Music.setDuck(0.45);
}
function refuelShow() {
  const st = L.active, q = st.queue[st.qi]; $('qpanel').classList.remove('compact', 'short'); $('qopts').classList.remove('cool'); if ($('qcool')) $('qcool').hidden = true; $('qfig').innerHTML = '';
  $('qmeta').textContent = '⛽ Refuel Station · question ' + (st.qi + 1) + ' of up to ' + st.queue.length + ' · points so far: ' + st.pts;
  $('qhow').textContent = 'Optional bonus: +' + REFUEL.right + ' for each right answer, +' + REFUEL.streakBonus + ' extra for every ' + REFUEL.every + ' in a row. No penalty for a wrong answer. Esc to leave.';
  st.perm = shuffle(q.options.map(function (_, i) { return i; })); st.phase = 'ask';
  $('qprompt').innerHTML = esc(q.prompt) + (q.stem ? '<span class="stem">' + esc(q.stem) + '</span>' : '');
  $('qopts').innerHTML = st.perm.map(function (oi, i) { return '<button type="button" class="opt" data-i="' + i + '"><b>' + 'ABCDE'[i] + '</b> ' + esc(q.options[oi]) + '</button>'; }).join('') + '<button type="button" class="opt pclose" data-rf="leave">Leave station (Esc)</button>';
  $('qfb').textContent = ''; $('qpanel').hidden = false;
}
function refuelAnswer(i) {
  const st = L.active; if (st.phase !== 'ask') return; const q = st.queue[st.qi]; if (i >= q.options.length) return;
  const ok = st.perm[i] === q.answer, ci = st.perm.indexOf(q.answer); record(q, ok); st.answered++; st.phase = 'fb';
  let gain = 0; if (ok) { st.right++; st.run++; gain = REFUEL.right + (st.run % REFUEL.every === 0 ? REFUEL.streakBonus : 0); st.pts += gain; L.score += gain; popup(P.x, P.y + 1.4, '+' + gain, '#5ff5e6'); beep(880, 0.2, 'sine', 'chime, correct'); } else { st.run = 0; beep(300, 0.2, 'triangle', 'soft tone, not this time'); }
  $('qopts').querySelectorAll('.opt[data-i]').forEach(function (b) { const k = +b.dataset.i; b.disabled = true; if (k === ci) b.classList.add('help'); else if (k === i) b.classList.add('no'); });
  const last = st.qi + 1 >= st.queue.length;
  $('qfb').innerHTML = (ok ? '✓ Right! +' + gain + (gain > REFUEL.right ? ' (streak bonus!)' : '') + ' ' : '✗ The answer is: <b>' + esc(String(q.options[q.answer]).replace(/[.]$/, '')) + '</b>. ') + esc(q.explain || '') +
    '<div class="rfBtns"><button type="button" class="opt" data-rf="next">' + (last ? 'See my results (E)' : 'Next question (E)') + '</button><button type="button" class="opt pclose" data-rf="leave">Leave station (Esc)</button></div>';
  hud();
}
function refuelNav(a) {
  const st = L.active; if (!st || !st.refuel) return;
  if (st.phase === 'sum') { closeQ(); return; }
  if (a === 'leave' || (a === 'next' && st.phase === 'fb' && st.qi + 1 >= st.queue.length)) return refuelSummary();
  if (a === 'next' && st.phase === 'fb') { st.qi++; refuelShow(); }
}
function refuelSummary() {
  const st = L.active; st.phase = 'sum';
  $('qmeta').textContent = '⛽ Refuel complete'; $('qhow').textContent = ''; $('qprompt').innerHTML = 'You are refueled! Back to the mission.';
  $('qopts').innerHTML = '<div class="rfSum"><div><b>' + st.answered + '</b><span>answered</span></div><div><b>' + st.right + '</b><span>correct</span></div><div><b>+' + st.pts + '</b><span>points</span></div></div><button type="button" class="opt" data-rf="done">Continue (E)</button>';
  $('qfb').textContent = ''; if (st.pts) burst(P.x, P.y + 1, '#5ff5e6'); beep(990, 0.25, 'sine', 'rising chime, refueled'); hud();
}
function nearScan() { return L.scans.find(function (k) { return !k.buried && Math.abs(P.x - k.x) < 1.6 && P.y > k.y - 1 && P.y < k.y + 2.4; }); }
function showNote(sc) {
  const n = $('note'); n.innerHTML = '<small>New word for your Field Guide</small><b>' + esc(sc.word) + '</b><span>' + esc(sc.note) + '</span>';
  n.hidden = false; noteT = Math.max(8, sc.note.split(' ').length / 2.6);
}
function doScan(k) {
  if (k.done) { showNote(k.sc); return; }
  k.done = true; const fresh = !S.words[k.sc.word]; S.words[k.sc.word] = 1; if (!S.found) S.found = {};
  const newSpec = !S.found[k.sc.id]; S.found[k.sc.id] = Date.now(); save();
  if (newSpec) { award('first-scan'); if (S.levels[L.lv.id] && S.levels[L.lv.id].stars) award('second-look'); checkCollections(); checkBig(); }
  k.ring.material = basic('#7be0ad', 0.7, true); k.nm.material.map = labelTex('✓ ' + k.sc.name, { bd: '#7be0ad' }); k.nm.material.needsUpdate = true;
  L.score += 20; popup(k.x, k.y + 2.2, fresh ? 'New word: ' + k.sc.word : k.sc.word, '#9fe0ff'); burst(k.x, k.y + 1, '#9fe0ff'); beep(1000, 0.18, 'sine', 'scanner chirp, new word'); showNote(k.sc); hud();
}
/* ---------- ACHIEVEMENTS: short, medium, and long goals that reward exploring, persistence, and mastery ---------- */
const ACH = [
  { id: 'first-scan', ic: '🔍', tier: 'short' }, { id: 'first-rare', ic: '💎', tier: 'short' }, { id: 'hidden-10', ic: '✨', tier: 'short' }, { id: 'shopper', ic: '🛒', tier: 'short' },
  { id: 'stylist', ic: '👕', tier: 'short' }, { id: 'cell', ic: '🧫', tier: 'short' }, { id: 'code', ic: '🔐', tier: 'short' }, { id: 'persist', ic: '💪', tier: 'short' },
  { id: 'scan-25', ic: '📓', tier: 'medium' }, { id: 'collection', ic: '📚', tier: 'medium' }, { id: 'no-help', ic: '🎯', tier: 'medium' }, { id: 'speedy', ic: '⏱️', tier: 'medium' },
  { id: 'immune', ic: '🛡️', tier: 'medium' }, { id: 'golf', ic: '⛳', tier: 'medium' }, { id: 'dna-lab', ic: '🧬', tier: 'medium' }, { id: 'practice', ic: '🎓', tier: 'medium' }, { id: 'second-look', ic: '🔁', tier: 'medium' },
  { id: 'world1', ic: '🧫', tier: 'long' }, { id: 'world2', ic: '🌿', tier: 'long' }, { id: 'scan-all', ic: '🏆', tier: 'long' }, { id: 'rare-all', ic: '💠', tier: 'long' }, { id: 'stars-30', ic: '⭐', tier: 'long' }];
let achQ = [], achBusy = false;
function award(id) {
  if (!S.ach) S.ach = {}; if (S.ach[id]) return; S.ach[id] = Date.now(); save();
  achQ.push(id); if (!achBusy) achNext();
}
function achNext() {
  const id = achQ.shift(); if (!id) { achBusy = false; $('achPop').hidden = true; return; }
  achBusy = true; const a = ACH.find(function (x) { return x.id === id; }) || { ic: '🏅' };
  $('achPop').innerHTML = '<span class="ai">' + a.ic + '</span><span><small>' + esc(tx('a.pop')) + '</small><b>' + esc(tx('a.' + id)) + '</b><em>' + esc(tx('a.' + id + '.d')) + '</em></span>';
  $('achPop').hidden = false; beep(1180, 0.25, 'triangle', 'sparkle, achievement unlocked');
  setTimeout(achNext, 3800);
}
function stat(k, add) { if (!S.stat) S.stat = {}; S.stat[k] = (S.stat[k] || 0) + (add || 1); save(); return S.stat[k]; }
/* plan of a level (which specimens and secrets it holds), read by running its build steps on a stand-in builder */
function levelPlan(lv) {
  if (lv._plan) return lv._plan; const plan = { scans: [], rare: false };
  const p = new Proxy({}, { get: function (o, k) { if (k === 'x' || k === 'y') return 0; return function () { if (k === 'scan') plan.scans.push(arguments[1]); if (k === 'rare') plan.rare = true; return p; }; } });
  try { lv.build(p); } catch (e) { /* ignore */ }
  lv._plan = plan; return plan;
}
function scanData(w, id) { return ((BQ.data[w] || {}).scans || []).find(function (sc) { return sc.id === id; }); }
function isFound(w, id) { const sc = scanData(w, id); return !!(S.found && S.found[id]) || !!(sc && S.words[sc.word] && !(S.found && Object.keys(S.found).length)); }
function checkCollections() {
  allLevels().forEach(function (e) {
    const pl = levelPlan(e.lv); if (!pl.scans.length || (S.colDone && S.colDone[e.lv.id])) return;
    if (pl.scans.every(function (id) { return S.found[id]; })) { S.colDone[e.lv.id] = Date.now(); S.bank = (S.bank || 0) + 200; save(); toast(tx('j.colReward', { lv: e.lv.id + ' ' + e.lv.title, p: 200 }), 4); award('collection'); }
  });
}
function checkBig() {
  const list = allLevels(), done = function (w) { const ls = list.filter(function (e) { return e.w.id === w; }); return ls.length && ls.every(function (e) { return S.levels[e.lv.id] && S.levels[e.lv.id].stars; }); };
  if (done(1)) award('world1'); if (done(2)) award('world2'); if (totalStars() >= 30) award('stars-30');
  const ids = []; list.forEach(function (e) { levelPlan(e.lv).scans.forEach(function (id) { ids.push(id); }); });
  if (Object.keys(S.found || {}).length >= 25) award('scan-25'); if (ids.length && ids.every(function (id) { return S.found[id]; })) award('scan-all');
  const rares = list.filter(function (e) { return levelPlan(e.lv).rare; }); if (rares.length && rares.every(function (e) { return S.rare[e.lv.id]; })) award('rare-all');
}
/* no getting stuck: after two wrong tries, the right choice glows gold */
function helpGlow(g) { if (L) L.helped = true; if (!g || g.userData.help) return; const h = glow('#ffd700', 3.4, 0.8); g.add(h); g.userData.help = h; L.helps.push(h); }
function unhelp(g) { if (g && g.userData.help) { g.remove(g.userData.help); L.helps = L.helps.filter(function (h) { return h !== g.userData.help; }); g.userData.help = null; } }
function bumpBlock(qb) {
  qb.used = true; qb.m.material = emat('#8a6a40', '#2a1a08'); qb.q.visible = false; qb.gl.visible = false; qb.m.position.y += 0.25; setTimeout(function () { qb.m.position.y -= 0.25; }, 120);
  if (qb.reward === 'sparks') { L.coins += 5; L.score += 50; popup(qb.x, qb.y, '+5 sparks', '#ffd166'); burst(qb.x, qb.y + 0.5, '#ffd166'); beep(1200, 0.12, 'square', 'ding, sparks'); hud(); }
  else { addPickup(qb.reward, qb.x, qb.y + 0.9); beep(880, 0.15, 'triangle', 'pop, a reward appeared'); }
}
function disposeGroup(g) {
  const shared = Object.keys(G).map(function (k) { return G[k]; });
  g.traverse(function (o) { if (o.geometry && shared.indexOf(o.geometry) < 0) o.geometry.dispose(); });
}
function teardown() {
  caveLight(false);
  if (L) { scene.remove(L.group); disposeGroup(L.group); }
  if (menuGrp) { scene.remove(menuGrp); disposeGroup(menuGrp); menuGrp = null; }
  SKY = null; MOTES = null;
  Object.keys(texCache).forEach(function (k) { texCache[k].dispose(); }); texCache = {};
  L = null;
}
function addSolid(x0, x1, y0, y1, o) {
  const s = Object.assign({ x0: x0, x1: x1, y0: y0, y1: y1, off: false }, o || {}); s.oneWay = false; /* every platform is solid: you bump your head from below */
  L.solids.push(s); return s;
}
function addGround(x0, x1, y) {
  addSolid(x0, x1, y - 14, y);
  L.group.add(box(x0, x1, y - 14, y - 0.3, 7, L.th.ground)); L.group.add(box(x0, x1, y - 0.3, y, 7.2, L.th.top));
  const rim = new T.Mesh(G.box, basic(L.th.rim)); rim.scale.set(x1 - x0, 0.09, 0.1); rim.position.set((x0 + x1) / 2, y - 0.02, 3.62); L.group.add(rim);
}
function builder() {
  const D = BQ.data[L.world.id] || {};
  /* MORAY EEL: lives in a rock hole on the reef and lunges out on a steady beat (a reef version of the snapper) */
  function eelHole(dx, period, offset) {
    const x = b.x + dx, rock = new T.Mesh(G.sph, emat('#6a5a4a', '#1a120a')); rock.scale.set(1.3, 1.1, 1); rock.position.set(x, b.y + 0.3, -0.4); L.group.add(rock);
    const hole = new T.Mesh(G.sph, basic('#0a0a10')); hole.scale.set(0.5, 0.42, 0.2); hole.position.set(x, b.y + 0.55, 0.55); L.group.add(hole);
    const g = new T.Group(), head = foeMesh('eel'); g.add(head); g.position.set(x, b.y, 0); L.group.add(g);
    L.hazards.push({ kind: 'snapper', foe: 'eel', m: g, head: head, arms: [new T.Group(), new T.Group()], x: x, y: b.y, gy: b.y, period: period || 4, offset: offset || 0, t: 0, alive: true }); return b;
  }
  const b = {
    x: 0, y: 0,
    ground: function (len) { addGround(b.x, b.x + len, b.y); b.x += len; return b; },
    gap: function (len) { b.x += len; return b; },
    rise: function (dy) { b.y += dy; return b; },
    plat: function (dx, dy, w) { const s = addSolid(b.x + dx, b.x + dx + w, b.y + dy - 0.4, b.y + dy, { oneWay: true }); L.group.add(box(s.x0, s.x1, s.y0, s.y1, 3, L.th.top)); return b; },
    /* HIDDEN SPARKS: bonus sparks worth 25 that only Lab goggles can see (anyone can still bump into them) */
    hsparks: function (dx, dy, n) {
      const see = S.alien.gear === 1;
      for (let i = 0; i < n; i++) { const m = new T.Mesh(G.oct, emat('#d8b0ff', '#6a3aa0')); m.scale.setScalar(0.3); m.add(glow('#c59cff', 5, 0.6)); m.position.set(b.x + dx + i * 1.3, b.y + dy, 0); m.visible = see; L.group.add(m); L.sparks.push({ x: m.position.x, y: m.position.y, m: m, val: 25 }); }
      L.secrets.push({ x: b.x + dx + n * 0.65, y: b.y + dy }); return b;
    },
    /* CLUE TERMINAL: one escape-room clue. Your answer letter becomes part of the portal code. */
    clue: function (dx, qid) {
      const q = rotQ(qid); if (!q) return b;
      const x = b.x + dx, y = b.y, n = L.clues.length + 1, g = new T.Group();
      const post = new T.Mesh(G.cyl, emat('#2a4a5a', '#0a2030')); post.scale.set(0.3, 1.6, 0.3); post.position.y = 0.8; g.add(post);
      const scr = new T.Mesh(G.box, emat('#7be0ad', '#1a6a4a')); scr.scale.set(1.3, 0.9, 0.12); scr.position.set(0, 1.9, 0.1); scr.rotation.x = -0.25; g.add(scr); g.add(glow('#7be0ad', 2.6, 0.4));
      g.position.set(x, y, 0.5); L.group.add(g);
      const lb = label('Clue ' + n + ': press E', 3, { bd: '#7be0ad' }); lb.position.set(x, y + 3.3, 0.5); L.group.add(lb);
      L.clues.push({ n: n, x: x, y: y, q: q, perm: shuffle(q.options.map(function (_, i) { return i; })), choice: null, lb: lb, scr: scr }); return b;
    },
    /* PORTAL: a locked gateway to a 3-D mini-game. The code is the letters of your clue answers. */
    portal: function (dx, game) {
      const x = b.x + dx, y = b.y, g = new T.Group();
      const ring = new T.Mesh(G.tor, emat('#8a5ac8', '#3a1a6a')); ring.scale.set(1.9, 2.2, 1.4); ring.position.y = 2.4; g.add(ring);
      const swirl = new T.Mesh(new T.CircleGeometry(1.75, 32), new T.MeshBasicMaterial({ color: '#ff6b6b', transparent: true, opacity: 0.45, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      swirl.scale.y = 1.15; swirl.position.y = 2.4; g.add(swirl); g.add(glow('#c59cff', 7, 0.35)); g.children[g.children.length - 1].position.y = 2.4;
      g.position.set(x, y, -0.6); L.group.add(g);
      const lb = label('🔒 Portal: needs a code', 3.6, { bd: '#c59cff' }); lb.position.set(x, y + 5.4, 0); L.group.add(lb);
      L.portal = { x: x, y: y, g: g, swirl: swirl, ring: ring, lb: lb, open: false, tries: 0, game: game || 'immune' }; return b;
    },
    /* HIDDEN PLATFORM: only Lab goggles make it visible AND solid. Without goggles it is a faint ghost you fall through. */
    hplat: function (dx, dy, w) {
      const see = S.alien.gear === 1, s2 = addSolid(b.x + dx, b.x + dx + w, b.y + dy - 0.4, b.y + dy, { off: !see }), m = box(s2.x0, s2.x1, s2.y0, s2.y1, 3, see ? '#c59cff' : L.th.top, see ? 0.85 : 0.07);
      if (!see) L.ghosts.push({ x: (s2.x0 + s2.x1) / 2, y: s2.y1 });
      if (see) { const gl = glow('#c59cff', w + 1.5, 0.45); gl.position.set((s2.x0 + s2.x1) / 2, s2.y1 - 0.2, 0.5); L.group.add(gl); }
      L.group.add(m); L.secrets.push({ x: (s2.x0 + s2.x1) / 2, y: s2.y1 }); return b;
    },
    /* CRUMBLE / BOOM PLATFORM: breaks if you stand on it too long, then grows back after a few seconds.
       kind 'boom' pops with a harmless blast that bounces you up a little. */
    crumble: function (dx, dy, w, kind) {
      const boom = kind === 'boom', x0 = b.x + dx, x1 = x0 + w, y1 = b.y + dy, s = addSolid(x0, x1, y1 - 0.4, y1);
      const col = boom ? '#e05a3a' : '#9a7a52', em = boom ? '#4a1208' : '#1a1006';
      const g = new T.Group(), mt = new T.MeshLambertMaterial({ color: col, emissive: em }), blk = new T.Mesh(G.box, mt);
      blk.scale.set(w, 0.4, 3); g.add(blk);
      const crack = basic(boom ? '#ffd166' : '#3a2410');
      for (let i = 1; i < Math.max(2, Math.round(w)); i++) { const c = new T.Mesh(G.box, crack); c.scale.set(0.1, 0.34, 0.05); c.position.set(-w / 2 + i * (w / Math.max(2, Math.round(w))), 0, 1.52); c.rotation.z = (i % 2 ? 0.4 : -0.35); g.add(c); }
      if (boom) { const dark = basic('#10202c'), yel = basic('#ffd166'), k = Math.round(w / 0.5); /* hazard stripes on top */
        for (let i = 0; i < k; i++) { const st = new T.Mesh(G.box, i % 2 ? dark : yel); st.scale.set(w / k, 0.03, 0.5); st.position.set(-w / 2 + (i + 0.5) * w / k, 0.215, 1.1); g.add(st); } }
      else { const dk = basic('#3a2410'); for (let i = 0; i < 3; i++) { const c = new T.Mesh(G.box, dk); c.scale.set(0.09, 0.03, 1.6 + i * 0.3); c.position.set(-w / 3 + i * w / 3, 0.215, 0); c.rotation.y = (i - 1) * 0.5; g.add(c); } }
      g.position.set((x0 + x1) / 2, y1 - 0.2, 0); L.group.add(g);
      L.crumbs.push({ s: s, g: g, mt: mt, col: new T.Color(col), hot: new T.Color(boom ? '#ff2a10' : '#5a3a1a'), boom: boom, bx: g.position.x, by: g.position.y, t: 0, gone: 0, bits: [], lim: boom ? 1.3 : 1.0 });
      return b;
    },
    /* CRUMBLE BRIDGE: n breakable stepping stones over a shallow pit. Falling only costs time: a step leads back up. */
    crumbleBridge: function (n, kind) {
      const x = b.x, y = b.y, gapW = 1.5, w = 2.4, len = n * (w + gapW) + gapW;
      addGround(x, x + len, y - 4); const st = addSolid(x + len - 2.4, x + len, y - 2.1, y - 1.7); L.group.add(box(st.x0, st.x1, st.y0, st.y1, 3, L.th.top));
      for (let i = 0; i < n; i++) b.crumble(gapW + i * (w + gapW), i % 2 ? 0.7 : 0, w, kind === 'mix' ? (i % 2 ? 'boom' : 'crumble') : kind);
      b.x += len; return b;
    },
    hint: function (dx, dy, text) { const sp = label(text, 5, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); sp.position.set(b.x + dx, b.y + dy, -1.5); L.group.add(sp); return b; },
    sparks: function (dx, dy, n) {
      for (let i = 0; i < n; i++) { const m = new T.Mesh(G.oct, emat('#ffd166', '#b07a10')); m.scale.setScalar(0.26); m.add(glow('#ffd166', 5, 0.55)); m.position.set(b.x + dx + i * 1.3, b.y + dy, 0); L.group.add(m); L.sparks.push({ x: m.position.x, y: m.position.y, m: m }); }
      return b;
    },
    checkpoint: function () { L.cps.push({ x: b.x - 2, y: b.y }); return b; },
    /* ---------- WATER (bubble helmet) ----------
       sea(top): water starts here; its surface is "top" above the current ground. shore() ends it.
       Below the surface the alien swims: hold jump to rise, duck to dive. An air meter drains while the
       head is under water; air bubbles from a vent (bubbles) or the surface refill it. */
    sea: function (top) { const w = { x0: b.x, x1: 1e9, top: b.y + (top || 0) }; L.waters.push(w); L.waterOpen = w; return b; },
    shore: function () { if (L.waterOpen) { L.waterOpen.x1 = b.x; L.waterOpen = null; } return b; },
    /* a current: a stream of water that pushes you (vx, vy); shown as drifting streaks */
    current: function (dx, len, dy0, dy1, vx, vy) {
      const c = { x0: b.x + dx, x1: b.x + dx + len, y0: b.y + dy0, y1: b.y + dy1, vx: vx || 0, vy: vy || 0, streaks: [] };
      const n = S.set.low ? 6 : 14;
      for (let i = 0; i < n; i++) { const m = new T.Mesh(G.box, basic('#cff6ff', 0.35, true)); m.scale.set(vx ? 1.1 : 0.06, vy && !vx ? 1.1 : 0.06, 0.06); m.position.set(rnd(c.x0, c.x1), rnd(c.y0, c.y1), rnd(-0.8, 0.8)); L.group.add(m); c.streaks.push(m); }
      L.currents.push(c); return b;
    },
    /* a research ship: a white hull under the deck you start on, and a crane for lowering subs (scenery) */
    ship: function (len) {
      const x0 = b.x - len, hull = box(x0 - 1, b.x + 0.6, b.y - 3.2, b.y - 0.02, 8, '#f2f4f6'); L.group.add(hull);
      const stripe = box(x0 - 1, b.x + 0.6, b.y - 1.2, b.y - 0.8, 8.1, '#d8343a'); L.group.add(stripe);
      const cab = box(x0 + 1, x0 + 5, b.y, b.y + 3, 2.4, '#f2f4f6'); cab.position.z = -1.6; L.group.add(cab);
      const win = box(x0 + 1.4, x0 + 4.6, b.y + 1.9, b.y + 2.5, 2.5, '#2a4a6a'); win.position.z = -1.55; L.group.add(win);
      [-0.8, 0.8].forEach(function (z) { const leg = new T.Mesh(G.cyl, emat('#ff9a2a', '#5a2a0a')); leg.scale.set(0.12, 2.4, 0.12); leg.position.set(b.x - 2, b.y + 2.3, z); leg.rotation.z = -0.35; L.group.add(leg); });
      const bar = new T.Mesh(G.cyl, emat('#ff9a2a', '#5a2a0a')); bar.scale.set(0.12, 0.9, 0.12); bar.rotation.x = Math.PI / 2; bar.position.set(b.x - 0.4, b.y + 4.5, 0); L.group.add(bar);
      return b;
    },
    /* OCEAN ZONES: a depth marker sign (sunlit, twilight, midnight...) */
    oceanZone: function (name, sub) {
      const sg = label(name.toUpperCase() + (sub ? ': ' + sub : ''), 8, { bg: '#e8f6ff', fg: '#06283a', bd: '#06283a' }); sg.position.set(b.x + 7, b.y + 7.4, -1.5); L.group.add(sg); return b;
    },
    /* below this depth there is no sunlight at all: the antennae light the way */
    abyss: function (dy) { L.deepY = b.y + (dy || 0); return b; },
    /* glowing animals of the deep (scenery): 'lantern' (a school of lanternfish), 'comb' (comb jellies), 'snow' (bioluminescent specks) */
    glowers: function (dx, dy, kind, n) {
      const g = new T.Group(), list = []; n = n || (kind === 'lantern' ? 9 : 4);
      for (let i = 0; i < n; i++) {
        const m = new T.Group();
        if (kind === 'lantern') { const bd = new T.Mesh(G.sph, emat('#2a3a4a', '#0a1018')); bd.scale.set(0.32, 0.12, 0.1); m.add(bd); for (let k = 0; k < 3; k++) { const ph = new T.Mesh(G.sph, new T.MeshBasicMaterial({ color: '#7fe8ff', fog: false })); ph.scale.setScalar(0.05); ph.position.set(-0.18 + k * 0.14, -0.08, 0.08); m.add(ph); } m.add(glow('#7fe8ff', 2.6, 0.8, false)); }
        else if (kind === 'comb') { const bd = new T.Mesh(G.sph, new T.MeshBasicMaterial({ color: '#e8f8ff', transparent: true, opacity: 0.12, depthWrite: false })); bd.scale.set(0.3, 0.45, 0.3); m.add(bd); for (let k = 0; k < 4; k++) { const r = new T.Mesh(G.box, new T.MeshBasicMaterial({ color: '#ff7aa8', transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false, fog: false })); r.scale.set(0.04, 0.8, 0.04); r.position.set(Math.cos(k * 1.57) * 0.28, 0, Math.sin(k * 1.57) * 0.28); m.add(r); } m.add(glow('#c8b8ff', 3.2, 0.7, false)); }
        else { m.add(glow(['#7fe8ff', '#9fffd8', '#bfd8ff'][i % 3], 1.1, 0.95, false)); }
        m.userData = { ox: rnd(-2.5, 2.5), oy: rnd(-1.2, 1.2), ph: rnd(0, 6.3) }; g.add(m); list.push(m);
      }
      g.position.set(b.x + dx, b.y + dy, kind === 'snow' ? -1 : 0.3); L.group.add(g); L.glowers.push({ g: g, list: list, kind: kind, t: 0 }); return b;
    },
    /* HYDROTHERMAL VENT ("black smoker"): a chimney of minerals with a plume of hot, dark water rising from it.
       The plume carries the alien up (like an elevator); tube worms crowd around the base. */
    smoker: function (dx, h, rise) {
      const x = b.x + dx, y = b.y, g = new T.Group(); h = h || 3.2;
      for (let i = 0; i < 4; i++) { const c = new T.Mesh(G.cyl, emat(['#2a2420', '#3a2e24', '#4a3a2a', '#2a2420'][i], '#0a0604')); const w = 0.9 - i * 0.16; c.scale.set(w, h / 8, w); c.position.y = h / 8 + i * h / 4; g.add(c); }
      const mouth = new T.Mesh(G.sph, basic('#ff9a4a', 0.8, true)); mouth.scale.set(0.3, 0.1, 0.3); mouth.position.y = h; g.add(mouth); const mg = glow('#ff8a3a', 2.4, 0.5); mg.position.y = h; g.add(mg);
      for (let i = 0; i < 9; i++) { const tx = rnd(-2.4, 2.4); if (Math.abs(tx) < 1) continue; const th = rnd(0.6, 1.5);
        const tube = new T.Mesh(G.cyl, emat('#f4f0e8', '#3a3a3a')); tube.scale.set(0.07, th / 2, 0.07); tube.position.set(tx, th / 2, rnd(-0.6, 0.6)); g.add(tube);
        const plume = new T.Mesh(G.sph, emat('#e8283a', '#5a0a10')); plume.scale.set(0.13, 0.2, 0.13); plume.position.set(tx, th + 0.12, tube.position.z); g.add(plume); }
      g.position.set(x, y, -0.4); L.group.add(g); addSolid(x - 0.45, x + 0.45, y, y + h * 0.75);
      const puffs = []; if (!S.set.low) for (let i = 0; i < 14; i++) { const p = new T.Mesh(G.sph, new T.MeshBasicMaterial({ color: '#6a5a50', transparent: true, opacity: 0.55, depthWrite: false })); p.scale.setScalar(0.4); p.position.set(x, y + h + rnd(0, rise || 9), -0.2); L.group.add(p); puffs.push(p); }
      L.smokers.push({ x: x, y0: y + h, y1: y + h + (rise || 9), puffs: puffs });
      L.currents.push({ x0: x - 1.3, x1: x + 1.3, y0: y + h * 0.75, y1: y + h + (rise || 9), vx: 0, vy: 7.5, streaks: [] });
      if (!L.toldVent) { L.toldVent = 1; const sg = label('♨️ Ride the vent plume up!', 3.6, { bd: '#ff9a4a' }); sg.position.set(x, y + h + 2, 0.6); L.group.add(sg); }
      return b;
    },
    /* an air vent on the sea floor: a column of bubbles that refills your air */
    bubbles: function (dx) {
      const x = b.x + dx, g = new T.Group(), rock = new T.Mesh(G.sph, emat('#5a6a7a', '#101820')); rock.scale.set(0.9, 0.45, 0.7); g.add(rock); g.position.set(x, b.y, -0.3); L.group.add(g);
      const bs = []; for (let i = 0; i < (S.set.low ? 6 : 12); i++) { const m = new T.Mesh(G.sph, basic('#e8fbff', 0.55, true)); m.scale.setScalar(rnd(0.08, 0.2)); m.position.set(x + rnd(-0.3, 0.3), b.y + rnd(0, 8), 0.3); L.group.add(m); bs.push(m); }
      L.airs.push({ x: x, y: b.y, bs: bs }); return b;
    },
    /* ---------- DIGGING (burrow drill) ----------
       digShaft(w, depth, roomLen, o): a shaft of soft rock to drill DOWN through into the next, older rock layer.
       Hard rock to the right is the ceiling of the room below, so drilling is the only way down. */
    digShaft: function (w, depth, o) {
      o = o || {}; closeSlab(b.x + w); const x0 = b.x, yTop = b.y, yBot = b.y - depth, cols = Math.max(1, Math.round(w / 1.5)), rows = Math.max(1, Math.round(depth / 1.5)), tw = w / cols, th = depth / rows;
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) digTile(x0 + c * tw, x0 + (c + 1) * tw, yTop - (r + 1) * th, yTop - r * th, o.color);
      addGround(x0, x0 + w, yBot);
      L.slab = { x0: x0 + w, yTop: yTop, rock: o.rock || '#5a4a3a' }; /* the hard-rock ceiling over the next room; closed when the room ends */
      const sg = label('⛏️ Soft rock: hold ↓ to drill down', 4.4, { bd: '#ffd166' }); sg.position.set(x0 + w / 2, yTop + 2.6, 0.5); L.group.add(sg);
      L.digHint = L.digHint || x0; b.x = x0 + w; b.y = yBot; return b;
    },
    /* the tunnel comes out into daylight (the canyon floor) */
    caveEnd: function () { closeSlab(b.x + 1); L.darkEnd = b.x + 1; const sg = label('☀️ Daylight! The canyon floor', 4.4, { bd: '#ffd166' }); sg.position.set(b.x + 4, b.y + 4.6, 0.5); L.group.add(sg); return b; },
    /* a block of soft rock (for example a wall hiding a secret chamber) */
    digBlock: function (dx, dy, w, h, color) {
      const cols = Math.max(1, Math.round(w / 1.5)), rows = Math.max(1, Math.round(h / 1.5)), tw = w / cols, th = h / rows;
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) digTile(b.x + dx + c * tw, b.x + dx + (c + 1) * tw, b.y + dy + r * th, b.y + dy + (r + 1) * th, color);
      return b;
    },
    /* a rock layer: a sign with its age, a back wall in the layer's color, and darkness (the drill's light shows the way) */
    stratum: function (o) {
      const len = o.len || 60, wall = box(b.x - 2, b.x + len, b.y - 1, b.y + 10, 0.5, o.color || '#8a6a4a'); wall.position.z = -4; L.group.add(wall);
      for (let i = 0; i < len / 3; i++) { const st = box(b.x + i * 3, b.x + i * 3 + rnd(1, 2.5), b.y + rnd(0, 9), 0, 0.2, new T.Color(o.color || '#8a6a4a').offsetHSL(0, 0, rnd(-0.08, 0.08)).getStyle()); st.scale.y = rnd(0.15, 0.4); st.position.y = b.y + rnd(0.5, 9); st.position.z = -3.7; L.group.add(st); }
      const sg = label(o.name, 5.6, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }), s2 = o.sub ? label(o.sub, 7.4, { bd: '#ffd166' }) : null;
      const top = b.y + 8.2, wn = sg.userData.lbl.w; sg.position.set(b.x + 3.5, top - sg.userData.lbl.h / 2, -1.5); L.group.add(sg); /* layer name and its age sit side by side under the cave ceiling */
      if (s2) { s2.position.set(b.x + 3.5 + wn / 2 + s2.userData.lbl.w / 2 + 0.3, top - s2.userData.lbl.h / 2, -1.5); L.group.add(s2); }
      if (L.darkX == null) { L.darkX = b.x - 1; L.darkTop = b.y + 10; }
      return b;
    },
    /* CAVE-IN: a rock shakes loose from the ceiling and drops on a steady beat; dust falls first as a warning */
    rockfall: function (dx, period, offset, h) {
      const x = b.x + dx, top = b.y + (h || 7.9), g = new T.Group(), r = new T.Mesh(G.ico, emat('#7a6a5a', '#1a140a')); r.scale.set(0.7, 0.55, 0.6); g.add(r); g.position.set(x, top, 0); L.group.add(g);
      const dust = glow('#e8d8b8', 1.6, 0); dust.position.set(x, top - 0.4, 0.5); L.group.add(dust);
      L.hazards.push({ kind: 'rock', m: g, dust: dust, x: x, y: top, top: top, gy: b.y, period: period || 4, offset: offset || 0, t: 0, alive: true }); return b;
    },
    /* REFUEL STATION: an optional bonus quiz. Stand on the glowing pad and press E. */
    refuel: function () {
      const x0 = b.x, cx = x0 + 4; addGround(x0, x0 + 8, b.y); const g = new T.Group();
      const pad = new T.Mesh(G.cyl, emat('#2fd6c8', '#0c6a64')); pad.scale.set(2.4, 0.25, 1.4); pad.position.y = 0.12; g.add(pad); g.add(glow('#5ff5e6', 4.5, 0.55));
      const col = new T.Mesh(G.box, emat('#e8f4f2', '#2a4a48')); col.scale.set(0.7, 2.4, 0.7); col.position.set(1.7, 1.2, -0.6); g.add(col);
      const scr = new T.Mesh(G.box, emat('#5ff5e6', '#1fb8aa')); scr.scale.set(0.5, 0.5, 0.05); scr.position.set(1.7, 1.9, -0.22); g.add(scr);
      const ring = new T.Mesh(new T.TorusGeometry(1.5, 0.08, 8, 40), basic('#5ff5e6', 0.8, true)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.3; g.add(ring);
      const lb = label('⛽ Refuel Station · bonus quiz (E)', 4.6, { bd: '#5ff5e6' }); lb.position.set(0, 3.6, 0); g.add(lb);
      g.position.set(cx, b.y, -0.8); L.group.add(g); L.refuels.push({ x: cx, y: b.y, g: g, pad: pad, ring: ring, lb: lb, used: false });
      b.x = x0 + 8; return b;
    },
    collect: function (id) {
      const set = (D.tokens || []).find(function (s) { return s.id === id; }); if (!set) return b;
      const items = shuffle(set.good.map(function (t) { return { text: t, good: true }; }).concat(set.bad.map(function (t) { return { text: t.text, good: false, explain: t.explain }; })));
      const x0 = b.x, wx = x0 + 8 + items.length * 4; addGround(x0, wx + 5, b.y);
      const sign = label(set.prompt, 7, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); sign.position.set(x0 + 3.5, b.y + 6.4, -1.5); L.group.add(sign);
      const door = { need: set.good.length, got: 0, set: set };
      items.forEach(function (it, i) {
        const x = x0 + 8 + i * 4, y = b.y + (i % 2 ? 3.2 : 1.3), g = new T.Group();
        const gem = new T.Mesh(G.ico, emat('#bfe9ff', '#3a7090')); gem.scale.setScalar(0.42); g.add(gem); g.add(glow('#9fe0ff', 2.8, 0.45));
        const lb = label(it.text, 3.5); lb.position.y = 1.25; g.add(lb);
        g.position.set(x, y, 0); L.group.add(g); L.tokens.push({ x: x, y: y, it: it, door: door, m: g, gem: gem });
      });
      door.solid = addSolid(wx, wx + 1.2, b.y, b.y + 18); door.mesh = gate(wx, wx + 1.2, b.y, b.y + 18); L.group.add(door.mesh);
      door.label = label('', 4.2); door.label.position.set(wx + 0.6, b.y + 5.2, 3); L.group.add(door.label); L.doors.push(door); doorText(door);
      b.x = wx + 5; L.cps.push({ x: wx + 3, y: b.y }); return b;
    },
    station: function (list, o) {
      const qs = [];
      (Array.isArray(list) ? list : [list]).forEach(function (e) {
        if (typeof e === 'string') { const rq = rotQ(e); if (rq) qs.push(rq); return; }
        const ids = shuffle(Object.keys(QMAP).filter(function (k) { return k.indexOf(e.sort + '.') === 0 && !L.used[k]; })).slice(0, e.n || 3);
        ids.forEach(function (k) { L.used[k] = 1; qs.push(QMAP[k]); });
      });
      if (qs.length) makeStation(qs, o || {}); return b;
    },
    review: function () {
      const ids = Object.keys(S.missed).filter(function (k) { return QMAP[k] && QMAP[k].world === L.world.id && !L.used[k]; }).slice(0, 2);
      ids.forEach(function (k) { L.used[k] = 1; });
      if (ids.length) makeStation(ids.map(function (k) { return QMAP[k]; }), { title: 'Review: one you missed before' }); return b;
    },
    /* Interleaving: a gate that mixes in questions from topics covered in earlier levels.
       Missed questions come first, then the ones seen longest ago. */
    mixed: function (n, codes) {
      const pr = n >= 2 ? pickPair() : null, qs = (pr ? pr.qs : []).concat(mixPick(n - (pr ? 2 : 0), codes));
      if (qs.length) makeStation(qs, { title: 'Mixed review', pair: pr }); return b;
    },
    become: function (ids) {
      const list = Array.isArray(ids) ? ids : [ids], id = list[Math.floor(Math.random() * list.length)];
      const it = (D.become || []).find(function (e) { return e.id === id; }); if (it) makeBecome(it); return b;
    },
    readData: function (id) {
      const g = (D.data || []).find(function (e) { return e.id === id; }); if (!g) return b;
      makeStation(g.questions.map(function (_, i) { return QMAP[g.id + '.' + i]; }), { title: 'Read the Data', labels: g.categories, flat: true, chart: g }); return b;
    },
    maze: function (id) { const mz = (D.mazes || []).find(function (e) { return e.id === id; }); if (mz) makeMaze(mz); return b; },
    sequence: function (id) { const sq = (D.sequences || []).find(function (e) { return e.id === id; }); if (sq) makeSequence(sq); return b; },
    wordbank: function (id) { const wb = (D.wordbanks || []).find(function (e) { return e.id === id; }); if (wb) makeWordbank(wb); return b; },
    /* ACTION PIECES: free radicals to dodge or stomp, moving platforms, ATP boosts, catch games */
    hazard: function (dx, dy, o) {
      o = o || {}; const g = o.look ? foeMesh(o.look) : new T.Group();
      if (!o.look) { const core = new T.Mesh(G.ico, emat('#ff6b4a', '#7a1a0a')); core.scale.setScalar(0.55); g.add(core);
        const sp = new T.Mesh(G.oct, emat('#ffb09c', '#7a2a1a')); sp.scale.set(0.95, 0.25, 0.25); g.add(sp); const sp2 = sp.clone(); sp2.rotation.z = Math.PI / 2; g.add(sp2);
        g.add(glow('#ff6b4a', 2.8, 0.55)); }
      g.position.set(b.x + dx, b.y + dy, 0); L.group.add(g);
      L.hazards.push({ m: g, look: o.look || null, bx: b.x + dx, by: b.y + dy, x: b.x + dx, y: b.y + dy, ax: o.ax || 0, ay: o.ay == null ? 0.6 : o.ay, sp: o.sp || 1.5, ph: Math.random() * 6, t: 0, alive: true }); return b;
    },
    bridge: function (len, o) {
      o = o || {}; const w = o.w || 3.6, cx = b.x + len / 2, sl = addSolid(cx - w / 2, cx + w / 2, b.y - 0.5, b.y, { oneWay: true });
      const m = new T.Group(), body = box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top); body.material = emat(L.th.top, '#3a2a10'); m.add(body);
      const rim = new T.Mesh(G.box, basic(L.th.rim)); rim.scale.set(w, 0.08, 0.1); rim.position.set(cx, b.y - 0.02, 1.55); m.add(rim);
      const gl = glow(L.th.rim, 3.6, 0.35); gl.position.set(cx, b.y - 0.6, 0); m.add(gl); L.group.add(m);
      L.movers.push({ s: sl, m: m, bx: sl.x0, by: sl.y1, ax: o.ay ? 0 : (len - w) / 2 - 0.3, ay: o.ay || 0, sp: o.sp || 1.1, t: o.ph || 0 });
      b.x += len; return b;
    },
    /* VIRUS: walks back and forth over a stretch of ground. Jump on it or over it. */
    virus: function (dx, range, sp) {
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#9be36b', '#2f5a10')); core.scale.setScalar(0.5); g.add(core);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, k = new T.Mesh(G.sph, emat('#d8ff9a', '#4a7a20')); k.scale.setScalar(0.12); k.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0); g.add(k); }
      [-0.17, 0.17].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.12); e.position.set(ex, 0.08, 0.45); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.06); p.position.set(ex, 0.06, 0.55); g.add(p); });
      g.add(glow('#9be36b', 2.2, 0.35)); g.position.set(b.x + dx, b.y + 0.62, 0); L.group.add(g);
      L.hazards.push({ kind: 'virus', m: g, bx: b.x + dx, by: b.y + 0.62, x: b.x + dx, y: b.y + 0.62, range: range || 2.5, sp: sp || 1, ph: Math.random() * 6, t: 0, alive: true }); return b;
    },
    /* SNAPPER: a phagocyte (an amoeba in the pond, a white blood cell in the body) that pops out of a
       pore on a steady beat to engulf whatever is nearby. It shakes just before it pops up.
       Time your jump to get past; it cannot be stomped. */
    snapper: function (dx, period, offset, look) {
      if (look === 'eel') return eelHole(dx, period, offset);
      const x = b.x + dx, g = new T.Group(), pore = new T.Mesh(G.tor, emat('#6a4a7a', '#200a2a')); pore.scale.set(0.8, 0.8, 0.8); pore.rotation.x = Math.PI / 2; pore.position.set(x, b.y + 0.05, 0); L.group.add(pore);
      const head = new T.Group(), body = new T.Mesh(G.sph, emat('#e6f0ff', '#3a4a6a')); body.scale.set(0.85, 0.75, 0.7); head.add(body); head.add(glow('#cfe0ff', 2.6, 0.35));
      const nuc = new T.Mesh(G.sph, emat('#8a5ac8', '#2a0a4a')); nuc.scale.set(0.32, 0.26, 0.2); nuc.position.set(0.15, -0.15, 0.55); head.add(nuc);
      [-0.28, 0.12].forEach(function (ex) { const e = new T.Mesh(G.sph, emat('#ffffff', '#666666')); e.scale.setScalar(0.15); e.position.set(ex, 0.25, 0.62); head.add(e); const p = new T.Mesh(G.sph, emat('#10202c', '#000000')); p.scale.setScalar(0.07); p.position.set(ex, 0.25, 0.75); head.add(p); });
      const arms = [-1, 1].map(function (side) { const a = new T.Group(), arm = new T.Mesh(G.sph, emat('#e6f0ff', '#3a4a6a')); arm.scale.set(0.22, 0.75, 0.22); arm.position.y = 0.6; a.add(arm); a.position.set(side * 0.65, 0.1, 0); head.add(a); return a; });
      g.add(head); g.position.set(x, b.y, 0); L.group.add(g);
      L.hazards.push({ kind: 'snapper', m: g, head: head, arms: arms, x: x, y: b.y, gy: b.y, period: period || 4, offset: offset || 0, t: 0, alive: true }); return b;
    },
    /* ANTIBODY: a Y-shaped antibody (your body's tag for invaders, and you are the invader) that flies
       right to left at head height on a steady beat. Duck under it or jump over it. A glow at its
       launch point blinks just before it flies. */
    antibody: function (dx, span, period, offset) {
      const x0 = b.x + dx, g = new T.Group(), M = emat('#ffe08a', '#6a5010');
      const stem = new T.Mesh(G.cyl, M); stem.scale.set(0.09, 0.45, 0.09); stem.rotation.z = Math.PI / 2; stem.position.x = 0.35; g.add(stem);
      [-1, 1].forEach(function (sd) { const a = new T.Mesh(G.cyl, M); a.scale.set(0.08, 0.42, 0.08); a.rotation.z = Math.PI / 2 + sd * 0.6; a.position.set(-0.12, sd * 0.17, 0); g.add(a); });
      g.add(glow('#ffe08a', 1.8, 0.45)); g.scale.setScalar(1.5); L.group.add(g);
      const warn = glow('#ffe08a', 2.2, 0.15); warn.position.set(x0 + 0.6, b.y + 1.15, 0); L.group.add(warn);
      L.hazards.push({ kind: 'antibody', m: g, warn: warn, x0: x0, x: x0, gy: b.y, y: b.y + 1.15, span: span || 12, speed: 7, period: period || 3.2, offset: offset || 0, t: 0, alive: true }); return b;
    },
    /* SCAN: a specimen to look at. Walk up and press E: a short note teaches a new word,
       and the word is saved in the Field Guide. Play keeps going while you read. */
    scan: function (dx, id, dy) {
      const sc = (D.scans || []).find(function (e) { return e.id === id; }); if (!sc) return b;
      const x = b.x + dx, y = b.y + (dy || 0), g = specimen(sc.look || 'blob', sc.color || '#9fe0ff'); g.position.set(x, y, 0.6); L.group.add(g);
      const ring = new T.Mesh(G.tor, basic('#9fe0ff', 0.7, true)); ring.scale.setScalar(0.45); ring.position.set(x, y + 2.7, 0.6); L.group.add(ring);
      const nm = label('🔍 ' + sc.name, 3, { bd: '#9fe0ff' }); nm.position.set(x, y + 3.6, 0.6); L.group.add(nm);
      L.scans.push({ sc: sc, x: x, y: y, g: g, ring: ring, nm: nm, done: false, t: Math.random() * 6 }); return b;
    },
    /* FOSSIL: a specimen buried in a mound of soft rock. Drill it out to uncover the fact card, then press E. */
    fossil: function (dx, id) {
      b.scan(dx, id); const k = L.scans[L.scans.length - 1]; if (!k || k.sc.id !== id) return b;
      const x0 = k.x - 1.5, tiles = []; for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) tiles.push(digTile(x0 + c * 1.5, x0 + (c + 1) * 1.5, b.y + r * 1.5, b.y + (r + 1) * 1.5, '#a08060'));
      const bone = new T.Mesh(G.box, basic('#f4ecd8', 0.9)); bone.scale.set(0.9, 0.18, 0.05); bone.rotation.z = 0.5; bone.position.set(k.x, b.y + 1.6, 3.64); L.group.add(bone); tiles[1].digM.push(bone);
      const tag = label('⛏️ Buried fossil! Push into the rock to drill it out.', 4.2, { bd: '#ffd166' }); tag.position.set(k.x, b.y + 3.9, 0.6); L.group.add(tag);
      k.buried = tiles; k.tag = tag; k.g.visible = k.ring.visible = k.nm.visible = false; return b;
    },
    /* SQUEEZE: a low tunnel of fibers. Duck (down arrow or S) and crawl through. */
    squeeze: function (dx, len) {
      const x0 = b.x + dx, x1 = x0 + (len || 4); addSolid(x0, x1, b.y + 1.05, b.y + 7.2); L.group.add(box(x0, x1, b.y + 1.05, b.y + 7.2, 1.6, L.th.top));
      for (let i = 0; i < 5; i++) { const f = new T.Mesh(G.cyl, emat('#c59cff', '#3a1a6a')); f.scale.set(0.07, (len || 4) / 2, 0.07); f.rotation.z = Math.PI / 2; f.position.set((x0 + x1) / 2, b.y + 1.12, -1.6 + i * 0.8); L.group.add(f); }
      return b;
    },
    /* SPIKES: toxin crystals on the ground. Touching them costs energy. */
    spikes: function (dx, w) {
      const x0 = b.x + dx, n = Math.max(2, Math.round(w / 0.55)), inst = new T.InstancedMesh(G.cone, emat('#c77dff', '#4a1a7a'), n), m4 = new T.Matrix4();
      for (let i = 0; i < n; i++) { m4.makeScale(0.22, 0.3, 0.22); m4.setPosition(x0 + (i + 0.5) * w / n, b.y + 0.3, (i % 2) * 0.6 - 0.3); inst.setMatrixAt(i, m4); }
      L.group.add(inst); const gl = glow('#c77dff', w + 1, 0.25); gl.scale.set(w + 1, 1.2, 1); gl.position.set(x0 + w / 2, b.y + 0.3, 0.5); L.group.add(gl);
      L.spikes.push({ x0: x0, x1: x0 + w, y: b.y }); return b;
    },
    shield: function (dx, dy) { addPickup('shield', b.x + dx, b.y + dy); return b; },
    /* ? BLOCK: bump it from below to get a reward: sparks, boost, shield, or life */
    qblock: function (dx, dy, reward) {
      const x0 = b.x + dx - 0.6, y0 = b.y + dy, s = addSolid(x0, x0 + 1.2, y0, y0 + 1.2);
      const m = new T.Mesh(G.box, emat('#ffd166', '#7a5a10')); m.scale.set(1.2, 1.2, 1.2); m.position.set(x0 + 0.6, y0 + 0.6, 0); L.group.add(m);
      const q = label('?', 1.15, { big: true, bg: '#ffd166', fg: '#10202c', bd: '#7a5a10' }); q.position.set(x0 + 0.6, y0 + 0.6, 0.75); L.group.add(q);
      const gl = glow('#ffd166', 2.6, 0.35); gl.position.copy(m.position); L.group.add(gl);
      s.qb = { m: m, q: q, gl: gl, reward: reward || 'sparks', used: false, x: x0 + 0.6, y: y0 + 1.2 }; return b;
    },
    /* RARE SPECIMEN: one hidden bonus per level, usually somewhere only a double jump can reach. */
    rare: function (dx, dy, o) {
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#ffd700', '#8a6a00')); core.scale.setScalar(0.45); g.add(core); g.add(glow('#ffd700', 4, 0.8));
      if (o && o.name) { const lb = label('✦ ' + o.name, 3.2, { bd: '#ffd700' }); lb.position.y = 1.2; g.add(lb); }
      g.position.set(b.x + dx, b.y + dy, 0); L.group.add(g); L.rare = { x: b.x + dx, y: b.y + dy, m: g, got: false, name: o && o.name, fact: o && o.fact }; return b;
    },
    /* a trail of sparks along a jump arc: shows the player where to jump */
    arc: function (dx, len, h) {
      for (let i = 0; i <= 6; i++) { const f = i / 6, m = new T.Mesh(G.oct, emat('#ffd166', '#b07a10')); m.scale.setScalar(0.26); m.add(glow('#ffd166', 5, 0.55)); m.position.set(b.x + dx + f * len, b.y + 1.2 + h * 4 * f * (1 - f), 0); L.group.add(m); L.sparks.push({ x: m.position.x, y: m.position.y, m: m }); }
      return b;
    },
    boost: function (dx, dy) { addPickup('boost', b.x + dx, b.y + dy); return b; },
    balance: function (id) { const bl = (D.balances || []).find(function (e) { return e.id === id; }); if (bl) makeBalance(bl); return b; },
    hunt: function (id) { const set = (D.tokens || []).find(function (e) { return e.id === id; }); if (set) makeHunt(set); return b; },
    catchGame: function (id) { const c = (D.catches || []).find(function (e) { return e.id === id; }); if (c) makeCatch(c); return b; },
    lablock: function (id) {
      const lk = (D.lablocks || []).find(function (e) { return e.id === id; }); if (!lk) return b;
      makeStation(lk.clues.map(function (_, i) { return QMAP[lk.id + '.' + i]; }), { title: 'Lab Lock', labels: ['1', '2', '3', '4', '5'], flat: true, lock: lk }); return b;
    },
    boss: function (name, tag, n, mixN, codes) {
      const pool = Object.keys(QMAP).map(function (k) { return QMAP[k]; }).filter(function (q) { return q.world === L.world.id && q.tags && q.tags.indexOf(tag) >= 0; });
      const missed = shuffle(pool.filter(function (q) { return S.missed[q.id]; })), rest = shuffle(pool.filter(function (q) { return !S.missed[q.id]; }));
      const qs = missed.concat(rest).slice(0, n - (mixN || 0)); qs.forEach(function (q) { L.used[q.id] = 1; });
      const pr = mixN >= 2 ? pickPair() : null, extra = mixN ? mixPick(mixN - (pr ? 2 : 0), codes) : [];
      /* shuffle, but keep a look-alike pair back to back */
      const blocks = shuffle(qs.concat(extra).map(function (q) { return [q]; }).concat(pr ? [pr.qs] : []));
      const all = [].concat.apply([], blocks); if (all.length) makeStation(all, { boss: name, pair: pr }); return b;
    },
    goal: function () {
      addGround(b.x, b.x + 10, b.y);
      const g = new T.Group(), hull = mesh('sph', '#cfd8e3'); hull.scale.set(2.4, 0.55, 2.4); g.add(hull); g.add(glow(L.th.rim, 9, 0.6));
      const dome = mesh('sph', '#7fd4ff', 0.7); dome.scale.set(1.1, 0.8, 1.1); dome.position.y = 0.4; g.add(dome);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, lt = new T.Mesh(G.sph, emat('#ffd166', '#c08a10')); lt.scale.setScalar(0.14); lt.position.set(Math.cos(a) * 2.2, -0.1, Math.sin(a) * 2.2); g.add(lt); }
      g.position.set(b.x + 6, b.y + 6.6, 0); L.group.add(g);
      const beam = new T.Mesh(new T.CylinderGeometry(0.7, 1.7, 6.2, 20, 1, true), basic(L.th.rim, 0.16, true)); beam.position.set(b.x + 6, b.y + 3.1, 0); L.group.add(beam);
      L.goal = { x: b.x + 6, y: b.y, m: g, beam: beam };
      const sp = label('Mothership: step into the beam', 4.6); sp.position.set(b.x + 6, b.y + 8.6, 0); L.group.add(sp);
      b.x += 10; return b;
    }
  };
  function mixPick(n, codes) {
    const pool = shuffle(Object.keys(QMAP).map(function (k) { return QMAP[k]; }).filter(function (q) { return q.world <= L.world.id && codes.indexOf(q.code) >= 0 && !L.used[q.id] && !(q.tags && q.tags.length); })); /* interleaving: the listed codes from this world or earlier worlds */
    const rank = function (q) { return S.missed[q.id] ? 0 : S.seen[q.id] ? 1 : 2; };
    pool.sort(function (a, c) { return rank(a) - rank(c) || (S.seen[a.id] || 0) - (S.seen[c.id] || 0); });
    const qs = pool.slice(0, n); qs.forEach(function (q) { L.used[q.id] = 1; }); return qs;
  }
  /* Look-alike pair: only pairs whose BOTH halves come from levels the student has finished.
     A group of three rotates: the two halves seen longest ago are chosen. */
  function pickPair() {
    const pairs = ((BQ.data[L.world.id] || {}).pairs || []).filter(function (p) { return p.members.every(function (m) { return m.level !== L.lv.id && played(m.level); }); });
    const avail = function (m) { return m.ids.filter(function (id) { return QMAP[id] && !L.used[id]; }); };
    const age = function (id) { return S.missed[id] ? -1 : (S.seen[id] || 0); };
    const best = function (ids) { return shuffle(ids).sort(function (a, c) { return age(a) - age(c); })[0]; };
    const cands = [];
    pairs.forEach(function (p) {
      for (let a = 0; a < p.members.length; a++) for (let c = a + 1; c < p.members.length; c++) {
        const A = avail(p.members[a]), C = avail(p.members[c]); if (!A.length || !C.length) continue;
        const qa = best(A), qc = best(C); cands.push({ p: p, ids: Math.random() < 0.5 ? [qa, qc] : [qc, qa], s: Math.min(age(qa), age(qc)), r: Math.random() });
      }
    });
    if (!cands.length) return null;
    cands.sort(function (x, y) { return x.s - y.s || x.r - y.r; });
    const c = cands[0]; c.ids.forEach(function (id) { L.used[id] = 1; });
    return { qs: c.ids.map(function (id) { return QMAP[id]; }), name: c.p.name, explain: c.p.explain };
  }
  function makeStation(qs, o) {
    const n = o.labels ? o.labels.length : Math.max.apply(null, qs.map(function (q) { return q.options.length; }));
    const x0 = b.x, wx = o.chart ? x0 + 5 + n * 3.6 + 0.4 : x0 + 7; addGround(x0, wx + 7, b.y);
    const st = { x0: o.chart ? x0 + 4 : wx - 2.2, x1: wx, y: b.y, pads: [], queue: qs, qi: 0, done: false, title: o.title || '', boss: null, tried: {},
      pair: o.pair || null, chart: !!o.chart, lock: o.lock || null, fixedLabels: !!o.labels };
    for (let i = 0; o.chart && i < n; i++) {
      const px = x0 + 5 + i * 3.6, top = b.y + 1.8;
      const s = addSolid(px, px + 2.7, top - 1, top, { oneWay: true });
      const m = box(px, px + 2.7, top - 1, top, 3, '#3d8bd4'); m.material = emat('#3d8bd4', '#0f3a66'); L.group.add(m);
      const pg = glow('#7fc4ff', 4.5, 0.3); pg.position.set(px + 1.35, top - 0.3, 0); L.group.add(pg);
      const txt = o.labels ? o.labels[i] : String.fromCharCode(65 + i), lb = label(txt, o.labels ? 2.6 : 1.9, { big: txt.length <= 2 }); lb.position.set(px + 1.35, top - 0.52, 1.6); L.group.add(lb);
      st.pads.push({ s: s, m: m, lb: lb, i: i });
    }
    st.wall = addSolid(wx, wx + 1.2, b.y, b.y + 18); st.wallMesh = gate(wx, wx + 1.2, b.y, b.y + 18); L.group.add(st.wallMesh);
    if (o.chart) {
      const left = x0 + 3.2, W = wx - left, H = W * 420 / 1024, m = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: chartTex(o.chart, left, W, x0 + 6.35), transparent: true, fog: false, depthWrite: false }));
      m.scale.set(W, H, 1); m.position.set(left + W / 2, b.y + 3.4 + H / 2, -1.7); L.group.add(m);
    }
    if (o.lock) { st.lockLabel = label('Code: _ _ _', 4.6, { bd: '#c8ff7a' }); st.lockLabel.position.set(wx + 0.6, b.y + 8.8, 3); L.group.add(st.lockLabel); st.wallMesh.children.forEach(function (c) { c.material = basic('#c8ff7a', 0.2, true); }); }
    if (o.boss) {
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#3b1030', '#30060f')); core.scale.setScalar(1.9); g.add(core); g.add(glow('#ff4d6d', 11, 0.55));
      [-0.6, 0.6].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.32); e.position.set(ex, 0.4, 1.6); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.15); p.position.set(ex, 0.4, 1.86); g.add(p); });
      g.position.set(wx + 3.6, b.y + 6, 0); L.group.add(g); st.boss = { name: o.boss, m: g, hp: qs.length, max: qs.length, y: b.y + 6 };
    }
    L.stations.push(st); L.total += qs.length; b.x = wx + 7; L.cps.push({ x: wx + 3.5, y: b.y });
  }
  /* BECOME IT: a membrane with three openings at three heights. Stand at an opening and press E to go through. */
  function makeBecome(it) {
    const x0 = b.x, y = b.y, wx = x0 + 17, end = x0 + 31;
    addGround(x0, end, y);
    const op = [[0, 2.3], [2.7, 4.9], [5.3, 7.5]].map(function (o) { return [y + o[0], y + o[1]]; });
    [[y + 2.3, y + 2.7], [y + 4.9, y + 5.3], [y + 7.5, y + 18]].forEach(function (g) { addSolid(wx, wx + 1.4, g[0], g[1]); L.group.add(L.th.doorWall ? box(wx, wx + 1.4, g[0], g[1], 4.6, L.th.doorWall) : bilayer(wx, wx + 1.4, g[0], g[1])); });
    [[wx - 6.5, y + 2.7], [wx - 4, y + 5.3]].forEach(function (p) { const sl = addSolid(p[0], wx, p[1] - 0.4, p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
    const KC = { lipid: '#f2c078', protein: '#c59cff', pump: '#ff9f6e', flow: '#7fd4ff', organelle: '#ffd166', vesicle: '#7be0ad' };
    const doors = shuffle(it.doors).map(function (d, i) {
      const o = op[i], sd = addSolid(wx, wx + 1.4, o[0], o[1]), g = new T.Group(), mid = (o[0] + o[1]) / 2;
      const plate = new T.Mesh(G.box, basic(KC[d.kind] || '#7fd4ff', 0.3, true)); plate.scale.set(1.4, o[1] - o[0], 4.6); plate.position.set(wx + 0.7, mid, 0); g.add(plate);
      if (d.kind === 'protein') [o[0] + 0.25, o[1] - 0.25].forEach(function (yy) { const c = new T.Mesh(G.cyl, emat('#c59cff', '#4a2a7a')); c.scale.set(0.35, 1.6, 0.35); c.rotation.z = Math.PI / 2; c.position.set(wx + 0.7, yy, 1.6); g.add(c); });
      if (d.kind === 'pump') { const t = new T.Mesh(G.tor, emat('#ff9f6e', '#7a3a10')); t.scale.setScalar(0.62); t.position.set(wx + 0.7, mid, 1.8); g.add(t); L.spin.push(t); }
      const lb = label(d.label, 3.2, { bd: KC[d.kind] || '#7fd4ff' }); lb.position.set(wx - 1.9, mid + 0.2, -0.9); g.add(lb);
      L.group.add(g); return { d: d, s: sd, g: g, plate: plate, cool: 0, kc: KC[d.kind] || '#7fd4ff' };
    });
    for (let i = doors.length; i < 3; i++) { addSolid(wx, wx + 1.4, op[i][0], op[i][1]); L.group.add(L.th.doorWall ? box(wx, wx + 1.4, op[i][0], op[i][1], 4.6, L.th.doorWall) : bilayer(wx, wx + 1.4, op[i][0], op[i][1])); }
    if (it.hereCrowd != null) {
    crowd(x0 + 1, wx - 0.4, y, it.hereCrowd * 3, it.dotColor || it.color);
    crowd(wx + 1.8, end - 1, y, it.thereCrowd * 3, it.dotColor || it.color);
    const more = it.hereCrowd > it.thereCrowd;
    const s1 = label(it.here + ': ' + (more ? 'more' : 'less') + ' ' + it.what, 6, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); s1.position.set(x0 + 7, y + 7.3, -1.5); L.group.add(s1);
    const s2 = label(it.there + ': ' + (more ? 'less' : 'more') + ' ' + it.what, 6, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); s2.position.set(wx + 7.5, y + 7.3, -1.5); L.group.add(s2);
    }
    if (it.atp) {
      const orb = new T.Group(), core = new T.Mesh(G.sph, emat('#c8ff7a', '#5a8a20')); core.scale.setScalar(0.35); orb.add(core); orb.add(glow('#c8ff7a', 2.4, 0.7));
      const ol = label('ATP', 1.4); ol.position.y = 0.85; orb.add(ol); orb.position.set(wx - 5.6, y + 3.5, 0); L.group.add(orb); L.atps.push({ x: wx - 5.6, y: y + 3.5, m: orb, got: false });
    }
    const z = { kind: 'become', x0: x0 + 0.5, x1: wx + 1.4, done: false, errors: 0, doors: doors, it: it };
    L.zones.push(z); L.total++; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  /* CATCH: answers float and drift around an arena. Jump into the one that matches the highlighted cue;
     dodge the others. Each right catch joins the chain that trails behind the alien. */
  function makeCatch(c) {
    const x0 = b.x, y = b.y, wx = x0 + 32, end = wx + 6;
    addGround(x0, end, y);
    [[x0 + 7, 2.6, 4], [x0 + 15, 4.2, 4], [x0 + 23, 2.6, 4]].forEach(function (p) { const sl = addSolid(p[0], p[0] + p[2], y + p[1] - 0.4, y + p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
    const z = { kind: 'catch', x0: x0 + 0.5, x1: wx, done: false, errors: 0, stepErr: false, c: c, si: 0, toks: [], xa: x0 + 3, xb: wx - 2, y: y, time: 0,
      lanes: shuffle([orbit(x0 + 9, y + 4.4, 1.5, 5, 1), elev(x0 + 13, y + 2.2, y + 6.8, 6), ferry(y + 6.4, x0 + 12, x0 + 22, 7), orbit(x0 + 25, y + 4.4, 1.5, 5, -1), ferry(y + 2.4, x0 + 3, x0 + 30, 9), elev(x0 + 29.5, y + 2.2, y + 6.4, 5)]) };
    for (let i = 0; i < 6; i++) { const t = catchTok(z, i === 0 ? c.steps[0].need : null); t.lane = z.lanes[i]; z.toks.push(t); }
    /* calm and readable: two rows, evenly spaced, all bobbing up and down together (like the hunt) */
    z.toks.forEach(function (t, i) { t.hx = x0 + 4 + i * 5; t.hy = y + (i % 2 ? 5.2 : 2.4); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += c.steps.length; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  function catchTok(z, text) {
    const t = { g: new T.Group(), cool: 0 };
    t.gem = new T.Mesh(G.ico, emat('#ffffff', '#333333')); t.gem.scale.setScalar(0.36); t.g.add(t.gem);
    t.halo = glow('#ffffff', 3, 0.5); t.g.add(t.halo); t.lb = label('?', 1.5, { big: true }); t.lb.position.y = 0.75; t.lb.position.z = 0.4; t.g.add(t.lb);
    L.group.add(t.g); placeTok(z, t, text); return t;
  }
  /* BALANCE: a body measurement drifts away from normal; the player presses switches (E) for the body's
     responses to bring it back. Elevator: the platform height is the measurement. Boss: the boss keeps pushing it. */
  function makeBalance(bl) {
    const x0 = b.x, y = b.y, boss = bl.kind === 'boss', wx = x0 + (boss ? 28 : 20), end = wx + 6;
    addGround(x0, end, y);
    const z = { kind: 'balance', bl: bl, x0: x0 + 0.5, x1: wx, y: y, done: false, v: bl.start, hold: 0, hp: bl.hp || 1, phase: 1, hurtT: 0, evT: 0, push: [], levers: [], danger: false, wrong: 0 };
    const lever = function (c, lx, ly, parent) {
      const g = new T.Group(), post = mesh('cyl', '#d6e4ea'); post.scale.set(0.08, 1.2, 0.08); post.position.y = 0.6; g.add(post);
      const up = c.delta > 0, knob = new T.Mesh(G.sph, emat(up ? '#ff9f6e' : '#7fd4ff', up ? '#7a3a10' : '#1a4a7a')); knob.scale.setScalar(0.3); knob.position.y = 1.3; g.add(knob); g.add(glow(up ? '#ff9f6e' : '#7fd4ff', 2.2, 0.5));
      const lb = label(c.label, 3, { bd: up ? '#ff9f6e' : '#7fd4ff' }); lb.position.y = 2.4; g.add(lb); g.position.set(lx, ly, 0.4); (parent || L.group).add(g);
      z.levers.push({ c: c, g: g, knob: knob, lx: lx, ly: ly, parent: parent || null, cool: 0 });
    };
    if (!boss) {
      const ex0 = x0 + 6, ex1 = x0 + 13, s0 = addSolid(ex0, ex1, y - 0.5, y, { oneWay: true }), grp = new T.Group(), body = box(ex0, ex1, y - 0.5, y, 3, '#7be0ad'); body.material = emat('#4fae86', '#1a4a3a');
      grp.add(body); const gl = glow('#7be0ad', 7, 0.3); gl.position.set((ex0 + ex1) / 2, y - 0.6, 0); grp.add(gl); L.group.add(grp);
      z.elev = { s: s0, g: grp, base: y };
      lever(bl.controls[0], ex0 + 1.4, y, grp); lever(bl.controls[1], ex1 - 1.4, y, grp);
      const toH = function (v) { return (v - bl.min) / (bl.max - bl.min) * 8.4; };
      const band = new T.Mesh(G.box, basic('#7be0ad', 0.12, true)); band.scale.set(wx - x0 - 2, toH(bl.band[1]) - toH(bl.band[0]), 0.2); band.position.set((x0 + wx) / 2, y + (toH(bl.band[0]) + toH(bl.band[1])) / 2, -2.6); L.group.add(band);
      const bl2 = label('Normal range', 3, { bd: '#7be0ad' }); bl2.position.set(x0 + 2.5, y + (toH(bl.band[0]) + toH(bl.band[1])) / 2, -2.4); L.group.add(bl2);
      z.toH = toH;
    } else {
      [[x0 + 8, 2.8, 4], [x0 + 15, 5, 4], [x0 + 21, 2.8, 4]].forEach(function (p) { const sl = addSolid(p[0], p[0] + p[2], y + p[1] - 0.4, y + p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
      lever(bl.controls[0], x0 + 4, y); lever(bl.controls[1], x0 + 10, y + 2.8); lever(bl.controls[2], x0 + 17, y + 5); lever(bl.controls[3], x0 + 23, y + 2.8);
      const g = new T.Group(), core = new T.Mesh(G.ico, emat('#3b1030', '#30060f')); core.scale.setScalar(1.9); g.add(core); z.aura = glow('#ff4d6d', 12, 0.6); g.add(z.aura);
      [-0.6, 0.6].forEach(function (ex) { const e = mesh('sph', '#ffffff'); e.scale.setScalar(0.32); e.position.set(ex, 0.4, 1.6); g.add(e); const p = mesh('sph', '#10202c'); p.scale.setScalar(0.15); p.position.set(ex, 0.4, 1.86); g.add(p); });
      g.position.set(x0 + 14, y + 8.3, -2.5); L.group.add(g); z.bossM = g;
    }
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += boss ? z.hp : 1; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  /* HUNT: find every real answer floating around a wide arena. Decoys drift too; touching one costs
     a life and points, and explains why it is a decoy. */
  function makeHunt(set) {
    const x0 = b.x, y = b.y, wx = x0 + (set.model ? 52 : 44), end = wx + 6;
    addGround(x0, end, y);
    [[x0 + 6, 2.6, 4], [x0 + 13, 4.6, 4], [x0 + 20, 2.6, 4], [x0 + 27, 4.6, 4], [x0 + 34, 2.6, 4], [x0 + 16, 7, 5]].forEach(function (p) { const sl = addSolid(p[0], p[0] + p[2], y + p[1] - 0.4, y + p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
    const z = { kind: 'hunt', x0: x0 + 0.5, x1: wx, done: false, set: set, found: 0, need: set.good.length, errors: 0, toks: [], xa: x0 + 3, xb: wx - 2, y: y, time: 0,
      lanes: shuffle([orbit(x0 + 8, y + 4.4, 1.5, 6, 1), orbit(x0 + 15, y + 6.4, 1.5, 5, -1), orbit(x0 + 22, y + 4.4, 1.5, 7, 1), orbit(x0 + 29, y + 6.4, 1.5, 6, -1),
        orbit(x0 + 36, y + 4.4, 1.5, 5, 1), orbit(x0 + 18.5, y + 8.8, 1.6, 7, -1), ferry(y + 2.4, x0 + 3, x0 + 40, 11), ferry(y + 5.6, x0 + 10, x0 + 33, 9),
        ferry(y + 3.6, x0 + 24, x0 + 42, 7), elev(x0 + 11, y + 2.2, y + 7.4, 6), elev(x0 + 32, y + 2.2, y + 7, 5)]) };
    set.good.forEach(function (t) { z.toks.push(huntTok(z, t, true, null)); });
    set.bad.forEach(function (t) { z.toks.push(huntTok(z, t.text, false, t.explain)); });
    /* calm and readable: two rows, evenly spaced, all bobbing up and down together */
    z.toks = shuffle(z.toks); const gap = (wx - x0 - (set.model ? 15 : 7)) / Math.max(1, z.toks.length - 1);
    z.toks.forEach(function (t, i) { t.hx = x0 + 3.5 + i * gap; t.hy = y + (i % 2 ? 5.2 : 2.4); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    if (set.model) {
      const mx = wx - 5.2; z.model = cellModel(set.model); z.model.home = { x: mx, y: y + 3.6, z: -1.4 }; z.model.g.position.set(mx, y + 3.6, -1.4); L.group.add(z.model.g); L.models.push(z.model);
      const ped = new T.Mesh(G.cyl, emat('#2a4a5a', '#0a2030')); ped.scale.set(2.2, 0.5, 1.2); ped.position.set(mx, y + 0.25, -1.4); L.group.add(ped); ped.add(glow('#9fe0ff', 3, 0.4));
      z.carry = []; z.mx = mx;
    }
    L.zones.push(z); L.total += set.good.length; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  function huntTok(z, text, good, why) {
    const t = { g: new T.Group(), text: text, good: good, why: why, cool: 0, got: false };
    t.gem = new T.Mesh(G.ico, emat('#bfe9ff', '#3a7090')); t.gem.scale.setScalar(0.34); t.g.add(t.gem); t.g.add(glow('#9fe0ff', 2.6, 0.45));
    const lb = label(text, 3.3); lb.position.set(0, 1.1, 1.9); t.g.add(lb); L.group.add(t.g); huntPlace(z, t); return t;
  }
  /* MAZE: a row of walls, each with three doorways at three heights. Only the doorway with the
     correct next step opens; the others are dead ends. */
  function makeMaze(mz) {
    const x0 = b.x, y = b.y, n = mz.steps.length, room = 12.4, first = x0 + 11, end = first + (n - 1) * room + 7;
    addGround(x0, end, y);
    const op = [[0, 2.3], [2.7, 4.9], [5.3, 7.5]].map(function (o) { return [y + o[0], y + o[1]]; });
    const labels = mz.steps.map(function (st) { return st.label; }).concat(mz.extra || []);
    const z = { kind: 'maze', x0: x0 + 0.5, x1: first + (n - 1) * room + 1.4, done: false, errors: 0, err: false, si: 0, mz: mz, walls: [] };
    const st0 = label('Start: ' + mz.start, 4.4, { bg: '#fff8e1', fg: '#10202c', bd: '#10202c' }); st0.position.set(x0 + 4, y + 3.4, -1.5); L.group.add(st0);
    mz.steps.forEach(function (st, k) {
      const wx = first + k * room;
      [[y + 2.3, y + 2.7], [y + 4.9, y + 5.3], [y + 7.5, y + 18]].forEach(function (g) { addSolid(wx, wx + 1.4, g[0], g[1]); L.group.add(box(wx, wx + 1.4, g[0], g[1], 4.6, L.th.top)); });
      [[wx - 6.5, y + 2.7], [wx - 4, y + 5.3]].forEach(function (p) { const sl = addSolid(p[0], wx, p[1] - 0.4, p[1], { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); });
      const pool = shuffle(labels.filter(function (l) { return l !== st.label; })).slice(0, 2);
      const doors = shuffle([{ label: st.label, ok: true }].concat(pool.map(function (l) { return { label: l, ok: false }; }))).map(function (d, i) {
        const o = op[i], sd = addSolid(wx, wx + 1.4, o[0], o[1]), g = new T.Group(), mid = (o[0] + o[1]) / 2;
        const plate = new T.Mesh(G.box, basic('#9fe0ff', 0.3, true)); plate.scale.set(1.4, o[1] - o[0], 4.6); plate.position.set(wx + 0.7, mid, 0); g.add(plate);
        const lb = label(d.label, 3.2, { bd: '#9fe0ff' }); lb.position.set(wx - 1.9, mid + 0.2, -0.9); g.add(lb);
        L.group.add(g); return { d: d, s: sd, g: g, plate: plate, cool: 0 };
      });
      z.walls.push(doors);
    });
    L.zones.push(z); L.total += n; b.x = end; L.cps.push({ x: end - 3, y: y });
  }
  /* SEQUENCE: steps float in mixed-up order. Stand at a step and press E to pick it next. */
  function makeSequence(sq) {
    const x0 = b.x, y = b.y, n = sq.steps.length, order = shuffle(sq.steps.map(function (_, i) { return i; })), wx = x0 + 8 + n * 4.6, end = wx + 5;
    addGround(x0, end, y);
    const z = { kind: 'sequence', x0: x0 + 0.5, x1: wx, done: false, errors: 0, next: 0, sq: sq, toks: [] };
    order.forEach(function (si, k) { z.toks.push(token(x0 + 7 + k * 4.6, y + (k % 2 ? 3.2 : 1.3), sq.steps[si], '#ffd98a', { si: si })); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total++; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  /* WORD BANK: words float above the path. Stand at a word and press E to fill the blank. */
  function makeWordbank(wb) {
    const x0 = b.x, y = b.y, words = shuffle(wb.words), wx = x0 + 8 + words.length * 3.8, end = wx + 5;
    addGround(x0, end, y);
    const z = { kind: 'wordbank', x0: x0 + 0.5, x1: wx, done: false, si: 0, err: false, wb: wb, toks: [] };
    words.forEach(function (w, k) { z.toks.push(token(x0 + 7 + k * 3.8, y + (k % 2 ? 3.2 : 1.3), w, '#9fe0ff', { word: w }, 3.4)); });
    z.gate = addSolid(wx, wx + 1.2, y, y + 18); z.gateMesh = gate(wx, wx + 1.2, y, y + 18); L.group.add(z.gateMesh);
    L.zones.push(z); L.total += wb.sentences.length; b.x = end; L.cps.push({ x: wx + 3, y: y });
  }
  function token(x, y, text, col, extra, w) {
    if (y - b.y > 2) { const sl = addSolid(x - 1.2, x + 1.2, y - 1.1, y - 0.7, { oneWay: true }); L.group.add(box(sl.x0, sl.x1, sl.y0, sl.y1, 3, L.th.top)); }
    const g = new T.Group(), gem = new T.Mesh(G.ico, emat(col, '#3a4a5a')); gem.scale.setScalar(0.38); g.add(gem); g.add(glow(col, 2.4, 0.4));
    const lb = label(text, w || 4.2); lb.position.y = 1.35; g.add(lb); g.position.set(x, y, 0); L.group.add(g);
    return Object.assign({ x: x, y: y, g: g, gem: gem, got: false }, extra);
  }
  function crowd(xa, xb, y, n, col) {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = rnd(xa, xb); pos[i * 3 + 1] = y + rnd(0.4, 9.5); pos[i * 3 + 2] = rnd(-4.5, -1.8); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    L.group.add(new T.Points(geo, new T.PointsMaterial({ size: 0.55, map: FX.glow, color: col, transparent: true, blending: T.AdditiveBlending, depthWrite: false })));
  }
  return b;
}
function bilayer(x0, x1, y0, y1) {
  const g = new T.Group(), core = new T.Mesh(G.box, emat('#b8823e', '#3a2410')); core.scale.set(x1 - x0, y1 - y0, 5); core.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(core);
  /* phospholipid pattern painted on one flat face: two rows of heads with tails between (cheap to draw) */
  if (!FX.lipid) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 64; const k = c.getContext('2d');
    k.fillStyle = '#9a6a30'; k.fillRect(0, 0, 128, 64); k.strokeStyle = '#e8b878'; k.lineWidth = 4;
    [16, 48].forEach(function (y) { k.beginPath(); k.moveTo(24, y - 5); k.lineTo(62, y - 5); k.moveTo(24, y + 5); k.lineTo(62, y + 5); k.moveTo(66, y - 5); k.lineTo(104, y - 5); k.moveTo(66, y + 5); k.lineTo(104, y + 5); k.stroke();
      k.fillStyle = '#f6cf8a'; [14, 114].forEach(function (x) { k.beginPath(); k.arc(x, y, 13, 0, Math.PI * 2); k.fill(); }); });
    FX.lipid = c;
  }
  const t = new T.CanvasTexture(FX.lipid); t.wrapT = T.RepeatWrapping; t.repeat.set(1, Math.max(1, (y1 - y0) / 0.9));
  const face = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: t })); face.scale.set(x1 - x0, y1 - y0, 1); face.position.set((x0 + x1) / 2, (y0 + y1) / 2, 2.51); g.add(face);
  return g;
}
function chartTex(gd, left, W, firstCenter) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 420; const g = c.getContext('2d');
  const px = function (xw) { return (xw - left) / W * 1024; }, v = gd.values, lim = Math.ceil(Math.max.apply(null, v.map(Math.abs)) / 10) * 10;
  const top = 74, bot = 340, py = function (y) { return top + (lim - y) / (2 * lim) * (bot - top); };
  g.fillStyle = 'rgba(8,20,30,0.86)'; g.beginPath(); g.moveTo(20, 4); g.arcTo(1020, 4, 1020, 416, 18); g.arcTo(1020, 416, 4, 416, 18); g.arcTo(4, 416, 4, 4, 18); g.arcTo(4, 4, 1020, 4, 18); g.closePath(); g.fill();
  g.strokeStyle = '#ffd166'; g.lineWidth = 4; g.stroke();
  g.fillStyle = '#ffffff'; g.font = '700 34px "Atkinson Hyperlegible", Arial, sans-serif'; g.textAlign = 'center'; g.fillText(gd.title, 512, 44);
  g.font = '700 22px "Atkinson Hyperlegible", Arial, sans-serif'; g.textAlign = 'right';
  [-lim, -lim / 2, 0, lim / 2, lim].forEach(function (y) { g.strokeStyle = y === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)'; g.lineWidth = y === 0 ? 3 : 2; g.beginPath(); g.moveTo(px(left + 1.7), py(y)); g.lineTo(1000, py(y)); g.stroke(); g.fillStyle = '#d6e4ea'; g.fillText((y > 0 ? '+' : '') + y, px(left + 1.55), py(y) + 8); });
  v.forEach(function (y, i) {
    const cx = px(firstCenter + i * 3.6), bw = 2.0 / W * 1024, t = Math.min(py(y), py(0)), h = Math.abs(py(y) - py(0));
    g.fillStyle = y >= 0 ? '#7fd4ff' : '#ffb09c'; g.fillRect(cx - bw / 2, t, bw, h);
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.font = '700 28px "Atkinson Hyperlegible", Arial, sans-serif';
    g.fillText((y > 0 ? '+' : '') + y + '%', cx, y >= 0 ? t - 10 : t + h + 30);
    g.fillStyle = '#ffd166'; g.font = '700 26px "Atkinson Hyperlegible", Arial, sans-serif'; g.fillText(gd.categories[i], cx, 378);
  });
  g.save(); g.translate(26, (top + bot) / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.font = '700 20px "Atkinson Hyperlegible", Arial, sans-serif'; g.fillStyle = '#d6e4ea'; g.fillText(gd.ylabel, 0, 0); g.restore();
  g.textAlign = 'center'; g.font = '700 22px "Atkinson Hyperlegible", Arial, sans-serif'; g.fillStyle = '#d6e4ea'; g.fillText(gd.xlabel, 512, 408);
  return new T.CanvasTexture(c);
}

/* ---------- activity zones: panel text and what happens each frame ---------- */
function zonePanel(meta, prompt, fig, how) {
  $('qpanel').classList.remove('compact', 'short');
  $('qmeta').textContent = meta; $('qprompt').innerHTML = prompt; $('qfig').innerHTML = fig || ''; $('qopts').innerHTML = ''; $('qfb').textContent = ''; $('qhow').textContent = how || '';
  $('qpanel').hidden = false; Music.setDuck(0.45);
}
function dotsTxt(n) { return '<span class="dots">' + '●'.repeat(Math.max(1, Math.round(n / 2))) + '</span>'; }
function showZone(z) {
  if (z.kind === 'become') {
    const it = z.it, more = it.hereCrowd > it.thereCrowd;
    zonePanel('Become It', 'You are ' + esc(it.you) + '. ' + esc(it.goal), it.hereCrowd == null ? '' :
      '<div class="crowd"><span>' + esc(it.here) + ': <b>' + (more ? 'more' : 'less') + ' crowded</b> with ' + esc(it.what) + ' ' + dotsTxt(it.hereCrowd) + '</span><span>' + esc(it.there) + ': <b>' + (more ? 'less' : 'more') + ' crowded</b> ' + dotsTxt(it.thereCrowd) + '</span></div>',
      (it.hereCrowd == null ? 'Walk up to a doorway and press E.' : 'Pick an opening in the membrane and press E.') + (it.atp ? ' Glowing ATP powers a pump.' : ''));
    setBadge(it.short, it.color);
  } else if (z.kind === 'catch') {
    const c = z.c, cue = c.steps.map(function (st, i) { return i === z.si ? '<b class="cur">' + esc(st.cue) + '</b>' : '<span class="' + (i < z.si ? 'done' : 'todo') + '">' + esc(st.cue) + '</span>'; }).join(' ');
    const built = c.steps.filter(function (st) { return (st.bead != null ? st.bead : st.need) !== ''; }).map(function (st, i) { return i < z.si ? esc(st.bead != null ? st.bead : st.need) : '<span class="todo">_</span>'; }).join(c.sep || ' ');
    zonePanel('Build It: ' + c.short, esc(c.title),
      '<div class="strand"><span>' + esc(c.cueLabel) + ':</span> ' + cue + '</div><div class="strand"><span>' + esc(c.builtLabel) + ':</span> ' + built + '</div>' +
      (c.table ? figHTML({ type: 'table', head: c.table.head, rows: c.table.rows }) : '<div class="rule">' + esc(c.rule) + '</div>'),
      'Jump up to the ' + c.tokenWord + ' that matches the highlighted ' + c.cueWord + ' and press E to grab it (you have 2 seconds after touching it).');
  } else if (z.kind === 'balance') {
    const bl = z.bl, pct = function (v) { return (v - bl.min) / (bl.max - bl.min) * 100; };
    if (!z.done && z.left) { z.v = bl.start; z.hold = 0; z.push = []; } z.left = false;
    zonePanel(bl.kind === 'boss' ? 'Boss: ' + bl.name : 'Balance It', esc(bl.title),
      '<div class="gauge"><div class="band" style="left:' + pct(bl.band[0]) + '%;width:' + (pct(bl.band[1]) - pct(bl.band[0])) + '%"></div><div class="mark" id="gmark"></div></div>' +
      '<div class="strand"><span>' + esc(bl.what) + ':</span> <b id="gval"></b> ' + esc(bl.unit) + ' · normal ' + bl.band[0] + ' to ' + bl.band[1] + '</div>' +
      '<div class="strand"><span>' + (bl.kind === 'boss' ? 'Hold it normal to weaken the boss:' : 'Hold it normal:') + '</span> <b id="ghold"></b>' + (bl.kind === 'boss' ? ' · Boss <b id="ghp"></b>' : '') + '</div>',
      'Walk to a switch and press E. Orange switches raise it; blue switches lower it.');
  } else if (z.kind === 'hunt' && z.model) {
    zonePanel('Build a Cell', esc(z.set.prompt) + '.',
      '<div class="strand"><span>Built:</span> <b>' + z.found + ' of ' + z.need + '</b> ' + '●'.repeat(z.found) + '○'.repeat(z.need - z.found) + ' &nbsp; <span>Carrying:</span> <b>' + (z.carry.length ? z.carry.map(function (c) { return (c.rejected ? '↩ ' : '') + esc(c.t.text); }).join(', ') : 'nothing yet') + '</b></div>' +
      '<div class="rule">An empty cell is waiting at the end of this room. Not every part belongs in it. A part the cell rejects must be carried back to the ↩ spot where you found it before the gate opens.</div>',
      'Touch a part, then press E to pick it up (within 2 seconds; it follows you). Carry parts to the empty cell and press E to build it.');
  } else if (z.kind === 'hunt') {
    zonePanel('Specimen Hunt', esc(z.set.prompt) + '.',
      '<div class="strand"><span>Found:</span> <b>' + z.found + ' of ' + z.need + '</b> ' + '●'.repeat(z.found) + '○'.repeat(z.need - z.found) + '</div><div class="rule">Decoys are mixed in. Choosing one costs 25 points.</div>',
      'Touch an item so it glows, then press E (within 2 seconds) to grab it. The gate opens when you have them all.');
  } else if (z.kind === 'maze') {
    const mz = z.mz, path = [esc(mz.start)].concat(mz.steps.map(function (st, i) { return i < z.si ? esc(st.label) : '<span class="todo">?</span>'; })).join(' → ');
    if (!z.started) { z.started = true; clearTrail(); addBead(mz.start, '#9fe0ff'); }
    zonePanel('Maze', esc(mz.title), '<div class="strand"><span>Your path:</span> ' + path + '</div><div class="rule">Only the doorway with the next level opens. The others are dead ends (25 points).</div>',
      'Walk or jump to a doorway and press E to go through.');
  } else if (z.kind === 'sequence') {
    zonePanel('Sequence', esc(z.sq.title), '<ol class="slots">' + z.sq.steps.map(function (st, i) { return '<li>' + (i < z.next ? '✓ ' + esc(st) : '<span class="blank">?</span>') + '</li>'; }).join('') + '</ol>',
      'Stand at the step that comes next and press E.');
  } else if (z.kind === 'wordbank') {
    const wb = z.wb, done = wb.sentences.slice(0, z.si).map(function (x) { return '<li>✓ ' + esc(x.text.replace('___', x.answer)) + '</li>'; }).join('');
    const cur = z.si < wb.sentences.length ? '<li><b>' + esc(wb.sentences[z.si].text).replace('___', '<span class="blank">______</span>') + '</b></li>' : '';
    zonePanel('Word Bank: sentence ' + Math.min(z.si + 1, wb.sentences.length) + ' of ' + wb.sentences.length, 'Fill in the blank.', '<ul class="slots">' + done + cur + '</ul>', 'Stand at the word that fits and press E.');
  }
}
function linkLine(a, c) {
  const dx = c.x - a.x, dy = c.y - a.y, len = Math.sqrt(dx * dx + dy * dy), m = new T.Mesh(G.box, basic('#7be0ad', 0.7, true));
  m.scale.set(len, 0.12, 0.12); m.position.set((a.x + c.x) / 2, (a.y + c.y) / 2, -0.2); m.rotation.z = Math.atan2(dy, dx); L.group.add(m); burst(c.x, c.y, '#7be0ad');
}
function setBadge(text, col) {
  if (P.badge) { P.m.remove(P.badge); P.badge = null; }
  if (!text) return;
  P.badge = label(text, 1.7, { bd: col }); P.badge.position.y = 2.85; P.badge.add(glow(col, 1.6, 0.5)); P.m.add(P.badge);
}
/* FLIGHT: a reward for finishing a big challenge. Hold jump to fly upward for a few seconds. */
function capeBar() {
  const c = P.cape == null ? 1.5 : P.cape;
  if (!P.capeM) { const g = new T.Group(), bg = new T.Mesh(G.box, basic('#10202c', 0.7)), fg = new T.Mesh(G.box, basic('#ff9f6e')); bg.scale.set(1, 0.12, 0.05); fg.scale.set(1, 0.08, 0.06); g.add(bg); g.add(fg); g.position.y = 2.45; P.m.add(g); P.capeM = g; P.capeF = fg; }
  P.capeM.visible = c < 1.49; P.capeF.scale.x = Math.max(0.001, c / 1.5); P.capeF.position.x = -(1 - c / 1.5) / 2;
  const cp = P.m.userData.cape; if (cp) cp.rotation.x = 0.18 + ((P.capeT = (P.capeT || 0) - 0.016) > 0 ? Math.sin(P.t * 30) * 0.5 + 0.6 : 0);
}
function buildProtein() {
  if (P.prot <= 0) { $('qfb').textContent = ''; toast('Land on solid ground to build another protein platform.', 2); return; }
  P.prot = 0; const x0 = P.x - 1.3, x1 = P.x + 1.3, y1 = P.y - 0.05, sd = addSolid(x0, x1, y1 - 0.35, y1); sd.protein = true;
  const g = new T.Group(), cols = ['#ffd166', '#7be0ad', '#ff9f6e', '#7fd4ff', '#c59cff', '#ff8fb1'];
  for (let i = 0; i < 7; i++) { const bd = new T.Mesh(G.sph, emat(cols[i % 6], '#333333')); bd.scale.setScalar(0.24); bd.position.set(x0 + 0.2 + i * 0.36, y1 - 0.17, 0); g.add(bd); }
  g.add(glow('#ffd166', 3, 0.35)); g.children[g.children.length - 1].position.set(P.x, y1 - 0.2, 0); L.group.add(g);
  L.temps.push({ s: sd, m: g, life: 4 }); P.vy = Math.max(P.vy, 0); beep(760, 0.15, 'triangle', 'click-click, protein built');
  popup(P.x, P.y - 0.4, 'Protein built!', '#ffd166');
}
function nearClue() { return L.clues.find(function (c) { return Math.abs(P.x - c.x) < 1.4 && Math.abs(P.y - c.y) < 1.5; }); }
function nearPortal() { const p = L.portal; return p && Math.abs(P.x - p.x) < 1.8 && Math.abs(P.y - p.y) < 2 ? p : null; }
function codeText() { return L.clues.map(function (c) { return c.choice == null ? '_' : 'ABCDE'[c.choice]; }).join(' · '); }
function openClue(c) {
  const q = c.q; L.active = { clue: c, tried: {} }; P.vx = 0;
  $('qpanel').classList.remove('compact', 'short');
  $('qmeta').textContent = '🔐 Portal clue ' + c.n + ' of ' + L.clues.length + (c.choice != null ? ' · your answer now: ' + 'ABCDE'[c.choice] : '');
  $('qprompt').innerHTML = esc(q.prompt) + (q.stem ? '<span class="stem">' + esc(q.stem) + '</span>' : ''); $('qfig').innerHTML = figHTML(q.figure);
  $('qopts').innerHTML = c.perm.map(function (oi, i) { return '<button type="button" class="opt" data-i="' + i + '"><b>' + 'ABCDE'[i] + '</b> ' + esc(q.options[oi]) + '</button>'; }).join('') + '<button type="button" class="opt pclose" data-close="1">Close (Esc)</button>';
  $('qfb').textContent = ''; $('qhow').textContent = 'Press the letter of your answer. The letter becomes part of the portal code. The portal tells you if the code works.';
  $('qpanel').hidden = false; Music.setDuck(0.45);
}
function clueAnswer(i) {
  const c = L.active.clue; if (i >= c.q.options.length) return;
  c.choice = i; c.lb.material.map = labelTex('Clue ' + c.n + ': ' + 'ABCDE'[i], { bd: '#ffd166' }); c.lb.material.needsUpdate = true; c.scr.material = emat('#ffd166', '#6a5010');
  beep(700, 0.15, 'triangle', 'beep, answer saved'); closeQ(); toast('Answer saved: ' + 'ABCDE'[i] + '. Portal code so far: ' + codeText(), 4);
}
function openPortalPanel() {
  const p = L.portal; L.active = { portal: p, tried: {} }; P.vx = 0;
  const missing = L.clues.filter(function (c) { return c.choice == null; }).length;
  $('qpanel').classList.remove('compact', 'short');
  $('qmeta').textContent = '🌀 Locked portal'; $('qfig').innerHTML = '';
  $('qprompt').innerHTML = 'Code: <span class="pcode">' + codeText() + '</span>';
  $('qopts').innerHTML = (missing ? '' : '<button type="button" class="opt" data-try="1"><b>E</b> Try this code</button>') + '<button type="button" class="opt pclose" data-close="1">Close (Esc)</button>';
  $('qfb').textContent = missing ? 'Find all ' + L.clues.length + ' green clue terminals in this level and answer them. ' + missing + ' still to go.' : '';
  $('qhow').textContent = 'The code is the letters of your clue answers, in order. Wrong letters? Go back to a clue and change your answer.';
  $('qpanel').hidden = false; Music.setDuck(0.45);
}
function tryCode() {
  const p = L.portal; if (L.clues.some(function (c) { return c.choice == null; })) return;
  const right = L.clues.filter(function (c) { return c.perm[c.choice] === c.q.answer; });
  p.tries++;
  if (right.length === L.clues.length) {
    p.open = true; L.clues.forEach(function (c) { record(c.q, p.tries === 1); }); if (p.tries === 1) award('code');
    if (p.tries === 1) { L.first += 0; L.score += 300; }
    p.swirl.material.color.set('#7be0ad'); p.ring.material = emat('#7be0ad', '#1a6a4a'); p.lb.material.map = labelTex('🌀 Portal open: press E', { bd: '#7be0ad' }); p.lb.material.needsUpdate = true;
    [523, 659, 784, 1047].forEach(function (f, k) { setTimeout(function () { beep(f, 0.18, 'triangle', k === 0 ? 'unlock chime, portal open' : null); }, k * 110); });
    closeQ(); burst(p.x, p.y + 2.4, '#7be0ad'); toast('✓ Code accepted! The portal is open. Press E at the portal to go through.', 5);
    showNote({ word: 'Clues solved', note: L.clues.map(function (c) { return 'Clue ' + c.n + ': ' + c.q.explain; }).join(' ') });
    return;
  }
  beep(200, 0.3, 'sawtooth', 'buzz, code not accepted');
  let msg = '✗ Code not accepted. ' + right.length + ' of ' + L.clues.length + ' letters are right.';
  if (p.tries >= 2) { const bad = L.clues.find(function (c) { return c.perm[c.choice] !== c.q.answer; }); msg += ' Hint: clue ' + bad.n + ' is not right yet. ' + (bad.q.hint || ''); }
  else msg += ' Go back to a clue and change your answer.';
  $('qfb').textContent = msg;
}
function zoneTarget(z) {
  if (!z || z.done) return false;
  if (z.kind === 'hunt' && z.model && Math.abs(P.x - z.mx) < 3.6) return true;
  if (z.kind === 'hunt' || z.kind === 'catch') return z.toks.some(function (k) { return k.hot && !k.got; }) || (z.selT > 0 && z.sel && !z.sel.got);
  if (z.kind === 'become') return z.doors.some(function (d) { return d.at; });
  if (z.kind === 'maze') return z.walls[z.si].some(function (d) { return d.at; });
  if (z.kind === 'balance') return true;
  return (z.toks || []).some(function (k) { return !k.got && near(k); });
}
function giveFlight(secs, why) {
  P.fly = secs; P.flyWarn = false;
  if (!P.flyM) { const g = new T.Group(), tail = new T.Mesh(G.cyl, emat('#c8ff7a', '#4a7a10')); tail.scale.set(0.05, 0.9, 0.05); tail.rotation.z = Math.PI / 2; tail.position.set(-0.7, 0.6, 0); g.add(tail);
    const ring = new T.Mesh(G.tor, basic('#c8ff7a', 0.6, true)); ring.scale.setScalar(0.45); ring.rotation.x = Math.PI / 2; ring.position.y = 1.7; g.add(ring); g.add(glow('#c8ff7a', 2.6, 0.45)); P.flyM = g; P.m.add(g); }
  beep(660, 0.5, 'triangle', 'rising chime, flight power'); burst(P.x, P.y + 1, '#c8ff7a');
  setTimeout(function () { toast('FLIGHT POWER! ' + (why || '') + 'Hold jump to fly for ' + secs + ' seconds. Grab the sparks up high!', 6); }, 1200);
}
function setATP(on) {
  P.atp = on;
  if (on && !P.atpM) { P.atpM = glow('#c8ff7a', 1.1, 0.95); P.m.add(P.atpM); }
  if (!on && P.atpM) { P.m.remove(P.atpM); P.atpM = null; }
}
const TOKCOL = { A: '#7fd4ff', U: '#ffd166', G: '#7be0ad', C: '#ffb09c', T: '#c59cff', Stop: '#ff6b6b', 'Release (stop)': '#ff6b6b', 'Stop (UAA)': '#ff6b6b' };
function placeTok(z, t, text) {
  const c = z.c; t.text = text || c.choices[Math.floor(Math.random() * c.choices.length)];
  const col = TOKCOL[t.text] || '#f2c078';
  t.gem.material = emat(col, '#3a3a3a'); t.halo.material.color.set(col);
  t.lb.material.map = labelTex(t.text, { big: t.text.length <= 3, bd: col }); t.lb.material.needsUpdate = true; t.lb.scale.set(t.text.length <= 3 ? 2.3 : 3.3, t.text.length <= 3 ? 1.15 : 1.65, 1);
  t.cool = 0.8;
}
/* Steady, repeating paths so players can learn the timing (no random drifting). */
function orbit(cx, cy, r, T, dir) { return { type: 'orbit', cx: cx, cy: cy, r: r, T: T, dir: dir }; }
function ferry(y, x1, x2, T) { return { type: 'ferry', y: y, x1: x1, x2: x2, T: T }; }
function elev(x, y1, y2, T) { return { type: 'elev', x: x, y1: y1, y2: y2, T: T }; }
function lanePos(l, t) {
  const a = Math.PI * 2 * t / l.T, s = (1 - Math.cos(a)) / 2;
  if (l.type === 'orbit') return { x: l.cx + Math.cos(a * l.dir) * l.r, y: l.cy + Math.sin(a * l.dir) * l.r };
  if (l.type === 'ferry') return { x: l.x1 + (l.x2 - l.x1) * s, y: l.y };
  return { x: l.x, y: l.y1 + (l.y2 - l.y1) * s };
}
function huntPlace(z, t) {
  t.cool = 1.2;
}
function ensureNeed(z) {
  if (z.si >= z.c.steps.length) return;
  const need = z.c.steps[z.si].need;
  if (z.toks.some(function (t) { return t.text === need; })) return;
  const far = z.toks.slice().sort(function (a, c) { return Math.abs(c.x - P.x) - Math.abs(a.x - P.x); })[0]; placeTok(z, far, need); far.cool = 0;
}
function addBead(text, col) {
  const g = new T.Group(), s = new T.Mesh(G.sph, emat(col, '#3a3a3a')); s.scale.setScalar(0.3); g.add(s); g.add(glow(col, 1.6, 0.5));
  const lb = label(text, text.length <= 3 ? 1.5 : 2.4, { big: text.length <= 3, bd: col }); lb.position.y = 0.6; g.add(lb); L.group.add(g); P.trail.push(g);
}
function clearTrail() { P.trail.forEach(function (g) { L.group.remove(g); }); P.trail = []; }
/* forgiving reach: you can choose an item from beside it or from the ground right under it */
function near(t) { const dy = t.y - (P.y + 0.7); return Math.abs(P.x - t.x) < 1.1 && dy < 2.8 && dy > -1.2; }
function selTick(z, dt) {
  if (z.selT > 0) { z.selT -= dt; if (z.sel && (z.sel.got || z.sel.cool > 0)) z.selT = 0;
    if (z.selT > 0 && L.zone === z && !z.sel.hot) { const want = 'Selected: ' + (z.sel.text || '') + '. Press E to grab it.'; if ($('qfb').textContent === '' || /^Selected: /.test($('qfb').textContent)) $('qfb').textContent = want; }
    if (z.selT <= 0 && /^Selected: /.test($('qfb').textContent)) $('qfb').textContent = ''; }
}
function zoneTick(z, dt) {
  if (z.kind === 'become') {
    z.doors.forEach(function (dr) {
      dr.cool -= dt; if (dr.open) return;
      dr.at = !z.done && P.x + HW >= dr.s.x0 - 0.12 && P.x < dr.s.x0 && P.y + PH > dr.s.y0 + 0.15 && P.y < dr.s.y1 - 0.15;
      dr.plate.material = basic(dr.tried ? '#5a6470' : dr.kc, dr.at ? 0.6 : 0.3, true);
      if (dr.at && L.zone === z && !$('qfb').textContent) $('qfb').textContent = 'Press E to go through: ' + dr.d.label;
    });
  } else if (z.kind === 'maze') {
    z.walls.forEach(function (ds, k) { ds.forEach(function (dr) {
      dr.cool -= dt; if (dr.open) return;
      dr.at = !z.done && k === z.si && P.x + HW >= dr.s.x0 - 0.12 && P.x < dr.s.x0 && P.y + PH > dr.s.y0 + 0.15 && P.y < dr.s.y1 - 0.15;
      dr.plate.material = basic(dr.tried ? '#5a6470' : '#9fe0ff', dr.at ? 0.6 : 0.3, true);
      if (dr.at && L.zone === z && !$('qfb').textContent) $('qfb').textContent = 'Press E to go through: ' + dr.d.label;
    }); });
  } else if (z.kind === 'balance') {
    z.levers.forEach(function (lv) { lv.cool -= dt; lv.knob.rotation.y += dt; });
    if (z.done) return;
    if (L.zone !== z) { z.left = true; return; }
    const bl = z.bl, boss = bl.kind === 'boss';
    if (boss) z.v += z.phase * bl.push * dt;
    else { z.v += bl.drift * dt; z.evT += dt; if (z.evT >= bl.event.every) { z.evT = 0; z.push.push({ d: bl.event.delta, t: 2 }); toast(bl.event.msg, 2.5); beep(500, 0.15, 'triangle', 'gulp, glucose rising'); } }
    z.push = z.push.filter(function (p) { const k = Math.min(dt, p.t); z.v += p.d * k / 2; p.t -= dt; return p.t > 0; });
    z.v = Math.max(bl.min, Math.min(bl.max, z.v));
    if (z.elev) { const ny = z.y + z.toH(z.v), dy = ny - z.elev.s.y1; z.elev.s.y0 += dy; z.elev.s.y1 += dy; z.elev.g.position.y += dy; if (P.ground === z.elev.s) P.y += dy; }
    if (boss) { z.aura.material.color.set(z.v > bl.set ? '#ff4d6d' : '#5fb8ff'); z.bossM.position.y = z.y + 8.3 + Math.sin(P.t * 2) * 0.4; z.bossM.rotation.y = Math.sin(P.t) * 0.4; }
    const inBand = z.v >= bl.band[0] && z.v <= bl.band[1];
    z.hold = inBand ? z.hold + dt : Math.max(0, z.hold - dt * 0.5);
    z.hurtT -= dt;
    if ((z.v > bl.danger[1] || z.v < bl.danger[0]) && z.hurtT <= 0) { z.hurtT = 2.5; z.danger = true; $('qfb').textContent = '✗ ' + (z.v > bl.danger[1] ? bl.tooHigh : bl.tooLow); hurt(true); }
    if (z.hold >= bl.hold) {
      z.hold = 0;
      if (boss) {
        z.hp--; L.score += 150; record({ id: bl.id + '.' + z.hp, code: bl.code }, !z.danger && !z.wrong); if (!z.danger && !z.wrong) { L.first++; L.streak++; }
        z.danger = false; z.wrong = 0; z.bossM.scale.setScalar(0.45 + 0.55 * z.hp / bl.hp); popup(z.bossM.position.x, z.bossM.position.y - 2, 'Balanced!', '#7be0ad'); burst(z.bossM.position.x, z.bossM.position.y, '#7be0ad'); beep(880, 0.25, 'sine', 'chime, balance restored');
        z.phase = -z.phase; toast(z.phase > 0 ? 'The Imbalance is heating the body up!' : 'The Imbalance is chilling the body!', 3);
      }
      if (!boss || z.hp <= 0) {
        z.done = true; z.gate.off = true; z.gateMesh.visible = false; if (z.bossM) z.bossM.visible = false;
        if (!boss) { record({ id: bl.id, code: bl.code }, !z.danger); if (!z.danger) { L.first++; L.streak++; } L.score += 200; }
        toast('✓ ' + bl.explain, 7); beep(990, 0.4, 'triangle', 'fanfare, balanced'); closeQ(); hud(); return;
      }
    }
    const gm = $('gmark'); if (gm) { gm.style.left = Math.max(0, Math.min(100, (z.v - bl.min) / (bl.max - bl.min) * 100)) + '%'; $('gval').textContent = boss ? z.v.toFixed(1) : Math.round(z.v); $('ghold').textContent = z.hold.toFixed(1) + ' of ' + bl.hold + ' s'; if ($('ghp')) $('ghp').textContent = '■'.repeat(z.hp) + '□'.repeat(bl.hp - z.hp); }
  } else if (z.kind === 'hunt') {
    if (z.done) return;
    z.time += dt; selTick(z, dt);
    if (z.model && z.carry.length) returnStep(z);
    if (z.model && L.zone === z && Math.abs(P.x - z.mx) < 3.6) {
      if (!z.metCell) { z.metCell = true; toast(z.carry.length ? 'Press E to put your parts into the cell.' : 'This cell is empty! Go back, grab its parts with E, and carry them here.', 4); }
      if (z.carry.length && !$('qfb').textContent) $('qfb').textContent = 'Press E to put your ' + z.carry.length + (z.carry.length === 1 ? ' part' : ' parts') + ' into the cell.';
    }
    if (!z.started && L.zone === z) { z.started = true; if (z.set.clearTrail) clearTrail(); }
    z.toks.forEach(function (t) {
      if (t.got) return; t.cool -= dt; t.x = t.hx; t.y = t.hy + Math.sin(Math.PI * 2 * z.time / 4.5) * 0.9; t.g.position.set(t.x, t.y, 0); t.gem.rotation.y += dt;
      t.hot = L.zone === z && t.cool <= 0 && Math.abs(P.x - t.x) < 1.1 && Math.abs(P.y + 0.7 - t.y) < 1.3; if (t.hot && !t.got) { z.sel = t; z.selT = 2.5; } t.g.scale.setScalar(t.hot || (z.sel === t && z.selT > 0) ? 1.3 : 1);
    });
  } else if (z.kind === 'catch') {
    if (z.done) return;
    z.time += dt; selTick(z, dt);
    if (!z.started && L.zone === z) { z.started = true; if (z.c.clearTrail) { clearTrail(); toast(z.c.startMsg || '', 4); } }
    z.toks.forEach(function (t) {
      t.cool -= dt; t.x = t.hx; t.y = t.hy + Math.sin(Math.PI * 2 * z.time / 4.5) * 0.9; t.g.position.set(t.x, t.y, 0); t.gem.rotation.y += dt;
      t.hot = L.zone === z && t.cool <= 0 && Math.abs(P.x - t.x) < 1.1 && Math.abs(P.y + 0.7 - t.y) < 1.3; if (t.hot && !t.got) { z.sel = t; z.selT = 2.5; } t.g.scale.setScalar(t.hot || (z.sel === t && z.selT > 0) ? 1.3 : 1);
    });
  } else {
    (z.toks || []).forEach(function (t) { if (t.got) { t.gem.rotation.y += dt; return; } t.gem.rotation.y += dt * 2; t.g.scale.setScalar(near(t) && L.zone === z ? 1.15 : 1); });
  }
}
/* wrong choices cost points and give a hint; only hazards cost energy */
const PEN_SEC = 3; /* each wrong choice adds this many seconds to the speedrun time */
function miss() { L.streak = 0; L.score = Math.max(0, L.score - 25); L.pen += PEN_SEC; L.wrongs++; L.shake = 0.15; popup(P.x, P.y + 1.2, '-25  +' + PEN_SEC + 's', '#ffb09c'); hudTime(true); beep(160, 0.3, 'sawtooth', 'low buzz, not correct'); hud(); }
function huntPick(z, t) {
  if (z.model) {
    t.got = true; t.g.visible = false; addBead(t.text, '#9fe0ff'); z.carry.push({ t: t, bead: P.trail[P.trail.length - 1] });
    burst(t.x, t.y, '#9fe0ff'); beep(700, 0.12, 'sine', 'pop, picked up a part');
    toast('Picked up: ' + t.text + '. Carry it to the empty cell.', 2.5); showZone(z); return;
  }
  if (t.good) {
    t.got = true; t.g.visible = false; z.missRun = 0; z.found++;
    if (z.model) flyPart(z.model, t.text, t.x, t.y); else if (z.set.trail) addBead(t.text, '#9fe0ff'); L.first++; L.streak++; L.score += 80; record({ code: z.set.code }, true);
    popup(t.x, t.y, '+80', '#7be0ad'); burst(t.x, t.y, '#9fe0ff'); beep(700 + z.found * 60, 0.15, 'sine', 'chime, found one'); toast('✓ ' + t.text, 2.5);
    if (z.found >= z.need) {
      z.done = true; z.gate.off = true; z.gateMesh.visible = false; z.toks.forEach(function (k) { k.g.visible = false; }); closeQ();
      if (z.model) { z.model.finishAt = 1.0; toast('✓ Your ' + z.model.name + ' is complete! Walk through the gate to see it up close.', 5); }
      else toast('✓ You found them all. The gate is open.', 4);
    } else showZone(z);
    hud();
  } else {
    z.errors++; record({ code: z.set.code }, false); t.cool = 1.2;
    $('qfb').textContent = '✗ Decoy: "' + t.text + '". ' + t.why; miss();
    z.missRun = (z.missRun || 0) + 1; if (z.missRun >= 2) { const gd = z.toks.filter(function (k) { return k.good && !k.got; }).sort(function (a, c) { return Math.abs(a.x - P.x) - Math.abs(c.x - P.x); })[0]; if (gd) { helpGlow(gd.g); $('qfb').textContent += ' A real one is glowing gold.'; } }
  }
}
function catchPick(z, t) {
  const st = z.c.steps[z.si];
  if (t.text === st.need) {
    if (!z.stepErr) { L.first++; L.streak++; L.score += 80 + Math.min(L.streak, 5) * 10; } else L.score += 30;
    record({ id: z.c.id + '.' + z.si, code: z.c.code }, !z.stepErr); z.missRun = 0; unhelp(t.g);
    const bead = st.bead != null ? st.bead : st.need; if (bead && bead !== 'Stop') addBead(bead, TOKCOL[bead] || '#f2c078');
    popup(t.x, t.y, '+' + (z.stepErr ? 30 : 80), '#7be0ad'); burst(t.x, t.y, TOKCOL[t.text] || '#f2c078'); beep(640 + z.si * 60, 0.15, 'sine', 'chime, matched'); z.stepErr = false; z.si++; placeTok(z, t);
    if (z.si >= z.c.steps.length) { z.done = true; z.gate.off = true; z.gateMesh.visible = false; z.toks.forEach(function (k) { k.g.visible = false; }); toast('✓ ' + z.c.explain, 7); closeQ(); hud(); giveFlight(20); return; }
    ensureNeed(z); showZone(z); hud();
  } else {
    z.stepErr = true; z.errors++; t.cool = 1.2; $('qfb').textContent = '✗ ' + (z.c.wrong && z.c.wrong[t.text] ? z.c.wrong[t.text] : z.c.hint); miss();
    z.missRun = (z.missRun || 0) + 1; if (z.missRun >= 2) { const nd = z.toks.find(function (k) { return k.text === st.need; }); if (nd) { helpGlow(nd.g); $('qfb').textContent += ' The right one is glowing gold.'; } }
  }
}
function deliver(z) {
  const md = z.model, list = z.carry.filter(function (c) { return !c.rejected; }); let good = 0, bad = [];
  z.carry = z.carry.filter(function (c) { return c.rejected; });
  if (!list.length) { sortOutMsg(z); return; }
  list.forEach(function (c, i) {
    const t = c.t;
    if (t.good) { P.trail = P.trail.filter(function (g) { return g !== c.bead; }); L.group.remove(c.bead); const wp = c.bead.position, bx = wp.x, by = wp.y, lv = L; setTimeout(function () { if (L === lv) flyPart(md, t.text, bx, by, t); }, i * 220);
      good++; z.found++; L.score += 80; L.first++; L.streak++; record({ code: z.set.code }, true); }
    else { /* SORT IT OUT: the cell rejects it, and it stays with you until you put it back where you found it */
      bad.push(t); z.errors++; record({ code: z.set.code }, false); c.rejected = true; z.carry.push(c); if (c.bead.children[0]) c.bead.children[0].material = emat('#ff8a70', '#4a1a10');
      t.ret = label('↩ Return: ' + t.text, 3.2, { bd: '#ff8a70' }); t.ret.position.set(t.hx, t.hy + 1.6, 1.9); L.group.add(t.ret); }
  });
  if (z.found < z.need) showZone(z);
  if (bad.length) {
    const t = bad[0]; $('qfb').textContent = '✗ "' + t.text + '" does not belong in this cell. ' + t.why + (bad.length > 1 ? ' (' + (bad.length - 1) + ' more did not fit.)' : '') + ' Carry it back to the ↩ spot where you found it.';
    bad.forEach(function () { miss(); }); z.missRun = (z.missRun || 0) + bad.length;
    if (z.missRun >= 2) { const gd = z.toks.filter(function (k) { return k.good && !k.got; })[0]; if (gd) { helpGlow(gd.g); $('qfb').textContent += ' A part that fits is glowing gold.'; } }
  } else z.missRun = 0;
  if (good) { popup(md.home.x, md.home.y + 3, '+' + good * 80, '#7be0ad'); toast('✓ ' + good + (good === 1 ? ' part fits!' : ' parts fit!') + ' Built ' + z.found + ' of ' + z.need + '.', 3); }
  if (z.found >= z.need) { if (z.carry.length) sortOutMsg(z); else buildDone(z, 0.6 + list.length * 0.22 + 0.7); }
  else if (z.carry.length && !bad.length) sortOutMsg(z);
  hud();
}
function buildDone(z, delay) { const md = z.model; z.done = true; z.gate.off = true; z.gateMesh.visible = false; z.toks.forEach(function (k) { k.g.visible = false; if (k.ret) { L.group.remove(k.ret); k.ret = null; } }); md.finishAt = delay; closeQ();
  toast('✓ Your ' + md.name + ' is complete! The gate is open.', 5); }
function sortOutMsg(z) { const r = z.carry.filter(function (c) { return c.rejected; }); if (!r.length) return;
  showZone(z); $('qfb').textContent = (z.found >= z.need ? 'The cell is built, but you are still holding ' : 'You are still holding ') + r.map(function (c) { return '"' + c.t.text + '"'; }).join(', ') + '. ' + (r[0].t.why ? r[0].t.why + ' ' : 'It does not belong in this cell. ') + 'Carry it back to the glowing ↩ spot where you found it.';
  toast('Sort it out: put back the parts that do not belong.', 3); }
/* walking into a ↩ spot puts that wrong part back where it came from */
function returnStep(z) {
  z.carry.slice().forEach(function (c) { if (!c.rejected) return; const t = c.t, hy = t.hy + Math.sin(Math.PI * 2 * z.time / 4.5) * 0.9;
    if (t.ret) t.ret.position.y = hy + 1.6;
    if (Math.abs(P.x - t.hx) < 1.2 && Math.abs(P.y + 0.7 - hy) < 1.6) {
      z.carry = z.carry.filter(function (q) { return q !== c; }); P.trail = P.trail.filter(function (g) { return g !== c.bead; }); L.group.remove(c.bead);
      if (t.ret) { L.group.remove(t.ret); t.ret = null; } t.got = false; t.g.visible = true; t.cool = 2;
      burst(t.hx, hy, '#ffb09c'); beep(520, 0.12, 'sine', 'soft pop, part returned'); toast('↩ Put back: ' + t.text + '. Good sorting!', 2.5);
      if (z.found >= z.need && !z.carry.some(function (q) { return q.rejected; })) buildDone(z, 0.4); else showZone(z); } }); }
function zoneAct(z) {
  if (z.done) return;
  if (z.kind === 'become') {
    const dr = z.doors.find(function (d) { return d.at && !d.open; });
    if (!dr) { $('qfb').textContent = 'Walk up to an opening in the membrane, then press E.'; return; }
    if (dr.cool > 0) return;
    const d = dr.d;
    if (!d.ok) { dr.cool = 1; dr.tried = true; z.errors++; P.vx = -6; $('qfb').textContent = '✗ ' + d.why; miss(); if (z.errors >= 2) { const okd = z.doors.find(function (q) { return q.d.ok; }); helpGlow(okd.g); okd.g.userData.help.position.set(okd.s.x0 + 0.7, (okd.s.y0 + okd.s.y1) / 2, 1); $('qfb').textContent += ' The right opening is glowing gold.'; } return; }
    if (d.kind === 'pump' && !P.atp) { P.vx = -5; $('qfb').textContent = 'The pump needs energy. Grab the glowing ATP first.'; beep(300, 0.15, 'triangle', 'soft tone, needs energy'); return; }
    if (d.kind === 'pump') { setATP(false); toast('ATP used: energy pushed you to the more crowded side.', 3); }
    dr.open = true; dr.s.off = true; dr.g.visible = false; z.done = true; setBadge(null);
    if (!z.errors) { L.first++; L.streak++; L.score += 150; } else L.score += 50;
    record({ id: z.it.id, code: z.it.code }, !z.errors); beep(880, 0.25, 'sine', 'chime, correct'); toast('✓ ' + z.it.explain, 6); hud(); closeQ();
    return;
  }
  if (z.kind === 'maze') {
    const dr = z.walls[z.si].find(function (d) { return d.at && !d.open; });
    if (!dr) { $('qfb').textContent = 'Walk up to a doorway, then press E.'; return; }
    if (dr.cool > 0) return;
    const st = z.mz.steps[z.si];
    if (!dr.d.ok) { dr.cool = 1; dr.tried = true; z.err = true; z.errors++; P.vx = -6; record({ id: z.mz.id + '.' + z.si, code: z.mz.code }, false); $('qfb').textContent = '✗ Dead end! "' + dr.d.label + '" does not come next. ' + st.hint; miss(); z.missRun = (z.missRun || 0) + 1; if (z.missRun >= 2) { const okd = z.walls[z.si].find(function (q) { return q.d.ok; }); helpGlow(okd.g); okd.g.userData.help.position.set(okd.s.x0 + 0.7, (okd.s.y0 + okd.s.y1) / 2, 1); $('qfb').textContent += ' The right doorway is glowing gold.'; } return; }
    dr.open = true; dr.s.off = true; dr.g.visible = false;
    if (!z.err) { L.first++; L.streak++; L.score += 100; } else L.score += 40;
    record({ id: z.mz.id + '.' + z.si, code: z.mz.code }, !z.err); addBead(st.label, '#9fe0ff'); burst(dr.s.x0, (dr.s.y0 + dr.s.y1) / 2, '#9fe0ff');
    beep(600 + z.si * 90, 0.18, 'sine', 'chime, path opens'); toast('✓ ' + st.why, 4); z.err = false; z.missRun = 0; z.si++;
    if (z.si >= z.mz.steps.length) { z.done = true; toast('✓ ' + z.mz.explain, 7); closeQ(); giveFlight(20); } else showZone(z);
    hud(); return;
  }
  if (z.kind === 'hunt' && z.model && Math.abs(P.x - z.mx) < 3.6) {
    if (!z.carry.length) { $('qfb').textContent = 'This cell is empty! Go back and grab its parts (press E at a part), then bring them here.'; toast('The cell needs its parts. Go back and find them!', 3); return; }
    return deliver(z);
  }
  if (z.kind === 'hunt' || z.kind === 'catch') {
    let t = z.toks.filter(function (k) { return k.hot && !k.got; }).sort(function (a, c) { return Math.abs(a.x - P.x) - Math.abs(c.x - P.x); })[0];
    if (!t && z.sel && z.selT > 0 && !z.sel.got) t = z.sel;
    z.selT = 0;
    if (!t) { $('qfb').textContent = 'Touch an item so it glows, then press E. You have 2 seconds, so you can press E after you land.'; return; }
    return z.kind === 'hunt' ? huntPick(z, t) : catchPick(z, t);
  }
  if (z.kind === 'balance') {
    const lv = z.levers.find(function (l) { const wp = new T.Vector3(); l.g.getWorldPosition(wp); return Math.abs(P.x - wp.x) < 1.3 && Math.abs(P.y - wp.y) < 1.6; });
    if (!lv) { $('qfb').textContent = 'Walk up to a switch, then press E.'; return; }
    if (lv.cool > 0) return; lv.cool = 0.8;
    const bl = z.bl, d = lv.c.delta;
    if (bl.kind === 'boss' && ((d > 0 && z.v > bl.set + 0.2) || (d < 0 && z.v < bl.set - 0.2))) { z.wrong++; $('qfb').textContent = '✗ ' + (d > 0 ? bl.wrongHot : bl.wrongCold); beep(200, 0.2, 'sawtooth', 'buzz, wrong direction'); }
    else { $('qfb').textContent = ''; beep(d > 0 ? 520 : 760, 0.12, 'triangle', d > 0 ? 'click, raising' : 'click, lowering'); }
    z.push.push({ d: d, t: 1.5 }); lv.knob.scale.setScalar(0.42); setTimeout(function () { lv.knob.scale.setScalar(0.3); }, 200);
    return;
  }
  const t = (z.toks || []).find(function (k) { return !k.got && near(k); });
  if (!t) { $('qfb').textContent = 'Walk up to a glowing ' + (z.kind === 'sequence' ? 'step' : 'word') + ', then press E.'; return; }
  if (z.kind === 'sequence') {
    if (t.si === z.next) {
      t.got = true; z.missRun = 0; unhelp(t.g); z.next++; beep(560 + z.next * 110, 0.15, 'sine', 'chime, step correct'); showZone(z);
      if (z.sq.loop) { t.gem.material = emat('#7be0ad', '#2f7a50'); t.g.scale.setScalar(1); if (z.prevTok) linkLine(z.prevTok, t); z.prevTok = t; if (!z.firstTok) z.firstTok = t; if (z.next >= z.sq.steps.length) linkLine(t, z.firstTok); }
      else t.g.visible = false;
      if (z.next >= z.sq.steps.length) {
        z.done = true; z.gate.off = true; z.gateMesh.visible = false;
        if (!z.errors) { L.first++; L.streak++; L.score += 150; } else L.score += 50;
        record({ id: z.sq.id, code: z.sq.code }, !z.errors); toast('✓ ' + z.sq.explain, 6); hud(); closeQ();
      }
    } else { z.errors++; z.missRun = (z.missRun || 0) + 1; $('qfb').textContent = '✗ Not yet. ' + z.sq.hint; miss(); if (z.missRun >= 2) { const nx = z.toks.find(function (k) { return k.si === z.next; }); if (nx) { helpGlow(nx.g); $('qfb').textContent += ' The next step is glowing gold.'; } } }
    return;
  }
  const sen = z.wb.sentences[z.si];
  if (t.word === sen.answer) {
    t.got = true; t.g.visible = false; z.missRun = 0;
    if (!z.err) { L.first++; L.streak++; L.score += 100; } else L.score += 40;
    record({ id: z.wb.id + '.' + z.si, code: sen.code }, !z.err); beep(880, 0.2, 'sine', 'chime, correct'); toast('✓ ' + sen.explain, 4);
    z.si++; z.err = false;
    if (z.si >= z.wb.sentences.length) { z.done = true; z.gate.off = true; z.gateMesh.visible = false; closeQ(); } else showZone(z);
    hud();
  } else { z.err = true; z.missRun = (z.missRun || 0) + 1; $('qfb').textContent = '✗ "' + t.word + '" does not fit this sentence. Read it again and try another word.'; miss(); if (z.missRun >= 2) { const rw = z.toks.find(function (k) { return !k.got && k.word === sen.answer; }); if (rw) { helpGlow(rw.g); $('qfb').textContent += ' The word that fits is glowing gold.'; } } }
}
function doorText(d) {
  d.label.material.map = labelTex('Collected ' + d.got + ' of ' + d.need); d.label.material.needsUpdate = true;
}
/* ---------- REAL EARTH CREATURES (used instead of the cell-world enemies in Earth-biome levels) ---------- */
const FOES = {
  jelly: { name: 'jellyfish', stomp: false, msg: 'Stung by a jellyfish! Its tentacles are lined with stinging cells. Swim around it.' },
  shark: { name: 'reef shark', stomp: false, msg: 'A reef shark bumped you! Predators patrol the reef. Wait in the coral until it passes.' },
  angler: { name: 'anglerfish', stomp: false, msg: 'An anglerfish snapped at you! Its glowing lure is lit by bioluminescent bacteria living inside it. Keep your distance.' },
  atolla: { name: 'alarm jellyfish', stomp: false, msg: 'Stung by an Atolla jellyfish! When attacked, it flashes a ring of blue light, like a burglar alarm, to call bigger predators.' },
  eel: { name: 'moray eel', stomp: false, msg: 'A moray eel lunged from its hole! Morays are ambush predators. Swim past while it is hiding.' }
};
function foeMesh(look) {
  const g = new T.Group();
  if (look === 'jelly') {
    const bell = new T.Mesh(new T.SphereGeometry(0.55, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: '#ffb3e0', emissive: '#6a2a5a', transparent: true, opacity: 0.75 })); g.add(bell);
    for (let i = 0; i < 6; i++) { const t = new T.Mesh(G.cyl, emat('#ffc8ea', '#5a2a4a')); t.scale.set(0.03, 0.75, 0.03); t.position.set(Math.cos(i) * 0.3, -0.45, Math.sin(i) * 0.3); g.add(t); }
    g.add(glow('#ff9fdf', 2.4, 0.45)); g.userData.tent = g.children.slice(1, 7);
  } else if (look === 'shark') {
    const M = emat('#7a8a9a', '#1a2028'), body = new T.Mesh(G.sph, M); body.scale.set(1.9, 0.5, 0.5); g.add(body);
    const belly = new T.Mesh(G.sph, emat('#e8ecef', '#2a2a2a')); belly.scale.set(1.6, 0.3, 0.42); belly.position.y = -0.18; g.add(belly);
    const fin = new T.Mesh(G.cone, M); fin.scale.set(0.35, 0.6, 0.12); fin.position.set(0.1, 0.55, 0); fin.rotation.z = -0.3; g.add(fin);
    const tail = new T.Mesh(G.cone, M); tail.scale.set(0.4, 0.7, 0.1); tail.position.set(-1.9, 0.2, 0); tail.rotation.z = 0.9; g.add(tail);
    const tail2 = tail.clone(); tail2.position.y = -0.15; tail2.rotation.z = 2.3; g.add(tail2);
    const eye = new T.Mesh(G.sph, emat('#10202c', '#000000')); eye.scale.setScalar(0.08); eye.position.set(1.35, 0.1, 0.42); g.add(eye);
  } else if (look === 'angler') {
    const M = emat('#2a2630', '#0a080c'), body = new T.Mesh(G.sph, M); body.scale.set(0.9, 0.75, 0.6); g.add(body);
    const jaw = new T.Mesh(G.sph, emat('#3a3440', '#100c14')); jaw.scale.set(0.7, 0.35, 0.55); jaw.position.set(0.35, -0.35, 0); g.add(jaw);
    for (let i = 0; i < 6; i++) { const t = new T.Mesh(G.cone, emat('#f4f0e4', '#6a6a6a')); t.scale.set(0.04, 0.14, 0.04); t.position.set(0.55 + i * 0.07, -0.18, (i % 2 ? 0.2 : -0.2) + 0.25); t.rotation.z = Math.PI; g.add(t); }
    const rod = new T.Mesh(G.cyl, M); rod.scale.set(0.03, 0.55, 0.03); rod.position.set(0.45, 0.95, 0); rod.rotation.z = -0.7; g.add(rod);
    const lure = new T.Mesh(G.sph, basic('#bff6ff')); lure.scale.setScalar(0.13); lure.position.set(0.85, 1.25, 0); lure.add(glow('#7fe8ff', 6, 0.9, false)); g.add(lure); g.userData.lure = lure;
    const tail = new T.Mesh(G.cone, M); tail.scale.set(0.35, 0.5, 0.08); tail.position.set(-0.95, 0, 0); tail.rotation.z = Math.PI / 2; g.add(tail);
    const eye = new T.Mesh(G.sph, basic('#d8e8f0')); eye.scale.setScalar(0.07); eye.position.set(0.55, 0.25, 0.4); g.add(eye);
  } else if (look === 'atolla') {
    const bell = new T.Mesh(new T.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: '#8a1a2a', emissive: '#3a0610' })); g.add(bell);
    const ring = new T.Mesh(G.tor, new T.MeshBasicMaterial({ color: '#3fa8ff', transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false, fog: false })); ring.scale.set(0.62, 0.62, 0.3); ring.rotation.x = Math.PI / 2; g.add(ring); g.userData.ring = ring;
    for (let i = 0; i < 8; i++) { const t = new T.Mesh(G.cyl, emat('#a82a3a', '#3a0610')); t.scale.set(0.025, 0.6, 0.025); t.position.set(Math.cos(i * 0.8) * 0.5, -0.5, Math.sin(i * 0.8) * 0.5); g.add(t); }
    g.add(glow('#3fa8ff', 4.5, 0.55, false));
  } else if (look === 'eel') {
    const M = emat('#6a8a3a', '#1a2a0a'); for (let i = 0; i < 5; i++) { const s = new T.Mesh(G.sph, M); s.scale.set(0.42 - i * 0.04, 0.42 - i * 0.04, 0.42 - i * 0.04); s.position.y = -i * 0.5; g.add(s); }
    const jaw = new T.Mesh(G.sph, emat('#c8d87a', '#2a3a0a')); jaw.scale.set(0.3, 0.12, 0.3); jaw.position.set(0, -0.12, 0.25); g.add(jaw);
    [-0.15, 0.15].forEach(function (ex) { const e = new T.Mesh(G.sph, emat('#ffe08a', '#6a5010')); e.scale.setScalar(0.08); e.position.set(ex, 0.12, 0.36); g.add(e); });
  }
  return g;
}
/* ---------- DIGGING helpers ---------- */
function closeSlab(x1) {
  const sl = L.slab; if (!sl) return; L.slab = null;
  addSolid(sl.x0, x1, sl.yTop - 1.5, sl.yTop + 30); L.group.add(box(sl.x0, x1, sl.yTop - 1.5, sl.yTop + 16, 7.4, sl.rock));
  for (let x = sl.x0 + 1; x < x1 - 1; x += rnd(2.5, 5)) { const st = new T.Mesh(G.cone || G.oct, emat('#6a5a48', '#140e08')); st.scale.set(0.35, rnd(0.6, 1.4), 0.35); st.rotation.x = Math.PI; st.position.set(x, sl.yTop - 1.8, 2.6); L.group.add(st); }
}
function digTile(x0, x1, y0, y1, color) {
  const s = addSolid(x0, x1, y0, y1); s.dig = true; const col = color || '#b08a5a';
  const m = box(x0 + 0.03, x1 - 0.03, y0 + 0.03, y1 - 0.03, 7.2, col); L.group.add(m);
  const crack = new T.Mesh(G.box, basic('#3a2a1a', 0.55)); crack.scale.set((x1 - x0) * 0.5, 0.06, 0.05); crack.rotation.z = rnd(-0.6, 0.6); crack.position.set((x0 + x1) / 2, (y0 + y1) / 2, 3.62); L.group.add(crack);
  s.digM = [m, crack]; s.col = col; return s;
}
function breakTile(t) {
  t.off = true; t.digM.forEach(function (m) { m.visible = false; }); if (P.ground === t) P.ground = null;
  if (!S.set.low) for (let i = 0; i < 6; i++) { const g = glow(t.col, 0.8, 0.9); g.position.set((t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2, 0.8); L.group.add(g); const a = rnd(0, 6.3); L.fx.push({ o: g, t: 0, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3 + 2, life: 0.5 }); }
  beep(140 + Math.random() * 60, 0.08, 'sawtooth');
  L.scans.forEach(function (k) {
    if (!k.buried || k.buried.some(function (q) { return !q.off; })) return;
    k.buried = null; k.g.visible = k.ring.visible = k.nm.visible = true; k.tag.visible = false; burst(k.x, k.y + 1, '#f4ecd8');
    popup(k.x, k.y + 2, 'Fossil uncovered!', '#ffd166'); toast('🦴 Fossil uncovered: ' + k.sc.name + '. Press E to study it.', 3.5); beep(880, 0.25, 'triangle', 'chime, fossil uncovered');
  });
}
/* drill: hold down on soft rock to dig down; push sideways into soft rock to dig across. Hard rock can't be drilled. */
function digStep(dt, ax) {
  if (L.active) { P.digT = 0; return; }
  if (!L.toldDig && L.digHint != null && (Math.abs(P.x - L.digHint) < 8 || L.scans.some(function (k) { return k.buried && Math.abs(P.x - k.x) < 6; }))) { L.toldDig = true; toast('⛏️ Burrow drill! Hold Down (or S) to drill through soft, cracked rock. Push sideways into it to drill across. Smooth hard rock can\'t be drilled.', 7); }
  let t = null;
  if (keys.duck && P.ground && P.ground.dig && !P.ground.off) t = P.ground;
  else if (ax) { const fx = P.x + ax * (HW + 0.15), fy = P.y + 0.6; t = L.solids.find(function (q) { return q.dig && !q.off && fx > q.x0 && fx < q.x1 && fy > q.y0 && fy < q.y1; }); }
  if (!t) { P.digT = 0; return; }
  P.digT = (P.digT || 0) + dt; if (!S.set.low && Math.random() < dt * 20) { const g = glow('#ffd8a0', 0.5, 0.9); g.position.set(P.x + (keys.duck ? 0 : ax * 0.6), P.y + (keys.duck ? 0 : 0.6), 0.9); L.group.add(g); L.fx.push({ o: g, t: 0, vx: rnd(-2, 2), vy: rnd(1, 3), life: 0.3 }); }
  if (P.digT > 0.28) { breakTile(t); P.digT = 0; }
}
const _cv = new T.Vector3();
function caveSpot() { const ov = $('caveDark'); if (!ov) return; ov.style.opacity = L.models && L.models.some(function (md) { return md.done && Math.abs(md.home.x - P.x) < 16 && Math.abs(md.home.y - P.y) < 12; }) ? 0.3 : 1; /* the dark edges lift near a finished, glowing cell */ _cv.set(P.x, P.y + 0.8, 0).project(cam); const x = (_cv.x + 1) * 50, y = (1 - _cv.y) * 50;
  ov.style.background = 'radial-gradient(circle at ' + x.toFixed(1) + '% ' + y.toFixed(1) + '%, rgba(0,0,0,0) 0, rgba(0,0,0,0) 24vmin, rgba(' + (L.darkTone || '5,3,2') + ',' + (L.darkTone ? '.3' : '.5') + ') 50vmin, rgba(' + (L.darkTone || '5,3,2') + ',' + (L.darkTone ? '.55' : '.8') + ') 85vmin)'; }
function deepStep(dt) {
  L.glowers.forEach(function (gw) { gw.t += dt; gw.list.forEach(function (m, i) { const u = m.userData;
    if (gw.kind === 'lantern') { m.position.set(u.ox + Math.sin(gw.t * 0.6 + u.ph) * 1.6, u.oy + Math.sin(gw.t * 1.1 + u.ph) * 0.4, 0); m.rotation.y = Math.cos(gw.t * 0.6 + u.ph) > 0 ? 0 : Math.PI; }
    else if (gw.kind === 'comb') { m.position.set(u.ox + Math.sin(gw.t * 0.3 + u.ph) * 0.8, u.oy + Math.sin(gw.t * 0.5 + u.ph) * 0.8, 0); m.rotation.y += dt * 0.8; for (let k = 1; k <= 4; k++) if (m.children[k]) m.children[k].material.color.setHSL((gw.t * 0.5 + k * 0.25 + u.ph) % 1, 1, 0.65); }
    else { m.position.set(u.ox, u.oy + Math.sin(gw.t + u.ph) * 0.3, 0); m.children[0].material.opacity = 0.4 + 0.5 * Math.max(0, Math.sin(gw.t * 2 + u.ph * 3)); } }); });
  L.smokers.forEach(function (sm) { sm.puffs.forEach(function (p, i) { p.position.y += dt * 3.2; p.position.x = sm.x + Math.sin(p.position.y * 0.7 + i) * 0.5 * (p.position.y - sm.y0) / 6; const u = (p.position.y - sm.y0) / (sm.y1 - sm.y0); p.scale.setScalar(0.35 + u * 1.3); p.material.opacity = 0.6 * (1 - u); if (u >= 1) p.position.y = sm.y0; }); });
  if (L.inCave) L.scans.forEach(function (k) { if (!k.buried) k.nm.visible = Math.abs(P.x - k.x) < 8 && Math.abs(P.y - k.y) < 6; });
  else if (L.deepY != null) L.scans.forEach(function (k) { if (!k.buried) k.nm.visible = true; });
}
/* caves: the world goes dark and a warm light around the alien shows the way */
let BASE_LIGHT = null;
function caveLight(on, tone) {
  if (!HEMI) return; if (!BASE_LIGHT) BASE_LIGHT = { h: HEMI.intensity, k: KEYL.intensity };
  let ov = $('caveDark'); if (!ov && on) { ov = document.createElement('div'); ov.id = 'caveDark'; document.body.appendChild(ov); }
  if (ov) ov.hidden = !on;
  const deep = tone === 'deep'; if (L) L.darkTone = deep ? '1,4,10' : '5,3,2';
  if (on) { HEMI.intensity = BASE_LIGHT.h * (deep ? 0.35 : 0.55); KEYL.intensity = BASE_LIGHT.k * (deep ? 0.15 : 0.3); if (SKY) SKY.visible = false; if (!deep) { scene.background = new T.Color('#0a0806'); if (scene.fog) { scene.fog.color.set('#0a0806'); scene.fog.density = 0.045; } }
    if (P && P.m && !P.lamp) { P.lamp = new T.PointLight(deep ? 0xbfe8ff : 0xffd8a0, 2.6, 22, 1); P.lamp.position.set(0, 1.8, 1.5); P.m.add(P.lamp); }
    if (deep && P && P.m && P.m.userData.bulbs) P.m.userData.bulbs.forEach(function (bb) { bb.scale.setScalar(0.16); }); }
  else { HEMI.intensity = BASE_LIGHT.h; KEYL.intensity = BASE_LIGHT.k; if (P && P.lamp) { P.m.remove(P.lamp); P.lamp = null; } if (P && P.m && P.m.userData.bulbs) P.m.userData.bulbs.forEach(function (bb) { bb.scale.setScalar(0.09); }); if (L && L.th) { if (SKY) SKY.visible = true; scene.background = new T.Color(L.th.horizon); if (scene.fog) { scene.fog.color.set(L.th.horizon); scene.fog.density = L.th.fogD; } } }
  if (L) L.inCave = on;
}
/* ---------- WATER helpers ---------- */
function waterAt(x, y) { if (!L || !L.waters.length) return null; for (let i = 0; i < L.waters.length; i++) { const w = L.waters[i]; if (x >= w.x0 && x <= w.x1 && y < w.top) return w; } return null; }
function buildWater() {
  L.waters.forEach(function (w) {
    if (w.x1 > 1e8) w.x1 = L.len + 20;
    const deep = new T.Mesh(G.plane, new T.MeshBasicMaterial({ color: '#0e6a8a', transparent: true, opacity: 0.22, depthWrite: false })); if (L.deepY != null) deep.visible = false; const dd = Math.max(60, w.top - (L.floor || -16) + 20); deep.scale.set(w.x1 - w.x0, dd, 1); deep.position.set((w.x0 + w.x1) / 2, w.top - dd / 2, 4.6); L.group.add(deep);
    const surf = new T.Mesh(G.plane, new T.MeshBasicMaterial({ color: '#bff4ff', transparent: true, opacity: 0.55, depthWrite: false })); surf.scale.set(w.x1 - w.x0, 0.12, 1); surf.position.set((w.x0 + w.x1) / 2, w.top, 4.7); L.group.add(surf);
    const sheet = new T.Mesh(G.plane, new T.MeshBasicMaterial({ color: '#7fd4ff', transparent: true, opacity: 0.25, depthWrite: false, side: T.DoubleSide })); sheet.rotation.x = -Math.PI / 2; sheet.scale.set(w.x1 - w.x0, 14, 1); sheet.position.set((w.x0 + w.x1) / 2, w.top, -2); L.group.add(sheet);
    /* the open sea stretching to the horizon: from above it hides the reef below; from below it is the shimmering surface */
    const ocean = new T.Mesh(G.plane, new T.MeshLambertMaterial({ color: '#2a8ab0', emissive: '#0a3a50', transparent: true, opacity: 0.88, side: T.DoubleSide, depthWrite: false }));
    ocean.rotation.x = -Math.PI / 2; ocean.scale.set(w.x1 - w.x0 + 600, 420, 1); ocean.position.set((w.x0 + w.x1) / 2, w.top - 0.02, -212); L.group.add(ocean);
    w.surf = surf;
  });
}
function hudAir(show) {
  let el = $('hudAir'); if (!el) { el = document.createElement('span'); el.id = 'hudAir'; $('hud').insertBefore(el, $('hudLevel')); }
  el.hidden = !show; if (!show) return; const n = Math.max(0, Math.round(P.air * 10));
  el.textContent = '🫧 Air ' + '▮'.repeat(n) + '▯'.repeat(10 - n) + ' ' + Math.round(P.air * 100) + '%'; el.classList.toggle('low', P.air < 0.3);
}
/* swimming: steer in any direction, hold jump to rise, duck to dive; the helmet shows while you swim */
function swimStep(w, dt, ax) {
  if (!P.swim) { P.swim = true; P.vy *= 0.3; splash(P.x, w.top); if (!S.stat || !S.stat.swamOnce) { S.stat = S.stat || {}; S.stat.swamOnce = 1; save(); toast('🫧 Bubble helmet on! Hold jump (Space or Up) to swim up, duck (Down or S) to dive. Shift swims faster.', 6); }
    if (!P.helm) { P.helm = new T.Mesh(G.sph, new T.MeshLambertMaterial({ color: '#cff6ff', emissive: '#2a5a6a', transparent: true, opacity: 0.28, depthWrite: false })); P.helm.scale.setScalar(1.05); P.helm.position.y = 0.95; P.m.add(P.helm); } P.helm.visible = true; }
  const up = (keys.jump && !L.active ? 1 : 0) - (keys.duck && !L.active ? 1 : 0), fast = keys.run ? 1.35 : 1;
  P.vx += (ax * SPEED * 0.72 * fast - P.vx) * Math.min(1, dt * 5);
  P.vy += (up * 5.2 * fast - 0.7 - P.vy) * Math.min(1, dt * 4);
  if (up > 0 && P.y + PH > w.top - 0.15) { P.vy = JUMP * 0.78; P.swim = false; splash(P.x, w.top); } /* hop out at the surface */
  L.currents.forEach(function (c) { if (P.x > c.x0 && P.x < c.x1 && P.y + 0.7 > c.y0 && P.y + 0.7 < c.y1) { P.vx += c.vx * dt * 3; P.vy += c.vy * dt * 3; } });
  if (!S.set.low && Math.random() < dt * 3) { const g = glow('#e8fbff', 0.5, 0.8); g.position.set(P.x + 0.2, P.y + 1.3, 0.8); L.group.add(g); L.fx.push({ o: g, t: 0, vx: 0, vy: 2, life: 1.2 }); }
}
function splash(x, y) { if (S.set.low) return; for (let i = 0; i < 8; i++) { const g = glow('#e8fbff', 0.8, 0.9); g.position.set(x, y, 0.8); L.group.add(g); const a = Math.PI * (0.15 + 0.7 * i / 7); L.fx.push({ o: g, t: 0, vx: Math.cos(a) * 3, vy: Math.sin(a) * 4, life: 0.5 }); } beep(300, 0.12, 'sine', 'splash'); }
function bubbleStep(dt) { L.airs.forEach(function (a) { a.bs.forEach(function (m) { m.position.y += dt * 2.2; if (m.position.y > (waterAt(a.x, a.y + 1) || { top: a.y + 8 }).top) m.position.y = a.y; }); }); }
/* (old air meter, no longer used: the alien does not need to breathe) */
function airStep(w, dt) {
  if (P.air == null) P.air = 1;
  const under = !!w && P.y + PH < w.top - 0.05;
  let refill = !under;
  L.airs.forEach(function (a) { a.bs.forEach(function (m) { m.position.y += dt * 2.2; if (m.position.y > (waterAt(a.x, a.y + 1) || { top: a.y + 8 }).top) m.position.y = a.y; }); if (Math.abs(P.x - a.x) < 1 && P.y > a.y - 1) refill = true; });
  if (refill) P.air = Math.min(1, P.air + dt * 0.9); else P.air = Math.max(0, P.air - dt / 24);
  if (P.air <= 0) { P.airT = (P.airT || 0) - dt; if (P.airT <= 0) { P.airT = 2.5; toast('Out of air! Swim up to the surface or into a bubble column.', 3); hurt(true); } }
  hudAir(!!w || P.air < 1);
}
/* underwater view: no sky, deep blue haze, slowly darker with depth */
function underwaterView(w) {
  const under = !!w && cam.position.y - 3 < w.top;
  if (under !== !!L.camUnder) { L.camUnder = under; if (SKY) SKY.visible = !under; }
  if (under) { let c;
    if (L.deepY != null) { const d = Math.max(0, Math.min(1, (w.top - P.y) / Math.max(10, w.top - L.deepY))); c = d < 0.5 ? new T.Color('#1b7fa0').lerp(new T.Color('#0a3050'), d * 2) : new T.Color('#0a3050').lerp(new T.Color('#010307'), (d - 0.5) * 2); scene.fog.density = 0.022 + d * 0.035; }
    else { const d = Math.max(0, Math.min(1, (w.top - P.y) / 14)); c = new T.Color('#1b7fa0').lerp(new T.Color('#06283a'), d); scene.fog.density = 0.022 + d * 0.02; }
    scene.background = c; scene.fog.color.copy(c); if (L.deepY != null) RIDGES.forEach(function (r) { r.m.material.color.copy(r.base).lerp(c, Math.min(1, (w.top - P.y) / 12)); }); }
  else if (L.th) { scene.background = new T.Color(L.th.horizon); scene.fog.color.set(L.th.horizon); scene.fog.density = L.th.fogD; }
}
function startLevel(w, lv) {
  teardown();
  const th = THEMES[lv.theme] || THEMES.cell;
  L = { world: w, lv: lv, th: th, group: new T.Group(), solids: [], tokens: [], sparks: [], stations: [], doors: [], cps: [{ x: 2, y: 0 }], anim: [], used: {}, scans: [], helps: [], models: [], flies: [], secrets: [], ghosts: [], crumbs: [], told: {}, temps: [], clues: [], portal: null,
    refuels: [], waters: [], currents: [], airs: [], glowers: [], smokers: [], score: 0, streak: 0, hp: 5, time: 0, started: false, pen: 0, wrongs: 0, first: 0, total: 0, active: null, cp: 0, goal: null, over: false, zones: [], zone: null, atps: [], spin: [], hazards: [], movers: [], boosts: [], spikes: [], fx: [], flags: [], rare: null, lives: 3, coins: 0, shake: 0, debrief: null };
  scene.add(L.group);
  const b = builder(); lv.build(b); closeSlab(b.x); L.len = b.x; if (L.waters.length) buildWater();
  L.floor = Math.min(-16, L.solids.reduce(function (m, s) { return Math.min(m, s.y1); }, 0) - 14);
  scenery(th, 0, L.len, L.group, L.anim);
  /* checkpoint flags: they light up when you pass them */
  L.cps.forEach(function (c, i) {
    if (!i) return; const g = new T.Group(), pole = mesh('cyl', '#d6e4ea'); pole.scale.set(0.06, 2.6, 0.06); pole.position.y = 1.3; g.add(pole);
    const fl = new T.Mesh(G.box, emat('#5a6470', '#101418')); fl.scale.set(0.9, 0.55, 0.05); fl.position.set(0.47, 2.25, 0); g.add(fl);
    g.position.set(c.x, c.y, -1.2); L.group.add(g); L.flags[i] = { fl: fl, g: g };
  });
  P = { x: 2, y: 0, vx: 0, vy: 0, ground: null, face: 1, m: buildAlien(S.alien), t: 0, atp: false, atpM: null, badge: null, inv: 0, boost: 0, boostM: null, shield: 0, shieldM: null, dbl: true, trail: [], hist: [] };
  L.group.add(P.m);
  const sh = new T.Mesh(G.plane, new T.MeshBasicMaterial({ map: FX.glow, color: th.rim, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.scale.set(3.2, 3.2, 1); L.group.add(sh); P.shadow = sh;
  cam.position.set(P.x + 4, 5, camZ);
  mode = 'play'; paused = false; actEdge = false; jumpBuf = 0; noteT = 0; $('note').hidden = true; if (S.alien.gear) setTimeout(function () { if (mode === 'play') toast(GEARINFO[S.alien.gear], 5); }, 6000); show(null); $('hud').hidden = false; $('touch').hidden = !touchMode;
  $('hudLevel').textContent = lv.id + ' ' + lv.title; hud(); closeQ();
  toast(lv.log || '', 7); loadSupplies();
  /* beamed down from the mothership */
  { P.y = 6; P.vy = -1; const bm = new T.Mesh(new T.CylinderGeometry(0.6, 1.4, 9, 16, 1, true), new T.MeshBasicMaterial({ color: th.rim, transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false }));
    bm.position.set(2, 4.5, 0); L.group.add(bm); L.fx.push({ o: bm, t: 0, vx: 0, vy: 0, life: 1.4 }); } Music.setDuck(1); Music.play(SONGS[lv.theme] ? lv.theme : 'cell');
}
function hud() {
  let h = ''; for (let i = 0; i < 5; i++) h += i < L.hp ? '●' : '○';
  $('hudHp').textContent = h + '  ♥×' + L.lives + '  ◆' + L.coins; $('hudHp').setAttribute('aria-label', 'Energy ' + L.hp + ' of 5, ' + L.lives + ' lives, ' + L.coins + ' sparks');
  $('hudScore').textContent = L.score; $('hudStreak').textContent = L.streak > 1 ? 'Streak ×' + L.streak : '';
  $('hudInv').innerHTML = (S.inv.fly > 0 ? '<button type="button" data-use="fly" title="Flight capsule (F)">🚀×' + S.inv.fly + ' <small>F</small></button>' : '') + (S.inv.lens > 0 ? '<button type="button" data-use="lens" title="Hint lens (H)">🔍×' + S.inv.lens + ' <small>H</small></button>' : '');
}
function fmtTimeT(sec) { const t = Math.max(0, Math.round(sec * 10)) / 10, m = Math.floor(t / 60), r = t - m * 60; return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1); }
function hudTime(force) { if (!L || !$('hudTime')) return; const k = L.started ? Math.floor((L.time + L.pen) * 10) : -1; if (!force && k === L.lastTk) return; L.lastTk = k;
  const best = (S.levels[L.lv.id] || {}).time, el = $('hudTime');
  el.classList.toggle('wait', !L.started);
  el.textContent = '⏱ ' + fmtTimeT(L.time + L.pen) + (L.pen ? ' (+' + L.pen + 's)' : '') + (best ? '  ·  best ' + fmtTimeT(best) : '');
  el.title = L.started ? 'Speedrun time. Wrong answers add ' + PEN_SEC + ' seconds.' : 'The timer starts when you move.'; }
function toast(text, secs) { if (!text) return; $('toast').textContent = text; $('toast').hidden = false; toastT = secs || 4; }
function record(q, ok) {
  const c = S.codes[q.code] = S.codes[q.code] || { right: 0, tries: 0, world: L.world.id }; c.tries++; if (ok) c.right++;
  if (q.id) S.seen[q.id] = Date.now();
  if (q.id) { if (ok) { if (S.missed[q.id]) { S.missed[q.id]--; if (S.missed[q.id] <= 0) delete S.missed[q.id]; } } else S.missed[q.id] = (S.missed[q.id] || 0) + 1; }
}
function hurt(hazard) {
  L.hp--; L.shake = 0.35; if (!hazard) L.streak = 0; beep(hazard ? 120 : 160, 0.3, 'sawtooth', hazard ? 'thud, you were hit' : 'low buzz, not correct');
  if (L.hp <= 0) {
    L.lives--;
    if (L.lives <= 0) { hud(); return gameOver(); }
    L.hp = 5; respawn(); toast('Out of energy: you lost a life. Back to the last checkpoint.', 4);
  }
  hud();
}
function gameOver() {
  L.over = true; mode = 'done'; closeQ(); Music.stop(); beep(220, 0.6, 'triangle', 'sad tones, out of lives');
  $('doneTitle').textContent = L.lv.id + ' ' + L.lv.title + ': out of lives';
  $('doneStars').textContent = ''; $('doneBody').innerHTML = '<p>Your field research was interrupted. Try the level again. Collect 50 sparks for an extra life, and look for shields.</p>';
  $('btnNext').hidden = true; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; show('done'); $('btnReplay').focus();
}
/* feedback: floating score text and sparkle bursts */
function popup(x, y, text, col) { const sp = label(text, 1.7, { bd: col || '#ffd166' }); sp.position.set(x, y + 1, 1.5); L.group.add(sp); L.fx.push({ o: sp, t: 0, vy: 1.4, life: 0.9 }); }
function burst(x, y, col) {
  if (S.set.low) return;
  for (let i = 0; i < 8; i++) { const g = glow(col, 0.9, 0.9); g.position.set(x, y, 0.5); L.group.add(g); const a = i / 8 * Math.PI * 2; L.fx.push({ o: g, t: 0, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4, life: 0.5 }); }
}
function respawn() { const c = L.cps[L.cp]; P.duck = false; P.fly = 0; if (P.flyM) { P.m.remove(P.flyM); P.flyM = null; } PH = STAND; P.x = c.x; P.y = c.y + 0.1; P.vx = P.vy = 0; P.inv = 1.5; }

/* ---------- question stations ---------- */
function figHTML(f) {
  if (!f) return '';
  if (f.type === 'table') {
    return '<table class="ftab"><tr>' + f.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr>' +
      f.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  if (f.type === 'line') {
    const W = 330, H = 180, l = 52, r = 12, t = 12, bt = 40, x0 = f.xmin || 0, y0 = f.ymin || 0;
    const sx = function (x) { return l + (x - x0) / (f.xmax - x0) * (W - l - r); }, sy = function (y) { return H - bt - (y - y0) / (f.ymax - y0) * (H - t - bt); };
    let s = '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(f.ylabel + ' by ' + f.xlabel) + '">';
    f.yticks.forEach(function (v) { s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + sy(v) + '" y2="' + sy(v) + '" stroke="currentColor" stroke-opacity=".2"/><text x="' + (l - 6) + '" y="' + (sy(v) + 4) + '" text-anchor="end" font-size="11" fill="currentColor">' + v + '</text>'; });
    f.xticks.forEach(function (v) { s += '<text x="' + sx(v) + '" y="' + (H - bt + 15) + '" text-anchor="middle" font-size="11" fill="currentColor">' + v + '</text>'; });
    s += '<line x1="' + l + '" x2="' + l + '" y1="' + t + '" y2="' + (H - bt) + '" stroke="currentColor"/><line x1="' + l + '" x2="' + (W - r) + '" y1="' + (H - bt) + '" y2="' + (H - bt) + '" stroke="currentColor"/>';
    s += '<polyline fill="none" stroke="#ffd166" stroke-width="3" points="' + f.points.map(function (p) { return sx(p[0]) + ',' + sy(p[1]); }).join(' ') + '"/>';
    f.points.forEach(function (p) { s += '<circle cx="' + sx(p[0]) + '" cy="' + sy(p[1]) + '" r="3.5" fill="#ffd166"/>'; });
    s += '<text x="' + ((l + W - r) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="12" fill="currentColor">' + esc(f.xlabel) + '</text>';
    s += '<text transform="translate(13 ' + ((t + H - bt) / 2) + ') rotate(-90)" text-anchor="middle" font-size="12" fill="currentColor">' + esc(f.ylabel) + '</text></svg>';
    return s;
  }
  if (f.type === 'bars') {
    const W = 330, H = 190, l = 46, r = 8, t = 14, bt = 40, v = f.values, lim = Math.ceil(Math.max.apply(null, v.map(Math.abs)) / 10) * 10, bw = (W - l - r) / v.length;
    const sy = function (y) { return t + (lim - y) / (2 * lim) * (H - t - bt); };
    let s = '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(f.ylabel) + ' bar graph">';
    [-lim, -lim / 2, 0, lim / 2, lim].forEach(function (y) { s += '<line x1="' + l + '" x2="' + (W - r) + '" y1="' + sy(y) + '" y2="' + sy(y) + '" stroke="currentColor" stroke-opacity="' + (y === 0 ? 0.9 : 0.2) + '"/><text x="' + (l - 6) + '" y="' + (sy(y) + 4) + '" text-anchor="end" font-size="11" fill="currentColor">' + y + '</text>'; });
    v.forEach(function (y, i) {
      const x = l + i * bw + bw * 0.2, top = Math.min(sy(y), sy(0)), h = Math.abs(sy(y) - sy(0));
      s += '<rect x="' + x + '" y="' + top + '" width="' + (bw * 0.6) + '" height="' + h + '" fill="' + (y >= 0 ? '#7fd4ff' : '#ffb09c') + '"/>';
      s += '<text x="' + (x + bw * 0.3) + '" y="' + (y >= 0 ? top - 4 : top + h + 12) + '" text-anchor="middle" font-size="11" fill="currentColor">' + (y > 0 ? '+' : '') + y + '%</text>';
      s += '<text x="' + (x + bw * 0.3) + '" y="' + (H - bt + 16) + '" text-anchor="middle" font-size="11" fill="currentColor">' + esc(f.categories[i]) + '</text>';
    });
    s += '<text transform="translate(12 ' + ((t + H - bt) / 2) + ') rotate(-90)" text-anchor="middle" font-size="11" fill="currentColor">' + esc(f.ylabel) + '</text></svg>';
    return s;
  }
  if (f.type === 'membrane') {
    const W = 330, H = 120; let s = '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + f.outside + ' molecules outside the cell and ' + f.inside + ' inside">';
    s += '<rect x="158" y="22" width="14" height="92" rx="5" fill="#f2c078"/>';
    s += '<text x="78" y="14" text-anchor="middle" font-size="12" fill="currentColor">Outside the cell</text><text x="252" y="14" text-anchor="middle" font-size="12" fill="currentColor">Inside the cell</text>';
    const dots = function (n, ox) { for (let i = 0; i < n; i++) { const j = Math.floor(i * 15 / n), cx = ox + 16 + (j % 5) * 27 + (j * 7 % 3) * 4, cy = 36 + Math.floor(j / 5) * 28 + (j * 5 % 4) * 3; s += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#7fd4ff"/>'; } };
    dots(f.outside, 6); dots(f.inside, 180); return s + '</svg>';
  }
  return '';
}
function openQ(st) {
  L.active = st; const q = st.queue[st.qi];
  st.perm = q.fixed ? q.options.map(function (_, i) { return i; }) : shuffle(q.options.map(function (_, i) { return i; }));
  st.tried = {}; st.firstTry = true; st.wrongN = 0; st.coolUntil = 0; $('qopts').classList.remove('cool'); if ($('qcool')) $('qcool').hidden = true;
  st.pads.forEach(function (p) { const on = p.i < q.options.length; p.s.off = !on; p.m.visible = on; p.lb.visible = on; p.m.material = emat('#3d8bd4', '#0f3a66'); });
  const inPair = st.pair && st.pair.qs.indexOf(q) >= 0, pairTxt = inPair ? 'Look-alike pair ' + (st.pair.qs.indexOf(q) + 1) + ' of 2: ' + st.pair.name : '';
  let meta = st.boss ? st.boss.name + ': ' + '■'.repeat(st.boss.hp) + '□'.repeat(st.boss.max - st.boss.hp) + (inPair ? ' · ' + pairTxt : '')
    : (pairTxt || (st.title ? st.title + ': ' : 'Question ') + (st.qi + 1) + ' of ' + st.queue.length);
  $('qmeta').textContent = meta; $('qpanel').classList.toggle('compact', st.chart); $('qpanel').classList.toggle('short', st.fixedLabels);
  $('qhow').textContent = st.chart ? 'Read the graph, then press the letter of your answer (or click it).' : st.lock ? 'Press 1 to 5 for each digit of the code (or click it).' : HOW;
  P.vx = 0;
  $('qprompt').innerHTML = esc(q.prompt) + (q.stem ? '<span class="stem">' + esc(q.stem) + '</span>' : '');
  $('qfig').innerHTML = st.chart ? '' : figHTML(q.figure);
  $('qopts').innerHTML = st.perm.map(function (oi, i) { return '<button type="button" class="opt" data-i="' + i + '">' + (st.lock ? '' : '<b>' + String.fromCharCode(65 + i) + '</b> ') + esc(q.options[oi]) + '</button>'; }).join('');
  $('qfb').textContent = ''; $('qpanel').hidden = false;
  Music.setDuck(0.45); if (st.boss) Music.play('boss');
}
const HOW = 'Press A, B, C, or D to answer (or click an answer).';
/* after a wrong answer the choices grey out for a moment and a bar drains, so guessing by rapid tapping does not pay */
function lockout(st, ms) { st.coolUntil = performance.now() + ms; const o = $('qopts'); o.classList.add('cool'); o.style.setProperty('--cool', ms + 'ms');
  let bar = $('qcool'); if (!bar) { bar = document.createElement('div'); bar.id = 'qcool'; bar.innerHTML = '<i></i>'; o.parentNode.insertBefore(bar, o); }
  bar.hidden = false; const i = bar.firstChild; i.style.animation = 'none'; void i.offsetWidth; i.style.animation = 'qcool ' + ms + 'ms linear forwards';
  clearTimeout(lockout.t); lockout.t = setTimeout(function () { o.classList.remove('cool'); bar.hidden = true; }, ms); }
function closeQ() { if (L) L.active = null; $('qpanel').hidden = true; $('qpanel').classList.remove('compact', 'short'); Music.setDuck(1); }
function answer(i) {
  const st = L.active; if (st && st.clue) return clueAnswer(i); if (st && st.portal) return; if (st && st.refuel) return refuelAnswer(i); if (!st || st.done || st.tried[i]) return;
  if (st.coolUntil && performance.now() < st.coolUntil) return; /* short lockout after a wrong answer: rapid tapping costs time */
  const q = st.queue[st.qi]; if (i >= q.options.length) return;
  const ok = st.perm[i] === q.answer;
  if (st.firstTry) record(q, ok);
  if (ok) {
    if (st.wrongN >= 2) award('persist');
    if (st.firstTry) { L.first++; L.streak++; L.score += 100 + Math.min(L.streak, 5) * 20; } else L.score += 40;
    beep(880, 0.25, 'sine', 'chime, correct'); toast('✓ Correct. ' + q.explain, 5);
    if (st.boss) { st.boss.hp--; st.boss.m.scale.setScalar(0.45 + 0.55 * st.boss.hp / st.boss.max); }
    if (st.pair && st.pair.qs.indexOf(q) === 1) toast('✓ ' + q.explain + ' Telling them apart: ' + st.pair.explain, 8);
    st.qi++;
    if (st.lock) {
      const dg = st.queue.map(function (x, k) { return k < st.qi ? x.options[x.answer] : '_'; }).join(' ');
      st.lockLabel.material.map = labelTex('Code: ' + dg, { bd: '#c8ff7a' }); st.lockLabel.material.needsUpdate = true;
      if (st.qi >= st.queue.length) { L.debrief = st.lock.debrief; st.lockLabel.visible = false; toast('✓ Lab Lock open. Code ' + dg + '. Read the debrief when you send your report.', 6); }
    }
    if (st.qi >= st.queue.length) {
      st.done = true; st.wall.off = true; st.wallMesh.visible = false; if (st.boss) { st.boss.m.visible = false; Music.play(SONGS[L.lv.theme] ? L.lv.theme : 'cell'); }
      st.pads.forEach(function (p) { p.lb.visible = false; }); closeQ(); if (st.boss) toast('✓ ' + st.boss.name + ' is back in balance. ' + q.explain, 6);
    } else openQ(st);
  } else {
    st.tried[i] = 1; st.firstTry = false; if (st.pads[i]) st.pads[i].m.material = mat('#5a6470');
    const btn = $('qopts').querySelector('[data-i="' + i + '"]'); if (btn) { btn.disabled = true; btn.classList.add('no'); }
    st.wrongN = (st.wrongN || 0) + 1; lockout(st, 1500);
    if (st.wrongN >= 2) { L.helped = true; const ci = st.perm.indexOf(q.answer), b2 = $('qopts').querySelector('[data-i="' + ci + '"]'); if (b2) b2.classList.add('help'); if (st.pads[ci]) st.pads[ci].m.material = emat('#ffd700', '#7a5a00'); $('qfb').textContent = '✗ Not that one. ' + (q.hint || q.explain) + ' The right answer is glowing gold.'; }
    else $('qfb').textContent = '✗ Not that one. ' + (q.hint || q.explain);
    miss();
  }
  hud();
}

/* ---------- movement ---------- */
function hit(s) { return P.x + HW > s.x0 && P.x - HW < s.x1 && P.y + PH > s.y0 && P.y < s.y1; }
function moveX(dx) {
  P.x += dx; if (P.x < HW) P.x = HW;
  L.solids.forEach(function (s) { if (!s.off && !s.oneWay && hit(s)) { P.x = dx > 0 ? s.x0 - HW : s.x1 + HW; P.vx = 0; } });
}
function moveY(dy) {
  const prev = P.y; P.y += dy; P.ground = null;
  L.solids.forEach(function (s) {
    if (s.off || !hit(s)) return;
    if (s.oneWay) { if (dy <= 0 && prev >= s.y1 - 0.001) { P.y = s.y1; P.vy = 0; P.ground = s; } }
    else if (dy <= 0) { P.y = s.y1; P.vy = 0; P.ground = s; } else { P.y = s.y0 - PH; P.vy = 0; if (s.qb && !s.qb.used) bumpBlock(s.qb); }
  });
}
function crumbStep(dt) {
  L.crumbs.forEach(function (c) {
    c.bits = c.bits.filter(function (k) { k.vy -= GRAV * 0.6 * dt; k.m.position.x += k.vx * dt; k.m.position.y += k.vy * dt; k.m.rotation.z += k.vr * dt; k.life -= dt; if (k.life > 0) return true; L.group.remove(k.m); return false; });
    if (c.gone > 0) { /* broken: grow back once the space is clear */
      c.gone -= dt;
      if (c.gone <= 0) { if (hit(c.s)) { c.gone = 0.3; return; } c.s.off = false; c.g.visible = true; c.t = 0; c.g.scale.setScalar(0.2); c.mt.color.copy(c.col); }
      return;
    }
    if (c.g.scale.x < 1) c.g.scale.setScalar(Math.min(1, c.g.scale.x + dt * 3));
    const on = P.ground === c.s;
    if (on) { if (!c.told && !L.told[c.boom ? 'boom' : 'crumble']) { L.told[c.boom ? 'boom' : 'crumble'] = c.told = true; toast(tx(c.boom ? 'h.boom' : 'h.crumble'), 4); }
      const before = c.t; c.t += dt; if (Math.floor(before * 4) !== Math.floor(c.t * 4)) beep(c.boom ? 900 + c.t * 400 : 180 + c.t * 60, 0.05, c.boom ? 'square' : 'sawtooth'); }
    else c.t = Math.max(0, c.t - dt * 0.6);
    const r = Math.min(1, c.t / c.lim);
    c.g.position.x = c.bx + (r > 0 ? Math.sin(P.t * 55) * 0.07 * r : 0); c.g.position.y = c.by;
    c.mt.color.copy(c.col).lerp(c.hot, r); if (c.boom) c.mt.emissive.setRGB(0.3 * r * (0.6 + 0.4 * Math.sin(P.t * (10 + r * 30))), 0.05 * r, 0);
    if (c.t >= c.lim) { /* break */
      c.s.off = true; c.g.visible = false; c.gone = 3.5; c.t = 0; if (P.ground === c.s) P.ground = null;
      const w = c.s.x1 - c.s.x0, n = Math.max(3, Math.round(w * 2));
      for (let i = 0; i < n; i++) { const m = new T.Mesh(G.box, basic(c.boom ? (i % 2 ? '#ffd166' : '#e0743a') : '#8a6a40')); m.scale.set(0.35, 0.3, 0.6); m.position.set(c.s.x0 + (i + 0.5) * w / n, c.by, 0.4); L.group.add(m);
        c.bits.push({ m: m, vx: (Math.random() - 0.5) * (c.boom ? 9 : 2), vy: c.boom ? 4 + Math.random() * 6 : Math.random() * 1.5, vr: (Math.random() - 0.5) * 10, life: 1.4 }); }
      if (c.boom) { burst(c.bx, c.by + 0.3, '#ffb070'); L.shake = Math.max(L.shake || 0, 0.25); beep(110, 0.35, 'sawtooth', 'pop! the platform burst');
        if (Math.abs(P.x - c.bx) < w / 2 + 1 && P.y - c.by < 2.5 && P.y >= c.by - 0.5) P.vy = Math.max(P.vy, 11); }
      else beep(140, 0.3, 'sawtooth', 'crumble, the platform fell apart');
    }
  });
}
function beamUp() {
  L.over = true; L.beamT = 0; closeQ(); P.vx = P.vy = 0; Music.stop(); beep(300, 1.4, 'sine', 'rising hum, beamed up to the mothership');
  [400, 500, 650, 850].forEach(function (f, k) { setTimeout(function () { beep(f, 0.25, 'sine'); }, 250 + k * 260); });
}
function step(dt) {
  if (L.beamT != null) {
    L.beamT += dt; P.t += dt; const u = Math.min(1, L.beamT / 1.6), g = L.goal;
    P.x += (g.x - P.x) * Math.min(1, dt * 6); P.y = g.y + u * u * 6.4; P.m.position.set(P.x, P.y, 0); P.m.rotation.y += dt * 9; P.m.scale.setScalar(Math.max(0.05, 1 - u * 0.95)); P.m.visible = true;
    g.beam.material.opacity = 0.35 + Math.sin(L.beamT * 30) * 0.1; g.m.position.y = g.y + 6.6 + (L.beamT > 1.6 ? (L.beamT - 1.6) * (L.beamT - 1.6) * 30 : 0);
    if (L.beamT > 1.6) { g.beam.visible = false; P.m.visible = false; }
    cam.position.y += (g.y + 5.5 - cam.position.y) * Math.min(1, dt * 2); cam.lookAt(cam.position.x, cam.position.y - 0.6, 0);
    if (L.beamT > 2.3 && !L.done2) { L.done2 = true; finish(); }
    return;
  }
  /* speedrun clock: starts on the first move, not when the level loads */
  if (!L.started && !L.active && (keys.left || keys.right || keys.jump || keys.duck || jumpBuf > 0)) L.started = true;
  if (L.started) L.time += dt; P.t += dt; hudTime();
  const ax = L.active ? 0 : (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  const inW = waterAt(P.x, P.y + 0.75); if (!inW && P.swim) { P.swim = false; if (P.helm) P.helm.visible = false; }
  if (L.active) jumpBuf = 0;
  if (ax) P.face = ax;
  const bo = P.boost > 0; P.boost -= dt; if (!bo && P.boostM) { P.m.remove(P.boostM); P.boostM = null; }
  P.inv -= dt;
  L.movers.forEach(function (mv) {
    mv.t += dt; const nx = mv.bx + Math.sin(mv.t * mv.sp) * mv.ax, ny = mv.by + Math.sin(mv.t * mv.sp) * mv.ay, dx = nx - mv.s.x0, dy = ny - mv.s.y1;
    mv.s.x0 += dx; mv.s.x1 += dx; mv.s.y0 += dy; mv.s.y1 += dy; mv.m.position.x += dx; mv.m.position.y += dy;
    if (P.ground === mv.s) { P.x += dx; P.y += dy; }
  });
  crumbStep(dt);
  /* duck: crouch low while on the ground; stay crouched under a low ceiling */
  const wantDuck = keys.duck && !L.active && P.ground && !(jumpBuf > 0);
  if (wantDuck) P.duck = true;
  else if (P.duck) { PH = STAND; const blocked = L.solids.some(function (s) { return !s.off && !s.oneWay && hit(s); }); if (blocked) { PH = CROUCH; jumpBuf = 0; } else P.duck = false; }
  PH = P.duck ? CROUCH : STAND;
  const running = keys.run && !P.duck; P.vx += (ax * SPEED * (bo ? 1.45 : 1) * (P.duck ? 0.5 : running ? 1.6 : 1) - P.vx) * Math.min(1, dt * (running ? 10 : 14));
  jumpBuf -= dt; coyote = P.ground ? 0.1 : coyote - dt;
  if (P.ground) P.dbl = true;
  if (inW) jumpBuf = 0; /* in water, jump means swim up (handled in swimStep) */
  if (jumpBuf > 0 && coyote > 0) { P.vy = JUMP * (bo ? 1.15 : 1); jumpBuf = 0; coyote = 0; beep(420, 0.08, 'triangle'); }
  else if (jumpBuf > 0 && !P.ground && P.dbl && P.vy < 10) { P.vy = JUMP * 1.05 * (bo ? 1.1 : 1); P.dbl = false; jumpBuf = 0; beep(620, 0.08, 'triangle'); burst(P.x, P.y + 0.2, '#ffffff'); }
  if (!keys.jump && P.vy > 0 && !inW) P.vy -= 50 * dt; /* short hop when jump is let go (not in water: currents and plumes can lift you) */
  if (S.alien.gear === 2 && !(P.fly > 0) && !inW) { /* Explorer cape: hold jump while falling to fly a little */
    if (P.cape == null) P.cape = 1.5;
    if (P.ground) P.cape = Math.min(1.5, P.cape + dt * 1.5);
    else if (keys.jump && (P.vy < 0.5 || P.capeOn) && P.cape > 0 && !L.active) { P.capeOn = true; P.cape -= dt; P.vy = Math.min(5, P.vy + 30 * dt) + GRAV * dt; P.capeT = 0.15; }
    if (!keys.jump || P.ground || P.cape <= 0) P.capeOn = false;
    capeBar();
  }
  if (P.ground && !P.ground.protein) P.prot = 1;
  L.temps = L.temps.filter(function (t) { t.life -= dt; t.m.visible = t.life > 1 || Math.floor(t.life * 8) % 2 === 0; if (t.life > 0) return true; t.s.off = true; L.group.remove(t.m); return false; });
  if (P.fly > 0) {
    P.fly -= dt; const cap = L.cps[L.cp].y + 13;
    if (keys.jump && !L.active) P.vy = Math.min(8, P.vy + 30 * dt) + GRAV * dt; else P.vy = Math.max(P.vy, -5);
    if (P.y > cap && P.vy > 0) P.vy = 0;
    if (P.flyM) { P.flyM.children[0].rotation.x += dt * 20; P.flyM.children[1].rotation.z += dt * 8; }
    if (P.fly < 3 && !P.flyWarn) { P.flyWarn = true; toast('Flight power is running out. Find a place to land!', 3); }
    if (P.fly <= 0 && P.flyM) { P.m.remove(P.flyM); P.flyM = null; }
  }
  if (inW && !(P.fly > 0)) swimStep(inW, dt, ax); else P.vy = Math.max(-30, P.vy - GRAV * dt);
  if (L.solids.length && (L.digHint != null)) digStep(dt, ax);
  if (L.darkX != null) { const cave = P.x > L.darkX && P.y < L.darkTop && !(L.darkEnd != null && P.x > L.darkEnd); if (cave !== !!L.inCave) caveLight(cave); if (L.inCave) caveSpot(); }
  else if (L.deepY != null) { const dp = !!inW && P.y < L.deepY; if (dp !== !!L.inCave) { caveLight(dp, 'deep'); if (dp && !L.toldDeep) { L.toldDeep = 1; toast('🌑 No sunlight reaches this deep. Your antennae light up! Many animals down here make their own light (bioluminescence).', 6); } } if (L.inCave) caveSpot(); }
  deepStep(dt);
  if (L.waters.length) { bubbleStep(dt); underwaterView(waterAt(cam.position.x, cam.position.y - 3)); } /* the alien does not need air: bubble vents are just scenery */
  if (L.currents.length) L.currents.forEach(function (c) { c.streaks.forEach(function (m, i) { m.position.x += c.vx * dt * 1.6; m.position.y += c.vy * dt * 1.6; if (m.position.x > c.x1) m.position.x = c.x0; if (m.position.x < c.x0) m.position.x = c.x1; if (m.position.y > c.y1) m.position.y = c.y0; if (m.position.y < c.y0) m.position.y = c.y1; }); });
  moveX(P.vx * dt); moveY(P.vy * dt);
  if (P.y < (L.floor != null ? L.floor : -16)) { respawn(); L.score = Math.max(0, L.score - 25); toast('You fell. Back to the last checkpoint.', 3); hud(); }
  for (let i = L.cp + 1; i < L.cps.length; i++) if (P.x > L.cps[i].x) {
    L.cp = i; const f = L.flags[i];
    if (f && !f.lit) { f.lit = true; f.fl.material = emat('#7be0ad', '#2f7a50'); f.g.add(glow('#7be0ad', 2.4, 0.6)); beep(760, 0.15, 'triangle', 'bell, checkpoint'); popup(L.cps[i].x, L.cps[i].y + 2, 'Checkpoint', '#7be0ad'); }
  }

  L.hazards.forEach(function (h) {
    if (!h.alive) return; h.t += dt;
    if (h.kind === 'snapper') {
      const c = (h.t + h.offset) % h.period, upStart = h.period - 1.9, up = c > upStart;
      const f = up ? Math.min(1, (c - upStart) / 0.25, (h.period - c) / 0.25) : 0, lift = -1.3 + f * 2.7;
      h.head.position.set(c > upStart - 0.6 && !up ? (Math.random() - 0.5) * 0.12 : 0, lift, 0);
      const open = up ? 0.2 + Math.abs(Math.sin(h.t * 6)) * 0.6 : 0.9; h.arms[0].rotation.z = -open; h.arms[1].rotation.z = open;
      h.y = h.gy + lift + 0.2;
      if (lift > -0.2 && P.inv <= 0 && Math.abs(P.x - h.x) < 0.75 && P.y < h.gy + lift + 0.6 && P.y + PH > h.gy) { P.inv = 1.3; P.vx = P.x < h.x ? -8 : 8; P.vy = 8; toast(h.foe ? FOES[h.foe].msg : 'Engulfed! Phagocytes eat by wrapping around things. Jump past while it is hiding.', 3.5); hurt(true); }
      return;
    }
    if (h.kind === 'rock') {
      const c = (h.t + h.offset) % h.period, warn = c > h.period - 1.3 && c < h.period - 0.55, fall = c >= h.period - 0.55, u = fall ? (c - (h.period - 0.55)) / 0.55 : 0;
      h.dust.material.opacity = warn ? 0.4 + 0.3 * Math.sin(h.t * 30) : 0; h.y = fall ? h.top - (h.top - h.gy - 0.4) * u * u : h.top; h.m.visible = fall || warn || c < 0.2;
      h.m.position.set(h.x + (warn ? Math.sin(h.t * 50) * 0.06 : 0), h.y, 0); if (fall) h.m.rotation.z += dt * 6;
      if (fall && u > 0.3 && P.inv <= 0 && P.shield <= 0 && Math.abs(P.x - h.x) < 0.8 && P.y < h.y && P.y + PH > h.y - 0.5) { P.inv = 1.3; P.vx = P.x < h.x ? -6 : 6; P.vy = 4; toast('Cave-in! Watch for falling dust: it means a rock is about to drop.', 3.5); hurt(true); }
      return;
    }
    if (h.kind === 'antibody') {
      const c = (h.t + h.offset) % h.period, fly = c < h.span / h.speed;
      h.x = fly ? h.x0 - c * h.speed : h.x0 + 2; h.y = h.gy + 1.15; h.m.visible = fly; h.m.position.set(h.x, h.y + Math.sin(h.t * 9) * 0.05, 0); h.m.rotation.z = Math.sin(h.t * 6) * 0.15;
      if (h.warn) h.warn.material.opacity = !fly && c > h.period - 1 ? 0.5 + 0.5 * Math.sin(h.t * 20) : 0.15;
      if (fly && P.inv <= 0 && P.shield <= 0 && Math.abs(P.x - h.x) < 0.7 && P.y + PH > h.y - 0.25 && P.y < h.y + 0.35) { P.inv = 1.3; P.vx = -7; P.vy = 6; toast('Tagged by an antibody! Duck (down arrow or S) or jump over it.', 3.5); hurt(true); }
      return;
    }
    if (h.kind === 'virus') { const k = Math.asin(Math.sin(h.t * h.sp + h.ph)) * 2 / Math.PI; h.x = h.bx + k * h.range; h.y = h.by + Math.abs(Math.sin(h.t * 6)) * 0.12; h.m.position.set(h.x, h.y, 0); h.m.rotation.y = Math.cos(h.t * h.sp + h.ph) > 0 ? 0.6 : -0.6; }
    else { const px = h.x; h.x = h.bx + Math.sin(h.t * h.sp + h.ph) * h.ax; h.y = h.by + Math.sin(h.t * h.sp * 1.3 + h.ph) * h.ay; h.m.position.set(h.x, h.y, 0);
      if (h.look === 'angler') { h.m.rotation.y = h.x >= px ? 0 : Math.PI; const u = h.m.userData.lure; if (u) u.scale.setScalar(0.13 * (1 + Math.sin(h.t * 4) * 0.2)); }
      else if (h.look === 'atolla') { const r = h.m.userData.ring, f = Math.sin(h.t * 2.2) > 0.6; if (r) r.material.opacity = f ? 1 : 0.25; const pulse = 1 + Math.sin(h.t * 2) * 0.1; h.m.scale.set(pulse, 2 - pulse, pulse); }
      else if (h.look === 'shark') { h.m.rotation.y = h.x >= px ? 0 : Math.PI; h.m.rotation.z = Math.sin(h.t * 3) * 0.05; }
      else if (h.look === 'jelly') { const pulse = 1 + Math.sin(h.t * 3) * 0.12; h.m.scale.set(pulse, 2 - pulse, pulse); }
      else h.m.rotation.z += dt * 2.5; }
    const dx = P.x - h.x, dy = P.y + PH * 0.52 - h.y;
    if (Math.abs(dx) > 0.85 || Math.abs(dy) > PH * 0.52 + 0.3) return;
    const foe = h.look ? FOES[h.look] : null, name = foe ? foe.name : h.kind === 'virus' ? 'virus' : 'free radical';
    if (foe && !foe.stomp) { if (P.inv > 0 || P.shield > 0) return; P.inv = 1.3; P.vx = dx >= 0 ? 7 : -7; P.vy = 5; toast(foe.msg, 3.5); hurt(true); return; } /* real wildlife is never stomped: you just get bumped */
    if ((P.vy < -1 && P.y > h.y - 0.25) || P.shield > 0) { h.alive = false; h.m.visible = false; if (P.shield <= 0) P.vy = 12; L.score += 50; popup(h.x, h.y, '+50', '#ffd166'); burst(h.x, h.y, h.kind === 'virus' ? '#9be36b' : '#ff6b4a'); beep(900, 0.12, 'square', 'pop, ' + name + ' stopped'); hud(); return; }
    if (P.inv > 0) return;
    P.inv = 1.3; P.vx = dx >= 0 ? 9 : -9; P.vy = 7; toast(h.kind === 'virus' ? 'Ouch! A virus got you. Jump on top of it, or jump over it.' : 'Ouch! Free radicals damage cells. Jump on top of them instead.', 3); hurt(true);
  });
  L.spikes.forEach(function (sp) {
    if (P.inv > 0 || P.shield > 0 || P.x + HW < sp.x0 || P.x - HW > sp.x1 || P.y > sp.y + 0.55 || P.y < sp.y - 0.2) return;
    P.inv = 1.3; P.vy = 11; toast('Ouch! Toxin crystals. Jump over them.', 3); hurt(true);
  });
  if (P.shield > 0) { P.shield -= dt; if (P.shieldM) P.shieldM.rotation.y += dt * 4; if (P.shield <= 0 && P.shieldM) { P.m.remove(P.shieldM); P.shieldM = null; toast('Shield used up.', 2); } }
  if (L.rare && !L.rare.got) { L.rare.m.rotation.y += dt * 2; L.rare.m.position.y = L.rare.y + Math.sin(P.t * 2) * 0.2;
    if (Math.abs(P.x - L.rare.x) < 1 && Math.abs(P.y + 0.7 - L.rare.y) < 1.1) { L.rare.got = true; L.rare.m.visible = false; L.score += 500; S.rare[L.lv.id] = true; save(); award('first-rare'); checkBig(); popup(L.rare.x, L.rare.y, (L.rare.name ? L.rare.name + '! ' : 'Rare specimen! ') + '+500', '#ffd700'); if (L.rare.fact) toast('✦ Rare specimen: ' + L.rare.name + '. ' + L.rare.fact, 7); burst(L.rare.x, L.rare.y, '#ffd700'); beep(1320, 0.4, 'triangle', 'sparkle, rare specimen found'); hud(); } }
  L.fx = L.fx.filter(function (f) {
    f.t += dt; f.o.position.x += (f.vx || 0) * dt; f.o.position.y += f.vy * dt; f.o.material.opacity = Math.max(0, 1 - f.t / f.life);
    if (f.t >= f.life) { L.group.remove(f.o); return false; } return true;
  });
  L.boosts.forEach(function (bt) {
    if (bt.got) return; bt.m.position.y = bt.y + Math.sin(P.t * 3) * 0.15;
    if (Math.abs(P.x - bt.x) < 0.9 && Math.abs(P.y + 0.7 - bt.y) < 1.1 && bt.kind === 'life') {
      bt.got = true; bt.m.visible = false; L.lives = Math.min(9, L.lives + 1); popup(bt.x, bt.y, 'Extra life!', '#ff8fb1'); beep(1400, 0.3, 'triangle', 'jingle, extra life'); hud(); return;
    }
    if (Math.abs(P.x - bt.x) < 0.9 && Math.abs(P.y + 0.7 - bt.y) < 1.1 && bt.kind === 'shield') {
      bt.got = true; bt.m.visible = false; P.shield = 8; if (!P.shieldM) { P.shieldM = new T.Mesh(G.tor, basic('#7fd4ff', 0.45, true)); P.shieldM.scale.setScalar(0.95); P.shieldM.position.y = 0.75; P.m.add(P.shieldM); }
      L.score += 25; popup(bt.x, bt.y, 'Shield!', '#7fd4ff'); beep(1000, 0.25, 'triangle', 'hum, shield on'); toast('Shield on: enemies and spikes cannot hurt you for 8 seconds!', 3); hud(); return;
    }
    if (Math.abs(P.x - bt.x) < 0.9 && Math.abs(P.y + 0.7 - bt.y) < 1.1) {
      bt.got = true; bt.m.visible = false; P.boost = 6; if (!P.boostM) { P.boostM = glow('#c8ff7a', 3.2, 0.6); P.boostM.position.y = 0.7; P.m.add(P.boostM); }
      L.score += 25; beep(1100, 0.2, 'triangle', 'whoosh, ATP boost'); toast('ATP boost: extra energy to run faster and jump higher for 6 seconds!', 3); hud();
    }
  });
  P.hist.unshift({ x: P.x, y: P.y }); if (P.hist.length > 300) P.hist.pop();
  P.trail.forEach(function (g, k) { const h = P.hist[Math.min(P.hist.length - 1, (k + 1) * 9)]; g.position.set(h.x, h.y + 0.6, -0.4); });
  L.sparks.forEach(function (s) { if (!s.got && Math.abs(P.x - s.x) < 0.7 && Math.abs(P.y + 0.7 - s.y) < 0.9) { s.got = 1; s.m.visible = false; L.score += s.val || 10; L.coins++; if (s.val) { popup(s.x, s.y + 0.6, '+' + s.val, '#d8b0ff'); if (stat('hidden') >= 10) award('hidden-10'); } beep(1200, 0.06, 'square'); if (L.coins >= 50) { L.coins -= 50; L.lives = Math.min(9, L.lives + 1); popup(P.x, P.y + 1, 'Extra life!', '#7be0ad'); beep(1400, 0.3, 'triangle', 'jingle, extra life'); } hud(); } s.m.rotation.y += dt * 3; });
  L.tokens.forEach(function (t) {
    if (t.got) return; t.gem.rotation.y += dt * 2;
    if (Math.abs(P.x - t.x) < 0.8 && Math.abs(P.y + 0.7 - t.y) < 0.95) {
      t.got = 1; t.m.visible = false; L.total++;
      record({ code: t.door.set.code }, t.it.good);
      if (t.it.good) { L.first++; L.streak++; L.score += 50; t.door.got++; doorText(t.door); beep(880, 0.15, 'sine', 'chime, correct'); toast('✓ ' + t.it.text, 2.5);
        if (t.door.got >= t.door.need) { t.door.solid.off = true; t.door.mesh.visible = false; t.door.label.visible = false; toast('✓ All collected. The gate is open.', 3); } }
      else { toast('✗ ' + t.it.text + ': ' + t.it.explain, 6); miss(); }
      hud();
    }
  });
  let near = null;
  L.stations.forEach(function (st) { if (!st.done && P.x > st.x0 && P.x < st.x1) near = st; if (st.boss && st.boss.m.visible) { st.boss.m.position.y = st.boss.y + Math.sin(P.t * 2) * 0.5; st.boss.m.rotation.y = Math.sin(P.t) * 0.4; } });
  if (near !== L.active && !(L.active && (L.active.clue || L.active.portal || L.active.refuel))) { if (near) openQ(near); else closeQ(); }
  let zone = null; L.zones.forEach(function (z) { if (!z.done && P.x > z.x0 && P.x < z.x1) zone = z; });
  if (!near && !(L.active && L.active.refuel)) { if (zone !== L.zone) { L.zone = zone; if (!zone || zone.kind !== 'become') setBadge(null); if (zone) showZone(zone); else closeQ(); } } else L.zone = null;
  L.zones.forEach(function (z) { zoneTick(z, dt); });
  L.atps.forEach(function (a) { if (!a.got && Math.abs(P.x - a.x) < 0.9 && Math.abs(P.y + 0.7 - a.y) < 1.1) { a.got = true; a.m.visible = false; setATP(true); beep(990, 0.12, 'triangle', 'sparkle, picked up ATP'); toast('You picked up ATP: energy a pump can use.', 3); } if (!a.got) a.m.position.y = a.y + Math.sin(P.t * 3) * 0.15; });
  if (P.atpM) P.atpM.position.set(Math.cos(P.t * 4) * 0.7, 1.1, Math.sin(P.t * 4) * 0.7);
  L.spin.forEach(function (t) { t.rotation.z += dt * 2; });
  L.refuels.forEach(function (r) { r.ring.position.y = 0.3 + (r.used ? 0 : Math.abs(Math.sin(P.t * 2)) * 0.9); r.ring.material.opacity = r.used ? 0.15 : 0.8; r.ring.rotation.z += dt;
    if (!r.used && !r.told && !L.active && nearRefuel() === r) { r.told = true; toast('⛽ Refuel Station: press E for an optional bonus quiz (+40 per right answer). You can leave any time.', 4); } });
  if (L.active && L.active.refuel && !S.set.low && Math.random() < dt * 8) { const g = glow('#5ff5e6', 0.8, 0.9); g.position.set(P.x + (Math.random() - 0.5) * 1.2, P.y + Math.random() * 0.4, 0.6); L.group.add(g); L.fx.push({ o: g, t: 0, vx: 0, vy: 2.2, life: 0.7 }); }
  if (actEdge) {
    actEdge = false;
    if (L.active && L.active.refuel) refuelNav('next');
    else if (L.active && L.active.portal) tryCode();
    else if (L.active && L.active.clue) $('qfb').textContent = 'Press the letter of your answer, or Esc to close.';
    else if (L.active) $('qfb').textContent = L.active.lock ? 'Press a number key from 1 to 5.' : 'Press the letter of your answer.';
    else { const k = nearScan(), cl = nearClue(), pt = nearPortal(), rf = nearRefuel(); if (rf) openRefuel(rf); else if (k) doScan(k); else if (cl) openClue(cl); else if (pt) { if (pt.open) enterMini(pt); else openPortalPanel(); } else if (S.alien.gear === 3 && !P.ground && !zoneTarget(L.zone)) buildProtein(); else if (L.zone) zoneAct(L.zone); }
  }
  L.scans.forEach(function (k) {
    k.t += dt; k.ring.rotation.y += dt * 2; const g = k.g, u = g.userData, by = k.y;
    if (u.hop) { const close = Math.abs(P.x - k.x) < 3; g.position.y = by + (close ? Math.abs(Math.sin(k.t * 6)) * 0.6 : 0); }
    if (u.grow) { const sc = 0.75 + 0.25 * Math.sin(k.t * 0.8); g.scale.set(1, sc, 1); }
    if (u.wiggle) g.rotation.z = Math.sin(k.t * 5) * 0.12;
    if (u.spin) g.rotation.y += dt;
    if (u.bob) g.position.y = by + Math.sin(k.t * 2) * 0.08;
    const nr = nearScan() === k; k.nm.scale.set(nr ? 3.6 : 3, nr ? 1.8 : 1.5, 1);
    if (nr && !k.done && !k.told && !L.active) { k.told = true; toast('Press E to scan the ' + k.sc.name + '.', 3); }
  });
  if (S.alien.gear !== 1 && !L.toldGhost && L.ghosts.some(function (q) { return Math.abs(q.x - P.x) < 3 && Math.abs(q.y - P.y) < 5; })) { L.toldGhost = true; toast(tx('h.ghost'), 6); }
  if (S.alien.gear === 1 && !L.toldSecret && L.secrets.some(function (q) { return Math.abs(q.x - P.x) < 6; })) { L.toldSecret = true; toast('Your Lab goggles reveal a hidden path! Look for the glowing purple platforms.', 4); }
  if (L.portal) { const p = L.portal; p.swirl.rotation.z += dt * (p.open ? 3 : 0.8); p.swirl.material.opacity = 0.35 + Math.sin(P.t * 3) * 0.12;
    if (nearPortal() && !L.active && !p.told) { p.told = true; toast(p.open ? 'Press E to enter the portal.' : 'A locked portal! Press E to see the code it needs.', 3); } else if (!nearPortal()) p.told = false; }
  L.clues.forEach(function (c) { if (!c.told && !L.active && Math.abs(P.x - c.x) < 1.4 && Math.abs(P.y - c.y) < 1.5) { c.told = true; toast('A portal clue! Press E to read it.', 3); } });
  L.helps.forEach(function (h) { h.material.opacity = 0.55 + 0.4 * Math.sin(P.t * 6); });
  L.models.forEach(function (md) { modelTick(md, dt, L.zones.find(function (z) { return z.model === md; })); });
  L.flies = L.flies.filter(function (f) {
    f.t += dt * 1.4; const u = Math.min(1, f.t), wp = new T.Vector3(); f.md.g.getWorldPosition(wp);
    f.o.position.set(f.x0 + (wp.x - f.x0) * u, f.y0 + (wp.y - f.y0) * u + Math.sin(u * Math.PI) * 3, wp.z * u); f.o.scale.setScalar(1 - u * 0.6);
    if (u >= 1) {
      L.group.remove(f.o);
      if (f.p) { f.p.g.visible = true; f.p.s = 0; f.p.lb.visible = true; burst(wp.x, wp.y, '#7be0ad'); beep(880, 0.15, 'sine', 'click, part snaps into place'); }
      else { burst(wp.x, wp.y, '#ff6b6b'); beep(180, 0.3, 'sawtooth', 'buzz, part does not fit'); const t = f.tok; t.got = false; t.g.visible = true; t.cool = 1.5; }
      return false;
    }
    return true;
  });
  if (noteT > 0) { noteT -= dt; if (noteT <= 0) $('note').hidden = true; }
  if (L.goal) { L.goal.m.position.y = L.goal.y + 6.6 + Math.sin(P.t * 2) * 0.2; L.goal.m.rotation.y += dt; L.goal.beam.material.opacity = 0.12 + Math.sin(P.t * 5) * 0.05; if (Math.abs(P.x - L.goal.x) < 1.3 && !L.over) beamUp(); }

  P.m.position.set(P.x, P.y + (P.ground ? Math.abs(Math.sin(P.t * 11)) * 0.07 * Math.min(1, Math.abs(P.vx) / 3) : 0), 0);
  P.m.rotation.y += (P.face * 0.75 - P.m.rotation.y) * Math.min(1, dt * 10);
  { const sp = Math.abs(P.vx), u = P.m.userData; P.stride = (P.stride || 0) + dt * sp * 2.2; const amp = P.ground ? Math.min(1, sp / SPEED) * 0.75 : 0;
    if (u.legs) u.legs.forEach(function (h, i) { h.rotation.x = P.ground ? Math.sin(P.stride + i * Math.PI) * amp : -0.5; });
    if (u.tents) u.tents.forEach(function (t, i) { t.rotation.x = Math.sin(P.stride + i * 1.6) * (amp * 0.6 + 0.08); });
    if (P.ground && sp > SPEED * 1.2 && (P.dustT = (P.dustT || 0) - dt) < 0 && !S.set.low) { P.dustT = 0.1; const d = glow('#e8dcc8', 0.7, 0.6); d.position.set(P.x - P.face * 0.45, P.y + 0.15, 0.4); L.group.add(d); L.fx.push({ o: d, t: 0, vx: -P.face * 1.5, vy: 0.8, life: 0.35 }); } }
  P.m.visible = !(P.inv > 0 && Math.floor(P.t * 12) % 2);
  const sq = P.duck ? 0.58 : P.ground ? 1 : 1 + Math.min(0.18, Math.abs(P.vy) * 0.012); P.m.scale.set(P.duck ? 1.2 : 1 / sq, sq, P.duck ? 1.2 : 1 / sq);
  P.shadow.position.set(P.x, (P.ground ? P.y : P.y - 0.5) + 0.04, 0); P.shadow.visible = !!P.ground;
  cam.position.x += (P.x + P.face * 2.5 - cam.position.x) * Math.min(1, dt * 4);
  const lift = L.active && L.active.chart ? 2.4 : L.inCave ? -1.8 : 0;
  cam.position.y += (P.y + 5.2 + lift - cam.position.y) * Math.min(1, dt * 3); cam.position.z = camZ;
  if (L.shake > 0) { L.shake -= dt; cam.position.x += (Math.random() - 0.5) * L.shake; cam.position.y += (Math.random() - 0.5) * L.shake; }
  cam.lookAt(cam.position.x, cam.position.y - 0.6, 0);
  sceneryTick(dt, P.t);
  L.anim.forEach(function (a) { if (a.sway) { a.m.rotation.z = Math.sin(P.t * 0.8 + a.ph) * 0.08; return; } a.m.position.y = a.y + Math.sin(P.t * 0.6 + a.ph) * a.amp; a.m.rotation.z += a.rot * dt; });
}
let LAST = null, STTAB = 'report', PQ = null;
function finish() {
  L.over = true; mode = 'done'; closeQ(); LAST = { w: L.world, lv: L.lv }; noteT = 0; $('note').hidden = true;
  const acc = L.total ? L.first / L.total : 1, stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const runT = L.time + L.pen, bonus = Math.max(0, Math.round(240 - runT)) * 2; L.score += bonus;
  const before = totalStars(), old = S.levels[L.lv.id] || { stars: 0, best: 0 };
  const tm = Math.round(runT * 10) / 10, newBestT = !old.time || tm < old.time;
  S.levels[L.lv.id] = { stars: Math.max(old.stars, stars), best: Math.max(old.best, L.score), time: newBestT ? tm : old.time }; save();
  if (!L.helped && L.first > 0) award('no-help'); if (tm < 180) award('speedy'); checkBig();
  BQ.Leaderboard.submit(S.nick, totalScore());
  const after = totalStars(), got = GEAR.filter(function (g) { return g[1] > before && g[1] <= after; });
  Music.stop(); [523, 659, 784, 1047].forEach(function (f, k) { setTimeout(function () { beep(f, k === 3 ? 0.6 : 0.18, 'triangle', k === 0 ? 'fanfare, level complete' : null); }, k * 120); });
  $('doneTitle').textContent = L.lv.id + ' ' + L.lv.title + ': report sent';
  $('doneStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars); $('doneStars').setAttribute('aria-label', stars + ' of 3 stars');
  $('doneBody').innerHTML = '<p>' + esc(L.lv.outro || '') + '</p><dl><dt>Score</dt><dd>' + L.score + (L.score > old.best && old.best ? ' (new best)' : '') + '</dd><dt>' + esc(tx('r.time')) + '</dt><dd>' + fmtTimeT(tm) + (newBestT && old.time ? ' (' + esc(tx('r.newBestTime')) + ')' : old.time ? ' (' + esc(tx('r.bestTime', { t: fmtTimeT(old.time) })) + ')' : '') + (L.pen ? '<br><small>Includes +' + L.pen + ' s for ' + L.wrongs + ' wrong ' + (L.wrongs === 1 ? 'choice' : 'choices') + '</small>' : '') + '</dd><dt>Right on the first try</dt><dd>' + L.first + ' of ' + L.total + '</dd><dt>Speed bonus</dt><dd>' + bonus + '</dd>' + (L.rare ? '<dt>Rare specimen</dt><dd>' + (L.rare.got ? 'Found!' : (S.rare[L.lv.id] ? 'Found on an earlier visit' : 'Still hidden in this level')) + '</dd>' : '') + '</dl>' +
    (L.debrief ? '<h3>Lab Lock debrief</h3><ul class="debrief">' + L.debrief.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' : '') +
    (got.length ? '<p class="unlock">New gear unlocked: ' + got.map(function (g) { return esc(g[0]); }).join(', ') + '. Put it on in the Wardrobe.</p>' : '');
  S.bank = (S.bank || 0) + L.score; save();
  $('doneBody').innerHTML += '<p class="bank">+' + L.score + ' points added. You have <b>' + S.bank + '</b> points to spend in the Supply Shop.</p>';
  const list = allLevels(), i = list.findIndex(function (e) { return e.lv === L.lv; });
  $('btnNext').hidden = i >= list.length - 1; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true;
  menuScene(); show('done'); stationTab('report');
  ($('btnNext').hidden ? $('btnReplay') : $('btnNext')).focus();
}

/* ---------- PORTAL MINI-GAME: IMMUNE DEFENSE ----------
   You are inside a blood vessel. Germs float toward you. Each germ is covered in one antigen shape.
   Fire the antibody whose shape fits that antigen. Shape decides function, like a key in a lock. */
const ANTIGENS = [{ name: 'Triangle', geo: 'cone', col: '#ff6b6b', sym: '▲' }, { name: 'Cube', geo: 'box', col: '#7fd4ff', sym: '■' }, { name: 'Ring', geo: 'tor', col: '#ffd166', sym: '●' }, { name: 'Diamond', geo: 'oct', col: '#7be0ad', sym: '◆' }];
let M = null;
function enterMini(p) {
  if (p.game === 'golf') return enterGolf(p);
  if (p.game === 'dna') return enterDNA(p);
  closeQ(); mode = 'mini'; Object.keys(keys).forEach(function (k) { keys[k] = false; });
  M = { p: p, grp: new T.Group(), germs: [], shots: [], fx: [], t: 0, hearts: 3, score: 0, tagged: 0, wrong: 0, sel: 0, cx: 0, cy: -0.05, spawn: 1.2, dur: 50, cool: 0, k: {}, intro: true, over: false, boost: false,
    bg: scene.background, fog: scene.fog };
  scene.remove(L.group); scene.add(M.grp); scene.background = new T.Color('#2a0610'); scene.fog = new T.FogExp2('#3a0a16', 0.022);
  const tube = new T.Mesh(new T.CylinderGeometry(7, 7, 160, 28, 1, true), new T.MeshLambertMaterial({ color: '#b02a3a', emissive: '#3a0610', side: T.BackSide }));
  tube.rotation.x = Math.PI / 2; tube.position.z = -60; M.grp.add(tube);
  M.cells = [];
  for (let i = 0; i < (S.set.low ? 14 : 30); i++) { const c = new T.Mesh(G.tor, emat('#e0384a', '#5a0a14')); c.scale.set(0.5, 0.5, 0.35); const a = Math.random() * 6.3, r = 3 + Math.random() * 3.4; c.position.set(Math.cos(a) * r, Math.sin(a) * r, -Math.random() * 120); c.rotation.set(Math.random() * 3, Math.random() * 3, 0); M.grp.add(c); M.cells.push(c); }
  $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; $('note').hidden = true; $('mini').hidden = false;
  $('miniPick').innerHTML = ANTIGENS.map(function (a, i) { return '<button type="button" data-ab="' + i + '" style="--c:' + a.col + '"><span class="ys">Y</span><span style="color:' + a.col + '">' + a.sym + '</span> ' + (i + 1) + '</button>'; }).join('');
  miniPanel('<h2>🛡️ Immune Defense</h2><p>The portal pulled you <b>inside a blood vessel</b>. Germs are floating toward you!</p>' +
    '<p>Every germ is covered in <b>antigens</b>: shapes on its surface. Your weapons are <b>antibodies</b>: Y-shaped proteins. Each antibody fits only <b>one</b> antigen shape, like a key fits one lock.</p>' +
    '<p><b>Match the shape to tag the germ.</b> A wrong shape just bounces off.</p><p class="dim">Aim: move the mouse (or arrow keys). Fire: click (or space). Pick an antibody: keys 1 to 4. Don\'t let 3 germs get past you!</p>' +
    '<button type="button" id="miniGo" class="primary">Start</button>');
  miniSel(0); camMini(); setTimeout(function () { const b = $('miniGo'); if (b) b.focus(); }, 50);
}
function camMini() { cam.position.set(0, 0, 10); cam.lookAt(0, 0, -40); }
function miniPanel(html) { $('miniCard').innerHTML = html; $('miniCard').hidden = !html; }
function miniSel(i) { M.sel = i; document.querySelectorAll('#miniPick [data-ab]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.ab === i ? 'true' : 'false'); }); }
function miniHud() { $('miniTop').textContent = '♥'.repeat(M.hearts) + '♡'.repeat(3 - M.hearts) + '   Tagged: ' + M.tagged + '   Score: ' + M.score + '   Time: ' + Math.max(0, Math.ceil(M.dur - M.t)); }
function miniGerm() {
  const ty = Math.floor(Math.random() * ANTIGENS.length), A = ANTIGENS[ty], g = new T.Group(), body = new T.Mesh(G.sph, emat('#b49ad0', '#4a3060')); body.scale.setScalar(1.25); g.add(body);
  const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0.7, 0.7, 0], [-0.7, 0.7, 0], [0.7, -0.7, 0], [-0.7, -0.7, 0], [0, 0.7, 0.7], [0.7, 0, 0.7], [-0.7, 0, 0.7]];
  dirs.forEach(function (d) { const v = new T.Vector3(d[0], d[1], d[2]).normalize(), sp = new T.Mesh(G[A.geo], emat(A.col, '#333333')); sp.scale.setScalar(A.geo === 'cone' ? 0.3 : A.geo === 'tor' ? 0.27 : 0.34); if (A.geo === 'cone') sp.scale.y = 0.34; sp.position.copy(v.multiplyScalar(1.4)); sp.lookAt(v.clone().multiplyScalar(3)); if (A.geo === 'cone') sp.rotateX(Math.PI / 2); g.add(sp); });
  g.add(glow(A.col, 4.5, 0.35)); const tag = label(A.sym, 1.6, { bd: A.col, big: true }); tag.position.y = 2.3; g.add(tag);
  const a = Math.random() * 6.3, r = Math.random() * 3.2; g.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.75, -75);
  M.grp.add(g); M.germs.push({ g: g, ty: ty, sp: 7 + Math.min(6, M.t * 0.12) + Math.random() * 2, alive: true, spin: (Math.random() - 0.5) * 2 });
}
function miniFire() {
  if (M.cool > 0 || M.intro || M.over) return; M.cool = M.boost ? 0.14 : 0.32;
  const A = ANTIGENS[M.sel], ab = new T.Group(), mt = emat(A.col, '#444444');
  const st = new T.Mesh(G.cyl, mt); st.scale.set(0.05, 0.3, 0.05); st.position.y = -0.15; ab.add(st);
  [-1, 1].forEach(function (sd) { const arm = new T.Mesh(G.cyl, mt); arm.scale.set(0.045, 0.24, 0.045); arm.position.set(sd * 0.08, 0.08, 0); arm.rotation.z = -sd * 0.6; ab.add(arm); });
  ab.add(glow(A.col, 1.2, 0.6));
  /* find the germ under the crosshair */
  let best = null, bz = -1e9; const v = new T.Vector3();
  M.germs.forEach(function (gm) { if (!gm.alive) return; v.copy(gm.g.position).project(cam); const e = gm.g.position.clone(); e.x += 1.6; e.project(cam); const rad = Math.abs(e.x - v.x) * 1.15;
    const dx = v.x - M.cx, dy = (v.y - M.cy) / cam.aspect; if (Math.sqrt(dx * dx + dy * dy) < rad + 0.03 && gm.g.position.z > bz) { bz = gm.g.position.z; best = gm; } });
  const from = new T.Vector3(0, -1.6, 7.5), to = best ? best.g.position.clone() : new T.Vector3(M.cx * 30, M.cy * 18, -60);
  ab.position.copy(from); M.grp.add(ab); M.shots.push({ o: ab, from: from, to: to, t: 0, dur: Math.max(0.15, from.distanceTo(to) / 90), target: best, ty: M.sel });
  beep(900, 0.06, 'square');
}
function miniStep(dt) {
  camMini(); M.cells.forEach(function (c) { c.position.z += dt * 8; c.rotation.x += dt; if (c.position.z > 10) c.position.z -= 130; });
  const kx = (M.k.right ? 1 : 0) - (M.k.left ? 1 : 0), ky = (M.k.up ? 1 : 0) - (M.k.down ? 1 : 0);
  M.cx = Math.max(-0.95, Math.min(0.95, M.cx + kx * dt * 1.3)); M.cy = Math.max(-0.9, Math.min(0.9, M.cy + ky * dt * 1.3));
  const c = $('stage'), ch = $('miniAim'); ch.style.left = ((M.cx + 1) / 2 * c.clientWidth) + 'px'; ch.style.top = ((1 - M.cy) / 2 * c.clientHeight) + 'px';
  if (M.k.fire) miniFire();
  M.fx = M.fx.filter(function (f) { f.t += dt; f.o.scale.setScalar(f.s0 * (1 + f.t * 3)); f.o.traverse(function (o) { if (o.material) o.material.opacity = Math.max(0, 1 - f.t / 0.4); }); if (f.t > 0.4) { M.grp.remove(f.o); return false; } return true; });
  if (M.intro || M.over) return;
  M.t += dt; M.cool -= dt;
  if (!M.boost && M.t > 25) { M.boost = true; miniFlash('Memory cells! Your body remembers these germs, so your antibodies now fire twice as fast.', '#7be0ad', 3.5); beep(880, 0.4, 'triangle', 'power-up, memory cells'); }
  M.spawn -= dt; if (M.spawn <= 0 && M.t < M.dur - 3) { miniGerm(); M.spawn = Math.max(0.65, 1.5 - M.t * 0.02); }
  M.germs.forEach(function (gm) {
    if (!gm.alive) return; gm.g.position.z += gm.sp * dt; gm.g.rotation.y += gm.spin * dt; gm.g.rotation.x += gm.spin * dt * 0.5;
    if (gm.g.position.z > 6) { gm.alive = false; M.grp.remove(gm.g); M.hearts--; miniFlash('A germ got past you!', '#ff6b6b', 1.5); beep(150, 0.4, 'sawtooth', 'thud, a germ got past'); if (M.hearts <= 0) miniEnd(); }
  });
  M.germs = M.germs.filter(function (gm) { return gm.alive || false; });
  M.shots = M.shots.filter(function (sh) {
    sh.t += dt; const u = Math.min(1, sh.t / sh.dur); if (sh.target && sh.target.alive) sh.to.copy(sh.target.g.position);
    sh.o.position.lerpVectors(sh.from, sh.to, u); sh.o.rotation.z += dt * 10;
    if (u < 1) return true;
    M.grp.remove(sh.o); const gm = sh.target;
    if (gm && gm.alive) {
      if (gm.ty === sh.ty) { gm.alive = false; M.tagged++; M.score += 50; gm.g.traverse(function (o) { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; } }); M.fx.push({ o: gm.g, t: 0, s0: 1 }); beep(1200, 0.12, 'triangle', 'pop, germ tagged'); if (M.tagged % 5 === 1) miniFlash('Tagged! The antibody fits the ' + ANTIGENS[gm.ty].name.toLowerCase() + ' antigen. A phagocyte will eat this germ.', '#7be0ad', 2.2); }
      else { M.wrong++; miniFlash('Bounced off! A ' + ANTIGENS[sh.ty].name.toLowerCase() + ' antibody does not fit a ' + ANTIGENS[gm.ty].name.toLowerCase() + ' antigen.', '#ffb09c', 2.2); beep(220, 0.15, 'sawtooth', 'boing, wrong shape'); gm.g.position.z -= 4; }
    }
    return false;
  });
  if (M.t >= M.dur) miniEnd();
  miniHud(); if (M.flashT > 0) { M.flashT -= dt; if (M.flashT <= 0) $('miniMsg').hidden = true; }
}
function miniFlash(t, col, secs) { const m = $('miniMsg'); m.textContent = t; m.style.borderColor = col; m.hidden = false; M.flashT = secs; }
function miniEnd() {
  if (M && M.tagged >= 15) award('immune');
  if (M.over) return; M.over = true; const bonus = M.hearts * 100; M.score += bonus;
  miniPanel('<h2>' + (M.hearts > 0 ? '🛡️ Infection stopped!' : '🛡️ Defense over') + '</h2><p>You tagged <b>' + M.tagged + '</b> germs' + (M.hearts ? ' and kept ' + M.hearts + ' hearts (+' + bonus + ')' : '') + '. Score: <b>' + M.score + '</b></p>' +
    '<p><b>What really happens:</b> B cells make antibodies that fit one antigen shape. Antibodies tag germs so phagocytes (like white blood cells) can eat them. <b>Memory cells</b> remember the antigen, so the next time your body fights back faster. That is how vaccines work.</p>' +
    '<p class="dim">Big idea: a protein\'s <b>shape</b> decides its <b>job</b>. Enzymes, antibodies, and transport proteins all work this way.</p>' +
    '<button type="button" id="miniBack" class="primary">Return through the portal</button>');
  setTimeout(function () { const b = $('miniBack'); if (b) b.focus(); }, 50);
}
function exitMini() {
  scene.remove(M.grp); disposeGroup(M.grp); scene.background = M.bg; scene.fog = M.fog; scene.add(L.group);
  ['dnaRule', 'dnaWheel'].forEach(function (id) { const el = $(id); if (el) el.remove(); });
  L.score += M.score; (M.kind === 'golf' ? ['Enzyme', 'Active site', 'Substrate', 'Denature'] : M.kind === 'dna' ? ['Replication', 'Transcription', 'Translation', 'Codon'] : ['Antibody', 'Antigen']).forEach(function (w) { S.words[w] = 1; }); save(); $('miniAim').hidden = false; $('miniPow').hidden = true;
  $('mini').hidden = true; $('hud').hidden = false; $('touch').hidden = !touchMode; mode = 'play'; P.x = M.p.x + 2.2; P.y = M.p.y; P.vx = P.vy = 0; P.inv = 1.5;
  cam.position.set(P.x + 2.5, P.y + 5.2, camZ); toast('Back from the portal with +' + M.score + ' points!', 4); hud(); M = null; Object.keys(keys).forEach(function (k) { keys[k] = false; });
}
function miniKey(e, down) {
  if (!M) return; if (M.kind === 'golf') return golfKey(e, down); if (M.kind === 'dna') return dnaKey(e, down); const k = e.key;
  if (down && M.intro && (k === 'Enter' || k === ' ')) { e.preventDefault(); miniStart(); return; }
  if (down && M.over && (k === 'Enter' || k === ' ' || k === 'e' || k === 'E')) { e.preventDefault(); exitMini(); return; }
  if (/^[1-4]$/.test(k) && down) { miniSel(+k - 1); return; }
  const map = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ' ': 'fire', Enter: 'fire' };
  if (map[k]) { M.k[map[k]] = down; e.preventDefault(); }
}
function miniStart() { M.intro = false; miniPanel(''); beep(600, 0.2, 'triangle', 'go'); if (M.kind === 'golf') golfHole(0); else if (M.kind === 'dna') dnaCard(1); else miniHud(); }
/* ---------- PORTAL MINI-GAME: ENZYME MINI GOLF ----------
   Putt the substrate (the ball) into the enzyme whose ACTIVE SITE has the same shape. Wrong shapes, and
   enzymes whose shape was changed by heat or the wrong pH (denatured), will not hold the substrate. */
const GOLFSHAPE = { square: { seg: 4, sym: '■' }, triangle: { seg: 3, sym: '▲' }, circle: { seg: 24, sym: '●' } };
const HOLES = [
  { sub: { name: 'Starch', shape: 'square', col: '#ffd166' }, env: 'Hole 1 · In the mouth · 37 °C · pH 7', start: [-10, 0],
    cups: [{ x: 9, z: -4, name: 'Amylase', shape: 'square', ok: true }, { x: 9, z: 4, name: 'Protease', shape: 'triangle', why: 'Protease breaks down proteins. Its active site does not fit starch.' },
      { x: 3, z: 0, name: 'Lipase', shape: 'circle', why: 'Lipase breaks down fats. Its active site does not fit starch.' }],
    bumpers: [[-3, -3, 1], [-3, 3, 1], [3, -5.5, 0.8]], fact: 'Amylase (in saliva) breaks starch into sugars. Each enzyme fits only its own substrate, like a key in a lock.' },
  { sub: { name: 'Protein', shape: 'triangle', col: '#ff8fb1' }, env: 'Hole 2 · In the stomach · 37 °C · pH 2 (very acidic)', start: [-10, 3],
    cups: [{ x: 9, z: 3, name: 'Trypsin (works best at pH 8)', shape: 'triangle', denat: true, why: 'Trypsin works best at pH 8. In strong stomach acid its active site changes shape (it is denatured), so the protein no longer fits.' },
      { x: 8, z: -4, name: 'Pepsin (works best at pH 2)', shape: 'triangle', ok: true }, { x: 0, z: 5, name: 'Amylase', shape: 'square', why: 'Amylase breaks down starch. Its active site does not fit a protein.' }],
    bumpers: [[-2, 0, 1.2], [3, -2, 0.9], [4, 3.5, 0.8]], fact: 'Pepsin works in the acid of the stomach. pH changes an enzyme\'s shape, so each enzyme works best at its own pH.' },
  { sub: { name: 'Fat', shape: 'circle', col: '#7be0ad' }, env: 'Hole 3 · In the small intestine · 37 °C · pH 8', start: [-10, -3],
    cups: [{ x: 2, z: -5, name: 'Lipase (heated to 70 °C)', shape: 'circle', denat: true, why: 'This lipase was heated to 70 °C. High heat denatured it: its active site lost its shape.' },
      { x: 9, z: 1, name: 'Lipase', shape: 'circle', ok: true }, { x: 4, z: 5, name: 'Pepsin', shape: 'triangle', why: 'Pepsin breaks down proteins, and it works in acid, not here. Its active site does not fit fat.' }],
    bumpers: [[-4, -1, 1], [0, 1.5, 1], [5, -1.5, 0.9]], fact: 'Lipase breaks fats into fatty acids and glycerol. Enzymes work best near body temperature; too much heat denatures them.' }];
function enterGolf(p) {
  closeQ(); mode = 'mini'; Object.keys(keys).forEach(function (k) { keys[k] = false; });
  M = { kind: 'golf', p: p, grp: new T.Group(), hi: -1, strokes: 0, score: 0, k: {}, intro: true, over: false, aim: 0, pow: 0, charging: false, ball: null, cups: [], bumpers: [], t: 0, bg: scene.background, fog: scene.fog };
  scene.remove(L.group); scene.add(M.grp); scene.background = new T.Color('#0b1d2a'); scene.fog = null;
  const felt = new T.Mesh(new T.PlaneGeometry(26, 16), new T.MeshLambertMaterial({ color: '#2f8a5a', emissive: '#0a2a1a' })); felt.rotation.x = -Math.PI / 2; M.grp.add(felt);
  [[0, -8.3, 26.6, 0.6], [0, 8.3, 26.6, 0.6], [-13.3, 0, 0.6, 17.2], [13.3, 0, 0.6, 17.2]].forEach(function (w) { const m = new T.Mesh(G.box, emat('#8a5ac8', '#2a1a4a')); m.scale.set(w[2], 0.7, w[3]); m.position.set(w[0], 0.35, w[1]); M.grp.add(m); });
  for (let i = 0; i < 40; i++) { const st = glow('#9fd8ff', 1 + Math.random() * 2, 0.4); st.position.set((Math.random() - 0.5) * 80, 4 + Math.random() * 20, -20 - Math.random() * 30); M.grp.add(st); }
  M.aimLine = new T.Mesh(G.box, basic('#ffffff', 0.85)); M.grp.add(M.aimLine);
  $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; $('note').hidden = true; $('mini').hidden = false; $('miniPick').innerHTML = ''; $('miniAim').hidden = true; $('miniPow').hidden = false;
  miniPanel('<h2>⛳ Enzyme Mini Golf</h2><p><b>Enzymes</b> are proteins that speed up reactions. Each enzyme has an <b>active site</b>: a pocket with a special shape.</p>' +
    '<p>Your ball is the <b>substrate</b>. Putt it into the enzyme whose active site has the <b>same shape</b>. A wrong shape will not hold it.</p>' +
    '<p>Careful: <b>heat or the wrong pH</b> can change an enzyme\'s shape. That is called being <b>denatured</b>, and a denatured enzyme stops working.</p>' +
    '<p class="dim">Aim: move the mouse (or left and right arrows). Putt: hold the mouse button (or space) to charge, then let go. 3 holes. Fewer putts = more points.</p>' +
    '<button type="button" id="miniGo" class="primary">Start</button>');
  golfCam(); setTimeout(function () { const b = $('miniGo'); if (b) b.focus(); }, 50);
}
function golfCam() { const w = cam.aspect < 1.5 ? 1.25 : 1; cam.position.set(0, 20 * w, 15 * w); cam.lookAt(0, 0, 0.3); }
function golfHole(i) {
  M.cups.forEach(function (c) { M.grp.remove(c.g); }); M.bumpers.forEach(function (b) { M.grp.remove(b.m); }); if (M.ball) M.grp.remove(M.ball.m);
  M.hi = i; M.strokes = 0; M.cups = []; M.bumpers = []; const H = HOLES[i];
  H.bumpers.forEach(function (b) { const m = new T.Mesh(G.cyl, emat('#c59cff', '#3a1a6a')); m.scale.set(b[2], 0.8, b[2]); m.position.set(b[0], 0.4, b[1]); M.grp.add(m); M.bumpers.push({ x: b[0], z: b[1], r: b[2], m: m }); });
  H.cups.forEach(function (c) {
    const g = new T.Group(), sh = GOLFSHAPE[c.shape];
    const rim = new T.Mesh(G.tor, emat(c.denat ? '#c05050' : '#e8f4ff', '#333333')); rim.scale.set(1.05, 1.05, 0.8); rim.rotation.x = Math.PI / 2; rim.position.y = 0.05; g.add(rim);
    const hole = new T.Mesh(new T.CylinderGeometry(0.95, 0.95, 0.04, 24), basic('#08140e')); hole.position.y = 0.02; g.add(hole);
    const site = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.06, sh.seg), basic(c.denat ? '#ff6b6b' : '#ffffff', 0.9)); site.position.y = 0.05; site.rotation.y = c.shape === 'square' ? Math.PI / 4 : 0;
    if (c.denat) { site.scale.set(1.35, 1, 0.55); site.rotation.y = 0.7; }
    g.add(site); g.add(glow(c.denat ? '#ff6b6b' : '#9fe0ff', 3.2, 0.35));
    const lb = label((c.denat ? '🔥 ' : '') + c.name + ' ' + sh.sym, 4.2, { bd: c.denat ? '#ff6b6b' : '#9fe0ff' }); lb.position.set(0, 2.3, -0.6); g.add(lb);
    g.position.set(c.x, 0, c.z); M.grp.add(g); M.cups.push(Object.assign({ g: g, site: site, flash: 0 }, c));
  });
  const S2 = H.sub, sh = GOLFSHAPE[S2.shape], m = new T.Group(), body = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 0.5, sh.seg), emat(S2.col, '#444444'));
  body.position.y = 0.25; if (S2.shape === 'square') body.rotation.y = Math.PI / 4; m.add(body); m.add(glow(S2.col, 2, 0.5));
  const bl = label(S2.name + ' ' + sh.sym, 2.6, { bd: S2.col }); bl.position.y = 1.4; m.add(bl);
  M.grp.add(m); M.ball = { m: m, x: H.start[0], z: H.start[1], vx: 0, vz: 0, sink: 0 }; m.position.set(M.ball.x, 0, M.ball.z);
  M.aim = Math.atan2(-(H.cups.find(function (c) { return c.ok; }).z - H.start[1]), 1) * 0; golfMsg(H.env + '. Your substrate: ' + S2.name + ' ' + sh.sym + '. Find the enzyme with the matching active site.', '#9fe0ff', 5); golfHud();
}
function golfHud() { $('miniTop').textContent = 'Hole ' + (M.hi + 1) + ' of ' + HOLES.length + '   Putts: ' + M.strokes + '   Score: ' + M.score; $('miniPowFill').style.width = Math.round(M.pow * 100) + '%'; }
function golfMsg(t, col, secs) { miniFlash(t, col, secs); }
function golfStill() { const b = M.ball; return b && Math.hypot(b.vx, b.vz) < 0.12 && !b.sink; }
function golfShoot() {
  if (!golfStill() || M.intro || M.over) { M.charging = false; return; }
  const sp = 4 + M.pow * 17; M.ball.vx = Math.cos(M.aim) * sp; M.ball.vz = Math.sin(M.aim) * sp; M.strokes++; M.charging = false; M.pow = 0; beep(500, 0.08, 'triangle', 'tock, putt'); golfHud();
}
function golfStep(dt) {
  golfCam(); M.t += dt; if (M.flashT > 0) { M.flashT -= dt; if (M.flashT <= 0) $('miniMsg').hidden = true; }
  if (M.intro || M.over || !M.ball) return;
  const b = M.ball;
  if (M.k.left) M.aim -= dt * 1.8; if (M.k.right) M.aim += dt * 1.8;
  if (M.charging) { M.chargeT = (M.chargeT || 0) + dt; const u = (M.chargeT / 1.1) % 2; M.pow = u < 1 ? u : 2 - u; golfHud(); }
  /* aim line */
  const still = golfStill(); M.aimLine.visible = still;
  if (still) { const len = 1.5 + M.pow * 5; M.aimLine.scale.set(len, 0.06, 0.12); M.aimLine.position.set(b.x + Math.cos(M.aim) * (len / 2 + 0.6), 0.3, b.z + Math.sin(M.aim) * (len / 2 + 0.6)); M.aimLine.rotation.y = -M.aim; }
  if (b.sink) {
    b.sink += dt; const c = b.cup; b.x += (c.x - b.x) * Math.min(1, dt * 8); b.z += (c.z - b.z) * Math.min(1, dt * 8); b.m.position.set(b.x, -b.sink * 0.6, b.z); b.m.scale.setScalar(Math.max(0.05, 1 - b.sink));
    if (b.sink > 1.1) { if (M.strokes === 1) award('golf'); const pts = Math.max(100, 400 - 75 * (M.strokes - 1)); M.score += pts; golfMsg('✓ It fits! ' + HOLES[M.hi].fact + ' (+' + pts + ')', '#7be0ad', 6); if (M.hi + 1 < HOLES.length) { const fact = HOLES[M.hi].fact; golfHole(M.hi + 1); golfMsg('✓ It fits! ' + fact + ' Next: ' + HOLES[M.hi].env + '.', '#7be0ad', 9); } else golfEnd(); }
    return;
  }
  /* rolling, friction, walls, bumpers */
  const steps = 4;
  for (let k = 0; k < steps; k++) {
    const h = dt / steps; b.x += b.vx * h; b.z += b.vz * h;
    const sp = Math.hypot(b.vx, b.vz); if (sp > 0) { const ns = Math.max(0, sp - (0.9 + sp * 0.9) * h); b.vx *= ns / sp; b.vz *= ns / sp; }
    if (b.x < -12.6) { b.x = -12.6; b.vx = Math.abs(b.vx) * 0.8; } if (b.x > 12.6) { b.x = 12.6; b.vx = -Math.abs(b.vx) * 0.8; }
    if (b.z < -7.6) { b.z = -7.6; b.vz = Math.abs(b.vz) * 0.8; } if (b.z > 7.6) { b.z = 7.6; b.vz = -Math.abs(b.vz) * 0.8; }
    M.bumpers.forEach(function (bp) { const dx = b.x - bp.x, dz = b.z - bp.z, d = Math.hypot(dx, dz), mn = bp.r + 0.42; if (d < mn && d > 0) { const nx = dx / d, nz = dz / d, dot = b.vx * nx + b.vz * nz; b.x = bp.x + nx * mn; b.z = bp.z + nz * mn; if (dot < 0) { b.vx -= 2 * dot * nx * 0.9; b.vz -= 2 * dot * nz * 0.9; } beep(700, 0.03, 'square'); } });
    for (let ci = 0; ci < M.cups.length; ci++) {
      const c = M.cups[ci], dx = b.x - c.x, dz = b.z - c.z, d = Math.hypot(dx, dz), v = Math.hypot(b.vx, b.vz);
      if (d < 0.8 && v < 9) {
        if (c.ok) { b.sink = 0.01; b.cup = c; b.vx = b.vz = 0; beep(880, 0.3, 'sine', 'plink, substrate fits the active site'); burst2(c); return; }
        if (!c.bounced || M.t - c.bounced > 0.6) { c.bounced = M.t; const nx = d > 0.01 ? dx / d : -1, nz = d > 0.01 ? dz / d : 0; b.vx = nx * 5; b.vz = nz * 5; b.x = c.x + nx * 0.9; b.z = c.z + nz * 0.9; c.flash = 0.8;
          golfMsg('✗ Rolled right out! ' + (c.denat ? c.why : (c.why || 'The shapes do not match.')), '#ffb09c', 5); beep(200, 0.25, 'sawtooth', 'boing, does not fit'); M.wrongs = (M.wrongs || 0) + 1; }
      }
    }
  }
  M.cups.forEach(function (c) { if (c.flash > 0) { c.flash -= dt; c.g.position.y = Math.sin(c.flash * 40) * 0.05; } else c.g.position.y = 0; });
  b.m.position.set(b.x, 0, b.z); b.m.rotation.y += Math.hypot(b.vx, b.vz) * dt * 0.8;
}
function burst2(c) { const g = glow('#7be0ad', 5, 0.9); g.position.set(c.x, 0.6, c.z); M.grp.add(g); setTimeout(function () { if (M) M.grp.remove(g); }, 700); }
function golfEnd() {
  M.over = true; M.aimLine.visible = false;
  miniPanel('<h2>⛳ Course complete!</h2><p>Score: <b>' + M.score + '</b></p>' +
    '<p><b>What you showed:</b> an enzyme only works on the substrate that fits its <b>active site</b>. Amylase fits starch, pepsin and trypsin fit proteins, lipase fits fats.</p>' +
    '<p>An enzyme works best at its own <b>temperature and pH</b>. Too much heat, or the wrong pH, changes the active site\'s shape. The enzyme is <b>denatured</b> and stops working.</p>' +
    '<p class="dim">Enzymes are catalysts: they speed up reactions by lowering the energy needed to start them, and they are not used up.</p>' +
    '<button type="button" id="miniBack" class="primary">Return through the portal</button>');
  setTimeout(function () { const b = $('miniBack'); if (b) b.focus(); }, 50);
}
function golfKey(e, down) {
  const k = e.key;
  if (down && M.intro && (k === 'Enter' || k === ' ')) { e.preventDefault(); miniStart(); return; }
  if (down && M.over && (k === 'Enter' || k === ' ' || k === 'e' || k === 'E')) { e.preventDefault(); exitMini(); return; }
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { M.k.left = down; e.preventDefault(); }
  if (k === 'ArrowRight' || k === 'd' || k === 'D') { M.k.right = down; e.preventDefault(); }
  if (k === ' ' || k === 'Enter') { e.preventDefault(); if (down && !M.charging && golfStill()) { M.charging = true; M.chargeT = 0; } else if (!down && M.charging) golfShoot(); }
}
function golfPointer(e, type) {
  if (M.intro || M.over || !M.ball) return;
  const r = $('stage').getBoundingClientRect(), v = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, 1 - ((e.clientY - r.top) / r.height) * 2), rc = new T.Raycaster(); rc.setFromCamera(v, cam);
  const o = rc.ray.origin, d = rc.ray.direction; if (Math.abs(d.y) > 1e-4 && type !== 'up') { const t = -o.y / d.y; const px = o.x + d.x * t, pz = o.z + d.z * t; if (golfStill()) M.aim = Math.atan2(pz - M.ball.z, px - M.ball.x); }
  if (type === 'down' && golfStill()) { M.charging = true; M.chargeT = 0; }
  if (type === 'up' && M.charging) golfShoot();
}
/* ---------- PORTAL MINI-GAME: THE CODE LAB (DNA -> mRNA -> protein) ----------
   Step 1 replication: build the matching DNA strand (A-T, G-C).
   Step 2 transcription: build mRNA from the template strand (A-U, T-A, G-C, C-G).
   Step 3 translation: trace each codon on the codon wheel; a tRNA brings each amino acid.
   Special bonus: the finished protein's one-letter amino acid codes spell a secret word. */
const BASECOL = { A: '#ff6b6b', T: '#ffd166', G: '#7be0ad', C: '#5fb8ff', U: '#c59cff' };
const DNAPAIR = { A: 'T', T: 'A', G: 'C', C: 'G' }, RNAPAIR = { A: 'U', T: 'A', G: 'C', C: 'G' };
const GCODE = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG', WB = 'UCAG';
const AA3 = { F: 'Phe', L: 'Leu', I: 'Ile', M: 'Met', V: 'Val', S: 'Ser', P: 'Pro', T: 'Thr', A: 'Ala', Y: 'Tyr', H: 'His', Q: 'Gln', N: 'Asn', K: 'Lys', D: 'Asp', E: 'Glu', C: 'Cys', W: 'Trp', R: 'Arg', G: 'Gly', '*': 'Stop' };
const AACOL = ['#ff8fb1', '#ffd166', '#7be0ad', '#7fd4ff', '#c59cff', '#ffb070'];
const SECRETS = ['MAGIC', 'MEGA', 'MATCH', 'MEDAL', 'MIGHT'];
const DNA_PLAY = 9; /* bases the player places before the polymerase speeds up and finishes */
function aaOf(c) { return GCODE[16 * WB.indexOf(c[0]) + 4 * WB.indexOf(c[1]) + WB.indexOf(c[2])]; }
function codonsFor(a) { const out = []; for (let i = 0; i < 64; i++) if (GCODE[i] === a) out.push(WB[i >> 4] + WB[(i >> 2) & 3] + WB[i & 3]); return out; }
function dnaPick(a) { return a[Math.floor(Math.random() * a.length)]; }
function dnaGene() {
  if (!S.dnaSeen) S.dnaSeen = {};
  const fresh = SECRETS.filter(function (w) { return !S.dnaSeen[w]; }), word = dnaPick(fresh.length ? fresh : SECRETS);
  const cod = word.split('').map(function (ch, i) { return i === 0 ? 'AUG' : dnaPick(codonsFor(ch)); }); cod.push(dnaPick(['UAA', 'UAG', 'UGA']));
  const mrna = cod.join(''), top = mrna.replace(/U/g, 'T'), bot = top.split('').map(function (b) { return DNAPAIR[b]; }).join('');
  return { word: word, cod: cod, mrna: mrna, top: top, bot: bot };
}
function dnaNt(b, up, rna) {
  const g = new T.Group(), col = BASECOL[b], s = up ? 1 : -1;
  const blk = new T.Mesh(G.box, emat(col, '#222222')); blk.scale.set(0.8, 0.92, 0.5); blk.position.y = s * 0.5; g.add(blk);
  const bb = new T.Mesh(G.box, emat(rna ? '#e3ccff' : '#dfe8f0', '#222222')); bb.scale.set(1.06, 0.16, 0.36); bb.position.y = s * 1.06; g.add(bb);
  const lb = label(b, 1.25, { bd: col, big: true }); lb.position.set(0, s * 0.5, 0.5); g.add(lb);
  return g;
}
function dnaX(i) { return i * 1.05; }
function trX(i) { return i * 1.0 + Math.floor(i / 3) * 0.45; }
function dnaLater(sec, fn) { M.wait.push({ t: sec, fn: fn }); }
function dnaTw(o, x, y, dur, cb) { M.tw.push({ o: o, fx: o.position.x, fy: o.position.y, x: x, y: y, t: 0, dur: dur, cb: cb }); }
function enterDNA(p) {
  closeQ(); mode = 'mini'; Object.keys(keys).forEach(function (k) { keys[k] = false; });
  M = { kind: 'dna', p: p, grp: new T.Group(), gene: dnaGene(), phase: 0, i: 0, miss: 0, score: 0, slips: 0, cleanCodons: 0, intro: true, over: false, card: 0, busy: false, k: {}, t: 0,
    tw: [], wait: [], beads: [], step: 0, ci: 0, path: [], camX: 0, camY: 0.4, bg: scene.background, fog: scene.fog };
  scene.remove(L.group); scene.add(M.grp); scene.background = new T.Color('#140a2a'); scene.fog = new T.FogExp2('#1a0e36', 0.016);
  M.shell = new T.Mesh(new T.SphereGeometry(45, 32, 16), new T.MeshLambertMaterial({ color: '#3a2a6a', emissive: '#120a2a', side: T.BackSide })); M.grp.add(M.shell);
  for (let i = 0; i < (S.set.low ? 20 : 45); i++) { const s = glow(dnaPick(['#c59cff', '#7fd4ff', '#7be0ad']), 1 + Math.random() * 2, 0.35); s.position.set(-10 + Math.random() * 45, (Math.random() - 0.5) * 26, -8 - Math.random() * 20); M.grp.add(s); }
  const gn = M.gene, n = gn.top.length;
  M.top = new T.Group(); M.bot = new T.Group(); M.rna = new T.Group(); M.grp.add(M.top); M.grp.add(M.bot); M.grp.add(M.rna);
  for (let i = 0; i < n; i++) { const nt = dnaNt(gn.top[i], true); nt.position.x = dnaX(i); M.top.add(nt); }
  M.topLb = label('Original strand', 3, { bd: '#dfe8f0' }); M.topLb.position.set(-3, 0.6, 0); M.top.add(M.topLb);
  M.botLb = label('New strand', 3, { bd: '#ffd166' }); M.botLb.position.set(-3, -0.6, 0); M.bot.add(M.botLb);
  M.slot = new T.Mesh(G.box, new T.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.9 })); M.slot.scale.set(0.84, 0.96, 0.56); M.grp.add(M.slot);
  M.poly = new T.Group(); const blob = new T.Mesh(G.sph, new T.MeshLambertMaterial({ color: '#7fd4ff', emissive: '#103a5a', transparent: true, opacity: 0.35, depthWrite: false })); blob.scale.set(1.5, 1.9, 1); blob.position.z = -0.9; M.poly.add(blob); M.polyBlob = blob;
  M.polyLb = label('DNA polymerase', 2.8, { bd: '#7fd4ff' }); M.polyLb.position.set(0, -2.35, 0.3); M.poly.add(M.polyLb); M.grp.add(M.poly);
  $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; $('note').hidden = true; $('mini').hidden = false; $('miniAim').hidden = true; $('miniPow').hidden = true; $('miniPick').innerHTML = '';
  const rule = document.createElement('div'); rule.id = 'dnaRule'; rule.hidden = true; $('mini').appendChild(rule);
  const wh = document.createElement('canvas'); wh.id = 'dnaWheel'; wh.hidden = true; wh.setAttribute('aria-label', 'Codon wheel'); $('mini').appendChild(wh);
  wh.addEventListener('pointerdown', wheelClick);
  miniPanel('<h2>🧬 The Code Lab</h2><p>The portal shrank you down <b>inside a nucleus</b>. This gene holds a <b>secret message</b>, written in DNA.</p>' +
    '<p>Decode it in 3 steps, just like a real cell:</p><ol><li><b>Copy the DNA</b> (replication)</li><li><b>Make an mRNA copy</b> of the gene (transcription)</li><li><b>Read the codons</b> and build the protein (translation)</li></ol>' +
    '<p>Finish all 3 to reveal the secret message and win a <b>special bonus</b>.</p><p class="dim">Press the letter keys (A, T, G, C, U) or click the buttons.</p>' +
    '<button type="button" id="miniGo" class="primary">Start</button>');
  dnaCam(true); setTimeout(function () { const b = $('miniGo'); if (b) b.focus(); }, 50);
}
function dnaPickBtns(letters) {
  $('miniPick').innerHTML = letters.split('').map(function (b) { return '<button type="button" data-base="' + b + '" style="--c:' + BASECOL[b] + '"><span style="color:' + BASECOL[b] + ';font-weight:800">' + b + '</span></button>'; }).join('');
}
function dnaHintBtn(b) { document.querySelectorAll('#miniPick [data-base]').forEach(function (x) { x.classList.toggle('hint', x.dataset.base === b); }); }
function bl(b) { return '<b style="color:' + BASECOL[b] + '">' + b + '</b>'; }
function dnaRule(html) { const r = $('dnaRule'); if (!r) return; r.innerHTML = html; r.hidden = !html; }
function dnaTop(t) { $('miniTop').textContent = t + '   Score: ' + M.score; }
function dnaCard(n) {
  M.card = n; M.busy = true; $('miniPick').innerHTML = ''; dnaRule('');
  const cards = {
    1: '<h2>Step 1: Copy the DNA</h2><p>DNA is shaped like a twisted ladder. Each rung is two <b>bases</b> stuck together, and they always pair the same way:</p>' +
      '<p class="big">' + bl('A') + ' pairs with ' + bl('T') + ' &nbsp;·&nbsp; ' + bl('G') + ' pairs with ' + bl('C') + '</p>' +
      '<p>Before a cell divides, it copies its DNA. This is called <b>DNA replication</b>. Build the new strand: for each base on top, press its partner.</p>',
    2: '<h2>Step 2: Make mRNA (transcription)</h2><p>DNA never leaves the nucleus. To build a protein, the cell copies one gene into a messenger: <b>mRNA</b>.</p>' +
      '<p><b>RNA polymerase</b> unzips the DNA and reads the strand you just built (the <b>template strand</b>). RNA has no T. It uses <b>U</b> (uracil) instead:</p>' +
      '<p class="big">' + bl('A') + '→' + bl('U') + ' &nbsp; ' + bl('T') + '→' + bl('A') + ' &nbsp; ' + bl('G') + '→' + bl('C') + ' &nbsp; ' + bl('C') + '→' + bl('G') + '</p>',
    3: '<h2>Step 3: Build the protein (translation)</h2><p>Your mRNA left the nucleus and found a <b>ribosome</b>. The ribosome reads mRNA <b>3 bases at a time</b>. Each group of 3 is a <b>codon</b>, and each codon stands for one <b>amino acid</b>.</p>' +
      '<p>Use the <b>codon wheel</b>: start in the <b>center</b> with the codon\'s 1st letter, move out to the 2nd letter, then the 3rd. The outside ring names the amino acid.</p>' +
      '<p class="dim">Click the wheel or press U, C, A, G. A <b>tRNA</b> will carry each amino acid to the ribosome.</p>' };
  miniPanel(cards[n] + '<button type="button" id="dnaNext" class="primary">' + (n === 1 ? 'Start copying' : n === 2 ? 'Start transcribing' : 'Start translating') + '</button>');
  setTimeout(function () { const b = $('dnaNext'); if (b) b.focus(); }, 50);
}
function dnaNext() {
  if (!M || !M.card) return; const n = M.card; M.card = 0; miniPanel(''); M.busy = false; M.i = 0; M.miss = 0;
  if (n === 1) { M.phase = 1; dnaPickBtns('ATGCU'); dnaShowRule(); dnaTop('Step 1 of 3 · Copy the DNA'); }
  if (n === 2) { M.phase = 2; dnaPickBtns('AUGCT'); dnaShowRule(); dnaTop('Step 2 of 3 · Transcription'); }
  if (n === 3) { M.phase = 3; M.ci = 0; M.step = 0; M.path = []; dnaPickBtns('UCAG'); $('dnaWheel').hidden = false; wheelSize(); dnaShowRule(); wheelDraw(); dnaTop('Step 3 of 3 · Translation · codon 1 of ' + M.gene.cod.length);
    miniFlash('The first codon is always the START codon. Follow the gold glow on the wheel.', '#ffd166', 5); }
}
function dnaShowRule() {
  if (M.phase === 1) dnaRule('<b>DNA pairs</b><br>' + bl('A') + ' ↔ ' + bl('T') + '<br>' + bl('G') + ' ↔ ' + bl('C'));
  else if (M.phase === 2) dnaRule('<b>DNA → RNA</b><br>' + bl('A') + ' → ' + bl('U') + '<br>' + bl('T') + ' → ' + bl('A') + '<br>' + bl('G') + ' → ' + bl('C') + '<br>' + bl('C') + ' → ' + bl('G'));
  else if (M.phase === 3) {
    const c = M.gene.cod[M.ci] || '', ring = ['center circle', 'middle ring', 'outer ring'][M.step];
    dnaRule('<b>Codon ' + (M.ci + 1) + '</b><div class="codon">' + c.split('').map(function (b, k) { return '<span class="' + (k === M.step ? 'now' : k < M.step ? 'did' : '') + '" style="color:' + BASECOL[b] + '">' + b + '</span>'; }).join('') + '</div>' +
      (M.step < 3 ? 'Find <b style="color:' + BASECOL[c[M.step]] + '">' + c[M.step] + '</b> in the<br>' + ring : ''));
  }
}
function dnaNeed() {
  const g = M.gene;
  if (M.phase === 1) return DNAPAIR[g.top[M.i]];
  if (M.phase === 2) return RNAPAIR[g.bot[M.i]];
  if (M.phase === 3) return g.cod[M.ci][M.step];
}
function dnaInput(b) {
  if (!M || M.kind !== 'dna' || M.busy || M.over || !M.phase) return;
  b = String(b).toUpperCase(); const need = dnaNeed(); if (!need) return;
  if (M.phase === 3) return wheelPick(b);
  if (b === need) {
    const g = M.gene, i = M.i, pts = M.miss ? 5 : 20; M.score += pts; dnaHintBtn(null);
    dnaPlace(i, b, true); M.miss = 0; M.i++;
    if (M.i >= g.top.length) dnaPhaseDone();
    else if (M.i >= DNA_PLAY) dnaAuto();
    dnaTop(M.phase === 1 ? 'Step 1 of 3 · Copy the DNA' : 'Step 2 of 3 · Transcription');
    return;
  }
  M.miss++; M.slips++; beep(200, 0.2, 'sawtooth', 'boing, not a match'); M.slotShake = 0.4;
  const across = M.phase === 1 ? M.gene.top[M.i] : M.gene.bot[M.i];
  let msg;
  if (M.phase === 1 && b === 'U') msg = 'U is only found in RNA. DNA uses T instead.';
  else if (M.phase === 2 && b === 'T') msg = 'RNA has no T! It uses U (uracil). An A on the DNA pairs with U on the RNA.';
  else if (M.miss === 1) msg = M.phase === 1 ? 'Not a match. In DNA, A pairs with T, and G pairs with C.' : 'Not a match. Look at the DNA base below the glowing box and check the DNA → RNA chart.';
  else msg = across + ' pairs with ' + need + '. Press ' + need + '.';
  if (M.miss >= 2) dnaHintBtn(need);
  miniFlash(msg, '#ffb09c', 3.5);
}
function dnaPlace(i, b, sound) {
  const rna = M.phase === 2, nt = dnaNt(b, rna, rna), x = dnaX(i);
  if (rna) { nt.position.set(x, -3, 0.25); M.rna.add(nt); dnaTw(nt, x, 0, 0.22); }
  else { nt.position.set(x, -4, 0); M.bot.add(nt); dnaTw(nt, x, 0, 0.22); }
  if (sound) beep({ A: 523, T: 587, U: 587, G: 659, C: 784 }[b] || 600, 0.09, 'triangle');
  burstAt(x, rna ? 0.5 : -0.5, BASECOL[b]);
}
function burstAt(x, y, col) { const gl = glow(col, 2.2, 0.8); gl.position.set(x, y, 0.6); M.grp.add(gl); dnaLater(0.25, function () { M.grp.remove(gl); }); }
function dnaAuto() {
  M.busy = true; dnaHintBtn(null);
  miniFlash(M.phase === 1 ? 'You\'ve got it! DNA polymerase speeds up and copies the rest.' : 'Nice work! RNA polymerase speeds up and finishes the mRNA.', '#7be0ad', 3);
  const go = function () {
    if (!M || M.over) return; const g = M.gene;
    if (M.i >= g.top.length) { dnaPhaseDone(); return; }
    dnaPlace(M.i, M.phase === 1 ? DNAPAIR[g.top[M.i]] : RNAPAIR[g.bot[M.i]], M.i % 2 === 0); M.i++; dnaLater(0.13, go);
  };
  dnaLater(0.9, go);
}
function dnaPhaseDone() {
  M.busy = true; dnaHintBtn(null); dnaRule('');
  [523, 659, 784].forEach(function (f, k) { dnaLater(k * 0.11, function () { beep(f, 0.15, 'triangle', k === 0 ? 'chime, step complete' : null); }); });
  if (M.phase === 1) {
    miniFlash('✓ Copied! Now there are two matching DNA molecules, one for each new cell.', '#7be0ad', 4); M.score += 100;
    dnaLater(2.2, function () {
      /* unzip: the original strand lifts away so RNA polymerase can read the strand the player built */
      dnaTw(M.top, 0, 2.6, 1.0); M.botLb.material.map = labelTex('Template strand', { bd: '#ffd166' }); M.botLb.material.needsUpdate = true;
      M.polyBlob.material.color.set('#ffb070'); M.polyBlob.material.emissive.set('#5a2a08'); M.polyLb.material.map = labelTex('RNA polymerase', { bd: '#ffb070' }); M.polyLb.material.needsUpdate = true;
      const rl = label('mRNA', 3, { bd: '#c59cff' }); rl.position.set(-3, 0.6, 0.25); M.rna.add(rl);
      dnaLater(1.1, function () { dnaCard(2); });
    });
  } else if (M.phase === 2) {
    miniFlash('✓ mRNA made! It matches the top DNA strand, but with U wherever DNA had T.', '#7be0ad', 4.5); M.score += 100;
    dnaLater(3, function () { miniFlash('The mRNA leaves the nucleus through a nuclear pore…', '#c59cff', 2.5); dnaTw(M.rna, 6, 14, 1.6, function () { dnaTrSetup(); dnaCard(3); }); });
  }
}
/* translation scene: the cytoplasm, a ribosome sitting on the mRNA, a growing amino acid chain */
function dnaTrSetup() {
  M.top.visible = M.bot.visible = M.rna.visible = false; M.poly.visible = false; M.slot.visible = false;
  scene.background = new T.Color('#0b2230'); scene.fog = new T.FogExp2('#0e2a36', 0.016); M.shell.material.color.set('#1e4a5a'); M.shell.material.emissive.set('#08202a');
  const g = M.gene, tr = new T.Group(); M.tr = tr; M.grp.add(tr);
  for (let i = 0; i < g.mrna.length; i++) { const nt = dnaNt(g.mrna[i], false, true); nt.position.set(trX(i), -0.6, 0); tr.add(nt); }
  const ml = label('mRNA', 2.6, { bd: '#c59cff' }); ml.position.set(-2.2, -1.1, 0); tr.add(ml);
  M.rib = new T.Group();
  const small = new T.Mesh(G.sph, new T.MeshLambertMaterial({ color: '#9a7ae0', emissive: '#2a1a5a', transparent: true, opacity: 0.6, depthWrite: false })); small.scale.set(2.3, 0.8, 1.2); small.position.y = -2.45; M.rib.add(small);
  const big = new T.Mesh(G.sph, new T.MeshLambertMaterial({ color: '#9a7ae0', emissive: '#2a1a5a', transparent: true, opacity: 0.28, depthWrite: false })); big.scale.set(2.6, 1.5, 1.3); big.position.set(0, 1.1, -0.4); M.rib.add(big);
  const rl = label('Ribosome', 2.8, { bd: '#c59cff' }); rl.position.set(-3.1, -2.5, 0.5); M.rib.add(rl);
  M.frame = new T.Mesh(G.box, new T.MeshBasicMaterial({ color: '#ffd166', wireframe: true, transparent: true, opacity: 0.95 })); M.frame.scale.set(3.1, 1.1, 0.7); M.frame.position.y = -1.1; M.rib.add(M.frame);
  M.rib.position.x = trX(1); tr.add(M.rib); M.ribX = trX(1);
}
function trCodonX(ci) { return trX(ci * 3 + 1); }
/* ----- codon wheel ----- */
const WR = [0, 0.2, 0.4, 0.62, 0.99];
function wheelSize() {
  const cv = $('dnaWheel'), st = $('stage'), sz = Math.max(260, Math.min(460, st.clientHeight - 150, st.clientWidth * 0.46)), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.style.width = cv.style.height = sz + 'px'; cv.width = cv.height = Math.round(sz * dpr); M.wsz = sz;
}
function wheelDraw() {
  const cv = $('dnaWheel'); if (!cv || cv.hidden) return; const g = cv.getContext('2d'), D = cv.width, R = D / 2, c = D / 2, TAU = Math.PI * 2;
  const cod = M.gene.cod[M.ci] || '', path = M.path, done = M.step >= 3, need = M.step < 3 ? cod[M.step] : null;
  const hintOn = M.ci === 0 || M.miss >= 2, codIdx = cod ? (WB.indexOf(cod[0]) << 4) | (WB.indexOf(cod[1]) << 2) | WB.indexOf(cod[2]) : -1;
  g.clearRect(0, 0, D, D);
  const sector = function (ri, a0, a1) { g.beginPath(); g.arc(c, c, WR[ri + 1] * R, a0, a1); if (WR[ri] > 0) g.arc(c, c, WR[ri] * R, a1, a0, true); else g.lineTo(c, c); g.closePath(); };
  const inPath = function (lv, idx) { for (let k = 0; k < Math.min(lv, path.length); k++) { if (((idx >> (2 * (lv - k))) & 3) !== path[k]) return false; } return true; };
  const ang = function (idx, n) { return -Math.PI / 2 + idx * TAU / n; };
  /* amino acid ring: runs of the same amino acid */
  let s = 0;
  for (let i = 1; i <= 64; i++) {
    if (i < 64 && GCODE[i] === GCODE[s] && (i >> 2) === (s >> 2)) continue;
    const a0 = ang(s, 64), a1 = ang(i, 64), aa = GCODE[s], mine = done && codIdx >= s && codIdx < i;
    const live = path.length === 0 || ((s >> 4) === path[0] && (path.length < 2 || ((s >> 2) & 3) === path[1]));
    sector(3, a0, a1); g.fillStyle = mine ? '#ffd166' : ((s >> 2) % 2 ? '#1c3446' : '#24425a'); g.globalAlpha = live ? 1 : 0.3; g.fill(); g.strokeStyle = '#0b1d2a'; g.lineWidth = D * 0.004; g.stroke();
    const mid = (a0 + a1) / 2, rr = (WR[3] + WR[4]) / 2 * R, flip = Math.cos(mid) < 0;
    g.save(); g.translate(c + Math.cos(mid) * rr, c + Math.sin(mid) * rr); g.rotate(flip ? mid + Math.PI : mid);
    g.fillStyle = mine ? '#10202c' : aa === '*' ? '#ff9c9c' : aa === 'M' ? '#7be0ad' : '#ffffff'; g.font = 'bold ' + Math.round(D * 0.034) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(aa === '*' ? 'STOP' : aa === 'M' ? 'Met ▶' : AA3[aa], 0, 0); g.restore(); g.globalAlpha = 1;
    s = i;
  }
  /* letter rings */
  [[0, 4], [1, 16], [2, 64]].forEach(function (rg) {
    const lv = rg[0], n = rg[1];
    for (let idx = 0; idx < n; idx++) {
      const b = WB[idx & 3], a0 = ang(idx, n), a1 = ang(idx + 1, n), live = inPath(lv, idx), chosen = path.length > lv && live && (idx & 3) === path[lv];
      const hint = hintOn && !done && lv === M.step && live && b === need;
      sector(lv, a0, a1); g.globalAlpha = live ? 1 : 0.22; g.fillStyle = BASECOL[b]; g.fill(); g.globalAlpha = 1;
      if (live && !chosen) { g.fillStyle = 'rgba(11,29,42,' + (lv === 0 ? 0.15 : lv === 1 ? 0.35 : 0.5) + ')'; g.fill(); }
      g.strokeStyle = '#0b1d2a'; g.lineWidth = D * 0.004; g.stroke();
      if (chosen || hint) { g.lineWidth = D * (hint ? 0.012 : 0.009); g.strokeStyle = hint ? '#ffd166' : '#ffffff'; g.stroke(); }
      const mid = (a0 + a1) / 2, rr = lv === 0 ? WR[1] * R * 0.55 : (WR[lv] + WR[lv + 1]) / 2 * R;
      g.globalAlpha = live ? 1 : 0.35; g.fillStyle = '#10202c'; g.font = 'bold ' + Math.round(D * [0.075, 0.045, 0.026][lv]) + 'px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(b, c + Math.cos(mid) * rr, c + Math.sin(mid) * rr); g.globalAlpha = 1;
    }
  });
}
function wheelClick(e) {
  if (!M || M.kind !== 'dna' || M.phase !== 3 || M.busy || M.over) return; e.preventDefault(); e.stopPropagation();
  const r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2, rad = Math.hypot(x, y) / (r.width / 2);
  let a = Math.atan2(y, x) + Math.PI / 2; if (a < 0) a += Math.PI * 2;
  const ring = rad < WR[1] ? 0 : rad < WR[2] ? 1 : rad < WR[3] ? 2 : rad < WR[4] ? 3 : -1; if (ring < 0) return;
  const names = ['center circle', 'middle ring', 'outer ring'];
  if (ring === 3) { miniFlash(M.step < 3 ? 'Follow the letters first: find ' + M.gene.cod[M.ci][M.step] + ' in the ' + names[M.step] + '.' : '', '#ffd166', 3); return; }
  if (ring !== M.step) { miniFlash('Next, find ' + M.gene.cod[M.ci][M.step] + ' in the ' + names[M.step] + '.', '#ffd166', 3); return; }
  const n = [4, 16, 64][ring], idx = Math.floor(a / (Math.PI * 2 / n));
  for (let k = 0; k < ring; k++) if (((idx >> (2 * (ring - k))) & 3) !== M.path[k]) { miniFlash('Stay inside the part of the wheel you already picked (the bright part).', '#ffd166', 3); return; }
  wheelPick(WB[idx & 3]);
}
function wheelPick(b) {
  const cod = M.gene.cod[M.ci], need = cod[M.step];
  if (WB.indexOf(b) < 0) { miniFlash('Codons are written in RNA letters: U, C, A, G.', '#ffd166', 3); return; }
  if (b !== need) {
    M.miss++; M.slips++; M.codonMiss = true; beep(200, 0.2, 'sawtooth', 'boing, not that letter');
    const ord = ['1st', '2nd', '3rd'][M.step], names = ['center circle', 'middle ring', 'outer ring'];
    miniFlash(M.miss === 1 ? 'Look at the codon: its ' + ord + ' letter is ' + need + '. Find ' + need + ' in the ' + names[M.step] + '.' : 'The gold outline shows where ' + need + ' is.', '#ffb09c', 3.5);
    if (M.miss >= 2) dnaHintBtn(need); wheelDraw(); return;
  }
  M.path.push(WB.indexOf(b)); M.step++; M.miss = 0; dnaHintBtn(null); beep({ U: 587, C: 784, A: 523, G: 659 }[b], 0.09, 'triangle');
  if (M.step >= 3) { wheelDraw(); dnaShowRule(); codonDone(); } else { wheelDraw(); dnaShowRule(); }
}
function codonDone() {
  const cod = M.gene.cod[M.ci], aa = aaOf(cod), x = trCodonX(M.ci); M.busy = true;
  if (!M.codonMiss) { M.score += 80; M.cleanCodons++; } else M.score += 30; M.codonMiss = false;
  if (aa === '*') {
    miniFlash(cod + ' is a STOP codon. No tRNA fits it, so the ribosome lets go and the protein is finished!', '#ff9c9c', 5); beep(330, 0.4, 'sine', 'stop codon');
    dnaLater(1.2, function () { dnaTw(M.rib, M.rib.position.x + 2, -6, 1.2); M.beads.forEach(function (bd) { bd.free = true; }); });
    dnaLater(3.2, dnaFinal); return;
  }
  const first = M.ci === 0;
  miniFlash((first ? 'AUG = Met, the START codon. Every protein begins here. ' : cod + ' = ' + AA3[aa] + '. ') + 'A tRNA brings ' + AA3[aa] + ' to the ribosome.', '#7be0ad', 4);
  /* tRNA: body, anticodon (3 bases that pair with the codon), and the amino acid on top */
  const t = new T.Group(), body = new T.Mesh(G.box, emat('#e8d9b0', '#3a2a10')); body.scale.set(1.6, 1.5, 0.4); body.position.y = 1.2; t.add(body);
  const arm = new T.Mesh(G.cyl, emat('#e8d9b0', '#3a2a10')); arm.scale.set(0.12, 0.7, 0.12); arm.position.y = 2.25; t.add(arm);
  cod.split('').forEach(function (b, k) { const ab = { A: 'U', U: 'A', G: 'C', C: 'G' }[b], nb = new T.Mesh(G.box, emat(BASECOL[ab], '#222222')); nb.scale.set(0.8, 0.6, 0.45); nb.position.set((k - 1) * 1.0, 0.25, 0); t.add(nb); });
  const tl = label('tRNA', 2.6, { bd: '#e8d9b0' }); tl.position.set(-2.3, 1.2, 0.3); t.add(tl);
  const bead = dnaBead(aa, M.beads.length); bead.position.set(0, 2.9, 0.2); t.add(bead);
  t.position.set(x, 9, 0.35); M.tr.add(t); beep(700, 0.2, 'sine', 'whoosh, tRNA arriving');
  dnaTw(t, x, -0.6, 1.0, function () {
    beep(880, 0.15, 'triangle', 'click, amino acid joins the chain');
    t.remove(bead); bead.position.set(x, 2.3, 0.2); M.tr.add(bead); M.beads.push(bead);
    dnaLater(0.5, function () { dnaTw(t, x - 3, 10, 1.0, function () { M.tr.remove(t); }); });
    dnaLater(0.8, function () {
      M.ci++; M.step = 0; M.path = []; M.miss = 0; M.busy = false;
      dnaTw(M.rib, trCodonX(M.ci), 0, 0.6); wheelDraw(); dnaShowRule(); dnaTop('Step 3 of 3 · Translation · codon ' + (M.ci + 1) + ' of ' + M.gene.cod.length);
    });
  });
}
function dnaBead(aa, j) {
  const g = new T.Group(), col = AACOL[j % AACOL.length], s = new T.Mesh(G.sph, emat(col, '#333333')); s.scale.setScalar(0.55); g.add(s); g.add(glow(col, 2, 0.4));
  const lb = label(AA3[aa], 1.9, { bd: col, big: true }); lb.position.set(1.55, 0, 0.3); g.add(lb); return g;
}
function dnaFinal() {
  M.over = true; M.busy = true; dnaRule(''); $('dnaWheel').hidden = true; $('miniPick').innerHTML = '';
  if (!S.owned) S.owned = {}; const g = M.gene, aas = g.cod.slice(0, -1).map(aaOf), newColor = !S.owned.helix;
  S.dnaSeen[g.word] = 1; S.owned.helix = 1; M.score += 300 + 500; save(); award('dna-lab');
  [523, 659, 784, 1047, 1319].forEach(function (f, k) { dnaLater(k * 0.12, function () { beep(f, k === 4 ? 0.6 : 0.16, 'triangle', k === 0 ? 'fanfare, secret message decoded' : null); }); });
  miniPanel('<h2>🧬 Secret message decoded!</h2><p>Every amino acid also has a <b>one-letter nickname</b>. Read your protein from start to stop:</p>' +
    '<div class="dnaWord">' + aas.map(function (a, j) { return '<span style="--c:' + AACOL[j % AACOL.length] + '"><small>' + AA3[a] + '</small>' + a + '</span>'; }).join('') + '</div>' +
    '<p class="big">Your protein spells <b>' + g.word + '</b>! &nbsp;+500 secret bonus</p>' +
    (newColor ? '<p class="unlock">✨ Special bonus: secret alien color <b>Helix gold</b> unlocked. Try it on in the Wardrobe!</p>' : '<p class="dim">Each trip through the portal hides a different secret word. Can you find all ' + SECRETS.length + '? (' + Object.keys(S.dnaSeen).length + ' found)</p>') +
    '<p><b>What you did:</b> <b>Replication</b> copied the DNA (A–T, G–C). <b>Transcription</b> copied the gene into <b>mRNA</b> (U instead of T). In <b>translation</b>, the <b>ribosome</b> read the mRNA one <b>codon</b> at a time, <b>tRNA</b> brought the matching amino acids, and a <b>stop codon</b> ended the protein.</p>' +
    '<p class="dim">Every living thing uses this same genetic code. Score: <b>' + M.score + '</b> · Clean codons: ' + M.cleanCodons + ' of ' + (g.cod.length) + '</p>' +
    '<button type="button" id="miniBack" class="primary">Return through the portal</button>');
  setTimeout(function () { const b = $('miniBack'); if (b) b.focus(); }, 50);
}
function dnaCam(snap) {
  let tx2 = 0, ty = 0.4;
  if (M.phase === 0 || M.phase === 1 || M.phase === 2) { tx2 = dnaX(Math.min(M.i, M.gene.top.length - 1)); ty = M.phase === 2 ? 0.5 : -0.5; if (M.phase === 0) tx2 = 3; }
  if (M.phase === 3 || M.tr) { tx2 = (M.rib ? M.rib.position.x : 0) + 3.4; ty = 1.3; }
  if (M.over && M.tr) tx2 = (M.beads.length ? M.beads[Math.floor(M.beads.length / 2)].position.x : 0) + 1;
  const k = snap ? 1 : 0.08; M.camX += (tx2 - M.camX) * k; M.camY += (ty - M.camY) * k;
  const z = cam.aspect < 1.3 ? 16 : 12.5; cam.position.set(M.camX, M.camY + 0.6, z); cam.lookAt(M.camX, M.camY, 0);
}
function dnaStep(dt) {
  M.t += dt; if (M.flashT > 0) { M.flashT -= dt; if (M.flashT <= 0) $('miniMsg').hidden = true; }
  const done = []; M.tw = M.tw.filter(function (tw) { tw.t += dt; const u = Math.min(1, tw.t / tw.dur), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    tw.o.position.x = tw.fx + (tw.x - tw.fx) * e; tw.o.position.y = tw.fy + (tw.y - tw.fy) * e; if (u >= 1) { if (tw.cb) done.push(tw.cb); return false; } return true; });
  const due = []; M.wait = M.wait.filter(function (w) { w.t -= dt; if (w.t <= 0) { due.push(w.fn); return false; } return true; });
  done.concat(due).forEach(function (fn) { if (M) fn(); }); if (!M) return;
  if (M.phase === 1 || M.phase === 2 || M.phase === 0) {
    const i = Math.min(M.i, M.gene.top.length - 1), x = dnaX(i), sy = M.phase === 2 ? 0.5 : -0.5;
    M.slot.visible = !M.busy && M.phase > 0; M.slot.position.set(x + (M.slotShake > 0 ? Math.sin(M.t * 60) * 0.12 : 0), sy, 0.1); M.slotShake = (M.slotShake || 0) - dt;
    M.slot.material.opacity = 0.55 + Math.sin(M.t * 6) * 0.35;
    M.poly.position.x += (x - M.poly.position.x) * Math.min(1, dt * 8); M.poly.position.y = M.phase === 2 ? 0 : -0.4;
  }
  if (M.tr) {
    M.frame.material.opacity = 0.6 + Math.sin(M.t * 5) * 0.35;
    /* the chain grows to the left of the ribosome, newest amino acid next to it */
    const n = M.beads.length, rx = M.rib.position.x;
    M.beads.forEach(function (bd, j) {
      const k = n - 1 - j, tx3 = bd.free ? trCodonX(0) + (j + 0.5) * 1.35 : rx - 0.5 - k * 0.45, ty3 = bd.free ? 3.3 + Math.sin(M.t * 2 + j) * 0.15 : 1.8 + k * 0.95;
      bd.position.x += (tx3 - bd.position.x) * Math.min(1, dt * 5); bd.position.y += (ty3 - bd.position.y) * Math.min(1, dt * 5);
    });
  }
  dnaCam(false);
}
function dnaKey(e, down) {
  const k = e.key;
  if (down && M.intro && (k === 'Enter' || k === ' ')) { e.preventDefault(); miniStart(); return; }
  if (down && M.card && (k === 'Enter' || k === ' ')) { e.preventDefault(); dnaNext(); return; }
  if (down && M.over && (k === 'Enter' || k === ' ' || k === 'e' || k === 'E')) { e.preventDefault(); exitMini(); return; }
  if (down && /^[atgcuATGCU]$/.test(k) && !e.repeat) { e.preventDefault(); dnaInput(k); }
}
/* ---------- MOTHERSHIP STATION: report, supply shop, practice bay, wardrobe ---------- */
const SHOP = [
  { id: 'life', icon: '💗', name: 'Extra life', cost: 600, desc: 'Start your next level with one more life.' },
  { id: 'shield', icon: '🛡️', name: 'Shield bubble', cost: 400, desc: 'Start your next level protected for 15 seconds.' },
  { id: 'fly', icon: '🚀', name: 'Flight capsule', cost: 900, desc: 'Press F during a level to fly for 20 seconds.' },
  { id: 'lens', icon: '🔍', name: 'Hint lens (3 uses)', cost: 500, desc: 'Press H when you are stuck and the right choice glows gold.', qty: 3 },
  { id: 'g1', icon: '🥽', name: 'Lab goggles', cost: 1500, desc: 'Gear: see hidden platforms. (Or earn 3 stars.)', gear: 1 },
  { id: 'g2', icon: '🦸', name: 'Explorer cape', cost: 2500, desc: 'Gear: hold jump while falling to fly. (Or earn 8 stars.)', gear: 2 },
  { id: 'g3', icon: '🎩', name: 'Ribosome hat', cost: 3500, desc: 'Gear: press E in the air to build a protein platform. (Or earn 12 stars.)', gear: 3 }];
function gearOpen(i) { return GEAR[i][1] <= totalStars() || !!S.owned[i]; }
function stationTab(t) {
  STTAB = t; document.querySelectorAll('#stTabs [data-tab]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.tab === t ? 'true' : 'false'); });
  $('doneReport').hidden = t !== 'report'; const body = $('stBody'); body.hidden = t === 'report';
  if (t === 'shop') {
    body.innerHTML = '<p class="bank">Points to spend: <b>' + (S.bank || 0) + '</b></p><div class="shop">' + SHOP.map(function (it) {
      const have = it.gear ? gearOpen(it.gear) : 0, n = it.gear ? 0 : S.inv[it.id] || 0, can = !have && (S.bank || 0) >= it.cost;
      return '<div class="item"><span class="ic">' + it.icon + '</span><span class="tx"><b>' + esc(it.name) + '</b>' + (n ? ' <span class="own">You have ' + n + '</span>' : '') + '<br><span class="dim">' + esc(it.desc) + '</span></span>' +
        '<button type="button" data-buy="' + it.id + '"' + (can ? '' : ' disabled') + '>' + (have ? 'Owned' : it.cost + ' pts') + '</button></div>';
    }).join('') + '</div><p class="dim">Spending points never lowers your high scores.</p>';
  } else if (t === 'practice') { PQ = practiceSet(); practiceShow(); }
  else if (t === 'wardrobe') { body.innerHTML = '<div id="stCust" class="cust">' + custHTML() + '</div>'; }
}
function stationClick(e) {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.buy) {
    const it = SHOP.find(function (x) { return x.id === b.dataset.buy; }); if (!it || (S.bank || 0) < it.cost) return;
    award('shopper'); S.bank -= it.cost; if (it.gear) { S.owned[it.gear] = true; S.alien.gear = it.gear; refreshAlien(); } else S.inv[it.id] = (S.inv[it.id] || 0) + (it.qty || 1);
    save(); beep(1200, 0.15, 'square', 'ka-ching, bought ' + it.name); stationTab('shop'); const nb = $('stBody').querySelector('[data-buy="' + it.id + '"]'); if (nb) nb.focus(); return;
  }
  if (b.classList.contains('chip')) { award('stylist'); S.alien[b.dataset.k] = +b.dataset.v; save(); refreshAlien(); stationTab('wardrobe'); const again = $('stBody').querySelector('[data-k="' + b.dataset.k + '"][data-v="' + b.dataset.v + '"]'); if (again) again.focus(); return; }
  if (b.dataset.pa != null) practiceAnswer(+b.dataset.pa);
  if (b.id === 'pqNext') { PQ.i++; practiceShow(); }
  if (b.id === 'pqMore') { PQ = practiceSet(); practiceShow(); }
}
/* practice: questions you missed first, then ones you saw longest ago */
function practiceSet() {
  const ids = Object.keys(QMAP).filter(function (k) { return S.missed[k] || S.seen[k]; });
  ids.sort(function (a, c) { return ((S.missed[c] || 0) - (S.missed[a] || 0)) || ((S.seen[a] || 0) - (S.seen[c] || 0)); });
  return { qs: ids.slice(0, 5).map(function (k) { return QMAP[k]; }), i: 0, right: 0, tried: {}, earned: 0 };
}
function practiceShow() {
  const body = $('stBody');
  if (!PQ.qs.length) { body.innerHTML = '<p>Play a level first. Questions you meet in the levels come back here for practice.</p>'; return; }
  if (PQ.i >= PQ.qs.length) { body.innerHTML = '<p><b>Practice round done!</b> ' + PQ.right + ' of ' + PQ.qs.length + ' right on the first try. You earned ' + PQ.earned + ' points.</p><div class="btns"><button type="button" id="pqMore" class="primary">Practice more</button></div>'; $('pqMore').focus(); return; }
  const q = PQ.qs[PQ.i]; PQ.perm = q.fixed ? q.options.map(function (_, i) { return i; }) : shuffle(q.options.map(function (_, i) { return i; })); PQ.tried = {}; PQ.first = true; PQ.solved = false;
  body.innerHTML = '<p class="dim">Practice Bay · question ' + (PQ.i + 1) + ' of ' + PQ.qs.length + ' · +50 points for each one right on the first try</p><p class="pqp">' + esc(q.prompt) + (q.stem ? '<br><span class="dim">' + esc(q.stem) + '</span>' : '') + '</p>' +
    (q.figure ? figHTML(q.figure) : '') + '<div class="pqo">' + PQ.perm.map(function (oi, k) { return '<button type="button" class="opt" data-pa="' + k + '"><b>' + 'ABCDE'[k] + '</b> ' + esc(q.options[oi]) + '</button>'; }).join('') + '</div><p id="pqFb" class="fb" aria-live="polite"></p>';
  const f = body.querySelector('.opt'); if (f) f.focus();
}
function practiceAnswer(k) {
  const q = PQ.qs[PQ.i]; if (!q || PQ.tried[k] || PQ.solved) return; const ok = PQ.perm[k] === q.answer, btn = $('stBody').querySelector('[data-pa="' + k + '"]');
  if (ok) {
    if (PQ.first) { if (stat('practice') >= 5) award('practice'); PQ.right++; PQ.earned += 50; S.bank = (S.bank || 0) + 50; if (S.missed[q.id]) { S.missed[q.id]--; if (S.missed[q.id] <= 0) delete S.missed[q.id]; } }
    S.seen[q.id] = Date.now(); save(); beep(880, 0.2, 'sine', 'chime, correct');
    $('pqFb').innerHTML = '✓ ' + esc(q.explain || 'Correct!') + '<br><button type="button" id="pqNext" class="primary">Next</button>'; $('pqNext').focus(); PQ.solved = true;
  } else {
    PQ.tried[k] = 1; if (PQ.first) { S.missed[q.id] = (S.missed[q.id] || 0) + 1; save(); } PQ.first = false; if (btn) { btn.disabled = true; btn.classList.add('no'); }
    const wrongs = Object.keys(PQ.tried).length; let msg = '✗ Not that one. ' + esc(q.hint || '');
    if (wrongs >= 2) { const cb = $('stBody').querySelector('[data-pa="' + PQ.perm.indexOf(q.answer) + '"]'); if (cb) cb.classList.add('help'); msg += ' The right answer is glowing gold.'; }
    $('pqFb').innerHTML = msg; beep(160, 0.3, 'sawtooth', 'low buzz, not correct');
  }
}
/* supplies: loaded at the start of a level, or used with F (flight) and H (hint lens) */
function loadSupplies() {
  const used = [];
  if (S.inv.life > 0) { L.lives += S.inv.life; used.push(S.inv.life + ' extra ' + (S.inv.life > 1 ? 'lives' : 'life')); S.inv.life = 0; }
  if (S.inv.shield > 0) { S.inv.shield--; P.shield = 15; P.shieldM = new T.Mesh(G.tor, basic('#7fd4ff', 0.45, true)); P.shieldM.scale.setScalar(0.95); P.shieldM.position.y = 0.75; P.m.add(P.shieldM); used.push('a 15-second shield'); }
  save(); if (used.length) setTimeout(function () { if (mode === 'play') toast('Supplies loaded: ' + used.join(' and ') + '.', 4); }, 2500);
}
function useFly() { if (!L || L.active || L.over || !(S.inv.fly > 0)) { if (L && !(S.inv.fly > 0)) toast('No flight capsules. Buy them in the Supply Shop on the mothership.', 3); return; } S.inv.fly--; save(); giveFlight(20, ''); hud(); }
function useLens() {
  if (!L || L.over) return; if (!(S.inv.lens > 0)) { toast('No hint lenses. Buy them in the Supply Shop on the mothership.', 3); return; }
  let did = false;
  if (L.active) { const st = L.active, q = st.queue[st.qi], ci = st.perm.indexOf(q.answer), b2 = $('qopts').querySelector('[data-i="' + ci + '"]'); if (b2) { b2.classList.add('help'); did = true; } }
  else if (L.zone && !L.zone.done) {
    const z = L.zone; let g = null;
    if (z.kind === 'hunt') { const t = z.toks.find(function (k) { return k.good && !k.got; }); if (t) g = t.g; }
    else if (z.kind === 'catch') { const t = z.toks.find(function (k) { return k.text === z.c.steps[z.si].need; }); if (t) g = t.g; }
    else if (z.kind === 'become') { const d = z.doors.find(function (q) { return q.d.ok; }); if (d) { helpGlow(d.g); d.g.userData.help.position.set(d.s.x0 + 0.7, (d.s.y0 + d.s.y1) / 2, 1); did = true; } }
    else if (z.kind === 'maze') { const d = z.walls[z.si].find(function (q) { return q.d.ok; }); if (d) { helpGlow(d.g); d.g.userData.help.position.set(d.s.x0 + 0.7, (d.s.y0 + d.s.y1) / 2, 1); did = true; } }
    else if (z.kind === 'sequence') { const t = z.toks.find(function (k) { return k.si === z.next; }); if (t) g = t.g; }
    else if (z.kind === 'wordbank') { const t = z.toks.find(function (k) { return !k.got && k.word === z.wb.sentences[z.si].answer; }); if (t) g = t.g; }
    if (g) { helpGlow(g); did = true; }
  }
  if (!did) { toast('The hint lens works during a challenge. Walk into one first.', 3); return; }
  S.inv.lens--; save(); beep(1000, 0.2, 'triangle', 'shimmer, hint lens'); toast('🔍 Hint lens: the right choice is glowing gold.', 3); hud();
}
/* ---------- menus ---------- */
function openMap() {
  if (mode === 'play' || mode === 'done') { menuScene(); }
  buildLevels(); show('levels'); const c = document.querySelector('.mnode.cur') || document.querySelector('.mnode'); if (c) c.focus(); else $('btnMapPlay').focus();
}
function show(name) {
  ['menu', 'levels', 'progress', 'settings', 'pause', 'done', 'about', 'journal'].forEach(function (n) { $(n).hidden = n !== name; });
}
function menuScene() {
  Music.play('menu');
  teardown(); mode = 'menu'; $('hud').hidden = true; $('touch').hidden = true; $('toast').hidden = true; $('qpanel').hidden = true;
  const th = THEMES.space;
  menuGrp = new T.Group(); scene.add(menuGrp);
  const pad = mesh('cyl', th.ground); pad.scale.set(1.8, 0.3, 1.8); pad.position.y = -0.15; menuGrp.add(pad);
  const rim = mesh('tor', th.top); rim.scale.setScalar(1.75); rim.rotation.x = Math.PI / 2; rim.scale.z = 0.3; menuGrp.add(rim);
  menuGrp.userData.anim = []; scenery(th, -10, 10, menuGrp, menuGrp.userData.anim); const halo = glow(th.rim, 5, 0.35); halo.position.y = 0.1; menuGrp.add(halo); refreshAlien(); show('menu'); buildMenu();
}
function refreshAlien() { if (!menuGrp) return; if (menuAlien) menuGrp.remove(menuAlien); menuAlien = buildAlien(S.alien); menuAlien.scale.setScalar(1.5); menuGrp.add(menuAlien); }
function custHTML() {
  const stars = totalStars();
  const rows = [['Body', 'shape', ['Round', 'Tall', 'Wide', 'Jelly', 'Cube']], ['Color', 'color', COLORS.map(function (c) { return c[2] && !(S.owned && S.owned[c[2]]) ? '🔒 Secret' : c[0]; })], ['Eyes', 'eyes', ['1', '2', '3'], 1], ['Eye style', 'estyle', ['Classic', 'Cute', 'Sleepy', 'Happy', 'Hearts']],
    ['Mouth', 'mouth', ['None', 'Smile', 'Open', 'Cat', 'Fangs', 'Tongue']], ['Antennae', 'ant', ['0', '1', '2']],
    ['Gear', 'gear', GEAR.map(function (g, i) { return !gearOpen(i) ? g[0] + ' (' + g[1] + ' stars)' : g[0]; })]];
  return rows.map(function (r) {
    return '<div class="row"><span class="rl">' + r[0] + '</span><span class="rb">' + r[2].map(function (name, i) {
      const v = i + (r[3] || 0), lock = (r[1] === 'gear' && !gearOpen(i)) || (r[1] === 'color' && COLORS[i][2] && !(S.owned && S.owned[COLORS[i][2]]));
      return '<button type="button" class="chip" data-k="' + r[1] + '" data-v="' + v + '"' + (S.alien[r[1]] === v ? ' aria-pressed="true"' : ' aria-pressed="false"') + (lock ? ' disabled' : '') +
        (r[1] === 'color' ? ' style="--sw:' + COLORS[i][1] + '"><i class="sw"></i>' : '>') + esc(name) + '</button>';
    }).join('') + '</span></div>';
  }).join('') + '<p class="dim gearinfo">' + GEARINFO[S.alien.gear || 0] + '</p>';
}
function buildMenu() {
  $('cust').innerHTML = custHTML();
  const stars = totalStars(), list = allLevels(), started = Object.keys(S.levels).length > 0;
  $('btnPlay').textContent = started ? '🎮 Platformer: continue' : '🎮 Platformer Adventure';
  $('menuStars').textContent = list.length ? stars + ' of ' + list.length * 3 + ' stars' : 'No world files found in this folder.';
  $('btnPlay').disabled = !list.length;
}
function nextUp() {
  const list = allLevels(); let i = list.findIndex(function (e) { return !(S.levels[e.lv.id] && S.levels[e.lv.id].stars); });
  if (i < 0) i = list.length - 1; return list[i];
}
/* MISSION MAP: like a Mario world map. Five lands in course order, a dotted trail through every level,
   gold flags on conquered levels, a lock on levels not open yet, and the alien standing on the next one. */
const MAPLANDS = [
  { cx: 175, cy: 165, rx: 150, ry: 112, fill: '#1f5f6a', edge: '#7fe0d8', icon: '🧫' },
  { cx: 500, cy: 140, rx: 150, ry: 105, fill: '#4a6a28', edge: '#c8ff7a', icon: '🌿' },
  { cx: 825, cy: 170, rx: 150, ry: 112, fill: '#7a6a2a', edge: '#ffd98a', icon: '🦁' },
  { cx: 690, cy: 430, rx: 165, ry: 108, fill: '#4a3a7a', edge: '#c59cff', icon: '🧬' },
  { cx: 310, cy: 430, rx: 165, ry: 108, fill: '#6a5a4a', edge: '#e8d0b0', icon: '🦴' }];
function buildLevels() {
  const list = allLevels(), next = nextUp(), nodes = [];
  for (let w = 1; w <= MAPLANDS.length; w++) {
    const ld = MAPLANDS[w - 1], lvls = BQ.worlds[w] ? BQ.worlds[w].levels : [0, 1, 2, 3, 4], n = lvls.length, dir = w <= 3 ? 1 : -1;
    lvls.forEach(function (lv, k) {
      const u = n > 1 ? k / (n - 1) : 0.5, x = ld.cx + dir * (u - 0.5) * ld.rx * 1.45, y = ld.cy + Math.sin(u * Math.PI * 2 + w) * ld.ry * 0.22 + 32;
      const i = BQ.worlds[w] ? list.findIndex(function (e) { return e.lv === lv; }) : -1;
      nodes.push({ w: w, x: x, y: y, i: i, lv: BQ.worlds[w] ? lv : null, k: k });
    });
  }
  let svg = '<svg viewBox="0 0 1000 580" class="mapsvg" role="group" aria-label="Mission map">' +
    '<defs><radialGradient id="sea" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#173a5a"/><stop offset="1" stop-color="#081a2c"/></radialGradient></defs>' +
    '<rect width="1000" height="580" rx="18" fill="url(#sea)"/>';
  for (let k = 0; k < 40; k++) svg += '<circle cx="' + ((k * 263) % 1000) + '" cy="' + ((k * 137) % 580) + '" r="' + (1 + k % 3) + '" fill="#9fd8ff" opacity=".18"/>';
  MAPLANDS.forEach(function (ld, wi) {
    const w = wi + 1, built = !!BQ.worlds[w];
    let got = 0, max = 0; list.forEach(function (e) { if (e.w.id === w) { max += 3; got += (S.levels[e.lv.id] && S.levels[e.lv.id].stars) || 0; } });
    svg += '<g opacity="' + (built ? 1 : 0.45) + '"><ellipse cx="' + ld.cx + '" cy="' + (ld.cy + 8) + '" rx="' + (ld.rx + 8) + '" ry="' + (ld.ry + 8) + '" fill="#000" opacity=".25"/>' +
      '<ellipse cx="' + ld.cx + '" cy="' + ld.cy + '" rx="' + ld.rx + '" ry="' + ld.ry + '" fill="' + ld.fill + '" stroke="' + ld.edge + '" stroke-width="3"/>' +
      '<text x="' + ld.cx + '" y="' + (ld.cy - ld.ry + 30) + '" text-anchor="middle" class="mapw">' + ld.icon + ' World ' + w + '</text>' +
      '<text x="' + ld.cx + '" y="' + (ld.cy - ld.ry + 50) + '" text-anchor="middle" class="mapu">' + esc(BQ.UNITS[wi]) + '</text>' +
      '<text x="' + ld.cx + '" y="' + (ld.cy + ld.ry - 14) + '" text-anchor="middle" class="maps">' + (built ? '★ ' + got + ' of ' + max : 'Coming soon') + '</text></g>';
  });
  /* the trail */
  for (let k = 1; k < nodes.length; k++) {
    const a = nodes[k - 1], b2 = nodes[k], open = b2.i >= 0 && unlocked(b2.i, list);
    svg += '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b2.x.toFixed(1) + '" y2="' + b2.y.toFixed(1) + '" stroke="' + (open ? '#ffe9a8' : '#8090a0') + '" stroke-width="' + (open ? 5 : 3) + '" stroke-dasharray="' + (open ? '2 10' : '6 8') + '" stroke-linecap="round" opacity="' + (open ? 0.95 : 0.5) + '"/>';
  }
  nodes.forEach(function (nd) {
    if (!nd.lv) { svg += '<circle cx="' + nd.x.toFixed(1) + '" cy="' + nd.y.toFixed(1) + '" r="13" fill="#2a3440" stroke="#5a6470" stroke-width="2"/>'; return; }
    const sv = S.levels[nd.lv.id], stars = sv ? sv.stars : 0, open = unlocked(nd.i, list), cur = next && next.lv === nd.lv, rare = S.rare[nd.lv.id];
    const lab = nd.lv.id + ' ' + nd.lv.title + (open ? (stars ? ', conquered with ' + stars + ' of 3 stars' : ', open') : ', locked');
    svg += '<g class="lvl mnode' + (open ? '' : ' locked') + (cur ? ' cur' : '') + '" data-i="' + nd.i + '"' + (open ? '' : ' data-lock="1"') + ' tabindex="0" role="button" aria-label="' + esc(lab) + '" transform="translate(' + nd.x.toFixed(1) + ' ' + nd.y.toFixed(1) + ')">' +
      (cur ? '<circle r="27" class="pulse" fill="none" stroke="#ffd166" stroke-width="3"/>' : '') +
      '<circle r="20" fill="' + (stars ? '#ffd166' : open ? '#e8f4ff' : '#4a5560') + '" stroke="' + (stars ? '#7a5a00' : open ? '#2a5a7a' : '#2a3440') + '" stroke-width="3"/>' +
      '<text y="5" text-anchor="middle" class="mid">' + (open ? nd.lv.id : '🔒') + '</text>' +
      (stars ? '<text y="-27" text-anchor="middle" class="mflag">🚩</text>' : '') +
      '<text y="36" text-anchor="middle" class="mstar">' + (open ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '') + '</text>' +
      (rare ? '<text x="20" y="-14" class="mrare">💎</text>' : '') +
      (cur ? '<g class="malien" transform="translate(0 -46)"><ellipse rx="11" ry="12" fill="' + COLORS[S.alien.color][1] + '"/><circle cx="-4" cy="-2" r="3" fill="#fff"/><circle cx="4" cy="-2" r="3" fill="#fff"/><circle cx="-4" cy="-2" r="1.5" fill="#10202c"/><circle cx="4" cy="-2" r="1.5" fill="#10202c"/><line x1="-4" y1="-11" x2="-7" y2="-20" stroke="' + COLORS[S.alien.color][1] + '" stroke-width="2"/><line x1="4" y1="-11" x2="7" y2="-20" stroke="' + COLORS[S.alien.color][1] + '" stroke-width="2"/><circle cx="-7" cy="-21" r="2.5" fill="#ffd166"/><circle cx="7" cy="-21" r="2.5" fill="#ffd166"/></g>' : '') +
      '</g>';
  });
  svg += '</svg>';
  $('levelList').innerHTML = svg + '<div id="mapInfo" class="mapinfo" aria-live="polite"></div>';
  mapInfo(next ? list.indexOf(next) : 0);
  $('btnMapPlay').hidden = !next; if (next) $('btnMapPlay').textContent = 'Play ' + next.lv.id + ': ' + next.lv.title + ' ▶';
}
function mapInfo(i) {
  const list = allLevels(), e = list[i]; if (!e) return;
  const sv = S.levels[e.lv.id], open = unlocked(i, list), stars = sv ? sv.stars : 0;
  $('mapInfo').innerHTML = '<b>' + e.lv.id + ': ' + esc(e.lv.title) + '</b> ' + (open ? '<span class="st">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</span>' +
    (sv && sv.best ? ' · Best score ' + sv.best : '') + (sv && sv.time ? ' · ' + tx('r.time') + ' ' + fmtTime(sv.time) : '') + ' · Rare specimen: ' + (S.rare[e.lv.id] ? 'found 💎' : 'not found yet') +
    '<br><span class="dim">' + (stars ? 'Conquered! Play again for more stars.' : 'Open. Click it or press Enter to play.') + '</span>' : '<span class="dim">Locked. Finish the level before it to open this one.</span>');
}
/* ---------- STANDARDS (for teachers): each Keystone eligible content code and the PA STEELS 9-12 standard it supports ---------- */
const KEYSTONE = {"BIO.A.1.1.1": "Describe the characteristics of life shared by all prokaryotic and eukaryotic organisms.", "BIO.A.1.2.1": "Compare cellular structures and their functions in prokaryotic and eukaryotic cells.", "BIO.A.1.2.2": "Describe and interpret relationships between structure and function at various levels of biological organization (i.e., organelles, cells, tissues, organs, organ systems, and multicellular organisms).", "BIO.A.2.1.1": "Describe the unique properties of water and how these properties support life on Earth (e.g., freezing point, high specific heat, cohesion).", "BIO.A.2.2.1": "Explain how carbon is uniquely suited to form biological macromolecules.", "BIO.A.2.2.2": "Describe how biological macromolecules form from monomers.", "BIO.A.2.2.3": "Compare the structure and function of carbohydrates, lipids, proteins, and nucleic acids in organisms.", "BIO.A.2.3.1": "Describe the role of an enzyme as a catalyst in regulating a specific biochemical reaction.", "BIO.A.2.3.2": "Explain how factors such as pH, temperature, and concentration levels can affect enzyme function.", "BIO.A.3.1.1": "Describe the fundamental roles of plastids (e.g., chloroplasts) and mitochondria in energy transformations.", "BIO.A.3.2.1": "Compare the basic transformation of energy during photosynthesis and cellular respiration.", "BIO.A.3.2.2": "Describe the role of ATP in biochemical reactions.", "BIO.A.4.1.1": "Describe how the structure of the plasma membrane allows it to function as a regulatory structure and/or protective barrier for a cell.", "BIO.A.4.1.2": "Compare the mechanisms that transport materials across the plasma membrane (i.e., passive transport—diffusion, osmosis, facilitated diffusion; and active transport—pumps, endocytosis, exocytosis).", "BIO.A.4.1.3": "Describe how membrane-bound cellular organelles (e.g., endoplasmic reticulum, Golgi apparatus) facilitate the transport of materials within a cell.", "BIO.A.4.2.1": "Explain how organisms maintain homeostasis (e.g., thermoregulation, water regulation, oxygen regulation).", "BIO.B.1.1.1": "Describe the events that occur during the cell cycle: interphase, nuclear division (i.e., mitosis or meiosis), cytokinesis.", "BIO.B.1.1.2": "Compare the processes and outcomes of mitotic and meiotic nuclear divisions.", "BIO.B.1.2.1": "Describe how the process of DNA replication results in the transmission and/or conservation of genetic information.", "BIO.B.1.2.2": "Explain the functional relationships between DNA, genes, alleles, and chromosomes and their roles in inheritance.", "BIO.B.2.1.1": "Describe and/or predict observed patterns of inheritance (i.e., dominant, recessive, co-dominance, incomplete dominance, sex-linked, polygenic, and multiple alleles).", "BIO.B.2.1.2": "Describe processes that can alter composition or number of chromosomes (i.e., crossing-over, nondisjunction, duplication, translocation, deletion, insertion, and inversion).", "BIO.B.2.2.1": "Describe how the processes of transcription and translation are similar in all organisms.", "BIO.B.2.2.2": "Describe the role of ribosomes, endoplasmic reticulum, Golgi apparatus, and the nucleus in the production of specific types of proteins.", "BIO.B.2.3.1": "Describe how genetic mutations alter the DNA sequence and may or may not affect phenotype (e.g., silent, nonsense, frameshift).", "BIO.B.2.4.1": "Explain how genetic engineering has impacted the fields of medicine, forensics, and agriculture (e.g., selective breeding, gene splicing, cloning, genetically modified organisms, gene therapy).", "BIO.B.3.1.1": "Explain how natural selection can impact allele frequencies of a population.", "BIO.B.3.1.2": "Describe the factors that can contribute to the development of new species (e.g., isolating mechanisms, genetic drift, founder effect, migration).", "BIO.B.3.1.3": "Explain how genetic mutations may result in genotypic and phenotypic variations within a population.", "BIO.B.3.2.1": "Interpret evidence supporting the theory of evolution (i.e., fossil, anatomical, physiological, embryological, biochemical, and universal genetic code).", "BIO.B.3.3.1": "Distinguish between the scientific terms: hypothesis, inference, law, theory, principle, fact, and observation.", "BIO.B.4.1.1": "Describe the levels of ecological organization (i.e., organism, population, community, ecosystem, biome, and biosphere).", "BIO.B.4.1.2": "Describe characteristic biotic and abiotic components of aquatic and terrestrial ecosystems.", "BIO.B.4.2.1": "Describe how energy flows through an ecosystem (e.g., food chains, food webs, energy pyramids).", "BIO.B.4.2.2": "Describe biotic interactions in an ecosystem (e.g., competition, predation, symbiosis).", "BIO.B.4.2.3": "Describe how matter recycles through an ecosystem (i.e., water cycle, carbon cycle, oxygen cycle, and nitrogen cycle).", "BIO.B.4.2.4": "Describe how ecosystems change in response to natural and human disturbances (e.g., climate changes, introduction of nonnative species, pollution, fires).", "BIO.B.4.2.5": "Describe the effects of limiting factors on population dynamics and potential species extinction."}; /* verbatim from PDE, Keystone Exams: Biology Assessment Anchors and Eligible Content */
const STEELS = {"3.1.9-12.A": "Construct an explanation based on evidence for how the structure of DNA determines the structure of proteins which carry out the essential functions of life through systems of specialized cells.", "3.1.9-12.B": "Develop and use a model to illustrate the hierarchical organization of interacting systems that provide specific functions within multicellular organisms.", "3.1.9-12.C": "Plan and conduct an investigation to provide evidence that feedback mechanisms maintain homeostasis.", "3.1.9-12.D": "Use a model to illustrate the role of cellular division (mitosis) and differentiation in producing and maintaining complex organisms.", "3.1.9-12.E": "Use a model to illustrate how photosynthesis transforms light energy into stored chemical energy.", "3.1.9-12.F": "Construct and revise an explanation based on evidence for how carbon, hydrogen, and oxygen from sugar molecules may combine with other elements to form amino acids and/or other large carbon-based molecules.", "3.1.9-12.G": "Use a model to illustrate that cellular respiration is a chemical process whereby the bonds of food molecules and oxygen molecules are broken and the bonds in new compounds are formed resulting in a net transfer of energy.", "3.1.9-12.H": "Use mathematical representations to support claims for the cycling of matter and flow of energy among organisms in an ecosystem.", "3.1.9-12.I": "Use mathematical and/or computational representations to support explanations of factors that affect carrying capacity of ecosystems at different scales.", "3.1.9-12.J": "Construct and revise an explanation based on evidence for the cycling of matter and flow of energy in aerobic and anaerobic conditions.", "3.1.9-12.K": "Develop a model to illustrate the role of photosynthesis and cellular respiration in the cycling of carbon among the biosphere, atmosphere, hydrosphere, and geosphere.", "3.1.9-12.L": "Use mathematical representations to support and revise explanations based on evidence about factors affecting biodiversity and populations in ecosystems of different scales.", "3.1.9-12.M": "Evaluate the claims, evidence, and reasoning that the complex interactions in ecosystems maintain relatively consistent numbers and types of organisms in stable conditions, but changing conditions may result in a new ecosystem.", "3.1.9-12.N": "Design, evaluate, and refine a solution for reducing the impacts of human activities on the environment and biodiversity.", "3.1.9-12.O": "Evaluate the evidence for the role of group behavior on individual and species’ chances to survive and reproduce.", "3.1.9-12.P": "Ask questions to clarify relationships about the role of DNA and chromosomes in coding the instructions for characteristic traits passed from parents to offspring.", "3.1.9-12.Q": "Make and defend a claim based on evidence that inheritable genetic variations may result from (1) new genetic combinations through meiosis, (2) viable errors occurring during replication, and/or (3) mutations caused by environmental factors.", "3.1.9-12.R": "Apply concepts of statistics and probability to explain the variation and distribution of expressed traits in a population.", "3.1.9-12.S": "Communicate scientific information that common ancestry and biological evolution are supported by multiple lines of empirical evidence.", "3.1.9-12.T": "Construct an explanation based on evidence that the process of evolution primarily results from four factors: (1) the potential for a species to increase in number, (2) the heritable genetic variation of individuals in a species due to mutation and sexual reproduction, (3) competition for limited resources, and (4) the proliferation of those organisms that are better able to survive and reproduce in the environment.", "3.1.9-12.U": "Apply concepts of statistics and probability to support explanations that organisms with an advantageous heritable trait tend to increase in proportion to organisms lacking this trait.", "3.1.9-12.V": "Create or revise a simulation to test a solution to mitigate the adverse impacts of human activity on biodiversity.", "3.1.9-12.W": "Construct an explanation based on evidence for how natural selection leads to adaptation of populations.", "3.1.9-12.X": "Evaluate the evidence supporting claims that changes in environmental conditions may result in (1) increases in the number of individuals of some species, (2) the emergence of new species over time, and (3) the extinction of other species.", "3.2.9-12.B": "Plan and conduct an investigation to gather evidence to compare the structure of substances at the bulk scale to infer the strength of electrical forces between particles.", "3.2.9-12.E": "Apply scientific principles and evidence to provide an explanation about the effects of changing the temperature or concentration of the reacting particles on the rate at which a reaction occurs.", "Nature of Science (STEELS Science and Engineering Practices)": "Not a lettered content standard: STEELS addresses the nature of science within its Science and Engineering Practices (\"Connections to Nature of Science\")."}; /* verbatim from PDE, PA STEELS K-12 standards (3.1 Life Science, 3.2 Physical Science, grades 9-12) */
function stdMap() { /* from the questions actually in the game: code -> { steels: {code: n}, worlds: {w: 1}, n } */
  const m = {}; Object.keys(QMAP).forEach(function (k) { const q = QMAP[k]; if (!q.code || !/^BIO\./.test(q.code)) return; const e = m[q.code] = m[q.code] || { steels: {}, worlds: {}, n: 0 }; e.n++; if (q.steels) e.steels[q.steels] = (e.steels[q.steels] || 0) + 1; if (q.world) e.worlds[q.world] = 1; });
  return m; }
function stShort(c) { return /^Nature/.test(c) ? 'Nature of Science' : c; }
function standardsTable() {
  const m = stdMap(), codes = Object.keys(m).sort();
  return '<table class="ftab stdtab"><tr><th>Keystone eligible content</th><th>PA STEELS (grades 9–12)</th><th>Where</th><th>Items</th></tr>' + codes.map(function (c) { const e = m[c], st = Object.keys(e.steels).sort(function (a, b) { return e.steels[b] - e.steels[a]; });
    return '<tr><td><b>' + esc(c) + '</b><br><span class="dim">' + esc(KEYSTONE[c] || '') + '</span></td><td>' + st.map(function (x) { return '<b>' + esc(stShort(x)) + '</b>' + (st.length > 1 ? ' (' + e.steels[x] + ')' : '') + '<br><span class="dim">' + esc(STEELS[x] || '') + '</span>'; }).join('<br>') + '</td><td>World ' + Object.keys(e.worlds).sort().join(', ') + '</td><td>' + e.n + '</td></tr>'; }).join('') + '</table>';
}
function buildProgress() {
  let html = '<h3>Mastery by unit</h3><p class="dim">Share of questions answered right on the first try.</p>';
  for (let w = 1; w <= BQ.UNITS.length; w++) {
    let r = 0, t = 0; Object.keys(S.codes).forEach(function (k) { if (S.codes[k].world === w) { r += S.codes[k].right; t += S.codes[k].tries; } });
    const pct = t ? Math.round(r / t * 100) : 0;
    html += '<div class="bar"><span>' + w + '. ' + BQ.UNITS[w - 1] + '</span><div class="track"><div class="fill" style="width:' + pct + '%"></div></div><span class="num">' + (BQ.worlds[w] ? (t ? pct + '%' : 'Not started') : 'Coming soon') + '</span></div>';
  }
  const codes = Object.keys(S.codes).sort();
  const sm = stdMap();
  if (codes.length) html += '<h3>By standard</h3><table class="ftab"><tr><th>Keystone</th><th>PA STEELS</th><th>First-try correct</th></tr>' + codes.map(function (k) { const st = sm[k] ? Object.keys(sm[k].steels).map(stShort).join(', ') : ''; return '<tr><td title="' + esc(KEYSTONE[k] || '') + '">' + esc(k) + '</td><td>' + esc(st) + '</td><td>' + S.codes[k].right + ' of ' + S.codes[k].tries + '</td></tr>'; }).join('') + '</table>';
  const top = BQ.Leaderboard.top(10).filter(function (r) { return nickOK(r.nick); }).slice(0, 5); if (!nickOK(S.nick)) { S.nick = ''; save(); }
  html += '<h3>High scores on this device</h3>' + (top.length ? '<ol class="board">' + top.map(function (r) { return '<li><span>' + esc(r.nick) + '</span><span class="num">' + r.score + '</span></li>'; }).join('') + '</ol>' : '<p class="dim">Enter a nickname below, then finish a level to post a score. Your total so far: ' + totalScore() + '.</p>');
  $('progBody').innerHTML = html; $('nick').value = S.nick;
}
function applySettings() {
  document.documentElement.style.setProperty('--ts', [0.9, 1, 1.15, 1.3][S.set.text]);
  $('setText').value = S.set.text; $('setLow').checked = S.set.low; $('setSound').checked = S.set.sound; $('setCap').checked = S.set.cap; $('setMusic').checked = S.set.music; $('setVol').value = S.set.vol; $('setSvol').value = S.set.svol == null ? 100 : S.set.svol; musicLevel(); if (BQ.amb) BQ.amb.refresh(); if (S.set.music && Music.want) Music.play(Music.want); $('setUnlock').checked = S.set.unlock;
  if (renderer) resize();
}
/* 3-D snapshots of specimens for journal cards (rendered once, then reused) */
let TH = null; const thumbCache = {};
function thumb(look, col) {
  const key = look + col; if (thumbCache[key]) return thumbCache[key];
  try {
    if (!TH) { TH = { scene: new T.Scene(), cam: new T.PerspectiveCamera(32, 1, 0.1, 50), rt: new T.WebGLRenderTarget(128, 128), buf: new Uint8Array(128 * 128 * 4), cv: document.createElement('canvas') };
      TH.cv.width = TH.cv.height = 128; TH.scene.add(new T.HemisphereLight('#ffffff', '#445566', 1.1)); const d = new T.DirectionalLight('#ffffff', 0.8); d.position.set(2, 4, 5); TH.scene.add(d); TH.cam.position.set(0, 1.5, 4.4); TH.cam.lookAt(0, 0.75, 0); }
    const g = specimen(look, col); g.rotation.y = 0.5; TH.scene.add(g);
    const oc = new T.Color(); renderer.getClearColor(oc); const oa = renderer.getClearAlpha();
    renderer.setRenderTarget(TH.rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(TH.scene, TH.cam); renderer.readRenderTargetPixels(TH.rt, 0, 0, 128, 128, TH.buf); renderer.setRenderTarget(null); renderer.setClearColor(oc, oa);
    TH.scene.remove(g);
    const ctx = TH.cv.getContext('2d'), img = ctx.createImageData(128, 128); for (let y = 0; y < 128; y++) img.data.set(TH.buf.subarray((127 - y) * 512, (128 - y) * 512), y * 512);
    ctx.clearRect(0, 0, 128, 128); ctx.putImageData(img, 0, 0); thumbCache[key] = TH.cv.toDataURL();
  } catch (e) { thumbCache[key] = ''; }
  return thumbCache[key];
}
let JTAB = 1;
function openJournal(from) { backTo = from || 'menu'; show('journal'); journalTab(JTAB); }
function journalTab(tab) {
  JTAB = tab; const tabs = []; for (let w = 1; w <= BQ.UNITS.length; w++) if (BQ.worlds[w]) tabs.push(w);
  $('jTabs').innerHTML = tabs.map(function (w) { return '<button type="button" data-jt="' + w + '" aria-pressed="' + (tab === w) + '">' + esc(tx('j.world', { n: w })) + '</button>'; }).join('') +
    (BQ.cozy ? '<button type="button" data-jt="cozy" aria-pressed="' + (tab === 'cozy') + '">🌿 ' + esc(tx('cz.reserve')) + '</button>' : '') +
    '<button type="button" data-jt="ach" aria-pressed="' + (tab === 'ach') + '">🏅 ' + esc(tx('j.achTab')) + '</button>';
  if (tab === 'cozy' && BQ.cozy) { $('jBody').innerHTML = BQ.cozy.journalHTML(); return; }
  if (tab === 'ach') {
    const got = ACH.filter(function (a) { return S.ach && S.ach[a.id]; }).length;
    $('jBody').innerHTML = '<p class="dim">' + esc(tx('j.earned', { n: got, m: ACH.length })) + '</p>' + ['short', 'medium', 'long'].map(function (tier) {
      return '<h3>' + esc(tx('j.' + tier)) + '</h3><div class="achs">' + ACH.filter(function (a) { return a.tier === tier; }).map(function (a) { const on = S.ach && S.ach[a.id];
        return '<div class="ach' + (on ? ' on' : '') + '"><span class="ai">' + (on ? a.ic : '🔒') + '</span><span><b>' + esc(tx('a.' + a.id)) + '</b><br><span class="dim">' + esc(tx('a.' + a.id + '.d')) + '</span></span></div>'; }).join('') + '</div>';
    }).join(''); return;
  }
  const w = tab, list = allLevels().filter(function (e) { return e.w.id === w; });
  const uniq = {}; let all = 0, fnd = 0;
  const html = list.map(function (e) {
    const pl = levelPlan(e.lv); let n = 0;
    const cards = pl.scans.map(function (id) {
      const sc = scanData(w, id); if (!sc) return ''; const f = !!(S.found && S.found[id]); if (f) n++;
      const img = thumb(sc.look || 'blob', sc.color || '#9fe0ff');
      return '<div class="jc' + (f ? '' : ' unk') + '">' + (img ? '<img alt="" src="' + img + '">' : '<span class="ji">?</span>') + '<div>' +
        (f ? '<b>' + esc(sc.name) + '</b> <span class="jw">' + esc(tx('j.word')) + ': ' + esc(sc.word) + '</span><p>' + esc(sc.note) + '</p>' : '<b>???</b><p class="dim">' + esc(tx('j.unknown')) + ' · ' + esc(tx('j.where', { lv: e.lv.id })) + '</p>') + '</div></div>';
    }).join('');
    pl.scans.forEach(function (id) { if (!uniq[id]) { uniq[id] = 1; all++; if (S.found && S.found[id]) fnd++; } }); const done = n === pl.scans.length && n > 0;
    return '<section class="jl"><h3>' + esc(e.lv.id + ' ' + e.lv.title) + ' <span class="jn' + (done ? ' ok' : '') + '">' + (done ? '✓ ' + esc(tx('j.collection')) : n + ' / ' + pl.scans.length) + '</span>' +
      (pl.rare ? ' <span class="jr">💎 ' + esc(tx('j.rare')) + ': ' + esc(S.rare[e.lv.id] ? tx('j.rareYes') : tx('j.rareNo')) + '</span>' : '') + '</h3><div class="jcs">' + cards + '</div></section>';
  }).join('');
  $('jBody').innerHTML = '<p class="dim">' + esc(tx('j.tip')) + '</p><p><b>' + esc(tx('j.found', { n: fnd, m: all })) + '</b></p>' + html;
}
function pause(on) {
  if (mode !== 'play') return; paused = on; show(on ? 'pause' : null); musicLevel();
  if (on) {
    const d = BQ.data[L.world.id] || {}, seen = {}, total = {};
    (d.scans || []).forEach(function (sc) { total[sc.word] = 1; });
    const words = (d.scans || []).filter(function (sc) { if (!S.words[sc.word] || seen[sc.word]) return false; seen[sc.word] = 1; return true; });
    $('guide').innerHTML = '<dt class="gh">Words you discovered: ' + words.length + ' of ' + Object.keys(total).length + '</dt>' +
      words.map(function (sc) { return '<dt>✓ ' + esc(sc.word) + '</dt><dd>' + esc(sc.def) + '</dd>'; }).join('') +
      '<dt class="gh">More words for this world</dt>' + (d.vocab || []).filter(function (t) { return !seen[t.term]; }).map(function (t) { return '<dt>' + esc(t.term) + '</dt><dd>' + esc(t.def) + '</dd>'; }).join('');
    $('btnResume').focus();
  }
}
function resize() {
  const c = $('stage'), w = c.clientWidth || 800, h = c.clientHeight || 450;
  renderer.setPixelRatio(S.set.low ? 1 : Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h, false);
  cam.aspect = w / h; const half = Math.tan(cam.fov * Math.PI / 360); camZ = Math.max(22, 14 / (half * cam.aspect)); cam.updateProjectionMatrix();
}
function tick(t) {
  requestAnimationFrame(tick);
  const dt = Math.min((t - last) / 1000 || 0, 1 / 30); last = t;
  if (mode === 'intro' && BQ.intro) BQ.intro.step(dt);
  else if (mode === 'cozy' && BQ.cozy) BQ.cozy.step(dt);
  else if (mode === 'dome' && BQ.dome) BQ.dome.step(dt);
  else if (mode === 'mini' && M) { if (M.kind === 'golf') golfStep(dt); else if (M.kind === 'dna') dnaStep(dt); else miniStep(dt); }
  else if (mode === 'play' && !paused) {
    step(dt);
    if (toastT > 0) { toastT -= dt; if (toastT <= 0) $('toast').hidden = true; }
  } else if (menuGrp) {
    const narrow = cam.aspect < 1; if (menuAlien) { menuAlien.rotation.y = Math.sin(t / 1400) * 0.5; menuAlien.position.y = Math.abs(Math.sin(t / 500)) * 0.08; }
    cam.position.set(narrow ? 0 : 2.3, narrow ? 0.4 : 1.7, narrow ? 11 : 8.5); cam.lookAt(narrow ? 0 : 2.3, narrow ? -0.9 : 1.3, 0);
    sceneryTick(1 / 60, t / 1000);
    menuGrp.userData.anim.forEach(function (a) { a.m.position.y = a.y + Math.sin(t / 1600 + a.ph) * a.amp; });
  }
  renderer.render(scene, cam);
}

/* ---------- controls ---------- */
let touchMode = false;
const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'jump', ArrowUp: 'jump', w: 'jump', W: 'jump', e: 'act', E: 'act', Enter: 'act', ArrowDown: 'duck', s: 'duck', S: 'duck', Shift: 'run' };
const held = {};
function press(k, down) {
  if (k === 'jump' && down && !keys.jump) jumpBuf = 0.12;
  if (k === 'act' && down && !keys.act) actEdge = true;
  keys[k] = down;
}
function wire() {
  window.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (mode === 'intro' && BQ.intro) { BQ.intro.key(e, true); return; }
    if (mode === 'cozy' && BQ.cozy) { BQ.cozy.key(e, true); return; }
    if (mode === 'dome' && BQ.dome) { BQ.dome.key(e, true); return; }
    if (mode === 'mini') { miniKey(e, true); return; }
    if (mode === 'play' && e.key === 'Escape' && L && L.active && L.active.refuel) { refuelNav('leave'); e.preventDefault(); return; }
    if (mode === 'play' && e.key === 'Escape' && L && L.active && (L.active.clue || L.active.portal)) { closeQ(); e.preventDefault(); return; }
    if (mode === 'play' && (e.key === 'p' || e.key === 'P' || e.key === 'Escape')) { pause(!paused); e.preventDefault(); return; }
    if (mode === 'play' && !paused && !(L && L.active) && (e.key === 'f' || e.key === 'F')) { useFly(); return; }
    if (mode === 'play' && !paused && (e.key === 'h' || e.key === 'H')) { useLens(); return; }
    if (e.key === 'm' || e.key === 'M') { S.set.music = !S.set.music; save(); applySettings(); toast(S.set.music ? 'Music on' : 'Music off (press M to turn it back on)', 2.5); return; }
    if (mode !== 'play' && !$('done').hidden && STTAB === 'practice' && /^[a-eA-E1-5]$/.test(e.key) && !(e.target && e.target.tagName === 'INPUT')) { practiceAnswer(/[1-5]/.test(e.key) ? +e.key - 1 : 'abcde'.indexOf(e.key.toLowerCase())); return; }
    if (mode !== 'play' || paused) return;
    if (e.target && e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) e.target.blur();
    if (L && L.active) {
      if (L.active.portal && /^(e|E|Enter| )$/.test(e.key)) { tryCode(); e.preventDefault(); return; }
      if (L.active.refuel && /^(e|E|Enter| )$/.test(e.key)) { refuelNav('next'); e.preventDefault(); return; }
      if (/^[a-eA-E]$/.test(e.key) && !L.active.lock) { answer('abcde'.indexOf(e.key.toLowerCase())); e.preventDefault(); return; }
      if (/^[1-9]$/.test(e.key)) { answer(+e.key - 1); e.preventDefault(); return; }
      if (KEYMAP[e.key]) { e.preventDefault(); return; }
    }
    const nk = e.key.length === 1 ? e.key.toLowerCase() : e.key, k = KEYMAP[nk];
    if (k) { held[nk] = true; press(k, true); e.preventDefault(); } else if (/^[1-9]$/.test(e.key)) answer(+e.key - 1);
  });
  /* a movement stops only when every key for it is released; answer keys never affect movement */
  window.addEventListener('keyup', function (e) {
    if (mode === 'intro') return;
    if (mode === 'cozy' && BQ.cozy) { BQ.cozy.key(e, false); return; }
    if (mode === 'dome') return;
    if (mode === 'mini') { miniKey(e, false); return; }
    const nk = e.key.length === 1 ? e.key.toLowerCase() : e.key, k = KEYMAP[nk]; if (!k || !held[nk]) return; delete held[nk];
    if (!Object.keys(held).some(function (h) { return KEYMAP[h] === k; })) press(k, false);
  });
  window.addEventListener('blur', function () { if (mode === 'cozy' && BQ.cozy) BQ.cozy.blur(); Object.keys(keys).forEach(function (k) { keys[k] = false; }); Object.keys(held).forEach(function (h) { delete held[h]; }); if (mode === 'play' && !paused) pause(true); });
  window.addEventListener('resize', resize);
  window.addEventListener('touchstart', function () { if (!touchMode) { touchMode = true; if (mode === 'play') $('touch').hidden = false; } }, { passive: true });
  document.querySelectorAll('#touch button').forEach(function (b) {
    const k = b.dataset.k, up = function (e) { press(k, false); e.preventDefault(); };
    b.addEventListener('pointerdown', function (e) { press(k, true); e.preventDefault(); }); b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
  });
  $('qopts').addEventListener('click', function (e) { const b = e.target.closest('.opt'); if (!b) return; b.blur(); if (b.dataset.close) { closeQ(); return; } if (b.dataset.rf) { refuelNav(b.dataset.rf); return; } if (b.dataset.try) { tryCode(); return; } answer(+b.dataset.i); });
  $('cust').addEventListener('click', function (e) { const b = e.target.closest('.chip'); if (!b) return; S.alien[b.dataset.k] = +b.dataset.v; save(); refreshAlien(); buildMenu(); const again = $('cust').querySelector('[data-k="' + b.dataset.k + '"][data-v="' + b.dataset.v + '"]'); if (again) again.focus(); });
  $('btnPlay').onclick = function () { openMap(); };
  $('btnCozy').hidden = !BQ.cozy; $('btnCozy').onclick = function () { if (BQ.cozy) BQ.cozy.start(); };
  ['pointerdown', 'pointermove', 'pointerup', 'wheel'].forEach(function (ev) { $('stage').addEventListener(ev, function (e) { if (mode === 'cozy' && BQ.cozy) BQ.cozy.pointer(e, ev); else if (mode === 'dome' && BQ.dome) BQ.dome.pointer(e, ev); }, ev === 'wheel' ? { passive: false } : undefined); });
  $('btnLevels').onclick = function () { openMap(); };
  $('btnAbout').onclick = function () { show('about'); $('aboutVer').textContent = VERSION;
    const sb = $('aboutStd'); if (sb) sb.innerHTML = (S.set.admin || TEACH) ? '<h3>Standards map (teachers)</h3><p class="dim">Every question and activity is tagged with a Keystone Biology eligible content code and the PA STEELS grades 9–12 standard it supports. "Items" counts the questions and activities for that code.</p>' + standardsTable() : '<p class="dim">Teachers: turn on admin mode (type the admin password on the main menu) to see a table of every Keystone eligible content code and its matching PA STEELS standard.</p>'; };
  $('menuVer').textContent = VERSION + ' · by J.E. Lynch' + (S.set.admin ? ' · ADMIN' : '');
  $('btnProgress').onclick = function () { buildProgress(); show('progress'); };
  $('btnSettings').onclick = function () { backTo = 'menu'; show('settings'); };
  $('levelList').addEventListener('click', function (e) { const b = e.target.closest('.lvl'); if (!b) return; if (b.dataset.lock) { mapInfo(+b.dataset.i); return; } const en = allLevels()[+b.dataset.i]; startLevel(en.w, en.lv); });
  $('levelList').addEventListener('keydown', function (e) { const b = e.target.closest && e.target.closest('.lvl'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  ['mouseover', 'focusin'].forEach(function (ev) { $('levelList').addEventListener(ev, function (e) { const b = e.target.closest && e.target.closest('.lvl'); if (b) mapInfo(+b.dataset.i); }); });
  $('btnMapPlay').onclick = function () { const e = nextUp(); if (e) startLevel(e.w, e.lv); };
  $('btnMap').onclick = function () { openMap(); };
  document.querySelectorAll('[data-back]').forEach(function (b) { b.onclick = function () { if ((b.closest('#settings') || b.closest('#journal')) && backTo === 'pause') show('pause'); else if (b.closest('#journal') && backTo === 'done') show('done'); else if (b.closest('#journal') && backTo === 'cozy') { show(null); if (BQ.cozy) BQ.cozy.resume(); } else show('menu'); }; });
  $('nick').addEventListener('input', function () { const v = $('nick').value.replace(/[^A-Za-z0-9 _-]/g, '').slice(0, 16); if (v !== $('nick').value) $('nick').value = v; $('nickMsg').textContent = ''; });
  const nickSave = function () {
    const v = $('nick').value.trim();
    if (!nickOK(v)) {
      if (TEACH) { S.okNames = (S.okNames || []).concat([v]); S.nick = v; save(); $('nickMsg').textContent = 'Teacher mode: "' + v + '" is allowed on this device even though it matched the word filter.'; $('nickMsg').className = 'dim'; return; }
      const sug = safeName(); $('nickMsg').innerHTML = 'Please choose a different username. Or use <button type="button" id="nickSug">' + sug + '</button>';
      $('nickMsg').className = 'nickbad'; $('nick').value = S.nick; $('nick').focus(); beep(200, 0.2, 'sawtooth', 'buzz, name not allowed');
      $('nickSug').onclick = function () { $('nick').value = sug; nickSave(); }; return;
    }
    S.nick = v; save(); $('nickMsg').textContent = v ? 'Saved: ' + v : ''; $('nickMsg').className = 'dim';
  };
  $('nick').addEventListener('change', nickSave); $('nick').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); nickSave(); } });
  $('setText').onchange = function () { S.set.text = +$('setText').value; save(); applySettings(); };
  ['Low', 'Sound', 'Music', 'Cap', 'Unlock'].forEach(function (n) { $('set' + n).onchange = function () { S.set[n.toLowerCase()] = $('set' + n).checked; save(); applySettings(); }; });
  $('setVol').oninput = function () { S.set.vol = +$('setVol').value; save(); musicLevel(); if (BQ.amb) BQ.amb.refresh(); };
  $('setSvol').oninput = function () { S.set.svol = +$('setSvol').value; save(); if (BQ.amb) BQ.amb.refresh(); };
  const firstTouch = function () { if (Music.gesture) return; Music.gesture = true; if (Music.want) Music.play(Music.want); };
  window.addEventListener('pointerdown', firstTouch); window.addEventListener('keydown', firstTouch);
  let armed = false;
  $('btnReset').onclick = function () {
    if (!armed) { armed = true; $('btnReset').textContent = 'Press again to erase all progress'; return; }
    armed = false; $('btnReset').textContent = 'Erase progress on this device'; const keep = S.set; S = fresh(); S.set = keep; save(); if (mode === 'menu') { refreshAlien(); buildMenu(); }
  };
  $('btnPause').onclick = function () { pause(true); };
  $('btnResume').onclick = function () { pause(false); };
  $('btnRestart').onclick = function () { startLevel(L.world, L.lv); };
  $('btnPauseSet').onclick = function () { backTo = 'pause'; show('settings'); };
  $('btnJournal').onclick = function () { openJournal('menu'); }; $('btnPauseJournal').onclick = function () { openJournal('pause'); };
  $('jTabs').addEventListener('click', function (e) { const b = e.target.closest('[data-jt]'); if (b) journalTab(b.dataset.jt === 'ach' || b.dataset.jt === 'cozy' ? b.dataset.jt : +b.dataset.jt); });
  $('btnQuit').onclick = menuScene; $('btnMenu').onclick = menuScene;
  $('btnReplay').onclick = function () { startLevel(LAST.w, LAST.lv); };
  $('btnNext').onclick = function () { const list = allLevels(), i = list.findIndex(function (e) { return e.lv === LAST.lv; }); startLevel(list[i + 1].w, list[i + 1].lv); };
  const aimAt = function (e) { if (mode !== 'mini' || !M || M.kind === 'dna') return; if (M.kind === 'golf') return golfPointer(e, 'move'); const r = $('stage').getBoundingClientRect(); M.cx = ((e.clientX - r.left) / r.width) * 2 - 1; M.cy = 1 - ((e.clientY - r.top) / r.height) * 2; };
  $('stage').addEventListener('pointermove', aimAt);
  $('stage').addEventListener('pointerdown', function (e) { if (mode !== 'mini' || !M || M.kind === 'dna') return; if (M.kind === 'golf') return golfPointer(e, 'down'); aimAt(e); miniFire(); });
  window.addEventListener('pointerup', function (e) { if (mode === 'mini' && M && M.kind === 'golf') golfPointer(e, 'up'); });
  $('mini').addEventListener('click', function (e) { const b = e.target.closest('button'); if (!b || !M) return; if (b.id === 'miniGo') miniStart(); else if (b.id === 'miniBack') exitMini(); else if (b.id === 'dnaNext') dnaNext(); else if (b.dataset.base) { dnaInput(b.dataset.base); b.blur(); } else if (b.dataset.ab != null) { miniSel(+b.dataset.ab); b.blur(); } });
  $('hudInv').addEventListener('click', function (e) { const b = e.target.closest('[data-use]'); if (!b) return; b.blur(); if (b.dataset.use === 'fly') useFly(); else useLens(); });
  $('stTabs').addEventListener('click', function (e) { const b = e.target.closest('[data-tab]'); if (!b) return; if (b.dataset.tab === 'journal') { openJournal('done'); return; } stationTab(b.dataset.tab); });
  $('stBody').addEventListener('click', stationClick);
}
/* HIDDEN ADMIN MODE (for the game's author): type the password anywhere on the main menu, or tap the version line 5 times and enter it.
   Only a scrambled number of the password is stored here, not the password itself. Admin mode unlocks every level and Biodome supply,
   lets you fly right away in the reserve, removes the map fog, and lets you tap the map to jump anywhere. Enter the password again to turn it off. */
const ADMIN_HASH = 4052282519, ADMIN_LEN = 13;
function pwHash(t) { let h = 5381; for (const ch of String(t).toLowerCase()) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0; return h; }
function adminNote(text) { let n = $('adminNote'); if (!n) { n = document.createElement('div'); n.id = 'adminNote'; n.setAttribute('role', 'status'); n.style.cssText = 'position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:99;background:#0b1d2a;color:#ffd166;border:2px solid #ffd166;border-radius:10px;padding:8px 14px;font-weight:700;max-width:90vw;text-align:center'; document.body.appendChild(n); }
  n.textContent = text; n.hidden = false; clearTimeout(adminNote.t); adminNote.t = setTimeout(function () { n.hidden = true; }, 5000); }
function adminTry(t) { if (pwHash(t) !== ADMIN_HASH) return false; const on = !S.set.admin; S.set.admin = on ? 1 : 0; S.set.unlock = on; save();
  $('teacherRow').hidden = !(on || TEACH); if ($('setUnlock')) $('setUnlock').checked = on; $('menuVer').textContent = VERSION + ' · by J.E. Lynch' + (on ? ' · ADMIN' : '');
  adminNote(on ? '🔓 Admin mode ON: every level and supply is unlocked. In the reserve you can fly right away, and tap the map to jump anywhere.' : '🔒 Admin mode OFF'); return true; }
function adminSetup() { let buf = '', taps = [];
  document.addEventListener('keydown', function (e) { if ($('menu').hidden || !e.key || e.key.length !== 1) return; const tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')) return;
    buf = (buf + e.key).slice(-ADMIN_LEN); if (buf.length === ADMIN_LEN && adminTry(buf)) buf = ''; });
  $('menuVer').addEventListener('click', function () { const now = Date.now(); taps = taps.filter(function (x) { return now - x < 3000; }); taps.push(now);
    if (taps.length >= 5) { taps = []; const t = window.prompt('Password'); if (t && !adminTry(t.trim())) adminNote('That is not the password.'); } });
  if (S.set.admin) $('menuVer').textContent = VERSION + ' · by J.E. Lynch · ADMIN'; }
function boot() {
  if (TEACH || S.set.admin) $('teacherRow').hidden = false;
  adminSetup();
  try {
    renderer = new T.WebGLRenderer({ canvas: $('stage'), antialias: !S.set.low });
  } catch (e) { $('err').hidden = false; return; }
  scene = new T.Scene(); cam = new T.PerspectiveCamera(42, 16 / 9, 0.5, 1200);
  HEMI = new T.HemisphereLight(0xffffff, 0x334455, 0.9); scene.add(HEMI);
  KEYL = new T.DirectionalLight(0xffffff, 0.8); KEYL.position.set(-6, 8, 8); scene.add(KEYL); makeFxTextures();
  G = { box: new T.BoxGeometry(1, 1, 1), sph: new T.SphereGeometry(1, 18, 12), tor: new T.TorusGeometry(1, 0.28, 8, 22), cone: new T.ConeGeometry(1, 2, 8),
    cyl: new T.CylinderGeometry(1, 1, 1, 12), ico: new T.IcosahedronGeometry(1, 0), oct: new T.OctahedronGeometry(1, 0), plane: new T.PlaneGeometry(1, 1) };
  wire(); applySettings(); menuScene(); requestAnimationFrame(tick);
  const jump = (location.hash || '').match(/level-(\d+-\d+)/i);
  if (jump) { const e = allLevels().find(function (x) { return x.lv.id === jump[1]; }); if (e) startLevel(e.w, e.lv); }
  BQ.core = { T: T, get scene() { return scene; }, get cam() { return cam; }, get renderer() { return renderer; }, get G() { return G; }, get S() { return S; }, get HEMI() { return HEMI; }, get KEYL() { return KEYL; },
    glow: glow, label: label, labelTex: labelTex, emat: emat, basic: basic, mesh: mesh, buildAlien: buildAlien, specimen: specimen, beep: beep, save: save, $: $, esc: esc, tx: tx, I18N: I18N, ACH: ACH, award: award,
    show: show, teardown: teardown, menuScene: menuScene, caption: caption, audio: function () { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return null; } return AC; }, openJournal: openJournal, journalTab: function (x) { journalTab(x); }, thumb: thumb, Music: Music, setMode: function (m) { mode = m; }, getMode: function () { return mode; }, disposeGroup: disposeGroup, teach: TEACH };
  if (BQ.onCore) BQ.onCore(); (BQ.onCoreList || []).forEach(function (f) { f(); });
  BQ._debug = { state: function () { return { mode: mode, L: L, P: P, S: S }; }, answer: answer, p1: { openRefuel: openRefuel, refuelNav: refuelNav, nearRefuel: nearRefuel, huntPick: huntPick, deliver: deliver, finish: finish, miss: miss }, start: startLevel, mini: function () { return M; }, cam: function () { return cam; } };
}
})();

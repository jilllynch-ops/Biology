/* EARTHLING FIELD GUIDE: WORD LAB (side game)
   Biology words are built from small parts: prefixes, roots and suffixes (photo + synthesis, hetero + troph).
   Two ways to play, no timer:
   - BUILD IT: read what a word means, then build it from part tiles.
   - CRACK THE CODE: see a word you may not know, use its parts to pick what it means.
   Every part you meet goes into your Word Parts list with its meaning. Words are grouped by unit, and each
   word shows its Spanish cousin (many biology words are almost the same in Spanish).
   Opens from the main menu. Best score and parts found are saved on this device. */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
const C = BQ.core, tx = C.tx;
Object.assign(C.I18N.en, {
  'wl.menu': '🔤 Word Lab', 'wl.title': 'Word Lab', 'wl.sub': 'Big biology words are made of small parts. Learn the parts and you can figure out words you have never seen.',
  'wl.build': '🧩 Build it', 'wl.buildD': 'Read the meaning, then build the word from part tiles.', 'wl.crack': '🔍 Crack the code', 'wl.crackD': 'Use the parts of a word to figure out what it means.',
  'wl.parts': '📖 My word parts', 'wl.unit': 'Words from', 'wl.all': 'All units', 'wl.u': 'Unit', 'wl.back': 'Back', 'wl.menuB': 'Back to menu',
  'wl.round': 'Word', 'wl.of': 'of', 'wl.score': 'Score', 'wl.streak': 'Streak', 'wl.best': 'Best',
  'wl.buildQ': 'Build the word that means:', 'wl.check': 'Check ✓', 'wl.undo': '↶ Undo', 'wl.clear': 'Clear', 'wl.hint': '💡 Hint',
  'wl.right': 'Yes!', 'wl.wrong': 'Not quite. Look at what each part means.', 'wl.next': 'Next ▶', 'wl.crackQ': 'What does this word mean?', 'wl.es': 'In Spanish:',
  'wl.done': 'Round complete!', 'wl.again': 'Play again', 'wl.found': 'parts found', 'wl.prefix': 'prefix', 'wl.root': 'root', 'wl.suffix': 'suffix',
  'wl.how': 'Tip: click the tiles in order (or press their number keys), then Check. Each tile shows what it means.',
  'wl.partsT': 'Word parts you have met', 'wl.partsNone': 'Play a round to start collecting parts.', 'wl.uses': 'in'
});
Object.assign(C.I18N.es, {
  'wl.menu': '🔤 Laboratorio de palabras', 'wl.title': 'Laboratorio de palabras', 'wl.sub': 'Las palabras grandes de biología están hechas de partes pequeñas. Aprende las partes y podrás descifrar palabras que nunca has visto.',
  'wl.build': '🧩 Constrúyela', 'wl.buildD': 'Lee el significado y construye la palabra con fichas de partes.', 'wl.crack': '🔍 Descifra el código', 'wl.crackD': 'Usa las partes de una palabra para descubrir qué significa.',
  'wl.parts': '📖 Mis partes de palabras', 'wl.unit': 'Palabras de', 'wl.all': 'Todas las unidades', 'wl.u': 'Unidad', 'wl.back': 'Atrás', 'wl.menuB': 'Volver al menú',
  'wl.round': 'Palabra', 'wl.of': 'de', 'wl.score': 'Puntos', 'wl.streak': 'Racha', 'wl.best': 'Mejor',
  'wl.buildQ': 'Construye la palabra que significa:', 'wl.check': 'Comprobar ✓', 'wl.undo': '↶ Deshacer', 'wl.clear': 'Borrar', 'wl.hint': '💡 Pista',
  'wl.right': '¡Sí!', 'wl.wrong': 'Todavía no. Mira lo que significa cada parte.', 'wl.next': 'Siguiente ▶', 'wl.crackQ': '¿Qué significa esta palabra?', 'wl.es': 'En español:',
  'wl.done': '¡Ronda terminada!', 'wl.again': 'Jugar otra vez', 'wl.found': 'partes encontradas', 'wl.prefix': 'prefijo', 'wl.root': 'raíz', 'wl.suffix': 'sufijo',
  'wl.how': 'Consejo: haz clic en las fichas en orden (o pulsa su número) y luego Comprobar. Cada ficha dice lo que significa.',
  'wl.partsT': 'Partes de palabras que conoces', 'wl.partsNone': 'Juega una ronda para empezar a reunir partes.', 'wl.uses': 'en'
});
/* word parts: kind (p prefix, r root, s suffix) and meaning in English | Spanish */
const PARTS = {
  'pro-': ['p', 'before', 'antes'], 'eu-': ['p', 'true', 'verdadero'], 'karyo': ['r', 'nucleus (kernel)', 'núcleo'], '-ote': ['s', 'a living thing', 'ser vivo'],
  'cyto': ['r', 'cell', 'célula'], '-plasm': ['s', 'formed material', 'material formado'], 'homeo-': ['p', 'same, steady', 'igual, estable'], '-stasis': ['s', 'staying, standing still', 'quedarse, permanecer'],
  'thermo': ['r', 'heat', 'calor'], 'osmo': ['r', 'push', 'empujar'], '-osis': ['s', 'process or condition', 'proceso o condición'], 'endo-': ['p', 'inside', 'dentro'], 'exo-': ['p', 'outside', 'fuera'],
  'chloro': ['r', 'green', 'verde'], '-plast': ['s', 'formed body (organelle)', 'cuerpo formado (organelo)'], 'lyso': ['r', 'break apart', 'romper'], '-some': ['s', 'body', 'cuerpo'],
  'hyper-': ['p', 'above, more', 'por encima, más'], 'hypo-': ['p', 'below, less', 'por debajo, menos'], 'iso-': ['p', 'equal', 'igual'], '-tonic': ['s', 'strength (of a solution)', 'fuerza (de una solución)'],
  'phago': ['r', 'eat', 'comer'], '-cyte': ['s', 'cell', 'célula'], 'photo': ['r', 'light', 'luz'], 'synthesis': ['r', 'putting together', 'unir, juntar'],
  'auto-': ['p', 'self', 'uno mismo'], 'hetero-': ['p', 'other, different', 'otro, diferente'], '-troph': ['s', 'feeder (nourish)', 'que se alimenta'],
  'herbi': ['r', 'plant', 'planta'], 'carni': ['r', 'meat', 'carne'], 'omni': ['r', 'all', 'todo'], '-vore': ['s', 'eater', 'que come'],
  'mono-': ['p', 'one', 'uno'], 'di-': ['p', 'two', 'dos'], 'poly-': ['p', 'many', 'muchos'], 'sacchar': ['r', 'sugar', 'azúcar'], '-ide': ['s', 'a compound', 'un compuesto'],
  'hydro': ['r', 'water', 'agua'], '-lysis': ['s', 'splitting apart', 'separación'], 'phyll': ['r', 'leaf', 'hoja'], 'an-': ['p', 'without', 'sin'], 'aero': ['r', 'air (oxygen)', 'aire (oxígeno)'], '-bic': ['s', 'living (life)', 'que vive'],
  'lip': ['r', 'fat', 'grasa'], '-ase': ['s', 'enzyme', 'enzima'], 'sym-': ['p', 'together', 'juntos'], 'bio': ['r', 'life', 'vida'], 'a-': ['p', 'not, without', 'no, sin'], '-tic': ['s', 'related to', 'relacionado con'],
  'eco': ['r', 'home, surroundings', 'casa, entorno'], '-logy': ['s', 'study of', 'estudio de'], 'pesti': ['r', 'pest', 'plaga'], '-cide': ['s', 'killer', 'que mata'],
  'homo-': ['p', 'same', 'igual'], '-zygous': ['s', 'joined pair (of alleles)', 'par unido (de alelos)'], 'haplo': ['r', 'single', 'sencillo'], 'diplo': ['r', 'double', 'doble'], '-oid': ['s', 'like, form', 'forma'],
  'kinesis': ['r', 'movement', 'movimiento'], 'geno': ['r', 'gene, origin', 'gen, origen'], 'pheno': ['r', 'show, appear', 'mostrar'], '-type': ['s', 'form, kind', 'forma, tipo'],
  'phylo': ['r', 'tribe, family line', 'tribu, linaje'], '-geny': ['s', 'origin, history', 'origen, historia'], 'paleo': ['r', 'old, ancient', 'antiguo'], 'onto': ['r', 'being', 'ser'],
  'allo-': ['p', 'other', 'otro'], 'patric': ['r', 'homeland', 'patria'], 'macro-': ['p', 'large', 'grande'], 'micro-': ['p', 'small', 'pequeño'], '-evolution': ['s', 'change over time', 'cambio con el tiempo'],
  'mito': ['r', 'thread', 'hilo'], 'chondri': ['r', 'grain', 'grano'], '-on': ['s', 'a thing', 'una cosa'], 'trans-': ['p', 'across', 'a través'], '-cription': ['s', 'writing', 'escritura'], '-lation': ['s', 'carrying', 'llevar'],
  'de-': ['p', 'remove, undo', 'quitar, deshacer'], 'nitri': ['r', 'nitrogen', 'nitrógeno'], '-fication': ['s', 'making', 'hacer'], 'eutro': ['r', 'well-fed', 'bien alimentado'], '-phication': ['s', 'feeding', 'alimentación'],
  'para-': ['p', 'beside', 'al lado'], '-site': ['s', 'food', 'alimento'], 'gen': ['r', 'produce, origin', 'producir, origen'], '-ic': ['s', 'related to', 'relacionado con'], 'muta': ['r', 'change', 'cambio'],
  'forest': ['r', 'forest', 'bosque'], '-ation': ['s', 'the process of', 'el proceso de'], 'diversity': ['r', 'variety', 'variedad'], 'over-': ['p', 'too much', 'demasiado'], 'popul': ['r', 'people, population', 'población'], 'speci': ['r', 'kind, species', 'tipo, especie'], 'bio-': ['p', 'life', 'vida']
};
/* words: unit, parts in order, meaning (en | es), Spanish word */
const WORDS = [
  [1, 'prokaryote', ['pro-', 'karyo', '-ote'], 'a cell with no nucleus (its DNA came "before the nucleus")', 'una célula sin núcleo', 'procariota'],
  [1, 'eukaryote', ['eu-', 'karyo', '-ote'], 'a cell with a true nucleus', 'una célula con un núcleo verdadero', 'eucariota'],
  [1, 'cytoplasm', ['cyto', '-plasm'], 'the jelly-like material inside a cell', 'el material gelatinoso dentro de la célula', 'citoplasma'],
  [1, 'homeostasis', ['homeo-', '-stasis'], 'keeping conditions inside the body steady', 'mantener estables las condiciones dentro del cuerpo', 'homeostasis'],
  [1, 'osmosis', ['osmo', '-osis'], 'water moving (being pushed) across a membrane', 'el agua que se mueve a través de una membrana', 'ósmosis'],
  [1, 'endocytosis', ['endo-', 'cyto', '-osis'], 'a cell taking things inside by wrapping its membrane around them', 'una célula que mete cosas envolviéndolas con su membrana', 'endocitosis'],
  [1, 'exocytosis', ['exo-', 'cyto', '-osis'], 'a cell sending things outside in little membrane bubbles', 'una célula que saca cosas en burbujas de membrana', 'exocitosis'],
  [1, 'chloroplast', ['chloro', '-plast'], 'the green organelle where photosynthesis happens', 'el organelo verde donde ocurre la fotosíntesis', 'cloroplasto'],
  [1, 'lysosome', ['lyso', '-some'], 'an organelle that breaks down old parts and waste', 'un organelo que descompone partes viejas y desechos', 'lisosoma'],
  [1, 'hypertonic', ['hyper-', '-tonic'], 'a solution with MORE dissolved stuff than the cell', 'una solución con MÁS sustancias disueltas que la célula', 'hipertónica'],
  [1, 'hypotonic', ['hypo-', '-tonic'], 'a solution with LESS dissolved stuff than the cell', 'una solución con MENOS sustancias disueltas que la célula', 'hipotónica'],
  [1, 'isotonic', ['iso-', '-tonic'], 'a solution with the SAME amount of dissolved stuff as the cell', 'una solución con la MISMA cantidad de sustancias disueltas que la célula', 'isotónica'],
  [1, 'phagocyte', ['phago', '-cyte'], 'a white blood cell that eats germs', 'un glóbulo blanco que se come los microbios', 'fagocito'],
  [1, 'transcription', ['trans-', '-cription'], 'copying (writing across) DNA into mRNA', 'copiar (escribir) el ADN en ARNm', 'transcripción'],
  [1, 'translation', ['trans-', '-lation'], 'carrying the mRNA message across into a protein', 'llevar el mensaje del ARNm a una proteína', 'traducción'],
  [1, 'mitochondrion', ['mito', 'chondri', '-on'], 'the organelle that releases energy from food (it looks like a grainy thread under a microscope)', 'el organelo que libera la energía de los alimentos', 'mitocondria'],
  [2, 'photosynthesis', ['photo', 'synthesis'], 'using light energy to put together sugar', 'usar la energía de la luz para formar azúcar', 'fotosíntesis'],
  [2, 'autotroph', ['auto-', '-troph'], 'a living thing that makes its own food', 'un ser vivo que fabrica su propio alimento', 'autótrofo'],
  [2, 'heterotroph', ['hetero-', '-troph'], 'a living thing that eats other living things for food', 'un ser vivo que se alimenta de otros seres vivos', 'heterótrofo'],
  [2, 'herbivore', ['herbi', '-vore'], 'an animal that eats plants', 'un animal que come plantas', 'herbívoro'],
  [2, 'carnivore', ['carni', '-vore'], 'an animal that eats meat', 'un animal que come carne', 'carnívoro'],
  [2, 'omnivore', ['omni', '-vore'], 'an animal that eats both plants and animals', 'un animal que come plantas y animales', 'omnívoro'],
  [2, 'monosaccharide', ['mono-', 'sacchar', '-ide'], 'a simple sugar made of one unit (like glucose)', 'un azúcar simple de una sola unidad (como la glucosa)', 'monosacárido'],
  [2, 'disaccharide', ['di-', 'sacchar', '-ide'], 'a sugar made of two units (like table sugar)', 'un azúcar de dos unidades (como el azúcar de mesa)', 'disacárido'],
  [2, 'polysaccharide', ['poly-', 'sacchar', '-ide'], 'a big carbohydrate made of many sugar units (like starch)', 'un carbohidrato grande de muchas unidades de azúcar (como el almidón)', 'polisacárido'],
  [2, 'hydrolysis', ['hydro', '-lysis'], 'splitting a big molecule apart using water', 'separar una molécula grande usando agua', 'hidrólisis'],
  [2, 'chlorophyll', ['chloro', 'phyll'], 'the green pigment in leaves that captures light', 'el pigmento verde de las hojas que capta la luz', 'clorofila'],
  [2, 'anaerobic', ['an-', 'aero', '-bic'], 'happening without oxygen', 'que ocurre sin oxígeno', 'anaeróbico'],
  [2, 'lipase', ['lip', '-ase'], 'an enzyme that breaks down fats', 'una enzima que descompone las grasas', 'lipasa'],
  [3, 'symbiosis', ['sym-', 'bio', '-osis'], 'two species living closely together', 'dos especies que viven muy juntas', 'simbiosis'],
  [3, 'abiotic', ['a-', 'bio', '-tic'], 'non-living parts of an ecosystem (water, sunlight, rocks)', 'las partes sin vida de un ecosistema (agua, luz, rocas)', 'abiótico'],
  [3, 'biotic', ['bio', '-tic'], 'living parts of an ecosystem', 'las partes vivas de un ecosistema', 'biótico'],
  [3, 'ecology', ['eco', '-logy'], 'the study of living things and their surroundings', 'el estudio de los seres vivos y su entorno', 'ecología'],
  [3, 'pesticide', ['pesti', '-cide'], 'a chemical that kills pests', 'una sustancia que mata plagas', 'pesticida'],
  [3, 'parasite', ['para-', '-site'], 'a living thing that lives on or in another and feeds on it', 'un ser vivo que vive en otro y se alimenta de él', 'parásito'],
  [3, 'eutrophication', ['eutro', '-phication'], 'too many nutrients in water, so algae grow out of control', 'demasiados nutrientes en el agua, y las algas crecen sin control', 'eutrofización'],
  [3, 'denitrification', ['de-', 'nitri', '-fication'], 'bacteria removing nitrogen from soil and returning it to the air', 'bacterias que quitan el nitrógeno del suelo y lo devuelven al aire', 'desnitrificación'],
  [3, 'deforestation', ['de-', 'forest', '-ation'], 'removing (cutting down) forests', 'quitar (talar) los bosques', 'deforestación'],
  [3, 'biodiversity', ['bio-', 'diversity'], 'the variety of life in an area', 'la variedad de vida en un lugar', 'biodiversidad'],
  [3, 'overpopulation', ['over-', 'popul', '-ation'], 'too many individuals for the resources an area has', 'demasiados individuos para los recursos de un lugar', 'sobrepoblación'],
  [4, 'homozygous', ['homo-', '-zygous'], 'having two of the SAME allele for a gene', 'tener dos alelos IGUALES para un gen', 'homocigoto'],
  [4, 'heterozygous', ['hetero-', '-zygous'], 'having two DIFFERENT alleles for a gene', 'tener dos alelos DIFERENTES para un gen', 'heterocigoto'],
  [4, 'haploid', ['haplo', '-oid'], 'a cell with a single set of chromosomes (like a sperm or egg)', 'una célula con un solo juego de cromosomas (como un óvulo)', 'haploide'],
  [4, 'diploid', ['diplo', '-oid'], 'a cell with two sets of chromosomes', 'una célula con dos juegos de cromosomas', 'diploide'],
  [4, 'cytokinesis', ['cyto', 'kinesis'], 'the cell splitting in two after mitosis', 'la célula que se divide en dos después de la mitosis', 'citocinesis'],
  [4, 'genotype', ['geno', '-type'], 'the alleles an organism has', 'los alelos que tiene un organismo', 'genotipo'],
  [4, 'phenotype', ['pheno', '-type'], 'the trait you can see (how the genes show)', 'el rasgo que se ve (cómo se muestran los genes)', 'fenotipo'],
  [4, 'polygenic', ['poly-', 'gen', '-ic'], 'a trait controlled by many genes (like height)', 'un rasgo controlado por muchos genes (como la estatura)', 'poligénico'],
  [5, 'phylogeny', ['phylo', '-geny'], 'the history of how groups of living things are related', 'la historia de cómo se relacionan los grupos de seres vivos', 'filogenia'],
  [5, 'paleontology', ['paleo', 'onto', '-logy'], 'the study of ancient life from fossils', 'el estudio de la vida antigua a partir de fósiles', 'paleontología'],
  [5, 'allopatric', ['allo-', 'patric'], 'new species forming when groups live in OTHER places, separated', 'nuevas especies que se forman cuando grupos viven en OTROS lugares, separados', 'alopátrica'],
  [5, 'speciation', ['speci', '-ation'], 'the process of forming new species', 'el proceso de formación de nuevas especies', 'especiación'],
  [5, 'macroevolution', ['macro-', '-evolution'], 'large changes over very long times, like new groups of species', 'grandes cambios en tiempos muy largos, como nuevos grupos de especies', 'macroevolución'],
  [5, 'microevolution', ['micro-', '-evolution'], 'small changes in allele frequencies in a population', 'pequeños cambios en las frecuencias de alelos de una población', 'microevolución']
].map(function (r) { return { u: r[0], w: r[1], p: r[2], en: r[3], es: r[4], sp: r[5] }; });
const ROUND = 8;
let L = null;
function $(id) { return document.getElementById(id); }
function es() { return C.S.set.lang === 'es'; }
function sv() { if (!C.S.wordlab) C.S.wordlab = { best: 0, parts: {}, built: 0 }; return C.S.wordlab; }
function mean(p) { const d = PARTS[p]; return d ? (es() ? d[2] : d[1]) : ''; }
function kind(p) { const d = PARTS[p]; return d ? { p: 'prefix', r: 'root', s: 'suffix' }[d[0]] : 'root'; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function ensureUI() {
  if ($('wlUI')) return;
  const css = document.createElement('style'); css.textContent = `
#wlUI { position: absolute; inset: 0; z-index: 25; display: grid; place-items: center; background: rgba(5,10,24,.55); }
#wlUI .card { width: min(760px, calc(100% - 24px)); max-width: none; max-height: calc(100% - 24px); overflow: auto; text-align: left; }
#wlUI h2 { margin: 0 0 4px; } .wlTop { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; } .wlTop .sp { flex: 1; }
.wlModes { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 10px 0; } .wlModes button { text-align: left; padding: 12px; } .wlModes small { display: block; opacity: .85; font-weight: 400; margin-top: 4px; }
.wlDef { font-size: 1.25em; margin: 8px 0 12px; padding: 10px 12px; border-radius: 10px; background: rgba(255,209,102,.12); border-left: 4px solid #ffd166; }
.wlSlots { display: flex; gap: 6px; flex-wrap: wrap; min-height: 60px; align-items: center; padding: 8px; border: 2px dashed #44617a; border-radius: 12px; margin-bottom: 10px; font-size: 1.3em; }
.wlTiles { display: flex; gap: 8px; flex-wrap: wrap; } .wlTile { display: flex; flex-direction: column; align-items: center; padding: 6px 12px; border-radius: 10px; min-width: 84px; }
.wlTile b { font-size: 1.2em; } .wlTile small { font-weight: 400; opacity: .9; font-size: .78em; } .wlTile i { font-style: normal; font-size: .7em; opacity: .7; }
.wlTile.p { background: #24476a; border-color: #7fd4ff; } .wlTile.r { background: #2f5a34; border-color: #7be0ad; } .wlTile.s { background: #5a3a6a; border-color: #c59cff; }
.wlTile.used { opacity: .35; } .wlTile.hint { box-shadow: 0 0 0 3px #ffd166; } .wlChip { padding: 4px 10px; border-radius: 8px; } .wlChip.p { background: #24476a; } .wlChip.r { background: #2f5a34; } .wlChip.s { background: #5a3a6a; }
.wlFb { margin: 10px 0; padding: 8px 10px; border-radius: 10px; } .wlFb.ok { background: rgba(123,224,173,.15); border-left: 4px solid #7be0ad; } .wlFb.no { background: rgba(255,122,106,.12); border-left: 4px solid #ff7a6a; }
.wlWord { font-size: 2em; font-weight: 700; letter-spacing: .02em; margin: 6px 0; } .wlOpts { display: grid; gap: 8px; } .wlOpts button { text-align: left; }
.wlList { columns: 2 220px; } .wlList div { break-inside: avoid; margin: 3px 0; }`;
  document.head.appendChild(css);
  const ui = document.createElement('div'); ui.id = 'wlUI'; ui.hidden = true; ui.innerHTML = '<div class="card" role="dialog" aria-label="Word Lab"></div>';
  $('toast').parentNode.appendChild(ui);
  ui.addEventListener('click', function (e) { const b = e.target.closest('button'); if (!b || !L) return; b.blur(); click(b.dataset); });
  window.addEventListener('keydown', function (e) { if (!L || $('wlUI').hidden) return; key(e); }, true);
}
function card(h) { $('wlUI').querySelector('.card').innerHTML = h; }
function esc(s) { return C.esc(s); }
function head(title) { const d = sv(); return '<div class="wlTop"><h2>🔤 ' + esc(title || tx('wl.title')) + '</h2><span class="sp"></span>' + (L.mode && L.mode !== 'home' ? '<span>' + esc(tx('wl.score')) + ': <b>' + L.score + '</b> · ' + esc(tx('wl.streak')) + ': <b>' + L.streak + '</b></span>' : '<span>' + esc(tx('wl.best')) + ': <b>' + (d.best || 0) + '</b></span>') +
  '<span class="btns"><button type="button" data-lang="en" aria-pressed="' + !es() + '">English</button><button type="button" data-lang="es" aria-pressed="' + es() + '">Español</button></span><button type="button" data-a="' + (L.mode === 'home' ? 'close' : 'home') + '">' + esc(tx(L.mode === 'home' ? 'wl.menuB' : 'wl.back')) + '</button></div>'; }
function home() {
  L.mode = 'home'; const d = sv(), units = [0, 1, 2, 3, 4, 5];
  card(head() + '<p>' + esc(tx('wl.sub')) + '</p><p><b>' + esc(tx('wl.unit')) + ':</b> ' + units.map(function (u) { return '<button type="button" data-a="unit" data-u="' + u + '" aria-pressed="' + (L.unit === u) + '">' + esc(u ? tx('wl.u') + ' ' + u : tx('wl.all')) + '</button>'; }).join(' ') + '</p>' +
    '<p class="dim">' + esc((BQ.UNITS || [])[L.unit - 1] || '') + '</p>' +
    '<div class="wlModes"><button type="button" class="primary" data-a="build">' + esc(tx('wl.build')) + '<small>' + esc(tx('wl.buildD')) + '</small></button><button type="button" class="primary" data-a="crack">' + esc(tx('wl.crack')) + '<small>' + esc(tx('wl.crackD')) + '</small></button>' +
    '<button type="button" data-a="parts">' + esc(tx('wl.parts')) + '<small>' + Object.keys(d.parts || {}).length + ' / ' + Object.keys(PARTS).length + ' ' + esc(tx('wl.found')) + '</small></button></div>');
}
function pool() { return WORDS.filter(function (w) { return !L.unit || w.u === L.unit; }); }
function startRound(mode) { L.mode = mode; L.score = 0; L.streak = 0; L.i = 0; L.list = shuffle(pool().slice()).slice(0, Math.min(ROUND, pool().length)); next(); }
function next() {
  if (L.i >= L.list.length) { return done(); }
  const w = L.list[L.i]; L.w = w; L.pick = []; L.tries = 0; L.fb = null;
  if (L.mode === 'build') { /* the right parts plus a few look-alike decoys of the same kinds */
    const decoy = shuffle(Object.keys(PARTS).filter(function (p) { return w.p.indexOf(p) < 0; })).filter(function (p, i, arr) { return w.p.some(function (q) { return PARTS[q][0] === PARTS[p][0]; }); }).slice(0, Math.max(3, 6 - w.p.length));
    L.tiles = shuffle(w.p.concat(decoy)); }
  else { const others = shuffle(pool().filter(function (q) { return q !== w; })); const more = others.length >= 3 ? others : shuffle(WORDS.filter(function (q) { return q !== w; })); L.opts = shuffle([w].concat(more.slice(0, 3))); }
  draw();
}
function partChips(ps) { return ps.map(function (p) { const k = PARTS[p] ? PARTS[p][0] : 'r'; return '<span class="wlChip ' + k + '"><b>' + esc(p) + '</b> = ' + esc(mean(p)) + '</span>'; }).join(' + '); }
function draw() {
  const w = L.w, title = tx(L.mode === 'build' ? 'wl.build' : 'wl.crack').replace(/^\S+\s/, '');
  let h = head(title) + '<p class="dim">' + esc(tx('wl.round')) + ' ' + (L.i + 1) + ' ' + esc(tx('wl.of')) + ' ' + L.list.length + ' · ' + esc(tx('wl.u')) + ' ' + w.u + '</p>';
  if (L.mode === 'build') {
    h += '<p>' + esc(tx('wl.buildQ')) + '</p><div class="wlDef">' + esc(es() ? w.es : w.en) + '</div>' +
      '<div class="wlSlots" aria-live="polite">' + (L.pick.length ? L.pick.map(function (i) { return '<b>' + esc(L.tiles[i].replace(/^-|-$/g, '')) + '</b>'; }).join('<span class="dim">+</span>') : '<span class="dim">…</span>') + '</div>' +
      '<div class="wlTiles">' + L.tiles.map(function (p, i) { const k = PARTS[p][0]; return '<button type="button" class="wlTile ' + k + (L.pick.indexOf(i) >= 0 ? ' used' : '') + (L.hintI === i ? ' hint' : '') + '" data-a="tile" data-i="' + i + '"' + (L.pick.indexOf(i) >= 0 || L.fb === 'ok' ? ' disabled' : '') + '><i>' + (i + 1) + ' · ' + esc(tx('wl.' + kind(p))) + '</i><b>' + esc(p) + '</b><small>' + esc(mean(p)) + '</small></button>'; }).join('') + '</div>';
    if (L.fb !== 'ok') h += '<div class="bdBtns" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px"><button type="button" data-a="undo">' + esc(tx('wl.undo')) + '</button><button type="button" data-a="clear">' + esc(tx('wl.clear')) + '</button><button type="button" data-a="hint">' + esc(tx('wl.hint')) + '</button><button type="button" class="primary" data-a="check"' + (L.pick.length ? '' : ' disabled') + '>' + esc(tx('wl.check')) + '</button></div><p class="dim">' + esc(tx('wl.how')) + '</p>';
  } else {
    h += '<p>' + esc(tx('wl.crackQ')) + '</p><div class="wlWord">' + esc(w.w) + '</div><p>' + partChips(w.p) + '</p><div class="wlOpts">' +
      L.opts.map(function (o, i) { return '<button type="button" data-a="opt" data-i="' + i + '"' + (L.fb === 'ok' ? ' disabled' : '') + '>' + (i + 1) + '. ' + esc(es() ? o.es : o.en) + '</button>'; }).join('') + '</div>';
  }
  if (L.fb === 'ok') h += '<div class="wlFb ok"><b>' + esc(tx('wl.right')) + '</b> <b>' + esc(w.w) + '</b> = ' + partChips(w.p) + '<br>' + esc(tx('wl.es')) + ' <b>' + esc(w.sp) + '</b></div><div style="margin-top:8px"><button type="button" class="primary" data-a="next">' + esc(tx('wl.next')) + '</button></div>';
  else if (L.fb === 'no') h += '<div class="wlFb no">' + esc(tx('wl.wrong')) + '</div>';
  card(h); const nb = $('wlUI').querySelector('[data-a="next"]'); if (nb) nb.focus();
}
function solved() {
  const pts = Math.max(20, 100 - L.tries * 30) + L.streak * 10; L.score += pts; L.streak = L.tries ? 0 : L.streak + 1; L.fb = 'ok';
  const d = sv(); L.w.p.forEach(function (p) { d.parts[p] = 1; }); d.built = (d.built || 0) + 1; C.save(); if (C.beep) C.beep(880, 0.12, 'sine', 'chime, correct');
  if (d.built >= 25 && C.award) try { C.award('wordsmith'); } catch (e) { /* no achievement */ }
}
function missed() { L.tries++; L.streak = 0; L.fb = 'no'; if (C.beep) C.beep(220, 0.12, 'triangle', 'buzz, try again'); }
function click(d) {
  if (d.lang) { C.S.set.lang = d.lang; C.save(); if (L.mode === 'home') home(); else if (L.mode === 'parts') parts(); else if (L.mode === 'done') done(); else draw(); return; }
  const a = d.a;
  if (a === 'close') { close(); return; } if (a === 'home') { home(); return; }
  if (a === 'unit') { L.unit = +d.u; home(); return; }
  if (a === 'build' || a === 'crack') { startRound(a); return; } if (a === 'parts') { parts(); return; } if (a === 'again') { startRound(L.last || 'build'); return; }
  if (a === 'tile') { const i = +d.i; if (L.pick.indexOf(i) < 0) { L.pick.push(i); L.fb = null; L.hintI = null; } draw(); return; }
  if (a === 'undo') { L.pick.pop(); L.fb = null; draw(); return; } if (a === 'clear') { L.pick = []; L.fb = null; draw(); return; }
  if (a === 'hint') { const nextPart = L.w.p[L.pick.length] || L.w.p[0]; L.hintI = L.tiles.indexOf(nextPart); L.tries = Math.max(L.tries, 1); draw(); return; }
  if (a === 'check') { const built = L.pick.map(function (i) { return L.tiles[i]; }); if (built.join('|') === L.w.p.join('|')) solved(); else { missed(); L.pick = []; } draw(); return; }
  if (a === 'opt') { const o = L.opts[+d.i]; if (o === L.w) solved(); else missed(); draw(); return; }
  if (a === 'next') { L.i++; next(); return; }
}
function key(e) {
  const k = e.key; if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); if (L.mode === 'home') close(); else home(); return; }
  e.stopPropagation();
  if (/^[1-9]$/.test(k) && L.fb !== 'ok') { const i = +k - 1; if (L.mode === 'build' && L.tiles && L.tiles[i]) { e.preventDefault(); click({ a: 'tile', i: i }); } else if (L.mode === 'crack' && L.opts && L.opts[i]) { e.preventDefault(); click({ a: 'opt', i: i }); } return; }
  if (k === 'Backspace' && L.mode === 'build') { e.preventDefault(); click({ a: 'undo' }); return; }
  if (k === 'Enter' && !(e.target && e.target.tagName === 'BUTTON')) { e.preventDefault(); if (L.fb === 'ok') click({ a: 'next' }); else if (L.mode === 'build' && L.pick.length) click({ a: 'check' }); }
}
function done() {
  if (L.mode !== 'done') { L.last = L.mode; const d = sv(); d.best = Math.max(d.best || 0, L.score); C.save(); }
  L.mode = 'done';
  card(head() + '<h3>🎉 ' + esc(tx('wl.done')) + '</h3><p>' + esc(tx('wl.score')) + ': <b>' + L.score + '</b> · ' + esc(tx('wl.best')) + ': <b>' + sv().best + '</b></p><p>' + Object.keys(sv().parts).length + ' / ' + Object.keys(PARTS).length + ' ' + esc(tx('wl.found')) + '</p>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="primary" data-a="again">' + esc(tx('wl.again')) + '</button><button type="button" data-a="parts">' + esc(tx('wl.parts')) + '</button><button type="button" data-a="home">' + esc(tx('wl.back')) + '</button></div>');
}
function parts() {
  L.mode = 'parts'; const d = sv(), have = Object.keys(PARTS).filter(function (p) { return d.parts[p]; });
  const where = function (p) { return WORDS.filter(function (w) { return w.p.indexOf(p) >= 0; }).slice(0, 3).map(function (w) { return w.w; }).join(', '); };
  card(head(tx('wl.partsT')) + (have.length ? ['p', 'r', 's'].map(function (k) { const list = have.filter(function (p) { return PARTS[p][0] === k; }); if (!list.length) return '';
    return '<h3>' + esc(tx('wl.' + { p: 'prefix', r: 'root', s: 'suffix' }[k])) + '</h3><div class="wlList">' + list.map(function (p) { return '<div><span class="wlChip ' + k + '"><b>' + esc(p) + '</b></span> ' + esc(mean(p)) + ' <span class="dim">(' + esc(tx('wl.uses')) + ' ' + esc(where(p)) + ')</span></div>'; }).join('') + '</div>'; }).join('') : '<p>' + esc(tx('wl.partsNone')) + '</p>'));
}
function open() { ensureUI(); L = { unit: 0, mode: 'home', score: 0, streak: 0 }; C.show(null); C.setMode('wordlab'); $('wlUI').hidden = false; home(); }
function close() { $('wlUI').hidden = true; L = null; C.setMode('menu'); C.show('menu'); setTimeout(function () { const b = $('btnWords'); if (b) b.focus(); }, 50); }
C.I18N.en['a.wordsmith'] = 'Wordsmith'; C.I18N.en['a.wordsmith.d'] = 'Build or crack 25 biology words in the Word Lab.'; C.I18N.es['a.wordsmith'] = 'Forjador de palabras'; C.I18N.es['a.wordsmith.d'] = 'Construye o descifra 25 palabras de biología en el Laboratorio de palabras.';
if (C.ACH && !C.ACH.some(function (q) { return q.id === 'wordsmith'; })) C.ACH.push({ id: 'wordsmith', ic: '🔤', tier: 'medium' });
(function () { const row = document.querySelector('#menu .modes'); if (!row || $('btnWords')) return; const b = document.createElement('button'); b.type = 'button'; b.id = 'btnWords'; b.className = 'primary'; b.textContent = tx('wl.menu'); b.onclick = open; row.appendChild(b);
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-ml]')) setTimeout(function () { b.textContent = tx('wl.menu'); }, 0); }); })();
BQ.wordlab = { open: open, close: close, WORDS: WORDS, PARTS: PARTS, _l: function () { return L; } };
}
if (window.FieldGuide && window.FieldGuide.core) init(); else (window.FieldGuide.onCoreList = window.FieldGuide.onCoreList || []).push(init);
})();

/* Earthling Field Guide: THE MICROSCOPE VIEW (Willow Creek research station).
   When the alien uses the microscope, the screen becomes the round view through the eyepiece: it comes into focus,
   the sample drifts gently, living things move, and labels point out the parts named on the discovery card.
   Two slides: leaf cells (cell walls, chloroplasts, nuclei) and pond water (green algae, rod-shaped bacteria, dead algae). */
(function () {
'use strict';
const BQ = window.FieldGuide; if (!BQ) return;
function init() {
const C = BQ.core, tx = C.tx;
Object.assign(C.I18N.en, { 'mi.title': 'Microscope', 'mi.leaf': '🍃 Oak leaf', 'mi.pond': '💧 Pond water', 'mi.labels': 'Labels', 'mi.close': 'Look away (E)',
  'mi.l.wall': 'Cell wall', 'mi.l.chloro': 'Chloroplasts', 'mi.l.nuc': 'Nucleus', 'mi.l.algae': 'Green algae cells', 'mi.l.bact': 'Bacteria', 'mi.l.dead': 'Dead algae',
  'mi.help': 'Drag to move the slide. Mouse wheel or + and − to zoom.' });
Object.assign(C.I18N.es, { 'mi.title': 'Microscopio', 'mi.leaf': '🍃 Hoja de roble', 'mi.pond': '💧 Agua del estanque', 'mi.labels': 'Etiquetas', 'mi.close': 'Dejar de mirar (E)',
  'mi.l.wall': 'Pared celular', 'mi.l.chloro': 'Cloroplastos', 'mi.l.nuc': 'Núcleo', 'mi.l.algae': 'Células de algas verdes', 'mi.l.bact': 'Bacterias', 'mi.l.dead': 'Algas muertas',
  'mi.help': 'Arrastra para mover el portaobjetos. Rueda del ratón o + y − para acercar.' });
const $ = function (id) { return document.getElementById(id); };
function rng(seed) { let s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------- the slides, built once in "slide units" (the round field is 2 units across, centred on 0) ---------- */
function leafSlide() { const R = rng(7), cells = [], CW = 0.66, CH = 0.4;
  for (let row = -5; row <= 4; row++) for (let col = -4; col <= 3; col++) { const ox = (row % 2) * CW * 0.5, x0 = col * CW + ox, y0 = row * CH, j = function () { return (R() - 0.5) * 0.05; };
    const pts = [[x0 + j(), y0 + j()], [x0 + CW + j(), y0 + j()], [x0 + CW + j(), y0 + CH + j()], [x0 + j(), y0 + CH + j()]];
    const ch = []; for (let k = 0, n = 20 + Math.floor(R() * 8); k < n; k++) ch.push({ u: R(), sp: 0.004 + R() * 0.006, s: 0.024 + R() * 0.008, a: R() * 6 });
    cells.push({ pts: pts, cx: x0 + CW / 2, cy: y0 + CH / 2, w: CW, h: CH, ch: ch, nuc: R() < 0.6 ? [0.25 + R() * 0.5, 0.3 + R() * 0.4] : null }); }
  return { kind: 'leaf', cells: cells }; }
function pondSlide() { const R = rng(11), fil = [], round = [], bac = [], dead = [];
  for (let i = 0; i < 5; i++) { const n = 7 + Math.floor(R() * 6), a = R() * 3.14, x = -1.2 + R() * 2.4, y = -1 + R() * 2, cells = []; for (let k = 0; k < n; k++) cells.push(k); fil.push({ x: x, y: y, a: a, n: n, w: 0.09, len: 0.16, ph: R() * 6, bend: (R() - 0.5) * 0.04 }); }
  for (let i = 0; i < 26; i++) { const x = -1.3 + R() * 2.6, y = -1.3 + R() * 2.6, k = 1 + Math.floor(R() * 4); for (let q = 0; q < k; q++) round.push({ x: x + (R() - 0.5) * 0.12, y: y + (R() - 0.5) * 0.12, r: 0.03 + R() * 0.025 }); }
  for (let i = 0; i < 4; i++) dead.push({ x: -1 + R() * 2, y: -1 + R() * 2, a: R() * 3.14, n: 3 + Math.floor(R() * 4) });
  for (let i = 0; i < 160; i++) { const d = i < 70 ? dead[i % dead.length] : null; bac.push({ x: d ? d.x + (R() - 0.5) * 0.45 : -1.4 + R() * 2.8, y: d ? d.y + (R() - 0.5) * 0.45 : -1.4 + R() * 2.8, a: R() * 6.28, sp: R() < 0.4 ? 0.02 + R() * 0.05 : 0.004, ph: R() * 6 }); }
  return { kind: 'pond', fil: fil, round: round, bac: bac, dead: dead }; }

let V = null, SPR = null;
function sprites() { if (SPR) return SPR; const mk = function (w, h, f) { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return c; };
  SPR = { chl: mk(64, 44, function (x, w, h) { const g = x.createRadialGradient(w * 0.38, h * 0.36, 0, w / 2, h / 2, w / 2); g.addColorStop(0, '#a8e866'); g.addColorStop(0.55, '#3e9a2a'); g.addColorStop(1, '#22601a'); x.fillStyle = g; x.beginPath(); x.ellipse(w / 2, h / 2, w / 2 - 1, h / 2 - 1, 0, 0, Math.PI * 2); x.fill(); }),
    alg: mk(64, 64, function (x, w) { const g = x.createRadialGradient(w * 0.38, w * 0.36, 0, w / 2, w / 2, w / 2); g.addColorStop(0, '#b8f070'); g.addColorStop(0.7, '#4aaa2a'); g.addColorStop(1, '#2a7a1a'); x.fillStyle = g; x.beginPath(); x.arc(w / 2, w / 2, w / 2 - 2, 0, Math.PI * 2); x.fill(); x.strokeStyle = 'rgba(30,80,20,0.7)'; x.lineWidth = 2; x.stroke(); }) };
  return SPR; }
function css() { if ($('czMicroCss')) return; const s = document.createElement('style'); s.id = 'czMicroCss';
  s.textContent = '#czMicro { position: fixed; inset: 0; z-index: 45; background: radial-gradient(circle at 40% 50%, #0b0f12 0%, #000 70%); display: flex; align-items: center; justify-content: center; gap: 22px; padding: 12px; opacity: 0; transition: opacity .35s; }' +
    '#czMicro.on { opacity: 1; } #czMicro canvas { touch-action: none; cursor: grab; border-radius: 50%; flex: none; } #czMicro .mp { width: min(340px, 34vw); color: #e8f4ff; font-size: 15px; line-height: 1.4; }' +
    '#czMicro h3 { margin: 0 0 6px; color: #9fffd8; font-size: 20px; } #czMicro .mag { color: #ffd166; font-weight: 700; } #czMicro .tabs { display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap; } #czMicro button { font: inherit; padding: 6px 12px; border-radius: 9px; border: 2px solid #3a6a8a; background: #10283a; color: #fff; cursor: pointer; }' +
    '#czMicro button[aria-pressed="true"] { border-color: #9fffd8; box-shadow: 0 0 10px rgba(159,255,216,.5); } #czMicro .dim { opacity: .7; font-size: 13px; } #czMicro .close { margin-top: 10px; background: #ffd166; color: #1a1020; border-color: #ffd166; font-weight: 700; }' +
    '@media (max-width: 760px) { #czMicro { flex-direction: column; } #czMicro .mp { width: 92vw; } }';
  document.head.appendChild(s); }
/* open the microscope: list = the slides you have (['leafcell'], ['algae'] or both), first = the one to show */
function open(list, first, onClose) {
  if (V) close(); css(); const d = document.createElement('div'); d.id = 'czMicro'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', tx('mi.title'));
  const S = Math.floor(Math.min(window.innerHeight * 0.8, window.innerWidth * (window.innerWidth < 760 ? 0.86 : 0.56))), dpr = Math.min(1.5, window.devicePixelRatio || 1);
  d.innerHTML = '<canvas width="' + S * dpr + '" height="' + S * dpr + '" style="width:' + S + 'px;height:' + S + 'px" aria-hidden="true"></canvas><div class="mp"><h3>🔬 ' + C.esc(tx('mi.title')) + ' · <span class="mag">400×</span></h3><div class="tabs"></div><p class="txt"></p>' +
    '<label><input type="checkbox" class="lab" checked> ' + C.esc(tx('mi.labels')) + '</label><p class="dim">' + C.esc(tx('mi.help')) + '</p><button type="button" class="close">' + C.esc(tx('mi.close')) + '</button></div>';
  document.body.appendChild(d); requestAnimationFrame(function () { d.classList.add('on'); });
  V = { d: d, cv: d.querySelector('canvas'), S: S, dpr: dpr, list: list, kind: null, slide: null, t: 0, last: performance.now(), panX: 0, panY: 0, zoom: 1, labels: true, onClose: onClose, raf: 0 };
  V.x = V.cv.getContext('2d'); V.off = document.createElement('canvas'); V.off.width = V.cv.width; V.off.height = V.cv.height; V.ox = V.off.getContext('2d'); sprites(); d.querySelector('.close').onclick = close; d.querySelector('.lab').onchange = function (e) { V.labels = e.target.checked; };
  d.querySelector('.tabs').innerHTML = list.length > 1 ? list.map(function (k) { return '<button type="button" data-k="' + k + '">' + C.esc(tx(k === 'leafcell' ? 'mi.leaf' : 'mi.pond')) + '</button>'; }).join('') : '';
  d.querySelector('.tabs').onclick = function (e) { const b = e.target.closest('[data-k]'); if (b) show(b.dataset.k); };
  V.cv.addEventListener('pointerdown', function (e) { V.drag = { x: e.clientX, y: e.clientY, px: V.panX, py: V.panY }; V.cv.setPointerCapture(e.pointerId); });
  V.cv.addEventListener('pointermove', function (e) { if (!V || !V.drag) return; const k = 2 / (V.S * V.zoom); V.panX = Math.max(-0.8, Math.min(0.8, V.drag.px - (e.clientX - V.drag.x) * k)); V.panY = Math.max(-0.8, Math.min(0.8, V.drag.py - (e.clientY - V.drag.y) * k)); });
  V.cv.addEventListener('pointerup', function () { if (V) V.drag = null; });
  V.cv.addEventListener('wheel', function (e) { e.preventDefault(); zoom(e.deltaY > 0 ? 1 / 1.15 : 1.15); }, { passive: false });
  show(first || list[0]); C.beep(520, 0.12, 'triangle', 'click, microscope focus'); setTimeout(function () { const b = d.querySelector('.close'); if (b) b.focus(); }, 60);
  V.raf = requestAnimationFrame(frame);
}
function zoom(f) { if (V) V.zoom = Math.max(0.8, Math.min(2.2, V.zoom * f)); }
function show(kind) { V.kind = kind; V.slide = kind === 'leafcell' ? leafSlide() : pondSlide(); V.t = 0; V.panX = V.panY = 0; V.zoom = 1;
  V.d.querySelector('.txt').textContent = tx('cz.d.' + kind); V.d.querySelectorAll('.tabs [data-k]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === kind ? 'true' : 'false'); }); }
function close() { if (!V) return; const v = V; V = null; cancelAnimationFrame(v.raf); v.d.classList.remove('on'); setTimeout(function () { v.d.remove(); }, 350); if (v.onClose) v.onClose(); }
function key(e) { if (!V) return false; const k = e.key; if (k === 'Escape' || k === 'e' || k === 'E' || (k === 'Enter' && !(e.target && e.target.tagName === 'BUTTON'))) { e.preventDefault(); close(); return true; }
  if (k === '+' || k === '=') zoom(1.15); else if (k === '-' || k === '_') zoom(1 / 1.15); else if (k === 'Tab' && V.list.length > 1 && !e.shiftKey && document.activeElement === V.d.querySelector('.close')) { /* let the browser move focus */ }
  return true; }

/* ---------- drawing ---------- */
function frame(now) { if (!V) return; const dt = Math.min(0.05, (now - V.last) / 1000); if (dt >= 1 / 40 || V.t === 0) { V.last = now; V.t += dt; draw(dt); } V.raf = requestAnimationFrame(frame); } /* about 30 pictures a second is plenty */
function draw(dt) {
  const x = V.x, S = V.S * V.dpr, h = S / 2, t = V.t, open = Math.min(1, t / 0.6), focus = Math.max(0, 1 - t / 1.4);
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, S, S);
  const r = h * (0.2 + 0.8 * (1 - Math.pow(1 - open, 3))) * 0.97; /* the eyepiece comes up to the alien's eye */
  x.save(); x.beginPath(); x.arc(h, h, r, 0, Math.PI * 2); x.clip();
  /* bright-field light under the slide */
  const bg = x.createRadialGradient(h * 0.9, h * 0.85, 0, h, h, h); if (V.slide.kind === 'leaf') { bg.addColorStop(0, '#fbfbe8'); bg.addColorStop(1, '#e2e8c8'); } else { bg.addColorStop(0, '#f4f8f0'); bg.addColorStop(1, '#d8e2dc'); } x.fillStyle = bg; x.fillRect(0, 0, S, S);
  /* slide units -> pixels, with a slow drift of the slide; drawn on a hidden canvas, then copied in (blurred while it comes into focus) */
  const o = V.ox, sc = h * 0.95 * V.zoom, ox = h - (V.panX + Math.sin(t * 0.13) * 0.03) * sc, oy = h - (V.panY + Math.cos(t * 0.11) * 0.025) * sc; o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, S, S); o.setTransform(sc, 0, 0, sc, ox, oy);
  const L = V.slide.kind === 'leaf' ? drawLeaf(o, t, sc) : drawPond(o, t, sc, dt);
  x.filter = focus > 0.01 ? 'blur(' + (focus * focus * 14 * V.dpr).toFixed(1) + 'px)' : 'none'; x.drawImage(V.off, 0, 0); x.filter = 'none';
  /* labels: a line from the thing to a tag near the edge of the view */
  x.restore(); x.save();
  if (V.labels && t > 1.6 && L) { const a = Math.min(1, (t - 1.6) / 0.6); x.globalAlpha = a; x.font = '600 ' + Math.round(15 * V.dpr) + 'px system-ui, sans-serif'; x.lineWidth = 2 * V.dpr;
    L.forEach(function (lb) { const px = ox + lb.x * sc, py = oy + lb.y * sc; if (Math.hypot(px - h, py - h) > r * 0.92) return; const da = Math.atan2(lb.ty - 0.5, lb.tx - 0.5), tx0 = h + Math.cos(da) * r * 0.62, ty0 = h + Math.sin(da) * r * 0.72, w = x.measureText(lb.text).width + 14 * V.dpr, hh = 24 * V.dpr;
      x.strokeStyle = '#1a1a2a'; x.beginPath(); x.moveTo(px, py); x.lineTo(tx0, ty0); x.stroke(); x.fillStyle = '#1a1a2a'; x.beginPath(); x.arc(px, py, 4 * V.dpr, 0, Math.PI * 2); x.fill();
      const bx = Math.max(h - r * 0.8, Math.min(h + r * 0.8 - w, tx0 - (lb.tx > 0.5 ? w * 0.15 : w * 0.85))), by = ty0 - hh / 2; x.fillStyle = 'rgba(255,255,255,0.92)'; x.fillRect(bx, by, w, hh); x.strokeRect(bx, by, w, hh); x.fillStyle = '#10202c'; x.fillText(lb.text, bx + 7 * V.dpr, by + hh * 0.7); }); x.globalAlpha = 1; }
  x.restore();
  /* the eyepiece: dark rim, soft vignette, a faint glint */
  const vg = x.createRadialGradient(h, h, r * 0.7, h, h, r); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(0.85, 'rgba(0,0,0,0.25)'); vg.addColorStop(1, 'rgba(0,0,0,0.85)'); x.fillStyle = vg; x.beginPath(); x.arc(h, h, r, 0, Math.PI * 2); x.fill();
  x.strokeStyle = '#1c2226'; x.lineWidth = 10 * V.dpr; x.beginPath(); x.arc(h, h, r + 4 * V.dpr, 0, Math.PI * 2); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 3 * V.dpr; x.beginPath(); x.arc(h, h, r - 6 * V.dpr, -2.4, -1.6); x.stroke();
}
function poly(x, pts) { x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]); x.closePath(); }
function along(pts, u) { /* a point u (0..1) of the way around a 4-sided cell, pulled slightly inside */ const per = [], n = pts.length; let tot = 0; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], l = Math.hypot(b[0] - a[0], b[1] - a[1]); per.push(l); tot += l; }
  let d = ((u % 1) + 1) % 1 * tot; for (let i = 0; i < n; i++) { if (d <= per[i]) { const a = pts[i], b = pts[(i + 1) % n], k = d / per[i]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= per[i]; } return pts[0]; }
function drawLeaf(x, t, sc) {
  const lw = 1 / sc, vr = 1.15 / V.zoom + 0.3, cells = V.slide.cells.filter(function (c) { return Math.abs(c.cx - V.panX) < vr && Math.abs(c.cy - V.panY) < vr; }); let pick = null; /* only the cells in view */
  cells.forEach(function (c) { /* cytoplasm, cell wall (thick, pale) and the membrane just inside it */
    poly(x, c.pts); x.fillStyle = 'rgba(200,232,170,0.55)'; x.fill(); x.strokeStyle = '#6a9a4a'; x.lineWidth = 10 * lw; x.stroke(); x.strokeStyle = '#e4f6d0'; x.lineWidth = 3.5 * lw; x.stroke(); });
  cells.forEach(function (c) { if (c.nuc) { const nx = c.pts[0][0] + c.w * c.nuc[0], ny = c.pts[0][1] + c.h * c.nuc[1]; x.fillStyle = 'rgba(150,160,140,0.55)'; x.beginPath(); x.ellipse(nx, ny, 0.05, 0.042, 0, 0, Math.PI * 2); x.fill(); x.strokeStyle = 'rgba(90,100,80,0.6)'; x.lineWidth = 1.5 * lw; x.stroke(); x.fillStyle = 'rgba(90,100,90,0.6)'; x.beginPath(); x.arc(nx + 0.008, ny - 0.006, 0.014, 0, Math.PI * 2); x.fill(); if (!pick) pick = [nx, ny]; }
    /* chloroplasts: green ovals lining the inside of the wall, drifting slowly around the cell */
    const inset = [[c.pts[0][0] + 0.05, c.pts[0][1] + 0.05], [c.pts[1][0] - 0.05, c.pts[1][1] + 0.05], [c.pts[2][0] - 0.05, c.pts[2][1] - 0.05], [c.pts[3][0] + 0.05, c.pts[3][1] - 0.05]];
    c.ch.forEach(function (q) { const p = along(inset, q.u + t * q.sp), w = q.s * 2.5, hh = q.s * 1.7; x.save(); x.translate(p[0], p[1]); x.rotate(q.a + t * 0.2); x.drawImage(SPR.chl, -w / 2, -hh / 2, w, hh); x.restore(); }); });
  const c0 = cells.reduce(function (b, c) { return Math.hypot(c.cx - 0.1, c.cy + 0.05) < Math.hypot(b.cx - 0.1, b.cy + 0.05) ? c : b; }, cells[0]), ch = along([[c0.pts[0][0] + 0.05, c0.pts[0][1] + 0.05], [c0.pts[1][0] - 0.05, c0.pts[1][1] + 0.05], [c0.pts[2][0] - 0.05, c0.pts[2][1] - 0.05], [c0.pts[3][0] + 0.05, c0.pts[3][1] - 0.05]], c0.ch[0].u + t * c0.ch[0].sp);
  const wall = [(c0.pts[1][0] + c0.pts[2][0]) / 2, (c0.pts[1][1] + c0.pts[2][1]) / 2], nucC = cells.filter(function (c) { return c.nuc; }).reduce(function (b, c) { return Math.hypot(c.cx + 0.3, c.cy - 0.35) < Math.hypot(b.cx + 0.3, b.cy - 0.35) ? c : b; });
  return [{ x: wall[0], y: wall[1], tx: 0.86, ty: 0.24, text: tx('mi.l.wall') }, { x: ch[0], y: ch[1], tx: 0.88, ty: 0.62, text: tx('mi.l.chloro') },
    { x: nucC.pts[0][0] + nucC.w * nucC.nuc[0], y: nucC.pts[0][1] + nucC.h * nucC.nuc[1], tx: 0.14, ty: 0.78, text: tx('mi.l.nuc') }]; }
function drawPond(x, t, sc, dt) {
  const P = V.slide, lw = 1 / sc;
  /* dead algae: broken, brownish pieces with bacteria crowded around them */
  P.dead.forEach(function (d) { x.save(); x.translate(d.x, d.y); x.rotate(d.a); for (let k = 0; k < d.n; k++) { x.fillStyle = k % 2 ? 'rgba(150,120,70,0.55)' : 'rgba(130,110,70,0.5)'; x.strokeStyle = 'rgba(110,90,50,0.7)'; x.lineWidth = 2 * lw;
    x.beginPath(); x.rect(k * 0.15 - 0.3, -0.045 + (k % 2) * 0.01, 0.14, 0.09); x.fill(); x.stroke(); } x.restore(); });
  /* filaments of green algae: chains of cells, each with a spiral green ribbon (like Spirogyra); they sway a little */
  P.fil.forEach(function (f) { x.save(); x.translate(f.x, f.y); x.rotate(f.a + Math.sin(t * 0.4 + f.ph) * 0.03);
    for (let k = 0; k < f.n; k++) { const cx = (k - f.n / 2) * f.len, cy = Math.sin(k * 0.6 + f.ph) * f.bend * 2; x.fillStyle = 'rgba(210,240,200,0.6)'; x.strokeStyle = '#4a8a3a'; x.lineWidth = 2.2 * lw; x.beginPath(); x.rect(cx, cy - f.w / 2, f.len, f.w); x.fill(); x.stroke();
      x.strokeStyle = '#3aa02a'; x.lineWidth = 5 * lw; x.beginPath(); for (let s = 0; s <= 28; s++) { const u = s / 28, px = cx + u * f.len, py = cy + Math.sin(u * Math.PI * 3 + k * 3) * f.w * 0.32; if (s) x.lineTo(px, py); else x.moveTo(px, py); } x.stroke(); }
    x.restore(); });
  /* round green algae cells */
  P.round.forEach(function (q, i) { x.drawImage(SPR.alg, q.x + Math.sin(t * 0.5 + i) * 0.004 - q.r, q.y + Math.cos(t * 0.4 + i) * 0.004 - q.r, q.r * 2, q.r * 2); });
  /* bacteria: tiny rods; some swim, the rest jiggle (they are breaking down the dead algae) */
  x.fillStyle = '#6a4a6a'; P.bac.forEach(function (b) { b.a += Math.sin(t * 2 + b.ph) * dt * 0.8; b.x += Math.cos(b.a) * b.sp * dt + (Math.random() - 0.5) * 0.002; b.y += Math.sin(b.a) * b.sp * dt + (Math.random() - 0.5) * 0.002;
    if (b.x > 1.6) b.x = -1.6; if (b.x < -1.6) b.x = 1.6; if (b.y > 1.6) b.y = -1.6; if (b.y < -1.6) b.y = 1.6;
    x.save(); x.translate(b.x, b.y); x.rotate(b.a); x.beginPath(); x.ellipse(0, 0, 0.016, 0.006, 0, 0, Math.PI * 2); x.fill(); x.restore(); });
  const f0 = P.fil.reduce(function (b, f) { return Math.hypot(f.x, f.y) < Math.hypot(b.x, b.y) ? f : b; }), r0 = P.round.reduce(function (b, q) { return Math.hypot(q.x + 0.4, q.y - 0.4) < Math.hypot(b.x + 0.4, b.y - 0.4) ? q : b; }), d0 = P.dead.reduce(function (b, d) { return Math.hypot(d.x - 0.2, d.y - 0.3) < Math.hypot(b.x - 0.2, b.y - 0.3) ? d : b; });
  const b0 = P.bac.slice(0, 70).reduce(function (b, q) { return Math.hypot(q.x - d0.x - 0.25, q.y - d0.y) < Math.hypot(b.x - d0.x - 0.25, b.y - d0.y) ? q : b; });
  return [{ x: f0.x, y: f0.y, tx: 0.86, ty: 0.2, text: tx('mi.l.algae') }, { x: r0.x, y: r0.y, tx: 0.13, ty: 0.83, text: tx('mi.l.algae') }, { x: d0.x, y: d0.y, tx: 0.14, ty: 0.18, text: tx('mi.l.dead') }, { x: b0.x, y: b0.y, tx: 0.88, ty: 0.8, text: tx('mi.l.bact') }]; }

BQ.micro = { open: open, close: close, key: key, isOpen: function () { return !!V; }, _skip: function (s) { if (V) V.t += s; } };
}
if (BQ.core) init(); else (BQ.onCoreList = BQ.onCoreList || []).push(init);
})();

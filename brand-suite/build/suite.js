// Naledi Art Studio — brand suite.
// Type: Jost Light, SIL Open Font License. Free to use in a logo, which
// Gotham Narrow was not. Its stem is 7.9% of cap against her measured 7.7%,
// closer than Gotham's 7.1%, so no hairline stroke is needed to fake weight.
// Everything is outlined; the artwork is the client's own vector, untouched.

const fs = require('fs');
const ot = require('opentype.js');
const { pathData } = require('./pathdata');
const L = require('./lockup');

const UF = 'C:/Users/IC RUSTENBURG/AppData/Local/Microsoft/Windows/Fonts/';
const loadFont = p => { const b = fs.readFileSync(p); return ot.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const F = loadFont('D:/Naledi Art Studio/fonts/Jost-Light.ttf');
const UPEM = F.unitsPerEm;
const CAP = Math.abs(F.charToGlyph('H').getPath(0, 0, UPEM).getBoundingBox().y1);
const STEM = (b => (b.x2 - b.x1) / CAP)(F.charToGlyph('I').getPath(0, 0, UPEM).getBoundingBox());

const INK = '#241C2C';
const GOLD = '#D29E38';
const ART = L.artwork();

/* ------------------------------------------------------------- straight --- */
function run(text, cap, track) {
  const size = cap * UPEM / CAP, scale = size / UPEM;
  const glyphs = F.stringToGlyphs(text);
  let x = 0; const placed = [];
  for (const g of glyphs) { placed.push({ g, x }); x += g.advanceWidth * scale + track * size; }
  const bb = g => g.getPath(0, 0, size).getBoundingBox();
  const inkL = placed[0].x + bb(glyphs[0]).x1;
  const inkR = placed[placed.length - 1].x + bb(glyphs[glyphs.length - 1]).x2;
  return { ink: inkR - inkL, inkL, size,
    path: (originX, baselineY) => placed.map(p => pathData(p.g.getPath(originX - inkL + p.x, baselineY, size))).join('') };
}
const trackFor = (text, cap, targetInk) => {
  let lo = -0.3, hi = 1.2, t = 0;
  for (let i = 0; i < 50; i++) { t = (lo + hi) / 2; (run(text, cap, t).ink < targetInk) ? lo = t : hi = t; }
  return t;
};
const weightStroke = (cap, stem) => Math.max(0, (stem - STEM) * cap);

/* ------------------------------------------------------------- on a arc --- */
// Letters set along a circle. `side` = 'top' (letters upright, above centre)
// or 'bottom' (letters upright when read along the lower arc).
function arcText(text, cap, radius, cx, cy, side, track) {
  const size = cap * UPEM / CAP, scale = size / UPEM;
  const glyphs = F.stringToGlyphs(text);
  const advs = glyphs.map(g => g.advanceWidth * scale + track * size);
  const total = advs.reduce((a, b) => a + b, 0) - track * size;
  const sweep = total / radius;                       // radians the text spans
  let out = '', acc = 0;
  for (let i = 0; i < glyphs.length; i++) {
    const mid = acc + advs[i] / 2 - (track * size) / 2;
    const a = side === 'top'
      ? -Math.PI / 2 - sweep / 2 + mid / radius
      :  Math.PI / 2 + sweep / 2 - mid / radius;
    const deg = a * 180 / Math.PI + (side === 'top' ? 90 : -90);
    const px = cx + Math.cos(a) * radius, py = cy + Math.sin(a) * radius;
    const d = pathData(glyphs[i].getPath(-glyphs[i].advanceWidth * scale / 2, 0, size));
    out += '<g transform="translate(' + px.toFixed(2) + ',' + py.toFixed(2) + ') rotate(' + deg.toFixed(2) + ')"><path d="' + d + '"/></g>';
    acc += advs[i];
  }
  return out;
}

/* --------------------------------------------------------------- pieces --- */
// The portrait inside a ring — the device from the current logo.
function roundel(cx, cy, rx, ry, id, { ring = null, ringW = 0, fill = 'contain' } = {}) {
  const inRx = rx - ringW / 2, inRy = ry - ringW / 2;
  const s = fill === 'cover'
    ? Math.max(inRx * 2 / ART.vb[2], inRy * 2 / ART.vb[3])
    : Math.min(inRx * 2 / ART.vb[2], inRy * 2 / ART.vb[3]);
  return '<clipPath id="' + id + '"><ellipse cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2)
      + '" rx="' + inRx.toFixed(2) + '" ry="' + inRy.toFixed(2) + '"/></clipPath>'
    + '<g clip-path="url(#' + id + ')"><g transform="translate(' + (cx - ART.vb[2] * s / 2).toFixed(2) + ','
      + (cy - ART.vb[3] * s / 2).toFixed(2) + ') scale(' + s.toFixed(5) + ')">' + ART.inner + '</g></g>'
    + (ringW ? '<ellipse cx="' + cx.toFixed(2) + '" cy="' + cy.toFixed(2) + '" rx="' + inRx.toFixed(2)
      + '" ry="' + inRy.toFixed(2) + '" fill="none" stroke="' + (ring || INK) + '" stroke-width="' + ringW.toFixed(2) + '"/>' : '');
}

const svgWrap = (x, y, w, h, body, bg) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ' + w.toFixed(1) + ' ' + h.toFixed(1)
  + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '">'
  + (bg ? '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + bg + '"/>' : '')
  + body + '</svg>';

/* ------------------------------------------------------------- 1 primary -- */
// NALED|ART over STUD|O, matching the current logo's measured proportions.
function primary({ cap = 100, ink = INK, spine = null, id = 'p', oFill = 'contain', flush = false } = {}) {
  const R = { leftBlock: 4.08, rightBlock: 2.49, stud: 3.23, gapL: 0.23, gapR: 0.18,
              ruleW: 0.077, leading: 1.36, ruleTop: 1.03, ruleBot: 0.10, oGap: 0.23,
              oRx: 0.436, oRy: 0.513, oRing: 0.095, stem: 0.077 };
  const naled = run('NALED', cap, trackFor('NALED', cap, R.leftBlock * cap));
  const artw = run('ART', cap, trackFor('ART', cap, R.rightBlock * cap));
  // flush: STUD is tracked to the same width as NALED, so the two lines share
  // both edges. Otherwise it keeps the reference's right-aligned indent.
  const stud = run('STUD', cap, trackFor('STUD', cap, (flush ? R.leftBlock : R.stud) * cap));
  const B1 = cap, B2 = B1 + R.leading * cap;
  const ruleX = (R.gapL + R.leftBlock) * cap;
  const rightX = ruleX + (R.ruleW + R.gapR) * cap;
  // The O must start on the same axis as the A above it. A round letter also
  // needs a small optical overshoot, or it reads as inset next to a flat stem.
  const oOvershoot = 0.014 * cap;
  const oCx = rightX - oOvershoot + R.oRx * cap;
  const oCy = B2 - cap / 2;
  const sw = weightStroke(cap, R.stem);
  // `flush`: track STUD out so both lines share the same left and right edges.
  const studX = flush ? 0 : R.leftBlock * cap - stud.ink;
  const body =
      '<path fill="' + ink + '" stroke="' + ink + '" stroke-width="' + sw.toFixed(2) + '" stroke-linejoin="round" d="'
        + naled.path(0, B1) + artw.path(rightX, B1) + stud.path(studX, B2) + '"/>'
    + '<rect x="' + ruleX.toFixed(2) + '" y="' + (B1 - R.ruleTop * cap).toFixed(2) + '" width="' + (R.ruleW * cap).toFixed(2)
      + '" height="' + ((R.ruleTop + R.leading + R.ruleBot) * cap).toFixed(2) + '" fill="' + (spine || ink) + '"/>'
    + roundel(oCx, oCy, R.oRx * cap, R.oRy * cap, id, { ring: ink, ringW: R.oRing * cap, fill: oFill });
  const W = Math.max(rightX + artw.ink, oCx + R.oRx * cap), pad = cap * 0.34;
  return svgWrap(-pad, B1 - R.ruleTop * cap - pad, W + pad * 2, (R.ruleTop + R.leading + R.ruleBot) * cap + pad * 2, body);
}

/* ---------------------------------------------------------- 2 wordmark ---- */
// The same lockup with a plain ring, no portrait: for stamps and one colour.
function wordmark({ cap = 100, ink = INK } = {}) {
  const s = primary({ cap, ink, id: 'wm' });
  return s.replace(/<clipPath[\s\S]*?<\/g><\/g>/, '');
}

/* ------------------------------------------------------------ 3 badge ----- */
// Circular stamp: portrait in the middle, name arced above, est. below.
function badge({ r = 200, ink = INK, id = 'b', ring = true, top = 'NALEDI ART STUDIO', bottom = 'EST. 2019' } = {}) {
  // Geometry is derived from clearances so nothing can collide:
  //   outer rule -> inner rule -> text band -> portrait
  const R1 = 0.985, w1 = 0.022;        // outer rule: centre radius, stroke
  const R2 = 0.930, w2 = 0.007;        // inner rule
  const roundR = 0.60, roundRing = 0.018;                      // portrait + its ring
  const cap = 0.125;                                           // one size for both lines

  // The portrait sits dead centre, so the band between its ring and the inner
  // rule is the same all the way round. Both lines are centred in that band:
  // equal air above and below each, and the two share one mid-line.
  const bandIn = roundR + roundRing / 2;                       // portrait's outer edge
  const bandOut = R2 - w2 / 2;                                 // inner rule's inner edge
  const mid = (bandIn + bandOut) / 2;
  const baseTop = mid - cap / 2;                               // top caps grow outward
  const baseBot = mid + cap / 2;                               // bottom caps grow inward

  const fit = [
    ['the two rules', (R1 - w1 / 2) - (R2 + w2 / 2)],
    ['top line, outer air', bandOut - (baseTop + cap)],
    ['top line, inner air', baseTop - bandIn],
    ['bottom line, outer air', bandOut - baseBot],
    ['bottom line, inner air', (baseBot - cap) - bandIn],
  ];
  const tight = fit.filter(f => f[1] < 0);
  if (tight.length) console.warn('badge clearance problem: ' + JSON.stringify(tight));

  // where the top text ends, so the dots can sit in the gaps
  const sizeTop = cap * r * UPEM / CAP;
  const advTop = F.stringToGlyphs(top)
    .reduce((a, g) => a + g.advanceWidth * sizeTop / UPEM + 0.12 * sizeTop, 0) - 0.12 * sizeTop;
  const sweepTop = advTop / (baseTop * r);
  const dotA = Math.PI / 2 - (sweepTop / 2 + 0.16);            // just past the last letter
  const dotR = mid * r;                                        // dots ride the same mid-line

  const circle = (rad, stroke) => '<circle cx="0" cy="0" r="' + (rad * r).toFixed(1)
    + '" fill="none" stroke="' + ink + '" stroke-width="' + (stroke * r).toFixed(1) + '"/>';
  const dot = x => '<circle cx="' + x.toFixed(1) + '" cy="' + (-Math.sin(dotA) * dotR).toFixed(1)
    + '" r="' + (r * 0.016).toFixed(1) + '"/>';

  const body =
      (ring ? circle(R1, w1) + circle(R2, w2) : '')
    + roundel(0, 0, roundR * r, roundR * r, id, { ring: ink, ringW: roundRing * r, fill: 'contain' })
    + '<g fill="' + ink + '">' + arcText(top, cap * r, baseTop * r, 0, 0, 'top', 0.12) + '</g>'
    + '<g fill="' + ink + '">' + arcText(bottom, cap * r, baseBot * r, 0, 0, 'bottom', 0.16) + '</g>'
    + '<g fill="' + ink + '">' + dot(Math.cos(dotA) * dotR) + dot(-Math.cos(dotA) * dotR) + '</g>';
  return svgWrap(-r - 6, -r - 6, r * 2 + 12, r * 2 + 12, body);
}

/* ------------------------------------------------------- 4 submark -------- */
function submark({ r = 150, ink = INK, id = 's', gold = false } = {}) {
  const body = roundel(0, 0, r * 0.92, r * 0.92, id, { ring: gold ? GOLD : ink, ringW: r * 0.075, fill: 'contain' });
  return svgWrap(-r, -r, r * 2, r * 2, body);
}

/* ------------------------------------------------------ 5 horizontal ------ */
function horizontal({ cap = 100, ink = INK, id = 'h' } = {}) {
  const rx = cap * 0.95;
  const gap = cap * 0.62;
  const t = trackFor('NALEDI ART STUDIO', cap * 0.78, cap * 9.2);
  const line = run('NALEDI ART STUDIO', cap * 0.78, t);
  const x0 = rx * 2 + gap;
  const sw = weightStroke(cap * 0.78, 0.077);
  const body = roundel(rx, 0, rx, rx, id, { ring: ink, ringW: cap * 0.085, fill: 'contain' })
    + '<path fill="' + ink + '" stroke="' + ink + '" stroke-width="' + sw.toFixed(2)
      + '" stroke-linejoin="round" d="' + line.path(x0, cap * 0.39) + '"/>';
  const pad = cap * 0.3;
  return svgWrap(-pad, -rx - pad, x0 + line.ink + pad * 2, rx * 2 + pad * 2, body);
}

/* ------------------------------------------------------- 6 monogram ------- */
// The rule device on its own: N | A
function monogram({ cap = 200, ink = INK, mark = 'roundel', id = 'mg' } = {}) {
  const n = run('N', cap, 0);
  const gap = cap * 0.23, ruleW = cap * 0.077;
  const ruleX = n.ink + gap;
  const sw = weightStroke(cap, 0.077);
  let right = '', rightW;
  if (mark === 'roundel') {
    const rx = cap * 0.436, ry = cap * 0.513;
    const cx = ruleX + ruleW + gap + rx;
    right = roundel(cx, cap / 2, rx, ry, id, { ring: ink, ringW: cap * 0.095, fill: 'contain' });
    rightW = cx + rx;
  } else {
    const a = run('A', cap, 0), aX = ruleX + ruleW + gap;
    right = '<path fill="' + ink + '" stroke="' + ink + '" stroke-width="' + sw.toFixed(2)
      + '" stroke-linejoin="round" d="' + a.path(aX, cap) + '"/>';
    rightW = aX + a.ink;
  }
  const body = '<path fill="' + ink + '" stroke="' + ink + '" stroke-width="' + sw.toFixed(2)
      + '" stroke-linejoin="round" d="' + n.path(0, cap) + '"/>'
    + '<rect x="' + ruleX.toFixed(2) + '" y="' + (-cap * 0.03).toFixed(2) + '" width="' + ruleW.toFixed(2)
      + '" height="' + (cap * 1.13).toFixed(2) + '" fill="' + ink + '"/>' + right;
  const pad = cap * 0.3;
  return svgWrap(-pad, -cap * 0.16, rightW + pad * 2, cap * 1.42, body);
}

module.exports = { primary, wordmark, badge, submark, horizontal, monogram, run, trackFor, arcText, roundel, INK, GOLD };

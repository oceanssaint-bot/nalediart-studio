// Builds "NALEDI ART STUDIO" lockups under the artwork.
// Type is set from a real font and converted to outlines, so the finished
// files carry no font dependency and nothing reflows on another machine.

const fs = require('fs');
const { pathData } = require('./pathdata');
const ot = require('opentype.js');

const UF = 'C:/Users/IC RUSTENBURG/AppData/Local/Microsoft/Windows/Fonts/';
// The master artwork. Naledi trimmed the shoulders to a clean edge in the
// update of 27 September 2026; every mark is generated from this one file.
const ART = 'D:/Naledi Art Studio/SVG/logo updatedAsset 4.svg';

// readFileSync hands back a pooled Buffer; slice out this file's own bytes
const loadFont = p => { const b = fs.readFileSync(p); return ot.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };

const FONTS = {
  gothamThin:   UF + 'Gotham-Thin.otf',
  gothamXLight: UF + 'Gotham-XLight.otf',
  gothamLight:  UF + 'Gotham-Light.otf',
  gothamBook:   UF + 'Gotham-Book.otf',
  italiana:     UF + 'Italiana-Regular.ttf',
  centuryGothic: 'C:/Windows/Fonts/GOTHIC.TTF',
};
const cache = {};
const font = k => (cache[k] = cache[k] || loadFont(FONTS[k]));

// cap height measured from the real 'H' outline
function capOf(f) { const b = f.charToGlyph('H').getPath(0, 0, f.unitsPerEm).getBoundingBox(); return Math.abs(b.y1); }

/* ---------------------------------------------------------------- type --- */
// Lay out a line glyph by glyph so letterspacing is real tracking, not a hack.
// capH = cap height in output units; track = extra space in em.
function line(fontKey, text, capH, track) {
  const f = font(fontKey), upem = f.unitsPerEm;
  const size = capH * upem / capOf(f);
  const scale = size / upem;
  const glyphs = f.stringToGlyphs(text);
  let x = 0;
  const placed = [];
  for (const g of glyphs) {
    placed.push({ g, x });
    x += g.advanceWidth * scale + track * size;
  }
  const width = x - (glyphs.length ? track * size : 0);
  return {
    width, capH,
    path(offsetX, baselineY) {
      let d = '';
      for (const p of placed) {
        const gp = p.g.getPath(offsetX + p.x, baselineY, size);
        d += pathData(gp);
      }
      return d;
    },
  };
}

/* ------------------------------------------------------------- artwork --- */
function artwork() {
  const raw = fs.readFileSync(ART, 'utf8');
  const vb = raw.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return { vb, inner };
}

/* -------------------------------------------------------------- lockup --- */
// spec: { font, colour, lines: [{ text, cap, track }], gaps: [], pad }
// `cap` and `gaps` are fractions of the artwork's width, so the proportions
// hold at any size — matching how the original was drawn.
function lockup(spec) {
  const A = artwork();
  const AW = A.vb[2], AH = A.vb[3];
  const colour = spec.colour || '#3B342E';
  const pad = (spec.pad ?? 0.06) * AW;

  const lines = spec.lines.map(l => line(spec.font, l.text, l.cap * AW, l.track));
  const widest = Math.max(AW, ...lines.map(l => l.width));
  const W = widest + pad * 2;
  const cx = W / 2;

  let y = pad + AH;
  const parts = [];
  lines.forEach((l, i) => {
    y += (spec.gaps[i] ?? 0.05) * AW + l.capH;
    const sw = (spec.stroke || [])[i] || 0;   // hairline stroke to fine-tune weight
    parts.push('<path fill="' + colour + '"' + (sw ? ' stroke="' + colour + '" stroke-width="' + sw.toFixed(2) + '" stroke-linejoin="round"' : '') + ' d="' + l.path(cx - l.width / 2, y) + '"/>');
  });
  const H = y + pad;

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W.toFixed(1) + ' ' + H.toFixed(1)
    + '" width="' + W.toFixed(0) + '" height="' + H.toFixed(0) + '">'
    + '<g transform="translate(' + ((W - AW) / 2).toFixed(1) + ',' + pad.toFixed(1) + ')">' + A.inner + '</g>'
    + parts.join('') + '</svg>';
}

module.exports = { lockup, line, artwork, font, capOf, FONTS };

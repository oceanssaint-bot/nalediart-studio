// The three application mockups the deck shows: a business card, an email
// signature, and the social set. They are rebuilt here rather than drawn by
// hand so that they carry the current marks, straight out of brand-suite/svg.
//
//   node brand-suite/build/build-apps.js
//
// Run build-suite.js first. The oval badge is used exactly as it stands:
// Naledi asked for the badges to be left alone in the update of
// 27 September 2026, so nothing here regenerates one.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');
const S = require('./suite');

const ROOT = path.join(__dirname, '..', '..');
const SVGDIR = path.join(ROOT, 'brand-suite', 'svg');
const TMP = path.join(__dirname, '.tmp');
fs.mkdirSync(TMP, { recursive: true });

const INK = '#241C2C', SOFT = '#6A5F74', PAPER = '#FBF8F4',
      NIGHT = '#16111D', CREAM = '#F7F1E8', GOLD = '#D29E38', LINE = '#E6DCD2';

/* Embed one of the suite marks, scaled to `w` and placed at (x, y).
   Each mark carries its own <style> of .cls-N rules, a clipPath and a
   gradient, all under the same names. Dropped into one document as they
   stand, the second mark's stylesheet repaints the first, which is how the
   avatar came out as a gold scramble. Every identifier is namespaced per
   placement instead. */
const markCache = {};
let seq = 0;
function mark(name) {
  if (!markCache[name]) {
    const raw = fs.readFileSync(path.join(SVGDIR, name + '.svg'), 'utf8');
    const vb = raw.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    markCache[name] = { vb, inner };
  }
  return markCache[name];
}
function namespaced(inner, p) {
  return inner
    .replace(/cls-(\d+)/g, p + 'cls-$1')          // both ".cls-1 {" and class="cls-1"
    .replace(/id="([^"]+)"/g, 'id="' + p + '$1"')
    .replace(/url\(#([^)]+)\)/g, 'url(#' + p + '$1)')
    .replace(/(xlink:)?href="#([^"]+)"/g, '$1href="#' + p + '$2"');
}
function place(name, x, y, w) {
  const m = mark(name), k = w / m.vb[2];
  const p = 'n' + (++seq) + '_';
  return '<g transform="translate(' + x + ',' + y + ') scale(' + k.toFixed(6) + ') translate(' +
    (-m.vb[0]) + ',' + (-m.vb[1]) + ')">' + namespaced(m.inner, p) + '</g>';
}
const markH = (name, w) => w * mark(name).vb[3] / mark(name).vb[2];

/* Text, outlined, so the PNG needs no font installed. */
function text(str, cap, x, baseline, fill, track) {
  const r = S.run(str, cap, track === undefined ? 0.02 : track);
  return { svg: '<path fill="' + fill + '" d="' + r.path(x, baseline) + '"/>', w: r.ink };
}

function render(name, w, h, body, scale) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h +
              '" width="' + w + '" height="' + h + '">' + body + '</svg>';
  const out = path.join(TMP, name + '.png');
  fs.writeFileSync(out, new Resvg(svg, { fitTo: { mode: 'width', value: w * (scale || 1) },
                                         font: { loadSystemFonts: false } }).render().asPng());
  return out;
}

/* ------------------------------------------------------------ the card --- */
// 85 x 55 mm at the deck's 1600 px width: two faces, side by side.
function card() {
  const W = 1600, H = 501, FACE = 770, GAP = 60, R = 16;
  const rx = W - FACE;                                  // left edge of the right face
  const logoW = 400;
  const badgeW = 118;
  let b = '';
  b += '<rect width="' + W + '" height="' + H + '" fill="#FFFFFF"/>';

  // dark face, the reversed mark centred
  b += '<rect x="0" y="0" width="' + FACE + '" height="' + H + '" rx="' + R + '" fill="' + NIGHT + '"/>';
  b += place('01-primary-reversed', (FACE - logoW) / 2, (H - markH('01-primary-reversed', logoW)) / 2, logoW);

  // light face, details and the oval badge
  b += '<rect x="' + rx + '" y="0" width="' + FACE + '" height="' + H + '" rx="' + R + '" fill="' + PAPER +
       '" stroke="' + LINE + '"/>';
  b += place('03-badge-oval', rx + FACE - 54 - badgeW, 54, badgeW);
  const tx = rx + 62;
  b += text('NALEDI ZONDI', 30, tx, 268, INK, 0.055).svg;
  b += text('Visual artist and creative director', 17, tx, 312, SOFT, 0.01).svg;
  b += text('065 838 1532', 18, tx, 382, INK, 0.01).svg;
  b += text('naledi@nalediart.com', 18, tx, 418, INK, 0.01).svg;
  b += text('39 Station Drive, Greyville, Durban', 17, tx, 454, SOFT, 0.01).svg;
  return render('app-card', W, H, b);
}

/* ------------------------------------------------------- the signature --- */
function signature() {
  const W = 1300, H = 378;
  const lockW = 520;
  let b = '<rect width="' + W + '" height="' + H + '" fill="' + PAPER + '"/>';
  b += place('05-horizontal', 44, 46, lockW);
  b += '<rect x="48" y="186" width="524" height="1" fill="' + LINE + '"/>';
  b += text('NALEDI ZONDI', 26, 48, 246, INK, 0.075).svg;
  b += text('Visual artist and creative director', 18, 48, 292, SOFT, 0.01).svg;
  const phone = text('065 838 1532', 18, 48, 338, INK, 0.01);
  b += phone.svg;
  b += text('naledi@nalediart.com', 18, 48 + phone.w + 34, 338, INK, 0.01).svg;
  return render('app-signature', W, H, b);
}

/* ---------------------------------------------------------- the social --- */
function social() {
  const W = 1400, H = 662, D = 662;
  const subW = 490;
  let b = '<rect width="' + W + '" height="' + H + '" fill="#FFFFFF"/>';
  // the avatar: submark on a Sunflower ground
  b += '<circle cx="' + (D / 2) + '" cy="' + (D / 2) + '" r="' + (D / 2) + '" fill="' + GOLD + '"/>';
  b += place('04-submark', (D - subW) / 2, (D - subW) / 2, subW);
  // the sticker: the oval badge on cream
  const sx = 735, sw = W - sx, badgeW = 470;
  b += '<rect x="' + sx + '" y="0" width="' + sw + '" height="' + H + '" rx="40" fill="' + CREAM + '"/>';
  b += place('03-badge-oval', sx + (sw - badgeW) / 2, (H - markH('03-badge-oval', badgeW)) / 2, badgeW);
  return render('app-social', W, H, b);
}

/* ------------------------------------------------------------- write it --- */
// libwebp ignores -quality; ffmpeg passes -q:v through.
function webp(src, out, q) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-q:v', String(q || 88), out]);
  return out;
}

const R = path.join(ROOT, 'site', 'review', 'img');
const P = path.join(ROOT, 'presentation', 'img');
const built = [['app-card', card()], ['app-signature', signature()], ['app-social', social()]];
for (const [name, png] of built) {
  webp(png, path.join(R, name + '.webp'));
  fs.copyFileSync(png, path.join(P, name + '.png'));          // the deck's own source copy
  const d = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path.join(R, name + '.webp')]).toString().trim();
  console.log('  ' + name.padEnd(16) + d.padEnd(12) +
    (fs.statSync(path.join(R, name + '.webp')).size / 1024).toFixed(0).padStart(5) + ' KB');
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log(built.length + ' application mockups rebuilt on the current marks');

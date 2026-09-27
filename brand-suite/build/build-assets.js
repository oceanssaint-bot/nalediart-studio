// Renders the marks the website and the deck actually load, straight from
// the suite SVGs, so a change to the master artwork reaches every surface.
//
//   node brand-suite/build/build-assets.js
//
// Run build-suite.js first: this reads brand-suite/svg.
//
// The badges are deliberately absent. Naledi asked for them to be left
// alone in the update of 27 September 2026, so site/assets/badge.png and
// site/review/img/badge.webp keep the artwork they were built from.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.join(__dirname, '..', '..');
const SVG = path.join(ROOT, 'brand-suite', 'svg');
const TMP = path.join(__dirname, '.tmp');
fs.mkdirSync(TMP, { recursive: true });

function png(svgName, width, out, background) {
  const svg = fs.readFileSync(path.join(SVG, svgName + '.svg'), 'utf8');
  const opts = { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: false } };
  if (background) opts.background = background;
  fs.writeFileSync(out, new Resvg(svg, opts).render().asPng());
  return out;
}

// libwebp ignores -quality; the flag ffmpeg passes through is -q:v.
function webp(src, out, q) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', src,
                          '-q:v', String(q || 88), out]);
  return out;
}

const done = [];
function note(f) {
  const d = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f]).toString().trim();
  done.push([path.relative(ROOT, f).replace(/\\/g, '/'), d, (fs.statSync(f).size / 1024).toFixed(0) + ' KB']);
}

/* ---- what the website loads ------------------------------------------- */
const A = path.join(ROOT, 'site', 'assets');
note(png('01-primary', 1200, path.join(A, 'logo.png')));
note(png('01-primary-reversed', 1600, path.join(A, 'logo-reversed.png')));
note(png('04-submark', 180, path.join(A, 'icon.png')));
note(png('04-submark', 512, path.join(A, 'portrait.png')));

/* ---- the master artwork on its own ------------------------------------ */
// Straight from the client's file, at the width the old export used.
const art = fs.readFileSync(path.join(ROOT, 'SVG', 'logo updatedAsset 4.svg'), 'utf8');
fs.writeFileSync(path.join(A, 'artwork.png'),
  new Resvg(art, { fitTo: { mode: 'width', value: 1264 } }).render().asPng());
note(path.join(A, 'artwork.png'));

/* ---- what the deck loads ---------------------------------------------- */
const R = path.join(ROOT, 'site', 'review', 'img');
const marks = [
  ['01-primary',          1200, 'primary'],
  ['01-primary-reversed', 1600, 'primary-reversed'],
  ['02-classic',          1200, 'classic'],
  ['04-submark',           512, 'submark'],
  ['05-horizontal',       1200, 'horizontal']
];
for (const [svgName, w, out] of marks) {
  const tmp = png(svgName, w, path.join(TMP, out + '.png'));
  note(webp(tmp, path.join(R, out + '.webp')));
}

// The finished master artwork, as the digitise and master slides show it.
const afterTmp = path.join(TMP, 'after-art.png');
fs.writeFileSync(afterTmp, new Resvg(art, { fitTo: { mode: 'width', value: 900 },
                                            background: '#FFFFFF' }).render().asPng());
note(webp(afterTmp, path.join(R, 'after-art.webp')));

// The contact sheet.
const sheet = path.join(ROOT, 'brand-suite', 'suite-overview.png');
note(webp(sheet, path.join(R, 'suite.webp'), 82));

fs.rmSync(TMP, { recursive: true, force: true });
console.log('rendered ' + done.length + ' files from the master artwork');
for (const [f, d, s] of done) console.log('  ' + f.padEnd(40) + d.padEnd(12) + s.padStart(9));

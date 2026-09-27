// Writes the brand suite to D:\Naledi Art Studio\brand-suite\
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');
const S = require('./suite');
const L = require('./lockup');

const OUT = 'D:/Naledi Art Studio/brand-suite';
for (const d of ['svg', 'png']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const INK = S.INK, GOLD = S.GOLD, CREAM = '#F7F1E8';
const files = [];
function write(name, svg, widths = [1600]) {
  fs.writeFileSync(path.join(OUT, 'svg', name + '.svg'), svg);
  files.push(['svg/' + name + '.svg', svg.length]);
  for (const w of widths) {
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: false } }).render().asPng();
    fs.writeFileSync(path.join(OUT, 'png', name + (widths.length > 1 ? '-' + w : '') + '.png'), png);
    files.push(['png/' + name + (widths.length > 1 ? '-' + w : '') + '.png', png.length]);
  }
}

/* ---- 1. primary: the current logo's device, rebuilt -------------------- */
write('01-primary', S.primary({ cap: 120, id: 'p1' }), [2400, 1200, 600]);
write('01-primary-reversed', S.primary({ cap: 120, ink: CREAM, id: 'p2' }));
write('01-primary-gold-rule', S.primary({ cap: 120, spine: GOLD, id: 'p3' }));
write('01-primary-flush', S.primary({ cap: 120, id: 'p4', flush: true }), [2400, 1200]);

/* ---- 2. classic: the painted original's layout ------------------------- */
const AW = L.artwork().vb[2];
function classic(stem) {
  const FONT = 'gothamThin', f = L.font(FONT);
  const natural = (b => (b.x2 - b.x1) / L.capOf(f))(f.charToGlyph('I').getPath(0, 0, f.unitsPerEm).getBoundingBox());
  const cap1 = (1.4562 * AW) / (L.line(FONT, 'NALEDI ART', 100, 0).width / 100);
  const capE = cap1 * (0.053 / 0.2016);
  let lo = -0.2, hi = 1.5, tE = 0;
  for (let i = 0; i < 44; i++) { tE = (lo + hi) / 2; (L.line(FONT, 'EST. 2019', capE, tE).width < 0.320 * AW * (cap1 / (0.2016 * AW))) ? lo = tE : hi = tE; }
  return L.lockup({ font: FONT, colour: '#3B342E', gaps: [0.063, 0.029],
    stroke: [Math.max(0, (stem - natural) * cap1), Math.max(0, (stem - natural) * capE)],
    lines: [{ text: 'NALEDI ART', cap: cap1 / AW, track: 0 }, { text: 'EST. 2019', cap: capE / AW, track: tE }] });
}
write('02-classic', classic(0.065), [2400, 1200]);
write('02-classic-heavier', classic(0.077));

/* ---- 3-6. the rest of the suite ---------------------------------------- */
// The badges are held back. Naledi asked for them to be left alone in the
// artwork update of 27 September 2026, and the artwork sits differently
// inside a roundel, so rebuilding them would change marks she did not ask
// to change. Run with BADGES=1 to bring them onto the current artwork.
if (process.env.BADGES) {
  write('03-badge', S.badge({ r: 260, id: 'b1' }), [2000, 800]);
  write('03-badge-durban', S.badge({ r: 260, id: 'b3', bottom: 'DURBAN · EST. 2019' }), [2000, 800]);
  write('03-badge-gold', S.badge({ r: 260, ink: GOLD, id: 'b2' }));
} else {
  console.log('badges held back (set BADGES=1 to rebuild them)');
}
write('04-submark', S.submark({ r: 200, id: 's1' }), [1200, 512, 180]);
write('04-submark-gold-ring', S.submark({ r: 200, id: 's2', gold: true }));
write('05-horizontal', S.horizontal({ cap: 120, id: 'h1' }), [2400, 1200]);
write('06-monogram', S.monogram({ cap: 220, id: 'm1' }), [1200]);
write('06-monogram-letters', S.monogram({ cap: 220, mark: 'letters' }));
write('07-wordmark-only', S.wordmark({ cap: 120 }), [2000]);

/* ---- contact sheet ------------------------------------------------------ */
const sheetItems = ['01-primary', '01-primary-flush', '03-badge', '05-horizontal', '04-submark', '06-monogram', '07-wordmark-only', '02-classic'];
const panes = sheetItems.map((n, i) => {
  const svg = fs.readFileSync(path.join(OUT, 'svg', n + '.svg'), 'utf8');
  const f = path.join(OUT, '_s' + i + '.png');
  fs.writeFileSync(f, new Resvg(svg, { fitTo: { mode: 'width', value: 460 }, background: '#FFFFFF', font: { loadSystemFonts: false } }).render().asPng());
  return f;
});
// lay the panes out in rows of four, padding the last row so the widths match
const PER_ROW = 4, PANE_W = 480, PANE_H = 520;
const rows = [];
for (let i = 0; i < panes.length; i += PER_ROW) rows.push(panes.slice(i, i + PER_ROW).map((_, j) => i + j));
const filter = panes.map((_, i) => '[' + i + ']pad=' + PANE_W + ':' + PANE_H + ':10:10:white[p' + i + ']').join(';')
  + ';' + rows.map((row, r) => row.map(i => '[p' + i + ']').join('') + 'hstack=' + row.length
      + (row.length < PER_ROW ? ',pad=' + PANE_W * PER_ROW + ':' + PANE_H + ':0:0:white' : '') + '[r' + r + ']').join(';')
  + ';' + rows.map((_, r) => '[r' + r + ']').join('') + 'vstack=' + rows.length;
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...panes.flatMap(f => ['-i', f]),
  '-filter_complex', filter, '-frames:v', '1', path.join(OUT, 'suite-overview.png')]);
panes.forEach(f => fs.unlinkSync(f));

console.log('wrote ' + files.length + ' files to ' + OUT);
for (const [f, b] of files) console.log('  ' + f.padEnd(42) + (b / 1024).toFixed(0).padStart(6) + ' KB');

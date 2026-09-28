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

/* ---- 2. classic: the painted original's layout -------------------------
   Set in Jost, like every other mark. It was the last thing still set in
   Gotham, and Gotham's CFF outlines do not survive this pipeline: the D
   came out with no left stem and the R with an open bowl.

   Both numbers come off the painting rather than one being derived from
   the other: the cap height is 0.2016 of the artwork's width and the line
   measures 1.4562 of it, so the type is tracked out to land on that width
   exactly, the same way the primary is built. */
const A = L.artwork();
const AW = A.vb[2], AH = A.vb[3];
const M = { cap: 0.2016, line: 1.4562, capEst: 0.053, lineEst: 0.320,
            pad: 0.06, gap1: 0.063, gap2: 0.029 };

function classic(weight) {
  const f = S.face('D:/Naledi Art Studio/fonts/Jost-' + weight + '.ttf');
  const cap1 = M.cap * AW, capE = M.capEst * AW;
  const l1 = f.run('NALEDI ART', cap1, f.trackFor('NALEDI ART', cap1, M.line * AW));
  const l2 = f.run('EST. 2019', capE, f.trackFor('EST. 2019', capE, M.lineEst * AW));

  const pad = M.pad * AW;
  const W = Math.max(AW, l1.ink, l2.ink) + pad * 2, cx = W / 2;
  const y1 = pad + AH + M.gap1 * AW + cap1;
  const y2 = y1 + M.gap2 * AW + capE;
  const H = y2 + pad;
  const ink = '#3B342E';

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W.toFixed(1) + ' ' + H.toFixed(1) +
    '" width="' + W.toFixed(0) + '" height="' + H.toFixed(0) + '">' +
    '<g transform="translate(' + ((W - AW) / 2).toFixed(1) + ',' + pad.toFixed(1) + ')">' + A.inner + '</g>' +
    '<path fill="' + ink + '" d="' + l1.path(cx - l1.ink / 2, y1) + '"/>' +
    '<path fill="' + ink + '" d="' + l2.path(cx - l2.ink / 2, y2) + '"/>' +
    '</svg>';
}
write('02-classic', classic('Light'), [2400, 1200]);
write('02-classic-heavier', classic('Regular'));

// Say what was actually built, so the guidelines can quote it.
for (const w of ['Light', 'Regular']) {
  const f = S.face('D:/Naledi Art Studio/fonts/Jost-' + w + '.ttf');
  console.log('  classic in Jost ' + w.padEnd(8) + ' stem ' + (f.STEM * 100).toFixed(1) + '% of cap');
}

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

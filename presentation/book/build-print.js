// Assembles the book's pages into one printable HTML, then Chrome turns it
// into a PDF.
//
//   node presentation/book/build-print.js
//
// The pages in pages/ are the source of truth: some were edited by hand in
// the guidelines editor, so the generator writes to draft/ instead and this
// never regenerates them. Three of them came back from the editor without
// the 1920 x 1080 on the section, because the editor supplies the canvas
// itself, so the print stylesheet supplies it here.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const PAGES = path.join(__dirname, 'pages');
const ORDER = require('./order.json').order;

// Uploaded asset id -> the local file holding the same image.
const BLOB = {
  ee336129a9c9eec36abaa7f417ae3929: 'site/review/img/primary.webp',
  '6b44af12b5b7c3b7d79c4f8238abbbb7': 'site/review/img/primary-reversed.webp',
  '7d1263bab9a104423a3d19d1ce6bfa74': 'site/review/img/classic.webp',
  f03b818e9b363be156be1497d10a9b98: 'site/review/img/badge.webp',
  '1b6f585ecc4ee4399a7f44e025a11687': 'site/review/img/submark.webp',
  fed5003427c7561d5f4a03d90a945715: 'site/review/img/horizontal.webp',
  '99a3601039d547562ee70e9f2df86283': 'site/review/img/suite.webp',
  ce349655d569ea83f1dcbeac2bfec629: 'site/review/img/after-art.webp',
  '95283f7f3d04040e155366c29e24a294': 'site/review/img/original-file.webp',
  f46877b8759737de1758702735908acd: 'site/review/img/before-art.webp',
  c40c7b965c08f98630aab4b0db5f97cf: 'site/review/img/zoom-before.webp',
  '159d5a7d93511d1d6c30ddc73ae45e39': 'site/review/img/zoom-after.webp',
  e0cef59fb588eafffba386bc6623fa30: 'site/review/img/app-card.webp',
  '1cb0a7181b24eb6d29db41d31d8fc7f7': 'site/review/img/app-signature.webp',
  '0cb6da2cbb2e9ddd75d8d9f79d1d70b5': 'site/review/img/app-social.webp',
  f8cb4947feb6a8f9ee24749ec0961d8d: 'site/assets/img/arch-desk-1100.webp',
  '5b77b2a4e73de515461bd48e11193cb6': 'site/assets/img/arch-proposal-1100.webp',
  c3abcca7802d5a7d2e9eb12be619b201: 'site/assets/img/art-eternal-valentine-1100.webp',
  dae4b738c925b67801440e066c28f887: 'site/assets/img/art-print-2-1100.webp',
  f660dbb386448c355f5c519b714f3024: 'site/assets/img/art-valentine-sheet-1100.webp',
  b0c3638284c04de3e4d1049b173a0260: 'site/assets/img/couple-1100.webp',
  ea30492147fb7c3679c62e95b3231342: 'site/assets/img/naledi-1100.webp',
  '6fc1507d2925b19bbc0b33bbe0c97952': 'site/assets/img/pampas-1100.webp',
  c92a18983802854eeca80b17c6342ef7: 'site/assets/img/red-velvet-1100.webp',
  '3233813d5d9259e1011cf8f435caf7ab': 'site/assets/img/set-arch-1100.webp',
  f00fa3e01771ba4ce02c1fe1daa432b4: 'site/assets/img/set-arch-wide-1100.webp',
  f3a014cfb96f82d4d1359a0b5f02a819: 'site/assets/img/studio-space-1100.webp',
  '16831c3e58755eb338d8af53db8f2960': 'site/assets/img/venue-class-1100.webp',
  '9f816083f33d16f403c9ffa6bdd277bf': 'site/assets/img/venue-event-1100.webp',
  '8fa2acf108cf2e27e3eda1b1413f3856': 'site/assets/img/yellow-gown-1100.webp'
};

// A PDF has to carry its pictures, not point at them, so every image is
// inlined. The file opens anywhere, with nothing to lose.
const DATA = {};
function dataUri(rel) {
  if (!DATA[rel]) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) throw new Error('missing image: ' + rel);
    const ext = path.extname(abs).slice(1).toLowerCase();
    const type = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
    DATA[rel] = 'data:' + type + ';base64,' + fs.readFileSync(abs).toString('base64');
  }
  return DATA[rel];
}

const FONTCSS = (function () {
  // The faces travel inside the document. Chrome printed the first PDF
  // before the webfonts arrived, so only Newsreader italic made it in and
  // every line of Jost fell back. Nothing here touches the network.
  const list = require('./fonts/index.json');
  const face = list.map(function (f) {
    const b64 = fs.readFileSync(path.join(__dirname, 'fonts', f.file)).toString('base64');
    return '@font-face{font-family:"' + f.fam + '";font-style:' + f.sty +
      ';font-weight:' + f.wt + ';font-display:block;' +
      'src:url(data:font/woff2;base64,' + b64 + ') format("woff2");}';
  }).join('');
  return '<style>' + face + '</style>';
})();

let unresolved = [];
const body = ORDER.map(function (id) {
  let s = fs.readFileSync(path.join(PAGES, id + '.html'), 'utf8')
    .replace(/<aside>[\s\S]*?<\/aside>/g, '')
    .replace(/\/_blob\/([0-9a-f]{32})/g, function (m, h) {
      if (!BLOB[h]) { unresolved.push(id + ' -> ' + h); return m; }
      return dataUri(BLOB[h]);
    });
  return s.trim();
}).join('\n');

if (unresolved.length) {
  console.error('Unmapped images:\n  ' + unresolved.join('\n  '));
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Naledi Art Studio, Brand Guidelines</title>
${FONTCSS}
<style>
  @page { size: 1920px 1080px; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #FBF8F4; }
  /* Three pages came back from the editor without the canvas on the section,
     because the editor draws it. Every page gets it here, and a page break
     after it, so one section is one leaf. */
  body > section {
    position: relative !important;
    width: 1920px !important;
    height: 1080px !important;
    overflow: hidden !important;
    break-after: page;
    page-break-after: always;
  }
  body > section:last-of-type { break-after: auto; page-break-after: auto; }
  img { display: block; }
  /* Chrome drops backgrounds in print unless it is told not to. A brand book
     with no colour on its colour pages would be worse than useless. */
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
${body}
</body>
</html>
`;

const out = path.join(__dirname, 'print.html');
fs.writeFileSync(out, html);
console.log('print.html: ' + ORDER.length + ' pages, ' +
  (Buffer.byteLength(html) / 1048576).toFixed(1) + ' MB with the images inlined');

/* ---------------------------------------------------------------- pdf --- */
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
].filter(fs.existsSync)[0];

if (!CHROME) { console.error('No Chrome or Edge found to print with.'); process.exit(1); }

const pdf = path.join(ROOT, 'brand-suite', 'Naledi Art Studio, Brand Guidelines.pdf');
fs.mkdirSync(path.dirname(pdf), { recursive: true });
try { fs.unlinkSync(pdf); } catch (e) {}

execFileSync(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=20000',      // let the webfonts and images settle
  '--no-pdf-header-footer',
  '--print-to-pdf=' + pdf,
  'file:///' + out.replace(/\\/g, '/')
], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 180000 });

if (!fs.existsSync(pdf)) { console.error('Chrome produced no file.'); process.exit(1); }

// Count the pages in the PDF itself rather than trusting the input.
const buf = fs.readFileSync(pdf);
const counts = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log('PDF: ' + path.relative(ROOT, pdf).replace(/\\/g, '/'));
console.log('     ' + (buf.length / 1048576).toFixed(1) + ' MB, ' + counts + ' pages' +
  (counts === ORDER.length ? '' : '  <-- expected ' + ORDER.length));

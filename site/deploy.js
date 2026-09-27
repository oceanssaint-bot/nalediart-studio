// Build the standalone page and stage everything GitHub Pages serves.
//   node site/deploy.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');

require('./build.js');                       // writes site/index.html

function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

require('./review/build.js');                // writes site/review/index.html

copy(path.join(__dirname, 'index.html'), path.join(docs, 'index.html'));
copy(path.join(__dirname, 'studio.html'), path.join(docs, 'studio.html'));
copy(path.join(__dirname, 'review', 'index.html'), path.join(docs, 'review', 'index.html'));
for (const f of fs.readdirSync(path.join(__dirname, 'review', 'img')))
  copy(path.join(__dirname, 'review', 'img', f), path.join(docs, 'review', 'img', f));
for (const f of ['logo.png', 'logo-reversed.png', 'badge.png', 'icon.png'])
  copy(path.join(__dirname, 'assets', f), path.join(docs, 'assets', f));
for (const f of fs.readdirSync(path.join(__dirname, 'assets', 'img')))
  copy(path.join(__dirname, 'assets', 'img', f), path.join(docs, 'assets', 'img', f));
fs.writeFileSync(path.join(docs, '.nojekyll'), '');

// Every asset the pages reference must exist in docs/.
let missing = 0;
for (const page of ['index.html', 'studio.html', 'review/index.html']) {
  const dir = path.dirname(path.join(docs, page));
  const html = fs.readFileSync(path.join(docs, page), 'utf8');
  for (const m of new Set(html.match(/(\.\.\/)?(assets|img)\/[A-Za-z0-9/._-]+\.(webp|png)/g) || []))
    if (!fs.existsSync(path.resolve(dir, m))) { console.error('MISSING ' + m + ' (referenced by ' + page + ')'); missing++; }
}
console.log(missing ? missing + ' missing asset(s)' : 'docs/ staged — every referenced asset present');
process.exit(missing ? 1 : 0);

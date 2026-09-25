// The artifact runtime wraps app.html in its own document skeleton.
// A standalone/deployable copy needs that wrapper written out.
const fs = require('fs');
const path = require('path');
const body = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');

const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Naledi Art Studio, Durban — custom art, photography studio hire, venue hire and set design. Check availability and book online.">
<meta property="og:title" content="Naledi Art Studio — Durban">
<meta property="og:description" content="Custom art, studio hire, venue hire and set design in Greyville, Durban. Book a slot online.">
<link rel="icon" href="assets/portrait.png">
<style>
  :root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
  body { margin: 0; }
  img { max-width: 100%; }
  [hidden] { display: none !important; }
</style>
${body}
</body>
</html>
`;
// app.html opens with <title>/<style> (head material) then markup, so the
// head/body boundary goes just before the first element that must render.
const out = doc.replace('<header class="bar">', '</head>\n<body>\n<header class="bar">');
fs.writeFileSync(path.join(__dirname, 'index.html'), out);
console.log('site/index.html built — ' + (out.length / 1024).toFixed(0) + ' KB');

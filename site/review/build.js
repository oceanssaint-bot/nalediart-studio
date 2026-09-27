// Builds site/review/index.html — one page where Naledi can see the brand
// presentation and the live website side by side.
//
//   node site/review/build.js
//
// The slides come from the deck's own files. Two things are changed on the
// way in: the /_blob/<id> image references become local webp files, and the
// <aside> speaker notes are stripped. Those notes are written to the
// presenter about the client; they must never reach her.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SLIDES = path.join(ROOT, 'presentation', 'deck', 'project', 'slides');
const ORDER = ['cover', 'origin', 'problem', 'digitise', 'repaint', 'master',
  'palette', 'type', 'primary', 'classic', 'suite', 'marks',
  'clearspace', 'backgrounds', 'misuse', 'files'];

// Uploaded asset id -> the local file that holds the same image.
const BLOB = {
  '91d399f4d6eb418c4ed62ba001a67c02': 'original-file',
  '6b37cbdcae5a83bc320018ac42f553f4': 'before-art',
  '099b605a377a3ad4ec40412be23cd50c': 'after-art',
  '97422d52f47895216b12005addbe2928': 'zoom-before',
  'c9621c0865e6912d1534fe59c7de1897': 'zoom-after',
  'd0823a37229e643a71dfdf3a22c21188': 'primary',
  '4dc4e6982a7c2d473e943baae78ae661': 'primary-reversed',
  '82e169832e46dbcd227f7a8843f02daa': 'classic',
  '44cc9ecd78ac27521790b7c989f34696': 'badge',
  'a875fb4432376b592ecdf257ccf9f8bf': 'submark',
  'ffc2229fe7975113f45bb9f040b414ac': 'horizontal',
  '0041332d7c18ede504980b26f4172056': 'suite',
};

let unresolved = [];
const slides = ORDER.map(function (id) {
  let s = fs.readFileSync(path.join(SLIDES, id + '.html'), 'utf8').trim();
  s = s.replace(/<aside>[\s\S]*?<\/aside>/g, '');            // presenter notes
  s = s.replace(/\/_blob\/([0-9a-f]{32})/g, function (m, hash) {
    if (!BLOB[hash]) { unresolved.push(id + ' -> ' + hash); return m; }
    return 'img/' + BLOB[hash] + '.webp';
  });
  // Every slide but the first loads its images only when reached.
  if (id !== ORDER[0]) s = s.replace(/<img /g, '<img loading="lazy" ');
  return { id: id, html: s };
});

if (unresolved.length) {
  console.error('Unmapped image references:\n  ' + unresolved.join('\n  '));
  process.exit(1);
}
const leftoverNotes = slides.filter(s => /<aside/.test(s.html));
if (leftoverNotes.length) {
  console.error('Speaker notes survived in: ' + leftoverNotes.map(s => s.id).join(', '));
  process.exit(1);
}

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Naledi Art Studio — brand &amp; website</title>
<link rel="icon" href="../assets/icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Newsreader:ital,wght@0,300;0,400;1,300&display=swap">
<style>
  :root {
    color-scheme: light;
    --paper:#FBF8F4; --surface:#FFFFFF; --ink:#241C2C; --soft:#6A5F74;
    --faint:#9A8FA3; --line:#E6DCD2; --gold:#A87614; --dark:#16111D;
  }
  * { box-sizing:border-box; }
  [hidden] { display:none !important; }
  html, body { margin:0; }
  body { background:var(--paper); color:var(--ink);
         font:400 16px/1.5 Jost,'Century Gothic',system-ui,sans-serif; }
  img { max-width:100%; display:block; }

  header { border-bottom:1px solid var(--line); background:var(--surface);
           position:sticky; top:env(safe-area-inset-top,0px); z-index:20; }
  .bar { display:flex; align-items:center; gap:14px; flex-wrap:wrap;
         padding:12px 18px; max-width:1500px; margin-inline:auto; }
  .bar img { height:26px; width:auto; }
  .bar .who { font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); }
  .tabs { display:flex; gap:6px; margin-left:auto; }
  .tab { font:inherit; font-size:14px; min-height:42px; padding:9px 18px; border-radius:999px;
         border:1px solid var(--line); background:transparent; color:var(--soft); cursor:pointer; }
  .tab[aria-selected="true"] { background:var(--ink); color:var(--paper); border-color:var(--ink); }
  .out { font:inherit; font-size:13px; color:var(--faint); text-decoration:none;
         padding:9px 14px; border-radius:999px; border:1px solid var(--line); min-height:42px;
         display:inline-flex; align-items:center; }

  main { max-width:1500px; margin-inline:auto; padding:18px; }
  @media (max-width:640px) { main { padding:10px; } }

  /* ---- presentation ---- */
  .deck { position:relative; width:100%; aspect-ratio:16/9; overflow:hidden;
          border-radius:14px; border:1px solid var(--line); background:var(--dark); }
  .stage { position:absolute; top:0; left:0; width:1920px; height:1080px; transform-origin:top left; }
  .slide { position:absolute; top:0; left:0; width:1920px; height:1080px; display:none; }
  .slide.on { display:block; }
  .slide > section { position:relative; width:1920px; height:1080px; overflow:hidden; }
  .deck:fullscreen { aspect-ratio:auto; width:100vw; height:100vh; border:0; border-radius:0; }
  .deck-nav { display:flex; align-items:center; gap:14px; margin-top:14px; flex-wrap:wrap; }
  .nb { font:inherit; font-size:15px; min-height:44px; min-width:44px; padding:10px 18px;
        border-radius:999px; border:1px solid var(--line); background:var(--surface);
        color:var(--ink); cursor:pointer; }
  .nb[disabled] { opacity:.35; cursor:not-allowed; }
  .count { font-size:14px; color:var(--faint); font-variant-numeric:tabular-nums; }
  .dots { display:flex; gap:5px; flex-wrap:wrap; margin-left:auto; }
  .dot { width:9px; height:9px; border-radius:50%; border:0; padding:0; cursor:pointer;
         background:var(--line); }
  .dot[aria-current="true"] { background:var(--gold); }
  @media (max-width:640px) { .dots { display:none; } }

  /* ---- website ---- */
  .site-wrap { display:flex; flex-direction:column; gap:12px; align-items:center; }
  .frame { width:100%; border:1px solid var(--line); border-radius:14px; overflow:hidden;
           background:var(--surface); }
  .frame.phone { width:390px; max-width:100%; border-radius:26px; }
  .frame iframe { display:block; width:100%; height:78vh; min-height:520px; border:0; }
  .frame.phone iframe { height:74vh; }
  .sizes { display:flex; gap:8px; }
  .hint { font-size:13px; color:var(--faint); text-align:center; }
</style>
</head>
<body>

<header>
  <div class="bar">
    <img src="../assets/logo.png" alt="Naledi Art Studio">
    <span class="who">Brand &amp; website</span>
    <div class="tabs" role="tablist">
      <button class="tab" id="t-deck" role="tab" aria-selected="true" aria-controls="p-deck">Presentation</button>
      <button class="tab" id="t-site" role="tab" aria-selected="false" aria-controls="p-site">The website</button>
    </div>
    <a class="out" href="../index.html" target="_blank" rel="noopener">Open site ↗</a>
  </div>
</header>

<main>
  <section id="p-deck" role="tabpanel" aria-labelledby="t-deck">
    <div class="deck" id="deck">
      <div class="stage" id="stage">
${slides.map(function (s, i) {
  return '        <div class="slide' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">\n' +
         s.html.split('\n').map(l => '          ' + l).join('\n') + '\n        </div>';
}).join('\n')}
      </div>
    </div>
    <div class="deck-nav">
      <button class="nb" id="prev" aria-label="Previous slide">‹</button>
      <button class="nb" id="next" aria-label="Next slide">›</button>
      <span class="count"><span id="cur">1</span> / ${slides.length}</span>
      <button class="nb" id="fs">Fullscreen</button>
      <div class="dots" id="dots"></div>
    </div>
    <p class="hint" style="text-align:left;margin-top:10px">Arrow keys, or swipe. On a phone the slides are small — turn it sideways, go fullscreen, or pinch to zoom.</p>
  </section>

  <section id="p-site" role="tabpanel" aria-labelledby="t-site" hidden>
    <div class="site-wrap">
      <div class="sizes">
        <button class="nb" data-size="full" aria-pressed="true">Desktop</button>
        <button class="nb" data-size="phone" aria-pressed="false">Phone</button>
      </div>
      <div class="frame" id="frame">
        <iframe id="siteFrame" title="Naledi Art Studio website" loading="lazy" src="about:blank"></iframe>
      </div>
      <p class="hint">This is the live site. Booking works in here — it is the real thing, not a picture.</p>
    </div>
  </section>
</main>

<script>
(function () {
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var stage = document.getElementById('stage');
  var deck = document.getElementById('deck');
  var at = 0;

  // The slides are drawn on a fixed 1920x1080 canvas; scale it to whatever
  // width the page has rather than reflowing anything.
  function fit() {
    var w = deck.clientWidth, h = deck.clientHeight;
    var s = Math.min(w / 1920, h / 1080);
    // centred, so fullscreen on a screen that is not 16:9 letterboxes cleanly
    stage.style.transform = 'translate(' + ((w - 1920 * s) / 2).toFixed(1) + 'px,' +
      ((h - 1080 * s) / 2).toFixed(1) + 'px) scale(' + s + ')';
  }
  addEventListener('resize', fit);

  var dots = document.getElementById('dots');
  dots.innerHTML = slides.map(function (_, i) {
    return '<button class="dot" data-go="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
  }).join('');

  function show(i) {
    at = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, n) { s.classList.toggle('on', n === at); });
    document.getElementById('cur').textContent = at + 1;
    document.getElementById('prev').disabled = at === 0;
    document.getElementById('next').disabled = at === slides.length - 1;
    [].forEach.call(dots.children, function (d, n) {
      d.setAttribute('aria-current', n === at ? 'true' : 'false');
    });
  }

  document.getElementById('prev').addEventListener('click', function () { show(at - 1); });
  document.getElementById('next').addEventListener('click', function () { show(at + 1); });
  dots.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]'); if (b) show(+b.getAttribute('data-go'));
  });
  addEventListener('keydown', function (e) {
    if (document.getElementById('p-deck').hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') show(at + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') show(at - 1);
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
  });

  var x0 = null;
  deck.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) show(at + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  /* ---- tabs ---- */
  var loaded = false;
  function tab(which) {
    var isDeck = which === 'deck';
    document.getElementById('p-deck').hidden = !isDeck;
    document.getElementById('p-site').hidden = isDeck;
    document.getElementById('t-deck').setAttribute('aria-selected', isDeck ? 'true' : 'false');
    document.getElementById('t-site').setAttribute('aria-selected', isDeck ? 'false' : 'true');
    if (isDeck) { fit(); return; }
    // The site is only fetched once the tab is actually opened.
    if (!loaded) { document.getElementById('siteFrame').src = '../index.html'; loaded = true; }
  }
  document.getElementById('t-deck').addEventListener('click', function () { tab('deck'); });
  document.getElementById('t-site').addEventListener('click', function () { tab('site'); });

  document.querySelector('.sizes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-size]'); if (!b) return;
    document.getElementById('frame').classList.toggle('phone', b.dataset.size === 'phone');
    [].forEach.call(this.children, function (c) {
      c.setAttribute('aria-pressed', c === b ? 'true' : 'false');
    });
  });

  var fsBtn = document.getElementById('fs');
  fsBtn.addEventListener('click', function () {
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    var go = deck.requestFullscreen && deck.requestFullscreen();
    // Phones and some embedded views refuse it; say so rather than doing nothing.
    if (go && go.catch) go.catch(function () { fsBtn.disabled = true; fsBtn.textContent = 'Not available'; });
    else if (!go) { fsBtn.disabled = true; fsBtn.textContent = 'Not available'; }
  });
  document.addEventListener('fullscreenchange', function () {
    fit(); fsBtn.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
  });

  fit();
  show(0);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), page);
console.log('site/review/index.html built — ' + slides.length + ' slides, ' +
  (page.length / 1024).toFixed(0) + ' KB, speaker notes stripped');

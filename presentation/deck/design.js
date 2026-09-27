// The deck's design language, which is the website's design language.
//
// Every slide is a 1920 x 1080 section built from these pieces, so the
// presentation and the site cannot drift apart. The rules are the site's
// own: hairline rules instead of cards, a short uppercase title set very
// light with the rule running through the feet of the letters, the sentence
// beside it in italic serif, and more air than feels necessary.

var T = {
  paper:   '#FBF8F4',
  surface: '#FFFFFF',
  ink:     '#241C2C',
  soft:    '#6A5F74',
  faint:   '#9A8FA3',
  line:    '#E6DCD2',
  firm:    '#D2C5B8',
  gold:    '#8A6010',   // gold that may be read as text
  lit:     '#D29E38',   // gold as a shape only
  night:   '#16111D',
  cream:   '#F3EDE5',
  sans:    "'Jost', 'Century Gothic', sans-serif",
  serif:   "'Newsreader', Georgia, serif"
};

var PAD = '76px 104px 100px';
var DIM = 'rgba(243,237,229,.24)';   // a hairline on the dark ground
var DIMT = '#BCB0C6';                // soft text on the dark ground

/* A slide shell. `dark` swaps the ground; `bleed` drops the padding so a
   photograph can run to the edges. */
function slide(id, inner, opts) {
  opts = opts || {};
  var bg = opts.dark ? T.night : (opts.bg || T.paper);
  var fg = opts.dark ? T.cream : T.ink;
  // box-sizing is stated here rather than inherited, so a slide is 1920 x
  // 1080 wherever it is rendered and not only inside a page that resets it.
  return '<section id="' + id + '"' + (opts.transition ? ' data-transition="' + opts.transition + '"' : '') +
    ' style="box-sizing:border-box; position:relative; width:1920px; height:1080px; overflow:hidden; background:' + bg +
    '; color:' + fg + '; font-family:' + T.sans + '; padding:' + (opts.bleed ? '0' : PAD) +
    '; display:flex; flex-direction:column">\n' + inner + '</section>\n';
}

/* The head every slide shares: eyebrow, short uppercase title, the sentence
   beside it, and one hairline running through the feet of the letters. */
function head(eyebrow, title, lede, opts) {
  opts = opts || {};
  var dark = opts.dark;
  var size = opts.size || 96;
  return '<div style="display:grid; grid-template-columns:1fr 34ch; gap:64px; align-items:end;' +
    ' border-bottom:1px solid ' + (dark ? DIM : T.line) + '; flex:none">\n' +
    '<div>\n' +
    (eyebrow ? '<p style="font-size:18px; font-weight:500; letter-spacing:.22em; text-transform:uppercase;' +
      ' color:' + (dark ? T.lit : T.gold) + '; margin-bottom:16px">' + eyebrow + '</p>\n' : '') +
    '<h2 style="font-size:' + size + 'px; font-weight:200; line-height:.92; letter-spacing:.01em;' +
    ' text-transform:uppercase; margin-bottom:-.11em; color:' + (dark ? T.cream : T.ink) + '">' + title + '</h2>\n' +
    '</div>\n' +
    (lede ? '<p style="font-family:' + T.serif + '; font-style:italic; font-weight:300; font-size:27px;' +
      ' line-height:1.45; color:' + (dark ? DIMT : T.soft) + '; margin-bottom:18px">' + lede + '</p>\n'
          : '<span></span>\n') +
    '</div>\n';
}

/* The area under the head. */
function body(inner, opts) {
  opts = opts || {};
  return '<div style="flex:1; min-height:0; padding-top:' + (opts.top === undefined ? 52 : opts.top) +
    'px; display:flex; flex-direction:column; gap:' + (opts.gap === undefined ? 40 : opts.gap) + 'px' +
    (opts.justify ? '; justify-content:' + opts.justify : '') + '">\n' + inner + '</div>\n';
}

function foot(text, n, dark) {
  var c = dark ? 'rgba(243,237,229,.5)' : T.faint;
  return '<p style="position:absolute; left:104px; bottom:46px; font-size:17px; letter-spacing:.06em; color:' +
    c + '">' + text + '</p>\n' +
    (n ? '<p style="position:absolute; right:104px; bottom:46px; font-size:17px; color:' + c +
      '; font-variant-numeric:tabular-nums">' + (n < 10 ? '0' + n : n) + '</p>\n' : '');
}

/* Columns divided by hairlines, the way the site divides its service rows. */
function cols(items, opts) {
  opts = opts || {};
  var rule = opts.dark ? DIM : T.line;
  return '<div style="display:grid; grid-template-columns:' +
    (opts.tracks || ('repeat(' + items.length + ',1fr)')) + '; flex:' + (opts.grow ? '1' : 'none') +
    '; min-height:0">\n' +
    items.map(function (it, i) {
      var pad = i === 0 ? '0 46px 0 0' : (i === items.length - 1 ? '0 0 0 46px' : '0 46px');
      return '<div style="padding:' + pad + '; display:flex; flex-direction:column; gap:' +
        (opts.gap === undefined ? 16 : opts.gap) + 'px; min-height:0' +
        (i ? '; border-left:1px solid ' + rule : '') + '">\n' + it + '</div>\n';
    }).join('') + '</div>\n';
}

function num(n, dark) {
  return '<p style="font-size:32px; font-weight:200; letter-spacing:.06em; color:' + T.lit +
    '; font-variant-numeric:tabular-nums">' + n + '</p>\n';
}
function h3(t, dark) {
  return '<h3 style="font-size:29px; font-weight:400; line-height:1.15; color:' +
    (dark ? T.cream : T.ink) + '">' + t + '</h3>\n';
}
function p(t, opts) {
  opts = opts || {};
  return '<p style="font-size:' + (opts.size || 23) + 'px; line-height:1.55; color:' +
    (opts.color || (opts.dark ? DIMT : T.soft)) +
    (opts.max === false ? '' : '; max-width:' + (opts.max || 46) + 'ch') + '">' + t + '</p>\n';
}
function label(t, dark) {
  return '<p style="font-size:16px; font-weight:500; letter-spacing:.2em; text-transform:uppercase; color:' +
    (dark ? T.lit : T.gold) + '">' + t + '</p>\n';
}
function quote(t, opts) {
  opts = opts || {};
  return '<p style="font-family:' + T.serif + '; font-style:italic; font-weight:300; font-size:' +
    (opts.size || 36) + 'px; line-height:1.4; color:' + (opts.dark ? T.cream : T.ink) +
    '; max-width:' + (opts.max || 30) + 'ch">' + t + '</p>\n';
}

/* Label on the left, value on the right, a hairline under each. */
function rows(pairs, opts) {
  opts = opts || {};
  var rule = opts.dark ? DIM : T.line;
  return '<div style="display:flex; flex-direction:column; border-top:1px solid ' + rule + '">\n' +
    pairs.map(function (r) {
      return '<div style="display:flex; align-items:baseline; justify-content:space-between; gap:48px;' +
        ' padding:' + (opts.pad || '19px 0') + '; border-bottom:1px solid ' + rule + '">\n' +
        '<span style="font-size:' + (opts.size || 24) + 'px; color:' + (opts.dark ? DIMT : T.soft) + '">' +
        r[0] + '</span>\n' +
        '<span style="font-size:' + (opts.size || 24) + 'px; color:' + (opts.dark ? T.cream : T.ink) +
        '; font-variant-numeric:tabular-nums; text-align:right">' + r[1] + '</span>\n' +
        '</div>\n';
    }).join('') + '</div>\n';
}

/* A table with no box around it, only hairlines. */
function table(heads, data, opts) {
  opts = opts || {};
  var size = opts.size || 22;
  var w = opts.widths || [];
  var right = opts.rightAlign === undefined ? true : opts.rightAlign;
  return '<table style="width:100%; border-collapse:collapse; font-family:' + T.sans +
    '; font-size:' + size + 'px">\n' +
    '<tr>' + heads.map(function (c, i) {
      return '<th style="text-align:' + (i && right ? 'right' : 'left') +
        '; font-size:16px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:' + T.faint +
        '; padding:0 0 14px; border-bottom:1px solid ' + T.firm + (w[i] ? '; width:' + w[i] : '') + '">' +
        c + '</th>';
    }).join('') + '</tr>\n' +
    data.map(function (r) {
      return '<tr>' + r.map(function (c, i) {
        return '<td style="text-align:' + (i && right ? 'right' : 'left') +
          '; padding:' + (opts.pad || 16) + 'px 0; border-bottom:1px solid ' + T.line + '; color:' + T.ink +
          '; font-variant-numeric:tabular-nums">' + c + '</td>';
      }).join('') + '</tr>\n';
    }).join('') + '</table>\n';
}

/* A photograph: a perfect rounded rectangle, captioned underneath. */
function fig(src, alt, cap, opts) {
  opts = opts || {};
  return '<figure style="margin:0; display:flex; flex-direction:column; gap:13px; min-height:0' +
    (opts.grow === false ? '' : '; flex:1') + '">\n' +
    '<img src="' + src + '" alt="' + alt + '" style="width:100%;' +
    (opts.h ? ' height:' + opts.h + 'px;' : ' flex:1; min-height:0;') +
    ' object-fit:' + (opts.fit || 'cover') + '; border-radius:18px; display:block' +
    (opts.bg ? '; background:' + opts.bg : '') + '">\n' +
    (cap ? '<figcaption style="font-size:17px; letter-spacing:.06em; color:' +
      (opts.dark ? 'rgba(243,237,229,.62)' : T.faint) + '; flex:none">' + cap + '</figcaption>\n' : '') +
    '</figure>\n';
}

/* A strip of photographs, all the same shape, the way the site sets its
   service thumbnails. */
function strip(items, opts) {
  opts = opts || {};
  return '<div style="display:grid; grid-template-columns:repeat(' + items.length +
    ',1fr); gap:' + (opts.gap || 16) + 'px; flex:' + (opts.grow === false ? 'none' : '1') + '; min-height:0">\n' +
    items.map(function (it) {
      return fig(it[0], it[1], it[2], { dark: opts.dark, fit: opts.fit });
    }).join('') + '</div>\n';
}

function pill(t, dark) {
  return '<span style="display:inline-block; font-size:16px; letter-spacing:.16em; text-transform:uppercase;' +
    ' color:' + (dark ? T.cream : T.ink) + '; border:1px solid ' + (dark ? DIM : T.firm) +
    '; border-radius:999px; padding:10px 22px">' + t + '</span>';
}

function notes(t) { return '<aside>' + t + '</aside>\n'; }

module.exports = { T, DIM, DIMT, slide, head, body, foot, cols, num, h3, p, label, quote,
                   rows, table, fig, strip, pill, notes };

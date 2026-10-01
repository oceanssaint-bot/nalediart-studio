// Naledi Art Studio, the brand guidelines as a BOOK.
//
//   node presentation/book/build-book.js
//
// The deck argued a case: here is what you sent me, here is what was wrong
// with it, here is what I did. That case is settled, so this is a reference
// instead. Someone opens it to answer a question (what is the hex, how
// small may it go, which mark on a dark ground) and should find the answer
// on one page without reading the pages before it. The making-of survives
// as two pages at the back, where history belongs.
//
// Everything is written in the Slides format's closed subset: inline styles
// only, px lengths, hex colours, no margin, no em, no var(), no classes.
// The same files are valid HTML, so the book renders on the website too.

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pages');
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------- tokens --- */
const T = {
  paper: '#FBF8F4', surface: '#FFFFFF', ink: '#241C2C', soft: '#6A5F74',
  faint: '#9A8FA3', line: '#E6DCD2', firm: '#D2C5B8', gold: '#8A6010',
  lit: '#D29E38', night: '#16111D', cream: '#F3EDE5', dim: '#BCB0C6',
  sans: "'Jost', 'Century Gothic', sans-serif",
  serif: "'Newsreader', Georgia, serif"
};
const PAD = '52px 96px 74px';

/* ------------------------------------------------------------ pieces ---- */
function page(id, inner, o) {
  o = o || {};
  const bg = o.dark ? T.night : T.paper;
  const fg = o.dark ? T.cream : T.ink;
  return '<section id="' + id + '" style="box-sizing:border-box; position:relative; width:1920px;' +
    ' height:1080px; overflow:hidden; background:' + bg + '; color:' + fg +
    '; font-family:' + T.sans + '; padding:' + (o.bleed ? '0px' : PAD) +
    '; display:flex; flex-direction:column; gap:' + (o.gap === undefined ? 24 : o.gap) + 'px">\n' +
    inner + '</section>\n';
}

// A chapter number and a title, with the rule running under both.
function head(chapter, title, lede, o) {
  o = o || {};
  const dark = o.dark;
  const rule = dark ? 'rgba(243,237,229,.26)' : T.line;
  return '<div style="display:flex; flex-direction:column; gap:12px; padding-bottom:16px;' +
    ' border-bottom:1px solid ' + rule + '">\n' +
    '<div style="display:flex; align-items:baseline; gap:20px">\n' +
    (chapter ? '<p style="font-size:24px; font-weight:500; letter-spacing:4px; color:' +
      (dark ? T.lit : T.gold) + '">' + chapter + '</p>\n' : '') +
    '<p style="font-size:24px; letter-spacing:4px; text-transform:uppercase; color:' +
      (dark ? 'rgba(243,237,229,.6)' : T.faint) + '">' + (o.section || 'Brand guidelines') + '</p>\n' +
    '</div>\n' +
    '<div style="display:flex; align-items:flex-end; justify-content:space-between; gap:48px">\n' +
    '<h2 style="font-size:' + (o.size || 62) + 'px; font-weight:200; line-height:1; letter-spacing:1px;' +
    ' text-transform:uppercase; color:' + (dark ? T.cream : T.ink) + '">' + title + '</h2>\n' +
    (lede ? '<p style="font-family:' + T.serif + '; font-style:italic; font-size:25px; line-height:1.35;' +
      ' width:560px; color:' + (dark ? T.dim : T.soft) + '">' + lede + '</p>\n' : '') +
    '</div>\n</div>\n';
}

function body(inner, o) {
  o = o || {};
  return '<div style="flex:1; min-height:0px; display:flex; flex-direction:column; gap:' +
    (o.gap === undefined ? 26 : o.gap) + 'px' +
    (o.justify ? '; justify-content:' + o.justify : '') + '">\n' + inner + '</div>\n';
}

function foot(n, text, dark) {
  const c = dark ? 'rgba(243,237,229,.5)' : T.faint;
  return '<p style="position:absolute; left:112px; bottom:48px; font-size:24px; color:' + c + '">' +
    (text || 'Naledi Art Studio') + '</p>\n' +
    (n ? '<p style="position:absolute; right:112px; bottom:48px; font-size:24px; color:' + c + '">' +
      n + '</p>\n' : '');
}

function cols(items, o) {
  o = o || {};
  const rule = o.dark ? 'rgba(243,237,229,.22)' : T.line;
  return '<div style="display:grid; grid-template-columns:' +
    (o.tracks || ('repeat(' + items.length + ',1fr)')) + '; gap:0px; flex:' +
    (o.grow ? '1' : 'none') + '; min-height:0px">\n' +
    items.map(function (it, i) {
      const pad = i === 0 ? '0px 48px 0px 0px'
        : (i === items.length - 1 ? '0px 0px 0px 48px' : '0px 48px');
      return '<div style="padding:' + pad + '; display:flex; flex-direction:column; gap:' +
        (o.gap === undefined ? 13 : o.gap) + 'px; min-height:0px' +
        (i ? '; border-left:1px solid ' + rule : '') + '">\n' + it + '</div>\n';
    }).join('') + '</div>\n';
}

const h3 = (t, dark) => '<h3 style="font-size:27px; font-weight:400; line-height:1.15; color:' +
  (dark ? T.cream : T.ink) + '">' + t + '</h3>\n';
const p = (t, o) => { o = o || {}; return '<p style="font-size:' + (o.size || 24) +
  'px; line-height:1.55; color:' + (o.color || (o.dark ? T.dim : T.soft)) +
  (o.w ? '; width:' + o.w + 'px' : '') + '">' + t + '</p>\n'; };
const label = (t, dark) => '<p style="font-size:24px; font-weight:500; letter-spacing:4px;' +
  ' text-transform:uppercase; color:' + (dark ? T.lit : T.gold) + '">' + t + '</p>\n';
const rule = (dark) => '<hr style="border:0px; border-top:1px solid ' +
  (dark ? 'rgba(243,237,229,.22)' : T.line) + '">\n';

// A rule is the only thing allowed to say "this is the number". Tables here
// are reference tables, so they are set to be read across, not admired.
function table(heads, rows, o) {
  o = o || {};
  const size = o.size || 24;
  const right = o.right === undefined ? true : o.right;
  return '<table style="width:100%; border-collapse:collapse; font-size:' + size + 'px">\n' +
    '<tr>' + heads.map(function (c, i) {
      return '<th style="text-align:' + (i && right ? 'right' : 'left') + '; font-size:24px;' +
        ' font-weight:500; letter-spacing:3px; text-transform:uppercase; color:' + T.faint +
        '; padding:0px 0px 11px 0px; border-bottom:1px solid ' + T.firm + '">' + c + '</th>';
    }).join('') + '</tr>\n' +
    rows.map(function (r) {
      return '<tr>' + r.map(function (c, i) {
        return '<td style="text-align:' + (i && right ? 'right' : 'left') + '; padding:' +
          (o.pad || 12) + 'px 0px; border-bottom:1px solid ' + T.line + '; color:' + T.ink +
          '">' + c + '</td>';
      }).join('') + '</tr>\n';
    }).join('') + '</table>\n';
}

// An image with its caption under it. No <figure>: the format drops it.
function plate(src, alt, cap, o) {
  o = o || {};
  return '<div style="display:flex; flex-direction:column; gap:14px; min-height:0px' +
    (o.grow === false ? '' : '; flex:1') + '">\n' +
    '<img src="' + src + '" alt="' + alt + '" style="width:100%; height:' +
    (o.h ? o.h + 'px' : '100%') + '; object-fit:' + (o.fit || 'cover') +
    '; border-radius:18px' + (o.bg ? '; background:' + o.bg : '') +
    (o.pad ? '; padding:' + o.pad + 'px' : '') + '">\n' +
    (cap ? '<p style="font-size:24px; color:' + (o.dark ? 'rgba(243,237,229,.62)' : T.faint) +
      '">' + cap + '</p>\n' : '') + '</div>\n';
}

function strip(items, o) {
  o = o || {};
  return '<div style="display:grid; grid-template-columns:repeat(' + items.length +
    ',1fr); gap:' + (o.gap || 18) + 'px; flex:1; min-height:0px">\n' +
    items.map(function (it) { return plate(it[0], it[1], it[2], { dark: o.dark, fit: o.fit }); }).join('') +
    '</div>\n';
}

const notes = (t) => '<aside>' + t + '</aside>\n';

module.exports = { T, PAD, page, head, body, foot, cols, h3, p, label, rule, table, plate, strip, notes, OUT };

// Running this file directly builds the book.
if (require.main === module) require('./content.js');

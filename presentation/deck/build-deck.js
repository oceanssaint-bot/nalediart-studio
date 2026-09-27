// Regenerates every slide in presentation/deck/project/slides/ in the
// website's design language.
//
//   node presentation/deck/build-deck.js
//
// The copy lives here rather than in the HTML, because the slides are laid
// out by the shared pieces in design.js. Change a rule there and all
// twenty-nine slides follow.
//
// Two kinds of image reference appear below. /_blob/<id> is an uploaded
// asset, mapped to a local file by site/review/build.js. /_studio/<name> is
// one of Naledi's own photographs, mapped to site/assets/img by the same
// script, so the deck shows the real rooms rather than only the artwork.

const fs = require('fs');
const path = require('path');
const D = require('./design.js');
const { T, slide, head, body, foot, cols, num, h3, p, label, quote,
        rows, table, fig, strip, pill, notes } = D;

const OUT = path.join(__dirname, 'project', 'slides');
const FOOT_ID = 'Naledi Art Studio &middot; Brand identity';
const FOOT_GL = 'Naledi Art Studio &middot; Brand guidelines';

const B = {
  original:  '/_blob/91d399f4d6eb418c4ed62ba001a67c02',
  beforeArt: '/_blob/6b37cbdcae5a83bc320018ac42f553f4',
  afterArt:  '/_blob/099b605a377a3ad4ec40412be23cd50c',
  zoomBefore:'/_blob/97422d52f47895216b12005addbe2928',
  zoomAfter: '/_blob/c9621c0865e6912d1534fe59c7de1897',
  primary:   '/_blob/eca5d5bd4f8d4876022aeeb885520782',
  reversed:  '/_blob/994263bd13546879ad473985f779c70a',
  classic:   '/_blob/50908022be43935b0af0e10c873577f9',
  badge:     '/_blob/e2f7ba78c19d15d24c79dc5ef3eddffb',
  submark:   '/_blob/e6608cd94b7e8c1f79b3eced4ca8b5c7',
  horizontal:'/_blob/b90fa38b45de476b12a9c4762c9012aa',
  suite:     '/_blob/7e044a9a0e30b7aca063f1c382128f69',
  appCard:   '/_blob/2f1c2fde003b3b92f73eccfa88b2ba71',
  appSocial: '/_blob/84e32750da6f5183afa7968bdd53fef8',
  appSig:    '/_blob/536a32863c36e4a589f7bdb872cd52c6'
};
const S = function (n) { return '/_studio/' + n; };

const SLIDES = {};

/* ------------------------------------------------------------------ 01
   Built like the website's hero: one photograph, a small pill naming it,
   and the type sitting in the quiet corner. The mark here is the reversed
   cream one, not the full-colour submark, for the reason slide 22 gives:
   on a near-black ground the painted artwork loses its outline. */
SLIDES.cover = slide('cover',
  '<img src="' + S('venue-event') + '" alt="" style="position:absolute; inset:0; width:100%; height:100%;' +
  ' object-fit:cover">\n' +
  '<div style="position:absolute; inset:0; background:linear-gradient(104deg, rgba(14,10,19,.95) 0%,' +
  ' rgba(14,10,19,.9) 40%, rgba(14,10,19,.62) 100%)"></div>\n' +
  '<div style="position:relative; flex:1; display:flex; flex-direction:column; justify-content:space-between">\n' +
  '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:40px">\n' +
  pill('Brand guidelines', true) +
  '<p style="font-size:18px; font-weight:500; letter-spacing:.26em; text-transform:uppercase; color:' + T.lit +
  '; padding-top:12px">Durban &middot; Est. 2019</p>\n' +
  '</div>\n' +
  '<div style="display:grid; grid-template-columns:1fr 320px; gap:80px; align-items:end">\n' +
  '<div style="display:flex; flex-direction:column; gap:28px">\n' +
  '<h1 style="font-size:138px; font-weight:200; line-height:.88; letter-spacing:.01em;' +
  ' text-transform:uppercase; color:' + T.cream + '">Naledi<br>Art Studio</h1>\n' +
  '<div style="width:100%; height:1px; background:' + D.DIM + '"></div>\n' +
  '<p style="font-family:' + T.serif + '; font-size:34px; font-style:italic; font-weight:300; color:' +
  D.DIMT + '; max-width:28ch">Brand identity, from the file you sent me to a finished suite.</p>\n' +
  '</div>\n' +
  '<img src="' + B.reversed + '" alt="The Naledi Art Studio logo, reversed in cream"' +
  ' style="width:320px; object-fit:contain; margin-bottom:8px">\n' +
  '</div>\n' +
  '</div>\n' +
  foot('Prepared for Naledi Zondi', 0, true) +
  notes('Open by saying this is the whole journey: what she sent, what was wrong with it, what I did to it, and how to use the result. The mark bottom right is the reversed set, and there is a slide later on why it has to be that one over a photograph.'),
  { dark: true, transition: 'fade' });

/* ------------------------------------------------------------------ 02 */
SLIDES.contents = slide('contents',
  head('Brand guidelines', 'Contents', 'What is in this document, and how to read it.') +
  body(
    cols([
      num('01') + h3('The brand') + p('What the studio is, how it speaks, and where the logo came from.'),
      num('02') + h3('The system') + p('Colour, typography, the marks, layout and photography.'),
      num('03') + h3('Using it') + p('Clear space, minimum sizes, backgrounds, and what not to do.'),
      num('04') + h3('In the world') + p('The website, the rooms, stationery, social, files, and who decides.')
    ], { grow: false, gap: 18 }) +
    '<div style="height:1px; background:' + T.line + '"></div>\n' +
    quote('Where a page says <b style="font-style:normal; font-weight:400">measured</b>, the number was taken off your own artwork. Where it says <b style="font-style:normal; font-weight:400">proposed</b>, it is a recommendation you can accept or change.', { max: 58, size: 30 }),
    { gap: 46 }) +
  foot(FOOT_GL, 2));

/* ------------------------------------------------------------------ 03 */
SLIDES.foundation = slide('foundation',
  head('What the studio is', 'The studio', 'Art experiences for everyday people, on everyday budgets.') +
  body(
    '<div style="display:grid; grid-template-columns:380px 1fr 1fr; gap:66px; flex:1; min-height:0;' +
    ' align-items:start">\n' +
    fig(S('naledi'), 'Naledi Zondi in the studio', '', { h: 620 }) +
    '<div style="display:flex; flex-direction:column; gap:22px">\n' +
    quote('&ldquo;I aim to inspire creativity and offer art experiences for everyday people with everyday budgets. Whether it is a birthday shoot, campaign video, graduation party or podcast set, we do it all.&rdquo;', { max: 26, size: 32 }) +
    '<p style="font-size:19px; letter-spacing:.18em; text-transform:uppercase; color:' + T.faint +
    '">Naledi Zondi, in her own words</p>\n' +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column">\n' +
    rows([
      ['What it does', 'Studio hire, set design, venue, art'],
      ['Where', '39 Station Drive, Greyville'],
      ['Since', '2019']
    ], { size: 25 }) +
    '<div style="padding-top:34px; display:flex; flex-direction:column; gap:14px">\n' +
    h3('Who it is for') +
    p('People making something who need a room that already looks right, rather than a white box they have to dress themselves.', { max: 44 }) +
    '</div>\n</div>\n</div>\n', { top: 56 }) +
  foot(FOOT_GL, 3));

/* ------------------------------------------------------------------ 04 */
SLIDES.voice = slide('voice',
  head('How it speaks &middot; proposed', 'Voice', 'Warm, plain, never precious. Drawn from how you already write.') +
  body(
    cols([
      label('Sounds like us') +
      p('&ldquo;A space designed to be photographed, not a white box.&rdquo;', { size: 25, color: T.ink }) +
      p('&ldquo;Two extra guests or ten. We will make it work.&rdquo;', { size: 25, color: T.ink }) +
      p('&ldquo;Tell us what you are making and we will tell you what you need.&rdquo;', { size: 25, color: T.ink }),

      label('Does not') +
      p('&ldquo;Bespoke curated experiential environments.&rdquo;', { size: 25, color: T.faint }) +
      p('&ldquo;Unleash your creative journey today!&rdquo;', { size: 25, color: T.faint }) +
      p('&ldquo;Premium luxury studio solutions.&rdquo;', { size: 25, color: T.faint }),

      label('Three habits') +
      p('Say the price. R800. R8 500. Hiding it reads as expensive.') +
      p('Short sentences, one idea in each. Full stops rather than dashes.') +
      p('South African English. Colour, organise, metres.')
    ], { gap: 20 }) +
    '<div style="height:1px; background:' + T.line + '"></div>\n' +
    p('You say &ldquo;we do it all&rdquo; and &ldquo;everyday budgets&rdquo;: welcoming, unfussy, confident without posturing. Keep that. The work is the impressive part; the words do not need to be.', { max: 76, size: 25 }),
    { gap: 44 }) +
  foot(FOOT_GL, 4));

/* ------------------------------------------------------------------ 05 */
SLIDES.origin = slide('origin',
  head('Where we started', 'The file', 'What you sent me, measured rather than guessed at.') +
  body(
    '<div style="display:grid; grid-template-columns:600px 1fr; gap:88px; flex:1; min-height:0">\n' +
    fig(B.original, 'The original logo file: a small faded painting above the words NALEDI ART, surrounded by empty white space', 'The file as it arrived', { bg: T.surface, fit: 'contain' }) +
    '<div style="display:flex; flex-direction:column; justify-content:center; gap:34px">\n' +
    rows([
      ['The file itself', '858 &times; 1144 px'],
      ['The artwork inside it', '418 &times; 418 px'],
      ['Share of the canvas drawn on', '18%'],
      ['Height of the entire wordmark', '17 px']
    ], { size: 26 }) +
    quote('Seventeen pixels for two lines of type. At that size the letters are not letters any more, they are grey pixels that happen to sit in a row.', { max: 42, size: 30 }) +
    '</div>\n</div>\n') +
  foot(FOOT_ID, 5) +
  notes('These are measured, not estimated. I scanned the file for non-white pixels to find the real drawn area. The 17px wordmark is the headline number: it is why the type had to be re-set in a real typeface rather than traced.'));

/* ------------------------------------------------------------------ 06 */
SLIDES.problem = slide('problem',
  head('The diagnosis', 'Three problems', 'Not one problem, and none of them the painting&rsquo;s fault.') +
  body(
    cols([
      num('01') + h3('The cut-out failed') + p('Whoever removed the background left a grey halo around every edge. On white you barely notice. On anything else it shows as a dirty outline.'),
      num('02') + h3('Nothing to enlarge') + p('418 pixels is a thumbnail. Enough for a small website image, nowhere near enough for a banner, a vinyl sign or a printed catalogue.'),
      num('03') + h3('Pieces were missing') + p('The hair and several sunflowers stopped where the eraser stopped, not where the painting did. Shapes ended mid-petal.')
    ], { grow: true, gap: 20 }), { top: 60 }) +
  foot(FOOT_ID, 6) +
  notes('Worth saying plainly: none of this was a fault of the painting. The painting was fine. Everything here happened to it afterwards, in the handling.'));

/* ------------------------------------------------------------------ 07 */
SLIDES.digitise = slide('digitise',
  head('Step one, digitising', 'Redrawn', 'Shapes rather than pixels, so there is no resolution left to run out of.') +
  body(
    strip([
      [B.beforeArt, 'The original artwork, soft-edged and washed out, enlarged to show its limits', 'Before &middot; 418 px of painting'],
      [B.afterArt, 'The finished vector artwork, crisp and fully saturated', 'After &middot; 3,569 drawn shapes']
    ], { fit: 'contain' }) +
    cols([
      p('Enlarged to this size it goes soft immediately. Every edge is a gradient of grey.', { max: 52 }),
      p('Every brushstroke is now an outline with its own colour. It is sharp at any size.', { max: 52 })
    ], { gap: 0 }),
    { gap: 26 }) +
  foot(FOOT_ID, 7) +
  notes('Both images are shown at the same height so the comparison is fair. The left one is genuinely that soft at this size, it is not a filter.'));

/* ------------------------------------------------------------------ 08 */
SLIDES.repaint = slide('repaint',
  head('Step two, repainting', 'Repainted', 'The same corner of the crown, before and after.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:56px; flex:1; min-height:0">\n' +
    fig(B.zoomBefore, 'Detail of the original: pixelated sunflowers with a grey halo bleeding around the hair', 'Before') +
    fig(B.zoomAfter, 'The same detail repainted: clean petal edges, solid dark hair, saturated gold', 'After') +
    '<div style="display:flex; flex-direction:column; justify-content:center">\n' +
    rows([
      ['The halo', 'painted out, edge by edge'],
      ['The hair', 'carried back to where it ends'],
      ['Cut flowers', 'redrawn to full petals'],
      ['The golds', 'returned to the painting&rsquo;s strength']
    ], { size: 23 }) +
    '</div>\n</div>\n') +
  foot(FOOT_ID, 8) +
  notes('Both crops are the same region of the artwork, at the same magnification. Point at the hairline on the left, the grey mush, then the same line on the right.'));

/* ------------------------------------------------------------------ 09 */
SLIDES.master = slide('master',
  head('The master', 'One file', 'Everything else in this document comes out of it.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 560px; gap:88px; flex:1; min-height:0;' +
    ' align-items:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:44px">\n' +
    cols([
      '<p style="font-size:86px; font-weight:200; line-height:1; color:' + T.ink + '">3,569</p>' + label('drawn shapes'),
      '<p style="font-size:86px; font-weight:200; line-height:1; color:' + T.ink + '">2,202</p>' + label('distinct colours'),
      '<p style="font-size:86px; font-weight:200; line-height:1; color:' + T.ink + '">&infin;</p>' + label('maximum size')
    ], { gap: 12 }) +
    p('Every mark in this document is built from this one artwork. Change it here and everything downstream follows.', { max: 56, size: 25 }) +
    '</div>\n' +
    fig(B.afterArt, 'The finished master artwork', '', { h: 520, fit: 'contain' }) +
    '</div>\n') +
  foot(FOOT_ID, 9) +
  notes('The 2,202 colours matter later, in the production notes: that many colours means digital printing rather than screen printing.'));

/* ------------------------------------------------------------------ 10 */
const SWATCH = [
  ['Sunflower', '#D29E38', T.ink], ['Skin', '#AA6B3C', T.cream], ['Plum', '#40284D', T.cream],
  ['Blossom', '#CF8598', T.ink], ['Leaf', '#44623E', T.cream], ['Near-black', '#26282B', T.cream]
];
SLIDES.palette = slide('palette',
  head('Colour', 'Palette', 'Taken out of the painting, not chosen next to it.') +
  body(
    '<div style="display:grid; grid-template-columns:repeat(6,1fr); gap:16px; flex:1; min-height:0">\n' +
    SWATCH.map(function (s) {
      return '<div style="border-radius:18px; background:' + s[1] + '; color:' + s[2] +
        '; display:flex; flex-direction:column; justify-content:flex-end; padding:30px; gap:4px">\n' +
        '<p style="font-size:25px; font-weight:400">' + s[0] + '</p>\n' +
        '<p style="font-size:19px; opacity:.72; font-variant-numeric:tabular-nums">' + s[1] + '</p>\n</div>\n';
    }).join('') + '</div>\n' +
    p('Each one is the median of thousands of pixels of that hue in your own artwork, so the brand colours and the painting can never drift apart. The next page turns them into the working system, where the near-black is warmed slightly to Ink #241C2C so it carries the plum of the painting.', { max: 96, size: 24 }),
    { gap: 34 }) +
  foot(FOOT_ID, 10) +
  notes('If she asks where these came from: the artwork was rendered at high resolution, pixels sorted into hue buckets, and the median of each bucket taken. Medians, not averages, so a few stray pixels cannot pull a colour off.'));

/* ------------------------------------------------------------------ 11 */
SLIDES['colour-spec'] = slide('colour-spec',
  head('Colour &middot; specification', 'Every value', 'What a printer will ask you for, in one place.') +
  body(
    table(['Name', 'HEX', 'RGB', 'CMYK', 'Role'], [
      ['Ink', '#241C2C', '36 28 44', '18 36 0 83', 'Primary dark'],
      ['Paper', '#FBF8F4', '251 248 244', '0 1 3 2', 'Primary light'],
      ['Night', '#16111D', '22 17 29', '24 41 0 89', 'Dark ground'],
      ['Sunflower', '#D29E38', '210 158 56', '0 25 73 18', 'Accent, graphic'],
      ['Sunflower Deep', '#8A6010', '138 96 16', '0 30 88 46', 'Accent, as text'],
      ['Plum', '#40284D', '64 40 77', '17 48 0 70', 'Secondary'],
      ['Blossom', '#CF8598', '207 133 152', '0 36 27 19', 'Supporting'],
      ['Leaf', '#44623E', '68 98 62', '31 0 37 62', 'Supporting'],
      ['Skin', '#AA6B3C', '170 107 60', '0 37 65 33', 'Supporting']
    ], { size: 23, pad: 15, widths: ['24%', '16%', '18%', '20%', '22%'] }) +
    p('CMYK is a straight conversion, not a press profile. Ask your printer to proof it on the actual stock before a long run: the golds are the ones that shift.', { max: 84, size: 22 }),
    { gap: 30, top: 44 }) +
  foot(FOOT_GL, 11));

/* ------------------------------------------------------------------ 12 */
SLIDES['colour-use'] = slide('colour-use',
  head('Colour &middot; how to combine', 'Two grounds', 'One accent, used sparingly. Roughly 70 / 22 / 8.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0">\n' +
    '<div style="display:flex; flex-direction:column; gap:22px; min-height:0">\n' +
    '<div style="flex:1; min-height:0; display:grid; grid-template-columns:70fr 22fr 8fr; gap:10px">\n' +
    '<div style="background:' + T.paper + '; border:1px solid ' + T.line + '; border-radius:18px"></div>\n' +
    '<div style="background:' + T.ink + '; border-radius:18px"></div>\n' +
    '<div style="background:' + T.lit + '; border-radius:18px"></div>\n' +
    '</div>\n' +
    p('Mostly paper, ink for everything you read, and only a little gold. The gold stops working the moment there is a lot of it. On a dark ground: Night, cream type, the lighter gold for accents, and never pure white, which glares.', { max: 52 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:20px; min-height:0">\n' +
    label('Legibility, as numbers') +
    table(['Pairing', 'Contrast', 'Safe for'], [
      ['Ink on Paper', '15.5 : 1', 'Anything, any size'],
      ['Paper on Night', '17.5 : 1', 'Anything, any size'],
      ['Plum on Paper', '12.2 : 1', 'Anything, any size'],
      ['Sunflower Deep on Paper', '5.3 : 1', 'Small text and labels'],
      ['Sunflower on Night', '7.7 : 1', 'Small text and labels'],
      ['Sunflower on Paper', '2.3 : 1', 'Shapes only, never text']
    ], { size: 21, pad: 13 }) +
    p('That last row is the trap. The bright gold looks right on a pale ground but fails as reading text. Use Sunflower Deep when gold has to be read.', { max: 54, size: 21 }) +
    '</div>\n</div>\n', { top: 46 }) +
  foot(FOOT_GL, 12));

/* ------------------------------------------------------------------ 13 */
SLIDES.type = slide('type',
  head('Typeface', 'Jost Light', 'The same bones as the letters you were already using, measured rather than guessed.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0">\n' +
    '<div style="display:flex; flex-direction:column; gap:26px">\n' +
    '<p style="font-size:104px; font-weight:200; line-height:.9; letter-spacing:.01em; text-transform:uppercase">Naledi</p>\n' +
    table(['Measured', 'Yours', 'Jost', 'Gotham'], [
      ['Stem weight', '7.7%', '7.9%', '7.1%'],
      ['Width of NALEDART', '7.10', '6.63', '7.04']
    ], { size: 23 }) +
    p('Jost is the closer match on weight, which is the harder thing to fake. Gotham needed a hairline stroke added to reach your 7.7%; Jost arrives there on its own. It sets narrower, so the lockup is tracked out to land on your measured width exactly.', { max: 52 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:34px; justify-content:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:14px; border-top:1px solid ' + T.line + '; padding-top:26px">\n' +
    label('Free to use') +
    p('Jost is published under the SIL Open Font License. You can use it in the logo, on signage, in documents and on the website, and so can anyone you hand the brand to. No licence to buy, and nothing to renew.', { max: 48 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:14px; border-top:1px solid ' + T.line + '; padding-top:26px">\n' +
    '<p style="font-size:16px; font-weight:500; letter-spacing:.2em; text-transform:uppercase; color:' + T.faint + '">Why it changed</p>\n' +
    p('The marks were first built in Gotham Narrow, a commercial face. The files were safe, because the letters are outlines, but setting any fresh text in it would have needed a paid licence. That question is now gone.', { max: 48 }) +
    '</div>\n</div>\n</div>\n', { top: 44 }) +
  foot(FOOT_GL, 13));

/* ------------------------------------------------------------------ 14 */
SLIDES.typescale = slide('typescale',
  head('Typography &middot; the scale', 'Five sizes', 'Reused everywhere, with nothing invented in between.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0">\n' +
    '<div style="display:flex; flex-direction:column; gap:18px; justify-content:center">\n' +
    '<p style="font-size:68px; font-weight:200; line-height:1.05; text-transform:uppercase; letter-spacing:.01em">Display</p>\n' +
    '<p style="font-size:42px; font-weight:300; line-height:1.1">Section heading</p>\n' +
    '<p style="font-size:28px; font-weight:500; line-height:1.2">Subheading</p>\n' +
    '<p style="font-size:24px; line-height:1.5; color:' + T.soft + '; max-width:44ch">Body copy, set at a comfortable measure and never wider than about seventy characters.</p>\n' +
    '<p style="font-size:20px; font-weight:500; letter-spacing:.2em; text-transform:uppercase; color:' + T.gold + '">Label</p>\n' +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:28px">\n' +
    table(['Role', 'Size', 'Weight', 'Line height'], [
      ['Display', '68 px', '200', '1.05'],
      ['Heading', '42 px', '300', '1.10'],
      ['Subheading', '28 px', '500', '1.20'],
      ['Body', '24 px', '400', '1.50'],
      ['Label', '20 px', '500', '1.30']
    ], { size: 22, pad: 14 }) +
    '<div style="display:flex; flex-direction:column; gap:12px">\n' +
    label('Rules that hold it together') +
    p('Emphasise with weight, italic or colour, never by inventing a sixth size. Labels are uppercase with generous letter-spacing; nothing else is uppercase. Body text stops at about 70 characters a line. One typeface throughout, so nothing can drift apart and there is no licence to manage.', { max: 52, size: 22 }) +
    '</div>\n</div>\n</div>\n', { top: 44 }) +
  foot(FOOT_GL, 14));

/* ------------------------------------------------------------------ 15 */
SLIDES.primary = slide('primary',
  head('The working mark', 'Primary', 'Built to the measurement, not to the eye.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0;' +
    ' align-items:center">\n' +
    fig(B.primary, 'The primary logo: NALEDI ART STUDIO set in two lines with a vertical rule for the letter I and the portrait forming the O', 'The device is your own: the rule standing in for the I, the portrait sitting in the O', { h: 420, fit: 'contain' }) +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    rows([
      ['Stem weight, 7.7% of cap', '7.7%'],
      ['Line 1 ink width, 7.10 &times; cap', '7.08 &times; cap'],
      ['Leading, 1.36 &times; cap', 'matched'],
      ['Rule, through both lines', '0.077 cap'],
      ['The O, ring at 9.5% of cap', '0.095 cap']
    ], { size: 24 }) +
    p('Everything is expressed in cap heights rather than pixels, so the mark rebuilds exactly at any size. A business card and a building sign are the same drawing.', { max: 50 }) +
    '</div>\n</div>\n', { top: 46 }) +
  foot(FOOT_ID, 15) +
  notes('The one deliberate deviation: the round O carries a small optical overshoot so it does not read as sitting higher than the flat-sided letters beside it. That is standard practice, not an error.'));

/* ------------------------------------------------------------------ 16 */
SLIDES.classic = slide('classic',
  head('The painted lockup', 'Classic', 'The painting&rsquo;s own layout, kept rather than re-invented.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0;' +
    ' align-items:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    rows([
      ['Cap height, share of artwork width', '0.2016'],
      ['Line width, share of artwork width', '1.4562'],
      ['Painted stroke weight', '4.0% of cap'],
      ['Built at', '6.5% of cap']
    ], { size: 24 }) +
    p('Weight is the one thing I changed on purpose. At 4.0% the letters looked starved next to the artwork. A second version at 7.7% exists if you would rather both lockups feel identical in weight.', { max: 50 }) +
    '</div>\n' +
    fig(B.classic, 'The classic lockup: the portrait artwork above the words NALEDI ART and EST. 2019', 'Artwork above, the words below, as you painted it', { h: 470, fit: 'contain' }) +
    '</div>\n', { top: 46 }) +
  foot(FOOT_ID, 16) +
  notes('This is the version to use where the brand needs to feel like the original painting: gallery labels, certificates, the back of a print. The primary is the working mark for everything else.'));

/* ------------------------------------------------------------------ 17 */
SLIDES.suite = slide('suite',
  head('All of them at once', 'The suite', 'Seventeen files, every one of them built from the same artwork.') +
  body(fig(B.suite, 'Contact sheet of the whole logo suite: primary, flush primary, badge, horizontal, submark, monogram, wordmark and the classic lockup', '', { fit: 'contain' }), { top: 40 }) +
  foot(FOOT_ID, 17) +
  notes('Do not read the whole sheet out. Say that every one of these is generated from the single master, so they can never disagree with each other, then move to the next slide where the four that matter get explained.'));

/* ------------------------------------------------------------------ 18 */
SLIDES.marks = slide('marks',
  head('Which mark, when', 'Four marks', 'The ones you will actually reach for.') +
  body(
    '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:44px; flex:1; min-height:0">\n' +
    [[B.primary, 'The primary logo', 'Primary', 'The default. Website header, invoices, proposals, anywhere with room for two lines.'],
     [B.badge, 'The oval Durban badge', 'Badge', 'Stickers, packaging tape, wax seals, the back of a canvas. Carries Durban in the ring.'],
     [B.submark, 'The circular submark', 'Submark', 'Social avatar, favicon, app icon. Anywhere the name is already beside it.'],
     [B.horizontal, 'The horizontal lockup', 'Horizontal', 'Letterhead, email footer, a wide banner, wherever height is short and width is not.']
    ].map(function (m) {
      // A fixed height, not flex:1. With flex the shortest caption gave its
      // card the tallest image, and the four names stopped sharing a line.
      return '<div style="display:flex; flex-direction:column; gap:20px; min-height:0">\n' +
        '<img src="' + m[0] + '" alt="' + m[1] + '" style="width:100%; height:390px; flex:none;' +
        ' object-fit:contain; border-radius:18px; background:' + T.surface + '; padding:26px">\n' +
        h3(m[2]) + p(m[3], { max: 34, size: 21 }) + '</div>\n';
    }).join('') + '</div>\n', { top: 44 }) +
  foot(FOOT_ID, 18) +
  notes('There is also a monogram and a plain-ring wordmark in the files. I would not lead with the monogram, covered on the open questions at the end.'));

/* ------------------------------------------------------------------ 19 */
SLIDES.layout = slide('layout',
  head('Layout', 'Space', 'The artwork is busy. Everything around it should not be.') +
  body(
    cols([
      h3('The spacing scale') + p('4, 8, 12, 18, 24, 32, 44, 68, 104. Pick from the scale rather than typing a number. Gaps that are nearly the same read as mistakes.'),
      h3('Margins grow') + p('Phone 18px, tablet 28px, laptop 48px, large screen 72px and above. A margin that stays fixed makes a big screen look like a small one that has been stretched.'),
      h3('Measured text') + p('Images and panels may run the whole width. Paragraphs stop at about 58 characters, headings at about 20. Past that the eye loses its place.'),
      h3('One alignment') + p('Left aligned, ragged right. Centred type only inside a badge or a stamp, where the shape is doing the centring.')
    ], { grow: true, gap: 18 }) +
    quote('Give the page more air than feels necessary and the work carries itself.', { max: 50, size: 32 }),
    { gap: 40, top: 56 }) +
  foot(FOOT_GL, 19));

/* ------------------------------------------------------------------ 20 */
SLIDES.photography = slide('photography',
  head('Photography', 'The rooms', 'Warm light, real rooms, people actually doing something.') +
  body(
    strip([
      [S('studio-space'), 'The raw studio floor with tall factory windows', 'The floor, unstyled'],
      [S('set-arch'), 'The arched plaster set with built niches', 'The arch set'],
      [S('couple'), 'A couple photographed in the dressed arch set', 'A shoot in the dressed set'],
      [S('arch-proposal'), 'The arch dressed with florals and candles for a proposal', 'Dressed for a proposal'],
      [S('yellow-gown'), 'A portrait shoot in a yellow gown on hay bales', 'A portrait shoot'],
      [S('pampas'), 'A styled shoot with pampas grass and hessian sacks', 'A styled shoot']
    ]) +
    cols([
      h3('Do') + p('Daylight where you can. Show the room as it is, with its concrete and its plaster. Let people be mid-action rather than posed at the camera.', { size: 21 }),
      h3('Avoid') + p('Heavy filters, cold blue casts, and stock photography of anyone who has never been in the building. The rooms are the proof.', { size: 21 }),
      h3('Crop') + p('Wide enough to read the space. A tight crop on a prop tells nobody what they would be hiring.', { size: 21 })
    ], { gap: 12 }),
    { gap: 34, top: 40 }) +
  foot(FOOT_GL, 20));

/* ------------------------------------------------------------------ 21 */
SLIDES.clearspace = slide('clearspace',
  head('Room around the mark', 'Clear space', 'One cap height all round, and a floor under every mark.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0;' +
    ' align-items:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:26px; min-height:0">\n' +
    fig(B.primary, 'The primary logo shown inside its clear-space boundary', '', { h: 330, fit: 'contain', bg: T.surface }) +
    p('Measure the height of a capital N in the mark. Keep that much empty on every side: no type, no photograph edge, no border. For the round marks, keep a quarter of the ring&rsquo;s diameter.', { max: 50 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:26px">\n' +
    label('Below these, use a simpler mark') +
    table(['Mark', 'Screen', 'Print'], [
      ['Primary', '120 px wide', '32 mm'],
      ['Horizontal', '180 px wide', '45 mm'],
      ['Badge', '64 px', '18 mm'],
      ['Submark', '32 px', '10 mm']
    ], { size: 23 }) +
    p('The artwork carries a lot of fine detail. Under these sizes the sunflowers stop reading as sunflowers and turn to noise. That is when to switch to the submark or the plain-ring wordmark.', { max: 50, size: 22 }) +
    '</div>\n</div>\n', { top: 46 }) +
  foot(FOOT_ID, 21) +
  notes('These floors are my recommendation from how the detail holds up, not a measured threshold. If she has a specific application near the limit, test that one.'));

/* ------------------------------------------------------------------ 22 */
SLIDES.backgrounds = slide('backgrounds',
  head('Backgrounds', 'Grounds', 'Where the mark sits happily, and the one place it does not.', { dark: true }) +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0;' +
    ' align-items:center">\n' +
    fig(B.reversed, 'The logo reversed in cream on a dark ground', 'The reversed set is cream, not white. Pure white vibrates against the plum.', { h: 380, fit: 'contain', dark: true }) +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    rows([
      ['Cream, white, pale warm greys', 'the standard ink set'],
      ['Deep plum, charcoal, black', 'the reversed cream set'],
      ['Photographs', 'reversed set, quiet areas only']
    ], { size: 23, dark: true }) +
    '<div style="display:flex; flex-direction:column; gap:12px">\n' +
    h3('The one real trap', true) +
    p('Her hair is very dark. On a near-black ground the full-colour artwork loses its outline and the head disappears. On dark grounds use the reversed set, or the submark, which carries a ring to hold the edge.', { max: 48, dark: true }) +
    '</div>\n</div>\n</div>\n', { top: 46 }) +
  foot(FOOT_ID, 22, true) +
  notes('This is the failure most likely to happen in the wild: someone drops the full-colour logo onto a black Instagram tile. Show the ring version as the answer.'),
  { dark: true });

/* ------------------------------------------------------------------ 23 */
SLIDES.misuse = slide('misuse',
  head('Please avoid', 'Six ways', 'Six ways to undo all of this, none of them hard to avoid.') +
  body(
    '<div style="display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:1fr 1fr;' +
    ' column-gap:64px; row-gap:38px; flex:1; min-height:0">\n' +
    [['Stretching it', 'Scale from a corner, holding proportion. A squashed face is the first thing anyone notices.'],
     ['Recolouring the artwork', 'The painting stays as painted. Only the lettering and the rule may change colour.'],
     ['Re-typing the words', 'The spacing is measured, not typed. Use the supplied files rather than setting the name fresh.'],
     ['Adding effects', 'No drop shadows, outlines, glows or bevels. The artwork already carries its own texture.'],
     ['Cropping the O', 'The whole artwork sits inside that circle on purpose. A tighter crop cuts the sunflowers again.'],
     ['Rebuilding from a screenshot', 'That is how we got here. Always start from the supplied SVG or PDF.']
    ].map(function (m, i) {
      return '<div style="display:flex; flex-direction:column; gap:12px; border-top:1px solid ' + T.line +
        '; padding-top:22px">\n' + num((i + 1 < 10 ? '0' : '') + (i + 1)) + h3(m[0]) + p(m[1], { max: 40, size: 21 }) + '</div>\n';
    }).join('') + '</div>\n', { top: 46 }) +
  foot(FOOT_ID, 23) +
  notes('The last one is the important one, and worth saying with a smile. The whole first half of this deck exists because someone worked from a flattened copy instead of the original.'));

/* ------------------------------------------------------------------ 24 */
SLIDES.web = slide('web',
  head('The website', 'Already running', 'The first full application of everything in this document.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0">\n' +
    '<div style="display:flex; flex-direction:column; gap:26px; min-height:0">\n' +
    strip([
      [S('set-arch-wide'), 'The niche wall built for a set', ''],
      [S('art-valentine-sheet'), 'Eternal Valentine, 80 by 95 cm', '']
    ]) +
    p('The palette, the type scale, the marks, the spacing and the photography are all in use there. If you want to see a rule working, look at the site. It is mobile first, because that is how almost everyone will arrive.', { max: 52 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; justify-content:center; gap:18px">\n' +
    '<div style="display:flex; flex-direction:column; gap:8px; border-top:1px solid ' + T.line + '; padding-top:16px">\n' +
    h3('A guided finder') + p('Three questions decide whether someone needs studio hire, the venue or a set build, then hand them to the booking form with it chosen.', { max: 46, size: 20 }) + '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:8px; border-top:1px solid ' + T.line + '; padding-top:16px">\n' +
    h3('Booking that holds the slot') + p('A request blocks the time immediately so nobody can double book it. You confirm from your own dashboard. Unconfirmed requests release themselves after 48 hours.', { max: 46, size: 20 }) + '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:8px; border-top:1px solid ' + T.line + '; padding-top:16px">\n' +
    h3('A wall of the work') + p('The gallery and the drifting band are your own photographs. Replace them as the work changes; the layout takes any shape.', { max: 46, size: 20 }) + '</div>\n' +
    '</div>\n</div>\n', { top: 36 }) +
  foot(FOOT_GL, 24));

/* ------------------------------------------------------------- 25, new */
SLIDES['in-use'] = slide('in-use',
  head('The brand in the room', 'In use', 'Where the system actually lands: your own rooms, photographed.', { dark: true }) +
  body(
    strip([
      [S('red-velvet'), 'A deep red velvet backdrop hung in the studio', 'Studio hire &middot; the marquee and the booking dock'],
      [S('arch-desk'), 'The arch reworked as a desk for a podcast set', 'Set design &middot; the services row'],
      [S('art-eternal-valentine'), 'Eternal Valentine, an original painting', 'Custom art &middot; the wall'],
      [S('venue-class'), 'A paint and sip class at easels in the studio', 'Art experiences &middot; the about section']
    ], { dark: true }) +
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px">\n' +
    p('Every photograph in this deck and on the website is one of yours. Nothing here is stock, and nothing was staged for the brand. The palette was taken from your painting, so the rooms and the marks already agree with each other.', { max: 54, dark: true }) +
    p('When the work changes, the photographs change and nothing else has to. Drop new frames into the same shapes: three to a row on the site, four across here.', { max: 54, dark: true }) +
    '</div>\n',
    { gap: 34, top: 40 }) +
  foot(FOOT_GL, 25, true) +
  notes('This is the slide to linger on. Everything before it is the system; this is the system wearing her own rooms. If she pushes back on any rule, point here and ask whether it looks like her studio.'),
  { dark: true });

/* ------------------------------------------------------------------ 26 */
SLIDES.stationery = slide('stationery',
  head('Stationery', 'On paper', 'Built from the supplied files, with nothing redrawn.') +
  body(
    strip([
      [B.appCard, 'Business card, both faces: the reversed logo on Night, and contact details on Paper with the oval badge', 'Card, both faces'],
      [B.appSig, 'Email signature: the horizontal lockup above name and contact details', 'Email signature']
    ], { fit: 'contain' }) +
    cols([
      h3('Specifications') + p('Card 85 &times; 55 mm, 400gsm uncoated. Uncoated matters: the artwork has texture and a gloss stock fights it. Email signature 620px wide, the horizontal lockup above a hairline rule.', { size: 21 }),
      h3('One mark a face') + p('The reversed mark goes on the dark face, the oval badge on the light one. Never both marks on the same face.', { size: 21 })
    ], { gap: 12 }),
    { gap: 32, top: 40 }) +
  foot(FOOT_GL, 26));

/* ------------------------------------------------------------------ 27 */
SLIDES.social = slide('social',
  head('Social and digital', 'One mark', 'One mark, one ground, and the handle everywhere.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0;' +
    ' align-items:center">\n' +
    fig(B.appSocial, 'Social avatar: the submark on a sunflower ground, and the oval badge as a sticker on cream', '', { h: 420, fit: 'contain' }) +
    '<div style="display:flex; flex-direction:column; gap:28px">\n' +
    table(['Where', 'Use'], [
      ['Profile picture', 'Submark on Sunflower'],
      ['Favicon and app icon', 'Submark, 180 px'],
      ['Stickers and packaging', 'Oval badge on Paper'],
      ['Post with a photograph', 'Reversed mark, bottom left']
    ], { size: 23 }) +
    '<div style="display:flex; flex-direction:column; gap:10px">\n' +
    label('The handle') +
    '<p style="font-size:42px; font-weight:200; letter-spacing:.01em">@nalediart_studio</p>\n' +
    p('Use it everywhere, and put the booking link in the bio rather than an email address. The submark exists because the full logo is unreadable at 32px.', { max: 48, size: 21 }) +
    '</div>\n</div>\n</div>\n', { top: 46 }) +
  foot(FOOT_GL, 27));

/* ------------------------------------------------------------------ 28 */
SLIDES.files = slide('files',
  head('What you have', 'The handover', 'Four formats, and two decisions still waiting on you.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0">\n' +
    '<div style="display:flex; flex-direction:column; gap:26px">\n' +
    table(['Format', 'Use it for'], [
      ['SVG', 'Web, and any designer you hand the brand to'],
      ['PDF', 'Printers, signwriters, embroiderers'],
      ['PNG', 'Transparent, several sizes, documents and social'],
      ['AI', 'The editable master artwork']
    ], { size: 23 }) +
    p('Every file was checked to render with no fonts installed, so a printer who owns nothing at all still gets the right letters. The typeface is free anyway.', { max: 50, size: 22 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:24px">\n' +
    '<div style="display:flex; flex-direction:column; gap:10px; border-top:1px solid ' + T.line + '; padding-top:20px">\n' +
    h3('Digital print, not screen print') + p('2,202 colours cannot be separated into spot inks. For fabric, ask for DTG or DTF.', { max: 46, size: 21 }) + '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:10px; border-top:1px solid ' + T.line + '; padding-top:20px">\n' +
    h3('Convert to CMYK for litho') + p('The files are sRGB. Ask your printer to convert and send a proof. The golds are the ones to check.', { max: 46, size: 21 }) + '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:10px; border-top:1px solid ' + T.lit + '; padding-top:20px">\n' +
    label('Two things still open') +
    p('Which weight for the classic lockup, 6.5% or 7.7%. And the monogram reads as a word: N beside O can be read as NO. Say the word and I will rework it.', { max: 46, size: 21 }) + '</div>\n' +
    '</div>\n</div>\n', { top: 44 }) +
  foot(FOOT_GL, 28) +
  notes('End on the two open decisions, so she leaves with something to answer rather than only something to admire.'));

/* ------------------------------------------------------------------ 29 */
SLIDES.governance = slide('governance',
  '<img src="' + S('art-print-2') + '" alt="" style="position:absolute; inset:0; width:100%; height:100%;' +
  ' object-fit:cover">\n' +
  '<div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(14,10,19,.94) 0%,' +
  ' rgba(14,10,19,.97) 100%)"></div>\n' +
  '<div style="position:relative; display:flex; flex-direction:column; height:100%">\n' +
  head('Keeping it consistent', 'Who decides', 'One source, one set of checks, and a person to ask.', { dark: true }) +
  body(
    cols([
      h3('One source', true) + p('Every mark comes from one master artwork file. Anything made from a screenshot, a website image or a WhatsApp forward is not the logo.', { dark: true, size: 21 }),
      h3('Sending it out', true) + p('Printers and signwriters get the PDF or SVG. Anyone designing for you gets the SVG and this document. Nobody needs the PNG unless they ask.', { dark: true, size: 21 }),
      h3('Before it goes out', true) + p('Check three things: the mark is not stretched, it has its clear space, and the gold is the deep one if it is being read as text.', { dark: true, size: 21 }),
      h3('When in doubt', true) + p('Ask before you improvise. A five-minute question is cheaper than a reprint, and far cheaper than a sign.', { dark: true, size: 21 })
    ], { grow: true, gap: 16, dark: true }) +
    '<div style="display:flex; gap:14px; align-items:center">' +
    pill('Naledi Zondi', true) + pill('065 838 1532', true) + pill('naledi@nalediart.com', true) +
    '</div>\n', { top: 54, gap: 40 }) +
  '</div>\n' +
  foot('Naledi Art Studio &middot; Brand guidelines &middot; Version 1, 2026', 29, true),
  { dark: true });

/* ------------------------------------------------------------- write it */
const ORDER = ['cover','contents','foundation','voice','origin','problem','digitise','repaint','master',
  'palette','colour-spec','colour-use','type','typescale','primary','classic','suite','marks','layout',
  'photography','clearspace','backgrounds','misuse','web','in-use','stationery','social','files','governance'];

let written = 0;
ORDER.forEach(function (id) {
  if (!SLIDES[id]) { console.error('no slide built for ' + id); process.exit(1); }
  fs.writeFileSync(path.join(OUT, id + '.html'), SLIDES[id]);
  written++;
});

// Any slide file left behind from an earlier order would silently rot.
fs.readdirSync(OUT).forEach(function (f) {
  if (ORDER.indexOf(f.replace('.html', '')) < 0) {
    fs.unlinkSync(path.join(OUT, f));
    console.log('removed stale slide ' + f);
  }
});

// Keep the deck index in step with what was just written.
const deckPath = path.join(__dirname, 'project', 'deck.json');
const deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));
deck.order = ORDER.slice();
fs.writeFileSync(deckPath, JSON.stringify(deck, null, 2) + '\n');

console.log(written + ' slides written in the website design language');

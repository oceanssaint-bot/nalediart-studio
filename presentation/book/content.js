// The book's pages. Reference order: someone opens it with a question and
// should find the answer on one page. The making-of is two pages at the
// back, because it is history now rather than an argument.
const fs = require('fs');
const path = require('path');
const B = require('./build-book.js');
const { T, page, head, body, foot, cols, h3, p, label, rule, table, plate, strip, notes, OUT } = B;

// Uploaded to the guidelines artifact. The website build maps these back to
// local files, so one set of pages serves both.
const I = {
  primary:   '/_blob/ee336129a9c9eec36abaa7f417ae3929',
  reversed:  '/_blob/6b44af12b5b7c3b7d79c4f8238abbbb7',
  classic:   '/_blob/7d1263bab9a104423a3d19d1ce6bfa74',
  badge:     '/_blob/f03b818e9b363be156be1497d10a9b98',
  submark:   '/_blob/1b6f585ecc4ee4399a7f44e025a11687',
  horizontal:'/_blob/fed5003427c7561d5f4a03d90a945715',
  suite:     '/_blob/99a3601039d547562ee70e9f2df86283',
  master:    '/_blob/ce349655d569ea83f1dcbeac2bfec629',
  original:  '/_blob/95283f7f3d04040e155366c29e24a294',
  before:    '/_blob/f46877b8759737de1758702735908acd',
  zoomBefore:'/_blob/c40c7b965c08f98630aab4b0db5f97cf',
  zoomAfter: '/_blob/159d5a7d93511d1d6c30ddc73ae45e39',
  card:      '/_blob/e0cef59fb588eafffba386bc6623fa30',
  signature: '/_blob/1cb0a7181b24eb6d29db41d31d8fc7f7',
  social:    '/_blob/0cb6da2cbb2e9ddd75d8d9f79d1d70b5',
  archDesk:  '/_blob/f8cb4947feb6a8f9ee24749ec0961d8d',
  archProp:  '/_blob/5b77b2a4e73de515461bd48e11193cb6',
  valentine: '/_blob/c3abcca7802d5a7d2e9eb12be619b201',
  print2:    '/_blob/dae4b738c925b67801440e066c28f887',
  sheet:     '/_blob/f660dbb386448c355f5c519b714f3024',
  couple:    '/_blob/b0c3638284c04de3e4d1049b173a0260',
  naledi:    '/_blob/ea30492147fb7c3679c62e95b3231342',
  pampas:    '/_blob/6fc1507d2925b19bbc0b33bbe0c97952',
  velvet:    '/_blob/c92a18983802854eeca80b17c6342ef7',
  arch:      '/_blob/3233813d5d9259e1011cf8f435caf7ab',
  niche:     '/_blob/f00fa3e01771ba4ce02c1fe1daa432b4',
  floor:     '/_blob/f3a014cfb96f82d4d1359a0b5f02a819',
  paintSip:  '/_blob/16831c3e58755eb338d8af53db8f2960',
  event:     '/_blob/9f816083f33d16f403c9ffa6bdd277bf',
  gown:      '/_blob/8fa2acf108cf2e27e3eda1b1413f3856'
};

const PAGES = {};
let no = 0;
const n = () => ++no;

/* ===================================================== front ========== */
PAGES.cover = page('cover',
  '<img src="' + I.event + '" alt="" style="position:absolute; left:0px; top:0px; width:1920px;' +
  ' height:1080px; object-fit:cover">\n' +
  '<div style="position:absolute; left:0px; top:0px; width:1920px; height:1080px;' +
  ' background:rgb(17,12,22); opacity:0.86"></div>\n' +
  '<div style="position:relative; flex:1; display:flex; flex-direction:column; justify-content:space-between">\n' +
  '<p style="font-size:26px; font-weight:500; letter-spacing:6px; text-transform:uppercase; color:' + T.lit + '">Brand guidelines</p>\n' +
  '<div style="display:flex; flex-direction:column; gap:30px">\n' +
  '<h1 style="font-size:150px; font-weight:200; line-height:0.9; letter-spacing:2px;' +
  ' text-transform:uppercase; color:' + T.cream + '">Naledi<br>Art Studio</h1>\n' +
  '<hr style="border:0px; border-top:1px solid rgba(243,237,229,.3)">\n' +
  '<div style="display:flex; align-items:flex-end; justify-content:space-between; gap:60px">\n' +
  '<p style="font-family:' + T.serif + '; font-style:italic; font-size:34px; width:760px; color:' + T.dim + '">How the studio looks, how it speaks, and how to keep it that way.</p>\n' +
  '<img src="' + I.reversed + '" alt="The logo reversed in cream" style="width:340px; height:139px; object-fit:contain">\n' +
  '</div>\n</div>\n</div>\n' +
  foot(0, 'Version 1, October 2026 &middot; Durban', true),
  { dark: true, gap: 0 });

PAGES.contents = page('contents',
  head('', 'Contents', 'Each page answers one question on its own.') +
  body(
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:64px; flex:none">' +
    [[['01','The brand','The studio, voice'],['02','The marks','From the primary to misuse'],
      ['03','Colour','Palette, values, combining them'],['04','Type','Jost Light, the scale']],
     [['05','Layout and image','Space, photography, the rooms'],['06','In use','Website, paper, social'],
      ['07','Running it','The files, who decides'],['','Appendix','Where it came from, how it was remade']]
    ].map(function (col) {
      // One line a chapter. Stacking the title over its description made the
      // eight rows taller than the page, twice.
      return '<div style="display:flex; flex-direction:column; gap:0px">' +
        col.map(function (c) {
          return '<div style="display:grid; grid-template-columns:62px 1fr; gap:14px;' +
            ' align-items:baseline; padding:17px 0px; border-bottom:1px solid ' + T.line + '">' +
            '<p style="font-size:24px; font-weight:500; color:' + T.lit + '">' + c[0] + '</p>' +
            '<p style="font-size:25px; line-height:1.25; color:' + T.ink + '">' + c[1] +
            '<span style="color:' + T.soft + '">&nbsp; &nbsp;' + c[2] + '</span></p>' +
            '</div>';
        }).join('') + '</div>';
    }).join('') + '</div>' +
    p('<b style="font-weight:400">Measured</b> means the number came off the artwork. <b style="font-weight:400">Chosen</b> means it can be revisited.', { size: 24, w: 1600 }),
    { gap: 14 }) +
  foot(n(), 'Contents'));

/* ===================================================== 01 brand ======= */
PAGES.studio = page('studio',
  head('01', 'The studio', 'Art experiences for everyday people, on everyday budgets.', { section: 'The brand' }) +
  body('<div style="display:grid; grid-template-columns:420px 1fr 1fr; gap:64px; flex:1; min-height:0px">\n' +
    plate(I.naledi, 'Naledi Zondi in the studio', '', { h: 660 }) +
    '<div style="display:flex; flex-direction:column; gap:26px">\n' +
    '<p style="font-family:' + T.serif + '; font-style:italic; font-size:34px; line-height:1.4; color:' + T.ink + '">&ldquo;I aim to inspire creativity and offer art experiences for everyday people with everyday budgets. Whether it is a birthday shoot, campaign video, graduation party or podcast set, we do it all.&rdquo;</p>\n' +
    '<p style="font-size:24px; letter-spacing:3px; text-transform:uppercase; color:' + T.faint + '">Naledi Zondi</p>\n' +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:28px">\n' +
    table(['', ''], [
      ['What it is', 'A photography and video studio, a set<br>workshop, an events venue, and an<br>artist&rsquo;s practice'],
      ['Where', '39 Station Drive, Greyville,<br>the makers quarter of Durban'],
      ['Since', '2019'],
      ['Who it is for', 'People making something who need a<br>room that already looks right']
    ], { size: 25, pad: 16, right: false }) +
    '</div>\n</div>\n') +
  foot(n(), 'The brand'));

PAGES.voice = page('voice',
  head('01', 'Voice', 'Warm, plain, never precious. Taken from how she already writes.', { section: 'The brand' }) +
  body(
    cols([
      label('Sounds like us') +
      p('&ldquo;A space designed to be photographed, not a white box.&rdquo;', { color: T.ink }) +
      p('&ldquo;Two extra guests or ten. We will make it work.&rdquo;', { color: T.ink }) +
      p('&ldquo;Tell us what you are making and we will tell you what you need.&rdquo;', { color: T.ink }),
      label('Does not') +
      p('&ldquo;Bespoke curated experiential environments.&rdquo;', { color: T.faint }) +
      p('&ldquo;Unleash your creative journey today!&rdquo;', { color: T.faint }) +
      p('&ldquo;Premium luxury studio solutions.&rdquo;', { color: T.faint }),
      label('Three habits') +
      p('Say the price. R800. R8 500. Hiding it reads as expensive.') +
      p('Short sentences, one idea in each. Full stops rather than dashes.') +
      p('South African English. Colour, organise, metres.')
    ], { gap: 20, grow: true }) +
    rule() +
    p('The work is the impressive part. The words do not need to be.', { size: 28, color: T.ink }),
    { gap: 36 }) +
  foot(n(), 'The brand'));

/* ===================================================== 02 marks ======= */
PAGES.primary = page('primary',
  head('02', 'The primary mark', 'The default. Use this one unless a page says otherwise.', { section: 'The marks' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px; align-items:center">\n' +
    plate(I.primary, 'The primary logo: NALEDI ART STUDIO in two lines, a vertical rule for the I, the portrait in the O', 'The rule stands in for the I. The portrait sits in the O.', { h: 440, fit: 'contain' }) +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    table(['Measured', 'Built'], [
      ['Stem weight', '7.7% of cap'],
      ['Line one ink width', '7.08 &times; cap'],
      ['Leading', '1.36 &times; cap'],
      ['Rule, through both lines', '0.077 cap'],
      ['The O, ring', '0.095 cap']
    ], { size: 26 }) +
    p('Every dimension is a share of the cap height, never a pixel count, so the mark rebuilds exactly at any size. A business card and a building sign are the same drawing.', { w: 620 }) +
    '</div>\n</div>\n') +
  foot(n(), 'The marks'));

PAGES.classic = page('classic',
  head('02', 'The classic lockup', 'For gallery labels, certificates, the back of a print.', { section: 'The marks' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px; align-items:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    table(['Taken from the painting', 'Value'], [
      ['Cap height, share of artwork width', '0.2016'],
      ['Line width, share of artwork width', '1.4562'],
      ['Painted stroke weight', '4.0% of cap'],
      ['Built at', '7.9% of cap']
    ], { size: 26 }) +
    p('The artwork sits above the words, the arrangement she painted. Weight is the one thing changed on purpose: at 4.0% the letters looked starved beside the artwork. It is set in Jost Light, the same stem as the primary, so the two lockups sit together without either looking thin.', { w: 620 }) +
    '</div>\n' +
    plate(I.classic, 'The classic lockup: the portrait above NALEDI ART and EST. 2019', 'A heavier cut in Jost Regular exists if the words should carry more.', { h: 520, fit: 'contain' }) +
    '</div>\n') +
  foot(n(), 'The marks'));

PAGES.family = page('family',
  head('02', 'The family', 'Seventeen files, every one generated from a single artwork.', { section: 'The marks' }) +
  body(plate(I.suite, 'Contact sheet of the logo suite: primary, flush primary, badge, horizontal, submark, monogram, wordmark and the classic lockup', '', { fit: 'contain' }) +
    p('They cannot disagree with one another, because none of them was drawn separately. Change the master and every one of these follows.', { size: 26, w: 1100 }),
    { gap: 26 }) +
  foot(n(), 'The marks'));

PAGES['which-mark'] = page('which-mark',
  head('02', 'Which mark, when', 'Four of the seventeen do almost all the work.', { section: 'The marks' }) +
  body('<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:44px; flex:1; min-height:0px">\n' +
    [[I.primary, 'The primary logo', 'Primary', 'The default. Website header, invoices, proposals, anywhere with room for two lines.'],
     [I.badge, 'The oval Durban badge', 'Badge', 'Stickers, packaging tape, wax seals, the back of a canvas. Carries Durban in the ring.'],
     [I.submark, 'The circular submark', 'Submark', 'Social avatar, favicon, app icon. Anywhere the name is already beside it.'],
     [I.horizontal, 'The horizontal lockup', 'Horizontal', 'Letterhead, email footer, a wide banner, wherever height is short and width is not.']
    ].map(function (m) {
      return '<div style="display:flex; flex-direction:column; gap:22px; min-height:0px">\n' +
        '<img src="' + m[0] + '" alt="' + m[1] + '" style="width:100%; height:380px;' +
        ' object-fit:contain; border-radius:18px; background:' + T.surface + '; padding:28px">\n' +
        h3(m[2]) + p(m[3], { size: 24 }) + '</div>\n';
    }).join('') + '</div>\n') +
  foot(n(), 'The marks'));

PAGES.clearspace = page('clearspace',
  head('02', 'Room and floor', 'How much space it needs, and how small it may go.', { section: 'The marks' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px; align-items:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:28px; min-height:0px">\n' +
    plate(I.primary, 'The primary logo inside its clear space', '', { h: 340, fit: 'contain', bg: T.surface, pad: 30 }) +
    p('Measure the height of a capital N in the mark. Keep that much empty on every side: no type, no photograph edge, no border. For the round marks, keep a quarter of the ring diameter.', { w: 620 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:28px">\n' +
    label('Below these, use a simpler mark') +
    table(['Mark', 'Screen', 'Print'], [
      ['Primary', '120 px wide', '32 mm'],
      ['Horizontal', '180 px wide', '45 mm'],
      ['Badge', '64 px', '18 mm'],
      ['Submark', '32 px', '10 mm']
    ], { size: 26 }) +
    p('The artwork carries fine detail. Under these sizes the sunflowers stop reading as sunflowers and turn to noise. That is when to switch to the submark or the plain-ring wordmark.', { w: 620, size: 24 }) +
    '</div>\n</div>\n') +
  foot(n(), 'The marks'));

PAGES.backgrounds = page('backgrounds',
  head('02', 'Grounds', 'Where it sits happily, and the one place it does not.', { section: 'The marks', dark: true }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px; align-items:center">\n' +
    plate(I.reversed, 'The logo reversed in cream on a dark ground', 'The reversed set is cream, not white. Pure white vibrates against the plum.', { h: 380, fit: 'contain', dark: true }) +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    table(['Ground', 'Use'], [
      ['Cream, white, pale warm greys', 'the standard ink set'],
      ['Deep plum, charcoal, black', 'the reversed cream set'],
      ['A photograph', 'reversed set, quiet areas only']
    ], { size: 25 }) +
    '<div style="display:flex; flex-direction:column; gap:12px">\n' +
    h3('The one real trap', true) +
    p('Her hair is very dark. On a near-black ground the full-colour artwork loses its outline and the head disappears into the background. On dark grounds use the reversed set, or the submark, whose ring holds the edge.', { dark: true, w: 640 }) +
    '</div>\n</div>\n</div>\n') +
  foot(n(), 'The marks', true),
  { dark: true });

PAGES.misuse = page('misuse',
  head('02', 'Please avoid', 'Six ways to undo all of it, none of them hard to miss.', { section: 'The marks' }) +
  body('<div style="display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:1fr 1fr; gap:8px; flex:1; min-height:0px">\n' +
    [['Stretching it', 'Scale from a corner, holding proportion. A squashed face is the first thing anyone sees.'],
     ['Recolouring the artwork', 'Only the lettering and the rule may change colour.'],
     ['Re-typing the words', 'The spacing is measured, not typed. Use the supplied files.'],
     ['Adding effects', 'No shadows, outlines, glows or bevels.'],
     ['Cropping the O', 'The artwork sits inside that circle on purpose.'],
     ['Rebuilding from a screenshot', 'Always start from the supplied SVG or PDF.']
    ].map(function (m, i) {
      return '<div style="display:flex; flex-direction:column; gap:14px; border-top:1px solid ' + T.line +
        '; padding:16px 0px 0px 0px">\n' +
        '<p style="font-size:26px; font-weight:200; color:' + T.lit + '">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</p>\n' +
        h3(m[0]) + p(m[1], { size: 24 }) + '</div>\n';
    }).join('') + '</div>\n') +
  foot(n(), 'The marks'));

/* ===================================================== 03 colour ====== */
const SW = [['Sunflower', '#D29E38', T.ink], ['Skin', '#AA6B3C', T.cream], ['Plum', '#40284D', T.cream],
            ['Blossom', '#CF8598', T.ink], ['Leaf', '#44623E', T.cream], ['Ink', '#241C2C', T.cream]];
PAGES.palette = page('palette',
  head('03', 'The palette', 'Taken out of the painting, not chosen next to it.', { section: 'Colour' }) +
  body('<div style="display:grid; grid-template-columns:repeat(6,1fr); gap:18px; flex:1; min-height:0px">\n' +
    SW.map(function (s) {
      return '<div style="border-radius:18px; background:' + s[1] + '; color:' + s[2] +
        '; display:flex; flex-direction:column; justify-content:flex-end; padding:34px; gap:6px">\n' +
        '<p style="font-size:28px">' + s[0] + '</p>\n' +
        '<p style="font-size:24px; color:' + s[2] + '; opacity:0.75">' + s[1] + '</p>\n</div>\n';
    }).join('') + '</div>\n' +
    p('Each one is the median of thousands of pixels of that hue in the artwork itself, so the brand colours and the painting can never drift apart. Medians, not averages, so a few stray pixels cannot pull a colour off.', { size: 26, w: 1400 }),
    { gap: 34 }) +
  foot(n(), 'Colour'));

PAGES['colour-spec'] = page('colour-spec',
  head('03', 'Every value', 'What a printer will ask for, in one place.', { section: 'Colour' }) +
  body(table(['Name', 'HEX', 'RGB', 'CMYK', 'Role'], [
      ['Ink', '#241C2C', '36 28 44', '18 36 0 83', 'Primary dark'],
      ['Paper', '#FBF8F4', '251 248 244', '0 1 3 2', 'Primary light'],
      ['Night', '#16111D', '22 17 29', '24 41 0 89', 'Dark ground'],
      ['Sunflower', '#D29E38', '210 158 56', '0 25 73 18', 'Accent, as a shape'],
      ['Sunflower Deep', '#8A6010', '138 96 16', '0 30 88 46', 'Accent, as text'],
      ['Plum', '#40284D', '64 40 77', '17 48 0 70', 'Secondary'],
      ['Blossom', '#CF8598', '207 133 152', '0 36 27 19', 'Supporting'],
      ['Leaf', '#44623E', '68 98 62', '31 0 37 62', 'Supporting'],
      ['Skin', '#AA6B3C', '170 107 60', '0 37 65 33', 'Supporting']
    ], { size: 24, pad: 9 }) +
    p('CMYK is a straight conversion, not a press profile. Ask the printer to proof on the actual stock before a long run: the golds are the ones that shift.', { size: 24, w: 1600 }),
    { gap: 22 }) +
  foot(n(), 'Colour'));

PAGES['colour-use'] = page('colour-use',
  head('03', 'Combining them', 'Two grounds, one accent, used sparingly. Roughly 70 / 22 / 8.', { section: 'Colour' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px">\n' +
    '<div style="display:flex; flex-direction:column; gap:26px; min-height:0px">\n' +
    '<div style="flex:1; min-height:0px; display:grid; grid-template-columns:70fr 22fr 8fr; gap:12px">\n' +
    '<div style="background:' + T.paper + '; border:1px solid ' + T.line + '; border-radius:18px"></div>\n' +
    '<div style="background:' + T.ink + '; border-radius:18px"></div>\n' +
    '<div style="background:' + T.lit + '; border-radius:18px"></div>\n</div>\n' +
    p('Mostly paper, ink for everything that is read, and only a little gold. Gold stops working the moment there is a lot of it. On a dark ground: Night, cream type, the lighter gold for accents, and never pure white, which glares.', { w: 660 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:22px; min-height:0px">\n' +
    label('Legibility, as numbers') +
    table(['Pairing', 'Contrast', 'Safe for'], [
      ['Ink on Paper', '15.5 : 1', 'Anything, any size'],
      ['Paper on Night', '17.5 : 1', 'Anything, any size'],
      ['Plum on Paper', '12.2 : 1', 'Anything, any size'],
      ['Sunflower Deep on Paper', '5.3 : 1', 'Small text and labels'],
      ['Sunflower on Night', '7.7 : 1', 'Small text and labels'],
      ['Sunflower on Paper', '2.3 : 1', 'Shapes only, never text']
    ], { size: 24, pad: 10 }) +
    p('That last row is the trap. The bright gold looks right on a pale ground and fails as reading text. Use Sunflower Deep wherever gold has to be read.', { w: 660, size: 24 }) +
    '</div>\n</div>\n') +
  foot(n(), 'Colour'));

/* ===================================================== 04 type ======== */
PAGES.type = page('type',
  head('04', 'Jost Light', 'One typeface, free to use, measured against her own letters.', { section: 'Type' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px">\n' +
    '<div style="display:flex; flex-direction:column; gap:28px">\n' +
    '<p style="font-size:92px; font-weight:200; line-height:0.9; letter-spacing:2px; text-transform:uppercase; color:' + T.ink + '">Naledi</p>\n' +
    table(['Measured', 'Hers', 'Jost', 'Gotham'], [
      ['Stem weight', '7.7%', '7.9%', '7.1%'],
      ['Width of NALEDART', '7.10', '6.63', '7.04']
    ], { size: 26 }) +
    p('Jost is the closer match on weight, which is the harder thing to fake. It sets narrower, so the lockup is tracked out to land on the measured width exactly.', { w: 640 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:36px; justify-content:center">\n' +
    '<div style="display:flex; flex-direction:column; gap:14px; border-top:1px solid ' + T.line + '; padding:28px 0px 0px 0px">\n' +
    label('Free to use') +
    p('Jost is published under the SIL Open Font License. Use it in the logo, on signage, in documents and on the website, and so can anyone the brand is handed to. Nothing to buy and nothing to renew.', { w: 620 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:14px; border-top:1px solid ' + T.line + '; padding:28px 0px 0px 0px">\n' +
    '<p style="font-size:24px; font-weight:500; letter-spacing:4px; text-transform:uppercase; color:' + T.faint + '">One face, everywhere</p>\n' +
    p('The marks, the website and this book are all set in it, so nothing can drift apart and there is no licence to manage.', { w: 620 }) +
    '</div>\n</div>\n</div>\n') +
  foot(n(), 'Type'));

PAGES.typescale = page('typescale',
  head('04', 'The scale', 'Five sizes, reused everywhere, with nothing invented in between.', { section: 'Type' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px">\n' +
    '<div style="display:flex; flex-direction:column; gap:13px; justify-content:center">\n' +
    '<p style="font-size:54px; font-weight:200; line-height:1.05; text-transform:uppercase; letter-spacing:1px; color:' + T.ink + '">Display</p>\n' +
    '<p style="font-size:38px; font-weight:300; line-height:1.1; color:' + T.ink + '">Section heading</p>\n' +
    '<p style="font-size:30px; font-weight:500; line-height:1.2; color:' + T.ink + '">Subheading</p>\n' +
    '<p style="font-size:26px; line-height:1.5; color:' + T.soft + '; width:600px">Body copy, set at a comfortable measure and never wider than about seventy characters.</p>\n' +
    '<p style="font-size:24px; font-weight:500; letter-spacing:4px; text-transform:uppercase; color:' + T.gold + '">Label</p>\n' +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    table(['Role', 'Size', 'Weight', 'Line height'], [
      ['Display', '68 px', '200', '1.05'],
      ['Heading', '42 px', '300', '1.10'],
      ['Subheading', '28 px', '500', '1.20'],
      ['Body', '24 px', '400', '1.50'],
      ['Label', '20 px', '500', '1.30']
    ], { size: 24, pad: 6 }) +
    '<div style="display:flex; flex-direction:column; gap:10px">\n' +
    label('What holds it together') +
    p('Emphasise with weight, italic or colour, never by inventing a sixth size. Labels are uppercase with generous letter-spacing; nothing else is uppercase. Body text stops at about seventy characters a line.', { w: 620, size: 24 }) +
    '</div>\n</div>\n</div>\n') +
  foot(n(), 'Type'));

/* ============================================ 05 layout and image ===== */
PAGES.layout = page('layout',
  head('05', 'Space', 'The artwork is busy. Everything around it should not be.', { section: 'Layout and image' }) +
  body(
    cols([
      h3('The spacing scale') + p('4, 8, 12, 18, 24, 32, 44, 68, 104. Pick from the scale rather than typing a number. Gaps that are nearly the same read as mistakes.', { size: 24 }),
      h3('Margins grow') + p('Phone 18px, tablet 28px, laptop 48px, large screen 72px and up. A margin that stays fixed makes a big screen look like a small one stretched.', { size: 24 }),
      h3('Measured text') + p('Images and panels may run the whole width. Paragraphs stop at about 58 characters, headings at about 20. Past that the eye loses its place.', { size: 24 }),
      h3('One alignment') + p('Left aligned, ragged right. Centred type only inside a badge or a stamp, where the shape is doing the centring.', { size: 24 })
    ], { grow: true, gap: 18 }) +
    rule() +
    p('Give the page more air than feels necessary and the work carries itself.', { size: 30, color: T.ink }),
    { gap: 36 }) +
  foot(n(), 'Layout and image'));

PAGES.photography = page('photography',
  head('05', 'Photography', 'Warm light, real rooms, people actually doing something.', { section: 'Layout and image' }) +
  body(
    strip([[I.floor, 'The raw studio floor with tall factory windows', 'The floor, unstyled'],
           [I.arch, 'The arched plaster set with built niches', 'The arch set'],
           [I.couple, 'A couple photographed in the dressed arch set', 'A shoot in the set'],
           [I.archProp, 'The arch dressed with florals and candles for a proposal', 'Dressed for a proposal'],
           [I.gown, 'A portrait shoot in a yellow gown on hay bales', 'A portrait shoot'],
           [I.pampas, 'A styled shoot with pampas grass and hessian sacks', 'A styled shoot']]) +
    cols([
      h3('Do') + p('Daylight where you can. Show the room as it is, concrete and plaster included. Let people be mid-action rather than posed at the camera.', { size: 24 }),
      h3('Avoid') + p('Heavy filters, cold blue casts, and stock photography of anyone who has never been in the building. The rooms are the proof.', { size: 24 }),
      h3('Crop') + p('Wide enough to read the space. A tight crop on a prop tells nobody what they would be hiring.', { size: 24 })
    ], { gap: 12 }),
    { gap: 32 }) +
  foot(n(), 'Layout and image'));

PAGES.rooms = page('rooms',
  head('05', 'The rooms', 'What the studio actually has, and what each room is for.', { section: 'Layout and image', dark: true }) +
  body(
    strip([[I.velvet, 'A deep red velvet backdrop hung in the studio', 'Backdrops &middot; studio hire'],
           [I.archDesk, 'The arch reworked as a desk for a podcast set', 'Builds &middot; set design'],
           [I.niche, 'The niche wall built for a set', 'The niche wall &middot; set design'],
           [I.paintSip, 'A paint and sip class at easels in the studio', 'Groups &middot; art experiences']], { dark: true }) +
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px">\n' +
    p('Every photograph in this book and on the website is one of hers. Nothing is stock and nothing was staged for the brand. The palette was taken from her painting, so the rooms and the marks already agree with each other.', { dark: true, w: 740 }) +
    p('When the work changes, the photographs change and nothing else has to. Drop new frames into the same shapes: three to a row on the site, four across here.', { dark: true, w: 740 }) +
    '</div>\n',
    { gap: 32 }) +
  foot(n(), 'Layout and image', true),
  { dark: true });

/* ===================================================== 06 in use ====== */
PAGES.web = page('web',
  head('06', 'The website', 'The first full application of everything in this book.', { section: 'In use' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px">\n' +
    '<div style="display:flex; flex-direction:column; gap:28px; min-height:0px">\n' +
    strip([[I.niche, 'The niche wall built for a set', ''], [I.sheet, 'Eternal Valentine, 80 by 95 cm', '']]) +
    p('The palette, the type scale, the marks, the spacing and the photography are all in use there. To see a rule working, look at the site. It is mobile first, because that is how almost everyone arrives.', { w: 660 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; justify-content:center; gap:26px">\n' +
    ['Booking leads', 'Service, date, time and details are the first thing on the page. Three questions fold out above it for anyone unsure what they need.',
     'A booking holds its slot', 'A request blocks the time immediately, so nobody can double book it, and unconfirmed requests release themselves after 48 hours.'
    ].reduce(function (acc, v, i, a) {
      if (i % 2) return acc;
      return acc + '<div style="display:flex; flex-direction:column; gap:10px; border-top:1px solid ' + T.line +
        '; padding:22px 0px 0px 0px">\n' + h3(v) + p(a[i + 1], { size: 24, w: 640 }) + '</div>\n';
    }, '') +
    '</div>\n</div>\n') +
  foot(n(), 'In use'));

PAGES.stationery = page('stationery',
  head('06', 'On paper', 'Built from the supplied files, with nothing redrawn.', { section: 'In use' }) +
  body(
    strip([[I.card, 'Business card, both faces: the reversed logo on Night, and contact details on Paper with the oval badge', 'Card, both faces'],
           [I.signature, 'Email signature: the horizontal lockup above name and contact details', 'Email signature']], { fit: 'contain' }) +
    cols([
      h3('Specifications') + p('Card 85 &times; 55 mm, 400gsm uncoated. Uncoated matters: the artwork has texture and a gloss stock fights it. Email signature 620px wide, the horizontal lockup above a hairline rule.', { size: 24 }),
      h3('One mark a face') + p('The reversed mark goes on the dark face, the oval badge on the light one. Never both marks on the same face.', { size: 24 })
    ], { gap: 12 }),
    { gap: 30 }) +
  foot(n(), 'In use'));

PAGES.social = page('social',
  head('06', 'Social', 'One mark, one ground, and the handle everywhere.', { section: 'In use' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px; align-items:center">\n' +
    plate(I.social, 'Social avatar: the submark on a sunflower ground, and the oval badge as a sticker on cream', '', { h: 440, fit: 'contain' }) +
    '<div style="display:flex; flex-direction:column; gap:30px">\n' +
    table(['Where', 'Use'], [
      ['Profile picture', 'Submark on Sunflower'],
      ['Favicon and app icon', 'Submark, 180 px'],
      ['Stickers and packaging', 'Oval badge on Paper'],
      ['Post with a photograph', 'Reversed mark, bottom left']
    ], { size: 24, pad: 10 }) +
    '<div style="display:flex; flex-direction:column; gap:10px">\n' +
    label('The handle') +
    '<p style="font-size:38px; font-weight:200; color:' + T.ink + '">@nalediart_studio</p>\n' +
    p('Everywhere, with the booking link in the bio rather than an email address.', { w: 640, size: 24 }) +
    '</div>\n</div>\n</div>\n') +
  foot(n(), 'In use'));

/* ===================================================== 07 running ===== */
PAGES.files = page('files',
  head('07', 'The files', 'Four formats, and which one to send where.', { section: 'Running it' }) +
  body('<div style="display:grid; grid-template-columns:1fr 1fr; gap:80px; flex:1; min-height:0px">\n' +
    '<div style="display:flex; flex-direction:column; gap:28px">\n' +
    table(['Format', 'Send it to'], [
      ['SVG', 'The web, and any designer'],
      ['PDF', 'Printers, signwriters, embroiderers'],
      ['PNG', 'Documents and social, several sizes'],
      ['AI', 'The editable master artwork']
    ], { size: 26 }) +
    p('Every file renders with no fonts installed, so a printer who owns nothing still gets the right letters. The typeface is free in any case.', { w: 640, size: 24 }) +
    '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:16px">\n' +
    '<div style="display:flex; flex-direction:column; gap:8px; border-top:1px solid ' + T.line + '; padding:16px 0px 0px 0px">\n' +
    h3('Digital print, not screen print') + p('Over two thousand colours cannot be separated into spot inks. For fabric, ask for DTG or DTF.', { size: 24, w: 620 }) + '</div>\n' +
    '<div style="display:flex; flex-direction:column; gap:10px; border-top:1px solid ' + T.line + '; padding:22px 0px 0px 0px">\n' +
    h3('Convert to CMYK for litho') + p('The files are sRGB. Ask the printer to convert and send a proof. The golds are the ones to check.', { size: 24, w: 620 }) + '</div>\n' +
    '</div>\n</div>\n') +
  foot(n(), 'Running it'));

PAGES.governance = page('governance',
  head('07', 'Who decides', 'One source, three checks, and a person to ask.', { section: 'Running it', dark: true }) +
  body(
    cols([
      h3('One source', true) + p('Every mark comes from one master artwork file. Anything made from a screenshot, a website image or a forwarded message is not the logo.', { dark: true, size: 24 }),
      h3('Sending it out', true) + p('Printers and signwriters get the PDF or SVG. Anyone designing gets the SVG and this book. Nobody needs the PNG unless they ask.', { dark: true, size: 24 }),
      h3('Before it goes out', true) + p('Check three things: the mark is not stretched, it has its clear space, and the gold is the deep one if it is being read as text.', { dark: true, size: 24 }),
      h3('When in doubt', true) + p('Ask before improvising. A five-minute question is cheaper than a reprint, and far cheaper than a sign.', { dark: true, size: 24 })
    ], { grow: true, gap: 16, dark: true }) +
    '<div style="display:flex; gap:18px; align-items:center">\n' +
    ['Naledi Zondi', '065 838 1532', 'naledi@nalediart.com'].map(function (t) {
      return '<p style="font-size:24px; letter-spacing:3px; text-transform:uppercase; color:' + T.cream +
        '; border:1px solid rgba(243,237,229,.3); border-radius:999px; padding:14px 28px">' + t + '</p>\n';
    }).join('') + '</div>\n',
    { gap: 36 }) +
  foot(n(), 'Running it', true),
  { dark: true });

/* ================================================ appendix ============ */
PAGES.origin = page('origin',
  head('', 'Where it came from', 'Kept for the record. Nothing on this page needs acting on.', { section: 'Appendix' }) +
  body('<div style="display:grid; grid-template-columns:520px 1fr; gap:80px; flex:1; min-height:0px">\n' +
    plate(I.original, 'The original logo file: a small faded painting above the words NALEDI ART, surrounded by empty white space', 'The file as it arrived', { bg: T.surface, fit: 'contain', h: 540 }) +
    '<div style="display:flex; flex-direction:column; justify-content:center; gap:24px">\n' +
    table(['Measured off the original', 'Value'], [
      ['The file itself', '858 &times; 1144 px'],
      ['The artwork inside it', '418 &times; 418 px'],
      ['Height of the whole wordmark', '17 px']
    ], { size: 24, pad: 9 }) +
    p('Seventeen pixels for two lines of type. At that size the letters are not letters, they are grey pixels in a row. The cut-out had left a halo on every edge, and the hair and several sunflowers stopped where the eraser stopped.', { w: 700 }) +
    '</div>\n</div>\n') +
  foot(n(), 'Appendix'));

PAGES.remade = page('remade',
  head('', 'How it was remade', 'Redrawn as shapes, repainted by hand, then measured.', { section: 'Appendix' }) +
  body(
    strip([[I.zoomBefore, 'Detail of the original: pixelated sunflowers with a grey halo bleeding around the hair', 'Before'],
           [I.zoomAfter, 'The same detail repainted: clean petal edges, solid dark hair, saturated gold', 'After'],
           [I.master, 'The finished master artwork', 'The master, 3,448 shapes']]) +
    cols([
      h3('Digitised') + p('Every brushstroke became an outline with its own colour. It has no resolution, so it is sharp at any size.', { size: 24 }),
      h3('Repainted') + p('The halo painted out edge by edge, the hair carried back to where it ends, cut flowers redrawn to full petals, the golds returned to the strength of the painting.', { size: 24 }),
      h3('Measured') + p('The type was then set to numbers taken off her own artwork rather than to taste, which is why every page in chapter two quotes a figure.', { size: 24 })
    ], { gap: 12 }),
    { gap: 32 }) +
  foot(n(), 'Appendix'));

/* ------------------------------------------------------------- write --- */
const ORDER = ['cover', 'contents', 'studio', 'voice', 'primary', 'classic', 'family',
  'which-mark', 'clearspace', 'backgrounds', 'misuse', 'palette', 'colour-spec',
  'colour-use', 'type', 'typescale', 'layout', 'photography', 'rooms', 'web',
  'stationery', 'social', 'files', 'governance', 'origin', 'remade'];

let written = 0;
ORDER.forEach(function (id) {
  if (!PAGES[id]) { console.error('no page built for ' + id); process.exit(1); }
  fs.writeFileSync(path.join(OUT, id + '.html'), PAGES[id]);
  written++;
});
fs.readdirSync(OUT).forEach(function (f) {
  if (ORDER.indexOf(f.replace('.html', '')) < 0) fs.unlinkSync(path.join(OUT, f));
});

fs.writeFileSync(path.join(__dirname, 'order.json'), JSON.stringify({ order: ORDER }, null, 2) + '\n');
console.log(written + ' pages written to ' + path.relative(process.cwd(), OUT).replace(/\\/g, '/'));

// Writes the brand-guideline slides that were added to the original deck.
// Kept as a script because these are long HTML strings and shell heredocs
// mangle apostrophes.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'project', 'slides');

const S = {};

S.contents = `<section id="contents" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:128px 128px 160px; display:flex; flex-direction:column; gap:44px">
<div style="display:flex; flex-direction:column; gap:14px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Brand guidelines</p>
<h2 style="font-size:64px; font-weight:400; line-height:1.1">What is in this document.</h2>
</div>
<div style="display:flex; flex-direction:row; gap:26px">
<div style="flex:1; display:flex; flex-direction:column; gap:14px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:40px">
<p style="font-size:58px; font-weight:300; color:#D29E38">01</p>
<h3 style="font-size:32px; font-weight:500">The brand</h3>
<p style="font-size:24px; color:#6A5F74; line-height:1.45">What the studio is, how it speaks, and where the logo came from.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:14px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:40px">
<p style="font-size:58px; font-weight:300; color:#D29E38">02</p>
<h3 style="font-size:32px; font-weight:500">The system</h3>
<p style="font-size:24px; color:#6A5F74; line-height:1.45">Colour, typography, the marks, layout and photography.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:14px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:40px">
<p style="font-size:58px; font-weight:300; color:#D29E38">03</p>
<h3 style="font-size:32px; font-weight:500">Using it</h3>
<p style="font-size:24px; color:#6A5F74; line-height:1.45">Clear space, minimum sizes, backgrounds, and what not to do.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:14px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:40px">
<p style="font-size:58px; font-weight:300; color:#D29E38">04</p>
<h3 style="font-size:32px; font-weight:500">In the world</h3>
<p style="font-size:24px; color:#6A5F74; line-height:1.45">Website, stationery, social, the files, and who decides.</p>
</div>
</div>
<p style="font-family:'Newsreader', Georgia, serif; font-size:30px; font-style:italic; font-weight:300; color:#6A5F74; max-width:74ch; line-height:1.4">Where a page says <b style="font-style:normal">measured</b>, the number was taken off your own artwork or your existing logo. Where it says <b style="font-style:normal">proposed</b>, it is a recommendation you can accept or change.</p>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.foundation = `<section id="foundation" style="background:#16111D; color:#F3EDE5; font-family:'Jost', 'Century Gothic', sans-serif; padding:128px; display:flex; flex-direction:row; gap:88px; align-items:center">
<div style="flex:1; display:flex; flex-direction:column; gap:30px">
<p style="font-size:24px; letter-spacing:4px; color:#E2B155; text-transform:uppercase">The studio</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1; color:#F3EDE5">Art experiences for everyday people.</h2>
<p style="font-family:'Newsreader', Georgia, serif; font-size:32px; font-style:italic; font-weight:300; color:#AFA3B9; line-height:1.45">&ldquo;I aim to inspire creativity and offer art experiences for everyday people with everyday budgets. Whether it is a birthday shoot, campaign video, graduation party or podcast set, we do it all.&rdquo;</p>
<p style="font-size:24px; color:#7C7088">Naledi Zondi, in her own words</p>
</div>
<div style="width:700px; display:flex; flex-direction:column; gap:18px">
<div style="background:#1E1828; border-radius:14px; padding:32px; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:28px; font-weight:500; color:#E2B155">What it does</h3>
<p style="font-size:24px; color:#AFA3B9; line-height:1.45">A photography and video studio for hire, custom set design and props, an events venue, and original art and prints.</p>
</div>
<div style="background:#1E1828; border-radius:14px; padding:32px; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:28px; font-weight:500; color:#E2B155">Where</h3>
<p style="font-size:24px; color:#AFA3B9; line-height:1.45">39 Station Drive, Greyville, the Station Drive precinct, the makers quarter of Durban. Established 2019.</p>
</div>
<div style="background:#1E1828; border-radius:14px; padding:32px; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:28px; font-weight:500; color:#E2B155">Who it is for</h3>
<p style="font-size:24px; color:#AFA3B9; line-height:1.45">People making something who need a room that already looks right, rather than a white box they have to dress themselves.</p>
</div>
</div>
</section>`;

S.voice = `<section id="voice" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:128px 128px 160px; display:flex; flex-direction:column; gap:36px">
<div style="display:flex; flex-direction:column; gap:14px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Voice &middot; proposed</p>
<h2 style="font-size:64px; font-weight:400; line-height:1.1">Warm, plain, never precious.</h2>
</div>
<p style="font-size:28px; color:#6A5F74; line-height:1.5; max-width:88ch">Drawn from how you already write. You say &ldquo;we do it all&rdquo; and &ldquo;everyday budgets&rdquo;, welcoming, unfussy, confident without posturing. Keep that. The work is the impressive part; the words do not need to be.</p>
<div style="display:flex; flex-direction:row; gap:24px">
<div style="flex:1; display:flex; flex-direction:column; gap:18px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:40px">
<h3 style="font-size:30px; font-weight:500; color:#44623E">Sounds like us</h3>
<p style="font-size:25px; color:#241C2C; line-height:1.4">&ldquo;A space designed to be photographed, not a white box.&rdquo;</p>
<p style="font-size:25px; color:#241C2C; line-height:1.4">&ldquo;Two extra guests or ten. We will make it work.&rdquo;</p>
<p style="font-size:25px; color:#241C2C; line-height:1.4">&ldquo;Tell us what you are making and we will tell you what you need.&rdquo;</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:18px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:40px">
<h3 style="font-size:30px; font-weight:500; color:#C0687F">Does not</h3>
<p style="font-size:25px; color:#9A8FA3; line-height:1.4">&ldquo;Bespoke curated experiential environments.&rdquo;</p>
<p style="font-size:25px; color:#9A8FA3; line-height:1.4">&ldquo;Unleash your creative journey today!&rdquo;</p>
<p style="font-size:25px; color:#9A8FA3; line-height:1.4">&ldquo;Premium luxury studio solutions.&rdquo;</p>
</div>
</div>
<div style="display:flex; flex-direction:row; gap:48px">
<p style="font-size:24px; color:#6A5F74; line-height:1.5; flex:1"><b style="color:#241C2C">Say the price.</b> R800. R8 500. Hiding it reads as expensive.</p>
<p style="font-size:24px; color:#6A5F74; line-height:1.5; flex:1"><b style="color:#241C2C">Short sentences.</b> One idea in each. Full stops rather than dashes.</p>
<p style="font-size:24px; color:#6A5F74; line-height:1.5; flex:1"><b style="color:#241C2C">South African English.</b> Colour, organise, metres.</p>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

const SWATCH = (name, hex, note, dark) => `<div style="flex:1; display:flex; flex-direction:column; gap:10px">
<div style="background:${hex}; height:150px; border-radius:12px; border:1px solid ${dark ? '#322A40' : '#E6DCD2'}"></div>
<p style="font-size:25px; font-weight:500">${name}</p>
<p style="font-size:22px; color:#6A5F74">${hex}</p>
<p style="font-size:20px; color:#9A8FA3; line-height:1.35">${note}</p>
</div>`;

S['colour-spec'] = `<section id="colour-spec" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:column; gap:34px">
<div style="display:flex; flex-direction:column; gap:12px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Colour &middot; specification</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Every value a printer will ask for.</h2>
</div>
<table style="font-family:'Jost', sans-serif; font-size:24px; color:#241C2C">
<tr><th style="width:24%; text-align:left; font-weight:500">Name</th><th style="width:15%; text-align:left; font-weight:500">HEX</th><th style="width:20%; text-align:left; font-weight:500">RGB</th><th style="width:21%; text-align:left; font-weight:500">CMYK</th><th style="width:20%; text-align:left; font-weight:500">Role</th></tr>
<tr><td>Ink</td><td>#241C2C</td><td>36 28 44</td><td>18 36 0 83</td><td>Primary dark</td></tr>
<tr><td>Paper</td><td>#FBF8F4</td><td>251 248 244</td><td>0 1 3 2</td><td>Primary light</td></tr>
<tr><td>Night</td><td>#16111D</td><td>22 17 29</td><td>24 41 0 89</td><td>Dark ground</td></tr>
<tr><td>Sunflower</td><td>#D29E38</td><td>210 158 56</td><td>0 25 73 18</td><td>Accent, graphic</td></tr>
<tr><td>Sunflower Deep</td><td>#8A6010</td><td>138 96 16</td><td>0 30 88 46</td><td>Accent, as text</td></tr>
<tr><td>Plum</td><td>#40284D</td><td>64 40 77</td><td>17 48 0 70</td><td>Secondary</td></tr>
<tr><td>Blossom</td><td>#CF8598</td><td>207 133 152</td><td>0 36 27 19</td><td>Supporting</td></tr>
<tr><td>Leaf</td><td>#44623E</td><td>68 98 62</td><td>31 0 37 62</td><td>Supporting</td></tr>
<tr><td>Skin</td><td>#AA6B3C</td><td>170 107 60</td><td>0 37 65 33</td><td>Supporting</td></tr>
</table>
<p style="font-size:24px; color:#6A5F74; line-height:1.45; max-width:92ch">CMYK is a straight conversion, not a press profile. Ask your printer to proof it on the actual stock before a long run, the golds are the ones that shift.</p>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S['colour-use'] = `<section id="colour-use" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:column; gap:34px">
<div style="display:flex; flex-direction:column; gap:12px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Colour &middot; how to combine</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Two grounds, one accent, used sparingly.</h2>
</div>
<div style="display:flex; flex-direction:row; gap:28px">
<div style="flex:1; display:flex; flex-direction:column; gap:16px">
<div style="display:flex; flex-direction:row; height:90px; border-radius:12px; overflow:hidden; border:1px solid #E6DCD2">
<div style="width:70%; background:#FBF8F4"></div><div style="width:22%; background:#241C2C"></div><div style="width:8%; background:#D29E38"></div>
</div>
<p style="font-size:24px; color:#6A5F74; line-height:1.45"><b style="color:#241C2C">Roughly 70 / 22 / 8.</b> Mostly paper, ink for everything you read, and only a little gold. The gold stops working the moment there is a lot of it.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:16px">
<div style="display:flex; flex-direction:row; height:90px; border-radius:12px; overflow:hidden">
<div style="width:70%; background:#16111D"></div><div style="width:22%; background:#F3EDE5"></div><div style="width:8%; background:#E2B155"></div>
</div>
<p style="font-size:24px; color:#6A5F74; line-height:1.45"><b style="color:#241C2C">The same on dark.</b> Night ground, cream type, the lighter gold for accents. Never pure white on Night; it glares.</p>
</div>
</div>
<div style="display:flex; flex-direction:column; gap:14px">
<h3 style="font-size:30px; font-weight:500">Legibility, as numbers</h3>
<table style="font-family:'Jost', sans-serif; font-size:24px; color:#241C2C">
<tr><th style="width:44%; text-align:left; font-weight:500">Pairing</th><th style="width:20%; text-align:right; font-weight:500">Contrast</th><th style="width:36%; text-align:left; font-weight:500">Safe for</th></tr>
<tr><td>Ink on Paper</td><td style="text-align:right">15.5 : 1</td><td>Anything, any size</td></tr>
<tr><td>Paper on Night</td><td style="text-align:right">17.5 : 1</td><td>Anything, any size</td></tr>
<tr><td>Plum on Paper</td><td style="text-align:right">12.2 : 1</td><td>Anything, any size</td></tr>
<tr><td>Sunflower Deep on Paper</td><td style="text-align:right">5.3 : 1</td><td>Small text and labels</td></tr>
<tr><td>Sunflower on Night</td><td style="text-align:right">7.7 : 1</td><td>Small text and labels</td></tr>
<tr><td>Sunflower on Paper</td><td style="text-align:right">2.3 : 1</td><td>Shapes and rules only, never text</td></tr>
</table>
</div>
<p style="font-size:23px; color:#6A5F74; line-height:1.45; max-width:94ch">That last row is the trap. The bright gold looks right on a pale ground but fails as reading text. Use Sunflower Deep when gold has to be read.</p>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.typescale = `<section id="typescale" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:row; gap:72px">
<div style="flex:1; display:flex; flex-direction:column; gap:22px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Typography &middot; the scale</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Five sizes, reused everywhere.</h2>
<p style="font-size:68px; font-weight:400; line-height:1.05; letter-spacing:-0.02em">Display</p>
<p style="font-size:42px; font-weight:400; line-height:1.1">Section heading</p>
<p style="font-size:28px; font-weight:500; line-height:1.2">Subheading</p>
<p style="font-size:24px; color:#6A5F74; line-height:1.5">Body copy, set at a comfortable measure and never wider than about seventy characters.</p>
<p style="font-size:20px; letter-spacing:3px; color:#8A6010; text-transform:uppercase">Label</p>
</div>
<div style="width:760px; display:flex; flex-direction:column; gap:22px">
<table style="font-family:'Jost', sans-serif; font-size:23px; color:#241C2C">
<tr><th style="width:28%; text-align:left; font-weight:500">Role</th><th style="width:20%; text-align:right; font-weight:500">Size</th><th style="width:22%; text-align:right; font-weight:500">Weight</th><th style="width:30%; text-align:right; font-weight:500">Line height</th></tr>
<tr><td>Display</td><td style="text-align:right">68 px</td><td style="text-align:right">400</td><td style="text-align:right">1.05</td></tr>
<tr><td>Heading</td><td style="text-align:right">42 px</td><td style="text-align:right">400</td><td style="text-align:right">1.10</td></tr>
<tr><td>Subheading</td><td style="text-align:right">28 px</td><td style="text-align:right">500</td><td style="text-align:right">1.20</td></tr>
<tr><td>Body</td><td style="text-align:right">24 px</td><td style="text-align:right">400</td><td style="text-align:right">1.50</td></tr>
<tr><td>Label</td><td style="text-align:right">20 px</td><td style="text-align:right">500</td><td style="text-align:right">1.30</td></tr>
</table>
<div style="background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:34px; display:flex; flex-direction:column; gap:12px">
<h3 style="font-size:28px; font-weight:500">Rules that hold it together</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Emphasise with weight, italic or colour, never by inventing a sixth size. Labels are uppercase with generous letter-spacing; nothing else is uppercase. Body text stops at about 70 characters a line.</p>
</div>
<div style="background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:34px; display:flex; flex-direction:column; gap:12px">
<h3 style="font-size:28px; font-weight:500">On screen</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">The website uses Jost, a geometric face close to the logo letters and free to embed. Gotham Narrow stays for the marks; Jost carries the running text.</p>
</div>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.layout = `<section id="layout" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:row; gap:72px; align-items:center">
<div style="flex:1; display:flex; flex-direction:column; gap:26px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Layout</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Space is the material.</h2>
<p style="font-size:26px; color:#6A5F74; line-height:1.5">The artwork is busy. Everything around it should not be. Give the page more air than feels necessary and the work carries itself.</p>
<div style="display:flex; flex-direction:column; gap:12px">
<h3 style="font-size:28px; font-weight:500">The spacing scale</h3>
<p style="font-size:26px; color:#6A5F74; line-height:1.5">4, 8, 12, 18, 24, 32, 44, 68, 104. Pick from the scale rather than typing a number. Gaps that are nearly the same read as mistakes.</p>
</div>
</div>
<div style="width:820px; display:flex; flex-direction:column; gap:20px">
<div style="background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:34px; display:flex; flex-direction:column; gap:10px">
<h3 style="font-size:28px; font-weight:500">Margins grow with the surface</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Phone 18px, tablet 28px, laptop 48px, large screen 72px and above. A margin that stays fixed makes a big screen look like a small one that has been stretched.</p>
</div>
<div style="background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:34px; display:flex; flex-direction:column; gap:10px">
<h3 style="font-size:28px; font-weight:500">Full width, measured text</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Images and panels may run the whole width. Paragraphs stop at about 58 characters, headings at about 20. Past that the eye loses its place coming back to the next line.</p>
</div>
<div style="background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:34px; display:flex; flex-direction:column; gap:10px">
<h3 style="font-size:28px; font-weight:500">One alignment</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Left aligned, ragged right. Centred type only inside a badge or a stamp, where the shape is doing the centring.</p>
</div>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.photography = `<section id="photography" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:column; gap:32px">
<div style="display:flex; flex-direction:row; align-items:baseline; gap:32px">
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Photography.</h2>
<p style="font-size:26px; color:#6A5F74">Warm light, real rooms, people actually doing something</p>
</div>
<div style="display:flex; flex-direction:row; gap:20px">
<img src="/_blob/PHOTO_SET" alt="The arched plaster set with built niches" style="flex:1; height:400px; object-fit:cover; border-radius:12px">
<img src="/_blob/PHOTO_STUDIO" alt="The raw studio floor with tall factory windows" style="flex:1; height:400px; object-fit:cover; border-radius:12px">
<img src="/_blob/PHOTO_CLASS" alt="A paint and sip class at easels in the studio" style="flex:1; height:400px; object-fit:cover; border-radius:12px">
</div>
<div style="display:flex; flex-direction:row; gap:28px">
<div style="flex:1; display:flex; flex-direction:column; gap:10px">
<h3 style="font-size:28px; font-weight:500; color:#44623E">Do</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Daylight where you can. Show the room as it is, with its concrete and its plaster. Let people be mid-action rather than posed at the camera.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:10px">
<h3 style="font-size:28px; font-weight:500; color:#C0687F">Avoid</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Heavy filters, cold blue casts, and stock photography of anyone who has never been in the building. The rooms are the proof.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:10px">
<h3 style="font-size:28px; font-weight:500">Crop</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Wide enough to read the space. A tight crop on a prop tells nobody what they would be hiring.</p>
</div>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.stationery = `<section id="stationery" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:column; gap:30px">
<div style="display:flex; flex-direction:row; align-items:baseline; gap:32px">
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Stationery.</h2>
<p style="font-size:26px; color:#6A5F74">Built from the supplied files, nothing redrawn</p>
</div>
<img src="/_blob/APP_CARD" alt="Business card, both faces: the reversed logo on Night, and contact details on Paper with the oval badge" style="width:100%; height:390px; object-fit:contain">
<div style="display:flex; flex-direction:row; gap:36px; align-items:center">
<img src="/_blob/APP_SIGNATURE" alt="Email signature: the horizontal lockup above name and contact details" style="width:620px; height:180px; object-fit:contain; border:1px solid #E6DCD2; border-radius:12px">
<div style="flex:1; display:flex; flex-direction:column; gap:12px">
<h3 style="font-size:28px; font-weight:500">Specifications</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Card 85 &times; 55 mm, 400gsm uncoated. Uncoated matters: the artwork has texture and a gloss stock fights it. Email signature 620px wide, the horizontal lockup above a hairline rule.</p>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">The reversed mark goes on the dark face, the oval badge on the light one. Never both marks on the same face.</p>
</div>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.social = `<section id="social" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:row; gap:72px; align-items:center">
<img src="/_blob/APP_SOCIAL" alt="Social avatar: the submark on a sunflower ground, and the oval badge as a sticker on cream" style="width:760px; height:360px; object-fit:contain">
<div style="flex:1; display:flex; flex-direction:column; gap:24px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Social &amp; digital</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1">One mark, one ground.</h2>
<table style="font-family:'Jost', sans-serif; font-size:23px; color:#241C2C">
<tr><th style="width:52%; text-align:left; font-weight:500">Where</th><th style="width:48%; text-align:left; font-weight:500">Use</th></tr>
<tr><td>Profile picture</td><td>Submark on Sunflower</td></tr>
<tr><td>Favicon and app icon</td><td>Submark, 180 px</td></tr>
<tr><td>Stickers and packaging</td><td>Oval badge on Paper</td></tr>
<tr><td>Post with a photograph</td><td>Reversed mark, bottom left</td></tr>
</table>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">The submark exists because the full logo is unreadable at 32px. On a profile circle, use it, the name is already printed beside it.</p>
<div style="background:#FFFFFF; border:1px solid #E6DCD2; border-radius:14px; padding:26px; display:flex; flex-direction:column; gap:6px">
<p style="font-size:20px; letter-spacing:3px; color:#9A8FA3; text-transform:uppercase">The handle</p>
<p style="font-size:30px; font-weight:500; color:#241C2C">@nalediart_studio</p>
<p style="font-size:22px; color:#6A5F74; line-height:1.4">Use it everywhere, and put the booking link in the bio rather than an email address.</p>
</div>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines</p>
</section>`;

S.web = `<section id="web" style="background:#16111D; color:#F3EDE5; font-family:'Jost', 'Century Gothic', sans-serif; padding:128px; display:flex; flex-direction:row; gap:80px; align-items:center">
<div style="flex:1; display:flex; flex-direction:column; gap:28px">
<p style="font-size:24px; letter-spacing:4px; color:#E2B155; text-transform:uppercase">The website</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1; color:#F3EDE5">The brand, already running.</h2>
<p style="font-size:26px; color:#AFA3B9; line-height:1.5">The site is the first full application of everything in this document: the palette, the type scale, the marks, the spacing, the photography. If you want to see a rule in use, look there.</p>
<p style="font-size:26px; color:#AFA3B9; line-height:1.5">It is mobile first, because that is how almost everyone will arrive.</p>
</div>
<div style="width:760px; display:flex; flex-direction:column; gap:18px">
<div style="background:#1E1828; border-radius:14px; padding:30px; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:27px; font-weight:500; color:#E2B155">A guided finder</h3>
<p style="font-size:23px; color:#AFA3B9; line-height:1.45">Three questions decide whether someone needs studio hire, the venue or a set build, then hand them to the booking form with it chosen.</p>
</div>
<div style="background:#1E1828; border-radius:14px; padding:30px; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:27px; font-weight:500; color:#E2B155">Booking that holds the slot</h3>
<p style="font-size:23px; color:#AFA3B9; line-height:1.45">A request blocks the time immediately so nobody can double book it. You confirm from your own dashboard. Unconfirmed requests release themselves after 48 hours.</p>
</div>
<div style="background:#1E1828; border-radius:14px; padding:30px; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:27px; font-weight:500; color:#E2B155">A wall of the work</h3>
<p style="font-size:23px; color:#AFA3B9; line-height:1.45">The gallery and the drifting band are your own photographs. Replace them as the work changes; the layout takes any shape.</p>
</div>
</div>
</section>`;

S.governance = `<section id="governance" style="background:#FBF8F4; color:#241C2C; font-family:'Jost', 'Century Gothic', sans-serif; padding:112px 128px 160px; display:flex; flex-direction:column; gap:34px">
<div style="display:flex; flex-direction:column; gap:12px">
<p style="font-size:24px; letter-spacing:4px; color:#8A6010; text-transform:uppercase">Keeping it consistent</p>
<h2 style="font-size:60px; font-weight:400; line-height:1.1">Who decides, and where things live.</h2>
</div>
<div style="display:flex; flex-direction:row; gap:24px">
<div style="flex:1; display:flex; flex-direction:column; gap:12px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:36px">
<h3 style="font-size:28px; font-weight:500">One source</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Every mark comes from one master artwork file. Anything made from a screenshot, a website image or a WhatsApp forward is not the logo.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:12px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:36px">
<h3 style="font-size:28px; font-weight:500">Sending it out</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Printers and signwriters get the PDF or SVG. Anyone designing for you gets the SVG and this document. Nobody needs the PNG unless they ask for one.</p>
</div>
<div style="flex:1; display:flex; flex-direction:column; gap:12px; background:#FFFFFF; border:1px solid #E6DCD2; border-radius:16px; padding:36px">
<h3 style="font-size:28px; font-weight:500">Before it goes out</h3>
<p style="font-size:23px; color:#6A5F74; line-height:1.45">Check three things: the mark is not stretched, it has its clear space, and the gold is the deep one if it is being read as text.</p>
</div>
</div>
<div style="background:#241C2C; border-radius:16px; padding:44px; display:flex; flex-direction:row; gap:56px; align-items:center">
<div style="flex:1; display:flex; flex-direction:column; gap:8px">
<h3 style="font-size:30px; font-weight:500; color:#E2B155">When in doubt</h3>
<p style="font-size:24px; color:#AFA3B9; line-height:1.45">Ask before you improvise. A five-minute question is cheaper than a reprint, and far cheaper than a sign.</p>
</div>
<div style="display:flex; flex-direction:column; gap:6px">
<p style="font-size:24px; color:#F3EDE5">Naledi Zondi</p>
<p style="font-size:24px; color:#AFA3B9">065 838 1532</p>
<p style="font-size:24px; color:#AFA3B9">naledi@nalediart.com</p>
</div>
</div>
<p style="position:absolute; left:128px; bottom:64px; font-size:24px; color:#9A8FA3">Naledi Art Studio &middot; Brand guidelines &middot; Version 1, 2026</p>
</section>`;

let n = 0;
for (const id of Object.keys(S)) {
  fs.writeFileSync(path.join(OUT, id + '.html'), S[id] + '\n');
  n++;
}
console.log(n + ' slides written: ' + Object.keys(S).join(', '));

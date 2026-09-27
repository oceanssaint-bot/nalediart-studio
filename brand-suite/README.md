# Naledi Art Studio — brand suite

Built on her current logo's own device: the vertical rule standing in for the
letter I, and the portrait as the O. The artwork is your vector file, untouched.

## Files

| File | What it is |
|---|---|
| `01-primary` | **The main logo.** NALED\|ART over STUD\|O, rebuilt to match the current logo exactly. |
| `01-primary-reversed` | Cream, for dark backgrounds. |
| `01-primary-gold-rule` | The rule in sunflower gold. |
| `02-classic` | The painted original's layout: artwork over NALEDI ART / EST. 2019. |
| `02-classic-heavier` | Same, at the current logo's stroke weight. |
| `03-badge-oval` | **The badge.** Oval stamp — name arced above, DURBAN · EST. 2019 below. For stickers, packaging, wax seals. |
| `03-badge-oval-gold` | The badge in gold. |
| `03-badge-oval-plain` | Oval badge without the city line. |
| `03-badge`, `03-badge-durban`, `03-badge-gold` | The earlier circular versions, kept as alternates. |
| `04-submark` | The portrait in a ring. Social avatar, favicon, stamp. |
| `04-submark-gold-ring` | With a gold ring. |
| `05-horizontal` | Submark + name on one line. Letterhead, email footer, website header. |
| `06-monogram` | N \| portrait. |
| `06-monogram-letters` | N \| A. |
| `07-wordmark-only` | The lockup with a plain ring instead of the portrait — one colour, stamps, embroidery. |

SVGs in `svg/`, transparent PNGs in `png/`. Every file was checked: no `<text>`,
no font references, and all 13 render correctly with no fonts installed.

## How the primary was matched

Measured from `Screenshot 2026-09-25 124635.png` (307×183), in cap heights so it
scales exactly:

| | Reference | This build |
|---|---|---|
| Cap height | 39px | matched |
| Stem weight | 3px = 7.7% of cap | 7.7% |
| Line 1 ink width | 7.10 × cap | 7.08 × cap |
| Rule | 3px wide, continuous through both lines | 0.077 cap, continuous |
| Rule extent | 0.03 cap above line 1, 0.10 cap below line 2 | matched |
| NALED / STUD | both right-aligned to the rule | matched |
| Leading | 1.36 × cap | matched |
| The O | ring, 34×40px outer, ≈9.5% of cap | rx 0.436, ry 0.513, ring 0.095 cap |

**Typeface: GothamNarrow Light.** Your current logo's letters are narrower than
regular Gotham — "NALEDART" sums to 7.04 × cap in GothamNarrow against your
measured 7.10, and its stem is 7.1% against your 7.7%. A hairline stroke closes
the last 0.6%. It is the closest match in your font library.

The O holds the **whole artwork fitted inside**, not a tight crop, as you asked.

## The classic lockup

Measured from the painting (`IMG_0902 (1).jpeg`): cap height 0.2016 × artwork
width, line width 1.4562 × artwork width, stroke 4.0% of cap.

The stroke weight is the one thing deliberately changed. `02-classic` is set at
**6.5%** — heavier than the painting's 4.0%, which read too thin, per your note.
`02-classic-heavier` is **7.7%**, matching the current logo exactly, if you want
the two lockups to feel identical in weight.

## Two things to decide

1. **The monogram reads as a word.** `N | O` can be read "NO", and the letters
   version `N | A` reads "N/A". Neither is fatal at a glance, but if the monogram
   matters, better options are a plain `N` with the rule, `NAS`, or just using
   the submark. Say the word and I will redo it.
2. **Which classic weight** — 6.5% or 7.7%.

## Licensing

GothamNarrow is a commercial typeface (Hoefler & Co). The letters here are
outlines rather than font files, but using a typeface in a logo still needs a
licence permitting it. Most desktop licences do. Century Gothic is the
already-installed fallback if you would rather avoid the question.

## The badge shape

The badge is an **oval**, 150 : 170 — taller than it is wide. It began as a
circle stretched vertically in the website footer; Naledi preferred that
proportion, so it is now the drawn shape rather than a rendering accident.
The ratio is baked into `03-badge-oval.svg`, so nothing downstream has to
stretch anything: place it at its natural aspect.

## Colour

- Ink `#1A1A1A` — matches the current logo's black.
- Gold `#D39C24` — sampled from the sunflowers in the artwork.
- Cream `#F7F1E8` — for reversed versions.

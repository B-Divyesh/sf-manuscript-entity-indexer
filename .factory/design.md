# Manuscript Entity Indexer — visual thesis

## Direction

The product is a **monochrome typographic broadsheet**: a working index that
looks like an editor's marked newspaper, not a generic dashboard. Dense rules,
folio numbers, narrow labels, red-pencil marks and wide reading columns make
the index feel at home beside a manuscript. The interface stays quiet so names,
places and evidence remain the visual subject.

## Palette

The default treatment is intentionally single-mode, like ink on warm stock.
It paints every surface explicitly.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f3efe5` | page background |
| `--sheet` | `#fffdf7` | raised work areas |
| `--ink` | `#151515` | primary text and rules |
| `--muted` | `#625e56` | secondary copy |
| `--red-pencil` | `#a42b23` | focus, selected state, editorial marks |
| `--red-dark` | `#7d1f1a` | accessible hover state |
| `--success` | `#285b42` | saved/verified status |
| `--warning` | `#7a4b05` | review-needed status |
| `--danger` | `#8a211b` | errors |

Ink on paper is above 14:1. Muted ink is above 6:1. Red-pencil on paper is
above 6:1. Statuses always include words or symbols, never color alone.

## Typography

- Display: Georgia, Times New Roman, serif. High-contrast editorial headlines
  and entity names suit manuscripts and require no remote font.
- Utility/body: Arial Narrow, Arial, sans-serif. Compact labels, metadata and
  controls keep dense evidence readable.
- The product uses system-resident faces only. It loads no font files or CDNs.
- Scale: 12, 14, 16, 20, 28, 44, 72 px. Body text never drops below 16 px.
  Tables and folio labels use tabular figures.

## Spacing and shape

- 8 px base rhythm; primary gaps are 16, 24, 40, 64 and 96 px.
- Rules group related content before boxes do. Corners are 0–2 px, like cut
  paper, with offset shadows only on movable sheets.
- Desktop workbench: 248 px entity rail, fluid evidence desk, 288 px ledger.
- At 390 px, the workbench becomes a single column with a sticky view switcher.
  Secondary counts compress; every visible button and link remains at least
  44 by 44 px.

## Interaction grammar

- A red vertical proofing mark identifies the active entity.
- Evidence opens from the line where it was found; chapter links scroll and
  focus the exact excerpt.
- Suggestions use dashed rules and the words “Suggested alias.” A merge is
  always reversible during the current session.
- Keyboard: `/` focuses search, arrows move through entity rows, Enter opens a
  row, and Escape closes dialogs.

## Motion policy

The signature motion is a 180 ms “proof sheet” reveal: new evidence slides up
8 px while its red margin mark draws from top to bottom. Navigation uses a
short opacity transition. Nothing loops. Under `prefers-reduced-motion`, the
sheet and mark appear instantly with no translation.

## Asset plan and prompt sheet

The hero uses one original editorial still life: loose cream manuscript pages,
a black index ledger, thin connecting thread and restrained red proofreader
marks. It explains the product by showing scattered mentions resolved into one
physical ledger. It contains no interface promises and no text.

Prompt:

> Use case: stylized-concept. Asset type: wide landing-page editorial hero and
> social crop. Scene: overhead archival editor's desk on warm off-white paper.
> Subject: several multilingual manuscript sheets suggested by abstract ink
> glyph shapes, a slim black entity ledger, black index tabs, fine cotton
> threads connecting repeated mentions, and three restrained red proofreader
> marks. Style: monochrome editorial still life, tactile paper fibers, high-end
> broadsheet art direction, subtle halftone grain, photographed rather than 3D.
> Composition: landscape, strong asymmetry, generous quiet paper space, objects
> remain legible when cropped to 1200×630. Light: soft north-window light with
> crisp shallow shadows. Palette: warm cream, carbon black, graphite gray, one
> dark red accent. Avoid: people, hands, readable text, fake letters, logos,
> brands, screens, gradients, neon color, watermark.

Provenance: generated for this product on 2026-08-28 with the factory image
deployment through `/opt/fleet/lib/gen-image.sh`. The final PNG is retained in
`assets/src/` with a JSON prompt sidecar. WebP/AVIF derivatives are built from
that source. Generated imagery is original for this product.

The three walkthrough images are direct captures of the bundled sample
project. They were captured locally on 2026-08-28 and contain no user data.

## 404 treatment

The missing page is styled as an unfiled clipping: a large red “404” folio,
one torn-rule edge made in CSS, and a direct link back to the index. It reuses
the same paper, ink and proofing grammar without loading another image.

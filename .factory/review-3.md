# Adversarial first-read review 3 — Manuscript Entity Indexer

Reviewed 29 August 2026 against the live deployment at
<https://manuscript-entity-indexer.sociobot.in> and repository commit
`cc96d1923da10b0f1ee3cce7238d5d98c1335a6e`.

## Verdict: FAIL

There are two findings, both blocking because they repeat or regress findings
from earlier rounds. The product is clear on first read, the demo and all 20
registered claims pass, and the site structure is sound. It does not reach the
required zero-finding bar because two of the three mandatory facts fall below
the phone's first screen, and the live workbench still uses the jargon that
F-1-10 was recorded as having removed.

## Cold first read, before scrolling

Fresh Chromium contexts were used at 390 × 844 with an iPhone user agent and at
1440 × 900. Nothing was scrolled before these answers were recorded.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It finds manuscript names and puts them in an index for checking characters, places and aliases. | Pass |
| For whom? | Novelists working across languages and long drafts. | Pass |
| What should I click first? | “Try it with sample data”; the adjacent text says it opens a three-chapter index. | Pass |

The exact first-screen copy was “Review names found across your manuscript”,
“For novelists working across languages who need one private place to check
characters, places and aliases”, “Try it with sample data”, and “It opens a
three-chapter index.” The primary action was fully visible at both sizes. The
390 px page had no horizontal overflow. The separate three-fact requirement
fails on the phone as recorded in F-3-1.

## Findings

### F-3-1 / carried F-1-7 — BLOCKING — Two required facts fall below the phone's first screen

- Exact quote/location: landing hero at 390 × 844, “Works after the first visit
  without internet” and “$24 once removes the three-file limit.”
- Evidence: in a fresh iPhone context, the three fact rows ended at 805.16,
  850.16 and 895.16 CSS pixels. Only the first row fit completely inside the
  844 px viewport. The second was clipped and the third was entirely below the
  fold. At 1440 × 900, all three ended by 853.66 px.
- History check: F-1-7 required all three plain facts to remain in the first
  screen. Review 2 reported that they ended by about 823 px on the phone.
  Polish 2 then raised phone text to 16 px, but the only current fold regression
  test checks 1440 × 900. The repaired readability rule therefore regressed the
  mobile fold requirement.
- Why this fails: a phone visitor does not receive the required privacy,
  offline and price facts without scrolling. The earlier finding is regressed,
  so the work order requires it to be blocking again.
- Concrete fix: reduce the phone hero's vertical spacing or headline size, or
  place the three facts beside the primary action, so all three rows end at or
  above 844 px without reducing text below 16 px. Extend the existing
  `@regression all three first-screen facts` test to a 390 × 844 iPhone context
  and assert every row's bottom is at most 844.

### F-3-2 / carried F-1-10 — BLOCKING — “Unicode and CJK” jargon was never removed from the live workbench

- Exact quote/location: `/app`, the supported-files strip below the first-run
  panel, “Unicode and CJK.” Source: `src/main.ts`, `emptyWorkbench()`.
- Evidence: the phrase is live and has remained in that function since the
  original implementation. Polish 1 says the product replaced Unicode jargon
  with named writing systems, and Polish 2 says that fix was preserved, but
  both records overlook this workbench copy.
- Why this fails: “Unicode” names a character encoding and “CJK” is an
  abbreviation. Neither tells a novelist which writing systems the name finder
  supports. This is the same plain-language defect as F-1-10, and the claimed
  closure is incomplete.
- Concrete fix: replace “Unicode and CJK” with “Latin, Chinese, Japanese and
  Korean names.” Add a browser copy assertion for `/app` that rejects
  user-facing `Unicode`, `CJK` and `candidate` wording.

## Copy audit

Counts are whitespace-delimited, with punctuation-only separators excluded.
Hyphenated terms, prices, paths and URLs count as one word. Code blocks, data
values and isolated navigation labels are not sentences. No landing or README
sentence exceeds 22 words, contains a banned
marketing word, or needs a copy rewrite. F-3-1 concerns placement rather than
wording. F-3-2 is live workbench copy outside these two requested surfaces.

### Landing-page sentences, including image alternatives

| Sentence | Words | Result |
| --- | ---: | --- |
| For novelists working across languages who need one private place to check characters, places and aliases. | 16 | Pass |
| It opens a three-chapter index. | 5 | Pass |
| Your drafts stay on this device. | 6 | Pass copy; placement fails F-3-1 |
| Works after the first visit without internet. | 7 | Pass copy; placement fails F-3-1 |
| $24 once removes the three-file limit. | 6 | Pass copy; placement fails F-3-1 |
| Manuscript sheets linked by thread to a black index ledger. | 10 | Pass (image alt) |
| Repeated mentions become one author-reviewed ledger. | 6 | Pass |
| At dusk, Mara Venn stepped off the ferry at Glass Harbor. | 11 | Pass (sample text) |
| Captain Venn · Both names include “Venn”. | 6 | Pass (sample text) |
| The sample workbench lists names beside their manuscript evidence and ledger. | 11 | Pass (image alt) |
| Start with extracted names and the lines where they appear. | 10 | Pass |
| The workbench shows Captain Venn merged into Mara Venn as an alias. | 12 | Pass (image alt) |
| Merge a suggested alias only after checking its evidence. | 9 | Pass |
| A chapter copy opens above the workbench for source checking. | 10 | Pass (image alt) |
| Open the chapter copy without changing the source file. | 9 | Pass |
| Open Markdown, text and DOCX chapters. | 6 | Pass |
| Source files stay unchanged. | 4 | Pass |
| Review names in Latin, Chinese, Japanese and Korean text. | 9 | Pass |
| Accept or reject each alias suggestion. | 6 | Pass |
| Search names, chapter titles and excerpt text. | 7 | Pass |
| Add timeline notes and export the ledger. | 7 | Pass |
| No manuscript upload. | 3 | Pass |
| No source-file changes. | 3 | Pass |
| The app only suggests matches. | 5 | Pass |
| You decide which names belong together. | 6 | Pass |
| Free indexes three files at a time. | 7 | Pass |
| The owner edition removes that limit. | 6 | Pass |
| The purchase link starts at Sociobot, then opens Dodo’s hosted checkout. | 11 | Pass |
| This app never receives card details. | 6 | Pass |
| Keep a private continuity ledger beside your manuscript. | 8 | Pass |

### Landing headings, labels and actions

| Copy unit | Words | Result |
| --- | ---: | --- |
| Local processing | 2 | Pass |
| Markdown · text · DOCX | 3 | Pass |
| A continuity ledger for long drafts | 6 | Pass |
| Review names found across your manuscript | 6 | Pass; job-led h1 |
| Try it with sample data | 5 | Pass; result-naming action |
| Sample name index | 3 | Pass |
| Sample output | 2 | Pass |
| Review each detected mention before you merge names | 8 | Pass |
| Names | 1 | Pass |
| Evidence · 01 — The tide ledger | 5 | Pass |
| Suggested alias | 2 | Pass |
| Ledger | 1 | Pass |
| Type | 1 | Pass |
| Aliases | 1 | Pass |
| Chapters | 1 | Pass |
| Sample project | 2 | Pass |
| Three views | 2 | Pass |
| Follow a name back to its chapter | 7 | Pass |
| Method | 1 | Pass |
| Three passes | 2 | Pass |
| Build the ledger in three steps | 6 | Pass |
| Choose your manuscript folder | 4 | Pass |
| Review marked names | 3 | Pass |
| Check story continuity | 3 | Pass |
| Draft privacy | 2 | Pass |
| What never happens to your draft | 6 | Pass |
| Owner edition | 2 | Pass |
| Index folders with more than three files | 7 | Pass |
| $24 one time | 3 | Pass |
| Buy the owner edition | 4 | Pass; result-naming action |
| Desktop app · v0.1.5 | 3 | Pass |
| Choose a Linux installer / Choose a macOS installer / Choose a Windows installer | 4 / 4 / 4 | Pass; platform-specific actions |
| View desktop downloads | 3 | Pass; phone action |
| macOS Apple silicon / macOS Intel / Windows x64 / Linux x64 | 3 / 2 / 2 / 2 | Pass; explicit download links |
| All downloads | 2 | Pass; destination link |
| Demo / Workbench / Privacy / Terms | 1 each | Pass; navigation |
| Built by Param Factory | 4 | Pass; attribution link |
| Version 0.1.5 | 2 | Pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Review names found in your manuscript without uploading it. | 9 | Pass |
| This local continuity ledger is for novelists working across languages. | 10 | Pass |
| It reads Markdown, text and DOCX chapters, then marks repeated names in Latin, Chinese, Japanese and Korean text. | 18 | Pass |
| The author reviews every alias merge. | 6 | Pass |
| Try the isolated sample at https://manuscript-entity-indexer.sociobot.in/demo. | 6 | Pass |
| Demo edits stay in memory and disappear on reload. | 9 | Pass |
| Opens a manuscript folder without changing its source files. | 9 | Pass |
| Finds repeated person and place names in Latin, Chinese, Japanese and Korean text. | 13 | Pass |
| Shows detected mentions beside their chapter copy. | 7 | Pass |
| Suggests possible aliases and shows the matching rule. | 8 | Pass |
| Lets the author merge, rename, classify, search and undo alias changes. | 11 | Pass |
| Adds name-linked continuity notes and exports the ledger as CSV. | 10 | Pass |
| Stores a real web index in local browser storage until the author clears it. | 14 | Pass |
| Works after the first web visit without internet. | 8 | Pass |
| The free edition indexes three files at a time. | 9 | Pass |
| A verified owner license costs $24 once and removes that limit. | 11 | Pass |
| The purchase link starts at Sociobot, then opens Dodo's hosted checkout. | 11 | Pass |
| License checks send only the license token. | 7 | Pass |
| Manuscript processing runs on the device. | 6 | Pass |
| The demo makes no cross-origin requests. | 6 | Pass |
| The landing page may request release metadata from GitHub. | 9 | Pass |
| License verification sends only the pasted token to Sociobot. | 9 | Pass |
| There is no analytics or advertising. | 6 | Pass |
| The app does not upload manuscript text or store it in the cloud. | 13 | Pass |
| Read the shipped `/privacy` and `/terms` pages for the full policies. | 11 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Desktop builds also need the Rust toolchain and the platform packages listed in the Tauri documentation. | 16 | Pass |
| The exact deploy command is `npm run build:site`. | 8 | Pass |
| It writes the static site and route fallbacks to `dist/site`, with `index.html` at that root. | 15 | Pass |
| Run the desktop shell during development with `npm run tauri dev`. | 11 | Pass |
| Build a local platform package with `npm run tauri build`. | 10 | Pass |
| The release workflow builds macOS, Windows and Linux installers, plus `SHA256SUMS` and `latest.json`. | 13 | Pass |
| The landing page lists exact desktop installer choices and sends phone visitors to the desktop download page. | 17 | Pass |
| `.factory/brief.json` records the product scope and build command. | 8 | Pass |
| `.factory/design.md` records the original broadsheet visual system and art. | 9 | Pass |
| `.factory/demo.md` explains the clean demo sandbox. | 6 | Pass |
| `.factory/claims.json` maps every product claim to a browser test. | 9 | Pass; registry/tag cross-check confirmed |
| MIT licensed. | 2 | Pass; confirmed by `LICENSE` |
| Built by Param Factory. | 4 | Pass |

README headings are “Manuscript Entity Indexer” (3 words), “What it does” (3),
“Privacy” (1), “Run and test” (3), “Desktop releases” (2), and “Project notes”
(2). Each names its section. “Useful focused checks” (3) introduces commands
and is clear in context. No README button copy exists.

### Terminology check

| Concept | Preferred public term | Result |
| --- | --- | --- |
| A detected person or place | name | Pass on landing and README; `/app` has F-3-2 |
| The saved collection | index | Pass |
| The editable continuity record | ledger | Pass |
| One source occurrence | mention | Pass |
| Source text shown for checking | evidence | Pass |
| Proposed second name | suggested alias | Pass |
| Temporary sample | demo / sample data | Pass |
| Paid version and credential | owner edition / owner license | Pass; distinct concepts |

## Demo and sandbox behavior

Result: pass.

- One click on “Try it with sample data” opened `/demo`.
- The first 390 px demo screen already showed “The Glass Harbor papers · 3
  files”, the h1, search and export controls, all three view tabs, “Names · 11”
  and the first populated name row. The sample contains realistic people,
  places, aliases, chapters and timeline markers.
- The persistent banner says “Demo — sample data, nothing is saved” and exposes
  Reset demo and Start for real.
- A real-storage sentinel at `mei:project:v1` remained unchanged while a renamed
  sample used only `demo:mei:project:v1` in session storage. Reload discarded
  the edit. Reset restored the sample. Start for real removed the demo key and
  opened `/app` without exposing sample data as real data.
- Requests made after demo entry were same-origin only. No manuscript text was
  sent. A live service-worker test reloaded `/demo` offline and retained the
  sample.
- `.factory/demo.md` accurately documents both direct demo URLs, sample data,
  reset behavior and the separate storage namespace.

## Claim test results

All commands were run separately from clean clone
`/tmp/mei-review3.WZZq6t/repo` at the reviewed commit. Each claim id occurs in
exactly one `@claim:<id>` test. No claim test failed and no unlisted claim-like
sentence was found on the live landing page or in README.

| Claim id | Result | Evidence checked |
| --- | --- | --- |
| `demo-isolation` | Pass | Edit disappears on reload; live real-storage sentinel unchanged |
| `sample-preview` | Pass | Landing totals match 11 demo rows and named mention counts |
| `local-processing` | Pass | Imported sentinel absent from all request URLs and bodies |
| `no-tracking` | Pass | Route log, methods, cookies and storage checked |
| `offline-reload` | Pass | Demo reloaded offline locally and live |
| `csv-export` | Pass | CSV header and one row per name |
| `alias-review` | Pass | Rule, merge, undo, keep separate, rename, type and search |
| `chapter-search` | Pass | Unique filename found when absent from chapter text |
| `timeline-ledger` | Pass | Added linked note and reset it |
| `chapter-evidence` | Pass | Opened source sentence from a mention |
| `supported-imports` | Pass | Markdown, text and DOCX; Latin, Han, Kana and Hangul |
| `source-files-unchanged` | Pass | On-disk fixture remained byte-identical |
| `free-file-limit` | Pass | Fourth file excluded without a license |
| `local-project-storage` | Pass | Real index survived reload and clear removed it |
| `owner-license` | Pass | Recorded valid response removed the three-file limit |
| `revoked-license` | Pass | Recorded revoked response restored the limit |
| `billing-privacy` | Pass | Token-only check and disclosed Sociobot-to-Dodo flow |
| `checkout-available` | Pass | Live endpoint returned 303 to Dodo checkout |
| `platform-download` | Pass | Exact macOS, Windows and Linux assets; phone gets no installer |
| `release-workflow` | Pass | Three platform jobs, checksums and release manifest |

## Earlier finding audit

Every finding in review 1 and review 2 was checked on the live site and in
source. Repair notes were used only as a checklist, not as proof.

| Earlier id | Current result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Copy and live 303 disclose Sociobot → Dodo |
| F-1-2 | Fixed | No completeness promise remains |
| F-1-3 | Fixed | Import sentinel is now covered by the request-log test |
| F-1-4 | Fixed | Refund causation was removed; revoked status is the tested fact |
| F-1-5 | Fixed | Matching reason is visible and asserted |
| F-1-6 | Fixed | Registered workflow test covers named platform outputs |
| F-1-7 | Regressed; BLOCKING | Phone fact rows end at 805, 850 and 895 px; see F-3-1 |
| F-1-8 | Fixed | Privacy remains visible in the 390 px header |
| F-1-9 | Fixed | Mobile tab is “Ledger” and exposes name editing |
| F-1-10 | Unfixed; BLOCKING | `/app` still says “Unicode and CJK”; see F-3-2 |
| F-1-11 | Fixed | “Local processing” remains |
| F-1-12 | Fixed | “Sample name index” remains |
| F-1-13 | Fixed | “Draft privacy” remains |
| F-1-14 | Fixed | Decorative issue/year lore remains absent |
| F-1-15 | Fixed | Footer shows the version, not asset provenance |
| F-1-16 | Fixed | Public task copy uses “name”; `Entity` remains only in the product name and code identifiers |
| F-2-1 | Fixed | Chapter-title search works and is claimed/tested |
| F-2-2 | Fixed | Phone and architecture-specific download paths work |
| F-2-3 | Fixed | False sample nouns are absent; Ignore this name persists and is undoable |
| F-2-4 | Fixed | Keep separate is included in the alias claim and test |
| F-2-5 | Fixed | Unsupported unsigned-build label is absent |
| F-2-6 | Fixed | Phone informative text is at least 16 px and controls are at least 44 px |
| F-2-7 | Fixed | Concrete suggestion/author-decision copy remains |
| F-2-8 | Fixed | Live Axe reports zero violations on every checked route |

## Structure, accessibility and visual identity

| Route | HTTP | Title | h1 |
| --- | ---: | --- | --- |
| `/` | 200 | Manuscript Entity Indexer — Review manuscript names | Review names found across your manuscript |
| `/demo` | 200 | Demo — Manuscript Entity Indexer | Review names found in your manuscript |
| `/app` | 200 | Index — Manuscript Entity Indexer | Index your manuscript folder |
| `/privacy` | 200 | Privacy — Manuscript Entity Indexer | Your manuscript stays yours |
| `/terms` | 200 | Terms — Manuscript Entity Indexer | Use the index as an editing aid |
| unknown path | 404 | Page not found — Manuscript Entity Indexer | This clipping is not in the index |

| Check | Result |
| --- | --- |
| Titles | Pass: route-specific titles on `/`, `/demo`, `/app`, `/privacy`, `/terms` and 404, all at most 60 characters |
| One h1, landmarks, heading order, `lang=en` | Pass on all six routes |
| Description, canonical, OG/Twitter, favicon | Pass; canonical updates per route and the original social image is 1200 × 630 |
| Designed 404 | Pass; unknown URL returns HTTP 404 with the broadsheet clipping treatment and a home link |
| Deep links, History API, back button, focus | Pass; navigation and back restore the route, scroll top, h1 focus and live announcement |
| Link crawl | Pass; all first-party routes, checkout, release page, four current installer assets and factory link resolve |
| Header/footer and Privacy/Terms | Pass on all routes, including phone and 404 |
| Accessibility | Pass; zero live Axe violations, no horizontal overflow, visible focus, 44 px targets and reduced-motion path |
| Console | Pass on product routes; no script or runtime errors (the expected top-level 404 network entry occurs on the 404 check) |
| Visual identity | Pass; the monochrome broadsheet, red proof marks, rules and manuscript still life are product-specific |
| JavaScript size | Pass; production chunks total well below the 150 KB gzip product limit and landing startup remains below its tested 10 KB limit |
| Security | Pass; live CSP, frame restriction, MIME-sniffing protection, referrer policy and permissions policy are present |
| Mobile first screen | Fail; F-3-1 |

## Missed leverage

No additional feature finding is warranted. The brief's obvious adjacent needs
are already present: folder import, Markdown/text/DOCX support, correction and
alias review, continuity notes, CSV export, desktop installers and an isolated
sample. Sync would conflict with the local-first privacy boundary. AI-assisted
extraction through the Sociobot gateway could be optional later, but it is not
an obvious requirement and would add a network/cost/privacy decision to a job
that currently works offline.

## Build and verification

- All 20 declared claim commands: pass when run separately from the clean
  clone.
- `npm test`: pass — 7 Vitest tests and 34 Playwright tests.
- `npm run typecheck`: pass.
- `npm run build:site`: pass; `dist/site` produced.
- Live root and demo: no runtime console errors.
- Live Axe: zero violations on `/`, `/demo`, `/app`, `/privacy`, `/terms` and
  an unknown route.
- Live crawl: no dead HTTP links.

## What would make this perfect

Keep all three 16 px facts inside a 390 × 844 first screen and add that phone
geometry to the regression suite. Replace the remaining “Unicode and CJK”
label with named writing systems and protect that wording with a route-level
copy test. Then rerun every claim command and the full live checklist; the
review can pass only if it returns zero findings.

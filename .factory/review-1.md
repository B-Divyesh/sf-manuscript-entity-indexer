# Adversarial first-read review 1 — Manuscript Entity Indexer

Reviewed 28 August 2026 against the live deployment at
<https://manuscript-entity-indexer.sociobot.in> and repository commit
`5abe7595a7d33f92231a6460e5114d6cd3b00580`.

## Verdict: FAIL

There are 16 findings: 2 blocking, 4 major and 10 minor. The demo, local test
suite, routes, links, accessibility checks and build pass. The product still
fails the honesty bar because its checkout copy contradicts the live redirect,
and its most prominent copy promises complete name and mention detection that
the tests do not establish and the terms expressly disclaim.

## Cold first read, before scrolling

Fresh Chromium contexts were used at 390 × 844 and 1440 × 900. No page was
scrolled before recording this result.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It indexes names across a manuscript and groups characters, places and aliases for continuity checks. | Pass |
| For whom? | Novelists working across languages and long drafts. | Pass |
| What should I click first? | “Try it with sample data”; the adjacent copy says it opens a three-chapter index. | Pass |

The exact copy that supplied those answers was “Index every name across your
manuscript”, “For novelists working across languages who need one private place
to check characters, places and aliases”, and “Try it with sample data”. The
390 px page had no horizontal overflow and showed all three plain facts. At
1440 × 900, only the first fact began at the bottom edge; see F-1-7.

## Findings

### F-1-1 — BLOCKING — Checkout is said to stay on Sociobot, but it redirects to Dodo

- Exact copy: README, “Checkout stays on Sociobot.” Claims registry,
  `billing-privacy`, “Checkout stays on Sociobot”. Claims registry,
  `checkout-available`, “starts Sociobot's hosted checkout”. Landing page,
  “Sociobot is the merchant of record.”
- Evidence: a clean request to
  `https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout`
  returned `303 Location:
  https://checkout.dodopayments.com/session/...`. The automated
  `billing-privacy` test passed only because it checked the link's initial
  `api.sociobot.in` URL and did not follow it. The `checkout-available` test
  itself expects the Dodo host while its registered claim calls the checkout
  Sociobot-hosted.
- Why this fails: a buyer can reasonably read “stays on Sociobot” as a promise
  about where payment details are entered. The observable flow does the
  opposite. “Merchant of record” is also unexplained legal jargon and is not
  established by the registered test.
- Concrete fix: write “The purchase link starts at Sociobot, then opens Dodo's
  hosted checkout. This app never receives card details.” Name the actual
  merchant of record only after verifying the legal arrangement. Update both
  claim entries and make the test follow the redirect and assert the disclosed
  final host.

### F-1-2 — BLOCKING — “Every name” and “every mention” are untested absolutes contradicted by the terms

- Exact copy: landing h1, “Index every name across your manuscript”; landing
  h2, “See every mention before you merge it”; README, “Shows every mention
  beside its chapter copy.”
- Contradicting copy: Terms, “The software is provided as available without a
  promise that every name will be found.”
- Evidence: no `.factory/claims.json` entry measures extraction recall or can
  prove that every name or mention is found. `chapter-evidence` checks that one
  known mention opens its source; `supported-imports` checks selected fixture
  names. Neither supports completeness.
- Why this fails: the main promise is broader than the product's stated
  limitation and can mislead an author into trusting an incomplete continuity
  check.
- Concrete fix: use “Review names found across your manuscript”, “Review each
  detected mention before you merge names”, and “Shows detected mentions beside
  their chapter copy.” Keep the terms limitation.

### F-1-3 — MAJOR — The no-tracking claim is not registered or tested across the product

- Exact copy: README, “There is no analytics, advertising, manuscript telemetry
  or cloud manuscript storage.”
- Evidence: `local-processing` observes requests during one demo flow only. It
  does not assert the quoted analytics, advertising or storage claim across the
  landing, app, privacy, terms and checkout-entry flows.
- Why this fails: this is a material privacy promise with no matching claim
  entry. The live landing also intentionally calls GitHub, so the scope needs
  to be explicit.
- Concrete fix: add a `no-tracking` claim and a clean-context test that visits
  every first-party route, records requests/cookies/storage, permits only the
  documented GitHub release request, and asserts no analytics or manuscript
  upload. Alternatively narrow the sentence to the behavior already tested.

### F-1-4 — MAJOR — Refund revocation is an unlisted claim

- Exact copy: landing pricing, “Refunds revoke the license.”
- Evidence: no claim entry or test simulates a refunded license. The owner
  test uses only a recorded valid response.
- Why this fails: a buyer can rely on this billing and access-control statement.
- Concrete fix: add a `refund-revocation` claim with a recorded refunded-token
  response and assert that paid access is removed, or remove this sentence from
  the landing page and retain precise policy text only where it is verified.

### F-1-5 — MAJOR — Alias explanations are promised but not asserted

- Exact copy: README, “Suggests possible aliases and explains the matching
  rule.”
- Evidence: `alias-review` confirms that a suggestion can be merged and undone,
  but it never asserts that the explanation is present or accurate.
- Why this fails: the explanation is the evidence an author needs before
  merging two names.
- Concrete fix: extend the `alias-review` claim text and test to assert the
  visible reason for a known suggestion, or rewrite the README to only promise
  the tested review controls.

### F-1-6 — MAJOR — README release assertions have no claims or release tests

- Exact copy: “Tags matching `v*` start `.github/workflows/release.yml`.”
  “GitHub Actions builds unsigned macOS arm64 and x86_64 packages, Windows
  packages, Linux AppImage and DEB packages.” “The release also contains
  `SHA256SUMS` and `latest.json`.” “macOS and Windows builds are unsigned until
  the operator supplies signing certificates.” “Users must approve the
  operating system warning for these preview builds.”
- Evidence: `platform-download` uses mocked release metadata and only checks
  that the page chooses a matching filename. It does not verify the published
  platform matrix, assets, signatures, workflow trigger or warning behavior.
- Why this fails: these are operational and distribution claims a user may rely
  on, but `.factory/claims.json` does not list them.
- Concrete fix: consolidate the copy into claims backed by a fixture or release
  manifest test that checks all named assets and signatures. Remove claims that
  cannot be tested reliably, and describe OS warnings without saying users
  “must” see a specific outcome.

### F-1-7 — MINOR — The three plain facts fall below the desktop first screen

- Location: landing hero at 1440 × 900.
- Evidence: the first fact begins around y=860; the second and third facts are
  below the 900 px viewport. All three are visible at 390 × 844.
- Why this fails: the attached first-screen contract requires the privacy,
  offline and price facts in the first screen on both checked layouts.
- Concrete fix: reduce desktop hero top padding/headline size or move the facts
  beside the primary action so all three end above y=900.

### F-1-8 — MINOR — Privacy disappears from the mobile header

- Location: `src/style.css`, the 700 px media query hides
  `.site-header nav a:nth-child(3)`, which is Privacy. The 390 px live header
  shows only Demo and Workbench.
- Why this fails: the standard header calls for consistent access to Privacy on
  every route. A phone visitor must scroll to the footer to find it.
- Concrete fix: keep Privacy visible, shorten the wordmark/navigation, or use
  an accessible menu without removing the link from the visual and keyboard
  path.

### F-1-9 — MINOR — The mobile “Timeline” tab hides unrelated ledger editing controls

- Location: 390 px demo. The tab is labelled “Timeline”, but its controlled
  panel begins with “Ledger” and contains Display name, Type and Save entity
  before the timeline.
- Why this fails: a first-time user looking to rename or classify an entity has
  no reason to open Timeline. This also uses two names for one view.
- Concrete fix: label the tab “Ledger”, keep Timeline as a subsection, or add a
  fourth Edit tab if the controls need their own place.

### F-1-10 — MINOR — “Unicode-aware candidates/rules” is implementation jargon

- Exact copy: landing, “Check Unicode-aware candidates.” README, “Finds
  recurring person and place candidates with Unicode-aware rules.”
- Why this fails: a novelist should not need to understand Unicode or candidate
  extraction to know which scripts work.
- Concrete fix: “Review names found in Latin, Chinese, Japanese and Korean
  text.” In the README: “Finds repeated character and place names in Latin,
  Chinese, Japanese and Korean text.”

### F-1-11 — MINOR — “Offline author's desk” is a mood label

- Exact copy/location: landing hero edition strip, “Offline author's desk”.
- Why this fails: “desk” is metaphorical and does not name a section or action.
- Concrete fix: “Local manuscript index”.

### F-1-12 — MINOR — “On the desk” is a mood heading

- Exact copy/location: label above the sample preview, “On the desk”.
- Why this fails: it could appear on many unrelated products and does not name
  what follows.
- Concrete fix: “Sample entity index”.

### F-1-13 — MINOR — “The quiet margin” is a mood heading

- Exact copy/location: label above the privacy boundary section, “The quiet
  margin”.
- Why this fails: it does not identify privacy or data handling out of context.
- Concrete fix: “Draft privacy”.

### F-1-14 — MINOR — “No. 01” and “2026” are decorative issue lore

- Exact copy/location: landing hero edition strip, “No. 01” and “2026”.
- Why this fails: neither helps the visitor understand or use the product. The
  plain-words standard explicitly excludes invented issue labels.
- Concrete fix: remove both, or replace the entire strip with useful facts such
  as “Local processing” and “Markdown · text · DOCX”.

### F-1-15 — MINOR — The footer exposes internal asset provenance as decorative copy

- Exact copy/location: landing footer, “v0.1.5 · Original generated still
  life”.
- Why this fails: the asset-production note is not useful product information.
  Provenance already belongs in `.factory/design.md`.
- Concrete fix: keep only “Version 0.1.5” as the required build identifier.

### F-1-16 — MINOR — The demo opens with unexplained “entity” jargon

- Exact copy/location: demo h1, “Review your entity index”; list heading,
  “Entities”.
- Why this fails: the landing uses the plain word “names”, then the first
  product screen switches to an NLP/database term.
- Concrete fix: use “Review names found in your manuscript” and “Names”, while
  reserving `entity` for code and file formats.

## Copy audit

Counts use whitespace-delimited words; hyphenated terms, prices, paths and URLs
count as one word, and punctuation-only separators do not count. Code blocks
and isolated numeric/data labels are not sentences. No sentence exceeds 22
words and no banned marketing adjective was found. Flagged rows point to the
findings above.

### Landing-page sentences, including image alternatives

| Sentence | Words | Result |
| --- | ---: | --- |
| For novelists working across languages who need one private place to check characters, places and aliases. | 16 | Pass |
| It opens a three-chapter index. | 5 | Pass |
| Your drafts stay on this device. | 6 | Pass |
| Works after the first visit without internet. | 7 | Pass |
| $24 once removes the three-file limit. | 6 | Pass |
| Manuscript sheets linked by thread to a black index ledger. | 10 | Pass (image alt) |
| Repeated mentions become one author-reviewed ledger. | 6 | Pass |
| At dusk, Mara Venn stepped off the ferry at Glass Harbor. | 11 | Pass (sample data) |
| Both names include “Venn”. | 4 | Pass (sample data) |
| The sample workbench lists entities beside their manuscript evidence and ledger. | 11 | Pass (image alt) |
| Start with extracted names and the lines where they appear. | 10 | Pass |
| The workbench shows Captain Venn merged into Mara Venn as an alias. | 12 | Pass (image alt) |
| Merge a suggested alias only after checking its evidence. | 9 | Pass |
| A chapter copy opens above the workbench for source checking. | 10 | Pass (image alt) |
| Open the chapter copy without changing the source file. | 9 | Pass |
| Open Markdown, text and DOCX chapters. | 6 | Pass |
| Source files stay unchanged. | 4 | Pass |
| Check Unicode-aware candidates. | 3 | Flag: F-1-10 |
| Accept or reject each alias suggestion. | 6 | Pass |
| Search evidence by chapter. | 4 | Pass |
| Add timeline notes and export the ledger. | 7 | Pass |
| No manuscript upload. | 3 | Pass |
| No source-file changes. | 3 | Pass |
| The index uses small, visible rules. | 6 | Pass |
| You decide which names belong together. | 6 | Pass |
| Free indexes three files at a time. | 7 | Pass |
| The owner edition removes that limit. | 6 | Pass |
| Sociobot is the merchant of record. | 6 | Flag: F-1-1 |
| Refunds revoke the license. | 4 | Flag: F-1-4 |
| macOS, Windows and Linux builds appear on the release page. | 10 | Pass |
| Keep a private continuity ledger beside your manuscript. | 8 | Pass |

### Landing headings, labels and actions

| Copy unit | Words | Result |
| --- | ---: | --- |
| Index every name across your manuscript | 6 | Flag: F-1-2 |
| See every mention before you merge it | 7 | Flag: F-1-2 |
| Follow a name back to its chapter | 7 | Pass |
| Build the ledger in three steps | 6 | Pass |
| Choose your manuscript folder | 4 | Pass |
| Review marked names | 3 | Pass |
| Check story continuity | 3 | Pass |
| What never happens to your draft | 6 | Pass |
| Index folders with more than three files | 7 | Pass |
| A continuity ledger for long drafts | 6 | Pass |
| Offline author's desk | 3 | Flag: F-1-11 |
| No. 01 | 2 | Flag: F-1-14 |
| 2026 | 1 | Flag: F-1-14 |
| On the desk | 3 | Flag: F-1-12 |
| Sample output | 2 | Pass |
| Sample project | 2 | Pass |
| Three views | 2 | Pass |
| Method | 1 | Pass |
| Three passes | 2 | Pass |
| The quiet margin | 3 | Flag: F-1-13 |
| Owner edition | 2 | Pass |
| Try it with sample data | 5 | Pass; verb names result |
| Buy the owner edition | 4 | Pass; verb names result |
| Download for Linux | 3 | Pass; detected live action |
| v0.1.5 · Original generated still life | 5 | Flag: F-1-15 |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Index characters, places and aliases without uploading your manuscript. | 9 | Pass |
| This local continuity ledger is for novelists working across languages. | 10 | Pass |
| It reads Markdown, text and DOCX chapters, then marks recurring Latin, Han, Kana and Hangul names with small, visible rules. | 20 | Flag: F-1-10 |
| The author reviews every alias merge. | 6 | Pass |
| Try the isolated sample at https://manuscript-entity-indexer.sociobot.in/demo. | 6 | Pass |
| Demo edits stay in memory and disappear on reload. | 9 | Pass |
| Opens a manuscript folder without changing its source files. | 9 | Pass |
| Finds recurring person and place candidates with Unicode-aware rules. | 9 | Flag: F-1-10 |
| Shows every mention beside its chapter copy. | 7 | Flag: F-1-2 |
| Suggests possible aliases and explains the matching rule. | 8 | Flag: F-1-5 |
| Lets the author merge, rename, classify, search and undo alias changes. | 11 | Pass |
| Adds entity-linked continuity notes and exports the ledger as CSV. | 10 | Pass |
| Stores a real web index in local browser storage until the author clears it. | 14 | Pass |
| Works after the first web visit without internet. | 8 | Pass |
| The free edition indexes three files at a time. | 9 | Pass |
| A verified owner license costs $24 once and removes that limit. | 11 | Pass |
| Checkout stays on Sociobot. | 4 | Flag: F-1-1 |
| License checks send only the license token. | 7 | Pass |
| Manuscript processing runs on the device. | 6 | Pass |
| The demo makes no cross-origin requests. | 6 | Pass |
| The landing page may request release metadata from GitHub. | 9 | Pass |
| License verification sends only the pasted token to Sociobot. | 9 | Pass |
| There is no analytics, advertising, manuscript telemetry or cloud manuscript storage. | 11 | Flag: F-1-3 |
| Read the shipped /privacy and /terms pages for the full policies. | 11 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Desktop builds also need the Rust toolchain and the platform packages listed in the Tauri documentation. | 16 | Pass; developer context |
| The exact deploy command is npm run build:site. | 8 | Pass |
| It writes the static site and route fallbacks to dist/site, with index.html at that root. | 15 | Pass; developer context |
| Useful focused checks: | 3 | Pass |
| Run the desktop shell during development with npm run tauri dev. | 11 | Pass |
| Build a local platform package with npm run tauri build. | 10 | Pass |
| Tags matching v* start .github/workflows/release.yml. | 5 | Flag: F-1-6 |
| GitHub Actions builds unsigned macOS arm64 and x86_64 packages, Windows packages, Linux AppImage and DEB packages. | 16 | Flag: F-1-6 |
| The release also contains SHA256SUMS and latest.json. | 7 | Flag: F-1-6 |
| macOS and Windows builds are unsigned until the operator supplies signing certificates. | 12 | Flag: F-1-6 |
| Users must approve the operating system warning for these preview builds. | 11 | Flag: F-1-6 |
| The landing page selects current macOS, Windows and Linux installers. | 10 | Pass |
| .factory/brief.json records the product scope and build command. | 8 | Pass |
| .factory/design.md records the original broadsheet visual system and art. | 9 | Pass |
| .factory/demo.md explains the clean demo sandbox. | 6 | Pass |
| .factory/claims.json maps every product claim to a browser test. | 9 | Fail in substance: F-1-1 to F-1-6 |
| MIT licensed. | 2 | Pass; confirmed by `LICENSE` |
| Built by Param Factory. | 4 | Pass |

README headings are “Manuscript Entity Indexer” (3 words), “What it does” (3),
“Privacy” (1), “Run and test” (3), “Desktop releases” (2), and “Project notes”
(2). All name their sections. The shell commands are executable instructions,
not sentences, and were run where relevant.

Terminology is otherwise stable: chapter = source writing file; manuscript =
selected work; name/entity = extracted record; mention = occurrence with
context; suggested alias = proposed second name; index/ledger = workspace;
timeline note = continuity fact; demo = isolated sample. F-1-9 and F-1-16 are
the remaining user-facing term mismatches.

## Demo and sandbox behavior

Result: pass.

- One click on “Try it with sample data” opened `/demo`.
- The first 390 px demo viewport already showed “The Glass Harbor papers · 3
  files”, the h1 “Review your entity index”, 13 entities and realistic names
  including Mara Venn, Ilya Chen and Glass Harbor.
- “Demo — sample data, nothing is saved”, Reset demo and Start for real remained
  visible in the banner.
- Renaming Mara Venn changed the in-memory demo. Reset demo restored Mara Venn.
- A seeded `mei:project:v1` value remained exactly `REAL-DATA-SENTINEL` through
  entry, edit and reset.
- A fresh direct `/demo` context requested only the deployment origin. After
  service-worker readiness, offline reload still showed the demo h1 and all 13
  entity rows.
- The landing page separately requested GitHub release metadata, matching its
  disclosure. No runtime AI call or embedded provider key exists.

## Claims audit

Every command in `.factory/claims.json` was run separately in a fresh clone.
The test runner created a fresh Chromium context for each. “Automated pass,
claim fail” means the command exited successfully but did not validate the
words registered for that claim.

| Claim id | Result | Evidence |
| --- | --- | --- |
| `demo-isolation` | Pass | Edit disappeared on reload. |
| `sample-preview` | Pass | Landing counts matched 13 rendered demo rows and named counts. |
| `local-processing` | Pass for its demo scope | Direct demo request log was same-origin only. |
| `offline-reload` | Pass | Demo reloaded offline with 13 rows. |
| `csv-export` | Pass | CSV header and one row per entity asserted. |
| `alias-review` | Pass for listed operations | Search, rename, classify, merge and undo passed. Explanation gap is F-1-5. |
| `timeline-ledger` | Pass | Added note stayed linked and Reset removed it. |
| `chapter-evidence` | Pass | Mara Venn source sentence opened. |
| `supported-imports` | Pass | Markdown, text and generated DOCX plus Latin, Han, Kana and Hangul fixtures passed. |
| `source-files-unchanged` | Pass | Imported Markdown bytes stayed unchanged. |
| `free-file-limit` | Pass | Fourth sorted file was omitted. |
| `local-project-storage` | Pass | Real index survived reload and Clear removed it. |
| `owner-license` | Pass | Recorded valid response removed the limit and allowed four files. |
| `billing-privacy` | **Automated pass, claim fail** | Test checks the initial API URL only; live checkout redirects to Dodo. F-1-1. |
| `checkout-available` | **Automated pass, claim fail** | Test expects a Dodo redirect while the claim calls it Sociobot-hosted. F-1-1. |
| `platform-download` | Pass for link selection | Recorded metadata selected macOS, Windows and Linux assets. Release assertions remain unlisted in F-1-6. |

The full local `npm test` run also passed 5 Vitest and 26 Playwright tests.
`npm run build` produced `dist/site`, and `npm run typecheck` passed.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files, so
there are no prior finding IDs to carry forward. The existing
`.factory/handoff.md` reported a PASS at candidate `8f5fef9`; its demo, 16 claim
commands, full suite, accessibility, build, live release, offline and bundle
statements were rechecked where applicable and passed. Its disclosed unsigned
desktop-package state remains visible. The handoff did not identify the claim
wording defects above, so no earlier “fixed” item has regressed.

## Structure, accessibility and link checks

Result: pass except F-1-7 to F-1-9.

- Live titles: `/` = “Manuscript Entity Indexer — Track story details”;
  `/demo` = “Demo — Manuscript Entity Indexer”; `/app` = “Index — Manuscript
  Entity Indexer”; `/privacy` = “Privacy — Manuscript Entity Indexer”; `/terms`
  = “Terms — Manuscript Entity Indexer”; missing route = “Page not found —
  Manuscript Entity Indexer”. All are at most 60 characters.
- Every tested route has `lang="en"`, one `main`, one h1, ordered headings, a
  skip link, the shared header/footer and a route-specific canonical. A meta
  description, Open Graph/Twitter metadata, SVG favicon, 180 px Apple icon and
  manifest are present. The social image is a real 1200 × 630 product image.
- `/missing-page-review-1` returned HTTP 404 and rendered the designed clipping
  page with a route home. There were no script exceptions; the browser emitted
  only its expected failed-resource message for the 404 document itself.
- SPA navigation changed the URL and title, moved focus to the new h1, and the
  back button restored `/demo` with focus on its h1. Direct deep links returned
  the intended page.
- The sitemap lists `/`, `/demo`, `/app`, `/privacy` and `/terms`. Robots points
  to it. All distinct live links were crawled; first-party routes, Sociobot,
  GitHub releases, the selected Linux asset and checkout chain resolved.
- The worker `verify-url.sh` passed with no console errors on `/`. Live Axe
  scans found zero violations on `/`, `/demo`, `/app`, `/privacy`, `/terms` and
  the 404 at 390 px. Local keyboard, dialog, mobile tab, reduced-motion and
  route tests passed.
- The monochrome broadsheet, red proof marks, generated desk still life and
  editorial rules are recognisably product-specific. This is not a generic
  SaaS template.

## Missed leverage

No additional feature finding. The brief asks for local manuscript entity
indexing. The product already imports the expected manuscript formats, exports
CSV, supports alias review and continuity notes, and ships a desktop path.
Cloud sync would conflict with the local-first promise. Model-assisted
extraction could improve recall, but the brief does not imply it strongly
enough to justify sending manuscript text or introducing a Sociobot key flow.
No decorative AI feature or embedded provider key was found.

## What would make this perfect

Resolve every finding above, then rerun the same cold first-read and full
checklist from scratch. In particular: make the checkout/Dodo disclosure match
the observed redirect; remove all completeness absolutes; register and test the
privacy, refund, alias-explanation and release claims; replace all mood labels
and jargon; keep all three facts above the desktop fold; retain Privacy in the
mobile header; and make the mobile Ledger controls discoverable under the tab
that names them. A perfect next review has zero findings and no claim whose
test passes without proving its exact words.

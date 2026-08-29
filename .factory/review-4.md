# Adversarial first-read review 4 — Manuscript Entity Indexer

Reviewed 29 August 2026 against the live deployment at
<https://manuscript-entity-indexer.sociobot.in> and repository commit
`8f3c9536ae331aac3b71e886c170e4c43192a964`.

## Verdict: PASS

There are zero findings. The site clears the cold-read, one-click demo,
claims, privacy, copy, history, structure, accessibility and release checks.
No claim test was left untested.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 were opened with no
stored site data. Nothing was scrolled before answering these questions.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It finds manuscript names and gives the author an index to review. | Pass |
| For whom? | Novelists working across languages. | Pass |
| What should I click first? | **Try it with sample data**; it says that it opens a three-chapter index. | Pass |

The exact supplying copy is “Review names found across your manuscript”, “For
novelists working across languages who need one private place to check
characters, places and aliases.”, “Try it with sample data”, and “It opens a
three-chapter index.” At 390 px the three facts end at 653.59, 698.59 and
743.59 px; at 1440 px they end at 763.66, 808.66 and 853.66 px. All are fully
within the respective initial viewports, at 16 px, with no horizontal overflow.

## Copy audit

Word counts use whitespace-delimited words. Hyphenated forms, prices, URLs and
file extensions count as one word. Data labels and numbering fragments are not
sentences. No landing or README sentence exceeds 22 words, uses a banned
marketing adjective, contains unexplained implementation jargon, changes a
term, or requires a rewrite. Headings name their content and controls name the
result of their action.

### Landing sentences and image alternatives

| Copy | Words | Result |
| --- | ---: | --- |
| For novelists working across languages who need one private place to check characters, places and aliases. | 16 | Pass |
| It opens a three-chapter index. | 5 | Pass |
| Your drafts stay on this device. | 6 | Pass — `local-processing` |
| Works after the first visit without internet. | 7 | Pass — `offline-reload` |
| $24 once removes the three-file limit. | 6 | Pass — `owner-license` |
| Manuscript sheets linked by thread to a black index ledger. | 10 | Pass (alt) |
| Repeated mentions become one author-reviewed ledger. | 6 | Pass |
| Both names include “Venn”. | 4 | Pass (sample evidence) |
| The sample workbench lists names beside their manuscript evidence and ledger. | 11 | Pass (alt) |
| Start with extracted names and the lines where they appear. | 10 | Pass |
| The workbench shows Captain Venn merged into Mara Venn as an alias. | 12 | Pass (alt) |
| Merge a suggested alias only after checking its evidence. | 9 | Pass |
| A chapter copy opens above the workbench for source checking. | 10 | Pass (alt) |
| Open the chapter copy without changing the source file. | 9 | Pass |
| Open Markdown, text and DOCX chapters. | 6 | Pass — `supported-imports` |
| Source files stay unchanged. | 4 | Pass — `source-files-unchanged` |
| Review names in Latin, Chinese, Japanese and Korean text. | 9 | Pass — `supported-imports` |
| Accept or reject each alias suggestion. | 6 | Pass — `alias-review` |
| Search names, chapter titles and excerpt text. | 7 | Pass — `chapter-search` |
| Add timeline notes and export the ledger. | 7 | Pass — `timeline-ledger`, `csv-export` |
| No manuscript upload. | 3 | Pass — `local-processing` |
| No source-file changes. | 3 | Pass — `source-files-unchanged` |
| The app only suggests matches. | 5 | Pass — reviewed alias actions require author action |
| You decide which names belong together. | 6 | Pass — `alias-review` |
| Free indexes three files at a time. | 7 | Pass — `free-file-limit` |
| The owner edition removes that limit. | 6 | Pass — `owner-license` |
| The purchase link starts at Sociobot, then opens Dodo’s hosted checkout. | 11 | Pass — `billing-privacy`, `checkout-available` |
| This app never receives card details. | 6 | Pass — `billing-privacy` |
| Keep a private continuity ledger beside your manuscript. | 8 | Pass |

### Landing headings, labels and actions

| Copy unit | Words | Result |
| --- | ---: | --- |
| Local processing | 2 | Pass |
| Markdown · text · DOCX | 3 | Pass |
| A continuity ledger for long drafts | 6 | Pass |
| Review names found across your manuscript | 6 | Pass — one plain-language h1 |
| Try it with sample data | 5 | Pass — result-naming action |
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
| Buy the owner edition | 4 | Pass — result-naming action |
| Choose a Linux installer | 4 | Pass — live phone action links to desktop releases, not an installer |
| macOS Apple silicon / macOS Intel / Windows x64 / Linux x64 | 3 / 2 / 2 / 2 | Pass — exact choices |
| All downloads | 2 | Pass — destination naming |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Review names found in your manuscript without uploading it. | 9 | Pass — `local-processing` |
| This local continuity ledger is for novelists working across languages. | 10 | Pass |
| It reads Markdown, text and DOCX chapters, then marks repeated names in Latin, Chinese, Japanese and Korean text. | 18 | Pass — `supported-imports` |
| The author reviews every alias merge. | 6 | Pass — `alias-review` |
| Try the isolated sample at https://manuscript-entity-indexer.sociobot.in/demo. | 6 | Pass |
| Demo edits stay in memory and disappear on reload. | 9 | Pass — `demo-isolation` |
| Opens a manuscript folder without changing its source files. | 9 | Pass — `source-files-unchanged` |
| Finds repeated person and place names in Latin, Chinese, Japanese and Korean text. | 13 | Pass — `supported-imports` |
| Shows detected mentions beside their chapter copy. | 7 | Pass — `chapter-evidence` |
| Suggests possible aliases and shows the matching rule. | 8 | Pass — `alias-review` |
| Lets the author merge, rename, classify, search and undo alias changes. | 11 | Pass — `alias-review`, `chapter-search` |
| Adds name-linked continuity notes and exports the ledger as CSV. | 10 | Pass — `timeline-ledger`, `csv-export` |
| Stores a real web index in local browser storage until the author clears it. | 14 | Pass — `local-project-storage` |
| Works after the first web visit without internet. | 8 | Pass — `offline-reload` |
| The free edition indexes three files at a time. | 9 | Pass — `free-file-limit` |
| A verified owner license costs $24 once and removes that limit. | 11 | Pass — `owner-license` |
| The purchase link starts at Sociobot, then opens Dodo's hosted checkout. | 11 | Pass — `billing-privacy`, `checkout-available` |
| License checks send only the license token. | 7 | Pass — `billing-privacy` |
| Manuscript processing runs on the device. | 6 | Pass — `local-processing` |
| The demo makes no cross-origin requests. | 6 | Pass — direct-demo request log |
| The landing page may request release metadata from GitHub. | 9 | Pass — disclosed, observed request |
| License verification sends only the pasted token to Sociobot. | 9 | Pass — `billing-privacy` |
| There is no analytics or advertising. | 6 | Pass — `no-tracking` |
| The app does not upload manuscript text or store it in the cloud. | 13 | Pass — `local-processing`, `no-tracking` |
| Read the shipped `/privacy` and `/terms` pages for the full policies. | 11 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Desktop builds also need the Rust toolchain and the platform packages listed in the Tauri documentation. | 16 | Pass |
| The exact deploy command is `npm run build:site`. | 8 | Pass |
| It writes the static site and route fallbacks to `dist/site`, with `index.html` at that root. | 15 | Pass |
| Run the desktop shell during development with `npm run tauri dev`. | 11 | Pass |
| Build a local platform package with `npm run tauri build`. | 10 | Pass |
| The release workflow builds macOS, Windows and Linux installers, plus `SHA256SUMS` and `latest.json`. | 13 | Pass — `release-workflow` |
| The landing page lists exact desktop installer choices and sends phone visitors to the desktop download page. | 17 | Pass — `platform-download` |
| `.factory/brief.json` records the product scope and build command. | 8 | Pass |
| `.factory/design.md` records the original broadsheet visual system and art. | 9 | Pass |
| `.factory/demo.md` explains the clean demo sandbox. | 6 | Pass |
| `.factory/claims.json` maps every product claim to a browser test. | 9 | Pass — all 20 tags checked |
| MIT licensed. | 2 | Pass |
| Built by Param Factory. | 4 | Pass |

README headings—“What it does”, “Privacy”, “Run and test”, “Desktop releases”
and “Project notes”—all identify their sections. Terminology remains stable:
**name**, **index**, **ledger**, **detected mention**, **suggested alias**, and
**demo**. “Entity” is not used for the visitor-facing task.

## Demo, privacy and claims

- The landing action reaches `/demo` in one click. The initial phone view is
  already a used workbench: *The Glass Harbor papers*, three files, populated
  names and evidence.
- The persistent banner reads “Demo — sample data, nothing is saved” and has
  **Reset demo** and **Start for real**. Editing a name wrote only
  `demo:mei:project:v1` in session storage; `mei:project:v1` remained absent.
  Reloading removed the edit, and Reset restored the sample.
- A direct `/demo` request log was same-origin only. The landing additionally
  requested the disclosed GitHub release metadata. The offline test reloaded
  the sample after the service worker had taken control.
- All 20 `claims.json` commands were run separately from a fresh clone at
  `/tmp/mei-review4-clean.uIvnJo` after `npm ci`. They passed. The
  `alias-review` command was repeated alone after an accidental overlapping
  local preview server and passed; no product test failed.

| Claim ids checked | Result |
| --- | --- |
| demo-isolation, sample-preview, local-processing, no-tracking, offline-reload | Pass |
| csv-export, alias-review, chapter-search, timeline-ledger, chapter-evidence | Pass |
| supported-imports, source-files-unchanged, free-file-limit, local-project-storage | Pass |
| owner-license, revoked-license, billing-privacy, checkout-available | Pass |
| platform-download, release-workflow | Pass |

The live landing and README were cross-checked against this registry. Each
claim-like statement above has a listed observable test or is a directly
observable navigation/documentation instruction. No unlisted claim remains.

## Earlier finding audit

Each finding in reviews 1–3 was checked in both the current source and the
live site. None is merely marked fixed.

| Earlier finding | Current result and confirmation |
| --- | --- |
| F-1-1 | Fixed: live purchase copy and 303 disclose Sociobot → Dodo; both billing tests pass. |
| F-1-2 | Fixed: no complete-detection promise; public copy says found or detected names. |
| F-1-3 | Fixed: import sentinel and full-route request logs are covered by `local-processing` and `no-tracking`. |
| F-1-4 | Fixed: unsupported refund-causation copy is absent; the narrower revoked-license behavior is tested. |
| F-1-5 | Fixed: the matching rule is visible before merge and asserted by `alias-review`. |
| F-1-6 | Fixed: the stated platform/workflow output has the `release-workflow` test. |
| F-1-7 / F-3-1 | Fixed: all three 16 px fact rows fit within both first-screen geometries. |
| F-1-8 | Fixed: Privacy remains visible in the 390 px header. |
| F-1-9 | Fixed: the mobile Ledger view contains name editing and timeline controls. |
| F-1-10 / F-3-2 | Fixed: `/app` says “Latin, Chinese, Japanese and Korean names”; no visitor-facing “Unicode”, “CJK”, or “candidate” remains. |
| F-1-11 | Fixed: the useful “Local processing” label remains in place of the mood label. |
| F-1-12 | Fixed: the preview heading is “Sample name index”. |
| F-1-13 | Fixed: the privacy section is labelled “Draft privacy”. |
| F-1-14 | Fixed: decorative issue number/year lore is absent. |
| F-1-15 | Fixed: the footer gives only the required version/build identity. |
| F-1-16 | Fixed: task language consistently uses “name”, including demo controls and notices. |
| F-2-1 | Fixed: chapter-title search is implemented and tested with a title absent from chapter text. |
| F-2-2 | Fixed: phones get a desktop-download link; desktop asset choices name platform and architecture. |
| F-2-3 | Fixed: the sample excludes the earlier ordinary-noun false positives; an author can ignore a mistaken name with persistence. |
| F-2-4 | Fixed: **Keep separate** is visible and asserted by `alias-review`. |
| F-2-5 | Fixed: no unverified “unsigned build” status is displayed. |
| F-2-6 | Fixed: 390 px content/control checks and computed first-screen text are 16 px or larger; visible targets are 44 px. |
| F-2-7 | Fixed: the privacy boundary tells the author that suggestions require their decision. |
| F-2-8 | Fixed: current Axe scans report zero violations on all checked routes. |

## Structure, accessibility and identity

| Check | Result |
| --- | --- |
| Routes | `/`, `/demo`, `/app`, `/privacy` and `/terms` return 200; an unknown route returns the designed 404 with HTTP 404. |
| Metadata | Each checked route has its own title, one h1, description, canonical, OG image, favicon and `lang=en`. |
| Navigation | Deep links work; a Demo → Back check restored `/privacy`, its title and focus to its h1, with a polite route announcement. |
| Crawl | All ordinary first-party, checkout, release, installer and factory links returned success. The 404 page’s skip link intentionally retains its own 404 response. |
| Header/footer | Consistent header, skip link, Privacy/Terms footer links and version appear on every route. |
| Accessibility | Live Axe reported zero violations on the landing, demo, app, Privacy, Terms and 404. No normal-route console errors occurred. |
| Security and privacy | Live CSP limits requests to self, GitHub release metadata and Sociobot licensing; no remote fonts/scripts were loaded. |
| Identity | The monochrome broadsheet, red proofing marks, editorial still life and clipped-paper 404 match the documented product-specific design, not a generic SaaS template. |

`npm test` passed from the clean clone (7 Vitest and 35 Playwright tests).
`npm run typecheck` passed. `npm run build` passed and produced `dist/site`;
the landing startup chunk is 0.47 kB gzip and the complete emitted JavaScript
set is well below the static-product budget.

## Missed leverage

No extra feature finding is warranted. The brief-implied adjacent jobs—folder
import, multilingual Markdown/text/DOCX input, author correction, alias review,
source evidence, continuity notes and CSV export—are present. Sync would
weaken the stated local-first boundary. An AI step is not necessary for this
offline, explainable rules-based job and would add an avoidable key, cost and
network decision.

## What would make this perfect

No product change is required for this round. Preserve the exact sample,
claim tests, live metadata/routing checks and copy audit when changing a
release, because each protects a visitor-facing promise that now passes.

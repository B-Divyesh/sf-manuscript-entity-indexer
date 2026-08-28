# Adversarial first-read review 2 — Manuscript Entity Indexer

Reviewed 28 August 2026 against the live deployment at
<https://manuscript-entity-indexer.sociobot.in> and repository commit
`a9ea079f1fd699863f2b431f083caaa0f8d121dd`.

## Verdict: FAIL

There are 11 findings: 6 blocking, 3 major and 2 minor. The first screen is
clear, the demo is one click away, the automated suite passes, and the visual
identity is distinct. The product still fails because one advertised search
mode does not work, platform detection offers incompatible downloads, the
sample index contains obvious non-names with no way to remove them, and three
findings from review 1 are only partly fixed.

## Cold first read, before scrolling

Fresh Chromium contexts were opened without stored data at 390 × 844 and
1440 × 900. Nothing was scrolled before these answers were recorded.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It finds names across a manuscript and puts them in a continuity index for review. | Pass |
| For whom? | Novelists working across languages and long drafts. | Pass |
| What should I click first? | “Try it with sample data”; the adjacent sentence says it opens a three-chapter index. | Pass |

The exact copy was “Review names found across your manuscript”, “For novelists
working across languages who need one private place to check characters,
places and aliases”, and “Try it with sample data”. All three numbered facts
fit above the fold at both sizes. The last fact ended at approximately 823 px
on the 390 × 844 viewport and 841 px on the 1440 × 900 viewport. There was no
horizontal overflow.

## Findings

### F-2-1 — BLOCKING — “Search evidence by chapter” does not search chapter titles

- Exact quote/location: landing method step 3, “Search evidence by chapter.”
- Evidence: in a fresh live context, importing `Unique-Chapter-Z.md` with the
  text “Mara Venn entered Glass Harbor.” produced two names. Searching for the
  exact chapter title `Unique-Chapter-Z` returned zero rows and “No names match
  ‘Unique-Chapter-Z’.” In `src/main.ts`, the filter checks names, aliases and
  excerpt text, but never `mention.documentTitle`. No claim entry names chapter
  search; `alias-review` searches only the renamed name “Mara Vale”.
- Why this fails: the landing page tells an author to use a search mode that
  does not exist. This is a false core-workflow claim.
- Concrete fix: include `mention.documentTitle` in search, register a
  `chapter-search` claim, and test a filename absent from chapter contents.
  Otherwise rewrite the sentence to “Search names and excerpt text.”

### F-2-2 — BLOCKING — Platform detection offers incompatible installers

- Exact quote/location: README, “The landing page selects an installer for the
  current platform”; landing download block, “Download for Linux” or “Download
  for macOS”; claim `platform-download`.
- Evidence: an iPhone 13 context and a Pixel 5 context both received “Download
  for Linux” linked to the x86_64 AppImage. A context with
  `navigator.platform = "MacIntel"` received the arm64
  `Manuscript.Entity.Indexer_0.1.5_aarch64.dmg`. `src/downloads.ts` treats every
  non-Mac/non-Windows value as Linux and selects the first matching extension.
  The passing claim test checks only `.dmg`, `.exe` and `.AppImage` suffixes;
  it does not check CPU architecture or unsupported mobile platforms.
- Why this fails: the primary download offered to a phone or Intel Mac cannot
  run on that device. The registered claim passes only because its assertion is
  weaker than the promise.
- Concrete fix: show “View desktop downloads” on mobile. On desktop, present
  explicit architecture choices or detect architecture reliably. Test iOS,
  Android, Intel Mac, Apple Silicon, Windows x64 and Linux x64 against exact
  asset names.

### F-2-3 — BLOCKING — The sample demo visibly indexes ordinary nouns as people and cannot dismiss them

- Exact location: the live demo's sample name list contains `地図` (“map”) and
  `帳面` (“notebook”), each labelled `PERSON · 1`.
- Evidence: the bundled sentences use these as ordinary nouns: “白港の地図には…”
  and “林梅が北文庫で帳面を開いた。” Selecting either row exposes only “Save
  entity” and “Add timeline note”; there is no remove, ignore or not-a-name
  action. The Han-name expression in `src/indexer.ts` treats any two-to-four Han
  characters before common Japanese particles as a name. Existing import tests
  assert true positives but no false positives.
- Why this fails: the one-click sample is supposed to show the product's value
  immediately. Instead it demonstrates an incorrect person index that the
  author cannot clean up. This makes the demo weak under the demo-sandbox
  contract and leaves the central editing job incomplete.
- Concrete fix: add “Ignore this name” with undo and project persistence,
  improve Japanese candidate filtering, remove these false positives from the
  bundled sample result, and add precision fixtures for common nouns before
  particles.

### F-1-3 — BLOCKING — The no-upload claim test still does not import a manuscript

- Carried forward from review 1; the finding is only partly fixed.
- Exact quotes: README, “Manuscript processing runs on the device” and “The app
  does not upload manuscript text or store it in the cloud”; landing, “Your
  drafts stay on this device.”
- Evidence: `@claim:no-tracking` navigates routes but never selects a file.
  `@claim:local-processing` opens the already bundled demo and merges an alias;
  it also never imports user text. Both commands pass, but neither observes the
  network while manuscript content enters the app. A separate manual live check
  imported a distinctive sentence and observed no request, so the present
  behavior is correct; the required regression proof is absent.
- Why this fails: the most material privacy promise is not asserted by its
  registered tests. A later upload regression could pass both tests.
- Concrete fix: extend one claim test to import text containing a unique
  sentinel while recording every request URL, method and body. Assert that no
  request occurs after import and that the sentinel never appears in network
  data.

### F-1-4 — BLOCKING — Refund revocation is still not tested

- Carried forward from review 1; the sentence moved to Terms but remains a
  product claim.
- Exact quote/location: `/terms`, “Approved refunds revoke the license.”
- Evidence: `@claim:refund-revocation` intercepts the verification endpoint and
  supplies an already invalid response with `reason: "revoked"`. It proves only
  that the client respects `valid: false`; it does not cause or observe an
  approved refund, a webhook, or a license-state transition.
- Why this fails: the claim is about billing-system behavior, not about how the
  client handles an arbitrary invalid token. The repair does not establish the
  promised causal link.
- Concrete fix: add a gateway contract fixture that creates an active license,
  applies a recorded approved-refund event, and then verifies the token is
  rejected. If that cannot be tested here, replace the sentence with the
  narrower tested fact: “A revoked license returns to the three-file limit.”

### F-1-16 — BLOCKING — User-facing “entity” jargon remains after being marked fixed

- Carried forward from review 1; the finding is only partly fixed.
- Exact quotes/locations: landing “Sample entity index”; landing image alt “The
  sample workbench lists entities…”; README “entity-linked continuity notes”
  and “entity ledger”; live demo button “Save entity”; live notices “Saved the
  entity.” and “Exported 13 entities as CSV.”
- Evidence: these strings are present live and in `src/main.ts`/`README.md`.
  `.factory/polish-1.md` says demo-facing “entity/entities” was replaced and the
  terminology table says the product word is “name”.
- Why this fails: the product changes terms between “name” and “entity” during
  the same task, and the previous repair record overstates what changed.
- Concrete fix: use “name” everywhere a visitor sees the concept: “Sample name
  index”, “Save name”, “Saved the name”, “Exported 13 names as CSV”, “name-linked
  continuity notes”, and matching alt text. Keep `Entity` only in code.

### F-2-4 — MAJOR — Rejecting an alias is an unlisted, untested claim

- Exact quote/location: landing method step 2, “Accept or reject each alias
  suggestion.”
- Evidence: `alias-review` lists and tests merge and undo, but its registered
  claim does not mention rejection and its test never clicks “Keep separate”.
- Why this fails: the landing makes a specific control promise without the
  required claim entry and observable regression test.
- Concrete fix: add rejection to `alias-review` and assert that “Keep separate”
  removes the suggestion without merging either name, including after a real
  project reload.

### F-2-5 — MAJOR — “Unsigned build” is an unlisted release claim

- Exact quote/location: live landing download block, “Unsigned build ·
  Manuscript.Entity.Indexer_0.1.5_amd64.AppImage”.
- Evidence: no claim in `.factory/claims.json` covers signature state.
  `release-workflow` checks runner names and two output filenames only; it does
  not inspect signatures or release metadata for signing status.
- Why this fails: signing status is security information an installer can rely
  on. It must be verified, not inferred from display copy.
- Concrete fix: publish signing status in `latest.json`, register it as a claim,
  and test the displayed status against that manifest. Otherwise remove the
  label and link to a release page that states verified artifact details.

### F-2-6 — MAJOR — Important phone copy is below the design's 16 px minimum

- Exact location: 390 px live landing. Computed sizes include 12.48 px for “Try
  it with sample data”, 14.08 px for all three first-screen facts, 10.88 px for
  “Local processing”, and 12.48 px for payment disclosure. Many captions and
  footer links are 12–13 px.
- Evidence: `.factory/design.md` says “Body text never drops below 16 px.” The
  accessibility test checks small text in the demo `main` only, so it does not
  catch the landing or footer values.
- Why this fails: the key action, proof points and payment disclosure are hard
  to read in a 30-second phone scan and contradict the recorded visual system.
- Concrete fix: make informative text and controls at least 16 CSS px at 390
  px, then add a landing-wide computed-size regression test. Decorative folio
  numbers may remain smaller if hidden from assistive technology.

### F-2-7 — MINOR — “Small, visible rules” does not tell the reader what the product does

- Exact quote/location: landing privacy section, “The index uses small, visible
  rules.”
- Why this fails: “rules” could mean matching logic or decorative lines, and
  “small” and “visible” do not give an author a usable fact.
- Concrete fix: write “The app only suggests matches. You decide which names
  belong together.” The following duplicate sentence can then be removed.

### F-2-8 — MINOR — Two live ARIA/landmark violations remain

- Exact locations: landing `.preview-ledger` is an `<aside>` nested inside the
  main section; demo `#timeline-panel` is an `<aside role="tabpanel">`.
- Evidence: live Axe scans at 1440 × 900 report
  `landmark-complementary-is-top-level` (moderate) on `/` and
  `aria-allowed-role` (minor) on `/demo`. The repository suite filters out all
  impacts below serious, so both violations pass CI.
- Why this fails: the semantic roles are invalid or misleading even though no
  serious/critical Axe issue is present.
- Concrete fix: use neutral `<div>` elements for these non-complementary panels,
  retain the tabpanel role where needed, and make the Axe test fail on every
  violation unless a documented exception exists.

## Copy audit

Counts are whitespace-delimited. Hyphenated terms, prices, filenames and URLs
count as one word. Code blocks and isolated data values are not sentences. No
sentence exceeds 22 words and no banned marketing word appears. Headings,
labels and actions are audited separately because many are fragments.

### Landing-page sentences, including image alternatives

| Sentence | Words | Result |
| --- | ---: | --- |
| For novelists working across languages who need one private place to check characters, places and aliases. | 16 | Pass |
| It opens a three-chapter index. | 5 | Pass |
| Your drafts stay on this device. | 6 | Flag: F-1-3 test gap |
| Works after the first visit without internet. | 7 | Pass |
| $24 once removes the three-file limit. | 6 | Pass |
| Manuscript sheets linked by thread to a black index ledger. | 10 | Pass (alt) |
| Repeated mentions become one author-reviewed ledger. | 6 | Pass |
| At dusk, Mara Venn stepped off the ferry at Glass Harbor. | 11 | Pass (sample) |
| Both names include “Venn”. | 4 | Pass (sample) |
| The sample workbench lists entities beside their manuscript evidence and ledger. | 11 | Flag: F-1-16 (alt) |
| Start with extracted names and the lines where they appear. | 10 | Pass |
| The workbench shows Captain Venn merged into Mara Venn as an alias. | 12 | Pass (alt) |
| Merge a suggested alias only after checking its evidence. | 9 | Pass |
| A chapter copy opens above the workbench for source checking. | 10 | Pass (alt) |
| Open the chapter copy without changing the source file. | 9 | Pass |
| Open Markdown, text and DOCX chapters. | 6 | Pass |
| Source files stay unchanged. | 4 | Pass |
| Review names in Latin, Chinese, Japanese and Korean text. | 9 | Pass |
| Accept or reject each alias suggestion. | 6 | Flag: F-2-4 |
| Search evidence by chapter. | 4 | Flag: F-2-1 |
| Add timeline notes and export the ledger. | 7 | Pass |
| No manuscript upload. | 3 | Flag: F-1-3 test gap |
| No source-file changes. | 3 | Pass |
| The index uses small, visible rules. | 6 | Flag: F-2-7 |
| You decide which names belong together. | 6 | Pass |
| Free indexes three files at a time. | 7 | Pass |
| The owner edition removes that limit. | 6 | Pass |
| The purchase link starts at Sociobot, then opens Dodo’s hosted checkout. | 11 | Pass |
| This app never receives card details. | 6 | Pass |
| Keep a private continuity ledger beside your manuscript. | 8 | Pass |

### Landing headings, labels and actions

| Copy unit | Words | Result |
| --- | ---: | --- |
| MEI | 1 | Pass: wordmark |
| Manuscript Entity Indexer | 3 | Pass: product name |
| Demo | 1 | Pass: navigation |
| Workbench | 1 | Pass: navigation |
| Privacy | 1 | Pass: navigation |
| Local processing | 2 | Pass |
| Markdown · text · DOCX | 5 | Pass |
| A continuity ledger for long drafts | 6 | Pass |
| Review names found across your manuscript | 6 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Sample entity index | 3 | Flag: F-1-16 |
| Sample output | 2 | Pass |
| Review each detected mention before you merge names | 8 | Pass |
| Names · 13 | 3 | Pass |
| Evidence · 01 — The tide ledger | 7 | Pass |
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
| Buy the owner edition | 4 | Pass: result-naming action |
| Desktop app · v0.1.5 | 4 | Pass |
| Download for Linux | 3 | Flag: F-2-2 on mobile |
| Unsigned build | 2 | Flag: F-2-5 |
| All downloads | 2 | Pass: destination link |
| Built by Param Factory | 4 | Pass |
| Version 0.1.5 | 2 | Pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Review names found in your manuscript without uploading it. | 9 | Flag: F-1-3 test gap |
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
| Adds entity-linked continuity notes and exports the ledger as CSV. | 10 | Flag: F-1-16 |
| Stores a real web index in local browser storage until the author clears it. | 14 | Pass |
| Works after the first web visit without internet. | 8 | Pass |
| The free edition indexes three files at a time. | 9 | Pass |
| A verified owner license costs $24 once and removes that limit. | 11 | Pass |
| The purchase link starts at Sociobot, then opens Dodo’s hosted checkout. | 11 | Pass |
| License checks send only the license token. | 7 | Pass |
| Manuscript processing runs on the device. | 6 | Flag: F-1-3 test gap |
| The demo makes no cross-origin requests. | 6 | Pass |
| The landing page may request release metadata from GitHub. | 9 | Pass |
| License verification sends only the pasted token to Sociobot. | 9 | Pass |
| There is no analytics or advertising. | 6 | Flag: F-1-3 test gap |
| The app does not upload manuscript text or store it in the cloud. | 13 | Flag: F-1-3 test gap |
| Read the shipped /privacy and /terms pages for the full policies. | 11 | Pass |
| Requirements: Node.js 20 or newer. | 5 | Pass |
| Desktop builds also need the Rust toolchain and the platform packages listed in the Tauri documentation. | 16 | Pass |
| The exact deploy command is npm run build:site. | 8 | Pass |
| It writes the static site and route fallbacks to dist/site, with index.html at that root. | 15 | Pass |
| Run the desktop shell during development with npm run tauri dev. | 11 | Pass |
| Build a local platform package with npm run tauri build. | 10 | Pass |
| The release workflow builds macOS, Windows and Linux installers, plus SHA256SUMS and latest.json. | 13 | Pass |
| The landing page selects an installer for the current platform. | 10 | Flag: F-2-2 |
| .factory/brief.json records the product scope and build command. | 8 | Pass |
| .factory/design.md records the original broadsheet visual system and art. | 9 | Pass |
| .factory/demo.md explains the clean demo sandbox. | 6 | Pass |
| .factory/claims.json maps every product claim to a browser test. | 9 | Flag: F-2-1, F-2-4 and F-2-5 |
| MIT licensed. | 2 | Pass |
| Built by Param Factory. | 4 | Pass |

README headings are “Manuscript Entity Indexer” (3 words), “What it does”
(3), “Privacy” (1), “Run and test” (3), “Desktop releases” (2), and “Project
notes” (2). Each names its section. README code blocks are commands, not
sentences, and are excluded from sentence counts.

### Terminology check

| Concept | Words currently used | Result |
| --- | --- | --- |
| A detected person/place | name; entity | Flag: F-1-16; use “name” |
| The saved result | index; ledger | Acceptable distinction: index is the collection, ledger is the editable record |
| A source occurrence | mention; evidence | Acceptable distinction: a mention is one occurrence; evidence is the source view |
| Temporary sample | demo; sample project; sample data | Acceptable |
| Paid version | owner edition; owner license | Acceptable distinction: edition versus credential |

## Demo and sandbox verification

- One click from the unscrolled landing action opened `/demo`.
- The first demo screen showed *The Glass Harbor papers*, three files and 13
  populated rows. The persistent banner said “Demo — sample data, nothing is
  saved” and exposed “Reset demo” and “Start for real”.
- Renaming Mara Venn changed only `demo:mei:project:v1` in session storage.
  A `mei:project:v1 = REAL-SENTINEL` value in local storage remained unchanged.
- Reset restored Mara Venn. “Start for real” removed the demo namespace and
  opened the real workbench without reading the sample as real data.
- A direct live `/demo` flow, including an alias merge, made only same-origin
  requests. A live real-project import made no request after file selection.
- The registered offline reload test passed from the clean clone.
- The demo still fails overall because of F-2-3.

## Claim test results

Every command in `.factory/claims.json` was run separately from the clean clone
`/tmp/mei-review2.a1U9qj/repo` at the reviewed commit. Command logs are
`/tmp/mei-review2-<claim-id>.log`.

| Claim id | Command result | Review result |
| --- | --- | --- |
| `demo-isolation` | Pass | Confirmed live with a real-storage sentinel |
| `sample-preview` | Pass | Confirmed 13 rendered demo rows |
| `local-processing` | Pass | Test does not import user text; F-1-3 |
| `no-tracking` | Pass | Test does not import user text; F-1-3 |
| `offline-reload` | Pass | Confirmed |
| `csv-export` | Pass | Confirmed |
| `alias-review` | Pass | Listed actions pass; rejection remains unlisted, F-2-4 |
| `timeline-ledger` | Pass | Confirmed |
| `chapter-evidence` | Pass | Confirmed |
| `supported-imports` | Pass | Positive fixtures pass; demo precision fails, F-2-3 |
| `source-files-unchanged` | Pass | Confirmed |
| `free-file-limit` | Pass | Confirmed |
| `local-project-storage` | Pass | Confirmed |
| `owner-license` | Pass | Confirmed with recorded valid response |
| `billing-privacy` | Pass | Confirmed Sociobot → Dodo redirect and token-only request |
| `checkout-available` | Pass | Live endpoint returned 303 to Dodo checkout |
| `platform-download` | Pass | Claim fails on Intel Mac and mobile; F-2-2 |
| `refund-revocation` | Pass | Assertion does not exercise a refund; F-1-4 |
| `release-workflow` | Pass | Workflow and current release assets confirmed |

The passing command status is not enough for F-1-3, F-1-4 or F-2-2 because
their assertions do not establish the registered claims. The unlisted live
claims are chapter search (F-2-1), alias rejection (F-2-4) and unsigned-build
status (F-2-5).

## Earlier finding audit

Every item from `.factory/review-1.md` was checked against the live site and
current source rather than accepted from `.factory/polish-1.md`.

| Earlier id | Current result | Evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Copy names the Sociobot → Dodo redirect; live checkout follows it |
| F-1-2 | Fixed | “Every” absolutes are gone from landing and README |
| F-1-3 | Half-fixed; BLOCKING again | Claim exists, but neither registered test imports manuscript text |
| F-1-4 | Half-fixed; BLOCKING again | Mocked revoked response does not test refund-caused revocation |
| F-1-5 | Fixed | Venn matching reason is visible and asserted |
| F-1-6 | Fixed | Registered workflow check and live multi-platform release assets exist |
| F-1-7 | Fixed | Three facts fit at 1440 × 900 |
| F-1-8 | Fixed | Privacy remains visible at 390 px |
| F-1-9 | Fixed | Mobile tab is “Ledger” and exposes name editing |
| F-1-10 | Fixed | Writing systems are named without Unicode/candidate jargon |
| F-1-11 | Fixed | “Local processing” replaces the mood label |
| F-1-12 | Fixed | “Sample entity index” is descriptive, though “entity” triggers F-1-16 |
| F-1-13 | Fixed | “Draft privacy” names the topic |
| F-1-14 | Fixed | Decorative issue/year lore is gone |
| F-1-15 | Fixed | Footer shows only the version |
| F-1-16 | Half-fixed; BLOCKING again | “Entity/entities” remains in landing, README and demo controls/notices |

## Structure, accessibility and visual identity

| Check | Result |
| --- | --- |
| Route titles | Pass; all six checked titles follow the required pattern and are 32–51 characters |
| One h1, `main`, `lang=en` | Pass on `/`, `/demo`, `/app`, `/privacy`, `/terms` and the 404 |
| Description, canonical, OG/Twitter, favicon | Pass; canonicals update per route and the social image is 1200 × 630 |
| Designed 404 | Pass; an unknown URL returns HTTP 404 and the styled clipping page |
| Deep links, History API, back button, focus | Pass; route changes and back navigation focus the new h1 |
| Link crawl | Pass; all internal routes, checkout, current download, release page, factory link and metadata assets resolved |
| Header/footer and legal links | Pass on every route, including mobile and 404 |
| Mobile overflow and 44 px controls | Pass in the demo; F-2-6 covers undersized text |
| Axe | Fail; two lower-impact semantic violations remain, F-2-8 |
| Visual identity | Pass; the monochrome broadsheet, rule-led layout and red proof marks are product-specific rather than a generic SaaS template |
| First-load JavaScript | Pass; production build totals about 28.2 KB gzip across emitted JS chunks and landing startup loads under 10 KB |
| Motion policy | Pass; reduced-motion handling is present |
| Security headers | Pass; live CSP, frame restriction, referrer policy and MIME-sniffing protection are present |

The factory URL verifier passed the live root in 1.2 seconds with one h1,
`lang=en`, a main landmark, complete image alternatives and no console errors.
Live Axe scans found no serious or critical violations; F-2-8 records the two
remaining moderate/minor violations instead of discarding them.

## Build and test verification

- `npm test`: pass — 5 Vitest tests and 31 Playwright tests.
- `npm run typecheck`: pass.
- `npm run build`: pass — writes `dist/site`.
- Every one of the 19 claim commands: pass when invoked separately.
- `cargo test --manifest-path src-tauri/Cargo.toml`: not completed because this
  disposable worker lacks the documented GLib/WebKit Linux system packages;
  compilation stopped at missing `glib-2.0.pc`. This is not a claim-test
  failure and the prerequisite is disclosed in README.

## Missed leverage

The obvious missing capability is not decorative AI. It is the ability to
dismiss a false detected name and undo that decision, demonstrated by F-2-3.
Import and CSV export already exist. An optional Sociobot-key-assisted review
could later rank uncertain candidates, but it should not be added until the
local, non-AI correction path works; it would also need explicit send-preview,
cost, undo and recorded-fixture claim coverage.

## What would make this perfect

Resolve every finding above: make chapter-title search real, stop offering
incompatible downloads, let authors dismiss false names, strengthen the
privacy and refund tests, remove remaining “entity” jargon, cover alias
rejection and signing status, raise phone text to 16 px, replace the vague
rules sentence, and clear both Axe violations. Then rerun all claim commands
from a clean clone and repeat the live phone/desktop review with zero findings.

# Independent verification 4 — FAIL

**Candidate:** `ad0b3f84b8a4d1dcc249f40546a7c4df7ffbccb7`  
**Live URL:** <https://manuscript-entity-indexer.sociobot.in>  
**Verified:** 28 August 2026 UTC  
**Decision:** **FAIL — paid checkout, paid return, PWA update, core CJK evidence, claims, and release-provenance blockers remain**

## Cold first read — PASS

A fresh desktop and 390×844 mobile context both answer the required questions
inside the first viewport:

- **What:** “Index every name across your manuscript.”
- **For whom:** novelists working across languages who need to check
  characters, places, and aliases.
- **First click:** “Try it with sample data,” followed by “It opens a
  three-chapter index.”

The one-click action opens `/demo` with 13 sample entities and the persistent
“Demo — sample data, nothing is saved” banner. On mobile, the h1 ends at 448 px,
the audience sentence at 550 px, the sample action at 659 px, and all three
plain facts at 821 px in an 844 px viewport.

## Mandatory claims gate — PASS, with a separate coverage defect

`.factory/claims.json` exists. After `npm ci`, every declared command was run
separately from the demo entry point. All 13 commands passed:

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `local-processing` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `alias-review` | PASS |
| `timeline-ledger` | PASS |
| `chapter-evidence` | PASS |
| `supported-imports` | PASS |
| `source-files-unchanged` | PASS |
| `free-file-limit` | PASS |
| `local-project-storage` | PASS |
| `owner-license` | PASS with recorded verification response |
| `platform-download` | PASS with recorded Linux release metadata |

Each id occurs in exactly one `@claim:<id>` test. The separate claims-contract
finding below concerns user-facing statements that are not represented by a
claim entry or fully covered by its sandbox, not a failure of these 13 commands.

## Clean-checkout quality gates

```text
npm ci                                      PASS — 68 packages; 0 audit findings
npm test                                    PASS — 4 Vitest + 21 Playwright
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — exact production dist/site
npm run build:app                           PASS — dist/app
npm run test:a11y                           PASS — 4 tests
npm audit --omit=dev                        PASS — 0 vulnerabilities
npm audit                                   PASS — 0 vulnerabilities
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                            PASS — 2 Rust tests + doc tests
```

The first Rust attempt correctly identified missing host GLib metadata. After
installing the Linux Tauri packages named in the release workflow, the same
locked command passed. No product code was changed.

Production budgets pass. Initial JavaScript is 2,026 bytes gzip, all emitted
JavaScript is 27,791 bytes gzip, CSS is 5,174 bytes gzip, and the mobile hero
AVIF is 20,334 bytes. No remote font is loaded.

## Independent functional exercise

The local suite and fresh live contexts covered normal, boundary, invalid, and
recovery paths:

- The demo loaded 13 entities. Alias merge/undo and keep-separate, search and
  empty-search recovery, timeline notes, entity editing, source-dialog
  open/Escape/focus return, reset, and CSV export worked.
- Quotes and HTML-like text in an entity name and timeline note rendered as
  text, not markup. CSV doubled embedded quotes correctly.
- Demo reset removed edits while a sentinel `mei:project:v1` real-data value
  remained unchanged. The demo made no cross-origin request.
- A real import made no request after folder selection and wrote only
  `mei:project:v1`. Empty folders and malformed DOCX files produced announced,
  actionable errors; a later four-file Markdown/text/DOCX import recovered.
  The free limit selected the first three paths and reported the omitted file.
- Latin, Han, Kana, and Hangul names appeared after the recovery import.
- An invalid pasted license called only the Sociobot verify URL, stored the
  namespaced token/verdict, and rendered “License no longer active.”

## Accessibility, responsive behavior, and browser health

- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200; an unknown route
  returns the designed HTTP 404. Every route has `lang=en`, one h1, and one
  main landmark with a route-specific title.
- Axe found zero serious/critical issues on all six routes. Normal routes had
  no console, page, or failed-request errors. The expected browser diagnostic
  for the deliberately requested 404 document is not counted as a product
  runtime error.
- The first Tab exposes a 48 px-high skip link with a visible solid outline.
  SPA navigation and browser Back focus the destination h1. `/`, entity arrows,
  mobile tabs, Enter, Escape, and dialog focus return are keyboard-operable.
- At 390×844, document width is exactly 390 px, visible controls are at least
  44 px, ArrowRight selects and focuses Evidence, and reduced-motion mode has
  zero running animations.
- `/opt/fleet/lib/verify-url.sh` passed live root in 1,354 ms with no errors,
  title, `lang=en`, one h1, main, image alt text, and labelled buttons.
- With 4× CPU throttling, the largest observed interaction duration across
  entity select, alias merge, and undo was 88 ms.

Three cold live mobile Lighthouse runs:

| Run | Performance | Accessibility | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 97 | 100 | 1,000 ms | 183 ms | 0 |
| 2 | 98 | 100 | 1,027 ms | 156 ms | 0 |
| 3 | 100 | 100 | 1,027 ms | 84 ms | 0 |

## Deployment, privacy, headers, release, and rate limit

- Live root HTML and every emitted non-map asset match this candidate's
  `dist/site` byte for byte. Bootstrap SHA-256 is
  `84399a7653f6a1db5676341841bd50081b68182cda918c96c735cb416ed0f88c`;
  CSS SHA-256 is
  `0a1a8ec3089659d0f4dd303939181d7c8d28b2dd013500215ccc38a9a3f956e7`.
- Live policy headers include HSTS, `nosniff`, strict-origin referrer policy,
  restrictive permissions policy, and a CSP limited to self, GitHub release
  metadata, and the Sociobot API. Hashed assets are immutable for one year;
  HTML and `sw.js` revalidate after 30 seconds.
- The service worker registers, activates, and supports a fresh offline demo
  reload. Its update behavior fails for an already cached shell, as detailed
  below.
- A burst of 45 invalid verification requests returned 200 for requests 1–30,
  then 429 for requests 31–45. The first 429 carried `Retry-After: 4`.
- GitHub release `v0.1.2` exposes 11 assets covering macOS arm64/x64, Windows,
  and Linux plus `SHA256SUMS` and valid `latest.json`. The AMD64 DEB is package
  `manuscript-entity-indexer`, version `0.1.2`, architecture `amd64`; SHA-256
  `1798df3e043939293a73b339aa9b0689126db91cb7c473a827120158bf72e48b`
  matches the manifest.
- `public/install.sh` downloaded and verified the 77,322,744-byte AppImage,
  installed it into an isolated temporary directory, and the executable
  reported its AppImage runtime version.
- Sign-in is not used. Backend concurrency and tenant persistence are not
  applicable to this local/static product.

## Release-blocking defects

### P1 — The advertised $24 checkout is unavailable

Both live purchase links target
`https://api.sociobot.in/api/v1/products/manuscript-entity-indexer/checkout`.
A fresh GET returns HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

A buyer cannot start checkout. This is a current external deployment/product
registration failure, not the previously repaired static deployment issue.

### P1 — A checkout-return license is not verified or unlocked on first load

Live reproduction:

1. Open `/app?license=return-token-invalid` in an empty browser context.
2. The app stores `sb_license:manuscript-entity-indexer`, strips the query
   string, and stays on `/app`.
3. The edition heading remains **Free edition** and no `/verify` request occurs.

`src/main.ts` computes `cachedLicenseState()` before calling
`captureLicense()`, then verifies only when that stale state was already active.
Even after checkout is enabled, a new buyer does not unlock until another load.
The owner-license claim test covers the paste field and mocked verification,
not this required return path.

### P1 — Existing PWA users cannot receive repaired shells

`public/sw.js` and cache name `mei-shell-v1` have not changed since commit
`11ed920`, while navigation uses cache-first behavior. A live isolated
reproduction seeded `/` in `mei-shell-v1` with “STALE SHELL SENTINEL,” called
`registration.update()`, and reloaded **while online**. The reload still showed
only the stale sentinel. Because the service-worker bytes do not change, no
install/activate cycle refreshes the precache. Earlier visitors can remain
pinned to pre-repair HTML indefinitely.

### P1 — CJK place occurrences create duplicate evidence and inflated counts

The Han-name and CJK-place regular expressions can both return the same name at
the same character position, and `indexDocuments` does not deduplicate them.
The shipped live sample contains three literal `白港` occurrences but reports
five mentions; two source occurrences each appear twice. It contains one
literal `赤橋` occurrence but reports two identical evidence rows. Duplicate
mentions also reuse the same generated id. This makes the chapter-linked ledger
and mention counts unreliable for the product's central multilingual job.

### P1 — User-facing claims are missing from the required claims ledger

The mandatory claims contract says every statement a visitor may rely on must
be listed and tested. Examples not represented by a corresponding claim entry
and sandbox assertion include:

- README: “Lets the author merge, rename, classify, search and undo aliases.”
  The alias claim covers merge and undo, not classify or search.
- Privacy page: desktop index persistence, license checks sending only the
  token, and the app never receiving card details.
- Landing/README: macOS, Windows, and Linux builds. The platform claim's
  recorded sandbox asserts only the Linux button.

Some behaviors passed this verifier's ad-hoc checks and release inspection,
but that does not satisfy the required repeatable `.factory/claims.json`
contract. The attached claims rules explicitly make an unlisted claim a failed
review.

### P1 — Published desktop installers do not identify this candidate

Release `v0.1.2` targets commit
`4eb4bc14d43b3d11f0b99110cb793fe178b69e45`, an ancestor of the candidate.
Candidate commit `324c89e` subsequently changed runtime files `index.html`,
`src/bootstrap.ts`, `src/downloads.ts`, and `src/main.ts`, but package version
and release assets were not rebuilt. The downloaded installer is valid, but it
is not an artifact built from the candidate under verification.

## Other defects

### P2 — The required footer link is dead

`https://param.sociobot.in` is linked as “Built by Param Factory” on every
route. Three fresh attempts failed DNS resolution. This violates the site
contract's no-dead-links requirement.

### P3 — Apple touch icon does not match the specified size

The linked `apple-touch-icon.png` is 256×256, while the site contract specifies
a 180 px Apple touch icon. It renders, but does not meet the stated artifact
requirement.

## Evidence

Ephemeral verifier evidence is under `/work/evidence/verify-4/`, including live
screenshots, URL-verifier output, Lighthouse JSON, live build copies and
hashes, release metadata, checksums, and the downloaded DEB. Repository source
was not modified except for this report and the required handoff update.

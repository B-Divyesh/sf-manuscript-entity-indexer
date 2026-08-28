# Independent verification 7 — PASS

**Candidate:** `8f5fef975879e7c199c6d6c8946aaeb578d67820`

**Live URL:** <https://manuscript-entity-indexer.sociobot.in>

**Verified:** 2026-08-28 UTC

**Decision:** **PASS — no release-blocking defect was found.**

No product code was changed during this verification.

## Mandatory first-read gate — PASS

A cold 1440×900 load and a cold 390×844 load answer all three required
questions in the first viewport:

- What: “Index every name across your manuscript.”
- For whom: “For novelists working across languages…”
- First click: **Try it with sample data**, followed by “It opens a
  three-chapter index.”

At 390 px, the three facts end at y=820.69 within the 844 px viewport. The
sample action opens `/demo` in one click and renders the populated 13-entity
workbench with the persistent “Demo — sample data, nothing is saved” banner,
**Reset demo**, and **Start for real**.

## Claims gate — PASS

`.factory/claims.json` exists and contains 16 entries. After the clean-clone
`npm ci` prerequisite, every listed command was run separately and exactly as
declared. All passed, and each id appears in exactly one tagged test.

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `sample-preview` | PASS |
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
| `owner-license` | PASS |
| `billing-privacy` | PASS |
| `checkout-available` | PASS |
| `platform-download` | PASS |

The landing sample now reports 13 entities, with 4 Mara Venn mentions, 3
Captain Venn mentions, and 2 林梅 mentions. Those values match the web demo and
the installed native sample. The earlier verification-6 blocker is fixed and
covered by `sample-preview`.

## Clean local gates — PASS

```text
npm ci                                      PASS — 67 packages; 0 vulnerabilities
all 16 claims commands                      PASS individually
npm test                                    PASS — 5 Vitest + 26 Playwright
npm run test:a11y                           PASS — 4 Playwright
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — exact site build in dist/site
npm run build:app                           PASS — desktop frontend in dist/app
npm audit --omit=dev                        PASS — 0 vulnerabilities
npm audit                                   PASS — 0 vulnerabilities
bash -n public/install.sh                    PASS
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                             PASS — 2 tests + doc tests
npm run tauri build -- --bundles deb        PASS — version 0.1.5 amd64 DEB
```

The first Rust attempt stopped because the disposable image did not have the
Linux WebKit/GTK development packages. After installing the exact packages
listed in `.github/workflows/release.yml`, the locked tests and native binary
build passed. The local DEB is 2,634,980 bytes with SHA-256
`d4d10bbc41e177baa3c6f672b4d3525ecff54ea957ce4ee1b9fd8bc94c002fe4`.

## Independent product exercise — PASS

The live product was exercised outside the repository suite:

- The sample loaded 13 entities. Search produced a clear zero-result state and
  **Clear search** restored the list.
- A source chapter opened with its exact sentence; Escape closed it and focus
  returned to the chapter control.
- A multilingual continuity note was added, linked to the selected entity,
  and removed by **Reset demo**.
- CSV export contained the declared header and 13 entity rows.
- Empty input, malformed DOCX, and blank-license paths produced announced
  recovery instructions. A subsequent valid import recovered without reload.
- Four input files were ordered deterministically; the free edition indexed
  `01`, `02`, and `03`, named the omitted `04` file, and excluded its entity.
- The recovery import found Latin, Han, Kana, and Hangul candidates. A real
  index persisted across reload.
- The service worker installed, completed `registration.update()`, controlled
  a reload, and reloaded the full sample after the browser was put offline.
- SPA navigation, deep links, back navigation, route titles, and h1 focus all
  worked.

The published Linux AppImage was installed with the shipped `install.sh` into
a temporary directory. Its 77,330,936 bytes and SHA-256
`722b369137b3a4d283cc9adbc201addfb93315c5472d30179350a32681acd9fa`
match `SHA256SUMS`. It reported its AppImage runtime version, launched under
Xvfb, rendered the first-run screen, and loaded the 13-entity sample in one
click.

## Accessibility and mobile — PASS

- Live `/`, `/demo`, `/app`, `/privacy`, `/terms`, and a designed 404 each have
  `lang=en`, one h1, one main, route-specific titles, and zero Axe serious or
  critical findings.
- Normal routes logged no console errors, page errors, or failed requests. The
  browser's expected 404 resource message is excluded for the deliberate 404.
- `/opt/fleet/lib/verify-url.sh` passed `/` in 1,164 ms and `/demo` in 634 ms,
  with title, language, one h1, main, alt text, labelled controls, and no
  console errors.
- At 390×844 there is no horizontal overflow. Visible workbench text is at
  least 16 px and visible buttons/links are at least 44 px in both dimensions.
- The skip link bypasses the header. Slash focuses search, arrow keys move
  entity options, Enter/Escape operate the chapter dialog, focus is restored,
  and mobile tabs implement roving tabindex, `aria-controls`, and arrow keys.
- The demo-banner focus ring is white with a dark offset shadow. At 200% page
  scale the main content and h1 remain available.
- Reduced-motion mode matches and collapses animations to 0.001 ms with no
  looping motion.

## Privacy, security, performance, and deployment — PASS

The entire direct demo flow made only same-origin requests. The landing makes
one disclosed request to GitHub for release metadata. A license check used GET,
placed only the token in the verification URL, sent no body, stripped the
return token from the browser address, and presented no card fields. No remote
fonts, scripts, analytics, advertising, or manuscript telemetry were observed.

Live responses include CSP, HSTS, `nosniff`, strict-origin referrer policy, and
a restrictive permissions policy. HTML and `sw.js` revalidate after 30
seconds; hashed JS/CSS cache for one year as immutable.

Lighthouse mobile scored Performance 96, Accessibility 100, Best Practices
100, and SEO 100. FCP was 0.9 s, LCP 1.1 s, TBT 220 ms, and CLS 0. A separate
4× CPU-throttled interaction measured 80 ms in Event Timing. Production totals
are 27,940 bytes gzip JavaScript, 5,183 bytes gzip CSS, no font files, and a
20,334-byte mobile hero AVIF.

The candidate build and live site were compared across every served non-map
artifact: **31 files checked, zero byte mismatches**. Root SHA-256 is
`f54dc480ccda4b51d33459d3c94142c5abe4dd195d10abb03b0dce120bbbde5a`;
`sw.js` is
`bf62c98e91dad488604c1e1271112431d4282e2cf3a78cd0466cbef2522d6f7f`.
Release `v0.1.5` points to runtime commit `6574fac38d0f68d15ac05b1e816f65d89a46c187`.
The candidate differs from that tag only in `.factory/handoff.md` and the
browser-test wait, so its runtime is the released runtime.

GitHub Actions run `33210607422` succeeded. Release `v0.1.5` contains 11 assets
covering macOS arm64/x64, Windows EXE/MSI, Linux AppImage/DEB/RPM,
`SHA256SUMS`, and valid `latest.json` metadata. The live Linux button resolves
to the current AppImage.

The Sociobot verification endpoint enforces an observed allowance of 30
requests per client burst/window. A 45-request concurrent burst returned
30×200 and 15×429; every 429 included `Retry-After: 4`. Checkout returned HTTP
303 to `checkout.dodopayments.com`.

There is no sign-in and no product backend. Entra authority, backend health,
server persistence, and product-backend concurrency are not applicable. AI is
also intentionally absent: the brief calls for explainable local rules and
explicitly rejects a large model dependency.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none found.

## Non-blocking verifier-environment note

A supplementary local AppImage re-bundle compiled the optimized application
but this container's `linuxdeploy` step exited without diagnostics. This is not
the repository's required `npm run build`, and the installer contract assigns
platform packages to GitHub Actions. The clean GitHub matrix succeeded, the
published checksum matched, and the published AppImage launched and completed
the sample flow. The local DEB bundle also completed. This does not change the
PASS decision.

Evidence is retained outside the repository under
`/work/evidence/verify-7/`.

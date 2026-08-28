# Repair handoff — work order manuscript-entity-indexer-repair-3

## Status

The release-blocking finding in `.factory/verification-3.md` is repaired. The
verifier measured mobile Lighthouse Performance 89 and 80, with up to 722 ms
total blocking time, on candidate `6da40d35dfd697fc3a1a326df73bafea45785716`.

Profiling the candidate showed that `/` fetched and evaluated the complete
37.39 KB workbench bundle. Lighthouse reported 21.9 KB of unused JavaScript on
that route, including the indexer, sample project, storage and license paths.
This unnecessary startup work was the controllable source of score variance.

## Repair

- The complete first landing screen now ships in `index.html`. It is readable
  before JavaScript runs and preserves the existing copy, design and semantics.
- `src/bootstrap.ts` loads only the stylesheet and download resolver on `/`.
  The workbench module loads after a user chooses Demo, Workbench or another
  internal route. History navigation and route focus behavior remain intact.
- GitHub release lookup moved to `src/downloads.ts`, so platform selection
  remains available without importing the workbench.
- Service-worker registration remains available on every web route and is
  excluded from Tauri as before.
- The exact regression test asserts that the landing route does not request the
  generated `main-*` workbench chunk and transfers no more than 10 KB of
  JavaScript. The built bootstrap is 4.13 KB raw and 2.03 KB gzip.

No brief, visual-system, product behavior, claim, price, release asset or
installer workflow changed.

## Verification evidence

Run from a clean `npm ci` on 28 August 2026:

```text
npm test                                      PASS — 4 Vitest + 21 Playwright
npm run typecheck                             PASS
npm run lint                                  PASS
npm run build                                 PASS — dist/site produced
npm run build:app                             PASS — dist/app produced
npm run test:a11y                             PASS — 4 tests; no serious/critical Axe findings
npm audit --omit=dev                          PASS — 0 vulnerabilities
npm audit                                     PASS — 0 vulnerabilities
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                              PASS — 2 Rust tests + doc tests
```

Every command in `.factory/claims.json` was also invoked separately from a
fresh browser state: all 13 claims passed. This includes demo isolation,
same-origin privacy, offline reload and service-worker use, CSV export, alias
merge/undo, timeline notes, chapter evidence, all supported imports, unchanged
source files, file limits, local storage, recorded license verification and
recorded GitHub release selection.

`/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` passed in 844 ms with
`lang=en`, one `h1`, one `main`, labelled controls, image alt text and no console
errors. Desktop and 390×844 browser coverage passed, including reduced motion,
no horizontal overflow, 44 px targets, 16 px mobile workbench text, keyboard
shortcuts, roving tabs and dialog focus restoration.

Three cold local mobile Lighthouse runs after the repair:

| Run | Performance | Accessibility | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 1,281 ms | 0 ms | 0 |
| 2 | 100 | 100 | 1,285 ms | 0 ms | 0 |
| 3 | 100 | 100 | 1,367 ms | 48 ms | 0 |

Reports and URL-check output are retained under
`/work/evidence/repair-3/`. The production build has 2.03 KB gzip initial
JavaScript and 5.17 KB gzip CSS. The first-screen AVIF remains 20,334 bytes.

## Release and deployment

Static deployment target: `https://manuscript-entity-indexer.sociobot.in`
from `dist/site` using the work order's `deploy-static.sh` configuration.
Live deployment evidence is added after the committed repair is published.

The existing `v0.1.2` desktop release remains valid and unchanged. It contains
macOS arm64/x64, Windows and Linux installers, `SHA256SUMS` and `latest.json`.
The independent verifier already confirmed the Linux DEB checksum and package
metadata for that release.

## Known gaps and operator action

No product gap remains from verification 3. Desktop builds are unsigned.
macOS signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
Windows signing requires `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`.

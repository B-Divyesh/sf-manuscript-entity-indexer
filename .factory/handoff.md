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
Commit `324c89e` was pushed to `origin/main`. Static Web Apps deployment
`9dea7846-6a78-46fa-a80f-e89263e4b8cd` succeeded and the custom domain reports
Ready with managed TLS.

Live `/`, `/demo`, `/app`, `/privacy` and `/terms` return 200; an unknown route
returns 404. The URL verifier loaded `/` in 1,189 ms with no page or console
errors. A fresh live browser confirmed 13 demo entities, no cross-origin demo
requests, no console errors, 390 px layout without overflow, ArrowRight tab
navigation, successful service-worker update and offline demo reload.

Live initial JavaScript SHA-256 is
`84399a7653f6a1db5676341841bd50081b68182cda918c96c735cb416ed0f88c`;
live CSS SHA-256 is
`0a1a8ec3089659d0f4dd303939181d7c8d28b2dd013500215ccc38a9a3f956e7`.
Both exactly match `dist/site`. Live HTML carries the expected CSP,
`nosniff`, strict referrer policy and restrictive permissions policy. Hashed
assets return `public, max-age=31536000, immutable`; HTML and the service worker
use a 30-second revalidation policy.

Three cold mobile Lighthouse runs against the deployed custom domain all
scored Performance 100 and Accessibility 100. LCP was 1,085 ms, 1,058 ms and
981 ms; TBT was 66 ms, 56 ms and 68 ms; CLS was 0 in every run.

The existing `v0.1.2` desktop release remains valid and unchanged. It contains
macOS arm64/x64, Windows and Linux installers, `SHA256SUMS` and `latest.json`.
The release API reports 11 assets. The downloaded AMD64 DEB is package
`manuscript-entity-indexer` version `0.1.2`; its SHA-256 is
`1798df3e043939293a73b339aa9b0689126db91cb7c473a827120158bf72e48b`,
exactly matching the published `SHA256SUMS` entry.

## Known gaps and operator action

No product gap remains from verification 3. Desktop builds are unsigned.
macOS signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
Windows signing requires `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`.

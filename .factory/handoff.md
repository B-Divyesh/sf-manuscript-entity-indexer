# Handoff — Manuscript Entity Indexer repair

## Status

The release-blocking findings from independent verification of candidate
`a32292877d4a87a5b85426b23447f01df7c8638b` have been repaired. This repair
keeps the Tauri 2 desktop application and static-site deployment class.

## Repairs

- Added `npm run typecheck` and `npm run lint`. TypeScript now includes Node
  declarations and uses typed form targets; `npx tsc --noEmit` passes.
- Made every visible 390 px demo button and link at least 44 by 44 CSS pixels.
  This includes the demo banner, header, alias controls, chapter evidence links
  and footer links.
- Removed the inaccurate “unlimited folders” and untestable training promise.
  Paid copy now exactly says that $24 removes the three-file limit. The claims
  manifest now has 13 independently runnable, observable tests, including a
  new source-file-unchanged claim.
- Removed the desktop walker's pre-filter 500-entry cap. It now considers all
  files and filters only by supported extension. A Rust regression creates 501
  unsupported entries before a Markdown chapter and verifies the chapter is
  indexed.
- Added Kana and Hangul name candidates with representative unit and browser
  import coverage. The documented supported scope is Latin, Han, Kana and
  Hangul names.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
cargo test --locked --manifest-path src-tauri/Cargo.toml
npm run tauri build -- --no-bundle
```

Evidence from this repair on 2026-08-28 UTC:

- Clean `npm ci` completed; `npm audit --omit=dev` reported 0 vulnerabilities.
- `npm test` passed: 4 Vitest tests and 16 Playwright tests.
- Each of the 13 commands declared in `.factory/claims.json` passed separately.
  They cover demo isolation, local processing, offline reload, CSV export,
  alias review, timeline notes, chapter evidence, imports, source-file safety,
  free limit, local storage, owner license and platform downloads.
- `npx tsc --noEmit`, `npm run lint` and `npm run build` passed. The static
  build is 26.49 KB gzip JavaScript and 5.09 KB gzip CSS.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed (2 Rust
  tests plus doc tests). `npm run tauri build -- --no-bundle` produced
  `src-tauri/target/release/manuscript-entity-indexer` (5,542,832 bytes).
- Browser accessibility checks passed on `/`, `/demo`, `/app`, `/privacy`,
  `/terms` and a missing route with no serious or critical axe violations.
  The 390×844 regression checks every visible interactive target and finds no
  target below 44 by 44 pixels or horizontal overflow. Keyboard coverage
  verifies `/` search, entity arrow navigation, Enter and dialog Escape.
- The claim suite verifies same-origin-only demo requests and offline reload
  after service-worker control.

## Deployment

The static build to deploy is `dist/site`; deployment and post-deploy identity
evidence are recorded after the production upload in this handoff's final
revision.

## Known limits

- Entity extraction is intentionally heuristic and can miss unusual names or
  mark title-case prose as an entity. The author review flow is the safeguard.
- DOCX import reads document text only; comments, footnotes, tracked changes
  and page layout are not preserved.
- Desktop releases remain unsigned until the operator supplies signing
  certificates. macOS needs `APPLE_CERTIFICATE`,
  `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
  `APPLE_PASSWORD` and `APPLE_TEAM_ID`; Windows needs `WINDOWS_CERT_PFX` and
  `WINDOWS_CERT_PASSWORD`.

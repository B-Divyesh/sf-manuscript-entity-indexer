# Polish 2 handoff — Manuscript Entity Indexer

## Status

Deployed. Repair commit `6603af6410e7248029d4d3f7f6e941d653ba3ca3` is pushed
to `main`; this pass closes every finding in `.factory/review-1.md` and
`.factory/review-2.md`.

## What changed

- Added real chapter-title search and its demo-entry claim test.
- Made downloads safe on phone and explicit by desktop architecture.
- Removed Japanese noun false positives from the sample and added a persistent,
  undoable **Ignore this name** control.
- Strengthened privacy proof by importing a unique manuscript sentinel while
  observing all network requests.
- Removed the unprovable refund claim; the legal page now states the tested
  revoked-license result.
- Replaced visitor-facing “entity” jargon with “name”.
- Tested alias rejection, increased mobile text/touch targets, and removed the
  remaining invalid landmarks/ARIA roles.

## Verification

- `npm ci` completed with 0 production dependency vulnerabilities.
- `npm run typecheck` passed.
- `npm test` passed: 7 Vitest tests and 34 Playwright tests.
- Every one of 20 `.factory/claims.json` entries has exactly one tagged test;
  all run within `npm test`. From clean clone
  `/tmp/mei-polish2-clean` at `6603af6410e7248029d4d3f7f6e941d653ba3ca3`,
  `npm ci` and all 20 declared claim commands were also run separately and
  passed.
- `npm run build:site` passed and produced `dist/site`.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed: 2 Rust
  tests.
- `CI=true npm run tauri build -- --no-bundle` passed and built
  `src-tauri/target/release/manuscript-entity-indexer`.
- Axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms` and an unknown route
  report zero violations. Mobile tests assert 16 px informational copy, 44 px
  visible targets, visible focus and no horizontal overflow.

## Deployment and live evidence

- Deployed with `/opt/fleet/lib/deploy-static.sh manuscript-entity-indexer
  dist/site`; Static Web Apps deployment `dbdb08af-c529-4bd7-b449-8f334411fe57`
  succeeded and `https://manuscript-entity-indexer.sociobot.in` returned 200.
- Cold root verification recorded 779 ms load, no console errors, title/lang,
  exactly one h1, main landmark and no missing image alt. Evidence:
  `.factory/evidence/polish-2-live/verify.json`.
- Cold mobile demo verification found the banner and Reset demo control, no
  `地図` false positive, no console errors and zero Axe violations. Screenshot:
  `.factory/evidence/polish-2-live/demo-mobile.png`.

## Known gaps

None in the product scope. Desktop artifacts remain unsigned preview builds;
the release page carries the downloadable assets and checksum manifest. Code
signing requires operator-owned macOS and Windows certificates.

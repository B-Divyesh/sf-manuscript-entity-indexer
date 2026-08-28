# Polish 2 handoff — Manuscript Entity Indexer

## Status

Ready to deploy from the repair commit recorded below. This pass closes every
finding in `.factory/review-1.md` and `.factory/review-2.md`.

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
  all run within `npm test`.
- `npm run build:site` passed and produced `dist/site`.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed: 2 Rust
  tests.
- `CI=true npm run tauri build -- --no-bundle` passed and built
  `src-tauri/target/release/manuscript-entity-indexer`.
- Axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms` and an unknown route
  report zero violations. Mobile tests assert 16 px informational copy, 44 px
  visible targets, visible focus and no horizontal overflow.

## Deployment and live evidence

The static deploy artifact is `dist/site` (`npm run build:site`). Push this
repair to `main`; the factory static work order deploys that directory. After
deployment, verify `https://manuscript-entity-indexer.sociobot.in/demo` cold,
including the banner, reset action, chapter search and mobile download link.
Append the deployed commit and live screenshot URL/path here before external
handoff.

## Known gaps

None in the product scope. Desktop artifacts remain unsigned preview builds;
the release page carries the downloadable assets and checksum manifest. Code
signing requires operator-owned macOS and Windows certificates.

# Verification handoff — FAIL

## Status

Independent verification of candidate
`195c9815f3a8b923ceccfd0846d2c78ac05091f6` at
https://manuscript-entity-indexer.sociobot.in completed on 2026-08-28 UTC.

**Result: FAIL. Do not release this candidate.**

The cold first-read gate and all 13 declared claim commands pass. The live web
assets also match the candidate build. The product still fails the desktop
artifact, error-state, and accessibility portions of the acceptance contract.

## Release blockers

1. The live download links point to `v0.1.0` installers created around 11:50
   UTC from the pre-repair release. Candidate product repairs were committed at
   13:25 UTC and the tested candidate at 13:28 UTC. The released desktop app is
   not this candidate.
2. Empty Markdown folders, malformed DOCX folders, and blank license forms fail
   silently on `/app`; the empty workbench never renders the prepared error.
3. The 390 px workbench has 64 visible text leaves below 16 px, down to 9.92
   px.
4. Keyboard accessibility fails: the demo-banner focus outline has 1:1
   contrast, closing a chapter dialog loses focus to the body, and the mobile
   tablist lacks arrow-key behavior.

Additional defects: `npm test` failed once on a floating 43.99994 px target
check before passing on rerun; browser free-tier selection uses an arbitrary
three-file order; missing URLs respond 200; the text-import claim does not test
`.txt`; the web manifest is not linked; and development audit reports moderate,
high, and critical findings.

Full evidence and exact measurements are in
`.factory/verification-2.md`. Product code was not modified.

## Verification commands

```sh
npm ci
# Run each command from .factory/claims.json separately
npm test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

The Rust command needs the Ubuntu packages listed in
`.github/workflows/release.yml`.

## Passing evidence summary

- Claims: 13/13 passed separately.
- Final aggregate run: Vitest 4/4 and Playwright 16/16 passed, with the earlier
  isolated flaky failure retained as a finding.
- Type check, lint, production build, production audit, and Rust 2/2 passed.
- Live demo is same-origin, resettable, offline-capable, and free of console
  errors. Axe reported no serious/critical findings on the six tested routes.
- Candidate/live web JS, CSS, service worker, and public metadata hashes match.
- API rate-limit burst: 30×200 followed by 30×429; `Retry-After: 4`.
- Linux DEB checksum matches its published checksum, but the asset is stale.

## Next steps

- Repair the error UI, typography, focus behavior, tab semantics, deterministic
  import ordering, 404 response, claim coverage, and test flake.
- Bump the desktop version and publish a new release from the repaired commit.
  Verify every platform asset and checksum against that commit before changing
  this verdict.
- Update Vite/Vitest to patched non-major versions.

## Needs operator action

Desktop builds remain unsigned. macOS signing expects
`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
Windows signing expects `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`.

# Verification handoff — manuscript-entity-indexer-verify-7

## Status: PASS

Candidate `8f5fef975879e7c199c6d6c8946aaeb578d67820` is accepted at
<https://manuscript-entity-indexer.sociobot.in>. Fresh independent QA found no
release-blocking defect. No product code was changed.

The full evidence and command results are in
`.factory/verification-7.md`. External screenshots, Lighthouse JSON, request
logs, URL reports, release metadata, and native captures are under
`/work/evidence/verify-7/`.

## Required gates

- Cold first read: PASS on desktop and 390 px. The first viewport states what
  the product does, who it serves, and offers a one-click sample demo.
- Claims: PASS. All 16 commands in `.factory/claims.json` passed separately;
  every claim has exactly one tagged test.
- Full suite: PASS — 5 Vitest and 26 Playwright tests.
- Accessibility suite: PASS — 4 focused tests; live Axe found no serious or
  critical issues on all routes.
- Type/lint: PASS.
- Exact production build: PASS — `npm run build` produced `dist/site`.
- Desktop frontend and Rust: PASS — `build:app`, 2 locked Rust tests, doc
  tests, and the local DEB bundle completed.
- Audits: PASS — zero npm vulnerabilities.

## Live and release evidence

- All 31 served non-map files match the candidate build byte for byte.
- Live demo, invalid-input recovery, deterministic three-file limit,
  multilingual import, persistence, CSV, alias review, timeline, source
  evidence, offline reload, keyboard, mobile, and reduced motion passed.
- Live Lighthouse mobile: 96 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.1 s and CLS 0.
- Bundle: 27.94 KB gzip JS, 5.18 KB gzip CSS, no fonts, 20.33 KB mobile hero.
- Demo traffic is same-origin only. Security and cache headers are present.
- License rate limit observed: 30 requests per client burst/window; excess
  requests return 429 with `Retry-After: 4`.
- Checkout returns 303 to Dodo's hosted checkout.
- GitHub release `v0.1.5` and workflow run `33210607422` passed all platforms.
  The shipped Linux AppImage checksum matched and the installed app launched
  and loaded the complete sample.

## Defects and known gaps

No critical, high, medium, or low product defects were found. Desktop packages
remain unsigned, as disclosed. Apple signing requires `APPLE_CERTIFICATE`,
`APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
`APPLE_PASSWORD`, and `APPLE_TEAM_ID`; Windows signing requires
`WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`. The app has no updater and
intentionally ships no updater manifest.

A supplementary local AppImage packaging attempt stopped in this disposable
container's `linuxdeploy` step after the optimized binary compiled. GitHub
Actions is the required platform builder and succeeded; the published
AppImage was independently checksum-verified and launched. The local DEB
bundle succeeded. This is not a release blocker.

## Reproduce

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run build
npm run build:app
npm audit --omit=dev
npm audit
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

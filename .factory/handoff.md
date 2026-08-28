# Verification handoff — manuscript-entity-indexer-verify-4

## Status: FAIL

Candidate `ad0b3f84b8a4d1dcc249f40546a7c4df7ffbccb7` was independently
verified on 28 August 2026 against
<https://manuscript-entity-indexer.sociobot.in>. The earlier live mobile
performance failure is repaired: three cold mobile Lighthouse runs scored
97, 98, and 100 Performance, all with 100 Accessibility. The live static site
matches the candidate production build byte for byte.

The candidate is still **not releasable**. Full evidence and reproduction steps
are in `.factory/verification-4.md`.

## Release blockers

1. The advertised owner-edition checkout returns HTTP 404
   `{"error":"enabled factory product","status":404}`.
2. A `?license=` checkout return stores and strips the token but stays in Free
   edition and sends no verification request until another load.
3. The unchanged `mei-shell-v1` cache-first service worker keeps previously
   cached HTML indefinitely; `registration.update()` does not refresh it.
4. CJK place matches are not deduplicated. The sample reports five mentions for
   three `白港` occurrences and two for one `赤橋` occurrence.
5. User-facing claims about classify/search, desktop persistence and payment
   privacy, and all-platform builds are absent from or incompletely exercised
   by `.factory/claims.json`.
6. Published `v0.1.2` desktop installers target ancestor commit `4eb4bc1`, not
   this candidate, despite later runtime changes.

The footer's `https://param.sociobot.in` link also fails DNS resolution (P2),
and the Apple touch icon is 256×256 rather than the specified 180×180 (P3).

## Passing evidence

- All 13 claim commands passed individually after `npm ci`.
- `npm test`: 4 Vitest and 21 Playwright tests passed.
- Typecheck, lint, exact site build, desktop webview build, focused Axe tests,
  both npm audits, and locked Rust tests passed.
- Cold first-read and one-click demo requirements pass on desktop and 390 px.
- Normal, invalid, boundary, recovery, keyboard, focus, reduced-motion,
  offline-reload, privacy, and local-storage flows were exercised locally and
  live. Normal routes had no console/page errors or serious/critical Axe issue.
- Initial JS is 2,026 bytes gzip; all JS is 27,791 bytes gzip; CSS is 5,174
  bytes gzip; mobile hero AVIF is 20,334 bytes.
- Live policy and caching headers pass. The verification endpoint rate limit
  starts at request 31 of a 45-request burst and returns `Retry-After: 4`.
- Release assets exist for macOS arm64/x64, Windows, and Linux. The downloaded
  AMD64 DEB metadata and checksum pass, and the Linux installer verifies the
  AppImage before installation.

## Commands used

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run build:app
npm run test:a11y
npm audit --omit=dev
npm audit
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

Every `test` value in `.factory/claims.json` was also invoked separately.
Ephemeral screenshots, Lighthouse reports, release files, and URL-verifier
output are retained in `/work/evidence/verify-4/`.

## Next steps

Enable/register the Sociobot product and test a real checkout return. Reorder
license capture/state initialization and add a return-path claim test. Version
the service-worker cache or use a network-first/update strategy for navigations,
with an upgrade regression test. Deduplicate candidates by document, position,
and normalized name. Complete the claims ledger and platform variants. Cut a
new release from the repaired candidate, then rerun independent verification.

Desktop builds remain unsigned. Operator signing still requires the Apple and
Windows certificate secrets listed in the release workflow documentation.

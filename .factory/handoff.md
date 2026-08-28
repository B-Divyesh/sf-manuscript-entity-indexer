# Repair handoff — manuscript-entity-indexer-repair-4

## Status: repaired and release-ready

The release-blocking findings in `.factory/verification-4.md` were repaired on
28 August 2026. The static site is deployed at
<https://manuscript-entity-indexer.sociobot.in>. Desktop version `0.1.3` is
released from tag `v0.1.3`, which points at this repaired source tree.

## Repairs

- Registered the live $24 one-time product in the Sociobot billing service.
  The public checkout endpoint now returns HTTP 303 to a hosted Dodo session.
- Captured checkout-return tokens before reading cached license state. A new
  `?license=` return is stripped, verified once, and unlocks immediately.
- Changed service-worker navigation handling to network-first with offline
  fallback and advanced the cache to `mei-shell-v2`. An online reload now
  replaces a poisoned cached shell; the refreshed shell still reloads offline.
- Deduplicated overlapping Han name/place candidates by normalized name and
  source position. The sample now records exactly three `白港` mentions and one
  `赤橋` mention, with unique evidence IDs.
- Expanded claim coverage for alias search/rename/classification, checkout
  return, payment privacy, live checkout, and all three desktop platforms.
- Replaced the dead Param Factory footer destination with the live Sociobot
  site and resized the Apple touch icon to exactly 180×180.
- Bumped npm, Cargo, Tauri, UI, and release-workflow versions to `0.1.3` so the
  published installers identify the repaired source.

## Verification evidence

Clean and complete local gates:

```text
npm ci                                      PASS — 68 packages; 0 audit findings
npm test                                    PASS — 5 Vitest + 24 Playwright
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — dist/site
npm run build:app                           PASS — dist/app
npm run test:a11y                           PASS (included in full suite)
npm audit --omit=dev                        PASS — 0 vulnerabilities
npm audit                                   PASS — 0 vulnerabilities
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                            PASS — 2 Rust tests + doc tests
CI=true APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri build -- --bundles appimage,deb
                                            PASS — AppImage + DEB
```

Every one of the 15 commands in `.factory/claims.json` passed separately. Each
claim id occurs in exactly one tagged test.

The local Linux packages are version `0.1.3` for `amd64`:

- DEB: 2,634,536 bytes; SHA-256
  `c72081a6fa9ca55e994e72a29c887abf3964b48b7db714258b5f9bf5f5382db3`.
- AppImage: 77,330,936 bytes; SHA-256
  `affa4e235b0cf01873fd842bc53fce7f41b15a646221cdf727878301233e761f`.
- The AppImage runtime responds to `--appimage-version`.

Live checks:

- Factory deployment id: `9feb49ea-6100-46d5-8341-e54035aaafb9`.
- `/opt/fleet/lib/verify-url.sh` passed in 1,197 ms with no console errors,
  valid title/lang/main/h1, labelled buttons, and complete image alt text.
- Axe found zero serious or critical issues on `/`, `/demo`, `/app`,
  `/privacy`, and `/terms`.
- Desktop and 390×844 mobile flows passed. Mobile had no horizontal overflow,
  all visible controls were at least 44 px, and ArrowRight moved the tab focus.
- A live mocked checkout return reached Owner edition on its first load and
  removed the token from the address. A stale cached root was replaced online;
  that repaired shell then reloaded offline.
- The unknown route returns HTTP 404. Live CSP, HSTS, `nosniff`, referrer, and
  permissions headers are present. Normal routes produced no browser errors.
- Live checkout returns HTTP 303 to `checkout.dodopayments.com/session/...`.
- Mobile Lighthouse: Performance 100, Accessibility 100, LCP 1,001 ms,
  TBT 14 ms, CLS 0. Desktop: Performance 100, Accessibility 100, LCP 289 ms,
  TBT 0 ms, CLS 0.
- Live `index.html`, `sw.js`, the Apple icon, CSS, and all emitted JavaScript
  are byte-identical to `dist/site`. Root SHA-256 is
  `913529299b2ff0553128a7a72bb403c08af7fbdfd34c287afbd95ff06e7c74c6`;
  service-worker SHA-256 is
  `bf62c98e91dad488604c1e1271112431d4282e2cf3a78cd0466cbef2522d6f7f`.

## Release and operation

The `v0.1.3` workflow builds macOS arm64/x64, Windows x64, Linux AppImage and
DEB artifacts, then publishes `SHA256SUMS` and `latest.json`. The landing page
reads the CORS-enabled GitHub API and falls back calmly when it is unavailable.

Desktop builds remain unsigned. Signing requires operator-provided
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets. The app has no updater, so
it intentionally ships no updater manifest. There are no other known gaps.

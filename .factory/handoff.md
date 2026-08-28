# Repair handoff — manuscript-entity-indexer-repair-5

## Status: repaired, deployed and released

All release-blocking findings in `.factory/verification-4.md` and the
controller's later slash-shortcut finding are repaired. Runtime source commit
`dc16e1972e8f280f8549d41dca6cf380279591ce` is deployed at
<https://manuscript-entity-indexer.sociobot.in> and released as `v0.1.4`.

## Controller finding reproduced first

The existing fast-load keyboard test passed, but the reported failure was
reproduced deterministically before the fix by pausing the generated
`main-*.js` request, navigating directly to `/demo`, and pressing slash while
the workbench module was still loading. The search input later appeared but
was not focused. The failing assertion was:

```text
expect(getByLabel('Search mentions')).toBeFocused()
Expected: focused
Received: inactive
```

Root cause: `src/bootstrap.ts` started the workbench with an unawaited dynamic
import, while the global slash handler was registered only at the bottom of
that delayed module. A keystroke between navigation completion and module
evaluation was lost.

The handler now exists in the always-loaded bootstrap. It queues search focus
until the workbench renders. It ignores inputs, textareas, selects,
contenteditable regions, composition, and modified keystrokes. The exact
regression pauses the workbench chunk, presses slash during startup, asserts
search focus after render, then proves slash remains normal text in both the
search and entity-name inputs.

## Verifier findings repaired and preserved

- The $24 Sociobot checkout returns HTTP 303 to hosted Dodo checkout.
- A checkout-return `?license=` token is stored, stripped, verified once on
  the first load, and immediately enables Owner edition.
- Navigation is network-first in service-worker cache `mei-shell-v2`, with an
  offline fallback. An online load replaces a poisoned cached shell.
- Overlapping Han name/place matches are deduplicated by name and source
  position. The sample has three `白港` mentions and one `赤橋` mention, with
  unique evidence IDs.
- `.factory/claims.json` has 15 claims. It covers alias search/rename/classify,
  payment privacy, checkout availability, checkout return, and all supported
  desktop platforms. Every claim has exactly one tagged browser test.
- The footer points to the live Sociobot site. The Apple touch icon is exactly
  180×180.
- Version `0.1.4` is consistent across npm, Cargo, Tauri, the UI, browser
  fixtures, and the release workflow. The release tag targets this runtime
  source, so installers include the shortcut repair.

The researched brief, desktop-app artifact class, static deployment class,
visual thesis, demo behavior, privacy model, and previously passing behavior
were not changed.

## Clean local verification

Run on 28 August 2026 from `npm ci`:

```text
npm ci                                      PASS — 68 packages; 0 audit findings
npm test                                    PASS — 5 Vitest + 25 Playwright
npx playwright test --workers=1             PASS — all 25 browser tests
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — dist/site
npm run build:app                           PASS — dist/app
npm run test:a11y                           PASS — 4 focused tests
npm audit --omit=dev                        PASS — 0 vulnerabilities
npm audit                                   PASS — 0 vulnerabilities
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                              PASS — 2 Rust tests + doc tests
bash -n public/install.sh                    PASS
CI=true APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri build -- --bundles appimage,deb
                                              PASS — AppImage + DEB
```

The worker required the Linux packages from `.github/workflows/release.yml`
plus the standard `file` utility for AppImage assembly. No source workaround
was made. Every command in `.factory/claims.json` passed separately.

The complete browser suite covered desktop, 390×844 mobile, keyboard, dialog
focus return, touch sizes, text sizes, same-origin demo privacy, local storage,
checkout return, CJK evidence, online shell replacement, offline reload,
imports, failures/recovery, the designed 404, and Axe. Axe found no serious or
critical issue. The explicit startup-race regression and the original shortcut
test both pass with one worker.

Local `/opt/fleet/lib/verify-url.sh` checks passed for `/` and `/demo` with
one h1, one main landmark, `lang=en`, labelled controls, alt text, and no
console errors. Mobile Lighthouse scored Performance 100, Accessibility 100,
Best Practices 100 and SEO 100; LCP was 1,283 ms, TBT 0 ms, and CLS 0.

Production sizes: all JavaScript 27,960 bytes gzip, CSS 5,174 bytes gzip, and
the mobile hero AVIF 20,334 bytes. The locally built packages were:

- AppImage: 77,330,936 bytes; SHA-256
  `1cc10e6bf65117628e78d7926f5593725b8ab80dda0496d28f24e2490d20bdad`.
- DEB: 2,634,920 bytes; SHA-256
  `944926adc4130dbda28c53f1bfa452ddbde5b04a1af1e8da12932350ff6d4a92`.

The DEB reports package `manuscript-entity-indexer`, version `0.1.4`,
architecture `amd64`. The AppImage responds to `--appimage-version`.

## Deployment and live evidence

- Azure Static Web Apps deployment:
  `9d03feae-e03c-4950-b215-dcd32cb1af0c`.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. An unknown route
  returns 404.
- Live root SHA-256:
  `e6142c831ad01b58def37307ceb2d4bf922c3f331ebb070ba034b06496f77960`.
- Live service-worker SHA-256:
  `bf62c98e91dad488604c1e1271112431d4282e2cf3a78cd0466cbef2522d6f7f`.
- Root, service worker, and every emitted non-map asset match `dist/site`
  byte for byte.
- Live URL verification passed in 1,249 ms without console errors. CSP, HSTS,
  `nosniff`, strict referrer policy, restrictive permissions policy, and the
  30-second HTML revalidation policy are present.
- A fresh 390 px live browser confirmed slash focus and text entry, `白港` = 3,
  `赤橋` = 1, no horizontal overflow, zero running reduced-motion animations,
  zero cross-origin demo requests, zero console errors, and offline reload.
- A mocked live checkout return made one verification request, reached Owner
  edition, and removed the token from the URL. The real invalid-token endpoint
  returned `{valid:false, reason:"invalid"}`. Checkout returned HTTP 303 to
  `checkout.dodopayments.com`.
- Live mobile Lighthouse scored 100 in Performance, Accessibility, Best
  Practices and SEO; LCP was 983 ms, TBT 1 ms, and CLS 0.

## Desktop release

GitHub Actions run `33203089339` passed all four platform builds and the
checksum job. Release `v0.1.4` targets runtime source `dc16e19` and contains
11 assets: macOS arm64/x64 DMGs and app archives, Windows EXE/MSI, Linux
AppImage/DEB/RPM, `SHA256SUMS`, and valid `latest.json`.

The published AMD64 DEB downloaded successfully. Its SHA-256 is
`38da1ebc5c646fe45cfb661121d379cf10ce18d339205ce18f3f8f5b914ce048`,
which matches `SHA256SUMS`; its metadata reports version `0.1.4`. A fresh live
Linux browser resolves the primary button to the `v0.1.4` AppImage.

## Known gaps and operator action

No release-blocking product gap remains. Desktop packages are unsigned, as
disclosed. macOS signing requires `APPLE_CERTIFICATE`,
`APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
`APPLE_PASSWORD`, and `APPLE_TEAM_ID`. Windows signing requires
`WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`. The app has no updater and
therefore intentionally ships no updater manifest.

Ephemeral screenshots, URL reports, Lighthouse JSON, and downloaded release
evidence are retained under `/work/evidence/repair-5/`.

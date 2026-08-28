# Verification handoff — candidate 6da40d35dfd697fc3a1a326df73bafea45785716

## Status: **FAIL**

Independent verification on 2026-08-28 found one release-blocking issue: live mobile Lighthouse performance scored **89** and **80** in two fresh runs, below the required 90. See `.factory/verification-3.md` for exact evidence. Do not release this candidate until that gate passes consistently.

All functional, claims, type/lint/build, accessibility, privacy, offline, deployment-identity, installer-checksum, and rate-limit checks passed. The candidate’s deployed JS/CSS match the local build; its only change after the `v0.1.2` release commit is factory documentation.

The material below is the superseded builder handoff retained for history; its earlier PASS-style deployment statements are not the current verification result.

## What changed

- Versioned the desktop product as `0.1.2` in npm, Tauri, Cargo and the release workflow. The workflow's manual-dispatch fallback now also targets `v0.1.2`, preventing the old `v0.1.0` artifact from being republished.
- Made empty folders, malformed DOCX files and blank license submission render an actionable `role="alert"` in the first-run workbench. A valid later import clears the error and recovers normally.
- Sorted browser-selected files by stable relative path before applying the free three-file limit. The notice now names the indexed files and every omission.
- Raised all meaningful 390 px workbench metadata, forms, controls and timeline text to 16 px; the test checks every visible matching text element.
- Reworked keyboard behavior: a high-contrast two-tone focus treatment works on the red demo banner, chapter dialogs restore focus to their source button, and mobile tabs have controls, roving `tabindex`, and Arrow/Home/End navigation. The wordmark's accessible name includes its visible “MEI” text.
- Removed the target-size test race with a 43.9 px floating-point tolerance, while retaining the 44 px product requirement.
- Added the manifest link, a generated `404.html`, and the Static Web Apps 404 response override.
- Updated Vite to `6.4.3` and Vitest to `3.2.7`; both production and full dependency audits report zero findings.

## Regression coverage

`tests/e2e/product.spec.ts` now covers invalid import/license errors and recovery, path-order limiting and named omissions, Markdown/plain-text/DOCX importing, 16 px mobile workbench text, focus contrast, dialog focus restoration, ARIA tabs, manifest/404 configuration, and release-version alignment. All 13 claims remain individually tagged and runnable from `.factory/claims.json`.

## Verification run locally

```sh
npm ci
npm test                         # 4 Vitest + 20 Playwright passed
npm run typecheck                # passed
npm run lint                     # passed
npm run build                    # passed; dist/site produced
npm audit --omit=dev             # 0 vulnerabilities
npm audit                        # 0 vulnerabilities
cargo test --locked --manifest-path src-tauri/Cargo.toml  # 2 Rust tests + doc tests passed
/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <evidence-dir>
npx playwright test --grep '@a11y' # 4 passed; Axe found no serious/critical issues
```

The final local production build is 26.95 KB gzip JavaScript and 5.17 KB gzip CSS. `verify-url.sh` loaded the production build in 753 ms with no console errors; it confirmed a title, `lang="en"`, exactly one `h1`, a `main`, and no images missing alt text. Browser claim coverage also verifies same-origin demo traffic, offline reload, service-worker use, and the release selector. Desktop and 390×844 mobile checks passed, including keyboard and reduced-motion paths.

## Release and deployment

Release `v0.1.2` was published by successful GitHub Actions run `33183410522` from commit `4eb4bc14d43b3d11f0b99110cb793fe178b69e45`. It contains macOS arm64/x64 DMG and app tarballs, Windows MSI/EXE, and Linux AppImage/DEB/RPM assets, plus `SHA256SUMS` and valid `latest.json` (version `0.1.2`, 9 assets). The published AMD64 DEB reports package version `0.1.2`; its downloaded SHA-256 is `1798df3e043939293a73b339aa9b0689126db91cb7c473a827120158bf72e48b`, matching `SHA256SUMS`. A fresh live browser context selects the v0.1.2 Linux AppImage link without console errors.

The static site was deployed successfully to `https://manuscript-entity-indexer.sociobot.in` using:

```sh
/opt/fleet/lib/deploy-static.sh manuscript-entity-indexer dist/site
```

Live checks: root, demo, app, privacy and terms return 200; an unknown path returns HTTP 404; the live JS, CSS, service worker and manifest hashes match `dist/site`; and `verify-url.sh` reports no console errors. Mobile Lighthouse on the live landing page scored Performance 99 and Accessibility 100 (LCP 1132 ms, CLS 0).

## Needs operator action

Desktop builds remain unsigned. macOS signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`. Windows signing requires `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`.

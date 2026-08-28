# Repair handoff — release candidate v0.1.2

## Status

This repair starts from verifier report commit `d8ac78c9af5bf6309766a6160d49b0cdb4e85c2c` and repairs every listed product-QA blocker without changing the researched scope or desktop-app deployment class.

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

The intended release tag is `v0.1.2`, created from the final 404 repair commit after this handoff is committed. GitHub Actions must finish its macOS arm64/x86_64, Windows, and Linux AppImage/DEB jobs and publish `SHA256SUMS` plus `latest.json`; verify the tag resolves to this repair commit before accepting desktop downloads. The static deployment command is:

```sh
/opt/fleet/lib/deploy-static.sh manuscript-entity-indexer dist/site
```

## Needs operator action

Desktop builds remain unsigned. macOS signing requires `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`. Windows signing requires `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`.

# Independent verification — FAIL

**Candidate:** `a32292877d4a87a5b85426b23447f01df7c8638b`  
**Live URL:** https://manuscript-entity-indexer.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Verdict:** **FAIL — release-blocking quality and contract defects remain.**

## First-read result

A cold desktop load answered the three required questions in plain words:

- What: “Index every name across your manuscript.”
- For whom: “For novelists working across languages…”
- First action: the visible one-click **Try it with sample data** link says it opens a three-chapter index.

The first screen and one-click demo therefore pass. The live page had no console or page errors on this cold read.

## Required claim checks — PASS

`.factory/claims.json` exists and declares 12 claims. From the clean candidate checkout, after `npm ci`, I ran every declared command separately, exactly as listed:

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `local-processing` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `alias-review` | PASS |
| `timeline-ledger` | PASS |
| `chapter-evidence` | PASS |
| `supported-imports` | PASS |
| `free-file-limit` | PASS |
| `local-project-storage` | PASS |
| `owner-license` | PASS |
| `platform-download` | PASS |

The final Playwright result recorded `status: passed`. `npm test` also passed: Vitest 3/3 and Playwright 14/14.

## Release-blocking defects

### High — available TypeScript check fails

`npx tsc --noEmit` exits non-zero with eight diagnostics. Three are product-source errors in `src/main.ts` (lines 381, 388 and 395: `EventTarget | null` passed where an `HTMLFormElement` is required). The remaining errors show missing Node type declarations and a Playwright `Page` type mismatch in `tests/e2e/product.spec.ts`.

The repository has TypeScript installed and a `tsconfig.json`; this is an available type check and it does not pass.

### High — mobile controls violate the mandatory 44 px target minimum

On the live `/demo` at 390×844, actual visible control dimensions were:

- Reset demo: 89×36 px; Start for real: 98×36 px.
- Merge as alias / Keep separate: 126×40 px.
- Each chapter-evidence button: 32 px high.
- Footer Privacy and Terms links: 18 px high.

The requirement is 44×44 CSS px. Keyboard focus is otherwise visible (a 3 px red focus outline) and there is no horizontal overflow, but these controls fail the mobile/touch acceptance requirement.

### High — claims contract has unlisted, unsupported promises

The claims manifest does not cover several visitor-reliant landing promises, contrary to the claims contract. Examples include “$24 once for unlimited folders,” “Keep unlimited manuscript folders,” “No training on your writing,” and “No source-file changes.”

Most importantly, the product only keeps one browser project (`mei:project:v1`) and the owner-license claim test proves removal of a **three-file** limit, not unlimited folders. “Unlimited folders” is both untested and misleading. Any of these claim-like promises must be backed by one observable demo-entry test or removed/reworded.

## Other findings

### Medium — desktop folder indexing silently stops after 500 directory entries

`src-tauri/src/lib.rs` applies `.take(500)` to `WalkDir` before filtering for supported files. A manuscript folder with many non-manuscript entries before its chapters can therefore omit valid Markdown/TXT/DOCX files with no warning. This weakens the core “indexes a chosen folder” job and should be fixed or surfaced with an explicit limit.

### Medium — multilingual support is narrower than the CJK brief implies

The extractor only recognises ASCII-capitalized Latin candidates and Han-script candidates (`src/indexer.ts`). It has no Korean/Hangul or Kana name extraction. The shipped sample and tests only demonstrate Latin plus Han. Clarify that scope or add the missing CJK-script handling and representative tests.

## Passing verification evidence

- Clean install: `npm ci` completed. Production dependency audit (`npm audit --omit=dev`) reported 0 vulnerabilities.
- Build: `npm run build` passed and produced `dist/site`. Initial JavaScript chunks total 26.39 KB gzip; CSS is 5.09 KB gzip; mobile hero AVIF is 20 KB. These are within the stated static budgets.
- Rust/desktop: after installing the same Ubuntu packages named in `.github/workflows/release.yml`, `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed (1/1 Rust test; doc tests passed), and `npm run tauri build -- --no-bundle` completed with `src-tauri/target/release/manuscript-entity-indexer` (5.3 MB). The initial bare-container failure was only the absent `glib-2.0` development package.
- Live/candidate identity: deployed `index-BY9v9S21.js`, CSS, all four lazy chunks and `sw.js` have byte-identical SHA-256 values to this candidate build. The live static deployment therefore matches the candidate. The release tag `v0.1.0` predates this test/docs-only candidate delta; no app source differs from the tag.
- Live core workflow: demo loaded sample data; merge/undo, timeline note/reset, CSV workflow, chapter dialog, `/` search shortcut and offline reload all worked. During the live demo flow only the product origin was requested; no errors or failing responses occurred.
- PWA: service worker registered, controlled a reload, and `/demo` reloaded offline. Its `skipWaiting`, cache-version, activation cleanup and navigation fallback were also inspected. Live hashed assets have `public, max-age=31536000, immutable`; HTML and `sw.js` have 30-second revalidation.
- Accessibility: independent axe scans of `/`, `/demo`, `/app`, `/privacy`, `/terms`, and `/missing-page` found no serious or critical findings. Each had one `main` and one `h1`; the live `<html lang>`, title, landmark/skip link, alt text and visible focus were present. Reduced-motion context produced 0.001 ms animations and `scroll-behavior: auto`.
- Security/privacy: live CSP restricts to self with only GitHub release metadata and Sociobot licensing in `connect-src`; `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy and HSTS were present. Demo network observation found same-origin-only requests. No sign-in exists.
- License endpoint: a 40-request invalid-token burst at 20-way concurrency yielded 30 × 200 and 10 × 429; every 429 had `Retry-After: 3` (observed threshold: 30 requests per burst/window).
- Desktop release: GitHub release `v0.1.0` has macOS arm64/x64, Windows EXE/MSI and Linux AppImage/DEB assets plus `SHA256SUMS` and valid `latest.json`. I downloaded `Manuscript.Entity.Indexer_0.1.0_amd64.deb`; its SHA-256 matched `SHA256SUMS`, and `dpkg-deb` reports package `manuscript-entity-indexer`, version `0.1.0`, architecture `amd64`.

## Required remediation and re-verification

1. Make TypeScript checking pass and expose it as a normal package script.
2. Make every visible interactive target at least 44×44 px at 390 px.
3. Remove or correct untested/incorrect claims, especially unlimited folders, or add exact demo-entry claim tests.
4. Correct/document the desktop traversal cap and the actual CJK language scope; add representative regression tests.
5. Re-run the entire claims list, `npm test`, `npx tsc --noEmit`, `npm run build`, Rust/Tauri build, mobile checks and live identity verification.

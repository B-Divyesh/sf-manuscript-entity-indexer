# Independent verification 2 — FAIL

**Candidate:** `195c9815f3a8b923ceccfd0846d2c78ac05091f6`  
**Live URL:** https://manuscript-entity-indexer.sociobot.in  
**Verified:** 2026-08-28 UTC  
**Verdict:** **FAIL — the downloadable desktop product is stale and release-blocking product and accessibility defects remain.**

No product code was changed during this verification.

## Mandatory first-read gate — PASS

A cold desktop and 390×844 mobile load answered all three questions in the
first viewport:

- What it does: “Index every name across your manuscript.”
- Who it is for: “For novelists working across languages…”
- What to do first: **Try it with sample data**, followed by “It opens a
  three-chapter index.”

The action opens `/demo` in one click. The populated workbench appears with the
persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and
**Start for real**.

## Required claim tests

`.factory/claims.json` exists. After `npm ci`, all 13 declared commands were run
individually before the rest of verification. Every declared command passed:

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
| `source-files-unchanged` | PASS |
| `free-file-limit` | PASS |
| `local-project-storage` | PASS |
| `owner-license` | PASS |
| `platform-download` | PASS |

The claims suite still has two material coverage defects. The
`supported-imports` claim promises Markdown, plain text, and DOCX, but its test
creates only Markdown and DOCX files. More seriously, `platform-download`
mocks a release response and checks only the link suffix. It cannot detect that
the real installers predate this candidate, so the “current installer” claim
passes while the live product directs users to stale binaries.

## Release-blocking findings

### Critical — published desktop installers do not contain this candidate

The live page selects GitHub release `v0.1.0`. The tag resolves to commit
`a340f89b9caae9493c77113d23e5df996eff3c9f`, committed at 11:46 UTC. All release
assets were created between 11:50 and 11:55 UTC. The repair commit
`e5fb5763fd639af1ee4b5bce3b60df8668c27a18` was not committed until 13:25 UTC,
and candidate `195c9815…` followed at 13:28 UTC.

`git diff v0.1.0..195c9815…` includes product changes in `src/main.ts`,
`src/style.css`, `src/indexer.ts`, `src-tauri/src/lib.rs`, package/config files,
and tests. The published installers therefore cannot contain the repaired
folder traversal, Kana/Hangul extraction, target sizing, or current UI. This is
a desktop-app release failure even though all required platform asset names are
present.

The downloaded Linux DEB itself is intact: SHA-256
`46a00ab95d9b7e9d004455206e6e7f1b11b072094ac0cec11a78da69251a5a22`
matches `SHA256SUMS`, and its metadata reports package
`manuscript-entity-indexer` version `0.1.0`, amd64. Integrity does not cure the
stale build identity.

### High — invalid imports and blank licenses fail silently

On the live `/app`, importing an empty Markdown folder or a malformed DOCX
leaves the first-run screen unchanged. There is no `role="alert"`, visible
error, or recovery instruction. Submitting the license form with a blank token
also shows no error. The code sets an error string, but `emptyWorkbench()` does
not render it. A later valid plain-text import succeeds, so recovery is
possible only by guessing what happened.

This violates the core import job, the required error/recovery state, and the
form-error accessibility contract.

### High — mobile workbench text is below the required readable size

At 390×844 after selecting Mara Venn, 64 visible text leaves computed below
16 px; the minimum is 9.92 px. Examples include entity metadata, type stamps,
labels, timeline markers, navigation, and alias labels (9.92–10.88 px). The
attached design contract says body text never drops below 16 px, while the
mobile baseline calls for at least 17 pt. The full-page capture confirms that
important ledger text is visibly tiny.

### High — keyboard focus treatment and dialog restoration fail

- Focusing **Reset demo** yields a 3 px `#a42b23` outline against the identical
  `#a42b23` demo-banner background: 1:1 contrast, so focus is not visibly
  indicated.
- After opening a chapter with Enter and closing the native dialog with Escape,
  focus lands on `<body>` instead of returning to the chapter button.
- The mobile `role="tablist"` does not implement arrow-key movement; ArrowRight
  leaves focus on **Entities**. Tabs also lack `aria-controls` and roving
  `tabindex`.

Lighthouse additionally reports the mobile wordmark’s visible “MEI” label is
not contained in its accessible name, a serious WCAG 2.5.3 label-in-name
failure.

## Other findings

### Medium — the required full test command is flaky

One clean, isolated `npm test` run failed 15/16 because the mobile target check
measured a chapter button at `43.99993896484375px` while its ancestor reveal
animation was active. A later isolated full run passed 16/16, and five focused
repetitions passed. The steady live size is 44 px. The test uses an exact
floating-point comparison during motion, so the required gate is not reliable.

### Medium — the free web edition chooses an arbitrary three-file subset

The browser implementation slices the unsorted `FileList`. In a folder named
`01.txt` through `04.txt`, the stored project contained `03.md`, `04.txt`, and
`02.md`, silently omitting `01.txt`. The notice says “the first three files”
without identifying which chapters were excluded. A continuity index should
use a stable path order and list omissions.

### Medium — missing routes return a false HTTP success

`/definitely-missing-qa` renders the designed not-found screen but responds
HTTP 200. The Static Web Apps configuration has no 404 response override. This
violates the required real-404 behavior and misleads crawlers and monitoring.

### Medium — development dependencies have known vulnerabilities

`npm audit --omit=dev` passes with zero production vulnerabilities. Full
`npm audit` reports one moderate, one high, and one critical development
vulnerability: outdated Vite/esbuild file-read advisories and Vitest
`GHSA-5xrq-8626-4rwp`. Fixed non-major versions are available.

### Low — the web manifest is not discoverable

`manifest.webmanifest` exists, but `index.html` has no `rel="manifest"` link.
Chromium reports an empty manifest URL and `display: kUndefined`. Service-worker
offline behavior works, but the web companion is not installable as authored.

## Passing evidence

- Clean install: `npm ci` completed. Production dependency audit: 0 findings.
- Claims: all 13 declared commands passed separately.
- Type/lint: `npm run typecheck` and `npm run lint` passed.
- Build: `npm run build` passed and produced `dist/site`.
- Final aggregate run: 4/4 Vitest and 16/16 Playwright tests passed, after the
  separate flaky failure described above.
- Rust: after installing the exact Ubuntu prerequisites in the release
  workflow, `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed
  2/2 tests plus doc tests.
- Live web identity: all four JavaScript chunks, CSS, `sw.js`, manifest,
  installers, robots, and sitemap are byte-identical to the candidate build.
- Live core flow: sample load, merge/undo, no-match search/clear, timeline note,
  chapter dialog, CSV claim flow, local persistence, and reset all work.
- A valid plain-text import recovers after the silent invalid-input failures.
- Demo traffic stayed same-origin with no console/page errors or failed
  responses. No analytics, remote fonts, or third-party scripts were found.
- Accessibility automation: independent axe scans found zero serious/critical
  violations on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the missing
  route. Each route has one `h1`, one `main`, `lang="en"`, titles, landmarks,
  and image alt text. The factory `verify-url.sh` passed in 959 ms with no
  console errors.
- At 390 px there is no horizontal overflow and steady visible button/link
  targets measure at least 44×44 px. The mandatory first screen fits through
  all three facts at 820.7 px.
- Reduced motion matches and forces 0.001 ms animation durations with automatic
  scrolling.
- PWA behavior: the service worker installed, controlled a reload, completed
  `registration.update()`, and reloaded `/demo` offline with sample data.
- Security headers include CSP, HSTS, `nosniff`, Referrer-Policy, and a
  restrictive Permissions-Policy. Hashed JS/CSS cache for one year immutable;
  HTML and `sw.js` revalidate after 30 seconds.
- Rate limiting: a 60-request concurrent burst to the invalid-license verify
  endpoint returned 30×200 and 30×429. Every 429 had `Retry-After: 4`; the
  observed limit was 30 requests per burst/window.
- No sign-in exists, so Entra authority verification is not applicable.
- Bundle sizes: 26.49 KB gzip JavaScript total, 5.09 KB gzip CSS, no font
  downloads, and 20.3 KB mobile hero AVIF.
- Lighthouse mobile, two fresh runs: performance 88 then 100 (TBT 490 ms then
  40 ms), accessibility 100, best practices 100, SEO 100; LCP 1.3 s and CLS 0
  in both runs.

## Required remediation

1. Publish a new version/tag from the repaired candidate, wait for all platform
   artifacts, regenerate `SHA256SUMS`/`latest.json`, and prove build identity.
2. Render import and license errors in the empty workbench with an announced,
   actionable message; add invalid/empty/recovery tests.
3. Raise all meaningful mobile text to the documented minimum and retest at
   200% text size.
4. Fix focus-ring contrast, return dialog focus to its trigger, and implement
   the ARIA tab keyboard pattern.
5. Make the touch-target test wait for motion to finish or compare with a safe
   tolerance so `npm test` is deterministic.
6. Sort browser imports by stable relative path and list any files omitted by
   the free limit.
7. Return HTTP 404 for unknown routes, complete the plain-text claim test, link
   the web manifest if PWA installability is intended, and update vulnerable
   development dependencies.

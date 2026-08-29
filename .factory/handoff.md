# Review 3 handoff — Manuscript Entity Indexer

## Status

Review complete. Verdict: **FAIL** with two blocking carried findings. Product
code was not modified.

## What was done

- Reviewed the live deployment cold at 390 × 844 with an iPhone user agent and
  at 1440 × 900.
- Audited every landing-page and README sentence, plus headings and actions.
- Exercised the live sample, reset, real-data isolation and offline reload.
- Ran every registered claim command separately from a clean clone.
- Rechecked every finding from reviews 1 and 2 against live behavior and code.
- Checked route titles, metadata, 404 status/design, history and focus, links,
  request logs, accessibility, security headers and visual identity.
- Recorded the full evidence and fixes in `.factory/review-3.md`.

## Verification

Clean clone: `/tmp/mei-review3.WZZq6t/repo` at
`cc96d1923da10b0f1ee3cce7238d5d98c1335a6e`.

- 20/20 individual `.factory/claims.json` commands passed.
- `npm test` passed: 7 Vitest tests and 34 Playwright tests.
- `npm run typecheck` passed.
- `npm run build:site` passed and produced `dist/site`.
- Live Axe scans reported zero violations on all checked routes.
- The live link crawl found no dead HTTP links.

## Findings left

- F-3-1 / F-1-7: at 390 × 844, the second and third first-screen facts end at
  850 px and 895 px. The suite checks this geometry only on desktop.
- F-3-2 / F-1-10: `/app` still displays “Unicode and CJK” despite the prior
  repair records saying the jargon was removed.

## Next steps

Fit all three facts above the phone fold without reducing the repaired 16 px
text size, add the mobile geometry assertion, replace the workbench jargon with
named writing systems, and add a public-copy regression check.

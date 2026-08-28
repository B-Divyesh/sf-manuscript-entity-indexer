# Review 2 handoff — manuscript-entity-indexer

## Status: FAIL

Completed an adversarial cold review of the live site and commit
`a9ea079f1fd699863f2b431f083caaa0f8d121dd`. No product code was changed.
The full report is `.factory/review-2.md`.

## What was done

- Checked the live landing without scrolling at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, reset, start-real transition, storage isolation,
  live request behavior, sample data and key editing actions.
- Audited every landing and README sentence, plus headings, labels and actions.
- Ran every registered claim command separately from a clean clone.
- Rechecked all 16 findings from review 1 against live behavior and source.
- Crawled links and checked metadata, routes, 404 behavior, history/focus,
  mobile layout, request origins, accessibility and the visual system.

## Verification

- Clean clone: `/tmp/mei-review2.a1U9qj/repo`.
- `npm test`: pass (5 Vitest + 31 Playwright).
- `npm run typecheck`: pass.
- `npm run build`: pass; `dist/site` produced.
- All 19 individual `.factory/claims.json` commands: process exit 0.
- Live factory verifier: pass in 1.2 seconds with no root-page console errors.
- Live Axe at mobile and desktop: no serious/critical issues; two lower-impact
  semantic violations are recorded as F-2-8.
- `cargo test --manifest-path src-tauri/Cargo.toml`: could not compile because
  this worker lacks the documented GLib/WebKit Linux packages (`glib-2.0.pc`).

## Findings left

The review records 11 findings: 6 blocking, 3 major and 2 minor. The blocking
items cover false chapter-search copy, incompatible automatic downloads, a
sample that indexes ordinary Japanese nouns without a dismiss action, and
three review-1 findings that remain only partly fixed. See the report for exact
quotes, reproductions and concrete fixes.

# Review handoff — manuscript-entity-indexer-review-1

## Status: FAIL

Completed an adversarial first-read review of commit
`5abe7595a7d33f92231a6460e5114d6cd3b00580` and the live deployment. No product
code was changed. The complete report is `.factory/review-1.md`.

The review records 16 findings: 2 blocking, 4 major and 10 minor. The blockers
are inaccurate checkout-host copy (the live Sociobot endpoint redirects to
Dodo) and untested “every name/every mention” promises that contradict the
terms.

## Verification performed

- Cold live reads in fresh Chromium contexts at 390 × 844 and 1440 × 900.
- One-click demo, realistic initial state, banner, Reset, real-storage
  isolation, same-origin direct-demo request log and offline reload.
- All 16 `.factory/claims.json` commands, separately, from a fresh clone.
- `npm test`: 5 Vitest and 26 Playwright tests passed.
- `npm run build`: passed and produced `dist/site`.
- `npm run typecheck`: passed.
- `/opt/fleet/lib/verify-url.sh`: passed against the live root.
- Live Axe scans on root, demo, app, privacy, terms and 404: zero violations.
- Live metadata, canonical, title, one-h1/main, deep links, focus restoration,
  back button, sitemap, robots, 404 status/design, request logs and link crawl.
- Earlier review/polish history: none. Existing handoff assertions were
  rechecked where applicable.

## What remains

Resolve F-1-1 through F-1-16 and run a new full review. The automated billing
tests need special attention: they currently pass while the registered words
about a Sociobot-hosted checkout are contradicted by the test's own expected
Dodo redirect.

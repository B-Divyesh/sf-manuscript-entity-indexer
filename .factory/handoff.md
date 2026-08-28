# Polish handoff — manuscript-entity-indexer

## Status: complete

Repair commit: `2d3bbde2598dd1f363391519846ce81a13299cfa` on `main`, pushed to
`origin/main`. The static site was deployed through the factory work-order
configuration to <https://manuscript-entity-indexer.sociobot.in>.

## What changed

- Resolved all 16 findings in `.factory/review-1.md`; the detailed finding map
  is `.factory/polish-1.md`.
- Added direct isolated `?demo=1` entry, persistent demo banner/reset/start-real
  controls, and a disposable `demo:mei:project:v1` session namespace that never
  reads or writes the real project key.
- Rewrote unsupported absolutes, payment disclosure, jargon, mood labels,
  footer provenance and mobile terminology without changing the editorial
  broadsheet visual system.
- Added claim coverage for no tracking, refund revocation, alias-rule evidence
  and the committed desktop release workflow. Checkout tests now follow the
  real Sociobot-to-Dodo redirect.
- Kept real routes, per-route titles/canonicals, designed 404, legal links,
  visible mobile Privacy navigation and the repaired Ledger tab.

## Verification

- Fresh clone at `/tmp/mei-clean.T9mJrd/repo`: `npm ci && npm run test:claims`
  passed all 31 Playwright tests; `.factory/claims.json` has 19 entries, each
  with exactly one matching `@claim:` test.
- Working checkout: `npm test` passed (5 Vitest + 31 Playwright),
  `npm run typecheck`, `npm run build:site`, `npm run build:app`, and
  `npm run test:a11y` passed. The accessibility suite includes Playwright axe
  scans of landing, demo, app, privacy, terms and 404.
- Desktop core: `cargo test --manifest-path src-tauri/Cargo.toml` passed
  (2 tests). The release workflow’s Linux dependencies were installed locally
  to perform this check.
- Local verification: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173`
  passed with no console errors, one h1/main, `lang=en`, title and complete
  image alternatives. The standalone `@axe-core/cli` could not launch a system
  Chrome in this container; the repository’s Playwright axe integration passed.
- Live cold verification: `/opt/fleet/lib/verify-url.sh
  https://manuscript-entity-indexer.sociobot.in` passed (994 ms load, no console
  errors). Cold live checks confirmed the landing, `?demo=1`, privacy, terms
  and 404 titles/h1s; desktop facts bottom at 757/799/841 px in a 1440×900
  viewport; mobile demo has no horizontal overflow, Privacy remains in the
  header and Ledger opens editing controls. `/missing-page` returns HTTP 404.
  Evidence: `.factory/evidence/live/verify.json`,
  `.factory/evidence/live/cold-desktop.png`, and
  `.factory/evidence/live/cold-demo-mobile.png`.

## Run and deploy

```sh
npm ci
npm test
npm run build:site
```

`npm run build:site` writes the deployable site to `dist/site`. The release
workflow remains the mechanism for desktop packages.

## Known gaps

None in the reviewed scope. Desktop binaries are built by GitHub Actions; this
work order verified the Rust core locally and left release publishing unchanged.

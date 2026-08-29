# Review 4 handoff — Manuscript Entity Indexer

## Status

The independent adversarial review is complete at
`8f3c9536ae331aac3b71e886c170e4c43192a964`. No product code changed. The
live deployment passes with zero findings; the full report is
[`review-4.md`](review-4.md).

## Review work

- Tested a fresh 390 × 844 and 1440 × 900 visit, one-click demo, demo storage
  isolation/reset/reload behavior, live request logs, metadata, route history,
  link targets, live Axe scans and the previous-finding history.
- Audited every landing and README sentence with word counts and verified the
  public terminology and claims registry.
- Wrote only `.factory/review-4.md` and this handoff; no application source,
  assets, configuration or release output was modified.

## How verified

- Fresh clone `/tmp/mei-review4-clean.uIvnJo`:
  - all 20 declared claim commands passed separately; the clean rerun of
    `@claim:alias-review` passed after a local preview-server overlap during
    command orchestration;
  - `npm test` passed (7 Vitest and 35 Playwright tests);
  - `npm run typecheck` and `npm run build` passed; `dist/site` was produced.
- Live site: the cold-read gate, direct demo storage boundary, same-origin demo
  log, route/title/focus history, link crawl and Axe scans on six routes all
  passed. The designed unknown route correctly returns 404.

## Run locally

```sh
npm ci
npm test
npm run typecheck
npm run build:site
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build -- --no-bundle
```

Deploy the static site with:

```sh
/opt/fleet/lib/deploy-static.sh manuscript-entity-indexer dist/site
```

## Known gaps and operator action

There are no open product, accessibility, privacy, routing, demo, copy or
deployment findings from reviews 1–4.

Desktop release artifacts remain intentionally unsigned. No secret is needed
for the current unsigned release workflow. If the owner later enables signing,
they must provision `APPLE_CERTIFICATE` for macOS notarization and
`WINDOWS_CERT_PFX` for Windows Authenticode, then wire those secrets into the
release workflow.

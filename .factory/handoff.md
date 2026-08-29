# Polish 3 handoff — Manuscript Entity Indexer

## Status

Complete. The release candidate from `cc96d1923da10b0f1ee3cce7238d5d98c1335a6e`
was repaired in `6e47c974b8ed01f860047713719fb4a1e57a3385`, pushed to `main`,
and deployed as a static site.

## What changed

- Kept the three required 16 px product facts inside the 390 × 844 first
  screen by tightening only mobile hero rhythm and display scale. The live
  fact-row bottoms are 653.59, 698.59 and 743.59 px.
- Replaced the last public implementation-jargon label, “Unicode and CJK,”
  with “Latin, Chinese, Japanese and Korean names.” A regression test rejects
  `Unicode`, `CJK` and `candidate` in first-run workbench copy.
- Preserved the existing local-first demo isolation, direct `?demo=1` entry,
  reset/start-for-real banner, routing, metadata, 404, legal links and
  broadsheet visual system. The cumulative finding map is
  [`.factory/polish-3.md`](polish-3.md).
- Updated the catalog description to a verb-first, 74-character sentence.

## How verified

- Fresh clone `/tmp/mei-polish3-clean.HOcALv` at `6e47c97`:
  - every one of the 20 `claims.json` commands passed independently;
    `/tmp/mei-polish3-claims.log` records all 20 starts and passes;
  - `npm test` passed: 7 Vitest tests and 35 Playwright tests;
  - `npm run typecheck` and `npm run build:site` passed; `dist/site` was
    produced.
- Current worker:
  - `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed (2 Rust
    tests);
  - `CI=true npm run tauri build -- --no-bundle` passed and produced the 5.3
    MB Linux binary at `src-tauri/target/release/manuscript-entity-indexer`;
  - the production site is 5.24 kB gzip CSS; the initial landing JavaScript is
    0.47 kB gzip and the complete browser/app chunk set is 28.43 kB gzip.
- Live deployment:
  - `/opt/fleet/lib/deploy-static.sh manuscript-entity-indexer dist/site`
    succeeded as Azure deployment
    `33867063-32f4-431f-a50b-cd61ca4ea316`;
  - `/opt/fleet/lib/verify-url.sh https://manuscript-entity-indexer.sociobot.in/ .factory/evidence/polish-3-live`
    passed (HTTPS 200, title/lang/main/h1, all image alt attributes and no
    console errors);
  - cold live Axe scans reported zero violations on `/`, `/demo`, `/app`,
    `/privacy`, `/terms` and the designed 404. The unknown URL returned the
    expected 404 status; its browser console records only that top-level
    network response.

Live evidence: `.factory/evidence/polish-3-live/live-check.json`,
`landing-390x844.png`, `app-full-390x844.png`, `demo-390x844.png`, and the
verifier’s desktop/mobile screenshots and report.

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
deployment findings from reviews 1–3.

Desktop release artifacts remain intentionally unsigned. No secret is needed
for the current unsigned release workflow. If the owner later enables signing,
they must provision `APPLE_CERTIFICATE` for macOS notarization and
`WINDOWS_CERT_PFX` for Windows Authenticode, then wire those secrets into the
release workflow.

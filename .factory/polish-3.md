# Polish 3 — complete finding closure

Repair commit: `6e47c974b8ed01f860047713719fb4a1e57a3385`.

This pass re-read `review-1.md`, `review-2.md`, `review-3.md`,
`polish-1.md`, `polish-2.md`, and every retained verification record. The
table is deliberately cumulative: a prior note is not treated as proof unless
the current code and regression coverage still establish it.

| Finding | Current change | Evidence |
| --- | --- | --- |
| F-1-1 | Purchase copy names the Sociobot-to-Dodo handoff and states that card details never enter the app. | `@claim:billing-privacy`, `@claim:checkout-available`; cold root check at `https://manuscript-entity-indexer.sociobot.in/`. |
| F-1-2 | Public copy consistently says names found or detected mentions; no completeness promise remains. | Copy audit; `@claim:chapter-evidence`; root screenshot `.factory/evidence/polish-3-local/landing-390x844.png`. |
| F-1-3 | Importing a unique manuscript sentinel is recorded for the whole browser flow and proves no external request carries it. | `@claim:local-processing`, `@claim:no-tracking`; live `/app` check. |
| F-1-4 | The unprovable approved-refund causation sentence was removed; the tested legal behavior is that a revoked license restores the limit. | `@claim:revoked-license`; live `/terms` check. |
| F-1-5 | Suggested aliases show their matching reason before author action. | `@claim:alias-review`; live `/demo` check. |
| F-1-6 | Release documentation is limited to the committed, tested workflow matrix and manifest/checksum outputs. | `@claim:release-workflow`; workflow source inspection. |
| F-1-7 / F-3-1 | Tightened the phone hero while retaining 16 px informative text. All three fact rows now end at 653.59, 698.59 and 743.59 px in a 390×844 cold viewport. | `@regression all three first-screen facts fit in desktop and iPhone viewports`; `.factory/evidence/polish-3-live/landing-390x844.png`; cold `https://manuscript-entity-indexer.sociobot.in/` check. |
| F-1-8 | Privacy stays in the 390 px primary navigation. | `@a11y mobile workbench fits 390px and exposes its views`; live `/demo` phone check. |
| F-1-9 | The mobile tab is labelled Ledger and opens name editing controls. | `@a11y demo focus and mobile tabs keep a visible keyboard path`; live `/demo` check. |
| F-1-10 / F-3-2 | Replaced the remaining workbench label “Unicode and CJK” with “Latin, Chinese, Japanese and Korean names.” | `@regression workbench public copy names supported writing systems without implementation jargon`; `.factory/evidence/polish-3-live/app-full-390x844.png`; cold `https://manuscript-entity-indexer.sociobot.in/app` check. |
| F-1-11 | The useful Local processing label remains in the edition line. | Copy audit; live root check. |
| F-1-12 | The preview is labelled Sample name index. | Copy audit; live root check. |
| F-1-13 | The privacy section is labelled Draft privacy. | Copy audit; live root check. |
| F-1-14 | Decorative issue number and year remain absent. | Copy audit; live root check. |
| F-1-15 | Footer retains only the required version rather than asset-provenance decoration. | `@a11y main routes have no accessibility violations`; live root check. |
| F-1-16 | Visitor-facing task language uses name, not entity. | `@claim:csv-export`, `@claim:timeline-ledger`, `@regression workbench public copy names supported writing systems without implementation jargon`; live `/demo` and `/app` checks. |
| F-2-1 | Chapter-title search is part of the query filter. | `@claim:chapter-search`; live `/app` check. |
| F-2-2 | Desktop links are explicit by platform/architecture; phones receive a desktop-download page link. | `@claim:platform-download`; live root check. |
| F-2-3 | Common Japanese nouns are filtered and an author can ignore a mistaken name with undo/persistence. | Vitest precision fixture; `@regression an author can ignore a mistaken name and keep that decision after reload`; live `/demo` check. |
| F-2-4 | Keep separate is exposed and covered as an alias-review action. | `@claim:alias-review`; live `/demo` check. |
| F-2-5 | The unsupported unsigned-build status claim is absent from the landing. | `@claim:platform-download`, `@claim:release-workflow`; live root check. |
| F-2-6 | Phone landing/workbench text is at least 16 px and visible targets are at least 44 px. | `@a11y mobile landing keeps informational text and controls at 16px or larger`; `@a11y mobile workbench fits 390px and exposes its views`; live phone checks. |
| F-2-7 | Privacy copy now says the app only suggests matches and the author decides. | Copy audit; live root check. |
| F-2-8 | Invalid landmark and tab-panel roles remain removed; Axe fails on every violation. | `@a11y main routes have no accessibility violations`; live Axe route scan. |

## Verification record

- Fresh clone `/tmp/mei-polish3-clean.HOcALv` at the repair commit: all 20
  `.factory/claims.json` commands passed separately; evidence log:
  `/tmp/mei-polish3-claims.log`.
- Fresh clone full suite: 7 Vitest tests and 35 Playwright tests passed;
  evidence log: `/tmp/mei-polish3-clean-full.log`.
- Fresh clone `npm run typecheck` and `npm run build:site` passed; the static
  artifact is `dist/site` with 5.24 kB gzip CSS and 28.43 kB gzip JavaScript
  across all initial/app chunks.
- The Tauri Rust tests passed (2 tests) and `CI=true npm run tauri build --
  --no-bundle` created `src-tauri/target/release/manuscript-entity-indexer`
  (5.3 MB) after installing the standard Linux Tauri GTK/WebKit development
  dependencies in this disposable worker.
- Deployed through the work-order static configuration. Azure deployment
  `33867063-32f4-431f-a50b-cd61ca4ea316` completed successfully at
  `https://purple-water-082e3d510.7.azurestaticapps.net`, and the custom
  domain returned HTTPS 200.
- Cold live check: root, demo, app, privacy and terms each returned 200 with
  their route title, one `h1`, one `main`, no console errors and zero Axe
  violations. The designed unknown route returned 404 with the expected
  top-level 404 network message only. `?demo=1` showed the sample banner,
  Reset demo and demo title. Full results are in
  `.factory/evidence/polish-3-live/live-check.json`; live screenshots are in
  `.factory/evidence/polish-3-live/`.

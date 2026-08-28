# Polish 2 — review finding closure

Candidate repaired from `a9ea079f1fd699863f2b431f083caaa0f8d121dd` after
reading review 1, review 2, polish 1 and all retained verification reports.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Search now includes `mention.documentTitle`; the input names chapters; landing copy is exact. | `@claim:chapter-search` imports `Unique-Chapter-Z.md` whose title is absent from the text. |
| F-2-2 | Phone visitors get “View desktop downloads”; desktop visitors get a release-page chooser and exact architecture-labelled links. | `@claim:platform-download` covers Mac Intel, Windows x64, Linux x64 and iPhone. |
| F-2-3 | Added conservative Japanese common-noun filtering plus a persistent **Ignore this name** action with undo. | Unit precision fixture; `@regression an author can ignore…`; sample preview count is tested by `@claim:sample-preview`. |
| F-1-3 | The privacy claim test imports a chapter with a unique sentinel while recording every request and body. | `@claim:local-processing`; `@claim:no-tracking`. |
| F-1-4 | Removed the unprovable approved-refund assertion; Terms states the directly observed revoked-license behavior. | `@claim:revoked-license`. |
| F-1-16 | Replaced visitor-facing entity wording with name in UI, landing, README, claims and notices. | `@claim:demo-isolation`, copy audit, browser text checks. |
| F-2-4 | Alias claim and test now exercise **Keep separate** after merge/undo. | `@claim:alias-review`. |
| F-2-5 | Removed unsupported “Unsigned build” label; download block exposes exact release assets instead. | `@claim:platform-download`; `@claim:release-workflow`. |
| F-2-6 | Raised mobile informative copy and links to at least 16 px and all visible controls to 44 px. | `@a11y mobile landing…`; `@a11y mobile workbench…`. |
| F-2-7 | Rewrote vague privacy rule copy as a concrete author-decision statement. | Copy audit; landing browser check in `npm test`. |
| F-2-8 | Replaced non-top-level complementary landmark and invalid tabpanel aside with neutral `div` elements. | `@a11y main routes have no accessibility violations` (zero Axe violations). |
| F-1-1 | Checkout wording keeps the observed Sociobot → Dodo handoff and card-data boundary. | `@claim:billing-privacy`; `@claim:checkout-available`. |
| F-1-2 | No completeness promise remains; copy consistently says detected/found names. | Copy audit and landing source review. |
| F-1-5 | Alias matching rule remains visible and is asserted before merge. | `@claim:alias-review`. |
| F-1-6 | Release copy is limited to the testable workflow/artifact statement. | `@claim:release-workflow`. |
| F-1-7 through F-1-15 | Preserved prior fixed first-screen facts, Privacy navigation, Ledger tab, plain language, useful labels and clean footer. | First-screen, mobile navigation and route tests in `npm test`. |

## Evidence

- `npm test`: 34 Playwright tests + 7 Vitest tests passed.
- `npm run typecheck`: passed.
- `npm run build:site`: passed; `dist/site` produced.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: 2 Rust tests passed.
- `CI=true npm run tauri build -- --no-bundle`: built
  `src-tauri/target/release/manuscript-entity-indexer`.
- Live cold check: `https://manuscript-entity-indexer.sociobot.in/` returned 200
  with the repaired “Sample name index” and chapter-search copy; verifier
  reported no console errors, one title/lang/main/h1 and no missing image alt.
- Live demo check: `https://manuscript-entity-indexer.sociobot.in/demo` returned
  the demo title, persistent banner and Reset demo control; `地図` was absent;
  Axe reported 0 violations and the console was clean.
- Screenshots: `.factory/evidence/polish-2-live/screenshot-desktop.png`,
  `.factory/evidence/polish-2-live/screenshot-mobile.png`, and
  `.factory/evidence/polish-2-live/demo-mobile.png`.

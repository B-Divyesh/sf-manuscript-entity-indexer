# Polish 1 — finding resolution map

Repair commit: `2d3bbde2598dd1f363391519846ce81a13299cfa`.
Live check: <https://manuscript-entity-indexer.sociobot.in> (cold browser;
evidence in `.factory/evidence/live/`).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the false Sociobot-only wording with the disclosed Sociobot → Dodo checkout flow; removed unverified merchant language. | `@claim:billing-privacy`, `@claim:checkout-available`; live landing screenshot `cold-desktop.png` |
| F-1-2 | Replaced “every name/mention” with “names found” and “detected mention”; retained the terms limitation. | `@claim:chapter-evidence`; live root h1 check in `verify.json` |
| F-1-3 | Added the `no-tracking` registry entry and all-route clean-context request/cookie/storage test. | `@claim:no-tracking`; live normal-route console check |
| F-1-4 | Removed the landing refund promise and tested the legal policy against a recorded revoked response. | `@claim:refund-revocation`; live `/terms` h1/title check |
| F-1-5 | Shows the actual matching reason beside every suggested alias and asserts the Venn reason. | `@claim:alias-review`; `cold-demo-mobile.png` |
| F-1-6 | Replaced broad release prose with one registered workflow claim that checks all platforms plus checksum/manifest publishing. | `@claim:release-workflow` |
| F-1-7 | Tightened desktop hero spacing/type and added a 1440×900 bottom-bound assertion for all three facts. | `@regression all three first-screen facts`; live bottoms 757/799/841 px in handoff |
| F-1-8 | Kept Privacy in the mobile primary navigation and asserted it at 390 px. | `@a11y mobile workbench fits 390px`; `cold-demo-mobile.png` |
| F-1-9 | Renamed the mobile Timeline tab to Ledger and verified it exposes display-name editing. | `@a11y demo focus and mobile tabs`; `cold-demo-mobile.png` |
| F-1-10 | Replaced Unicode implementation jargon with named writing systems in landing and README copy. | `.factory/copy-audit.md`; live landing screenshot |
| F-1-11 | Replaced “Offline author’s desk” with the useful “Local processing” label. | `.factory/copy-audit.md`; `cold-desktop.png` |
| F-1-12 | Replaced “On the desk” with “Sample entity index.” | `.factory/copy-audit.md`; `cold-desktop.png` |
| F-1-13 | Replaced “The quiet margin” with “Draft privacy.” | `.factory/copy-audit.md`; live landing screenshot |
| F-1-14 | Removed decorative issue number/year lore and used supported file/local-processing facts instead. | `.factory/copy-audit.md`; `cold-desktop.png` |
| F-1-15 | Removed internal generated-art provenance from the footer; it now shows only the version. | live root cold check; `cold-desktop.png` |
| F-1-16 | Replaced demo-facing “entity/entities” with “name/names”; code-only entity terminology remains internal. | `@claim:demo-isolation`; `cold-demo-mobile.png` |

The direct demo requirement is additionally covered by `@regression ?demo=1`:
it confirms the demo title, sample banner, reset control, real-project isolation
and Start for real cleanup. All claim commands were rerun from a clean clone.

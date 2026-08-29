# Copy audit — polish 3

Reviewed 2026-08-29. Visitor-facing landing, legal, README and first-run
workbench copy was read against the plain-words rules. No sentence is over 22
words and no banned marketing term remains.

| Copy | Words | Result |
| --- | ---: | --- |
| Review names found across your manuscript | 6 | First-screen headline: pass |
| For novelists working across languages who need one private place to check characters, places and aliases. | 16 | Audience and outcome: pass |
| It opens a three-chapter index. | 5 | Action result: pass |
| Your drafts stay on this device. | 6 | Registered `local-processing` claim |
| Works after the first visit without internet. | 7 | Registered `offline-reload` claim |
| $24 once removes the three-file limit. | 6 | Registered `owner-license` claim |
| Search names, chapter titles and excerpt text. | 7 | Registered `chapter-search` claim |
| The app only suggests matches. You decide which names belong together. | 12 | Plain matching boundary: pass |
| The purchase link starts at Sociobot, then opens Dodo’s hosted checkout. | 11 | Registered `billing-privacy` and `checkout-available` claims |
| This app never receives card details. | 6 | Registered `billing-privacy` claim |
| Latin, Chinese, Japanese and Korean names | 6 | First-run supported-writing-systems label: pass |

## Terminology

| Concept | Product word |
| --- | --- |
| detected person, place or other item | name |
| collection of names | index |
| editing and note area | ledger |
| occurrence in chapter text | detected mention |
| isolated sample | demo |

`Entity` remains an internal TypeScript/data-model term only. The product UI,
landing, README, claims and legal copy use “name”. The first-run label names
writing systems instead of implementation terms such as “Unicode” or “CJK”.

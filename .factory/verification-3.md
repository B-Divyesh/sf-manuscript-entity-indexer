# Independent verification 3 — FAIL

**Candidate:** `6da40d35dfd697fc3a1a326df73bafea45785716`  
**Live URL:** <https://manuscript-entity-indexer.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Decision:** **FAIL — release-blocking live mobile Lighthouse performance gate**

## Cold first read — PASS

Fresh desktop load returned HTTP 200 with no script/page errors. The first screen says:

- **What:** “Index every name across your manuscript.”
- **For whom:** “For novelists working across languages who need one private place to check characters, places and aliases.”
- **First click:** “TRY IT WITH SAMPLE DATA,” with the adjacent result “It opens a three-chapter index.”

The h1 has six words, the audience sentence has 16 words, and the visible one-click demo goes directly to `/demo`.

## Mandatory claim verification — PASS

`.factory/claims.json` is present. From the clean candidate checkout after `npm ci`, I invoked every declared test command separately through the browser demo entry point. All 13 passed:

| Claim id | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `local-processing` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `alias-review` | PASS |
| `timeline-ledger` | PASS |
| `chapter-evidence` | PASS |
| `supported-imports` | PASS |
| `source-files-unchanged` | PASS |
| `free-file-limit` | PASS |
| `local-project-storage` | PASS |
| `owner-license` | PASS (recorded verification response) |
| `platform-download` | PASS (recorded GitHub metadata) |

`npm test` also passed: 4 Vitest tests and 20 Playwright tests. Direct live demo exercise independently confirmed 13 entities, alias suggestion → merge → undo, a timeline note, source-chapter dialog, CSV header/14 rows, reset removal of the note, and no external request or console error.

## Local checks — PASS

```text
npm ci                                      PASS; 0 audit findings
npm test                                    PASS; 4 unit + 20 Playwright
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS; dist/site generated
npm run test:a11y                           PASS; 4 Playwright/Axe tests
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                             PASS; 2 Rust tests + doc tests
npm audit --omit=dev && npm audit           PASS; 0 vulnerabilities
```

The initial Rust attempt correctly exposed missing host GLib development headers. After installing the normal Linux Tauri build prerequisites in this disposable verifier container, the exact locked Cargo command passed; no repository files were changed for that setup.

Production build sizes: 26.95 KB gzip JavaScript total (four chunks) and 5.17 KB gzip CSS. First-screen AVIF is 20,334 bytes. These satisfy the stated transfer budgets.

## Live deployment, privacy, and platform checks — PASS

- Candidate is deployed: live `index-SdpFyfis.js` SHA-256 is `d52fad0f630c2051b497b2fe8f1fcf89289200957db4b830b39c2953beff23ec` and live CSS SHA-256 is `0a1a8ec3089659d0f4dd303939181d7c8d28b2dd013500215ccc38a9a3f956e7`, both matching this candidate build. The `v0.1.2` installer release is commit `4eb4bc1`, an ancestor of the candidate; the candidate changes only factory handoff documentation.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. The designed unknown route returns a real 404. Normal routes have one h1 and one main, route-specific plain-language titles, no page/script errors, and no serious/critical Axe findings. `/demo` makes no cross-origin requests.
- At 390×844 with reduced motion, demo has no horizontal overflow. Its Entities/Evidence/Timeline controls expose tab semantics; ArrowRight moved keyboard focus to Evidence. Focus, dialog Escape/return-focus, and the sample workflow passed local accessibility tests.
- `/opt/fleet/lib/verify-url.sh` on live root passed: title, `lang=en`, one h1, main, labelled buttons, image alt text, no console errors; load recorded 985 ms.
- Live headers include CSP limited to self plus GitHub release metadata and Sociobot license API, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive Permissions-Policy. Hashed assets use `public, max-age=31536000, immutable`.
- Service worker registered at `/sw.js`; `registration.update()` succeeded. After first visit, `/demo` reloaded offline with its sample heading and `林梅` entity present.
- The owner-license endpoint was rate-limited: 40 rapid invalid-token verification requests returned 200 for requests 1–30, then 429 for requests 31–40 with `Retry-After: 3` (later 2) seconds.
- Published `v0.1.2` Linux DEB downloaded successfully. SHA-256 `1798df3e043939293a73b339aa9b0689126db91cb7c473a827120158bf72e48b` matches `SHA256SUMS`; package metadata is `manuscript-entity-indexer`, version `0.1.2`, `amd64`.

## Defects

### P1 — release-blocking: Live mobile Lighthouse performance is below the required 90

The performance contract requires mobile Lighthouse performance at least 90. Two fresh live runs both failed while accessibility passed:

| Run | Performance | Accessibility | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 89 | 100 | 1,501 ms | — | 0 |
| 2 | 80 | 100 | 2,491 ms | 722 ms | 0 |

The second run’s 720 ms total blocking time is the principal scoring loss. This fails the explicit release gate despite correct transfer-size budgets and all functional/accessibility tests passing. Profile and reduce main-thread work on the landing route, then rerun a cold mobile Lighthouse check until it consistently reaches 90 or above.

## Evidence retained outside the repository

`/work/evidence/` contains the cold landing screenshot, mobile reduced-motion screenshot, live asset copies/hashes, release metadata/checksum, endpoint rate-limit headers, `verify-url.sh` output directory, and both Lighthouse JSON reports.

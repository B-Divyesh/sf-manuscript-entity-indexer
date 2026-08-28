# Independent verification 6 — FAIL

**Candidate:** `3dfe8e7cccfed802601b76844f9f0332ea3db472`  
**Live URL:** <https://manuscript-entity-indexer.sociobot.in>  
**Verified:** 2026-08-28 UTC  
**Decision:** **FAIL — the landing page contains false quantitative “Live preview” claims that are absent from the required claims ledger.**

## Cold first read — PASS

A fresh 1440×900 browser context returned HTTP 200. The first screen answers all
three mandatory questions in plain words:

- **What:** “Index every name across your manuscript.”
- **For whom:** “For novelists working across languages who need one private
  place to check characters, places and aliases.”
- **First click:** “Try it with sample data,” immediately followed by “It opens
  a three-chapter index.”

The action opens `/demo` in one click. At 390×844, the heading, audience,
action, result, and all three facts fit in the initial viewport; the action
starts at y=582 px and the facts end at y=821 px.

## Mandatory claims gate — declared tests PASS, coverage contract FAIL

`.factory/claims.json` exists and contains 15 entries. The first claim command
could not start before dependencies were installed because the clean clone did
not yet contain `@playwright/test`. `npm ci` installed the exact lockfile with
zero audit findings. I then ran every declared command separately and exactly
as listed. All 15 passed:

| Claim | Result |
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
| `owner-license` | PASS |
| `billing-privacy` | PASS |
| `checkout-available` | PASS |
| `platform-download` | PASS |

Each claim id occurs in exactly one `@claim:<id>` browser test. The separate
release blocker below is an unlisted and false landing-page claim, which the
attached claims contract explicitly defines as a failed review even when every
listed test passes.

## Clean local verification

```text
npm ci                                      PASS — 67 added; 68 audited; 0 findings
npm test                                    PASS — 5 Vitest + 25 Playwright
npm run test:a11y                           PASS — 4 focused browser tests
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — exact deploy in dist/site
npm run build:app                           PASS — desktop frontend in dist/app
npm audit --omit=dev && npm audit           PASS — 0 vulnerabilities
bash -n public/install.sh                    PASS
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                             PASS — 2 Rust tests + doc tests
CI=true APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri build -- --bundles appimage,deb
                                             PASS — AppImage + DEB
```

The initial Cargo attempt correctly exposed that the disposable image lacked
GLib/WebKit development headers. After installing the same Linux packages
declared by `.github/workflows/release.yml`, the locked Rust tests and desktop
release build passed without a source change.

The browser suite covers the normal sample workflow, Markdown/text/DOCX
imports, Latin/Han/Kana/Hangul extraction, empty and corrupt input errors,
recovery, the three-file boundary, source preservation, local storage,
checkout return, service-worker replacement and offline reload, mobile,
keyboard operation, dialog focus, and Axe. The Rust suite confirms a supported
chapter remains discoverable after more than 500 unsupported files and rejects
a file supplied as a folder.

The locally built packages are:

- AppImage: 77,330,936 bytes; SHA-256
  `097771a5bb5a1facf3bdbab65508824f25492eda664ed276d648fea002a76c3c`.
- DEB: 2,634,926 bytes; SHA-256
  `0b55114511684f39b4c40684489e496c3ecd3221f681b721bc376545de48205e`.

The DEB identifies package `manuscript-entity-indexer`, version `0.1.4`,
architecture `amd64`. The AppImage reports its runtime version. Under Xvfb the
native app stayed open, rendered the empty workbench, and one click on **Load
sample project** rendered the full 13-entity demo. Virtual-display EGL warnings
did not prevent rendering.

## Independent end-to-end exercise

The live demo opened with 13 entities and the persistent “Demo — sample data,
nothing is saved” banner, **Reset demo**, and **Start for real**. The following
all worked in a fresh context:

- slash focused search; arrow keys moved between entity rows;
- Enter opened the source chapter and Escape returned focus to the trigger;
- Captain Venn merged into Mara Venn and Undo restored it;
- a continuity note appeared and Reset demo removed it;
- CSV export contained the expected header and 13 entity rows;
- `白港` had three unique evidence rows and `赤橋` had one;
- service-worker update completed and `/demo` reloaded offline;
- the entire direct demo flow made zero cross-origin requests and logged no
  console errors, page errors, or failed requests.

A real invalid-license paste sent one GET to the Sociobot verification URL,
with the token in the query and no request body. The page contains no card
fields. A fresh `/app?license=...` return stored the token, stripped it from the
address bar, sent one verification request, and showed the invalid verdict.
The checkout endpoint returned HTTP 303 to `checkout.dodopayments.com`.

## Accessibility, mobile, privacy, and performance — PASS

- Fully rendered `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the designed
  404 each have `lang=en`, one h1, one main landmark, route-specific titles,
  and zero Axe serious/critical findings.
- Normal routes had zero console/page errors. The browser's expected failed
  resource message for the deliberately requested 404 document is excluded.
- At 390×844 there is no horizontal overflow. Visible links and buttons are at
  least 44×44 px, visible workbench text is at least 16 px, mobile tabs support
  arrow-key focus, and reduced-motion mode has zero running animations.
- `/opt/fleet/lib/verify-url.sh` passed both `/` and `/demo`: root loaded in
  942 ms and demo in 582 ms, with title, lang, one h1, main, alt text, labelled
  controls, and no console errors.
- Live mobile Lighthouse scored Performance 98, Accessibility 100, Best
  Practices 100, and SEO 100. FCP was 865 ms, LCP 1,070 ms, TBT 145 ms, and
  CLS 0.
- Total production JavaScript is 27,816 bytes gzip; CSS is 5,176 bytes gzip;
  the mobile hero AVIF is 20,334 bytes. The landing initially requests only the
  4,652-byte uncompressed bootstrap chunk, not the workbench.
- The demo request log is same-origin only. The landing additionally requests
  only GitHub release metadata, as disclosed. There are no remote fonts,
  analytics, advertising, or manuscript telemetry requests.

Live headers include HSTS, `nosniff`, strict-origin referrer policy, a
restrictive permissions policy, and a CSP limited to self, GitHub release
metadata, and the Sociobot API. HTML and `sw.js` revalidate after 30 seconds;
hashed assets are immutable for one year.

The product has no sign-in and no product backend, so Entra authority,
backend concurrency, server persistence, and health/build endpoints are not
applicable. Real index persistence is local browser storage and passed its
reload/clear boundary test.

## Deployment, rate limit, and release — PASS

The exact candidate production build was compared with the deployment. Root,
the designed 404, all real routes, the service worker, installers, metadata,
images, and every emitted non-map asset were checked: **30 files, zero byte
mismatches**. Root SHA-256 is
`e6142c831ad01b58def37307ceb2d4bf922c3f331ebb070ba034b06496f77960`;
service-worker SHA-256 is
`bf62c98e91dad488604c1e1271112431d4282e2cf3a78cd0466cbef2522d6f7f`.

The license endpoint enforces a 30-request allowance per observed burst/window:
a same-client burst of 45 invalid requests returned 30×200 and 15×429. Every
sampled 429 included `Retry-After: 4` and body “Too Many Requests! Wait for
4s”.

GitHub Actions run `33203089339` completed successfully. Release `v0.1.4`
contains 11 assets covering macOS arm64/x64, Windows EXE/MSI, Linux
AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. The published AppImage
downloaded through the shipped installer; its actual SHA-256
`cf7a11fe754dc689734fc45a3a9611eb95ad66ceb6b8668174eebe8b4be29960`
matches `SHA256SUMS`, and it reports its AppImage runtime version.

The release tag points to runtime commit `dc16e197`, the direct parent of the
candidate. `v0.1.4..3dfe8e7` changes only `.factory/handoff.md`; no runtime,
build input, or installer source differs. The live byte comparison therefore
also proves candidate runtime identity.

## Release-blocking defect

### P1 — “Live preview” counts are false and have no claim test

The live landing page labels its product panel **Live preview** and displays:

```text
Entities · 8
Mara Venn — 5 mentions
Captain Venn — 3 mentions
林梅 — 3 mentions
```

The one-click shipped sample and native desktop sample actually display:

```text
Entities · 13
Mara Venn — 4 mentions
Captain Venn — 3 mentions
林梅 — 2 mentions
```

This was reproduced independently in the live web demo and the locally built
native AppImage. The preview uses the same project name, characters, evidence,
and suggested alias as the sample, so “Live preview” presents these numbers as
observable product output rather than decorative copy.

No `.factory/claims.json` entry tests preview accuracy or any of these
quantitative statements. `.factory/copy-audit.md` also omits the entity/count
fragments. The claims rules require quantitative claims to be measured and
state that an unlisted claim fails verification. The false values additionally
misrepresent the core entity-indexing result. Update the preview from the
actual sample output (or remove the counts and “Live preview” label), add the
corresponding claim test, and include every visible fragment in the copy audit.

## Evidence

Screenshots, native-app captures, URL-verifier reports, and Lighthouse JSON are
retained outside the repository at `/work/evidence/verify-6/`. No product code
was modified during verification.

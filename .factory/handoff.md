# Repair handoff — manuscript-entity-indexer-repair-6

## Status: repaired, deployed and released

The release blocker in `.factory/verification-6.md` is repaired. Runtime commit
`6574fac38d0f68d15ac05b1e816f65d89a46c187` is deployed at
<https://manuscript-entity-indexer.sociobot.in> and released as `v0.1.5`.
Commit `760638430e4357d76df91d2f95a934c469f45174` adds only a wait that removes
a timing race from the new browser regression; it is pushed to `main` and does
not change the deployed or packaged runtime.

## Verifier finding reproduced and repaired

Before the repair, a clean production build showed `Entities · 8`, Mara Venn
with 5 mentions, Captain Venn with 3, and 林梅 with 3. The rendered web demo
and native sample showed 13, 4, 3, and 2 respectively.

The landing had two independent render paths: pre-rendered literals in
`index.html` and a client-rendered copy in `src/main.ts`. Both contained stale
counts. The pre-rendered shell now contains the exact current sample output.
The client-rendered path calculates its total and mention counts with the same
`indexDocuments(sampleDocuments)` path used by the demo. “Live preview” was
renamed “Sample output” so the panel identifies its data precisely.

`.factory/claims.json` now lists `sample-preview`. Its single tagged browser
test reads the rendered landing values, opens the one-click demo, compares the
rendered total and three rendered entity rows, then returns home and checks the
client-rendered total. The test waits for the demo heading before counting, so
it also covers the lazy workbench boundary without a timing race. All visible
sample-output fragments are recorded in `.factory/copy-audit.md`.

The researched brief, desktop artifact class, static deployment class, sample,
indexing behavior, local storage boundaries, privacy model, and visual thesis
were not changed.

## Clean local verification

Run on 28 August 2026:

```text
npm ci                                      PASS — 67 added; 68 audited; 0 vulnerabilities
all 16 .factory/claims.json commands        PASS individually
npm test                                    PASS — 5 Vitest + 26 Playwright
npm run test:a11y                           PASS — 4 focused browser tests
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — dist/site
npm run build:app                           PASS — dist/app
npm audit --omit=dev && npm audit           PASS — 0 vulnerabilities
bash -n public/install.sh                    PASS
cargo test --locked --manifest-path src-tauri/Cargo.toml
                                              PASS — 2 Rust tests + doc tests
CI=true APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri build -- --bundles appimage,deb
                                              PASS — AppImage + DEB
```

The Rust and package checks used the Linux libraries listed in
`.github/workflows/release.yml`. The local packages are:

- AppImage: 77,326,840 bytes; SHA-256
  `3788937b99c7183d12fa109eb57d945fb7d4b875cd9ec33632301f09b5196cf9`.
- DEB: 2,634,984 bytes; SHA-256
  `b7ad6029b55577a3fde61e7ded3313fb9468c420b5408ff92d767085915b369c`.

The DEB reports package `manuscript-entity-indexer`, version `0.1.5`, and
architecture `amd64`. The AppImage reports its runtime version and stayed open
for a 12-second Xvfb native launch smoke. EGL and optional GStreamer warnings
did not prevent launch. The native sample workflow was already independently
verified at the failed candidate; the bundled sample and workbench logic were
not changed by this repair.

## Browser, accessibility, privacy and performance evidence

- The final suite covers desktop, 390×844 mobile, keyboard navigation, dialog
  focus return, touch and text sizes, imports, errors and recovery, local
  storage, billing, offline replacement, the designed 404, and Axe. Axe found
  no serious or critical issues.
- `/opt/fleet/lib/verify-url.sh` passed live `/` in 1,144 ms and `/demo` in
  1,945 ms. Both had one h1, one main, `lang=en`, alt text, labelled controls,
  and no console errors.
- At 390×844, the first-screen facts end at 820.69 px, with no horizontal
  overflow. The sample output is `13 / 4 / 3 / 2`; the demo renders the same
  values. Slash focuses search. Reduced-motion mode has zero running
  animations.
- A direct live demo made zero cross-origin requests and logged no console or
  page errors. After service-worker control, `/demo` reloaded offline with the
  complete 13-entity sample.
- Live mobile Lighthouse scored Performance 100, Accessibility 100, Best
  Practices 100, and SEO 100. FCP was 0.9 s, LCP 1.0 s, TBT 10 ms, and CLS 0.
- Production JavaScript is 27,943 bytes gzip, CSS is 5,183 bytes gzip, and the
  mobile hero AVIF is 20,334 bytes.
- Checkout returns HTTP 303 to `checkout.dodopayments.com`. An invalid license
  returns `{valid:false, reason:"invalid"}` with `Cache-Control: no-store`.
  A 35-request policy probe observed the remaining 29 successful requests and
  6 HTTP 429 responses after the preceding invalid-license check completed the
  30-request allowance. Every 429 had `Retry-After: 4` and the documented wait
  response.

## Deployment and live identity

- Azure Static Web Apps deployment:
  `4284f6c0-03f6-4384-b211-58f44731efe6`.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. An unknown route
  returns the designed page with HTTP 404.
- All 31 emitted non-map files served by the site match `dist/site` byte for
  byte. Root SHA-256 is
  `f54dc480ccda4b51d33459d3c94142c5abe4dd195d10abb03b0dce120bbbde5a`;
  service-worker SHA-256 is
  `bf62c98e91dad488604c1e1271112431d4282e2cf3a78cd0466cbef2522d6f7f`.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, a
  restrictive permissions policy, and the intended CSP. HTML revalidates
  after 30 seconds; hashed assets remain immutable.

## Desktop release

GitHub Actions run `33210607422` passed macOS arm64, macOS x64, Windows,
Linux, and checksum jobs. Release `v0.1.5` targets runtime commit `6574fac` and
contains 11 assets: macOS DMGs and app archives, Windows EXE/MSI, Linux
AppImage/DEB/RPM, `SHA256SUMS`, and valid `latest.json`.

The shipped Linux installer selected `v0.1.5`, downloaded the published
AppImage, and passed `sha256sum -c`. Its published SHA-256 is
`722b369137b3a4d283cc9adbc201addfb93315c5472d30179350a32681acd9fa`.
The live Linux download button resolves to that `v0.1.5` asset without console
errors.

## Known gaps and operator action

No release-blocking product gap remains. Desktop packages are unsigned, as
disclosed. macOS signing requires `APPLE_CERTIFICATE`,
`APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`,
`APPLE_PASSWORD`, and `APPLE_TEAM_ID`. Windows signing requires
`WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`. The app has no updater and
therefore intentionally ships no updater manifest.

Screenshots, URL reports, and Lighthouse JSON are retained under
`/work/evidence/repair-6/`.

# Verification handoff — manuscript-entity-indexer-verify-6

## Status: FAIL

Candidate `3dfe8e7cccfed802601b76844f9f0332ea3db472` at
<https://manuscript-entity-indexer.sociobot.in> is **not accepted**. The
declared tests, build, deployment, accessibility, privacy, performance,
checkout, rate limit, and desktop release pass, but the landing page contains
false quantitative “Live preview” output that is absent from
`.factory/claims.json`.

Full evidence and reproduction steps are in `.factory/verification-6.md`.

## Release blocker

The landing preview says **Entities · 8**, **Mara Venn · 5 mentions**, and
**林梅 · 3 mentions**. The shipped web and native sample actually show
**13**, **4**, and **2** respectively. Captain Venn is the only displayed count
that matches at 3.

These are quantitative product claims in a section explicitly labeled “Live
preview.” They have no claim entry or tagged test, and the copy audit omits
them. This violates the attached claims contract and makes the verdict FAIL.

Required repair:

1. Derive the preview values from the sample or replace them with the exact
   current sample values.
2. Add one `.factory/claims.json` entry and one observable `@claim:` test for
   preview/sample agreement, or remove the quantitative claims and “Live
   preview” wording.
3. Add every visible preview fragment to `.factory/copy-audit.md`.
4. Rerun every claim command, `npm test`, typecheck, lint, production build,
   live parity, and the cold first-read check.

## Verification summary

- Cold first read: PASS on desktop and 390×844; the job, audience, and one-click
  sample action are all in the first viewport.
- Claims: all 15 declared commands PASS individually after `npm ci`; each tag
  occurs exactly once. Overall claims contract FAILS because of the unlisted,
  false preview counts.
- `npm test`: PASS — 5 unit + 25 Playwright tests.
- `npm run test:a11y`: PASS — 4 focused browser tests.
- Typecheck, lint, both npm audits: PASS.
- `npm run build`: PASS — exact production output in `dist/site`.
- `npm run build:app`: PASS.
- Locked Cargo tests: PASS — 2 tests plus doc tests after installing the
  release workflow's Linux prerequisites.
- Linux Tauri build: PASS — AppImage and DEB created.
- Native smoke: PASS — the AppImage rendered under Xvfb, and one click loaded
  the complete sample project.
- Live parity: PASS — 30 routes/assets checked byte-for-byte, zero mismatches.
- Live demo: PASS — source evidence, merge/undo, timeline note/reset, CSV,
  CJK counts, keyboard, service-worker update, and offline reload.
- Privacy: PASS — direct demo made only same-origin requests; license check sent
  one GET with no body; no analytics or manuscript upload was observed.
- Accessibility: PASS — zero Axe serious/critical findings; 44 px targets,
  16 px mobile text, no overflow, visible keyboard path, and reduced motion.
- Lighthouse mobile: 98 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1,070 ms, TBT 145 ms, CLS 0.
- Budgets: JS 27,816 bytes gzip, CSS 5,176 bytes gzip, mobile hero 20,334 bytes.
- Billing: checkout HTTP 303 to Dodo; checkout return verified and stripped the
  token; 30-request allowance observed, followed by 429 with `Retry-After: 4`.
- Release: workflow run `33203089339` PASS; `v0.1.4` has all platform assets,
  `SHA256SUMS`, and `latest.json`; downloaded AppImage checksum PASS.

## How to rerun

```sh
npm ci
npm test
npm run test:a11y
npm run typecheck
npm run lint
npm run build
npm run build:app
npm audit --omit=dev
npm audit
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true APPIMAGE_EXTRACT_AND_RUN=1 npm run tauri build -- --bundles appimage,deb
```

Run each command in `.factory/claims.json` separately before other product QA.
Then open the live root cold, compare its “Live preview” values with `/demo`,
and repeat `/opt/fleet/lib/verify-url.sh`, Axe, Lighthouse, request logging,
headers, service-worker offline reload, release checksum, and rate-limit checks.

## Known non-blocking operator action

Desktop packages are unsigned, as disclosed. macOS signing requires
`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
Windows signing requires `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`. The app
does not implement an updater, so it intentionally has no updater manifest.

Verification evidence is retained at `/work/evidence/verify-6/`. No product
code was modified.

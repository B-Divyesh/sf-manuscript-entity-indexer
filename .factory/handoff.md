# Handoff — Manuscript Entity Indexer v0.1.0

## What shipped

- A Tauri 2 desktop shell with a Vite and TypeScript interface.
- Local folder reading for Markdown, plain text and DOCX files.
- Unicode-normalized Latin and CJK entity candidates.
- Person, place and other classifications with editable display names.
- Explainable alias suggestions, merge, reject and one-step undo.
- Searchable evidence, source-chapter dialogs and entity-linked timeline notes.
- Local project persistence, confirmed deletion and CSV export.
- A memory-only three-chapter demo at `/demo` with reset and exit controls.
- A $24 owner license flow through the Sociobot billing API.
- A static landing site, privacy, terms and designed 404 routes.
- Original generated broadsheet art and three sample-project walkthroughs.
- A cross-platform GitHub Actions release workflow with checksums and a manifest.

The source manuscript is never edited. The web build stores a selected project
under `mei:project:v1`. Demo state is rebuilt in memory and has no storage key.

## Run and verify

```sh
npm ci
npm test
npm run build:site
cargo test --locked --manifest-path src-tauri/Cargo.toml
npm run tauri build -- --no-bundle
```

`npm run build:site` is the work-order build command. It writes `index.html`
and route fallbacks under `dist/site`.

Verification completed on 28 August 2026:

- Vitest: 3 passed.
- Playwright: 13 passed, including all 11 claim tests.
- Axe through Playwright: no serious or critical issues on six routes.
- Console smoke test: no page errors or console errors on six routes.
- Mobile check: the demo fits a 390 by 844 viewport without horizontal scroll.
- Rust: 1 unit test passed; doc tests passed.
- Tauri: release-mode Linux application built with `--no-bundle`.
- Production JS: about 26 KB gzip across the initial chunks.
- Production CSS: 5.07 KB gzip.
- Mobile hero: 20 KB AVIF or 36 KB WebP.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100,
  SEO 100, FCP 1.0 s, LCP 1.7 s, TBT 120 ms and CLS 0.

The image was visually reviewed for branding, seams and misleading UI. It has
no logos, people or readable product claims.

## Known gaps

- Extraction is intentionally heuristic. It can miss uncommon names or mark
  title-case prose as an entity. The author review flow is the safeguard.
- DOCX import reads document text. It does not preserve comments, footnotes,
  tracked changes or page layout.
- The 80% accepted-mention research target needs a separate reviewed manuscript
  corpus. It is not presented as a product claim.
- The release workflow is ready, but release assets do not exist until tag
  `v0.1.0` reaches GitHub Actions.

## Needs operator action

- Register `manuscript-entity-indexer` in Sociobot billing with a $24 one-time
  price and the production return URL.
- Publish tag `v0.1.0` if it was not pushed by this worker, then confirm the
  four GitHub matrix jobs and verify one file against `SHA256SUMS`.
- Current desktop packages are unsigned. macOS signing needs
  `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
  `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD` and `APPLE_TEAM_ID`.
  Windows signing needs `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`. The
  workflow must be connected to those secrets before signed packages ship.

## Next steps

- Measure candidate recall and alias false merges against author-reviewed
  multilingual manuscripts.
- Add EPUB or OpenDocument import only after demand is confirmed.
- Add a versioned project-file backup if authors need device migration.

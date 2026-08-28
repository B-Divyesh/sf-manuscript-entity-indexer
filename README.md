# Manuscript Entity Indexer

Index characters, places and aliases without uploading your manuscript.

This local continuity ledger is for novelists working across languages. It
reads Markdown, text and DOCX chapters, then marks recurring Latin, Han, Kana
and Hangul names with small, visible rules. The author reviews every alias merge.

Try the isolated sample at
https://manuscript-entity-indexer.sociobot.in/demo. Demo edits stay in memory
and disappear on reload.

## What it does

- Opens a manuscript folder without changing its source files.
- Finds recurring person and place candidates with Unicode-aware rules.
- Shows every mention beside its chapter copy.
- Suggests possible aliases and explains the matching rule.
- Lets the author merge, rename, classify, search and undo alias changes.
- Adds entity-linked continuity notes and exports the ledger as CSV.
- Stores a real web index in local browser storage until the author clears it.
- Works after the first web visit without internet.

The free edition indexes three files at a time. A verified owner license costs
$24 once and removes that limit. Checkout stays on Sociobot. License checks
send only the license token.

## Privacy

Manuscript processing runs on the device. The demo makes no cross-origin
requests. The landing page may request release metadata from GitHub. License
verification sends only the pasted token to Sociobot. There is no analytics,
advertising, manuscript telemetry or cloud manuscript storage.

Read the shipped `/privacy` and `/terms` pages for the full policies.

## Run and test

Requirements: Node.js 20 or newer. Desktop builds also need the Rust toolchain
and the platform packages listed in the Tauri documentation.

```sh
npm ci
npm run dev
npm test
npm run build:site
```

The exact deploy command is `npm run build:site`. It writes the static site and
route fallbacks to `dist/site`, with `index.html` at that root.

Useful focused checks:

```sh
npm run test:unit
npm run test:claims
npm run test:a11y
cargo test --manifest-path src-tauri/Cargo.toml
```

Run the desktop shell during development with `npm run tauri dev`. Build a
local platform package with `npm run tauri build`.

## Desktop releases

Tags matching `v*` start `.github/workflows/release.yml`. GitHub Actions builds
unsigned macOS arm64 and x86_64 packages, Windows packages, Linux AppImage and
DEB packages. The release also contains `SHA256SUMS` and `latest.json`.

macOS and Windows builds are unsigned until the operator supplies signing
certificates. Users must approve the operating system warning for these
preview builds.

The landing page selects current macOS, Windows and Linux installers.

## Project notes

- `.factory/brief.json` records the product scope and build command.
- `.factory/design.md` records the original broadsheet visual system and art.
- `.factory/demo.md` explains the clean demo sandbox.
- `.factory/claims.json` maps every product claim to a browser test.

MIT licensed. Built by Param Factory.

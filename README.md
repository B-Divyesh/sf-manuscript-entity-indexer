# Manuscript Entity Indexer

Review names found in your manuscript without uploading it.

This local continuity ledger is for novelists working across languages. It
reads Markdown, text and DOCX chapters, then marks repeated names in Latin,
Chinese, Japanese and Korean text. The author reviews every alias merge.

Try the isolated sample at
https://manuscript-entity-indexer.sociobot.in/demo. Demo edits stay in memory
and disappear on reload.

## What it does

- Opens a manuscript folder without changing its source files.
- Finds repeated person and place names in Latin, Chinese, Japanese and Korean text.
- Shows detected mentions beside their chapter copy.
- Suggests possible aliases and shows the matching rule.
- Lets the author merge, rename, classify, search and undo alias changes.
- Adds entity-linked continuity notes and exports the ledger as CSV.
- Stores a real web index in local browser storage until the author clears it.
- Works after the first web visit without internet.

The free edition indexes three files at a time. A verified owner license costs
$24 once and removes that limit. The purchase link starts at Sociobot, then
opens Dodo's hosted checkout. License checks send only the license token.

## Privacy

Manuscript processing runs on the device. The demo makes no cross-origin
requests. The landing page may request release metadata from GitHub. License
verification sends only the pasted token to Sociobot. There is no analytics or
advertising. The app does not upload manuscript text or store it in the cloud.

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

The release workflow builds macOS, Windows and Linux installers, plus
`SHA256SUMS` and `latest.json`. The landing page selects an installer for the
current platform.

## Project notes

- `.factory/brief.json` records the product scope and build command.
- `.factory/design.md` records the original broadsheet visual system and art.
- `.factory/demo.md` explains the clean demo sandbox.
- `.factory/claims.json` maps every product claim to a browser test.

MIT licensed. Built by Param Factory.

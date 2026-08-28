# Demo sandbox

- URL: `https://manuscript-entity-indexer.sociobot.in/demo`,
  `https://manuscript-entity-indexer.sociobot.in/?demo=1`, or local
  `http://127.0.0.1:4173/demo`.
- Sample: three chapters from *The Glass Harbor papers*. They mix English,
  Han and Japanese names, place aliases, time markers and one deliberate
  continuity conflict. Import checks also cover Kana and Hangul names.
- Reset: choose **Reset demo** in the persistent red banner. Reloading `/demo`
  also rebuilds the original sample.
- Storage: demo edits use the disposable `demo:mei:project:v1` session-storage
  namespace. Entering or resetting the demo clears it and rebuilds the bundled
  sample. The demo never reads or writes the real `mei:project:v1` key.
- Offline check: visit once, wait for the service worker, disconnect, and
  reload `/demo`.

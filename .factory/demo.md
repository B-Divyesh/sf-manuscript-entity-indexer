# Demo sandbox

- URL: `https://manuscript-entity-indexer.sociobot.in/demo` or local
  `http://127.0.0.1:4173/demo`.
- Sample: three chapters from *The Glass Harbor papers*. They mix English and
  Japanese names, place aliases, time markers and one deliberate continuity
  conflict.
- Reset: choose **Reset demo** in the persistent red banner. Reloading `/demo`
  also rebuilds the original sample.
- Storage: demo state stays in JavaScript memory. It never reads or writes the
  real `mei:project:v1` localStorage key.
- Offline check: visit once, wait for the service worker, disconnect, and
  reload `/demo`.

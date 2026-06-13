# Project Context

## Purpose
Generate Pi coding-agent theme JSON outputs from the upstream Poimandres theme submodule.

## Current State
- Root generator: `src/generate-pi-theme.js` (ESM).
- White palette extracted at build time by `src/extract-white-palette.js` via `extractWhitePalette(path)`. No hard-coded white colours remain in the generator.
- Outputs written to `themes/pi/`:
  - `poimandres.json`, `poimandres-noitalics.json`, `poimandres-storm.json`, `poimandres-noitalics-storm.json`, `poimandres-white.json`
- `white-noitalics` is intentionally not generated — upstream white and white-noitalics colours are identical.
- Upstream source: git submodule at `drcmda/poimandres-theme` (read-only).

## Validation (`test/pi-theme-schema.test.js`)
Three `describe` blocks — all must pass before a release:
1. **Pi theme schema and mapping validation** — schema conformance, declared-vars check, upstream-colour fidelity (all five themes).
2. **White palette extraction** — pins each `CANONICAL_MAPPING` entry to its upstream token; regression guards for `bluishGray` (`#506477`) and `selection` (`#717cb425`).
3. **Cross-variant palette consistency** — asserts `transparent` and `blueishGreen` are equal across dark and white variants (the only two keys that are genuinely shared upstream).

## Build Flow
- `pnpm build` — runs tests, clears `themes/`, regenerates.
- `pnpm generate:pi-theme` — alias for `pnpm build`.

## Notes
- `export` must not be emitted as an empty object in generated themes.
- Most accent colours differ intentionally between dark and white variants; only `transparent` and `blueishGreen` are identical across all themes.

# Project Context

## Purpose
Generate Pi coding-agent theme JSON outputs from the upstream Poimandres theme submodule.

## Current State
- Root generator lives in `src/generate-pi-theme.js` and runs with ESM imports.
- Outputs are written to `themes/pi/`.
- The upstream theme source is tracked as a git submodule at `drcmda/poimandres-theme`.
- Generated outputs currently include:
  - `poimandres.json`
  - `poimandres-noitalics.json`
  - `poimandres-storm.json`
  - `poimandres-noitalics-storm.json`
  - `poimandres-white.json`
- `white-noitalics` is intentionally not generated because the upstream white-noitalics colors are identical to white.

## Validation
- Schema validation lives in `test/pi-theme-schema.test.js` and fetches the Pi schema from the live schema URL.
- Mapping validation is also in `test/pi-theme-schema.test.js` and checks:
  - generated colors reference declared vars
  - generated var values are present in the corresponding upstream Poimandres theme `colors` or `tokenColors[*].settings.foreground`
- The test suite is the source of truth for generator correctness.

## Build Flow
- `pnpm build` runs tests first, clears `themes/`, then regenerates themes.
- `pnpm generate:pi-theme` is an alias for `pnpm build`.

## Notes
- `export` is populated in generated Pi themes and should not be emitted as an empty object.
- `selectedBg` is validated like every other generated color reference and requires `selection` to exist in vars.

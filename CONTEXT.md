# Project Context

## Purpose
Generate Pi coding-agent theme JSON outputs from the upstream Poimandres theme submodule.

## Current State
- Root generator: `src/generate-pi-theme.ts` (ESM).
- White palette extracted at build time by `src/extract-white-palette.ts` via `extractWhitePalette(path)`. No hard-coded white colours remain in the generator.
- Palette values are normalised through `src/hex-utils.ts` so theme vars are written as 6-digit hex values (`#RRGGBB`); alpha-bearing upstream values such as selection are stripped before output.
- Outputs written to `themes/pi/`:
  - `poimandres.json`, `poimandres-storm.json`, `poimandres-white.json`
- Generated JSON is tab-indented via `JSON.stringify(..., "\t")`.
- Upstream source: git submodule at `drcmda/poimandres-theme` (read-only).

## Validation (`test/pi-theme-schema.test.ts`)
Four main checks now cover generation and extraction:
1. **Pi theme schema and mapping validation** — schema conformance, declared-vars check, and upstream-colour fidelity for the three generated themes.
2. **White palette extraction** — pins each `CANONICAL_MAPPING` entry to its upstream token; regression guards for `bluishGray` (`#506477`) and `selection` (`#717cb425`).
3. **normaliseHex / normalisePalette** — unit tests for 6-digit pass-through, 8-digit alpha stripping, and invalid input handling.
4. **Generated theme vars hex validity** — asserts every generated theme var is 6-digit hex.
5. **Cross-variant palette consistency** — currently only checks shared vars that are intentionally identical across dark and white variants.

## Build Flow
- `pnpm build` — regenerates themes with Node `--import tsx`.
- `pnpm generate:pi-theme` — alias for `pnpm build`.
- `scripts/precommit.sh` — runs `pnpm check`, `pnpm test`, and `pnpm build` before commit.

## Notes
- `export` is emitted as a small mapping, not an empty object.
- The current generator uses `selection: palette.selection` and normalises it to `#717cb4` / `#818cc4` in the generated outputs.
- Most accent colours differ intentionally between dark and white variants.

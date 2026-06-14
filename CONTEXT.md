# Project Context

## Purpose

Generate Pi coding-agent theme JSON outputs from the upstream Poimandres theme submodule.

## Current State

- Root generator: `src/generate-pi-theme.ts` (ESM).
- White palette extraction lives in `src/extract-white-palette.ts` and consumes the same palette shape as the dark variants.
- Shared palette types are centralised in `src/types.ts` (`PaletteKey`, `Palette`, `PaletteWithoutBlueishGreen`).
- Upstream source-theme assignments are generated into `src/generated-source-theme-assignments.ts` by `src/generate-source-token-assignments.ts`.
- White tokenColor references such as `${colors.blueishGreen}` are resolved by the extractor; `fontStyle` is ignored.
- Palette values are normalised through `src/hex-utils.ts` so theme vars are written as 6-digit hex values (`#RRGGBB`); alpha-bearing upstream values are stripped before output.
- Generated JSON is tab-indented via `JSON.stringify(..., "\t")`.
- Outputs written to `themes/pi/`:
  - `poimandres.json`, `poimandres-storm.json`, `poimandres-white.json`
- Upstream source: git submodule at `drcmda/poimandres-theme` (read-only).

## Validation (`test/pi-theme-schema.test.ts`)

Current checks cover the source/extraction path and the generated artifacts separately:

1. **Source-level extraction checks** — `White palette extraction`, `normaliseHex`, and `normalisePalette`.
2. **Generated theme validation** — `test/generated-theme.test.ts` covers schema conformance, declared-vars check, upstream-colour fidelity, and 6-digit hex validation for the generated themes.

## Build Flow

- `pnpm build` — regenerates themes with `pnpm clean:themes` and Node `--import tsx`.
- `pnpm generate:source-assignments` — regenerates `src/generated-source-theme-assignments.ts` from upstream source theme assignments.
- `pnpm prebuild` — runs `pnpm check && pnpm test && pnpm clean:themes` before build.
- `scripts/precommit.sh` — runs `pnpm build` and `pnpm test:generated` before commit.

## Notes

- `export` is emitted as a small mapping, not an empty object.
- `syntaxOperator` is intentionally emitted as the raw hex literal `#ff0000`.
- Most accent colours differ intentionally between dark and white variants.
- White-specific source literals should not be pinned in tests; prefer contract checks against the upstream source relationships.

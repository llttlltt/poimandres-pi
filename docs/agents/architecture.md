# Architecture & Conventions

## Key Decisions

- **Generated artefacts are committed** — `themes/pi/` is tracked in git so the published npm package contains ready-to-use files without requiring a build step on install.
- **Submodule is the single source of truth** — all colour values originate from `poimandres-theme/`. No upstream palette colours are hard-coded in `src/`.
- **White palette is extracted dynamically** — `src/palette-extractor.ts` resolves `${colors.X}` references from the upstream white theme at build time rather than being pinned.
- **Individual theme paths in `pi.themes`** — `package.json` lists each theme file explicitly (not a directory) to match Pi package conventions.
- **Biome scanner exclusions** — `poimandres-theme/` uses a force-ignore pattern (`!!poimandres-theme`) so the scanner never enters the submodule. `themes/pi/` uses a regular negation (`!themes/pi`) so type information can still be extracted from generated files, but they are not linted or formatted.

## Structure

```
src/                    Source — extraction, building, hex utilities
themes/pi/              Generated outputs (committed)
poimandres-theme/       Read-only upstream submodule
test/                   Unit tests (pi-theme-schema) + artefact tests (generated-theme)
.github/workflows/      CI (ci.yml) and release + publish (release-please.yml)
docs/agents/            Architecture and testing conventions
```

## Module Responsibilities

| File | Role | Key exports |
|---|---|---|
| `src/generate-pi-theme.ts` | Thin I/O runner — no logic | — |
| `src/theme-builder.ts` | Theme-building logic | `buildTheme`, `PiThemeOutput`, `BuildThemeInput`, `SCHEMA_URL` |
| `src/palette-extractor.ts` | White palette extraction from upstream JSON | `extractWhitePalette`, `VsCodeTheme` |
| `src/palette.ts` | Shared palette shape & types | `PALETTE_KEYS`, `PaletteKey`, `Palette` |
| `src/hex.ts` | Hex normalisation utilities | `normaliseHex`, `normalisePalette`, `HEX_REGEX`, `HEX_ALPHA_REGEX` |

## Palette Rules

- The white palette is extracted from `src/palette-extractor.ts`. Do not re-introduce hard-coded white colour values in `src/generate-pi-theme.ts`.
- All generated theme vars must be 6-digit hex (`#RRGGBB`). Alpha-bearing upstream values are stripped by `src/hex.ts` before output.
- When white tokenColor `foreground` values reference `${colors.X}`, the extractor resolves the reference and ignores `fontStyle`.

## Type & Export Ownership

- `SCHEMA_URL` lives in `src/theme-builder.ts`. Do not duplicate it elsewhere.
- `VsCodeTheme` (the VS Code JSON file shape) is exported from `src/palette-extractor.ts`. Import from there; do not define local copies in tests.
- `PiTheme` in test files is a re-export alias: `export type { PiThemeOutput as PiTheme }` in `test/theme-test-helpers.ts`. There is no separate interface.

## Variant Rules

- Do not generate a `white-noitalics` variant — upstream white and white-noitalics colours are identical.
- Add new Pi theme variants only when there is a distinct upstream colour basis.
- Most accent colours differ intentionally between dark and white variants.
- The `export` block in each generated theme file is a small key→var mapping, not an empty object.

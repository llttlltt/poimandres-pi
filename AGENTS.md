# AGENTS.md

## Working Rules
- Use ESM imports in root project files.
- Keep generated theme outputs in `themes/pi/` only.
- Treat `drcmda/poimandres-theme` as the upstream source of truth for palette and token colors.
- Prefer tests over generator-time assertions for validation logic.
- Keep all theme validation tests in `test/pi-theme-schema.test.ts` unless there is a strong reason to split them.

## Current Conventions
- `build` is the primary command for regeneration.
- `clean:themes` removes the generated `themes/` directory before regeneration.
- Do not generate `white-noitalics`; the upstream white and white-noitalics colors are identical.
- Add new Pi theme variants only if there is a distinct upstream color basis.
- The white palette is extracted from the upstream JSON by `src/extract-white-palette.ts`. Do not re-introduce hard-coded white colour values in `src/generate-pi-theme.ts`.
- When adding a new palette key to the white theme, add it to `CANONICAL_MAPPING` in `src/extract-white-palette.ts` and pin it with a test in the `White palette extraction` describe block.

## Documentation Hygiene
- Prune resolved work from context docs instead of expanding them.
- Reference files directly rather than pasting large implementation details.
- Keep `CONTEXT.md` and `AGENTS.md` aligned with the actual generator and tests.

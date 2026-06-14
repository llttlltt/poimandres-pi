# AGENTS.md

## Working Rules

- Use ESM imports in root project files.
- Keep generated theme outputs in `themes/pi/` only.
- Treat `drcmda/poimandres-theme` as the upstream source of truth for palette and token colors.
- Prefer tests over generator-time assertions for validation logic.
- Keep all theme validation tests in `test/pi-theme-schema.test.ts` unless there is a strong reason to split them.

## Current Conventions

- `build` is the primary command for regeneration and runs `pnpm clean:themes` before `node --import tsx src/generate-pi-theme.ts`.
- `generate:source-assignments` regenerates `src/generated-source-theme-assignments.ts` from the upstream source theme assignments.
- `prebuild` is the source-validation gate: `pnpm check && pnpm test && pnpm clean:themes`.
- `scripts/precommit.sh` is the repo-local guardrail: it runs `pnpm build` and `pnpm test:generated` before commit.
- Do not generate `white-noitalics`; the upstream white and white-noitalics colors are identical.
- Add new Pi theme variants only if there is a distinct upstream color basis.
- The white palette is extracted from the upstream JSON by `src/extract-white-palette.ts`. Do not re-introduce hard-coded white colour values in `src/generate-pi-theme.ts`.
- Palette values are normalised through `src/hex-utils.ts`; generated theme vars should be 6-digit hex values only.
- `syntaxOperator` is intentionally emitted as the raw hex literal `#ff0000`.
- Keep shared palette shape/types in `src/types.ts`.
- When white tokenColor `foreground` values reference `${colors.X}`, the extractor should resolve the reference and ignore non-color settings like `fontStyle`.
- When adding or changing generated source-theme assignment logic, regenerate `src/generated-source-theme-assignments.ts` rather than editing it by hand.

## Documentation Hygiene

- Prune resolved work from context docs instead of expanding them.
- Reference files directly rather than pasting large implementation details.
- Keep `CONTEXT.md` and `AGENTS.md` aligned with the actual generator and tests.

# Testing Conventions

## Test File Split

| File | Covers |
|---|---|
| `test/pi-theme-schema.test.ts` | Source-level: palette extraction, `normaliseHex`, `normalisePalette`, `buildTheme` unit tests |
| `test/generated-theme.test.ts` | Generated artifacts: schema conformance, declared-vars check, upstream-colour fidelity, 6-digit hex validation |

Do not merge these files.

## Rules

- Prefer tests over generator-time assertions for validation logic.
- Do not pin white-specific source literal values in tests; use contract checks against upstream source relationships instead.

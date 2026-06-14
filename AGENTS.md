# AGENTS.md

Extracts colour values from the upstream Poimandres VSCode theme submodule and generates Pi coding-agent theme JSON.

**Package manager**: `pnpm`

## Outputs

`themes/pi/poimandres.json`, `themes/pi/poimandres-storm.json`, `themes/pi/poimandres-white.json`

## Commands

| Command | Purpose |
|---|---|
| `pnpm build` | Regenerate themes (runs type-check, unit tests, and clean as a prebuild step) |
| `pnpm check` | Type-check |
| `pnpm test` | Unit & extraction tests |
| `pnpm test:generated` | Generated-artifact tests |

The git pre-commit hook runs `pnpm build && pnpm test:generated` via `scripts/precommit.sh`.

## Hard Constraints

- `poimandres-theme/` is a read-only git submodule. Never modify files inside it.
- Generated outputs go in `themes/pi/` only.

## Further Reading

- [Architecture & conventions](docs/agents/architecture.md)
- [Testing conventions](docs/agents/testing.md)

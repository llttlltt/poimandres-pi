# AGENTS.md

Extracts colour values from the upstream Poimandres VSCode theme submodule and generates Pi coding-agent theme JSON.

**Package manager**: `pnpm`

## Outputs

`themes/pi/poimandres.json`, `themes/pi/poimandres-storm.json`, `themes/pi/poimandres-white.json`

## Commands

| Purpose | Command |
|---|---|
| Regenerate themes | `pnpm build` |
| Type-check | `pnpm check` |
| Unit & extraction tests | `pnpm test` |
| Generated-artifact tests | `pnpm test:generated` |

The git pre-commit hook runs `pnpm build && pnpm test:generated` via `scripts/precommit.sh`.

## Hard Constraints

- `drcmda/poimandres-theme/` is a read-only git submodule. Never modify files inside it.
- Generated outputs go in `themes/pi/` only.

## Further Reading

- [Architecture & conventions](docs/agents/architecture.md)
- [Testing conventions](docs/agents/testing.md)

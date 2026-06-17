# AGENTS.md

`poimandres-pi` extracts colour values from the upstream [Poimandres VSCode theme](https://github.com/drcmda/poimandres-theme) (read-only submodule) and generates three Pi-compatible theme JSON files.

**Package manager**: `pnpm` (v11) · **Node**: v24

## Commands

| Command | Purpose |
|---|---|
| `pnpm build` | Regenerate themes — runs verify + clean as prebuild |
| `pnpm verify` | Lint, type-check, and unit test without building |
| `pnpm lint` | Fix all formatting and lint issues (`biome check --write`) |

## Hard Constraints

- `poimandres-theme/` is a read-only git submodule — never modify files inside it. If accidentally dirtied, restore with `git reset --hard HEAD` inside the submodule (`git checkout -- .` does not fully revert).
- Generated outputs go in `themes/pi/` only.

## Further Reading

- [Architecture & key decisions](docs/agents/architecture.md)
- [CI/CD & release workflow](docs/agents/ci-cd.md)
- [Testing conventions](docs/agents/testing.md)

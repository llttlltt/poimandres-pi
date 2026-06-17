# CI/CD & Release Workflow

## CI

`.github/workflows/ci.yml` runs on every push and pull request to `master`:

1. `biome ci` — lint and format check (read-only)
2. `pnpm build` — regenerates themes (includes verify + clean as prebuild)
3. `pnpm test:generated` — verifies generated artefacts against schema and upstream colours

> `pnpm test:generated` is not a `postbuild` step. CI calls it explicitly after `pnpm build`; locally it is an optional sanity check.

## Release

`.github/workflows/release-please.yml` manages semver and changelog via [Conventional Commits](https://www.conventionalcommits.org/). Merging the release PR publishes to npm automatically — no manual version bumps.

### Conventional Commits

| Prefix | Version bump |
|---|---|
| `fix:` | Patch |
| `feat:` | Minor |
| `feat!:` / `BREAKING CHANGE:` | Major |
| `chore:`, `docs:`, `test:` | No bump |

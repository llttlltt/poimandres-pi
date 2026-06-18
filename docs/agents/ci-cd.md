# CI/CD & Release Workflow

## CI

`.github/workflows/ci.yml` runs on every push and pull request to `master`:

1. `biome ci` — lint and format check (read-only)
2. `pnpm build` — regenerates themes (includes verify + clean as prebuild)
3. `pnpm test:generated` — verifies generated artefacts against schema and upstream colours

> `pnpm test:generated` is not a `postbuild` step. CI calls it explicitly after `pnpm build`; locally it is an optional sanity check.

## Release

`.github/workflows/release-please.yml` is triggered by `workflow_run` after CI passes — it never runs if CI fails.

The full pipeline on every push to `master`:

1. CI passes
2. Release-please runs, opens or updates a release PR
3. Release PR is auto-merged immediately via `gh pr merge --merge`
4. The merge triggers CI again, then release-please runs once more
5. Release-please detects its own release commit, creates a GitHub release and tag
6. The `publish` job fires and runs `npm publish --access public`

### Key configuration

- Uses `RELEASE_PLEASE_TOKEN` (a fine-grained PAT scoped to this repo) — required so CI triggers on release PRs. `GITHUB_TOKEN` cannot trigger CI on PRs it creates.
- `release-type: node` — bumps `package.json` version and maintains `CHANGELOG.md` automatically.
- Package is scoped (`@llttlltt/poimandres-pi`) — `--access public` is required on publish or npm rejects with `E402`.
- No branch protection ruleset — the `workflow_run` trigger is the sole CI gate.

### Conventional Commits

| Prefix | Version bump |
|---|---|
| `fix:` | Patch |
| `feat:` | Minor |
| `feat!:` / `BREAKING CHANGE:` | Major |
| `chore:`, `docs:`, `test:` | No bump |

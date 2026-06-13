---
goal: "Create a Pi Coding Agent theme that matches the Poimandres VSCode theme"
version: "1.0"
date_created: "2026-06-16"
last_updated: "2026-06-16"
owner: "elliott"
status: "Completed"
tags: ["feature", "theme", "pi", "vscode", "poimandres"]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This plan is completed. The root project now generates Pi theme JSON outputs from the upstream Poimandres theme submodule and validates the outputs against the live Pi schema.

## 1. Requirements & Constraints

- **REQ-001**: Create Pi theme outputs from the Poimandres palette source in `drcmda/poimandres-theme`.
- **REQ-002**: Use the Pi schema from `https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json`.
- **REQ-003**: Generate distinct dark, noitalics, storm, noitalics-storm, and white theme outputs.
- **REQ-004**: Avoid generating `white-noitalics` because the upstream colors are identical to `white`.
- **REQ-005**: Keep validation in the test suite and avoid generator-time schema assertions.
- **CON-001**: Keep generated outputs under `themes/pi/`.
- **PAT-001**: Use `build` as the regeneration entry point.
- **PAT-002**: Run tests before regeneration and clean generated theme files before writing new outputs.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Scaffold the generator and repository integration.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add the upstream Poimandres repository as a git submodule at `drcmda/poimandres-theme`. | ✅ | 2026-06-16 |
| TASK-002 | Create `src/generate-pi-theme.js` using ESM imports and outputting Pi JSON files to `themes/pi/`. | ✅ | 2026-06-16 |
| TASK-003 | Add root package metadata and test runner configuration for the generator workflow. | ✅ | 2026-06-16 |

### Implementation Phase 2

- GOAL-002: Harden generation, validation, and output hygiene.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | Derive the white Pi palette from the upstream white theme values and omit `white-noitalics` generation. | ✅ | 2026-06-16 |
| TASK-005 | Consolidate schema validation and mapping validation into `test/pi-theme-schema.test.js`. | ✅ | 2026-06-16 |
| TASK-006 | Add `build` and `clean:themes` scripts so generated output is cleaned before regeneration. | ✅ | 2026-06-16 |

## 3. Alternatives

- **ALT-001**: Keep `white-noitalics` as a separate generated file. Not chosen because the upstream colors are identical to `white`.
- **ALT-002**: Rely only on generator-time validation. Not chosen because the test suite provides clearer, reusable validation.

## 4. Dependencies

- **DEP-001**: `drcmda/poimandres-theme` submodule.
- **DEP-002**: Pi theme schema URL.
- **DEP-003**: Vitest.
- **DEP-004**: Ajv.

## 5. Files

- **FILE-001**: `src/generate-pi-theme.js` — root Pi theme generator.
- **FILE-002**: `test/pi-theme-schema.test.js` — schema and mapping validation.
- **FILE-003**: `themes/pi/*.json` — generated Pi theme outputs.
- **FILE-004**: `package.json` — build/test scripts.
- **FILE-005**: `CONTEXT.md` and `AGENTS.md` — synchronized project guidance.

## 6. Testing

- **TEST-001**: Validate every generated Pi theme against the live schema.
- **TEST-002**: Verify generated color references resolve to declared vars.
- **TEST-003**: Verify generated var values are present in upstream theme colors or token foregrounds.

## 7. Risks & Assumptions

- **RISK-001**: Upstream Poimandres palette changes may require updating the white palette derivation.
- **RISK-002**: Pi schema changes may require adjustments to generated field names or optional export behavior.
- **ASSUMPTION-001**: The upstream submodule remains the authoritative source for theme palette intent.

## 8. Related Specifications / Further Reading

- `src/generate-pi-theme.js`
- `test/pi-theme-schema.test.js`
- `drcmda/poimandres-theme/themes/`
- Pi themes documentation: https://pi.dev/docs/latest/themes#creating-a-custom-theme

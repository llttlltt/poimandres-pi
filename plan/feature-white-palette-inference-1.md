---
goal: Infer white theme palette from upstream JSON instead of hardcoding values
version: 1.0
date_created: 2026-06-16
last_updated: 2026-06-16
owner: Elliott
status: 'Completed'
tags: [feature, refactor, chore]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

`src/generate-pi-theme.js` currently hard-codes the 21-key `whiteColors` palette for
`poimandres-white`. Two of those values (`bluishGray`, `selection`) differ from what the
upstream `poimandres-color-theme-white.json` actually contains, meaning the Pi white theme
is no longer a faithful adaptation of the upstream source.

This plan replaces the hard-coded palette with an extractor that reads the upstream white
JSON at build time using a canonical, token-level mapping (the same logical mapping the
upstream `theme.js` template uses). New tests pin each extracted value to its source token
and add a cross-variant consistency check so shared "accent" palette keys must be equal
across all four generated variants.

---

## 1. Requirements & Constraints

- **REQ-001**: All 21 palette keys required by `buildTheme` in `src/generate-pi-theme.js`
  must be derivable from `drcmda/poimandres-theme/themes/poimandres-color-theme-white.json`
  without manual colour edits.
- **REQ-002**: The extractor must use only VS Code token keys that appear in the upstream
  `theme.js` template as **exact** matches (no alpha-suffix stripping) OR as a `tokenColors`
  entry with a known, stable scope, so the mapping stays in sync if the upstream JSON is
  regenerated.
- **REQ-003**: `bluishGray` must resolve to `#506477` (from `inputValidation.infoBackground`)
  and `selection` must resolve to `#717cb425` (from `editor.selectionBackground`) — the two
  values that currently diverge from the upstream source.
- **REQ-004**: All existing tests must continue to pass after the change. The
  `$file resolves only to upstream source colors or token foregrounds` test for
  `poimandres-white.json` implicitly validates the extracted values once the theme is
  regenerated.
- **REQ-005**: New tests must not require network access or a running build; they read the
  upstream JSON and the generated theme file from disk.
- **CON-001**: No new runtime dependencies may be added to `package.json`. The extractor is
  a plain ESM module using only Node.js built-ins (`fs`, `path`).
- **CON-002**: The upstream `drcmda/` subtree must not be modified.
- **GUD-001**: Keep all theme validation tests in `test/pi-theme-schema.test.js` per
  `AGENTS.md`.
- **GUD-002**: Use ESM imports throughout per `AGENTS.md`.
- **PAT-001**: Follow the same `paletteFromTheme()` / `buildTheme()` pattern already
  present in `src/generate-pi-theme.js`; the extractor should return an object in the
  same shape as the objects returned by `paletteFromTheme`.

---

## 2. Implementation Steps

### Implementation Phase 1 — Create `src/extract-white-palette.js`

- GOAL-001: Provide a pure extraction function that maps palette keys → upstream white JSON
  token values using a documented, stable canonical mapping table.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `src/extract-white-palette.js` as an ESM module. Export a single function `extractWhitePalette(whiteJsonPath)` that accepts the absolute path to `poimandres-color-theme-white.json` and returns the 21-key palette object. | | |
| TASK-002 | Inside `extractWhitePalette`, define a `const COLOR_TOKEN_MAP` object with 20 entries, each mapping a palette key to the VS Code `colors` token key that carries its bare hex value in the upstream template (see mapping table in §5). | | |
| TASK-003 | Define `const BLUEISH_GREEN_SCOPE = "source.sass keyword.control"` and extract `blueishGreen` by finding the first `tokenColors` entry whose `scope` array (or string) includes that value, then reading `settings.foreground`. | | |
| TASK-004 | Throw a descriptive `Error` if any palette key is missing from the JSON (i.e., `undefined` value after lookup). The message must name the missing key and the token that was expected. | | |
| TASK-005 | Export a secondary `CANONICAL_MAPPING` constant (plain object, same shape as `COLOR_TOKEN_MAP`) so tests can import it without duplicating the source of truth. | | |

### Implementation Phase 2 — Update `src/generate-pi-theme.js`

- GOAL-002: Replace the hard-coded `whiteColors` block with a call to the new extractor,
  keeping the file's overall structure identical.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Add `import { extractWhitePalette } from "./extract-white-palette.js"` at the top of `src/generate-pi-theme.js` alongside the existing imports. | | |
| TASK-007 | Replace the entire `const whiteColors = { ...baseColors, ... }` literal (lines 29–52) with `const whiteColors = extractWhitePalette(resolve(process.cwd(), "drcmda/poimandres-theme/themes/poimandres-color-theme-white.json"))`. | | |
| TASK-008 | Run `node src/generate-pi-theme.js` (without the full `pnpm build` to skip tests) and verify the five output files are written without error. | | |

### Implementation Phase 3 — Tests

- GOAL-003: Pin extracted white palette values to their canonical upstream tokens and add
  a cross-variant consistency check for accent colours shared across all themes.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Add a new `describe("White palette extraction")` block in `test/pi-theme-schema.test.js`. Import `CANONICAL_MAPPING` and `extractWhitePalette` from `../src/extract-white-palette.js`. | | |
| TASK-010 | Add `test("each palette key maps to the correct upstream white JSON token value")`: for every entry in `CANONICAL_MAPPING`, assert that `extractWhitePalette(whiteSourcePath)[key]` equals `sourceWhiteJson.colors[token]` exactly. | | |
| TASK-011 | Add `test("blueishGreen maps to source.sass keyword.control token foreground")`: assert that `extractWhitePalette(whiteSourcePath).blueishGreen` equals the `foreground` of the first matching tokenColor entry. | | |
| TASK-012 | Add `test("bluishGray resolves to #506477 (upstream selection)")` and `test("selection resolves to #717cb425 (upstream editor selection)")` as regression guards for the two values that previously diverged from upstream. | | |
| TASK-013 | Add a new `describe("Cross-variant palette consistency")` block. Define `SHARED_ACCENT_KEYS = ["hotRed","lightBlue","brightMint","pink","brightYellow","lowerBlue","desaturatedBlue","transparent","blueishGreen"]`. For each key, assert that the value in `whiteColors` (read from the generated `poimandres-white.json` vars) equals the value in the generated `poimandres.json` vars. The intent: these accent colours must not silently diverge between light and dark variants. | | |
| TASK-014 | Run `pnpm test` and confirm all tests pass (existing 15 + new ~6 = ~21 total). | | |

---

## 3. Alternatives

- **ALT-001**: Keep hard-coding but add a snapshot test. Rejected — it freezes wrong values
  (`bluishGray`, `selection`) and provides no traceability to the upstream source.
- **ALT-002**: Export a `white` palette from `drcmda/poimandres-theme/src/theme.js` by
  patching the upstream subtree. Rejected — `AGENTS.md` treats the subtree as read-only
  upstream source of truth.
- **ALT-003**: Derive the white palette mathematically (HSL inversion of the dark palette).
  Rejected — the upstream white JSON is the authoritative source; reversing it via colour
  math introduces drift as the upstream evolves.
- **ALT-004**: Strip alpha suffixes to handle tokens like `"#969cbd50"`. Rejected — every
  palette key has at least one exact-match token in the upstream JSON, making suffix
  stripping unnecessary and fragile.

---

## 4. Dependencies

- **DEP-001**: `drcmda/poimandres-theme/themes/poimandres-color-theme-white.json` — the
  upstream white JSON file; must remain present and valid JSON.
- **DEP-002**: `drcmda/poimandres-theme/src/theme.js` — consulted as the reference for
  which VS Code token keys carry which palette values (read-only, not imported by the
  extractor).
- **DEP-003**: `vitest` (already a dev dependency) — test runner.
- **DEP-004**: `ajv` (already a dev dependency) — already used in existing schema tests.

---

## 5. Files

- **FILE-001**: `src/extract-white-palette.js` *(new)* — ESM module; exports
  `extractWhitePalette(path)` and `CANONICAL_MAPPING`.
- **FILE-002**: `src/generate-pi-theme.js` *(modified)* — remove 24-line hard-coded
  `whiteColors` literal; add import and single-line call to `extractWhitePalette`.
- **FILE-003**: `test/pi-theme-schema.test.js` *(modified)* — add ~30 lines across two
  new `describe` blocks.
- **FILE-004**: `themes/pi/poimandres-white.json` *(regenerated)* — `bluishGray` var
  changes from `#969cbd` → `#506477`; `selection` var changes from `#969cbd` →
  `#717cb425`.

### Canonical Mapping Table (palette key → VS Code `colors` token)

| Palette Key | VS Code `colors` Token | Upstream White Value |
|-------------|------------------------|----------------------|
| `bg` | `terminal.ansiBlack` | `#FEFEFF` |
| `focus` | `activityBarBadge.background` | `#c0d0df` |
| `gray` | `terminal.ansiBrightBlack` | `#969cbd` |
| `darkerGray` | `sideBar.foreground` | `#969cbd` |
| `bluishGray` | `inputValidation.infoBackground` | `#506477` |
| `bluishGrayBrighter` | `debugIcon.breakpointDisabledForeground` | `#7390AA` |
| `offWhite` | `activityBarBadge.foreground` | `#3b3e48` |
| `selection` | `editor.selectionBackground` | `#717cb425` |
| `black` | `button.foreground` | `#000000` |
| `white` | `terminal.ansiBrightWhite` | `#000000` |
| `lightBlue` | `terminal.ansiBrightBlue` | `#0EBFFF` |
| `lowerBlue` | `terminal.ansiBlue` | `#8ABACD` |
| `desaturatedBlue` | `terminal.ansiCyan` | `#8ABACD` |
| `brightMint` | `terminal.ansiBrightGreen` | `#01DAB2` |
| `lowerMint` | `notebookStatusSuccessIcon.foreground` | `#62AA9B` |
| `hotRed` | `terminal.ansiBrightRed` | `#ff2090` |
| `pink` | `terminal.ansiBrightMagenta` | `#EB8394` |
| `brightYellow` | `terminal.ansiBrightYellow` | `#FFD467` |
| `transparent` | `focusBorder` | `#00000000` |
| `blueishGreen` | `tokenColors[scope="source.sass keyword.control"].settings.foreground` | `#42675A` |

---

## 6. Testing

- **TEST-001**: `each palette key maps to the correct upstream white JSON token value` —
  iterates `CANONICAL_MAPPING`, looks up the token in the upstream white JSON, asserts
  exact equality with the extracted palette value.
- **TEST-002**: `blueishGreen maps to source.sass keyword.control token foreground` —
  asserts the `blueishGreen` extraction matches the first tokenColor entry with that scope.
- **TEST-003**: `bluishGray resolves to #506477` — regression guard for the previously
  incorrect hard-coded `#969cbd`.
- **TEST-004**: `selection resolves to #717cb425` — regression guard for the previously
  incorrect hard-coded `#969cbd`.
- **TEST-005**: `shared accent keys are equal between poimandres.json and poimandres-white.json`
  — cross-variant consistency check for `hotRed`, `lightBlue`, `brightMint`, `pink`,
  `brightYellow`, `lowerBlue`, `desaturatedBlue`, `transparent`, `blueishGreen`.
- **TEST-006**: Existing schema and color-resolution tests (15 tests) continue to pass
  after regeneration.

---

## 7. Risks & Assumptions

- **RISK-001**: If the upstream white JSON is regenerated by `drcmda` with different token
  values, the extracted palette will change silently. Mitigation: the snapshot-style tests
  (TEST-003, TEST-004) will fail and force an explicit review.
- **RISK-002**: The `selection` change (`#969cbd` → `#717cb425`) affects the
  `selectedBg` and `userMessageBg`-adjacent visual appearance of the Pi white theme.
  This is the correct upstream value but may require a visual review of the rendered theme.
- **RISK-003**: Token `notebookStatusSuccessIcon.foreground` is a VS Code Notebook-specific
  key. If the upstream white JSON ever removes it, `extractWhitePalette` will throw (per
  TASK-004). Mitigation: the error message will point directly at the missing token.
- **ASSUMPTION-001**: All 20 `colors` tokens in the canonical mapping are present in every
  future release of the upstream white JSON — verified true for the current file.
- **ASSUMPTION-002**: The `source.sass keyword.control` scope will remain the canonical
  `blueishGreen` anchor in the upstream tokenColors — supported by its stable presence
  across all five upstream theme JSON files.

---

## 8. Related Specifications / Further Reading

- [`drcmda/poimandres-theme/src/theme.js`](../drcmda/poimandres-theme/src/theme.js) — upstream template; authoritative source of token→palette mappings
- [`drcmda/poimandres-theme/themes/poimandres-color-theme-white.json`](../drcmda/poimandres-theme/themes/poimandres-color-theme-white.json) — upstream white theme JSON
- [`src/generate-pi-theme.js`](../src/generate-pi-theme.js) — current generator with hard-coded `whiteColors`
- [`test/pi-theme-schema.test.js`](../test/pi-theme-schema.test.js) — existing test suite
- [`AGENTS.md`](../AGENTS.md) — project working rules and conventions

---
goal: Infer white theme palette from upstream JSON instead of hardcoding values
status: archived
last_updated: 2026-06-17
---

# Archive

Completed and superseded by the current generator/test state. See:

- `src/extract-white-palette.ts`
- `src/generated-source-theme-assignments.ts`
- `src/generate-source-token-assignments.ts`
- `src/types.ts`
- `src/hex-utils.ts`
- `test/pi-theme-schema.test.ts`
- `themes/pi/poimandres-white.json`

Key outcome:

- the white palette is extracted from upstream JSON at build time
- upstream source-theme assignments are generated into a local mapping file
- tokenColor `foreground` references like `${colors.blueishGreen}` are resolved
- generated theme vars are validated as 6-digit hex values

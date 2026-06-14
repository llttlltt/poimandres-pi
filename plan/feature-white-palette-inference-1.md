---
goal: Infer white theme palette from upstream JSON instead of hardcoding values
status: completed
last_updated: 2026-06-17
---

# Archive

Completed and superseded by the current generator/test state. See:
- `src/extract-white-palette.ts`
- `src/generate-pi-theme.ts`
- `src/hex-utils.ts`
- `test/pi-theme-schema.test.ts`
- `themes/pi/poimandres-white.json`

Key outcome:
- the white palette is extracted from upstream JSON at build time
- `selection` is normalised before output
- generated theme vars are validated as 6-digit hex values

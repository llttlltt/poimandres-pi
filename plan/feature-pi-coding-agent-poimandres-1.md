---
goal: Create a Pi Coding Agent theme that matches the Poimandres VSCode theme
status: completed
last_updated: 2026-06-17
---

# Archive

Completed project scaffold. The repo now:
- generates Pi theme JSON from the upstream Poimandres submodule
- produces `themes/pi/poimandres.json`, `themes/pi/poimandres-storm.json`, and `themes/pi/poimandres-white.json`
- validates schema and mapping behavior in `test/pi-theme-schema.test.ts`
- uses `pnpm build` for regeneration and `scripts/precommit.sh` for pre-commit checks

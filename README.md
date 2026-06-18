
<div align="center">
  <img width="200px" src="https://raw.githubusercontent.com/drcmda/poimandres-theme/main/assets/dots.png" alt="Dots" />

# poimandres-pi

[![npm](https://img.shields.io/npm/v/@llttlltt/poimandres-pi?style=for-the-badge&color=5DE4c7)](https://www.npmjs.com/package/@llttlltt/poimandres-pi)

[Pi Coding Agent](https://github.com/earendil-works/pi/tree/main) theme based on the [Poimandres VSCode theme](https://github.com/drcmda/poimandres-theme).
</div>

| **poimandres** | **poimandres storm** | **poimandres white** |
| :---: | :---: | :---: |
| ![Poimandres Theme](https://raw.githubusercontent.com/llttlltt/poimandres-pi/master/assets/poimandres.png) | ![Storm Theme](https://raw.githubusercontent.com/llttlltt/poimandres-pi/master/assets/poimandres-storm.png) | ![White Theme](https://raw.githubusercontent.com/llttlltt/poimandres-pi/master/assets/poimandres-white.png) |

## Installation

```bash
# From npm
pi install npm:@llttlltt/poimandres-pi

# From git
pi install git:github.com/llttlltt/poimandres-pi
```

Then select a theme via `/settings` or in your `settings.json`:

```json
{
  "theme": "poimandres"
}
```

Available theme names: `poimandres`, `poimandres storm`, `poimandres white`.

To try without a permanent install:

```bash
pi -e npm:@llttlltt/poimandres-pi
# or
pi -e git:github.com/llttlltt/poimandres-pi
```

## Development

The theme files in `themes/pi/` are generated from the upstream [poimandres-theme](https://github.com/drcmda/poimandres-theme) VS Code source, which is included as a git submodule at `poimandres-theme/`.

### Setup

> **Note:** `--recurse-submodules` is required. Without it the upstream theme source will be missing and the build will fail.

```bash
git clone --recurse-submodules https://github.com/llttlltt/poimandres-pi.git
cd poimandres-pi
pnpm install
pnpm build

# Verify the generated themes are correct
pnpm test:generated
```

### Commands

| Command | Purpose |
| :--- | :--- |
| `pnpm build` | Regenerate themes (lint, type-check, unit tests, and clean as a prebuild step) |
| `pnpm verify` | Lint, type-check, and unit tests — without building |
| `pnpm lint` | Fix all formatting and lint issues |
| `pnpm format` | Format source files only |
| `pnpm check` | TypeScript type-check only |
| `pnpm test` | Run schema unit tests |
| `pnpm test:generated` | Verify generated themes after a build |
| `pnpm clean:themes` | Delete and recreate the `themes/` output directory |

## 🙌 Related

- [poimandres-theme](https://github.com/drcmda/poimandres-theme): VSCode version
- [poimandres-terminal](https://github.com/alii/poimandres-terminal): macOS / iTerm / Windows Terminal version
- [poimandres.nvim](https://github.com/olivercederborg/poimandres.nvim): Neovim version
- [poimandres.zed](https://github.com/mshaugh/poimandres.zed): Zed version
- [poimandres-alacritty](https://github.com/z0al/poimandres-alacritty): Alacritty version
- [poimandres-iterm](https://github.com/alii/poimandres-iterm): iTerm version

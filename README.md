<div align="center">
  <img width="200px" src="./poimandres-theme/assets/dots.png" alt="Dots" />
  <h1>poimandres-pi 🎨</h1>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/poimandres-pi">
    <img alt="npm" src="https://img.shields.io/npm/v/poimandres-pi?style=for-the-badge&color=5DE4c7" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/earendil-works/pi/tree/main">Pi Coding Agent</a> theme based on the <a href="https://github.com/drcmda/poimandres-theme">Poimandres VSCode theme</a>.
</p>

<table>
  <tr>
    <td align="center"><strong>poimandres</strong></td>
    <td align="center"><strong>poimandres storm</strong></td>
    <td align="center"><strong>poimandres white</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="./assets/poimandres.png" alt="Poimandres Theme" width="260" /></td>
    <td align="center"><img src="./assets/poimandres-storm.png" alt="Storm Theme" width="260" /></td>
    <td align="center"><img src="./assets/poimandres-white.png" alt="White Theme" width="260" /></td>
  </tr>
</table>

## Installation

```bash
pi install npm:poimandres-pi
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
pi -e npm:poimandres-pi
```

## Development

The theme files in `themes/pi/` are generated from the upstream [poimandres-theme](https://github.com/drcmda/poimandres-theme) VS Code source, which is included as a git submodule at `poimandres-theme/`.

### Setup

```bash
git clone --recurse-submodules https://github.com/<your-org>/poimandres-pi.git
cd poimandres-pi
pnpm install
```

### Commands

| Command | Purpose |
|---|---|
| `pnpm build` | Regenerate themes (runs type-check, unit tests, and clean as a prebuild step) |
| `pnpm check` | Type-check |
| `pnpm test` | Unit & extraction tests |
| `pnpm test:generated` | Generated-artifact tests |

## 🙌 Related

- [poimandres-theme](https://github.com/drcmda/poimandres-theme): VSCode version
- [poimandres-terminal](https://github.com/mrousavy/poimandres-terminal): macOS / iTerm / Windows Terminal version
- [poimandres.nvim](https://github.com/olivercederborg/poimandres.nvim): Neovim version
- [poimandres.zed](https://github.com/mshaugh/poimandres.zed): Zed version
- [poimandres-alacritty](https://github.com/z0al/poimandres-alacritty): Alacritty version
- [poimandres-iterm](https://github.com/alii/poimandres-iterm): iTerm version

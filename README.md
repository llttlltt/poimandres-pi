<div align="center">
  <img width="200px" src="./drcmda/poimandres-theme/assets/dots.png" alt="Dots" />
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

## Screenshots

### Poimandres

![Poimandres Theme](./screenshots/poimandres.png)

### Storm

![Storm Theme](./screenshots/storm.png)

### White

![White Theme](./screenshots/white.png)

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

The theme files in `themes/pi/` are generated from the upstream [poimandres-theme](https://github.com/drcmda/poimandres-theme) VS Code source, which is included as a submodule.

### Setup

```bash
git clone --recurse-submodules https://github.com/<your-org>/poimandres-pi.git
cd poimandres-pi
pnpm install
```

### Commands

| Purpose | Command |
|---|---|
| Regenerate themes | `pnpm build` |
| Type-check | `pnpm check` |
| Unit & extraction tests | `pnpm test` |
| Generated-artifact tests | `pnpm test:generated` |

## 🙌 Related

- [poimandres-theme](https://github.com/drcmda/poimandres-theme): VSCode version
- [poimandres-terminal](https://github.com/mrousavy/poimandres-terminal): macOS / iTerm / Windows Terminal version
- [poimandres.nvim](https://github.com/olivercederborg/poimandres.nvim): Neovim version
- [poimandres.zed](https://github.com/mshaugh/poimandres.zed): Zed version
- [poimandres-alacritty](https://github.com/z0al/poimandres-alacritty): Alacritty version
- [poimandres-iterm](https://github.com/alii/poimandres-iterm): iTerm version

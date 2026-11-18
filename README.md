# Support Omid's Projects — Donate Page

A lightweight, dependency-free donate page for my independent software projects
(**Sortiva** for file organization and **Sazora** for construction project management).

> Support today's apps. Help build tomorrow's ideas.

## Live site

https://omidmasumi740-dev.github.io/donate-page/

## Features

- **English by default**, Persian (RTL) as a secondary language — one-click toggle
- **Light / dark theme** with system-preference detection and saved choice
- **4 donation methods**: Toncoin (TON), Tether (TRC20), Polygon (POL), Telegram Stars
- **Per-method popup**: wallet address, one-click copy and an offline-generated QR code
- **Docs popup** about the apps
- Responsive layout, keyboard-accessible modals (`Esc` to close), reduced-motion support
- **No framework, no build step, no tracking** — pure HTML + CSS + vanilla JS

## Project structure

```
.
├── index.html          # All markup: header, hero, methods, support, footer, modals
└── assets/
    ├── style.css       # Design tokens, themes (light/dark), layout, RTL, responsive
    ├── i18n.js         # Translation dictionary (en / fa)
    ├── config.js       # Donation wallets, network names, Telegram link
    ├── app.js          # Theme, language, modals, QR, copy-to-clipboard, reveal animation
    ├── qrcode.js       # Vendored QR generator (offline, no CDN)
    └── logo.png        # Favicon / brand image
```

## Run locally

Any static server works. For example:

```bash
# Python
python -m http.server 8765

# then open http://localhost:8765/index.html
```

Opening `index.html` directly from the file system also works in most browsers.

## Edit donation addresses

Everything is in `assets/config.js`:

```js
window.DONATE_CONFIG = {
  ton:  { name: "Toncoin (TON)",  network: "TON — The Open Network", icon: "💎", color: "#087ff5",
          address: "UQ...", link: "" },
  usdt: { ... },
  pol:  { ... },
  stars:{ name: "Telegram Stars", network: "Donate via Telegram", icon: "★", color: "#f5a623",
          address: "", link: "https://t.me/omidlabs" }
};
```

- `address` → shown in the popup and encoded into the QR code
- `link` → adds an extra button in the popup (used for Telegram Stars)
- Leave both empty and the popup shows a "coming soon" note

## Texts and translations

All copy lives in `assets/i18n.js` (`en` and `fa`). Elements in `index.html` are wired
with `data-i18n="key"` (plain text) or `data-i18n-html="key"` (allows inline markup).

## Deploy on GitHub Pages

1. Push `index.html` and `assets/` to the `main` branch
2. Repository → **Settings → Pages**
3. **Source**: `Deploy from a branch` · **Branch**: `main` · **Folder**: `/ (root)` · **Save**
4. The site goes live at `https://<user>.github.io/<repo>/` within a minute or two

Hard-refresh (`Ctrl + F5`) after a deploy — GitHub Pages caches HTML for ~10 minutes.

## License

Released under the Apache-2.0 license. © 2024–present Omid Masomi

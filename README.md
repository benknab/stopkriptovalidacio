# Stop Kriptovalidáció

A Hungarian civic initiative website documenting the cryptocurrency "validation" law (Act LXVII of 2025) and its
consequences.

## About

This website tracks Hungary's crypto asset regulations:

- Timeline of regulatory changes and their impacts
- Crypto exchange service availability in Hungary
- Parliamentary member database with voting records
- Email template generator for contacting representatives

## Why

- **500,000+ Hungarians** affected by unclear regulations
- Major exchanges restricting or exiting (Revolut, eToro, Strike, Bitstamp, Kriptomat, Bitvavo, MoonPay, CoinCash)
- Single approved validator (Caduceus) is a newly founded company with no crypto experience
- Stricter than EU MiCA with criminal penalties for unclear violations

## Features

- **Timeline**: 40+ regulatory events (May 2025 - January 2026)
- **Exchange tracking**: 22 exchanges (operating/restricted/uncertain)
- **MP database**: 199 parliamentary members with voting records
- **Email generator**: Pre-written templates for contacting representatives
- **Bilingual**: Hungarian and English

## Development

Requires [Node.js](https://nodejs.org/) **24.21.0 LTS** and **pnpm 12.10.1** (pinned in `package.json`).
The runtime is pinned in `.node-version` and `.nvmrc`.
If you use nvm, run `nvm install` from this directory to install and select the pinned runtime.

```bash
pnpm install --frozen-lockfile  # Install dependencies
pnpm dev                       # Development server
pnpm build                     # Production build
pnpm start                     # Start production Node.js server
pnpm check                     # Format, lint, type check
pnpm test                      # Production build + unit/component/HTTP regression tests
pnpm test:browser              # Browser regression tests (requires agent-browser)
pnpm setup                     # Install the optional pre-commit hook
```

## Tech Stack

Node.js LTS, TanStack Start/Router, React, Tailwind CSS v4, Vite+ (build, lint, format, test), pnpm.

### Production

`pnpm build` produces a standalone Nitro Node.js server in `.output/server/index.mjs` and static assets in
`.output/public`. Deploy the **entire `.output` directory** together, then run `node .output/server/index.mjs`.
The default port is 3000; set `PORT` and `HOST` for your hosting environment. No build tools or package manager are
required to run the built server.

### Maintenance scripts

All maintenance scripts run directly with Node's native TypeScript support:

```bash
pnpm inspect-current-winners --help
pnpm backfill-mps-kpn-ids --help
pnpm download-mp-images
pnpm post-telegram --dry-run
```

`post-telegram` reads an optional `.env` file and requires `TELEGRAM_BOT_TOKEN` only when actually posting.
Image optimization uses the project-local Sharp dependency, with ImageMagick as a fallback.

### Regression coverage

Tests cover both languages, page/SEO parity with the pre-migration production site, timeline visibility,
representative filtering and selection, email editing/copying, cookie redirects, 404 responses, sitemap and static assets.
The browser suite exercises the production build on desktop/mobile and checks for hydration/runtime errors.
Migration baseline fingerprints are intentionally fixed; review them when changing published content or styling.

## License

MIT

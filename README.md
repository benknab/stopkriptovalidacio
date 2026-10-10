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
pnpm dev                       # Cloudflare-backed Vite development server (workerd)
pnpm build                     # Prerender a static Cloudflare Pages export
pnpm preview                   # Preview the static export with Wrangler Pages
pnpm start                     # Alias for pnpm preview
pnpm deploy                    # Build and deploy the static export to Cloudflare Pages
pnpm check                     # Format, lint, type check
pnpm test                      # Production build + unit/component/HTTP regression tests
pnpm test:browser              # Browser regression tests (requires agent-browser)
pnpm setup                     # Install the optional pre-commit hook
```

## Tech Stack

TanStack Start/Router, React, Tailwind CSS v4, Vite+ (build, lint, format, test), pnpm, Cloudflare Pages.
Node.js runs build/maintenance tools; production is static and needs no Node server, Worker or Pages Functions.

### Production

`pnpm build` prerenders 16 content pages (both languages), writes a static sitemap and 404 page, and verifies that the
export has real HTML and no backend dependencies. **Deploy only `dist/client`**. The `dist/server` bundle is used for
build-time rendering and must not be deployed.

Cloudflare Pages Git integration:

- Framework preset: **None**
- Install dependencies: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Build output directory: `dist/client`
- Production branch: `master`
- Node.js: `24.21.0`; pnpm: `12.10.1`
- Custom domain: `stopkriptovalidacio.hu` (matches `constants/seo.ts`)

For manual deployment, log in once with `pnpm exec wrangler login`, then run `pnpm deploy`.
Set the Pages project name in `wrangler.jsonc` to match your Cloudflare project. Do not use `wrangler deploy`: this is a
**Pages static deployment**, not a Workers deployment.

`wrangler-dev.jsonc` configures the Cloudflare Vite plugin for local development and build-time rendering.
`wrangler.jsonc` configures static Pages preview/deployment. The build removes the Vite plugin's generated Workers
deployment pointer so Wrangler Pages reads the static configuration.

### Languages and static behavior

Hungarian URLs are unchanged (`/`, `/rolunk`, `/szavazas`, ...). English versions use `/en/`, `/en/rolunk`,
`/en/szavazas`, etc. Language links preserve the page, query filters and fragment; cookie/Accept-Language-based rendering
and `/set-lang` are no longer used. Canonical URLs, hreflang alternates and the sitemap include language-specific URLs.

The default page content is present in the exported HTML without JavaScript. Query filters apply immediately after
hydration and continue to support reloads and browser history. Content changes require a rebuild/redeployment.

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
representative filtering and selection, email editing/copying, language-specific URLs, 404 responses, sitemap and static assets.
The HTTP and browser suites exercise the actual static export using Wrangler Pages (not an SSR server).
The browser suite covers desktop/mobile, direct filtered URLs, language switching, and hydration/runtime errors.
Migration baseline fingerprints are intentionally fixed; review them when changing published content or styling.

## License

MIT

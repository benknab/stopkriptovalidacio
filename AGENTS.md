# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hungarian website documenting the timeline of cryptocurrency "validation" law changes and their repercussions. The site
will include:

- Timeline of crypto regulation changes
- Exchange information
- MP (Member of Parliament) search functionality
- MP email template generation and sending

## Tech Stack

- **Tooling runtime**: Node.js 24.21.0 LTS (native TypeScript for scripts)
- **Framework**: TanStack Start with TanStack Router, build-time prerendering and static Cloudflare Pages deployment
- **Local application runtime**: Cloudflare workerd via `@cloudflare/vite-plugin`; no production backend
- **UI**: React with native hooks; URL-backed filter state uses TanStack Router
- **Styling**: Tailwind CSS v4
- **Toolchain**: Vite+ (build, Vitest, Oxlint, Oxfmt)
- **Package manager**: pnpm 12.10.1; commit `pnpm-lock.yaml`
- **Internationalization**: Custom i18n with `t(key, lang)` function

## Git

- The main branch is `master` (not `main`)

## Development Commands

```bash
pnpm install --frozen-lockfile  # Install dependencies
pnpm dev                       # Cloudflare-backed Vite dev server
pnpm build                     # Prerender static Pages export in dist/client
pnpm preview                   # Preview the static export with Wrangler Pages
pnpm start                     # Alias for pnpm preview
pnpm deploy                    # Build and deploy to Cloudflare Pages (only when explicitly authorized)
pnpm check                     # Format, lint, and type check
pnpm fmt                       # Format code
pnpm lint                      # Lint code
pnpm test                      # Build and run unit/component/HTTP tests
pnpm test:browser              # Production browser tests (agent-browser)
```

## Code Style

- All file names must be **kebab-case** (e.g., `my-component.tsx`, not `MyComponent.tsx`)
- URLs and query params must be in **Hungarian** (e.g., `/rolunk`, `?osszes=true`)
- Code identifiers use **English** (e.g., `status: "leaving"`, not `status: "tavozik"`)
- User-facing text uses **Hungarian** via i18n (e.g., `t("hero.leaving", lang)` → "Távozik")
- Use `Set<T>` for collections of slugs, not arrays
- Define constants that are not dynamic during render outside of components (module-level)
- **No barrel files** (index.ts that re-export) - import directly from source files
- **Function style**: Use `function` declarations for named functions, arrow functions for anonymous callbacks
  - Good: `function handleClick() {}`, `array.map((x) => x * 2)`
  - Bad: `const handleClick = () => {}`, `array.map(function (x) { return x * 2; })`

## Architecture

- `router.tsx` - TanStack Router factory and public query serialization
- `routes/__root.tsx` - HTML document, URL-based language context, metadata, hydration scripts
- `vite.config.ts` - Vite+ configuration with Start, Cloudflare, React and Tailwind plugins
- `routes/{-$lang}/` - Shared TanStack page routes with an optional /en language prefix
- `wrangler-dev.jsonc` - Cloudflare Vite development/build-time rendering configuration
- `wrangler.jsonc` - Static Cloudflare Pages deployment configuration
- `scripts/finalize-static.ts` - Static sitemap/404 generation and export validation
- `route-tree.gen.ts` - Generated route tree (tracked for type checking on clean checkouts; do not edit manually)
- `components/` - Shared and interactive React components, including page sections and navigation
- `utils/localized-path.ts` - URL-based language detection and localized page links
- `hooks/use-page-path.ts` - Hydration-safe page/query path for static HTML
- `utils/page-head.ts` - Route metadata, canonical/hreflang links and structured data
- `data/` - Data files (events, mps, exchanges, sources)
- `i18n/` - Translation system with `t(key, lang)` function
- `constants/` - Shared constants
- `static/` - Static assets

## TanStack Start Patterns

Routes export `Route` with `createFileRoute()`; root context supplies the request's language:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$lang}/rolunk")({ component: PageName });

function PageName() {
	const { lang } = Route.useRouteContext();
	return <div>{t("about.title", lang)}</div>;
}
```

Production has no HTTP handlers/server functions. All public pages must be listed in `utils/static-pages.ts` for
prerendering; dynamic source pages are derived from the data. Only `dist/client` is deployed to Pages.

## Internationalization

- Languages: `"hu" | "en"` (strictly typed as `SupportedLanguage`)
- Detection: URL prefix (`/en` means English; unprefixed URLs mean Hungarian)
- Switching: Native links between localized paths, preserving queries and fragments; no server endpoint or cookie required
- Localize page links with `localizePath()`, but keep assets and external URLs unchanged
- Static HTML uses default filter values; URL-backed filters apply after hydration to avoid mismatches
- Usage: `t("key.path", lang)` - pass language as second argument
- Add new strings to both `i18n/locales/hu.json` and `en.json`

## Design Guidelines

When building frontend components, follow the frontend-design skill principles:

- Choose distinctive, bold aesthetic directions (avoid generic AI aesthetics)
- Use unique typography choices (avoid Inter, Roboto, Arial)
- Create cohesive color themes with dominant colors and sharp accents
- Implement meaningful animations and micro-interactions
- Consider unconventional layouts with intentional asymmetry and spatial composition

## Content Tone

When writing summaries, event descriptions, or any user-facing content:

- Use **serious, professional tone** - this is a documentation site about legal/regulatory changes
- Avoid sensationalist or informal language
- Be factual and precise with dates, entities, and actions
- Use neutral, objective phrasing (e.g., "A szolgáltatás megszűnt" not "Bezárták a boltot")
- Reference official terms and legal language where appropriate
- Keep summaries concise: max 3 sentences, focus on what/when/why

## Verification

- Run `pnpm check` and the relevant regression tests after code changes
- Never run `pnpm dev` unprompted - let the developer verify manually
- Only run `pnpm dev` if the developer explicitly asks; production servers may be used for verification
- Never offer to commit changes unless explicitly asked - let the developer decide when to commit
- When adding new content that requires i18n (exchanges, events, etc.), verify corresponding entries exist in both
  `i18n/locales/hu.json` and `i18n/locales/en.json`

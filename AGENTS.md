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

- **Runtime**: Node.js 24.21.0 LTS (native TypeScript for scripts)
- **Framework**: TanStack Start with TanStack Router and Nitro's Node.js production server
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
pnpm dev                       # Start dev server
pnpm build                     # Build for production
pnpm start                     # Start production Node.js server
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
- `routes/__root.tsx` - HTML document, request language context, metadata, hydration scripts
- `vite.config.ts` - Vite+ configuration with Start, React, Tailwind and Nitro plugins
- `routes/` - TanStack file routes and HTTP handlers
- `route-tree.gen.ts` - Generated route tree (tracked for type checking on clean checkouts; do not edit manually)
- `islands/` - Interactive React components (historical directory name; no islands runtime)
- `components/` - Shared React components
- `utils/language.ts` - Server function for request-specific language detection
- `utils/page-head.ts` - Route metadata, canonical/hreflang links and structured data
- `data/` - Data files (events, mps, exchanges, sources)
- `i18n/` - Translation system with `t(key, lang)` function
- `constants/` - Shared constants
- `static/` - Static assets

## TanStack Start Patterns

Routes export `Route` with `createFileRoute()`; root context supplies the request's language:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rolunk")({ component: PageName });

function PageName() {
	const { lang } = Route.useRouteContext();
	return <div>{t("about.title", lang)}</div>;
}
```

HTTP handlers use the route's `server.handlers`:

```tsx
export const Route = createFileRoute("/set-lang")({
	server: { handlers: { GET: ({ request }) => new Response(request.url) } },
});
```

## Internationalization

- Languages: `"hu" | "en"` (strictly typed as `SupportedLanguage`)
- Detection: Cookie (`lang`) first, then Accept-Language header
- Switching: `/set-lang?lang=hu&redirect=/` sets cookie and redirects
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

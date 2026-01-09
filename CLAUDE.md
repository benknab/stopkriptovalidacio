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

- **Runtime**: Deno
- **Framework**: Fresh 2.0 with islands architecture
- **UI**: Preact (with Preact Signals for state)
- **Styling**: Tailwind CSS v4
- **Build**: Vite
- **Internationalization**: Custom i18n with `t(key, lang)` function

## Development Commands

```bash
deno task dev         # Start dev server (Vite)
deno task build       # Build for production
deno task start       # Start production server
deno task check       # Format, lint, and type check
deno fmt              # Format code
deno lint             # Lint code
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

- `main.ts` - Fresh server entry point
- `utils.ts` - Fresh `define` helper created with `createDefine<State>()`
- `vite.config.ts` - Vite configuration with Fresh and Tailwind plugins
- `routes/` - File-based routing (Fresh 2.0)
- `islands/` - Interactive components that ship JavaScript to client
- `components/` - Static components (no client JS)
- `data/` - Data files (events, mps, exchanges, sources)
- `i18n/` - Translation system with `t(key, lang)` function
- `constants/` - Shared constants
- `static/` - Static assets

## Fresh 2.0 Patterns

Routes use `define.page()` pattern:

```tsx
import { define } from "@/utils.ts";

export default define.page(function PageName(ctx): JSX.Element {
	const lang = detectLanguage(ctx.req);
	return <Layout lang={lang}>...</Layout>;
});
```

Handlers use `define.handlers()`:

```tsx
export const handler = define.handlers({
	GET(): Response {
		return new Response("...");
	},
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

- Run `deno lint` after making code changes to verify no lint errors were introduced
- Never run `deno task dev` unprompted - let the developer verify manually
- Only run `deno task dev` if the developer explicitly asks
- Never offer to commit changes unless explicitly asked - let the developer decide when to commit

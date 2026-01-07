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
- **Server**: Hono
- **UI**: React 19 (SSR)
- **Styling**: Tailwind CSS
- **Internationalization**: i18n support (Hungarian primary)

## Development Commands

```bash
deno task build:css   # Build Tailwind CSS (run before dev/start)
deno task dev         # Start dev server with watch mode
deno task start       # Start production server
deno task check       # Type check
deno fmt              # Format code
deno lint             # Lint code
```

## Code Style

- All file names must be **kebab-case** (e.g., `my-component.tsx`, not `MyComponent.tsx`)

## Architecture

- `src/server.tsx` - Hono server entry point with SSR rendering
- `src/components/document.tsx` - HTML document wrapper
- `src/components/app.tsx` - Main React application
- `src/styles/input.css` - Tailwind input file
- `public/styles.css` - Built CSS output (generated)

## Design Guidelines

When building frontend components, follow the frontend-design skill principles:

- Choose distinctive, bold aesthetic directions (avoid generic AI aesthetics)
- Use unique typography choices (avoid Inter, Roboto, Arial)
- Create cohesive color themes with dominant colors and sharp accents
- Implement meaningful animations and micro-interactions
- Consider unconventional layouts with intentional asymmetry and spatial composition

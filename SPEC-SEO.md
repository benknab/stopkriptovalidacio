# SEO Specification

This document outlines all SEO features to be implemented for the Kriptovalidáció website.

## Table of Contents

1. [Meta Tags](#1-meta-tags)
2. [Open Graph & Social Media](#2-open-graph--social-media)
3. [Structured Data (JSON-LD)](#3-structured-data-json-ld)
4. [Multi-language SEO](#4-multi-language-seo)
5. [Sitemap & Robots](#5-sitemap--robots)
6. [Performance Optimization](#6-performance-optimization)
7. [Implementation Details](#7-implementation-details)

---

## 1. Meta Tags

### 1.1 Required Meta Tags

Every page must include these meta tags in `<head>`:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{pageTitle} | Kriptovalidáció</title>
<meta name="description" content="{pageDescription}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://kriptovalidacio.hu{path}" />
```

### 1.2 Page-Specific Meta Content

All meta descriptions must be custom-written in the i18n translation files.

**Homepage (`/`):**

```json
{
	"seo": {
		"home": {
			"title": "Kriptovaluta szabályozás Magyarországon",
			"description": "A magyar kriptovaluta szabályozás időrendje: törvénymódosítások, tőzsdék státusza, és a 2024-es kripto törvény hatásai."
		}
	}
}
```

**About Page (`/rolunk`):**

```json
{
	"seo": {
		"about": {
			"title": "Rólunk",
			"description": "A Kriptovalidáció projekt célja a magyar kriptovaluta szabályozás változásainak dokumentálása és átláthatóvá tétele."
		}
	}
}
```

### 1.3 Title Format

- **Homepage**: `{site.title}` (no suffix)
- **Subpages**: `{page.title} | {site.title}`
- **Max length**: 60 characters
- **Language**: Match page language

### 1.4 Description Guidelines

- **Length**: 150-160 characters optimal
- **Content**: Factual, includes primary keywords
- **Tone**: Professional, informative
- **No**: Clickbait, excessive punctuation, keyword stuffing

---

## 2. Open Graph & Social Media

### 2.1 Open Graph Tags (Facebook, LinkedIn)

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Kriptovalidáció" />
<meta property="og:title" content="{pageTitle}" />
<meta property="og:description" content="{pageDescription}" />
<meta property="og:url" content="https://kriptovalidacio.hu{path}" />
<meta property="og:image" content="https://kriptovalidacio.hu/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="{imageAltText}" />
<meta property="og:locale" content="hu_HU" />
<meta property="og:locale:alternate" content="en_US" />
```

### 2.2 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{pageTitle}" />
<meta name="twitter:description" content="{pageDescription}" />
<meta name="twitter:image" content="https://kriptovalidacio.hu/og-image.png" />
<meta name="twitter:image:alt" content="{imageAltText}" />
```

### 2.3 OG Image Requirements

Create a static OG image with these specifications:

- **Dimensions**: 1200×630px
- **Format**: PNG
- **File size**: < 300KB
- **Content**: Site name, tagline, visual identity
- **Location**: `/public/og-image.png`

---

## 3. Structured Data (JSON-LD)

### 3.1 WebSite Schema (All Pages)

```json
{
	"@context": "https://schema.org",
	"@type": "WebSite",
	"name": "Kriptovalidáció",
	"url": "https://kriptovalidacio.hu",
	"inLanguage": ["hu", "en"],
	"description": "A magyar kriptovaluta szabályozás időrendje"
}
```

### 3.2 Article Schema (Homepage)

```json
{
	"@context": "https://schema.org",
	"@type": "Article",
	"headline": "Kriptovaluta szabályozás Magyarországon",
	"description": "{pageDescription}",
	"datePublished": "2024-01-01",
	"dateModified": "{lastEventDate}",
	"author": {
		"@type": "Organization",
		"name": "Kriptovalidáció"
	},
	"publisher": {
		"@type": "Organization",
		"name": "Kriptovalidáció",
		"url": "https://kriptovalidacio.hu"
	},
	"inLanguage": "{currentLanguage}",
	"mainEntityOfPage": {
		"@type": "WebPage",
		"@id": "https://kriptovalidacio.hu/"
	}
}
```

### 3.3 Event Schema (Timeline Events)

For each timeline event, generate structured data:

```json
{
	"@context": "https://schema.org",
	"@type": "Event",
	"name": "{event.title}",
	"description": "{event.summary}",
	"startDate": "{event.date}",
	"eventStatus": "https://schema.org/EventScheduled",
	"eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
	"location": {
		"@type": "VirtualLocation",
		"url": "https://kriptovalidacio.hu/"
	},
	"organizer": {
		"@type": "Organization",
		"name": "Magyar Országgyűlés"
	}
}
```

### 3.4 ItemList Schema (Timeline Collection)

Wrap timeline events in an ItemList for better crawling:

```json
{
	"@context": "https://schema.org",
	"@type": "ItemList",
	"name": "Kriptovaluta szabályozás időrendje",
	"numberOfItems": "{eventsCount}",
	"itemListElement": [
		{
			"@type": "ListItem",
			"position": 1,
			"item": {/* Event schema */}
		}
	]
}
```

---

## 4. Multi-language SEO

### 4.1 Hreflang Tags

Every page must include alternate language links:

```html
<link rel="alternate" hreflang="hu" href="https://kriptovalidacio.hu{path}" />
<link rel="alternate" hreflang="en" href="https://kriptovalidacio.hu{path}?lang=en" />
<link rel="alternate" hreflang="x-default" href="https://kriptovalidacio.hu{path}" />
```

### 4.2 Canonical URL Strategy

- **Primary language**: Hungarian (hu)
- **Canonical URL**: Always points to Hungarian version
- **English version**: Marked as alternate, not canonical
- **Query parameters**: Excluded from canonical (except language)

Example:

```html
<!-- On Hungarian page -->
<link rel="canonical" href="https://kriptovalidacio.hu/" />

<!-- On English page -->
<link rel="canonical" href="https://kriptovalidacio.hu/" />
<link rel="alternate" hreflang="en" href="https://kriptovalidacio.hu/?lang=en" />
```

### 4.3 HTML Lang Attribute

```html
<html lang="hu"> <!-- or lang="en" -->
```

---

## 5. Sitemap & Robots

### 5.1 Sitemap.xml

Dynamic sitemap generated at `/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://kriptovalidacio.hu/</loc>
    <lastmod>{lastEventDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="hu" href="https://kriptovalidacio.hu/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://kriptovalidacio.hu/?lang=en" />
  </url>
  <url>
    <loc>https://kriptovalidacio.hu/rolunk</loc>
    <lastmod>{buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <xhtml:link rel="alternate" hreflang="hu" href="https://kriptovalidacio.hu/rolunk" />
    <xhtml:link rel="alternate" hreflang="en" href="https://kriptovalidacio.hu/rolunk?lang=en" />
  </url>
</urlset>
```

### 5.2 Robots.txt

Static file at `/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://kriptovalidacio.hu/sitemap.xml

# Block query parameter variations (canonical handles these)
Disallow: /*?osszes=*
Disallow: /*?megye=*
Disallow: /*?kerulet=*
```

---

## 6. Performance Optimization

### 6.1 Resource Hints

Add to `<head>` for faster loading:

```html
<!-- Preload critical CSS -->
<link rel="preload" href="/styles.css" as="style" />
```

### 6.2 Image Optimization

- **Format**: Use WebP with PNG/JPG fallback
- **Lazy loading**: `loading="lazy"` for below-fold images
- **Dimensions**: Always include `width` and `height` attributes
- **Responsive**: Use `srcset` for multiple resolutions

```html
<img
	src="/images/example.webp"
	alt="Descriptive alt text"
	width="800"
	height="600"
	loading="lazy"
	decoding="async"
/>
```

### 6.4 Critical CSS

Inline critical above-fold CSS to avoid render blocking:

```html
<style>
	/* Critical CSS for hero section, navigation */
</style>
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/styles.css"></noscript>
```

### 6.5 Core Web Vitals Targets

| Metric                          | Target  | Notes                          |
| ------------------------------- | ------- | ------------------------------ |
| LCP (Largest Contentful Paint)  | < 2.5s  | Optimize hero section          |
| FID (First Input Delay)         | < 100ms | Minimize JS blocking           |
| CLS (Cumulative Layout Shift)   | < 0.1   | Reserve space for fonts/images |
| INP (Interaction to Next Paint) | < 200ms | Optimize event handlers        |

---

## 7. Implementation Details

### 7.1 Design Principles

- **Prefer common/shared components**: Create reusable SEO components that can be composed together
- **Dynamic meta content**: Generate meta content from existing data (events, page props) where possible
- **Centralized constants**: Define domain, site name, and other constants in one place
- **Single source of truth**: Avoid hardcoding values that exist elsewhere in the codebase

### 7.2 Constants File

Create `src/constants/seo.ts` to centralize all SEO-related constants:

```typescript
// Site-wide constants
export const SITE_DOMAIN = "kriptovalidacio.hu";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_NAME = "Kriptovalidáció";

// OG Image
export const OG_IMAGE_PATH = "/og-image.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Locales for OG tags
export const OG_LOCALES = {
	hu: "hu_HU",
	en: "en_US",
} as const;

// Date the site/content was first published (for Article schema)
export const SITE_PUBLISH_DATE = "2024-01-01";
```

### 7.3 File Structure

```
src/
├── constants/
│   └── seo.ts                  # SEO constants (domain, URLs, etc.)
├── components/
│   └── seo/
│       ├── seo-head.tsx        # Main SEO component (combines all)
│       ├── meta-tags.tsx       # Basic meta tags
│       ├── open-graph.tsx      # OG + Twitter tags
│       ├── json-ld.tsx         # Structured data schemas
│       ├── hreflang.tsx        # Language alternates
│       └── index.ts            # Re-exports
├── utils/
│   └── seo.ts                  # URL builders, date formatters
└── server.tsx                  # Sitemap/robots routes
public/
└── og-image.png                # Social share image (1200×630)
```

### 7.4 SEO Component Props Interface

```typescript
import type { SupportedLanguage } from "../i18n/index.ts";

// Page identifiers for looking up i18n keys
type PageId = "home" | "about";

type SeoProps = {
	page: PageId;
	lang: SupportedLanguage;
	path: string;
	// Dynamic data for Article schema
	lastModified?: Date;
	// Optional overrides (usually not needed)
	title?: string;
	description?: string;
	noindex?: boolean;
};
```

### 7.5 Dynamic Meta Content

Where possible, derive meta content dynamically:

```typescript
// Example: Get last modified date from events data
import { events } from "../data/events.ts";

function getLastEventDate(): Date {
	return events.reduce((latest, event) => event.date > latest ? event.date : latest, events[0].date);
}

// Use in Article schema dateModified
const lastModified = getLastEventDate();
```

### 7.6 URL Builder Utilities

Create helpers in `src/utils/seo.ts`:

```typescript
import { SITE_URL } from "../constants/seo.ts";
import type { SupportedLanguage } from "../i18n/index.ts";

// Build canonical URL (always Hungarian, no query params)
export function getCanonicalUrl(path: string): string {
	return `${SITE_URL}${path}`;
}

// Build language-specific URL
export function getLanguageUrl(path: string, lang: SupportedLanguage): string {
	if (lang === "hu") return `${SITE_URL}${path}`;
	return `${SITE_URL}${path}?lang=${lang}`;
}

// Format date for sitemap/schema (YYYY-MM-DD)
export function formatDateISO(date: Date): string {
	return date.toISOString().split("T")[0];
}
```

### 7.7 Translation Keys Structure

Add to `src/i18n/locales/hu.json` and `en.json`:

```json
{
	"seo": {
		"home": {
			"title": "Kriptovaluta szabályozás Magyarországon",
			"description": "A magyar kriptovaluta szabályozás időrendje: törvénymódosítások, tőzsdék státusza, és a 2024-es kripto törvény hatásai."
		},
		"about": {
			"title": "Rólunk",
			"description": "A Kriptovalidáció projekt célja a magyar kriptovaluta szabályozás változásainak dokumentálása."
		},
		"ogImage": {
			"alt": "Kriptovalidáció - Kriptovaluta szabályozás Magyarországon"
		}
	}
}
```

Note: `site.name` is defined in constants, not i18n (it doesn't change between languages).

### 7.8 Server Routes

```typescript
import { SITE_DOMAIN, SITE_URL } from "./constants/seo.ts";
import { formatDateISO } from "./utils/seo.ts";

// GET /sitemap.xml
app.get("/sitemap.xml", (c) => {
	const xml = generateSitemap(); // Uses SITE_URL from constants
	return c.body(xml, 200, { "Content-Type": "application/xml" });
});

// GET /robots.txt
app.get("/robots.txt", (c) => {
	const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;
	return c.body(robots, 200, { "Content-Type": "text/plain" });
});
```

---

## Checklist

### Phase 1: Foundation

- [ ] Create constants file (`src/constants/seo.ts`)
- [ ] Create SEO utility functions (`src/utils/seo.ts`)
- [ ] Create SEO component structure (`src/components/seo/`)
- [ ] Add SEO translation keys to `hu.json` and `en.json`
- [ ] Update `document.tsx` to use SEO components
- [ ] Add `lang` attribute to `<html>` tag

### Phase 2: Meta Tags

- [ ] Implement `<MetaTags>` component (title, description, robots)
- [ ] Implement `<Hreflang>` component
- [ ] Add canonical URL using utility functions
- [ ] Test meta tags with browser dev tools

### Phase 3: Social Media

- [ ] Create OG image (1200×630px)
- [ ] Implement `<OpenGraph>` component (OG + Twitter tags)
- [ ] Test with Facebook Debugger and Twitter Card Validator

### Phase 4: Structured Data

- [ ] Implement `<JsonLd>` component with WebSite schema
- [ ] Add Article schema (homepage)
- [ ] Add Event schema for timeline events
- [ ] Validate with Google Rich Results Test

### Phase 5: Technical SEO

- [ ] Create `/sitemap.xml` route (using constants)
- [ ] Create `/robots.txt` route (using constants)
- [ ] Submit sitemap to Google Search Console

### Phase 6: Performance

- [ ] Add CSS preload hint
- [ ] Add image lazy loading attributes
- [ ] Test Core Web Vitals with PageSpeed Insights

---

## Testing Tools

- **Meta Tags**: Browser DevTools → Elements → `<head>`
- **Open Graph**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter Cards**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **Structured Data**: [Google Rich Results Test](https://search.google.com/test/rich-results)
- **Performance**: [PageSpeed Insights](https://pagespeed.web.dev/)
- **Mobile**: [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---
name: scraper-summary
description: Use this skill when the user asks to scrape a URL and generate a summary, fetch article content, or create source summaries for the timeline. Triggers: "scrape", "summarize URL", "fetch article", "generate summary from link", "create source summary"
---

# Scraper Summary Skill

Generate bilingual (HU/EN) summaries from web URLs for use in timeline sources.

## Tone Requirements

**CRITICAL**: All summaries must follow professional tone guidelines:

- Use serious, professional language - this is a legal/regulatory documentation site
- Avoid sensationalist, informal, or colloquial language
- Be factual and precise with dates, entities, and actions
- Use neutral, objective phrasing
- Reference official terms and legal language where appropriate

## Usage

When given a URL:

1. **Try WebFetch first** - attempt to fetch the URL directly
2. **If blocked, use Playwright MCP** to:
   - Navigate to the URL
   - Save HTML to `tmp/` folder (gitignored)
   - Extract main article content
3. **Generate summary**:
   - Max 3 sentences
   - Focus on what/when/why
   - Professional tone
4. **Create bilingual version**:
   - Write Hungarian summary first
   - Translate to English maintaining professional tone

## Output Format

Return a `TextI18n` compatible object:

```typescript
{
  hu: "Hungarian summary (max 3 sentences, professional tone)",
  en: "English summary (max 3 sentences, professional tone)"
}
```

## Examples

### Good summaries:

```typescript
{
  hu: "A Revolut 2025. december 8-án bejelentette kriptovaluta-szolgáltatásainak megszüntetését Magyarországon a szabályozási környezet változása miatt.",
  en: "Revolut announced the termination of cryptocurrency services in Hungary on December 8, 2025, due to changes in the regulatory environment."
}
```

```typescript
{
  hu: "Az Országgyűlés 2025. május 20-án fogadta el a T/11922/13 módosító javaslatot, amely először tartalmazta a kriptovalidátor kifejezést.",
  en: "The Parliament adopted amendment T/11922/13 on May 20, 2025, which first contained the term 'crypto validator'."
}
```

### Bad summaries (avoid):

```typescript
{
  hu: "A Revolut kiszállt a magyar piacról, mert nem bírták a szabályokat.",  // Too informal
  en: "Revolut left the Hungarian market because they couldn't handle the rules."  // Colloquial
}
```

```typescript
{
  hu: "Durva dolgok történtek a kripto piacon!!!",  // Sensationalist
  en: "Crazy things happened in the crypto market!!!"  // Unprofessional
}
```

## Integration with Source Data

After generating a summary, add it to `src/data/sources.ts`:

```typescript
"source-slug": {
  title: "Source Name",
  originalUrl: "https://example.com/article",
  summary: {
    hu: "Generated Hungarian summary...",
    en: "Generated English summary...",
  },
},
```

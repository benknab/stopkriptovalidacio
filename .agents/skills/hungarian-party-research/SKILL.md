---
name: hungarian-party-research
description: Hungarian political party and crypto policy research using Exa search. Finds party positions, candidate info, news coverage, parliamentary activity, and campaign commitments related to kriptovalidáció. Use when researching Hungarian parties, MPs, candidates, election policy, or crypto regulation coverage.
context: fork
---

# Hungarian Party & Policy Research

## Tool Restriction (Critical)

ONLY use `web_search_advanced_exa`. Do NOT use `web_search_exa` or any other Exa tools.

## Token Isolation (Critical)

Never run Exa searches in main context. Always spawn Task agents:

- Agent runs Exa search internally
- Agent processes results using LLM intelligence
- Agent returns only distilled output (compact JSON or brief markdown)
- Main context stays clean regardless of search volume

## Language & Coverage Realities

Exa indexes Hungarian content unevenly. Expect:

- **Good results:** Telex, Portfolio, HVG, 444, Index.hu, BitcoinBázis, KriptoAkadémia
- **Partial results:** Party websites, smaller Hungarian outlets, Magyar Hang
- **Poor/no results:** parlament.hu documents (PDFs, iromány pages), 2026-valasztas.hu candidate profiles, Jogtar

For parlament.hu and PDF-heavy sources, fall back to direct URL fetching or browser tools — Exa won't index these.

## Dynamic Tuning

No hardcoded numResults. Tune to user intent:

- Quick check on one party → 5-10
- Comprehensive policy scan across parties → 30-50
- User specifies number → match it

## Query Strategy

Hungarian political search requires bilingual queries. For coverage:

- Always run both Hungarian AND English query variants
- Hungarian queries catch domestic coverage; English catches international/EU coverage
- Run in parallel, merge and deduplicate

Example for crypto policy:

- HU: "kriptovalidáció párt álláspont 2026"
- HU: "kripto szabályozás választási program"
- EN: "Hungary crypto regulation party position 2026"

## Categories

- `news` → Hungarian media coverage, press statements, parliamentary reporting
- `company` → Party-adjacent orgs (Magyar Fintech Szövetség, Caduceus Zrt.)
- `tweet` → MP/party social media positions
- `people` → Candidate LinkedIn profiles (limited for Hungarian politicians)
- No category (`type: "auto"`) → general web, party websites, manifestos, blog posts

Start with `news` for coverage monitoring, `type: "auto"` for policy positions and party websites.

### Category-Specific Filter Restrictions

When using `category: "company"`, these cause 400 errors:

- `includeDomains` / `excludeDomains`
- `startPublishedDate` / `endPublishedDate`
- `startCrawlDate` / `endCrawlDate`

Domain and date filters work fine with `news` or no category.

**Universal restriction:** `includeText` and `excludeText` only support **single-item arrays**.

## Key Domains

Prioritize these for `includeDomains` (when not using `category: "company"`):

- News: telex.hu, portfolio.hu, hvg.hu, 444.hu, index.hu, magyarhang.org
- Crypto-specific: bitcoinbazis.hu, kriptoakademia.com, cryptofalka.hu
- Party sites: tiszapart.hu, dkp.hu, mihazank.hu, momentum.hu, fidesz.hu
- EU: ec.europa.eu

## Examples

### Find party positions on crypto

```
web_search_advanced_exa {
  "query": "kriptovalidáció választási program 2026",
  "type": "auto",
  "livecrawl": "fallback",
  "numResults": 15
}
```

### Monitor Hungarian crypto regulation news

```
web_search_advanced_exa {
  "query": "kriptovalidáció Caduceus szabályozás",
  "category": "news",
  "numResults": 20,
  "startPublishedDate": "2026-01-01",
  "includeDomains": ["telex.hu"]
}
```

### International/EU coverage of Hungary infringement

```
web_search_advanced_exa {
  "query": "Hungary MiCA infringement crypto validation",
  "category": "news",
  "numResults": 15,
  "startPublishedDate": "2026-01-01"
}
```

### Find candidate social media statements

```
web_search_advanced_exa {
  "query": "kriptovalidáció képviselő jelölt",
  "category": "tweet",
  "numResults": 20
}
```

### Research Caduceus or Fintech Szövetség

```
web_search_advanced_exa {
  "query": "Caduceus Zrt kriptovalidáció",
  "type": "deep",
  "livecrawl": "fallback",
  "numResults": 10
}
```

## Browser Fallback

Auto-fallback to browser when:

- Exa returns insufficient Hungarian results
- Content is on parlament.hu (PDFs, iromány pages)
- Jogtar legislative text needed
- 2026-valasztas.hu candidate profiles

## Output Format

Return:

1. Results (structured; one item per row with party/source/date)
2. Sources (URLs with 1-line relevance)
3. Confidence (flag results where Exa coverage may be incomplete — especially for smaller parties or parlament.hu
   content)
4. Gaps (explicitly note what Exa couldn't find that likely exists elsewhere)

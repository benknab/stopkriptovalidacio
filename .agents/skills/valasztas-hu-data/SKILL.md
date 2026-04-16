# Skill: valasztas-hu-data

Accessing and extracting data from the Hungarian National Election Office (NVI) valasztas.hu website.

## Overview

The valasztas.hu website is a Single Page Application (SPA) that loads election data from JSON endpoints. This skill
provides guidance on accessing candidate data, photos, and election results programmatically.

## Base Data URL

Data files are stored at versioned paths:

```
https://vtr.valasztas.hu/ogy2026/data/{VERSION}/{TYPE}/{FILENAME}.json
```

Where:

- `{VERSION}`: A timestamp-based code (e.g., `04112100` for 2026-04-11 21:00)
- `{TYPE}`: Data type subdirectory (e.g., `ver` for versioned data)
- `{FILENAME}`: JSON filename

## Key Data Endpoints

### Lists and Candidates

```
https://vtr.valasztas.hu/ogy2026/data/{VERSION}/ver/ListakEsJeloltek.json
```

Contains all party lists and their candidates with:

- `list`: Array of party lists
  - `tl_id`: List ID
  - `jlcs_nev`: List name (party name)
  - `jeloltek`: Array of candidates
    - `kpn_id`: Candidate person ID (matches mps.json keys)
    - `neve`: Candidate name
    - `fenykep`: Photo ID (numeric)
    - `kep_tipus`: Photo format ("JPG" or "JPEG")

### Candidate Photo URLs

Candidate photos follow a predictable URL pattern based on the `fenykep` ID:

```
https://vtr.valasztas.hu/ogy2026/kepek/{TENS_DIGIT}/{ONES_DIGIT}/Kep-{FENYKEP_ID}.{EXT}
```

Where:

- `{TENS_DIGIT}`: Second-to-last digit of fenykep ID
- `{ONES_DIGIT}`: Last digit of fenykep ID
- `{FENYKEP_ID}`: The numeric photo ID from the JSON
- `{EXT}`: File extension (JPG or JPEG from `kep_tipus`)

**Example:**

- Photo ID: `30299`
- Last two digits: `9` (ones), `9` (tens wait, let me recalculate)
- Actually: 30299 → last digit is 9, second-to-last is 9
- URL: `https://vtr.valasztas.hu/ogy2026/kepek/9/9/Kep-30299.JPG`

Correct pattern based on analysis:

- Photo ID `30422` → `/2/2/` → `https://vtr.valasztas.hu/ogy2026/kepek/2/2/Kep-30422.JPG`
- Photo ID `29581` → `/8/1/` → `https://vtr.valasztas.hu/ogy2026/kepek/8/1/Kep-29581.JPG`

So the folders are the last two digits split: `{second_to_last}/{last}`

**URL Builder Function:**

```typescript
function getPhotoUrl(fenykep: number, kepTipus: string): string {
	const idStr = fenykep.toString();
	const lastDigit = idStr.slice(-1);
	const secondToLast = idStr.slice(-2, -1);
	const ext = kepTipus.toUpperCase();
	return `https://vtr.valasztas.hu/ogy2026/kepek/${secondToLast}/${lastDigit}/Kep-${fenykep}.${ext}`;
}
```

## Data Matching with MPs

The `kpn_id` (candidate person ID) in the valasztas.hu data matches the keys in `data/mps.json`.

Example matching:

- mps.json key: `"77873"`
- valasztas.hu data: `"kpn_id": 77873`

## Current Version

As of April 2026, the current data version is: `04112100`

Full base URL: `https://vtr.valasztas.hu/ogy2026/data/04112100/ver/`

## API Exploration with agent-browser

To explore the page structure and find data:

```bash
# Open the candidates page
npx agent-browser open "https://vtr.valasztas.hu/ogy2026/jelolo-szervezetek?tab=jeloltek"

# Get all image URLs to understand the pattern
npx agent-browser eval 'JSON.stringify(Array.from(document.querySelectorAll("img")).map(i => i.src))'
```

## Notes

- Data is versioned by timestamp - check for updates regularly
- Photo availability varies - not all candidates have photos (`fenykep` may be missing)
- Image files are served with uppercase extensions (.JPG, .JPEG)
- The website uses Hungarian naming conventions in the JSON keys

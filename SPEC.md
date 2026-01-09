# Take Action Feature Specification

## Overview

A "Cselekedj!" (Take Action) section that allows users to send emails to Hungarian Members of Parliament urging them to
stop the crypto validation law. Inspired by fightchatcontrol.eu but adapted for the Hungarian crypto regulation context.

## Feature Summary

- **Header link**: "Cselekedj!" in navigation, jumps to section via `#cselekedj` anchor
- **Location**: On home page, positioned right above the footer
- **Background**: Same as hero section (`bg-brand` purple)
- **Flow**: Two-step process with visual step tabs
  1. **Üzenet** (Message): Customize email subject and body
  2. **Képviselők** (Representatives): Select MPs to contact
- **Actions**: mailto link + copy buttons for emails and message

## User Flow

### Step 1: Customize Message

1. User sees intro text explaining urgency and threat to crypto services
2. Editable subject line field (pre-filled with default)
3. Editable message textarea (pre-filled with default Hungarian template)
4. "Tovább" (Next) button to proceed to Step 2

### Step 2: Select MPs

1. Filter controls (reuse existing filter logic from `mps-section.tsx`):
   - County dropdown (`megye`)
   - District dropdown (`kerület`) - enabled after county selection
   - Search by name (text input)
2. Selection controls:
   - "Összes kijelölése" (Select All) - selects all currently filtered MPs
   - "Kijelölés törlése" (Deselect All) - clears selection
   - Filter change resets selection
3. MP cards grid displaying:
   - Avatar (photo or fallback)
   - Name
   - Party
   - Vote status badge (reuse `voteColors` from `mps-section.tsx`)
   - Selected state (visual indicator, e.g., border color, checkmark)
4. Selection counter showing number of selected MPs and total email count
5. Preview panel showing:
   - Selected MPs list (scrollable if many)
   - Final message preview
6. Action buttons:
   - "Küldés" (Send) - opens mailto link (disabled if 0 selected)
   - "E-mailek másolása" (Copy Emails) - comma-separated format
   - "Üzenet másolása" (Copy Message) - copies message body

### Email Warning

When total email count exceeds 30:

- Show warning message explaining mailto may not work with many recipients
- Recommend using copy buttons as alternative
- mailto button still functional (user can try)

## Technical Requirements

### Hydration

Full page hydration approach:

- Add client entry point (`src/client.tsx`) that calls `hydrateRoot()`
- Include client bundle script in document
- All existing components become interactive
- State management via React hooks (`useState`, `useContext`)

### New Components

1. **`src/components/take-action-section.tsx`** - Main section wrapper
2. **`src/components/action-step-tabs.tsx`** - Visual step indicator tabs
3. **`src/components/message-form.tsx`** - Subject and body editing
4. **`src/components/mp-selector.tsx`** - MP selection grid with filters
5. **`src/components/mp-select-card.tsx`** - Selectable MP card variant
6. **`src/components/action-buttons.tsx`** - Send and copy buttons

### Refactored/Shared Components

1. **`src/components/vote-badge.tsx`** - Extract badge from inline styles
   - Props: `vote: VoteType`
   - Reuse `voteColors` object

2. **`src/components/mp-avatar.tsx`** - Avatar with fallback and size variants
   ```typescript
   type AvatarSize = "sm" | "md" | "lg";

   interface MpAvatarProps {
   	imageUrl?: string;
   	name: string; // for alt text
   	size?: AvatarSize; // default: "md"
   }
   ```

   Size mappings:
   - `sm`: `w-10 h-10` (40px) - for compact lists
   - `md`: `w-16 h-16` (64px) - for MP cards (current MpCard size)
   - `lg`: `w-24 h-24 sm:w-32 sm:h-32` (96-128px) - for detail page

   Fallback: 👤 emoji on `bg-slate-100` when no `imageUrl`

   Common styles: `rounded-full object-cover border-2 border-slate-200`

3. **`src/components/mp-filter.tsx`** - Extract filter logic
   - Props: filters state, onChange handlers
   - Reuse county/district logic from `mps-section.tsx`

### State Management

```typescript
// Take Action context/state
interface TakeActionState {
	step: 1 | 2;
	subject: string;
	message: string;
	selectedMps: Set<MpSlug>;
	filters: {
		county: string | null;
		district: string | null;
		search: string;
	};
}
```

### MP Selection Logic

```typescript
// Selecting an MP includes all their email addresses
function getSelectedEmails(selectedMps: Set<MpSlug>): string[] {
	return Array.from(selectedMps).flatMap((slug) => Array.from(mps[slug].emails));
}

// Count for warning threshold
function getTotalEmailCount(selectedMps: Set<MpSlug>): number {
	return getSelectedEmails(selectedMps).length;
}
```

### Mailto Generation

```typescript
function generateMailtoUrl(
	emails: string[],
	subject: string,
	body: string,
): string {
	const to = emails.join(",");
	const params = new URLSearchParams({
		subject,
		body,
	});
	return `mailto:${to}?${params.toString()}`;
}
```

### Copy Functionality

```typescript
// Comma-separated emails (no space - email clients parse it fine)
// Tooltip: "Outlook felhasználóknak: cseréld a vesszőket pontosvesszőre"
function copyEmails(emails: string[]): void {
	navigator.clipboard.writeText(emails.join(","));
}

function copyMessage(message: string): void {
	navigator.clipboard.writeText(message);
}
```

## UI Specifications

### Step Navigation

- **Linear flow**: User must complete Step 1 before proceeding to Step 2
- "Tovább" button advances to next step
- "Vissza" button returns to previous step
- Tabs are visual indicators only (not clickable to jump)

### Step Tabs

Visual tabs at top of section (similar to fightchatcontrol.eu):

- Two tabs: "1. Üzenet", "2. Képviselők"
- Active tab highlighted (e.g., brand color background, white text)
- Inactive/future tab muted (e.g., white/10 background)
- Tabs are visual only (not clickable), navigation via buttons

### Section Background

- Same as hero: `bg-brand` (purple from Tailwind config)
- Text: `text-white` for main content
- Form elements: White/light backgrounds for contrast

### MP Select Card

Based on existing `MpCard` but simplified:

- Smaller size than detail cards
- Shows: avatar, name, party, vote badge
- Selection state:
  - Unselected: `border-white/20`
  - Selected: `border-emerald-400 bg-white/10`
  - Checkmark icon overlay when selected
- Click toggles selection

### Responsive Layout

- Mobile: Single column, stacked elements
- Tablet: 2-column MP grid
- Desktop: 3-4 column MP grid
- Message preview: Collapsible on mobile

### Warning Message

When email count > 30:

```
⚠️ Sok címzettet választottál ({{count}} e-mail).
Egyes levelezőprogramok nem tudják kezelni ennyi címzettet.
Használd a "Másolás" gombokat, és illeszd be manuálisan.
```

## i18n Keys

Add to `src/i18n/locales/hu.json` and `en.json`:

```json
{
	"action": {
		"title": "Cselekedj!",
		"intro": "...", // Urgency text about crypto services threat
		"step1": "Üzenet",
		"step2": "Képviselők",
		"subject_label": "Tárgy",
		"message_label": "Üzenet",
		"default_subject": "...", // TBD
		"next": "Tovább",
		"back": "Vissza",
		"select_all": "Összes kijelölése",
		"deselect_all": "Kijelölés törlése",
		"selected_count": "{{count}} képviselő kiválasztva",
		"email_count": "{{count}} e-mail cím",
		"send": "Küldés",
		"copy_emails": "E-mailek másolása",
		"copy_message": "Üzenet másolása",
		"copied": "Másolva!",
		"email_warning": "Sok címzettet választottál...",
		"no_selection": "Válassz ki legalább egy képviselőt",
		"copy_hint": "Outlook: cseréld a vesszőket pontosvesszőre",
		"preview_title": "Előnézet",
		"search_placeholder": "Képviselő keresése..."
	}
}
```

## Data Requirements

Existing MP data in `src/data/mps.ts` is sufficient:

- `name: string`
- `party: Party`
- `vote: VoteType`
- `emails: Set<string>` (may contain multiple)
- `imageUrl?: string`
- `district?: string`

## Build Changes

Deno 2.4+ has `deno bundle` back (uses esbuild internally):

### New deno.json tasks

```json
{
	"tasks": {
		"build:client": "deno bundle --platform browser src/client.tsx > public/client.js",
		"build": "deno task build:css && deno task build:client",
		"dev": "deno task build:css && deno task build:client && deno run --allow-net --allow-read --allow-env --watch src/server.tsx",
		"dev:client": "deno bundle --platform browser --watch src/client.tsx > public/client.js"
	}
}
```

### Document changes

Include client bundle script in `src/components/document.tsx`:

```tsx
<script src="/client.js" defer></script>;
```

### Client entry point (`src/client.tsx`)

```tsx
import { hydrateRoot } from "react-dom/client";
import { App } from "./components/app.tsx";
// ... i18n setup, get initial state from window.__INITIAL_STATE__

hydrateRoot(document.getElementById("root")!, <App {...initialProps} />);
```

## Default Message Content

**Subject**: TBD - Hungarian subject line about crypto validation law

**Body**: TBD - Hungarian message template urging MPs to stop crypto validation law

- Professional, serious tone
- Clear ask/action items
- Space for sender name at end

## File Structure

```
src/
├── client.tsx                    # NEW: Client hydration entry
├── components/
│   ├── take-action-section.tsx   # NEW: Main section
│   ├── action-step-tabs.tsx      # NEW: Step tabs
│   ├── message-form.tsx          # NEW: Message editing
│   ├── mp-selector.tsx           # NEW: MP selection
│   ├── mp-select-card.tsx        # NEW: Selectable card
│   ├── action-buttons.tsx        # NEW: Send/copy buttons
│   ├── vote-badge.tsx            # NEW: Extracted badge
│   ├── mp-avatar.tsx             # NEW: Extracted avatar with sizes
│   ├── mp-filter.tsx             # NEW: Extracted filter
│   └── ... (existing)
```

### Send Button Behavior

- Opens mailto link in user's default email client
- No confirmation feedback after clicking (mailto just opens)
- Button is disabled when no MPs are selected

## Draft Content (For Review)

### Section Intro Text (Hungarian)

```
Cselekedj!

A kriptovaluta validációs törvény veszélybe sodorja a magyar felhasználók hozzáférését
a kriptovaluta szolgáltatásokhoz. A tőzsdék sorra vonulnak ki Magyarországról, és
a helyzet tovább romolhat. De van lehetőségünk változtatni.

Írj a képviselődnek, és kérd, hogy állítsák meg ezt a káros szabályozást.
A hangod számít – hallasd még ma!
```

### Draft Email Subject

```
Kérem, állítsák meg a kriptovaluta validációs törvényt
```

### Draft Email Body

```
Tisztelt Képviselő Úr/Asszony!

[Üzenet szövege TBD - a felhasználó által megadott sablonnal lesz kitöltve]

Tisztelettel,
[Név és lakcím]
```

## Open Questions

1. Default email subject line text? (Draft provided above)
2. Default message body text? (Hungarian, professional tone - TBD)
3. Intro/hero text for the section? (Draft provided above)

## Out of Scope

- Server-side email sending (uses mailto only)
- Email tracking/analytics
- Saving draft messages
- MP data editing/admin interface

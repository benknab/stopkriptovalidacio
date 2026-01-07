# Design System

Simple, light-themed, accessible design for a civic advocacy website.

**Inspiration**: [fightchatcontrol.eu](https://fightchatcontrol.eu/)

## Principles

1. **Simple** - Minimal UI, no unnecessary decoration
2. **Professional** - Suitable for politicians and media
3. **Accessible** - WCAG 2.1 AA compliant
4. **Mobile-first** - Responsive from 320px up

---

## Color Palette

| Token           | Tailwind    | Usage                       |
| --------------- | ----------- | --------------------------- |
| Background      | `white`     | Page background             |
| Surface         | `slate-50`  | Cards, elevated content     |
| Primary Text    | `slate-900` | Headings, body text         |
| Secondary Text  | `slate-600` | Descriptions, metadata      |
| Muted Text      | `slate-500` | Timestamps, labels          |
| Accent          | `blue-600`  | Links, buttons, interactive |
| Accent Hover    | `blue-700`  | Hover states                |
| Primary Event   | `amber-500` | Important timeline events   |
| Secondary Event | `slate-400` | Secondary timeline events   |
| Border          | `slate-200` | Dividers, card borders      |

---

## Typography

**Font**: System font stack (Tailwind default)

| Element       | Classes                                             |
| ------------- | --------------------------------------------------- |
| Page Title    | `text-3xl font-bold tracking-tight`                 |
| Section Title | `text-xl font-semibold`                             |
| Card Title    | `text-lg font-medium`                               |
| Body          | `text-base leading-relaxed`                         |
| Small/Meta    | `text-sm`                                           |
| Link          | `text-blue-600 hover:text-blue-700 hover:underline` |

---

## Layout

- **Max width**: `max-w-3xl` (768px) for readability
- **Padding**: `px-4` mobile, `px-6` tablet+
- **Vertical spacing**: `py-8` mobile, `py-12` tablet+
- **Component gaps**: Use `space-y-*` or `gap-*` consistently

---

## Components

### Header

```
- Site title (h1)
- Brief description
- Language switch (top-right)
- Simple, no logo initially
```

### Timeline

```
- Vertical line: slate-200
- Event dot:
  - Primary: amber-500 fill, amber-500 border
  - Secondary: slate-300 fill, slate-400 border
- Card: white bg, slate-200 border, rounded-lg
- Date: text-sm text-slate-500
- Title: text-lg font-medium text-slate-900
- Summary: text-slate-600
- Sources: text-sm text-blue-600
```

### Source Link

```
- Inline link with external icon
- text-blue-600 hover:underline
- Small external link icon (w-3 h-3)
```

### Button (future)

```
- Primary: bg-blue-600 text-white hover:bg-blue-700
- Padding: px-4 py-2
- Rounded: rounded-md
- Focus: ring-2 ring-blue-500 ring-offset-2
```

---

## Accessibility

- **Contrast**: All text meets 4.5:1 ratio minimum
- **Focus states**: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
- **Touch targets**: Minimum 44x44px for interactive elements
- **Semantic HTML**: Proper heading hierarchy (h1 > h2 > h3)
- **Links**: Distinguishable by color + underline on hover
- **Skip link**: Add for keyboard navigation (future)

---

## Responsive Breakpoints

| Breakpoint | Width  | Usage                    |
| ---------- | ------ | ------------------------ |
| default    | 0px    | Mobile-first base styles |
| `sm`       | 640px  | Large phones             |
| `md`       | 768px  | Tablets                  |
| `lg`       | 1024px | Small laptops            |

---

## Implementation Notes

1. Switch current dark theme (zinc-950) to light (white/slate)
2. Update timeline component colors
3. Update app.tsx background and text colors
4. Rebuild CSS after changes

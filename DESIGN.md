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

### Brand Colors (defined in `input.css`)

| Token         | Class              | Usage                       |
| ------------- | ------------------ | --------------------------- |
| Brand         | `text-brand`       | Links, buttons, interactive |
| Brand Hover   | `text-brand-hover` | Hover states                |
| Primary       | `border-primary`   | Important timeline events   |
| Primary Light | `bg-primary-light` | Event dot background        |

### Base Colors (Tailwind defaults)

| Token           | Tailwind    | Usage                     |
| --------------- | ----------- | ------------------------- |
| Background      | `white`     | Page background           |
| Surface         | `slate-50`  | Cards, elevated content   |
| Primary Text    | `slate-900` | Headings, body text       |
| Secondary Text  | `slate-600` | Descriptions, metadata    |
| Muted Text      | `slate-500` | Timestamps, labels        |
| Secondary Event | `slate-400` | Secondary timeline events |
| Border          | `slate-200` | Dividers, card borders    |

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
| Link          | `text-brand hover:text-brand-hover hover:underline` |

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
  - Primary: bg-primary-light border-primary
  - Secondary: bg-slate-100 border-slate-400
- Date: text-sm text-slate-500
- Title: text-lg font-medium text-slate-900
- Summary: text-slate-600
- Sources: text-sm text-brand
```

### Source Link

```
- Inline link with external icon
- text-brand hover:text-brand-hover hover:underline
- Small external link icon (w-3 h-3)
```

### Button (future)

```
- Primary: bg-brand text-white hover:bg-brand-hover
- Padding: px-4 py-2
- Rounded: rounded-md
- Focus: ring-2 ring-brand ring-offset-2
```

---

## Accessibility

- **Contrast**: All text meets 4.5:1 ratio minimum
- **Focus states**: `focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2`
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

Brand colors are defined in `src/styles/input.css` using Tailwind v4's `@theme` directive. This allows using semantic
color names like `text-brand` instead of `text-blue-600` everywhere.

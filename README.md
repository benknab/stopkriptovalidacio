# Stop Kriptovalidáció

A Hungarian civic initiative website documenting the cryptocurrency "validation" law (Act LXVII of 2025) and its
consequences.

## About

This website tracks Hungary's crypto asset regulations:

- Timeline of regulatory changes and their impacts
- Crypto exchange service availability in Hungary
- Parliamentary member database with voting records
- Email template generator for contacting representatives

## Why

- **500,000+ Hungarians** affected by unclear regulations
- Major exchanges restricting or exiting (Revolut, eToro, Strike, Bitstamp, Kriptomat, Bitvavo, MoonPay, CoinCash)
- Single approved validator (Caduceus) is a newly founded company with no crypto experience
- Stricter than EU MiCA with criminal penalties for unclear violations

## Features

- **Timeline**: 40+ regulatory events (May 2025 - January 2026)
- **Exchange tracking**: 22 exchanges (operating/restricted/uncertain)
- **MP database**: 199 parliamentary members with voting records
- **Email generator**: Pre-written templates for contacting representatives
- **Bilingual**: Hungarian and English

## Development

Requires [Deno](https://deno.com/) v2+

```bash
deno install          # Install dependencies
deno task dev         # Development server
deno task build       # Production build
deno task start       # Start production server
deno task check       # Format, lint, type check
```

## Tech Stack

Deno, Fresh 2.0, Preact, Tailwind CSS v4, Vite

## License

MIT

# Migration baseline

`migration-baseline.json` fingerprints the original production application captured on 2026-10-10 before the runtime
migration, in Hungarian and English. It covers main content, links, image paths/alt text/dimensions, CSS classes and SEO.
Framework-specific transport, resource preloads, attribute ordering, whitespace and the old image cache-busting query
parameter are excluded by `pageFingerprint`.

The fixture is a regression baseline, not a snapshot generated from the new application. Update it only after reviewing
intentional content or design changes. Both versions must be compared with the same normalization rules.

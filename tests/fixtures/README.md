# Migration baseline

`migration-baseline.json` fingerprints the original production application captured on 2026-10-10 before the runtime
migration, in Hungarian and English. It covers main content, links, image paths/alt text/dimensions, CSS classes and SEO.
Framework-specific transport, resource preloads, attribute ordering, whitespace and the old image cache-busting query
parameter are excluded by `pageFingerprint`.

The static Pages migration deliberately changes language-specific URLs and adds language alternates to first-party
source pages. The fingerprint normalizes `/en` page links/canonicals back to their original paths, removes the new trailing
slashes from non-root page URLs, and excludes the added source alternates. Separate HTTP and browser assertions verify
the actual new URLs and metadata, including redirect-free canonical and sitemap targets. Default pages are compared as
exported HTML; query-filtered pages are compared in the browser after hydration.

The fixture is a regression baseline, not a snapshot generated from the new application. Update it only after reviewing
intentional content or design changes. Both versions must be compared with the same normalization rules.

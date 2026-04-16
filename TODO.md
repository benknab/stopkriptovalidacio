## TODO

- [x] Remove the current party/coalition section from the home page, along with its dedicated home-page nav link.
- [x] Keep `/kriptovalidalas` as the law explainer page.
- [x] Add a new historical vote page at `/szavazas`.
- [x] Make `/szavazas` reference-only: reuse the old T/11922 vote explorer/search UI there, without the contact form.
- [x] Link to `/szavazas` contextually from the current representatives intro on the home page and from
      `/kriptovalidalas`, but do not add a top-level nav item.
- [ ] Replace the old home-page historical MPs section with a current representatives section that reuses the existing
      browse/filter/card pattern.
- [x] Use a unified people model with curated canonical person IDs.
- [x] Store winners only in the new current dataset.
- Show each current representative's `stance` on the law as a per-person field; start with `unknown` unless we have
  direct individual evidence.
- [ ] Show each current representative's historical T/11922 vote status on the card at all times; add a new
      `not_in_parliament` enum value for people who were not MPs at the time.
- [ ] Add a `wonElectionYears` set to current person records, e.g. `[2022, 2026]`, `[2022]`, or `[2026]`. -- handled
      with elections object now
- [ ] Repurpose the existing `Cselekedjen` flow to the current data while keeping the behavior the same as now,
      including optional list add-ons.
- [x] Use official NVI data as the primary source (`EgyeniJeloltek.json`, `ListakEsJeloltek.json`, `OevkAdatok.json`).
- [x] Finalize winner extraction separately: prefer an official machine-readable winner source if we can identify one,
      otherwise fall back to scraping the official NVI site.
- [x] Remove old scripts, no need to add helper/one time scripts to deno.json
- [ ] Reevaluate /szavazas URL

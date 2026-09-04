# Vitteey Sarthi Color Studio

Vitteey Sarthi Color Studio – a fast color palette generator and color tools website.

Live at [www.vitteeysarthi.com](https://www.vitteeysarthi.com).

## Stack

- [Astro](https://astro.build) — static site generation, routing, SEO metadata, sitemap
- [React](https://react.dev) — interactive islands only (generator, pickers, contrast checker)
- TypeScript
- Tailwind CSS v4
- Vitest — unit tests for the color-math utilities
- No backend, database, or authentication. Saved palettes live in `localStorage` only.

## Structure

```
src/
  components/react/   React islands (hydrated client-side only where needed)
  data/                Seed data for curated palettes and named colors
  layouts/             Astro layouts (SEO/OG metadata lives in BaseLayout.astro)
  lib/                 Color math, contrast, and localStorage helpers
  pages/               Astro routes — static HTML at build time
```

Routes:

- `/` — homepage
- `/generator` — the interactive palette generator
- `/palettes` — curated palette index
- `/palette/[palette]` — one static page per curated palette
- `/color/[hex]` — one static page per named color
- `/about`, `/privacy`, `/terms`

## Development

```bash
npm install
npm run dev       # start dev server
npm run test      # run unit tests
npm run build     # type-check-free static build to dist/
npm run preview   # preview the production build
```

## Deployment

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`
(tests run first). The production domain is set via `public/CNAME` and
`site` in `astro.config.mjs`. In the repository's Settings → Pages, set the
source to "GitHub Actions".

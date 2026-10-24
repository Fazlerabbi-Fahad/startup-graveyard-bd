# bdgy-web

The public reading site for **Startup Graveyard**: an archive of failed Bangladeshi startups, each written as a business case study. Content comes from **bdgy-api**.

Stack: Next.js 15 (App Router, JavaScript), Tailwind CSS v4, next-themes, react-markdown + remark-gfm, GSAP + ScrollTrigger (subtle reveals only), `next/og`, and `@next/third-parties` for GA4.

> The working name lives in one place: `lib/site.js` (`SITE_NAME`, tagline, description, optional `CONTACT_EMAIL`). Change it there and every page, OG image and JSON-LD block follows.

---

## Run locally

Requirements: Node 20+ and a running bdgy-api (see `../bdgy-api/README.md`). Its `WEB_ORIGIN` must be `http://localhost:3000`.

```bash
cd bdgy-web
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

The API only returns **published** case studies. To get something to read, run `npm run seed -- --publish` in bdgy-api, or publish from bdgy-admin.

### Environment variables

| Variable | Example | Used for |
| --- | --- | --- |
| `API_URL` | `https://api.example.com/api` | bdgy-api base URL **including `/api`**. Pages fetch from it on the server. It's also passed to the browser for the view counter and the correction form, which call the API directly so its per-IP rate limits see the reader's real IP. |
| `NEXT_PUBLIC_SITE_URL` | `https://example.com` | Canonical URLs, sitemap, Open Graph and JSON-LD. No trailing slash. |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | GA4 measurement ID. GA loads **only in production builds**, and only when this is set. |
| `REVALIDATE_SECRET` | long random string | Must equal `REVALIDATE_SECRET` in bdgy-api. Protects `POST /api/revalidate`. |

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

### Freshness (ISR)

- Pages, the sitemap and every API fetch revalidate **every hour**.
- **On-demand:** after publish, unpublish, an edit to a published case study, or a delete, bdgy-api calls `POST /api/revalidate` with `{ "secret", "slug" }`. The route checks the secret (constant-time comparison) and refreshes `/`, `/case-studies`, `/case-studies/<slug>` and the sitemap, plus every cached API response (tag `case-studies`).
- In bdgy-api, set `NEXT_REVALIDATE_URL=https://<your-site>/api/revalidate` and the same `REVALIDATE_SECRET`.
- If the API is unreachable during `next build`, the build still succeeds with empty pages, which ISR fills in later. At runtime an API outage keeps serving the last good pages.

---

## Deploy to Vercel

1. Push the repo to GitHub, then in Vercel choose *Add New → Project* and import it.
2. **Root Directory:** `bdgy-web`. The framework (Next.js), build command and output are detected automatically.
3. *Environment Variables* (Production, and Preview if you use it): `API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `REVALIDATE_SECRET`.
4. Deploy, then add your custom domain under *Settings → Domains*. Set `NEXT_PUBLIC_SITE_URL` to that exact domain and redeploy.
5. In **bdgy-api**, set:
   - `WEB_ORIGIN=https://example.com`: the exact site origin. The browser calls the API for views and corrections, so CORS must allow it.
   - `NEXT_REVALIDATE_URL=https://example.com/api/revalidate`
   - `REVALIDATE_SECRET=<same value>`
6. Check it worked: publish or edit something in the admin. The change should appear on the site within seconds, and the API logs `Revalidated "<slug>"`.

Notes:

- Images uploaded through the admin (Cloudinary) are optimized by `next/image`. Pasted URLs on other hosts render as plain lazy `<img>`, which keeps the image optimizer from acting as an open proxy.
- OG images render on demand with `next/og` and the WOFF files in `assets/fonts` (OFL-licensed; see the README there).

---

## Google Search Console

1. Open <https://search.google.com/search-console> and click *Add property*.
   - **Domain property** (recommended) covers every subdomain and protocol. Verify with the DNS TXT record Google gives you, at your domain registrar.
   - Or use a **URL-prefix property** for `https://example.com/`. Verify with the HTML tag method: add it under `metadata.verification` in `app/layout.js`, e.g. `verification: { google: '<token>' }`, then redeploy.
2. Once verified, go to *Indexing → Sitemaps*, enter `sitemap.xml` (the full URL is `https://example.com/sitemap.xml`) and click *Submit*. The sitemap lists the home page, the archive, About and every published case study, with `lastmod` taken from `updatedAt`.
3. `robots.txt` already points crawlers to the sitemap and disallows `/api/`.
4. To get a new case study crawled sooner, use *URL Inspection* on its URL and click *Request indexing*.
5. Check *Enhancements* for structured data. The home page has `WebSite` + `SearchAction` and each case study has `Article`. You can also test any URL at <https://search.google.com/test/rich-results>.

---

## What's where

```
app/
  layout.js                  fonts (next/font), theme provider, header/footer, GA4 (production only)
  page.js                    home: hero + search, the numbers, why they died, latest, sectors, disclaimer
  case-studies/page.js       archive: URL-driven filters, grid, "Load more" (server action in actions.js)
  case-studies/[slug]/       reading page, per-article OG image
  about/page.js, not-found.js, error.js
  api/revalidate/route.js    on-demand ISR endpoint for bdgy-api
  sitemap.js, robots.js, opengraph-image.js, icon.svg
components/
  reading/                   progress bar, TOC (desktop + mobile), Markdown, blocks (at a glance,
                             timeline, reason cards, lessons, sources), correction form, share, prev/next, view ping
  archive/                   filter bar (bottom sheet on phones), results + load more
  Motion.jsx                 GSAP reveals (JS-applied, below the fold only; fade-only under reduced motion)
  ReasonIcon.jsx             one line icon per failure category
lib/
  api.js                     server-side API client (cached, tagged, resilient at build time)
  site.js, format.js, filters.js, og.js
```

### Design and accessibility notes

- **Type:** Bricolage Grotesque (800 headings, 200 display lines), Newsreader for reading (1.1875rem / 1.75, 68ch measure; 18px on phones), JetBrains Mono for labels and numbers. Bangla text falls back to Noto Serif/Sans Bengali, which are downloaded only when Bangla characters appear.
- **Colors:** CSS variables in `app/globals.css` with a `[data-theme='dark']` variant. Every text/background pair passes WCAG AA (lowest is muted on surface: 4.63:1). Dark mode uses #E9E5DD on #121311, not pure white on black. The accent is reserved for links, active states and key numbers.
- **Motion:** content is never hidden by CSS. Reveals are applied by JavaScript only to elements below the fold, using opacity (so find-in-page still works). Elements skipped by a jump appear instantly. With `prefers-reduced-motion` the fade stays but nothing moves, count-ups are skipped and card hover lifts are disabled. There's no global rule that zeroes animations.
- **Markdown:** raw HTML in case study sections is dropped (`skipHtml`), and unsafe link schemes are blocked.

### Measured

`next build` + `next start`, Lighthouse 12 (mobile preset):

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 96 | 100 | 100 | 100 |
| `/case-studies/<slug>` | 91 | 100 | 100 | 100 |

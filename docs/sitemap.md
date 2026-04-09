# Sitemap generation

The site exposes a single sitemap at `/sitemap.xml`, implemented by Next.js [`app/sitemap.ts`](../app/sitemap.ts). Entries are **not** hand-maintained: URLs and `lastModified` values come from Sanity via [`sanityFetch`](../sanity/lib/sanity-fetch.ts).

## URLs included

| URL pattern | Source | Notes |
|-------------|--------|--------|
| `/` | Static | `changeFrequency`: daily, `priority`: 1 |
| `/legal` | Static | `changeFrequency`: monthly, `priority`: 0.5 |
| `/releases` | Static | `changeFrequency`: weekly, `priority`: 0.75 |
| `/legal/[slug]` | GROQ [`LEGAL_DOCUMENTS_QUERY`](../sanity/queries/legal.ts) | One entry per legal document with a slug; `lastModified` from `_updatedAt` |
| `/releases/[slug]` | GROQ [`SITEMAP_RELEASES_QUERY`](../sanity/queries/releases.ts) | One entry per release with a slug; `lastModified` from `_updatedAt` |

Documents without a slug are omitted from the sitemap.

## Excluded routes

- **`/cms`** — Sanity Studio is not listed in the sitemap and should not be treated as public content for SEO.

## Cache tags and freshness

`Sanity` data is fetched with Next.js cache tags so the sitemap can be invalidated when content changes:

- `collection:legal` — all legal documents
- `collection:releases` — all releases

[`sanity-fetch`](../sanity/lib/sanity-fetch.ts) uses `revalidate: false` and relies on **on-demand revalidation** (for example via a Sanity webhook calling `revalidateTag` for the affected collection). Configure your deployment so that when legal or release documents change in Sanity, the corresponding tag is revalidated; until then, cached sitemap responses may reflect the previous build or last successful revalidation.

## Queries

- **Legal list for sitemap:** [`LEGAL_DOCUMENTS_QUERY`](../sanity/queries/legal.ts)
- **Releases for sitemap:** [`SITEMAP_RELEASES_QUERY`](../sanity/queries/releases.ts) — minimal fields (`_id`, `slug`, `_updatedAt`) only, ordered like the public releases index (`featured` then `releaseDate`).

After changing GROQ strings, run `npm run generate:types` so [`types/cms.d.ts`](../types/cms.d.ts) stays in sync.

## How to verify

1. Set `NEXT_PUBLIC_SITE_URL` (and on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used to derive the public URL in [`config/site.ts`](../config/site.ts)).
2. Run `npm run dev` and open `http://localhost:3000/sitemap.xml` (or your preview/production origin + `/sitemap.xml`).
3. Confirm `<loc>` entries for `/`, `/legal`, `/releases`, each legal slug, and each release slug, and confirm there is no Studio URL.

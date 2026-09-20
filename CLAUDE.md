# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

Use **pnpm** for all package operations (for example: `pnpm add`, `pnpm install`).

## Commands

```bash
pnpm dev             # Start Next.js development server
pnpm build           # Production build
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm format          # Run Prettier on all TypeScript and JSON files
pnpm typecheck       # TypeScript type check (no emit)
pnpm generate:types  # Regenerate Sanity schema + TypeGen output
```

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript** (`strict: true`, path alias `@/*` -> project root)
- **Tailwind CSS v4**
- **Sanity CMS** (embedded Studio + GROQ + TypeGen + Presentation Tool / Visual Editing)

## Architecture

### App Router layout

- `app/layout.tsx` defines global fonts and metadata base.
- `app/(static)/layout.tsx` wraps site routes with `<Header>` and `<Footer>`, sets dynamic metadata, and mounts analytics.
- Main routes:
  - `app/(static)/page.tsx` (home)
  - `app/(static)/releases/page.tsx`
  - `app/(static)/releases/[slug]/page.tsx`
  - `app/(static)/legal/page.tsx`
  - `app/(static)/legal/[slug]/page.tsx`
  - `app/cms/[[...tool]]/page.tsx` (Sanity Studio)

### Component organization

- `components/home/` - home sections (`hero`, `latest-releases`, `about`)
- `components/layout/` - navigation/layout shell (`header`, `footer`, nav variants)
- `components/releases/` - release cards and streaming links
- `components/shared/` - logo, icon helpers, shared social rendering
- `components/ui/` - reusable UI primitives
- `components/analytics/` - analytics integrations

### Config and domain utilities

- `config/site.ts` is the static site config source (site URL, nav labels, legal links, social defaults).
- `lib/social-media.ts` centralizes supported social/streaming platform rules.
- `next.config.ts` allows remote images from `cdn.sanity.io/images/**`.

## Metadata and SEO

- Global `metadataBase` is set in `app/layout.tsx` using `SITE_CONFIG.URL`.
- Route-group metadata is generated in `app/(static)/layout.tsx` from Sanity `siteConfig` via `getSiteConfig()` and `urlFor(...)`.
- Keep canonical URLs explicit on individual routes (see `app/(static)/page.tsx`).
- Sitemap/robots are generated from `app/sitemap.ts` and `app/robots.ts`; if routes or content models change, update these.

## Analytics & Click Tracking

Google Analytics 4 (`@next/third-parties`) and Microsoft Clarity (`@microsoft/clarity`) are mounted in `app/(static)/layout.tsx`. Both auto-track page views; custom click events go through one shared module — never call `sendGAEvent` or `clarity` directly from a component.

- `lib/analytics.ts` exports `trackLinkClick(...)` (streaming/social link clicks) and `trackVideoPlayClick(...)` (release video embed plays). Each call fires to both GA4 and Clarity.
- **Every outbound streaming/social/video link must be wired for click tracking** with an explicit `placement` (`LinkPlacement` in `lib/analytics.ts`) identifying which UI surface rendered it (`hero`, `header`, `footer`, `mobile_nav`, `desktop_nav`, `release_detail_primary_cta`, `release_detail_list`). Add a new `LinkPlacement` value when introducing a new surface.
- Normalize platform strings via `getTrackingPlatformId()` (`lib/social-media.tsx`) before sending them as event params — `releases.streamingLinks`, `artist.socialLinks`, and `siteConfig.socialMedia` use inconsistent platform key casing (e.g. `apple-music` vs `applemusic`), and this function is the single place that reconciles them for analytics.
- Components that render tracked links must be Client Components (`"use client"`) — if a link lives inside a Server Component (e.g. an async page), extract a small client leaf component to hold the `onClick`, following the pattern in `components/releases/link-click-tracker.tsx` and `components/releases/video-embed.tsx`.
- **When adding any new component that renders an outbound streaming/social/video link, or new release-related interactive media (embeds, players), wire it for click tracking before shipping.** See `AGENTS.md`'s Execution Workflow and Hard Guardrails for the enforcement checklist.

## Structured Data (JSON-LD)

Every public-facing page renders schema.org JSON-LD via a shared Server Component — never `next/script` for this (Next's own docs warn against it for JSON-LD: it's structured data, not executable JS, and has known issues serializing dynamic JSON-LD into the RSC flight payload).

- `components/shared/json-ld.tsx` exports `JsonLd<T extends Thing>({ data }: { data: WithContext<T> })`, a generic Server Component rendering a native `<script type="application/ld+json">` with `dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}` — this exact escaping guards against Sanity free-text fields (titles, descriptions) containing `<`.
- `lib/structured-data.ts` centralizes all schema.org object construction as pure `build*JsonLd(...)` functions, each consuming data already fetched for that page's normal rendering — never issue a new Sanity fetch solely for JSON-LD.
- Types come from `schema-dts` (Google's official TypeScript types for schema.org), a devDependency — compile-time only, no runtime cost.
- JSON-LD objects are built inside the page component itself (not `generateMetadata`, which is metadata-only and cannot emit arbitrary markup).
- Every `build*JsonLd` function must omit a schema.org property entirely when its Sanity source is null/empty — never emit `null` or `""` for a property key.
- Type mapping: release `releaseType.name === "Single"` → `MusicRecording`; EP/Album/Mixtape/anything else → `MusicAlbum`. Artist entities (release `byArtist`, homepage entity) use `MusicGroup`, not `Person`.
- **When adding any new public-facing page, ship it with appropriate JSON-LD structured data before shipping**, following this pattern. See `AGENTS.md`'s Execution Workflow and Hard Guardrails for the enforcement checklist.

## Link Usage

Use Next.js `<Link prefetch={false}>` for internal links unless prefetch is intentionally needed and justified.

## Sanity CMS

Sanity is integrated for content management. Infrastructure lives in `sanity/`, and Studio is mounted at `/cms`.

### Core files

- `sanity.config.ts` - Studio config (`basePath: "/cms"`), including the `presentationTool()` plugin
- `sanity/structure.ts` - Studio sidebar structure and singleton pinning
- `sanity/presentation/resolve.ts` - Presentation Tool document location resolvers (`mainDocuments` + `locations`)
- `sanity/schemaTypes/` - schema definitions and exports
- `sanity/lib/client.ts` - Sanity client, configured with `stega.studioUrl` for click-to-edit
- `sanity/lib/live.ts` - `defineLive()` — exports `sanityFetch` (draft/live-aware fetch) and `<SanityLive>`
- `sanity/lib/cache-tags.ts` - typed collection/document tag helpers
- `sanity/lib/image.ts` - Sanity image URL builder
- `sanity/queries/` - query modules and cached fetch functions
- `app/api/draft-mode/enable/route.ts` / `disable/route.ts` - draft mode toggle routes used by the Presentation Tool

### Query/fetch pattern

- Place GROQ query strings in domain-local query files (for example `sanity/queries/releases/queries.ts`).
- Place fetch wrappers in adjacent `index.ts` files using `sanityFetch()` from `@/sanity/lib/live` (destructure `{ data }` — it does not return the value directly).
- Always import generated query result types from `@/types/cms`.
- Use `cache(...)` around server fetch functions so duplicate calls in a request are deduplicated.
- Call sites that run outside a request scope (`generateStaticParams`, `app/sitemap.ts`) must not let `sanityFetch` auto-resolve its perspective — that read calls `draftMode()`/`cookies()`, which throws at build time. Query wrappers used in both contexts accept a `{ build: true }` option that pins `perspective: "published"` and `stega: false` (see `sanity/queries/legal/index.ts`'s `getLegalDocuments`/`getLegalDocumentBySlug`). `generateMetadata` runs in a request scope and only needs `{ stega: false }` (no `perspective` override) so `<title>`/`<meta>` stay free of stega's invisible characters while still reflecting draft content.
- **stega is all-or-nothing per query, not per-field.** A query returning any field compared with strict string-literal equality elsewhere (for example `platform` in `streamingLinks`/`socialMedia`/`socialLinks`, checked against `SupportedSocialPlatform` in `lib/social-media.tsx`) must either disable stega entirely for that query, or that field must be split into a separate stega-disabled query and merged with the stega-enabled rest. This isn't a style preference — with stega on, `next-sanity`'s `StegaBranded<T>` type wrapper makes every string a `StegaString<T>`, which is a TypeScript error when assigned to a literal union type, and the type-level branding has no configurable per-field exemption (only keys starting with `_` and `slug.current` are exempt). When adding a new query with both freeform text and an enum-like field, decide up front which pattern applies before wiring it into a page:
  - **Single flat field**: `getSiteConfig()` (`sanity/queries/site-config/index.ts`) merges `SITE_CONFIG_QUERY` (stega on — hero/title/description) with a separate `SITE_CONFIG_SOCIAL_MEDIA_QUERY` (stega off — `socialMedia[].platform`), joined trivially since both target the same singleton document.
  - **Multiple/nested fields on one document**: `getReleaseBySlug()` (`sanity/queries/releases/index.ts`) is the fuller pattern — `RELEASE_BY_SLUG_QUERY` (stega on) is joined with three separate stega-off queries for its own `streamingLinks`, each `artists[].socialLinks` (merged by artist `_id`), and each `referencedReleases[].streamingLinks` (merged by release `_id`). All four run in `Promise.all(...)`, and the merged, fully-typed shape is exported as `ReleaseBySlugWithLinks` (same convention: `SiteConfigWithSocialMedia`, `UpcomingReleaseWithStreamingLinks`, `LatestFeaturedReleaseWithStreamingLinks`) — import the merged type from the query module, not the raw `*_QUERY_RESULT` from `@/types/cms`, in any component/util that consumes the merged shape.
  - A query with zero current UI consumers (for example `getAllReleases`, `getFeaturedReleases`) can stay fully `stega: false` rather than splitting — split only when something actually renders that query's freeform text and needs click-to-edit on it.

### Cache and revalidation

- Tag every Sanity fetch with `createCollectionTag(...)` and, when slugged content is fetched, `createDocumentTag(...)`.
- Webhook endpoint: `app/api/revalidate/route.ts`.
- Webhook verification uses `@sanity/webhook` `isValidSignature(...)`.
- Revalidation uses `revalidateTag(tag, "max")` for changed content types:
  - `releases` collection and per-slug document
  - `legal` collection and per-slug document
  - `siteConfig` collection

### Presentation Tool / Visual Editing (draft preview)

Editors preview unpublished drafts and click-to-edit directly from the live site, inside the embedded Studio at `/cms` → the "Presentation" tab (added by `presentationTool()` in `sanity.config.ts`).

- **`sanity/lib/live.ts`** is the fetch layer for this: `defineLive()` returns `sanityFetch` (perspective/draft-aware, replaces the old plain `sanity-fetch.ts`) and `<SanityLive>` (subscribes to the Live Content API for real-time updates while previewing).
- **`app/api/draft-mode/enable/route.ts`** — the Presentation Tool calls this (via `previewUrl.previewMode.enable` in `sanity.config.ts`) to activate Next.js Draft Mode when an editor opens the preview; uses `next-sanity/draft-mode`'s `defineEnableDraftMode`, which verifies a Sanity-issued preview secret before enabling.
- **`app/api/draft-mode/disable/route.ts`** — not called automatically; it's the target of the floating "Disable Draft Mode" button (`components/shared/disable-draft-mode.tsx`), shown only outside the Presentation iframe (`useIsPresentationTool()` from `next-sanity/hooks`).
- **`<SanityLive />` and `<VisualEditing />` are mounted only in `app/(static)/layout.tsx`, never in the root `app/layout.tsx`.** The root layout wraps `/cms` too, and Sanity's own docs warn that mounting these on the Studio's own route causes the Studio iframe to reload unexpectedly. `<VisualEditing />` and the disable button render only when `(await draftMode()).isEnabled`; `<SanityLive />` renders unconditionally.
- **`sanity/presentation/resolve.ts`** maps document types to frontend routes for click-to-edit navigation and the "used on" sidebar list: `releases` → `/releases/:slug`, `legal` → `/legal/:slug`, `siteConfig` → `/` (it drives the homepage hero — see the Featured-release override section below), and `artist`/`faqs`/`releaseType` get a `message`-only location (no dedicated route to link to yet). Add a real `location` entry here whenever a new document type gains its own rendering route.
- **This coexists with, and does not replace, the webhook + tag revalidation described below.** `<SanityLive>`'s own revalidation is eventually-consistent by default; the webhook's `revalidateTag(tag, "max")` remains the deterministic, instant invalidation path for production traffic. Don't remove `cache-tags.ts` tagging when touching a query — both mechanisms read the same tags.
- Requires `SANITY_API_READ_TOKEN` (Viewer role, server-only) — see Required environment variables below. `next-sanity` must be `^13.1.5`+ (this also requires `sanity ^5.29.0 || ^6.0.0` and `@sanity/client ^7.26.2 || ^8.0.0` as peers — bump all three together, not just `next-sanity`, or query result types silently collapse to `unknown`/mismatch).

### TypeGen workflow (mandatory)

Run `pnpm generate:types` after every Sanity schema or GROQ query change.

1. Update schema/query files.
2. Run `pnpm generate:types`.
3. Use regenerated types from `types/cms.d.ts`.
4. Do not hand-write duplicate Sanity payload interfaces.

`sanity.cli.ts` is configured to:
- extract schema to `schema.json`
- generate TypeScript types to `types/cms.d.ts`
- scan source files with `./**/*.{ts,tsx,js,jsx}`

### Featured-release override (Hero / Header / Nav / Footer)

`siteConfig` has a `hero` field group (Studio group `hero`) with:
- `useFeaturedReleaseOverride` (boolean, default `true`)
- `heroTitle`, `heroSubtitle`, `heroImage` — Hero's headline, small label, and floating image; these **always** come from `siteConfig` and never change based on the featured release
- `heroCta` was considered but removed — Hero has no standalone CTA button beyond the existing "Coming Soon" upcoming-release teaser and the streaming-links row

`releases` reuses its existing `featured` boolean (no uniqueness constraint) — "the" featured release is resolved as the most recent `releaseDate` among `featured == true` releases, via `LATEST_FEATURED_RELEASE_QUERY` / `getLatestFeaturedRelease()` (`sanity/queries/releases/`).

When `useFeaturedReleaseOverride` is on and a featured release exists, its `streamingLinks` are merged **per platform** into `siteConfig.socialMedia`'s links — the release's link wins for any platform it provides; `siteConfig`'s link is kept for platforms the release doesn't have. When the toggle is off, or no release is featured, `siteConfig.socialMedia` is used unchanged. This merge is centralized in `mergeStreamingAndSocialLinks()` (`lib/social-media.tsx`) and called from both `app/(static)/page.tsx` (Hero streaming/social rows) and `app/(static)/layout.tsx` (Header + Footer, which both fetch `getLatestFeaturedRelease()` alongside `getSiteConfig()`).

`siteConfig.socialMedia` uses camelCase platform keys (`applemusic`, `youtubemusic`); `releases.streamingLinks` uses hyphenated keys (`apple-music`, `youtube-music`). `mergeStreamingAndSocialLinks()` normalizes release keys to their camelCase equivalent before merging — don't compare these keys directly.

Because Hero/Header/Footer now depend on both `siteConfig` and `releases` together, any page/layout consuming this merge must fetch and tag both collections (`getSiteConfig()` + `getLatestFeaturedRelease()`) so publishing or toggling `featured` on a release correctly revalidates them.

### Required environment variables

From `.env.example`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SITE_URL`
- `SANITY_WEBHOOK_SECRET`
- `SANITY_API_READ_TOKEN` — Viewer-role Sanity API token, server-only (never `NEXT_PUBLIC_`). Required for the Presentation Tool / draft mode preview (`sanity/lib/live.ts`, `app/api/draft-mode/enable/route.ts`). Create it at manage.sanity.io → project → API → Tokens.

Optional:
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
- `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `EFFERD_REGISTRY_TOKEN`

## Agent Guidance

Operational workflow and guardrails for coding agents are documented in `AGENTS.md`.

Use both files together:
- `CLAUDE.md` = architecture/conventions/source of truth
- `AGENTS.md` = execution playbook/checklists/safety rules

## Contributing

Contribution guidelines, coding standards checklist, and the PR process are documented in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Documentation Hygiene

When a change introduces or alters a project convention, architecture rule, command, or workflow:

- Update `CLAUDE.md` in the same PR.
- Update `AGENTS.md` too if the agent execution workflow changes.

Treat this file as an actively maintained source of truth, not a one-time onboarding note.

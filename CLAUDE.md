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
- **Sanity CMS** (embedded Studio + GROQ + TypeGen)

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

- `sanity.config.ts` - Studio config (`basePath: "/cms"`)
- `sanity/structure.ts` - Studio sidebar structure and singleton pinning
- `sanity/schemaTypes/` - schema definitions and exports
- `sanity/lib/client.ts` - Sanity client
- `sanity/lib/sanity-fetch.ts` - server fetch helper using cache tags
- `sanity/lib/cache-tags.ts` - typed collection/document tag helpers
- `sanity/lib/image.ts` - Sanity image URL builder
- `sanity/queries/` - query modules and cached fetch functions

### Query/fetch pattern

- Place GROQ query strings in domain-local query files (for example `sanity/queries/releases/queries.ts`).
- Place fetch wrappers in adjacent `index.ts` files using `sanityFetch<T>()`.
- Always import generated query result types from `@/types/cms`.
- Use `cache(...)` around server fetch functions so duplicate calls in a request are deduplicated.

### Cache and revalidation

- Tag every Sanity fetch with `createCollectionTag(...)` and, when slugged content is fetched, `createDocumentTag(...)`.
- Webhook endpoint: `app/api/revalidate/route.ts`.
- Webhook verification uses `@sanity/webhook` `isValidSignature(...)`.
- Revalidation uses `revalidateTag(tag, "max")` for changed content types:
  - `releases` collection and per-slug document
  - `legal` collection and per-slug document
  - `siteConfig` collection

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

### Required environment variables

From `.env.example`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SITE_URL`
- `SANITY_WEBHOOK_SECRET`

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

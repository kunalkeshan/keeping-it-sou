# keeping-it-sou

Official site for Sou — showcasing releases, music, and upcoming drops.

**Live site →** [keepingitsou.com](https://keepingitsou.com)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Sanity CMS](https://img.shields.io/badge/Sanity_CMS-v5-F03E2F?logo=sanity&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-package_manager-F69220?logo=pnpm&logoColor=white)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)](https://vercel.com)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

This is the source code for keeping-it-sou — the official portfolio site for Sou, a hip-hop artist. The site showcases releases with streaming links, an about section, and legal pages. Content (releases, site config, social links) is managed through [Sanity CMS](https://www.sanity.io), embedded at `/cms`. The site uses ISR (Incremental Static Regeneration) via Sanity webhooks so published changes go live without a full redeploy.

---

## Tech Stack

| Technology                                                | Version | Purpose                           |
| --------------------------------------------------------- | ------- | --------------------------------- |
| [Next.js](https://nextjs.org)                             | 16      | Framework (App Router, RSC)       |
| [React](https://react.dev)                                | 19      | UI library                        |
| [TypeScript](https://www.typescriptlang.org)              | 5       | Type safety                       |
| [Tailwind CSS](https://tailwindcss.com)                   | v4      | Utility-first styling             |
| [Sanity CMS](https://www.sanity.io)                       | v5      | Content management                |
| [next-sanity](https://github.com/sanity-io/next-sanity)   | latest  | Sanity + Next.js integration      |
| [Zod](https://zod.dev)                                    | v4      | Schema validation                 |
| [React Hook Form](https://react-hook-form.com)            | latest  | Form state management             |
| [Motion](https://motion.dev)                              | 12      | Animations                        |
| [next-themes](https://github.com/pacocoursey/next-themes) | latest  | Dark mode                         |
| [Sonner](https://sonner.emilkowal.ski)                    | latest  | Toast notifications               |
| [Lucide React](https://lucide.dev)                        | latest  | Icons                             |
| [Iconify](https://iconify.design)                         | latest  | Social / streaming platform icons |

---

## Architecture

```
app/
  layout.tsx              # Root layout — fonts, metadata base
  (static)/               # Route group: site pages (Header + Footer)
    layout.tsx            # Injects Header/Footer, sets dynamic metadata from Sanity
    page.tsx              # Home page
    releases/
      page.tsx            # All releases listing
      [slug]/page.tsx     # Individual release detail
    legal/
      page.tsx            # Legal documents listing
      [slug]/page.tsx     # Individual legal document
  api/revalidate/         # Sanity webhook endpoint — triggers ISR on content change
  cms/[[...tool]]/        # Embedded Sanity Studio (mounted at /cms)
components/
  home/                   # Home page sections (hero, latest-releases, about)
  layout/                 # Structural components (header, footer)
  releases/               # Release cards and streaming links
  shared/                 # Logo, icon helpers, shared social rendering
  ui/                     # Reusable UI primitives
  analytics/              # Analytics integrations (Google Analytics, Clarity)
config/
  site.ts                 # Static site config — URL resolution
lib/
  social-media.tsx        # Supported social/streaming platform rules and icon helpers
  utils.ts                # cn() class merging utility
sanity/
  schemaTypes/            # Sanity document schema definitions
  queries/                # GROQ query strings and cached fetch wrappers
  lib/                    # Sanity utilities (client, cache-tags, image builder)
  structure.ts            # Studio sidebar structure and singleton pinning
types/
  cms.d.ts                # Generated Sanity TypeGen types (do not hand-edit)
docs/                     # Supplementary documentation
```

**Key design decisions:**

- **Config-driven URL** — `config/site.ts` is the single source of truth for the site URL, falling back from `VERCEL_PROJECT_PRODUCTION_URL` to `NEXT_PUBLIC_SITE_URL`. Never hardcode the origin elsewhere.
- **Social/streaming rules in one place** — `lib/social-media.tsx` owns the full list of supported platforms, their icons, and display labels. Components import from here instead of duplicating logic.
- **TypeGen types are canonical** — all Sanity query result shapes come from `types/cms.d.ts` (generated by `pnpm generate:types`). Never hand-write duplicate payload interfaces.
- **ISR via Sanity webhooks** — every Sanity fetch is tagged with `createCollectionTag(...)` / `createDocumentTag(...)`. The webhook at `/api/revalidate` calls `revalidateTag(tag, "max")` when content changes. Run `pnpm generate:types` after every schema or GROQ query change.
- **Explicit link prefetching** — all `<Link>` components set `prefetch={false}` to avoid unnecessary prefetch requests.

For full coding standards and conventions, see [`CLAUDE.md`](./CLAUDE.md).

---

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org) — LTS recommended
- [pnpm](https://pnpm.io) — required package manager (`npm install -g pnpm`)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/kunalkeshan/keeping-it-sou.git
cd keeping-it-sou

# 2. Install dependencies
pnpm install

# 3. Copy the environment template and fill in your values
cp .env.example .env.local

# 4. Start the development server
pnpm dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.example` to `.env.local` and set the following:

| Variable                          | Required | Description                                                      |
| --------------------------------- | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | Yes      | Your Sanity project ID                                           |
| `NEXT_PUBLIC_SANITY_DATASET`      | Yes      | Sanity dataset name (default: `production`)                      |
| `NEXT_PUBLIC_SITE_URL`            | Yes      | Canonical site URL (e.g. `https://keepingitsou.com`)             |
| `SANITY_WEBHOOK_SECRET`           | Yes      | Secret used to verify Sanity webhook signatures                  |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | No       | Google Analytics measurement ID (`G-XXXXXXXXXX`)                |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID`  | No       | Microsoft Clarity project ID                                     |
| `EFFERD_REGISTRY_TOKEN`           | No       | Required only to install new components from the Efferd registry |

> **Note:** On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is set automatically and takes priority over `NEXT_PUBLIC_SITE_URL` for the canonical URL (see `config/site.ts`).

---

## Available Scripts

| Script                | Description                                       |
| --------------------- | ------------------------------------------------- |
| `pnpm dev`            | Start development server                          |
| `pnpm build`          | Production build                                  |
| `pnpm start`          | Start production server                           |
| `pnpm lint`           | Run ESLint                                        |
| `pnpm format`         | Run Prettier on all TypeScript and JSON files     |
| `pnpm typecheck`      | TypeScript type check (no emit)                   |
| `pnpm generate:types` | Regenerate Sanity schema + TypeGen output         |

---

## Deployment

This site is deployed on [Vercel](https://vercel.com). The easiest way to deploy your own fork:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkunalkeshan%2Fkeeping-it-sou)

### Manual Vercel setup

1. Push your fork to GitHub.
2. Import the repository in the [Vercel dashboard](https://vercel.com/new).
3. Set the **Framework Preset** to `Next.js` (detected automatically).
4. Add the required environment variables under **Settings → Environment Variables**.
5. Click **Deploy**.
6. Create a Sanity webhook pointing to `https://your-domain.com/api/revalidate` with your `SANITY_WEBHOOK_SECRET` to enable on-demand ISR.

---

## Contributing

This is a personal portfolio and is primarily a **reference repository**. The codebase is open for anyone to explore, learn from, or fork for their own portfolio. Issues and pull requests are reviewed but not actively solicited.

If you spot a bug, typo, or accessibility issue, feel free to open an issue or submit a PR. For anything more significant, please open an issue first to discuss the change.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards and the pull request process.

---

## License

[MIT](./LICENSE) © Kunal Keshan

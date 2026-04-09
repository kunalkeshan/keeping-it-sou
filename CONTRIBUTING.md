# Contributing

Thanks for your interest in this project. This is a personal portfolio website for a hip-hop artist, so the scope of contributions is intentionally narrow. That said, bug fixes, typo corrections, accessibility improvements, and performance enhancements are welcome.

**Before working on a non-trivial change, please open an issue first** so we can discuss whether it's a good fit.

---

## What kinds of contributions are useful

- Bug fixes (broken layout, incorrect data, broken links)
- Typos and copy corrections
- Accessibility improvements
- Performance improvements
- Documentation corrections

## What won't be merged

- Unrelated refactors or style changes
- New dependencies added without prior discussion
- Changes to Sou's personal content (bio, photos, social links, release data — all managed via Sanity CMS)
- New features that aren't aligned with the site's purpose

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org) — LTS recommended
- [pnpm](https://pnpm.io) — required (`npm install -g pnpm`)

### Local development

```bash
git clone https://github.com/kunalkeshan/keeping-it-sou.git
cd keeping-it-sou
pnpm install
cp .env.example .env.local   # fill in values — NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SITE_URL, and SANITY_WEBHOOK_SECRET are required
pnpm dev
```

---

## Branch naming

Use a short, descriptive slug:

| Type     | Pattern                  | Example                     |
| -------- | ------------------------ | --------------------------- |
| Bug fix  | `fix/<description>`      | `fix/release-card-overflow` |
| Feature  | `feat/<description>`     | `feat/og-image`             |
| Docs     | `docs/<description>`     | `docs/update-readme`        |
| Refactor | `refactor/<description>` | `refactor/hero-section`     |

---

## Commit convention

This repo uses [Conventional Commits](https://www.conventionalcommits.org):

```
<type>: <short description>

[optional body]
```

Common types:

| Type       | When to use                             |
| ---------- | --------------------------------------- |
| `feat`     | A new feature or visible addition       |
| `fix`      | A bug fix                               |
| `refactor` | Code change with no behaviour change    |
| `docs`     | Documentation only                      |
| `style`    | Formatting, whitespace, no logic change |
| `chore`    | Tooling, config, dependency updates     |
| `perf`     | Performance improvement                 |

**Examples:**

```
fix: correct mobile nav overflow on small screens
feat: add OG image for releases page
docs: update CONTRIBUTING setup steps
```

---

## Coding standards

These are the key rules from [`CLAUDE.md`](./CLAUDE.md). Please follow them — PRs that violate these will be asked to revise.

### Package manager

Use **pnpm** only. Do not commit `package-lock.json` or `yarn.lock`.

### Before every commit

```bash
pnpm lint       # must pass with no errors
pnpm format     # auto-sorts Tailwind classes and formats code
pnpm typecheck  # must pass with no TypeScript errors
```

If your change touches Sanity schemas or GROQ queries, also run:

```bash
pnpm generate:types  # regenerate types/cms.d.ts
```

### Class merging

Always use `cn()` from `@/lib/utils` to merge Tailwind classes — never string concatenation.

```tsx
// correct
className={cn("base-class", condition && "conditional-class", className)}

// incorrect
className={`base-class ${condition ? "conditional-class" : ""}`}
```

### Link prefetching

All Next.js `<Link>` components must set `prefetch={false}`:

```tsx
<Link href="/some-path" prefetch={false}>
  Label
</Link>
```

### Social and streaming platforms

Platform icons and labels live in `lib/social-media.tsx`. Do not hardcode platform strings or icon names in components — import from that file.

### Config-driven content

The site URL lives in `config/site.ts`. Do not hardcode origins or canonical URLs in component files.

### Documentation hygiene

If your change introduces, modifies, or removes a pattern or architectural decision, update the relevant section of `CLAUDE.md` in the same PR.

---

## Pull request process

1. Fork the repo and create a branch from `main` using the naming convention above.
2. Make your changes following the coding standards.
3. Run `pnpm lint`, `pnpm format`, and `pnpm typecheck` — all must pass.
4. Open a PR against `main` with:
   - A clear title following Conventional Commits format
   - A description of what changed and why
   - A link to the related issue (if applicable)
5. A maintainer will review and may request changes. Once approved, it will be merged.

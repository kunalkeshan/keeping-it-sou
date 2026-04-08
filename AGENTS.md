# AGENTS.md

Practical execution playbook for coding agents working in this repository.

Use this with `CLAUDE.md`:
- `CLAUDE.md` defines architecture and repo conventions.
- `AGENTS.md` defines how to execute work safely and consistently.

## Operating Mode

AI-agent-first workflow with guardrails:
- Prefer explicit verification over assumptions.
- Follow existing patterns before introducing new ones.
- Keep changes scoped to the request.

## Execution Workflow

1. **Read first**
   - Inspect impacted files and related Sanity/query/config paths before editing.
   - Confirm route group and component ownership (`app/(static)`, `components/*`, `sanity/*`).
2. **Implement in small, reviewable steps**
   - Preserve existing naming and folder patterns.
   - Avoid broad refactors unless the task explicitly asks for them.
3. **Run relevant checks**
   - `pnpm lint` for touched TS/TSX logic.
   - `pnpm build` for high-risk route/config/metadata changes.
   - `pnpm generate:types` whenever schema/query changes are made.
4. **Final consistency pass**
   - Ensure docs/config/types stay in sync with code changes.

## Hard Guardrails

- Do not use destructive git operations (for example: `reset --hard`, force pushes) unless explicitly requested.
- Do not invent Sanity data shapes by hand when TypeGen types exist.
- Do not silently change architecture conventions; document them.
- Do not leave stale docs when commands/paths/workflows changed.

## Sanity-Specific Rules

- Keep Studio mounted at `/cms` and aligned with `sanity.config.ts`.
- Keep singleton behavior consistent with `sanity/structure.ts` (`siteConfig`, `faqs`).
- Tag Sanity fetches with cache tags (`collection:*`, and document tags for slug pages).
- Maintain webhook-based revalidation in `app/api/revalidate/route.ts` when adding new document types.

When adding a new Sanity type:
1. Add schema under `sanity/schemaTypes/`.
2. Add/adjust query module under `sanity/queries/`.
3. Add fetch wrapper with typed `sanityFetch<T>()`.
4. Add cache tag strategy and revalidation route handling as needed.
5. Run `pnpm generate:types`.

## Type Safety Rules

- Treat `types/cms.d.ts` as canonical for Sanity query result types.
- Import query result types from `@/types/cms`.
- Avoid `any` for Sanity query responses.

## Routing and Metadata Rules

- For new static routes, add canonical metadata.
- Keep global metadata conventions consistent with `app/layout.tsx` and `app/(static)/layout.tsx`.
- If new pages affect crawl surface, update `app/sitemap.ts` and `app/robots.ts` as needed.

## Docs Maintenance Contract

Update docs in the same PR when conventions change:
- Update `CLAUDE.md` for architecture/stack/command/convention changes.
- Update `AGENTS.md` for workflow/checklist/guardrail changes.

If uncertain, add a short clarification note in the docs instead of guessing.

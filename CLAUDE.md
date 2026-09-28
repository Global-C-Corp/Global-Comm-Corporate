# CLAUDE.md — Global Communication Corporate

## 1. Project snapshot

Corporate site for Global Comm, a Moroccan communication agency for FMCG brands.
Audience: B2B decision-makers. Goal: credible proof + one CTA (free diagnostic).

- Next.js 16 (App Router) · React 19 · Payload CMS 3.88 · TypeScript strict · pnpm
- Neon Postgres · Vercel Blob (media) · Vercel (hosting)
- Locales: `fr` (default), `en`, `es` — every public route is locale-prefixed
- Copy is French with vouvoiement unless a locale says otherwise

## 2. Commands

```bash
pnpm dev                 # local dev
pnpm typecheck           # after any code change (fast)
pnpm lint
pnpm test:unit           # fast, run the tests related to your change
pnpm test:int            # integration (Payload + DB), uses .env.test
pnpm test:contract       # MCP tool contracts
pnpm test:e2e            # Playwright incl. visual snapshots — release-level
pnpm migrate:create      # after any collection/global schema change
pnpm generate:types      # after schema changes (updates payload-types.ts)
pnpm build               # runs verify:env + migrate first — needs a DB
```

## 3. Environments and data

| Env | Database | Content source |
|---|---|---|
| Local | dev Neon branch (never production) | seed scripts / manual edits |
| Test | `.env.test` disposable DB | `scripts/seed-e2e.ts` fixtures |
| Preview (Vercel) | isolated staging branch | copy of prod content |
| Production | production Neon branch | Payload admin (humans) |

- **Edits in production Payload do not show on Preview.** They are different databases.
  If a change "doesn't appear", check which database you wrote to first.
- Real content (homepage copy, services, projects) lives in the CMS or a real seed
  (`seed.ts`, `seed-homepage.ts`) — **never only in test fixtures**.
- Test fixtures (`seed-e2e.ts`) never run against a database the public or preview site reads.
- Env vars: see `.env.example`. `DATABASE_URI` in `.env` must never be the production URI.

## 4. Hard rules

These prevent real damage. Everything else in this file is a default.

1. **No invented facts.** No fake clients, projects, metrics or testimonials on public pages.
   Missing data stays empty — a blank is honest, a made-up number is not.
2. **AI never publishes, approves or deletes content.** A human publishes.
3. **Public pages show published content only.** No draft leaks, no fallback to another locale.
4. **Fail loudly.** No silent catches, no placeholder text ("Lorem ipsum", "Your headline here").
5. **Ask first** before: destructive migrations, dropping data, force-push, deleting files you
   don't understand, merging to `main`, or Next/Payload major upgrades.
6. Payload is the only CMS. No WordPress, second backend or second database.

## 5. Architecture map

```
src/
├── app/
│   ├── (frontend)/[locale]/   public site (routing only)
│   ├── (frontend)/preview/    draft preview
│   ├── (payload)/             Payload admin + API
│   ├── (design)/              design experiments, not public
│   └── sitemap.ts, robots.ts
├── collections/               Projects, Clients, Services, Industries, Testimonials, Media, Users…
├── globals/                   HomePage, ServicesPage, WorkPage, CompanyPage, ContactPage, Navigation, SiteSettings
├── access/                    role-based access control
├── services/cms/              data access — pages read the CMS through here
├── services/seo/              canonicals, hreflang, metadata
├── hooks/revalidate.ts        cache invalidation on publish
├── i18n/                      locale config + UI dictionaries
├── mcp/                       AI editorial tools (draft-only)
├── components/                ui/ (shadcn), layout/, blocks/, feature folders
└── middleware.ts              locale redirects
```

Full reference spec (SEO, canonicals, editorial workflow, MCP tools): `docs/SPEC.md`.
Do not read it whole — `grep -n "^# " docs/SPEC.md` and read the section you need.

## 6. Next.js conventions

- Server Components by default; `"use client"` only on interactive leaves.
- Read CMS data server-side via the Payload Local API in `services/cms/` — not API routes, not `useEffect`.
- Caching: `revalidateTag()` on publish **plus** a time-based fallback (`revalidate`) so a failed
  invalidation can't freeze a page. Log invalidation failures.
- Server Actions (contact form): Zod validation, spam protection, sanitized errors.
- `next/image` with dimensions; parallel fetches with `Promise.all`.
- This Next.js version differs from training data — check `node_modules/next/dist/docs/` for APIs you're unsure about.

## 7. Definition of done (scales with the change)

| Change | Verify with |
|---|---|
| Copy, styling | `pnpm typecheck` |
| Component / logic | + related `test:unit` |
| Schema, access control, SEO, caching | + `test:int`, migration, `generate:types` |
| Release to production | full `pnpm test` + re-approve visual snapshots |

Report what you changed and which commands you actually ran. Never claim a run that didn't happen.

## 8. Working style

- Do the task directly. No mandatory audit phase or phase reports.
- Understand code before deleting it; keep what works.
- Fix bugs at the root cause; never delete a test to get green.
- If a default blocks the task, pick the sensible option, say why in one line, continue.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

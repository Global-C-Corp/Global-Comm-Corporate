# CLAUDE.md — Global Communication Corporate

## 1. Project snapshot

Corporate site for Global Comm, a Moroccan communication agency for FMCG brands.
Audience: B2B decision-makers. Goal: credible proof + one CTA (free diagnostic).

- Next.js 16 (App Router) · React 19 · Payload CMS 3.88 · TypeScript strict · pnpm
- Neon Postgres · Vercel Blob (media) · Vercel (hosting)
- The public site is **single-language French** and **unprefixed**. Payload still
  stores `fr` / `en` / `es`; no public route reads the other two (see §6).
- Copy is French with vouvoiement

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
pnpm build               # runs verify:env + migrate first — needs a DB.
                         # Every deploy therefore applies pending DB schema changes
                         # to the database that environment points at.
```

## 3. Environments and data

| Env | Database | Content source |
|---|---|---|
| Local | dev Neon branch (never production) | seed scripts / manual edits |
| Test | `.env.test` disposable DB | `scripts/seed-e2e.ts` fixtures |
| Preview (Vercel) | isolated staging branch | copy of prod content |
| Production | production Neon branch | Payload admin (humans) |

- **Until `globalcomm.ma` launches:** edit and check content on the production URL
  (`global-comm-corporate-three.vercel.app/admin` → `/fr/...`). Preview is for code changes only.
- **Edits in production Payload do not show on Preview.** They are different databases.
  If a change "doesn't appear", check which database you wrote to first.
- Real content (homepage copy, services, projects) lives in the CMS or a real seed
  (`seed.ts`, `seed-homepage.ts`) — **never only in test fixtures**.
- Test fixtures (`seed-e2e.ts`) never run against a database the public or preview site reads.
- Env vars: see `.env.example`. `DATABASE_URI` in `.env` must never be the production URI.

## 4. Hard rules

These prevent real damage. Everything else in this file is a default.

1. **No invented facts.** No fake clients, projects or testimonials on public pages.
   Metrics: a **measured** value needs a source. An **estimate** or **target** needs none,
   but must be saved with that kind so the page labels it ("Estimation" / "Objectif").
   Never present an estimate as a measured result.
2. **AI editor rights** (owner decision 2026-09-28): the AI may draft, edit any content
   field, approve and publish. It never deletes content, creates taxonomy or reads
   contact inquiries. Every AI write records provenance and an audit log entry.
3. **Public pages show published content only.** No draft leaks, no fallback to another locale.
4. **Fail loudly.** No silent catches, no placeholder text ("Lorem ipsum", "Your headline here").
5. **Ask first** before: destructive migrations, dropping data, force-push, deleting files you
   don't understand, merging to `main`, or Next/Payload major upgrades.
6. Payload is the only CMS. No WordPress, second backend or second database.

## 5. Where content lives

Two sources, and the line between them is the point:

| | Source of truth | Changed by |
|---|---|---|
| Corporate page copy, navigation, the four services, site identity | `src/content/`, `src/config/` — **code** | a pull request |
| Case studies, clients, testimonials, industries, media, inquiries | **Payload** | an editor or the AI tools |

A corporate page is a deploy-time decision, so it ships with the code and is
reviewable in a diff. Proof is a content decision that must not need a deploy,
so it stays in the CMS. The page globals (`home-page`, `services-page`, …) and
`navigation` are still registered in Payload, but no public route reads them.

### Public routes

`/` → 308 → `/home` · `/home` · `/company` · `/services` ·
`/services/[slug]` (exactly four) · `/work` · `/work/[slug]` · `/contact`

No locale prefix. `src/proxy.ts` permanently redirects every URL the site
published under `/fr`, `/en` or `/es`, including the pre-consolidation service
slugs.

### Architecture map

```
src/
├── app/
│   ├── (frontend)/            public site (routing only)
│   ├── (frontend)/preview/    draft preview — projects only
│   ├── (payload)/             Payload admin + API
│   ├── (design)/              design experiments, not public
│   └── sitemap.ts, robots.ts
├── content/                   page copy — home, company, services, work, contact, ui
├── config/                    site identity + navigation
├── collections/               Projects, Clients, Services, Industries, Testimonials, Media, Users…
├── globals/                   registered but not read by any public route
├── access/                    role-based access control
├── services/cms/              data access — pages read the CMS through here
├── services/seo/              canonicals, metadata, sitemap entries
├── hooks/revalidate.ts        cache invalidation on publish
├── i18n/                      locale config (Payload-side)
├── mcp/                       AI editorial tools (draft, edit, publish)
├── components/                ui/ (shadcn), layout/, blocks/, feature folders
└── proxy.ts                   legacy locale-prefixed URL redirects
```

Full reference spec (SEO, canonicals, editorial workflow, MCP tools): `docs/SPEC.md`.
Do not read it whole — `grep -n "^# " docs/SPEC.md` and read the section you need.

## 6. Languages

The public site serves French only, at unprefixed URLs. There are no hreflang
alternates and no language switcher; each page is its own canonical.

Payload has not changed: fields are still localized, `en` and `es` rows still
exist, and the per-locale approval rules still gate publishing. The frontend
simply pins every query to `fr` (`src/services/cms/pageContext.ts`).

- Never show one language's content under another language's URL. No fallback.
- Localized fields (translated): titles, descriptions, SEO, slugs.
- Shared fields (same in all languages): client names, dates, logos, prices, media.
- To add a language back: `src/content/*` becomes `Record<Locale, …>`, and the
  route segment returns. The content shapes are already flat enough for that.
- **Before touching publishing or slugs, read `docs/SPEC.md` §10–20.**
  Code: `src/i18n/`, `src/proxy.ts`.

## 7. Next.js conventions

- Server Components by default; `"use client"` only on interactive leaves.
- Read CMS data server-side via the Payload Local API in `services/cms/` — not API routes, not `useEffect`.
- Caching: publishing calls `revalidatePath()` for the affected routes (`src/hooks/revalidate.ts`).
  A time-based page fallback (`revalidate`) is planned but **not on `main` yet** — only the sitemap
  has one. Until it lands, a failed invalidation can leave a page stale: log failures, never swallow them.
- Server Actions (contact form): Zod validation, spam protection, sanitized errors.
- `next/image` with dimensions; parallel fetches with `Promise.all`.
- This Next.js version differs from training data — check `node_modules/next/dist/docs/` for APIs you're unsure about.

## 8. Definition of done (scales with the change)

| Change | Verify with |
|---|---|
| Copy, styling | `pnpm typecheck` |
| Component / logic | + related `test:unit` |
| Schema, access control, SEO, caching | + `test:int`, migration, `generate:types` |
| Release to production | full `pnpm test` + re-approve visual snapshots |

Report what you changed and which commands you actually ran. Never claim a run that didn't happen.

### System invariants (the site's constitution — tests guard these)

```text
PAYLOAD_IS_SOURCE_OF_TRUTH_FOR_PROOF = true   # projects, clients, testimonials
CORPORATE_PAGE_COPY_LIVES_IN_SOURCE  = true   # src/content, src/config
PUBLIC_CONTENT_IS_PUBLISHED_ONLY     = true
PUBLIC_SITE_IS_SINGLE_LANGUAGE       = true
PUBLIC_URLS_CARRY_NO_LOCALE_PREFIX   = true
PUBLIC_LOCALE_FALLBACK               = false
AI_CAN_PUBLISH / APPROVE             = true
AI_CAN_DELETE                        = false
AI_CAN_MANAGE_USERS / CREATE_TAXONOMY = false
AI_CAN_READ_INQUIRIES                = false
AI_WRITES_ARE_AUDITED                = true
MEASURED_METRICS_REQUIRE_SOURCE      = true
ESTIMATES_AND_TARGETS_ARE_LABELLED   = true
AI_TESTIMONIALS_REQUIRE_SOURCE       = true
PAGES_SELF_CANONICALIZE              = true
PUBLISHED_URLS_KEEP_WORKING           = true   # src/proxy.ts
SITEMAP_CONTAINS_CANONICAL_URLS_ONLY = true
TEST_DATA_IN_PUBLIC_OR_PREVIEW_DB    = false
```

If a change would break one of these, stop and ask. Full list: `docs/SPEC.md` §138
(the SPEC still describes the older draft-only AI; this file wins on AI rights and metrics).

## 9. Working style

- Do the task directly. No mandatory audit phase or phase reports.
- Understand code before deleting it; keep what works.
- Fix bugs at the root cause; never delete a test to get green.
- If a default blocks the task, pick the sensible option, say why in one line, continue.

<!-- BEGIN:nextjs-agent-rules -->

## 10. Coding standards

### Empty states (SPEC §139)

No testimonials:

```text
hide section
```

No related work:

```text
hide section
```

No Client logo:

```text
show Client name
```

No Project image:

```text
use intentional typography
```

No metric:

```text
hide metric
```

No OG image:

```text
use defined fallback
```

No translation:

```text
do not fabricate fallback page
```


### Coding standard (SPEC §140)

TypeScript:

```text
strict
generated Payload types
minimal any
no casual ts-ignore
```

React:

```text
server-first
composition
clear props
```

Payload:

```text
modular configs
central access controls
small hooks
domain services for business logic
```

CSS:

```text
tokens
responsive
controlled specificity
```


### Dependency discipline (SPEC §141)

Before installing:

```text
Does Next/Payload already solve this?

Is package maintained?

Does it reduce complexity?

Does it add browser weight?

Can a small internal utility solve it?
```

Avoid dependency inflation.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

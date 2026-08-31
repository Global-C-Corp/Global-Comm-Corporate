# Global Communication Corporate™

Multilingual corporate platform: one Next.js + Payload application serving the
public site (fr / en / es), the CMS, and an MCP control plane that lets Claude
and ChatGPT act as **editorial operators — never publishers**.

`CLAUDE.md` is the canonical specification for this repository. Where this
README and `CLAUDE.md` disagree, `CLAUDE.md` wins.

---

## Stack

| Concern | Choice |
| --- | --- |
| Frontend | Next.js 16 App Router, Server Components by default |
| CMS | Payload 3.88 (Local API, drafts, versions, access control) |
| Database | PostgreSQL via `@payloadcms/db-postgres` (Neon or compatible) |
| Media | Persistent object storage (Vercel Blob in production) |
| AI ↔ CMS | Payload MCP plugin at `/api/mcp`, bearer API keys |
| Tests | Vitest (unit / integration / contract), Playwright (E2E) |
| Deployment | Vercel |

---

## Getting started

```bash
pnpm install
cp .env.example .env          # then fill in the values
pnpm run verify:env
pnpm run migrate              # create the schema
pnpm run seed                 # controlled vocabulary + site defaults, as drafts
pnpm dev
```

- Public site: <http://localhost:3000/fr>
- Admin: <http://localhost:3000/admin>

Create the first admin user by setting `SEED_ADMIN_EMAIL` and
`SEED_ADMIN_PASSWORD` before running `pnpm run seed`, or through the Payload
admin sign-up screen on a fresh database.

`pnpm run seed` writes **drafts**. Publishing is a human act. For a local or
CI environment that needs public content (for example to run the E2E suite),
run `pnpm run seed -- --publish`.

---

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run lint` | ESLint (flat config) |
| `pnpm run verify:env` | Environment validation |
| `pnpm run migrate` / `migrate:create` / `migrate:status` | Database migrations |
| `pnpm run seed` | Idempotent vocabulary + globals seed |
| `pnpm run content:health` | Content completeness report |
| `pnpm run launch:report` | What is blocking launch, per document × locale |
| `pnpm run test:unit` / `test:int` / `test:contract` / `test:e2e` | Test suites |
| `pnpm run generate:types` | Regenerate `src/payload-types.ts` |

---

## Architecture

```
src/
  app/(frontend)/[locale]/…   public site — one route tree, three locales
  app/(payload)/…             admin + Payload REST/GraphQL/MCP endpoints
  collections/ globals/       content model
  access/                     roles, predicates, editorial state machine
  hooks/                      publish guard, revalidation
  fields/                     shared field factories (SEO, editorial, slug)
  services/cms/               all request-facing Payload queries
  services/seo/               route builder, canonical, hreflang, metadata
  services/content-ops/       the only path by which AI writes content
  services/inquiries/         contact form handling
  mcp/tools/                  thin MCP handlers over content-ops
  i18n/                       locales, dictionaries, terminology glossary
```

### Editorial workflow

```
AI draft ──► needs_review ──► approved ──► published
   ▲              │                          ▲
   └── revision_requested ◄──────────────────┘
        (AI and editors may draft and submit; only publisher/admin
         approve, and only publisher/admin publish)
```

Publishing requires **all** of: an actor with the `publisher` or `admin` role,
`reviewStatus === 'approved'`, and every locale in `dirtyLocales` approved.
This is enforced in a `beforeChange` hook, so it holds for the Admin UI, REST,
GraphQL, the Local API and MCP alike — UI restrictions alone are not relied on.

**To publish in Payload Admin**: the publish control lists any unmet
condition — the editorial stage, and each edited locale whose translation is
not approved. If your role can satisfy them, **Approve and publish** does all
of it in one confirmed action, naming exactly what it will change. If it
cannot, it says who does it next.

Doing it by hand works too: set **Editorial stage** to Approved, set each
locale under **Translation approval** to Approved, then Publish.

Either way the server decides. A publish that arrives without those
preconditions — from the API, an MCP tool, or a browser with JavaScript
disabled — is refused, and the error names the condition that blocked it.
A locale you never translated stays unapproved on purpose: it does not
render, rather than falling back to another language.

**For a launch**, `pnpm run launch:report` lists every document × locale with
what is blocking it (`--blocked-by=review|translation|unpublished`, `--json`).
Adding `--as=<email> --approve-and-publish` runs the same guard per document
and reports each result, so a partial failure is visible:

```
✓ clients #8 — Acme rebrand
✗ clients #5 — Northwind — The following field is invalid: Source References 1 > Type
8 published, 1 refused.
```

### Localization

- One document per entity with field-level localization (fr / en / es).
- Public reads always use `fallbackLocale: false`: a missing Spanish
  translation renders no Spanish page, never French content on a Spanish URL.
- A locale is public only when the document is published **and** that locale's
  `translationStatus` is `approved` — centralized in `isLocalePublic()`.
- Slugs are localized; the language switcher resolves the equivalent entity's
  slug and never links to an unavailable translation.

### SEO

One route builder (`src/services/seo/urls.ts`) feeds canonical URLs, hreflang,
the language switcher, the sitemap, internal links, OG URLs and redirects.
Every indexable page is self-canonical on `https://globalcomm.ma`; tracking
parameters are stripped; `og:url` equals the canonical URL; hreflang is emitted
only for publicly approved translations; non-production deployments are
`noindex`.

---

## AI / MCP

The MCP endpoint is `/api/mcp`, authenticated with `Authorization: Bearer <key>`.
Keys are managed in Payload Admin and are bound to a user — create one with the
`ai_editor` role.

**Reads**: generic `find` on editorial collections and page globals.
**Writes**: only through these tools, each backed by `src/services/content-ops`:

`draftClient` · `draftProject` · `draftTestimonial` · `classifyProject` ·
`translateContent` · `prepareSEO` · `auditContent` · `submitForReview`

Every AI write is forced to a draft, stamped with provenance, checked against
a field whitelist, and appended to the immutable `ai-audit-logs` collection.

AI can never publish, approve, delete, create or rename taxonomy, manage users
or keys, read inquiries, or set a canonical override. Unknown taxonomy terms
become `taxonomySuggestions` for a human. A metric without a source is dropped
rather than estimated, and a testimonial requires a source and attribution with
its original wording preserved.

`translateContent` takes the translated strings from the MCP client — the
server does not call a model. Its job is to enforce which fields may be
translated, normalize approved terminology, preserve shared facts, and mark the
target locale as an AI draft awaiting review.

---

## Preview

`/preview?secret=…&collection=…&slug=…&locale=…` enables Next.js Draft Mode.
It requires **both** the `PREVIEW_SECRET` and an authenticated Payload user, so
a leaked link alone exposes nothing. Preview responses are always `noindex`.
Payload's preview button and Live Preview are wired for the three localized
collections and the five page globals.

---

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Testing

```bash
pnpm run test:unit       # pure logic — no database
pnpm run test:int        # access control + localization against Postgres
pnpm run test:contract   # the eight AI tools and their guarantees
pnpm run test:e2e        # Playwright against a running site
```

Integration, contract and E2E suites need a database; they read `.env.test`
first, then `.env`. The E2E suite expects published content
(`pnpm run seed -- --publish`).

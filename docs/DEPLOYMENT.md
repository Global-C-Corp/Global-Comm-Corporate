# Deployment

Covers CLAUDE.md §8, §88-§91, §134-§137.

## Environments

| Environment | Database | Notes |
| --- | --- | --- |
| Local | Local Postgres or a Neon dev branch | `.env` |
| Test | Disposable database | `.env.test`, dropped and re-migrated freely |
| Preview / staging | Staging database or a Neon branch | Never production data |
| Production | Production database | Migrations run under a deployment lock |

Pull-request deployments must never point at the production database.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URI` | yes | Postgres connection string (TLS in production) |
| `PAYLOAD_SECRET` | yes | Signs Payload sessions/tokens; long and random |
| `NEXT_PUBLIC_SERVER_URL` | yes | Absolute URL this deployment serves from |
| `PREVIEW_SECRET` | yes | Required to enter Draft Mode |
| `BLOB_READ_WRITE_TOKEN` | production | Vercel Blob token for media |
| `MCP_ENABLED` | no | `true` enables the MCP control plane |
| `SENTRY_DSN` | no | Error monitoring |

`pnpm run verify:env` validates these and fails the build early. It also fails
if a secret-looking value is exposed through a `NEXT_PUBLIC_*` variable.

The public canonical host (`https://globalcomm.ma`) is a constant in
`src/services/seo/urls.ts`, not an environment variable, so a preview
deployment can never canonicalize to itself.

## First deployment

1. Provision Postgres (Neon or compatible) and copy the pooled connection
   string into `DATABASE_URI`.
2. Create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`.
3. Set the remaining environment variables in the Vercel project.
4. Run `pnpm run migrate` against the target database.
5. Deploy.
6. Create the first admin user, then `pnpm run seed` to load the controlled
   vocabulary and site defaults as drafts.
7. Review and publish the seeded content in Payload Admin.

## Release procedure

```
Approved PR
  → merge
  → acquire the migration/deployment lock
  → pnpm run verify:env
  → pnpm run migrate
  → pnpm run migrate:status   (verify)
  → deploy
  → production smoke tests
  → release
```

Preview builds never run production migrations. Schema changes are always
committed as migrations (`pnpm run migrate:create <name>`); uncontrolled schema
push against production is not used.

Note: running `pnpm dev` marks a database as dev-pushed, after which
`pnpm run migrate` will warn about data loss. Keep development databases
separate from anything that matters.

## Media storage

Production uses persistent object storage — never the deployment filesystem.
Vercel Blob is the starting adapter; the Media collection carries no
adapter-specific fields, so moving to S3 or Cloudflare R2 is a config change.
Uploads are restricted by MIME type and generate the image variants the
frontend requests by name (`logo`, `thumbnail`, `projectCard`,
`projectFeature`, `hero`, `openGraph`, `portrait`).

## MCP keys

Create one Payload user with the `ai_editor` role, then issue separate API keys
per client and environment (Claude Production, Claude Staging, ChatGPT
Production) so a key can be revoked in isolation. Keys are stored hashed by the
plugin and never appear in audit logs.

## Release checklist

- [ ] Environment variables set for the target environment
- [ ] Database reachable over TLS; migrations applied (`migrate:status` clean)
- [ ] Object storage working; a test upload renders on the site
- [ ] Payload Admin loads and login works
- [ ] fr / en / es home, services, service detail, work, project detail,
      industry, company and contact all render
- [ ] Canonicals self-referential on the production host; hreflang reciprocal
- [ ] `sitemap.xml` contains only canonical, approved URLs
- [ ] `robots.txt` allows indexing on production and disallows elsewhere
- [ ] Redirect records resolve
- [ ] Drafts invisible anonymously; preview requires secret + login
- [ ] Invalid MCP key rejected; AI draft succeeds; AI publish/delete/taxonomy
      creation all rejected
- [ ] Contact form stores an inquiry and is not readable by AI
- [ ] Mobile navigation and keyboard traversal work
- [ ] No critical console errors

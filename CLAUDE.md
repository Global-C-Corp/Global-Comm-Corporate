# CLAUDE.md — Global Communication Corporate

Corporate site for Global Comm (Moroccan FMCG communication agency).
Stack: Next.js (App Router) + Payload CMS + PostgreSQL + Vercel, TypeScript strict, pnpm.

The full architecture spec lives in `docs/SPEC.md` (~4,600 lines).
**Do not read it all.** Grep it for the section relevant to your task
(e.g. `grep -n "^# " docs/SPEC.md`, then read that section).

---

## Hard rules (the only non-negotiables)

1. **No WordPress / WPGraphQL / other CMS / second backend.** Payload is the only content source.
2. **AI never publishes, approves, deletes, manages users, or creates taxonomy.** The human publishes.
3. **Public pages show published content only.** No draft leaks, no locale fallback (fr, en, es).
4. **Never connect previews or PRs to the production database.** No secrets in code or logs.
5. **Ask before destructive actions:** dropping tables, destructive migrations, force-push, deleting files you don't understand, major framework upgrades.

Everything else is a default, not a law. If a default blocks the task, pick the
sensible option, say why in one line, and continue.

## Defaults

- Server Components by default; fetch CMS data server-side via Payload Local API.
- Schema change → create a migration (`pnpm migrate:create`), never edit the DB by hand.
- Don't add dependencies without a reason; don't upgrade Next/Payload incidentally.
- Canonicals: https, production host, self-canonical per locale, no tracking params (details: SPEC §46–59).
- Fix bugs at the root cause; don't delete tests to get green.

## Commands

```bash
pnpm dev              # local dev
pnpm typecheck        # fast check — run after code changes
pnpm lint
pnpm test:unit        # fast; run the suite related to what you changed
pnpm test:int / test:contract / test:e2e   # run when touching those areas
pnpm build            # runs verify:env + migrate first; needs a DB
pnpm generate:types   # after Payload schema changes
```

Verification scales with the change: a copy/style edit needs typecheck at most;
a schema or access-control change needs the related tests. The full `pnpm test`
is for pre-release, not every edit.

## Working style

- Just do the task. No mandatory audit phase, no phase reports, no reading the whole repo first.
- Keep useful existing code; understand before deleting.
- Report what changed and what you ran. Never claim a command ran if it didn't.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

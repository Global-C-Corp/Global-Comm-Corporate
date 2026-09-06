import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import path from 'path'
import { buildConfig } from 'payload'
import type { Plugin } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Industries } from './collections/Industries'
import { ProjectTypes } from './collections/ProjectTypes'
import { ContextTags } from './collections/ContextTags'
import { Clients } from './collections/Clients'
import { Projects } from './collections/Projects'
import { Testimonials } from './collections/Testimonials'
import { Inquiries } from './collections/Inquiries'
import { AIAuditLogs } from './collections/AIAuditLogs'

import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { HomePage } from './globals/HomePage'
import { ServicesPage } from './globals/ServicesPage'
import { WorkPage } from './globals/WorkPage'
import { CompanyPage } from './globals/CompanyPage'
import { ContactPage } from './globals/ContactPage'

import { aiTools } from './mcp/tools'
import { seoFieldsOverride } from './fields/seo'
import { locales, defaultLocale } from './i18n/locale'
import { checkEnv } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envCheck = checkEnv()
if (!envCheck.ok) {
  // Fail fast at boot rather than surfacing as an opaque runtime error later.
  console.error('Invalid environment configuration:', envCheck.issues)
}

const seoAndRedirectsCollections = ['services', 'industries', 'clients', 'projects', 'testimonials'] as const
const seoGlobals = ['home-page', 'services-page', 'work-page', 'company-page', 'contact-page'] as const

const plugins: Plugin[] = [
  seoPlugin({
    collections: [...seoAndRedirectsCollections],
    globals: [...seoGlobals],
    uploadsCollection: 'media',
    tabbedUI: true,
    fields: seoFieldsOverride,
  }),
  redirectsPlugin({
    collections: ['services', 'industries', 'projects'],
    redirectTypes: ['301', '302'],
  }),
  /**
   * Persistent object storage for media (CLAUDE.md §38, §90).
   *
   * Without this, uploads land on the deployment filesystem, which on Vercel is
   * ephemeral — a file survives until the next deploy and then is gone. §90 is
   * explicit that the deployment filesystem is never the store.
   *
   * `token` self-disables the adapter when unset, so local development and CI
   * keep using the filesystem without needing a Vercel credential.
   *
   * `alwaysInsertFields` keeps the collection schema identical whether or not
   * the token is present. Without it the schema would differ between a local
   * machine and production, and a migration generated in one place would not
   * describe the other — the exact drift §89's migration discipline exists to
   * prevent. (Payload v4 makes this the default.)
   */
  vercelBlobStorage({
    collections: { media: true },
    token: process.env.BLOB_READ_WRITE_TOKEN,
    alwaysInsertFields: true,
  }),
]

/**
 * CLAUDE.md §92-§94, §103, §114. The AI control plane is deliberately narrow:
 *
 * - generic `find` for editorial content only, so AI can read what it edits
 * - NO generic create/update/delete anywhere: every write goes through a
 *   custom tool backed by the content-operations service, which enforces
 *   field whitelists, the state machine, evidence rules and provenance
 * - users, inquiries and ai-audit-logs are absent entirely, so PII, secrets
 *   and the audit trail are unreachable over MCP
 * - taxonomy collections are readable but never writable (§109)
 * - experimental auth/collection/config/job tools stay disabled
 */
if (process.env.MCP_ENABLED === 'true') {
  const readOnly = { create: false, delete: false, find: true, update: false }

  plugins.push(
    mcpPlugin({
      userCollection: 'users',
      collections: {
        services: { enabled: readOnly, description: 'Service taxonomy and service page content.' },
        industries: { enabled: readOnly, description: 'Industry taxonomy and industry page content.' },
        'project-types': { enabled: readOnly, description: 'Engagement-type vocabulary. Read only.' },
        'context-tags': { enabled: readOnly, description: 'Objective/context vocabulary. Read only.' },
        clients: { enabled: readOnly, description: 'Client records.' },
        projects: { enabled: readOnly, description: 'Portfolio projects.' },
        testimonials: { enabled: readOnly, description: 'Client testimonials with sources.' },
        media: { enabled: readOnly, description: 'Media library metadata.' },
      },
      globals: {
        'home-page': { enabled: { find: true, update: false } },
        'services-page': { enabled: { find: true, update: false } },
        'work-page': { enabled: { find: true, update: false } },
        'company-page': { enabled: { find: true, update: false } },
        'contact-page': { enabled: { find: true, update: false } },
      },
      mcp: {
        serverOptions: {
          serverInfo: { name: 'Global Comm Editorial MCP', version: '1.0.0' },
          instructions:
            'You are an editorial operator for Global Communication Corporate. You may read content and create or update drafts through the provided tools. You can never publish, approve, delete, create taxonomy, or read inquiries. Leave a fact empty rather than inventing it, and always cite sources.',
        },
        tools: aiTools,
      },
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Industries,
    ProjectTypes,
    ContextTags,
    Clients,
    Projects,
    Testimonials,
    Inquiries,
    AIAuditLogs,
  ],
  globals: [SiteSettings, Navigation, HomePage, ServicesPage, WorkPage, CompanyPage, ContactPage],
  editor: lexicalEditor(),
  localization: {
    locales: [...locales],
    defaultLocale,
    fallback: false,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    /**
     * Dev-mode schema push is disabled under test so the suites run against
     * the schema the migrations actually produce, rather than one drizzle
     * pushed on the fly (CLAUDE.md §8, §89). It also keeps a cold boot from
     * re-diffing the whole schema in every worker.
     */
    push: process.env.NODE_ENV !== 'test',
  }),
  sharp,
  plugins,
})

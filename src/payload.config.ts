import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
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
  }),
]

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
  }),
  sharp,
  plugins,
})

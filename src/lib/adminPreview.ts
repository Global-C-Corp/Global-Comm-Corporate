import type { CollectionConfig, GlobalConfig } from 'payload'
import { locales } from '@/i18n/locale'
import { buildPreviewURL } from './preview'

const serverURL = () => process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const previewSecret = () => process.env.PREVIEW_SECRET ?? ''

type DocLike = { slug?: unknown }

/** Preview + Live Preview wiring for a collection (CLAUDE.md §87, §152). */
export function collectionPreview(collection: string): NonNullable<CollectionConfig['admin']> {
  return {
    preview: (doc: DocLike, { locale }: { locale?: string }) =>
      buildPreviewURL({
        collection,
        slug: typeof doc?.slug === 'string' ? doc.slug : undefined,
        locale: locale ?? locales[0],
        serverURL: serverURL(),
        secret: previewSecret(),
      }),
    livePreview: {
      url: ({ data, locale }: { data: DocLike; locale?: { code: string } | string }) =>
        buildPreviewURL({
          collection,
          slug: typeof data?.slug === 'string' ? data.slug : undefined,
          locale: typeof locale === 'string' ? locale : (locale?.code ?? locales[0]),
          serverURL: serverURL(),
          secret: previewSecret(),
        }),
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  }
}

/** Same for a page global, whose route carries no slug. */
export function globalPreview(globalSlug: string): NonNullable<GlobalConfig['admin']> {
  return {
    preview: (_doc: unknown, { locale }: { locale?: string }) =>
      buildPreviewURL({
        collection: globalSlug,
        locale: locale ?? locales[0],
        serverURL: serverURL(),
        secret: previewSecret(),
      }),
    livePreview: {
      url: ({ locale }: { locale?: { code: string } | string }) =>
        buildPreviewURL({
          collection: globalSlug,
          locale: typeof locale === 'string' ? locale : (locale?.code ?? locales[0]),
          serverURL: serverURL(),
          secret: previewSecret(),
        }),
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  }
}

import type { Locale } from '@/i18n/locale'

/** Draft Mode is always visible and always exitable (CLAUDE.md §87). */
export function PreviewBanner({ locale }: { locale: Locale }) {
  return (
    <div className="gc-preview-banner">
      <span>Preview mode — {locale.toUpperCase()} — unpublished content is visible</span>
      <a href={`/preview/exit?locale=${locale}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
        Exit preview
      </a>
    </div>
  )
}

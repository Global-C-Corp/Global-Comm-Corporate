import type { Locale } from '@/i18n/locale'

/** Draft Mode is always visible and always exitable (CLAUDE.md §87). */
export function PreviewBanner({ locale }: { locale: Locale }) {
  return (
    <div className="gc-tw flex flex-wrap items-center justify-between gap-4 bg-primary px-6 py-3 text-sm text-primary-foreground">
      <span>Preview mode — {locale.toUpperCase()} — unpublished content is visible</span>
      <a href={`/preview/exit?locale=${locale}`} className="underline underline-offset-4">
        Exit preview
      </a>
    </div>
  )
}

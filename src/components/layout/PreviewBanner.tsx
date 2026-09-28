export function PreviewBanner() {
  return (
    <div className="gc-tw flex flex-wrap items-center justify-between gap-4 bg-primary px-6 py-3 text-sm text-primary-foreground">
      <span>Preview mode — unpublished content is visible</span>
      <a href="/preview/exit" className="underline underline-offset-4">
        Exit preview
      </a>
    </div>
  )
}

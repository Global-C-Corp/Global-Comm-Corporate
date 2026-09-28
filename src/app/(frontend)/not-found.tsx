import Link from 'next/link'
import { ui } from '@/content/ui'
import { buildPath } from '@/services/seo/urls'

export default function NotFound() {
  return (
    <main id="main" className="gc-tw mx-auto w-full max-w-[76rem] px-6 py-24 md:px-10 md:py-32">
      <h1>{ui.notFound.title}</h1>
      <p className="mt-6 max-w-[62ch] text-lg text-foreground">{ui.notFound.body}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href={buildPath({ type: 'home' })}
        >
          {ui.notFound.backHome}
        </Link>
      </div>
    </main>
  )
}

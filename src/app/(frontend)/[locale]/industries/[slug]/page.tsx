import { redirectOrNotFound } from '@/lib/routing'
import { getPageContext } from '@/services/cms/pageContext'
import { buildPath } from '@/services/seo/urls'

/**
 * Industries no longer have public pages. The taxonomy is unchanged — terms
 * still classify projects and drive the `?industry=` filter on /work — but the
 * detail template is gone (CLAUDE.md §29, and this replaces §72/§79).
 *
 * The route file itself is kept deliberately. Deleting it would let Next match
 * nothing and return a bare 404, which would strand the 39 redirect records
 * covering these URLs; the whole point of generating them is that these paths
 * keep their equity. This module renders nothing: it only consults Payload for
 * a redirect and 404s when there is none, so an unknown slug still 404s.
 */
export default async function IndustryRedirectRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const { ctx } = await getPageContext(locale)

  return redirectOrNotFound(buildPath(ctx.locale, { type: 'industry', slug }), ctx.locale)
}

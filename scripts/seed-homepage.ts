import 'dotenv/config'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '../src/payload.config'
import { locales, type Locale } from '../src/i18n/locale'
import { pillarKeyForFrSlug } from '../src/services/cms/pillarConfig'
import {
  approachCopy,
  closingCopy,
  faqCopy,
  heroCopy,
  positioningCopy,
  proofCopy,
  servicesCopy,
  workCopy,
} from './homepage-content'

/**
 * Seeds the approved homepage copy into the home-page global, one locale at a
 * time (CLAUDE.md §41, §73-§74).
 *
 * Idempotent: it writes the same values every run, so re-running after an edit
 * restores the approved copy rather than duplicating anything.
 *
 * Only copy is written. Client logos, testimonials, projects and results are
 * relationships resolved at render time, so this script cannot manufacture
 * proof that does not exist (§105, §126).
 *
 * Dry run by default. Pass --apply to write.
 */

const APPLY = process.argv.includes('--apply')

type AdminActor = { id: number; email: string; role: 'admin'; collection: 'users' }

async function resolveActor(payload: Payload): Promise<AdminActor> {
  const admins = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const existing = admins.docs[0]
  if (existing) return { id: existing.id, email: existing.email, role: 'admin', collection: 'users' }
  return { id: 0, email: 'seed-homepage@local', role: 'admin', collection: 'users' }
}

const list = (values: string[]) => values.map((value) => ({ value }))

async function main() {
  const payload = await getPayload({ config })
  const actor = await resolveActor(payload)

  // The service cards link to the four pillars, resolved by their config key so
  // the link survives the slug rename.
  const services = await payload.find({
    collection: 'services',
    locale: 'fr',
    fallbackLocale: false,
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  const pillarIdByKey = new Map<string, number>()
  for (const doc of services.docs) {
    if (!doc.isPillar) continue
    const key = pillarKeyForFrSlug(String(doc.slug ?? ''))
    if (key) pillarIdByKey.set(key, Number(doc.id))
  }

  const missing = servicesCopy.items.filter((item) => !pillarIdByKey.has(item.pillarKey))
  if (missing.length > 0) {
    throw new Error(
      `Cannot link the services section: no pillar found for ${missing.map((m) => m.pillarKey).join(', ')}. Run services:consolidate first.`,
    )
  }

  console.log(`pillars resolved: ${[...pillarIdByKey.keys()].join(', ')}`)
  console.log(`locales to write: ${locales.join(', ')}`)
  console.log(
    `sections: hero, positioning (${positioningCopy.pillars.length}), services (${servicesCopy.items.length}), work, approach (${approachCopy.steps.length}), proof, faq (${faqCopy.items.length}), closing`,
  )

  if (!APPLY) {
    console.log('\nNo database writes were performed. Run again with --apply.\n')
    return
  }

  /**
   * `expertise.items` and `approach.steps` are shared arrays with
   * localized subfields, so their rows have one identity across locales. A
   * write that omits row ids creates fresh rows and discards the localized
   * values written for earlier locales — which is exactly what happens if you
   * loop over locales naively. Payload's Admin sends the ids; so must this.
   *
   * The first locale creates the rows, then their ids are read back and reused
   * for the rest.
   */
  let serviceItemIds: string[] = []
  let approachStepIds: string[] = []

  for (const [index, locale] of (locales as readonly Locale[]).entries()) {
    const withIds = index > 0
    await payload.updateGlobal({
      slug: 'home-page',
      locale,
      data: {
        heroEyebrow: heroCopy.eyebrow[locale],
        heroHeading: heroCopy.heading[locale],
        heroBody: heroCopy.body[locale],
        primaryCTA: { label: heroCopy.primaryCTA[locale], url: '/contact' },
        secondaryCTA: { label: heroCopy.secondaryCTA[locale], url: '/work' },
        hero: {
          overlayLabel: heroCopy.overlayLabel[locale],
          overlayItems: list(heroCopy.overlayItems[locale]),
        },

        positioning: {
          kicker: positioningCopy.kicker[locale],
          heading: positioningCopy.heading[locale],
          body: positioningCopy.body[locale],
          pillars: positioningCopy.pillars.map((pillar) => ({
            title: pillar.title[locale],
            body: pillar.body[locale],
          })),
        },

        expertise: {
          kicker: servicesCopy.kicker[locale],
          heading: servicesCopy.heading[locale],
          intro: servicesCopy.intro[locale],
          items: servicesCopy.items.map((item, i) => ({
            ...(withIds && serviceItemIds[i] ? { id: serviceItemIds[i] } : {}),
            number: item.number,
            title: item.title[locale],
            tagline: item.tagline[locale],
            body: item.body[locale],
            offerings: list(item.offerings[locale]),
            service: pillarIdByKey.get(item.pillarKey),
            ctaLabel: servicesCopy.ctaLabel[locale],
          })),
          sectionCTA: { label: servicesCopy.sectionCTA[locale], url: '/services' },
        },

        workSection: {
          kicker: workCopy.kicker[locale],
          heading: workCopy.heading[locale],
          body: workCopy.body[locale],
          itemCTALabel: workCopy.itemCTALabel[locale],
          sectionCTA: { label: workCopy.sectionCTA[locale], url: '/work' },
        },

        approach: {
          kicker: approachCopy.kicker[locale],
          heading: approachCopy.heading[locale],
          body: approachCopy.body[locale],
          steps: approachCopy.steps.map((step, i) => ({
            ...(withIds && approachStepIds[i] ? { id: approachStepIds[i] } : {}),
            number: step.number,
            title: step.title[locale],
            tagline: step.tagline[locale],
            body: step.body[locale],
            bullets: list(step.bullets[locale]),
            resultLabel: approachCopy.resultLabel[locale],
            result: step.result[locale],
          })),
        },

        proof: {
          kicker: proofCopy.kicker[locale],
          heading: proofCopy.heading[locale],
          body: proofCopy.body[locale],
        },

        faq: {
          kicker: faqCopy.kicker[locale],
          heading: faqCopy.heading[locale],
          items: faqCopy.items.map((item) => ({
            question: item.question[locale],
            answer: item.answer[locale],
          })),
        },

        closingCTA: { label: closingCopy.cta[locale], url: '/contact' },
        closing: {
          kicker: closingCopy.kicker[locale],
          heading: closingCopy.heading[locale],
          body: closingCopy.body[locale],
          reassurance: closingCopy.reassurance[locale],
        },
      } as never,
      draft: false,
      overrideAccess: true,
      user: actor,
    })

    if (index === 0) {
      const created = await payload.findGlobal({
        slug: 'home-page',
        locale,
        depth: 0,
        overrideAccess: true,
      })
      serviceItemIds = (created.expertise?.items ?? []).map((item) => String(item.id))
      approachStepIds = (created.approach?.steps ?? []).map((step) => String(step.id))
    }

    console.log(`  wrote ${locale}`)
  }

  console.log('\nDone.\n')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })

import type { GlobalConfig } from 'payload'
import { globalPublishGate } from '@/lib/adminComponents'
import { revalidateGlobal } from '@/hooks/revalidate'
import { isEditorOrAI, publicReadPublishedOnly } from '@/access/predicates'
import { globalPreview } from '@/lib/adminPreview'
import { ctaField } from '@/fields/cta'
import { pageGlobalEditorialFields } from '@/fields/editorial'
import { enforceEditorialWorkflowGlobal } from '@/hooks/enforceEditorialWorkflow'

/**
 * CLAUDE.md §41, §73-§74.
 *
 * Structured to the eight sections of the approved homepage document: hero,
 * positionnement, services, réalisations, notre approche, preuves, FAQ and the
 * closing call to action.
 *
 * Every section is grouped rather than flat so an editor can see what belongs
 * together, and every visible string is localized — no section falls back
 * across languages (§14).
 *
 * Proof content stays relational (clients, projects, testimonials) rather than
 * being retyped here, so the section can only show what actually exists in the
 * CMS. Nothing on this page invents evidence (§105).
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: publicReadPublishedOnly,
    update: isEditorOrAI,
  },
  admin: {
    ...globalPublishGate,
    ...globalPreview('home-page'),
    group: 'Pages',
  },
  versions: {
    drafts: true,
    max: 50,
  },
  hooks: {
    afterChange: [revalidateGlobal('home-page')],
    beforeChange: [enforceEditorialWorkflowGlobal],
  },
  fields: [
    // ---- 1. Hero ----------------------------------------------------------
    { name: 'heroEyebrow', type: 'text', localized: true },
    { name: 'heroHeading', type: 'text', localized: true },
    { name: 'heroBody', type: 'textarea', localized: true },
    ctaField('primaryCTA'),
    ctaField('secondaryCTA'),
    {
      name: 'heroMedia',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'A real working session or client presentation. Optional; the hero renders without it.' },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'overlayLabel', type: 'text', localized: true },
        {
          name: 'overlayItems',
          type: 'array',
          localized: true,
          fields: [{ name: 'value', type: 'text', required: true }],
        },
      ],
    },

    // ---- 2. Positionnement ------------------------------------------------
    {
      name: 'positioning',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        {
          name: 'pillars',
          type: 'array',
          localized: true,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea' },
          ],
        },
      ],
    },

    // ---- 3. Services ------------------------------------------------------
    /**
     * Named `expertise` rather than `servicesSection` on purpose. Payload
     * derives constraint names from the full field path, and
     * `_home_page_v_version_services_section_items_offerings_parent_id_fk`
     * is 66 characters — Postgres truncates identifiers at 63, after which
     * Payload's own schema diff can no longer match the constraint it created.
     * The shorter name keeps every generated identifier inside the limit.
     */
    {
      name: 'expertise',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'intro', type: 'textarea', localized: true },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'number', type: 'text' },
            { name: 'title', type: 'text', localized: true },
            { name: 'tagline', type: 'text', localized: true },
            { name: 'body', type: 'textarea', localized: true },
            {
              name: 'offerings',
              type: 'array',
              localized: true,
              fields: [{ name: 'value', type: 'text', required: true }],
            },
            {
              name: 'service',
              type: 'relationship',
              relationTo: 'services',
              admin: { description: 'The pillar this card links to. Its localized slug builds the URL.' },
            },
            { name: 'ctaLabel', type: 'text', localized: true },
          ],
        },
        ctaField('sectionCTA'),
      ],
    },

    // ---- 4. Réalisations --------------------------------------------------
    { name: 'featuredProjects', type: 'relationship', relationTo: 'projects', hasMany: true },
    {
      name: 'workSection',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'itemCTALabel', type: 'text', localized: true },
        ctaField('sectionCTA'),
      ],
    },

    // ---- 5. Notre approche ------------------------------------------------
    {
      name: 'approach',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        {
          name: 'steps',
          type: 'array',
          fields: [
            { name: 'number', type: 'text' },
            { name: 'title', type: 'text', localized: true },
            { name: 'tagline', type: 'text', localized: true },
            { name: 'body', type: 'textarea', localized: true },
            {
              name: 'bullets',
              type: 'array',
              localized: true,
              fields: [{ name: 'value', type: 'text', required: true }],
            },
            { name: 'resultLabel', type: 'text', localized: true },
            { name: 'result', type: 'text', localized: true },
          ],
        },
      ],
    },

    // ---- 6. Preuves -------------------------------------------------------
    { name: 'featuredClients', type: 'relationship', relationTo: 'clients', hasMany: true },
    { name: 'featuredTestimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },
    {
      name: 'proof',
      type: 'group',
      admin: {
        description:
          'Copy only. The logos, testimonials and results themselves come from published CMS records — the section hides when there are none (§105, §139).',
      },
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },

    // ---- 7. Questions fréquentes ------------------------------------------
    {
      name: 'faq',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        {
          name: 'items',
          type: 'array',
          localized: true,
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ---- 8. Appel à l'action final ----------------------------------------
    ctaField('closingCTA'),
    {
      name: 'closing',
      type: 'group',
      fields: [
        { name: 'kicker', type: 'text', localized: true },
        { name: 'heading', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
        { name: 'reassurance', type: 'text', localized: true },
      ],
    },

    /**
     * Superseded by the `approach` group above and no longer rendered. Kept
     * rather than dropped: removing them alongside the new columns makes the
     * migration generator ask whether it is looking at a rename, and dropping
     * a localized text column destroys the content in all three locales for
     * no benefit. Hidden so editors are not offered dead fields.
     */
    { name: 'methodHeading', type: 'text', localized: true, admin: { hidden: true } },
    { name: 'methodIntro', type: 'textarea', localized: true, admin: { hidden: true } },
    {
      name: 'featuredIndustries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      admin: { hidden: true },
    },

    ...pageGlobalEditorialFields,
  ],
}

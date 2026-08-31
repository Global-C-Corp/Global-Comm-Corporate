/**
 * Replaces Payload's publish control with one that states the §18/§27
 * preconditions before the click. Applied to every entity under the
 * editorial workflow; the component itself falls back to the stock button
 * for anything without a reviewStatus field.
 *
 * Collections and globals nest this differently in Payload 3.88 —
 * `components.edit` vs `components.elements` — so each gets its own shape.
 */
const PUBLISH_BUTTON = '@/components/admin/ApproveAndPublishButton#ApproveAndPublishButton'

export const collectionPublishGate = {
  components: {
    edit: {
      PublishButton: PUBLISH_BUTTON,
    },
  },
} as const

export const globalPublishGate = {
  components: {
    elements: {
      PublishButton: PUBLISH_BUTTON,
    },
  },
} as const

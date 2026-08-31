'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { PublishButton, useAuth, useConfig, useDocumentInfo, useForm, useFormFields, useLocale } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { canPublish, reviewStatusLabels, type ReviewStatus } from '@/access/editorialStateMachine'
import type { Role } from '@/access/roles'
import { locales, localeNames, translationStatusKey, type Locale } from '@/i18n/locale'
import { APPROVE_AND_PUBLISH } from '@/hooks/enforceEditorialWorkflow'
import './approveAndPublish.scss'

type Unmet = { key: string; label: string }

/**
 * Publish control that states the §18/§27 preconditions before the click
 * rather than refusing after it, and — for a role authorized to satisfy them
 * — offers them as one confirmed action (see APPROVE_AND_PUBLISH).
 *
 * This is an affordance, not the rule. The server guard in
 * enforceEditorialWorkflow refuses the same requests whether they arrive
 * from this button, curl, or an MCP tool.
 */
export const ApproveAndPublishButton: React.FC = () => {
  const { user } = useAuth()
  const { id, collectionSlug, globalSlug, setHasPublishedDoc } = useDocumentInfo()
  const { config } = useConfig()
  const { submit } = useForm()
  const { code: localeCode } = useLocale()
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const role = (user as { role?: Role } | null | undefined)?.role

  const { governed, reviewStatus, dirtyLocales, translationStatus } = useFormFields(([fields]) => ({
    // Entities without the editorial fields (navigation, say) are not under
    // this workflow and keep Payload's stock button.
    governed: Boolean(fields && 'reviewStatus' in fields),
    reviewStatus: fields?.reviewStatus?.value as ReviewStatus | undefined,
    dirtyLocales: (fields?.dirtyLocales?.value as string[] | undefined) ?? [],
    translationStatus: Object.fromEntries(
      locales.map((locale) => {
        const key = translationStatusKey(locale)
        return [key, fields?.[`translationStatus.${key}`]?.value as string | undefined]
      }),
    ),
  }))

  const unmet = useMemo<Unmet[]>(() => {
    const conditions: Unmet[] = []
    if (!governed) return conditions

    if (reviewStatus !== 'approved') {
      conditions.push({
        key: 'review',
        label: `Editorial stage is “${reviewStatus ? reviewStatusLabels[reviewStatus] : 'not set'}” — must be “Approved”.`,
      })
    }

    for (const locale of dirtyLocales) {
      const status = translationStatus[translationStatusKey(locale as Locale)] ?? 'missing'
      if (status !== 'approved') {
        conditions.push({
          key: `locale-${locale}`,
          label: `${localeNames[locale as Locale]} (${locale.toUpperCase()}) translation is “${status}” — must be approved.`,
        })
      }
    }

    return conditions
  }, [governed, reviewStatus, dirtyLocales, translationStatus])

  const approveAndPublish = useCallback(async () => {
    setSubmitting(true)
    try {
      const query = new URLSearchParams({ depth: '0', locale: localeCode })
      const path: `/${string}` = globalSlug
        ? `/globals/${globalSlug}?${query}`
        : `/${collectionSlug}${id ? `/${id}` : ''}?${query}`

      const result = await submit({
        action: formatAdminURL({ apiRoute: config.routes.api, path }),
        overrides: { _status: 'published', [APPROVE_AND_PUBLISH]: true },
      })

      if (result) {
        setHasPublishedDoc(true)
        setConfirming(false)
      }
    } finally {
      setSubmitting(false)
    }
  }, [collectionSlug, config.routes.api, globalSlug, id, localeCode, setHasPublishedDoc, submit])

  // Nothing blocking: Payload's own button, with all of its behaviour intact.
  if (unmet.length === 0) return <PublishButton />

  const authorized = canPublish(role)

  return (
    <div className="gc-publish-gate">
      <button className="btn btn--style-primary btn--size-medium gc-publish-gate__blocked" type="button" disabled>
        Publish changes
      </button>

      <div className="gc-publish-gate__reasons">
        <p className="gc-publish-gate__heading">
          {authorized ? 'Before this can go live:' : 'Not ready to publish:'}
        </p>
        <ul>
          {unmet.map((condition) => (
            <li key={condition.key}>{condition.label}</li>
          ))}
        </ul>

        {authorized && !confirming && (
          <button
            className="btn btn--style-secondary btn--size-small gc-publish-gate__action"
            type="button"
            onClick={() => setConfirming(true)}
          >
            Approve and publish…
          </button>
        )}

        {authorized && confirming && (
          <div className="gc-publish-gate__confirm">
            <p>This will, in one step:</p>
            <ul>
              {reviewStatus !== 'approved' && <li>set the editorial stage to Approved</li>}
              {dirtyLocales
                .filter((locale) => translationStatus[translationStatusKey(locale as Locale)] !== 'approved')
                .map((locale) => (
                  <li key={locale}>approve the {localeNames[locale as Locale]} translation</li>
                ))}
              <li>publish the document</li>
            </ul>
            <p className="gc-publish-gate__note">
              Locales you have not edited stay unapproved and will not go live.
            </p>
            <button
              className="btn btn--style-primary btn--size-small"
              type="button"
              onClick={approveAndPublish}
              disabled={submitting}
            >
              {submitting ? 'Publishing…' : 'Confirm'}
            </button>
            <button className="btn btn--style-secondary btn--size-small" type="button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}

        {!authorized && (
          <p className="gc-publish-gate__note">
            Your role ({role ?? 'none'}) cannot publish. Set the editorial stage to “Submitted for review” and a
            publisher will approve and publish it.
          </p>
        )}
      </div>
    </div>
  )
}

export default ApproveAndPublishButton

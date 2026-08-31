'use client'

import { useActionState } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  errors?: Record<string, string>
}

export type ContactFormAction = (state: ContactFormState, formData: FormData) => Promise<ContactFormState>

export function ContactForm({
  action,
  dictionary,
  projectTypes,
}: {
  action: ContactFormAction
  dictionary: Dictionary
  projectTypes: { id: number | string; name: string }[]
}) {
  const [state, formAction, pending] = useActionState(action, { status: 'idle' } as ContactFormState)

  const errorFor = (field: string) => state.errors?.[field]

  return (
    <form action={formAction} className="gc-form" noValidate>
      {state.status === 'success' && (
        <p className="gc-form__status" role="status">
          {dictionary.form.success}
        </p>
      )}
      {state.status === 'error' && !state.errors && (
        <p className="gc-form__status" role="alert">
          {dictionary.form.genericError}
        </p>
      )}

      <div className="gc-form__row">
        <div className="gc-field">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" className="gc-input" required aria-describedby={errorFor('name') ? 'name-error' : undefined} />
          {errorFor('name') && (
            <p className="gc-field__error" id="name-error">
              {dictionary.form.required}
            </p>
          )}
        </div>
        <div className="gc-field">
          <label htmlFor="company">Company *</label>
          <input id="company" name="company" className="gc-input" required />
          {errorFor('company') && <p className="gc-field__error">{dictionary.form.required}</p>}
        </div>
      </div>

      <div className="gc-form__row">
        <div className="gc-field">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" className="gc-input" required />
          {errorFor('email') && <p className="gc-field__error">{dictionary.form.invalidEmail}</p>}
        </div>
        <div className="gc-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" className="gc-input" />
        </div>
      </div>

      <div className="gc-form__row">
        <div className="gc-field">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" className="gc-input" />
        </div>
        <div className="gc-field">
          <label htmlFor="projectType">Project type</label>
          <select id="projectType" name="projectType" className="gc-select" defaultValue="">
            <option value="">—</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={String(type.id)}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="gc-form__row">
        <div className="gc-field">
          <label htmlFor="estimatedBudget">Estimated budget</label>
          <input id="estimatedBudget" name="estimatedBudget" className="gc-input" />
        </div>
        <div className="gc-field">
          <label htmlFor="desiredStart">Desired start</label>
          <input id="desiredStart" name="desiredStart" type="date" className="gc-input" />
        </div>
      </div>

      <div className="gc-field">
        <label htmlFor="message">Message *</label>
        <textarea id="message" name="message" className="gc-textarea" required />
        {errorFor('message') && <p className="gc-field__error">{dictionary.form.required}</p>}
      </div>

      <div className="gc-field gc-field--checkbox">
        <input id="consent" name="consent" type="checkbox" value="true" required />
        <label htmlFor="consent">
          I consent to Global Communication Corporate storing this information to respond to my enquiry. *
        </label>
      </div>
      {errorFor('consent') && <p className="gc-field__error">{dictionary.form.required}</p>}

      <div>
        <button type="submit" className="gc-button" disabled={pending}>
          {dictionary.actions.submit}
        </button>
      </div>
    </form>
  )
}

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
  companyName,
}: {
  action: ContactFormAction
  dictionary: Dictionary
  projectTypes: { id: number | string; name: string }[]
  /** Filled into the consent sentence, so the legal wording stays CMS-driven. */
  companyName: string
}) {
  const [state, formAction, pending] = useActionState(action, { status: 'idle' } as ContactFormState)

  const errorFor = (field: string) => state.errors?.[field]
  const l = dictionary.form.labels
  const consent = l.consent.replace('{company}', companyName)

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {state.status === 'success' && (
        <p className="rounded-sm border border-border bg-muted p-4 text-sm text-foreground" role="status">
          {dictionary.form.success}
        </p>
      )}
      {state.status === 'error' && !state.errors && (
        <p className="rounded-sm border border-border bg-muted p-4 text-sm text-foreground" role="alert">
          {dictionary.form.genericError}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">{l.name} *</label>
          <input id="name" name="name" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" required aria-describedby={errorFor('name') ? 'name-error' : undefined} />
          {errorFor('name') && (
            <p className="text-xs text-destructive" id="name-error">
              {dictionary.form.required}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="company" className="text-sm font-medium text-foreground">{l.company} *</label>
          <input id="company" name="company" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" required />
          {errorFor('company') && <p className="text-xs text-destructive">{dictionary.form.required}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">{l.email} *</label>
          <input id="email" name="email" type="email" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" required />
          {errorFor('email') && <p className="text-xs text-destructive">{dictionary.form.invalidEmail}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">{l.phone}</label>
          <input id="phone" name="phone" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="website" className="text-sm font-medium text-foreground">{l.website}</label>
          <input id="website" name="website" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className="text-sm font-medium text-foreground">{l.projectType}</label>
          <select id="projectType" name="projectType" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" defaultValue="">
            <option value="">—</option>
            {projectTypes.map((type) => (
              <option key={type.id} value={String(type.id)}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="estimatedBudget" className="text-sm font-medium text-foreground">{l.estimatedBudget}</label>
          <input id="estimatedBudget" name="estimatedBudget" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="desiredStart" className="text-sm font-medium text-foreground">{l.desiredStart}</label>
          <input id="desiredStart" name="desiredStart" type="date" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">{l.message} *</label>
        <textarea id="message" name="message" className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-h-40" required />
        {errorFor('message') && <p className="text-xs text-destructive">{dictionary.form.required}</p>}
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <input id="consent" name="consent" type="checkbox" value="true" required />
        <label htmlFor="consent" className="text-sm font-medium text-foreground">
          {consent} *
        </label>
      </div>
      {errorFor('consent') && <p className="text-xs text-destructive">{dictionary.form.required}</p>}

      <div>
        <button type="submit" className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" disabled={pending}>
          {dictionary.actions.submit}
        </button>
      </div>
    </form>
  )
}

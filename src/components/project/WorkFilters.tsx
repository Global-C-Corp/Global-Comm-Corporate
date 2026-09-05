import type { Dictionary } from '@/i18n/dictionaries'

export type FilterOption = { slug: string; label: string }

/**
 * Server-rendered GET form — the archive filters work without JavaScript
 * (CLAUDE.md §77, §116).
 */
export function WorkFilters({
  action,
  services,
  industries,
  projectTypes,
  selected,
  dictionary,
}: {
  action: string
  services: FilterOption[]
  industries: FilterOption[]
  projectTypes: FilterOption[]
  selected: { service?: string; industry?: string; type?: string }
  dictionary: Dictionary
}) {
  const groups: { name: 'service' | 'industry' | 'type'; label: string; options: FilterOption[]; value?: string }[] = [
    { name: 'service', label: dictionary.sections.capabilities, options: services, value: selected.service },
    { name: 'industry', label: dictionary.sections.industries, options: industries, value: selected.industry },
    { name: 'type', label: dictionary.sections.whatWeDo, options: projectTypes, value: selected.type },
  ]

  return (
    <form
      method="get"
      action={action}
      aria-label={dictionary.actions.filters}
      className="flex flex-wrap items-end gap-4 border border-border bg-muted p-6"
    >
      {groups
        .filter((group) => group.options.length > 0)
        .map((group) => (
          <div key={group.name} className="flex min-w-[12rem] flex-col gap-2">
            <label
              className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
              htmlFor={`filter-${group.name}`}
            >
              {group.label}
            </label>
            <select
              id={`filter-${group.name}`}
              name={group.name}
              defaultValue={group.value ?? ''}
              className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <option value="">{dictionary.actions.all}</option>
              {group.options.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      <button
        type="submit"
        className="rounded-sm bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {dictionary.actions.filters}
      </button>
    </form>
  )
}

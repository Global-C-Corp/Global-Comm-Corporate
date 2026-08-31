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
    <form method="get" action={action} className="gc-filters" aria-label={dictionary.actions.filters}>
      {groups
        .filter((group) => group.options.length > 0)
        .map((group) => (
          <div key={group.name}>
            <label className="gc-filter__label" htmlFor={`filter-${group.name}`}>
              {group.label}
            </label>
            <select id={`filter-${group.name}`} name={group.name} defaultValue={group.value ?? ''} className="gc-select">
              <option value="">{dictionary.actions.all}</option>
              {group.options.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      <button type="submit" className="gc-button">
        {dictionary.actions.filters}
      </button>
    </form>
  )
}

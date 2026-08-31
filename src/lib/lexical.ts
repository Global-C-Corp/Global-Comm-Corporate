/**
 * Minimal plain-text → Lexical editor state. AI tools submit prose as text;
 * this converts it to the structure Payload's richText fields store, without
 * inventing formatting.
 */
export function textToLexical(text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: paragraph,
            version: 1,
          },
        ],
      })),
    },
  }
}

export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const root = (value as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  const collect = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const typed = node as { text?: string; children?: unknown[] }
    if (typeof typed.text === 'string') return typed.text
    if (Array.isArray(typed.children)) return typed.children.map(collect).join('')
    return ''
  }

  return root.children.map(collect).filter(Boolean).join('\n\n')
}

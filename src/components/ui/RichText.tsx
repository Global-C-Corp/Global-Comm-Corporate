import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** Renders Payload lexical content. Returns null for empty fields (CLAUDE.md §139). */
export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return (
    <div className={className ?? 'gc-prose'}>
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}

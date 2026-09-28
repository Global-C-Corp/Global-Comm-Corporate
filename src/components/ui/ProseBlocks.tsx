import type { ProseBlock } from '@/content/company'
import { RichProse } from './Primitives'

/**
 * Renders the source-owned prose blocks that replaced the Lexical rich text
 * fields on the corporate pages. `RichProse` already styles `h2`, `h3`, `p`
 * and `strong`, so the output matches what the CMS editor produced.
 */
export function ProseBlocks({
  blocks,
  className,
}: {
  blocks: readonly ProseBlock[]
  className?: string
}) {
  return (
    <RichProse className={className}>
      {blocks.map((block, index) => {
        if (block.kind === 'h2') return <h2 key={index}>{block.text}</h2>
        if (block.kind === 'h3') return <h3 key={index}>{block.text}</h3>
        return (
          <p key={index}>
            {block.runs.map((run, runIndex) =>
              run.strong ? <strong key={runIndex}>{run.text}</strong> : <span key={runIndex}>{run.text}</span>,
            )}
          </p>
        )
      })}
    </RichProse>
  )
}

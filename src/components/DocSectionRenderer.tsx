import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { DocSection } from '@/lib/types'

interface DocSectionRendererProps {
  section: DocSection
  level?: number
}

const headingSizes: Record<number, string> = {
  2: 'text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100',
  3: 'text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100',
  4: 'text-base font-semibold text-zinc-800 dark:text-zinc-200',
  5: 'text-sm font-semibold text-zinc-700 dark:text-zinc-300',
  6: 'text-sm font-medium text-zinc-600 dark:text-zinc-400',
}

const PROSE_CLASSES = [
  'prose prose-lg dark:prose-invert max-w-none leading-relaxed',
  // Code blocks
  'prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-700 prose-pre:shadow-sm',
  // Inline code
  'prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none',
  // Tables
  'prose-table:rounded-lg prose-table:overflow-hidden prose-table:border prose-table:border-zinc-200 dark:prose-table:border-zinc-700',
  'prose-th:bg-zinc-50 dark:prose-th:bg-zinc-800/50 prose-th:font-semibold prose-th:text-sm prose-th:p-2',
  'prose-td:text-sm prose-td:border-t prose-td:border-zinc-100 dark:prose-td:border-zinc-800 prose-td:p-2',
  // Links
  'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
].join(' ')

export function DocSectionRenderer({ section, level = 2 }: DocSectionRendererProps) {
  const clampedLevel = Math.min(level, 6)
  const HeadingTag = `h${clampedLevel}` as keyof React.JSX.IntrinsicElements

  return (
    <div className="space-y-4">
      <HeadingTag
        className={headingSizes[clampedLevel] ?? headingSizes[6]}
      >
        {section.title}
      </HeadingTag>

      {section.content && (
        <div className={PROSE_CLASSES}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {section.content}
          </ReactMarkdown>
        </div>
      )}

      {section.subsections?.map((sub, index) => (
        <div
          key={sub.id || `${section.title}-subsection-${index}`}
          className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-700"
        >
          <DocSectionRenderer section={sub} level={level + 1} />
        </div>
      ))}
    </div>
  )
}

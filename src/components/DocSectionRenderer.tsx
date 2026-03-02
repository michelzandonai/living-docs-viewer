import { cn } from '@/lib/cn'
import type { DocSection } from '@/lib/types'

interface DocSectionRendererProps {
  sections: DocSection[]
}

function renderContent(content: string) {
  const parts: { type: 'text' | 'code'; value: string }[] = []
  const codeBlockRegex = /```[\s\S]*?```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) })
    }
    const codeContent = match[0].replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
    parts.push({ type: 'code', value: codeContent })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) })
  }

  return (
    <div className="ldv-prose">
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <pre key={i} className="my-3">
            <code>{part.value}</code>
          </pre>
        ) : (
          <p
            key={i}
            className="whitespace-pre-wrap text-sm leading-relaxed"
            style={{ color: 'var(--ldv-text)' }}
          >
            {part.value}
          </p>
        )
      )}
    </div>
  )
}

function SectionItem({ section, depth = 0 }: { section: DocSection; depth?: number }) {
  return (
    <div
      className={cn(depth > 0 && 'ml-4 pl-4 border-l-2')}
      style={depth > 0 ? { borderColor: 'var(--ldv-border)' } : undefined}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3
            className={cn(
              'font-semibold',
              depth === 0 ? 'text-lg' : 'text-base'
            )}
            style={{ color: 'var(--ldv-text)' }}
          >
            {section.title}
          </h3>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{
            color: 'var(--ldv-text-secondary)',
            backgroundColor: 'var(--ldv-bg-secondary)',
          }}>
            {section.id}
          </span>
        </div>

        {section.content && renderContent(section.content)}
      </div>

      {section.subsections?.map((sub) => (
        <SectionItem key={sub.id} section={sub} depth={depth + 1} />
      ))}
    </div>
  )
}

export function DocSectionRenderer({ sections }: DocSectionRendererProps) {
  if (sections.length === 0) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhuma secao disponivel.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <SectionItem key={section.id} section={section} />
      ))}
    </div>
  )
}

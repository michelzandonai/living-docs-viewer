import { cn } from '@/lib/cn'
import type { DocBase, Catalogs, DocType } from '@/lib/types'

interface DocMetadataHeaderProps {
  doc: DocBase
  catalogs: Catalogs | null
}

const typeColorMap: Record<DocType, string> = {
  adr: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  prd: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  guideline: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  task: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
}

const statusColorMap: Record<string, string> = {
  accepted: 'bg-green-500',
  proposed: 'bg-yellow-500',
  deprecated: 'bg-red-500',
  draft: 'bg-gray-400',
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  cancelled: 'bg-red-500',
}

function getStatusDotColor(status: string): string {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_')
  return statusColorMap[normalized] ?? 'bg-gray-400'
}

function resolveAuthorNames(authorIds: string[], catalogs: Catalogs | null): string[] {
  if (!catalogs?.authors) return authorIds
  return authorIds.map((id) => catalogs.authors[id]?.name ?? id)
}

function resolveTagLabels(tagIds: string[], catalogs: Catalogs | null): string[] {
  if (!catalogs?.tags) return tagIds
  return tagIds.map((id) => catalogs.tags[id]?.label ?? id)
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function DocMetadataHeader({ doc, catalogs }: DocMetadataHeaderProps) {
  const { metadata } = doc
  const authorNames = resolveAuthorNames(metadata.authorIds, catalogs)
  const tagLabels = resolveTagLabels(metadata.tagIds ?? [], catalogs)

  return (
    <header className="space-y-4 pb-6 border-b" style={{ borderColor: 'var(--ldv-border)' }}>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
            typeColorMap[doc.type]
          )}
        >
          {doc.id}
        </span>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: 'var(--ldv-bg-secondary)', color: 'var(--ldv-text-secondary)' }}
        >
          <span className={cn('inline-block w-2 h-2 rounded-full', getStatusDotColor(metadata.status))} />
          {metadata.status}
        </span>
      </div>

      <h1 className="text-2xl font-bold leading-tight" style={{ color: 'var(--ldv-text)' }}>
        {metadata.title}
      </h1>

      {tagLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tagLabels.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: 'var(--ldv-bg-secondary)',
                color: 'var(--ldv-text-secondary)',
                border: '1px solid var(--ldv-border)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--ldv-text-secondary)' }}>
        {authorNames.length > 0 && (
          <span>
            <span className="font-medium">Autores:</span>{' '}
            {authorNames.join(', ')}
          </span>
        )}

        <span>
          <span className="font-medium">Criado em:</span>{' '}
          {formatDate(metadata.dateCreated)}
        </span>

        {metadata.dateModified && (
          <span>
            <span className="font-medium">Modificado em:</span>{' '}
            {formatDate(metadata.dateModified)}
          </span>
        )}
      </div>

      {metadata.summary && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--ldv-text-secondary)' }}>
          {metadata.summary}
        </p>
      )}
    </header>
  )
}

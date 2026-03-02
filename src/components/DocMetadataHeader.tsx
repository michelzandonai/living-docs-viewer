import { Calendar, Users } from 'lucide-react'
import { resolveAuthors, resolveTags } from '@/lib/resolve-catalogs'
import type { DocMetadata, Catalogs, DocType, ResolvedTag } from '@/lib/types'

// --- Status badge styles ---

const STATUS_STYLES: Record<string, string> = {
  accepted:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  proposed:
    'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  deprecated:
    'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  superseded:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  draft:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
  planned:
    'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
  in_development:
    'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  in_progress:
    'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  implemented:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  completed:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  active:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  cancelled:
    'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  pending:
    'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
}

// --- Scope badge styles ---

const SCOPE_STYLES: Record<string, string> = {
  shared:
    'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
  api:
    'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800',
  frontend:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  mobile:
    'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
  'cross-project':
    'bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-800',
}

// --- Tag category color mapping ---

const TAG_CATEGORY_STYLES: Record<string, string> = {
  domain:
    'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
  tech:
    'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800',
  layer:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  process:
    'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  integration:
    'bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-800',
  other:
    'bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
}

// --- Type badge styles ---

const TYPE_STYLES: Record<DocType, string> = {
  adr: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  prd: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  guideline: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  task: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  planning: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
}

// --- Helpers ---

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

function getTagStyle(tag: ResolvedTag): string {
  return TAG_CATEGORY_STYLES[tag.category] ?? TAG_CATEGORY_STYLES.other
}

// --- Component ---

interface DocMetadataHeaderProps {
  metadata: DocMetadata
  docId: string
  docType: DocType
  catalogs: Catalogs | null
}

export function DocMetadataHeader({ metadata, docId, docType, catalogs }: DocMetadataHeaderProps) {
  const resolvedAuthorNames = catalogs?.authors
    ? resolveAuthors(metadata.authorIds, catalogs.authors)
    : metadata.authorIds

  const resolvedTags = catalogs?.tags
    ? resolveTags(metadata.tagIds ?? [], catalogs.tags)
    : (metadata.tagIds ?? []).map((id) => ({ id, label: id, category: 'other' }))

  const formattedDate = formatDate(metadata.dateCreated)
  const modifiedDate = metadata.dateModified
    ? formatDate(metadata.dateModified)
    : null

  const normalizedStatus = metadata.status.toLowerCase().replace(/[\s-]/g, '_')

  return (
    <div className="space-y-4">
      {/* Line 1: ID badge + Type label */}
      <div className="flex items-center gap-3">
        <span
          className={[
            'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-mono font-semibold',
            TYPE_STYLES[docType] ?? TYPE_STYLES.task,
          ].join(' ')}
        >
          {docId}
        </span>
        <span className="uppercase text-xs tracking-widest font-medium text-zinc-500 dark:text-zinc-500">
          {docType}
        </span>
      </div>

      {/* Line 2: Title */}
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {metadata.title}
      </h1>

      {/* Line 3: Summary */}
      {metadata.summary && (
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {metadata.summary}
        </p>
      )}

      {/* Line 4: Status + Scope + Date + Authors */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {/* Status badge */}
        <span
          className={[
            'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold capitalize',
            STATUS_STYLES[normalizedStatus] ?? STATUS_STYLES.draft,
          ].join(' ')}
        >
          {metadata.status}
        </span>

        {/* Scope badge */}
        {metadata.scope && (
          <span
            className={[
              'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium',
              SCOPE_STYLES[metadata.scope] ?? SCOPE_STYLES.shared,
            ].join(' ')}
          >
            {metadata.scope}
          </span>
        )}

        {/* Separator */}
        <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />

        {/* Date */}
        <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          {formattedDate}
          {modifiedDate && (
            <span className="text-zinc-400 dark:text-zinc-600">
              {' '}(atualizado {modifiedDate})
            </span>
          )}
        </span>

        {/* Separator */}
        <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />

        {/* Authors */}
        <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-500">
          <Users className="h-3.5 w-3.5" />
          {resolvedAuthorNames.map((name, i) => (
            <span key={name}>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{name}</span>
              {i < resolvedAuthorNames.length - 1 && ', '}
            </span>
          ))}
        </span>
      </div>

      {/* Line 5: Tags */}
      {resolvedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {resolvedTags.map((tag) => (
            <span
              key={tag.id}
              className={[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal',
                getTagStyle(tag),
              ].join(' ')}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

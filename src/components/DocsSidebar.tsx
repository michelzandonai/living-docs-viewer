import { useState } from 'react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { cn } from '@/lib/cn'
import type { DocType, DocsIndexEntry } from '@/lib/types'
import { Search, FileText, BookOpen, ListChecks, ClipboardList, ChevronRight } from 'lucide-react'
import { DocSearch } from './DocSearch'

const TYPE_ICON: Record<DocType, typeof FileText> = {
  adr: FileText,
  prd: BookOpen,
  guideline: ListChecks,
  task: ClipboardList,
}

const TYPE_LABEL: Record<DocType, string> = {
  adr: 'ADR',
  prd: 'PRD',
  guideline: 'Guideline',
  task: 'Task',
}

const ALL_TYPES: DocType[] = ['adr', 'prd', 'guideline', 'task']

function getStatusColor(status: string): string {
  const normalized = status.toLowerCase().replace(/\s+/g, '_')
  switch (normalized) {
    case 'accepted':
    case 'completed':
    case 'implemented':
      return 'bg-green-500'
    case 'in_development':
    case 'in_progress':
      return 'bg-blue-500'
    case 'pending':
    case 'planned':
      return 'bg-yellow-500'
    case 'deprecated':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

interface DocsSidebarProps {
  className?: string
  onDocSelect?: (docId: string) => void
}

export function DocsSidebar({ className, onDocSelect }: DocsSidebarProps) {
  const index = useDocsStore((s) => s.index)
  const currentDocId = useDocsStore((s) => s.currentDocId)
  const typeFilter = useDocsStore((s) => s.typeFilter)
  const setTypeFilter = useDocsStore((s) => s.setTypeFilter)
  const selectDoc = useDocsStore((s) => s.selectDoc)
  const filteredDocs = useDocsStore((s) => s.filteredDocs)

  const [collapsedTypes, setCollapsedTypes] = useState<Set<DocType>>(new Set())

  const docs = filteredDocs()
  const byType = index?.stats.byType ?? {}

  const docsByType = docs.reduce<Record<DocType, DocsIndexEntry[]>>(
    (acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = []
      }
      acc[doc.type].push(doc)
      return acc
    },
    {} as Record<DocType, DocsIndexEntry[]>
  )

  const toggleCollapse = (type: DocType) => {
    setCollapsedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const handleDocClick = (docId: string) => {
    selectDoc(docId)
    onDocSelect?.(docId)
  }

  const totalCount = index?.stats.total ?? 0

  return (
    <aside
      className={cn(
        'flex h-full w-80 flex-shrink-0 flex-col border-r border-ldv-border bg-ldv-bg',
        className
      )}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-ldv-border p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ldv-text-secondary">
          Documentos
        </h2>
        <DocSearch />
      </div>

      {/* Type Filter Buttons */}
      <div className="flex flex-shrink-0 flex-wrap gap-1.5 border-b border-ldv-border p-3">
        <button
          onClick={() => setTypeFilter(null)}
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            typeFilter === null
              ? 'bg-ldv-accent text-white'
              : 'bg-ldv-bg-secondary text-ldv-text-secondary hover:bg-ldv-bg-hover hover:text-ldv-text'
          )}
        >
          Todos
          <span
            className={cn(
              'ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold',
              typeFilter === null
                ? 'bg-white/20 text-white'
                : 'bg-ldv-border text-ldv-text-secondary'
            )}
          >
            {totalCount}
          </span>
        </button>

        {ALL_TYPES.map((type) => {
          const count = byType[type] ?? 0
          const isActive = typeFilter === type
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(isActive ? null : type)}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-ldv-accent text-white'
                  : 'bg-ldv-bg-secondary text-ldv-text-secondary hover:bg-ldv-bg-hover hover:text-ldv-text'
              )}
            >
              {TYPE_LABEL[type]}
              <span
                className={cn(
                  'ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-ldv-border text-ldv-text-secondary'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Document List */}
      <div className="ldv-scrollbar flex-1 overflow-y-auto p-2">
        {docs.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <Search size={32} className="mb-2 text-ldv-text-secondary/40" />
            <p className="text-sm text-ldv-text-secondary">
              Nenhum documento encontrado.
            </p>
          </div>
        )}

        {ALL_TYPES.map((type) => {
          const typeDocs = docsByType[type]
          if (!typeDocs || typeDocs.length === 0) return null

          const Icon = TYPE_ICON[type]
          const isCollapsed = collapsedTypes.has(type)

          return (
            <div key={type} className="mb-1">
              {/* Type Section Header */}
              <button
                onClick={() => toggleCollapse(type)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider',
                  'text-ldv-text-secondary transition-colors hover:bg-ldv-bg-hover'
                )}
              >
                <ChevronRight
                  size={14}
                  className={cn(
                    'flex-shrink-0 transition-transform duration-200',
                    !isCollapsed && 'rotate-90'
                  )}
                />
                <Icon size={14} className="flex-shrink-0" />
                <span>{TYPE_LABEL[type]}</span>
                <span className="ml-auto text-[10px] font-medium text-ldv-text-secondary/60">
                  {typeDocs.length}
                </span>
              </button>

              {/* Document Items */}
              {!isCollapsed && (
                <div className="ml-2 mt-0.5 space-y-0.5">
                  {typeDocs.map((doc) => {
                    const isActive = currentDocId === doc.id
                    return (
                      <button
                        key={doc.id}
                        onClick={() => handleDocClick(doc.id)}
                        className={cn(
                          'group flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors',
                          isActive
                            ? 'bg-ldv-accent-light text-ldv-accent'
                            : 'text-ldv-text hover:bg-ldv-bg-hover'
                        )}
                      >
                        {/* ID Badge */}
                        <span
                          className={cn(
                            'mt-0.5 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none',
                            isActive
                              ? 'bg-ldv-accent/10 text-ldv-accent'
                              : 'bg-ldv-bg-secondary text-ldv-text-secondary'
                          )}
                        >
                          {doc.id}
                        </span>

                        {/* Title + Status */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'h-2 w-2 flex-shrink-0 rounded-full',
                                getStatusColor(doc.status)
                              )}
                              title={doc.status}
                            />
                            <span
                              className={cn(
                                'truncate text-xs font-medium',
                                isActive ? 'text-ldv-accent' : 'text-ldv-text'
                              )}
                            >
                              {doc.title}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

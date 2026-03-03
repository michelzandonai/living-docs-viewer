import { useState, useMemo, useEffect } from 'react'
import {
  ChevronRight,
  Folder,
  FolderOpen,
  BookOpen,
  ScrollText,
  ListChecks,
  FileText,
  Archive,
  ClipboardPen,
  Clock,
} from 'lucide-react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { searchDocs } from '@/lib/search-docs'
import { getRecentDocs, ARCHIVED_STATUSES } from '@/lib/recent-docs'
import { DocSearch } from './DocSearch'
import type { DocsIndexEntry } from '@/lib/types'

// ---------------------------------------------------------------------------
// Config maps
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  string,
  {
    label: string
    labelPlural: string
    icon: typeof BookOpen
    colorClass: string
    bgClass: string
  }
> = {
  planning: {
    label: 'Planning',
    labelPlural: 'Plannings',
    icon: ClipboardPen,
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    bgClass: 'bg-cyan-100 dark:bg-cyan-900/40',
  },
  adr: {
    label: 'ADR',
    labelPlural: 'ADRs',
    icon: BookOpen,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100 dark:bg-blue-900/40',
  },
  prd: {
    label: 'PRD',
    labelPlural: 'PRDs',
    icon: ScrollText,
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-100 dark:bg-purple-900/40',
  },
  task: {
    label: 'Task',
    labelPlural: 'Tasks',
    icon: ListChecks,
    colorClass: 'text-green-600 dark:text-green-400',
    bgClass: 'bg-green-100 dark:bg-green-900/40',
  },
  guideline: {
    label: 'Guideline',
    labelPlural: 'Guidelines',
    icon: FileText,
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-100 dark:bg-orange-900/40',
  },
}

const SCOPE_LABELS: Record<string, string> = {
  shared: 'shared',
  api: 'api',
  frontend: 'frontend',
  mobile: 'mobile',
  'cross-project': 'cross-project',
}

const STATUS_DOT: Record<string, string> = {
  accepted: 'bg-emerald-500',
  proposed: 'bg-amber-500',
  deprecated: 'bg-red-500',
  superseded: 'bg-zinc-400',
  planned: 'bg-blue-500',
  in_development: 'bg-amber-500',
  implemented: 'bg-emerald-500',
  draft: 'bg-amber-500',
  active: 'bg-cyan-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-red-500',
  pending: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
}

const DOC_TYPES: string[] = ['planning', 'adr', 'prd', 'task', 'guideline']

// ---------------------------------------------------------------------------
// Tree data builder
// ---------------------------------------------------------------------------

interface TreeGroup {
  type: string
  scopes: Record<string, DocsIndexEntry[]>
  total: number
}

interface BuildTreeResult {
  tree: TreeGroup[]
  archived: DocsIndexEntry[]
}

function buildTree(documents: DocsIndexEntry[]): BuildTreeResult {
  const grouped: Record<string, Record<string, DocsIndexEntry[]>> = {}
  const archived: DocsIndexEntry[] = []

  for (const type of DOC_TYPES) {
    grouped[type] = {}
  }

  for (const doc of documents) {
    if (ARCHIVED_STATUSES.has(doc.status)) {
      archived.push(doc)
      continue
    }

    const type = doc.type
    if (!grouped[type]) continue
    const scope = doc.scope || 'shared'
    if (!grouped[type][scope]) grouped[type][scope] = []
    grouped[type][scope].push(doc)
  }

  const tree = DOC_TYPES.map((type) => ({
    type,
    scopes: grouped[type],
    total: Object.values(grouped[type]).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
  }))

  // Sort planning docs by dateCreated descending (most recent first)
  for (const group of tree) {
    if (group.type === 'planning') {
      for (const scope of Object.values(group.scopes)) {
        scope.sort((a, b) =>
          (b.dateCreated || '').localeCompare(a.dateCreated || '')
        )
      }
    }
  }

  return { tree, archived }
}

// ---------------------------------------------------------------------------
// Relative time formatting
// ---------------------------------------------------------------------------

const TYPE_SHORT: Record<string, string> = {
  planning: 'PLN',
  adr: 'ADR',
  prd: 'PRD',
  task: 'TSK',
  guideline: 'GDL',
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return 'agora'

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`

  const months = Math.floor(days / 30)
  return `${months}m`
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface DocsSidebarProps {
  className?: string
  onDocSelect?: (docId: string) => void
}

const RECENTES_STEP = 5
const RECENTES_STORAGE_KEY = 'living-docs-recentes-limit'

function getStoredRecentesLimit(): number {
  if (typeof window === 'undefined') return RECENTES_STEP
  const stored = localStorage.getItem(RECENTES_STORAGE_KEY)
  const parsed = stored ? parseInt(stored, 10) : NaN
  return parsed >= RECENTES_STEP ? parsed : RECENTES_STEP
}

export function DocsSidebar({ className, onDocSelect }: DocsSidebarProps) {
  const index = useDocsStore((s) => s.index)
  const currentDocId = useDocsStore((s) => s.currentDocId)
  const searchQuery = useDocsStore((s) => s.searchQuery)
  const expandedNodes = useDocsStore((s) => s.expandedNodes)
  const toggleNode = useDocsStore((s) => s.toggleNode)
  const expandAll = useDocsStore((s) => s.expandAll)
  const selectDoc = useDocsStore((s) => s.selectDoc)

  const documents = index?.documents ?? []

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return documents
    return searchDocs(documents, searchQuery)
  }, [documents, searchQuery])

  const { tree, archived } = useMemo(() => buildTree(filtered), [filtered])

  const recentDocs = useMemo(
    () => filtered.filter(d => !ARCHIVED_STATUSES.has(d.status)),
    [filtered]
  )

  // Expand "Recentes" by default on mount
  useEffect(() => {
    if (recentDocs.length > 0 && expandedNodes['__recentes__'] === undefined) {
      expandAll(['__recentes__'])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-expand when searching
  useEffect(() => {
    if (!searchQuery.trim()) return
    const nodeIds: string[] = []
    for (const group of tree) {
      if (group.total > 0) {
        nodeIds.push(group.type)
        for (const scope of Object.keys(group.scopes)) {
          if (group.scopes[scope].length > 0) {
            nodeIds.push(`${group.type}/${scope}`)
          }
        }
      }
    }
    if (archived.length > 0) nodeIds.push('__archived__')
    if (recentDocs.length > 0) nodeIds.push('__recentes__')
    if (nodeIds.length > 0) expandAll(nodeIds)
  }, [searchQuery, tree, archived, recentDocs, expandAll])

  const handleDocClick = (docId: string) => {
    selectDoc(docId)
    onDocSelect?.(docId)
  }

  return (
    <div
      className={`flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/50 ${className ?? ''}`}
    >
      {/* Header + Search */}
      <div className="p-4 space-y-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
          Living Docs
        </h2>
        <DocSearch />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto ldv-scrollbar">
        <div className="py-2 px-1">
          {/* Recentes section */}
          {recentDocs.length > 0 && (
            <RecentesSection
              allDocs={filtered}
              isExpanded={!!expandedNodes['__recentes__']}
              onToggle={() => toggleNode('__recentes__')}
              currentDocId={currentDocId}
              onDocClick={handleDocClick}
            />
          )}

          {/* Type folders */}
          {tree.map((group) => (
            <TypeFolder
              key={group.type}
              group={group}
              isExpanded={!!expandedNodes[group.type]}
              onToggle={() => toggleNode(group.type)}
              expandedNodes={expandedNodes}
              onToggleScope={(scopeId) => toggleNode(scopeId)}
              currentDocId={currentDocId}
              onDocClick={handleDocClick}
            />
          ))}

          {/* Archived section */}
          {archived.length > 0 && (
            <ArchivedSection
              docs={archived}
              isExpanded={!!expandedNodes['__archived__']}
              onToggle={() => toggleNode('__archived__')}
              currentDocId={currentDocId}
              onDocClick={handleDocClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Level 1: Type Folder
// ---------------------------------------------------------------------------

interface TypeFolderProps {
  group: TreeGroup
  isExpanded: boolean
  onToggle: () => void
  expandedNodes: Record<string, boolean>
  onToggleScope: (scopeId: string) => void
  currentDocId: string | null
  onDocClick: (docId: string) => void
}

function TypeFolder({
  group,
  isExpanded,
  onToggle,
  expandedNodes,
  onToggleScope,
  currentDocId,
  onDocClick,
}: TypeFolderProps) {
  const config = TYPE_CONFIG[group.type]
  if (!config) return null

  const Icon = config.icon
  const isEmpty = group.total === 0

  return (
    <div>
      <button
        onClick={isEmpty ? undefined : onToggle}
        className={`flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors mb-0.5 ${
          isEmpty
            ? 'opacity-40 cursor-default'
            : 'cursor-pointer'
        }`}
        disabled={isEmpty}
      >
        {!isEmpty && (
          <ChevronRight
            className={`h-4 w-4 shrink-0 mr-1.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        )}
        {isEmpty && <span className="w-4 mr-1.5 shrink-0" />}
        <span className={`p-1.5 rounded-md mr-2 ${config.bgClass}`}>
          <Icon className={`h-4 w-4 shrink-0 ${config.colorClass}`} />
        </span>
        <span className="font-medium text-sm truncate text-zinc-800 dark:text-zinc-100">
          {config.labelPlural}
        </span>
        <span className="ml-auto shrink-0 pl-2">
          <span className="inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-xs font-semibold tabular-nums rounded-full bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-100">
            {group.total}
          </span>
        </span>
      </button>

      {isExpanded && (
        <div>
          {Object.entries(group.scopes).map(([scope, docs]) => {
            if (docs.length === 0) return null
            const scopeId = `${group.type}/${scope}`
            return (
              <ScopeFolder
                key={scopeId}
                scope={scope}
                docs={docs}
                isExpanded={!!expandedNodes[scopeId]}
                onToggle={() => onToggleScope(scopeId)}
                currentDocId={currentDocId}
                onDocClick={onDocClick}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Level 2: Scope Folder
// ---------------------------------------------------------------------------

interface ScopeFolderProps {
  scope: string
  docs: DocsIndexEntry[]
  isExpanded: boolean
  onToggle: () => void
  currentDocId: string | null
  onDocClick: (docId: string) => void
}

function ScopeFolder({
  scope,
  docs,
  isExpanded,
  onToggle,
  currentDocId,
  onDocClick,
}: ScopeFolderProps) {
  const FolderIcon = isExpanded ? FolderOpen : Folder

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center w-full pl-8 pr-2 py-1.5 text-xs rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer mb-0.5"
      >
        <ChevronRight
          className={`h-3 w-3 shrink-0 mr-1.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
        <FolderIcon className="h-3.5 w-3.5 shrink-0 mr-2 text-zinc-500 dark:text-zinc-300" />
        <span className="font-medium text-zinc-600 dark:text-zinc-200 capitalize truncate">
          {SCOPE_LABELS[scope] ?? scope}
        </span>
        <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400 font-semibold tabular-nums pl-2">
          ({docs.length})
        </span>
      </button>

      {isExpanded && (
        <div>
          {docs.map((doc) => (
            <DocItem
              key={doc.id}
              doc={doc}
              isActive={doc.id === currentDocId}
              onClick={() => onDocClick(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Level 3: Document Item
// ---------------------------------------------------------------------------

interface DocItemProps {
  doc: DocsIndexEntry
  isActive: boolean
  onClick: () => void
}

function DocItem({ doc, isActive, onClick }: DocItemProps) {
  const dotColor = STATUS_DOT[doc.status] ?? STATUS_DOT.superseded ?? 'bg-zinc-400'

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full pl-11 pr-2 py-1.5 text-sm transition-colors cursor-pointer text-left ${
        isActive
          ? 'border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-md'
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/30 rounded-r-md border-l-2 border-transparent'
      }`}
      title={`${doc.id} -- ${doc.title}`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 mr-2.5 ${dotColor}`}
      />
      <span className="truncate flex-1 min-w-0 text-sm text-zinc-700 dark:text-zinc-200">
        {doc.title}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Recentes Section
// ---------------------------------------------------------------------------

interface RecentesSectionProps {
  allDocs: DocsIndexEntry[]
  isExpanded: boolean
  onToggle: () => void
  currentDocId: string | null
  onDocClick: (docId: string) => void
}

function RecentesSection({
  allDocs,
  isExpanded,
  onToggle,
  currentDocId,
  onDocClick,
}: RecentesSectionProps) {
  const [limit, setLimit] = useState(getStoredRecentesLimit)
  const visibleDocs = useMemo(() => getRecentDocs(allDocs, limit), [allDocs, limit])
  const totalAvailable = useMemo(
    () => allDocs.filter(d => !ARCHIVED_STATUSES.has(d.status)).length,
    [allDocs]
  )
  const canShowMore = limit < totalAvailable
  const canShowLess = limit > RECENTES_STEP

  function changeLimit(delta: number) {
    const next = Math.max(RECENTES_STEP, limit + delta)
    setLimit(next)
    localStorage.setItem(RECENTES_STORAGE_KEY, String(next))
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors mb-0.5 cursor-pointer"
      >
        <ChevronRight
          className={`h-4 w-4 shrink-0 mr-1.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
        <span className="p-1.5 rounded-md mr-2 bg-amber-100 dark:bg-amber-900/40">
          <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        </span>
        <span className="font-medium text-sm truncate text-zinc-800 dark:text-zinc-100">
          Recentes
        </span>
        <span className="ml-auto shrink-0 pl-2">
          <span className="inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-xs font-semibold tabular-nums rounded-full bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-100">
            {visibleDocs.length}
          </span>
        </span>
      </button>

      {isExpanded && (
        <div>
          {visibleDocs.map((doc) => (
            <RecentDocItem
              key={doc.id}
              doc={doc}
              isActive={doc.id === currentDocId}
              onClick={() => onDocClick(doc.id)}
            />
          ))}
          {(canShowLess || canShowMore) && (
            <div className="flex items-center pl-8 pr-2 py-1 gap-2">
              {canShowLess && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeLimit(-RECENTES_STEP)
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 rounded-md transition-colors cursor-pointer px-1.5 py-0.5"
                >
                  Ver menos
                </button>
              )}
              {canShowMore && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    changeLimit(+RECENTES_STEP)
                  }}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 rounded-md transition-colors cursor-pointer px-1.5 py-0.5"
                >
                  Ver mais...
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Recent Document Item (compact with type badge + relative time)
// ---------------------------------------------------------------------------

interface RecentDocItemProps {
  doc: DocsIndexEntry
  isActive: boolean
  onClick: () => void
}

function RecentDocItem({ doc, isActive, onClick }: RecentDocItemProps) {
  const dotColor = STATUS_DOT[doc.status] ?? 'bg-zinc-400'
  const typeConfig = TYPE_CONFIG[doc.type]
  const typeColor = typeConfig?.colorClass ?? 'text-zinc-600 dark:text-zinc-300'
  const shortLabel = TYPE_SHORT[doc.type] ?? doc.type.slice(0, 3).toUpperCase()
  const timeAgo = formatRelativeTime(doc.dateModified || doc.dateCreated)

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full pl-8 pr-2 py-1 text-xs transition-colors cursor-pointer text-left ${
        isActive
          ? 'border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-md'
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/30 rounded-r-md border-l-2 border-transparent'
      }`}
      title={`${doc.id} — ${doc.title}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mr-1.5 ${dotColor}`} />
      <span
        className={`shrink-0 mr-1.5 text-[9px] font-bold uppercase leading-none ${typeColor}`}
      >
        {shortLabel}
      </span>
      <span className="truncate flex-1 min-w-0 text-zinc-700 dark:text-zinc-200">
        {doc.title}
      </span>
      {timeAgo && (
        <span className="shrink-0 ml-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 tabular-nums">
          {timeAgo}
        </span>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Archived Section
// ---------------------------------------------------------------------------

interface ArchivedSectionProps {
  docs: DocsIndexEntry[]
  isExpanded: boolean
  onToggle: () => void
  currentDocId: string | null
  onDocClick: (docId: string) => void
}

function ArchivedSection({
  docs,
  isExpanded,
  onToggle,
  currentDocId,
  onDocClick,
}: ArchivedSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors mb-0.5 cursor-pointer mt-2 border-t border-zinc-200 dark:border-zinc-700 pt-3"
      >
        <ChevronRight
          className={`h-4 w-4 shrink-0 mr-1.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
        <span className="p-1.5 rounded-md mr-2 bg-zinc-200 dark:bg-zinc-700/60">
          <Archive className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
        </span>
        <span className="font-medium text-sm truncate text-zinc-500 dark:text-zinc-400">
          Arquivo
        </span>
        <span className="ml-auto shrink-0 pl-2">
          <span className="inline-flex items-center justify-center min-w-[20px] px-1.5 py-0.5 text-xs font-semibold tabular-nums rounded-full bg-zinc-200 dark:bg-zinc-600 text-zinc-500 dark:text-zinc-400">
            {docs.length}
          </span>
        </span>
      </button>

      {isExpanded && (
        <div>
          {docs.map((doc) => (
            <ArchivedDocItem
              key={doc.id}
              doc={doc}
              isActive={doc.id === currentDocId}
              onClick={() => onDocClick(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Archived Document Item
// ---------------------------------------------------------------------------

function ArchivedDocItem({ doc, isActive, onClick }: RecentDocItemProps) {
  const dotColor = STATUS_DOT[doc.status] ?? 'bg-zinc-400'

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full pl-11 pr-2 py-1.5 text-sm transition-colors cursor-pointer opacity-50 text-left ${
        isActive
          ? 'border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-md'
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/30 rounded-r-md border-l-2 border-transparent'
      }`}
      title={`${doc.id} -- ${doc.title} (${doc.status})`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 mr-2.5 ${dotColor}`} />
      <span className="truncate flex-1 min-w-0 text-sm text-zinc-700 dark:text-zinc-200 line-through">
        {doc.title}
      </span>
    </button>
  )
}

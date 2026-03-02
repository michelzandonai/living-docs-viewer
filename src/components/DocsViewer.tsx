import { useEffect } from 'react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { cn } from '@/lib/cn'
import { DocsLayoutShell } from './DocsLayoutShell'
import { DocsSidebar } from './DocsSidebar'
import { DocDetail } from './DocDetail'
import type { DocsViewerProps } from '@/lib/types'
import '@/styles/index.css'

export function DocsViewer({
  apiUrl,
  theme = 'light',
  className,
  onDocSelect,
}: DocsViewerProps) {
  const setApiUrl = useDocsStore((s) => s.setApiUrl)
  const loadIndex = useDocsStore((s) => s.loadIndex)
  const index = useDocsStore((s) => s.index)
  const loading = useDocsStore((s) => s.loading)
  const error = useDocsStore((s) => s.error)
  const currentTheme = useDocsStore((s) => s.theme)
  const setTheme = useDocsStore((s) => s.setTheme)

  // Sync external theme prop with store
  useEffect(() => {
    if (theme === 'light' || theme === 'dark') {
      setTheme(theme)
    }
  }, [theme, setTheme])

  // Load index on mount / apiUrl change
  useEffect(() => {
    setApiUrl(apiUrl)
    loadIndex()
  }, [apiUrl, setApiUrl, loadIndex])

  const themeClass = currentTheme === 'dark' ? 'dark' : ''

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          themeClass,
          'flex items-center justify-center h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100',
          className
        )}
      >
        <div className="text-center p-8">
          <div className="text-4xl mb-4 text-amber-500">!</div>
          <h2 className="text-xl font-semibold mb-2">
            Erro ao carregar documentacao
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">{error}</p>
          <button
            onClick={loadIndex}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Loading state (initial load only)
  if (loading && !index) {
    return (
      <div
        className={cn(
          themeClass,
          'flex items-center justify-center h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100',
          className
        )}
      >
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">
            Carregando documentacao...
          </p>
        </div>
      </div>
    )
  }

  // Empty state (loaded but no documents)
  if (index && index.documents.length === 0) {
    return (
      <div
        className={cn(
          themeClass,
          'flex items-center justify-center h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100',
          className
        )}
      >
        <div className="text-center p-8">
          <div className="text-4xl mb-4 text-zinc-300 dark:text-zinc-600">
            ?
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Nenhum documento encontrado
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            O indice de documentos esta vazio.
          </p>
        </div>
      </div>
    )
  }

  // Main viewer
  return (
    <div className={cn(themeClass, 'h-full', className)}>
      <DocsLayoutShell
        sidebar={<DocsSidebar onDocSelect={onDocSelect} />}
      >
        <DocDetail />
      </DocsLayoutShell>
    </div>
  )
}

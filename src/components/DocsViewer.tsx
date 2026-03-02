import { useEffect } from 'react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { cn } from '@/lib/cn'
import { DocsSidebar } from './DocsSidebar'
import { DocDetail } from './DocDetail'
import type { DocsViewerProps } from '@/lib/types'
import '@/styles/index.css'

export function DocsViewer({ apiUrl, theme = 'light', className, onDocSelect }: DocsViewerProps) {
  const { setApiUrl, loadIndex, index, loading, error } = useDocsStore()

  useEffect(() => {
    setApiUrl(apiUrl)
    loadIndex()
  }, [apiUrl, setApiUrl, loadIndex])

  const themeClass = theme === 'dark' ? 'dark' : ''

  if (error) {
    return (
      <div className={cn(themeClass, 'flex items-center justify-center h-full bg-ldv-bg text-ldv-text', className)}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar documentacao</h2>
          <p className="text-ldv-text-secondary">{error}</p>
          <button
            onClick={loadIndex}
            className="mt-4 px-4 py-2 bg-ldv-accent text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (loading && !index) {
    return (
      <div className={cn(themeClass, 'flex items-center justify-center h-full bg-ldv-bg text-ldv-text', className)}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-ldv-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-ldv-text-secondary">Carregando documentacao...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(themeClass, 'flex h-full bg-ldv-bg text-ldv-text overflow-hidden', className)}>
      <DocsSidebar onDocSelect={onDocSelect} />
      <DocDetail />
    </div>
  )
}

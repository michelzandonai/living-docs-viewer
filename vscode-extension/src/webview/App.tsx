import { useEffect } from 'react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { cn } from '@/lib/cn'
import { DocsSidebar } from '@/components/DocsSidebar'
import { DocDetail } from '@/components/DocDetail'
import { VscodeLayoutShell } from './VscodeLayoutShell'
import { setupStoreBridge } from './setup-store-bridge'
import type { ExtensionToWebviewMessage } from '../shared/messages'

// Acquire VS Code API once
declare function acquireVsCodeApi(): {
  postMessage(msg: unknown): void
  getState(): unknown
  setState(state: unknown): void
}

const vscodeApi = acquireVsCodeApi()

// Setup store bridge before React renders - monkey-patches useDocsStore
setupStoreBridge(vscodeApi)

export function App() {
  const currentTheme = useDocsStore((s) => s.theme)
  const index = useDocsStore((s) => s.index)
  const loading = useDocsStore((s) => s.loading)
  const error = useDocsStore((s) => s.error)

  // Apply dark class on root element
  useEffect(() => {
    const root = document.documentElement
    if (currentTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [currentTheme])

  // Listen for messages from extension
  useEffect(() => {
    const handler = (event: MessageEvent<ExtensionToWebviewMessage>) => {
      const msg = event.data
      switch (msg.type) {
        case 'setIndex':
          useDocsStore.setState({ index: msg.payload as any, loading: false })
          break
        case 'setDoc':
          useDocsStore.setState({ currentDoc: msg.payload as any, loading: false })
          break
        case 'setCatalogs':
          useDocsStore.setState({ catalogs: msg.payload as any })
          break
        case 'setLoading':
          useDocsStore.setState({ loading: msg.payload })
          break
        case 'setError':
          useDocsStore.setState({ error: msg.payload })
          break
        case 'setTheme':
          useDocsStore.getState().setTheme(msg.payload)
          break
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  // Send ready message to extension on mount
  useEffect(() => {
    vscodeApi.postMessage({ type: 'ready' })
  }, [])

  const themeClass = currentTheme === 'dark' ? 'dark' : ''

  if (error) {
    return (
      <div className={cn(themeClass, 'flex items-center justify-center h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100')}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4 text-amber-500">!</div>
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar documentacao</h2>
          <p className="text-zinc-500 dark:text-zinc-400">{error}</p>
          <button
            onClick={() => vscodeApi.postMessage({ type: 'requestIndex' })}
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (loading && !index) {
    return (
      <div className={cn(themeClass, 'flex items-center justify-center h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100')}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">Carregando documentacao...</p>
        </div>
      </div>
    )
  }

  if (index && index.documents.length === 0) {
    return (
      <div className={cn(themeClass, 'flex items-center justify-center h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100')}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4 text-zinc-300 dark:text-zinc-600">?</div>
          <h2 className="text-xl font-semibold mb-2">Nenhum documento encontrado</h2>
          <p className="text-zinc-500 dark:text-zinc-400">O indice de documentos esta vazio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(themeClass, 'h-screen')}>
      <VscodeLayoutShell sidebar={<DocsSidebar />}>
        <DocDetail />
      </VscodeLayoutShell>
    </div>
  )
}

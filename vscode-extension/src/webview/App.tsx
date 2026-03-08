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
    const isNoFolder = error === '__NO_DOCS_FOLDER__'
    return (
      <div className={cn(themeClass, 'flex items-center justify-center h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100')}>
        <div className="text-center p-8 max-w-md">
          {isNoFolder ? (
            <>
              <div className="text-5xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-zinc-400 dark:text-zinc-500">
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
                  <path d="M12 10v4"/>
                  <path d="M12 18h.01"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Pasta de documentacao nao encontrada</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Nenhuma pasta com documentos Living Docs foi detectada automaticamente neste workspace.
              </p>
              <button
                onClick={() => vscodeApi.postMessage({ type: 'selectFolder' })}
                className="px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Selecionar pasta de documentacao
              </button>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-3">
                A escolha sera salva nas configuracoes do projeto.
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4 text-amber-500">!</div>
              <h2 className="text-xl font-semibold mb-2">Erro ao carregar documentacao</h2>
              <p className="text-zinc-500 dark:text-zinc-400">{error}</p>
              <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={() => vscodeApi.postMessage({ type: 'requestIndex' })}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tentar novamente
                </button>
                <button
                  onClick={() => vscodeApi.postMessage({ type: 'selectFolder' })}
                  className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Selecionar pasta
                </button>
              </div>
            </>
          )}
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

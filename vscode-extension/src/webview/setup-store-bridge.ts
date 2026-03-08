import { useDocsStore } from '@/hooks/use-docs-store'

interface VscodeApi {
  postMessage(msg: unknown): void
}

/**
 * Patches the Zustand store so that selectDoc and loadIndex
 * communicate with the VS Code extension via postMessage
 * instead of using fetch().
 *
 * Must be called ONCE before React renders.
 */
export function setupStoreBridge(vscodeApi: VscodeApi): void {
  useDocsStore.setState({
    selectDoc: async (docId: string) => {
      const { index } = useDocsStore.getState()
      if (!index) return

      const entry = index.documents.find((d) => d.id === docId)
      if (!entry) return

      useDocsStore.setState({
        loading: true,
        currentDocId: docId,
      })

      vscodeApi.postMessage({
        type: 'selectDoc',
        payload: { docId, path: entry.path },
      })
    },

    loadIndex: async () => {
      useDocsStore.setState({ loading: true, error: null })
      vscodeApi.postMessage({ type: 'requestIndex' })
      vscodeApi.postMessage({ type: 'requestCatalogs' })
    },

    setApiUrl: () => {},
  } as any)
}

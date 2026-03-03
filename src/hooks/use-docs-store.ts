import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { DocsIndex, Doc, Catalogs, DocType } from '@/lib/types'

interface DocsState {
  // API data
  apiUrl: string
  index: DocsIndex | null
  catalogs: Catalogs | null
  currentDoc: Doc | null
  currentDocId: string | null
  loading: boolean
  error: string | null

  // UI state - search & filter
  searchQuery: string
  typeFilter: DocType | null

  // UI state - tree navigation
  expandedNodes: Record<string, boolean>

  // UI state - theme
  theme: 'light' | 'dark'

  // Actions - API
  setApiUrl: (url: string) => void
  loadIndex: (overrideUrl?: string) => Promise<void>
  selectDoc: (docId: string) => Promise<void>

  // Actions - search & filter
  setSearchQuery: (query: string) => void
  setTypeFilter: (type: DocType | null) => void

  // Actions - tree navigation
  toggleNode: (nodeId: string) => void
  expandAll: (nodeIds: string[]) => void
  collapseAll: () => void

  // Actions - theme
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

import type { StoreApi, UseBoundStore } from 'zustand'

export const useDocsStore: UseBoundStore<StoreApi<DocsState>> = create<DocsState>()(
  immer((set, get) => ({
    // API data
    apiUrl: '',
    index: null,
    catalogs: null,
    currentDoc: null,
    currentDocId: null,
    loading: false,
    error: null,

    // UI state - search & filter
    searchQuery: '',
    typeFilter: null,

    // UI state - tree navigation
    expandedNodes: {},

    // UI state - theme
    theme: (typeof window !== 'undefined' && localStorage.getItem('living-docs-theme') as 'light' | 'dark') || 'light',

    // Actions - API
    setApiUrl: (url) =>
      set((state) => {
        state.apiUrl = url
      }),

    loadIndex: async (overrideUrl?: string) => {
      const apiUrl = overrideUrl || get().apiUrl
      set((state) => {
        state.loading = true
        state.error = null
      })

      try {
        const [indexRes, authorsRes, tagsRes, glossaryRes] = await Promise.all([
          fetch(`${apiUrl}/docs-index.json`),
          fetch(`${apiUrl}/_catalogs/authors.json`),
          fetch(`${apiUrl}/_catalogs/tags.json`),
          fetch(`${apiUrl}/_catalogs/glossary.json`),
        ])

        if (!indexRes.ok) throw new Error(`Falha ao carregar indice: ${indexRes.status}`)

        const index = (await indexRes.json()) as DocsIndex
        const authors = authorsRes.ok ? await authorsRes.json() : {}
        const tags = tagsRes.ok ? await tagsRes.json() : {}
        const glossary = glossaryRes.ok ? await glossaryRes.json() : {}

        set((state) => {
          state.index = index
          state.catalogs = { authors, tags, glossary }
          state.loading = false
        })
      } catch (e) {
        set((state) => {
          state.error = (e as Error).message
          state.loading = false
        })
      }
    },

    selectDoc: async (docId) => {
      const { apiUrl, index } = get()
      if (!index) return

      const entry = index.documents.find((d) => d.id === docId)
      if (!entry) return

      set((state) => {
        state.loading = true
        state.currentDocId = docId
      })

      try {
        const res = await fetch(`${apiUrl}/${entry.path}`)
        if (!res.ok) throw new Error(`Falha ao carregar documento: ${res.status}`)
        const doc = (await res.json()) as Doc

        set((state) => {
          state.currentDoc = doc
          state.loading = false
        })
      } catch (e) {
        set((state) => {
          state.error = (e as Error).message
          state.loading = false
        })
      }
    },

    // Actions - search & filter
    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query
      }),

    setTypeFilter: (type) =>
      set((state) => {
        state.typeFilter = type
      }),

    // Actions - tree navigation
    toggleNode: (nodeId) =>
      set((state) => {
        state.expandedNodes[nodeId] = !state.expandedNodes[nodeId]
      }),

    expandAll: (nodeIds) =>
      set((state) => {
        for (const id of nodeIds) {
          state.expandedNodes[id] = true
        }
      }),

    collapseAll: () =>
      set((state) => {
        state.expandedNodes = {}
      }),

    // Actions - theme
    toggleTheme: () =>
      set((state) => {
        state.theme = state.theme === 'light' ? 'dark' : 'light'
        if (typeof window !== 'undefined') localStorage.setItem('living-docs-theme', state.theme)
      }),

    setTheme: (theme) =>
      set((state) => {
        state.theme = theme
        if (typeof window !== 'undefined') localStorage.setItem('living-docs-theme', theme)
      }),

  }))
)

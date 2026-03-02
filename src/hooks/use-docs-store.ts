import { create } from 'zustand'
import type { DocsIndex, DocsIndexEntry, Doc, Catalogs, DocType } from '@/lib/types'

interface DocsState {
  apiUrl: string
  index: DocsIndex | null
  catalogs: Catalogs | null
  currentDoc: Doc | null
  currentDocId: string | null
  searchQuery: string
  typeFilter: DocType | null
  loading: boolean
  error: string | null

  setApiUrl: (url: string) => void
  setSearchQuery: (query: string) => void
  setTypeFilter: (type: DocType | null) => void
  selectDoc: (docId: string) => Promise<void>
  loadIndex: () => Promise<void>

  filteredDocs: () => DocsIndexEntry[]
}

export const useDocsStore = create<DocsState>((set, get) => ({
  apiUrl: '',
  index: null,
  catalogs: null,
  currentDoc: null,
  currentDocId: null,
  searchQuery: '',
  typeFilter: null,
  loading: false,
  error: null,

  setApiUrl: (url) => set({ apiUrl: url }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setTypeFilter: (type) => set({ typeFilter: type }),

  loadIndex: async () => {
    const { apiUrl } = get()
    set({ loading: true, error: null })
    try {
      const [indexRes, authorsRes, tagsRes, glossaryRes] = await Promise.all([
        fetch(`${apiUrl}/docs-index.json`),
        fetch(`${apiUrl}/_catalogs/authors.json`),
        fetch(`${apiUrl}/_catalogs/tags.json`),
        fetch(`${apiUrl}/_catalogs/glossary.json`),
      ])

      if (!indexRes.ok) throw new Error(`Failed to load index: ${indexRes.status}`)

      const index = await indexRes.json() as DocsIndex
      const authors = authorsRes.ok ? await authorsRes.json() : {}
      const tags = tagsRes.ok ? await tagsRes.json() : {}
      const glossary = glossaryRes.ok ? await glossaryRes.json() : {}

      set({ index, catalogs: { authors, tags, glossary }, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  selectDoc: async (docId) => {
    const { apiUrl, index } = get()
    if (!index) return

    const entry = index.documents.find((d) => d.id === docId)
    if (!entry) return

    set({ loading: true, currentDocId: docId })
    try {
      const res = await fetch(`${apiUrl}/${entry.path}`)
      if (!res.ok) throw new Error(`Failed to load doc: ${res.status}`)
      const doc = await res.json() as Doc
      set({ currentDoc: doc, loading: false })
    } catch (e) {
      set({ error: (e as Error).message, loading: false })
    }
  },

  filteredDocs: () => {
    const { index, searchQuery, typeFilter } = get()
    if (!index) return []

    let docs = index.documents

    if (typeFilter) {
      docs = docs.filter((d) => d.type === typeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      docs = docs.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.tagIds.some((t) => t.toLowerCase().includes(q))
      )
    }

    return docs
  },
}))

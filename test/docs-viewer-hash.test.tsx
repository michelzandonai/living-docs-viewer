// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDocsStore } from '@/hooks/use-docs-store'
import type { DocsIndex } from '@/lib/types'

const mockIndex: DocsIndex = {
  $docSchema: 'energimap-doc/v1',
  generatedAt: '2026-01-01',
  stats: { total: 1, byType: { task: 1 }, byStatus: { active: 1 } },
  documents: [
    {
      id: 'TASK-001',
      type: 'task',
      title: 'Test',
      status: 'active',
      scope: 'shared',
      dateCreated: '2026-01-01',
      tagIds: [],
      summary: '',
      path: 'tasks/TASK-001.json',
    },
  ],
}

const mockDoc = {
  $docSchema: 'energimap-doc/v1',
  type: 'task',
  id: 'TASK-001',
  metadata: {
    title: 'Test',
    status: 'active',
    dateCreated: '2026-01-01',
    authorIds: [],
  },
  sections: [],
}

function stubFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDoc),
      }),
    ),
  )
}

describe('useDocsStore - URL hash sync (comportamento consumido pelo DocsViewer)', () => {
  // Estes testes validam o comportamento de hash sync do store (selectDoc + replaceState)
  // que é consumido pelo useEffect do DocsViewer. Testa o store diretamente porque
  // renderizar DocsViewer requer mock de muitas dependências (index, catalogs, fetch).
  beforeEach(() => {
    useDocsStore.setState({
      apiUrl: 'http://test/api',
      index: null,
      catalogs: null,
      currentDoc: null,
      currentDocId: null,
      loading: false,
      error: null,
      searchQuery: '',
      typeFilter: null,
      expandedNodes: {},
      theme: 'light',
    })
    vi.restoreAllMocks()
  })

  it('hash no mount: lê window.location.hash e chama selectDoc com o docId', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    stubFetch()
    window.location.hash = '#TASK-001'
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

    // Act — simula o que o useEffect do DocsViewer faz no mount
    const hash = window.location.hash.slice(1)
    if (hash) {
      await useDocsStore.getState().selectDoc(hash)
    }

    // Assert
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '#TASK-001')
    expect(useDocsStore.getState().currentDocId).toBe('TASK-001')
  })

  it('hashchange: dispara selectDoc com o novo hash quando evento é recebido', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    stubFetch()
    window.location.hash = ''
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

    // Registra o listener igual ao DocsViewer
    let newHash = ''
    const onHashChange = async () => {
      newHash = window.location.hash.slice(1)
      if (newHash) {
        await useDocsStore.getState().selectDoc(newHash)
      }
    }
    window.addEventListener('hashchange', onHashChange)

    // Act
    window.location.hash = '#TASK-001'
    await window.dispatchEvent(new HashChangeEvent('hashchange'))
    // aguarda promises pendentes do handler
    await new Promise((r) => setTimeout(r, 0))

    // Assert
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '#TASK-001')
    expect(useDocsStore.getState().currentDocId).toBe('TASK-001')

    window.removeEventListener('hashchange', onHashChange)
  })

  it('URL preserva doc selecionado: após selectDoc, window.location.hash contém o docId', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    stubFetch()

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    expect(window.location.hash).toBe('#TASK-001')
  })

  it('sem hash na URL: nenhum doc é selecionado automaticamente no mount', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    stubFetch()
    window.location.hash = ''
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

    // Act — simula o que o useEffect do DocsViewer faz no mount
    const hash = window.location.hash.slice(1)
    if (hash) {
      await useDocsStore.getState().selectDoc(hash)
    }

    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled()
    expect(useDocsStore.getState().currentDocId).toBeNull()
  })
})

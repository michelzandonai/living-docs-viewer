// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDocsStore } from '@/hooks/use-docs-store'

const mockIndex = {
  $docSchema: 'energimap-doc/v1' as const,
  generatedAt: '2026-01-01',
  stats: { total: 1, byType: {}, byStatus: {} },
  documents: [
    {
      id: 'TASK-001',
      type: 'task' as const,
      title: 'Test',
      status: 'active' as const,
      scope: 'shared' as const,
      dateCreated: '2026-01-01',
      tagIds: [],
      summary: '',
      path: 'tasks/TASK-001.json',
    },
  ],
}

const mockDoc = {
  $docSchema: 'energimap-doc/v1',
  id: 'TASK-001',
  type: 'task',
  title: 'Test',
  status: 'active',
  scope: 'shared',
  dateCreated: '2026-01-01',
  tagIds: [],
  summary: '',
  path: 'tasks/TASK-001.json',
}

describe('URL Sync - selectDoc', () => {
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

  it('atualiza URL hash via replaceState quando doc existe no index', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockDoc,
      }),
    )

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '#TASK-001')
  })

  it('seta loading=true e currentDocId antes de fazer fetch quando doc existe', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    let loadingDuringFetch = false
    let currentDocIdDuringFetch: string | null = null
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        loadingDuringFetch = useDocsStore.getState().loading
        currentDocIdDuringFetch = useDocsStore.getState().currentDocId
        return { ok: true, json: async () => mockDoc }
      }),
    )

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    expect(loadingDuringFetch).toBe(true)
    expect(currentDocIdDuringFetch).toBe('TASK-001')
  })

  it('nao faz nada se index e null', async () => {
    // Arrange
    useDocsStore.setState({ index: null })
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(useDocsStore.getState().currentDocId).toBeNull()
  })

  it('nao faz nada se docId nao existe no index', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    // Act
    await useDocsStore.getState().selectDoc('TASK-999')

    // Assert
    expect(replaceStateSpy).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(useDocsStore.getState().currentDocId).toBeNull()
  })

  it('seta error quando fetch retorna ok:false', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ))

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    const state = useDocsStore.getState()
    expect(state.error).not.toBeNull()
    expect(state.loading).toBe(false)
  })

  it('seta currentDoc e loading=false apos fetch bem-sucedido', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockDoc) })
    ))

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    const state = useDocsStore.getState()
    expect(state.currentDoc).not.toBeNull()
    expect((state.currentDoc as { id: string }).id).toBe('TASK-001')
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('seta error quando fetch rejeita (network error)', async () => {
    // Arrange
    useDocsStore.setState({ index: mockIndex })
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))))

    // Act
    await useDocsStore.getState().selectDoc('TASK-001')

    // Assert
    const state = useDocsStore.getState()
    expect(state.error).toBe('Network error')
    expect(state.loading).toBe(false)
  })
})

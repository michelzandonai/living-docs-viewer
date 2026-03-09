import { describe, it, expect } from 'vitest'
import { getRecentDocs } from '../src/lib/recent-docs'
import type { DocsIndexEntry } from '../src/lib/types'

function criarDoc(overrides: Partial<DocsIndexEntry> = {}): DocsIndexEntry {
  return {
    id: overrides.id ?? 'TASK-001',
    type: overrides.type ?? 'task',
    title: overrides.title ?? 'Documento de teste',
    status: overrides.status ?? 'done',
    scope: overrides.scope ?? 'api',
    dateCreated: overrides.dateCreated ?? '2025-12-01',
    dateModified: overrides.dateModified,
    _fileMtime: overrides._fileMtime,
    tagIds: overrides.tagIds ?? [],
    summary: overrides.summary ?? 'Resumo de teste',
    path: overrides.path ?? 'tasks/TASK-001.json',
  }
}

describe('getRecentDocs - Documentos Recentes', () => {
  const documentosBase: DocsIndexEntry[] = [
    criarDoc({
      id: 'TASK-001',
      type: 'task',
      dateCreated: '2025-12-01',
      status: 'done',
    }),
    criarDoc({
      id: 'TASK-002',
      type: 'task',
      dateCreated: '2025-12-15',
      status: 'done',
    }),
    criarDoc({
      id: 'ADR-001',
      type: 'adr',
      dateCreated: '2025-11-01',
      status: 'accepted',
    }),
    criarDoc({
      id: 'PRD-001',
      type: 'prd',
      dateCreated: '2025-12-20',
      status: 'approved',
    }),
    criarDoc({
      id: 'GUIDELINE-001',
      type: 'guideline',
      dateCreated: '2025-10-01',
      status: 'active',
    }),
    criarDoc({
      id: 'TASK-003',
      type: 'task',
      dateCreated: '2026-01-05',
      status: 'done',
    }),
    criarDoc({
      id: 'PLANNING-001',
      type: 'planning',
      dateCreated: '2026-01-10',
      status: 'active',
    }),
  ]

  describe('Filtragem', () => {
    it('filtra documentos com status deprecated', () => {
      const docs = [
        ...documentosBase,
        criarDoc({
          id: 'TASK-DEPRECATED',
          type: 'task',
          dateCreated: '2026-02-01',
          status: 'deprecated',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      const ids = resultado.map((d) => d.id)
      expect(ids).not.toContain('TASK-DEPRECATED')
    })

    it('filtra documentos com status superseded', () => {
      const docs = [
        ...documentosBase,
        criarDoc({
          id: 'ADR-SUPERSEDED',
          type: 'adr',
          dateCreated: '2026-02-01',
          status: 'superseded',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      const ids = resultado.map((d) => d.id)
      expect(ids).not.toContain('ADR-SUPERSEDED')
    })

    it('mantem documentos com outros status (done, active, accepted, approved)', () => {
      const resultado = getRecentDocs(documentosBase, 10)
      expect(resultado.length).toBe(documentosBase.length)
    })
  })

  describe('Ordenacao', () => {
    it('ordena por data (mais recente primeiro)', () => {
      const resultado = getRecentDocs(documentosBase, 10)
      expect(resultado[0].id).toBe('PLANNING-001') // 2026-01-10
      expect(resultado[1].id).toBe('TASK-003') // 2026-01-05
      expect(resultado[2].id).toBe('PRD-001') // 2025-12-20
    })

    it('usa dateModified quando disponivel', () => {
      const docs = [
        criarDoc({
          id: 'TASK-OLD-CREATED',
          type: 'task',
          dateCreated: '2025-01-01',
          dateModified: '2026-03-01',
          status: 'done',
        }),
        criarDoc({
          id: 'TASK-NEW-CREATED',
          type: 'task',
          dateCreated: '2026-02-01',
          status: 'done',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      // TASK-OLD-CREATED tem dateModified 2026-03-01, entao vem primeiro
      expect(resultado[0].id).toBe('TASK-OLD-CREATED')
      expect(resultado[1].id).toBe('TASK-NEW-CREATED')
    })

    it('prioridade por tipo quando datas sao iguais (planning > task > prd > adr > guideline)', () => {
      const docs = [
        criarDoc({
          id: 'GUIDELINE-X',
          type: 'guideline',
          dateCreated: '2026-01-01',
          status: 'active',
        }),
        criarDoc({
          id: 'ADR-X',
          type: 'adr',
          dateCreated: '2026-01-01',
          status: 'accepted',
        }),
        criarDoc({
          id: 'PRD-X',
          type: 'prd',
          dateCreated: '2026-01-01',
          status: 'approved',
        }),
        criarDoc({
          id: 'TASK-X',
          type: 'task',
          dateCreated: '2026-01-01',
          status: 'done',
        }),
        criarDoc({
          id: 'PLANNING-X',
          type: 'planning',
          dateCreated: '2026-01-01',
          status: 'active',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      expect(resultado[0].id).toBe('PLANNING-X')
      expect(resultado[1].id).toBe('TASK-X')
      expect(resultado[2].id).toBe('PRD-X')
      expect(resultado[3].id).toBe('ADR-X')
      expect(resultado[4].id).toBe('GUIDELINE-X')
    })
  })

  describe('Limite', () => {
    it('respeita limite padrao de 5', () => {
      const resultado = getRecentDocs(documentosBase)
      expect(resultado).toHaveLength(5)
    })

    it('respeita limite personalizado', () => {
      const resultado = getRecentDocs(documentosBase, 3)
      expect(resultado).toHaveLength(3)
    })

    it('retorna todos quando limite e maior que o total', () => {
      const resultado = getRecentDocs(documentosBase, 100)
      expect(resultado).toHaveLength(documentosBase.length)
    })

    it('retorna array vazio para lista vazia', () => {
      const resultado = getRecentDocs([])
      expect(resultado).toHaveLength(0)
      expect(resultado).toEqual([])
    })

    it('retorna array vazio quando todos sao deprecated/superseded', () => {
      const docs = [
        criarDoc({ id: 'D1', status: 'deprecated' }),
        criarDoc({ id: 'D2', status: 'superseded' }),
      ]
      const resultado = getRecentDocs(docs, 10)
      expect(resultado).toHaveLength(0)
    })
  })

  describe('Prioridade de datas (dateModified > _fileMtime > dateCreated)', () => {
    it('dateModified tem prioridade sobre _fileMtime', () => {
      const docs = [
        criarDoc({
          id: 'DOC-A',
          type: 'task',
          dateCreated: '2025-01-01',
          dateModified: '2026-03-08T14:00:00',
          _fileMtime: '2026-01-01T00:00:00',
          status: 'done',
        }),
        criarDoc({
          id: 'DOC-B',
          type: 'task',
          dateCreated: '2025-01-01',
          _fileMtime: '2026-03-09T00:00:00',
          status: 'done',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      // DOC-B tem _fileMtime mais recente, mas DOC-A tem dateModified
      // DOC-B sem dateModified usa _fileMtime (2026-03-09) > DOC-A dateModified (2026-03-08)
      expect(resultado[0].id).toBe('DOC-B')
      expect(resultado[1].id).toBe('DOC-A')
    })

    it('dateModified vence _fileMtime mesmo quando _fileMtime e mais recente', () => {
      const docs = [
        criarDoc({
          id: 'DOC-X',
          type: 'adr',
          dateCreated: '2025-01-01',
          dateModified: '2026-06-01T00:00:00',
          _fileMtime: '2026-01-01T00:00:00',
          status: 'accepted',
        }),
        criarDoc({
          id: 'DOC-Y',
          type: 'adr',
          dateCreated: '2025-01-01',
          dateModified: '2026-05-01T00:00:00',
          _fileMtime: '2026-12-01T00:00:00',
          status: 'accepted',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      // DOC-X dateModified 2026-06 > DOC-Y dateModified 2026-05
      // _fileMtime e ignorado quando dateModified existe
      expect(resultado[0].id).toBe('DOC-X')
      expect(resultado[1].id).toBe('DOC-Y')
    })

    it('_fileMtime e usado como fallback quando dateModified nao existe', () => {
      const docs = [
        criarDoc({
          id: 'DOC-NO-MOD',
          type: 'task',
          dateCreated: '2025-01-01',
          _fileMtime: '2026-03-08T10:00:00',
          status: 'done',
        }),
        criarDoc({
          id: 'DOC-OLD-MTIME',
          type: 'task',
          dateCreated: '2025-01-01',
          _fileMtime: '2026-01-01T00:00:00',
          status: 'done',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      expect(resultado[0].id).toBe('DOC-NO-MOD')
      expect(resultado[1].id).toBe('DOC-OLD-MTIME')
    })

    it('dateCreated e ultimo recurso quando nao ha dateModified nem _fileMtime', () => {
      const docs = [
        criarDoc({
          id: 'DOC-ONLY-CREATED-OLD',
          type: 'task',
          dateCreated: '2025-01-01',
          status: 'done',
        }),
        criarDoc({
          id: 'DOC-ONLY-CREATED-NEW',
          type: 'task',
          dateCreated: '2026-06-01',
          status: 'done',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      expect(resultado[0].id).toBe('DOC-ONLY-CREATED-NEW')
      expect(resultado[1].id).toBe('DOC-ONLY-CREATED-OLD')
    })

    it('doc com dateModified recente aparece antes de doc com apenas _fileMtime recente', () => {
      const docs = [
        criarDoc({
          id: 'EDITED-TODAY',
          type: 'adr',
          dateCreated: '2025-01-01',
          dateModified: '2026-03-08T15:00:00',
          status: 'accepted',
        }),
        criarDoc({
          id: 'SAVED-YESTERDAY',
          type: 'adr',
          dateCreated: '2025-01-01',
          _fileMtime: '2026-03-07T15:00:00',
          status: 'accepted',
        }),
        criarDoc({
          id: 'ANCIENT',
          type: 'adr',
          dateCreated: '2024-01-01',
          status: 'accepted',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      expect(resultado[0].id).toBe('EDITED-TODAY')
      expect(resultado[1].id).toBe('SAVED-YESTERDAY')
      expect(resultado[2].id).toBe('ANCIENT')
    })

    it('cenario real: hook atualiza dateModified no save, doc sobe para recentes', () => {
      const docs = [
        criarDoc({
          id: 'ADR-UPDATED',
          type: 'adr',
          dateCreated: '2025-06-01',
          dateModified: '2026-03-08T15:30:00', // hook atualizou agora
          _fileMtime: '2026-03-08T15:30:01',   // filesystem mtime ~igual
          status: 'accepted',
        }),
        criarDoc({
          id: 'ADR-RECENT-FILE',
          type: 'adr',
          dateCreated: '2026-03-07',
          _fileMtime: '2026-03-07T10:00:00',
          status: 'accepted',
        }),
        criarDoc({
          id: 'ADR-OLD',
          type: 'adr',
          dateCreated: '2025-01-01',
          dateModified: '2025-01-01T00:00:00',
          status: 'accepted',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      // ADR-UPDATED aparece primeiro (dateModified mais recente)
      expect(resultado[0].id).toBe('ADR-UPDATED')
      expect(resultado[1].id).toBe('ADR-RECENT-FILE')
      expect(resultado[2].id).toBe('ADR-OLD')
    })
  })

  describe('Casos Especiais', () => {
    it('documentos sem dateModified usam dateCreated para ordenacao', () => {
      const docs = [
        criarDoc({
          id: 'A',
          type: 'task',
          dateCreated: '2026-01-01',
          status: 'done',
        }),
        criarDoc({
          id: 'B',
          type: 'task',
          dateCreated: '2026-02-01',
          status: 'done',
        }),
      ]

      const resultado = getRecentDocs(docs, 10)
      expect(resultado[0].id).toBe('B')
      expect(resultado[1].id).toBe('A')
    })

    it('nao modifica o array original', () => {
      const docs = [...documentosBase]
      const docsOriginal = [...docs]
      getRecentDocs(docs, 3)
      // Verifica que o array original nao foi alterado
      expect(docs.map((d) => d.id)).toEqual(docsOriginal.map((d) => d.id))
    })
  })
})

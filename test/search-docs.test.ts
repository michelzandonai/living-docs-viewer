import { describe, it, expect } from 'vitest'
import { searchDocs } from '../src/lib/search-docs'
import type { DocsIndexEntry } from '../src/lib/types'

function criarDoc(overrides: Partial<DocsIndexEntry> = {}): DocsIndexEntry {
  return {
    id: overrides.id ?? 'TASK-001',
    type: overrides.type ?? 'task',
    title: overrides.title ?? 'Adicionar materiais na OS',
    status: overrides.status ?? 'done',
    scope: overrides.scope ?? 'api',
    dateCreated: overrides.dateCreated ?? '2025-12-01',
    tagIds: overrides.tagIds ?? ['material', 'service-order'],
    summary: overrides.summary ?? 'Implementar adição de materiais na ordem de serviço',
    path: overrides.path ?? 'tasks/TASK-001.json',
  }
}

const documentosDeTeste: DocsIndexEntry[] = [
  criarDoc({
    id: 'ADR-001',
    type: 'adr',
    title: 'Migração de Stored Procedures',
    tagIds: ['migration', 'database'],
    summary: 'Decisão sobre migração de stored procedures para a aplicação',
  }),
  criarDoc({
    id: 'PRD-001',
    type: 'prd',
    title: 'Conclusão de Ligação Nova',
    tagIds: ['new-connection', 'service-order'],
    summary: 'Requisitos para conclusão de ligação nova',
  }),
  criarDoc({
    id: 'TASK-001',
    type: 'task',
    title: 'Adicionar materiais na OS',
    tagIds: ['material', 'service-order'],
    summary: 'Implementar adição de materiais na ordem de serviço',
  }),
  criarDoc({
    id: 'TASK-002',
    type: 'task',
    title: 'Cadastrar lacres',
    tagIds: ['seal', 'registration'],
    summary: 'Implementar cadastro de lacres no sistema',
  }),
  criarDoc({
    id: 'GUIDELINE-001',
    type: 'guideline',
    title: 'Implementação de Use Cases',
    tagIds: ['clean-architecture', 'usecase'],
    summary: 'Guia para implementação de casos de uso seguindo clean architecture',
  }),
  criarDoc({
    id: 'TASK-047',
    type: 'task',
    title: 'Religação 080',
    tagIds: ['reconnection', 'service-order'],
    summary: 'Implementação da religação tipo 080',
  }),
]

describe('searchDocs - Busca de Documentos', () => {
  it('busca por titulo (case insensitive)', () => {
    const resultado = searchDocs(documentosDeTeste, 'materiais')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('TASK-001')
  })

  it('busca por titulo em MAIUSCULAS encontra resultado', () => {
    const resultado = searchDocs(documentosDeTeste, 'MATERIAIS')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('TASK-001')
  })

  it('busca por titulo com case misto encontra resultado', () => {
    const resultado = searchDocs(documentosDeTeste, 'Materiais')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('TASK-001')
  })

  it('busca por ID do documento', () => {
    const resultado = searchDocs(documentosDeTeste, 'ADR-001')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('ADR-001')
  })

  it('busca por ID parcial do documento', () => {
    const resultado = searchDocs(documentosDeTeste, 'TASK-00')
    expect(resultado).toHaveLength(2)
    const ids = resultado.map((d) => d.id)
    expect(ids).toContain('TASK-001')
    expect(ids).toContain('TASK-002')
  })

  it('busca por tags', () => {
    const resultado = searchDocs(documentosDeTeste, 'migration')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('ADR-001')
  })

  it('busca por tag parcial', () => {
    const resultado = searchDocs(documentosDeTeste, 'service-order')
    expect(resultado.length).toBeGreaterThanOrEqual(2)
    const ids = resultado.map((d) => d.id)
    expect(ids).toContain('PRD-001')
    expect(ids).toContain('TASK-001')
  })

  it('busca insensivel a acentos ("acao" encontra "ação")', () => {
    // "Migração" no titulo deve ser encontrado com "migracao"
    const resultado = searchDocs(documentosDeTeste, 'migracao')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('ADR-001')
  })

  it('busca com acentos encontra texto sem acentos', () => {
    // "Religação" no titulo, buscando "religação"
    const resultado = searchDocs(documentosDeTeste, 'religação')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('TASK-047')
  })

  it('busca com query vazia retorna todos os documentos', () => {
    const resultado = searchDocs(documentosDeTeste, '')
    expect(resultado).toHaveLength(documentosDeTeste.length)
  })

  it('busca com query somente espacos retorna todos os documentos', () => {
    const resultado = searchDocs(documentosDeTeste, '   ')
    expect(resultado).toHaveLength(documentosDeTeste.length)
  })

  it('busca sem resultado retorna array vazio', () => {
    const resultado = searchDocs(documentosDeTeste, 'xyz-inexistente-abc')
    expect(resultado).toHaveLength(0)
    expect(resultado).toEqual([])
  })

  it('busca por summary do documento', () => {
    const resultado = searchDocs(documentosDeTeste, 'clean architecture')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('GUIDELINE-001')
  })

  it('busca retorna os documentos originais sem modificacao', () => {
    const resultado = searchDocs(documentosDeTeste, 'lacres')
    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toBe(documentosDeTeste[3]) // referencia ao mesmo objeto
  })

  it('busca em lista vazia retorna array vazio', () => {
    const resultado = searchDocs([], 'qualquer coisa')
    expect(resultado).toHaveLength(0)
  })
})

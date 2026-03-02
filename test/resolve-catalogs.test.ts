import { describe, it, expect } from 'vitest'
import { resolveAuthors, resolveTags } from '../src/lib/resolve-catalogs'
import type { AuthorsCatalog, TagsCatalog } from '../src/lib/types'

describe('resolveAuthors - Resolucao de Autores', () => {
  const catalogoAutores: AuthorsCatalog = {
    michel: { name: 'Michel Zandonai', role: 'developer' },
    joao: { name: 'Joao Silva', role: 'tech-lead' },
    maria: { name: 'Maria Souza', role: 'product-owner' },
  }

  it('mapeia IDs para nomes dos autores', () => {
    const resultado = resolveAuthors(['michel', 'joao'], catalogoAutores)
    expect(resultado).toEqual(['Michel Zandonai', 'Joao Silva'])
  })

  it('mapeia um unico autor', () => {
    const resultado = resolveAuthors(['maria'], catalogoAutores)
    expect(resultado).toEqual(['Maria Souza'])
  })

  it('faz fallback para o ID quando autor nao esta no catalogo', () => {
    const resultado = resolveAuthors(['michel', 'desconhecido'], catalogoAutores)
    expect(resultado).toEqual(['Michel Zandonai', 'desconhecido'])
  })

  it('retorna todos IDs como fallback quando catalogo esta vazio', () => {
    const resultado = resolveAuthors(['michel', 'joao'], {})
    expect(resultado).toEqual(['michel', 'joao'])
  })

  it('retorna array vazio para lista vazia de IDs', () => {
    const resultado = resolveAuthors([], catalogoAutores)
    expect(resultado).toEqual([])
    expect(resultado).toHaveLength(0)
  })

  it('preserva a ordem dos IDs informados', () => {
    const resultado = resolveAuthors(
      ['maria', 'michel', 'joao'],
      catalogoAutores
    )
    expect(resultado).toEqual([
      'Maria Souza',
      'Michel Zandonai',
      'Joao Silva',
    ])
  })

  it('funciona com IDs duplicados', () => {
    const resultado = resolveAuthors(
      ['michel', 'michel'],
      catalogoAutores
    )
    expect(resultado).toEqual(['Michel Zandonai', 'Michel Zandonai'])
  })
})

describe('resolveTags - Resolucao de Tags', () => {
  const catalogoTags: TagsCatalog = {
    'clean-architecture': { label: 'Clean Architecture', category: 'architecture' },
    migration: { label: 'Migração', category: 'process' },
    'service-order': { label: 'Ordem de Serviço', category: 'domain' },
    database: { label: 'Banco de Dados', category: 'technology' },
  }

  it('mapeia IDs para labels e categorias', () => {
    const resultado = resolveTags(
      ['clean-architecture', 'migration'],
      catalogoTags
    )
    expect(resultado).toEqual([
      { id: 'clean-architecture', label: 'Clean Architecture', category: 'architecture' },
      { id: 'migration', label: 'Migração', category: 'process' },
    ])
  })

  it('mapeia uma unica tag', () => {
    const resultado = resolveTags(['database'], catalogoTags)
    expect(resultado).toEqual([
      { id: 'database', label: 'Banco de Dados', category: 'technology' },
    ])
  })

  it('faz fallback gracioso para tags inexistentes', () => {
    const resultado = resolveTags(
      ['clean-architecture', 'tag-inexistente'],
      catalogoTags
    )
    expect(resultado).toHaveLength(2)
    expect(resultado[0]).toEqual({
      id: 'clean-architecture',
      label: 'Clean Architecture',
      category: 'architecture',
    })
    expect(resultado[1]).toEqual({
      id: 'tag-inexistente',
      label: 'tag-inexistente',
      category: 'other',
    })
  })

  it('retorna fallback para todas tags quando catalogo esta vazio', () => {
    const resultado = resolveTags(['migration', 'database'], {})
    expect(resultado).toEqual([
      { id: 'migration', label: 'migration', category: 'other' },
      { id: 'database', label: 'database', category: 'other' },
    ])
  })

  it('retorna array vazio para lista vazia de IDs', () => {
    const resultado = resolveTags([], catalogoTags)
    expect(resultado).toEqual([])
    expect(resultado).toHaveLength(0)
  })

  it('preserva a ordem dos IDs informados', () => {
    const resultado = resolveTags(
      ['database', 'migration', 'clean-architecture'],
      catalogoTags
    )
    expect(resultado[0].id).toBe('database')
    expect(resultado[1].id).toBe('migration')
    expect(resultado[2].id).toBe('clean-architecture')
  })

  it('cada resultado contem id, label e category', () => {
    const resultado = resolveTags(['service-order'], catalogoTags)
    expect(resultado[0]).toHaveProperty('id')
    expect(resultado[0]).toHaveProperty('label')
    expect(resultado[0]).toHaveProperty('category')
    expect(resultado[0].id).toBe('service-order')
    expect(resultado[0].label).toBe('Ordem de Serviço')
    expect(resultado[0].category).toBe('domain')
  })
})

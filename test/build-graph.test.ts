import { describe, it, expect } from 'vitest'
import { buildGraph } from '../src/lib/build-graph'
import type { DocsIndex } from '../src/lib/types'

function criarIndex(overrides: Partial<DocsIndex> = {}): DocsIndex {
  return {
    $docSchema: 'energimap-doc/v1',
    generatedAt: '2026-01-01T00:00:00Z',
    stats: overrides.stats ?? {
      total: 0,
      byType: {},
      byStatus: {},
    },
    documents: overrides.documents ?? [],
    graph: overrides.graph,
  }
}

describe('buildGraph - Construcao do Grafo de Dependencias', () => {
  describe('Construcao de Nodes', () => {
    it('cria nodes a partir dos documentos no index.graph', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
          {
            id: 'TASK-001',
            type: 'task',
            title: 'Task 001',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-10',
            tagIds: [],
            summary: '',
            path: 'tasks/TASK-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
            { id: 'TASK-001', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [],
        },
      })

      const result = buildGraph(index)
      expect(result.nodes).toHaveLength(2)

      const nodeIds = result.nodes.map((n) => n.id)
      expect(nodeIds).toContain('ADR-001')
      expect(nodeIds).toContain('TASK-001')
    })

    it('cada node tem posicao x e y definidos pelo dagre', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
          ],
          edges: [],
        },
      })

      const result = buildGraph(index)
      expect(result.nodes[0].position).toBeDefined()
      expect(typeof result.nodes[0].position.x).toBe('number')
      expect(typeof result.nodes[0].position.y).toBe('number')
    })

    it('nodes contem data com label, type, scope, status, isGhost e isCurrent', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
          ],
          edges: [],
        },
      })

      const result = buildGraph(index)
      const nodeData = result.nodes[0].data
      expect(nodeData.label).toBe('ADR-001')
      expect(nodeData.type).toBe('adr')
      expect(nodeData.scope).toBe('api')
      expect(nodeData.status).toBe('accepted')
      expect(nodeData.isGhost).toBe(false)
      expect(nodeData.isCurrent).toBe(false)
    })
  })

  describe('Construcao de Edges', () => {
    it('cria edges a partir das referencias no index.graph', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
          {
            id: 'TASK-001',
            type: 'task',
            title: 'Task 001',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-10',
            tagIds: [],
            summary: '',
            path: 'tasks/TASK-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
            { id: 'TASK-001', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [
            {
              source: 'TASK-001',
              target: 'ADR-001',
              type: 'implements',
            },
          ],
        },
      })

      const result = buildGraph(index)
      expect(result.edges).toHaveLength(1)
      expect(result.edges[0].source).toBe('TASK-001')
      expect(result.edges[0].target).toBe('ADR-001')
      expect(result.edges[0].label).toBe('implements')
    })

    it('edges do tipo depends_on sao animadas', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'A',
            type: 'task',
            title: 'A',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/A.json',
          },
          {
            id: 'B',
            type: 'task',
            title: 'B',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/B.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'A', type: 'task', scope: 'api', status: 'done' },
            { id: 'B', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [{ source: 'A', target: 'B', type: 'depends_on' }],
        },
      })

      const result = buildGraph(index)
      expect(result.edges[0].animated).toBe(true)
    })

    it('edges de outros tipos nao sao animadas', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'A',
            type: 'task',
            title: 'A',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/A.json',
          },
          {
            id: 'B',
            type: 'task',
            title: 'B',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/B.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'A', type: 'task', scope: 'api', status: 'done' },
            { id: 'B', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [{ source: 'A', target: 'B', type: 'references' }],
        },
      })

      const result = buildGraph(index)
      expect(result.edges[0].animated).toBe(false)
    })

    it('cada edge tem ID unico no formato e-{index}', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'A',
            type: 'task',
            title: 'A',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/A.json',
          },
          {
            id: 'B',
            type: 'task',
            title: 'B',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/B.json',
          },
          {
            id: 'C',
            type: 'task',
            title: 'C',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/C.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'A', type: 'task', scope: 'api', status: 'done' },
            { id: 'B', type: 'task', scope: 'api', status: 'done' },
            { id: 'C', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [
            { source: 'A', target: 'B', type: 'references' },
            { source: 'B', target: 'C', type: 'implements' },
          ],
        },
      })

      const result = buildGraph(index)
      expect(result.edges[0].id).toBe('e-0')
      expect(result.edges[1].id).toBe('e-1')
    })
  })

  describe('Documento Atual (currentDocId)', () => {
    it('marca o node do documento atual com isCurrent = true', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
          {
            id: 'TASK-001',
            type: 'task',
            title: 'Task 001',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-10',
            tagIds: [],
            summary: '',
            path: 'tasks/TASK-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
            { id: 'TASK-001', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [],
        },
      })

      const result = buildGraph(index, 'ADR-001')
      const adrNode = result.nodes.find((n) => n.id === 'ADR-001')
      const taskNode = result.nodes.find((n) => n.id === 'TASK-001')
      expect(adrNode?.data.isCurrent).toBe(true)
      expect(taskNode?.data.isCurrent).toBe(false)
    })

    it('nenhum node e marcado como current quando currentDocId nao e informado', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
          ],
          edges: [],
        },
      })

      const result = buildGraph(index)
      expect(result.nodes.every((n) => n.data.isCurrent === false)).toBe(true)
    })
  })

  describe('Ghost Nodes (referenciados mas nao no index)', () => {
    it('marca nodes como ghost quando nao estao nos documents do index', () => {
      const index = criarIndex({
        documents: [
          // Apenas ADR-001 esta nos documents
          {
            id: 'ADR-001',
            type: 'adr',
            title: 'ADR 001',
            status: 'accepted',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'adr/ADR-001.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'ADR-001', type: 'adr', scope: 'api', status: 'accepted' },
            // EXTERNAL-001 esta no grafo mas nao nos documents
            { id: 'EXTERNAL-001', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [
            { source: 'ADR-001', target: 'EXTERNAL-001', type: 'references' },
          ],
        },
      })

      const result = buildGraph(index)
      const adrNode = result.nodes.find((n) => n.id === 'ADR-001')
      const ghostNode = result.nodes.find((n) => n.id === 'EXTERNAL-001')

      expect(adrNode?.data.isGhost).toBe(false)
      expect(ghostNode?.data.isGhost).toBe(true)
    })

    it('ghost node tem todos os campos de data preenchidos', () => {
      const index = criarIndex({
        documents: [],
        graph: {
          nodes: [
            { id: 'GHOST-001', type: 'task', scope: 'api', status: 'unknown' },
          ],
          edges: [],
        },
      })

      const result = buildGraph(index)
      const ghostNode = result.nodes[0]
      expect(ghostNode.data.label).toBe('GHOST-001')
      expect(ghostNode.data.type).toBe('task')
      expect(ghostNode.data.scope).toBe('api')
      expect(ghostNode.data.status).toBe('unknown')
      expect(ghostNode.data.isGhost).toBe(true)
    })
  })

  describe('Index Vazio', () => {
    it('retorna nodes e edges vazios quando index nao tem graph', () => {
      const index = criarIndex({
        documents: [],
      })
      // graph e undefined por padrao

      const result = buildGraph(index)
      expect(result.nodes).toEqual([])
      expect(result.edges).toEqual([])
    })

    it('retorna nodes e edges vazios quando graph tem arrays vazios', () => {
      const index = criarIndex({
        documents: [],
        graph: {
          nodes: [],
          edges: [],
        },
      })

      const result = buildGraph(index)
      expect(result.nodes).toEqual([])
      expect(result.edges).toEqual([])
    })
  })

  describe('Tipo do Node', () => {
    it('todos os nodes tem type "docNode"', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'A',
            type: 'task',
            title: 'A',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/A.json',
          },
        ],
        graph: {
          nodes: [{ id: 'A', type: 'task', scope: 'api', status: 'done' }],
          edges: [],
        },
      })

      const result = buildGraph(index)
      expect(result.nodes[0].type).toBe('docNode')
    })

    it('todos os edges tem type "docEdge"', () => {
      const index = criarIndex({
        documents: [
          {
            id: 'A',
            type: 'task',
            title: 'A',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/A.json',
          },
          {
            id: 'B',
            type: 'task',
            title: 'B',
            status: 'done',
            scope: 'api',
            dateCreated: '2025-12-01',
            tagIds: [],
            summary: '',
            path: 'tasks/B.json',
          },
        ],
        graph: {
          nodes: [
            { id: 'A', type: 'task', scope: 'api', status: 'done' },
            { id: 'B', type: 'task', scope: 'api', status: 'done' },
          ],
          edges: [{ source: 'A', target: 'B', type: 'references' }],
        },
      })

      const result = buildGraph(index)
      expect(result.edges[0].type).toBe('docEdge')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { normalizeDiagramType } from '../src/lib/normalize-diagram-type'

describe('normalizeDiagramType - Normalizacao de Tipos de Diagrama', () => {
  describe('Mapeamento de aliases', () => {
    it('mapeia "erDiagram" para "er_diagram"', () => {
      expect(normalizeDiagramType('erDiagram')).toBe('er_diagram')
    })

    it('mapeia "er" para "er_diagram"', () => {
      expect(normalizeDiagramType('er')).toBe('er_diagram')
    })

    it('mapeia "sequenceDiagram" para "sequence"', () => {
      expect(normalizeDiagramType('sequenceDiagram')).toBe('sequence')
    })

    it('mapeia "stateDiagram" para "state_diagram"', () => {
      expect(normalizeDiagramType('stateDiagram')).toBe('state_diagram')
    })
  })

  describe('Tipos canonicos passam direto', () => {
    it('mantem "flowchart" como "flowchart"', () => {
      expect(normalizeDiagramType('flowchart')).toBe('flowchart')
    })

    it('mantem "sequence" como "sequence"', () => {
      expect(normalizeDiagramType('sequence')).toBe('sequence')
    })

    it('mantem "state_diagram" como "state_diagram"', () => {
      expect(normalizeDiagramType('state_diagram')).toBe('state_diagram')
    })

    it('mantem "er_diagram" como "er_diagram"', () => {
      expect(normalizeDiagramType('er_diagram')).toBe('er_diagram')
    })

    it('mantem "dependency_graph" como "dependency_graph"', () => {
      expect(normalizeDiagramType('dependency_graph')).toBe('dependency_graph')
    })
  })

  describe('Deteccao de tipo mermaid a partir do conteudo', () => {
    it('detecta flowchart a partir do conteudo "flowchart TD"', () => {
      const codigo = 'flowchart TD\n  A --> B'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('flowchart')
    })

    it('detecta flowchart a partir do conteudo "flowchart LR"', () => {
      const codigo = 'flowchart LR\n  A --> B --> C'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('flowchart')
    })

    it('detecta flowchart a partir do conteudo "graph TD"', () => {
      const codigo = 'graph TD\n  A --> B'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('flowchart')
    })

    it('detecta sequenceDiagram a partir do conteudo', () => {
      const codigo =
        'sequenceDiagram\n  participant A\n  participant B\n  A->>B: Hello'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('sequence')
    })

    it('detecta stateDiagram a partir do conteudo', () => {
      const codigo = 'stateDiagram\n  [*] --> Active'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('state_diagram')
    })

    it('detecta stateDiagram-v2 a partir do conteudo', () => {
      const codigo = 'stateDiagram-v2\n  [*] --> Active'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('state_diagram')
    })

    it('detecta erDiagram a partir do conteudo', () => {
      const codigo = 'erDiagram\n  CUSTOMER ||--o{ ORDER : places'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('er_diagram')
    })

    it('detecta tipo mermaid com espacos iniciais no conteudo', () => {
      const codigo = '  flowchart TD\n    A --> B'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('flowchart')
    })
  })

  describe('Fallback', () => {
    it('tipo desconhecido retorna "mermaid" como fallback quando tipo e "mermaid" sem conteudo', () => {
      expect(normalizeDiagramType('mermaid')).toBe('mermaid')
    })

    it('tipo "mermaid" com conteudo nao reconhecido retorna "mermaid"', () => {
      const codigo = 'pie\n  "Dogs" : 386\n  "Cats" : 85'
      expect(normalizeDiagramType('mermaid', codigo)).toBe('mermaid')
    })

    it('tipo "mermaid" com conteudo vazio retorna "mermaid"', () => {
      expect(normalizeDiagramType('mermaid', '')).toBe('mermaid')
    })
  })

  describe('Prioridade: alias tem prioridade sobre inferencia de conteudo', () => {
    it('alias "erDiagram" retorna "er_diagram" mesmo com conteudo flowchart', () => {
      // Se rawType e um alias reconhecido, ele tem prioridade
      const codigo = 'flowchart TD\n  A --> B'
      expect(normalizeDiagramType('erDiagram', codigo)).toBe('er_diagram')
    })

    it('alias "sequenceDiagram" retorna "sequence" independente do conteudo', () => {
      expect(normalizeDiagramType('sequenceDiagram', 'flowchart LR')).toBe(
        'sequence'
      )
    })
  })
})

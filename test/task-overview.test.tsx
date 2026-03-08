// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskOverview } from '@/components/DocTaskDetail'
import type { DocTask } from '@/lib/types'

function makeTask(overrides: Partial<DocTask> = {}): DocTask {
  return {
    $docSchema: 'energimap-doc/v1',
    type: 'task',
    id: 'TASK-TEST',
    metadata: { title: 'Test Task', status: 'pending', dateCreated: '2026-01-01', authorIds: [] },
    sections: [],
    ...overrides,
  }
}

describe('TaskOverview', () => {
  it('mostra bloco Problema com o conteudo de context.problem', () => {
    const task = makeTask({ context: { problem: 'O sistema falha ao processar pagamentos' } })
    render(<TaskOverview task={task} />)

    expect(screen.getByText('Problema')).toBeDefined()
    expect(screen.getByText('O sistema falha ao processar pagamentos')).toBeDefined()
  })

  it('mostra bloco Causa raiz com o conteudo de context.rootCause', () => {
    const task = makeTask({ context: { rootCause: 'Timeout no gateway externo' } })
    render(<TaskOverview task={task} />)

    expect(screen.getByText('Causa raiz')).toBeDefined()
    expect(screen.getByText('Timeout no gateway externo')).toBeDefined()
  })

  it('nao mostra blocos Problema e Causa raiz quando context e undefined', () => {
    const task = makeTask()
    render(<TaskOverview task={task} />)

    expect(screen.queryByText('Problema')).toBeNull()
    expect(screen.queryByText('Causa raiz')).toBeNull()
  })

  it('status completed com 2 fixes mostra "2 entregas realizadas" e "O QUE FOI FEITO"', () => {
    const task = makeTask({
      metadata: { title: 'Test Task', status: 'completed', dateCreated: '2026-01-01', authorIds: [] },
      fixes: [
        { id: 1, title: 'Fix A', description: 'desc A', files: [] },
        { id: 2, title: 'Fix B', description: 'desc B', files: [] },
      ],
    })
    render(<TaskOverview task={task} />)

    expect(screen.getByText('2 entregas realizadas')).toBeDefined()
    expect(screen.getByText('O QUE FOI FEITO')).toBeDefined()
  })

  it('status pending com 1 fix mostra "1 etapa planejada/em andamento" e "O QUE SERA FEITO"', () => {
    const task = makeTask({
      fixes: [{ id: 1, title: 'Fix A', description: 'desc A', files: [] }],
    })
    render(<TaskOverview task={task} />)

    expect(screen.getByText('1 etapa planejada/em andamento')).toBeDefined()
    expect(screen.getByText('O QUE SERA FEITO')).toBeDefined()
  })

  it('sem fixes nao mostra summaryText nem headerLabel', () => {
    const task = makeTask()
    render(<TaskOverview task={task} />)

    expect(screen.queryByText(/etapa/)).toBeNull()
    expect(screen.queryByText(/entrega/)).toBeNull()
    expect(screen.queryByText('O QUE FOI FEITO')).toBeNull()
    expect(screen.queryByText('O QUE SERA FEITO')).toBeNull()
  })

  it('mostra plural de etapas quando status pending e 3 fixes', () => {
    const task = makeTask({
      fixes: [
        { id: 1, title: 'Fix 1', description: 'd', files: [] },
        { id: 2, title: 'Fix 2', description: 'd', files: [] },
        { id: 3, title: 'Fix 3', description: 'd', files: [] },
      ],
    })
    render(<TaskOverview task={task} />)
    expect(screen.getByText('3 etapas planejadas/em andamento')).toBeDefined()
  })

  it('mostra links quando task.links existe', () => {
    const task = makeTask({
      links: { plan: 'PLANNING-001', adrs: ['ADR-001'] },
    })
    render(<TaskOverview task={task} />)
    expect(screen.getByText('PLANNING-001')).toBeDefined()
    expect(screen.getByText('ADR-001')).toBeDefined()
  })

  it('mostra impactedSteps com nome e order', () => {
    const task = makeTask({
      context: {
        impactedSteps: [
          { order: 1, name: 'Selecao de produto', componentType: 'form' },
          { order: 3, name: 'Pagamento', componentType: 'modal' },
        ],
      },
    })
    render(<TaskOverview task={task} />)

    expect(screen.getByText('Selecao de produto')).toBeDefined()
    expect(screen.getByText('Pagamento')).toBeDefined()
    expect(screen.getByText('#1')).toBeDefined()
    expect(screen.getByText('#3')).toBeDefined()
  })
})

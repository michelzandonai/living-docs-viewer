// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FixCard } from '@/components/DocTaskDetail'
import type { DocTaskFix } from '@/lib/types'

const baseFix: DocTaskFix = {
  id: 1,
  title: 'Corrigir validacao',
  description: 'Validacao com **negrito** e `codigo` inline',
  files: ['src/validators.ts (NOVO)', 'src/form.tsx (MODIFICA)'],
  category: 'root_cause',
  status: 'completed',
  logic: 'Usar regex para validar formato do email',
}

describe('FixCard', () => {
  it('renderiza id e titulo do fix no header', () => {
    render(<FixCard fix={baseFix} />)

    expect(screen.getByText('#1')).toBeDefined()
    expect(screen.getByText('Corrigir validacao')).toBeDefined()
  })

  it('mostra badge de categoria "Causa raiz" quando category="root_cause"', () => {
    render(<FixCard fix={baseFix} />)

    expect(screen.getByText('Causa raiz')).toBeDefined()
  })

  it('mostra badge de status "Concluido" quando status="completed"', () => {
    render(<FixCard fix={baseFix} />)

    expect(screen.getByText('Concluido')).toBeDefined()
  })

  it('renderiza markdown na description (ReactMarkdown)', () => {
    const { container } = render(<FixCard fix={baseFix} />)
    // ReactMarkdown deve converter **negrito** em <strong>
    const strong = container.querySelector('strong')
    expect(strong).not.toBeNull()
    expect(strong!.textContent).toBe('negrito')
    // ReactMarkdown deve converter `codigo` em <code>
    const code = container.querySelector('code')
    expect(code).not.toBeNull()
    expect(code!.textContent).toBe('codigo')
  })

  it('secao "Como funciona" nao mostra conteudo por default (fechado)', () => {
    render(<FixCard fix={baseFix} />)

    // O botao do titulo existe mas o conteudo (logic) nao deve estar visivel
    expect(screen.queryByText('Usar regex para validar formato do email')).toBeNull()
  })

  it('secao "Arquivos" nao mostra conteudo por default (fechado)', () => {
    render(<FixCard fix={baseFix} />)

    // Os arquivos nao devem estar visiveis (secao fechada)
    expect(screen.queryByText('src/validators.ts')).toBeNull()
    expect(screen.queryByText('src/form.tsx')).toBeNull()
  })

  it('nao renderiza secao logic quando logic e undefined', () => {
    const fix: DocTaskFix = { ...baseFix, logic: undefined }
    render(<FixCard fix={fix} />)

    expect(screen.queryByText('Como funciona')).toBeNull()
  })

  it('nao renderiza secao arquivos quando files e array vazio', () => {
    const fix: DocTaskFix = { ...baseFix, files: [] }
    render(<FixCard fix={fix} />)

    expect(screen.queryByText('Arquivos')).toBeNull()
  })

  it('expande secao Como funciona ao clicar e mostra conteudo', () => {
    const fixWithLogic = { ...baseFix, logic: 'Usar **regex** para validar' }
    render(<FixCard fix={fixWithLogic} />)
    // Clicar no botão "Como funciona" para expandir
    const buttons = screen.getAllByRole('button')
    const logicButton = buttons.find(b => b.textContent?.includes('Como funciona'))
    expect(logicButton).toBeDefined()
    fireEvent.click(logicButton!)
    // Após expandir, conteúdo deve estar visível
    expect(screen.getByText('regex')).toBeDefined()
  })

  it('expande secao Arquivos ao clicar e mostra badges', () => {
    render(<FixCard fix={baseFix} />)
    const buttons = screen.getAllByRole('button')
    const filesButton = buttons.find(b => b.textContent?.includes('Arquivos'))
    expect(filesButton).toBeDefined()
    fireEvent.click(filesButton!)
    // Deve mostrar badge NEW
    expect(screen.getByText('NEW')).toBeDefined()
    // Deve mostrar badge MOD
    expect(screen.getByText('MOD')).toBeDefined()
  })

  it('renderiza testFile quando presente', () => {
    const fixWithTest = { ...baseFix, testFile: 'test/validators.test.ts' }
    render(<FixCard fix={fixWithTest} />)
    expect(screen.getByText('test/validators.test.ts')).toBeDefined()
  })
})

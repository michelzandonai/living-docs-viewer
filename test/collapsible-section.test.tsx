// @vitest-environment happy-dom
import { render, fireEvent, screen } from '@testing-library/react'
import { CollapsibleSection } from '@/components/DocTaskDetail'

describe('CollapsibleSection', () => {
  it('renderiza o titulo no button', () => {
    // Arrange
    render(
      <CollapsibleSection title="Meu Titulo" defaultOpen={false}>
        <span>conteudo</span>
      </CollapsibleSection>
    )

    // Assert
    expect(screen.getByRole('button', { name: /meu titulo/i })).toBeDefined()
  })

  it('mostra children quando defaultOpen=true', () => {
    // Arrange
    render(
      <CollapsibleSection title="Teste" defaultOpen={true}>
        <span>conteudo visivel</span>
      </CollapsibleSection>
    )

    // Assert
    expect(screen.getByText('conteudo visivel')).toBeDefined()
  })

  it('oculta children quando defaultOpen=false', () => {
    // Arrange
    render(
      <CollapsibleSection title="Teste" defaultOpen={false}>
        <span>conteudo oculto</span>
      </CollapsibleSection>
    )

    // Assert
    expect(screen.queryByText('conteudo oculto')).toBeNull()
  })

  it('exibe children apos clicar quando defaultOpen=false', () => {
    // Arrange
    render(
      <CollapsibleSection title="Teste" defaultOpen={false}>
        <span>conteudo expandido</span>
      </CollapsibleSection>
    )

    // Act
    fireEvent.click(screen.getByRole('button'))

    // Assert
    expect(screen.getByText('conteudo expandido')).toBeDefined()
  })

  it('oculta children apos clicar quando defaultOpen=true', () => {
    // Arrange
    render(
      <CollapsibleSection title="Teste" defaultOpen={true}>
        <span>conteudo recolhido</span>
      </CollapsibleSection>
    )

    // Act
    fireEvent.click(screen.getByRole('button'))

    // Assert
    expect(screen.queryByText('conteudo recolhido')).toBeNull()
  })

  it('ChevronRight tem classe rotate-90 quando aberto', () => {
    // Arrange
    const { container } = render(
      <CollapsibleSection title="Teste" defaultOpen={true}>
        <span>conteudo</span>
      </CollapsibleSection>
    )

    // Assert
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.className).toContain('rotate-90')
  })

  it('ChevronRight nao tem classe rotate-90 quando fechado', () => {
    // Arrange
    const { container } = render(
      <CollapsibleSection title="Teste" defaultOpen={false}>
        <span>conteudo</span>
      </CollapsibleSection>
    )

    // Assert
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.className).not.toContain('rotate-90')
  })
})

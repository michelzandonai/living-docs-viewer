// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FixStatusIcon } from '@/components/DocTaskDetail'

describe('FixStatusIcon', () => {
  it('renderiza icone pending com cor zinc', () => {
    const { container } = render(<FixStatusIcon status="pending" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('class') || svg!.className.baseVal || '').toContain('text-zinc-400')
  })

  it('renderiza icone in_progress com cor amber', () => {
    const { container } = render(<FixStatusIcon status="in_progress" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('class') || svg!.className.baseVal || '').toContain('text-amber-500')
  })

  it('renderiza icone completed com cor emerald', () => {
    const { container } = render(<FixStatusIcon status="completed" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('class') || svg!.className.baseVal || '').toContain('text-emerald-500')
  })

  it('renderiza icone pending quando status e undefined', () => {
    const { container } = render(<FixStatusIcon />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.getAttribute('class') || svg!.className.baseVal || '').toContain('text-zinc-400')
  })
})

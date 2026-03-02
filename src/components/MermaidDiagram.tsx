import { useEffect, useRef, useState, useId } from 'react'
import type { DocDiagram } from '@/lib/types'

interface MermaidDiagramProps {
  diagram: DocDiagram
}

export function MermaidDiagram({ diagram }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const uniqueId = useId().replace(/:/g, '_')
  const diagramId = `mermaid_${uniqueId}`

  useEffect(() => {
    if (!diagram.mermaid || !containerRef.current) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function renderDiagram() {
      try {
        const mermaid = await import('mermaid')

        if (cancelled) return

        const isDark = document.documentElement.classList.contains('dark')

        mermaid.default.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
        })

        const { svg } = await mermaid.default.render(diagramId, diagram.mermaid!)

        if (cancelled || !containerRef.current) return

        containerRef.current.innerHTML = svg
        setLoading(false)
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message ?? 'Erro ao renderizar diagrama')
          setLoading(false)
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [diagram.mermaid, diagramId])

  if (!diagram.mermaid) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhum conteudo Mermaid disponivel para este diagrama.
      </p>
    )
  }

  return (
    <div className="mb-6">
      {diagram.title && (
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--ldv-text)' }}>
          {diagram.title}
        </h4>
      )}

      <div
        className="p-4 rounded-lg border overflow-x-auto"
        style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg-secondary)' }}
      >
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--ldv-accent)', borderTopColor: 'transparent' }}
            />
            <span className="ml-2 text-sm" style={{ color: 'var(--ldv-text-secondary)' }}>
              Carregando diagrama...
            </span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded border border-red-300 dark:border-red-700" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <p className="text-sm text-red-700 dark:text-red-400">
              Erro ao renderizar diagrama: {error}
            </p>
            <pre className="mt-2 text-xs overflow-x-auto" style={{ color: 'var(--ldv-text-secondary)' }}>
              {diagram.mermaid}
            </pre>
          </div>
        )}

        <div ref={containerRef} className={loading || error ? 'hidden' : 'flex justify-center'} />
      </div>
    </div>
  )
}

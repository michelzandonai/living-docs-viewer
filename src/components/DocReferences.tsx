import { cn } from '@/lib/cn'
import { useDocsStore } from '@/hooks/use-docs-store'
import type { DocReference } from '@/lib/types'

interface DocReferencesProps {
  references: DocReference[]
}

const referenceTypeLabels: Record<string, string> = {
  references: 'Referencia',
  supersedes: 'Substitui',
  superseded_by: 'Substituido por',
  depends_on: 'Depende de',
  implements: 'Implementa',
  related: 'Relacionado',
  external: 'Externo',
}

const referenceTypeColors: Record<string, string> = {
  references: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  supersedes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  superseded_by: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  depends_on: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  implements: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  related: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  external: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

export function DocReferences({ references }: DocReferencesProps) {
  const selectDoc = useDocsStore((s) => s.selectDoc)

  if (references.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--ldv-text)' }}>
        Referencias
      </h3>

      <div className="grid gap-2">
        {references.map((ref, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--ldv-border)',
              backgroundColor: 'var(--ldv-bg)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ldv-bg-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ldv-bg)'
            }}
            onClick={() => selectDoc(ref.targetId)}
          >
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0',
                referenceTypeColors[ref.type] ?? 'bg-gray-100 text-gray-800'
              )}
            >
              {referenceTypeLabels[ref.type] ?? ref.type}
            </span>

            <span
              className="text-sm font-mono font-medium"
              style={{ color: 'var(--ldv-accent)' }}
            >
              {ref.targetId}
            </span>

            {ref.description && (
              <span className="text-sm truncate" style={{ color: 'var(--ldv-text-secondary)' }}>
                {ref.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

import type { DocChangelogEntry } from '@/lib/types'

interface DocChangelogProps {
  changelog: DocChangelogEntry[]
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function DocChangelog({ changelog }: DocChangelogProps) {
  if (changelog.length === 0) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhuma entrada no historico de alteracoes.
      </p>
    )
  }

  return (
    <div className="relative">
      <div
        className="absolute left-[79px] top-0 bottom-0 w-px"
        style={{ backgroundColor: 'var(--ldv-border)' }}
      />

      <div className="space-y-4">
        {changelog.map((entry, i) => (
          <div key={i} className="flex items-start gap-4">
            <span
              className="text-xs font-mono shrink-0 w-[68px] text-right pt-0.5"
              style={{ color: 'var(--ldv-text-secondary)' }}
            >
              {formatDate(entry.date)}
            </span>

            <div
              className="relative shrink-0 w-2.5 h-2.5 rounded-full mt-1.5"
              style={{
                backgroundColor: 'var(--ldv-accent)',
                boxShadow: '0 0 0 4px var(--ldv-bg)',
              }}
            />

            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--ldv-text)' }}>
              {entry.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

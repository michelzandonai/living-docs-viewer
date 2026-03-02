import type { DocAdr } from '@/lib/types'

interface DocAdrDetailProps {
  doc: DocAdr
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--ldv-text)' }}>
        {title}
      </h4>
      {children}
    </div>
  )
}

export function DocAdrDetail({ doc }: DocAdrDetailProps) {
  const adr = doc.adr

  if (!adr) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhum detalhe ADR disponivel.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {adr.context && (
        <DetailSection title="Contexto">
          <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--ldv-text)' }}>
            {adr.context}
          </p>
        </DetailSection>
      )}

      {adr.decision && (
        <DetailSection title="Decisao">
          <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--ldv-text)' }}>
            {adr.decision}
          </p>
        </DetailSection>
      )}

      {adr.justification && (
        <DetailSection title="Justificativa">
          <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--ldv-text)' }}>
            {adr.justification}
          </p>
        </DetailSection>
      )}

      {adr.consequences && (
        <DetailSection title="Consequencias">
          <div className="space-y-3">
            {adr.consequences.positive && adr.consequences.positive.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-1.5 text-green-700 dark:text-green-400">
                  Positivas
                </h5>
                <ul className="space-y-1">
                  {adr.consequences.positive.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-start gap-2 px-3 py-1.5 rounded"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                    >
                      <span className="text-green-600 dark:text-green-400 shrink-0 mt-0.5">+</span>
                      <span style={{ color: 'var(--ldv-text)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adr.consequences.negative && adr.consequences.negative.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-1.5 text-red-700 dark:text-red-400">
                  Negativas
                </h5>
                <ul className="space-y-1">
                  {adr.consequences.negative.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-start gap-2 px-3 py-1.5 rounded"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    >
                      <span className="text-red-600 dark:text-red-400 shrink-0 mt-0.5">-</span>
                      <span style={{ color: 'var(--ldv-text)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {adr.consequences.mitigations && adr.consequences.mitigations.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-1.5 text-yellow-700 dark:text-yellow-400">
                  Mitigacoes
                </h5>
                <ul className="space-y-1">
                  {adr.consequences.mitigations.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm flex items-start gap-2 px-3 py-1.5 rounded"
                      style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}
                    >
                      <span className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5">~</span>
                      <span style={{ color: 'var(--ldv-text)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DetailSection>
      )}

      {adr.alternatives && adr.alternatives.length > 0 && (
        <DetailSection title="Alternativas consideradas">
          <ul className="space-y-1.5">
            {adr.alternatives.map((alt, i) => (
              <li
                key={i}
                className="text-sm flex items-start gap-2"
                style={{ color: 'var(--ldv-text)' }}
              >
                <span className="shrink-0 font-mono text-xs mt-0.5" style={{ color: 'var(--ldv-text-secondary)' }}>
                  {i + 1}.
                </span>
                {alt}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {adr.successCriteria && adr.successCriteria.length > 0 && (
        <DetailSection title="Criterios de sucesso">
          <ul className="space-y-1.5">
            {adr.successCriteria.map((criterion, i) => (
              <li
                key={i}
                className="text-sm flex items-start gap-2"
                style={{ color: 'var(--ldv-text)' }}
              >
                <span className="shrink-0 text-green-600 dark:text-green-400 mt-0.5">&#10003;</span>
                {criterion}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </div>
  )
}

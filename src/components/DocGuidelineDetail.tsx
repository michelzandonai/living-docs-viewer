import type { DocGuideline } from '@/lib/types'

interface DocGuidelineDetailProps {
  doc: DocGuideline
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

export function DocGuidelineDetail({ doc }: DocGuidelineDetailProps) {
  const guideline = doc.guideline

  if (!guideline) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhum detalhe de diretriz disponivel.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {guideline.appliesTo && (
        <DetailSection title="Aplica-se a">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ldv-text)' }}>
            {guideline.appliesTo}
          </p>
        </DetailSection>
      )}

      {guideline.rules && guideline.rules.length > 0 && (
        <DetailSection title="Regras">
          <div className="space-y-3">
            {guideline.rules.map((rule, i) => (
              <div
                key={rule.id}
                className="p-4 rounded-lg border"
                style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg-secondary)' }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0"
                    style={{ backgroundColor: 'var(--ldv-accent)', color: '#ffffff' }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--ldv-text)' }}>
                      {rule.description}
                    </p>

                    {rule.whenApplies && (
                      <div className="text-xs" style={{ color: 'var(--ldv-text-secondary)' }}>
                        <span className="font-medium">Quando se aplica:</span>{' '}
                        {rule.whenApplies}
                      </div>
                    )}

                    {rule.riskOfIgnoring && (
                      <div className="text-xs text-amber-700 dark:text-amber-400">
                        <span className="font-medium">Risco de ignorar:</span>{' '}
                        {rule.riskOfIgnoring}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {guideline.checklist && guideline.checklist.length > 0 && (
        <DetailSection title="Checklist">
          <ul className="space-y-2">
            {guideline.checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded border shrink-0 mt-0.5"
                  style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg)' }}
                />
                <span className="text-sm" style={{ color: 'var(--ldv-text)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {guideline.antiPatterns && guideline.antiPatterns.length > 0 && (
        <DetailSection title="Anti-padroes">
          <div className="space-y-2">
            {guideline.antiPatterns.map((pattern, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-amber-300 dark:border-amber-700"
                style={{ backgroundColor: 'rgba(234, 179, 8, 0.08)' }}
              >
                <span className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 font-bold">!</span>
                <p className="text-sm" style={{ color: 'var(--ldv-text)' }}>
                  {pattern}
                </p>
              </div>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  )
}

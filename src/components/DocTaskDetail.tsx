import type { DocTask } from '@/lib/types'

interface DocTaskDetailProps {
  doc: DocTask
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

export function DocTaskDetail({ doc }: DocTaskDetailProps) {
  const hasContext = doc.context?.problem || doc.context?.rootCause
  const hasFixes = doc.fixes && doc.fixes.length > 0
  const hasVerify = doc.verify && doc.verify.length > 0

  if (!hasContext && !hasFixes && !hasVerify) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhum detalhe de tarefa disponivel.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {hasContext && (
        <DetailSection title="Contexto">
          <div className="space-y-3">
            {doc.context?.problem && (
              <div
                className="p-3 rounded-lg border"
                style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg-secondary)' }}
              >
                <h5 className="text-xs font-medium mb-1" style={{ color: 'var(--ldv-text-secondary)' }}>
                  Problema
                </h5>
                <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ldv-text)' }}>
                  {doc.context.problem}
                </p>
              </div>
            )}

            {doc.context?.rootCause && (
              <div
                className="p-3 rounded-lg border"
                style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg-secondary)' }}
              >
                <h5 className="text-xs font-medium mb-1" style={{ color: 'var(--ldv-text-secondary)' }}>
                  Causa raiz
                </h5>
                <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ldv-text)' }}>
                  {doc.context.rootCause}
                </p>
              </div>
            )}
          </div>
        </DetailSection>
      )}

      {hasFixes && (
        <DetailSection title="Correcoes">
          <div className="space-y-3">
            {doc.fixes!.map((fix, i) => (
              <div
                key={fix.id}
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
                      {fix.title}
                    </p>
                    <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--ldv-text-secondary)' }}>
                      {fix.description}
                    </p>

                    {fix.files && fix.files.length > 0 && (
                      <div className="mt-2">
                        <h6 className="text-xs font-medium mb-1" style={{ color: 'var(--ldv-text-secondary)' }}>
                          Arquivos:
                        </h6>
                        <ul className="space-y-0.5">
                          {fix.files.map((file, fi) => (
                            <li
                              key={fi}
                              className="text-xs font-mono px-2 py-1 rounded"
                              style={{ backgroundColor: 'var(--ldv-bg)', color: 'var(--ldv-accent)' }}
                            >
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {hasVerify && (
        <DetailSection title="Verificacao">
          <ul className="space-y-2">
            {doc.verify!.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded border shrink-0 mt-0.5"
                  style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg)' }}
                />
                <span className="text-sm" style={{ color: 'var(--ldv-text)' }}>
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </div>
  )
}

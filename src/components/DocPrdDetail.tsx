import type { DocPrd } from '@/lib/types'

interface DocPrdDetailProps {
  doc: DocPrd
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

export function DocPrdDetail({ doc }: DocPrdDetailProps) {
  const prd = doc.prd

  if (!prd) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhum detalhe PRD disponivel.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {prd.personas && prd.personas.length > 0 && (
        <DetailSection title="Personas">
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--ldv-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ldv-bg-secondary)' }}>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Nome
                  </th>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Descricao
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.personas.map((persona, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ldv-bg)' : 'var(--ldv-bg-secondary)' }}>
                    <td
                      className="px-4 py-2 border-b font-medium"
                      style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                    >
                      {persona.name}
                    </td>
                    <td
                      className="px-4 py-2 border-b"
                      style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                    >
                      {persona.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailSection>
      )}

      {prd.scope && (
        <DetailSection title="Escopo">
          <div className="grid gap-4 sm:grid-cols-2">
            {prd.scope.included && prd.scope.included.length > 0 && (
              <div
                className="p-3 rounded-lg border"
                style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg-secondary)' }}
              >
                <h5 className="text-xs font-medium mb-2 text-green-700 dark:text-green-400">
                  Incluido
                </h5>
                <ul className="space-y-1">
                  {prd.scope.included.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--ldv-text)' }}>
                      <span className="text-green-600 dark:text-green-400 shrink-0 mt-0.5">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prd.scope.excluded && prd.scope.excluded.length > 0 && (
              <div
                className="p-3 rounded-lg border"
                style={{ borderColor: 'var(--ldv-border)', backgroundColor: 'var(--ldv-bg-secondary)' }}
              >
                <h5 className="text-xs font-medium mb-2 text-red-700 dark:text-red-400">
                  Excluido
                </h5>
                <ul className="space-y-1">
                  {prd.scope.excluded.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--ldv-text)' }}>
                      <span className="text-red-600 dark:text-red-400 shrink-0 mt-0.5">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DetailSection>
      )}

      {prd.functionalRequirements && prd.functionalRequirements.length > 0 && (
        <DetailSection title="Requisitos Funcionais">
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--ldv-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ldv-bg-secondary)' }}>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b w-24"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    ID
                  </th>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Descricao
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.functionalRequirements.map((req, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ldv-bg)' : 'var(--ldv-bg-secondary)' }}>
                    <td
                      className="px-4 py-2 border-b font-mono text-xs"
                      style={{ color: 'var(--ldv-accent)', borderColor: 'var(--ldv-border)' }}
                    >
                      {req.id}
                    </td>
                    <td
                      className="px-4 py-2 border-b"
                      style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                    >
                      {req.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailSection>
      )}

      {prd.businessRules && prd.businessRules.length > 0 && (
        <DetailSection title="Regras de Negocio">
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--ldv-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ldv-bg-secondary)' }}>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b w-24"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    ID
                  </th>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Descricao
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.businessRules.map((rule, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ldv-bg)' : 'var(--ldv-bg-secondary)' }}>
                    <td
                      className="px-4 py-2 border-b font-mono text-xs"
                      style={{ color: 'var(--ldv-accent)', borderColor: 'var(--ldv-border)' }}
                    >
                      {rule.id}
                    </td>
                    <td
                      className="px-4 py-2 border-b"
                      style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                    >
                      {rule.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailSection>
      )}

      {prd.apiSpecification && prd.apiSpecification.length > 0 && (
        <DetailSection title="Especificacao da API">
          <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--ldv-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--ldv-bg-secondary)' }}>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b w-24"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Metodo
                  </th>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Caminho
                  </th>
                  <th
                    className="px-4 py-2.5 text-left font-semibold border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    Resumo
                  </th>
                </tr>
              </thead>
              <tbody>
                {prd.apiSpecification.map((api, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'var(--ldv-bg)' : 'var(--ldv-bg-secondary)' }}>
                    <td
                      className="px-4 py-2 border-b font-mono text-xs font-semibold uppercase"
                      style={{ color: 'var(--ldv-accent)', borderColor: 'var(--ldv-border)' }}
                    >
                      {api.method}
                    </td>
                    <td
                      className="px-4 py-2 border-b font-mono text-xs"
                      style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                    >
                      {api.path}
                    </td>
                    <td
                      className="px-4 py-2 border-b"
                      style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                    >
                      {api.summary ?? ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailSection>
      )}
    </div>
  )
}

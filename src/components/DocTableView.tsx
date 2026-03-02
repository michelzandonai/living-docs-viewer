import type { DocTable } from '@/lib/types'

interface DocTableViewProps {
  tables: DocTable[]
}

function TableBlock({ table }: { table: DocTable }) {
  return (
    <div className="mb-6">
      {table.title && (
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--ldv-text)' }}>
          {table.title}
        </h4>
      )}

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--ldv-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--ldv-bg-secondary)' }}>
              {table.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left font-semibold whitespace-nowrap border-b"
                  style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors"
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? 'var(--ldv-bg)' : 'var(--ldv-bg-secondary)',
                }}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 border-b"
                    style={{ color: 'var(--ldv-text)', borderColor: 'var(--ldv-border)' }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function DocTableView({ tables }: DocTableViewProps) {
  if (tables.length === 0) {
    return (
      <p className="text-sm italic" style={{ color: 'var(--ldv-text-secondary)' }}>
        Nenhuma tabela disponivel.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {tables.map((table) => (
        <TableBlock key={table.id} table={table} />
      ))}
    </div>
  )
}

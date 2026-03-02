import type { DocTable } from '@/lib/types';

interface DocTableViewProps {
  tables: DocTable[];
}

function TableBlock({ table }: { table: DocTable }) {
  const columns = table.columns ?? table.headers ?? [];

  return (
    <div className="space-y-2">
      {table.title && (
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{table.title}</h4>
      )}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm dark:shadow-none">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="font-semibold text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 px-4 py-3 text-left"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={[
                  'transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40',
                  rowIdx % 2 === 1
                    ? 'bg-zinc-50/40 dark:bg-zinc-800/20'
                    : 'bg-white dark:bg-zinc-900',
                ].join(' ')}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="text-sm px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
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
  );
}

export function DocTableView({ tables }: DocTableViewProps) {
  if (tables.length === 0) {
    return (
      <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
        Nenhuma tabela disponivel.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {tables.map((table) => (
        <TableBlock key={table.id} table={table} />
      ))}
    </div>
  );
}

import type { DocChangelogEntry } from '@/lib/types';

interface DocChangelogProps {
  changelog: DocChangelogEntry[];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function DocChangelog({ changelog }: DocChangelogProps) {
  if (changelog.length === 0) {
    return (
      <p className="text-sm italic text-zinc-500 dark:text-zinc-400">
        Nenhuma entrada no historico de alteracoes.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Historico de Alteracoes
      </h3>
      <div className="relative pl-8">
        {/* Vertical dashed timeline line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px border-l-2 border-dashed border-zinc-300 dark:border-zinc-600" />

        {changelog.map((entry, idx) => (
          <div
            key={idx}
            className="relative pb-6 last:pb-0 group transition-colors rounded-r-lg hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 -ml-2 pl-2 pr-2 py-1"
          >
            {/* Timeline bullet */}
            <div className="absolute left-[-5px] top-2.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white dark:border-zinc-900 bg-blue-500 dark:bg-blue-400" />

            <div className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
                {formatDate(entry.date)}
              </span>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{entry.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

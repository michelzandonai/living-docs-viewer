import {
  ArrowUpRight,
  ArrowRight,
  GitBranch,
  ExternalLink,
  Layers,
  Link2,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDocsStore } from '@/hooks/use-docs-store';
import type { DocReference } from '@/lib/types';

const REF_ICONS: Record<string, React.ElementType> = {
  references: ArrowUpRight,
  depends_on: ArrowRight,
  supersedes: GitBranch,
  superseded_by: GitBranch,
  implements: Layers,
  related: Link2,
  external: ExternalLink,
};

const REF_LABELS: Record<string, string> = {
  references: 'Referencia',
  depends_on: 'Depende de',
  supersedes: 'Substitui',
  superseded_by: 'Substituido por',
  implements: 'Implementa',
  related: 'Relacionado',
  external: 'Externo',
};

const REF_COLORS: Record<string, string> = {
  references: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  depends_on: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200 border-orange-200 dark:border-orange-700',
  supersedes: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-700',
  superseded_by: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-700',
  implements: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700',
  related: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700/40 dark:text-zinc-200 border-zinc-200 dark:border-zinc-600',
  external: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-700',
};

interface DocReferencesProps {
  references: DocReference[];
  indexedDocIds?: Set<string>;
  onSelect?: (docId: string) => void;
}

export function DocReferences({ references, indexedDocIds, onSelect }: DocReferencesProps) {
  const selectDoc = useDocsStore((s) => s.selectDoc);

  if (references.length === 0) return null;

  // Build a set of indexed doc IDs for ghost detection
  const indexed = indexedDocIds ?? new Set<string>();

  const handleClick = (targetId: string) => {
    if (onSelect) {
      onSelect(targetId);
    } else {
      selectDoc(targetId);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Referencias
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {references.map((ref) => {
          const Icon = REF_ICONS[ref.type] ?? Link2;
          const isGhost = indexed.size > 0 && !indexed.has(ref.targetId);
          const badgeColor =
            REF_COLORS[ref.type] ??
            'bg-zinc-100 text-zinc-800 dark:bg-zinc-700/40 dark:text-zinc-200 border-zinc-200 dark:border-zinc-600';

          const content = (
            <div
              className={cn(
                'rounded-xl border p-4 transition-all',
                isGhost
                  ? 'border-dashed border-zinc-300 dark:border-zinc-600 opacity-60 bg-zinc-50/50 dark:bg-zinc-800/30'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md dark:hover:shadow-none cursor-pointer shadow-sm dark:shadow-none',
              )}
              onClick={!isGhost ? () => handleClick(ref.targetId) : undefined}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 mt-0.5 shrink-0',
                    isGhost
                      ? 'text-zinc-400 dark:text-zinc-500'
                      : 'text-blue-500 dark:text-blue-400',
                  )}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-mono text-xs font-medium',
                        isGhost
                          ? 'text-zinc-500 dark:text-zinc-400'
                          : 'text-blue-600 dark:text-blue-400',
                      )}
                    >
                      {ref.targetId}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium border',
                        badgeColor,
                      )}
                    >
                      {REF_LABELS[ref.type] ?? ref.type}
                    </span>
                  </div>
                  {ref.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 truncate">
                      {ref.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );

          return <div key={ref.targetId + '-' + ref.type}>{content}</div>;
        })}
      </div>
    </div>
  );
}

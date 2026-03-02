import { useState, useEffect, type ReactNode } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface DiagramContainerProps {
  children: (props: { isExpanded: boolean }) => ReactNode;
  title?: string;
}

export function DiagramContainer({ children, title }: DiagramContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isExpanded]);

  const containerClass = isExpanded
    ? 'fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col'
    : 'min-h-[300px] h-[60vh] max-h-[800px] border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden relative flex flex-col';

  return (
    <div className={containerClass}>
      {isExpanded && title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</span>
        </div>
      )}
      <div className="w-full flex-1 relative">
        {children({ isExpanded })}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-md p-1.5 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          title={isExpanded ? 'Minimizar' : 'Expandir'}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          ) : (
            <Maximize2 className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          )}
        </button>
      </div>
    </div>
  );
}

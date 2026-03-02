import { lazy, Suspense } from 'react';
import type { DocDiagram, DocsIndex } from '@/lib/types';
import '@xyflow/react/dist/style.css';
import { normalizeDiagramType } from '@/lib/normalize-diagram-type';
import { DependencyGraph } from './dependency-graph';

const FlowchartDiagram = lazy(() =>
  import('./flowchart').then((m) => ({ default: m.FlowchartDiagram }))
);

const StateDiagram = lazy(() =>
  import('./state').then((m) => ({ default: m.StateDiagram }))
);

const SequenceDiagram = lazy(() =>
  import('./sequence').then((m) => ({ default: m.SequenceDiagram }))
);

const ERDiagram = lazy(() =>
  import('./er').then((m) => ({ default: m.ERDiagram }))
);

interface Props {
  diagram: DocDiagram;
  index?: DocsIndex;
  currentDocId?: string;
}

export function DiagramRenderer({ diagram, index, currentDocId }: Props) {
  const normalizedType = normalizeDiagramType(
    diagram.type,
    diagram.mermaid ?? diagram.content
  );

  const loadingFallback = (
    <div className="h-[400px] border border-zinc-200 dark:border-zinc-700 rounded-lg animate-pulse bg-zinc-100 dark:bg-zinc-800" />
  );

  const content = (() => {
    if (
      normalizedType === 'flowchart' &&
      diagram.nodes?.length &&
      diagram.edges
    ) {
      return (
        <Suspense fallback={loadingFallback}>
          <FlowchartDiagram nodes={diagram.nodes} edges={diagram.edges} />
        </Suspense>
      );
    }

    if (
      normalizedType === 'state_diagram' &&
      diagram.nodes?.length &&
      diagram.edges
    ) {
      return (
        <Suspense fallback={loadingFallback}>
          <StateDiagram nodes={diagram.nodes} edges={diagram.edges} />
        </Suspense>
      );
    }

    if (
      normalizedType === 'sequence' &&
      diagram.nodes?.length &&
      diagram.edges
    ) {
      return (
        <Suspense fallback={loadingFallback}>
          <SequenceDiagram nodes={diagram.nodes} edges={diagram.edges} />
        </Suspense>
      );
    }

    if (
      normalizedType === 'er_diagram' &&
      diagram.nodes?.length &&
      diagram.edges
    ) {
      return (
        <Suspense fallback={loadingFallback}>
          <ERDiagram nodes={diagram.nodes} edges={diagram.edges} />
        </Suspense>
      );
    }

    if (normalizedType === 'dependency_graph' && index) {
      return (
        <DependencyGraph index={index} currentDocId={currentDocId} />
      );
    }

    return (
      <div className="rounded-xl border border-amber-300 dark:border-amber-700 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm">
        <p className="font-medium">Diagrama nao convertido</p>
        <p className="mt-1 text-xs">
          Este diagrama ainda nao foi convertido para o formato React Flow.
        </p>
      </div>
    );
  })();

  return (
    <div className="space-y-2">
      {diagram.title && (
        <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {diagram.title}
        </h4>
      )}
      {content}
    </div>
  );
}

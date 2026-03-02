import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { DocsIndex } from '@/lib/types';
import { buildGraph } from '@/lib/build-graph';
import { DocNode } from './doc-node';
import { DocEdge } from './doc-edge';
import { DiagramContainer } from './diagram-container';
import { useDocsTheme } from '@/components/DocsThemeProvider';

const nodeTypes: NodeTypes = {
  docNode: DocNode,
};

const edgeTypes: EdgeTypes = {
  docEdge: DocEdge,
};

interface Props {
  index: DocsIndex;
  currentDocId?: string;
}

export function DependencyGraph({ index, currentDocId }: Props) {
  const { theme } = useDocsTheme();
  const { nodes, edges } = useMemo(
    () => buildGraph(index, currentDocId),
    [index, currentDocId]
  );

  if (nodes.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Grafo de Dependencias
      </h3>
      <DiagramContainer title="Grafo de Dependencias">
        {({ isExpanded }) => (
          <ReactFlow
            colorMode={theme}
            key={String(isExpanded)}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={4}
            panOnScroll
            nodesDraggable={false}
            nodesConnectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={16} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        )}
      </DiagramContainer>
    </div>
  );
}

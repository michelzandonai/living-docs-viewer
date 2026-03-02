import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { DiagramNode, DiagramEdge } from '@/lib/types';
import { layoutSequence } from './sequence-layout';
import {
  ActorNode,
  MessageBarNode,
  SequenceBlockNode,
} from './sequence-nodes';
import { SyncMessageEdge, ReturnEdge, LifelineEdge } from './sequence-edge';
import { DiagramContainer } from '@/components/diagrams/diagram-container';
import { useDocsTheme } from '@/components/DocsThemeProvider';

const nodeTypes: NodeTypes = {
  actor: ActorNode,
  message_bar: MessageBarNode,
  sequence_block: SequenceBlockNode,
};

const edgeTypes: EdgeTypes = {
  syncMessageEdge: SyncMessageEdge,
  returnEdge: ReturnEdge,
  lifelineEdge: LifelineEdge,
};

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export function SequenceDiagram({
  nodes: diagramNodes,
  edges: diagramEdges,
}: Props) {
  const { theme } = useDocsTheme();
  const { nodes, edges } = useMemo(
    () => layoutSequence(diagramNodes, diagramEdges),
    [diagramNodes, diagramEdges]
  );

  if (nodes.length === 0) return null;

  return (
    <DiagramContainer title="Sequence Diagram">
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
          <svg>
            <defs>
              <marker
                id="seq-arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-zinc-700 dark:fill-zinc-300"
                />
              </marker>
              <marker
                id="seq-arrowhead-gray"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  className="fill-zinc-400 dark:fill-zinc-500"
                />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
      )}
    </DiagramContainer>
  );
}

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
import { layoutState } from './state-layout';
import { StateNode, InitialNode, FinalNode } from './state-nodes';
import { TransitionEdge } from './state-edge';
import { DiagramContainer } from '@/components/diagrams/diagram-container';
import { useDocsTheme } from '@/components/DocsThemeProvider';

const nodeTypes: NodeTypes = {
  state: StateNode,
  initial: InitialNode,
  final: FinalNode,
};

const edgeTypes: EdgeTypes = {
  transitionEdge: TransitionEdge,
};

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export function StateDiagram({
  nodes: diagramNodes,
  edges: diagramEdges,
}: Props) {
  const { theme } = useDocsTheme();
  const { nodes, edges } = useMemo(
    () => layoutState(diagramNodes, diagramEdges),
    [diagramNodes, diagramEdges]
  );

  if (nodes.length === 0) return null;

  return (
    <DiagramContainer title="State Diagram">
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
          <svg className="absolute w-0 h-0">
            <defs>
              <marker
                id="arrowhead"
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
            </defs>
          </svg>
          <Background gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      )}
    </DiagramContainer>
  );
}

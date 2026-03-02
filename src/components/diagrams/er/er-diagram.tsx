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
import { layoutER } from './er-layout';
import { EntityNode } from './er-nodes';
import { EREdge, ERMarkerDefs } from './er-edge';
import { DiagramContainer } from '@/components/diagrams/diagram-container';
import { useDocsTheme } from '@/components/DocsThemeProvider';

const nodeTypes: NodeTypes = {
  entity: EntityNode,
};

const edgeTypes: EdgeTypes = {
  erEdge: EREdge,
};

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export function ERDiagram({
  nodes: diagramNodes,
  edges: diagramEdges,
}: Props) {
  const { theme } = useDocsTheme();
  const { nodes, edges } = useMemo(
    () => layoutER(diagramNodes, diagramEdges),
    [diagramNodes, diagramEdges]
  );

  if (nodes.length === 0) return null;

  return (
    <DiagramContainer title="ER Diagram">
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
          <ERMarkerDefs />
          <Background gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      )}
    </DiagramContainer>
  );
}

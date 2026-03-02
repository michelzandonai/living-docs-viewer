import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import type { DiagramNode, DiagramEdge, EREdgeType } from '@/lib/types';
import type { EREntityNodeData, ERField } from './er-nodes';
import type { EREdgeData } from './er-edge';

const NODE_WIDTH = 180;
const HEADER_HEIGHT = 32;
const FIELD_HEIGHT = 24;
const MIN_NODE_HEIGHT = 80;

function estimateNodeHeight(fields: ERField[]): number {
  if (fields.length === 0) return MIN_NODE_HEIGHT;
  return Math.max(MIN_NODE_HEIGHT, HEADER_HEIGHT + fields.length * FIELD_HEIGHT);
}

export interface ERLayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function layoutER(
  diagramNodes: DiagramNode[],
  diagramEdges: DiagramEdge[]
): ERLayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 120 });

  for (const node of diagramNodes) {
    const fields = (node.data?.fields as ERField[]) ?? [];
    const height = estimateNodeHeight(fields);
    g.setNode(node.id, { width: NODE_WIDTH, height });
  }

  for (const edge of diagramEdges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const nodes: Node<EREntityNodeData>[] = diagramNodes.map((node) => {
    const fields = (node.data?.fields as ERField[]) ?? [];
    const height = estimateNodeHeight(fields);
    const pos = g.node(node.id);
    return {
      id: node.id,
      type: 'entity',
      position: {
        x: (pos?.x ?? 0) - NODE_WIDTH / 2,
        y: (pos?.y ?? 0) - height / 2,
      },
      data: {
        label: node.label,
        fields,
      },
    };
  });

  const edges: Edge[] = diagramEdges.map((edge, i) => ({
    id: `er-e-${i}`,
    source: edge.source,
    target: edge.target,
    type: 'erEdge',
    data: {
      erType: edge.edgeType as EREdgeType,
      label: edge.label,
    } satisfies EREdgeData,
  }));

  return { nodes, edges };
}

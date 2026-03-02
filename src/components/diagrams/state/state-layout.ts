import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import type { DiagramNode, DiagramEdge } from '@/lib/types';

const NODE_DEFAULTS: Record<string, { width: number; height: number }> = {
  state: { width: 150, height: 50 },
  initial: { width: 24, height: 24 },
  final: { width: 28, height: 28 },
};

export interface StateLayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function layoutState(
  diagramNodes: DiagramNode[],
  diagramEdges: DiagramEdge[]
): StateLayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 100 });

  for (const node of diagramNodes) {
    const dims = NODE_DEFAULTS[node.nodeType] ?? NODE_DEFAULTS.state;
    g.setNode(node.id, { width: dims.width, height: dims.height });
  }

  for (const edge of diagramEdges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const nodes: Node[] = diagramNodes.map((node) => {
    const dims = NODE_DEFAULTS[node.nodeType] ?? NODE_DEFAULTS.state;
    const pos = g.node(node.id);
    return {
      id: node.id,
      type: node.nodeType,
      position: {
        x: (pos?.x ?? 0) - dims.width / 2,
        y: (pos?.y ?? 0) - dims.height / 2,
      },
      data: {
        label: node.label,
        ...node.data,
      },
    };
  });

  const edges: Edge[] = diagramEdges.map((edge, i) => ({
    id: `st-e-${i}`,
    source: edge.source,
    target: edge.target,
    type: 'transitionEdge',
    data: {
      label: edge.label,
    },
  }));

  return { nodes, edges };
}

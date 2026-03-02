import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import type { DiagramNode, DiagramEdge } from '@/lib/types';

const NODE_DEFAULTS: Record<string, { width: number; height: number }> = {
  process: { width: 150, height: 40 },
  decision: { width: 100, height: 100 },
  terminal: { width: 140, height: 40 },
  subprocess: { width: 150, height: 40 },
};

export interface FlowchartLayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function layoutFlowchart(
  diagramNodes: DiagramNode[],
  diagramEdges: DiagramEdge[]
): FlowchartLayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 });

  for (const node of diagramNodes) {
    const dims = NODE_DEFAULTS[node.nodeType] ?? NODE_DEFAULTS.process;
    g.setNode(node.id, { width: dims.width, height: dims.height });
  }

  for (const edge of diagramEdges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const nodes: Node[] = diagramNodes.map((node) => {
    const dims = NODE_DEFAULTS[node.nodeType] ?? NODE_DEFAULTS.process;
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
    id: `fc-e-${i}`,
    source: edge.source,
    target: edge.target,
    type: 'flowchartEdge',
    data: {
      edgeType: edge.edgeType,
      label: edge.label,
    },
  }));

  return { nodes, edges };
}

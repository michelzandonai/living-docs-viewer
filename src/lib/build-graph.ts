import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';
import type {
  DocsIndex,
  DocsIndexGraphNode,
} from './types';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 50;

export interface DocNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  scope: string;
  status: string;
  isGhost: boolean;
  isCurrent: boolean;
}

export interface GraphResult {
  nodes: Node<DocNodeData>[];
  edges: Edge[];
}

export function buildGraph(
  index: DocsIndex,
  currentDocId?: string
): GraphResult {
  if (!index.graph) return { nodes: [], edges: [] };

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 100 });

  for (const node of index.graph.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of index.graph.edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const indexedIds = new Set(index.documents.map((d) => d.id));

  const _graphNodeMap = new Map<string, DocsIndexGraphNode>();
  for (const node of index.graph.nodes) {
    _graphNodeMap.set(node.id, node);
  }

  const nodes: Node<DocNodeData>[] = index.graph.nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      id: node.id,
      type: 'docNode',
      position: {
        x: (pos?.x ?? 0) - NODE_WIDTH / 2,
        y: (pos?.y ?? 0) - NODE_HEIGHT / 2,
      },
      data: {
        label: node.id,
        type: node.type,
        scope: node.scope,
        status: node.status,
        isGhost: !indexedIds.has(node.id),
        isCurrent: node.id === currentDocId,
      },
    };
  });

  const edges: Edge[] = index.graph.edges.map((edge, i) => ({
    id: `e-${i}`,
    source: edge.source,
    target: edge.target,
    type: 'docEdge',
    label: edge.type,
    animated: edge.type === 'depends_on',
  }));

  return { nodes, edges };
}

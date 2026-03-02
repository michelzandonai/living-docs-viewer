import type { DiagramNode, DiagramEdge, StateNodeType } from '@/lib/types';

interface ParseResult {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export function parseStateDiagram(mermaidCode: string): ParseResult | null {
  const lines = mermaidCode.split('\n').map((l) => l.trim());

  // Validate it starts with stateDiagram
  const headerIdx = lines.findIndex((l) => /^stateDiagram(-v2)?/.test(l));
  if (headerIdx === -1) return null;

  const nodesMap = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];

  // Aliases: state "Description" as Alias
  const aliasMap = new Map<string, string>();

  let inNote = false;

  function getOrCreateNode(
    id: string,
    nodeType: StateNodeType = 'state'
  ): DiagramNode {
    if (nodesMap.has(id)) return nodesMap.get(id)!;
    const label = aliasMap.get(id) ?? id;
    const node: DiagramNode = { id, label, nodeType };
    nodesMap.set(id, node);
    return node;
  }

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines and comments
    if (!line || line.startsWith('%%')) continue;

    // Handle note blocks
    if (/^note\s+(right|left)\s+of\b/i.test(line)) {
      inNote = true;
      continue;
    }
    if (inNote) {
      if (/^end\s+note$/i.test(line)) inNote = false;
      continue;
    }

    // Skip direction directives
    if (/^direction\s+/i.test(line)) continue;

    // state "Description" as Alias
    const aliasMatch = line.match(/^state\s+"([^"]+)"\s+as\s+(\w+)/);
    if (aliasMatch) {
      aliasMap.set(aliasMatch[2], aliasMatch[1]);
      // Update node label if already created
      if (nodesMap.has(aliasMatch[2])) {
        nodesMap.get(aliasMatch[2])!.label = aliasMatch[1];
      }
      continue;
    }

    // State : description (add description to existing node data)
    const descMatch = line.match(/^(\w+)\s*:\s*(.+)$/);
    if (descMatch && !line.includes('-->')) {
      const node = getOrCreateNode(descMatch[1]);
      node.label = aliasMap.get(descMatch[1]) ?? descMatch[1];
      node.data = { ...node.data, description: descMatch[2] };
      continue;
    }

    // Transitions: A --> B or A --> B : label
    const transMatch = line.match(
      /^(\[?\*?\]?|\w+)\s*-->\s*(\[?\*?\]?|\w+)(?:\s*:\s*(.+))?$/
    );
    if (transMatch) {
      const [, rawSource, rawTarget, label] = transMatch;

      let sourceId: string;
      let targetId: string;

      // [*] is the initial/final pseudo-state
      if (rawSource === '[*]') {
        sourceId = '__initial__';
        getOrCreateNode(sourceId, 'initial');
      } else {
        sourceId = rawSource;
        getOrCreateNode(sourceId, 'state');
      }

      if (rawTarget === '[*]') {
        targetId = '__final__';
        getOrCreateNode(targetId, 'final');
      } else {
        targetId = rawTarget;
        getOrCreateNode(targetId, 'state');
      }

      edges.push({
        source: sourceId,
        target: targetId,
        edgeType: 'transition',
        ...(label ? { label: label.trim() } : {}),
      });

      continue;
    }
  }

  const nodes = Array.from(nodesMap.values());
  if (nodes.length === 0) return null;

  return { nodes, edges };
}

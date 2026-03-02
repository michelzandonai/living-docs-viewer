import type { DiagramNode, DiagramEdge, EREdgeType } from '@/lib/types';
import type { ERField } from './er-nodes';

/**
 * Parse a Mermaid erDiagram block into DiagramNode[] + DiagramEdge[].
 * Returns null if parsing fails.
 */
export function parseERDiagram(
  mermaidCode: string
): { nodes: DiagramNode[]; edges: DiagramEdge[] } | null {
  const lines = mermaidCode.split('\n').map((l) => l.trim());

  // Must start with erDiagram
  const startIdx = lines.findIndex((l) => /^erDiagram\s*$/.test(l));
  if (startIdx === -1) return null;

  const entityFields = new Map<string, ERField[]>();
  const edges: DiagramEdge[] = [];
  const referencedEntities = new Set<string>();

  let currentEntity: string | null = null;
  let collectingFields = false;

  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines and comments
    if (!line || line.startsWith('%%')) continue;

    // Close entity block
    if (line === '}') {
      collectingFields = false;
      currentEntity = null;
      continue;
    }

    // Open entity block: ENTITY_NAME {
    const entityOpen = line.match(/^(\w+)\s*\{$/);
    if (entityOpen) {
      currentEntity = entityOpen[1];
      collectingFields = true;
      if (!entityFields.has(currentEntity)) {
        entityFields.set(currentEntity, []);
      }
      continue;
    }

    // Field inside entity block: type name [PK|FK] ["comment"]
    if (collectingFields && currentEntity) {
      const fieldMatch = line.match(
        /^(\w+)\s+(\w+)(?:\s+(PK|FK))?(?:\s+"[^"]*")?$/
      );
      if (fieldMatch) {
        const fields = entityFields.get(currentEntity)!;
        fields.push({
          name: fieldMatch[2],
          type: fieldMatch[1],
          pk: fieldMatch[3] === 'PK',
          fk: fieldMatch[3] === 'FK',
        });
      }
      continue;
    }

    // Relationship: ENTITY1 <rel> ENTITY2 : "label"
    const relMatch = line.match(
      /^(\w+)\s+([|{}o]+--[|{}o]+)\s+(\w+)\s*:\s*"?([^"]*)"?$/
    );
    if (relMatch) {
      const [, source, relSymbol, target, label] = relMatch;
      referencedEntities.add(source);
      referencedEntities.add(target);

      edges.push({
        source: `er-${source}`,
        target: `er-${target}`,
        edgeType: parseRelationshipType(relSymbol),
        label: label || undefined,
      });
    }
  }

  // Ensure entities referenced in relationships exist as nodes
  for (const name of referencedEntities) {
    if (!entityFields.has(name)) {
      entityFields.set(name, []);
    }
  }

  if (entityFields.size === 0) return null;

  const nodes: DiagramNode[] = Array.from(entityFields.entries()).map(
    ([name, fields]) => ({
      id: `er-${name}`,
      label: name,
      nodeType: 'entity' as const,
      data: { fields },
    })
  );

  return { nodes, edges };
}

/**
 * Map Mermaid ER relationship symbols to EREdgeType.
 *
 * Common patterns:
 *   ||--||  -> one_to_one
 *   ||--o{  -> one_to_many
 *   }o--||  -> one_to_many (reversed)
 *   }o--o{  -> many_to_many
 *   ||--|{  -> one_to_many
 *   }|--||  -> one_to_many (reversed)
 */
function parseRelationshipType(symbol: string): EREdgeType {
  const cleaned = symbol.replace(/\s/g, '');

  // Split on -- to get left and right sides
  const parts = cleaned.split('--');
  if (parts.length !== 2) return 'one_to_many';

  const leftIsMany = parts[0].includes('{') || parts[0].includes('}');
  const rightIsMany = parts[1].includes('{') || parts[1].includes('}');

  if (leftIsMany && rightIsMany) return 'many_to_many';
  if (leftIsMany || rightIsMany) return 'one_to_many';
  return 'one_to_one';
}

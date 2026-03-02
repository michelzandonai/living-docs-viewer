import type { CanonicalDiagramType, RawDiagramType } from './types';

const TYPE_ALIAS_MAP: Record<string, CanonicalDiagramType> = {
  erDiagram: 'er_diagram',
  er: 'er_diagram',
  sequenceDiagram: 'sequence',
  stateDiagram: 'state_diagram',
};

const MERMAID_KEYWORD_MAP: [RegExp, CanonicalDiagramType][] = [
  [/^\s*(flowchart|graph)\b/, 'flowchart'],
  [/^\s*sequenceDiagram\b/, 'sequence'],
  [/^\s*stateDiagram/, 'state_diagram'],
  [/^\s*erDiagram\b/, 'er_diagram'],
];

function inferTypeFromMermaid(code: string): CanonicalDiagramType {
  for (const [pattern, type] of MERMAID_KEYWORD_MAP) {
    if (pattern.test(code)) return type;
  }
  return 'mermaid';
}

export function normalizeDiagramType(
  rawType: RawDiagramType,
  mermaidCode?: string
): CanonicalDiagramType {
  if (rawType in TYPE_ALIAS_MAP) {
    return TYPE_ALIAS_MAP[rawType];
  }

  if (rawType === 'mermaid' && mermaidCode) {
    return inferTypeFromMermaid(mermaidCode);
  }

  return rawType as CanonicalDiagramType;
}

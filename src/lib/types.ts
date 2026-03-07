// Living Docs — TypeScript types based on energimap-doc/v1 schema

export interface DocMetadata {
  title: string;
  status: string;
  dateCreated: string;
  dateModified?: string;
  authorIds: string[];
  scope?: 'shared' | 'api' | 'frontend' | 'mobile' | 'cross-project';
  tagIds?: string[];
  summary?: string;
  supersedes?: string;
  supersededBy?: string;
  draft?: boolean;
  number?: number;
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections?: DocSection[];
}

export interface DocReference {
  targetId: string;
  type:
    | 'references'
    | 'supersedes'
    | 'superseded_by'
    | 'depends_on'
    | 'implements'
    | 'related'
    | 'external';
  description?: string;
}

export interface DocTable {
  id: string;
  title?: string;
  columns: string[];
  /** @deprecated Use columns instead */
  headers?: string[];
  rows: string[][];
}

// --- Diagram node types by family ---
export type FlowchartNodeType = 'process' | 'decision' | 'terminal' | 'subprocess';
export type SequenceNodeType = 'actor' | 'message_bar' | 'sequence_block';
export type StateNodeType = 'state' | 'initial' | 'final';
export type ERNodeType = 'entity';
export type DiagramNodeType = FlowchartNodeType | SequenceNodeType | StateNodeType | ERNodeType;

// --- Diagram edge types by family ---
export type FlowchartEdgeType = 'flow' | 'conditional';
export type SequenceEdgeType = 'sync_message' | 'return';
export type StateEdgeType = 'transition';
export type EREdgeType = 'one_to_many' | 'one_to_one' | 'many_to_many';
export type DiagramEdgeType = FlowchartEdgeType | SequenceEdgeType | StateEdgeType | EREdgeType;

export interface DiagramNode {
  id: string;
  label: string;
  nodeType: DiagramNodeType;
  data?: Record<string, unknown>;
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
  edgeType: DiagramEdgeType;
}

// Canonical diagram type (after normalization)
export type CanonicalDiagramType =
  | 'dependency_graph'
  | 'flowchart'
  | 'state_diagram'
  | 'er_diagram'
  | 'sequence'
  | 'mermaid';

// Raw diagram type (includes variants found in JSONs)
export type RawDiagramType =
  | CanonicalDiagramType
  | 'erDiagram'
  | 'er'
  | 'sequenceDiagram'
  | 'stateDiagram';

export interface DocDiagram {
  id: string;
  type: RawDiagramType;
  title?: string;
  mermaid?: string;
  content?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  conversionError?: boolean;
}

export interface DocChangelogEntry {
  date: string;
  description: string;
}

export type DocType = 'adr' | 'prd' | 'task' | 'guideline' | 'planning';

export interface DocBase {
  $docSchema: 'energimap-doc/v1';
  type: DocType;
  id: string;
  metadata: DocMetadata;
  sections: DocSection[];
  references?: DocReference[];
  tables?: DocTable[];
  diagrams?: DocDiagram[];
  changelog?: DocChangelogEntry[];
}

export interface DocAdrFields {
  context?: string;
  decision?: string;
  decisions?: { id: string; text: string }[];
  justification?: string;
  consequences?: {
    positive?: string[];
    negative?: string[];
    mitigations?: string[];
  };
  alternatives?: (string | { name: string; reason: string })[];
  invariants?: string[];
  principles?: string[];
  guidingPrinciple?: string;
  phases?: {
    id: string;
    title: string;
    description?: string;
    items?: string[];
  }[];
  successCriteria?: string[];
  agentRules?: string[];
  security?: string;
  implementation?: string;
}

export interface DocAdr extends DocBase {
  type: 'adr';
  adr?: DocAdrFields;
}

export interface DocGuidelineFields {
  appliesTo?: string | string[];
  lastRevision?: string;
  rules?: {
    id: string;
    description: string;
    whenApplies?: string;
    riskOfIgnoring?: string;
    example?: string;
  }[];
  checklist?: string[];
  antiPatterns?: string[];
}

export interface DocGuideline extends DocBase {
  type: 'guideline';
  guideline?: DocGuidelineFields;
}

export interface DocPrdFields {
  version?: string;
  personas?: { name: string; description: string }[];
  scope?: { included: string[]; excluded: string[] };
  functionalRequirements?: { id: string; description: string; endpoint?: string; validations?: string[] }[];
  nonFunctionalRequirements?: { id: string; description: string }[];
  businessRules?: { id: string; description: string; pseudocode?: string }[];
  apiSpecification?: { method: string; path: string; summary?: string; request?: string; response?: string }[];
  dataModel?: string;
  metrics?: { name: string; target: string; unit?: string }[];
  useCases?: { id: string; description?: string; given?: string; when?: string; then?: string }[];
  involvedFiles?: { path: string; layer?: string; action?: string }[];
  permissions?: { action: string; roles: string[] }[];
}

export interface DocPrd extends DocBase {
  type: 'prd';
  prd?: DocPrdFields;
}

export interface DocTaskFix {
  id: number;
  title: string;
  category?: string;
  description: string;
  logic?: string;
  files: string[];
  testFile?: string;
  referencePattern?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface DocTaskRegressionTests {
  description?: string;
  cycle?: { step1: string; step2: string; step3: string };
  files?: string[];
  exportedFunctions?: string[];
  suiteResult?: string;
}

export interface DocTaskLinks {
  plan?: string;
  successor?: string;
  adrs?: string[];
  relatedFiles?: Record<string, string>;
}

export interface DocTaskFields {
  context?: {
    problem?: string;
    rootCause?: string;
    impactedWorkflow?: string;
    impactedSteps?: { order: number; name: string; componentType: string }[];
    predecessor?: string;
    successorContext?: string;
  };
  fixes?: DocTaskFix[];
  regressionTests?: DocTaskRegressionTests;
  allFilesModified?: string[];
  verify?: string[];
  links?: DocTaskLinks;
}

export interface DocTask extends DocBase {
  type: 'task';
  context?: DocTaskFields['context'];
  fixes?: DocTaskFix[];
  regressionTests?: DocTaskRegressionTests;
  allFilesModified?: string[];
  verify?: string[];
  links?: DocTaskLinks;
}

export interface PlanningItem {
  t: string;
  d?: string;
  s: 'p' | 'a' | 'd';
  why?: string;
}

export interface PlanningPhase {
  title: string;
  rationale?: string;
  items: PlanningItem[];
}

export interface DocPlanningFields {
  goal: string;
  context?: Record<string, unknown>;
  phases?: PlanningPhase[];
  items?: PlanningItem[];
  risks?: { r: string; m: string }[];
  files?: string[];
  verify?: string[];
}

export interface DocPlanning extends DocBase {
  type: 'planning';
  planning?: DocPlanningFields;
}

export type Doc = DocBase | DocAdr | DocGuideline | DocPrd | DocPlanning | DocTask;

// Index types

export interface DocsIndexEntry {
  id: string;
  type: string;
  title: string;
  status: string;
  scope: string;
  dateCreated: string;
  dateModified?: string;
  _fileMtime?: string;
  tagIds: string[];
  summary: string;
  path: string;
}

export interface DocsIndexGraphNode {
  id: string;
  type: string;
  scope: string;
  status: string;
}

export interface DocsIndexGraphEdge {
  source: string;
  target: string;
  type: string;
}

export interface DocsIndex {
  $docSchema: 'energimap-doc/v1';
  generatedAt: string;
  stats: {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  documents: DocsIndexEntry[];
  graph?: {
    nodes: DocsIndexGraphNode[];
    edges: DocsIndexGraphEdge[];
  };
}

// Catalog types

export interface AuthorsCatalog {
  [id: string]: { name: string; role: string };
}

export interface TagsCatalog {
  [id: string]: { label: string; category: string };
}

export interface GlossaryCatalog {
  [id: string]: { definition: string; aliases: string[] };
}

export interface Catalogs {
  authors: AuthorsCatalog;
  tags: TagsCatalog;
  glossary: GlossaryCatalog;
}

export interface ResolvedTag {
  id: string;
  label: string;
  category: string;
}

export interface DocsViewerProps {
  apiUrl: string;
  theme?: 'light' | 'dark';
  className?: string;
  onDocSelect?: (docId: string) => void;
}

// Graph visualization types (used by build-graph and diagram components)

export interface GraphNodePosition {
  x: number;
  y: number;
}

export interface GraphNode<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type?: string;
  position: GraphNodePosition;
  data: T;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  animated?: boolean;
}

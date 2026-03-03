import { ClassValue } from 'clsx';
import { JSX } from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { StoreApi } from 'zustand';
import { UseBoundStore } from 'zustand';

export declare function AdrAnalysis({ adr }: AnalysisProps): JSX.Element | null;

export declare function AdrContextDecision({ adr }: ContextDecisionProps): JSX.Element | null;

export declare function AdrImplementation({ adr }: ImplementationProps): JSX.Element | null;

declare interface AnalysisProps {
    adr?: DocAdrFields;
}

declare interface AntiPatternsProps {
    antiPatterns?: string[];
}

export declare interface AuthorsCatalog {
    [id: string]: {
        name: string;
        role: string;
    };
}

declare type CanonicalDiagramType = 'dependency_graph' | 'flowchart' | 'state_diagram' | 'er_diagram' | 'sequence' | 'mermaid';

export declare interface Catalogs {
    authors: AuthorsCatalog;
    tags: TagsCatalog;
    glossary: GlossaryCatalog;
}

declare interface ChecklistProps {
    checklist?: string[];
}

export declare function cn(...inputs: ClassValue[]): string;

declare interface ContextDecisionProps {
    adr?: DocAdrFields;
}

export declare function DependencyGraph({ index, currentDocId }: Props_2): JSX.Element | null;

export declare function DiagramContainer({ children, title }: DiagramContainerProps): JSX.Element;

declare interface DiagramContainerProps {
    children: (props: {
        isExpanded: boolean;
    }) => ReactNode;
    title?: string;
}

declare interface DiagramEdge {
    source: string;
    target: string;
    label?: string;
    edgeType: DiagramEdgeType;
}

declare type DiagramEdgeType = FlowchartEdgeType | SequenceEdgeType | StateEdgeType | EREdgeType;

declare interface DiagramNode {
    id: string;
    label: string;
    nodeType: DiagramNodeType;
    data?: Record<string, unknown>;
}

declare type DiagramNodeType = FlowchartNodeType | SequenceNodeType | StateNodeType | ERNodeType;

export declare function DiagramRenderer({ diagram, index, currentDocId }: Props): JSX.Element;

export declare type Doc = DocBase | DocAdr | DocGuideline | DocPrd | DocPlanning | DocTask;

export declare interface DocAdr extends DocBase {
    type: 'adr';
    adr?: DocAdrFields;
}

export declare function DocAdrDetail({ adr }: DocAdrDetailProps): JSX.Element;

declare interface DocAdrDetailProps {
    adr: DocAdrFields;
}

declare interface DocAdrFields {
    context?: string;
    decision?: string;
    decisions?: {
        id: string;
        text: string;
    }[];
    justification?: string;
    consequences?: {
        positive?: string[];
        negative?: string[];
        mitigations?: string[];
    };
    alternatives?: (string | {
        name: string;
        reason: string;
    })[];
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

export declare interface DocBase {
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

export declare function DocChangelog({ changelog }: DocChangelogProps): JSX.Element;

export declare interface DocChangelogEntry {
    date: string;
    description: string;
}

declare interface DocChangelogProps {
    changelog: DocChangelogEntry[];
}

export declare function DocDetail(): JSX.Element;

export declare interface DocDiagram {
    id: string;
    type: RawDiagramType;
    title?: string;
    mermaid?: string;
    content?: string;
    nodes?: DiagramNode[];
    edges?: DiagramEdge[];
    conversionError?: boolean;
}

export declare interface DocGuideline extends DocBase {
    type: 'guideline';
    guideline?: DocGuidelineFields;
}

export declare function DocGuidelineDetail({ guideline }: DocGuidelineDetailProps): JSX.Element;

declare interface DocGuidelineDetailProps {
    guideline: DocGuidelineFields;
}

declare interface DocGuidelineFields {
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

export declare interface DocMetadata {
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

export declare function DocMetadataHeader({ metadata, docId, docType, catalogs }: DocMetadataHeaderProps): JSX.Element;

declare interface DocMetadataHeaderProps {
    metadata: DocMetadata;
    docId: string;
    docType: DocType;
    catalogs: Catalogs | null;
}

export declare interface DocPlanning extends DocBase {
    type: 'planning';
    planning?: DocPlanningFields;
}

export declare function DocPlanningDetail({ planning }: DocPlanningDetailProps): JSX.Element;

declare interface DocPlanningDetailProps {
    planning: DocPlanningFields;
}

declare interface DocPlanningFields {
    goal: string;
    context?: Record<string, unknown>;
    phases?: PlanningPhase[];
    items?: PlanningItem[];
    risks?: {
        r: string;
        m: string;
    }[];
    files?: string[];
    verify?: string[];
}

export declare interface DocPrd extends DocBase {
    type: 'prd';
    prd?: DocPrdFields;
}

export declare function DocPrdDetail({ prd }: DocPrdDetailProps): JSX.Element;

declare interface DocPrdDetailProps {
    prd: DocPrdFields;
}

declare interface DocPrdFields {
    version?: string;
    personas?: {
        name: string;
        description: string;
    }[];
    scope?: {
        included: string[];
        excluded: string[];
    };
    functionalRequirements?: {
        id: string;
        description: string;
        endpoint?: string;
        validations?: string[];
    }[];
    nonFunctionalRequirements?: {
        id: string;
        description: string;
    }[];
    businessRules?: {
        id: string;
        description: string;
        pseudocode?: string;
    }[];
    apiSpecification?: {
        method: string;
        path: string;
        summary?: string;
        request?: string;
        response?: string;
    }[];
    dataModel?: string;
    metrics?: {
        name: string;
        target: string;
        unit?: string;
    }[];
    useCases?: {
        id: string;
        description?: string;
        given?: string;
        when?: string;
        then?: string;
    }[];
    involvedFiles?: {
        path: string;
        layer?: string;
        action?: string;
    }[];
    permissions?: {
        action: string;
        roles: string[];
    }[];
}

export declare interface DocReference {
    targetId: string;
    type: 'references' | 'supersedes' | 'superseded_by' | 'depends_on' | 'implements' | 'related' | 'external';
    description?: string;
}

export declare function DocReferences({ references, indexedDocIds, onSelect }: DocReferencesProps): JSX.Element | null;

declare interface DocReferencesProps {
    references: DocReference[];
    indexedDocIds?: Set<string>;
    onSelect?: (docId: string) => void;
}

export declare function DocSearch({ className }: DocSearchProps): JSX.Element;

declare interface DocSearchProps {
    className?: string;
}

export declare interface DocSection {
    id: string;
    title: string;
    content: string;
    subsections?: DocSection[];
}

export declare function DocSectionRenderer({ section, level }: DocSectionRendererProps): JSX.Element;

declare interface DocSectionRendererProps {
    section: DocSection;
    level?: number;
}

export declare interface DocsIndex {
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

export declare interface DocsIndexEntry {
    id: string;
    type: string;
    title: string;
    status: string;
    scope: string;
    dateCreated: string;
    dateModified?: string;
    tagIds: string[];
    summary: string;
    path: string;
}

declare interface DocsIndexGraphEdge {
    source: string;
    target: string;
    type: string;
}

declare interface DocsIndexGraphNode {
    id: string;
    type: string;
    scope: string;
    status: string;
}

export declare function DocsLayoutShell({ sidebar, children }: DocsLayoutShellProps): JSX.Element;

declare interface DocsLayoutShellProps {
    sidebar: React.ReactNode;
    children: React.ReactNode;
}

export declare function DocsSidebar({ className, onDocSelect }: DocsSidebarProps): JSX.Element;

declare interface DocsSidebarProps {
    className?: string;
    onDocSelect?: (docId: string) => void;
}

declare interface DocsState {
    apiUrl: string;
    index: DocsIndex | null;
    catalogs: Catalogs | null;
    currentDoc: Doc | null;
    currentDocId: string | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    typeFilter: DocType | null;
    expandedNodes: Record<string, boolean>;
    theme: 'light' | 'dark';
    setApiUrl: (url: string) => void;
    loadIndex: (overrideUrl?: string) => Promise<void>;
    selectDoc: (docId: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    setTypeFilter: (type: DocType | null) => void;
    toggleNode: (nodeId: string) => void;
    expandAll: (nodeIds: string[]) => void;
    collapseAll: () => void;
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export declare function DocsThemeToggle(): JSX.Element;

export declare function DocsViewer({ apiUrl, theme, className, onDocSelect, }: DocsViewerProps): JSX.Element;

export declare interface DocsViewerProps {
    apiUrl: string;
    theme?: 'light' | 'dark';
    className?: string;
    onDocSelect?: (docId: string) => void;
}

export declare interface DocTable {
    id: string;
    title?: string;
    columns: string[];
    /** @deprecated Use columns instead */
    headers?: string[];
    rows: string[][];
}

export declare function DocTableView({ tables }: DocTableViewProps): JSX.Element;

declare interface DocTableViewProps {
    tables: DocTable[];
}

export declare function DocTabs({ tabs, defaultTab }: DocTabsProps): JSX.Element | null;

declare interface DocTabsProps {
    tabs: TabItem[];
    defaultTab?: string;
}

export declare interface DocTask extends DocBase {
    type: 'task';
    context?: DocTaskFields['context'];
    fixes?: DocTaskFix[];
    regressionTests?: DocTaskRegressionTests;
    allFilesModified?: string[];
    verify?: string[];
    links?: DocTaskLinks;
}

export declare function DocTaskDetail({ doc }: DocTaskDetailProps): JSX.Element;

declare interface DocTaskDetailProps {
    doc: DocTask;
}

declare interface DocTaskFields {
    context?: {
        problem?: string;
        rootCause?: string;
        impactedWorkflow?: string;
        impactedSteps?: {
            order: number;
            name: string;
            componentType: string;
        }[];
        predecessor?: string;
        successorContext?: string;
    };
    fixes?: DocTaskFix[];
    regressionTests?: DocTaskRegressionTests;
    allFilesModified?: string[];
    verify?: string[];
    links?: DocTaskLinks;
}

declare interface DocTaskFix {
    id: number;
    title: string;
    category?: string;
    description: string;
    logic?: string;
    files: string[];
    testFile?: string;
    referencePattern?: string;
}

declare interface DocTaskLinks {
    plan?: string;
    successor?: string;
    adrs?: string[];
    relatedFiles?: Record<string, string>;
}

declare interface DocTaskRegressionTests {
    description?: string;
    cycle?: {
        step1: string;
        step2: string;
        step3: string;
    };
    files?: string[];
    exportedFunctions?: string[];
    suiteResult?: string;
}

export declare type DocType = 'adr' | 'prd' | 'task' | 'guideline' | 'planning';

declare type EREdgeType = 'one_to_many' | 'one_to_one' | 'many_to_many';

declare type ERNodeType = 'entity';

declare type FlowchartEdgeType = 'flow' | 'conditional';

declare type FlowchartNodeType = 'process' | 'decision' | 'terminal' | 'subprocess';

export declare interface GlossaryCatalog {
    [id: string]: {
        definition: string;
        aliases: string[];
    };
}

export declare function GuidelineAntiPatterns({ antiPatterns }: AntiPatternsProps): JSX.Element | null;

export declare function GuidelineChecklist({ checklist }: ChecklistProps): JSX.Element | null;

export declare function GuidelineOverview({ guideline }: OverviewProps_2): JSX.Element | null;

export declare function GuidelineRules({ rules }: RulesProps): JSX.Element | null;

declare interface ImplementationProps {
    adr?: DocAdrFields;
}

declare interface MetricsProps {
    prd?: DocPrdFields;
}

declare interface OverviewProps {
    prd?: DocPrdFields;
}

declare interface OverviewProps_2 {
    guideline?: DocGuidelineFields;
}

declare interface PlanningItem {
    t: string;
    d?: string;
    s: 'p' | 'a' | 'd';
    why?: string;
}

export declare function PlanningOverview({ planning }: {
    planning: DocPlanningFields;
}): JSX.Element;

declare interface PlanningPhase {
    title: string;
    rationale?: string;
    items: PlanningItem[];
}

export declare function PlanningRisks({ risks }: {
    risks?: DocPlanningFields['risks'];
}): JSX.Element | null;

export declare function PlanningTechnical({ planning }: {
    planning: DocPlanningFields;
}): JSX.Element | null;

export declare function PrdMetrics({ prd }: MetricsProps): JSX.Element | null;

export declare function PrdOverview({ prd }: OverviewProps): JSX.Element | null;

export declare function PrdRequirements({ prd }: RequirementsProps): JSX.Element | null;

export declare function PrdTechnical({ prd }: TechnicalProps): JSX.Element | null;

declare interface Props {
    diagram: DocDiagram;
    index?: DocsIndex;
    currentDocId?: string;
}

declare interface Props_2 {
    index: DocsIndex;
    currentDocId?: string;
}

declare type RawDiagramType = CanonicalDiagramType | 'erDiagram' | 'er' | 'sequenceDiagram' | 'stateDiagram';

declare interface RequirementsProps {
    prd?: DocPrdFields;
}

declare interface RulesProps {
    rules?: DocGuidelineFields['rules'];
}

declare type SequenceEdgeType = 'sync_message' | 'return';

declare type SequenceNodeType = 'actor' | 'message_bar' | 'sequence_block';

declare type StateEdgeType = 'transition';

declare type StateNodeType = 'state' | 'initial' | 'final';

export declare interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string;
    content: () => React.ReactNode;
}

export declare interface TagsCatalog {
    [id: string]: {
        label: string;
        category: string;
    };
}

export declare function TaskFixes({ fixes }: {
    fixes: DocTaskFix[];
}): JSX.Element | null;

export declare function TaskOverview({ task }: {
    task: DocTask;
}): JSX.Element;

export declare function TaskTechnical({ task }: {
    task: DocTask;
}): JSX.Element | null;

declare interface TechnicalProps {
    prd?: DocPrdFields;
}

export declare const useDocsStore: UseBoundStore<StoreApi<DocsState>>;

/**
 * Backward-compatible hook that delegates to the Zustand store.
 * The old Context-based DocsThemeProvider has been removed.
 * The Zustand store (useDocsStore) is the single source of truth for theme.
 */
export declare function useDocsTheme(): {
    theme: "light" | "dark";
    toggleTheme: () => void;
};

export { }

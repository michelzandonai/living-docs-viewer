// Layout & Theme
export { DocsLayoutShell } from './components/DocsLayoutShell'
export { DocsThemeProvider, useDocsTheme } from './components/DocsThemeProvider'
export { DocsThemeToggle } from './components/DocsThemeToggle'

// Main Viewer
export { DocsViewer } from './components/DocsViewer'

// Sidebar & Navigation
export { DocsSidebar } from './components/DocsSidebar'
export { DocSearch } from './components/DocSearch'

// Document Display
export { DocDetail } from './components/DocDetail'
export { DocMetadataHeader } from './components/DocMetadataHeader'
export { DocSectionRenderer } from './components/DocSectionRenderer'
export { DocTableView } from './components/DocTableView'
export { DocReferences } from './components/DocReferences'
export { DocChangelog } from './components/DocChangelog'

// Type-Specific Detail Views
export { DocAdrDetail, AdrContextDecision, AdrAnalysis, AdrImplementation } from './components/DocAdrDetail'
export { DocPrdDetail, PrdOverview, PrdRequirements, PrdTechnical, PrdMetrics } from './components/DocPrdDetail'
export { DocGuidelineDetail, GuidelineOverview, GuidelineRules, GuidelineChecklist, GuidelineAntiPatterns } from './components/DocGuidelineDetail'
export { DocTaskDetail, TaskOverview, TaskFixes, TaskTechnical } from './components/DocTaskDetail'
export { DocPlanningDetail, PlanningOverview, PlanningRisks, PlanningTechnical } from './components/DocPlanningDetail'

// Tabs
export { DocTabs } from './components/DocTabs'
export type { TabItem } from './components/DocTabs'

// Diagrams
export { MermaidDiagram } from './components/MermaidDiagram'
export { DiagramRenderer } from './components/diagrams/diagram-renderer'
export { DependencyGraph } from './components/diagrams/dependency-graph'
export { DiagramContainer } from './components/diagrams/diagram-container'

// Store
export { useDocsStore } from './hooks/use-docs-store'

// Utilities
export { cn } from './lib/cn'

// Types
export type {
  DocsViewerProps,
  DocsIndex,
  DocsIndexEntry,
  DocBase,
  DocAdr,
  DocPrd,
  DocGuideline,
  DocTask,
  DocPlanning,
  Doc,
  DocType,
  DocMetadata,
  DocSection,
  DocReference,
  DocTable,
  DocDiagram,
  DocChangelogEntry,
  AuthorsCatalog,
  TagsCatalog,
  GlossaryCatalog,
  Catalogs,
} from './lib/types'

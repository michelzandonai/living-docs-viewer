export interface DocsIndex {
  $docSchema: string
  generatedAt: string
  stats: {
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
  }
  documents: DocsIndexEntry[]
}

export interface DocsIndexEntry {
  id: string
  type: DocType
  title: string
  status: string
  path: string
  scope: string
  dateCreated: string
  tagIds: string[]
  summary: string
}

export type DocType = 'adr' | 'prd' | 'task' | 'guideline'

export interface DocBase {
  $docSchema: string
  id: string
  type: DocType
  metadata: DocMetadata
  sections: DocSection[]
  references?: DocReference[]
  tables?: DocTable[]
  diagrams?: DocDiagram[]
  changelog?: DocChangelogEntry[]
}

export interface DocMetadata {
  title: string
  status: string
  dateCreated: string
  dateModified?: string
  authorIds: string[]
  scope?: string
  tagIds?: string[]
  summary?: string
  draft?: boolean
}

export interface DocSection {
  id: string
  title: string
  content: string
  subsections?: DocSection[]
}

export interface DocReference {
  targetId: string
  type: 'references' | 'supersedes' | 'superseded_by' | 'depends_on' | 'implements' | 'related' | 'external'
  description?: string
}

export interface DocTable {
  id: string
  title?: string
  columns: string[]
  rows: string[][]
}

export interface DocDiagram {
  id: string
  type: 'dependency_graph' | 'flowchart' | 'state_diagram' | 'er_diagram' | 'sequence' | 'mermaid'
  title?: string
  mermaid?: string
}

export interface DocChangelogEntry {
  date: string
  description: string
}

export interface DocAdr extends DocBase {
  type: 'adr'
  adr?: {
    context?: string
    decision?: string
    justification?: string
    consequences?: {
      positive?: string[]
      negative?: string[]
      mitigations?: string[]
    }
    alternatives?: string[]
    successCriteria?: string[]
  }
}

export interface DocPrd extends DocBase {
  type: 'prd'
  prd?: {
    version?: string
    personas?: { name: string; description: string }[]
    scope?: { included?: string[]; excluded?: string[] }
    functionalRequirements?: { id: string; description: string }[]
    nonFunctionalRequirements?: { id: string; description: string }[]
    businessRules?: { id: string; description: string }[]
    apiSpecification?: { method: string; path: string; summary?: string }[]
    useCases?: { id: string; description?: string; given?: string; when?: string; then?: string }[]
  }
}

export interface DocGuideline extends DocBase {
  type: 'guideline'
  guideline?: {
    appliesTo?: string
    rules?: { id: string; description: string; whenApplies?: string; riskOfIgnoring?: string }[]
    checklist?: string[]
    antiPatterns?: string[]
  }
}

export interface DocTask extends DocBase {
  type: 'task'
  context?: { problem?: string; rootCause?: string }
  fixes?: { id: string; title: string; description: string; files?: string[] }[]
  verify?: string[]
}

export type Doc = DocAdr | DocPrd | DocGuideline | DocTask | DocBase

export interface AuthorsCatalog {
  [id: string]: { name: string; role: string }
}

export interface TagsCatalog {
  [id: string]: { label: string; category: string }
}

export interface GlossaryCatalog {
  [id: string]: { definition: string; aliases: string[] }
}

export interface Catalogs {
  authors: AuthorsCatalog
  tags: TagsCatalog
  glossary: GlossaryCatalog
}

export interface DocsViewerProps {
  apiUrl: string
  theme?: 'light' | 'dark' | 'system'
  className?: string
  onDocSelect?: (docId: string) => void
}

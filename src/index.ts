export { DocsViewer } from './components/DocsViewer'
export { DocsSidebar } from './components/DocsSidebar'
export { DocDetail } from './components/DocDetail'
export { DocMetadataHeader } from './components/DocMetadataHeader'
export { DocSectionRenderer } from './components/DocSectionRenderer'
export { DocTableView } from './components/DocTableView'
export { DocReferences } from './components/DocReferences'
export { DocChangelog } from './components/DocChangelog'
export { DocAdrDetail } from './components/DocAdrDetail'
export { DocPrdDetail } from './components/DocPrdDetail'
export { DocGuidelineDetail } from './components/DocGuidelineDetail'
export { DocTaskDetail } from './components/DocTaskDetail'
export { MermaidDiagram } from './components/MermaidDiagram'
export { useDocsStore } from './hooks/use-docs-store'

export type {
  DocsViewerProps,
  DocsIndex,
  DocsIndexEntry,
  DocBase,
  DocAdr,
  DocPrd,
  DocGuideline,
  DocTask,
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

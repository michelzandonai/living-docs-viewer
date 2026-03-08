import React, { Suspense } from 'react'
import {
  FileText,
  Scale,
  Wrench,
  BarChart3,
  GitBranch,
  ClipboardList,
  Code2,
  ShieldAlert,
} from 'lucide-react'
import { useDocsStore } from '@/hooks/use-docs-store'
import type {
  Doc,
  DocAdr,
  DocGuideline,
  DocPrd,
  DocPlanning,
  DocTask,
  Catalogs,
  DocsIndex,
} from '@/lib/types'
import { DocMetadataHeader } from './DocMetadataHeader'
import { DocSectionRenderer } from './DocSectionRenderer'
import { DocTableView } from './DocTableView'
import { DocReferences } from './DocReferences'
import { DocChangelog } from './DocChangelog'
import { AdrContextDecision, AdrAnalysis, AdrImplementation } from './DocAdrDetail'
import {
  GuidelineOverview,
  GuidelineRules,
  GuidelineChecklist,
  GuidelineAntiPatterns,
} from './DocGuidelineDetail'
import { PrdOverview, PrdRequirements, PrdTechnical, PrdMetrics } from './DocPrdDetail'
import { PlanningOverview, PlanningRisks, PlanningTechnical } from './DocPlanningDetail'
import { TaskOverview, TaskFixes, TaskTechnical } from './DocTaskDetail'
import { DocTabs, type TabItem } from './DocTabs'

// Lazy load heavy diagram components - only loaded when user opens the relevant tab
const LazyMermaidDiagram = React.lazy(() =>
  import('./MermaidDiagram').then((m) => ({ default: m.MermaidDiagram }))
)

const LazyDiagramRenderer = React.lazy(() =>
  import('./diagrams/diagram-renderer').then((m) => ({ default: m.DiagramRenderer }))
)

const LazyDependencyGraph = React.lazy(() =>
  import('./diagrams/dependency-graph').then((m) => ({ default: m.DependencyGraph }))
)

function DiagramFallback() {
  return (
    <div className="h-48 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
  )
}

// --- Type guards ---

function isAdr(doc: Doc): doc is DocAdr {
  return doc.type === 'adr' && 'adr' in doc
}

function isGuideline(doc: Doc): doc is DocGuideline {
  return doc.type === 'guideline' && 'guideline' in doc
}

function isPrd(doc: Doc): doc is DocPrd {
  return doc.type === 'prd' && 'prd' in doc
}

function isPlanning(doc: Doc): doc is DocPlanning {
  return doc.type === 'planning' && 'planning' in doc
}

function isTask(doc: Doc): doc is DocTask {
  return doc.type === 'task' && ('fixes' in doc || 'context' in doc)
}

// --- Task tab helpers ---

export function getFixesTabLabel(status: string): string {
  return status === 'completed' ? 'Entregas' : 'Etapas'
}

export function shouldShowFixesTab(fixes?: unknown[]): boolean {
  return !!fixes && fixes.length > 0
}

// --- Main component ---

export function DocDetail() {
  const currentDoc = useDocsStore((s) => s.currentDoc)
  const catalogs = useDocsStore((s) => s.catalogs)
  const index = useDocsStore((s) => s.index)
  const loading = useDocsStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500" />
        <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">
          Carregando documento...
        </span>
      </div>
    )
  }

  if (!currentDoc) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Selecione um documento na barra lateral
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
      <div className="flex-1 overflow-y-auto ldv-scrollbar px-6 py-6">
        <div className="max-w-4xl pb-16">
          <DocDetailContent doc={currentDoc} catalogs={catalogs} index={index} />
        </div>
      </div>
    </div>
  )
}

// --- Content with multi-tab interface ---

interface DocDetailContentProps {
  doc: Doc
  catalogs: Catalogs | null
  index: DocsIndex | null
}

function DocDetailContent({ doc, catalogs, index }: DocDetailContentProps) {
  const indexedDocIds = index ? new Set(index.documents.map((d) => d.id)) : new Set<string>()

  const sections = Array.isArray(doc.sections) ? doc.sections : []
  const tables = Array.isArray(doc.tables) ? doc.tables : []
  const diagrams = Array.isArray(doc.diagrams) ? doc.diagrams : []
  const references = Array.isArray(doc.references) ? doc.references : []
  const changelog = Array.isArray(doc.changelog) ? doc.changelog : []

  const hasSections = sections.length > 0
  const hasTables = tables.length > 0
  const hasDiagrams = diagrams.length > 0
  const hasReferences = references.length > 0
  const hasChangelog = changelog.length > 0

  const adr = isAdr(doc) ? doc.adr : undefined
  const guideline = isGuideline(doc) ? doc.guideline : undefined
  const prd = isPrd(doc) ? doc.prd : undefined
  const planning = isPlanning(doc) ? doc.planning : undefined
  const task = isTask(doc) ? doc : undefined

  // PRD-specific checks
  const prdHasRequirements =
    prd &&
    ((prd.functionalRequirements?.length ?? 0) > 0 ||
      (prd.nonFunctionalRequirements?.length ?? 0) > 0 ||
      (prd.businessRules?.length ?? 0) > 0 ||
      (prd.useCases?.length ?? 0) > 0)
  const prdHasTechnical =
    prd &&
    ((prd.apiSpecification?.length ?? 0) > 0 ||
      !!prd.dataModel ||
      (prd.involvedFiles?.length ?? 0) > 0 ||
      (prd.permissions?.length ?? 0) > 0)

  // --- Build tabs dynamically based on document content ---

  const allTabs: (TabItem | null)[] = [
    // Tab: Resumo (always present)
    {
      id: 'resumo',
      label: 'Resumo',
      icon: <FileText className="h-4 w-4" />,
      content: () => (
        <div className="space-y-8">
          <DocMetadataHeader
            metadata={doc.metadata}
            docId={doc.id}
            docType={doc.type}
            catalogs={catalogs}
          />
          {adr && <AdrContextDecision adr={adr} />}
          {guideline && <GuidelineOverview guideline={guideline} />}
          {prd && <PrdOverview prd={prd} />}
          {prd?.metrics && prd.metrics.length > 0 && <PrdMetrics prd={prd} />}
          {planning && <PlanningOverview planning={planning} />}
          {task && <TaskOverview task={task} />}
          {hasSections && (
            <div className="space-y-8">
              {sections.map((section, i) => (
                <DocSectionRenderer
                  key={section.id || `${doc.id}-section-${i}`}
                  section={section}
                />
              ))}
            </div>
          )}
        </div>
      ),
    },

    // Tab: Analise (ADR consequences/alternatives + Guideline rules)
    adr || (guideline?.rules && guideline.rules.length > 0)
      ? {
          id: 'analise',
          label: 'Analise',
          icon: <Scale className="h-4 w-4" />,
          content: () => (
            <div className="space-y-8">
              {adr && <AdrAnalysis adr={adr} />}
              {guideline && <GuidelineRules rules={guideline.rules} />}
            </div>
          ),
        }
      : null,

    // Tab: Riscos (Planning)
    planning?.risks && planning.risks.length > 0
      ? {
          id: 'riscos',
          label: 'Riscos',
          icon: <ShieldAlert className="h-4 w-4" />,
          badge: String(planning.risks.length),
          content: () => <PlanningRisks risks={planning.risks} />,
        }
      : null,

    // Tab: Tecnico (Planning - files + verify)
    planning &&
    ((planning.files?.length ?? 0) > 0 || (planning.verify?.length ?? 0) > 0)
      ? {
          id: 'tecnico-planning',
          label: 'Tecnico',
          icon: <Code2 className="h-4 w-4" />,
          content: () => <PlanningTechnical planning={planning} />,
        }
      : null,

    // Tab: Fixes (Task - detailed fix cards)
    task?.fixes && task.fixes.length > 0
      ? {
          id: 'fixes',
          label: getFixesTabLabel(task.metadata.status),
          icon: <Wrench className="h-4 w-4" />,
          badge: String(task.fixes.length),
          content: () => <TaskFixes fixes={task.fixes!} />,
        }
      : null,

    // Tab: Tecnico (Task - files, verify, regression tests)
    task &&
    ((task.allFilesModified?.length ?? 0) > 0 ||
      (task.verify?.length ?? 0) > 0 ||
      !!task.regressionTests)
      ? {
          id: 'tecnico-task',
          label: 'Tecnico',
          icon: <Code2 className="h-4 w-4" />,
          content: () => <TaskTechnical task={task} />,
        }
      : null,

    // Tab: Requisitos (PRD - functional, non-functional, business rules, use cases)
    prdHasRequirements
      ? {
          id: 'requisitos',
          label: 'Requisitos',
          icon: <ClipboardList className="h-4 w-4" />,
          content: () => <PrdRequirements prd={prd} />,
        }
      : null,

    // Tab: Tecnico (PRD - API spec, data model, files, permissions)
    prdHasTechnical
      ? {
          id: 'tecnico',
          label: 'Tecnico',
          icon: <Code2 className="h-4 w-4" />,
          content: () => <PrdTechnical prd={prd} />,
        }
      : null,

    // Tab: Implementacao (ADR phases/criteria/agent rules + Guideline checklist/antiPatterns)
    adr?.phases?.length ||
    adr?.successCriteria?.length ||
    adr?.agentRules?.length ||
    guideline?.checklist?.length ||
    guideline?.antiPatterns?.length
      ? {
          id: 'implementacao',
          label: 'Implementacao',
          icon: <Wrench className="h-4 w-4" />,
          content: () => (
            <div className="space-y-8">
              {adr && <AdrImplementation adr={adr} />}
              {guideline && (
                <>
                  <GuidelineChecklist checklist={guideline.checklist} />
                  <GuidelineAntiPatterns antiPatterns={guideline.antiPatterns} />
                </>
              )}
            </div>
          ),
        }
      : null,

    // Tab: Dados (Tables + Diagrams)
    hasTables || hasDiagrams
      ? {
          id: 'dados',
          label: 'Dados',
          icon: <BarChart3 className="h-4 w-4" />,
          badge: String(tables.length + diagrams.length),
          content: () => (
            <div className="space-y-6">
              {hasTables && <DocTableView tables={tables} />}
              {diagrams.map((diagram, diagramIndex) => (
                <Suspense
                  key={diagram.id || `${doc.id}-diagram-${diagramIndex}`}
                  fallback={<DiagramFallback />}
                >
                  {diagram.nodes?.length ? (
                    <LazyDiagramRenderer diagram={diagram} index={index ?? undefined} currentDocId={doc.id} />
                  ) : diagram.mermaid ? (
                    <LazyMermaidDiagram diagram={diagram} />
                  ) : null}
                </Suspense>
              ))}
            </div>
          ),
        }
      : null,

    // Tab: Conexoes (References + Changelog)
    {
      id: 'conexoes',
      label: 'Conexoes',
      icon: <GitBranch className="h-4 w-4" />,
      badge: hasReferences ? String(references.length) : undefined,
      content: () => (
        <div className="space-y-8">
          {hasReferences && <DocReferences references={references} indexedDocIds={indexedDocIds} />}
          {index && (
            <Suspense fallback={<div>Carregando grafo...</div>}>
              <LazyDependencyGraph index={index} currentDocId={doc.id} />
            </Suspense>
          )}
          {hasChangelog && <DocChangelog changelog={changelog} />}
        </div>
      ),
    },
  ]

  const tabs = allTabs.filter((t): t is TabItem => t !== null)

  return <DocTabs tabs={tabs} defaultTab="resumo" />
}

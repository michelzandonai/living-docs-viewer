import { useState, useMemo } from 'react'
import { cn } from '@/lib/cn'
import { useDocsStore } from '@/hooks/use-docs-store'
import type { DocAdr, DocPrd, DocGuideline, DocTask } from '@/lib/types'
import { DocMetadataHeader } from './DocMetadataHeader'
import { DocSectionRenderer } from './DocSectionRenderer'
import { DocReferences } from './DocReferences'
import { DocTableView } from './DocTableView'
import { DocChangelog } from './DocChangelog'
import { DocAdrDetail } from './DocAdrDetail'
import { DocPrdDetail } from './DocPrdDetail'
import { DocGuidelineDetail } from './DocGuidelineDetail'
import { DocTaskDetail } from './DocTaskDetail'
import { MermaidDiagram } from './MermaidDiagram'

type TabId = 'content' | 'details' | 'tables' | 'diagrams' | 'changelog'

interface TabDef {
  id: TabId
  label: string
}

export function DocDetail() {
  const currentDoc = useDocsStore((s) => s.currentDoc)
  const catalogs = useDocsStore((s) => s.catalogs)
  const loading = useDocsStore((s) => s.loading)
  const [activeTab, setActiveTab] = useState<TabId>('content')

  const availableTabs = useMemo<TabDef[]>(() => {
    if (!currentDoc) return []

    const tabs: TabDef[] = [{ id: 'content', label: 'Conteudo' }]

    const hasDetails =
      (currentDoc.type === 'adr' && (currentDoc as DocAdr).adr) ||
      (currentDoc.type === 'prd' && (currentDoc as DocPrd).prd) ||
      (currentDoc.type === 'guideline' && (currentDoc as DocGuideline).guideline) ||
      (currentDoc.type === 'task' && ((currentDoc as DocTask).context || (currentDoc as DocTask).fixes))

    if (hasDetails) {
      tabs.push({ id: 'details', label: 'Detalhes' })
    }

    if (currentDoc.tables && currentDoc.tables.length > 0) {
      tabs.push({ id: 'tables', label: 'Tabelas' })
    }

    if (currentDoc.diagrams && currentDoc.diagrams.length > 0) {
      tabs.push({ id: 'diagrams', label: 'Diagramas' })
    }

    if (currentDoc.changelog && currentDoc.changelog.length > 0) {
      tabs.push({ id: 'changelog', label: 'Changelog' })
    }

    return tabs
  }, [currentDoc])

  const safeActiveTab = useMemo(() => {
    if (availableTabs.find((t) => t.id === activeTab)) return activeTab
    return availableTabs[0]?.id ?? 'content'
  }, [activeTab, availableTabs])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--ldv-accent)', borderTopColor: 'transparent' }}
        />
        <span className="ml-2 text-sm" style={{ color: 'var(--ldv-text-secondary)' }}>
          Carregando documento...
        </span>
      </div>
    )
  }

  if (!currentDoc) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm" style={{ color: 'var(--ldv-text-secondary)' }}>
          Selecione um documento na barra lateral
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--ldv-bg)' }}>
      <div className="px-6 pt-6 shrink-0">
        <DocMetadataHeader doc={currentDoc} catalogs={catalogs} />
      </div>

      {availableTabs.length > 1 && (
        <div
          className="px-6 mt-4 shrink-0 flex gap-1 border-b"
          style={{ borderColor: 'var(--ldv-border)' }}
        >
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                safeActiveTab === tab.id
                  ? 'border-current'
                  : 'border-transparent'
              )}
              style={{
                color:
                  safeActiveTab === tab.id
                    ? 'var(--ldv-accent)'
                    : 'var(--ldv-text-secondary)',
              }}
              onMouseEnter={(e) => {
                if (safeActiveTab !== tab.id) {
                  e.currentTarget.style.color = 'var(--ldv-text)'
                }
              }}
              onMouseLeave={(e) => {
                if (safeActiveTab !== tab.id) {
                  e.currentTarget.style.color = 'var(--ldv-text-secondary)'
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto ldv-scrollbar px-6 py-6">
        {safeActiveTab === 'content' && (
          <div>
            <DocSectionRenderer sections={currentDoc.sections} />
            {currentDoc.references && currentDoc.references.length > 0 && (
              <DocReferences references={currentDoc.references} />
            )}
          </div>
        )}

        {safeActiveTab === 'details' && (
          <div>
            {currentDoc.type === 'adr' && <DocAdrDetail doc={currentDoc as DocAdr} />}
            {currentDoc.type === 'prd' && <DocPrdDetail doc={currentDoc as DocPrd} />}
            {currentDoc.type === 'guideline' && <DocGuidelineDetail doc={currentDoc as DocGuideline} />}
            {currentDoc.type === 'task' && <DocTaskDetail doc={currentDoc as DocTask} />}
          </div>
        )}

        {safeActiveTab === 'tables' && currentDoc.tables && (
          <DocTableView tables={currentDoc.tables} />
        )}

        {safeActiveTab === 'diagrams' && currentDoc.diagrams && (
          <div className="space-y-6">
            {currentDoc.diagrams.map((diagram) => (
              <MermaidDiagram key={diagram.id} diagram={diagram} />
            ))}
          </div>
        )}

        {safeActiveTab === 'changelog' && currentDoc.changelog && (
          <DocChangelog changelog={currentDoc.changelog} />
        )}
      </div>
    </div>
  )
}

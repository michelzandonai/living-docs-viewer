import * as vscode from 'vscode'

// Re-declare minimal types to avoid importing React-dependent code in extension host
interface DocsIndexEntry {
  id: string
  type: string
  title: string
  status: string
  scope: string
  dateCreated: string
  dateModified?: string
  tagIds: string[]
  summary: string
  path: string
}

interface DocsIndexGraphNode {
  id: string
  type: string
  scope: string
  status: string
}

interface DocsIndexGraphEdge {
  source: string
  target: string
  type: string
}

interface DocsIndex {
  $docSchema: 'energimap-doc/v1'
  generatedAt: string
  stats: {
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
  }
  documents: DocsIndexEntry[]
  graph?: {
    nodes: DocsIndexGraphNode[]
    edges: DocsIndexGraphEdge[]
  }
}

interface Catalogs {
  authors: Record<string, { name: string; role: string }>
  tags: Record<string, { label: string; category: string }>
  glossary: Record<string, { definition: string; aliases: string[] }>
}

const decoder = new TextDecoder()

export async function scanWorkspaceForDocs(docsFolder: vscode.Uri): Promise<DocsIndex> {
  const pattern = new vscode.RelativePattern(docsFolder, '**/*.json')
  const excludePattern = '{**/node_modules/**,**/.git/**,**/_catalogs/**,**/dist/**,**/build/**}'

  const files = await vscode.workspace.findFiles(pattern, excludePattern)

  const documents: DocsIndexEntry[] = []
  const graphNodes: DocsIndexGraphNode[] = []
  const graphEdges: DocsIndexGraphEdge[] = []
  const byType: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  for (const fileUri of files) {
    try {
      const content = await vscode.workspace.fs.readFile(fileUri)
      const text = decoder.decode(content)
      const doc = JSON.parse(text)

      const isEnergiMap = doc.$docSchema === 'energimap-doc/v1' || (doc.metadata && doc.sections)
      if (!isEnergiMap) continue

      // Derive type from path if not present
      const relToDocsFolder = fileUri.fsPath.slice(docsFolder.fsPath.length + 1)
      const topFolder = relToDocsFolder.split('/')[0]?.replace(/s$/, '') // adr/, prd/, guidelines/ -> adr, prd, guideline
      const docType = doc.type || topFolder || 'unknown'

      if (!doc.id || !doc.metadata) continue

      const relativePath = vscode.workspace.asRelativePath(fileUri, false)
      // Calculate path relative to docs folder
      const docsFolderPath = docsFolder.fsPath
      const filePath = fileUri.fsPath
      const relPath = filePath.startsWith(docsFolderPath)
        ? filePath.slice(docsFolderPath.length + 1)
        : relativePath

      const entry: DocsIndexEntry = {
        id: doc.id,
        type: docType,
        title: doc.metadata.title || doc.id,
        status: doc.metadata.status || 'draft',
        scope: doc.metadata.scope || 'shared',
        dateCreated: doc.metadata.dateCreated || '',
        dateModified: doc.metadata.dateModified,
        tagIds: doc.metadata.tagIds || [],
        summary: doc.metadata.summary || '',
        path: relPath,
      }

      documents.push(entry)

      // Track stats
      byType[entry.type] = (byType[entry.type] || 0) + 1
      byStatus[entry.status] = (byStatus[entry.status] || 0) + 1

      // Build graph
      graphNodes.push({
        id: doc.id,
        type: docType,
        scope: entry.scope,
        status: entry.status,
      })

      // Extract references for edges
      if (Array.isArray(doc.references)) {
        for (const ref of doc.references) {
          if (ref.targetId && ref.type) {
            graphEdges.push({
              source: doc.id,
              target: ref.targetId,
              type: ref.type,
            })
          }
        }
      }
    } catch {
      // Skip invalid files
    }
  }

  // Sort by dateModified descending (most recent first)
  documents.sort((a, b) => {
    const aTime = a.dateModified || a.dateCreated || ''
    const bTime = b.dateModified || b.dateCreated || ''
    return bTime.localeCompare(aTime)
  })

  return {
    $docSchema: 'energimap-doc/v1',
    generatedAt: new Date().toISOString(),
    stats: {
      total: documents.length,
      byType,
      byStatus,
    },
    documents,
    graph: {
      nodes: graphNodes,
      edges: graphEdges,
    },
  }
}

export async function loadCatalogs(docsFolder: vscode.Uri): Promise<Catalogs> {
  const catalogsDir = vscode.Uri.joinPath(docsFolder, '_catalogs')

  const loadJson = async (filename: string): Promise<Record<string, unknown>> => {
    try {
      const uri = vscode.Uri.joinPath(catalogsDir, filename)
      const content = await vscode.workspace.fs.readFile(uri)
      return JSON.parse(decoder.decode(content))
    } catch {
      return {}
    }
  }

  const [authors, tags, glossary] = await Promise.all([
    loadJson('authors.json'),
    loadJson('tags.json'),
    loadJson('glossary.json'),
  ])

  return {
    authors: authors as Catalogs['authors'],
    tags: tags as Catalogs['tags'],
    glossary: glossary as Catalogs['glossary'],
  }
}

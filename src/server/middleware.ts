import { Router, static as expressStatic } from 'express'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, join, dirname, relative, extname } from 'path'
import { fileURLToPath } from 'url'
import type { DocsIndex, DocsIndexEntry } from '../lib/types'

function getCurrentDirname(): string {
  try {
    if (typeof import.meta?.url === 'string') {
      return dirname(fileURLToPath(import.meta.url))
    }
  } catch {
    // fallback to __dirname for CJS
  }
  return __dirname
}

const currentDir = getCurrentDirname()

/** Resolve the path to bundled docs shipped with the library */
export function getBundledDocsPath(): string | null {
  const bundledPath = resolve(currentDir, '../docs')
  try {
    if (existsSync(bundledPath) && statSync(bundledPath).isDirectory()) {
      return bundledPath
    }
  } catch {
    // not available
  }
  return null
}

export interface LivingDocsOptions {
  docsPath: string
  title?: string
  theme?: 'light' | 'dark'
  basePath?: string
  includeBundledDocs?: boolean
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const SKIP_DIRS = new Set(['_catalogs', '_schema', '_skill', '_deprecated', 'archived', 'node_modules', '.git'])
const SKIP_FILES = new Set(['docs-index.json'])

/** Derive doc type from filesystem path */
function deriveType(relPath: string): string | null {
  const first = relPath.split('/')[0]
  const map: Record<string, string> = {
    adr: 'adr',
    prd: 'prd',
    planning: 'planning',
    tasks: 'task',
    guidelines: 'guideline',
  }
  return map[first] ?? null
}

/** Recursively collect JSON doc files */
function walkJsonFiles(dir: string, root: string): string[] {
  const results: string[] = []
  let entries: { name: string; isDirectory: () => boolean; isFile: () => boolean }[]
  try {
    entries = readdirSync(dir, { withFileTypes: true }) as unknown as typeof entries
  } catch {
    return results
  }
  for (const entry of entries) {
    const name = String(entry.name)
    if (name.startsWith('.') || SKIP_DIRS.has(name)) continue
    const fullPath = join(dir, name)
    if (entry.isDirectory()) {
      results.push(...walkJsonFiles(fullPath, root))
    } else if (entry.isFile() && extname(name) === '.json' && !SKIP_FILES.has(name)) {
      results.push(fullPath)
    }
  }
  return results
}

/** Build DocsIndex by scanning the docs directory, optionally merging bundled docs */
function buildIndex(docsPath: string, extraDocsPaths: string[] = []): DocsIndex {
  const files = walkJsonFiles(docsPath, docsPath)
  const documents: DocsIndexEntry[] = []
  const graphNodes: { id: string; type: string; scope: string; status: string }[] = []
  const graphEdges: { source: string; target: string; type: string }[] = []
  const byType: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  const seenIds = new Set<string>()

  function processFile(filePath: string, basePath: string): void {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const doc = JSON.parse(raw)
      if (!doc.id || !doc.metadata) return
      if (seenIds.has(doc.id)) return // local override: skip if already seen

      seenIds.add(doc.id)
      const relPath = relative(basePath, filePath)
      const type = doc.type || deriveType(relPath) || 'unknown'

      documents.push({
        id: doc.id,
        type,
        title: doc.metadata.title || doc.id,
        status: doc.metadata.status || 'unknown',
        scope: doc.metadata.scope || 'shared',
        dateCreated: doc.metadata.dateCreated || '',
        dateModified: doc.metadata.dateModified,
        tagIds: doc.metadata.tagIds || [],
        summary: doc.metadata.summary || '',
        path: relPath,
      })

      byType[type] = (byType[type] || 0) + 1
      byStatus[doc.metadata.status || 'unknown'] = (byStatus[doc.metadata.status || 'unknown'] || 0) + 1

      graphNodes.push({
        id: doc.id,
        type,
        scope: doc.metadata.scope || 'shared',
        status: doc.metadata.status || 'unknown',
      })

      if (Array.isArray(doc.references)) {
        for (const ref of doc.references) {
          if (ref.targetId) {
            graphEdges.push({ source: doc.id, target: ref.targetId, type: ref.type || 'related' })
          }
        }
      }
    } catch {
      const fileName = filePath.split('/').pop() || filePath
      console.warn(`[living-docs] Skipping ${fileName}: invalid JSON or unreadable`)
    }
  }

  // Process project docs first (they take priority)
  for (const filePath of files) {
    processFile(filePath, docsPath)
  }

  // Then process extra paths (bundled docs) — skipped if id already seen
  for (const extraPath of extraDocsPaths) {
    const extraFiles = walkJsonFiles(extraPath, extraPath)
    for (const filePath of extraFiles) {
      processFile(filePath, extraPath)
    }
  }

  documents.sort((a, b) => a.id.localeCompare(b.id))

  const now = new Date()
  const generatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  return {
    $docSchema: 'energimap-doc/v1',
    generatedAt,
    stats: { total: documents.length, byType, byStatus },
    documents,
    graph: { nodes: graphNodes, edges: graphEdges },
  }
}

/**
 * Generate docs-index.json by scanning the docs directory.
 * Writes the index to disk and returns the number of documents indexed.
 * When extraDocsPaths is provided, bundled docs are merged (local override wins).
 */
export async function generateDocsIndex(docsPath: string, extraDocsPaths: string[] = []): Promise<number> {
  const index = buildIndex(docsPath, extraDocsPaths)
  const indexPath = join(docsPath, 'docs-index.json')
  writeFileSync(indexPath, JSON.stringify(index, null, 2))
  return index.documents.length
}

export function createLivingDocsMiddleware(options: LivingDocsOptions): Router {
  const router = Router()
  const appDir = resolve(currentDir, '../app')
  const includeBundled = options.includeBundledDocs !== false
  const bundledDocsPath = includeBundled ? getBundledDocsPath() : null
  const extraPaths = bundledDocsPath ? [bundledDocsPath] : []

  // Dynamic index — scans docs directory on each request, merging bundled docs
  router.get('/api/docs-index.json', (_req, res) => {
    try {
      const index = buildIndex(options.docsPath, extraPaths)
      res.json(index)
    } catch (e) {
      res.status(500).json({ error: 'Falha ao gerar indice', detail: String(e) })
    }
  })

  // Enrich documents with derived fields (GUIDELINE-001: $docSchema, type, sections are derivable)
  const DOC_DIRS = /^\/(adr|prd|planning|tasks|guidelines)\//
  router.get('/api/*', (req, res, next) => {
    const subPath = req.path.replace('/api', '')
    if (!subPath.endsWith('.json') || !DOC_DIRS.test(subPath)) return next()

    // Try project docs first, then fallback to bundled docs
    let filePath = join(options.docsPath, subPath)
    if (!existsSync(filePath) && bundledDocsPath) {
      const bundledFile = join(bundledDocsPath, subPath)
      if (existsSync(bundledFile)) {
        filePath = bundledFile
      }
    }

    try {
      const raw = readFileSync(filePath, 'utf-8')
      const doc = JSON.parse(raw)
      if (doc.id && doc.metadata) {
        if (!doc.$docSchema) doc.$docSchema = 'energimap-doc/v1'
        if (!doc.type) doc.type = deriveType(subPath.slice(1))
        if (!Array.isArray(doc.sections)) doc.sections = []
      }
      res.json(doc)
    } catch {
      next()
    }
  })

  // Static files from docs directory (catalogs, non-doc files, etc.)
  router.use('/api', expressStatic(options.docsPath, { index: false }))

  // Static assets for the viewer app
  router.use(expressStatic(appDir, { index: false }))

  const htmlTemplate = readFileSync(join(appDir, 'index.html'), 'utf-8')

  // SPA fallback
  router.get('*', (_req, res) => {
    const config = {
      apiUrl: `${options.basePath || ''}/api`,
      theme: options.theme || 'light',
    }

    const html = htmlTemplate
      .replace('<!-- TITLE_PLACEHOLDER -->', escapeHtml(options.title || 'Documentacao'))
      .replace(
        '<!-- CONFIG_PLACEHOLDER -->',
        `<script>window.__LIVING_DOCS_CONFIG__ = ${JSON.stringify(config)}</script>`
      )

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })

  return router
}

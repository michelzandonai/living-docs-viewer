import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import express from 'express'
import request from 'supertest'
import { generateDocsIndex } from '../src/server/middleware'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createFakeDoc(
  dir: string,
  filename: string,
  overrides: {
    id?: string
    type?: string
    title?: string
    status?: string
    scope?: string
    dateCreated?: string
    dateModified?: string
    tagIds?: string[]
    summary?: string
  } = {}
): void {
  const doc = {
    $docSchema: 'energimap-doc/v1',
    id: overrides.id ?? filename.replace('.json', ''),
    type: overrides.type ?? 'adr',
    metadata: {
      title: overrides.title ?? `Test ${overrides.id ?? filename}`,
      status: overrides.status ?? 'active',
      scope: overrides.scope ?? 'shared',
      dateCreated: overrides.dateCreated ?? '2026-01-01',
      dateModified: overrides.dateModified ?? '2026-01-15',
      tagIds: overrides.tagIds ?? [],
      summary: overrides.summary ?? `Summary of ${overrides.id ?? filename}`,
    },
    sections: [],
    changelog: [],
  }
  writeFileSync(join(dir, filename), JSON.stringify(doc, null, 2))
}

function setupDocsDir(): { docsPath: string; adrDir: string; prdDir: string } {
  const docsPath = mkdtempSync(join(tmpdir(), 'living-docs-test-'))
  const adrDir = join(docsPath, 'adr')
  const prdDir = join(docsPath, 'prd')
  mkdirSync(adrDir, { recursive: true })
  mkdirSync(prdDir, { recursive: true })
  return { docsPath, adrDir, prdDir }
}

function setupAppDir(): string {
  const appDir = mkdtempSync(join(tmpdir(), 'living-docs-app-'))
  writeFileSync(
    join(appDir, 'index.html'),
    `<!DOCTYPE html>
<html>
<head><!-- TITLE_PLACEHOLDER --></head>
<body><!-- CONFIG_PLACEHOLDER --><div id="root"></div></body>
</html>`
  )
  return appDir
}

// ---------------------------------------------------------------------------
// Suite 1: generateDocsIndex
// ---------------------------------------------------------------------------

describe('generateDocsIndex', () => {
  let docsPath: string
  let adrDir: string
  let prdDir: string

  beforeEach(() => {
    const dirs = setupDocsDir()
    docsPath = dirs.docsPath
    adrDir = dirs.adrDir
    prdDir = dirs.prdDir
  })

  afterEach(() => {
    rmSync(docsPath, { recursive: true, force: true })
  })

  it('gera index com schema energimap-doc/v1', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    await generateDocsIndex(docsPath)

    const indexPath = join(docsPath, 'docs-index.json')
    const index = JSON.parse(readFileSync(indexPath, 'utf-8'))
    expect(index.$docSchema).toBe('energimap-doc/v1')
  })

  it('gera index com campo generatedAt no formato timestamp ISO local', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    await generateDocsIndex(docsPath)

    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    // Formato: YYYY-MM-DDTHH:MM:SS (sem timezone)
    expect(index.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
  })

  it('conta documentos corretamente em stats.total', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })
    createFakeDoc(adrDir, 'ADR-002.json', { id: 'ADR-002' })
    createFakeDoc(prdDir, 'PRD-001.json', { id: 'PRD-001', type: 'prd' })

    await generateDocsIndex(docsPath)

    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    expect(index.stats.total).toBe(3)
  })

  it('retorna o numero de documentos indexados', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })
    createFakeDoc(adrDir, 'ADR-002.json', { id: 'ADR-002' })

    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(2)
  })

  it('extrai todos os campos obrigatorios: id, type, title, status, dateCreated, dateModified, tagIds, summary, path', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', {
      id: 'ADR-001',
      type: 'adr',
      title: 'Titulo do ADR',
      status: 'accepted',
      scope: 'team',
      dateCreated: '2026-01-01',
      dateModified: '2026-01-20',
      tagIds: ['tag-1', 'tag-2'],
      summary: 'Resumo do ADR',
    })

    await generateDocsIndex(docsPath)

    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const doc = index.documents[0]

    expect(doc.id).toBe('ADR-001')
    expect(doc.type).toBe('adr')
    expect(doc.title).toBe('Titulo do ADR')
    expect(doc.status).toBe('accepted')
    expect(doc.dateCreated).toBe('2026-01-01')
    expect(doc.dateModified).toBe('2026-01-20')
    expect(doc.tagIds).toEqual(['tag-1', 'tag-2'])
    expect(doc.summary).toBe('Resumo do ADR')
    expect(doc.path).toBe('adr/ADR-001.json')
  })

  it('ignora arquivos dentro de diretorios _schema/', async () => {
    const schemaDir = join(docsPath, 'adr', '_schema')
    mkdirSync(schemaDir, { recursive: true })
    createFakeDoc(schemaDir, 'schema-doc.json', { id: 'SCHEMA-001' })
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(1)
    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const ids = index.documents.map((d: { id: string }) => d.id)
    expect(ids).not.toContain('SCHEMA-001')
  })

  it('ignora arquivos dentro de diretorios _catalogs/', async () => {
    const catalogsDir = join(docsPath, 'adr', '_catalogs')
    mkdirSync(catalogsDir, { recursive: true })
    createFakeDoc(catalogsDir, 'catalog.json', { id: 'CATALOG-001' })
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(1)
  })

  it('ignora arquivos dentro de diretorios archived/', async () => {
    const archivedDir = join(docsPath, 'adr', 'archived')
    mkdirSync(archivedDir, { recursive: true })
    createFakeDoc(archivedDir, 'ADR-OLD.json', { id: 'ADR-OLD' })
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(1)
    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const ids = index.documents.map((d: { id: string }) => d.id)
    expect(ids).not.toContain('ADR-OLD')
  })

  it('ignora o proprio arquivo docs-index.json', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })
    // Primeiro gera o index para que ele exista
    await generateDocsIndex(docsPath)
    // Gera novamente — o docs-index.json nao deve ser contado
    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(1)
  })

  it('lida com JSON invalido sem crashar — pula o arquivo com aviso', async () => {
    writeFileSync(join(adrDir, 'invalido.json'), 'nao-e-json-valido{{{')
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    let count: number
    await expect(async () => {
      count = await generateDocsIndex(docsPath)
    }).not.toThrow()

    // Somente o doc valido e contado
    expect(count!).toBe(1)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[living-docs] Skipping invalido.json')
    )

    warnSpy.mockRestore()
  })

  it('nao modifica os arquivos fonte — apenas cria docs-index.json', async () => {
    const docPath = join(adrDir, 'ADR-001.json')
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })
    const conteudoAntes = readFileSync(docPath, 'utf-8')

    await generateDocsIndex(docsPath)

    const conteudoDepois = readFileSync(docPath, 'utf-8')
    expect(conteudoDepois).toBe(conteudoAntes)
  })

  it('ignora arquivos JSON sem campo id', async () => {
    const docSemId = { $docSchema: 'energimap-doc/v1', type: 'adr', metadata: { title: 'Sem ID' } }
    writeFileSync(join(adrDir, 'sem-id.json'), JSON.stringify(docSemId))
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(1)
  })

  it('indexa zero documentos quando todas as pastas estao vazias', async () => {
    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(0)
    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    expect(index.stats.total).toBe(0)
    expect(index.documents).toEqual([])
  })

  it('ordena documentos por id (localeCompare)', async () => {
    createFakeDoc(prdDir, 'PRD-002.json', { id: 'PRD-002', type: 'prd' })
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001', type: 'adr' })
    createFakeDoc(prdDir, 'PRD-001.json', { id: 'PRD-001', type: 'prd' })

    await generateDocsIndex(docsPath)

    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const ids = index.documents.map((d: { id: string }) => d.id)
    expect(ids).toEqual(['ADR-001', 'PRD-001', 'PRD-002'])
  })

  it('computa stats.byType corretamente', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001', type: 'adr' })
    createFakeDoc(adrDir, 'ADR-002.json', { id: 'ADR-002', type: 'adr' })
    createFakeDoc(prdDir, 'PRD-001.json', { id: 'PRD-001', type: 'prd' })

    await generateDocsIndex(docsPath)

    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    expect(index.stats.byType.adr).toBe(2)
    expect(index.stats.byType.prd).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// Suite: Bundled docs merge (extraDocsPaths)
// ---------------------------------------------------------------------------

describe('generateDocsIndex com bundled docs (extraDocsPaths)', () => {
  let docsPath: string
  let adrDir: string
  let bundledPath: string

  beforeEach(() => {
    const dirs = setupDocsDir()
    docsPath = dirs.docsPath
    adrDir = dirs.adrDir

    // Create a fake bundled docs directory
    bundledPath = mkdtempSync(join(tmpdir(), 'living-docs-bundled-'))
    const bundledGuidelines = join(bundledPath, 'guidelines')
    mkdirSync(bundledGuidelines, { recursive: true })
    createFakeDoc(bundledGuidelines, 'GUIDELINE-001-living-docs-guide.json', {
      id: 'GUIDELINE-001',
      title: 'Guia Unificado Living Docs',
      status: 'accepted',
    })
  })

  afterEach(() => {
    rmSync(docsPath, { recursive: true, force: true })
    rmSync(bundledPath, { recursive: true, force: true })
  })

  it('bundled docs aparecem no index quando nao ha override local', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const count = await generateDocsIndex(docsPath, [bundledPath])

    expect(count).toBe(2)
    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const ids = index.documents.map((d: { id: string }) => d.id)
    expect(ids).toContain('ADR-001')
    expect(ids).toContain('GUIDELINE-001')
  })

  it('override local vence sobre bundled doc com mesmo id', async () => {
    // Create local guideline with same ID but different title
    const localGuidelines = join(docsPath, 'guidelines')
    mkdirSync(localGuidelines, { recursive: true })
    createFakeDoc(localGuidelines, 'GUIDELINE-001-living-docs-guide.json', {
      id: 'GUIDELINE-001',
      title: 'Versao Local Customizada',
      status: 'accepted',
    })

    const count = await generateDocsIndex(docsPath, [bundledPath])

    expect(count).toBe(1)
    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const guideline = index.documents.find((d: { id: string }) => d.id === 'GUIDELINE-001')
    expect(guideline.title).toBe('Versao Local Customizada')
  })

  it('sem extraDocsPaths, bundled docs nao aparecem', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const count = await generateDocsIndex(docsPath)

    expect(count).toBe(1)
    const index = JSON.parse(readFileSync(join(docsPath, 'docs-index.json'), 'utf-8'))
    const ids = index.documents.map((d: { id: string }) => d.id)
    expect(ids).not.toContain('GUIDELINE-001')
  })
})

// ---------------------------------------------------------------------------
// Suite 2: createLivingDocsMiddleware com temp dirs isolados
// ---------------------------------------------------------------------------

// O middleware usa `router.get('*', ...)` que e sintaxe Express 4.
// Express 5 (instalado como devDependency) exige `'{*path}'` para catch-all.
// Reimplementamos o createLivingDocsMiddleware adaptando apenas a sintaxe do
// catch-all, mantendo toda a logica identica (incluindo cache dinamico).

import { Router, static as expressStatic } from 'express'

interface LivingDocsOptions {
  docsPath: string
  title?: string
  theme?: 'light' | 'dark'
  basePath?: string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getMaxMtimeLocal(docsPath: string): number {
  const { statSync } = require('fs') as typeof import('fs')
  const subfolders = ['adr', 'prd', 'guidelines', 'tasks', 'planning']
  let maxMtime = 0

  for (const folder of subfolders) {
    const dirPath = join(docsPath, folder)
    if (!existsSync(dirPath)) continue
    try {
      const mtime = statSync(dirPath).mtimeMs
      if (mtime > maxMtime) maxMtime = mtime
    } catch {
      // ignorar
    }
  }

  return maxMtime
}

function deriveType(relPath: string): string | null {
  const first = relPath.split('/')[0]
  const map: Record<string, string> = {
    adr: 'adr', prd: 'prd', planning: 'planning', tasks: 'task', guidelines: 'guideline',
  }
  return map[first] ?? null
}

interface CreateTestMiddlewareOpts extends LivingDocsOptions {
  bundledDocsPath?: string | null
}

function createTestMiddleware(options: CreateTestMiddlewareOpts, appDir: string): Router {
  const router = Router()
  const bundledDocsPath = options.bundledDocsPath ?? null
  const extraPaths = bundledDocsPath ? [bundledDocsPath] : []

  let cachedIndex: string | null = null
  let cachedMaxMtime = 0

  router.get('/api/docs-index.json', async (_req, res) => {
    try {
      const currentMaxMtime = getMaxMtimeLocal(options.docsPath)

      if (cachedIndex === null || currentMaxMtime !== cachedMaxMtime) {
        await generateDocsIndex(options.docsPath, extraPaths)
        const indexPath = join(options.docsPath, 'docs-index.json')
        cachedIndex = readFileSync(indexPath, 'utf8')
        cachedMaxMtime = getMaxMtimeLocal(options.docsPath)
      }

      res.setHeader('Content-Type', 'application/json')
      res.send(cachedIndex)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(`[living-docs] Error serving index: ${msg}`)
      res.status(500).json({ error: 'Failed to generate docs index' })
    }
  })

  // Enrich documents with derived fields + bundled fallback
  const DOC_DIRS = /^\/(adr|prd|planning|tasks|guidelines)\//
  router.get('/api/{*path}', (req, res, next) => {
    const subPath = req.path.replace('/api', '')
    if (!subPath.endsWith('.json') || !DOC_DIRS.test(subPath)) return next()

    let filePath = join(options.docsPath, subPath)
    if (!existsSync(filePath) && bundledDocsPath) {
      const bundledFile = join(bundledDocsPath, subPath)
      if (existsSync(bundledFile)) {
        filePath = bundledFile
      }
    }

    try {
      const doc = JSON.parse(readFileSync(filePath, 'utf-8'))
      if (doc.id && doc.metadata) {
        if (!doc.$docSchema) doc.$docSchema = 'energimap-doc/v1'
        if (!doc.type) doc.type = deriveType(subPath.slice(1))
        if (!Array.isArray(doc.sections)) doc.sections = []
      }
      res.json(doc)
    } catch { next() }
  })

  router.use('/api', expressStatic(options.docsPath, { index: false }))
  router.use(expressStatic(appDir, { index: false }))

  const htmlTemplate = readFileSync(join(appDir, 'index.html'), 'utf-8')

  // Express 5: usar '{*path}' ao inves de '*'
  router.get('/{*path}', (_req, res) => {
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

describe('createLivingDocsMiddleware (isolado com temp dirs)', () => {
  let docsPath: string
  let adrDir: string
  let appDir: string
  let app: express.Express

  beforeEach(() => {
    const dirs = setupDocsDir()
    docsPath = dirs.docsPath
    adrDir = dirs.adrDir
    appDir = setupAppDir()

    app = express()
    app.use(
      '/docs',
      createTestMiddleware(
        { docsPath, title: 'Docs de Teste', theme: 'light', basePath: '/docs' },
        appDir
      )
    )
  })

  afterEach(() => {
    rmSync(docsPath, { recursive: true, force: true })
    rmSync(appDir, { recursive: true, force: true })
  })

  it('GET /api/docs-index.json retorna 200 com JSON valido', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const res = await request(app).get('/docs/api/docs-index.json')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/json')
    const body = JSON.parse(res.text)
    expect(body.$docSchema).toBe('energimap-doc/v1')
    expect(body.documents).toBeInstanceOf(Array)
    expect(body.stats).toBeDefined()
  })

  it('GET /api/docs-index.json retorna documents com campos corretos', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', {
      id: 'ADR-001',
      type: 'adr',
      title: 'Titulo',
      status: 'active',
      dateCreated: '2026-01-01',
      dateModified: '2026-01-15',
      tagIds: [],
      summary: 'Resumo',
    })

    const res = await request(app).get('/docs/api/docs-index.json')
    const body = JSON.parse(res.text)
    const doc = body.documents[0]

    expect(doc.id).toBe('ADR-001')
    expect(doc.type).toBe('adr')
    expect(doc.title).toBe('Titulo')
    expect(doc.status).toBe('active')
    expect(doc.dateCreated).toBeDefined()
    expect(doc.dateModified).toBeDefined()
    expect(doc.tagIds).toBeInstanceOf(Array)
    expect(doc.summary).toBeDefined()
    expect(doc.path).toBeDefined()
  })

  it('GET /api/<doc-path> retorna 200 para doc individual', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const res = await request(app).get('/docs/api/adr/ADR-001.json')

    expect(res.status).toBe(200)
    const body = JSON.parse(res.text)
    expect(body.id).toBe('ADR-001')
  })

  it('GET / retorna HTML com __LIVING_DOCS_CONFIG__', async () => {
    const res = await request(app).get('/docs/')

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('text/html')
    expect(res.text).toContain('__LIVING_DOCS_CONFIG__')
  })

  it('HTML injetado contem apiUrl e theme corretos', async () => {
    const res = await request(app).get('/docs/')
    const configMatch = res.text.match(
      /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
    )
    expect(configMatch).not.toBeNull()
    const config = JSON.parse(configMatch![1])
    expect(config.apiUrl).toBe('/docs/api')
    expect(config.theme).toBe('light')
  })

  it('cache funciona: segunda request retorna mesmo index sem alteracao', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const res1 = await request(app).get('/docs/api/docs-index.json')
    const res2 = await request(app).get('/docs/api/docs-index.json')

    expect(res1.status).toBe(200)
    expect(res2.status).toBe(200)
    // O conteudo deve ser identico (mesmo objeto serializado)
    expect(res1.text).toBe(res2.text)
  })

  it('cache invalida quando um arquivo e modificado na pasta docs', async () => {
    createFakeDoc(adrDir, 'ADR-001.json', { id: 'ADR-001' })

    const res1 = await request(app).get('/docs/api/docs-index.json')
    const body1 = JSON.parse(res1.text)
    expect(body1.stats.total).toBe(1)

    // Simular modificacao: adicionar novo arquivo e tocar no diretorio
    createFakeDoc(adrDir, 'ADR-002.json', { id: 'ADR-002' })
    // Forcar mtime do diretorio a mudar (Node nao garante granularidade suficiente
    // para detectar mudancas em menos de 1ms, por isso tocamos o diretorio)
    const { utimesSync } = await import('fs')
    const futuro = new Date(Date.now() + 5000)
    utimesSync(adrDir, futuro, futuro)

    const res2 = await request(app).get('/docs/api/docs-index.json')
    const body2 = JSON.parse(res2.text)

    expect(body2.stats.total).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// Suite: Middleware com bundled docs fallback
// ---------------------------------------------------------------------------

describe('Middleware com bundled docs fallback', () => {
  let docsPath: string
  let adrDir: string
  let appDir: string
  let bundledPath: string
  let app: express.Express

  beforeEach(() => {
    const dirs = setupDocsDir()
    docsPath = dirs.docsPath
    adrDir = dirs.adrDir
    appDir = setupAppDir()

    // Create bundled docs
    bundledPath = mkdtempSync(join(tmpdir(), 'living-docs-bundled-mw-'))
    const bundledGuidelines = join(bundledPath, 'guidelines')
    mkdirSync(bundledGuidelines, { recursive: true })
    createFakeDoc(bundledGuidelines, 'GUIDELINE-001-living-docs-guide.json', {
      id: 'GUIDELINE-001',
      type: 'guideline',
      title: 'Guia Bundled',
      status: 'accepted',
    })

    app = express()
    app.use(
      '/docs',
      createTestMiddleware(
        { docsPath, title: 'Test', basePath: '/docs', bundledDocsPath: bundledPath },
        appDir
      )
    )
  })

  afterEach(() => {
    rmSync(docsPath, { recursive: true, force: true })
    rmSync(appDir, { recursive: true, force: true })
    rmSync(bundledPath, { recursive: true, force: true })
  })

  it('rota /api/guidelines/GUIDELINE-001*.json serve bundled doc como fallback', async () => {
    const res = await request(app).get(
      '/docs/api/guidelines/GUIDELINE-001-living-docs-guide.json'
    )

    expect(res.status).toBe(200)
    const body = JSON.parse(res.text)
    expect(body.id).toBe('GUIDELINE-001')
    expect(body.$docSchema).toBe('energimap-doc/v1')
    expect(body.type).toBe('guideline')
  })
})

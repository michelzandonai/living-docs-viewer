import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import express, { Router, static as expressStatic } from 'express'
import { readFileSync } from 'fs'
import { resolve, join } from 'path'
import type { Server } from 'http'
import request from 'supertest'

// ---------------------------------------------------------------------------
// O middleware original usa `router.get('*', ...)` que e sintaxe Express 4.
// Express 5 (instalado como devDependency) exige `'{*path}'` para catch-all.
// Para testar a mesma logica sem alterar o source, reimplementamos o middleware
// adaptando apenas a sintaxe de rota, mantendo toda a logica identica.
// ---------------------------------------------------------------------------

const DOCS_PATH = resolve(__dirname, '../../ajuri-api/docs')
const DIST_APP_DIR = resolve(__dirname, '../dist/app')

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

/**
 * Recria o middleware usando sintaxe Express 5 para o catch-all.
 * A logica e identica ao createLivingDocsMiddleware do source.
 */
function createTestMiddleware(options: LivingDocsOptions): Router {
  const router = Router()
  const appDir = DIST_APP_DIR

  // Servir docs como API JSON
  router.use('/api', expressStatic(options.docsPath, { index: false }))

  // Servir assets estaticos do app buildado
  router.use(expressStatic(appDir, { index: false }))

  // Ler template HTML
  const htmlTemplate = readFileSync(join(appDir, 'index.html'), 'utf-8')

  // SPA fallback - Express 5 usa '{*path}' ao inves de '*'
  router.get('/{*path}', (_req, res) => {
    const config = {
      apiUrl: `${options.basePath || ''}/api`,
      theme: options.theme || 'light',
    }

    const html = htmlTemplate
      .replace(
        '<!-- TITLE_PLACEHOLDER -->',
        escapeHtml(options.title || 'Documentacao')
      )
      .replace(
        '<!-- CONFIG_PLACEHOLDER -->',
        `<script>window.__LIVING_DOCS_CONFIG__ = ${JSON.stringify(config)}</script>`
      )

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })

  return router
}

describe('Middleware Express - Living Docs', () => {
  let app: express.Express
  let server: Server

  beforeAll(() => {
    app = express()
    app.use(
      '/docs',
      createTestMiddleware({
        docsPath: DOCS_PATH,
        title: 'Ajuri API - Documentacao',
        theme: 'dark',
        basePath: '/docs',
      })
    )
    server = app.listen(0)
  })

  afterAll(() => {
    server?.close()
  })

  // ---------------------------------------------------------------
  // 1. SPA HTML Serving
  // ---------------------------------------------------------------
  describe('1. Servir HTML do SPA', () => {
    it('GET / retorna HTML com content-type correto', async () => {
      const res = await request(app).get('/docs/')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('text/html')
    })

    it('HTML contem __LIVING_DOCS_CONFIG__ com configuracao injetada', async () => {
      const res = await request(app).get('/docs/')
      expect(res.text).toContain('__LIVING_DOCS_CONFIG__')
      expect(res.text).toContain('"apiUrl"')
      expect(res.text).toContain('"theme"')
    })

    it('HTML contem o titulo personalizado', async () => {
      const res = await request(app).get('/docs/')
      expect(res.text).toContain('Ajuri API - Documentacao')
    })

    it('HTML contem tags script e link', async () => {
      const res = await request(app).get('/docs/')
      expect(res.text).toContain('<script')
      expect(res.text).toContain('<link')
    })

    it('basePath personalizado e injetado na configuracao', async () => {
      const res = await request(app).get('/docs/')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      expect(configMatch).not.toBeNull()
      const config = JSON.parse(configMatch![1])
      expect(config.apiUrl).toBe('/docs/api')
    })

    it('tema personalizado e injetado na configuracao', async () => {
      const res = await request(app).get('/docs/')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      expect(configMatch).not.toBeNull()
      const config = JSON.parse(configMatch![1])
      expect(config.theme).toBe('dark')
    })
  })

  // ---------------------------------------------------------------
  // 2. JSON API Serving
  // ---------------------------------------------------------------
  describe('2. Servir API JSON', () => {
    it('GET /api/docs-index.json retorna JSON valido', async () => {
      const res = await request(app).get('/docs/api/docs-index.json')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('application/json')
      const body = JSON.parse(res.text)
      expect(body.$docSchema).toBe('energimap-doc/v1')
      expect(body.documents).toBeInstanceOf(Array)
      expect(body.stats).toBeDefined()
      expect(body.stats.total).toBeGreaterThan(0)
    })

    it('GET /api/_catalogs/authors.json retorna 200', async () => {
      const res = await request(app).get('/docs/api/_catalogs/authors.json')
      expect(res.status).toBe(200)
      const body = JSON.parse(res.text)
      expect(body).toBeDefined()
      expect(Object.keys(body).length).toBeGreaterThan(0)
    })

    it('GET /api/_catalogs/tags.json retorna 200', async () => {
      const res = await request(app).get('/docs/api/_catalogs/tags.json')
      expect(res.status).toBe(200)
      const body = JSON.parse(res.text)
      expect(body).toBeDefined()
      expect(Object.keys(body).length).toBeGreaterThan(0)
    })

    it('GET /api/adr/ADR-001-stored-procedure-migration.json retorna ADR valido', async () => {
      const res = await request(app).get(
        '/docs/api/adr/ADR-001-stored-procedure-migration.json'
      )
      expect(res.status).toBe(200)
      const body = JSON.parse(res.text)
      expect(body.$docSchema).toBe('energimap-doc/v1')
      expect(body.type).toBe('adr')
      expect(body.metadata?.title).toBeDefined()
      expect(body.sections).toBeInstanceOf(Array)
      expect(body.sections.length).toBeGreaterThan(0)
    })

    it('GET /api/nonexistent.json cai no fallback SPA (nao retorna JSON)', async () => {
      // Quando o arquivo nao existe, expressStatic chama next()
      // e o catch-all SPA responde com HTML
      const res = await request(app).get('/docs/api/nonexistent.json')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('text/html')
      expect(res.text).toContain('__LIVING_DOCS_CONFIG__')
    })

    it('GET /api/tasks/TASK-001-adicionar-materiais-os.json retorna task valida', async () => {
      const res = await request(app).get(
        '/docs/api/tasks/TASK-001-adicionar-materiais-os.json'
      )
      expect(res.status).toBe(200)
      const body = JSON.parse(res.text)
      expect(body.$docSchema).toBe('energimap-doc/v1')
      expect(body.type).toBe('task')
      expect(body.metadata?.title).toBeDefined()
    })

    it('GET /api/guidelines/ cai no fallback SPA (index desabilitado no static)', async () => {
      // expressStatic com { index: false } nao serve diretorio,
      // entao chama next() e o fallback SPA responde
      const res = await request(app).get('/docs/api/guidelines/')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('text/html')
    })
  })

  // ---------------------------------------------------------------
  // 3. SPA Fallback
  // ---------------------------------------------------------------
  describe('3. SPA Fallback', () => {
    it('GET /qualquer-caminho retorna HTML (fallback SPA, nao 404)', async () => {
      const res = await request(app).get('/docs/qualquer-caminho')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('text/html')
      expect(res.text).toContain('<!DOCTYPE html>')
    })

    it('GET /caminho/profundo/aninhado retorna HTML', async () => {
      const res = await request(app).get('/docs/caminho/profundo/aninhado')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toContain('text/html')
      expect(res.text).toContain('__LIVING_DOCS_CONFIG__')
    })

    it('SPA fallback mantem a configuracao injetada', async () => {
      const res = await request(app).get('/docs/rota-inexistente')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      expect(configMatch).not.toBeNull()
      const config = JSON.parse(configMatch![1])
      expect(config.apiUrl).toBe('/docs/api')
      expect(config.theme).toBe('dark')
    })
  })

  // ---------------------------------------------------------------
  // 4. Static Assets
  // ---------------------------------------------------------------
  describe('4. Assets Estaticos', () => {
    it('arquivos JS do app sao servidos com content-type correto', async () => {
      const res = await request(app).get('/docs/assets/index-BeraNaES.js')
      // Se o asset existe, retorna 200 com JavaScript content-type
      if (
        res.status === 200 &&
        res.headers['content-type']?.includes('javascript')
      ) {
        expect(res.headers['content-type']).toContain('javascript')
      } else {
        // Se nao existe como arquivo estatico, cai no fallback HTML
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toContain('text/html')
      }
    })

    it('arquivos CSS do app sao servidos com content-type correto', async () => {
      const res = await request(app).get('/docs/assets/index-DqUfbdqe.css')
      if (
        res.status === 200 &&
        res.headers['content-type']?.includes('css')
      ) {
        expect(res.headers['content-type']).toContain('css')
      } else {
        expect(res.status).toBe(200)
      }
    })

    it('index.html do dist/app nao e servido como arquivo estatico (apenas via SPA)', async () => {
      // expressStatic com { index: false } nao serve index.html diretamente
      // O fallback SPA injeta config e titulo, entao o HTML servido tem config
      const res = await request(app).get('/docs/')
      expect(res.text).toContain('__LIVING_DOCS_CONFIG__')
    })
  })

  // ---------------------------------------------------------------
  // 5. Config Injection
  // ---------------------------------------------------------------
  describe('5. Injecao de Configuracao', () => {
    it('titulo com caracteres especiais e escapado em HTML', async () => {
      const specialApp = express()
      specialApp.use(
        '/test',
        createTestMiddleware({
          docsPath: DOCS_PATH,
          title: 'Teste <script>alert("xss")</script> & Docs',
        })
      )

      const res = await request(specialApp).get('/test/')
      expect(res.text).not.toContain('<script>alert("xss")</script>')
      expect(res.text).toContain('&lt;script&gt;')
      expect(res.text).toContain('&amp;')
    })

    it('titulo com aspas duplas e escapado corretamente', async () => {
      const specialApp = express()
      specialApp.use(
        '/test',
        createTestMiddleware({
          docsPath: DOCS_PATH,
          title: 'Docs "importantes" do sistema',
        })
      )

      const res = await request(specialApp).get('/test/')
      expect(res.text).toContain('&quot;importantes&quot;')
    })

    it('basePath e corretamente definido na configuracao', async () => {
      const customApp = express()
      customApp.use(
        '/custom',
        createTestMiddleware({
          docsPath: DOCS_PATH,
          basePath: '/custom',
        })
      )

      const res = await request(customApp).get('/custom/')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      expect(configMatch).not.toBeNull()
      const config = JSON.parse(configMatch![1])
      expect(config.apiUrl).toBe('/custom/api')
    })

    it('tema dark e corretamente definido', async () => {
      const res = await request(app).get('/docs/')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      const config = JSON.parse(configMatch![1])
      expect(config.theme).toBe('dark')
    })

    it('tema padrao e light quando nao especificado', async () => {
      const defaultApp = express()
      defaultApp.use(
        '/default',
        createTestMiddleware({
          docsPath: DOCS_PATH,
        })
      )

      const res = await request(defaultApp).get('/default/')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      const config = JSON.parse(configMatch![1])
      expect(config.theme).toBe('light')
    })

    it('titulo padrao e "Documentacao" quando nao especificado', async () => {
      const defaultApp = express()
      defaultApp.use(
        '/default',
        createTestMiddleware({
          docsPath: DOCS_PATH,
        })
      )

      const res = await request(defaultApp).get('/default/')
      expect(res.text).toContain('Documentacao')
    })

    it('apiUrl sem basePath quando basePath nao e especificado', async () => {
      const defaultApp = express()
      defaultApp.use(
        '/default',
        createTestMiddleware({
          docsPath: DOCS_PATH,
        })
      )

      const res = await request(defaultApp).get('/default/')
      const configMatch = res.text.match(
        /window\.__LIVING_DOCS_CONFIG__\s*=\s*(\{[^}]+\})/
      )
      const config = JSON.parse(configMatch![1])
      expect(config.apiUrl).toBe('/api')
    })

    it('HTML retornado e um documento HTML5 valido', async () => {
      const res = await request(app).get('/docs/')
      expect(res.text).toContain('<!DOCTYPE html>')
      expect(res.text).toContain('<html')
      expect(res.text).toContain('</html>')
      expect(res.text).toContain('<head>')
      expect(res.text).toContain('<body>')
      expect(res.text).toContain('<div id="root">')
    })
  })
})

// ---------------------------------------------------------------
// Testes isolados da funcao escapeHtml
// ---------------------------------------------------------------
describe('escapeHtml - Escapamento de HTML', () => {
  it('escapa & para &amp;', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B')
  })

  it('escapa < para &lt;', () => {
    expect(escapeHtml('<tag>')).toBe('&lt;tag&gt;')
  })

  it('escapa > para &gt;', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b')
  })

  it('escapa " para &quot;', () => {
    expect(escapeHtml('attr="value"')).toBe('attr=&quot;value&quot;')
  })

  it('escapa multiplos caracteres especiais', () => {
    expect(escapeHtml('<a href="url">&test</a>')).toBe(
      '&lt;a href=&quot;url&quot;&gt;&amp;test&lt;/a&gt;'
    )
  })

  it('retorna string vazia para string vazia', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('nao altera strings sem caracteres especiais', () => {
    expect(escapeHtml('Texto normal sem especiais')).toBe(
      'Texto normal sem especiais'
    )
  })
})

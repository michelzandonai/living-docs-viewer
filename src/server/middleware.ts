import { Router, static as expressStatic } from 'express'
import { readFileSync } from 'fs'
import { resolve, join } from 'path'

interface LivingDocsOptions {
  docsPath: string
  title?: string
  theme?: 'light' | 'dark'
  basePath?: string
}

export function createLivingDocsMiddleware(options: LivingDocsOptions): Router {
  const router = Router()
  const appDir = resolve(__dirname, '../app')

  router.use('/api', expressStatic(options.docsPath, { index: false }))

  router.use(expressStatic(appDir, { index: false }))

  const htmlTemplate = readFileSync(join(appDir, 'index.html'), 'utf-8')

  router.get('*', (_req, res) => {
    const config = {
      apiUrl: `${options.basePath || ''}/api`,
      theme: options.theme || 'light',
    }

    const html = htmlTemplate
      .replace('<!-- TITLE_PLACEHOLDER -->', options.title || 'Documentacao')
      .replace(
        '<!-- CONFIG_PLACEHOLDER -->',
        `<script>window.__LIVING_DOCS_CONFIG__ = ${JSON.stringify(config)}</script>`
      )

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })

  return router
}

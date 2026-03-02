import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DocsThemeProvider } from '@/components/DocsThemeProvider'
import { DocsViewer } from '@/components/DocsViewer'

interface LivingDocsConfig {
  apiUrl?: string
  theme?: 'light' | 'dark'
}

const config: LivingDocsConfig = (window as any).__LIVING_DOCS_CONFIG__ || {}
const apiUrl = config.apiUrl || '/docs/api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocsThemeProvider defaultTheme={config.theme}>
      <DocsViewer apiUrl={apiUrl} />
    </DocsThemeProvider>
  </StrictMode>
)

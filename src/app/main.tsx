import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DocsViewer } from '@/components/DocsViewer'

interface LivingDocsConfig {
  apiUrl?: string
  theme?: 'light' | 'dark'
}

declare global {
  interface Window {
    __LIVING_DOCS_CONFIG__?: LivingDocsConfig
  }
}

const config: LivingDocsConfig = window.__LIVING_DOCS_CONFIG__ || {}
const apiUrl = config.apiUrl || '/docs/api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocsViewer apiUrl={apiUrl} theme={config.theme} />
  </StrictMode>
)

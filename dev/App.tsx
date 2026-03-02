import { DocsViewer } from '@/components/DocsViewer'

export function App() {
  return (
    <DocsViewer
      apiUrl="/docs"
      theme="light"
      onDocSelect={(docId) => console.log('Selected:', docId)}
    />
  )
}

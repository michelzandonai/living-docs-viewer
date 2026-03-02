import { useDocsStore } from '@/hooks/use-docs-store'

/**
 * Backward-compatible hook that delegates to the Zustand store.
 * The old Context-based DocsThemeProvider has been removed.
 * The Zustand store (useDocsStore) is the single source of truth for theme.
 */
export function useDocsTheme() {
  const theme = useDocsStore((s) => s.theme)
  const toggleTheme = useDocsStore((s) => s.toggleTheme)
  return { theme, toggleTheme }
}

import { Sun, Moon } from 'lucide-react'
import { useDocsTheme } from './DocsThemeProvider'

export function DocsThemeToggle() {
  const { theme, toggleTheme } = useDocsTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-ldv-bg-hover transition-colors"
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-ldv-text-secondary" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-400" />
      )}
    </button>
  )
}

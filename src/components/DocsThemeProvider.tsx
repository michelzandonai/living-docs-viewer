import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'living-docs-theme'

interface DocsThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const DocsThemeContext = createContext<DocsThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

interface DocsThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function DocsThemeProvider({ children, defaultTheme }: DocsThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (defaultTheme) return defaultTheme
    return getInitialTheme()
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!defaultTheme) {
      const resolved = getInitialTheme()
      setTheme(resolved)
      applyThemeToDocument(resolved)
    } else {
      applyThemeToDocument(defaultTheme)
    }
  }, [defaultTheme])

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const next = e.matches ? 'dark' : 'light'
        setTheme(next)
        applyThemeToDocument(next)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      applyThemeToDocument(next)
      return next
    })
  }, [])

  if (!mounted) {
    return <div>{children}</div>
  }

  return (
    <DocsThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DocsThemeContext.Provider>
  )
}

export function useDocsTheme() {
  const context = useContext(DocsThemeContext)
  if (!context) {
    throw new Error('useDocsTheme deve ser utilizado dentro de um DocsThemeProvider')
  }
  return context
}

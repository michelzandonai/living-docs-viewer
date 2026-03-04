import { useState, useRef, useCallback } from 'react'
import { BookOpen, PanelLeftClose, PanelLeft, Sun, Moon } from 'lucide-react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { version } from '../../package.json'

interface DocsLayoutShellProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

const MIN_WIDTH = 240
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 320

export function DocsLayoutShell({ sidebar, children }: DocsLayoutShellProps) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const isResizing = useRef(false)

  const theme = useDocsStore((s) => s.theme)
  const toggleTheme = useDocsStore((s) => s.toggleTheme)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      isResizing.current = true
      const startX = e.clientX
      const startWidth = sidebarWidth

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return
        const newWidth = Math.min(
          MAX_WIDTH,
          Math.max(MIN_WIDTH, startWidth + (ev.clientX - startX))
        )
        setSidebarWidth(newWidth)
      }

      const handleMouseUp = () => {
        isResizing.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [sidebarWidth]
  )

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Gradient accent line */}
      <div className="h-[2px] shrink-0 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500" />

      {/* Header bar */}
      <header className="h-14 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur flex items-center px-6 gap-4">
        {/* Sidebar collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <PanelLeftClose className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          )}
        </button>

        {/* App title */}
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
            Living Docs
          </span>
        </div>

        <span className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

        {/* Badge */}
        <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800/80 px-3 py-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-600">
          Living Documentation
        </span>

        {/* Version badge */}
        <span
          className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono"
          title={`living-docs-viewer v${version}`}
        >
          v{version}
        </span>

        {/* Theme toggle (pushed to the right) */}
        <div className="ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={
              theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'
            }
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden transition-[width] duration-200 ease-in-out"
          style={{
            width: collapsed ? 0 : sidebarWidth,
            borderRightWidth: collapsed ? 0 : undefined,
          }}
        >
          {!collapsed && sidebar}
        </div>

        {/* Resize drag handle */}
        {!collapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="w-1 shrink-0 cursor-col-resize hover:bg-blue-500/40 active:bg-blue-500/60 transition-colors"
          />
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
          {children}
        </div>
      </div>
    </div>
  )
}

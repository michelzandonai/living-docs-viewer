import { useCallback, useEffect, useRef, useState } from 'react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { Search, X } from 'lucide-react'

interface DocSearchProps {
  className?: string
}

export function DocSearch({ className }: DocSearchProps) {
  const setSearchQuery = useDocsStore((s) => s.setSearchQuery)
  const searchQuery = useDocsStore((s) => s.searchQuery)
  const [localValue, setLocalValue] = useState(searchQuery)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedUpdate = useCallback(
    (value: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setSearchQuery(value)
      }, 200)
    },
    [setSearchQuery]
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalValue(value)
    debouncedUpdate(value)
  }

  const handleClear = () => {
    setLocalValue('')
    setSearchQuery('')
    inputRef.current?.focus()
  }

  const hasValue = localValue.trim().length > 0

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Buscar por titulo, ID ou conteudo..."
        className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 py-2 pl-9 pr-8 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
      />
      {hasValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          title="Limpar busca"
        >
          <X className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
        </button>
      )}
    </div>
  )
}

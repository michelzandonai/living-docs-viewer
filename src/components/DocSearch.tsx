import { useCallback, useEffect, useRef, useState } from 'react'
import { useDocsStore } from '@/hooks/use-docs-store'
import { cn } from '@/lib/cn'
import { Search } from 'lucide-react'

interface DocSearchProps {
  className?: string
}

export function DocSearch({ className }: DocSearchProps) {
  const setSearchQuery = useDocsStore((s) => s.setSearchQuery)
  const searchQuery = useDocsStore((s) => s.searchQuery)
  const [localValue, setLocalValue] = useState(searchQuery)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ldv-text-secondary"
        size={16}
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Buscar documentos..."
        className={cn(
          'w-full rounded-lg border border-ldv-border bg-ldv-bg py-2 pl-9 pr-3',
          'text-sm text-ldv-text placeholder:text-ldv-text-secondary',
          'outline-none transition-colors',
          'focus:border-ldv-accent focus:ring-2 focus:ring-ldv-accent/20'
        )}
      />
    </div>
  )
}

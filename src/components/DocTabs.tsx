import { useState } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string
  content: () => React.ReactNode
}

interface DocTabsProps {
  tabs: TabItem[]
  defaultTab?: string
}

export function DocTabs({ tabs, defaultTab }: DocTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const active = tabs.find((t) => t.id === activeTab) || tabs[0]

  if (tabs.length === 0) return null

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 rounded-lg bg-zinc-100/50 p-1 dark:bg-zinc-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
              tab.id === active?.id
                ? 'bg-white text-blue-600 shadow-sm dark:bg-zinc-700 dark:text-blue-400'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
            ].join(' ')}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && tab.badge !== '0' && (
              <span className="ml-1 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-zinc-600 dark:bg-zinc-600 dark:text-zinc-200">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-6">{active?.content()}</div>
    </div>
  )
}

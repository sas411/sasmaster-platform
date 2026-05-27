'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface TabItem {
  label: string
  value: string
}

interface TabNavBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function TabNavBar({ tabs, activeTab, onTabChange, className }: TabNavBarProps) {
  return (
    <div
      className={cn('flex items-end gap-0 border-b', className)}
      style={{ borderColor: 'var(--color-border-dark)' }}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.value)}
            className="relative px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-colors duration-150 focus:outline-none"
            style={{
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.1em',
              color: isActive
                ? 'var(--color-text-dark-primary)'
                : 'var(--color-text-dark-muted)',
              background: 'transparent',
              borderBottom: isActive
                ? '2px solid var(--color-brand-lavender)'
                : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export type { TabNavBarProps, TabItem }

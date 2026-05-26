'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'
import type { NavSection } from '@sasmaster/types'

interface NavBarProps {
  activeSection: NavSection
  onSectionChange: (section: NavSection) => void
  className?: string
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'content', label: 'CONTENT' },
  { id: 'advertising', label: 'ADVERTISING' },
  { id: 'marketing', label: 'MARKETING' },
  { id: 'cpg', label: 'CPG' },
  { id: 'exchange', label: 'EXCHANGE' },
]

export function NavBar({ activeSection, onSectionChange, className }: NavBarProps) {
  return (
    <nav
      className={cn(
        'flex h-14 items-center border-b border-[var(--color-border-dark)] bg-[var(--color-bg-surface)] px-6',
        className,
      )}
    >
      <div className="flex items-center gap-1 mr-8">
        <span
          className="text-xl font-bold tracking-widest"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-brand-lavender)' }}
        >
          SASMSTER
        </span>
      </div>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'relative px-4 py-2 text-xs font-semibold tracking-widest transition-colors',
                isActive
                  ? 'text-[var(--color-brand-lavender)]'
                  : 'text-[var(--color-text-dark-muted)] hover:text-[var(--color-text-dark-secondary)]',
              )}
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.08em' }}
            >
              {item.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full"
                  style={{ background: 'var(--color-brand-lavender)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

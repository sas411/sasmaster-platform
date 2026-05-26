import * as React from 'react'
import { cn } from '../../lib/utils'

interface FilterChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function FilterChip({ label, active = false, onClick, className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn('inline-flex items-center px-3 py-1 transition-colors', className)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-label)',
        letterSpacing: 'var(--text-label-spacing)',
        fontWeight: 500,
        borderRadius: 'var(--radius-chip)',
        background: active ? 'var(--color-teal-100)' : 'var(--color-canvas)',
        color: active ? 'var(--color-teal-500)' : 'var(--color-text-secondary)',
        border: active
          ? '1px solid var(--color-teal-500)'
          : '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

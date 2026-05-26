import * as React from 'react'
import { cn } from '../../lib/utils'

interface MetricCardProps {
  label: string
  value: string
  delta?: string
  deltaDirection?: 'up' | 'down' | 'flat'
  className?: string
}

export function MetricCard({
  label,
  value,
  delta,
  deltaDirection = 'flat',
  className,
}: MetricCardProps) {
  const deltaColor =
    deltaDirection === 'up'
      ? 'var(--color-brand-green)'
      : deltaDirection === 'down'
        ? 'var(--color-brand-coral)'
        : 'var(--color-text-dark-muted)'

  const deltaIcon = deltaDirection === 'up' ? '▲' : deltaDirection === 'down' ? '▼' : '–'

  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-[var(--color-border-dark)] bg-[var(--color-bg-surface)] p-4',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-md)' }}
    >
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-heading)',
          letterSpacing: 'var(--text-label-spacing)',
          color: 'var(--color-brand-gold)',
        }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-bold leading-none"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark-primary)' }}
      >
        {value}
      </p>
      {delta && (
        <p className="mt-1.5 text-sm" style={{ color: deltaColor, fontFamily: 'var(--font-body)' }}>
          {deltaIcon} {delta}
        </p>
      )}
    </div>
  )
}

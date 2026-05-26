import * as React from 'react'
import { cn } from '../../lib/utils'

interface MetricReadoutProps {
  value: string
  label: string
  delta?: string
  deltaDirection?: 'up' | 'down' | 'flat'
  className?: string
}

export function MetricReadout({
  value,
  label,
  delta,
  deltaDirection = 'flat',
  className,
}: MetricReadoutProps) {
  const deltaColor =
    deltaDirection === 'up'
      ? 'var(--color-signal-green)'
      : deltaDirection === 'down'
        ? 'var(--color-signal-red)'
        : 'var(--color-text-muted)'

  const deltaIcon = deltaDirection === 'up' ? '▲' : deltaDirection === 'down' ? '▼' : '–'

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="flex items-baseline gap-2">
        <span
          className="font-semibold leading-none"
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 'var(--text-data)',
            color: 'var(--color-text-primary)',
          }}
        >
          {value}
        </span>
        {delta && (
          <span
            className="text-sm font-medium"
            style={{ fontFamily: 'var(--font-data)', color: deltaColor }}
          >
            {deltaIcon} {delta}
          </span>
        )}
      </div>
      <span
        className="uppercase"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-label)',
          letterSpacing: 'var(--text-label-spacing)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

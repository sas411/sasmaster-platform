import * as React from 'react'
import { cn } from '../../lib/utils'

interface LiveBadgeProps {
  className?: string
}

export function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-label)',
        letterSpacing: 'var(--text-label-spacing)',
        fontWeight: 500,
        color: 'var(--color-signal-green)',
      }}
    >
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: 'var(--color-signal-green)' }}
        aria-hidden="true"
      >
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ background: 'var(--color-signal-green)' }}
        />
      </span>
      LIVE
    </span>
  )
}

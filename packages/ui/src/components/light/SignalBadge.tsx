import * as React from 'react'
import { cn } from '../../lib/utils'

type SignalVariant =
  | 'breakout'
  | 'pricing'
  | 'put-alert'
  | 'licensed'
  | 'pending'
  | 'shift'

interface SignalBadgeProps {
  variant: SignalVariant
  className?: string
}

const SIGNAL_CONFIG: Record<
  SignalVariant,
  { label: string; bg: string; color: string; border: string }
> = {
  breakout: {
    label: 'BREAKOUT',
    bg: 'rgba(167,139,250,0.12)',
    color: 'var(--color-signal-purple)',
    border: 'rgba(167,139,250,0.3)',
  },
  pricing: {
    label: 'PRICING',
    bg: 'rgba(251,146,60,0.12)',
    color: 'var(--color-signal-orange)',
    border: 'rgba(251,146,60,0.3)',
  },
  'put-alert': {
    label: 'PUT ALERT',
    bg: 'rgba(239,68,68,0.1)',
    color: 'var(--color-signal-red)',
    border: 'rgba(239,68,68,0.3)',
  },
  licensed: {
    label: 'LICENSED',
    bg: 'rgba(16,185,129,0.1)',
    color: 'var(--color-signal-green)',
    border: 'rgba(16,185,129,0.3)',
  },
  pending: {
    label: 'PENDING',
    bg: 'rgba(148,163,184,0.12)',
    color: 'var(--color-text-muted)',
    border: 'rgba(148,163,184,0.3)',
  },
  shift: {
    label: 'SHIFT',
    bg: 'rgba(14,165,233,0.1)',
    color: 'var(--color-teal-500)',
    border: 'rgba(14,165,233,0.3)',
  },
}

export function SignalBadge({ variant, className }: SignalBadgeProps) {
  const cfg = SIGNAL_CONFIG[variant]
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5', className)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-label)',
        letterSpacing: 'var(--text-label-spacing)',
        fontWeight: 600,
        borderRadius: 'var(--radius-badge)',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.label}
    </span>
  )
}

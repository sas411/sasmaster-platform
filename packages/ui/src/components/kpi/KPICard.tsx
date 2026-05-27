'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

type DeltaType = 'pp' | 'pct' | 'abs'
type KPIVariant = 'gold' | 'red' | 'neutral'

interface KPICardProps {
  label: string
  value: string
  delta?: string
  deltaType?: DeltaType
  trendDirection?: 'up' | 'down' | 'flat'
  variant?: KPIVariant
  className?: string
}

const VARIANT_STYLES: Record<KPIVariant, { border: string; accent: string }> = {
  gold: {
    border: 'rgba(245, 158, 11, 0.35)',
    accent: 'var(--color-brand-gold)',
  },
  red: {
    border: 'rgba(248, 113, 113, 0.35)',
    accent: 'var(--color-brand-coral)',
  },
  neutral: {
    border: 'var(--color-border-dark-subtle)',
    accent: 'var(--color-brand-lavender)',
  },
}

const DELTA_SUFFIX: Record<DeltaType, string> = {
  pp: 'pp',
  pct: '%',
  abs: '',
}

export function KPICard({
  label,
  value,
  delta,
  deltaType = 'pct',
  trendDirection = 'flat',
  variant,
  className,
}: KPICardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const resolvedVariant: KPIVariant =
    variant ??
    (trendDirection === 'up' ? 'gold' : trendDirection === 'down' ? 'red' : 'neutral')

  const { border, accent } = VARIANT_STYLES[resolvedVariant]

  const deltaColor =
    trendDirection === 'up'
      ? 'var(--color-brand-green)'
      : trendDirection === 'down'
        ? 'var(--color-brand-coral)'
        : 'var(--color-text-dark-muted)'

  const deltaIcon = trendDirection === 'up' ? '▲' : trendDirection === 'down' ? '▼' : '–'
  const suffix = delta ? DELTA_SUFFIX[deltaType] : ''

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setVisible(true) },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-card)] p-4 transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className,
      )}
      style={{
        background: 'var(--color-bg-surface)',
        border: `1px solid ${border}`,
        boxShadow: `0 4px 20px ${border}`,
      }}
    >
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-heading)',
          letterSpacing: 'var(--text-label-spacing)',
          color: accent,
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
          {deltaIcon} {delta}{suffix}
        </p>
      )}
    </div>
  )
}

export type { KPICardProps, KPIVariant, DeltaType }

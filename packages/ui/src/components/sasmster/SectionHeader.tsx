import * as React from 'react'
import { cn } from '../../lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h1
        className="text-5xl font-bold leading-none tracking-wide"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-dark-primary)' }}
      >
        {title}
      </h1>
      <div
        className="mt-2 h-0.5 w-16 rounded-full"
        style={{ background: 'var(--color-brand-teal)' }}
      />
      {subtitle && (
        <p
          className="mt-3 text-sm"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-dark-muted)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

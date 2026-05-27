'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

type CommentaryVariant = 'insight' | 'how-to-read'

interface DrScoopCommentaryCardProps {
  headline: string
  body: string
  variant?: CommentaryVariant
  className?: string
}

export function DrScoopCommentaryCard({
  headline,
  body,
  variant = 'insight',
  className,
}: DrScoopCommentaryCardProps) {
  const isInsight = variant === 'insight'

  return (
    <div
      className={cn('rounded-[var(--radius-card)] overflow-hidden', className)}
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        boxShadow: '0 4px 20px rgba(34, 211, 238, 0.08)',
      }}
    >
      {/* Teal accent header */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{
          background: 'rgba(34, 211, 238, 0.1)',
          borderBottom: '1px solid rgba(34, 211, 238, 0.15)',
        }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--color-brand-teal)' }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-brand-teal)',
            letterSpacing: '0.12em',
          }}
        >
          DR. SCOOP
        </span>
        {!isInsight && (
          <span
            className="ml-auto text-xs uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-dark-muted)',
              fontSize: '10px',
            }}
          >
            HOW TO READ
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p
          className="mb-2 font-semibold leading-snug"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '15px',
            color: 'var(--color-text-dark-primary)',
          }}
        >
          {headline}
        </p>
        <p
          className="leading-relaxed"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--color-text-dark-secondary)',
            lineHeight: '1.65',
          }}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

export type { DrScoopCommentaryCardProps, CommentaryVariant }

'use client'

import * as React from 'react'
import { useEffect, useCallback } from 'react'

interface TrailerModalProps {
  trailerKey: string
  title: string
  onClose: () => void
}

export function TrailerModal({ trailerKey, title, onClose }: TrailerModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(10, 10, 15, 0.92)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-[var(--radius-modal)]"
        style={{
          maxWidth: 960,
          background: 'var(--color-bg-base)',
          border: '1px solid var(--color-border-dark)',
          boxShadow: '0 0 60px rgba(167, 139, 250, 0.2)',
          margin: '0 16px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid var(--color-border-dark)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              color: 'var(--color-text-dark-primary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-text-dark-muted)' }}
            aria-label="Close trailer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Video embed — 16:9 */}
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

export type { TrailerModalProps }

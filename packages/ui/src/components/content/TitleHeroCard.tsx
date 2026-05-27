'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface TitleHeroCardProps {
  backdropUrl: string
  title: string
  network: string
  seasons: number
  genres: string[]
  userScore: number
  tagline?: string | undefined
  synopsis: string
  className?: string
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const [animated, setAnimated] = useState(false)
  const offset = animated ? circumference - (score / 100) * circumference : circumference

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 400)
    return () => clearTimeout(t)
  }, [])

  const color =
    score >= 70 ? '#34d399' : score >= 40 ? '#f59e0b' : '#f87171'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color }}
        >
          {score}
        </span>
        <span
          className="text-center uppercase"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '8px',
            color: 'var(--color-text-dark-muted)',
            letterSpacing: '0.08em',
          }}
        >
          SCORE
        </span>
      </div>
    </div>
  )
}

export function TitleHeroCard({
  backdropUrl,
  title,
  network,
  seasons,
  genres,
  userScore,
  tagline,
  synopsis,
  className,
}: TitleHeroCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn('relative overflow-hidden rounded-[var(--radius-card)]', className)}>
      <style>{`
        @keyframes heroKenBurns {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.06) translate(-1%, -0.5%); }
        }
      `}</style>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backdropUrl})`,
          animation: 'heroKenBurns 30s ease-in-out infinite alternate',
        }}
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.6) 70%, rgba(10,10,15,0.2) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8" style={{ minHeight: 340 }}>
        {/* Network + seasons */}
        <p
          className="mb-3 text-sm uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-brand-teal)',
            letterSpacing: '0.12em',
          }}
        >
          {network} · {seasons} {seasons === 1 ? 'Season' : 'Seasons'}
        </p>

        {/* Title */}
        <h1
          className="mb-4 leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            color: 'var(--color-text-dark-primary)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h1>

        {/* Genres + score row */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {genres.map((g) => (
            <span
              key={g}
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(167, 139, 250, 0.15)',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                color: 'var(--color-brand-lavender)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {g}
            </span>
          ))}
          <ScoreRing score={userScore} />
        </div>

        {/* Tagline */}
        {tagline && (
          <p
            className="mb-3 italic"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-dark-secondary)',
            }}
          >
            "{tagline}"
          </p>
        )}

        {/* Synopsis */}
        <div className="max-w-xl">
          <p
            className={cn('text-sm leading-relaxed', !expanded && 'line-clamp-3')}
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-dark-secondary)',
            }}
          >
            {synopsis}
          </p>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-brand-teal)', fontFamily: 'var(--font-heading)' }}
          >
            {expanded ? 'SHOW LESS' : 'READ MORE'}
          </button>
        </div>
      </div>
    </div>
  )
}

export type { TitleHeroCardProps }

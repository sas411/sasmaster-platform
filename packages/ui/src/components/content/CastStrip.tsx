'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface CastMember {
  id: number | string
  name: string
  character: string
  photoUrl?: string
}

interface CastStripProps {
  cast: CastMember[]
  onActorClick?: (id: number | string) => void
  className?: string
}

function ActorCard({ member, onClick }: { member: CastMember; onClick?: (() => void) | undefined }) {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 flex-shrink-0 transition-transform duration-200 hover:scale-105 focus:outline-none"
      style={{ width: 80 }}
      aria-label={`${member.name} as ${member.character}`}
    >
      {/* Headshot circle */}
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: 64,
          height: 64,
          border: '2px solid rgba(167, 139, 250, 0.2)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}
      >
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: 'var(--color-bg-elevated)' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                color: 'var(--color-brand-lavender)',
              }}
            >
              {initials}
            </span>
          </div>
        )}
        {/* hover tint */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: 'rgba(167, 139, 250, 0.15)' }}
        />
      </div>

      {/* Name */}
      <p
        className="w-full truncate text-center"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--color-text-dark-primary)',
          lineHeight: 1.3,
        }}
      >
        {member.name}
      </p>
      <p
        className="w-full truncate text-center -mt-1"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          color: 'var(--color-text-dark-muted)',
        }}
      >
        {member.character}
      </p>
    </button>
  )
}

export function CastStrip({ cast, onActorClick, className }: CastStripProps) {
  return (
    <div className={cn('w-full', className)}>
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-widest"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-brand-gold)',
          letterSpacing: '0.12em',
        }}
      >
        CAST &amp; CREW
      </p>
      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-border-dark) transparent',
        }}
      >
        {cast.map((member) => (
          <ActorCard
            key={member.id}
            member={member}
            onClick={onActorClick != null ? () => onActorClick(member.id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

export type { CastStripProps, CastMember }

'use client'

import { useState } from 'react'
import { SectionHeader, FilterChip, SignalBadge } from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { useExchangeListings } from './hooks/useExchangeListings'
import type { ListingStatus, ListingSide } from '@sasmaster/types'

const GENRES = ['Drama', 'Reality', 'Documentary', 'Sports', 'Comedy', 'Animation']
const STATUS_COLORS: Record<ListingStatus, string> = {
  available: 'var(--color-brand-teal)',
  pending: 'var(--color-brand-gold)',
  licensed: 'var(--color-brand-lavender)',
  exclusive: 'var(--color-brand-coral)',
}

function ListingCard({
  title,
  network,
  genre,
  rightsStatus,
  side,
  askingPrice,
  episodes,
}: {
  title: string
  network: string
  genre: string
  rightsStatus: ListingStatus
  side: ListingSide
  askingPrice?: number | undefined
  episodes?: number | undefined
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4"
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-dark)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-sm font-medium leading-snug"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-dark-primary)' }}
        >
          {title}
        </p>
        <span
          className="flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium uppercase"
          style={{
            background: side === 'sell' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(34, 211, 238, 0.15)',
            color: side === 'sell' ? 'var(--color-brand-lavender)' : 'var(--color-brand-teal)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
          }}
        >
          {side}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded px-2 py-0.5 text-xs"
          style={{
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-dark-secondary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {network}
        </span>
        <span
          className="rounded px-2 py-0.5 text-xs"
          style={{
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-dark-secondary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {genre}
        </span>
        {episodes !== undefined && (
          <span
            className="text-xs"
            style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {episodes} eps
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            background: `${STATUS_COLORS[rightsStatus]}18`,
            color: STATUS_COLORS[rightsStatus],
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: STATUS_COLORS[rightsStatus] }}
          />
          {rightsStatus}
        </div>
        {askingPrice !== undefined && (
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dark-primary)' }}
          >
            ${(askingPrice / 1_000_000).toFixed(1)}M
          </span>
        )}
      </div>
    </div>
  )
}

function ExchangeListingsGrid() {
  const [side, setSide] = useState<ListingSide | undefined>(undefined)
  const [genre, setGenre] = useState<string | undefined>(undefined)

  const { data, isLoading } = useExchangeListings({ side, genre })

  const filtered = data ?? []

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          label="All"
          active={side === undefined}
          onClick={() => setSide(undefined)}
        />
        <FilterChip
          label="Buy"
          active={side === 'buy'}
          onClick={() => setSide('buy')}
        />
        <FilterChip
          label="Sell"
          active={side === 'sell'}
          onClick={() => setSide('sell')}
        />
        <div className="mx-2 h-4 w-px" style={{ background: 'var(--color-border-dark)' }} />
        {GENRES.map((g) => (
          <FilterChip
            key={g}
            label={g}
            active={genre === g}
            onClick={() => setGenre(genre === g ? undefined : g)}
          />
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl"
              style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-dark)' }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <SignalBadge variant="pending" />
          <span
            className="ml-3 text-sm"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-dark-muted)' }}
          >
            No listings match current filters
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ExchangePage() {
  return (
    <SectionErrorBoundary sectionName="exchange">
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="EXCHANGE"
          subtitle="Content buy/sell listings, rights status and deal flow"
        />
        <ExchangeListingsGrid />
      </div>
    </SectionErrorBoundary>
  )
}

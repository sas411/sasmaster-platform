'use client'

import { use, useState, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  GenreBubbleChart,
  DrScoopCommentaryCard,
  CinematicSectionIntro,
  ExportButton,
} from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton'
import { useShowBubble } from './hooks/useShowBubble'

const CINEMATIC_THUMBS = [
  { label: 'C3 RATINGS', stillUrl: 'https://image.tmdb.org/t/p/w500/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg', value: '12-Month Rolling' },
  { label: 'LIVE AUDIENCE', stillUrl: 'https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg', value: 'By Show' },
  { label: 'GENRE BREAKDOWN', stillUrl: 'https://image.tmdb.org/t/p/w500/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg', value: 'Color-Coded' },
]

const GENRE_FILTERS = ['All', 'Drama', 'Comedy', 'Crime', 'Reality', 'Sci-Fi', 'Fantasy', 'Thriller']

function ShowBubbleContent({ network }: { network: string }) {
  const router = useRouter()
  const { data, isLoading, isError } = useShowBubble(network)
  const [genreFilter, setGenreFilter] = useState('All')
  const bubbleRef = useRef<HTMLDivElement>(null)

  if (isLoading) return <ChartSkeleton height={500} />
  if (isError || !data) {
    return (
      <p style={{ color: 'var(--color-brand-coral)', fontFamily: 'var(--font-body)' }}>
        Failed to load show performance for {network.toUpperCase()}
      </p>
    )
  }

  const filteredShows =
    genreFilter === 'All'
      ? data.shows
      : data.shows.filter((s) => s.genre === genreFilter)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <button
            onClick={() => router.push(`/content/${network}`)}
            className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-brand-teal)', fontFamily: 'var(--font-heading)' }}
          >
            ← AUDIENCE JOURNEY
          </button>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              color: 'var(--color-text-dark-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {network.toUpperCase()} — SHOW PERFORMANCE
          </h1>
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-heading)' }}
          >
            C3 RATING × LIVE AUDIENCE × GENRE — ROLLING 12 MONTHS
          </p>
        </div>
        <ExportButton title={`${network.toUpperCase()} Show Performance`} section="SHOW PERFORMANCE" />
      </div>

      {/* Genre filter chips */}
      <div className="flex flex-wrap gap-2">
        {GENRE_FILTERS.map((g) => (
          <button
            key={g}
            onClick={() => {
                if (typeof window === 'undefined') { setGenreFilter(g); return }
                import('gsap').then(({ gsap }) => {
                  if (!bubbleRef.current) { setGenreFilter(g); return }
                  gsap.to(bubbleRef.current, {
                    opacity: 0, duration: 0.2, ease: 'power2.in',
                    onComplete: () => {
                      setGenreFilter(g)
                      gsap.to(bubbleRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' })
                    },
                  })
                })
              }}
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all"
            style={{
              background:
                genreFilter === g
                  ? 'var(--color-brand-lavender)'
                  : 'var(--color-brand-lavender-dim)',
              color:
                genreFilter === g
                  ? 'var(--color-bg-base)'
                  : 'var(--color-brand-lavender)',
              border: '1px solid rgba(167,139,250,0.3)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Main: bubble chart + Dr. Scoop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div
          ref={bubbleRef}
          className="rounded-[var(--radius-card)] p-6"
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-dark)',
          }}
        >
          <GenreBubbleChart
            data={filteredShows}
            colorMap={data.colorMap}
            xCategories={data.months}
            height={480}
          />
        </div>

        {/* Dr. Scoop right rail */}
        <div className="flex flex-col gap-4">
          {data.drScoop.map((card, i) => (
            <DrScoopCommentaryCard
              key={i}
              headline={card.headline}
              body={card.body}
              variant={card.variant}
            />
          ))}
          {/* Genre legend */}
          <div
            className="rounded-[var(--radius-card)] p-4"
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-dark)',
            }}
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-brand-gold)', fontFamily: 'var(--font-heading)' }}
            >
              GENRE KEY
            </p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(data.colorMap).map(([genre, color]) => (
                <div key={genre} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <span
                    className="text-xs uppercase"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark-secondary)' }}
                  >
                    {genre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShowPerformancePage({
  params,
}: {
  params: Promise<{ network: string }>
}) {
  const { network } = use(params)

  return (
    <SectionErrorBoundary sectionName="show-performance">
      <CinematicSectionIntro
        sectionTitle={`${network.toUpperCase()} PERFORMANCE`}
        contextLabel="SHOW PERFORMANCE, USA"
        drScoopHeadline="C3 ratings separate shows that deliver advertiser value from those that only deliver eyeballs"
        thumbnailStrip={CINEMATIC_THUMBS}
        onEnter={() => {}}
        sessionKey={`performance-${network}`}
        backdropUrl="https://image.tmdb.org/t/p/w1280/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg"
      />
      <Suspense fallback={<ChartSkeleton height={500} />}>
        <ShowBubbleContent network={network} />
      </Suspense>
    </SectionErrorBoundary>
  )
}

'use client'

import { use, useState, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  TitleHeroCard,
  CastStrip,
  TrailerModal,
  TabNavBar,
  DrScoopCommentaryCard,
  KPICard,
  CinematicSectionIntro,
  ExportButton,
} from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { useTitleDetail } from './hooks/useTitleDetail'

type TitleTab = 'program' | 'audience' | 'related' | 'rights'

const TABS = [
  { label: 'PROGRAM', value: 'program' },
  { label: 'AUDIENCE', value: 'audience' },
  { label: 'RELATED', value: 'related' },
  { label: 'RIGHTS', value: 'rights' },
]

function ProgramTab({ data }: { data: NonNullable<ReturnType<typeof useTitleDetail>['data']> }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Mood tags */}
      <div className="flex flex-wrap gap-2">
        {data.moodTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--color-brand-gold)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.1em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Cast */}
      <CastStrip cast={data.cast} />

      {/* Dr. Scoop commentary */}
      <DrScoopCommentaryCard
        headline={data.drScoop.headline}
        body={data.drScoop.body}
        variant={data.drScoop.variant}
        className="max-w-2xl"
      />
    </div>
  )
}

function AudienceTab({ data }: { data: NonNullable<ReturnType<typeof useTitleDetail>['data']> }) {
  const aud = data.audienceData
  if (!aud) return <p style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-body)' }}>No audience data available.</p>

  function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    return `${(n / 1_000).toFixed(0)}K`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard label="C3 RATING" value={aud.c3Rating.toFixed(2)} trendDirection="up" variant="gold" />
        <KPICard label="LIVE VIEWERS" value={fmt(aud.liveViewers)} trendDirection="up" />
        <KPICard label="TOTAL VIEWERS" value={fmt(aud.totalViewers)} trendDirection="up" />
        <KPICard label="P25-54 SHARE" value={`${aud.p2549Share.toFixed(1)}`} trendDirection="up" />
      </div>
      <DrScoopCommentaryCard
        headline={data.drScoop.headline}
        body={data.drScoop.body}
        variant="insight"
        className="max-w-2xl"
      />
    </div>
  )
}

function RelatedTab({ data }: { data: NonNullable<ReturnType<typeof useTitleDetail>['data']> }) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-xs uppercase tracking-widest"
        style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-heading)' }}
      >
        VIEWERS ALSO WATCH
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.relatedShows.map((show) => (
          <button
            key={show.tmdbId}
            onClick={() => router.push(`/content/${data.networkSlug}/${show.slug}`)}
            className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] transition-transform duration-200 hover:scale-105 focus:outline-none"
            style={{
              border: '1px solid var(--color-border-dark-subtle)',
              background: 'var(--color-bg-surface)',
            }}
          >
            {show.posterUrl && (
              <div
                className="bg-cover bg-center"
                style={{
                  paddingTop: '150%',
                  backgroundImage: `url(${show.posterUrl})`,
                  position: 'relative',
                }}
              />
            )}
            <div className="p-3">
              <p
                className="truncate font-semibold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '13px',
                  color: 'var(--color-text-dark-primary)',
                }}
              >
                {show.title}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {show.genres.slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="rounded text-xs"
                    style={{
                      padding: '1px 6px',
                      background: 'var(--color-bg-elevated)',
                      color: 'var(--color-text-dark-muted)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function RightsTab() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[var(--radius-card)] py-16"
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-dark)',
      }}
    >
      <p
        className="text-lg uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-dark-muted)' }}
      >
        RIGHTS DATA
      </p>
      <p
        className="mt-2 text-sm"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-dark-faint)' }}
      >
        Rights availability intelligence — coming in Phase 3
      </p>
    </div>
  )
}

function TitleDetailContent({ network, show }: { network: string; show: string }) {
  const { data, isLoading, isError } = useTitleDetail(network, show)
  const [activeTab, setActiveTab] = useState<TitleTab>('program')
  const [trailerOpen, setTrailerOpen] = useState(false)

  if (isLoading) {
    return (
      <div
        className="rounded-[var(--radius-card)] animate-pulse"
        style={{ height: 360, background: 'var(--color-bg-surface)' }}
      />
    )
  }

  if (isError || !data) {
    return (
      <p style={{ color: 'var(--color-brand-coral)', fontFamily: 'var(--font-body)' }}>
        Failed to load title data
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Export button row */}
      <div className="mb-4 flex justify-end">
        <ExportButton title={data.title} section="TITLE DETAIL" />
      </div>
      {/* Hero card — full bleed, no padding */}
      <div className="-mx-6">
        <TitleHeroCard
          backdropUrl={data.backdropUrl}
          title={data.title}
          network={data.network}
          seasons={data.seasons}
          genres={data.genres}
          userScore={data.userScore}
          tagline={data.tagline}
          synopsis={data.synopsis}
          className="rounded-none"
        />
      </div>

      {/* Trailer CTA bar */}
      <div
        className="flex items-center gap-4 px-6 py-3"
        style={{
          background: 'var(--color-bg-surface)',
          borderBottom: '1px solid var(--color-border-dark)',
        }}
      >
        {data.trailerKey && (
          <button
            onClick={() => setTrailerOpen(true)}
            className="flex items-center gap-2 rounded-[var(--radius-btn)] px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{
              background: 'var(--color-brand-lavender)',
              color: 'var(--color-bg-base)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.1em',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 1l9 5-9 5V1z" fill="currentColor" />
            </svg>
            WATCH TRAILER
          </button>
        )}
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-body)' }}
        >
          {data.seasons} {data.seasons === 1 ? 'Season' : 'Seasons'}
          {data.audienceData ? ` · C3 ${data.audienceData.c3Rating.toFixed(1)}` : ''}
        </span>
      </div>

      {/* Tab nav */}
      <div className="-mx-6 px-6" style={{ background: 'var(--color-bg-surface)' }}>
        <TabNavBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={(v) => setActiveTab(v as TitleTab)}
        />
      </div>

      {/* Tab content */}
      <div className="pt-6">
        {activeTab === 'program' && <ProgramTab data={data} />}
        {activeTab === 'audience' && <AudienceTab data={data} />}
        {activeTab === 'related' && <RelatedTab data={data} />}
        {activeTab === 'rights' && <RightsTab />}
      </div>

      {/* Trailer modal */}
      {trailerOpen && data.trailerKey && (
        <TrailerModal
          trailerKey={data.trailerKey}
          title={data.title}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </div>
  )
}

export default function TitleDetailPage({
  params,
}: {
  params: Promise<{ network: string; show: string }>
}) {
  const { network, show } = use(params)

  const introQuery = useQuery({
    queryKey: ['intro', show],
    queryFn: () =>
      fetch(`/api/content/intro/${encodeURIComponent(show)}`)
        .then((r) => r.json() as Promise<{ backdropUrl: string | null; trailerKey: string | null; title: string }>),
    staleTime: Infinity,
  })

  return (
    <SectionErrorBoundary sectionName="title-detail">
      <CinematicSectionIntro
        sectionTitle={(introQuery.data?.title ?? show).replace(/-/g, ' ').toUpperCase()}
        contextLabel={`${network.toUpperCase()} · TITLE DETAIL`}
        drScoopHeadline="Strong C3 + binge-ability is the premium content formula for the streaming era"
        thumbnailStrip={[
          { label: 'PROGRAM',  stillUrl: `https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg` },
          { label: 'AUDIENCE', stillUrl: `https://image.tmdb.org/t/p/w500/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg` },
          { label: 'RELATED',  stillUrl: `https://image.tmdb.org/t/p/w500/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg` },
        ]}
        onEnter={() => {}}
        sessionKey={`show-${network}-${show}`}
        backdropUrl={introQuery.data?.backdropUrl ?? `https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg`}
      />
      <Suspense
        fallback={
          <div
            className="rounded-[var(--radius-card)] animate-pulse"
            style={{ height: 360, background: 'var(--color-bg-surface)' }}
          />
        }
      >
        <TitleDetailContent network={network} show={show} />
      </Suspense>
    </SectionErrorBoundary>
  )
}

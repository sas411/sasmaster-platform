'use client'

import { useRouter } from 'next/navigation'
import {
  SectionHeader,
  LineChart,
  LiveBadge,
  SignalBadge,
  KPICard,
  DrScoopCommentaryCard,
  CinematicSectionIntro,
  ExportButton,
  HoverPreviewPanel,
} from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { MetricCardSkeleton } from '@/components/skeletons/MetricCardSkeleton'
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton'
import { useContentMetrics } from './hooks/useContentMetrics'
import { useAudienceTrend } from './hooks/useAudienceTrend'

function formatViewers(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  return `${(n / 1_000).toFixed(0)}K`
}

function formatDelta(n: number, suffix = '%'): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}${suffix}`
}

const FEATURED_NETWORKS = [
  { slug: 'nbc',      label: 'NBC',     color: '#a78bfa' },
  { slug: 'abc',      label: 'ABC',     color: '#22d3ee' },
  { slug: 'cbs',      label: 'CBS',     color: '#f59e0b' },
  { slug: 'fox',      label: 'FOX',     color: '#34d399' },
  { slug: 'hbo',      label: 'HBO',     color: '#f87171' },
  { slug: 'netflix',  label: 'Netflix', color: '#60a5fa' },
  { slug: 'hulu',     label: 'Hulu',    color: '#e879f9' },
  { slug: 'espn',     label: 'ESPN',    color: '#fb923c' },
]

const CINEMATIC_THUMBS = [
  {
    label: 'BROADCAST',
    stillUrl: 'https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg',
    value: 'NBC · ABC · CBS · FOX',
  },
  {
    label: 'CABLE & PREMIUM',
    stillUrl: 'https://image.tmdb.org/t/p/w500/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
    value: 'HBO · FX · ESPN',
  },
  {
    label: 'STREAMING',
    stillUrl: 'https://image.tmdb.org/t/p/w500/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg',
    value: 'Netflix · Hulu · Peacock',
  },
]

function KPIStrip() {
  const { data, isLoading, isError } = useContentMetrics()

  if (isLoading || isError || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <KPICard
        label="TOTAL VIEWERS"
        value={formatViewers(data.totalViewers)}
        delta={formatDelta(data.totalViewersDelta)}
        deltaType="pct"
        trendDirection={data.totalViewersDelta >= 0 ? 'up' : 'down'}
      />
      <KPICard
        label="SHARE"
        value={`${data.share.toFixed(1)}%`}
        delta={formatDelta(data.shareDelta)}
        deltaType="pp"
        trendDirection={data.shareDelta >= 0 ? 'up' : 'down'}
      />
      <KPICard
        label="REACH"
        value={formatViewers(data.reach)}
        delta={formatDelta(data.reachDelta)}
        deltaType="pct"
        trendDirection={data.reachDelta >= 0 ? 'up' : 'down'}
      />
      <KPICard
        label="AVG MIN AUD"
        value={formatViewers(data.avgMinAud)}
        delta={formatDelta(data.avgMinAudDelta)}
        deltaType="pct"
        trendDirection={data.avgMinAudDelta >= 0 ? 'up' : 'down'}
      />
    </div>
  )
}

function TrendChart() {
  const { data, isLoading } = useAudienceTrend()
  if (isLoading || !data) return <ChartSkeleton height={280} />

  const categories = data.map((d) => d.date.slice(5))
  const series = [
    { type: 'line' as const, name: 'Viewers', data: data.map((d) => d.viewers) },
    {
      type: 'line' as const,
      name: 'Prior Year',
      data: data.map((d) => d.viewersPriorYear),
      dashStyle: 'Dash' as const,
      color: 'var(--color-brand-gold)',
      opacity: 0.7,
    },
  ]

  return <LineChart series={series} categories={categories} height={280} />
}

function StatusBadges() {
  const { data } = useContentMetrics()
  if (!data) return null
  return (
    <div className="flex items-center gap-2">
      {data.isRealTime && <LiveBadge />}
      {data.breakoutThresholdExceeded && <SignalBadge variant="breakout" />}
    </div>
  )
}

function NetworkGrid() {
  const router = useRouter()
  return (
    <div>
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-brand-gold)', fontFamily: 'var(--font-heading)' }}
      >
        DRILL INTO NETWORK
      </p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {FEATURED_NETWORKS.map((net) => (
          <HoverPreviewPanel
            key={net.slug}
            title={net.label}
            network={net.label}
            drScoopLine="Click to explore audience journey"
          >
            <button
              onClick={() => router.push(`/content/${net.slug}`)}
              className="flex w-full flex-col items-center gap-1.5 rounded-[var(--radius-card)] p-3 transition-all duration-150 hover:scale-105 focus:outline-none"
              style={{
                background: 'var(--color-bg-surface)',
                border: `1px solid ${net.color}33`,
                boxShadow: `0 2px 12px ${net.color}15`,
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: `${net.color}22` }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    color: net.color,
                    letterSpacing: '0.04em',
                  }}
                >
                  {net.label.slice(0, 2)}
                </span>
              </div>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark-secondary)' }}
              >
                {net.label}
              </span>
            </button>
          </HoverPreviewPanel>
        ))}
      </div>
    </div>
  )
}

export default function ContentPage() {
  return (
    <SectionErrorBoundary sectionName="content">
      <CinematicSectionIntro
        sectionTitle="BROADCAST TV"
        contextLabel="MARKET OVERVIEW, USA"
        drScoopHeadline="Streaming is eating primetime share — but live sports and event TV are the last linear moat"
        thumbnailStrip={CINEMATIC_THUMBS}
        onEnter={() => {}}
        sessionKey="content-market"
        backdropUrl="https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg"
      />
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            title="CONTENT ANALYTICS"
            subtitle="Live viewership data across all networks and platforms"
          />
          <div className="flex items-center gap-3">
            <ExportButton title="Content Analytics" section="CONTENT" />
            <StatusBadges />
          </div>
        </div>
        <KPIStrip />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div
            className="rounded-[var(--radius-card)] p-5"
            style={{
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-dark)',
            }}
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-brand-gold)', fontFamily: 'var(--font-heading)' }}
            >
              VIEWERS VS PRIOR YEAR — 30-DAY ROLLING
            </p>
            <TrendChart />
          </div>
          <div className="flex flex-col gap-4">
            <DrScoopCommentaryCard
              headline="Streaming eating primetime — but slowly"
              body="Linear PUT (Persons Using Television) has declined 4.2pp Y/Y in primetime. The pace of decline has stabilized vs the 2022–23 acceleration. Live sports remain a structural floor — NFL and NBA properties are sustaining HUT levels 18% above the non-sports primetime average."
              variant="insight"
            />
            <DrScoopCommentaryCard
              headline="How to read this chart"
              body="Viewers (teal line) = average minute audience across all metered markets. Prior Year (gold dashed) = same rolling period 52 weeks ago. Gap between the two lines measures the year-over-year trajectory. A narrowing gap signals viewership stabilization."
              variant="how-to-read"
            />
          </div>
        </div>
        <NetworkGrid />
      </div>
    </SectionErrorBoundary>
  )
}

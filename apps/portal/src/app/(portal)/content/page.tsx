'use client'

import { SectionHeader, MetricCard, LiveBadge, SignalBadge, LineChart } from '@sasmaster/ui'
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

function ContentMetricsStrip() {
  const { data, isLoading, isError } = useContentMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError || !data) {
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
      <MetricCard
        label="TOTAL VIEWERS"
        value={formatViewers(data.totalViewers)}
        delta={formatDelta(data.totalViewersDelta)}
        deltaDirection={data.totalViewersDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="SHARE"
        value={`${data.share.toFixed(1)}%`}
        delta={formatDelta(data.shareDelta, 'pp')}
        deltaDirection={data.shareDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="REACH"
        value={formatViewers(data.reach)}
        delta={formatDelta(data.reachDelta)}
        deltaDirection={data.reachDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="AVG MIN AUD"
        value={formatViewers(data.avgMinAud)}
        delta={formatDelta(data.avgMinAudDelta)}
        deltaDirection={data.avgMinAudDelta >= 0 ? 'up' : 'down'}
      />
    </div>
  )
}

function ContentTrendChart() {
  const { data, isLoading } = useAudienceTrend()

  if (isLoading || !data) return <ChartSkeleton height={280} />

  const categories = data.map((d) => d.date.slice(5)) // MM-DD
  const series: Highcharts.SeriesLineOptions[] = [
    {
      type: 'line',
      name: 'Viewers',
      data: data.map((d) => d.viewers),
    },
    {
      type: 'line',
      name: 'Prior Year',
      data: data.map((d) => d.viewersPriorYear),
      dashStyle: 'Dash',
      color: 'var(--color-brand-gold)',
      opacity: 0.7,
    },
  ]

  return <LineChart series={series} categories={categories} height={280} />
}

function ContentStatusBadges() {
  const { data } = useContentMetrics()
  if (!data) return null
  return (
    <div className="flex items-center gap-2">
      {data.isRealTime && <LiveBadge />}
      {data.breakoutThresholdExceeded && <SignalBadge variant="breakout" />}
    </div>
  )
}

export default function ContentPage() {
  return (
    <SectionErrorBoundary sectionName="content">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            title="CONTENT ANALYTICS"
            subtitle="Live viewership data across all networks and platforms"
          />
          <ContentStatusBadges />
        </div>
        <ContentMetricsStrip />
        <ContentTrendChart />
      </div>
    </SectionErrorBoundary>
  )
}

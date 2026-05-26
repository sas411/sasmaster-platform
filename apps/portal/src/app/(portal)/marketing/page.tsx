'use client'

import { SectionHeader, MetricCard } from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { MetricCardSkeleton } from '@/components/skeletons/MetricCardSkeleton'
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton'
import { useCampaignMetrics } from './hooks/useCampaignMetrics'

function fmtLarge(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  return `${(n / 1_000).toFixed(0)}K`
}
function fmtDelta(n: number, suffix = '%'): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}${suffix}`
}

function MarketingMetricsStrip() {
  const { data, isLoading } = useCampaignMetrics()
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <MetricCard
        label="REACH"
        value={fmtLarge(data.reach)}
        delta={fmtDelta(data.reachDelta)}
        deltaDirection={data.reachDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="FREQUENCY"
        value={`${data.frequency.toFixed(1)}x`}
        delta={fmtDelta(data.frequencyDelta, 'x')}
        deltaDirection={data.frequencyDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="EFF. REACH"
        value={fmtLarge(data.effectiveReach)}
        delta={fmtDelta(data.effectiveReachDelta)}
        deltaDirection={data.effectiveReachDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="AUD OVERLAP"
        value={`${data.audienceOverlap.toFixed(1)}%`}
        delta={fmtDelta(data.audienceOverlapDelta, 'pp')}
        deltaDirection={data.audienceOverlapDelta >= 0 ? 'up' : 'down'}
      />
    </div>
  )
}

// Placeholder reach-curve chart while nivo/stream is not yet installed
function ReachCurvePlaceholder() {
  return <ChartSkeleton height={280} />
}

export default function MarketingPage() {
  return (
    <SectionErrorBoundary sectionName="marketing">
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="MARKETING"
          subtitle="Campaign performance, reach curves and audience overlap"
        />
        <MarketingMetricsStrip />
        <ReachCurvePlaceholder />
      </div>
    </SectionErrorBoundary>
  )
}

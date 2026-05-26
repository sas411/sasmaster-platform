'use client'

import { SectionHeader, MetricCard, LineChart } from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { MetricCardSkeleton } from '@/components/skeletons/MetricCardSkeleton'
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton'
import { useAdMetrics } from './hooks/useAdMetrics'
import { useAdRevenueTrend } from './hooks/useAdRevenueTrend'

function fmt(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals })
}
function fmtDelta(n: number, suffix = '%'): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}${suffix}`
}
function fmtRevenue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return `$${(n / 1_000).toFixed(0)}K`
}

function AdMetricsStrip() {
  const { data, isLoading } = useAdMetrics()
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
        label="CPM"
        value={`$${fmt(data.cpm)}`}
        delta={fmtDelta(data.cpmDelta)}
        deltaDirection={data.cpmDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="FILL RATE"
        value={`${fmt(data.fillRate, 1)}%`}
        delta={fmtDelta(data.fillRateDelta, 'pp')}
        deltaDirection={data.fillRateDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="REVENUE"
        value={fmtRevenue(data.revenue)}
        delta={fmtDelta(data.revenueDelta)}
        deltaDirection={data.revenueDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="INV YIELD"
        value={`${(data.inventoryYield * 100).toFixed(0)}%`}
        delta={fmtDelta(data.inventoryYieldDelta * 100, 'pp')}
        deltaDirection={data.inventoryYieldDelta >= 0 ? 'up' : 'down'}
      />
    </div>
  )
}

function AdRevenueChart() {
  const { data, isLoading } = useAdRevenueTrend()
  if (isLoading || !data) return <ChartSkeleton height={280} />

  const categories = data.map((d) => d.date.slice(5))
  const series: Highcharts.SeriesLineOptions[] = [
    { type: 'line', name: 'Revenue', data: data.map((d) => d.revenue) },
    {
      type: 'line',
      name: 'Prior Year',
      data: data.map((d) => d.revenuePriorYear),
      dashStyle: 'Dash',
      color: 'var(--color-brand-gold)',
      opacity: 0.7,
    },
  ]
  return <LineChart series={series} categories={categories} height={280} />
}

export default function AdvertisingPage() {
  return (
    <SectionErrorBoundary sectionName="advertising">
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="ADVERTISING"
          subtitle="Ad performance, CPM trends, fill rates and revenue signals"
        />
        <AdMetricsStrip />
        <AdRevenueChart />
      </div>
    </SectionErrorBoundary>
  )
}

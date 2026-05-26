'use client'

import { SectionHeader, MetricCard, LineChart } from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { MetricCardSkeleton } from '@/components/skeletons/MetricCardSkeleton'
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton'
import { useCpgMetrics } from './hooks/useCpgMetrics'
import { useDemographics } from './hooks/useDemographics'

// CPG signal color — purple per spec
const CPG_PURPLE = '#8B5CF6'

function fmtLarge(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  return `${(n / 1_000).toFixed(0)}K`
}
function fmtDelta(n: number, suffix = '%'): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}${suffix}`
}

function CpgMetricsStrip() {
  const { data, isLoading } = useCpgMetrics()
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
        label="TUT"
        value={`${data.tut.toFixed(1)}min`}
        delta={fmtDelta(data.tutDelta, 'min')}
        deltaDirection={data.tutDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="PUT"
        value={`${data.put.toFixed(1)}%`}
        delta={fmtDelta(data.putDelta, 'pp')}
        deltaDirection={data.putDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="AUD SIZE"
        value={fmtLarge(data.audienceSize)}
        delta={fmtDelta(data.audienceSizeDelta)}
        deltaDirection={data.audienceSizeDelta >= 0 ? 'up' : 'down'}
      />
      <MetricCard
        label="COMP INDEX"
        value={`${data.compositionIndex}`}
        delta={fmtDelta(data.compositionIndexDelta, 'pts')}
        deltaDirection={data.compositionIndexDelta >= 0 ? 'up' : 'down'}
      />
    </div>
  )
}

function DemographicsChart() {
  const { data, isLoading } = useDemographics()
  if (isLoading || !data) return <ChartSkeleton height={280} />

  const categories = data.map((d) => d.label)
  const series: Highcharts.SeriesLineOptions[] = [
    {
      type: 'line',
      name: 'Audience %',
      data: data.map((d) => d.value),
      color: CPG_PURPLE,
    },
    {
      type: 'line',
      name: 'Composition Index',
      data: data.map((d) => d.index),
      color: CPG_PURPLE,
      dashStyle: 'Dash',
      opacity: 0.6,
    },
  ]
  return <LineChart series={series} categories={categories} height={280} />
}

export default function CpgPage() {
  return (
    <SectionErrorBoundary sectionName="cpg">
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="CPG"
          subtitle="TUT, PUT, audience demographics and composition index"
        />
        <CpgMetricsStrip />
        <DemographicsChart />
      </div>
    </SectionErrorBoundary>
  )
}

import { SectionHeader, MetricCard } from '@sasmaster/ui'

export default function ContentPage() {
  return (
    <div>
      <SectionHeader
        title="CONTENT ANALYTICS"
        subtitle="Live viewership data across all networks and platforms"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="TOTAL VIEWERS" value="311.2M" delta="+0.8%" deltaDirection="up" />
        <MetricCard label="SHARE" value="12.4%" delta="-1.2pp" deltaDirection="down" />
        <MetricCard label="REACH" value="89.7M" />
        <MetricCard label="AVG MIN AUD" value="4.2M" delta="+3.1%" deltaDirection="up" />
      </div>
    </div>
  )
}

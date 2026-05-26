import { SectionHeader, MetricCard } from '@sasmaster/ui'

export default function MarketingPage() {
  return (
    <div>
      <SectionHeader
        title="MARKETING ANALYTICS"
        subtitle="Campaign performance, brand lift, and attribution"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="BRAND LIFT" value="+8.2pts" delta="+1.4pts" deltaDirection="up" />
        <MetricCard label="CAMPAIGN REACH" value="42.1M" />
        <MetricCard label="FREQUENCY" value="4.8x" delta="+0.6x" deltaDirection="up" />
        <MetricCard label="COST PER REACH" value="$1.24" delta="-$0.12" deltaDirection="up" />
      </div>
    </div>
  )
}

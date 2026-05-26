import { SectionHeader, MetricCard } from '@sasmaster/ui'

export default function AdvertisingPage() {
  return (
    <div>
      <SectionHeader
        title="ADVERTISING INTELLIGENCE"
        subtitle="Spot market, scatter, and upfront performance"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="SCATTER CPM" value="$28.40" delta="+4.2%" deltaDirection="up" />
        <MetricCard label="UPFRONT VOLUME" value="$12.8B" />
        <MetricCard label="AVAIL RATE" value="94.1%" delta="-1.8pp" deltaDirection="down" />
        <MetricCard label="FILL RATE" value="88.7%" delta="+2.3pp" deltaDirection="up" />
      </div>
    </div>
  )
}

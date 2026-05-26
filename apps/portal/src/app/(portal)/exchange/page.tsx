import { SectionHeader, MetricCard } from '@sasmaster/ui'

export default function ExchangePage() {
  return (
    <div>
      <SectionHeader
        title="EXCHANGE"
        subtitle="Content licensing, deals, and distribution intelligence"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="ACTIVE DEALS" value="847" delta="+23" deltaDirection="up" />
        <MetricCard label="DEAL VALUE" value="$4.2B" delta="+8.1%" deltaDirection="up" />
        <MetricCard label="LICENSED TITLES" value="12,840" />
        <MetricCard label="AVG DEAL SIZE" value="$4.96M" delta="-2.1%" deltaDirection="down" />
      </div>
    </div>
  )
}

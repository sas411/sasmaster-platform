import { SectionHeader, MetricCard } from '@sasmaster/ui'

export default function CpgPage() {
  return (
    <div>
      <SectionHeader
        title="CPG INTELLIGENCE"
        subtitle="Consumer packaged goods advertising and sales lift"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="SALES LIFT" value="+12.4%" delta="+2.1pp" deltaDirection="up" />
        <MetricCard label="ROAS" value="3.8x" delta="+0.4x" deltaDirection="up" />
        <MetricCard label="SHARE OF VOICE" value="18.2%" />
        <MetricCard label="NEW BUYERS" value="2.4M" delta="+18%" deltaDirection="up" />
      </div>
    </div>
  )
}

// shadcn primitives
export { Button, buttonVariants } from './components/ui/button'
export type { ButtonProps } from './components/ui/button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card'
export { Badge, badgeVariants } from './components/ui/badge'
export type { BadgeProps } from './components/ui/badge'
export { Input } from './components/ui/input'
export type { InputProps } from './components/ui/input'
export { Separator } from './components/ui/separator'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'

// SaSMaster dark cinematic
export { NavBar } from './components/sasmster/NavBar'
export { MetricCard } from './components/sasmster/MetricCard'
export { SectionHeader } from './components/sasmster/SectionHeader'

// Light operational
export { MetricReadout } from './components/light/MetricReadout'
export { LiveBadge } from './components/light/LiveBadge'
export { SignalBadge } from './components/light/SignalBadge'
export { FilterChip } from './components/light/FilterChip'

// Charts
export { HighchartsProvider } from './components/charts/highcharts-provider'
export { LineChart } from './components/charts/LineChart'

// Dr. Scoop
export { DrScoop } from './components/dr-scoop/DrScoop'
export { DrScoopPanel } from './components/dr-scoop/DrScoopPanel'
export { DrScoopCommentaryCard } from './components/dr-scoop/DrScoopCommentaryCard'
export type { DrScoopCommentaryCardProps, CommentaryVariant } from './components/dr-scoop/DrScoopCommentaryCard'
export { useDrScoopRuntime } from './hooks/useDrScoopRuntime'

// KPI
export { KPICard } from './components/kpi/KPICard'
export type { KPICardProps, KPIVariant, DeltaType } from './components/kpi/KPICard'

// Research Portal — Content components
export { TitleHeroCard } from './components/content/TitleHeroCard'
export type { TitleHeroCardProps } from './components/content/TitleHeroCard'
export { CastStrip } from './components/content/CastStrip'
export type { CastStripProps, CastMember } from './components/content/CastStrip'
export { TrailerModal } from './components/content/TrailerModal'
export type { TrailerModalProps } from './components/content/TrailerModal'
export { TabNavBar } from './components/content/TabNavBar'
export type { TabNavBarProps, TabItem } from './components/content/TabNavBar'
export { CinematicSectionIntro } from './components/content/CinematicSectionIntro'
export type { CinematicSectionIntroProps, ThumbnailCard } from './components/content/CinematicSectionIntro'

// Research Portal — Charts (Highcharts)
export { GenreBubbleChart } from './components/charts/GenreBubbleChart'
export type { GenreBubbleChartProps, BubblePoint } from './components/charts/GenreBubbleChart'
export { ViewingHabitsBar } from './components/charts/ViewingHabitsBar'
export type { ViewingHabitsBarProps, ViewingSegmentData } from './components/charts/ViewingHabitsBar'

// Research Portal — Charts (D3)
export { SankeyFlow } from './components/charts/d3/SankeyFlow'
export type { SankeyFlowProps, SankeyNode, SankeyLink } from './components/charts/d3/SankeyFlow'
export { GenreStreamgraph } from './components/charts/d3/GenreStreamgraph'
export type { GenreStreamgraphProps, StreamDataPoint } from './components/charts/d3/GenreStreamgraph'

// Report
export { ExportButton } from './components/report/ExportButton'

// Hover Preview
export { HoverPreviewPanel } from './components/content/HoverPreviewPanel'

// Utilities
export { cn } from './lib/utils'

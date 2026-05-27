// ── Research Portal shared types ──────────────────────────────────────────────

export interface DrScoopCardData {
  headline: string
  body: string
  variant: 'insight' | 'how-to-read'
}

// Network Audience Journey (Tier 2)
export interface SankeyNodeData { id: string; label: string; color?: string }
export interface SankeyLinkData { source: string; target: string; value: number }

export interface NetworkSankeyData {
  nodes: SankeyNodeData[]
  links: SankeyLinkData[]
  columns: string[]
}

export interface StreamWeekPoint {
  week: number
  drama: number
  scifi: number
  comedy: number
  crime: number
  fantasy: number
  thriller: number
  documentary: number
  animation: number
  reality: number
  action: number
  [genre: string]: number
}

export interface ViewingDemoData {
  demo: string
  live: number
  sameDayDvr: number
  ts1to7: number
  svodOtt: number
}

export interface NetworkAudienceData {
  network: string
  networkDisplayName: string
  logoUrl?: string
  sankey: NetworkSankeyData
  streamgraph: StreamWeekPoint[]
  weekLabels: string[]
  viewingHabits: ViewingDemoData[]
  drScoop: [DrScoopCardData, DrScoopCardData]
  updatedAt: string
}

// Show Performance (Tier 2.5)
export interface ShowBubblePoint {
  x: number
  y: number
  z: number
  name: string
  genre: string
  tmdbId?: number
}

export interface ShowBubbleData {
  network: string
  shows: ShowBubblePoint[]
  months: string[]
  monthlyTotal: number[]
  genres: string[]
  colorMap: Record<string, string>
  drScoop: [DrScoopCardData, DrScoopCardData]
}

// Title Detail (Tier 3)
export interface TitleCastMember {
  id: number
  name: string
  character: string
  photoUrl?: string
}

export interface TitleAudienceData {
  c3Rating: number
  liveViewers: number
  totalViewers: number
  p2549Share: number
  p1849Share: number
}

export interface RelatedShow {
  tmdbId: number
  title: string
  posterUrl?: string
  genres: string[]
  slug: string
}

export interface TitleDetailData {
  tmdbId: number
  title: string
  network: string
  networkSlug: string
  seasons: number
  genres: string[]
  userScore: number
  tagline?: string
  synopsis: string
  backdropUrl: string
  posterUrl?: string
  trailerKey?: string
  cast: TitleCastMember[]
  moodTags: string[]
  audienceData?: TitleAudienceData
  relatedShows: RelatedShow[]
  drScoop: DrScoopCardData
  updatedAt: string
}

// ── Content ───────────────────────────────────────────────────────────────────

export interface ContentMetrics {
  totalViewers: number
  totalViewersDelta: number
  share: number
  shareDelta: number
  reach: number
  reachDelta: number
  avgMinAud: number
  avgMinAudDelta: number
  isRealTime: boolean
  breakoutThresholdExceeded: boolean
  updatedAt: string
}

export interface AudienceTrendPoint {
  date: string
  viewers: number
  viewersPriorYear: number
}

export interface ContentScheduleItem {
  id: string
  title: string
  network: string
  airDate: string
  slot: string
  genre: string
}

// ── Advertising ───────────────────────────────────────────────────────────────

export interface AdvertisingMetrics {
  cpm: number
  cpmDelta: number
  fillRate: number
  fillRateDelta: number
  revenue: number
  revenueDelta: number
  inventoryYield: number
  inventoryYieldDelta: number
  updatedAt: string
}

export interface AdRevenueTrendPoint {
  date: string
  revenue: number
  cpm: number
  revenuePriorYear: number
}

// ── Marketing ─────────────────────────────────────────────────────────────────

export interface MarketingMetrics {
  reach: number
  reachDelta: number
  frequency: number
  frequencyDelta: number
  effectiveReach: number
  effectiveReachDelta: number
  audienceOverlap: number
  audienceOverlapDelta: number
  updatedAt: string
}

export interface CampaignAudiencePoint {
  date: string
  reach: number
  frequency: number
}

// ── CPG ───────────────────────────────────────────────────────────────────────

export interface CpgMetrics {
  tut: number
  tutDelta: number
  put: number
  putDelta: number
  audienceSize: number
  audienceSizeDelta: number
  compositionIndex: number
  compositionIndexDelta: number
  updatedAt: string
}

export interface DemographicSegment {
  label: string
  ageGroup: string
  value: number
  index: number
}

// ── Exchange ──────────────────────────────────────────────────────────────────

export type ListingStatus = 'available' | 'pending' | 'licensed' | 'exclusive'
export type ListingSide = 'buy' | 'sell'

export interface ExchangeListing {
  id: string
  title: string
  network: string
  genre: string
  rightsStatus: ListingStatus
  side: ListingSide
  askingPrice?: number | undefined
  episodes?: number | undefined
  coverImageUrl?: string | undefined
  expiresAt?: string | undefined
}

export interface ExchangeFilters {
  genre?: string | undefined
  network?: string | undefined
  status?: ListingStatus | undefined
  side?: ListingSide | undefined
}

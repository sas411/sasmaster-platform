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

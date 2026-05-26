import type { MarketingMetrics } from '@sasmaster/types'

export function GET() {
  const data: MarketingMetrics = {
    reach: 124_500_000,
    reachDelta: 4.2,
    frequency: 3.7,
    frequencyDelta: -0.2,
    effectiveReach: 98_200_000,
    effectiveReachDelta: 3.8,
    audienceOverlap: 28.4,
    audienceOverlapDelta: 1.1,
    updatedAt: new Date().toISOString(),
  }
  return Response.json(data)
}

import type { ContentMetrics } from '@sasmaster/types'

// Stub data — replace with Railway proxy when /content/metrics endpoint is live
export function GET() {
  const data: ContentMetrics = {
    totalViewers: 311_200_000,
    totalViewersDelta: 0.8,
    share: 12.4,
    shareDelta: -1.2,
    reach: 89_700_000,
    reachDelta: 2.3,
    avgMinAud: 4_200_000,
    avgMinAudDelta: 3.1,
    isRealTime: true,
    breakoutThresholdExceeded: false,
    updatedAt: new Date().toISOString(),
  }
  return Response.json(data)
}

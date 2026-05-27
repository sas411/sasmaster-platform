import type { ContentMetrics } from '@sasmaster/types'
import { getMarketMetrics } from '@/lib/nielsen'

export async function GET() {
  const m = await getMarketMetrics()
  const data: ContentMetrics = {
    totalViewers:              m.totalViewers,
    totalViewersDelta:         m.totalViewersDelta,
    share:                     m.share,
    shareDelta:                m.shareDelta,
    reach:                     m.reach,
    reachDelta:                m.reachDelta,
    avgMinAud:                 m.avgMinAud,
    avgMinAudDelta:            m.avgMinAudDelta,
    isRealTime:                m.isRealTime,
    breakoutThresholdExceeded: false,
    updatedAt:                 new Date().toISOString(),
  }
  return Response.json(data)
}

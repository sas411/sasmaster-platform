import type { CpgMetrics } from '@sasmaster/types'

export function GET() {
  const data: CpgMetrics = {
    tut: 14.2,
    tutDelta: 0.8,
    put: 68.4,
    putDelta: -1.3,
    audienceSize: 42_800_000,
    audienceSizeDelta: 2.9,
    compositionIndex: 127,
    compositionIndexDelta: 4.0,
    updatedAt: new Date().toISOString(),
  }
  return Response.json(data)
}

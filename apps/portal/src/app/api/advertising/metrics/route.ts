import type { AdvertisingMetrics } from '@sasmaster/types'

export function GET() {
  const data: AdvertisingMetrics = {
    cpm: 18.42,
    cpmDelta: 2.3,
    fillRate: 87.6,
    fillRateDelta: -1.4,
    revenue: 4_280_000,
    revenueDelta: 5.7,
    inventoryYield: 0.91,
    inventoryYieldDelta: 0.03,
    updatedAt: new Date().toISOString(),
  }
  return Response.json(data)
}

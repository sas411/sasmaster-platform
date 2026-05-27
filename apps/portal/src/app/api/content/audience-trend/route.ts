import type { AudienceTrendPoint } from '@sasmaster/types'
import { getAudienceTrend } from '@/lib/nielsen'

export async function GET() {
  const data: AudienceTrendPoint[] = await getAudienceTrend()
  return Response.json(data)
}

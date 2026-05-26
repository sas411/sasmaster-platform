import type { AudienceTrendPoint } from '@sasmaster/types'

// Stub 30-day rolling data — replace with Railway proxy when endpoint is live
export function GET() {
  const today = new Date()
  const data: AudienceTrendPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (29 - i))
    const base = 300_000_000 + Math.sin(i * 0.4) * 20_000_000 + i * 500_000
    return {
      date: date.toISOString().split('T')[0]!,
      viewers: Math.round(base),
      viewersPriorYear: Math.round(base * 0.94 + Math.sin(i * 0.3) * 5_000_000),
    }
  })
  return Response.json(data)
}

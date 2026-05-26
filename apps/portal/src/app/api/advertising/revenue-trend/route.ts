import type { AdRevenueTrendPoint } from '@sasmaster/types'

export function GET() {
  const today = new Date()
  const data: AdRevenueTrendPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (29 - i))
    const base = 4_000_000 + Math.sin(i * 0.4) * 400_000 + i * 10_000
    return {
      date: date.toISOString().split('T')[0]!,
      revenue: Math.round(base),
      cpm: parseFloat((17 + Math.sin(i * 0.3) * 2).toFixed(2)),
      revenuePriorYear: Math.round(base * 0.93),
    }
  })
  return Response.json(data)
}

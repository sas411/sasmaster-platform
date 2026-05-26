import type { DemographicSegment } from '@sasmaster/types'

export function GET() {
  const data: DemographicSegment[] = [
    { label: '18–24', ageGroup: '18-24', value: 12.4, index: 88 },
    { label: '25–34', ageGroup: '25-34', value: 18.7, index: 114 },
    { label: '35–44', ageGroup: '35-44', value: 22.1, index: 127 },
    { label: '45–54', ageGroup: '45-54', value: 24.3, index: 139 },
    { label: '55–64', ageGroup: '55-64', value: 14.8, index: 108 },
    { label: '65+', ageGroup: '65+', value: 7.7, index: 82 },
  ]
  return Response.json(data)
}

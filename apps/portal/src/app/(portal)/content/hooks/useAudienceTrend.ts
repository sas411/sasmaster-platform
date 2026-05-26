'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AudienceTrendPoint } from '@sasmaster/types'

export function useAudienceTrend() {
  return useQuery<AudienceTrendPoint[]>({
    queryKey: ['content', 'audience-trend'],
    queryFn: ({ signal }) => api.get<AudienceTrendPoint[]>('/api/content/audience-trend', signal),
  })
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AdRevenueTrendPoint } from '@sasmaster/types'

export function useAdRevenueTrend() {
  return useQuery<AdRevenueTrendPoint[]>({
    queryKey: ['advertising', 'revenue-trend'],
    queryFn: ({ signal }) => api.get<AdRevenueTrendPoint[]>('/api/advertising/revenue-trend', signal),
  })
}

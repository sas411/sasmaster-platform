'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AdvertisingMetrics } from '@sasmaster/types'

export function useAdMetrics() {
  return useQuery<AdvertisingMetrics>({
    queryKey: ['advertising', 'metrics'],
    queryFn: ({ signal }) => api.get<AdvertisingMetrics>('/api/advertising/metrics', signal),
  })
}

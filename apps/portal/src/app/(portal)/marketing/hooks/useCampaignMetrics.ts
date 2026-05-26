'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { MarketingMetrics } from '@sasmaster/types'

export function useCampaignMetrics() {
  return useQuery<MarketingMetrics>({
    queryKey: ['marketing', 'metrics'],
    queryFn: ({ signal }) => api.get<MarketingMetrics>('/api/marketing/metrics', signal),
  })
}

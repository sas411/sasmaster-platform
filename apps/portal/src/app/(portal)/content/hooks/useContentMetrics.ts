'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ContentMetrics } from '@sasmaster/types'

export function useContentMetrics() {
  return useQuery<ContentMetrics>({
    queryKey: ['content', 'metrics'],
    queryFn: ({ signal }) => api.get<ContentMetrics>('/api/content/metrics', signal),
  })
}

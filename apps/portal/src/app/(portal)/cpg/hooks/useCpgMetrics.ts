'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CpgMetrics } from '@sasmaster/types'

export function useCpgMetrics() {
  return useQuery<CpgMetrics>({
    queryKey: ['cpg', 'metrics'],
    queryFn: ({ signal }) => api.get<CpgMetrics>('/api/cpg/metrics', signal),
  })
}

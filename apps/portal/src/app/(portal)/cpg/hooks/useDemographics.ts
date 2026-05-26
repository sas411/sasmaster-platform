'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DemographicSegment } from '@sasmaster/types'

export function useDemographics() {
  return useQuery<DemographicSegment[]>({
    queryKey: ['cpg', 'demographics'],
    queryFn: ({ signal }) => api.get<DemographicSegment[]>('/api/cpg/demographics', signal),
  })
}

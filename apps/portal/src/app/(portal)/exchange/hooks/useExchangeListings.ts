'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ExchangeListing, ExchangeFilters } from '@sasmaster/types'

export function useExchangeListings(filters: ExchangeFilters = {}) {
  const params = new URLSearchParams()
  if (filters.genre !== undefined) params.set('genre', filters.genre)
  if (filters.network !== undefined) params.set('network', filters.network)
  if (filters.status !== undefined) params.set('status', filters.status)
  if (filters.side !== undefined) params.set('side', filters.side)

  const query = params.toString()
  return useQuery<ExchangeListing[]>({
    queryKey: ['exchange', 'listings', filters],
    queryFn: ({ signal }) =>
      api.get<ExchangeListing[]>(`/api/exchange/listings${query ? `?${query}` : ''}`, signal),
  })
}

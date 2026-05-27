import { useQuery } from '@tanstack/react-query'
import type { NetworkAudienceData } from '@sasmaster/types'

async function fetchNetworkAudience(network: string): Promise<NetworkAudienceData> {
  const res = await fetch(`/api/content/network/${encodeURIComponent(network)}`)
  if (!res.ok) throw new Error(`Network audience fetch failed: ${res.status}`)
  return res.json() as Promise<NetworkAudienceData>
}

export function useNetworkAudience(network: string) {
  return useQuery({
    queryKey: ['network-audience', network],
    queryFn: () => fetchNetworkAudience(network),
    staleTime: 60_000,
  })
}

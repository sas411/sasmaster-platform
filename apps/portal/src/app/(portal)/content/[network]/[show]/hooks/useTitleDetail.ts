import { useQuery } from '@tanstack/react-query'
import type { TitleDetailData } from '@sasmaster/types'

async function fetchTitleDetail(network: string, show: string): Promise<TitleDetailData> {
  const res = await fetch(
    `/api/content/network/${encodeURIComponent(network)}/show/${encodeURIComponent(show)}`,
  )
  if (!res.ok) throw new Error(`Title detail fetch failed: ${res.status}`)
  return res.json() as Promise<TitleDetailData>
}

export function useTitleDetail(network: string, show: string) {
  return useQuery({
    queryKey: ['title-detail', network, show],
    queryFn: () => fetchTitleDetail(network, show),
    staleTime: 300_000,
  })
}

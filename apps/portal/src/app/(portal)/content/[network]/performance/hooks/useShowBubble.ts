import { useQuery } from '@tanstack/react-query'
import type { ShowBubbleData } from '@sasmaster/types'

async function fetchShowBubble(network: string): Promise<ShowBubbleData> {
  const res = await fetch(`/api/content/network/${encodeURIComponent(network)}/performance`)
  if (!res.ok) throw new Error(`Show bubble fetch failed: ${res.status}`)
  return res.json() as Promise<ShowBubbleData>
}

export function useShowBubble(network: string) {
  return useQuery({
    queryKey: ['show-bubble', network],
    queryFn: () => fetchShowBubble(network),
    staleTime: 60_000,
  })
}

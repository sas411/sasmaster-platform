import type { NetworkAudienceData } from '@sasmaster/types'
import { NETWORK_CATALOG } from '@/lib/show-catalog'

function buildSankey(network: string): NetworkAudienceData['sankey'] {
  const suffix = network.toUpperCase().slice(0, 3)
  return {
    columns: ['EARLY MORNING', 'DAYTIME', 'PRIME TIME', 'LATE NIGHT'],
    nodes: [
      { id: 'early-morning', label: 'EARLY MORNING', color: '#a78bfa' },
      { id: 'daytime',       label: 'DAYTIME',       color: '#22d3ee' },
      { id: 'prime-time',    label: 'PRIME TIME',    color: '#f59e0b' },
      { id: 'late-night',    label: 'LATE NIGHT',    color: '#34d399' },
      { id: `${suffix}-em`,    label: network.toUpperCase(), color: '#a78bfa' },
      { id: `${suffix}-day`,   label: network.toUpperCase(), color: '#22d3ee' },
      { id: `${suffix}-prime`, label: network.toUpperCase(), color: '#f59e0b' },
      { id: `${suffix}-late`,  label: network.toUpperCase(), color: '#34d399' },
    ],
    links: [
      { source: `${suffix}-em`,    target: 'early-morning', value: 4_200_000 },
      { source: `${suffix}-day`,   target: 'daytime',       value: 8_900_000 },
      { source: `${suffix}-prime`, target: 'prime-time',    value: 18_400_000 },
      { source: `${suffix}-late`,  target: 'late-night',    value: 6_100_000 },
      { source: 'early-morning', target: 'daytime',     value: 2_800_000 },
      { source: 'daytime',       target: 'prime-time',  value: 5_200_000 },
      { source: 'prime-time',    target: 'late-night',  value: 3_700_000 },
    ],
  }
}

function buildStreamgraph(): NetworkAudienceData['streamgraph'] {
  return Array.from({ length: 13 }, (_, i) => ({
    week: i,
    drama: 18 + Math.sin(i * 0.5) * 4, scifi: 12 + Math.cos(i * 0.4) * 3,
    comedy: 15 + Math.sin(i * 0.3 + 1) * 5, crime: 14 + Math.cos(i * 0.6) * 2,
    fantasy: 8 + Math.sin(i * 0.7) * 3, thriller: 10 + Math.cos(i * 0.5 + 2) * 2,
    documentary: 6 + Math.sin(i * 0.4) * 2, animation: 7 + Math.cos(i * 0.3) * 2,
    reality: 9 + Math.sin(i * 0.6 + 1) * 3, action: 11 + Math.cos(i * 0.4 + 1) * 2,
  }))
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ network: string }> },
) {
  const { network } = await params
  const netKey      = network.toLowerCase()
  const catalog     = NETWORK_CATALOG[netKey]
  const displayName = catalog?.displayName ?? network.toUpperCase()

  const data: NetworkAudienceData = {
    network:            netKey,
    networkDisplayName: displayName,
    sankey:             buildSankey(network),
    streamgraph:        buildStreamgraph(),
    weekLabels:         Array.from({ length: 13 }, (_, i) => `W${i + 1}`),
    viewingHabits: [
      { demo: 'P2-17',   live: 28, sameDayDvr: 12, ts1to7: 38, svodOtt: 22 },
      { demo: 'P18-34',  live: 31, sameDayDvr: 14, ts1to7: 32, svodOtt: 23 },
      { demo: 'P25-54',  live: 42, sameDayDvr: 18, ts1to7: 26, svodOtt: 14 },
      { demo: 'P35-64',  live: 51, sameDayDvr: 20, ts1to7: 20, svodOtt:  9 },
      { demo: 'P55+',    live: 62, sameDayDvr: 22, ts1to7: 12, svodOtt:  4 },
      { demo: 'HH-Kids', live: 19, sameDayDvr:  8, ts1to7: 45, svodOtt: 28 },
    ],
    drScoop: [
      {
        headline: `${displayName} primetime leads broadcast with 18.4M viewers`,
        body: `Live+SD viewers surged 12% over the prior four-week average. Drama blocks are driving the lift — the 9PM hour is beating the full-season trend by 8pp. Fragmented streaming competition is intensifying but linear primetime holds its ground on event programming.`,
        variant: 'insight',
      },
      {
        headline: 'How to read this flow diagram',
        body: `Each band represents audience volume moving through dayparts. Band width = average minute audience. Networks with the widest primetime band are capturing the most linear share in the key 8–11PM window.`,
        variant: 'how-to-read',
      },
    ],
    updatedAt: new Date().toISOString(),
  }

  return Response.json(data)
}

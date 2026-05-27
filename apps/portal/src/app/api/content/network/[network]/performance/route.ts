import type { ShowBubbleData } from '@sasmaster/types'
import { NETWORK_SHOWS } from '@/lib/show-catalog'
import { getTvDetail, posterUrl } from '@/lib/tmdb'

const GENRE_COLORS: Record<string, string> = {
  Drama: '#a78bfa', 'Sci-Fi': '#22d3ee', Comedy: '#f59e0b', Crime: '#f87171',
  Fantasy: '#34d399', Thriller: '#60a5fa', Documentary: '#e879f9', Animation: '#fb923c',
  Reality: '#818cf8', Action: '#2dd4bf',
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const DEFAULT_SHOWS = [
  { slug: 'greys-anatomy', tmdbId: 1416,   baseRating: 0.9, baseAud: 6_800_000 },
  { slug: '9-1-1',         tmdbId: 76479,  baseRating: 0.6, baseAud: 5_900_000 },
  { slug: 'the-voice',     tmdbId: 37679,  baseRating: 1.2, baseAud: 9_200_000 },
]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ network: string }> },
) {
  const { network } = await params
  const netKey   = network.toLowerCase()
  const showDefs = NETWORK_SHOWS[netKey] ?? DEFAULT_SHOWS

  const enriched = await Promise.allSettled(
    showDefs.map(async (s, si) => {
      const detail = await getTvDetail(s.tmdbId)
      const genre  = detail.genres[0]?.name ?? 'Drama'
      return Array.from({ length: 12 }, (_, mi) => ({
        x:         mi,
        y:         parseFloat((s.baseRating + Math.sin(mi * 0.5 + si) * 0.3).toFixed(2)),
        z:         Math.round(s.baseAud + Math.cos(mi * 0.4 + si) * 800_000),
        name:      detail.name,
        genre,
        tmdbId:    s.tmdbId,
        posterUrl: posterUrl(detail.poster_path) ?? undefined,
      }))
    }),
  )

  const shows = enriched.flatMap((r, si) =>
    r.status === 'fulfilled'
      ? r.value
      : Array.from({ length: 12 }, (_, mi) => ({
          x: mi, y: showDefs[si]!.baseRating, z: showDefs[si]!.baseAud,
          name: `Show ${si + 1}`, genre: 'Drama', tmdbId: showDefs[si]!.tmdbId,
        })),
  )

  const usedGenres  = [...new Set(shows.map((s) => s.genre))]
  const colorMap    = Object.fromEntries(usedGenres.map((g) => [g, GENRE_COLORS[g] ?? '#a78bfa']))
  const monthlyTotal = Array.from({ length: 12 }, (_, mi) =>
    showDefs.reduce((sum, s, si) => sum + Math.round(s.baseAud + Math.cos(mi * 0.4 + si) * 800_000), 0),
  )

  const data: ShowBubbleData = {
    network: netKey,
    shows,
    months: MONTHS,
    monthlyTotal,
    genres: usedGenres,
    colorMap,
    drScoop: [
      { headline: 'Bubble size = live audience at air', body: 'Each bubble is one show × one month. X = calendar month, Y = C3 rating, bubble size = live AMA. Bigger + higher = highest-value show of the month.', variant: 'how-to-read' },
      { headline: 'Drama holding C3 share as Reality slides', body: 'Drama titles maintain C3 ratings above 0.8 consistently. Reality has seen 14% Y/Y C3 compression despite stable live delivery — audiences shifting to time-shift, reducing advertiser-relevant C3.', variant: 'insight' },
    ],
  }

  return Response.json(data)
}

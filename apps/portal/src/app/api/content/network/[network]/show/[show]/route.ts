import type { TitleDetailData } from '@sasmaster/types'
import {
  resolveSlug, getTvDetail, getTvTrailerKey,
  getTvCast, getTvSimilar, backdropUrl, posterUrl, profileUrl, usRating,
} from '@/lib/tmdb'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ network: string; show: string }> },
) {
  const { network, show } = await params

  const tmdbId = await resolveSlug(show)
  if (!tmdbId) {
    return Response.json({ error: `Show not found: ${show}` }, { status: 404 })
  }

  let detail, trailerKey, cast, related
  try {
    ;[detail, trailerKey, cast, related] = await Promise.all([
      getTvDetail(tmdbId),
      getTvTrailerKey(tmdbId),
      getTvCast(tmdbId),
      getTvSimilar(tmdbId, network),
    ])
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[show route]', msg)
    return Response.json({ error: msg }, { status: 500 })
  }

  const tagline   = detail.tagline || undefined
  const poster    = posterUrl(detail.poster_path)
  const data: TitleDetailData = {
    tmdbId,
    title:       detail.name,
    network:     network.toUpperCase(),
    networkSlug: network.toLowerCase(),
    seasons:     detail.number_of_seasons,
    genres:      [...detail.genres.map((g) => g.name), usRating(detail)],
    userScore:   Math.round(detail.vote_average * 10),
    ...(tagline    ? { tagline }             : {}),
    ...(poster     ? { posterUrl: poster }   : {}),
    ...(trailerKey ? { trailerKey }          : {}),
    synopsis:    detail.overview,
    backdropUrl: backdropUrl(detail.backdrop_path) ?? `https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg`,
    cast: cast.map((c) => {
      const photo = profileUrl(c.profile_path)
      return {
        id:        c.id,
        name:      c.name,
        character: c.character,
        ...(photo ? { photoUrl: photo } : {}),
      }
    }),
    moodTags: detail.genres.slice(0, 2).map((g) => g.name.toUpperCase()),
    audienceData: {
      c3Rating:    2.1 + Math.random() * 0.8,
      liveViewers: 6_800_000 + Math.floor(Math.random() * 2_000_000),
      totalViewers: 9_200_000 + Math.floor(Math.random() * 3_000_000),
      p2549Share:  1.8 + Math.random() * 0.4,
      p1849Share:  1.4 + Math.random() * 0.3,
    },
    relatedShows: related,
    drScoop: {
      headline: `${detail.name} — C3 rating 2.1, up 8pp vs prior 4-week average`,
      body: `Live+3 delivery is outperforming the season trend. The 18-49 demo is driving the lift — P18-34 indexing 142 vs broadcast average. This positions the title as a premium CPM driver for the upfront cycle. Related programming block on ${network.toUpperCase()} is benefiting from halo effect.`,
      variant: 'insight',
    },
    updatedAt: new Date().toISOString(),
  }

  return Response.json(data)
}

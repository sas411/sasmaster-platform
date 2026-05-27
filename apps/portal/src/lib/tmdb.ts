// Server-side TMDB v3 client — never import in client components.
// Uses TMDB_ACCESS_TOKEN (v4 Bearer) for all requests.

const BASE = 'https://api.themoviedb.org/3'
const IMG  = 'https://image.tmdb.org/t/p'

function headers() {
  return {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: 'application/json',
  }
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

interface TmdbTvDetail {
  id: number
  name: string
  tagline: string
  overview: string
  number_of_seasons: number
  vote_average: number
  genres: Array<{ id: number; name: string }>
  backdrop_path: string | null
  poster_path: string | null
  content_ratings?: { results: Array<{ iso_3166_1: string; rating: string }> }
}

interface TmdbVideo {
  key: string
  site: string
  type: string
  official: boolean
}

interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface TmdbSimilarResult {
  id: number
  name: string
  poster_path: string | null
  genre_ids: number[]
}

const GENRE_NAMES: Record<number, string> = {
  10759: 'Action', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids',
  9648: 'Mystery', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi',
  10766: 'Soap', 10767: 'Talk', 10768: 'War', 37: 'Western',
  27: 'Horror', 10749: 'Romance', 53: 'Thriller', 14: 'Fantasy',
}

export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  return path ? `${IMG}/${size}${path}` : null
}

export function posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342') {
  return path ? `${IMG}/${size}${path}` : null
}

export function profileUrl(path: string | null) {
  return path ? `${IMG}/w185${path}` : null
}

export async function getTvDetail(tmdbId: number) {
  return tmdbFetch<TmdbTvDetail>(`/tv/${tmdbId}`)
}

export async function getTvTrailerKey(tmdbId: number): Promise<string | null> {
  const data = await tmdbFetch<{ results: TmdbVideo[] }>(`/tv/${tmdbId}/videos`)
  const trailer =
    data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
    data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer')
  return trailer?.key ?? null
}

export async function getTvCast(tmdbId: number) {
  const data = await tmdbFetch<{ cast: TmdbCastMember[] }>(`/tv/${tmdbId}/credits`)
  return data.cast.slice(0, 8)
}

export async function getTvSimilar(tmdbId: number, networkSlug: string) {
  const data = await tmdbFetch<{ results: TmdbSimilarResult[] }>(`/tv/${tmdbId}/similar`)
  return data.results.slice(0, 6).map((s) => {
    const poster = posterUrl(s.poster_path)
    return {
      tmdbId:     s.id,
      title:      s.name,
      ...(poster ? { posterUrl: poster } : {}),
      genres:     s.genre_ids.slice(0, 2).map((id) => GENRE_NAMES[id] ?? 'Drama'),
      slug:       s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      networkSlug,
    }
  })
}

export async function searchTv(query: string): Promise<number | null> {
  const data = await tmdbFetch<{ results: Array<{ id: number }> }>(
    `/search/tv?query=${encodeURIComponent(query)}&page=1`,
  )
  return data.results[0]?.id ?? null
}

export async function resolveSlug(slug: string): Promise<number | null> {
  const { SHOW_TMDB_IDS } = await import('./show-catalog')
  if (SHOW_TMDB_IDS[slug]) return SHOW_TMDB_IDS[slug]!
  const humanName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return searchTv(humanName)
}

export function usRating(detail: TmdbTvDetail): string {
  const us = detail.content_ratings?.results.find((r) => r.iso_3166_1 === 'US')
  return us?.rating ?? 'TV-14'
}

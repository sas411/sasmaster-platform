import { resolveSlug, getTvDetail, getTvTrailerKey, backdropUrl } from '@/lib/tmdb'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ show: string }> },
) {
  try {
    const { show } = await params
    const tmdbId = await resolveSlug(show)

    if (!tmdbId) return Response.json({ backdropUrl: null, trailerKey: null })

    const [detail, trailerKey] = await Promise.all([
      getTvDetail(tmdbId),
      getTvTrailerKey(tmdbId),
    ])

    return Response.json({
      backdropUrl: backdropUrl(detail.backdrop_path),
      trailerKey,
      title: detail.name,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[intro route]', msg)
    return Response.json({ error: msg }, { status: 500 })
  }
}

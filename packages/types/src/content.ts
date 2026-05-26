export type ContentType = 'movie' | 'series' | 'episode' | 'sport' | 'news'

export interface ContentItem {
  id: string
  title: string
  type: ContentType
  network?: string
  imdbId?: string
  tmdbId?: number
}

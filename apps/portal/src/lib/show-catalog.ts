export const SHOW_TMDB_IDS: Record<string, number> = {
  'the-last-of-us':           100088,
  'house-of-the-dragon':       94997,
  'succession':                63174,
  'the-white-lotus':          110316,
  'barry':                     70264,
  'greys-anatomy':              1416,
  'dancing-with-the-stars':   10589,
  '9-1-1':                    76479,
  'american-idol':              1371,
  'abbott-elementary':        110145,
  'the-voice':                 37679,
  'law-and-order':              4601,
  'chicago-fire':              61818,
  'chicago-pd':                67178,
  'lopez-vs-lopez':           201222,
}

export const NETWORK_CATALOG: Record<string, { displayName: string; tmdbNetworkId: number }> = {
  nbc:     { displayName: 'NBC',     tmdbNetworkId: 6   },
  abc:     { displayName: 'ABC',     tmdbNetworkId: 2   },
  cbs:     { displayName: 'CBS',     tmdbNetworkId: 16  },
  fox:     { displayName: 'FOX',     tmdbNetworkId: 19  },
  hbo:     { displayName: 'HBO',     tmdbNetworkId: 49  },
  netflix: { displayName: 'Netflix', tmdbNetworkId: 213 },
  hulu:    { displayName: 'Hulu',    tmdbNetworkId: 453 },
  espn:    { displayName: 'ESPN',    tmdbNetworkId: 29  },
  fx:      { displayName: 'FX',      tmdbNetworkId: 88  },
}

export const NETWORK_SHOWS: Record<string, Array<{ slug: string; tmdbId: number; baseRating: number; baseAud: number }>> = {
  nbc: [
    { slug: 'the-voice',       tmdbId: 37679,  baseRating: 1.2, baseAud: 9_200_000 },
    { slug: 'law-and-order',   tmdbId: 4601,   baseRating: 0.8, baseAud: 6_800_000 },
    { slug: 'chicago-fire',    tmdbId: 61818,  baseRating: 0.7, baseAud: 7_100_000 },
    { slug: 'chicago-pd',      tmdbId: 67178,  baseRating: 0.6, baseAud: 6_200_000 },
    { slug: 'lopez-vs-lopez',  tmdbId: 201222, baseRating: 0.4, baseAud: 4_100_000 },
  ],
  abc: [
    { slug: 'greys-anatomy',          tmdbId: 1416,   baseRating: 0.9, baseAud: 6_800_000 },
    { slug: 'dancing-with-the-stars', tmdbId: 10589,  baseRating: 0.7, baseAud: 6_200_000 },
    { slug: '9-1-1',                  tmdbId: 76479,  baseRating: 0.6, baseAud: 5_900_000 },
    { slug: 'american-idol',          tmdbId: 1371,   baseRating: 0.7, baseAud: 5_400_000 },
    { slug: 'abbott-elementary',      tmdbId: 110145, baseRating: 0.8, baseAud: 5_100_000 },
  ],
  hbo: [
    { slug: 'the-last-of-us',       tmdbId: 100088, baseRating: 2.1, baseAud: 8_200_000 },
    { slug: 'succession',            tmdbId: 63174,  baseRating: 1.8, baseAud: 4_800_000 },
    { slug: 'house-of-the-dragon',   tmdbId: 94997,  baseRating: 2.4, baseAud: 9_300_000 },
    { slug: 'the-white-lotus',       tmdbId: 110316, baseRating: 1.6, baseAud: 3_900_000 },
    { slug: 'barry',                 tmdbId: 70264,  baseRating: 1.2, baseAud: 2_800_000 },
  ],
}

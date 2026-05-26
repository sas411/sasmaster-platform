import type { ExchangeListing } from '@sasmaster/types'

export function GET() {
  const data: ExchangeListing[] = [
    { id: 'e1', title: 'Primetime Drama S3', network: 'NBC', genre: 'Drama', rightsStatus: 'available', side: 'sell', askingPrice: 2_400_000, episodes: 22 },
    { id: 'e2', title: 'Reality Competition Block', network: 'FOX', genre: 'Reality', rightsStatus: 'available', side: 'buy', episodes: 10 },
    { id: 'e3', title: 'Docuseries: True Crime', network: 'HBO', genre: 'Documentary', rightsStatus: 'pending', side: 'sell', askingPrice: 800_000, episodes: 6 },
    { id: 'e4', title: 'Sports Highlights Package', network: 'ESPN', genre: 'Sports', rightsStatus: 'licensed', side: 'buy', episodes: 52 },
    { id: 'e5', title: 'Late Night Comedy Vault', network: 'NBC', genre: 'Comedy', rightsStatus: 'available', side: 'sell', askingPrice: 320_000, episodes: 104 },
    { id: 'e6', title: 'Kids Animation Library', network: 'CARTOON', genre: 'Animation', rightsStatus: 'exclusive', side: 'sell', askingPrice: 5_100_000, episodes: 156 },
    { id: 'e7', title: 'Medical Drama Reboot', network: 'ABC', genre: 'Drama', rightsStatus: 'available', side: 'buy', episodes: 18 },
    { id: 'e8', title: 'Nature Documentary 4K', network: 'NatGeo', genre: 'Documentary', rightsStatus: 'pending', side: 'sell', askingPrice: 1_200_000, episodes: 8 },
  ]
  return Response.json(data)
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import {
  Bebas_Neue,
  Barlow_Condensed,
  Share_Tech_Mono,
  DM_Sans,
  DM_Mono,
  Space_Grotesk,
  Inter,
  JetBrains_Mono,
} from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SaSMaster Portal',
  description: 'Media analytics intelligence platform',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        bebasNeue.variable,
        barlowCondensed.variable,
        shareTechMono.variable,
        dmSans.variable,
        dmMono.variable,
        spaceGrotesk.variable,
        inter.variable,
        jetbrainsMono.variable,
      ].join(' ')}
    >
      <body style={{ background: 'var(--color-bg-base)' }}>{children}</body>
    </html>
  )
}

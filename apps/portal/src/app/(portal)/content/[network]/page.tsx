'use client'

import { use, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import {
  SankeyFlow,
  GenreStreamgraph,
  ViewingHabitsBar,
  DrScoopCommentaryCard,
  CinematicSectionIntro,
  ExportButton,
} from '@sasmaster/ui'
import { SectionErrorBoundary } from '@/components/SectionErrorBoundary'
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton'
import { useNetworkAudience } from './hooks/useNetworkAudience'

const CINEMATIC_THUMBS = (_network: string) => [
  { label: 'AUDIENCE JOURNEY', stillUrl: `https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg`, value: 'Daypart Flow' },
  { label: 'GENRE TRENDS', stillUrl: `https://image.tmdb.org/t/p/w500/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg`, value: '13-Week Rolling' },
  { label: 'VIEWING HABITS', stillUrl: `https://image.tmdb.org/t/p/w500/clnyhPqj1SNgpAdeSS6a6fwE6Bo.jpg`, value: 'Live vs OTT' },
]

function NetworkAudienceContent({ network }: { network: string }) {
  const router = useRouter()
  const { data, isLoading, isError } = useNetworkAudience(network)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <ChartSkeleton height={320} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeleton height={280} />
          <ChartSkeleton height={280} />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p style={{ color: 'var(--color-brand-coral)', fontFamily: 'var(--font-body)' }}>
        Failed to load audience data for {network.toUpperCase()}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Network header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/content')}
            className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-brand-teal)', fontFamily: 'var(--font-heading)' }}
          >
            ← ALL NETWORKS
          </button>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px',
              color: 'var(--color-text-dark-primary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {data.networkDisplayName}
          </h1>
          <p
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-heading)' }}
          >
            AUDIENCE JOURNEY — DAYPART FLOW
          </p>
        </div>
        <button
          onClick={() => router.push(`/content/${network}/performance`)}
          className="rounded-[var(--radius-btn)] px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-80"
          style={{
            background: 'var(--color-brand-lavender-dim)',
            border: '1px solid rgba(167,139,250,0.3)',
            color: 'var(--color-brand-lavender)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          SHOW PERFORMANCE →
        </button>
        <ExportButton title={data.networkDisplayName} section="NETWORK AUDIENCE" />
      </div>

      {/* Sankey — full width */}
      <div
        className="rounded-[var(--radius-card)] p-6"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-dark)',
        }}
      >
        <p
          className="mb-4 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-brand-gold)', fontFamily: 'var(--font-heading)' }}
        >
          DAYPART AUDIENCE FLOW
        </p>
        <SankeyFlow
          nodes={data.sankey.nodes}
          links={data.sankey.links}
          columns={data.sankey.columns}
          height={300}
        />
      </div>

      {/* Bottom row: Streamgraph + Habits + Dr. Scoop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_300px]">
        {/* Genre Streamgraph */}
        <div
          className="rounded-[var(--radius-card)] p-5"
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-dark)',
          }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-brand-gold)', fontFamily: 'var(--font-heading)' }}
          >
            GENRE TRENDS — 13 WEEKS
          </p>
          <GenreStreamgraph
            data={data.streamgraph}
            genres={['drama', 'scifi', 'comedy', 'crime', 'fantasy', 'thriller', 'documentary', 'animation', 'reality', 'action']}
            weekLabels={data.weekLabels}
            height={260}
          />
        </div>

        {/* Viewing Habits */}
        <div
          className="rounded-[var(--radius-card)] p-5"
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-dark)',
          }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-brand-gold)', fontFamily: 'var(--font-heading)' }}
          >
            VIEWING HABITS BY DEMO
          </p>
          <ViewingHabitsBar
            data={data.viewingHabits}
            height={260}
          />
        </div>

        {/* Dr. Scoop right rail */}
        <div className="flex flex-col gap-4">
          {data.drScoop.map((card, i) => (
            <DrScoopCommentaryCard
              key={i}
              headline={card.headline}
              body={card.body}
              variant={card.variant}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NetworkPage({
  params,
}: {
  params: Promise<{ network: string }>
}) {
  const { network } = use(params)

  return (
    <SectionErrorBoundary sectionName="network-audience">
      <CinematicSectionIntro
        sectionTitle={network.toUpperCase()}
        contextLabel="NETWORK PROFILE, USA"
        drScoopHeadline="Primetime is where audiences concentrate — but daytime loyalty is what builds brand"
        thumbnailStrip={CINEMATIC_THUMBS(network)}
        onEnter={() => {}}
        sessionKey={`network-${network}`}
        backdropUrl="https://image.tmdb.org/t/p/w1280/uDgy6hyPd82kOHh6I95iiE7iaaN.jpg"
      />
      <Suspense
        fallback={
          <div className="flex flex-col gap-6">
            <ChartSkeleton height={320} />
          </div>
        }
      >
        <NetworkAudienceContent network={network} />
      </Suspense>
    </SectionErrorBoundary>
  )
}

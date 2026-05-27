'use client'

import * as React from 'react'
import { useEffect, useRef, useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import type { Options } from 'highcharts'

// Register highcharts-more for bubble chart support (idempotent, lazy)
let _moreLoaded = false
function ensureHighchartsMore() {
  if (_moreLoaded) return
  _moreLoaded = true
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const HighchartsMore = require('highcharts/highcharts-more') as unknown
  if (typeof HighchartsMore === 'function') (HighchartsMore as (hc: typeof Highcharts) => void)(Highcharts)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else if ((HighchartsMore as any)?.default) (HighchartsMore as any).default(Highcharts)
}

interface BubblePoint {
  x: number
  y: number
  z: number
  name: string
  genre: string
}

interface GenreBubbleChartProps {
  data: BubblePoint[]
  colorMap: Record<string, string>
  xCategories: string[]
  title?: string
  height?: number
  className?: string
}

const DARK_THEME: Partial<Options> = {
  chart: {
    backgroundColor: 'transparent',
    style: { fontFamily: 'var(--font-heading, "Barlow Condensed", sans-serif)' },
  },
  title: { style: { color: '#ffffff' } },
  xAxis: {
    labels: { style: { color: '#9ca3af', fontSize: '11px' } },
    lineColor: '#1a1a24',
    tickColor: '#1a1a24',
    gridLineColor: 'rgba(255,255,255,0.05)',
  },
  yAxis: {
    title: { text: 'C3 RATING', style: { color: '#9ca3af', fontSize: '10px', letterSpacing: '0.08em' } },
    labels: { style: { color: '#9ca3af', fontSize: '11px' } },
    gridLineColor: 'rgba(255,255,255,0.05)',
  },
  legend: { enabled: false },
  tooltip: { backgroundColor: '#1a1a24', borderColor: '#2a2a38', style: { color: '#ffffff' } },
  credits: { enabled: false },
}

export function GenreBubbleChart({
  data,
  colorMap,
  xCategories,
  title,
  height = 420,
  className,
}: GenreBubbleChartProps) {
  ensureHighchartsMore()
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  // Group by genre for series coloring
  const series = useMemo<Highcharts.SeriesBubbleOptions[]>(() => {
    const byGenre: Record<string, BubblePoint[]> = {}
    data.forEach((p) => {
      if (!byGenre[p.genre]) byGenre[p.genre] = []
      ;(byGenre[p.genre] as BubblePoint[]).push(p)
    })
    return Object.entries(byGenre).map(([genre, points]) => ({
      type: 'bubble' as const,
      name: genre,
      color: colorMap[genre] ?? 'var(--color-brand-lavender)',
      data: points.map((p) => ({ x: p.x, y: p.y, z: p.z, name: p.name })),
    }))
  }, [data, colorMap])

  const options = useMemo<Options>(
    () => ({
      ...DARK_THEME,
      chart: { ...DARK_THEME.chart, type: 'bubble', height },
      title: title
        ? {
            text: title,
            style: { color: '#ffffff', fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.05em' },
            align: 'left',
          }
        : { text: '' },
      xAxis: {
        ...DARK_THEME.xAxis,
        categories: xCategories,
        title: {
          text: 'MONTH',
          style: { color: '#9ca3af', fontSize: '10px', letterSpacing: '0.08em' },
        },
      },
      yAxis: { ...DARK_THEME.yAxis },
      tooltip: {
        ...DARK_THEME.tooltip,
        pointFormatter(this: Highcharts.Point) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const z = (this as any).z as number | undefined
          return `<b>${this.name}</b><br/>C3 Rating: <b>${this.y?.toFixed(2)}</b><br/>Live Audience: <b>${z ? (z / 1e6).toFixed(1) + 'M' : ''}</b>`
        },
      },
      plotOptions: {
        bubble: {
          minSize: 8,
          maxSize: 60,
          dataLabels: { enabled: false },
          marker: { fillOpacity: 0.75 },
        },
      },
      series,
    }),
    [series, xCategories, height, title],
  )

  // GSAP stagger entrance after mount
  useEffect(() => {
    const chart = chartRef.current?.chart
    if (!chart) return

    import('gsap').then(({ gsap }) => {
      const points = chart.series.flatMap((s) => s.points)
      points.forEach((p) => {
        const el = p.graphic?.element
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'back.out(1.4)',
              delay: Math.random() * 0.4,
              transformOrigin: '50% 50%',
            },
          )
        }
      })
    })
  }, [])

  return (
    <div className={className}>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export type { GenreBubbleChartProps, BubblePoint }

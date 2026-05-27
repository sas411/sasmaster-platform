'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '../../../lib/utils'

interface StreamDataPoint {
  week: number
  [genre: string]: number
}

interface GenreStreamgraphProps {
  data: StreamDataPoint[]
  genres: string[]
  colorMap?: Record<string, string>
  weekLabels?: string[]
  height?: number
  className?: string
}

const DEFAULT_GENRE_COLORS = [
  '#a78bfa', '#22d3ee', '#f59e0b', '#34d399',
  '#f87171', '#60a5fa', '#e879f9', '#fb923c',
  '#818cf8', '#2dd4bf',
]

export function GenreStreamgraph({
  data,
  genres,
  colorMap,
  weekLabels,
  height = 280,
  className,
}: GenreStreamgraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg || data.length === 0) return

    const width = container.clientWidth || 600
    const margin = { top: 20, right: 20, bottom: 32, left: 40 }
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    import('d3').then((d3) => {
      d3.select(svg).selectAll('*').remove()
      d3.select(svg).attr('width', width).attr('height', height)

      const g = d3
        .select(svg)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const stack = d3
        .stack<StreamDataPoint, string>()
        .keys(genres)
        .offset(d3.stackOffsetWiggle)
        .order(d3.stackOrderInsideOut)

      const series = stack(data)

      const xScale = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, innerW])

      const yExtent = [
        d3.min(series, (s) => d3.min(s, (d) => d[0])) ?? 0,
        d3.max(series, (s) => d3.max(s, (d) => d[1])) ?? 1,
      ] as [number, number]

      const yScale = d3.scaleLinear().domain(yExtent).range([innerH, 0])

      const area = d3
        .area<d3.SeriesPoint<StreamDataPoint>>()
        .x((_d, i) => xScale(i))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.5))

      // Draw streams
      series.forEach((s, i) => {
        const color = colorMap?.[s.key] ?? (DEFAULT_GENRE_COLORS[i % DEFAULT_GENRE_COLORS.length] as string)

        const path = g
          .append('path')
          .datum(s)
          .attr('d', area)
          .attr('fill', color)
          .attr('opacity', 0)

        // Animated reveal
        import('gsap').then(({ gsap }) => {
          gsap.to(path.node()!, {
            opacity: 0.72,
            duration: 0.8,
            delay: i * 0.06,
            ease: 'power2.out',
          })
        })

        path
          .on('mouseover', function (this: SVGPathElement) {
            d3.select(this).attr('opacity', 0.92)
          })
          .on('mouseout', function (this: SVGPathElement) {
            d3.select(this).attr('opacity', 0.72)
          })
          .append('title')
          .text(s.key)
      })

      // X axis weeks
      const xTicks = data.length <= 13 ? data.length : 7
      const tickIndices = d3.range(0, data.length, Math.ceil(data.length / xTicks))

      g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickValues(tickIndices)
            .tickFormat((d) => weekLabels?.[d as number] ?? `W${(d as number) + 1}`),
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .call((ax: any) => {
          ax.select('.domain').attr('stroke', '#2a2a38')
          ax.selectAll('.tick line').attr('stroke', '#2a2a38')
          ax.selectAll('.tick text')
            .attr('fill', '#9ca3af')
            .style('font-size', '10px')
            .style('font-family', 'var(--font-body, sans-serif)')
        })
    })
  }, [data, genres, colorMap, weekLabels, height])

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <svg ref={svgRef} style={{ width: '100%', height }} />
    </div>
  )
}

export type { GenreStreamgraphProps, StreamDataPoint }

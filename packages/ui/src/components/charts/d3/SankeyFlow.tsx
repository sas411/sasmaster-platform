'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '../../../lib/utils'

interface SankeyNode {
  id: string
  label: string
  color?: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
}

interface SankeyFlowProps {
  nodes: SankeyNode[]
  links: SankeyLink[]
  columns: string[]
  height?: number
  className?: string
}

export function SankeyFlow({ nodes, links, columns, height = 360, className }: SankeyFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    const width = container.clientWidth || 700
    const margin = { top: 36, right: 16, bottom: 16, left: 16 }
    const innerW = width - margin.left - margin.right
    const innerH = height - margin.top - margin.bottom

    import('d3').then((d3) => {
      d3.select(svg).selectAll('*').remove()

      const root = d3
        .select(svg)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // Column headers
      const colCount = columns.length
      columns.forEach((col, i) => {
        root
          .append('text')
          .attr('x', (innerW / (colCount - 1)) * i)
          .attr('y', -14)
          .attr('text-anchor', 'middle')
          .style('fill', '#9ca3af')
          .style('font-size', '10px')
          .style('font-family', 'var(--font-heading, sans-serif)')
          .style('letter-spacing', '0.1em')
          .text(col.toUpperCase())
      })

      // Build node map and positions using d3-sankey-like layout (manual)
      // Group nodes by column index from links
      const nodeById: Record<string, SankeyNode & { x: number; y0: number; y1: number; col: number }> = {}

      // Assign columns based on node IDs — columns order matches columns prop
      nodes.forEach((n) => {
        const colIdx = columns.findIndex((c) => c.toLowerCase() === n.id.split('-')[0]?.toLowerCase())
        nodeById[n.id] = {
          ...n,
          col: colIdx >= 0 ? colIdx : 0,
          x: 0,
          y0: 0,
          y1: 0,
        }
      })

      // Position x
      Object.values(nodeById).forEach((n) => {
        n.x = (innerW / Math.max(colCount - 1, 1)) * n.col
      })

      // Compute node heights proportional to total flow
      const nodeFlowTotals: Record<string, number> = {}
      links.forEach((l) => {
        nodeFlowTotals[l.source] = (nodeFlowTotals[l.source] ?? 0) + l.value
        nodeFlowTotals[l.target] = (nodeFlowTotals[l.target] ?? 0) + l.value
      })

      const colGroups: Record<number, string[]> = {}
      Object.entries(nodeById).forEach(([id, n]) => {
        if (!colGroups[n.col]) colGroups[n.col] = []
        ;(colGroups[n.col] as string[]).push(id)
      })

      // Lay out nodes vertically within each column
      const NODE_GAP = 8
      Object.entries(colGroups).forEach(([, ids]) => {
        const total = ids.reduce((s, id) => s + (nodeFlowTotals[id] ?? 0), 0)
        let y = 0
        ids.forEach((id) => {
          const flow = nodeFlowTotals[id] ?? 0
          const h = total > 0 ? (flow / total) * innerH : innerH / ids.length
          const node = nodeById[id]
          if (node) {
            node.y0 = y
            node.y1 = y + Math.max(h - NODE_GAP, 4)
          }
          y += h
        })
      })

      const DEFAULT_COLORS = [
        '#a78bfa', '#22d3ee', '#f59e0b', '#34d399',
        '#f87171', '#60a5fa', '#e879f9', '#fb923c',
      ]

      // Draw links
      links.forEach((link, i) => {
        const src = nodeById[link.source]
        const tgt = nodeById[link.target]
        if (!src || !tgt) return

        const srcMid = (src.y0 + src.y1) / 2
        const tgtMid = (tgt.y0 + tgt.y1) / 2
        const linkH = Math.abs(src.y1 - src.y0) * 0.6
        const midX = (src.x + tgt.x) / 2

        const path = `M ${src.x},${srcMid - linkH / 2}
          C ${midX},${srcMid - linkH / 2} ${midX},${tgtMid - linkH / 2} ${tgt.x},${tgtMid - linkH / 2}
          L ${tgt.x},${tgtMid + linkH / 2}
          C ${midX},${tgtMid + linkH / 2} ${midX},${srcMid + linkH / 2} ${src.x},${srcMid + linkH / 2}
          Z`

        const color = src.color ?? (DEFAULT_COLORS[i % DEFAULT_COLORS.length] as string)

        root
          .append('path')
          .attr('d', path)
          .attr('fill', color)
          .attr('opacity', 0.3)
          .on('mouseover', function (this: SVGPathElement) {
            d3.select(this).attr('opacity', 0.55)
          })
          .on('mouseout', function (this: SVGPathElement) {
            d3.select(this).attr('opacity', 0.3)
          })
          .append('title')
          .text(`${link.source} → ${link.target}: ${(link.value / 1e6).toFixed(1)}M`)
      })

      // Draw node bars
      Object.values(nodeById).forEach((n, i) => {
        const color = n.color ?? (DEFAULT_COLORS[i % DEFAULT_COLORS.length] as string)
        root
          .append('rect')
          .attr('x', n.x - 6)
          .attr('y', n.y0)
          .attr('width', 12)
          .attr('height', Math.max(n.y1 - n.y0, 4))
          .attr('rx', 3)
          .attr('fill', color)

        root
          .append('text')
          .attr('x', n.x)
          .attr('y', (n.y0 + n.y1) / 2 + 4)
          .attr('text-anchor', 'middle')
          .style('fill', '#ffffff')
          .style('font-size', '10px')
          .style('font-family', 'var(--font-body, sans-serif)')
          .style('pointer-events', 'none')
          .text(n.label)
      })
    })
  }, [nodes, links, columns, height])

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <svg ref={svgRef} style={{ width: '100%', height }} />
    </div>
  )
}

export type { SankeyFlowProps, SankeyNode, SankeyLink }

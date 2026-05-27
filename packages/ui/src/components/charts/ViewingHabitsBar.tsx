'use client'

import * as React from 'react'
import { useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import type { Options } from 'highcharts'

interface ViewingSegmentData {
  demo: string
  live: number
  sameDayDvr: number
  ts1to7: number
  svodOtt: number
}

interface ViewingHabitsBarProps {
  data: ViewingSegmentData[]
  title?: string
  height?: number
  className?: string
}

const SEGMENT_COLORS = {
  live: '#22d3ee',       // teal
  sameDayDvr: '#06b6d4', // cyan
  ts1to7: '#a78bfa',     // purple
  svodOtt: '#e879f9',    // magenta
}

export function ViewingHabitsBar({
  data,
  title,
  height = 300,
  className,
}: ViewingHabitsBarProps) {
  const options = useMemo<Options>(
    () => ({
      chart: {
        type: 'bar',
        height,
        backgroundColor: 'transparent',
        style: { fontFamily: 'var(--font-heading, "Barlow Condensed", sans-serif)' },
      },
      title: title
        ? {
            text: title,
            style: { color: '#ffffff', fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.05em' },
            align: 'left',
          }
        : { text: '' },
      xAxis: {
        categories: data.map((d) => d.demo),
        labels: { style: { color: '#9ca3af', fontSize: '11px' } },
        lineColor: '#1a1a24',
        tickColor: '#1a1a24',
      },
      yAxis: {
        title: {
          text: 'AUD. SHARE %',
          style: { color: '#9ca3af', fontSize: '10px', letterSpacing: '0.08em' },
        },
        stackLabels: { enabled: false },
        labels: { style: { color: '#9ca3af', fontSize: '10px' } },
        gridLineColor: 'rgba(255,255,255,0.05)',
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        itemStyle: { color: '#9ca3af', fontSize: '11px', fontWeight: 'normal' },
      },
      tooltip: {
        shared: true,
        backgroundColor: '#1a1a24',
        borderColor: '#2a2a38',
        style: { color: '#ffffff' },
        valueSuffix: '%',
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          borderWidth: 0,
          borderRadius: 2,
          dataLabels: { enabled: false },
        },
      },
      series: [
        {
          type: 'bar' as const,
          name: 'LIVE',
          color: SEGMENT_COLORS.live,
          data: data.map((d) => d.live),
        },
        {
          type: 'bar' as const,
          name: 'SAME-DAY DVR',
          color: SEGMENT_COLORS.sameDayDvr,
          data: data.map((d) => d.sameDayDvr),
        },
        {
          type: 'bar' as const,
          name: '1-7 DAY TS',
          color: SEGMENT_COLORS.ts1to7,
          data: data.map((d) => d.ts1to7),
        },
        {
          type: 'bar' as const,
          name: 'SVOD/OTT',
          color: SEGMENT_COLORS.svodOtt,
          data: data.map((d) => d.svodOtt),
        },
      ],
      credits: { enabled: false },
    }),
    [data, height, title],
  )

  return (
    <div className={className}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

export type { ViewingHabitsBarProps, ViewingSegmentData }

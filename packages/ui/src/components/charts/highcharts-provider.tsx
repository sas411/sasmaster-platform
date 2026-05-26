'use client'

import type React from 'react'
import Highcharts from 'highcharts'
import { useEffect } from 'react'

const SASMSTER_DARK_THEME: Highcharts.Options = {
  chart: {
    backgroundColor: 'var(--color-bg-surface)',
    style: { fontFamily: 'var(--font-heading)' },
    animation: { duration: 400, easing: 'easeOut' },
  },
  colors: ['#a78bfa', '#22d3ee', '#f59e0b', '#f87171', '#34d399', '#60a5fa'],
  title: {
    style: { color: '#ffffff', fontFamily: 'var(--font-display)', fontSize: '18px' },
  },
  subtitle: {
    style: { color: '#9ca3af' },
  },
  xAxis: {
    gridLineColor: '#1a1a24',
    lineColor: '#1a1a24',
    tickColor: '#1a1a24',
    labels: { style: { color: '#9ca3af', fontSize: '11px' } },
    title: { style: { color: '#9ca3af' } },
  },
  yAxis: {
    gridLineColor: '#1a1a24',
    labels: { style: { color: '#9ca3af', fontSize: '11px' } },
    title: { style: { color: '#9ca3af' } },
  },
  legend: {
    itemStyle: { color: '#d1d5db', fontWeight: '400' },
    itemHoverStyle: { color: '#ffffff' },
    itemHiddenStyle: { color: '#6b7280' },
  },
  tooltip: {
    backgroundColor: '#13131a',
    style: { color: '#ffffff' },
    borderColor: '#a78bfa',
    borderRadius: 8,
    shadow: false,
  },
  plotOptions: {
    column: { borderRadius: 4 },
    bar: { borderRadius: 4 },
  },
  credits: { enabled: false },
  navigation: {
    buttonOptions: {
      theme: { fill: '#13131a', stroke: '#1a1a24' },
    },
  },
}

export function HighchartsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Highcharts.setOptions(SASMSTER_DARK_THEME)
  }, [])
  return <>{children}</>
}

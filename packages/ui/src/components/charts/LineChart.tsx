'use client'

import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useMemo } from 'react'

interface LineChartProps {
  title?: string
  series: Highcharts.SeriesLineOptions[]
  categories: string[]
  height?: number
  className?: string
}

export function LineChart({ title, series, categories, height = 300, className }: LineChartProps) {
  const options = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'line', height },
      ...(title ? { title: { text: title } } : { title: { text: '' } }),
      xAxis: { categories },
      yAxis: { title: { text: '' } },
      series,
      legend: { enabled: series.length > 1 },
    }),
    [title, series, categories, height],
  )

  return (
    <div className={className}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
}

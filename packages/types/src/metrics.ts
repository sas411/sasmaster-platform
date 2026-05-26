export interface MetricValue {
  value: number
  unit: string
  formatted: string
}

export interface MetricDelta {
  value: number
  direction: 'up' | 'down' | 'flat'
  percentage: number
}

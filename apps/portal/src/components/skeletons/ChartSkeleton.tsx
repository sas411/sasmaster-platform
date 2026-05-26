interface ChartSkeletonProps {
  height?: number
}

export function ChartSkeleton({ height = 280 }: ChartSkeletonProps) {
  return (
    <div
      className="animate-pulse w-full rounded-xl"
      style={{
        height,
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-dark)',
      }}
    />
  )
}

export function MetricCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-xl p-4"
      style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-dark)' }}
    >
      <div
        className="mb-3 h-3 w-20 rounded"
        style={{ background: 'var(--color-bg-elevated)' }}
      />
      <div
        className="mb-2 h-8 w-28 rounded"
        style={{ background: 'var(--color-bg-elevated)' }}
      />
      <div
        className="h-3 w-14 rounded"
        style={{ background: 'var(--color-bg-elevated)' }}
      />
    </div>
  )
}

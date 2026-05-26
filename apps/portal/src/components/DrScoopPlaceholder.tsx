export function DrScoopPlaceholder() {
  return (
    <div
      aria-label="Dr. Scoop AI assistant (coming soon)"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'var(--color-brand-lavender)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-lavender)',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-bg-base)',
        fontSize: 26,
        fontWeight: 700,
        userSelect: 'none',
        zIndex: 50,
      }}
    >
      S
    </div>
  )
}

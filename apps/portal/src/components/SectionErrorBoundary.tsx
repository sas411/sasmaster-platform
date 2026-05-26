import { Component } from 'react'
import type { ReactNode } from 'react'
import { SignalBadge } from '@sasmaster/ui'

interface Props {
  children: ReactNode
  sectionName?: string
}

interface State {
  hasError: boolean
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override componentDidCatch(error: Error): void {
    console.error(`[SectionErrorBoundary] ${this.props.sectionName ?? 'section'} error:`, error.message)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center gap-3 rounded-xl p-4"
          style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-dark)',
          }}
        >
          <SignalBadge variant="put-alert" />
          <span
            className="text-sm"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-dark-secondary)' }}
          >
            Data unavailable
          </span>
        </div>
      )
    }
    return this.props.children
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { MetricReadout } from '../components/light/MetricReadout'
import { LiveBadge } from '../components/light/LiveBadge'
import { SignalBadge } from '../components/light/SignalBadge'
import { FilterChip } from '../components/light/FilterChip'
import { useState } from 'react'

/* ── MetricReadout ── */
const metricMeta: Meta<typeof MetricReadout> = {
  title: 'Light/MetricReadout',
  component: MetricReadout,
  parameters: { backgrounds: { default: 'light-operational' } },
  tags: ['autodocs'],
}
export default metricMeta
type MetricStory = StoryObj<typeof metricMeta>

export const Positive: MetricStory = {
  args: { value: '311.2M', label: 'TOTAL VIEWERS', delta: '+0.8%', deltaDirection: 'up' },
}
export const Negative: MetricStory = {
  args: { value: '12.4%', label: 'SHARE', delta: '-1.2pp', deltaDirection: 'down' },
}
export const Flat: MetricStory = {
  args: { value: '89.7M', label: 'REACH' },
}

/* ── LiveBadge ── */
export const Live: StoryObj = {
  render: () => <LiveBadge />,
  parameters: { backgrounds: { default: 'light-operational' } },
}

/* ── SignalBadge ── */
export const AllSignals: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 16 }}>
      {(['breakout', 'pricing', 'put-alert', 'licensed', 'pending', 'shift'] as const).map((v) => (
        <SignalBadge key={v} variant={v} />
      ))}
    </div>
  ),
  parameters: { backgrounds: { default: 'light-operational' } },
}

/* ── FilterChip ── */
export const FilterChips: StoryObj = {
  render: function Render() {
    const [active, setActive] = useState('all')
    return (
      <div style={{ display: 'flex', gap: 8, padding: 16 }}>
        {['all', 'live', 'vod', 'sports'].map((label) => (
          <FilterChip
            key={label}
            label={label.toUpperCase()}
            active={active === label}
            onClick={() => setActive(label)}
          />
        ))}
      </div>
    )
  },
  parameters: { backgrounds: { default: 'light-operational' } },
}

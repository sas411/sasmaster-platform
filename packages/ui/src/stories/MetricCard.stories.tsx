import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from '../components/sasmster/MetricCard'

const meta: Meta<typeof MetricCard> = {
  title: 'SaSMaster/MetricCard',
  component: MetricCard,
  parameters: { backgrounds: { default: 'dark-cinematic' } },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithDelta: Story = {
  args: { label: 'TOTAL VIEWERS', value: '311.2M', delta: '+0.8% vs prior week', deltaDirection: 'up' },
}

export const Negative: Story = {
  args: { label: 'SHARE', value: '12.4%', delta: '-1.2pp', deltaDirection: 'down' },
}

export const Flat: Story = {
  args: { label: 'REACH', value: '89.7M' },
}

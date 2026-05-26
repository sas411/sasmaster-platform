import type { Meta, StoryObj } from '@storybook/react'
import { DrScoop } from '../components/dr-scoop/DrScoop'

const meta: Meta<typeof DrScoop> = {
  title: 'SaSMaster/DrScoop',
  component: DrScoop,
  parameters: {
    backgrounds: { default: 'dark-cinematic' },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: () => (
    <div style={{ minHeight: '600px', background: 'var(--color-bg-base)', position: 'relative' }}>
      <DrScoop />
    </div>
  ),
}

export const ContentSection: Story = {
  render: () => (
    <div style={{ minHeight: '600px', background: 'var(--color-bg-base)', position: 'relative' }}>
      <DrScoop section="content" />
    </div>
  ),
}

export const AdvertisingSection: Story = {
  render: () => (
    <div style={{ minHeight: '600px', background: 'var(--color-bg-base)', position: 'relative' }}>
      <DrScoop section="advertising" />
    </div>
  ),
}

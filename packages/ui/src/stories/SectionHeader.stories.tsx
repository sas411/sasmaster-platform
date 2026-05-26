import type { Meta, StoryObj } from '@storybook/react'
import { SectionHeader } from '../components/sasmster/SectionHeader'

const meta: Meta<typeof SectionHeader> = {
  title: 'SaSMaster/SectionHeader',
  component: SectionHeader,
  parameters: { backgrounds: { default: 'dark-cinematic' } },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'CONTENT ANALYTICS', subtitle: 'Live viewership data across all networks' },
}

export const NoSubtitle: Story = {
  args: { title: 'ADVERTISING' },
}

import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from '../components/charts/LineChart'

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { backgrounds: { default: 'surface' } },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const SingleSeries: Story = {
  args: {
    title: 'Weekly Viewership',
    categories: ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Wk6'],
    series: [{ name: 'Viewers (M)', data: [280, 295, 311, 308, 322, 319], type: 'line' }],
    height: 300,
  },
}

export const TwoSeries: Story = {
  args: {
    title: 'YoY Comparison',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      { name: 'Current Year', data: [290, 300, 311, 295, 320, 315], type: 'line' },
      { name: 'Prior Year', data: [270, 280, 295, 278, 305, 298], type: 'line' },
    ],
    height: 300,
  },
}

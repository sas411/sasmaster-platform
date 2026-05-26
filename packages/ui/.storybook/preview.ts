import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark-cinematic',
      values: [
        { name: 'dark-cinematic', value: '#0a0a0f' },
        { name: 'surface', value: '#13131a' },
        { name: 'light-operational', value: '#f0f4f8' },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
}

export default preview

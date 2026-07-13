import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/ui', 'packages/tokens', 'packages/types'],
  },
})

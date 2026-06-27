import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['dist/**', 'cdk.out/**', 'node_modules/**'],
    testTimeout: 30_000,
  },
})

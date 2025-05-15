import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/types.ts', // No logic to test
        'src/index.ts', // Exports only
        'src/tldData.ts', // Data, will be tested indirectly
        'src/cli.ts', // CLI, tested separately if needed
        '**/*.d.ts',
      ],
    },
  },
});

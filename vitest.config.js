import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'node',
      include: ['tests/**/*.test.js'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{js,ts,astro}'],
        exclude: [
          'src/content/**',
          'src/pages/**',
          'dist/**',
          'node_modules/**',
        ],
      },
      testTimeout: 30000, // 30 seconds for build tests
    },
  })
);

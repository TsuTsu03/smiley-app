import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      // Focus coverage on testable business logic (pure libs)
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/supabase/**', 'src/lib/auth.tsx'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});

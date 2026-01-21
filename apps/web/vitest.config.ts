import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: true,     // same as 0.0.0.0
  //   port: 5173,
  //   strictPort: true,
  // },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});

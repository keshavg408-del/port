import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: './.cache',
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});

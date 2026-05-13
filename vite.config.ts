import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://api.ondacast.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});

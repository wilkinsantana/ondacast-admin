import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/me': {
        target: 'https://api.ondacast.com',
        changeOrigin: true,
        secure: true,
      },
      '/auth': {
        target: 'https://api.ondacast.com',
        changeOrigin: true,
        secure: true,
      },
      '/admin': {
        target: 'https://api.ondacast.com',
        changeOrigin: true,
        secure: true,
      },
      '/v1': {
        target: 'https://api.ondacast.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});

import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $lib: 'src/lib',
      $components: 'src/lib/components',
      $api: 'src/lib/api',
      $auth: 'src/lib/auth',
      $icons: 'src/lib/icons',
      $mock: 'src/lib/mock',
      $types: 'src/lib/types'
    }
  }
};

export default config;

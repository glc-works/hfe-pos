import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://board.hfeit.com',
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
  ],
});

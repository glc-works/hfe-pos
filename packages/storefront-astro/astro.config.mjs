import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://pos.hfeit.com',
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
  ],
});

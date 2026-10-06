import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';

const talkDirectory = new URL('./src/data/talks/', import.meta.url);
const mediaProxy = Object.fromEntries(readdirSync(talkDirectory).filter(file => file.endsWith('.json')).map(file => {
  const talk = JSON.parse(readFileSync(new URL(file, talkDirectory), 'utf8'));
  const video = new URL(talk.video);
  if (!/^[a-z0-9-]+$/.test(talk.slug) || video.origin !== 'https://video.twimg.com') {
    throw new Error(`Invalid talk media source: ${file}`);
  }
  return [`^/__talk-media/${talk.slug}\\.mp4$`, {
    target: video.origin,
    changeOrigin: true,
    rewrite: () => `${video.pathname}${video.search}`,
    configure: proxy => {
      proxy.on('proxyReq', request => {
        for (const header of ['cookie', 'authorization', 'referer', 'origin']) request.removeHeader(header);
      });
    },
  }];
}));

export default defineConfig({
  site: 'https://piindex.dev',
  output: 'static',
  devToolbar: { enabled: false },
  vite: { server: { proxy: mediaProxy } },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
        },
      },
    }),
  ],
});

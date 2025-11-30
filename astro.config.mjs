import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';

export default defineConfig({
  site: 'https://Awatansh.github.io/Confero',
  base: '/Confero',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeMathjax],
    }),
    sitemap()
  ],
  output: 'static',
  trailingSlash: 'ignore',
});

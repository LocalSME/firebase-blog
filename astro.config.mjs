// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Targeting Firebase Hosting (firebase.json + .firebaserc at the project root) — not
// Replit, despite the project's name; see CLAUDE.md. Not deployed there yet, so `site`
// is a placeholder; update it together with public/admin/config.yml's
// site_url/display_url and public/robots.txt's Sitemap line once Firebase assigns a
// real domain. src/lib/url.ts mediates every internal link, so the site can move under
// a sub-path (or a different domain) later by changing `site`/`base` here alone.
export default defineConfig({
  site: 'https://firebase-blog.example.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // /search/ is a client-side tool, not content, and is marked noindex.
      filter: (page) => !page.endsWith('/search/'),
    }),
  ],
  image: {
    // Remote featured images (a pasted stock-photo URL, say) are downloaded at
    // build time, resized and served from this origin — so they get the same
    // treatment as local uploads and cost the reader no third-party request.
    remotePatterns: [{ protocol: 'https' }],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});

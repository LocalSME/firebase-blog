# Replit-blog

A solo-author static blog built with Astro, Sveltia CMS, Pagefind search and Giscus
comments — the fifth in a set of independent sibling blogs, each with its own visual
design and its own content:

- GitHub Pages blog — warm serif, rounded cards
- GitLab Pages blog — same family as above, independent content
- Cloudflare Pages blog — cool, flat, technical, monospace labels
- Netlify blog — its own distinct design, independent content
- vzero-blog (Vercel, via v0.app) — sidebar nav, numbered reading list, violet accent
- **Replit-blog (this project)** — retro terminal/CRT: a floating "window" with
  traffic-light dots, monospace throughout, posts that read like `cat <slug>.md`

**Repo:** [CreativeDigitalGrowth/Replit-blog](https://github.com/CreativeDigitalGrowth/Replit-blog)
on GitHub. **Hosting: Firebase Hosting**, not Replit, despite the name — Replit's free
tier expires after 30 days and Render (tried next) requires card verification even for
free static hosting. See [CLAUDE.md](CLAUDE.md) for the Firebase setup steps (needs your
own Google login, can't be done from an assistant session) and the placeholder values
still left to fill in once it's live.

## Quick start

```bash
npm install
npm install --no-save --force @astrojs/compiler-binding-wasm32-wasi  # Windows only, see CLAUDE.md
npm run dev
```

Open http://localhost:4321/ for the site, or
http://localhost:4321/admin/index.html for the CMS (choose **"Work with Local
Repository"** — no account needed yet, see CLAUDE.md).

## Features

- Content collections with a Zod-validated frontmatter schema
- Sveltia CMS at `/admin/`, editable locally before any git host is chosen
- Categories and tags, each with their own paginated archive
- Full-text search (Pagefind) — works against `npm run preview`, not `npm run dev`
- Giscus comments (kept unconfigured until a public GitHub repo exists)
- RSS feed, sitemap, per-post JSON-LD, light/dark theme toggle
- Optional About / Search / Contact pages, gated behind flags in `src/consts.ts`
- Optional Google Maps embed per post

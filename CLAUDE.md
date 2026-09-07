# Working in this repository

A solo-author static blog: Astro 7 + TypeScript, Sveltia CMS, Pagefind search, Giscus
comments — the same proven scaffold as the sibling GitHub Pages, GitLab Pages, Cloudflare
Pages and vzero-blog (Vercel) projects, but its own codebase, content and visual design
going forward. **Local-only for now**: no remote git repo, no deployed host, no real
domain. See "Placeholders to fill in" below before this ever ships.

## Design language

A retro terminal / CRT. The whole site renders as one floating "window" — traffic-light
dots, a fake `guest@creative-digital-growth:~$` prompt for a title — on a darker desktop
backdrop, monospace throughout (JetBrains Mono; VT323 only for the glowing `<h1>`), a
faint CRT scanline overlay, and posts that read like `cat <slug>.md` shell commands with
comment-style (`#`) meta lines. Deliberately different from every sibling: not the warm
serif/rounded-card GitHub/GitLab look, not the cool flat hairline-technical Cloudflare
look, and not vzero-blog's quiet sidebar + serif-numeral reading list — this one leans
all the way into "coding platform" chrome instead of hiding it. Whole language lives in
`src/styles/global.css`; components mostly carry the same class names as the other
siblings (`.pill`, `.toc`, `.post-list`, …) so the visual layer can be re-skinned again
later without touching component logic. One exception: `PostCard.astro` here takes only
a `post` prop (no `index` — vzero-blog's numbered-list motif belongs to that project, not
this one; don't copy it back over without a reason).

## Development

```bash
npm run dev      # localhost:4321/ — drafts visible
npm run build    # production build + Pagefind index
npm run preview  # serves dist/ — the only faithful test of search and base paths
npm run check    # TypeScript + Astro diagnostics; keep this at 0 errors
```

**On this Windows machine**, Smart App Control blocks Astro's native compiler binary.
After every `npm install` or `npm ci`:

```bash
npm install --no-save --force @astrojs/compiler-binding-wasm32-wasi
```

## Editing content before a real repo exists

The CMS at `/admin/` needs a real git host to commit to for its normal GitHub-backed
login. Until this project has one, use the **local backend** instead — Sveltia's
`local_backend: true` (already set in `public/admin/config.yml`) lets it read and write
this working copy directly through the browser's File System Access API (Chromium-based
browsers only):

```bash
npm run dev
```

Open **http://localhost:4321/admin/index.html** (the explicit filename is required in
dev) and choose **"Work with Local Repository"**.

## `.replit`: best-effort, not verified

The `.replit` file at the project root was written without access to a live Repl to
test against — it is a reasonable starting point (dev-server run command bound to
`0.0.0.0`, a Static Deployment target building `dist/`), not a guaranteed-correct
config. Confirm it actually works once this is imported into Replit, and adjust in
Replit's own Deployments UI rather than assuming the file is authoritative.

## Rules that are easy to get wrong

(Same rules as the sibling blogs — carried over unchanged because the underlying
scaffold is unchanged, only the visual layer differs.)

**Never write a root-absolute internal path.** Use the helpers in `src/lib/url.ts`:

| Helper | For |
| --- | --- |
| `withBase(p)` | paths you author — `/about/` |
| `absFromBuiltPath(p, site)` | paths Astro produced (`Astro.url.pathname`, `ImageMetadata.src`, `paginate()` URLs) — already based |
| `absUrl(p, site)` | absolute URL from a path you author |

**`paginate()` URLs already include the base.** `Pagination.astro` takes them raw.

**Query posts through `getPosts()`** in `src/lib/posts.ts`, never `getCollection`
directly — that is where drafts are filtered and date ordering happens.

**Frontmatter image paths are relative to the Markdown file** —
`../../assets/images/uploads/…`. `media_folder`/`public_folder` in
`public/admin/config.yml` must stay in sync with wherever posts live.

**Site-wide settings live in `src/consts.ts` and nowhere else.**

**The CMS schema and the Zod schema must match.** `public/admin/config.yml` field names
and `src/content.config.ts` are one contract.

**`public/admin/config.yml` is YAML.** Quote any string containing `: `.

**`public/admin/index.html`'s config link is an absolute `/admin/config.yml`, not a
relative one.** A relative link 404s whenever `/admin` (no trailing slash) is requested
directly, because the browser resolves it against `/` instead of `/admin/` — this bit
the vzero-blog sibling in production. Keep it absolute.

## Placeholders to fill in once this ships

Nothing here works "by accident" — these are deliberately fake values, not bugs:

- `astro.config.mjs` — `site: 'https://replit-blog.example.com'`
- `public/admin/config.yml` — `backend.repo`, `site_url`, `display_url`
- `public/robots.txt` — the `Sitemap:` line
- `src/consts.ts` — `GISCUS.repo` (empty; Giscus needs a public GitHub repo with
  Discussions enabled), `SOCIAL_LINKS` (empty), `AUTHOR_NAME`/`AUTHOR_BIO`/`AUTHOR_EMAIL`
  (still template defaults)
- `.replit` — confirm against a real Repl, see above

Update the site-URL-shaped ones together in one pass once a git host and a deploy target
are chosen.

## Before calling a change done

```bash
npm run check    # expect 0 errors
npm run build
```

If the change is visible in a browser, verify with `npm run preview` rather than
`npm run dev` — search, `/admin/` and draft exclusion all behave differently between the
two.

## Documentation

https://docs.astro.build — [Routing](https://docs.astro.build/en/guides/routing/),
[Content collections](https://docs.astro.build/en/guides/content-collections/),
[Images](https://docs.astro.build/en/guides/images/). Replit deployments:
https://docs.replit.com/cloud-services/deployments/about-deployments.

# Working in this repository

A solo-author static blog: Astro 7 + TypeScript, Sveltia CMS, Pagefind search, Giscus
comments — the same proven scaffold as the sibling GitHub Pages, GitLab Pages, Cloudflare
Pages, Netlify and vzero-blog (Vercel) projects, but its own codebase, content and visual
design going forward.

**Repo:** [LocalSME/firebase-blog](https://github.com/LocalSME/firebase-blog)
on GitHub (`main`). **Hosting: Firebase Hosting** — its free Spark plan needs no card at
all for static Hosting (only Cloud Functions/Blaze require billing). See `firebase.json`
and "Placeholders to fill in" below before this ships.

This project's name and hosting have moved twice: scaffolded for a Replit Static
Deployment (as `Replit-blog`) whose free tier expires after 30 days, tried Render next
(free but requires credit card verification — a dead end without one), landed on
Firebase Hosting and was renamed `firebase-blog` to match. If anything still says
"Replit" or "Render", it's stale — flag it.

## Design language

A retro terminal / CRT. The whole site renders as one floating "window" — traffic-light
dots, a fake `guest@localsme:~$` prompt for a title — on a darker desktop
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

## Editing content

The CMS at `/admin/` uses the GitHub backend — **"Sign In Using Access Token"** with a
fine-grained PAT scoped to `LocalSME/firebase-blog` (same pattern as the
sibling Cloudflare/vzero blogs; **not** "Sign In with GitHub", which hangs — see the
Cloudflare blog's `docs/troubleshooting.md`). Saving is a commit to `main`, which
triggers the Firebase Hosting GitHub Action once that is set up (see below) — deploying
is then the same "save in CMS → live" flow every sibling blog has.

Locally, `local_backend: true` (set in `public/admin/config.yml`) is also available —
lets Sveltia read and write this working copy directly through the browser's File
System Access API (Chromium-based browsers only), for editing without every save
reaching the live site immediately:

```bash
npm run dev
```

Open **http://localhost:4321/admin/index.html** (the explicit filename is required in
dev) and choose **"Work with Local Repository"**.

## Deploying to Firebase Hosting

**No real Firebase project has been created for this blog yet.** Every site-URL-shaped
value (`.firebaserc`'s default project, `astro.config.mjs`'s `site`,
`public/admin/config.yml`'s `site_url`/`display_url`, `public/robots.txt`'s `Sitemap:`
line, and the two `.github/workflows/firebase-hosting-*.yml` files) currently uses the
placeholder project id `localsme-blog` (`https://localsme-blog.firebaseapp.com/`) — a
real Firebase project only gets an opaque id suffix (e.g. `-a1b2c`) once one is
actually created. `firebase.json` (public dir `dist`, `trailingSlash: true` to match
`astro.config.mjs`'s `trailingSlash: 'always'` — the same class of bug the
`/admin/config.yml` absolute-path fix addressed on Vercel) is committed too.

Remaining steps, which need the user's own Google/Firebase login and can't be done from
here:

1. `npm install -g firebase-tools`, then `firebase login`.
2. Create the real Firebase project (Console or `firebase projects:create`), then from
   this directory run `firebase init hosting:github`. Point it at
   `LocalSME/firebase-blog`, branch `main`. This is the step that actually wires up
   automatic deploys — it creates a GCP service account, stores it as a GitHub Actions
   secret on the repo, and **generates the deploy workflow file itself**
   (`.github/workflows/firebase-hosting-merge.yml`), overwriting the placeholder one
   committed here. Prefer letting the CLI generate that file over hand-writing one; it
   gets the secret name and project ID right by construction. Double-check the
   generated workflow's Node version is ≥22 (Astro 7's requirement) — the CLI's default
   may be older.
3. Once the real project id is known, update every placeholder `localsme-blog`
   reference listed above to the real id (and real `.firebaseapp.com` origin, or a
   custom domain) in one pass.
4. Confirm a push to `main` (or a CMS save) triggers the Action and the site goes live.

Alternatively, a one-off `firebase deploy --only hosting` (after `npm run build`) would
get *something* live immediately without setting up the GitHub Action, but every
sibling blog's whole point is "save in CMS → live automatically" — worth doing the
GitHub integration properly rather than a manual deploy that has to be repeated by hand.

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

- `src/consts.ts` — `GISCUS.repo` (empty; Giscus needs a public GitHub repo with
  Discussions enabled — the repo already exists, Discussions does not need enabling yet),
  `SOCIAL_LINKS` (empty), `AUTHOR_NAME`/`AUTHOR_BIO`/`AUTHOR_EMAIL` (still template
  defaults)

Everything site-URL-shaped (`.firebaserc`, `astro.config.mjs`, `public/admin/
config.yml`'s `site_url`/`display_url`, `public/robots.txt`'s `Sitemap:` line, and the
two `.github/workflows/firebase-hosting-*.yml` files) currently uses the placeholder
project id `localsme-blog` — no real Firebase project has been created yet. Once one is
(or Firebase assigns a custom domain instead), update all of those together in one
pass, the same way this placeholder set was filled in.

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
[Images](https://docs.astro.build/en/guides/images/). Firebase Hosting + GitHub:
https://firebase.google.com/docs/hosting/github-integration.

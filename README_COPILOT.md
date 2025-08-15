# Project Overview for Copilot

This repository is a Jekyll-based static website with a custom TypeScript build pipeline (run by Bun) and a local test server that emulates Cloudflare Pages behavior.

Use this file as a quick map of the architecture, conventions, and key logic paths so changes stay consistent.

## Stack and workflow

- Authoring: Markdown/Liquid under `src/` using Jekyll collections and layouts.
- Localization: jekyll-polyglot with a special pseudo-language `no-default` to handle root redirects.
- Build: `bun run build` executes `builder.ts` which runs:
  1) Jekyll build to `./_site`
  2) Minification of HTML, XML, and JS
  3) Asset hashing + reference rewriting + redirect rules
  4) Cleanup of unwanted files
- Serve locally: `bun run server` runs `server.ts` to serve `_site/` with `_headers` and `_redirects` applied, plus gzip/brotli in production mode.

## Key configs

- `_config.yml`
  - `source: ./src`, `destination: ./_site`
  - Polyglot: `languages: [ja, en]`, `default_lang: no-default`, `fallback_lang: en`, `lang: ja`
  - Collections: `app`, `announcements`, `notes` (all `output: true`)
  - SASS: compressed
  - Includes in build output: `_headers`, `_redirects`, `.well-known`
  - `builder` section (optional): toggles for `processAssets`, `minifyFiles`, `cleanup`

- `package.json`
  - `build`: `bun builder.ts` (with `BUILD_START_TIME` for timing)
  - `dev`: build then `server.ts --dev` (no compression, verbose)
  - `server`: start server with compression

## Localization model (Polyglot + "no-default")

- Site languages are `ja` and `en`. The special `default_lang: no-default` prevents any default language from rendering at the site root.
- Pages exist under language prefixes (e.g. `/ja/app/`, `/en/app/`). There are no real content pages without a language code.
- For root (language-less) paths such as `/app/`, Polyglot will activate `site.active_lang == "no-default"` and render a redirect page using `src/_layouts/base.html`:
  - When `site.active_lang == "no-default"`, the layout includes `head.html` with `type="lang-redirect"`.
  - `src/_includes/head.html` (lang-redirect mode):
    - Injects a small JS snippet that detects `navigator.language` (reduced to base lang) and client-side redirects to `/{ja|en}{pathname}` (unknown languages fallback to `en`).
    - `<noscript>` fallback is a 0s meta refresh to the configured `fallback_lang`.
    - Adds `noindex,noarchive` robots for these language-less pages.
- Social sharing note: for language-less root links that may be shared on SNS, keep head/meta (OG tags, etc.) aligned with the Japanese version. If you adjust redirect behavior, ensure OG/canonical remain consistent with JP content so previews are stable.
- Important nuance: these language-less pages are meant for sharing root links while keeping head/meta behavior aligned with the Japanese canonical content. Treat root pages as redirect placeholders; do not add substantive content there.

## Layouts and includes

- `src/_layouts/base.html`: switches between lang-redirect head vs full head. Renders header/footer unless `home`.
- `src/_includes/head.html`: builds head/meta/OG tags, alternate hreflang, canonical, feeds, schema, etc. In redirect mode, only redirect-related tags are emitted.
- `src/_layouts/default.html`: generic content wrapper (`<main>`), used for most pages.
- `src/_layouts/home.html`: home page sections listing apps, announcements, and notes.
- `src/_layouts/feed.html`: collection index pages with optional Atom feed link.
- `src/_layouts/post.html`: article layout with dates, updates, and body.
- `src/_layouts/atom.atom`: Atom feed template. Note the `<!--html_content--> ... <!--/html_content-->` markers so builder’s XML minifier preserves embedded HTML.
- `src/_includes/*`: common components (`header`, `footer`, `lang-select`, `appbox`, `postbox`, `schema`).

## Content structure

- Collections
  - Apps: `src/_app/<slug>/<slug>.(ja|en).md`, permalink commonly `/app/<slug>/` or `/app/<name>/`
  - Announcements: `src/_announcements/<yyyy>/<slug>/...` (per-post files in each folder)
  - Notes: `src/_notes/<yyyy>/<slug>/...`
- Pages
  - `src/pages/*` contains localized static pages (`home`, `app`, `announcements`, `notes`, `contact`, `pgp`, `tip`, `404`), each duplicated in `ja` and `en` with frontmatter like:
    - `layout`, `lang`, `collection`, `permalink`, `description`, `title`, etc.
- Data
  - `src/_data/settings.yml`: site-wide settings (copyright, collection URLs/feeds, favicon, canonical)
  - `src/_data/profile.yml` and `src/_data/en/profile.yml`: localized profile data
  - `src/_data/texts.yml` and `src/_data/en/texts.yml`: UI strings and labels
  - `src/_data/meta.yml`: app-specific metadata (versions, store/source URLs)
- Assets
  - `src/assets/` contains images, icons, styles, JS. Jekyll compiles `styles.scss` (minified) and copies the rest.
- Rules files
  - `src/_headers`: Cloudflare Pages-compatible headers rules (also used by local server)
  - `src/_redirects`: redirect rules (also used by local server)

## Build pipeline (builder.ts)

Executed by `bun builder.ts`.

- Step 1: Run Jekyll (`JEKYLL_ENV=production jekyll build`). Destination defaults to `./_site`.
- Step 2: Minify
  - HTML: `html-minifier-terser` with conservative but effective options (whitespace collapse, remove comments/optional tags, etc.). CSS/JS minification within HTML is disabled; external JS files are minified separately.
  - XML: Custom pass that removes comments/whitespace between tags, but preserves embedded HTML blocks between `<!--html_content--> ... <!--/html_content-->` by minifying those as HTML.
  - JS: `terser` with `drop_console`/`drop_debugger`, mangle on, strip comments.
- Step 3: Process assets (cache busting)
  - Filters: from `_config.yml` `builder.processAssets.filters` (defaults include images/audio/css/js). Only files under `_site/assets` are processed.
  - Hashing: compute CRC32 of file, convert hex to a compact base32 string (`0123456789abcdefghijklmnopqrstuv`), and rename to `basename.<hash>-opt<ext>`.
  - Reference update: scan all HTML in `_site/` and replace occurrences of old asset paths with new hashed paths.
  - Redirects: append `302` rules to `_site/_redirects` from old asset URLs to the new hashed URLs.
- Step 4: Cleanup
  - Optionally remove empty `.atom` files (e.g., unwanted artifacts in `no-default`).

Notes and edge cases:
- Reference rewriting only scans `.html` files. If assets are referenced from CSS/JS, update those references manually or extend the builder.
- Pattern matching in `findFilesByPattern` is a simple `*`-to-`.*` regex transform (not full glob); keep filters simple.
- Asset processing removes the original files after writing the hashed ones.

## Local server (server.ts)

Emulates Cloudflare Pages rules and static serving.

- CLI: `--port <n>` (default 8080), `--dev` (disables compression, enables extra logs)
- Doc root: `_site`
- Redirects: parses `_site/_redirects`. Supports patterns with `:name` and `*` (`:splat`) and will interpolate captures into targets.
- Headers: parses `_site/_headers`. For each matched path, can set multiple header values, and explicitly unset headers using lines starting with `!`.
- Compression: for responses >= 1 KiB and compressible types, negotiates `br` then `gzip` using `Accept-Encoding` quality weights; sets `Content-Encoding` and `Vary: Accept-Encoding`.
- 404 handling: on a miss, walks up from the requested path to find the nearest `404.html` (e.g., language-specific 404 pages). Falls back to plain text if none are found.
- MIME types: common set for html/css/js/xml/atom/svg/png/jpg/gif/ico/webp.

## Conventions and tips

- Permalinks: content pages use trailing slashes; Jekyll writes `index.html` inside those folders.
- Hreflang alternates: `head.html` emits `<link rel="alternate" hreflang>` for `site.languages` (skipping `default_lang`).
- Canonical URLs: if `page.canonical` is set, it’s used; otherwise a canonical is computed from settings and the language permalink.
- Robots: pages marked `hidden: true` or `noindex: true` get `noindex`. Language-less redirect pages always get `noindex,noarchive`.
- Feeds: collection pages can show an Atom feed link if `settings.collections[collection].hasfeed` is `true`. The feed itself is rendered via `src/_layouts/atom.atom`.

## Adding content quickly

- New App page:
  - Create `src/_app/<slug>/<slug>.ja.md` and `.en.md`
  - Frontmatter: at least `layout: default`, `lang: ja|en`, `collection: app`, `permalink: "/app/<slug>/"`, `title`, `description`, `icon`, optional `itunes_app`
- New Announcement/Note:
  - Place under the corresponding collection folder structure with `layout: post`, `lang`, `collection`, `permalink` (or rely on collection defaults), `title`, `date`, optional `tags`, `update`, `hidden`
- New static page:
  - Place under `src/pages/<name>/<name>.(ja|en).md` with `layout`, `lang`, `collection`, `permalink`, `title`, etc.

## Cloudflare Pages mapping

- `_headers` and `_redirects` under `src/` are copied to `_site/` and consumed by Cloudflare Pages. The local server reads the same files to simulate behavior.
- The builder will append asset 302 redirects to `_site/_redirects` automatically.

## Gotchas / edge cases checklist

- Root (language-less) routes are redirect-only. Don’t put actual content there. Social previews should prefer the language pages (`/ja/...` or `/en/...`).
- Unknown client languages fall back to `en` in the redirect script. Adjust `fallback_lang` as needed.
- Asset hashing only touches files in `_site/assets` and updates references only in HTML.
- If you add new file types or want to skip some, adjust `_config.yml` under `builder.processAssets.filters`.
- If an Atom feed ends up empty for `no-default`, the builder can remove it (`cleanup.removeEmptyAtoms`).

## File map (high value targets)

- `_config.yml` — Jekyll + builder config
- `builder.ts` — post-Jekyll pipeline: minify, hash, rewrite, cleanup
- `server.ts` — local static server with headers/redirects and compression
- `src/_layouts/*` — page, post, feed, and base layouts
- `src/_includes/*` — shared fragments: head/meta, header, footer, boxes
- `src/_data/*` — site data (settings, profile, texts, meta)
- `src/pages/*` — localized pages (home, app, announcements, notes, etc.)
- `src/_app/*`, `src/_announcements/*`, `src/_notes/*` — collections content
- `src/_headers`, `src/_redirects` — CF Pages rules
- `src/assets/*` — styles, JS, images/icons

## Runbook

- Build once: `bun run build`
- Serve production-like: `bun run server`
- Serve after rebuild with logs: `bun run dev`

If anything in this overview drifts from code, treat the code as source of truth and update this file accordingly.

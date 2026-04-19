# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Astro 5 static site for 株式会社小森研究所 (Komori Laboratory Inc.). Published at `https://komori-lab.com`. Content is Japanese; keep UI copy, page titles, and commit-message conventions consistent with that.

## Commands

```bash
npm run dev              # astro dev server
npm run build            # outputs to dist/
npm run check            # astro check (type + template diagnostics)
npm run check:links      # walks dist/ and validates internal href/src (requires prior build)
npm run qa               # build + check + check:links + run-qa.mjs (responsive + Lighthouse)
```

`scripts/run-qa.mjs` has hard Windows-specific dependencies: it launches Edge from `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` via Playwright and `chrome-launcher`, and serves `dist/` on port 4173. It will exit early if either `dist/` or that Edge binary is missing, and the Lighthouse thresholds it enforces are perf ≥ 0.7 and a11y / best-practices / SEO ≥ 0.9. Don't run `qa` on non-Windows hosts without editing the script.

## Architecture

**Routing is file-based and trailing-slash-strict.** `astro.config.mjs` sets `trailingSlash: "always"`, so every internal link must end with `/`. Legacy URL compatibility lives in the same file's `redirects` map — add new 301s there, not in hosting config.

**Page kinds:**
- Top-level static pages (`index.md`, `profile/`, `contactus/`, `privacy/`, `activities/`) are Markdown pages that reference `BaseLayout.astro` via `layout:` frontmatter.
- Activity articles live at `src/pages/YYYY/MM/DD/<slug>/index.md`. The slug segment is Japanese text preserved from the WordPress export; links to these pages must be percent-encoded (see how `src/pages/index.md` and `src/pages/activities/index.md` link to them). The `layout:` path has five `../` segments because of the nested directory depth — match the existing articles.

**When adding a new activity article you must update three places:**
1. `src/pages/YYYY/MM/DD/<slug>/index.md` — the article itself with `ogType: article` and `publishedTime`.
2. `src/pages/activities/index.md` — append a dated entry to the list.
3. `src/pages/index.md` — update the "最近の活動" list on the top page.

There is no content collection or auto-index; these lists are hand-maintained. Keep them in sync.

**Layout + SEO:** `src/layouts/BaseLayout.astro` reads props from either direct props or `Astro.props.frontmatter` (so Markdown frontmatter flows straight in). It generates canonical URL, OG, and Twitter Card tags automatically — new pages should set `title`, `description`, and for articles `ogType: article` + `publishedTime`. Default OG image is `/images/og-default.png`.

**Shared data:** `src/data/company.ts` is the single source of truth for company facts, logo, and cover image paths. Import from there rather than hardcoding.

**Header navigation** is a hardcoded array in `src/components/Header.astro` (not data-driven). Note `/activities/` is not in the global nav — it's reachable only from the top page and article footers.

**Images:** Assets under `public/images/migrated/` are the WordPress-migrated content; reference them by absolute path (`/images/migrated/...`). All migrated images are `.webp`.

## Notes

- `docs/astro-rebuild-plan.md` is the project's ongoing migration TODO list with status by task — consult it before assuming something is unfinished.
- The `.astro/` and `dist/` directories are build output (gitignored). `check:links` operates on `dist/`, so always build first.
- `reports/lighthouse-home.json` is overwritten by each `npm run qa` run.

# Session Log — Scaffolding `zensical-test` and Migrating to Zensical

**Date:** 2026-09-11 / 2026-09-12
**Repo:** [dmccreary/zensical-test](https://github.com/dmccreary/zensical-test)
**Goal:** Scaffold a new intelligent-textbook project, then evaluate and adopt
[Zensical](https://zensical.org) — the Rust-based successor to MkDocs built by
the Material for MkDocs team — as an additional build system alongside
`mkdocs`, and deploy the result to GitHub Pages.

---

## 1. Scaffold the textbook (`book-installer` feature #0)

Ran the `book-installer` skill's `init-textbook` workflow (`/book-installer
init-textbook`) against an empty project directory (only `.git/` present).

### 1.1 Gathered inputs

- `git config user.name` → `Dan McCreary`
- `git remote get-url origin` → `https://github.com/dmccreary/zensical-test.git`
- `git branch --show-current` → `main` (already correct, no rename needed)
- `basename "$(pwd)"` → `zensical-test`
- `SITE_NAME` / `SITE_DESCRIPTION` had no sensible default. An initial
  `AskUserQuestion` prompt for these was dismissed by the user. The user then
  said **"get the description from the github site"**, so the description
  was pulled from the GitHub repo itself:

  ```bash
  gh repo view dmccreary/zensical-test --json name,description,homepageUrl,url
  # → "Test of migrating an mkdocs-material book to the new Zensical system"
  ```

  Resolved substitution table (confirmed with the user before writing files):

  | Variable | Value |
  |---|---|
  | `SITE_NAME` | Zensical Test |
  | `SITE_DESCRIPTION` | Test of migrating an mkdocs-material book to the new Zensical system |
  | `SITE_AUTHOR` | Dan McCreary |
  | `GITHUB_USERNAME` | dmccreary |
  | `REPO_NAME` | zensical-test |
  | `PRIMARY_COLOR` / `ACCENT_COLOR` | indigo / orange |
  | `YEAR` | 2026 |
  | Site URL | `https://dmccreary.github.io/zensical-test/` |

### 1.2 Copied and substituted templates

Copied every file from `book-installer/assets/init-textbook/` into the
project root, substituting `{{VAR}}` placeholders via a small Python script
(avoids `sed` escaping issues), renaming the two `.template` files:

- `AGENTS.md.template` → `AGENTS.md` (substituted)
- `CLAUDE.md.template` → `CLAUDE.md` (copied verbatim — must stay the
  one-line `@AGENTS.md` pointer)

Resulting tree:

```
.gitignore
AGENTS.md
CLAUDE.md
CONTENT-GENERATION-GUIDE.md
mkdocs.yml
zensical-test.code-workspace
plugins/social_override.py
docs/
├── index.md, about.md, course-description.md, contact.md, license.md
├── chapters/index.md
├── learning-graph/index.md
├── sims/index.md
├── css/extra.css
└── img/cover.png, license.png
```

### 1.3 Verification

```bash
grep -rn '{{[A-Z_]*}}' . --exclude-dir=.git   # → no placeholders left
find . -name '*.template' -not -path './.git/*'  # → no stray templates
[ "$(tr -d '[:space:]' < CLAUDE.md)" = "@AGENTS.md" ]  # → CLAUDE.md OK
mkdocs build --strict                         # → clean build
grep -E '(og|twitter):image' site/index.html  # → both point at img/cover.png
```

GitHub default-branch check (`gh repo view --json defaultBranchRef`) was
skipped — nothing had been pushed yet, so there was no default branch to
verify. Noted to re-check after the first push.

Removed the `site/` build artifact (already covered by `.gitignore`, which
excludes `site/` and `.cache/`).

---

## 2. Convert the build to Zensical

**User request:** "Please convert this site from the mkdocs material build
system to use the new zensical build system by the original authors of the
material theme."

Zensical was announced in November 2025 — after this session's knowledge
cutoff — so instead of guessing at its config format or CLI, this was
researched from primary sources before touching any files.

### 2.1 Research (web search + primary sources)

Used `WebSearch` and `WebFetch`, then pulled the actual Markdown source of
Zensical's own documentation site directly via
`raw.githubusercontent.com/zensical/docs` (more reliable than fetching the
rendered, JS-driven `zensical.org` pages). Key findings:

- Zensical is a from-scratch Rust+Python rewrite, MIT-licensed, built by the
  Material for MkDocs team, because upstream MkDocs has been unmaintained
  since August 2024.
- It can build an **existing `mkdocs.yml` directly** — no config rewrite
  required. Recommended adoption path is gradual: build the same project
  with both `mkdocs` and `zensical`, compare output, switch commands only
  once confident (`docs/compatibility/mkdocs/migration.md`).
- **Unsupported `mkdocs.yml` settings** (as of this check): `remote_branch`,
  `remote_name`, `exclude_docs`, `draft_docs`, `not_in_nav`, `hooks`.
- **Unsupported CLI flags**: `--theme`, `--use-directory-urls`,
  `--site-dir`, `gh-deploy`, `get-deps`.
- `theme.variant: classic` reproduces the Material-for-MkDocs look;
  `mkdocs-material` itself ignores this unknown key, so it's safe to add
  to a shared config.
- Plugin support (`docs/compatibility/mkdocs/plugins.md`): `search`,
  `glightbox`, `minify`, `tags`, `redirects`, `mkdocstrings`,
  `markdown-exec`, `meta`, `autorefs`, `awesome-nav`, `literate-nav`,
  `section-index`, `table-reader` are natively supported. **`social` and
  `blog` are still "in progress"** — no equivalent yet for
  `mkdocs-material[imaging]`'s social-card generation.

### 2.2 Installed Zensical

```bash
pip install zensical
# Successfully installed deepmerge-3.0.1 tomli-2.4.1 zensical-0.0.61
```

Installed into the same `mkdocs` conda environment already used for
`mkdocs`/`mkdocs-material`, matching how this project already manages Python
dependencies (no `requirements.txt` / `pyproject.toml` in the repo either
way).

### 2.3 Discovered and diagnosed a Zensical bug

First attempt to build the real project with the as-scaffolded `mkdocs.yml`:

```bash
zensical build
# Build started
# Build finished in 0.05s
```

No error, no warning — but `site/` was **empty**. `zensical build --clean`,
`-s/--strict`, and `RUST_LOG=debug` all reproduced the same silent
zero-output result.

**Isolation process:**

1. Copied the exact same `mkdocs.yml` + `docs/` + `plugins/` content into a
   scratch directory and built it there with `-f mkdocs-full.yml` (a
   different filename) → **succeeded**, "No issues found", 23 files written.
   This ruled out the file content, the presence of `hooks:`/`exclude_docs:`,
   the git-remote configuration, and the (zero-commit) state of the git repo
   as causes — none of those differed between the working and failing case
   in a way that mattered yet.
2. Renamed the identical, working file in the scratch directory to
   `mkdocs.yml` (the canonical name) → **failed** the same way (0 files, no
   error). Renaming it back to any other name → succeeded again. This
   proved the bug was tied specifically to the config file being named
   `mkdocs.yml`.
3. Bisected the content: stripped `hooks:` and `exclude_docs:` from the
   `mkdocs.yml`-named file → **still failed**, ruling those two keys out.
4. Noticed the project's `watch:` block:
   ```yaml
   watch:
     - docs
     - mkdocs.yml
   ```
   Removed the `- mkdocs.yml` line only (keeping the filename `mkdocs.yml`
   and everything else, including `hooks:`/`exclude_docs:`) → **succeeded**,
   "No issues found", 23 files.

**Root cause:** when a Zensical config file is named `mkdocs.yml` *and* its
own `watch:` list contains an entry equal to that same filename
(`mkdocs.yml`), `zensical build` silently produces zero pages — exit code 0,
no warnings, even under `--strict`. This is copied directly from MkDocs's own
convention (`mkdocs.yml` commonly watches itself so `mkdocs serve` reloads on
config edits), so any project migrating an existing `mkdocs.yml` is likely to
hit it. Not filed upstream during this session — the user was offered the
option and can request it be filed at
<https://github.com/zensical/zensical/issues>.

### 2.4 Fixes applied to `mkdocs.yml`

```diff
 theme:
   name: material
+  # `variant: classic` tells Zensical to render the Material-for-MkDocs look;
+  # mkdocs-material itself ignores this key (harmless under the old builder).
+  variant: classic
```

```diff
-# Rebuild on changes during `mkdocs serve`
+# Rebuild on changes during `mkdocs serve`
+# NOTE: do not add `mkdocs.yml` to this list. A `watch:` entry matching the
+# config file's own name makes Zensical v0.0.61 (and possibly later) silently
+# emit zero pages on `zensical build` -- no error, no warning, just an empty
+# site/ dir. Reproduced with a minimal repro; see
+# https://github.com/zensical/zensical/issues (file a report if unfixed).
+# mkdocs itself handles this fine, but the shared config must stay
+# dual-compatible, so this entry is left out for both builders.
 watch:
   - docs
-  - mkdocs.yml
```

`hooks:` and `exclude_docs:` were **left in place** — Zensical silently
ignores unsupported keys rather than erroring, so the config stays
dual-compatible. The functional consequence was called out to the user
instead of being papered over:

- `plugins/social_override.py` (loaded via `hooks:`) never runs under
  Zensical → Zensical builds have no `og:image` / `twitter:image` tags.
  `mkdocs build` still injects them correctly.
- `exclude_docs:` isn't honored → any future `TODO.md` or `image-prompt*.md`
  files would leak into a Zensical build's search index and sitemap, where
  `mkdocs` excludes them. No such files exist yet, so no current impact.

### 2.5 Documented the findings in `AGENTS.md`

Added a paragraph to the existing "Build and serve rules" section covering:
the `zensical build` / `zensical serve` commands, the shared `mkdocs.yml`,
the `hooks:`/`exclude_docs:`/`social` gaps, and an explicit warning never to
re-add a self-referencing entry to `watch:`. Also extended the "never start
or kill `mkdocs serve`" rule to `zensical serve` for the same reason (the
author runs their own dev server and watches its console).

### 2.6 Final verification

```bash
zensical build -s      # → "No issues found", 23 files
mkdocs build --strict  # → clean, 58 files
```

Both builders pass against the same `mkdocs.yml`. Build artifacts
(`site/`, `.cache/`, `plugins/__pycache__/`) and scratch test directories
were removed before handing back control.

---

## 3. Deploy to GitHub Pages

**User's attempt:**

```
$ zensical gh-deploy
Error: No such command 'gh-deploy'.
```

Confirmed via Zensical's own `docs/publish-your-site.md` (fetched from
`raw.githubusercontent.com/zensical/docs`) that `gh-deploy` has no
equivalent — the documented replacement is a GitHub Actions workflow that
runs `zensical build --clean` and deploys through GitHub's native
"Pages from Actions" mechanism (`actions/upload-pages-artifact` +
`actions/deploy-pages`). This approach never creates a `gh-pages` branch,
which also sidesteps the "gh-pages becomes the default branch" footgun the
`book-installer` skill normally has to guard against for `mkdocs gh-deploy`.

### 3.1 Checked current state

```bash
gh api repos/dmccreary/zensical-test/pages        # → 404, Pages not enabled
gh api repos/dmccreary/zensical-test --jq '.default_branch, .has_pages'
# → main, false
```

Clean slate: nothing pushed yet, Pages never configured.

### 3.2 Created the workflow

Wrote `.github/workflows/docs.yml` (verbatim from Zensical's own
recommended template, trimmed to trigger on `main` only):

```yaml
name: Documentation
on:
  push:
    branches:
      - main
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/configure-pages@v6
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v6
        with:
          python-version: 3.x
      - run: pip install zensical
      - run: zensical build --clean
      - uses: actions/upload-pages-artifact@v5
        with:
          path: site
      - uses: actions/deploy-pages@v5
        id: deployment
```

### 3.3 Confirmed with the user before touching shared state

Asked via `AskUserQuestion` whether to (a) push `main` and enable the Pages
"GitHub Actions" source, (b) just push and let the user configure Pages
themselves, or (c) not push yet. User chose **(a)**.

### 3.4 Executed — and hit a race condition

```bash
gh api -X POST repos/dmccreary/zensical-test/pages -f build_type=workflow
```

While that call was being made, the user had already run their own
`git add` / `git commit` / `git push` in a separate terminal (visible from
`git log` afterward — commit `d04b4c1`, authored by Dan McCreary, message
*"Showed that I can run 'zensical build' on the current system and it works
just like the 'mkdocs build' worked in the past. serve also works. Zensical
does not have a gh-deploy option."*). The push's Actions run started before
the Pages API call had taken effect:

```bash
gh run list --repo dmccreary/zensical-test --limit 5
# completed  failure  ...  Documentation  main  push  34671970695  10s
```

```
##[error]Get Pages site failed. Please verify that the repository has Pages
enabled and configured to build using GitHub Actions ...
```

### 3.5 Recovered

```bash
gh run rerun 34671970695 --repo dmccreary/zensical-test
gh run watch 34671970695 --repo dmccreary/zensical-test --exit-status
# → Run Documentation (34671970695) has already completed with 'success'
```

### 3.6 Verified the live site

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://dmccreary.github.io/zensical-test/
# 200
curl -s https://dmccreary.github.io/zensical-test/ | grep -oE '<title>[^<]+</title>'
# <title>Zensical Test - Zensical Test</title>
```

Site is live at <https://dmccreary.github.io/zensical-test/>, built and
deployed by Zensical via GitHub Actions. Every future push to `main`
rebuilds and redeploys automatically.

---

## Open items / things worth revisiting later

- **File the Zensical bug upstream** (§2.3) if it's still reproducible on a
  newer release — a self-referencing `watch:` entry silently zeroing the
  build is a sharp edge for anyone migrating an existing `mkdocs.yml`.
- **`hooks:` / `exclude_docs:` / `social` plugin** are unsupported in
  Zensical as of v0.0.61. Revisit `plugins/social_override.py`'s Zensical
  behavior once Zensical's `social` plugin work lands (tracked in their
  public roadmap as "in progress").
- The duplicated page title (`Zensical Test - Zensical Test`) is pre-existing
  scaffold behavior (page frontmatter `title:` happens to equal `site_name`
  for the home page) and reproduces identically under both `mkdocs` and
  `zensical` — not a migration regression, just worth fixing whenever the
  real book title is decided.

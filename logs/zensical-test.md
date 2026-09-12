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
hit it.

**Filed upstream:** [zensical/zensical#934](https://github.com/zensical/zensical/issues/934).
Before filing, searched the tracker and found closely related prior art —
[#726](https://github.com/zensical/zensical/issues/726) described the same
"empty site, no HTML pages" symptom as a race between the config/theme
watch order and the docs-directory watch, and was closed as a duplicate of
[#641](https://github.com/zensical/zensical/issues/641) (closed "resolved"
2026-09-02, though #641's actual symptom — stale link-validation warnings on
large sites — is different from the empty-site case). Confirmed on `zensical`
0.0.61 (installed after the #641 fix shipped) that the plain race from #726
is fixed (`watch: [docs]` alone builds correctly, 5/5 runs), but a
self-referencing `watch:` entry reintroduces a **100%-deterministic** version
of the same empty-site symptom (0/5 → 5/5 across five repeated runs each
way). The issue includes a 2-file, 7-line minimal reproduction and the
determinism data instead of the template's requested `.zip` attachment,
which isn't practical to produce via `gh issue create` (no interactive file
upload from the CLI).

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

## 4. Recover social preview meta tags without `hooks:`

**User's concern:** of the two known Zensical gaps, missing `exclude_docs:`
was tolerable, but losing per-page social-card overrides (`og:image` /
`twitter:image` driven by a page's `image:` frontmatter) was called out as a
real loss of functionality. Asked whether this could be added to Zensical.

### 4.1 Two angles considered

1. **Contribute it upstream to Zensical itself.** Not practical yet: Zensical
   is a Rust codebase moving away from a Python-hook plugin model entirely,
   toward a "module system" whose public API isn't released yet (per the
   [roadmap](https://zensical.org/about/roadmap/), Python bindings via PyO3
   are planned but not public). The `social` plugin is already listed
   in-progress on their own compatibility roadmap — a third-party PR isn't
   realistic before that public API exists.
2. **Reproduce the feature locally, without waiting on upstream.** This is
   what got built (below) — it doesn't need any Zensical change at all.

### 4.2 Key discovery: mkdocs-material's base theme has *no* og/twitter tags

Checked what Zensical emits with zero hooks/plugins active:

```bash
grep -iE '<meta (name|property)="(og|twitter|description)' site/index.html
# → only <meta name="description" ...>
```

Then checked `mkdocs-material`'s own installed template source
(`site-packages/material/templates/base.html` and everything under
`templates/`) for `og:`/`twitter:` tags — **none exist**. Those tags are
*only* ever injected by the `social` plugin's own Python post-processing
(the same technique `plugins/social_override.py` already used). This means
the feature was never a built-in theme capability on the mkdocs side either
— it was always plugin/hook-injected — which meant the fix didn't need to
special-case Zensical, just move the existing logic to a mechanism both
builders share.

### 4.3 The fix: a theme override instead of a hook

`base.html` (both mkdocs-material and Zensical's `classic` variant) exposes
an empty `{% block extrahead %}{% endblock %}` specifically for this kind of
customization, extended via `theme.custom_dir`. Template overrides are pure
Jinja (mkdocs) / MiniJinja (Zensical) — no Python involved — and are
officially supported by both builders, unlike `hooks:`.

Prototyped in an isolated copy (`/tmp/social-override-poc`) at
`overrides/main.html`, extending `base.html`'s `extrahead` block. First pass
defaulted every imageless page to the site cover — caught immediately as
exactly the "historical footgun" `init-textbook.md` already warns about
(clobbering a future per-page auto-generated card). Corrected to match
`plugins/social_override.py`'s actual semantics exactly: **no-op unless the
page declares `image:` in its frontmatter** — no site-wide default.

Verified byte-for-byte identical output between builders, on both a page
with `image:` (the home page) and one without (`about.md`):

```bash
# Homepage — both builders produce the identical 9 meta tags
mkdocs build --strict && grep -iE '<meta (property|name)="(og|twitter)' site/index.html
zensical build -s      && grep -iE '<meta (property|name)="(og|twitter)' site/index.html

# about.md (no `image:`) — zero tags on both, confirming the no-op path
mkdocs build --strict && grep -icE '<meta (property|name)="(og|twitter)' site/about/index.html  # → 0
zensical build -s      && grep -icE '<meta (property|name)="(og|twitter)' site/about/index.html  # → 0
```

### 4.4 Applied to the real project

- Added [overrides/main.html](../overrides/main.html) — extends `base.html`,
  reproduces `plugins/social_override.py`'s exact conditional logic in
  Jinja/MiniJinja, and additionally emits `og:type`, `og:title`,
  `og:description`, `og:url`, and `twitter:card`/`title`/`description` (the
  old hook only ever touched the two image tags; those companions are
  needed for platforms like Twitter/Slack to render a full-size image card
  rather than falling back to a small thumbnail or no preview at all).
- `mkdocs.yml`: added `theme.custom_dir: overrides`; removed the `hooks:`
  block entirely (replaced by a comment pointing at the new mechanism).
- Deleted `plugins/social_override.py` and the now-empty `plugins/`
  directory — keeping both the hook and the override active would have
  double-emitted the same meta tags under `mkdocs`.
- Updated `AGENTS.md` to warn against reintroducing the old hook.
- Re-verified `mkdocs build --strict` and `zensical build -s` both still
  pass clean on the real project, with matching og/twitter output.

Net effect: the social-preview-override feature now works identically on
both builders today, with no dependency on Zensical's `social` plugin ever
shipping.

---

## Open items / things worth revisiting later

- Watch [zensical/zensical#934](https://github.com/zensical/zensical/issues/934)
  for a fix, and re-test whether the `watch:` self-reference can be safely
  restored once it lands.
- **`exclude_docs:`** is still unsupported in Zensical as of v0.0.61 — no
  workaround implemented (harmless today; no `TODO.md`/`image-prompt*.md`
  files exist yet). **The `social` plugin gap (§4) is now mitigated** by
  `overrides/main.html`; what's still genuinely missing is Cairo-style
  *auto-generated* card images (text-on-image compositing) for pages that
  don't declare their own `image:` — revisit if/when Zensical's native
  `social` plugin ships.
- The duplicated page title (`Zensical Test - Zensical Test`) is pre-existing
  scaffold behavior (page frontmatter `title:` happens to equal `site_name`
  for the home page) and reproduces identically under both `mkdocs` and
  `zensical` — not a migration regression, just worth fixing whenever the
  real book title is decided.

# Migration Steps: MkDocs to Zensical

[Why Zensical?](why-zensical.md) makes the case for switching. This page is
the "how" that page doesn't cover: the concrete, ordered steps this project
followed to migrate its own `mkdocs.yml`-driven site, including the gotchas
that cost real debugging time. Every command and config snippet below was
run against this repository; the version numbers and gap list are current
as of **Zensical 0.0.61** — re-check them against your own installed
version, since Zensical is still under active development.

## Prerequisites

- An existing site that builds with `mkdocs build` today, using MkDocs +
  Material for MkDocs, driven by a single `mkdocs.yml`.
- Python 3.x and a way to install packages (`pip`, or `uv` — see the
  tooling note in Step 1).
- Comfort reading a build's console output closely. Most Zensical gaps in
  this migration showed up as **silence** — an empty `site/` directory with
  no error and exit code 0 — rather than a message telling you something
  was wrong.

!!! note "This is not a rewrite"
    Zensical reads the same `mkdocs.yml` every MkDocs project already has.
    Nothing here requires touching your Markdown content, and most of it
    doesn't even require changing your config — you are adding a second
    builder to test *against* your existing one, not replacing it yet.

## Step 1 — Install Zensical alongside MkDocs

Install it into the same environment you already use for
`mkdocs`/`mkdocs-material` — there is no need for a separate one:

```bash
pip install zensical
# or, preferring the faster Rust-based installer:
uv pip install zensical
```

Confirm it installed and can at least parse your existing config:

```bash
zensical build
```

## Step 2 — Treat a silent, empty `site/` as a failure, not a pass

Zensical's build behavior is stricter to read than MkDocs' in one specific
way: unsupported config keys are silently ignored rather than rejected, and
at least one known bug (Step 4 below) produces a **clean exit with zero
output files and no warning at all**. Never trust "the command didn't
error" — always check that `site/` actually contains the pages you expect:

```bash
zensical build -s          # -s / --strict: still won't catch everything
find site -name '*.html' | wc -l
```

Compare that count against a known-good `mkdocs build --strict` run of the
same project before doing anything else.

## Step 3 — Check your `mkdocs.yml` against the known compatibility gaps

Before relying on a Zensical build, scan your config for settings and CLI
flags Zensical doesn't support yet:

**Unsupported `mkdocs.yml` settings** (as of 0.0.61): `remote_branch`,
`remote_name`, `exclude_docs`, `draft_docs`, `not_in_nav`, `hooks`.

**Unsupported CLI flags**: `--theme`, `--use-directory-urls`, `--site-dir`,
`gh-deploy`, `get-deps`.

**Plugins natively supported**: `search`, `glightbox`, `minify`, `tags`,
`redirects`, `mkdocstrings`, `markdown-exec`, `meta`, `autorefs`,
`awesome-nav`, `literate-nav`, `section-index`, `table-reader`.

**Plugins still "in progress"** (no equivalent yet): `social` (the
Cairo-based auto-generated social-card *images* — Step 6 covers the
per-page `og:image`/`twitter:image` *tags*, which is a separate,
already-solvable problem) and `blog`.

One config addition is worth making regardless of which builder you use
day to day:

```yaml
theme:
  name: material
  variant: classic   # tells Zensical to render the Material-for-MkDocs look
```

`mkdocs-material` itself ignores the unknown `variant` key, so it's safe to
add to a config both builders read.

Keys Zensical doesn't support (`hooks:`, `exclude_docs:`, etc.) can usually
stay in the file rather than being deleted — Zensical ignores what it
doesn't recognize instead of erroring, which keeps the config
dual-compatible. Just know exactly what silently stops working on the
Zensical side (see Step 6 for the `hooks:` case specifically), and say so
out loud rather than assuming nothing changed.

## Step 4 — Watch for the self-referencing `watch:` bug

If your `mkdocs.yml` has a `watch:` block that includes itself — a common
MkDocs convention, so `mkdocs serve` reloads when you edit the config —
you will hit this:

```yaml
watch:
  - docs
  - mkdocs.yml   # <-- this line
```

**Symptom:** `zensical build` exits 0, prints no warning, and writes zero
files to `site/`. This reproduces 100% of the time, and only when *both*
conditions hold: the config file is literally named `mkdocs.yml`, **and**
its own `watch:` list contains an entry equal to that filename.

**Fix:** remove the self-referencing entry.

```diff
 watch:
   - docs
-  - mkdocs.yml
```

This is tracked upstream as
[zensical/zensical#934](https://github.com/zensical/zensical/issues/934).
Check whether it's fixed in the Zensical version you're installing before
assuming you still need this workaround.

## Step 5 — Verify output matches, don't just eyeball it

Once both builders produce a non-empty `site/`, confirm they agree on the
things that actually matter to readers, not just page counts. For anything
templated (meta tags, generated navigation, anything driven by a plugin or
hook), grep the same selector out of both builds and diff them:

```bash
mkdocs build --strict && grep -iE '<meta (property|name)="(og|twitter)' site/index.html > /tmp/mkdocs-tags.txt
zensical build -s      && grep -iE '<meta (property|name)="(og|twitter)' site/index.html > /tmp/zensical-tags.txt
diff /tmp/mkdocs-tags.txt /tmp/zensical-tags.txt
```

Do this for at least one page that exercises whatever templating your site
relies on, and one plain page that doesn't — a divergence that only shows
up on one of the two tells you exactly which feature needs Step 6's
treatment.

## Step 6 — Replace `hooks:` with a theme override

`hooks:` (MkDocs' Python post-build-processing mechanism) has no Zensical
equivalent and isn't on its roadmap the way plugins are — Zensical is
moving toward a Rust "module system" instead. If your `hooks:` file injects
markup (the common case: per-page social preview meta tags driven by an
`image:` frontmatter field), you likely don't need to wait for Zensical to
support it. Check whether your theme's `base.html` exposes an
`{% block extrahead %}{% endblock %}` — both `mkdocs-material` and
Zensical's `classic` variant do — and move the logic there instead:

```yaml
theme:
  name: material
  custom_dir: overrides   # holds main.html, extending base.html
```

```html
<!-- overrides/main.html -->
{% extends "base.html" %}
{% block extrahead %}
  {{ super() }}
  {% if page and page.meta and page.meta.image %}
    <meta property="og:image" content="{{ page.meta.image }}">
    <meta name="twitter:image" content="{{ page.meta.image }}">
  {% endif %}
{% endblock %}
```

Template overrides are plain Jinja under MkDocs and MiniJinja under
Zensical — no Python involved — so this is one file that works identically
on both builders, instead of a Python `hooks:` file that only ever worked
on one. Delete the old `hooks:`-based file once the override is verified
(Step 5's diff technique) to match its output exactly; keeping both active
would double-emit the same tags under MkDocs.

## Step 7 — Update your deployment: `gh-deploy` has no equivalent

`zensical gh-deploy` doesn't exist as a command. The documented replacement
is a GitHub Actions workflow that builds with Zensical and deploys through
GitHub's native "Pages from Actions" mechanism — which also means you never
get a `gh-pages` branch, sidestepping the classic "gh-pages became my
default branch" footgun that comes with `mkdocs gh-deploy`.

```yaml
# .github/workflows/docs.yml
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

Before your first push, enable the "GitHub Actions" Pages source — either
in the repo's Settings → Pages UI, or via the API:

```bash
gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow
```

**Race-condition gotcha:** if you push to `main` before that Pages source
finishes enabling, the triggered run can fail with "Get Pages site failed.
Please verify that the repository has Pages enabled..." even though your
build itself was fine. Just rerun it once Pages is confirmed enabled:

```bash
gh run rerun <run-id> --repo OWNER/REPO
gh run watch <run-id> --repo OWNER/REPO --exit-status
```

## Step 8 — Cut over, but keep `mkdocs build --strict` as your safety net

Once Steps 3-7 are done and Step 5's diffs come back clean, you can make
`zensical build`/`zensical serve` your day-to-day commands — they're
faster. But don't retire `mkdocs build --strict` yet: it still catches
things Zensical doesn't flag today, like nav omissions and broken internal
links. Run it as the authoritative correctness check before calling any
change verified, even on a project whose everyday builds already use
Zensical. This project's own [AGENTS.md](https://github.com/dmccreary/zensical-test/blob/main/AGENTS.md)
encodes exactly this rule for coding agents working in this repo.

## Quick-reference: known gaps as of Zensical 0.0.61

| Gap | Symptom | Workaround |
|---|---|---|
| `exclude_docs:` silently ignored | Files meant to be hidden (e.g. `TODO.md`, `image-prompt*.md`) build and get indexed anyway | None yet — keep such files out of `docs/` entirely until this ships |
| `social` plugin (auto-generated card *images*) not implemented | No Cairo-composited social card for pages without their own `image:` | Give every page its own `image:` frontmatter (Step 6 covers the resulting meta tags) |
| `hooks:` unsupported | Any Python post-build logic silently never runs | Move markup-injecting logic to a `theme.custom_dir` template override (Step 6) |
| Self-referencing `watch:` entry | `zensical build` exits 0 with an empty `site/`, no warning | Remove the entry matching the config's own filename (Step 4); track [#934](https://github.com/zensical/zensical/issues/934) |
| `gh-deploy` has no equivalent | `Error: No such command 'gh-deploy'` | GitHub Actions + Pages-from-Actions workflow (Step 7) |

## Verification checklist

- `zensical build -s` produces the same page count as `mkdocs build
  --strict`.

- `mkdocs.yml` has been checked against the unsupported-settings and
  unsupported-flag lists in Step 3.

- The `watch:` block, if present, does not contain an entry matching the
  config file's own name.

- Templated output (meta tags, or anything else a `hooks:` file used to
  produce) has been diffed between both builders, not just visually
  skimmed.

- Deployment no longer depends on `mkdocs gh-deploy`.

- `mkdocs build --strict` still runs as the authoritative check, even after
  `zensical build` becomes the everyday command.

## Further reading

- [Why Zensical?](why-zensical.md) — the architectural case for making this
  switch at all.
- [Background on Web Publishing Tools](background-on-web-publishing-tools.md) —
  where MkDocs and Zensical sit in six decades of publishing-tool history,
  plus an interactive look at sequential versus parallel build scheduling.
- [References](references.md) — links to the Zensical docs, GitHub
  organization, and issue tracker.

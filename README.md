# Zensical Test

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![Zensical](https://img.shields.io/badge/Also%20builds%20with-Zensical-1a1a2e)](https://zensical.org)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/zensical-test/)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/ibook-skills)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the site at: **[dmccreary.github.io/zensical-test](https://dmccreary.github.io/zensical-test/)**

## Overview

This repository is a working testbed for migrating an [intelligent
textbook](https://dmccreary.github.io/intelligent-textbooks/) scaffold from
[MkDocs](https://www.mkdocs.org/) + [Material for
MkDocs](https://squidfunk.github.io/mkdocs-material/) to
[Zensical](https://zensical.org), the Rust-based successor to MkDocs built by
the Material team. It is not a published textbook — it is scaffold-stage
content (one demo chapter-free MicroSim, no chapters or learning graph yet)
used specifically to answer one question: *can a real MkDocs Material project
be built and deployed with Zensical today, and what breaks along the way?*

The project builds identically with **both** tools from a single
`mkdocs.yml`:

```bash
mkdocs build --strict   # the established builder
zensical build -s       # the new one — same config, same output
```

Everything found while doing this migration — including a reproducible
Zensical bug and its workaround — is written up in
[`logs/zensical-test.md`](./logs/zensical-test.md).

## Zensical Migration Notes

- **Filed upstream**: a config file named `mkdocs.yml` whose own `watch:`
  list contains an entry matching that filename makes `zensical build`
  silently emit zero pages — no error, no warning. Reported as
  [zensical/zensical#934](https://github.com/zensical/zensical/issues/934)
  with a 100%-deterministic, 2-file minimal reproduction.
- **Social preview cards, without `hooks:`**: Zensical doesn't support
  MkDocs' Python `hooks:` mechanism, which this project originally used to
  set `og:image`/`twitter:image` per page. The fix, in
  [`overrides/main.html`](./overrides/main.html), moves that same logic into a
  plain Jinja/MiniJinja theme override extending `base.html`'s `extrahead`
  block — a mechanism both builders support natively. Verified
  byte-for-byte identical output between `mkdocs build` and `zensical
  build` on pages with and without a declared `image:`.
- **Deploys via GitHub Actions**, not `mkdocs gh-deploy` (which Zensical has
  no equivalent for) — see [`.github/workflows/docs.yml`](.github/workflows/docs.yml).
- **Known remaining gap**: `exclude_docs:` is silently ignored by Zensical
  as of v0.0.61. Harmless today (no `TODO.md`/`image-prompt*.md` files
  exist in this repo yet).

## Site Status and Metrics

| Metric | Count |
|--------|-------|
| Concepts in Learning Graph | 0 |
| Chapters | 0 |
| MicroSims | 1 |
| Glossary Terms | 0 |
| FAQ Questions | 0 |
| Quiz Questions | 0 |
| References | 0 |
| Total Words | 1,120 |
| Equivalent Pages | 4 |

**Completion Status:** Scaffold stage. This repo intentionally has no
chapters or learning graph yet — its purpose is the build-system migration
above, not textbook content. The one MicroSim
([Bouncing Ball](./docs/sims/bouncing-ball/index.md)) exists to exercise and
visually confirm the social-preview-card override on a real page.

Regenerate this table with `bk-generate-book-metrics` (or
`python3 "$BK_HOME/src/book-metrics/book-metrics.py" docs`), which writes the
canonical source of truth to
[`docs/learning-graph/book-metrics.json`](./docs/learning-graph/book-metrics.json).

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/zensical-test.git
cd zensical-test
```

### Installation

Either builder works from the same `mkdocs.yml`:

```bash
pip install mkdocs mkdocs-material   # the established builder
pip install zensical                 # the new one
```

### Usage

```bash
mkdocs build --strict   # or: zensical build -s
mkdocs serve            # or: zensical serve
```

Open your browser to `http://localhost:8000`.

### Deployment

Every push to `main` builds and deploys automatically via
[`.github/workflows/docs.yml`](.github/workflows/docs.yml) (GitHub Actions →
GitHub Pages). There is no manual deploy step and no `gh-pages` branch.

## Repository Structure

```
zensical-test/
├── docs/                          # MkDocs/Zensical documentation source
│   ├── index.md                   # home page (declares its own social image)
│   ├── about.md, course-description.md, contact.md, license.md
│   ├── chapters/                  # chapter landing page (no chapters yet)
│   ├── learning-graph/            # learning-graph landing page + book metrics
│   ├── sims/
│   │   └── bouncing-ball/         # demo MicroSim (p5.js) — tests the social override
│   │       ├── main.html          # standalone, iframe-embeddable simulation
│   │       ├── bouncing-ball.js
│   │       ├── bouncing-ball.png  # its own social preview image
│   │       └── index.md
│   └── css/extra.css              # status-indicator dots, cover-image styles
├── overrides/
│   └── main.html                  # social preview meta tags — works on both builders
├── .github/workflows/docs.yml     # build + deploy on push to main
├── logs/zensical-test.md          # full migration session log
├── mkdocs.yml                     # shared config for both mkdocs and zensical
├── AGENTS.md                      # agent instructions (single source of truth)
└── CLAUDE.md                      # imports AGENTS.md
```

## Reporting Issues

Found a bug, typo, or have a suggestion for improvement? Please report it:

[GitHub Issues](https://github.com/dmccreary/zensical-test/issues)

## License

This work is licensed under the [Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International
License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**

- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

See [docs/license.md](./docs/license.md) for full details.

## Acknowledgements

- **[MkDocs](https://www.mkdocs.org/)** and **[Material for
  MkDocs](https://squidfunk.github.io/mkdocs-material/)** — the established
  static site generator and theme this project started from
- **[Zensical](https://zensical.org)** — the Rust-based successor being
  evaluated here, built by the Material for MkDocs team
- **[p5.js](https://p5js.org/)** — creative coding library from NYU ITP,
  used for the Bouncing Ball MicroSim
- **[Claude Code](https://claude.ai/code)** by Anthropic — AI-assisted
  scaffolding, migration, and content generation
- **[GitHub Pages](https://pages.github.com/)** and **GitHub Actions** —
  free hosting and CI/CD for this project

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, suggestions, or collaboration opportunities? Feel free to connect
on LinkedIn or open an issue on GitHub.

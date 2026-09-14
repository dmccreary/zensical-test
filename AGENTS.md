# AI Agent Instructions — Zensical Test

Welcome, Agent. You have been asked to generate, edit, or validate content for the **Zensical Test** intelligent textbook.

This file is the entry point for *every* coding agent working in this repo. `CLAUDE.md` contains only `@AGENTS.md`, so Claude Code, Codex, Cursor, and any other agent that looks for `AGENTS.md` all read the same instructions. Keep the rules here — never fork them into `CLAUDE.md`.

These rules ride **on top of** the author's global agent rules
(`~/.claude/CLAUDE.md` for Claude Code). Where the two disagree, the global rules win.

## Read this before generating content

Before you write or edit any student-facing markdown — chapters, quizzes, FAQ, entries, glossary prose, lesson plans — you **MUST** read and follow:

```
CONTENT-GENERATION-GUIDE.md
```

It defines the concept-depth and word-count targets, the anti-padding and
writing-style rules, the MicroSim expectations, and the Markdown formatting
rules for this book. Content that ignores it produces broken layouts and an
inconsistent student experience.

## Project facts

| | |
|---|---|
| Book title | Zensical Test |
| Published site | https://dmccreary.github.io/zensical-test/ |
| Repository | https://github.com/dmccreary/zensical-test |
| Site generator | MkDocs Material |

Where things live:

```
mkdocs.yml                  site config and nav (the single source of nav truth)
CONTENT-GENERATION-GUIDE.md content rules — read before generating
docs/migration-steps.md     step-by-step MkDocs -> Zensical migration guide;
                             follow it when migrating a different repo
overrides/main.html         og:/twitter: meta-tag theme override (replaced
                             the old plugins/social_override.py hook — works
                             on both builders, see Build and serve rules)
docs/chapters/              chapter content, one directory per chapter
docs/learning-graph/        concept list, taxonomy, dependency graph, metrics
docs/sims/                  MicroSims, one directory per sim
docs/css/extra.css          custom CSS (status indicators, iframe styles)
docs/img/                   cover image, license badge, mascot poses
```

## Build and serve rules

- **Never start or kill `mkdocs serve`.** The author runs it in their own
  terminal so they can watch the console for rebuild errors. Starting a second
  server silently binds a different port and produces confusing results.
- To check your work, use `mkdocs build --strict`. Strict mode turns broken
  nav links and missing files into errors instead of warnings.
- Every new page must be added to the `nav:` block in `mkdocs.yml`. A page that
  exists on disk but not in `nav:` is invisible to readers and trips
  `--strict`.
- **Never add `navigation.tabs`** (or `navigation.tabs.sticky`) to
  `mkdocs.yml`. This book uses side navigation optimized for wide landscape
  screens; top tabs waste vertical space. If you find that line, remove it and
  tell the author.
- This project also builds with **Zensical** (`zensical build`, `zensical
  serve`), the Rust-based successor to MkDocs from the Material team. It reads
  the same `mkdocs.yml`, so keep changes compatible with both builders.
  **Prefer `zensical build` for a quick check while iterating** — it's the
  faster of the two — but `mkdocs build --strict` remains the one
  **authoritative** check (see *Quality assurance* below): it catches nav
  omissions and broken links that Zensical doesn't yet flag, so a clean
  `zensical build` alone never means a change is verified. Two
  gaps remain as of Zensical 0.0.61: `exclude_docs:` is silently ignored (no
  workaround yet; harmless until a `TODO.md`/`image-prompt*.md` file exists),
  and the `social` plugin (Cairo-based auto-generated card *images*) isn't
  implemented. **Per-page social preview meta tags (`og:image` /
  `twitter:image`) DO work on both builders** — implemented as a theme
  override at `overrides/main.html` (extends `base.html`'s `extrahead`
  block) rather than a `hooks:` entry, since `hooks:` (Python
  post-processing) is unsupported under Zensical but template overrides are
  plain Jinja/MiniJinja and work on both. **Do not reintroduce
  `plugins/social_override.py` or a `hooks:` block** — the override
  supersedes it; keeping both would double-emit the same meta tags under
  mkdocs. **Never add an entry matching the config
  file's own name (`mkdocs.yml`) to `watch:`** — this makes Zensical
  silently emit zero pages
  ([zensical/zensical#934](https://github.com/zensical/zensical/issues/934)).
  **Never start or kill `zensical
  serve`** either, for the same reason as `mkdocs serve` above.
- **Prefer `uv` over `pip`** for any local Python environment work in this
  repo — e.g. `uv pip install mkdocs mkdocs-material zensical` instead of
  `pip install mkdocs mkdocs-material` / `pip install zensical` from the
  README's *Installation* section. `uv` is a faster, drop-in-compatible
  installer. Leave `.github/workflows/docs.yml`'s plain `pip install
  zensical` step as-is unless asked to change it — it runs on a locked-down
  `setup-python` CI image, exactly the case where falling back to `pip` is
  correct.

The same "verify parity, then default to the Rust successor" pattern used
for Zensical/`uv` above extends further. None of the following are
currently used in this repo, but if a future task introduces the left-hand
tool, default to the right-hand one once its output is confirmed to match:

| Legacy tool(s) | Rust-based successor |
|---|---|
| MkDocs + Material for MkDocs | Zensical (ZRX engine) |
| `pip`, `pip-tools`, `venv`, `virtualenv`, `pyenv`, (partially) Poetry | `uv` |
| `flake8`, `black`, `isort` | Ruff |
| `mypy`, Pyright/Pylance | ty |
| Webpack | Rspack |
| esbuild/Rollup inside Vite | Rolldown |
| Next.js's bundler | Turbopack |
| ESLint, Prettier | Biome / oxlint / oxfmt |

Full rationale and fallback caveats for all of these:
[Proposed AGENTS.md Addition](docs/proposed-agents-addition.md).

- **If asked to migrate a different repo from MkDocs to Zensical**, follow
  [docs/migration-steps.md](docs/migration-steps.md) — the tested,
  command-by-command checklist this project's own migration produced. Don't
  reconstruct the process from general knowledge: the gotchas in there (the
  self-referencing `watch:` bug, the `hooks:` replacement, the `gh-deploy`
  deployment change) are each non-obvious and were rediscovered the hard way
  exactly once, on this repo, so they don't need rediscovering again.
- **This project deploys via GitHub Actions**
  (`.github/workflows/docs.yml`), not `mkdocs gh-deploy` — and
  `zensical gh-deploy` isn't a real command at all (`Error: No such command
  'gh-deploy'`). Never modify the deploy workflow or this repository's
  GitHub Pages settings without asking first; CI/CD and shared publishing
  configuration always need explicit confirmation, no matter how confident
  the change looks.

## MicroSim rules

MicroSims are the interactive core of an intelligent textbook. If a concept is
complex, it needs a MicroSim — do not settle for a wall of text.

- Each MicroSim lives in its own directory under `docs/sims/<sim-id>/` with a
  kebab-case id, a `main.html` that can be embedded via `iframe`, and an
  `index.md` lesson page.
- The published lesson URL is
  `https://dmccreary.github.io/zensical-test/sims/<sim-id>/`. Always
  include the repo name in the path when you reference a sim.
- Every `docs/sims/<sim-id>/index.md` needs a `status:` value in its
  frontmatter, which paints a colored dot in the left nav:

  | Status | Color | Meaning |
  |---|---|---|
  | `scaffold` | red | Spec exists; no implementation yet. |
  | `built` | orange | Implemented; awaiting author review. |
  | `approved` | green | Author tested it and approved it for learners. |

  New sims are born `scaffold`. Bump to `built` when you write a real
  implementation. **Never auto-advance a sim to `approved`** — only the human
  author does that, after exercising the controls.

### p5.js specifics

- Call `updateCanvasSize()` as the **first** statement in `setup()` so the
  sketch picks up the container width before the canvas is created.
- Parent the canvas with `canvas.parent(document.querySelector('main'));`.
  The deployed HTML uses the p5.js-editor-standard bare `<main></main>` so
  teachers can paste the JavaScript straight into the p5.js editor. **Never add
  `id="main"`** to the `<main>` tag.
- Use p5.js **built-in** controls — `createButton`, `createSlider`,
  `createCheckbox`, `createSelect`, `createInput`. Never hand-draw a control.
- Create all controls in `setup()` *before* calling any function that positions
  them; positioning an undefined control throws and leaves a blank canvas.

## Quality assurance

Do not assume your first draft is correctly formatted. After generating a
chapter or a sim, verify it rather than declaring success:

1. Run `mkdocs build --strict` and confirm it exits clean.
2. Check that every file you created is reachable from `nav:`.
3. Run any validation scripts the book provides under `scripts/`.
4. Report honestly. If a check fails or you skipped a step, say so plainly.

## Content pipeline

This book is built by the intelligent-textbook skill chain, roughly in order:

```
course-description-analyzer   validate docs/course-description.md
learning-graph-generator      enumerate concepts + dependency DAG
book-chapter-generator        design the chapter structure
chapter-content-generator     write the chapters
microsim-generator            build the interactive sims
glossary-generator            ISO 11179 glossary
faq-generator                 FAQ
quiz-generator                per-chapter quizzes
reference-generator           per-chapter references
book-installer                site features (mascot, graph viewer, analytics)
```

`docs/course-description.md` is the seed for everything downstream. If it is
still the scaffold template, fill it in before running the generators.

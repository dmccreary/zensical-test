# Why Zensical?

This book is a live test bed for migrating from MkDocs + Material for MkDocs
to **Zensical**, the newer generator from the same team (see
[References](references.md) for the source sites). This page explains the
motivation behind that migration — why the team behind Material for MkDocs
decided to build a new tool instead of continuing to extend the old one.

## The old stack: MkDocs plus a plugin ecosystem

Material for MkDocs launched in 2016 as a theme layered on top of
[MkDocs](https://www.mkdocs.org/), a Python static-site generator. Over the
following decade it grew into the way tens of thousands of teams publish
documentation, and its capabilities — search, social cards, versioning,
diagrams, math rendering — were almost entirely delivered through MkDocs'
**plugin and Markdown-extension system**.

That system works by letting each plugin hook into build-lifecycle events
(`on_config`, `on_page_markdown`, `on_post_build`, and so on) and mutate
shared state as the build passes through. It is flexible and easy to extend —
anyone can write a plugin — which is exactly why the ecosystem around MkDocs
grew to hundreds of community packages.

## Where the old model broke down

That same flexibility is also its weakness. Because a plugin hook can read or
rewrite anything another plugin already touched, the dependencies between
plugins are **implicit** rather than declared. Nothing in the architecture
says which plugin must run before another, or what a plugin is and isn't
allowed to change — so two plugins that work perfectly on their own can
interfere with each other in a project that enables both, in ways that are
hard to predict and harder to debug. The Zensical project's own writeup
describes this directly as plugins that can "mysteriously interfere with
each other."

This project has already run into a small-scale version of that problem: see
`AGENTS.md`'s note that this repo replaced its `plugins/social_override.py`
hook with a template override, because `hooks:` (Python post-processing)
isn't supported under Zensical, and keeping both the old hook and the new
override would have double-emitted the same `og:`/`twitter:` meta tags.

The second consequence is architectural rather than cosmetic: because
practically every MkDocs plugin has side effects on shared build state, a
build can't safely run more than one plugin at a time. MkDocs doesn't
actually have a dependency graph to schedule from — plugins simply run in
the fixed order they're listed in `mkdocs.yml`, one after another, and that
order matters precisely *because* nothing declares what each plugin reads or
writes. The same design that makes plugin interactions unpredictable is also
what makes the whole pipeline single-threaded — there is no safe way to
parallelize work whose ordering and side effects aren't formally tracked.

## Why that stopped being sustainable

Two events forced the issue rather than leaving it as a long-term wishlist
item:

1. **MkDocs itself went unmaintained** (no meaningful activity since around
   August 2024), which turned "we depend on MkDocs" into a supply-chain risk
   for every project built on Material for MkDocs.
2. **A proposed MkDocs 2.0 direction would have broken Material for MkDocs
   and roughly 300 ecosystem plugins** built against the old architecture,
   which made patching the existing foundation impractical.

Faced with an unmaintained dependency and a breaking rewrite on the horizon,
the team chose to rethink static site generation from first principles
instead of forking or patching MkDocs.

## Why Rust, and why a module system instead of plugins

Zensical's build engine, **ZRX**, is written in Rust specifically to get
capabilities the old Python/plugin model structurally couldn't offer:

- **Differential builds.** Instead of an incremental build that still has to
  walk an entire dependency chain when one file changes, ZRX tracks exactly
  which artifacts a change affects and rebuilds only those — the project
  reports repeated builds running four to five times faster as a result.
- **A true dependency graph drives parallelization across CPU cores.** This
  is the single biggest structural upgrade over MkDocs. Where MkDocs has no
  graph at all — just a flat, ordered list of plugins that must run one after
  another because nothing records what each one touches — ZRX builds an
  explicit graph of every task's declared inputs and outputs. Its scheduler
  analyzes that graph's topology and runs every task that has no unmet
  dependency at the same time, on as many cores as are available, then
  advances the frontier as each task finishes. That's a categorically more
  robust foundation for parallel work than MkDocs' fixed sequence: the
  schedule falls directly out of real, declared dependencies instead of
  config-file ordering, so ZRX can safely run things concurrently that
  MkDocs' architecture could never determine were safe to run concurrently
  at all.
- **An explicit module system in place of implicit plugin hooks.** Modules
  communicate through declared artifact types and a transparent dependency
  network rather than side effects, which lets Zensical detect conflicts
  between modules automatically instead of letting them surface as confusing
  runtime behavior. Non-Rust developers can still extend it through a Python
  API (via PyO3), so the ecosystem doesn't have to be rewritten from scratch.

In short: the plugin-interaction bugs and the inability to use more than one
core were two symptoms of the same root cause — side effects and implicit
ordering, with no dependency graph underneath to reason about either one.
Fixing that root cause required a build model with a real, explicit
dependency graph, and Rust was the vehicle chosen to implement that model
with the performance and reliability the team wanted.

## Part of a broader trend

Zensical is one instance of a pattern showing up across the developer
tooling landscape: take a tool whose implementation language has hit an
architectural ceiling — usually single-threaded execution and a side-effect
heavy plugin or hook system — and replace its core with a Rust engine built
around explicit, parallelizable dependencies instead.

The closest parallel is in the Python packaging ecosystem itself:

- [uv](https://docs.astral.sh/uv/) (Astral) is a Rust-based drop-in
  replacement for `pip`, `pip-tools`, `venv`, `virtualenv`, and `pyenv`, and
  can stand in for Poetry as well. It ships as a single binary and is
  commonly benchmarked at 10-100x faster than pip.
- [Ruff](https://github.com/astral-sh/ruff), also from Astral, replaces
  `flake8`, `black`, and `isort` with one Rust binary.
- **ty**, Astral's newer Rust-based type checker, targets `mypy` and
  Pyright/Pylance.

The same pattern shows up on the JavaScript/frontend side: **Turbopack**
(Next.js's Rust bundler), **Rolldown** (the Rust bundler that replaced
esbuild/Rollup inside Vite), **Rspack** (a webpack-API-compatible Rust
bundler), and **Biome**/**oxlint**/**oxfmt** (Rust-based linters and
formatters replacing ESLint/Prettier). It traces back to earlier CLI tools
like ripgrep and fd, which first established that rewriting a tool's hot
path in Rust could deliver order-of-magnitude speedups over the Python,
Node, or shell-script original.

Zensical fits this same mold for the MkDocs ecosystem: MkDocs' plugin/hook
model is the side-effect-heavy architecture, and ZRX is the Rust engine with
declared, parallelizable dependencies that replaces it.

## What this means for this project

Zensical reads this project's existing `mkdocs.yml` and can build most of
this site today, which is what makes it possible to test both generators
side by side (see `AGENTS.md` for the specific compatibility gaps this
project has hit so far — `exclude_docs:` and the `social` plugin's
auto-generated card images). `mkdocs build --strict` remains the
authoritative check for this book until Zensical reaches full feature
parity with Material for MkDocs.

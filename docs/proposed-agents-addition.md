# Proposed: Prefer Zensical, uv, and Other Rust-Based Parallel Tooling — One Global AGENTS.md

This is a draft proposal, written for review. **Nothing outside this repo has
been changed** — `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md` are untouched.

This project's own [AGENTS.md](https://github.com/dmccreary/zensical-test/blob/main/AGENTS.md)
already tells agents working *in this repo* to prefer `zensical build` and
`zensical serve` over the traditional `mkdocs build` and `mkdocs serve`
commands, and never to start or kill either server. That is exactly the kind
of standing preference that shouldn't have to be re-learned, repo by repo,
across the 120+ other intelligent textbooks this migration is meant to serve
(see [About](about.md)) — or copy-pasted into a Claude-only file when most
other coding agents can read the same instructions natively. This proposal
generalizes two things this repo has already learned the hard way into
shared, global guidance: **(1)** default to the Rust-based parallel successor
of a build tool once its output has been verified against the tool it
replaces, using Zensical-over-MkDocs as the primary worked example, and
**(2)** do the same for `uv` over `pip`, which came up in the Rust-tooling
discussion on [Why Zensical?](why-zensical.md).

## 1. The additions themselves

These are the sections proposed for insertion into the shared global
instructions (see part 4 for *where* they should physically live).

### 1a. Documentation-site builds: prefer Zensical over MkDocs

```markdown
## Documentation-Site Builds

Prefer `zensical build` and `zensical serve` over `mkdocs build` and `mkdocs
serve` for any MkDocs + Material for MkDocs project that has already been
verified to build cleanly with Zensical from the same `mkdocs.yml` — check
the project's own `AGENTS.md`/`README.md` for that confirmation before
assuming it. Zensical is the Rust-based successor from the Material for
MkDocs team, built around **ZRX**, a build engine with a real dependency
graph instead of a fixed, ordered plugin list; that graph is what makes
differential builds and true multi-core parallelization possible, and it
reads the same `mkdocs.yml` every existing MkDocs project already has.

Fall back to `mkdocs build`/`mkdocs serve` — or run both — when:

- The project hasn't been verified against Zensical yet. Don't assume parity
  without evidence.
- The project depends on a compatibility gap Zensical hasn't closed. As of
  Zensical 0.0.61: `exclude_docs:` is silently ignored, and the `social`
  plugin's auto-generated card images aren't implemented. `hooks:` (Python
  post-processing) isn't supported at all — use a `theme.custom_dir`
  template override extending `base.html`'s `extrahead` block instead, which
  works on both builders.
- The project's `mkdocs.yml` has (or would need) a `watch:` entry matching
  the config file's own name — a confirmed Zensical bug
  ([zensical/zensical#934](https://github.com/zensical/zensical/issues/934))
  that silently emits zero pages, no error, no warning.
- The project deploys with `mkdocs gh-deploy` — Zensical has no equivalent;
  migrate the deploy step to a GitHub Actions workflow instead.

`mkdocs build --strict` remains the authoritative correctness check on any
project until that project is confirmed to have reached full parity under
Zensical, even on projects whose day-to-day builds already use
`zensical build`.

Never start or kill `mkdocs serve` or `zensical serve` on a project — the
author runs their own dev server in a separate terminal to watch for rebuild
errors (see the base global rule this extends).
```

### 1b. Python packaging: prefer uv over pip

```markdown
## Python Package Management

Prefer `uv` over `pip` for Python environment and dependency management in
new work — `uv venv`, `uv pip install`, `uv add`, and `uv run` in place of
`python -m venv`, `pip install`, and manually managing requirements inside an
activated venv. `uv` is a Rust-based, drop-in-compatible replacement that is
dramatically faster for installs and venv creation, which matters most when
an agent is repeatedly creating throwaway environments.

Fall back to plain `pip`/`venv` when:

- `uv` isn't installed and installing it isn't appropriate for the task
  (e.g. a locked-down CI image). Install it first when you can:
  `brew install uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`.
- A project already has a committed `pip`/`poetry` workflow other scripts
  depend on — don't fork a project's toolchain mid-stream without asking.

An existing `requirements.txt` stays valid input —
`uv pip install -r requirements.txt` works as-is; there's no need to convert
it to `pyproject.toml` unless asked.
```

### 1c. The broader pattern: verify, then prefer the Rust/parallel successor

Zensical-over-MkDocs and uv-over-pip are two instances of one pattern showing
up across developer tooling: a single-threaded, side-effect-heavy tool gets
replaced by a Rust engine built around an explicit, parallelizable dependency
graph (see [Why Zensical?](why-zensical.md#part-of-a-broader-trend) for the
fuller architectural case for *why* that graph is what actually enables the
speedup, not just "Rust is fast"). The same "verify parity, then default to
the successor" rule extends to the other pairs this book already names:

| Legacy tool(s) | Rust-based successor | Notes |
|---|---|---|
| MkDocs + Material for MkDocs | Zensical (ZRX engine) | See 1a above — this repo's own migration |
| `pip`, `pip-tools`, `venv`, `virtualenv`, `pyenv`, (partially) Poetry | [uv](https://docs.astral.sh/uv/) | 10-100x faster installs; see 1b above |
| `flake8`, `black`, `isort` | [Ruff](https://github.com/astral-sh/ruff) | One binary replaces three |
| `mypy`, Pyright/Pylance | **ty** | Newer and still maturing — diff its output against the existing type checker before fully switching |
| Webpack | **Rspack** | Webpack-API-compatible |
| esbuild/Rollup inside Vite | **Rolldown** | |
| Next.js's bundler | **Turbopack** | |
| ESLint, Prettier | **Biome**, **oxlint**, **oxfmt** | |

```markdown
## Preferring Parallel/Rust Tooling Generally

For any legacy-tool/Rust-successor pair the team has adopted (see the
canonical list in `docs/proposed-agents-addition.md` in the zensical-test
repo, where this section originated), default to the Rust successor only
after confirming the current project already builds/lints/type-checks
cleanly with it — a documented migration note, a green CI run, or a quick
side-by-side check. Don't silently swap an established project's toolchain
mid-task without asking; propose the switch instead, the same way this
repo's own MkDocs-to-Zensical migration started as a proposal and a
side-by-side test bed, not a silent swap.
```

## 2. Why this belongs in a shared file, not just CLAUDE.md

This repo already solves a version of this problem for *project-level*
instructions. `CLAUDE.md` in this repo's root is one line:

```
@AGENTS.md
```

`AGENTS.md` holds the actual rules — including the Zensical-over-MkDocs
preference from 1a, scoped to this one project — so Claude Code, Codex,
Cursor, and any other agent that looks for `AGENTS.md` all read the same
document; nobody has to maintain two copies that drift apart.

The same tension exists one level up, at the **global, cross-project**
scope: the author's standing tooling preferences (like "use uv," or "default
to a project's Rust-based build successor once it's verified") currently
live only in `~/.claude/CLAUDE.md`, so only Claude Code sees them. This
proposal is that same pointer trick, applied globally instead of
per-project.

## 3. Current per-tool landscape (researched this session)

This table is about which coding agents read `AGENTS.md` natively — a
different axis from the build-tool preferences in part 1, but the reason
those preferences belong in a file every agent can see.

| Tool | Project-root file | Global/user-level file | Reads AGENTS.md natively? |
|---|---|---|---|
| Claude Code | `CLAUDE.md` | `~/.claude/CLAUDE.md` | No — as of August 2026 it still loads `CLAUDE.md`, not `AGENTS.md`, which is exactly why this repo's `@AGENTS.md` import trick exists. |
| OpenAI Codex CLI | `AGENTS.md` | `~/.codex/AGENTS.md` | Yes, natively, at both scopes. |
| Cursor | `AGENTS.md` (native) or `.cursor/rules/*.mdc` | In-app "Rules" setting — no confirmed plain-file equivalent | Yes, natively for the project file. |
| Google Antigravity | `AGENTS.md` or `GEMINI.md` at project root, or `.agents/rules/` | No documented global/user-wide file found | Yes, natively for the project file (added v1.20.3, March 2026). |
| Other AGENTS.md readers (Gemini CLI, Google Jules, GitHub Copilot, Aider, Zed, VS Code, Windsurf, Devin) | `AGENTS.md` | Varies, mostly undocumented | Yes, natively for the project file. |

AGENTS.md itself is now a genuinely cross-tool standard (Linux Foundation
stewardship, 30+ tools). The gap is specifically at the **global** scope:
only Claude Code and Codex CLI have a documented per-user file to point
anywhere; Cursor's global layer is UI-configured, and Antigravity appears to
be project-scoped only.

## 4. Proposed structure

- **Canonical file:** `~/agents/AGENTS.md` — a new, tool-agnostic home for
  every instruction that should apply no matter which repo or which agent is
  working in it. Everything currently in `~/.claude/CLAUDE.md` moves here
  unchanged (the Eclipse-workspace note, the `ibook-skills` auto-commit
  rules, the MicroSim/p5.js rules, the Publish Command, the git-worktree
  ban), plus the new "Documentation-Site Builds" (1a), "Python Package
  Management" (1b), and "Preferring Parallel/Rust Tooling Generally" (1c)
  sections from part 1.
- **`~/.claude/CLAUDE.md`** shrinks to one line, exactly mirroring this
  repo's own pattern:

  ```
  @~/agents/AGENTS.md
  ```

- **`~/.codex/AGENTS.md`** becomes a symlink to the same canonical file
  (`ln -s ~/agents/AGENTS.md ~/.codex/AGENTS.md`) rather than an `@import`,
  since Codex CLI reads file content directly and has no import syntax to
  rely on — a symlink keeps a single source of truth without copy-pasting.
- **Cursor / Antigravity:** until those tools publish a documented global
  file, there's nothing to symlink at the user level. Paste the canonical
  content into Cursor's Settings → Rules, and let per-project `AGENTS.md`
  files (already the cross-tool source of truth for those two) carry the
  global rules that matter for that project.

## 5. What doesn't change

- Every project's own `AGENTS.md` — including this repo's, which already
  states the Zensical-over-MkDocs preference at the project level — is
  untouched and still wins on conflict, per its existing "these rules ride
  on top of the author's global agent rules... where the two disagree, the
  global rules win" line.
- `CONTENT-GENERATION-GUIDE.md` and the book-content pipeline are unrelated
  to this proposal; this is a tooling/process change, not a content rule.

## 6. Open questions before this ships

- Confirm Claude Code's `@` import actually resolves a `~`-prefixed path on
  this machine — if it only accepts relative paths, `~/.claude/CLAUDE.md`
  would need something like `@../agents/AGENTS.md` instead.
- Decide separately whether the ~48 `pip install` references inside the
  `ibook-skills` skill docs should also move to `uv` — that repo's own
  auto-commit-per-turn rule means it should be its own turn, not bundled
  with this change.
- Re-check whether Cursor or Antigravity have since added a documented
  global/user file — this space moved fast enough that Antigravity only
  gained native `AGENTS.md` support in March 2026.
- Should the Zensical-over-MkDocs preference (1a) be scoped to repos that
  already show evidence of a verified migration — this repo's pattern — or
  is a blanket "try `zensical build` first, fall back to `mkdocs`" safe
  enough to state generically? This repo's own experience — a config file
  named `mkdocs.yml` whose `watch:` list self-references silently produces
  an *empty* site under Zensical — argues for keeping the verification
  requirement rather than a blanket default.
- For the non-doc-site pairs in 1c (Ruff, ty, Rspack, Rolldown, Turbopack,
  Biome/oxlint/oxfmt), the author may not use all of these ecosystems
  day-to-day — confirm which are worth encoding as standing preferences
  versus left here as reference only.

## Research sources

- [Zensical](https://zensical.org/) — the project's own site
- [zensical/zensical issue tracker](https://github.com/zensical/zensical/issues), including [#934](https://github.com/zensical/zensical/issues/934), the `watch:` self-reference bug
- [Why Zensical?](why-zensical.md) — this book's own architectural case for ZRX over MkDocs' plugin model
- [AGENTS.md Spec (2026): Recommended Sections + AGENTS.md vs CLAUDE.md vs .cursorrules](https://www.morphllm.com/agents-md-guide)
- [Agent Instruction Files: AGENTS.md, CLAUDE.md, and Cross-Tool Portability with Codex CLI](https://codex.danielvaughan.com/2026/05/27/agent-instruction-files-agents-md-claude-md-cross-tool-portability-codex-cli/)
- [Where does Antigravity look for Agents?](https://medium.com/google-cloud/where-does-antigravity-look-for-agents-ab0dd955929d)
- [Google Antigravity and AGENTS.md: The Complete 2026 Guide](https://thepromptshelf.dev/blog/google-antigravity-agents-md-rules-guide-2026/)
- [uv: Python packaging in Rust - Astral](https://astral.sh/blog/uv)

## Next step

This is a draft, not a change — say the word and this can be applied to
`~/.claude/CLAUDE.md`, a new `~/agents/AGENTS.md`, `~/.codex/AGENTS.md`, and
this repo's own [AGENTS.md](https://github.com/dmccreary/zensical-test/blob/main/AGENTS.md)
directly.

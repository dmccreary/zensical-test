# Proposed: uv Over pip, and One Global AGENTS.md for Every Agent

This is a draft proposal, written for review. **Nothing outside this repo has
been changed** — `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md` are untouched.
It grew out of the Rust-tooling discussion on [Why Zensical?](why-zensical.md):
if `uv` is worth recommending over `pip`, that recommendation shouldn't live
in a Claude-only file when most other coding agents can read the same
instructions natively.

## 1. The addition itself: prefer uv over pip

This is the section proposed for insertion into the shared global
instructions (see part 2 for *where* it should physically live):

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

## 2. Why this belongs in a shared file, not just CLAUDE.md

This repo already solves a version of this problem for *project-level*
instructions. `CLAUDE.md` in this repo's root is one line:

```
@AGENTS.md
```

`AGENTS.md` holds the actual rules, so Claude Code, Codex, Cursor, and any
other agent that looks for `AGENTS.md` all read the same document — nobody
has to maintain two copies that drift apart.

The same tension exists one level up, at the **global, cross-project**
scope: the author's standing preferences (like "use uv") currently live only
in `~/.claude/CLAUDE.md`, so only Claude Code sees them. This proposal is
that same pointer trick, applied globally instead of per-project.

## 3. Current per-tool landscape (researched this session)

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
  ban), plus the new "Python Package Management" section from part 1.
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

- Every project's own `AGENTS.md` — including this repo's — is untouched and
  still wins on conflict, per its existing "these rules ride on top of the
  author's global agent rules... where the two disagree, the global rules
  win" line.
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

## Research sources

- [AGENTS.md Spec (2026): Recommended Sections + AGENTS.md vs CLAUDE.md vs .cursorrules](https://www.morphllm.com/agents-md-guide)
- [Agent Instruction Files: AGENTS.md, CLAUDE.md, and Cross-Tool Portability with Codex CLI](https://codex.danielvaughan.com/2026/05/27/agent-instruction-files-agents-md-claude-md-cross-tool-portability-codex-cli/)
- [Where does Antigravity look for Agents?](https://medium.com/google-cloud/where-does-antigravity-look-for-agents-ab0dd955929d)
- [Google Antigravity and AGENTS.md: The Complete 2026 Guide](https://thepromptshelf.dev/blog/google-antigravity-agents-md-rules-guide-2026/)
- [uv: Python packaging in Rust - Astral](https://astral.sh/blog/uv)

## Next step

This is a draft, not a change — say the word and this can be applied to
`~/.claude/CLAUDE.md`, a new `~/agents/AGENTS.md`, and `~/.codex/AGENTS.md`
directly.

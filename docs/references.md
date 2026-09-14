# References

This book is built on the MkDocs / Material for MkDocs stack, and is being
migrated to test **Zensical**, the newer Rust-based successor from the same
Material team (see [AGENTS.md](https://github.com/dmccreary/zensical-test/blob/main/AGENTS.md)
for the migration notes). The sites below are the primary references for the
tooling behind this project, in the order you're likely to need them.

## Documentation Generators

- [MkDocs](https://www.mkdocs.org/) — the original static-site generator this
  book was built with. It turns a directory of Markdown files plus a single
  `mkdocs.yml` config into a browsable site. It has no built-in theme of its
  own beyond a plain default; almost every serious MkDocs site (including
  this one) pairs it with the Material theme below.
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) — the
  theme that provides the navigation sidebar, search, color palettes, code
  copy buttons, admonitions, and most of the visual polish this book relies
  on. Its reference pages document every `theme.features` flag used in
  `mkdocs.yml`, including the `navigation.tabs` setting this project
  deliberately avoids (see `AGENTS.md`).
- [Zensical](https://zensical.org/) — the newer, Rust-based site generator
  from the Material for MkDocs team, built to replace the Python MkDocs +
  Material pipeline with a single faster binary. It reads the same
  `mkdocs.yml` config, which is why this project can build with either tool.
  As of the version tracked in `AGENTS.md`, it does not yet implement
  `exclude_docs:` or the `social` plugin's auto-generated card images, so
  `mkdocs build --strict` remains the authoritative check until it reaches
  full parity.

## Zensical Project Links

- [Zensical GitHub organization](https://github.com/zensical) — source code
  for the Zensical generator and its supporting packages. Useful for
  checking whether a missing feature (like `exclude_docs:` support) has
  shipped yet.
- [zensical/zensical issue tracker](https://github.com/zensical/zensical/issues) —
  where feature gaps and bugs against Zensical are filed and tracked, such as
  [issue #934](https://github.com/zensical/zensical/issues/934), the `watch:`
  self-reference bug noted in `AGENTS.md`.

## Related Material Team Projects

- [mkdocs-material GitHub repository](https://github.com/squidfunk/mkdocs-material) —
  source code, changelog, and issue tracker for the Material theme itself.
  Check here before assuming a rendering quirk is a bug in this book rather
  than an upstream theme issue.
- [Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/insiders/) —
  the sponsor-only edition of the Material theme with early-access features.
  Not currently used by this book, but referenced occasionally in the wider
  documentation for features that later became free.

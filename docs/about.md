---
title: "About This Guide"
description: "About Migrating from Mkdocs to Zensical — its purpose, scope, and the team behind it."
---

# About This Guide

## Why This Guide Exists

This site is not a classroom textbook — it is a working reference and live
test bed for a build-pipeline migration that is about to touch **more than
120 intelligent textbooks**, all currently built with the same MkDocs +
Material for MkDocs stack.

That stack has quietly become a liability. As documented in
[Why Zensical?](why-zensical.md), MkDocs itself has seen no meaningful
maintenance activity since around August 2024, and a proposed MkDocs 2.0
direction would have broken Material for MkDocs along with roughly 300
ecosystem plugins built against the old architecture. Every one of those
120+ books depends on that foundation, and every one of them builds
**single-threaded** — MkDocs has no dependency graph to schedule from, only
a flat, ordered list of plugins run one after another, so a large book's
build time only ever gets worse as chapters, MicroSims, and glossary
entries accumulate.

[Zensical](https://zensical.org/) is the Rust-based successor from the same
Material for MkDocs team, built around **ZRX**, an engine that replaces
implicit plugin side effects with an explicit, declared dependency graph.
That graph is what makes differential builds and true multi-core
parallelization possible — the project reports repeat builds running four
to five times faster as a direct result. It reads the same `mkdocs.yml`
every existing book already has, which is what makes an incremental,
book-by-book migration realistic instead of a rewrite.

Rather than propose that migration on faith, this repository migrates one
real, working book first and records everything that happens: which
`mkdocs.yml` features build identically under both generators, which don't
yet (see `AGENTS.md` for the specific gaps — `exclude_docs:` and the
`social` plugin's auto-generated card images, as of Zensical 0.0.61), and
which upstream bugs got filed along the way. The goal is a migration guide
the other 120+ books can actually follow, not a theoretical comparison.

## What This Guide Covers

- **[Why Zensical?](why-zensical.md)** — why the MkDocs plugin model broke
  down, why the fix required a real dependency graph, and where Zensical
  fits in the broader trend of Rust rewrites replacing single-threaded
  Python and JavaScript tooling (`uv`, `Ruff`, Turbopack, Rolldown, and
  others).
- **[Migration Steps](migration-steps.md)** — the ordered, command-by-command
  walkthrough for migrating your own `mkdocs.yml`-driven site, including
  every compatibility gap and gotcha this project hit along the way.
- **[Background on Web Publishing Tools](background-on-web-publishing-tools.md)** —
  an interactive timeline placing MkDocs and Zensical in six decades of
  publishing-tool history, and a side-by-side look at sequential versus
  parallel build scheduling.
- **[Proposed AGENTS.md Addition](proposed-agents-addition.md)** — a draft
  proposal, written for review, for a shared `uv`-over-`pip` convention and
  a single `AGENTS.md` readable by every coding agent, not just Claude.
- **[MicroSims](sims/index.md)** — interactive simulations, including a
  side-by-side animation of the serial MkDocs pipeline versus the parallel
  Zensical/ZRX build.
- **[References](references.md)** — the primary documentation for MkDocs,
  Material for MkDocs, and Zensical, plus links to the upstream issue
  tracker for gaps this project has hit.

This guide is deliberately small and concrete rather than exhaustive. It
grows as the migration surfaces new compatibility notes worth recording for
the next book.

## About the Author

![](./img/dan-headshot-small.png){ width="150px" align="right"}

Dan McCreary is a semi-retired AI researcher, solution architect, and
educator who has spent more than three decades helping Fortune 100
organizations reason over massive datasets. At Optum he founded the
Generative AI Center of Excellence and led the team that built one of the
world's largest healthcare knowledge graphs — spanning over 25 billion
vertices — to unify member, provider, and patient insights. Dan's deep
background in knowledge representation and systems thinking underpins the
intelligent-textbook workflows behind the 120+ books this migration guide
is written for.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the
founding chair of the NoSQL Now! conference, and a frequent keynote speaker
on semantic search, ontology strategy, and AI hardware. Beyond industry, Dan
has mentored students as a STEM volunteer since 2014 and now applies the
same rigor to building open educational resources. You can visit the
[Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/)
to see the growing catalog of textbooks Dan has created or co-created with
other authors — the catalog this Zensical migration is being built to serve.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College
- M.S.E.E. from the University of Minnesota
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across
  healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning experiences

## How to Cite This Guide

If you reference this guide in a migration plan, engineering writeup, or
other publication, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Migrating from Mkdocs to Zensical*. https://dmccreary.github.io/zensical-test/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Migrating from Mkdocs to Zensical*. https://dmccreary.github.io/zensical-test/.

**MLA (9th edition)**

McCreary, Dan. *Migrating from Mkdocs to Zensical*. 2026, dmccreary.github.io/zensical-test/.

**BibTeX**

```bibtex
@book{mccreary2026zensical,
  title     = {Migrating from Mkdocs to Zensical},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/zensical-test/},
  note      = {Living migration guide and Zensical/MkDocs test bed}
}
```

## License

This work is released under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
License (CC BY-NC-SA 4.0)](license.md). You are free to share and adapt the
material for non-commercial purposes as long as you give appropriate credit
and share your adaptations under the same license.

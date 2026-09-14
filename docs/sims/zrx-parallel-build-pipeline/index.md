---
title: ZRX Parallel Build Pipeline
description: Step through how Zensical's ZRX engine schedules a Markdown-to-HTML textbook build from a dependency graph, in parallel across CPU cores, versus a fixed one-task-at-a-time legacy order.
image: /sims/zrx-parallel-build-pipeline/zrx-parallel-build-pipeline.png
og:image: /sims/zrx-parallel-build-pipeline/zrx-parallel-build-pipeline.png
twitter:image: /sims/zrx-parallel-build-pipeline/zrx-parallel-build-pipeline.png
social:
   cards: false
quality_score: 0
status: built
---

# ZRX Parallel Build Pipeline

<iframe src="main.html" height="652px" width="100%" scrolling="no"></iframe>

[Run the ZRX Parallel Build Pipeline MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This MicroSim simulates a small intelligent-textbook publishing pipeline —
11 tasks that turn Markdown source into a finished HTML site — and lets you
step through two different ways of scheduling it:

- **Parallel (ZRX)** — the scheduler starts every task whose dependencies
  are already complete, up to however many CPU cores you allow (1-16, so you
  can model a realistic modern machine — almost every Mac sold today ships
  with a 10-core processor or higher; the only common exception still in use
  is the older 8-core iMac). This models ZRX, Zensical's Rust build engine,
  which computes a real dependency graph of build tasks and runs everything
  with no unmet dependency at the same time. See
  [Why Zensical?](../../why-zensical.md) for the background.
- **Sequential (Legacy)** — tasks run one at a time, in a fixed order,
  regardless of whether an earlier task's output is actually needed yet.
  This models MkDocs' plugin system, which has no dependency graph at all —
  plugins simply run in the order they're listed in `mkdocs.yml`.

The dependency graph itself is the same in both modes; only the scheduler
changes. That's the point: parallel speedup doesn't come from a faster CPU,
it comes from the scheduler being able to *see* which tasks don't depend on
each other.

## How to Use

1. Leave the mode on **Parallel (ZRX)** with all **16 cores** and click
   **Next Step** repeatedly. Watch which tasks turn gold (running) together
   each step, and read the "Cores This Step" panel — even at peak
   parallelism, at most 4 of the 16 cores are ever busy; the rest are always
   reported idle, because the graph itself never has more than 4 tasks
   ready at once.
2. Click **Reset**, switch to **Sequential (Legacy)**, and step through
   again. Notice that only one task ever runs at a time, even though many of
   them don't depend on each other.
3. Compare the **Build Progress** panel's "This run" step count against the
   "Sequential baseline" in both modes.
4. Reset back to Parallel mode and drag the **CPU Cores** slider down to 1,
   then step through again. Notice the step count now matches the
   sequential baseline — a real dependency graph with only one core to run
   it on is no faster than the old fixed order. Parallel speedup needs
   *both* the graph and the cores — and beyond 4 cores here, more cores stop
   helping too, because the graph is the other half of that ceiling.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/zensical-test/sims/zrx-parallel-build-pipeline/main.html"
        height="652px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
Undergraduate / professional (software engineering, systems design)

### Duration
10-15 minutes

### Prerequisites

- Basic familiarity with the idea of a build pipeline (source files in,
  a finished site out).
- Read [Why Zensical?](../../why-zensical.md), especially "Why Rust, and
  why a module system instead of plugins."

### Activities

1. **Exploration** (5 min): Step through the Parallel (ZRX) schedule at the
   default 16 cores from start to finish, then Reset and step through the
   Sequential (Legacy) schedule. Record both step counts.
2. **Guided Practice** (5 min): Re-run Parallel mode at 8, 4, 3, 2, and then
   1 core, recording the step count each time. Graph steps-to-finish against
   cores — the line should go flat above 4 cores, not keep dropping.
3. **Assessment** (5 min): Explain, in the vocabulary of the "Cores This
   Step" panel, why a dependency graph with only 1 core produces the same
   step count as the legacy scheduler — and why that stops being true once
   cores >= 2.

### Assessment

A learner has met the objective if they can correctly explain, without
looking at the sim, why "Build Nav / TOC" cannot start until all three
chapter-render tasks are done, and why that dependency is what limits the
speedup, not the task count itself.

## References

1. [Why Zensical?](../../why-zensical.md) — this book's page on why Zensical
   replaced MkDocs' plugin model with ZRX's dependency graph.
2. [Zensical](https://zensical.org/) — the project's own site.
3. [zensical/zensical on GitHub](https://github.com/zensical) — source and
   issue tracker for the generator this MicroSim models.

---
title: "History of Documentation and Publishing Tools"
description: "Interactive vis-timeline MicroSim tracing 60+ years of book and documentation publishing tools, from early formatters through Markdown, MkDocs, Rust, and Zensical."
image: /sims/publishing-tools-timeline/publishing-tools-timeline.png
og:image: /sims/publishing-tools-timeline/publishing-tools-timeline.png
twitter:image: /sims/publishing-tools-timeline/publishing-tools-timeline.png
social:
   cards: false
status: built
quality_score: 0
---

# History of Documentation and Publishing Tools

<iframe src="main.html" height="902px" width="100%" scrolling="no"></iframe>

[Run the History of Documentation and Publishing Tools MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive timeline traces the lineage of tools used to write and
publish books and technical documentation, from the first computerized
document formatters in the 1960s through to **Zensical**, the Rust-based
generator this book itself is testing (see [Why Zensical?](../../why-zensical.md)).

The timeline groups 17 milestones into five color-coded threads:

- **Early Publishing Tools** &mdash; RUNOFF, troff, and TeX: the formatters
  that first turned plain text into typeset pages.
- **Markup Languages** &mdash; GML, SGML, HTML, XML, and DocBook: the
  structural markup that separated a document's content from its
  presentation, enabling single-source publishing.
- **Markdown Ecosystem** &mdash; Markdown's creation, the proliferation of
  incompatible converters, the decade-long gap before its syntax was
  formally re-specified, and the CommonMark standard that closed that gap.
- **Modern Doc-Site Generators** &mdash; MkDocs and Material for MkDocs, the
  Python-based stack this book was originally built on.
- **Rust & Zensical** &mdash; Rust's rise as a systems language, MkDocs
  going unmaintained, and the announcement of Zensical as its Rust-based
  successor.

## How to Use

1. Use the **filter buttons** to isolate one thread of the story, or view
   **All Events** together.
2. **Click any event box** on the timeline to read its full description and
   historical context in the panel below.
3. Use the **Pan** and **Zoom** buttons to move through time &mdash; scroll
   wheel zoom is disabled inside the timeline so it doesn't fight the page's
   own scrolling.
4. Click **Fit All** at any time to reset the view to the current filter's
   full date range.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/zensical-test/sims/publishing-tools-timeline/main.html"
        height="882px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
College / professional development (technical writing, software engineering,
or documentation-tooling audiences)

### Duration
15-20 minutes

### Prerequisites
Basic familiarity with what a "markup language" is (e.g. having seen HTML
tags) is helpful but not required.

### Activities

1. **Exploration** (5 min): Filter to "Markup Languages" and click through
   GML, SGML, HTML, XML, and DocBook in order. Ask: what problem did each
   new format solve that the previous one didn't?
2. **Guided Practice** (5-10 min): Filter to "Markdown Ecosystem." Discuss
   why a format with no formal specification for a decade caused real
   problems for tool builders, and how CommonMark fixed that.
3. **Assessment** (5 min): Filter to "Rust & Zensical." Have learners explain
   in their own words why MkDocs going unmaintained, combined with a
   breaking 2.0 proposal, motivated a full rewrite instead of a patch.

### Assessment
Learners should be able to explain, for at least two adjacent events on the
timeline, what specific limitation of the earlier tool the later tool was
built to solve.

## References

1. [Zensical](https://zensical.org/) &mdash; the Rust-based successor to
   MkDocs discussed in this book's [Why Zensical?](../../why-zensical.md) page.
2. [MkDocs](https://www.mkdocs.org/) &mdash; the original Python
   documentation-site generator.
3. [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) &mdash;
   the theme this book is built with.
4. [CommonMark](https://commonmark.org/) &mdash; the standardized Markdown
   specification.
5. [John Gruber's original Markdown syntax description](https://daringfireball.net/projects/markdown/syntax) (2004).
6. [The Rust Programming Language](https://www.rust-lang.org/) &mdash; official site, including its history.
7. [DocBook](https://docbook.org/) &mdash; an early single-source XML/SGML publishing format.
8. [Pandoc](https://pandoc.org/) &mdash; the "universal document converter" built on Markdown.

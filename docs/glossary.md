# Glossary of Terms

#### Admonition

A boxed, highlighted note in a page's text — like a "Note," "Warning," or "Tip" box — created in Markdown with a `!!!` marker followed by an indented block of text.

Used throughout this book's migration guide and authoring rules to call out important information.

**Example:** Typing `!!! note "Watch Out"` followed by an indented paragraph creates a colored box with that title and text.

See also: Markdown, Material for MkDocs

#### AGENTS.md

A plain-text file placed in a software project that holds instructions for how an AI coding assistant should work on that project, written so several different assistants can all read the same file.

This book's own project keeps its rules in one AGENTS.md file so every coding assistant follows identical instructions instead of separate, possibly conflicting, copies.

**Example:** A rule such as "always use built-in dropdown menus, never draw your own" can be written once in AGENTS.md and followed by every assistant that opens the project.

See also: CLAUDE.md, Symlink (Symbolic Link)

#### Biome, oxlint, and oxfmt

A set of tools, built with the Rust programming language, that check web-page code for style mistakes and automatically reformat it, offered as faster replacements for two older, widely used tools called ESLint and Prettier.

This book cites them as an example of the broader trend — Rust-based tools replacing older ones for speed — that this book's own subject, Zensical replacing MkDocs, belongs to.

**Example:** A team could swap ESLint and Prettier for Biome and get the same style-checking and reformatting done in a fraction of the time.

See also: Rust, Linter

#### Bloom's Taxonomy

A framework that ranks six levels of learning ability, running from simply remembering facts up through understanding, applying, analyzing, evaluating, and finally creating something new.

This book's course-description page uses Bloom's Taxonomy as a template for stating what a reader should be able to do after finishing the book, though that page is currently still blank.

#### Build Artifact

A finished output file produced by a build process, such as a completed web page, as distinct from the original source file it was generated from.

**Example:** A `site/` folder full of finished HTML pages is a set of build artifacts produced from a project's Markdown source files.

See also: Build Pipeline, Static Site Generator

#### Build Pipeline

The ordered series of steps — such as reading source files, turning them into pages, building the navigation menu, and packaging the result — that a program follows to turn raw source content into a finished, publishable website.

This book walks through an example pipeline of 8 to 11 steps repeatedly, to compare running those steps one after another with running several of them at the same time.

**Example:** A simple pipeline might read Markdown files, convert them to HTML, add the navigation menu, and copy the result into a `site/` folder.

See also: Scheduler, Static Site Generator

#### Bundler (JavaScript)

A tool that gathers many separate pieces of a website's interactive code into a smaller number of files that a web browser can load efficiently.

This book mentions bundlers as background for why several newer, Rust-based bundlers are replacing older ones written in JavaScript itself.

**Example:** Turbopack, Rolldown, and Rspack are newer, Rust-based bundlers replacing older JavaScript bundlers such as Webpack.

See also: Rolldown, Rspack, Rust

#### Chart.js

A code library that draws charts and graphs, such as bar charts or line graphs, directly inside a web page.

Listed in this book as one of the tools its interactive MicroSims can be built with.

**Example:** A MicroSim could use Chart.js to plot a line graph of a value changing over time as a reader adjusts a slider.

See also: MicroSim, p5.js, vis.js (vis-network / vis-timeline)

#### CI/CD (Continuous Integration / Continuous Deployment)

A way of working in which a project's changes are automatically checked and then published every time new source material is saved to the project, instead of a person manually building and publishing it each time.

This book's own site is built and published this way, using GitHub Actions, whenever a change is pushed to its main copy.

**Example:** A writer saves an edited chapter, and within a few minutes the updated page appears live on the book's website with no further action needed.

See also: GitHub Actions, Deployment

#### CLAUDE.md

A file, read specifically by an AI coding assistant called Claude Code, that holds project instructions for that assistant.

In this book's own project, CLAUDE.md contains only a single line pointing to AGENTS.md, so Claude Code reads the exact same rules as every other assistant.

**Example:** This book's CLAUDE.md file contains just one line, `@AGENTS.md`, which tells Claude Code to load its real instructions from that other file.

See also: AGENTS.md, Symlink (Symbolic Link)

#### CLI (Command-Line Interface)

A way of operating a program by typing written commands rather than by clicking buttons and menus in a graphical window.

Both site-building tools discussed in this book, MkDocs and Zensical, are mainly operated by typing commands this way.

**Example:** Typing `zensical build` and pressing Enter tells the program to build the site, with no windows or buttons involved.

See also: MkDocs, Zensical

#### CommonMark

A precisely written, standardized description of how Markdown formatting should work, created to fix years of earlier Markdown tools that each interpreted the same formatting slightly differently.

See also: Markdown

#### Concept Taxonomy

A grouping of a course's individual ideas into a small number of broad categories, typically between 8 and 12, used to organize the material at a higher level than the full concept list.

Used in this book's learning-graph scaffolding to organize concepts before they are fully written out.

See also: Learning Graph, Directed Acyclic Graph (DAG)

#### Creative Commons License

A standardized, publicly available license that lets a creator clearly state what others are and are not allowed to do with their work, without writing custom legal terms from scratch.

This book is published under one specific version of this license, called CC BY-NC-SA 4.0, which requires giving credit, forbids commercial use, and requires sharing any adapted version under the same terms.

**Example:** CC BY-NC-SA 4.0 means a reader may copy and adapt this book's content as long as they credit the author, don't sell it, and share their version under the same license.

#### Dependency Graph

An explicit map of which tasks need which other tasks' results finished first, before those tasks themselves can begin.

This is the structure that Zensical's ZRX engine builds and then schedules work from, a capability MkDocs' older plugin system never had.

**Example:** If building the navigation menu requires every page to already be converted to HTML, the dependency graph records that page conversion must finish first.

See also: Directed Acyclic Graph (DAG), Scheduler, ZRX

#### Deployment

The act of publishing a finished, built website to the place where readers can actually visit and read it.

This book is deployed to GitHub Pages through an automated GitHub Actions workflow, rather than through the older manual command that MkDocs used, which Zensical has no equivalent for.

**Example:** After a chapter is finished, deployment copies the built pages to GitHub Pages so they appear at the book's public web address.

See also: GitHub Pages, GitHub Actions, CI/CD (Continuous Integration / Continuous Deployment)

#### Differential Build

A build that tracks precisely which output files are affected by a given change to a source file, and rebuilds only those files instead of reprocessing the whole site.

This is one of two techniques, alongside running tasks at the same time, that make Zensical's ZRX engine fast.

**Example:** Editing one chapter's text triggers a rebuild of just that chapter's page, not the book's other hundred pages.

See also: Incremental Build, ZRX

#### Directed Acyclic Graph (DAG)

A diagram made of one-directional connections between items, with no path that loops back on itself, so nothing ever ends up depending on itself even through a chain of other items.

This book uses the same underlying structure to describe both its own learning graph, showing which concepts depend on which, and a build system's map of task dependencies.

**Example:** If concept A must be learned before B, and B before C, a DAG allows that chain but forbids C from also being required before A.

See also: Learning Graph, Dependency Graph

#### DocBook

An early markup format, written in a tag-based style similar to HTML, designed so that a single source document could be automatically turned into several different finished formats.

Cited in this book's publishing-history timeline as an early example of writing content once and generating many outputs from it.

See also: Single-Source Publishing, Markup Language

#### Front Matter

A short block of descriptive information, such as a page's title, description, and preview image, written in YAML at the very top of a Markdown file before its main content begins.

Nearly every page in this book uses front matter to set its page title and the image shown when the page is shared on social media.

**Example:** A page might begin with a block listing `title: About` before the actual page content follows below it.

See also: Markdown, YAML, Open Graph Protocol

#### Git

A tool that keeps a complete history of changes made to a project's files over time, letting multiple people, or a person and an AI assistant, work on the same files without overwriting each other's work.

The entire source of this book is tracked in Git.

**Example:** Each time a chapter is edited and saved to Git, that exact change is recorded and can be looked back at or undone later.

See also: Repository, GitHub Pages

#### GitHub Actions

An automation service, built into GitHub, that runs a defined series of steps, such as building and checking a project, whenever something happens, like new material being saved to the project.

This book's site is built and published by a GitHub Actions workflow every time a change is pushed to its main copy.

**Example:** A GitHub Actions workflow can be set to automatically run `zensical build` and publish the result every time a chapter is updated.

See also: CI/CD (Continuous Integration / Continuous Deployment), GitHub Pages

#### GitHub Pages

A free service, built into GitHub, that hosts a finished website and makes it available at a public web address.

This book's finished site is published using GitHub Pages.

**Example:** This book's site is published at the address https://dmccreary.github.io/zensical-test/ using GitHub Pages.

See also: GitHub Actions, Deployment

#### GML (Generalized Markup Language)

An early markup language created by IBM in the 1960s, considered a historical ancestor of several later tag-based formats used to structure text.

Appears as an early entry in this book's publishing-tools history timeline.

See also: SGML (Standard Generalized Markup Language), Markup Language

#### Hook (Build Lifecycle Hook)

A specific, named point during a build process — such as "right after settings are loaded" or "right after the final page is written" — where an add-on piece of code is allowed to run.

This is the mechanism MkDocs' `hooks:` setting relied on; Zensical does not support it, so this book uses a different technique, a theme override, to get the same result.

**Example:** MkDocs' `hooks:` setting could run custom code right after a page finished building, to add extra tags to it — a step Zensical instead handles with a theme override.

See also: Plugin, Theme Override, Module System

#### HTML (HyperText Markup Language)

The tag-based language that web browsers read in order to display a page's text, images, and layout.

HTML is both an entry in this book's publishing-tools history timeline and the actual output format that both MkDocs and Zensical produce.

**Example:** A Markdown heading written as `# Chapter One` is converted into the HTML tag `<h1>Chapter One</h1>` before a browser displays it.

See also: Markup Language, Static Site Generator

#### iframe

A piece of HTML that embeds one entire web page inside another web page, showing it in its own rectangular frame.

This book uses an iframe on every lesson page to embed that lesson's interactive MicroSim.

**Example:** A chapter page can include an iframe pointing at a MicroSim's own file, so the simulation appears directly inside the lesson without leaving the page.

See also: MicroSim, HTML (HyperText Markup Language)

#### Incremental Build

A build that, when one source file changes, still has to work through an entire chain of everything that depends on it, even when only a small part of the final output actually needs to change.

This book contrasts incremental builds with the more precisely targeted "differential build" approach.

**Example:** Changing one word in a shared navigation file might force an incremental build to reprocess every page that includes that navigation, even though only the menu text actually changed.

See also: Differential Build, Build Pipeline

#### Jinja / MiniJinja

Two closely related templating languages used to write the reusable page-layout files that control how a site's theme looks; MkDocs uses Jinja and Zensical uses MiniJinja, and both read the same kind of override file.

Because the two languages are compatible in this way, this book's fix for restoring social-media preview tags works on both MkDocs and Zensical.

**Example:** A template file written in Jinja to insert a page's title into the page header can be read, with only small changes, by Zensical's MiniJinja engine too.

See also: Theme Override, MkDocs, Zensical

#### Knowledge Graph

A network diagram that represents real-world things and the relationships that connect them to each other.

Mentioned in this book's author biography as something used at a very large scale in a past healthcare project.

See also: Vertices, Learning Graph

#### Learning Graph

A one-directional map, with no loops, of which concepts in a course must be understood before which other concepts, so a reader or an automated system can find a valid order to learn them in.

This book has a learning-graph scaffold set up, but it has not yet been filled in with actual concepts.

**Example:** A learning graph might show that "Markdown" must be understood before "Front Matter," since front matter is written inside a Markdown file.

See also: Directed Acyclic Graph (DAG), Concept Taxonomy

#### Linter

A tool that automatically scans a project's source code for style problems or likely mistakes without actually running that code.

This book mentions linters as background for why newer, faster tools such as Ruff and Biome are being adopted in place of older ones.

**Example:** A linter might flag a line of code that is too long or a variable that is never used, without ever executing the program.

See also: Type Checker

#### Markdown

A simple, plain-text way of marking up formatting, such as headings, lists, bold text, and links, using a few easy-to-type symbols, which is later converted into HTML for display.

This entire book is written in Markdown.

**Example:** Typing `**important**` in Markdown displays as bold text reading important once the page is built.

See also: CommonMark, HTML (HyperText Markup Language), Front Matter

#### Markup Language

Any system for adding tags or symbols to plain text to describe its structure or formatting, separately from the actual words of the content itself.

HTML, XML, SGML, and GML are all examples covered in this book's publishing-history timeline.

See also: HTML (HyperText Markup Language), SGML (Standard Generalized Markup Language), GML (Generalized Markup Language)

#### Material for MkDocs

A visual theme layered on top of MkDocs that supplies a finished look, including a navigation sidebar, a search box, and a color scheme.

This theme supplies most of this book's visual design and navigation.

**Example:** The sidebar of chapter links and the search box seen on this book's site both come from Material for MkDocs, not from MkDocs itself.

See also: MkDocs, Theme Override

#### MicroSim

This book's own term for a small, focused, interactive simulation built for teaching a single idea, embedded directly into a lesson page.

This book's MicroSims are built with tools such as p5.js, Chart.js, or vis.js.

**Example:** A MicroSim showing a bouncing ball lets a reader change its speed with a slider and immediately see the effect, rather than just reading a description of motion.

See also: p5.js, Chart.js, iframe

#### MkDocs

The original site-building tool, written in the Python programming language, that this book's own project was first built with, before the project began switching over to Zensical.

See also: Zensical, Static Site Generator, Material for MkDocs

#### Module System

Zensical's approach to extending its own behavior, in which each piece of the build process explicitly states what information it needs and what it produces, instead of running open-ended add-on code that could affect any other part of the build.

This replaces the plugin-and-hook approach that MkDocs used.

**Example:** Instead of a plugin quietly changing page titles anywhere in the build, a module in Zensical's system must declare upfront that it reads page content and produces a title.

See also: Plugin, Hook (Build Lifecycle Hook), Zensical

#### Ontology

A carefully structured, formal description of the concepts within a particular subject area and how those concepts relate to one another, more rigorously organized than a general knowledge graph.

Mentioned in this book's author biography.

See also: Knowledge Graph

#### Open Graph Protocol

A shared web standard that lets a page specify, through special tags, exactly which image and text should appear when a link to it is shared on social media.

This book has a custom mechanism for setting these tags on a per-page basis.

**Example:** An `og:image` tag on a chapter page tells services like a chat app or social network which picture to show in the link preview when someone shares that chapter.

See also: Front Matter, Theme Override

#### p5.js

A code library for creating drawings, animations, and interactive graphics in a web page, popular for teaching and creative projects.

This book uses p5.js to build physics-style MicroSims, such as its bouncing-ball example.

**Example:** A p5.js sketch can draw a circle that falls and bounces on the screen, redrawing it many times a second to create the animation.

See also: MicroSim, Chart.js

#### pip

Python's traditional, built-in tool for downloading and installing add-on packages that a Python project needs.

This book's project suggests preferring a newer, faster tool called uv over pip where practical.

**Example:** Running `pip install zensical` downloads and installs the Zensical program so it can be used.

See also: uv, Poetry

#### Plugin

A separate, add-on piece of software that adds new capability to a larger host program.

Nearly all of MkDocs' features, such as search and diagrams, are built as plugins rather than being part of its core.

**Example:** A search plugin adds a search box to an MkDocs site; without that plugin installed, the site would have no search feature at all.

See also: Hook (Build Lifecycle Hook), Module System

#### Poetry

A tool for managing a Python project's add-on packages and its isolated working environment.

Named in this book as one of the older tools that the newer, faster uv tool can often replace.

See also: pip, uv

#### PyO3

A code library that lets programs written in the Rust language be called directly from Python code.

This book mentions PyO3 as the planned way that developers who do not know Rust will eventually be able to extend Zensical, even though its core is written in Rust.

See also: Rust, Zensical

#### pyproject.toml

A standardized configuration file that modern Python projects use to list their required add-on packages and settings in one place.

This file is increasingly replacing an older, simpler file called requirements.txt.

**Example:** A `pyproject.toml` file might list `zensical` as a required package, so anyone setting up the project knows to install it.

See also: pip, uv

#### Race Condition

A software bug in which the outcome depends on the unpredictable order or timing of two things happening at nearly the same moment.

This book's own deployment hit a race condition when its site was pushed live before GitHub Pages had finished being turned on for the project.

**Example:** If a publishing step runs before a hosting service has finished setting up, the publish can silently fail even though the same steps would work fine if run a minute later.

See also: Deployment, GitHub Pages

#### Repository

A directory of files, together with the complete history of changes made to them, tracked by a tool such as Git and often stored on a hosting service such as GitHub.

This book's entire project is one repository.

**Example:** The zensical-test repository on GitHub holds every chapter file, image, and configuration file for this book, along with their full edit history.

See also: Git, GitHub Pages

#### Rolldown

A bundler, built with the Rust programming language, that replaced two older JavaScript-based tools, esbuild and Rollup, inside a widely used build tool called Vite.

Cited in this book as another example of the trend toward rewriting JavaScript tools in Rust for speed.

See also: Bundler (JavaScript), Rust, Rspack

#### Rspack

A bundler, built with the Rust programming language, designed to be swapped in as a direct, compatible replacement for an older, widely used JavaScript bundler called Webpack.

See also: Bundler (JavaScript), Rust, Rolldown

#### RUNOFF

One of the earliest computer programs for formatting documents, created in the 1960s.

This is the first entry in this book's history-of-publishing-tools timeline.

See also: troff, TeX

#### Rust

A programming language designed to run very fast while also catching a category of common memory-related bugs before a program even runs.

Zensical's build engine, along with several other tools mentioned in this book such as uv and Ruff, is written in Rust, which this book credits for their large speed gains over older tools.

**Example:** Rewriting a slow Python tool in Rust can make it run many times faster on the exact same task.

See also: Zensical, ZRX, uv

#### Scheduler

The part of a build system that decides which tasks run, in what order, and whether any of them can run at the same time as each other.

This book's central technical comparison is between Zensical's scheduler, which uses a dependency graph to run tasks in parallel, and MkDocs' fixed, one-task-at-a-time order.

**Example:** A scheduler that sees two unrelated pages both need converting to HTML can hand each one to a different processor core to work on at once.

See also: Dependency Graph, Build Pipeline

#### Semantic Search

A style of search that matches results to the underlying meaning of a question rather than only to its exact wording.

Mentioned in this book's author biography.

**Example:** Searching for "how to fix a broken link" could return a page titled "Repairing Navigation Errors," even though it shares almost none of the same words.

See also: Knowledge Graph

#### SGML (Standard Generalized Markup Language)

An early standard for structuring text with tags, from which both HTML and XML were later derived.

Appears in this book's publishing-tools history timeline.

See also: HTML (HyperText Markup Language), Markup Language, GML (Generalized Markup Language)

#### Single-Source Publishing

The practice of writing a piece of content exactly once, in one plain source format, and then automatically generating every finished version a reader might need, such as a web page, a PDF, or a slide deck, from that same source.

**Example:** A single Markdown chapter file could be automatically turned into both this book's web page and a printable PDF, without anyone retyping the content twice.

See also: DocBook, Markdown

#### Single-Threaded

A description of software that can only carry out one sequence of instructions at a time, meaning it cannot make use of more than one processor core even when several are available on a computer.

This book describes MkDocs' plugin system as single-threaded by design, which is part of why it cannot run build steps at the same time the way Zensical can.

See also: Scheduler, ZRX

#### Software Fork

Taking a complete copy of an existing project's source code and continuing to develop that copy separately, under its own, independent management.

This book describes forking MkDocs as an option the Zensical team considered and rejected, choosing instead to build an entirely new tool.

See also: MkDocs, Zensical

#### Static Site Generator

A tool that converts source files, such as Markdown, into a complete set of finished web pages ahead of time, rather than building each page freshly whenever a visitor requests it.

Both MkDocs and Zensical, the two tools this book compares, belong to this category of tool.

**Example:** A static site generator turns a folder of Markdown chapter files into a finished `site/` folder of HTML pages that can be uploaded anywhere and viewed instantly.

See also: MkDocs, Zensical, Build Artifact

#### Strict Mode

A build option that turns problems normally reported only as warnings, such as a broken internal link, into hard errors that stop the build until they are fixed.

This book treats the command `mkdocs build --strict` as its authoritative check that a page is correctly built.

**Example:** A page linking to a chapter that does not exist only prints a warning in normal mode, but stops the build entirely in strict mode.

See also: Build Pipeline

#### Supply Chain Risk

The danger that a project depends on outside software or infrastructure which could later become unmaintained, broken, or insecure.

This book describes MkDocs having gone unmaintained since around August 2024 as exactly this kind of risk for every project still built on it.

See also: MkDocs, Software Fork

#### Symlink (Symbolic Link)

A special file that points to another file or folder stored elsewhere, rather than containing its own separate copy of that file's data.

This book proposes using a symlink so that one shared instructions file can be used by more than one tool at the same time, without keeping duplicate copies in sync.

**Example:** A symlink named CLAUDE.md could point at the real AGENTS.md file, so editing AGENTS.md automatically updates what CLAUDE.md appears to contain too.

See also: AGENTS.md, CLAUDE.md

#### TeX

A computer typesetting system, created by Donald Knuth, especially well known for accurately laying out complex text such as mathematical formulas.

An entry in this book's publishing-tools history timeline.

**Example:** TeX is often used to typeset textbooks and papers full of mathematical equations that would be hard to lay out correctly by hand.

See also: RUNOFF, troff

#### Theme Override

A small template file that extends a site theme's existing layout to add or change one specific piece of output, without modifying the theme's own files directly.

This book uses a theme override to restore social-media preview tags on Zensical, since Zensical does not support the older hook mechanism that used to produce them.

**Example:** This book's own `overrides/main.html` file adds custom preview-image tags to every page without editing Material for MkDocs' original theme files.

See also: Hook (Build Lifecycle Hook), Material for MkDocs, Open Graph Protocol

#### TOML

A plain-text format for storing configuration data as named sections of `key = "value"` pairs, designed to be easy for both people and programs to read reliably.

Python projects increasingly use a `pyproject.toml` file, written in TOML, to declare their dependencies and settings instead of older formats.

**Example:** A `pyproject.toml` file might contain a `[project]` section with a line like `name = "zensical-test"`.

See also: pyproject.toml, YAML

#### troff

A document-formatting tool for Unix computers, descended from the earlier RUNOFF program.

An entry in this book's publishing-tools history timeline.

See also: RUNOFF, TeX

#### ty

A newer, still-developing tool, built with the Rust programming language, that checks whether a Python program uses its data consistently, positioned as a possible future replacement for two older tools, mypy and Pyright.

See also: Type Checker, Rust

#### Type Checker

A tool that checks whether a program's data is being used consistently, catching certain kinds of mistakes without actually running the program.

Mentioned as background for why the older tools mypy and Pyright, and the newer tool ty, are discussed together.

**Example:** A type checker could catch, before the program ever runs, an attempt to add a number to a piece of text by mistake.

See also: ty, Linter

#### uv

A much faster tool, built with the Rust programming language, that can stand in for several older Python tools at once, including pip and others used to install packages and manage isolated project environments.

This book's project proposes preferring uv over the older pip tool where practical.

**Example:** Running `uv pip install zensical` can install the same package as plain `pip install zensical`, but noticeably faster.

See also: pip, Poetry, Rust

#### Vertices

The individual points, also called nodes, that make up a graph, which are linked to each other by connecting lines called edges.

This book's author biography mentions working with a graph containing 25 billion vertices.

**Example:** In a graph of a family tree, each person is a vertex, and each parent-child relationship is an edge connecting two vertices.

See also: Knowledge Graph, Directed Acyclic Graph (DAG)

#### vis.js (vis-network / vis-timeline)

A set of code libraries for drawing interactive network diagrams and timelines in a web page.

This book uses vis.js to build its history-of-publishing-tools timeline MicroSim.

**Example:** A vis.js timeline could plot RUNOFF, troff, TeX, SGML, and HTML along a single horizontal line in the order they were invented.

See also: MicroSim, Chart.js

#### Watch List (File Watcher)

A setting in a site's configuration file that tells a running preview server which files or folders to keep an eye on, so it can automatically reload the page when one of them changes.

This book's project ran into a serious Zensical bug caused by this setting accidentally referencing the configuration file's own name.

**Example:** If the watch list accidentally includes `mkdocs.yml`, the config file's own name, it can cause the server to behave incorrectly and stop producing any pages at all.

See also: YAML

#### YAML

A plain-text format for storing structured data, designed to be easy for a person to read, using indentation instead of symbols like brackets to show structure.

This book's entire site configuration file, `mkdocs.yml` (the `.yml` extension is short for YAML), and every page's front matter are written in YAML.

**Example:** A line reading `title: About` inside a YAML file simply pairs the label "title" with the value "About."

See also: Front Matter

#### Zensical

A newer, Rust-based site-building tool, created by the same team behind Material for MkDocs, built to be a faster successor to MkDocs.

Migrating this book's own site from MkDocs to Zensical is the entire subject of this book.

**Example:** Running `zensical build` reads this book's Markdown files and configuration and produces the same kind of finished website that `mkdocs build` would, generally much faster.

See also: MkDocs, ZRX, Rust

#### ZRX

Zensical's underlying build engine, which works out an explicit map of every build task's dependencies and then runs as many of those tasks as possible at the same time, across a computer's available processor cores.

This replaces the fixed, one-task-at-a-time order that MkDocs always used.

**Example:** If ten chapter pages have no dependency on one another, ZRX can build all ten of them simultaneously instead of one after another.

See also: Zensical, Dependency Graph, Scheduler


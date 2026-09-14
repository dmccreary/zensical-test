# Cover Image Prompt

Please generate a professional-quality cover image for this book.
This image will be used in social media previews and must follow the
formatting guidelines for an Open Graph image preview.

**Required specifications:**
- Format: PNG
- Wide-landscape format
- Size: 1200x630 pixels (1.91:1 aspect ratio)
- This is the Open Graph standard for social media previews

The image has four layers, back to front: background montage, color
treatment, mascot (none for this book), and title text.

## Subject & Tone

"Migrating from Mkdocs to Zensical" is a technical guide (not a
student-facing textbook) that shows documentation-site maintainers how to
upgrade their book-building toolchain from MkDocs' single-threaded Python
build to Zensical, the Rust-based successor from the Material for MkDocs
team, and other Rust-enabled tools that let build steps run in parallel
across CPU cores. The intended audience is technical writers, DevOps
engineers, and documentation maintainers who already run an MkDocs
Material site and want dramatically faster builds. The visual tone should
be modern, technical, and performance-driven — think "before/after
benchmark" energy, not a soft educational-textbook look.

## Title

Place "Migrating from Mkdocs to Zensical" in the center of the image, in a
clean, highly legible sans-serif font. Use a light/white font color with a
subtle drop shadow or dark scrim behind it so it stays readable against the
busy montage background. Keep the title short enough to render at a large
size — do not shrink it to fit; instead simplify the background directly
behind the text. It is acceptable to break the title across two lines
("Migrating from Mkdocs" / "to Zensical") to keep the font size large.

## Background Montage

Arrange a montage of the following 6 concepts around the title, each
rendered in a consistent illustration style (see Style below) so the
composition reads as one image rather than a collage of unrelated styles.
Split the montage left/right or top/bottom into a clear "before vs. after"
layout: the MkDocs/serial side rendered in cooler, muted, slightly dimmer
tones, and the Zensical/parallel side rendered in warmer, brighter,
higher-energy tones (echoing Rust's orange brand color) to visually sell
the speed contrast.

1. **Serial build timeline (MkDocs side)** — a single thin horizontal
   lane/timeline showing build steps (parse, render, index, assemble)
   queued one after another end-to-end, muted blue-gray, labeled subtly
   "serial" — evokes a slow, one-core-at-a-time pipeline.
2. **Parallel build DAG (Zensical side)** — a directed acyclic graph:
   several small boxes on the left (e.g. "Parse Ch.1", "Parse Ch.2", "Parse
   Ch.3") each with an arrow flowing into rendering boxes, which converge
   through a few more nodes into one final "Assemble Site" box on the
   right — arrows all pointing rightward, no cycles, rendered in bright
   orange/amber on a dark panel. This is the single most important element
   in the montage; base its layout loosely on this reference build-pipeline
   diagram: {ATTACH: docs/sims/zrx-parallel-build-pipeline/zrx-parallel-build-pipeline.png}
   — reproduce its left-to-right fan-out/fan-in DAG shape and node style,
   not its UI chrome (sliders, buttons, legend panel).
3. **10-core CPU** — a stylized top-down or isometric view of a modern
   computer processor chip with a visible 10-core grid layout (a 2x5 or
   5x2 array of small glowing square cores on the die), several cores lit
   up bright orange simultaneously to show concurrent work, rendered as a
   clean technical illustration (not photorealistic).
4. **Speedup bar or line chart** — a small, clean data chart comparing
   build time: one short/tall bar labeled roughly "1x" (MkDocs, muted
   color) next to a bar 10x shorter/lower labeled "10x" (Zensical, bright
   orange) — simple, legible at small size, no dense axis labels beyond
   the two multiplier callouts.
5. **Rust gear/cog motif** — a minimal gear or cog icon in Rust's
   signature orange, subtly suggesting the Rust-based tooling that powers
   the parallel build steps, without using Rust's actual trademarked logo.
6. **Stopwatch or clock face cracking/shattering into fast-forward motion
   lines** — a simple icon conveying "build time collapsing," positioned
   near the speedup chart to reinforce the performance story.

## Mascot

(No mascot for this book — omit this element entirely.)

## Style & Composition

- Illustration style: flat vector / clean technical illustration with
  subtle depth (soft shadows, no photorealism) — apply this same style to
  every montage element for visual consistency.
- Color palette: dark charcoal/near-black background, muted slate-blue for
  the "MkDocs/serial" side, bright Rust-orange and amber for the
  "Zensical/parallel" side, white/light-gray for title text and chart
  labels.
- Lighting/mood: high-contrast and energetic on the parallel/orange side,
  flatter and dimmer on the serial/blue side — the contrast itself is the
  message.
- Composition: title centered (or upper-center), with the serial timeline
  (concept 1) and muted tones on the left third, the DAG (concept 2) as
  the dominant central-lower element flowing left-to-right, the 10-core
  chip (concept 3) and speedup chart (concept 4) in the right third, and
  the gear (5) and stopwatch (6) as small accent details tucked into
  corners without crowding the title.

## Avoid

- Do not render dense paragraphs of illegible text anywhere in the image
  — chart labels should be limited to short numerals like "1x" / "10x".
- Avoid generic stock-photo cliches (handshakes, isolated lightbulbs,
  people pointing at whiteboards).
- Avoid photorealistic human faces or hands.
- Do not use Rust's or MkDocs'/Material's actual trademarked logos —
  evoke their colors/motifs generically instead.
- Do not let montage elements visually compete with or overlap the title
  text.

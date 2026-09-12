# MicroSims

MicroSims are small, interactive educational simulations — each one focused on
a single concept. They live under `docs/sims/<sim-name>/` and are embedded
into chapters via iframes.

New MicroSims can be created with the `microsim-generator` skill, which routes
to the appropriate library (p5.js, Chart.js, vis-network, Mermaid, Leaflet,
Plotly, Venn.js).

- [Bouncing Ball](bouncing-ball/index.md) — the "Hello World!" of MicroSims;
  a ball bouncing in a drawing region with a speed slider. Also serves as a
  test page for the site's social-media preview override, since it declares
  its own `image:` frontmatter.

<!-- The MicroSim catalog is built up as new sims are added. -->

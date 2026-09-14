# KaTeX Test: The Equations Behind the Zensical Logo

This page verifies that [KaTeX](https://katex.org/) equation rendering is
wired up correctly, using a **currency-safe** delimiter configuration: plain
`$` is left alone for prices, and `\(...\)` / `$$...$$` are used for math.

## Why these three equations

Zensical's visual identity — the animated curve on
[zensical.org](https://zensical.org/) — is a **strange attractor**: a system
where simple, deterministic equations produce complex, never-repeating
motion. The specific system is the **Lorenz attractor**, discovered by
meteorologist Edward Lorenz while modeling atmospheric convection. It is
defined by exactly three coupled ordinary differential equations:

$$
\frac{dx}{dt} = \sigma (y - x)
$$

$$
\frac{dy}{dt} = x (\rho - z) - y
$$

$$
\frac{dz}{dt} = xy - \beta z
$$

With the classic parameters \(\sigma = 10\), \(\rho = 28\), and
\(\beta = 8/3\), iterating these three equations produces the butterfly-
shaped curve traced by Zensical's logo: small differences in starting
conditions lead to wildly different paths, the same "butterfly effect"
sensitivity that gave chaos theory its name.

## Currency-safe check

A KaTeX setup that uses single `$...$` for inline math cannot tell the
difference between math and a price. This project's configuration
(`inline_syntax: ['round']` in `mkdocs.yml`) fixes that: inline math must
use `\(...\)`, so plain dollar amounts render as plain text.

- Migrating this site to Zensical cost the team roughly $0 in new tooling —
  it's still free and open source.
- A hypothetical support plan might run $20 a month, or $1.99 per page —
  none of that should trigger math rendering.
- But the inline equation \(e^{i\pi} + 1 = 0\) should render as a proper
  equation, not literal text.

## Display math check

$$
\int_0^\infty e^{-x^2}\, dx = \frac{\sqrt{\pi}}{2}
$$

If KaTeX is working, the three Lorenz equations above render as typeset
math (not raw LaTeX source), the dollar amounts above render as plain
text, and the inline Euler's-identity and integral examples render as
math.

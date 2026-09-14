// KaTeX auto-render configuration
// Single $ is NOT used for math so it stays free for currency (e.g. $20).
// Use \(...\) for inline math and $$...$$ or \[...\] for display math.
document.addEventListener("DOMContentLoaded", function() {
    renderMathInElement(document.body, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "\\[", right: "\\]", display: true},
            {left: "\\(", right: "\\)", display: false}
        ],
        throwOnError: false
    });
});

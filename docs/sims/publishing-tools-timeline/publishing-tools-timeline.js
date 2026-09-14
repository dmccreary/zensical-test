// History of Documentation and Publishing Tools - vis-timeline
// CANVAS_HEIGHT: 880

const CATEGORIES = [
    { name: 'Early Publishing Tools', cls: 'cat-early' },
    { name: 'Markup Languages', cls: 'cat-markup' },
    { name: 'Markdown Ecosystem', cls: 'cat-markdown' },
    { name: 'Modern Doc-Site Generators', cls: 'cat-generators' },
    { name: 'Rust & Zensical', cls: 'cat-rust' }
];

// start/end are [year, monthIndex(0-11), day]. Single-date events omit "end".
const EVENTS = [
    {
        id: 1, category: 'Early Publishing Tools', start: [1964, 5, 1],
        headline: 'RUNOFF: First Document Formatter',
        text: 'Jerry Saltzer at MIT writes RUNOFF, one of the first computer programs to format running text into a printable document.',
        notes: "RUNOFF's descendants (roff, nroff, troff) shaped Unix documentation tooling for decades."
    },
    {
        id: 2, category: 'Markup Languages', start: [1969, 0, 1],
        headline: 'GML Introduced at IBM',
        text: 'Charles Goldfarb, Edward Mosher, and Raymond Lorie invent Generalized Markup Language (GML) at IBM, separating a document’s logical structure from how it is displayed — the founding idea behind every markup language that follows.',
        notes: "GML's name comes from the inventors' initials, a coincidence IBM enjoyed pointing out."
    },
    {
        id: 3, category: 'Early Publishing Tools', start: [1973, 0, 1],
        headline: 'troff Brings Typesetting to Unix',
        text: 'Joseph Ossanna develops troff (and nroff) at Bell Labs, giving Unix a typesetting-quality document formatter driven entirely by plain-text markup commands.',
        notes: 'troff still typesets the official Unix and Linux man pages today.'
    },
    {
        id: 4, category: 'Early Publishing Tools', start: [1978, 0, 1],
        headline: 'Donald Knuth Releases TeX',
        text: 'Frustrated by the declining quality of typeset mathematics in his own books, Donald Knuth builds TeX, a markup-driven typesetting system capable of professional-grade book and academic-paper layout.',
        notes: 'TeX (via LaTeX) remains the dominant tool for scientific and mathematical publishing.'
    },
    {
        id: 5, category: 'Markup Languages', start: [1986, 9, 1],
        headline: 'SGML Becomes an ISO Standard',
        text: 'Standard Generalized Markup Language (ISO 8879), built on GML’s ideas, becomes an international standard for defining custom, structured markup languages.',
        notes: 'SGML is complex and expensive to implement, which limits it mostly to large publishers, government, and aerospace/defense documentation.'
    },
    {
        id: 6, category: 'Markup Languages', start: [1991, 2, 1],
        headline: 'Tim Berners-Lee Publishes HTML',
        text: 'Tim Berners-Lee describes HyperText Markup Language, a simplified SGML application designed to link and format documents on the newly invented World Wide Web.',
        notes: "HTML's simplicity relative to full SGML is a major reason the Web spread so quickly."
    },
    {
        id: 7, category: 'Markup Languages', start: [1991, 10, 1],
        headline: 'DocBook: An Early Single-Source Format',
        text: 'HaL Computer Systems and O’Reilly release DocBook, an SGML (later XML) vocabulary for technical documentation that can be authored once and automatically published as print, HTML, and help formats — an early example of single-source publishing.',
        notes: 'Single-source publishing separates content from presentation so one source document can drive many output formats without duplicating effort.'
    },
    {
        id: 8, category: 'Markup Languages', start: [1998, 1, 10],
        headline: 'XML 1.0 Simplifies SGML for the Web',
        text: 'The W3C publishes the XML 1.0 recommendation, a stripped-down, stricter subset of SGML designed to be easy for software to parse — quickly becoming the standard for data interchange and structured documentation.',
        notes: 'IBM’s Darwin Information Typing Architecture (DITA), an XML vocabulary released in 2001, becomes the dominant standard for single-source technical documentation.'
    },
    {
        id: 9, category: 'Markdown Ecosystem', start: [2004, 2, 19],
        headline: 'John Gruber Creates Markdown',
        text: 'John Gruber, with input from Aaron Swartz, releases Markdown: a lightweight plain-text syntax that converts to HTML, designed to be readable even before conversion — a deliberate reaction to the verbosity of HTML and XML markup.',
        notes: "Markdown.pl, Gruber's own Perl script, is simultaneously the specification and the first Markdown-to-HTML converter."
    },
    {
        id: 10, category: 'Markdown Ecosystem', start: [2004, 3, 1], end: [2006, 11, 1],
        headline: 'Markdown Converters Multiply',
        text: 'Independent implementations — including Python-Markdown and John MacFarlane’s Pandoc (2006), which converts Markdown to and from dozens of formats — begin to diverge in how they handle edge cases, since Markdown.pl’s prose description is not a precise formal specification.',
        notes: "Pandoc's universal-converter approach makes it one of the most widely used document-conversion tools in publishing and academia."
    },
    {
        id: 11, category: 'Markdown Ecosystem', start: [2004, 3, 1], end: [2014, 8, 1],
        headline: 'A Decade Without a Markdown Update',
        text: 'Gruber’s original Markdown syntax description is never formally revised, even as dozens of incompatible implementations spread across blogs, forums, and developer tools — each resolving the spec’s ambiguities differently.',
        notes: 'By the early 2010s, "Markdown" means noticeably different things depending on which tool renders it, motivating a push for a common, testable specification.'
    },
    {
        id: 12, category: 'Markdown Ecosystem', start: [2014, 8, 1],
        headline: 'CommonMark Standardizes Markdown',
        text: 'Jeff Atwood, John MacFarlane, and others launch CommonMark, a strongly defined, testable specification of Markdown syntax with a reference implementation — closing the decade-long ambiguity gap left by the original spec.',
        notes: "Most modern Markdown processors, including Python-Markdown's core, now aim for CommonMark compatibility."
    },
    {
        id: 13, category: 'Modern Doc-Site Generators', start: [2014, 0, 1],
        headline: 'MkDocs Brings Markdown to Python Docs',
        text: 'Tom Christie releases MkDocs, a static-site generator purpose-built to turn a directory of Markdown files and one YAML config file into a browsable documentation site — quickly becoming a standard tool for Python project documentation.',
        notes: "MkDocs' simplicity — a working site with no plugins required — is central to its early adoption."
    },
    {
        id: 14, category: 'Rust & Zensical', start: [2009, 3, 1], end: [2015, 4, 15],
        headline: 'Rust Grows Up and Reaches 1.0',
        text: 'Originally a personal project by Graydon Hoare, Rust is sponsored by Mozilla starting in 2009 and reaches its stable 1.0 release in May 2015, offering memory-safe systems programming without a garbage collector.',
        notes: "Rust's combination of speed and safety later makes it the language of choice for a wave of tools that rewrite slow Python/JavaScript tooling — uv, Ruff, Turbopack, and eventually Zensical."
    },
    {
        id: 15, category: 'Modern Doc-Site Generators', start: [2016, 0, 1],
        headline: 'Material for MkDocs Launches',
        text: 'Martin Donath releases Material for MkDocs, a theme built on Google’s Material Design that adds search, navigation, and visual polish. Over the next decade it becomes the way tens of thousands of teams publish documentation with MkDocs.',
        notes: 'This book, Zensical Test, is itself built on Material for MkDocs.'
    },
    {
        id: 16, category: 'Rust & Zensical', start: [2024, 7, 1],
        headline: 'MkDocs Development Stalls',
        text: 'MkDocs, the Python foundation underneath Material for MkDocs and hundreds of ecosystem plugins, sees no meaningful maintenance activity from around August 2024 onward — turning a load-bearing dependency into a supply-chain risk.',
        notes: 'A proposed, breaking MkDocs 2.0 direction around the same time would also have broken Material for MkDocs and roughly 300 ecosystem plugins.'
    },
    {
        id: 17, category: 'Rust & Zensical', start: [2025, 0, 1],
        headline: 'Zensical Announced as MkDocs’ Successor',
        text: 'The Material for MkDocs team announces Zensical, a from-scratch, Rust-based site generator (built around the ZRX build engine) designed to replace the single-threaded, side-effect-heavy MkDocs plugin model with an explicit, parallelizable dependency graph — while still reading the same mkdocs.yml config.',
        notes: 'Zensical reports repeated builds running four to five times faster than MkDocs, thanks to differential builds and true multi-core parallelization.'
    }
];

document.addEventListener('DOMContentLoaded', function () {

    const catByName = {};
    CATEGORIES.forEach(c => { catByName[c.name] = c; });

    const allItems = EVENTS.map(e => {
        const item = {
            id: e.id,
            content: e.headline,
            start: new Date(e.start[0], e.start[1], e.start[2]),
            className: catByName[e.category].cls,
            category: e.category,
            title: e.headline
        };
        if (e.end) {
            item.end = new Date(e.end[0], e.end[1], e.end[2]);
            item.type = 'range';
        }
        return item;
    });

    const eventById = {};
    EVENTS.forEach(e => { eventById[e.id] = e; });

    const dataset = new vis.DataSet(allItems);

    const container = document.getElementById('timeline');

    const options = {
        width: '100%',
        height: '560px',
        margin: {
            item: { horizontal: 50, vertical: 10 },
            axis: 40
        },
        orientation: 'top',
        zoomMin: 1000 * 60 * 60 * 24 * 365 * 5,     // 5 years minimum zoom
        zoomMax: 1000 * 60 * 60 * 24 * 365 * 80,    // 80 years maximum zoom
        min: new Date(1955, 0, 1),
        max: new Date(2032, 0, 1),
        tooltip: { followMouse: true },
        stack: true,
        selectable: true,
        showCurrentTime: false,
        moveable: true,
        zoomable: false   // scroll-wheel zoom disabled; use +/- buttons instead
    };

    const timeline = new vis.Timeline(container, dataset, options);

    // Don't let the timeline hijack vertical page scrolling in an iframe.
    container.addEventListener('wheel', function (e) {
        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (!isHorizontal) {
            e.stopImmediatePropagation();
        } else {
            e.preventDefault();
            const win = timeline.getWindow();
            const interval = win.end - win.start;
            const shift = (e.deltaX / container.clientWidth) * interval;
            timeline.setWindow(
                new Date(win.start.valueOf() + shift),
                new Date(win.end.valueOf() + shift),
                { animation: false }
            );
        }
    }, true);

    function fitToData(items) {
        if (items.length === 0) return;
        const starts = items.map(i => i.start.getTime());
        const ends = items.map(i => (i.end ? i.end.getTime() : i.start.getTime()));
        const minD = Math.min(...starts);
        const maxD = Math.max(...ends);
        const year = 365 * 24 * 60 * 60 * 1000;
        timeline.setWindow(new Date(minD - 3 * year), new Date(maxD + 3 * year), { animation: false });
    }

    fitToData(allItems);

    // ---- Category filter buttons ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            const filtered = category === 'all'
                ? allItems
                : allItems.filter(i => i.category === category);
            dataset.clear();
            dataset.add(filtered);
            fitToData(filtered);
        });
    });

    // ---- Navigation buttons ----
    document.getElementById('pan-left').addEventListener('click', function () {
        const win = timeline.getWindow();
        const shift = (win.end - win.start) * 0.3;
        timeline.setWindow(new Date(win.start.valueOf() - shift), new Date(win.end.valueOf() - shift));
    });
    document.getElementById('pan-right').addEventListener('click', function () {
        const win = timeline.getWindow();
        const shift = (win.end - win.start) * 0.3;
        timeline.setWindow(new Date(win.start.valueOf() + shift), new Date(win.end.valueOf() + shift));
    });
    document.getElementById('zoom-in').addEventListener('click', function () {
        const win = timeline.getWindow();
        const mid = (win.start.valueOf() + win.end.valueOf()) / 2;
        const half = (win.end.valueOf() - win.start.valueOf()) / 2 * 0.5;
        timeline.setWindow(new Date(mid - half), new Date(mid + half));
    });
    document.getElementById('zoom-out').addEventListener('click', function () {
        const win = timeline.getWindow();
        const mid = (win.start.valueOf() + win.end.valueOf()) / 2;
        const half = (win.end.valueOf() - win.start.valueOf()) / 2 * 2;
        timeline.setWindow(new Date(mid - half), new Date(mid + half));
    });
    document.getElementById('fit-all').addEventListener('click', function () {
        const active = document.querySelector('.filter-btn.active').dataset.category;
        const items = active === 'all' ? allItems : allItems.filter(i => i.category === active);
        fitToData(items);
    });

    // ---- Event details on click ----
    const infoTitle = document.getElementById('info-title');
    const infoText = document.getElementById('info-text');

    timeline.on('select', function (properties) {
        if (properties.items.length === 0) return;
        const e = eventById[properties.items[0]];
        if (!e) return;
        const yearLabel = e.end ? (e.start[0] + '–' + e.end[0]) : e.start[0];
        infoTitle.textContent = e.headline + ' (' + yearLabel + ')';
        infoText.innerHTML = e.text + '<div class="info-notes">' + e.notes + '</div>';
    });

    // ---- Legend ----
    const legend = document.getElementById('legend');
    CATEGORIES.forEach(c => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        const swatch = document.createElement('div');
        swatch.className = 'legend-color ' + c.cls;
        item.appendChild(swatch);
        const label = document.createElement('span');
        label.textContent = c.name;
        item.appendChild(label);
        legend.appendChild(item);
    });
});

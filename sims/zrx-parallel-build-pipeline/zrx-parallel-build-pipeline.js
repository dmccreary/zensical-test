// ZRX Parallel Build Pipeline
// CANVAS_HEIGHT: 650
// Simulates a Markdown-to-HTML textbook build scheduled two ways:
// a dependency graph run across multiple cores (ZRX), vs. a fixed
// one-task-at-a-time order (legacy MkDocs plugin sequence).

const colors = {
    pending: { background: '#e0e0e0', border: '#757575', font: '#333333' },
    running: { background: '#ffd700', border: '#ffa000', font: '#333333' },
    complete: { background: '#4caf50', border: '#2e7d32', font: '#ffffff' }
};

// Every build task: its label, fixed layout position, and the task
// ids it depends on. Ascending id order is itself a valid topological
// order, which is what "Sequential (Legacy)" mode runs in - exactly
// like MkDocs plugins running in mkdocs.yml order.
const taskDefs = [
    { id: 1, label: 'Parse\nChapter 1 .md', x: -430, y: -190, deps: [] },
    { id: 2, label: 'Parse\nChapter 2 .md', x: -430, y: -65, deps: [] },
    { id: 3, label: 'Parse\nChapter 3 .md', x: -430, y: 60, deps: [] },
    { id: 4, label: 'Parse\nMicroSim Assets', x: -430, y: 185, deps: [] },
    { id: 5, label: 'Render\nChapter 1 HTML', x: -230, y: -190, deps: [1] },
    { id: 6, label: 'Render\nChapter 2 HTML', x: -230, y: -65, deps: [2] },
    { id: 7, label: 'Render\nChapter 3 HTML', x: -230, y: 60, deps: [3] },
    { id: 8, label: 'Embed\nMicroSims', x: -230, y: 185, deps: [4] },
    { id: 9, label: 'Build\nNav / TOC', x: -30, y: -40, deps: [5, 6, 7] },
    { id: 10, label: 'Generate\nSearch Index', x: -30, y: 95, deps: [5, 6, 7, 8] },
    { id: 11, label: 'Assemble\nFinal Site', x: 150, y: 25, deps: [9, 10] }
];

const edgeData = [];
taskDefs.forEach(t => t.deps.forEach(d => edgeData.push({ from: d, to: t.id })));

const SEQUENTIAL_ORDER = taskDefs.map(t => t.id); // ascending id = config order

let nodes, edges, network;
let taskStatus = {};      // id -> 'pending' | 'running' | 'complete'
let coreAssignment = {};  // core index (1-based) -> taskId
let mode = 'parallel';    // 'parallel' | 'sequential'
let cores = 16;           // assume a realistic modern multi-core machine
let stepCount = 0;
let lastMessage = 'Click "Next Step" to start the build.';

function isInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function depsSatisfied(t) {
    return t.deps.every(d => taskStatus[d] === 'complete');
}

function allDone() {
    return taskDefs.every(t => taskStatus[t.id] === 'complete');
}

function taskById(id) {
    return taskDefs.find(t => t.id === id);
}

function resetState() {
    stepCount = 0;
    coreAssignment = {};
    taskDefs.forEach(t => { taskStatus[t.id] = 'pending'; });
    lastMessage = mode === 'parallel'
        ? 'Click "Next Step" to start the ZRX build. Tasks with no unmet dependencies will run together.'
        : 'Click "Next Step" to start the legacy build. Tasks run one at a time, in fixed order.';
}

// One tick: finish whatever was running, then start the next wave.
function advanceParallel() {
    const finished = [];
    taskDefs.forEach(t => {
        if (taskStatus[t.id] === 'running') {
            taskStatus[t.id] = 'complete';
            finished.push(t.id);
        }
    });

    coreAssignment = {};
    const ready = taskDefs.filter(t => taskStatus[t.id] === 'pending' && depsSatisfied(t));
    const starting = ready.slice(0, cores);
    starting.forEach((t, i) => {
        taskStatus[t.id] = 'running';
        coreAssignment[i + 1] = t.id;
    });

    stepCount++;

    if (starting.length > 0) {
        const names = starting.map(t => t.label.replace('\n', ' ')).join(', ');
        lastMessage = `Step ${stepCount}: ${starting.length} task(s) with satisfied dependencies start together - ${names}.`;
    } else if (finished.length > 0) {
        const names = finished.map(id => taskById(id).label.replace('\n', ' ')).join(', ');
        lastMessage = `Step ${stepCount}: ${names} finished. Build complete!`;
    } else {
        lastMessage = `Step ${stepCount}: nothing left to schedule.`;
    }
}

function advanceSequential() {
    let runningId = Object.values(coreAssignment)[0] || null;

    if (runningId !== null) {
        taskStatus[runningId] = 'complete';
    }

    coreAssignment = {};
    const nextId = SEQUENTIAL_ORDER.find(id => taskStatus[id] === 'pending');

    stepCount++;

    if (nextId !== undefined) {
        taskStatus[nextId] = 'running';
        coreAssignment[1] = nextId;
        lastMessage = `Step ${stepCount}: legacy scheduler runs "${taskById(nextId).label.replace('\n', ' ')}" alone - one plugin at a time, in mkdocs.yml order.`;
    } else if (runningId !== null) {
        lastMessage = `Step ${stepCount}: "${taskById(runningId).label.replace('\n', ' ')}" finished. Build complete!`;
    } else {
        lastMessage = `Step ${stepCount}: nothing left to schedule.`;
    }
}

function sequentialBaselineSteps() {
    return taskDefs.length + 1; // one task per tick, plus a trailing finish tick
}

function setNodeVisual(id) {
    const c = colors[taskStatus[id]];
    nodes.update({
        id,
        color: { background: c.background, border: c.border },
        font: { color: c.font, size: 14 }
    });
}

function refreshAllNodeVisuals() {
    taskDefs.forEach(t => setNodeVisual(t.id));
}

// Right-panel width (see .right-panel in style.css), plus margins that
// keep the graph clear of the panel and the title bar.
const RIGHT_PANEL_PX = 274;
const LEFT_MARGIN_PX = 20;
const RIGHT_GAP_PX = 15;
const TOP_MARGIN_PX = 45;
const BOTTOM_MARGIN_PX = 20;

// vis-network's own fit() always scales to the FULL canvas width, which
// runs nodes under the right-panel overlay. Compute the true node
// bounding box instead and fit it into just the unobstructed region.
function positionView() {
    network.once('afterDrawing', function () {
        const allIds = nodes.getIds();
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        allIds.forEach(id => {
            const box = network.getBoundingBox(id);
            left = Math.min(left, box.left);
            right = Math.max(right, box.right);
            top = Math.min(top, box.top);
            bottom = Math.max(bottom, box.bottom);
        });
        const graphWidth = right - left;
        const graphHeight = bottom - top;
        const graphCenterX = (left + right) / 2;
        const graphCenterY = (top + bottom) / 2;

        const canvasEl = document.getElementById('network');
        const canvasWidth = canvasEl.clientWidth;
        const canvasHeight = canvasEl.clientHeight;

        const availWidth = canvasWidth - RIGHT_PANEL_PX - LEFT_MARGIN_PX - RIGHT_GAP_PX;
        const availHeight = canvasHeight - TOP_MARGIN_PX - BOTTOM_MARGIN_PX;
        const scale = Math.min(availWidth / graphWidth, availHeight / graphHeight);

        const targetCenterScreenX = LEFT_MARGIN_PX + availWidth / 2;
        const targetCenterScreenY = TOP_MARGIN_PX + availHeight / 2;
        const cameraX = graphCenterX - (targetCenterScreenX - canvasWidth / 2) / scale;
        const cameraY = graphCenterY - (targetCenterScreenY - canvasHeight / 2) / scale;

        network.moveTo({ position: { x: cameraX, y: cameraY }, scale: scale, animation: false });
    });
}

function buildNetwork() {
    const initialNodes = taskDefs.map(t => ({
        id: t.id,
        label: t.label,
        x: t.x,
        y: t.y,
        color: { background: colors.pending.background, border: colors.pending.border },
        font: { color: colors.pending.font, size: 14 }
    }));

    const initialEdges = edgeData.map((e, i) => ({
        id: i,
        from: e.from,
        to: e.to,
        color: { color: '#555555' },
        width: 2
    }));

    nodes = new vis.DataSet(initialNodes);
    edges = new vis.DataSet(initialEdges);

    const enableMouse = !isInIframe();

    const options = {
        layout: { improvedLayout: false },
        physics: { enabled: false },
        interaction: {
            selectConnectedEdges: false,
            zoomView: enableMouse,
            dragView: enableMouse,
            navigationButtons: true,
            keyboard: { enabled: true, bindToWindow: false, speed: { x: 2, y: 2, zoom: 0.01 } }
        },
        nodes: {
            shape: 'box',
            margin: 10,
            widthConstraint: { minimum: 118, maximum: 130 },
            font: { size: 14, face: 'Arial', multi: false },
            borderWidth: 3,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', size: 4, x: 2, y: 2 }
        },
        edges: {
            arrows: { to: { enabled: true, scaleFactor: 1 } },
            width: 2,
            smooth: { type: 'cubicBezier', forceDirection: 'horizontal', roundness: 0.5 }
        }
    };

    const container = document.getElementById('network');
    network = new vis.Network(container, { nodes, edges }, options);
    positionView();
}

function updateUI() {
    document.getElementById('step-counter').textContent = `Step: ${stepCount}`;
    document.getElementById('status-text').textContent = lastMessage;

    // Core assignment list. Busy cores are always the lowest-numbered
    // ones (see advanceParallel/advanceSequential), so idle cores form
    // one contiguous trailing block - summarize it as a single line
    // instead of one row per core, or a 16-core machine would need a
    // 16-row list to say "idle" twelve times.
    const list = document.getElementById('core-list');
    list.innerHTML = '';
    const coreCount = mode === 'parallel' ? cores : 1;
    const busyCores = Object.keys(coreAssignment).map(Number);
    const maxBusy = busyCores.length > 0 ? Math.max(...busyCores) : 0;

    for (let i = 1; i <= maxBusy; i++) {
        const li = document.createElement('li');
        const taskId = coreAssignment[i];
        if (taskId) {
            li.innerHTML = `<span class="core-id">Core ${i}:</span><span>${taskById(taskId).label.replace('\n', ' ')}</span>`;
        } else {
            li.innerHTML = `<span class="core-id">Core ${i}:</span><span class="core-idle">idle</span>`;
        }
        list.appendChild(li);
    }
    if (maxBusy < coreCount) {
        const idleCount = coreCount - maxBusy;
        const li = document.createElement('li');
        const rangeLabel = idleCount === 1 ? `Core ${coreCount}` : `Cores ${maxBusy + 1}-${coreCount}`;
        li.innerHTML = `<span class="core-id">${rangeLabel}:</span><span class="core-idle">idle (${idleCount} unused)</span>`;
        list.appendChild(li);
    }
    if (mode === 'sequential') {
        const note = document.createElement('li');
        note.innerHTML = '<span class="core-idle">Legacy MkDocs never uses more than one core, no matter how many are available.</span>';
        list.appendChild(note);
    }

    // Progress stats
    const baseline = sequentialBaselineSteps();
    document.getElementById('stat-this-run').textContent = `${stepCount} step${stepCount === 1 ? '' : 's'}`;
    document.getElementById('stat-baseline').textContent = `${baseline} steps`;

    const speedupEl = document.getElementById('stat-speedup');
    if (stepCount === 0) {
        speedupEl.textContent = '-';
    } else {
        const speedup = (baseline / stepCount).toFixed(2);
        speedupEl.textContent = `${speedup}x`;
    }

    const banner = document.getElementById('done-banner');
    const nextBtn = document.getElementById('next-btn');
    if (allDone()) {
        nextBtn.disabled = true;
        banner.textContent = mode === 'parallel'
            ? `Build finished in ${stepCount} steps using ${cores} core(s) - vs. ${baseline} steps for the legacy fixed order.`
            : `Legacy build finished in ${stepCount} steps - one task at a time, every time.`;
        banner.classList.add('visible');
    } else {
        nextBtn.disabled = false;
        banner.classList.remove('visible');
    }
}

function executeStep() {
    if (allDone()) return;
    if (mode === 'parallel') {
        advanceParallel();
    } else {
        advanceSequential();
    }
    refreshAllNodeVisuals();
    updateUI();
}

function reset() {
    resetState();
    refreshAllNodeVisuals();
    updateUI();
}

function applyCoresUI() {
    const coresRow = document.getElementById('cores-row');
    const note = document.getElementById('cores-note');
    if (mode === 'sequential') {
        coresRow.classList.add('disabled');
        note.textContent = 'Legacy mode ignores this - it always runs exactly one task at a time, in fixed order.';
    } else {
        coresRow.classList.remove('disabled');
        note.textContent = 'ZRX starts every task whose dependencies are already complete, up to this many at once.';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    buildNetwork();
    resetState();
    refreshAllNodeVisuals();
    applyCoresUI();
    updateUI();

    document.getElementById('next-btn').addEventListener('click', executeStep);
    document.getElementById('reset-btn').addEventListener('click', reset);

    document.getElementById('mode-select').addEventListener('change', function (e) {
        mode = e.target.value;
        applyCoresUI();
        reset();
    });

    document.getElementById('cores-slider').addEventListener('input', function (e) {
        cores = parseInt(e.target.value, 10);
        document.getElementById('cores-value').textContent = cores;
        reset();
    });
});

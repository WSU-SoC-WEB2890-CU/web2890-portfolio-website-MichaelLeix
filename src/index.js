const wrapper = document.querySelector('.border');
const scrollbarBg = document.getElementById('scrollbar-bg');
const scrollbarTrack = document.getElementById('scrollbar-container');

let isDragging = false;
let startY = 0;
let startScrollTop = 0;
let scrollTarget = wrapper.scrollTop;
let isScrolling = false;

// Update scrollbar fill
function updateScrollbar() {
    const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight;
    const scrollPercent = wrapper.scrollTop / scrollHeight;
    scrollbarBg.style.height = `${scrollPercent * 100}%`;
}

// Clamp scrollTarget inside scrollable range
function clampTarget() {
    const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
    scrollTarget = Math.max(0, Math.min(scrollTarget, maxScroll));
}

// Initialize
updateScrollbar();
wrapper.addEventListener('scroll', () => {
    updateScrollbar();
    if (!isDragging) scrollTarget = wrapper.scrollTop; // sync manual scroll
});
window.addEventListener('resize', () => {
    updateScrollbar();
    clampTarget();
    scrollTarget = wrapper.scrollTop;
});

// Dragging functions
function startDrag(e) {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = wrapper.scrollTop;
    document.body.classList.add('no-select');
    e.preventDefault();
}

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const trackHeight = scrollbarTrack.clientHeight;
    const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight;

    const delta = e.clientY - startY;
    const scrollDelta = (delta / trackHeight) * scrollHeight;

    wrapper.scrollTop = startScrollTop + scrollDelta;
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        document.body.classList.remove('no-select');
        scrollTarget = wrapper.scrollTop; // sync smooth scroll
    }
});

// Click on track
scrollbarTrack.addEventListener('mousedown', (e) => {
    const rect = scrollbarTrack.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight;

    const percent = clickY / rect.height;
    wrapper.scrollTop = scrollHeight * percent;

    startDrag(e); // allow immediate dragging
});

// Smooth arrow key scrolling
function smoothScroll() {
    if (isDragging) return;

    const diff = scrollTarget - wrapper.scrollTop;
    if (Math.abs(diff) < 0.5) {
        wrapper.scrollTop = scrollTarget;
        isScrolling = false;
        return;
    }

    wrapper.scrollTop += diff * 0.25; // easing factor
    requestAnimationFrame(smoothScroll);
}

// Arrow keys and page keys
window.addEventListener('keydown', (e) => {
    if (isDragging) return;

    const step = 60; // arrow step
    const pageStep = wrapper.clientHeight;
    let handled = true;

    switch (e.key) {
        case 'ArrowUp': scrollTarget -= step; break;
        case 'ArrowDown': scrollTarget += step; break;
        case 'PageUp': scrollTarget -= pageStep; break;
        case 'PageDown': scrollTarget += pageStep; break;
        case 'Home': scrollTarget = 0; break;
        case 'End': scrollTarget = wrapper.scrollHeight; break;
        default: handled = false;
    }

    if (!handled) return;

    clampTarget();

    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
    }

    e.preventDefault();
});

function toggleFullscreen() {
    const wrapper = document.querySelector('.border');
    wrapper.classList.toggle('fullscreen');
}


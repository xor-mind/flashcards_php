// should work on both mobile and desktop
const splitter = document.querySelector('.splitter');
let isDragging = false;

// Function to update pane sizes
function updatePaneWidth(e) {
    // Determine if it's a touch event
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    let offset = clientX; // Get the cursor or touch position
    let splitViewWidth = document.querySelector('.split-view').offsetWidth;
    let leftPaneWidth = (offset / splitViewWidth) * 100;
    
    document.querySelector('.left-pane').style.setProperty('--left-pane-width', `${leftPaneWidth}%`);
    document.querySelector('.right-pane').style.setProperty('--right-pane-width',`${100 - leftPaneWidth}%`);
}

// Mouse events
splitter.addEventListener('mousedown', function(e) {
    e.preventDefault(); // Prevent default action (text selection)
    isDragging = true;
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    updatePaneWidth(e);
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Touch events
splitter.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent default action
    isDragging = true;
}, {passive: false}); // Use passive event listeners if possible

document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    updatePaneWidth(e);
}, {passive: false});

document.addEventListener('touchend', function() {
    isDragging = false;
});


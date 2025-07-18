// content.js

// Function to apply specific styles to 'learning' (in-progress) SVG items
function applyLearningItemStyles() {
    const learningItems = document.querySelectorAll('svg g.learning');

    learningItems.forEach(gElement => {
        // We will now rely on style.css for the rect fill/stroke.
        // We only need to ensure the text color is correct here if CSS alone isn't enough.
        const textTspan = gElement.querySelector('text tspan');

        if (textTspan) {
            // Apply black text color as an inline style with !important
            // This is still good to keep as a fallback if CSS for tspan gets overridden.
            textTspan.style.setProperty('fill', '#000000', 'important'); // Black text for contrast on orange
        }
        // Hover effects for learning items will now be handled purely by CSS (:hover pseudo-class)
        // So, we can remove the JavaScript mouseenter/mouseleave listeners here.
    });
}


// Main function to apply dark mode and handle SVG items
function applyRoadmapStyles() {
    // Add a class to the body or a main container to trigger dark mode styles
    document.body.classList.add('roadmap-dark-mode');

    // Initial application of learning item styles
    applyLearningItemStyles();

    // Observe the main roadmap container for changes
    const roadmapContainer = document.querySelector('#resource-svg-wrap');
    if (roadmapContainer) {
        const observer = new MutationObserver(mutations => {
            let needsStyleUpdate = false;
            mutations.forEach(mutation => {
                // If new nodes are added, we might need to re-scan for learning items
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'svg' || node.querySelector('svg') || node.matches('g.learning') || node.querySelector('g.learning'))) {
                            needsStyleUpdate = true;
                        }
                    });
                }
                // If attributes on existing elements change (class specifically, as it might add/remove 'learning')
                else if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'class' && (mutation.target.tagName === 'G' || mutation.target.tagName === 'g')) {
                        if (mutation.target.classList.contains('learning') || mutation.target.classList.contains('done') || mutation.target.classList.contains('skipped')) {
                            needsStyleUpdate = true; // Check for classes that our CSS targets
                        }
                    }
                }
            });

            if (needsStyleUpdate) {
                // Give a small delay for CSS to apply after DOM changes
                setTimeout(applyLearningItemStyles, 50); // Keep a small delay
            }
        });

        // Configure the observer to watch for changes to the DOM within the SVG container
        observer.observe(roadmapContainer, {
            attributes: true, // Watch for attribute changes
            attributeFilter: ['class'], // Only watch 'class' attribute now, as CSS handles styling
            childList: true,  // Watch for direct children being added/removed
            subtree: true     // Watch all descendants of the target
        });
    }
}

// Run the function when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyRoadmapStyles);
} else {
    applyRoadmapStyles(); // In case DOMContentLoaded has already fired
}
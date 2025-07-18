// content.js

// Function to apply dark mode and green completed items
function applyRoadmapStyles() {
    // Add a class to the body or a main container to trigger dark mode styles
    document.body.classList.add('roadmap-dark-mode');

    // Observe the main roadmap container for changes
    const roadmapContainer = document.querySelector('#resource-svg-wrap');
    if (roadmapContainer) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // If a class changes on a `g` element, recheck for 'done'
                    if (mutation.target.classList.contains('done')) {
                        // The CSS should automatically handle this, but this observer ensures
                        // that if the 'done' class is added dynamically, the styles are applied.
                    }
                } else if (mutation.type === 'childList') {
                    // Check newly added nodes for 'done' class
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('done')) {
                            // The CSS should automatically handle this.
                        }
                    });
                }
            });
        });

        observer.observe(roadmapContainer, {
            attributes: true, // Watch for attribute changes (like class)
            childList: true,  // Watch for direct children being added/removed
            subtree: true     // Watch all descendants of the target
        });
    }
}

// Run the function when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyRoadmapStyles);
} else {
    applyRoadmapStyles();
}
// content.js

// Function to apply specific styles to 'learning' (in-progress) SVG items
function applyLearningItemStyles() {
    // Select all 'g' elements that have the class 'learning' directly under 'svg'
    // We target 'rect' and 'text tspan' within these 'g' elements
    const learningItems = document.querySelectorAll('svg g.learning');

    learningItems.forEach(gElement => {
        const rect = gElement.querySelector('rect');
        const text = gElement.querySelector('text tspan');

        if (rect) {
            // Overriding SVG presentation attributes directly
            rect.setAttribute('fill', '#ff8c00'); // A strong orange for in-progress items
            rect.setAttribute('stroke', '#cc7000'); // Darker orange border
            rect.style.setProperty('--hover-color', '#e67d00'); // Set custom property for hover if site uses it

            // Add event listeners for hover effect if not natively handled by the site or CSS
            // The site's SVG often uses :hover directly, but if not, this is a fallback.
            gElement.addEventListener('mouseenter', () => {
                rect.setAttribute('fill', '#e67d00'); // Slightly darker orange on hover
                rect.setAttribute('stroke', '#b36300'); // Even darker orange border on hover
            });
            gElement.addEventListener('mouseleave', () => {
                rect.setAttribute('fill', '#ff8c00'); // Revert to base orange
                rect.setAttribute('stroke', '#cc7000'); // Revert to base stroke
            });
        }
        if (text) {
            text.setAttribute('fill', '#000000'); // Black text for contrast on orange
        }
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
                // Check if new SVG elements (especially 'g.learning') are added or attributes change
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (node.matches('g.learning') || node.querySelector('g.learning'))) {
                            needsStyleUpdate = true;
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target.tagName === 'g' && mutation.target.classList.contains('learning')) {
                    needsStyleUpdate = true; // If a 'g.learning' element's class changes (though we only care about 'learning' presence)
                }
            });

            if (needsStyleUpdate) {
                applyLearningItemStyles(); // Re-apply styles if relevant SVG content changed
            }
        });

        // Configure the observer to watch for changes to the DOM within the SVG container
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
    applyRoadmapStyles(); // In case DOMContentLoaded has already fired
}
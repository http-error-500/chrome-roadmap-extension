// content.js

// Function to apply specific styles to 'learning' (in-progress) SVG items
function applyLearningItemStyles() {
    const learningItems = document.querySelectorAll('svg g.learning');

    learningItems.forEach(gElement => {
        const rect = gElement.querySelector('rect');
        const textTspan = gElement.querySelector('text tspan'); // Target tspan inside text for color

        if (rect) {
            // Apply orange fill and stroke as an inline style with !important
            rect.style.setProperty('fill', '#ff8c00', 'important'); // A strong orange for in-progress items
            rect.style.setProperty('stroke', '#cc7000', 'important'); // Darker orange border

            // Add event listeners for hover effect directly manipulating the inline style
            gElement.addEventListener('mouseenter', () => {
                rect.style.setProperty('fill', '#e67d00', 'important'); // Slightly darker orange on hover
                rect.style.setProperty('stroke', '#b36300', 'important'); // Even darker orange border on hover
            });
            gElement.addEventListener('mouseleave', () => {
                rect.style.setProperty('fill', '#ff8c00', 'important'); // Revert to base orange
                rect.style.setProperty('stroke', '#cc7000', 'important'); // Revert to base stroke
            });
        }
        if (textTspan) {
            // Apply black text color as an inline style with !important
            textTspan.style.setProperty('fill', '#000000', 'important'); // Black text for contrast on orange
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
                // Check if new SVG elements are added, or if classes/attributes change on 'g' or 'rect' elements
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && (node.matches('g.learning') || node.querySelector('g.learning'))) {
                            needsStyleUpdate = true;
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    // If a 'g.learning' element's class changes, or a 'rect's fill/stroke attribute changes
                    if (mutation.target.tagName === 'g' && mutation.target.classList.contains('learning')) {
                        needsStyleUpdate = true;
                    } else if (mutation.target.tagName === 'rect' && mutation.target.closest('g.learning')) {
                        needsStyleUpdate = true; // If fill/stroke attributes are changed on a rect within a learning group
                    }
                }
            });

            if (needsStyleUpdate) {
                // Give a small delay to ensure the page's own JS has settled, then apply our styles
                setTimeout(applyLearningItemStyles, 50); // Small delay to avoid race conditions
            }
        });

        // Configure the observer to watch for changes to the DOM within the SVG container
        observer.observe(roadmapContainer, {
            attributes: true, // Watch for attribute changes (like class, style, fill, stroke)
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
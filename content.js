// content.js

// Function to apply specific styles to 'learning' (in-progress) SVG items
function applyLearningItemStyles() {
    const learningItems = document.querySelectorAll('svg g.learning');

    learningItems.forEach(gElement => {
        const originalRect = gElement.querySelector('rect');
        const textTspan = gElement.querySelector('text tspan');

        if (originalRect && !originalRect.classList.contains('extension-handled-rect')) {
            // Create a new rect element
            const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

            // Copy all attributes from the original rect to the new rect
            Array.from(originalRect.attributes).forEach(attr => {
                newRect.setAttribute(attr.name, attr.value);
            });

            // Add a class to mark this rect as handled by our extension, to prevent re-processing
            newRect.classList.add('extension-handled-rect');

            // Apply our desired orange fill and stroke as an inline style with !important
            newRect.style.setProperty('fill', '#ff8c00', 'important'); // Strong orange for fill
            newRect.style.setProperty('stroke', '#ff8c00', 'important'); // Same strong orange for stroke
            // Ensure hover color CSS variable is also set if the site uses it, though we handle hover in JS
            newRect.style.setProperty('--hover-color', '#e67d00');


            // Replace the original rect with the new one
            originalRect.parentNode.replaceChild(newRect, originalRect);

            // Add event listeners for hover effect directly manipulating the inline style on the new rect
            // Remove previous listeners if they somehow got attached to the gElement and apply to the new rect
            const mouseEnterHandler = () => {
                newRect.style.setProperty('fill', '#e67d00', 'important'); // Slightly darker orange on hover for fill
                newRect.style.setProperty('stroke', '#e67d00', 'important'); // Same slightly darker orange for hover stroke
            };
            const mouseLeaveHandler = () => {
                newRect.style.setProperty('fill', '#ff8c00', 'important'); // Revert to base orange
                newRect.style.setProperty('stroke', '#ff8c00', 'important'); // Revert to base orange stroke
            };

            // It's safer to add listeners directly to the new rect or the parent gElement,
            // but ensure we're not duplicating. Since we replace the rect, this is less of an issue.
            // However, we should still ensure the gElement's listeners are cleaned up if necessary.
            // For now, we'll attach to the gElement and ensure it doesn't add multiple times.
            if (!gElement.dataset.extensionListenersAdded) {
                gElement.addEventListener('mouseenter', mouseEnterHandler);
                gElement.addEventListener('mouseleave', mouseLeaveHandler);
                gElement.dataset.extensionListenersAdded = 'true'; // Mark as having listeners from our extension
            }

            // Also, update the text color if it exists within the same group
            if (textTspan) {
                textTspan.style.setProperty('fill', '#000000', 'important'); // Black text for contrast on orange
            }
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
                // If new nodes are added, we might need to re-scan for learning items
                if (mutation.type === 'childList') {
                    // Check if the added nodes contain SVG elements or g.learning elements
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'svg' || node.querySelector('svg') || node.matches('g.learning') || node.querySelector('g.learning'))) {
                            needsStyleUpdate = true;
                        }
                    });
                }
                // If attributes on existing elements change, particularly styles or classes on g or rect elements
                else if (mutation.type === 'attributes') {
                    // Check if the target is an SVG element and relevant attributes changed
                    if (mutation.target.tagName === 'G' && mutation.target.classList.contains('learning')) {
                        // Only trigger if it's not a rect we've already handled (by checking for our custom class)
                        if (mutation.target.querySelector('rect') && !mutation.target.querySelector('rect').classList.contains('extension-handled-rect')) {
                            needsStyleUpdate = true;
                        }
                    } else if (mutation.target.tagName === 'RECT' && mutation.target.closest('g.learning')) {
                         if (!mutation.target.classList.contains('extension-handled-rect')) {
                            needsStyleUpdate = true;
                        }
                    }
                }
            });

            if (needsStyleUpdate) {
                // Give a slightly longer delay to ensure the page's own JS has settled.
                setTimeout(applyLearningItemStyles, 150); // Increased delay to 150ms
            }
        });

        // Configure the observer to watch for changes to the DOM within the SVG container
        observer.observe(roadmapContainer, {
            attributes: true, // Watch for attribute changes (like class, style, fill, stroke)
            attributeFilter: ['class', 'style', 'fill', 'stroke'], // Be specific about which attributes to watch
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
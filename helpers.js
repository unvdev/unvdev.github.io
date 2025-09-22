    document.addEventListener("DOMContentLoaded", () => {

        function getEffectiveColor(el) {
            if (!el) return null;

            const color = getComputedStyle(el).color;
            // If the color is not black/transparent/default, return it
            if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
                return color;
            }

            // Otherwise, check children recursively
            for (const child of el.children) {
                const childColor = getEffectiveColor(child);
                if (childColor) return childColor;
            }

            return null; // fallback if nothing found
        }

        // Usage
        const accordionLabelText = document.querySelector('.accordion-label > :first-child');
        const color = getEffectiveColor(accordionLabelText);

        // Apply it to CSS variable
        accordionLabelText.style.setProperty('--label-color', color);

        var accordions = document.querySelectorAll(".accordion-label");
        for (var i = 0; i < accordions.length; i++) {
            accordions[i].onclick = function() {
                // The content div is the next sibling of the label
                var content = this.nextElementSibling;

                if (content.style.display === "block") {
                    // If it's visible, hide it
                    content.style.display = "none";
                    this.firstElementChild.classList.remove("accordion-active");
                } else {
                    // If it's hidden, show it
                    content.style.display = "block";
                    this.firstElementChild.classList.add("accordion-active");
                }
            };
        }
    });
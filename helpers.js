    document.addEventListener("DOMContentLoaded", () => {
        
            const accordionLableText = document.querySelector('.accordion-label > :first-child');
            const color = getComputedStyle(accordionLableText).color;
            const label = accordionLableText.parentElement;
            label.style.setProperty('--label-color', color);

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

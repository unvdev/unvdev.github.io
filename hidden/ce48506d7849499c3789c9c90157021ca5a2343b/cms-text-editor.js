// const editorPop = document.querySelector(".text-editor-pop");
// const editorContainer = document.querySelector("#quill-editor");
// let activeTextElement = null;
// let quillEditor = null; 
// let isEditorLoading = false;

// const Inline = Quill.import("blots/inline");

// class CustomFont extends Inline {
//   static blotName = "font";
//   static tagName = "SPAN";
//   static classPrefix = "ql-font-";

//   static whitelist = [
//     "agbalumo", "alumni-sans-pinstripe", "baskervville", "baskervville-sc",
//     "bebas-neue", "borel", "cal-sans", "caveat-brush", "chewy", "cinzel",
//     "comfortaa", "coming-soon", "delius", "dynapuff", "fugaz-one",
//     "funnel-display", "germania-one", "google-sans-code", "host-grotesk",
//     "lato", "lexend", "libre-bodoni", "lobster", "lora", "marck-script",
//     "meow-script", "merriweather-sans", "michroma", "montecarlo",
//     "newsreader", "noto-sans", "pacifico", "pixelify-sans", "playwrite-za",
//     "poller-one", "quintessential", "roboto", "short-stack", "sono", "suse",
//     "twinkle-star", "ultra", "unifrakturmaguntia",
//   ];

//   static sanitize(value) {
//     if (!value) return value;
//     return value.replace(/['"]/g, "").replace(/\s+/g, "-").toLowerCase();
//   }

//   static create(value) {
//     const node = super.create();
//     const normalized = this.sanitize(value);
//     if (this.whitelist && !this.whitelist.includes(normalized)) return node;
//     node.setAttribute("class", this.classPrefix + normalized);
//     return node;
//   }

//   static formats(node) {
//     const className = node.getAttribute("class") || "";
//     const match = className.match(new RegExp(this.classPrefix + "([a-z0-9-]+)"));
//     return match ? match[1] : null;
//   }

//   format(name, value) {
//     if (name === CustomFont.blotName) {
//       if (value) {
//         const normalized = CustomFont.sanitize(value);
//         if (CustomFont.whitelist.includes(normalized)) {
//           this.domNode.setAttribute("class", CustomFont.classPrefix + normalized);
//         }
//       } else {
//         this.domNode.removeAttribute("class");
//       }
//     } else {
//       super.format(name, value);
//     }
//   }
// }

// Quill.register(CustomFont, true);

// // Custom color picker
// function customColorPicker() {
//   const color = prompt("Enter a hex color code (e.g., #ff00ff):");
//   if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
//     quillEditor.format("color", color);
//   } else if (color) {
//     alert("Invalid hex code.");
//   }
// }

// // Update the font picker label to match the current font
// function updateFontPickerLabel(quill) {
//   const pickerLabel = document.querySelector(".ql-font .ql-picker-label");
//   if (!pickerLabel) return;

//   const format = quill.getFormat();
//   let currentFont = format.font || ''; // Empty string if none
//   let displayName = 'Font Family';

//   if (currentFont) {
//     // Convert hyphenated names back to readable words
//     displayName = currentFont
//       .split('-')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');

//     // Wrap multi-word names in quotes for CSS
//     if (currentFont.includes('-') || currentFont.includes(' ')) {
//       pickerLabel.style.fontFamily = `"${displayName}"`;
//     } else {
//       pickerLabel.style.fontFamily = displayName;
//     }
//   } else {
//     pickerLabel.style.fontFamily = 'inherit';
//   }

//   pickerLabel.setAttribute('data-value', currentFont);
//   pickerLabel.textContent = displayName;
// }

// // Initialize Quill
// function initializeQuill() {
//   quillEditor = new Quill(editorContainer, {
//     theme: "snow",
//     modules: {
//       toolbar: {
//         container: [
//           [{ font: CustomFont.whitelist }],
//           [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
//           ["bold", "italic", "underline", "strike"],
//           [{ list: "ordered" }, { list: "bullet" }],
//           [{ color: [] }, "custom-color"],
//           ["link"],
//           ["clean"],
//           ["day-mode", "night-mode"]
//         ],
//         handlers: {
//           "custom-color": customColorPicker,
//           "day-mode": () => editorPop.style.backgroundColor = "whitesmoke",
//           "night-mode": () => editorPop.style.backgroundColor = "#222222",
//         },
//       },
//     },
//   });

//   document.querySelector(".ql-custom-color").innerHTML =
//     '<i class="fa-solid fa-palette"></i>';
//   document.querySelector(".ql-day-mode").innerHTML =
//     '<i class="fa-solid fa-sun"></i>';
//   document.querySelector(".ql-night-mode").innerHTML =
//     '<i class="fa-solid fa-moon"></i>';

//   // Update the font picker whenever selection changes
//   quillEditor.on('editor-change', () => updateFontPickerLabel(quillEditor));
//   updateFontPickerLabel(quillEditor); // Initial label set
// }

// // Open editor
// function openTextEditor(target) {
//   isEditorLoading = true;
//   activeTextElement = target;
//   editorPop.classList.remove("content-hide");
//   editorPop.classList.add("content-show");

//   if (!quillEditor) initializeQuill();

//   requestAnimationFrame(() => {
//     const content = target.innerHTML.trim();
//     quillEditor.setContents([], "silent");
//     quillEditor.clipboard.dangerouslyPasteHTML(0, content, "silent");

//     quillEditor.enable(true);
//     const length = quillEditor.getLength();
//     quillEditor.setSelection(length, 0, "silent");
//     quillEditor.focus();
    
//     isEditorLoading = false;
//   });
// }

// // Utility: remove empty tags
// function cleanHtml(html) {
//   const trimmed = html.trim();
//   const noEmptyTags = trimmed.replace(
//     /<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi,
//     ""
//   );
//   return noEmptyTags.trim();
// }

// // Utility: normalize Quill lists into proper ul/ol
// function normalizeLists(html) {
//   return html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
//     if (/data-list="bullet"/.test(match)) {
//       return `<ul>${inner.replace(/ data-list="bullet"/g, "")}</ul>`;
//     }
//     return `<ol>${inner.replace(/ data-list="ordered"/g, "")}</ol>`;
//   });
// }

// // Close editor
// function closeTextEditor(save = true) {
//   if (!activeTextElement || !quillEditor) return;

//   if (save) {
//     let newContent = quillEditor.root.innerHTML;
//     newContent = normalizeLists(newContent);
//     const cleaned = cleanHtml(newContent);

//     if (cleaned) activeTextElement.innerHTML = cleaned;
//   }

//   editorPop.classList.remove("content-show");
//   editorPop.classList.add("content-hide");
//   activeTextElement = null;
// }

// // Double-click to open editor
// document.addEventListener("dblclick", (e) => {
//   const target = e.target.closest(".text-element");
//   if (target) openTextEditor(target);
// });

// // Click outside to save & close
// document.addEventListener("click", (e) => {
//   const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

//   if (isEditorVisible && !isEditorLoading) {
//     const isClickInsideEditor = e.target.closest(".text-editor-pop");
//     const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

//     if (!isClickInsideEditor && !isClickInsideQuillUI) {
//       closeTextEditor(true);
//     }
//   }
// });
const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
let activeTextElement = null;
let quillEditor = null;
let isEditorLoading = false;
let iconSearchRange = null;

// --- ICON DATA ---
const faIcons = [
    "fa-solid fa-0", "fa-solid fa-1", "fa-solid fa-2", "fa-solid fa-3", "fa-solid fa-4", "fa-solid fa-5", "fa-solid fa-6", "fa-solid fa-7", "fa-solid fa-8", "fa-solid fa-9"
];

// --- QUILL IMPORTS ---
const Inline = Quill.import("blots/inline");
const Embed = Quill.import('blots/embed');
const Delta = Quill.import('delta');

// --- FONT AWESOME ICON BLOT ---
class FontAwesomeBlot extends Embed {
    static create(className) {
        const node = super.create();
        node.setAttribute("class", className);
        node.setAttribute("aria-hidden", "true");
        node.style.display = "inline-block";
        node.style.width = "1em";
        node.style.height = "1em";
        node.style.lineHeight = "1em";
        node.style.fontSize = "inherit";
        return node;
    }

    static value(node) {
        return node.getAttribute("class");
    }
}
FontAwesomeBlot.blotName = "font-awesome";
FontAwesomeBlot.tagName = "I";


// --- CUSTOM FONT BLOT ---
class CustomFont extends Inline {
    static blotName = "font";
    static tagName = "SPAN";
    static classPrefix = "ql-font-";

    static whitelist = [
        "agbalumo", "alumni-sans-pinstripe", "baskervville", "baskervville-sc",
        "bebas-neue", "borel", "cal-sans", "caveat-brush", "chewy", "cinzel",
        "comfortaa", "coming-soon", "delius", "dynapuff", "fugaz-one",
        "funnel-display", "germania-one", "google-sans-code", "host-grotesk",
        "lato", "lexend", "libre-bodoni", "lobster", "lora", "marck-script",
        "meow-script", "merriweather-sans", "michroma", "montecarlo",
        "newsreader", "noto-sans", "pacifico", "pixelify-sans", "playwrite-za",
        "poller-one", "quintessential", "roboto", "short-stack", "sono", "suse",
        "twinkle-star", "ultra", "unifrakturmaguntia",
    ];

    static sanitize(value) {
        if (!value) return value;
        return value.replace(/['"]/g, "").replace(/\s+/g, "-").toLowerCase();
    }

    static create(value) {
        const node = super.create();
        const normalized = this.sanitize(value);
        if (this.whitelist && !this.whitelist.includes(normalized)) return node;
        node.setAttribute("class", this.classPrefix + normalized);
        return node;
    }

    static formats(node) {
        const className = node.getAttribute("class") || "";
        const match = className.match(new RegExp(this.classPrefix + "([a-z0-9-]+)"));
        return match ? match[1] : null;
    }

    format(name, value) {
        if (name === CustomFont.blotName) {
            if (value) {
                const normalized = CustomFont.sanitize(value);
                if (CustomFont.whitelist.includes(normalized)) {
                    this.domNode.setAttribute("class", CustomFont.classPrefix + normalized);
                }
            } else {
                this.domNode.removeAttribute("class");
            }
        } else {
            super.format(name, value);
        }
    }
}
Quill.register(CustomFont, true);


// --- ICON SEARCH TOOLTIP FUNCTIONS ---

function setupIconSearch(quill) {
    const tooltipHTML = `
        <div class="ql-icon-search-tooltip" style="display: none;">
            <input type="text" class="ql-icon-search-input" placeholder="Search for an icon...">
            <div class="ql-icon-search-results"></div>
        </div>
    `;

    // MODIFIED: Removed static positioning from CSS
    const css = `
        .ql-icon-search-tooltip {
            position: absolute;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
            padding: 10px;
            z-index: 1000;
            width: 250px;
            max-height: 300px;
            overflow-y: auto;
        }
        .ql-icon-search-input {
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        .ql-icon-search-results {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
            gap: 10px;
        }
        .ql-icon-search-result {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            padding: 5px;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .ql-icon-search-result:hover {
            background-color: #f0f0f0;
        }
    `;

    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    quill.container.parentNode.insertAdjacentHTML('beforeend', tooltipHTML);

    const tooltip = document.querySelector('.ql-icon-search-tooltip');
    const input = document.querySelector('.ql-icon-search-input');
    const resultsContainer = document.querySelector('.ql-icon-search-results');

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (query.length < 2) return;

        const filteredIcons = faIcons.filter(icon => icon.includes(query)).slice(0, 15);

        filteredIcons.forEach(iconClass => {
            const iconEl = document.createElement('div');
            iconEl.className = 'ql-icon-search-result';
            iconEl.innerHTML = `<i class="${iconClass}"></i>`;
            iconEl.dataset.iconClass = iconClass;
            resultsContainer.appendChild(iconEl);
        });
    });

    resultsContainer.addEventListener('click', (e) => {
        const result = e.target.closest('.ql-icon-search-result');
        if (!result) return;

        // **FIX 1: STOP THE EVENT FROM CLOSING THE EDITOR**
        e.stopPropagation();

        const iconClass = result.dataset.iconClass;

        if (iconSearchRange) {
            quill.insertEmbed(iconSearchRange.index, 'font-awesome', iconClass, Quill.sources.USER);
            quill.setSelection(iconSearchRange.index + 1, Quill.sources.USER);
        }

        tooltip.style.display = 'none'; // Hide after selection
        input.value = '';
        resultsContainer.innerHTML = '';
        quill.focus();
    });
}

// **FIX 2: COMPLETE REWRITE OF THE HANDLER FOR DYNAMIC POSITIONING**
function iconSearchHandler() {
    const tooltip = document.querySelector('.ql-icon-search-tooltip');
    if (!tooltip) return;

    if (tooltip.style.display === 'none') {
        iconSearchRange = quillEditor.getSelection(true);
        if (!iconSearchRange) return;

        const rangeBounds = quillEditor.getBounds(iconSearchRange.index, iconSearchRange.length);
        const editorBounds = quillEditor.container.getBoundingClientRect();

        tooltip.style.display = 'block'; // Show it first to measure its dimensions
        const tooltipHeight = tooltip.offsetHeight;

        // Position horizontally centered on the cursor
        tooltip.style.left = `${rangeBounds.left + (rangeBounds.width / 2) - (tooltip.offsetWidth / 2)}px`;

        // Position vertically, flipping if it overflows
        if (rangeBounds.bottom + tooltipHeight > editorBounds.height) {
            // Flip to appear above the cursor
            tooltip.style.top = `${rangeBounds.top - tooltipHeight - 5}px`;
        } else {
            // Position below the cursor
            tooltip.style.top = `${rangeBounds.bottom + 5}px`;
        }

        document.querySelector('.ql-icon-search-input').focus();
    } else {
        tooltip.style.display = 'none';
        quillEditor.focus();
    }
}


// --- QUILL HELPER FUNCTIONS ---

function customColorPicker() {
    const color = prompt("Enter a hex color code (e.g., #ff00ff):");
    if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        quillEditor.format("color", color);
    } else if (color) {
        alert("Invalid hex code.");
    }
}

function updateFontPickerLabel(quill) {
    const pickerLabel = document.querySelector(".ql-font .ql-picker-label");
    if (!pickerLabel) return;

    const format = quill.getFormat();
    let currentFont = format.font || '';
    let displayName = 'Font Family';

    if (currentFont) {
        displayName = currentFont
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        pickerLabel.style.fontFamily = currentFont.includes('-') || currentFont.includes(' ') ?
            `"${displayName}"` :
            displayName;
    } else {
        pickerLabel.style.fontFamily = 'inherit';
    }

    pickerLabel.setAttribute('data-value', currentFont);
    pickerLabel.textContent = displayName;
}


// --- INITIALIZE QUILL ---
function initializeQuill() {
    Quill.register(FontAwesomeBlot);

    const toolbarOptions = [
        [{ font: CustomFont.whitelist }],
        [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, "custom-color", "icon-search"],
        ["link"],
        ["clean"],
        ["day-mode", "night-mode"]
    ];

    quillEditor = new Quill(editorContainer, {
        theme: "snow",
        bounds: editorPop,
        modules: {
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    "custom-color": customColorPicker,
                    "icon-search": iconSearchHandler,
                    "day-mode": () => editorPop.style.backgroundColor = "whitesmoke",
                    "night-mode": () => editorPop.style.backgroundColor = "#222222",
                },
            },
        },
    });

    quillEditor.clipboard.addMatcher('I', (node, delta) => {
        const classes = node.getAttribute('class') || '';
        const isFaIcon = /fa-(solid|regular|brands)/.test(classes);
        if (isFaIcon) {
            return new Delta().insert({ 'font-awesome': classes });
        }
        return delta;
    });

    document.querySelector(".ql-custom-color").innerHTML = '<i class="fa-solid fa-palette"></i>';
    document.querySelector(".ql-day-mode").innerHTML = '<i class="fa-solid fa-sun"></i>';
    document.querySelector(".ql-night-mode").innerHTML = '<i class="fa-solid fa-moon"></i>';
    document.querySelector(".ql-icon-search").innerHTML = '<i class="fa-solid fa-icons"></i>';

    const toolbar = quillEditor.getModule('toolbar');
    toolbar.container.addEventListener('click', (e) => {
        if (e.target.closest('.ql-font .ql-picker-item')) {
            setTimeout(() => {
                updateFontPickerLabel(quillEditor);
            }, 0);
        }
    });

    updateFontPickerLabel(quillEditor);
    setupIconSearch(quillEditor);
}

// --- EDITOR MANAGEMENT FUNCTIONS ---
function openTextEditor(target) {
    isEditorLoading = true;
    activeTextElement = target;
    editorPop.classList.remove("content-hide");
    editorPop.classList.add("content-show");

    if (!quillEditor) initializeQuill();

    requestAnimationFrame(() => {
        const content = target.innerHTML.trim();
        quillEditor.setContents([], "silent");
        quillEditor.clipboard.dangerouslyPasteHTML(0, content, "silent");
        quillEditor.enable(true);
        const length = quillEditor.getLength();
        quillEditor.setSelection(length, 0, "silent");
        quillEditor.focus();
        isEditorLoading = false;
    });
}

function cleanHtml(html) {
    const trimmed = html.trim();
    return trimmed.replace(/<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi, "").trim();
}

function normalizeLists(html) {
    return html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
        if (/data-list="bullet"/.test(match)) {
            return `<ul>${inner.replace(/ data-list="bullet"/g, "")}</ul>`;
        }
        return `<ol>${inner.replace(/ data-list="ordered"/g, "")}</ol>`;
    });
}

function closeTextEditor(save = true) {
    if (!activeTextElement || !quillEditor) return;

    if (save) {
        let newContent = quillEditor.root.innerHTML;
        newContent = normalizeLists(newContent);
        const cleaned = cleanHtml(newContent);
        if (cleaned) activeTextElement.innerHTML = cleaned;
    }

    editorPop.classList.remove("content-show");
    editorPop.classList.add("content-hide");
    activeTextElement = null;
}

// --- GLOBAL EVENT LISTENERS ---

document.addEventListener("dblclick", (e) => {
    const target = e.target.closest(".text-element");
    if (target) openTextEditor(target);
});

document.addEventListener("click", (e) => {
    const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";
    if (!isEditorVisible || isEditorLoading) return;

    const isClickInsideEditorZone = e.target.closest(
        ".text-editor-pop, .ql-picker, .ql-tooltip, .ql-icon-search-tooltip"
    );

    if (!isClickInsideEditorZone) {
        closeTextEditor(true);
    }
});
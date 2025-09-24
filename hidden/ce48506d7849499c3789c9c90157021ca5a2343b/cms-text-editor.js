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

// --- QUILL IMPORTS ---
const Inline = Quill.import("blots/inline");
const Embed = Quill.import('blots/embed'); // For the icon blot
const Delta = Quill.import('delta'); // For the clipboard matcher

// --- FONT AWESOME ICON BLOT ---
// This class teaches Quill to treat Font Awesome icons as special "embeds"
class FontAwesomeBlot extends Embed {
  static create(className) {
    const node = super.create();
    node.setAttribute("class", className);
    node.setAttribute("aria-hidden", "true"); // Good for accessibility
    return node;
  }

  static value(node) {
    return node.getAttribute("class"); // Store the classes
  }
}
FontAwesomeBlot.blotName = "font-awesome";
FontAwesomeBlot.tagName = "I";
// We register this blot inside initializeQuill, just before creating the editor.


// --- CUSTOM FONT BLOT (Your existing code) ---
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


// --- QUILL HELPER FUNCTIONS (Your existing code) ---

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

    if (currentFont.includes('-') || currentFont.includes(' ')) {
      pickerLabel.style.fontFamily = `"${displayName}"`;
    } else {
      pickerLabel.style.fontFamily = displayName;
    }
  } else {
    pickerLabel.style.fontFamily = 'inherit';
  }

  pickerLabel.setAttribute('data-value', currentFont);
  pickerLabel.textContent = displayName;
}


// --- INITIALIZE QUILL (Modified) ---
function initializeQuill() {
  // *** ADDITION 1: Register the FontAwesomeBlot before creating the editor ***
  Quill.register(FontAwesomeBlot);

  quillEditor = new Quill(editorContainer, {
    theme: "snow",
    modules: {
      toolbar: {
        container: [
          [{ font: CustomFont.whitelist }],
          [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, "custom-color"],
          ["link"],
          ["clean"],
          ["day-mode", "night-mode"]
        ],
        handlers: {
          "custom-color": customColorPicker,
          "day-mode": () => editorPop.style.backgroundColor = "whitesmoke",
          "night-mode": () => editorPop.style.backgroundColor = "#222222",
        },
      },
    },
  });

  // *** ADDITION 2: Add the clipboard matcher to handle pasted <i> tags ***
  quillEditor.clipboard.addMatcher('I', (node, delta) => {
    const classes = node.getAttribute('class') || '';
    const isFaIcon = /fa-(solid|regular|brands)/.test(classes);

    if (isFaIcon) {
      // If it's a Font Awesome icon, insert it as our custom blot.
      return new Delta().insert({ 'font-awesome': classes });
    } else {
      // Otherwise, let Quill handle it as default (italics).
      return delta;
    }
  });

  // Add custom toolbar icons
  document.querySelector(".ql-custom-color").innerHTML =
    '<i class="fa-solid fa-palette"></i>';
  document.querySelector(".ql-day-mode").innerHTML =
    '<i class="fa-solid fa-sun"></i>';
  document.querySelector(".ql-night-mode").innerHTML =
    '<i class="fa-solid fa-moon"></i>';

  // Update the font picker whenever selection changes
  quillEditor.on('editor-change', () => updateFontPickerLabel(quillEditor));
  updateFontPickerLabel(quillEditor); // Initial label set
}

// --- EDITOR MANAGEMENT FUNCTIONS (Your existing code) ---

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
  const noEmptyTags = trimmed.replace(
    /<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi,
    ""
  );
  return noEmptyTags.trim();
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

// --- EVENT LISTENERS (Your existing code) ---

document.addEventListener("click", (e) => {
  const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

  if (isEditorVisible && !isEditorLoading) {
    const isClickInsideEditor = e.target.closest(".text-editor-pop");

    // Include ALL Quill UI: toolbar, pickers, and tooltip
    const isClickInsideQuillUI = e.target.closest(
      ".ql-toolbar, .ql-picker, .ql-tooltip"
    );

    if (!isClickInsideEditor && !isClickInsideQuillUI) {
      closeTextEditor(true);
    }
  }
});
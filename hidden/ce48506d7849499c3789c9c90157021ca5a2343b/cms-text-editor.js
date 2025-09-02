const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
let activeTextElement = null;
let quillEditor = null; // 1. Don't initialize Quill yet, just declare the variable.

// A new function that will prompt for a color
function customColorPicker() {
  // A simple prompt to ask the user for a hex code
  const color = prompt("Enter a hex color code (e.g., #ff00ff):");

  // A basic check to see if it's a valid-looking hex code
  if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    // 'this.quill' refers to the editor instance
    this.quill.format('color', color);
  } else if (color) {
    alert("Invalid hex code.");
  }
}

// A handler function that prompts the user for a color
function customColorPicker() {
    const color = prompt("Enter a hex color code (e.g., #ff00ff):");
    if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        this.quill.format('color', color);
    } else if (color) {
        alert("Invalid hex code.");
    }
}

// Handler for the "Day Mode" button ☀️
function setDayMode() {
    // editorPop is the variable for your '.text-editor-pop' div
    editorPop.style.backgroundColor = 'whitesmoke';
}

// Handler for the "Night Mode" button 🌙
function setNightMode() {
    editorPop.style.backgroundColor = '#222222'; // Dark gray background
}

// Your updated and final initialization function
function initializeQuill() {
    quillEditor = new Quill(editorContainer, {
        theme: "snow",
        modules: {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ color: [] }, 'custom-color'],
                    ["link"],
                    // ✅ Added a new group for the day/night buttons
                    ['day-mode', 'night-mode'],
                    ["clean"]
                ],
                handlers: {
                    'custom-color': customColorPicker, // Your existing handler
                    // ✅ Linked the new buttons to their handler functions
                    'day-mode': setDayMode,
                    'night-mode': setNightMode
                }
            }
        }
    });

    // Style all your custom buttons with their icons
    document.querySelector('.ql-custom-color').innerHTML = '<i class="fa-solid fa-palette"></i>';
    document.querySelector('.ql-day-mode').innerHTML = '<i class="fa-solid fa-sun"></i>';
    document.querySelector('.ql-night-mode').innerHTML = '<i class="fa-solid fa-moon"></i>';
}

// Open editor
function openTextEditor(target) {
  activeTextElement = target;

  editorPop.classList.remove("content-hide");
  editorPop.classList.add("content-show");

  // 2. If this is the first time, initialize Quill now that the container is visible.
  if (!quillEditor) {
    initializeQuill();
  }

  requestAnimationFrame(() => {
    const content = target.innerHTML.trim();
    quillEditor.setContents([], 'silent');
    quillEditor.clipboard.dangerouslyPasteHTML(0, content, 'silent');
    
    // Explicitly enable the editor and set the cursor
    quillEditor.enable(true);
    const length = quillEditor.getLength();
    quillEditor.setSelection(length, 0, 'silent');
    quillEditor.focus();
  });
}

// Utility: remove all empty tags
function cleanHtml(html) {
  const trimmed = html.trim();
  const noEmptyTags = trimmed.replace(/<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi, "");
  return noEmptyTags.trim();
}

// Close editor
function closeTextEditor(save = true) {
  if (!activeTextElement || !quillEditor) return;

  if (save) {
    const newContent = quillEditor.root.innerHTML;
    const cleaned = cleanHtml(newContent);

    if (cleaned) {
      activeTextElement.innerHTML = cleaned;
    }
  }

  editorPop.classList.remove("content-show");
  editorPop.classList.add("content-hide");
  activeTextElement = null;
}

// Double-click feature to open editor
document.addEventListener("dblclick", e => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

// Click outside to save & close editor
document.addEventListener("click", e => {
  const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

  if (isEditorVisible) {
    const isClickInsideEditor = e.target.closest(".text-editor-pop");
    const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

    if (!isClickInsideEditor && !isClickInsideQuillUI) {
      closeTextEditor(true);
    }
  }
});
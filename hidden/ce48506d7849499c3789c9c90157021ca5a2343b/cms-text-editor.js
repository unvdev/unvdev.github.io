const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor"); // Quill manages inside
let activeTextElement = null;

// Initialize Quill ONCE
const quillEditor = new Quill(editorContainer, {
  theme: "snow",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }],
      ["link"],
      ["clean"]
    ]
  }
});

// Open editor
function openTextEditor(target) {
  activeTextElement = target;

  // Show the popup
  editorPop.classList.remove("content-hide");
  editorPop.classList.add("content-show");

  // Wait until the browser has painted the popup
  requestAnimationFrame(() => {
    const content = target.innerHTML.trim();

    // 1. ✅ Convert the raw HTML into Quill's native Delta format.
    const delta = quillEditor.clipboard.convert(content);
    
    // 2. ✅ Set the editor's contents directly using the Delta.
    // This is the most reliable method and ensures the editor is ready to be used.
    quillEditor.setContents(delta, 'silent');
    
    // 3. Focus the editor.
    quillEditor.focus();
  });
}

// Utility: remove all empty tags, including <p><br></p>
function cleanHtml(html) {
  const trimmed = html.trim();
  const noEmptyTags = trimmed.replace(/<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi, "");
  return noEmptyTags.trim();
}

// Close editor
function closeTextEditor(save = true) {
  if (!activeTextElement) return;

  if (save) {
    const newContent = quillEditor.root.innerHTML;
    const cleaned = cleanHtml(newContent);

    if (cleaned) {
      activeTextElement.innerHTML = cleaned;
    }
  }

  // Hide popup and reset (assuming you use a class like .content-hide)
  editorPop.classList.remove("content-show");
  editorPop.classList.add("content-hide");
  activeTextElement = null;
}

// ✅ Double-click feature to open editor
document.addEventListener("dblclick", e => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

// ✅ Click outside to save & close editor
document.addEventListener("click", e => {
  // This reliably checks the visibility set by your .content-show/.content-hide classes
  const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

  if (isEditorVisible) {
    const isClickInsideEditor = e.target.closest(".text-editor-pop");
    const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

    // If the click was NOT inside your popup or any of Quill's floating menus...
    if (!isClickInsideEditor && !isClickInsideQuillUI) {
      // ...then close the editor.
      closeTextEditor(true);
    }
  }
});
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
  editorPop.style.display = "block";

  // Wait until the browser has painted the popup
  requestAnimationFrame(() => {
    const content = target.innerHTML.trim();
    quillEditor.clipboard.dangerouslyPasteHTML(content || "");
    quillEditor.focus();
  });
}

// Utility: remove all empty tags, including <p><br></p>
function cleanHtml(html) {
  const trimmed = html.trim();

  // Remove any tag that is empty or contains only whitespace or <br>
  const noEmptyTags = trimmed.replace(/<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi, "");

  return noEmptyTags.trim();
}

// Close editor
function closeTextEditor(save = true) {
  if (!activeTextElement) return;

  if (save) {
    const newContent = quillEditor.root.innerHTML;
    const cleaned = cleanHtml(newContent);

    // Only save if there's real content
    if (cleaned) {
      activeTextElement.innerHTML = cleaned;
    }
    // If cleaned is empty, keep original content
  }

  // Hide popup and reset
  editorPop.style.display = "none";
  activeTextElement = null;
}

// ✅ Double-click feature to open editor
document.addEventListener("dblclick", e => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

// ✅ Click outside to save & close editor
document.addEventListener("click", e => {
  // A more reliable way to check if the popup is actually visible
  const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

  if (isEditorVisible) {
    const isClickInsideEditor = e.target.closest(".text-editor-pop");
    const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

    if (!isClickInsideEditor && !isClickInsideQuillUI) {
      closeTextEditor(true);
    }
  }
});

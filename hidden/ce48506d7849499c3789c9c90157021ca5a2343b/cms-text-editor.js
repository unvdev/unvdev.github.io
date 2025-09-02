const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
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

  editorPop.classList.remove("content-hide");
  editorPop.classList.add("content-show");

  requestAnimationFrame(() => {
    const content = target.innerHTML.trim();

    // 1. Clear the editor to start fresh.
    quillEditor.setContents([], 'silent');
    
    // 2. Paste the HTML at the beginning of the editor.
    quillEditor.clipboard.dangerouslyPasteHTML(0, content, 'silent');
    
    // 3. CRITICAL STEP: Manually place the cursor at the end of the new content.
    const length = quillEditor.getLength();
    quillEditor.setSelection(length, 0, 'silent');
    
    // 4. Now, focus the editor. It has a cursor and is ready for input.
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
  if (!activeTextElement) return;

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
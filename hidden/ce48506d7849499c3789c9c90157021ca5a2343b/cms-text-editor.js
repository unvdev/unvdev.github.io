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

  // Bring popup on top
  editorPop.style.zIndex = "999999999";
  editorPop.style.opacity = "1.0";

  // Wait until the popup is painted so Quill can attach properly
  requestAnimationFrame(() => {
    const content = target.innerHTML.trim();
    quillEditor.clipboard.dangerouslyPasteHTML(content || "");
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

    // Only save if there's real content; otherwise revert
    if (cleaned) {
      activeTextElement.innerHTML = cleaned;
    }
    // else: keep original content
  }

  // Hide popup and reset
  editorPop.style.display = "none";
  editorPop.style.zIndex = "-1";
  activeTextElement = null;
}

// ✅ Double-click feature
loadedPage.addEventListener("dblclick", e => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

// ✅ Click outside to save & close
document.addEventListener("click", e => {
  if (editorPop.style.display === "block") {
    if (!e.target.closest(".text-editor-pop") && !e.target.closest(".ql-toolbar")) {
      closeTextEditor(true);
    }
  }
});
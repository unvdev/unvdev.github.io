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

  // Show popup first
  editorPop.style.display = "block";

  // Load content safely into Quill
  const content = target.innerHTML.trim();
  quillEditor.clipboard.dangerouslyPasteHTML(content || "");

  // Tiny delay to focus, ensures toolbar appears
  setTimeout(() => quillEditor.focus(), 5);
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
    let newContent = quillEditor.root.innerHTML;
    const cleaned = cleanHtml(newContent);

    // Only save if there is actual content, else revert
    if (cleaned) {
      activeTextElement.innerHTML = cleaned;
    }
    // If cleaned is empty, do nothing — keeps original content
  }

  editorPop.style.display = "none";
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
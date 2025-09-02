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

  // 1️⃣ Show popup first
  editorPop.style.display = "block";

  // 2️⃣ Load content safely into Quill
  const content = target.innerHTML.trim();
  quillEditor.clipboard.dangerouslyPasteHTML(content || "");

  // 3️⃣ Tiny delay to focus, ensures toolbar appears
  setTimeout(() => quillEditor.focus(), 5);
}

// Utility: clean up extra empty <p> tags
function cleanHtml(html) {
  const trimmed = html.trim();

  // If fully empty or only empty <p> blocks, return empty string
  if (!trimmed || /^(\s*<p>(\s|<br>)*<\/p>\s*)+$/.test(trimmed)) {
    return "";
  }

  // Collapse multiple empty <p> into a single <p><br></p>
  return trimmed.replace(/(<p>(\s|<br>)*<\/p>)+/g, "<p><br></p>");
}

// Close editor
function closeTextEditor(save = true) {
  if (!activeTextElement) return;

  if (save) {
    let newContent = quillEditor.root.innerHTML;
    newContent = cleanHtml(newContent);
    activeTextElement.innerHTML = newContent;
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
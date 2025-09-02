const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor"); // stays empty, Quill manages inside
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
  editorPop.style.display = "block";

  // Load target content into Quill
  quillEditor.root.innerHTML = target.innerHTML.trim() || "<p><br></p>";
  quillEditor.focus();
}

// Utility: clean up extra empty <p> tags
function cleanHtml(html) {
  // Remove multiple empty <p> blocks, keep only one
  html = html.replace(/(<p>(\s|<br>)*<\/p>)+/g, "<p><br></p>");

  // Trim spaces
  return html.trim();
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
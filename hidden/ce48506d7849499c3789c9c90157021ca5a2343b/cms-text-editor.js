const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
let activeTextElement = null;

// ✅ Create Quill once, on page load
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
editorPop.style.display = "none"; // start hidden

function openTextEditor(target) {
    activeTextElement = target;

    // Load the target’s HTML into Quill
    quillEditor.root.innerHTML = target.innerHTML;

    editorPop.style.display = "block";
    quillEditor.focus();
}

function closeTextEditor(save = true) {
    if (!activeTextElement) return;

    if (save) {
        // Save back to target element
        activeTextElement.innerHTML = quillEditor.root.innerHTML;
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
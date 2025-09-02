const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor"); // inner div for Quill
let activeTextElement = null;
let quillEditor = null;

function openTextEditor(target) {
    activeTextElement = target;

    editorPop.style.display = "block";

    // Put the target’s HTML inside the Quill container
    editorContainer.innerHTML = target.innerHTML;

    // Initialize Quill
    quillEditor = new Quill(editorContainer, {
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

    quillEditor.focus();
}

function closeTextEditor(save = true) {
    if (!activeTextElement || !quillEditor) return;

    if (save) {
        const newContent = quillEditor.root.innerHTML;
        activeTextElement.innerHTML = newContent;
    }

    // Cleanup
    editorContainer.innerHTML = "";
    editorPop.style.display = "none";
    activeTextElement = null;
    quillEditor = null;
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
const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector(".text-editor");
let activeTextElement = null;
let quillEditor = null;

function openTextEditor(target) {
    activeTextElement = target;
    editorContainer.innerHTML = target.innerHTML;
    editorPop.style.display = "block";

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

    editorContainer.innerHTML = "";
    editorPop.style.display = "none";
    activeTextElement = null;
    quillEditor = null;
}

loadedPage.addEventListener("dblclick", e => {
    const target = e.target.closest(".text-element");
    if (target) openTextEditor(target);
});

document.addEventListener("click", e => {
    if (editorPop.style.display === "block") {
        if (!e.target.closest(".text-editor-pop") && !e.target.closest(".ql-toolbar")) {
            closeTextEditor(true);
        }
    }
});

document.addEventListener("keydown", e => {
    if (editorPop.style.display === "block" && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        closeTextEditor(true);
    }
});
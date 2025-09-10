// const cms = document.querySelector(".cms-menu");
// const styles = document.querySelector(".style-editor-pop");
// const deleteButton = document.querySelector(".delete-element");
// const loadedPage = document.querySelector("#loaded-page");

// let currentlySelected = null;
// let clipboard = {
//     html: null,
//     sourceElement: null
// };

// function deselectAll() {
//     if (currentlySelected) {
//         currentlySelected.classList.remove('selected');
//         currentlySelected = null;
//         cms.classList.add("content-hide");
//         styles.classList.add("content-hide");
//     }
// }

// function selectBuildingBlock(blockToSelect, originalTarget) {
//     if (originalTarget.closest('.placeholder-block')) {
//         deselectAll();
//         currentlySelected = originalTarget;
//         invokeCMSMenu();
//         return;
//     }
//     deselectAll();
//     currentlySelected = blockToSelect;
//     currentlySelected.classList.add('selected');
// }

// function deleteElement() {
//     if (currentlySelected) {
//         if (confirm('Are you sure you want to delete this element?')) {
//             currentlySelected.remove();
//             currentlySelected = null;
//         }
//     }
// }

// function copyElement() {
//     if (currentlySelected) {
//         currentlySelected.classList.remove('selected');
//         clipboard.html = currentlySelected.outerHTML;
//         currentlySelected.classList.add('selected');
//         clipboard.sourceElement = currentlySelected;
//     }
// }

// function pasteElement() {
//     if (!currentlySelected || !clipboard.html) {
//         deselectAll();
//         return;
//     }

//     try {
//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = clipboard.html;
//         const copiedElement = tempDiv.firstElementChild;

//         if (copiedElement.classList.contains('building-column')) {
//             if (!currentlySelected.classList.contains('building-column')) {
//                 alert('A column can only be pasted to overwrite another column. Please select a column.');
//                 return;
//             }
//             if (currentlySelected === clipboard.sourceElement) {
//                 alert('Cannot overwrite the same column. Please select a different column to replace.');
//                 return;
//             }

//             currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
//             const newElement = currentlySelected.nextElementSibling;
//             currentlySelected.remove();
//             selectBuildingBlock(newElement, newElement);
//             return;
//         }

//         if (copiedElement.classList.contains('building-container')) {
//             if (currentlySelected.classList.contains('building-container')) {
//                 currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
//                 return;
//             } else {
//                 alert('A building container can only be pasted after another container.');
//                 return;
//             }
//         }

//         if (currentlySelected.classList.contains('building-column')) {
//             const placeholder = currentlySelected.querySelector('.placeholder-block');
//             if (placeholder) {
//                 placeholder.insertAdjacentHTML('beforebegin', clipboard.html);
//                 return;
//             } else {
//                 currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);
//                 return;
//             }
//         } else {
//             const parentColumn = currentlySelected.closest('.building-column');
//             if (parentColumn) {
//                 if (currentlySelected.classList.contains('placeholder-block')) {
//                     alert('Cannot paste an element here. Please select the column to paste into, not the placeholder.');
//                     return;
//                 }
//                 currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
//                 return;
//             } else {
//                 alert('Content blocks can only be pasted inside a "building-column".');
//                 return;
//             }
//         }
//     } finally {
//         deselectAll();
//     }
// }

// document.addEventListener("click", (e) => {
//     const target = e.target;
//     const uiElements = '.ql-container, .ql-toolbar, .ql-picker, .ql-tooltip, .ql-action, .text-editor-pop, .text-editor, .cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-pop, .style-editor-container, .style-editor-item, .style-editor-title, .style-editor-input';
//     if (target.closest(uiElements)) return;

//     const targetBlock = target.closest('.building-block');
//     if (targetBlock) {
//         selectBuildingBlock(targetBlock, target);
//     } else {
//         deselectAll();
//     }
// });

// document.addEventListener("keydown", e => {
//     // Ignore keystrokes inside editors
//     if (e.target.closest('.text-editor-pop') || e.target.closest('.style-editor-pop')) {
//         return;
//     }

//     const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)

//     // Copy: Ctrl+C or Cmd+C
//     if (isCtrl && e.key.toLowerCase() === 'c') {
//         e.preventDefault();
//         copyElement();
//         return; // Stop further execution
//     }

//     // Paste: Ctrl+V or Cmd+V
//     if (isCtrl && e.key.toLowerCase() === 'v') {
//         e.preventDefault();
//         pasteElement();
//         return; // Stop further execution
//     }

//     if (currentlySelected) {
//         e.preventDefault();
//         if (e.key === 'ArrowUp') {
//             const prev = currentlySelected.previousElementSibling;
//             if (prev) currentlySelected.parentElement.insertBefore(currentlySelected, prev);
//         } else if (e.key === 'ArrowDown') {
//             const next = currentlySelected.nextElementSibling;
//             if (next) currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
//         }
//     }
// });

// deleteButton.addEventListener("click", deleteElement);
const cms = document.querySelector(".cms-menu");
const styles = document.querySelector(".style-editor-pop");
const deleteButton = document.querySelector(".delete-element");
const loadedPage = document.querySelector("#loaded-page");

let selectedElements = new Set();
let clipboard = {
    html: [],
    sourceElements: []
};

function deselectAll() {
    selectedElements.forEach(el => el.classList.remove("selected"));
    selectedElements.clear();
    cms.classList.add("content-hide");
    styles.classList.add("content-hide");
}

function selectBuildingBlock(blockToSelect, originalTarget, multi = false) {
    const parentColumn = blockToSelect.closest(".building-column");

    // Only allow multi-select inside a column
    if (!parentColumn) {
        deselectAll();
        selectedElements.add(blockToSelect);
        blockToSelect.classList.add("selected");
        return;
    }

    if (!multi) {
        // Normal click resets selection
        deselectAll();
        selectedElements.add(blockToSelect);
        blockToSelect.classList.add("selected");
    } else {
        // Multi-select mode (Shift/Ctrl/Cmd)
        const sameColumn = [...selectedElements].every(el => el.closest(".building-column") === parentColumn);
        if (!sameColumn) {
            deselectAll(); // reset if column doesn’t match
        }
        if (selectedElements.has(blockToSelect)) {
            // Toggle off
            blockToSelect.classList.remove("selected");
            selectedElements.delete(blockToSelect);
        } else {
            blockToSelect.classList.add("selected");
            selectedElements.add(blockToSelect);
        }
    }
}

function deleteElement() {
    if (selectedElements.size > 0) {
        if (confirm("Are you sure you want to delete selected elements?")) {
            selectedElements.forEach(el => el.remove());
            deselectAll();
        }
    }
}

function copyElement() {
    if (selectedElements.size > 0) {
        clipboard.html = [...selectedElements].map(el => el.outerHTML);
        clipboard.sourceElements = [...selectedElements];
    }
}

function pasteElement() {
    if (selectedElements.size === 0 || clipboard.html.length === 0) {
        deselectAll();
        return;
    }

    try {
        // Paste after the last selected element
        const lastSelected = [...selectedElements].slice(-1)[0];
        clipboard.html.forEach(html => {
            lastSelected.insertAdjacentHTML("afterend", html);
        });
    } finally {
        deselectAll();
    }
}

document.addEventListener("click", (e) => {
    const target = e.target;
    const uiElements = ".ql-container, .ql-toolbar, .ql-picker, .ql-tooltip, .ql-action, .text-editor-pop, .text-editor, .cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-pop, .style-editor-container, .style-editor-item, .style-editor-title, .style-editor-input";
    if (target.closest(uiElements)) return;

    const targetBlock = target.closest(".building-block");
    if (targetBlock) {
        const multi = e.ctrlKey || e.metaKey || e.shiftKey;
        selectBuildingBlock(targetBlock, target, multi);
    } else {
        deselectAll();
    }
});

document.addEventListener("keydown", e => {
    // Ignore keystrokes inside editors
    if (e.target.closest(".text-editor-pop") || e.target.closest(".style-editor-pop")) {
        return;
    }

    const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)

    // Copy: Ctrl+C or Cmd+C
    if (isCtrl && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyElement();
        return;
    }

    // Paste: Ctrl+V or Cmd+V
    if (isCtrl && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteElement();
        return;
    }

    if (selectedElements.size > 0) {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();

            const elements = [...selectedElements];
            const parent = elements[0].parentElement;

            if (e.key === "ArrowUp") {
                const first = elements[0];
                const prev = first.previousElementSibling;
                if (prev && !selectedElements.has(prev)) {
                    elements.forEach(el => parent.insertBefore(el, prev));
                }
            } else if (e.key === "ArrowDown") {
                const last = elements[elements.length - 1];
                const next = last.nextElementSibling;
                if (next && !selectedElements.has(next)) {
                    elements.reverse().forEach(el => parent.insertBefore(el, next.nextElementSibling));
                }
            }
        }
    }
});

deleteButton.addEventListener("click", deleteElement);

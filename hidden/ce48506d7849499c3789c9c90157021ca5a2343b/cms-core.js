const cms = document.querySelector(".cms-menu");
const styles = document.querySelector(".style-editor-sidebar");
const deleteButton = document.querySelector(".delete-element");
const loadedPage = document.querySelector("#loaded-page");

let currentlySelected = null;
let clipboard = {
    html: null,
    sourceElement: null
};

function deselectAll() {
    if (currentlySelected) {
        currentlySelected.classList.remove('selected');
        currentlySelected = null;
        cms.classList.add("content-hide");
        styles.classList.add("content-hide");
    }
}

function selectBuildingBlock(blockToSelect, originalTarget) {
    if (originalTarget.closest('.placeholder-block')) {
        deselectAll();
        currentlySelected = originalTarget;
        invokeCMSMenu();
        return;
    }
    deselectAll();
    currentlySelected = blockToSelect;
    currentlySelected.classList.add('selected');
}

function deleteElement() {
    if (currentlySelected) {
        if (confirm('Are you sure you want to delete this element?')) {
            currentlySelected.remove();
            currentlySelected = null;
        }
    }
}

function copyElement() {
    if (currentlySelected) {
        currentlySelected.classList.remove('selected');
        clipboard.html = currentlySelected.outerHTML;
        currentlySelected.classList.add('selected');
        clipboard.sourceElement = currentlySelected;
    }
}

function pasteElement() {
    if (!currentlySelected || !clipboard.html) {
        deselectAll();
        return;
    }

    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = clipboard.html;
        const copiedElement = tempDiv.firstElementChild;

        if (copiedElement.classList.contains('building-column')) {
            if (!currentlySelected.classList.contains('building-column')) {
                alert('A column can only be pasted to overwrite another column. Please select a column.');
                return;
            }
            if (currentlySelected === clipboard.sourceElement) {
                alert('Cannot overwrite the same column. Please select a different column to replace.');
                return;
            }

            currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
            const newElement = currentlySelected.nextElementSibling;
            currentlySelected.remove();
            selectBuildingBlock(newElement, newElement);
            return;
        }

        if (copiedElement.classList.contains('building-container')) {
            if (currentlySelected.classList.contains('building-container')) {
                currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
                return;
            } else {
                alert('A building container can only be pasted after another container.');
                return;
            }
        }

        if (currentlySelected.classList.contains('building-column')) {
            const placeholder = currentlySelected.querySelector('.placeholder-block');
            if (placeholder) {
                placeholder.insertAdjacentHTML('beforebegin', clipboard.html);
                return;
            } else {
                currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);
                return;
            }
        } else {
            const parentColumn = currentlySelected.closest('.building-column');
            if (parentColumn) {
                if (currentlySelected.classList.contains('placeholder-block')) {
                    alert('Cannot paste an element here. Please select the column to paste into, not the placeholder.');
                    return;
                }
                currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
                return;
            } else {
                alert('Content blocks can only be pasted inside a "building-column".');
                return;
            }
        }
    } finally {
        deselectAll();
    }
}

// This single listener replaces the separate click listeners in both your
// cms-core.js and quill-editor-with-icons.js files.
document.addEventListener("click", (e) => {
    const target = e.target;
    
    // Determine the application's current state: Are we editing text?
    const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

    // --- MODE 1: Text Editor is ACTIVE ---
    if (isEditorVisible) {
        // If the editor is open, this listener's ONLY job is to close it
        // when a click occurs outside of its UI.

        // ** THE FIX **
        // We define the entire "editor zone" which includes the main pop-up
        // and ANY element with a "ql-" class (toolbars, tooltips, pickers).
        const isClickInsideEditorZone = target.closest('.text-editor-pop, [class*="ql-"]');

        if (!isClickInsideEditorZone) {
            // The click was truly outside the editor and all its UI. Close it.
            // Assuming closeTextEditor is a global function
            closeTextEditor(true);
        }

        // IMPORTANT: We stop execution here. No CMS selection logic should
        // run while the text editor is active.
        return;
    }

    // --- MODE 2: Text Editor is INACTIVE (Layout Mode) ---
    // If the editor is closed, the listener handles CMS block selection.

    // First, ignore clicks on the CMS menu itself.
    const isClickInsideCmsUI = target.closest('.cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-sidebar');
    if (isClickInsideCmsUI) {
        return;
    }

    // Now, handle the selection of building blocks.
    const targetBlock = target.closest('.building-block');
    if (targetBlock) {
        // Only select a new block if it's not the one that's already selected.
        if (targetBlock !== currentlySelected) {
            // Assuming selectBuildingBlock is a global function
            selectBuildingBlock(targetBlock, target);
        }
    } else {
        // If the click was not on any building block, deselect everything.
        // Assuming deselectAll is a global function
        deselectAll();
    }
});

document.addEventListener("dblclick", (e) => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

document.addEventListener("keydown", e => {
    // Ignore keystrokes inside editors
    if (e.target.closest('.text-editor-pop') || e.target.closest('.style-editor-sidebar')) {
        return;
    }

    const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)

    // Copy: Ctrl+C or Cmd+C
    if (isCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyElement();
        return; // Stop further execution
    }

    // Paste: Ctrl+V or Cmd+V
    if (isCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteElement();
        return; // Stop further execution
    }

    if (currentlySelected) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            const prev = currentlySelected.previousElementSibling;
            if (prev) currentlySelected.parentElement.insertBefore(currentlySelected, prev);
        } else if (e.key === 'ArrowDown') {
            const next = currentlySelected.nextElementSibling;
            if (next) currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
        }
    }
});

deleteButton.addEventListener("click", deleteElement);

// const cms = document.querySelector(".cms-menu");

// const styles = document.querySelector(".style-editor-sidebar");

// const deleteButton = document.querySelector(".delete-element");

// const loadedPage = document.querySelector("#loaded-page");



// let currentlySelected = null;

// let clipboard = {

// html: null,

// sourceElement: null

// };



// function deselectAll() {

// if (currentlySelected) {

// currentlySelected.classList.remove('selected');

// currentlySelected = null;

// cms.classList.add("content-hide");

// styles.classList.add("content-hide");

// }

// }



// function selectBuildingBlock(blockToSelect, originalTarget) {

// if (originalTarget.closest('.placeholder-block')) {

// deselectAll();

// currentlySelected = originalTarget;

// invokeCMSMenu();

// return;

// }

// deselectAll();

// currentlySelected = blockToSelect;

// currentlySelected.classList.add('selected');

// }



// function deleteElement() {

// if (currentlySelected) {

// if (confirm('Are you sure you want to delete this element?')) {

// currentlySelected.remove();

// currentlySelected = null;

// }

// }

// }



// function copyElement() {

// if (currentlySelected) {

// currentlySelected.classList.remove('selected');

// clipboard.html = currentlySelected.outerHTML;

// currentlySelected.classList.add('selected');

// clipboard.sourceElement = currentlySelected;

// }

// }



// function pasteElement() {

// if (!currentlySelected || !clipboard.html) {

// deselectAll();

// return;

// }



// try {

// const tempDiv = document.createElement('div');

// tempDiv.innerHTML = clipboard.html;

// const copiedElement = tempDiv.firstElementChild;



// if (copiedElement.classList.contains('building-column')) {

// if (!currentlySelected.classList.contains('building-column')) {

// alert('A column can only be pasted to overwrite another column. Please select a column.');

// return;

// }

// if (currentlySelected === clipboard.sourceElement) {

// alert('Cannot overwrite the same column. Please select a different column to replace.');

// return;

// }



// currentlySelected.insertAdjacentHTML('afterend', clipboard.html);

// const newElement = currentlySelected.nextElementSibling;

// currentlySelected.remove();

// selectBuildingBlock(newElement, newElement);

// return;

// }



// if (copiedElement.classList.contains('building-container')) {

// if (currentlySelected.classList.contains('building-container')) {

// currentlySelected.insertAdjacentHTML('afterend', clipboard.html);

// return;

// } else {

// alert('A building container can only be pasted after another container.');

// return;

// }

// }



// if (currentlySelected.classList.contains('building-column')) {

// const placeholder = currentlySelected.querySelector('.placeholder-block');

// if (placeholder) {

// placeholder.insertAdjacentHTML('beforebegin', clipboard.html);

// return;

// } else {

// currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);

// return;

// }

// } else {

// const parentColumn = currentlySelected.closest('.building-column');

// if (parentColumn) {

// if (currentlySelected.classList.contains('placeholder-block')) {

// alert('Cannot paste an element here. Please select the column to paste into, not the placeholder.');

// return;

// }

// currentlySelected.insertAdjacentHTML('afterend', clipboard.html);

// return;

// } else {

// alert('Content blocks can only be pasted inside a "building-column".');

// return;

// }

// }

// } finally {

// deselectAll();

// }

// }



// document.addEventListener("click", (e) => {

// const target = e.target;

// const uiElements = '.ql-container, .ql-toolbar, .ql-picker, .ql-tooltip, .ql-action, .text-editor-pop, .text-editor, .cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-sidebar';

// if (target.closest(uiElements)) return;



// const targetBlock = target.closest('.building-block');

// if (targetBlock) {

// selectBuildingBlock(targetBlock, target);

// } else {

// deselectAll();

// }

// });



// document.addEventListener("keydown", e => {

// // Ignore keystrokes inside editors

// if (e.target.closest('.text-editor-pop') || e.target.closest('.style-editor-sidebar')) {

// return;

// }



// const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)



// // Copy: Ctrl+C or Cmd+C

// if (isCtrl && e.key.toLowerCase() === 'c') {

// e.preventDefault();

// copyElement();

// return; // Stop further execution

// }



// // Paste: Ctrl+V or Cmd+V

// if (isCtrl && e.key.toLowerCase() === 'v') {

// e.preventDefault();

// pasteElement();

// return; // Stop further execution

// }



// if (currentlySelected) {

// e.preventDefault();

// if (e.key === 'ArrowUp') {

// const prev = currentlySelected.previousElementSibling;

// if (prev) currentlySelected.parentElement.insertBefore(currentlySelected, prev);

// } else if (e.key === 'ArrowDown') {

// const next = currentlySelected.nextElementSibling;

// if (next) currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);

// }

// }

// });



// deleteButton.addEventListener("click", deleteElement);



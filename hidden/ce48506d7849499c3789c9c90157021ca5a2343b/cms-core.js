const cms = document.querySelector(".cms-menu");
const styles = document.querySelector(".style-editor-pop");
const deleteButton = document.querySelector(".delete-element");
const loadedPage = document.querySelector("#loaded-page");

let currentlySelected = null;
let currentlyEditable = null;
let clipboardHTML = null; // Holds the copied element's HTML

function deselectAll() {
    currentlyEditable = null;

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
            currentlyEditable = null;
        }
    }
}

/**
 * Copies the outer HTML of the selected element to the clipboard string.
 */
function copyElement() {
    if (currentlySelected) {
        clipboardHTML = currentlySelected.outerHTML;
        console.log('Element HTML copied.');
    }
}

/**
 * Pastes the copied HTML right after the currently selected element.
 */
function pasteElement() {
    if (currentlySelected && clipboardHTML) {
        // 'afterend' inserts the new element immediately following the currentlySelected one.
        currentlySelected.insertAdjacentHTML('afterend', clipboardHTML);
        console.log('Element pasted after selected element.');
    }
}


document.addEventListener("click", (e) => {
    const target = e.target;
    const uiElements = '.ql-container, .ql-toolbar, .ql-picker, .ql-tooltip, .ql-action, .text-editor-pop, .text-editor, .cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-pop, .style-editor-container, .style-editor-item, .style-editor-title, .style-editor-input';
    if (target.closest(uiElements)) return;

    const targetBlock = target.closest('.building-block');
    if (targetBlock) {
        selectBuildingBlock(targetBlock, target);
    } else {
        deselectAll();
    }
});

document.addEventListener("keydown", e => {
    // Ignore keystrokes inside editors
    if (e.target.closest('.text-editor-pop') || e.target.closest('.style-editor-pop')) {
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

    if (currentlySelected && !currentlyEditable) {
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

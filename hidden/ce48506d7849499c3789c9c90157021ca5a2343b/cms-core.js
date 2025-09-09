const cms = document.querySelector(".cms-menu");
const styles = document.querySelector(".style-editor-pop");
const deleteButton = document.querySelector(".delete-element");
const loadedPage = document.querySelector("#loaded-page");

let currentlySelected = null;
let clipboardHTML = null; // Holds the copied element's HTML

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
        clipboardHTML = currentlySelected.outerHTML;
        currentlySelected.classList.add('selected');
        console.log('Element HTML copied.');
    }
}

function pasteElement() {
    if (currentlySelected && clipboardHTML) {

        if (
            currentlySelected.classList.contains('building-column')) {
            alert('Cannot paste a building column. The copied element must be within a building column.');
            return;
        }

        let whereToPaste = null;

        if (currentlySelected.classList.contains('building-container')) {
            whereToPaste = currentlySelected.closest('.building-container');
        } else if (currentlySelected.classList.contains('building-block')) {
            whereToPaste = currentlySelected.closest('.building-column');
        }

        if (whereToPaste) {
            currentlySelected.insertAdjacentHTML('afterend', clipboardHTML);
        } else {
            alert('Cannot paste here. The pasted element must be within a building column or a building layout.');
        }
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

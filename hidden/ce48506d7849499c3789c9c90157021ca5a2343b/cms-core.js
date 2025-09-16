const cms = document.querySelector(".cms-menu");
const styles = document.querySelector(".style-editor-sidebar");
const deleteButton = document.querySelector(".delete-element");
const loadedPage = document.querySelector("#loaded-page");

document.querySelectorAll('.building-block').forEach(block => {
  block.addEventListener('mouseenter', () => {
    block.classList.add('hovered');
  });
  block.addEventListener('mouseleave', () => {
    block.classList.remove('hovered');
  });
});

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

document.addEventListener("click", (e) => {
    const target = e.target;
    const uiElements = '.ql-container, .ql-toolbar, .ql-picker, .ql-tooltip, .ql-action, .text-editor-pop, .text-editor, .cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-sidebar';
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

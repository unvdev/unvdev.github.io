const cms = document.querySelector(".cms-menu");
const styles = document.querySelector(".style-editor-sidebar");
const deleteButton = document.getElementById("delete-element");
const saveButton = document.getElementById("save-and-copy");
const loadedPage = document.getElementById("loaded-page");

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

// NEW, CORRECTED HELPER FUNCTION
function formatHtml(node, level = 0, indentChar = '  ') {
    const inlineTags = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr']);
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

    let result = '';

    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            const tagName = node.nodeName.toLowerCase();
            const isInline = inlineTags.has(tagName);
            const indent = indentChar.repeat(level);

            // Add newline and indentation before block-level tags
            if (!isInline && level > 0) {
                result += '\n' + indent;
            }

            result += `<${tagName}`;
            for (const attr of node.attributes) {
                result += ` ${attr.name}="${attr.value}"`;
            }
            result += '>';

            if (!voidTags.has(tagName)) {
                let isEffectivelyEmpty = true;
                // Check if the element contains any non-whitespace children
                if (node.hasChildNodes()) {
                    for (const child of node.childNodes) {
                        if ((child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') || child.nodeType === Node.ELEMENT_NODE) {
                            isEffectivelyEmpty = false;
                            break;
                        }
                    }
                }

                if (!isEffectivelyEmpty) {
                    for (const child of node.childNodes) {
                        result += formatHtml(child, level + 1, indentChar);
                    }
                    if (!isInline) {
                        result += '\n' + indent;
                    }
                }
                result += `</${tagName}>`;
            }
            break;

        case Node.TEXT_NODE:
            const trimmedValue = node.nodeValue.trim();
            if (trimmedValue) {
                result += trimmedValue;
            }
            break;

        case Node.COMMENT_NODE:
            result += ``;
            break;
    }

    return result;
}

// THE CORRECTED savePage FUNCTION
async function savePage() {
    try {
        // 1. Create a temporary, in-memory copy of the document
        const originalHtml = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
        const parser = new DOMParser();
        const tempDoc = parser.parseFromString(originalHtml, 'text/html');

        // 2. Find and remove all unwanted elements
        const unwantedSelectors = [
            '[data-name="cms environment"]',
            '[data-name="cms stylesheet"]',
            '[data-name="cms javascript"]',
            '[id^="fa-"]',
            'link[href^="chrome-extension://"]'
        ].join(', ');

        const elementsToRemove = tempDoc.querySelectorAll(unwantedSelectors);
        elementsToRemove.forEach(element => element.remove());

        // 3. Convert the cleaned document back into a formatted HTML string
        // **FIX:** Start formatting from the <html> element, not the whole document.
        let formattedHtml = formatHtml(tempDoc.documentElement);

        // **FIX:** Prepend the DOCTYPE to the final string.
        const cleanedHtml = '<!DOCTYPE html>\n' + formattedHtml;

        // 4. Copy the final, formatted HTML to the clipboard
        await navigator.clipboard.writeText(cleanedHtml);
        
        console.log('Formatted page HTML copied to clipboard!');
        alert('Page HTML copied!');

    } catch (err) {
        console.error('Failed to copy HTML to clipboard:', err);
        alert('Could not copy HTML.');
    }
}

document.addEventListener("click", (e) => {
    const clickedElement = e.target;

    // Define the primary UI containers that should not trigger selection changes.
    // Clicks inside these elements are considered UI interactions and should be ignored here.
    const isInsideQuillUI = clickedElement.closest('.text-editor-pop');
    const isInsideCmsUI = clickedElement.closest('.cms-menu-container, .cms-menu-bar');
    const isInsideStyleEditor = clickedElement.closest('.style-editor-sidebar');

    // If the click is inside any of our main UI containers, stop further execution.
    if (isInsideQuillUI || isInsideCmsUI || isInsideStyleEditor) {
        return;
    }

    // If the click was not in a UI area, check if it was on a building block.
    const targetBuildingBlock = clickedElement.closest('.building-block');

    if (targetBuildingBlock) {
        // If a building block was clicked, select it.
        // The `selectBuildingBlock` function handles the specific logic.
        selectBuildingBlock(targetBuildingBlock, clickedElement);
    } else {
        // If the click was on the page background or another non-block element,
        // deselect whatever is currently active.
        deselectAll();
    }
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
saveButton.addEventListener("click", savePage);


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



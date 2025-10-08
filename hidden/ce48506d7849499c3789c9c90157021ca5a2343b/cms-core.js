const cms = document.querySelector(".cms-menu");
const cmsMenuBar = document.querySelector(".cms-menu-bar");
const styles = document.getElementById("style-editor-sidebar");
const styleButton = document.getElementById("style-element");
const deleteButton = document.getElementById("delete-element");
const moveUp = document.getElementById("move-element-up");
const moveDown = document.getElementById("move-element-down");
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
      loadedPage.classList.remove("sidebar-active");
      removeSelectionLabel();
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
   addSelectionLabel();
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

function addSelectionLabel() {
   const labelText = currentlySelected.dataset.name;
   if (!labelText) return; // Don't add a label if there's no data-name

   // To be safe, first remove any old label that might exist
   removeSelectionLabel(currentlySelected);

   const label = document.createElement('span');
   label.classList.add("selected-label");
   label.innerText = labelText;

   // Place the label right after the selected element in the HTML
   currentlySelected.after(label);

   positionSelectionLabel(currentlySelected, label);
}

function positionSelectionLabel(selectedElement, labelElement) {
   if (!selectedElement || !labelElement) return;
   labelElement.style.position = 'absolute';
   const offsetParent = labelElement.offsetParent || document.body;
   const selectedRect = selectedElement.getBoundingClientRect();
   const parentRect = offsetParent.getBoundingClientRect();
   const labelTop = selectedRect.top - parentRect.top;
   const targetCenter = selectedRect.left + (selectedRect.width / 2);
   const labelLeft = targetCenter - parentRect.left;

   labelElement.style.top = `${labelTop}px`;
   labelElement.style.left = `${labelLeft}px`;
   labelElement.style.transform = 'translate(-50%, -100%)';
}

function removeSelectionLabel() {
   const label = document.querySelector(".selected-label");
   // Check if the next sibling exists and is a label before removing
   if (label) {
      label.remove();
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

async function savePage() {
    deselectAll();

    // 1. Find the live wrapper element and store its context
    const liveWrapper = document.querySelector('#loaded-page');

    if (!liveWrapper) {
        console.error("#loaded-page not found in the live document. Cannot proceed.");
        alert("Error: Could not find the page content to save.");
        return;
    }

    const parent = liveWrapper.parentElement;
    const nextSibling = liveWrapper.nextSibling; // Remember where the wrapper was
    const children = Array.from(liveWrapper.childNodes); // Get a static list of its children

    let cleanedHtml = '';

    try {
        // --- 2. UNWRAP THE LIVE PAGE ---
        // You may see a brief visual flicker here. This is expected.
        children.forEach(child => parent.insertBefore(child, liveWrapper));
        liveWrapper.remove();

        // --- 3. COPY THE DOCUMENT NOW THAT IT'S UNWRAPPED ---
        const unwrappedHtmlString = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;

        // --- 4. PROCESS THE COPIED HTML (in memory) ---
        // All subsequent operations happen on the copy, not the live page.
        const parser = new DOMParser();
        const tempDoc = parser.parseFromString(unwrappedHtmlString, 'text/html');

        const unwantedSelectors = [
            '[data-name="cms environment"]',
            '[data-name="cms stylesheet"]',
            '[data-name="cms javascript"]',
            '[id^="fa-"]',
            'link[href^="chrome-extension://"]'
        ].join(', ');
        tempDoc.querySelectorAll(unwantedSelectors).forEach(el => el.remove());

        let formattedHtml = formatHtml(tempDoc.documentElement);
        cleanedHtml = '<!DOCTYPE html>\n' + formattedHtml;

    } catch (err) {
        console.error('An error occurred during the save process:', err);
        alert('An error occurred. Your page will now be restored.');
        // The 'finally' block will still run to restore the page.
    } finally {
        // --- 5. REWRAP THE LIVE PAGE ---
        // This block runs NO MATTER WHAT, ensuring the user's page is never left broken.
        
        // Re-insert the original wrapper exactly where it was
        parent.insertBefore(liveWrapper, nextSibling);
        
        // Move the original children back inside
        children.forEach(child => liveWrapper.appendChild(child));
        
        console.log("Live page has been restored to its original state.");
    }

    // --- 6. COPY THE FINAL STRING TO THE CLIPBOARD ---
    if (cleanedHtml) {
        try {
            await navigator.clipboard.writeText(cleanedHtml);
            console.log('Formatted page HTML copied to clipboard!');
            alert('Page HTML copied!');
        } catch (copyErr) {
            console.error('Failed to copy HTML to clipboard:', copyErr);
            alert('Could not copy HTML.');
        }
    }
}

document.addEventListener("click", (e) => {
   const target = e.target;

   // Define the primary UI containers that should not trigger selection changes.
   // Clicks inside these elements are considered UI interactions and should be ignored here.
   const isInsideQuillUI = target.closest('.text-editor-pop');
   const isInsideCmsUI = target.closest('.cms-menu');
   const isInsideCmsMenuBar = target.closest('.cms-menu-bar');
   const isInsideStyleEditor = target.closest('#style-editor-sidebar');

   // If the click is inside any of our main UI containers, stop further execution.
   if (isInsideQuillUI || isInsideCmsUI || isInsideStyleEditor) {
      return;
   }

   if (isInsideCmsMenuBar) {
      if (target !== moveUp && target !== moveDown) {
         return;
      } else {
         if (currentlySelected) {
            if (target === moveUp) {
               removeSelectionLabel();
               const prev = currentlySelected.previousElementSibling;
               if (prev) {
                  currentlySelected.parentElement.insertBefore(currentlySelected, prev);
               }

               addSelectionLabel();
            } else if (target === moveDown) {
               removeSelectionLabel();
               const next = currentlySelected.nextElementSibling;
               if (!next.classList.contains("placeholder-block")) {
                  currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
               } else {
                  addSelectionLabel();
                  return;
               }

               addSelectionLabel();
            }

         }

         return;
      }
   }

   // If the click was not in a UI area, check if it was on a building block.
   const targetBuildingBlock = target.closest('.building-block');

   if (targetBuildingBlock) {
      // If a building block was clicked, select it.
      // The `selectBuildingBlock` function handles the specific logic.
      selectBuildingBlock(targetBuildingBlock, target);
   } else {
      // If the click was on the page background or another non-block element,
      // deselect whatever is currently active.
      deselectAll();
   }
});

document.addEventListener("keydown", e => {

   const target = e.target;

   // Ignore keystrokes inside editors OR form fields
   if (
      target.closest('.text-editor-pop') ||
      target.closest('.style-editor-sidebar') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
   ) {
      return; // allow normal typing
   }

   const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)

   // Copy: Ctrl+C or Cmd+C
   if (isCtrl && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      copyElement();
      return;
   }

   // Paste: Ctrl+V or Cmd+V
   if (isCtrl && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      pasteElement();
      return;
   }

   if (currentlySelected) {
      if (e.key === 'ArrowUp') {
         e.preventDefault();
         removeSelectionLabel();
         const prev = currentlySelected.previousElementSibling;
         if (prev) {
            currentlySelected.parentElement.insertBefore(currentlySelected, prev);
         }

         addSelectionLabel();
      } else if (e.key === 'ArrowDown') {
         e.preventDefault();
         removeSelectionLabel();
         const next = currentlySelected.nextElementSibling;
         if (!next.classList.contains("placeholder-block")) {
            currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
         } else {
            addSelectionLabel();
            return;
         }

         addSelectionLabel();
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



//Text Element Buttons
const textElementHeadingOneButton = document.getElementById("text-element-heading-one-button");
const textElementHeadingTwoButton = document.getElementById("text-element-heading-two-button");
const textElementHeadingThreeButton = document.getElementById("text-element-heading-three-button");
const textElementHeadingFourButton = document.getElementById("text-element-heading-four-button");
const textElementHeadingFiveButton = document.getElementById("text-element-heading-five-button");
const textElementParagraphButton = document.getElementById("text-element-paragraph-button");
const textElementUnorderedButton = document.getElementById("text-element-unordered-button");
const textElementOrderedButton = document.getElementById("text-element-ordered-button");
//Layout Element Buttons
const layoutElementOneColumnButton = document.getElementById("layout-element-one-column-button");
const layoutElementTwoColumnButton = document.getElementById("layout-element-two-column-button");
const layoutElementThreeColumnButton = document.getElementById("layout-element-three-column-button");
const layoutElementFourColumnButton = document.getElementById("layout-element-four-column-button");
const layoutElementFiveColumnButton = document.getElementById("layout-element-five-column-button");
const layoutElementSixColumnButton = document.getElementById("layout-element-six-column-button");
const layoutElementAsymmLeftColumnButton = document.getElementById("layout-element-asymm-left-column-button");
const layoutElementAsymmRightColumnButton = document.getElementById("layout-element-asymm-right-column-button");
const layoutElementSpacerButton = document.getElementById("layout-element-spacer-button");
const layoutElementDividerButton = document.getElementById("layout-element-divider-button");
//Image Element Buttons
const imageElementLinkButton = document.getElementById("image-element-link-button");
const imageElementUploadButton = document.getElementById("image-element-upload-button");

//Element Functions
function insertElement(htmlContent) {
    if (currentlySelected) {
        currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
        cms.classList.add('content-hide');
        deselectAll();
    }
}

function insertImageLink(htmlContent) {
  if (currentlySelected) {
    currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);

    const insertedImage = currentlySelected.previousElementSibling.querySelector("img");
    const imageLink = grabImageLink();

    if (imageLink && insertedImage) {
      insertedImage.src = imageLink;
    }

    cms.classList.add("content-hide");
    deselectAll();
  }
}

async function insertImageUpload(htmlContent) {
  if (currentlySelected) {
    currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);

    const insertedImage = currentlySelected.previousElementSibling.querySelector("img");
    const imageUpload = await grabImageUpload();

    if (imageUpload && insertedImage) {
      insertedImage.src = imageUpload;
    }

    cms.classList.add("content-hide");
    deselectAll();
  }
}

function insertLayoutElement(htmlContent) {
    if (currentlySelected) {
        const allBuildingContainers = document.querySelectorAll(".building-container");

        if (allBuildingContainers.length > 0) {
            const lastBuildingContainer = allBuildingContainers[allBuildingContainers.length - 1];
            lastBuildingContainer.insertAdjacentHTML('afterend', htmlContent);
        } else {
            console.warn("No '.building-container' found.");
            return;
        }

        cms.classList.add('content-hide');
        deselectAll();
    }
}

// Utilities
function grabImageLink() {
  const link = prompt("Enter a photo link:");
  const imageRegex = /\.(jpe?g|png|gif|webp|svg)(\?.*)?(#.*)?$/i;

  if (link && imageRegex.test(link)) {
    return link;
  } else if (link) {
    alert("Please enter a valid image URL (jpg, png, gif, webp, svg).");
  }

  return null;
}

function grabImageUpload() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";

    input.onchange = () => {
      const file = input.files[0];
      if (!file) {
        resolve(null);
        return;
      }

      // SVG: return as-is
      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let { width, height } = img;

          // Scale down if too large
          const maxDimension = 1200;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height *= maxDimension / width;
              width = maxDimension;
            } else {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          let mimeType = file.type;
          let quality = 0.85;

          // Create base64
          let base64 = canvas.toDataURL(mimeType, quality);

          // Reduce quality silently until under 2MB
          const maxSizeBytes = 2 * 1024 * 1024;
          while (base64.length * 0.75 > maxSizeBytes && quality > 0.4) {
            quality -= 0.05;
            base64 = canvas.toDataURL(mimeType, quality);
          }

          resolve(base64);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    };

    input.click();
  });
}

//Text Element Event Listeners
textElementHeadingOneButton.addEventListener('click', () => insertElement(headingOne));
textElementHeadingTwoButton.addEventListener('click', () => insertElement(headingTwo));
textElementHeadingThreeButton.addEventListener('click', () => insertElement(headingThree));
textElementHeadingFourButton.addEventListener('click', () => insertElement(headingFour));
textElementHeadingFiveButton.addEventListener('click', () => insertElement(headingFive));
textElementParagraphButton.addEventListener('click', () => insertElement(paragraph));
textElementUnorderedButton.addEventListener('click', () => insertElement(unorderedList));
textElementOrderedButton.addEventListener('click', () => insertElement(orderedList));
//Layout Element Event Listeners
layoutElementOneColumnButton.addEventListener('click', () => insertLayoutElement(oneColumn));
layoutElementTwoColumnButton.addEventListener('click', () => insertLayoutElement(twoColumns));
layoutElementThreeColumnButton.addEventListener('click', () => insertLayoutElement(threeColumns));
layoutElementFourColumnButton.addEventListener('click', () => insertLayoutElement(fourColumns));
layoutElementFiveColumnButton.addEventListener('click', () => insertLayoutElement(fiveColumns));
layoutElementSixColumnButton.addEventListener('click', () => insertLayoutElement(sixColumns));
layoutElementAsymmLeftColumnButton.addEventListener('click', () => insertLayoutElement(asymmLeftColumn));
layoutElementAsymmRightColumnButton.addEventListener('click', () => insertLayoutElement(asymmRightColumn));
layoutElementSpacerButton.addEventListener('click', () => insertElement(spacer));
layoutElementDividerButton.addEventListener('click', () => insertElement(divider));
//Image Element Event Listeners
imageElementLinkButton.addEventListener('click', () => insertImageLink(image));
imageElementUploadButton.addEventListener('click', () => insertImageUpload(image));

//Open The CMS Menu
function invokeCMSMenu() {
    if (currentlySelected && currentlySelected.classList.contains('placeholder-block')) {
        cms.classList.remove('content-hide');
    }
}

//Open The Styles Menu
function invokeStyleMenu() {
    if (currentlySelected) {
        document.querySelector(".style-editor-sidebar").classList.remove('content-hide');
        loadStylesFromSelected();
    }
}

// === STYLE EDITOR LOGIC ===
// Background color input
const backgroundColorInput = document.getElementById("style-editor-bg-color-input");
const backgroundColorValueSpan = document.getElementById("style-editor-bg-color-input-value");

// Border inputs
const borderColorInput = document.getElementById("style-editor-border-color-input");
const borderColorValueSpan = document.getElementById("style-editor-border-color-input-value");
const borderWidthInput = document.getElementById("style-editor-border-width-input");
const borderRadiusInput = document.getElementById("style-editor-border-radius-input");

// Width input
const widthInput = document.getElementById("style-editor-width-input");

// Alignment buttons
const alignLeft = document.getElementById("style-editor-align-left-button");
const alignCenter = document.getElementById("style-editor-align-center-button");
const alignRight = document.getElementById("style-editor-align-right-button");
const alignTop = document.getElementById("style-editor-align-top-button");
const alignMiddle = document.getElementById("style-editor-align-middle-button");
const alignBottom = document.getElementById("style-editor-align-bottom-button");

// Padding inputs
const paddingTopInput = document.getElementById("style-editor-padding-top-input");
const paddingLeftInput = document.getElementById("style-editor-padding-left-input");
const paddingRightInput = document.getElementById("style-editor-padding-right-input");
const paddingBottomInput = document.getElementById("style-editor-padding-bottom-input");

// Margin inputs
const marginTopInput = document.getElementById("style-editor-margin-top-input");
const marginLeftInput = document.getElementById("style-editor-margin-left-input");
const marginRightInput = document.getElementById("style-editor-margin-right-input");
const marginBottomInput = document.getElementById("style-editor-margin-bottom-input");

// ===============================
// HELPERS
// ===============================
function parsePercent(value, fallback = 100) {
  const match = value.match(/([\d.]+)%/);
  return match ? parseFloat(match[1]) : fallback;
}

function parsePx(value, fallback = 0) {
  const match = value.match(/([\d.]+)px/);
  return match ? parseFloat(match[1]) : fallback;
}

// ===============================
// BACKGROUND COLOR
// ===============================
backgroundColorInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.style.backgroundColor = backgroundColorInput.value;
  }
  if (backgroundColorValueSpan) {
    backgroundColorValueSpan.textContent = backgroundColorInput.value.toUpperCase();
  }
});

// ===============================
// BORDER INPUTS
// ===============================
borderColorInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.style.borderColor = borderColorInput.value;
  }
  if (borderColorValueSpan) {
    borderColorValueSpan.textContent = borderColorInput.value.toUpperCase();
  }
});

borderWidthInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let value = parseInt(borderWidthInput.value) || 0;
    currentlySelected.style.borderWidth = value + "px";
    currentlySelected.style.borderStyle = value > 0 ? "solid" : "none"; // ensure visible border
  }
});

borderRadiusInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let value = parseInt(borderRadiusInput.value) || 0;
    currentlySelected.style.borderRadius = value + "px";
  }
});

// ===============================
// WIDTH CONTROL (direct input)
// ===============================
widthInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let width = parseFloat(widthInput.value) || 100;
    width = Math.max(5, Math.min(100, width));
    currentlySelected.style.maxWidth = width + "%";
  }
});

// ===============================
// ALIGNMENT
// ===============================
alignLeft.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-center", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-left");
  }
});

alignCenter.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-center");
  }
});

alignRight.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-center");
    currentlySelected.classList.add("building-block-align-right");
  }
});

alignTop.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-center", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-top");
  }
});

alignMiddle.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-center");
  }
});

alignBottom.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-center");
    currentlySelected.classList.add("building-column-content-bottom");
  }
});

// ===============================
// PADDING INPUTS
// ===============================
function updatePaddingInput(side, inputEl) {
  inputEl.addEventListener("input", () => {
    if (currentlySelected) {
      currentlySelected.classList.add("custom-styles");
      let value = parseInt(inputEl.value) || 0;
      currentlySelected.style[`padding${side}`] = Math.max(0, value) + "px";
    }
  });
}

updatePaddingInput("Top", paddingTopInput);
updatePaddingInput("Left", paddingLeftInput);
updatePaddingInput("Right", paddingRightInput);
updatePaddingInput("Bottom", paddingBottomInput);

// ===============================
// MARGIN INPUTS
// ===============================
function updateMarginInput(side, inputEl) {
  inputEl.addEventListener("input", () => {
    if (currentlySelected) {
      currentlySelected.classList.add("custom-styles");
      let value = parseInt(inputEl.value) || 0;
      currentlySelected.style[`margin${side}`] = value + "px";
    }
  });
}

updateMarginInput("Top", marginTopInput);
updateMarginInput("Left", marginLeftInput);
updateMarginInput("Right", marginRightInput);
updateMarginInput("Bottom", marginBottomInput);

// Helper: Convert "rgb(r,g,b)" or "rgba(r,g,b,a)" to "#rrggbb"
function rgbToHex(rgb) {
  if (!rgb) return "#000000";
  const result = rgb.match(/\d+/g);
  if (!result) return "#000000";

  let [r, g, b] = result;
  r = parseInt(r).toString(16).padStart(2, "0");
  g = parseInt(g).toString(16).padStart(2, "0");
  b = parseInt(b).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}

// ===============================
// LOAD STYLES FROM SELECTED ELEMENT
// ===============================
function loadStylesFromSelected() {
  if (!currentlySelected) return;
  const computed = window.getComputedStyle(currentlySelected);

  // Background
  backgroundColorInput.value = rgbToHex(computed.backgroundColor);
  if (backgroundColorValueSpan) backgroundColorValueSpan.textContent = rgbToHex(computed.backgroundColor).toUpperCase();

  // Width
  if (currentlySelected.style.maxWidth && currentlySelected.style.maxWidth.includes("%")) {
    widthInput.value = parseFloat(currentlySelected.style.maxWidth);
  } else {
    const parentWidth = currentlySelected.parentElement?.offsetWidth || 1;
    const actualWidth = currentlySelected.offsetWidth;
    widthInput.value = Math.round((actualWidth / parentWidth) * 100);
  }

  // Padding
  paddingTopInput.value = parseInt(computed.paddingTop) || 0;
  paddingLeftInput.value = parseInt(computed.paddingLeft) || 0;
  paddingRightInput.value = parseInt(computed.paddingRight) || 0;
  paddingBottomInput.value = parseInt(computed.paddingBottom) || 0;

  // Margin
  marginTopInput.value = parseInt(computed.marginTop) || 0;
  marginLeftInput.value = parseInt(computed.marginLeft) || 0;
  marginRightInput.value = parseInt(computed.marginRight) || 0;
  marginBottomInput.value = parseInt(computed.marginBottom) || 0;

  // Border
  if (borderColorInput) borderColorInput.value = rgbToHex(computed.borderColor);
  if (borderColorValueSpan) borderColorValueSpan.textContent = rgbToHex(computed.borderColor).toUpperCase();
  if (borderWidthInput) borderWidthInput.value = parseInt(computed.borderWidth) || 0;
  if (borderRadiusInput) borderRadiusInput.value = parseInt(computed.borderRadius) || 0;
}

// ===============================
// SHIFT + A + CLICK trigger
// ===============================
let shiftHeld = false;
let aHeld = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Shift") shiftHeld = true;
    if (e.key.toLowerCase() === "a") aHeld = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") shiftHeld = false;
    if (e.key.toLowerCase() === "a") aHeld = false;
});

document.addEventListener("click", (e) => {
    if (shiftHeld && aHeld) {
        if (currentlySelected) {
            currentlySelected.classList.add("custom-styles"); // mark element when opening style menu
            invokeStyleMenu();
        }
    }
});
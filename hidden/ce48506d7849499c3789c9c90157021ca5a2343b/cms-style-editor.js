//Open The Styles Menu
function invokeStyleMenu() {
    if (currentlySelected) {
        styles.classList.remove('content-hide');
        loadedPage.classList.add("sidebar-active");
        checkRestrictedControls();
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

// Image Options
const imageDefault = document.getElementById("style-editor-image-default-button");
const imageCrop = document.getElementById("style-editor-image-crop-button");
const imageWidthInput = document.getElementById("style-editor-crop-width-input");
const imageHeightInput = document.getElementById("style-editor-crop-height-input");
const imagePositionInput = document.getElementById("style-editor-crop-position-input");

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
  console.log("Fake widthInput ran.");
    if (currentlySelected) {
        currentlySelected.classList.add("custom-styles");
        let uiPercent = parseFloat(widthInput.value) || 100;
        uiPercent = Math.max(5, Math.min(100, uiPercent));
        widthInput.value = uiPercent;

        if (uiPercent >= 100) {
            currentlySelected.style.width = "";
        } else {
            currentlySelected.style.width = `calc(${uiPercent}% - 2rem)`; //fake percentage
        }
    }
});

// ===============================
// IMAGE WIDTH CONTROL (direct input)
// ===============================
imageWidthInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let width = parseFloat(imageWidthInput.value) || 100;
    width = Math.max(10, Math.min(2000, width));
    currentlySelected.style.width = width + "px";
  }
});

// ===============================
// IMAGE HEIGHT CONTROL (direct input)
// ===============================
imageHeightInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let height = parseFloat(imageHeightInput.value) || 100;
    height = Math.max(10, Math.min(2000, height));
    currentlySelected.style.height = height + "px";
  }
});

// ===============================
// IMAGE POSITION CONTROL (direct input)
// ===============================
imagePositionInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let position = parseFloat(imagePositionInput.value) || 100;
    position = Math.max(5, Math.min(100, position));
    currentlySelected.style.objectPosition = position + "%";
  }
});

//
// ALIGNMENT
// Utility: mark the right button active
function highlightActiveControls() {
  if (!currentlySelected) return;

  // Clear old actives
  [alignLeft, alignCenter, alignRight, alignTop, alignMiddle, alignBottom, imageCrop, imageDefault]
    .forEach(btn => btn.classList.remove("active"));

  // Horizontal
  if (currentlySelected.classList.contains("building-block-align-left")) {
    alignLeft.classList.add("active");
  } else if (currentlySelected.classList.contains("building-block-align-center")) {
    alignCenter.classList.add("active");
  } else if (currentlySelected.classList.contains("building-block-align-right")) {
    alignRight.classList.add("active");
  }

  // Vertical
  if (currentlySelected.classList.contains("building-column-content-top")) {
    alignTop.classList.add("active");
  } else if (currentlySelected.classList.contains("building-column-content-center")) {
    alignMiddle.classList.add("active");
  } else if (currentlySelected.classList.contains("building-column-content-bottom")) {
    alignBottom.classList.add("active");
  }

  // Image
  if (currentlySelected.classList.contains("crop-image")) {
    imageCrop.classList.add("active");
  } else if (currentlySelected.classList.contains("default-image")) {
    imageDefault.classList.add("active");
  }
}

// Wrap existing button handlers so they also highlight
function wrapWithHighlight(fn) {
  return () => {
    fn();
    highlightActiveControls();
  };
}

// Replace your listeners with wrapped ones
alignLeft.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-center", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-left");
  }
}));

alignCenter.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-center");
  }
}));

alignRight.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-center");
    currentlySelected.classList.add("building-block-align-right");
  }
}));

alignTop.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-center", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-top");
  }
}));

alignMiddle.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-center");
  }
}));

alignBottom.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-center");
    currentlySelected.classList.add("building-column-content-bottom");
  }
}));

imageCrop.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("default-image");
    currentlySelected.classList.add("crop-image");
  }
}));

imageDefault.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("crop-image");
    currentlySelected.classList.add("default-image");
  }
}));

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

// Helper: Convert "rgb(r,g,b)" or "rgba(r,g,b,a)" to "#rrggbb"
function rgbToHex(rgb) {
    if (!rgb || rgb === "none" || rgb === "transparent") return "#FFFFFF";
    const result = rgb.match(/\d+/g);
    if (!result) return "#000000";
    let [r, g, b] = result.slice(0, 3);
    r = parseInt(r).toString(16).padStart(2, "0");
    g = parseInt(g).toString(16).padStart(2, "0");
    b = parseInt(b).toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}

// Helper: Convert the fake width back to the live document width
function getRealWidthPercent() {
    if (!currentlySelected) return 100;

    const styleWidth = currentlySelected.style.width;
    if (!styleWidth) return 100; // Default to 100 if no style is set

    // Try to find a calc() value, e.g., "calc(80% - 2rem)"
    const calcMatch = styleWidth.match(/calc\((\d*\.?\d+)%/);
    if (calcMatch && calcMatch[1]) {
        return parseFloat(calcMatch[1]);
    }

    // Fallback for simple percentages like "80%"
    if (styleWidth.includes("%")) {
        return parseFloat(styleWidth);
    }

    return 100; // Fallback
}

// Publish real width to the document
function applyRealWidthPercent() {
  console.log("styleEditorHelper ran.");
    if (currentlySelected) {
        const realPercent = getRealWidthPercent();

        if (realPercent >= 100) {
            currentlySelected.style.width = "";
        } else {
            currentlySelected.style.width = `${realPercent}%`;
        }
    }
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
    
    // Width (Loads real value, applies fake style)
    console.log("realPercent Converter ran.");
    const realPercent = getRealWidthPercent();
    widthInput.value = realPercent;

    if (realPercent >= 100) {
      currentlySelected.style.width = "";
    } else {
      currentlySelected.style.width = `calc(${realPercent}% - 2rem)`;
    }

    highlightActiveControls();

    // Padding
    paddingTopInput.value = parseInt(computed.paddingTop) || 0;
    paddingLeftInput.value = parseInt(computed.paddingLeft) || 0;
    paddingRightInput.value = parseInt(computed.paddingRight) || 0;
    paddingBottomInput.value = parseInt(computed.paddingBottom) || 0;

    // Border
    if (borderColorInput) borderColorInput.value = rgbToHex(computed.borderColor);
    if (borderColorValueSpan) borderColorValueSpan.textContent = rgbToHex(computed.borderColor).toUpperCase();
    if (borderWidthInput) borderWidthInput.value = parseInt(computed.borderWidth) || 0;
    if (borderRadiusInput) borderRadiusInput.value = parseInt(computed.borderRadius) || 0;

    if (currentlySelected.classList.contains("image-element")) {
        const computedStyle = window.getComputedStyle(currentlySelected);
        imageWidthInput.value = Math.round(parseFloat(computedStyle.width));
        imageHeightInput.value = Math.round(parseFloat(computedStyle.height));

        const objectPositionValue = computedStyle.objectPosition;
        const positionX = objectPositionValue.split(' ')[0];
        imagePositionInput.value = parseFloat(positionX) || 50;
    }
}

function checkRestrictedControls() {
  const verticalAlignControls = document.getElementById("style-editor-vertical-align-controls");
  const imageControls = document.getElementById("style-editor-image-controls");
  const imageCropControls = document.getElementById("style-editor-image-crop-controls")
  if (!verticalAlignControls || !imageControls) return;

  if (currentlySelected?.classList.contains("building-column")) {
    verticalAlignControls.classList.remove("content-hide");
  } else {
    verticalAlignControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("image-element")) {
    imageControls.classList.remove("content-hide");
  } else {
    imageControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("crop-image")) {
    imageCropControls.classList.remove("content-hide");
  } else {
    imageCropControls.classList.add("content-hide");
  }
}

// Custom Event Listeners
imageDefault.addEventListener("click", () => {
    const imageElement = currentlySelected;
    imageElement.removeAttribute('style');
    setTimeout(checkRestrictedControls, 0);
});

imageCrop.addEventListener("click", () => {
    setTimeout(checkRestrictedControls, 0);
});

// Open Styles Menu
styleButton.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    invokeStyleMenu();
  }
});

// ===============================
// s and button triggers
// ===============================

document.addEventListener("keydown", (e) => {
  const isStyleEditorVisible = window.getComputedStyle(styles).display !== "none";
  const isTextEditorVisible = window.getComputedStyle(editorPop).display !== "none";
  if (isTextEditorVisible || isStyleEditorVisible) return;
  e.preventDefault();
  if (e.key === 's') {
        if (currentlySelected) {
            currentlySelected.classList.add("custom-styles");
            invokeStyleMenu();
        }
    }
});

widthInput.addEventListener('blur', () => {
  applyRealWidthPercent();
});
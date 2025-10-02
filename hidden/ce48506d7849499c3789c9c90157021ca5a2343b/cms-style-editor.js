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

// Margin inputs
const marginTopInput = document.getElementById("style-editor-margin-top-input");
const marginLeftInput = document.getElementById("style-editor-margin-left-input");
const marginRightInput = document.getElementById("style-editor-margin-right-input");
const marginBottomInput = document.getElementById("style-editor-margin-bottom-input");

// Image Options
const imageDefault = document.getElementById("style-editor-image-default-button");
const imageStretch = document.getElementById("style-editor-image-stretch-button");

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

//
// ALIGNMENT
// Utility: mark the right button active
function highlightActiveControls() {
  if (!currentlySelected) return;

  // Clear old actives
  [alignLeft, alignCenter, alignRight, alignTop, alignMiddle, alignBottom, imageStretch, imageDefault]
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
  if (currentlySelected.classList.contains("stretch-image")) {
    imageStretch.classList.add("active");
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

imageStretch.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.firstElementChild.classList.add("custom-styles");
    currentlySelected.firstElementChild.classList.remove("default-image");
    currentlySelected.firstElementChild.classList.add("stretch-image");
  }
}));

imageDefault.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.firstElementChild.add("custom-styles");
    currentlySelected.firstElementChild.remove("stretch-image");
    currentlySelected.firstElementChild.add("default-image");
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

  // Segmented Buttons
  highlightActiveControls();

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

function checkRestrictedControls() {
  const verticalAlignControls = document.getElementById("style-editor-vertical-align-controls");
  const imageControls = document.getElementById("style-editor-image-controls");
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
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
        document.querySelector(".style-editor-pop").classList.remove('content-hide');
    }
}

// === STYLE EDITOR LOGIC ===

// Background color button
const backgroundColorButton = document.getElementById("style-editor-background-color-button");

// Width buttons
const widthDecreaseBtn = document.getElementById("style-editor-width-decrease-button");
const widthIncreaseBtn = document.getElementById("style-editor-width-increase-button");

// Alignment buttons
const alignLeft = document.getElementById("style-editor-align-left-button");
const alignCenter = document.getElementById("style-editor-align-center-button");
const alignRight = document.getElementById("style-editor-align-right-button");

// Padding buttons (increase/decrease)
const paddingLeftIncreaseBtn = document.getElementById("style-editor-padding-left-increase-button");
const paddingLeftDecreaseBtn = document.getElementById("style-editor-padding-left-decrease-button");
const paddingRightIncreaseBtn = document.getElementById("style-editor-padding-right-increase-button");
const paddingRightDecreaseBtn = document.getElementById("style-editor-padding-right-decrease-button");
const paddingTopIncreaseBtn = document.getElementById("style-editor-padding-top-increase-button");
const paddingTopDecreaseBtn = document.getElementById("style-editor-padding-top-decrease-button");
const paddingBottomIncreaseBtn = document.getElementById("style-editor-padding-bottom-increase-button");
const paddingBottomDecreaseBtn = document.getElementById("style-editor-padding-bottom-decrease-button");

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

function updatePadding(side, delta) {
    if (!currentlySelected) return;
    const computed = window.getComputedStyle(currentlySelected);
    let current = parsePx(computed[`padding${side}`]);
    currentlySelected.style[`padding${side}`] = Math.max(0, current + delta) + "px"; // prevent negative padding
}

// ===============================
// BACKGROUND COLOR
// ===============================
backgroundColorButton.addEventListener("click", () => {
    if (currentlySelected) {
        const color = prompt("Enter a hex color code (e.g., #ff00ff):");
        if (!color) {
            // If user entered nothing or cancelled, remove background color
            currentlySelected.style.backgroundColor = "";
        } else if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
            currentlySelected.style.backgroundColor = color;
        } else {
            alert("Invalid hex code.");
        }
    }
});
// ===============================
// WIDTH CONTROL (percentage)
// ===============================
widthDecreaseBtn.addEventListener("click", () => {
    if (currentlySelected) {
        let currentWidth = parsePercent(currentlySelected.style.maxWidth || "100%");
        currentWidth = Math.max(5, currentWidth - 5); 
        currentlySelected.style.maxWidth = currentWidth + "%";
    }
});

widthIncreaseBtn.addEventListener("click", () => {
    if (currentlySelected) {
        let currentWidth = parsePercent(currentlySelected.style.maxWidth || "100%");
        currentWidth = Math.min(100, currentWidth + 5); 
        currentlySelected.style.maxWidth = currentWidth + "%";
    }
});

// ===============================
// ALIGNMENT
// ===============================
alignLeft.addEventListener("click", () => {
    if (currentlySelected) {
        currentlySelected.classList.remove("building-block-align-center", "building-block-align-right");
        currentlySelected.classList.add("building-block-align-left");
    }
});

alignCenter.addEventListener("click", () => {
    if (currentlySelected) {
        currentlySelected.classList.remove("building-block-align-left", "building-block-align-right");
        currentlySelected.classList.add("building-block-align-center");
    }
});

alignRight.addEventListener("click", () => {
    if (currentlySelected) {
        currentlySelected.classList.remove("building-block-align-left", "building-block-align-center");
        currentlySelected.classList.add("building-block-align-right");
    }
});

// ===============================
// PADDING CONTROL (increase/decrease by 10px)
// ===============================
paddingLeftIncreaseBtn.addEventListener("click", () => updatePadding("Left", 10));
paddingLeftDecreaseBtn.addEventListener("click", () => updatePadding("Left", -10));
paddingRightIncreaseBtn.addEventListener("click", () => updatePadding("Right", 10));
paddingRightDecreaseBtn.addEventListener("click", () => updatePadding("Right", -10));
paddingTopIncreaseBtn.addEventListener("click", () => updatePadding("Top", 10));
paddingTopDecreaseBtn.addEventListener("click", () => updatePadding("Top", -10));
paddingBottomIncreaseBtn.addEventListener("click", () => updatePadding("Bottom", 10));
paddingBottomDecreaseBtn.addEventListener("click", () => updatePadding("Bottom", -10));

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
            invokeStyleMenu();
        }
    }
});
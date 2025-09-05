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

//Testing
const backgroundColorInput = document.getElementById('style-editor-background-color');
const backgroundColorButton = document.getElementById('style-editor-background-color-button');

// Get the input and button for Width
const widthInput = document.getElementById('style-editor-width');
const widthButton = document.getElementById('style-editor-width-button');

// Get the input and button for Height
const heightInput = document.getElementById('style-editor-height');
const heightButton = document.getElementById('style-editor-height-button');

// Get the input and button for Padding
const paddingTopInput = document.getElementById('style-editor-padding-top');
const paddingBottomInput = document.getElementById('style-editor-padding-bottom');
const paddingLeftInput = document.getElementById('style-editor-padding-left');
const paddingRightInput = document.getElementById('style-editor-padding-right');
const paddingButton = document.getElementById('style-editor-padding-button');

function getElementAttributes() {
    // Make sure an element has been selected
    if (currentlySelected) {
      if (!currentlySelected.classList.contains("custom-styles")) {
            currentlySelected.classList.add("custom-styles");
      }
        // Get the collection of all computed styles for the element
        const computedStyle = window.getComputedStyle(currentlySelected);

        // Extract the specific styles we care about
        const backgroundColor = computedStyle.backgroundColor;
        const width = computedStyle.width;
        const height = computedStyle.height;
        const paddingTop = computedStyle.paddingTop;
        const paddingBottom = computedStyle.paddingBottom;
        const paddingLeft = computedStyle.paddingLeft;
        const paddingRight = computedStyle.paddingRight;

        // Set the value of the input fields to match the element's styles
        backgroundColorInput.value = backgroundColor;
        widthInput.value = width;
        heightInput.value = height;
        paddingTopInput.value = paddingTop;
        paddingBottomInput.value = paddingBottom;
        paddingLeftInput.value = paddingLeft;
        paddingRightInput.value = paddingRight;
    }
}

// Listen for a standard 'click' event on the entire document
document.addEventListener("click", (e) => {
    // Check if the Shift key was held down during the click
    if (e.shiftKey) {
        if (currentlySelected) {
            invokeStyleMenu();
            getElementAttributes();
        }
    }
});

backgroundColorButton.addEventListener('click', () => {
    if (currentlySelected) {
        currentlySelected.style.backgroundColor = backgroundColorInput.value;
    }
});

// Add a click event listener to the width button
widthButton.addEventListener('click', () => {
    if (currentlySelected) {
        currentlySelected.style.width = widthInput.value;
    }
});

// Add a click event listener to the height button
heightButton.addEventListener('click', () => {
    if (currentlySelected) {
        currentlySelected.style.height = heightInput.value;
    }
});

// Add a click event listener to the padding button
paddingButton.addEventListener('click', () => {
    if (currentlySelected) {
        currentlySelected.style.margin = `${paddingTopInput.value} ${paddingRightInput.value} ${paddingBottomInput.value} ${paddingLeftInput.value}`;
    }
});